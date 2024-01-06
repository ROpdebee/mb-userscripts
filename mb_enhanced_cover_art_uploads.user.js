// ==UserScript==
// @name         MB: Enhanced Cover Art Uploads
// @description  Enhance the cover art uploader! Upload directly from a URL, automatically import covers from Discogs/Spotify/Apple Music/..., automatically retrieve the largest version, and more!
// @version      2024.1.6
// @author       ROpdebee
// @license      MIT; https://opensource.org/licenses/MIT
// @namespace    https://github.com/ROpdebee/mb-userscripts
// @homepageURL  https://github.com/ROpdebee/mb-userscripts
// @supportURL   https://github.com/ROpdebee/mb-userscripts/issues
// @downloadURL  https://raw.github.com/ROpdebee/mb-userscripts/dist/mb_enhanced_cover_art_uploads.user.js
// @updateURL    https://raw.github.com/ROpdebee/mb-userscripts/dist/mb_enhanced_cover_art_uploads.meta.js
// @match        *://*.musicbrainz.org/release/*/add-cover-art
// @match        *://*.musicbrainz.org/release/*/add-cover-art?*
// @match        *://*.musicbrainz.org/release/*/cover-art
// @match        *://atisket.pulsewidth.org.uk/*
// @match        *://etc.marlonob.info/atisket/*
// @match        *://vgmdb.net/album/*
// @exclude      *://atisket.pulsewidth.org.uk/
// @require      https://github.com/qsniyg/maxurl/blob/87bbca876f8d6ae9bdc4b4d3f85bbbc36b238d23/userscript.user.js?raw=true
// @resource     amazonFavicon https://www.amazon.com/favicon.ico
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        GM_getResourceURL
// @grant        GM.getResourceUrl
// @grant        GM.getResourceURL
// @connect      *
// ==/UserScript==

