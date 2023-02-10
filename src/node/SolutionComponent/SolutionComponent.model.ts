
export interface SolutionComponentModel extends Model {
    solutioncomponentid?: string;
    objectid?: string;
    // https://learn.microsoft.com/en-us/power-apps/developer/data-platform/reference/entities/solutioncomponent#BKMK_ComponentType
    componenttype?: string;
    _solutionid_value?: string;
}
