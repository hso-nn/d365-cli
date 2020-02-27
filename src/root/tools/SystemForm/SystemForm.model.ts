import {Model} from '../../../../bin/root/src/WebApi/Model';

export interface SystemFormModel extends Model {
    formid?: string;
    description?: string;
    iscustomizable?: {
        Value: boolean;
        CanBeChanged: boolean;
    };
    canbedeleted?: {
        Value: boolean;
        CanBeChanged: boolean;
    };
    ismanaged?: boolean;
    name?: string;
    objecttypecode?: string;
}
