import {Model} from '../../../../bin/root/src/WebApi/Model';
import {PluginTypeConfig} from '../PluginType/PluginType.model';

export enum Authtype {
    BasicAuth = 0,
}
export enum Sourcetype {
    Database = 0,
    Disk = 1,
    Normal = 2,
    AzureWebApp = 3,
}
export enum Componentstate {
    Published = 0,
    Unpublished = 1,
    Deleted = 2,
    DeletedUnpublished = 3,
}
export enum Isolationmode {
    None = 1,
    Sandbox = 2,
    External = 3,
}

type AuthtypeValues = 0;
type SourcetypeValues = 0 | 1 | 2 | 3;
type ComponentstateValues = 0 | 1 | 2 | 3;
type IsolationmodeValues = 1 | 2 | 3;

export interface PluginAssemblyModel extends Model {
    // Attributes for $select
    pluginassemblyid?: string; // PrimaryIdAttribute
    name?: string; // PrimaryNameAttribute
    introducedversion?: string;
    description?: string;
    password?: string;
    authtype?: AuthtypeValues;
    content?: string;
    url?: string;
    culture?: string;
    major?: number;
    ispasswordset?: boolean;
    customizationlevel?: number;
    minor?: number;
    sourcetype?: SourcetypeValues;
    publickeytoken?: string;
    componentstate?: ComponentstateValues;
    version?: string;
    username?: string;
    sourcehash?: string;
    pluginassemblyidunique?: string;
    ismanaged?: boolean;
    path?: string;
    overwritetime?: string;
    solutionid?: string;
    isolationmode?: IsolationmodeValues;

    // NavigationProperties for $expand

    // Attributes/NavigationProperties for $select and $expand
    // organizationid?: string | OrganizationModel;
}

export interface PluginAssembliesConfig {
    pluginassemblies: PluginAssemblyConfig[];
}

export interface PluginAssemblyConfig extends PluginAssemblyModel{
    plugintypes: PluginTypeConfig[];
}
