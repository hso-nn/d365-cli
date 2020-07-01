import {MultipleSystemQueryOptions} from '../../../../bin/root/src/WebApi/WebApi';
import {NodeApi} from '../NodeApi/NodeApi';
import {PluginTypeModel} from './PluginType.model';
import {AdalRouterContext} from '../AdalRouter';

export class PluginTypeService {
    private static logicalname = 'plugintype';
    // private static entitySetName = 'plugintypes';

    public static async retrieveMultipleRecords(multipleSystemQueryOptions: MultipleSystemQueryOptions, context: AdalRouterContext): Promise<PluginTypeModel[]> {
        return NodeApi.retrieveMultipleRecords(PluginTypeService.logicalname, multipleSystemQueryOptions, context);
    }

    public static async upsert(pluginType: PluginTypeModel, context: AdalRouterContext): Promise<PluginTypeModel> {
        if (pluginType.plugintypeid) {
            await NodeApi.updateRecord(PluginTypeService.logicalname, pluginType.plugintypeid, pluginType, context);
            return pluginType;
        } else {
            const newWebresource = await NodeApi.insertRecord(PluginTypeService.logicalname, pluginType, context);
            return newWebresource;
        }
    }
}