#! /usr/bin/env node
const shell = require("shelljs");
const create = require('./create');
const generator = require('./generate');

const getHelp = () => {
    const BLUE="\033[1;34m";
    const NOCOLOR="\033[0m";
    shell.exec(`echo Available Commands:\n`);
    shell.exec(`echo ${BLUE}help${NOCOLOR} (h) Lists available commands and their short descriptions.`);
};

const command = process.argv[2];
if (['new', 'n'].includes(command)) {
    create.createProject();
} else if (['generate', 'g'].includes(command)) {
    generator.generate();
} else if (['help', 'h'].includes(command)) {
    getHelp();
    generator.getHelp();
    create.getHelp();
} else {
    const BLUE="\033[1;34m";
    const NOCOLOR="\033[0m";
    shell.exec(`echo Unknown command! Try ${BLUE}ce help${NOCOLOR}`);
}


