#! /usr/bin/env node
const shell = require("shelljs");
const colors = require('colors');
const inquirer = require('inquirer');
const variables = require("./variables");

module.exports = {
    updateProject() {
        if (process.argv[3]) {
            console.log(colors.red(`No spaces allowed after update command!`));
        } else {
            update();
        }
    },
    showUpdateHelp() {
        console.log(`Arguments:`);
    }
};

const update = async () => {
    console.log(`Updating D365 Project...`);
    variables.get(({publisher, projectabbr, description, projectname, version, solution, environment}) => {
        console.log(`Updating .eslintignore...`);
        shell.cp('-R', `${__dirname}/root/.eslintignore`, '.');

        console.log(`Updating .gitignore...`);
        shell.cp('-R', `${__dirname}/root/.gitignore`, '.');

        console.log(`Updating .eslintrc.json...`);
        shell.cp('-R', `${__dirname}/root/.eslintrc.json`, '.');

        console.log(`Updating postcss.config.js`);
        shell.cp('-R', `${__dirname}/root/postcss.config.js`, '.');

        console.log(`Updating tsconfig.json...`);
        shell.cp('-R', `${__dirname}/root/src/tsconfig.json`, './src');

        console.log(`Updating deploy...`);
        shell.cp('-R', `${__dirname}/root/deploy/deploy.js`, './deploy');
        const check = shell.grep(`clientUrl`, './deploy/crm.json');
        if (check.stdout !== '\n') {
            shell.cp('-R', `${__dirname}/root/deploy/crm.json`, './deploy');
            const crmJsonFile = shell.ls('./deploy/crm.json')[0];
            shell.sed('-i', new RegExp('<%= publisher %>', 'ig'), publisher, crmJsonFile);
            shell.sed('-i', new RegExp('<%= solution %>', 'ig'), solution, crmJsonFile);
            shell.sed('-i', new RegExp('<%= environment %>', 'ig'), environment, crmJsonFile);
        }

        console.log(`Updating WebApi...`);
        shell.cp('-R', `${__dirname}/root/src/WebApi`, './src');
        shell.exec('git add src/WebApi/Model.ts');

        console.log(`Updating Annotation...`);
        shell.cp('-R', `${__dirname}/root/src/Annotation`, './src');

        console.log(`Updating Translation...`);
        shell.cp('-R', `${__dirname}/root/src/translation`, './src');

        console.log(`Updating txs...`);
        shell.cp('-R', `${__dirname}/root/src/tsx`, './src');

        console.log(`Updating package.json...`);
        const dlfCoreCheck = shell.grep(`dlf-core`, 'package.json');
        shell.cp('-R', `${__dirname}/root/package.json`, '.');
        const packageJsonFile = shell.ls('package.json')[0];
        shell.sed('-i', new RegExp('<%= projectname %>', 'ig'), projectname, packageJsonFile);
        shell.sed('-i', new RegExp('<%= description %>', 'ig'), description, packageJsonFile);
        shell.sed('-i', new RegExp('<%= publisher %>', 'ig'), publisher, packageJsonFile);
        shell.sed('-i', new RegExp('<%= version %>', 'ig'), version, packageJsonFile);
        if (dlfCoreCheck.stdout !== '\n') {
            shell.exec('npm install --save dlf-core@latest');
        }

        console.log(`Removing old npm packages. This may take a while...`);
        shell.exec('npm prune');

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
                    shell.sed('-i', `export function onLoad(executionContext: Xrm.Events.EventContext) {`, `onLoad: (executionContext: Xrm.Events.EventContext): void => {`, file);
                    shell.sed('-i', `\\(formContext: Xrm.FormContext\\) {`, `: (formContext: Xrm.FormContext): void => {`, file);
                    // shell.sed('-i', `export function `, ``, file); too much
                    console.log(`Modified ${split[1]}.ts ${split[2]}`);
                }
            }
        });

        console.log(`Updating webpack.config.js...`);
        const webpackConfigFile = shell.ls('webpack.config.js')[0];
        shell.sed('-i', new RegExp(`loader: "tslint-loader",`, 'ig'), `loader: "eslint-loader",`, webpackConfigFile);
        shell.sed('-i', new RegExp(`\\[".js", ".json", ".ts"\\]`, 'ig'), `[".js", ".json", ".ts", ".tsx"]`, webpackConfigFile);
        shell.sed('-i', new RegExp(`ts\\$/,`, 'ig'), `tsx?$/,`, webpackConfigFile);
        const distCheck = shell.grep(`dist`, 'webpack.config.js');
        if (distCheck.stdout === '\n') {
            shell.sed('-i', new RegExp(`${publisher}_`, 'ig'), `dist/${publisher}_`, webpackConfigFile);
        }
        console.log(`Updating D365 Project done`);
    });
};
