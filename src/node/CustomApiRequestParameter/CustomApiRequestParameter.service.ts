import {NodeApi} from '../NodeApi/NodeApi';
import {CustomApiRequestParameterModel} from './CustomApiRequestParameter.model';

export class CustomApiRequestParameterService {
    private static entitySetName = 'customapirequestparameters';

    public static async retrieveMultipleRecords(multipleSystemQueryOptions: MultipleSystemQueryOptions, bearer: string): Promise<CustomApiRequestParameterModel[]> {
        return NodeApi.retrieveMultipleRecords(CustomApiRequestParameterService.entitySetName, multipleSystemQueryOptions, bearer);
    }
}
