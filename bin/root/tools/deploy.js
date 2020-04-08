/*! HSO D365 CLI 1.5.2 | (c) HSO Innovation */!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=12)}([function(e,t){e.exports=require("fs")},function(e,t){e.exports=require("shelljs")},,function(e,t,n){"use strict";var r=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(o,i){function u(e){try{a(r.next(e))}catch(e){i(e)}}function s(e){try{a(r.throw(e))}catch(e){i(e)}}function a(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(u,s)}a((r=r.apply(e,t||[])).next())}))},o=this&&this.__generator||function(e,t){var n,r,o,i,u={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function s(i){return function(s){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;u;)try{if(n=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return u.label++,{value:i[1],done:!1};case 5:u.label++,r=i[1],i=[0];continue;case 7:i=u.ops.pop(),u.trys.pop();continue;default:if(!(o=u.trys,(o=o.length>0&&o[o.length-1])||6!==i[0]&&2!==i[0])){u=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){u.label=i[1];break}if(6===i[0]&&u.label<o[1]){u.label=o[1],o=i;break}if(o&&u.label<o[2]){u.label=o[2],u.ops.push(i);break}o[2]&&u.ops.pop(),u.trys.pop();continue}i=t.call(e,u)}catch(e){i=[6,e],r=0}finally{n=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,s])}}};Object.defineProperty(t,"__esModule",{value:!0});var i=n(0),u=n(5),s=function(){function e(){}return e.retrieveMultipleRecords=function(t,n,i){return r(this,void 0,void 0,(function(){var r,u,s,a,c;return o(this,(function(o){switch(o.label){case 0:return r=e.getSystemQueryOptions(n),u=e.settings.crm,s=u.url,a=u.version,c=s+"/api/data/v"+a+"/"+t+r,[4,e.request("GET",c,null,{Authorization:"Bearer "+i})];case 1:return[2,o.sent().body.value]}}))}))},e.retrieveRecord=function(t,n,i,u){return r(this,void 0,void 0,(function(){var r,s,a,c,l;return o(this,(function(o){switch(o.label){case 0:return r=e.getSystemQueryOptions(i),s=e.settings.crm,a=s.url,c=s.version,l=a+"/api/data/v"+c+"/"+t+"("+n+")"+r,[4,e.request("GET",l,null,{Authorization:"Bearer "+u})];case 1:return[2,o.sent().body]}}))}))},e.updateRecord=function(t,n,i,u){return r(this,void 0,void 0,(function(){var r,s,a,c;return o(this,(function(o){switch(o.label){case 0:return r=e.settings.crm,s=r.url,a=r.version,c=s+"/api/data/v"+a+"/"+t+"("+n+")",[4,e.request("PATCH",c,i,{Authorization:"Bearer "+u,Prefer:"return=representation"})];case 1:return[2,o.sent().body]}}))}))},e.insertRecord=function(t,n,i){return r(this,void 0,void 0,(function(){var r,u,s,a;return o(this,(function(o){switch(o.label){case 0:return r=e.settings.crm,u=r.url,s=r.version,a=u+"/api/data/v"+s+"/"+t,[4,e.request("POST",a,n,{Authorization:"Bearer "+i,Prefer:"return=representation"})];case 1:return[2,o.sent().body]}}))}))},e.getPicklistOptionSet=function(t,n,i){return r(this,void 0,void 0,(function(){var r,u,s,a;return o(this,(function(o){switch(o.label){case 0:return r=e.settings.crm,u=r.url,s=r.version,a=u+"/api/data/v"+s+"/EntityDefinitions(LogicalName='"+t+"')/Attributes(LogicalName='"+n+"')/Microsoft.Dynamics.CRM.PicklistAttributeMetadata?$select=LogicalName&$expand=OptionSet($select=Options)",[4,e.request("GET",a,null,{Authorization:"Bearer "+i})];case 1:return[2,o.sent().body.OptionSet.Options.map((function(e){return{value:e.Value,externalValue:e.ExternalValue,label:e.Label.UserLocalizedLabel.Label}}))]}}))}))},e.executeAction=function(e,t,n,i,u){return r(this,void 0,void 0,(function(){return o(this,(function(r){return i?[2,this.executeBoundAction(e,t,n,i,u)]:[2,this.executeUnboundAction(e,t,n)]}))}))},e.executeBoundAction=function(t,n,i,u,s){return r(this,void 0,void 0,(function(){var r,a,c,l,d;return o(this,(function(o){switch(o.label){case 0:return[4,Xrm.Utility.getEntityMetadata(u)];case 1:return r=o.sent(),a=e.settings.crm,c=a.url,l=a.version,d=c+"/api/data/v"+l+"/"+r.EntitySetName+"("+s+")/Microsoft.Dynamics.CRM."+t,[4,e.request("POST",d,i,{Authorization:"Bearer "+n})];case 2:return[2,o.sent().body]}}))}))},e.executeUnboundAction=function(t,n,i){return r(this,void 0,void 0,(function(){var r,u,s,a,c;return o(this,(function(o){switch(o.label){case 0:return r=i?"POST":"GET",u=e.settings.crm,s=u.url,a=u.version,c=s+"/api/data/v"+a+"/"+t,[4,e.request(r,c,i,{Authorization:"Bearer "+n})];case 1:return[2,o.sent().body]}}))}))},e.getSystemQueryOptions=function(t){var n=t.select,r=t.filters,o=t.top,i=e.generateSelect(n),u=e.generateFilter(r),s=o?"$top="+o:null,a=[];return i&&a.push(i),u&&a.push(u),s&&a.push(s),a.length>0?"?"+a.join("&"):""},e.generateSelect=function(e){return void 0===e&&(e=[]),e.length>0?"$select="+e.join(","):null},e.generateFilter=function(t){void 0===t&&(t=[]);var n=[];if(t.length>0)for(var r=0,o=t;r<o.length;r++){var i=o[r];n.push(e.parseFilter(i))}return n.length>0?"$filter="+n.join(" and "):null},e.parseFilter=function(e){for(var t=e.type,n=void 0===t?"and":t,r=[],o=0,i=e.conditions;o<i.length;o++){var u=i[o],s=u.attribute,a=u.operator,c=void 0===a?"eq":a,l=u.value,d=s+" "+c;d+="string"==typeof l?" '"+l+"'":" "+l,r.push(d)}return""+r.join(" "+n+" ")},e.request=function(t,n,r,o){return void 0===o&&(o={}),new Promise((function(i,s){var a=e.getRequestOptions(t,n,o,r),c=u.request(a,(function(t){var n="";t.setEncoding("utf8"),t.on("data",(function(e){return n+=e})),t.on("end",(function(){try{i(e.handleNodeHttpsResponse(t,n))}catch(e){s(e)}}))}));c.on("error",(function(e){s(e)})),"GET"!==t&&c.write(r&&JSON.stringify(r)),c.end()}))},e.getRequestOptions=function(t,n,r,o){var i=n.split("/"),u=i[2],s="/"+i.slice(3,i.length).join("/"),a=Object.assign({},e.jsonHeaders,r);if("GET"!==t){var c=o&&JSON.stringify(o);a["Content-Length"]=c.length}return{hostname:u,port:443,path:encodeURI(s),method:t,headers:a}},e.handleNodeHttpsResponse=function(t,n){var r={200:function(){return e.dataHandler(t,n)},201:function(){return e.dataHandler(t,n)},204:function(){return{body:"",getResponseHeader:function(e){return t.headers[e]},statusCode:t.statusCode}}}[t.statusCode];if(r)return r();if(401===t.statusCode)throw new Error("Unauthorized");throw new Error(t.statusCode+": "+t.statusMessage+"\n "+n)},e.dataHandler=function(e,t){var n=null;try{n=JSON.parse(t)}catch(e){throw new Error("JSON response can't be parsed")}return{body:n,getResponseHeader:function(t){return e.headers[t]},statusCode:e.statusCode}},e.settings=JSON.parse(i.readFileSync("tools/crm.json","utf8")),e.jsonHeaders={"OData-MaxVersion":"4.0","OData-Version":"4.0",Accept:"application/json","Content-Type":"application/json; charset=utf-8"},e}();t.NodeApi=s},,function(e,t){e.exports=require("https")},function(e,t,n){"use strict";var r=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(o,i){function u(e){try{a(r.next(e))}catch(e){i(e)}}function s(e){try{a(r.throw(e))}catch(e){i(e)}}function a(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(u,s)}a((r=r.apply(e,t||[])).next())}))},o=this&&this.__generator||function(e,t){var n,r,o,i,u={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function s(i){return function(s){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;u;)try{if(n=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return u.label++,{value:i[1],done:!1};case 5:u.label++,r=i[1],i=[0];continue;case 7:i=u.ops.pop(),u.trys.pop();continue;default:if(!(o=u.trys,(o=o.length>0&&o[o.length-1])||6!==i[0]&&2!==i[0])){u=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){u.label=i[1];break}if(6===i[0]&&u.label<o[1]){u.label=o[1],o=i;break}if(o&&u.label<o[2]){u.label=o[2],u.ops.push(i);break}o[2]&&u.ops.pop(),u.trys.pop();continue}i=t.call(e,u)}catch(e){i=[6,e],r=0}finally{n=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,s])}}};Object.defineProperty(t,"__esModule",{value:!0});var i=n(7),u=n(8),s=n(0),a=function(){function e(){this.sockets=[],this.settings=JSON.parse(s.readFileSync("tools/crm.json","utf8")),this.express=i(),this.express.use(i.static("node_modules/adal-angular/dist")),this.mountRoutes(),this.startListen()}return e.prototype.startListen=function(){var e=this,t=this.settings.adal.redirectUri.split("/"),n=t[t.length-2].split(":"),r=parseInt(n[1]),o=t.slice(0,t.length-1).join("/");this.httpServer=this.express.listen(r,(function(){return u(o),console.log("server is listening on "+r)})),this.httpServer.on("connection",(function(t){e.sockets.push(t)}))},e.prototype.mountRoutes=function(){var t=i.Router();return e.mountDefaultRoute(t),this.mountAuthRoute(t),this.mountTokenRoute(t),this.mountAuthenticatedRoute(t),this.express.use("/",t),t},e.mountDefaultRoute=function(e){e.get("/",(function(e,t){t.redirect("/auth")}))},e.prototype.mountAuthRoute=function(e){var t=this;e.get("/auth",(function(e,n){n.send('\n                <head>\n                    <title>test</title>\n                </head>\n                <body>\n                    <script src="adal.min.js"><\/script>\n                    <script>\n                        var config = {\n                            clientId: "'+t.settings.adal.clientId+"\",\n                            popUp: true,\n                            callback: function (errorDesc, token, error, tokenType) {\n                                authContext.acquireToken('"+t.settings.crm.url+'\', function (errorDesc, token, error) {\n                                    if (!error) {\n                                        window.location.href = "/token/" + token;\n                                    }\n                                });\n                            }\n                        }\n                        var authContext = new AuthenticationContext(config);\n                        if (authContext.isCallback(window.location.hash)) {\n                            authContext.handleWindowCallback();\n                        } else {\n                            authContext.login();\n                        }\n                    <\/script>\n                </body>')}))},e.prototype.mountTokenRoute=function(e){var t=this;e.get("/token/:token",(function(e,n){t.bearer=e.params.token,n.redirect("/authenticated")}))},e.prototype.mountAuthenticatedRoute=function(e){var t=this;e.get("/authenticated",(function(e,n){return r(t,void 0,void 0,(function(){var e=this;return o(this,(function(t){switch(t.label){case 0:return n.setHeader("Connection","Transfer-Encoding"),n.setHeader("Content-Type","text/html; charset=utf-8"),n.setHeader("Transfer-Encoding","chunked"),n.flushHeaders(),this.response=n,[4,this.onAuthenticated()];case 1:return t.sent(),setTimeout((function(){e.httpServer.close((function(){return console.log("server stopped listening")}));for(var t=0,n=e.sockets;t<n.length;t++){n[t].destroy()}}),100),n.send(),[2]}}))}))}))},e.prototype.onAuthenticated=function(){return Promise.resolve()},e.prototype.log=function(e){var t=this;return new Promise((function(n){t.response.write(e+"<br/>",(function(){t.response.flushHeaders(),n()}))}))},e}();t.AdalRouter=a},function(e,t){e.exports=require("express")},function(e,t){e.exports=require("open")},function(e,t){e.exports=require("xml2js")},,,function(e,t,n){e.exports=n(13)},function(e,t,n){"use strict";var r,o=this&&this.__extends||(r=function(e,t){return(r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n])})(e,t)},function(e,t){function n(){this.constructor=e}r(e,t),e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)}),i=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(o,i){function u(e){try{a(r.next(e))}catch(e){i(e)}}function s(e){try{a(r.throw(e))}catch(e){i(e)}}function a(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(u,s)}a((r=r.apply(e,t||[])).next())}))},u=this&&this.__generator||function(e,t){var n,r,o,i,u={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function s(i){return function(s){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;u;)try{if(n=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return u.label++,{value:i[1],done:!1};case 5:u.label++,r=i[1],i=[0];continue;case 7:i=u.ops.pop(),u.trys.pop();continue;default:if(!(o=u.trys,(o=o.length>0&&o[o.length-1])||6!==i[0]&&2!==i[0])){u=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){u.label=i[1];break}if(6===i[0]&&u.label<o[1]){u.label=o[1],o=i;break}if(o&&u.label<o[2]){u.label=o[2],u.ops.push(i);break}o[2]&&u.ops.pop(),u.trys.pop();continue}i=t.call(e,u)}catch(e){i=[6,e],r=0}finally{n=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,s])}}};Object.defineProperty(t,"__esModule",{value:!0});var s=n(0),a=n(14),c=n(6),l=n(15),d=n(9),f=n(1);(new(function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.md5=function(e){return l.createHash("md5").update(e).digest("hex")},t}return o(t,e),t.prototype.onAuthenticated=function(){return this.deploy()},t.prototype.deploy=function(){return i(this,void 0,void 0,(function(){var e,t,n;return u(this,(function(r){switch(r.label){case 0:return e=this.settings.crm,t=e.publisher_prefix,n=e.url,this.log("Deploying to "+n+"...<br/>"),[4,this.deployDirectory("dist/"+t+"_")];case 1:return r.sent(),this.log("Deploy finished"),[2]}}))}))},t.prototype.deployDirectory=function(e){return i(this,void 0,void 0,(function(){var t=this;return u(this,(function(n){return[2,new Promise((function(n){s.readdir(e,(function(r,o){return i(t,void 0,void 0,(function(){var t,r,i,a,c,l,d,f,p;return u(this,(function(u){switch(u.label){case 0:t=[],r=0,i=o,u.label=1;case 1:return r<i.length?(a=i[r],c=e+"/"+a,s.lstatSync(c).isDirectory()?(d=(l=t).push,[4,this.deployDirectory(c)]):[3,3]):[3,6];case 2:return d.apply(l,[u.sent()]),[3,5];case 3:return p=(f=t).push,[4,this.deployFile(c)];case 4:p.apply(f,[u.sent()]),u.label=5;case 5:return r++,[3,1];case 6:return Promise.all(t).then((function(){n()})),[2]}}))}))}))}))]}))}))},t.prototype.deployFile=function(e){return i(this,void 0,void 0,(function(){var t,n,r;return u(this,(function(o){switch(o.label){case 0:return t=s.readFileSync(e),n=e.substr(5),[4,this.getWebresource(n)];case 1:return r=o.sent(),this.log(""+n),r?[4,this.updateWebresource(r,t)]:[3,3];case 2:return o.sent(),[3,5];case 3:return[4,this.insertWebresource(t,n)];case 4:o.sent(),o.label=5;case 5:return[2]}}))}))},t.prototype.updateWebresource=function(e,t){return i(this,void 0,void 0,(function(){var n,r,o,i,s;return u(this,(function(u){switch(u.label){case 0:return n=this.md5(e.content),r=t.toString("base64"),[4,this.generateDependencyXML(e,t)];case 1:if(o=u.sent(),i=this.md5(r),!(n!==i||o&&o!==(null==e?void 0:e.dependencyxml)))return[3,7];e.content=r,e.dependencyxml=o,u.label=2;case 2:return u.trys.push([2,5,,6]),[4,a.WebresourceService.upsert(e,this.bearer)];case 3:return u.sent(),this.log(" updated..."),[4,a.WebresourceService.publish(e,this.bearer)];case 4:return u.sent(),this.log(" and published<br/>"),[3,6];case 5:return s=u.sent(),this.log(" failed "+s.message+"<br/>"),[3,6];case 6:return[3,8];case 7:this.log(" unmodified<br/>"),u.label=8;case 8:return[2]}}))}))},t.prototype.insertWebresource=function(e,t){return i(this,void 0,void 0,(function(){var n,r,o,i,s,c;return u(this,(function(u){switch(u.label){case 0:n=e.toString("base64"),u.label=1;case 1:return u.trys.push([1,5,,6]),r=this.settings.crm.solution_name,o={content:n,name:t,displayname:t},[4,this.generateDependencyXML(o,e)];case 2:return(i=u.sent())&&(o.dependencyxml=i),[4,a.WebresourceService.upsert(o,this.bearer)];case 3:return s=u.sent(),this.log(" inserted..."),[4,a.WebresourceService.addToSolution(s,r,this.bearer)];case 4:return u.sent(),this.log(" and added to solution "+r+"<br/>"),[2,s];case 5:return c=u.sent(),this.log(" failed "+c.message+"<br/>"),[3,6];case 6:return[2]}}))}))},t.prototype.getWebresource=function(e){return i(this,void 0,void 0,(function(){return u(this,(function(t){switch(t.label){case 0:return[4,a.WebresourceService.retrieveMultipleRecords({select:["name","webresourcetype","content","displayname","solutionid","dependencyxml"],filters:[{conditions:[{attribute:"name",value:e}]}],top:1},this.bearer)];case 1:return[2,t.sent()[0]]}}))}))},t.prototype.generateDependencyXML=function(e,t){return i(this,void 0,void 0,(function(){var n;return u(this,(function(r){switch(r.label){case 0:return e.name.endsWith(".js")?[4,this.getDependencyXML(e,t)]:[3,2];case 1:return n=r.sent(),console.log("Dependencyxml: "+n),[2,n];case 2:return[2]}}))}))},Object.defineProperty(t,"xmlRegex",{get:function(){return/(\s?\n+\s+|\n)/g},enumerable:!0,configurable:!0}),t.prototype.getDependencyXML=function(e,n){return i(this,void 0,void 0,(function(){var r,o,i,s;return u(this,(function(u){switch(u.label){case 0:return[4,this.generateWebresourceXmlDoc(e,n)];case 1:return r=u.sent(),o=t.xmlBuilder.buildObject(r),i=o.replace(t.xmlRegex,""),s=i.indexOf("?>"),[2,i=i.substr(s+2)]}}))}))},Object.defineProperty(t,"defaultDependencyxml",{get:function(){return'<Dependencies><Dependency componentType="WebResource"></Dependency></Dependencies>'},enumerable:!0,configurable:!0}),Object.defineProperty(t,"translationRegex",{get:function(){return/\.translate\("([^']*)"\)/gm},enumerable:!0,configurable:!0}),t.prototype.generateWebresourceXmlDoc=function(e,n){return i(this,void 0,void 0,(function(){var r,o,i,s;return u(this,(function(u){switch(u.label){case 0:return r=f.ls("dist/**/locales/*.resx"),o=f.ls("dist/**/locales/*.json"),0===(i=r.concat(o).map((function(e){return e.substr(5)}))).length&&null===e.dependencyxml?[2,null]:[4,d.parseStringPromise(e.dependencyxml||t.defaultDependencyxml)];case 1:return s=u.sent(),t.translationRegex.test(String(n))?(this.addLibraries(s,i),this.cleanLibraries(s,i)):this.cleanLibraries(s),[2,s]}}))}))},t.prototype.addLibraries=function(e,n){var r=e.Dependencies.Dependency[0];r.Library||(r.Library=[]);for(var o=function(e){r.Library.find((function(t){return t.$.name===e}))||(i.log("Adding dependency: "+e),r.Library.push({$:t.createLibraryItem(e)}))},i=this,u=0,s=n;u<s.length;u++){o(s[u])}},Object.defineProperty(t,"localesResxRegex",{get:function(){return/locales\/locales\.(\d{4})?\.resx/gm},enumerable:!0,configurable:!0}),Object.defineProperty(t,"localesJsonRegex",{get:function(){return/locales\/(\d{4})\.json/gm},enumerable:!0,configurable:!0}),t.prototype.cleanLibraries=function(e,n){void 0===n&&(n=[]);var r=e.Dependencies.Dependency[0];if(r.Library)for(var o=r.Library.length-1;o>=0;o-=1){var i=r.Library[o].$.name;(t.localesResxRegex.test(i)||t.localesJsonRegex.test(i))&&(n.includes(i)||(this.log("Removing dependency: "+i),r.Library.splice(o,1)))}},t.createLibraryItem=function(e){return{name:e,displayName:e,languagecode:t.getLanguageCode(e),description:"",libraryUniqueId:t.guid()}},t.getLanguageCode=function(e){var n;return e.endsWith(".resx")?n=t.localesResxRegex.exec(e):e.endsWith(".json")&&(n=t.localesJsonRegex.exec(e)),n&&n[1]||""},t.guid=function(){return"{xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx}".replace(/[xy]/g,(function(e){var t=16*Math.random()|0;return("x"===e?t:3&t|8).toString(16)}))},t.xmlBuilder=new d.Builder,t}(c.AdalRouter))).express},function(e,t,n){"use strict";var r=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(o,i){function u(e){try{a(r.next(e))}catch(e){i(e)}}function s(e){try{a(r.throw(e))}catch(e){i(e)}}function a(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(u,s)}a((r=r.apply(e,t||[])).next())}))},o=this&&this.__generator||function(e,t){var n,r,o,i,u={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function s(i){return function(s){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;u;)try{if(n=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return u.label++,{value:i[1],done:!1};case 5:u.label++,r=i[1],i=[0];continue;case 7:i=u.ops.pop(),u.trys.pop();continue;default:if(!(o=u.trys,(o=o.length>0&&o[o.length-1])||6!==i[0]&&2!==i[0])){u=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){u.label=i[1];break}if(6===i[0]&&u.label<o[1]){u.label=o[1],o=i;break}if(o&&u.label<o[2]){u.label=o[2],u.ops.push(i);break}o[2]&&u.ops.pop(),u.trys.pop();continue}i=t.call(e,u)}catch(e){i=[6,e],r=0}finally{n=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,s])}}};Object.defineProperty(t,"__esModule",{value:!0});var i=n(3),u=function(){function e(){}return e.retrieveMultipleRecords=function(t,n){return r(this,void 0,void 0,(function(){return o(this,(function(r){return[2,i.NodeApi.retrieveMultipleRecords(e.entitySetName,t,n)]}))}))},e.retrieveRecord=function(t,n,u){return r(this,void 0,void 0,(function(){return o(this,(function(r){return[2,i.NodeApi.retrieveRecord(e.entitySetName,t,n,u)]}))}))},e.upsert=function(t,n){return r(this,void 0,void 0,(function(){var r,u,s;return o(this,(function(o){switch(o.label){case 0:return t.webresourceid?[4,i.NodeApi.updateRecord(e.entitySetName,t.webresourceid,t,n)]:[3,2];case 1:return o.sent(),[2,t];case 2:return r=t.name.split("."),u=r[r.length-1],s=t,[4,e.getWebresourcetype(u,n)];case 3:return s.webresourcetype=o.sent(),[4,i.NodeApi.insertRecord(e.entitySetName,t,n)];case 4:return[2,o.sent()]}}))}))},e.publish=function(e,t){return r(this,void 0,void 0,(function(){var n;return o(this,(function(r){return n={ParameterXml:"<importexportxml><webresources><webresource>{"+e.webresourceid+"}</webresource></webresources></importexportxml>"},[2,i.NodeApi.executeAction("PublishXml",t,n)]}))}))},e.addToSolution=function(e,t,n){return r(this,void 0,void 0,(function(){return o(this,(function(r){return[2,i.NodeApi.executeAction("AddSolutionComponent",n,{ComponentId:e.webresourceid,ComponentType:61,SolutionUniqueName:t,AddRequiredComponents:!1,IncludedComponentSettingsValues:null})]}))}))},e.getWebresourcetype=function(t,n){return r(this,void 0,void 0,(function(){var r,u,s,a,c,l,d,f;return o(this,(function(o){switch(o.label){case 0:return[4,i.NodeApi.getPicklistOptionSet(e.logicalName,"webresourcetype",n)];case 1:for(r=o.sent(),a=0,c=r;a<c.length;a++)if(l=c[a],d=l.value,(f=l.label).toLocaleLowerCase().includes("script")&&(s=parseInt(String(d),10)),f.toLowerCase().includes(t)){u=parseInt(String(d),10);break}return u||"json"!==t||(u=s),[2,u]}}))}))},e.logicalName="webresource",e.entitySetName="webresourceset",e}();t.WebresourceService=u},function(e,t){e.exports=require("crypto")}]);