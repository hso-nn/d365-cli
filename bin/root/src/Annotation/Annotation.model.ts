
interface AnnotationModel extends Model {
    annotationid?: string;
    documentbody?: string;
    filename?: string;
    mimetype?: string;
    notetext?: string;
    objectid?: {
        id: string;
        logicalName: string;
    };
    subject?: string;
}
