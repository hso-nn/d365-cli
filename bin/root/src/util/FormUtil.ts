
export class FormUtil {
    static async addCustomView(attributeName: string, executionContext: Xrm.Events.EventContext, filterXML: string): Promise<void> {
        const formContext = executionContext ? executionContext.getFormContext() : null;
        if (formContext) {
            const control: Xrm.Controls.LookupControl = formContext.getControl(attributeName),
                viewId = control.getDefaultView(),
                parser = new DOMParser(),
                defaultView = await Xrm.WebApi.retrieveRecord('savedquery', viewId),
                xmlDoc: Document = parser.parseFromString(defaultView.fetchxml, 'text/xml');
            if (xmlDoc.getElementsByTagName('filter').length === 0) {
                xmlDoc.getElementsByTagName('entity')[0].appendChild(parser.parseFromString(filterXML, 'text/xml').firstChild);
            } else {
                xmlDoc.getElementsByTagName('filter')[0].replaceWith(parser.parseFromString(filterXML, 'text/xml').firstChild);
            }
            const firstChild = xmlDoc.firstChild as Element;
            control.addCustomView(viewId, defaultView.returnedtypecode, defaultView.name, firstChild.outerHTML, defaultView.layoutxml, true);
        }
    }

    static setDisabled(executionContext: Xrm.Events.EventContext, disabled: boolean, attributeNames: string[]): void {
        const formContext = executionContext.getFormContext();

        attributeNames.forEach((fieldname: string) => {
            const formControl: Xrm.Controls.StandardControl = formContext.getControl(fieldname);
            if (formControl) {
                formControl.setDisabled(disabled);
            }
        });
    }

    static setVisible(executionContext: Xrm.Events.EventContext, visible: boolean, attributeNames: string[]): void {
        const formContext = executionContext.getFormContext();

        attributeNames.forEach((fieldname: string) => {
            const formControl: Xrm.Controls.StandardControl = formContext.getControl(fieldname);
            if (formControl) {
                formControl.setVisible(visible);
            }
        });
    }
}
