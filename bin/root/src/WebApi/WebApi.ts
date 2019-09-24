import {Model} from './Model';

/* eslint-disable @typescript-eslint/no-explicit-any */
interface Expand {
    attribute: string;
    select: string[];
}

type FilterCondition = 'eq' | 'ne' | 'gt' | 'ge' | 'lt' | 'le';
interface Condition {
    attribute: string;
    operator?: FilterCondition;
    value: any;
}

type FilterType = 'and' | 'or' | 'not';
export interface Filter {
    type?: FilterType;
    conditions: Condition[];
}

type Order = 'asc' | 'desc';
interface OrderBy {
    attribute: string;
    order?: Order;
}

export interface SystemQueryOptions {
    select: string[];
    expands?: Expand[];
}

export interface MultipleSystemQueryOptions extends SystemQueryOptions {
    filters?: Filter[];
    orders?: OrderBy[];
    top?: number;
}

type Method = 'GET' | 'POST' | 'DELETE';

interface HttpHeaders {
    [index: string]: string;
}

interface JsonHttpHeaders extends HttpHeaders {
    'OData-MaxVersion': string;
    'OData-Version': string;
    'Accept': string;
    'Content-Type': string;
}

const dateReviver = (key: string, value: any): any => {
    if (typeof value === 'string') {
        const d = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?::(\d*))?Z$/.exec(value);
        if (d) {
            return new Date(Date.UTC(+d[1], +d[2] - 1, +d[3], +d[4], +d[5], +d[6], +d[7] || 0));
        }
    }
    return value;
};

export class WebApi {
    public static get apiUrl(): string {
        const globalContext = Xrm.Utility.getGlobalContext(),
            clientUrl = globalContext.getClientUrl(),
            version = globalContext.getVersion().split('.').splice(0, 2).join('.');
        return `${clientUrl}/api/data/v${version}/`;
    }

    public static async retrieveMultipleRecords(entityLogicalName: string, options: MultipleSystemQueryOptions, maxPageSize?: number): Promise<Model[]> {
        const systemQueryOptions = await WebApi.getSystemQueryOptions(entityLogicalName, options),
            result = await Xrm.WebApi.retrieveMultipleRecords(entityLogicalName, systemQueryOptions, maxPageSize);
        return WebApi.parseModels(result.entities, options);
    }

    public static async retrieveRecord(entityLogicalName: string, id: string, options: SystemQueryOptions): Promise<Model> {
        const systemQueryOptions = await WebApi.getSystemQueryOptions(entityLogicalName, options),
            entity = await Xrm.WebApi.retrieveRecord(entityLogicalName, id, systemQueryOptions);
        return WebApi.parseModel(entity, options);
    }

    public static async updateRecord(entityLogicalName: string, id: string, model: Model): Promise<{entityType: string; id: string}> {
        const attributes = Object.keys(model),
            metadata = await Xrm.Utility.getEntityMetadata(entityLogicalName, attributes),
            requestData: any = await WebApi.populateBindings(model, metadata);
        if (!id) {
            id = requestData[metadata.PrimaryIdAttribute];
        }
        delete requestData[metadata.PrimaryIdAttribute];
        for (const attribute of attributes) {
            const attributeMetadata: any = metadata.Attributes.get(attribute),
                attributeType = attributeMetadata && attributeMetadata.AttributeType;
            if (attributeType === 6) { // Lookup
                const bindingId = requestData[attribute];
                if (!bindingId) {
                    await WebApi.disassociateEntity(entityLogicalName, id, attribute);
                }
            }
            if ((await WebApi.getManyToOneMetadata(attribute, metadata) && typeof requestData[attribute] !== 'string')) {
                // navigationProperty maybe equal to attribute name
                delete requestData[attribute];
            }
        }
        return Xrm.WebApi.updateRecord(entityLogicalName, id, requestData);
    }

    public static async createRecord(entityLogicalName: string, model: Model | any): Promise<{entityType: string; id: string}> {
        const attributes = Object.keys(model),
            metadata = await Xrm.Utility.getEntityMetadata(entityLogicalName, attributes),
            requestData = await WebApi.populateBindings(model, metadata);
        /*for (const attribute of attributes) {
            if ((await WebApi.getManyToOneMetadata(attribute, metadata) && typeof requestData[attribute] !== 'string')) {
            // navigationProperty maybe equal to attribute name
                delete requestData[attribute];
            }
        }*/
        const result = await Xrm.WebApi.createRecord(entityLogicalName, requestData);
        model[metadata.PrimaryIdAttribute] = result.id;
        return result;
    }

