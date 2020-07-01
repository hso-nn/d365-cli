import {AdalRouterContext} from '../AdalRouter';
import {PluginTypeConfig, PluginTypeModel} from '../PluginType/PluginType.model';
import {
    SdkMessageProcessingStepConfig,
    SdkMessageProcessingStepModel
} from '../SdkMessageProcessingStep/SdkMessageProcessingStep.model';
import {SdkMessageProcessingStepService} from '../SdkMessageProcessingStep/SdkMessageProcessingStep.service';
import {SdkMessageService} from '../SdkMessage/SdkMessage.service';
import {SdkMessageModel} from '../SdkMessage/SdkMessage.model';
import {SdkMessageFilterModel} from '../SdkMessageFilter/SdkMessageFilter.model';
import {SdkMessageFilterService} from '../SdkMessageFilter/SdmMessageFilter.service';
import {DeploySdkMessageProcessingStepImage} from './DeploySdkMessageProcessingStepImage';

export class DeploySdkMessageProcessingStep {
    private readonly context: AdalRouterContext;

    constructor(context: AdalRouterContext) {
        this.context = context;
    }

    public async deploySteps(pluginType: PluginTypeConfig): Promise<void> {
        await this.context.log(`<b>Sdkmessageprocessingsteps</b><br/>${pluginType.name}`);
        const sdkMessageProcessingSteps = pluginType.sdkmessageprocessingsteps;
        if (sdkMessageProcessingSteps?.length > 0) {
            const deploySdkMessageProcessingStepImage = new DeploySdkMessageProcessingStepImage(this.context);
            for (const sdkMessageProcessingStep of sdkMessageProcessingSteps) {
                const deployedStep = await this.upsertStep(sdkMessageProcessingStep, pluginType);
                await deploySdkMessageProcessingStepImage.deployImage(Object.assign({}, sdkMessageProcessingStep, deployedStep));
                await this.context.log(``);
            }
        } else {
            await this.context.log('No SDK Message Processing steps configured');
        }
    }

    private async upsertStep(step: SdkMessageProcessingStepConfig, pluginType: PluginTypeModel): Promise<SdkMessageProcessingStepModel> {
        let deployedStep = await this.getDeployedStep(step) as SdkMessageProcessingStepConfig;
        const sdkMessage = await this.getSdkMessage(step),
            sdkMessageFilter = await this.getSdkMessageFilter(step, sdkMessage);
        if (sdkMessage && sdkMessageFilter) {
            await this.context.log(`Sdk Message '${sdkMessage.name}' found`);
            await this.context.log(`Sdk Message Filter '${sdkMessageFilter.primaryobjecttypecode}' found`);
            if (deployedStep) {
                return this.updateStep(deployedStep, step, sdkMessage, sdkMessageFilter);
            } else {
                deployedStep = await this.createStep(step, sdkMessage, sdkMessageFilter, pluginType);
                await SdkMessageProcessingStepService.addToSolution(deployedStep, this.context);
                return deployedStep;
            }
        } else if (!sdkMessage) {
            await this.context.log(`Sdk Message not found for ${step.name}`);
        } else {
            await this.context.log(`Sdk Message Filter not found for ${step.name}`);
        }
    }

    private async getDeployedStep(step: SdkMessageProcessingStepConfig): Promise<SdkMessageProcessingStepModel> {
        const deployedSteps = await SdkMessageProcessingStepService.retrieveMultipleRecords({
            select: ['sdkmessageprocessingstepid', 'name', 'description', 'supporteddeployment', 'mode', 'rank'],
            filters: [{
                conditions: [{
                    attribute: 'name',
                    value: step.name
                }]
            }]
        }, this.context);
        return deployedSteps[0];
    }

    private async getSdkMessage(step: SdkMessageProcessingStepConfig): Promise<SdkMessageModel> {
        const sdkMessages = await SdkMessageService.retrieveMultipleRecords({
            select: ['sdkmessageid', 'name'],
            filters: [{
                conditions: [{
                    attribute: 'name',
                    value: (step.sdkmessageid as SdkMessageModel).name
                }]
            }]
        }, this.context);
        return sdkMessages[0];
    }

    private async getSdkMessageFilter(step: SdkMessageProcessingStepConfig, sdkMessage: SdkMessageModel): Promise<SdkMessageFilterModel> {
        const sdkMessageFilters = await SdkMessageFilterService.retrieveMultipleRecords({
            select: ['sdkmessagefilterid', 'primaryobjecttypecode'],
            filters: [{
                conditions: [{
                    attribute: 'sdkmessageid',
                    value: sdkMessage.sdkmessageid
                }, {
                    attribute: 'primaryobjecttypecode',
                    value: (step.sdkmessagefilterid as SdkMessageFilterModel).primaryobjecttypecode
                }]
            }]
        }, this.context);
        return sdkMessageFilters[0];
    }

    private async updateStep(deployedStep: SdkMessageProcessingStepModel, step: SdkMessageProcessingStepConfig,
                             sdkMessage: SdkMessageModel, sdkMessageFilter: SdkMessageFilterModel): Promise<SdkMessageProcessingStepModel> {
        // step.plugintypeid = pluginType.plugintypeid;
        const {description, supporteddeployment, mode, rank} = deployedStep,
            mergedStep = Object.assign({}, deployedStep, step);
        if (step.description !== description || step.supporteddeployment !== supporteddeployment || step.mode !== mode || step.rank !== rank) {
            step.sdkmessageid = sdkMessage.sdkmessageid;
            step.sdkmessagefilterid = sdkMessageFilter.sdkmessagefilterid;

            // SdkMessageProcessingStepService.upsert(mergedStep, this.bearer); // TODO aanzetten
            await this.context.log(`Updated...`);
        } else {
            await this.context.log(` unmodified<br/>`);
        }
        return mergedStep;
    }

    private async createStep(step: SdkMessageProcessingStepConfig, sdkMessage: SdkMessageModel,
                             sdkMessageFilter: SdkMessageFilterModel, pluginType: PluginTypeModel): Promise<SdkMessageProcessingStepConfig> {
        const createStep = Object.assign({},{
            sdkmessageid: sdkMessage.sdkmessageid,
            sdkmessagefilterid: sdkMessageFilter.sdkmessagefilterid,
            plugintypeid: pluginType.plugintypeid
        }, step);
        // await SdkMessageProcessingStepService.upsert(createStep, this.bearer); // TODO aanzetten
        // const deployedStep = await this.getDeployedStep(createStep); // TODO aanzetten
        return createStep; // TODO vervangen met: return deployedStep;
    }
}
