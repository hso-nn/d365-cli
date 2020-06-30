import {MultipleSystemQueryOptions} from '../../../../bin/root/src/WebApi/WebApi';
import {NodeApi} from '../NodeApi/NodeApi';
import {SdkMessageProcessingStepImageModel} from './SdkMessageProcessingStepImage.model';
import {ComponentType} from '../Solution/ComponentType';
import {AdalRouterContext} from '../AdalRouter';

export class SdkMessageProcessingStepImageService {
    private static logicalName = 'sdkmessageprocessingstepimage';

    public static async retrieveMultipleRecords(multipleSystemQueryOptions: MultipleSystemQueryOptions,
        context: AdalRouterContext): Promise<SdkMessageProcessingStepImageModel[]> {
        return NodeApi.retrieveMultipleRecords(SdkMessageProcessingStepImageService.logicalName, multipleSystemQueryOptions, context);
    }

    public static async upsert(sdkMessageProcessingStepImageModel: SdkMessageProcessingStepImageModel,
        context: AdalRouterContext): Promise<SdkMessageProcessingStepImageModel> {
        if (sdkMessageProcessingStepImageModel.sdkmessageprocessingstepimageid) {
            await NodeApi.updateRecord(SdkMessageProcessingStepImageService.logicalName, sdkMessageProcessingStepImageModel.sdkmessageprocessingstepimageid,
                sdkMessageProcessingStepImageModel, context);
            return sdkMessageProcessingStepImageModel;
        } else {
            const newWebresource = await NodeApi.insertRecord(SdkMessageProcessingStepImageService.logicalName, sdkMessageProcessingStepImageModel, context);
            return newWebresource;
        }
    }

    public static async addToSolution(image: SdkMessageProcessingStepImageModel, context: AdalRouterContext): Promise<void> {
        const {settings} = context,
            {crm} = settings,
            {solution_name} = crm;
        return NodeApi.executeAction('AddSolutionComponent', context, {
            ComponentId: image.sdkmessageprocessingstepimageid,
            ComponentType: ComponentType.SdkMessageProcessingStepImage,
            SolutionUniqueName: solution_name,
            AddRequiredComponents: false,
            IncludedComponentSettingsValues: null
        });
    }
}
