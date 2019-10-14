import {Model} from '../WebApi/Model';

// Please add Entity fields here, which are (to be) used in code
// Please add NavigationProperties here, referring to another model, which are (to be) used in code
export interface EntityModel extends Model {
    EntityLogicalNameid?: string;
}
