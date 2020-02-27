
export interface CrmJson {
    crm: {
        version: string;
        publisher_prefix: string;
        solution_name: string;
        url: string;
    };
    adal: {
        clientId: string;
        redirectUri: string;
    };
}
