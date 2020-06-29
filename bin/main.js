/*! HSO D365 CLI 1.8.0 | (c) HSO Innovation */
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/Create.ts":
/*!***********************!*\
  !*** ./src/Create.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var colors = __webpack_require__(/*! colors */ "colors");
var shell = __webpack_require__(/*! shelljs */ "shelljs");
var inquirer = __webpack_require__(/*! inquirer */ "inquirer");
var Create = /** @class */ (function () {
    function Create() {
    }
    Create.createProject = function (projectname) {
        if (process.argv[4]) {
            console.log(colors.red("No spaces allowed!"));
        }
        else if (shell.test('-e', projectname + "/Webresources")) {
            console.log(colors.red("Project " + projectname + "/Webresources already exists!"));
        }
        else {
            return Create.create(projectname);
        }
    };
    Create.showCreateHelp = function () {
        console.log("Arguments:");
        console.log('   ' + colors.blue('project'));
        console.log("     The project name of the new workspace and initial Webresource setup.");
    };
    Create.create = function (projectname) {
        return __awaiter(this, void 0, void 0, function () {
            var answers, crmJsonFile, packageJsonFile, webpackConfigFile;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Initializing D365 Project " + projectname + "...");
                        shell.mkdir(projectname);
                        shell.cd(projectname);
                        shell.mkdir('Webresources');
                        shell.cp('-R', __dirname + "/root/*", 'Webresources');
                        shell.cp('-R', __dirname + "/root/.*", 'Webresources');
                        return [4 /*yield*/, Create.inquirer()];
                    case 1:
                        answers = _a.sent();
                        crmJsonFile = shell.ls('Webresources/tools/crm.json')[0];
                        shell.sed('-i', new RegExp('<%= publisher %>', 'ig'), answers.publisher, crmJsonFile);
                        shell.sed('-i', new RegExp('<%= solution %>', 'ig'), answers.solution, crmJsonFile);
                        shell.sed('-i', new RegExp('<%= environment %>', 'ig'), answers.environment, crmJsonFile);
                        shell.sed('-i', new RegExp('<%= namespace %>', 'ig'), answers.namespace, crmJsonFile);
                        shell.sed('-i', new RegExp('<%= translationtype %>', 'ig'), answers.translationtype, crmJsonFile);
                        packageJsonFile = shell.ls('Webresources/package.json')[0];
                        shell.sed('-i', '<%= projectname %>', projectname.toLowerCase(), packageJsonFile);
                        shell.sed('-i', new RegExp('<%= description %>', 'ig'), answers.solution, packageJsonFile);
                        shell.sed('-i', new RegExp('<%= publisher %>', 'ig'), answers.publisher, packageJsonFile);
                        webpackConfigFile = shell.ls('Webresources/webpack.config.js')[0];
                        shell.sed('-i', new RegExp('<%= publisher %>', 'ig'), answers.publisher, webpackConfigFile);
                        shell.sed('-i', new RegExp('<%= namespace %>', 'ig'), answers.namespace, webpackConfigFile);
                        shell.sed('-i', new RegExp('<%= description %>', 'ig'), answers.namespace, webpackConfigFile);
                        shell.cd('Webresources');
                        console.log("Installing npm packages. This may take a while...");
                        shell.exec('npm install');
                        console.log('Initializing D365 Project done');
                        console.log(colors.blue('hso-d365 generate Entity x') + " in Webresources folder generates Entity x files and settings.");
                        console.log(colors.blue('npm run build:prod') + " in Webresources folder creates the deployment package.");
                        console.log("See package.json#scripts for all options.");
                        return [2 /*return*/];
                }
            });
        });
    };
    Create.inquirer = function () {
        return inquirer.prompt([{
                type: 'input',
                name: 'environment',
                message: 'D365 environment url (eg. https://yourproject.crm4.dynamics.com):'
            }, {
                type: 'input',
                name: 'solution',
                message: 'D365 Solution name:'
            }, {
                type: 'input',
                name: 'publisher',
                message: 'D365 Publisher Prefix (3 chars a-z):'
            }, {
                type: 'input',
                name: 'namespace',
                message: 'Namespace (eg. Customer or Product name):'
            }, {
                type: 'list',
                name: 'translationtype',
                message: 'Which translation type do you want?',
                choices: [
                    'resx',
                    'i18n'
                ]
            }]);
    };
    return Create;
}());
exports.Create = Create;


/***/ }),

/***/ "./src/Variables.ts":
/*!**************************!*\
  !*** ./src/Variables.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var Variables = /** @class */ (function () {
    function Variables() {
    }
    Variables.get = function () {
        return __awaiter(this, void 0, void 0, function () {
            var webpackConfigVariable, packageJsonVariables, crmJsonVariables;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Variables.readWebpackConfig()];
                    case 1:
                        webpackConfigVariable = _a.sent();
                        return [4 /*yield*/, Variables.readPackageJson()];
                    case 2:
                        packageJsonVariables = _a.sent();
                        return [4 /*yield*/, Variables.readCrmJson()];
                    case 3:
                        crmJsonVariables = _a.sent();
                        return [2 /*return*/, Object.assign({}, webpackConfigVariable, packageJsonVariables, crmJsonVariables)];
                }
            });
        });
    };
    Variables.readWebpackConfig = function () {
        return new Promise(function (resolve) {
            var publisher, namespace;
            var lineReader = __webpack_require__(/*! readline */ "readline").createInterface({
                input: __webpack_require__(/*! fs */ "fs").createReadStream("webpack.config.js")
            });
            lineReader.on('line', function (line) {
                if (line.includes('dir_build =')) {
                    var split = line.split('"'), publisherNamespace = split[1], pnSplit = publisherNamespace.split('_/');
                    publisher = pnSplit[0].replace('dist/', '');
                    namespace = pnSplit[1];
                    lineReader.close();
                    resolve({
                        publisher: publisher,
                        namespace: namespace
                    });
                }
            });
        });
    };
    Variables.readPackageJson = function () {
        return new Promise(function (resolve) {
            var projectname = '', description, version = '';
            var lineReader = __webpack_require__(/*! readline */ "readline").createInterface({
                input: __webpack_require__(/*! fs */ "fs").createReadStream("package.json")
            });
            lineReader.on('line', function (line) {
                if (line.includes('"name":')) {
                    var split = line.split('"');
                    projectname = split[3];
                }
                if (line.includes('"version":')) {
                    var split = line.split('"');
                    version = split[3];
                }
                if (line.includes('"description":')) {
                    var split = line.split('"');
                    description = split[3];
                    lineReader.close();
                    resolve({
                        description: description,
                        projectname: projectname,
                        version: version
                    });
                }
            });
        });
    };
    Variables.readCrmJson = function () {
        return new Promise(function (resolve) {
            var environment = '', solution = '', translationtype = '';
            var lineReader = __webpack_require__(/*! readline */ "readline").createInterface({
                input: __webpack_require__(/*! fs */ "fs").createReadStream("tools/crm.json")
            });
            lineReader.on('line', function (line) {
                if (line.includes('"solution_name":')) {
                    var split = line.split('"');
                    solution = split[3];
                }
                if (line.includes('"url":')) {
                    var split = line.split('"');
                    environment = split[3];
                }
                if (line.includes('"clientUrl":')) {
                    var split = line.split('"');
                    environment = split[3];
                }
                if (line.includes('"translation:"')) {
                    var split = line.split('"');
                    translationtype = split[3];
                }
                if (line.includes('"redirectUri":')) {
                    lineReader.close();
                    resolve({
                        environment: environment,
                        solution: solution,
                        translationtype: translationtype
                    });
                }
            });
        });
    };
    return Variables;
}());
exports.Variables = Variables;


/***/ }),

/***/ "./src/generator/Entity.ts":
/*!*********************************!*\
  !*** ./src/generator/Entity.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var colors = __webpack_require__(/*! colors */ "colors");
var shell = __webpack_require__(/*! shelljs */ "shelljs");
var inquirer = __webpack_require__(/*! inquirer */ "inquirer");
var Variables_1 = __webpack_require__(/*! ../Variables */ "./src/Variables.ts");
var Entity = /** @class */ (function () {
    function Entity() {
    }
    Entity.generateEntity = function (entityname) {
        var check = shell.grep(" " + entityname + ":", 'webpack.config.js');
        if (!entityname) {
            console.log(colors.red('Entity name missing'));
        }
        else if (!new RegExp('[A-Z]').test(entityname[0])) {
            console.log(colors.red("Entity name must be UpperCamelCase!"));
        }
        else if (check.stdout !== '\n') {
            console.log(colors.red("Entity " + entityname + " already exists!"));
        }
        else if (process.argv[5]) {
            console.log(colors.red("No spaces allowed!"));
        }
        else {
            return Entity.generate(entityname);
        }
    };
    Entity.generate = function (entityname) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, publisher, namespace, answers, webpackConfigFile;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log("Adding D365 Entity " + entityname + "...");
                        return [4 /*yield*/, Variables_1.Variables.get()];
                    case 1:
                        _a = _b.sent(), publisher = _a.publisher, namespace = _a.namespace;
                        return [4 /*yield*/, inquirer.prompt([{
                                    type: 'input',
                                    name: 'entityLogicalName',
                                    message: 'Entity LogicalName:'
                                }])];
                    case 2:
                        answers = _b.sent();
                        shell.mkdir("src/" + entityname);
                        shell.ls(__dirname + "/Entity/*.*").forEach(function (file) {
                            var split = file.split('/');
                            var filename = split[split.length - 1];
                            var newfilename = filename.replace(/Entity/g, entityname);
                            shell.cp('-r', file, "src/" + entityname);
                            shell.cp('-r', "src/" + entityname + "/" + filename, "src/" + entityname + "/" + newfilename);
                            shell.rm('-rf', "src/" + entityname + "/" + filename);
                            shell.sed('-i', new RegExp('EntityLogicalName', 'ig'), answers.entityLogicalName, "src/" + entityname + "/" + newfilename);
                            shell.sed('-i', new RegExp('Entity', 'g'), entityname, "src/" + entityname + "/" + newfilename);
                            shell.sed('-i', new RegExp('entity', 'g'), entityname.charAt(0).toLowerCase() + entityname.slice(1), "src/" + entityname + "/" + newfilename);
                            shell.sed('-i', new RegExp('<%= publisher %>', 'ig'), publisher, "src/" + entityname + "/" + newfilename);
                            shell.sed('-i', new RegExp('<%= namespace %>', 'ig'), namespace, "src/" + entityname + "/" + newfilename);
                            shell.exec("git add src/" + entityname + "/" + newfilename);
                        });
                        webpackConfigFile = shell.ls('webpack.config.js')[0];
                        // eslint-disable-next-line max-len
                        shell.sed('-i', 'entry: {', "entry: {\n        " + entityname + ": [\n            path.resolve(__dirname, \"src/" + entityname + "/" + entityname + ".ts\")\n        ],", webpackConfigFile);
                        shell.exec('git add webpack.config.js');
                        console.log('Adding D365 Entity done');
                        return [2 /*return*/];
                }
            });
        });
    };
    return Entity;
}());
exports.Entity = Entity;


/***/ }),

/***/ "./src/generator/Generator.ts":
/*!************************************!*\
  !*** ./src/generator/Generator.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var colors = __webpack_require__(/*! colors */ "colors");
var shell = __webpack_require__(/*! shelljs */ "shelljs");
var Entity_1 = __webpack_require__(/*! ./Entity */ "./src/generator/Entity.ts");
var Webresource_1 = __webpack_require__(/*! ./Webresource */ "./src/generator/Webresource.ts");
var LicenseValidator_1 = __webpack_require__(/*! ./LicenseValidator */ "./src/generator/LicenseValidator.ts");
var Model_1 = __webpack_require__(/*! ./Model */ "./src/generator/Model.ts");
var Generator = /** @class */ (function () {
    function Generator() {
    }
    Generator.generate = function (schematic, name) {
        var supportedSchematics = ['entity', 'webresource', 'model', 'licensevalidator'];
        if (!shell.test('-e', 'src')) {
            console.log(colors.red("You are not inside the project Webresources folder!"));
        }
        else if (!schematic) {
            console.log(colors.red("No schematic specified!"));
        }
        else if (!supportedSchematics.includes(schematic.toLowerCase())) {
            console.log(colors.red("Schematic " + schematic + " not supported!"));
        }
        else if (schematic.toLowerCase() === 'entity') {
            return Entity_1.Entity.generateEntity(name);
        }
        else if (schematic.toLowerCase() === 'webresource') {
            return Webresource_1.Webresource.generateWebresource(name);
        }
        else if (schematic.toLocaleLowerCase() === 'model') {
            return Model_1.Model.generateModel(name);
        }
        else if (schematic.toLowerCase() === 'licensevalidator') {
            return LicenseValidator_1.LicenseValidator.generateLicenseValidator(name);
        }
    };
    Generator.showGenerateHelp = function () {
        console.log("Arguments:");
        console.log("   " + colors.blue('schematic'));
        console.log("     The schematic or collection:schematic to generate.");
        console.log("     Example: Entity, Webresource or LicenseValidator.");
    };
    return Generator;
}());
exports.Generator = Generator;


/***/ }),

/***/ "./src/generator/LicenseValidator.ts":
/*!*******************************************!*\
  !*** ./src/generator/LicenseValidator.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var colors = __webpack_require__(/*! colors */ "colors");
