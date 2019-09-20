#! /usr/bin/env node
const shell = require("shelljs");
const readline = require('readline');
const colors = require('colors');
const inquirer = require('inquirer');
const variables = require("./variables");

module.exports = {
    generateLicense(licensename) {
        if (shell.test('-e', `src/License`)) {
            console.log(colors.red(`src/License already exists!`));
        } else if (process.argv[5]) {
            console.log(colors.red(`No spaces allowed!`));
        } else {
            generate(licensename);
        }
    }
};

const generate = async (licensename) => {
    console.log(`Adding D365 License ${licensename}...`);
    variables.get(async ({publisher, projectabbr}) => {
        const answers = await inquirer.prompt([{
            type: 'input',
            name: 'validateLicenseAction',
            message: 'Validate License Action',
            default: 'hds_DLFValidateLicense'
        }]);

        shell.mkdir(`src/License`);
        shell.ls(`${__dirname}/License/*.*`).forEach(function (file) {
            const split = file.split('/');
            const filename = split[split.length - 1];
            shell.cp('-r', file, `src/License`);
            shell.sed('-i', new RegExp('<%= licensename %>', 'ig'), licensename, `src/License/${filename}`);
            shell.sed('-i', new RegExp('<%= validateLicenseAction %>', 'ig'), answers.validateLicenseAction, `src/License/${filename}`);
            shell.sed('-i', new RegExp('<%= publisher %>', 'ig'), publisher, `src/License/${filename}`);
            shell.sed('-i', new RegExp('<%= projectabbr %>', 'ig'), projectabbr, `src/License/${filename}`);
        });
        console.log("Adding D365 License done");
    });
};
