
interface Model {
    //Attributes for $select
    statecode?: number;
    owneridname?: string;
    importsequencenumber?: number;
    utcconversiontimezonecode?: number;
    modifiedbyname?: string;
    timezoneruleversionnumber?: number;
    modifiedon?: string;
    statuscode?: number;
    createdbyname?: string;
    createdon?: string;
    createdonbehalfbyname?: string;
    modifiedonbehalfbyname?: string;
    versionnumber?: number;
    overriddencreatedon?: string;

    // Attributes/NavigationProperties for $select and $expand
    createdby?: string | Model; // SystemuserModel
    createdonbehalfby?: string | Model; // SystemuserModel
    modifiedby?: string | Model; // SystemuserModel
    modifiedonbehalfby?: string | Model; // SystemuserModel
    owninguser?: string | Model; // SystemuserModel
    owningteam?: string | Model; // TeamModel
    ownerid?: string | Model; // OwnerModel
    owningbusinessunit?: string | Model; // BusinessunitModel
}

type ValidationCategory = 'Mandatory' | 'Invalid key';

interface ModelValidation {
    isValid: boolean;
    attribute?: string;
    category?: ValidationCategory;
}