    public static async upsertRecord(entityLogicalName: string, model: Model | any): Promise<{entityType: string; id: string}> {
        const metadata = await Xrm.Utility.getEntityMetadata(entityLogicalName);
        const primaryId = model[metadata.PrimaryIdAttribute];
        if (model.hasOwnProperty(metadata.PrimaryIdAttribute) && primaryId) {
            return this.updateRecord(entityLogicalName, primaryId, model);
        } else {
            return this.createRecord(entityLogicalName, model);
        }
    }

    public static async count(entityLogicalName: string, filters?: Filter[]): Promise<number> {
        const attributes = WebApi.getMetadataAttributes([], filters),
            metadata = await Xrm.Utility.getEntityMetadata(entityLogicalName, attributes),
            entitySetName = metadata.EntitySetName,
            primaryIdAttribute = metadata.PrimaryIdAttribute,
            $filter = await WebApi.generateFilter(filters, metadata),
            optionParts = ['$count=true', `$select=${primaryIdAttribute}`, '$top=1'];
        if ($filter) {
            optionParts.push($filter);
        }
        const uri = `${entitySetName}?${optionParts.join('&')}`,
            request = await WebApi.request('GET', uri, null, WebApi.jsonHeaders),
            data = JSON.parse(request.response);
        return data['@odata.count'];
    }

    // https://docs.microsoft.com/en-us/dynamics365/customer-engagement/developer/webapi/associate-disassociate-entities-using-web-api
    public static async disassociateEntity(entityLogicalName: string, id: string, relAttribute: string, relId?: string): Promise<XMLHttpRequest> {
        const metadata = await Xrm.Utility.getEntityMetadata(entityLogicalName),
            entitySetName = metadata.EntitySetName,
            relMetadata = await WebApi.getManyToOneMetadata(relAttribute, metadata),
            {ReferencingEntityNavigationPropertyName: navigationPropertyName, ReferencingEntity: relEntityLogicalName} = relMetadata;
        let uri = `${entitySetName}(${id})/${navigationPropertyName}/$ref`;
        if (relId) {
            const relEntityMetadata = await Xrm.Utility.getEntityMetadata(relEntityLogicalName),
                relEntitySetName = relEntityMetadata.EntitySetName;
            uri += `?$id=${this.apiUrl}${relEntitySetName}(${relId})`;
        }
        return WebApi.request('DELETE', uri, null, WebApi.jsonHeaders);
    }

    public static async executeAction(actionName: string, data?: any, entityLogicalName?: string, id?: string): Promise<JSON> {
        if (entityLogicalName) {
            return this.executeBoundAction(actionName, data, entityLogicalName, id);
        } else {
            return this.executeUnboundAction(actionName, data);
        }
    }

    private static async executeBoundAction(actionName: string, data: any, entityLogicalName: string, id: string): Promise<JSON> {
        const metadata = await Xrm.Utility.getEntityMetadata(entityLogicalName),
            xmlHttpRequest = await WebApi.request('POST', `${metadata.EntitySetName}(${id})/Microsoft.Dynamics.CRM.${actionName}`, data, WebApi.jsonHeaders);
        return xmlHttpRequest.response && JSON.parse(xmlHttpRequest.response, dateReviver);
    }

    private static async executeUnboundAction(actionName: string, data?: any): Promise<JSON> {
        const method: Method = data ? 'POST' : 'GET',
            xmlHttpRequest = await WebApi.request(method, `${actionName}`, data, WebApi.jsonHeaders);
        return xmlHttpRequest.response && JSON.parse(xmlHttpRequest.response, dateReviver);
    }

    private static async populateBindings(model: Model, metadata: Xrm.Metadata.EntityMetadata): Promise<Model> {
        const attributes = Object.keys(model),
            requestData: any = {...model};
        for (const attribute of attributes) {
            const attributeMetadata: any = metadata.Attributes.get(attribute),
                attributeType = attributeMetadata && attributeMetadata.AttributeType;
            if (attributeType === 6) { // Lookup
                const bindingId = requestData[attribute];
                if (bindingId) {
                    const binding = await WebApi.getBinding(attribute, bindingId, metadata);
                    Object.assign(requestData, binding);
                }
                delete requestData[attribute];
            }
        }
        return requestData;
    }

