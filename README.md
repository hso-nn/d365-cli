# D365-CLI Forms/Webresources project automation
[![npm](https://img.shields.io/npm/dm/@hso/d365-cli.svg)](https://www.npmjs.com/package/@hso/d365-cli)
[![npm](https://img.shields.io/npm/dt/@hso/d365-cli.svg)](https://www.npmjs.com/package/@hso/d365-cli)
[![npm](https://img.shields.io/npm/v/@hso/d365-cli.svg)](https://www.npmjs.com/package/@hso/d365-cli)
[![npm](https://img.shields.io/github/workflow/status/hso-nn/d365-cli/CodeQL?label=CodeQL&logo=github)](https://www.npmjs.com/package/@hso/d365-cli)
[![Package Quality](https://packagequality.com/shield/d365-cli.svg)](https://packagequality.com/#?package=d365-cli)

# Introduction
A [Command-line interface](https://en.wikipedia.org/wiki/Command-line_interface) for D365 Project
Development based on [HSO](https://www.hso.com) best practices. 

It will set up a namespaced project for Forms and Webresources development including some utils for Annotation, WebApi, Base64, etcetera.
The project uses TypeScript and [Xrm DefinitelyTyped](https://www.npmjs.com/package/@types/xrm) intellisense.
For entities, it can generate entity forms including methods for getting tabs, controls, attributes. For entities, it can generate models. The entity model can be used for intellisense and helps with odata.
The project has a Translation util class and the [translation command](https://github.com/hso-nn/d365-cli/wiki/Translations) generates Resx file. The deployment will set/remove dependencies to webresource files.
Building obfuscated code and deploying to the D365 Solution can be done in a few [CLI Commands]((https://github.com/hso-nn/d365-cli/wiki/CLICommands)). 

Invoke the tool on the command line through the hso-d365 executable. Online help is available on the command line.
See wiki for detailed [CLI Commands](https://github.com/hso-nn/d365-cli/wiki/CLICommands).

Since the features and thus the documentation is growing fast, this readme only contains a [Getting Started](#getting-started) and a few examples.
All documentation and examples can be found in the [wiki](https://github.com/hso-nn/d365-cli/wiki).


# Getting Started

## Install CLI
```powershell
  npm install -g @hso/d365-cli
```
For a more detailed installation and prerequisites see wiki for [Installation](https://github.com/hso-nn/d365-cli/wiki/Installation).

## Create project
To create a new project, go to the parent directory of your new workspace and use the following commands:

```powershell
  hso-d365 new my-first-project
```

This will ask a couple of questions to set up the project:

```powershell
  Initializing D365 Project my-first-project
  D365 environment url (eg. https://yourproject.crm4.dynamics.com):? https://yourproject.crm4.dynamics.com
  D365 Solution name:? CoreEssentials
  D365 Publisher Prefix (3 chars a-z):? hso
  Namespace (eg. Customer or Product name):? mfp
  Installing npm packages. This may take a while...
  Initializing D365 Project done
```

Now go to the Webresources folder, which is the root folder of the project:
```powershell
  cd my-first-project
  cd Webresources
```

## Add Entity
To add an entity to the project use following commands:  

```powershell
  hso-d365 generate Entity MyEntity
```

This will ask for the Logical Name of the Entity:

```powershell
  Adding D365 Entity MyEntity...
  What is the Entity Logical Name? myentity
  Adding D365 Entity done
```

## Add Webresource
To add an Webresource to the project use following commands:

```powershell
  hso-d365 generate Webresource MyWebresource
```

## Deploy
To build and deploy changes made to the Entity and Webresource use following command:

```powershell
  npm run build:prod
```
Now the folder Webresources/dist/mfp_ contains the bundled and obfuscated files to be deployed.
It's recommended to deploy in the same folder structure to D365.

Use following [command to deploy](https://github.com/hso-nn/d365-cli/wiki/CommandDeploy)
```powershell
  hso-d365 deploy
```

# Code Examples

## Xrm DefinitelyTyped and [generated](https://github.com/hso-nn/d365-cli/wiki/GenerateEntity) QuoteService
```TypeScript
static async clone(executionContext: Xrm.Events.EventContext): Promise<void> {
    const formContext = executionContext.getFormContext(),
        id = formContext.data.entity.getId(),
        quote = await QuoteService.retrieveClone(id),
        quote.name = `Copy - ${quote.name}`,
        validation = await QuoteService.validateRecord(quote);
    if (validation.isValid) {
        try {
            await QuoteService.createRecord(quote);
        } catch (e) {
            console.log(`${e.code} - ${e.message}`);
        }
    }
}
```

## [Entity](https://github.com/hso-nn/d365-cli/wiki/GenerateEntity) (Account, Contact) [Service](https://github.com/hso-nn/d365-cli/wiki/GenerateEntity#nameservicets) and [Model](https://github.com/hso-nn/d365-cli/wiki/GenerateEntity#namemodelts)
```TypeScript
    const accounts = await AccountService.retrieveMultipleRecords({ 
        select: ['name'],
        expands: [{
            attribute: 'primarycontactid',
            select: ['fullname']
        }]
    }); // returns AccountModel[]
    for (const account of accounts) {
        // account.primarycontactid is ContractModel
        console.log(`Contact fullname: ${account.primarycontactid.fullname}`);
    }
```

## [Action](https://github.com/hso-nn/d365-cli/wiki/WebApi#executeAction) via [WebApi](https://github.com/hso-nn/d365-cli/wiki/WebApi)
```TypeScript
    const result1 = await WebApi.executeAction('WhoAmI');
    const result2 = await WebApi.executeAction(
        'yourAction', {value: 'x'}, 'account', 'idOfAccount');
```
