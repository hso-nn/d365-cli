import {WebApi} from '../WebApi/WebApi';
import {Base64} from '../util/Base64';
import {Service} from '../WebApi/Service';

export class AnnotationService {
    private static logicalName = 'annotation';

    public static async parseAnnotation(blob: Blob, filename: string, id: string, targetEntityName: string): Promise<AnnotationModel> {
        return {
            subject: '',
            notetext: '',
            filename: filename,
            mimetype: blob.type,
            documentbody: await Base64.decodeBlob(blob),
            objectid: {
                id: id.startsWith('{') && id.endsWith('}') ? id.substr(1, id.length - 2) : id,
                logicalName: targetEntityName
            }
        };
    }

    public static async retrieveMultipleRecords(multipleSystemQueryOptions: MultipleSystemQueryOptions): Promise<AnnotationModel[]> {
        return WebApi.retrieveMultipleRecords(AnnotationService.logicalName, multipleSystemQueryOptions);
    }

    public static async retrieveRecord(id: string, systemQueryOptions: SystemQueryOptions): Promise<AnnotationModel> {
        return WebApi.retrieveRecord(AnnotationService.logicalName, id, systemQueryOptions);
    }

    public static async updateRecord(id: string, entityModel: AnnotationModel): Promise<AnnotationModel> {
        return WebApi.updateRecord(AnnotationService.logicalName, id, entityModel);
    }

    public static async createRecord(entityModel: AnnotationModel): Promise<AnnotationModel> {
        return WebApi.createRecord(AnnotationService.logicalName, entityModel);
    }

    public static async upsertRecord(annotationModel: AnnotationModel): Promise<AnnotationModel> {
        const {id, logicalName} = annotationModel.objectid,
            annotations: AnnotationModel[] = await WebApi.retrieveMultipleRecords(AnnotationService.logicalName, {
                select: ['annotationid', 'objectid'],
                filters: [{
                    conditions: [{
                        attribute: 'objectid',
                        value: id
                    }, {
                        attribute: 'filename',
                        value: `${annotationModel.filename}`
                    }]
                }]
            }),
            annotation = annotations[0];
        if (annotation) {
            // eslint-disable-next-line require-atomic-updates
            annotationModel.annotationid = annotation.annotationid;
        } else {
            const binding = await AnnotationService.getBinding('objectid', id, logicalName);
            Object.assign(annotationModel, binding);
        }
        delete annotationModel.objectid;
        return WebApi.upsertRecord('annotation', annotationModel);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private static async getBinding(name: string, value: string, targetEntity: string): Promise<any> {
        // objectid_msdyn_customerasset@odata.bind
        const entityMetadata = await Xrm.Utility.getEntityMetadata(targetEntity),
            entitySetName = entityMetadata.EntitySetName,
            annotationMetadata = await Xrm.Utility.getEntityMetadata('annotation', [name]),
            manyToOneMetadata = await WebApi.getManyToOneMetadata(name, annotationMetadata, targetEntity),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data: any = {};
        const {ReferencingEntityNavigationPropertyName: navigationPropertyName} = manyToOneMetadata;
        data[`${navigationPropertyName}@odata.bind`] = `/${entitySetName}(${value})`;
        return data;
    }

    public static async count(filters?: Filter[]): Promise<number> {
        return WebApi.count(AnnotationService.logicalName, filters);
    }

    public static async retrieveClone(id: string): Promise<AnnotationModel> {
        const origRecord = await Xrm.WebApi.retrieveRecord(AnnotationService.logicalName, id);
        return Service.parseCreateModel(AnnotationService.logicalName, origRecord);
    }

    public static async validateRecord(annotationModel: AnnotationModel): Promise<ModelValidation> {
        return Service.validateRecord(AnnotationService.logicalName, annotationModel);
    }
}
