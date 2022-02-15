
type ComponentType = 'WebResource';

interface Library {
    name: string;
    displayName: string;
    languagecode?: string;
    description?: string;
    libraryUniqueId?: string;
}

export interface Dependency {
    componentType: ComponentType;
    library: Library[];
}

// https://docs.microsoft.com/en-us/dynamics365/customer-engagement/web-api/webresource?view=dynamics-ce-odata-9
export interface WebresourceModel extends Model {
    webresourceid?: string;
    name?: string;
    webresourcetype?: number;
    content?: string;
    displayname?: string;
    solutionid?: string;
    dependencyxml?: string;
}
