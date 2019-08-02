#! /usr/bin/env node
const shell = require("shelljs");
const entity = require('./entity');
const webresource = require('./webresource');
const BLUE="\033[1;34m";
const NOCOLOR="\033[0m";

module.exports = {
    generate() {
        const schematic = process.argv[3];
        const supportedSchematics = ['entity', 'webresource'];
        if (process.argv.includes('--help')) {
            this.showGenerateHelp();
        } else if (!shell.test('-e', 'src')) {
            shell.exec(`echo You are not inside the project Webresources folder!`);
        } else if (!schematic) {
            shell.exec(`echo No schematic specified!`);
        } else if (!supportedSchematics.includes(schematic.toLowerCase())) {
            shell.exec(`echo Schematic ${schematic} not supported!`);
        } else if (schematic.toLowerCase() === 'entity') {
            entity.generateEntity();
        } else if (schematic.toLowerCase() === 'webresource') {
            webresource.generateWebresource();
        }
    },
    getHelp() {
        shell.exec(`echo ${BLUE}generate${NOCOLOR} (g) Generates and/or modifies files bases on a schematic.`);
    },
    showGenerateHelp() {
        shell.exec(`echo arguments:`);
        shell.exec(`echo   ${BLUE}schematic${NOCOLOR}`);
        shell.exec(`echo     The schematic or collection:schematic to generate.`);
        shell.exec(`echo     Example: Entity.`);

        shell.exec(`echo options:`);
        shell.exec(`echo   ${BLUE}--help${NOCOLOR}`);
        shell.exec(`echo     Shows a help message for this command in the console.`);
    }
};
