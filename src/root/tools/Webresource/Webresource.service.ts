import {WebresourceModel} from './Webresource.model';
import {NodeApi} from '../NodeApi/NodeApi';

export class WebresourceService {
    public static logicalName = 'webresource';
    private static entitySetName = 'webresourceset';

    public static async retrieveMultipleRecords(multipleSystemQueryOptions: MultipleSystemQueryOptions, bearer: string): Promise<WebresourceModel[]> {
        return NodeApi.retrieveMultipleRecords(WebresourceService.entitySetName, multipleSystemQueryOptions, bearer);
    }

    public static async retrieveRecord(id: string, systemQueryOptions: SystemQueryOptions, bearer: string): Promise<WebresourceModel> {
        return NodeApi.retrieveRecord(WebresourceService.entitySetName, id, systemQueryOptions, bearer);
    }

    public static async upsert(webresource: WebresourceModel, bearer: string): Promise<WebresourceModel> {
        if (webresource.webresourceid) {
            await NodeApi.updateRecord(WebresourceService.entitySetName, webresource.webresourceid, webresource, bearer);
            return webresource;
        } else {
            const namesplit = webresource.name.split('.'),
                extension = namesplit[namesplit.length - 1];
            webresource.webresourcetype = await WebresourceService.getWebresourcetype(extension, bearer);
            const newWebresource = await NodeApi.insertRecord(WebresourceService.entitySetName, webresource, bearer);
            return newWebresource;
        }
    }

    public static async publish(webresource: WebresourceModel, bearer: string): Promise<void> {
        const data = {
            ParameterXml: `<importexportxml><webresources><webresource>{${webresource.webresourceid}}</webresource></webresources></importexportxml>`
        };
        return NodeApi.executeAction('PublishXml', bearer, data);
    }

    public static async addToSolution(webresource: WebresourceModel, solutionUniqueName: string, bearer: string): Promise<void> {
        return NodeApi.executeAction('AddSolutionComponent', bearer, {
            ComponentId: webresource.webresourceid,
            ComponentType: 61,
            SolutionUniqueName: solutionUniqueName,
            AddRequiredComponents: false,
            IncludedComponentSettingsValues: null
        });
    }

    private static async getWebresourcetype(extension: string, bearer: string): Promise<number> {
        const optionSet = await NodeApi.getPicklistOptionSet(WebresourceService.logicalName, 'webresourcetype', bearer);
        let webresourcetype: number,
            scriptvalue: number;
        for (const option of optionSet.Options) {
            const value = option.Value;
            const label = option.Label.UserLocalizedLabel.Label;
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
