import * as colors from 'colors';
import * as shell from 'shelljs';
import * as inquirer from 'inquirer';

interface CreateAnswers {
    publisher?: string;
    solution?: string;
    environment?: string;
    namespace?: string;
}

export class Create {
    public static createProject(projectname: string): Promise<void> {
        if (process.argv[4]) {
            console.log(colors.red(`No spaces allowed!`));
        } else if (shell.test('-e', `${projectname}/Webresources`)) {
            console.log(colors.red(`Project ${projectname}/Webresources already exists!`));
        } else {
            return Create.create(projectname);
        }
    }

    public static showCreateHelp(): void {
        console.log(`Arguments:`);
        console.log('   ' + colors.blue('project'));
        console.log(`     The project name of the new workspace and initial Webresource setup.`);
    }

    private static async create(projectname: string): Promise<void> {
        console.log(`Initializing D365 Project ${projectname}...`);
        shell.mkdir(projectname);
        shell.cd(projectname);
        shell.mkdir('Webresources');
        shell.cp('-R', `${__dirname}/root/*`, 'Webresources');
        shell.cp('-R', `${__dirname}/root/.*`, 'Webresources');

        const answers = await Create.inquirer();

        const crmJsonFile = shell.ls('Webresources/deploy/crm.json')[0];
        shell.sed('-i', new RegExp('<%= publisher %>', 'ig'), answers.publisher, crmJsonFile);
        shell.sed('-i', new RegExp('<%= solution %>', 'ig'), answers.solution, crmJsonFile);
        shell.sed('-i', new RegExp('<%= environment %>', 'ig'), answers.environment, crmJsonFile);

        const packageJsonFile = shell.ls('Webresources/package.json')[0];
        shell.sed('-i', '<%= projectname %>', projectname.toLowerCase(), packageJsonFile);
        shell.sed('-i', new RegExp('<%= description %>', 'ig'), answers.solution, packageJsonFile);
        shell.sed('-i', new RegExp('<%= publisher %>', 'ig'), answers.publisher, packageJsonFile);

        const webpackConfigFile = shell.ls('Webresources/webpack.config.js')[0];
        shell.sed('-i', new RegExp('<%= publisher %>', 'ig'), answers.publisher, webpackConfigFile);
        shell.sed('-i', new RegExp('<%= namespace %>', 'ig'), answers.namespace, webpackConfigFile);
        shell.sed('-i', new RegExp('<%= description %>', 'ig'), answers.namespace, webpackConfigFile);

        shell.cd('Webresources');
        console.log(`Installing npm packages. This may take a while...`);
        shell.exec('npm install');
        console.log('Initializing D365 Project done');
        console.log(`${colors.blue('ce generate Entity x')} in Webresources folder generates Entity x files and settings.`);
        console.log(`${colors.blue('npm run build:prod')} in Webresources folder creates the deployment package.`);
        console.log(`See package.json#scripts for all options.`);
    }

    private static inquirer(): Promise<CreateAnswers> {
        return inquirer.prompt([{
            type: 'input',
            name: 'environment',
            message: 'D365 environment url (eg. https://yourproject.crm4.dynamics.com):'
        }, {
            type: 'input',
            name: 'solution',
            message: 'D365 Solution name:'
        }, {
            type: 'input',
            name: 'publisher',
            message: 'D365 Publisher Prefix (3 chars a-z):'
        }, {
            type: 'input',
            name: 'namespace',
            message: 'Namespace (eg. Customer or Product name):'
        }]);
    }
}
