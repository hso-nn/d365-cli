import * as shell from 'shelljs';
import * as fs from 'fs';
import {NodeApi} from '../root/tools/NodeApi/NodeApi';
import {
    FormJson,
    FormJsonColumn, FormJsonControl,
    FormJsonRow,
    FormJsonSection,
    FormJsonTab, SystemFormModel
} from '../root/tools/SystemForm/SystemForm.model';

export class ControlFormContext {
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

    public static async generateFormContext(bearer: string, entityName: string, entityLogicalName: string,
        log: (message: string) => Promise<void>, systemForm: SystemFormModel): Promise<void> {
        const formContext = new ControlFormContext(bearer, entityName, entityLogicalName, log);
        await formContext.writeFormContextFile(systemForm);
    }

    private async writeFormContextFile(systemForm: SystemFormModel): Promise<void> {
        const formName = systemForm.name.replace(/\W/g, '');
        await this.log(`Generating ${formName}/${formName}.formContext.ts<br/>`);
        this.attributesMetadata = await NodeApi.getAttributesMetadata(this.entityLogicalName, this.bearer);
        const formContextControlsString = await this.getFormContextControlsString(systemForm);
        const formContextFilepath = `src/${this.entityName}/${formName}/${formName}.formContext.ts`;
        shell.cp('-r', `${__dirname}/Entity/Entity.formContext.ts`, `src/${this.entityName}/${formName}`);
        shell.cp('-r', `src/${this.entityName}/${formName}/Entity.formContext.ts`, formContextFilepath);
        shell.rm('-rf', `src/${this.entityName}/${formName}/Entity.formContext.ts`);
        shell.sed('-i', new RegExp('Entity', 'g'), this.entityName, formContextFilepath);
        shell.sed('-i', new RegExp('FormName', 'g'), formName, formContextFilepath);
        shell.exec(`git add ${formContextFilepath}`);
        const filedata = String(fs.readFileSync(formContextFilepath));
        const replaceString = `${formName}FormContext extends ${this.entityName}FormContext {`;
        const newFileData = filedata.replace(replaceString, `${replaceString}\n${formContextControlsString}`);
        shell.ShellString(newFileData).to(formContextFilepath);
        await this.log(`Generated ${formName}/${formName}.formContext.ts<br/>`);
    }

    // eslint-disable-next-line max-lines-per-function
    private async getFormContextControlsString(systemForm: SystemFormModel): Promise<string> {
        let formContextControlsString = '';
        const formJson: FormJson = JSON.parse(systemForm.formjson);
        formContextControlsString += await this.getTabsString(formJson.Tabs.$values);
        formContextControlsString += await this.getControlsString(formJson.Header.Controls.$values);
        formContextControlsString += await this.getControlsString(formJson.Footer.Controls.$values);
        return formContextControlsString;
    }

    private async getTabsString(tabs: FormJsonTab[]): Promise<string> {
        let tabsControlsString = '';
        for (const tab of tabs) {
            const tabName = tab.Name;
            if (tabName) {
                const pascalTabName = ControlFormContext.capitalize(tabName);
                const methodName = `    static get${pascalTabName}Tab(formContext: FormContext): Xrm.Controls.Tab {`;
                const returnString = `return formContext.ui.tabs.get('${tabName}');`;
                tabsControlsString += `${methodName}\n        ${returnString}\n    }\n`;
                tabsControlsString += await this.getColumnsString(tab, tab.Columns.$values);
            }
        }
        return tabsControlsString;
    }

    private async getColumnsString(tab: FormJsonTab, columns: FormJsonColumn[]): Promise<string> {
        let columnsControlsString = '';
        for (const column of columns) {
            columnsControlsString += await this.getSectionsString(tab, column.Sections.$values);
        }
        return columnsControlsString;
    }

    private async getSectionsString(tab: FormJsonTab, sections: FormJsonSection[]): Promise<string> {
        let sectionsControlsString = '';
        for (const section of sections) {
            const {Name: sectionName} = section;
            if (sectionName) {
                const pascalSectionName = ControlFormContext.capitalize(sectionName);
                const methodName = `    static get${pascalSectionName}Section(formContext: FormContext): Xrm.Controls.Section {`;
                const returnString = `return formContext.ui.tabs.get('${tab.Name}').sections.get('${sectionName}');`;
                sectionsControlsString += `${methodName}\n        ${returnString}\n    }\n`;
                sectionsControlsString += await this.getRowsString(section.Rows.$values);
            }
        }
        return sectionsControlsString;
    }

    private async getRowsString(rows: FormJsonRow[]): Promise<string> {
        let rowsControlsString = '';
        for (const row of rows) {
            const controls = row.Cells.$values.map(cell => cell.Control);
            rowsControlsString += await this.getControlsString(controls);
        }
        return rowsControlsString;
    }

    private async getControlsString(controls: FormJsonControl[]): Promise<string> {
        let cellControlsString = '';
        for (const control of controls) {
            const {Type: type, Id: id, DataFieldName: dataFieldName} = control;
            if (id) {
                const attributeMetadata = dataFieldName && this.attributesMetadata
                    .find((attrMetadata: {LogicalName: string}) => attrMetadata.LogicalName === dataFieldName);
                const xrmControlType = await this.getXrmControlType(attributeMetadata, type, id);
                if (xrmControlType) {
                    const pascalSchemaName = dataFieldName === id ?
                        ControlFormContext.capitalize(attributeMetadata.SchemaName) : ControlFormContext.capitalize(id);
                    const methodName = `    static get${pascalSchemaName}Control(formContext: FormContext): ${xrmControlType} {`;
                    const returnString = `return formContext.getControl('${id}');`;
                    cellControlsString += `${methodName}\n        ${returnString}\n    }\n`;
                }
            }
        }
        return cellControlsString;
    }

    private async getXrmControlType(attributeMetadata: AttributeMetadata, type: number, id: string): Promise<string> {
        if (attributeMetadata) {
            const {AttributeType: attributeType} = attributeMetadata;
            if (['String', 'Memo', 'DateTime', 'Customer', 'Owner', 'Uniqueidentifier'].includes(attributeType)) {
                return 'Xrm.Controls.StringControl';
            } else if (['DateTime'].includes(attributeType)) {
                return 'Xrm.Controls.DateControl';
            } else if (['Boolean', 'Picklist'].includes(attributeType)) {
                return 'Xrm.Controls.OptionSetControl';
            } else if (['Lookup'].includes(attributeType)) {
                return `Xrm.Controls.LookupControl`;
            } else if (['Integer', 'Double', 'BigInt', 'Decimal', 'Double', 'Money'].includes(attributeType)) {
                return 'Xrm.Controls.NumberControl';
            }
        }
        if (type === 5) {
            return 'Xrm.Controls.GridControl';
        } else if (type === 6) {
            return 'Xrm.Controls.FramedControl';
        } else if (type === 14) {
            return 'Xrm.Controls.StandardControl';
        } else {
            await this.log(`<span style="color:blue;">${this.entityLogicalName} control ${id} falls back to Xrm.Controls.StandardControl.</span>`);
            return 'Xrm.Controls.StandardControl';
        }
    }

    private static capitalize(text: string): string {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }
}
