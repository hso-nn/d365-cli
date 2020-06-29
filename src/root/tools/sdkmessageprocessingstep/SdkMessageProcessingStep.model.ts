import {Model} from '../../../../bin/root/src/WebApi/Model';

import {SdkMessageFilterModel} from '../SdkMessageFilter/SdkMessageFilter.model';
// import {ServiceendpointModel} from '../Serviceendpoint/Serviceendpoint.model';
// import {OrganizationModel} from '../Organization/Organization.model';
// import {SystemuserModel} from '../Systemuser/Systemuser.model';
import {SdkMessageModel} from '../SdkMessage/SdkMessage.model';
// import {SdkmessageprocessingstepsecureconfigModel} from '../Sdkmessageprocessingstepsecureconfig/Sdkmessageprocessingstepsecureconfig.model';
import {PluginTypeModel} from '../PluginType/PluginType.model';

export enum Componentstate {
    Published = 0,
    Unpublished = 1,
    Deleted = 2,
    DeletedUnpublished = 3,
}
export enum Stage {
    InitialPreoperationForinternaluseonly = 5,
    Prevalidation = 10,
    InternalPreoperationBeforeExternalPluginsForinternaluseonly = 15,
    Preoperation = 20,
    InternalPreoperationAfterExternalPluginsForinternaluseonly = 25,
    MainOperationForinternaluseonly = 30,
    InternalPostoperationBeforeExternalPluginsForinternaluseonly = 35,
    Postoperation = 40,
    InternalPostoperationAfterExternalPluginsForinternaluseonly = 45,
    PostoperationDeprecated = 50,
    FinalPostoperationForinternaluseonly = 55,
    PreCommitstagefiredbeforetransactioncommitForinternaluseonly = 80,
    PostCommitstagefiredaftertransactioncommitForinternaluseonly = 90,
}
export enum Supporteddeployment {
    ServerOnly = 0,
    MicrosoftDynamics365ClientforOutlookOnly = 1,
    Both = 2,
}
export enum Mode {
    Synchronous = 0,
    Asynchronous = 1,
}

type ComponentstateValues = 0 | 1 | 2 | 3;
type StageValues = 5 | 10 | 15 | 20 | 25 | 30 | 35 | 40 | 45 | 50 | 55 | 80 | 90;
type SupporteddeploymentValues = 0 | 1 | 2;
type ModeValues = 0 | 1;

export interface SdkMessageProcessingStepModel extends Model {
    // Attributes for $select
    sdkmessageprocessingstepid?: string; // PrimaryIdAttribute
    name?: string; // PrimaryNameAttribute
    introducedversion?: string;
    description?: string;
    configuration?: string;
    eventhandler?: string;
    filteringattributes?: string;
    customizationlevel?: number;
    rank?: number;
    canusereadonlyconnection?: boolean;
    componentstate?: ComponentstateValues;
    stage?: StageValues;
    solutionid?: string;
    ismanaged?: boolean;
    overwritetime?: string;
    sdkmessageprocessingstepidunique?: string;
    eventexpander?: string;
    supporteddeployment?: SupporteddeploymentValues;
    mode?: ModeValues;
    asyncautodelete?: boolean;

    // NavigationProperties for $expand
    eventhandler_plugintype?: PluginTypeModel;
    // eventhandler_serviceendpoint?: ServiceendpointModel;
    plugintypeid?: PluginTypeModel;

    // Attributes/NavigationProperties for $select and $expand
    sdkmessagefilterid?: string | SdkMessageFilterModel;
    // organizationid?: string | OrganizationModel;
    // impersonatinguserid?: string | SystemuserModel;
    sdkmessageid?: string | SdkMessageModel;
    // sdkmessageprocessingstepsecureconfigid?: string | SdkmessageprocessingstepsecureconfigModel;
}

export interface SdkMessageProcessingStepConfig extends SdkMessageProcessingStepModel {
    sdkmessage: string; // Create, Update, etc
}
