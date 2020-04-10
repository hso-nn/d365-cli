import crmJson from '../../tools/crm.json';
import {TranslationI18n} from './TranslationI18n';

export class Translation {
    public static translate(text: string): string {
        if (crmJson.webresource.translation === 'i18n') {
            return TranslationI18n.translate(text);
        } else {
            try {
                const relativePath = `${crmJson.crm.publisher_prefix}_/${(crmJson).webresource.namespace}/locales`;
                return Xrm.Utility.getResourceString(`${relativePath}/locales`, text);
            } catch (e) {
                console.log('You probably miss resx dependencies on your javascript file. Please read https://github.com/hso-nn/d365-cli/wiki/Translations');
                throw e;
            }
        }
    }

    public static translateArray(text: string | Array<string>): Array<string> {
        if (text instanceof Array) {
            const translations: string[] = [];
            for (const txt of text) {
                translations.push(Translation.translate(txt));
            }
            return translations;
        } else {
            return [Translation.translate(text)];
        }
    }
}
