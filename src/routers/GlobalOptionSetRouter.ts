import {MsalRouter} from './MsalRouter';
import {GlobalOptionSet} from '../commands/generators/GlobalOptionSet';

export class GlobalOptionSetRouter extends MsalRouter {
    public static generateGlobalOptionSets(): Promise<void> {
        new GlobalOptionSetRouter();
        return null;
    }

    protected async onAuthenticated(): Promise<void> {
        const globalOptionSet = new GlobalOptionSet(this.bearer);
        await globalOptionSet.generate();
    }
}
