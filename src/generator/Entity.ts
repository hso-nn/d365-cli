import * as colors from 'colors';
import * as shell from 'shelljs';
import * as inquirer from 'inquirer';
import * as fs from 'fs';
import {Variables} from '../Variables';
import {AdalRouter} from '../root/tools/AdalRouter';
import {NodeApi} from '../root/tools/NodeApi/NodeApi';
import {Model} from './Model';
import {Enum} from './Enum';
import {FormContext} from './FormContext';

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

    private static isGeneratedEntity(entityName: string): boolean {
        const check = shell.grep(` ${entityName}:`, 'webpack.config.js');
        return check.stdout !== '\n';
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
        await FormContext.generateFormContext(this.bearer, this.entityName, this.entityLogicalName, async (message: string) => this.log(message));
        await this.log('Generating files finished');
    }

    private async generateEntity(): Promise<void> {
        if (!Entity.isGeneratedEntity(this.entityName)) {
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
            await this.addEntityFiles(this.entityName);
            Entity.registerWebpackConfig(this.entityName);
        } else {
            const serviceFilepath = `src/${this.entityName}/${this.entityName}.service.ts`;
            const fileData = String(fs.readFileSync(serviceFilepath));
            const match = fileData.match(new RegExp(`private static logicalName = '([a-zA-Z_]*)';`));
            this.entityLogicalName = match[1];
            console.log(colors.green(`Entity ${this.entityName} already exists`));
        }
    }

    private static registerWebpackConfig(entityName: string): void {
        const webpackConfigFile = shell.ls('webpack.config.js')[0];
        // eslint-disable-next-line max-len
        shell.sed('-i', 'entry: {', `entry: {\n            ${entityName}: [\n                path.resolve(__dirname, "src/${entityName}/${entityName}.ts")\n            ],`, webpackConfigFile);
        shell.exec('git add webpack.config.js');
    }

    private async addEntityFiles(entityName: string): Promise<void> {
        console.log(`Adding D365 Entity files ${entityName}...`);
        const {publisher, namespace} = await Variables.get();
        shell.mkdir(`src/${entityName}`);
        shell.ls(`${__dirname}/Entity/*.*`).forEach((filepath) => {
            const split = filepath.split('/');
            const filename = split[split.length - 1];
            const newfilename = filename.replace(/Entity/g, entityName);
            shell.cp('-r', filepath, `src/${entityName}`);
            shell.cp('-r', `src/${entityName}/${filename}`, `src/${entityName}/${newfilename}`);
            shell.rm('-rf', `src/${entityName}/${filename}`);
            shell.sed('-i', new RegExp('EntityLogicalName', 'ig'), this.entityLogicalName, `src/${entityName}/${newfilename}`);
            shell.sed('-i', new RegExp('Entity', 'g'), entityName, `src/${entityName}/${newfilename}`);
            shell.sed('-i', new RegExp('entity', 'g'), entityName.charAt(0).toLowerCase() + entityName.slice(1), `src/${entityName}/${newfilename}`);
            shell.sed('-i', new RegExp('<%= publisher %>', 'ig'), publisher, `src/${entityName}/${newfilename}`);
            shell.sed('-i', new RegExp('<%= namespace %>', 'ig'), namespace, `src/${entityName}/${newfilename}`);
            shell.exec(`git add src/${entityName}/${newfilename}`);
        });
        console.log('Adding D365 Entity files done');
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
