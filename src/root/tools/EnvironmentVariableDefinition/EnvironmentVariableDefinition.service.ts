import {NodeApi} from '../NodeApi/NodeApi';
import {EnvironmentVariableDefinitionModel} from './EnvironmentVariableDefinition.model';

export class EnvironmentVariableDefinitionService {
    private static entitySetName = 'environmentvariabledefinitions';

    public static async retrieveMultipleRecords(multipleSystemQueryOptions: MultipleSystemQueryOptions, bearer: string): Promise<EnvironmentVariableDefinitionModel[]> {
        return NodeApi.retrieveMultipleRecords(EnvironmentVariableDefinitionService.entitySetName, multipleSystemQueryOptions, bearer);
    }
}
