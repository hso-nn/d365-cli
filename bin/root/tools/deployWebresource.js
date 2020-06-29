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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
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

/***/ "./src/root/tools/Webresource/Webresource.service.ts":
/*!***********************************************************!*\
  !*** ./src/root/tools/Webresource/Webresource.service.ts ***!
  \***********************************************************/
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
var WebresourceService = /** @class */ (function () {
    function WebresourceService() {
    }
    WebresourceService.retrieveMultipleRecords = function (multipleSystemQueryOptions, context) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, NodeApi_1.NodeApi.retrieveMultipleRecords(WebresourceService.entitySetName, multipleSystemQueryOptions, context)];
            });
        });
    };
    WebresourceService.retrieveRecord = function (id, systemQueryOptions, context) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, NodeApi_1.NodeApi.retrieveRecord(WebresourceService.entitySetName, id, systemQueryOptions, context)];
            });
        });
    };
    WebresourceService.upsert = function (webresource, context) {
        return __awaiter(this, void 0, void 0, function () {
            var namesplit, extension, _a, newWebresource;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!webresource.webresourceid) return [3 /*break*/, 2];
                        return [4 /*yield*/, NodeApi_1.NodeApi.updateRecord(WebresourceService.entitySetName, webresource.webresourceid, webresource, context)];
                    case 1:
                        _b.sent();
                        return [2 /*return*/, webresource];
                    case 2:
                        namesplit = webresource.name.split('.'), extension = namesplit[namesplit.length - 1];
                        _a = webresource;
                        return [4 /*yield*/, WebresourceService.getWebresourcetype(extension, context)];
                    case 3:
                        _a.webresourcetype = _b.sent();
                        return [4 /*yield*/, NodeApi_1.NodeApi.insertRecord(WebresourceService.entitySetName, webresource, context)];
                    case 4:
                        newWebresource = _b.sent();
                        return [2 /*return*/, newWebresource];
                }
            });
        });
    };
    WebresourceService.publish = function (webresource, context) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                data = {
                    ParameterXml: "<importexportxml><webresources><webresource>{" + webresource.webresourceid + "}</webresource></webresources></importexportxml>"
                };
                return [2 /*return*/, NodeApi_1.NodeApi.executeAction('PublishXml', context, data)];
            });
        });
    };
    WebresourceService.addToSolution = function (webresource, context) {
        return __awaiter(this, void 0, void 0, function () {
            var settings, crm, solution_name;
            return __generator(this, function (_a) {
                settings = context.settings, crm = settings.crm, solution_name = crm.solution_name;
                return [2 /*return*/, NodeApi_1.NodeApi.executeAction('AddSolutionComponent', context, {
                        ComponentId: webresource.webresourceid,
                        ComponentType: ComponentType_1.ComponentType.Webresource,
                        SolutionUniqueName: solution_name,
                        AddRequiredComponents: false,
                        IncludedComponentSettingsValues: null
                    })];
            });
        });
    };
    WebresourceService.getWebresourcetype = function (extension, context) {
        return __awaiter(this, void 0, void 0, function () {
            var options, webresourcetype, scriptvalue, _i, options_1, _a, value, label;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, NodeApi_1.NodeApi.getPicklistOptionSet(WebresourceService.logicalName, 'webresourcetype', context)];
                    case 1:
                        options = _b.sent();
                        for (_i = 0, options_1 = options; _i < options_1.length; _i++) {
                            _a = options_1[_i], value = _a.value, label = _a.label;
                            if (label.toLocaleLowerCase().includes('script')) {
                                scriptvalue = parseInt(String(value), 10);
                            }
                            if (label.toLowerCase().includes(extension)) {
                                webresourcetype = parseInt(String(value), 10);
                                break;
                            }
                        }
                        if (!webresourcetype && extension === 'json') {
                            webresourcetype = scriptvalue;
                        }
                        return [2 /*return*/, webresourcetype];
                }
            });
        });
    };
    WebresourceService.logicalName = 'webresource';
    WebresourceService.entitySetName = 'webresourceset';
    return WebresourceService;
}());
exports.WebresourceService = WebresourceService;


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

