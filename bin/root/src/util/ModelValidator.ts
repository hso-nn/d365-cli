import {Model} from '../WebApi/Model';
import {WebApi} from '../WebApi/WebApi';

type ValidationCategory = 'Mandatory' | 'Invalid key';

export interface ModelValidation {
    isValid: boolean;
    attribute?: string;
    category?: ValidationCategory;
}

export class ModelValidator {
    public static async validateRecord(entityLogicalName: string, model: Model): Promise<ModelValidation> {
        let validation = await ModelValidator.validateRequiredAttributes(entityLogicalName, model);
        if (validation.isValid) {
            validation = await ModelValidator.validateMesh(entityLogicalName, model);
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
        const requiredAttributeLogicalNames = await ModelValidator.getRequiredAttributeLogicalNames(entityLogicalName),
            filteredAttributeMetadatas = await Xrm.Utility.getEntityMetadata(entityLogicalName, requiredAttributeLogicalNames),
            keys = Object.keys(model);
        for (const name of requiredAttributeLogicalNames) {
            const attributeDescriptor = ModelValidator.getAttributeDescriptor(name, filteredAttributeMetadatas),
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
