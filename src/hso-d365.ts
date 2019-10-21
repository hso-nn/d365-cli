import * as shell from 'shelljs';
import * as program from 'commander';
import {Create} from './Create';
import {Update} from './update';
import {Generator} from './Generator';

program
    .version('1.0.0') // .version(require('../package').version)
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
    .command('xi18n')
    .alias('i18n')
    .description('Extracts i18n messages from source code.')
    .action(() => {
        shell.exec('npm run i18next-scanner');
    })
    .on('--help', () => {
        console.log(`In translation folder a folder 'locales' will be generated having a translation file per language.`);
        console.log(`The translation files to be generated can be found in your project 'i18next-scanner.config.js file`);
        console.log(`You have to add the translations after the generation`);
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
    .arguments('<command>')
    .action(() => {
        program.outputHelp();
        console.log('');
        console.log(`echo Unknown command!`);
    });

program.parse(process.argv);