import {AdalRouter} from '../AdalRouter';
import * as crypto from 'crypto';
import * as fs from 'fs';

export class Deploy extends AdalRouter {
    protected config: {};
    protected md5 = (contents: string): string => crypto.createHash('md5').update(contents).digest('hex');

    constructor() {
        super();
        this.config = JSON.parse(fs.readFileSync('tools/config.json', 'utf8') || '{}');
    }

    protected onAuthenticated(): Promise<void> {
        return this.deploy();
    }

    protected async deploy(): Promise<void> {
        throw new Error('Not implemented');
    }
}
