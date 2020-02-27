import * as fs from 'fs';
import {WebresourceService} from './Webresource/Webresource.service';
import {WebresourceModel} from './Webresource/Webresource.model';
import {AdalRouter} from './AdalRouter';
import * as crypto from 'crypto';

class Deploy extends AdalRouter {
    private md5 = (contents: string): string => crypto.createHash('md5').update(contents).digest('hex');

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

    private async deployFile(path: string): Promise<void> {
        return new Promise((resolve): void => {
            fs.readFile(path, async (err: Error, data: Buffer) => {
                const crmPath = path.substr(5),
                    webresource = await this.getWebresource(crmPath);
                this.log(`${crmPath}`);
                if (webresource) {
                    await this.updateWebresource(webresource, data);
                } else {
                    await this.insertWebresource(data, crmPath);
                }
                resolve();
            });
        });
    }

    private async updateWebresource(webresource: WebresourceModel, data: Buffer): Promise<void> {
        const md5Orig = this.md5(webresource.content),
            base64 = data.toString('base64'),
            md5New = this.md5(base64);
        if (md5Orig !== md5New) {
            webresource.content = base64;
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

    private async insertWebresource(data: Buffer, path: string): Promise<WebresourceModel> {
        const base64 = data.toString('base64');
        try {
            const solutionUniqueName = this.settings.crm.solution_name,
                webresource = await WebresourceService.upsert({
                    content: base64,
                    name: path,
                    displayname: path
                }, this.bearer);
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
            select: ['name', 'webresourcetype', 'content', 'displayname', 'solutionid'],
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
}
new Deploy().express;
