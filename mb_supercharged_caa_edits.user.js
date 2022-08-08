// ==UserScript==
// @name         MB: Supercharged Cover Art Edits
// @description  Supercharges reviewing cover art edits. Displays release information on CAA edits. Enables image comparisons on removed and added images.
// @version      2022.8.8
// @author       ROpdebee
// @license      MIT; https://opensource.org/licenses/MIT
// @namespace    https://github.com/ROpdebee/mb-userscripts
// @homepageURL  https://github.com/ROpdebee/mb-userscripts
// @supportURL   https://github.com/ROpdebee/mb-userscripts/issues
// @downloadURL  https://raw.github.com/ROpdebee/mb-userscripts/dist/mb_supercharged_caa_edits.user.js
// @updateURL    https://raw.github.com/ROpdebee/mb-userscripts/dist/mb_supercharged_caa_edits.meta.js
// @include      /^https?://(\w+\.)?musicbrainz\.org/edit/\d+([?#]|$)/
// @include      /^https?://(\w+\.)?musicbrainz\.org/edit/(open|subscribed(_editors)?)([?#]|$)/
// @include      /^https?://(\w+\.)?musicbrainz\.org/(area|artist|collection|event|instrument|label|place|recording|release|release-group|series|work|url)/[a-f\d-]{36}/(open_)?edits([?#]|$)/
// @include      /^https?://(\w+\.)?musicbrainz\.org/user/[^/]+/edits(/\w+)?([?#]|$)/
// @include      /^https?://(\w+\.)?musicbrainz\.org/user/[^/]+/votes([?#]|$)/
// @include      /^https?://(\w+\.)?musicbrainz\.org/search/edits\?.+?(#.+?)?$/
// @require      https://cdn.jsdelivr.net/npm/resemblejs@4.1.0/resemble.min.js
// @require      https://cdn.jsdelivr.net/npm/moment@2.29.3/min/moment-with-locales.min.js
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/jquery-ui-dist@1.13.1/jquery-ui.min.js
// @run-at       document-end
// @grant        none
// ==/UserScript==

