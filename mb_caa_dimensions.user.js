// ==UserScript==
// @name         MB: Display CAA image dimensions
// @description  Displays the dimensions and size of images in the cover art archive.
// @version      2026.2.19
// @author       ROpdebee
// @license      MIT; https://opensource.org/licenses/MIT
// @namespace    https://github.com/ROpdebee/mb-userscripts
// @homepageURL  https://github.com/ROpdebee/mb-userscripts
// @supportURL   https://github.com/ROpdebee/mb-userscripts/issues
// @downloadURL  https://raw.github.com/ROpdebee/mb-userscripts/dist/mb_caa_dimensions.user.js
// @updateURL    https://raw.github.com/ROpdebee/mb-userscripts/dist/mb_caa_dimensions.meta.js
// @match        *://*.musicbrainz.org/event/*
// @match        *://*.musicbrainz.org/release/*
// @match        *://*.musicbrainz.org/release-group/*
// @match        *://*.musicbrainz.org/edit/*
// @match        *://*.musicbrainz.org/*/edits*
// @match        *://*.musicbrainz.org/user/*/votes
// @match        *://*.musicbrainz.org/*/open_edits
// @exclude      *://*.musicbrainz.org/event/*/edit
// @exclude      *://*.musicbrainz.org/release/*/edit
// @exclude      *://*.musicbrainz.org/release/*/edit-relationships
// @exclude      *://*.musicbrainz.org/release-group/*/edit
// @run-at       document-start
// @grant        none
// ==/UserScript==

