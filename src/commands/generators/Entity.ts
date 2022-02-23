import colors from 'colors';
import * as shell from 'shelljs';
import * as inquirer from 'inquirer';
import * as fs from 'fs';
import cp from 'child_process';
import {NodeApi} from '../../node/NodeApi/NodeApi';
import {Model} from './Model';
import {Enum} from './Enum';
import {AttributeFormContext} from './AttributeFormContext';
import {Form} from './Form';
import {AttributeTypings} from './AttributeTypings';

interface EntityOptions {
    skipForms?: boolean;
}

export class Entity {
    private readonly bearer: string;
    private readonly entityName: string;
    private readonly options: EntityOptions;
    private entityLogicalName: string;

    constructor(bearer: string, entityName: string, options: EntityOptions) {
        this.bearer = bearer;
        this.entityName = entityName;
        this.options = options;
    }

    public async generate(): Promise<void> {
        await this.generateEntityFiles();
        console.log(`Generating files for Entity '${this.entityName}'`);
        console.log(`Using entityLogicalName '${this.entityLogicalName}'`);
        const model = new Model(this.bearer, this.entityName);
        await model.generate();
        await Enum.generateEnum(this.bearer, this.entityName, this.entityLogicalName);
        if (!this.options.skipForms) {
            await AttributeTypings.generate(this.bearer, this.entityName, this.entityLogicalName);
            await AttributeFormContext.generateFormContext(this.bearer, this.entityName, this.entityLogicalName);
            await Form.generateFormFiles(this.bearer, this.entityName, this.entityLogicalName);
        } else {
            console.log('Skip generate form files');
        }
        console.log('Generating files finished');
    }

    private async generateEntityFiles(): Promise<void> {
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
        } else {
            const fileData = String(fs.readFileSync(serviceFilepath));
            const match = fileData.match(new RegExp(`static logicalName = '([a-zA-Z0-9_]*)';`));
            this.entityLogicalName = match[1];
            console.log(colors.magenta(`Entity ${this.entityName} already exist`));
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
        console.log(`Adding ${entityName}/${entityName}.service.ts...`);
        const filepath = `src/${this.entityName}/${this.entityName}.service.ts`;
        shell.cp('-r', `${__dirname}/Entity/Entity.service.ts`, filepath);
        shell.sed('-i', new RegExp('EntityLogicalName', 'g'), this.entityLogicalName, filepath);
        shell.sed('-i', new RegExp('Entity', 'g'), entityName, filepath);
        // shell.exec(`git add ${filepath}`);
        if (shell.test('-e', '../.git')) {
            cp.execFileSync('git', ['add', filepath]);
        }
        console.log(`Added ${entityName}/${entityName}.service.ts`);
    }

    private async addBuildFile(): Promise<void> {
        console.log(`Adding ${this.entityName}/build.json`);
        const filepath = `src/${this.entityName}/build.json`;
        shell.cp('-r', `${__dirname}/Entity/build.json`, filepath);
        // shell.exec(`git add ${filepath}`);
        if (shell.test('-e', '../.git')) {
            cp.execFileSync('git', ['add', filepath]);
        }
        console.log(`Added ${this.entityName}/build.json`);
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