var shell = __webpack_require__(/*! shelljs */ "shelljs");
var Variables_1 = __webpack_require__(/*! ../Variables */ "./src/Variables.ts");
var LicenseValidator = /** @class */ (function () {
    function LicenseValidator() {
    }
    LicenseValidator.generateLicenseValidator = function (licensename) {
        return __awaiter(this, void 0, void 0, function () {
            var check;
            return __generator(this, function (_a) {
                check = shell.grep(" LicenseValidator:", 'webpack.config.js');
                if (!licensename) {
                    console.log(colors.red('Module name missing'));
                }
                else if (check.stdout !== '\n') {
                    console.log(colors.red("src/License already exists!"));
                }
                else if (process.argv[5]) {
                    console.log(colors.red("No spaces allowed!"));
                }
                else {
                    LicenseValidator.generate(licensename);
                }
                return [2 /*return*/];
            });
        });
    };
    LicenseValidator.generate = function (licensename) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, publisher, namespace, webpackConfigFile;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log("Adding D365 License Validator for " + licensename + "...");
                        shell.exec('npm install --save dlf-core@latest');
                        return [4 /*yield*/, Variables_1.Variables.get()];
                    case 1:
                        _a = _b.sent(), publisher = _a.publisher, namespace = _a.namespace;
                        shell.mkdir("src/License");
                        shell.ls(__dirname + "/License/*.*").forEach(function (file) {
                            var split = file.split('/');
                            var filename = split[split.length - 1];
                            shell.cp('-r', file, "src/License");
                            shell.sed('-i', new RegExp('<%= licensename %>', 'ig'), licensename, "src/License/" + filename);
                            shell.sed('-i', new RegExp('<%= publisher %>', 'ig'), publisher, "src/License/" + filename);
                            shell.sed('-i', new RegExp('<%= namespace %>', 'ig'), namespace, "src/License/" + filename);
                        });
                        webpackConfigFile = shell.ls('webpack.config.js')[0];
                        // eslint-disable-next-line max-len
                        shell.sed('-i', 'entry: {', "entry: {\n        LicenseValidator: [\n            path.resolve(__dirname, \"src/License/Validator.ts\")\n        ],", webpackConfigFile);
                        shell.exec('git add webpack.config.js');
                        console.log('Adding D365 License Validator done');
                        return [2 /*return*/];
                }
            });
        });
    };
    return LicenseValidator;
}());
exports.LicenseValidator = LicenseValidator;


/***/ }),

/***/ "./src/generator/Model.ts":
/*!********************************!*\
  !*** ./src/generator/Model.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var colors = __webpack_require__(/*! colors */ "colors");
var AdalRouter_1 = __webpack_require__(/*! ../root/tools/AdalRouter */ "./src/root/tools/AdalRouter.ts");
var shell = __webpack_require__(/*! shelljs */ "shelljs");
var fs = __webpack_require__(/*! fs */ "fs");
var NodeApi_1 = __webpack_require__(/*! ../root/tools/NodeApi/NodeApi */ "./src/root/tools/NodeApi/NodeApi.ts");
var Model = /** @class */ (function (_super) {
    __extends(Model, _super);
    function Model(entityname) {
        var _this = _super.call(this) || this;
        _this.entityname = entityname;
        _this.entityLogicalName = Model.getEntityLogicalName(_this.entityname);
        return _this;
    }
    Model.generateModel = function (entityname) {
        if (!entityname) {
            console.log(colors.red('Model name missing'));
        }
        else if (!new RegExp('[A-Z]').test(entityname[0])) {
            console.log(colors.red("Entity name must be UpperCamelCase!"));
        }
        else if (process.argv[5]) {
            console.log(colors.red("No spaces allowed!"));
        }
        else {
            var entityLogicalName = Model.getEntityLogicalName(entityname);
            if (entityLogicalName) {
                new Model(entityname);
            }
        }
        return null;
    };
    Model.prototype.onAuthenticated = function () {
        return this.generateModel();
    };
    Model.prototype.generateModel = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.log("Generating model for Entity '" + this.entityname + "'<br/>Using entityLogicalName '" + this.entityLogicalName + "'</br>");
                        return [4 /*yield*/, this.writeModelFile()];
                    case 1:
                        _a.sent();
                        this.log('Generating model finished');
                        return [2 /*return*/];
                }
            });
        });
    };
    Object.defineProperty(Model, "modelinterfaceRegex", {
        get: function () {
            return /Model\sextends\sModel\s{([\s\S]*)}/gm;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Model.prototype, "modelImportRegex", {
        get: function () {
            return new RegExp("([\\s\\S]*)export\\sinterface\\s" + this.entityname, 'gm');
        },
        enumerable: true,
        configurable: true
    });
    Model.prototype.writeModelFile = function () {
        return __awaiter(this, void 0, void 0, function () {
            var filepath, filedata, modelMatch, attributeInterfaceTypes, relationshipInterfaceTypes, importsString, typesString, enumsString, importMatch, modelString, _a, newFiledata;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        filepath = "src/" + this.entityname + "/" + this.entityname + ".model.ts", filedata = String(fs.readFileSync(filepath)), modelMatch = Model.modelinterfaceRegex.exec(filedata);
                        if (!modelMatch) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.getAttributeInterfaceTypes()];
                    case 1:
                        attributeInterfaceTypes = _b.sent();
                        return [4 /*yield*/, this.getRelationshipInterfaceTypes()];
                    case 2:
                        relationshipInterfaceTypes = _b.sent(), importsString = this.getImportStrings(relationshipInterfaceTypes);
                        return [4 /*yield*/, this.getTypeStrings()];
                    case 3:
                        typesString = _b.sent();
                        return [4 /*yield*/, this.getEnumStrings()];
                    case 4:
                        enumsString = _b.sent(), importMatch = this.modelImportRegex.exec(filedata);
                        return [4 /*yield*/, this.getAttributesString(attributeInterfaceTypes, relationshipInterfaceTypes)];
                    case 5:
                        modelString = _b.sent();
                        _a = modelString;
                        return [4 /*yield*/, Model.getRelationshipsString(relationshipInterfaceTypes, attributeInterfaceTypes)];
                    case 6:
                        modelString = _a + _b.sent();
                        modelString += this.getCombinedAttributeRelationshipString(attributeInterfaceTypes, relationshipInterfaceTypes);
                        newFiledata = filedata.replace(modelMatch[1], modelString);
                        newFiledata = newFiledata.replace(importMatch[1], importsString + enumsString + typesString);
                        shell.ShellString(newFiledata).to(filepath);
                        return [3 /*break*/, 8];
                    case 7:
                        this.log("Model file seems to be corrupt. Please fix " + filepath);
                        _b.label = 8;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    Model.prototype.getImportStrings = function (relationshipInterfaceTypes) {
        var importStrings = "import {Model} from '../WebApi/Model';\n";
        for (var _i = 0, _a = Object.keys(relationshipInterfaceTypes); _i < _a.length; _i++) {
            var referencingEntityNavigationPropertyName = _a[_i];
            if (!Model.defaultModelAttributes.includes(referencingEntityNavigationPropertyName)) {
                var referencedEntity = relationshipInterfaceTypes[referencingEntityNavigationPropertyName], camelReferencedEntity = Model.capitalize(this.getTypeName(referencedEntity)), relatedModelFilePath = "src/" + camelReferencedEntity + "/" + camelReferencedEntity + ".model.ts";
                importStrings += "import {" + camelReferencedEntity + "Model} from '../" + camelReferencedEntity + "/" + camelReferencedEntity + ".model';\n";
                if (!shell.test('-f', relatedModelFilePath)) {
                    this.log("<span style=\"color:blue;\">NavigationProperty '" + referencingEntityNavigationPropertyName + "' generated.<br/>\n                        Referenced model '" + camelReferencedEntity + "' not found.<br/>\n                        Add referenced model '" + camelReferencedEntity + "' by following cli command:</span><br/>\n                        <span style=\"color:green\">hso-d365 generate Entity " + camelReferencedEntity + "</span></br>");
                }
            }
        }
        importStrings += '\n';
        return importStrings;
    };
    Model.prototype.getCombinedAttributeRelationshipString = function (attributesInterfaceTypes, relationshipInterfaceTypes) {
        var combinedString = "";
        var attributeNames = Object.keys(attributesInterfaceTypes);
        for (var _i = 0, _a = Object.keys(relationshipInterfaceTypes); _i < _a.length; _i++) {
            var referencingEntityNavigationPropertyName = _a[_i];
            if (!Model.defaultModelAttributes.includes(referencingEntityNavigationPropertyName) && attributeNames.includes(referencingEntityNavigationPropertyName)) {
                var referencedEntity = relationshipInterfaceTypes[referencingEntityNavigationPropertyName], interfaceType = attributesInterfaceTypes[referencingEntityNavigationPropertyName];
                combinedString += "\n    " + referencingEntityNavigationPropertyName + "?: " + interfaceType + " | " + Model.capitalize(this.getTypeName(referencedEntity)) + "Model;";
            }
        }
        if (combinedString) {
            combinedString = "\n    // Attributes/NavigationProperties for $select and $expand" + combinedString;
            combinedString += '\n';
        }
        return combinedString;
    };
    Model.getRelationshipsString = function (relationshipInterfaceTypes, attributesInterfaceTypes) {
        return __awaiter(this, void 0, void 0, function () {
            var relationshipString, attributeNames, _i, _a, referencingEntityNavigationPropertyName, referencedEntity;
            return __generator(this, function (_b) {
                relationshipString = "\n    // NavigationProperties for $expand";
                attributeNames = Object.keys(attributesInterfaceTypes);
                for (_i = 0, _a = Object.keys(relationshipInterfaceTypes); _i < _a.length; _i++) {
                    referencingEntityNavigationPropertyName = _a[_i];
                    if (!Model.defaultModelAttributes.includes(referencingEntityNavigationPropertyName) && !attributeNames.includes(referencingEntityNavigationPropertyName)) {
                        referencedEntity = relationshipInterfaceTypes[referencingEntityNavigationPropertyName];
                        relationshipString += "\n    " + referencingEntityNavigationPropertyName + "?: " + Model.capitalize(referencedEntity) + "Model;";
                    }
                }
                relationshipString += "\n";
                return [2 /*return*/, relationshipString];
            });
        });
    };
    Model.prototype.getRelationshipInterfaceTypes = function () {
        return __awaiter(this, void 0, void 0, function () {
            var manyToOneMetadatas, relationshipsInterfaces, _i, manyToOneMetadatas_1, relation, ReferencedEntity, ReferencingEntityNavigationPropertyName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, NodeApi_1.NodeApi.getManyToOneMetadatas(this.entityLogicalName, this.context)];
                    case 1:
                        manyToOneMetadatas = _a.sent(), relationshipsInterfaces = {};
                        for (_i = 0, manyToOneMetadatas_1 = manyToOneMetadatas; _i < manyToOneMetadatas_1.length; _i++) {
                            relation = manyToOneMetadatas_1[_i];
                            ReferencedEntity = relation.ReferencedEntity, ReferencingEntityNavigationPropertyName = relation.ReferencingEntityNavigationPropertyName;
                            relationshipsInterfaces[ReferencingEntityNavigationPropertyName] = ReferencedEntity;
                        }
                        return [2 /*return*/, relationshipsInterfaces];
                }
            });
        });
    };
    Model.capitalize = function (text) {
        return text.charAt(0).toUpperCase() + text.slice(1);
    };
    Model.prototype.getAttributesString = function (attributesInterfaceTypes, relationshipInterfaceTypes) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, PrimaryIdAttribute, PrimaryNameAttribute, relationshipNames, attributesString, _i, _b, logicalName, interfaceType;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, NodeApi_1.NodeApi.getEntityDefinition(this.entityLogicalName, this.context, ['PrimaryIdAttribute', 'PrimaryNameAttribute'])];
                    case 1:
                        _a = _c.sent(), PrimaryIdAttribute = _a.PrimaryIdAttribute, PrimaryNameAttribute = _a.PrimaryNameAttribute, relationshipNames = Object.keys(relationshipInterfaceTypes);
                        attributesString = "\n    // Attributes for $select\n";
                        attributesString += "    " + PrimaryIdAttribute + "?: " + attributesInterfaceTypes[PrimaryIdAttribute] + "; // PrimaryIdAttribute\n";
                        attributesString += "    " + PrimaryNameAttribute + "?: " + attributesInterfaceTypes[PrimaryNameAttribute] + "; // PrimaryNameAttribute";
                        for (_i = 0, _b = Object.keys(attributesInterfaceTypes); _i < _b.length; _i++) {
                            logicalName = _b[_i];
                            interfaceType = attributesInterfaceTypes[logicalName];
                            if (!Model.defaultModelAttributes.includes(logicalName) &&
                                logicalName !== PrimaryIdAttribute &&
                                logicalName !== PrimaryNameAttribute &&
                                !relationshipNames.includes(logicalName)) {
                                attributesString += "\n    " + logicalName + "?: " + interfaceType + ";";
                            }
                        }
                        attributesString += "\n";
                        return [2 /*return*/, attributesString];
                }
            });
        });
    };
    Model.prototype.getAttributeInterfaceTypes = function () {
        return __awaiter(this, void 0, void 0, function () {
            var attributesMetadata, attributesInterfaces, _i, attributesMetadata_1, attribute, AttributeType, LogicalName, interfaceType;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, NodeApi_1.NodeApi.getAttributesMetadata(this.entityLogicalName, this.context)];
                    case 1:
                        attributesMetadata = _a.sent(), attributesInterfaces = {};
                        _i = 0, attributesMetadata_1 = attributesMetadata;
                        _a.label = 2;
                    case 2:
                        if (!(_i < attributesMetadata_1.length)) return [3 /*break*/, 5];
                        attribute = attributesMetadata_1[_i];
                        AttributeType = attribute.AttributeType, LogicalName = attribute.LogicalName;
                        return [4 /*yield*/, this.getInterfaceType(attribute)];
                    case 3:
                        interfaceType = _a.sent();
                        if (interfaceType) {
                            attributesInterfaces[LogicalName] = interfaceType;
                        }
                        else {
                            this.log("To be implemented: " + AttributeType + " for " + LogicalName);
                        }
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, attributesInterfaces];
                }
            });
        });
    };
    // https://docs.microsoft.com/en-us/dotnet/api/microsoft.xrm.sdk.metadata.attributemetadata?view=dynamics-general-ce-9
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Model.prototype.getInterfaceType = function (attribute) {
        return __awaiter(this, void 0, void 0, function () {
            var attributeType, logicalName, options, options;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        attributeType = attribute.AttributeType, logicalName = attribute.LogicalName;
                        if (!['String', 'Memo', 'DateTime', 'Lookup', 'Customer', 'Owner', 'Uniqueidentifier'].includes(attributeType)) return [3 /*break*/, 1];
                        return [2 /*return*/, 'string'];
                    case 1:
                        if (!['Boolean'].includes(attributeType)) return [3 /*break*/, 2];
                        // const options = await NodeApi.getBooleanOptionSet(this.entityLogicalName, logicalName, this.bearer);
                        // return options.map(option => option.value).join(' | ');
                        return [2 /*return*/, 'boolean'];
                    case 2:
                        if (!['Picklist'].includes(attributeType)) return [3 /*break*/, 3];
                        return [2 /*return*/, this.getTypeName(logicalName) + 'Values'];
                    case 3:
                        if (!['Integer', 'Double', 'BigInt', 'Decimal', 'Double', 'Money'].includes(attributeType)) return [3 /*break*/, 4];
                        return [2 /*return*/, 'number'];
                    case 4:
                        if (!['Status'].includes(attributeType)) return [3 /*break*/, 6];
                        return [4 /*yield*/, NodeApi_1.NodeApi.getStatusOptionSet(this.entityLogicalName, this.context)];
                    case 5:
                        options = _a.sent();
                        return [2 /*return*/, options.map(function (option) { return option.value; }).join(' | ')];
                    case 6:
                        if (!['State'].includes(attributeType)) return [3 /*break*/, 8];
                        return [4 /*yield*/, NodeApi_1.NodeApi.getStateOptionSet(this.entityLogicalName, this.context)];
                    case 7:
                        options = _a.sent();
                        return [2 /*return*/, options.map(function (option) { return option.value; }).join(' | ')];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    Model.prototype.getTypeName = function (logicalName) {
        var publisher_prefix = this.settings.crm.publisher_prefix, typeName = logicalName.replace(publisher_prefix + "_", '');
        return Model.capitalize(typeName);
    };
    Model.prototype.getTypeStrings = function () {
        return __awaiter(this, void 0, void 0, function () {
            var typeStrings, attributesMetadata, _i, attributesMetadata_2, attribute, attributeType, logicalName, options, types;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        typeStrings = '';
                        return [4 /*yield*/, NodeApi_1.NodeApi.getAttributesMetadata(this.entityLogicalName, this.context)];
                    case 1:
                        attributesMetadata = _a.sent();
                        _i = 0, attributesMetadata_2 = attributesMetadata;
                        _a.label = 2;
                    case 2:
                        if (!(_i < attributesMetadata_2.length)) return [3 /*break*/, 5];
                        attribute = attributesMetadata_2[_i];
                        attributeType = attribute.AttributeType, logicalName = attribute.LogicalName;
                        if (!(attributeType === 'Picklist')) return [3 /*break*/, 4];
                        return [4 /*yield*/, NodeApi_1.NodeApi.getPicklistOptionSet(this.entityLogicalName, logicalName, this.context)];
                    case 3:
                        options = _a.sent(), types = options.map(function (option) { return option.value; }).join(' | ');
                        typeStrings += "type " + this.getTypeName(logicalName) + "Values = " + types + ";\n";
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5:
                        typeStrings += '\n';
                        return [2 /*return*/, typeStrings];
                }
            });
        });
    };
    Model.prototype.getEnumStrings = function () {
        return __awaiter(this, void 0, void 0, function () {
            var enumStrings, attributesMetadata, _i, attributesMetadata_3, attribute, attributeType, logicalName, options, _a, options_1, option;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        enumStrings = '';
                        return [4 /*yield*/, NodeApi_1.NodeApi.getAttributesMetadata(this.entityLogicalName, this.context)];
                    case 1:
                        attributesMetadata = _b.sent();
                        _i = 0, attributesMetadata_3 = attributesMetadata;
                        _b.label = 2;
                    case 2:
                        if (!(_i < attributesMetadata_3.length)) return [3 /*break*/, 5];
                        attribute = attributesMetadata_3[_i];
                        attributeType = attribute.AttributeType, logicalName = attribute.LogicalName;
                        if (!(attributeType === 'Picklist')) return [3 /*break*/, 4];
                        enumStrings += "export enum " + this.getTypeName(logicalName) + " {\n";
                        return [4 /*yield*/, NodeApi_1.NodeApi.getPicklistOptionSet(this.entityLogicalName, logicalName, this.context)];
                    case 3:
                        options = _b.sent();
                        for (_a = 0, options_1 = options; _a < options_1.length; _a++) {
                            option = options_1[_a];
                            enumStrings += "    " + option.label.replace(/\s/g, '') + " = " + option.value + ",\n";
                        }
                        enumStrings += '}\n';
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5:
                        enumStrings += '\n';
                        return [2 /*return*/, enumStrings];
                }
            });
        });
    };
    Object.defineProperty(Model, "logicalNameRegex", {
        get: function () {
            return /static\slogicalName\s=\s'(.*)';/gm;
        },
        enumerable: true,
        configurable: true
    });
    Model.getEntityLogicalName = function (entityname) {
        var filepath = "src/" + entityname + "/" + entityname + ".service.ts";
        if (shell.test('-f', filepath)) {
            var filedata = String(fs.readFileSync(filepath)), match = Model.logicalNameRegex.exec(filedata), entityLogicalName = match && match[1] || '';
            if (!entityLogicalName) {
                console.log(colors.red("File " + filepath + " does not contains a logicalName field."));
            }
            return entityLogicalName;
        }
        else {
            console.log(colors.red("Entity " + entityname + " does not exist. Please add first by following command:\nHSO-D365 generate Entity " + entityname));
        }
    };
    Model.defaultModelAttributes = ['createdonbehalfbyyominame', 'owneridname', 'importsequencenumber', 'modifiedbyyominame', 'utcconversiontimezonecode',
        'createdbyyominame', 'modifiedbyname', 'timezoneruleversionnumber', 'owneridyominame', 'modifiedon', 'modifiedonbehalfbyyominame', 'createdbyname',
        'createdon', 'createdonbehalfbyname', 'modifiedonbehalfbyname', 'versionnumber', 'overriddencreatedon', 'owningbusinessunit', 'owningteam',
        'modifiedby', 'createdby', 'modifiedonbehalfby', 'owninguser', 'createdonbehalfby', 'statecode', 'statuscode', 'ownerid'];
    return Model;
}(AdalRouter_1.AdalRouter));
exports.Model = Model;


