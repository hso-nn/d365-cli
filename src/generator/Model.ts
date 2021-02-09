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
        this.log(`Generating files for Entity '${this.entityname}'<br/>Using entityLogicalName '${this.entityLogicalName}'</br>`);
        await this.writeModelFile();
        await this.writeEnumFile();
        await this.writeFormContextFile();
        this.log('Generating files finished');
    }

    private async writeModelFile(): Promise<void> {
        this.log(`Generating ${this.entityname}.model.ts<br/>`);
        const modelFilepath = `src/${this.entityname}/${this.entityname}.model.ts`;
        shell.cp('-r', `${__dirname}/Entity/Entity.model.ts`, `src/${this.entityname}`);
        shell.cp('-r', `src/${this.entityname}/Entity.model.ts`, modelFilepath);
        shell.rm('-rf', `src/${this.entityname}/Entity.model.ts`);
        shell.sed('-i', new RegExp('Entity', 'g'), this.entityname, modelFilepath);
        shell.exec(`git add ${modelFilepath}`);
        let fileData = String(fs.readFileSync(modelFilepath));
        const attributeInterfaceTypes = await this.getAttributeInterfaceTypes();
        const relationshipInterfaceTypes = await this.getRelationshipInterfaceTypes();
        const importsString = await this.getImportStrings(relationshipInterfaceTypes);
        const typesString = await this.getTypeStrings();
        let modelString = await this.getAttributesString(attributeInterfaceTypes, relationshipInterfaceTypes);
        modelString += await this.getRelationshipsString(relationshipInterfaceTypes, attributeInterfaceTypes);
        modelString += await this.getCombinedAttributeRelationshipString(attributeInterfaceTypes, relationshipInterfaceTypes);
        const replaceString1 = `${this.entityname}Model extends Model {`;
        fileData = fileData.replace(replaceString1, `${replaceString1}${modelString}`);
        const replaceString2 = `interface`;
        fileData = fileData.replace(replaceString2, `${importsString}${typesString}${replaceString2}`);
        shell.ShellString(fileData).to(modelFilepath);
        this.log(`Generated ${this.entityname}.model.ts<br/>`);
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
                    this.log(`<span style="color:blue;">NavigationProperty '${referencingEntityNavigationPropertyName}' generated<br/>
                        Referenced model '${displayName}Model' not found.<br/>
                        Add referenced entity '${displayName}' by following cli command:</span><br/>
                        <span style="color:green">hso-d365 generate Entity ${displayName}</span></br>
                        <span style="color:blue;">And regenerate '${this.entityname}' by following cli command:</span><br/>
                        <span style="color:green">hso-d365 generate Entity ${this.entityname}</span></br>
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
                this.log(`To be implemented: ${AttributeType} for ${LogicalName}<br/>`);
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

    private async writeFormContextFile(): Promise<void> {
        this.log(`Generating ${this.entityname}.formContext.ts<br/>`);
        const formContextAttributesString = await this.getFormContextAttributesString();
        const formContextFilepath = `src/${this.entityname}/${this.entityname}.formContext.ts`;
        shell.cp('-r', `${__dirname}/Entity/Entity.formContext.ts`, `src/${this.entityname}`);
        shell.cp('-r', `src/${this.entityname}/Entity.formContext.ts`, formContextFilepath);
        shell.rm('-rf', `src/${this.entityname}/Entity.formContext.ts`);
        shell.sed('-i', new RegExp('Entity', 'g'), this.entityname, formContextFilepath);
        shell.exec(`git add ${formContextFilepath}`);
        const filedata = String(fs.readFileSync(formContextFilepath));
        const replaceString = `${this.entityname}FormContext {`;
        const newFileData = filedata.replace(replaceString, `${replaceString}\n${formContextAttributesString}`);
        shell.ShellString(newFileData).to(formContextFilepath);
        this.log(`Generated ${this.entityname}.formContext.ts<br/>`);
    }

    private async getFormContextAttributesString(): Promise<string> {
        let formContextAttributesString = '';
        const attributesMetadata = await NodeApi.getAttributesMetadata(this.entityLogicalName, this.bearer);
        for (const attribute of attributesMetadata) {
            const {AttributeType: attributeType, SchemaName: schemaName} = attribute;
            const xrmAttributeType = this.getXrmAttributeType(attributeType);
            if (xrmAttributeType) {
                const pascalSchemaName = Model.capitalize(schemaName);
                const methodName = `    static get${pascalSchemaName}Attribute(formContext: FormContext): ${xrmAttributeType} {`;
                const returnString = `return formContext.getAttribute(${this.entityname}AttributeNames.${schemaName});`;
                formContextAttributesString += `${methodName}\n        ${returnString}\n    }\n`;
            }
        }
        return formContextAttributesString;
    }

    // https://docs.microsoft.com/en-us/dotnet/api/microsoft.xrm.sdk.metadata.attributemetadata?view=dynamics-general-ce-9
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private getXrmAttributeType(attributeType: string): string {
        if (['String', 'Memo', 'Uniqueidentifier'].includes(attributeType)) {
            return 'Xrm.Attributes.StringAttribute';
        } else if (['DateTime'].includes(attributeType)) {
            return 'Xrm.Attributes.DateAttribute';
        } else if (['Boolean'].includes(attributeType)) {
            return 'Xrm.Attributes.BooleanAttribute | Xrm.Attributes.EnumAttribute';
        } else if (['Picklist', 'Status', 'State'].includes(attributeType)) {
            return 'Xrm.Attributes.OptionSetAttribute';
        } else if (['Integer', 'Double', 'BigInt', 'Decimal', 'Double', 'Money'].includes(attributeType)) {
            return 'Xrm.Attributes.NumberAttribute';
        } else if (['Lookup', 'Customer', 'Owner'].includes(attributeType)) {
            return 'Xrm.Attributes.LookupAttribute';
        } else {
            this.log(`<span style="color:blue;">${this.entityLogicalName} attribute ${attributeType} falls back to Xrm.Attributes.Attribute.</span><br/>`);
            return 'Xrm.Attributes.Attribute';
        }
    }

    private async writeEnumFile(): Promise<void> {
        this.log(`Generating ${this.entityname}.enum.ts<br/>`);
        const enumAttributeNames = await this.getAttributeNamesEnumString();
        const enumStrings = await this.getEnumStrings();
        const enumFilepath = `src/${this.entityname}/${this.entityname}.enum.ts`;
        shell.cp('-r', `${__dirname}/Entity/Entity.enum.ts`, `src/${this.entityname}`);
        shell.cp('-r', `src/${this.entityname}/Entity.enum.ts`, enumFilepath);
        shell.rm('-rf', `src/${this.entityname}/Entity.enum.ts`);
        shell.exec(`git add ${enumFilepath}`);
        const fileData = String(fs.readFileSync(enumFilepath));
        this.log(`Generated ${this.entityname}.enum.ts<br/>`);
        shell.ShellString(fileData + enumAttributeNames + enumStrings).to(enumFilepath);
    }

    private async getAttributeNamesEnumString(): Promise<string> {
        let enumStrings = '';
        const attributesMetadata = await NodeApi.getAttributesMetadata(this.entityLogicalName, this.bearer);
        const displayName = await this.getDisplayName(this.entityLogicalName);
        enumStrings += `export enum ${displayName}AttributeNames {\n`;
        for (const attribute of attributesMetadata) {
            const {LogicalName: logicalName, SchemaName: schemaName} = attribute;
            enumStrings += `    ${schemaName} = '${logicalName}',\n`;
        }
        enumStrings += `}\n`;
        return enumStrings;
    }

    private async getEnumStrings(): Promise<string> {
        let enumStrings = '';
        const attributesMetadata = await NodeApi.getAttributesMetadata(this.entityLogicalName, this.bearer);
        for (const attribute of attributesMetadata) {
            const {AttributeType: attributeType, LogicalName: logicalName, SchemaName: schemaName} = attribute;
            if (attributeType === 'Picklist') {
                enumStrings += `export enum ${schemaName} {\n`;
                const options = await NodeApi.getPicklistOptionSet(this.entityLogicalName, logicalName, this.bearer);
                for (const option of options) {
                    let label = option.label.replace(/\W/g, '');
                    if (!label.charAt(0).match(/^[a-zA-Z]/)) {
                        label = `'${label}'`;
                    }
                    enumStrings += `    ${label} = ${option.value},\n`;
                }
                enumStrings += '}\n';
            }
        }
        if (enumStrings) {
            enumStrings += '\n';
        }
        return enumStrings;
    }

    private async getDisplayName(entityName: string): Promise<string> {
        const {DisplayName} = await NodeApi.getEntityDefinition(entityName, this.bearer, ['DisplayName']);
        const {LocalizedLabels: localizedLabels} = DisplayName;
        const localization = localizedLabels.find((localizedLabel: {LanguageCode: number; Label: string;} ) => localizedLabel.LanguageCode === 1033);
        return localization.Label.replace(/\W/g, '');
    }

    // private trimPrefix(name: string): string {
    //     const {publisher_prefix} = this.settings.crm;
    //     return name.replace(`${publisher_prefix}_`, '');
    // }

    // private getTypeName(logicalName: string): string {
    //     const {publisher_prefix} = this.settings.crm,
    //         typeName = logicalName.replace(`${publisher_prefix}_`, '');
    //     return Model.capitalize(typeName);
    // }

    private static capitalize(text: string): string {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }
}
