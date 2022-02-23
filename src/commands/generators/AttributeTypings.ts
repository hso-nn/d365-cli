import * as shell from 'shelljs';
import * as fs from 'fs';
import colors from 'colors';
import cp from 'child_process';
import {NodeApi} from '../../node/NodeApi/NodeApi';

export class AttributeTypings {
    private readonly bearer: string;
    private readonly entityName: string;
    private readonly entityLogicalName: string;
    private attributesMetadata: AttributeMetadata[];

    constructor(bearer: string, entityName: string, entityLogicalName: string) {
        this.bearer = bearer;
        this.entityName = entityName;
        this.entityLogicalName = entityLogicalName;
    }

    public static async generate(bearer: string, entityName: string, entityLogicalName: string): Promise<void> {
        const formContext = new AttributeTypings(bearer, entityName, entityLogicalName);
        await formContext.writeTypingsFile();
    }

    private async writeTypingsFile(): Promise<void> {
        console.log(`Generating ${this.entityName}.d.ts`);
        this.attributesMetadata = await NodeApi.getAttributesMetadata(this.entityLogicalName, this.bearer);
        const typingsAttributesString = await this.getTypingsAttributesString();
        const typingsFilepath = `src/${this.entityName}/${this.entityName}.d.ts`;
        shell.cp('-r', `${__dirname}/Entity/Entity.d.ts`, `src/${this.entityName}`);
        shell.cp('-r', `src/${this.entityName}/Entity.d.ts`, typingsFilepath);
        shell.rm('-rf', `src/${this.entityName}/Entity.d.ts`);
        shell.sed('-i', new RegExp('Entity', 'g'), this.entityName, typingsFilepath);
        if (shell.test('-e', '../.git')) {
            cp.execFileSync('git', ['add', typingsFilepath]);
        }
        const filedata = String(fs.readFileSync(typingsFilepath));
        const replaceString = `interface ${this.entityName}Attributes {`;
        const newFileData = filedata.replace(replaceString, `${replaceString}\n${typingsAttributesString}`);
        shell.ShellString(newFileData).to(typingsFilepath);
        console.log(`Generated ${this.entityName}.formContext.ts`);
    }

    private async getTypingsAttributesString(): Promise<string> {
        let typingsAttributesString = '';
        for (const attribute of this.attributesMetadata) {
            const {LogicalName: logicalName} = attribute;
            const xrmAttributeType = await this.getXrmAttributeType(attribute);
            if (xrmAttributeType) {
                typingsAttributesString += `        getAttribute(attributeName: '${logicalName}'): ${xrmAttributeType};\n`;
            }
        }
        return typingsAttributesString;
    }

    // TODO is now duplicate of AttributeFormContext
    // https://docs.microsoft.com/en-us/dotnet/api/microsoft.xrm.sdk.metadata.attributemetadata?view=dynamics-general-ce-9
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private async getXrmAttributeType(attribute: AttributeMetadata): Promise<string> {
        const {AttributeType: attributeType, SchemaName: schemaName} = attribute;
        if (['String', 'Memo', 'Uniqueidentifier'].includes(attributeType)) {
            return 'Xrm.Attributes.StringAttribute';
        } else if (['DateTime'].includes(attributeType)) {
            return 'Xrm.Attributes.DateAttribute';
        } else if (['Boolean'].includes(attributeType)) {
            return 'Xrm.Attributes.BooleanAttribute | Xrm.Attributes.EnumAttribute<number>';
        } else if (['Picklist', 'Status', 'State'].includes(attributeType)) {
            const typeName = `${this.entityName}_${schemaName}Values`;
            return `Xrm.Attributes.OptionSetAttribute<${typeName}>`;
        } else if (['Integer', 'Double', 'BigInt', 'Decimal', 'Double', 'Money'].includes(attributeType)) {
            return 'Xrm.Attributes.NumberAttribute';
        } else if (['Lookup', 'Customer', 'Owner'].includes(attributeType)) {
            return 'Xrm.Attributes.LookupAttribute';
        } else {
            console.log(colors.blue(`${this.entityLogicalName} attribute ${attributeType} falls back to Xrm.Attributes.Attribute.`));
            return 'Xrm.Attributes.Attribute';
        }
    }
}
