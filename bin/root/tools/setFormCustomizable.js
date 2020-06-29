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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ({

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

/***/ "./src/root/tools/SetFormCustomizable.ts":
/*!***********************************************!*\
  !*** ./src/root/tools/SetFormCustomizable.ts ***!
  \***********************************************/
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
var AdalRouter_1 = __webpack_require__(/*! ./AdalRouter */ "./src/root/tools/AdalRouter.ts");
var Solution_service_1 = __webpack_require__(/*! ./Solution/Solution.service */ "./src/root/tools/Solution/Solution.service.ts");
var SolutionComponent_service_1 = __webpack_require__(/*! ./SolutionComponent/SolutionComponent.service */ "./src/root/tools/SolutionComponent/SolutionComponent.service.ts");
var SystemForm_service_1 = __webpack_require__(/*! ./SystemForm/SystemForm.service */ "./src/root/tools/SystemForm/SystemForm.service.ts");
var SetFormCustomizable = /** @class */ (function (_super) {
    __extends(SetFormCustomizable, _super);
    function SetFormCustomizable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SetFormCustomizable.prototype.onAuthenticated = function () {
        var customizable = process.argv[3];
        this.log('Customizable: ' + customizable);
        // process.argv.forEach((val, index) => {
        //     this.log(index + ': ' + val);
        // });
        return this.setFormCustomizable(customizable === 'true');
    };
    SetFormCustomizable.prototype.setFormCustomizable = function (customizable) {
        return __awaiter(this, void 0, void 0, function () {
            var solution, solutioncomponents, _i, solutioncomponents_1, solutioncomponent, systemForm;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.log("Solution name: " + this.settings.crm.solution_name);
                        return [4 /*yield*/, Solution_service_1.SolutionService.getSolution(['solutionid'], this.context)];
                    case 1:
                        solution = _a.sent();
                        this.log("Solution id: " + solution.solutionid);
                        this.log("");
                        return [4 /*yield*/, this.getSolutionComponents(solution)];
                    case 2:
                        solutioncomponents = _a.sent();
                        _i = 0, solutioncomponents_1 = solutioncomponents;
                        _a.label = 3;
                    case 3:
                        if (!(_i < solutioncomponents_1.length)) return [3 /*break*/, 7];
                        solutioncomponent = solutioncomponents_1[_i];
                        this.log("SolutionComponent: " + solutioncomponent.objectid);
                        return [4 /*yield*/, this.getSystemForm(solutioncomponent)];
                    case 4:
                        systemForm = _a.sent();
                        return [4 /*yield*/, this.setForm(systemForm, customizable)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 3];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    SetFormCustomizable.prototype.setForm = function (systemForm, customizable) {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.log("Form name: " + systemForm.name);
                        if (!(systemForm.iscustomizable.Value !== customizable || systemForm.canbedeleted.Value !== customizable)) return [3 /*break*/, 5];
                        // this.log(`Is customizable: ${systemForm.iscustomizable.Value}`);
                        // this.log(`Can be deleted: ${systemForm.canbedeleted.Value}`);
                        if (systemForm.iscustomizable.CanBeChanged) {
                            systemForm.iscustomizable.Value = customizable;
                        }
                        if (systemForm.canbedeleted.CanBeChanged) {
                            systemForm.canbedeleted.Value = customizable;
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, SystemForm_service_1.SystemFormService.updateRecord(systemForm.formid, systemForm, this.context)];
                    case 2:
                        _a.sent();
                        this.log("Updated");
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        this.log(e_1.message);
                        return [3 /*break*/, 4];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        this.log("Unmodified");
                        _a.label = 6;
                    case 6:
                        this.log("---------------------------");
                        return [2 /*return*/];
                }
            });
        });
    };
    SetFormCustomizable.prototype.getSolutionComponents = function (solution) {
        return SolutionComponent_service_1.SolutionComponentService.retrieveMultipleRecords({
            select: ['objectid'],
            filters: [{
                    conditions: [{
                            attribute: '_solutionid_value',
                            value: solution.solutionid
                        }, {
                            attribute: 'componenttype',
                            value: 60
                        }]
                }]
        }, this.context);
    };
    SetFormCustomizable.prototype.getSystemForm = function (solutionComponent) {
        return SystemForm_service_1.SystemFormService.getSystemForm(solutionComponent.objectid, ['name', 'objecttypecode', 'iscustomizable', 'canbedeleted'], this.context);
    };
    return SetFormCustomizable;
}(AdalRouter_1.AdalRouter));
new SetFormCustomizable();


