import {MultipleSystemQueryOptions} from '../../../../bin/root/src/WebApi/WebApi';
import {NodeApi} from '../NodeApi/NodeApi';
import {SystemFormModel} from './SystemForm.model';
import {AdalRouterContext} from '../AdalRouter';

export class SystemFormService {
    // private static logicalName = 'systemform';
    private static entitySetName = 'systemforms';

    public static async retrieveMultipleRecords(multipleSystemQueryOptions: MultipleSystemQueryOptions, context: AdalRouterContext): Promise<SystemFormModel[]> {
        return NodeApi.retrieveMultipleRecords(SystemFormService.entitySetName, multipleSystemQueryOptions, context);
    }

    public static async updateRecord(id: string, systemFormModel: SystemFormModel, context: AdalRouterContext): Promise<SystemFormModel> {
        return NodeApi.updateRecord(SystemFormService.entitySetName, id, systemFormModel, context);
    }

    public static async getSystemForm(formid: string, select: string[], context: AdalRouterContext): Promise<SystemFormModel> {
        const systemForms = await SystemFormService.retrieveMultipleRecords({
            select: select,
            filters: [{
                conditions: [{
                    attribute: 'formid',
                    value: formid
                }]
            }]
        }, context);
        return systemForms[0];
    }
}
