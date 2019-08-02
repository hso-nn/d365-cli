#! /usr/bin/env node
const shell = require("shelljs");
const path = require("path");
const readline = require('readline');
const BLUE="\033[1;34m";
const NOCOLOR="\033[0m";

module.exports = {
    createProject() {
        const projectname = process.argv[3];
        if (process.argv.includes('--help')) {
            this.showCreateHelp();
        } else if (process.argv[4]) {
            shell.exec(`echo No spaces allowed!`);
        } else if (shell.test('-e', projectname)) {
            shell.exec(`echo Project ${projectname} already exists!`);
        } /*else if (new RegExp("[AZ]").test(projectname)) {
            shell.exec(`echo No UpperCase allowed!`);
        }*/ else {
            create();
        }
    },
    getHelp() {
        shell.exec(`echo ${BLUE}new${NOCOLOR} (n) Creates a new workspace and an initial Webresource setup.`);
    },
    showCreateHelp() {
        shell.exec(`echo arguments:`);
        shell.exec(`echo   ${BLUE}name${NOCOLOR}`);
        shell.exec(`echo     The name of the new workspace and initial Webresource setup.`);

        shell.exec(`echo options:`);
        shell.exec(`echo   ${BLUE}--help${NOCOLOR}`);
        shell.exec(`echo     Shows a help message for this command in the console.`);
    }
};

const create = () => {
    const projectname = process.argv[3];
    shell.exec(`echo Initializing CE Project ${projectname}...`);
    shell.mkdir(projectname);
    shell.cd(projectname);
    shell.mkdir('Webresources');
    shell.cp('-R', `${__dirname}/root/*.*`, 'Webresources');
    shell.cp('-R', `${__dirname}/root/.*`, 'Webresources');
    shell.cp('-R', `${__dirname}/root/src`, 'Webresources');

    // shell.rm('-rf', 'Webresources/.idea');

    const packageJsonFile = shell.ls('Webresources/package.json')[0];
    const webpackConfigFile = shell.ls('Webresources/webpack.config.js')[0];
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    shell.sed('-i', 'PROJECTNAME', projectname.toLowerCase(), packageJsonFile);
    rl.question('What is the project description? ', function (answer) {
        shell.sed('-i', new RegExp('PROJECTDESCRIPTION', 'ig'), answer, packageJsonFile);
        rl.question('What is the Publisher abbreviation (3 chars a-z)? ', function (answer) {
            shell.sed('-i', new RegExp('PUBLISHER', 'ig'), answer, webpackConfigFile);
            shell.sed('-i', new RegExp('PUBLISHER', 'ig'), answer, packageJsonFile);
            rl.question('What is the Project abbreviation (3 chars a-z)? ', function (answer) {
                shell.sed('-i', new RegExp('PROJECTABBR', 'ig'), answer, webpackConfigFile);
                shell.cd('Webresources');
                shell.exec(`echo Installing npm packages. This may take a while...`);
                // shell.exec('npm install');
                shell.exec("echo Initializing CE Project done");
                shell.exec(`echo ${BLUE}ce generate Entity x${NOCOLOR} in Webresources folder generates Entity x files and settings.`);
                shell.exec(`echo ${BLUE}npm run build:prod${NOCOLOR} in Webresources folder creates the deployment package. See package.json#scripts for all options.`);
                rl.close();
            });
        });
    });
};
