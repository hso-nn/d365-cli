import {NodeApi} from '../NodeApi/NodeApi';
import {EntityModel} from './Entity.model';

export class EntityService {
    private static entitySetName = 'entities';

    public static async retrieveMultipleRecords(multipleSystemQueryOptions: MultipleSystemQueryOptions, bearer: string): Promise<EntityModel[]> {
        return NodeApi.retrieveMultipleRecords(EntityService.entitySetName, multipleSystemQueryOptions, bearer);
    }
}
