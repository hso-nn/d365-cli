import express from 'express';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import open from 'open';
import {Express} from 'express';
import session, {Session, SessionOptions} from 'express-session';
import * as http from 'http';
import {Socket} from 'net';
import * as fs from 'fs';
import {Request, Response} from 'express-serve-static-core';
import {CrmJson} from '../root/CrmJson';
import {
    AuthorizationCodeRequest,
    Configuration,
    CryptoProvider, ICachePlugin,
    LogLevel,
    PublicClientApplication
} from '@azure/msal-node';
import {AuthorizationUrlRequest} from '@azure/msal-node/dist/request/AuthorizationUrlRequest';
import shell from 'shelljs';

type RequestWithPKCE = Request & {
    session: Session & {
        pkceCodes: {
            challengeMethod: string,
            challenge?: string,
            verifier?: string
        }
    }
};

export class MsalRouter {
    public express: Express;
    protected httpServer: http.Server;
    protected sockets: Socket[] = [];
    protected settings: CrmJson = JSON.parse(fs.readFileSync('../crm.json', 'utf8'));
    protected bearer: string;
    private pca: PublicClientApplication;

    constructor() {
        this.init().then();
    }

    // eslint-disable-next-line max-lines-per-function
    private async init(): Promise<void> {
        this.pca = this.initPublicClientApplication();
        this.bearer = await this.getCachedToken();
        if (this.bearer) {
            await this.onAuthenticated();
        } else {
            this.acquireToken();
        }
    }

    private async getCachedToken(): Promise<string> {
        const tokenCache = this.pca.getTokenCache();
        if (!tokenCache.hasChanged()) {
            const accounts = await tokenCache.getAllAccounts();
            if (accounts.length === 1) {
                try {
                    const authenticationResult = await this.pca.acquireTokenSilent({
                        account: accounts[0],
                        scopes: [`${this.settings.crm.url}/.default`],
                    });
                    return authenticationResult.accessToken;
                } catch (e) {
                    console.log(e.message);
                }
            }
        }
    }

    private initPublicClientApplication(): PublicClientApplication {
        const tenant = this.settings.msal.tenant ? this.settings.msal.tenant : 'common/';
        const msalConfig: Configuration = {
            auth: {
                clientId: this.settings.msal.clientId,
                authority: 'https://login.microsoftonline.com/' + tenant
            },
            cache: {
                cachePlugin: MsalRouter.getCachePlugin(),
            },
            system: {
                loggerOptions: {
                    loggerCallback(loglevel: LogLevel, message: string, containsPii: boolean) {
                        if (containsPii) {
                            console.log(containsPii);
                        }
                        console.log(message);
                    },
                    piiLoggingEnabled: false,
                    logLevel: LogLevel.Verbose,
                }
            }
        };
        return new PublicClientApplication(msalConfig);
    }

    private static getCachePlugin(): ICachePlugin {
        if (!fs.existsSync('./.msalcache.json')) {
            shell.cp('-R', `${__dirname}/root/Webresources/.msalcache.json`, '.');
        }
        const cachePath = './.msalcache.json';
        return {
            beforeCacheAccess: async (cacheContext) => {
                cacheContext.tokenCache.deserialize(fs.readFileSync(cachePath, 'utf-8'));
            },
            afterCacheAccess: async (cacheContext) => {
                if (cacheContext.cacheHasChanged) {
                    fs.writeFileSync(cachePath, cacheContext.tokenCache.serialize());
                }
            }
        };
    }

    private acquireToken(): void {
        this.express = express();
        const {publisher_prefix, namespace} = this.settings.crm;
        const sessionConfig: SessionOptions = {
            secret: `${publisher_prefix}${namespace}`,
            resave: false,
            saveUninitialized: false,
            cookie: {
                httpOnly: true,
            },
            name: 'id'
        };
        if (this.express.get('env') === 'production') {
            this.express.set('trust proxy', 1);
            sessionConfig.cookie.secure = true;
        }
        this.express.set('trust proxy', 1);
        this.express.use(session(sessionConfig));
        this.mountRoutes();
        this.startListen();
    }

    private startListen(): void {
        const redirectUriSplit = this.settings.msal.redirectUri.split('/');
        const portSplit = redirectUriSplit[redirectUriSplit.length -2].split(':');
        const port = parseInt(portSplit[1]);
        const openUrl = redirectUriSplit.slice(0, redirectUriSplit.length - 1).join('/');
        this.httpServer = this.express.listen(port, async () => {
            await open(openUrl);
            return console.log(`server is listening on ${port}`);
        });
        this.httpServer.on('connection', (socket: Socket) => {
            this.sockets.push(socket);
        });
    }

    protected mountRoutes() {
        this.mountDefaultRoute();
        this.mountRedirectRoute();
        return;
    }

    private mountDefaultRoute(): void {
        this.express.get('/', async (req: RequestWithPKCE, res: Response) => {
            const cryptoProvider = new CryptoProvider();
            const pkceCodes = await cryptoProvider.generatePkceCodes();
            const {verifier, challenge} = pkceCodes;
            // create session object if it does not exist
            if (!req.session.pkceCodes) {
                req.session.pkceCodes = {
                    challengeMethod: 'S256'
                };
            }
            // Set generated PKCE Codes as session vars
            req.session.pkceCodes.verifier = verifier;
            req.session.pkceCodes.challenge = challenge;

            // Add PKCE code challenge and challenge method to authCodeUrl request objectgit st
            const authCodeUrlParameters: AuthorizationUrlRequest = {
                redirectUri: this.settings.msal.redirectUri,
                scopes: [`${this.settings.crm.url}/.default`],
                codeChallenge: req.session.pkceCodes.challenge, // PKCE Code Challenge
                codeChallengeMethod: req.session.pkceCodes.challengeMethod, // PKCE Code Challenge Method
            };
            // Get url to sign user in and consent to scopes needed for application
            try {
                const authRequestUrl = await this.pca.getAuthCodeUrl(authCodeUrlParameters);
                res.redirect(authRequestUrl);
            } catch(error) {
                console.log(JSON.stringify(error));
            }
        });
    }

    private mountRedirectRoute(): void {
        this.express.get('/msal', async (req: RequestWithPKCE, res: Response) => {
            if (req && res) {
                // Add PKCE code verifier to token request object
                const tokenRequest: AuthorizationCodeRequest = {
                    code: req.query.code as string,
                    scopes: [`${this.settings.crm.url}/.default`],
                    redirectUri: this.settings.msal.redirectUri,
                    codeVerifier: req.session.pkceCodes.verifier, // PKCE Code Verifier
                    clientInfo: req.query.client_info as string
                };
                try {
                    const authenticationResult = await this.pca.acquireTokenByCode(tokenRequest);
                    this.bearer = authenticationResult.accessToken;
                    res.send('You can close this window');
                    // await this.onAuthenticated();
                    setTimeout(() => {
                        this.httpServer.close((): void => {
                            return console.log(`server stopped listening`);
                        });
                        for (const socket of this.sockets) {
                            socket.destroy();
                        }
                        this.onAuthenticated();
                    }, 100);
                } catch(error) {
                    console.log(error);
                    res.status(500).send('Error occurred. Check console for more info \n You can close this window');
                }
            }
        });
    }

    protected onAuthenticated(): Promise<void> {
        return Promise.resolve();
    }
}
