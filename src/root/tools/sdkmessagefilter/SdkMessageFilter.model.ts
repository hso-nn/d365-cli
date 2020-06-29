import {Model} from '../../../../bin/root/src/WebApi/Model';

import {SdkMessageModel} from '../SdkMessage/SdkMessage.model';
// import {OrganizationModel} from '../Organization/Organization.model';

export enum Componentstate {
    Published = 0,
    Unpublished = 1,
    Deleted = 2,
    DeletedUnpublished = 3,
}

type ComponentstateValues = 0 | 1 | 2 | 3;

export interface SdkMessageFilterModel extends Model {
    // Attributes for $select
    sdkmessagefilterid?: string; // PrimaryIdAttribute
    // null?: undefined; // PrimaryNameAttribute
    iscustomprocessingstepallowed?: boolean;
    availability?: number;
    customizationlevel?: number;
    workflowsdkstepenabled?: boolean;
    sdkmessagefilteridunique?: string;
    primaryobjecttypecode?: string;
    secondaryobjecttypecode?: string;
    ismanaged?: boolean;
    restrictionlevel?: number;
    solutionid?: string;
    componentstate?: ComponentstateValues;
    overwritetime?: string;
    introducedversion?: string;
    isvisible?: boolean;

    // NavigationProperties for $expand

    // Attributes/NavigationProperties for $select and $expand
    sdkmessageid?: string | SdkMessageModel;
    // organizationid?: string | OrganizationModel;
}
