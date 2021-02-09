import * as colors from 'colors';
import * as shell from 'shelljs';
import * as inquirer from 'inquirer';
import {Variables} from '../Variables';
import {Model} from './Model';

export class Entity {
    public static generateEntity(entityName: string): Promise<void> {
        if (!entityName) {
            console.log(colors.red('Entity name missing'));
        } else if(!new RegExp('[A-Z]').test(entityName[0])) {
            console.log(colors.red(`Entity name must be UpperCamelCase!`));
        } else if (process.argv[5]) {
            console.log(colors.red(`No spaces allowed!`));
        } else {
            return Entity.generate(entityName);
        }
    }

    private static async generate(entityName: string): Promise<void> {
        const check = shell.grep(` ${entityName}:`, 'webpack.config.js');
        if (check.stdout === '\n') {
            await Entity.addEntityFiles(entityName);
            Entity.registerWebpackConfig(entityName);
        } else {
            console.log(colors.green(`Entity ${entityName} already exists`));
        }
        await Model.generateModel(entityName);
    }

    private static registerWebpackConfig(entityName: string): void {
        const webpackConfigFile = shell.ls('webpack.config.js')[0];
        // eslint-disable-next-line max-len
        shell.sed('-i', 'entry: {', `entry: {\n            ${entityName}: [\n                path.resolve(__dirname, "src/${entityName}/${entityName}.ts")\n            ],`, webpackConfigFile);
        shell.exec('git add webpack.config.js');
    }

    private static async addEntityFiles(entityName: string): Promise<void> {
        console.log(`Adding D365 Entity files ${entityName}...`);
        const {publisher, namespace} = await Variables.get(),
            answers = await inquirer.prompt([{
                type: 'input',
                name: 'entityLogicalName',
                message: 'Entity LogicalName:'
            }]);
        shell.mkdir(`src/${entityName}`);
        shell.ls(`${__dirname}/Entity/*.*`).forEach(function (filepath) {
            const split = filepath.split('/');
            const filename = split[split.length - 1];
            const newfilename = filename.replace(/Entity/g, entityName);
            shell.cp('-r', filepath, `src/${entityName}`);
            shell.cp('-r', `src/${entityName}/${filename}`, `src/${entityName}/${newfilename}`);
            shell.rm('-rf', `src/${entityName}/${filename}`);
            shell.sed('-i', new RegExp('EntityLogicalName', 'ig'), answers.entityLogicalName, `src/${entityName}/${newfilename}`);
            shell.sed('-i', new RegExp('Entity', 'g'), entityName, `src/${entityName}/${newfilename}`);
            shell.sed('-i', new RegExp('entity', 'g'), entityName.charAt(0).toLowerCase() + entityName.slice(1), `src/${entityName}/${newfilename}`);
            shell.sed('-i', new RegExp('<%= publisher %>', 'ig'), publisher, `src/${entityName}/${newfilename}`);
            shell.sed('-i', new RegExp('<%= namespace %>', 'ig'), namespace, `src/${entityName}/${newfilename}`);
            shell.exec(`git add src/${entityName}/${newfilename}`);
        });
        console.log('Adding D365 Entity files done');
    }
}
