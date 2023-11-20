import colors from 'colors';
import * as shell from 'shelljs';
import * as inquirer from 'inquirer';
import * as fs from 'fs';
import {PCF} from './PCF';

interface CreateOptions {
    environment?: string;
    publisher_name?: string;
    publisher_prefix?: string;
    solution_deploy?: string;
    solution_generate?: string;
    solution_pcf?: string;

    namespace?: string;
}

export class Create {
    public static createProject(name: string, options: CreateOptions): Promise<void> {
        if (process.argv[4]) {
            console.log(colors.red(`No spaces allowed!`));
        } else if (shell.test('-e', `${name}/Webresources`)) {
            console.log(colors.red(`Project ${name}/Webresources already exist!`));
        } else {
            return Create.create(name, options);
        }
    }

    public static showCreateHelp(): void {
        console.log(`Arguments:`);
        console.log('   ' + colors.blue('project'));
        console.log(`     The project name of the new workspace and initial Webresource setup.`);
    }

    private static async create(name: string, options: CreateOptions): Promise<void> {
        let createOptions: CreateOptions = options;
        if (!options.environment || !options.solution_deploy || !options.publisher_name || !options.publisher_prefix || !options.namespace) {
            console.log(colors.red(`Missing some required options (environment, solution_deploy, publisher_name, 
            publisher_prefix, namespace. Command line will request them now.`));
            createOptions = await Create.inquirer();
        }
        console.log(`Initializing D365 Project ${name}...`);
        if (!shell.test('-e', `${name}`)) {
            shell.mkdir(name);
        }
        shell.cd(name);

        shell.cp('-R', `${__dirname}/root/crm.json`, '.');
        Create.setupWebresources(name, createOptions);
        Create.setupPCF(name, createOptions);
    }

    private static setupPCF(name: string, options: CreateOptions): void {
        shell.mkdir('PCF');
        shell.cd('PCF');
        const {publisher_name, publisher_prefix, solution_pcf} = options;
        PCF.initPcfSolution(solution_pcf, publisher_name, publisher_prefix);
        shell.cd('..');
        console.log(colors.green(`Please fill ${name}/PCF/Solutions/src/Other/Solution.xml`));
    }

    private static setupWebresources(name: string, options: CreateOptions): void {
        shell.mkdir('Webresources');
        shell.cp('-R', `${__dirname}/root/Webresources/*`, 'Webresources');
        shell.cp('-R', `${__dirname}/root/Webresources/.*`, 'Webresources');
        fs.renameSync(`./Webresources/gitignore`, './Webresources/.gitignore');

        Create.initCrmJson(options);
        Create.initWebresourcesCrmJson(options);
        Create.initWebresourcesPackageJson(name, options);
        Create.initWebresourcesWebpackConfig(options);

        shell.cd('Webresources');
        console.log(`Installing npm packages. This may take a while...`);
        shell.exec('npm install');
        console.log('Initializing D365 Project done');
        console.log(`${colors.blue('hso-d365 generate Entity x')} in Webresources folder generates Entity x files and settings.`);
        console.log(`${colors.blue('npm run build:prod')} in Webresources folder creates the deployment package.`);
        console.log(`See package.json#scripts for all options.`);
        shell.cd('..');
    }

    private static initCrmJson(options: CreateOptions): void {
        const crmJsonFile = shell.ls('./crm.json')[0];
        shell.sed('-i', new RegExp('<%= publisher_prefix %>', 'ig'), options.publisher_prefix, crmJsonFile);
        shell.sed('-i', new RegExp('<%= environment %>', 'ig'), options.environment, crmJsonFile);
        shell.sed('-i', new RegExp('<%= namespace %>', 'ig'), options.namespace, crmJsonFile);
        const version = shell.exec('hso-d365 --version').stdout.replace(/\n/ig, '');
        shell.sed('-i', new RegExp('<%= version %>', 'ig'), version, crmJsonFile);
    }

    private static initWebresourcesCrmJson(options: CreateOptions): void {
        const crmJsonFile = shell.ls('Webresources/crm.json')[0];
        shell.sed('-i', new RegExp('<%= solution_name_deploy %>', 'ig'), options.solution_deploy, crmJsonFile);
        shell.sed('-i', new RegExp('<%= solution_name_generate %>', 'ig'), options.solution_generate || options.solution_deploy, crmJsonFile);
    }

    private static initWebresourcesPackageJson(name: string, options: CreateOptions): void {
        const packageJsonFile = shell.ls('Webresources/package.json')[0];
        shell.sed('-i', '<%= projectname %>', name.toLowerCase(), packageJsonFile);
        shell.sed('-i', new RegExp('<%= description %>', 'ig'), options.solution_deploy, packageJsonFile);
    }

    private static initWebresourcesWebpackConfig(options: CreateOptions): void {
        const webpackConfigFile = shell.ls('Webresources/webpack.config.ts')[0];
        shell.sed('-i', new RegExp('<%= publisher_prefix %>', 'ig'), options.publisher_prefix, webpackConfigFile);
        shell.sed('-i', new RegExp('<%= namespace %>', 'ig'), options.namespace, webpackConfigFile);
        shell.sed('-i', new RegExp('<%= description %>', 'ig'), options.namespace, webpackConfigFile);
    }

    // eslint-disable-next-line max-lines-per-function
    private static inquirer(): Promise<CreateOptions> {
        return inquirer.prompt([{
            type: 'input',
            name: 'environment',
            message: 'D365 environment url (eg. https://yourproject.crm4.dynamics.com):',
            validate: async (input: string): Promise<boolean> => {
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
            name: 'solution_deploy',
            message: `D365 deployment Solution ('Name' column):`,
            validate: async (input: string) => {
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
            name: 'solution_generate',
            message: `D365 generate Solution ('Name' column)\nIf equal to deployment Solution keep blank:`,
            validate: async (input: string) => {
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
            name: 'solution_pcf',
            message: `D365 PCF Solution ('Name' column)\nIf equal to deployment Solution keep blank:`,
            validate: async (input: string) => {
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
            validate: async (input: string) => {
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
            validate: async (input: string) => {
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
            validate: async (input: string) => {
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