// For original source code, see https://github.com/ROpdebee/mb-userscripts/tree/main/src/mb_supercharged_caa_edits
(function () {
  'use strict';

  /* minified: babel helpers, nativejsx, babel-plugin-transform-async-to-promises, retry, p-retry, ts-custom-error */
  var appendChildren=function(t,e){(e=Array.isArray(e)?e:[e]).forEach((function(e){e instanceof HTMLElement?t.appendChild(e):(e||"string"==typeof e)&&t.appendChild(document.createTextNode(e.toString()));}));},setStyles=function(t,e){for(const r in e)t.style[r]=e[r];};function ownKeys(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n);}return r}function _objectSpread2(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?ownKeys(Object(r),!0).forEach((function(e){_defineProperty(t,e,r[e]);})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):ownKeys(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e));}));}return t}function _defineProperty(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function _slicedToArray(t,e){return _arrayWithHoles(t)||_iterableToArrayLimit(t,e)||_unsupportedIterableToArray(t,e)||_nonIterableRest()}function _arrayWithHoles(t){if(Array.isArray(t))return t}function _iterableToArrayLimit(t,e){var r=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=r){var n,o,i=[],a=!0,s=!1;try{for(r=r.call(t);!(a=(n=r.next()).done)&&(i.push(n.value),!e||i.length!==e);a=!0);}catch(u){s=!0,o=u;}finally{try{a||null==r.return||r.return();}finally{if(s)throw o}}return i}}function _unsupportedIterableToArray(t,e){if(t){if("string"==typeof t)return _arrayLikeToArray(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);return "Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?_arrayLikeToArray(t,e):void 0}}function _arrayLikeToArray(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _createForOfIteratorHelper(t,e){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!r){if(Array.isArray(t)||(r=_unsupportedIterableToArray(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,o=function(){};return {s:o,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,a=!0,s=!1;return {s:function(){r=r.call(t);},n:function(){var t=r.next();return a=t.done,t},e:function(t){s=!0,i=t;},f:function(){try{a||null==r.return||r.return();}finally{if(s)throw i}}}}const _Pact=function(){function t(){}return t.prototype.then=function(e,r){const n=new t,o=this.s;if(o){const t=1&o?e:r;if(t){try{_settle(n,1,t(this.v));}catch(i){_settle(n,2,i);}return n}return this}return this.o=function(t){try{const o=t.v;1&t.s?_settle(n,1,e?e(o):o):r?_settle(n,1,r(o)):_settle(n,2,o);}catch(i){_settle(n,2,i);}},n},t}();function _settle(t,e,r){if(!t.s){if(r instanceof _Pact){if(!r.s)return void(r.o=_settle.bind(null,t,e));1&e&&(e=r.s),r=r.v;}if(r&&r.then)return void r.then(_settle.bind(null,t,e),_settle.bind(null,t,2));t.s=e,t.v=r;const n=t.o;n&&n(t);}}function _isSettledPact(t){return t instanceof _Pact&&1&t.s}function _async(t){return function(){for(var e=[],r=0;r<arguments.length;r++)e[r]=arguments[r];try{return Promise.resolve(t.apply(this,e))}catch(n){return Promise.reject(n)}}}function _await(t,e,r){return r?e?e(t):t:(t&&t.then||(t=Promise.resolve(t)),e?t.then(e):t)}function _awaitIgnored(t,e){if(!e)return t&&t.then?t.then(_empty):Promise.resolve()}function _continue(t,e){return t&&t.then?t.then(e):e(t)}function _forTo(t,e,r){var n,o,i=-1;return function a(s){try{for(;++i<t.length&&(!r||!r());)if((s=e(i))&&s.then){if(!_isSettledPact(s))return void s.then(a,o||(o=_settle.bind(null,n=new _Pact,2)));s=s.v;}n?_settle(n,1,s):n=s;}catch(u){_settle(n||(n=new _Pact),2,u);}}(),n}const _iteratorSymbol="undefined"!=typeof Symbol?Symbol.iterator||(Symbol.iterator=Symbol("Symbol.iterator")):"@@iterator";function _forOf(t,e,r){if("function"==typeof t[_iteratorSymbol]){var n,o,i,a=t[_iteratorSymbol]();if(function t(s){try{for(;!((n=a.next()).done||r&&r());)if((s=e(n.value))&&s.then){if(!_isSettledPact(s))return void s.then(t,i||(i=_settle.bind(null,o=new _Pact,2)));s=s.v;}o?_settle(o,1,s):o=s;}catch(u){_settle(o||(o=new _Pact),2,u);}}(),a.return){var s=function(t){try{n.done||a.return();}catch(e){}return t};if(o&&o.then)return o.then(s,(function(t){throw s(t)}));s();}return o}if(!("length"in t))throw new TypeError("Object is not iterable");for(var u=[],c=0;c<t.length;c++)u.push(t[c]);return _forTo(u,(function(t){return e(u[t])}),r)}const _asyncIteratorSymbol="undefined"!=typeof Symbol?Symbol.asyncIterator||(Symbol.asyncIterator=Symbol("Symbol.asyncIterator")):"@@asyncIterator";function _for(t,e,r){for(var n;;){var o=t();if(_isSettledPact(o)&&(o=o.v),!o)return i;if(o.then){n=0;break}var i=r();if(i&&i.then){if(!_isSettledPact(i)){n=1;break}i=i.s;}if(e){var a=e();if(a&&a.then&&!_isSettledPact(a)){n=2;break}}}var s=new _Pact,u=_settle.bind(null,s,2);return (0===n?o.then(l):1===n?i.then(c):a.then(f)).then(void 0,u),s;function c(n){i=n;do{if(e&&(a=e())&&a.then&&!_isSettledPact(a))return void a.then(f).then(void 0,u);if(!(o=t())||_isSettledPact(o)&&!o.v)return void _settle(s,1,i);if(o.then)return void o.then(l).then(void 0,u);_isSettledPact(i=r())&&(i=i.v);}while(!i||!i.then);i.then(c).then(void 0,u);}function l(t){t?(i=r())&&i.then?i.then(c).then(void 0,u):c(i):_settle(s,1,i);}function f(){(o=t())?o.then?o.then(l).then(void 0,u):l(o):_settle(s,1,i);}}function _call(t,e,r){if(r)return e?e(t()):t();try{var n=Promise.resolve(t());return e?n.then(e):n}catch(o){return Promise.reject(o)}}function _invoke(t,e){var r=t();return r&&r.then?r.then(e):e(r)}function _invokeIgnored(t){var e=t();if(e&&e.then)return e.then(_empty)}function _catch(t,e){try{var r=t();}catch(n){return e(n)}return r&&r.then?r.then(void 0,e):r}function _empty(){}const _earlyReturn={};function getDefaultExportFromCjs(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}!function(){function t(t){this._entry=t,this._pact=null,this._resolve=null,this._return=null,this._promise=null;}function e(t){return {value:t,done:!0}}function r(t){return {value:t,done:!1}}t.prototype._yield=function(t){return this._resolve(t&&t.then?t.then(r):r(t)),this._pact=new _Pact},t.prototype.next=function(t){const r=this;return r._promise=new Promise((function(n){const o=r._pact;if(null===o){const s=r._entry;if(null===s)return n(r._promise);function i(t){r._resolve(t&&t.then?t.then(e):e(t)),r._pact=null,r._resolve=null;}r._entry=null,r._resolve=n;var a=s(r);a&&a.then?a.then(i,(function(t){if(t===_earlyReturn)i(r._return);else {const e=new _Pact;r._resolve(e),r._pact=null,r._resolve=null,_resolve(e,2,t);}})):i(a);}else r._pact=null,r._resolve=n,_settle(o,1,t);}))},t.prototype.return=function(t){const r=this;return r._promise=new Promise((function(n){const o=r._pact;if(null===o)return null===r._entry?n(r._promise):(r._entry=null,n(t&&t.then?t.then(e):e(t)));r._return=t,r._resolve=n,r._pact=null,_settle(o,2,_earlyReturn);}))},t.prototype.throw=function(t){const e=this;return e._promise=new Promise((function(r,n){const o=e._pact;if(null===o)return null===e._entry?r(e._promise):(e._entry=null,n(t));e._resolve=r,e._pact=null,_settle(o,2,t);}))},t.prototype[_asyncIteratorSymbol]=function(){return this};}();var retry$2={exports:{}},retry$1={};function RetryOperation(t,e){"boolean"==typeof e&&(e={forever:e}),this._originalTimeouts=JSON.parse(JSON.stringify(t)),this._timeouts=t,this._options=e||{},this._maxRetryTime=e&&e.maxRetryTime||1/0,this._fn=null,this._errors=[],this._attempts=1,this._operationTimeout=null,this._operationTimeoutCb=null,this._timeout=null,this._operationStart=null,this._timer=null,this._options.forever&&(this._cachedTimeouts=this._timeouts.slice(0));}var retry_operation=RetryOperation;RetryOperation.prototype.reset=function(){this._attempts=1,this._timeouts=this._originalTimeouts.slice(0);},RetryOperation.prototype.stop=function(){this._timeout&&clearTimeout(this._timeout),this._timer&&clearTimeout(this._timer),this._timeouts=[],this._cachedTimeouts=null;},RetryOperation.prototype.retry=function(t){if(this._timeout&&clearTimeout(this._timeout),!t)return !1;var e=(new Date).getTime();if(t&&e-this._operationStart>=this._maxRetryTime)return this._errors.push(t),this._errors.unshift(new Error("RetryOperation timeout occurred")),!1;this._errors.push(t);var r=this._timeouts.shift();if(void 0===r){if(!this._cachedTimeouts)return !1;this._errors.splice(0,this._errors.length-1),r=this._cachedTimeouts.slice(-1);}var n=this;return this._timer=setTimeout((function(){n._attempts++,n._operationTimeoutCb&&(n._timeout=setTimeout((function(){n._operationTimeoutCb(n._attempts);}),n._operationTimeout),n._options.unref&&n._timeout.unref()),n._fn(n._attempts);}),r),this._options.unref&&this._timer.unref(),!0},RetryOperation.prototype.attempt=function(t,e){this._fn=t,e&&(e.timeout&&(this._operationTimeout=e.timeout),e.cb&&(this._operationTimeoutCb=e.cb));var r=this;this._operationTimeoutCb&&(this._timeout=setTimeout((function(){r._operationTimeoutCb();}),r._operationTimeout)),this._operationStart=(new Date).getTime(),this._fn(this._attempts);},RetryOperation.prototype.try=function(t){console.log("Using RetryOperation.try() is deprecated"),this.attempt(t);},RetryOperation.prototype.start=function(t){console.log("Using RetryOperation.start() is deprecated"),this.attempt(t);},RetryOperation.prototype.start=RetryOperation.prototype.try,RetryOperation.prototype.errors=function(){return this._errors},RetryOperation.prototype.attempts=function(){return this._attempts},RetryOperation.prototype.mainError=function(){if(0===this._errors.length)return null;for(var t={},e=null,r=0,n=0;n<this._errors.length;n++){var o=this._errors[n],i=o.message,a=(t[i]||0)+1;t[i]=a,a>=r&&(e=o,r=a);}return e},function(t){var e=retry_operation;t.operation=function(r){var n=t.timeouts(r);return new e(n,{forever:r&&(r.forever||r.retries===1/0),unref:r&&r.unref,maxRetryTime:r&&r.maxRetryTime})},t.timeouts=function(t){if(t instanceof Array)return [].concat(t);var e={retries:10,factor:2,minTimeout:1e3,maxTimeout:1/0,randomize:!1};for(var r in t)e[r]=t[r];if(e.minTimeout>e.maxTimeout)throw new Error("minTimeout is greater than maxTimeout");for(var n=[],o=0;o<e.retries;o++)n.push(this.createTimeout(o,e));return t&&t.forever&&!n.length&&n.push(this.createTimeout(o,e)),n.sort((function(t,e){return t-e})),n},t.createTimeout=function(t,e){var r=e.randomize?Math.random()+1:1,n=Math.round(r*Math.max(e.minTimeout,1)*Math.pow(e.factor,t));return Math.min(n,e.maxTimeout)},t.wrap=function(e,r,n){if(r instanceof Array&&(n=r,r=null),!n)for(var o in n=[],e)"function"==typeof e[o]&&n.push(o);for(var i=0;i<n.length;i++){var a=n[i],s=e[a];e[a]=function(n){var o=t.operation(r),i=Array.prototype.slice.call(arguments,1),a=i.pop();i.push((function(t){o.retry(t)||(t&&(arguments[0]=o.mainError()),a.apply(this,arguments));})),o.attempt((function(){n.apply(e,i);}));}.bind(e,s),e[a].options=r;}};}(retry$1),retry$2.exports=retry$1;var retry=getDefaultExportFromCjs(retry$2.exports);const pRetry=_async((function(t,e){return new Promise(((r,n)=>{e=_objectSpread2({onFailedAttempt(){},retries:10},e);const o=retry.operation(e);o.attempt(_async((function(i){return _catch((function(){return _await(t(i),(function(t){r(t);}))}),(function(t){let r=!1;if(t instanceof Error)return _invokeIgnored((function(){if(!(t instanceof AbortError))return _invokeIgnored((function(){if(!(t instanceof TypeError)||isNetworkError(t.message))return decorateErrorWithCounts(t,i,e),_continue(_catch((function(){return _awaitIgnored(e.onFailedAttempt(t))}),(function(t){n(t),r=!0;})),(function(e){if(r)return e;o.retry(t)||n(o.mainError());}));o.stop(),n(t);}));o.stop(),n(t.originalError);}));n(new TypeError('Non-error was thrown: "'.concat(t,'". You should only throw errors.')));}))}))),e.signal&&!e.signal.aborted&&e.signal.addEventListener("abort",(()=>{o.stop();const t=void 0===e.signal.reason?getDOMException("The operation was aborted."):e.signal.reason;n(t instanceof Error?t:getDOMException(t));}),{once:!0});}))})),networkErrorMsgs=new Set(["Failed to fetch","NetworkError when attempting to fetch resource.","The Internet connection appears to be offline.","Network request failed"]);class AbortError extends Error{constructor(t){super(),t instanceof Error?(this.originalError=t,t=t.message):(this.originalError=new Error(t),this.originalError.stack=this.stack),this.name="AbortError",this.message=t;}}const decorateErrorWithCounts=(t,e,r)=>{const n=r.retries-(e-1);return t.attemptNumber=e,t.retriesLeft=n,t},isNetworkError=t=>networkErrorMsgs.has(t),getDOMException=t=>void 0===globalThis.DOMException?new Error(t):new DOMException(t);function fixProto(t,e){var r=Object.setPrototypeOf;r?r(t,e):t.__proto__=e;}function fixStack(t,e){void 0===e&&(e=t.constructor);var r=Error.captureStackTrace;r&&r(t,e);}var __extends=function(){var t=function(e,r){return t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e;}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r]);},t(e,r)};return function(e,r){function n(){this.constructor=e;}t(e,r),e.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n);}}(),CustomError=function(t){function e(e){var r=this.constructor,n=t.call(this,e)||this;return Object.defineProperty(n,"name",{value:r.name,enumerable:!1,configurable:!0}),fixProto(n,r.prototype),fixStack(n),n}return __extends(e,t),e}(Error);

  /* minified: lib */
  class ConsoleSink{constructor(e){_defineProperty(this,"scriptName",void 0),_defineProperty(this,"onSuccess",this.onInfo.bind(this)),this.scriptName=e;}formatMessage(e){return "[".concat(this.scriptName,"] ").concat(e)}onDebug(e){console.debug(this.formatMessage(e));}onLog(e){console.log(this.formatMessage(e));}onInfo(e){console.info(this.formatMessage(e));}onWarn(e,t){e=this.formatMessage(e),t?console.warn(e,t):console.warn(e);}onError(e,t){e=this.formatMessage(e),t?console.error(e,t):console.error(e);}}let LogLevel;!function(e){e[e.DEBUG=0]="DEBUG",e[e.LOG=1]="LOG",e[e.INFO=2]="INFO",e[e.SUCCESS=3]="SUCCESS",e[e.WARNING=4]="WARNING",e[e.ERROR=5]="ERROR";}(LogLevel||(LogLevel={}));const HANDLER_NAMES={[LogLevel.DEBUG]:"onDebug",[LogLevel.LOG]:"onLog",[LogLevel.INFO]:"onInfo",[LogLevel.SUCCESS]:"onSuccess",[LogLevel.WARNING]:"onWarn",[LogLevel.ERROR]:"onError"},DEFAULT_OPTIONS={logLevel:LogLevel.INFO,sinks:[]};class Logger{constructor(e){_defineProperty(this,"_configuration",void 0),this._configuration=_objectSpread2(_objectSpread2({},DEFAULT_OPTIONS),e);}fireHandlers(e,t,n){e<this._configuration.logLevel||this._configuration.sinks.forEach((o=>{const r=o[HANDLER_NAMES[e]];r&&(n?r.call(o,t,n):r.call(o,t));}));}debug(e){this.fireHandlers(LogLevel.DEBUG,e);}log(e){this.fireHandlers(LogLevel.LOG,e);}info(e){this.fireHandlers(LogLevel.INFO,e);}success(e){this.fireHandlers(LogLevel.SUCCESS,e);}warn(e,t){this.fireHandlers(LogLevel.WARNING,e,t);}error(e,t){this.fireHandlers(LogLevel.ERROR,e,t);}configure(e){Object.assign(this._configuration,e);}get configuration(){return this._configuration}addSink(e){this._configuration.sinks.push(e);}}const LOGGER=new Logger;var USERSCRIPT_ID="mb_supercharged_caa_edits";function logFailure(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"An error occurred";e.catch((e=>{LOGGER.error(t,e);}));}function memoize(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:e=>"".concat(e[0]);const n=new Map;return function(){for(var o=arguments.length,r=new Array(o),s=0;s<o;s++)r[s]=arguments[s];const i=t(r);if(!n.has(i)){const t=e(...r);n.set(i,t);}return n.get(i)}}function existsInGM(e){return "undefined"!=typeof GM&&void 0!==GM[e]}existsInGM("info")?GM.info:GM_info;class ResponseError extends CustomError{constructor(e,t){super(t),_defineProperty(this,"url",void 0),this.url=e;}}class HTTPResponseError extends ResponseError{constructor(e,t,n){n?(super(e,n),_defineProperty(this,"statusCode",void 0),_defineProperty(this,"statusText",void 0),_defineProperty(this,"response",void 0)):t.statusText.trim()?(super(e,"HTTP error ".concat(t.status,": ").concat(t.statusText)),_defineProperty(this,"statusCode",void 0),_defineProperty(this,"statusText",void 0),_defineProperty(this,"response",void 0)):(super(e,"HTTP error ".concat(t.status)),_defineProperty(this,"statusCode",void 0),_defineProperty(this,"statusText",void 0),_defineProperty(this,"response",void 0)),this.response=t,this.statusCode=t.status,this.statusText=t.statusText;}}function isFactory(e){return "function"==typeof e}function insertBetween(e,t){return [...e.slice(0,1),...e.slice(1).flatMap((e=>[isFactory(t)?t():t,e]))]}class AssertionError extends Error{}function assert(e,t){if(!e)throw new AssertionError(null!=t?t:"Assertion failed")}function assertNonNull(e,t){assert(null!==e,null!=t?t:"Assertion failed: Expected value to be non-null");}function qs(e,t){const n=qsMaybe(e,t);return assertNonNull(n,"Could not find required element"),n}function qsMaybe(e,t){return (null!=t?t:document).querySelector(e)}function onDocumentLoaded(e){"loading"!==document.readyState?e():document.addEventListener("DOMContentLoaded",e);}function insertStylesheet(e,t){if(void 0===t&&(t="ROpdebee_".concat(USERSCRIPT_ID,"_css")),null!==qsMaybe("style#".concat(t)))return;const n=function(){var n=document.createElement("style");return n.setAttribute("id",t),appendChildren(n,e),n}.call(this);document.head.insertAdjacentElement("beforeend",n);}function parseVersion(e){return e.split(".").map((e=>parseInt(e)))}function versionLessThan(e,t){let n=0;for(;n<e.length&&n<t.length;){if(e[n]<t[n])return !0;if(e[n]>t[n])return !1;n++;}return e.length<t.length}var CHANGELOG_URL="https://github.com/ROpdebee/mb-userscripts/blob/dist/mb_supercharged_caa_edits.changelog.md",USERSCRIPT_FEATURE_HISTORY=[],css_248z=".ROpdebee_feature_list{font-weight:300;margin:0 auto;width:-moz-fit-content;width:fit-content}.ROpdebee_feature_list ul{margin:6px 28px 0 0;text-align:left}";const LAST_DISPLAYED_KEY="ROpdebee_".concat(USERSCRIPT_ID,"_last_notified_update");function maybeDisplayNewFeatures(){const e=localStorage.getItem(LAST_DISPLAYED_KEY),t=GM.info.script;if(!e)return void localStorage.setItem(LAST_DISPLAYED_KEY,t.version);const n=parseVersion(e),o=USERSCRIPT_FEATURE_HISTORY.filter((e=>versionLessThan(n,parseVersion(e.versionAdded))));0!==o.length&&showFeatureNotification(t.name,t.version,o.map((e=>e.description)));}function showFeatureNotification(e,t,n){insertStylesheet(css_248z,"ROpdebee_Update_Banner");const o=function(){var r=document.createElement("div");r.setAttribute("class","banner warning-header");var s=document.createElement("p");r.appendChild(s),appendChildren(s,"".concat(e," was updated to v").concat(t,"! "));var i=document.createElement("a");i.setAttribute("href",CHANGELOG_URL),s.appendChild(i);var a=document.createTextNode("See full changelog here");i.appendChild(a),appendChildren(s,". New features since last update:");var c=document.createElement("div");c.setAttribute("class","ROpdebee_feature_list"),r.appendChild(c);var l=document.createElement("ul");c.appendChild(l),appendChildren(l,n.map((e=>function(){var t=document.createElement("li");return appendChildren(t,e),t}.call(this))));var d=document.createElement("button");return d.setAttribute("class","dismiss-banner remove-item icon"),d.setAttribute("data-banner-name","alert"),d.setAttribute("type","button"),d.addEventListener("click",(()=>{o.remove(),localStorage.setItem(LAST_DISPLAYED_KEY,GM.info.script.version);})),r.appendChild(d),r}.call(this);qs("#page").insertAdjacentElement("beforebegin",o);}

  LOGGER.configure({
      logLevel: LogLevel.INFO,
  });
  LOGGER.addSink(new ConsoleSink(USERSCRIPT_ID));

  const waitUntilRedrawn = _async(function () {
    return new Promise(resolve => {
      window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
        resolve();
      }));
    });
  });

  const selectImage = _async(function (imageData) {
    let _exit = false;
    let use1200 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    let candidates = [imageData.thumbnails['500'] || imageData.thumbnails['large'], imageData.image];

    if (use1200 && imageData.thumbnails['1200']) {
      candidates.unshift(imageData.thumbnails['1200']);
    }

    candidates = candidates.map(url => fixCaaUrl(url));
    return _continue(_forOf(candidates, function (candidate) {
      return _await(checkAlive(candidate), function (_checkAlive) {
        if (_checkAlive) {
          _exit = true;
          return candidate;
        }
      });
    }, function () {
      return _exit;
    }), function (_result) {
      return _exit ? _result : null;
    });
  });

  const checkAlive = function checkAlive(url) {
    return _await(_catch(function () {
      return _await(fetch(url, {
        method: 'HEAD'
      }), function (httpResp) {
        return httpResp.status >= 200 && httpResp.status < 400;
      });
    }, function () {
      return false;
    }));
  };

  function fixCaaUrl(url) {
    return url.replace(/^http:/, 'https:');
  }
  const getDimensionsWhenInView = (() => {
    const actualFn = window.ROpdebee_getDimensionsWhenInView;

    if (!actualFn) {
      console.log('Will not be able to get dimensions, script not installed?');
      return () => null;
    }

    return actualFn;
  })();
  const viewModeTexts = {
    sbs: 'Side-by-side mode',
    overlay: 'Overlay mode'
  };
  const artworkCompareProto = {
    options: {
      modal: true,
      resizable: false,
      autoOpen: false,
      width: 'auto',
      show: true,
      closeText: '',
      title: 'Compare images'
    },

    _create() {
      this._super();

      const savedViewMode = localStorage.getItem('ROpdebee_preferredDialogViewMode');
      this.currentViewMode = savedViewMode === 'sbs' || savedViewMode === 'overlay' ? savedViewMode : 'sbs';
      this.$switchViewMode = $('<button>').attr('type', 'button').on('click', this.switchViewMode.bind(this));
      this.$prev = $('<button>').attr('type', 'button').text('Previous').on('click', this.prevImage.bind(this));
      this.$next = $('<button>').attr('type', 'button').text('Next').on('click', this.nextImage.bind(this));
      this.$useFullSize = $('<input>').attr('type', 'checkbox').attr('id', 'ROpdebee_useFullSize');
      const $useFullSizeLabel = $('<label>').attr('for', 'ROpdebee_useFullSize').text('Always use full-size images').attr('title', 'Full-size images are by default only loaded if no thumbnails exist. Check this box to always load them.');
      this.$useFullSize.on('change', () => {
        if (this.isOpen) {
          this.setSourceImage();
          this.setTargetImage();
          logFailure(this.setDiff());
        }
      });
      this.$autoComputeDiff = $('<input>').attr('type', 'checkbox').attr('id', 'ROpdebee_autoComputeDiff');
      this.$autoComputeDiff.on('change', () => {
        if (this.$autoComputeDiff.prop('checked') && this.triggerDiffGeneration) {
          this.triggerDiffGeneration();
        }
      });
      const $autoComputeDiffLabel = $('<label>').attr('for', 'ROpdebee_autoComputeDiff').text('Automatically compute diff');
      [this.$useFullSize, this.$autoComputeDiff].forEach($el => {
        $el.on('change', () => {
          if ($el.prop('checked')) {
            localStorage.setItem($el.attr('id'), 'delete me to disable');
          } else {
            localStorage.removeItem($el.attr('id'));
          }
        });
        $el.prop('checked', !!localStorage.getItem($el.attr('id')));
      });
      const $buttons = $('<div>').addClass('buttons').append(this.$switchViewMode, this.$prev, this.$next);
      this.uiDialog.append($('<div>').addClass('artwork-dialog-controls').append(this.$useFullSize, $useFullSizeLabel, this.$autoComputeDiff, $autoComputeDiffLabel, $buttons));
      this.element.addClass('artwork-dialog');
      const $imgContainer = $('<div>').css('display', 'flex').css('position', 'relative');
      this.$source = $('<div>').addClass('ROpdebee_dialogImage');
      this.$target = $('<div>').addClass('ROpdebee_dialogImage');
      this.$diff = $('<div>').addClass('ROpdebee_dialogDiff');
      this.element.prepend($imgContainer);
      $imgContainer.append(this.$source, this.$target, this.$diff);
      const labels = ['Source', 'Target', 'Diff'];
      this.element.find('.ROpdebee_dialogImage, .ROpdebee_dialogDiff').each((i, e) => void $(e).append($('<h3>').text(labels[i])));
      this.setViewMode();
    },

    open(edit) {
      this.edit = edit;
      this.$prev.prop('disabled', edit.otherImages.length === 1);
      this.$next.prop('disabled', edit.otherImages.length === 1);
      this.setSourceImage();
      this.setTargetImage();
      logFailure(this.setDiff());

      this._super();
    },

    close(event) {
      this._super(event);

      this.element.find('img').remove();
    },

    switchViewMode() {
      const newViewMode = this.currentViewMode === 'overlay' ? 'sbs' : 'overlay';
      this.currentViewMode = newViewMode;
      this.setViewMode();
    },

    setViewMode() {
      const otherViewMode = this.currentViewMode === 'overlay' ? 'sbs' : 'overlay';
      this.$switchViewMode.text(viewModeTexts[otherViewMode]);

      if (this.currentViewMode === 'sbs') {
        this.setSbsView();
      } else {
        this.setOverlayView();
      }

      localStorage.setItem('ROpdebee_preferredDialogViewMode', this.currentViewMode);
    },

    setSbsView() {
      this.uiDialog.find('.ROpdebee_dialogImage, .ROpdebee_dialogDiff').addClass('ROpdebee_dialogSbs').removeClass('ROpdebee_dialogOverlay');
      this.$source.find('h2').text('Source');
      this.$target.show();
      this.$source.show();
      this.$source.off('mouseenter mouseleave');
      this.$target.off('mouseenter mouseleave');
    },

    setOverlayView() {
      this.uiDialog.find('.ROpdebee_dialogImage, .ROpdebee_dialogDiff').removeClass('ROpdebee_dialogSbs').addClass('ROpdebee_dialogOverlay');
      this.$source.find('h3').text('Source (hover for target)');
      this.$target.hide();
      this.$source.on('mouseenter', () => {
        this.$source.toggle();
        this.$target.toggle();
      });
      this.$target.on('mouseleave', () => {
        this.$source.toggle();
        this.$target.toggle();
      });
    },

    setImage(container, image) {
      container.find('img').off('load').off('error').remove();
      container.find('span.error').remove();
      let $types = container.find('span.ROpdebee_coverTypes');

      if ($types.length === 0) {
        $types = $('<span>').addClass('ROpdebee_coverTypes');
        container.append($types);
      }

      $types.text("Types: ".concat(image.types.join(', ')));
      return new Promise((resolve, reject) => {
        const $img = $('<img>').addClass('ROpdebee_loading').attr('fullSizeURL', fixCaaUrl(image.image)).attr('crossorigin', 'anonymous');
        $img.on('error', () => {
          const errorText = 'Unable to load this image.';
          const $errorMsg = $('<span>').addClass('error').css('display', 'block').text(errorText);
          container.append($errorMsg);
          $img.removeClass('ROpdebee_loading');
          $img.off('error');
          reject('An image failed to load');
        });
        $img.on('load', () => {
          $img.removeClass('ROpdebee_loading');
          const canvas = document.createElement('canvas');
          const w = $img[0].naturalWidth;
          const h = $img[0].naturalHeight;
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage($img[0], 0, 0, w, h);
          resolve(canvas.toDataURL());
        });
        container.find('h3').after($img);

        if (this.$useFullSize.prop('checked')) {
          $img.attr('src', fixCaaUrl(image.image));
        } else {
          selectImage(image, true).then(srcUrl => {
            if (!srcUrl) $img.trigger('error');else $img.attr('src', srcUrl);
          }).catch(() => {
            $img.trigger('error');
          });
        }

        getDimensionsWhenInView($img[0]);
      });
    },

    setSourceImage() {
      this.sourceDataProm = this.setImage(this.$source, this.edit.currentImage);
    },

    setTargetImage() {
      this.targetDataProm = this.setImage(this.$target, this.edit.selectedOtherImage);
    },

    setDiff: function setDiff() {
      try {
        let _exit2 = false;

        const _this = this;

        const $diff = _this.$diff;
        $diff.find('span.error, span#ROpdebee_click_for_diff').remove();
        $diff.off('click');
        $diff.find('img').remove();
        let $similarity = $diff.find('span.ROpdebee_similarity');

        if ($similarity.length === 0) {
          $similarity = $('<span>').addClass('ROpdebee_similarity');
          $diff.append($similarity);
        } else {
          $similarity.text('');
        }

        const $img = $('<img>');

        function setError(msg) {
          const $error = $('<span>').addClass('error').css('display', 'block').text(msg);
          $diff.append($error);
        }

        $diff.find('h3').after($img);
        const waitToGenerateDiff = new Promise(resolve => _this.triggerDiffGeneration = () => {
          _this.triggerDiffGeneration = null;
          $img.addClass('ROpdebee_loading');
          $diff.off('click');
          $diff.find('span#ROpdebee_click_for_diff').remove();
          resolve();
        });

        if (_this.$autoComputeDiff.prop('checked')) {
          _this.triggerDiffGeneration();
        } else {
          const $info = $('<span>').attr('id', 'ROpdebee_click_for_diff').text('Click to generate diff');
          $diff.append($info);
          $diff.on('click', e => {
            var _this$triggerDiffGene;

            e.preventDefault();
            (_this$triggerDiffGene = _this.triggerDiffGeneration) === null || _this$triggerDiffGene === void 0 ? void 0 : _this$triggerDiffGene.call(_this);
          });
        }

        let srcData, targetData;
        return _await(_continue(_catch(function () {
          return _await(Promise.all([_this.sourceDataProm, _this.targetDataProm]), function (_Promise$all) {
            var _Promise$all2 = _slicedToArray(_Promise$all, 2);

            srcData = _Promise$all2[0];
            targetData = _Promise$all2[1];
          });
        }, function (err) {
          setError("Cannot generate diff: ".concat(err));
          _exit2 = true;
        }), function (_result2) {
          return _exit2 ? _result2 : _await(waitToGenerateDiff, function () {
            return _call(waitUntilRedrawn, function () {
              resemble(srcData).compareTo(targetData).scaleToSameSize().ignoreAntialiasing().onComplete(data => {
                $img.removeClass('ROpdebee_loading');

                if (data.error) {
                  setError("Encountered an error: ".concat(data.error));
                  return;
                }

                $img.attr('src', data.getImageDataUrl());
                $similarity.text("Images are ".concat(100 - data.misMatchPercentage, "% similar"));
              });
            });
          });
        }));
      } catch (e) {
        return Promise.reject(e);
      }
    },
    prevImage: function prevImage() {
      this.edit.prevImage();
      this.setTargetImage();
      logFailure(this.setDiff());
    },
    nextImage: function nextImage() {
      this.edit.nextImage();
      this.setTargetImage();
      logFailure(this.setDiff());
    }
  };
  $.widget('ropdebee.artworkCompare', $.ui.dialog, artworkCompareProto);
  const openComparisonDialog = (() => {
    let $activeDialog = $();
    const viewer = $('<div>').appendTo('body').artworkCompare();

    function open(edit) {
      $activeDialog = viewer.artworkCompare('open', edit);
    }

    $('body').on('click', '.ui-widget-overlay', e => {
      const dialog = $activeDialog.data('ropdebee-artworkCompare');

      if ((dialog === null || dialog === void 0 ? void 0 : dialog.overlay[0]) === e.currentTarget) {
        e.preventDefault();
        dialog.close();
      }
    }).on('click', '.artwork-dialog img', e => {
      e.stopImmediatePropagation();
    }).on('keydown', e => {
      if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
      const op = e.key === 'ArrowLeft' ? 'prevImage' : 'nextImage';

      if ($activeDialog.artworkCompare('isOpen')) {
        $activeDialog.artworkCompare(op);
      }
    });
    return open;
  })();

  const LOADING_GIF = 'data:image/gif;base64,R0lGODlhEAAQAPMPALu7u5mZmTMzM93d3REREQAAAHd3d1VVVWZmZqqqqoiIiO7u7kRERCIiIgARAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQFBwAPACwAAAAAEAAQAEAEcPDJtyg6dUrFetDTIopMoSyFcxxD1krD8AwCkASDIlPaUDQLR6G1Cy0SgqIkE1IQGMrFAKCcGWSBzwPAnAwarcKQ15MpTMJYd1ZyUDXSDGelBY0qIoBh/ZoYGgELCjoxCRRvIQcGD1kzgSAgAACQDxEAIfkEBQcADwAsAAAAAA8AEAAABF3wyfkMkotOJpscRKJJwtI4Q1MAoxQ0RFBw0xEvhGAVRZZJh4JgMAEQW7TWI4EwGFjKR+CAQECjn8DoN0kwDtvBT8FILAKJgfoo1iAGAPNVY9DGJXNMIHN/HJVqIxEAIfkEBQcADwAsAAAAABAADwAABFrwyfmColgiydpaQiY5x9Ith7hURdIl0wBIhpCAjKIIxaAUPQ0hFQsAC7MJALFSFi4SgC4wyHyuCYNWxH3AuhSEotkNGAALAPqqkigG8MWAjAnM4A8594vPUyIAIfkEBQcADwAsAAAAABAAEAAABF3wySkDvdKsddg+APYIWrcg2DIRQAcU6DJICjIsjBEETLEEBYLqYSDdJoCGiHgZwG4LQCCRECEIBAdoF5hdEIWwgBJqDs7DgcKyRHZl3uUwuhm2AbNNW+LV7yd+FxEAIfkEBQcACAAsAAAAABAADgAABEYQyYmMoVgeWQrP3NYhBCgZBdAFRUkdBIAUguVVo1ZsWFcEGB5GMBkEjiCBL2a5ZAi+m2SAURExwKqPiuCafBkvBSCcmiYRACH5BAUHAA4ALAAAAAAQABAAAARs0MnpAKDYrbSWMp0xZIvBKYrXjNmADOhAKBiQDF5gGcICNAyJTwFYTBaDQ0HAkgwSmAUj0OkMrkZM4HBgKK7YTKDRICAo2clAEIheKc9CISjEVTuEQrJASGcSBQcSUFEUDQUXJBgDBW0Zj34RACH5BAUHAA8ALAAAAAAQABAAAARf8Mn5xqBYgrVC4EEmBcOSfAEjSopJMglmcQlgBYjE5NJgZwjCAbO4YBAJjpIjSiAQh5ayyRAIDKvJIbnIagoFRFdkQDQKC0RBsCIUFAWsT7RwG410R8HiiK0WBwJjFBEAIfkEBQcADgAsAQABAA8ADwAABFrQybEWADXJLUHHAMJxIDAgnrOo2+AOibEMh1LN62gIxphzitRoCDAYNcNN6FBLShao4WzwHDQKvVGhoFAwGgtFgQHENhoB7nCwHRAIC0EyUcC8Zw1ha3NIRgAAIfkEBQcADwAsAAAAABAAEAAABGDwyfnWoljaNYYFV+Zx3hCEGEcuypBtMJBISpClAWLfWODymIFiCJwMDMiZBNAAYFqUAaNQ2E0YBIXGURAMCo1AAsFYBBoIScBJEwgSVcmP0li4FwcHz+FpCCQMPCFINxEAIfkEBQcADgAsAAABABAADwAABFzQyemWXYNqaSXY2vVtw3UNmROM4JQowKKlFOsgRI6ASQ8IhSADFAjAMIMAgSYJtByxyQIhcEoaBcSiwegpDgvAwSBJ0AIHBoCQqIAEi/TCIAABGhLG8MbcKBQgEQAh+QQFBwAPACwAAAEAEAAPAAAEXfDJSd+qeK5RB8fDRRWFspyotAAfQBbfNLCVUSSdKDV89gDAwcFBIBgywMRnkWBgcJUDKSZRIKAPQcGwYByAAYTEEJAAJIGbATEQ+B4ExmK9CDhBd8ThdHw/AmUYEQAh+QQFBwAPACwAAAEADwAPAAAEXvBJQIa8+ILSspdHkXxS9wxF4Q3L2aTBeC0sFjhAtuyLIjAMhYc2GBgaSKGuyNoBDp7czFAgeBIKwC6kWCAMxUSAFjtNCAAFGGF5tCQLAaJnWCTqHoREvQuQJAkyGBEAOw==';
  const STATUSES = {
    1: 'Official',
    2: 'Promotion',
    3: 'Bootleg',
    4: 'Pseudo-Release',
    5: 'Withdrawn',
    6: 'Cancelled'
  };
  const PACKAGING_TYPES = {
    1: 'Jewel Case',
    2: 'Slim Jewel Case',
    3: 'Digipak',
    4: 'Cardboard/Paper Sleeve',
    5: 'Other',
    6: 'Keep Case',
    7: 'None',
    8: 'Cassette Case',
    9: 'Book',
    10: 'Fatbox',
    11: 'Snap Case',
    12: 'Gatefold Cover',
    13: 'Discbox Slider',
    16: 'Super Jewel Box',
    17: 'Digibook',
    18: 'Plastic Sleeve',
    19: 'Box',
    20: 'Slidepack',
    21: 'SnapPack',
    54: 'Metal Tin',
    55: 'Longbox',
    56: 'Clamshell Case'
  };
  const NONSQUARE_PACKAGING_TYPES = new Set([3, 6, 8, 9, 10, 11, 17, 55]);
  const NONSQUARE_PACKAGING_COVER_TYPES = new Set(['Front', 'Back']);
  const LIKELY_DIGITAL_DIMENSIONS = new Set(['640x640', '1400x1400', '3000x3000']);
  const SHADY_REASONS = {
    releaseDate: 'The release date occurs after the end of the voting period for this edit. The cover art may not be accurate at this time.',
    incorrectDimensions: 'This packaging is typically non-square, but this cover art is square. It likely belongs to another release.',
    nonsquareDigital: 'This is a digital media release with non-square cover art. Although this is possible, it is uncommon.',
    digitalDimensions: 'This is a physical release but the added cover art has dimensions typical of digital store fronts. Care should be taken to ensure the cover matches the actual physical release.',
    digitalNonFront: 'This type of artwork is very uncommon on digital releases, and might not belong here.',
    trackOnPhysical: 'Covers of type “track” should not appear on physical releases.',
    linerOnNonVinyl: 'Covers of type “liner” typically appear on Vinyl releases. Although it can appear on other releases, this is uncommon.',
    noTypesSet: 'This cover has no types set. This is not ideal.',
    obiOutsideJapan: 'Covers of type “obi” typically occur on Japanese releases only. JP is not in the release countries.',
    watermark: 'This cover may contain watermarks, and should ideally be superseded by one without watermarks.',
    pseudoRelease: 'Pseudo-releases typically should not have cover art attached.',
    urlInComment: 'The comment appears to contain a URL. This is often unnecessary clutter.'
  };
  const MB_FORMAT_TRANSLATIONS = {
    '%A': 'dddd',
    '%a': 'ddd',
    '%B': 'MMMM',
    '%b': 'MMM',
    '%d': 'DD',
    '%e': 'D',
    '%m': 'MM',
    '%Y': 'YYYY',
    '%H': 'HH',
    '%M': 'mm',
    '%c': 'DD/MM/YYYY, hh:mm:ss a',
    '%x': 'DD/MM/YYYY',
    '%X': 'hh:mm:ss a'
  };

  const getImageDimensions = (() => {
      const actualFn = window.ROpdebee_getImageDimensions;
      if (!actualFn) {
          return () => Promise.reject('Script unavailable');
      }
      return actualFn;
  })();
  function stringifyDate(date) {
      const year = date.year ? date.year.toString().padStart(4, '0') : '????';
      const month = date.month ? date.month.toString().padStart(2, '0') : '??';
      const day = date.day ? date.day.toString().padStart(2, '0') : '??';
      return [
          year,
          month,
          day
      ].join('-').replace(/(?:-\?{2}){1,2}$/, '');
  }
  function translateMBDateFormatToMoments(dateFormat) {
      return Object.entries(MB_FORMAT_TRANSLATIONS).reduce((format, _ref) => {
          let _ref2 = _slicedToArray(_ref, 2), mbToken = _ref2[0], momentsToken = _ref2[1];
          return format.replace(mbToken, momentsToken);
      }, dateFormat);
  }
  function processReleaseEvents(events) {
      const dateToCountries = new Map();
      var _iterator = _createForOfIteratorHelper(events), _step;
      try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var _event$country, _event$date;
              const event = _step.value;
              const country = (_event$country = event.country) === null || _event$country === void 0 ? void 0 : _event$country.primary_code;
              const date = stringifyDate((_event$date = event.date) !== null && _event$date !== void 0 ? _event$date : {});
              if (!dateToCountries.has(date)) {
                  dateToCountries.set(date, []);
              }
              if (country) {
                  dateToCountries.get(date).push(country);
              }
          }
      } catch (err) {
          _iterator.e(err);
      } finally {
          _iterator.f();
      }
      const arr = [...dateToCountries.entries()];
      arr.sort((a, b) => {
          if (a[0] < b[0])
              return -1;
          if (a[0] > b[0])
              return 1;
          return 0;
      });
      return arr;
  }
  class CAAEdit {
      constructor(edit, releaseDetails, otherImages, currentImage) {
          _defineProperty(this, 'edit', void 0);
          _defineProperty(this, 'releaseDetails', void 0);
          _defineProperty(this, 'otherImages', void 0);
          _defineProperty(this, 'currentImage', void 0);
          _defineProperty(this, 'warningsUl', void 0);
          _defineProperty(this, '_selectedIdx', 0);
          _defineProperty(this, 'warningMsgs', void 0);
          _defineProperty(this, 'anchor', void 0);
          _defineProperty(this, 'compareButton', void 0);
          _defineProperty(this, 'typesSpan', void 0);
          _defineProperty(this, 'nextButton', void 0);
          _defineProperty(this, 'prevButton', void 0);
          this.edit = edit;
          this.releaseDetails = releaseDetails;
          this.otherImages = otherImages;
          this.currentImage = currentImage;
          this.setTypes();
          this.insertReleaseInfo();
          this.insertComparisonImages();
          this.warningsUl = this.insertWarnings();
          this.warningMsgs = new Set();
          this.performSanityChecks();
      }
      setTypes() {
          const trs = this.edit.querySelectorAll('table.details > tbody > tr');
          const typesRow = [...trs].find(tr => tr.querySelector('th').textContent === 'Types:');
          if (!typesRow) {
              this.insertRow('Types:', function () {
                  var $$a = document.createElement('span');
                  $$a.setAttribute('data-name', 'artwork-type');
                  var $$b = document.createTextNode('(none)');
                  $$a.appendChild($$b);
                  return $$a;
              }.call(this));
          } else {
              const td = typesRow.querySelector('td');
              const existingTypes = td.textContent;
              const newSpans = existingTypes.split(', ').map(type => function () {
                  var $$c = document.createElement('span');
                  $$c.setAttribute('data-name', 'artwork-type');
                  appendChildren($$c, type);
                  return $$c;
              }.call(this));
              if (newSpans.length > 0) {
                  td.innerHTML = '';
                  td.append(...insertBetween(newSpans, ', '));
              }
          }
      }
      insertWarnings() {
          const warningsList = function () {
              var $$e = document.createElement('ul');
              return $$e;
          }.call(this);
          const tr = function () {
              var $$f = document.createElement('tr');
              setStyles($$f, { display: 'none' });
              var $$g = document.createElement('th');
              $$f.appendChild($$g);
              var $$h = document.createTextNode('Warnings:');
              $$g.appendChild($$h);
              var $$i = document.createElement('td');
              $$i.setAttribute('colSpan', 2);
              $$f.appendChild($$i);
              appendChildren($$i, warningsList);
              return $$f;
          }.call(this);
          const rows = this.edit.querySelectorAll('.edit-details tr, .details tr');
          rows[rows.length - 1].after(tr);
          return warningsList;
      }
      insertRow(header, rowContent) {
          var _this$edit$querySelec;
          if (!Array.isArray(rowContent)) {
              rowContent = [rowContent];
          }
          const td = function () {
              var $$k = document.createElement('td');
              return $$k;
          }.call(this);
          td.append(...rowContent);
          const row = function () {
              var $$l = document.createElement('tr');
              var $$m = document.createElement('th');
              $$l.appendChild($$m);
              appendChildren($$m, header);
              appendChildren($$l, td);
              return $$l;
          }.call(this);
          (_this$edit$querySelec = this.edit.querySelector('.edit-details tr, .details tr')) === null || _this$edit$querySelec === void 0 ? void 0 : _this$edit$querySelec.after(row);
      }
      insertReleaseInfo() {
          var _PACKAGING_TYPES$this, _STATUSES$this$releas, _this$releaseDetails$, _this$releaseDetails$2, _this$releaseDetails$3, _this$releaseDetails$4;
          const packaging = (_PACKAGING_TYPES$this = PACKAGING_TYPES[this.releaseDetails.packagingID]) !== null && _PACKAGING_TYPES$this !== void 0 ? _PACKAGING_TYPES$this : '??';
          const status = (_STATUSES$this$releas = STATUSES[this.releaseDetails.statusID]) !== null && _STATUSES$this$releas !== void 0 ? _STATUSES$this$releas : '??';
          const format = this.releaseDetails.combined_format_name || '[missing media]';
          const events = processReleaseEvents((_this$releaseDetails$ = this.releaseDetails.events) !== null && _this$releaseDetails$ !== void 0 ? _this$releaseDetails$ : []);
          const barcode = ((_this$releaseDetails$2 = this.releaseDetails.barcode) !== null && _this$releaseDetails$2 !== void 0 ? _this$releaseDetails$2 : '??') || '[none]';
          const catnos = new Set(((_this$releaseDetails$3 = this.releaseDetails.labels) !== null && _this$releaseDetails$3 !== void 0 ? _this$releaseDetails$3 : []).map(lbl => lbl.catalogNumber).filter(Boolean));
          const labels = new Set(((_this$releaseDetails$4 = this.releaseDetails.labels) !== null && _this$releaseDetails$4 !== void 0 ? _this$releaseDetails$4 : []).filter(lbl => lbl.label).map(lbl => [
              lbl.label.gid,
              lbl.label.name
          ]));
          const detailsContent = insertBetween([
              [
                  'Status',
                  status
              ],
              [
                  'Packaging',
                  packaging
              ],
              [
                  'Format',
                  format
              ]
          ].map(_ref3 => {
              let _ref4 = _slicedToArray(_ref3, 2), title = _ref4[0], value = _ref4[1];
              const valueSpan = function () {
                  var $$p = document.createElement('span');
                  $$p.setAttribute('data-name', title);
                  appendChildren($$p, value);
                  return $$p;
              }.call(this);
              return [
                  ''.concat(title, ': '),
                  valueSpan
              ];
          }), '; ').flat();
          const eventsContent = events.flatMap(_ref5 => {
              let _ref6 = _slicedToArray(_ref5, 2), evtDate = _ref6[0], evtCountries = _ref6[1];
              const countries = evtCountries.length <= 3 && evtCountries.length > 0 ? evtCountries.join(', ') : ''.concat(evtCountries.length, ' countries');
              const releaseDateSpan = function () {
                  var $$r = document.createElement('span');
                  $$r.setAttribute('data-name', 'release-date');
                  appendChildren($$r, evtDate);
                  return $$r;
              }.call(this);
              return [
                  releaseDateSpan,
                  ' ('.concat(countries, ')')
              ];
          });
          const labelsContent = insertBetween([...labels].map(_ref7 => {
              let _ref8 = _slicedToArray(_ref7, 2), lblGid = _ref8[0], lblName = _ref8[1];
              return function () {
                  var $$t = document.createElement('a');
                  $$t.setAttribute('href', '/label/'.concat(lblGid));
                  appendChildren($$t, lblName);
                  return $$t;
              }.call(this);
          }), ', ');
          const barcodeSpan = function () {
              var $$v = document.createElement('span');
              $$v.setAttribute('data-name', 'barcode');
              appendChildren($$v, barcode);
              return $$v;
          }.call(this);
          const identifiersContent = [
              'Cat#: '.concat([...catnos].join(', ') || '??', '; Barcode: '),
              barcodeSpan
          ];
          this.insertRow('Identifiers:', identifiersContent);
          this.insertRow('Labels:', labelsContent);
          this.insertRow('Release events:', eventsContent);
          this.insertRow('Release details:', detailsContent);
      }
      insertComparisonImages() {
          const td = this.edit.querySelector('td.ROpdebee_comparisonImage');
          if (this.otherImages.length === 0) {
              const span = function () {
                  var $$x = document.createElement('span');
                  var $$y = document.createTextNode('No other images found!');
                  $$x.appendChild($$y);
                  return $$x;
              }.call(this);
              td.append(span);
              td.classList.remove('ROpdebee_loading');
              return;
          }
          this.anchor = function () {
              var $$z = document.createElement('a');
              $$z.setAttribute('class', 'artwork-image');
              return $$z;
          }.call(this);
          this.compareButton = function () {
              var $$aa = document.createElement('button');
              $$aa.setAttribute('type', 'button');
              setStyles($$aa, { float: 'right' });
              $$aa.addEventListener('click', openComparisonDialog.bind(null, this));
              var $$bb = document.createTextNode('Compare');
              $$aa.appendChild($$bb);
              return $$aa;
          }.call(this);
          this.typesSpan = function () {
              var $$cc = document.createElement('span');
              setStyles($$cc, { display: 'block' });
              return $$cc;
          }.call(this);
          if (this.otherImages.length > 1) {
              this.nextButton = function () {
                  var $$dd = document.createElement('button');
                  $$dd.setAttribute('type', 'button');
                  $$dd.addEventListener('click', this.nextImage.bind(this));
                  var $$ee = document.createTextNode('Next');
                  $$dd.appendChild($$ee);
                  return $$dd;
              }.call(this);
              this.prevButton = function () {
                  var $$ff = document.createElement('button');
                  $$ff.setAttribute('type', 'button');
                  $$ff.addEventListener('click', this.prevImage.bind(this));
                  var $$gg = document.createTextNode('Previous');
                  $$ff.appendChild($$gg);
                  return $$ff;
              }.call(this);
              td.append(this.anchor, this.typesSpan, this.prevButton, this.nextButton, this.compareButton);
          } else {
              td.append(this.anchor, this.typesSpan, this.compareButton);
          }
          td.classList.remove('ROpdebee_loading');
          logFailure(this.setImage());
      }
      set selectedIdx(newIdx) {
          if (newIdx < 0)
              newIdx = this.otherImages.length + newIdx;
          newIdx %= this.otherImages.length;
          this._selectedIdx = newIdx;
      }
      get selectedIdx() {
          return this._selectedIdx;
      }
      get selectedOtherImage() {
          return this.otherImages[this.selectedIdx];
      }
      nextImage() {
          this.selectedIdx += 1;
          logFailure(this.setImage());
      }
      prevImage() {
          this.selectedIdx -= 1;
          logFailure(this.setImage());
      }
      setImage() {
          const _this = this;
          return _call(function () {
              const selectedImg = _this.otherImages[_this.selectedIdx];
              const fullSizeUrl = fixCaaUrl(selectedImg.image);
              _this.anchor.href = fullSizeUrl;
              function createErrorSpan(message) {
                  return function () {
                      var $$hh = document.createElement('span');
                      $$hh.setAttribute('class', 'error');
                      setStyles($$hh, { display: 'block' });
                      appendChildren($$hh, message);
                      return $$hh;
                  }.call(this);
              }
              _this.edit.querySelectorAll('.ROpdebee_comparisonImage img, .ROpdebee_comparisonImage span.error').forEach(elmt => {
                  elmt.remove();
              });
              const img = function () {
                  var $$jj = document.createElement('img');
                  $$jj.setAttribute('class', 'ROpdebee_loading');
                  $$jj.addEventListener('load', () => {
                      img.classList.remove('ROpdebee_loading');
                  });
                  $$jj.addEventListener('error', () => {
                      const errorMsg = createErrorSpan('Unable to load this image');
                      _this.anchor.prepend(errorMsg);
                      img.classList.remove('ROpdebee_loading');
                  });
                  return $$jj;
              }.call(this);
              img.setAttribute('fullSizeURL', fullSizeUrl);
              _this.anchor.prepend(img);
              _this.typesSpan.textContent = 'Types: '.concat(selectedImg.types.join(', '));
              return _await(selectImage(selectedImg), function (imgUrl) {
                  if (!imgUrl) {
                      img.dispatchEvent(new Event('error'));
                  } else {
                      img.src = imgUrl;
                  }
                  getDimensionsWhenInView(img);
              });
          });
      }
      get closeDate() {
          var _$c$stash$current_lan;
          const expire = (this.edit.id === 'content' ? this.edit.parentElement.querySelector('#sidebar') : this.edit.querySelector('div.edit-description')).querySelector('.edit-expiration');
          const tooltip = expire.querySelector('span.tooltip');
          if (tooltip === null) {
              return moment();
          }
          const dateStr = tooltip.title;
          return moment(dateStr, translateMBDateFormatToMoments(window.__MB__.$c.user.preferences.datetime_format), (_$c$stash$current_lan = window.__MB__.$c.stash.current_language) !== null && _$c$stash$current_lan !== void 0 ? _$c$stash$current_lan : 'en');
      }
      get formats() {
          return this.releaseDetails.mediums.map(medium => medium.format ? medium.format.name : 'unknown');
      }
      get isDigitalMedia() {
          return this.formats.every(format => format === 'Digital Media');
      }
      get isPhysical() {
          return !this.formats.includes('Digital Media') && !this.formats.includes('unknown');
      }
      get isVinyl() {
          return this.formats.some(format => format.includes('Vinyl'));
      }
      get isUnknownMedium() {
          return this.formats.length === 1 && this.formats[0] === 'unknown';
      }
      get shouldBeNonSquare() {
          return NONSQUARE_PACKAGING_TYPES.has(this.releaseDetails.packagingID) && this.types.some(type => NONSQUARE_PACKAGING_COVER_TYPES.has(type));
      }
      get types() {
          return [...this.edit.querySelectorAll('span[data-name="artwork-type"]')].map(span => span.textContent);
      }
      markShady(elmts, reason) {
          if (!Array.isArray(elmts)) {
              elmts = [elmts];
          }
          if (elmts.length === 0)
              return;
          var _iterator2 = _createForOfIteratorHelper(elmts), _step2;
          try {
              for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                  const elmt = _step2.value;
                  elmt.classList.add('ROpdebee_shady');
                  const prevTitle = elmt.title;
                  elmt.title = [
                      prevTitle,
                      reason
                  ].join(' ').trim();
              }
          } catch (err) {
              _iterator2.e(err);
          } finally {
              _iterator2.f();
          }
          if (!this.warningMsgs.has(reason)) {
              this.warningsUl.append(function () {
                  var $$kk = document.createElement('li');
                  appendChildren($$kk, reason);
                  return $$kk;
              }.call(this));
              this.warningsUl.closest('tr').style.display = '';
              this.warningMsgs.add(reason);
          }
      }
      performSanityChecks() {
          this.checkReleaseDate();
          this.checkPseudoReleaseCover();
          this.checkTypes();
          this.checkUrlInComment();
          logFailure(this.checkDimensions());
      }
      checkReleaseDate() {
          var _this$releaseDetails$5;
          if (!this.closeDate.isValid()) {
              this.markShady([...this.edit.querySelectorAll('span[data-name="release-date"]')], 'Cannot determine the closing date of this edit, the release event check will not work. Please report this issue.');
              return;
          }
          const dates = new Set(((_this$releaseDetails$5 = this.releaseDetails.events) !== null && _this$releaseDetails$5 !== void 0 ? _this$releaseDetails$5 : []).filter(evt => {
              var _evt$date;
              return typeof ((_evt$date = evt.date) === null || _evt$date === void 0 ? void 0 : _evt$date.year) !== 'undefined' && typeof evt.date.month !== 'undefined' && typeof evt.date.day !== 'undefined';
          }).map(evt => [
              evt.date,
              new Date(evt.date.year, evt.date.month - 1, evt.date.day)
          ]));
          const closeDate = this.closeDate;
          const tooLateDates = new Set([...dates].filter(d => closeDate.isBefore(d[1])).map(d => stringifyDate(d[0])));
          const shadyDates = [...this.edit.querySelectorAll('span[data-name="release-date"]')].filter(el => tooLateDates.has(el.textContent));
          this.markShady(shadyDates, SHADY_REASONS.releaseDate);
      }
      checkPseudoReleaseCover() {
          if (this.releaseDetails.statusID === 4) {
              this.markShady(this.edit.querySelector('span[data-name="Status"]'), SHADY_REASONS.pseudoRelease);
          }
      }
      checkTypes() {
          this.edit.querySelectorAll('span[data-name="artwork-type"]').forEach(this._checkType.bind(this));
      }
      _checkType(typeEl) {
          const type = typeEl.textContent;
          if (type === 'Watermark') {
              this.markShady(typeEl, SHADY_REASONS.watermark);
          }
          if (![
                  'Front',
                  'Track',
                  '-',
                  '(none)'
              ].includes(type) && this.isDigitalMedia) {
              this.markShady(typeEl, SHADY_REASONS.digitalNonFront);
          }
          if (type === '-' || type === '(none)') {
              this.markShady(typeEl, SHADY_REASONS.noTypesSet);
          }
          if (type === 'Track' && this.isPhysical) {
              this.markShady(typeEl, SHADY_REASONS.trackOnPhysical);
          }
          if (type === 'Liner' && !this.isVinyl) {
              this.markShady(typeEl, SHADY_REASONS.linerOnNonVinyl);
          }
          if (type === 'Obi' && (this.releaseDetails.events || []).every(evt => !evt.country || evt.country.primary_code !== 'JP')) {
              this.markShady(typeEl, SHADY_REASONS.obiOutsideJapan);
          }
      }
      checkUrlInComment() {
          const trs = this.edit.querySelectorAll('table.details > tbody > tr');
          const commentRow = [...trs].find(tr => tr.querySelector('th').textContent === 'Comment:');
          if (!commentRow)
              return;
          const commentEl = commentRow.querySelector('td');
          if (commentEl.textContent.includes('://')) {
              this.markShady(commentEl, SHADY_REASONS.urlInComment);
          }
      }
      checkDimensions() {
          const _this2 = this;
          return _call(function () {
              return _this2.currentImage ? _await(getImageDimensions(fixCaaUrl(_this2.currentImage.image)), function (dimensions) {
                  if (!dimensions) {
                      console.error('Failed to load image dimensions');
                      return;
                  }
                  const aspectRatio = dimensions.width / dimensions.height;
                  const isSquare = Math.abs(1 - aspectRatio) < 0.05;
                  if (isSquare && _this2.shouldBeNonSquare) {
                      _this2.markShady(_this2.edit.querySelector('span[data-name="Packaging"]'), SHADY_REASONS.incorrectDimensions);
                  }
                  if (!isSquare && _this2.isDigitalMedia) {
                      _this2.markShady(_this2.edit.querySelector('span[data-name="Format"]'), SHADY_REASONS.nonsquareDigital);
                  }
                  const dimStr = ''.concat(dimensions.width, 'x').concat(dimensions.height);
                  if (LIKELY_DIGITAL_DIMENSIONS.has(dimStr) && !_this2.isDigitalMedia && !_this2.isUnknownMedium) {
                      _this2.markShady(_this2.edit.querySelector('span.ROpdebee_dimensions, span[data-name="Format"]'), SHADY_REASONS.digitalDimensions);
                  }
              }) : _await();
          });
      }
  }

  if (document.location.hostname === 'musicbrainz.org' || document.location.hostname.endsWith('.musicbrainz.org')) {
      onDocumentLoaded(maybeDisplayNewFeatures);
  }

  const processEdit = _async(function (edit) {
      let editId;
      try {
          editId = edit.querySelector('input[name$="edit_id"]').value;
          if (discoveredEdits.has(editId))
              return;
          discoveredEdits.add(editId);
      } catch (err) {
          console.error('This edit does not have an edit ID? '.concat(err));
          return;
      }
      insertPlaceholder(edit);
      const _slice = edit.querySelector('a.artwork-image, a.artwork-pdf').href.match(ID_RGX).slice(1), _slice2 = _slicedToArray(_slice, 2), mbid = _slice2[0], imageIdString = _slice2[1];
      const imageId = parseInt(imageIdString);
      return _await(getReleaseDetails(mbid), function (releaseDetails) {
          const gid = releaseDetails.id;
          return _await(getAllImages(mbid).catch(() => []), function (allImages) {
              let otherImages = allImages.filter(img => img.id !== imageId);
              return _invoke(function () {
                  if (edit.querySelectorAll('.remove-cover-art').length > 0) {
                      return _await(getPendingRemovals(gid).catch(() => new Set()), function (pendingRemovals) {
                          otherImages = allImages.filter(img => {
                              const id = typeof img.id === 'string' ? parseInt(img.id) : img.id;
                              return !pendingRemovals.has(id) && id !== imageId;
                          });
                      });
                  }
              }, function () {
                  const currImage = allImages.find(img => {
                      const id = typeof img.id === 'string' ? parseInt(img.id) : img.id;
                      return id === imageId;
                  });
                  const currTypes = currImage ? currImage.types : [];
                  otherImages = sortRetainedByTypeMatch(otherImages, currTypes);
                  new CAAEdit(edit, releaseDetails, otherImages, currImage);
              });
          });
      });
  });
  const getReleaseDetails = _async(function (mbid) {
      return _await(fetchWithRetry(''.concat(window.location.origin, '/ws/js/release/').concat(mbid)), function (resp) {
          return resp.json();
      });
  });
  const _getPendingRemovals = _async(function (releaseGid) {
      const getPage = _async(function (pageNo) {
          const url = ''.concat(window.location.origin, '/search/edits?conditions.0.field=release&conditions.0.operator=%3D&conditions.0.args.0=').concat(releaseGid, '&conditions.1.field=type&conditions.1.operator=%3D&conditions.1.args=315&conditions.2.field=status&conditions.2.operator=%3D&conditions.2.args=1&page=').concat(pageNo);
          return _await(fetchWithRetry(url), function (resp) {
              return resp.text();
          });
      });
      function processPage(pageHtml, resultSet) {
          const parser = new DOMParser();
          const dom = parser.parseFromString(pageHtml, 'text/html');
          [...dom.querySelectorAll('table.details.remove-cover-art code')].map(code => code.textContent).map(filename => filename.split('-')).filter(parts => parts.length == 7).map(parts => parts[6].match(/^(\d+)\.\w+/)[1]).forEach(id => {
              resultSet.add(parseInt(id));
          });
          const nextAnchor = dom.querySelector('ul.pagination li:last-child > a');
          if (!nextAnchor)
              return;
          return parseInt(nextAnchor.href.match(/page=(\d+)/)[1]);
      }
      let curPageNo = 1;
      const results = new Set();
      return _continue(_for(function () {
          return !!curPageNo;
      }, void 0, function () {
          return _await(getPage(curPageNo), function (pageHtml) {
              curPageNo = processPage(pageHtml, results);
          });
      }), function () {
          return results;
      });
  });
  const _getAllImages = _async(function (mbid) {
      return _await(fetchWithRetry('https://coverartarchive.org/release/'.concat(mbid, '/')), function (resp) {
          return _await(resp.json(), function (_resp$json) {
              const respObj = _resp$json;
              return respObj.images;
          });
      });
  });
  resemble.outputSettings({
      errorColor: {
          red: 0,
          green: 0,
          blue: 0
      },
      errorType: 'movementDifferenceIntensity',
      transparency: 0.25
  });
  const ID_RGX = /release\/([a-f\d]{8}(?:-[a-f\d]{4}){3}-[a-f\d]{12})\/(\d+)\.\w+/;
  const DEFAULT_TRIES = 5;
  moment.updateLocale('de', { monthsShort: 'Jan_Feb_Mär_Apr_Mai_Jun_Jul_Aug_Sep_Okt_Nov_Dez'.split('_') });
  function fetchWithRetry(url, options) {
      const tryRequest = _async(function () {
          return _await(fetch(url, options), function (resp) {
              if (resp.ok)
                  return resp;
              throw new HTTPResponseError(url, resp);
          });
      });
      let tries = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : DEFAULT_TRIES;
      return pRetry(tryRequest, {
          retries: tries,
          onFailedAttempt: err => {
              if (err instanceof HTTPResponseError && err.statusCode < 500 && err.statusCode !== 429) {
                  throw err;
              }
          }
      });
  }
  const getAllImages = memoize(_getAllImages);
  const getPendingRemovals = memoize(_getPendingRemovals);
  function typeMatchScore(t1, t2) {
      const allTypes = new Set();
      t1.forEach(t => allTypes.add(t));
      t2.forEach(t => allTypes.add(t));
      const sharedTypes = t1.filter(t => t2.includes(t));
      return sharedTypes.length / (allTypes.size || 1);
  }
  function sortRetainedByTypeMatch(imgs, targetTypes) {
      return imgs.map(img => [
          img,
          typeMatchScore(img.types, targetTypes)
      ]).sort((a, b) => b[1] - a[1]).map(_ref => {
          let _ref2 = _slicedToArray(_ref, 1), img = _ref2[0];
          return img;
      });
  }
  function insertPlaceholder(edit) {
      const td = function () {
          var $$a = document.createElement('td');
          $$a.setAttribute('class', 'ROpdebee_comparisonImage edit-cover-art ROpdebee_loading');
          return $$a;
      }.call(this);
      edit.querySelector('td.edit-cover-art').after(td);
  }
  const discoveredEdits = new Set();
  const processEditWhenInView = function () {
      const options = { root: document };
      const observer = new IntersectionObserver(entries => {
          entries.filter(e => e.intersectionRatio > 0).forEach(e => {
              logFailure(processEdit(e.target));
          });
      }, options);
      return elmt => {
          observer.observe(elmt);
      };
  }();
  function setupStyle() {
      const style = document.createElement('style');
      style.id = 'ROpdebee_CAA_Edits_Supercharged';
      document.head.append(style);
      style.sheet.insertRule('td.edit-cover-art { vertical-align: top; }');
      style.sheet.insertRule('.ROpdebee_loading {\n        background: transparent url('.concat(LOADING_GIF, ') center center no-repeat;\n        min-width: 250px;\n        min-height: 250px;\n    }'));
      style.sheet.insertRule('.ROpdebee_dialogDiff, .ROpdebee_dialogSbs {\n        float: left;\n    }');
      style.sheet.insertRule('.ROpdebee_dialogSbs > img, .ROpdebee_dialogOverlay > img {\n        margin: 5px;\n        object-fit: contain;\n        display: block;\n    }');
      style.sheet.insertRule('.ROpdebee_dialogSbs > img {\n        width: 25vw;\n        height: 25vw;\n    }');
      style.sheet.insertRule('.ROpdebee_dialogOverlay > img {\n        width: 33vw;\n        height: 33vw;\n    }');
      style.sheet.insertRule('.ROpdebee_shady {\n        color: red;\n        font-weight: bold;\n        border-bottom: 1px dotted;\n    }');
  }
  function main() {
      setupStyle();
      document.querySelectorAll('.open.remove-cover-art, .open.add-cover-art').forEach(elmt => {
          processEditWhenInView(elmt.parentNode);
      });
  }
  main();

})();
