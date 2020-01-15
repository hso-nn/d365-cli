import {WebApi} from '../WebApi/WebApi';
import {Model} from '../WebApi/Model';

interface CloneModel extends Model {
    [index: string]: string | number;
}

export class ModelClone {
    public static async retrieveRecord(entityLogicalName: string, id: string): Promise<Model> {
        const origEntity = await Xrm.WebApi.retrieveRecord(entityLogicalName, id),
            entity = ModelClone.parseCloneModel(origEntity),
            metadata = await Xrm.Utility.getEntityMetadata(entityLogicalName, Object.keys(entity));
        ModelClone.cleanCloneModel(entity, metadata);
        return WebApi.populateBindings(entity, metadata);
    }

    private static cleanCloneModel(model: CloneModel, metadata: Xrm.Metadata.EntityMetadata): void {
        delete model[metadata.PrimaryIdAttribute];
        delete model.statuscode;
        delete model.statecode;

        delete model.ownerid;
        delete model['_ownerid_value@Microsoft.Dynamics.CRM.lookuplogicalname'];
        // delete model.modifiedon;
        // delete model.createdon;
        // delete model.versionnumber;
    }

    private static parseCloneModel(model: CloneModel): CloneModel {
        const keys = Object.keys(model),
            cleanModel = {...model};
        for (const key of keys) {
            if (cleanModel[key] === null) {
                delete cleanModel[key];
            } else if (key.startsWith('@')) {
                delete cleanModel[key];
            } else if (key.endsWith('FormattedValue')) {
                delete cleanModel[key];
            } else if (key.startsWith('_') && key.endsWith('_value') && !key.includes('@')) {
                const navigationProperty = cleanModel[`${key}@Microsoft.Dynamics.CRM.associatednavigationproperty`];
                if (navigationProperty) {
                    cleanModel[key.substr(1, key.length - 7)] = cleanModel[key];
                    delete cleanModel[`${key}@Microsoft.Dynamics.CRM.associatednavigationproperty`];
                } else {
                    delete cleanModel[`${key}@Microsoft.Dynamics.CRM.lookuplogicalname`];
                }
                delete cleanModel[key];
            }
        }
        return cleanModel;
    }
}
