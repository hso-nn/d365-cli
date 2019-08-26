#! /usr/bin/env node
const shell = require("shelljs");
const readline = require('readline');
const colors = require('colors');
const inquirer = require('inquirer');

module.exports = {
    generateEntity(entityname) {
        if(!new RegExp("[A-Z]").test(entityname[0])) {
            console.log(colors.red(`Entity name must be UpperCamelCase!`));
        } else if (shell.test('-e', `src/${entityname}`)) {
            console.log(colors.red(`Entity ${entityname} already exists!`));
        } else if (process.argv[5]) {
            console.log(colors.red(`No spaces allowed!`));
        } else {
            generate(entityname);
        }
    }
};

const generate = async (entityname) => {
    console.log(`Adding CE Entity ${entityname}...`);
    const webpackConfigFile = shell.ls('webpack.config.js')[0];
    const answers = await inquirer.prompt([{
        type: 'input',
        name: 'entityLogicalName',
        message: 'Entity LogicalName:'
    }]);

    shell.sed('-i', 'entry: {', `entry: {\n        ${entityname}: [\n            path.resolve(__dirname, "src/${entityname}/${entityname}.ts")\n        ],`, webpackConfigFile);
    shell.mkdir(`src/${entityname}`);
    shell.ls(`${__dirname}/Entity/*.*`).forEach(function (file) {
        const split = file.split('/');
        const filename = split[split.length - 1];
        const newfilename = filename.replace(/Entity/g, entityname);
        shell.cp('-r', file, `src/${entityname}`);
        shell.cp('-r', `src/${entityname}/${filename}`, `src/${entityname}/${newfilename}`);
        shell.rm('-rf', `src/${entityname}/${filename}`);
        shell.sed('-i', new RegExp('EntityLogicalName', 'ig'), answers.entityLogicalName, `src/${entityname}/${newfilename}`);
        shell.sed('-i', new RegExp('Entity', 'ig'), entityname, `src/${entityname}/${newfilename}`);
    });
    console.log("Adding CE Entity done");
};
