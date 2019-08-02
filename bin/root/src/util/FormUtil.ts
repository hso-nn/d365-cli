
export class FormUtil {
    static async addCustomView(attributeName: string, executionContext: any, filterXML: string) {
        const formContext = executionContext ? executionContext.getFormContext() : null;
        if (formContext) {
            const control = formContext.getControl(attributeName),
                viewId = control.getDefaultView(),
                parser = new DOMParser(),
                defaultView = await (<any>window).Xrm.WebApi.retrieveRecord('savedquery', viewId),
                xmlDoc = parser.parseFromString(defaultView.fetchxml, 'text/xml');
            if (xmlDoc.getElementsByTagName('filter').length === 0) {
                xmlDoc.getElementsByTagName('entity')[0].appendChild(parser.parseFromString(filterXML, 'text/xml').firstChild);
            } else {
                xmlDoc.getElementsByTagName('filter')[0].replaceWith(parser.parseFromString(filterXML, 'text/xml').firstChild);
            }
            control.addCustomView(viewId, defaultView.returnedtypecode, defaultView.name, (<any>xmlDoc.firstChild).outerHTML, defaultView.layoutxml, true);
        }
    }
}
