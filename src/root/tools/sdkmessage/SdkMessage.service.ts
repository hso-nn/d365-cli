import {MultipleSystemQueryOptions} from '../../../../bin/root/src/WebApi/WebApi';
import {NodeApi} from '../NodeApi/NodeApi';
import {SdkMessageModel} from './SdkMessage.model';
import {AdalRouterContext} from '../AdalRouter';

export class SdkMessageService {
    private static logicalName = 'sdkmessage';
    // private static entitySetName = 'sdkmessages';

    public static async retrieveMultipleRecords(multipleSystemQueryOptions: MultipleSystemQueryOptions, context: AdalRouterContext): Promise<SdkMessageModel[]> {
        return NodeApi.retrieveMultipleRecords(SdkMessageService.logicalName, multipleSystemQueryOptions, context);
    }

    public static async upsert(sdkMessageModel: SdkMessageModel, context: AdalRouterContext): Promise<SdkMessageModel> {
        if (sdkMessageModel.sdkmessageid) {
            await NodeApi.updateRecord(SdkMessageService.logicalName, sdkMessageModel.sdkmessageid, sdkMessageModel, context);
            return sdkMessageModel;
        } else {
            const newWebresource = await NodeApi.insertRecord(SdkMessageService.logicalName, sdkMessageModel, context);
            return newWebresource;
        }
    }
}
