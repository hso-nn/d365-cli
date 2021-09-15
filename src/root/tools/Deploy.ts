import * as fs from 'fs';
import {WebresourceService} from './Webresource/Webresource.service';
import {WebresourceModel} from './Webresource/Webresource.model';
import {AdalRouter} from './AdalRouter';
import * as crypto from 'crypto';
import * as xml2js from 'xml2js';
import * as shell from 'shelljs';
import * as colors from 'colors';

interface LibraryItem {
    name: string;
    displayName: string;
    languagecode?: string;
    description?: string;
    libraryUniqueId?: string;
}

interface XmlDoc {
    Dependencies: {
        Dependency: {
            $: {
                componentType: string; // WebResource
            };
            Library: {
                $: LibraryItem;
            }[];
        }[];
    };
}

export class Deploy extends AdalRouter {
    public static async deployProject(force: boolean): Promise<void> {
        if (process.argv[4]) {
            console.log(colors.red(`No spaces allowed after update command!`));
        } else {
            new Deploy(force);
        }
    }

    private md5 = (contents: string): string => crypto.createHash('md5').update(contents).digest('hex');
    private force: boolean;

    constructor(force: boolean) {
        super();
        this.force = force;
    }

    protected onAuthenticated(): Promise<void> {
        return this.deploy();
    }

    private async deploy(): Promise<void> {
        const {publisher_prefix, url} = this.settings.crm;
        this.log(`Deploying to ${url}...<br/>`);
        await this.deployDirectory(`dist/${publisher_prefix}_`);
        this.log('Deploy finished');
    }

    private async deployDirectory(directory: string): Promise<void> {
        return new Promise((resolve): void => {
            fs.readdir(directory, async (err: Error, files: string[]) => {
                const promises = [];
                for (const file of files) {
                    const path = `${directory}/${file}`,
                        stats = fs.lstatSync(path);
                    if (stats.isDirectory()) {
                        promises.push(await this.deployDirectory(path));
                    } else {
                        promises.push(await this.deployFile(path));
                    }
                }
                Promise.all(promises).then(() => {
                    resolve();
                });
            });
        });
    }

    private async deployFile(filepath: string): Promise<void> {
        const crmPath = filepath.substr(5),
            webresource = await this.getWebresource(crmPath);
        this.log(`${crmPath}`);
        if (webresource) {
            await this.updateWebresource(webresource, filepath);
        } else {
            await this.insertWebresource(filepath, crmPath);
        }
    }

    private async updateWebresource(webresource: WebresourceModel, filepath: string): Promise<void> {
        const md5Orig = this.md5(webresource.content),
            data = fs.readFileSync(filepath),
            base64 = data.toString('base64'),
            dependencyXML = await this.generateDependencyXML(filepath, webresource, data),
            md5New = this.md5(base64);
        if (this.force || md5Orig !== md5New || dependencyXML && dependencyXML !== webresource?.dependencyxml) {
            webresource.content = base64;
            webresource.dependencyxml = dependencyXML;
            try {
                await WebresourceService.upsert(webresource, this.bearer);
                this.log(` updated...`);
                await WebresourceService.publish(webresource, this.bearer);
                this.log(` and published<br/>`);
            } catch (e) {
                this.log(` failed ${e.message}<br/>`);
            }
        } else {
            this.log(` unmodified<br/>`);
        }
    }

    private async insertWebresource(filepath: string, path: string): Promise<WebresourceModel> {
        const data = fs.readFileSync(filepath),
            base64 = data.toString('base64');
        try {
            const solutionUniqueName = this.settings.crm.solution_name,
                webresourceModel: WebresourceModel = {
                    content: base64,
                    name: path,
                    displayname: path
                },
                dependencyXML = await this.generateDependencyXML(filepath, webresourceModel, data);
            if (dependencyXML) {
                webresourceModel.dependencyxml = dependencyXML;
            }
            const webresource = await WebresourceService.upsert(webresourceModel, this.bearer);
            this.log(` inserted...`);
            await WebresourceService.addToSolution(webresource, solutionUniqueName, this.bearer);
            this.log(` and added to solution ${solutionUniqueName}<br/>`);
            return webresource;
        } catch (e) {
            this.log(` failed ${e.message}<br/>`);
        }
    }

    private async getWebresource(path: string): Promise<WebresourceModel> {
        const webresources = await WebresourceService.retrieveMultipleRecords({
            select: ['name', 'webresourcetype', 'content', 'displayname', 'solutionid', 'dependencyxml'],
            filters: [{
                conditions: [{
                    attribute: 'name',
                    value: path
                }]
            }],
            top: 1
        }, this.bearer);
        return webresources[0];
    }

