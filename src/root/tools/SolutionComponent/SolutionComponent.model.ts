import {Model} from '../../../../bin/root/src/WebApi/Model';

export interface SolutionComponentModel extends Model {
    solutioncomponentid?: string;
    objectid?: string;
    componenttype?: string;
    _solutionid_value?: string;
}