import {NodeApi} from '../NodeApi/NodeApi';
import {SavedQueryModel} from './SavedQuery.model';

export class SavedQueryService {
    private static entitySetName = 'savedqueries';

    public static async retrieveMultipleRecords(multipleSystemQueryOptions: MultipleSystemQueryOptions, bearer: string): Promise<SavedQueryModel[]> {
        return NodeApi.retrieveMultipleRecords(SavedQueryService.entitySetName, multipleSystemQueryOptions, bearer);
    }

    public static async updateRecord(id: string, savedQueryModel: SavedQueryModel, bearer: string): Promise<SavedQueryModel> {
        return NodeApi.updateRecord(SavedQueryService.entitySetName, id, savedQueryModel, bearer);
    }
}