    private static async getBinding(attribute: string, id: string, metadata: Xrm.Metadata.EntityMetadata): Promise<any> {
        const manyToOneMetadata = await WebApi.getManyToOneMetadata(attribute, metadata),
            {ReferencedEntity: referencedEntity, ReferencingEntityNavigationPropertyName: referencingEntityNavigationPropertyName} = manyToOneMetadata,
            referencedMetadata = await Xrm.Utility.getEntityMetadata(referencedEntity),
            referencedEntitySetName = referencedMetadata.EntitySetName,
            key = `${referencingEntityNavigationPropertyName}@odata.bind`,
            cleanId = id.replace('{', '').replace('}', ''),
            binding: any = {};
        binding[key] = `/${referencedEntitySetName}(${cleanId})`;
        return binding;
    }

    public static jsonHeaders: JsonHttpHeaders = {
        'OData-MaxVersion': '4.0',
        'OData-Version': '4.0',
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
    };

    public static request(method: Method, uri: string, data?: any, httpHeaders: HttpHeaders = {}): Promise<XMLHttpRequest> {
        return new Promise((resolve, reject): void => {
            const request = new XMLHttpRequest(),
                url = `${this.apiUrl}${uri}`,
                requestData = data && JSON.stringify(data);
            request.open(method, encodeURI(url), true);
            for (const header in httpHeaders) {
                if (httpHeaders.hasOwnProperty(header)) {
                    request.setRequestHeader(header, httpHeaders[header]);
                }
            }
            request.onreadystatechange = function (): void {
                if (this.readyState === 4) {
                    request.onreadystatechange = null;
                    if ([200, 201, 204].includes(this.status)) {
                        resolve(request);
                    } else {
                        reject(new Error('Unexpected Error'));
                    }
                }
            };
            request.send(requestData);
        });
    }

    private static parseModels(models: Model[], options: SystemQueryOptions): Model[] {
        for (const model of models) {
            WebApi.parseModel(model, options);
        }
        return models;
    }

    private static parseModel(model: Model | any, options: SystemQueryOptions): Model {
        const {select, expands = []} = options;
        WebApi.parseValues(model, select);
        for (const expand of expands) {
            WebApi.parseValues(model[expand.attribute], expand.select);
        }
        return model;
    }

    private static parseValues(model: Model | any, select: string[] = []): Model {
        if (!model) {
            return model;
        }
        for (const attribute of select) {
            if (model.hasOwnProperty(`_${attribute}_value`)) {
                model[attribute] = model[`_${attribute}_value`];
            }
            if (model.hasOwnProperty(`_${attribute}_value@Microsoft.Dynamics.CRM.lookuplogicalname`)) {
                model[`${attribute}_LogicalName`] = model[`_${attribute}_value@Microsoft.Dynamics.CRM.lookuplogicalname`];
            }
            if (model.hasOwnProperty(`_${attribute}_value@OData.Community.Display.V1.FormattedValue`)) {
                model[`${attribute}_FormattedValue`] = model[`_${attribute}_value@OData.Community.Display.V1.FormattedValue`];
            }
        }
        return model;
    }

