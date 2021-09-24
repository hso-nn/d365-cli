import colors from 'colors';
import {AdalRouter} from '../root/tools/AdalRouter';
import {Entity} from './Entity';

interface EntityOptions {
    skipForms?: boolean;
}

export class EntityRouter extends AdalRouter {
    public static async generateEntity(entityName: string, options: EntityOptions): Promise<void> {
        if (!entityName) {
            console.log(colors.red('Entity name missing'));
        } else if(!new RegExp('[A-Z]').test(entityName[0])) {
            console.log(colors.red(`Entity name must be UpperCamelCase!`));
        } else if (!options.skipForms && process.argv[5] || process.argv[6]) {
            console.log(colors.red(`No spaces allowed!`));
        } else {
            new EntityRouter(entityName, options);
        }
        return null;
    }

    private readonly entityName: string;
    private readonly options: EntityOptions;
    constructor(entityName: string, options: EntityOptions) {
        super();
        this.entityName = entityName;
        this.options = options;
    }

    protected async onAuthenticated(): Promise<void> {
        const entity = new Entity(this.bearer, this.entityName, async (message: string) => this.log(message), this.options);
        await entity.generate();
    }
}
