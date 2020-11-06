import * as colors from 'colors';
import * as shell from 'shelljs';
import * as inquirer from 'inquirer';
import {Variables} from '../Variables';

export class Entity {
    public static generateEntity(entityname: string): Promise<void> {
        const check = shell.grep(` ${entityname}:`, 'webpack.config.js');
        if (!entityname) {
            console.log(colors.red('Entity name missing'));
        } else if(!new RegExp('[A-Z]').test(entityname[0])) {
            console.log(colors.red(`Entity name must be UpperCamelCase!`));
        } else if (check.stdout !== '\n') {
            console.log(colors.red(`Entity ${entityname} already exists!`));
        } else if (process.argv[5]) {
            console.log(colors.red(`No spaces allowed!`));
        } else {
            return Entity.generate(entityname);
        }
    }

    private static async generate(entityname: string): Promise<void> {
        console.log(`Adding D365 Entity ${entityname}...`);
        const {publisher, namespace} = await Variables.get(),
            answers = await inquirer.prompt([{
                type: 'input',
                name: 'entityLogicalName',
                message: 'Entity LogicalName:'
            }]);
        shell.mkdir(`src/${entityname}`);
        shell.ls(`${__dirname}/Entity/*.*`).forEach(function (file) {
            const split = file.split('/');
            const filename = split[split.length - 1];
            if (filename !== 'Entity.enum.ts') {
                const newfilename = filename.replace(/Entity/g, entityname);
                shell.cp('-r', file, `src/${entityname}`);
                shell.cp('-r', `src/${entityname}/${filename}`, `src/${entityname}/${newfilename}`);
                shell.rm('-rf', `src/${entityname}/${filename}`);
                shell.sed('-i', new RegExp('EntityLogicalName', 'ig'), answers.entityLogicalName, `src/${entityname}/${newfilename}`);
                shell.sed('-i', new RegExp('Entity', 'g'), entityname, `src/${entityname}/${newfilename}`);
                shell.sed('-i', new RegExp('entity', 'g'), entityname.charAt(0).toLowerCase() + entityname.slice(1), `src/${entityname}/${newfilename}`);
                shell.sed('-i', new RegExp('<%= publisher %>', 'ig'), publisher, `src/${entityname}/${newfilename}`);
                shell.sed('-i', new RegExp('<%= namespace %>', 'ig'), namespace, `src/${entityname}/${newfilename}`);
                shell.exec(`git add src/${entityname}/${newfilename}`);
            }
        });
        const webpackConfigFile = shell.ls('webpack.config.js')[0];
        // eslint-disable-next-line max-len
        shell.sed('-i', 'entry: {', `entry: {\n        ${entityname}: [\n            path.resolve(__dirname, "src/${entityname}/${entityname}.ts")\n        ],`, webpackConfigFile);
        shell.exec('git add webpack.config.js');
        console.log('Adding D365 Entity done');
    }
}
