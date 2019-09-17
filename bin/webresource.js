#! /usr/bin/env node
const shell = require("shelljs");
const colors = require('colors');
const variables = require("./variables");

module.exports = {
    generateWebresource(webresourcename) {
        if(!new RegExp("[A-Z]").test(webresourcename[0])) {
            console.log(colors.red(`Webresource name must be UpperCamelCase!`));
        } else if (shell.test('-e', `src/${webresourcename}`)) {
            console.log(colors.red(`echo Webresource ${webresourcename} already exists!`));
        } else if (process.argv[5]) {
            console.log(colors.red(`echo No spaces allowed!`));
        } else {
            generate(webresourcename);
        }
    }
};

const generate = (webresourcename) => {
    console.log(`Adding D365 Webresource ${webresourcename}...`);
    variables.get(({publisher, projectabbr}) => {
        const webpackConfigFile = shell.ls('webpack.config.js')[0];
        shell.sed('-i', 'entry: {', `entry: {\n        ${webresourcename}: [\n            path.resolve(__dirname, "src/${webresourcename}/${webresourcename}.ts")\n        ],`, webpackConfigFile);
        shell.mkdir(`src/${webresourcename}`);
        shell.ls(`${__dirname}/Webresource/*.*`).forEach(function (file) {
            const split = file.split('/');
            const filename = split[split.length - 1];
            const newfilename = filename.replace(/Webresource/g, webresourcename);
            shell.cp('-r', file, `src/${webresourcename}`);
            shell.cp('-r', `src/${webresourcename}/${filename}`, `src/${webresourcename}/${newfilename}`);
            shell.rm('-rf', `src/${webresourcename}/${filename}`);
            shell.sed('-i', new RegExp('Webresource', 'ig'), webresourcename, `src/${webresourcename}/${newfilename}`);
            shell.sed('-i', new RegExp('PUBLISHER', 'ig'), publisher, `src/${webresourcename}/${newfilename}`);
            shell.sed('-i', new RegExp('PROJECTABBR', 'ig'), projectabbr, `src/${webresourcename}/${newfilename}`);
        });
        console.log("Adding D365 Webresource done");
    });
};
