import colors from 'colors';
import {MsalRouter} from './MsalRouter';
import {Entity} from '../commands/generators/Entity';

export interface EntityOptions {
    skipForms?: boolean;
    entityLogicalName?: string;
}

export class EntityRouter extends MsalRouter {
    public static async generateEntity(entityName: string, options: EntityOptions): Promise<void> {
        if (!entityName) {
            console.log(colors.red('Entity name missing'));
        } else if(!new RegExp('[A-Z]').test(entityName[0])) {
            console.log(colors.red(`Entity name must be UpperCamelCase!`));
        // } else if (!options.skipForms && process.argv[5] || process.argv[6]) {
        //     console.log(colors.red(`No spaces allowed!`));
        } else {
            new EntityRouter(entityName, options);
        }
        return null;
    }

    private readonly entityName: string;
    private readonly entityLogicalName: string;
    private readonly options: EntityOptions;
    constructor(entityName: string, options: EntityOptions) {
        super();
        this.entityName = entityName;
        this.entityLogicalName = options.entityLogicalName;
        this.options = options;
    }

    protected async onAuthenticated(): Promise<void> {
        const entity = new Entity(this.bearer, this.entityName, this.entityLogicalName, this.options);
        await entity.generate();
    }
}
