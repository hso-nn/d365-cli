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
        const variables = await Variables.get();
        Update.updateTranslationFiles();
        Update.updateSrcFolder();
        Update.updateToolsFolder();
        Update.updateProjectRootFolder();
        Update.updateFormFiles();
        Update.updatePackageJson(variables);
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

        console.log(`Updating karma.conf.js`);
        shell.cp('-R', `${__dirname}/root/karma.conf.js`, '.');

        console.log(`Updating tsconfig.json`);
        shell.cp('-R', `${__dirname}/root/tsconfig.json`, '.');
        shell.exec('git add tsconfig.json');
    }

    private static updateFormFiles(): void {
        console.log(`Updating Service files...`);
        shell.ls(`src/**/*.form.ts*`).forEach(function (filepath) {
            const fileData = String(fs.readFileSync(filepath));
            const match = fileData.match(new RegExp('export class ([a-zA-Z]*)Form {'));
            if (match) {
                const entityName = match[1];
                const importString = `import {${entityName}FormContext} from './${entityName}.formContext';`;
                const newExportString = `export class ${entityName}Form extends ${entityName}FormContext {`;
                shell.sed('-i', new RegExp(`export class ${entityName}Form {`, 'i'), `${importString}\n${newExportString}`, filepath);
            }
        });
    }

    private static updateTranslationFiles(): void {
        console.log('Updating translation files...');
        if (shell.ls(['./src/translation/TranslationI18n.ts']).length === 1) {
            shell.rm('-rf', `./src/translation/TranslationI18n.ts`);
            shell.exec('git rm ./src/translation/TranslationI18n.ts');
        }
        if (shell.ls(['./i18next-scanner.config.js']).length === 1) {
            shell.rm('-rf', `./i18next-scanner.config.js`);
            shell.exec('git rm ./i18next-scanner.config.js');
        }
    }

    private static updateSrcFolder(): void {
        console.log(`Updating WebApi...`);
        shell.cp('-R', `${__dirname}/root/src/WebApi`, './src');
        shell.exec('git add src/WebApi/SystemQueryOptions.ts');
        shell.exec('git add src/WebApi/Service.ts');

        console.log(`Updating Http...`);
        shell.cp('-R', `${__dirname}/root/src/Http`, './src');
        shell.exec('git add src/Http/HttpHeaders.ts');

        console.log(`Updating util...`);
        shell.cp('-R', `${__dirname}/root/src/util`, './src');
        shell.exec('git add src/util/Geolocation.ts');

        console.log(`Updating Annotation...`);
        shell.cp('-R', `${__dirname}/root/src/Annotation`, './src');

        console.log(`Updating Translation...`);
        shell.cp('-R', `${__dirname}/root/src/translation`, './src');
    }

    private static updateToolsFolder(): void {
        if (shell.ls(['./tools/resx.js']).length === 1) {
            shell.rm('-rf', `./tools/resx.js`);
            shell.exec('git rm ./tools/resx.js');
        }
        if (shell.ls(['./tools/locales.resx']).length === 1) {
            shell.rm('-rf', `./tools/locales.resx`);
            shell.exec('git rm ./tools/locales.resx');
        }
        if (shell.ls(['./tools/setFormCustomizable.js']).length === 1) {
            shell.rm('-rf', `./tools/setFormCustomizable.js`);
            shell.exec('git rm ./tools/setFormCustomizable.js');
        }
    }

    private static updatePackageJson(variables: AllVariables): void {
        console.log(`Updating package.json...`);
        const {projectname, description, publisher, version} = variables;
        shell.cp('-R', `${__dirname}/root/package.json`, '.');
        const packageJsonFile = shell.ls('package.json')[0];
        shell.sed('-i', new RegExp('<%= projectname %>', 'ig'), projectname, packageJsonFile);
        shell.sed('-i', new RegExp('<%= description %>', 'ig'), description, packageJsonFile);
        shell.sed('-i', new RegExp('<%= publisher %>', 'ig'), publisher, packageJsonFile);
        shell.sed('-i', new RegExp('<%= version %>', 'ig'), version, packageJsonFile);
        console.log(`Removing old npm packages. This may take a while...`);
        shell.exec('npm prune');
        shell.exec('npm install');
    }

    private static updateWebpackConfig(variables: AllVariables): void {
        console.log(`Updating webpack.config.js...`);
        const origWebpackConfigFile = shell.cat('webpack.config.js'),
            content = origWebpackConfigFile.stdout,
            start = content.indexOf('entry:'),
            end = content.indexOf('output:'),
            entryPart = content.substr(start, end - start),
            cutEntry = entryPart.replace(/\s*},\s*/gm, '');
        shell.cp('-R', `${__dirname}/root/webpack.config.js`, '.');
        const webpackConfigFile = shell.ls('webpack.config.js')[0];
        shell.sed('-i', new RegExp('<%= publisher %>', 'ig'), variables.publisher, webpackConfigFile);
        shell.sed('-i', new RegExp('<%= namespace %>', 'ig'), variables.namespace, webpackConfigFile);
        shell.sed('-i', new RegExp('<%= description %>', 'ig'), variables.description, webpackConfigFile);
        shell.sed('-i', new RegExp('entry: {', 'ig'), `${cutEntry}\r\n        `, webpackConfigFile);
    }
}
