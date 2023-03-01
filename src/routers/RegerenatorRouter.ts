import colors from 'colors';
import * as shell from 'shelljs';
import {MsalRouter} from './MsalRouter';
import {Regenerator} from '../commands/generators/Regenerator';

export class RegeneratorRouter extends MsalRouter {
    public static async regenerate(): Promise<void> {
        if (!shell.test('-e', 'src')) {
            console.log(colors.red(`You are not inside the project Webresources folder!`));
        } else {
            new RegeneratorRouter();
        }
    }

    protected async onAuthenticated(): Promise<void> {
        const regenerator = new Regenerator(this.bearer);
        regenerator.generate();
    }
}
