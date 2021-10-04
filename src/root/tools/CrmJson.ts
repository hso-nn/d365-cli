
export type TranslationType = 'resx' | 'i18n';

export interface CrmJson {
    crm: {
        version: string;
        publisher_prefix: string;
        solution_name_deploy: string;
        solution_name_generate: string;
        url: string;
    };
    webresource: {
        namespace: string;
        translation: TranslationType;
    };
    adal: {
        clientId: string;
        redirectUri: string;
        tenant: string;
    };
}
