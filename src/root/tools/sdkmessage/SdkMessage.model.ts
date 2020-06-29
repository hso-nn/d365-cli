import {Model} from '../../../../bin/root/src/WebApi/Model';

// import {OrganizationModel} from '../Organization/Organization.model';

export enum Componentstate {
    Published = 0,
    Unpublished = 1,
    Deleted = 2,
    DeletedUnpublished = 3,
}

type ComponentstateValues = 0 | 1 | 2 | 3;

export interface SdkMessageModel extends Model {
    // Attributes for $select
    sdkmessageid?: string; // PrimaryIdAttribute
    name?: string; // PrimaryNameAttribute
    template?: boolean;
    sdkmessageidunique?: string;
    isreadonly?: boolean;
    workflowsdkstepenabled?: boolean;
    customizationlevel?: number;
    introducedversion?: string;
    isvalidforexecuteasync?: boolean;
    autotransact?: boolean;
    throttlesettings?: string;
    expand?: boolean;
    isprivate?: boolean;
    overwritetime?: string;
    isactive?: boolean;
    availability?: number;
    ismanaged?: boolean;
    solutionid?: string;
    categoryname?: string;
    componentstate?: ComponentstateValues;

    // NavigationProperties for $expand

    // Attributes/NavigationProperties for $select and $expand
    // organizationid?: string | OrganizationModel;
}
