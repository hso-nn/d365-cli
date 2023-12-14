import * as shell from 'shelljs';
import * as fs from 'fs';
import {NodeApi} from '../../node/NodeApi/NodeApi';
import inquirer from 'inquirer';
import colors from 'colors';
import cp from 'child_process';

interface InterfaceTypes {
    [key: string]: string;
}

export class Model {
    private readonly bearer: string;
    private readonly entityName: string;
    private entityLogicalName: string;
    private attributesMetadata: AttributeMetadata[];

    constructor(bearer: string, entityName: string, entityLogicalName: string) {
        this.bearer = bearer;
        this.entityName = entityName;
        this.entityLogicalName = entityLogicalName;
    }

    public async generate(): Promise<void> {
        await this.generateModelFile();
    }

    private async generateModelFile(): Promise<void> {
        const folderPath = `src/${this.entityName}`;
        if (!shell.test('-d', folderPath)) {
            if (!this.entityLogicalName) {
                const answers = await inquirer.prompt([{
                    type: 'input',
                    name: 'entityLogicalName',
                    message: 'Entity LogicalName:'
                }]);
                this.entityLogicalName = answers.entityLogicalName;
            }
            try {
                await NodeApi.getEntityDefinition(this.entityLogicalName, this.bearer, ['PrimaryIdAttribute']);
            } catch (e) {
                console.log(colors.red(`Failed: Entity ${this.entityName} has no LogicalName ${this.entityLogicalName}`));
                throw e;
            }
            shell.mkdir(`src/${this.entityName}`);
            await this.addModelFile();
        } else {
            const serviceFilepath = `src/${this.entityName}/${this.entityName}.service.ts`;
            const fileData = String(fs.readFileSync(serviceFilepath));
            const match = fileData.match(new RegExp(`static logicalName = '([a-zA-Z0-9_]*)';`));
            this.entityLogicalName = match[1];
            console.log(colors.magenta(`Entity ${this.entityName} already exist`));
            await this.addModelFile();
        }
        console.log('Generating files finished');
    }

    private async addModelFile(): Promise<void> {
        console.log(`Generating ${this.entityName}.model.ts`);
        const modelFilepath = `src/${this.entityName}/${this.entityName}.model.ts`;
        shell.cp('-r', `${__dirname}/Entity/Entity.model.ts`, `src/${this.entityName}`);
        shell.cp('-r', `src/${this.entityName}/Entity.model.ts`, modelFilepath);
        shell.rm('-rf', `src/${this.entityName}/Entity.model.ts`);
        shell.sed('-i', new RegExp('Entity', 'g'), this.entityName, modelFilepath);
        // shell.exec(`git add ${modelFilepath}`);
        if (shell.test('-e', '../.git')) {
            cp.execFileSync('git', ['add', modelFilepath]);
        }
        let fileData = String(fs.readFileSync(modelFilepath));
        this.attributesMetadata = await NodeApi.getAttributesMetadata(this.entityLogicalName, this.bearer);
        const attributeInterfaceTypes = await this.getAttributeInterfaceTypes();
        const relationshipInterfaceTypes = await this.getRelationshipInterfaceTypes();
        const importsString = await this.getImportStrings(relationshipInterfaceTypes);
        const typesString = await this.getTypeStrings();
        let modelString = await this.getAttributesString(attributeInterfaceTypes, relationshipInterfaceTypes);
        modelString += await this.getRelationshipsString(relationshipInterfaceTypes, attributeInterfaceTypes);
        modelString += await this.getCombinedAttributeRelationshipString(attributeInterfaceTypes, relationshipInterfaceTypes);
        const replaceString1 = `${this.entityName}Model extends Model {`;
        fileData = fileData.replace(replaceString1, `${replaceString1}${modelString}`);
        const replaceString2 = `interface`;
        fileData = fileData.replace(replaceString2, `${importsString}${typesString}${replaceString2}`);
        shell.ShellString(fileData).to(modelFilepath);
        console.log(`Generated ${this.entityName}.model.ts`);
    }



