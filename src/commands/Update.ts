import * as colors from 'colors';
import shell from 'shelljs';
import fs from 'fs';
import {CrmJson} from '../root/CrmJson';
import cp from 'child_process';

export class Update {
    public static updateProject(): Promise<void> {
        if (process.argv[3]) {
            console.log(colors.red(`No spaces allowed after update command!`));
        } else if (!shell.test('-e', 'src')) {
            console.log(colors.red(`You are not inside the project Webresources folder!`));
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
        Update.updateEntityFiles();
        Update.updateFormFiles();
        Update.updatePackageJson();
        await Update.updateWebpackConfig();
        console.log(`Updating D365 Project done`);
    }

    // eslint-disable-next-line max-lines-per-function
    private static updateProjectRootFolder(): void {
        console.log(`Updating .eslintignore...`);
        shell.cp('-R', `${__dirname}/root/Webresources/.eslintignore`, '.');
        if (shell.test('-e', '../.git')) {
            cp.execFileSync('git', ['add', '.eslintignore']);
        }
        // shell.exec('git add .eslintignore');

        console.log(`Updating .gitignore...`);
        shell.cp('-R', `${__dirname}/root/Webresources/gitignore`, '.');
        fs.renameSync(`./gitignore`, './.gitignore');
        if (shell.test('-e', '../.git')) {
            cp.execFileSync('git', ['add', '.gitignore']);
        }
        // shell.exec('git add .gitignore');

        console.log(`Updating .eslintrc.json...`);
        shell.cp('-R', `${__dirname}/root/Webresources/.eslintrc.json`, '.');
        if (shell.test('-e', '../.git')) {
            cp.execFileSync('git', ['add', '.eslintrc.json']);
        }
        // shell.exec('git add .eslintrc.json');

        console.log(`Updating postcss.config.js`);
        shell.cp('-R', `${__dirname}/root/Webresources/postcss.config.js`, '.');
        if (shell.test('-e', '../.git')) {
            cp.execFileSync('git', ['add', 'postcss.config.js']);
        }
        // shell.exec('git add postcss.config.js');

        console.log(`Updating karma.conf.js`);
        shell.cp('-R', `${__dirname}/root/Webresources/karma.conf.js`, '.');
        if (shell.test('-e', '../.git')) {
            cp.execFileSync('git', ['add', 'karma.conf.js']);
        }
        // shell.exec('git add karma.conf.js');

        console.log(`Updating tsconfig.json`);
        shell.cp('-R', `${__dirname}/root/Webresources/tsconfig.json`, '.');
        if (shell.test('-e', '../.git')) {
            cp.execFileSync('git', ['add', 'tsconfig.json']);
        }
        // shell.exec('git add tsconfig.json');
    }

    private static updateEntityFiles(): void {
        console.log(`Updating Entity files...`);
        const crmSettings: CrmJson = JSON.parse(fs.readFileSync('../crm.json', 'utf8'));
        const crm = crmSettings.crm;
        shell.ls(`src/**/*.ts*`).forEach(function (filepath) {
            const fileData = String(fs.readFileSync(filepath));
            const match = fileData.match(new RegExp(`specify Form onLoad function: ${crm.publisher_prefix}.${crm.namespace}.([^\\W]*).Form.onLoad`));
            if (match) {
                // const entityName_formName = match[1];
                // const split = entityName_formName.split('_');
                // const newFileData = fileData.replace(new RegExp(entityName_formName, 'ig'), `${split[0]}.${split[1]}`);
                // shell.ShellString(newFileData).to(filepath);
            }
        });

        // Add Entity.form.ts file when missing
        shell.ls(`src/**/build.json`).forEach(function (buildFilepath) {
            const split = buildFilepath.split('/');
            const entityName = split[1];
            // formContext.ts check is to prevent adding to webresource
            if (fs.existsSync(`src/${entityName}/${entityName}.formContext.ts`) &&
                !fs.existsSync(`src/${entityName}/${entityName}.form.ts`)) {
                console.log(`Adding ${entityName}/${entityName}.form.ts...`);
                const filepath = `src/${entityName}/${entityName}.form.ts`;
                shell.cp('-r', `${__dirname}/Entity/Entity.form.ts`, filepath);
                shell.sed('-i', new RegExp('Entity', 'g'), entityName, filepath);
                if (shell.test('-e', '../.git')) {
                    cp.execFileSync('git', ['add', filepath]);
                }
                console.log(`Added ${entityName}/${entityName}.form.ts`);
            }
        });
    }

    private static updateFormFiles(): void {
        console.log(`Updating Form files...`);
        shell.ls(`src/**/*.form.ts*`).forEach(function (filepath) {
            const split = filepath.split('/');
            if (split.length === 4) { // Entity/EntityForm/EntityForm.form.ts
                const fileData = String(fs.readFileSync(filepath));
                const match = fileData.match(new RegExp('export class ([a-zA-Z]*)Form {'));
                if (match) {
                    // const entityName = match[1];
                    // const importString = `import {${entityName}FormContext} from './${entityName}.formContext';`;
                    // const newExportString = `export class ${entityName}Form extends ${entityName}FormContext {`;
                    // shell.sed('-i', new RegExp(`export class ${entityName}Form {`, 'i'), `${importString}\n${newExportString}`, filepath);
                }
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

    // eslint-disable-next-line max-lines-per-function
    private static updateSrcFolder(): void {
        console.log(`Updating Annotation...`);
        shell.cp('-R', `${__dirname}/root/Webresources/src/Annotation`, './src');
        if (shell.test('-e', '../.git')) {
            cp.execFileSync('git', ['add', 'src/Annotation']);
        }
        // shell.exec('git add src/Annotation');

        console.log(`Updating Http...`);
        shell.cp('-R', `${__dirname}/root/Webresources/src/Http`, './src');
        if (shell.test('-e', '../.git')) {
            cp.execFileSync('git', ['add', 'src/Http']);
        }
        // shell.exec('git add src/Http');

        console.log(`Updating Translation...`);
        shell.cp('-R', `${__dirname}/root/Webresources/src/translation`, './src');
        if (shell.test('-e', '../.git')) {
            cp.execFileSync('git', ['add', 'src/translation']);
        }
        // shell.exec('git add src/translation');

        console.log(`Updating util...`);
        shell.cp('-R', `${__dirname}/root/Webresources/src/util`, './src');
        if (shell.test('-e', '../.git')) {
            cp.execFileSync('git', ['add', 'src/util']);
        }
        // shell.exec('git add src/util');

        console.log(`Updating WebApi...`);
        shell.cp('-R', `${__dirname}/root/Webresources/src/WebApi`, './src');
        if (shell.test('-e', '../.git')) {
            cp.execFileSync('git', ['add', 'src/WebApi']);
        }
        // shell.exec('git add src/WebApi');
    }

    // eslint-disable-next-line max-lines-per-function
    private static updateCrmJson(): void {
        const crmSettings: CrmJson = JSON.parse(fs.readFileSync('../crm.json', 'utf8'));
        shell.cp('-R', `${__dirname}/root/crm.json`, '../');
        shell.sed('-i', new RegExp('<%= publisher_prefix %>', 'ig'), crmSettings.crm.publisher_prefix, '../crm.json');
        shell.sed('-i', new RegExp('<%= environment %>', 'ig'), crmSettings.crm.url, '../crm.json');
        shell.sed('-i', new RegExp('<%= namespace %>', 'ig'), crmSettings.crm.namespace, '../crm.json');
        if (shell.test('-e', '../.git')) {
            cp.execFileSync('git', ['add', '../crm.json']);
        }
        const version = shell.exec('hso-d365 --version').stdout.replace(/\n/ig, '');
        shell.sed('-i', new RegExp('<%= version %>', 'ig'), version, '../crm.json');
        if (shell.test('-e', '../.git')) {
            cp.execFileSync('git', ['add', '../crm.json']);
        }
        // shell.exec('git add ../crm.json');
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
        shell.cp('-R', `${__dirname}/root/Webresources/webpack.config.ts`, '.');
        if (shell.test('-e', '../.git')) {
            cp.execFileSync('git', ['add', 'webpack.config.ts']);
        }
    }
}
