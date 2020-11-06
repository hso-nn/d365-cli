import {NodeApi} from '../NodeApi/NodeApi';
import {SystemFormModel} from './SystemForm.model';

export class SystemFormService {
    // private static logicalName = 'systemform';
    private static entitySetName = 'systemforms';

    public static async retrieveMultipleRecords(multipleSystemQueryOptions: MultipleSystemQueryOptions, bearer: string): Promise<SystemFormModel[]> {
        return NodeApi.retrieveMultipleRecords(SystemFormService.entitySetName, multipleSystemQueryOptions, bearer);
    }

    public static async updateRecord(id: string, systemFormModel: SystemFormModel, bearer: string): Promise<SystemFormModel> {
        return NodeApi.updateRecord(SystemFormService.entitySetName, id, systemFormModel, bearer);
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