    private static async getSystemQueryOptions(entityLogicalName: string, options: MultipleSystemQueryOptions): Promise<string> {
        const {select, filters, expands, orders, top} = options,
            attributes = WebApi.getMetadataAttributes(select, filters, expands),
            metadata = await Xrm.Utility.getEntityMetadata(entityLogicalName, attributes),
            $select = await WebApi.generateSelect(select, metadata),
            $filter = await WebApi.generateFilter(filters, metadata),
            $expand = await WebApi.generateExpand(expands, metadata),
            $orderby = await WebApi.generateOrderby(orders, metadata),
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

    private static async generateSelect(attributes: string[] = [], metadata: Xrm.Metadata.EntityMetadata): Promise<string> {
        const selectAttributes: string[] = [];
        if (attributes.length > 0) {
            for (const attribute of attributes) {
                selectAttributes.push(await WebApi.getOptionsName(attribute, metadata));
            }
        }
        return selectAttributes.length > 0 ? `$select=${selectAttributes.join(',')}` : null;
    }

    private static async generateFilter(filters: Filter[] = [],  metadata: Xrm.Metadata.EntityMetadata): Promise<string> {
        const filterAttributes: string[] = [];
        if (filters.length > 0) {
            for (const filter of filters) {
                filterAttributes.push(await WebApi.parseFilter(filter, metadata));
            }
        }
        return filterAttributes.length > 0 ? `$filter=${filterAttributes.join(' and ')}` : null;
    }

    private static async parseFilter(filter: Filter, metadata: Xrm.Metadata.EntityMetadata): Promise<string> {
        const {type = 'and', conditions} = filter,
            filterParts: string[] = [];
        for (const condition of conditions) {
            const {attribute, operator = 'eq', value} = condition,
                optionsName = await WebApi.getOptionsName(attribute, metadata),
                attributeMetadata = metadata.Attributes.get(attribute),
                attributeType = attributeMetadata && (attributeMetadata as any).AttributeType;
            let filterStr = `${optionsName} ${operator}`;
            filterStr += attributeType === 14 ? ` '${value}'` : ` ${value}`; // String
            filterParts.push(filterStr);
        }
        return `${filterParts.join(` ${type} `)}`;
    }

    private static async generateExpand(expands: Expand[] = [], metadata: Xrm.Metadata.EntityMetadata): Promise<string> {
        const expandAttributes: string[] = [];
        if (expands.length > 0) {
            for (const expand of expands) {
                const {attribute, select} = expand;
                let navigationPropertyName = attribute;
                if (select && select.length > 0) {
                    const manyToOneMetadata = await WebApi.getManyToOneMetadata(attribute, metadata);
                    const {ReferencedEntity} = manyToOneMetadata,
                        referencedMetadata = await Xrm.Utility.getEntityMetadata(ReferencedEntity, select),
                        selectOptionNames: string[] = [];
                    for (const selectName of select) {
                        const optionName = await WebApi.getOptionsName(selectName, referencedMetadata);
                        selectOptionNames.push(optionName);
                    }
                    navigationPropertyName += `($select=${selectOptionNames.join(',')})`;
                }
                expandAttributes.push(navigationPropertyName);
            }
        }
        return expandAttributes.length > 0 ? `$expand=${expandAttributes.join(',')}` : null;
    }

    private static async generateOrderby(orders: OrderBy[] = [], metadata: Xrm.Metadata.EntityMetadata): Promise<string> {
        const orderParts: string[] = [];
        for (const {attribute, order} of orders) {
            const optionsName = await WebApi.getOptionsName(attribute, metadata);
            orderParts.push(`${optionsName} ${order || 'asc'}`);
        }
        return orderParts.length > 0 ? `$orderby=${orderParts.join(',')}` : null;
    }

    private static async getOptionsName(attribute: string, metadata: Xrm.Metadata.EntityMetadata): Promise<string> {
        const isLookupAttribute: boolean = await WebApi.isLookupAttribute(attribute, metadata);
        return isLookupAttribute ? `_${attribute}_value` : attribute;
    }

    private static async isLookupAttribute(attribute: string, metadata: Xrm.Metadata.EntityMetadata | any): Promise<boolean> {
        if (metadata.ManyToOneRelationships) {
            const attributeMetadata = metadata.Attributes.get(attribute),
                attributeType = attributeMetadata && attributeMetadata.AttributeType;
            return [1, 6].includes(attributeType); // 1: Customer, 6: Lookup
        } else {
            const manyToOneMetadata = await WebApi.getManyToOneMetadata(attribute, metadata);
            return !!manyToOneMetadata;
        }
    }

    public static async getManyToOneMetadata(attribute: string, metadata: Xrm.Metadata.EntityMetadata, targetEntity?: string): Promise<any> {
        const manyToOneMetadatas = await WebApi.getManyToOneMetadatas(metadata);
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

    private static async getManyToOneMetadatas(metadata: Xrm.Metadata.EntityMetadata | any): Promise<any> {
        if (metadata.ManyToOneRelationships) {
            return metadata.ManyToOneRelationships.getAll();
        } else {
            const uri = `EntityDefinitions(LogicalName='${metadata.LogicalName}')/ManyToOneRelationships`;
            const request = await WebApi.request('GET', uri, null, WebApi.jsonHeaders);
            const {value: manyToOneMetadatas} = JSON.parse(request.response);
            return manyToOneMetadatas;
        }
    }

    private static getMetadataAttributes(attributes: string[] = [], filters: Filter[] = [], expands: Expand[] = []): string[] {
        const metadataAttributes = [...attributes];
        for (const {conditions} of filters) {
            for (const {attribute} of conditions) {
                if (!metadataAttributes.includes(attribute)) {
                    metadataAttributes.push(attribute);
                }
            }
        }
        for (const {attribute} of expands) {
            if (!metadataAttributes.includes(attribute)) {
                metadataAttributes.push(attribute);
            }
        }
        return metadataAttributes;
    }
}
/* eslint-enable @typescript-eslint/no-explicit-any */
