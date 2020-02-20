import * as express from 'express';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import * as open from 'open';
import {Express, Router} from 'express';
import * as http from 'http';
import {Socket} from 'net';
import * as fs from 'fs';
import {Request, Response} from 'express-serve-static-core';
import {CrmJson} from './CrmJson';

export class AdalRouter {
    public express: Express;
    protected httpServer: http.Server;
    protected sockets: Socket[] = [];
    protected settings: CrmJson = JSON.parse(fs.readFileSync('tools/crm.json', 'utf8'));
    protected bearer: string;

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
            res.redirect('/authenticated');
        });
    }
}
