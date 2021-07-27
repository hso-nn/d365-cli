import colors from 'colors';
import * as shell from 'shelljs';
import * as inquirer from 'inquirer';
import * as fs from 'fs';
import {AdalRouter} from '../root/tools/AdalRouter';
import {NodeApi} from '../root/tools/NodeApi/NodeApi';
import {Model} from './Model';
import {Enum} from './Enum';
import {AttributeFormContext} from './AttributeFormContext';
import {Form} from './Form';

export class Entity extends AdalRouter {
    public static async generateEntity(entityName: string): Promise<void> {
        if (!entityName) {
            console.log(colors.red('Entity name missing'));
        } else if(!new RegExp('[A-Z]').test(entityName[0])) {
            console.log(colors.red(`Entity name must be UpperCamelCase!`));
        } else if (process.argv[5]) {
            console.log(colors.red(`No spaces allowed!`));
        } else {
            new Entity(entityName);
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
        await this.generateEntity();
        await this.log(`Generating files for Entity '${this.entityName}'<br/>Using entityLogicalName '${this.entityLogicalName}'</br>`);
        await Model.generateModel(this.bearer, this.entityName, this.entityLogicalName, async (message: string) => this.log(message));
        await Enum.generateEnum(this.bearer, this.entityName, this.entityLogicalName, async (message: string) => this.log(message));
        await AttributeFormContext.generateFormContext(this.bearer, this.entityName, this.entityLogicalName, async (message: string) => this.log(message));
        await Form.generateFormFiles(this.bearer, this.entityName, this.entityLogicalName, async (message: string) => this.log(message));
        await this.log('Generating files finished');
    }

    private async generateEntity(): Promise<void> {
        const serviceFilepath = `src/${this.entityName}/${this.entityName}.service.ts`;
        if (!shell.test('-f', serviceFilepath)) {
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
            await this.addEntityFiles(this.entityName);
            // Entity.registerWebpackConfig(this.entityName);
        } else {
            const fileData = String(fs.readFileSync(serviceFilepath));
            const match = fileData.match(new RegExp(`private static logicalName = '([a-zA-Z_]*)';`));
            this.entityLogicalName = match[1];
            console.log(colors.green(`Entity ${this.entityName} already exist`));
        }
    }

    // private static registerWebpackConfig(entityName: string): void {
    // const webpackConfigFile = shell.ls('webpack.config.ts')[0];
    // eslint-disable-next-line max-len
    //shell.sed('-i', 'entry: {', `entry: {\n            ${entityName}: [\n                path.resolve(__dirname, "src/${entityName}/${entityName}.ts")\n            ],`, webpackConfigFile);
    // shell.exec('git add webpack.config.ts');
    // }

    private async addEntityFiles(entityName: string): Promise<void> {
        await this.addServiceFile(entityName);
        await this.addBuildFile();
    }

    private async addServiceFile(entityName: string): Promise<void> {
        await this.log(`Adding ${entityName}/${entityName}.service.ts...`);
        const filepath = `src/${this.entityName}/${this.entityName}.service.ts`;
        shell.cp('-r', `${__dirname}/Entity/Entity.service.ts`, filepath);
        shell.sed('-i', new RegExp('EntityLogicalName', 'g'), this.entityLogicalName, filepath);
        shell.sed('-i', new RegExp('Entity', 'g'), entityName, filepath);
        shell.exec(`git add ${filepath}`);
        await this.log(`Added ${entityName}/${entityName}.service.ts`);
    }

    private async addBuildFile(): Promise<void> {
        await this.log(`Adding ${this.entityName}/build.json`);
        const filepath = `src/${this.entityName}/build.json`;
        shell.cp('-r', `${__dirname}/Entity/build.json`, filepath);
        shell.exec(`git add ${filepath}`);
        await this.log(`Added ${this.entityName}/build.json`);
    }

    // private trimPrefix(name: string): string {
    //     const {publisher_prefix} = this.settings.crm;
    //     return name.replace(`${publisher_prefix}_`, '');
    // }

    // private getTypeName(logicalName: string): string {
    //     const {publisher_prefix} = this.settings.crm,
    //         typeName = logicalName.replace(`${publisher_prefix}_`, '');
    //     return Model.capitalize(typeName);
    // }
}
