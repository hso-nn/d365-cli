import {AdalRouter} from '../AdalRouter';
import * as crypto from 'crypto';
import * as fs from 'fs';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DeployConfig {}

export class Deploy extends AdalRouter {
    protected config: DeployConfig;
    protected md5 = (contents: string): string => crypto.createHash('md5').update(contents).digest('hex');

    constructor() {
        super();
        this.config = JSON.parse(fs.readFileSync(Deploy.getConfigPath(), 'utf8') || '{}');
    }

    private static getConfigPath(): string {
        if (fs.existsSync('config.json')) {
            return 'config.json';
        } else {
            return '../config.json';
        }
    }

    protected onAuthenticated(): Promise<void> {
        return this.deploy();
    }

    protected async deploy(): Promise<void> {
        throw new Error('Not implemented');
    }
}
