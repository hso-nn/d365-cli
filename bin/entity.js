#! /usr/bin/env node
const shell = require("shelljs");
const readline = require('readline');

module.exports = {
    generateEntity() {
        const entityname = process.argv[4];
        if (!entityname) {
            shell.exec(`echo No Entity name specified!`);
        } else if(!new RegExp("[A-Z]").test(entityname[0])) {
            shell.exec(`echo Entity name must be UpperCamelCase!`);
        } else if (shell.test('-e', `src/${entityname}`)) {
            shell.exec(`echo Entity ${entityname} already exists!`);
        } else if (process.argv[5]) {
            shell.exec(`echo No spaces allowed!`);
        } else {
            generate();
        }
    }
};

const generate = () => {
    const entityname = process.argv[4];
    shell.exec(`echo Adding CE Entity ${entityname}...`);
    const webpackConfigFile = shell.ls('webpack.config.js')[0];
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question('What is the Entity Logical Name? ', function (entityLogicalName) {
        shell.sed('-i', 'entry: {', `entry: {\n        ${entityname}: [\n            path.resolve(__dirname, "src/${entityname}/${entityname}.ts")\n        ],`, webpackConfigFile);
        shell.mkdir(`src/${entityname}`);
        shell.ls(`${__dirname}/Entity/*.*`).forEach(function (file) {
            const split = file.split('/');
            const filename = split[split.length - 1];
            const newfilename = filename.replace(/Entity/g, entityname);
            shell.cp('-r', file, `src/${entityname}`);
            shell.cp('-r', `src/${entityname}/${filename}`, `src/${entityname}/${newfilename}`);
            shell.rm('-rf', `src/${entityname}/${filename}`);
            shell.sed('-i', 'EntityLogicalName', entityLogicalName, `src/${entityname}/${newfilename}`);
            shell.sed('-i', 'Entity', entityname, `src/${entityname}/${newfilename}`);
            shell.sed('-i', '/Entity', `/${entityname}`, `src/${entityname}/${newfilename}`);
        });
        shell.exec("echo Adding CE Entity done");
        rl.close();
    });
};
