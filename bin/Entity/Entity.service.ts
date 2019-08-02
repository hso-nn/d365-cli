import {MultipleSystemQueryOptions, SystemQueryOptions, WebApi} from '../WebApi/WebApi';
import {EntityModel} from './Entity.model';

export class EntityService {
    private static logicalName: 'EntityLogicalName';

    public static async retrieveMultipleRecords(multipleSystemQueryOptions: MultipleSystemQueryOptions): Promise<EntityModel[]> {
        return WebApi.retrieveMultipleRecords(EntityService.logicalName, multipleSystemQueryOptions);
    }

    public static async retrieveRecord(id: string, systemQueryOptions: SystemQueryOptions): Promise<EntityModel> {
        return WebApi.retrieveRecord(EntityService.logicalName, id, systemQueryOptions);
    }
}
