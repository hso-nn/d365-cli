import {Filter, MultipleSystemQueryOptions, SystemQueryOptions} from '../../../../bin/root/src/WebApi/WebApi';
import {Model} from '../../../../bin/root/src/WebApi/Model';
import * as https from 'https';
import { IncomingMessage } from 'http';
import { RequestOptions } from 'https';
import {AdalRouterContext} from '../AdalRouter';

/* eslint-disable @typescript-eslint/no-explicit-any */

interface Expand {
    attribute: string;
    select: string[];
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
const filterConditions = ['eq' , 'ne', 'gt', 'ge', 'lt', 'le'] as const;
type FilterCondition = typeof filterConditions[number]; // 'eq' | 'ne' | 'gt' | 'ge' | 'lt' | 'le';
interface Condition {
    attribute: string;
    operator?: FilterCondition | QueryFunction;
    value?: any;
}

type Order = 'asc' | 'desc';
interface OrderBy {
    attribute: string;
    order?: Order;
}

type Method = 'GET' | 'POST' | 'DELETE' | 'PATCH';

interface HttpHeaders {
    [index: string]: string | number;
}

interface OptionSetOption {
    value?: number;
    externalValue?: number;
    label?: string;
}

interface JsonHttpHeaders extends HttpHeaders {
    'OData-MaxVersion': string;
    'OData-Version': string;
    'Accept': string;
    'Content-Type': string;
}

interface NodeApiResponse {
    body: any;
    getResponseHeader(headerName: string): string | string[];
    statusCode: number;
}

export class NodeApi {
    public static async retrieveMultipleRecords(entityLogicalName: string, options: MultipleSystemQueryOptions, context: AdalRouterContext): Promise<Model[]> {
        const query = await NodeApi.getSystemQueryOptions(entityLogicalName, options, context),
            {settings, bearer} = context,
            {crm} = settings,
            {url, version} = crm,
            {EntitySetName: entitySetName} = await NodeApi.getEntityDefinition(entityLogicalName, context, ['EntitySetName']),
            uri = `${url}/api/data/v${version}/${entitySetName}${query}`,
            {body} = await NodeApi.request('GET', uri, null, {
                'Authorization': `Bearer ${bearer}`
            });
        return body.value;
    }

    public static async retrieveRecord(entityLogicalName: string, id: string, options: SystemQueryOptions, context: AdalRouterContext): Promise<Model> {
        const query = await NodeApi.getSystemQueryOptions(entityLogicalName, options, context),
            {settings, bearer} = context,
            {crm} = settings,
            {url, version} = crm,
            {EntitySetName: entitySetName} = await NodeApi.getEntityDefinition(entityLogicalName, context, ['EntitySetName']),
            uri = `${url}/api/data/v${version}/${entitySetName}(${id})${query}`,
            {body} = await NodeApi.request('GET', uri, null, {
                'Authorization': `Bearer ${bearer}`
            });
        return body;
    }

    public static async updateRecord(entityLogicalName: string, id: string, model: Model, context: AdalRouterContext): Promise<Model> {
        const {settings, bearer} = context,
            {crm} = settings,
            {url, version } = crm,
            {EntitySetName: entitySetName} = await NodeApi.getEntityDefinition(entityLogicalName, context, ['EntitySetName']),
            uri = `${url}/api/data/v${version}/${entitySetName}(${id})`,
            request = await NodeApi.request('PATCH', uri, model, {
                'Authorization': `Bearer ${bearer}`,
                'Prefer': 'return=representation'
            });
        return request.body;
    }

    public static async insertRecord(entityLogicalName: string, model: Model, context: AdalRouterContext): Promise<Model> {
        const {settings, bearer} = context,
            {crm} = settings,
            {url, version} = crm,
            {EntitySetName: entitySetName} = await NodeApi.getEntityDefinition(entityLogicalName, context, ['EntitySetName']),
            uri = `${url}/api/data/v${version}/${entitySetName}`,
            {body} = await NodeApi.request('POST', uri, model, {
                'Authorization': `Bearer ${bearer}`,
                'Prefer': 'return=representation'
            });
        return body;
    }

