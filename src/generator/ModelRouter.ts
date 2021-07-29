import {AdalRouter} from '../root/tools/AdalRouter';
import colors from 'colors';
import {Model} from './Model';
import * as shell from 'shelljs';
import * as inquirer from 'inquirer';
import {NodeApi} from '../root/tools/NodeApi/NodeApi';
import fs from 'fs';

export class ModelRouter extends AdalRouter {
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

    private entityLogicalName: string;
    private readonly entityName: string;
    constructor(entityName: string) {
        super();
        this.entityName = entityName;
    }

    protected async onAuthenticated(): Promise<void> {
        const folderPath = `src/${this.entityName}`;
        if (!shell.test('-d', folderPath)) {
            const answers = await inquirer.prompt([{
                type: 'input',
                name: 'entityLogicalName',
                message: 'Entity LogicalName:'
            }]);
            this.entityLogicalName = answers.entityLogicalName;
            try {
                await NodeApi.getEntityDefinition(this.entityLogicalName, this.bearer, ['PrimaryIdAttribute']);
            } catch (e) {
                console.log(colors.red(`Failed: Entity ${this.entityName} has no LogicalName ${this.entityLogicalName}`));
                throw e;
            }
            shell.mkdir(`src/${this.entityName}`);
            await Model.generateModel(this.bearer, this.entityName, this.entityLogicalName, async (message: string) => this.log(message));
            // Entity.registerWebpackConfig(this.entityName);
        } else {
            const serviceFilepath = `src/${this.entityName}/${this.entityName}.service.ts`;
            const fileData = String(fs.readFileSync(serviceFilepath));
            const match = fileData.match(new RegExp(`static logicalName = '([a-zA-Z_]*)';`));
            this.entityLogicalName = match[1];
            console.log(colors.green(`Entity ${this.entityName} already exist`));
            await Model.generateModel(this.bearer, this.entityName, this.entityLogicalName, async (message: string) => this.log(message));
        }
        await this.log('Generating files finished');
    }
}