    /**
     Import strings is not needed anymore, since interfaces do not need an import
     This method will log missing entities only
     **/
    private async getImportStrings(relationshipInterfaceTypes: InterfaceTypes): Promise<string> {
        const importStrings = '';
        for (const referencingEntityNavigationPropertyName of Object.keys(relationshipInterfaceTypes)) {
            if (!Model.defaultModelAttributes.includes(referencingEntityNavigationPropertyName)) {
                const referencedEntity = relationshipInterfaceTypes[referencingEntityNavigationPropertyName];
                const displayName = await this.getDisplayName(referencedEntity);
                const relatedModelFilePath = `src/${displayName}/${displayName}.model.ts`;
                if (!shell.test('-f', relatedModelFilePath)) {
                    console.log(colors.blue(`NavigationProperty '${referencingEntityNavigationPropertyName}' generated`));
                    console.log(colors.blue(`Referenced model '${displayName}Model' not found.`));
                    console.log(
                        colors.blue(`Add referenced entity '${displayName}' by following cli command: `) +
                        colors.green(`hso-d365 generate Entity ${displayName}`));
                    console.log(
                        colors.blue(`And regenerate '${this.entityName}' by following cli command: `) +
                        colors.green(`hso-d365 generate Entity ${this.entityName}`));
                }
            }
        }
        return importStrings;
    }

    private async getCombinedAttributeRelationshipString(attributesInterfaceTypes: InterfaceTypes, relationshipInterfaceTypes: InterfaceTypes): Promise<string> {
        let combinedString = ``;
        const attributeNames = Object.keys(attributesInterfaceTypes);
        for (const referencingEntityNavigationPropertyName of Object.keys(relationshipInterfaceTypes)) {
            if (!Model.defaultModelAttributes.includes(referencingEntityNavigationPropertyName) && attributeNames.includes(referencingEntityNavigationPropertyName)) {
                const referencedEntity = relationshipInterfaceTypes[referencingEntityNavigationPropertyName];
                const interfaceType = attributesInterfaceTypes[referencingEntityNavigationPropertyName];
                const displayName = await this.getDisplayName(referencedEntity);
                const relatedModelFilePath = `src/${displayName}/${displayName}.model.ts`;
                const relatedModelFilePathFound = shell.test('-f', relatedModelFilePath);
                combinedString += `\n    ${referencingEntityNavigationPropertyName}?: ${interfaceType}`;
                if (!relatedModelFilePathFound) {
                    combinedString += `; // `;
                }
                combinedString += ` | ${displayName}Model;`;
                if (!relatedModelFilePathFound) {
                    combinedString += ` // entity ${displayName} needs to be generated`;
                }
                combinedString += `\n    '${referencingEntityNavigationPropertyName}@Microsoft.Dynamics.CRM.associatednavigationproperty'?: string;`;
                combinedString += `\n    '${referencingEntityNavigationPropertyName}@Microsoft.Dynamics.CRM.lookuplogicalname'?: string;`;
                combinedString += `\n    '${referencingEntityNavigationPropertyName}@OData.Community.Display.V1.FormattedValue'?: string;`;
            }
        }
        if (combinedString) {
            combinedString = `\n    // Attributes/NavigationProperties for $select and $expand` + combinedString;
            combinedString += '\n';
        }
        return combinedString;
    }

    private async getRelationshipsString(relationshipInterfaceTypes: InterfaceTypes, attributesInterfaceTypes: InterfaceTypes): Promise<string> {
        let relationshipString = `\n    // NavigationProperties for $expand`;
        const attributeNames = Object.keys(attributesInterfaceTypes);
        for (const referencingEntityNavigationPropertyName of Object.keys(relationshipInterfaceTypes)) {
            if (!Model.defaultModelAttributes.includes(referencingEntityNavigationPropertyName) && !attributeNames.includes(referencingEntityNavigationPropertyName)) {
                const referencedEntity = relationshipInterfaceTypes[referencingEntityNavigationPropertyName];
                const displayName = await this.getDisplayName(referencedEntity);
                const relatedModelFilePath = `src/${displayName}/${displayName}.model.ts`;
                const relatedModelFilePathFound = shell.test('-f', relatedModelFilePath);
                relationshipString += `\n    `;
                if (!relatedModelFilePathFound) {
                    relationshipString += `// `;
                }
                relationshipString += `${referencingEntityNavigationPropertyName}?: ${displayName}Model;`;
                if (!relatedModelFilePathFound) {
                    relationshipString += ` // entity ${displayName} needs to be generated`;
                }
            }
        }
        relationshipString += `\n`;
        return relationshipString;
    }