/***/ }),

/***/ "./src/generator/Webresource.ts":
/*!**************************************!*\
  !*** ./src/generator/Webresource.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var colors = __webpack_require__(/*! colors */ "colors");
var shell = __webpack_require__(/*! shelljs */ "shelljs");
var inquirer = __webpack_require__(/*! inquirer */ "inquirer");
var Variables_1 = __webpack_require__(/*! ../Variables */ "./src/Variables.ts");
var Webresource = /** @class */ (function () {
    function Webresource() {
    }
    Webresource.generateWebresource = function (webresourcename) {
        var check = shell.grep(" " + webresourcename + ":", 'webpack.config.js');
        if (!webresourcename) {
            console.log(colors.red('Webresource name missing'));
        }
        else if (!new RegExp('[A-Z]').test(webresourcename[0])) {
            console.log(colors.red("Webresource name must be UpperCamelCase!"));
        }
        else if (check.stdout !== '\n') {
            console.log(colors.red("echo Webresource " + webresourcename + " already exists!"));
        }
        else if (process.argv[5]) {
            console.log(colors.red("echo No spaces allowed!"));
        }
        else {
            return Webresource.generate(webresourcename);
        }
    };
    Webresource.generate = function (webresourcename) {
        return __awaiter(this, void 0, void 0, function () {
            var answers, template, _a, publisher, namespace, srcDir, webpackConfigFile, extension;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log("Adding D365 Webresource " + webresourcename + "...");
                        return [4 /*yield*/, inquirer.prompt([{
                                    type: 'list',
                                    name: 'template',
                                    message: 'Which template do you want?',
                                    choices: [
                                        'HTML',
                                        'React'
                                    ]
                                }])];
                    case 1:
                        answers = _b.sent(), template = answers.template;
                        return [4 /*yield*/, Variables_1.Variables.get()];
                    case 2:
                        _a = _b.sent(), publisher = _a.publisher, namespace = _a.namespace;
                        shell.mkdir("src/" + webresourcename);
                        srcDir = __dirname + "/Webresource" + (template === 'React' ? 'Tsx' : '') + "/*.*";
                        shell.ls(srcDir).forEach(function (file) {
                            var split = file.split('/');
                            var filename = split[split.length - 1];
                            var newfilename = filename.replace(/Webresource/g, webresourcename);
                            shell.cp('-r', file, "src/" + webresourcename);
                            shell.cp('-r', "src/" + webresourcename + "/" + filename, "src/" + webresourcename + "/" + newfilename);
                            shell.rm('-rf', "src/" + webresourcename + "/" + filename);
                            shell.sed('-i', new RegExp('Webresource', 'ig'), webresourcename, "src/" + webresourcename + "/" + newfilename);
                            shell.sed('-i', new RegExp('<%= publisher %>', 'ig'), publisher, "src/" + webresourcename + "/" + newfilename);
                            shell.sed('-i', new RegExp('<%= namespace %>', 'ig'), namespace, "src/" + webresourcename + "/" + newfilename);
                            shell.exec("git add src/" + webresourcename + "/" + newfilename);
                        });
                        webpackConfigFile = shell.ls('webpack.config.js')[0], extension = template === 'React' ? 'tsx' : 'ts';
                        // eslint-disable-next-line max-len
                        shell.sed('-i', 'entry: {', "entry: {\n        " + webresourcename + ": [\n            path.resolve(__dirname, \"src/" + webresourcename + "/" + webresourcename + "." + extension + "\")\n        ],", webpackConfigFile);
                        shell.exec('git add webpack.config.js');
                        console.log('Adding D365 Webresource done');
                        return [2 /*return*/];
                }
            });
        });
    };
    return Webresource;
}());
exports.Webresource = Webresource;


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var shell = __webpack_require__(/*! shelljs */ "shelljs");
var program = __webpack_require__(/*! commander */ "commander");
var Create_1 = __webpack_require__(/*! ./Create */ "./src/Create.ts");
var update_1 = __webpack_require__(/*! ./update */ "./src/update.ts");
var Generator_1 = __webpack_require__(/*! ./generator/Generator */ "./src/generator/Generator.ts");
var Variables_1 = __webpack_require__(/*! ./Variables */ "./src/Variables.ts");
var DeployAssembly_1 = __webpack_require__(/*! ./root/tools/deploy/DeployAssembly */ "./src/root/tools/deploy/DeployAssembly.ts");
program
    .version('1.8.0') // .version(require('../package').version)
    .usage('<command> [options]');
program
    .command('new <project>')
    .alias('n')
    .description('Creates a new workspace and an initial Webresource setup')
    .action(function (project) {
    Create_1.Create.createProject(project);
})
    .on('--help', function () {
    Create_1.Create.showCreateHelp();
});
program
    .command('generate <schematic> [name]')
    .alias('g')
    .description('Generates and/or modifies files bases on a schematic.')
    .action(function (schematic, name) {
    Generator_1.Generator.generate(schematic, name);
})
    .on('--help', function () {
    Generator_1.Generator.showGenerateHelp();
});
program
    .command('extractTranslations')
    .alias('extract')
    .description('Extracts translations into resx or json files, dependent on crm.json translation setting.')
    .action(function () { return __awaiter(void 0, void 0, void 0, function () {
    var variables;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Variables_1.Variables.get()];
            case 1:
                variables = _a.sent();
                if (variables.translationtype === 'i18n') {
                    console.log('Extracting i18n json files');
                    shell.exec('npm run i18next-scanner');
                }
                else {
                    console.log('Extracting resx files');
                    shell.exec('npm run resx');
                }
                return [2 /*return*/];
        }
    });
}); })
    .on('--help', function () {
    console.log("In translation folder a folder 'locales' will be generated having translation files.");
    console.log('When your translation setting is i18n, it will generate a json files for each language specified in i18next-scanner.config.js');
    console.log("When your translation setting is resx, it will generate one locales.resx file.");
    console.log("You have to add for each required language a copy yourself like locales.1033.resx.");
    console.log("Once done, the tooling will keep up-to-date for you.");
});
/* easy debugging/programming
program
    .command('resx')
    .description('Extracts translation to resx files')
    .action(() => {
        Resx.extract();
    });
 */
