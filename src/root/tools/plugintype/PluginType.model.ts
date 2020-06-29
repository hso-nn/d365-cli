import {Model} from '../../../../bin/root/src/WebApi/Model';

import {PluginAssemblyModel} from '../PluginAssembly/PluginAssembly.model';
import {SdkMessageProcessingStepConfig} from '../SdkMessageProcessingStep/SdkMessageProcessingStep.model';
// import {OrganizationModel} from '../Organization/Organization.model';

export enum Componentstate {
    Published = 0,
    Unpublished = 1,
    Deleted = 2,
    DeletedUnpublished = 3,
}

type ComponentstateValues = 0 | 1 | 2 | 3;

export interface PluginTypeModel extends Model {
    // Attributes for $select
    plugintypeid?: string; // PrimaryIdAttribute
    name?: string; // PrimaryNameAttribute
    description?: string;
    friendlyname?: string;
    culture?: string;
    major?: number;
    customizationlevel?: number;
    assemblyname?: string;
    publickeytoken?: string;
    componentstate?: ComponentstateValues;
    version?: string;
    minor?: number;
    ismanaged?: boolean;
    overwritetime?: string;
    solutionid?: string;
    isworkflowactivity?: boolean;
    typename?: string;
    plugintypeidunique?: string;
    workflowactivitygroupname?: string;
    customworkflowactivityinfo?: string;

    // NavigationProperties for $expand

    // Attributes/NavigationProperties for $select and $expand
    pluginassemblyid?: string | PluginAssemblyModel;
    // organizationid?: string | OrganizationModel;
}

export interface PluginTypeConfig extends PluginTypeModel {
    sdkmessageprocessingsteps?: SdkMessageProcessingStepConfig[];
}
