import * as express from 'express';
import * as fs from 'fs';
import * as crypto from 'crypto';
import * as adalNode from 'adal-node';
import * as http from 'http';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import * as opn from 'opn';
import {Express, Router} from 'express';
import {WebresourceService} from './Webresource/Webresource.service';
import {WebresourceModel} from './Webresource/Webresource.model';
import {TokenResponse} from 'adal-node';
import {Request, Response} from 'express-serve-static-core';
import {Socket} from 'net';


export interface CrmJson {
    crm: {
        version: string;
        publisher_prefix: string;
        solution_name: string;
        url: string;
    };
    adal: {
        clientId: string;
        clientSecret: string;
        tenant: string;
        redirectUri: string;
    };
}

class App {
    public express: Express;
    private httpServer: http.Server;
    private sockets: Socket[] = [];
    private settings: CrmJson = JSON.parse(fs.readFileSync('deploy/crm.json', 'utf8'));
    private adal = {
        authorityHostUrl : 'https://login.microsoftonline.com',
        clientId : this.settings.adal.clientId,
        clientSecret: this.settings.adal.clientSecret,
        redirectUri: this.settings.adal.redirectUri,
        tenant: this.settings.adal.tenant
    };
    private md5 = (contents: string): string => crypto.createHash('md5').update(contents).digest('hex');
    private bearer: string;

    constructor() {
        this.express = express();
        this.mountRoutes();
        this.startListen();
    }

    private startListen(): void {
        const redirectUriSplit = this.settings.adal.redirectUri.split('/'),
            portSplit = redirectUriSplit[redirectUriSplit.length -2].split(':'),
            port = parseInt(portSplit[1]),
            openUrl = redirectUriSplit.slice(0, redirectUriSplit.length - 1).join('/') + '/auth';
        this.httpServer = this.express.listen(port, (): void => {
            opn(openUrl);
            return console.log(`server is listening on ${port}`);
        });
        this.httpServer.on('connection', (socket: Socket) => {
            this.sockets.push(socket);
        });
    }

    private mountRoutes(): void {
        const router = express.Router();
        App.mountDefaultRoute(router);
        App.mountLoginRoute(router);
        this.mountAuthRoute(router);
        this.mountRedirectRoute(router);
        this.mountDeployRoute(router);
        this.express.use('/', router);
    }

    private static mountDefaultRoute(router: Router): void {
        router.get('/', (req: Request, res: Response) => {
            res.redirect('login');
        });
    }

    private static mountLoginRoute(router: Router): void {
        router.get('/login', (req: Request, res: Response) => {
            res.cookie('acookie', 'this is a cookie');
            res.send(`<head><title>test</title></head><body><a href="./auth">Login</a></body>`);
        });
    }

