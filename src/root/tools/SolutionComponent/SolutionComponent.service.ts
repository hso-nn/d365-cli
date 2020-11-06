import {NodeApi} from '../NodeApi/NodeApi';
import {SolutionComponentModel} from './SolutionComponent.model';

export class SolutionComponentService {
    // private static logicalName = 'solutioncomponent';
    private static entitySetName = 'solutioncomponents';

    public static async retrieveMultipleRecords(multipleSystemQueryOptions: MultipleSystemQueryOptions, bearer: string): Promise<SolutionComponentModel[]> {
        return NodeApi.retrieveMultipleRecords(SolutionComponentService.entitySetName, multipleSystemQueryOptions, bearer);
    }
}
