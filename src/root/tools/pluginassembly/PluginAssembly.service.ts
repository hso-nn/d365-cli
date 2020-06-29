import {MultipleSystemQueryOptions} from '../../../../bin/root/src/WebApi/WebApi';
import {NodeApi} from '../NodeApi/NodeApi';
import {PluginAssemblyModel} from './PluginAssembly.model';
import {AdalRouterContext} from '../AdalRouter';

export class PluginAssemblyService {
    private static entitySetName = 'pluginassemblies';

    public static async retrieveMultipleRecords(multipleSystemQueryOptions: MultipleSystemQueryOptions, context: AdalRouterContext): Promise<PluginAssemblyModel[]> {
        return NodeApi.retrieveMultipleRecords(PluginAssemblyService.entitySetName, multipleSystemQueryOptions, context);
    }

    public static async upsert(pluginAssembly: PluginAssemblyModel, context: AdalRouterContext): Promise<PluginAssemblyModel> {
        if (pluginAssembly.pluginassemblyid) {
            await NodeApi.updateRecord(PluginAssemblyService.entitySetName, pluginAssembly.pluginassemblyid, pluginAssembly, context);
            return pluginAssembly;
        } else {
            const newWebresource = await NodeApi.insertRecord(PluginAssemblyService.entitySetName, pluginAssembly, context);
            return newWebresource;
        }
    }
}
