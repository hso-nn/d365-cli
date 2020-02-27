import {MultipleSystemQueryOptions} from '../../../../bin/root/src/WebApi/WebApi';
import {NodeApi} from '../NodeApi/NodeApi';
import {SolutionModel} from './Solution.model';
import {CrmJson} from '../CrmJson';
import * as fs from 'fs';

export class SolutionService {
    // private static logicalName = 'solution';
    private static entitySetName = 'solutions';

    public static async retrieveMultipleRecords(multipleSystemQueryOptions: MultipleSystemQueryOptions, bearer: string): Promise<SolutionModel[]> {
        return NodeApi.retrieveMultipleRecords(SolutionService.entitySetName, multipleSystemQueryOptions, bearer);
    }

    public static async getSolution(select: string[], bearer: string): Promise<SolutionModel> {
        const settings: CrmJson = JSON.parse(fs.readFileSync('tools/crm.json', 'utf8'));
        const {solution_name} = settings.crm;
        const solutions = await SolutionService.retrieveMultipleRecords({
            select: select,
            filters: [{
                conditions: [{
                    attribute: 'uniquename',
                    value: solution_name
                }]
            }]
        }, bearer);
        return solutions[0];
    }
}
