import colors from 'colors';
import * as shell from 'shelljs';
import inquirer from 'inquirer';
import * as fs from 'fs';
import cp from 'child_process';
import {CrmJson} from '../../root/CrmJson';

type Template = 'React' | 'HTML';
interface Answer {
    template: Template;
}

export interface WebresourceOptions {
    template?: Template;
}

export class Webresource {
    public static generateWebresource(webresourcename: string, options: WebresourceOptions): Promise<void> {
        const check = shell.grep(` ${webresourcename}:`, 'webpack.config.ts');
        if (!webresourcename) {
            console.log(colors.red('Webresource name missing'));
        } else if(!new RegExp('[A-Z]').test(webresourcename[0])) {
            console.log(colors.red(`Webresource name must be UpperCamelCase!`));
        } else if (check.stdout !== '\n') {
            console.log(colors.red(`Webresource ${webresourcename} already exist!`));
        } else if (process.argv[7]) {
            console.log(colors.red(`No spaces allowed!`));
        } else if (options.template && !['React', 'HTML'].includes(options.template)) {
            console.log(colors.red(`echo Webresource template must be 'React' or 'HTML'`));
        } else {
            return Webresource.generate(webresourcename, options);
        }
    }

    private static async generate(webresourcename: string, options: WebresourceOptions): Promise<void> {
        const folderPath = `src/${webresourcename}`;
        if (!shell.test('-d', folderPath)) {
            console.log(`Adding Webresource ${webresourcename}...`);
            let template = options.template;
            if (!template) {
                const answer = await inquirer.prompt([{
                    type: 'list',
                    name: 'template',
                    message: 'Which template do you want?',
                    choices: [
                        'HTML',
                        'React'
                    ]
                }]);
                template = (answer as Answer).template;
            }
            shell.mkdir(folderPath);
            await Webresource.addWebresourceFiles(webresourcename, template);
            await Webresource.addBuildFile(webresourcename, template);
            console.log(`Added Webresource ${webresourcename}`);
        } else {
            console.log(colors.magenta(`Webresource ${webresourcename} already exist`));
        }
    }

    private static async addWebresourceFiles(webresourcename: string, template: Template): Promise<void> {
        const settings: CrmJson = JSON.parse(fs.readFileSync('../crm.json', 'utf8'));
        const {namespace, publisher_prefix} = settings.crm;
        const srcDir = `${__dirname}/Webresource${template === 'React' ? 'Tsx' : ''}/*.*`;
        shell.ls(srcDir).forEach(function (file) {
            const split = file.split('/');
            const filename = split[split.length - 1];
            const newfilename = filename.replace(/Webresource/g, webresourcename);
            shell.cp('-r', file, `src/${webresourcename}`);
            shell.cp('-r', `src/${webresourcename}/${filename}`, `src/${webresourcename}/${newfilename}`);
            shell.rm('-rf', `src/${webresourcename}/${filename}`);
            shell.sed('-i', new RegExp('Webresource', 'ig'), webresourcename, `src/${webresourcename}/${newfilename}`);
            shell.sed('-i', new RegExp('<%= publisher %>', 'ig'), publisher_prefix, `src/${webresourcename}/${newfilename}`);
            shell.sed('-i', new RegExp('<%= namespace %>', 'ig'), namespace, `src/${webresourcename}/${newfilename}`);
            const filepath = `src/${webresourcename}/${newfilename}`;
            // shell.exec(`git add filepath`);
            if (shell.test('-e', '../.git')) {
                cp.execFileSync('git', ['add', filepath]);
            }
        });
    }

    private static async addBuildFile(webresourcename: string, template: Template) : Promise<void> {
        console.log(`Adding ${webresourcename}/build.json`);
        const filepath = `src/${webresourcename}/build.json`;
        shell.cp('-r', `${__dirname}/Entity/build.json`, filepath);
        const buildJsonString = String(fs.readFileSync(filepath));
        const buildJson = JSON.parse(buildJsonString);
        if (!buildJson.webresources.find((webresource: {name: string}) => webresource.name === webresourcename)) {
            buildJson.webresources.push({
                name: webresourcename,
                build: true,
                template: template
            });
            shell.ShellString(JSON.stringify(buildJson, null, 2)).to(filepath);
        }
        // shell.exec(`git add ${filepath}`);
        if (shell.test('-e', '../.git')) {
            cp.execFileSync('git', ['add', filepath]);
        }
        console.log(`Added ${webresourcename}/build.json`);
    }
}
