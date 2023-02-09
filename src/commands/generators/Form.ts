import * as shell from 'shelljs';
import * as fs from 'fs';
import cp from 'child_process';
// import {NodeApi} from '../root/tools/NodeApi/NodeApi';
// import {SystemFormService} from '../../node/SystemForm/SystemForm.service';
// import {SolutionService} from '../../node/Solution/Solution.service';
// import {SolutionComponentService} from '../../node/SolutionComponent/SolutionComponent.service';
import {SystemFormModel} from '../../node/SystemForm/SystemForm.model';
import {ControlFormContext} from './ControlFormContext';
// import colors from 'colors';
// import {WebresourcesCrmJson} from '../../root/Webresources/CrmJson';
import {CrmJson} from '../../root/CrmJson';
import {SystemFormService} from '../../node/SystemForm/SystemForm.service';
import {FormTypings} from './FormTypings';
import colors from 'colors';

export class Form {
    private readonly bearer: string;
    private readonly entityName: string;
    private readonly entityLogicalName: string;

    constructor(bearer: string, entityName: string, entityLogicalName: string) {
        this.bearer = bearer;
        this.entityName = entityName;
        this.entityLogicalName = entityLogicalName;
    }

    public static async generateFormFiles(bearer: string, entityName: string, entityLogicalName: string): Promise<void> {
        const form = new Form(bearer, entityName, entityLogicalName);
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
                // console.log(`${this.entityName}/${folderName} already exist`);
            }
            await FormTypings.generate(this.bearer, this.entityName, this.entityLogicalName, systemForm);
            await ControlFormContext.generateFormContext(this.bearer, this.entityName, this.entityLogicalName, systemForm);
        }
    }

    private async addEntityFiles(systemForm: SystemFormModel): Promise<void> {
        await this.addEntityFile(systemForm);
        await this.addEntityFormFile(systemForm);
    }

    private async addEntityFile(systemForm: SystemFormModel): Promise<void> {
        const formName = systemForm.name.replace(/\W/g, '');
        console.log(`Adding ${this.entityName}/${formName}/${formName}.ts`);
        const filepath = `src/${this.entityName}/${formName}/${formName}.ts`;
        const settings: CrmJson = JSON.parse(fs.readFileSync('../crm.json', 'utf8'));
        const {namespace, publisher_prefix} = settings.crm;
        shell.cp('-r', `${__dirname}/Entity/form/Entity.ts`, filepath);
        shell.sed('-i', new RegExp('Entity', 'g'), formName, filepath);
        shell.sed('-i', new RegExp('<%= publisher %>', 'ig'), publisher_prefix, filepath);
        shell.sed('-i', new RegExp('<%= namespace %>', 'ig'), namespace, filepath);
        shell.sed('-i', new RegExp('<%= formname %>', 'ig'), systemForm.name, filepath);
        shell.sed('-i', new RegExp('<%= entity %>', 'ig'), this.entityName, filepath);
        // shell.exec(`git add ${filepath}`);
        if (shell.test('-e', '../.git')) {
            cp.execFileSync('git', ['add', filepath]);
        }
        console.log(`Added ${this.entityName}/${formName}/${formName}.ts`);
    }

    private async addEntityFormFile(systemForm: SystemFormModel): Promise<void> {
        const formName = systemForm.name.replace(/\W/g, '');
        console.log(`Adding ${this.entityName}/${formName}/${formName}.form.ts`);
        const filepath = `src/${this.entityName}/${formName}/${formName}.form.ts`;
        shell.cp('-r', `${__dirname}/Entity/form/Entity.form.ts`, filepath);
        shell.sed('-i', new RegExp('Entity', 'g'), formName, filepath);
        // shell.exec(`git add ${filepath}`);
        if (shell.test('-e', '../.git')) {
            cp.execFileSync('git', ['add', filepath]);
        }
        console.log(`Added ${this.entityName}/${formName}/${formName}.form.ts`);
    }

    private async updateBuildFile(systemForm: SystemFormModel): Promise<void> {
        const formName = systemForm.name.replace(/\W/g, '');
        console.log(`Updating ${this.entityName}/build.json`);
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
            if (shell.test('-e', '../.git')) {
                cp.execFileSync('git', ['add', filepath]);
            }
        }
        console.log(`Updated ${this.entityName}/build.json`);
    }

    // private async getSystemForms(): Promise<SystemFormModel[]> {
    //     const settings: WebresourcesCrmJson = JSON.parse(fs.readFileSync('./crm.json', 'utf8'));
    //     const {solution_name_generate} = settings.crm;
    //     const fetchXml = `
    //     <fetch no-lock='true'>
    //       <entity name='systemform'>
    //         <attribute name='description' />
    //         <attribute name='formjson' />
    //         <attribute name='formid' />
    //         <attribute name='name' />
    //         <attribute name='formactivationstate' />
    //         <attribute name='type' />
    //         <attribute name='objecttypecode' />
    //         <filter>
    //           <condition attribute="type" operator="in" >
    //             <value>2</value>
    //             <value>7</value>
    //           </condition>
    //         </filter>
    //         <link-entity name='solutioncomponent' from='objectid' to='formid'>
    //           <filter>'
    //             <condition attribute='componenttype' operator='eq' value='60'/>
    //           </filter>'
    //           <link-entity name='solution' from='solutionid' to='solutionid'>
    //             <filter>
    //               <condition attribute='uniquename' operator='eq' value='${solution_name_generate}'/>
    //             </filter>
    //           </link-entity>
    //         </link-entity>
    //       </entity>
    //     </fetch>`;
    //     const solutionComponents = await SystemFormService.fetchXml(fetchXml, this.bearer);
    //     console.log(solutionComponents.length);
    //     return solutionComponents;
    // }

    // private async getSystemForms(): Promise<SystemFormModel[]> {
    //     const systemForms: SystemFormModel[] = [];
    //     const settings: WebresourcesCrmJson = JSON.parse(fs.readFileSync('./crm.json', 'utf8'));
    //     const {solution_name_generate} = settings.crm;
    //     const solution = await SolutionService.getSolution(solution_name_generate, ['solutionid'], this.bearer);
    //     const solutionComponents = await SolutionComponentService.retrieveMultipleRecords({
    //         select: ['objectid'],
    //         filters: [{
    //             conditions: [{
    //                 attribute: '_solutionid_value',
    //                 value: solution.solutionid
    //             }]
    //         }, {
    //             type: 'or',
    //             conditions: [{
    //                 attribute: 'componenttype',
    //                 value: 24
    //             }, {
    //                 attribute: 'componenttype',
    //                 value: 60
    //             }]
    //         }]
    //     }, this.bearer);
    //     for (const solutionComponent of solutionComponents) {
    //         const systemForm = await SystemFormService.getSystemForm(solutionComponent.objectid, ['objecttypecode', 'name', 'formjson'], this.bearer);
    //         if (systemForm.objecttypecode === this.entityLogicalName) {
    //             systemForms.push(systemForm);
    //             await this.log(`<span style="color:blue;">Form '${systemForm.name}' found</span>`);
    //         }
    //     }
    //     return systemForms;
    // }

    private async getSystemForms(): Promise<SystemFormModel[]> {
        const systemForms = await SystemFormService.getSystemForms(this.entityLogicalName, ['objecttypecode', 'name', 'formjson'], this.bearer);
        for (const systemForm of systemForms) {
            console.log(colors.blue(`Form '${systemForm.name}' found`));
        }
        return systemForms;
    }
}
