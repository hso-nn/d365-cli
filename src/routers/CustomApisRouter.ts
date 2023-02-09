import {MsalRouter} from './MsalRouter';
import {CustomApis} from '../commands/generators/CustomApis';

export class CustomApisRouter extends MsalRouter {
    public static generateCustomApis(): Promise<void> {
        new CustomApisRouter();
        return null;
    }

    protected async onAuthenticated(): Promise<void> {
        const customApis = new CustomApis(this.bearer);
        await customApis.generate();
    }
}