/***/ }),

/***/ "./src/root/tools/Solution/Solution.service.ts":
/*!*****************************************************!*\
  !*** ./src/root/tools/Solution/Solution.service.ts ***!
  \*****************************************************/
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
var SolutionService = /** @class */ (function () {
    function SolutionService() {
    }
    SolutionService.retrieveMultipleRecords = function (multipleSystemQueryOptions, context) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, NodeApi_1.NodeApi.retrieveMultipleRecords(SolutionService.entitySetName, multipleSystemQueryOptions, context)];
            });
        });
    };
    SolutionService.getSolution = function (select, context) {
        return __awaiter(this, void 0, void 0, function () {
            var settings, crm, solution_name, solutions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        settings = context.settings, crm = settings.crm, solution_name = crm.solution_name;
                        return [4 /*yield*/, SolutionService.retrieveMultipleRecords({
                                select: select,
                                filters: [{
                                        conditions: [{
                                                attribute: 'uniquename',
                                                value: solution_name
                                            }]
                                    }]
                            }, context)];
                    case 1:
                        solutions = _a.sent();
                        return [2 /*return*/, solutions[0]];
                }
            });
        });
    };
    // private static logicalName = 'solution';
    SolutionService.entitySetName = 'solutions';
    return SolutionService;
}());
exports.SolutionService = SolutionService;


/***/ }),

/***/ "./src/root/tools/SolutionComponent/SolutionComponent.service.ts":
/*!***********************************************************************!*\
  !*** ./src/root/tools/SolutionComponent/SolutionComponent.service.ts ***!
  \***********************************************************************/
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
var SolutionComponentService = /** @class */ (function () {
    function SolutionComponentService() {
    }
    SolutionComponentService.retrieveMultipleRecords = function (multipleSystemQueryOptions, context) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, NodeApi_1.NodeApi.retrieveMultipleRecords(SolutionComponentService.entitySetName, multipleSystemQueryOptions, context)];
            });
        });
    };
    // private static logicalName = 'solutioncomponent';
    SolutionComponentService.entitySetName = 'solutioncomponents';
    return SolutionComponentService;
}());
exports.SolutionComponentService = SolutionComponentService;


/***/ }),

/***/ "./src/root/tools/SystemForm/SystemForm.service.ts":
/*!*********************************************************!*\
  !*** ./src/root/tools/SystemForm/SystemForm.service.ts ***!
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
var SystemFormService = /** @class */ (function () {
    function SystemFormService() {
    }
    SystemFormService.retrieveMultipleRecords = function (multipleSystemQueryOptions, context) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, NodeApi_1.NodeApi.retrieveMultipleRecords(SystemFormService.entitySetName, multipleSystemQueryOptions, context)];
            });
        });
    };
    SystemFormService.updateRecord = function (id, systemFormModel, context) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, NodeApi_1.NodeApi.updateRecord(SystemFormService.entitySetName, id, systemFormModel, context)];
            });
        });
    };
    SystemFormService.getSystemForm = function (formid, select, context) {
        return __awaiter(this, void 0, void 0, function () {
            var systemForms;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, SystemFormService.retrieveMultipleRecords({
                            select: select,
                            filters: [{
                                    conditions: [{
                                            attribute: 'formid',
                                            value: formid
                                        }]
                                }]
                        }, context)];
                    case 1:
                        systemForms = _a.sent();
                        return [2 /*return*/, systemForms[0]];
                }
            });
        });
    };
    // private static logicalName = 'systemform';
    SystemFormService.entitySetName = 'systemforms';
    return SystemFormService;
}());
exports.SystemFormService = SystemFormService;


/***/ }),

/***/ 2:
/*!*****************************************************!*\
  !*** multi ./src/root/tools/SetFormCustomizable.ts ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! C:\git\P030-CE-CLI\src\root\tools\SetFormCustomizable.ts */"./src/root/tools/SetFormCustomizable.ts");


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

/***/ "open":
/*!***********************!*\
  !*** external "open" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("open");

/***/ })

/******/ });
//# sourceMappingURL=setFormCustomizable.js.map