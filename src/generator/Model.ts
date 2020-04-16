import * as colors from 'colors';
import {AdalRouter} from '../root/tools/AdalRouter';
import * as shell from 'shelljs';
import * as fs from 'fs';
import {NodeApi} from '../root/tools/NodeApi/NodeApi';

interface InterfaceTypes {
    [key: string]: string;
}

export class Model extends AdalRouter {
    public static generateModel(entityname: string): Promise<void> {
        if (!entityname) {
            console.log(colors.red('Model name missing'));
        } else if (!new RegExp('[A-Z]').test(entityname[0])) {
            console.log(colors.red(`Entity name must be UpperCamelCase!`));
        } else if (process.argv[5]) {
            console.log(colors.red(`No spaces allowed!`));
        } else {
            const entityLogicalName = Model.getEntityLogicalName(entityname);
            if (entityLogicalName) {
                console.log(`Generating Model for entity ${entityname}...`);
                new Model(entityname);
            }
        }
        return null;
    }

    private readonly entityname: string;
    private readonly entityLogicalName: string;
    constructor(entityname: string) {
        super();
        this.entityname = entityname;
        this.entityLogicalName = Model.getEntityLogicalName(this.entityname);
    }

    protected onAuthenticated(): Promise<void> {
        return this.generateModel();
    }

    private async generateModel(): Promise<void> {
        this.log(`Generating model for Entity ${this.entityname} having entityLogicalName ${this.entityLogicalName}`);
        await this.writeModelFile();
        this.log('Generating model finished');
    }

    private static get modelinterfaceRegex(): RegExp {
        return /Model\sextends\sModel\s{([\s\S]*)}/gm;
    }

    private static get modelImportRegex(): RegExp {
        return /([\s\S]*)export\sinterface\s/gm;
    }

    private async writeModelFile(): Promise<void> {
        const filepath = `src/${this.entityname}/${this.entityname}.model.ts`,
            filedata = String(fs.readFileSync(filepath)),
            modelMatch = Model.modelinterfaceRegex.exec(filedata);
        if (modelMatch) {
            const attributeInterfaceTypes = await this.getAttributeInterfaceTypes(),
                relationshipInterfaceTypes = await this.getRelationshipInterfaceTypes(),
                importsString = Model.getImportStrings(relationshipInterfaceTypes),
                importMatch = Model.modelImportRegex.exec(filedata);
            let modelString = await this.getAttributesString(attributeInterfaceTypes, relationshipInterfaceTypes);
            modelString += await this.getRelationshipsString(relationshipInterfaceTypes, attributeInterfaceTypes);
            modelString += Model.getCombinedAttributeRelationshipString(attributeInterfaceTypes, relationshipInterfaceTypes);
            let newFiledata = filedata.replace(modelMatch[1], modelString);
            newFiledata = newFiledata.replace(importMatch[1], importsString);
            shell.ShellString(newFiledata).to(filepath);
        } else {
            this.log(`Model file seems to be corrupt. Please fix ${filepath}`);
        }
    }

    private static getImportStrings(relationshipInterfaceTypes: InterfaceTypes): string {
        let importStrings = `import {Model} from '../WebApi/Model';\n`;
        for (const referencingEntityNavigationPropertyName of Object.keys(relationshipInterfaceTypes)) {
            if (!Model.defaultModelAttributes.includes(referencingEntityNavigationPropertyName)) {
                const referencedEntity = relationshipInterfaceTypes[referencingEntityNavigationPropertyName],
                    camelReferencedEntity = Model.capitalize(referencedEntity);
                importStrings += `import {${camelReferencedEntity}Model} from '../${camelReferencedEntity}/${camelReferencedEntity}.model';\n`;
            }
        }
        importStrings += '\n';
        return importStrings;
    }

    private static getCombinedAttributeRelationshipString(attributesInterfaceTypes: InterfaceTypes, relationshipInterfaceTypes: InterfaceTypes): string {
        let combinedString = ``;
        const attributeNames = Object.keys(attributesInterfaceTypes);
        for (const referencingEntityNavigationPropertyName of Object.keys(relationshipInterfaceTypes)) {
            if (!Model.defaultModelAttributes.includes(referencingEntityNavigationPropertyName) && attributeNames.includes(referencingEntityNavigationPropertyName)) {
                const referencedEntity = relationshipInterfaceTypes[referencingEntityNavigationPropertyName],
                    interfaceType = attributesInterfaceTypes[referencingEntityNavigationPropertyName];
                combinedString += `\n    ${referencingEntityNavigationPropertyName}?: ${interfaceType} | ${Model.capitalize(referencedEntity)}Model;`;
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
                relationshipString += `\n    ${referencingEntityNavigationPropertyName}?: ${Model.capitalize(referencedEntity)}Model;`;
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

    private static capitalize(text: string): string {
        return text.charAt(0).toUpperCase() + text.slice(1);
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
                this.log(`To be implemented: ${AttributeType} for ${LogicalName}`);
            }
        }
        return attributesInterfaces;
    }

    // https://docs.microsoft.com/en-us/dotnet/api/microsoft.xrm.sdk.metadata.attributemetadata?view=dynamics-general-ce-9
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private async getInterfaceType(attribute: any): Promise<string> {
        const {AttributeType: attributeType, LogicalName: logicalName} = attribute;
        if (['String', 'Memo', 'DateTime', 'Lookup', 'Customer', 'Owner', 'Uniqueidentifier'].includes(attributeType)) {
            return 'string';
        } else if (['Boolean'].includes(attributeType)) {
            const options = await NodeApi.getBooleanOptionSet(this.entityLogicalName, logicalName, this.bearer);
            return options.map(option => option.value).join(' | ');
        } else if (['Picklist'].includes(attributeType)) {
            const options = await NodeApi.getPicklistOptionSet(this.entityLogicalName, logicalName, this.bearer);
            return options.map(option => option.value).join(' | ');
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

    private static get logicalNameRegex(): RegExp {
        return /static\slogicalName\s=\s'(.*)';/gm;
    }

    private static getEntityLogicalName(entityname: string): string {
        const filepath = `src/${entityname}/${entityname}.service.ts`;
        if (shell.test('-f', filepath)) {
            const filedata = String(fs.readFileSync(filepath)),
                match = Model.logicalNameRegex.exec(filedata),
                entityLogicalName = match && match[1] || '';
            if (!entityLogicalName) {
                console.log(colors.red(`File ${filepath} does not contains a logicalName field.`));
            }
            return entityLogicalName;
        } else {
            console.log(colors.red(`Entity ${entityname} does not exist. Please add first by following command:\nHSO-D365 generate Entity ${entityname}`));
        }
    }
}
