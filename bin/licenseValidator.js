#! /usr/bin/env node
const shell = require("shelljs");
const colors = require('colors');
const variables = require("./variables");

module.exports = {
    generateLicenseValidator(licensename) {
        const check = shell.grep(`LicenseValidator:`, 'webpack.config.js');
        if (check.stdout !== '\n') {
            console.log(colors.red(`src/License already exists!`));
        } else if (process.argv[5]) {
            console.log(colors.red(`No spaces allowed!`));
        } else {
            generate(licensename);
        }
    }
};

const generate = async (licensename) => {
    console.log(`Adding D365 License Validator for ${licensename}...`);
    variables.get(async ({publisher, projectabbr}) => {
        shell.mkdir(`src/License`);
        shell.ls(`${__dirname}/License/*.*`).forEach(function (file) {
            const split = file.split('/');
            const filename = split[split.length - 1];
            shell.cp('-r', file, `src/License`);
            shell.sed('-i', new RegExp('<%= licensename %>', 'ig'), licensename, `src/License/${filename}`);
            shell.sed('-i', new RegExp('<%= publisher %>', 'ig'), publisher, `src/License/${filename}`);
            shell.sed('-i', new RegExp('<%= projectabbr %>', 'ig'), projectabbr, `src/License/${filename}`);
        });
        const webpackConfigFile = shell.ls('webpack.config.js')[0];
        shell.sed('-i', 'entry: {', `entry: {\n        LicenseValidator: [\n            path.resolve(__dirname, "src/License/Validator.ts")\n        ],`, webpackConfigFile);
        console.log("Adding D365 License Validator done");
    });
};
