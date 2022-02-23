
export interface CrmJson {
    crm: {
        version: string;
        publisher_prefix: string;
        url: string;
        namespace: string;
    };
    msal: {
        clientId: string;
        redirectUri: string;
        tenant: string;
    };
    version: string;
}
