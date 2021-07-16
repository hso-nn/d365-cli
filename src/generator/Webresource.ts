import * as colors from 'colors';
import * as shell from 'shelljs';
import * as inquirer from 'inquirer';
import * as fs from 'fs';
import {Variables} from '../Variables';

interface Answers {
    template: 'React' | 'HTML';
}

export class Webresource {
    public static generateWebresource(webresourcename: string): Promise<void> {
        const check = shell.grep(` ${webresourcename}:`, 'webpack.config.ts');
        if (!webresourcename) {
            console.log(colors.red('Webresource name missing'));
        } else if(!new RegExp('[A-Z]').test(webresourcename[0])) {
            console.log(colors.red(`Webresource name must be UpperCamelCase!`));
        } else if (check.stdout !== '\n') {
            console.log(colors.red(`echo Webresource ${webresourcename} already exist!`));
        } else if (process.argv[5]) {
            console.log(colors.red(`echo No spaces allowed!`));
        } else {
            return Webresource.generate(webresourcename);
        }
    }

    private static async generate(webresourcename: string): Promise<void> {
        const folderPath = `src/${webresourcename}`;
        if (!shell.test('-d', folderPath)) {
            console.log(`Adding Webresource ${webresourcename}...`);
            const answers = await inquirer.prompt([{
                type: 'list',
                name: 'template',
                message: 'Which template do you want?',
                choices: [
                    'HTML',
                    'React'
                ]
            }]);
            shell.mkdir(folderPath);
            await Webresource.addWebresourceFiles(webresourcename, answers);
            await Webresource.addBuildFile(webresourcename, answers);
            console.log(`Added Webresource ${webresourcename}`);
        } else {
            console.log(colors.green(`Webresource ${webresourcename} already exist`));
        }
    }

    private static async addWebresourceFiles(webresourcename: string, answers: Answers): Promise<void> {
        const template = answers.template;
        const {publisher, namespace} = await Variables.get();
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
    }

    private static async addBuildFile(webresourcename: string, answers: Answers) : Promise<void> {
        console.log(`Adding ${webresourcename}/build.json`);
        const filepath = `src/${webresourcename}/build.json`;
        shell.cp('-r', `${__dirname}/Entity/build.json`, filepath);
        const buildJsonString = String(fs.readFileSync(filepath));
        const buildJson = JSON.parse(buildJsonString);
        if (!buildJson.webresources.find((webresource: {name: string}) => webresource.name === webresourcename)) {
            buildJson.webresources.push({
                name: webresourcename,
                build: true,
                template: answers.template
            });
            shell.ShellString(JSON.stringify(buildJson, null, 2)).to(filepath);
        }
        shell.exec(`git add ${filepath}`);
        console.log(`Added ${webresourcename}/build.json`);
    }
}
