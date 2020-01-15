import * as colors from 'colors';
import * as shell from 'shelljs';
import {AllVariables, Variables} from './Variables';

export class Update {
    public static updateProject(): Promise<void> {
        if (process.argv[3]) {
            console.log(colors.red(`No spaces allowed after update command!`));
        } else {
            return Update.update();
        }
    }

    public static showUpdateHelp(): void {
        console.log(`Arguments:`);
    }

    private static async update(): Promise<void> {
        console.log(`Updating D365 Project...`);
        const variables = await Variables.get();
        Update.updateProjectRootFolder();
        Update.updateDeploy(variables);
        Update.updateSrcFolder();
        Update.updatePackageJson(variables);
        Update.updateServiceFiles();
        Update.updateModelFiles();
        Update.updateEntityFiles();
        Update.updateWebpackConfig(variables);
        console.log(`Updating D365 Project done`);
    }

    private static updateProjectRootFolder(): void {
        console.log(`Updating .eslintignore...`);
        shell.cp('-R', `${__dirname}/root/.eslintignore`, '.');

        console.log(`Updating .gitignore...`);
        shell.cp('-R', `${__dirname}/root/.gitignore`, '.');

        console.log(`Updating .eslintrc.json...`);
        shell.cp('-R', `${__dirname}/root/.eslintrc.json`, '.');

        console.log(`Updating postcss.config.js`);
        shell.cp('-R', `${__dirname}/root/postcss.config.js`, '.');
        shell.exec('git add postcss.config.js');

    }

    private static updateSrcFolder(): void {
        console.log(`Updating tsconfig.json...`);
        shell.cp('-R', `${__dirname}/root/src/tsconfig.json`, './src');

        console.log(`Removing tslint.json...`);
        shell.rm('-R', `./src/tslint.json`);

        console.log(`Updating WebApi...`);
        shell.cp('-R', `${__dirname}/root/src/WebApi`, './src');
        shell.exec('git add src/WebApi/Model.ts');

        console.log(`Updating util...`);
        shell.cp('-R', `${__dirname}/root/src/util`, './src');
        shell.exec('git add src/util/Base64.ts');
        shell.exec('git add src/util/ModelClone.ts');
        shell.exec('git add src/util/ModelValidator.ts');

        console.log(`Updating Annotation...`);
        shell.cp('-R', `${__dirname}/root/src/Annotation`, './src');
        shell.exec('git add src/Annotation/Annotation.model.ts');
        shell.exec('git add src/Annotation/Annotation.service.ts');

        console.log(`Updating Translation...`);
        shell.cp('-R', `${__dirname}/root/src/translation`, './src');

        console.log(`Removing txs...`);
        shell.rm('-R', './src/tsx');
    }

    private static updateDeploy(variables: AllVariables): void {
        console.log(`Updating deploy...`);
        shell.cp('-R', `${__dirname}/root/deploy/deploy.js`, './deploy');
        const check = shell.grep(`clientSecret`, './deploy/crm.json'),
            {publisher, solution, environment} = variables;
        if (check.stdout !== '\n') {
            shell.cp('-R', `${__dirname}/root/deploy/crm.json`, './deploy');
            const crmJsonFile = shell.ls('./deploy/crm.json')[0];
            shell.sed('-i', new RegExp('<%= publisher %>', 'ig'), publisher, crmJsonFile);
            shell.sed('-i', new RegExp('<%= solution %>', 'ig'), solution, crmJsonFile);
            shell.sed('-i', new RegExp('<%= environment %>', 'ig'), environment, crmJsonFile);
        }
    }

    private static updatePackageJson(variables: AllVariables): void {
        console.log(`Updating package.json...`);
        let dlfCoreCheck = shell.grep(`dlf-core`, 'package.json');
        const {projectname, description, publisher, version} = variables;
        if (dlfCoreCheck.stdout !== '\n') {
            shell.exec('npm install --save dlf-core@latest');
            dlfCoreCheck = shell.grep(`dlf-core`, 'package.json');
        }
        shell.cp('-R', `${__dirname}/root/package.json`, '.');
        const packageJsonFile = shell.ls('package.json')[0];
        if (dlfCoreCheck.stdout !== '\n') {
            shell.sed('-i', '"dependencies": {', `"dependencies": {\n${dlfCoreCheck.stdout}`, packageJsonFile);
        }
        shell.sed('-i', new RegExp('<%= projectname %>', 'ig'), projectname, packageJsonFile);
        shell.sed('-i', new RegExp('<%= description %>', 'ig'), description, packageJsonFile);
        shell.sed('-i', new RegExp('<%= publisher %>', 'ig'), publisher, packageJsonFile);
        shell.sed('-i', new RegExp('<%= version %>', 'ig'), version, packageJsonFile);
        console.log(`Removing old npm packages. This may take a while...`);
        shell.exec('npm prune');
        shell.exec('npm install');
    }

