import {Model} from '../../../../bin/root/src/WebApi/Model';

export interface SolutionModel extends Model {
    solutionid?: string;
    solutiontype?: string;
    friendlyname?: string;
    version?: string;
}
