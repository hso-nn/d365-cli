/* This is a generated file, please regenerate and do not modify */
/* eslint-disable max-len  */

type ComponentStateValues = 0 | 1 | 2 | 3;

interface EnvironmentVariableModel extends Model {
    // Attributes for $select
    environmentvariablevalueid?: string; // PrimaryIdAttribute
    schemaname?: string; // PrimaryNameAttribute
    introducedversion?: string;
    componentstate?: ComponentStateValues;
    value?: string;
    environmentvariabledefinitionid?: string;
    overwritetime?: string;
    solutionid?: string;
    environmentvariablevalueidunique?: string;
    ismanaged?: boolean;

    // NavigationProperties for $expand
    // EnvironmentVariableDefinitionId?: EnvironmentVariableDefinitionModel; // entity EnvironmentVariableDefinition needs to be generated
}

/* eslint-enable max-len  */
