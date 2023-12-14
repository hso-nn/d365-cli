import {NodeApi} from '../NodeApi/NodeApi';
import {SolutionComponentSummaryModel} from './SolutionComponentSummary.model';
import {WebresourcesCrmJson} from '../../root/Webresources/CrmJson';
import fs from 'fs';
import {SolutionService} from '../Solution/Solution.service';
import {SolutionModel} from '../Solution/Solution.model';

export class SolutionComponentSummaryService {
    private static entitySetName = 'msdyn_solutioncomponentsummaries';

    public static async retrieveMultipleRecords(multipleSystemQueryOptions: MultipleSystemQueryOptions, bearer: string): Promise<SolutionComponentSummaryModel[]> {
        return NodeApi.retrieveMultipleRecords(SolutionComponentSummaryService.entitySetName, multipleSystemQueryOptions, bearer);
    }

    public static async retrieveFormSolutionComponentSummaries(bearer: string): Promise<SolutionComponentSummaryModel[]> {
        const solutionComponentSummaryModels: SolutionComponentSummaryModel[] = [];
        const settings: WebresourcesCrmJson = JSON.parse(fs.readFileSync('./crm.json', 'utf8'));
        const {solution_name_deploy} = settings.crm;
        console.log(`Solution name: ${solution_name_deploy}`);
        const solution = await SolutionService.getSolution(solution_name_deploy,['solutionid'], bearer);
        console.log(`Solution id: ${solution.solutionid}`);
        const entitySolutionComponentSummaries = await this.retrieveEntitySolutionComponentSummaries(solution, bearer);
        for (const entitySolutionComponentSummary of entitySolutionComponentSummaries) {
            const formsSolutionComponentSummaries = await this.retrieveFormsSolutionComponentSummaries(solution, bearer, entitySolutionComponentSummary);
            solutionComponentSummaryModels.push(...formsSolutionComponentSummaries);
        }
        return solutionComponentSummaryModels;
    }

    private static async retrieveEntitySolutionComponentSummaries(solution: SolutionModel, bearer: string): Promise<SolutionComponentSummaryModel[]> {
        const filters: Filter[] = [{
            conditions: [{
                attribute: 'msdyn_solutionid',
                value: solution.solutionid
            }, {
                attribute: 'msdyn_componenttype',
                value: 1
            }]
        }];
        return SolutionComponentSummaryService.retrieveMultipleRecords({
            select: ['msdyn_objectid', 'msdyn_name', 'msdyn_schemaname', 'msdyn_displayname'],
            filters: filters,
        }, bearer);
    }

    private static async retrieveFormsSolutionComponentSummaries(
        solution: SolutionModel, bearer: string, entitySCS: SolutionComponentSummaryModel): Promise<SolutionComponentSummaryModel[]> {
        const filters: Filter[] = [{
            conditions: [{
                attribute: 'msdyn_solutionid',
                value: solution.solutionid
            }, {
                attribute: 'msdyn_componenttype',
                value: 60
            }, {
                attribute: 'msdyn_primaryentityname',
                value: entitySCS.msdyn_schemaname
            }]
        }];
        const solutionComponentSummaries = await SolutionComponentSummaryService.retrieveMultipleRecords({
            select: ['msdyn_objectid', 'msdyn_name'],
            filters: filters,
        }, bearer);
        for (const solutionComponentSummary of solutionComponentSummaries) {
            solutionComponentSummary.msdyn_displayname = entitySCS.msdyn_displayname;
        }
        return solutionComponentSummaries;
    }
}
