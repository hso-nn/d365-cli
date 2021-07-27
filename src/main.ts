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

program
    .version(packageJson.version)
    .usage('<command> [options]');

program
    .command('new <project>')
    .alias('n')
    .description('Creates a new workspace and an initial Webresource setup')
    .action((project: string) => {
        Create.createProject(project);
    })
    .on('--help', () => {
        Create.showCreateHelp();
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
        shell.exec('npm run build:prod');
    })
    .on('--help', () => {
        console.log(`The command can be used to build the project to be distributed to the D365 environment using the 'deploy' command`);
    });

program
    .command('deploy')
    .option('-f, --force', 'Force unmodified files as well')
    .description('Invokes the deploy builder')
    .action(({force}) => {
        Deploy.deployProject(force);
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
        const variables = await Variables.get(),
            publisher = variables.publisher,
            namespace = variables.namespace,
            regex = `REGEX:(?insx).+\\/${publisher}_\\/${namespace}\\/(?'foldername'[^?]*)\\/(?'fname'[^?]*.js)`,
            path = process.cwd(),
            location = `${path}\\dist\\${publisher}_\\${namespace}\\\${foldername}\\\${fname}`;
        console.log(`Please add to first Rule Editor line (including REGEX:): \n${regex}`);
        console.log(`Please add to second Rule Editor line: \n${location}`);
    });

program
    .arguments('<command>')
    .action(() => {
        program.outputHelp();
        console.log('');
        console.log(`echo Unknown command!`);
    });

program.parse(process.argv);
