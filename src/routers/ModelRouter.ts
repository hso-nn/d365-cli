import {MsalRouter} from './MsalRouter';
import colors from 'colors';
import {Model} from '../commands/generators/Model';

export interface ModelOptions {
    entityLogicalName?: string;
}

export class ModelRouter extends MsalRouter {
    public static async generateModel(entityName: string, options: ModelOptions): Promise<void> {
        if (!entityName) {
            console.log(colors.red('Entity name missing'));
        } else if(!new RegExp('[A-Z]').test(entityName[0])) {
            console.log(colors.red(`Entity name must be UpperCamelCase!`));
        } else if (process.argv[5]) {
            console.log(colors.red(`No spaces allowed!`));
        } else {
            new ModelRouter(entityName, options);
        }
        return null;
    }

    private readonly entityName: string;
    private readonly entityLogicalName: string;
    // private readonly options: ModelOptions;
    constructor(entityName: string, options: ModelOptions) {
        super();
        this.entityName = entityName;
        this.entityLogicalName = options.entityLogicalName;
        // this.options = options;
    }

    protected async onAuthenticated(): Promise<void> {
        const model = new Model(this.bearer, this.entityName, this.entityLogicalName);
        await model.generate();
    }
}
