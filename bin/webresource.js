#! /usr/bin/env node
const shell = require("shelljs");

module.exports = {
    generateWebresource() {
        const webresourcename = process.argv[4];
        if (!webresourcename) {
            shell.exec(`echo No Webresource name specified!`);
        } else if(!new RegExp("[A-Z]").test(webresourcename[0])) {
            shell.exec(`echo Webresource name must be UpperCamelCase!`);
        } else if (shell.test('-e', `src/${webresourcename}`)) {
            shell.exec(`echo Webresource ${webresourcename} already exists!`);
        } else if (process.argv[5]) {
            shell.exec(`echo No spaces allowed!`);
        } else {
            generate();
        }
    }
};

const generate = () => {
    const webresourcename = process.argv[4];
    shell.exec(`echo Adding CE Webresource ${webresourcename}...`);
    const webpackConfigFile = shell.ls('webpack.config.js')[0];
    shell.sed('-i', 'entry: {', `entry: {\n        ${webresourcename}: [\n            path.resolve(__dirname, "src/${webresourcename}/${webresourcename}.ts")\n        ],`, webpackConfigFile);
    shell.mkdir(`src/${webresourcename}`);
    getVariables(({publisher, projectabbr}) => {
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
        shell.exec("echo Adding CE Webresource done");
    });
};

const getVariables = (handler) =>  {
    let publisher, projectabbr;
    const lineReader = require('readline').createInterface({
        input: require('fs').createReadStream(`webpack.config.js`)
    });
    lineReader.on('line', function (line) {
        if (line.includes('publisher =')) {
            const split = line.split('"');
            publisher = split[1];
        }
        if (line.includes('projectabbr =')) {
            const split = line.split('"');
            projectabbr = split[1];
        }
        if (publisher && projectabbr) {
            lineReader.close();
            handler({
                publisher: publisher,
                projectabbr: projectabbr
            });
            publisher = null;
            projectabbr = null;
        }
    });
};
