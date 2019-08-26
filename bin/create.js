#! /usr/bin/env node
const shell = require("shelljs");
const readline = require('readline');
const colors = require('colors');

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

const create = () => {
    console.log(`Initializing CE Project ${projectname}...`);
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
