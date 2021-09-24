import {AdalRouter} from '../root/tools/AdalRouter';
import {GlobalOptionSet} from './GlobalOptionSet';

export class GlobalOptionSetRouter extends AdalRouter {
    public static generateGlobalOptionSets(): Promise<void> {
        new GlobalOptionSetRouter();
        return null;
    }

    protected async onAuthenticated(): Promise<void> {
        const globalOptionSet = new GlobalOptionSet(this.bearer, async (message: string) => this.log(message));
        await globalOptionSet.generate();
    }
}
