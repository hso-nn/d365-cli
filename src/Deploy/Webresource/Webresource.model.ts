import {Model} from '../../../bin/root/src/WebApi/Model';

export interface WebresourceModel extends Model {
    webresourceid?: string;
    name?: string;
    webresourcetype?: number;
    content?: string;
    displayname?: string;
    solutionid?: string;
}
