# D365-CLI Forms/Webresources project automation
[![npm](https://img.shields.io/npm/dm/@hso/d365-cli.svg)](https://www.npmjs.com/package/@hso/d365-cli)
[![npm](https://img.shields.io/npm/dt/@hso/d365-cli.svg)](https://www.npmjs.com/package/@hso/d365-cli)
[![npm](https://img.shields.io/npm/v/@hso/d365-cli.svg)](https://www.npmjs.com/package/@hso/d365-cli)

# Introduction
A [Command-line interface](https://en.wikipedia.org/wiki/Command-line_interface) for D365 Project (Forms/Webresources) Development based on [HSO](https://www.hso.com/en-us) best practices. 

# Getting Started

## Prerequisites
* Please have [Node](https://nodejs.org/en/) installed
* Please have [Visual Studio Code](https://code.visualstudio.com/download) installed
    * Please install Visual Studio Code [ESLint plugin](https://github.com/microsoft/vscode-eslint)
    * In Visual Studio Code extensions list right-click ESLint extension and click 'Configure Extension Settings'
     * Add following configuration:
     ```json
     "eslint.validate":[
         "javascript",
         "javascriptreact",
         "typescript",
         "typescriptreact"
     ],
     ```
     
Recommended for debugging: [Fiddler](https://www.telerik.com/fiddler)

## Installation process
```powershell
  npm install -g @hso/d365-cli
```

## CLI Introduction
Invoke the tool on the command line through the hso-d365 executable. Online help is avaliable on the command line.
Enter the following to list commands or options for a given command (such as generate) with a short description.

```powershell
  hso-d365 help
  hso-d365 generate --help
```

# Create Project
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
  Namespace (eg. Customer or Product name):? afs
  Installing npm packages. This may take a while...
  Initializing D365 Project done
```

# Update Project
When updating the CLI, you can update the project as well and get latest features/best-practices
* Update CLI: 
```powershell
npm install -g @hso/d365-cli@latest
```
* Update Project:
```powershell
hso-d365 update
```

# Entity
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

# Webresource
To add an Webresource to the project use following commands:

```powershell
  hso-d365 generate Webresource MyWebresource
```

# Deploy
To build and deploy changes made to the Entity and Webresource use following command:

```powershell
  npm run build:prod
```
Now the folder Webresources/mfp_ contains the bundled and uglified files to be deployed.
It's recommended to deploy in the same folder structure to D365.

Use following command to deploy
```powershell
  npm run deploy
```

## Deploy Note
You may need to create your own Application registration
  * In Azure Active Directory create Application registration
  * Copy client Id and put in deploy/crm.json (adal/clientId)
  * In Api Permissions assign Dynamics CRM (user_imporsonate)
  * Set Redirect url equal to deploy/crm.json/adal/redirectUri

# Debug
To build a debug version use following command:

```powershell
  npm run build
```

# Advanced Programming
Once the files are deployed, it's possible to point to a local file instead of the D365 file:
  * Start fiddler
  * Select AutoResponder (right side)
  * Check 'Enable rules'
  * Click 'Add Rule'
  * In Rule Editor (bottom) enter following lines:
    * REGEX:(?insx).+\/mfp_\/(?'foldername'[^?]*)\/(?'fname'[^?]*.js)
    * C:\git\my-first-project\Webresources\mfp_\${foldername}\${fname}
    * Click 'Save'
  * In command line:
    ```powershell
      npm run watch
    ```
  * Now refresh D365 and your local file will be served.

# Examples
## Cloning Quote

```typescript
    private static async clone(executionContext: Xrm.Events.EventContext): Promise<void> {
        const formContext = executionContext.getFormContext(),
            id = formContext.data.entity.getId(),
            quote = await QuoteService.retrieveClone(id),
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
