import {Filter, MultipleSystemQueryOptions, SystemQueryOptions} from '../../../../bin/root/src/WebApi/WebApi';
import {Model} from '../../../../bin/root/src/WebApi/Model';
import * as fs from 'fs';
import * as https from 'https';
import { IncomingMessage } from 'http';
import {CrmJson} from '../CrmJson';
import { RequestOptions } from 'https';

/* eslint-disable @typescript-eslint/no-explicit-any */

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
    private static settings: CrmJson = JSON.parse(fs.readFileSync('tools/crm.json', 'utf8'));

    public static async retrieveMultipleRecords(entitySetName: string, options: MultipleSystemQueryOptions, bearer: string): Promise<Model[]> {
        const query = NodeApi.getSystemQueryOptions(options),
            {crm} = NodeApi.settings,
            {url, version} = crm,
            uri = `${url}/api/data/v${version}/${entitySetName}${query}`,
            {body} = await NodeApi.request('GET', uri, null, {
                'Authorization': `Bearer ${bearer}`
            });
        return body.value;
    }

    public static async retrieveRecord(entitySetName: string, id: string, options: SystemQueryOptions, bearer: string): Promise<Model> {
        const query = NodeApi.getSystemQueryOptions(options),
            {crm} = NodeApi.settings,
            {url, version} = crm,
            uri = `${url}/api/data/v${version}/${entitySetName}(${id})${query}`,
            {body} = await NodeApi.request('GET', uri, null, {
                'Authorization': `Bearer ${bearer}`
            });
        return body;
    }

    public static async updateRecord(entitySetName: string, id: string, model: Model, bearer: string): Promise<Model> {
        const {crm} = NodeApi.settings,
            {url, version } = crm,
            uri = `${url}/api/data/v${version}/${entitySetName}(${id})`,
            request = await NodeApi.request('PATCH', uri, model, {
                'Authorization': `Bearer ${bearer}`,
                'Prefer': 'return=representation'
            });
        return request.body;
    }

    public static async insertRecord(entitySetName: string, model: Model, bearer: string): Promise<Model> {
        const {crm} = NodeApi.settings,
            {url, version} = crm,
            uri = `${url}/api/data/v${version}/${entitySetName}`,
            {body} = await NodeApi.request('POST', uri, model, {
                'Authorization': `Bearer ${bearer}`,
                'Prefer': 'return=representation'
            });
        return body;
    }

    public static async getStatusOptionSet(entityLogicalName: string, bearer: string): Promise<OptionSetOption[]> {
        const {crm} = NodeApi.settings,
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

    public static async getStateOptionSet(entityLogicalName: string, bearer: string): Promise<OptionSetOption[]> {
        const {crm} = NodeApi.settings,
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

    public static async getPicklistOptionSet(entityLogicalName: string, attribute: string, bearer: string): Promise<OptionSetOption[]> {
        const {crm} = NodeApi.settings,
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

    public static async getBooleanOptionSet(entityLogicalName: string, attribute: string, bearer: string): Promise<OptionSetOption[]> {
        const {crm} = NodeApi.settings,
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

    public static async executeAction(actionName: string, bearer: string, data?: any, entityLogicalName?: string, id?: string): Promise<any> {
        if (entityLogicalName) {
            return this.executeBoundAction(actionName, bearer, data, entityLogicalName, id);
        } else {
            return this.executeUnboundAction(actionName, bearer, data);
        }
    }

    private static async executeBoundAction(actionName: string, bearer: string, data: any, entityLogicalName: string, id: string): Promise<any> {
        const metadata = await Xrm.Utility.getEntityMetadata(entityLogicalName),
            {crm} = NodeApi.settings,
            {url, version} = crm,
            uri = `${url}/api/data/v${version}/${metadata.EntitySetName}(${id})/Microsoft.Dynamics.CRM.${actionName}`,
            {body} = await NodeApi.request('POST', uri, data, {
                'Authorization': `Bearer ${bearer}`
            });
        return body;
    }

    private static async executeUnboundAction(actionName: string, bearer: string, data?: any): Promise<JSON> {
        const method: Method = data ? 'POST' : 'GET',
            {crm} = NodeApi.settings,
            {url, version} = crm,
            uri = `${url}/api/data/v${version}/${actionName}`,
            {body} = await NodeApi.request(method, uri, data, {
                'Authorization': `Bearer ${bearer}`
            });
        return body;
    }

    private static getSystemQueryOptions(options: MultipleSystemQueryOptions): string {
        const {select, filters, top} = options,
            $select = NodeApi.generateSelect(select),
            $filter = NodeApi.generateFilter(filters),
            $top = top ? `$top=${top}` : null,
            optionParts = [];
        if ($select) {
            optionParts.push($select);
        }
        if ($filter) {
            optionParts.push($filter);
        }
        if ($top) {
            optionParts.push($top);
        }
        return optionParts.length > 0 ? `?${optionParts.join('&')}` : '';
    }

    private static generateSelect(attributes: string[] = []): string {
        return attributes.length > 0 ? `$select=${attributes.join(',')}` : null;
    }

    private static generateFilter(filters: Filter[] = []): string {
        const filterAttributes: string[] = [];
        if (filters.length > 0) {
            for (const filter of filters) {
                filterAttributes.push(NodeApi.parseFilter(filter));
            }
        }
        return filterAttributes.length > 0 ? `$filter=${filterAttributes.join(' and ')}` : null;
    }

    private static parseFilter(filter: Filter): string {
        const {type = 'and', conditions} = filter,
            filterParts: string[] = [];
        for (const condition of conditions) {
            const {attribute, operator = 'eq', value} = condition;
            let filterStr = `${attribute} ${operator}`;
            filterStr += typeof(value) === 'string' ? ` '${value}'` : ` ${value}`; // String
            filterParts.push(filterStr);
        }
        return `${filterParts.join(` ${type} `)}`;
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

    public static async getEntityDefinition(entityLogicalName: string, bearer: string, select?: string[]): Promise<any> {
        const {crm} = NodeApi.settings,
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

    public static async getManyToOneMetadatas(entityLogicalName: string, bearer: string): Promise<any> {
        const {crm} = NodeApi.settings,
            {url, version} = crm;
        const uri = `${url}/api/data/v${version}/EntityDefinitions(LogicalName='${entityLogicalName}')/ManyToOneRelationships`,
            {body} = await NodeApi.request('GET', uri, null, {
                'Authorization': `Bearer ${bearer}`
            });
        const {value: manyToOneMetadatas} = body;
        return manyToOneMetadatas;
    }

    public static async getAttributesMetadata(entityLogicalName: string, bearer: string, select?: string[]): Promise<any> {
        const {crm} = NodeApi.settings,
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
}
/* eslint-enable @typescript-eslint/no-explicit-any */