    private async getRelationshipInterfaceTypes(): Promise<InterfaceTypes> {
        const manyToOneMetadatas = await NodeApi.getManyToOneMetadatas(this.entityLogicalName, this.bearer),
            relationshipsInterfaces: InterfaceTypes = {};
        for (const relation of manyToOneMetadatas) {
            const {ReferencedEntity, ReferencingEntityNavigationPropertyName} = relation;
            relationshipsInterfaces[ReferencingEntityNavigationPropertyName] = ReferencedEntity;
        }
        return relationshipsInterfaces;
    }

    private static defaultModelAttributes = ['createdonbehalfbyyominame', 'owneridname', 'importsequencenumber', 'modifiedbyyominame', 'utcconversiontimezonecode',
        'createdbyyominame', 'modifiedbyname', 'timezoneruleversionnumber', 'owneridyominame', 'modifiedon', 'modifiedonbehalfbyyominame', 'createdbyname',
        'createdon', 'createdonbehalfbyname', 'modifiedonbehalfbyname', 'versionnumber', 'overriddencreatedon', 'owningbusinessunit', 'owningteam',
        'modifiedby', 'createdby', 'modifiedonbehalfby', 'owninguser', 'createdonbehalfby', 'statecode', 'statuscode', 'ownerid'];

    private async getAttributesString(attributesInterfaceTypes: InterfaceTypes, relationshipInterfaceTypes: InterfaceTypes): Promise<string> {
        const {PrimaryIdAttribute, PrimaryNameAttribute} = await NodeApi.getEntityDefinition(this.entityLogicalName, this.bearer,
                ['PrimaryIdAttribute', 'PrimaryNameAttribute']),
            relationshipNames = Object.keys(relationshipInterfaceTypes);
        let attributesString = `\n    // Attributes for $select\n`;
        attributesString += `    ${PrimaryIdAttribute}?: ${attributesInterfaceTypes[PrimaryIdAttribute]}; // PrimaryIdAttribute\n`;
        attributesString += `    ${PrimaryNameAttribute}?: ${attributesInterfaceTypes[PrimaryNameAttribute]}; // PrimaryNameAttribute`;
        for (const logicalName of Object.keys(attributesInterfaceTypes)) {
            const interfaceType = attributesInterfaceTypes[logicalName];
            if (!Model.defaultModelAttributes.includes(logicalName) &&
                logicalName !== PrimaryIdAttribute &&
                logicalName !== PrimaryNameAttribute &&
                !relationshipNames.includes(logicalName)
            ) {
                // attributesString += `\n    ${logicalName}?: ${interfaceType};`;
                attributesString += this.getAttributeStrings(logicalName, interfaceType);
            }
        }
        attributesString += `\n`;
        return attributesString;
    }

    private getAttributeStrings(logicalName: string, interfaceType: string): string {
        const attribute = this.attributesMetadata.find(attributeMetadata => attributeMetadata.LogicalName === logicalName);
        const {AttributeType: attributeType, AttributeTypeName: attributeTypeName} = attribute;
        let attributeStrings = `\n    ${logicalName}?: ${interfaceType}; // ${attributeType}`;
        if (['BigInt', 'Boolean', 'DateTime', 'Decimal', 'Double', 'Integer', 'Money', 'Picklist', 'State', 'Status'].includes(attributeType) ||
            attributeTypeName.Value === 'MultiSelectPicklistType') {
            attributeStrings += `\n    '${logicalName}@OData.Community.Display.V1.FormattedValue'?: string;`;
        } else if (['Lookup', 'Customer', 'Owner'].includes(attributeType)) {
            attributeStrings += `\n    '${logicalName}@Microsoft.Dynamics.CRM.associatednavigationproperty'?: string;`;
            attributeStrings += `\n    '${logicalName}@Microsoft.Dynamics.CRM.lookuplogicalname'?: string;`;
            attributeStrings += `\n    '${logicalName}@OData.Community.Display.V1.FormattedValue'?: string;`;
        }
        return attributeStrings;
    }

