import * as colors from 'colors';
import * as shell from 'shelljs';
import {Variables} from '../Variables';

export class LicenseValidator {
    public static async generateLicenseValidator(licensename: string): Promise<void> {
        const check = shell.grep(` LicenseValidator:`, 'webpack.config.ts');
        if (!licensename) {
            console.log(colors.red('Module name missing'));
        } else if (check.stdout !== '\n') {
            console.log(colors.red(`src/License already exist!`));
        } else if (process.argv[5]) {
            console.log(colors.red(`No spaces allowed!`));
        } else {
            LicenseValidator.generate(licensename);
        }
    }

    private static async generate(licensename: string): Promise<void> {
        console.log(`Adding D365 License Validator for ${licensename}...`);
        shell.exec('npm install --save dlf-core@latest');
        const {publisher, namespace} = await Variables.get();
        shell.mkdir(`src/License`);
        shell.ls(`${__dirname}/License/*.*`).forEach(function (file) {
            const split = file.split('/');
            const filename = split[split.length - 1];
            shell.cp('-r', file, `src/License`);
            shell.sed('-i', new RegExp('<%= licensename %>', 'ig'), licensename, `src/License/${filename}`);
            shell.sed('-i', new RegExp('<%= publisher %>', 'ig'), publisher, `src/License/${filename}`);
            shell.sed('-i', new RegExp('<%= namespace %>', 'ig'), namespace, `src/License/${filename}`);
        });
        const webpackConfigFile = shell.ls('webpack.config.ts')[0];
        // eslint-disable-next-line max-len
        shell.sed('-i', 'entry: {', `entry: {\n        LicenseValidator: [\n            path.resolve(__dirname, "src/License/Validator.ts")\n        ],`, webpackConfigFile);
        shell.exec('git add webpack.config.ts');
        console.log('Adding D365 License Validator done');
    }
}
