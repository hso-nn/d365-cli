import * as colors from 'colors';
import * as shell from 'shelljs';
import * as fs from 'fs';
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
        Update.moveDeploy();
        const variables = await Variables.get();
        Update.updateProjectRootFolder();
        Update.updateDeploy(variables);
        Update.updateSrcFolder();
        Update.updatePackageJson(variables);
        Update.updateServiceFiles();
        Update.updateModelFiles();
        Update.updateFormFiles(variables);
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

        console.log(`Updating WebApi...`);
        shell.cp('-R', `${__dirname}/root/src/WebApi`, './src');
        shell.exec('git add src/WebApi/Model.ts');
        shell.exec('git add src/WebApi/Service.ts');

        console.log(`Updating Http...`);
        shell.cp('-R', `${__dirname}/root/src/Http`, './src');
        shell.exec('git add src/Http/Http.ts');

        console.log(`Updating util...`);
        shell.cp('-R', `${__dirname}/root/src/util`, './src');
        shell.exec('git add src/util/Base64.ts');
        shell.exec('git add src/util/FormUtil.ts');

        console.log(`Updating Annotation...`);
        shell.cp('-R', `${__dirname}/root/src/Annotation`, './src');
        shell.exec('git add src/Annotation/Annotation.model.ts');
        shell.exec('git add src/Annotation/Annotation.service.ts');

        console.log(`Updating Translation...`);
        shell.cp('-R', `${__dirname}/root/src/translation`, './src');
        shell.exec('git add src/translation/TranslationI18n.ts');

        Update.cleanSrcFolder();
    }

    private static cleanSrcFolder(): void {
        console.log(`Removing tslint.json...`);
        shell.rm('-R', `./src/tslint.json`);

        console.log(`Removing txs...`);
        shell.rm('-R', './src/tsx');
    }

    private static moveDeploy(): void {
        console.log(`Moving deploy folder...`);
        if (shell.test('-f', 'deploy/deploy.js')) {
            if (!shell.test('-d', 'tools')) {
                shell.mkdir('tools');
            }
            shell.cp('-R','deploy/*', 'tools');
            if (shell.which('git')) {
                shell.exec('git rm deploy/deploy.js');
                shell.exec('git rm deploy/crm.json');
            }
        }
    }

    private static updateDeploy(variables: AllVariables): void {
        console.log(`Updating deploy folder...`);
        if (!shell.test('-d', 'tools')) {
            shell.mkdir('tools');
        }
        shell.cp('-R', `${__dirname}/root/tools/*.js`, './tools');
        shell.cp('-R', `${__dirname}/root/tools/*.resx`, './tools');
        shell.exec('git add tools');
        const checkClientSecret = shell.grep(`clientSecret`, './tools/crm.json'),
            checkTranslation = shell.grep('translation', './tools/crm.json'),
            {publisher, solution, environment, namespace, translationtype} = variables;
        if (checkClientSecret.stdout !== '\n' || checkTranslation.stdout === '\n') {
            shell.cp('-R', `${__dirname}/root/tools/crm.json`, './tools');
            const crmJsonFile = shell.ls('./tools/crm.json')[0];
            shell.sed('-i', new RegExp('<%= publisher %>', 'ig'), publisher, crmJsonFile);
            shell.sed('-i', new RegExp('<%= solution %>', 'ig'), solution, crmJsonFile);
            shell.sed('-i', new RegExp('<%= environment %>', 'ig'), environment, crmJsonFile);
            shell.sed('-i', new RegExp('<%= namespace %>', 'ig'), namespace, crmJsonFile);
            shell.sed('-i', new RegExp('<%= translationtype %>', 'ig'), translationtype || 'i18n', crmJsonFile);
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

    private static updateServiceFiles(): void {
        console.log(`Updating Service files`);
        shell.ls(`src/**/*.service.ts*`).forEach(function (filepath) {
            Update.updateServiceFileCount(filepath);
            Update.updateServiceFileCloneValidation(filepath);
            Update.updateServiceModel(filepath);
        });
    }

    private static serviceFileSnippetCount = `public static async count(filters?: Filter[]): Promise<number> {
        return WebApi.count(EntityService.logicalName, filters);
    }`;

    private static updateServiceFileCount(filepath: string): void {
        console.log(`Updating Service files Count code`);
        const countCheck = shell.grep(`public static async count`, filepath);
        if (countCheck.stdout === '\n') {
            const split = filepath.split('/'),
                entityname = split[1],
                file = shell.ls(filepath)[0];
            shell.sed('-i', `import {MultipleSystemQueryOptions, SystemQueryOptions, WebApi} from '../WebApi/WebApi';`,
                `import {Filter, MultipleSystemQueryOptions, SystemQueryOptions, WebApi} from '../WebApi/WebApi';`, file);
            shell.sed('-i', `export class ${entityname}Service {`,
                `export class ${entityname}Service {\n    ` + Update.serviceFileSnippetCount
                    .replace(/EntityService/g, `${entityname}Service`) + '\n', file);
            console.log(`Modified ${filepath}`);
        }
    }

    private static serviceFileSnippetCloneValidation = `public static async retrieveClone(id: string): Promise<EntityModel> {
        const origRecord = await Xrm.WebApi.retrieveRecord(EntityService.logicalName, id);
        return Model.parseCreateModel(EntityService.logicalName, origRecord);
    }

    public static async validateRecord(entityModel: EntityModel): Promise<ModelValidation> {
        return Model.validateRecord(EntityService.logicalName, entityModel);
    }`;

    private static updateServiceFileCloneValidation(filepath: string): void {
        console.log(`Updating Service files Clone and Validation code`);
        const cloneCheck = shell.grep(`retrieveClone`, filepath);
        if (cloneCheck.stdout === '\n') {
            const split = filepath.split('/'),
                entityname = split[1],
                entitynameCamelCase = entityname.charAt(0).toLowerCase() + entityname.slice(1),
                file = shell.ls(filepath)[0];
            shell.sed('-i', `export class ${entityname}Service {`,
                `export class ${entityname}Service {\n    ` + Update.serviceFileSnippetCloneValidation
                    .replace(/EntityService/g, `${entityname}Service`)
                    .replace(/EntityModel/g, `${entityname}Model`)
                    .replace(/entityModel/g, `${entitynameCamelCase}Model`) + '\n', file);
            console.log(`Modified ${filepath}`);
        }
    }

    private static updateServiceModel(filepath: string): void {
        const file = shell.ls(filepath)[0];
        const serviceCheck = shell.grep(`Model.`, filepath);
        if (serviceCheck.stdout !== '\n') {
            shell.sed('-i', new RegExp(` Model\\.`, 'ig'), ' Service.', file);
            shell.sed('-i', new RegExp(`export class`, 'i'), `import {Service} from '../WebApi/Service';\nexport class`, file);
        }
        shell.sed('-i', `import {Model} from '../WebApi/Model';`, ``, file);
    }

    // eslint-disable-next-line max-lines-per-function
    private static updateModelFiles(): void {
        console.log(`Updating Model files`);
        // eslint-disable-next-line max-lines-per-function
        shell.ls(`src/**/*.model.ts*`).forEach(function (filepath) {
            const extendsCheck = shell.grep(`extends Model`, filepath);
            if (extendsCheck.stdout === '\n') {
                const split = filepath.split('/'),
                    entityname = split[1],
                    file = shell.ls(filepath)[0];
                // shell.sed('-i', `export`, `import {Model} from '../WebApi/Model';\nexport`, file);
                shell.sed('-i', `interface ${entityname}Model {`, `interface ${entityname}Model extends Model {`, file);
                console.log(`Modified ${filepath}`);
            }
            const filedata = String(fs.readFileSync(filepath));
            if (filedata.includes('enum')) {
                const split = filepath.split('/'),
                    entityname = split[1],
                    newFilepath = `src/${entityname}/${entityname}.enum.ts`;
                shell.cp('-r', `${__dirname}/Entity/Entity.enum.ts`, `src/${entityname}`);
                shell.cp('-r', `src/${entityname}/Entity.enum.ts`, newFilepath);
                shell.rm('-rf', `src/${entityname}/Entity.enum.ts`);
                shell.exec(`git add ${newFilepath}`);
                const enumRegExp = new RegExp(`export enum\\s[a-zA-Z]*\\s{[a-zA-Z0-9\\s=,]*}`, 'gm');
                shell.ShellString(filedata.match(enumRegExp).join('\n')).to(newFilepath);
                shell.ShellString(filedata.replace(enumRegExp, '')).to(filepath);
            }
            const exportCheck = shell.grep('export', filepath);
            if (exportCheck.stdout !== '\n') {
                const file = shell.ls(filepath)[0];
                shell.sed('-i', `import {Model} from '../WebApi/Model';`, ``, file);
                shell.sed('-i', `export `, ``, file);
                console.log(`Modified ${filepath}`);
            }
        });
    }

    private static getTranslationInitRegex(variables: AllVariables): RegExp {
        const {publisher, namespace} = variables;
        return new RegExp(`await Translation\\.init\\({\\s*relativePath:\\s'${publisher}_/${namespace}/locales'\\s*}\\);\\s*`, 'gm');
        // return /await Translation\.init\({\s*relativePath:\s'hds_\/ces\/locales'\s*}\);\s*/gm;
    }
    private static updateFormFiles(variables: AllVariables): void {
        console.log('Updating Entity files');
        const filepaths = shell.ls(`src/**/*.form.ts`);
        for (const filepath of filepaths) {
            const translationCheck = shell.grep(`Translation.init`, filepath);
            if (translationCheck.stdout !== '\n') {
                const filedata = String(fs.readFileSync(filepath));
                shell.ShellString(filedata.replace(Update.getTranslationInitRegex(variables), '')).to(filepath);
                console.log(`Modified ${filepath}`);
            }
        }
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
            const modelCheck = shell.grep('.model', filepath);
            if (modelCheck.stdout !== '\n') {
                shell.sed('-i', new RegExp(`// import.*\\.model';`, 'ig'), '', file);
                shell.sed('-i', new RegExp(`import.*\\.model';`, 'ig'), '', file);
                shell.sed('-i', new RegExp(`import.*WebApi/Model';`, 'ig'), '', file);
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
            cutEntry = entryPart.replace('\r\n    },\r\n    ', '');
        shell.cp('-R', `${__dirname}/root/webpack.config.js`, '.');
        const webpackConfigFile = shell.ls('webpack.config.js')[0];
        shell.sed('-i', new RegExp('<%= publisher %>', 'ig'), variables.publisher, webpackConfigFile);
        shell.sed('-i', new RegExp('<%= namespace %>', 'ig'), variables.namespace, webpackConfigFile);
        shell.sed('-i', new RegExp('<%= description %>', 'ig'), variables.description, webpackConfigFile);
        shell.sed('-i', new RegExp('entry: {', 'ig'), cutEntry, webpackConfigFile);
    }
}
