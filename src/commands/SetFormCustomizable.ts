import {MsalRouter} from '../routers/MsalRouter';
import {SystemFormService} from '../node/SystemForm/SystemForm.service';
import {SystemFormModel} from '../node/SystemForm/SystemForm.model';
import {SolutionComponentSummaryService} from '../node/SolutionComponentSummary/SolutionComponentSummary.service';
import {SolutionComponentSummaryModel} from '../node/SolutionComponentSummary/SolutionComponentSummary.model';

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
        const formSolutionComponentSummaries = await SolutionComponentSummaryService.retrieveFormSolutionComponentSummaries(this.bearer);

        for (const formSolutionComponentSummary of formSolutionComponentSummaries) {
            console.log(`SolutionComponent: ${formSolutionComponentSummary.msdyn_objectid}`);
            const systemForm = await this.getSystemForm(formSolutionComponentSummary);
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

    private getSystemForm(solutionComponentSummary: SolutionComponentSummaryModel): Promise<SystemFormModel> {
        return SystemFormService.getSystemForm(solutionComponentSummary.msdyn_objectid,
            ['name', 'objecttypecode', 'iscustomizable', 'canbedeleted'], this.bearer);
    }
}
