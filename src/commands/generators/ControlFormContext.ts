import * as shell from 'shelljs';
import * as fs from 'fs';
import cp from 'child_process';
import {NodeApi} from '../../node/NodeApi/NodeApi';
import {
    FormJson,
    FormJsonColumn, FormJsonControl,
    FormJsonRow,
    FormJsonSection,
    FormJsonTab, SystemFormModel
} from '../../node/SystemForm/SystemForm.model';
import colors from 'colors';

export class ControlFormContext {
    private readonly bearer: string;
    private readonly entityName: string;
    private readonly entityLogicalName: string;
    private attributesMetadata: AttributeMetadata[];

    constructor(bearer: string, entityName: string, entityLogicalName: string) {
        this.bearer = bearer;
        this.entityName = entityName;
        this.entityLogicalName = entityLogicalName;
    }

    public static async generateFormContext(bearer: string, entityName: string, entityLogicalName: string, systemForm: SystemFormModel): Promise<void> {
        const formContext = new ControlFormContext(bearer, entityName, entityLogicalName);
        await formContext.writeFormContextFile(systemForm);
    }

    private async writeFormContextFile(systemForm: SystemFormModel): Promise<void> {
        const formName = systemForm.name.replace(/\W/g, '');
        console.log(`Generating ${formName}/${formName}.formContext.ts`);
        this.attributesMetadata = await NodeApi.getAttributesMetadata(this.entityLogicalName, this.bearer);
        const formContextControlsString = await this.getFormContextControlsString(systemForm);
        const formContextFilepath = `src/${this.entityName}/${formName}/${formName}.formContext.ts`;
        shell.cp('-r', `${__dirname}/Entity/form/Entity.formContext.ts`, `src/${this.entityName}/${formName}`);
        shell.cp('-r', `src/${this.entityName}/${formName}/Entity.formContext.ts`, formContextFilepath);
        shell.rm('-rf', `src/${this.entityName}/${formName}/Entity.formContext.ts`);
        shell.sed('-i', new RegExp('Entity', 'g'), this.entityName, formContextFilepath);
        shell.sed('-i', new RegExp('FormName', 'g'), formName, formContextFilepath);
        // shell.exec(`git add ${formContextFilepath}`);
        if (shell.test('-e', '../.git')) {
            cp.execFileSync('git', ['add', formContextFilepath]);
        }
        const fileData = String(fs.readFileSync(formContextFilepath));
        const replaceString = fileData.match(new RegExp(`${formName}FormContext extends ${this.entityName}Form {`, 'ig'))[0];
        const newFileData = fileData.replace(replaceString, `${replaceString}\n${formContextControlsString}`);
        shell.ShellString(newFileData).to(formContextFilepath);
        console.log(`Generated ${formName}/${formName}.formContext.ts`);
    }

    private static usedControlNames: string[];
    private async getFormContextControlsString(systemForm: SystemFormModel): Promise<string> {
        let formContextControlsString = '';
        ControlFormContext.usedControlNames = [];
        const formJson: FormJson = JSON.parse(systemForm.formjson);
        formContextControlsString += await this.getTabsString(formJson.Tabs.$values);
        formContextControlsString += await this.getControlsString(formJson.Header.Controls.$values);
        formContextControlsString += await this.getControlsString(formJson.Footer.Controls.$values);
        return formContextControlsString;
    }

    private static usedSectionNames: string[];
    private async getTabsString(tabs: FormJsonTab[]): Promise<string> {
        let tabsControlsString = '';
        ControlFormContext.usedSectionNames = [];
        for (const tab of tabs) {
            const tabName = tab.Name;
            if (tabName) {
                const pascalTabName = ControlFormContext.capitalize(tabName.replace(/\W/g, ''));
                const methodName = `    static get${pascalTabName}Tab(formContext: Xrm.FormContext): Xrm.Controls.Tab {`;
                const returnString = `return formContext.ui.tabs.get('${tabName}');`;
                tabsControlsString += `${methodName}\n        ${returnString}\n    }\n`;
            }
            tabsControlsString += await this.getColumnsString(tab, tab.Columns.$values);
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
                const pascalSectionName = ControlFormContext.capitalize(sectionName.replace(/\W/g, ''));
                if (!ControlFormContext.usedSectionNames.includes(pascalSectionName)) {
                    ControlFormContext.usedSectionNames.push(pascalSectionName);
                    const methodName = `    static get${pascalSectionName}Section(formContext: Xrm.FormContext): Xrm.Controls.Section {`;
                    const returnString = `return formContext.ui.tabs.get('${tab.Name}').sections.get('${sectionName}');`;
                    sectionsControlsString += `${methodName}\n        ${returnString}\n    }\n`;
                }
            }
            sectionsControlsString += await this.getRowsString(section.Rows.$values);
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
                        ControlFormContext.capitalize(attributeMetadata?.SchemaName || id) : ControlFormContext.capitalize(id);
                    if (!ControlFormContext.usedControlNames.includes(pascalSchemaName)) {
                        ControlFormContext.usedControlNames.push(pascalSchemaName);
                        const wordCharsOnly = pascalSchemaName.replace(/\W/g, '');
                        const methodName = `    static get${wordCharsOnly}Control(formContext: Xrm.FormContext): ${xrmControlType} {`;
                        const returnString = `return formContext.getControl('${id}');`;
                        cellControlsString += `${methodName}\n        ${returnString}\n    }\n`;
                    } else {
                        console.log(`Duplicate control name found: '${pascalSchemaName}'`);
                    }
                }
            }
        }
        return cellControlsString;
    }

    private async getXrmControlType(attributeMetadata: AttributeMetadata, type: number, id: string): Promise<string> {
        if (attributeMetadata) {
            const {AttributeType: attributeType, AttributeTypeName: attributeTypeName} = attributeMetadata;
            if (['String', 'Memo', 'Customer', 'Owner', 'Uniqueidentifier'].includes(attributeType)) {
                return 'Xrm.Controls.StringControl';
            } else if (['DateTime'].includes(attributeType)) {
                return 'Xrm.Controls.DateControl';
            } else if (['Boolean', 'Picklist'].includes(attributeType) || attributeTypeName.Value === 'MultiSelectPicklistType') {
                return 'Xrm.Controls.OptionSetControl';
            } else if (['Lookup'].includes(attributeType)) {
                return `Xrm.Controls.LookupControl`;
            } else if (['Integer', 'Double', 'BigInt', 'Decimal', 'Double', 'Money'].includes(attributeType)) {
                return 'Xrm.Controls.NumberControl';
            }
        }
        if (type === 4) {
            return 'Xrm.Controls.OptionSetControl';
        } else if (type === 5) {
            return 'Xrm.Controls.GridControl';
        } else if (type === 6) {
            return 'Xrm.Controls.FramedControl';
        } else if (type === 14) {
            return 'Xrm.Controls.StandardControl';
        } else {
            console.log(colors.blue(`${this.entityLogicalName} control ${id} type '${type}' falls back to Xrm.Controls.StandardControl.`));
            return 'Xrm.Controls.StandardControl';
        }
    }

    private static capitalize(text = ''): string {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }
}
