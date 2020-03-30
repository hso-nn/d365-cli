
type Translation = 'i18n' | 'resx';

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
    webresource: {
        namespace: string;
        translation: Translation;
    };
}
