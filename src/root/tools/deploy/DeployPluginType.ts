import {PluginAssemblyConfig, PluginAssemblyModel} from '../PluginAssembly/PluginAssembly.model';
import {PluginTypeConfig, PluginTypeModel} from '../PluginType/PluginType.model';
import {PluginTypeService} from '../PluginType/PluginType.service';
import {DeploySdkMessageProcessingStep} from './DeploySdkMessageProcessingStep';
import {DeployAssemblyContext} from './DeployAssembly';

export class DeployPluginType {
    private readonly context: DeployAssemblyContext;

    constructor(context: DeployAssemblyContext) {
        this.context = context;
    }

    public async deployPluginTypes(pluginAssembly: PluginAssemblyConfig): Promise<void> {
        const pluginTypes = pluginAssembly.plugintypes;
        if (pluginTypes.length > 0) {
            const deploySdkMessageProcessingStep = new DeploySdkMessageProcessingStep(this.context);
            for (const pluginType of pluginTypes) {
                const deployedPluginType = await this.upsertPluginType(pluginType, pluginAssembly);
                await deploySdkMessageProcessingStep.deploySteps(Object.assign({}, pluginType, deployedPluginType));
                await this.context.log(``);
            }
        } else {
            await this.context.log('No plugin types configured');
        }
    }

    private async upsertPluginType(pluginType: PluginTypeModel, pluginAssembly: PluginAssemblyModel): Promise<PluginTypeModel> {
        await this.context.log(`<b>Plugintype</b><br/> ${pluginType.name}`);
        const deployedPluginType = await this.getDeployedPluginType(pluginType, pluginAssembly);
        if (deployedPluginType) {
            return this.updatePluginType(deployedPluginType, pluginType/*, pluginAssembly*/);
        } else {
            return this.createPluginType(pluginType, pluginAssembly);
        }
    }

    private async getDeployedPluginType(pluginType: PluginTypeModel, pluginAssembly: PluginAssemblyModel): Promise<PluginTypeModel> {
        const deployedPluginTypes = await PluginTypeService.retrieveMultipleRecords({
            select: ['plugintypeid', 'version'],
            filters: [{
                conditions: [{
                    attribute: 'pluginassemblyid',
                    value: pluginAssembly.pluginassemblyid
                },{
                    attribute: 'name',
                    value: pluginType.name
                }]
            }]
        }, this.context);
        return deployedPluginTypes[0];
    }

    private async updatePluginType(deployedPluginType: PluginTypeModel, pluginType: PluginTypeConfig/*, pluginAssembly: PluginAssemblyModel*/): Promise<PluginTypeModel> {
        const mergedPluginType = Object.assign({}, deployedPluginType, pluginType);
        delete mergedPluginType.sdkmessageprocessingsteps;
        if (deployedPluginType.version !== pluginType.version) {
            // pluginType.pluginassemblyid = pluginAssembly.pluginassemblyid;
            await this.context.log(`Updating PluginType ${pluginType.name}`);

            delete (mergedPluginType as PluginTypeConfig).sdkmessageprocessingsteps;
            // await PluginTypeService.upsert(mergedPluginType, this.bearer); // TODO aanzetten
            await this.context.log(` updated...`);
        } else {
            await this.context.log(` unmodified<br/>`);
        }
        return mergedPluginType;
    }

    private async createPluginType(pluginType: PluginTypeModel, pluginAssembly: PluginAssemblyModel): Promise<PluginTypeModel> {
        const mergedPluginType = Object.assign({}, {
            pluginassemblyid: pluginAssembly.pluginassemblyid
        }, pluginType);
        // await PluginTypeService.upsert(mergedPluginType, this.bearer); // TODO aanzetten
        // const deployedPluginType = await this.getDeployedPluginType(createPluginType); // TODO aanzetten
        // pluginType.plugintypeid = deployedPluginType.plugintypeid; // TODO aanzetten
        return mergedPluginType; // TODO vervangen met: return deployedPluginType;
    }
}
