import {MsalRouter} from './MsalRouter';
import colors from 'colors';
import {Model} from '../commands/generators/Model';

export class ModelRouter extends MsalRouter {
    public static async generateModel(entityName: string): Promise<void> {
        if (!entityName) {
            console.log(colors.red('Entity name missing'));
        } else if(!new RegExp('[A-Z]').test(entityName[0])) {
            console.log(colors.red(`Entity name must be UpperCamelCase!`));
        } else if (process.argv[5]) {
            console.log(colors.red(`No spaces allowed!`));
        } else {
            new ModelRouter(entityName);
        }
        return null;
    }

    private readonly entityName: string;
    constructor(entityName: string) {
        super();
        this.entityName = entityName;
    }

    protected async onAuthenticated(): Promise<void> {
        const model = new Model(this.bearer, this.entityName);
        await model.generate();
    }
}
