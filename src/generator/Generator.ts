import * as colors from 'colors';
import * as shell from 'shelljs';
import {Entity} from './Entity';
import {Webresource} from './Webresource';
import {LicenseValidator} from './LicenseValidator';
import {Model} from './Model';

export class Generator {
    public static generate(schematic: string, name: string): Promise<void> {
        const supportedSchematics = ['entity', 'webresource', 'model', 'licensevalidator'];
        if (!shell.test('-e', 'src')) {
            console.log(colors.red(`You are not inside the project Webresources folder!`));
        } else if (!schematic) {
            console.log(colors.red(`No schematic specified!`));
        } else if (!supportedSchematics.includes(schematic.toLowerCase())) {
            console.log(colors.red(`Schematic ${schematic} not supported!`));
        } else if (schematic.toLowerCase() === 'entity') {
            return Entity.generateEntity(name);
        } else if (schematic.toLowerCase() === 'webresource') {
            return Webresource.generateWebresource(name);
        } else if(schematic.toLocaleLowerCase() === 'model') {
            console.log(colors.red('Deprecated: please use Entity instead'));
            return Model.generateModel(name);
        } else if (schematic.toLowerCase() === 'licensevalidator') {
            return LicenseValidator.generateLicenseValidator(name);
        }
    }

    public static showGenerateHelp(): void {
        console.log(`Arguments:`);
        console.log(`   ${colors.blue('schematic')}`);
        console.log(`     The schematic or collection:schematic to generate.`);
        console.log(`     Example: Entity, Webresource or LicenseValidator.`);
    }
}
