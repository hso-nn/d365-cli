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

export class DeploySdkMessageProcessingStep {
    private readonly context: AdalRouterContext;

    constructor(context: AdalRouterContext) {
        this.context = context;
    }

    public async deploySteps(pluginType: PluginTypeConfig): Promise<void> {
        await this.context.log(`<b>Sdkmessageprocessingsteps</b><br/>${pluginType.name}`);
        const sdkMessageProcessingSteps = pluginType.sdkmessageprocessingsteps;
        if (sdkMessageProcessingSteps?.length > 0) {
            for (const sdkMessageProcessingStep of sdkMessageProcessingSteps) {
                await this.upsertStep(sdkMessageProcessingStep, pluginType);
            }
        } else {
            this.context.log('No SDK Message Processing steps configured');
        }
    }

    private async upsertStep(step: SdkMessageProcessingStepConfig, pluginType: PluginTypeModel): Promise<SdkMessageProcessingStepModel> {
        let deployedStep = await this.getDeployedStep(step);
        const sdkMessage = await this.getSdkMessage(step),
            sdkMessageFilter = await this.getSdkMessageFilter(step, sdkMessage);
        if (sdkMessage && sdkMessageFilter) {
            await this.context.log(`Sdk Message ${sdkMessage.name} found`);
            await this.context.log(`Sdk Message Filter ${sdkMessageFilter.primaryobjecttypecode} found`);
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

    private async getDeployedStep(step: SdkMessageProcessingStepModel): Promise<SdkMessageProcessingStepModel> {
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
                    value: step.sdkmessage
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
                    attribute: '_sdkmessageid_value', // NodeApi supports no sdkmessageid yet
                    value: sdkMessage.sdkmessageid
                }, {
                    attribute: 'primaryobjecttypecode',
                    value: (step.sdkmessagefilterid as SdkMessageFilterModel).primaryobjecttypecode
                }]
            }]
        }, this.context);
        return sdkMessageFilters[0];
    }

    private async updateStep(deployedStep: SdkMessageProcessingStepModel, step: SdkMessageProcessingStepModel,
        sdkMessage: SdkMessageModel, sdkMessageFilter: SdkMessageFilterModel): Promise<SdkMessageProcessingStepModel> {
        // step.plugintypeid = pluginType.plugintypeid;
        const {description, supporteddeployment, mode, rank} = deployedStep,
            mergedStep = Object.assign(deployedStep, step);
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

    private async createStep(step: SdkMessageProcessingStepModel, sdkMessage: SdkMessageModel,
        sdkMessageFilter: SdkMessageFilterModel, pluginType: PluginTypeModel): Promise<SdkMessageProcessingStepModel> {
        const createStep = Object.assign({
            sdkmessageid: sdkMessage.sdkmessageid,
            sdkmessagefilterid: sdkMessageFilter.sdkmessagefilterid,
            plugintypeid: pluginType.plugintypeid
        }, step) as SdkMessageProcessingStepModel;
        // await SdkMessageProcessingStepService.upsert(createStep, this.bearer); // TODO aanzetten
        // const deployedStep = await this.getDeployedStep(createStep); // TODO aanzetten
        return createStep; // TODO vervangen met: return deployedStep;
    }
}
