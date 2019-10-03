
module.exports = {
    get(handler) {
        readWebpackConfig(webpackConfigData => {
            readPackageJson(packageJsonData => {
                readCrmJson(crmJsonData => {
                    handler(Object.assign({}, webpackConfigData, packageJsonData, crmJsonData));
                })
            });
        });
    }
};

const readWebpackConfig = handler => {
    let publisher, projectabbr;
    const lineReader = require('readline').createInterface({
        input: require('fs').createReadStream(`webpack.config.js`)
    });
    lineReader.on('line', function (line) {
        if (line.includes('dir_build =')) {
            const split = line.split('"'),
                publisherProjectabbr = split[1],
                ppSplit = publisherProjectabbr.split("_/");
            publisher = ppSplit[0].replace('dist/', '');
            projectabbr = ppSplit[1];
            lineReader.close();
            handler({
                publisher: publisher,
                projectabbr: projectabbr
            });
        }
    });
};

const readPackageJson = handler => {
    let projectname, description, version;
    const lineReader = require('readline').createInterface({
        input: require('fs').createReadStream(`package.json`)
    });
    lineReader.on('line', function (line) {
        if (line.includes('"name":')) {
            const split = line.split('"');
            projectname = split[3];
        }
        if (line.includes('"version":')) {
            const split = line.split('"');
            version = split[3];
        }
        if (line.includes('"description":')) {
            const split = line.split('"');
            description = split[3];
            lineReader.close();
            handler({
                description: description,
                projectname: projectname,
                version: version
            });
        }
    });
};

const readCrmJson = handler => {
    let environment, solution;
    const lineReader = require('readline').createInterface({
        input: require('fs').createReadStream(`deploy/crm.json`)
    });
    lineReader.on('line', function (line) {
        if (line.includes('"solution_name":')) {
            const split = line.split('"');
            solution = split[3];
        }
        if (line.includes('"clientUrl":')) {
            const split = line.split('"');
            environment = split[3];
        }
        if (line.includes('"redirectUri":')) {
            lineReader.close();
            handler({
                environment: environment,
                solution: solution
            });
        }
    });
};
