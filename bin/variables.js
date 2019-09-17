
module.exports = {
    get(handler) {
        let publisher, projectabbr;
        const lineReader = require('readline').createInterface({
            input: require('fs').createReadStream(`webpack.config.js`)
        });
        lineReader.on('line', function (line) {
            if (line.includes('dir_build =')) {
                const split = line.split('"'),
                    publisherProjectabbr = split[1],
                    ppSplit = publisherProjectabbr.split("_/");
                publisher = ppSplit[0];
                projectabbr = ppSplit[1];
                lineReader.close();
                handler({
                    publisher: publisher,
                    projectabbr: projectabbr
                });
            }
        });
    }
};
