import * as shell from 'shelljs';
import * as fs from 'fs';
import cp from 'child_process';
import {NodeApi} from '../root/tools/NodeApi/NodeApi';

export class AttributeFormContext {
    private readonly bearer: string;
    private readonly entityName: string;
    private readonly entityLogicalName: string;
    private readonly log: (message: string) => Promise<void>;
    private attributesMetadata: AttributeMetadata[];

    constructor(bearer: string, entityName: string, entityLogicalName: string, log: (message: string) => Promise<void>) {
        this.bearer = bearer;
        this.entityName = entityName;
        this.entityLogicalName = entityLogicalName;
        this.log = log;
    }

    public static async generateFormContext(bearer: string, entityName: string, entityLogicalName: string, log: (message: string) => Promise<void>): Promise<void> {
        const formContext = new AttributeFormContext(bearer, entityName, entityLogicalName, log);
        await formContext.writeFormContextFile();
    }

    private async writeFormContextFile(): Promise<void> {
        await this.log(`Generating ${this.entityName}.formContext.ts<br/>`);
        this.attributesMetadata = await NodeApi.getAttributesMetadata(this.entityLogicalName, this.bearer);
        const formContextAttributesString = await this.getFormContextAttributesString();
        const formContextFilepath = `src/${this.entityName}/${this.entityName}.formContext.ts`;
        shell.cp('-r', `${__dirname}/Entity/Entity.attributesContext.ts`, `src/${this.entityName}`);
        shell.cp('-r', `src/${this.entityName}/Entity.attributesContext.ts`, formContextFilepath);
        shell.rm('-rf', `src/${this.entityName}/Entity.attributesContext.ts`);
        shell.sed('-i', new RegExp('Entity', 'g'), this.entityName, formContextFilepath);
        // shell.exec(`git add ${formContextFilepath}`);
        cp.execFileSync('git', ['add', formContextFilepath]);
        const filedata = String(fs.readFileSync(formContextFilepath));
        const replaceString = `${this.entityName}FormContext {`;
        const newFileData = filedata.replace(replaceString, `${replaceString}\n${formContextAttributesString}`);
        shell.ShellString(newFileData).to(formContextFilepath);
        await this.log(`Generated ${this.entityName}.formContext.ts<br/>`);
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
            await this.log(`<span style="color:blue;">${this.entityLogicalName} attribute ${attributeType} falls back to Xrm.Attributes.Attribute.</span><br/>`);
            return 'Xrm.Attributes.Attribute';
        }
    }

    private static capitalize(text: string): string {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }
}
