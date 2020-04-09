import {WebApi} from './WebApi';

export interface Model {
    //Attributes for $select
    createdonbehalfbyyominame?: string;
    owneridname?: string;
    importsequencenumber?: number;
    modifiedbyyominame?: string;
    utcconversiontimezonecode?: number;
    createdbyyominame?: string;
    modifiedbyname?: string;
    timezoneruleversionnumber?: number;
    owneridyominame?: string;
    modifiedon?: string;
    modifiedonbehalfbyyominame?: string;
    createdbyname?: string;
    createdon?: string;
    createdonbehalfbyname?: string;
    modifiedonbehalfbyname?: string;
    versionnumber?: number;
    overriddencreatedon?: string;
    statecode?: number;
    statuscode?: number;
    owningbusinessunit?: string;
    owningteam?: string;
    modifiedby?: string;
    createdby?: string;
    modifiedonbehalfby?: string;
    owninguser?: string;
    createdonbehalfby?: string;
    ownerid?: string;
}

type ValidationCategory = 'Mandatory' | 'Invalid key';

export interface ModelValidation {
    isValid: boolean;
    attribute?: string;
    category?: ValidationCategory;
}

export class Model {
    public static async parseCreateModel(entityLogicalName: string, model: Model): Promise<Model> {
        const entity = Model.parseModel(model),
            metadata = await Xrm.Utility.getEntityMetadata(entityLogicalName, Object.keys(entity));
        Model.cleanCloneModel(entity, metadata);
        return WebApi.populateBindings(entity, metadata);
    }

    private static cleanCloneModel(model: Model, metadata: Xrm.Metadata.EntityMetadata): void {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (model as any)[metadata.PrimaryIdAttribute];
        delete model.statuscode;
        delete model.statecode;

        delete model.ownerid;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (model as any)['_ownerid_value@Microsoft.Dynamics.CRM.lookuplogicalname'];
        // delete model.modifiedon;
        // delete model.createdon;
        // delete model.versionnumber;
    }

    private static parseModel(model: Model): Model {
        const keys = Object.keys(model),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            cleanModel: any = {...model};
        for (const key of keys) {
            if (cleanModel[key] === null) {
                delete cleanModel[key];
            } else if (key.startsWith('@')) {
                delete cleanModel[key];
            } else if (key.endsWith('FormattedValue')) {
                delete cleanModel[key];
            } else if (key.startsWith('_') && key.endsWith('_value') && !key.includes('@')) {
                const navigationProperty = cleanModel[`${key}@Microsoft.Dynamics.CRM.associatednavigationproperty`],
                    trimmedKey = key.substr(1, key.length - 7);
                if (navigationProperty) {
                    cleanModel[trimmedKey] = cleanModel[key];
                    delete cleanModel[`${key}@Microsoft.Dynamics.CRM.associatednavigationproperty`];
                } else {
                    delete cleanModel[`${key}@Microsoft.Dynamics.CRM.lookuplogicalname`];
                }
                delete cleanModel[key];
                delete cleanModel[`${trimmedKey}_LogicalName`]; // Added in WebApi#parseValues
            }
        }
        return cleanModel;
    }

    public static async validateRecord(entityLogicalName: string, model: Model): Promise<ModelValidation> {
        let validation = await Model.validateRequiredAttributes(entityLogicalName, model);
        if (validation.isValid) {
            validation = await Model.validateMesh(entityLogicalName, model);
        }
        return validation;
    }

    private static async validateMesh(entityLogicalName: string, model: Model): Promise<ModelValidation> {
        const keys = Object.keys(model),
            wrongKey = keys.find(key => key.startsWith('_') || key.endsWith('FormattedValue') || key.endsWith('LogicalName'));
        if (wrongKey) {
            return {
                isValid: false,
                attribute: wrongKey,
                category: 'Invalid key'
            };
        }
        return {isValid: true};
    }

    private static async validateRequiredAttributes(entityLogicalName: string, model: Model): Promise<ModelValidation> {
        const requiredAttributeLogicalNames = await Model.getRequiredAttributeLogicalNames(entityLogicalName),
            filteredAttributeMetadatas = await Xrm.Utility.getEntityMetadata(entityLogicalName, requiredAttributeLogicalNames),
            keys = Object.keys(model);
        for (const name of requiredAttributeLogicalNames) {
            const attributeDescriptor = Model.getAttributeDescriptor(name, filteredAttributeMetadatas),
                property = attributeDescriptor.LogicalName,
                bindings: string[] = [];
            const targets: string[] = attributeDescriptor.Targets || [];
            for (const target of targets) {
                const binding = await WebApi.getBinding(property, 'dummy', filteredAttributeMetadatas, target);
                bindings.push(Object.keys(binding)[0]);
            }
            if (!keys.includes(property) && !keys.includes(`${property}@odata.bind`) && !bindings.some(binding => keys.includes(binding))) {
                return {
                    isValid: false,
                    attribute: name,
                    category: 'Mandatory'
                };
            }
        }
        return {isValid: true};
    }

    private static getAttributeDescriptor(attribute: string, entityMetadata: Xrm.Metadata.EntityMetadata): {
        AttributeOf?: string;
        LogicalName: string;
        Targets: string[];
    } {
        const attributeMetadata = entityMetadata.Attributes.get(attribute);
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        let attributeDescriptor = attributeMetadata.attributeDescriptor;
        if (attributeDescriptor.AttributeOf) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            attributeDescriptor = entityMetadata.Attributes.get(attributeDescriptor.AttributeOf).attributeDescriptor;
        }
        return attributeDescriptor;
    }

    private static async getRequiredAttributeLogicalNames(entityLogicalName: string): Promise<string[]> {
        const rawAttributesMetadatas = await WebApi.getAttributesMetadata(entityLogicalName, ['LogicalName', 'RequiredLevel']);
        return rawAttributesMetadatas
            .filter((attrMetadata: {RequiredLevel: {Value: string}}) => attrMetadata.RequiredLevel.Value === 'ApplicationRequired')
            .map((requiredAttributeMetadata: {LogicalName: string}) => requiredAttributeMetadata.LogicalName);
    }
}
