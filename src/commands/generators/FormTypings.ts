import * as shell from 'shelljs';
import * as fs from 'fs';
import {NodeApi} from '../../node/NodeApi/NodeApi';
import {
    FormJson, FormJsonColumn,
    FormJsonControl, FormJsonRow, FormJsonSection, FormJsonTab,
    SystemFormModel
} from '../../node/SystemForm/SystemForm.model';

export class FormTypings {
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

    public static async generate(bearer: string, entityName: string, entityLogicalName: string,
        log: (message: string) => Promise<void>, systemForm: SystemFormModel): Promise<void> {
        const formTypings = new FormTypings(bearer, entityName, entityLogicalName, log);
        await formTypings.writeTypingsFile(systemForm);
    }

    private async writeTypingsFile(systemForm: SystemFormModel): Promise<void> {
        await this.log(`Updating ${this.entityName}.d.ts<br/>`);
        this.attributesMetadata = await NodeApi.getAttributesMetadata(this.entityLogicalName, this.bearer);
        let formTypingsControlsString = `declare namespace ${this.entityName} {\n`;
        const formName = systemForm.name.replace(/\W/g, '');
        // eslint-disable-next-line max-len
        formTypingsControlsString += `    type ${formName} = Omit<${this.entityName}.AttributesFormContext, 'getControl'> & ${this.entityName}${formName}Controls;\n\n`;
        formTypingsControlsString += `    interface ${this.entityName}${formName}Controls {\n`;
        formTypingsControlsString += await this.getFormTypingsControlsString(systemForm);
        formTypingsControlsString += `    }\n}`;
        const typingsFilepath = `src/${this.entityName}/${this.entityName}.d.ts`;
        const fileData = String(fs.readFileSync(typingsFilepath));
        shell.ShellString(`${fileData}\n${formTypingsControlsString}`).to(typingsFilepath);
        await this.log(`Updated ${this.entityName}.d.ts<br/>`);
    }

    private static usedControlNames: string[];
    private async getFormTypingsControlsString(systemForm: SystemFormModel): Promise<string> {
        let formTypingsControlsString = '';
        FormTypings.usedControlNames = [];
        const formJson: FormJson = JSON.parse(systemForm.formjson);
        formTypingsControlsString += await this.getTabsString(formJson.Tabs.$values);
        formTypingsControlsString += await this.getControlsString(formJson.Header.Controls.$values);
        formTypingsControlsString += await this.getControlsString(formJson.Footer.Controls.$values);
        return formTypingsControlsString;
    }

    private async getTabsString(tabs: FormJsonTab[]): Promise<string> {
        let tabsControlsString = '';
        for (const tab of tabs) {
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
        let controlsString = '';
        for (const control of controls) {
            const {Type: type, Id: id, DataFieldName: dataFieldName} = control;
            if (id) {
                const attributeMetadata = dataFieldName && this.attributesMetadata
                    .find((attrMetadata: {LogicalName: string}) => attrMetadata.LogicalName === dataFieldName);
                const xrmControlType = await this.getXrmControlType(attributeMetadata, type, id);
                if (xrmControlType) {
                    if (!FormTypings.usedControlNames.includes(id)) {
                        FormTypings.usedControlNames.push(id);
                        controlsString += `        getControl(controlName: '${id}'): ${xrmControlType};\n`;
                    } else {
                        await this.log(`Duplicate control name found: '${id}'`);
                    }
                }
            }
        }
        return controlsString;
    }

    // TODO is now duplicate of ControlFormContext
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
            await this.log(`<span style="color:blue;">${this.entityLogicalName} control ${id} type '${type}' falls back to Xrm.Controls.StandardControl.</span>`);
            return 'Xrm.Controls.StandardControl';
        }
    }
}
