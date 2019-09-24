// @ts-ignore
import i18next from 'i18next';
import {WebApi} from '../WebApi/WebApi';

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
        const fileJson = await WebApi.request('GET', `${options.relativePath}/${languageId}.json`);
        if (fileJson) {
            const resource = JSON.parse(fileJson.response);
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
}
