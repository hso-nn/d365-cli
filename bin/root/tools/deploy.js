/*! HSO D365 CLI 2.0.1 | (c) HSO Innovation */!function(e){var t={};function n(r){if(t[r])return t[r].exports;var i=t[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)n.d(r,i,function(t){return e[t]}.bind(null,i));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=12)}([function(e,t){e.exports=require("fs")},function(e,t){e.exports=require("shelljs")},function(e,t,n){"use strict";var r=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(i,o){function u(e){try{s(r.next(e))}catch(e){o(e)}}function a(e){try{s(r.throw(e))}catch(e){o(e)}}function s(e){var t;e.done?i(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(u,a)}s((r=r.apply(e,t||[])).next())}))},i=this&&this.__generator||function(e,t){var n,r,i,o,u={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return o={next:a(0),throw:a(1),return:a(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function a(o){return function(a){return function(o){if(n)throw new TypeError("Generator is already executing.");for(;u;)try{if(n=1,r&&(i=2&o[0]?r.return:o[0]?r.throw||((i=r.return)&&i.call(r),0):r.next)&&!(i=i.call(r,o[1])).done)return i;switch(r=0,i&&(o=[2&o[0],i.value]),o[0]){case 0:case 1:i=o;break;case 4:return u.label++,{value:o[1],done:!1};case 5:u.label++,r=o[1],o=[0];continue;case 7:o=u.ops.pop(),u.trys.pop();continue;default:if(!(i=u.trys,(i=i.length>0&&i[i.length-1])||6!==o[0]&&2!==o[0])){u=0;continue}if(3===o[0]&&(!i||o[1]>i[0]&&o[1]<i[3])){u.label=o[1];break}if(6===o[0]&&u.label<i[1]){u.label=i[1],i=o;break}if(i&&u.label<i[2]){u.label=i[2],u.ops.push(o);break}i[2]&&u.ops.pop(),u.trys.pop();continue}o=t.call(e,u)}catch(e){o=[6,e],r=0}finally{n=i=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,a])}}};Object.defineProperty(t,"__esModule",{value:!0});var o=n(0),u=n(4),a=function(){function e(){}return e.getSettings=function(){return e.cachedSettings||(e.cachedSettings=JSON.parse(o.readFileSync("tools/crm.json","utf8"))),e.cachedSettings},e.retrieveMultipleRecords=function(t,n,o){return r(this,void 0,void 0,(function(){var r,u,a,s,c;return i(this,(function(i){switch(i.label){case 0:return r=e.getSystemQueryOptions(n),u=e.getSettings().crm,a=u.url,s=u.version,c=a+"/api/data/v"+s+"/"+t+r,[4,e.request("GET",c,null,{Authorization:"Bearer "+o})];case 1:return[2,i.sent().body.value]}}))}))},e.retrieveRecord=function(t,n,o,u){return r(this,void 0,void 0,(function(){var r,a,s,c,l;return i(this,(function(i){switch(i.label){case 0:return r=e.getSystemQueryOptions(o),a=e.getSettings().crm,s=a.url,c=a.version,l=s+"/api/data/v"+c+"/"+t+"("+n+")"+r,[4,e.request("GET",l,null,{Authorization:"Bearer "+u})];case 1:return[2,i.sent().body]}}))}))},e.updateRecord=function(t,n,o,u){return r(this,void 0,void 0,(function(){var r,a,s,c;return i(this,(function(i){switch(i.label){case 0:return r=e.getSettings().crm,a=r.url,s=r.version,c=a+"/api/data/v"+s+"/"+t+"("+n+")",[4,e.request("PATCH",c,o,{Authorization:"Bearer "+u,Prefer:"return=representation"})];case 1:return[2,i.sent().body]}}))}))},e.insertRecord=function(t,n,o){return r(this,void 0,void 0,(function(){var r,u,a,s;return i(this,(function(i){switch(i.label){case 0:return r=e.getSettings().crm,u=r.url,a=r.version,s=u+"/api/data/v"+a+"/"+t,[4,e.request("POST",s,n,{Authorization:"Bearer "+o,Prefer:"return=representation"})];case 1:return[2,i.sent().body]}}))}))},e.getStatusOptionSet=function(t,n){return r(this,void 0,void 0,(function(){var r,o,u,a;return i(this,(function(i){switch(i.label){case 0:return r=e.getSettings().crm,o=r.url,u=r.version,a=o+"/api/data/v"+u+"/EntityDefinitions(LogicalName='"+t+"')/Attributes/Microsoft.Dynamics.CRM.StatusAttributeMetadata?$expand=OptionSet",[4,e.request("GET",a,null,{Authorization:"Bearer "+n})];case 1:return[2,i.sent().body.value[0].OptionSet.Options.map((function(e){return{value:e.Value,externalValue:e.ExternalValue,label:e.Label.UserLocalizedLabel.Label}}))]}}))}))},e.getStateOptionSet=function(t,n){return r(this,void 0,void 0,(function(){var r,o,u,a;return i(this,(function(i){switch(i.label){case 0:return r=e.getSettings().crm,o=r.url,u=r.version,a=o+"/api/data/v"+u+"/EntityDefinitions(LogicalName='"+t+"')/Attributes/Microsoft.Dynamics.CRM.StateAttributeMetadata?$expand=OptionSet",[4,e.request("GET",a,null,{Authorization:"Bearer "+n})];case 1:return[2,i.sent().body.value[0].OptionSet.Options.map((function(e){return{value:e.Value,externalValue:e.ExternalValue,label:e.Label.UserLocalizedLabel.Label}}))]}}))}))},e.getPicklistOptionSet=function(t,n,o){return r(this,void 0,void 0,(function(){var r,u,a,s;return i(this,(function(i){switch(i.label){case 0:return r=e.getSettings().crm,u=r.url,a=r.version,s=u+"/api/data/v"+a+"/EntityDefinitions(LogicalName='"+t+"')/Attributes(LogicalName='"+n+"')/Microsoft.Dynamics.CRM.PicklistAttributeMetadata?$select=LogicalName&$expand=OptionSet($select=Options)",[4,e.request("GET",s,null,{Authorization:"Bearer "+o})];case 1:return[2,i.sent().body.OptionSet.Options.map((function(e){return{value:e.Value,externalValue:e.ExternalValue,label:e.Label.UserLocalizedLabel.Label}}))]}}))}))},e.getBooleanOptionSet=function(t,n,o){return r(this,void 0,void 0,(function(){var r,u,a,s,c,l,d,f;return i(this,(function(i){switch(i.label){case 0:return r=e.getSettings().crm,u=r.url,a=r.version,s=u+"/api/data/v"+a+"/EntityDefinitions(LogicalName='"+t+"')/Attributes(LogicalName='"+n+"')/Microsoft.Dynamics.CRM.BooleanAttributeMetadata?$select=LogicalName&$expand=OptionSet($select=TrueOption,FalseOption)",[4,e.request("GET",s,null,{Authorization:"Bearer "+o})];case 1:return c=i.sent().body,l=c.OptionSet,d=l.FalseOption,f=l.TrueOption,[2,[{value:d.Value,label:d.Label.UserLocalizedLabel.Label},{value:f.Value,label:f.Label.UserLocalizedLabel.Label}]]}}))}))},e.executeAction=function(e,t,n,o,u){return r(this,void 0,void 0,(function(){return i(this,(function(r){return o?[2,this.executeBoundAction(e,t,n,o,u)]:[2,this.executeUnboundAction(e,t,n)]}))}))},e.executeBoundAction=function(t,n,o,u,a){return r(this,void 0,void 0,(function(){var r,s,c,l,d;return i(this,(function(i){switch(i.label){case 0:return[4,Xrm.Utility.getEntityMetadata(u)];case 1:return r=i.sent(),s=e.getSettings().crm,c=s.url,l=s.version,d=c+"/api/data/v"+l+"/"+r.EntitySetName+"("+a+")/Microsoft.Dynamics.CRM."+t,[4,e.request("POST",d,o,{Authorization:"Bearer "+n})];case 2:return[2,i.sent().body]}}))}))},e.executeUnboundAction=function(t,n,o){return r(this,void 0,void 0,(function(){var r,u,a,s,c;return i(this,(function(i){switch(i.label){case 0:return r=o?"POST":"GET",u=e.getSettings().crm,a=u.url,s=u.version,c=a+"/api/data/v"+s+"/"+t,[4,e.request(r,c,o,{Authorization:"Bearer "+n})];case 1:return[2,i.sent().body]}}))}))},e.getSystemQueryOptions=function(t){var n=t.select,r=t.filters,i=t.top,o=e.generateSelect(n),u=e.generateFilter(r),a=i?"$top="+i:null,s=[];return o&&s.push(o),u&&s.push(u),a&&s.push(a),s.length>0?"?"+s.join("&"):""},e.generateSelect=function(e){return void 0===e&&(e=[]),e.length>0?"$select="+e.join(","):null},e.generateFilter=function(t){void 0===t&&(t=[]);var n=[];if(t.length>0)for(var r=0,i=t;r<i.length;r++){var o=i[r];n.push(e.parseFilter(o))}return n.length>0?"$filter="+n.join(" and "):null},e.parseFilter=function(e){for(var t=e.type,n=void 0===t?"and":t,r=[],i=0,o=e.conditions;i<o.length;i++){var u=o[i],a=u.attribute,s=u.operator,c=void 0===s?"eq":s,l=u.value,d=a+" "+c;d+="string"==typeof l?" '"+l+"'":" "+l,r.push(d)}return""+r.join(" "+n+" ")},e.request=function(t,n,r,i){return void 0===i&&(i={}),new Promise((function(o,a){var s=e.getRequestOptions(t,n,i,r),c=u.request(s,(function(t){var n="";t.setEncoding("utf8"),t.on("data",(function(e){return n+=e})),t.on("end",(function(){try{o(e.handleNodeHttpsResponse(t,n))}catch(e){a(e)}}))}));c.on("error",(function(e){a(e)})),"GET"!==t&&c.write(r&&JSON.stringify(r)),c.end()}))},e.getRequestOptions=function(t,n,r,i){var o=n.split("/"),u=o[2],a="/"+o.slice(3,o.length).join("/"),s=Object.assign({},e.jsonHeaders,r);if("GET"!==t){var c=i&&JSON.stringify(i);s["Content-Length"]=c.length}return{hostname:u,port:443,path:encodeURI(a),method:t,headers:s}},e.handleNodeHttpsResponse=function(t,n){var r={200:function(){return e.dataHandler(t,n)},201:function(){return e.dataHandler(t,n)},204:function(){return{body:"",getResponseHeader:function(e){return t.headers[e]},statusCode:t.statusCode}}}[t.statusCode];if(r)return r();if(401===t.statusCode)throw new Error("Unauthorized");throw new Error(t.statusCode+": "+t.statusMessage+"\n "+n)},e.dataHandler=function(e,t){var n=null;try{n=JSON.parse(t)}catch(e){throw new Error("JSON response can't be parsed")}return{body:n,getResponseHeader:function(t){return e.headers[t]},statusCode:e.statusCode}},e.getEntityDefinition=function(t,n,o){return r(this,void 0,void 0,(function(){var r,u,a,s;return i(this,(function(i){switch(i.label){case 0:return r=e.getSettings().crm,u=r.url,a=r.version,s=u+"/api/data/v"+a+"/EntityDefinitions(LogicalName='"+t+"')",o&&(s+="?$select="+o.join(",")),[4,e.request("GET",s,null,{Authorization:"Bearer "+n})];case 1:return[2,i.sent().body]}}))}))},e.getManyToOneMetadatas=function(t,n){return r(this,void 0,void 0,(function(){var r,o,u,a,s;return i(this,(function(i){switch(i.label){case 0:return r=e.getSettings().crm,o=r.url,u=r.version,a=o+"/api/data/v"+u+"/EntityDefinitions(LogicalName='"+t+"')/ManyToOneRelationships",[4,e.request("GET",a,null,{Authorization:"Bearer "+n})];case 1:return s=i.sent().body,[2,s.value]}}))}))},e.getAttributesMetadata=function(t,n,o){return r(this,void 0,void 0,(function(){var r,u,a,s,c;return i(this,(function(i){switch(i.label){case 0:return r=e.getSettings().crm,u=r.url,a=r.version,s=u+"/api/data/v"+a+"/EntityDefinitions(LogicalName='"+t+"')/Attributes?$filter=IsValidODataAttribute eq true",o&&(s+="&$select="+o.join(",")),[4,e.request("GET",s,null,{Authorization:"Bearer "+n})];case 1:return c=i.sent().body,[2,c.value]}}))}))},e.jsonHeaders={"OData-MaxVersion":"4.0","OData-Version":"4.0",Accept:"application/json","Content-Type":"application/json; charset=utf-8"},e}();t.NodeApi=a},,function(e,t){e.exports=require("https")},function(e,t,n){"use strict";var r=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(i,o){function u(e){try{s(r.next(e))}catch(e){o(e)}}function a(e){try{s(r.throw(e))}catch(e){o(e)}}function s(e){var t;e.done?i(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(u,a)}s((r=r.apply(e,t||[])).next())}))},i=this&&this.__generator||function(e,t){var n,r,i,o,u={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return o={next:a(0),throw:a(1),return:a(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function a(o){return function(a){return function(o){if(n)throw new TypeError("Generator is already executing.");for(;u;)try{if(n=1,r&&(i=2&o[0]?r.return:o[0]?r.throw||((i=r.return)&&i.call(r),0):r.next)&&!(i=i.call(r,o[1])).done)return i;switch(r=0,i&&(o=[2&o[0],i.value]),o[0]){case 0:case 1:i=o;break;case 4:return u.label++,{value:o[1],done:!1};case 5:u.label++,r=o[1],o=[0];continue;case 7:o=u.ops.pop(),u.trys.pop();continue;default:if(!(i=u.trys,(i=i.length>0&&i[i.length-1])||6!==o[0]&&2!==o[0])){u=0;continue}if(3===o[0]&&(!i||o[1]>i[0]&&o[1]<i[3])){u.label=o[1];break}if(6===o[0]&&u.label<i[1]){u.label=i[1],i=o;break}if(i&&u.label<i[2]){u.label=i[2],u.ops.push(o);break}i[2]&&u.ops.pop(),u.trys.pop();continue}o=t.call(e,u)}catch(e){o=[6,e],r=0}finally{n=i=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,a])}}};Object.defineProperty(t,"__esModule",{value:!0});var o=n(6),u=n(7),a=n(0),s=function(){function e(){this.sockets=[],this.settings=JSON.parse(a.readFileSync("tools/crm.json","utf8")),this.express=o(),this.express.use(o.static("node_modules/adal-angular/dist")),this.mountRoutes(),this.startListen()}return e.prototype.startListen=function(){var e=this,t=this.settings.adal.redirectUri.split("/"),n=t[t.length-2].split(":"),r=parseInt(n[1]),i=t.slice(0,t.length-1).join("/");this.httpServer=this.express.listen(r,(function(){return u(i),console.log("server is listening on "+r)})),this.httpServer.on("connection",(function(t){e.sockets.push(t)}))},e.prototype.mountRoutes=function(){var t=o.Router();return e.mountDefaultRoute(t),this.mountAuthRoute(t),this.mountTokenRoute(t),this.mountAuthenticatedRoute(t),this.express.use("/",t),t},e.mountDefaultRoute=function(e){e.get("/",(function(e,t){t.redirect("/auth")}))},e.prototype.mountAuthRoute=function(e){var t=this;e.get("/auth",(function(e,n){n.send('\n                <head>\n                    <title>Login</title>\n                </head>\n                <body>\n                    <script src="adal.min.js"><\/script>\n                    <script>\n                        var config = {\n                            clientId: "'+t.settings.adal.clientId+"\",\n                            popUp: true,\n                            callback: function (errorDesc, id_token, error, tokenType) {\n                                authContext.acquireToken('"+t.settings.crm.url+'\', function (errorDesc, access_token, error, tokenType) {\n                                    if (!error) {\n                                        window.location.href = "/token/" + access_token;\n                                    } else {\n                                        var errorSpan = document.createElement("span");\n                                        errorSpan.innerHTML = "<b>Error during acquireToken (access_token):</b><br/>" + errorDesc;\n                                        document.body.appendChild(errorSpan);\n                                    }\n                                });\n                            }\n                        }\n                        var tenant = "'+t.settings.adal.tenant+'";\n                        if (tenant !== "undefined") {\n                            config.tenant = tenant;\n                        }\n                        var authContext = new AuthenticationContext(config);\n                        if (authContext.isCallback(window.location.hash)) {\n                            authContext.handleWindowCallback();\n                        } else {\n                            authContext.login();\n                        }\n                    <\/script>\n                </body>')}))},e.prototype.mountTokenRoute=function(e){var t=this;e.get("/token/:token",(function(e,n){t.bearer=e.params.token,n.redirect("/authenticated")}))},e.prototype.mountAuthenticatedRoute=function(e){var t=this;e.get("/authenticated",(function(e,n){return r(t,void 0,void 0,(function(){var e=this;return i(this,(function(t){switch(t.label){case 0:return n.setHeader("Connection","Transfer-Encoding"),n.setHeader("Content-Type","text/html; charset=utf-8"),n.setHeader("Transfer-Encoding","chunked"),n.flushHeaders(),this.response=n,[4,this.onAuthenticated()];case 1:return t.sent(),setTimeout((function(){e.httpServer.close((function(){return console.log("server stopped listening")}));for(var t=0,n=e.sockets;t<n.length;t++){n[t].destroy()}}),100),n.send(),[2]}}))}))}))},e.prototype.onAuthenticated=function(){return Promise.resolve()},e.prototype.log=function(e){var t=this;return new Promise((function(n){t.response.write(e+"<br/>",(function(){t.response.flushHeaders(),n()}))}))},e}();t.AdalRouter=s},function(e,t){e.exports=require("express")},function(e,t){e.exports=require("open")},,function(e,t){e.exports=require("xml2js")},,,function(e,t,n){e.exports=n(13)},function(e,t,n){"use strict";var r,i=this&&this.__extends||(r=function(e,t){return(r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n])})(e,t)},function(e,t){function n(){this.constructor=e}r(e,t),e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)}),o=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(i,o){function u(e){try{s(r.next(e))}catch(e){o(e)}}function a(e){try{s(r.throw(e))}catch(e){o(e)}}function s(e){var t;e.done?i(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(u,a)}s((r=r.apply(e,t||[])).next())}))},u=this&&this.__generator||function(e,t){var n,r,i,o,u={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return o={next:a(0),throw:a(1),return:a(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function a(o){return function(a){return function(o){if(n)throw new TypeError("Generator is already executing.");for(;u;)try{if(n=1,r&&(i=2&o[0]?r.return:o[0]?r.throw||((i=r.return)&&i.call(r),0):r.next)&&!(i=i.call(r,o[1])).done)return i;switch(r=0,i&&(o=[2&o[0],i.value]),o[0]){case 0:case 1:i=o;break;case 4:return u.label++,{value:o[1],done:!1};case 5:u.label++,r=o[1],o=[0];continue;case 7:o=u.ops.pop(),u.trys.pop();continue;default:if(!(i=u.trys,(i=i.length>0&&i[i.length-1])||6!==o[0]&&2!==o[0])){u=0;continue}if(3===o[0]&&(!i||o[1]>i[0]&&o[1]<i[3])){u.label=o[1];break}if(6===o[0]&&u.label<i[1]){u.label=i[1],i=o;break}if(i&&u.label<i[2]){u.label=i[2],u.ops.push(o);break}i[2]&&u.ops.pop(),u.trys.pop();continue}o=t.call(e,u)}catch(e){o=[6,e],r=0}finally{n=i=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,a])}}};Object.defineProperty(t,"__esModule",{value:!0});var a=n(0),s=n(14),c=n(5),l=n(15),d=n(9),f=n(1),p=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.md5=function(e){return l.createHash("md5").update(e).digest("hex")},t}return i(t,e),t.prototype.onAuthenticated=function(){return this.deploy()},t.prototype.deploy=function(){return o(this,void 0,void 0,(function(){var e,t,n;return u(this,(function(r){switch(r.label){case 0:return e=this.settings.crm,t=e.publisher_prefix,n=e.url,this.log("Deploying to "+n+"...<br/>"),[4,this.deployDirectory("dist/"+t+"_")];case 1:return r.sent(),this.log("Deploy finished"),[2]}}))}))},t.prototype.deployDirectory=function(e){return o(this,void 0,void 0,(function(){var t=this;return u(this,(function(n){return[2,new Promise((function(n){a.readdir(e,(function(r,i){return o(t,void 0,void 0,(function(){var t,r,o,s,c,l,d,f,p;return u(this,(function(u){switch(u.label){case 0:t=[],r=0,o=i,u.label=1;case 1:return r<o.length?(s=o[r],c=e+"/"+s,a.lstatSync(c).isDirectory()?(d=(l=t).push,[4,this.deployDirectory(c)]):[3,3]):[3,6];case 2:return d.apply(l,[u.sent()]),[3,5];case 3:return p=(f=t).push,[4,this.deployFile(c)];case 4:p.apply(f,[u.sent()]),u.label=5;case 5:return r++,[3,1];case 6:return Promise.all(t).then((function(){n()})),[2]}}))}))}))}))]}))}))},t.prototype.deployFile=function(e){return o(this,void 0,void 0,(function(){var t,n,r;return u(this,(function(i){switch(i.label){case 0:return t=a.readFileSync(e),n=e.substr(5),[4,this.getWebresource(n)];case 1:return r=i.sent(),this.log(""+n),r?[4,this.updateWebresource(r,t)]:[3,3];case 2:return i.sent(),[3,5];case 3:return[4,this.insertWebresource(t,n)];case 4:i.sent(),i.label=5;case 5:return[2]}}))}))},t.prototype.updateWebresource=function(e,t){return o(this,void 0,void 0,(function(){var n,r,i,o,a;return u(this,(function(u){switch(u.label){case 0:return n=this.md5(e.content),r=t.toString("base64"),[4,this.generateDependencyXML(e,t)];case 1:if(i=u.sent(),o=this.md5(r),!(n!==o||i&&i!==(null==e?void 0:e.dependencyxml)))return[3,7];e.content=r,e.dependencyxml=i,u.label=2;case 2:return u.trys.push([2,5,,6]),[4,s.WebresourceService.upsert(e,this.bearer)];case 3:return u.sent(),this.log(" updated..."),[4,s.WebresourceService.publish(e,this.bearer)];case 4:return u.sent(),this.log(" and published<br/>"),[3,6];case 5:return a=u.sent(),this.log(" failed "+a.message+"<br/>"),[3,6];case 6:return[3,8];case 7:this.log(" unmodified<br/>"),u.label=8;case 8:return[2]}}))}))},t.prototype.insertWebresource=function(e,t){return o(this,void 0,void 0,(function(){var n,r,i,o,a,c;return u(this,(function(u){switch(u.label){case 0:n=e.toString("base64"),u.label=1;case 1:return u.trys.push([1,5,,6]),r=this.settings.crm.solution_name,i={content:n,name:t,displayname:t},[4,this.generateDependencyXML(i,e)];case 2:return(o=u.sent())&&(i.dependencyxml=o),[4,s.WebresourceService.upsert(i,this.bearer)];case 3:return a=u.sent(),this.log(" inserted..."),[4,s.WebresourceService.addToSolution(a,r,this.bearer)];case 4:return u.sent(),this.log(" and added to solution "+r+"<br/>"),[2,a];case 5:return c=u.sent(),this.log(" failed "+c.message+"<br/>"),[3,6];case 6:return[2]}}))}))},t.prototype.getWebresource=function(e){return o(this,void 0,void 0,(function(){return u(this,(function(t){switch(t.label){case 0:return[4,s.WebresourceService.retrieveMultipleRecords({select:["name","webresourcetype","content","displayname","solutionid","dependencyxml"],filters:[{conditions:[{attribute:"name",value:e}]}],top:1},this.bearer)];case 1:return[2,t.sent()[0]]}}))}))},t.prototype.generateDependencyXML=function(e,t){return o(this,void 0,void 0,(function(){var n;return u(this,(function(r){switch(r.label){case 0:return e.name.endsWith(".js")?[4,this.getDependencyXML(e,t)]:[3,2];case 1:return n=r.sent(),console.log("Dependencyxml: "+n),[2,n];case 2:return[2]}}))}))},Object.defineProperty(t,"xmlRegex",{get:function(){return/(\s?\n+\s+|\n)/g},enumerable:!0,configurable:!0}),t.prototype.getDependencyXML=function(e,n){return o(this,void 0,void 0,(function(){var r,i,o,a;return u(this,(function(u){switch(u.label){case 0:return[4,this.generateWebresourceXmlDoc(e,n)];case 1:return r=u.sent(),i=t.xmlBuilder.buildObject(r),o=i.replace(t.xmlRegex,""),a=o.indexOf("?>"),[2,o=o.substr(a+2)]}}))}))},Object.defineProperty(t,"defaultDependencyxml",{get:function(){return'<Dependencies><Dependency componentType="WebResource"></Dependency></Dependencies>'},enumerable:!0,configurable:!0}),Object.defineProperty(t,"translationRegex",{get:function(){return/\.translate\("([^']*)"\)/gm},enumerable:!0,configurable:!0}),t.prototype.generateWebresourceXmlDoc=function(e,n){return o(this,void 0,void 0,(function(){var r,i,o,a;return u(this,(function(u){switch(u.label){case 0:return r=f.ls("dist/**/locales/*.resx"),i=f.ls("dist/**/locales/*.json"),0===(o=r.concat(i).map((function(e){return e.substr(5)}))).length&&null===e.dependencyxml?[2,null]:[4,d.parseStringPromise(e.dependencyxml||t.defaultDependencyxml)];case 1:return a=u.sent(),t.translationRegex.test(String(n))?(this.addLibraries(a,o),this.cleanLibraries(a,o)):this.cleanLibraries(a),[2,a]}}))}))},t.prototype.addLibraries=function(e,n){var r=e.Dependencies.Dependency[0];r.Library||(r.Library=[]);for(var i=function(e){r.Library.find((function(t){return t.$.name===e}))||(o.log("Adding dependency: "+e),r.Library.push({$:t.createLibraryItem(e)}))},o=this,u=0,a=n;u<a.length;u++){i(a[u])}},Object.defineProperty(t,"localesResxRegex",{get:function(){return/locales\/locales\.(\d{4})?\.resx/gm},enumerable:!0,configurable:!0}),Object.defineProperty(t,"localesJsonRegex",{get:function(){return/locales\/(\d{4})\.json/gm},enumerable:!0,configurable:!0}),t.prototype.cleanLibraries=function(e,n){void 0===n&&(n=[]);var r=e.Dependencies.Dependency[0];if(r.Library)for(var i=r.Library.length-1;i>=0;i-=1){var o=r.Library[i].$.name;(t.localesResxRegex.test(o)||t.localesJsonRegex.test(o))&&(n.includes(o)||(this.log("Removing dependency: "+o),r.Library.splice(i,1)))}},t.createLibraryItem=function(e){return{name:e,displayName:e,languagecode:t.getLanguageCode(e),description:"",libraryUniqueId:t.guid()}},t.getLanguageCode=function(e){var n;return e.endsWith(".resx")?n=t.localesResxRegex.exec(e):e.endsWith(".json")&&(n=t.localesJsonRegex.exec(e)),n&&n[1]||""},t.guid=function(){return"{xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx}".replace(/[xy]/g,(function(e){var t=16*Math.random()|0;return("x"===e?t:3&t|8).toString(16)}))},t.xmlBuilder=new d.Builder,t}(c.AdalRouter);t.Deploy=p,new p},function(e,t,n){"use strict";var r=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(i,o){function u(e){try{s(r.next(e))}catch(e){o(e)}}function a(e){try{s(r.throw(e))}catch(e){o(e)}}function s(e){var t;e.done?i(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(u,a)}s((r=r.apply(e,t||[])).next())}))},i=this&&this.__generator||function(e,t){var n,r,i,o,u={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return o={next:a(0),throw:a(1),return:a(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function a(o){return function(a){return function(o){if(n)throw new TypeError("Generator is already executing.");for(;u;)try{if(n=1,r&&(i=2&o[0]?r.return:o[0]?r.throw||((i=r.return)&&i.call(r),0):r.next)&&!(i=i.call(r,o[1])).done)return i;switch(r=0,i&&(o=[2&o[0],i.value]),o[0]){case 0:case 1:i=o;break;case 4:return u.label++,{value:o[1],done:!1};case 5:u.label++,r=o[1],o=[0];continue;case 7:o=u.ops.pop(),u.trys.pop();continue;default:if(!(i=u.trys,(i=i.length>0&&i[i.length-1])||6!==o[0]&&2!==o[0])){u=0;continue}if(3===o[0]&&(!i||o[1]>i[0]&&o[1]<i[3])){u.label=o[1];break}if(6===o[0]&&u.label<i[1]){u.label=i[1],i=o;break}if(i&&u.label<i[2]){u.label=i[2],u.ops.push(o);break}i[2]&&u.ops.pop(),u.trys.pop();continue}o=t.call(e,u)}catch(e){o=[6,e],r=0}finally{n=i=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,a])}}};Object.defineProperty(t,"__esModule",{value:!0});var o=n(2),u=function(){function e(){}return e.retrieveMultipleRecords=function(t,n){return r(this,void 0,void 0,(function(){return i(this,(function(r){return[2,o.NodeApi.retrieveMultipleRecords(e.entitySetName,t,n)]}))}))},e.retrieveRecord=function(t,n,u){return r(this,void 0,void 0,(function(){return i(this,(function(r){return[2,o.NodeApi.retrieveRecord(e.entitySetName,t,n,u)]}))}))},e.upsert=function(t,n){return r(this,void 0,void 0,(function(){var r,u,a;return i(this,(function(i){switch(i.label){case 0:return t.webresourceid?[4,o.NodeApi.updateRecord(e.entitySetName,t.webresourceid,t,n)]:[3,2];case 1:return i.sent(),[2,t];case 2:return r=t.name.split("."),u=r[r.length-1],a=t,[4,e.getWebresourcetype(u,n)];case 3:return a.webresourcetype=i.sent(),[4,o.NodeApi.insertRecord(e.entitySetName,t,n)];case 4:return[2,i.sent()]}}))}))},e.publish=function(e,t){return r(this,void 0,void 0,(function(){var n;return i(this,(function(r){return n={ParameterXml:"<importexportxml><webresources><webresource>{"+e.webresourceid+"}</webresource></webresources></importexportxml>"},[2,o.NodeApi.executeAction("PublishXml",t,n)]}))}))},e.addToSolution=function(e,t,n){return r(this,void 0,void 0,(function(){return i(this,(function(r){return[2,o.NodeApi.executeAction("AddSolutionComponent",n,{ComponentId:e.webresourceid,ComponentType:61,SolutionUniqueName:t,AddRequiredComponents:!1,IncludedComponentSettingsValues:null})]}))}))},e.getWebresourcetype=function(t,n){return r(this,void 0,void 0,(function(){var r,u,a,s,c,l,d,f;return i(this,(function(i){switch(i.label){case 0:return[4,o.NodeApi.getPicklistOptionSet(e.logicalName,"webresourcetype",n)];case 1:for(r=i.sent(),s=0,c=r;s<c.length;s++)if(l=c[s],d=l.value,(f=l.label).toLocaleLowerCase().includes("script")&&(a=parseInt(String(d),10)),f.toLowerCase().includes(t)){u=parseInt(String(d),10);break}return u||"json"!==t||(u=a),[2,u]}}))}))},e.logicalName="webresource",e.entitySetName="webresourceset",e}();t.WebresourceService=u},function(e,t){e.exports=require("crypto")}]);