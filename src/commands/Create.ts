import colors from 'colors';
import * as shell from 'shelljs';
import * as inquirer from 'inquirer';
import * as fs from 'fs';
import {PCF} from './PCF';

interface CreateAnswers {
    publisher_name?: string;
    publisher_prefix?: string;
    solution_name_deploy?: string;
    solution_name_generate?: string;
    solution_name_pcf?: string;
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

        Create.setupWebresources(projectname, answers);
        Create.setupPCF(projectname, answers);
    }

    private static setupPCF(projectname: string, answers: CreateAnswers): void {
        shell.mkdir('PCF');
        shell.cd('PCF');
        const {publisher_name, publisher_prefix, solution_name_pcf} = answers;
        PCF.initPcfSolution(solution_name_pcf, publisher_name, publisher_prefix);
        shell.cd('..');
        console.log(colors.green(`Please fill ${projectname}/PCF/Solutions/src/Other/Solution.xml`));
    }

    private static setupWebresources(projectname: string, answers: CreateAnswers): void {
        shell.mkdir('Webresources');
        shell.cp('-R', `${__dirname}/root/Webresources/*`, 'Webresources');
        shell.cp('-R', `${__dirname}/root/Webresources/.*`, 'Webresources');
        fs.renameSync(`./Webresources/gitignore`, './Webresources/.gitignore');

        Create.initCrmJson(answers);
        Create.initWebresourcesCrmJson(answers);
        Create.initWebresourcesPackageJson(projectname, answers);
        Create.initWebresourcesWebpackConfig(answers);

        shell.cd('Webresources');
        console.log(`Installing npm packages. This may take a while...`);
        shell.exec('npm install');
        console.log('Initializing D365 Project done');
        console.log(`${colors.blue('hso-d365 generate Entity x')} in Webresources folder generates Entity x files and settings.`);
        console.log(`${colors.blue('npm run build:prod')} in Webresources folder creates the deployment package.`);
        console.log(`See package.json#scripts for all options.`);
        shell.cd('..');
    }

    private static initCrmJson(answers: CreateAnswers): void {
        const crmJsonFile = shell.ls('./crm.json')[0];
        shell.sed('-i', new RegExp('<%= publisher_prefix %>', 'ig'), answers.publisher_prefix, crmJsonFile);
        shell.sed('-i', new RegExp('<%= environment %>', 'ig'), answers.environment, crmJsonFile);
        shell.sed('-i', new RegExp('<%= namespace %>', 'ig'), answers.namespace, crmJsonFile);
    }

    private static initWebresourcesCrmJson(answers: CreateAnswers): void {
        const crmJsonFile = shell.ls('Webresources/crm.json')[0];
        shell.sed('-i', new RegExp('<%= solution_name_deploy %>', 'ig'), answers.solution_name_deploy, crmJsonFile);
        shell.sed('-i', new RegExp('<%= solution_name_generate %>', 'ig'), answers.solution_name_generate || answers.solution_name_deploy, crmJsonFile);
    }

    private static initWebresourcesPackageJson(projectName: string, answers: CreateAnswers): void {
        const packageJsonFile = shell.ls('Webresources/package.json')[0];
        shell.sed('-i', '<%= projectname %>', projectName.toLowerCase(), packageJsonFile);
        shell.sed('-i', new RegExp('<%= description %>', 'ig'), answers.solution_name_deploy, packageJsonFile);
    }

    private static initWebresourcesWebpackConfig(answers: CreateAnswers): void {
        const webpackConfigFile = shell.ls('Webresources/webpack.config.ts')[0];
        shell.sed('-i', new RegExp('<%= publisher_prefix %>', 'ig'), answers.publisher_prefix, webpackConfigFile);
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
            name: 'solution_name_deploy',
            message: `D365 deployment Solution ('Name' column):`,
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
            name: 'solution_name_generate',
            message: `D365 generate Solution ('Name' column)\nIf equal to deployment Solution keep blank:`,
            validate: async (input) => {
                if (input) {
                    const solutionNameRegExp = new RegExp('[a-zA-Z_\\d]*');
                    if (!solutionNameRegExp.test(input)) {
                        throw new Error('You need to provide a valid solution name');
                    }
                }
                return true;
            }
        }, {
            type: 'input',
            name: 'solution_name_pcf',
            message: `D365 PCF Solution ('Name' column)\nIf equal to deployment Solution keep blank:`,
            validate: async (input) => {
                if (input) {
                    const solutionNameRegExp = new RegExp('[a-zA-Z_\\d]*');
                    if (!solutionNameRegExp.test(input)) {
                        throw new Error('You need to provide a valid solution name');
                    }
                }
                return true;
            }
        }, {
            type: 'input',
            name: 'publisher_name',
            message: 'D365 Publisher Name (not Display Name):',
            validate: async (input) => {
                if (!input) {
                    throw new Error('You need to provide a publisher name');
                }
                const publisherRegExp = new RegExp('[a-zA-Z_0-9]*');
                if (!publisherRegExp.test(input)) {
                    throw new Error('You need to provide a valid publisher');
                }
                return true;
            }
        }, {
            type: 'input',
            name: 'publisher_prefix',
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
            message: 'Customer or Product name:',
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
