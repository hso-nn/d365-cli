import * as shell from 'shelljs';
import * as fs from 'fs';
import cp from 'child_process';
// import {NodeApi} from '../root/tools/NodeApi/NodeApi';
import {SystemFormService} from '../root/tools/SystemForm/SystemForm.service';
import {SolutionService} from '../root/tools/Solution/Solution.service';
import {SolutionComponentService} from '../root/tools/SolutionComponent/SolutionComponent.service';
import {SystemFormModel} from '../root/tools/SystemForm/SystemForm.model';
import {ControlFormContext} from './ControlFormContext';
// import colors from 'colors';
import {Variables} from '../Variables';
import {CrmJson} from '../root/tools/CrmJson';

export class Form {
    private readonly bearer: string;
    private readonly entityName: string;
    private readonly entityLogicalName: string;
    private readonly log: (message: string) => Promise<void>;

    constructor(bearer: string, entityName: string, entityLogicalName: string, log: (message: string) => Promise<void>) {
        this.bearer = bearer;
        this.entityName = entityName;
        this.entityLogicalName = entityLogicalName;
        this.log = log;
    }

    public static async generateFormFiles(bearer: string, entityName: string, entityLogicalName: string, log: (message: string) => Promise<void>): Promise<void> {
        const form = new Form(bearer, entityName, entityLogicalName, log);
        await form.writeFormFiles();
    }

    private async writeFormFiles(): Promise<void> {
        const systemForms = await this.getSystemForms();
        for (const systemForm of systemForms) {
            const folderName = systemForm.name.replace(/\W/g, '');
            const folderPath = `src/${this.entityName}/${folderName}`;
            if (!shell.test('-d', folderPath)) {
                shell.mkdir(folderPath);
                await this.addEntityFiles(systemForm);
                await this.updateBuildFile(systemForm);
            } else {
                // console.log(colors.green(`${this.entityName}/${folderName} already exist`));
                await this.log(`<span style="color:green">${this.entityName}/${folderName} already exist</span>`);
            }
            await ControlFormContext.generateFormContext(this.bearer, this.entityName, this.entityLogicalName, async (message: string) => this.log(message), systemForm);
        }
    }

    private async addEntityFiles(systemForm: SystemFormModel): Promise<void> {
        await this.addEntityFile(systemForm);
        await this.addEntityFormFile(systemForm);
    }

    private async addEntityFile(systemForm: SystemFormModel): Promise<void> {
        const formName = systemForm.name.replace(/\W/g, '');
        await this.log(`Adding ${this.entityName}/${formName}/${formName}.ts`);
        const filepath = `src/${this.entityName}/${formName}/${formName}.ts`;
        const {publisher, namespace} = await Variables.get();
        shell.cp('-r', `${__dirname}/Entity/Entity.ts`, filepath);
        shell.sed('-i', new RegExp('Entity', 'g'), formName, filepath);
        shell.sed('-i', new RegExp('<%= publisher %>', 'ig'), publisher, filepath);
        shell.sed('-i', new RegExp('<%= namespace %>', 'ig'), namespace, filepath);
        shell.sed('-i', new RegExp('<%= formname %>', 'ig'), systemForm.name, filepath);
        shell.sed('-i', new RegExp('<%= entity %>', 'ig'), this.entityName, filepath);
        // shell.exec(`git add ${filepath}`);
        cp.execFileSync('git', ['add', filepath]);
        await this.log(`Added ${this.entityName}/${formName}/${formName}.ts`);
    }

    private async addEntityFormFile(systemForm: SystemFormModel): Promise<void> {
        const formName = systemForm.name.replace(/\W/g, '');
        await this.log(`Adding ${this.entityName}/${formName}/${formName}.form.ts`);
        const filepath = `src/${this.entityName}/${formName}/${formName}.form.ts`;
        shell.cp('-r', `${__dirname}/Entity/Entity.form.ts`, filepath);
        shell.sed('-i', new RegExp('Entity', 'g'), formName, filepath);
        // shell.exec(`git add ${filepath}`);
        cp.execFileSync('git', ['add', filepath]);
        await this.log(`Added ${this.entityName}/${formName}/${formName}.form.ts`);
    }

    private async updateBuildFile(systemForm: SystemFormModel): Promise<void> {
        const formName = systemForm.name.replace(/\W/g, '');
        await this.log(`Updating ${this.entityName}/build.json`);
        const filepath = `src/${this.entityName}/build.json`;
        const buildJsonString = String(fs.readFileSync(filepath));
        const buildJson = JSON.parse(buildJsonString);
        if (!buildJson.forms.find((form: {name: string}) => form.name === formName)) {
            buildJson.forms.push({
                name: formName,
                build: true
            });
            shell.ShellString(JSON.stringify(buildJson, null, 2)).to(filepath);
            // shell.exec(`git add ${filepath}`);
            cp.execFileSync('git', ['add', filepath]);
        }
        await this.log(`Updated ${this.entityName}/build.json`);
    }

    private async getSystemForms(): Promise<SystemFormModel[]> {
        const systemForms: SystemFormModel[] = [];
        const settings: CrmJson = JSON.parse(fs.readFileSync('tools/crm.json', 'utf8'));
        const {solution_name_generate} = settings.crm;
        const solution = await SolutionService.getSolution(solution_name_generate, ['solutionid'], this.bearer);
        const solutionComponents = await SolutionComponentService.retrieveMultipleRecords({
            select: ['objectid'],
            filters: [{
                conditions: [{
                    attribute: '_solutionid_value',
                    value: solution.solutionid
                }]
            }, {
                type: 'or',
                conditions: [{
                    attribute: 'componenttype',
                    value: 24
                }, {
                    attribute: 'componenttype',
                    value: 60
                }]
            }]
        }, this.bearer);
        for (const solutionComponent of solutionComponents) {
            const systemForm = await SystemFormService.getSystemForm(solutionComponent.objectid, ['objecttypecode', 'name', 'formjson'], this.bearer);
            if (systemForm.objecttypecode === this.entityLogicalName) {
                systemForms.push(systemForm);
                await this.log(`<span style="color:blue;">Form '${systemForm.name}' found</span>`);
            }
        }
        return systemForms;
    }
}
