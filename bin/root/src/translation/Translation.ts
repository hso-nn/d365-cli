import i18next from 'i18next';
import XHR from 'i18next-xhr-backend';

export class Translation {
    static init(options: {relativePath: string; fileExtension?: string} = {relativePath: null, fileExtension: null}): Promise<void> {
        const globalContext = Xrm.Utility.getGlobalContext(),
            lng = globalContext.userSettings.languageId.toString();
        return new Promise((resolve, reject): void => {
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
                }, (err: string[]) => {
                    if (err) {
                        console.log(err.join('/n'));
                    }
                    resolve();
                });
        });
    }

    static getLoadPath(relativePath = '', fileExtension = 'json'): string {
        const globalContext = Xrm.Utility.getGlobalContext(),
            clientUrl = globalContext.getClientUrl();
        let path = relativePath;
        path = path.startsWith('.') ? path.substr(1) : path;
        path = !path.startsWith('/') ? `/${path}` : path;
        return `${clientUrl}/WebResources/${path}/{{lng}}.${fileExtension}`;
    }

    static translate(text: string, options?: i18next.TOptions | string): string {
        return i18next.t(text, options);
    }

    static translateArray(text: string | Array<string>, options?: i18next.TOptions | string): Array<string> {
        if (text instanceof Array) {
            const translations: string[] = [];
            for (const txt of text) {
                translations.push(Translation.translate(txt, options));
            }
            return translations;
        } else {
            return [i18next.t(text, options)];
        }
    }
}
