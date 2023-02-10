import {MsalRouter} from '../routers/MsalRouter';
import {SolutionService} from '../node/Solution/Solution.service';
import {SolutionComponentService} from '../node/SolutionComponent/SolutionComponent.service';
import {SystemFormService} from '../node/SystemForm/SystemForm.service';
import {SolutionModel} from '../node/Solution/Solution.model';
import {SolutionComponentModel} from '../node/SolutionComponent/SolutionComponent.model';
import {SystemFormModel} from '../node/SystemForm/SystemForm.model';
import {WebresourcesCrmJson} from '../root/Webresources/CrmJson';
import fs from 'fs';

export class SetFormCustomizable extends MsalRouter {
    private readonly customizable: boolean;
    constructor(customizable: boolean) {
        super();
        this.customizable = customizable;
    }

    protected async onAuthenticated(): Promise<void> {
        console.log(`Customizable: ${this.customizable}`);
        return this.setFormCustomizable();
    }

    private async setFormCustomizable(): Promise<void> {
        const settings: WebresourcesCrmJson = JSON.parse(fs.readFileSync('./crm.json', 'utf8'));
        const {solution_name_deploy} = settings.crm;
        console.log(`Solution name: ${solution_name_deploy}`);
        const solution = await SolutionService.getSolution(solution_name_deploy,['solutionid'], this.bearer);
        console.log(`Solution id: ${solution.solutionid}`);
        const solutionSystemFormComponents = await this.getSolutionSystemFormComponents(solution);
        for (const solutionSystemFormComponent of solutionSystemFormComponents) {
            console.log(`SolutionComponent: ${solutionSystemFormComponent.objectid}`);
            const systemForm = await this.getSystemForm(solutionSystemFormComponent);
            await this.setForm(systemForm, this.customizable);
        }
    }

    private async setForm(systemForm: SystemFormModel, customizable: boolean): Promise<void> {
        console.log(`Form name: ${systemForm.name}`);
        if (systemForm.iscustomizable.Value !== customizable || systemForm.canbedeleted.Value !== customizable) {
            if (systemForm.iscustomizable.CanBeChanged) {
                systemForm.iscustomizable.Value = customizable;
            }
            if (systemForm.canbedeleted.CanBeChanged) {
                systemForm.canbedeleted.Value = customizable;
            }
            try {
                await SystemFormService.updateRecord(systemForm.formid, systemForm, this.bearer);
                console.log(`Updated`);
            } catch (e) {
                console.log(e.message);
            }
        } else {
            console.log(`Unmodified`);
        }
        console.log(`---------------------------`);
    }

    private getSolutionSystemFormComponents(solution: SolutionModel): Promise<SolutionComponentModel[]> {
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