    public static async getStatusOptionSet(entityLogicalName: string, context: AdalRouterContext): Promise<OptionSetOption[]> {
        const {settings, bearer} = context,
            {crm} = settings,
            {url, version} = crm,
            // eslint-disable-next-line max-len
            uri = `${url}/api/data/v${version}/EntityDefinitions(LogicalName='${entityLogicalName}')/Attributes/Microsoft.Dynamics.CRM.StatusAttributeMetadata?$expand=OptionSet`,
            {body} = await NodeApi.request('GET', uri, null, {
                'Authorization': `Bearer ${bearer}`
            });
        return body.value[0].OptionSet.Options.map((option: {Value: number; ExternalValue: number; Label: {UserLocalizedLabel: {Label: string}}}) => {
            return {
                value: option.Value,
                externalValue: option.ExternalValue,
                label: option.Label.UserLocalizedLabel.Label
            };
        });
    }

    public static async getStateOptionSet(entityLogicalName: string, context: AdalRouterContext): Promise<OptionSetOption[]> {
        const {settings, bearer} = context,
            {crm} = settings,
            {url, version} = crm,
            // eslint-disable-next-line max-len
            uri = `${url}/api/data/v${version}/EntityDefinitions(LogicalName='${entityLogicalName}')/Attributes/Microsoft.Dynamics.CRM.StateAttributeMetadata?$expand=OptionSet`,
            {body} = await NodeApi.request('GET', uri, null, {
                'Authorization': `Bearer ${bearer}`
            });
        return body.value[0].OptionSet.Options.map((option: {Value: number; ExternalValue: number; Label: {UserLocalizedLabel: {Label: string}}}) => {
            return {
                value: option.Value,
                externalValue: option.ExternalValue,
                label: option.Label.UserLocalizedLabel.Label
            };
        });
    }

    public static async getPicklistOptionSet(entityLogicalName: string, attribute: string, context: AdalRouterContext): Promise<OptionSetOption[]> {
        const {settings, bearer} = context,
            {crm} = settings,
            {url, version} = crm,
            // eslint-disable-next-line max-len
            uri = `${url}/api/data/v${version}/EntityDefinitions(LogicalName='${entityLogicalName}')/Attributes(LogicalName='${attribute}')/Microsoft.Dynamics.CRM.PicklistAttributeMetadata?$select=LogicalName&$expand=OptionSet($select=Options)`,
            {body} = await NodeApi.request('GET', uri, null, {
                'Authorization': `Bearer ${bearer}`
            });
        return body.OptionSet.Options.map((option: {Value: number; ExternalValue: number; Label: {UserLocalizedLabel: {Label: string}}}) => {
            return {
                value: option.Value,
                externalValue: option.ExternalValue,
                label: option.Label.UserLocalizedLabel.Label
            };
        });
    }

    public static async getBooleanOptionSet(entityLogicalName: string, attribute: string, context: AdalRouterContext): Promise<OptionSetOption[]> {
        const {settings, bearer} = context,
            {crm} = settings,
            {url, version} = crm,
            // eslint-disable-next-line max-len
            uri = `${url}/api/data/v${version}/EntityDefinitions(LogicalName='${entityLogicalName}')/Attributes(LogicalName='${attribute}')/Microsoft.Dynamics.CRM.BooleanAttributeMetadata?$select=LogicalName&$expand=OptionSet($select=TrueOption,FalseOption)`,
            {body} = await NodeApi.request('GET', uri, null, {
                'Authorization': `Bearer ${bearer}`
            }),
            optionSet = body.OptionSet,
            {FalseOption, TrueOption} = optionSet;
        return [{
            value: FalseOption.Value,
            label: FalseOption.Label.UserLocalizedLabel.Label
        }, {
            value: TrueOption.Value,
            label: TrueOption.Label.UserLocalizedLabel.Label
        }];
    }

    private static jsonHeaders: JsonHttpHeaders = {
        'OData-MaxVersion': '4.0',
        'OData-Version': '4.0',
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
    };

    public static async executeAction(actionName: string, context: AdalRouterContext, data?: any, entityLogicalName?: string, id?: string): Promise<any> {
        if (entityLogicalName) {
            return this.executeBoundAction(actionName, context, data, entityLogicalName, id);
        } else {
            return this.executeUnboundAction(actionName, context, data);
        }
    }

