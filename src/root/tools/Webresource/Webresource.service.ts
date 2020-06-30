import {MultipleSystemQueryOptions, SystemQueryOptions} from '../../../../bin/root/src/WebApi/WebApi';
import {WebresourceModel} from './Webresource.model';
import {NodeApi} from '../NodeApi/NodeApi';
import {ComponentType} from '../Solution/ComponentType';
import {AdalRouterContext} from '../AdalRouter';

export class WebresourceService {
    private static logicalName = 'webresource';
    // private static entitySetName = 'webresourceset';

    public static async retrieveMultipleRecords(multipleSystemQueryOptions: MultipleSystemQueryOptions, context: AdalRouterContext): Promise<WebresourceModel[]> {
        return NodeApi.retrieveMultipleRecords(WebresourceService.logicalName, multipleSystemQueryOptions, context);
    }

    public static async retrieveRecord(id: string, systemQueryOptions: SystemQueryOptions, context: AdalRouterContext): Promise<WebresourceModel> {
        return NodeApi.retrieveRecord(WebresourceService.logicalName, id, systemQueryOptions, context);
    }

    public static async upsert(webresource: WebresourceModel, context: AdalRouterContext): Promise<WebresourceModel> {
        if (webresource.webresourceid) {
            await NodeApi.updateRecord(WebresourceService.logicalName, webresource.webresourceid, webresource, context);
            return webresource;
        } else {
            const namesplit = webresource.name.split('.'),
                extension = namesplit[namesplit.length - 1];
            webresource.webresourcetype = await WebresourceService.getWebresourcetype(extension, context);
            const newWebresource = await NodeApi.insertRecord(WebresourceService.logicalName, webresource, context);
            return newWebresource;
        }
    }

    public static async publish(webresource: WebresourceModel, context: AdalRouterContext): Promise<void> {
        const data = {
            ParameterXml: `<importexportxml><webresources><webresource>{${webresource.webresourceid}}</webresource></webresources></importexportxml>`
        };
        return NodeApi.executeAction('PublishXml', context, data);
    }

    public static async addToSolution(webresource: WebresourceModel, context: AdalRouterContext): Promise<void> {
        const {settings} = context,
            {crm} = settings,
            {solution_name} = crm;
        return NodeApi.executeAction('AddSolutionComponent', context, {
            ComponentId: webresource.webresourceid,
            ComponentType: ComponentType.Webresource, // 61
            SolutionUniqueName: solution_name,
            AddRequiredComponents: false,
            IncludedComponentSettingsValues: null
        });
    }

    private static async getWebresourcetype(extension: string, context: AdalRouterContext): Promise<number> {
        const options = await NodeApi.getPicklistOptionSet(WebresourceService.logicalName, 'webresourcetype', context);
        let webresourcetype: number,
            scriptvalue: number;
        for (const {value, label} of options) {
            if (label.toLocaleLowerCase().includes('script')) {
                scriptvalue = parseInt(String(value), 10);
            }
            if (label.toLowerCase().includes(extension)) {
                webresourcetype = parseInt(String(value), 10);
                break;
            }
        }
        if (!webresourcetype && extension === 'json') {
            webresourcetype = scriptvalue;
        }
        return webresourcetype;
    }
}
