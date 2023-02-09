import * as shell from 'shelljs';
import fs from 'fs';
import {WebresourcesCrmJson} from '../../root/Webresources/CrmJson';
import {SolutionService} from '../../node/Solution/Solution.service';
import {CustomApiService} from '../../node/CustomApi/CustomApi.service';
import {SolutionComponentService} from '../../node/SolutionComponent/SolutionComponent.service';
import {CustomApiRequestParameterService} from '../../node/CustomApiRequestParameter/CustomApiRequestParameter.service';
import {CustomApiResponsePropertyService} from '../../node/CustomApiResponseProperty/CustomApiResponseProperty.service';
import {CustomApiModel} from '../../node/CustomApi/CustomApi.model';
import {CustomApiRequestParameterModel} from '../../node/CustomApiRequestParameter/CustomApiRequestParameter.model';
import {CustomApiResponsePropertyModel} from '../../node/CustomApiResponseProperty/CustomApiResponseProperty.model';

export class CustomApis {
    private readonly bearer: string;

    constructor(bearer: string) {
        this.bearer = bearer;
    }

    public async generate(): Promise<void> {
        console.log(`Generating Custom Apis`);
        await this.writeCustomApisFile();
        console.log('Generated Custom Apis');
    }

    private async writeCustomApisFile(): Promise<void> {
        console.log(`Generating CustomApis/CustomApis.ts`);
        const customApisString = await this.getCustomApisString();
        shell.cp('-r', `${__dirname}/CustomApis`, `src`);
        const customApisFilepath = 'src/CustomApis/CustomApis.ts';
        const fileData = String(fs.readFileSync(customApisFilepath));
        shell.ShellString(fileData + customApisString).to(customApisFilepath);
        shell.exec(`git add src/CustomApis`);
        console.log(`Generated CustomApis/CustomApis.ts`);
    }

    // eslint-disable-next-line max-lines-per-function
    private async getCustomApisString(): Promise<string> {
        let customApiStrings = '';
        const customApis = await this.getCustomApis();

        for (const customApi of customApis) {
            const pascalSchemaName = CustomApis.capitalize(customApi.uniquename);

            const requestParameters = await this.getRequestParameters(customApi);

            customApiStrings += `// eslint-disable-next-line @typescript-eslint/no-empty-interface\n`;
            customApiStrings += `interface ${pascalSchemaName}Request {\n`;
            for (const requestParameter of requestParameters) {
                customApiStrings += `    // ${requestParameter.name}\n`;
                customApiStrings += `    // ${requestParameter.description}\n`;
                customApiStrings += `    // ${requestParameter.displayname}\n`;
                // eslint-disable-next-line max-len
                customApiStrings += `    ${requestParameter.uniquename}${requestParameter.isoptional ? '?' : ''}: ${CustomApis.getTypeString(requestParameter.type)};\n\n`;
            }
            if (requestParameters.length === 0) {
                customApiStrings += `    //\n`;
            }
            customApiStrings += `}\n`;

            const responseProperties = await this.getResponseProperties(customApi);

            customApiStrings += `// eslint-disable-next-line @typescript-eslint/no-empty-interface\n`;
            customApiStrings += `interface ${pascalSchemaName}Response {\n`;
            for (const responseProperty of responseProperties) {
                customApiStrings += `    // ${responseProperty.name}\n`;
                customApiStrings += `    // ${responseProperty.description}\n`;
                customApiStrings += `    // ${responseProperty.displayname}\n`;
                // eslint-disable-next-line max-len
                customApiStrings += `    ${responseProperty.uniquename}: ${CustomApis.getTypeString(responseProperty.type)};\n\n`;
            }
            customApiStrings += `}\n`;
            customApiStrings += `// ${customApi.name}\n`;
            customApiStrings += `// ${customApi.description}\n`;
            customApiStrings += `// ${customApi.displayname}\n`;
            customApiStrings += `export const ${pascalSchemaName} = async (request: ${pascalSchemaName}Request): Promise<${pascalSchemaName}Response> => {\n`;
            customApiStrings += `    return WebApi.executeAction('${customApi.uniquename}', request);\n`;
            customApiStrings += `};\n\n`;
        }
        if (customApiStrings) {
            customApiStrings += '\n';
        }
        return customApiStrings;
    }

    private async getCustomApis(): Promise<CustomApiModel[]> {
        const settings: WebresourcesCrmJson = JSON.parse(fs.readFileSync('./crm.json', 'utf8'));
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
                    value: 10051 // CustomApis
                }]
            }]
        }, this.bearer);
        const conditions: Condition[] = [];
        for (const solutionComponent of solutionComponents) {
            const objectid = solutionComponent.objectid;
            conditions.push({
                attribute: 'customapiid',
                value: objectid,
            });
        }
        return CustomApiService.retrieveMultipleRecords({
            select: ['customapiid', 'description', 'displayname', 'name', 'solutionid', 'uniquename'],
            filters: [{
                type: 'or',
                conditions: conditions
            }]
        }, this.bearer);
    }

    private getRequestParameters(customApi: CustomApiModel): Promise<CustomApiRequestParameterModel[]> {
        return CustomApiRequestParameterService.retrieveMultipleRecords({
            select: ['customapirequestparameterid', 'description', 'displayname', 'name', 'solutionid', 'uniquename', 'isoptional', 'type'],
            filters: [{
                conditions: [{
                    attribute: '_customapiid_value',
                    value: customApi.customapiid
                }]
            }]
        }, this.bearer);
    }

    private getResponseProperties(customApi: CustomApiModel): Promise<CustomApiResponsePropertyModel[]> {
        return CustomApiResponsePropertyService.retrieveMultipleRecords({
            select: ['customapiresponsepropertyid', 'description', 'displayname', 'name', 'solutionid', 'uniquename', 'type'],
            filters: [{
                conditions: [{
                    attribute: '_customapiid_value',
                    value: customApi.customapiid
                }]
            }]
        }, this.bearer);
    }

    private static getTypeString(value: number): string {
        if (value === 0) {
            return 'boolean';
        }
        if (value === 1) {
            return 'Date';
        }
        if ([2, 6, 7].includes(value)) {
            return 'number';
        }
        if ([3].includes(value)) {
            return 'Model';
        }
        if ([4].includes(value)) {
            return 'Model[]';
        }
        if ([5, 8, 9].includes(value)) {
            return 'any';
        }
        if ([10, 12].includes(value)) {
            return 'string';
        }
        if ([11].includes(value)) {
            return 'string[]';
        }
    }

    private static capitalize(text: string): string {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }
}
