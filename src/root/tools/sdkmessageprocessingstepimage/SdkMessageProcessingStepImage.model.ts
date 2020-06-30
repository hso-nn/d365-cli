import {Model} from '../../../../bin/root/src/WebApi/Model';

import {SdkMessageProcessingStepModel} from '../sdkmessageprocessingstep/SdkMessageProcessingStep.model';
// import {OrganizationModel} from '../Organization/Organization.model';

export enum Componentstate {
    Published = 0,
    Unpublished = 1,
    Deleted = 2,
    DeletedUnpublished = 3,
}
export enum Imagetype {
    PreImage = 0,
    PostImage = 1,
    Both = 2,
}

type ComponentstateValues = 0 | 1 | 2 | 3;
type ImagetypeValues = 0 | 1 | 2;

export interface SdkMessageProcessingStepImageModel extends Model {
    // Attributes for $select
    sdkmessageprocessingstepimageid?: string; // PrimaryIdAttribute
    name?: string; // PrimaryNameAttribute
    sdkmessageprocessingstepimageidunique?: string;
    description?: string;
    customizationlevel?: number;
    ismanaged?: boolean;
    attributes?: string;
    solutionid?: string;
    componentstate?: ComponentstateValues;
    overwritetime?: string;
    messagepropertyname?: string;
    introducedversion?: string;
    relatedattributename?: string;
    imagetype?: ImagetypeValues;
    entityalias?: string;

    // NavigationProperties for $expand

    // Attributes/NavigationProperties for $select and $expand
    sdkmessageprocessingstepid?: string | SdkMessageProcessingStepModel;
    // organizationid?: string | OrganizationModel;
}