    private async getAttributeInterfaceTypes(): Promise<InterfaceTypes> {
        const attributesInterfaces: InterfaceTypes = {};
        for (const attribute of this.attributesMetadata) {
            const {AttributeType, LogicalName} = attribute,
                interfaceType = await this.getInterfaceType(attribute);
            if (interfaceType) {
                attributesInterfaces[LogicalName] = interfaceType;
            } else {
                console.log(`To be implemented: ${AttributeType} for ${LogicalName}`);
            }
        }
        return attributesInterfaces;
    }

    // https://docs.microsoft.com/en-us/dotnet/api/microsoft.xrm.sdk.metadata.attributemetadata?view=dynamics-general-ce-9
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private async getInterfaceType(attribute: any): Promise<string> {
        const {AttributeType: attributeType, SchemaName: schemaName, AttributeTypeName: attributeTypeName} = attribute;
        if (['String', 'Memo', 'DateTime', 'Lookup', 'Customer', 'Owner', 'Uniqueidentifier'].includes(attributeType)) {
            return 'string';
        } else if (['Boolean'].includes(attributeType)) {
            // const options = await NodeApi.getBooleanOptionSet(this.entityLogicalName, logicalName, this.bearer);
            // return options.map(option => option.value).join(' | ');
            return 'boolean';
        } else if (['Picklist'].includes(attributeType)) {
            return `${this.entityName}_${schemaName}Values`;
        } else if (['Integer', 'Double', 'BigInt', 'Decimal', 'Double', 'Money'].includes(attributeType)) {
            return 'number';
        } else if (['Status'].includes(attributeType)) {
            const optionSet = await NodeApi.getStatusOptionSet(this.entityLogicalName, this.bearer);
            return optionSet.Options.map(option => option.Value).join(' | ');
        } else if (['State'].includes(attributeType)) {
            const optionSet = await NodeApi.getStateOptionSet(this.entityLogicalName, this.bearer);
            return optionSet.Options.map(option => option.Value).join(' | ');
        } else if (attributeTypeName.Value === 'MultiSelectPicklistType') {
            return 'number[]';
        }
    }

    private async getTypeStrings(): Promise<string> {
        let typeStrings = '';
        for (const attribute of this.attributesMetadata) {
            const {AttributeType: attributeType, LogicalName: logicalName, SchemaName: schemaName, AttributeTypeName: attributeTypeName} = attribute;
            if (['Picklist', 'State', 'Status'].includes(attributeType) || attributeTypeName.Value === 'MultiSelectPicklistType') {
                let optionSet;
                if (attributeType === 'Picklist') {
                    optionSet = await NodeApi.getPicklistOptionSet(this.entityLogicalName, logicalName, this.bearer);
                } else if (attributeType === 'State') {
                    optionSet = await NodeApi.getStateOptionSet(this.entityLogicalName, this.bearer);
                } else if (attributeType === 'Status') {
                    optionSet = await NodeApi.getStatusOptionSet(this.entityLogicalName, this.bearer);
                } else if (attributeTypeName?.Value === 'MultiSelectPicklistType') {
                    optionSet = await NodeApi.getMultiSelectPicklistAttributeMetadata(this.entityLogicalName, logicalName, this.bearer);
                }
                const types = optionSet.Options.map(option => option.Value).join(' | ');
                typeStrings += `type ${this.entityName}_${schemaName}Values = ${types || 'unknown'};\n`;
            }
        }
        typeStrings += '\n';
        return typeStrings;
    }

    private async getDisplayName(entityName: string): Promise<string> {
        const {DisplayName} = await NodeApi.getEntityDefinition(entityName, this.bearer, ['DisplayName']);
        const {LocalizedLabels: localizedLabels} = DisplayName;
        const localization = localizedLabels.find((localizedLabel: {LanguageCode: number; Label: string;} ) => localizedLabel.LanguageCode === 1033);
        return localization.Label.replace(/\W/g, '');
    }
}