    // Small wrapper method for future support of other extensions, etc
    private async generateDependencyXML(filepath: string, webresource: WebresourceModel, data: Buffer): Promise<string> {
        if (webresource.name.endsWith('.js')) {
            const dependencyXML = await this.getDependencyXML(webresource, data);
            return dependencyXML;
        } else if (webresource.name.endsWith('.html')) {
            const scriptPath = filepath.replace(/.html/g, '.js');
            if (fs.existsSync(scriptPath)) {
                const jsData = fs.readFileSync(scriptPath);
                const dependencyXML = await this.getDependencyXML(webresource, jsData);
                return dependencyXML;
            } else {
                console.log(`script file: ${scriptPath} does not exist`);
            }
        }
    }

    private static xmlBuilder = new xml2js.Builder();
    private static get xmlRegex(): RegExp {
        return /(\s?\n+\s+|\n)/g;
    }

    private async getDependencyXML(webresource: WebresourceModel, data: Buffer): Promise<string> {
        const xmlDoc = await this.generateWebresourceXmlDoc(webresource, data);
        const xml = Deploy.xmlBuilder.buildObject(xmlDoc);
        let trimmedXml = xml.replace(Deploy.xmlRegex, '');
        const index = trimmedXml.indexOf('?>');
        trimmedXml = trimmedXml.substr(index + 2);
        return trimmedXml;
    }

    private static get defaultDependencyxml(): string {
        return `<Dependencies><Dependency componentType="WebResource"></Dependency></Dependencies>`;
    }

    private static get translationRegex(): RegExp {
        return /\.translate\(["'](.*)["']\)/gm;
    }

    private async generateWebresourceXmlDoc(webresource: WebresourceModel, data: Buffer): Promise<XmlDoc> {
        const resxPaths = shell.ls(`dist/**/locales/*.resx`),
            jsonPaths = shell.ls(`dist/**/locales/*.json`),
            filepaths = resxPaths.concat(jsonPaths).map(filepath => filepath.substr(5)); // remove 'dist/'
        if (filepaths.length === 0 && webresource.dependencyxml === null) {
            return null;
        }
        const xmlDoc: XmlDoc = await xml2js.parseStringPromise(webresource.dependencyxml || Deploy.defaultDependencyxml),
            hasTranslation = Deploy.translationRegex.test(String(data));
        if (hasTranslation) {
            this.addLibraries(xmlDoc, filepaths);
            this.cleanLibraries(xmlDoc, filepaths);
        } else {
            this.cleanLibraries(xmlDoc);
        }
        return xmlDoc;
    }

    private addLibraries(xmlDoc: XmlDoc, filepaths: string[]): void {
        const dependency = xmlDoc.Dependencies.Dependency[0];
        if (!dependency.Library) {
            dependency.Library = [];
        }
        for (const filepath of filepaths) {
            const library = dependency.Library.find(library => library.$.name === filepath);
            if (!library) {
                this.log(`Adding dependency: ${filepath}`);
                dependency.Library.push({
                    $: Deploy.createLibraryItem(filepath)
                });
            }
        }
    }

    private static get localesResxRegex(): RegExp {
        return /locales\/locales(\.)?(\d{4})?\.resx/gm;
    }

    private static get localesJsonRegex(): RegExp {
        return /locales\/(\d{4})\.json/gm;
    }

    private cleanLibraries(xmlDoc: XmlDoc, keepFilepaths: string[] = []): void {
        const dependency = xmlDoc.Dependencies.Dependency[0];
        if (!dependency.Library) {
            return;
        }
        for (let i = dependency.Library.length - 1; i >= 0; i -= 1) {
            const library = dependency.Library[i],
                name = library.$.name;
            if (Deploy.localesResxRegex.test(name) || Deploy.localesJsonRegex.test(name)) {
                if (!keepFilepaths.includes(name)) {
                    this.log(`Removing dependency: ${name}`);
                    dependency.Library.splice(i, 1);
                }
            }
        }
    }

    private static createLibraryItem(filepath: string): LibraryItem {
        return {
            name: filepath,
            displayName: filepath,
            languagecode: Deploy.getLanguageCode(filepath),
            description: '',
            libraryUniqueId: Deploy.guid()
        };
    }

    private static getLanguageCode(filepath: string): string {
        let match;
        if (filepath.endsWith('.resx')) {
            match = Deploy.localesResxRegex.exec(filepath);
        } else if(filepath.endsWith('.json')) {
            match = Deploy.localesJsonRegex.exec(filepath);
        }
        return match && match[1] || '';
    }

    private static guid(): string {
        return '{xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx}'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}
// new Deploy();
