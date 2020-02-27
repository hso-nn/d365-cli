import {AdalRouter} from './AdalRouter';
import {SolutionService} from './Solution/Solution.service';
import {SolutionComponentService} from './SolutionComponent/SolutionComponent.service';
import {SystemFormService} from './SystemForm/SystemForm.service';
import {SolutionModel} from './Solution/Solution.model';
import {SolutionComponentModel} from './SolutionComponent/SolutionComponent.model';
import {SystemFormModel} from './SystemForm/SystemForm.model';

class SetFormCustomizable extends AdalRouter {
    protected onAuthenticated(): Promise<void> {
        const customizable = process.argv[3];
        this.log('Customizable: ' + customizable);
        // process.argv.forEach((val, index) => {
        //     this.log(index + ': ' + val);
        // });
        return this.setFormCustomizable(customizable === 'true');
    }

    private async setFormCustomizable(customizable: boolean): Promise<void> {
        this.log(`Solution name: ${this.settings.crm.solution_name}`);
        const solution = await SolutionService.getSolution(['solutionid'], this.bearer);
        this.log(`Solution id: ${solution.solutionid}`);
        this.log(``);
        const solutioncomponents = await this.getSolutionComponents(solution);
        for (const solutioncomponent of solutioncomponents) {
            this.log(`SolutionComponent: ${solutioncomponent.objectid}`);
            const systemForm = await this.getSystemForm(solutioncomponent);
            await this.setForm(systemForm, customizable);
        }
    }

    private async setForm(systemForm: SystemFormModel, customizable: boolean): Promise<void> {
        this.log(`Form name: ${systemForm.name}`);
        if (systemForm.iscustomizable.Value !== customizable || systemForm.canbedeleted.Value !== customizable) {
            // this.log(`Is customizable: ${systemForm.iscustomizable.Value}`);
            // this.log(`Can be deleted: ${systemForm.canbedeleted.Value}`);
            if (systemForm.iscustomizable.CanBeChanged) {
                systemForm.iscustomizable.Value = customizable;
            }
            if (systemForm.canbedeleted.CanBeChanged) {
                systemForm.canbedeleted.Value = customizable;
            }
            try {
                await SystemFormService.updateRecord(systemForm.formid, systemForm, this.bearer);
                this.log(`Updated`);
            } catch (e) {
                this.log(e.message);
            }
        } else {
            this.log(`Unmodified`);
        }
        this.log(`---------------------------`);
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
new SetFormCustomizable().express;