program
    .command('lint')
    .alias('l')
    .description('Runs linting tools on project code')
    .action(function () {
    shell.exec('npm run lint');
})
    .on('--help', function () {
    console.log("Runs linting tools on project code using the configuration as specified in your projects '.eslintrc.json' file");
});
program
    .command('build')
    .alias('b')
    .description('Compiles project into an output directory named dist')
    .action(function () {
    shell.exec('npm run build:prod');
})
    .on('--help', function () {
    console.log("The command can be used to build the project to be distributed to the D365 environment using the 'deploy' command");
});
/*
program
    .command('deploy <type>')
    .alias('d')
    .description('Invokes the deploy builder')
    .action((type: string) => {
        shell.exec('npm run deploy');
    })
    .on('--help', () => {
        console.log(`Distributes the project to the D365 environment. You need to run the 'build' command first`);
    });
*/
// easy debugging/programming
program
    .command('deploy [type]')
    .description('Invokes the deploy builder')
    .action(function (type) {
    if (!type || type.toLowerCase() === 'webresource') {
        shell.exec('npm run deploy');
    }
    else {
        new DeployAssembly_1.DeployAssembly();
    }
});
//
program
    .command('update')
    .alias('u')
    .description('Updates existing workspace and Webresource setup')
    .action(function () {
    update_1.Update.updateProject();
})
    .on('--help', function () {
    update_1.Update.showUpdateHelp();
});
program
    .command('setFormCustomizable <customizable>')
    .alias('f')
    .description('Sets the Solution forms iscustomizable/canbedeleted true/false')
    .action(function (customizable) {
    shell.exec("npm run setFormCustomizable:" + (customizable ? 'true' : 'false'));
})
    .on('--help', function () {
    console.log("Sets the Solution forms iscustomizable/canbedeleted true/false");
});
program
    .command('showFiddlerRule')
    .alias('fiddler')
    .description('Show the Fiddler AutoResponder Rule Editor lines')
    .action(function () { return __awaiter(void 0, void 0, void 0, function () {
    var variables, publisher, namespace, regex, path, location;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Variables_1.Variables.get()];
            case 1:
                variables = _a.sent(), publisher = variables.publisher, namespace = variables.namespace, regex = "REGEX:(?insx).+\\/" + publisher + "_\\/" + namespace + "\\/(?'foldername'[^?]*)\\/(?'fname'[^?]*.js)", path = process.cwd(), location = path + "\\dist\\" + publisher + "_\\" + namespace + "\\${foldername}\\${fname}";
                console.log("Please add to first Rule Editor line (including REGEX:): \n" + regex);
                console.log("Please add to second Rule Editor line: \n" + location);
                return [2 /*return*/];
        }
    });
}); });
program
    .arguments('<command>')
    .action(function () {
    program.outputHelp();
    console.log('');
    console.log("echo Unknown command!");
});
program.parse(process.argv);


/***/ }),

/***/ "./src/root/tools/AdalRouter.ts":
/*!**************************************!*\
  !*** ./src/root/tools/AdalRouter.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = __webpack_require__(/*! express */ "express");
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
var open = __webpack_require__(/*! open */ "open");
var fs = __webpack_require__(/*! fs */ "fs");
var AdalRouter = /** @class */ (function () {
    function AdalRouter() {
        var _this = this;
        this.sockets = [];
        this.context = {
            log: function (message) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.log(message)];
                });
            }); },
            settings: JSON.parse(fs.readFileSync('../crm.json', 'utf8')) // project root folder
        };
        this.express = express();
        this.express.use(express.static('node_modules/adal-angular/dist'));
        this.mountRoutes();
        this.startListen();
    }
    Object.defineProperty(AdalRouter.prototype, "settings", {
        get: function () {
            return this.context.settings;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdalRouter.prototype, "bearer", {
        get: function () {
            return this.context.bearer;
        },
        set: function (bearer) {
            this.context.bearer = bearer;
        },
        enumerable: true,
        configurable: true
    });
    AdalRouter.prototype.startListen = function () {
        var _this = this;
        var redirectUriSplit = this.settings.adal.redirectUri.split('/'), portSplit = redirectUriSplit[redirectUriSplit.length - 2].split(':'), port = parseInt(portSplit[1]), openUrl = redirectUriSplit.slice(0, redirectUriSplit.length - 1).join('/');
        this.httpServer = this.express.listen(port, function () {
            open(openUrl);
            return console.log("server is listening on " + port);
        });
        this.httpServer.on('connection', function (socket) {
            _this.sockets.push(socket);
        });
    };
    AdalRouter.prototype.mountRoutes = function () {
        var router = express.Router();
        AdalRouter.mountDefaultRoute(router);
        this.mountAuthRoute(router);
        this.mountTokenRoute(router);
        this.mountAuthenticatedRoute(router);
        this.express.use('/', router);
        return router;
    };
    AdalRouter.mountDefaultRoute = function (router) {
        router.get('/', function (req, res) {
            res.redirect('/auth');
        });
    };
    AdalRouter.prototype.mountAuthRoute = function (router) {
        var _this = this;
        router.get('/auth', function (req, res) {
            res.send("\n                <head>\n                    <title>test</title>\n                </head>\n                <body>\n                    <!--script src=\"adal.min.js\"></script-->\n                    <script src=\"https://secure.aadcdn.microsoftonline-p.com/lib/1.0.17/js/adal.min.js\"></script>\n                    <script src=\"https://secure.aadcdn.microsoftonline-p.com/lib/1.0.17/js/adal-angular.min.js\"></script>\n                    <script>\n                        var config = {\n                            clientId: \"" + _this.settings.adal.clientId + "\",\n                            popUp: true,\n                            callback: function (errorDesc, token, error, tokenType) {\n                                authContext.acquireToken('" + _this.settings.crm.url + "', function (errorDesc, token, error) {\n                                    if (!error) {\n                                        window.location.href = \"/token/\" + token;\n                                    }\n                                });\n                            }\n                        }\n                        var authContext = new AuthenticationContext(config);\n                        if (authContext.isCallback(window.location.hash)) {\n                            authContext.handleWindowCallback();\n                        } else {\n                            authContext.login();\n                        }\n                    </script>\n                </body>");
        });
    };
    AdalRouter.prototype.mountTokenRoute = function (router) {
        var _this = this;
        router.get('/token/:token', function (req, res) {
            _this.bearer = req.params.token;
            res.redirect('/authenticated');
        });
    };
    AdalRouter.prototype.mountAuthenticatedRoute = function (router) {
        var _this = this;
        router.get('/authenticated', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        res.setHeader('Connection', 'Transfer-Encoding');
                        res.setHeader('Content-Type', 'text/html; charset=utf-8');
                        res.setHeader('Transfer-Encoding', 'chunked');
                        res.flushHeaders();
                        // this.context.response = res;
                        this.response = res;
                        return [4 /*yield*/, this.onAuthenticated()];
                    case 1:
                        _a.sent();
                        setTimeout(function () {
                            _this.httpServer.close(function () {
                                return console.log("server stopped listening");
                            });
                            for (var _i = 0, _a = _this.sockets; _i < _a.length; _i++) {
                                var socket = _a[_i];
                                socket.destroy();
                            }
                        }, 100);
                        res.send();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    AdalRouter.prototype.onAuthenticated = function () {
        return Promise.resolve();
    };
    AdalRouter.prototype.log = function (message) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.response.write(message + "<br/>", function () {
                _this.response.flushHeaders();
                resolve();
            });
        });
    };
    return AdalRouter;
}());
exports.AdalRouter = AdalRouter;


/***/ }),

/***/ "./src/root/tools/NodeApi/NodeApi.ts":
/*!*******************************************!*\
  !*** ./src/root/tools/NodeApi/NodeApi.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var https = __webpack_require__(/*! https */ "https");
