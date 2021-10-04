import {NodeApi} from '../NodeApi/NodeApi';
import {SolutionModel} from './Solution.model';

export class SolutionService {
    // private static logicalName = 'solution';
    private static entitySetName = 'solutions';

    private static async retrieveMultipleRecords(multipleSystemQueryOptions: MultipleSystemQueryOptions, bearer: string): Promise<SolutionModel[]> {
        return NodeApi.retrieveMultipleRecords(SolutionService.entitySetName, multipleSystemQueryOptions, bearer);
    }

    public static async getSolution(uniqueName: string, select: string[], bearer: string): Promise<SolutionModel> {
        const solutions = await SolutionService.retrieveMultipleRecords({
            select: select,
            filters: [{
                conditions: [{
                    attribute: 'uniquename',
                    value: uniqueName
                }]
            }]
        }, bearer);
        return solutions[0];
    }
}