// For original source code, see https://github.com/ROpdebee/mb-userscripts/tree/main/src/mb_enhanced_cover_art_uploads
(function () {
  'use strict';

  /* minified: babel helpers, nativejsx, ts-custom-error, retry, is-network-error, p-retry, p-throttle */
  function _toPrimitive(t,r){if("object"!=typeof t||!t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var o=e.call(t,r||"default");if("object"!=typeof o)return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return ("string"===r?String:Number)(t)}function _toPropertyKey(t){var r=_toPrimitive(t,"string");return "symbol"==typeof r?r:String(r)}function _defineProperty(t,r,e){return (r=_toPropertyKey(r))in t?Object.defineProperty(t,r,{value:e,enumerable:!0,configurable:!0,writable:!0}):t[r]=e,t}function getDefaultExportFromCjs(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var appendChildren=function(t,r){(r=Array.isArray(r)?r:[r]).forEach((function(r){r instanceof HTMLElement?t.appendChild(r):(r||"string"==typeof r)&&t.appendChild(document.createTextNode(r.toString()));}));},appendChildren$1=getDefaultExportFromCjs(appendChildren),setAttributes=function(t,r){if("[object Object]"!==Object.prototype.toString.call(r)||"function"!=typeof r.constructor||"[object Object]"!==Object.prototype.toString.call(r.constructor.prototype)||!Object.prototype.hasOwnProperty.call(r.constructor.prototype,"isPrototypeOf"))throw new DOMException("Failed to execute 'setAttributes' on 'Element': "+Object.prototype.toString.call(r)+" is not a plain object.");for(const e in r)t.setAttribute(e,r[e]);};getDefaultExportFromCjs(setAttributes);var setStyles=function(t,r){for(const e in r)t.style[e]=r[e];},setStyles$1=getDefaultExportFromCjs(setStyles);function fixProto(t,r){var e=Object.setPrototypeOf;e?e(t,r):t.__proto__=r;}function fixStack(t,r){void 0===r&&(r=t.constructor);var e=Error.captureStackTrace;e&&e(t,r);}var __extends=function(){var t=function(r,e){return t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,r){t.__proto__=r;}||function(t,r){for(var e in r)Object.prototype.hasOwnProperty.call(r,e)&&(t[e]=r[e]);},t(r,e)};return function(r,e){if("function"!=typeof e&&null!==e)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");function o(){this.constructor=r;}t(r,e),r.prototype=null===e?Object.create(e):(o.prototype=e.prototype,new o);}}(),CustomError=function(t){function r(r,e){var o=this.constructor,i=t.call(this,r,e)||this;return Object.defineProperty(i,"name",{value:o.name,enumerable:!1,configurable:!0}),fixProto(i,o.prototype),fixStack(i),i}return __extends(r,t),r}(Error),retry$2={};function RetryOperation(t,r){"boolean"==typeof r&&(r={forever:r}),this._originalTimeouts=JSON.parse(JSON.stringify(t)),this._timeouts=t,this._options=r||{},this._maxRetryTime=r&&r.maxRetryTime||1/0,this._fn=null,this._errors=[],this._attempts=1,this._operationTimeout=null,this._operationTimeoutCb=null,this._timeout=null,this._operationStart=null,this._timer=null,this._options.forever&&(this._cachedTimeouts=this._timeouts.slice(0));}var retry_operation=RetryOperation;RetryOperation.prototype.reset=function(){this._attempts=1,this._timeouts=this._originalTimeouts.slice(0);},RetryOperation.prototype.stop=function(){this._timeout&&clearTimeout(this._timeout),this._timer&&clearTimeout(this._timer),this._timeouts=[],this._cachedTimeouts=null;},RetryOperation.prototype.retry=function(t){if(this._timeout&&clearTimeout(this._timeout),!t)return !1;var r=(new Date).getTime();if(t&&r-this._operationStart>=this._maxRetryTime)return this._errors.push(t),this._errors.unshift(new Error("RetryOperation timeout occurred")),!1;this._errors.push(t);var e=this._timeouts.shift();if(void 0===e){if(!this._cachedTimeouts)return !1;this._errors.splice(0,this._errors.length-1),e=this._cachedTimeouts.slice(-1);}var o=this;return this._timer=setTimeout((function(){o._attempts++,o._operationTimeoutCb&&(o._timeout=setTimeout((function(){o._operationTimeoutCb(o._attempts);}),o._operationTimeout),o._options.unref&&o._timeout.unref()),o._fn(o._attempts);}),e),this._options.unref&&this._timer.unref(),!0},RetryOperation.prototype.attempt=function(t,r){this._fn=t,r&&(r.timeout&&(this._operationTimeout=r.timeout),r.cb&&(this._operationTimeoutCb=r.cb));var e=this;this._operationTimeoutCb&&(this._timeout=setTimeout((function(){e._operationTimeoutCb();}),e._operationTimeout)),this._operationStart=(new Date).getTime(),this._fn(this._attempts);},RetryOperation.prototype.try=function(t){console.log("Using RetryOperation.try() is deprecated"),this.attempt(t);},RetryOperation.prototype.start=function(t){console.log("Using RetryOperation.start() is deprecated"),this.attempt(t);},RetryOperation.prototype.start=RetryOperation.prototype.try,RetryOperation.prototype.errors=function(){return this._errors},RetryOperation.prototype.attempts=function(){return this._attempts},RetryOperation.prototype.mainError=function(){if(0===this._errors.length)return null;for(var t={},r=null,e=0,o=0;o<this._errors.length;o++){var i=this._errors[o],n=i.message,s=(t[n]||0)+1;t[n]=s,s>=e&&(r=i,e=s);}return r},getDefaultExportFromCjs(retry_operation),function(t){var r=retry_operation;t.operation=function(e){var o=t.timeouts(e);return new r(o,{forever:e&&(e.forever||e.retries===1/0),unref:e&&e.unref,maxRetryTime:e&&e.maxRetryTime})},t.timeouts=function(t){if(t instanceof Array)return [].concat(t);var r={retries:10,factor:2,minTimeout:1e3,maxTimeout:1/0,randomize:!1};for(var e in t)r[e]=t[e];if(r.minTimeout>r.maxTimeout)throw new Error("minTimeout is greater than maxTimeout");for(var o=[],i=0;i<r.retries;i++)o.push(this.createTimeout(i,r));return t&&t.forever&&!o.length&&o.push(this.createTimeout(i,r)),o.sort((function(t,r){return t-r})),o},t.createTimeout=function(t,r){var e=r.randomize?Math.random()+1:1,o=Math.round(e*Math.max(r.minTimeout,1)*Math.pow(r.factor,t));return Math.min(o,r.maxTimeout)},t.wrap=function(r,e,o){if(e instanceof Array&&(o=e,e=null),!o)for(var i in o=[],r)"function"==typeof r[i]&&o.push(i);for(var n=0;n<o.length;n++){var s=o[n],a=r[s];r[s]=function(o){var i=t.operation(e),n=Array.prototype.slice.call(arguments,1),s=n.pop();n.push((function(t){i.retry(t)||(t&&(arguments[0]=i.mainError()),s.apply(this,arguments));})),i.attempt((function(){o.apply(r,n);}));}.bind(r,a),r[s].options=e;}};}(retry$2),getDefaultExportFromCjs(retry$2);var retry=retry$2,retry$1=getDefaultExportFromCjs(retry);const objectToString=Object.prototype.toString,isError=t=>"[object Error]"===objectToString.call(t),errorMessages=new Set(["Failed to fetch","NetworkError when attempting to fetch resource.","The Internet connection appears to be offline.","Load failed","Network request failed","fetch failed"]);function isNetworkError(t){return !(!t||!isError(t)||"TypeError"!==t.name||"string"!=typeof t.message)&&("Load failed"===t.message?void 0===t.stack:errorMessages.has(t.message))}let AbortError$1=class extends Error{constructor(t){super(),t instanceof Error?(this.originalError=t,({message:t}=t)):(this.originalError=new Error(t),this.originalError.stack=this.stack),this.name="AbortError",this.message=t;}};const decorateErrorWithCounts=(t,r,e)=>{const o=e.retries-(r-1);return t.attemptNumber=r,t.retriesLeft=o,t};async function pRetry(t,r){return new Promise(((e,o)=>{r={onFailedAttempt(){},retries:10,shouldRetry:()=>!0,...r};const i=retry$1.operation(r),n=()=>{var t;i.stop(),o(null===(t=r.signal)||void 0===t?void 0:t.reason);};r.signal&&!r.signal.aborted&&r.signal.addEventListener("abort",n,{once:!0});const s=()=>{var t;null===(t=r.signal)||void 0===t||t.removeEventListener("abort",n),i.stop();};i.attempt((async n=>{try{const r=await t(n);s(),e(r);}catch(a){try{if(!(a instanceof Error))throw new TypeError(`Non-error was thrown: "${a}". You should only throw errors.`);if(a instanceof AbortError$1)throw a.originalError;if(a instanceof TypeError&&!isNetworkError(a))throw a;if(decorateErrorWithCounts(a,n,r),await r.shouldRetry(a)||(i.stop(),o(a)),await r.onFailedAttempt(a),!i.retry(a))throw i.mainError()}catch(u){decorateErrorWithCounts(u,n,r),s(),o(u);}}}));}))}class AbortError extends Error{constructor(){super("Throttled function aborted"),this.name="AbortError";}}function pThrottle(t){let{limit:r,interval:e,strict:o,onDelay:i}=t;if(!Number.isFinite(r))throw new TypeError("Expected `limit` to be a finite number");if(!Number.isFinite(e))throw new TypeError("Expected `interval` to be a finite number");const n=new Map;let s=0,a=0;const u=[],p=o?function(){const t=Date.now();if(u.length>0&&t-u.at(-1)>e&&(u.length=0),u.length<r)return u.push(t),0;const o=u[0]+e;return u.shift(),u.push(o),Math.max(0,o-t)}:function(){const t=Date.now();return t-s>e?(a=1,s=t,0):(a<r?a++:(s+=e,a=1),s-t)};return t=>{const r=function(){for(var e=arguments.length,o=new Array(e),s=0;s<e;s++)o[s]=arguments[s];if(!r.isEnabled)return (async()=>t.apply(this,o))();let a;return new Promise(((r,e)=>{const s=()=>{r(t.apply(this,o)),n.delete(a);},u=p();u>0?(a=setTimeout(s,u),n.set(a,e),null==i||i()):s();}))};return r.abort=()=>{for(const t of n.keys())clearTimeout(t),n.get(t)(new AbortError);n.clear(),u.splice(0,u.length);},r.isEnabled=!0,Object.defineProperty(r,"queueSize",{get:()=>n.size}),r}}

  /* minified: lib */
  class ConsoleSink{constructor(e){_defineProperty(this,"scriptName",void 0),_defineProperty(this,"onSuccess",this.onInfo.bind(this)),this.scriptName=e;}formatMessage(e){return `[${this.scriptName}] ${e}`}onDebug(e){console.debug(this.formatMessage(e));}onLog(e){console.log(this.formatMessage(e));}onInfo(e){console.info(this.formatMessage(e));}onWarn(e,t){e=this.formatMessage(e),t?console.warn(e,t):console.warn(e);}onError(e,t){e=this.formatMessage(e),t?console.error(e,t):console.error(e);}}let LogLevel=function(e){return e[e.DEBUG=0]="DEBUG",e[e.LOG=1]="LOG",e[e.INFO=2]="INFO",e[e.SUCCESS=3]="SUCCESS",e[e.WARNING=4]="WARNING",e[e.ERROR=5]="ERROR",e}({});const HANDLER_NAMES={[LogLevel.DEBUG]:"onDebug",[LogLevel.LOG]:"onLog",[LogLevel.INFO]:"onInfo",[LogLevel.SUCCESS]:"onSuccess",[LogLevel.WARNING]:"onWarn",[LogLevel.ERROR]:"onError"},DEFAULT_OPTIONS={logLevel:LogLevel.INFO,sinks:[]};class Logger{constructor(e){_defineProperty(this,"_configuration",void 0),this._configuration={...DEFAULT_OPTIONS,...e};}fireHandlers(e,t,r){e<this._configuration.logLevel||this._configuration.sinks.forEach((s=>{const n=s[HANDLER_NAMES[e]];n&&(r?n.call(s,t,r):n.call(s,t));}));}debug(e){this.fireHandlers(LogLevel.DEBUG,e);}log(e){this.fireHandlers(LogLevel.LOG,e);}info(e){this.fireHandlers(LogLevel.INFO,e);}success(e){this.fireHandlers(LogLevel.SUCCESS,e);}warn(e,t){this.fireHandlers(LogLevel.WARNING,e,t);}error(e,t){this.fireHandlers(LogLevel.ERROR,e,t);}configure(e){Object.assign(this._configuration,e);}get configuration(){return this._configuration}addSink(e){this._configuration.sinks.push(e);}}const LOGGER=new Logger;var USERSCRIPT_ID="mb_enhanced_cover_art_uploads";function filterNonNull(e){return e.filter((e=>!(null==e)))}function groupBy(e,t,r){const s=new Map;for(const o of e){var n;const e=t(o),i=r(o);s.has(e)?null===(n=s.get(e))||void 0===n||n.push(i):s.set(e,[i]);}return s}function collatedSort(e){const t=new Intl.Collator("en",{numeric:!0});return e.sort(t.compare.bind(t))}function enumerate(e){return e.map(((e,t)=>[e,t]))}function isFactory(e){return "function"==typeof e}function insertBetween(e,t){return [...e.slice(0,1),...e.slice(1).flatMap((e=>[isFactory(t)?t():t,e]))]}class AssertionError extends Error{}function assert(e,t){if(!e)throw new AssertionError(t??"Assertion failed")}function assertDefined(e,t){assert(void 0!==e,t??"Assertion failed: Expected value to be defined");}function assertNonNull(e,t){assert(null!==e,t??"Assertion failed: Expected value to be non-null");}function assertHasValue(e,t){assert(null!=e,t??"Assertion failed: Expected value to be defined and non-null");}function qs(e,t){const r=qsMaybe(e,t);return assertNonNull(r,"Could not find required element"),r}function qsMaybe(e,t){return (t??document).querySelector(e)}function qsa(e,t){return [...(t??document).querySelectorAll(e)]}function onDocumentLoaded(e){"loading"!==document.readyState?e():document.addEventListener("DOMContentLoaded",e);}function parseDOM(e,t){const r=(new DOMParser).parseFromString(e,"text/html");if(!qsMaybe("base",r.head)){const e=r.createElement("base");e.href=t,r.head.insertAdjacentElement("beforeend",e);}return r}function insertStylesheet(e,t){if(void 0===t&&(t=`ROpdebee_${USERSCRIPT_ID}_css`),null!==qsMaybe(`style#${t}`))return;const r=function(){var r=document.createElement("style");return r.setAttribute("id",t),appendChildren$1(r,e),r}.call(this);document.head.insertAdjacentElement("beforeend",r);}var css_248z$1="#ROpdebee_log_container{margin:1.5rem auto;width:75%}#ROpdebee_log_container .msg{border:1px solid;border-radius:4px;display:block;font-weight:500;margin-bottom:.5rem;overflow-wrap:break-word;padding:.5rem .75rem;width:100%}#ROpdebee_log_container .msg.error{background-color:#f8d7da;border-color:#f5c6cb;color:#721c24;font-weight:600}#ROpdebee_log_container .msg.warning{background-color:#fff3cd;border-color:#ffeeba;color:#856404}#ROpdebee_log_container .msg.success{background-color:#d4edda;border-color:#c3e6cb;color:#155724}#ROpdebee_log_container .msg.info{background-color:#e2e3e5;border-color:#d6d8db;color:#383d41}";class GuiSink{constructor(){_defineProperty(this,"rootElement",void 0),_defineProperty(this,"persistentMessages",[]),_defineProperty(this,"transientMessages",[]),_defineProperty(this,"onInfo",this.onLog.bind(this)),insertStylesheet(css_248z$1,"ROpdebee_GUI_Logger"),this.rootElement=function(){var e=document.createElement("div");return e.setAttribute("id","ROpdebee_log_container"),setStyles$1(e,{display:"none"}),e}.call(this);}createMessage(e,t,r){const s=insertBetween((t+(r instanceof Error?`: ${r.message}`:"")).split(/(?=\/|\?|&|%)/),(()=>function(){return document.createElement("wbr")}.call(this)));return function(){var t=document.createElement("span");return t.setAttribute("class",`msg ${e}`),appendChildren$1(t,s),t}.call(this)}addMessage(e){this.removeTransientMessages(),this.rootElement.append(e),this.rootElement.style.display="block";}removeTransientMessages(){this.transientMessages.forEach((e=>{e.remove();})),this.transientMessages=[];}addPersistentMessage(e){this.addMessage(e),this.persistentMessages.push(e);}addTransientMessage(e){this.addMessage(e),this.transientMessages.push(e);}onLog(e){this.addTransientMessage(this.createMessage("info",e));}onSuccess(e){this.addTransientMessage(this.createMessage("success",e));}onWarn(e,t){this.addPersistentMessage(this.createMessage("warning",e,t));}onError(e,t){this.addPersistentMessage(this.createMessage("error",e,t));}clearAllLater(){this.transientMessages=[...this.transientMessages,...this.persistentMessages],this.persistentMessages=[];}}function existsInGM(e){return "undefined"!=typeof GM&&void 0!==GM[e]}function GMxmlHttpRequest(e){existsInGM("xmlHttpRequest")?GM.xmlHttpRequest(e):GM_xmlhttpRequest(e);}function GMgetResourceUrl(e){return existsInGM("getResourceUrl")?GM.getResourceUrl(e):existsInGM("getResourceURL")?GM.getResourceURL(e):Promise.resolve(GM_getResourceURL(e))}const GMinfo=existsInGM("info")?GM.info:GM_info;function cloneIntoPageContext(e){return "undefined"!=typeof cloneInto&&"undefined"!=typeof unsafeWindow?cloneInto(e,unsafeWindow):e}function getFromPageContext(e){return ("undefined"!=typeof unsafeWindow?unsafeWindow:window)[e]}const separator="\n–\n";class EditNote{constructor(e){_defineProperty(this,"footer",void 0),_defineProperty(this,"extraInfoLines",void 0),_defineProperty(this,"editNoteTextArea",void 0),this.footer=e,this.editNoteTextArea=qs("textarea.edit-note");const t=this.editNoteTextArea.value.split(separator)[0];this.extraInfoLines=new Set(t?t.split("\n").map((e=>e.trimEnd())):null);}addExtraInfo(e){if(this.extraInfoLines.has(e))return;let[t,...r]=this.editNoteTextArea.value.split(separator);t=(t+"\n"+e).trim(),this.editNoteTextArea.value=[t,...r].join(separator),this.extraInfoLines.add(e);}addFooter(){this.removePreviousFooter();const e=this.editNoteTextArea.value;this.editNoteTextArea.value=[e,separator,this.footer].join("");}removePreviousFooter(){const e=this.editNoteTextArea.value.split(separator).filter((e=>e.trim()!==this.footer));this.editNoteTextArea.value=e.join(separator);}static withFooterFromGMInfo(){const e=GMinfo.script,t=`${e.name} ${e.version}\n${e.namespace}`;return new EditNote(t)}}let _Symbol$iterator;_Symbol$iterator=Symbol.iterator;class ResponseHeadersImpl{constructor(e){_defineProperty(this,"map",void 0),_defineProperty(this,_Symbol$iterator,void 0),_defineProperty(this,"entries",void 0),_defineProperty(this,"keys",void 0),_defineProperty(this,"values",void 0);const t=groupBy(e?e.split("\r\n").filter(Boolean).map((e=>{const[t,...r]=e.split(":");return [t.toLowerCase().trim(),r.join(":").trim()]})):[],(e=>{let[t]=e;return t}),(e=>{let[,t]=e;return t}));this.map=new Map([...t.entries()].map((e=>{let[t,r]=e;return [t,r.join(",")]}))),this.entries=this.map.entries.bind(this.map),this.keys=this.map.keys.bind(this.map),this.values=this.map.values.bind(this.map),this[Symbol.iterator]=this.map[Symbol.iterator].bind(this.map);}get(e){return this.map.get(e.toLowerCase())??null}has(e){return this.map.has(e.toLowerCase())}forEach(e){this.map.forEach(((t,r)=>{e(t,r,this);}));}}function createTextResponse(e,t){return {...e,text:t,json(){return JSON.parse(this.text)}}}function convertFetchOptions(e,t){if(t)return {method:e,body:t.body,headers:t.headers}}async function createFetchResponse(e,t){const r=(null==e?void 0:e.responseType)??"text",s={headers:t.headers,url:t.url,status:t.status,statusText:t.statusText,rawResponse:t};switch(r){case"text":return createTextResponse(s,await t.text());case"blob":return {...s,blob:await t.blob()};case"arraybuffer":return {...s,arrayBuffer:await t.arrayBuffer()}}}async function performFetchRequest(e,t,r){return createFetchResponse(r,await fetch(new URL(t),convertFetchOptions(e,r)))}class ResponseError extends CustomError{constructor(e,t){super(t),_defineProperty(this,"url",void 0),this.url=e;}}class HTTPResponseError extends ResponseError{constructor(e,t,r){r?(super(e,r),_defineProperty(this,"statusCode",void 0),_defineProperty(this,"statusText",void 0),_defineProperty(this,"response",void 0)):t.statusText.trim()?(super(e,`HTTP error ${t.status}: ${t.statusText}`),_defineProperty(this,"statusCode",void 0),_defineProperty(this,"statusText",void 0),_defineProperty(this,"response",void 0)):(super(e,`HTTP error ${t.status}`),_defineProperty(this,"statusCode",void 0),_defineProperty(this,"statusText",void 0),_defineProperty(this,"response",void 0)),this.response=t,this.statusCode=t.status,this.statusText=t.statusText;}}class TimeoutError extends ResponseError{constructor(e){super(e,"Request timed out");}}class AbortedError extends ResponseError{constructor(e){super(e,"Request aborted");}}class NetworkError extends ResponseError{constructor(e){super(e,"Network error");}}function createGMXHRResponse(e,t){const r=(null==e?void 0:e.responseType)??"text",s={headers:new ResponseHeadersImpl(t.responseHeaders),url:t.finalUrl,status:t.status,statusText:t.statusText,rawResponse:t};switch(r){case"text":return createTextResponse(s,t.responseText);case"blob":return {...s,blob:t.response};case"arraybuffer":return {...s,arrayBuffer:t.response}}}function performGMXHRRequest(e,t,r){return new Promise(((s,n)=>{GMxmlHttpRequest({method:e,url:t instanceof URL?t.href:t,headers:null==r?void 0:r.headers,data:null==r?void 0:r.body,responseType:null==r?void 0:r.responseType,onload:e=>{s(createGMXHRResponse(r,e));},onerror:()=>{n(new NetworkError(t));},onabort:()=>{n(new AbortedError(t));},ontimeout:()=>{n(new TimeoutError(t));},onprogress:null==r?void 0:r.onProgress});}))}let RequestBackend=function(e){return e[e.FETCH=1]="FETCH",e[e.GMXHR=2]="GMXHR",e}({});const hasGMXHR="undefined"!=typeof GM_xmlHttpRequest||"undefined"!=typeof GM&&void 0!==GM.xmlHttpRequest,request=async function(e,t,r){const s=(null==r?void 0:r.backend)??(hasGMXHR?RequestBackend.GMXHR:RequestBackend.FETCH),n=await performRequest(s,e,t,r);var o;if(((null==r?void 0:r.throwForStatus)??1)&&n.status>=400)throw new HTTPResponseError(t,n,null==r||null===(o=r.httpErrorMessages)||void 0===o?void 0:o[n.status]);return n};function performRequest(e,t,r,s){switch(e){case RequestBackend.FETCH:return performFetchRequest(t,r,s);case RequestBackend.GMXHR:return performGMXHRRequest(t,r,s)}}async function getReleaseUrlARs(e){const t=await request.get(`https://musicbrainz.org/ws/2/release/${e}?inc=url-rels&fmt=json`);return (await t.json()).relations??[]}async function getURLsForRelease(e,t){const{excludeEnded:r,excludeDuplicates:s}=t??{};let n=await getReleaseUrlARs(e);r&&(n=n.filter((e=>!e.ended)));let o=n.map((e=>e.url.resource));return s&&(o=[...new Set(o)]),o.flatMap((e=>{try{return [new URL(e)]}catch{return console.warn(`Found malformed URL linked to release: ${e}`),[]}}))}async function getReleaseIDsForURL(e){var t;const r=await request.get(`https://musicbrainz.org/ws/2/url?resource=${encodeURIComponent(e)}&inc=release-rels&fmt=json`,{throwForStatus:!1});return (null===(t=(await r.json()).relations)||void 0===t?void 0:t.map((e=>e.release.id)))??[]}function asyncSleep(e){return new Promise((t=>setTimeout(t,e)))}function retryTimes(e,t,r){return t<=0?Promise.reject(new TypeError(`Invalid number of retry times: ${t}`)):async function t(s){try{return await e()}catch(n){if(s<=1)throw n;return asyncSleep(r).then((()=>t(s-1)))}}(t)}function logFailure(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"An error occurred";e.catch((e=>{LOGGER.error(t,e);}));}async function pFinally(e,t){try{return await e}finally{await t();}}request.get=request.bind(void 0,"GET"),request.post=request.bind(void 0,"POST"),request.head=request.bind(void 0,"HEAD");class ObservableSemaphore{constructor(e){let{onAcquired:t,onReleased:r}=e;_defineProperty(this,"onAcquired",void 0),_defineProperty(this,"onReleased",void 0),_defineProperty(this,"counter",0),this.onAcquired=t,this.onReleased=r;}acquire(){this.counter++,1===this.counter&&this.onAcquired();}release(){this.counter--,0===this.counter&&this.onReleased();}runInSection(e){let t;this.acquire();try{return t=e(),t}finally{t instanceof Promise?pFinally(t,this.release.bind(this)).catch((()=>{})):this.release();}}}let ArtworkTypeIDs=function(e){return e[e.Back=2]="Back",e[e.Booklet=3]="Booklet",e[e.Front=1]="Front",e[e.Liner=12]="Liner",e[e.Medium=4]="Medium",e[e.Obi=5]="Obi",e[e.Other=8]="Other",e[e.Poster=11]="Poster",e[e["Raw/Unedited"]=14]="Raw/Unedited",e[e.Spine=6]="Spine",e[e.Sticker=10]="Sticker",e[e.Track=7]="Track",e[e.Tray=9]="Tray",e[e.Watermark=13]="Watermark",e[e["Matrix/Runout"]=15]="Matrix/Runout",e[e.Top=48]="Top",e[e.Bottom=49]="Bottom",e}({});function hexEncode(e){return [...new(getFromPageContext("Uint8Array"))(e)].map((e=>e.toString(16).padStart(2,"0"))).join("")}async function blobToDigest(e){var t,r;const s=await blobToBuffer(e);return hexEncode(await((null===(t=crypto)||void 0===t||null===(t=t.subtle)||void 0===t||null===(r=t.digest)||void 0===r?void 0:r.call(t,"SHA-256",s))??s))}function blobToBuffer(e){return new Promise(((t,r)=>{const s=new FileReader;s.addEventListener("error",r),s.addEventListener("load",(()=>{t(s.result);})),s.readAsArrayBuffer(e);}))}function urlBasename(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"";return "string"!=typeof e&&(e=e.pathname),e.split("/").pop()||t}function urlJoin(e){let t=new URL(e);for(var r=arguments.length,s=new Array(r>1?r-1:0),n=1;n<r;n++)s[n-1]=arguments[n];for(const o of s)t=new URL(o,t);return t}function splitDomain(e){const t=e.split(".");let r=-2;return ["org","co","com"].includes(t[t.length-2])&&(r=-3),[...t.slice(0,r),t.slice(r).join(".")]}class DispatchMap{constructor(){_defineProperty(this,"map",new Map);}set(e,t){const r=splitDomain(e);if("*"===e||r[0].includes("*")&&"*"!==r[0]||r.slice(1).some((e=>e.includes("*"))))throw new Error("Invalid pattern: "+e);return this.insert([...r].reverse(),t),this}get(e){return this.retrieve([...splitDomain(e)].reverse())}_get(e){return this.map.get(e)}_set(e,t){return this.map.set(e,t),this}insertLeaf(e,t){const r=this._get(e);r?(assert(r instanceof DispatchMap&&!r.map.has(""),"Duplicate leaf!"),r._set("",t)):this._set(e,t);}insertInternal(e,t){const r=e[0],s=this._get(r);let n;s instanceof DispatchMap?n=s:(n=new DispatchMap,this._set(r,n),void 0!==s&&n._set("",s)),n.insert(e.slice(1),t);}insert(e,t){e.length>1?this.insertInternal(e,t):(assert(1===e.length,"Empty domain parts?!"),this.insertLeaf(e[0],t));}retrieveLeaf(e){let t=this._get(e);if(t instanceof DispatchMap){let e=t._get("");void 0===e&&(e=t._get("*")),t=e;}return t}retrieveInternal(e){const t=this._get(e[0]);if(t instanceof DispatchMap)return t.retrieve(e.slice(1))}retrieve(e){return (1===e.length?this.retrieveLeaf(e[0]):this.retrieveInternal(e))??this._get("*")}}function safeParseJSON(e,t){try{return JSON.parse(e)}catch(r){if(t)throw new Error(`${t}: ${r}`);return}}async function getItemMetadata(e){const t=safeParseJSON((await request.get(new URL(`https://archive.org/metadata/${e}`))).text,"Could not parse IA metadata");if(!t.server)throw new Error("Empty IA metadata, item might not exist");if(t.is_dark)throw new Error("Cannot access IA metadata: This item is darkened");return t}function memoize(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:e=>`${e[0]}`;const r=new Map;return function(){for(var s=arguments.length,n=new Array(s),o=0;o<s;o++)n[o]=arguments[o];const i=t(n);if(!r.has(i)){const t=e(...n);r.set(i,t);}return r.get(i)}}function createPersistentCheckbox(e,t,r){return [function(){var t=document.createElement("input");return t.setAttribute("type","checkbox"),t.setAttribute("id",e),t.addEventListener("change",(t=>{t.currentTarget.checked?localStorage.setItem(e,"delete_to_disable"):localStorage.removeItem(e),r(t);})),t.setAttribute("defaultChecked",!!localStorage.getItem(e)),t}.call(this),function(){var r=document.createElement("label");return r.setAttribute("for",e),appendChildren$1(r,t),r}.call(this)]}function formatFileSize(e){const t=0===e?0:Math.floor(Math.log(e)/Math.log(1024));return `${Number((e/Math.pow(1024,t)).toFixed(2))} ${["B","kB","MB","GB","TB"][t]}`}function parseVersion(e){return e.split(".").map((e=>parseInt(e)))}function versionLessThan(e,t){let r=0;for(;r<e.length&&r<t.length;){if(e[r]<t[r])return !0;if(e[r]>t[r])return !1;r++;}return e.length<t.length}var CHANGELOG_URL="https://github.com/ROpdebee/mb-userscripts/blob/dist/mb_enhanced_cover_art_uploads.changelog.md",USERSCRIPT_FEATURE_HISTORY=[{versionAdded:"2023.12.22",description:"add YouTube and YouTube Music provider"},{versionAdded:"2023.6.28",description:"add Traxsource provider"},{versionAdded:"2023.4.23.5",description:"rich copy-paste of webpage images and links"},{versionAdded:"2023.4.23.4",description:"add Monstercat provider"},{versionAdded:"2023.4.23.3",description:"add Booth.pm provider"},{versionAdded:"2023.4.23.2",description:"add Juno Download provider"},{versionAdded:"2023.4.23",description:"add NetEase/163.com provider"},{versionAdded:"2022.8.8",description:"add Bugs provider"},{versionAdded:"2022.8.5",description:"extract Soundcloud backdrop images"}],css_248z$2=".ROpdebee_feature_list{font-weight:300;margin:0 auto;width:-moz-fit-content;width:fit-content}.ROpdebee_feature_list ul{margin:6px 28px 0 0;text-align:left}";const LAST_DISPLAYED_KEY=`ROpdebee_${USERSCRIPT_ID}_last_notified_update`;function maybeDisplayNewFeatures(){const e=localStorage.getItem(LAST_DISPLAYED_KEY),t=GM.info.script;if(!e)return void localStorage.setItem(LAST_DISPLAYED_KEY,t.version);const r=parseVersion(e),s=USERSCRIPT_FEATURE_HISTORY.filter((e=>versionLessThan(r,parseVersion(e.versionAdded))));0!==s.length&&showFeatureNotification(t.name,t.version,s.map((e=>e.description)));}function showFeatureNotification(e,t,r){insertStylesheet(css_248z$2,"ROpdebee_Update_Banner");const s=function(){var n=document.createElement("div");n.setAttribute("class","banner warning-header");var o=document.createElement("p");n.appendChild(o),appendChildren$1(o,`${e} was updated to v${t}! `);var i=document.createElement("a");i.setAttribute("href",CHANGELOG_URL),o.appendChild(i);var a=document.createTextNode("See full changelog here");i.appendChild(a),appendChildren$1(o,". New features since last update:");var d=document.createElement("div");d.setAttribute("class","ROpdebee_feature_list"),n.appendChild(d);var c=document.createElement("ul");d.appendChild(c),appendChildren$1(c,r.map((e=>function(){var t=document.createElement("li");return appendChildren$1(t,e),t}.call(this))));var u=document.createElement("button");return u.setAttribute("class","dismiss-banner remove-item icon"),u.setAttribute("data-banner-name","alert"),u.setAttribute("type","button"),u.addEventListener("click",(()=>{s.remove(),localStorage.setItem(LAST_DISPLAYED_KEY,GM.info.script.version);})),n.appendChild(u),n}.call(this);qs("#page").insertAdjacentElement("beforebegin",s);}

  LOGGER.configure({
      logLevel: LogLevel.INFO,
  });
  LOGGER.addSink(new ConsoleSink(USERSCRIPT_ID));

  async function enqueueImage(image) {
    let defaultTypes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    let defaultComment = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    dropImage(image.content);
    await retryTimes(setImageParameters.bind(null, image.content.name, image.types ?? defaultTypes, (image.comment ?? defaultComment).trim()), 5, 500);
  }
  function dropImage(imageData) {
    const DataTransfer = getFromPageContext('DataTransfer');
    const dataTransfer = new DataTransfer();
    Object.defineProperty(dataTransfer, 'files', {
      value: cloneIntoPageContext([imageData])
    });
    const dropEvent = new DragEvent('drop', {
      dataTransfer
    });
    qs('#drop-zone').dispatchEvent(dropEvent);
  }
  function setImageParameters(imageName, imageTypes, imageComment) {
    const pendingUploadRows = qsa('tbody[data-bind="foreach: files_to_upload"] > tr');
    const fileRow = pendingUploadRows.find(row => qs('.file-info span[data-bind="text: name"]', row).textContent == imageName);
    assertDefined(fileRow, `Could not find image ${imageName} in queued uploads`);
    const checkboxesToCheck = qsa('ul.cover-art-type-checkboxes input[type="checkbox"]', fileRow).filter(cbox => imageTypes.includes(parseInt(cbox.value)));
    checkboxesToCheck.forEach(cbox => {
      cbox.checked = true;
      cbox.dispatchEvent(new Event('click'));
    });
    if (imageComment) {
      const commentInput = qs('div.comment > input.comment', fileRow);
      commentInput.value = imageComment;
      commentInput.dispatchEvent(new Event('change'));
    }
  }
  function fillEditNoteFragment(editNote, images, containerUrl) {
    const prefix = containerUrl ? ' * ' : '';
    if (containerUrl) {
      editNote.addExtraInfo(decodeURI(containerUrl.href));
    }
    for (const queuedUrl of images) {
      if (queuedUrl.maximisedUrl.protocol === 'data:') {
        editNote.addExtraInfo(prefix + 'Uploaded from data URL');
        continue;
      }
      editNote.addExtraInfo(prefix + decodeURI(queuedUrl.originalUrl.href));
      if (queuedUrl.wasMaximised) {
        editNote.addExtraInfo(' '.repeat(prefix.length) + '→ Maximised to ' + decodeURI(queuedUrl.maximisedUrl.href));
      }
      if (queuedUrl.wasRedirected) {
        editNote.addExtraInfo(' '.repeat(prefix.length) + '→ Redirected to ' + decodeURI(queuedUrl.fetchedUrl.href));
      }
    }
  }
  function fillEditNote(allFetchedImages, origin, editNote) {
    const totalNumImages = allFetchedImages.reduce((acc, fetched) => acc + fetched.images.length, 0);
    if (!totalNumImages) return;
    const maxFilled = 3;
    let numFilled = 0;
    for (const {
      containerUrl,
      images
    } of allFetchedImages) {
      const imagesToFill = images.slice(0, maxFilled - numFilled);
      fillEditNoteFragment(editNote, imagesToFill, containerUrl);
      numFilled += imagesToFill.length;
      if (numFilled >= maxFilled) break;
    }
    if (totalNumImages > maxFilled) {
      editNote.addExtraInfo(`…and ${totalNumImages - maxFilled} additional image(s)`);
    }
    if (origin) {
      editNote.addExtraInfo(`Seeded from ${origin}`);
    }
    editNote.addFooter();
  }

  class CoverArtProvider {
    constructor() {
      _defineProperty(this, "supportedDomains", void 0);
      _defineProperty(this, "name", void 0);
      _defineProperty(this, "urlRegex", void 0);
      _defineProperty(this, "allowButtons", true);
    }
    postprocessImage(image) {
      return Promise.resolve(image);
    }
    cleanUrl(url) {
      return url.host + url.pathname;
    }
    supportsUrl(url) {
      if (Array.isArray(this.urlRegex)) {
        return this.urlRegex.some(regex => regex.test(this.cleanUrl(url)));
      }
      return this.urlRegex.test(this.cleanUrl(url));
    }
    extractId(url) {
      if (!Array.isArray(this.urlRegex)) {
        var _this$cleanUrl$match;
        return (_this$cleanUrl$match = this.cleanUrl(url).match(this.urlRegex)) === null || _this$cleanUrl$match === void 0 ? void 0 : _this$cleanUrl$match[1];
      }
      return this.urlRegex.map(regex => {
        var _this$cleanUrl$match2;
        return (_this$cleanUrl$match2 = this.cleanUrl(url).match(regex)) === null || _this$cleanUrl$match2 === void 0 ? void 0 : _this$cleanUrl$match2[1];
      }).find(id => id !== undefined);
    }
    isSafeRedirect(originalUrl, redirectedUrl) {
      const id = this.extractId(originalUrl);
      return !!id && id === this.extractId(redirectedUrl);
    }
    async fetchPage(url, options) {
      const resp = await request.get(url, {
        httpErrorMessages: {
          404: `${this.name} release does not exist`,
          410: `${this.name} release does not exist`
        },
        ...options
      });
      if (resp.url === undefined) {
        LOGGER.warn(`Could not detect if ${url.href} caused a redirect`);
      } else if (resp.url !== url.href && !this.isSafeRedirect(url, new URL(resp.url))) {
        throw new Error(`Refusing to extract images from ${this.name} provider because the original URL redirected to ${resp.url}, which may be a different release. If this redirected URL is correct, please retry with ${resp.url} directly.`);
      }
      return resp.text;
    }
  }
  class HeadMetaPropertyProvider extends CoverArtProvider {
    is404Page(_document) {
      return false;
    }
    async findImages(url) {
      const respDocument = parseDOM(await this.fetchPage(url), url.href);
      if (this.is404Page(respDocument)) {
        throw new Error(`${this.name} release does not exist`);
      }
      const coverElmt = qs('head > meta[property="og:image"]', respDocument);
      return [{
        url: new URL(coverElmt.content, url),
        types: [ArtworkTypeIDs.Front]
      }];
    }
  }
  class ProviderWithTrackImages extends CoverArtProvider {
    groupIdenticalImages(images, getImageUniqueId, mainUniqueId) {
      const uniqueImages = images.filter(img => getImageUniqueId(img) !== mainUniqueId);
      return groupBy(uniqueImages, getImageUniqueId, img => img);
    }
    async urlToDigest(imageUrl) {
      const resp = await request.get(this.imageToThumbnailUrl(imageUrl), {
        responseType: 'blob'
      });
      return blobToDigest(resp.blob);
    }
    imageToThumbnailUrl(imageUrl) {
      return imageUrl;
    }
    async mergeTrackImages(parsedTrackImages, mainUrl, byContent) {
      const allTrackImages = filterNonNull(parsedTrackImages);
      const groupedImages = this.groupIdenticalImages(allTrackImages, img => img.url, mainUrl);
      if (byContent && groupedImages.size > 0 && !(groupedImages.size === 1 && !mainUrl)) {
        LOGGER.info('Deduplicating track images by content, this may take a while…');
        const mainDigest = mainUrl ? await this.urlToDigest(mainUrl) : '';
        let numProcessed = 0;
        const tracksWithDigest = await Promise.all([...groupedImages.entries()].map(async _ref => {
          let [coverUrl, trackImages] = _ref;
          const digest = await this.urlToDigest(coverUrl);
          numProcessed++;
          LOGGER.info(`Deduplicating track images by content, this may take a while… (${numProcessed}/${groupedImages.size})`);
          return trackImages.map(trackImage => {
            return {
              ...trackImage,
              digest
            };
          });
        }));
        const groupedThumbnails = this.groupIdenticalImages(tracksWithDigest.flat(), trackWithDigest => trackWithDigest.digest, mainDigest);
        groupedImages.clear();
        for (const trackImages of groupedThumbnails.values()) {
          const representativeUrl = trackImages[0].url;
          groupedImages.set(representativeUrl, trackImages);
        }
      }
      const results = [];
      groupedImages.forEach((trackImages, imgUrl) => {
        results.push({
          url: new URL(imgUrl),
          types: [ArtworkTypeIDs.Track],
          comment: this.createTrackImageComment(trackImages) || undefined
        });
      });
      return results;
    }
    createTrackImageComment(tracks) {
      const definedTrackNumbers = tracks.filter(track => Boolean(track.trackNumber));
      if (definedTrackNumbers.length === 0) return '';
      const commentBins = groupBy(definedTrackNumbers, track => {
        var _track$customCommentP;
        return ((_track$customCommentP = track.customCommentPrefix) === null || _track$customCommentP === void 0 ? void 0 : _track$customCommentP[0]) ?? 'Track';
      }, track => track);
      const commentChunks = [...commentBins.values()].map(bin => {
        const prefixes = bin[0].customCommentPrefix ?? ['Track', 'Tracks'];
        const prefix = prefixes[bin.length === 1 ? 0 : 1];
        const trackNumbers = bin.map(track => track.trackNumber);
        return `${prefix} ${collatedSort(trackNumbers).join(', ')}`;
      });
      return commentChunks.join('; ');
    }
  }

  const QUERY_SHA256 = 'cd0fe8a7199e97a9027f676838dd25bf88346435f7096fddd79b055d68ea98c8';
  class DiscogsProvider extends CoverArtProvider {
    constructor() {
      super(...arguments);
      _defineProperty(this, "supportedDomains", ['discogs.com']);
      _defineProperty(this, "favicon", 'https://catalog-assets.discogs.com/e95f0cd9.png');
      _defineProperty(this, "name", 'Discogs');
      _defineProperty(this, "urlRegex", /\/release\/(\d+)/);
    }
    async findImages(url) {
      const releaseId = this.extractId(url);
      assertHasValue(releaseId);
      const data = await DiscogsProvider.getReleaseImages(releaseId);
      return data.data.release.images.edges.map(edge => {
        return {
          url: new URL(edge.node.fullsize.sourceUrl)
        };
      });
    }
    static getReleaseImages(releaseId) {
      let respProm = this.apiResponseCache.get(releaseId);
      if (respProm === undefined) {
        respProm = this.actuallyGetReleaseImages(releaseId);
        this.apiResponseCache.set(releaseId, respProm);
      }
      respProm.catch(() => {
        if (this.apiResponseCache.get(releaseId) === respProm) {
          this.apiResponseCache.delete(releaseId);
        }
      });
      return respProm;
    }
    static async actuallyGetReleaseImages(releaseId) {
      const graphqlParams = new URLSearchParams({
        operationName: 'ReleaseAllImages',
        variables: JSON.stringify({
          discogsId: parseInt(releaseId),
          count: 500
        }),
        extensions: JSON.stringify({
          persistedQuery: {
            version: 1,
            sha256Hash: QUERY_SHA256
          }
        })
      });
      const resp = await request.get(`https://www.discogs.com/internal/release-page/api/graphql?${graphqlParams}`);
      const metadata = safeParseJSON(resp.text, 'Invalid response from Discogs API');
      assertHasValue(metadata.data.release, 'Discogs release does not exist');
      const responseId = metadata.data.release.discogsId.toString();
      assert(responseId === undefined || responseId === releaseId, `Discogs returned wrong release: Requested ${releaseId}, got ${responseId}`);
      return metadata;
    }
    static getFilenameFromUrl(url) {
      const urlParts = url.pathname.split('/');
      const firstFilenameIdx = urlParts.slice(2).findIndex(urlPart => !/^\w+:/.test(urlPart)) + 2;
      const s3Url = urlParts.slice(firstFilenameIdx).join('');
      const s3UrlDecoded = atob(s3Url.slice(0, s3Url.indexOf('.')));
      return s3UrlDecoded.split('/').pop();
    }
    static async maximiseImage(url) {
      var _imageName$match;
      const imageName = this.getFilenameFromUrl(url);
      const releaseId = (_imageName$match = imageName.match(/^R-(\d+)/)) === null || _imageName$match === void 0 ? void 0 : _imageName$match[1];
      if (!releaseId) return url;
      const releaseData = await this.getReleaseImages(releaseId);
      const matchedImage = releaseData.data.release.images.edges.find(img => this.getFilenameFromUrl(new URL(img.node.fullsize.sourceUrl)) === imageName);
      if (!matchedImage) return url;
      return new URL(matchedImage.node.fullsize.sourceUrl);
    }
  }
  _defineProperty(DiscogsProvider, "apiResponseCache", new Map());

  function maxurl(url, options) {
    return retryTimes(() => {
      $$IMU_EXPORT$$(url, options);
    }, 100, 500);
  }
  const options = {
    fill_object: true,
    exclude_videos: true,
    filter(url) {
      return !url.toLowerCase().endsWith('.webp') && !/:format(webp)/.test(url.toLowerCase());
    }
  };
  const IMU_EXCEPTIONS = new DispatchMap();
  async function* getMaximisedCandidates(smallurl) {
    const exceptionFn = IMU_EXCEPTIONS.get(smallurl.hostname);
    const iterable = await (exceptionFn ?? maximiseGeneric)(smallurl);
    yield* iterable;
  }
  async function* maximiseGeneric(smallurl) {
    const results = await new Promise(resolve => {
      maxurl(smallurl.href, {
        ...options,
        cb: resolve
      }).catch(err => {
        LOGGER.error('Could not maximise image, maxurl unavailable?', err);
        resolve([]);
      });
    });
    for (const maximisedResult of results) {
      if (maximisedResult.fake || maximisedResult.bad || maximisedResult.video) continue;
      try {
        yield {
          ...maximisedResult,
          url: new URL(maximisedResult.url)
        };
      } catch {}
    }
  }
  IMU_EXCEPTIONS.set('i.discogs.com', async smallurl => {
    const fullSizeURL = await DiscogsProvider.maximiseImage(smallurl);
    return [{
      url: fullSizeURL,
      filename: DiscogsProvider.getFilenameFromUrl(smallurl),
      headers: {}
    }];
  });
  IMU_EXCEPTIONS.set('*.mzstatic.com', async smallurl => {
    var _smallurl$href$match;
    const results = [];
    const smallOriginalName = (_smallurl$href$match = smallurl.href.match(/(?:[a-f\d]{2}\/){3}[a-f\d-]{36}\/([^/]+)/)) === null || _smallurl$href$match === void 0 ? void 0 : _smallurl$href$match[1];
    for await (const imgGeneric of maximiseGeneric(smallurl)) {
      if (urlBasename(imgGeneric.url) === 'source' && smallOriginalName !== 'source') {
        imgGeneric.likely_broken = true;
      }
      results.push(imgGeneric);
    }
    return results;
  });
  IMU_EXCEPTIONS.set('usercontent.jamendo.com', async smallurl => {
    return [{
      url: new URL(smallurl.href.replace(/([&?])width=\d+/, '$1width=0')),
      filename: '',
      headers: {}
    }];
  });
  IMU_EXCEPTIONS.set('hw-img.datpiff.com', async smallurl => {
    const urlNoSuffix = smallurl.href.replace(/-(?:large|medium)(\.\w+$)/, '$1');
    return ['-large', '-medium', ''].map(suffix => {
      return {
        url: new URL(urlNoSuffix.replace(/\.(\w+)$/, `${suffix}.$1`)),
        filename: '',
        headers: {}
      };
    });
  });

  class SevenDigitalProvider extends HeadMetaPropertyProvider {
    constructor() {
      super(...arguments);
      _defineProperty(this, "supportedDomains", ['*.7digital.com']);
      _defineProperty(this, "favicon", 'https://css-cdn.7digital.com/static/build/images/favicons/7digital/touch-ipad-retina.png');
      _defineProperty(this, "name", '7digital');
      _defineProperty(this, "urlRegex", /release\/.*-(\d+)(?:\/|$)/);
    }
    async postprocessImage(image) {
      if (/\/0{8}16_\d+/.test(image.fetchedUrl.pathname)) {
        LOGGER.warn(`Skipping "${image.fetchedUrl}" as it matches a placeholder cover`);
        return null;
      }
      return image;
    }
  }

  class AllMusicProvider extends CoverArtProvider {
    constructor() {
      super(...arguments);
      _defineProperty(this, "supportedDomains", ['allmusic.com']);
      _defineProperty(this, "favicon", 'https://cdn-gce.allmusic.com/images/favicon/favicon-32x32.png');
      _defineProperty(this, "name", 'AllMusic');
      _defineProperty(this, "urlRegex", /album\/release\/.*(mr\d+)(?:\/|$)/);
    }
    async findImages(url) {
      var _page$match;
      const page = await this.fetchPage(url);
      const galleryJson = (_page$match = page.match(/var imageGallery = (.+);$/m)) === null || _page$match === void 0 ? void 0 : _page$match[1];
      if (!galleryJson) {
        throw new Error('Failed to extract AllMusic images from embedded JS');
      }
      const gallery = safeParseJSON(galleryJson);
      if (!gallery) {
        throw new Error('Failed to parse AllMusic JSON gallery data');
      }
      return gallery.map(image => {
        return {
          url: new URL(image.url.replace(/&f=\d+$/, '&f=0'))
        };
      });
    }
  }

  const PLACEHOLDER_IMG_NAMES = ['01RmK+J4pJL', '01QFb8SNuTL', '01PkLIhTX3L', '01MKUOLsA5L', '31CTP6oiIBL'];
  const VARIANT_TYPE_MAPPING = {
    MAIN: ArtworkTypeIDs.Front,
    FRNT: ArtworkTypeIDs.Front,
    BACK: ArtworkTypeIDs.Back,
    SIDE: ArtworkTypeIDs.Spine
  };
  const AUDIBLE_PAGE_QUERY = '#audibleProductTitle';
  const MUSIC_DIGITAL_PAGE_QUERY = '#nav-global-location-data-modal-action[data-a-modal*="dmusicRetailMp3Player"]';
  const AUDIBLE_FRONT_IMAGE_QUERY = '#audibleimageblock_feature_div #main-image';
  class AmazonProvider extends CoverArtProvider {
    constructor() {
      super(...arguments);
      _defineProperty(this, "supportedDomains", ['amazon.ae', 'amazon.ca', 'amazon.cn', 'amazon.de', 'amazon.eg', 'amazon.es', 'amazon.fr', 'amazon.in', 'amazon.it', 'amazon.jp', 'amazon.nl', 'amazon.pl', 'amazon.sa', 'amazon.se', 'amazon.sg', 'amazon.co.jp', 'amazon.co.uk', 'amazon.com', 'amazon.com.au', 'amazon.com.br', 'amazon.com.mx', 'amazon.com.tr']);
      _defineProperty(this, "name", 'Amazon');
      _defineProperty(this, "urlRegex", /\/(?:gp\/product|dp|hz\/audible\/mlp\/mfpdp)\/([A-Za-z\d]{10})(?:\/|$)/);
    }
    get favicon() {
      return GMgetResourceUrl('amazonFavicon');
    }
    async findImages(url) {
      const pageContent = await this.fetchPage(url);
      const pageDom = parseDOM(pageContent, url.href);
      if (qsMaybe('form[action="/errors/validateCaptcha"]', pageDom) !== null) {
        throw new Error('Amazon served a captcha page');
      }
      let finder;
      if (qsMaybe(AUDIBLE_PAGE_QUERY, pageDom)) {
        LOGGER.debug('Searching for images in Audible page');
        finder = this.findAudibleImages;
      } else if (qsMaybe(MUSIC_DIGITAL_PAGE_QUERY, pageDom)) {
        throw new Error('Amazon Music releases are currently not supported. Please use a different provider or copy the image URL manually.');
      } else {
        LOGGER.debug('Searching for images in generic physical page');
        finder = this.findGenericPhysicalImages;
      }
      const covers = await finder.bind(this)(url, pageContent, pageDom);
      return covers.filter(img => !PLACEHOLDER_IMG_NAMES.some(name => decodeURIComponent(img.url.pathname).includes(name)));
    }
    async findGenericPhysicalImages(_url, pageContent) {
      const imgs = this.extractEmbeddedJSImages(pageContent, /\s*'colorImages': { 'initial': (.+)},$/m);
      assertNonNull(imgs, 'Failed to extract images from embedded JS on generic physical page');
      return imgs.map(img => {
        return this.convertVariant({
          url: img.hiRes ?? img.large,
          variant: img.variant
        });
      });
    }
    async findAudibleImages(_url, _pageContent, pageDom) {
      return this.extractFrontCover(pageDom, AUDIBLE_FRONT_IMAGE_QUERY);
    }
    extractFrontCover(pageDom, selector) {
      const productImage = qsMaybe(selector, pageDom);
      assertNonNull(productImage, 'Could not find front image on Amazon page');
      return [{
        url: new URL(productImage.src),
        types: [ArtworkTypeIDs.Front]
      }];
    }
    extractEmbeddedJSImages(pageContent, jsonRegex) {
      var _pageContent$match;
      const embeddedImages = (_pageContent$match = pageContent.match(jsonRegex)) === null || _pageContent$match === void 0 ? void 0 : _pageContent$match[1];
      if (!embeddedImages) {
        LOGGER.debug('Could not extract embedded JS images, regex did not match');
        return null;
      }
      const imgs = safeParseJSON(embeddedImages);
      if (!Array.isArray(imgs)) {
        LOGGER.debug(`Could not parse embedded JS images, not array, got ${imgs}`);
        return null;
      }
      return imgs;
    }
    convertVariant(cover) {
      const url = new URL(cover.url);
      const type = cover.variant && VARIANT_TYPE_MAPPING[cover.variant];
      LOGGER.debug(`${url.href} has the Amazon image variant code '${cover.variant}'`);
      if (type) {
        return {
          url,
          types: [type]
        };
      }
      return {
        url
      };
    }
  }

  class AmazonMusicProvider extends CoverArtProvider {
    constructor() {
      super(...arguments);
      _defineProperty(this, "supportedDomains", ['music.amazon.ca', 'music.amazon.de', 'music.amazon.es', 'music.amazon.fr', 'music.amazon.in', 'music.amazon.it', 'music.amazon.co.jp', 'music.amazon.co.uk', 'music.amazon.com', 'music.amazon.com.au', 'music.amazon.com.br', 'music.amazon.com.mx']);
      _defineProperty(this, "favicon", 'https://d5fx445wy2wpk.cloudfront.net/icons/amznMusic_favicon.png');
      _defineProperty(this, "name", 'Amazon Music');
      _defineProperty(this, "urlRegex", /\/albums\/([A-Za-z\d]{10})(?:\/|$)/);
    }
    async findImages() {
      throw new Error('Amazon Music releases are currently not supported. Please use a different provider or copy the image URL manually.');
    }
  }

  class AppleMusicProvider extends HeadMetaPropertyProvider {
    constructor() {
      super(...arguments);
      _defineProperty(this, "supportedDomains", ['music.apple.com', 'itunes.apple.com']);
      _defineProperty(this, "favicon", 'https://music.apple.com/favicon.ico');
      _defineProperty(this, "name", 'Apple Music');
      _defineProperty(this, "urlRegex", /\w{2}\/album\/(?:.+\/)?(?:id)?(\d+)/);
    }
    is404Page(doc) {
      return qsMaybe('head > title', doc) === null;
    }
  }

  class ArchiveProvider extends CoverArtProvider {
    constructor() {
      super(...arguments);
      _defineProperty(this, "supportedDomains", ['archive.org']);
      _defineProperty(this, "favicon", 'https://archive.org/images/glogo.jpg');
      _defineProperty(this, "name", 'Archive.org');
      _defineProperty(this, "urlRegex", /(?:details|metadata|download)\/([^/?#]+)/);
    }
    async findImages(url) {
      const itemId = this.extractId(url);
      assertDefined(itemId);
      const itemMetadata = await getItemMetadata(itemId);
      const baseDownloadUrl = this.createBaseDownloadUrl(itemMetadata);
      if (ArchiveProvider.CAA_ITEM_REGEX.test(itemId)) {
        try {
          return await this.extractCAAImages(itemId, baseDownloadUrl);
        } catch {
          LOGGER.warn('Failed to extract CAA images, falling back on generic IA extraction');
        }
      }
      return this.extractGenericImages(itemMetadata, baseDownloadUrl);
    }
    async findImagesCAA(itemId) {
      const itemMetadata = await getItemMetadata(itemId);
      const baseDownloadUrl = this.createBaseDownloadUrl(itemMetadata);
      return this.extractCAAImages(itemId, baseDownloadUrl);
    }
    async extractCAAImages(itemId, baseDownloadUrl) {
      const caaIndexUrl = `https://archive.org/download/${itemId}/index.json`;
      const caaIndexResp = await request.get(caaIndexUrl);
      const caaIndex = safeParseJSON(caaIndexResp.text, 'Could not parse index.json');
      return caaIndex.images.map(img => {
        const imageFileName = urlBasename(img.image);
        return {
          url: urlJoin(baseDownloadUrl, `${itemId}-${imageFileName}`),
          comment: img.comment,
          types: img.types.map(type => ArtworkTypeIDs[type])
        };
      });
    }
    extractGenericImages(itemMetadata, baseDownloadUrl) {
      const originalImagePaths = itemMetadata.files.filter(file => file.source === 'original' && ArchiveProvider.IMAGE_FILE_FORMATS.includes(file.format)).map(file => encodeURIComponent(file.name).replaceAll('%2F', '/'));
      return originalImagePaths.map(path => {
        return {
          url: urlJoin(baseDownloadUrl, path)
        };
      });
    }
    createBaseDownloadUrl(itemMetadata) {
      return urlJoin(`https://${itemMetadata.server}`, `${itemMetadata.dir}/`);
    }
  }
  _defineProperty(ArchiveProvider, "CAA_ITEM_REGEX", /^mbid-[a-f\d-]+$/);
  _defineProperty(ArchiveProvider, "IMAGE_FILE_FORMATS", ['JPEG', 'PNG', 'Text PDF', 'Animated GIF']);

  class AudiomackProvider extends HeadMetaPropertyProvider {
    constructor() {
      super(...arguments);
      _defineProperty(this, "supportedDomains", ['audiomack.com']);
      _defineProperty(this, "name", 'Audiomack');
      _defineProperty(this, "favicon", 'https://audiomack.com/static/favicon-32x32.png');
      _defineProperty(this, "urlRegex", /\.com\/([^/]+\/(?:song|album)\/[^/?#]+)/);
    }
  }

  function _getImageDimensions(url) {
    LOGGER.info(`Getting image dimensions for ${url}`);
    return new Promise((resolve, reject) => {
      let done = false;
      function dimensionsLoaded(dimensions) {
        clearInterval(interval);
        if (!done) {
          resolve(dimensions);
          done = true;
          img.src = '';
        }
      }
      function dimensionsFailed(evt) {
        clearInterval(interval);
        if (!done) {
          done = true;
          reject(new Error(evt.message ?? 'Image failed to load for unknown reason'));
        }
      }
      const img = document.createElement('img');
      img.addEventListener('load', () => {
        dimensionsLoaded({
          height: img.naturalHeight,
          width: img.naturalWidth
        });
      });
      img.addEventListener('error', dimensionsFailed);
      const interval = window.setInterval(() => {
        if (img.naturalHeight) {
          dimensionsLoaded({
            height: img.naturalHeight,
            width: img.naturalWidth
          });
        }
      }, 50);
      img.src = url;
    });
  }
  const getImageDimensions = memoize(url => pRetry(() => _getImageDimensions(url), {
    retries: 5,
    onFailedAttempt: err => {
      LOGGER.warn(`Failed to retrieve image dimensions: ${err.message}. Retrying…`);
    }
  }));

  class BandcampProvider extends ProviderWithTrackImages {
    constructor() {
      super(...arguments);
      _defineProperty(this, "supportedDomains", ['*.bandcamp.com']);
      _defineProperty(this, "favicon", 'https://s4.bcbits.com/img/favicon/favicon-32x32.png');
      _defineProperty(this, "name", 'Bandcamp');
      _defineProperty(this, "urlRegex", /^(.+)\.bandcamp\.com\/(track|album)\/([^/]+)(?:\/|$)/);
    }
    extractId(url) {
      var _this$cleanUrl$match;
      return (_this$cleanUrl$match = this.cleanUrl(url).match(this.urlRegex)) === null || _this$cleanUrl$match === void 0 || (_this$cleanUrl$match = _this$cleanUrl$match.slice(1)) === null || _this$cleanUrl$match === void 0 ? void 0 : _this$cleanUrl$match.join('/');
    }
    async findImages(url) {
      let onlyFront = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      const respDocument = parseDOM(await this.fetchPage(url), url.href);
      const albumCoverUrl = this.extractCover(respDocument);
      const covers = [];
      if (albumCoverUrl) {
        covers.push({
          url: new URL(albumCoverUrl),
          types: [ArtworkTypeIDs.Front]
        });
      } else {
        LOGGER.warn('Bandcamp release has no cover');
      }
      const trackImages = onlyFront ? [] : await this.findTrackImages(respDocument, albumCoverUrl);
      return this.amendSquareThumbnails([...covers, ...trackImages]);
    }
    extractCover(doc) {
      if (qsMaybe('#missing-tralbum-art', doc) !== null) {
        return;
      }
      return qs('#tralbumArt > .popupImage', doc).href;
    }
    async findTrackImages(doc, mainUrl) {
      const trackRows = qsa('#track_table .track_row_view', doc);
      if (trackRows.length === 0) return [];
      LOGGER.info('Checking for Bandcamp track images, this may take a few seconds…');
      const throttledFetchPage = pThrottle({
        interval: 1000,
        limit: 5
      })(this.fetchPage.bind(this));
      let numProcessed = 0;
      const trackImages = await Promise.all(trackRows.map(async trackRow => {
        const trackImage = await this.findTrackImage(trackRow, throttledFetchPage);
        numProcessed++;
        LOGGER.info(`Checking for Bandcamp track images, this may take a few seconds… (${numProcessed}/${trackRows.length})`);
        return trackImage;
      }));
      const mergedTrackImages = await this.mergeTrackImages(trackImages, mainUrl, true);
      if (mergedTrackImages.length > 0) {
        LOGGER.info(`Found ${mergedTrackImages.length} unique track images`);
      } else {
        LOGGER.info('Found no unique track images this time');
      }
      return mergedTrackImages;
    }
    async findTrackImage(trackRow, fetchPage) {
      var _trackRow$getAttribut, _qsMaybe;
      const trackNum = (_trackRow$getAttribut = trackRow.getAttribute('rel')) === null || _trackRow$getAttribut === void 0 || (_trackRow$getAttribut = _trackRow$getAttribut.match(/tracknum=(\w+)/)) === null || _trackRow$getAttribut === void 0 ? void 0 : _trackRow$getAttribut[1];
      const trackUrl = (_qsMaybe = qsMaybe('.title > a', trackRow)) === null || _qsMaybe === void 0 ? void 0 : _qsMaybe.href;
      if (!trackUrl) {
        LOGGER.warn(`Could not check track ${trackNum} for track images`);
        return;
      }
      try {
        const trackPage = parseDOM(await fetchPage(new URL(trackUrl)), trackUrl);
        const imageUrl = this.extractCover(trackPage);
        if (!imageUrl) {
          return;
        }
        return {
          url: imageUrl,
          trackNumber: trackNum
        };
      } catch (err) {
        LOGGER.error(`Could not check track ${trackNum} for track images`, err);
        return;
      }
    }
    async amendSquareThumbnails(covers) {
      return Promise.all(covers.map(async cover => {
        let coverDims;
        try {
          coverDims = await getImageDimensions(cover.url.href.replace(/_\d+\.(\w+)$/, '_0.$1'));
        } catch (err) {
          LOGGER.warn(`Could not retrieve image dimensions for ${cover.url}, square thumbnail will not be added`, err);
          return [cover];
        }
        if (!coverDims.width || !coverDims.height) {
          return [cover];
        }
        const ratio = coverDims.width / coverDims.height;
        if (0.95 <= ratio && ratio <= 1.05) {
          return [cover];
        }
        return [{
          ...cover,
          comment: filterNonNull([cover.comment, 'Bandcamp full-sized cover']).join(' - ')
        }, {
          types: cover.types,
          url: new URL(cover.url.href.replace(/_\d+\.(\w+)$/, '_16.$1')),
          comment: filterNonNull([cover.comment, 'Bandcamp square crop']).join(' - '),
          skipMaximisation: true
        }];
      })).then(nestedCovers => nestedCovers.flat());
    }
    imageToThumbnailUrl(imageUrl) {
      return imageUrl.replace(/_\d+\.(\w+)$/, '_7.$1');
    }
  }

  class BeatportProvider extends CoverArtProvider {
    constructor() {
      super(...arguments);
      _defineProperty(this, "supportedDomains", ['beatport.com']);
      _defineProperty(this, "favicon", 'https://geo-pro.beatport.com/static/ea225b5168059ba412818496089481eb.png');
      _defineProperty(this, "name", 'Beatport');
      _defineProperty(this, "urlRegex", /release\/[^/]+\/(\d+)(?:\/|$)/);
    }
    async findImages(url) {
      const respDocument = parseDOM(await this.fetchPage(url), url.href);
      const releaseDataText = qs('script#__NEXT_DATA__', respDocument).textContent;
      const releaseData = safeParseJSON(releaseDataText, 'Failed to parse Beatport release data');
      const cover = releaseData.props.pageProps.release.image;
      return [{
        url: new URL(cover.uri),
        types: [ArtworkTypeIDs.Front]
      }];
    }
  }

  class BoothProvider extends CoverArtProvider {
    constructor() {
      super(...arguments);
      _defineProperty(this, "supportedDomains", ['*.booth.pm']);
      _defineProperty(this, "favicon", 'https://booth.pm/static-images/pwa/icon_size_96.png');
      _defineProperty(this, "name", 'Booth');
      _defineProperty(this, "urlRegex", /items\/(\d+)/);
    }
    async findImages(url) {
      const itemId = this.extractId(url);
      assertDefined(itemId);
      const apiJson = await this.fetchPage(this.createApiUrl(itemId));
      const apiData = safeParseJSON(apiJson, 'Failed to parse Booth API response');
      const covers = apiData.images.map(img => ({
        url: new URL(img.original)
      }));
      if (covers.length > 0) {
        covers[0].types = [ArtworkTypeIDs.Front];
      }
      return covers;
    }
    createApiUrl(itemId) {
      return new URL(`https://booth.pm/en/items/${itemId}.json`);
    }
  }

  class BugsProvider extends HeadMetaPropertyProvider {
    constructor() {
      super(...arguments);
      _defineProperty(this, "supportedDomains", ['music.bugs.co.kr']);
      _defineProperty(this, "favicon", 'https://file.bugsm.co.kr/wbugs/common/faviconBugs.ico');
      _defineProperty(this, "name", 'Bugs!');
      _defineProperty(this, "urlRegex", /album\/(\d+)/);
    }
    isSafeRedirect(originalUrl, redirectedUrl) {
      return redirectedUrl.pathname === '/noMusic' || super.isSafeRedirect(originalUrl, redirectedUrl);
    }
    is404Page(doc) {
      return qsMaybe('.pgNoMusic', doc) !== null;
    }
  }

  class DatPiffProvider extends CoverArtProvider {
    constructor() {
      super(...arguments);
      _defineProperty(this, "supportedDomains", ['datpiff.com']);
      _defineProperty(this, "favicon", 'http://hw-static.datpiff.com/favicon.ico');
      _defineProperty(this, "name", 'DatPiff');
      _defineProperty(this, "urlRegex", /mixtape\.(\d+)\.html/i);
    }
    async findImages(url) {
      const respDocument = parseDOM(await this.fetchPage(url), url.href);
      if (respDocument.title === 'Mixtape Not Found') {
        throw new Error(this.name + ' release does not exist');
      }
      const coverCont = qs('.tapeBG', respDocument);
      const frontCoverUrl = coverCont.dataset.front;
      const backCoverUrl = coverCont.dataset.back;
      const hasBackCover = qsMaybe('#screenshot', coverCont) !== null;
      assertDefined(frontCoverUrl, 'No front image found in DatPiff release');
      const covers = [{
        url: new URL(frontCoverUrl),
        types: [ArtworkTypeIDs.Front]
      }];
      if (hasBackCover) {
        assertDefined(backCoverUrl, 'No back cover found in DatPiff release, even though there should be one');
        covers.push({
          url: new URL(backCoverUrl),
          types: [ArtworkTypeIDs.Back]
        });
      }
      return covers;
    }
    async postprocessImage(image) {
      const digest = await blobToDigest(image.content);
      if (DatPiffProvider.placeholderDigests.includes(digest)) {
        LOGGER.warn(`Skipping "${image.fetchedUrl}" as it matches a placeholder cover`);
        return null;
      } else {
        return image;
      }
    }
  }
  _defineProperty(DatPiffProvider, "placeholderDigests", ['259b065660159922c881d242701aa64d4e02672deba437590a2014519e7caeec', 'ef406a25c3ffd61150b0658f3fe4863898048b4e54b81289e0e53a0f00ad0ced', 'a2691bde8f4a5ced9e5b066d4fab0675b0ceb80f1f0ab3c4d453228549560048']);

  class DeezerProvider extends HeadMetaPropertyProvider {
    constructor() {
      super(...arguments);
      _defineProperty(this, "supportedDomains", ['deezer.com']);
      _defineProperty(this, "favicon", 'https://e-cdns-files.dzcdn.net/cache/images/common/favicon/favicon-16x16.526cde4edf20647be4ee32cdf35c1c13.png');
      _defineProperty(this, "name", 'Deezer');
      _defineProperty(this, "urlRegex", /(?:\w{2}\/)?album\/(\d+)/);
    }
    async findImages(url) {
      const covers = await super.findImages(url);
      return covers.filter(cover => {
        if (cover.url.pathname.includes('d41d8cd98f00b204e9800998ecf8427e')) {
          LOGGER.warn('Ignoring placeholder cover in Deezer release');
          return false;
        }
        return true;
      });
    }
  }

  class JamendoProvider extends HeadMetaPropertyProvider {
    constructor() {
      super(...arguments);
      _defineProperty(this, "supportedDomains", ['jamendo.com']);
      _defineProperty(this, "favicon", 'https://www.jamendo.com/Client/assets/toolkit/images/icon/favicon-32x32.png');
      _defineProperty(this, "name", 'Jamendo');
      _defineProperty(this, "urlRegex", /album\/(\d+)\/?/);
    }
  }

  class JunoDownloadProvider extends HeadMetaPropertyProvider {
    constructor() {
      super(...arguments);
      _defineProperty(this, "supportedDomains", ['junodownload.com']);
      _defineProperty(this, "favicon", 'https://wwwcdn.junodownload.com/14000200/images/digital/icons/favicon-32x32.png');
      _defineProperty(this, "name", 'Juno Download');
      _defineProperty(this, "urlRegex", /products(?:\/.+)?\/(\d+-\d+)/);
    }
  }

  class MelonProvider extends HeadMetaPropertyProvider {
    constructor() {
      super(...arguments);
      _defineProperty(this, "supportedDomains", ['melon.com']);
      _defineProperty(this, "favicon", 'https://www.melon.com/favicon.ico');
      _defineProperty(this, "name", 'Melon');
      _defineProperty(this, "urlRegex", /album\/detail\.htm.*[?&]albumId=(\d+)/);
    }
    cleanUrl(url) {
      return super.cleanUrl(url) + url.search;
    }
    is404Page(doc) {
      return qsMaybe('body > input#returnUrl', doc) !== null;
    }
  }

  class MonstercatProvider extends CoverArtProvider {
    constructor() {
      super(...arguments);
      _defineProperty(this, "supportedDomains", ['monstercat.com', 'player.monstercat.app']);
      _defineProperty(this, "favicon", 'https://www.monstercat.com/favicon.ico');
      _defineProperty(this, "name", 'Monstercat');
      _defineProperty(this, "urlRegex", /release\/([^/]+)/);
    }
    async findImages(url) {
      const releaseId = this.extractId(url);
      assertDefined(releaseId);
      const checkUrl = url.host === 'player.monstercat.app' ? new URL('https://player.monstercat.app/api/catalog/release/' + releaseId) : url;
      await this.fetchPage(checkUrl);
      return [{
        url: new URL(`https://www.monstercat.com/release/${releaseId}/cover`),
        types: [ArtworkTypeIDs.Front]
      }];
    }
  }

  class MusicBrainzProvider extends CoverArtProvider {
    constructor() {
      super(...arguments);
      _defineProperty(this, "supportedDomains", ['musicbrainz.org', 'beta.musicbrainz.org']);
      _defineProperty(this, "favicon", 'https://musicbrainz.org/static/images/favicons/favicon-32x32.png');
      _defineProperty(this, "allowButtons", false);
      _defineProperty(this, "name", 'MusicBrainz');
      _defineProperty(this, "urlRegex", /release\/([a-f\d-]+)/);
    }
    async findImages(url) {
      const mbid = this.extractId(url);
      assertDefined(mbid);
      return new ArchiveProvider().findImagesCAA(`mbid-${mbid}`);
    }
  }
  class CoverArtArchiveProvider extends MusicBrainzProvider {
    constructor() {
      super(...arguments);
      _defineProperty(this, "supportedDomains", ['coverartarchive.org']);
      _defineProperty(this, "favicon", 'https://coverartarchive.org/favicon.png');
      _defineProperty(this, "name", 'Cover Art Archive');
      _defineProperty(this, "urlRegex", /release\/([a-f\d-]+)\/?$/);
    }
  }

  class MusikSammlerProvider extends CoverArtProvider {
    constructor() {
      super(...arguments);
      _defineProperty(this, "supportedDomains", ['musik-sammler.de']);
      _defineProperty(this, "name", 'Musik-Sammler');
      _defineProperty(this, "favicon", 'https://www.musik-sammler.de/favicon.ico');
      _defineProperty(this, "urlRegex", /release\/(?:.*-)?(\d+)(?:\/|$)/);
    }
    async findImages(url) {
      const page = parseDOM(await this.fetchPage(url), url.href);
      const coverElements = qsa('#imageGallery > li', page);
      return coverElements.map(coverLi => {
        const coverSrc = coverLi.dataset.src;
        assertDefined(coverSrc, 'Musik-Sammler image without source?');
        return {
          url: new URL(coverSrc, 'https://www.musik-sammler.de/')
        };
      });
    }
  }

  const ERROR_404_QUERY = '.n-for404';
  const COVER_IMG_QUERY = '.cover > img.j-img';
  class NetEaseProvider extends CoverArtProvider {
    constructor() {
      super(...arguments);
      _defineProperty(this, "supportedDomains", ['music.163.com']);
      _defineProperty(this, "name", 'NetEase');
      _defineProperty(this, "favicon", 'https://s1.music.126.net/style/favicon.ico');
      _defineProperty(this, "urlRegex", /\/album\?id=(\d+)/);
    }
    cleanUrl(url) {
      return url.href;
    }
    async findImages(url) {
      const releaseId = this.extractId(url);
      const staticUrl = new URL(`https://music.163.com/album?id=${releaseId}`);
      const respDocument = parseDOM(await this.fetchPage(staticUrl), url.href);
      if (qsMaybe(ERROR_404_QUERY, respDocument) !== null) {
        throw new Error('NetEase release does not exist');
      }
      const imgElement = qs(COVER_IMG_QUERY, respDocument);
      const coverUrl = imgElement.dataset.src;
      assertDefined(coverUrl, 'No image found in NetEase release');
      return [{
        url: new URL(coverUrl),
        types: [ArtworkTypeIDs.Front]
      }];
    }
  }

  class QobuzProvider extends CoverArtProvider {
    constructor() {
      super(...arguments);
      _defineProperty(this, "supportedDomains", ['qobuz.com', 'open.qobuz.com']);
      _defineProperty(this, "favicon", 'https://www.qobuz.com/favicon.ico');
      _defineProperty(this, "name", 'Qobuz');
      _defineProperty(this, "urlRegex", [/open\.qobuz\.com\/(?:.+?\/)?album\/([A-Za-z\d]+)(?:\/|$)/, /album\/[^/]+\/([A-Za-z\d]+)(?:\/|$)/]);
    }
    static get QOBUZ_APP_ID() {
      return '712109809';
    }
    static idToCoverUrl(id) {
      const d1 = id.slice(-2);
      const d2 = id.slice(-4, -2);
      const imgUrl = `https://static.qobuz.com/images/covers/${d1}/${d2}/${id}_org.jpg`;
      return new URL(imgUrl);
    }
    static async getMetadata(id) {
      const resp = await request.get(`https://www.qobuz.com/api.json/0.2/album/get?album_id=${id}&offset=0&limit=20`, {
        headers: {
          'x-app-id': QobuzProvider.QOBUZ_APP_ID
        }
      });
      const metadata = safeParseJSON(resp.text, 'Invalid response from Qobuz API');
      assert(metadata.id.toString() === id, `Qobuz returned wrong release: Requested ${id}, got ${metadata.id}`);
      return metadata;
    }
    static extractGoodies(goodies) {
      return goodies.filter(goodie => !!goodie.original_url).map(goodie => {
        const isBooklet = goodie.name.toLowerCase() === 'livret numérique';
        return {
          url: new URL(goodie.original_url),
          types: isBooklet ? [ArtworkTypeIDs.Booklet] : [],
          comment: isBooklet ? 'Qobuz booklet' : goodie.name
        };
      });
    }
    async findImages(url) {
      const id = this.extractId(url);
      assertHasValue(id);
      let metadata;
      try {
        metadata = await QobuzProvider.getMetadata(id);
      } catch (err) {
        if (err instanceof HTTPResponseError && err.statusCode == 400) {
          console.error(err);
          throw new Error('Bad request to Qobuz API, app ID invalid?');
        }
        if (err instanceof HTTPResponseError && QobuzProvider.apiFallbackStatusCodes.includes(err.statusCode)) {
          LOGGER.warn(`Qobuz API returned ${err.statusCode}, falling back on URL rewriting. Booklets may be missed.`);
          return [{
            url: QobuzProvider.idToCoverUrl(id),
            types: [ArtworkTypeIDs.Front]
          }];
        }
        throw err;
      }
      const goodies = QobuzProvider.extractGoodies(metadata.goodies ?? []);
      const coverUrl = metadata.image.large.replace(/_\d+\.([a-zA-Z\d]+)$/, '_org.$1');
      return [{
        url: new URL(coverUrl),
        types: [ArtworkTypeIDs.Front]
      }, ...goodies];
    }
  }
  _defineProperty(QobuzProvider, "apiFallbackStatusCodes", [403, 404]);

  class RateYourMusicProvider extends CoverArtProvider {
    constructor() {
      super(...arguments);
      _defineProperty(this, "supportedDomains", ['rateyourmusic.com']);
      _defineProperty(this, "favicon", 'https://e.snmc.io/2.5/img/sonemic.png');
      _defineProperty(this, "name", 'RateYourMusic');
      _defineProperty(this, "urlRegex", /\/release\/((?:album|single)(?:\/[^/]+){2})(?:\/|$)/);
    }
    async findImages(url) {
      const releaseId = this.extractId(url);
      assertHasValue(releaseId);
      const buyUrl = `https://rateyourmusic.com/release/${releaseId}/buy`;
      const buyDoc = parseDOM(await this.fetchPage(new URL(buyUrl)), buyUrl);
      if (qsMaybe('.header_profile_logged_in', buyDoc) === null) {
        throw new Error('Extracting covers from RYM requires being logged in to an RYM account.');
      }
      const fullResUrl = qs('.qq a', buyDoc).href;
      return [{
        url: new URL(fullResUrl),
        types: [ArtworkTypeIDs.Front]
      }];
    }
  }

  class RockipediaProvider extends CoverArtProvider {
    constructor() {
      super(...arguments);
      _defineProperty(this, "supportedDomains", ['rockipedia.no']);
      _defineProperty(this, "favicon", 'https://www.rockipedia.no/wp-content/themes/rockipedia/img/favicon.ico');
      _defineProperty(this, "name", 'Rockipedia');
      _defineProperty(this, "urlRegex", /utgivelser\/.+?-(\d+)/);
    }
    async findImages(url) {
      const id = this.extractId(url);
      assertDefined(id);
      const imageBrowserUrl = new URL(`https://www.rockipedia.no/?imagebrowser=true&t=album&id=${id}`);
      const imageBrowserDoc = parseDOM(await this.fetchPage(imageBrowserUrl), url.href);
      const coverElements = qsa('li.royalSlide', imageBrowserDoc);
      return filterNonNull(coverElements.map(coverElement => {
        const coverUrl = coverElement.dataset.src;
        if (!coverUrl) {
          LOGGER.warn(`Could not extract a cover for Rockipedia release ${url}: Unexpected null src`);
          return null;
        }
        return {
          url: new URL(coverUrl)
        };
      }));
    }
  }

  const SC_CLIENT_ID_REGEX = /client_id\s*:\s*"([a-zA-Z\d]{32})"/;
  const SC_CLIENT_ID_CACHE_KEY = 'ROpdebee_ECAU_SC_ID';
  const SC_HOMEPAGE = 'https://soundcloud.com/';
  class SoundcloudProvider extends ProviderWithTrackImages {
    constructor() {
      super(...arguments);
      _defineProperty(this, "supportedDomains", ['soundcloud.com']);
      _defineProperty(this, "favicon", 'https://a-v2.sndcdn.com/assets/images/sc-icons/favicon-2cadd14bdb.ico');
      _defineProperty(this, "name", 'Soundcloud');
      _defineProperty(this, "urlRegex", []);
    }
    static async loadClientID() {
      const pageResp = await request.get(SC_HOMEPAGE);
      const pageDom = parseDOM(pageResp.text, SC_HOMEPAGE);
      const scriptUrls = qsa('script', pageDom).map(script => script.src).filter(src => src.startsWith('https://a-v2.sndcdn.com/assets/'));
      collatedSort(scriptUrls);
      for (const scriptUrl of scriptUrls) {
        const contentResponse = await request.get(scriptUrl);
        const content = contentResponse.text;
        const clientId = content.match(SC_CLIENT_ID_REGEX);
        if (clientId !== null && clientId !== void 0 && clientId[1]) {
          return clientId[1];
        }
      }
      throw new Error('Could not extract Soundcloud Client ID');
    }
    static async getClientID() {
      const cachedID = localStorage.getItem(SC_CLIENT_ID_CACHE_KEY);
      if (cachedID) {
        return cachedID;
      }
      const newID = await this.loadClientID();
      localStorage.setItem(SC_CLIENT_ID_CACHE_KEY, newID);
      return newID;
    }
    static async refreshClientID() {
      const oldId = await this.getClientID();
      const newId = await this.loadClientID();
      assert(oldId !== newId, 'Attempted to refresh Soundcloud Client ID but retrieved the same one.');
      localStorage.setItem(SC_CLIENT_ID_CACHE_KEY, newId);
    }
    supportsUrl(url) {
      const [artistId, ...pathParts] = url.pathname.trim().slice(1).replace(/\/$/, '').split('/');
      return pathParts.length > 0 && !SoundcloudProvider.badArtistIDs.has(artistId) && !SoundcloudProvider.badSubpaths.has(urlBasename(url));
    }
    extractId(url) {
      return url.pathname.slice(1);
    }
    async findImages(url) {
      var _this$extractMetadata;
      let onlyFront = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      const pageContent = await this.fetchPage(url);
      const metadata = (_this$extractMetadata = this.extractMetadataFromJS(pageContent)) === null || _this$extractMetadata === void 0 ? void 0 : _this$extractMetadata.find(data => ['sound', 'playlist'].includes(data.hydratable));
      if (!metadata) {
        throw new Error('Could not extract metadata from Soundcloud page. The release may have been removed.');
      }
      if (metadata.hydratable === 'sound') {
        return this.extractCoverFromTrackMetadata(metadata, onlyFront);
      } else {
        assert(metadata.hydratable === 'playlist');
        return this.extractCoversFromSetMetadata(metadata, onlyFront);
      }
    }
    extractMetadataFromJS(pageContent) {
      var _pageContent$match;
      const jsonData = (_pageContent$match = pageContent.match(/>window\.__sc_hydration = (.+);<\/script>/)) === null || _pageContent$match === void 0 ? void 0 : _pageContent$match[1];
      if (!jsonData) return;
      return safeParseJSON(jsonData);
    }
    extractCoverFromTrackMetadata(metadata, onlyFront) {
      if (!metadata.data.artwork_url) {
        return [];
      }
      const covers = [{
        url: new URL(metadata.data.artwork_url),
        types: [ArtworkTypeIDs.Front]
      }];
      if (!onlyFront) {
        const backdrops = this.extractVisuals(metadata.data);
        covers.push(...backdrops.map(backdropUrl => ({
          url: new URL(backdropUrl),
          types: [ArtworkTypeIDs.Other],
          comment: 'Soundcloud backdrop'
        })));
      }
      return covers;
    }
    async extractCoversFromSetMetadata(metadata, onlyFront) {
      const covers = [];
      if (metadata.data.artwork_url) {
        covers.push({
          url: new URL(metadata.data.artwork_url),
          types: [ArtworkTypeIDs.Front]
        });
      }
      if (onlyFront) return covers;
      const tracks = await this.lazyLoadTracks(metadata.data.tracks);
      const trackCovers = filterNonNull(tracks.flatMap((track, trackNumber) => {
        const trackImages = [];
        if (!track.artwork_url) {
          LOGGER.warn(`Track #${trackNumber} has no track image?`);
        } else {
          trackImages.push({
            url: track.artwork_url,
            trackNumber: (trackNumber + 1).toString()
          });
        }
        const visuals = this.extractVisuals(track);
        trackImages.push(...visuals.map(visualUrl => ({
          url: visualUrl,
          trackNumber: (trackNumber + 1).toString(),
          customCommentPrefix: ['Soundcloud backdrop for track', 'Soundcloud backdrop for tracks']
        })));
        return trackImages;
      }));
      const mergedTrackCovers = await this.mergeTrackImages(trackCovers, metadata.data.artwork_url, true);
      return [...covers, ...mergedTrackCovers];
    }
    async lazyLoadTracks(tracks) {
      const lazyTrackIDs = tracks.filter(track => track.artwork_url === undefined).map(track => track.id);
      if (lazyTrackIDs.length === 0) return tracks;
      let trackData;
      try {
        trackData = await this.getTrackData(lazyTrackIDs);
      } catch (err) {
        LOGGER.error('Failed to load Soundcloud track data, some track images may be missed', err);
        return tracks;
      }
      const trackIdToLoadedTrack = new Map(trackData.map(track => [track.id, track]));
      return tracks.map(track => {
        if (track.artwork_url !== undefined) return track;
        const loadedTrack = trackIdToLoadedTrack.get(track.id);
        if (!loadedTrack) {
          LOGGER.error(`Could not load track data for track ${track.id}, some track images may be missed`);
          return track;
        }
        return loadedTrack;
      });
    }
    async getTrackData(lazyTrackIDs) {
      let firstTry = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      LOGGER.info('Loading Soundcloud track data');
      const clientId = await SoundcloudProvider.getClientID();
      const params = new URLSearchParams({
        ids: lazyTrackIDs.join(','),
        client_id: clientId
      });
      let trackDataResponse;
      try {
        trackDataResponse = await request.get(`https://api-v2.soundcloud.com/tracks?${params}`);
      } catch (err) {
        if (!(firstTry && err instanceof HTTPResponseError && err.statusCode === 401)) {
          throw err;
        }
        LOGGER.debug('Attempting to refresh client ID');
        await SoundcloudProvider.refreshClientID();
        return this.getTrackData(lazyTrackIDs, firstTry = false);
      }
      return safeParseJSON(trackDataResponse.text, 'Failed to parse Soundcloud API response');
    }
    extractVisuals(track) {
      var _track$visuals;
      return ((_track$visuals = track.visuals) === null || _track$visuals === void 0 ? void 0 : _track$visuals.visuals.map(visual => visual.visual_url)) ?? [];
    }
  }
  _defineProperty(SoundcloudProvider, "badArtistIDs", new Set(['you', 'discover', 'stream', 'upload', 'search']));
  _defineProperty(SoundcloudProvider, "badSubpaths", new Set(['likes', 'followers', 'following', 'reposts', 'albums', 'tracks', 'popular-tracks', 'comments', 'sets', 'recommended']));

  class SpotifyProvider extends HeadMetaPropertyProvider {
    constructor() {
      super(...arguments);
      _defineProperty(this, "supportedDomains", ['open.spotify.com']);
      _defineProperty(this, "favicon", 'https://open.spotifycdn.com/cdn/images/favicon32.8e66b099.png');
      _defineProperty(this, "name", 'Spotify');
      _defineProperty(this, "urlRegex", /\/album\/(\w+)/);
    }
    is404Page(doc) {
      return qsMaybe('head > meta[property="og:title"]', doc) === null;
    }
  }

  const APP_ID = 'CzET4vdadNUFQ5JU';
  class TidalProvider extends CoverArtProvider {
    constructor() {
      super(...arguments);
      _defineProperty(this, "supportedDomains", ['tidal.com', 'listen.tidal.com', 'store.tidal.com']);
      _defineProperty(this, "favicon", 'https://listen.tidal.com/favicon.ico');
      _defineProperty(this, "name", 'Tidal');
      _defineProperty(this, "urlRegex", /\/album\/(\d+)/);
      _defineProperty(this, "countryCode", null);
    }
    async getCountryCode() {
      if (!this.countryCode) {
        const resp = await request.get('https://listen.tidal.com/v1/country/context?countryCode=WW&locale=en_US&deviceType=BROWSER', {
          headers: {
            'x-tidal-token': APP_ID
          }
        });
        const codeResponse = safeParseJSON(resp.text, 'Invalid JSON response from Tidal API for country code');
        this.countryCode = codeResponse.countryCode;
      }
      assertHasValue(this.countryCode, 'Cannot determine Tidal country');
      return this.countryCode;
    }
    async getCoverUrlFromMetadata(albumId) {
      var _metadata$rows$;
      const countryCode = await this.getCountryCode();
      await request.get('https://listen.tidal.com/v1/ping');
      const apiUrl = `https://listen.tidal.com/v1/pages/album?albumId=${albumId}&countryCode=${countryCode}&deviceType=BROWSER`;
      const resp = await request.get(apiUrl, {
        headers: {
          'x-tidal-token': APP_ID
        },
        httpErrorMessages: {
          404: 'Tidal release does not exist'
        }
      });
      const metadata = safeParseJSON(resp.text, 'Invalid response from Tidal API');
      const albumMetadata = (_metadata$rows$ = metadata.rows[0]) === null || _metadata$rows$ === void 0 || (_metadata$rows$ = _metadata$rows$.modules) === null || _metadata$rows$ === void 0 || (_metadata$rows$ = _metadata$rows$[0]) === null || _metadata$rows$ === void 0 ? void 0 : _metadata$rows$.album;
      assertHasValue(albumMetadata, 'Tidal API returned no album, 404?');
      assert(albumMetadata.id.toString() === albumId, `Tidal returned wrong release: Requested ${albumId}, got ${albumMetadata.id}`);
      const coverId = albumMetadata.cover;
      assertHasValue(coverId, 'Could not find cover in Tidal metadata');
      return `https://resources.tidal.com/images/${coverId.replace(/-/g, '/')}/origin.jpg`;
    }
    async findImages(url) {
      const albumId = this.extractId(url);
      assertHasValue(albumId);
      const coverUrl = await this.getCoverUrlFromMetadata(albumId);
      return [{
        url: new URL(coverUrl),
        types: [ArtworkTypeIDs.Front]
      }];
    }
  }

  class TraxsourceProvider extends HeadMetaPropertyProvider {
    constructor() {
      super(...arguments);
      _defineProperty(this, "supportedDomains", ['traxsource.com']);
      _defineProperty(this, "favicon", 'https://geo-static.traxsource.com/img/favicon-128x128.png');
      _defineProperty(this, "name", 'Traxsource');
      _defineProperty(this, "urlRegex", /title\/(\d+)/);
    }
  }

  function mapPackagingType(packaging, caption) {
    if (!caption && packaging === 'Jacket') {
      return {
        type: [ArtworkTypeIDs.Front, ArtworkTypeIDs.Back, ArtworkTypeIDs.Spine],
        comment: ''
      };
    } else if (!caption) {
      return {
        type: [ArtworkTypeIDs.Front],
        comment: packaging
      };
    }
    const types = new Set();
    const keywords = caption.split(/,|\s|and|&/i);
    const typeKeywordsToTypes = [['front', ArtworkTypeIDs.Front], ['back', ArtworkTypeIDs.Back], ['spine', ArtworkTypeIDs.Spine], ['side', ArtworkTypeIDs.Spine], ['top', ArtworkTypeIDs.Top], ['bottom', ArtworkTypeIDs.Bottom], ['interior', ArtworkTypeIDs.Tray], ['inside', ArtworkTypeIDs.Tray]];
    for (const [typeKeyword, type] of typeKeywordsToTypes) {
      if (keywords.some(kw => kw.toLowerCase() === typeKeyword)) {
        types.add(type);
      }
    }
    if (types.has(ArtworkTypeIDs.Front) && types.has(ArtworkTypeIDs.Back)) {
      types.add(ArtworkTypeIDs.Spine);
    }
    const typeKeywords = new Set(typeKeywordsToTypes.map(_ref => {
      let [typeKeyword] = _ref;
      return typeKeyword;
    }));
    const otherKeywords = keywords.filter(kw => !typeKeywords.has(kw.toLowerCase()));
    if (packaging !== 'Jacket') otherKeywords.unshift(packaging);
    const comment = otherKeywords.join(' ').trim();
    return {
      type: types.size > 0 ? [...types] : [ArtworkTypeIDs.Other],
      comment
    };
  }
  function mapDiscType(mediumType, caption) {
    const commentParts = [];
    let type = ArtworkTypeIDs.Medium;
    const keywords = caption.split(/,|\s/).filter(Boolean);
    for (const keyword of keywords) {
      if (/reverse|back/i.test(keyword)) {
        type = ArtworkTypeIDs['Matrix/Runout'];
      } else if (!/front/i.test(keyword)) {
        commentParts.push(keyword);
      }
    }
    if (commentParts.length > 0 && /^\d+/.test(commentParts[0]) || mediumType !== 'Disc') {
      commentParts.unshift(mediumType);
    }
    return {
      type,
      comment: commentParts.join(' ')
    };
  }
  const __CAPTION_TYPE_MAPPING = {
    front: ArtworkTypeIDs.Front,
    booklet: ArtworkTypeIDs.Booklet,
    jacket: mapPackagingType.bind(undefined, 'Jacket'),
    disc: mapDiscType.bind(undefined, 'Disc'),
    cd: mapDiscType.bind(undefined, 'CD'),
    cassette: ArtworkTypeIDs.Medium,
    vinyl: ArtworkTypeIDs.Medium,
    dvd: mapDiscType.bind(undefined, 'DVD'),
    'blu-ray': mapDiscType.bind(undefined, 'Blu‐ray'),
    tray: ArtworkTypeIDs.Tray,
    back: ArtworkTypeIDs.Back,
    obi: ArtworkTypeIDs.Obi,
    box: mapPackagingType.bind(undefined, 'Box'),
    card: {
      type: ArtworkTypeIDs.Other,
      comment: 'Card'
    },
    sticker: ArtworkTypeIDs.Sticker,
    slipcase: mapPackagingType.bind(undefined, 'Slipcase'),
    digipack: mapPackagingType.bind(undefined, 'Digipak'),
    sleeve: mapPackagingType.bind(undefined, 'Sleeve'),
    insert: {
      type: ArtworkTypeIDs.Other,
      comment: 'Insert'
    },
    inside: ArtworkTypeIDs.Tray,
    case: mapPackagingType.bind(undefined, 'Case'),
    contents: ArtworkTypeIDs['Raw/Unedited']
  };
  function convertMappingReturnValue(ret) {
    if (Object.prototype.hasOwnProperty.call(ret, 'type') && Object.prototype.hasOwnProperty.call(ret, 'comment')) {
      const retObj = ret;
      return {
        types: Array.isArray(retObj.type) ? retObj.type : [retObj.type],
        comment: retObj.comment
      };
    }
    let types = ret;
    if (!Array.isArray(types)) {
      types = [types];
    }
    return {
      types,
      comment: ''
    };
  }
  const CAPTION_TYPE_MAPPING = {};
  for (const [key, value] of Object.entries(__CAPTION_TYPE_MAPPING)) {
    CAPTION_TYPE_MAPPING[key] = caption => {
      if (typeof value === 'function') {
        return convertMappingReturnValue(value(caption));
      }
      const retObj = convertMappingReturnValue(value);
      if (retObj.comment && caption) retObj.comment += ' ' + caption;else if (caption) retObj.comment = caption;
      return retObj;
    };
  }
  const PLACEHOLDER_URL = '/db/img/album-nocover-medium.gif';
  const NSFW_PLACEHOLDER_URL = '/db/img/album-nsfw-medium.gif';
  function cleanupCaption(captionRest) {
    return captionRest.replace(/^\((.+)\)$/, '$1').replace(/^\[(.+)]$/, '$1').replace(/^{(.+)}$/, '$1').replace(/^[-–:]\s*/, '');
  }
  function convertCaption(caption) {
    LOGGER.debug(`Found caption “${caption}”`);
    const [captionType, ...captionRestParts] = caption.trim().split(/(?=[^a-zA-Z\d-])/);
    const captionRest = cleanupCaption(captionRestParts.join('').trim());
    const mapper = CAPTION_TYPE_MAPPING[captionType.toLowerCase()];
    if (!mapper) {
      LOGGER.debug(`Could not map “${captionType}” to any known cover art types`);
      LOGGER.debug(`Setting cover art comment to “${caption}”`);
      return {
        comment: caption
      };
    }
    const mappedResult = mapper(captionRest);
    LOGGER.debug(`Mapped caption to types ${mappedResult.types} and comment “${mappedResult.comment}”`);
    return mappedResult;
  }
  function convertCaptions(cover) {
    const url = new URL(cover.url);
    if (!cover.caption) {
      return {
        url
      };
    }
    return {
      url,
      ...convertCaption(cover.caption)
    };
  }
  class VGMdbProvider extends CoverArtProvider {
    constructor() {
      super(...arguments);
      _defineProperty(this, "supportedDomains", ['vgmdb.net']);
      _defineProperty(this, "favicon", 'https://vgmdb.net/favicon.ico');
      _defineProperty(this, "name", 'VGMdb');
      _defineProperty(this, "urlRegex", /\/album\/(\d+)(?:\/|$)/);
    }
    async findImages(url) {
      var _qsMaybe;
      const pageSrc = await this.fetchPage(url);
      if (pageSrc.includes('/db/img/banner-error.gif')) {
        throw new Error('VGMdb returned an error');
      }
      const pageDom = parseDOM(pageSrc, url.href);
      if (qsMaybe('#navmember', pageDom) === null) {
        LOGGER.warn('Heads up! VGMdb requires you to be logged in to view all images. Some images may have been missed. If you have an account, please log in to VGMdb to fetch all images.');
      }
      const coverGallery = qsMaybe('#cover_gallery', pageDom);
      const galleryCovers = coverGallery ? await VGMdbProvider.extractCoversFromDOMGallery(coverGallery) : [];
      const mainCoverUrl = (_qsMaybe = qsMaybe('#coverart', pageDom)) === null || _qsMaybe === void 0 || (_qsMaybe = _qsMaybe.style.backgroundImage.match(/url\(["']?(.+?)["']?\)/)) === null || _qsMaybe === void 0 ? void 0 : _qsMaybe[1];
      if (mainCoverUrl && mainCoverUrl !== PLACEHOLDER_URL && !galleryCovers.some(cover => urlBasename(cover.url) === urlBasename(mainCoverUrl))) {
        if (mainCoverUrl === NSFW_PLACEHOLDER_URL) {
          LOGGER.warn('Heads up! The main cover of this VGMdb release is marked as NSFW. The original image may have been skipped. Please adjust your VGMdb preferences to show NSFW images to enable fetching these.');
        } else {
          galleryCovers.unshift({
            url: new URL(mainCoverUrl, url.origin),
            types: [ArtworkTypeIDs.Front],
            comment: ''
          });
        }
      }
      return galleryCovers;
    }
    static async extractCoversFromDOMGallery(coverGallery) {
      const coverElements = qsa('a[id*="thumb_"]', coverGallery);
      return coverElements.map(this.extractCoverFromAnchor.bind(this));
    }
    static extractCoverFromAnchor(anchor) {
      return convertCaptions({
        url: anchor.href,
        caption: qs('.label', anchor).textContent ?? ''
      });
    }
    async findImagesWithApi(url) {
      const id = this.extractId(url);
      assertHasValue(id);
      const apiUrl = `https://vgmdb.info/album/${id}?format=json`;
      const apiResp = await request.get(apiUrl);
      const metadata = safeParseJSON(apiResp.text, 'Invalid JSON response from vgmdb.info API');
      assert(metadata.link === 'album/' + id, `VGMdb.info returned wrong release: Requested album/${id}, got ${metadata.link}`);
      return VGMdbProvider.extractImagesFromApiMetadata(metadata);
    }
    static extractImagesFromApiMetadata(metadata) {
      const covers = metadata.covers.map(cover => {
        return {
          url: cover.full,
          caption: cover.name
        };
      });
      if (metadata.picture_full && !covers.some(cover => cover.url === metadata.picture_full)) {
        covers.unshift({
          url: metadata.picture_full,
          caption: 'Front'
        });
      }
      return covers.map(cover => convertCaptions(cover));
    }
  }

  class VKMusicProvider extends CoverArtProvider {
    constructor() {
      super(...arguments);
      _defineProperty(this, "supportedDomains", ['*.vk.com']);
      _defineProperty(this, "favicon", 'https://vk.com/images/icons/favicons/fav_logo_2x.ico');
      _defineProperty(this, "name", 'VK Music');
      _defineProperty(this, "urlRegex", [/music\/album\/-(\d+_\d+)/, /audio\?act=audio_playlist-(\d+_\d+)/]);
    }
    cleanUrl(url) {
      return url.host + url.pathname + url.search;
    }
    async findImages(url) {
      var _coverElem$getAttribu;
      const page = parseDOM(await this.fetchPage(url), url.href);
      const coverElem = qs('.AudioPlaylistSnippet__cover, .audioPlaylist__cover', page);
      const coverUrl = (_coverElem$getAttribu = coverElem.getAttribute('style')) === null || _coverElem$getAttribu === void 0 || (_coverElem$getAttribu = _coverElem$getAttribu.match(/background-image:\s*url\('(.+)'\);/)) === null || _coverElem$getAttribu === void 0 ? void 0 : _coverElem$getAttribu[1];
      assertHasValue(coverUrl, 'Could not extract cover URL');
      return [{
        url: new URL(coverUrl, url),
        types: [ArtworkTypeIDs.Front]
      }];
    }
  }

  class YandexMusicProvider extends HeadMetaPropertyProvider {
    constructor() {
      super(...arguments);
      _defineProperty(this, "supportedDomains", ['music.yandex.com', 'music.yandex.ru', 'music.yandex.by', 'music.yandex.uz', 'music.yandex.kz']);
      _defineProperty(this, "favicon", 'https://music.yandex.com/favicon32.png');
      _defineProperty(this, "name", 'Yandex Music');
      _defineProperty(this, "urlRegex", /album\/(\d+)/);
    }
  }

  class YoutubeProvider extends HeadMetaPropertyProvider {
    constructor() {
      super(...arguments);
      _defineProperty(this, "supportedDomains", ['youtube.com']);
      _defineProperty(this, "favicon", 'https://www.youtube.com/s/desktop/e4d15d2c/img/favicon_144x144.png');
      _defineProperty(this, "name", 'YouTube');
      _defineProperty(this, "urlRegex", /watch\?v=(\w+)/);
    }
    cleanUrl(url) {
      return super.cleanUrl(url) + url.search;
    }
    is404Page(doc) {
      return doc.body.innerHTML.includes("This video isn't available anymore");
    }
    fetchPage(url, options) {
      return super.fetchPage(url, {
        ...options,
        headers: {
          ...(options === null || options === void 0 ? void 0 : options.headers),
          'Accept-Language': 'en-GB,en;q=0.5'
        }
      });
    }
  }

  const YOUTUBE_MUSIC_DATA_REGEXP = /initialData\.push\({path: '\\\/browse', params: JSON\.parse\('(.+?)'\), data: '(.+?)'}\);/;
  class YoutubeMusicProvider extends CoverArtProvider {
    constructor() {
      super(...arguments);
      _defineProperty(this, "supportedDomains", ['music.youtube.com']);
      _defineProperty(this, "favicon", 'https://music.youtube.com/img/favicon_144.png');
      _defineProperty(this, "name", 'YouTube Music');
      _defineProperty(this, "urlRegex", /\/(?:playlist\?list=|browse\/|watch\?v=)(\w+)/);
    }
    cleanUrl(url) {
      return super.cleanUrl(url) + url.search;
    }
    async findImages(url) {
      if (url.pathname === '/watch') {
        const ytUrl = new URL(url.toString());
        ytUrl.host = 'www.youtube.com';
        return new YoutubeProvider().findImages(ytUrl);
      }
      const respDocument = await this.fetchPage(url);
      const pageInfo = this.extractPageInfo(respDocument);
      this.checkAlbumPage(pageInfo);
      return this.extractImages(pageInfo);
    }
    extractPageInfo(doc) {
      const docMatch = doc.match(YOUTUBE_MUSIC_DATA_REGEXP);
      assertHasValue(docMatch, 'Failed to extract page information, non-existent release?');
      const [strParams, strData] = docMatch.slice(1).map(str => this.unescapeJson(str));
      return {
        params: safeParseJSON(strParams, 'Failed to parse `params` JSON data'),
        data: safeParseJSON(strData, 'Failed to parse `data` JSON data')
      };
    }
    unescapeJson(str) {
      const unicodeEscaped = str.replaceAll('\\x', '\\u00');
      const stringified = `"${unicodeEscaped}"`;
      return safeParseJSON(stringified, 'Could not decode YT Music JSON data');
    }
    checkAlbumPage(pageInfo) {
      var _pageType$match;
      const config = safeParseJSON(pageInfo.params.browseEndpointContextSupportedConfigs);
      const pageType = config.browseEndpointContextMusicConfig.pageType;
      const pageTypeReadable = ((_pageType$match = pageType.match(/_([A-Z]+)$/)) === null || _pageType$match === void 0 ? void 0 : _pageType$match[1].toLowerCase()) ?? pageType;
      assert(pageType === 'MUSIC_PAGE_TYPE_ALBUM', `Expected an album, got ${pageTypeReadable} instead`);
    }
    extractImages(pageInfo) {
      const thumbnails = pageInfo.data.header.musicDetailHeaderRenderer.thumbnail.croppedSquareThumbnailRenderer.thumbnail.thumbnails;
      const thumbnailUrl = thumbnails[thumbnails.length - 1].url;
      return [{
        url: new URL(thumbnailUrl),
        types: [ArtworkTypeIDs.Front]
      }];
    }
  }

  const PROVIDER_DISPATCH = new DispatchMap();
  function addProvider(provider) {
    provider.supportedDomains.forEach(domain => PROVIDER_DISPATCH.set(domain, provider));
  }
  addProvider(new AllMusicProvider());
  addProvider(new AmazonProvider());
  addProvider(new AmazonMusicProvider());
  addProvider(new AppleMusicProvider());
  addProvider(new ArchiveProvider());
  addProvider(new AudiomackProvider());
  addProvider(new BandcampProvider());
  addProvider(new BeatportProvider());
  addProvider(new BoothProvider());
  addProvider(new BugsProvider());
  addProvider(new CoverArtArchiveProvider());
  addProvider(new DatPiffProvider());
  addProvider(new DeezerProvider());
  addProvider(new DiscogsProvider());
  addProvider(new JamendoProvider());
  addProvider(new JunoDownloadProvider());
  addProvider(new MelonProvider());
  addProvider(new MonstercatProvider());
  addProvider(new MusicBrainzProvider());
  addProvider(new MusikSammlerProvider());
  addProvider(new NetEaseProvider());
  addProvider(new QobuzProvider());
  addProvider(new RateYourMusicProvider());
  addProvider(new RockipediaProvider());
  addProvider(new SevenDigitalProvider());
  addProvider(new SoundcloudProvider());
  addProvider(new SpotifyProvider());
  addProvider(new TidalProvider());
  addProvider(new TraxsourceProvider());
  addProvider(new VGMdbProvider());
  addProvider(new VKMusicProvider());
  addProvider(new YandexMusicProvider());
  addProvider(new YoutubeMusicProvider());
  addProvider(new YoutubeProvider());
  function extractDomain(url) {
    return url.hostname.replace(/^www\./, '');
  }
  function getProvider(url) {
    const provider = getProviderByDomain(url);
    return provider !== null && provider !== void 0 && provider.supportsUrl(url) ? provider : undefined;
  }
  function getProviderByDomain(url) {
    return PROVIDER_DISPATCH.get(extractDomain(url));
  }

  function getFilename(url) {
    return decodeURIComponent(urlBasename(url, 'image'));
  }
  class ImageFetcher {
    constructor(hooks) {
      _defineProperty(this, "doneImages", void 0);
      _defineProperty(this, "hooks", void 0);
      _defineProperty(this, "lastId", 0);
      this.doneImages = new Set();
      this.hooks = hooks;
    }
    async fetchImages(coverArt, onlyFront) {
      const {
        url
      } = coverArt;
      if (this.urlAlreadyAdded(url)) {
        LOGGER.warn(`${url} has already been added`);
        return {
          images: []
        };
      }
      const provider = getProvider(url);
      if (provider) {
        return this.fetchImagesFromProvider(coverArt, provider, onlyFront);
      }
      const {
        types: defaultTypes,
        comment: defaultComment
      } = coverArt;
      const result = await this.fetchImageFromURL(url);
      if (!result) {
        return {
          images: []
        };
      }
      await enqueueImage(result, defaultTypes, defaultComment);
      return {
        images: [result]
      };
    }
    async fetchMaximisedImage(url, id) {
      for await (const maxCandidate of getMaximisedCandidates(url)) {
        const candidateName = maxCandidate.filename || getFilename(maxCandidate.url);
        if (this.urlAlreadyAdded(maxCandidate.url)) {
          LOGGER.warn(`${maxCandidate.url} has already been added`);
          return;
        }
        try {
          const result = await this.fetchImageContents(maxCandidate.url, candidateName, id, maxCandidate.headers);
          if (maxCandidate.url.href !== url.href) {
            LOGGER.info(`Maximised ${url.href} to ${maxCandidate.url.href}`);
          }
          return result;
        } catch (err) {
          if (maxCandidate.likely_broken) continue;
          LOGGER.warn(`Skipping maximised candidate ${maxCandidate.url}`, err);
        }
      }
      return this.fetchImageContents(url, getFilename(url), id, {});
    }
    async fetchImageFromURL(url) {
      var _this$hooks$onFetchSt, _this$hooks;
      let skipMaximisation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      const id = this.getImageId();
      (_this$hooks$onFetchSt = (_this$hooks = this.hooks).onFetchStarted) === null || _this$hooks$onFetchSt === void 0 || _this$hooks$onFetchSt.call(_this$hooks, id, url);
      try {
        const fetchResult = await (skipMaximisation ? this.fetchImageContents(url, getFilename(url), id, {}) : this.fetchMaximisedImage(url, id));
        if (!fetchResult) return;
        this.doneImages.add(fetchResult.fetchedUrl.href);
        this.doneImages.add(fetchResult.requestedUrl.href);
        this.doneImages.add(url.href);
        return {
          content: fetchResult.file,
          originalUrl: url,
          maximisedUrl: fetchResult.requestedUrl,
          fetchedUrl: fetchResult.fetchedUrl,
          wasMaximised: url.href !== fetchResult.requestedUrl.href,
          wasRedirected: fetchResult.wasRedirected
        };
      } finally {
        var _this$hooks$onFetchFi, _this$hooks2;
        (_this$hooks$onFetchFi = (_this$hooks2 = this.hooks).onFetchFinished) === null || _this$hooks$onFetchFi === void 0 || _this$hooks$onFetchFi.call(_this$hooks2, id);
      }
    }
    async fetchImagesFromProvider(_ref, provider, onlyFront) {
      let {
        url,
        types: defaultTypes,
        comment: defaultComment
      } = _ref;
      LOGGER.info(`Searching for images in ${provider.name} release…`);
      const images = await provider.findImages(url, onlyFront);
      const finalImages = onlyFront ? this.retainOnlyFront(images) : images;
      const hasMoreImages = onlyFront && images.length !== finalImages.length;
      LOGGER.info(`Found ${finalImages.length || 'no'} image(s) in ${provider.name} release`);
      const queuedResults = [];
      for (const [img, idx] of enumerate(finalImages)) {
        if (this.urlAlreadyAdded(img.url)) {
          LOGGER.warn(`${img.url} has already been added`);
          continue;
        }
        LOGGER.info(`Fetching ${img.url} (${idx + 1}/${finalImages.length})`);
        try {
          const result = await this.fetchImageFromURL(img.url, img.skipMaximisation);
          if (!result) continue;
          const fetchedImage = {
            ...result,
            types: img.types,
            comment: img.comment
          };
          const postprocessedImage = await provider.postprocessImage(fetchedImage);
          if (postprocessedImage) {
            await enqueueImage(fetchedImage, defaultTypes, defaultComment);
            queuedResults.push(postprocessedImage);
          }
        } catch (err) {
          LOGGER.warn(`Skipping ${img.url}`, err);
        }
      }
      if (!hasMoreImages && queuedResults.length === finalImages.length) {
        this.doneImages.add(url.href);
      } else if (hasMoreImages) {
        LOGGER.warn(`Not all images were fetched: ${images.length - finalImages.length} covers were skipped.`);
      }
      return {
        containerUrl: url,
        images: queuedResults
      };
    }
    retainOnlyFront(images) {
      const filtered = images.filter(img => {
        var _img$types;
        return (_img$types = img.types) === null || _img$types === void 0 ? void 0 : _img$types.includes(ArtworkTypeIDs.Front);
      });
      return filtered.length > 0 ? filtered : images.slice(0, 1);
    }
    getImageId() {
      return this.lastId++;
    }
    createUniqueFilename(filename, id, mimeType) {
      const filenameWithoutExt = filename.replace(/\.(?:png|jpe?g|gif|pdf)$/i, '');
      return `${filenameWithoutExt}.${id}.${mimeType.split('/')[1]}`;
    }
    async fetchImageContents(url, fileName, id, headers) {
      var _this$hooks$onFetchPr;
      const xhrOptions = {
        responseType: 'blob',
        headers: headers,
        onProgress: (_this$hooks$onFetchPr = this.hooks.onFetchProgress) === null || _this$hooks$onFetchPr === void 0 ? void 0 : _this$hooks$onFetchPr.bind(this.hooks, id, url)
      };
      const resp = await pRetry(() => request.get(url, xhrOptions), {
        retries: 10,
        onFailedAttempt: err => {
          if (!(err instanceof HTTPResponseError) || err.statusCode < 500 && err.statusCode !== 429) {
            throw err;
          }
          LOGGER.info(`Failed to retrieve image contents after ${err.attemptNumber} attempt(s): ${err.message}. Retrying (${err.retriesLeft} attempt(s) left)…`);
        }
      });
      if (resp.url === undefined) {
        LOGGER.warn(`Could not detect if URL ${url.href} caused a redirect`);
      }
      const fetchedUrl = new URL(resp.url || url);
      const wasRedirected = fetchedUrl.href !== url.href;
      if (wasRedirected) {
        LOGGER.warn(`Followed redirect of ${url.href} -> ${fetchedUrl.href} while fetching image contents`);
      }
      const {
        mimeType,
        isImage
      } = await this.determineMimeType(resp);
      if (!isImage) {
        if (!(mimeType !== null && mimeType !== void 0 && mimeType.startsWith('text/'))) {
          throw new Error(`Expected "${fileName}" to be an image, but received ${mimeType ?? 'unknown file type'}.`);
        }
        const candidateProvider = getProviderByDomain(url);
        if (candidateProvider !== undefined) {
          throw new Error(`This page is not (yet) supported by the ${candidateProvider.name} provider, are you sure this page corresponds to a MusicBrainz release?`);
        }
        throw new Error('Expected to receive an image, but received text. Perhaps this provider is not supported yet?');
      }
      const contentBuffer = await blobToBuffer(resp.blob);
      return {
        requestedUrl: url,
        fetchedUrl,
        wasRedirected,
        file: new File([contentBuffer], this.createUniqueFilename(fileName, id, mimeType), {
          type: mimeType
        })
      };
    }
    async determineMimeType(resp) {
      const rawFile = new File([resp.blob], 'image');
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          var _resp$headers$get;
          const Uint32Array = getFromPageContext('Uint32Array');
          const uint32view = new Uint32Array(reader.result);
          if ((uint32view[0] & 0x00FFFFFF) === 0x00FFD8FF) {
            resolve({
              mimeType: 'image/jpeg',
              isImage: true
            });
          } else {
            switch (uint32view[0]) {
              case 0x38464947:
                resolve({
                  mimeType: 'image/gif',
                  isImage: true
                });
                break;
              case 0x474E5089:
                resolve({
                  mimeType: 'image/png',
                  isImage: true
                });
                break;
              case 0x46445025:
                resolve({
                  mimeType: 'application/pdf',
                  isImage: true
                });
                break;
              default:
                resolve({
                  mimeType: (_resp$headers$get = resp.headers.get('Content-Type')) === null || _resp$headers$get === void 0 || (_resp$headers$get = _resp$headers$get.match(/[^;\s]+/)) === null || _resp$headers$get === void 0 ? void 0 : _resp$headers$get[0],
                  isImage: false
                });
            }
          }
        });
        reader.readAsArrayBuffer(rawFile.slice(0, 4));
      });
    }
    urlAlreadyAdded(url) {
      return this.doneImages.has(url.href);
    }
  }

  function encodeValue(value) {
    if (value instanceof URL) return value.href;
    if (typeof value === 'string') return value;
    return JSON.stringify(value);
  }
  function decodeSingleKeyValue(key, value, images) {
    var _key$match;
    const keyName = key.split('.').pop();
    const imageIdxString = (_key$match = key.match(/x_seed\.image\.(\d+)\./)) === null || _key$match === void 0 ? void 0 : _key$match[1];
    if (!imageIdxString || !['url', 'types', 'comment'].includes(keyName)) {
      throw new Error(`Unsupported seeded key: ${key}`);
    }
    const imageIdx = parseInt(imageIdxString);
    if (!images[imageIdx]) {
      images[imageIdx] = {};
    }
    if (keyName === 'url') {
      images[imageIdx].url = new URL(value);
    } else if (keyName === 'types') {
      const types = safeParseJSON(value);
      if (!Array.isArray(types) || types.some(type => typeof type !== 'number')) {
        throw new Error(`Invalid 'types' parameter: ${value}`);
      }
      images[imageIdx].types = types;
    } else {
      images[imageIdx].comment = value;
    }
  }
  class SeedParameters {
    constructor(images, origin) {
      _defineProperty(this, "_images", void 0);
      _defineProperty(this, "origin", void 0);
      this._images = [...(images ?? [])];
      this.origin = origin;
    }
    get images() {
      return this._images;
    }
    addImage(image) {
      this._images.push(image);
    }
    encode() {
      const seedParams = new URLSearchParams(this.images.flatMap((image, index) => Object.entries(image).map(_ref => {
        let [key, value] = _ref;
        return [`x_seed.image.${index}.${key}`, encodeValue(value)];
      })));
      if (this.origin) {
        seedParams.append('x_seed.origin', this.origin);
      }
      return seedParams;
    }
    createSeedURL(releaseId) {
      let domain = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'musicbrainz.org';
      return `https://${domain}/release/${releaseId}/add-cover-art?${this.encode()}`;
    }
    static decode(seedParams) {
      let images = [];
      seedParams.forEach((value, key) => {
        if (!key.startsWith('x_seed.image.')) return;
        try {
          decodeSingleKeyValue(key, value, images);
        } catch (err) {
          LOGGER.error(`Invalid image seeding param ${key}=${value}`, err);
        }
      });
      images = images.filter((image, index) => {
        if (image.url) {
          return true;
        } else {
          LOGGER.warn(`Ignoring seeded image ${index}: No URL provided`);
          return false;
        }
      });
      const origin = seedParams.get('x_seed.origin') ?? undefined;
      return new SeedParameters(images, origin);
    }
  }

  var css_248z = ".ROpdebee_paste_url_cont{display:inline-block;margin-left:32px;vertical-align:middle}.ROpdebee_paste_url_cont>*{display:block}.ROpdebee_paste_url_cont>label{display:inline;float:none!important}.ROpdebee_paste_url_cont>input#ROpdebee_paste_front_only{display:inline}.ROpdebee_paste_url_cont>a{font-size:smaller;text-align:right}.ROpdebee_paste_url_cont+span{margin-left:32px}.ROpdebee_import_url_buttons{margin-left:32px;vertical-align:middle}.ROpdebee_import_url_buttons>button{display:block;float:none;margin:4px}";

  const INPUT_PLACEHOLDER_TEXT = 'or paste one or more URLs here';
  class ProgressElement {
      constructor(url) {
          _defineProperty(this, 'urlSpan', void 0);
          _defineProperty(this, 'progressbar', void 0);
          _defineProperty(this, 'rootElement', void 0);
          this.urlSpan = function () {
              var $$a = document.createElement('span');
              appendChildren$1($$a, url.href);
              return $$a;
          }.call(this);
          this.progressbar = function () {
              var $$c = document.createElement('div');
              $$c.setAttribute('class', 'ui-progressbar-value ui-widget-header ui-corner-left');
              setStyles$1($$c, {
                  backgroundColor: '#cce5ff',
                  width: '0%'
              });
              appendChildren$1($$c, '\xA0');
              return $$c;
          }.call(this);
          this.rootElement = function () {
              var $$e = document.createElement('tr');
              setStyles$1($$e, { display: 'flex' });
              var $$f = document.createElement('td');
              $$f.setAttribute('class', 'uploader-preview-column');
              $$e.appendChild($$f);
              var $$g = document.createElement('div');
              $$g.setAttribute('class', 'content-loading');
              setStyles$1($$g, {
                  width: '120px',
                  height: '120px',
                  position: 'relative'
              });
              $$f.appendChild($$g);
              var $$h = document.createElement('td');
              setStyles$1($$h, { width: '65%' });
              $$e.appendChild($$h);
              var $$i = document.createElement('div');
              $$i.setAttribute('class', 'row');
              $$h.appendChild($$i);
              var $$j = document.createElement('label');
              $$i.appendChild($$j);
              var $$k = document.createTextNode('URL:');
              $$j.appendChild($$k);
              appendChildren$1($$i, this.urlSpan);
              var $$m = document.createElement('td');
              setStyles$1($$m, { flexGrow: 1 });
              $$e.appendChild($$m);
              var $$n = document.createElement('div');
              $$n.setAttribute('class', 'ui-progressbar ui-widget ui-widget-content ui-corner-all');
              $$n.setAttribute('role', 'progressbar');
              setStyles$1($$n, { width: '100%' });
              $$m.appendChild($$n);
              appendChildren$1($$n, this.progressbar);
              return $$e;
          }.call(this);
      }
      set url(url) {
          this.urlSpan.textContent = url.href;
      }
      set progress(progressPercentage) {
          this.progressbar.style.width = `${ progressPercentage * 100 }%`;
      }
  }
  function parseHTMLURLs(htmlText) {
      LOGGER.debug(`Extracting URLs from ${ htmlText }`);
      const doc = parseDOM(htmlText, document.location.origin);
      let urls = qsa('img', doc).map(img => img.src);
      if (urls.length === 0) {
          urls = qsa('a', doc).map(anchor => anchor.href);
      }
      if (urls.length === 0) {
          return parsePlainURLs(doc.textContent ?? '');
      }
      return [...new Set(urls)].filter(url => /^(?:https?|data):/.test(url));
  }
  function parsePlainURLs(text) {
      return text.trim().split(/\s+/);
  }
  class InputForm {
      constructor(app) {
          var _qs$insertAdjacentEle;
          _defineProperty(this, 'urlInput', void 0);
          _defineProperty(this, 'buttonContainer', void 0);
          _defineProperty(this, 'orSpan', void 0);
          _defineProperty(this, 'fakeSubmitButton', void 0);
          _defineProperty(this, 'realSubmitButton', void 0);
          _defineProperty(this, 'progressElements', new Map());
          insertStylesheet(css_248z);
          this.urlInput = function () {
              var $$p = document.createElement('input');
              $$p.setAttribute('type', 'url');
              $$p.setAttribute('placeholder', INPUT_PLACEHOLDER_TEXT);
              $$p.setAttribute('size', 47);
              $$p.setAttribute('id', 'ROpdebee_paste_url');
              $$p.addEventListener('paste', async evt => {
                  if (!evt.clipboardData) {
                      LOGGER.warn('No clipboard data?');
                      return;
                  }
                  const htmlText = evt.clipboardData.getData('text/html');
                  const plainText = evt.clipboardData.getData('text');
                  const urls = htmlText.length > 0 ? parseHTMLURLs(htmlText) : parsePlainURLs(plainText);
                  evt.preventDefault();
                  evt.currentTarget.placeholder = urls.join('\n');
                  const inputUrls = filterNonNull(urls.map(inputUrl => {
                      try {
                          return new URL(inputUrl);
                      } catch (err) {
                          LOGGER.error(`Invalid URL: ${ inputUrl }`, err);
                          return null;
                      }
                  }));
                  if (inputUrls.length === 0) {
                      LOGGER.info('No URLs found in input');
                      return;
                  }
                  await app.processURLs(inputUrls);
                  app.clearLogLater();
                  if (this.urlInput.placeholder === urls.join('\n')) {
                      this.urlInput.placeholder = INPUT_PLACEHOLDER_TEXT;
                  }
              });
              return $$p;
          }.call(this);
          const [onlyFrontCheckbox, onlyFrontLabel] = createPersistentCheckbox('ROpdebee_paste_front_only', 'Fetch front image only', evt => {
              var _evt$currentTarget;
              app.onlyFront = (((_evt$currentTarget = evt.currentTarget) === null || _evt$currentTarget === void 0) ? void 0 : _evt$currentTarget.checked) ?? false;
          });
          app.onlyFront = onlyFrontCheckbox.checked;
          const container = function () {
              var $$q = document.createElement('div');
              $$q.setAttribute('class', 'ROpdebee_paste_url_cont');
              appendChildren$1($$q, this.urlInput);
              var $$s = document.createElement('a');
              $$s.setAttribute('href', 'https://github.com/ROpdebee/mb-userscripts/blob/main/src/mb_enhanced_cover_art_uploads/docs/supported_providers.md');
              $$s.setAttribute('target', '_blank');
              $$q.appendChild($$s);
              var $$t = document.createTextNode('\n                Supported providers\n            ');
              $$s.appendChild($$t);
              appendChildren$1($$q, onlyFrontCheckbox);
              appendChildren$1($$q, onlyFrontLabel);
              return $$q;
          }.call(this);
          this.buttonContainer = function () {
              var $$w = document.createElement('div');
              $$w.setAttribute('class', 'ROpdebee_import_url_buttons buttons');
              return $$w;
          }.call(this);
          this.orSpan = function () {
              var $$x = document.createElement('span');
              setStyles$1($$x, { display: 'none' });
              var $$y = document.createTextNode('or');
              $$x.appendChild($$y);
              return $$x;
          }.call(this);
          (_qs$insertAdjacentEle = qs('#drop-zone').insertAdjacentElement('afterend', container)) === null || _qs$insertAdjacentEle === void 0 || (_qs$insertAdjacentEle = _qs$insertAdjacentEle.insertAdjacentElement('afterend', this.orSpan)) === null || _qs$insertAdjacentEle === void 0 || _qs$insertAdjacentEle.insertAdjacentElement('afterend', this.buttonContainer);
          this.realSubmitButton = qs('button#add-cover-art-submit');
          this.fakeSubmitButton = function () {
              var $$z = document.createElement('button');
              $$z.setAttribute('type', 'button');
              $$z.setAttribute('class', 'submit positive');
              $$z.disabled = true;
              $$z.setAttribute('hidden', true);
              var $$aa = document.createTextNode('\n            Enter edit\n        ');
              $$z.appendChild($$aa);
              return $$z;
          }.call(this);
          qs('form > .buttons').append(this.fakeSubmitButton);
      }
      async addImportButton(onClickCallback, url, provider) {
          const favicon = await provider.favicon;
          const button = function () {
              var $$bb = document.createElement('button');
              $$bb.setAttribute('type', 'button');
              $$bb.setAttribute('title', url);
              $$bb.addEventListener('click', evt => {
                  evt.preventDefault();
                  onClickCallback();
              });
              var $$cc = document.createElement('img');
              $$cc.setAttribute('src', favicon);
              $$cc.setAttribute('alt', provider.name);
              $$bb.appendChild($$cc);
              var $$dd = document.createElement('span');
              $$bb.appendChild($$dd);
              appendChildren$1($$dd, 'Import from ' + provider.name);
              return $$bb;
          }.call(this);
          this.orSpan.style.display = '';
          this.buttonContainer.insertAdjacentElement('beforeend', button);
      }
      disableSubmissions() {
          this.realSubmitButton.hidden = true;
          this.fakeSubmitButton.hidden = false;
      }
      enableSubmissions() {
          this.realSubmitButton.hidden = false;
          this.fakeSubmitButton.hidden = true;
      }
      onFetchStarted(id, url) {
          const progressElement = new ProgressElement(url);
          this.progressElements.set(id, progressElement);
          qs('form#add-cover-art tbody').append(progressElement.rootElement);
      }
      onFetchFinished(id) {
          const progressElement = this.progressElements.get(id);
          progressElement === null || progressElement === void 0 || progressElement.rootElement.remove();
          this.progressElements.delete(id);
      }
      onFetchProgress(id, url, progress) {
          const progressElement = this.progressElements.get(id);
          assertDefined(progressElement);
          progressElement.url = url;
          if (progress.lengthComputable && progress.total > 0) {
              progressElement.progress = progress.loaded / progress.total;
          }
      }
  }

  class App {
    constructor() {
      _defineProperty(this, "note", void 0);
      _defineProperty(this, "fetcher", void 0);
      _defineProperty(this, "ui", void 0);
      _defineProperty(this, "urlsInProgress", void 0);
      _defineProperty(this, "loggingSink", new GuiSink());
      _defineProperty(this, "fetchingSema", void 0);
      _defineProperty(this, "onlyFront", false);
      this.note = EditNote.withFooterFromGMInfo();
      this.urlsInProgress = new Set();
      LOGGER.addSink(this.loggingSink);
      qs('.add-files').insertAdjacentElement('afterend', this.loggingSink.rootElement);
      this.fetchingSema = new ObservableSemaphore({
        onAcquired: () => {
          this.ui.disableSubmissions();
        },
        onReleased: () => {
          this.ui.enableSubmissions();
        }
      });
      this.ui = new InputForm(this);
      this.fetcher = new ImageFetcher(this.ui);
    }
    async processURLs(urls) {
      return this._processURLs(urls.map(url => ({
        url
      })));
    }
    clearLogLater() {
      this.loggingSink.clearAllLater();
    }
    async _processURLs(coverArts, origin) {
      const batches = await this.fetchingSema.runInSection(async () => {
        const fetchedBatches = [];
        for (const [coverArt, idx] of enumerate(coverArts)) {
          if (this.urlsInProgress.has(coverArt.url.href)) {
            continue;
          }
          this.urlsInProgress.add(coverArt.url.href);
          if (coverArts.length > 1) {
            LOGGER.info(`Fetching ${coverArt.url} (${idx + 1}/${coverArts.length})`);
          } else {
            LOGGER.info(`Fetching ${coverArt.url}`);
          }
          try {
            const fetchResult = await this.fetcher.fetchImages(coverArt, this.onlyFront);
            fetchedBatches.push(fetchResult);
          } catch (err) {
            LOGGER.error('Failed to fetch or enqueue images', err);
          }
          this.urlsInProgress.delete(coverArt.url.href);
        }
        return fetchedBatches;
      });
      fillEditNote(batches, origin ?? '', this.note);
      const totalNumImages = batches.reduce((acc, batch) => acc + batch.images.length, 0);
      if (totalNumImages > 0) {
        LOGGER.success(`Successfully added ${totalNumImages} image(s)`);
      }
    }
    async processSeedingParameters() {
      const params = SeedParameters.decode(new URLSearchParams(document.location.search));
      await this._processURLs(params.images, params.origin);
      this.clearLogLater();
    }
    async addImportButtons() {
      var _window$location$href;
      const mbid = (_window$location$href = window.location.href.match(/musicbrainz\.org\/release\/([a-f\d-]+)\//)) === null || _window$location$href === void 0 ? void 0 : _window$location$href[1];
      assertHasValue(mbid);
      const attachedURLs = await getURLsForRelease(mbid, {
        excludeEnded: true,
        excludeDuplicates: true
      });
      const supportedURLs = attachedURLs.filter(url => {
        var _getProvider;
        return (_getProvider = getProvider(url)) === null || _getProvider === void 0 ? void 0 : _getProvider.allowButtons;
      });
      if (supportedURLs.length === 0) return;
      const syncProcessURL = url => {
        void pFinally(this.processURLs([url]).catch(err => {
          LOGGER.error(`Failed to process URL ${url.href}`, err);
        }), this.clearLogLater.bind(this));
      };
      await Promise.all(supportedURLs.map(url => {
        const provider = getProvider(url);
        assertHasValue(provider);
        return this.ui.addImportButton(syncProcessURL.bind(this, url), url.href, provider);
      }));
    }
  }

  class BaseImage {
    constructor(imgUrl, cache, cacheKey) {
      _defineProperty(this, "imgUrl", void 0);
      _defineProperty(this, "cacheKey", void 0);
      _defineProperty(this, "cache", void 0);
      this.imgUrl = imgUrl;
      this.cacheKey = cacheKey ?? imgUrl;
      this.cache = cache;
    }
    async getDimensions() {
      try {
        var _this$cache;
        const cachedResult = await ((_this$cache = this.cache) === null || _this$cache === void 0 ? void 0 : _this$cache.getDimensions(this.cacheKey));
        if (cachedResult !== undefined) {
          return cachedResult;
        }
      } catch (err) {
        LOGGER.warn('Failed to retrieve image dimensions from cache', err);
      }
      try {
        var _this$cache2;
        const liveResult = await getImageDimensions(this.imgUrl);
        await ((_this$cache2 = this.cache) === null || _this$cache2 === void 0 ? void 0 : _this$cache2.putDimensions(this.cacheKey, liveResult));
        return liveResult;
      } catch (err) {
        LOGGER.error('Failed to retrieve image dimensions', err);
      }
      return undefined;
    }
    async getFileInfo() {
      try {
        var _this$cache3;
        const cachedResult = await ((_this$cache3 = this.cache) === null || _this$cache3 === void 0 ? void 0 : _this$cache3.getFileInfo(this.cacheKey));
        if (cachedResult !== undefined) {
          return cachedResult;
        }
      } catch (err) {
        LOGGER.warn('Failed to retrieve image file info from cache', err);
      }
      try {
        var _this$cache4;
        const liveResult = await this.loadFileInfo();
        await ((_this$cache4 = this.cache) === null || _this$cache4 === void 0 ? void 0 : _this$cache4.putFileInfo(this.cacheKey, liveResult));
        return liveResult;
      } catch (err) {
        LOGGER.error('Failed to retrieve image file info', err);
      }
      return undefined;
    }
    async getImageInfo() {
      const dimensions = await this.getDimensions();
      const fileInfo = await this.getFileInfo();
      return {
        dimensions,
        ...(fileInfo ?? {
          size: undefined,
          fileType: undefined
        })
      };
    }
  }

  const MAX_CACHED_IMAGES = 30;
  const CACHE_LOCALSTORAGE_KEY = 'ROpdebee_dimensions_cache';
  const localStorageCache = {
    getStore: function () {
      const rawStore = localStorage.getItem(CACHE_LOCALSTORAGE_KEY) ?? '{}';
      let store = this.deserializeStore(rawStore);
      if (!store) {
        LOGGER.warn('Cache was malformed, resetting');
        store = this.createEmptyStore();
        this.putStore(store);
      }
      return store;
    },
    putStore: function (store) {
      localStorage.setItem(CACHE_LOCALSTORAGE_KEY, this.serializeStore(store));
    },
    createEmptyStore: function () {
      return new Map();
    },
    serializeStore: function (store) {
      return JSON.stringify(Object.fromEntries(store.entries()));
    },
    deserializeStore: function (rawStore) {
      const rawObject = safeParseJSON(rawStore);
      return rawObject && new Map(Object.entries(rawObject));
    },
    getInfo: function (imageUrl) {
      return this.getStore().get(imageUrl);
    },
    putInfo: function (imageUrl, cacheEntry) {
      const store = this.getStore();
      if (store.size >= MAX_CACHED_IMAGES) {
        const entries = [...store.entries()];
        entries.sort((_ref, _ref2) => {
          let [, info1] = _ref;
          let [, info2] = _ref2;
          return info2.addedDatetime - info1.addedDatetime;
        });
        for (const [url] of entries.slice(MAX_CACHED_IMAGES - 1)) {
          store.delete(url);
        }
      }
      store.set(imageUrl, {
        ...cacheEntry,
        addedDatetime: Date.now()
      });
      this.putStore(store);
    },
    getDimensions: function (imageUrl) {
      var _this$getInfo;
      return Promise.resolve((_this$getInfo = this.getInfo(imageUrl)) === null || _this$getInfo === void 0 ? void 0 : _this$getInfo.dimensions);
    },
    getFileInfo: function (imageUrl) {
      var _this$getInfo2;
      return Promise.resolve((_this$getInfo2 = this.getInfo(imageUrl)) === null || _this$getInfo2 === void 0 ? void 0 : _this$getInfo2.fileInfo);
    },
    putDimensions: function (imageUrl, dimensions) {
      const prevEntry = this.getInfo(imageUrl);
      this.putInfo(imageUrl, {
        ...prevEntry,
        dimensions
      });
      return Promise.resolve();
    },
    putFileInfo: function (imageUrl, fileInfo) {
      const prevEntry = this.getInfo(imageUrl);
      this.putInfo(imageUrl, {
        ...prevEntry,
        fileInfo
      });
      return Promise.resolve();
    }
  };
  class AtisketImage extends BaseImage {
    constructor(imgUrl) {
      super(imgUrl, localStorageCache);
    }
    async loadFileInfo() {
      var _resp$headers$get, _resp$headers$get2;
      const resp = await pRetry(() => request.head(this.imgUrl), {
        retries: 5,
        onFailedAttempt: err => {
          if (err instanceof HTTPResponseError && err.statusCode < 500 && err.statusCode !== 429) {
            throw err;
          }
          LOGGER.warn(`Failed to retrieve image file info: ${err.message}. Retrying…`);
        }
      });
      const fileSize = (_resp$headers$get = resp.headers.get('Content-Length')) === null || _resp$headers$get === void 0 || (_resp$headers$get = _resp$headers$get.match(/\d+/)) === null || _resp$headers$get === void 0 ? void 0 : _resp$headers$get[0];
      const fileType = (_resp$headers$get2 = resp.headers.get('Content-Type')) === null || _resp$headers$get2 === void 0 || (_resp$headers$get2 = _resp$headers$get2.match(/\w+\/(\w+)/)) === null || _resp$headers$get2 === void 0 ? void 0 : _resp$headers$get2[1];
      return {
        fileType: fileType === null || fileType === void 0 ? void 0 : fileType.toUpperCase(),
        size: fileSize ? parseInt(fileSize) : undefined
      };
    }
  }

  const AtisketSeeder = {
      supportedDomains: [
          'atisket.pulsewidth.org.uk',
          'etc.marlonob.info'
      ],
      supportedRegexes: [/(?:\.uk|\.info\/atisket)\/\?.+/],
      insertSeedLinks() {
          addDimensionsToCovers();
          const alreadyInMBItems = qsa('.already-in-mb-item');
          if (alreadyInMBItems.length === 0) {
              return;
          }
          const mbids = alreadyInMBItems.map(alreadyInMB => {
              var _qs$textContent;
              return encodeURIComponent((((_qs$textContent = qs('a.mb', alreadyInMB).textContent) === null || _qs$textContent === void 0) ? void 0 : _qs$textContent.trim()) ?? '');
          }).filter(Boolean);
          const cachedAnchor = qsMaybe('#submit-button + div > a');
          addSeedLinkToCovers(mbids, ((cachedAnchor === null || cachedAnchor === void 0) ? void 0 : cachedAnchor.href) ?? document.location.href);
      }
  };
  const AtasketSeeder = {
      supportedDomains: [
          'atisket.pulsewidth.org.uk',
          'etc.marlonob.info'
      ],
      supportedRegexes: [/(?:\.uk|\.info\/atisket)\/atasket\.php\?/],
      insertSeedLinks() {
          addDimensionsToCovers();
          const urlParams = new URLSearchParams(document.location.search);
          const mbid = urlParams.get('release_mbid');
          const selfId = urlParams.get('self_id');
          if (!mbid || !selfId) {
              LOGGER.error('Cannot extract IDs! Seeding is disabled :(');
              return;
          }
          const cachedUrl = document.location.origin + '/?cached=' + selfId;
          addSeedLinkToCovers([mbid], cachedUrl);
      }
  };
  function addSeedLinkToCovers(mbids, origin) {
      const covers = qsa('figure.cover');
      for (const fig of covers) {
          addSeedLinkToCover(fig, mbids, origin);
      }
  }
  function addDimensionsToCovers() {
      const covers = qsa('figure.cover');
      for (const fig of covers) {
          logFailure(addDimensions(fig), 'Failed to insert image information');
      }
  }
  function tryExtractReleaseUrl(fig) {
      var _fig$closest;
      const countryCode = (_fig$closest = fig.closest('div')) === null || _fig$closest === void 0 ? void 0 : _fig$closest.dataset.matchedCountry;
      const vendorId = fig.dataset.vendorId;
      const vendorCode = [...fig.classList].find(klass => [
          'spf',
          'deez',
          'itu'
      ].includes(klass));
      if (!vendorCode || !vendorId || typeof countryCode !== 'string' || vendorCode === 'itu' && countryCode === '') {
          LOGGER.error('Could not extract required data for ' + fig.classList.value);
          return;
      }
      return RELEASE_URL_CONSTRUCTORS[vendorCode](vendorId, countryCode);
  }
  function addSeedLinkToCover(fig, mbids, origin) {
      const imageUrl = qs('a.icon', fig).href;
      const realUrl = tryExtractReleaseUrl(fig) ?? imageUrl;
      const params = new SeedParameters([{ url: new URL(realUrl) }], origin);
      for (const mbid of mbids) {
          const seedUrl = params.createSeedURL(mbid);
          const seedLink = function () {
              var $$a = document.createElement('a');
              $$a.setAttribute('href', seedUrl);
              setStyles$1($$a, { display: 'block' });
              var $$b = document.createTextNode('\n            Add to release ');
              $$a.appendChild($$b);
              appendChildren$1($$a, mbids.length > 1 ? mbid.split('-')[0] : '');
              return $$a;
          }.call(this);
          qs('figcaption', fig).insertAdjacentElement('beforeend', seedLink);
      }
  }
  async function addDimensions(fig) {
      const imageUrl = qs('a.icon', fig).href;
      const dimSpan = function () {
          var $$d = document.createElement('span');
          setStyles$1($$d, { display: 'block' });
          var $$e = document.createTextNode('\n        loading\u2026\n    ');
          $$d.appendChild($$e);
          return $$d;
      }.call(this);
      qs('figcaption > a', fig).insertAdjacentElement('afterend', dimSpan);
      const imageInfo = await getImageInfo(imageUrl);
      const infoStringParts = [
          imageInfo.dimensions ? `${ imageInfo.dimensions.width }x${ imageInfo.dimensions.height }` : '',
          imageInfo.size !== undefined ? formatFileSize(imageInfo.size) : '',
          imageInfo.fileType
      ];
      const infoString = infoStringParts.filter(Boolean).join(', ');
      if (infoString) {
          dimSpan.textContent = infoString;
      } else {
          dimSpan.remove();
      }
  }
  async function getImageInfo(imageUrl) {
      for await (const maxCandidate of getMaximisedCandidates(new URL(imageUrl))) {
          if (maxCandidate.likely_broken)
              continue;
          LOGGER.debug(`Trying to get image information for maximised candidate ${ maxCandidate.url }`);
          const atisketImage = new AtisketImage(maxCandidate.url.toString());
          const fileInfo = await atisketImage.getFileInfo();
          const dimensions = fileInfo && await atisketImage.getDimensions();
          if (!dimensions) {
              LOGGER.warn(`Failed to load dimensions for maximised candidate ${ maxCandidate.url }`);
              continue;
          }
          return {
              dimensions,
              ...fileInfo
          };
      }
      return new AtisketImage(imageUrl).getImageInfo();
  }
  const RELEASE_URL_CONSTRUCTORS = {
      itu: (id, country) => `https://music.apple.com/${ country.toLowerCase() }/album/${ id }`,
      deez: id => 'https://www.deezer.com/album/' + id,
      spf: id => 'https://open.spotify.com/album/' + id
  };

  function seederSupportsURL(seeder, url) {
    return seeder.supportedDomains.includes(url.hostname.replace(/^www\./, '')) && seeder.supportedRegexes.some(rgx => rgx.test(url.href));
  }
  const SEEDER_DISPATCH_MAP = new Map();
  function registerSeeder(seeder) {
    seeder.supportedDomains.forEach(domain => {
      if (!SEEDER_DISPATCH_MAP.has(domain)) {
        SEEDER_DISPATCH_MAP.set(domain, []);
      }
      SEEDER_DISPATCH_MAP.get(domain).push(seeder);
    });
  }
  function seederFactory(url) {
    var _SEEDER_DISPATCH_MAP$;
    return (_SEEDER_DISPATCH_MAP$ = SEEDER_DISPATCH_MAP.get(url.hostname.replace(/^www\./, ''))) === null || _SEEDER_DISPATCH_MAP$ === void 0 ? void 0 : _SEEDER_DISPATCH_MAP$.find(seeder => seederSupportsURL(seeder, url));
  }

  const MusicBrainzSeeder = {
      supportedDomains: [
          'musicbrainz.org',
          'beta.musicbrainz.org'
      ],
      supportedRegexes: [/release\/[a-f\d-]{36}\/cover-art/],
      async insertSeedLinks() {
          var _window$location$href;
          const mbid = (_window$location$href = window.location.href.match(/musicbrainz\.org\/release\/([a-f\d-]+)\//)) === null || _window$location$href === void 0 ? void 0 : _window$location$href[1];
          assertHasValue(mbid);
          const attachedURLs = await getURLsForRelease(mbid, {
              excludeEnded: true,
              excludeDuplicates: true
          });
          const buttons = await Promise.all(attachedURLs.map(async url => {
              const provider = getProvider(url);
              if (!(provider !== null && provider !== void 0 && provider.allowButtons))
                  return;
              const favicon = await provider.favicon;
              const seedUrl = new SeedParameters([{ url }]).createSeedURL(mbid, window.location.host);
              return function () {
                  var $$a = document.createElement('a');
                  $$a.setAttribute('title', url.href);
                  $$a.setAttribute('href', seedUrl);
                  var $$b = document.createElement('img');
                  $$b.setAttribute('src', favicon);
                  $$b.setAttribute('alt', provider.name);
                  $$a.appendChild($$b);
                  var $$c = document.createElement('span');
                  $$a.appendChild($$c);
                  appendChildren$1($$c, 'Import from ' + provider.name);
                  return $$a;
              }.call(this);
          }));
          const buttonRow = qs('#content > .buttons');
          filterNonNull(buttons).forEach(buttonRow.appendChild.bind(buttonRow));
      }
  };

  const VGMdbSeeder = {
      supportedDomains: ['vgmdb.net'],
      supportedRegexes: [/\/album\/(\d+)(?:\/|#|\?|$)/],
      async insertSeedLinks() {
          var _qsMaybe;
          if (!isLoggedIn()) {
              return;
          }
          const coverHeading = (_qsMaybe = qsMaybe('#covernav')) === null || _qsMaybe === void 0 ? void 0 : _qsMaybe.parentElement;
          if (!coverHeading) {
              LOGGER.info('No covers in release, not inserting seeding menu');
              return;
          }
          const releaseIdsProm = getMBReleases();
          const coversProm = extractCovers();
          try {
              const [releaseIds, covers] = await Promise.all([
                  releaseIdsProm,
                  coversProm
              ]);
              insertSeedButtons(coverHeading, releaseIds, covers);
          } catch (err) {
              LOGGER.error('Failed to insert seed links', err);
          }
      }
  };
  function isLoggedIn() {
      return qsMaybe('#navmember') !== null;
  }
  function getMBReleases() {
      const releaseUrl = 'https://vgmdb.net' + document.location.pathname;
      return getReleaseIDsForURL(releaseUrl);
  }
  async function extractCovers() {
      const covers = await VGMdbProvider.extractCoversFromDOMGallery(qs('#cover_gallery'));
      const publicCovers = await new VGMdbProvider().findImagesWithApi(new URL(document.location.href));
      const publicCoverURLs = new Set(publicCovers.map(cover => cover.url.href));
      const result = {
          allCovers: covers,
          privateCovers: covers.filter(cover => !publicCoverURLs.has(cover.url.href))
      };
      return result;
  }
  function insertSeedButtons(coverHeading, releaseIds, covers) {
      var _coverHeading$nextEle;
      const seedParamsPrivate = new SeedParameters(covers.privateCovers, document.location.href);
      const seedParamsAll = new SeedParameters(covers.allCovers, document.location.href);
      const relIdToAnchors = new Map(releaseIds.map(relId => {
          const a = function () {
              var $$a = document.createElement('a');
              $$a.setAttribute('href', seedParamsPrivate.createSeedURL(relId));
              $$a.setAttribute('target', '_blank');
              $$a.setAttribute('rel', 'noopener noreferrer');
              setStyles$1($$a, { display: 'block' });
              appendChildren$1($$a, 'Seed covers to ' + relId.split('-')[0]);
              return $$a;
          }.call(this);
          return [
              relId,
              a
          ];
      }));
      const anchors = [...relIdToAnchors.values()];
      const inclPublicCheckbox = function () {
          var $$c = document.createElement('input');
          $$c.setAttribute('type', 'checkbox');
          $$c.setAttribute('id', 'ROpdebee_incl_public_checkbox');
          $$c.addEventListener('change', evt => {
              relIdToAnchors.forEach((a, relId) => {
                  const seedParams = evt.currentTarget.checked ? seedParamsAll : seedParamsPrivate;
                  a.href = seedParams.createSeedURL(relId);
              });
          });
          return $$c;
      }.call(this);
      const inclPublicLabel = function () {
          var $$d = document.createElement('label');
          $$d.setAttribute('for', 'ROpdebee_incl_public_checkbox');
          $$d.setAttribute('title', 'Leave this unchecked to only seed covers which cannot be extracted by the VGMdb provider');
          setStyles$1($$d, { cursor: 'help' });
          var $$e = document.createTextNode('Include publicly accessible covers');
          $$d.appendChild($$e);
          return $$d;
      }.call(this);
      const containedElements = [
          inclPublicCheckbox,
          inclPublicLabel,
          ...anchors
      ];
      if (anchors.length === 0) {
          containedElements.push(function () {
              var $$f = document.createElement('span');
              setStyles$1($$f, { display: 'block' });
              var $$g = document.createTextNode('\n            This album is not linked to any MusicBrainz releases!\n        ');
              $$f.appendChild($$g);
              return $$f;
          }.call(this));
      }
      const container = function () {
          var $$h = document.createElement('div');
          setStyles$1($$h, {
              padding: '8px 8px 0px 8px',
              fontSize: '8pt'
          });
          appendChildren$1($$h, containedElements);
          return $$h;
      }.call(this);
      (_coverHeading$nextEle = coverHeading.nextElementSibling) === null || _coverHeading$nextEle === void 0 || _coverHeading$nextEle.insertAdjacentElement('afterbegin', container);
  }

  registerSeeder(AtisketSeeder);
  registerSeeder(AtasketSeeder);
  registerSeeder(MusicBrainzSeeder);
  registerSeeder(VGMdbSeeder);

  if (document.location.hostname === 'musicbrainz.org' || document.location.hostname.endsWith('.musicbrainz.org')) {
      onDocumentLoaded(maybeDisplayNewFeatures);
  }

  const seeder = seederFactory(document.location);
  if (seeder) {
    Promise.resolve(seeder.insertSeedLinks()).catch(err => {
      LOGGER.error('Failed to add seeding links', err);
    });
  } else if (document.location.hostname === 'musicbrainz.org' || document.location.hostname.endsWith('.musicbrainz.org')) {
    const app = new App();
    app.processSeedingParameters().catch(err => {
      LOGGER.error('Failed to process seeded cover art parameters', err);
    });
    app.addImportButtons().catch(err => {
      LOGGER.error('Failed to add some provider import buttons', err);
    });
  } else {
    LOGGER.error('Somehow I am running on a page I do not support…');
  }

})();