var NodeApi = /** @class */ (function () {
    function NodeApi() {
    }
    NodeApi.retrieveMultipleRecords = function (entitySetName, options, context) {
        return __awaiter(this, void 0, void 0, function () {
            var query, settings, bearer, crm, url, version, uri, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = NodeApi.getSystemQueryOptions(options), settings = context.settings, bearer = context.bearer, crm = settings.crm, url = crm.url, version = crm.version, uri = url + "/api/data/v" + version + "/" + entitySetName + query;
                        return [4 /*yield*/, NodeApi.request('GET', uri, null, {
                                'Authorization': "Bearer " + bearer
                            })];
                    case 1:
                        body = (_a.sent()).body;
                        return [2 /*return*/, body.value];
                }
            });
        });
    };
    NodeApi.retrieveRecord = function (entitySetName, id, options, context) {
        return __awaiter(this, void 0, void 0, function () {
            var query, settings, bearer, crm, url, version, uri, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = NodeApi.getSystemQueryOptions(options), settings = context.settings, bearer = context.bearer, crm = settings.crm, url = crm.url, version = crm.version, uri = url + "/api/data/v" + version + "/" + entitySetName + "(" + id + ")" + query;
                        return [4 /*yield*/, NodeApi.request('GET', uri, null, {
                                'Authorization': "Bearer " + bearer
                            })];
                    case 1:
                        body = (_a.sent()).body;
                        return [2 /*return*/, body];
                }
            });
        });
    };
    NodeApi.updateRecord = function (entitySetName, id, model, context) {
        return __awaiter(this, void 0, void 0, function () {
            var settings, bearer, crm, url, version, uri, request;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        settings = context.settings, bearer = context.bearer, crm = settings.crm, url = crm.url, version = crm.version, uri = url + "/api/data/v" + version + "/" + entitySetName + "(" + id + ")";
                        return [4 /*yield*/, NodeApi.request('PATCH', uri, model, {
                                'Authorization': "Bearer " + bearer,
                                'Prefer': 'return=representation'
                            })];
                    case 1:
                        request = _a.sent();
                        return [2 /*return*/, request.body];
                }
            });
        });
    };
    NodeApi.insertRecord = function (entitySetName, model, context) {
        return __awaiter(this, void 0, void 0, function () {
            var settings, bearer, crm, url, version, uri, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        settings = context.settings, bearer = context.bearer, crm = settings.crm, url = crm.url, version = crm.version, uri = url + "/api/data/v" + version + "/" + entitySetName;
                        return [4 /*yield*/, NodeApi.request('POST', uri, model, {
                                'Authorization': "Bearer " + bearer,
                                'Prefer': 'return=representation'
                            })];
                    case 1:
                        body = (_a.sent()).body;
                        return [2 /*return*/, body];
                }
            });
        });
    };
    NodeApi.getStatusOptionSet = function (entityLogicalName, context) {
        return __awaiter(this, void 0, void 0, function () {
            var settings, bearer, crm, url, version, 
            // eslint-disable-next-line max-len
            uri, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        settings = context.settings, bearer = context.bearer, crm = settings.crm, url = crm.url, version = crm.version, uri = url + "/api/data/v" + version + "/EntityDefinitions(LogicalName='" + entityLogicalName + "')/Attributes/Microsoft.Dynamics.CRM.StatusAttributeMetadata?$expand=OptionSet";
                        return [4 /*yield*/, NodeApi.request('GET', uri, null, {
                                'Authorization': "Bearer " + bearer
                            })];
                    case 1:
                        body = (_a.sent()).body;
                        return [2 /*return*/, body.value[0].OptionSet.Options.map(function (option) {
                                return {
                                    value: option.Value,
                                    externalValue: option.ExternalValue,
                                    label: option.Label.UserLocalizedLabel.Label
                                };
                            })];
                }
            });
        });
    };
    NodeApi.getStateOptionSet = function (entityLogicalName, context) {
        return __awaiter(this, void 0, void 0, function () {
            var settings, bearer, crm, url, version, 
            // eslint-disable-next-line max-len
            uri, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        settings = context.settings, bearer = context.bearer, crm = settings.crm, url = crm.url, version = crm.version, uri = url + "/api/data/v" + version + "/EntityDefinitions(LogicalName='" + entityLogicalName + "')/Attributes/Microsoft.Dynamics.CRM.StateAttributeMetadata?$expand=OptionSet";
                        return [4 /*yield*/, NodeApi.request('GET', uri, null, {
                                'Authorization': "Bearer " + bearer
                            })];
                    case 1:
                        body = (_a.sent()).body;
                        return [2 /*return*/, body.value[0].OptionSet.Options.map(function (option) {
                                return {
                                    value: option.Value,
                                    externalValue: option.ExternalValue,
                                    label: option.Label.UserLocalizedLabel.Label
                                };
                            })];
                }
            });
        });
    };
    NodeApi.getPicklistOptionSet = function (entityLogicalName, attribute, context) {
        return __awaiter(this, void 0, void 0, function () {
            var settings, bearer, crm, url, version, 
            // eslint-disable-next-line max-len
            uri, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        settings = context.settings, bearer = context.bearer, crm = settings.crm, url = crm.url, version = crm.version, uri = url + "/api/data/v" + version + "/EntityDefinitions(LogicalName='" + entityLogicalName + "')/Attributes(LogicalName='" + attribute + "')/Microsoft.Dynamics.CRM.PicklistAttributeMetadata?$select=LogicalName&$expand=OptionSet($select=Options)";
                        return [4 /*yield*/, NodeApi.request('GET', uri, null, {
                                'Authorization': "Bearer " + bearer
                            })];
                    case 1:
                        body = (_a.sent()).body;
                        return [2 /*return*/, body.OptionSet.Options.map(function (option) {
                                return {
                                    value: option.Value,
                                    externalValue: option.ExternalValue,
                                    label: option.Label.UserLocalizedLabel.Label
                                };
                            })];
                }
            });
        });
    };
    NodeApi.getBooleanOptionSet = function (entityLogicalName, attribute, context) {
        return __awaiter(this, void 0, void 0, function () {
            var settings, bearer, crm, url, version, 
            // eslint-disable-next-line max-len
            uri, body, optionSet, FalseOption, TrueOption;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        settings = context.settings, bearer = context.bearer, crm = settings.crm, url = crm.url, version = crm.version, uri = url + "/api/data/v" + version + "/EntityDefinitions(LogicalName='" + entityLogicalName + "')/Attributes(LogicalName='" + attribute + "')/Microsoft.Dynamics.CRM.BooleanAttributeMetadata?$select=LogicalName&$expand=OptionSet($select=TrueOption,FalseOption)";
                        return [4 /*yield*/, NodeApi.request('GET', uri, null, {
                                'Authorization': "Bearer " + bearer
                            })];
                    case 1:
                        body = (_a.sent()).body, optionSet = body.OptionSet, FalseOption = optionSet.FalseOption, TrueOption = optionSet.TrueOption;
                        return [2 /*return*/, [{
                                    value: FalseOption.Value,
                                    label: FalseOption.Label.UserLocalizedLabel.Label
                                }, {
                                    value: TrueOption.Value,
                                    label: TrueOption.Label.UserLocalizedLabel.Label
                                }]];
                }
            });
        });
    };
    NodeApi.executeAction = function (actionName, context, data, entityLogicalName, id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (entityLogicalName) {
                    return [2 /*return*/, this.executeBoundAction(actionName, context, data, entityLogicalName, id)];
                }
                else {
                    return [2 /*return*/, this.executeUnboundAction(actionName, context, data)];
                }
                return [2 /*return*/];
            });
        });
    };
    NodeApi.executeBoundAction = function (actionName, context, data, entityLogicalName, id) {
        return __awaiter(this, void 0, void 0, function () {
            var metadata, settings, bearer, crm, url, version, uri, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Xrm.Utility.getEntityMetadata(entityLogicalName)];
                    case 1:
                        metadata = _a.sent(), settings = context.settings, bearer = context.bearer, crm = settings.crm, url = crm.url, version = crm.version, uri = url + "/api/data/v" + version + "/" + metadata.EntitySetName + "(" + id + ")/Microsoft.Dynamics.CRM." + actionName;
                        return [4 /*yield*/, NodeApi.request('POST', uri, data, {
                                'Authorization': "Bearer " + bearer
                            })];
                    case 2:
                        body = (_a.sent()).body;
                        return [2 /*return*/, body];
                }
            });
        });
    };
    NodeApi.executeUnboundAction = function (actionName, context, data) {
        return __awaiter(this, void 0, void 0, function () {
            var method, settings, bearer, crm, url, version, uri, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        method = data ? 'POST' : 'GET', settings = context.settings, bearer = context.bearer, crm = settings.crm, url = crm.url, version = crm.version, uri = url + "/api/data/v" + version + "/" + actionName;
                        return [4 /*yield*/, NodeApi.request(method, uri, data, {
                                'Authorization': "Bearer " + bearer
                            })];
                    case 1:
                        body = (_a.sent()).body;
                        return [2 /*return*/, body];
                }
            });
        });
    };
    NodeApi.getSystemQueryOptions = function (options) {
        var select = options.select, filters = options.filters, top = options.top, $select = NodeApi.generateSelect(select), $filter = NodeApi.generateFilter(filters), $top = top ? "$top=" + top : null, optionParts = [];
        if ($select) {
            optionParts.push($select);
        }
        if ($filter) {
            optionParts.push($filter);
        }
        if ($top) {
            optionParts.push($top);
        }
        return optionParts.length > 0 ? "?" + optionParts.join('&') : '';
    };
    NodeApi.generateSelect = function (attributes) {
        if (attributes === void 0) { attributes = []; }
        return attributes.length > 0 ? "$select=" + attributes.join(',') : null;
    };
    NodeApi.generateFilter = function (filters) {
        if (filters === void 0) { filters = []; }
        var filterAttributes = [];
        if (filters.length > 0) {
            for (var _i = 0, filters_1 = filters; _i < filters_1.length; _i++) {
                var filter = filters_1[_i];
                filterAttributes.push(NodeApi.parseFilter(filter));
            }
        }
        return filterAttributes.length > 0 ? "$filter=" + filterAttributes.join(' and ') : null;
    };
    NodeApi.parseFilter = function (filter) {
        var _a = filter.type, type = _a === void 0 ? 'and' : _a, conditions = filter.conditions, filterParts = [];
        for (var _i = 0, conditions_1 = conditions; _i < conditions_1.length; _i++) {
            var condition = conditions_1[_i];
            var attribute = condition.attribute, _b = condition.operator, operator = _b === void 0 ? 'eq' : _b, value = condition.value;
            var filterStr = attribute + " " + operator;
            filterStr += typeof (value) === 'string' ? " '" + value + "'" : " " + value; // String
            filterParts.push(filterStr);
        }
        return "" + filterParts.join(" " + type + " ");
    };
    NodeApi.request = function (method, uri, data, httpHeaders) {
        if (httpHeaders === void 0) { httpHeaders = {}; }
        return new Promise(function (resolve, reject) {
            var options = NodeApi.getRequestOptions(method, uri, httpHeaders, data);
            var req = https.request(options, function (response) {
                var body = '';
                response.setEncoding('utf8');
                response.on('data', function (chunk) { return body += chunk; });
                response.on('end', function () {
                    try {
                        resolve(NodeApi.handleNodeHttpsResponse(response, body));
                    }
                    catch (e) {
                        reject(e);
                    }
                });
            });
            req.on('error', function (error) {
                reject(error);
            });
            if (method !== 'GET') {
                req.write(data && JSON.stringify(data));
            }
            req.end();
        });
    };
    NodeApi.getRequestOptions = function (method, uri, httpHeaders, data) {
        var split = uri.split('/'), hostname = split[2], path = '/' + split.slice(3, split.length).join('/');
        var totalHeaders = Object.assign({}, NodeApi.jsonHeaders, httpHeaders);
        if (method !== 'GET') {
            var requestData = data && JSON.stringify(data);
            totalHeaders['Content-Length'] = requestData.length;
        }
        return {
            hostname: hostname,
            port: 443,
            path: encodeURI(path),
            method: method,
            headers: totalHeaders
        };
    };
    NodeApi.handleNodeHttpsResponse = function (response, bodyString) {
        var statusHandlers = {
            200: function () {
                return NodeApi.dataHandler(response, bodyString);
            },
            201: function () {
                return NodeApi.dataHandler(response, bodyString);
            },
            204: function () {
                return {
                    body: '',
                    getResponseHeader: function (headerName) {
                        return response.headers[headerName];
                    },
                    statusCode: response.statusCode
                };
            }
        };
        var statusHandler = statusHandlers[response.statusCode];
        if (statusHandler) {
            return statusHandler();
        }
        else {
            if (response.statusCode === 401) {
                throw new Error('Unauthorized');
            }
            throw new Error(response.statusCode + ": " + response.statusMessage + "\n " + bodyString);
        }
    };
    NodeApi.dataHandler = function (response, bodyString) {
        var body = null;
        try {
            body = JSON.parse(bodyString);
        }
        catch (ex) {
            throw new Error("JSON response can't be parsed");
        }
        return {
            body: body,
            getResponseHeader: function (headerName) {
                return response.headers[headerName];
            },
            statusCode: response.statusCode
        };
    };
    NodeApi.getEntityDefinition = function (entityLogicalName, context, select) {
        return __awaiter(this, void 0, void 0, function () {
            var settings, bearer, crm, url, version, uri, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        settings = context.settings, bearer = context.bearer, crm = settings.crm, url = crm.url, version = crm.version;
                        uri = url + "/api/data/v" + version + "/EntityDefinitions(LogicalName='" + entityLogicalName + "')";
                        if (select) {
                            uri += "?$select=" + select.join(',');
                        }
                        return [4 /*yield*/, NodeApi.request('GET', uri, null, {
                                'Authorization': "Bearer " + bearer
                            })];
                    case 1:
                        body = (_a.sent()).body;
                        return [2 /*return*/, body];
                }
            });
        });
    };
    NodeApi.getManyToOneMetadatas = function (entityLogicalName, context) {
        return __awaiter(this, void 0, void 0, function () {
            var settings, bearer, crm, url, version, uri, body, manyToOneMetadatas;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        settings = context.settings, bearer = context.bearer, crm = settings.crm, url = crm.url, version = crm.version;
                        uri = url + "/api/data/v" + version + "/EntityDefinitions(LogicalName='" + entityLogicalName + "')/ManyToOneRelationships";
                        return [4 /*yield*/, NodeApi.request('GET', uri, null, {
                                'Authorization': "Bearer " + bearer
                            })];
                    case 1:
                        body = (_a.sent()).body;
                        manyToOneMetadatas = body.value;
                        return [2 /*return*/, manyToOneMetadatas];
                }
            });
        });
    };
    NodeApi.getAttributesMetadata = function (entityLogicalName, context, select) {
        return __awaiter(this, void 0, void 0, function () {
            var settings, bearer, crm, url, version, uri, body, attributesMetadata;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        settings = context.settings, bearer = context.bearer, crm = settings.crm, url = crm.url, version = crm.version;
                        uri = url + "/api/data/v" + version + "/EntityDefinitions(LogicalName='" + entityLogicalName + "')/Attributes?$filter=IsValidODataAttribute eq true";
                        if (select) {
                            uri += "&$select=" + select.join(',');
                        }
                        return [4 /*yield*/, NodeApi.request('GET', uri, null, {
                                'Authorization': "Bearer " + bearer
                            })];
                    case 1:
                        body = (_a.sent()).body;
                        attributesMetadata = body.value;
                        return [2 /*return*/, attributesMetadata];
                }
            });
        });
    };
    NodeApi.jsonHeaders = {
        'OData-MaxVersion': '4.0',
        'OData-Version': '4.0',
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
    };
    return NodeApi;
}());
exports.NodeApi = NodeApi;
/* eslint-enable @typescript-eslint/no-explicit-any */


/***/ }),

/***/ "./src/root/tools/PluginAssembly/PluginAssembly.service.ts":
/*!*****************************************************************!*\
  !*** ./src/root/tools/PluginAssembly/PluginAssembly.service.ts ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var NodeApi_1 = __webpack_require__(/*! ../NodeApi/NodeApi */ "./src/root/tools/NodeApi/NodeApi.ts");
var PluginAssemblyService = /** @class */ (function () {
    function PluginAssemblyService() {
    }
    PluginAssemblyService.retrieveMultipleRecords = function (multipleSystemQueryOptions, context) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, NodeApi_1.NodeApi.retrieveMultipleRecords(PluginAssemblyService.entitySetName, multipleSystemQueryOptions, context)];
            });
        });
    };
    PluginAssemblyService.upsert = function (pluginAssembly, context) {
        return __awaiter(this, void 0, void 0, function () {
            var newWebresource;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!pluginAssembly.pluginassemblyid) return [3 /*break*/, 2];
                        return [4 /*yield*/, NodeApi_1.NodeApi.updateRecord(PluginAssemblyService.entitySetName, pluginAssembly.pluginassemblyid, pluginAssembly, context)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, pluginAssembly];
                    case 2: return [4 /*yield*/, NodeApi_1.NodeApi.insertRecord(PluginAssemblyService.entitySetName, pluginAssembly, context)];
                    case 3:
                        newWebresource = _a.sent();
                        return [2 /*return*/, newWebresource];
                }
            });
        });
    };
    PluginAssemblyService.entitySetName = 'pluginassemblies';
    return PluginAssemblyService;
}());
exports.PluginAssemblyService = PluginAssemblyService;


/***/ }),

/***/ "./src/root/tools/PluginType/PluginType.service.ts":
/*!*********************************************************!*\
  !*** ./src/root/tools/PluginType/PluginType.service.ts ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var NodeApi_1 = __webpack_require__(/*! ../NodeApi/NodeApi */ "./src/root/tools/NodeApi/NodeApi.ts");
var PluginTypeService = /** @class */ (function () {
    function PluginTypeService() {
    }
    PluginTypeService.retrieveMultipleRecords = function (multipleSystemQueryOptions, context) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, NodeApi_1.NodeApi.retrieveMultipleRecords(PluginTypeService.entitySetName, multipleSystemQueryOptions, context)];
            });
        });
    };
    PluginTypeService.upsert = function (pluginType, context) {
        return __awaiter(this, void 0, void 0, function () {
            var newWebresource;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!pluginType.plugintypeid) return [3 /*break*/, 2];
                        return [4 /*yield*/, NodeApi_1.NodeApi.updateRecord(PluginTypeService.entitySetName, pluginType.plugintypeid, pluginType, context)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, pluginType];
                    case 2: return [4 /*yield*/, NodeApi_1.NodeApi.insertRecord(PluginTypeService.entitySetName, pluginType, context)];
                    case 3:
                        newWebresource = _a.sent();
                        return [2 /*return*/, newWebresource];
                }
            });
        });
    };
    PluginTypeService.entitySetName = 'plugintypes';
    return PluginTypeService;
}());
exports.PluginTypeService = PluginTypeService;


/***/ }),

