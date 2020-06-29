import {MultipleSystemQueryOptions} from '../../../../bin/root/src/WebApi/WebApi';
import {NodeApi} from '../NodeApi/NodeApi';
import {SdkMessageFilterModel} from './SdkMessageFilter.model';
import {AdalRouterContext} from '../AdalRouter';

export class SdkMessageFilterService {
    private static entitySetName = 'sdkmessagefilters';

    public static async retrieveMultipleRecords(multipleSystemQueryOptions: MultipleSystemQueryOptions, context: AdalRouterContext): Promise<SdkMessageFilterModel[]> {
        return NodeApi.retrieveMultipleRecords(SdkMessageFilterService.entitySetName, multipleSystemQueryOptions, context);
    }

    public static async upsert(sdkMessageFilterModel: SdkMessageFilterModel, context: AdalRouterContext): Promise<SdkMessageFilterModel> {
        if (sdkMessageFilterModel.sdkmessagefilterid) {
            await NodeApi.updateRecord(SdkMessageFilterService.entitySetName, sdkMessageFilterModel.sdkmessagefilterid, sdkMessageFilterModel, context);
            return sdkMessageFilterModel;
        } else {
            const newWebresource = await NodeApi.insertRecord(SdkMessageFilterService.entitySetName, sdkMessageFilterModel, context);
            return newWebresource;
        }
    }
}
