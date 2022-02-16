import * as shell from 'shelljs';
import * as fs from 'fs';
import {NodeApi} from '../../node/NodeApi/NodeApi';
import {SavedQueryService} from '../../node/SavedQuery/SavedQuery.service';
import cp from 'child_process';

export class Enum {
    private readonly bearer: string;
    private readonly entityName: string;
    private readonly entityLogicalName: string;
    private readonly log: (message: string) => Promise<void>;

    constructor(bearer: string, entityName: string, entityLogicalName: string, log: (message: string) => Promise<void>) {
        this.bearer = bearer;
        this.entityName = entityName;
        this.entityLogicalName = entityLogicalName;
        this.log = log;
    }

    public static async generateEnum(bearer: string, entityName: string, entityLogicalName: string, log: (message: string) => Promise<void>): Promise<void> {
        const enumGenerator = new Enum(bearer, entityName, entityLogicalName, log);
        await enumGenerator.writeEnumFile();
    }

    private async writeEnumFile(): Promise<void> {
        await this.log(`Generating ${this.entityName}.enum.ts<br/>`);
        const enumAttributeNames = await this.getAttributeNamesEnumString();
        const navigationPropertyNames = await this.getNavigationPropertyNamesString();
        const savedQueries = await this.getSavedQueriesString();
        const enumStrings = await this.getEnumStrings();
        const enumFilepath = `src/${this.entityName}/${this.entityName}.enum.ts`;
        shell.cp('-r', `${__dirname}/Entity/Entity.enum.ts`, `src/${this.entityName}`);
        shell.cp('-r', `src/${this.entityName}/Entity.enum.ts`, enumFilepath);
        shell.rm('-rf', `src/${this.entityName}/Entity.enum.ts`);
        // shell.exec(`git add ${enumFilepath}`);
        if (shell.test('-e', '../.git')) {
            cp.execFileSync('git', ['add', enumFilepath]);
        }
        const fileData = String(fs.readFileSync(enumFilepath));
        await this.log(`Generated ${this.entityName}.enum.ts<br/>`);
        shell.ShellString(fileData + enumAttributeNames + navigationPropertyNames + enumStrings + savedQueries).to(enumFilepath);
    }

    private async getSavedQueriesString(): Promise<string> {
        let savedQueriesString = '';
        savedQueriesString += `export const ${this.entityName.charAt(0).toLowerCase()}${this.entityName.slice(1)}Views = {\n`;
        const savedQueries = await SavedQueryService.retrieveMultipleRecords({
            select: ['savedqueryid', 'name', 'returnedtypecode'],
            filters: [{
                conditions: [{
                    attribute: 'returnedtypecode',
                    value: this.entityLogicalName
                }]
            }]
        }, this.bearer);
        for (const savedQuery of savedQueries) {
            if (savedQuery && savedQuery.returnedtypecode === this.entityLogicalName) {
                const {name, savedqueryid} = savedQuery;
                savedQueriesString += `    ${Enum.capitalize(name.replace(/\W/g, ''))}: {\n`;
                savedQueriesString += `        name: \`${name}\`,\n`;
                savedQueriesString += `        savedqueryid: '${savedqueryid}',\n`;
                savedQueriesString += `    },\n`;
            }
        }
        savedQueriesString += `};\n`;
        return savedQueriesString;
    }

    private async getNavigationPropertyNamesString(): Promise<string> {
        let navigationPropertiesString = '';
        const manyToOneMetadatas = await NodeApi.getManyToOneMetadatas(this.entityLogicalName, this.bearer);
        navigationPropertiesString += `export enum ${this.entityName}NavigationPropertyNames {\n`;
        for (const relation of manyToOneMetadatas) {
            const {ReferencingEntityNavigationPropertyName} = relation;
            navigationPropertiesString += `    ${Enum.capitalize(ReferencingEntityNavigationPropertyName)} = '${ReferencingEntityNavigationPropertyName}',\n`;
        }
        navigationPropertiesString += `}\n`;
        return navigationPropertiesString;
    }

    private async getAttributeNamesEnumString(): Promise<string> {
        let enumStrings = '';
        const attributesMetadata = await NodeApi.getAttributesMetadata(this.entityLogicalName, this.bearer);
        enumStrings += `export enum ${this.entityName}AttributeNames {\n`;
        for (const attribute of attributesMetadata) {
            const {LogicalName: logicalName, SchemaName: schemaName} = attribute;
            enumStrings += `    ${Enum.capitalize(schemaName)} = '${logicalName}',\n`;
        }
        enumStrings += `}\n`;
        return enumStrings;
    }

    private async getEnumStrings(): Promise<string> {
        let enumStrings = '';
        const attributesMetadata = await NodeApi.getAttributesMetadata(this.entityLogicalName, this.bearer);
        for (const attribute of attributesMetadata) {
            const {AttributeType: attributeType, LogicalName: logicalName, SchemaName: schemaName, AttributeTypeName: attributeTypeName} = attribute;
            if (['Picklist', 'State', 'Status'].includes(attributeType) || attributeTypeName.Value === 'MultiSelectPicklistType') {
                let optionSet;
                if (attributeType === 'Picklist') {
                    optionSet = await NodeApi.getPicklistOptionSet(this.entityLogicalName, logicalName, this.bearer);
                } else if (attributeType === 'State') {
                    optionSet = await NodeApi.getStateOptionSet(this.entityLogicalName, this.bearer);
                } else if (attributeType === 'Status') {
                    optionSet = await NodeApi.getStatusOptionSet(this.entityLogicalName, this.bearer);
                } else {
                    optionSet = await NodeApi.getMultiSelectPicklistAttributeMetadata(this.entityLogicalName, logicalName, this.bearer);
                }
                if (!optionSet.IsGlobal) {
                    const pascalSchemaName = Enum.capitalize(schemaName);
                    enumStrings += `export enum ${pascalSchemaName} {\n`;
                    for (const option of optionSet.Options) {
                        let label = option.Label.UserLocalizedLabel.Label.replace(/\W/g, '');
                        if (!label.charAt(0).match(/^[a-zA-Z]/)) {
                            label = `'${label}'`;
                        }
                        enumStrings += `    ${label} = ${option.Value},\n`;
                    }
                    enumStrings += '}\n';
                }
            }
        }
        if (enumStrings) {
            enumStrings += '\n';
        }
        return enumStrings;
    }

    private static capitalize(text: string): string {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }
}
