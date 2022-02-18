import express from 'express';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import open from 'open';
import {Express, Router} from 'express';
import * as http from 'http';
import {Socket} from 'net';
import * as fs from 'fs';
import rateLimit from 'express-rate-limit';
import sanitizeHtml from 'sanitize-html';
import {Request, Response} from 'express-serve-static-core';
import {CrmJson} from '../root/CrmJson';

export class AdalRouter {
    public express: Express;
    protected httpServer: http.Server;
    protected sockets: Socket[] = [];
    protected settings: CrmJson = JSON.parse(fs.readFileSync('../crm.json', 'utf8'));
    protected bearer: string;
    private response: Response;

    constructor() {
        this.express = express();
        this.express.use(express.static('node_modules/adal-angular/dist'));
        this.mountRoutes();
        this.startListen();
    }

    private startListen(): void {
        const redirectUriSplit = this.settings.msal.redirectUri.split('/'),
            portSplit = redirectUriSplit[redirectUriSplit.length -2].split(':'),
            port = parseInt(portSplit[1]),
            openUrl = redirectUriSplit.slice(0, redirectUriSplit.length - 1).join('/');
        this.httpServer = this.express.listen(port, (): void => {
            open(openUrl);
            return console.log(`server is listening on ${port}`);
        });
        this.httpServer.on('connection', (socket: Socket) => {
            this.sockets.push(socket);
        });
    }

    protected mountRoutes(): Router {
        const router = express.Router();
        AdalRouter.mountDefaultRoute(router);
        this.mountAuthRoute(router);
        this.mountTokenRoute(router);
        this.mountAuthenticatedRoute(router);
        this.express.use('/', router);
        return router;
    }

    private static mountDefaultRoute(router: Router): void {
        router.get('/', (req: Request, res: Response) => {
            res.redirect('/auth');
        });
    }

    // eslint-disable-next-line max-lines-per-function
    private mountAuthRoute(router: Router): void {
        // eslint-disable-next-line max-lines-per-function
        router.get('/auth', (req: Request, res: Response) => {
            res.send(`
                <head>
                    <title>Login</title>
                    <style>
                        @media (prefers-color-scheme: light) { body { background-color: #f2f2f2; color: #2f2f2f; } }
                        @media (prefers-color-scheme: dark) { body { background-color: #2f2f2f; color: #f2f2f2; } }
                        body { font-family: Cascadia Code,SFMono-Regular,Consolas,Liberation Mono,Menlo,Courier,monospace; font-size: 10pt; }
                    </style>
                </head>
                <body>
                    <script type="text/javascript" src="https://alcdn.msauth.net/browser/2.22.0/js/msal-browser.min.js"></script>
                    <script>
                        const tenant = '${this.settings.msal.tenant}' !== 'undefined' ? '${this.settings.msal.tenant}' : 'common/';
                        const msalConfig = {
                            auth: {
                                clientId: "${this.settings.msal.clientId}",
                                authority: 'https://login.microsoftonline.com/' + tenant
                            },
                            cache: {
                                cacheLocation: "localStorage",
                            },
                        };
                        const msalInstance = new msal.PublicClientApplication(msalConfig);
                        const currentAccounts = msalInstance.getAllAccounts();
                        const tokenRequest = {
                            redirectUri: '${this.settings.msal.redirectUri}',
                            scopes: ["${this.settings.crm.url}/.default"]
                        };
                        if (currentAccounts.length === 1) {
                            tokenRequest.account = currentAccounts[0];
                            msalInstance.acquireTokenSilent(tokenRequest)
                                .then(response => {
                                    window.location.href = "/token/" + response.accessToken;
                                })
                                .catch(error => {
                                    console.warn("silent token acquisition fails. acquiring token using redirect");
                                    if (error instanceof msal.InteractionRequiredAuthError) {
                                        msalInstance.acquireTokenPopup(tokenRequest)
                                            .then(response => {
                                                window.location.href = "/token/" + response.accessToken;
                                            }).catch(error => {
                                                var errorSpan = document.createElement("span");
                                                errorSpan.innerHTML = "<b>Error during acquireToken (access_token):</b><br/>" + error;
                                                document.body.appendChild(errorSpan);
                                            });
                                    } else {
                                        var errorSpan = document.createElement("span");
                                        errorSpan.innerHTML = "<b>Error during acquireToken (access_token):</b><br/>" + error;
                                        document.body.appendChild(errorSpan);
                                    }
                                });
                        } else {
                            msalInstance.loginPopup(tokenRequest).then(response => {
                                window.location.href = "/token/" + response.accessToken;
                            }).catch(err => {
                                var errorSpan = document.createElement("span");
                                errorSpan.innerHTML = "<b>Error during acquireToken (access_token):</b><br/>" + err;
                                document.body.appendChild(errorSpan);
                            });
                        }
                    </script>
                </body>`
            );
        });
    }

    private mountTokenRoute(router: Router): void {
        router.get('/token/:token', (req: Request, res: Response): void => {
            this.bearer = req.params.token;
            res.redirect('/authenticated');
        });
    }

    private mountAuthenticatedRoute(router: Router): void {
        const authenticatedLimiter = rateLimit({
            windowMs: 30 * 60 * 1000, // 30 minutes
            max: 5000, //enough :)
            message: 'Rate limit exceeded. Please log issue'
        });
        router.get('/authenticated', authenticatedLimiter, async (req: Request, res: Response): Promise<void> => {
            res.setHeader('Connection', 'Transfer-Encoding');
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.setHeader('Transfer-Encoding', 'chunked');
            res.flushHeaders();
            
            res.write(`<style>`);
            res.write(`  @media (prefers-color-scheme: light) { body { background-color: #f2f2f2; color: #2f2f2f; } }`);
            res.write(`  @media (prefers-color-scheme: dark) { body { background-color: #2f2f2f; color: #f2f2f2; } }`);
            res.write(`  body { font-family: Cascadia Code,SFMono-Regular,Consolas,Liberation Mono,Menlo,Courier,monospace; font-size: 10pt; }`);
            res.write(`</style>`);
            res.flushHeaders();
            
            this.response = res;
            await this.onAuthenticated();
            setTimeout(() => {
                this.httpServer.close((): void => {
                    return console.log(`server stopped listening`);
                });
                for (const socket of this.sockets) {
                    socket.destroy();
                }
            }, 100);
            res.send();
        });
    }

    protected onAuthenticated(): Promise<void> {
        return Promise.resolve();
    }

    protected log(message: string): Promise<void> {
        return new Promise(resolve => {
            this.response.write(`${sanitizeHtml(message, {
                allowedAttributes: {
                    'span': ['style'],
                },
            })}<br/>`, () => {
                this.response.flushHeaders();
                resolve();
            });
        });
    }
}
