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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/root/tools/Resx.ts":
/*!********************************!*\
  !*** ./src/root/tools/Resx.ts ***!
  \********************************/
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
var fs = __webpack_require__(/*! fs */ "fs");
var xml2js = __webpack_require__(/*! xml2js */ "xml2js");
var Resx = /** @class */ (function () {
    function Resx() {
    }
    Resx.extract = function () {
        return __awaiter(this, void 0, void 0, function () {
            var codeKeys;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        codeKeys = Resx.getCodeKeys();
                        if (codeKeys.length > 0) {
                            Resx.addLocalesFile();
                        }
                        return [4 /*yield*/, Resx.processCodeKeys((codeKeys))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, null];
                }
            });
        });
    };
    Resx.getCodeKeys = function () {
        var keys = new Set();
        var filepaths = shell.ls("src/**/*.ts*");
        for (var _i = 0, filepaths_1 = filepaths; _i < filepaths_1.length; _i++) {
            var filepath = filepaths_1[_i];
            var filedata = String(fs.readFileSync(filepath));
            var match = null;
            while ((match = Resx.regex.exec(filedata)) !== null) {
                if (match.index === Resx.regex.lastIndex) {
                    Resx.regex.lastIndex += 1;
                }
                keys.add(match[2] || match[3]);
            }
        }
        return Array.from(keys.values());
    };
    Resx.addLocalesFile = function () {
        if (!shell.test('-d', 'src/translation/locales')) {
            shell.mkdir("src/translation/locales");
        }
        if (!shell.test('-f', 'src/translation/locales/locales.resx')) {
            shell.cp('-R', __dirname + "/locales.resx", './src/translation/locales');
            // shell.cp('-R', `${__dirname}/Locales/locales.resx`, './src/translation/locales');
            shell.exec('git add src/translation/locales/locales.resx');
        }
        if (!shell.test('-f', 'src/translation/locales/locales.1033.resx')) {
            shell.cp('-r', __dirname + "/locales.resx", './src/translation/locales/locales.1033.resx');
            shell.exec('git add src/translation/locales/locales.1033.resx');
        }
    };
    Resx.processCodeKeys = function (codeKeys) {
        return __awaiter(this, void 0, void 0, function () {
            var resxpaths, _i, resxpaths_1, resxpath, xmlDoc;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        resxpaths = shell.ls("src/translation/locales/*.resx");
                        _i = 0, resxpaths_1 = resxpaths;
                        _a.label = 1;
                    case 1:
                        if (!(_i < resxpaths_1.length)) return [3 /*break*/, 4];
                        resxpath = resxpaths_1[_i];
                        return [4 /*yield*/, Resx.getResxDocument(resxpath)];
                    case 2:
                        xmlDoc = _a.sent();
                        Resx.processXmlDoc(xmlDoc, codeKeys);
                        Resx.writeXmlDoc(xmlDoc, resxpath);
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Resx.getResxDocument = function (filepath) {
        var filedata = String(fs.readFileSync(filepath));
        return xml2js.parseStringPromise(filedata);
    };
    Resx.processXmlDoc = function (xmlDoc, codeKeys) {
        var resxKeys = xmlDoc.root.data.map(function (item) { return item.$.name; });
        var _loop_1 = function (resxKey) {
            if (!codeKeys.includes(resxKey)) {
                var xmlItem = xmlDoc.root.data.find(function (item) { return item.$.name === resxKey; }), index = xmlDoc.root.data.indexOf(xmlItem);
                xmlDoc.root.data.splice(index, 1);
                console.log("remove " + resxKey);
            }
        };
        for (var _i = 0, resxKeys_1 = resxKeys; _i < resxKeys_1.length; _i++) {
            var resxKey = resxKeys_1[_i];
            _loop_1(resxKey);
        }
        for (var _a = 0, codeKeys_1 = codeKeys; _a < codeKeys_1.length; _a++) {
            var codeKey = codeKeys_1[_a];
            if (!resxKeys.includes(codeKey)) {
                xmlDoc.root.data.push({
                    $: {
                        name: codeKey,
                        'xml-space': 'preserve'
                    },
                    value: [codeKey]
                });
                console.log("add " + codeKey);
            }
        }
        // console.log(xmlDoc);
        // console.log(xmlDoc.root.data);
    };
    Resx.writeXmlDoc = function (xmlDoc, resxpath) {
        var builder = new xml2js.Builder();
        var xml = builder.buildObject(xmlDoc);
        // console.log(`Xml: ${xml}`);
        shell.ShellString(xml).to(resxpath);
    };
    Resx.regex = /Translation\.translate\([\s]*([']([^']*)[']|[`]([^`]*)[`])[\s]*\)/gm;
    return Resx;
}());
exports.Resx = Resx;
Resx.extract();


/***/ }),

/***/ 1:
/*!**************************************!*\
  !*** multi ./src/root/tools/Resx.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! C:\git\P030-CE-CLI\src\root\tools\Resx.ts */"./src/root/tools/Resx.ts");


/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ "shelljs":
/*!**************************!*\
  !*** external "shelljs" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("shelljs");

/***/ }),

/***/ "xml2js":
/*!*************************!*\
  !*** external "xml2js" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("xml2js");

/***/ })

/******/ });
//# sourceMappingURL=resx.js.map