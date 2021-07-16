import * as shell from 'shelljs';
import * as fs from 'fs';
import * as xml2js from 'xml2js';

interface XmlItem {
    $: {
        name: string;
        'xml-space': string;
    };
    value: string[];
}

interface XmlDoc {
    root: {
        data: [XmlItem];
    };
}

export class Resx {
    public static async extract(): Promise<void> {
        const codeKeys = Resx.getCodeKeys();
        if (codeKeys.length > 0) {
            Resx.addLocalesFile();
        }
        await Resx.processCodeKeys((codeKeys));
        return null;
    }

    private static regex = /Translation\.translate\([\s]*([']([^']*)[']|[`]([^`]*)[`]|["]([^"]*)["])[\s]*\)/gm;

    private static getCodeKeys(): string[] {
        const keys = new Set<string>();
        const filepaths = shell.ls(`src/**/*.ts*`);
        for (const filepath of filepaths) {
            const filedata = String(fs.readFileSync(filepath));
            let match = null;
            while ((match = Resx.regex.exec(filedata)) !== null) {
                if (match.index === Resx.regex.lastIndex) {
                    Resx.regex.lastIndex += 1;
                }
                keys.add(match[2] || match[3] || match[4]);
            }
        }
        return Array.from(keys.values());
    }

    private static addLocalesFile(): void {
        if (!shell.test('-d', 'src/translation/locales')) {
            shell.mkdir(`src/translation/locales`);
        }
        if (!shell.test('-f', 'src/translation/locales/locales.resx')) {
            shell.cp('-R', `${__dirname}/Translation/locales.resx`, './src/translation/locales');
            shell.exec('git add src/translation/locales/locales.resx');
        }
        if (!shell.test('-f', 'src/translation/locales/locales.1033.resx')) {
            shell.cp('-r', `${__dirname}/Translation/locales.resx`, './src/translation/locales/locales.1033.resx');
            shell.exec('git add src/translation/locales/locales.1033.resx');
        }
    }

    private static async processCodeKeys(codeKeys: string[]): Promise<void> {
        const resxpaths = shell.ls(`src/translation/locales/*.resx`);
        for (const resxpath of resxpaths) {
            // console.log(`File: ${resxpath}`);
            const xmlDoc = await Resx.getResxDocument(resxpath); // 'src/translation/locales/locales.resx'
            Resx.processXmlDoc(xmlDoc, codeKeys);
            Resx.writeXmlDoc(xmlDoc, resxpath);
        }
    }

    private static getResxDocument(filepath: string): Promise<XmlDoc> {
        const filedata = String(fs.readFileSync(filepath));
        return xml2js.parseStringPromise(filedata);
    }

    private static processXmlDoc(xmlDoc: XmlDoc, codeKeys: string[]): void {
        const resxKeys = xmlDoc.root.data.map((item: XmlItem) => item.$.name);
        for (const resxKey of resxKeys) {
            if (!codeKeys.includes(resxKey)) {
                const xmlItem = xmlDoc.root.data.find(item => item.$.name === resxKey),
                    index = xmlDoc.root.data.indexOf(xmlItem);
                xmlDoc.root.data.splice(index, 1);
                console.log(`remove ${resxKey}`);
            }
        }
        for (const codeKey of codeKeys) {
            if (!resxKeys.includes(codeKey)) {
                xmlDoc.root.data.push({
                    $: {
                        name: codeKey,
                        'xml-space': 'preserve'
                    },
                    value: [codeKey]
                });
                console.log(`add ${codeKey}`);
            }
        }
        // console.log(xmlDoc);
        // console.log(xmlDoc.root.data);
    }

    private static writeXmlDoc(xmlDoc: XmlDoc, resxpath: string): void {
        const builder = new xml2js.Builder();
        const xml = builder.buildObject(xmlDoc);
        // console.log(`Xml: ${xml}`);
        shell.ShellString(xml).to(resxpath);
    }
}
