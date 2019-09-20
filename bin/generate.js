#! /usr/bin/env node
const shell = require("shelljs");
const entity = require('./entity');
const webresource = require('./webresource');
const license = require('./license');
const colors = require('colors');

module.exports = {
    generate(schematic, name) {
        const supportedSchematics = ['entity', 'webresource', 'license'];
        if (!shell.test('-e', 'src')) {
            console.log(colors.red(`You are not inside the project Webresources folder!`));
        } else if (!schematic) {
            console.log(colors.red(`No schematic specified!`));
        } else if (!supportedSchematics.includes(schematic.toLowerCase())) {
            console.log(colors.red(`Schematic ${schematic} not supported!`));
        } else if (schematic.toLowerCase() === 'entity') {
            entity.generateEntity(name);
        } else if (schematic.toLowerCase() === 'webresource') {
            webresource.generateWebresource(name);
        } else if (schematic.toLowerCase(name) === 'license') {
            license.generateLicense(name);
        }
    },
    showGenerateHelp() {
        console.log(`Arguments:`);
        console.log(`   ${colors.blue('schematic')}`);
        console.log(`     The schematic or collection:schematic to generate.`);
        console.log(`     Example: Entity, Webresource or License.`);
    }
};