    private static async executeBoundAction(actionName: string, context: AdalRouterContext, data: any, entityLogicalName: string, id: string): Promise<any> {
        const metadata = await Xrm.Utility.getEntityMetadata(entityLogicalName),
            {settings, bearer} = context,
            {crm} = settings,
            {url, version} = crm,
            uri = `${url}/api/data/v${version}/${metadata.EntitySetName}(${id})/Microsoft.Dynamics.CRM.${actionName}`,
            {body} = await NodeApi.request('POST', uri, data, {
                'Authorization': `Bearer ${bearer}`
            });
        return body;
    }

    private static async executeUnboundAction(actionName: string, context: AdalRouterContext, data?: any): Promise<JSON> {
        const method: Method = data ? 'POST' : 'GET',
            {settings, bearer} = context,
            {crm} = settings,
            {url, version} = crm,
            uri = `${url}/api/data/v${version}/${actionName}`,
            {body} = await NodeApi.request(method, uri, data, {
                'Authorization': `Bearer ${bearer}`
            });
        return body;
    }

    private static async getSystemQueryOptions(entityLogicalName: string, options: MultipleSystemQueryOptions, context: AdalRouterContext): Promise<string> {
        const {select, filters, expands, orders, top} = options,
            $select = await NodeApi.generateSelect(select, entityLogicalName, context),
            $filter = await NodeApi.generateFilter(filters, entityLogicalName, context),
            $expand = await NodeApi.generateExpand(expands, entityLogicalName, context),
            $orderby = await NodeApi.generateOrderby(orders, entityLogicalName, context),
            $top = top ? `$top=${top}` : null,
            optionParts = [];
        if ($select) {
            optionParts.push($select);
        }
        if ($filter) {
            optionParts.push($filter);
        }
        if ($expand) {
            optionParts.push($expand);
        }
        if ($orderby) {
            optionParts.push($orderby);
        }
        if ($top) {
            optionParts.push($top);
        }
        return optionParts.length > 0 ? `?${optionParts.join('&')}` : '';
    }

    private static async generateSelect(attributes: string[] = [], entityLogicalName: string, context: AdalRouterContext): Promise<string> {
        const selectAttributes: string[] = [];
        if (attributes.length > 0) {
            for (const attribute of attributes) {
                selectAttributes.push(await NodeApi.getOptionsName(attribute, entityLogicalName, context));
            }
        }
        return selectAttributes.length > 0 ? `$select=${selectAttributes.join(',')}` : null;
    }

    private static async generateFilter(filters: Filter[] = [], entityLogicalName: string, context: AdalRouterContext): Promise<string> {
        const filterAttributes: string[] = [];
        if (filters.length > 0) {
            for (const filter of filters) {
                filterAttributes.push(await NodeApi.parseFilter(filter, entityLogicalName, context));
            }
        }
        return filterAttributes.length > 0 ? `$filter=${filterAttributes.join(' and ')}` : null;
    }

    private static async parseFilter(filter: Filter, entityLogicalName: string, context: AdalRouterContext): Promise<string> {
        const {type = 'and', conditions, filters = []} = filter,
            filterParts: string[] = [];
        for (const condition of conditions) {
            const {operator = 'eq'} = condition;
            if (filterConditions.includes(operator as FilterCondition)) {
                filterParts.push(await NodeApi.parseFilterCondition(condition, entityLogicalName, context));
            } else {
                filterParts.push(await NodeApi.parseQueryFunction(condition, entityLogicalName, context));
            }
        }
        for (const fltr of filters) {
            filterParts.push(await NodeApi.parseFilter(fltr, entityLogicalName, context));
        }
        return `(${filterParts.join(` ${type} `)})`;
    }

    private static async parseFilterCondition(condition: Condition, entityLogicalName: string, context: AdalRouterContext): Promise<string> {
        const {attribute, operator = 'eq', value} = condition,
            attributeMetadata = await NodeApi.getAttributeMetadata(attribute, entityLogicalName, context),
            attributeType = attributeMetadata.AttributeType,
            optionsName = await NodeApi.getOptionsName(attribute, entityLogicalName, context),
            valueEscaped = ['String', 'EntityName'].includes(attributeType) ? `'${value}'` : `${value}`;
        return `${optionsName} ${operator} ${valueEscaped}`;
    }

