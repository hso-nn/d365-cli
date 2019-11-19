import {Filter, MultipleSystemQueryOptions, SystemQueryOptions, WebApi} from '../WebApi/WebApi';
import {EntityModel} from './Entity.model';

export class EntityService {
    private static logicalName = 'EntityLogicalName';

    public static async retrieveMultipleRecords(multipleSystemQueryOptions: MultipleSystemQueryOptions): Promise<EntityModel[]> {
        return WebApi.retrieveMultipleRecords(EntityService.logicalName, multipleSystemQueryOptions);
    }

    public static async retrieveRecord(id: string, systemQueryOptions: SystemQueryOptions): Promise<EntityModel> {
        return WebApi.retrieveRecord(EntityService.logicalName, id, systemQueryOptions);
    }

    public static async updateRecord(id: string, entityModel: EntityModel): Promise<EntityModel> {
        return WebApi.updateRecord(EntityService.logicalName, id, entityModel);
    }

    public static async createRecord(entityModel: EntityModel): Promise<EntityModel> {
        return WebApi.createRecord(EntityService.logicalName, entityModel);
    }

    public static async upsertRecord(entityModel: EntityModel): Promise<EntityModel> {
        return WebApi.upsertRecord(EntityService.logicalName, entityModel);
    }

    public static async count(filters?: Filter[]): Promise<number> {
        return WebApi.count(EntityService.logicalName, filters);
    }
}
