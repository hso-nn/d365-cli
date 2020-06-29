import * as fs from 'fs';
import {PluginAssemblyConfig, PluginAssemblyModel} from '../PluginAssembly/PluginAssembly.model';
import {PluginAssemblyService} from '../PluginAssembly/PluginAssembly.service';
import {DeployPluginType} from './DeployPluginType';
import {Deploy} from './Deploy';
import {AdalRouterContext} from '../AdalRouter';

export interface DeployAssemblyContext extends AdalRouterContext {
    config: PluginAssemblyConfig;
}

export class DeployAssembly extends Deploy {
    protected config: PluginAssemblyConfig;
    protected context: DeployAssemblyContext;

    constructor() {
        super();
        this.context.config = this.config;
    }

    protected async deploy(): Promise<void> {
        const pluginAssembly = this.config.pluginassembly;
        if (pluginAssembly) {
            await this.upsertPluginAssembly(pluginAssembly);
        } else {
            await this.log('No plugin assembly files configured');
        }
    }

    private async upsertPluginAssembly(pluginAssembly: PluginAssemblyModel): Promise<void> {
        await this.log(`<b>Pluginassembly</b><br/>'${pluginAssembly.name}.dll'`);
        const deployedPluginAssembly = await this.getDeployedPluginAssembly(pluginAssembly);
        if (deployedPluginAssembly) {
            await this.updatePluginAssembly(deployedPluginAssembly, pluginAssembly);
        } else {
            await this.log('assembly not found');
            // deployedPluginAssembly = this.createPluginAssembly(pluginAssembly); // TODO implement
        }
        await this.log(``);
        const deployPluginType = new DeployPluginType(this.context);
        await deployPluginType.deployPluginTypes(deployedPluginAssembly);
    }

    private async getDeployedPluginAssembly(assemblyFile: PluginAssemblyModel): Promise<PluginAssemblyModel> {
        const pluginAssemblies = await PluginAssemblyService.retrieveMultipleRecords({
                select: ['pluginassemblyid', 'content', 'name'],
                filters: [{
                    conditions: [{
                        attribute: 'name',
                        value: assemblyFile.name
                    }]
                }]
            }, this.context),
            pluginAssembly = pluginAssemblies[0];
        await this.log(`Deployed assembly file '${pluginAssembly.name}.dll' found.`);
        return pluginAssembly;
    }

    private async updatePluginAssembly(deployedPluginAssembly: PluginAssemblyModel, pluginAssembly: PluginAssemblyModel): Promise<void> {
        const md5Orig = this.md5(deployedPluginAssembly.content),
            dllLocation = `bin/Debug/${deployedPluginAssembly.name}.dll`, // TODO Debug is hardcoded
            base64 = fs.readFileSync(dllLocation)?.toString('base64'),
            md5New = this.md5(base64);
        if (md5Orig !== md5New || deployedPluginAssembly.version !== pluginAssembly.version) {
            await this.log(`Updating from ${dllLocation}`);
            // this.log(`Old content:\n${base64}`);
            // this.log(`New content:\n${pluginAssembly.content}`);
            try {
                pluginAssembly.content = base64;
                // const mergedPluginAssembly = Object.assign(deployedPluginAssembly, pluginAssembly);
                // await PluginAssemblyService.upsert(mergedPluginAssembly, this.bearer); // TODO aanzetten
                await this.log(` updated...`);
            } catch (e) {
                await this.log(` failed ${e.message}<br/>`);
            }
        } else {
            await this.log(` unmodified<br/>`);
        }
    }
}
