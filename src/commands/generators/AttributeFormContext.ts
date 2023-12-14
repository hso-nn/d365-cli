import * as shell from 'shelljs';
import * as fs from 'fs';
import cp from 'child_process';
import {NodeApi} from '../../node/NodeApi/NodeApi';
import colors from 'colors';

export class AttributeFormContext {
    private readonly bearer: string;
    private readonly entityName: string;
    private readonly entityLogicalName: string;
    private attributesMetadata: AttributeMetadata[];

    constructor(bearer: string, entityName: string, entityLogicalName: string) {
        this.bearer = bearer;
        this.entityName = entityName;
        this.entityLogicalName = entityLogicalName;
    }

    public static async generateFormContext(bearer: string, entityName: string, entityLogicalName: string): Promise<void> {
        const formContext = new AttributeFormContext(bearer, entityName, entityLogicalName);
        await formContext.writeFormContextFile();
    }

    private async writeFormContextFile(): Promise<void> {
        console.log(`Generating ${this.entityName}.formContext.ts`);
        this.attributesMetadata = await NodeApi.getAttributesMetadata(this.entityLogicalName, this.bearer);
        const formContextAttributesString = await this.getFormContextAttributesString();
        const formContextFilepath = `src/${this.entityName}/${this.entityName}.formContext.ts`;
        shell.cp('-r', `${__dirname}/Entity/Entity.formContext.ts`, `src/${this.entityName}`);
        shell.cp('-r', `src/${this.entityName}/Entity.formContext.ts`, formContextFilepath);
        shell.rm('-rf', `src/${this.entityName}/Entity.formContext.ts`);
        shell.sed('-i', new RegExp('Entity', 'g'), this.entityName, formContextFilepath);
        // shell.exec(`git add ${formContextFilepath}`);
        if (shell.test('-e', '../.git')) {
            cp.execFileSync('git', ['add', formContextFilepath]);
        }
        const filedata = String(fs.readFileSync(formContextFilepath));
        const replaceString = `${this.entityName}FormContext {`;
        const newFileData = filedata.replace(replaceString, `${replaceString}\n${formContextAttributesString}`);
        shell.ShellString(newFileData).to(formContextFilepath);
        console.log(`Generated ${this.entityName}.formContext.ts`);
    }

    private async getFormContextAttributesString(): Promise<string> {
        let formContextAttributesString = '';
        for (const attribute of this.attributesMetadata) {
            const {SchemaName: schemaName} = attribute;
            const xrmAttributeType = await this.getXrmAttributeType(attribute);
            if (xrmAttributeType) {
                const pascalSchemaName = AttributeFormContext.capitalize(schemaName);
                const methodName = `    static get${pascalSchemaName}Attribute(formContext: Xrm.FormContext): ${xrmAttributeType} {`;
                const returnString = `return formContext.getAttribute(${this.entityName}AttributeNames.${pascalSchemaName});`;
                formContextAttributesString += `${methodName}\n        ${returnString}\n    }\n`;
            }
        }
        return formContextAttributesString;
    }

    // https://docs.microsoft.com/en-us/dotnet/api/microsoft.xrm.sdk.metadata.attributemetadata?view=dynamics-general-ce-9
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public async getXrmAttributeType(attribute: AttributeMetadata): Promise<string> {
        const {AttributeType: attributeType, SchemaName: schemaName} = attribute;
        if (['String', 'Memo', 'Uniqueidentifier'].includes(attributeType)) {
            return 'Xrm.Attributes.StringAttribute';
        } else if (['DateTime'].includes(attributeType)) {
            return 'Xrm.Attributes.DateAttribute';
        } else if (['Boolean'].includes(attributeType)) {
            return 'Xrm.Attributes.BooleanAttribute';
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

    private static capitalize(text: string): string {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }
}
