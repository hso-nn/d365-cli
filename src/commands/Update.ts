import * as colors from 'colors';
import shell from 'shelljs';
import fs from 'fs';
import {WebresourcesCrmJson} from '../root/Webresources/CrmJson';
import {CrmJson} from '../root/CrmJson';

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
        Update.updateSrcFolder();
        Update.updateCrmJson();
        Update.updatePCF();
        Update.updateProjectRootFolder();
        Update.updateFormFiles();
        Update.updatePackageJson();
        await Update.updateWebpackConfig();
        console.log(`Updating D365 Project done`);
    }

    private static updateProjectRootFolder(): void {
        console.log(`Updating .eslintignore...`);
        shell.cp('-R', `${__dirname}/root/Webresources/.eslintignore`, '.');
        shell.exec('git add .eslintignore');

        console.log(`Updating .gitignore...`);
        shell.cp('-R', `${__dirname}/root/Webresources/gitignore`, '.');
        fs.renameSync(`./gitignore`, './.gitignore');
        shell.exec('git add .gitignore');

        console.log(`Updating .eslintrc.json...`);
        shell.cp('-R', `${__dirname}/root/Webresources/.eslintrc.json`, '.');
        shell.exec('git add .eslintrc.json');

        console.log(`Updating postcss.config.js`);
        shell.cp('-R', `${__dirname}/root/Webresources/postcss.config.js`, '.');
        shell.exec('git add postcss.config.js');

        console.log(`Updating karma.conf.js`);
        shell.cp('-R', `${__dirname}/root/Webresources/karma.conf.js`, '.');
        shell.exec('git add karma.conf.js');

        console.log(`Updating tsconfig.json`);
        shell.cp('-R', `${__dirname}/root/Webresources/tsconfig.json`, '.');
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

    private static updatePCF(): void {
        if (!shell.test('-e', '../PCF')) {
            shell.cd('..');
            const crmSettings: CrmJson = JSON.parse(fs.readFileSync('./crm.json', 'utf8'));
            shell.mkdir('PCF');
            shell.cd('PCF');
            shell.mkdir('Solutions');
            shell.cd('Solutions');
            shell.exec(`pac solution init --publisher-name ${crmSettings.crm.publisher_prefix} --publisher-prefix ${crmSettings.crm.publisher_prefix}`);
            shell.cd('..');
            shell.cd('..');
            shell.cd('Webresources');
        }
    }

    private static updateSrcFolder(): void {
        console.log(`Updating Annotation...`);
        shell.cp('-R', `${__dirname}/root/Webresources/src/Annotation`, './src');
        shell.exec('git add src/Annotation');

        console.log(`Updating Http...`);
        shell.cp('-R', `${__dirname}/root/Webresources/src/Http`, './src');
        shell.exec('git add src/Http');

        console.log(`Updating Translation...`);
        shell.cp('-R', `${__dirname}/root/Webresources/src/translation`, './src');
        shell.exec('git add src/translation');

        console.log(`Updating util...`);
        shell.cp('-R', `${__dirname}/root/Webresources/src/util`, './src');
        shell.exec('git add src/util');

        console.log(`Updating WebApi...`);
        shell.cp('-R', `${__dirname}/root/Webresources/src/WebApi`, './src');
        shell.exec('git add src/WebApi');
    }

    private static updateCrmJson(): void {
        if (shell.ls(['./tools/crm.json']).length === 1) {
            //crm.json
            const crmSettings: CrmJson = JSON.parse(fs.readFileSync('./tools/crm.json', 'utf8'));
            shell.cp('-R', `${__dirname}/root/crm.json`, '../');
            shell.sed('-i', new RegExp('<%= publisher %>', 'ig'), crmSettings.crm.publisher_prefix, '../crm.json');
            shell.sed('-i', new RegExp('<%= environment %>', 'ig'), crmSettings.crm.url, '../crm.json');
            shell.sed('-i', new RegExp('<%= namespace %>', 'ig'), (crmSettings as unknown as {webresource: {namespace:string} }).webresource.namespace, '../crm.json');
            shell.exec('git add ../crm.json');

            // Webresources/crm.json
            const webresourcesSettings: WebresourcesCrmJson = JSON.parse(fs.readFileSync('./tools/crm.json', 'utf8'));
            shell.cp('-R', `${__dirname}/root/Webresources/crm.json`, '.');
            shell.sed('-i', new RegExp('<%= solution_name_deploy %>', 'ig'), webresourcesSettings.crm.solution_name_deploy, './crm.json');
            shell.sed('-i', new RegExp('<%= solution_name_generate %>', 'ig'), webresourcesSettings.crm.solution_name_generate, './crm.json');
            shell.exec('git add ./crm.json');

            shell.rm('-rf', `./tools`);
            shell.exec('git rm ./tools');
        }
    }

    private static updatePackageJson(): void {
        console.log(`Updating package.json...`);
        const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
        const {name, description, version} = packageJson;
        const settings: CrmJson = JSON.parse(fs.readFileSync('../crm.json', 'utf8'));
        shell.cp('-R', `${__dirname}/root/Webresources/package.json`, '.');
        const packageJsonFile = shell.ls('package.json')[0];
        shell.sed('-i', new RegExp('<%= projectname %>', 'ig'), name, packageJsonFile);
        shell.sed('-i', new RegExp('<%= description %>', 'ig'), description, packageJsonFile);
        shell.sed('-i', new RegExp('<%= publisher %>', 'ig'), settings.crm.publisher_prefix, packageJsonFile);
        shell.sed('-i', new RegExp('<%= version %>', 'ig'), version, packageJsonFile);
        console.log(`Removing old npm packages. This may take a while...`);
        shell.exec('npm prune');
        shell.exec('npm install');
    }

    private static async updateWebpackConfig(): Promise<void> {
        console.log(`Updating webpack.config...`);
        let oldEntries;
        if (fs.existsSync('./webpack.config.ts')) {
            const regexpTsEntries = /entry: {...entry, ...(?<entries>{[^{]*)}/mg;
            const tsOldFileData = String(fs.readFileSync('./webpack.config.ts'));
            oldEntries = regexpTsEntries.exec(tsOldFileData);
        }
        if (fs.existsSync('./webpack.config.js')) {
            console.log('webpack.config.js exists');
            const jsFileData = String(fs.readFileSync('webpack.config.js'));
            const regexpJsEntries = /entry: (?<entries>{[^{]*})/mg;
            oldEntries = regexpJsEntries.exec(jsFileData);
            shell.exec('git rm webpack.config.js');
        }
        shell.cp('-R', `${__dirname}/root/Webresources/webpack.config.ts`, '.');
        const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
        const {description} = packageJson;
        const settings: CrmJson = JSON.parse(fs.readFileSync('../crm.json', 'utf8'));
        const {namespace, publisher_prefix} = settings.crm;
        let tsFileData = String(fs.readFileSync('./webpack.config.ts'));
        tsFileData = tsFileData.replace(new RegExp('<%= publisher %>', 'ig'), publisher_prefix);
        tsFileData = tsFileData.replace(new RegExp('<%= namespace %>', 'ig'), namespace);
        tsFileData = tsFileData.replace(new RegExp('<%= description %>', 'ig'), description);
        tsFileData = tsFileData.replace(new RegExp('entry: {...entry, ...{}', 'ig'), `entry: {...entry, ...${oldEntries.groups.entries}`);
        shell.ShellString(tsFileData).to('./webpack.config.ts');
        shell.exec('git add webpack.config.ts');
    }
}
