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
    variables.get(({publisher, projectabbr}) => {
        console.log(`Updating .eslintignore...`);
        shell.cp('-R', `${__dirname}/root/.eslintignore`, '.');
        const eslintignoreFile = shell.ls('.eslintignore')[0];
        shell.sed('-i', new RegExp('<%= publisher %>', 'ig'), publisher, eslintignoreFile);

        console.log(`Updating .gitignore...`);
        shell.cp('-R', `${__dirname}/root/.gitignore`, '.');
        const gitignoreFile = shell.ls('.gitignore')[0];
        shell.sed('-i', new RegExp('<%= publisher %>', 'ig'), publisher, gitignoreFile);

        console.log(`Updating .eslintrc.json...`);
        shell.cp('-R', `${__dirname}/root/.eslintrc.json`, '.');

        console.log(`Updating WebApi...`);
        shell.cp('-R', `${__dirname}/root/src/WebApi`, './src');
        shell.exec('git add src/WebApi/Model.ts');

        console.log(`Updating Translation...`);
        shell.cp('-R', `${__dirname}/root/src/translation`, './src');

        console.log(`Updating package.json...`);
        const packageJsonFile = shell.ls('package.json')[0];
        shell.sed('-i', '"scripts": {', `"scripts": {\n    "lint": "eslint ./ --ext .js,.ts",`, packageJsonFile);
        console.log(`Installing npm packages. This may take a while...`);
        shell.exec('npm install --save-dev @typescript-eslint/eslint-plugin');
        shell.exec('npm install --save-dev @typescript-eslint/parser');

        console.log(`Updating Model files`);
        shell.ls(`src/**/*.model.ts*`).forEach(function (filepath) {
            const split = filepath.split('/'),
                entityname = split[1],
                file = shell.ls(filepath)[0];
            shell.sed('-i', `export`, `import {Model} from '../WebApi/Model';\nexport`, file);
            shell.sed('-i', `interface ${entityname}Model`, `interface ${entityname}Model extends Model`, file);
            console.log(`Modified ${filepath}`);
        });

        console.log(`Updating webpack.config.js...`);
        const webpackConfigFile = shell.ls('webpack.config.js')[0];
        shell.sed('-i', `loader: "tslint-loader",`, `loader: "eslint-loader",`, webpackConfigFile);

        console.log(`Updating tsconfig.json...`);
        const tsconfigJsonFile = shell.ls('src/tsconfig.json')[0];
        shell.sed('-i', '"compilerOptions": {', '"compilerOptions": {\n    "alwaysStrict": true,', tsconfigJsonFile);

        console.log(`Updating D365 Project done`);
    });
};
