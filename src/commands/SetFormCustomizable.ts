import {AdalRouter} from '../routers/AdalRouter';
import {SolutionService} from '../node/Solution/Solution.service';
import {SolutionComponentService} from '../node/SolutionComponent/SolutionComponent.service';
import {SystemFormService} from '../node/SystemForm/SystemForm.service';
import {SolutionModel} from '../node/Solution/Solution.model';
import {SolutionComponentModel} from '../node/SolutionComponent/SolutionComponent.model';
import {SystemFormModel} from '../node/SystemForm/SystemForm.model';
import {WebresourcesCrmJson} from '../root/Webresources/CrmJson';
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
        const settings: WebresourcesCrmJson = JSON.parse(fs.readFileSync('./crm.json', 'utf8'));
        const {solution_name_deploy} = settings.crm;
        await this.log(`Solution name: ${solution_name_deploy}`);
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
