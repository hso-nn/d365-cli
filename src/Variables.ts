
export type WebpackConfigVariables = {
    publisher?: string;
    projectabbr?: string;
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
            let publisher, projectabbr;
            const lineReader = require('readline').createInterface({
                input: require('fs').createReadStream(`webpack.config.js`)
            });
            lineReader.on('line', (line: string) => {
                if (line.includes('dir_build =')) {
                    const split = line.split('"'),
                        publisherProjectabbr = split[1],
                        ppSplit = publisherProjectabbr.split('_/');
                    publisher = ppSplit[0].replace('dist/', '');
                    projectabbr = ppSplit[1];
                    lineReader.close();
                    resolve({
                        publisher: publisher,
                        projectabbr: projectabbr
                    });
                }
            });
        });
    }

    private static readPackageJson(): Promise<PackageJsonVariables> {
        return new Promise((resolve): void => {
            let projectname = '', description, version = '';
            const lineReader = require('readline').createInterface({
                input: require('fs').createReadStream(`package.json`)
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
            const lineReader = require('readline').createInterface({
                input: require('fs').createReadStream(`deploy/crm.json`)
            });
            lineReader.on('line', (line: string) => {
                if (line.includes('"solution_name":')) {
                    const split = line.split('"');
                    solution = split[3];
                }
                if (line.includes('"clientUrl":')) {
                    const split = line.split('"');
                    environment = split[3];
                }
                if (line.includes('"redirectUri":')) {
                    lineReader.close();
                    resolve({
                        environment: environment,
                        solution: solution
                    });
                }
            });
        });
    }
}
