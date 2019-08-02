// @ts-ignore
import i18next from 'i18next';
// @ts-ignore
import XHR from 'i18next-xhr-backend';

export class Translation {
    static init(options = <{relativePath: string, fileExtension?: string}>{relativePath: null, fileExtension: null}): Promise<void> {
        const globalContext = Xrm.Utility.getGlobalContext(),
            lng = globalContext.userSettings.languageId.toString();
        return new Promise((resolve, reject) => {
            if (!options.relativePath) {
                reject(`Please specify relativePath like 'new_'`);
                return;
            }
            i18next
                .use(XHR)
                .init({
                    lng: lng,
                    fallbackLng: '1033',
                    backend: {
                        loadPath: this.getLoadPath(options.relativePath, options.fileExtension)
                    }
                }, (err: string[], t: any) => {
                    if (err) {
                        console.log(err.join('/n'));
                    }
                    resolve();
                });
        });
    }

    static getLoadPath(relativePath = '', fileExtension = 'json') {
        // @ts-ignore
        const resourceVersion = window.top.WEB_RESOURCE_ORG_VERSION_NUMBER || '',
            globalContext = Xrm.Utility.getGlobalContext(),
            clientUrl = globalContext.getClientUrl();
        let path = relativePath;
        path = path.startsWith('.') ? path.substr(1) : path;
        path = !path.startsWith('/') ? `/${path}` : path;
        return `${clientUrl}/${resourceVersion}/WebResources/${path}/{{lng}}.${fileExtension}`;
    }

    static translate(text: string, options?: any): string {
        return i18next.t(text, options);
    }

    static translateArray(text: string | Array<string>, options?: any): Array<string> {
        if (text instanceof Array) {
            const translations: any = [];
            for (const txt of text) {
                translations.push(Translation.translate(txt, options));
            }
            return translations;
        } else {
            return [i18next.t(text, options)];
        }
    }
}
