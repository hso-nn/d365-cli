import * as shell from 'shelljs';
import * as fs from 'fs';
import {PublisherService} from '../root/tools/Publisher/Publisher.service';
import {SolutionService} from '../root/tools/Solution/Solution.service';
import {SolutionComponentService} from '../root/tools/SolutionComponent/SolutionComponent.service';
import {EnvironmentVariableDefinitionService} from '../root/tools/EnvironmentVariableDefinition/EnvironmentVariableDefinition.service';
import {EnvironmentVariableDefinitionModel} from '../root/tools/EnvironmentVariableDefinition/EnvironmentVariableDefinition.model';
import {CrmJson} from '../root/Webresources/tools/CrmJson';

export class EnvironmentVariable {
    private readonly bearer: string;
    private readonly log: (message: string) => Promise<void>;

    constructor(bearer: string, log: (message: string) => Promise<void>) {
        this.bearer = bearer;
        this.log = log;
    }

    public async generate(): Promise<void> {
        await this.log(`Generating EnvironmentVariable`);
        await this.writeEnvironmentVariablesFiles();
        await this.log('Generated EnvironmentVariable');
    }

    private async writeEnvironmentVariablesFiles(): Promise<void> {
        const environmentVariablesString = await this.getEnvironmentVariablesString();
        shell.cp('-r', `${__dirname}/EnvironmentVariable`, `src`);
        const environmentVariableServiceFilepath = 'src/EnvironmentVariable/EnvironmentVariable.service.ts';
        const filedata = String(fs.readFileSync(environmentVariableServiceFilepath));
        const replaceString = `'environmentvariablevalue';`;
        const newFileData = filedata.replace(replaceString, `${replaceString}\n\n${environmentVariablesString}`);
        shell.ShellString(newFileData).to(environmentVariableServiceFilepath);
        shell.exec(`git add src/EnvironmentVariable`);
    }

    private async getEnvironmentVariablesString(): Promise<string> {
        let environmentVariablesString = '';
        const environmentVariableDefinitions = await this.getEnvironmentVariableDefinitions();
        const publisher = await PublisherService.getPublisher(this.bearer);
        const prefix = publisher.customizationprefix;
        for (const envVarDef of environmentVariableDefinitions) {
            const environmentType = EnvironmentVariable.getEnvironmentType(envVarDef);
            const pascalSchemaName = EnvironmentVariable.capitalize(envVarDef.schemaname.replace(`${prefix}_`, ''));
            const methodName = `    public static async get${pascalSchemaName}(): Promise<${environmentType}> {`;
            const functionString = `const environmentVariableValue = await EnvironmentVariableService.getEnvironmentVariableValue('${envVarDef.schemaname}');`;
            const returnString = EnvironmentVariable.getReturnString(envVarDef);
            environmentVariablesString += `${methodName}\n        ${functionString}\n        ${returnString}\n    }\n\n`;
        }
        return environmentVariablesString;
    }

    private static getReturnString(envVarDef: EnvironmentVariableDefinitionModel): string {
        if (envVarDef.type === 100000000) { // String
            return `return environmentVariableValue ? environmentVariableValue.value : '${envVarDef.defaultvalue}';`;
        }
        if (envVarDef.type === 100000001) { // Number
            return `return environmentVariableValue ? parseFloat(environmentVariableValue.value) : ${envVarDef.defaultvalue};`;
        }
        if (envVarDef.type === 100000002) { // Boolean
            return `return environmentVariableValue ? environmentVariableValue.value === 'yes' : ${envVarDef.defaultvalue === 'yes'};`;
        }
        if (envVarDef.type === 100000003) { // JSON
            let returnString = `// eslint-disable-next-line quotes\n        `;
            returnString += `return environmentVariableValue ? JSON.parse(environmentVariableValue.value) : ${envVarDef.defaultvalue};`;
            return returnString;
        }
        if (envVarDef.type === 100000004) { // Data source
            let returnString = `// Not supported or go ahead with the value\n        `;
            returnString += `return environmentVariable ? environmentVariableValue.value as unknown : null`;
            return returnString;
        }
    }

    private static getEnvironmentType(envVarDef: EnvironmentVariableDefinitionModel): string {
        if (envVarDef.type === 100000000) { // String
            return 'string';
        }
        if (envVarDef.type === 100000001) { // Decimal
            return 'number';
        }
        if (envVarDef.type === 100000002) { // Boolean
            return 'boolean';
        }
        if (envVarDef.type === 100000003) { // JSON
            return 'JSON';
        }
        if (envVarDef.type === 100000004) { // Data source
            return 'unknown';
        }
    }

    private async getEnvironmentVariableDefinitions(): Promise<EnvironmentVariableDefinitionModel[]> {
        const environmentVariableDefinitions: EnvironmentVariableDefinitionModel[] = [];
        const settings: CrmJson = JSON.parse(fs.readFileSync('tools/crm.json', 'utf8'));
        const {solution_name_generate} = settings.crm;
        const solution = await SolutionService.getSolution(solution_name_generate, ['solutionid'], this.bearer);
        const solutionComponents = await SolutionComponentService.retrieveMultipleRecords({
            select: ['objectid'],
            filters: [{
                conditions: [{
                    attribute: '_solutionid_value',
                    value: solution.solutionid
                }]
            }, {
                type: 'or',
                conditions: [{
                    attribute: 'componenttype',
                    value: 380
                }]
            }]
        }, this.bearer);
        for (const solutionComponent of solutionComponents) {
            const objectid = solutionComponent.objectid;
            const envVariableDefinitions = await EnvironmentVariableDefinitionService.retrieveMultipleRecords( {
                select: ['defaultvalue', 'schemaname', 'type'],
                filters: [{
                    conditions: [{
                        attribute: 'environmentvariabledefinitionid',
                        value: objectid
                    }]
                }]
            }, this.bearer);
            environmentVariableDefinitions.push(envVariableDefinitions[0]);
        }
        return environmentVariableDefinitions;
    }

    private static capitalize(text: string): string {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }
}