    private static async parseQueryFunction(condition: Condition, entityLogicalName: string, context: AdalRouterContext): Promise<string> {
        const {attribute, operator = 'eq', value} = condition,
            optionsName = await NodeApi.getOptionsName(attribute, entityLogicalName, context);
        let filterStr = `Microsoft.Dynamics.CRM.${operator}(PropertyName='${optionsName}'`;
        if (value !== undefined) {
            if (Array.isArray(value)) {
                const values = value.map(val => `'${val}'`);
                filterStr += `,PropertyValues=[${values.join(',')}]`;
            } else {
                filterStr += `,PropertyValue='${value}'`;
            }
        }
        filterStr += `)`;
        return filterStr;
    }

    private static async generateExpand(expands: Expand[] = [], entityLogicalName: string, context: AdalRouterContext): Promise<string> {
        const expandAttributes: string[] = [];
        if (expands.length > 0) {
            for (const expand of expands) {
                const {attribute, select} = expand;
                let navigationPropertyName = attribute;
                if (select && select.length > 0) {
                    const manyToOneMetadata = await NodeApi.getManyToOneMetadata(attribute, entityLogicalName, context);
                    const {ReferencedEntity: referencedEntity} = manyToOneMetadata,
                        selectOptionNames: string[] = [];
                    for (const selectName of select) {
                        const optionName = await NodeApi.getOptionsName(selectName, referencedEntity, context);
                        selectOptionNames.push(optionName);
                    }
                    navigationPropertyName += `($select=${selectOptionNames.join(',')})`;
                }
                expandAttributes.push(navigationPropertyName);
            }
        }
        return expandAttributes.length > 0 ? `$expand=${expandAttributes.join(',')}` : null;
    }

    private static async generateOrderby(orders: OrderBy[] = [], entityLogicalName: string, context: AdalRouterContext): Promise<string> {
        const orderParts: string[] = [];
        for (const {attribute, order} of orders) {
            const optionsName = await NodeApi.getOptionsName(attribute, entityLogicalName, context);
            orderParts.push(`${optionsName} ${order || 'asc'}`);
        }
        return orderParts.length > 0 ? `$orderby=${orderParts.join(',')}` : null;
    }

    private static async getOptionsName(attribute: string, entityLogicalName: string, context: AdalRouterContext): Promise<string> {
        const isLookupAttribute: boolean = await NodeApi.isLookupAttribute(attribute, entityLogicalName, context);
        return isLookupAttribute ? `_${attribute}_value` : attribute;
    }

    private static async isLookupAttribute(attribute: string, entityLogicalName: string, context: AdalRouterContext): Promise<boolean> {
        const manyToOneMetadata = await NodeApi.getManyToOneMetadata(attribute, entityLogicalName, context);
        return !!manyToOneMetadata;
    }

    private static request(method: Method, uri: string, data?: any, httpHeaders: HttpHeaders = {}): Promise<NodeApiResponse> {
        return new Promise((resolve, reject): void => {
            const options = NodeApi.getRequestOptions(method, uri, httpHeaders, data);
            const req = https.request(options, (response: IncomingMessage) => {
                let body = '';
                response.setEncoding('utf8');
                response.on('data', (chunk: Buffer) => body += chunk);
                response.on('end', () => {
                    try {
                        resolve(NodeApi.handleNodeHttpsResponse(response, body));
                    } catch (e) {
                        reject(e);
                    }
                });
            });
            req.on('error', (error: Error) => {
                reject(error);
            });
            if (method !== 'GET') {
                req.write(data && JSON.stringify(data));
            }
            req.end();
        });
    }

    private static getRequestOptions(method: Method, uri: string, httpHeaders: HttpHeaders, data?: any): RequestOptions {
        const split = uri.split('/'),
            hostname = split[2],
            path = '/' + split.slice(3, split.length).join('/');
        const totalHeaders = Object.assign({}, NodeApi.jsonHeaders, httpHeaders);
        if (method !== 'GET') {
            const requestData = data && JSON.stringify(data);
            totalHeaders['Content-Length'] = requestData.length;
        }
        return {
            hostname: hostname,
            port: 443,
            path: encodeURI(path),
            method: method,
            headers: totalHeaders
        };
    }

