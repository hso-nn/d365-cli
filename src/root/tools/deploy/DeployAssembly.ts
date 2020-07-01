import * as fs from 'fs';
import {
    PluginAssembliesConfig, PluginAssemblyConfig,
    PluginAssemblyModel
} from '../PluginAssembly/PluginAssembly.model';
import {PluginAssemblyService} from '../PluginAssembly/PluginAssembly.service';
import {DeployPluginType} from './DeployPluginType';
import {Deploy} from './Deploy';
import {AdalRouterContext} from '../AdalRouter';

export interface DeployAssemblyContext extends AdalRouterContext {
    config: PluginAssembliesConfig;
}

export class DeployAssembly extends Deploy {
    protected config: PluginAssembliesConfig;
    protected context: DeployAssemblyContext;

    constructor() {
        super();
        this.context.config = this.config;
    }

    protected async deploy(): Promise<void> {
        const pluginAssemblies = this.config.pluginassemblies;
        if (pluginAssemblies.length > 0) {
            for (const pluginAssembly of pluginAssemblies) {
                await this.upsertPluginAssembly(pluginAssembly);
            }
            await this.context.log(`Deployment finished`);
        } else {
            await this.context.log('No plugin assemblies configured');
        }
    }

    private async upsertPluginAssembly(pluginAssembly: PluginAssemblyConfig): Promise<void> {
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
        await deployPluginType.deployPluginTypes(Object.assign({}, pluginAssembly, deployedPluginAssembly));
    }

    private async getDeployedPluginAssembly(pluginAssembly: PluginAssemblyConfig): Promise<PluginAssemblyModel> {
        const pluginAssemblies = await PluginAssemblyService.retrieveMultipleRecords({
            select: ['pluginassemblyid', 'content', 'name'],
            filters: [{
                conditions: [{
                    attribute: 'name',
                    value: pluginAssembly.name
                }]
            }]
        }, this.context);
        await this.log(`Deployed assembly file '${pluginAssemblies[0]?.name}.dll' found.`);
        return pluginAssemblies[0];
    }

    private async updatePluginAssembly(deployedPluginAssembly: PluginAssemblyModel, pluginAssembly: PluginAssemblyConfig): Promise<PluginAssemblyModel> {
        const md5Orig = this.md5(deployedPluginAssembly.content),
            dllLocation = DeployAssembly.getDllLocation(pluginAssembly),
            base64 = fs.readFileSync(dllLocation)?.toString('base64'),
            md5New = this.md5(base64);
        if (!fs.existsSync(dllLocation)) {
            await this.context.log(`File ${pluginAssembly.path} not found at ${dllLocation}`);
        } else if (md5Orig !== md5New || deployedPluginAssembly.version !== pluginAssembly.version) {
            await this.log(`Updating from ${dllLocation}`);
            const mergedPluginAssembly = Object.assign({}, deployedPluginAssembly, pluginAssembly);
            delete mergedPluginAssembly.plugintypes;
            // this.log(`Old content:\n${base64}`);
            // this.log(`New content:\n${pluginAssembly.content}`);
            pluginAssembly.content = base64;
            // const mergedPluginAssembly = Object.assign(deployedPluginAssembly, pluginAssembly);
            // await PluginAssemblyService.upsert(mergedPluginAssembly, this.bearer); // TODO aanzetten
            await this.log(` updated...`);
            return mergedPluginAssembly; // TODO vervangen met: return deployedPluginAssembly;
        } else {
            await this.log(` unmodified<br/>`);
        }
    }

    private static getDllLocation(pluginAssembly: PluginAssemblyModel): string {
        const currentPath = process.cwd(),
            currentPathSplit = currentPath.split('\\'),
            currentFolder = currentPathSplit[currentPathSplit.length - 1];
        return pluginAssembly.path?.startsWith(currentFolder) ? pluginAssembly.path.substr(currentFolder.length + 1) : pluginAssembly.path;
    }
}
