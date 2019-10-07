import {WebApi} from '../WebApi/WebApi';
import {AnnotationModel} from './Annotation.model';
import {Base64} from '../util/Base64';

export class AnnotationService {
    public static async parseAnnotation(blob: Blob, filename: string, id: string, targetEntityName: string): Promise<AnnotationModel> {
        return {
            subject: 'Generated png file based on svg',
            notetext: 'Automatic generated',
            filename: filename,
            mimetype: blob.type,
            documentbody: await Base64.decodeBlob(blob),
            objectid: {
                id: id.startsWith('{') && id.endsWith('}') ? id.substr(1, id.length - 2) : id,
                logicalName: targetEntityName
            }
        };
    }

    public static async upsertRecord(annotationModel: AnnotationModel): Promise<AnnotationModel> {
        const {id, logicalName} = annotationModel.objectid,
            annotations: AnnotationModel[] = await WebApi.retrieveMultipleRecords('annotation', {
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
}
