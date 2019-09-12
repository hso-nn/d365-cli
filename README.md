# Introduction 
A [Command-line interface](https://en.wikipedia.org/wiki/Command-line_interface) for D365 Frontend Development based on [HSO](https://www.hso.com/en-us) best practices. 

# Getting Started

## Prerequisites
Please have [Node](https://nodejs.org/en/) installed
  
Recommended for debugging: [Fiddler](https://www.telerik.com/fiddler)

## Installation process
Since this package is not deployed yet, you need to install it locally.
  * Checkout this Repository
  * Open PowerShell/cmd and run 'npm link'
  * Now you can close the Repository

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
  What is the project description? My First Project
  What is the Publisher abbreviation (3 chars a-z)? mfp
  What is the Project abbreviation (3 chars a-z)? prj
  Installing npm packages. This may take a while...
  Initializing D365 Project done
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
