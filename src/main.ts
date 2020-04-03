import * as shell from 'shelljs';
import * as program from 'commander';
import {Create} from './Create';
import {Update} from './update';
import {Generator} from './Generator';
import {Variables} from './Variables';

program
    .version('1.5.0') // .version(require('../package').version)
    .usage('<command> [options]');

program
    .command('new <project>')
    .alias('n')
    .description('Creates a new workspace and an initial Webresource setup')
    .action(project => {
        Create.createProject(project);
    })
    .on('--help', () => {
        Create.showCreateHelp();
    });

program
    .command('generate <schematic> [name]')
    .alias('g')
    .description('Generates and/or modifies files bases on a schematic.')
    .action((schematic, name) => {
        Generator.generate(schematic, name);
    })
    .on('--help', () => {
        Generator.showGenerateHelp();
    });

program
    .command('extractTranslations')
    .alias('extract')
    .description('Extracts translations into resx or json files, dependent on crm.json translation setting.')
    .action(async () => {
        const variables = await Variables.get();
        if (variables.translationtype === 'i18n') {
            console.log('Extracting i18n json files');
            shell.exec('npm run i18next-scanner');
        } else {
            console.log('Extracting resx files');
            shell.exec('npm run resx');
        }
    })
    .on('--help', () => {
        console.log(`In translation folder a folder 'locales' will be generated having translation files.`);
        console.log('When your translation setting is i18n, it will generate a json files for each language specified in i18next-scanner.config.js');
        console.log(`When your translation setting is resx, it will generate one locales.resx file.`);
        console.log(`You have to add for each required language a copy yourself like locales.1033.resx.`);
        console.log(`Once done, the tooling will keep up-to-date for you.`);
    });

/* easy debugging/programming
program
    .command('resx')
    .description('Extracts translation to resx files')
    .action(() => {
        Resx.extract();
    });
 */

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
        shell.exec('npm run build:prod');
    })
    .on('--help', () => {
        console.log(`The command can be used to build the project to be distributed to the D365 environment using the 'deploy' command`);
    });

program
    .command('deploy')
    .alias('d')
    .description('Invokes the deploy builder')
    .action(() => {
        shell.exec('npm run deploy');
    })
    .on('--help', () => {
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
    .action((customizable?: boolean) => {
        shell.exec(`npm run setFormCustomizable:${customizable ? 'true' : 'false'}`);
    })
    .on('--help', () => {
        console.log(`Sets the Solution forms iscustomizable/canbedeleted true/false`);
    });

program
    .arguments('<command>')
    .action(() => {
        program.outputHelp();
        console.log('');
        console.log(`echo Unknown command!`);
    });

program.parse(process.argv);
