import fs from 'fs';
import {Entity} from './Entity';
import {GlobalOptionSet} from './GlobalOptionSet';
import {EnvironmentVariable} from './EnvironmentVariable';
import {WebresourcesCrmJson} from '../../root/Webresources/CrmJson';
import {SolutionService} from '../../node/Solution/Solution.service';
import {EntityService} from '../../node/Entity/Entity.service';
import { EntityModel } from '../../node/Entity/Entity.model';
import {SolutionComponentSummaryService} from '../../node/SolutionComponentSummary/SolutionComponentSummary.service';

export class Regenerator {
    private readonly bearer: string;

    constructor(bearer: string) {
        this.bearer = bearer;
    }

    public async generate(): Promise<void> {
        console.log('Regenerating. This may take some time...');
        await this.regenerateEntities();
        await this.regenerateGlobalOptionSets();
        await this.regenerateEnvironmentVariable();
        console.log('Generated');
    }

    private async regenerateEntities(): Promise<void> {
        const entityModels = await this.getEntities();
        for (const entityModel of entityModels) {
            const physicalName = entityModel.originallocalizedname || entityModel.physicalname;
            const folderName = physicalName.replaceAll(/\W/g, '');
            const entity = new Entity(this.bearer, folderName, entityModel.logicalname, {});
            await entity.generate();
        }
    }

    // eslint-disable-next-line max-lines-per-function
    private async getEntities(): Promise<EntityModel[]> {
        const settings: WebresourcesCrmJson = JSON.parse(fs.readFileSync('./crm.json', 'utf8'));
        const {solution_name_generate} = settings.crm;
        const solution = await SolutionService.getSolution(solution_name_generate, ['solutionid'], this.bearer);
        const filters: Filter[] = [{
            type: 'or',
            conditions: [{
                attribute: 'msdyn_componenttype',
                value: 1 // Entity
            }]
        }, {
            conditions: [{
                attribute: 'msdyn_solutionid',
                value: solution.solutionid
            }]
        }];
        const solutionComponentSummaries = await SolutionComponentSummaryService.retrieveMultipleRecords({
            select: ['msdyn_objectid'],
            filters: filters,
        }, this.bearer);
        const conditions: Condition[] = [];
        for (const solutionComponentSummary of solutionComponentSummaries) {
            const msdyn_objectid = solutionComponentSummary.msdyn_objectid;
            conditions.push({
                attribute: 'entityid',
                value: msdyn_objectid,
            });
        }
        return EntityService.retrieveMultipleRecords({
            select: ['entityid', 'collectionname', 'entitysetname', 'logicalname', 'name', 'objecttypecode', 'physicalname', 'originallocalizedname'],
            filters: [{
                type: 'or',
                conditions: conditions
            }]
        }, this.bearer);
    }

    private async regenerateGlobalOptionSets(): Promise<void> {
        console.log(`hso-d365 generate GlobalOptionSets`);
        const globalOptionSet = new GlobalOptionSet(this.bearer);
        await globalOptionSet.generate();
    }

    private async regenerateEnvironmentVariable(): Promise<void> {
        console.log(`hso-d365 generate EnvironmentVariable`);
        const environmentVariable = new EnvironmentVariable(this.bearer);
        await environmentVariable.generate();
    }
}
