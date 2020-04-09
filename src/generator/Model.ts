import * as colors from 'colors';
import {AdalRouter} from '../root/tools/AdalRouter';
import * as shell from 'shelljs';
import * as fs from 'fs';
import {NodeApi} from '../root/tools/NodeApi/NodeApi';

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

    private async writeModelFile(): Promise<void> {
        const filepath = `src/${this.entityname}/${this.entityname}.model.ts`,
            filedata = String(fs.readFileSync(filepath)),
            match = Model.modelinterfaceRegex.exec(filedata);
        if (match) {
            const interfaceFields = match[1];
            const newFiledata = filedata.replace(interfaceFields, await this.getAttributesString());
            shell.ShellString(newFiledata).to(filepath);
        } else {
            this.log(`Model file seems to be corrupt. Please fix ${filepath}`);
        }
    }

    private static defaultModelFields = ['createdonbehalfbyyominame', 'owneridname', 'importsequencenumber', 'modifiedbyyominame', 'utcconversiontimezonecode',
        'createdbyyominame', 'modifiedbyname', 'timezoneruleversionnumber', 'owneridyominame', 'modifiedon', 'modifiedonbehalfbyyominame', 'createdbyname',
        'createdon', 'createdonbehalfbyname', 'modifiedonbehalfbyname', 'versionnumber', 'overriddencreatedon', 'owningbusinessunit', 'owningteam',
        'modifiedby', 'createdby', 'modifiedonbehalfby', 'owninguser', 'createdonbehalfby', 'ownerid'];

    private async getAttributesString(): Promise<string> {
        const attributesMetadata = await NodeApi.getEntityAttributes(this.entityLogicalName, this.bearer),
            // eslint-disable-next-line max-len
            {PrimaryIdAttribute, PrimaryNameAttribute} = await NodeApi.getEntityDefinition(this.entityLogicalName, this.bearer, ['PrimaryIdAttribute', 'PrimaryNameAttribute']),
            primaryNameAttributeMetadata = attributesMetadata.find((attribute: {LogicalName: string}) => attribute.LogicalName === PrimaryNameAttribute),
            primaryNameInterface = await this.getInterfaceType(primaryNameAttributeMetadata);
        let attributesString = `\n    //Attributes for $select\n`;
        attributesString += `    ${PrimaryIdAttribute}?: string; // PrimaryIdAttribute\n`;
        attributesString += `    ${PrimaryNameAttribute}?: ${primaryNameInterface}; // PrimaryNameAttribute`;
        for (const attribute of attributesMetadata) {
            const {AttributeType, LogicalName} = attribute,
                interfaceType = await this.getInterfaceType(attribute);
            if (Model.defaultModelFields.includes(LogicalName) || LogicalName === PrimaryNameAttribute || LogicalName.endsWith('yominame')) {
                // this.log(`Default Model field skipped: ${LogicalName}`);
            } else if (interfaceType) {
                attributesString += `\n    ${LogicalName}?: ${interfaceType};`;
            } else {
                if (!['Virtual', 'Uniqueidentifier', 'EntityName'].includes(AttributeType)) {
                    this.log(`To be implemented: ${AttributeType} for ${LogicalName}`);
                }
            }
        }
        attributesString += `\n`;
        return attributesString;
    }

    // https://docs.microsoft.com/en-us/dotnet/api/microsoft.xrm.sdk.metadata.attributemetadata?view=dynamics-general-ce-9
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private async getInterfaceType(attribute: any): Promise<string> {
        const {AttributeType: attributeType, LogicalName: logicalName} = attribute;
        if (['String', 'Memo', 'DateTime', 'Lookup', 'Customer', 'Owner'].includes(attributeType)) {
            return 'string';
        } else if (['Boolean'].includes(attributeType)) {
            const options = await NodeApi.getBooleanOptionSet(this.entityLogicalName, logicalName, this.bearer);
            return options.map(option => option.value).join(' | ');
        } else if (['Picklist'].includes(attributeType)) {
            const options = await NodeApi.getPicklistOptionSet(this.entityLogicalName, logicalName, this.bearer);
            return options.map(option => option.value).join(' | ');
        } else if (['Integer', 'Double', 'BigInt', 'Decimal', 'Double'].includes(attributeType)) {
            return 'number';
        } else if (['Status'].includes(attributeType)) {
            const options = await NodeApi.getStatusOptionSet(this.entityLogicalName, this.bearer);
            return options.map(option => option.value).join(' | ');
        } else if (['State'].includes(attributeType)) {
            const options = await NodeApi.getStateOptionSet(this.entityLogicalName, this.bearer);
            return options.map(option => option.value).join(' | ');
        }

        // TODO File, Image, Lookup, Money, Virtual
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
            if (entityLogicalName) {
                console.log(`Found EntitylogicalName: ${entityLogicalName} in ${filepath}`);
            } else {
                console.log(colors.red(`File ${filepath} does not contains a logicalName field.`));
            }
            return entityLogicalName;
        } else {
            console.log(colors.red(`Entity ${entityname} does not exist. Please add first by following command:\nHSO-D365 generate Entity ${entityname}`));
        }
    }
}
