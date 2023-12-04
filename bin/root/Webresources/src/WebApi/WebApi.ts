import {Http, jsonHttpHeaders} from '../Http/Http';

const filterConditions = ['eq' , 'ne', 'gt', 'ge', 'lt', 'le'] as const; // See SystemQueryOptions type FilterCondition

interface Binding {
    [index:string]: string;
}

interface RelationMetadata {
    ReferencingEntityNavigationPropertyName: string;
    ReferencedEntity: string;
    ReferencingEntity: string;
    ReferencingAttribute: string;
}

type ActionData<K extends string, T> = {
    [P in K]?: T
}

const dateReviver = <V>(key: string, value: V | Date): V | Date => {
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

    public static async updateRecord(entityLogicalName: string, id: string, model: Model): Promise<Model> {
        const attributes = Object.keys(model),
            metadata = await Xrm.Utility.getEntityMetadata(entityLogicalName, attributes),
            requestData = await WebApi.populateBindings(model, metadata);
        if (!id) {
            id = requestData[metadata.PrimaryIdAttribute as keyof Model] as string;
        }
        delete requestData[metadata.PrimaryIdAttribute as keyof Model];
        for (const attribute of attributes) {
            const attributeMetadata = metadata.Attributes.get(attribute),
                attributeType = attributeMetadata && attributeMetadata.AttributeType;
            if (attributeType === 6) { // Lookup
                const bindingId = requestData[attribute as keyof Model];
                if (!bindingId) {
                    await WebApi.disassociateEntity(entityLogicalName, id, attribute);
                }
            }
            if ((await WebApi.getManyToOneMetadata(attribute, metadata) && typeof requestData[attribute as keyof Model] !== 'string')) {
                // navigationProperty maybe equal to attribute name
                delete requestData[attribute as keyof Model];
            }
        }
        await Xrm.WebApi.updateRecord(entityLogicalName, id, requestData);
        return model;
    }

    public static async createRecord(entityLogicalName: string, model: Model): Promise<Model> {
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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        model[metadata.PrimaryIdAttribute] = result.id;
        return model;
    }

    public static async upsertRecord(entityLogicalName: string, model: Model): Promise<Model> {
        const metadata = await Xrm.Utility.getEntityMetadata(entityLogicalName);
        const primaryId = model[metadata.PrimaryIdAttribute as keyof Model] as string;
        if (Object.keys(model).includes(metadata.PrimaryIdAttribute) && primaryId) {
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
            request = await WebApi.request('GET', uri),
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
        return WebApi.request('DELETE', uri);
    }

    public static async executeFunction(functionName: string): Promise<JSON> {
        const xmlHttpRequest = await WebApi.request('GET', `${functionName}`);
        return xmlHttpRequest.response && JSON.parse(xmlHttpRequest.response, dateReviver);
    }

    public static async executeAction<R, I extends string, V>(actionName: string, data?: ActionData<I, V>, entityLogicalName?: string, id?: string): Promise<R> {
        if (entityLogicalName) {
            return this.executeBoundAction(actionName, data, entityLogicalName, id);
        } else {
            return this.executeUnboundAction(actionName, data);
        }
    }

    private static async executeBoundAction<R>(actionName: string, data: unknown, entityLogicalName: string, id: string): Promise<R> {
        const metadata = await Xrm.Utility.getEntityMetadata(entityLogicalName),
            xmlHttpRequest = await WebApi.request('POST', `${metadata.EntitySetName}(${id})/Microsoft.Dynamics.CRM.${actionName}`, data);
        return xmlHttpRequest.response && JSON.parse(xmlHttpRequest.response, dateReviver);
    }

    private static async executeUnboundAction<R>(actionName: string, data?: unknown): Promise<R> {
        const xmlHttpRequest = await WebApi.request('POST', `${actionName}`, data);
        return xmlHttpRequest.response && JSON.parse(xmlHttpRequest.response, dateReviver);
    }

    public static async populateBindings(model: Model, metadata: Xrm.Metadata.EntityMetadata): Promise<Model> {
        const attributes = Object.keys(model),
            requestData = {...model};
        for (const attribute of attributes) {
            const attributeMetadata = metadata.Attributes.get(attribute);
            if (attributeMetadata) {
                if ([1, 6, 9].includes(attributeMetadata.AttributeType)) { // Customer, Lookup, Owner
                    const bindingId = requestData[attribute as keyof Model] as string;
                    if (bindingId) {
                        const targetEntity = model[`_${attribute}_value@Microsoft.Dynamics.CRM.lookuplogicalname` as unknown as keyof Model] as string;
                        const binding = await WebApi.getBinding(attribute, bindingId, metadata, targetEntity);
                        Object.assign(requestData, binding);
                    }
                    delete requestData[attribute as keyof Model];
                    delete requestData[`_${attribute}_value@Microsoft.Dynamics.CRM.lookuplogicalname` as unknown as keyof Model];
                }
            }
        }
        return requestData;
    }

    public static async getBinding(attribute: string, id: string, metadata: Xrm.Metadata.EntityMetadata, targetEntity?: string): Promise<Binding> {
        const manyToOneMetadata = await WebApi.getManyToOneMetadata(attribute, metadata, targetEntity),
            {ReferencedEntity: referencedEntity, ReferencingEntityNavigationPropertyName: referencingEntityNavigationPropertyName} = manyToOneMetadata,
            referencedMetadata = await Xrm.Utility.getEntityMetadata(referencedEntity),
            referencedEntitySetName = referencedMetadata.EntitySetName,
            key = `${referencingEntityNavigationPropertyName}@odata.bind`,
            cleanId = id.replace('{', '').replace('}', ''),
            binding: Binding = {};
        binding[key] = `/${referencedEntitySetName}(${cleanId})`;
        return binding;
    }

    private static async request<D>(method: Method, uri: string, data?: D, httpHeaders: JsonHttpHeaders = jsonHttpHeaders): Promise<XMLHttpRequest> {
        const url = `${this.apiUrl}${uri}`;
        try {
            return await Http.request(method, url, data, httpHeaders);
        } catch (e) {
            const responseJSON = JSON.parse(e.message);
            throw new Error(responseJSON.error.message);
        }
    }

    private static parseModels(models: Model[], options: SystemQueryOptions): Model[] {
        for (const model of models) {
            WebApi.parseModel(model, options);
        }
        return models;
    }

    private static parseModel(model: Model, options: SystemQueryOptions): Model {
        const {select, expands = []} = options;
        WebApi.parseValues(model, select);
        for (const expand of expands) {
            WebApi.parseValues(model[expand.attribute as keyof Model] as Model, expand.select);
        }
        return model;
    }

    private static parseValues(model: Model, select: string[] = []): Model {
        if (!model) {
            return model;
        }
        const modelKeys = Object.keys(model);
        for (const attribute of select) {
            if (modelKeys.includes(`_${attribute}_value`)) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                model[attribute] = model[`_${attribute}_value` as keyof Model];
            }
            if (modelKeys.includes(`_${attribute}_value@Microsoft.Dynamics.CRM.lookuplogicalname`)) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                model[`${attribute}@Microsoft.Dynamics.CRM.lookuplogicalname`] = model[`_${attribute}_value@Microsoft.Dynamics.CRM.lookuplogicalname`];
            }
            if (modelKeys.includes(`_${attribute}_value@Microsoft.Dynamics.CRM.associatednavigationproperty`)) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                // eslint-disable-next-line max-len
                model[`${attribute}@Microsoft.Dynamics.CRM.associatednavigationproperty`] = model[`_${attribute}_value@Microsoft.Dynamics.CRM.associatednavigationproperty`];
            }
            if (modelKeys.includes(`_${attribute}_value@OData.Community.Display.V1.FormattedValue`)) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                model[`${attribute}@OData.Community.Display.V1.FormattedValue`] = model[`_${attribute}_value@OData.Community.Display.V1.FormattedValue`];
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
        const {type = 'and', conditions, filters = []} = filter,
            filterParts: string[] = [];
        for (const condition of conditions) {
            const {operator = 'eq'} = condition;
            if (filterConditions.includes(operator as FilterCondition)) {
                filterParts.push(await WebApi.parseFilterCondition(condition, metadata));
            } else {
                filterParts.push(await WebApi.parseQueryFunction(condition, metadata));
            }
        }
        for (const fltr of filters) {
            filterParts.push(await WebApi.parseFilter(fltr, metadata));
        }
        return `(${filterParts.join(` ${type} `)})`;
    }

    private static async parseFilterCondition(condition: Condition, metadata: Xrm.Metadata.EntityMetadata): Promise<string> {
        const {attribute, operator = 'eq', value} = condition,
            attributeMetadata = metadata.Attributes.get(attribute),
            attributeType = attributeMetadata && attributeMetadata.AttributeType,
            optionsName = await WebApi.getOptionsName(attribute, metadata),
            valueEscaped = attributeType === 14 ? `'${value}'` : `${value}`;
        return `${optionsName} ${operator} ${valueEscaped}`;
    }

    private static async parseQueryFunction(condition: Condition, metadata: Xrm.Metadata.EntityMetadata): Promise<string> {
        const {attribute, operator = 'eq', value} = condition,
            optionsName = await WebApi.getOptionsName(attribute, metadata);
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

    private static async isLookupAttribute(attribute: string, metadata: Xrm.Metadata.EntityMetadata): Promise<boolean> {
        if ((metadata as unknown as {ManyToOneRelationships: unknown }).ManyToOneRelationships) {
            const attributeMetadata = metadata.Attributes.get(attribute),
                attributeType = attributeMetadata && attributeMetadata.AttributeType;
            return [1, 6].includes(attributeType); // 1: Customer, 6: Lookup
        } else {
            const manyToOneMetadata = await WebApi.getManyToOneMetadata(attribute, metadata);
            return !!manyToOneMetadata;
        }
    }

    public static async getManyToOneMetadata(attribute: string, metadata: Xrm.Metadata.EntityMetadata, targetEntity?: string): Promise<RelationMetadata> {
        const manyToOneMetadatas = await WebApi.getManyToOneMetadatas(metadata);
        let relationMetadata = manyToOneMetadatas.find(relMetadata => {
            const {ReferencingEntityNavigationPropertyName} = relMetadata;
            return ReferencingEntityNavigationPropertyName === attribute;
        });
        if (!relationMetadata) {
            relationMetadata = manyToOneMetadatas.find(relMetadata => {
                const {ReferencingAttribute, ReferencedEntity} = relMetadata;
                return ReferencingAttribute === attribute && (!targetEntity || targetEntity === ReferencedEntity);
            });
        }
        return relationMetadata ? relationMetadata : null;
    }

    private static async getManyToOneMetadatas(metadata: Xrm.Metadata.EntityMetadata): Promise<RelationMetadata[]> {
        const manyToOneRelationships = (metadata as unknown as {ManyToOneRelationships: {getAll: () => RelationMetadata[]} }).ManyToOneRelationships;
        if (manyToOneRelationships) {
            return manyToOneRelationships.getAll();
        } else {
            const uri = `EntityDefinitions(LogicalName='${metadata.LogicalName}')/ManyToOneRelationships`;
            const request = await WebApi.request('GET', uri);
            const {value: manyToOneMetadatas} = JSON.parse(request.response);
            return manyToOneMetadatas;
        }
    }

    public static async getAttributesMetadata(entityLogicalName: string, select: string[]): Promise<unknown[]> {
        const uri = `EntityDefinitions(LogicalName='${entityLogicalName}')/Attributes?$select=${select.join(',')}`,
            request = await WebApi.request('GET', uri);
        const {value: attributesMetadata} = JSON.parse(request.response);
        return attributesMetadata;
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
