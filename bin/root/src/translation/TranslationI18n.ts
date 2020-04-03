import i18next from 'i18next';
import crmJson from '../../deploy/crm.json';

declare interface Resources {
    [index: string]: {translation: {[index: string]: string}};
}

export class TranslationI18n {
    private static initialized = false;

    private static init(): void {
        if (!this.initialized) {
            const globalContext = Xrm.Utility.getGlobalContext(),
                lng = globalContext.userSettings.languageId.toString(),
                resources = TranslationI18n.getResources();
            i18next.init({
                lng: lng,
                resources: resources,
                fallbackLng: '1033',
            });
        }
    }

    private static getResources(): Resources {
        const globalContext = Xrm.Utility.getGlobalContext(),
            lng = globalContext.userSettings.languageId.toString(),
            resources: Resources = {},
            translation = TranslationI18n.getTranslation(lng);
        if (translation) {
            resources[lng] = translation;
        }
        if (lng !== '1033') {
            resources['1033'] = TranslationI18n.getTranslation('1033');
        }
        return resources;
    }

    private static getTranslation(languageId: string): {translation: {}} {
        const resource = TranslationI18n.requestTranslationFile(languageId);
        if (resource) {
            return {translation: resource};
        }
    }

    public static translate(text: string, options?: i18next.TOptions | string): string {
        TranslationI18n.init();
        return i18next.t(text, options);
    }

    private static async requestTranslationFile(languageId: string): Promise<JSON> {
        return new Promise((resolve): void => {
            const globalContext = Xrm.Utility.getGlobalContext(),
                clientUrl = globalContext.getClientUrl(),
                relativePath = `${crmJson.crm.publisher_prefix}_/${(crmJson).webresource.namespace}/locales/`,
                uri = `${clientUrl}/webresources/${relativePath}/${languageId}.json`,
                request = new XMLHttpRequest();
            request.open('GET', encodeURI(uri), false);
            request.onreadystatechange = function (): void {
                if (this.readyState === 4) {
                    request.onreadystatechange = null;
                    if ([200, 201, 204].includes(this.status)) {
                        if (this.status !== 204) {
                            console.warn('Translation: your cache is disabled or dependencies not set on CE webresource.');
                        }
                        resolve(JSON.parse(request.response));
                    } else {
                        resolve();
                    }
                }
            };
            request.send();
        });
    }
}
