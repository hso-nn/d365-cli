import colors from 'colors';
import * as shell from 'shelljs';
import {AdalRouter} from './AdalRouter';
import {Regenerator} from '../commands/generators/Regenerator';

export class RegeneratorRouter extends AdalRouter {
    public static async regenerate(): Promise<void> {
        if (!shell.test('-e', 'src')) {
            console.log(colors.red(`You are not inside the project Webresources folder!`));
        } else {
            new RegeneratorRouter();
        }
    }

    protected async onAuthenticated(): Promise<void> {
        const regenerator = new Regenerator(this.bearer, async (message: string) => this.log(message));
        await regenerator.generate();
    }
}