    private static serviceFileSnippetCloneValidation = `public static async retrieveClone(id: string): Promise<EntityModel> {
        return ModelClone.retrieveRecord(EntityService.logicalName, id);
    }
    
    public static async validateRecord(entityModel: EntityModel): Promise<ModelValidation> {
        return ModelValidator.validateRecord(EntityService.logicalName, entityModel);
    }`;

    private static updateServiceFiles(): void {
        console.log(`Updating Service files`);
        shell.ls(`src/**/*.service.ts*`).forEach(function (filepath) {
            const check = shell.grep(`import {ModelClone}`, filepath);
            if (check.stdout === '\n') {
                const split = filepath.split('/'),
                    entityname = split[1],
                    entitynameCamelCase = entityname.charAt(0).toLowerCase() + entityname.slice(1),
                    file = shell.ls(filepath)[0];
                shell.sed('-i', `public static async count`,
                    Update.serviceFileSnippetCloneValidation
                        .replace(/EntityService/g, `${entityname}Service`)
                        .replace(/EntityModel/g, `${entityname}Model`)
                        .replace(/entityModel/g, `${entitynameCamelCase}Model`) + '\n\n\tpublic static async count', file);
                shell.sed('-i', `export`,
                    `import {ModelClone} from '../util/ModelClone';\nimport {ModelValidation, ModelValidator} from '../util/ModelValidator';\n\nexport`, file);
                console.log(`Modified ${filepath}`);
            }
        });
    }

    private static updateModelFiles(): void {
        console.log(`Updating Model files`);
        shell.ls(`src/**/*.model.ts*`).forEach(function (filepath) {
            const check = shell.grep(`import {Model}`, filepath);
            if (check.stdout === '\n') {
                const split = filepath.split('/'),
                    entityname = split[1],
                    file = shell.ls(filepath)[0];
                shell.sed('-i', `export`, `import {Model} from '../WebApi/Model';\nexport`, file);
                shell.sed('-i', `interface ${entityname}Model`, `interface ${entityname}Model extends Model`, file);
                console.log(`Modified ${filepath}`);
            }
        });
    }

    private static updateEntityFiles(): void {
        console.log('Updating Entity files');
        shell.ls(`src/**/*.ts*`).forEach(function (filepath) {
            const split = filepath.split('/'),
                entityname = split[1],
                file = shell.ls(filepath)[0];
            if (`${entityname}.ts` === split[2]) {
                const check = shell.grep(`export namespace`, filepath);
                if (check.stdout === '\n') {
                    shell.sed('-i', `export namespace Form`, `export const Form =`, file);
                    shell.sed('-i', `export namespace Ribbon`, `export const Ribbon =`, file);
                    // eslint-disable-next-line max-len
                    shell.sed('-i', `export function onLoad(executionContext: Xrm.Events.EventContext) {`, `onLoad: (executionContext: Xrm.Events.EventContext): void => {`, file);
                    shell.sed('-i', `\\(formContext: Xrm.FormContext\\) {`, `: (formContext: Xrm.FormContext): void => {`, file);
                    // shell.sed('-i', `export function `, ``, file); too much
                    console.log(`Modified ${split[1]}.ts ${split[2]}`);
                }
            }
        });
    }

    private static updateWebpackConfig(variables: AllVariables): void {
        console.log(`Updating webpack.config.js...`);
        const origWebpackConfigFile = shell.cat('webpack.config.js'),
            content = origWebpackConfigFile.stdout,
            start = content.indexOf('entry:'),
            end = content.indexOf('output:'),
            entryPart = content.substr(start, end - start),
            cutEntry = entryPart.replace('\r\n    },', '');
        shell.cp('-R', `${__dirname}/root/webpack.config.js`, '.');
        const webpackConfigFile = shell.ls('webpack.config.js')[0];
        shell.sed('-i', new RegExp('<%= publisher %>', 'ig'), variables.publisher, webpackConfigFile);
        shell.sed('-i', new RegExp('<%= namespace %>', 'ig'), variables.namespace, webpackConfigFile);
        shell.sed('-i', new RegExp('<%= description %>', 'ig'), variables.description, webpackConfigFile);
        shell.sed('-i', new RegExp('entry: {', 'ig'), cutEntry, webpackConfigFile);
    }
}
