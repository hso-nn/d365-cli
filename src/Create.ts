import colors from 'colors';
import * as shell from 'shelljs';
import * as inquirer from 'inquirer';
import * as fs from 'fs';

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
            console.log(colors.red(`Project ${projectname}/Webresources already exist!`));
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
        const answers = await Create.inquirer();
        console.log(`Initializing D365 Project ${projectname}...`);
        if (!shell.test('-e', `${projectname}`)) {
            shell.mkdir(projectname);
        }
        shell.cd(projectname);
        shell.mkdir('Webresources');
        shell.cp('-R', `${__dirname}/root/*`, 'Webresources');
        shell.cp('-R', `${__dirname}/root/.*`, 'Webresources');
        fs.renameSync(`./Webresources/gitignore`, './Webresources/.gitignore');

        Create.initCrmJson(answers);
        Create.initPackageJson(projectname, answers);
        Create.initWebpackConfig(answers);

        shell.cd('Webresources');
        console.log(`Installing npm packages. This may take a while...`);
        shell.exec('npm install');
        console.log('Initializing D365 Project done');
        console.log(`${colors.blue('hso-d365 generate Entity x')} in Webresources folder generates Entity x files and settings.`);
        console.log(`${colors.blue('npm run build:prod')} in Webresources folder creates the deployment package.`);
        console.log(`See package.json#scripts for all options.`);
    }

    private static initCrmJson(answers: CreateAnswers): void {
        const crmJsonFile = shell.ls('Webresources/tools/crm.json')[0];
        shell.sed('-i', new RegExp('<%= publisher %>', 'ig'), answers.publisher, crmJsonFile);
        shell.sed('-i', new RegExp('<%= solution %>', 'ig'), answers.solution, crmJsonFile);
        shell.sed('-i', new RegExp('<%= environment %>', 'ig'), answers.environment, crmJsonFile);
        shell.sed('-i', new RegExp('<%= namespace %>', 'ig'), answers.namespace, crmJsonFile);
    }

    private static initPackageJson(projectName: string, answers: CreateAnswers): void {
        const packageJsonFile = shell.ls('Webresources/package.json')[0];
        shell.sed('-i', '<%= projectname %>', projectName.toLowerCase(), packageJsonFile);
        shell.sed('-i', new RegExp('<%= description %>', 'ig'), answers.solution, packageJsonFile);
        shell.sed('-i', new RegExp('<%= publisher %>', 'ig'), answers.publisher, packageJsonFile);
    }

    private static initWebpackConfig(answers: CreateAnswers): void {
        const webpackConfigFile = shell.ls('Webresources/webpack.config.ts')[0];
        shell.sed('-i', new RegExp('<%= publisher %>', 'ig'), answers.publisher, webpackConfigFile);
        shell.sed('-i', new RegExp('<%= namespace %>', 'ig'), answers.namespace, webpackConfigFile);
        shell.sed('-i', new RegExp('<%= description %>', 'ig'), answers.namespace, webpackConfigFile);
    }

    // eslint-disable-next-line max-lines-per-function
    private static inquirer(): Promise<CreateAnswers> {
        return inquirer.prompt([{
            type: 'input',
            name: 'environment',
            message: 'D365 environment url (eg. https://yourproject.crm4.dynamics.com):',
            validate: async (input) => {
                if (!input) {
                    throw new Error('You need to provide an environment');
                }
                const urlRegExp = new RegExp('https://(www\\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}');
                if (!urlRegExp.test(input)) {
                    throw new Error('You need to provide a valid url');
                }
                return true;
            }
        }, {
            type: 'input',
            name: 'solution',
            message: `D365 Solution name ('Name' column):`,
            validate: async (input) => {
                if (!input) {
                    throw new Error('You need to provide a solution');
                }
                const solutionNameRegExp = new RegExp('[a-zA-Z_\\d]*');
                if (!solutionNameRegExp.test(input)) {
                    throw new Error('You need to provide a valid solution name');
                }
                return true;
            }
        }, {
            type: 'input',
            name: 'publisher',
            message: 'D365 Publisher Prefix (3 chars a-z):',
            validate: async (input) => {
                if (!input) {
                    throw new Error('You need to provide a publisher');
                }
                const publisherRegExp = new RegExp('[a-zA-Z_\\d]*');
                if (!publisherRegExp.test(input)) {
                    throw new Error('You need to provide a valid publisher');
                }
                return true;
            }
        }, {
            type: 'input',
            name: 'namespace',
            message: 'Customer or Product name',
            validate: async (input) => {
                if (!input) {
                    throw new Error('You need to provide a customer or product name');
                }
                const namespaceRegExp = new RegExp('[a-zA-Z_\\d]*');
                if (!namespaceRegExp.test(input)) {
                    throw new Error('You need to provide a valid namespace');
                }
                return true;
            }
        }]);
    }
}
