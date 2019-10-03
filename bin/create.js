#! /usr/bin/env node
const shell = require("shelljs");
const colors = require('colors');
const inquirer = require('inquirer');

module.exports = {
    createProject(projectname) {
        if (process.argv[4]) {
            console.log(colors.red(`No spaces allowed!`));
        } else if (shell.test('-e', projectname)) {
            console.log(colors.red(`Project ${projectname} already exists!`));
        } else {
            create(projectname);
        }
    },
    showCreateHelp() {
        console.log(`Arguments:`);
        console.log('   ' + colors.blue('project'));
        console.log(`     The project name of the new workspace and initial Webresource setup.`);
    }
};

const create = async (projectname) => {
    console.log(`Initializing D365 Project ${projectname}...`);
    shell.mkdir(projectname);
    shell.cd(projectname);
    shell.mkdir('Webresources');
    shell.cp('-R', `${__dirname}/root/*`, 'Webresources');
    shell.cp('-R', `${__dirname}/root/.*`, 'Webresources');

    const answers = await inquirer.prompt([{
        type: 'input',
        name: 'description',
        message: 'Project description:'
    }, {
        type: 'input',
        name: 'solution',
        message: 'Solution name (should match D365 environment):'
    }, {
        type: 'input',
        name: 'environment',
        message: 'The environment url (eg. https://yourproject.crm4.dynamics.com):'
    }, {
        type: 'input',
        name: 'publisher',
        message: 'Publisher abbreviation (3 chars a-z):'
    }, {
        type: 'input',
        name: 'projectabbr',
        message: 'Project abbreviation (3 chars a-z):'
    }]);

    const crmJsonFile = shell.ls('Webresources/deploy/crm.json')[0];
    shell.sed('-i', new RegExp('<%= publisher %>', 'ig'), answers.publisher, crmJsonFile);
    shell.sed('-i', new RegExp('<%= solution %>', 'ig'), answers.solution, crmJsonFile);
    shell.sed('-i', new RegExp('<%= environment %>', 'ig'), answers.environment, crmJsonFile);

    const packageJsonFile = shell.ls('Webresources/package.json')[0];
    shell.sed('-i', '<%= projectname %>', projectname.toLowerCase(), packageJsonFile);
    shell.sed('-i', new RegExp('<%= description %>', 'ig'), answers.description, packageJsonFile);
    shell.sed('-i', new RegExp('<%= publisher %>', 'ig'), answers.publisher, packageJsonFile);

    const webpackConfigFile = shell.ls('Webresources/webpack.config.js')[0];
    shell.sed('-i', new RegExp('<%= publisher %>', 'ig'), answers.publisher, webpackConfigFile);
    shell.sed('-i', new RegExp('<%= projectabbr %>', 'ig'), answers.projectabbr, webpackConfigFile);
    shell.sed('-i', new RegExp('<%= description %>', 'ig'), answers.projectabbr, webpackConfigFile);

    const eslintignoreFile = shell.ls('Webresources/.eslintignore')[0];
    shell.sed('-i', new RegExp('<%= publisher %>', 'ig'), answers.publisher, eslintignoreFile);

    const gitignoreFile = shell.ls('Webresources/.gitignore')[0];
    shell.sed('-i', new RegExp('<%= publisher %>', 'ig'), answers.publisher, gitignoreFile);

    shell.cd('Webresources');
    console.log(`Installing npm packages. This may take a while...`);
    shell.exec('npm install');
    console.log('Initializing D365 Project done');
    console.log(`${colors.blue('ce generate Entity x')} in Webresources folder generates Entity x files and settings.`);
    console.log(`${colors.blue('npm run build:prod')} in Webresources folder creates the deployment package.`);
    console.log(`See package.json#scripts for all options.`);
};
