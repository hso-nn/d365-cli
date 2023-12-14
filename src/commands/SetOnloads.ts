import {MsalRouter} from '../routers/MsalRouter';
import {SolutionComponentSummaryModel} from '../node/SolutionComponentSummary/SolutionComponentSummary.model';
import {SolutionComponentSummaryService} from '../node/SolutionComponentSummary/SolutionComponentSummary.service';
import {SystemFormService} from '../node/SystemForm/SystemForm.service';
import {SystemFormModel} from '../node/SystemForm/SystemForm.model';
import fs from 'fs';
import {CrmJson} from '../root/CrmJson';
import {DOMParser, XMLSerializer} from '@xmldom/xmldom';

export class SetOnloads extends MsalRouter {
    protected async onAuthenticated(): Promise<void> {
        console.log(`Onloads`);
        return SetOnloads.setOnLoads(this.bearer);
    }

    // eslint-disable-next-line max-lines-per-function
    public static async setOnLoads(bearer: string): Promise<void> {
        const formSolutionComponentSummaries = await SolutionComponentSummaryService.retrieveFormSolutionComponentSummaries(bearer);

        for (const formSolutionComponentSummary of formSolutionComponentSummaries) {
            const systemForm = await this.getSystemForm(formSolutionComponentSummary, bearer);
            // console.log(`Form: ${systemForm.formjson}`);
            // search for dist/hds_/ces/AddressLocation/AddressLocation.js
            const settings: CrmJson = JSON.parse(fs.readFileSync('../crm.json', 'utf8'));
            const {crm} = settings;
            const {publisher_prefix, namespace} = crm;
            const entityName = formSolutionComponentSummary.msdyn_displayname.replace(/\W/g, '');
            const formName = systemForm.name.replace(/\W/g, '');
            const functionName = `${publisher_prefix}.${namespace}.${entityName}.${formName}.Form.onLoad`;
            const libraryName = `${publisher_prefix}_/${namespace}/${entityName}/${formName}.js`;
            const path = `dist/${libraryName}`;

            if (fs.existsSync(path)) {
                const document = new DOMParser().parseFromString(systemForm.formxml, 'text/xml');
                const handlerAdded = this.addOnloadHandler(document, libraryName, functionName);
                const libraryAdded = this.addFormLibrary(document, libraryName);
                if (handlerAdded || libraryAdded) {
                    systemForm.formxml = new XMLSerializer().serializeToString(document);
                    await this.setForm(systemForm, bearer);
                }
            }
        }
    }

    // eslint-disable-next-line max-lines-per-function
    private static addOnloadHandler(document: Document, libraryName: string, functionName: string): boolean {
        const formElement = document.documentElement;
        let added = false;
        let eventsElement = formElement.getElementsByTagName('events')[0];
        if (!eventsElement) {
            console.log('Creating events element');
            eventsElement = document.createElement('events');
            formElement.appendChild(eventsElement);
            added = true;
        }
        const eventElements = eventsElement.getElementsByTagName('event');
        let onLoadEventElement: Element;
        for (let i = 0; i < eventElements.length; i += 1) {
            const element = eventElements[i];
            if (element.getAttribute('name') === 'onload') {
                onLoadEventElement = element;
                break;
            }
        }
        if (!onLoadEventElement) {
            console.log('Creating onload event element');
            onLoadEventElement = document.createElement('event');
            onLoadEventElement.setAttribute('name', 'onload');
            onLoadEventElement.setAttribute('application', 'false');
            onLoadEventElement.setAttribute('active', 'false');
            eventsElement.appendChild(onLoadEventElement);
            added = true;
        }
        let handlersElement = onLoadEventElement.getElementsByTagName('Handlers')[0];
        if (!handlersElement) {
            console.log('Creating handlers element');
            handlersElement = document.createElement('Handlers');
            onLoadEventElement.appendChild(handlersElement);
            added = true;
        }
        const handlerElements = handlersElement.getElementsByTagName('Handler');
        let onLoadHandlerElement: Element;
        for (let i = 0; i < handlerElements.length; i += 1) {
            const element = handlerElements[i];
            if (element.getAttribute('functionName') === functionName) {
                onLoadHandlerElement = element;
                break;
            }
        }
        if (onLoadHandlerElement) {
            console.log(`Handler already exists: ${functionName}`);
        } else {
            console.log(`Creating handler: ${functionName}`);
            onLoadHandlerElement = document.createElement('Handler');
            onLoadHandlerElement.setAttribute('functionName', functionName);
            onLoadHandlerElement.setAttribute('libraryName', libraryName);
            onLoadHandlerElement.setAttribute('enabled', 'true');
            onLoadHandlerElement.setAttribute('passExecutionContext', 'true');
            onLoadHandlerElement.setAttribute('handlerUniqueId', SetOnloads.guid());
            handlersElement.appendChild(onLoadHandlerElement);
            added = true;
        }
        return added;
    }

    private static addFormLibrary(document: Document, libraryName: string): boolean {
        const formElement = document.documentElement;
        let added = false;
        let formLibrariesElement = formElement.getElementsByTagName('formLibraries')[0];
        if (!formLibrariesElement) {
            console.log('Creating formLibraries element');
            formLibrariesElement = document.createElement('formLibraries');
            formElement.appendChild(formLibrariesElement);
            added = true;
        }
        const libraryElements = formLibrariesElement.getElementsByTagName('Library');
        let formLibraryElement: Element;
        for (let i = 0; i < libraryElements.length; i += 1) {
            const element = libraryElements[i];
            if (element.getAttribute('name') === libraryName) {
                formLibraryElement = element;
                break;
            }
        }
        if (formLibraryElement) {
            console.log(`Library already exists: ${libraryName}`);
        } else {
            console.log('Creating formLibrary element');
            formLibraryElement = document.createElement('Library');
            formLibraryElement.setAttribute('name', libraryName);
            formLibraryElement.setAttribute('libraryUniqueId', SetOnloads.guid());
            formLibrariesElement.appendChild(formLibraryElement);
            added = true;
        }
        return added;
    }

    private static getSystemForm(solutionComponentSummary: SolutionComponentSummaryModel, bearer: string): Promise<SystemFormModel> {
        return SystemFormService.getSystemForm(solutionComponentSummary.msdyn_objectid,
            ['name', 'formxml'], bearer);
    }

    private static async setForm(systemForm: SystemFormModel, bearer: string): Promise<void> {
        try {
            await SystemFormService.updateRecord(systemForm.formid, systemForm, bearer);
            console.log(`Updated ${systemForm.name}`);
        } catch (e) {
            console.log(e.message);
        }
    }

    private static guid(): string {
        return '{xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx}'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}
