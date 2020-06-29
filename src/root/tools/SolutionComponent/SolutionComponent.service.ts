import {MultipleSystemQueryOptions} from '../../../../bin/root/src/WebApi/WebApi';
import {NodeApi} from '../NodeApi/NodeApi';
import {SolutionComponentModel} from './SolutionComponent.model';
import {AdalRouterContext} from '../AdalRouter';

export class SolutionComponentService {
    // private static logicalName = 'solutioncomponent';
    private static entitySetName = 'solutioncomponents';

    public static async retrieveMultipleRecords(multipleSystemQueryOptions: MultipleSystemQueryOptions, context: AdalRouterContext): Promise<SolutionComponentModel[]> {
        return NodeApi.retrieveMultipleRecords(SolutionComponentService.entitySetName, multipleSystemQueryOptions, context);
    }
}
