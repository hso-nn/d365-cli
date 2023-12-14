
export interface SolutionComponentSummaryModel extends Model {
    msdyn_solutioncomponentsummaryid?: string;
    msdyn_name?: string;
    msdyn_objectid?: string;
    // https://learn.microsoft.com/en-us/power-apps/developer/data-platform/reference/entities/solutioncomponent#BKMK_ComponentType
    msdyn_componenttype?: string;
    msdyn_solutionid?: string;
    msdyn_primaryentityname?: string;
    msdyn_schemaname?: string;
    msdyn_displayname?: string;
}
