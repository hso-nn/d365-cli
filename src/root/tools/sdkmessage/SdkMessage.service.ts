import {MultipleSystemQueryOptions} from '../../../../bin/root/src/WebApi/WebApi';
import {NodeApi} from '../NodeApi/NodeApi';
import {SdkMessageModel} from './SdkMessage.model';
import {AdalRouterContext} from '../AdalRouter';

export class SdkMessageService {
    private static entitySetName = 'sdkmessages';

    public static async retrieveMultipleRecords(multipleSystemQueryOptions: MultipleSystemQueryOptions, context: AdalRouterContext): Promise<SdkMessageModel[]> {
        return NodeApi.retrieveMultipleRecords(SdkMessageService.entitySetName, multipleSystemQueryOptions, context);
    }

    public static async upsert(sdkMessageModel: SdkMessageModel, context: AdalRouterContext): Promise<SdkMessageModel> {
        if (sdkMessageModel.sdkmessageid) {
            await NodeApi.updateRecord(SdkMessageService.entitySetName, sdkMessageModel.sdkmessageid, sdkMessageModel, context);
            return sdkMessageModel;
        } else {
            const newWebresource = await NodeApi.insertRecord(SdkMessageService.entitySetName, sdkMessageModel, context);
            return newWebresource;
        }
    }
}
