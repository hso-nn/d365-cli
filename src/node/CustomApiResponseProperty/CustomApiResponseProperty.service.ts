import {NodeApi} from '../NodeApi/NodeApi';
import {CustomApiResponsePropertyModel} from './CustomApiResponseProperty.model';

export class CustomApiResponsePropertyService {
    private static entitySetName = 'customapiresponseproperties';

    public static async retrieveMultipleRecords(multipleSystemQueryOptions: MultipleSystemQueryOptions, bearer: string): Promise<CustomApiResponsePropertyModel[]> {
        return NodeApi.retrieveMultipleRecords(CustomApiResponsePropertyService.entitySetName, multipleSystemQueryOptions, bearer);
    }
}