    private static handleNodeHttpsResponse(response: IncomingMessage, bodyString: string): NodeApiResponse {
        const statusHandlers: {[index: number]: Function} = {
            200: () => {
                return NodeApi.dataHandler(response, bodyString);
            },
            201: () => {
                return NodeApi.dataHandler(response, bodyString);
            },
            204: () => {
                return {
                    body: '',
                    getResponseHeader: (headerName: string): string | string[] => {
                        return response.headers[headerName];
                    },
                    statusCode: response.statusCode
                };
            }
        };

        const statusHandler = statusHandlers[response.statusCode];
        if (statusHandler) {
            return statusHandler();
        } else {
            if (response.statusCode === 401) {
                throw new Error('Unauthorized');
            }
            throw new Error(`${response.statusCode}: ${response.statusMessage}\n ${bodyString}`);
        }
    }

    private static dataHandler(response: IncomingMessage, bodyString: string): NodeApiResponse {
        let body = null;
        try {
            body = JSON.parse(bodyString);
        } catch (ex) {
            throw new Error(`JSON response can't be parsed`);
        }
        return {
            body: body,
            getResponseHeader: (headerName: string): string | string[] => {
                return response.headers[headerName];
            },
            statusCode: response.statusCode
        };
    }

    public static async getEntityDefinition(entityLogicalName: string, context: AdalRouterContext, select?: string[]): Promise<any> {
        const {settings, bearer} = context,
            {crm} = settings,
            {url, version} = crm;
        let uri = `${url}/api/data/v${version}/EntityDefinitions(LogicalName='${entityLogicalName}')`;
        if (select) {
            uri += `?$select=${select.join(',')}`;
        }
        const {body} = await NodeApi.request('GET', uri, null, {
            'Authorization': `Bearer ${bearer}`
        });
        return body;
    }

    public static async getManyToOneMetadata(attribute: string, entityLogicalName: string, context: AdalRouterContext, targetEntity?: string): Promise<any> {
        const manyToOneMetadatas = await NodeApi.getManyToOneMetadatas(entityLogicalName, context);
        let relationMetadata = manyToOneMetadatas.find((relMetadata: any) => {
            const {ReferencingEntityNavigationPropertyName} = relMetadata;
            return ReferencingEntityNavigationPropertyName === attribute;
        });
        if (!relationMetadata) {
            relationMetadata = manyToOneMetadatas.find((relMetadata: any) => {
                const {ReferencingAttribute, ReferencedEntity} = relMetadata;
                return ReferencingAttribute === attribute && (!targetEntity || targetEntity === ReferencedEntity);
            });
        }
        return relationMetadata ? relationMetadata : null;
    }

    public static async getManyToOneMetadatas(entityLogicalName: string, context: AdalRouterContext): Promise<any[]> {
        const {settings, bearer} = context,
            {crm} = settings,
            {url, version} = crm;
        const uri = `${url}/api/data/v${version}/EntityDefinitions(LogicalName='${entityLogicalName}')/ManyToOneRelationships`,
            {body} = await NodeApi.request('GET', uri, null, {
                'Authorization': `Bearer ${bearer}`
            });
        const {value: manyToOneMetadatas} = body;
        return manyToOneMetadatas;
    }

    public static async getAttributesMetadata(entityLogicalName: string, context: AdalRouterContext, select?: string[]): Promise<any> {
        const {settings, bearer} = context,
            {crm} = settings,
            {url, version} = crm;
        let uri = `${url}/api/data/v${version}/EntityDefinitions(LogicalName='${entityLogicalName}')/Attributes?$filter=IsValidODataAttribute eq true`;
        if (select) {
            uri += `&$select=${select.join(',')}`;
        }
        const {body} = await NodeApi.request('GET', uri, null, {
            'Authorization': `Bearer ${bearer}`
        });
        const {value: attributesMetadata} = body;
        return attributesMetadata;
    }

    public static async getAttributeMetadata(attributeLogicalName: string,
        entityLogicalName: string, context: AdalRouterContext, select?: string[]): Promise<any> {
        const {settings, bearer} = context,
            {crm} = settings,
            {url, version} = crm;
        let uri = `${url}/api/data/v${version}/EntityDefinitions(LogicalName='${entityLogicalName}')/Attributes(LogicalName='${attributeLogicalName}')`;
        if (select) {
            uri += `&$select=${select.join(',')}`;
        }
        const {body} = await NodeApi.request('GET', uri, null, {
            'Authorization': `Bearer ${bearer}`
        });
        return body;
    }
}
/* eslint-enable @typescript-eslint/no-explicit-any */
