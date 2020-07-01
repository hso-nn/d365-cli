import {MultipleSystemQueryOptions} from '../../../../bin/root/src/WebApi/WebApi';
import {NodeApi} from '../NodeApi/NodeApi';
import {SdkMessageProcessingStepModel} from './SdkMessageProcessingStep.model';
import {ComponentType} from '../Solution/ComponentType';
import {AdalRouterContext} from '../AdalRouter';

export class SdkMessageProcessingStepService {
    private static logicalName = 'sdkmessageprocessingstep';
    // private static entitySetName = 'sdkmessageprocessingsteps';

    public static async retrieveMultipleRecords(multipleSystemQueryOptions: MultipleSystemQueryOptions,
                                                context: AdalRouterContext): Promise<SdkMessageProcessingStepModel[]> {
        return NodeApi.retrieveMultipleRecords(SdkMessageProcessingStepService.logicalName, multipleSystemQueryOptions, context);
    }

    public static async upsert(sdkMessageProcessingStepModel: SdkMessageProcessingStepModel, context: AdalRouterContext): Promise<SdkMessageProcessingStepModel> {
        if (sdkMessageProcessingStepModel.sdkmessageprocessingstepid) {
            await NodeApi.updateRecord(SdkMessageProcessingStepService.logicalName, sdkMessageProcessingStepModel.sdkmessageprocessingstepid,
                sdkMessageProcessingStepModel, context);
            return sdkMessageProcessingStepModel;
        } else {
            const newWebresource = await NodeApi.insertRecord(SdkMessageProcessingStepService.logicalName, sdkMessageProcessingStepModel, context);
            return newWebresource;
        }
    }

    public static async addToSolution(step: SdkMessageProcessingStepModel, context: AdalRouterContext): Promise<void> {
        const {settings} = context,
            {crm} = settings,
            {solution_name} = crm;
        return NodeApi.executeAction('AddSolutionComponent', context, {
            ComponentId: step.sdkmessageprocessingstepid,
            ComponentType: ComponentType.SdkMessageProcessingStep,
            SolutionUniqueName: solution_name,
            AddRequiredComponents: false,
            IncludedComponentSettingsValues: null
        });
    }
}
