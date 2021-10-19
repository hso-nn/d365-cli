import * as shell from 'shelljs';
import program from 'commander';
import {Create} from './Create';
import {Update} from './update';
import {Generator} from './generator/Generator';
import {Variables} from './Variables';
import {Deploy} from './root/tools/Deploy';
import {Resx} from './root/tools/Resx';
import {SetFormCustomizable} from './root/tools/SetFormCustomizable';
import packageJson from '../package.json';
import {RegeneratorRouter} from './generator/RegerenatorRouter';
import {PCF} from './pcf/PCF';
import {CrmJson} from './root/Webresources/tools/CrmJson';
import fs from 'fs';

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
        await RegeneratorRouter.regenerate();
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
        Generator.generate(schematic, name, options);
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
        Update.updateProject();
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
        if (shell.test('-e', 'Solutions')) {
            const settings: CrmJson = JSON.parse(fs.readFileSync('../Webresources/tools/crm.json', 'utf8'));
            const regexPCF = `REGEX:(?insx).+\\/cc_${settings.crm.publisher_prefix}.(?'foldername'[^?]*)\\/(?'fname'[^?]*.js)`;
            const locationPCF = `${path}\\\${foldername}\\out\\controls\\\${foldername}\\\${fname}`;
            console.log(`Please add to first Rule Editor line (including REGEX:): \n${regexPCF}`);
            console.log(`Please add to second Rule Editor line: \n${locationPCF}`);
        } else {
            const variables = await Variables.get(),
                publisher = variables.publisher,
                namespace = variables.namespace;
            const regexWR = `REGEX:(?insx).+\\/${publisher}_\\/${namespace}\\/(?'foldername'[^?]*)\\/(?'fname'[^?]*.js)`;
            const locationWR = `${path}\\dist\\${publisher}_\\${namespace}\\\${foldername}\\\${fname}`;
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
