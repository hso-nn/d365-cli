import * as readline from 'readline';
import * as fs from 'fs';

export type WebpackConfigVariables = {
    publisher?: string;
    namespace?: string;
}

export type PackageJsonVariables = {
    description?: string;
    projectname?: string;
    version?: string;
}

export type CrmJsonVariable = {
    environment?: string;
    solution?: string;
}

export type AllVariables = WebpackConfigVariables & PackageJsonVariables & CrmJsonVariable;

export class Variables {
    public static async get(): Promise<AllVariables> {
        const webpackConfigVariable = await Variables.readWebpackConfig();
        const packageJsonVariables = await Variables.readPackageJson();
        const crmJsonVariables = await Variables.readCrmJson();
        return Object.assign({}, webpackConfigVariable, packageJsonVariables, crmJsonVariables);
    }

    private static readWebpackConfig(): Promise<WebpackConfigVariables> {
        return new Promise((resolve): void => {
            let publisher, namespace;
            const lineReader = readline.createInterface({
                input: fs.createReadStream(`webpack.config.ts`)
            });
            lineReader.on('line', (line: string) => {
                if (line.includes('dir_build =')) {
                    const split = line.split(`'`),
                        publisherNamespace = split[1],
                        pnSplit = publisherNamespace.split('_/');
                    publisher = pnSplit[0].replace('dist/', '');
                    namespace = pnSplit[1];
                    lineReader.close();
                    resolve({
                        publisher: publisher,
                        namespace: namespace
                    });
                }
            });
        });
    }

    private static readPackageJson(): Promise<PackageJsonVariables> {
        return new Promise((resolve): void => {
            let projectname = '', description, version = '';
            const lineReader = readline.createInterface({
                input: fs.createReadStream(`package.json`)
            });
            lineReader.on('line', (line: string) => {
                if (line.includes('"name":')) {
                    const split = line.split('"');
                    projectname = split[3];
                }
                if (line.includes('"version":')) {
                    const split = line.split('"');
                    version = split[3];
                }
                if (line.includes('"description":')) {
                    const split = line.split('"');
                    description = split[3];
                    lineReader.close();
                    resolve({
                        description: description,
                        projectname: projectname,
                        version: version
                    });
                }
            });
        });
    }

    private static readCrmJson(): Promise<CrmJsonVariable> {
        return new Promise((resolve): void => {
            let environment = '', solution = '';
            const lineReader = readline.createInterface({
                input: fs.createReadStream(`tools/crm.json`)
            });
            lineReader.on('line', (line: string) => {
                if (line.includes('"solution_name":')) {
                    const split = line.split('"');
                    solution = split[3];
                }
                if (line.includes('"url":')) {
                    const split = line.split('"');
                    environment = split[3];
                }
                if (line.includes('"clientUrl":')) {
                    const split = line.split('"');
                    environment = split[3];
                }
                if (line.includes('"redirectUri":')) {
                    lineReader.close();
                    resolve({
                        environment: environment,
                        solution: solution,
                    });
                }
            });
        });
    }
}