/***/ "./src/root/tools/SdkMessage/SdkMessage.service.ts":
/*!*********************************************************!*\
  !*** ./src/root/tools/SdkMessage/SdkMessage.service.ts ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var NodeApi_1 = __webpack_require__(/*! ../NodeApi/NodeApi */ "./src/root/tools/NodeApi/NodeApi.ts");
var SdkMessageService = /** @class */ (function () {
    function SdkMessageService() {
    }
    SdkMessageService.retrieveMultipleRecords = function (multipleSystemQueryOptions, context) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, NodeApi_1.NodeApi.retrieveMultipleRecords(SdkMessageService.entitySetName, multipleSystemQueryOptions, context)];
            });
        });
    };
    SdkMessageService.upsert = function (sdkMessageModel, context) {
        return __awaiter(this, void 0, void 0, function () {
            var newWebresource;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!sdkMessageModel.sdkmessageid) return [3 /*break*/, 2];
                        return [4 /*yield*/, NodeApi_1.NodeApi.updateRecord(SdkMessageService.entitySetName, sdkMessageModel.sdkmessageid, sdkMessageModel, context)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, sdkMessageModel];
                    case 2: return [4 /*yield*/, NodeApi_1.NodeApi.insertRecord(SdkMessageService.entitySetName, sdkMessageModel, context)];
                    case 3:
                        newWebresource = _a.sent();
                        return [2 /*return*/, newWebresource];
                }
            });
        });
    };
    SdkMessageService.entitySetName = 'sdkmessages';
    return SdkMessageService;
}());
exports.SdkMessageService = SdkMessageService;


/***/ }),

/***/ "./src/root/tools/SdkMessageFilter/SdmMessageFilter.service.ts":
/*!*********************************************************************!*\
  !*** ./src/root/tools/SdkMessageFilter/SdmMessageFilter.service.ts ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var NodeApi_1 = __webpack_require__(/*! ../NodeApi/NodeApi */ "./src/root/tools/NodeApi/NodeApi.ts");
var SdkMessageFilterService = /** @class */ (function () {
    function SdkMessageFilterService() {
    }
    SdkMessageFilterService.retrieveMultipleRecords = function (multipleSystemQueryOptions, context) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, NodeApi_1.NodeApi.retrieveMultipleRecords(SdkMessageFilterService.entitySetName, multipleSystemQueryOptions, context)];
            });
        });
    };
    SdkMessageFilterService.upsert = function (sdkMessageFilterModel, context) {
        return __awaiter(this, void 0, void 0, function () {
            var newWebresource;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!sdkMessageFilterModel.sdkmessagefilterid) return [3 /*break*/, 2];
                        return [4 /*yield*/, NodeApi_1.NodeApi.updateRecord(SdkMessageFilterService.entitySetName, sdkMessageFilterModel.sdkmessagefilterid, sdkMessageFilterModel, context)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, sdkMessageFilterModel];
                    case 2: return [4 /*yield*/, NodeApi_1.NodeApi.insertRecord(SdkMessageFilterService.entitySetName, sdkMessageFilterModel, context)];
                    case 3:
                        newWebresource = _a.sent();
                        return [2 /*return*/, newWebresource];
                }
            });
        });
    };
    SdkMessageFilterService.entitySetName = 'sdkmessagefilters';
    return SdkMessageFilterService;
}());
exports.SdkMessageFilterService = SdkMessageFilterService;


/***/ }),

/***/ "./src/root/tools/SdkMessageProcessingStep/SdkMessageProcessingStep.service.ts":
/*!*************************************************************************************!*\
  !*** ./src/root/tools/SdkMessageProcessingStep/SdkMessageProcessingStep.service.ts ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var NodeApi_1 = __webpack_require__(/*! ../NodeApi/NodeApi */ "./src/root/tools/NodeApi/NodeApi.ts");
var ComponentType_1 = __webpack_require__(/*! ../Solution/ComponentType */ "./src/root/tools/Solution/ComponentType.ts");
var SdkMessageProcessingStepService = /** @class */ (function () {
    function SdkMessageProcessingStepService() {
    }
    SdkMessageProcessingStepService.retrieveMultipleRecords = function (multipleSystemQueryOptions, context) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, NodeApi_1.NodeApi.retrieveMultipleRecords(SdkMessageProcessingStepService.entitySetName, multipleSystemQueryOptions, context)];
            });
        });
    };
    SdkMessageProcessingStepService.upsert = function (sdkMessageProcessingStepModel, context) {
        return __awaiter(this, void 0, void 0, function () {
            var newWebresource;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!sdkMessageProcessingStepModel.sdkmessageprocessingstepid) return [3 /*break*/, 2];
                        return [4 /*yield*/, NodeApi_1.NodeApi.updateRecord(SdkMessageProcessingStepService.entitySetName, sdkMessageProcessingStepModel.sdkmessageprocessingstepid, sdkMessageProcessingStepModel, context)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, sdkMessageProcessingStepModel];
                    case 2: return [4 /*yield*/, NodeApi_1.NodeApi.insertRecord(SdkMessageProcessingStepService.entitySetName, sdkMessageProcessingStepModel, context)];
                    case 3:
                        newWebresource = _a.sent();
                        return [2 /*return*/, newWebresource];
                }
            });
        });
    };
    SdkMessageProcessingStepService.addToSolution = function (step, context) {
        return __awaiter(this, void 0, void 0, function () {
            var settings, crm, solution_name;
            return __generator(this, function (_a) {
                settings = context.settings, crm = settings.crm, solution_name = crm.solution_name;
                return [2 /*return*/, NodeApi_1.NodeApi.executeAction('AddSolutionComponent', context, {
                        ComponentId: step.sdkmessageprocessingstepid,
                        ComponentType: ComponentType_1.ComponentType.SdkMessageProcessingStep,
                        SolutionUniqueName: solution_name,
                        AddRequiredComponents: false,
                        IncludedComponentSettingsValues: null
                    })];
            });
        });
    };
    SdkMessageProcessingStepService.entitySetName = 'sdkmessageprocessingsteps';
    return SdkMessageProcessingStepService;
}());
exports.SdkMessageProcessingStepService = SdkMessageProcessingStepService;


/***/ }),

/***/ "./src/root/tools/Solution/ComponentType.ts":
/*!**************************************************!*\
  !*** ./src/root/tools/Solution/ComponentType.ts ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// https://docs.microsoft.com/en-us/dynamics365/customer-engagement/web-api/solutioncomponent?view=dynamics-ce-odata-9
var ComponentType;
(function (ComponentType) {
    ComponentType[ComponentType["Webresource"] = 61] = "Webresource";
    ComponentType[ComponentType["PluginType"] = 90] = "PluginType";
    ComponentType[ComponentType["PluginAssembly"] = 91] = "PluginAssembly";
    ComponentType[ComponentType["SdkMessageProcessingStep"] = 92] = "SdkMessageProcessingStep";
    ComponentType[ComponentType["SdkMessageProcessingStepImage"] = 93] = "SdkMessageProcessingStepImage";
})(ComponentType = exports.ComponentType || (exports.ComponentType = {}));


/***/ }),

/***/ "./src/root/tools/deploy/Deploy.ts":
/*!*****************************************!*\
  !*** ./src/root/tools/deploy/Deploy.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var AdalRouter_1 = __webpack_require__(/*! ../AdalRouter */ "./src/root/tools/AdalRouter.ts");
var crypto = __webpack_require__(/*! crypto */ "crypto");
var fs = __webpack_require__(/*! fs */ "fs");
var Deploy = /** @class */ (function (_super) {
    __extends(Deploy, _super);
    function Deploy() {
        var _this = _super.call(this) || this;
        _this.md5 = function (contents) { return crypto.createHash('md5').update(contents).digest('hex'); };
        _this.config = JSON.parse(fs.readFileSync('tools/config.json', 'utf8') || '{}');
        return _this;
    }
    Deploy.prototype.onAuthenticated = function () {
        return this.deploy();
    };
    Deploy.prototype.deploy = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error('Not implemented');
            });
        });
    };
    return Deploy;
}(AdalRouter_1.AdalRouter));
exports.Deploy = Deploy;


/***/ }),

/***/ "./src/root/tools/deploy/DeployAssembly.ts":
/*!*************************************************!*\
  !*** ./src/root/tools/deploy/DeployAssembly.ts ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __webpack_require__(/*! fs */ "fs");
var PluginAssembly_service_1 = __webpack_require__(/*! ../PluginAssembly/PluginAssembly.service */ "./src/root/tools/PluginAssembly/PluginAssembly.service.ts");
var DeployPluginType_1 = __webpack_require__(/*! ./DeployPluginType */ "./src/root/tools/deploy/DeployPluginType.ts");
var Deploy_1 = __webpack_require__(/*! ./Deploy */ "./src/root/tools/deploy/Deploy.ts");
var DeployAssembly = /** @class */ (function (_super) {
    __extends(DeployAssembly, _super);
    function DeployAssembly() {
        var _this = _super.call(this) || this;
        _this.context.config = _this.config;
        return _this;
    }
    DeployAssembly.prototype.deploy = function () {
        return __awaiter(this, void 0, void 0, function () {
            var pluginAssembly;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pluginAssembly = this.config.pluginassembly;
                        if (!pluginAssembly) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.upsertPluginAssembly(pluginAssembly)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.log('No plugin assembly files configured')];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DeployAssembly.prototype.upsertPluginAssembly = function (pluginAssembly) {
        return __awaiter(this, void 0, void 0, function () {
            var deployedPluginAssembly, deployPluginType;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.log("<b>Pluginassembly</b><br/>'" + pluginAssembly.name + ".dll'")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getDeployedPluginAssembly(pluginAssembly)];
                    case 2:
                        deployedPluginAssembly = _a.sent();
                        if (!deployedPluginAssembly) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.updatePluginAssembly(deployedPluginAssembly, pluginAssembly)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, this.log('assembly not found')];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [4 /*yield*/, this.log("")];
                    case 7:
                        _a.sent();
                        deployPluginType = new DeployPluginType_1.DeployPluginType(this.context);
                        return [4 /*yield*/, deployPluginType.deployPluginTypes(deployedPluginAssembly)];
                    case 8:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DeployAssembly.prototype.getDeployedPluginAssembly = function (assemblyFile) {
        return __awaiter(this, void 0, void 0, function () {
            var pluginAssemblies, pluginAssembly;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, PluginAssembly_service_1.PluginAssemblyService.retrieveMultipleRecords({
                            select: ['pluginassemblyid', 'content', 'name'],
                            filters: [{
                                    conditions: [{
                                            attribute: 'name',
                                            value: assemblyFile.name
                                        }]
                                }]
                        }, this.context)];
                    case 1:
                        pluginAssemblies = _a.sent(), pluginAssembly = pluginAssemblies[0];
                        return [4 /*yield*/, this.log("Deployed assembly file '" + pluginAssembly.name + ".dll' found.")];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, pluginAssembly];
                }
            });
        });
    };
    DeployAssembly.prototype.updatePluginAssembly = function (deployedPluginAssembly, pluginAssembly) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var md5Orig, dllLocation, base64, md5New, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        md5Orig = this.md5(deployedPluginAssembly.content), dllLocation = "bin/Debug/" + deployedPluginAssembly.name + ".dll", base64 = (_a = fs.readFileSync(dllLocation)) === null || _a === void 0 ? void 0 : _a.toString('base64'), md5New = this.md5(base64);
                        if (!(md5Orig !== md5New || deployedPluginAssembly.version !== pluginAssembly.version)) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.log("Updating from " + dllLocation)];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 6]);
                        pluginAssembly.content = base64;
                        // const mergedPluginAssembly = Object.assign(deployedPluginAssembly, pluginAssembly);
                        // await PluginAssemblyService.upsert(mergedPluginAssembly, this.bearer); // TODO aanzetten
                        return [4 /*yield*/, this.log(" updated...")];
                    case 3:
                        // const mergedPluginAssembly = Object.assign(deployedPluginAssembly, pluginAssembly);
                        // await PluginAssemblyService.upsert(mergedPluginAssembly, this.bearer); // TODO aanzetten
                        _b.sent();
                        return [3 /*break*/, 6];
                    case 4:
                        e_1 = _b.sent();
                        return [4 /*yield*/, this.log(" failed " + e_1.message + "<br/>")];
                    case 5:
                        _b.sent();
                        return [3 /*break*/, 6];
                    case 6: return [3 /*break*/, 9];
                    case 7: return [4 /*yield*/, this.log(" unmodified<br/>")];
                    case 8:
                        _b.sent();
                        _b.label = 9;
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    return DeployAssembly;
}(Deploy_1.Deploy));
exports.DeployAssembly = DeployAssembly;


/***/ }),

/***/ "./src/root/tools/deploy/DeployPluginType.ts":
/*!***************************************************!*\
  !*** ./src/root/tools/deploy/DeployPluginType.ts ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var PluginType_service_1 = __webpack_require__(/*! ../PluginType/PluginType.service */ "./src/root/tools/PluginType/PluginType.service.ts");