/***/ "./src/root/tools/deploy/DeployWebresource.ts":
/*!****************************************************!*\
  !*** ./src/root/tools/deploy/DeployWebresource.ts ***!
  \****************************************************/
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
var Webresource_service_1 = __webpack_require__(/*! ../Webresource/Webresource.service */ "./src/root/tools/Webresource/Webresource.service.ts");
var xml2js = __webpack_require__(/*! xml2js */ "xml2js");
var shell = __webpack_require__(/*! shelljs */ "shelljs");
var Deploy_1 = __webpack_require__(/*! ./Deploy */ "./src/root/tools/deploy/Deploy.ts");
var DeployWebresource = /** @class */ (function (_super) {
    __extends(DeployWebresource, _super);
    function DeployWebresource() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DeployWebresource.prototype.deploy = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, publisher_prefix, url;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.settings.crm, publisher_prefix = _a.publisher_prefix, url = _a.url;
                        this.log("Deploying to " + url + "...<br/>");
                        return [4 /*yield*/, this.deployDirectory("dist/" + publisher_prefix + "_")];
                    case 1:
                        _b.sent();
                        this.log('Deploy finished');
                        return [2 /*return*/];
                }
            });
        });
    };
    DeployWebresource.prototype.deployDirectory = function (directory) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        fs.readdir(directory, function (err, files) { return __awaiter(_this, void 0, void 0, function () {
                            var promises, _i, files_1, file, path, stats, _a, _b, _c, _d;
                            return __generator(this, function (_e) {
                                switch (_e.label) {
                                    case 0:
                                        promises = [];
                                        _i = 0, files_1 = files;
                                        _e.label = 1;
                                    case 1:
                                        if (!(_i < files_1.length)) return [3 /*break*/, 6];
                                        file = files_1[_i];
                                        path = directory + "/" + file, stats = fs.lstatSync(path);
                                        if (!stats.isDirectory()) return [3 /*break*/, 3];
                                        _b = (_a = promises).push;
                                        return [4 /*yield*/, this.deployDirectory(path)];
                                    case 2:
                                        _b.apply(_a, [_e.sent()]);
                                        return [3 /*break*/, 5];
                                    case 3:
                                        _d = (_c = promises).push;
                                        return [4 /*yield*/, this.deployFile(path)];
                                    case 4:
                                        _d.apply(_c, [_e.sent()]);
                                        _e.label = 5;
                                    case 5:
                                        _i++;
                                        return [3 /*break*/, 1];
                                    case 6:
                                        Promise.all(promises).then(function () {
                                            resolve();
                                        });
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                    })];
            });
        });
    };
    DeployWebresource.prototype.deployFile = function (filepath) {
        return __awaiter(this, void 0, void 0, function () {
            var filedata, crmPath, webresource;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filedata = fs.readFileSync(filepath), crmPath = filepath.substr(5);
                        return [4 /*yield*/, this.getWebresource(crmPath)];
                    case 1:
                        webresource = _a.sent();
                        this.log("" + crmPath);
                        if (!webresource) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.updateWebresource(webresource, filedata)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.insertWebresource(filedata, crmPath)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    DeployWebresource.prototype.updateWebresource = function (webresource, data) {
        return __awaiter(this, void 0, void 0, function () {
            var md5Orig, base64, dependencyXML, md5New, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        md5Orig = this.md5(webresource.content), base64 = data.toString('base64');
                        return [4 /*yield*/, this.generateDependencyXML(webresource, data)];
                    case 1:
                        dependencyXML = _a.sent(), md5New = this.md5(base64);
                        if (!(md5Orig !== md5New || dependencyXML && dependencyXML !== (webresource === null || webresource === void 0 ? void 0 : webresource.dependencyxml))) return [3 /*break*/, 7];
                        webresource.content = base64;
                        webresource.dependencyxml = dependencyXML;
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, Webresource_service_1.WebresourceService.upsert(webresource, this.context)];
                    case 3:
                        _a.sent();
                        this.log(" updated...");
                        return [4 /*yield*/, Webresource_service_1.WebresourceService.publish(webresource, this.context)];
                    case 4:
                        _a.sent();
                        this.log(" and published<br/>");
                        return [3 /*break*/, 6];
                    case 5:
                        e_1 = _a.sent();
                        this.log(" failed " + e_1.message + "<br/>");
                        return [3 /*break*/, 6];
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        this.log(" unmodified<br/>");
                        _a.label = 8;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    DeployWebresource.prototype.insertWebresource = function (data, path) {
        return __awaiter(this, void 0, void 0, function () {
            var base64, webresourceModel, dependencyXML, webresource, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        base64 = data.toString('base64');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        webresourceModel = {
                            content: base64,
                            name: path,
                            displayname: path
                        };
                        return [4 /*yield*/, this.generateDependencyXML(webresourceModel, data)];
                    case 2:
                        dependencyXML = _a.sent();
                        if (dependencyXML) {
                            webresourceModel.dependencyxml = dependencyXML;
                        }
                        return [4 /*yield*/, Webresource_service_1.WebresourceService.upsert(webresourceModel, this.context)];
                    case 3:
                        webresource = _a.sent();
                        this.log(" inserted...");
                        return [4 /*yield*/, Webresource_service_1.WebresourceService.addToSolution(webresource, this.context)];
                    case 4:
                        _a.sent();
                        this.log(" and added to solution " + this.settings.crm.solution_name + "<br/>");
                        return [2 /*return*/, webresource];
                    case 5:
                        e_2 = _a.sent();
                        this.log(" failed " + e_2.message + "<br/>");
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    DeployWebresource.prototype.getWebresource = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var webresources;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Webresource_service_1.WebresourceService.retrieveMultipleRecords({
                            select: ['name', 'webresourcetype', 'content', 'displayname', 'solutionid', 'dependencyxml'],
                            filters: [{
                                    conditions: [{
                                            attribute: 'name',
                                            value: path
                                        }]
                                }],
                            top: 1
                        }, this.context)];
                    case 1:
                        webresources = _a.sent();
                        return [2 /*return*/, webresources[0]];
                }
            });
        });
    };
    // Small wrapper method for future support of html files, etc
    DeployWebresource.prototype.generateDependencyXML = function (webresource, data) {
        return __awaiter(this, void 0, void 0, function () {
            var dependencyXML;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!webresource.name.endsWith('.js')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getDependencyXML(webresource, data)];
                    case 1:
                        dependencyXML = _a.sent();
                        console.log("Dependencyxml: " + dependencyXML);
                        return [2 /*return*/, dependencyXML];
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    Object.defineProperty(DeployWebresource, "xmlRegex", {
        get: function () {
            return /(\s?\n+\s+|\n)/g;
        },
        enumerable: true,
        configurable: true
    });
    DeployWebresource.prototype.getDependencyXML = function (webresource, data) {
        return __awaiter(this, void 0, void 0, function () {
            var xmlDoc, xml, trimmedXml, index;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.generateWebresourceXmlDoc(webresource, data)];
                    case 1:
                        xmlDoc = _a.sent();
                        xml = DeployWebresource.xmlBuilder.buildObject(xmlDoc);
                        trimmedXml = xml.replace(DeployWebresource.xmlRegex, '');
                        index = trimmedXml.indexOf('?>');
                        trimmedXml = trimmedXml.substr(index + 2);
                        return [2 /*return*/, trimmedXml];
                }
            });
        });
    };
    Object.defineProperty(DeployWebresource, "defaultDependencyxml", {
        get: function () {
            return "<Dependencies><Dependency componentType=\"WebResource\"></Dependency></Dependencies>";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DeployWebresource, "translationRegex", {
        get: function () {
            return /\.translate\("([^']*)"\)/gm;
        },
        enumerable: true,
        configurable: true
    });
    DeployWebresource.prototype.generateWebresourceXmlDoc = function (webresource, data) {
        return __awaiter(this, void 0, void 0, function () {
            var resxPaths, jsonPaths, filepaths, xmlDoc, hasTranslation;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        resxPaths = shell.ls("dist/**/locales/*.resx"), jsonPaths = shell.ls("dist/**/locales/*.json"), filepaths = resxPaths.concat(jsonPaths).map(function (filepath) { return filepath.substr(5); });
                        if (filepaths.length === 0 && webresource.dependencyxml === null) {
                            return [2 /*return*/, null];
                        }
                        return [4 /*yield*/, xml2js.parseStringPromise(webresource.dependencyxml || DeployWebresource.defaultDependencyxml)];
                    case 1:
                        xmlDoc = _a.sent(), hasTranslation = DeployWebresource.translationRegex.test(String(data));
                        if (hasTranslation) {
                            this.addLibraries(xmlDoc, filepaths);
                            this.cleanLibraries(xmlDoc, filepaths);
                        }
                        else {
                            this.cleanLibraries(xmlDoc);
                        }
                        return [2 /*return*/, xmlDoc];
                }
            });
        });
    };
    DeployWebresource.prototype.addLibraries = function (xmlDoc, filepaths) {
        var dependency = xmlDoc.Dependencies.Dependency[0];
        if (!dependency.Library) {
            dependency.Library = [];
        }
        var _loop_1 = function (filepath) {
            var library = dependency.Library.find(function (library) { return library.$.name === filepath; });
            if (!library) {
                this_1.log("Adding dependency: " + filepath);
                dependency.Library.push({
                    $: DeployWebresource.createLibraryItem(filepath)
                });
            }
        };
        var this_1 = this;
        for (var _i = 0, filepaths_1 = filepaths; _i < filepaths_1.length; _i++) {
            var filepath = filepaths_1[_i];
            _loop_1(filepath);
        }
    };
    Object.defineProperty(DeployWebresource, "localesResxRegex", {
        get: function () {
            return /locales\/locales\.(\d{4})?\.resx/gm;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DeployWebresource, "localesJsonRegex", {
        get: function () {
            return /locales\/(\d{4})\.json/gm;
        },
        enumerable: true,
        configurable: true
    });
    DeployWebresource.prototype.cleanLibraries = function (xmlDoc, keepFilepaths) {
        if (keepFilepaths === void 0) { keepFilepaths = []; }
        var dependency = xmlDoc.Dependencies.Dependency[0];
        if (!dependency.Library) {
            return;
        }
        for (var i = dependency.Library.length - 1; i >= 0; i -= 1) {
            var library = dependency.Library[i], name_1 = library.$.name;
            if (DeployWebresource.localesResxRegex.test(name_1) || DeployWebresource.localesJsonRegex.test(name_1)) {
                if (!keepFilepaths.includes(name_1)) {
                    this.log("Removing dependency: " + name_1);
                    dependency.Library.splice(i, 1);
                }
            }
        }
    };
    DeployWebresource.createLibraryItem = function (filepath) {
        return {
            name: filepath,
            displayName: filepath,
            languagecode: DeployWebresource.getLanguageCode(filepath),
            description: '',
            libraryUniqueId: DeployWebresource.guid()
        };
    };
    DeployWebresource.getLanguageCode = function (filepath) {
        var match;
        if (filepath.endsWith('.resx')) {
            match = DeployWebresource.localesResxRegex.exec(filepath);
        }
        else if (filepath.endsWith('.json')) {
            match = DeployWebresource.localesJsonRegex.exec(filepath);
        }
        return match && match[1] || '';
    };
    DeployWebresource.guid = function () {
        return '{xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx}'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
    DeployWebresource.xmlBuilder = new xml2js.Builder();
    return DeployWebresource;
}(Deploy_1.Deploy));
exports.DeployWebresource = DeployWebresource;
new DeployWebresource();


/***/ }),

/***/ 0:
/*!**********************************************************!*\
  !*** multi ./src/root/tools/deploy/DeployWebresource.ts ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! C:\git\P030-CE-CLI\src\root\tools\deploy\DeployWebresource.ts */"./src/root/tools/deploy/DeployWebresource.ts");


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

/***/ "open":
/*!***********************!*\
  !*** external "open" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("open");

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
//# sourceMappingURL=deployWebresource.js.map