/* eslint-disable @typescript-eslint/no-unused-vars  */

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
    'createdby@Microsoft.Dynamics.CRM.associatednavigationproperty'?: string;
    'createdby@Microsoft.Dynamics.CRM.lookuplogicalname'?: string;
    'createdby@OData.Community.Display.V1.FormattedValue'?: string;
    createdonbehalfby?: string | Model; // SystemuserModel
    'createdonbehalfby@Microsoft.Dynamics.CRM.associatednavigationproperty'?: string;
    'createdonbehalfby@Microsoft.Dynamics.CRM.lookuplogicalname'?: string;
    'createdonbehalfby@OData.Community.Display.V1.FormattedValue'?: string;
    modifiedby?: string | Model; // SystemuserModel
    'modifiedby@Microsoft.Dynamics.CRM.associatednavigationproperty'?: string;
    'modifiedby@Microsoft.Dynamics.CRM.lookuplogicalname'?: string;
    'modifiedby@OData.Community.Display.V1.FormattedValue'?: string;
    modifiedonbehalfby?: string | Model; // SystemuserModel
    'modifiedonbehalfby@Microsoft.Dynamics.CRM.associatednavigationproperty'?: string;
    'modifiedonbehalfby@Microsoft.Dynamics.CRM.lookuplogicalname'?: string;
    'modifiedonbehalfby@OData.Community.Display.V1.FormattedValue'?: string;
    owninguser?: string | Model; // SystemuserModel
    'owninguser@Microsoft.Dynamics.CRM.associatednavigationproperty'?: string;
    'owninguser@Microsoft.Dynamics.CRM.lookuplogicalname'?: string;
    'owninguser@OData.Community.Display.V1.FormattedValue'?: string;
    owningteam?: string | Model; // TeamModel
    'owningteam@Microsoft.Dynamics.CRM.associatednavigationproperty'?: string;
    'owningteam@Microsoft.Dynamics.CRM.lookuplogicalname'?: string;
    'owningteam@OData.Community.Display.V1.FormattedValue'?: string;
    ownerid?: string | Model; // OwnerModel
    'ownerid@Microsoft.Dynamics.CRM.associatednavigationproperty'?: string;
    'ownerid@Microsoft.Dynamics.CRM.lookuplogicalname'?: string;
    'ownerid@OData.Community.Display.V1.FormattedValue'?: string;
    owningbusinessunit?: string | Model; // BusinessunitModel
    'owningbusinessunit@Microsoft.Dynamics.CRM.associatednavigationproperty'?: string;
    'owningbusinessunit@Microsoft.Dynamics.CRM.lookuplogicalname'?: string;
    'owningbusinessunit@OData.Community.Display.V1.FormattedValue'?: string;
}

type ValidationCategory = 'Mandatory' | 'Invalid key';

interface ModelValidation {
    isValid: boolean;
    attribute?: string;
    category?: ValidationCategory;
}

/* eslint-enable @typescript-eslint/no-unused-vars  */
