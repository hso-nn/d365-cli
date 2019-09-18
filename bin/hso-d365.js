#! /usr/bin/env node

'use strict';

const create = require('./create');
const update = require('./update');
const generator = require('./generate');
const program = require('commander');

program
    .version(require('../package').version)
    .usage('<command> [options]');

program
    .command('new <project>')
    .alias('n')
    .description('Creates a new workspace and an initial Webresource setup')
    .action(project => {
        create.createProject(project);
    })
    .on('--help', () => {
        create.showCreateHelp();
    });

program
    .command('update')
    .alias('u')
    .description('Updates existing workspace and Webresource setup')
    .action(project => {
        update.updateProject();
    })
    .on('--help', () => {
        update.showUpdateHelp();
    });

program
    .command('generate <schematic> <name>')
    .alias('g')
    .description('Generates and/or modifies files bases on a schematic.')
    .action((schematic, name) => {
         generator.generate(schematic, name);
    })
    .on('--help', () => {
        generator.showGenerateHelp();
    });

program
    .arguments('<command>')
    .action((cmd) => {
        program.outputHelp();
        console.log('');
        console.log(`echo Unknown command!`);
    });

program.parse(process.argv);
