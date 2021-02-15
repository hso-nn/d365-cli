import * as colors from 'colors';
import * as shell from 'shelljs';
import * as inquirer from 'inquirer';
import * as fs from 'fs';
import {Variables} from '../Variables';
import {AdalRouter} from '../root/tools/AdalRouter';
import {NodeApi} from '../root/tools/NodeApi/NodeApi';

interface InterfaceTypes {
    [key: string]: string;
}

export class Entity extends AdalRouter {
    public static async generateEntity(entityName: string): Promise<void> {
        if (!entityName) {
            console.log(colors.red('Entity name missing'));
        } else if(!new RegExp('[A-Z]').test(entityName[0])) {
            console.log(colors.red(`Entity name must be UpperCamelCase!`));
        } else if (process.argv[5]) {
            console.log(colors.red(`No spaces allowed!`));
        } else {
            const answers = await inquirer.prompt([{
                type: 'input',
                name: 'entityLogicalName',
                message: 'Entity LogicalName:'
            }]);
            const entityLogicalName = answers.entityLogicalName;
            new Entity(entityName, entityLogicalName);
        }
        return null;
    }

    private readonly entityName: string;
    private readonly entityLogicalName: string;
    constructor(entityName: string, entityLogicalName: string) {
        super();
        this.entityName = entityName;
        this.entityLogicalName = entityLogicalName;
    }

    protected onAuthenticated(): Promise<void> {
        return this.generateEntity();
    }

    private async generateEntity(): Promise<void> {
        try {
            await NodeApi.getEntityDefinition(this.entityLogicalName, this.bearer, ['PrimaryIdAttribute']);
            const check = shell.grep(` ${this.entityName}:`, 'webpack.config.js');
            if (check.stdout === '\n') {
                await this.addEntityFiles(this.entityName);
                Entity.registerWebpackConfig(this.entityName);
            } else {
                console.log(colors.green(`Entity ${this.entityName} already exists`));
            }
            await this.generateModel();
        } catch (e) {
            console.log(colors.red(`Failed: Entity ${this.entityName} has no LogicalName ${this.entityLogicalName}`));
        }
    }

    private static registerWebpackConfig(entityName: string): void {
        const webpackConfigFile = shell.ls('webpack.config.js')[0];
        // eslint-disable-next-line max-len
        shell.sed('-i', 'entry: {', `entry: {\n            ${entityName}: [\n                path.resolve(__dirname, "src/${entityName}/${entityName}.ts")\n            ],`, webpackConfigFile);
        shell.exec('git add webpack.config.js');
    }

    private async addEntityFiles(entityName: string): Promise<void> {
        console.log(`Adding D365 Entity files ${entityName}...`);
        const {publisher, namespace} = await Variables.get();
        shell.mkdir(`src/${entityName}`);
        shell.ls(`${__dirname}/Entity/*.*`).forEach((filepath) => {
            const split = filepath.split('/');
            const filename = split[split.length - 1];
            const newfilename = filename.replace(/Entity/g, entityName);
            shell.cp('-r', filepath, `src/${entityName}`);
            shell.cp('-r', `src/${entityName}/${filename}`, `src/${entityName}/${newfilename}`);
            shell.rm('-rf', `src/${entityName}/${filename}`);
            shell.sed('-i', new RegExp('EntityLogicalName', 'ig'), this.entityLogicalName, `src/${entityName}/${newfilename}`);
            shell.sed('-i', new RegExp('Entity', 'g'), entityName, `src/${entityName}/${newfilename}`);
            shell.sed('-i', new RegExp('entity', 'g'), entityName.charAt(0).toLowerCase() + entityName.slice(1), `src/${entityName}/${newfilename}`);
            shell.sed('-i', new RegExp('<%= publisher %>', 'ig'), publisher, `src/${entityName}/${newfilename}`);
            shell.sed('-i', new RegExp('<%= namespace %>', 'ig'), namespace, `src/${entityName}/${newfilename}`);
            shell.exec(`git add src/${entityName}/${newfilename}`);
        });
        console.log('Adding D365 Entity files done');
    }

