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
        Update.updateWebresources();
        Update.updateToolsFolder();
        Update.updateSrcFolder();
        Update.updateProjectRootFolder();
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

        console.log(`Updating tsconfig.json`);
        shell.cp('-R', `${__dirname}/root/tsconfig.json`, '.');
        shell.exec('git add tsconfig.json');
    }

    private static updateWebresources(): void {
        console.log('Updating Webresource files...');
        shell.ls(`src/**/*.html`).forEach(function (filepath) {
            const file = shell.ls(filepath)[0];
            const fileData = String(fs.readFileSync(filepath));
            if (!fileData.match(new RegExp('<script type="text/javascript">\\s*"use strict";\\s*window.Xrm = parent.Xrm;\\s*</script>'))) {
                const match = fileData.match(new RegExp(`<body( [a-zA-Z=" ]*)?>`, 'i'));
                shell.sed('-i', new RegExp(match[0], 'i'), `${match[0]}\n` +
                    `    <script type="text/javascript">\n` +
                    `        "use strict";\n` +
                    `        window.Xrm = parent.Xrm;\n` +
                    `    </script>`, file);
            }
        });
    }

    private static updateToolsFolder(): void {
        console.log('Updating tools folder...');
        shell.rm('-rf', `tools/deploy.js`);
        shell.exec('git rm tools/deploy.js');
    }

    private static updateSrcFolder(): void {
        if (shell.ls(['./tsconfig.json']).length !== 1) {
            console.log(`Remove src/tsconfig.json...`);
            shell.exec('git rm src/tsconfig.json');
            shell.rm(['./src/tsconfig.json']);
        }

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
        console.log(`Updating Service files...`);
        shell.ls(`src/**/*.service.ts*`).forEach(function (filepath) {
            Update.updateServiceModel(filepath);
        });
    }

    private static updateServiceModel(filepath: string): void {
        const file = shell.ls(filepath)[0];
        const serviceCheck = shell.grep(` Model.`, filepath);
        if (serviceCheck.stdout !== '\n') {
            shell.sed('-i', new RegExp(` Model\\.`, 'ig'), ' Service.', file);
            shell.sed('-i', new RegExp(`export class`, 'i'), `import {Service} from '../WebApi/Service';\nexport class`, file);
        }
        shell.sed('-i', `import {Model} from '../WebApi/Model';`, ``, file);
    }

    private static updateModelFiles(): void {
        console.log(`Updating Model files...`);
        shell.ls(`src/**/*.model.ts*`).forEach(function (filepath) {
            const filedata = String(fs.readFileSync(filepath));
            if (filedata.includes('export enum')) {
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

    private static updateEntityFiles(): void {
        console.log('Updating Entity files...');
        shell.ls(`src/**/*.ts*`).forEach(function (filepath) {
            const file = shell.ls(filepath)[0];
            const modelCheck = shell.grep('.model', filepath);
            if (modelCheck.stdout !== '\n') {
                shell.sed('-i', new RegExp(`// import.*\\.model';`, 'ig'), '', file);
                shell.sed('-i', new RegExp(`import.*\\.model';`, 'ig'), '', file);
                shell.sed('-i', new RegExp(`import.*WebApi/Model';`, 'ig'), '', file);
                shell.sed('-i', new RegExp(`import.*WebApi/WebApi';`, 'ig'), `import {WebApi} from '../WebApi/WebApi';`, file);
            }
            shell.sed('-i', '// eslint-disable-next-line @typescript-eslint/ban-ts-ignore', '// eslint-disable-next-line @typescript-eslint/ban-ts-comment', file);
        });
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
