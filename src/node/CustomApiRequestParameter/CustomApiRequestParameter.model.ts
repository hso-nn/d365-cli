
// https://learn.microsoft.com/en-us/power-apps/developer/data-platform/webapi/reference/customapirequestparameter?view=dataverse-latest
export type CustomApiType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface CustomApiRequestParameterModel extends Model {
    customapirequestparameterid?: string;
    description?: string;
    displayname?: string;
    name?: string;
    solutionid?: string;
    uniquename?: string;
    isoptional?: boolean;
    type?: CustomApiType;
}