    private async generateModel(): Promise<void> {
        await this.log(`Generating files for Entity '${this.entityName}'<br/>Using entityLogicalName '${this.entityLogicalName}'</br>`);
        await this.writeModelFile();
        await this.writeEnumFile();
        await this.writeFormContextFile();
        await this.log('Generating files finished');
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
            if (!Entity.defaultModelAttributes.includes(referencingEntityNavigationPropertyName)) {
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
            if (!Entity.defaultModelAttributes.includes(referencingEntityNavigationPropertyName) && attributeNames.includes(referencingEntityNavigationPropertyName)) {
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
            if (!Entity.defaultModelAttributes.includes(referencingEntityNavigationPropertyName) && !attributeNames.includes(referencingEntityNavigationPropertyName)) {
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
            if (!Entity.defaultModelAttributes.includes(logicalName) &&
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

    private async writeFormContextFile(): Promise<void> {
        await this.log(`Generating ${this.entityName}.formContext.ts<br/>`);
        const formContextAttributesString = await this.getFormContextAttributesString();
        const formContextFilepath = `src/${this.entityName}/${this.entityName}.formContext.ts`;
        shell.cp('-r', `${__dirname}/Entity/Entity.formContext.ts`, `src/${this.entityName}`);
        shell.cp('-r', `src/${this.entityName}/Entity.formContext.ts`, formContextFilepath);
        shell.rm('-rf', `src/${this.entityName}/Entity.formContext.ts`);
        shell.sed('-i', new RegExp('Entity', 'g'), this.entityName, formContextFilepath);
        shell.exec(`git add ${formContextFilepath}`);
        const filedata = String(fs.readFileSync(formContextFilepath));
        const replaceString = `${this.entityName}FormContext {`;
        const newFileData = filedata.replace(replaceString, `${replaceString}\n${formContextAttributesString}`);
        shell.ShellString(newFileData).to(formContextFilepath);
        await this.log(`Generated ${this.entityName}.formContext.ts<br/>`);
    }

    private async getFormContextAttributesString(): Promise<string> {
        let formContextAttributesString = '';
        const attributesMetadata = await NodeApi.getAttributesMetadata(this.entityLogicalName, this.bearer);
        for (const attribute of attributesMetadata) {
            const {AttributeType: attributeType, SchemaName: schemaName} = attribute;
            const xrmAttributeType = await this.getXrmAttributeType(attributeType);
            if (xrmAttributeType) {
                const pascalSchemaName = Entity.capitalize(schemaName);
                const methodName = `    static get${pascalSchemaName}Attribute(formContext: FormContext): ${xrmAttributeType} {`;
                const returnString = `return formContext.getAttribute(${this.entityName}AttributeNames.${pascalSchemaName});`;
                formContextAttributesString += `${methodName}\n        ${returnString}\n    }\n`;
            }
        }
        return formContextAttributesString;
    }

    // https://docs.microsoft.com/en-us/dotnet/api/microsoft.xrm.sdk.metadata.attributemetadata?view=dynamics-general-ce-9
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private async getXrmAttributeType(attributeType: string): Promise<string> {
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
            await this.log(`<span style="color:blue;">${this.entityLogicalName} attribute ${attributeType} falls back to Xrm.Attributes.Attribute.</span><br/>`);
            return 'Xrm.Attributes.Attribute';
        }
    }

    private async writeEnumFile(): Promise<void> {
        await this.log(`Generating ${this.entityName}.enum.ts<br/>`);
        const enumAttributeNames = await this.getAttributeNamesEnumString();
        const enumStrings = await this.getEnumStrings();
        const enumFilepath = `src/${this.entityName}/${this.entityName}.enum.ts`;
        shell.cp('-r', `${__dirname}/Entity/Entity.enum.ts`, `src/${this.entityName}`);
        shell.cp('-r', `src/${this.entityName}/Entity.enum.ts`, enumFilepath);
        shell.rm('-rf', `src/${this.entityName}/Entity.enum.ts`);
        shell.exec(`git add ${enumFilepath}`);
        const fileData = String(fs.readFileSync(enumFilepath));
        await this.log(`Generated ${this.entityName}.enum.ts<br/>`);
        shell.ShellString(fileData + enumAttributeNames + enumStrings).to(enumFilepath);
    }

    private async getAttributeNamesEnumString(): Promise<string> {
        let enumStrings = '';
        const attributesMetadata = await NodeApi.getAttributesMetadata(this.entityLogicalName, this.bearer);
        enumStrings += `export enum ${this.entityName}AttributeNames {\n`;
        for (const attribute of attributesMetadata) {
            const {LogicalName: logicalName, SchemaName: schemaName} = attribute;
            enumStrings += `    ${Entity.capitalize(schemaName)} = '${logicalName}',\n`;
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
                const pascalSchemaName = Entity.capitalize(schemaName);
                enumStrings += `export enum ${pascalSchemaName} {\n`;
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
