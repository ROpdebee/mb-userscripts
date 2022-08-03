// ==UserScript==
// @name         MB: Enhanced Cover Art Uploads
// @description  Enhance the cover art uploader! Upload directly from a URL, automatically import covers from Discogs/Spotify/Apple Music/..., automatically retrieve the largest version, and more!
// @version      2022.8.3
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
// @require      https://github.com/qsniyg/maxurl/blob/4b8661ee2d7a856dc6c4a9b910664584b397d45a/userscript.user.js?raw=true
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

  /* minified: babel helpers, babel-plugin-transform-async-to-promises, nativejsx, ts-custom-error, p-throttle, retry, p-retry */
  function ownKeys(t,r){var e=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(t,r).enumerable}))),e.push.apply(e,n);}return e}function _objectSpread2(t){for(var r=1;r<arguments.length;r++){var e=null!=arguments[r]?arguments[r]:{};r%2?ownKeys(Object(e),!0).forEach((function(r){_defineProperty(t,r,e[r]);})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(e)):ownKeys(Object(e)).forEach((function(r){Object.defineProperty(t,r,Object.getOwnPropertyDescriptor(e,r));}));}return t}function _defineProperty(t,r,e){return r in t?Object.defineProperty(t,r,{value:e,enumerable:!0,configurable:!0,writable:!0}):t[r]=e,t}function _slicedToArray(t,r){return _arrayWithHoles(t)||_iterableToArrayLimit(t,r)||_unsupportedIterableToArray(t,r)||_nonIterableRest()}function _toArray(t){return _arrayWithHoles(t)||_iterableToArray(t)||_unsupportedIterableToArray(t)||_nonIterableRest()}function _arrayWithHoles(t){if(Array.isArray(t))return t}function _iterableToArray(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}function _iterableToArrayLimit(t,r){var e=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=e){var n,o,i=[],a=!0,s=!1;try{for(e=e.call(t);!(a=(n=e.next()).done)&&(i.push(n.value),!r||i.length!==r);a=!0);}catch(u){s=!0,o=u;}finally{try{a||null==e.return||e.return();}finally{if(s)throw o}}return i}}function _unsupportedIterableToArray(t,r){if(t){if("string"==typeof t)return _arrayLikeToArray(t,r);var e=Object.prototype.toString.call(t).slice(8,-1);return "Object"===e&&t.constructor&&(e=t.constructor.name),"Map"===e||"Set"===e?Array.from(t):"Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)?_arrayLikeToArray(t,r):void 0}}function _arrayLikeToArray(t,r){(null==r||r>t.length)&&(r=t.length);for(var e=0,n=new Array(r);e<r;e++)n[e]=t[e];return n}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _createForOfIteratorHelper(t,r){var e="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!e){if(Array.isArray(t)||(e=_unsupportedIterableToArray(t))||r&&t&&"number"==typeof t.length){e&&(t=e);var n=0,o=function(){};return {s:o,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,a=!0,s=!1;return {s:function(){e=e.call(t);},n:function(){var t=e.next();return a=t.done,t},e:function(t){s=!0,i=t;},f:function(){try{a||null==e.return||e.return();}finally{if(s)throw i}}}}const _Pact=function(){function t(){}return t.prototype.then=function(r,e){const n=new t,o=this.s;if(o){const t=1&o?r:e;if(t){try{_settle(n,1,t(this.v));}catch(i){_settle(n,2,i);}return n}return this}return this.o=function(t){try{const o=t.v;1&t.s?_settle(n,1,r?r(o):o):e?_settle(n,1,e(o)):_settle(n,2,o);}catch(i){_settle(n,2,i);}},n},t}();function _settle(t,r,e){if(!t.s){if(e instanceof _Pact){if(!e.s)return void(e.o=_settle.bind(null,t,r));1&r&&(r=e.s),e=e.v;}if(e&&e.then)return void e.then(_settle.bind(null,t,r),_settle.bind(null,t,2));t.s=r,t.v=e;const n=t.o;n&&n(t);}}function _isSettledPact(t){return t instanceof _Pact&&1&t.s}function _async(t){return function(){for(var r=[],e=0;e<arguments.length;e++)r[e]=arguments[e];try{return Promise.resolve(t.apply(this,r))}catch(n){return Promise.reject(n)}}}function _await(t,r,e){return e?r?r(t):t:(t&&t.then||(t=Promise.resolve(t)),r?t.then(r):t)}function _awaitIgnored(t,r){if(!r)return t&&t.then?t.then(_empty):Promise.resolve()}function _continue(t,r){return t&&t.then?t.then(r):r(t)}function _continueIgnored(t){if(t&&t.then)return t.then(_empty)}function _forTo(t,r,e){var n,o,i=-1;return function a(s){try{for(;++i<t.length&&(!e||!e());)if((s=r(i))&&s.then){if(!_isSettledPact(s))return void s.then(a,o||(o=_settle.bind(null,n=new _Pact,2)));s=s.v;}n?_settle(n,1,s):n=s;}catch(u){_settle(n||(n=new _Pact),2,u);}}(),n}const _iteratorSymbol="undefined"!=typeof Symbol?Symbol.iterator||(Symbol.iterator=Symbol("Symbol.iterator")):"@@iterator";function _forOf(t,r,e){if("function"==typeof t[_iteratorSymbol]){var n,o,i,a=t[_iteratorSymbol]();if(function t(s){try{for(;!((n=a.next()).done||e&&e());)if((s=r(n.value))&&s.then){if(!_isSettledPact(s))return void s.then(t,i||(i=_settle.bind(null,o=new _Pact,2)));s=s.v;}o?_settle(o,1,s):o=s;}catch(u){_settle(o||(o=new _Pact),2,u);}}(),a.return){var s=function(t){try{n.done||a.return();}catch(r){}return t};if(o&&o.then)return o.then(s,(function(t){throw s(t)}));s();}return o}if(!("length"in t))throw new TypeError("Object is not iterable");for(var u=[],c=0;c<t.length;c++)u.push(t[c]);return _forTo(u,(function(t){return r(u[t])}),e)}const _asyncIteratorSymbol="undefined"!=typeof Symbol?Symbol.asyncIterator||(Symbol.asyncIterator=Symbol("Symbol.asyncIterator")):"@@asyncIterator";function _forAwaitOf(t,r,e){if("function"==typeof t[_asyncIteratorSymbol]){var n=new _Pact,o=t[_asyncIteratorSymbol]();return o.next().then(a).then(void 0,s),n;function i(t){if(e&&e())return _settle(n,1,o.return?o.return().then((function(){return t})):t);o.next().then(a).then(void 0,s);}function a(t){t.done?_settle(n,1):Promise.resolve(r(t.value)).then(i).then(void 0,s);}function s(t){_settle(n,2,o.return?o.return().then((function(){return t})):t);}}return Promise.resolve(_forOf(t,(function(t){return Promise.resolve(t).then(r)}),e))}function _call(t,r,e){if(e)return r?r(t()):t();try{var n=Promise.resolve(t());return r?n.then(r):n}catch(o){return Promise.reject(o)}}function _invoke(t,r){var e=t();return e&&e.then?e.then(r):r(e)}function _invokeIgnored(t){var r=t();if(r&&r.then)return r.then(_empty)}function _catch(t,r){try{var e=t();}catch(n){return r(n)}return e&&e.then?e.then(void 0,r):e}function _finallyRethrows(t,r){try{var e=t();}catch(n){return r(!0,n)}return e&&e.then?e.then(r.bind(null,!1),r.bind(null,!0)):r(!1,e)}function _rethrow(t,r){if(t)throw r;return r}function _empty(){}const _earlyReturn={};function _catchInGenerator(t,r){return _catch(t,(function(t){if(t===_earlyReturn)throw t;return r(t)}))}const _AsyncGenerator=function(){function t(t){this._entry=t,this._pact=null,this._resolve=null,this._return=null,this._promise=null;}function r(t){return {value:t,done:!0}}function e(t){return {value:t,done:!1}}return t.prototype._yield=function(t){return this._resolve(t&&t.then?t.then(e):e(t)),this._pact=new _Pact},t.prototype.next=function(t){const e=this;return e._promise=new Promise((function(n){const o=e._pact;if(null===o){const s=e._entry;if(null===s)return n(e._promise);function i(t){e._resolve(t&&t.then?t.then(r):r(t)),e._pact=null,e._resolve=null;}e._entry=null,e._resolve=n;var a=s(e);a&&a.then?a.then(i,(function(t){if(t===_earlyReturn)i(e._return);else {const r=new _Pact;e._resolve(r),e._pact=null,e._resolve=null,_resolve(r,2,t);}})):i(a);}else e._pact=null,e._resolve=n,_settle(o,1,t);}))},t.prototype.return=function(t){const e=this;return e._promise=new Promise((function(n){const o=e._pact;if(null===o)return null===e._entry?n(e._promise):(e._entry=null,n(t&&t.then?t.then(r):r(t)));e._return=t,e._resolve=n,e._pact=null,_settle(o,2,_earlyReturn);}))},t.prototype.throw=function(t){const r=this;return r._promise=new Promise((function(e,n){const o=r._pact;if(null===o)return null===r._entry?e(r._promise):(r._entry=null,n(t));r._resolve=e,r._pact=null,_settle(o,2,t);}))},t.prototype[_asyncIteratorSymbol]=function(){return this},t}();var appendChildren=function(t,r){(r=Array.isArray(r)?r:[r]).forEach((function(r){r instanceof HTMLElement?t.appendChild(r):(r||"string"==typeof r)&&t.appendChild(document.createTextNode(r.toString()));}));},setStyles=function(t,r){for(const e in r)t.style[e]=r[e];};function fixProto(t,r){var e=Object.setPrototypeOf;e?e(t,r):t.__proto__=r;}function fixStack(t,r){void 0===r&&(r=t.constructor);var e=Error.captureStackTrace;e&&e(t,r);}var __extends=function(){var t=function(r,e){return t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,r){t.__proto__=r;}||function(t,r){for(var e in r)r.hasOwnProperty(e)&&(t[e]=r[e]);},t(r,e)};return function(r,e){function n(){this.constructor=r;}t(r,e),r.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n);}}(),CustomError=function(t){function r(r){var e=this.constructor,n=t.call(this,r)||this;return Object.defineProperty(n,"name",{value:e.name,enumerable:!1,configurable:!0}),fixProto(n,e.prototype),fixStack(n),n}return __extends(r,t),r}(Error);class AbortError$1 extends Error{constructor(){super("Throttled function aborted"),this.name="AbortError";}}function pThrottle(t){let r=t.limit,e=t.interval,n=t.strict;if(!Number.isFinite(r))throw new TypeError("Expected `limit` to be a finite number");if(!Number.isFinite(e))throw new TypeError("Expected `interval` to be a finite number");const o=new Map;let i=0,a=0;const s=[],u=n?function(){const t=Date.now();if(s.length<r)return s.push(t),0;const n=s.shift()+e;return t>=n?(s.push(t),0):(s.push(n),n-t)}:function(){const t=Date.now();return t-i>e?(a=1,i=t,0):(a<r?a++:(i+=e,a=1),i-t)};return t=>{const r=function r(){const e=this;for(var n=arguments.length,i=new Array(n),a=0;a<n;a++)i[a]=arguments[a];if(!r.isEnabled)return _async((function(){return t.apply(e,i)}))();let s;return new Promise(((r,e)=>{s=setTimeout((()=>{r(t.apply(this,i)),o.delete(s);}),u()),o.set(s,e);}))};return r.abort=()=>{var t,r=_createForOfIteratorHelper(o.keys());try{for(r.s();!(t=r.n()).done;){const r=t.value;clearTimeout(r),o.get(r)(new AbortError$1);}}catch(e){r.e(e);}finally{r.f();}o.clear(),s.splice(0,s.length);},r.isEnabled=!0,r}}function getDefaultExportFromCjs(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var retry$2={exports:{}},retry$1={};function RetryOperation(t,r){"boolean"==typeof r&&(r={forever:r}),this._originalTimeouts=JSON.parse(JSON.stringify(t)),this._timeouts=t,this._options=r||{},this._maxRetryTime=r&&r.maxRetryTime||1/0,this._fn=null,this._errors=[],this._attempts=1,this._operationTimeout=null,this._operationTimeoutCb=null,this._timeout=null,this._operationStart=null,this._timer=null,this._options.forever&&(this._cachedTimeouts=this._timeouts.slice(0));}var retry_operation=RetryOperation;RetryOperation.prototype.reset=function(){this._attempts=1,this._timeouts=this._originalTimeouts.slice(0);},RetryOperation.prototype.stop=function(){this._timeout&&clearTimeout(this._timeout),this._timer&&clearTimeout(this._timer),this._timeouts=[],this._cachedTimeouts=null;},RetryOperation.prototype.retry=function(t){if(this._timeout&&clearTimeout(this._timeout),!t)return !1;var r=(new Date).getTime();if(t&&r-this._operationStart>=this._maxRetryTime)return this._errors.push(t),this._errors.unshift(new Error("RetryOperation timeout occurred")),!1;this._errors.push(t);var e=this._timeouts.shift();if(void 0===e){if(!this._cachedTimeouts)return !1;this._errors.splice(0,this._errors.length-1),e=this._cachedTimeouts.slice(-1);}var n=this;return this._timer=setTimeout((function(){n._attempts++,n._operationTimeoutCb&&(n._timeout=setTimeout((function(){n._operationTimeoutCb(n._attempts);}),n._operationTimeout),n._options.unref&&n._timeout.unref()),n._fn(n._attempts);}),e),this._options.unref&&this._timer.unref(),!0},RetryOperation.prototype.attempt=function(t,r){this._fn=t,r&&(r.timeout&&(this._operationTimeout=r.timeout),r.cb&&(this._operationTimeoutCb=r.cb));var e=this;this._operationTimeoutCb&&(this._timeout=setTimeout((function(){e._operationTimeoutCb();}),e._operationTimeout)),this._operationStart=(new Date).getTime(),this._fn(this._attempts);},RetryOperation.prototype.try=function(t){console.log("Using RetryOperation.try() is deprecated"),this.attempt(t);},RetryOperation.prototype.start=function(t){console.log("Using RetryOperation.start() is deprecated"),this.attempt(t);},RetryOperation.prototype.start=RetryOperation.prototype.try,RetryOperation.prototype.errors=function(){return this._errors},RetryOperation.prototype.attempts=function(){return this._attempts},RetryOperation.prototype.mainError=function(){if(0===this._errors.length)return null;for(var t={},r=null,e=0,n=0;n<this._errors.length;n++){var o=this._errors[n],i=o.message,a=(t[i]||0)+1;t[i]=a,a>=e&&(r=o,e=a);}return r},function(t){var r=retry_operation;t.operation=function(e){var n=t.timeouts(e);return new r(n,{forever:e&&(e.forever||e.retries===1/0),unref:e&&e.unref,maxRetryTime:e&&e.maxRetryTime})},t.timeouts=function(t){if(t instanceof Array)return [].concat(t);var r={retries:10,factor:2,minTimeout:1e3,maxTimeout:1/0,randomize:!1};for(var e in t)r[e]=t[e];if(r.minTimeout>r.maxTimeout)throw new Error("minTimeout is greater than maxTimeout");for(var n=[],o=0;o<r.retries;o++)n.push(this.createTimeout(o,r));return t&&t.forever&&!n.length&&n.push(this.createTimeout(o,r)),n.sort((function(t,r){return t-r})),n},t.createTimeout=function(t,r){var e=r.randomize?Math.random()+1:1,n=Math.round(e*Math.max(r.minTimeout,1)*Math.pow(r.factor,t));return Math.min(n,r.maxTimeout)},t.wrap=function(r,e,n){if(e instanceof Array&&(n=e,e=null),!n)for(var o in n=[],r)"function"==typeof r[o]&&n.push(o);for(var i=0;i<n.length;i++){var a=n[i],s=r[a];r[a]=function(n){var o=t.operation(e),i=Array.prototype.slice.call(arguments,1),a=i.pop();i.push((function(t){o.retry(t)||(t&&(arguments[0]=o.mainError()),a.apply(this,arguments));})),o.attempt((function(){n.apply(r,i);}));}.bind(r,s),r[a].options=e;}};}(retry$1),retry$2.exports=retry$1;var retry=getDefaultExportFromCjs(retry$2.exports);const pRetry=_async((function(t,r){return new Promise(((e,n)=>{r=_objectSpread2({onFailedAttempt(){},retries:10},r);const o=retry.operation(r);o.attempt(_async((function(i){return _catch((function(){return _await(t(i),(function(t){e(t);}))}),(function(t){let e=!1;if(t instanceof Error)return _invokeIgnored((function(){if(!(t instanceof AbortError))return _invokeIgnored((function(){if(!(t instanceof TypeError)||isNetworkError(t.message))return decorateErrorWithCounts(t,i,r),_continue(_catch((function(){return _awaitIgnored(r.onFailedAttempt(t))}),(function(t){n(t),e=!0;})),(function(r){if(e)return r;o.retry(t)||n(o.mainError());}));o.stop(),n(t);}));o.stop(),n(t.originalError);}));n(new TypeError('Non-error was thrown: "'.concat(t,'". You should only throw errors.')));}))}))),r.signal&&!r.signal.aborted&&r.signal.addEventListener("abort",(()=>{o.stop();const t=void 0===r.signal.reason?getDOMException("The operation was aborted."):r.signal.reason;n(t instanceof Error?t:getDOMException(t));}),{once:!0});}))})),networkErrorMsgs=new Set(["Failed to fetch","NetworkError when attempting to fetch resource.","The Internet connection appears to be offline.","Network request failed"]);class AbortError extends Error{constructor(t){super(),t instanceof Error?(this.originalError=t,t=t.message):(this.originalError=new Error(t),this.originalError.stack=this.stack),this.name="AbortError",this.message=t;}}const decorateErrorWithCounts=(t,r,e)=>{const n=e.retries-(r-1);return t.attemptNumber=r,t.retriesLeft=n,t},isNetworkError=t=>networkErrorMsgs.has(t),getDOMException=t=>void 0===globalThis.DOMException?new Error(t):new DOMException(t);

  /* minified: lib */
  class ConsoleSink{constructor(e){_defineProperty(this,"scriptName",void 0),_defineProperty(this,"onSuccess",this.onInfo.bind(this)),this.scriptName=e;}formatMessage(e){return "[".concat(this.scriptName,"] ").concat(e)}onDebug(e){console.debug(this.formatMessage(e));}onLog(e){console.log(this.formatMessage(e));}onInfo(e){console.info(this.formatMessage(e));}onWarn(e,t){e=this.formatMessage(e),t?console.warn(e,t):console.warn(e);}onError(e,t){e=this.formatMessage(e),t?console.error(e,t):console.error(e);}}let LogLevel;!function(e){e[e.DEBUG=0]="DEBUG",e[e.LOG=1]="LOG",e[e.INFO=2]="INFO",e[e.SUCCESS=3]="SUCCESS",e[e.WARNING=4]="WARNING",e[e.ERROR=5]="ERROR";}(LogLevel||(LogLevel={}));const HANDLER_NAMES={[LogLevel.DEBUG]:"onDebug",[LogLevel.LOG]:"onLog",[LogLevel.INFO]:"onInfo",[LogLevel.SUCCESS]:"onSuccess",[LogLevel.WARNING]:"onWarn",[LogLevel.ERROR]:"onError"},DEFAULT_OPTIONS={logLevel:LogLevel.INFO,sinks:[]};class Logger{constructor(e){_defineProperty(this,"_configuration",void 0),this._configuration=_objectSpread2(_objectSpread2({},DEFAULT_OPTIONS),e);}fireHandlers(e,t,r){e<this._configuration.logLevel||this._configuration.sinks.forEach((n=>{const s=n[HANDLER_NAMES[e]];s&&(r?s.call(n,t,r):s.call(n,t));}));}debug(e){this.fireHandlers(LogLevel.DEBUG,e);}log(e){this.fireHandlers(LogLevel.LOG,e);}info(e){this.fireHandlers(LogLevel.INFO,e);}success(e){this.fireHandlers(LogLevel.SUCCESS,e);}warn(e,t){this.fireHandlers(LogLevel.WARNING,e,t);}error(e,t){this.fireHandlers(LogLevel.ERROR,e,t);}configure(e){Object.assign(this._configuration,e);}get configuration(){return this._configuration}addSink(e){this._configuration.sinks.push(e);}}const LOGGER=new Logger;var USERSCRIPT_ID="mb_enhanced_cover_art_uploads";function filterNonNull(e){return e.filter((e=>!(null==e)))}function groupBy(e,t,r){const n=new Map;var s,o=_createForOfIteratorHelper(e);try{for(o.s();!(s=o.n()).done;){var a;const e=s.value,o=t(e),i=r(e);n.has(o)?null===(a=n.get(o))||void 0===a||a.push(i):n.set(o,[i]);}}catch(i){o.e(i);}finally{o.f();}return n}function collatedSort(e){const t=new Intl.Collator("en",{numeric:!0});return e.sort(t.compare.bind(t))}function enumerate(e){return e.map(((e,t)=>[e,t]))}function isFactory(e){return "function"==typeof e}function insertBetween(e,t){return [...e.slice(0,1),...e.slice(1).flatMap((e=>[isFactory(t)?t():t,e]))]}class AssertionError extends Error{}function assert(e,t){if(!e)throw new AssertionError(null!=t?t:"Assertion failed")}function assertDefined(e,t){assert(void 0!==e,null!=t?t:"Assertion failed: Expected value to be defined");}function assertNonNull(e,t){assert(null!==e,null!=t?t:"Assertion failed: Expected value to be non-null");}function assertHasValue(e,t){assert(null!=e,null!=t?t:"Assertion failed: Expected value to be defined and non-null");}function qs(e,t){const r=qsMaybe(e,t);return assertNonNull(r,"Could not find required element"),r}function qsMaybe(e,t){return (null!=t?t:document).querySelector(e)}function qsa(e,t){return [...(null!=t?t:document).querySelectorAll(e)]}function onDocumentLoaded(e){"loading"!==document.readyState?e():document.addEventListener("DOMContentLoaded",e);}function parseDOM(e,t){const r=(new DOMParser).parseFromString(e,"text/html");if(!qsMaybe("base",r.head)){const e=r.createElement("base");e.href=t,r.head.insertAdjacentElement("beforeend",e);}return r}function insertStylesheet(e,t){if(void 0===t&&(t="ROpdebee_".concat(USERSCRIPT_ID,"_css")),null!==qsMaybe("style#".concat(t)))return;const r=function(){var r=document.createElement("style");return r.setAttribute("id",t),appendChildren(r,e),r}.call(this);document.head.insertAdjacentElement("beforeend",r);}var css_248z$1="#ROpdebee_log_container{margin:1.5rem auto;width:75%}#ROpdebee_log_container .msg{word-wrap:break-word;border:1px solid;border-radius:4px;display:block;font-weight:500;margin-bottom:.5rem;padding:.5rem .75rem;width:100%}#ROpdebee_log_container .msg.error{background-color:#f8d7da;border-color:#f5c6cb;color:#721c24;font-weight:600}#ROpdebee_log_container .msg.warning{background-color:#fff3cd;border-color:#ffeeba;color:#856404}#ROpdebee_log_container .msg.success{background-color:#d4edda;border-color:#c3e6cb;color:#155724}#ROpdebee_log_container .msg.info{background-color:#e2e3e5;border-color:#d6d8db;color:#383d41}";class GuiSink{constructor(){_defineProperty(this,"rootElement",void 0),_defineProperty(this,"persistentMessages",[]),_defineProperty(this,"transientMessages",[]),_defineProperty(this,"onInfo",this.onLog.bind(this)),insertStylesheet(css_248z$1,"ROpdebee_GUI_Logger"),this.rootElement=function(){var e=document.createElement("div");return e.setAttribute("id","ROpdebee_log_container"),setStyles(e,{display:"none"}),e}.call(this);}createMessage(e,t,r){const n=insertBetween((t+(r instanceof Error?": ".concat(r.message):"")).split(/(?=\/)/),(()=>function(){return document.createElement("wbr")}.call(this)));return function(){var t=document.createElement("span");return t.setAttribute("class","msg ".concat(e)),appendChildren(t,n),t}.call(this)}addMessage(e){this.removeTransientMessages(),this.rootElement.append(e),this.rootElement.style.display="block";}removeTransientMessages(){this.transientMessages.forEach((e=>{e.remove();})),this.transientMessages=[];}addPersistentMessage(e){this.addMessage(e),this.persistentMessages.push(e);}addTransientMessage(e){this.addMessage(e),this.transientMessages.push(e);}onLog(e){this.addTransientMessage(this.createMessage("info",e));}onSuccess(e){this.addTransientMessage(this.createMessage("success",e));}onWarn(e,t){this.addPersistentMessage(this.createMessage("warning",e,t));}onError(e,t){this.addPersistentMessage(this.createMessage("error",e,t));}clearAllLater(){this.transientMessages=[...this.transientMessages,...this.persistentMessages],this.persistentMessages=[];}}function existsInGM(e){return "undefined"!=typeof GM&&void 0!==GM[e]}function GMxmlHttpRequest(e){existsInGM("xmlHttpRequest")?GM.xmlHttpRequest(e):GM_xmlhttpRequest(e);}function GMgetResourceUrl(e){return existsInGM("getResourceUrl")?GM.getResourceUrl(e):existsInGM("getResourceURL")?GM.getResourceURL(e):Promise.resolve(GM_getResourceURL(e))}const GMinfo=existsInGM("info")?GM.info:GM_info;function cloneIntoPageContext(e){return "undefined"!=typeof cloneInto&&"undefined"!=typeof unsafeWindow?cloneInto(e,unsafeWindow):e}function getFromPageContext(e){return ("undefined"!=typeof unsafeWindow?unsafeWindow:window)[e]}const separator="\n–\n";class EditNote{constructor(e){_defineProperty(this,"footer",void 0),_defineProperty(this,"extraInfoLines",void 0),_defineProperty(this,"editNoteTextArea",void 0),this.footer=e,this.editNoteTextArea=qs("textarea.edit-note");const t=this.editNoteTextArea.value.split(separator)[0];this.extraInfoLines=new Set(t?t.split("\n").map((e=>e.trimEnd())):null);}addExtraInfo(e){if(this.extraInfoLines.has(e))return;let t=this.editNoteTextArea.value.split(separator),r=_toArray(t),n=r[0],s=r.slice(1);n=(n+"\n"+e).trim(),this.editNoteTextArea.value=[n,...s].join(separator),this.extraInfoLines.add(e);}addFooter(){this.removePreviousFooter();const e=this.editNoteTextArea.value;this.editNoteTextArea.value=[e,separator,this.footer].join("");}removePreviousFooter(){const e=this.editNoteTextArea.value.split(separator).filter((e=>e.trim()!==this.footer));this.editNoteTextArea.value=e.join(separator);}static withFooterFromGMInfo(){const e=GMinfo.script,t="".concat(e.name," ").concat(e.version,"\n").concat(e.namespace);return new EditNote(t)}}const getReleaseIDsForURL=_async((function(e){return _await(fetch("https://musicbrainz.org/ws/2/url?resource=".concat(encodeURIComponent(e),"&inc=release-rels&fmt=json")),(function(e){return _await(e.json(),(function(e){var t,r;return null!==(t=null===(r=e.relations)||void 0===r?void 0:r.map((e=>e.release.id)))&&void 0!==t?t:[]}))}))})),getURLsForRelease=_async((function(e,t){const r=null!=t?t:{},n=r.excludeEnded,s=r.excludeDuplicates;return _await(getReleaseUrlARs(e),(function(e){n&&(e=e.filter((e=>!e.ended)));let t=e.map((e=>e.url.resource));return s&&(t=[...new Set(t)]),t.flatMap((e=>{try{return [new URL(e)]}catch(t){return console.warn("Found malformed URL linked to release: ".concat(e)),[]}}))}))})),getReleaseUrlARs=_async((function(e){return _await(fetch("https://musicbrainz.org/ws/2/release/".concat(e,"?inc=url-rels&fmt=json")),(function(e){return _await(e.json(),(function(e){var t;return null!==(t=e.relations)&&void 0!==t?t:[]}))}))}));class ObservableSemaphore{constructor(e){let t=e.onAcquired,r=e.onReleased;_defineProperty(this,"onAcquired",void 0),_defineProperty(this,"onReleased",void 0),_defineProperty(this,"counter",0),this.onAcquired=t,this.onReleased=r;}acquire(){this.counter++,1===this.counter&&this.onAcquired();}release(){this.counter--,0===this.counter&&this.onReleased();}runInSection(e){let t;this.acquire();try{return t=e(),t}finally{t instanceof Promise?t.finally((()=>{this.release();})).catch((()=>{})):this.release();}}}let ArtworkTypeIDs;function urlBasename(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"";return "string"!=typeof e&&(e=e.pathname),e.split("/").pop()||t}function urlJoin(e){let t=new URL(e);for(var r=arguments.length,n=new Array(r>1?r-1:0),s=1;s<r;s++)n[s-1]=arguments[s];for(var o=0,a=n;o<a.length;o++){const e=a[o];t=new URL(e,t);}return t}!function(e){e[e.Back=2]="Back",e[e.Booklet=3]="Booklet",e[e.Front=1]="Front",e[e.Liner=12]="Liner",e[e.Medium=4]="Medium",e[e.Obi=5]="Obi",e[e.Other=8]="Other",e[e.Poster=11]="Poster",e[e.Raw=14]="Raw",e[e.Spine=6]="Spine",e[e.Sticker=10]="Sticker",e[e.Track=7]="Track",e[e.Tray=9]="Tray",e[e.Watermark=13]="Watermark",e[e.Matrix=15]="Matrix",e[e.Top=48]="Top",e[e.Bottom=49]="Bottom";}(ArtworkTypeIDs||(ArtworkTypeIDs={}));const gmxhr=_async((function(e,t){return new Promise(((r,n)=>{GMxmlHttpRequest(_objectSpread2(_objectSpread2({method:"GET",url:e instanceof URL?e.href:e},t),{},{onload:t=>{t.status>=400?n(new HTTPResponseError(e,t)):r(t);},onerror:()=>{n(new NetworkError(e));},onabort:()=>{n(new AbortedError(e));},ontimeout:()=>{n(new TimeoutError(e));},onprogress:null==t?void 0:t.progressCb}));}))}));class ResponseError extends CustomError{constructor(e,t){super(t),_defineProperty(this,"url",void 0),this.url=e;}}class HTTPResponseError extends ResponseError{constructor(e,t){t.statusText.trim()?(super(e,"HTTP error ".concat(t.status,": ").concat(t.statusText)),_defineProperty(this,"statusCode",void 0),_defineProperty(this,"statusText",void 0),_defineProperty(this,"response",void 0)):(super(e,"HTTP error ".concat(t.status)),_defineProperty(this,"statusCode",void 0),_defineProperty(this,"statusText",void 0),_defineProperty(this,"response",void 0)),this.response=t,this.statusCode=t.status,this.statusText=t.statusText;}}class TimeoutError extends ResponseError{constructor(e){super(e,"Request timed out");}}class AbortedError extends ResponseError{constructor(e){super(e,"Request aborted");}}class NetworkError extends ResponseError{constructor(e){super(e,"Network error");}}function asyncSleep(e){return new Promise((t=>setTimeout(t,e)))}function retryTimes(e,t,r){const n=_async((function(t){return _catch(e,(function(e){if(t<=1)throw e;return asyncSleep(r).then((()=>n(t-1)))}))}));return t<=0?Promise.reject(new TypeError("Invalid number of retry times: ".concat(t))):n(t)}function logFailure(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"An error occurred";e.catch((e=>{LOGGER.error(t,e);}));}function splitDomain(e){const t=e.split(".");let r=-2;return ["org","co","com"].includes(t[t.length-2])&&(r=-3),[...t.slice(0,r),t.slice(r).join(".")]}class DispatchMap{constructor(){_defineProperty(this,"map",new Map);}set(e,t){const r=splitDomain(e);if("*"===e||r[0].includes("*")&&"*"!==r[0]||r.slice(1).some((e=>e.includes("*"))))throw new Error("Invalid pattern: "+e);return this.insert([...r].reverse(),t),this}get(e){return this.retrieve([...splitDomain(e)].reverse())}_get(e){return this.map.get(e)}_set(e,t){return this.map.set(e,t),this}insertLeaf(e,t){const r=this._get(e);r?(assert(r instanceof DispatchMap&&!r.map.has(""),"Duplicate leaf!"),r._set("",t)):this._set(e,t);}insertInternal(e,t){const r=e[0],n=this._get(r);let s;n instanceof DispatchMap?s=n:(s=new DispatchMap,this._set(r,s),void 0!==n&&s._set("",n)),s.insert(e.slice(1),t);}insert(e,t){e.length>1?this.insertInternal(e,t):(assert(1===e.length,"Empty domain parts?!"),this.insertLeaf(e[0],t));}retrieveLeaf(e){let t=this._get(e);if(t instanceof DispatchMap){let e=t._get("");void 0===e&&(e=t._get("*")),t=e;}return t}retrieveInternal(e){const t=this._get(e[0]);if(t instanceof DispatchMap)return t.retrieve(e.slice(1))}retrieve(e){const t=1===e.length?this.retrieveLeaf(e[0]):this.retrieveInternal(e);return null!=t?t:this._get("*")}}function safeParseJSON(e,t){try{return JSON.parse(e)}catch(r){if(t)throw new Error("".concat(t,": ").concat(r));return}}function hexEncode(e){return [...new(getFromPageContext("Uint8Array"))(e)].map((e=>e.toString(16).padStart(2,"0"))).join("")}function blobToDigest(e){const t=_async((function(e){var t,r,n,s;const o=e.result;return _await(null!==(t=null===(r=crypto)||void 0===r||null===(n=r.subtle)||void 0===n||null===(s=n.digest)||void 0===s?void 0:s.call(n,"SHA-256",o))&&void 0!==t?t:o,hexEncode)}));return new Promise(((r,n)=>{const s=new FileReader;s.addEventListener("error",n),s.addEventListener("load",(()=>{t(s).then(r).catch(n);})),s.readAsArrayBuffer(e);}))}const getItemMetadata=_async((function(e){return _await(fetch(new URL("https://archive.org/metadata/".concat(e))),(function(e){return _await(e.text(),(function(e){const t=safeParseJSON(e,"Could not parse IA metadata");if(!t.server)throw new Error("Empty IA metadata, item might not exist");if(t.is_dark)throw new Error("Cannot access IA metadata: This item is darkened");return t}))}))}));function memoize(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:e=>"".concat(e[0]);const r=new Map;return function(){for(var n=arguments.length,s=new Array(n),o=0;o<n;o++)s[o]=arguments[o];const a=t(s);if(!r.has(a)){const t=e(...s);r.set(a,t);}return r.get(a)}}function createPersistentCheckbox(e,t,r){return [function(){var t=document.createElement("input");return t.setAttribute("type","checkbox"),t.setAttribute("id",e),t.addEventListener("change",(t=>{t.currentTarget.checked?localStorage.setItem(e,"delete_to_disable"):localStorage.removeItem(e),r(t);})),t.setAttribute("defaultChecked",!!localStorage.getItem(e)),t}.call(this),function(){var r=document.createElement("label");return r.setAttribute("for",e),appendChildren(r,t),r}.call(this)]}function formatFileSize(e){const t=0===e?0:Math.floor(Math.log(e)/Math.log(1024)),r=Number((e/Math.pow(1024,t)).toFixed(2));return "".concat(r," ").concat(["B","kB","MB","GB","TB"][t])}function parseVersion(e){return e.split(".").map((e=>parseInt(e)))}function versionLessThan(e,t){let r=0;for(;r<e.length&&r<t.length;){if(e[r]<t[r])return !0;if(e[r]>t[r])return !1;r++;}return e.length<t.length}var CHANGELOG_URL="https://github.com/ROpdebee/mb-userscripts/blob/dist/mb_enhanced_cover_art_uploads.changelog.md",USERSCRIPT_FEATURE_HISTORY=[{versionAdded:"2022.7.27.5",description:"progress indicators"},{versionAdded:"2022.6.29.3",description:"add Yandex Music provider"},{versionAdded:"2022.6.29.2",description:"add Audiomack provider"},{versionAdded:"2022.6.29",description:"add VK Music provider"},{versionAdded:"2022.6.15",description:"file size and type on a-tisket images"},{versionAdded:"2022.6.11",description:"rockipedia.no provider"},{versionAdded:"2022.6.8",description:"update notifications"},{versionAdded:"2022.1.27.6",description:"bump IMU to latest version"},{versionAdded:"2022.1.27.5",description:"include full URL in logging messages"}],css_248z$2=".ROpdebee_feature_list{font-weight:300;margin:0 auto;width:-moz-fit-content;width:fit-content}.ROpdebee_feature_list ul{margin:6px 28px 0 0;text-align:left}";const LAST_DISPLAYED_KEY="ROpdebee_".concat(USERSCRIPT_ID,"_last_notified_update");function maybeDisplayNewFeatures(){const e=localStorage.getItem(LAST_DISPLAYED_KEY),t=GM.info.script;if(!e)return void localStorage.setItem(LAST_DISPLAYED_KEY,t.version);const r=parseVersion(e),n=USERSCRIPT_FEATURE_HISTORY.filter((e=>versionLessThan(r,parseVersion(e.versionAdded))));0!==n.length&&showFeatureNotification(t.name,t.version,n.map((e=>e.description)));}function showFeatureNotification(e,t,r){insertStylesheet(css_248z$2,"ROpdebee_Update_Banner");const n=function(){var s=document.createElement("div");s.setAttribute("class","banner warning-header");var o=document.createElement("p");s.appendChild(o),appendChildren(o,"".concat(e," was updated to v").concat(t,"! "));var a=document.createElement("a");a.setAttribute("href",CHANGELOG_URL),o.appendChild(a);var i=document.createTextNode("See full changelog here");a.appendChild(i),appendChildren(o,". New features since last update:");var c=document.createElement("div");c.setAttribute("class","ROpdebee_feature_list"),s.appendChild(c);var l=document.createElement("ul");c.appendChild(l),appendChildren(l,r.map((e=>function(){var t=document.createElement("li");return appendChildren(t,e),t}.call(this))));var d=document.createElement("button");return d.setAttribute("class","dismiss-banner remove-item icon"),d.setAttribute("data-banner-name","alert"),d.setAttribute("type","button"),d.addEventListener("click",(()=>{n.remove(),localStorage.setItem(LAST_DISPLAYED_KEY,GM.info.script.version);})),s.appendChild(d),s}.call(this);qs("#page").insertAdjacentElement("beforebegin",n);}

  LOGGER.configure({
      logLevel: LogLevel.INFO,
  });
  LOGGER.addSink(new ConsoleSink(USERSCRIPT_ID));

  const enqueueImage = _async(function (image) {
    var _image$types, _image$comment;

    let defaultTypes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    let defaultComment = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    dropImage(image.content);
    return _awaitIgnored(retryTimes(setImageParameters.bind(null, image.content.name, (_image$types = image.types) !== null && _image$types !== void 0 ? _image$types : defaultTypes, ((_image$comment = image.comment) !== null && _image$comment !== void 0 ? _image$comment : defaultComment).trim()), 5, 500));
  });

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
    assertDefined(fileRow, "Could not find image ".concat(imageName, " in queued uploads"));
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

    var _iterator = _createForOfIteratorHelper(images),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        const queuedUrl = _step.value;

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
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }

  function fillEditNote(allFetchedImages, origin, editNote) {
    const totalNumImages = allFetchedImages.reduce((acc, fetched) => acc + fetched.images.length, 0);
    if (!totalNumImages) return;
    const maxFilled = 3;
    let numFilled = 0;

    var _iterator2 = _createForOfIteratorHelper(allFetchedImages),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        const _step2$value = _step2.value,
              containerUrl = _step2$value.containerUrl,
              images = _step2$value.images;
        const imagesToFill = images.slice(0, maxFilled - numFilled);
        fillEditNoteFragment(editNote, imagesToFill, containerUrl);
        numFilled += imagesToFill.length;
        if (numFilled >= maxFilled) break;
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }

    if (totalNumImages > maxFilled) {
      editNote.addExtraInfo("\u2026and ".concat(totalNumImages - maxFilled, " additional image(s)"));
    }

    if (origin) {
      editNote.addExtraInfo("Seeded from ".concat(origin));
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
      }).find(id => typeof id !== 'undefined');
    }

    isSafeRedirect(originalUrl, redirectedUrl) {
      const id = this.extractId(originalUrl);
      return !!id && id === this.extractId(redirectedUrl);
    }

    fetchPage(url, options) {
      const _this = this;

      return _call(function () {
        return _await(gmxhr(url, options), function (resp) {
          if (typeof resp.finalUrl === 'undefined') {
            LOGGER.warn("Could not detect if ".concat(url.href, " caused a redirect"));
          } else if (resp.finalUrl !== url.href && !_this.isSafeRedirect(url, new URL(resp.finalUrl))) {
            throw new Error("Refusing to extract images from ".concat(_this.name, " provider because the original URL redirected to ").concat(resp.finalUrl, ", which may be a different release. If this redirected URL is correct, please retry with ").concat(resp.finalUrl, " directly."));
          }

          return resp.responseText;
        });
      });
    }

  }
  class HeadMetaPropertyProvider extends CoverArtProvider {
    is404Page(_document) {
      return false;
    }

    findImages(url) {
      const _this2 = this;

      return _call(function () {
        return _await(_this2.fetchPage(url), function (_this2$fetchPage) {
          const respDocument = parseDOM(_this2$fetchPage, url.href);

          if (_this2.is404Page(respDocument)) {
            throw new Error(_this2.name + ' release does not exist');
          }

          const coverElmt = qs('head > meta[property="og:image"]', respDocument);
          return [{
            url: new URL(coverElmt.content),
            types: [ArtworkTypeIDs.Front]
          }];
        });
      });
    }

  }
  class ProviderWithTrackImages extends CoverArtProvider {
    groupIdenticalImages(images, getImageUniqueId, mainUniqueId) {
      const uniqueImages = images.filter(img => getImageUniqueId(img) !== mainUniqueId);
      return groupBy(uniqueImages, getImageUniqueId, img => img);
    }

    urlToDigest(imageUrl) {
      const _this3 = this;

      return _call(function () {
        return _await(gmxhr(_this3.imageToThumbnailUrl(imageUrl), {
          responseType: 'blob'
        }), function (resp) {
          return blobToDigest(resp.response);
        });
      });
    }

    imageToThumbnailUrl(imageUrl) {
      return imageUrl;
    }

    mergeTrackImages(parsedTrackImages, mainUrl, byContent) {
      const _this4 = this;

      return _call(function () {
        const allTrackImages = filterNonNull(parsedTrackImages);

        const groupedImages = _this4.groupIdenticalImages(allTrackImages, img => img.url, mainUrl);

        return _await(_invoke(function () {
          if (byContent && groupedImages.size > 0 && !(groupedImages.size === 1 && !mainUrl)) {
            LOGGER.info('Deduplicating track images by content, this may take a while…');
            return _await(mainUrl ? _this4.urlToDigest(mainUrl) : '', function (mainDigest) {
              let numProcessed = 0;
              return _await(Promise.all([...groupedImages.entries()].map(_async(function (_ref) {
                let _ref2 = _slicedToArray(_ref, 2),
                    coverUrl = _ref2[0],
                    trackImages = _ref2[1];

                return _await(_this4.urlToDigest(coverUrl), function (digest) {
                  numProcessed++;
                  LOGGER.info("Deduplicating track images by content, this may take a while\u2026 (".concat(numProcessed, "/").concat(groupedImages.size, ")"));
                  return trackImages.map(trackImage => {
                    return _objectSpread2(_objectSpread2({}, trackImage), {}, {
                      digest
                    });
                  });
                });
              }))), function (tracksWithDigest) {
                const groupedThumbnails = _this4.groupIdenticalImages(tracksWithDigest.flat(), trackWithDigest => trackWithDigest.digest, mainDigest);

                groupedImages.clear();

                var _iterator = _createForOfIteratorHelper(groupedThumbnails.values()),
                    _step;

                try {
                  for (_iterator.s(); !(_step = _iterator.n()).done;) {
                    const trackImages = _step.value;
                    const representativeUrl = trackImages[0].url;
                    groupedImages.set(representativeUrl, trackImages);
                  }
                } catch (err) {
                  _iterator.e(err);
                } finally {
                  _iterator.f();
                }
              });
            }, !mainUrl);
          }
        }, function () {
          const results = [];
          groupedImages.forEach((trackImages, imgUrl) => {
            results.push({
              url: new URL(imgUrl),
              types: [ArtworkTypeIDs.Track],
              comment: _this4.createTrackImageComment(trackImages.map(trackImage => trackImage.trackNumber)) || undefined
            });
          });
          return results;
        }));
      });
    }

    createTrackImageComment(trackNumbers) {
      const definedTrackNumbers = filterNonNull(trackNumbers);
      if (definedTrackNumbers.length === 0) return '';
      const prefix = definedTrackNumbers.length === 1 ? 'Track' : 'Tracks';
      return "".concat(prefix, " ").concat(collatedSort(definedTrackNumbers).join(', '));
    }

  }

  const QUERY_SHA256 = '13e41f41a02b02d0a7e855a71e1a02478fd2fb0a2d104b54931d649e1d7c6ecd';
  class DiscogsProvider extends CoverArtProvider {
    constructor() {
      super(...arguments);

      _defineProperty(this, "supportedDomains", ['discogs.com']);

      _defineProperty(this, "favicon", 'https://catalog-assets.discogs.com/e95f0cd9.png');

      _defineProperty(this, "name", 'Discogs');

      _defineProperty(this, "urlRegex", /\/release\/(\d+)/);
    }

    findImages(url) {
      const _this = this;

      return _call(function () {
        const releaseId = _this.extractId(url);

        assertHasValue(releaseId);
        return _await(DiscogsProvider.getReleaseImages(releaseId), function (data) {
          return data.data.release.images.edges.map(edge => {
            return {
              url: new URL(edge.node.fullsize.sourceUrl)
            };
          });
        });
      });
    }

    static getReleaseImages(releaseId) {
      let respProm = this.apiResponseCache.get(releaseId);

      if (typeof respProm === 'undefined') {
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

    static actuallyGetReleaseImages(releaseId) {
      return _call(function () {
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
        return _await(gmxhr("https://www.discogs.com/internal/release-page/api/graphql?".concat(graphqlParams)), function (resp) {
          const metadata = safeParseJSON(resp.responseText, 'Invalid response from Discogs API');
          assertHasValue(metadata.data.release, 'Discogs release does not exist');
          const responseId = metadata.data.release.discogsId.toString();
          assert(typeof responseId === 'undefined' || responseId === releaseId, "Discogs returned wrong release: Requested ".concat(releaseId, ", got ").concat(responseId));
          return metadata;
        });
      });
    }

    static getFilenameFromUrl(url) {
      const urlParts = url.pathname.split('/');
      const firstFilenameIdx = urlParts.slice(2).findIndex(urlPart => !/^\w+:/.test(urlPart)) + 2;
      const s3Url = urlParts.slice(firstFilenameIdx).join('');
      const s3UrlDecoded = atob(s3Url.slice(0, s3Url.indexOf('.')));
      return s3UrlDecoded.split('/').pop();
    }

    static maximiseImage(url) {
      const _this2 = this;

      return _call(function () {
        var _imageName$match;

        const imageName = _this2.getFilenameFromUrl(url);

        const releaseId = (_imageName$match = imageName.match(/^R-(\d+)/)) === null || _imageName$match === void 0 ? void 0 : _imageName$match[1];
        return releaseId ? _await(_this2.getReleaseImages(releaseId), function (releaseData) {
          const matchedImage = releaseData.data.release.images.edges.find(img => _this2.getFilenameFromUrl(new URL(img.node.fullsize.sourceUrl)) === imageName);
          return matchedImage ? new URL(matchedImage.node.fullsize.sourceUrl) : url;
        }) : _await(url);
      });
    }

  }

  _defineProperty(DiscogsProvider, "apiResponseCache", new Map());

  function maxurl(url, options) {
    return retryTimes(() => {
      $$IMU_EXPORT$$(url, options);
    }, 100, 500);
  }

  const maximiseGeneric = function maximiseGeneric(smallurl) {
    return new _AsyncGenerator(function (_generator2) {
      return _await(new Promise(resolve => {
        maxurl(smallurl.href, _objectSpread2(_objectSpread2({}, options), {}, {
          cb: resolve
        })).catch(err => {
          LOGGER.error('Could not maximise image, maxurl unavailable?', err);
          resolve([]);
        });
      }), function (results) {
        return _continueIgnored(_forOf(results, function (maximisedResult) {
          if (maximisedResult.fake || maximisedResult.bad) return;
          return _continueIgnored(_catchInGenerator(function () {
            return _generator2._yield(_objectSpread2(_objectSpread2({}, maximisedResult), {}, {
              url: new URL(maximisedResult.url)
            })).then(_empty);
          }, _empty));
        }));
      });
    });
  };

  const getMaximisedCandidates = function getMaximisedCandidates(smallurl) {
    return new _AsyncGenerator(function (_generator) {
      const exceptionFn = IMU_EXCEPTIONS.get(smallurl.hostname);
      return _await((exceptionFn !== null && exceptionFn !== void 0 ? exceptionFn : maximiseGeneric)(smallurl), function (iterable) {
        return _continueIgnored(_forAwaitOf(iterable, function (item) {
          return _generator._yield(item).then(_empty);
        }));
      });
    });
  };
  const options = {
    fill_object: true,
    exclude_videos: true,

    filter(url) {
      return !url.toLowerCase().endsWith('.webp') && !/:format(webp)/.test(url.toLowerCase());
    }

  };
  const IMU_EXCEPTIONS = new DispatchMap();
  IMU_EXCEPTIONS.set('i.discogs.com', _async(function (smallurl) {
    return _await(DiscogsProvider.maximiseImage(smallurl), function (fullSizeURL) {
      return [{
        url: fullSizeURL,
        filename: DiscogsProvider.getFilenameFromUrl(smallurl),
        headers: {}
      }];
    });
  }));
  IMU_EXCEPTIONS.set('*.mzstatic.com', _async(function (smallurl) {
    var _smallurl$href$match;

    const results = [];
    const smallOriginalName = (_smallurl$href$match = smallurl.href.match(/(?:[a-f\d]{2}\/){3}[a-f\d-]{36}\/([^/]+)/)) === null || _smallurl$href$match === void 0 ? void 0 : _smallurl$href$match[1];
    return _continue(_forAwaitOf(maximiseGeneric(smallurl), function (imgGeneric) {
      if (urlBasename(imgGeneric.url) === 'source' && smallOriginalName !== 'source') {
        imgGeneric.likely_broken = true;
      }

      results.push(imgGeneric);
    }), function () {
      return results;
    });
  }));
  IMU_EXCEPTIONS.set('usercontent.jamendo.com', _async(function (smallurl) {
    return [{
      url: new URL(smallurl.href.replace(/([&?])width=\d+/, '$1width=0')),
      filename: '',
      headers: {}
    }];
  }));
  IMU_EXCEPTIONS.set('hw-img.datpiff.com', _async(function (smallurl) {
    const urlNoSuffix = smallurl.href.replace(/-(?:large|medium)(\.\w+$)/, '$1');
    return ['-large', '-medium', ''].map(suffix => {
      return {
        url: new URL(urlNoSuffix.replace(/\.(\w+)$/, "".concat(suffix, ".$1"))),
        filename: '',
        headers: {}
      };
    });
  }));

  class SevenDigitalProvider extends HeadMetaPropertyProvider {
    constructor() {
      super(...arguments);

      _defineProperty(this, "supportedDomains", ['*.7digital.com']);

      _defineProperty(this, "favicon", 'https://css-cdn.7digital.com/static/build/images/favicons/7digital/touch-ipad-retina.png');

      _defineProperty(this, "name", '7digital');

      _defineProperty(this, "urlRegex", /release\/.*-(\d+)(?:\/|$)/);
    }

    postprocessImage(image) {
      return _call(function () {
        if (/\/0{8}16_\d+/.test(image.fetchedUrl.pathname)) {
          LOGGER.warn("Skipping \"".concat(image.fetchedUrl, "\" as it matches a placeholder cover"));
          return _await(null);
        }

        return _await(image);
      });
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

    findImages(url) {
      const _this = this;

      return _call(function () {
        return _await(_this.fetchPage(url), function (page) {
          var _page$match;

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
        });
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
  const DIGITAL_PAGE_QUERY = '.DigitalMusicDetailPage';
  const PHYSICAL_AUDIOBOOK_PAGE_QUERY = '#booksImageBlock_feature_div';
  const AUDIBLE_FRONT_IMAGE_QUERY = '#mf_pdp_hero_widget_book_img img';
  const DIGITAL_FRONT_IMAGE_QUERY = '#digitalMusicProductImage_feature_div > img';
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

    findImages(url) {
      const _this = this;

      return _call(function () {
        return _await(_this.fetchPage(url), function (pageContent) {
          const pageDom = parseDOM(pageContent, url.href);
          let finder;

          if (qsMaybe(AUDIBLE_PAGE_QUERY, pageDom)) {
            LOGGER.debug('Searching for images in Audible page');
            finder = _this.findAudibleImages;
          } else if (qsMaybe(DIGITAL_PAGE_QUERY, pageDom)) {
            LOGGER.debug('Searching for images in digital release page');
            finder = _this.findDigitalImages;
          } else if (qsMaybe(PHYSICAL_AUDIOBOOK_PAGE_QUERY, pageDom)) {
            LOGGER.debug('Searching for images in physical audiobook page');
            finder = _this.findPhysicalAudiobookImages;
          } else {
            LOGGER.debug('Searching for images in generic physical page');
            finder = _this.findGenericPhysicalImages;
          }

          return _await(finder.bind(_this)(url, pageContent, pageDom), function (covers) {
            return covers.filter(img => !PLACEHOLDER_IMG_NAMES.some(name => decodeURIComponent(img.url.pathname).includes(name)));
          });
        });
      });
    }

    findGenericPhysicalImages(_url, pageContent) {
      const _this2 = this;

      return _call(function () {
        const imgs = _this2.extractEmbeddedJSImages(pageContent, /\s*'colorImages': { 'initial': (.+)},$/m);

        assertNonNull(imgs, 'Failed to extract images from embedded JS on generic physical page');
        return _await(imgs.map(img => {
          var _img$hiRes;

          return _this2.convertVariant({
            url: (_img$hiRes = img.hiRes) !== null && _img$hiRes !== void 0 ? _img$hiRes : img.large,
            variant: img.variant
          });
        }));
      });
    }

    findPhysicalAudiobookImages(_url, pageContent) {
      const _this3 = this;

      return _call(function () {
        const imgs = _this3.extractEmbeddedJSImages(pageContent, /\s*'imageGalleryData' : (.+),$/m);

        assertNonNull(imgs, 'Failed to extract images from embedded JS on physical audiobook page');
        return _await(imgs.map(img => ({
          url: new URL(img.mainUrl)
        })));
      });
    }

    findDigitalImages(_url, _pageContent, pageDom) {
      const _this4 = this;

      return _call(function () {
        return _await(_this4.extractFrontCover(pageDom, DIGITAL_FRONT_IMAGE_QUERY));
      });
    }

    findAudibleImages(url, _pageContent, pageDom) {
      const _this5 = this;

      return _call(function () {
        let _exit = false;
        return _await(_invoke(function () {
          if (/\/(?:gp\/product|dp)\//.test(url.pathname)) {
            const audibleUrl = urlJoin(url.origin, '/hz/audible/mlp/mfpdp/', _this5.extractId(url));
            return _await(_this5.fetchPage(audibleUrl), function (audibleContent) {
              const audibleDom = parseDOM(audibleContent, audibleUrl.href);

              const _this5$findAudibleIma = _this5.findAudibleImages(audibleUrl, audibleContent, audibleDom);

              _exit = true;
              return _this5$findAudibleIma;
            });
          }
        }, function (_result) {
          return _exit ? _result : _this5.extractFrontCover(pageDom, AUDIBLE_FRONT_IMAGE_QUERY);
        }));
      });
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
        LOGGER.debug("Could not parse embedded JS images, not array, got ".concat(imgs));
        return null;
      }

      return imgs;
    }

    convertVariant(cover) {
      const url = new URL(cover.url);
      const type = cover.variant && VARIANT_TYPE_MAPPING[cover.variant];
      LOGGER.debug("".concat(url.href, " has the Amazon image variant code '").concat(cover.variant, "'"));

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

    findImages(url) {
      const _this = this;

      return _call(function () {
        const asin = _this.extractId(url);

        assertHasValue(asin);
        const productUrl = new URL(url.href);
        productUrl.hostname = productUrl.hostname.replace(/^music\./, '');
        productUrl.pathname = '/dp/' + asin;
        return _await(new AmazonProvider().findImages(productUrl));
      });
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

    findImages(url) {
      const _this = this;

      return _call(function () {
        const itemId = _this.extractId(url);

        assertDefined(itemId);
        return _await(getItemMetadata(itemId), function (itemMetadata) {
          let _exit = false;

          const baseDownloadUrl = _this.createBaseDownloadUrl(itemMetadata);

          return _invoke(function () {
            if (ArchiveProvider.CAA_ITEM_REGEX.test(itemId)) {
              return _catch(function () {
                return _await(_this.extractCAAImages(itemId, baseDownloadUrl), function (_await$_this$extractC) {
                  _exit = true;
                  return _await$_this$extractC;
                });
              }, function () {
                LOGGER.warn('Failed to extract CAA images, falling back on generic IA extraction');
              });
            }
          }, function (_result2) {
            return _exit ? _result2 : _this.extractGenericImages(itemMetadata, baseDownloadUrl);
          });
        });
      });
    }

    findImagesCAA(itemId) {
      const _this2 = this;

      return _call(function () {
        return _await(getItemMetadata(itemId), function (itemMetadata) {
          const baseDownloadUrl = _this2.createBaseDownloadUrl(itemMetadata);

          return _this2.extractCAAImages(itemId, baseDownloadUrl);
        });
      });
    }

    extractCAAImages(itemId, baseDownloadUrl) {
      return _call(function () {
        const caaIndexUrl = "https://archive.org/download/".concat(itemId, "/index.json");
        return _await(gmxhr(caaIndexUrl), function (caaIndexResp) {
          const caaIndex = safeParseJSON(caaIndexResp.responseText, 'Could not parse index.json');
          return caaIndex.images.map(img => {
            const imageFileName = urlBasename(img.image);
            return {
              url: urlJoin(baseDownloadUrl, "".concat(itemId, "-").concat(imageFileName)),
              comment: img.comment,
              types: img.types.map(type => ArtworkTypeIDs[type])
            };
          });
        });
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
      return urlJoin("https://".concat(itemMetadata.server), "".concat(itemMetadata.dir, "/"));
    }

  }

  _defineProperty(ArchiveProvider, "CAA_ITEM_REGEX", /^mbid-[a-f\d-]+$/);

  _defineProperty(ArchiveProvider, "IMAGE_FILE_FORMATS", ['JPEG', 'PNG', 'Text PDF', 'Animated GIF']);

  class AudiomackProvider extends CoverArtProvider {
    constructor() {
      super(...arguments);

      _defineProperty(this, "supportedDomains", ['audiomack.com']);

      _defineProperty(this, "name", 'Audiomack');

      _defineProperty(this, "favicon", 'https://audiomack.com/static/favicon-32x32.png');

      _defineProperty(this, "urlRegex", /\.com\/([^/]+\/(?:song|album)\/[^/?#]+)/);
    }

    findImages(url) {
      const _this = this;

      return _call(function () {
        return _await(_this.fetchPage(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
          }
        }), function (pageContent) {
          var _pageContent$match, _initialState$musicAl;

          const initialStateText = (_pageContent$match = pageContent.match(/window\.__INITIAL_STATE__ = (.+);\s*$/m)) === null || _pageContent$match === void 0 ? void 0 : _pageContent$match[1];
          assertDefined(initialStateText, 'Could not parse Audiomack state from page');
          const initialState = safeParseJSON(initialStateText);
          const info = (_initialState$musicAl = initialState === null || initialState === void 0 ? void 0 : initialState.musicAlbum.info) !== null && _initialState$musicAl !== void 0 ? _initialState$musicAl : initialState === null || initialState === void 0 ? void 0 : initialState.musicSong.info;
          assertHasValue(info, 'Could not retrieve music information from state');
          return [{
            url: new URL(info.image),
            types: [ArtworkTypeIDs.Front]
          }];
        });
      });
    }

  }

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

  class BandcampProvider extends ProviderWithTrackImages {
    constructor() {
      super(...arguments);

      _defineProperty(this, "supportedDomains", ['*.bandcamp.com']);

      _defineProperty(this, "favicon", 'https://s4.bcbits.com/img/favicon/favicon-32x32.png');

      _defineProperty(this, "name", 'Bandcamp');

      _defineProperty(this, "urlRegex", /^(.+)\.bandcamp\.com\/(track|album)\/([^/]+)(?:\/|$)/);
    }

    extractId(url) {
      var _this$cleanUrl$match, _this$cleanUrl$match$;

      return (_this$cleanUrl$match = this.cleanUrl(url).match(this.urlRegex)) === null || _this$cleanUrl$match === void 0 ? void 0 : (_this$cleanUrl$match$ = _this$cleanUrl$match.slice(1)) === null || _this$cleanUrl$match$ === void 0 ? void 0 : _this$cleanUrl$match$.join('/');
    }

    findImages(url) {
      const _this = this;

      let onlyFront = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      return _call(function () {
        return _await(_this.fetchPage(url), function (_this$fetchPage) {
          const respDocument = parseDOM(_this$fetchPage, url.href);

          const albumCoverUrl = _this.extractCover(respDocument);

          const covers = [];

          if (albumCoverUrl) {
            covers.push({
              url: new URL(albumCoverUrl),
              types: [ArtworkTypeIDs.Front]
            });
          } else {
            LOGGER.warn('Bandcamp release has no cover');
          }

          return _await(onlyFront ? [] : _this.findTrackImages(respDocument, albumCoverUrl), function (trackImages) {
            return _this.amendSquareThumbnails([...covers, ...trackImages]);
          }, onlyFront);
        });
      });
    }

    extractCover(doc) {
      if (qsMaybe('#missing-tralbum-art', doc) !== null) {
        return;
      }

      return qs('#tralbumArt > .popupImage', doc).href;
    }

    findTrackImages(doc, mainUrl) {
      const _this2 = this;

      return _call(function () {
        const trackRows = qsa('#track_table .track_row_view', doc);
        if (trackRows.length === 0) return _await([]);
        LOGGER.info('Checking for Bandcamp track images, this may take a few seconds…');
        const throttledFetchPage = pThrottle({
          interval: 1000,
          limit: 5
        })(_this2.fetchPage.bind(_this2));
        let numProcessed = 0;
        return _await(Promise.all(trackRows.map(_async(function (trackRow) {
          return _await(_this2.findTrackImage(trackRow, throttledFetchPage), function (trackImage) {
            numProcessed++;
            LOGGER.info("Checking for Bandcamp track images, this may take a few seconds\u2026 (".concat(numProcessed, "/").concat(trackRows.length, ")"));
            return trackImage;
          });
        }))), function (trackImages) {
          return _await(_this2.mergeTrackImages(trackImages, mainUrl, true), function (mergedTrackImages) {
            if (mergedTrackImages.length > 0) {
              LOGGER.info("Found ".concat(mergedTrackImages.length, " unique track images"));
            } else {
              LOGGER.info('Found no unique track images this time');
            }

            return mergedTrackImages;
          });
        });
      });
    }

    findTrackImage(trackRow, fetchPage) {
      const _this3 = this;

      return _call(function () {
        var _trackRow$getAttribut, _trackRow$getAttribut2, _qsMaybe;

        const trackNum = (_trackRow$getAttribut = trackRow.getAttribute('rel')) === null || _trackRow$getAttribut === void 0 ? void 0 : (_trackRow$getAttribut2 = _trackRow$getAttribut.match(/tracknum=(\w+)/)) === null || _trackRow$getAttribut2 === void 0 ? void 0 : _trackRow$getAttribut2[1];
        const trackUrl = (_qsMaybe = qsMaybe('.title > a', trackRow)) === null || _qsMaybe === void 0 ? void 0 : _qsMaybe.href;

        if (!trackUrl) {
          LOGGER.warn("Could not check track ".concat(trackNum, " for track images"));
          return _await();
        }

        return _await(_catch(function () {
          return _await(fetchPage(new URL(trackUrl)), function (_fetchPage) {
            const trackPage = parseDOM(_fetchPage, trackUrl);

            const imageUrl = _this3.extractCover(trackPage);

            if (!imageUrl) {
              return;
            }

            return {
              url: imageUrl,
              trackNumber: trackNum
            };
          });
        }, function (err) {
          LOGGER.error("Could not check track ".concat(trackNum, " for track images"), err);
        }));
      });
    }

    amendSquareThumbnails(covers) {
      return _call(function () {
        return Promise.all(covers.map(_async(function (cover) {
          let _exit = false;
          let coverDims;
          return _continue(_catch(function () {
            return _await(getImageDimensions(cover.url.href.replace(/_\d+\.(\w+)$/, '_0.$1')), function (_getImageDimensions) {
              coverDims = _getImageDimensions;
            });
          }, function (err) {
            LOGGER.warn("Could not retrieve image dimensions for ".concat(cover.url, ", square thumbnail will not be added"), err);
            const _temp = [cover];
            _exit = true;
            return _temp;
          }), function (_result) {
            if (_exit) return _result;

            if (!coverDims.width || !coverDims.height) {
              return [cover];
            }

            const ratio = coverDims.width / coverDims.height;
            return 0.95 <= ratio && ratio <= 1.05 ? [cover] : [_objectSpread2(_objectSpread2({}, cover), {}, {
              comment: filterNonNull([cover.comment, 'Bandcamp full-sized cover']).join(' - ')
            }), {
              types: cover.types,
              url: new URL(cover.url.href.replace(/_\d+\.(\w+)$/, '_16.$1')),
              comment: filterNonNull([cover.comment, 'Bandcamp square crop']).join(' - '),
              skipMaximisation: true
            }];
          });
        }))).then(nestedCovers => nestedCovers.flat());
      });
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

    findImages(url) {
      const _this = this;

      return _call(function () {
        return _await(_this.fetchPage(url), function (_this$fetchPage) {
          const respDocument = parseDOM(_this$fetchPage, url.href);
          const coverElmt = qs('head > meta[name="og:image"]', respDocument);
          return [{
            url: new URL(coverElmt.content),
            types: [ArtworkTypeIDs.Front]
          }];
        });
      });
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

    findImages(url) {
      const _this = this;

      return _call(function () {
        return _await(_this.fetchPage(url), function (_this$fetchPage) {
          const respDocument = parseDOM(_this$fetchPage, url.href);

          if (respDocument.title === 'Mixtape Not Found') {
            throw new Error(_this.name + ' release does not exist');
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
        });
      });
    }

    postprocessImage(image) {
      return _call(function () {
        return _await(blobToDigest(image.content), function (digest) {
          if (DatPiffProvider.placeholderDigests.includes(digest)) {
            LOGGER.warn("Skipping \"".concat(image.fetchedUrl, "\" as it matches a placeholder cover"));
            return null;
          } else {
            return image;
          }
        });
      });
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

    findImages(url) {
      const _super$findImages = super.findImages,
            _this = this;

      return _call(function () {
        return _await(_super$findImages.call(_this, url), function (covers) {
          return covers.filter(cover => {
            if (cover.url.pathname.includes('d41d8cd98f00b204e9800998ecf8427e')) {
              LOGGER.warn('Ignoring placeholder cover in Deezer release');
              return false;
            }

            return true;
          });
        });
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

  class MusicBrainzProvider extends CoverArtProvider {
    constructor() {
      super(...arguments);

      _defineProperty(this, "supportedDomains", ['musicbrainz.org', 'beta.musicbrainz.org']);

      _defineProperty(this, "favicon", 'https://musicbrainz.org/static/images/favicons/favicon-32x32.png');

      _defineProperty(this, "allowButtons", false);

      _defineProperty(this, "name", 'MusicBrainz');

      _defineProperty(this, "urlRegex", /release\/([a-f\d-]+)/);
    }

    findImages(url) {
      const _this = this;

      return _call(function () {
        const mbid = _this.extractId(url);

        assertDefined(mbid);
        return _await(new ArchiveProvider().findImagesCAA("mbid-".concat(mbid)));
      });
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

    findImages(url) {
      const _this = this;

      return _call(function () {
        return _await(_this.fetchPage(url), function (_this$fetchPage) {
          const page = parseDOM(_this$fetchPage, url.href);
          const coverElements = qsa('#imageGallery > li', page);
          return coverElements.map(coverLi => {
            const coverSrc = coverLi.dataset.src;
            assertDefined(coverSrc, 'Musik-Sammler image without source?');
            return {
              url: new URL(coverSrc, 'https://www.musik-sammler.de/')
            };
          });
        });
      });
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
      const imgUrl = "https://static.qobuz.com/images/covers/".concat(d1, "/").concat(d2, "/").concat(id, "_org.jpg");
      return new URL(imgUrl);
    }

    static getMetadata(id) {
      return _call(function () {
        return _await(gmxhr("https://www.qobuz.com/api.json/0.2/album/get?album_id=".concat(id, "&offset=0&limit=20"), {
          headers: {
            'x-app-id': QobuzProvider.QOBUZ_APP_ID
          }
        }), function (resp) {
          const metadata = safeParseJSON(resp.responseText, 'Invalid response from Qobuz API');
          assert(metadata.id.toString() === id, "Qobuz returned wrong release: Requested ".concat(id, ", got ").concat(metadata.id));
          return metadata;
        });
      });
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

    findImages(url) {
      const _this = this;

      return _call(function () {
        let _exit = false;

        const id = _this.extractId(url);

        assertHasValue(id);
        let metadata;
        return _await(_continue(_catch(function () {
          return _await(QobuzProvider.getMetadata(id), function (_QobuzProvider$getMet) {
            metadata = _QobuzProvider$getMet;
          });
        }, function (err) {
          if (err instanceof HTTPResponseError && err.statusCode == 400) {
            console.error(err);
            throw new Error('Bad request to Qobuz API, app ID invalid?');
          }

          if (err instanceof HTTPResponseError && err.statusCode == 404) {
            LOGGER.warn('Qobuz API returned 404, falling back on URL rewriting. Booklets may be missed.');
            const _temp = [{
              url: QobuzProvider.idToCoverUrl(id),
              types: [ArtworkTypeIDs.Front]
            }];
            _exit = true;
            return _temp;
          }

          throw err;
        }), function (_result) {
          var _metadata$goodies;

          if (_exit) return _result;
          const goodies = QobuzProvider.extractGoodies((_metadata$goodies = metadata.goodies) !== null && _metadata$goodies !== void 0 ? _metadata$goodies : []);
          const coverUrl = metadata.image.large.replace(/_\d+\.([a-zA-Z\d]+)$/, '_org.$1');
          return [{
            url: new URL(coverUrl),
            types: [ArtworkTypeIDs.Front]
          }, ...goodies];
        }));
      });
    }

  }

  class QubMusiqueProvider extends QobuzProvider {
    constructor() {
      super(...arguments);

      _defineProperty(this, "supportedDomains", ['qub.ca']);

      _defineProperty(this, "favicon", 'https://www.qub.ca/assets/favicons/apple-touch-icon.png');

      _defineProperty(this, "name", 'QUB Musique');

      _defineProperty(this, "urlRegex", [/musique\/album\/[\w-]*-([A-Za-z\d]+)(?:\/|$)/]);
    }

  }

  class RateYourMusicProvider extends CoverArtProvider {
    constructor() {
      super(...arguments);

      _defineProperty(this, "supportedDomains", ['rateyourmusic.com']);

      _defineProperty(this, "favicon", 'https://e.snmc.io/2.5/img/sonemic.png');

      _defineProperty(this, "name", 'RateYourMusic');

      _defineProperty(this, "urlRegex", /\/release\/((?:album|single)(?:\/[^/]+){2})(?:\/|$)/);
    }

    findImages(url) {
      const _this = this;

      return _call(function () {
        const releaseId = _this.extractId(url);

        assertHasValue(releaseId);
        const buyUrl = "https://rateyourmusic.com/release/".concat(releaseId, "/buy");
        return _await(_this.fetchPage(new URL(buyUrl)), function (_this$fetchPage) {
          const buyDoc = parseDOM(_this$fetchPage, buyUrl);

          if (qsMaybe('.header_profile_logged_in', buyDoc) === null) {
            throw new Error('Extracting covers from RYM requires being logged in to an RYM account.');
          }

          const fullResUrl = qs('.qq a', buyDoc).href;
          return [{
            url: new URL(fullResUrl),
            types: [ArtworkTypeIDs.Front]
          }];
        });
      });
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

    findImages(url) {
      const _this = this;

      return _call(function () {
        const id = _this.extractId(url);

        assertDefined(id);
        const imageBrowserUrl = new URL("https://www.rockipedia.no/?imagebrowser=true&t=album&id=".concat(id));
        return _await(_this.fetchPage(imageBrowserUrl), function (_this$fetchPage) {
          const imageBrowserDoc = parseDOM(_this$fetchPage, url.href);
          const coverElements = qsa('li.royalSlide', imageBrowserDoc);
          return filterNonNull(coverElements.map(coverElement => {
            const coverUrl = coverElement.dataset.src;

            if (!coverUrl) {
              LOGGER.warn("Could not extract a cover for Rockipedia release ".concat(url, ": Unexpected null src"));
              return null;
            }

            return {
              url: new URL(coverUrl)
            };
          }));
        });
      });
    }

  }

  class SoundcloudProvider extends ProviderWithTrackImages {
    constructor() {
      super(...arguments);

      _defineProperty(this, "supportedDomains", ['soundcloud.com']);

      _defineProperty(this, "favicon", 'https://a-v2.sndcdn.com/assets/images/sc-icons/favicon-2cadd14bdb.ico');

      _defineProperty(this, "name", 'Soundcloud');

      _defineProperty(this, "urlRegex", []);
    }

    supportsUrl(url) {
      const _url$pathname$trim$sl = url.pathname.trim().slice(1).replace(/\/$/, '').split('/'),
            _url$pathname$trim$sl2 = _toArray(_url$pathname$trim$sl),
            artistId = _url$pathname$trim$sl2[0],
            pathParts = _url$pathname$trim$sl2.slice(1);

      return pathParts.length > 0 && !SoundcloudProvider.badArtistIDs.has(artistId) && !SoundcloudProvider.badSubpaths.has(urlBasename(url));
    }

    extractId(url) {
      return url.pathname.slice(1);
    }

    findImages(url) {
      const _this = this;

      let onlyFront = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      return _call(function () {
        return _await(_this.fetchPage(url), function (pageContent) {
          var _this$extractMetadata;

          const metadata = (_this$extractMetadata = _this.extractMetadataFromJS(pageContent)) === null || _this$extractMetadata === void 0 ? void 0 : _this$extractMetadata.find(data => ['sound', 'playlist'].includes(data.hydratable));

          if (!metadata) {
            throw new Error('Could not extract metadata from Soundcloud page. The release may have been removed.');
          }

          if (metadata.hydratable === 'sound') {
            return _this.extractCoverFromTrackMetadata(metadata);
          } else {
            assert(metadata.hydratable === 'playlist');
            return _this.extractCoversFromSetMetadata(metadata, onlyFront);
          }
        });
      });
    }

    extractMetadataFromJS(pageContent) {
      var _pageContent$match;

      const jsonData = (_pageContent$match = pageContent.match(/>window\.__sc_hydration = (.+);<\/script>/)) === null || _pageContent$match === void 0 ? void 0 : _pageContent$match[1];
      if (!jsonData) return;
      return safeParseJSON(jsonData);
    }

    extractCoverFromTrackMetadata(metadata) {
      if (!metadata.data.artwork_url) {
        return [];
      }

      return [{
        url: new URL(metadata.data.artwork_url),
        types: [ArtworkTypeIDs.Front]
      }];
    }

    extractCoversFromSetMetadata(metadata, onlyFront) {
      const _this2 = this;

      return _call(function () {
        const covers = [];

        if (metadata.data.artwork_url) {
          covers.push({
            url: new URL(metadata.data.artwork_url),
            types: [ArtworkTypeIDs.Front]
          });
        }

        if (onlyFront) return _await(covers);
        const trackCovers = filterNonNull(metadata.data.tracks.flatMap((track, trackNumber) => {
          if (!track.artwork_url) return;
          return {
            url: track.artwork_url,
            trackNumber: (trackNumber + 1).toString()
          };
        }));
        return _await(_this2.mergeTrackImages(trackCovers, metadata.data.artwork_url, true), function (mergedTrackCovers) {
          return [...covers, ...mergedTrackCovers];
        });
      });
    }

  }

  _defineProperty(SoundcloudProvider, "badArtistIDs", new Set(['you', 'discover', 'stream', 'upload', 'search']));

  _defineProperty(SoundcloudProvider, "badSubpaths", new Set(['likes', 'followers', 'following', 'reposts', 'albums', 'tracks', 'popular-tracks', 'comments', 'sets', 'recommended']));

  class SpotifyProvider extends HeadMetaPropertyProvider {
    constructor() {
      super(...arguments);

      _defineProperty(this, "supportedDomains", ['open.spotify.com']);

      _defineProperty(this, "favicon", 'https://open.scdn.co/cdn/images/favicon32.8e66b099.png');

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

    getCountryCode() {
      const _this = this;

      return _call(function () {
        return _await(_invoke(function () {
          if (!_this.countryCode) {
            return _await(gmxhr('https://listen.tidal.com/v1/country/context?countryCode=WW&locale=en_US&deviceType=BROWSER', {
              headers: {
                'x-tidal-token': APP_ID
              }
            }), function (resp) {
              const codeResponse = safeParseJSON(resp.responseText, 'Invalid JSON response from Tidal API for country code');
              _this.countryCode = codeResponse.countryCode;
            });
          }
        }, function () {
          assertHasValue(_this.countryCode, 'Cannot determine Tidal country');
          return _this.countryCode;
        }));
      });
    }

    getCoverUrlFromMetadata(albumId) {
      const _this2 = this;

      return _call(function () {
        return _await(_this2.getCountryCode(), function (countryCode) {
          return _await(gmxhr('https://listen.tidal.com/v1/ping'), function () {
            const apiUrl = "https://listen.tidal.com/v1/pages/album?albumId=".concat(albumId, "&countryCode=").concat(countryCode, "&deviceType=BROWSER");
            return _await(gmxhr(apiUrl, {
              headers: {
                'x-tidal-token': APP_ID
              }
            }), function (resp) {
              var _metadata$rows$, _metadata$rows$$modul, _metadata$rows$$modul2;

              const metadata = safeParseJSON(resp.responseText, 'Invalid response from Tidal API');
              const albumMetadata = (_metadata$rows$ = metadata.rows[0]) === null || _metadata$rows$ === void 0 ? void 0 : (_metadata$rows$$modul = _metadata$rows$.modules) === null || _metadata$rows$$modul === void 0 ? void 0 : (_metadata$rows$$modul2 = _metadata$rows$$modul[0]) === null || _metadata$rows$$modul2 === void 0 ? void 0 : _metadata$rows$$modul2.album;
              assertHasValue(albumMetadata, 'Tidal API returned no album, 404?');
              assert(albumMetadata.id.toString() === albumId, "Tidal returned wrong release: Requested ".concat(albumId, ", got ").concat(albumMetadata.id));
              const coverId = albumMetadata.cover;
              assertHasValue(coverId, 'Could not find cover in Tidal metadata');
              return "https://resources.tidal.com/images/".concat(coverId.replace(/-/g, '/'), "/origin.jpg");
            });
          });
        });
      });
    }

    findImages(url) {
      const _this3 = this;

      return _call(function () {
        const albumId = _this3.extractId(url);

        assertHasValue(albumId);
        return _await(_this3.getCoverUrlFromMetadata(albumId), function (coverUrl) {
          return [{
            url: new URL(coverUrl),
            types: [ArtworkTypeIDs.Front]
          }];
        });
      });
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
    const typeKeywordsToTypes = [['front', ArtworkTypeIDs.Front], ['back', ArtworkTypeIDs.Back], ['spine', ArtworkTypeIDs.Spine], ['top', ArtworkTypeIDs.Top], ['bottom', ArtworkTypeIDs.Bottom], ['interior', ArtworkTypeIDs.Tray], ['inside', ArtworkTypeIDs.Tray]];

    for (var _i = 0, _typeKeywordsToTypes = typeKeywordsToTypes; _i < _typeKeywordsToTypes.length; _i++) {
      const _typeKeywordsToTypes$ = _slicedToArray(_typeKeywordsToTypes[_i], 2),
            typeKeyword = _typeKeywordsToTypes$[0],
            type = _typeKeywordsToTypes$[1];

      if (keywords.some(kw => kw.toLowerCase() === typeKeyword)) {
        types.add(type);
      }
    }

    if (types.has(ArtworkTypeIDs.Front) && types.has(ArtworkTypeIDs.Back)) {
      types.add(ArtworkTypeIDs.Spine);
    }

    const typeKeywords = new Set(typeKeywordsToTypes.map(_ref => {
      let _ref2 = _slicedToArray(_ref, 1),
          typeKeyword = _ref2[0];

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
    const keywords = caption.split(/,|\s/).filter(Boolean);
    const commentParts = [];
    let type = ArtworkTypeIDs.Medium;

    var _iterator = _createForOfIteratorHelper(keywords),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        const keyword = _step.value;

        if (/reverse|back/i.test(keyword)) {
          type = ArtworkTypeIDs.Matrix;
        } else {
          commentParts.push(keyword);
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    if (commentParts.length > 0 && /^\d+/.test(commentParts[0])) {
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
    insert: {
      type: ArtworkTypeIDs.Other,
      comment: 'Insert'
    },
    inside: ArtworkTypeIDs.Tray,
    case: mapPackagingType.bind(undefined, 'Case'),
    contents: ArtworkTypeIDs.Raw
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

  for (var _i2 = 0, _Object$entries = Object.entries(__CAPTION_TYPE_MAPPING); _i2 < _Object$entries.length; _i2++) {
    const _Object$entries$_i = _slicedToArray(_Object$entries[_i2], 2),
          key = _Object$entries$_i[0],
          value = _Object$entries$_i[1];

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
    LOGGER.debug("Found caption \u201C".concat(caption, "\u201D"));

    const _caption$trim$split = caption.trim().split(/\b/),
          _caption$trim$split2 = _toArray(_caption$trim$split),
          captionType = _caption$trim$split2[0],
          captionRestParts = _caption$trim$split2.slice(1);

    const captionRest = cleanupCaption(captionRestParts.join('').trim());
    const mapper = CAPTION_TYPE_MAPPING[captionType.toLowerCase()];

    if (!mapper) {
      LOGGER.debug("Could not map \u201C".concat(captionType, "\u201D to any known cover art types"));
      LOGGER.debug("Setting cover art comment to \u201C".concat(caption, "\u201D"));
      return {
        comment: caption
      };
    }

    const mappedResult = mapper(captionRest);
    LOGGER.debug("Mapped caption to types ".concat(mappedResult.types, " and comment \u201C").concat(mappedResult.comment, "\u201D"));
    return mappedResult;
  }

  function convertCaptions(cover) {
    const url = new URL(cover.url);

    if (!cover.caption) {
      return {
        url
      };
    }

    return _objectSpread2({
      url
    }, convertCaption(cover.caption));
  }
  class VGMdbProvider extends CoverArtProvider {
    constructor() {
      super(...arguments);

      _defineProperty(this, "supportedDomains", ['vgmdb.net']);

      _defineProperty(this, "favicon", 'https://vgmdb.net/favicon.ico');

      _defineProperty(this, "name", 'VGMdb');

      _defineProperty(this, "urlRegex", /\/album\/(\d+)(?:\/|$)/);
    }

    findImages(url) {
      const _this = this;

      return _call(function () {
        return _await(_this.fetchPage(url), function (pageSrc) {
          if (pageSrc.includes('/db/img/banner-error.gif')) {
            throw new Error('VGMdb returned an error');
          }

          const pageDom = parseDOM(pageSrc, url.href);

          if (qsMaybe('#navmember', pageDom) === null) {
            LOGGER.warn('Heads up! VGMdb requires you to be logged in to view all images. Some images may have been missed. If you have an account, please log in to VGMdb to fetch all images.');
          }

          const coverGallery = qsMaybe('#cover_gallery', pageDom);
          return _await(coverGallery ? VGMdbProvider.extractCoversFromDOMGallery(coverGallery) : [], function (galleryCovers) {
            var _qsMaybe, _qsMaybe$style$backgr;

            const mainCoverUrl = (_qsMaybe = qsMaybe('#coverart', pageDom)) === null || _qsMaybe === void 0 ? void 0 : (_qsMaybe$style$backgr = _qsMaybe.style.backgroundImage.match(/url\(["']?(.+?)["']?\)/)) === null || _qsMaybe$style$backgr === void 0 ? void 0 : _qsMaybe$style$backgr[1];

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
          }, !coverGallery);
        });
      });
    }

    static extractCoversFromDOMGallery(coverGallery) {
      const _this2 = this;

      return _call(function () {
        const coverElements = qsa('a[id*="thumb_"]', coverGallery);
        return _await(coverElements.map(_this2.extractCoverFromAnchor.bind(_this2)));
      });
    }

    static extractCoverFromAnchor(anchor) {
      var _qs$textContent;

      return convertCaptions({
        url: anchor.href,
        caption: (_qs$textContent = qs('.label', anchor).textContent) !== null && _qs$textContent !== void 0 ? _qs$textContent : ''
      });
    }

    findImagesWithApi(url) {
      const _this3 = this;

      return _call(function () {
        const id = _this3.extractId(url);

        assertHasValue(id);
        const apiUrl = "https://vgmdb.info/album/".concat(id, "?format=json");
        return _await(gmxhr(apiUrl), function (apiResp) {
          const metadata = safeParseJSON(apiResp.responseText, 'Invalid JSON response from vgmdb.info API');
          assert(metadata.link === 'album/' + id, "VGMdb.info returned wrong release: Requested album/".concat(id, ", got ").concat(metadata.link));
          return VGMdbProvider.extractImagesFromApiMetadata(metadata);
        });
      });
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

    findImages(url) {
      const _this = this;

      return _call(function () {
        return _await(_this.fetchPage(url), function (_this$fetchPage) {
          var _coverElem$getAttribu, _coverElem$getAttribu2;

          const page = parseDOM(_this$fetchPage, url.href);
          const coverElem = qs('.AudioPlaylistSnippet__cover, .audioPlaylist__cover', page);
          const coverUrl = (_coverElem$getAttribu = coverElem.getAttribute('style')) === null || _coverElem$getAttribu === void 0 ? void 0 : (_coverElem$getAttribu2 = _coverElem$getAttribu.match(/background-image:\s*url\('(.+)'\);/)) === null || _coverElem$getAttribu2 === void 0 ? void 0 : _coverElem$getAttribu2[1];
          assertHasValue(coverUrl, 'Could not extract cover URL');
          return [{
            url: new URL(coverUrl, url),
            types: [ArtworkTypeIDs.Front]
          }];
        });
      });
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
  addProvider(new CoverArtArchiveProvider());
  addProvider(new DatPiffProvider());
  addProvider(new DeezerProvider());
  addProvider(new DiscogsProvider());
  addProvider(new JamendoProvider());
  addProvider(new MelonProvider());
  addProvider(new MusicBrainzProvider());
  addProvider(new MusikSammlerProvider());
  addProvider(new QobuzProvider());
  addProvider(new QubMusiqueProvider());
  addProvider(new RateYourMusicProvider());
  addProvider(new RockipediaProvider());
  addProvider(new SevenDigitalProvider());
  addProvider(new SoundcloudProvider());
  addProvider(new SpotifyProvider());
  addProvider(new TidalProvider());
  addProvider(new VGMdbProvider());
  addProvider(new VKMusicProvider());
  addProvider(new YandexMusicProvider());

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

    fetchImages(coverArt, onlyFront) {
      const _this = this;

      return _call(function () {
        const url = coverArt.url;

        if (_this.urlAlreadyAdded(url)) {
          LOGGER.warn("".concat(url, " has already been added"));
          return _await({
            images: []
          });
        }

        const provider = getProvider(url);

        if (provider) {
          return _await(_this.fetchImagesFromProvider(coverArt, provider, onlyFront));
        }

        const defaultTypes = coverArt.types,
              defaultComment = coverArt.comment;
        return _await(_this.fetchImageFromURL(url), function (result) {
          return result ? _await(enqueueImage(result, defaultTypes, defaultComment), function () {
            return {
              images: [result]
            };
          }) : {
            images: []
          };
        });
      });
    }

    fetchMaximisedImage(url, id) {
      const _this2 = this;

      return _call(function () {
        let _exit = false;
        return _await(_continue(_forAwaitOf(getMaximisedCandidates(url), function (maxCandidate) {
          const candidateName = maxCandidate.filename || getFilename(maxCandidate.url);

          if (_this2.urlAlreadyAdded(maxCandidate.url)) {
            LOGGER.warn("".concat(maxCandidate.url, " has already been added"));
            _exit = true;
            return;
          }

          return _catch(function () {
            return _await(_this2.fetchImageContents(maxCandidate.url, candidateName, id, maxCandidate.headers), function (result) {
              if (maxCandidate.url.href !== url.href) {
                LOGGER.info("Maximised ".concat(url.href, " to ").concat(maxCandidate.url.href));
              }

              _exit = true;
              return result;
            });
          }, function (err) {
            if (maxCandidate.likely_broken) return;
            LOGGER.warn("Skipping maximised candidate ".concat(maxCandidate.url), err);
          });
        }, function () {
          return _exit;
        }), function (_result2) {
          return _exit ? _result2 : _this2.fetchImageContents(url, getFilename(url), id, {});
        }));
      });
    }

    fetchImageFromURL(url) {
      const _this3 = this;

      let skipMaximisation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      return _call(function () {
        var _this3$hooks$onFetchS, _this3$hooks;

        const id = _this3.getImageId();

        (_this3$hooks$onFetchS = (_this3$hooks = _this3.hooks).onFetchStarted) === null || _this3$hooks$onFetchS === void 0 ? void 0 : _this3$hooks$onFetchS.call(_this3$hooks, id, url);
        return _await(_finallyRethrows(function () {
          return _await(skipMaximisation ? _this3.fetchImageContents(url, getFilename(url), id, {}) : _this3.fetchMaximisedImage(url, id), function (fetchResult) {
            if (!fetchResult) return;

            _this3.doneImages.add(fetchResult.fetchedUrl.href);

            _this3.doneImages.add(fetchResult.requestedUrl.href);

            _this3.doneImages.add(url.href);

            return {
              content: fetchResult.file,
              originalUrl: url,
              maximisedUrl: fetchResult.requestedUrl,
              fetchedUrl: fetchResult.fetchedUrl,
              wasMaximised: url.href !== fetchResult.requestedUrl.href,
              wasRedirected: fetchResult.wasRedirected
            };
          });
        }, function (_wasThrown, _result3) {
          var _this3$hooks$onFetchF, _this3$hooks2;

          (_this3$hooks$onFetchF = (_this3$hooks2 = _this3.hooks).onFetchFinished) === null || _this3$hooks$onFetchF === void 0 ? void 0 : _this3$hooks$onFetchF.call(_this3$hooks2, id);
          return _rethrow(_wasThrown, _result3);
        }));
      });
    }

    fetchImagesFromProvider(_ref, provider, onlyFront) {
      const _this4 = this;

      let url = _ref.url,
          defaultTypes = _ref.types,
          defaultComment = _ref.comment;
      return _call(function () {
        LOGGER.info("Searching for images in ".concat(provider.name, " release\u2026"));
        return _await(provider.findImages(url, onlyFront), function (images) {
          const finalImages = onlyFront ? _this4.retainOnlyFront(images) : images;
          const hasMoreImages = onlyFront && images.length !== finalImages.length;
          LOGGER.info("Found ".concat(finalImages.length || 'no', " image(s) in ").concat(provider.name, " release"));
          const queuedResults = [];
          return _continue(_forOf(enumerate(finalImages), function (_ref2) {
            let _ref3 = _slicedToArray(_ref2, 2),
                img = _ref3[0],
                idx = _ref3[1];

            if (_this4.urlAlreadyAdded(img.url)) {
              LOGGER.warn("".concat(img.url, " has already been added"));
              return;
            }

            LOGGER.info("Fetching ".concat(img.url, " (").concat(idx + 1, "/").concat(finalImages.length, ")"));
            return _continueIgnored(_catch(function () {
              return _await(_this4.fetchImageFromURL(img.url, img.skipMaximisation), function (result) {
                if (!result) return;

                const fetchedImage = _objectSpread2(_objectSpread2({}, result), {}, {
                  types: img.types,
                  comment: img.comment
                });

                return _await(provider.postprocessImage(fetchedImage), function (postprocessedImage) {
                  return _invokeIgnored(function () {
                    if (postprocessedImage) {
                      return _await(enqueueImage(fetchedImage, defaultTypes, defaultComment), function () {
                        queuedResults.push(postprocessedImage);
                      });
                    }
                  });
                });
              });
            }, function (err) {
              LOGGER.warn("Skipping ".concat(img.url), err);
            }));
          }), function () {
            if (!hasMoreImages && queuedResults.length === finalImages.length) {
              _this4.doneImages.add(url.href);
            } else if (hasMoreImages) {
              LOGGER.warn("Not all images were fetched: ".concat(images.length - finalImages.length, " covers were skipped."));
            }

            return {
              containerUrl: url,
              images: queuedResults
            };
          });
        });
      });
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
      return "".concat(filenameWithoutExt, ".").concat(id, ".").concat(mimeType.split('/')[1]);
    }

    fetchImageContents(url, fileName, id, headers) {
      const _this5 = this;

      return _call(function () {
        var _this5$hooks$onFetchP;

        return _await(gmxhr(url, {
          responseType: 'blob',
          headers: headers,
          progressCb: (_this5$hooks$onFetchP = _this5.hooks.onFetchProgress) === null || _this5$hooks$onFetchP === void 0 ? void 0 : _this5$hooks$onFetchP.bind(_this5.hooks, id, url)
        }), function (resp) {
          if (typeof resp.finalUrl === 'undefined') {
            LOGGER.warn("Could not detect if URL ".concat(url.href, " caused a redirect"));
          }

          const fetchedUrl = new URL(resp.finalUrl || url);
          const wasRedirected = resp.finalUrl !== url.href;

          if (wasRedirected) {
            LOGGER.warn("Followed redirect of ".concat(url.href, " -> ").concat(resp.finalUrl, " while fetching image contents"));
          }

          return _await(_this5.determineMimeType(resp), function (_ref4) {
            let mimeType = _ref4.mimeType,
                isImage = _ref4.isImage;

            if (!isImage) {
              if (!(mimeType !== null && mimeType !== void 0 && mimeType.startsWith('text/'))) {
                throw new Error("Expected \"".concat(fileName, "\" to be an image, but received ").concat(mimeType !== null && mimeType !== void 0 ? mimeType : 'unknown file type', "."));
              }

              const candidateProvider = getProviderByDomain(url);

              if (typeof candidateProvider !== 'undefined') {
                throw new Error("This page is not (yet) supported by the ".concat(candidateProvider.name, " provider, are you sure this page corresponds to a MusicBrainz release?"));
              }

              throw new Error('Expected to receive an image, but received text. Perhaps this provider is not supported yet?');
            }

            return {
              requestedUrl: url,
              fetchedUrl,
              wasRedirected,
              file: new File([resp.response], _this5.createUniqueFilename(fileName, id, mimeType), {
                type: mimeType
              })
            };
          });
        });
      });
    }

    determineMimeType(resp) {
      return _call(function () {
        const rawFile = new File([resp.response], 'image');
        return _await(new Promise(resolve => {
          const reader = new FileReader();
          reader.addEventListener('load', () => {
            var _resp$responseHeaders;

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
                    mimeType: (_resp$responseHeaders = resp.responseHeaders.match(/content-type:\s*([^;\s]+)/i)) === null || _resp$responseHeaders === void 0 ? void 0 : _resp$responseHeaders[1],
                    isImage: false
                  });
              }
            }
          });
          reader.readAsArrayBuffer(rawFile.slice(0, 4));
        }));
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
      throw new Error("Unsupported seeded key: ".concat(key));
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
        throw new Error("Invalid 'types' parameter: ".concat(value));
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

      this._images = [...(images !== null && images !== void 0 ? images : [])];
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
        let _ref2 = _slicedToArray(_ref, 2),
            key = _ref2[0],
            value = _ref2[1];

        return ["x_seed.image.".concat(index, ".").concat(key), encodeValue(value)];
      })));

      if (this.origin) {
        seedParams.append('x_seed.origin', this.origin);
      }

      return seedParams;
    }

    createSeedURL(releaseId) {
      let domain = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'musicbrainz.org';
      return "https://".concat(domain, "/release/").concat(releaseId, "/add-cover-art?").concat(this.encode());
    }

    static decode(seedParams) {
      var _seedParams$get;

      let images = [];
      seedParams.forEach((value, key) => {
        if (!key.startsWith('x_seed.image.')) return;

        try {
          decodeSingleKeyValue(key, value, images);
        } catch (err) {
          LOGGER.error("Invalid image seeding param ".concat(key, "=").concat(value), err);
        }
      });
      images = images.filter((image, index) => {
        if (image.url) {
          return true;
        } else {
          LOGGER.warn("Ignoring seeded image ".concat(index, ": No URL provided"));
          return false;
        }
      });
      const origin = (_seedParams$get = seedParams.get('x_seed.origin')) !== null && _seedParams$get !== void 0 ? _seedParams$get : undefined;
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
              appendChildren($$a, url.href);
              return $$a;
          }.call(this);
          this.progressbar = function () {
              var $$c = document.createElement('div');
              $$c.setAttribute('class', 'ui-progressbar-value ui-widget-header ui-corner-left');
              setStyles($$c, {
                  backgroundColor: '#cce5ff',
                  width: '0%'
              });
              appendChildren($$c, '\xA0');
              return $$c;
          }.call(this);
          this.rootElement = function () {
              var $$e = document.createElement('tr');
              setStyles($$e, { display: 'flex' });
              var $$f = document.createElement('td');
              $$f.setAttribute('class', 'uploader-preview-column');
              $$e.appendChild($$f);
              var $$g = document.createElement('div');
              $$g.setAttribute('class', 'content-loading');
              setStyles($$g, {
                  width: '120px',
                  height: '120px',
                  position: 'relative'
              });
              $$f.appendChild($$g);
              var $$h = document.createElement('td');
              setStyles($$h, { width: '65%' });
              $$e.appendChild($$h);
              var $$i = document.createElement('div');
              $$i.setAttribute('class', 'row');
              $$h.appendChild($$i);
              var $$j = document.createElement('label');
              $$i.appendChild($$j);
              var $$k = document.createTextNode('URL:');
              $$j.appendChild($$k);
              appendChildren($$i, this.urlSpan);
              var $$m = document.createElement('td');
              setStyles($$m, { flexGrow: 1 });
              $$e.appendChild($$m);
              var $$n = document.createElement('div');
              $$n.setAttribute('class', 'ui-progressbar ui-widget ui-widget-content ui-corner-all');
              $$n.setAttribute('role', 'progressbar');
              setStyles($$n, { width: '100%' });
              $$m.appendChild($$n);
              appendChildren($$n, this.progressbar);
              return $$e;
          }.call(this);
      }
      set url(url) {
          this.urlSpan.textContent = url.href;
      }
      set progress(progressPercentage) {
          this.progressbar.style.width = ''.concat(progressPercentage * 100, '%');
      }
  }
  class InputForm {
      constructor(app) {
          var _qs$insertAdjacentEle, _qs$insertAdjacentEle2;
          const _this = this;
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
              $$p.addEventListener('input', _async(function (evt) {
                  if (!evt.currentTarget.value)
                      return;
                  const oldValue = evt.currentTarget.value;
                  evt.currentTarget.value = '';
                  evt.currentTarget.placeholder = oldValue;
                  return _continue(_forOf(oldValue.trim().split(/\s+/), function (inputUrl) {
                      let url;
                      try {
                          url = new URL(inputUrl);
                      } catch (err) {
                          LOGGER.error('Invalid URL: '.concat(inputUrl), err);
                          return;
                      }
                      return _awaitIgnored(app.processURL(url));
                  }), function () {
                      app.clearLogLater();
                      if (_this.urlInput.placeholder === oldValue) {
                          _this.urlInput.placeholder = INPUT_PLACEHOLDER_TEXT;
                      }
                  });
              }));
              return $$p;
          }.call(this);
          const _createPersistentChec = createPersistentCheckbox('ROpdebee_paste_front_only', 'Fetch front image only', evt => {
                  var _checked, _evt$currentTarget;
                  app.onlyFront = (_checked = (_evt$currentTarget = evt.currentTarget) === null || _evt$currentTarget === void 0 ? void 0 : _evt$currentTarget.checked) !== null && _checked !== void 0 ? _checked : false;
              }), _createPersistentChec2 = _slicedToArray(_createPersistentChec, 2), onlyFrontCheckbox = _createPersistentChec2[0], onlyFrontLabel = _createPersistentChec2[1];
          app.onlyFront = onlyFrontCheckbox.checked;
          const container = function () {
              var $$q = document.createElement('div');
              $$q.setAttribute('class', 'ROpdebee_paste_url_cont');
              appendChildren($$q, this.urlInput);
              var $$s = document.createElement('a');
              $$s.setAttribute('href', 'https://github.com/ROpdebee/mb-userscripts/blob/main/src/mb_enhanced_cover_art_uploads/docs/supported_providers.md');
              $$s.setAttribute('target', '_blank');
              $$q.appendChild($$s);
              var $$t = document.createTextNode('\n                Supported providers\n            ');
              $$s.appendChild($$t);
              appendChildren($$q, onlyFrontCheckbox);
              appendChildren($$q, onlyFrontLabel);
              return $$q;
          }.call(this);
          this.buttonContainer = function () {
              var $$w = document.createElement('div');
              $$w.setAttribute('class', 'ROpdebee_import_url_buttons buttons');
              return $$w;
          }.call(this);
          this.orSpan = function () {
              var $$x = document.createElement('span');
              setStyles($$x, { display: 'none' });
              var $$y = document.createTextNode('or');
              $$x.appendChild($$y);
              return $$x;
          }.call(this);
          (_qs$insertAdjacentEle = qs('#drop-zone').insertAdjacentElement('afterend', container)) === null || _qs$insertAdjacentEle === void 0 ? void 0 : (_qs$insertAdjacentEle2 = _qs$insertAdjacentEle.insertAdjacentElement('afterend', this.orSpan)) === null || _qs$insertAdjacentEle2 === void 0 ? void 0 : _qs$insertAdjacentEle2.insertAdjacentElement('afterend', this.buttonContainer);
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
      addImportButton(onClickCallback, url, provider) {
          const _this2 = this;
          return _call(function () {
              return _await(provider.favicon, function (favicon) {
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
                      appendChildren($$dd, 'Import from ' + provider.name);
                      return $$bb;
                  }.call(this);
                  _this2.orSpan.style.display = '';
                  _this2.buttonContainer.insertAdjacentElement('beforeend', button);
              });
          });
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
          progressElement === null || progressElement === void 0 ? void 0 : progressElement.rootElement.remove();
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

    processURL(url) {
      const _this = this;

      return _call(function () {
        return _await(_this._processURLs([{
          url
        }]));
      });
    }

    clearLogLater() {
      this.loggingSink.clearAllLater();
    }

    _processURLs(coverArts, origin) {
      const _this2 = this;

      return _call(function () {
        return _await(_this2.fetchingSema.runInSection(_async(function () {
          const fetchedBatches = [];
          return _continue(_forOf(enumerate(coverArts), function (_ref) {
            let _ref2 = _slicedToArray(_ref, 2),
                coverArt = _ref2[0],
                idx = _ref2[1];

            if (_this2.urlsInProgress.has(coverArt.url.href)) {
              return;
            }

            _this2.urlsInProgress.add(coverArt.url.href);

            if (coverArts.length > 1) {
              LOGGER.info("Fetching ".concat(coverArt.url, " (").concat(idx + 1, "/").concat(coverArts.length, ")"));
            } else {
              LOGGER.info("Fetching ".concat(coverArt.url));
            }

            return _continue(_catch(function () {
              return _await(_this2.fetcher.fetchImages(coverArt, _this2.onlyFront), function (fetchResult) {
                fetchedBatches.push(fetchResult);
              });
            }, function (err) {
              LOGGER.error('Failed to fetch or enqueue images', err);
            }), function () {
              _this2.urlsInProgress.delete(coverArt.url.href);
            });
          }), function () {
            return fetchedBatches;
          });
        })), function (batches) {
          fillEditNote(batches, origin !== null && origin !== void 0 ? origin : '', _this2.note);
          const totalNumImages = batches.reduce((acc, batch) => acc + batch.images.length, 0);

          if (totalNumImages > 0) {
            LOGGER.success("Successfully added ".concat(totalNumImages, " image(s)"));
          }
        });
      });
    }

    processSeedingParameters() {
      const _this3 = this;

      return _call(function () {
        const params = SeedParameters.decode(new URLSearchParams(document.location.search));
        return _await(_this3._processURLs(params.images, params.origin), function () {
          _this3.clearLogLater();
        });
      });
    }

    addImportButtons() {
      const _this4 = this;

      return _call(function () {
        var _window$location$href;

        const mbid = (_window$location$href = window.location.href.match(/musicbrainz\.org\/release\/([a-f\d-]+)\//)) === null || _window$location$href === void 0 ? void 0 : _window$location$href[1];
        assertHasValue(mbid);
        return _await(getURLsForRelease(mbid, {
          excludeEnded: true,
          excludeDuplicates: true
        }), function (attachedURLs) {
          const supportedURLs = attachedURLs.filter(url => {
            var _getProvider;

            return (_getProvider = getProvider(url)) === null || _getProvider === void 0 ? void 0 : _getProvider.allowButtons;
          });
          if (supportedURLs.length === 0) return;

          const syncProcessURL = url => {
            _this4.processURL(url).catch(err => {
              LOGGER.error("Failed to process URL ".concat(url.href), err);
            }).finally(() => {
              _this4.clearLogLater();
            });
          };

          return _awaitIgnored(Promise.all(supportedURLs.map(url => {
            const provider = getProvider(url);
            assertHasValue(provider);
            return _this4.ui.addImportButton(syncProcessURL.bind(_this4, url), url.href, provider);
          })));
        });
      });
    }

  }

  class BaseImage {
    constructor(imgUrl, cache, cacheKey) {
      _defineProperty(this, "imgUrl", void 0);

      _defineProperty(this, "cacheKey", void 0);

      _defineProperty(this, "cache", void 0);

      this.imgUrl = imgUrl;
      this.cacheKey = cacheKey !== null && cacheKey !== void 0 ? cacheKey : imgUrl;
      this.cache = cache;
    }

    getDimensions() {
      const _this = this;

      return _call(function () {
        let _exit = false;
        return _await(_continue(_catch(function () {
          var _this$cache;

          return _await((_this$cache = _this.cache) === null || _this$cache === void 0 ? void 0 : _this$cache.getDimensions(_this.cacheKey), function (cachedResult) {
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

              return _await((_this$cache2 = _this.cache) === null || _this$cache2 === void 0 ? void 0 : _this$cache2.putDimensions(_this.cacheKey, liveResult), function () {
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

          return _await((_this2$cache = _this2.cache) === null || _this2$cache === void 0 ? void 0 : _this2$cache.getFileInfo(_this2.cacheKey), function (cachedResult) {
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

              return _await((_this2$cache2 = _this2.cache) === null || _this2$cache2 === void 0 ? void 0 : _this2$cache2.putFileInfo(_this2.cacheKey, liveResult), function () {
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

  const MAX_CACHED_IMAGES = 30;
  const CACHE_LOCALSTORAGE_KEY = 'ROpdebee_dimensions_cache';
  const localStorageCache = {
    getStore: function getStore() {
      var _localStorage$getItem;

      const store = safeParseJSON((_localStorage$getItem = localStorage.getItem(CACHE_LOCALSTORAGE_KEY)) !== null && _localStorage$getItem !== void 0 ? _localStorage$getItem : '{}');

      if (!store) {
        LOGGER.warn('Cache was malformed, resetting');
        this.putStore({});
        return {};
      }

      return store;
    },
    putStore: function putStore(store) {
      localStorage.setItem(CACHE_LOCALSTORAGE_KEY, JSON.stringify(store));
    },
    getInfo: function getInfo(imageUrl) {
      return this.getStore()[imageUrl];
    },
    putInfo: function putInfo(imageUrl, cacheEntry) {
      const prevStore = this.getStore();

      if (Object.keys(prevStore).length >= MAX_CACHED_IMAGES) {
        const entries = Object.entries(prevStore);
        entries.sort((_ref, _ref2) => {
          let _ref3 = _slicedToArray(_ref, 2),
              info1 = _ref3[1];

          let _ref4 = _slicedToArray(_ref2, 2),
              info2 = _ref4[1];

          return info2.addedDatetime - info1.addedDatetime;
        });

        var _iterator = _createForOfIteratorHelper(entries.slice(MAX_CACHED_IMAGES - 1)),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            const _step$value = _slicedToArray(_step.value, 1),
                  url = _step$value[0];

            delete prevStore[url];
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }

      this.putStore(_objectSpread2(_objectSpread2({}, prevStore), {}, {
        [imageUrl]: _objectSpread2(_objectSpread2({}, cacheEntry), {}, {
          addedDatetime: Date.now()
        })
      }));
    },
    getDimensions: function getDimensions(imageUrl) {
      var _this$getInfo;

      return Promise.resolve((_this$getInfo = this.getInfo(imageUrl)) === null || _this$getInfo === void 0 ? void 0 : _this$getInfo.dimensions);
    },
    getFileInfo: function getFileInfo(imageUrl) {
      var _this$getInfo2;

      return Promise.resolve((_this$getInfo2 = this.getInfo(imageUrl)) === null || _this$getInfo2 === void 0 ? void 0 : _this$getInfo2.fileInfo);
    },
    putDimensions: function putDimensions(imageUrl, dimensions) {
      const prevEntry = this.getInfo(imageUrl);
      this.putInfo(imageUrl, _objectSpread2(_objectSpread2({}, prevEntry), {}, {
        dimensions
      }));
      return Promise.resolve();
    },
    putFileInfo: function putFileInfo(imageUrl, fileInfo) {
      const prevEntry = this.getInfo(imageUrl);
      this.putInfo(imageUrl, _objectSpread2(_objectSpread2({}, prevEntry), {}, {
        fileInfo
      }));
      return Promise.resolve();
    }
  };
  class AtisketImage extends BaseImage {
    constructor(imgUrl) {
      super(imgUrl, localStorageCache);
    }

    loadFileInfo() {
      const _this = this;

      return _call(function () {
        return _await(pRetry(() => gmxhr(_this.imgUrl, {
          method: 'HEAD'
        }), {
          retries: 5,
          onFailedAttempt: err => {
            if (err instanceof HTTPResponseError && err.statusCode < 500 && err.statusCode !== 429) {
              throw err;
            }

            LOGGER.warn("Failed to retrieve image file info: ".concat(err.message, ". Retrying\u2026"));
          }
        }), function (resp) {
          var _resp$responseHeaders, _resp$responseHeaders2;

          const fileSize = (_resp$responseHeaders = resp.responseHeaders.match(/content-length: (\d+)/i)) === null || _resp$responseHeaders === void 0 ? void 0 : _resp$responseHeaders[1];
          const fileType = (_resp$responseHeaders2 = resp.responseHeaders.match(/content-type: \w+\/(\w+)/i)) === null || _resp$responseHeaders2 === void 0 ? void 0 : _resp$responseHeaders2[1];
          return {
            fileType: fileType === null || fileType === void 0 ? void 0 : fileType.toUpperCase(),
            size: fileSize ? parseInt(fileSize) : undefined
          };
        });
      });
    }

  }

  const getImageInfo = _async(function (imageUrl) {
      let _exit = false;
      return _continue(_forAwaitOf(getMaximisedCandidates(new URL(imageUrl)), function (maxCandidate) {
          if (maxCandidate.likely_broken)
              return;
          LOGGER.debug('Trying to get image information for maximised candidate '.concat(maxCandidate.url));
          const atisketImage = new AtisketImage(maxCandidate.url.toString());
          return _await(atisketImage.getFileInfo(), function (fileInfo) {
              return _await(fileInfo && atisketImage.getDimensions(), function (dimensions) {
                  if (!dimensions) {
                      LOGGER.warn('Failed to load dimensions for maximised candidate '.concat(maxCandidate.url));
                      return;
                  }
                  const _dimensions$fileInfo = _objectSpread2({ dimensions }, fileInfo);
                  _exit = true;
                  return _dimensions$fileInfo;
              }, !fileInfo);
          });
      }, function () {
          return _exit;
      }), function (_result) {
          return _exit ? _result : new AtisketImage(imageUrl).getImageInfo();
      });
  });
  const addDimensions = _async(function (fig) {
      const imageUrl = qs('a.icon', fig).href;
      const dimSpan = function () {
          var $$a = document.createElement('span');
          setStyles($$a, { display: 'block' });
          var $$b = document.createTextNode('\n        loading\u2026\n    ');
          $$a.appendChild($$b);
          return $$a;
      }.call(this);
      qs('figcaption > a', fig).insertAdjacentElement('afterend', dimSpan);
      return _await(getImageInfo(imageUrl), function (imageInfo) {
          const infoStringParts = [
              imageInfo.dimensions ? ''.concat(imageInfo.dimensions.width, 'x').concat(imageInfo.dimensions.height) : '',
              typeof imageInfo.size !== 'undefined' ? formatFileSize(imageInfo.size) : '',
              imageInfo.fileType
          ];
          const infoString = infoStringParts.filter(Boolean).join(', ');
          if (infoString) {
              dimSpan.textContent = infoString;
          } else {
              dimSpan.remove();
          }
      });
  });
  const AtisketSeeder = {
      supportedDomains: [
          'atisket.pulsewidth.org.uk',
          'etc.marlonob.info'
      ],
      supportedRegexes: [/(?:\.uk|\.info\/atisket)\/\?.+/],
      insertSeedLinks() {
          var _cachedAnchor$href;
          addDimensionsToCovers();
          const alreadyInMBItems = qsa('.already-in-mb-item');
          if (alreadyInMBItems.length === 0) {
              return;
          }
          const mbids = alreadyInMBItems.map(alreadyInMB => {
              var _qs$textContent$trim, _qs$textContent;
              return encodeURIComponent((_qs$textContent$trim = (_qs$textContent = qs('a.mb', alreadyInMB).textContent) === null || _qs$textContent === void 0 ? void 0 : _qs$textContent.trim()) !== null && _qs$textContent$trim !== void 0 ? _qs$textContent$trim : '');
          }).filter(Boolean);
          const cachedAnchor = qsMaybe('#submit-button + div > a');
          addSeedLinkToCovers(mbids, (_cachedAnchor$href = cachedAnchor === null || cachedAnchor === void 0 ? void 0 : cachedAnchor.href) !== null && _cachedAnchor$href !== void 0 ? _cachedAnchor$href : document.location.href);
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
      var _iterator = _createForOfIteratorHelper(covers), _step;
      try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
              const fig = _step.value;
              addSeedLinkToCover(fig, mbids, origin);
          }
      } catch (err) {
          _iterator.e(err);
      } finally {
          _iterator.f();
      }
  }
  function addDimensionsToCovers() {
      const covers = qsa('figure.cover');
      var _iterator2 = _createForOfIteratorHelper(covers), _step2;
      try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              const fig = _step2.value;
              logFailure(addDimensions(fig), 'Failed to insert image information');
          }
      } catch (err) {
          _iterator2.e(err);
      } finally {
          _iterator2.f();
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
      var _tryExtractReleaseUrl;
      const imageUrl = qs('a.icon', fig).href;
      const realUrl = (_tryExtractReleaseUrl = tryExtractReleaseUrl(fig)) !== null && _tryExtractReleaseUrl !== void 0 ? _tryExtractReleaseUrl : imageUrl;
      const params = new SeedParameters([{ url: new URL(realUrl) }], origin);
      var _iterator3 = _createForOfIteratorHelper(mbids), _step3;
      try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
              const mbid = _step3.value;
              const seedUrl = params.createSeedURL(mbid);
              const seedLink = function () {
                  var $$c = document.createElement('a');
                  $$c.setAttribute('href', seedUrl);
                  setStyles($$c, { display: 'block' });
                  var $$d = document.createTextNode('\n            Add to release ');
                  $$c.appendChild($$d);
                  appendChildren($$c, mbids.length > 1 ? mbid.split('-')[0] : '');
                  return $$c;
              }.call(this);
              qs('figcaption', fig).insertAdjacentElement('beforeend', seedLink);
          }
      } catch (err) {
          _iterator3.e(err);
      } finally {
          _iterator3.f();
      }
  }
  const RELEASE_URL_CONSTRUCTORS = {
      itu: (id, country) => 'https://music.apple.com/'.concat(country.toLowerCase(), '/album/').concat(id),
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
      insertSeedLinks: function insertSeedLinks() {
          try {
              var _window$location$href;
              const mbid = (_window$location$href = window.location.href.match(/musicbrainz\.org\/release\/([a-f\d-]+)\//)) === null || _window$location$href === void 0 ? void 0 : _window$location$href[1];
              assertHasValue(mbid);
              return _await(getURLsForRelease(mbid, {
                  excludeEnded: true,
                  excludeDuplicates: true
              }), function (attachedURLs) {
                  return _await(Promise.all(attachedURLs.map(_async(function (url) {
                      const provider = getProvider(url);
                      if (!(provider !== null && provider !== void 0 && provider.allowButtons))
                          return;
                      return _await(provider.favicon, function (favicon) {
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
                              appendChildren($$c, 'Import from ' + provider.name);
                              return $$a;
                          }.call(this);
                      });
                  }))), function (buttons) {
                      const buttonRow = qs('#content > .buttons');
                      filterNonNull(buttons).forEach(buttonRow.appendChild.bind(buttonRow));
                  });
              });
          } catch (e) {
              return Promise.reject(e);
          }
      }
  };

  const extractCovers = _async(function () {
      return _await(VGMdbProvider.extractCoversFromDOMGallery(qs('#cover_gallery')), function (covers) {
          return _await(new VGMdbProvider().findImagesWithApi(new URL(document.location.href)), function (publicCovers) {
              const publicCoverURLs = new Set(publicCovers.map(cover => cover.url.href));
              const result = {
                  allCovers: covers,
                  privateCovers: covers.filter(cover => !publicCoverURLs.has(cover.url.href))
              };
              return result;
          });
      });
  });
  const VGMdbSeeder = {
      supportedDomains: ['vgmdb.net'],
      supportedRegexes: [/\/album\/(\d+)(?:\/|#|\?|$)/],
      insertSeedLinks: function insertSeedLinks() {
          try {
              var _qsMaybe;
              if (!isLoggedIn()) {
                  return _await();
              }
              const coverHeading = (_qsMaybe = qsMaybe('#covernav')) === null || _qsMaybe === void 0 ? void 0 : _qsMaybe.parentElement;
              if (!coverHeading) {
                  LOGGER.info('No covers in release, not inserting seeding menu');
                  return _await();
              }
              const releaseIdsProm = getMBReleases();
              const coversProm = extractCovers();
              return _await(_continueIgnored(_catch(function () {
                  return _await(Promise.all([
                      releaseIdsProm,
                      coversProm
                  ]), function (_ref) {
                      let _ref2 = _slicedToArray(_ref, 2), releaseIds = _ref2[0], covers = _ref2[1];
                      insertSeedButtons(coverHeading, releaseIds, covers);
                  });
              }, function (err) {
                  LOGGER.error('Failed to insert seed links', err);
              })));
          } catch (e) {
              return Promise.reject(e);
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
              setStyles($$a, { display: 'block' });
              appendChildren($$a, 'Seed covers to ' + relId.split('-')[0]);
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
          setStyles($$d, { cursor: 'help' });
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
              setStyles($$f, { display: 'block' });
              var $$g = document.createTextNode('\n            This album is not linked to any MusicBrainz releases!\n        ');
              $$f.appendChild($$g);
              return $$f;
          }.call(this));
      }
      const container = function () {
          var $$h = document.createElement('div');
          setStyles($$h, {
              padding: '8px 8px 0px 8px',
              fontSize: '8pt'
          });
          appendChildren($$h, containedElements);
          return $$h;
      }.call(this);
      (_coverHeading$nextEle = coverHeading.nextElementSibling) === null || _coverHeading$nextEle === void 0 ? void 0 : _coverHeading$nextEle.insertAdjacentElement('afterbegin', container);
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
