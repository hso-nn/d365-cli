import shell from 'shelljs';
import colors from 'colors';
import {CrmJson} from '../root/CrmJson';
import * as fs from 'fs';
import cp from 'child_process';

export class PCF {
    public static createComponent(name: string): void {
        if (!shell.test('-e', '../pcf')) {
            console.log(colors.red(`You are not inside the project 'pcf' folder!`));
        } else if (!name) {
            console.log(colors.red(`No control name specified!`));
        } else if (shell.test('-e', name)) {
            console.log(colors.red(`Control already exists`));
        } else if (!shell.which('pac')) {
            console.log(colors.red('You need to install pac first: https://aka.ms/PowerAppsCLI'));
        } else {
            PCF.create(name);
        }
    }

    private static create(name: string): void {
        shell.exec(`mkdir ${name}`);
        shell.cd(name);
        PCF.pacInit(name);
        PCF.addComponentFiles(name);
        PCF.addReference(name);
    }

    private static pacInit(name: string): void {
        shell.exec('pac install latest');
        const settings: CrmJson = JSON.parse(fs.readFileSync('../../crm.json', 'utf8'));
        const namespace = settings.crm.publisher_prefix;
        if (namespace) {
            // --template field|dataset // dataset is model driven only
            shell.exec(`pac pcf init --namespace ${namespace} --name ${name} --template field`);
        }
    }

    private static addComponentFiles(name: string): void {
        shell.cp('-f', `${__dirname}/PCF/*`, `.`);
        shell.cp('-f', `${__dirname}/PCF/.*`, `.`);

        const filepath = `./${name}/${name}.tsx`;
        shell.cp('-r', `${__dirname}/PCF/Component/PCFComponent.tsx`, filepath);
        shell.sed('-i', new RegExp('PCFComponent', 'g'), name, filepath);

        shell.cp('-f', `${__dirname}/PCF/Component/index.ts`, `./${name}`);
        shell.sed('-i', new RegExp('PCFComponent', 'g'), name, `./${name}/index.ts`);
        shell.cp('-f', `${__dirname}/PCF/Component/FieldComponent.ts`, `./${name}`);

        shell.exec('npm install --save-dev @fluentui/react eslint-plugin-react eslint-plugin-react-hooks rxjs');

        if (shell.test('-e', '../../.git')) {
            cp.execFileSync('git', ['add', `../${name}`]);
        }
    }

    private static addReference(name: string): void {
        const componentFolder = process.cwd();
        shell.cd('..');
        shell.cd('Solutions');

        // shell.exec(`pac solution add-reference --path ${componentFolder}`); OWASP
        cp.execFileSync('pac', ['solution', 'add-reference', '--path', componentFolder]);

        let buildCommand = `msbuild /t:build /restore`;
        shell.exec(buildCommand);
        buildCommand += ` /p:configuration=Release`;
        shell.exec(buildCommand);
        shell.cd('..');
        shell.cd(name);
    }

    public static build(): void {
        if (!shell.test('-f', 'Solutions.cdsproj')) {
            console.log(colors.red(`You are not inside the PCF/Solutions folder containing the Solutions.cdsproj file!`));
        } else {
            let buildCommand = `msbuild /t:build`;
            shell.exec(buildCommand);
            buildCommand += ` /p:configuration=Release`;
            shell.exec(buildCommand);
        }
    }

    public static initPcfSolution(solution_name: string, publisher_name: string, publisher_prefix: string): void {
        if (!shell.test('-e', 'Solutions')) {
            shell.exec('mkdir Solutions');
            shell.cd('Solutions');
            const initCommand = `pac solution init --publisher-name ${publisher_name} --publisher-prefix ${publisher_prefix}`;
            shell.exec(initCommand);
            const solutionName = solution_name;
            shell.sed('-i', new RegExp('<UniqueName>Solutions</UniqueName>', 'ig'), `<UniqueName>${solutionName}</UniqueName>`, 'src/Other/Solution.xml');
        }
    }

    public static deploy(): void {
        if (shell.test('-f', 'Solutions.cdsproj')) {
            console.log(colors.red(`Deployment should be done on component level!`));
        } else {
            const settings: CrmJson = JSON.parse(fs.readFileSync('../crm.json', 'utf8'));
            // shell.exec(`pac auth clear`);
            // shell.exec(`pac auth create --url ${settings.crm.url}`);
            shell.exec(`pac pcf push --publisher-prefix ${settings.crm.publisher_prefix}`);
            console.log(colors.red(`When getting an error about 'No profiles found' you need to set this up by following command:`));
            console.log(colors.red(`pac auth create --url ${settings.crm.url}`));
            const connectingUrl = 'https://docs.microsoft.com/en-us/powerapps/developer/component-framework/import-custom-controls#connecting-to-your-environment';
            console.log(`See further information here: ${connectingUrl}`);
        }
    }
}
