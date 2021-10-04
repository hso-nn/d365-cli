import {AdalRouter} from './AdalRouter';
import {SolutionService} from './Solution/Solution.service';
import {SolutionComponentService} from './SolutionComponent/SolutionComponent.service';
import {SystemFormService} from './SystemForm/SystemForm.service';
import {SolutionModel} from './Solution/Solution.model';
import {SolutionComponentModel} from './SolutionComponent/SolutionComponent.model';
import {SystemFormModel} from './SystemForm/SystemForm.model';
import {CrmJson} from './CrmJson';
import fs from 'fs';

export class SetFormCustomizable extends AdalRouter {
    private readonly customizable: boolean;
    constructor(customizable: boolean) {
        super();
        this.customizable = customizable;
    }

    protected async onAuthenticated(): Promise<void> {
        await this.log(`Customizable: ${this.customizable}`);
        return this.setFormCustomizable();
    }

    private async setFormCustomizable(): Promise<void> {
        await this.log(`Solution name: ${this.settings.crm.solution_name_deploy}`);
        const settings: CrmJson = JSON.parse(fs.readFileSync('tools/crm.json', 'utf8'));
        const {solution_name_deploy} = settings.crm;
        const solution = await SolutionService.getSolution(solution_name_deploy,['solutionid'], this.bearer);
        await this.log(`Solution id: ${solution.solutionid}`);
        await this.log(``);
        const solutionComponents = await this.getSolutionComponents(solution);
        for (const solutionComponent of solutionComponents) {
            await this.log(`SolutionComponent: ${solutionComponent.objectid}`);
            const systemForm = await this.getSystemForm(solutionComponent);
            await this.setForm(systemForm, this.customizable);
        }
    }

    private async setForm(systemForm: SystemFormModel, customizable: boolean): Promise<void> {
        await this.log(`Form name: ${systemForm.name}`);
        if (systemForm.iscustomizable.Value !== customizable || systemForm.canbedeleted.Value !== customizable) {
            if (systemForm.iscustomizable.CanBeChanged) {
                systemForm.iscustomizable.Value = customizable;
            }
            if (systemForm.canbedeleted.CanBeChanged) {
                systemForm.canbedeleted.Value = customizable;
            }
            try {
                await SystemFormService.updateRecord(systemForm.formid, systemForm, this.bearer);
                await this.log(`Updated`);
            } catch (e) {
                await this.log(e.message);
            }
        } else {
            await this.log(`Unmodified`);
        }
        await this.log(`---------------------------`);
    }

    private getSolutionComponents(solution: SolutionModel): Promise<SolutionComponentModel[]> {
        return SolutionComponentService.retrieveMultipleRecords({
            select: ['objectid'],
            filters: [{
                conditions: [{
                    attribute: '_solutionid_value',
                    value: solution.solutionid
                }, {
                    attribute: 'componenttype',
                    value: 60
                }]
            }]
        }, this.bearer);
    }

    private getSystemForm(solutionComponent: SolutionComponentModel): Promise<SystemFormModel> {
        return SystemFormService.getSystemForm(solutionComponent.objectid,
            ['name', 'objecttypecode', 'iscustomizable', 'canbedeleted'], this.bearer);
    }
}
