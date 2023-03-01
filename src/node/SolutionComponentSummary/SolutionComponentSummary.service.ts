import {NodeApi} from '../NodeApi/NodeApi';
import {SolutionComponentSummaryModel} from './SolutionComponentSummary.model';

export class SolutionComponentSummaryService {
    private static entitySetName = 'msdyn_solutioncomponentsummaries';

    public static async retrieveMultipleRecords(multipleSystemQueryOptions: MultipleSystemQueryOptions, bearer: string): Promise<SolutionComponentSummaryModel[]> {
        return NodeApi.retrieveMultipleRecords(SolutionComponentSummaryService.entitySetName, multipleSystemQueryOptions, bearer);
    }
}
