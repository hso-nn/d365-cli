import {NodeApi} from '../NodeApi/NodeApi';
import {SystemFormModel} from './SystemForm.model';
import {SolutionComponentModel} from '../SolutionComponent/SolutionComponent.model';

export class SystemFormService {
    // private static logicalName = 'systemform';
    private static entitySetName = 'systemforms';

    public static async retrieveMultipleRecords(multipleSystemQueryOptions: MultipleSystemQueryOptions, bearer: string): Promise<SystemFormModel[]> {
        return NodeApi.retrieveMultipleRecords(SystemFormService.entitySetName, multipleSystemQueryOptions, bearer);
    }

    public static async updateRecord(id: string, systemFormModel: SystemFormModel, bearer: string): Promise<SystemFormModel> {
        return NodeApi.updateRecord(SystemFormService.entitySetName, id, systemFormModel, bearer);
    }

    public static async fetchXml(fetchXml: string, bearer: string): Promise<SolutionComponentModel[]> {
        return NodeApi.fetchXml(this.entitySetName, fetchXml, bearer);
    }

    public static async getSystemForms(entityLogicalName: string, select: string[], bearer: string): Promise<SystemFormModel[]> {
        const systemForms = await SystemFormService.retrieveMultipleRecords({
            select: select,
            filters: [{
                conditions: [{
                    attribute: 'objecttypecode',
                    value: entityLogicalName
                }]
            }]
        }, bearer);
        return systemForms;
    }

    public static async getSystemForm(formid: string, select: string[], bearer: string): Promise<SystemFormModel> {
        const systemForms = await SystemFormService.retrieveMultipleRecords({
            select: select,
            filters: [{
                conditions: [{
                    attribute: 'formid',
                    value: formid
                }]
            }]
        }, bearer);
        return systemForms[0];
    }
}
