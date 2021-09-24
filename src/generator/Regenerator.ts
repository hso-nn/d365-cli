import * as shell from 'shelljs';
import fs from 'fs';
import {Entity} from './Entity';
import {GlobalOptionSet} from './GlobalOptionSet';
import {EnvironmentVariable} from './EnvironmentVariable';

// TODO duplicate with webpack.config.ts
interface BuildJson {
    forms: FormJson[];
    webresources: WebresourceJson[];
}
// TODO duplicate with webpack.config.ts
interface FormJson {
    name: string;
    build: boolean;
}
// TODO duplicate with webpack.config.ts
interface WebresourceJson extends FormJson {
    template: 'React' | 'HTML';
}

export class Regenerator {
    private readonly bearer: string;
    private readonly log: (message: string) => Promise<void>;

    constructor(bearer: string, log: (message: string) => Promise<void>) {
        this.bearer = bearer;
        this.log = log;
    }

    public async generate(): Promise<void> {
        await this.log('Regenerating. This may take some time...');
        await this.regenerateEntities();
        await this.regenerateGlobalOptionSets();
        await this.regenerateEnvironmentVariable();
        await this.log('Generated');
    }

    private async regenerateEntities(): Promise<void> {
        const buildFiles = shell.ls('./src/**/build.json');
        for (const filepath of buildFiles) {
            const pathSplit = filepath.split('/');
            const entityName = pathSplit[pathSplit.length - 2];
            const buildJsonString = String(fs.readFileSync(filepath));
            const buildJson = JSON.parse(buildJsonString) as BuildJson;
            const {forms} = buildJson;
            if (forms.length > 0) {
                console.log(`hso-d365 generate Entity ${entityName}`);
                const entity = new Entity(this.bearer, entityName, async (message: string) => this.log(message), {});
                await entity.generate();
            }
        }
    }

    private async regenerateGlobalOptionSets(): Promise<void> {
        console.log(`hso-d365 generate GlobalOptionSets`);
        const globalOptionSet = new GlobalOptionSet(this.bearer, async (message: string) => this.log(message));
        await globalOptionSet.generate();
    }

    private async regenerateEnvironmentVariable(): Promise<void> {
        console.log(`hso-d365 generate EnvironmentVariable`);
        const environmentVariable = new EnvironmentVariable(this.bearer, async (message: string) => this.log(message));
        await environmentVariable.generate();
    }
}
