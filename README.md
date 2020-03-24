# D365-CLI Forms/Webresources project automation
[![npm](https://img.shields.io/npm/dm/@hso/d365-cli.svg)](https://www.npmjs.com/package/@hso/d365-cli)
[![npm](https://img.shields.io/npm/dt/@hso/d365-cli.svg)](https://www.npmjs.com/package/@hso/d365-cli)
[![npm](https://img.shields.io/npm/v/@hso/d365-cli.svg)](https://www.npmjs.com/package/@hso/d365-cli)

# Introduction
A [Command-line interface](https://en.wikipedia.org/wiki/Command-line_interface) for D365 Project (Forms/Webresources) Development based on [HSO](https://www.hso.com/en-us) best practices. 
Invoke the tool on the command line through the hso-d365 executable. Online help is avaliable on the command line.
See wiki for detailed [CLI Commands](https://github.com/hso-nn/d365-cli/wiki/CLICommands).

Since the features and thus the documentation is growing fast, this readme only contains a [Getting Started](#Getting Started).
All documentation and examples can be found in the [wiki](https://github.com/hso-nn/d365-cli/wiki).


# Getting Started

## Install CLI
```powershell
  npm install -g @hso/d365-cli
```
For a more detailed installation and prerequisites see wiki for [Installation](https://github.com/hso-nn/d365-cli/wiki/Installation).

## Create project
To create a new, basic D365 Webresource project, go to the parent directory of your new workspace and use the following commands:

```powershell
  hso-d365 new my-first-project
```

This will ask a couple of questions to setup the project:

```powershell
  Initializing D365 Project my-first-project
  D365 environment url (eg. https://yourproject.crm4.dynamics.com):? https://yourproject.crm4.dynamics.com
  D365 Solution name:? CoreEssentials
  D365 Publisher Prefix (3 chars a-z):? hso
  Namespace (eg. Customer or Product name):? mfp
  Installing npm packages. This may take a while...
  Initializing D365 Project done
```

## Add Entity
To add an entity to the project use following commands:  

```powershell
  cd my-first-project
  cd Webresources
  hso-d365 generate Entity MyEntity
```

This will ask a couple of questions to setup the Entity:

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
Now the folder Webresources/dist/mfp_ contains the bundled and uglified files to be deployed.
It's recommended to deploy in the same folder structure to D365.

Use following command to deploy
```powershell
  npm run deploy
```

# Examples
## Cloning Quote

```TypeScript
private static async clone(executionContext: Xrm.Events.EventContext): Promise<void> {
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
