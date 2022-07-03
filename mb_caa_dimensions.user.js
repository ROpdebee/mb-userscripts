// ==UserScript==
// @name         MB: Display CAA image dimensions
// @description  Displays the dimensions and size of images in the cover art archive.
// @version      2022.7.3
// @author       ROpdebee
// @license      MIT; https://opensource.org/licenses/MIT
// @namespace    https://github.com/ROpdebee/mb-userscripts
// @homepageURL  https://github.com/ROpdebee/mb-userscripts
// @supportURL   https://github.com/ROpdebee/mb-userscripts/issues
// @downloadURL  https://raw.github.com/ROpdebee/mb-userscripts/dist/mb_caa_dimensions.user.js
// @updateURL    https://raw.github.com/ROpdebee/mb-userscripts/dist/mb_caa_dimensions.meta.js
// @match        *://*.musicbrainz.org/release/*
// @match        *://*.musicbrainz.org/release-group/*
// @match        *://*.musicbrainz.org/edit/*
// @match        *://*.musicbrainz.org/*/edits*
// @match        *://*.musicbrainz.org/user/*/votes
// @match        *://*.musicbrainz.org/*/open_edits
// @exclude      *://*.musicbrainz.org/release/*/edit
// @exclude      *://*.musicbrainz.org/release/*/edit-relationships
// @exclude      *://*.musicbrainz.org/release-group/*/edit
// @run-at       document-start
// @grant        none
// ==/UserScript==

