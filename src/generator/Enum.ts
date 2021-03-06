import * as shell from 'shelljs';
import * as fs from 'fs';
import {NodeApi} from '../root/tools/NodeApi/NodeApi';

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
            enumStrings += `    ${Enum.capitalize(schemaName)} = '${logicalName}',\n`;
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
                const pascalSchemaName = Enum.capitalize(schemaName);
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

    private static capitalize(text: string): string {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }
}
