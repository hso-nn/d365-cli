import {AdalRouter} from '../root/tools/AdalRouter';
import {EnvironmentVariable} from './EnvironmentVariable';

export class EnvironmentVariableRouter extends AdalRouter {
    public static generateEnvironmentVariable(): Promise<void> {
        new EnvironmentVariableRouter();
        return null;
    }

    protected async onAuthenticated(): Promise<void> {
        const environmentVariable = new EnvironmentVariable(this.bearer, async (message: string) => this.log(message));
        await environmentVariable.generate();
    }
}