// For original source code, see https://github.com/ROpdebee/mb-userscripts/tree/main/src/mb_caa_dimensions
(function () {
  'use strict';

  /* minified: babel helpers, babel-plugin-transform-async-to-promises, nativejsx, retry, p-retry, idb */
  const _Pact=function(){function t(){}return t.prototype.then=function(e,r){const n=new t,o=this.s;if(o){const t=1&o?e:r;if(t){try{_settle(n,1,t(this.v));}catch(i){_settle(n,2,i);}return n}return this}return this.o=function(t){try{const o=t.v;1&t.s?_settle(n,1,e?e(o):o):r?_settle(n,1,r(o)):_settle(n,2,o);}catch(i){_settle(n,2,i);}},n},t}();function _settle(t,e,r){if(!t.s){if(r instanceof _Pact){if(!r.s)return void(r.o=_settle.bind(null,t,e));1&e&&(e=r.s),r=r.v;}if(r&&r.then)return void r.then(_settle.bind(null,t,e),_settle.bind(null,t,2));t.s=e,t.v=r;const n=t.o;n&&n(t);}}function _isSettledPact(t){return t instanceof _Pact&&1&t.s}function _async(t){return function(){for(var e=[],r=0;r<arguments.length;r++)e[r]=arguments[r];try{return Promise.resolve(t.apply(this,e))}catch(n){return Promise.reject(n)}}}function _await(t,e,r){return r?e?e(t):t:(t&&t.then||(t=Promise.resolve(t)),e?t.then(e):t)}function _awaitIgnored(t,e){if(!e)return t&&t.then?t.then(_empty):Promise.resolve()}function _continue(t,e){return t&&t.then?t.then(e):e(t)}function _continueIgnored(t){if(t&&t.then)return t.then(_empty)}"undefined"==typeof Symbol||Symbol.iterator||(Symbol.iterator=Symbol("Symbol.iterator"));const _asyncIteratorSymbol="undefined"!=typeof Symbol?Symbol.asyncIterator||(Symbol.asyncIterator=Symbol("Symbol.asyncIterator")):"@@asyncIterator";function _for(t,e,r){for(var n;;){var o=t();if(_isSettledPact(o)&&(o=o.v),!o)return i;if(o.then){n=0;break}var i=r();if(i&&i.then){if(!_isSettledPact(i)){n=1;break}i=i.s;}if(e){var a=e();if(a&&a.then&&!_isSettledPact(a)){n=2;break}}}var s=new _Pact,c=_settle.bind(null,s,2);return (0===n?o.then(l):1===n?i.then(u):a.then(p)).then(void 0,c),s;function u(n){i=n;do{if(e&&(a=e())&&a.then&&!_isSettledPact(a))return void a.then(p).then(void 0,c);if(!(o=t())||_isSettledPact(o)&&!o.v)return void _settle(s,1,i);if(o.then)return void o.then(l).then(void 0,c);_isSettledPact(i=r())&&(i=i.v);}while(!i||!i.then);i.then(u).then(void 0,c);}function l(t){t?(i=r())&&i.then?i.then(u).then(void 0,c):u(i):_settle(s,1,i);}function p(){(o=t())?o.then?o.then(l).then(void 0,c):l(o):_settle(s,1,i);}}function _call(t,e,r){if(r)return e?e(t()):t();try{var n=Promise.resolve(t());return e?n.then(e):n}catch(o){return Promise.reject(o)}}function _invoke(t,e){var r=t();return r&&r.then?r.then(e):e(r)}function _invokeIgnored(t){var e=t();if(e&&e.then)return e.then(_empty)}function _catch(t,e){try{var r=t();}catch(n){return e(n)}return r&&r.then?r.then(void 0,e):r}function _empty(){}const _earlyReturn={};function ownKeys(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n);}return r}function _objectSpread2(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?ownKeys(Object(r),!0).forEach((function(e){_defineProperty(t,e,r[e]);})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):ownKeys(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e));}));}return t}function _defineProperty(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function _slicedToArray(t,e){return _arrayWithHoles(t)||_iterableToArrayLimit(t,e)||_unsupportedIterableToArray(t,e)||_nonIterableRest()}function _arrayWithHoles(t){if(Array.isArray(t))return t}function _iterableToArrayLimit(t,e){var r=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=r){var n,o,i=[],a=!0,s=!1;try{for(r=r.call(t);!(a=(n=r.next()).done)&&(i.push(n.value),!e||i.length!==e);a=!0);}catch(c){s=!0,o=c;}finally{try{a||null==r.return||r.return();}finally{if(s)throw o}}return i}}function _unsupportedIterableToArray(t,e){if(t){if("string"==typeof t)return _arrayLikeToArray(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);return "Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?_arrayLikeToArray(t,e):void 0}}function _arrayLikeToArray(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}!function(){function t(t){this._entry=t,this._pact=null,this._resolve=null,this._return=null,this._promise=null;}function e(t){return {value:t,done:!0}}function r(t){return {value:t,done:!1}}t.prototype._yield=function(t){return this._resolve(t&&t.then?t.then(r):r(t)),this._pact=new _Pact},t.prototype.next=function(t){const r=this;return r._promise=new Promise((function(n){const o=r._pact;if(null===o){const s=r._entry;if(null===s)return n(r._promise);function i(t){r._resolve(t&&t.then?t.then(e):e(t)),r._pact=null,r._resolve=null;}r._entry=null,r._resolve=n;var a=s(r);a&&a.then?a.then(i,(function(t){if(t===_earlyReturn)i(r._return);else {const e=new _Pact;r._resolve(e),r._pact=null,r._resolve=null,_resolve(e,2,t);}})):i(a);}else r._pact=null,r._resolve=n,_settle(o,1,t);}))},t.prototype.return=function(t){const r=this;return r._promise=new Promise((function(n){const o=r._pact;if(null===o)return null===r._entry?n(r._promise):(r._entry=null,n(t&&t.then?t.then(e):e(t)));r._return=t,r._resolve=n,r._pact=null,_settle(o,2,_earlyReturn);}))},t.prototype.throw=function(t){const e=this;return e._promise=new Promise((function(r,n){const o=e._pact;if(null===o)return null===e._entry?r(e._promise):(e._entry=null,n(t));e._resolve=r,e._pact=null,_settle(o,2,t);}))},t.prototype[_asyncIteratorSymbol]=function(){return this};}();var appendChildren=function(t,e){(e=Array.isArray(e)?e:[e]).forEach((function(e){e instanceof HTMLElement?t.appendChild(e):(e||"string"==typeof e)&&t.appendChild(document.createTextNode(e.toString()));}));};function getDefaultExportFromCjs(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var retry$2={exports:{}},retry$1={};function RetryOperation(t,e){"boolean"==typeof e&&(e={forever:e}),this._originalTimeouts=JSON.parse(JSON.stringify(t)),this._timeouts=t,this._options=e||{},this._maxRetryTime=e&&e.maxRetryTime||1/0,this._fn=null,this._errors=[],this._attempts=1,this._operationTimeout=null,this._operationTimeoutCb=null,this._timeout=null,this._operationStart=null,this._timer=null,this._options.forever&&(this._cachedTimeouts=this._timeouts.slice(0));}var retry_operation=RetryOperation;RetryOperation.prototype.reset=function(){this._attempts=1,this._timeouts=this._originalTimeouts.slice(0);},RetryOperation.prototype.stop=function(){this._timeout&&clearTimeout(this._timeout),this._timer&&clearTimeout(this._timer),this._timeouts=[],this._cachedTimeouts=null;},RetryOperation.prototype.retry=function(t){if(this._timeout&&clearTimeout(this._timeout),!t)return !1;var e=(new Date).getTime();if(t&&e-this._operationStart>=this._maxRetryTime)return this._errors.push(t),this._errors.unshift(new Error("RetryOperation timeout occurred")),!1;this._errors.push(t);var r=this._timeouts.shift();if(void 0===r){if(!this._cachedTimeouts)return !1;this._errors.splice(0,this._errors.length-1),r=this._cachedTimeouts.slice(-1);}var n=this;return this._timer=setTimeout((function(){n._attempts++,n._operationTimeoutCb&&(n._timeout=setTimeout((function(){n._operationTimeoutCb(n._attempts);}),n._operationTimeout),n._options.unref&&n._timeout.unref()),n._fn(n._attempts);}),r),this._options.unref&&this._timer.unref(),!0},RetryOperation.prototype.attempt=function(t,e){this._fn=t,e&&(e.timeout&&(this._operationTimeout=e.timeout),e.cb&&(this._operationTimeoutCb=e.cb));var r=this;this._operationTimeoutCb&&(this._timeout=setTimeout((function(){r._operationTimeoutCb();}),r._operationTimeout)),this._operationStart=(new Date).getTime(),this._fn(this._attempts);},RetryOperation.prototype.try=function(t){console.log("Using RetryOperation.try() is deprecated"),this.attempt(t);},RetryOperation.prototype.start=function(t){console.log("Using RetryOperation.start() is deprecated"),this.attempt(t);},RetryOperation.prototype.start=RetryOperation.prototype.try,RetryOperation.prototype.errors=function(){return this._errors},RetryOperation.prototype.attempts=function(){return this._attempts},RetryOperation.prototype.mainError=function(){if(0===this._errors.length)return null;for(var t={},e=null,r=0,n=0;n<this._errors.length;n++){var o=this._errors[n],i=o.message,a=(t[i]||0)+1;t[i]=a,a>=r&&(e=o,r=a);}return e},function(t){var e=retry_operation;t.operation=function(r){var n=t.timeouts(r);return new e(n,{forever:r&&(r.forever||r.retries===1/0),unref:r&&r.unref,maxRetryTime:r&&r.maxRetryTime})},t.timeouts=function(t){if(t instanceof Array)return [].concat(t);var e={retries:10,factor:2,minTimeout:1e3,maxTimeout:1/0,randomize:!1};for(var r in t)e[r]=t[r];if(e.minTimeout>e.maxTimeout)throw new Error("minTimeout is greater than maxTimeout");for(var n=[],o=0;o<e.retries;o++)n.push(this.createTimeout(o,e));return t&&t.forever&&!n.length&&n.push(this.createTimeout(o,e)),n.sort((function(t,e){return t-e})),n},t.createTimeout=function(t,e){var r=e.randomize?Math.random()+1:1,n=Math.round(r*Math.max(e.minTimeout,1)*Math.pow(e.factor,t));return Math.min(n,e.maxTimeout)},t.wrap=function(e,r,n){if(r instanceof Array&&(n=r,r=null),!n)for(var o in n=[],e)"function"==typeof e[o]&&n.push(o);for(var i=0;i<n.length;i++){var a=n[i],s=e[a];e[a]=function(n){var o=t.operation(r),i=Array.prototype.slice.call(arguments,1),a=i.pop();i.push((function(t){o.retry(t)||(t&&(arguments[0]=o.mainError()),a.apply(this,arguments));})),o.attempt((function(){n.apply(e,i);}));}.bind(e,s),e[a].options=r;}};}(retry$1),retry$2.exports=retry$1;var retry=getDefaultExportFromCjs(retry$2.exports);const pRetry=_async((function(t,e){return new Promise(((r,n)=>{e=_objectSpread2({onFailedAttempt(){},retries:10},e);const o=retry.operation(e);o.attempt(_async((function(i){return _catch((function(){return _await(t(i),(function(t){r(t);}))}),(function(t){let r=!1;if(t instanceof Error)return _invokeIgnored((function(){if(!(t instanceof AbortError))return _invokeIgnored((function(){if(!(t instanceof TypeError)||isNetworkError(t.message))return decorateErrorWithCounts(t,i,e),_continue(_catch((function(){return _awaitIgnored(e.onFailedAttempt(t))}),(function(t){n(t),r=!0;})),(function(e){if(r)return e;o.retry(t)||n(o.mainError());}));o.stop(),n(t);}));o.stop(),n(t.originalError);}));n(new TypeError('Non-error was thrown: "'.concat(t,'". You should only throw errors.')));}))}))),e.signal&&!e.signal.aborted&&e.signal.addEventListener("abort",(()=>{o.stop();const t=void 0===e.signal.reason?getDOMException("The operation was aborted."):e.signal.reason;n(t instanceof Error?t:getDOMException(t));}),{once:!0});}))})),networkErrorMsgs=new Set(["Failed to fetch","NetworkError when attempting to fetch resource.","The Internet connection appears to be offline.","Network request failed"]);class AbortError extends Error{constructor(t){super(),t instanceof Error?(this.originalError=t,t=t.message):(this.originalError=new Error(t),this.originalError.stack=this.stack),this.name="AbortError",this.message=t;}}const decorateErrorWithCounts=(t,e,r)=>{const n=r.retries-(e-1);return t.attemptNumber=e,t.retriesLeft=n,t},isNetworkError=t=>networkErrorMsgs.has(t),getDOMException=t=>void 0===globalThis.DOMException?new Error(t):new DOMException(t);let idbProxyableTypes,cursorAdvanceMethods;function getIdbProxyableTypes(){return idbProxyableTypes||(idbProxyableTypes=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function getCursorAdvanceMethods(){return cursorAdvanceMethods||(cursorAdvanceMethods=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const cursorRequestMap=new WeakMap,transactionDoneMap=new WeakMap,transactionStoreNamesMap=new WeakMap,transformCache=new WeakMap,reverseTransformCache=new WeakMap;function promisifyRequest(t){const e=new Promise(((e,r)=>{const n=()=>{t.removeEventListener("success",o),t.removeEventListener("error",i);},o=()=>{e(wrap(t.result)),n();},i=()=>{r(t.error),n();};t.addEventListener("success",o),t.addEventListener("error",i);}));return e.then((e=>{e instanceof IDBCursor&&cursorRequestMap.set(e,t);})).catch((()=>{})),reverseTransformCache.set(e,t),e}function cacheDonePromiseForTransaction(t){if(transactionDoneMap.has(t))return;const e=new Promise(((e,r)=>{const n=()=>{t.removeEventListener("complete",o),t.removeEventListener("error",i),t.removeEventListener("abort",i);},o=()=>{e(),n();},i=()=>{r(t.error||new DOMException("AbortError","AbortError")),n();};t.addEventListener("complete",o),t.addEventListener("error",i),t.addEventListener("abort",i);}));transactionDoneMap.set(t,e);}let idbProxyTraps={get(t,e,r){if(t instanceof IDBTransaction){if("done"===e)return transactionDoneMap.get(t);if("objectStoreNames"===e)return t.objectStoreNames||transactionStoreNamesMap.get(t);if("store"===e)return r.objectStoreNames[1]?void 0:r.objectStore(r.objectStoreNames[0])}return wrap(t[e])},set:(t,e,r)=>(t[e]=r,!0),has:(t,e)=>t instanceof IDBTransaction&&("done"===e||"store"===e)||e in t};function replaceTraps(t){idbProxyTraps=t(idbProxyTraps);}function wrapFunction(t){return t!==IDBDatabase.prototype.transaction||"objectStoreNames"in IDBTransaction.prototype?getCursorAdvanceMethods().includes(t)?function(){for(var e=arguments.length,r=new Array(e),n=0;n<e;n++)r[n]=arguments[n];return t.apply(unwrap(this),r),wrap(cursorRequestMap.get(this))}:function(){for(var e=arguments.length,r=new Array(e),n=0;n<e;n++)r[n]=arguments[n];return wrap(t.apply(unwrap(this),r))}:function(e){for(var r=arguments.length,n=new Array(r>1?r-1:0),o=1;o<r;o++)n[o-1]=arguments[o];const i=t.call(unwrap(this),e,...n);return transactionStoreNamesMap.set(i,e.sort?e.sort():[e]),wrap(i)}}function transformCachableValue(t){return "function"==typeof t?wrapFunction(t):(t instanceof IDBTransaction&&cacheDonePromiseForTransaction(t),e=t,getIdbProxyableTypes().some((t=>e instanceof t))?new Proxy(t,idbProxyTraps):t);var e;}function wrap(t){if(t instanceof IDBRequest)return promisifyRequest(t);if(transformCache.has(t))return transformCache.get(t);const e=transformCachableValue(t);return e!==t&&(transformCache.set(t,e),reverseTransformCache.set(e,t)),e}const unwrap=t=>reverseTransformCache.get(t);function openDB(t,e){let r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},n=r.blocked,o=r.upgrade,i=r.blocking,a=r.terminated;const s=indexedDB.open(t,e),c=wrap(s);return o&&s.addEventListener("upgradeneeded",(t=>{o(wrap(s.result),t.oldVersion,t.newVersion,wrap(s.transaction));})),n&&s.addEventListener("blocked",(()=>n())),c.then((t=>{a&&t.addEventListener("close",(()=>a())),i&&t.addEventListener("versionchange",(()=>i()));})).catch((()=>{})),c}const readMethods=["get","getKey","getAll","getAllKeys","count"],writeMethods=["put","add","delete","clear"],cachedMethods=new Map;function getMethod(t,e){if(!(t instanceof IDBDatabase)||e in t||"string"!=typeof e)return;if(cachedMethods.get(e))return cachedMethods.get(e);const r=e.replace(/FromIndex$/,""),n=e!==r,o=writeMethods.includes(r);if(!(r in(n?IDBIndex:IDBObjectStore).prototype)||!o&&!readMethods.includes(r))return;const i=_async((function(t){const e=this,i=e.transaction(t,o?"readwrite":"readonly");let a=i.store;for(var s=arguments.length,c=new Array(s>1?s-1:0),u=1;u<s;u++)c[u-1]=arguments[u];return n&&(a=a.index(c.shift())),_await(Promise.all([a[r](...c),o&&i.done]),(function(t){return t[0]}))}));return cachedMethods.set(e,i),i}replaceTraps((t=>_objectSpread2(_objectSpread2({},t),{},{get:(e,r,n)=>getMethod(e,r)||t.get(e,r,n),has:(e,r)=>!!getMethod(e,r)||t.has(e,r)})));

  /* minified: lib */
  class ConsoleSink{constructor(e){_defineProperty(this,"scriptName",void 0),_defineProperty(this,"onSuccess",this.onInfo.bind(this)),this.scriptName=e;}formatMessage(e){return "[".concat(this.scriptName,"] ").concat(e)}onDebug(e){console.debug(this.formatMessage(e));}onLog(e){console.log(this.formatMessage(e));}onInfo(e){console.info(this.formatMessage(e));}onWarn(e,t){e=this.formatMessage(e),t?console.warn(e,t):console.warn(e);}onError(e,t){e=this.formatMessage(e),t?console.error(e,t):console.error(e);}}let LogLevel;!function(e){e[e.DEBUG=0]="DEBUG",e[e.LOG=1]="LOG",e[e.INFO=2]="INFO",e[e.SUCCESS=3]="SUCCESS",e[e.WARNING=4]="WARNING",e[e.ERROR=5]="ERROR";}(LogLevel||(LogLevel={}));const HANDLER_NAMES={[LogLevel.DEBUG]:"onDebug",[LogLevel.LOG]:"onLog",[LogLevel.INFO]:"onInfo",[LogLevel.SUCCESS]:"onSuccess",[LogLevel.WARNING]:"onWarn",[LogLevel.ERROR]:"onError"},DEFAULT_OPTIONS={logLevel:LogLevel.INFO,sinks:[]};class Logger{constructor(e){_defineProperty(this,"_configuration",void 0),this._configuration=_objectSpread2(_objectSpread2({},DEFAULT_OPTIONS),e);}fireHandlers(e,t,n){e<this._configuration.logLevel||this._configuration.sinks.forEach((r=>{const o=r[HANDLER_NAMES[e]];o&&(n?o.call(r,t,n):o.call(r,t));}));}debug(e){this.fireHandlers(LogLevel.DEBUG,e);}log(e){this.fireHandlers(LogLevel.LOG,e);}info(e){this.fireHandlers(LogLevel.INFO,e);}success(e){this.fireHandlers(LogLevel.SUCCESS,e);}warn(e,t){this.fireHandlers(LogLevel.WARNING,e,t);}error(e,t){this.fireHandlers(LogLevel.ERROR,e,t);}configure(e){Object.assign(this._configuration,e);}get configuration(){return this._configuration}addSink(e){this._configuration.sinks.push(e);}}const LOGGER=new Logger;function logFailure(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"An error occurred";e.catch((e=>{LOGGER.error(t,e);}));}class AssertionError extends Error{}function assert(e,t){if(!e)throw new AssertionError(null!=t?t:"Assertion failed")}function assertDefined(e,t){assert(void 0!==e,null!=t?t:"Assertion failed: Expected value to be defined");}function assertNonNull(e,t){assert(null!==e,null!=t?t:"Assertion failed: Expected value to be non-null");}function qs(e,t){const n=qsMaybe(e,t);return assertNonNull(n,"Could not find required element"),n}function qsMaybe(e,t){return (null!=t?t:document).querySelector(e)}function qsa(e,t){return [...(null!=t?t:document).querySelectorAll(e)]}function onDocumentLoaded(e){"loading"!==document.readyState?e():document.addEventListener("DOMContentLoaded",e);}function parseDOM(e,t){const n=(new DOMParser).parseFromString(e,"text/html");if(!qsMaybe("base",n.head)){const e=n.createElement("base");e.href=t,n.head.insertAdjacentElement("beforeend",e);}return n}var USERSCRIPT_ID="mb_caa_dimensions";function insertStylesheet(e,t){if(void 0===t&&(t="ROpdebee_".concat(USERSCRIPT_ID,"_css")),null!==qsMaybe("style#".concat(t)))return;const n=function(){var n=document.createElement("style");return n.setAttribute("id",t),appendChildren(n,e),n}.call(this);document.head.insertAdjacentElement("beforeend",n);}function formatFileSize(e){const t=0===e?0:Math.floor(Math.log(e)/Math.log(1024)),n=Number((e/Math.pow(1024,t)).toFixed(2));return "".concat(n," ").concat(["B","kB","MB","GB","TB"][t])}function safeParseJSON(e,t){try{return JSON.parse(e)}catch(n){if(t)throw new Error("".concat(t,": ").concat(n));return}}const getItemMetadata=_async((function(e){return _await(fetch(new URL("https://archive.org/metadata/".concat(e))),(function(e){return _await(e.text(),(function(e){const t=safeParseJSON(e,"Could not parse IA metadata");if(!t.server)throw new Error("Empty IA metadata, item might not exist");if(t.is_dark)throw new Error("Cannot access IA metadata: This item is darkened");return t}))}))}));function memoize(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:e=>"".concat(e[0]);const n=new Map;return function(){for(var r=arguments.length,o=new Array(r),a=0;a<r;a++)o[a]=arguments[a];const s=t(o);if(!n.has(s)){const t=e(...o);n.set(s,t);}return n.get(s)}}function parseVersion(e){return e.split(".").map((e=>parseInt(e)))}function versionLessThan(e,t){let n=0;for(;n<e.length&&n<t.length;){if(e[n]<t[n])return !0;if(e[n]>t[n])return !1;n++;}return e.length<t.length}var CHANGELOG_URL="https://github.com/ROpdebee/mb-userscripts/blob/dist/mb_caa_dimensions.changelog.md",USERSCRIPT_FEATURE_HISTORY=[{versionAdded:"2022.7.3",description:"PDF dimensions and page count"}],css_248z$1=".ROpdebee_feature_list{font-weight:300;margin:0 auto;width:-moz-fit-content;width:fit-content}.ROpdebee_feature_list ul{margin:6px 28px 0 0;text-align:left}";const LAST_DISPLAYED_KEY="ROpdebee_".concat(USERSCRIPT_ID,"_last_notified_update");function maybeDisplayNewFeatures(){const e=localStorage.getItem(LAST_DISPLAYED_KEY),t=GM.info.script;if(!e)return void localStorage.setItem(LAST_DISPLAYED_KEY,t.version);const n=parseVersion(e),r=USERSCRIPT_FEATURE_HISTORY.filter((e=>versionLessThan(n,parseVersion(e.versionAdded))));0!==r.length&&showFeatureNotification(t.name,t.version,r.map((e=>e.description)));}function showFeatureNotification(e,t,n){insertStylesheet(css_248z$1,"ROpdebee_Update_Banner");const r=function(){var o=document.createElement("div");o.setAttribute("class","banner warning-header");var a=document.createElement("p");o.appendChild(a),appendChildren(a,"".concat(e," was updated to v").concat(t,"! "));var s=document.createElement("a");s.setAttribute("href",CHANGELOG_URL),a.appendChild(s);var i=document.createTextNode("See full changelog here");s.appendChild(i),appendChildren(a,". New features since last update:");var c=document.createElement("div");c.setAttribute("class","ROpdebee_feature_list"),o.appendChild(c);var l=document.createElement("ul");c.appendChild(l),appendChildren(l,n.map((e=>function(){var t=document.createElement("li");return appendChildren(t,e),t}.call(this))));var d=document.createElement("button");return d.setAttribute("class","dismiss-banner remove-item icon"),d.setAttribute("data-banner-name","alert"),d.setAttribute("type","button"),d.addEventListener("click",(()=>{r.remove(),localStorage.setItem(LAST_DISPLAYED_KEY,GM.info.script.version);})),o.appendChild(d),o}.call(this);qs("#page").insertAdjacentElement("beforebegin",r);}

  const tryGetPDFPageCount = _async(function (itemId, imageId) {
    const zipListingUrl = "https://archive.org/download/".concat(itemId, "/").concat(itemId, "-").concat(imageId, "_jp2.zip/");
    return _await(fetch(zipListingUrl), function (zipListingResp) {
      return _await(zipListingResp.text(), function (_zipListingResp$text) {
        const page = parseDOM(_zipListingResp$text, zipListingUrl);
        const tbody = qs('tbody', page);
        return qsa('tr', tbody).length - 2;
      });
    });
  });

  const getCAAInfo = _async(function (itemId, imageId) {
    return _await(fetchIAMetadata(itemId), function (iaManifest) {
      const fileNameRegex = new RegExp("mbid-[a-f0-9-]{36}-".concat(imageId, "\\.\\w+$"));
      const imgMetadata = iaManifest.files.find(fileMeta => fileNameRegex.test(fileMeta.name));

      if (typeof imgMetadata === 'undefined') {
        throw new Error("Could not find image \"".concat(imageId, "\" in IA manifest"));
      }

      const _imgMetadata$format$e = imgMetadata.format.endsWith('PDF');

      return _await(_imgMetadata$format$e ? tryGetPDFPageCount(itemId, imageId) : undefined, function (pageCount) {
        return {
          fileType: imgMetadata.format,
          size: parseInt(imgMetadata.size),
          pageCount
        };
      }, !_imgMetadata$format$e);
    });
  });
  const fetchIAMetadata = memoize(itemId => pRetry(() => getItemMetadata(itemId), {
    retries: 5,
    onFailedAttempt: err => {
      LOGGER.warn("Failed to retrieve IA metadata: ".concat(err.cause, ". Retrying\u2026"));
    }
  }));

  function _getImageDimensions(url) {
    LOGGER.info("Getting image dimensions for ".concat(url));
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
          var _evt$message;

          done = true;
          reject(new Error((_evt$message = evt.message) !== null && _evt$message !== void 0 ? _evt$message : 'Image failed to load for unknown reason'));
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
      LOGGER.warn("Failed to retrieve image dimensions: ".concat(err.message, ". Retrying\u2026"));
    }
  }));

  const CAA_ID_REGEX = /(mbid-[a-f\d-]{36})\/mbid-[a-f\d-]{36}-(\d+)/;
  class BaseImage {
    constructor(imgUrl, cache) {
      _defineProperty(this, "imgUrl", void 0);

      _defineProperty(this, "cache", void 0);

      this.imgUrl = imgUrl;
      this.cache = cache;
    }

    getDimensions() {
      const _this = this;

      return _call(function () {
        let _exit = false;
        return _await(_continue(_catch(function () {
          var _this$cache;

          return _await((_this$cache = _this.cache) === null || _this$cache === void 0 ? void 0 : _this$cache.getDimensions(_this.imgUrl), function (cachedResult) {
            if (typeof cachedResult !== 'undefined') {
              _exit = true;
              return cachedResult;
            }
          });
        }, function (err) {
          LOGGER.warn('Failed to retrieve image dimensions from cache', err);
        }), function (_result) {
          let _exit2 = false;
          if (_exit) return _result;
          return _continue(_catch(function () {
            return _await(getImageDimensions(_this.imgUrl), function (liveResult) {
              var _this$cache2;

              return _await((_this$cache2 = _this.cache) === null || _this$cache2 === void 0 ? void 0 : _this$cache2.putDimensions(_this.imgUrl, liveResult), function () {
                _exit2 = true;
                return liveResult;
              });
            });
          }, function (err) {
            LOGGER.error('Failed to retrieve image dimensions', err);
          }), function (_result2) {
            return _exit2 ? _result2 : undefined;
          });
        }));
      });
    }

    getFileInfo() {
      const _this2 = this;

      return _call(function () {
        let _exit3 = false;
        return _await(_continue(_catch(function () {
          var _this2$cache;

          return _await((_this2$cache = _this2.cache) === null || _this2$cache === void 0 ? void 0 : _this2$cache.getFileInfo(_this2.imgUrl), function (cachedResult) {
            if (typeof cachedResult !== 'undefined') {
              _exit3 = true;
              return cachedResult;
            }
          });
        }, function (err) {
          LOGGER.warn('Failed to retrieve image file info from cache', err);
        }), function (_result3) {
          let _exit4 = false;
          if (_exit3) return _result3;
          return _continue(_catch(function () {
            return _await(_this2.loadFileInfo(), function (liveResult) {
              var _this2$cache2;

              return _await((_this2$cache2 = _this2.cache) === null || _this2$cache2 === void 0 ? void 0 : _this2$cache2.putFileInfo(_this2.imgUrl, liveResult), function () {
                _exit4 = true;
                return liveResult;
              });
            });
          }, function (err) {
            LOGGER.error('Failed to retrieve image file info', err);
          }), function (_result4) {
            return _exit4 ? _result4 : undefined;
          });
        }));
      });
    }

    getImageInfo() {
      const _this3 = this;

      return _call(function () {
        return _await(_this3.getDimensions(), function (dimensions) {
          return _await(_this3.getFileInfo(), function (fileInfo) {
            return _objectSpread2({
              dimensions
            }, fileInfo !== null && fileInfo !== void 0 ? fileInfo : {
              size: undefined,
              fileType: undefined
            });
          });
        });
      });
    }

  }

  function transformCAAURL(url) {
    const urlObj = new URL(url);

    if (urlObj.host === 'coverartarchive.org' && urlObj.pathname.startsWith('/release/')) {
      const _urlObj$pathname$spli = urlObj.pathname.split('/').slice(2),
            _urlObj$pathname$spli2 = _slicedToArray(_urlObj$pathname$spli, 2),
            releaseId = _urlObj$pathname$spli2[0],
            imageName = _urlObj$pathname$spli2[1];

      urlObj.href = "https://archive.org/download/mbid-".concat(releaseId, "/mbid-").concat(releaseId, "-").concat(imageName);
    }

    if (urlObj.pathname.endsWith('.pdf')) {
      const _urlObj$pathname$spli3 = urlObj.pathname.split('/').slice(3),
            _urlObj$pathname$spli4 = _slicedToArray(_urlObj$pathname$spli3, 1),
            imageName = _urlObj$pathname$spli4[0];

      const imageBasename = imageName.replace(/\.pdf$/, '');
      urlObj.pathname = urlObj.pathname.replace(/\.pdf$/, "_jp2.zip/".concat(imageBasename, "_jp2%2F").concat(imageBasename, "_0000.jp2"));
      urlObj.search = '?ext=jpg';
    }

    return urlObj.href;
  }

  function parseCAAIDs(url) {
    const urlObj = new URL(url);

    if (urlObj.host === 'coverartarchive.org' && urlObj.pathname.startsWith('/release/')) {
      var _thumbName$match;

      const _urlObj$pathname$spli5 = urlObj.pathname.split('/').slice(2),
            _urlObj$pathname$spli6 = _slicedToArray(_urlObj$pathname$spli5, 2),
            releaseId = _urlObj$pathname$spli6[0],
            thumbName = _urlObj$pathname$spli6[1];

      const imageId = (_thumbName$match = thumbName.match(/^(\d+)/)) === null || _thumbName$match === void 0 ? void 0 : _thumbName$match[0];
      assertDefined(imageId, 'Malformed URL');
      return ["mbid-".concat(releaseId), imageId];
    }

    if (urlObj.host !== 'archive.org') {
      throw new Error('Unsupported URL');
    }

    const matchGroups = urlObj.pathname.match(CAA_ID_REGEX);

    if (matchGroups === null) {
      LOGGER.error("Failed to extract image ID from URL ".concat(url));
      throw new Error('Invalid URL');
    }

    const _matchGroups$slice = matchGroups.slice(1),
          _matchGroups$slice2 = _slicedToArray(_matchGroups$slice, 2),
          itemId = _matchGroups$slice2[0],
          imageId = _matchGroups$slice2[1];

    return [itemId, imageId];
  }

  class CAAImage extends BaseImage {
    constructor(fullSizeUrl, cache, thumbnailUrl) {
      fullSizeUrl = transformCAAURL(fullSizeUrl);
      super(fullSizeUrl, cache);

      _defineProperty(this, "itemId", void 0);

      _defineProperty(this, "imageId", void 0);

      const _parseCAAIDs = parseCAAIDs(thumbnailUrl !== null && thumbnailUrl !== void 0 ? thumbnailUrl : fullSizeUrl),
            _parseCAAIDs2 = _slicedToArray(_parseCAAIDs, 2),
            itemId = _parseCAAIDs2[0],
            imageId = _parseCAAIDs2[1];

      this.itemId = itemId;
      this.imageId = imageId;
    }

    loadFileInfo() {
      return getCAAInfo(this.itemId, this.imageId);
    }

  }
  class QueuedUploadImage {
    constructor(imgElement) {
      _defineProperty(this, "imgElement", void 0);

      this.imgElement = imgElement;
    }

    getFileInfo() {
      return Promise.resolve(undefined);
    }

    getDimensions() {
      return new Promise(resolve => {
        const onLoad = () => {
          resolve({
            width: this.imgElement.naturalWidth,
            height: this.imgElement.naturalHeight
          });
        };

        this.imgElement.addEventListener('load', onLoad);

        if (this.imgElement.complete) {
          this.imgElement.removeEventListener('load', onLoad);
          onLoad();
        }
      });
    }

  }

  function createDimensionsString(imageInfo) {
      return typeof imageInfo.dimensions !== 'undefined' ? ''.concat(imageInfo.dimensions.width, 'x').concat(imageInfo.dimensions.height) : 'failed :(';
  }
  function createFileInfoString(imageInfo) {
      const details = [];
      if (typeof imageInfo.size !== 'undefined') {
          details.push(formatFileSize(imageInfo.size));
      }
      if (typeof imageInfo.fileType !== 'undefined') {
          details.push(imageInfo.fileType);
      }
      if (typeof imageInfo.pageCount !== 'undefined') {
          details.push(imageInfo.pageCount.toString() + (imageInfo.pageCount === 1 ? ' page' : ' pages'));
      }
      return details.join(', ');
  }
  class BaseDisplayedImage {
      constructor(imgElement) {
          _defineProperty(this, 'imgElement', void 0);
          _defineProperty(this, '_dimensionsSpan', null);
          _defineProperty(this, '_fileInfoSpan', null);
          this.imgElement = imgElement;
      }
      get dimensionsSpan() {
          if (this._dimensionsSpan !== null)
              return this._dimensionsSpan;
          this._dimensionsSpan = qsMaybe('span.ROpdebee_dimensions', this.imgElement.parentElement);
          if (this._dimensionsSpan !== null)
              return this._dimensionsSpan;
          this._dimensionsSpan = function () {
              var $$a = document.createElement('span');
              $$a.setAttribute('class', 'ROpdebee_dimensions');
              return $$a;
          }.call(this);
          this.imgElement.insertAdjacentElement('afterend', this._dimensionsSpan);
          return this._dimensionsSpan;
      }
      get fileInfoSpan() {
          if (this._fileInfoSpan !== null)
              return this._fileInfoSpan;
          this._fileInfoSpan = qsMaybe('span.ROpdebee_fileInfo', this.imgElement.parentElement);
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
      constructor(imgElement, image) {
          super(imgElement);
          _defineProperty(this, 'image', void 0);
          this.image = image;
      }
      loadAndDisplay() {
          const _this = this;
          return _call(function () {
              if (_this.imgElement.getAttribute('ROpdebee_lazyDimensions')) {
                  return _await();
              }
              _this.displayInfo('pending\u2026');
              return _await(_continueIgnored(_catch(function () {
                  return _await(_this.image.getImageInfo(), function (imageInfo) {
                      _this.displayInfo(_this.createDimensionsString(imageInfo), _this.createFileInfoString(imageInfo));
                  });
              }, function (err) {
                  LOGGER.error('Failed to load image information', err);
                  _this.displayInfo('failed :(');
              })));
          });
      }
      displayInfo(dimensionsString, fileInfoString) {
          this.imgElement.setAttribute('ROpdebee_lazyDimensions', dimensionsString);
          this.dimensionsSpan.textContent = dimensionsString;
          if (typeof fileInfoString !== 'undefined') {
              this.fileInfoSpan.textContent = fileInfoString;
          }
      }
      createDimensionsString(imageInfo) {
          return 'Dimensions: '.concat(createDimensionsString(imageInfo));
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
      constructor(imgElement, cache) {
          var _imgElement$closest;
          const fullSizeUrl = (_imgElement$closest = imgElement.closest('a.artwork-image, a.artwork-pdf')) === null || _imgElement$closest === void 0 ? void 0 : _imgElement$closest.href;
          assertDefined(fullSizeUrl);
          super(imgElement, new CAAImage(fullSizeUrl, cache, imgElement.src));
      }
  }
  class CoverArtTabCAAImage extends DisplayedCAAImage {
      constructor(imgElement, cache) {
          const container = imgElement.closest('div.artwork-cont');
          assertNonNull(container);
          const fullSizeUrl = qs('p.small > a:last-of-type', container).href;
          super(imgElement, new CAAImage(fullSizeUrl, cache));
      }
  }
  class CAAImageWithFullSizeURL extends DisplayedCAAImage {
      constructor(imgElement, cache) {
          const fullSizeUrl = imgElement.getAttribute('fullSizeURL');
          assertNonNull(fullSizeUrl);
          super(imgElement, new CAAImage(fullSizeUrl, cache));
      }
  }
  class ThumbnailCAAImage extends ArtworkImageAnchorCAAImage {
      createDimensionsString(imageInfo) {
          return createDimensionsString(imageInfo);
      }
  }
  class DisplayedQueuedUploadImage extends BaseDisplayedImage {
      constructor(imgElement) {
          super(imgElement);
          _defineProperty(this, 'image', void 0);
          this.image = new QueuedUploadImage(imgElement);
      }
      loadAndDisplay() {
          const _this2 = this;
          return _call(function () {
              return _this2.imgElement.src.endsWith('/static/images/icons/pdf-icon.png') ? _await() : _await(_this2.image.getDimensions(), function (dimensions) {
                  const infoString = ''.concat(dimensions.width, 'x').concat(dimensions.height);
                  _this2.dimensionsSpan.textContent = infoString;
              });
          });
      }
  }
  function displayedCoverArtFactory(img, cache) {
      try {
          if (img.closest('.artwork-cont') !== null) {
              return new CoverArtTabCAAImage(img, cache);
          } else if (img.closest('.thumb-position') !== null || img.closest('form#set-cover-art') !== null) {
              return new ThumbnailCAAImage(img, cache);
          } else {
              return new ArtworkImageAnchorCAAImage(img, cache);
          }
      } catch (err) {
          LOGGER.error('Failed to process image', err);
          return undefined;
      }
  }
  const displayInfoWhenInView = (() => {
      const imageMap = new Map();
      function inViewCb(entries) {
          entries.filter(entry => entry.intersectionRatio > 0).forEach(entry => {
              const image = imageMap.get(entry.target);
              logFailure(image.loadAndDisplay(), 'Failed to process image');
          });
      }
      const observer = new IntersectionObserver(inViewCb, { root: document });
      return image => {
          if (imageMap.has(image.imgElement)) {
              return;
          }
          imageMap.set(image.imgElement, image);
          observer.observe(image.imgElement);
      };
  })();

  function setupExports(cachePromise) {
    const loadImageDimensions = _async(function (imgUrl) {
      return _await(getCAAImageInfo(imgUrl), function (imageInfo) {
        var _imageInfo$dimensions;

        return _objectSpread2(_objectSpread2({
          url: imgUrl
        }, (_imageInfo$dimensions = imageInfo.dimensions) !== null && _imageInfo$dimensions !== void 0 ? _imageInfo$dimensions : {
          width: 0,
          height: 0
        }), {}, {
          size: imageInfo.size,
          format: imageInfo.fileType
        });
      });
    });

    const getCAAImageInfo = _async(function (imgUrl) {
      if (new URL(imgUrl).hostname !== 'archive.org') {
        throw new Error('Unsupported URL: Need direct image URL');
      }

      return _await(cachePromise, function (cache) {
        const image = new CAAImage(imgUrl, cache);
        return image.getImageInfo();
      });
    });

    function getDimensionsWhenInView(imgElement) {
      logFailure(cachePromise.then(cache => {
        const image = new CAAImageWithFullSizeURL(imgElement, cache);
        displayInfoWhenInView(image);
      }), "Something went wrong when attempting to load image info for ".concat(imgElement.src));
    }

    window.ROpdebee_getDimensionsWhenInView = getDimensionsWhenInView;
    window.ROpdebee_loadImageDimensions = loadImageDimensions;
    window.ROpdebee_getCAAImageInfo = getCAAImageInfo;
  }

  const maybePruneDb = _async(function (db) {
    var _localStorage$getItem;

    const iterateAndPrune = _async(function (storeName) {
      return _await(db.transaction(storeName, 'readwrite').store.index(CACHE_ADDED_TIMESTAMP_INDEX).openCursor(pruneRange), function (cursor) {
        return _continueIgnored(_for(function () {
          return cursor !== null;
        }, void 0, function () {
          LOGGER.debug("Removing ".concat(cursor.key, " (added at ").concat(new Date(cursor.value.addedDatetime), ")"));
          return _await(cursor.delete(), function () {
            return _await(cursor.continue(), function (_cursor$continue) {
              cursor = _cursor$continue;
            });
          });
        }));
      });
    });

    const lastPruneTimestamp = parseInt((_localStorage$getItem = localStorage.getItem(CACHE_TIMESTAMP_NAME)) !== null && _localStorage$getItem !== void 0 ? _localStorage$getItem : '0');
    const timeSinceLastPrune = Date.now() - lastPruneTimestamp;

    if (timeSinceLastPrune < CACHE_CHECK_INTERVAL) {
      LOGGER.debug("Cache was last pruned at ".concat(new Date(lastPruneTimestamp), ", pruning is unnecessary"));
      return;
    }

    LOGGER.info('Pruning stale entries from cache');
    const pruneRange = IDBKeyRange.upperBound(Date.now() - CACHE_STALE_TIME);
    return _await(iterateAndPrune(CACHE_DIMENSIONS_STORE_NAME), function () {
      return _await(iterateAndPrune(CACHE_FILE_INFO_STORE_NAME), function () {
        LOGGER.debug('Done pruning stale entries');
        localStorage.setItem(CACHE_TIMESTAMP_NAME, Date.now().toString());
      });
    });
  });

  const createCache = _async(function () {
    let _exit = false;
    return _invoke(function () {
      if (typeof window.indexedDB !== 'undefined') {
        return _catch(function () {
          return _await(IndexedDBInfoCache.create(), function (_await$IndexedDBInfoC) {
            _exit = true;
            return _await$IndexedDBInfoC;
          });
        }, function (err) {
          LOGGER.error('Failed to create IndexedDB-backed image information cache, repeated lookups will be slow!', err);
        });
      } else {
        LOGGER.warn('Your browser does not seem to support IndexedDB. A persistent image information cache will not be used, which may result in slower lookups. Consider upgrading to a more modern browser version for improved performance.');
      }
    }, function (_result2) {
      return _exit ? _result2 : new NoInfoCache();
    });
  });
  const CACHE_DB_NAME = 'ROpdebee_CAA_Dimensions_Cache';
  const CACHE_DIMENSIONS_STORE_NAME = 'dimensionsStore';
  const CACHE_FILE_INFO_STORE_NAME = 'fileInfoStore';
  const CACHE_ADDED_TIMESTAMP_INDEX = 'addedDatetimeIdx';
  const CACHE_DB_VERSION = 2;
  const CACHE_TIMESTAMP_NAME = 'ROpdebee_Last_Cache_Prune_Check';
  const CACHE_CHECK_INTERVAL = 24 * 60 * 60 * 1000;
  const CACHE_STALE_TIME = 14 * 24 * 60 * 60 * 1000;

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
    constructor(db) {
      _defineProperty(this, "db", void 0);

      this.db = db;
    }

    static create() {
      return _call(function () {
        return _await(new Promise((resolve, reject) => {
          let wasBlocked = false;
          const dbPromise = openDB(CACHE_DB_NAME, CACHE_DB_VERSION, {
            upgrade: function upgrade(database, oldVersion, newVersion, tx) {
              try {
                LOGGER.info("Creating or upgrading IndexedDB cache version ".concat(newVersion));

                if (oldVersion < 1) {
                  const dimensionsStore = database.createObjectStore(CACHE_DIMENSIONS_STORE_NAME);
                  dimensionsStore.createIndex(CACHE_ADDED_TIMESTAMP_INDEX, 'addedDatetime');
                  const fileInfoStore = database.createObjectStore(CACHE_FILE_INFO_STORE_NAME);
                  fileInfoStore.createIndex(CACHE_ADDED_TIMESTAMP_INDEX, 'addedDatetime');
                  return _await();
                }

                return _await(_continueIgnored(_for(function () {
                  return oldVersion < newVersion;
                }, void 0, function () {
                  LOGGER.info("Upgrading IndexedDB cache from version ".concat(oldVersion, " to ").concat(oldVersion + 1));
                  const migrator = DbMigrations[oldVersion];
                  return _await(migrator(database, tx), function () {
                    oldVersion++;
                  });
                })));
              } catch (e) {
                return Promise.reject(e);
              }
            },

            blocked() {
              wasBlocked = true;
              reject(new Error('Required schema change on cache DB is blocked by an older version of the script. Please close or reload any other tab on which this script is running'));
            },

            blocking() {
              LOGGER.warn('Closing DB for schema change in other tab');
              logFailure(dbPromise.then(db => {
                db.close();
              }), 'Failed to close database');
            }

          });
          dbPromise.then(_async(function (db) {
            LOGGER.debug('Successfully opened IndexedDB cache');
            return _await(maybePruneDb(db), function () {
              if (!wasBlocked) {
                resolve(new IndexedDBInfoCache(db));
              }
            });
          })).catch(reject);
        }));
      });
    }

    get(storeName, imageUrl) {
      const _this = this;

      return _call(function () {
        return _await(_catch(function () {
          return _await(_this.db.get(storeName, imageUrl), function (cachedResult) {
            if (typeof cachedResult !== 'undefined') {
              LOGGER.debug("".concat(imageUrl, ": Cache hit"));
            } else {
              LOGGER.debug("".concat(imageUrl, ": Cache miss"));
            }

            return cachedResult;
          });
        }, function (err) {
          LOGGER.error("Failed to load ".concat(imageUrl, " from cache"), err);
          throw err;
        }));
      });
    }

    put(storeName, imageUrl, value) {
      const _this2 = this;

      return _call(function () {
        return _await(_continueIgnored(_catch(function () {
          return _await(_this2.db.put(storeName, _objectSpread2(_objectSpread2({}, value), {}, {
            addedDatetime: Date.now()
          }), imageUrl), function () {
            LOGGER.debug("Successfully stored ".concat(imageUrl, " in cache"));
          });
        }, function (err) {
          LOGGER.error("Failed to store ".concat(imageUrl, " in cache"), err);
        })));
      });
    }

    getDimensions(imageUrl) {
      const _this3 = this;

      return _call(function () {
        return _await(_this3.get(CACHE_DIMENSIONS_STORE_NAME, imageUrl));
      });
    }

    putDimensions(imageUrl, dimensions) {
      const _this4 = this;

      return _call(function () {
        return _await(_this4.put(CACHE_DIMENSIONS_STORE_NAME, imageUrl, dimensions));
      });
    }

    getFileInfo(imageUrl) {
      const _this5 = this;

      return _call(function () {
        return _await(_this5.get(CACHE_FILE_INFO_STORE_NAME, imageUrl));
      });
    }

    putFileInfo(imageUrl, fileInfo) {
      const _this6 = this;

      return _call(function () {
        return _await(_this6.put(CACHE_FILE_INFO_STORE_NAME, imageUrl, fileInfo));
      });
    }

  }

  const DbMigrations = {
    1: function _(db, tx) {
      try {
        const txV1 = tx;
        const dbV1 = db;
        return _await(txV1.objectStore('cacheStore').getAll(), function (oldRecords) {
          dbV1.deleteObjectStore('cacheStore');
          const newDimensionsStore = db.createObjectStore(CACHE_DIMENSIONS_STORE_NAME);
          const newFileInfoStore = db.createObjectStore(CACHE_FILE_INFO_STORE_NAME);
          newDimensionsStore.createIndex(CACHE_ADDED_TIMESTAMP_INDEX, 'addedDatetime');
          newFileInfoStore.createIndex(CACHE_ADDED_TIMESTAMP_INDEX, 'addedDatetime');
          return _awaitIgnored(Promise.all(oldRecords.map(_async(function (rec) {
            return _await(tx.objectStore(CACHE_DIMENSIONS_STORE_NAME).put({
              width: rec.width,
              height: rec.height,
              addedDatetime: rec.added_datetime
            }, rec.url), function () {
              return _awaitIgnored(tx.objectStore(CACHE_FILE_INFO_STORE_NAME).put({
                size: rec.size,
                fileType: rec.format,
                addedDatetime: rec.added_datetime
              }, rec.url));
            });
          }))));
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }
  };

  var css_248z = "div.thumb-position{display:flex;flex-direction:column;height:auto}.image-position{display:flex;flex-direction:row;flex-wrap:wrap}div.thumb-position>div:last-of-type{margin-top:auto;padding-top:5px}div.thumb-position>div:last-of-type:before{margin-bottom:auto}div.thumb-position img{display:block;margin:auto}span.cover-art-image{display:inline-block}span.ROpdebee_dimensions,span.ROpdebee_fileInfo{display:block}a.artwork-image span.ROpdebee_dimensions,a.artwork-image span.ROpdebee_fileInfo,a.artwork-pdf span.ROpdebee_dimensions,a.artwork-pdf span.ROpdebee_fileInfo{text-align:center}td.edit-cover-art span.ROpdebee_dimensions,td.edit-cover-art span.ROpdebee_fileInfo{max-width:250px}div.thumb-position span.ROpdebee_dimensions,div.thumb-position span.ROpdebee_fileInfo{font-size:smaller;text-align:center}div.thumb-position span.ROpdebee_dimensions{padding-top:.5em}div.thumb-position span.ROpdebee_fileInfo{padding-bottom:.5em}img.uploader-preview-column>span.ROpdebee_dimensions{display:inline}";

  if (document.location.hostname === 'musicbrainz.org' || document.location.hostname.endsWith('.musicbrainz.org')) {
      onDocumentLoaded(maybeDisplayNewFeatures);
  }

  const processPageChange = _async(function (mutations, cache) {
    mutations.flatMap(mutation => [...mutation.addedNodes]).filter(addedNode => addedNode instanceof HTMLImageElement).forEach(addedImage => {
      const displayedImage = displayedCoverArtFactory(addedImage, cache);
      if (!displayedImage) return;
      displayInfoWhenInView(displayedImage);
    });
    return _await();
  });

  LOGGER.configure({
    logLevel: LogLevel.INFO
  });
  LOGGER.addSink(new ConsoleSink(USERSCRIPT_ID));

  function observeQueuedUploads(queuedUploadTable) {
    const queuedUploadObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        [...mutation.addedNodes].filter(addedNode => addedNode instanceof HTMLTableRowElement).forEach(addedRow => {
          const img = qsMaybe('img', addedRow);

          if (img !== null) {
            displayInfoWhenInView(new DisplayedQueuedUploadImage(img));
          }
        });
      });
    });
    queuedUploadObserver.observe(qs('tbody', queuedUploadTable), {
      childList: true
    });
  }

  function detectAndObserveImages(cache) {
    const imageLoadObserver = new MutationObserver(mutations => {
      logFailure(processPageChange(mutations, cache));
    });
    qsa('.cover-art-image').forEach(container => {
      const imgElement = qsMaybe('img', container);

      if (imgElement === null) {
        imageLoadObserver.observe(container, {
          childList: true
        });
      } else {
        const displayedImage = displayedCoverArtFactory(imgElement, cache);
        if (!displayedImage) return;
        displayInfoWhenInView(displayedImage);
      }
    });
    const queuedUploadTable = qsMaybe('#add-cover-art > table');

    if (queuedUploadTable !== null) {
      observeQueuedUploads(queuedUploadTable);
    }
  }

  const cachePromise = createCache();
  setupExports(cachePromise);
  onDocumentLoaded(() => {
    insertStylesheet(css_248z);
    logFailure(cachePromise.then(cache => {
      detectAndObserveImages(cache);
    }));
  });

})();
