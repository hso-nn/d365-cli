import {CustomApiType} from '../CustomApiRequestParameter/CustomApiRequestParameter.model';

export interface CustomApiResponsePropertyModel extends Model {
    customapiresponsepropertyid?: string;
    description?: string;
    displayname?: string;
    name?: string;
    solutionid?: string;
    uniquename?: string;
    type?: CustomApiType;
}
