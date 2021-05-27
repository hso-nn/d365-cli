import * as shell from 'shelljs';
import * as fs from 'fs';
import {NodeApi} from '../root/tools/NodeApi/NodeApi';

interface InterfaceTypes {
    [key: string]: string;
}

export class Model {
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

    public static async generateModel(bearer: string, entityName: string, entityLogicalName: string, log: (message: string) => Promise<void>): Promise<void> {
        const model = new Model(bearer, entityName, entityLogicalName, log);
        await model.writeModelFile();
    }

    private async writeModelFile(): Promise<void> {
        await this.log(`Generating ${this.entityName}.model.ts<br/>`);
        const modelFilepath = `src/${this.entityName}/${this.entityName}.model.ts`;
        shell.cp('-r', `${__dirname}/Entity/Entity.model.ts`, `src/${this.entityName}`);
        shell.cp('-r', `src/${this.entityName}/Entity.model.ts`, modelFilepath);
        shell.rm('-rf', `src/${this.entityName}/Entity.model.ts`);
        shell.sed('-i', new RegExp('Entity', 'g'), this.entityName, modelFilepath);
        shell.exec(`git add ${modelFilepath}`);
        let fileData = String(fs.readFileSync(modelFilepath));
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
        await this.log(`Generated ${this.entityName}.model.ts<br/>`);
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
                    await this.log(`<span style="color:blue;">NavigationProperty '${referencingEntityNavigationPropertyName}' generated<br/>
                        Referenced model '${displayName}Model' not found.<br/>
                        Add referenced entity '${displayName}' by following cli command:</span><br/>
                        <span style="color:green">hso-d365 generate Entity ${displayName}</span></br>
                        <span style="color:blue;">And regenerate '${this.entityName}' by following cli command:</span><br/>
                        <span style="color:green">hso-d365 generate Entity ${this.entityName}</span></br>
                        `);
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
                attributesString += `\n    ${logicalName}?: ${interfaceType};`;
            }
        }
        attributesString += `\n`;
        return attributesString;
    }

    private async getAttributeInterfaceTypes(): Promise<InterfaceTypes> {
        const attributesMetadata = await NodeApi.getAttributesMetadata(this.entityLogicalName, this.bearer),
            attributesInterfaces: InterfaceTypes = {};
        for (const attribute of attributesMetadata) {
            const {AttributeType, LogicalName} = attribute,
                interfaceType = await this.getInterfaceType(attribute);
            if (interfaceType) {
                attributesInterfaces[LogicalName] = interfaceType;
            } else {
                await this.log(`To be implemented: ${AttributeType} for ${LogicalName}<br/>`);
            }
        }
        return attributesInterfaces;
    }

    // https://docs.microsoft.com/en-us/dotnet/api/microsoft.xrm.sdk.metadata.attributemetadata?view=dynamics-general-ce-9
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private async getInterfaceType(attribute: any): Promise<string> {
        const {AttributeType: attributeType, SchemaName: schemaName} = attribute;
        if (['String', 'Memo', 'DateTime', 'Lookup', 'Customer', 'Owner', 'Uniqueidentifier'].includes(attributeType)) {
            return 'string';
        } else if (['Boolean'].includes(attributeType)) {
            // const options = await NodeApi.getBooleanOptionSet(this.entityLogicalName, logicalName, this.bearer);
            // return options.map(option => option.value).join(' | ');
            return 'boolean';
        } else if (['Picklist'].includes(attributeType)) {
            return `${schemaName}Values`;
        } else if (['Integer', 'Double', 'BigInt', 'Decimal', 'Double', 'Money'].includes(attributeType)) {
            return 'number';
        } else if (['Status'].includes(attributeType)) {
            const options = await NodeApi.getStatusOptionSet(this.entityLogicalName, this.bearer);
            return options.map(option => option.value).join(' | ');
        } else if (['State'].includes(attributeType)) {
            const options = await NodeApi.getStateOptionSet(this.entityLogicalName, this.bearer);
            return options.map(option => option.value).join(' | ');
        }
    }

    private async getTypeStrings(): Promise<string> {
        let typeStrings = '';
        const attributesMetadata = await NodeApi.getAttributesMetadata(this.entityLogicalName, this.bearer);
        for (const attribute of attributesMetadata) {
            const {AttributeType: attributeType, LogicalName: logicalName, SchemaName: schemaName} = attribute;
            if (attributeType === 'Picklist') {
                const options = await NodeApi.getPicklistOptionSet(this.entityLogicalName, logicalName, this.bearer),
                    types = options.map(option => option.value).join(' | ');
                typeStrings += `type ${schemaName}Values = ${types};\n`;
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
