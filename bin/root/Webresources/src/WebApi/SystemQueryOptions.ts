
interface Expand {
    attribute: string;
    select: string[];
}

interface SystemQueryOptions {
    select: string[];
    expands?: Expand[];
}

type Order = 'asc' | 'desc';
interface OrderBy {
    attribute: string;
    order?: Order;
}

// https://docs.microsoft.com/en-us/dynamics365/customer-engagement/web-api/tomorrow?view=dynamics-ce-odata-9
type QueryFunction = 'Above' | 'AboveOrEqual' | 'Between' | 'Contains' | 'ContainValues' | 'DoesNotContainValues' | 'EqualBusinessId' | 'EqualUserId' |
    'EqualUserLanguage' | 'EqualUserOrUserHierarchy' | 'EqualUserOrHierarchyAndTeams' | 'EqualUserOrUserTeams' | 'EqualUserTeams' | 'In' | 'InFiscalPeriod' |
    'InFiscalPeriodAndYear' | 'InFiscalYear' | 'InOrAfterFiscalPeriodAndYear' | 'InOrBeforeFiscalPeriodAndYear' | 'Last7Days' | 'LastFiscalPeriod' | 'LastFiscalYear' |
    'LastMonth' | 'LastWeek' | 'LastXDays' | 'LastXFiscalPeriods' | 'LastXFiscalYears' | 'LastXHours' | 'LastXMonths' | 'LastXWeeks' | 'LastXYears' | 'LastYear' |
    'Next7Days' | 'NextFiscalPeriod' | 'NextFiscalYear' | 'NextMonth' | 'NextWeek' | 'NextXDays' | 'NextXFiscalPeriods' | 'NextXFiscalYears' | 'NextXHours' |
    'NextXMonths' | 'NextXWeeks' | 'NextXYears' | 'NextYear' | 'NotBetween' | 'NotEqualBusinessId' | 'NotEqualUserId' | 'NotIn' | 'NotUnder' | 'OlderThanXDays' |
    'OlderThanXHours' | 'OlderThanXMinutes' | 'OlderThanXMonths' | 'OlderThanXWeeks' | 'OlderThanXYears' | 'On' | 'OnOrAfter' | 'OnOrBefore' | 'ThisFiscalPerios' |
    'ThisFiscalYear' | 'ThisMonth' | 'ThisWeek' | 'ThisYear' | 'Today' | 'Tomorrow' | 'Under' | 'UnderOrEqual' | 'Yesterday';
type FilterCondition = 'eq' | 'ne'| 'gt'| 'ge'| 'lt'| 'le'; // typeof filterConditions[number]; See WebApi const filterConditions
/* eslint-disable @typescript-eslint/no-explicit-any */
interface Condition {
    attribute: string;
    operator?: FilterCondition | QueryFunction;
    value?: any;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

type FilterType = 'and' | 'or' | 'not';
interface Filter {
    type?: FilterType;
    conditions: Condition[];
    filters?: Filter[];
}

interface MultipleSystemQueryOptions extends SystemQueryOptions {
    filters?: Filter[];
    orders?: OrderBy[];
    top?: number;
}
