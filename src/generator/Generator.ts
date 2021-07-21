import colors from 'colors';
import * as shell from 'shelljs';
import {Entity} from './Entity';
import {Webresource} from './Webresource';
import {EnvironmentVariable} from './EnvironmentVariable';
import {LicenseValidator} from './LicenseValidator';

export class Generator {
    public static generate(schematic: string, name: string): Promise<void> {
        const supportedSchematics = ['entity', 'webresource', 'model', 'licensevalidator', 'environmentvariable'];
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
            console.log(colors.red('Not supported anymore: please use Entity instead'));
        } else if (schematic.toLowerCase() === 'licensevalidator') {
            return LicenseValidator.generateLicenseValidator(name);
        } else if(schematic.toLowerCase() === 'environmentvariable') {
            return EnvironmentVariable.generateEnvironmentVariable();
        }
    }

    public static showGenerateHelp(): void {
        console.log(`Arguments:`);
        console.log(`   ${colors.blue('schematic')}`);
        console.log(`     The schematic or collection:schematic to generate.`);
        console.log(`     Example: Entity, Webresource or LicenseValidator.`);
    }
}
