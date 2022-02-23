import colors from 'colors';
import * as shell from 'shelljs';
import {CrmJson} from '../../root/CrmJson';
import fs from 'fs';
import path from 'path';
import cp from 'child_process';

export class LicenseValidator {
    public static async generateLicenseValidator(licensename: string): Promise<void> {
        const exist = fs.existsSync(path.resolve(__dirname, `src/License/Validator/Validator.ts`));
        if (!licensename) {
            console.log(colors.red('Module name missing'));
        } else if (exist) {
            console.log(colors.red(`src/License already exist!`));
        } else if (process.argv[5]) {
            console.log(colors.red(`No spaces allowed!`));
        } else {
            LicenseValidator.generate(licensename);
        }
    }

    private static async generate(licensename: string): Promise<void> {
        console.log(`Adding D365 License Validator for ${licensename}...`);
        // shell.exec('npm install --save dlf-core@latest');
        const settings: CrmJson = JSON.parse(fs.readFileSync('../crm.json', 'utf8'));
        const {namespace, publisher_prefix} = settings.crm;
        shell.mkdir(`src/License`);
        shell.cp('-R', `${__dirname}/License/*`, './src/License');
        shell.ls(`${__dirname}/License/Validator/*.*`).forEach(function (file) {
            const split = file.split('/');
            const filename = split[split.length - 1];
            shell.sed('-i', new RegExp('<%= licensename %>', 'ig'), licensename, `src/License/Validator/${filename}`);
            shell.sed('-i', new RegExp('<%= publisher %>', 'ig'), publisher_prefix, `src/License/Validator/${filename}`);
            shell.sed('-i', new RegExp('<%= namespace %>', 'ig'), namespace, `src/License/Validator/${filename}`);
        });
        if (shell.test('-e', '../.git')) {
            cp.execFileSync('git', ['add', 'src/License']);
        }
        // eslint-disable-next-line max-len
        console.log('Adding D365 License Validator done');
    }
}
