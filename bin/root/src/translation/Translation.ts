// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import i18next from 'i18next';

declare interface Resources {
    [index: string]: {translation: {[index: string]: string}};
}

declare interface Options {
    relativePath: string;
    fileExtension?: string;
}

export class Translation {
    public static async init(options: Options = {relativePath: null, fileExtension: null}): Promise<void> {
        const globalContext = Xrm.Utility.getGlobalContext(),
            lng = globalContext.userSettings.languageId.toString(),
            resources = await Translation.getResources(options);
        await i18next.init({
            lng: lng,
            resources: resources,
            fallbackLng: '1033',
        });
    }

    private static async getResources(options: Options): Promise<Resources> {
        const globalContext = Xrm.Utility.getGlobalContext(),
            lng = globalContext.userSettings.languageId.toString(),
            resources: Resources = {},
            translation = await Translation.getTranslation(lng, options);
        if (translation) {
            resources[lng] = translation;
        }
        if (lng !== '1033') {
            resources['1033'] = await Translation.getTranslation('1033', options);
        }
        return resources;
    }

    private static async getTranslation(languageId: string, options: Options): Promise<{translation: {}}> {
        const resource = await Translation.requestTranslationFile(languageId, options);
        if (resource) {
            return {translation: resource};
        }
    }

    public static translate(text: string, options?: i18next.TOptions | string): string {
        return i18next.t(text, options);
    }

    public static translateArray(text: string | Array<string>, options?: i18next.TOptions | string): Array<string> {
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

    private static async requestTranslationFile(languageId: string, options: Options): Promise<JSON> {
        return new Promise((resolve): void => {
            const globalContext = Xrm.Utility.getGlobalContext(),
                clientUrl = globalContext.getClientUrl(),
                uri = `${clientUrl}/webresources/${options.relativePath}/${languageId}.json`,
                request = new XMLHttpRequest();
            request.open('GET', encodeURI(uri), true);
            /*for (const header in WebApi.defaultHeaders) {
                if (WebApi.defaultHeaders.hasOwnProperty(header)) {
                    request.setRequestHeader(header, WebApi.defaultHeaders[header]);
                }
            }*/
            request.onreadystatechange = function (): void {
                if (this.readyState === 4) {
                    request.onreadystatechange = null;
                    if ([200, 201, 204].includes(this.status)) {
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
