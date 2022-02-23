import * as shell from 'shelljs';
import {NodeApi} from '../../node/NodeApi/NodeApi';
import fs from 'fs';

export class GlobalOptionSet {
    private readonly bearer: string;

    constructor(bearer: string) {
        this.bearer = bearer;
    }

    public async generate(): Promise<void> {
        console.log(`Generating Global OptionSet`);
        await this.writeGlobalOptionSetsFile();
        console.log('Generated Global OptionSet');
    }

    private async writeGlobalOptionSetsFile(): Promise<void> {
        console.log(`Generating OptionSets/OptionSets.ts`);
        const globalOptionSetsString = await this.getGlobalOptionSetsString();
        shell.cp('-r', `${__dirname}/OptionSets`, `src`);
        const optionSetFilepath = 'src/OptionSets/OptionSets.ts';
        const fileData = String(fs.readFileSync(optionSetFilepath));
        shell.ShellString(fileData + globalOptionSetsString).to(optionSetFilepath);
        shell.exec(`git add src/OptionSets`);
        console.log(`Generated OptionSet/OptionSets.ts`);
    }

    private async getGlobalOptionSetsString(): Promise<string> {
        let optionSetStrings = '';
        const optionSets = await NodeApi.getGlobalOptionSetDefinitions(this.bearer);
        for (const optionSet of optionSets) {
            const pascalSchemaName = GlobalOptionSet.capitalize(optionSet.Name);
            optionSetStrings += `export enum ${pascalSchemaName} {\n`;
            if (optionSet.OptionSetType === 'Boolean') {
                const {FalseOption, TrueOption} = optionSet;
                optionSetStrings += `    ${TrueOption.Label.UserLocalizedLabel.Label.replace(/\W/g, '')} = ${TrueOption.Value},\n`;
                optionSetStrings += `    ${FalseOption.Label.UserLocalizedLabel.Label.replace(/\W/g, '')} = ${FalseOption.Value},\n`;
            } else {
                const usedLabels: string[] = [];
                for (const option of optionSet.Options) {
                    let label = option.Label.UserLocalizedLabel.Label.replace(/\W/g, '');
                    if (!usedLabels.includes(label)) {
                        usedLabels.push(label);
                        if (!label.charAt(0).match(/^[a-zA-Z]/)) {
                            label = `Nr_${label}`;
                        }
                        optionSetStrings += `    ${label} = ${option.Value},\n`;
                    }
                }
            }
            optionSetStrings += '}\n';
        }
        if (optionSetStrings) {
            optionSetStrings += '\n';
        }
        return optionSetStrings;
    }

    private static capitalize(text: string): string {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }
}