    private mountAuthRoute(router: Router): void {
        router.get('/auth', (req: Request, res: Response) => {
            crypto.randomBytes(48, (e: Error, buffer: Buffer) => {
                const token = buffer.toString('base64').replace(/\//g, '_').replace(/\+/g, '-');
                res.cookie('authstate', token);
                res.redirect(this.createAuthorizationUrl(token));
            });
        });
    }

    private createAuthorizationUrl(state: string): string {
        const {authorityHostUrl, clientId, redirectUri, tenant} = this.adal,
            clientUrl = this.settings.crm.url;
        const templateAuthzUrl = `${authorityHostUrl}/${tenant}/oauth2/authorize?response_type=code&client_id=<client_id>&redirect_uri=<redirect_uri>&state=<state>&resource=<resource>`;
        let authorizationUrl = templateAuthzUrl.replace('<client_id>', clientId);
        authorizationUrl = authorizationUrl.replace('<redirect_uri>', redirectUri);
        authorizationUrl = authorizationUrl.replace('<state>', state);
        authorizationUrl = authorizationUrl.replace('<resource>', clientUrl);
        return authorizationUrl;
    }

    private mountRedirectRoute(router: Router): void {
        const redirectUriSplit = this.settings.adal.redirectUri.split('/'),
            redirectPath = `/${redirectUriSplit[redirectUriSplit.length -1]}`;
        router.get(redirectPath, (req: Request, res: Response) => {
            const {authorityHostUrl, clientId, clientSecret, redirectUri, tenant} = this.adal,
                clientUrl = this.settings.crm.url,
                authenticationContext = new adalNode.AuthenticationContext(`${authorityHostUrl}/${tenant}`);
            authenticationContext.acquireTokenWithAuthorizationCode(req.query.code, redirectUri, clientUrl, clientId, clientSecret, (err: Error, response: TokenResponse) => {
                let message = err ? 'error: ' + err.message + '\n' : '';
                message += 'response: ' + JSON.stringify(response);
                if (err) {
                    res.send(message);
                    return;
                }
                // Later, if the access token is expired it can be refreshed.
                authenticationContext.acquireTokenWithRefreshToken(response.refreshToken, clientId, clientSecret, clientUrl, (refreshErr: Error, refreshResponse: TokenResponse) => {
                    if (refreshErr) {
                        message += 'refreshError: ' + refreshErr.message + '\n';
                    }
                    message += 'refreshResponse: ' + JSON.stringify(refreshResponse);
                    this.bearer = refreshResponse.accessToken;
                    res.redirect('/deploy');
                });
            });
        });
    }

    private mountDeployRoute(router: Router): void {
        router.get('/deploy', async (req: Request, res: Response): Promise<void> => {
            res.setHeader('Connection', 'Transfer-Encoding');
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.setHeader('Transfer-Encoding', 'chunked');

            res.flushHeaders();
            await this.deploy((message: string) => {
                res.write(`${message}`, () => {
                    res.flushHeaders();
                });
            });
            res.send();
        });
    }

    private async deploy(messenger: Function): Promise<void> {
        const {publisher_prefix, url} = this.settings.crm;
        messenger(`Deploying to ${url}...<br/>`);
        await this.deployDirectory(`dist/${publisher_prefix}_`, messenger);
        messenger('Deploy finished');
        setTimeout(() => {
            this.httpServer.close((): void => {
                return console.log(`server stopped listening`);
            });
            for (const socket of this.sockets) {
                socket.destroy();
            }
        }, 100);
    }

    private async deployDirectory(directory: string, messenger: Function): Promise<void> {
        return new Promise((resolve): void => {
            fs.readdir(directory, async (err: Error, files: string[]) => {
                const promises = [];
                for (const file of files) {
                    const path = `${directory}/${file}`,
                        stats = fs.lstatSync(path);
                    if (stats.isDirectory()) {
                        promises.push(await this.deployDirectory(path, messenger));
                    } else {
                        promises.push(await this.deployFile(path, messenger));
                    }
                }
                Promise.all(promises).then(() => {
                    resolve();
                });
            });
        });
    }

    private async deployFile(path: string, messenger: Function): Promise<void> {
        return new Promise((resolve): void => {
            fs.readFile(path, async (err: Error, data: Buffer) => {
                const crmPath = path.substr(5),
                    webresource = await this.getWebresource(crmPath);
                messenger(`${crmPath}`);
                if (webresource) {
                    await this.updateWebresource(webresource, data, messenger);
                } else {
                    await this.insertWebresource(data, crmPath, messenger);
                }
                resolve();
            });
        });
    }

    private async updateWebresource(webresource: WebresourceModel, data: Buffer, messenger: Function): Promise<void> {
        const md5Orig = this.md5(webresource.content),
            base64 = data.toString('base64'),
            md5New = this.md5(base64);
        if (md5Orig !== md5New) {
            webresource.content = base64;
            try {
                await WebresourceService.upsert(webresource, this.bearer);
                messenger(` updated...`);
                await WebresourceService.publish(webresource, this.bearer);
                messenger(` and published<br/>`);
            } catch (e) {
                messenger(` failed ${e.message}<br/>`);
            }
        } else {
            messenger(` unmodified<br/>`);
        }
    }

    private async insertWebresource(data: Buffer, path: string, messenger: Function): Promise<WebresourceModel> {
        const base64 = data.toString('base64');
        try {
            const solutionUniqueName = this.settings.crm.solution_name,
                webresource = await WebresourceService.upsert({
                    content: base64,
                    name: path,
                    displayname: path
                }, this.bearer);
            messenger(` inserted...`);
            await WebresourceService.addToSolution(webresource, solutionUniqueName, this.bearer);
            messenger(` and added to solution ${solutionUniqueName}<br/>`);
            return webresource;
        } catch (e) {
            messenger(` failed ${e.message}<br/>`);
        }
    }

    private async getWebresource(path: string): Promise<WebresourceModel> {
        const webresources = await WebresourceService.retrieveMultipleRecords({
            select: ['name', 'webresourcetype', 'content', 'displayname', 'solutionid'],
            filters: [{
                conditions: [{
                    attribute: 'name',
                    value: path
                }]
            }],
            top: 1
        }, this.bearer);
        return webresources[0];
    }
}
new App().express;