var DeploySdkMessageProcessingStep_1 = __webpack_require__(/*! ./DeploySdkMessageProcessingStep */ "./src/root/tools/deploy/DeploySdkMessageProcessingStep.ts");
var DeployPluginType = /** @class */ (function () {
    function DeployPluginType(context) {
        this.context = context;
    }
    DeployPluginType.prototype.deployPluginTypes = function (pluginAssembly) {
        return __awaiter(this, void 0, void 0, function () {
            var pluginTypes, deploySdkMessageProcessingStep, _i, pluginTypes_1, pluginType;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pluginTypes = this.context.config.plugintypes;
                        if (!(pluginTypes.length > 0)) return [3 /*break*/, 7];
                        deploySdkMessageProcessingStep = new DeploySdkMessageProcessingStep_1.DeploySdkMessageProcessingStep(this.context);
                        _i = 0, pluginTypes_1 = pluginTypes;
                        _a.label = 1;
                    case 1:
                        if (!(_i < pluginTypes_1.length)) return [3 /*break*/, 6];
                        pluginType = pluginTypes_1[_i];
                        return [4 /*yield*/, this.upsertPluginType(pluginType, pluginAssembly)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, deploySdkMessageProcessingStep.deploySteps(pluginType)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.context.log("")];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 1];
                    case 6: return [3 /*break*/, 9];
                    case 7: return [4 /*yield*/, this.context.log('No plugin types configured')];
                    case 8:
                        _a.sent();
                        _a.label = 9;
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    DeployPluginType.prototype.upsertPluginType = function (pluginType, pluginAssembly) {
        return __awaiter(this, void 0, void 0, function () {
            var deployedPluginType;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.context.log("<b>Plugintype</b><br/> " + pluginType.name)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getDeployedPluginType(pluginType, pluginAssembly)];
                    case 2:
                        deployedPluginType = _a.sent();
                        if (deployedPluginType) {
                            return [2 /*return*/, this.updatePluginType(deployedPluginType, pluginType /*, pluginAssembly*/)];
                        }
                        else {
                            return [2 /*return*/, this.createPluginType(pluginType, pluginAssembly)];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    DeployPluginType.prototype.getDeployedPluginType = function (pluginType, pluginAssembly) {
        return __awaiter(this, void 0, void 0, function () {
            var deployedPluginTypes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, PluginType_service_1.PluginTypeService.retrieveMultipleRecords({
                            select: ['plugintypeid', 'version'],
                            filters: [{
                                    conditions: [{
                                            attribute: '_pluginassemblyid_value',
                                            value: pluginAssembly.pluginassemblyid
                                        }, {
                                            attribute: 'name',
                                            value: pluginType.name
                                        }]
                                }]
                        }, this.context)];
                    case 1:
                        deployedPluginTypes = _a.sent();
                        return [2 /*return*/, deployedPluginTypes[0]];
                }
            });
        });
    };
    DeployPluginType.prototype.updatePluginType = function (deployedPluginType, pluginType /*, pluginAssembly: PluginAssemblyModel*/) {
        return __awaiter(this, void 0, void 0, function () {
            var mergedPluginType;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mergedPluginType = Object.assign(deployedPluginType, pluginType);
                        if (!(deployedPluginType.version !== pluginType.version)) return [3 /*break*/, 3];
                        // pluginType.pluginassemblyid = pluginAssembly.pluginassemblyid;
                        return [4 /*yield*/, this.context.log("Updating PluginType " + pluginType.name)];
                    case 1:
                        // pluginType.pluginassemblyid = pluginAssembly.pluginassemblyid;
                        _a.sent();
                        delete mergedPluginType.sdkmessageprocessingsteps;
                        // await PluginTypeService.upsert(mergedPluginType, this.bearer); // TODO aanzetten
                        return [4 /*yield*/, this.context.log(" updated...")];
                    case 2:
                        // await PluginTypeService.upsert(mergedPluginType, this.bearer); // TODO aanzetten
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.context.log(" unmodified<br/>")];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/, mergedPluginType];
                }
            });
        });
    };
    DeployPluginType.prototype.createPluginType = function (pluginType, pluginAssembly) {
        return __awaiter(this, void 0, void 0, function () {
            var description, friendlyname, name, typename, version, workflowactivitygroupname, createPluginType;
            return __generator(this, function (_a) {
                description = pluginType.description, friendlyname = pluginType.friendlyname, name = pluginType.name, typename = pluginType.typename, version = pluginType.version, workflowactivitygroupname = pluginType.workflowactivitygroupname, createPluginType = {
                    name: name,
                    friendlyname: friendlyname,
                    typename: typename || name,
                    pluginassemblyid: pluginAssembly.pluginassemblyid,
                    workflowactivitygroupname: workflowactivitygroupname || pluginAssembly.name + " (" + version + ")",
                    version: version,
                    description: description
                };
                // await PluginTypeService.upsert(createPluginType, this.bearer); // TODO aanzetten
                // const deployedPluginType = await this.getDeployedPluginType(createPluginType); // TODO aanzetten
                // pluginType.plugintypeid = deployedPluginType.plugintypeid; // TODO aanzetten
                return [2 /*return*/, createPluginType]; // TODO vervangen met: return deployedPluginType;
            });
        });
    };
    return DeployPluginType;
}());
exports.DeployPluginType = DeployPluginType;


/***/ }),

/***/ "./src/root/tools/deploy/DeploySdkMessageProcessingStep.ts":
/*!*****************************************************************!*\
  !*** ./src/root/tools/deploy/DeploySdkMessageProcessingStep.ts ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var SdkMessageProcessingStep_service_1 = __webpack_require__(/*! ../SdkMessageProcessingStep/SdkMessageProcessingStep.service */ "./src/root/tools/SdkMessageProcessingStep/SdkMessageProcessingStep.service.ts");
var SdkMessage_service_1 = __webpack_require__(/*! ../SdkMessage/SdkMessage.service */ "./src/root/tools/SdkMessage/SdkMessage.service.ts");
var SdmMessageFilter_service_1 = __webpack_require__(/*! ../SdkMessageFilter/SdmMessageFilter.service */ "./src/root/tools/SdkMessageFilter/SdmMessageFilter.service.ts");
var DeploySdkMessageProcessingStep = /** @class */ (function () {
    function DeploySdkMessageProcessingStep(context) {
        this.context = context;
    }
    DeploySdkMessageProcessingStep.prototype.deploySteps = function (pluginType) {
        return __awaiter(this, void 0, void 0, function () {
            var sdkMessageProcessingSteps, _i, sdkMessageProcessingSteps_1, sdkMessageProcessingStep;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.context.log("<b>Sdkmessageprocessingsteps</b><br/>" + pluginType.name)];
                    case 1:
                        _a.sent();
                        sdkMessageProcessingSteps = pluginType.sdkmessageprocessingsteps;
                        if (!((sdkMessageProcessingSteps === null || sdkMessageProcessingSteps === void 0 ? void 0 : sdkMessageProcessingSteps.length) > 0)) return [3 /*break*/, 6];
                        _i = 0, sdkMessageProcessingSteps_1 = sdkMessageProcessingSteps;
                        _a.label = 2;
                    case 2:
                        if (!(_i < sdkMessageProcessingSteps_1.length)) return [3 /*break*/, 5];
                        sdkMessageProcessingStep = sdkMessageProcessingSteps_1[_i];
                        return [4 /*yield*/, this.upsertStep(sdkMessageProcessingStep, pluginType)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        this.context.log('No SDK Message Processing steps configured');
                        _a.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    DeploySdkMessageProcessingStep.prototype.upsertStep = function (step, pluginType) {
        return __awaiter(this, void 0, void 0, function () {
            var deployedStep, sdkMessage, sdkMessageFilter;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getDeployedStep(step)];
                    case 1:
                        deployedStep = _a.sent();
                        return [4 /*yield*/, this.getSdkMessage(step)];
                    case 2:
                        sdkMessage = _a.sent();
                        return [4 /*yield*/, this.getSdkMessageFilter(step, sdkMessage)];
                    case 3:
                        sdkMessageFilter = _a.sent();
                        if (!(sdkMessage && sdkMessageFilter)) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.context.log("Sdk Message " + sdkMessage.name + " found")];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.context.log("Sdk Message Filter " + sdkMessageFilter.primaryobjecttypecode + " found")];
                    case 5:
                        _a.sent();
                        if (!deployedStep) return [3 /*break*/, 6];
                        return [2 /*return*/, this.updateStep(deployedStep, step, sdkMessage, sdkMessageFilter)];
                    case 6: return [4 /*yield*/, this.createStep(step, sdkMessage, sdkMessageFilter, pluginType)];
                    case 7:
                        deployedStep = _a.sent();
                        return [4 /*yield*/, SdkMessageProcessingStep_service_1.SdkMessageProcessingStepService.addToSolution(deployedStep, this.context)];
                    case 8:
                        _a.sent();
                        return [2 /*return*/, deployedStep];
                    case 9: return [3 /*break*/, 14];
                    case 10:
                        if (!!sdkMessage) return [3 /*break*/, 12];
                        return [4 /*yield*/, this.context.log("Sdk Message not found for " + step.name)];
                    case 11:
                        _a.sent();
                        return [3 /*break*/, 14];
                    case 12: return [4 /*yield*/, this.context.log("Sdk Message Filter not found for " + step.name)];
                    case 13:
                        _a.sent();
                        _a.label = 14;
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    DeploySdkMessageProcessingStep.prototype.getDeployedStep = function (step) {
        return __awaiter(this, void 0, void 0, function () {
            var deployedSteps;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, SdkMessageProcessingStep_service_1.SdkMessageProcessingStepService.retrieveMultipleRecords({
                            select: ['sdkmessageprocessingstepid', 'name', 'description', 'supporteddeployment', 'mode', 'rank'],
                            filters: [{
                                    conditions: [{
                                            attribute: 'name',
                                            value: step.name
                                        }]
                                }]
                        }, this.context)];
                    case 1:
                        deployedSteps = _a.sent();
                        return [2 /*return*/, deployedSteps[0]];
                }
            });
        });
    };
    DeploySdkMessageProcessingStep.prototype.getSdkMessage = function (step) {
        return __awaiter(this, void 0, void 0, function () {
            var sdkMessages;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, SdkMessage_service_1.SdkMessageService.retrieveMultipleRecords({
                            select: ['sdkmessageid', 'name'],
                            filters: [{
                                    conditions: [{
                                            attribute: 'name',
                                            value: step.sdkmessage
                                        }]
                                }]
                        }, this.context)];
                    case 1:
                        sdkMessages = _a.sent();
                        return [2 /*return*/, sdkMessages[0]];
                }
            });
        });
    };
    DeploySdkMessageProcessingStep.prototype.getSdkMessageFilter = function (step, sdkMessage) {
        return __awaiter(this, void 0, void 0, function () {
            var sdkMessageFilters;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, SdmMessageFilter_service_1.SdkMessageFilterService.retrieveMultipleRecords({
                            select: ['sdkmessagefilterid', 'primaryobjecttypecode'],
                            filters: [{
                                    conditions: [{
                                            attribute: '_sdkmessageid_value',
                                            value: sdkMessage.sdkmessageid
                                        }, {
                                            attribute: 'primaryobjecttypecode',
                                            value: step.sdkmessagefilterid.primaryobjecttypecode
                                        }]
                                }]
                        }, this.context)];
                    case 1:
                        sdkMessageFilters = _a.sent();
                        return [2 /*return*/, sdkMessageFilters[0]];
                }
            });
        });
    };
    DeploySdkMessageProcessingStep.prototype.updateStep = function (deployedStep, step, sdkMessage, sdkMessageFilter) {
        return __awaiter(this, void 0, void 0, function () {
            var description, supporteddeployment, mode, rank, mergedStep;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        description = deployedStep.description, supporteddeployment = deployedStep.supporteddeployment, mode = deployedStep.mode, rank = deployedStep.rank, mergedStep = Object.assign(deployedStep, step);
                        if (!(step.description !== description || step.supporteddeployment !== supporteddeployment || step.mode !== mode || step.rank !== rank)) return [3 /*break*/, 2];
                        step.sdkmessageid = sdkMessage.sdkmessageid;
                        step.sdkmessagefilterid = sdkMessageFilter.sdkmessagefilterid;
                        // SdkMessageProcessingStepService.upsert(mergedStep, this.bearer); // TODO aanzetten
                        return [4 /*yield*/, this.context.log("Updated...")];
                    case 1:
                        // SdkMessageProcessingStepService.upsert(mergedStep, this.bearer); // TODO aanzetten
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.context.log(" unmodified<br/>")];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, mergedStep];
                }
            });
        });
    };
    DeploySdkMessageProcessingStep.prototype.createStep = function (step, sdkMessage, sdkMessageFilter, pluginType) {
        return __awaiter(this, void 0, void 0, function () {
            var createStep;
            return __generator(this, function (_a) {
                createStep = Object.assign({
                    sdkmessageid: sdkMessage.sdkmessageid,
                    sdkmessagefilterid: sdkMessageFilter.sdkmessagefilterid,
                    plugintypeid: pluginType.plugintypeid
                }, step);
                // await SdkMessageProcessingStepService.upsert(createStep, this.bearer); // TODO aanzetten
                // const deployedStep = await this.getDeployedStep(createStep); // TODO aanzetten
                return [2 /*return*/, createStep]; // TODO vervangen met: return deployedStep;
            });
        });
    };
    return DeploySdkMessageProcessingStep;
}());
exports.DeploySdkMessageProcessingStep = DeploySdkMessageProcessingStep;


/***/ }),

/***/ "./src/update.ts":
/*!***********************!*\
  !*** ./src/update.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var colors = __webpack_require__(/*! colors */ "colors");
