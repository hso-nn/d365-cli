import * as express from 'express';
import * as open from 'open';
import {Express, Router} from 'express';
import * as http from 'http';
import {Socket} from 'net';
import * as fs from 'fs';
import {Request, Response} from 'express-serve-static-core';
import {CrmJson} from './CrmJson';

export interface AdalRouterContext {
    bearer?: string;
    // response?: Response;
    settings: CrmJson;
    log: (message: string) => Promise<void>;
}

export class AdalRouter {
    public express: Express;
    private response: Response;
    protected httpServer: http.Server;
    protected sockets: Socket[] = [];
    protected context: AdalRouterContext = {
        log: async (message: string) => {
            return this.log(message);
        },
        settings: JSON.parse(fs.readFileSync(AdalRouter.getCrmJsonPath(), 'utf8')) // project root folder
    };

    protected get settings(): CrmJson {
        return this.context.settings;
    }
    protected get bearer(): string {
        return this.context.bearer;
    }
    protected set bearer(bearer: string) {
        this.context.bearer = bearer;
    }

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

    private mountAuthRoute(router: Router): void {
        router.get('/auth', (req: Request, res: Response) => {
            res.send(`
                <head>
                    <title>test</title>
                </head>
                <body>
                    <!--script src="adal.min.js"></script-->
                    <script src="https://secure.aadcdn.microsoftonline-p.com/lib/1.0.17/js/adal.min.js"></script>
                    <script src="https://secure.aadcdn.microsoftonline-p.com/lib/1.0.17/js/adal-angular.min.js"></script>
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
            res.redirect('/authenticated');
        });
    }

    private mountAuthenticatedRoute(router: Router): void {
        router.get('/authenticated', async (req: Request, res: Response): Promise<void> => {
            res.setHeader('Connection', 'Transfer-Encoding');
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.setHeader('Transfer-Encoding', 'chunked');

            res.flushHeaders();
            // this.context.response = res;
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
            this.response.write(`${message}<br/>`, () => {
                this.response.flushHeaders();
                resolve();
            });
        });
    }

    private static getCrmJsonPath(): string {
        if (fs.existsSync('crm.json')) {
            return 'crm.json';
        } else {
            return '../crm.json';
        }
    }
}
