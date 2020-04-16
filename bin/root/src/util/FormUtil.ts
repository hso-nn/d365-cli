
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

    static async getLookupValue(attributeName: string, id: string, executionContext: Xrm.Events.EventContext): Promise<Xrm.LookupValue> {
        const formContext = executionContext.getFormContext(),
            entityName = formContext.data.entity.getEntityName(),
            entityMetadata = await Xrm.Utility.getEntityMetadata(entityName, [attributeName]),
            attributeMetadata = entityMetadata.Attributes.get(attributeName);
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        for (const target of attributeMetadata.Targets) {
            try {
                const targetEntityMetadata = await Xrm.Utility.getEntityMetadata(target),
                    entity = await Xrm.WebApi.retrieveRecord(target, id, `?$select=${targetEntityMetadata.PrimaryNameAttribute}`);
                if (entity) {
                    return {
                        entityType: target,
                        id: id,
                        name: entity[targetEntityMetadata.PrimaryNameAttribute]
                    };
                }
            } catch (e) {
                // try next target
            }
        }
    }
}