var shell = __webpack_require__(/*! shelljs */ "shelljs");
var fs = __webpack_require__(/*! fs */ "fs");
var Variables_1 = __webpack_require__(/*! ./Variables */ "./src/Variables.ts");
var Update = /** @class */ (function () {
    function Update() {
    }
    Update.updateProject = function () {
        if (process.argv[3]) {
            console.log(colors.red("No spaces allowed after update command!"));
        }
        else {
            return Update.update();
        }
    };
    Update.showUpdateHelp = function () {
        console.log("Arguments:");
    };
    Update.update = function () {
        return __awaiter(this, void 0, void 0, function () {
            var variables;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Updating D365 Project...");
                        Update.moveDeploy();
                        return [4 /*yield*/, Variables_1.Variables.get()];
                    case 1:
                        variables = _a.sent();
                        Update.updateProjectRootFolder();
                        Update.updateDeploy(variables);
                        Update.updateSrcFolder();
                        Update.updatePackageJson(variables);
                        Update.updateServiceFiles();
                        Update.updateModelFiles();
                        Update.updateFormFiles(variables);
                        Update.updateEntityFiles();
                        Update.updateWebpackConfig(variables);
                        console.log("Updating D365 Project done");
                        return [2 /*return*/];
                }
            });
        });
    };
    Update.updateProjectRootFolder = function () {
        console.log("Updating .eslintignore...");
        shell.cp('-R', __dirname + "/root/.eslintignore", '.');
        console.log("Updating .gitignore...");
        shell.cp('-R', __dirname + "/root/.gitignore", '.');
        console.log("Updating .eslintrc.json...");
        shell.cp('-R', __dirname + "/root/.eslintrc.json", '.');
        console.log("Updating postcss.config.js");
        shell.cp('-R', __dirname + "/root/postcss.config.js", '.');
        shell.exec('git add postcss.config.js');
    };
    Update.updateSrcFolder = function () {
        console.log("Updating tsconfig.json...");
        shell.cp('-R', __dirname + "/root/src/tsconfig.json", './src');
        console.log("Updating WebApi...");
        shell.cp('-R', __dirname + "/root/src/WebApi", './src');
        shell.exec('git add src/WebApi/Model.ts');
        console.log("Updating Http...");
        shell.cp('-R', __dirname + "/root/src/Http", './src');
        shell.exec('git add src/Http/Http.ts');
        console.log("Updating util...");
        shell.cp('-R', __dirname + "/root/src/util", './src');
        shell.exec('git add src/util/Base64.ts');
        shell.exec('git add src/util/FormUtil.ts');
        console.log("Updating Annotation...");
        shell.cp('-R', __dirname + "/root/src/Annotation", './src');
        shell.exec('git add src/Annotation/Annotation.model.ts');
        shell.exec('git add src/Annotation/Annotation.service.ts');
        console.log("Updating Translation...");
        shell.cp('-R', __dirname + "/root/src/translation", './src');
        shell.exec('git add src/translation/TranslationI18n.ts');
        Update.cleanSrcFolder();
    };
    Update.cleanSrcFolder = function () {
        console.log("Removing tslint.json...");
        shell.rm('-R', "./src/tslint.json");
        console.log("Removing txs...");
        shell.rm('-R', './src/tsx');
    };
    Update.moveDeploy = function () {
        console.log("Moving deploy folder...");
        if (shell.test('-f', 'deploy/deploy.js')) {
            if (!shell.test('-d', 'tools')) {
                shell.mkdir('tools');
            }
            shell.cp('-R', 'deploy/*', 'tools');
            if (shell.which('git')) {
                shell.exec('git rm deploy/deploy.js');
                shell.exec('git rm deploy/crm.json');
            }
        }
    };
    Update.updateDeploy = function (variables) {
        console.log("Updating deploy folder...");
        if (!shell.test('-d', 'tools')) {
            shell.mkdir('tools');
        }
        shell.cp('-R', __dirname + "/root/tools/*.js", './tools');
        shell.cp('-R', __dirname + "/root/tools/*.resx", './tools');
        shell.exec('git add tools');
        var checkClientSecret = shell.grep("clientSecret", './tools/crm.json'), checkTranslation = shell.grep('translation', './tools/crm.json'), publisher = variables.publisher, solution = variables.solution, environment = variables.environment, namespace = variables.namespace, translationtype = variables.translationtype;
        if (checkClientSecret.stdout !== '\n' || checkTranslation.stdout === '\n') {
            shell.cp('-R', __dirname + "/root/tools/crm.json", './tools');
            var crmJsonFile = shell.ls('./tools/crm.json')[0];
            shell.sed('-i', new RegExp('<%= publisher %>', 'ig'), publisher, crmJsonFile);
            shell.sed('-i', new RegExp('<%= solution %>', 'ig'), solution, crmJsonFile);
            shell.sed('-i', new RegExp('<%= environment %>', 'ig'), environment, crmJsonFile);
            shell.sed('-i', new RegExp('<%= namespace %>', 'ig'), namespace, crmJsonFile);
            shell.sed('-i', new RegExp('<%= translationtype %>', 'ig'), translationtype || 'i18n', crmJsonFile);
        }
    };
    Update.updatePackageJson = function (variables) {
        console.log("Updating package.json...");
        var dlfCoreCheck = shell.grep("dlf-core", 'package.json');
        var projectname = variables.projectname, description = variables.description, publisher = variables.publisher, version = variables.version;
        if (dlfCoreCheck.stdout !== '\n') {
            shell.exec('npm install --save dlf-core@latest');
            dlfCoreCheck = shell.grep("dlf-core", 'package.json');
        }
        shell.cp('-R', __dirname + "/root/package.json", '.');
        var packageJsonFile = shell.ls('package.json')[0];
        if (dlfCoreCheck.stdout !== '\n') {
            shell.sed('-i', '"dependencies": {', "\"dependencies\": {\n" + dlfCoreCheck.stdout, packageJsonFile);
        }
        shell.sed('-i', new RegExp('<%= projectname %>', 'ig'), projectname, packageJsonFile);
        shell.sed('-i', new RegExp('<%= description %>', 'ig'), description, packageJsonFile);
        shell.sed('-i', new RegExp('<%= publisher %>', 'ig'), publisher, packageJsonFile);
        shell.sed('-i', new RegExp('<%= version %>', 'ig'), version, packageJsonFile);
        console.log("Removing old npm packages. This may take a while...");
        shell.exec('npm prune');
        shell.exec('npm install');
    };
    Update.updateServiceFiles = function () {
        console.log("Updating Service files");
        shell.ls("src/**/*.service.ts*").forEach(function (filepath) {
            Update.updateServiceFileCount(filepath);
            Update.updateServiceFileCloneValidation(filepath);
        });
    };
    Update.updateServiceFileCount = function (filepath) {
        console.log("Updating Service files Count code");
        var countCheck = shell.grep("public static async count", filepath);
        if (countCheck.stdout === '\n') {
            var split = filepath.split('/'), entityname = split[1], file = shell.ls(filepath)[0];
            shell.sed('-i', "import {MultipleSystemQueryOptions, SystemQueryOptions, WebApi} from '../WebApi/WebApi';", "import {Filter, MultipleSystemQueryOptions, SystemQueryOptions, WebApi} from '../WebApi/WebApi';", file);
            shell.sed('-i', "export class " + entityname + "Service {", "export class " + entityname + "Service {\n    " + Update.serviceFileSnippetCount
                .replace(/EntityService/g, entityname + "Service") + '\n', file);
            console.log("Modified " + filepath);
        }
    };
    Update.updateServiceFileCloneValidation = function (filepath) {
        console.log("Updating Service files Clone and Validation code");
        var cloneCheck = shell.grep("retrieveClone", filepath);
        if (cloneCheck.stdout === '\n') {
            var split = filepath.split('/'), entityname = split[1], entitynameCamelCase = entityname.charAt(0).toLowerCase() + entityname.slice(1), file = shell.ls(filepath)[0];
            shell.sed('-i', "export class " + entityname + "Service {", "export class " + entityname + "Service {\n    " + Update.serviceFileSnippetCloneValidation
                .replace(/EntityService/g, entityname + "Service")
                .replace(/EntityModel/g, entityname + "Model")
                .replace(/entityModel/g, entitynameCamelCase + "Model") + '\n', file);
            shell.sed('-i', "import {Model}", "import {Model, ModelValidation}", file);
            shell.sed('-i', "export class", "import {Model, ModelValidation} from '../WebApi/Model';\n\nexport class", file);
            console.log("Modified " + filepath);
        }
    };
    Update.updateModelFiles = function () {
        console.log("Updating Model files");
        shell.ls("src/**/*.model.ts*").forEach(function (filepath) {
            var check = shell.grep("import {Model}", filepath);
            if (check.stdout === '\n') {
                var split = filepath.split('/'), entityname = split[1], file = shell.ls(filepath)[0];
                shell.sed('-i', "export", "import {Model} from '../WebApi/Model';\nexport", file);
                shell.sed('-i', "interface " + entityname + "Model", "interface " + entityname + "Model extends Model", file);
                console.log("Modified " + filepath);
            }
        });
    };
    Update.getTranslationInitRegex = function (variables) {
        var publisher = variables.publisher, namespace = variables.namespace;
        return new RegExp("await Translation\\.init\\({\\s*relativePath:\\s'" + publisher + "_/" + namespace + "/locales'\\s*}\\);\\s*", 'gm');
        // return /await Translation\.init\({\s*relativePath:\s'hds_\/ces\/locales'\s*}\);\s*/gm;
    };
    Update.updateFormFiles = function (variables) {
        console.log('Updating Entity files');
        var filepaths = shell.ls("src/**/*.form.ts");
        for (var _i = 0, filepaths_1 = filepaths; _i < filepaths_1.length; _i++) {
            var filepath = filepaths_1[_i];
            var check = shell.grep("Translation.init", filepath);
            if (check.stdout !== '\n') {
                var filedata = String(fs.readFileSync(filepath));
                shell.ShellString(filedata.replace(Update.getTranslationInitRegex(variables), '')).to(filepath);
                console.log("Modified " + filepath);
            }
        }
    };
    Update.updateEntityFiles = function () {
        console.log('Updating Entity files');
        shell.ls("src/**/*.ts*").forEach(function (filepath) {
            var split = filepath.split('/'), entityname = split[1], file = shell.ls(filepath)[0];
            if (entityname + ".ts" === split[2]) {
                var check = shell.grep("export namespace", filepath);
                if (check.stdout === '\n') {
                    shell.sed('-i', "export namespace Form", "export const Form =", file);
                    shell.sed('-i', "export namespace Ribbon", "export const Ribbon =", file);
                    // eslint-disable-next-line max-len
                    shell.sed('-i', "export function onLoad(executionContext: Xrm.Events.EventContext) {", "onLoad: (executionContext: Xrm.Events.EventContext): void => {", file);
                    shell.sed('-i', "\\(formContext: Xrm.FormContext\\) {", ": (formContext: Xrm.FormContext): void => {", file);
                    // shell.sed('-i', `export function `, ``, file); too much
                    console.log("Modified " + split[1] + ".ts " + split[2]);
                }
            }
        });
    };
    Update.updateWebpackConfig = function (variables) {
        console.log("Updating webpack.config.js...");
        var origWebpackConfigFile = shell.cat('webpack.config.js'), content = origWebpackConfigFile.stdout, start = content.indexOf('entry:'), end = content.indexOf('output:'), entryPart = content.substr(start, end - start), cutEntry = entryPart.replace('\r\n    },\r\n    ', '');
        shell.cp('-R', __dirname + "/root/webpack.config.js", '.');
        var webpackConfigFile = shell.ls('webpack.config.js')[0];
        shell.sed('-i', new RegExp('<%= publisher %>', 'ig'), variables.publisher, webpackConfigFile);
        shell.sed('-i', new RegExp('<%= namespace %>', 'ig'), variables.namespace, webpackConfigFile);
        shell.sed('-i', new RegExp('<%= description %>', 'ig'), variables.description, webpackConfigFile);
        shell.sed('-i', new RegExp('entry: {', 'ig'), cutEntry, webpackConfigFile);
    };
    Update.serviceFileSnippetCount = "public static async count(filters?: Filter[]): Promise<number> {\n        return WebApi.count(EntityService.logicalName, filters);\n    }";
    Update.serviceFileSnippetCloneValidation = "public static async retrieveClone(id: string): Promise<EntityModel> {\n        const origRecord = await Xrm.WebApi.retrieveRecord(EntityService.logicalName, id);\n        return Model.parseCreateModel(EntityService.logicalName, origRecord);\n    }\n\n    public static async validateRecord(entityModel: EntityModel): Promise<ModelValidation> {\n        return Model.validateRecord(EntityService.logicalName, entityModel);\n    }";
    return Update;
}());
exports.Update = Update;


/***/ }),

/***/ 3:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! C:\git\P030-CE-CLI\src\main.ts */"./src/main.ts");


/***/ }),

/***/ "colors":
/*!*************************!*\
  !*** external "colors" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("colors");

/***/ }),

/***/ "commander":
/*!****************************!*\
  !*** external "commander" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("commander");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("https");

/***/ }),

/***/ "inquirer":
/*!***************************!*\
  !*** external "inquirer" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("inquirer");

/***/ }),

/***/ "open":
/*!***********************!*\
  !*** external "open" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("open");

/***/ }),

/***/ "readline":
/*!***************************!*\
  !*** external "readline" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("readline");

/***/ }),

/***/ "shelljs":
/*!**************************!*\
  !*** external "shelljs" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("shelljs");

/***/ })

/******/ });
//# sourceMappingURL=main.js.map