
export interface CrmJson {
    crm: {
        version: string;
        publisher_prefix: string;
        url: string;
        namespace: string;
    };
    adal: {
        clientId: string;
        redirectUri: string;
        tenant: string;
    };
    version: string;
}
