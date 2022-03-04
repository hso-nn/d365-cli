import shell from 'shelljs';
import program from 'commander';
import {Create} from './Create';
import {Update} from './Update';
import {Generator} from './generators/Generator';
import {Deploy} from './Deploy';
import {Resx} from './Resx';
import {SetFormCustomizable} from './SetFormCustomizable';
import packageJson from '../../package.json';
import {RegeneratorRouter} from '../routers/RegerenatorRouter';
import {PCF} from './PCF';
import {CrmJson} from '../root/CrmJson';
import fs from 'fs';
import colors from 'colors';

const checkVersion = (): boolean => {
    if (shell.test('-e', 'src')) {
        const cliVersion = shell.exec('hso-d365 --version').stdout.replace(/\n/ig, '');
        const crmSettings: CrmJson = JSON.parse(fs.readFileSync('../crm.json', 'utf8'));
        if (cliVersion !== crmSettings.version) {
            console.log(colors.red(`Version mismatch!`));
            console.log(`CLI version: ${colors.red(cliVersion)}`);
            console.log(`Project version: ${colors.red(crmSettings.version)}`);
            console.log(`Please update project (hso-d365 update) or CLI (npm i -g @hso/d365-cli@${crmSettings.version}) first.`);
            return false;
        }
    } else {
        console.log(colors.red(`You are not inside the project Webresources folder!`));
        return false;
    }
    return true;
};

const hasHigherVersion = () => {
    if (shell.test('-e', 'src')) {
        const cliVersion = shell.exec('hso-d365 --version').stdout.replace(/\n/ig, '');
        const crmSettings: CrmJson = JSON.parse(fs.readFileSync('../crm.json', 'utf8'));
        if (crmSettings) {
            const cliVersionSplit = cliVersion.split('.');
            const projVersionSplit = crmSettings.version.split('.');
            for (let i = 0; i < 3; i += 1) {
                if (cliVersionSplit[i] < projVersionSplit[i]) {
                    console.log(colors.red(`Version mismatch! You try to do a downgrade!`));
                    console.log(`CLI version: ${colors.red(cliVersion)}`);
                    console.log(`Project version: ${colors.red(crmSettings.version)}`);
                    console.log(`Please update CLI (npm i -g @hso/d365-cli@${crmSettings.version}) first.`);
                    return false;
                }
            }
        }
    } else {
        console.log(colors.red(`You are not inside the project Webresources folder!`));
        return false;
    }
    return true;
};

program
    .version(packageJson.version)
    .usage('<command> [options]');

program
    .command('new <name>')
    .alias('n')
    .description('Creates a new workspace and an initial Webresource and PCF setup or creates a new PCF component')
    .action((name: string) => {
        if (shell.test('-e', '../pcf')) {
            PCF.createComponent(name);
        } else {
            Create.createProject(name);
        }
    })
    .on('--help', () => {
        Create.showCreateHelp();
    });

program
    .command('regenerate')
    .alias('rg')
    .description('Regenerates files')
    .action(async () => {
        if (checkVersion()) {
            await RegeneratorRouter.regenerate();
        }
    })
    .on('--help', () => {
        console.log(`Regenerates files`);
    });

program
    .command('generate <schematic> [name]')
    .alias('g')
    .option('-s, --skipForms', 'Skip generating form files')
    .description('Generates and/or modifies files bases on a schematic.')
    .action((schematic: string, name: string, options) => {
        if (checkVersion()) {
            Generator.generate(schematic, name, options);
        }
    })
    .on('--help', () => {
        Generator.showGenerateHelp();
    });

program
    .command('extractTranslations')
    .alias('extract')
    .description('Extracts translation to resx files')
    .action(() => {
        Resx.extract();
    }).on('--help', () => {
        console.log(`In translation folder a folder 'locales' will be generated having translation files.`);
        console.log(`It will generate one locales.resx file.`);
        console.log(`You have to add for each required language a copy yourself like locales.1033.resx.`);
        console.log(`Once done, the tooling will keep up-to-date for you.`);
    });

program
    .command('lint')
    .alias('l')
    .description('Runs linting tools on project code')
    .action(() => {
        shell.exec('npm run lint');
    })
    .on('--help', () => {
        console.log(`Runs linting tools on project code using the configuration as specified in your projects '.eslintrc.json' file`);
    });

program
    .command('build')
    .alias('b')
    .description('Compiles project into an output directory named dist')
    .action(() => {
        if (shell.test('-f', 'Solutions.cdsproj')) {
            PCF.build();
        } else {
            shell.exec('npm run build:prod');
        }
    })
    .on('--help', () => {
        console.log(`The command can be used to build the project to be distributed to the D365 environment using the 'deploy' command`);
    });

program
    .command('deploy')
    .option('-f, --force', 'Force unmodified files as well')
    .description('Invokes the deploy builder')
    .action(({force}) => {
        if (shell.test('-f', 'Solutions.cdsproj') || shell.test('-f', 'pcfconfig.json')) {
            PCF.deploy();
        } else {
            Deploy.deployProject(force);
        }
    }).on('--help', () => {
        console.log(`Distributes the project to the D365 environment. You need to run the 'build' command first`);
    });

program
    .command('update')
    .alias('u')
    .description('Updates existing workspace and Webresource setup')
    .action(() => {
        if (hasHigherVersion()) {
            Update.updateProject();
        }
    })
    .on('--help', () => {
        Update.showUpdateHelp();
    });

program
    .command('setFormCustomizable <customizable>')
    .alias('f')
    .description('Sets the Solution forms iscustomizable/canbedeleted true/false')
    .action((customizable?: string) => {
        new SetFormCustomizable(customizable === 'true');
    })
    .on('--help', () => {
        console.log(`Sets the Solution forms iscustomizable/canbedeleted true/false`);
    });

program
    .command('showFiddlerRule')
    .alias('fiddler')
    .description('Show the Fiddler AutoResponder Rule Editor lines')
    .action(async () => {
        const path = process.cwd();
        const settings: CrmJson = JSON.parse(fs.readFileSync('../crm.json', 'utf8'));
        if (shell.test('-e', 'Solutions')) {
            const regexPCF = `REGEX:(?insx).+\\/cc_${settings.crm.publisher_prefix}.(?'foldername'[^?]*)\\/(?'fname'[^?]*.js)`;
            const locationPCF = `${path}\\\${foldername}\\out\\controls\\\${foldername}\\\${fname}`;
            console.log(`Please add to first Rule Editor line (including REGEX:): \n${regexPCF}`);
            console.log(`Please add to second Rule Editor line: \n${locationPCF}`);
        } else {
            const regexWR = `REGEX:(?insx).+\\/${settings.crm.publisher_prefix}_\\/${settings.crm.namespace}\\/(?'foldername'[^?]*)\\/(?'fname'[^?]*.js)`;
            const locationWR = `${path}\\dist\\${settings.crm.publisher_prefix}_\\${settings.crm.namespace}\\\${foldername}\\\${fname}`;
            console.log(`Please add to first Rule Editor line (including REGEX:): \n${regexWR}`);
            console.log(`Please add to second Rule Editor line: \n${locationWR}`);
        }
    });

program
    .arguments('<command>')
    .action(() => {
        program.outputHelp();
        console.log('');
        console.log(`echo Unknown command!`);
    });

program.parse(process.argv);
