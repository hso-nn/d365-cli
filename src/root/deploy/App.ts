import * as express from 'express';
import * as fs from 'fs';
import * as crypto from 'crypto';
import * as http from 'http';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import * as open from 'open';
import {Express, Router} from 'express';
import {WebresourceService} from './Webresource/Webresource.service';
import {WebresourceModel} from './Webresource/Webresource.model';
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
        redirectUri: string;
    };
}

class App {
    public express: Express;
    private httpServer: http.Server;
    private sockets: Socket[] = [];
    private settings: CrmJson = JSON.parse(fs.readFileSync('deploy/crm.json', 'utf8'));
    private bearer: string;
    private md5 = (contents: string): string => crypto.createHash('md5').update(contents).digest('hex');

    constructor() {
        this.express = express();
        this.express.use(express.static('node_modules/adal-angular/dist'));
        this.mountRoutes();
        this.startListen();
    }

    private startListen(): void {
        const redirectUriSplit = this.settings.adal.redirectUri.split('/'),
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

    private mountRoutes(): void {
        const router = express.Router();
        App.mountDefaultRoute(router);
        this.mountAuthRoute(router);
        this.mountTokenRoute(router);
        this.mountDeployRoute(router);
        this.express.use('/', router);
    }

    private static mountDefaultRoute(router: Router): void {
        router.get('/', (req: Request, res: Response) => {
            res.redirect('/auth');
        });
    }

    private mountAuthRoute(router: Router): void {
        router.get('/auth', (req: Request, res: Response) => {
            res.send(`
                <head>
                    <title>test</title>
                </head>
                <body>
                    <script src="adal.min.js"></script>
                    <script>
                        var config = {
                            clientId: "${this.settings.adal.clientId}",
                            popUp: true,
                            callback: function (errorDesc, token, error, tokenType) {
                                authContext.acquireToken('${this.settings.crm.url}', function (errorDesc, token, error) {
                                    if (!error) {
                                        window.location.href = "/token/" + token;
                                    }
                                });
                            }
                        }
                        var authContext = new AuthenticationContext(config);
                        if (authContext.isCallback(window.location.hash)) {
                            authContext.handleWindowCallback();
                        } else {
                            authContext.login();
                        }
                    </script>
                </body>`
            );
        });
    }

    private mountTokenRoute(router: Router): void {
        router.get('/token/:token', (req: Request, res: Response): void => {
            this.bearer = req.params.token;
            res.redirect('/deploy');
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