// For original source code, see https://github.com/ROpdebee/mb-userscripts/tree/main/src/mb_caa_dimensions
(function () {
  'use strict';

  /* minified: babel helpers, nativejsx, retry, is-network-error, p-retry, ts-custom-error, idb */
  function _defineProperty(e,t,r){return (t=_toPropertyKey(t))in e?Object.defineProperty(e,t,{value:r,enumerable:true,configurable:true,writable:true}):e[t]=r,e}function _toPrimitive(e,t){if("object"!=typeof e||!e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var o=r.call(e,t);if("object"!=typeof o)return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return ("string"===t?String:Number)(e)}function _toPropertyKey(e){var t=_toPrimitive(e,"string");return "symbol"==typeof t?t:t+""}function getDefaultExportFromCjs(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var appendChildren$1,hasRequiredAppendChildren;function requireAppendChildren(){return hasRequiredAppendChildren?appendChildren$1:(hasRequiredAppendChildren=1,appendChildren$1=function(e,t){(t=Array.isArray(t)?t:[t]).forEach((function(t){t instanceof HTMLElement?e.appendChild(t):(t||"string"==typeof t)&&e.appendChild(document.createTextNode(t.toString()));}));})}var retry_operation,hasRequiredRetry_operation,hasRequiredRetry$1,retry$1,hasRequiredRetry,appendChildrenExports=requireAppendChildren(),appendChildren=getDefaultExportFromCjs(appendChildrenExports),retry$2={};function requireRetry_operation(){if(hasRequiredRetry_operation)return retry_operation;function e(e,t){"boolean"==typeof t&&(t={forever:t}),this._originalTimeouts=JSON.parse(JSON.stringify(e)),this._timeouts=e,this._options=t||{},this._maxRetryTime=t&&t.maxRetryTime||1/0,this._fn=null,this._errors=[],this._attempts=1,this._operationTimeout=null,this._operationTimeoutCb=null,this._timeout=null,this._operationStart=null,this._timer=null,this._options.forever&&(this._cachedTimeouts=this._timeouts.slice(0));}return hasRequiredRetry_operation=1,retry_operation=e,e.prototype.reset=function(){this._attempts=1,this._timeouts=this._originalTimeouts.slice(0);},e.prototype.stop=function(){this._timeout&&clearTimeout(this._timeout),this._timer&&clearTimeout(this._timer),this._timeouts=[],this._cachedTimeouts=null;},e.prototype.retry=function(e){if(this._timeout&&clearTimeout(this._timeout),!e)return  false;var t=(new Date).getTime();if(e&&t-this._operationStart>=this._maxRetryTime)return this._errors.push(e),this._errors.unshift(new Error("RetryOperation timeout occurred")),false;this._errors.push(e);var r=this._timeouts.shift();if(void 0===r){if(!this._cachedTimeouts)return  false;this._errors.splice(0,this._errors.length-1),r=this._cachedTimeouts.slice(-1);}var o=this;return this._timer=setTimeout((function(){o._attempts++,o._operationTimeoutCb&&(o._timeout=setTimeout((function(){o._operationTimeoutCb(o._attempts);}),o._operationTimeout),o._options.unref&&o._timeout.unref()),o._fn(o._attempts);}),r),this._options.unref&&this._timer.unref(),true},e.prototype.attempt=function(e,t){this._fn=e,t&&(t.timeout&&(this._operationTimeout=t.timeout),t.cb&&(this._operationTimeoutCb=t.cb));var r=this;this._operationTimeoutCb&&(this._timeout=setTimeout((function(){r._operationTimeoutCb();}),r._operationTimeout)),this._operationStart=(new Date).getTime(),this._fn(this._attempts);},e.prototype.try=function(e){console.log("Using RetryOperation.try() is deprecated"),this.attempt(e);},e.prototype.start=function(e){console.log("Using RetryOperation.start() is deprecated"),this.attempt(e);},e.prototype.start=e.prototype.try,e.prototype.errors=function(){return this._errors},e.prototype.attempts=function(){return this._attempts},e.prototype.mainError=function(){if(0===this._errors.length)return null;for(var e={},t=null,r=0,o=0;o<this._errors.length;o++){var n=this._errors[o],i=n.message,a=(e[i]||0)+1;e[i]=a,a>=r&&(t=n,r=a);}return t},retry_operation}function requireRetry$1(){return hasRequiredRetry$1||(hasRequiredRetry$1=1,e=retry$2,t=requireRetry_operation(),e.operation=function(r){var o=e.timeouts(r);return new t(o,{forever:r&&(r.forever||r.retries===1/0),unref:r&&r.unref,maxRetryTime:r&&r.maxRetryTime})},e.timeouts=function(e){if(e instanceof Array)return [].concat(e);var t={retries:10,factor:2,minTimeout:1e3,maxTimeout:1/0,randomize:false};for(var r in e)t[r]=e[r];if(t.minTimeout>t.maxTimeout)throw new Error("minTimeout is greater than maxTimeout");for(var o=[],n=0;n<t.retries;n++)o.push(this.createTimeout(n,t));return e&&e.forever&&!o.length&&o.push(this.createTimeout(n,t)),o.sort((function(e,t){return e-t})),o},e.createTimeout=function(e,t){var r=t.randomize?Math.random()+1:1,o=Math.round(r*Math.max(t.minTimeout,1)*Math.pow(t.factor,e));return Math.min(o,t.maxTimeout)},e.wrap=function(t,r,o){if(r instanceof Array&&(o=r,r=null),!o)for(var n in o=[],t)"function"==typeof t[n]&&o.push(n);for(var i=0;i<o.length;i++){var a=o[i],s=t[a];t[a]=function(o){var n=e.operation(r),i=Array.prototype.slice.call(arguments,1),a=i.pop();i.push((function(e){n.retry(e)||(e&&(arguments[0]=n.mainError()),a.apply(this,arguments));})),n.attempt((function(){o.apply(t,i);}));}.bind(t,s),t[a].options=r;}}),retry$2;var e,t;}function requireRetry(){return hasRequiredRetry?retry$1:(hasRequiredRetry=1,retry$1=requireRetry$1())}var retryExports=requireRetry(),retry=getDefaultExportFromCjs(retryExports);const objectToString=Object.prototype.toString,isError=e=>"[object Error]"===objectToString.call(e),errorMessages=new Set(["network error","Failed to fetch","NetworkError when attempting to fetch resource.","The Internet connection appears to be offline.","Load failed","Network request failed","fetch failed","terminated"]);function isNetworkError(e){return !(!e||!isError(e)||"TypeError"!==e.name||"string"!=typeof e.message)&&("Load failed"===e.message?void 0===e.stack:errorMessages.has(e.message))}class AbortError extends Error{constructor(e){super(),e instanceof Error?(this.originalError=e,({message:e}=e)):(this.originalError=new Error(e),this.originalError.stack=this.stack),this.name="AbortError",this.message=e;}}const decorateErrorWithCounts=(e,t,r)=>{const o=r.retries-(t-1);return e.attemptNumber=t,e.retriesLeft=o,e};async function pRetry(e,t){return new Promise(((r,o)=>{t={...t},t.onFailedAttempt??=()=>{},t.shouldRetry??=()=>true,t.retries??=10;const n=retry.operation(t),i=()=>{var e;n.stop(),o(null===(e=t.signal)||void 0===e?void 0:e.reason);};t.signal&&!t.signal.aborted&&t.signal.addEventListener("abort",i,{once:true});const a=()=>{var e;null===(e=t.signal)||void 0===e||e.removeEventListener("abort",i),n.stop();};n.attempt((async i=>{try{const t=await e(i);a(),r(t);}catch(s){try{if(!(s instanceof Error))throw new TypeError(`Non-error was thrown: "${s}". You should only throw errors.`);if(s instanceof AbortError)throw s.originalError;if(s instanceof TypeError&&!isNetworkError(s))throw s;if(decorateErrorWithCounts(s,i,t),await t.shouldRetry(s)||(n.stop(),o(s)),await t.onFailedAttempt(s),!n.retry(s))throw n.mainError()}catch(u){decorateErrorWithCounts(u,i,t),a(),o(u);}}}));}))}function fixProto(e,t){var r=Object.setPrototypeOf;r?r(e,t):e.__proto__=t;}function fixStack(e,t){ void 0===t&&(t=e.constructor);var r=Error.captureStackTrace;r&&r(e,t);}var __extends=function(){var e=function(t,r){return e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t;}||function(e,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);},e(t,r)};return function(t,r){if("function"!=typeof r&&null!==r)throw new TypeError("Class extends value "+String(r)+" is not a constructor or null");function o(){this.constructor=t;}e(t,r),t.prototype=null===r?Object.create(r):(o.prototype=r.prototype,new o);}}(),CustomError=function(e){function t(t,r){var o=this.constructor,n=e.call(this,t,r)||this;return Object.defineProperty(n,"name",{value:o.name,enumerable:false,configurable:true}),fixProto(n,o.prototype),fixStack(n),n}return __extends(t,e),t}(Error);const instanceOfAny=(e,t)=>t.some((t=>e instanceof t));let idbProxyableTypes,cursorAdvanceMethods;function getIdbProxyableTypes(){return idbProxyableTypes||(idbProxyableTypes=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function getCursorAdvanceMethods(){return cursorAdvanceMethods||(cursorAdvanceMethods=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const transactionDoneMap=new WeakMap,transformCache=new WeakMap,reverseTransformCache=new WeakMap;function promisifyRequest(e){const t=new Promise(((t,r)=>{const o=()=>{e.removeEventListener("success",n),e.removeEventListener("error",i);},n=()=>{t(wrap(e.result)),o();},i=()=>{r(e.error),o();};e.addEventListener("success",n),e.addEventListener("error",i);}));return reverseTransformCache.set(t,e),t}function cacheDonePromiseForTransaction(e){if(transactionDoneMap.has(e))return;const t=new Promise(((t,r)=>{const o=()=>{e.removeEventListener("complete",n),e.removeEventListener("error",i),e.removeEventListener("abort",i);},n=()=>{t(),o();},i=()=>{r(e.error||new DOMException("AbortError","AbortError")),o();};e.addEventListener("complete",n),e.addEventListener("error",i),e.addEventListener("abort",i);}));transactionDoneMap.set(e,t);}let idbProxyTraps={get(e,t,r){if(e instanceof IDBTransaction){if("done"===t)return transactionDoneMap.get(e);if("store"===t)return r.objectStoreNames[1]?void 0:r.objectStore(r.objectStoreNames[0])}return wrap(e[t])},set:(e,t,r)=>(e[t]=r,true),has:(e,t)=>e instanceof IDBTransaction&&("done"===t||"store"===t)||t in e};function replaceTraps(e){idbProxyTraps=e(idbProxyTraps);}function wrapFunction(e){return getCursorAdvanceMethods().includes(e)?function(){for(var t=arguments.length,r=new Array(t),o=0;o<t;o++)r[o]=arguments[o];return e.apply(unwrap(this),r),wrap(this.request)}:function(){for(var t=arguments.length,r=new Array(t),o=0;o<t;o++)r[o]=arguments[o];return wrap(e.apply(unwrap(this),r))}}function transformCachableValue(e){return "function"==typeof e?wrapFunction(e):(e instanceof IDBTransaction&&cacheDonePromiseForTransaction(e),instanceOfAny(e,getIdbProxyableTypes())?new Proxy(e,idbProxyTraps):e)}function wrap(e){if(e instanceof IDBRequest)return promisifyRequest(e);if(transformCache.has(e))return transformCache.get(e);const t=transformCachableValue(e);return t!==e&&(transformCache.set(e,t),reverseTransformCache.set(t,e)),t}const unwrap=e=>reverseTransformCache.get(e);function openDB(e,t){let{blocked:r,upgrade:o,blocking:n,terminated:i}=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};const a=indexedDB.open(e,t),s=wrap(a);return o&&a.addEventListener("upgradeneeded",(e=>{o(wrap(a.result),e.oldVersion,e.newVersion,wrap(a.transaction),e);})),r&&a.addEventListener("blocked",(e=>r(e.oldVersion,e.newVersion,e))),s.then((e=>{i&&e.addEventListener("close",(()=>i())),n&&e.addEventListener("versionchange",(e=>n(e.oldVersion,e.newVersion,e)));})).catch((()=>{})),s}const readMethods=["get","getKey","getAll","getAllKeys","count"],writeMethods=["put","add","delete","clear"],cachedMethods=new Map;function getMethod(e,t){if(!(e instanceof IDBDatabase)||t in e||"string"!=typeof t)return;if(cachedMethods.get(t))return cachedMethods.get(t);const r=t.replace(/FromIndex$/,""),o=t!==r,n=writeMethods.includes(r);if(!(r in(o?IDBIndex:IDBObjectStore).prototype)||!n&&!readMethods.includes(r))return;const i=async function(e){const t=this.transaction(e,n?"readwrite":"readonly");let i=t.store;for(var a=arguments.length,s=new Array(a>1?a-1:0),u=1;u<a;u++)s[u-1]=arguments[u];return o&&(i=i.index(s.shift())),(await Promise.all([i[r](...s),n&&t.done]))[0]};return cachedMethods.set(t,i),i}replaceTraps((e=>({...e,get:(t,r,o)=>getMethod(t,r)||e.get(t,r,o),has:(t,r)=>!!getMethod(t,r)||e.has(t,r)})));const advanceMethodProps=["continue","continuePrimaryKey","advance"],methodMap={},advanceResults=new WeakMap,ittrProxiedCursorToOriginalProxy=new WeakMap,cursorIteratorTraps={get(e,t){if(!advanceMethodProps.includes(t))return e[t];let r=methodMap[t];return r||(r=methodMap[t]=function(){advanceResults.set(this,ittrProxiedCursorToOriginalProxy.get(this)[t](...arguments));}),r}};async function*iterate(){let e=this;if(e instanceof IDBCursor||(e=await e.openCursor(...arguments)),!e)return;const t=new Proxy(e,cursorIteratorTraps);for(ittrProxiedCursorToOriginalProxy.set(t,e),reverseTransformCache.set(t,unwrap(e));e;)yield t,e=await(advanceResults.get(t)||e.continue()),advanceResults.delete(t);}function isIteratorProp(e,t){return t===Symbol.asyncIterator&&instanceOfAny(e,[IDBIndex,IDBObjectStore,IDBCursor])||"iterate"===t&&instanceOfAny(e,[IDBIndex,IDBObjectStore])}replaceTraps((e=>({...e,get:(t,r,o)=>isIteratorProp(t,r)?iterate:e.get(t,r,o),has:(t,r)=>isIteratorProp(t,r)||e.has(t,r)})));

  /* minified: lib */
  class ConsoleSink{constructor(e){_defineProperty(this,"scriptName",void 0),_defineProperty(this,"onSuccess",this.onInfo.bind(this)),this.scriptName=e;}formatMessage(e){return `[${this.scriptName}] ${e}`}onDebug(e){console.debug(this.formatMessage(e));}onLog(e){console.log(this.formatMessage(e));}onInfo(e){console.info(this.formatMessage(e));}onWarn(e,t){e=this.formatMessage(e),t?console.warn(e,t):console.warn(e);}onError(e,t){e=this.formatMessage(e),t?console.error(e,t):console.error(e);}}let LogLevel=function(e){return e[e.DEBUG=0]="DEBUG",e[e.LOG=1]="LOG",e[e.INFO=2]="INFO",e[e.SUCCESS=3]="SUCCESS",e[e.WARNING=4]="WARNING",e[e.ERROR=5]="ERROR",e}({});const HANDLER_NAMES={[LogLevel.DEBUG]:"onDebug",[LogLevel.LOG]:"onLog",[LogLevel.INFO]:"onInfo",[LogLevel.SUCCESS]:"onSuccess",[LogLevel.WARNING]:"onWarn",[LogLevel.ERROR]:"onError"},DEFAULT_OPTIONS={logLevel:LogLevel.INFO,sinks:[]};class Logger{constructor(e){_defineProperty(this,"_configuration",void 0),this._configuration={...DEFAULT_OPTIONS,...e};}fireHandlers(e,t,r){if(!(e<this._configuration.logLevel))for(const s of this._configuration.sinks){const n=s[HANDLER_NAMES[e]];n&&(r?n.call(s,t,r):n.call(s,t));}}debug(e){this.fireHandlers(LogLevel.DEBUG,e);}log(e){this.fireHandlers(LogLevel.LOG,e);}info(e){this.fireHandlers(LogLevel.INFO,e);}success(e){this.fireHandlers(LogLevel.SUCCESS,e);}warn(e,t){this.fireHandlers(LogLevel.WARNING,e,t);}error(e,t){this.fireHandlers(LogLevel.ERROR,e,t);}configure(e){Object.assign(this._configuration,e);}get configuration(){return this._configuration}addSink(e){this._configuration.sinks.push(e);}}const LOGGER=new Logger;var USERSCRIPT_ID="mb_caa_dimensions";function logFailure(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"An error occurred";return LOGGER.error.bind(LOGGER,e)}class AssertionError extends Error{}function assert(e,t){if(!e)throw new AssertionError(t??"Assertion failed")}function assertDefined(e,t){assert(void 0!==e,t??"Assertion failed: Expected value to be defined");}function assertNonNull(e,t){assert(null!==e,t??"Assertion failed: Expected value to be non-null");}function qs(e,t){const r=qsMaybe(e,t);return assertNonNull(r,"Could not find required element"),r}function qsMaybe(e,t){return (t??document).querySelector(e)}function qsa(e,t){return [...(t??document).querySelectorAll(e)]}function onDocumentLoaded(e){"loading"!==document.readyState?e():document.addEventListener("DOMContentLoaded",e);}function parseDOM(e,t){const r=(new DOMParser).parseFromString(e,"text/html");if(!qsMaybe("base",r.head)){const e=r.createElement("base");e.href=t,r.head.insertAdjacentElement("beforeend",e);}return r}function insertStylesheet(e,t){if(t??=`ROpdebee_${USERSCRIPT_ID}_css`,null!==qsMaybe(`style#${t}`))return;const r=function(){var r=document.createElement("style");return r.setAttribute("id",t),appendChildren(r,e),r}.call(this);document.head.insertAdjacentElement("beforeend",r);}function formatFileSize(e){const t=0===e?0:Math.floor(Math.log(e)/Math.log(1024));return `${Number((e/Math.pow(1024,t)).toFixed(2))} ${["B","kB","MB","GB","TB"][t]}`}function safeParseJSON(e,t){try{return JSON.parse(e)}catch(r){throw new Error(`${t}: ${r}`)}}function groupBy(e,t,r){const s=new Map;for(const o of e){var n;const e=t(o),a=r(o);s.has(e)?null===(n=s.get(e))||void 0===n||n.push(a):s.set(e,[a]);}return s}class ResponseHeadersImpl{constructor(e){_defineProperty(this,"map",void 0),_defineProperty(this,Symbol.iterator,void 0),_defineProperty(this,"entries",void 0),_defineProperty(this,"keys",void 0),_defineProperty(this,"values",void 0);const t=groupBy(e?e.split("\r\n").filter(Boolean).map((e=>{const[t,...r]=e.split(":");return [t.toLowerCase().trim(),r.join(":").trim()]})):[],(e=>{let[t]=e;return t}),(e=>{let[,t]=e;return t}));this.map=new Map([...t.entries()].map((e=>{let[t,r]=e;return [t,r.join(",")]}))),this.entries=this.map.entries.bind(this.map),this.keys=this.map.keys.bind(this.map),this.values=this.map.values.bind(this.map),this[Symbol.iterator]=this.map[Symbol.iterator].bind(this.map);}get(e){return this.map.get(e.toLowerCase())??null}has(e){return this.map.has(e.toLowerCase())}forEach(e){for(const[t,r]of this.map.entries())e(r,t,this);}}function createTextResponse(e,t){return {...e,text:t,json(){return JSON.parse(this.text)}}}function convertFetchOptions(e,t){if(t)return {method:e,body:t.body,headers:t.headers}}async function createFetchResponse(e,t){const r=(null==e?void 0:e.responseType)??"text",s={headers:t.headers,url:t.url,status:t.status,statusText:t.statusText,rawResponse:t};switch(r){case "text":return createTextResponse(s,await t.text());case "blob":return {...s,blob:await t.blob()};case "arraybuffer":return {...s,arrayBuffer:await t.arrayBuffer()}}}async function performFetchRequest(e,t,r){return createFetchResponse(r,await fetch(new URL(t),convertFetchOptions(e,r)))}function existsInGM(e){return "undefined"!=typeof GM&&void 0!==GM[e]}function GMxmlHttpRequest(e){existsInGM("xmlHttpRequest")?GM.xmlHttpRequest(e):GM_xmlhttpRequest(e);}existsInGM("info")?GM.info:GM_info;class ResponseError extends CustomError{constructor(e,t){super(t),_defineProperty(this,"url",void 0),this.url=e;}}class HTTPResponseError extends ResponseError{constructor(e,t,r){r?(super(e,r),_defineProperty(this,"statusCode",void 0),_defineProperty(this,"statusText",void 0),_defineProperty(this,"response",void 0)):t.statusText.trim()?(super(e,`HTTP error ${t.status}: ${t.statusText}`),_defineProperty(this,"statusCode",void 0),_defineProperty(this,"statusText",void 0),_defineProperty(this,"response",void 0)):(super(e,`HTTP error ${t.status}`),_defineProperty(this,"statusCode",void 0),_defineProperty(this,"statusText",void 0),_defineProperty(this,"response",void 0)),this.response=t,this.statusCode=t.status,this.statusText=t.statusText;}}class TimeoutError extends ResponseError{constructor(e){super(e,"Request timed out");}}class AbortedError extends ResponseError{constructor(e){super(e,"Request aborted");}}class NetworkError extends ResponseError{constructor(e){super(e,"Network error");}}function createGMXHRResponse(e,t){const r=(null==e?void 0:e.responseType)??"text",s={headers:new ResponseHeadersImpl(t.responseHeaders),url:t.finalUrl,status:t.status,statusText:t.statusText,rawResponse:t};switch(r){case "text":return createTextResponse(s,t.responseText);case "blob":return {...s,blob:t.response};case "arraybuffer":return {...s,arrayBuffer:t.response}}}function performGMXHRRequest(e,t,r){return new Promise(((s,n)=>{GMxmlHttpRequest({method:e,url:t instanceof URL?t.href:t,headers:null==r?void 0:r.headers,data:null==r?void 0:r.body,responseType:null==r?void 0:r.responseType,onload:e=>{s(createGMXHRResponse(r,e));},onerror:()=>{n(new NetworkError(t));},onabort:()=>{n(new AbortedError(t));},ontimeout:()=>{n(new TimeoutError(t));},onprogress:null==r?void 0:r.onProgress});}))}let RequestBackend=function(e){return e[e.FETCH=1]="FETCH",e[e.GMXHR=2]="GMXHR",e}({});const hasGMXHR="undefined"!=typeof GM_xmlHttpRequest||"undefined"!=typeof GM&&void 0!==GM.xmlHttpRequest;function constructErrorMessage(e,t){var r;const s=null==e||null===(r=e.httpErrorMessages)||void 0===r?void 0:r[t.status];return "string"==typeof s?s:void 0!==s?s(t):void 0}const request=async function(e,t,r){const s=(null==r?void 0:r.backend)??(hasGMXHR?RequestBackend.GMXHR:RequestBackend.FETCH),n=await performRequest(s,e,t,r);if(((null==r?void 0:r.throwForStatus)??1)&&n.status>=400){const e=constructErrorMessage(r,n);throw new HTTPResponseError(t,n,e)}return n};function performRequest(e,t,r,s){switch(e){case RequestBackend.FETCH:return performFetchRequest(t,r,s);case RequestBackend.GMXHR:return performGMXHRRequest(t,r,s)}}async function getItemMetadata(e){const t=safeParseJSON((await request.get(new URL(`https://archive.org/metadata/${e}`))).text,"Could not parse IA metadata");if(!t.server)throw new Error("Empty IA metadata, item might not exist");if(t.is_dark)throw new Error("Cannot access IA metadata: This item is darkened");return t}function memoize(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:e=>`${e[0]}`;const r=new Map;return function(){for(var s=arguments.length,n=new Array(s),o=0;o<s;o++)n[o]=arguments[o];const a=t(n);if(!r.has(a)){const t=e(...n);r.set(a,t);}return r.get(a)}}function parseVersion(e){return e.split(".").map((e=>Number.parseInt(e)))}function versionLessThan(e,t){let r=0;for(;r<e.length&&r<t.length;){if(e[r]<t[r])return  true;if(e[r]>t[r])return  false;r++;}return e.length<t.length}request.get=request.bind(void 0,"GET"),request.post=request.bind(void 0,"POST"),request.head=request.bind(void 0,"HEAD");var CHANGELOG_URL="https://github.com/ROpdebee/mb-userscripts/blob/dist/mb_caa_dimensions.changelog.md",USERSCRIPT_FEATURE_HISTORY=[{versionAdded:"2026.2.19",description:"gray out thumbnail sizes that are unavailable"},{versionAdded:"2024.7.25",description:"add support for new event art archive (EAA)"},{versionAdded:"2022.7.3",description:"PDF dimensions and page count"}],css_248z$1=".ROpdebee_feature_list{font-weight:300;margin:0 auto;width:-moz-fit-content;width:fit-content}.ROpdebee_feature_list ul{margin:6px 28px 0 0;text-align:left}";const LAST_DISPLAYED_KEY=`ROpdebee_${USERSCRIPT_ID}_last_notified_update`;function maybeDisplayNewFeatures(){const e=localStorage.getItem(LAST_DISPLAYED_KEY),t=GM.info.script;if(!e)return void localStorage.setItem(LAST_DISPLAYED_KEY,t.version);const r=parseVersion(e),s=USERSCRIPT_FEATURE_HISTORY.filter((e=>versionLessThan(r,parseVersion(e.versionAdded))));0!==s.length&&showFeatureNotification(t.name,t.version,s.map((e=>e.description)));}function showFeatureNotification(e,t,r){insertStylesheet(css_248z$1,"ROpdebee_Update_Banner");const s=function(){var n=document.createElement("div");n.setAttribute("class","banner warning-header");var o=document.createElement("p");n.appendChild(o),appendChildren(o,`${e} was updated to v${t}! `);var a=document.createElement("a");a.setAttribute("href",CHANGELOG_URL),o.appendChild(a);var i=document.createTextNode("See full changelog here");a.appendChild(i);var u=document.createTextNode(". New features since last update:");o.appendChild(u);var d=document.createElement("div");d.setAttribute("class","ROpdebee_feature_list"),n.appendChild(d);var c=document.createElement("ul");d.appendChild(c),appendChildren(c,r.map((e=>function(){var t=document.createElement("li");return appendChildren(t,e),t}.call(this))));var l=document.createElement("button");return l.setAttribute("class","dismiss-banner remove-item icon"),l.setAttribute("data-banner-name","alert"),l.setAttribute("type","button"),l.addEventListener("click",(()=>{s.remove(),localStorage.setItem(LAST_DISPLAYED_KEY,GM.info.script.version);})),n.appendChild(l),n}.call(this);qs("#page").insertAdjacentElement("beforebegin",s);}

  LOGGER.configure({
      logLevel: LogLevel.INFO,
  });
  LOGGER.addSink(new ConsoleSink(USERSCRIPT_ID));

  const fetchIAMetadata = memoize(itemId => pRetry(() => getItemMetadata(itemId), {
    retries: 5,
    onFailedAttempt: error => {
      LOGGER.warn(`Failed to retrieve IA metadata: ${error.cause}. Retrying…`);
    }
  }));
  async function getCAAInfo(itemId, imageId) {
    const iaManifest = await fetchIAMetadata(itemId);
    const fileNameRegex = new RegExp(`mbid-[a-f0-9-]{36}-${imageId}\\.\\w+$`);
    const imageMetadata = iaManifest.files.find(fileMeta => fileNameRegex.test(fileMeta.name));
    if (imageMetadata === undefined) {
      throw new Error(`Could not find image "${imageId}" in IA manifest`);
    }
    const pageCount = imageMetadata.format.endsWith('PDF') ? await tryGetPDFPageCount(itemId, imageId) : undefined;
    return {
      fileType: imageMetadata.format,
      size: Number.parseInt(imageMetadata.size),
      pageCount
    };
  }
  async function tryGetPDFPageCount(itemId, imageId) {
    const zipListingUrl = `https://archive.org/download/${itemId}/${itemId}-${imageId}_jp2.zip/`;
    const zipListingResponse = await request.get(zipListingUrl);
    const page = parseDOM(zipListingResponse.text, zipListingUrl);
    const tbody = qs('tbody', page);
    return qsa('tr', tbody).length - 2;
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
          image.src = '';
        }
      }
      function dimensionsFailed(event_) {
        clearInterval(interval);
        if (!done) {
          done = true;
          reject(new Error(event_.message ?? 'Image failed to load for unknown reason'));
        }
      }
      const image = document.createElement('img');
      image.addEventListener('load', () => {
        dimensionsLoaded({
          height: image.naturalHeight,
          width: image.naturalWidth
        });
      });
      image.addEventListener('error', dimensionsFailed);
      const interval = window.setInterval(() => {
        if (image.naturalHeight) {
          dimensionsLoaded({
            height: image.naturalHeight,
            width: image.naturalWidth
          });
        }
      }, 50);
      image.src = url;
    });
  }
  const getImageDimensions = memoize(url => pRetry(() => _getImageDimensions(url), {
    retries: 5,
    onFailedAttempt: error => {
      LOGGER.warn(`Failed to retrieve image dimensions: ${error.message}. Retrying…`);
    }
  }));

  const CAA_ID_REGEX = /(mbid-[a-f\d-]{36})\/mbid-[a-f\d-]{36}-(\d+)/;
  const CAA_DOMAIN = 'coverartarchive.org';
  const IMG_DOMAINS = /^(cover|event)artarchive\.org$/;
  class BaseImage {
    constructor(imageUrl, cache, cacheKey) {
      _defineProperty(this, "imageUrl", void 0);
      _defineProperty(this, "cacheKey", void 0);
      _defineProperty(this, "cache", void 0);
      this.imageUrl = imageUrl;
      this.cacheKey = cacheKey ?? imageUrl;
      this.cache = cache;
    }
    async getDimensions() {
      try {
        var _this$cache;
        const cachedResult = await ((_this$cache = this.cache) === null || _this$cache === void 0 ? void 0 : _this$cache.getDimensions(this.cacheKey));
        if (cachedResult !== undefined) {
          return cachedResult;
        }
      } catch (error) {
        LOGGER.warn('Failed to retrieve image dimensions from cache', error);
      }
      try {
        var _this$cache2;
        const liveResult = await getImageDimensions(this.imageUrl);
        await ((_this$cache2 = this.cache) === null || _this$cache2 === void 0 ? void 0 : _this$cache2.putDimensions(this.cacheKey, liveResult));
        return liveResult;
      } catch (error) {
        LOGGER.error('Failed to retrieve image dimensions', error);
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
      } catch (error) {
        LOGGER.warn('Failed to retrieve image file info from cache', error);
      }
      try {
        var _this$cache4;
        const liveResult = await this.loadFileInfo();
        await ((_this$cache4 = this.cache) === null || _this$cache4 === void 0 ? void 0 : _this$cache4.putFileInfo(this.cacheKey, liveResult));
        return liveResult;
      } catch (error) {
        LOGGER.error('Failed to retrieve image file info', error);
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
  function caaUrlToDirectUrl(urlObject) {
    if (IMG_DOMAINS.test(urlObject.host) && /^\/(event|release)\//.test(urlObject.pathname)) {
      const [releaseId, imageName] = urlObject.pathname.split('/').slice(2);
      urlObject.href = `https://archive.org/download/mbid-${releaseId}/mbid-${releaseId}-${imageName}`;
    }
    return urlObject;
  }
  function urlToCacheKey(fullSizeUrl, thumbnailUrl) {
    const urlObject = new URL(fullSizeUrl);
    if (urlObject.host === CAA_DOMAIN && urlObject.pathname.startsWith('/release-group/')) {
      assertDefined(thumbnailUrl, 'Release group image requires a thumbnail URL');
      return thumbnailUrl;
    }
    return caaUrlToDirectUrl(urlObject).href;
  }
  function urlToDirectImageUrl(url) {
    let urlObject = new URL(url);
    urlObject = caaUrlToDirectUrl(urlObject);
    if (urlObject.pathname.endsWith('.pdf')) {
      const [imageName] = urlObject.pathname.split('/').slice(3);
      const imageBasename = imageName.replace(/\.pdf$/, '');
      urlObject.pathname = urlObject.pathname.replace(/\.pdf$/, `_jp2.zip/${imageBasename}_jp2%2F${imageBasename}_0000.jp2`);
      urlObject.search = '?ext=jpg';
    }
    return urlObject.href;
  }
  function parseCAAIDs(url) {
    const urlObject = new URL(url);
    if (IMG_DOMAINS.test(urlObject.host) && /^\/(event|release)\//.test(urlObject.pathname)) {
      var _exec;
      const [releaseId, thumbName] = urlObject.pathname.split('/').slice(2);
      const imageId = (_exec = /^(\d+)/.exec(thumbName)) === null || _exec === void 0 ? void 0 : _exec[0];
      assertDefined(imageId, 'Malformed URL');
      return [`mbid-${releaseId}`, imageId];
    }
    if (urlObject.host !== 'archive.org') {
      throw new Error('Unsupported URL');
    }
    const matchGroups = CAA_ID_REGEX.exec(urlObject.pathname);
    if (matchGroups === null) {
      LOGGER.error(`Failed to extract image ID from URL ${url}`);
      throw new Error('Invalid URL');
    }
    const [itemId, imageId] = matchGroups.slice(1);
    return [itemId, imageId];
  }
  class CAAImage extends BaseImage {
    constructor(fullSizeUrl, cache, thumbnailUrl) {
      super(urlToDirectImageUrl(fullSizeUrl), cache, urlToCacheKey(fullSizeUrl, thumbnailUrl));
      _defineProperty(this, "itemId", void 0);
      _defineProperty(this, "imageId", void 0);
      const [itemId, imageId] = parseCAAIDs(thumbnailUrl ?? fullSizeUrl);
      this.itemId = itemId;
      this.imageId = imageId;
    }
    loadFileInfo() {
      return getCAAInfo(this.itemId, this.imageId);
    }
  }
  class QueuedUploadImage {
    constructor(imageElement) {
      _defineProperty(this, "imageElement", void 0);
      this.imageElement = imageElement;
    }
    getFileInfo() {
      return Promise.resolve(undefined);
    }
    getDimensions() {
      return new Promise(resolve => {
        const onLoad = () => {
          resolve({
            width: this.imageElement.naturalWidth,
            height: this.imageElement.naturalHeight
          });
        };
        this.imageElement.addEventListener('load', onLoad);
        if (this.imageElement.complete) {
          this.imageElement.removeEventListener('load', onLoad);
          onLoad();
        }
      });
    }
  }

  function createDimensionsString(imageInfo) {
      return imageInfo.dimensions !== undefined ? `${ imageInfo.dimensions.width }×${ imageInfo.dimensions.height }` : 'failed :(';
  }
  function createFileInfoString(imageInfo) {
      const details = [];
      if (imageInfo.size !== undefined) {
          details.push(formatFileSize(imageInfo.size));
      }
      if (imageInfo.fileType !== undefined) {
          details.push(imageInfo.fileType);
      }
      if (imageInfo.pageCount !== undefined) {
          details.push(imageInfo.pageCount.toString() + (imageInfo.pageCount === 1 ? ' page' : ' pages'));
      }
      return details.join(', ');
  }
  class BaseDisplayedImage {
      constructor(imageElement, labelPlacementAnchor) {
          _defineProperty(this, 'imageElement', void 0);
          _defineProperty(this, '_labelPlacementAnchor', void 0);
          _defineProperty(this, '_dimensionsSpan', null);
          _defineProperty(this, '_fileInfoSpan', null);
          this._labelPlacementAnchor = labelPlacementAnchor ?? imageElement;
          this.imageElement = imageElement;
      }
      get dimensionsSpan() {
          if (this._dimensionsSpan !== null)
              return this._dimensionsSpan;
          this._dimensionsSpan = qsMaybe('span.ROpdebee_dimensions', this.imageElement.parentElement);
          if (this._dimensionsSpan !== null)
              return this._dimensionsSpan;
          this._dimensionsSpan = function () {
              var $$a = document.createElement('span');
              $$a.setAttribute('class', 'ROpdebee_dimensions');
              return $$a;
          }.call(this);
          this._labelPlacementAnchor.insertAdjacentElement('afterend', this._dimensionsSpan);
          return this._dimensionsSpan;
      }
      get fileInfoSpan() {
          if (this._fileInfoSpan !== null)
              return this._fileInfoSpan;
          this._fileInfoSpan = qsMaybe('span.ROpdebee_fileInfo', this.imageElement.parentElement);
          if (this._fileInfoSpan !== null)
              return this._fileInfoSpan;
          this._fileInfoSpan = function () {
              var $$b = document.createElement('span');
              $$b.setAttribute('class', 'ROpdebee_fileInfo');
              return $$b;
          }.call(this);
          this.dimensionsSpan.insertAdjacentElement('afterend', this._fileInfoSpan);
          return this._fileInfoSpan;
      }
  }
  class DisplayedCAAImage extends BaseDisplayedImage {
      constructor(imageElement, image) {
          super(imageElement);
          _defineProperty(this, 'image', void 0);
          _defineProperty(this, 'imageInfo', null);
          this.image = image;
      }
      async loadAndDisplay() {
          if (this.imageElement.getAttribute('ROpdebee_lazyDimensions')) {
              return;
          }
          this.displayInfo('pending\u2026');
          try {
              this.imageInfo = await this.image.getImageInfo();
              this.displayInfo(this.createDimensionsString(this.imageInfo), this.createFileInfoString(this.imageInfo));
          } catch (error) {
              LOGGER.error('Failed to load image information', error);
              this.displayInfo('failed :(');
          }
      }
      displayInfo(dimensionsString, fileInfoString) {
          this.imageElement.setAttribute('ROpdebee_lazyDimensions', dimensionsString);
          this.dimensionsSpan.textContent = dimensionsString;
          if (fileInfoString !== undefined) {
              this.fileInfoSpan.textContent = fileInfoString;
          }
      }
      createDimensionsString(imageInfo) {
          return `Dimensions: ${ createDimensionsString(imageInfo) }`;
      }
      createFileInfoString(imageInfo) {
          const detailsString = createFileInfoString(imageInfo);
          if (detailsString) {
              return detailsString;
          }
          return undefined;
      }
  }
  class ArtworkImageAnchorCAAImage extends DisplayedCAAImage {
      constructor(imageElement, cache) {
          var _imageElement$closest;
          const fullSizeUrl = (_imageElement$closest = imageElement.closest('a.artwork-image, a.artwork-pdf')) === null || _imageElement$closest === void 0 ? void 0 : _imageElement$closest.href;
          assertDefined(fullSizeUrl);
          super(imageElement, new CAAImage(fullSizeUrl, cache, imageElement.src));
      }
  }
  class CoverArtTabCAAImage extends DisplayedCAAImage {
      constructor(imageElement, cache) {
          const container = imageElement.closest('div.artwork-cont');
          assertNonNull(container);
          const anchors = qsa('p.small > a', container);
          const fullSizeUrl = anchors[anchors.length - 1].href;
          super(imageElement, new CAAImage(fullSizeUrl, cache));
          _defineProperty(this, 'anchors', void 0);
          this.anchors = anchors;
      }
      async loadAndDisplay() {
          var _this$imageInfo;
          await super.loadAndDisplay();
          if (((_this$imageInfo = this.imageInfo) === null || _this$imageInfo === void 0 ? void 0 : _this$imageInfo.dimensions) === undefined)
              return;
          const {height, width} = this.imageInfo.dimensions;
          const maxDimension = Math.max(height, width);
          for (const anchor of this.anchors) {
              var _exec, _anchor$textContent;
              const resolutionString = (_exec = /^(\d+)\s*px/.exec((((_anchor$textContent = anchor.textContent) === null || _anchor$textContent === void 0) ? void 0 : _anchor$textContent.trim()) ?? '')) === null || _exec === void 0 ? void 0 : _exec[1];
              if (resolutionString === undefined)
                  continue;
              const resolution = Number.parseInt(resolutionString);
              if (resolution > maxDimension) {
                  anchor.classList.add('unavailable');
              }
          }
      }
  }
  class CAAImageWithFullSizeURL extends DisplayedCAAImage {
      constructor(imageElement, cache) {
          const fullSizeUrl = imageElement.getAttribute('fullSizeURL');
          assertNonNull(fullSizeUrl);
          super(imageElement, new CAAImage(fullSizeUrl, cache));
      }
  }
  class ThumbnailCAAImage extends ArtworkImageAnchorCAAImage {
      createDimensionsString(imageInfo) {
          return createDimensionsString(imageInfo);
      }
  }
  class DisplayedQueuedUploadImage extends BaseDisplayedImage {
      constructor(imageElement) {
          var _imageElement$parentE;
          super(imageElement, (_imageElement$parentE = imageElement.parentElement) === null || _imageElement$parentE === void 0 ? void 0 : _imageElement$parentE.lastElementChild);
          _defineProperty(this, 'image', void 0);
          this.image = new QueuedUploadImage(imageElement);
      }
      async loadAndDisplay() {
          if (this.imageElement.src.endsWith('/static/images/icons/pdf-icon.png'))
              return;
          const dimensions = await this.image.getDimensions();
          const infoString = `${ dimensions.width }×${ dimensions.height }`;
          this.dimensionsSpan.textContent = infoString;
      }
  }
  function displayedCoverArtFactory(image, cache) {
      try {
          if (image.closest('.artwork-cont') !== null) {
              return new CoverArtTabCAAImage(image, cache);
          } else if (image.closest('.thumb-position') !== null || image.closest('form#set-cover-art') !== null) {
              return new ThumbnailCAAImage(image, cache);
          } else {
              return new ArtworkImageAnchorCAAImage(image, cache);
          }
      } catch (error) {
          LOGGER.error('Failed to process image', error);
          return undefined;
      }
  }
  const displayInfoWhenInView = (() => {
      const imageMap = new Map();
      function inViewCallback(entries) {
          for (const entry of entries) {
              if (entry.intersectionRatio <= 0)
                  continue;
              const image = imageMap.get(entry.target);
              image.loadAndDisplay().catch(logFailure('Failed to process image'));
          }
      }
      const observer = new IntersectionObserver(inViewCallback, { root: document });
      return image => {
          if (imageMap.has(image.imageElement)) {
              return;
          }
          imageMap.set(image.imageElement, image);
          observer.observe(image.imageElement);
      };
  })();

  function setupExports(cachePromise) {
    async function getCAAImageInfo(imageUrl) {
      if (new URL(imageUrl).hostname !== 'archive.org') {
        throw new Error('Unsupported URL: Need direct image URL');
      }
      const cache = await cachePromise;
      const image = new CAAImage(imageUrl, cache);
      return image.getImageInfo();
    }
    function getDimensionsWhenInView(imageElement) {
      cachePromise.then(cache => {
        const image = new CAAImageWithFullSizeURL(imageElement, cache);
        displayInfoWhenInView(image);
      }).catch(logFailure(`Something went wrong when attempting to load image info for ${imageElement.src}`));
    }
    async function loadImageDimensions(imageUrl) {
      const imageInfo = await getCAAImageInfo(imageUrl);
      return {
        url: imageUrl,
        ...(imageInfo.dimensions ?? {
          width: 0,
          height: 0
        }),
        size: imageInfo.size,
        format: imageInfo.fileType
      };
    }
    window.ROpdebee_getDimensionsWhenInView = getDimensionsWhenInView;
    window.ROpdebee_loadImageDimensions = loadImageDimensions;
    window.ROpdebee_getCAAImageInfo = getCAAImageInfo;
  }

  const CACHE_DB_NAME = 'ROpdebee_CAA_Dimensions_Cache';
  const CACHE_DIMENSIONS_STORE_NAME = 'dimensionsStore';
  const CACHE_FILE_INFO_STORE_NAME = 'fileInfoStore';
  const CACHE_ADDED_TIMESTAMP_INDEX = 'addedDatetimeIdx';
  const CACHE_DB_VERSION = 2;
  const CACHE_TIMESTAMP_NAME = 'ROpdebee_Last_Cache_Prune_Check';
  const CACHE_CHECK_INTERVAL = 24 * 60 * 60 * 1000;
  const CACHE_STALE_TIME = 14 * 24 * 60 * 60 * 1000;
  async function createCache() {
    if (window.indexedDB !== undefined) {
      try {
        return await IndexedDBInfoCache.create();
      } catch (error) {
        LOGGER.error('Failed to create IndexedDB-backed image information cache, repeated lookups will be slow!', error);
      }
    } else {
      LOGGER.warn('Your browser does not seem to support IndexedDB. A persistent image information cache will not be used, which may result in slower lookups. Consider upgrading to a more modern browser version for improved performance.');
    }
    return new NoInfoCache();
  }
  class NoInfoCache {
    getDimensions() {
      return Promise.resolve(undefined);
    }
    putDimensions() {
      return Promise.resolve();
    }
    getFileInfo() {
      return Promise.resolve(undefined);
    }
    putFileInfo() {
      return Promise.resolve();
    }
  }
  class IndexedDBInfoCache {
    constructor(database) {
      _defineProperty(this, "database", void 0);
      this.database = database;
    }
    static async create() {
      return new Promise((resolve, reject) => {
        let wasBlocked = false;
        const databasePromise = openDB(CACHE_DB_NAME, CACHE_DB_VERSION, {
          async upgrade(database, oldVersion, newVersion, tx) {
            LOGGER.info(`Creating or upgrading IndexedDB cache version ${newVersion}`);
            if (oldVersion < 1) {
              const dimensionsStore = database.createObjectStore(CACHE_DIMENSIONS_STORE_NAME);
              dimensionsStore.createIndex(CACHE_ADDED_TIMESTAMP_INDEX, 'addedDatetime');
              const fileInfoStore = database.createObjectStore(CACHE_FILE_INFO_STORE_NAME);
              fileInfoStore.createIndex(CACHE_ADDED_TIMESTAMP_INDEX, 'addedDatetime');
              return;
            }
            while (oldVersion < newVersion) {
              LOGGER.info(`Upgrading IndexedDB cache from version ${oldVersion} to ${oldVersion + 1}`);
              const migrator = DatabaseMigrations[oldVersion];
              await migrator(database, tx);
              oldVersion++;
            }
          },
          blocked() {
            wasBlocked = true;
            reject(new Error('Required schema change on cache DB is blocked by an older version of the script. Please close or reload any other tab on which this script is running'));
          },
          blocking() {
            LOGGER.warn('Closing DB for schema change in other tab');
            databasePromise.then(database => {
              database.close();
            }).catch(logFailure('Failed to close database'));
          }
        });
        databasePromise.then(async database => {
          LOGGER.debug('Successfully opened IndexedDB cache');
          await maybePruneDatabase(database);
          if (!wasBlocked) {
            resolve(new IndexedDBInfoCache(database));
          }
        }).catch(reject);
      });
    }
    async get(storeName, imageUrl) {
      try {
        const cachedResult = await this.database.get(storeName, imageUrl);
        if (cachedResult !== undefined) {
          LOGGER.debug(`${imageUrl}: Cache hit`);
        } else {
          LOGGER.debug(`${imageUrl}: Cache miss`);
        }
        return cachedResult;
      } catch (error) {
        LOGGER.error(`Failed to load ${imageUrl} from cache`, error);
        throw error;
      }
    }
    async put(storeName, imageUrl, value) {
      try {
        await this.database.put(storeName, {
          ...value,
          addedDatetime: Date.now()
        }, imageUrl);
        LOGGER.debug(`Successfully stored ${imageUrl} in cache`);
      } catch (error) {
        LOGGER.error(`Failed to store ${imageUrl} in cache`, error);
      }
    }
    async getDimensions(imageUrl) {
      return this.get(CACHE_DIMENSIONS_STORE_NAME, imageUrl);
    }
    async putDimensions(imageUrl, dimensions) {
      return this.put(CACHE_DIMENSIONS_STORE_NAME, imageUrl, dimensions);
    }
    async getFileInfo(imageUrl) {
      return this.get(CACHE_FILE_INFO_STORE_NAME, imageUrl);
    }
    async putFileInfo(imageUrl, fileInfo) {
      return this.put(CACHE_FILE_INFO_STORE_NAME, imageUrl, fileInfo);
    }
  }
  async function maybePruneDatabase(database) {
    const lastPruneTimestamp = Number.parseInt(localStorage.getItem(CACHE_TIMESTAMP_NAME) ?? '0');
    const timeSinceLastPrune = Date.now() - lastPruneTimestamp;
    if (timeSinceLastPrune < CACHE_CHECK_INTERVAL) {
      LOGGER.debug(`Cache was last pruned at ${new Date(lastPruneTimestamp)}, pruning is unnecessary`);
      return;
    }
    LOGGER.info('Pruning stale entries from cache');
    const pruneRange = IDBKeyRange.upperBound(Date.now() - CACHE_STALE_TIME);
    async function iterateAndPrune(storeName) {
      let cursor = await database.transaction(storeName, 'readwrite').store.index(CACHE_ADDED_TIMESTAMP_INDEX).openCursor(pruneRange);
      while (cursor !== null) {
        LOGGER.debug(`Removing ${cursor.key} (added at ${new Date(cursor.value.addedDatetime)})`);
        await cursor.delete();
        cursor = await cursor.continue();
      }
    }
    await iterateAndPrune(CACHE_DIMENSIONS_STORE_NAME);
    await iterateAndPrune(CACHE_FILE_INFO_STORE_NAME);
    LOGGER.debug('Done pruning stale entries');
    localStorage.setItem(CACHE_TIMESTAMP_NAME, Date.now().toString());
  }
  const DatabaseMigrations = {
    1: async function (database, tx) {
      const txV1 = tx;
      const databaseV1 = database;
      const oldRecords = await txV1.objectStore('cacheStore').getAll();
      databaseV1.deleteObjectStore('cacheStore');
      const newDimensionsStore = database.createObjectStore(CACHE_DIMENSIONS_STORE_NAME);
      const newFileInfoStore = database.createObjectStore(CACHE_FILE_INFO_STORE_NAME);
      newDimensionsStore.createIndex(CACHE_ADDED_TIMESTAMP_INDEX, 'addedDatetime');
      newFileInfoStore.createIndex(CACHE_ADDED_TIMESTAMP_INDEX, 'addedDatetime');
      await Promise.all(oldRecords.map(async rec => {
        await tx.objectStore(CACHE_DIMENSIONS_STORE_NAME).put({
          width: rec.width,
          height: rec.height,
          addedDatetime: rec.added_datetime
        }, rec.url);
        await tx.objectStore(CACHE_FILE_INFO_STORE_NAME).put({
          size: rec.size,
          fileType: rec.format,
          addedDatetime: rec.added_datetime
        }, rec.url);
      }));
    }
  };

  var css_248z = "div.thumb-position{display:flex;flex-direction:column;height:auto}.image-position{display:flex;flex-direction:row;flex-wrap:wrap}div.thumb-position>div:last-of-type{margin-top:auto;padding-top:5px}div.thumb-position>div:last-of-type:before{margin-bottom:auto}div.thumb-position img{display:block;margin:auto}span.artwork-image,span.cover-art-image{display:inline-block}span.ROpdebee_dimensions,span.ROpdebee_fileInfo{display:block}a.artwork-image span.ROpdebee_dimensions,a.artwork-image span.ROpdebee_fileInfo,a.artwork-pdf span.ROpdebee_dimensions,a.artwork-pdf span.ROpdebee_fileInfo{text-align:center}td.edit-cover-art span.ROpdebee_dimensions,td.edit-cover-art span.ROpdebee_fileInfo,td.edit-event-art span.ROpdebee_dimensions,td.edit-event-art span.ROpdebee_fileInfo{max-width:250px}div.thumb-position span.ROpdebee_dimensions,div.thumb-position span.ROpdebee_fileInfo{font-size:smaller;text-align:center}div.thumb-position span.ROpdebee_dimensions{padding-top:.5em}div.thumb-position span.ROpdebee_fileInfo{padding-bottom:.5em}img.uploader-preview-column>span.ROpdebee_dimensions{display:inline}.artwork-cont a.unavailable{color:gray;-webkit-text-decoration:line-through;text-decoration:line-through}";

  if (document.location.hostname === 'musicbrainz.org' || document.location.hostname.endsWith('.musicbrainz.org')) {
      onDocumentLoaded(maybeDisplayNewFeatures);
  }

  const ARTWORK_QUERY = '.cover-art-image, .artwork-image';
  function processPageChange(mutations, cache) {
    const addedNodes = mutations.flatMap(mutation => [...mutation.addedNodes]);
    for (const addedNode of addedNodes) {
      if (!(addedNode instanceof HTMLImageElement)) continue;
      const displayedImage = displayedCoverArtFactory(addedNode, cache);
      if (displayedImage !== undefined) {
        displayInfoWhenInView(displayedImage);
      }
    }
  }
  function observeQueuedUploads(queuedUploadTable) {
    const queuedUploadObserver = new MutationObserver(mutations => {
      const addedNodes = mutations.flatMap(mutation => [...mutation.addedNodes]);
      for (const addedNode of addedNodes) {
        if (!(addedNode instanceof HTMLTableRowElement)) continue;
        const image = qsMaybe('img', addedNode);
        if (image !== null) {
          displayInfoWhenInView(new DisplayedQueuedUploadImage(image));
        }
      }
    });
    queuedUploadObserver.observe(qs('tbody', queuedUploadTable), {
      childList: true
    });
  }
  function detectAndObserveImages(cache) {
    const imageLoadObserver = new MutationObserver(mutations => {
      processPageChange(mutations, cache);
    });
    for (const container of qsa(ARTWORK_QUERY)) {
      const imageElement = qsMaybe('img', container);
      if (imageElement === null) {
        imageLoadObserver.observe(container, {
          childList: true
        });
      } else {
        const displayedImage = displayedCoverArtFactory(imageElement, cache);
        if (!displayedImage) continue;
        displayInfoWhenInView(displayedImage);
      }
    }
    const queuedUploadTable = qsMaybe('#add-cover-art > table');
    if (queuedUploadTable !== null) {
      observeQueuedUploads(queuedUploadTable);
    }
  }
  const cachePromise = createCache();
  setupExports(cachePromise);
  onDocumentLoaded(() => {
    insertStylesheet(css_248z);
    cachePromise.then(cache => {
      detectAndObserveImages(cache);
    }).catch(logFailure());
  });

})();
