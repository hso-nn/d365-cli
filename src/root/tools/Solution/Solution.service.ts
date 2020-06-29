import {MultipleSystemQueryOptions} from '../../../../bin/root/src/WebApi/WebApi';
import {NodeApi} from '../NodeApi/NodeApi';
import {SolutionModel} from './Solution.model';
import {AdalRouterContext} from '../AdalRouter';

export class SolutionService {
    // private static logicalName = 'solution';
    private static entitySetName = 'solutions';

    public static async retrieveMultipleRecords(multipleSystemQueryOptions: MultipleSystemQueryOptions, context: AdalRouterContext): Promise<SolutionModel[]> {
        return NodeApi.retrieveMultipleRecords(SolutionService.entitySetName, multipleSystemQueryOptions, context);
    }

    public static async getSolution(select: string[], context: AdalRouterContext): Promise<SolutionModel> {
        const {settings} = context,
            {crm} = settings,
            {solution_name} = crm,
            solutions = await SolutionService.retrieveMultipleRecords({
                select: select,
                filters: [{
                    conditions: [{
                        attribute: 'uniquename',
                        value: solution_name
                    }]
                }]
            }, context);
        return solutions[0];
    }
}
