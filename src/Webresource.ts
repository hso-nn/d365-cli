import * as colors from 'colors';
import * as shell from 'shelljs';
import * as inquirer from 'inquirer';
import {Variables} from './Variables';

export class Webresource {
    public static generateWebresource(webresourcename: string): Promise<void> {
        const check = shell.grep(` ${webresourcename}:`, 'webpack.config.js');
        if (!webresourcename) {
            console.log(colors.red('Webresource name missing'));
        } else if(!new RegExp('[A-Z]').test(webresourcename[0])) {
            console.log(colors.red(`Webresource name must be UpperCamelCase!`));
        } else if (check.stdout !== '\n') {
            console.log(colors.red(`echo Webresource ${webresourcename} already exists!`));
        } else if (process.argv[5]) {
            console.log(colors.red(`echo No spaces allowed!`));
        } else {
            return Webresource.generate(webresourcename);
        }
    }

    private static async generate(webresourcename: string): Promise<void> {
        console.log(`Adding D365 Webresource ${webresourcename}...`);
        const answers = await inquirer.prompt([{
                type: 'list',
                name: 'template',
                message: 'Which template do you want?',
                choices: [
                    'HTML',
                    'React'
                ]
            }]),
            template = answers.template;
        const {publisher, namespace} = await Variables.get();
        shell.mkdir(`src/${webresourcename}`);
        const srcDir = `${__dirname}/Webresource${template === 'React' ? 'Tsx' : ''}/*.*`;
        shell.ls(srcDir).forEach(function (file) {
            const split = file.split('/');
            const filename = split[split.length - 1];
            const newfilename = filename.replace(/Webresource/g, webresourcename);
            shell.cp('-r', file, `src/${webresourcename}`);
            shell.cp('-r', `src/${webresourcename}/${filename}`, `src/${webresourcename}/${newfilename}`);
            shell.rm('-rf', `src/${webresourcename}/${filename}`);
            shell.sed('-i', new RegExp('Webresource', 'ig'), webresourcename, `src/${webresourcename}/${newfilename}`);
            shell.sed('-i', new RegExp('<%= publisher %>', 'ig'), publisher, `src/${webresourcename}/${newfilename}`);
            shell.sed('-i', new RegExp('<%= namespace %>', 'ig'), namespace, `src/${webresourcename}/${newfilename}`);
            shell.exec(`git add src/${webresourcename}/${newfilename}`);
        });
        const webpackConfigFile = shell.ls('webpack.config.js')[0],
            extension = template === 'React' ? 'tsx' : 'ts';
        // eslint-disable-next-line max-len
        shell.sed('-i', 'entry: {', `entry: {\n        ${webresourcename}: [\n            path.resolve(__dirname, "src/${webresourcename}/${webresourcename}.${extension}")\n        ],`, webpackConfigFile);
        shell.exec('git add webpack.config.js');
        console.log('Adding D365 Webresource done');
    }
}
