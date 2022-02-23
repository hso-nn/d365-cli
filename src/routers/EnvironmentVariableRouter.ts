import {MsalRouter} from './MsalRouter';
import {EnvironmentVariable} from '../commands/generators/EnvironmentVariable';

export class EnvironmentVariableRouter extends MsalRouter {
    public static generateEnvironmentVariable(): Promise<void> {
        new EnvironmentVariableRouter();
        return null;
    }

    protected async onAuthenticated(): Promise<void> {
        const environmentVariable = new EnvironmentVariable(this.bearer);
        await environmentVariable.generate();
    }
}
