import {NodeApi} from '../NodeApi/NodeApi';
import {CustomApiModel} from './CustomApi.model';

export class CustomApiService {
    private static entitySetName = 'customapis';

    public static async retrieveMultipleRecords(multipleSystemQueryOptions: MultipleSystemQueryOptions, bearer: string): Promise<CustomApiModel[]> {
        return NodeApi.retrieveMultipleRecords(CustomApiService.entitySetName, multipleSystemQueryOptions, bearer);
    }
}
