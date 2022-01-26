// ==UserScript==
// @name         MB: Enhanced Cover Art Uploads
// @description  Enhance the cover art uploader! Upload directly from a URL, automatically import covers from Discogs/Spotify/Apple Music/..., automatically retrieve the largest version, and more!
// @version      2022.1.26.2
// @author       ROpdebee
// @license      MIT; https://opensource.org/licenses/MIT
// @namespace    https://github.com/ROpdebee/mb-userscripts
// @homepageURL  https://github.com/ROpdebee/mb-userscripts
// @supportURL   https://github.com/ROpdebee/mb-userscripts/issues
// @downloadURL  https://raw.github.com/ROpdebee/mb-userscripts/dist/mb_enhanced_cover_art_uploads.user.js
// @updateURL    https://raw.github.com/ROpdebee/mb-userscripts/dist/mb_enhanced_cover_art_uploads.meta.js
// @match        *://*.musicbrainz.org/release/*/add-cover-art
// @match        *://*.musicbrainz.org/release/*/add-cover-art?*
// @match        *://atisket.pulsewidth.org.uk/*
// @match        *://etc.marlonob.info/atisket/*
// @match        *://vgmdb.net/album/*
// @exclude      *://atisket.pulsewidth.org.uk/
// @require      https://github.com/qsniyg/maxurl/blob/563626fe3b7c5ed3f6dc19d90a356746c68b5b4b/userscript.user.js?raw=true
// @resource     amazonFavicon https://www.amazon.com/favicon.ico
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        GM_getValue
// @grant        GM.getValue
// @grant        GM_setValue
// @grant        GM.setValue
// @grant        GM_getResourceURL
// @grant        GM.getResourceUrl
// @grant        GM.getResourceURL
// @connect      *
// ==/UserScript==

// For original source code, see https://github.com/ROpdebee/mb-userscripts/tree/main/src/mb_enhanced_cover_art_uploads
(function () {
  'use strict';

  /* minified: babel helpers, babel-plugin-transform-async-to-promises, nativejsx, regenerator-runtime, @babel/runtime, ts-custom-error, p-throttle */
  function ownKeys(t,r){var e=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(t,r).enumerable}))),e.push.apply(e,n);}return e}function _objectSpread2(t){for(var r=1;r<arguments.length;r++){var e=null!=arguments[r]?arguments[r]:{};r%2?ownKeys(Object(e),!0).forEach((function(r){_defineProperty(t,r,e[r]);})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(e)):ownKeys(Object(e)).forEach((function(r){Object.defineProperty(t,r,Object.getOwnPropertyDescriptor(e,r));}));}return t}function _defineProperty(t,r,e){return r in t?Object.defineProperty(t,r,{value:e,enumerable:!0,configurable:!0,writable:!0}):t[r]=e,t}function _slicedToArray(t,r){return _arrayWithHoles(t)||_iterableToArrayLimit(t,r)||_unsupportedIterableToArray(t,r)||_nonIterableRest()}function _toArray(t){return _arrayWithHoles(t)||_iterableToArray(t)||_unsupportedIterableToArray(t)||_nonIterableRest()}function _arrayWithHoles(t){if(Array.isArray(t))return t}function _iterableToArray(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}function _iterableToArrayLimit(t,r){var e=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=e){var n,o,i=[],a=!0,u=!1;try{for(e=e.call(t);!(a=(n=e.next()).done)&&(i.push(n.value),!r||i.length!==r);a=!0);}catch(c){u=!0,o=c;}finally{try{a||null==e.return||e.return();}finally{if(u)throw o}}return i}}function _unsupportedIterableToArray(t,r){if(t){if("string"==typeof t)return _arrayLikeToArray(t,r);var e=Object.prototype.toString.call(t).slice(8,-1);return "Object"===e&&t.constructor&&(e=t.constructor.name),"Map"===e||"Set"===e?Array.from(t):"Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)?_arrayLikeToArray(t,r):void 0}}function _arrayLikeToArray(t,r){(null==r||r>t.length)&&(r=t.length);for(var e=0,n=new Array(r);e<r;e++)n[e]=t[e];return n}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _createForOfIteratorHelper(t,r){var e="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!e){if(Array.isArray(t)||(e=_unsupportedIterableToArray(t))||r&&t&&"number"==typeof t.length){e&&(t=e);var n=0,o=function(){};return {s:o,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,a=!0,u=!1;return {s:function(){e=e.call(t);},n:function(){var t=e.next();return a=t.done,t},e:function(t){u=!0,i=t;},f:function(){try{a||null==e.return||e.return();}finally{if(u)throw i}}}}const _Pact=function(){function t(){}return t.prototype.then=function(r,e){const n=new t,o=this.s;if(o){const t=1&o?r:e;if(t){try{_settle(n,1,t(this.v));}catch(i){_settle(n,2,i);}return n}return this}return this.o=function(t){try{const o=t.v;1&t.s?_settle(n,1,r?r(o):o):e?_settle(n,1,e(o)):_settle(n,2,o);}catch(i){_settle(n,2,i);}},n},t}();function _settle(t,r,e){if(!t.s){if(e instanceof _Pact){if(!e.s)return void(e.o=_settle.bind(null,t,r));1&r&&(r=e.s),e=e.v;}if(e&&e.then)return void e.then(_settle.bind(null,t,r),_settle.bind(null,t,2));t.s=r,t.v=e;const n=t.o;n&&n(t);}}function _isSettledPact(t){return t instanceof _Pact&&1&t.s}function _async(t){return function(){for(var r=[],e=0;e<arguments.length;e++)r[e]=arguments[e];try{return Promise.resolve(t.apply(this,r))}catch(n){return Promise.reject(n)}}}function _await(t,r,e){return e?r?r(t):t:(t&&t.then||(t=Promise.resolve(t)),r?t.then(r):t)}function _awaitIgnored(t,r){if(!r)return t&&t.then?t.then(_empty):Promise.resolve()}function _continue(t,r){return t&&t.then?t.then(r):r(t)}function _continueIgnored(t){if(t&&t.then)return t.then(_empty)}function _forTo(t,r,e){var n,o,i=-1;return function a(u){try{for(;++i<t.length&&(!e||!e());)if((u=r(i))&&u.then){if(!_isSettledPact(u))return void u.then(a,o||(o=_settle.bind(null,n=new _Pact,2)));u=u.v;}n?_settle(n,1,u):n=u;}catch(c){_settle(n||(n=new _Pact),2,c);}}(),n}const _iteratorSymbol="undefined"!=typeof Symbol?Symbol.iterator||(Symbol.iterator=Symbol("Symbol.iterator")):"@@iterator";function _forOf(t,r,e){if("function"==typeof t[_iteratorSymbol]){var n,o,i,a=t[_iteratorSymbol]();if(function t(u){try{for(;!((n=a.next()).done||e&&e());)if((u=r(n.value))&&u.then){if(!_isSettledPact(u))return void u.then(t,i||(i=_settle.bind(null,o=new _Pact,2)));u=u.v;}o?_settle(o,1,u):o=u;}catch(c){_settle(o||(o=new _Pact),2,c);}}(),a.return){var u=function(t){try{n.done||a.return();}catch(r){}return t};if(o&&o.then)return o.then(u,(function(t){throw u(t)}));u();}return o}if(!("length"in t))throw new TypeError("Object is not iterable");for(var c=[],l=0;l<t.length;l++)c.push(t[l]);return _forTo(c,(function(t){return r(c[t])}),e)}const _asyncIteratorSymbol="undefined"!=typeof Symbol?Symbol.asyncIterator||(Symbol.asyncIterator=Symbol("Symbol.asyncIterator")):"@@asyncIterator";function _forAwaitOf(t,r,e){if("function"==typeof t[_asyncIteratorSymbol]){var n=new _Pact,o=t[_asyncIteratorSymbol]();return o.next().then(a).then(void 0,u),n;function i(t){if(e&&e())return _settle(n,1,o.return?o.return().then((function(){return t})):t);o.next().then(a).then(void 0,u);}function a(t){t.done?_settle(n,1):Promise.resolve(r(t.value)).then(i).then(void 0,u);}function u(t){_settle(n,2,o.return?o.return().then((function(){return t})):t);}}return Promise.resolve(_forOf(t,(function(t){return Promise.resolve(t).then(r)}),e))}function _call(t,r,e){if(e)return r?r(t()):t();try{var n=Promise.resolve(t());return r?n.then(r):n}catch(o){return Promise.reject(o)}}function _invoke(t,r){var e=t();return e&&e.then?e.then(r):r(e)}function _catch(t,r){try{var e=t();}catch(n){return r(n)}return e&&e.then?e.then(void 0,r):e}function _finallyRethrows(t,r){try{var e=t();}catch(n){return r(!0,n)}return e&&e.then?e.then(r.bind(null,!1),r.bind(null,!0)):r(!1,e)}function _rethrow(t,r){if(t)throw r;return r}function _empty(){}const _earlyReturn={};function _catchInGenerator(t,r){return _catch(t,(function(t){if(t===_earlyReturn)throw t;return r(t)}))}const _AsyncGenerator=function(){function t(t){this._entry=t,this._pact=null,this._resolve=null,this._return=null,this._promise=null;}function r(t){return {value:t,done:!0}}function e(t){return {value:t,done:!1}}return t.prototype._yield=function(t){return this._resolve(t&&t.then?t.then(e):e(t)),this._pact=new _Pact},t.prototype.next=function(t){const e=this;return e._promise=new Promise((function(n){const o=e._pact;if(null===o){const t=e._entry;if(null===t)return n(e._promise);function i(t){e._resolve(t&&t.then?t.then(r):r(t)),e._pact=null,e._resolve=null;}e._entry=null,e._resolve=n;var a=t(e);a&&a.then?a.then(i,(function(t){if(t===_earlyReturn)i(e._return);else {const r=new _Pact;e._resolve(r),e._pact=null,e._resolve=null,_resolve(r,2,t);}})):i(a);}else e._pact=null,e._resolve=n,_settle(o,1,t);}))},t.prototype.return=function(t){const e=this;return e._promise=new Promise((function(n){const o=e._pact;if(null===o)return null===e._entry?n(e._promise):(e._entry=null,n(t&&t.then?t.then(r):r(t)));e._return=t,e._resolve=n,e._pact=null,_settle(o,2,_earlyReturn);}))},t.prototype.throw=function(t){const r=this;return r._promise=new Promise((function(e,n){const o=r._pact;if(null===o)return null===r._entry?e(r._promise):(r._entry=null,n(t));r._resolve=e,r._pact=null,_settle(o,2,t);}))},t.prototype[_asyncIteratorSymbol]=function(){return this},t}();var appendChildren=function(t,r){(r=Array.isArray(r)?r:[r]).forEach((function(r){r instanceof HTMLElement?t.appendChild(r):(r||"string"==typeof r)&&t.appendChild(document.createTextNode(r.toString()));}));},setStyles=function(t,r){for(const e in r)t.style[e]=r[e];},runtime={exports:{}};!function(t){var r=function(t){var r,e=Object.prototype,n=e.hasOwnProperty,o="function"==typeof Symbol?Symbol:{},i=o.iterator||"@@iterator",a=o.asyncIterator||"@@asyncIterator",u=o.toStringTag||"@@toStringTag";function c(t,r,e){return Object.defineProperty(t,r,{value:e,enumerable:!0,configurable:!0,writable:!0}),t[r]}try{c({},"");}catch(I){c=function(t,r,e){return t[r]=e};}function l(t,r,e,n){var o=r&&r.prototype instanceof v?r:v,i=Object.create(o.prototype),a=new A(n||[]);return i._invoke=function(t,r,e){var n=f;return function(o,i){if(n===y)throw new Error("Generator is already running");if(n===p){if("throw"===o)throw i;return L()}for(e.method=o,e.arg=i;;){var a=e.delegate;if(a){var u=x(a,e);if(u){if(u===_)continue;return u}}if("next"===e.method)e.sent=e._sent=e.arg;else if("throw"===e.method){if(n===f)throw n=p,e.arg;e.dispatchException(e.arg);}else "return"===e.method&&e.abrupt("return",e.arg);n=y;var c=s(t,r,e);if("normal"===c.type){if(n=e.done?p:h,c.arg===_)continue;return {value:c.arg,done:e.done}}"throw"===c.type&&(n=p,e.method="throw",e.arg=c.arg);}}}(t,e,a),i}function s(t,r,e){try{return {type:"normal",arg:t.call(r,e)}}catch(I){return {type:"throw",arg:I}}}t.wrap=l;var f="suspendedStart",h="suspendedYield",y="executing",p="completed",_={};function v(){}function d(){}function m(){}var b={};c(b,i,(function(){return this}));var w=Object.getPrototypeOf,g=w&&w(w(T([])));g&&g!==e&&n.call(g,i)&&(b=g);var P=m.prototype=v.prototype=Object.create(b);function O(t){["next","throw","return"].forEach((function(r){c(t,r,(function(t){return this._invoke(r,t)}));}));}function S(t,r){function e(o,i,a,u){var c=s(t[o],t,i);if("throw"!==c.type){var l=c.arg,f=l.value;return f&&"object"==typeof f&&n.call(f,"__await")?r.resolve(f.__await).then((function(t){e("next",t,a,u);}),(function(t){e("throw",t,a,u);})):r.resolve(f).then((function(t){l.value=t,a(l);}),(function(t){return e("throw",t,a,u)}))}u(c.arg);}var o;this._invoke=function(t,n){function i(){return new r((function(r,o){e(t,n,r,o);}))}return o=o?o.then(i,i):i()};}function x(t,e){var n=t.iterator[e.method];if(n===r){if(e.delegate=null,"throw"===e.method){if(t.iterator.return&&(e.method="return",e.arg=r,x(t,e),"throw"===e.method))return _;e.method="throw",e.arg=new TypeError("The iterator does not provide a 'throw' method");}return _}var o=s(n,t.iterator,e.arg);if("throw"===o.type)return e.method="throw",e.arg=o.arg,e.delegate=null,_;var i=o.arg;return i?i.done?(e[t.resultName]=i.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=r),e.delegate=null,_):i:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,_)}function E(t){var r={tryLoc:t[0]};1 in t&&(r.catchLoc=t[1]),2 in t&&(r.finallyLoc=t[2],r.afterLoc=t[3]),this.tryEntries.push(r);}function j(t){var r=t.completion||{};r.type="normal",delete r.arg,t.completion=r;}function A(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(E,this),this.reset(!0);}function T(t){if(t){var e=t[i];if(e)return e.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var o=-1,a=function e(){for(;++o<t.length;)if(n.call(t,o))return e.value=t[o],e.done=!1,e;return e.value=r,e.done=!0,e};return a.next=a}}return {next:L}}function L(){return {value:r,done:!0}}return d.prototype=m,c(P,"constructor",m),c(m,"constructor",d),d.displayName=c(m,u,"GeneratorFunction"),t.isGeneratorFunction=function(t){var r="function"==typeof t&&t.constructor;return !!r&&(r===d||"GeneratorFunction"===(r.displayName||r.name))},t.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,m):(t.__proto__=m,c(t,u,"GeneratorFunction")),t.prototype=Object.create(P),t},t.awrap=function(t){return {__await:t}},O(S.prototype),c(S.prototype,a,(function(){return this})),t.AsyncIterator=S,t.async=function(r,e,n,o,i){void 0===i&&(i=Promise);var a=new S(l(r,e,n,o),i);return t.isGeneratorFunction(e)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},O(P),c(P,u,"Generator"),c(P,i,(function(){return this})),c(P,"toString",(function(){return "[object Generator]"})),t.keys=function(t){var r=[];for(var e in t)r.push(e);return r.reverse(),function e(){for(;r.length;){var n=r.pop();if(n in t)return e.value=n,e.done=!1,e}return e.done=!0,e}},t.values=T,A.prototype={constructor:A,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=r,this.done=!1,this.delegate=null,this.method="next",this.arg=r,this.tryEntries.forEach(j),!t)for(var e in this)"t"===e.charAt(0)&&n.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=r);},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function o(n,o){return u.type="throw",u.arg=t,e.next=n,o&&(e.method="next",e.arg=r),!!o}for(var i=this.tryEntries.length-1;i>=0;--i){var a=this.tryEntries[i],u=a.completion;if("root"===a.tryLoc)return o("end");if(a.tryLoc<=this.prev){var c=n.call(a,"catchLoc"),l=n.call(a,"finallyLoc");if(c&&l){if(this.prev<a.catchLoc)return o(a.catchLoc,!0);if(this.prev<a.finallyLoc)return o(a.finallyLoc)}else if(c){if(this.prev<a.catchLoc)return o(a.catchLoc,!0)}else {if(!l)throw new Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return o(a.finallyLoc)}}}},abrupt:function(t,r){for(var e=this.tryEntries.length-1;e>=0;--e){var o=this.tryEntries[e];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=r&&r<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=t,a.arg=r,i?(this.method="next",this.next=i.finallyLoc,_):this.complete(a)},complete:function(t,r){if("throw"===t.type)throw t.arg;return "break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&r&&(this.next=r),_},finish:function(t){for(var r=this.tryEntries.length-1;r>=0;--r){var e=this.tryEntries[r];if(e.finallyLoc===t)return this.complete(e.completion,e.afterLoc),j(e),_}},catch:function(t){for(var r=this.tryEntries.length-1;r>=0;--r){var e=this.tryEntries[r];if(e.tryLoc===t){var n=e.completion;if("throw"===n.type){var o=n.arg;j(e);}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,n){return this.delegate={iterator:T(t),resultName:e,nextLoc:n},"next"===this.method&&(this.arg=r),_}},t}(t.exports);try{regeneratorRuntime=r;}catch(e){"object"==typeof globalThis?globalThis.regeneratorRuntime=r:Function("r","regeneratorRuntime = r")(r);}}(runtime);var regenerator=runtime.exports;function fixProto(t,r){var e=Object.setPrototypeOf;e?e(t,r):t.__proto__=r;}function fixStack(t,r){void 0===r&&(r=t.constructor);var e=Error.captureStackTrace;e&&e(t,r);}var __extends=function(){var t=function(r,e){return t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,r){t.__proto__=r;}||function(t,r){for(var e in r)r.hasOwnProperty(e)&&(t[e]=r[e]);},t(r,e)};return function(r,e){function n(){this.constructor=r;}t(r,e),r.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n);}}(),CustomError=function(t){function r(r){var e=this.constructor,n=t.call(this,r)||this;return Object.defineProperty(n,"name",{value:e.name,enumerable:!1,configurable:!0}),fixProto(n,e.prototype),fixStack(n),n}return __extends(r,t),r}(Error);class AbortError extends Error{constructor(){super("Throttled function aborted"),this.name="AbortError";}}function pThrottle(t){let r=t.limit,e=t.interval,n=t.strict;if(!Number.isFinite(r))throw new TypeError("Expected `limit` to be a finite number");if(!Number.isFinite(e))throw new TypeError("Expected `interval` to be a finite number");const o=new Map;let i=0,a=0;const u=[],c=n?function(){const t=Date.now();if(u.length<r)return u.push(t),0;const n=u.shift()+e;return t>=n?(u.push(t),0):(u.push(n),n-t)}:function(){const t=Date.now();return t-i>e?(a=1,i=t,0):(a<r?a++:(i+=e,a=1),i-t)};return t=>{const r=function r(){const e=this;for(var n=arguments.length,i=new Array(n),a=0;a<n;a++)i[a]=arguments[a];if(!r.isEnabled)return _async((function(){return t.apply(e,i)}))();let u;return new Promise(((r,e)=>{u=setTimeout((()=>{r(t.apply(this,i)),o.delete(u);}),c()),o.set(u,e);}))};return r.abort=()=>{var t,r=_createForOfIteratorHelper(o.keys());try{for(r.s();!(t=r.n()).done;){const r=t.value;clearTimeout(r),o.get(r)(new AbortError);}}catch(e){r.e(e);}finally{r.f();}o.clear(),u.splice(0,u.length);},r.isEnabled=!0,r}}

  /* minified: lib */
  class ConsoleSink{constructor(e){_defineProperty(this,"scriptName",void 0),_defineProperty(this,"onSuccess",this.onInfo.bind(this)),this.scriptName=e;}formatMessage(e){return "[".concat(this.scriptName,"] ").concat(e)}onDebug(e){console.debug(this.formatMessage(e));}onLog(e){console.log(this.formatMessage(e));}onInfo(e){console.info(this.formatMessage(e));}onWarn(e,t){e=this.formatMessage(e),t?console.warn(e,t):console.warn(e);}onError(e,t){e=this.formatMessage(e),t?console.error(e,t):console.error(e);}}let LogLevel;!function(e){e[e.DEBUG=0]="DEBUG",e[e.LOG=1]="LOG",e[e.INFO=2]="INFO",e[e.SUCCESS=3]="SUCCESS",e[e.WARNING=4]="WARNING",e[e.ERROR=5]="ERROR";}(LogLevel||(LogLevel={}));const HANDLER_NAMES={[LogLevel.DEBUG]:"onDebug",[LogLevel.LOG]:"onLog",[LogLevel.INFO]:"onInfo",[LogLevel.SUCCESS]:"onSuccess",[LogLevel.WARNING]:"onWarn",[LogLevel.ERROR]:"onError"},DEFAULT_OPTIONS={logLevel:LogLevel.INFO,sinks:[]};class Logger{constructor(e){_defineProperty(this,"_configuration",void 0),this._configuration=_objectSpread2(_objectSpread2({},DEFAULT_OPTIONS),e);}fireHandlers(e,t,r){e<this._configuration.logLevel||this._configuration.sinks.forEach((s=>{const n=s[HANDLER_NAMES[e]];n&&(r?n.call(s,t,r):n.call(s,t));}));}debug(e){this.fireHandlers(LogLevel.DEBUG,e);}log(e){this.fireHandlers(LogLevel.LOG,e);}info(e){this.fireHandlers(LogLevel.INFO,e);}success(e){this.fireHandlers(LogLevel.SUCCESS,e);}warn(e,t){this.fireHandlers(LogLevel.WARNING,e,t);}error(e,t){this.fireHandlers(LogLevel.ERROR,e,t);}configure(e){Object.assign(this._configuration,e);}get configuration(){return this._configuration}addSink(e){this._configuration.sinks.push(e);}}const LOGGER=new Logger;var css_248z$1="#ROpdebee_log_container{margin:1.5rem auto;width:75%}#ROpdebee_log_container .msg{border:1px solid;border-radius:4px;display:block;font-weight:500;margin-bottom:.5rem;padding:.5rem .75rem;width:100%}#ROpdebee_log_container .msg.error{background-color:#f8d7da;border-color:#f5c6cb;color:#721c24;font-weight:600}#ROpdebee_log_container .msg.warning{background-color:#fff3cd;border-color:#ffeeba;color:#856404}#ROpdebee_log_container .msg.success{background-color:#d4edda;border-color:#c3e6cb;color:#155724}#ROpdebee_log_container .msg.info{background-color:#e2e3e5;border-color:#d6d8db;color:#383d41}";class GuiSink{constructor(){_defineProperty(this,"rootElement",void 0),_defineProperty(this,"persistentMessages",[]),_defineProperty(this,"transientMessages",[]),_defineProperty(this,"onInfo",this.onLog.bind(this)),document.head.append(function(){var e=document.createElement("style");return e.setAttribute("id","ROpdebee_GUI_Logger"),appendChildren(e,css_248z$1),e}.call(this)),this.rootElement=function(){var e=document.createElement("div");return e.setAttribute("id","ROpdebee_log_container"),setStyles(e,{display:"none"}),e}.call(this);}createMessage(e,t,r){let s;return s=r&&r instanceof Error?t+": "+r.message:t,function(){var t=document.createElement("span");return t.setAttribute("class","msg ".concat(e)),appendChildren(t,s),t}.call(this)}addMessage(e){this.removeTransientMessages(),this.rootElement.appendChild(e),this.rootElement.style.display="block";}removeTransientMessages(){this.transientMessages.forEach((e=>{e.remove();})),this.transientMessages=[];}addPersistentMessage(e){this.addMessage(e),this.persistentMessages.push(e);}addTransientMessage(e){this.addMessage(e),this.transientMessages.push(e);}onLog(e){this.addTransientMessage(this.createMessage("info",e));}onSuccess(e){this.addTransientMessage(this.createMessage("success",e));}onWarn(e,t){this.addPersistentMessage(this.createMessage("warning",e,t));}onError(e,t){this.addPersistentMessage(this.createMessage("error",e,t));}clearAllLater(){this.transientMessages=this.transientMessages.concat(this.persistentMessages),this.persistentMessages=[];}}function existsInGM(e){return "undefined"!=typeof GM&&void 0!==GM[e]}function GMxmlHttpRequest(e){existsInGM("xmlHttpRequest")?GM.xmlHttpRequest(e):GM_xmlhttpRequest(e);}function GMgetResourceUrl(e){return existsInGM("getResourceUrl")?GM.getResourceUrl(e):existsInGM("getResourceURL")?GM.getResourceURL(e):Promise.resolve(GM_getResourceURL(e))}const GMinfo=existsInGM("info")?GM.info:GM_info;function cloneIntoPageContext(e){return "undefined"!=typeof cloneInto&&"undefined"!=typeof unsafeWindow?cloneInto(e,unsafeWindow):e}function getFromPageContext(e){return "undefined"!=typeof unsafeWindow?unsafeWindow[e]:window[e]}class AssertionError extends Error{}function assert(e,t){if(!e)throw new AssertionError(null!=t?t:"Assertion failed")}function assertDefined(e,t){assert(void 0!==e,null!=t?t:"Assertion failed: Expected value to be defined");}function assertNonNull(e,t){assert(null!==e,null!=t?t:"Assertion failed: Expected value to be non-null");}function assertHasValue(e,t){assert(null!=e,null!=t?t:"Assertion failed: Expected value to be defined and non-null");}function qs(e,t){const r=qsMaybe(e,t);return assertNonNull(r,"Could not find required element"),r}function qsMaybe(e,t){return (null!=t?t:document).querySelector(e)}function qsa(e,t){return [...(null!=t?t:document).querySelectorAll(e)]}function parseDOM(e,t){const r=(new DOMParser).parseFromString(e,"text/html");if(!qsMaybe("base",r.head)){const e=r.createElement("base");e.href=t,r.head.insertAdjacentElement("beforeend",e);}return r}const separator="\n–\n";class EditNote{constructor(e){_defineProperty(this,"footer",void 0),_defineProperty(this,"extraInfoLines",void 0),_defineProperty(this,"editNoteTextArea",void 0),this.footer=e,this.editNoteTextArea=qs("textarea.edit-note");const t=this.editNoteTextArea.value.split(separator)[0];this.extraInfoLines=t?new Set(t.split("\n").map((e=>e.trimEnd()))):new Set;}addExtraInfo(e){if(this.extraInfoLines.has(e))return;let t=this.editNoteTextArea.value.split(separator),r=_toArray(t),s=r[0],n=r.slice(1);s=(s+"\n"+e).trim(),this.editNoteTextArea.value=[s,...n].join(separator),this.extraInfoLines.add(e);}addFooter(){this.removePreviousFooter();const e=this.editNoteTextArea.value;this.editNoteTextArea.value=[e,separator,this.footer].join("");}removePreviousFooter(){const e=this.editNoteTextArea.value.split(separator).filter((e=>e.trim()!==this.footer));this.editNoteTextArea.value=e.join(separator);}static withFooterFromGMInfo(){const e=GMinfo.script,t="".concat(e.name," ").concat(e.version,"\n").concat(e.namespace);return new EditNote(t)}}const getReleaseIDsForURL=_async((function(e){return _await(fetch("https://musicbrainz.org/ws/2/url?resource=".concat(encodeURIComponent(e),"&inc=release-rels&fmt=json")),(function(e){return _await(e.json(),(function(e){var t,r;return null!==(t=null===(r=e.relations)||void 0===r?void 0:r.map((e=>e.release.id)))&&void 0!==t?t:[]}))}))})),getURLsForRelease=_async((function(e,t){const r=null!=t?t:{},s=r.excludeEnded,n=r.excludeDuplicates;return _await(getReleaseUrlARs(e),(function(e){s&&(e=e.filter((e=>!e.ended)));let t=e.map((e=>e.url.resource));return n&&(t=Array.from(new Set([...t]))),t.flatMap((e=>{try{return [new URL(e)]}catch(t){return console.warn("Found malformed URL linked to release: ".concat(e)),[]}}))}))})),getReleaseUrlARs=_async((function(e){return _await(fetch("https://musicbrainz.org/ws/2/release/".concat(e,"?inc=url-rels&fmt=json")),(function(e){return _await(e.json(),(function(e){var t;return null!==(t=e.relations)&&void 0!==t?t:[]}))}))}));let ArtworkTypeIDs;!function(e){e[e.Back=2]="Back",e[e.Booklet=3]="Booklet",e[e.Front=1]="Front",e[e.Liner=12]="Liner",e[e.Medium=4]="Medium",e[e.Obi=5]="Obi",e[e.Other=8]="Other",e[e.Poster=11]="Poster",e[e.Raw=14]="Raw",e[e.Spine=6]="Spine",e[e.Sticker=10]="Sticker",e[e.Track=7]="Track",e[e.Tray=9]="Tray",e[e.Watermark=13]="Watermark";}(ArtworkTypeIDs||(ArtworkTypeIDs={}));var _marked=regenerator.mark(enumerate);function filterNonNull(e){return e.filter((e=>!(null==e)))}function groupBy(e,t,r){const s=new Map;var n,o=_createForOfIteratorHelper(e);try{for(o.s();!(n=o.n()).done;){var a;const e=n.value,o=t(e),i=r(e);s.has(o)?null===(a=s.get(o))||void 0===a||a.push(i):s.set(o,[i]);}}catch(i){o.e(i);}finally{o.f();}return s}function collatedSort(e){const t=new Intl.Collator("en",{numeric:!0});return e.sort(t.compare.bind(t))}function enumerate(e){var t,r,s,n;return regenerator.wrap((function(o){for(;;)switch(o.prev=o.next){case 0:t=0,r=_createForOfIteratorHelper(e),o.prev=2,r.s();case 4:if((s=r.n()).done){o.next=10;break}return n=s.value,o.next=8,[t++,n];case 8:o.next=4;break;case 10:o.next=15;break;case 12:o.prev=12,o.t0=o.catch(2),r.e(o.t0);case 15:return o.prev=15,r.f(),o.finish(15);case 18:case"end":return o.stop()}}),_marked,null,[[2,12,15,18]])}function urlBasename(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"";return "string"!=typeof e&&(e=e.pathname),e.split("/").pop()||t}function urlJoin(e,t){return new URL(t,e)}const gmxhr=_async((function(e,t){return new Promise(((r,s)=>{GMxmlHttpRequest(_objectSpread2(_objectSpread2({method:"GET",url:e instanceof URL?e.href:e},null!=t?t:{}),{},{onload:t=>{t.status>=400?s(new HTTPResponseError(e,t)):r(t);},onerror:()=>{s(new NetworkError(e));},onabort:()=>{s(new AbortedError(e));},ontimeout:()=>{s(new TimeoutError(e));}}));}))}));class ResponseError extends CustomError{constructor(e,t){super(t),_defineProperty(this,"url",void 0),this.url=e;}}class HTTPResponseError extends ResponseError{constructor(e,t){t.statusText.trim()?(super(e,"HTTP error ".concat(t.status,": ").concat(t.statusText)),_defineProperty(this,"statusCode",void 0),_defineProperty(this,"statusText",void 0),_defineProperty(this,"response",void 0)):(super(e,"HTTP error ".concat(t.status)),_defineProperty(this,"statusCode",void 0),_defineProperty(this,"statusText",void 0),_defineProperty(this,"response",void 0)),this.response=t,this.statusCode=t.status,this.statusText=t.statusText;}}class TimeoutError extends ResponseError{constructor(e){super(e,"Request timed out");}}class AbortedError extends ResponseError{constructor(e){super(e,"Request aborted");}}class NetworkError extends ResponseError{constructor(e){super(e,"Network error");}}function asyncSleep(e){return new Promise((t=>setTimeout(t,e)))}function retryTimes(e,t,r){const s=_async((function(t){return _catch(e,(function(e){if(t<=1)throw e;return asyncSleep(r).then((()=>s(t-1)))}))}));return t<=0?Promise.reject(new TypeError("Invalid number of retry times: ".concat(t))):s(t)}function splitDomain(e){const t=e.split(".");let r=-2;return ["org","co","com"].includes(t[t.length-2])&&(r=-3),t.slice(0,r).concat([t.slice(r).join(".")])}class DispatchMap{constructor(){_defineProperty(this,"map",new Map);}set(e,t){const r=splitDomain(e);if("*"===e||r[0].includes("*")&&"*"!==r[0]||r.slice(1).some((e=>e.includes("*"))))throw new Error("Invalid pattern: "+e);return this.insert(r.slice().reverse(),t),this}get(e){return this.retrieve(splitDomain(e).slice().reverse())}_get(e){return this.map.get(e)}_set(e,t){return this.map.set(e,t),this}insertLeaf(e,t){const r=this._get(e);r?(assert(r instanceof DispatchMap&&!r.map.has(""),"Duplicate leaf!"),r._set("",t)):this._set(e,t);}insertInternal(e,t){const r=e[0],s=this._get(r);let n;s instanceof DispatchMap?n=s:(n=new DispatchMap,this._set(r,n),void 0!==s&&n._set("",s)),n.insert(e.slice(1),t);}insert(e,t){e.length>1?this.insertInternal(e,t):(assert(1===e.length,"Empty domain parts?!"),this.insertLeaf(e[0],t));}retrieveLeaf(e){let t=this._get(e);if(t instanceof DispatchMap){let e=t._get("");void 0===e&&(e=t._get("*")),t=e;}return t}retrieveInternal(e){const t=this._get(e[0]);if(t instanceof DispatchMap)return t.retrieve(e.slice(1))}retrieve(e){let t;return t=1===e.length?this.retrieveLeaf(e[0]):this.retrieveInternal(e),void 0===t&&(t=this._get("*")),t}}function safeParseJSON(e,t){try{return JSON.parse(e)}catch(r){if(t)throw new Error("".concat(t,": ").concat(r));return}}function hexEncode(e){return [...new(getFromPageContext("Uint8Array"))(e)].map((e=>e.toString(16).padStart(2,"0"))).join("")}function blobToDigest(e){const t=_async((function(e){var t;const r=e.result;return "undefined"!=typeof crypto&&void 0!==(null===(t=crypto.subtle)||void 0===t?void 0:t.digest)?_await(crypto.subtle.digest("SHA-256",r),hexEncode):hexEncode(r)}));return new Promise(((r,s)=>{const n=new FileReader;n.addEventListener("error",s),n.addEventListener("load",(()=>{t(n).then(r,s);})),n.readAsArrayBuffer(e);}))}function createPersistentCheckbox(e,t,r){return [function(){var t=document.createElement("input");return t.setAttribute("type","checkbox"),t.setAttribute("id",e),t.addEventListener("change",(t=>{t.currentTarget.checked?localStorage.setItem(e,"delete_to_disable"):localStorage.removeItem(e),r(t);})),t.setAttribute("defaultChecked",!!localStorage.getItem(e)),t}.call(this),function(){var r=document.createElement("label");return r.setAttribute("for",e),appendChildren(r,t),r}.call(this)]}

  class CoverArtProvider {
    constructor() {
      _defineProperty(this, "supportedDomains", void 0);

      _defineProperty(this, "name", void 0);

      _defineProperty(this, "urlRegex", void 0);

      _defineProperty(this, "allowButtons", true);
    }

    postprocessImages(images) {
      return _await(images);
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

    fetchPage(url) {
      const _this = this;

      return _call(function () {
        return _await(gmxhr(url), function (resp) {
          if (resp.finalUrl !== url.href && !_this.isSafeRedirect(url, new URL(resp.finalUrl))) {
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
          if (byContent && groupedImages.size && !(groupedImages.size === 1 && !mainUrl)) {
            LOGGER.info('Deduplicating track images by content, this may take a while…');
            return _await(mainUrl ? _this4.urlToDigest(mainUrl) : '', function (mainDigest) {
              return _await(Promise.all([...groupedImages.entries()].map(_async(function (_ref) {
                let _ref2 = _slicedToArray(_ref, 2),
                    coverUrl = _ref2[0],
                    trackImages = _ref2[1];

                return _await(_this4.urlToDigest(coverUrl), function (digest) {
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
      if (!definedTrackNumbers.length) return '';
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

    static maximiseImage(url) {
      const _this2 = this;

      return _call(function () {
        var _url$pathname$match, _imageName$match;

        const imageName = (_url$pathname$match = url.pathname.match(/discogs-images\/(R-.+)$/)) === null || _url$pathname$match === void 0 ? void 0 : _url$pathname$match[1];
        const releaseId = imageName === null || imageName === void 0 ? void 0 : (_imageName$match = imageName.match(/^R-(\d+)/)) === null || _imageName$match === void 0 ? void 0 : _imageName$match[1];
        return releaseId ? _await(_this2.getReleaseImages(releaseId), function (releaseData) {
          const matchedImage = releaseData.data.release.images.edges.find(img => urlBasename(img.node.fullsize.sourceUrl) === imageName);
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
          if (maximisedResult.fake || maximisedResult.bad || maximisedResult.likely_broken) return;
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
      let iterable;
      return _invoke(function () {
        if (exceptionFn) {
          return _await(exceptionFn(smallurl), function (_exceptionFn) {
            iterable = _exceptionFn;
          });
        } else {
          iterable = maximiseGeneric(smallurl);
        }
      }, function () {
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
  IMU_EXCEPTIONS.set('img.discogs.com', _async(function (smallurl) {
    return _await(DiscogsProvider.maximiseImage(smallurl), function (fullSizeURL) {
      return [{
        url: fullSizeURL,
        filename: urlBasename(fullSizeURL),
        headers: {}
      }];
    });
  }));
  IMU_EXCEPTIONS.set('*.mzstatic.com', _async(function (smallurl) {
    const results = [];
    return _continue(_forAwaitOf(maximiseGeneric(smallurl), function (imgGeneric) {
      const sourceUrl = new URL(imgGeneric.url);
      sourceUrl.hostname = 'a1.mzstatic.com';

      if (sourceUrl.pathname.startsWith('/image/thumb')) {
        sourceUrl.pathname = sourceUrl.pathname.replace(/^\/image\/thumb/, '/us/r1000/063');
      }

      if (sourceUrl.pathname.split('/').length === 12) {
        sourceUrl.pathname = sourceUrl.pathname.split('/').slice(0, -1).join('/');
      }

      if (sourceUrl.pathname !== imgGeneric.url.pathname) {
        results.push(_objectSpread2(_objectSpread2({}, imgGeneric), {}, {
          url: sourceUrl
        }));
      }

      results.push(imgGeneric);
    }), function () {
      return results;
    });
  }));
  IMU_EXCEPTIONS.set('artwork-cdn.7static.com', _async(function (smallurl) {
    return ['800', '500', '350'].map(size => {
      return {
        url: new URL(smallurl.href.replace(/_\d+\.jpg$/, "_".concat(size, ".jpg"))),
        filename: '',
        headers: {}
      };
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

    postprocessImages(images) {
      return _call(function () {
        return _await(images.filter(image => {
          if (/\/0000000016_\d+/.test(image.fetchedUrl.pathname)) {
            LOGGER.warn("Skipping \"".concat(image.content.name, "\" as it matches a placeholder cover"));
            return false;
          }

          return true;
        }));
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
  const AUDIBLE_PAGE_QUERY = '.audible_mm_title';
  const DIGITAL_PAGE_QUERY = '.DigitalMusicDetailPage';
  const PHYSICAL_AUDIOBOOK_PAGE_QUERY = '#booksImageBlock_feature_div';
  const AUDIBLE_FRONT_IMAGE_QUERY = '#mf_pdp_hero_widget_book_img img';
  const DIGITAL_FRONT_IMAGE_QUERY = '#digitalMusicProductImage_feature_div > img';
  class AmazonProvider extends CoverArtProvider {
    constructor() {
      super(...arguments);

      _defineProperty(this, "supportedDomains", ['amazon.ae', 'amazon.ca', 'amazon.cn', 'amazon.de', 'amazon.eg', 'amazon.es', 'amazon.fr', 'amazon.in', 'amazon.it', 'amazon.jp', 'amazon.nl', 'amazon.pl', 'amazon.sa', 'amazon.se', 'amazon.sg', 'amazon.co.jp', 'amazon.co.uk', 'amazon.com', 'amazon.com.au', 'amazon.com.br', 'amazon.com.mx', 'amazon.com.tr']);

      _defineProperty(this, "name", 'Amazon');

      _defineProperty(this, "urlRegex", /\/(?:gp\/product|dp|hz\/audible\/mlp\/mfpdp)\/([A-Za-z0-9]{10})(?:\/|$)/);
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
            const audibleUrl = new URL(url.pathname.replace(/\/(?:gp\/product|dp)\//, '/hz/audible/mlp/mfpdp/'), url);
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

      _defineProperty(this, "urlRegex", /\/albums\/([A-Za-z0-9]{10})(?:\/|$)/);
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
        return _await(_this.getItemMetadata(itemId), function (itemMetadata) {
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
        return _await(_this2.getItemMetadata(itemId), function (itemMetadata) {
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
      const originalImagePaths = itemMetadata.files.filter(file => file.source === 'original' && ArchiveProvider.IMAGE_FILE_FORMATS.includes(file.format)).map(file => file.name);
      return originalImagePaths.map(path => {
        return {
          url: urlJoin(baseDownloadUrl, path)
        };
      });
    }

    getItemMetadata(itemId) {
      const _this3 = this;

      return _call(function () {
        return _await(_this3.fetchPage(new URL("https://archive.org/metadata/".concat(itemId))), function (itemMetadataResp) {
          const itemMetadata = safeParseJSON(itemMetadataResp, 'Could not parse IA metadata');

          if (!itemMetadata.server) {
            throw new Error('Empty IA metadata, item might not exist');
          }

          if (itemMetadata.is_dark) {
            throw new Error('Cannot extract images: This item is darkened');
          }

          return itemMetadata;
        });
      });
    }

    createBaseDownloadUrl(itemMetadata) {
      return urlJoin("https://".concat(itemMetadata.server), "".concat(itemMetadata.dir, "/"));
    }

  }

  _defineProperty(ArchiveProvider, "CAA_ITEM_REGEX", /^mbid-[a-f0-9-]+$/);

  _defineProperty(ArchiveProvider, "IMAGE_FILE_FORMATS", ['JPEG', 'PNG', 'Text PDF', 'Animated GIF']);

  function getImageDimensions(url) {
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

      function dimensionsFailed() {
        clearInterval(interval);

        if (!done) {
          done = true;
          reject();
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
            return _this.amendSquareThumbnails(covers.concat(trackImages));
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
        if (!trackRows.length) return _await([]);
        LOGGER.info('Checking for Bandcamp track images, this may take a few seconds…');
        const throttledFetchPage = pThrottle({
          interval: 1000,
          limit: 5
        })(_this2.fetchPage.bind(_this2));
        return _await(Promise.all(trackRows.map(trackRow => _this2.findTrackImage(trackRow, throttledFetchPage))), function (trackImages) {
          return _await(_this2.mergeTrackImages(trackImages, mainUrl, true), function (mergedTrackImages) {
            if (mergedTrackImages.length) {
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
          return _await(getImageDimensions(cover.url.href.replace(/_\d+\.(\w+)$/, '_0.$1')), function (coverDims) {
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
          const frontCoverUrl = coverCont.getAttribute('data-front');
          const backCoverUrl = coverCont.getAttribute('data-back');
          const hasBackCover = qsMaybe('#screenshot', coverCont) !== null;
          assertNonNull(frontCoverUrl, 'No front image found in DatPiff release');
          const covers = [{
            url: new URL(frontCoverUrl),
            types: [ArtworkTypeIDs.Front]
          }];

          if (hasBackCover) {
            assertNonNull(backCoverUrl, 'No back cover found in DatPiff release, even though there should be one');
            covers.push({
              url: new URL(backCoverUrl),
              types: [ArtworkTypeIDs.Back]
            });
          }

          return covers;
        });
      });
    }

    postprocessImages(images) {
      return _call(function () {
        return _await(Promise.all(images.map(_async(function (image) {
          return _await(blobToDigest(image.content), function (digest) {
            if (DatPiffProvider.placeholderDigests.includes(digest)) {
              LOGGER.warn("Skipping \"".concat(image.content.name, "\" as it matches a placeholder cover"));
              return null;
            } else {
              return image;
            }
          });
        }))), filterNonNull);
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

      _defineProperty(this, "urlRegex", /release\/([a-f0-9-]+)/);
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

      _defineProperty(this, "urlRegex", /release\/([a-f0-9-]+)\/?$/);
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
            const coverSrc = coverLi.getAttribute('data-src');
            assertNonNull(coverSrc, 'Musik-Sammler image without source?');
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

      _defineProperty(this, "urlRegex", [/open\.qobuz\.com\/(?:.+?\/)?album\/([A-Za-z0-9]+)(?:\/|$)/, /album\/[^/]+\/([A-Za-z0-9]+)(?:\/|$)/]);
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
          const coverUrl = metadata.image.large.replace(/_\d+\.([a-zA-Z0-9]+)$/, '_org.$1');
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

      _defineProperty(this, "urlRegex", [/musique\/album\/[\w-]*-([A-Za-z0-9]+)(?:\/|$)/]);
    }

  }

  class RateYourMusicProvider extends CoverArtProvider {
    constructor() {
      super(...arguments);

      _defineProperty(this, "supportedDomains", ['rateyourmusic.com']);

      _defineProperty(this, "favicon", 'https://e.snmc.io/2.5/img/sonemic.png');

      _defineProperty(this, "name", 'RateYourMusic');

      _defineProperty(this, "urlRegex", /\/release\/((?:album|single)\/[^/]+\/[^/]+)(?:\/|$)/);
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

      return !!pathParts.length && !SoundcloudProvider.badArtistIDs.has(artistId) && !SoundcloudProvider.badSubpaths.has(urlBasename(url));
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
          return covers.concat(mergedTrackCovers);
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

  function mapJacketType(caption) {
    if (!caption) {
      return {
        type: [ArtworkTypeIDs.Front, ArtworkTypeIDs.Back, ArtworkTypeIDs.Spine],
        comment: ''
      };
    }

    const types = [];
    const keywords = caption.split(/(?:,|\s|and|&)/i);
    const faceKeywords = ['front', 'back', 'spine'];

    const _faceKeywords$map = faceKeywords.map(faceKw => !!keywords.find(kw => kw.toLowerCase() === faceKw.toLowerCase())),
          _faceKeywords$map2 = _slicedToArray(_faceKeywords$map, 3),
          hasFront = _faceKeywords$map2[0],
          hasBack = _faceKeywords$map2[1],
          hasSpine = _faceKeywords$map2[2];

    if (hasFront) types.push(ArtworkTypeIDs.Front);
    if (hasBack) types.push(ArtworkTypeIDs.Back);
    if (hasSpine || hasFront && hasBack) types.push(ArtworkTypeIDs.Spine);
    const otherKeywords = keywords.filter(kw => !faceKeywords.includes(kw.toLowerCase()));
    const comment = otherKeywords.join(' ').trim();
    return {
      type: types,
      comment
    };
  }
  const __CAPTION_TYPE_MAPPING = {
    front: ArtworkTypeIDs.Front,
    booklet: ArtworkTypeIDs.Booklet,
    jacket: mapJacketType,
    disc: ArtworkTypeIDs.Medium,
    cassette: ArtworkTypeIDs.Medium,
    vinyl: ArtworkTypeIDs.Medium,
    tray: ArtworkTypeIDs.Tray,
    back: ArtworkTypeIDs.Back,
    obi: ArtworkTypeIDs.Obi,
    box: {
      type: ArtworkTypeIDs.Other,
      comment: 'Box'
    },
    card: {
      type: ArtworkTypeIDs.Other,
      comment: 'Card'
    },
    sticker: ArtworkTypeIDs.Sticker,
    slipcase: {
      type: ArtworkTypeIDs.Other,
      comment: 'Slipcase'
    },
    digipack: {
      type: ArtworkTypeIDs.Other,
      comment: 'Digipack'
    },
    insert: {
      type: ArtworkTypeIDs.Other,
      comment: 'Insert'
    },
    case: {
      type: ArtworkTypeIDs.Other,
      comment: 'Case'
    },
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

  for (var _i = 0, _Object$entries = Object.entries(__CAPTION_TYPE_MAPPING); _i < _Object$entries.length; _i++) {
    const _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
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

  function convertCaptions(cover) {
    const url = new URL(cover.url);

    if (!cover.caption) {
      return {
        url
      };
    }

    const _cover$caption$split = cover.caption.split(' '),
          _cover$caption$split2 = _toArray(_cover$caption$split),
          captionType = _cover$caption$split2[0],
          captionRestParts = _cover$caption$split2.slice(1);

    const captionRest = captionRestParts.join(' ');
    const mapper = CAPTION_TYPE_MAPPING[captionType.toLowerCase()];
    if (!mapper) return {
      url,
      comment: cover.caption
    };
    return _objectSpread2({
      url
    }, mapper(captionRest));
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

            if (mainCoverUrl && !galleryCovers.some(cover => urlBasename(cover.url) === urlBasename(mainCoverUrl))) {
              galleryCovers.unshift({
                url: new URL(mainCoverUrl),
                types: [ArtworkTypeIDs.Front],
                comment: ''
              });
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

      if (metadata.picture_full && !covers.find(cover => cover.url === metadata.picture_full)) {
        covers.unshift({
          url: metadata.picture_full,
          caption: 'Front'
        });
      }

      return covers.map(convertCaptions);
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
  addProvider(new SevenDigitalProvider());
  addProvider(new SoundcloudProvider());
  addProvider(new SpotifyProvider());
  addProvider(new TidalProvider());
  addProvider(new VGMdbProvider());

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
    constructor() {
      _defineProperty(this, "doneImages", void 0);

      _defineProperty(this, "lastId", 0);

      this.doneImages = new Set();
    }

    fetchImages(url, onlyFront) {
      const _this = this;

      return _call(function () {
        if (_this.urlAlreadyAdded(url)) {
          LOGGER.warn("".concat(getFilename(url), " has already been added"));
          return _await({
            images: []
          });
        }

        const provider = getProvider(url);

        if (provider) {
          return _await(_this.fetchImagesFromProvider(url, provider, onlyFront));
        }

        LOGGER.info("Attempting to fetch ".concat(getFilename(url)));
        return _await(_this.fetchImageFromURL(url), function (result) {
          return result ? {
            images: [result]
          } : {
            images: []
          };
        });
      });
    }

    fetchImageFromURL(url) {
      const _this2 = this;

      let skipMaximisation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      return _call(function () {
        let _exit = false;
        let fetchResult = null;
        return _await(_invoke(function () {
          if (!skipMaximisation) {
            let _interrupt = false;
            return _forAwaitOf(getMaximisedCandidates(url), function (maxCandidate) {
              const candidateName = maxCandidate.filename || getFilename(maxCandidate.url);

              if (_this2.urlAlreadyAdded(maxCandidate.url)) {
                LOGGER.warn("".concat(candidateName, " has already been added"));
                _exit = true;
                return;
              }

              return _continueIgnored(_catch(function () {
                return _await(_this2.fetchImageContents(maxCandidate.url, candidateName, maxCandidate.headers), function (_this2$fetchImageCont) {
                  fetchResult = _this2$fetchImageCont;
                  LOGGER.debug("Maximised ".concat(url.href, " to ").concat(maxCandidate.url.href));
                  _interrupt = true;
                });
              }, function (err) {
                LOGGER.warn("Skipping maximised candidate ".concat(candidateName), err);
              }));
            }, function () {
              return _interrupt || _exit;
            });
          }
        }, function (_result2) {
          return _exit ? _result2 : _invoke(function () {
            if (!fetchResult) {
              return _await(_this2.fetchImageContents(url, getFilename(url), {}), function (_this2$fetchImageCont2) {
                fetchResult = _this2$fetchImageCont2;
              });
            }
          }, function () {
            _this2.doneImages.add(fetchResult.fetchedUrl.href);

            _this2.doneImages.add(fetchResult.requestedUrl.href);

            _this2.doneImages.add(url.href);

            return {
              content: fetchResult.file,
              originalUrl: url,
              maximisedUrl: fetchResult.requestedUrl,
              fetchedUrl: fetchResult.fetchedUrl,
              wasMaximised: url.href !== fetchResult.requestedUrl.href,
              wasRedirected: fetchResult.wasRedirected
            };
          });
        }));
      });
    }

    fetchImagesFromProvider(url, provider, onlyFront) {
      const _this3 = this;

      return _call(function () {
        LOGGER.info("Searching for images in ".concat(provider.name, " release\u2026"));
        return _await(provider.findImages(url, onlyFront), function (images) {
          const finalImages = onlyFront ? _this3.retainOnlyFront(images) : images;
          const hasMoreImages = onlyFront && images.length !== finalImages.length;
          LOGGER.info("Found ".concat(finalImages.length || 'no', " image(s) in ").concat(provider.name, " release"));
          const fetchResults = [];
          return _continue(_forOf(enumerate(finalImages), function (_ref) {
            let _ref2 = _slicedToArray(_ref, 2),
                idx = _ref2[0],
                img = _ref2[1];

            if (_this3.urlAlreadyAdded(img.url)) {
              LOGGER.warn("".concat(getFilename(img.url), " has already been added"));
              return;
            }

            LOGGER.info("Fetching ".concat(getFilename(img.url), " (").concat(idx + 1, "/").concat(finalImages.length, ")"));
            return _continueIgnored(_catch(function () {
              return _await(_this3.fetchImageFromURL(img.url, img.skipMaximisation), function (result) {
                if (!result) return;
                fetchResults.push(_objectSpread2(_objectSpread2({}, result), {}, {
                  types: img.types,
                  comment: img.comment
                }));
              });
            }, function (err) {
              LOGGER.warn("Skipping ".concat(getFilename(img.url)), err);
            }));
          }), function () {
            return _await(provider.postprocessImages(fetchResults), function (fetchedImages) {
              if (!hasMoreImages) {
                _this3.doneImages.add(url.href);
              } else {
                LOGGER.warn("Not all images were fetched: ".concat(images.length - finalImages.length, " covers were skipped."));
              }

              return {
                containerUrl: url,
                images: fetchedImages
              };
            });
          });
        });
      });
    }

    retainOnlyFront(images) {
      const filtered = images.filter(img => {
        var _img$types;

        return (_img$types = img.types) === null || _img$types === void 0 ? void 0 : _img$types.includes(ArtworkTypeIDs.Front);
      });
      return filtered.length ? filtered : images.slice(0, 1);
    }

    createUniqueFilename(filename, mimeType) {
      const filenameWithoutExt = filename.replace(/\.(?:png|jpe?g|gif|pdf)$/i, '');
      return "".concat(filenameWithoutExt, ".").concat(this.lastId++, ".").concat(mimeType.split('/')[1]);
    }

    fetchImageContents(url, fileName, headers) {
      const _this4 = this;

      return _call(function () {
        return _await(gmxhr(url, {
          responseType: 'blob',
          headers: headers
        }), function (resp) {
          const fetchedUrl = new URL(resp.finalUrl);
          const wasRedirected = resp.finalUrl !== url.href;

          if (wasRedirected) {
            LOGGER.warn("Followed redirect of ".concat(url.href, " -> ").concat(resp.finalUrl, " while fetching image contents"));
          }

          return _await(_this4.determineMimeType(resp), function (_ref3) {
            let mimeType = _ref3.mimeType,
                isImage = _ref3.isImage;

            if (!isImage) {
              if (!(mimeType !== null && mimeType !== void 0 && mimeType.startsWith('text/'))) {
                throw new Error("Expected \"".concat(fileName, "\" to be an image, but received ").concat(mimeType !== null && mimeType !== void 0 ? mimeType : 'unknown file type', "."));
              }

              const candidateProvider = getProviderByDomain(url);

              if (typeof candidateProvider !== 'undefined') {
                throw new Error("This page is not (yet) supported by the ".concat(candidateProvider.name, " provider, are you sure this is an album?"));
              }

              throw new Error('Expected to receive an image, but received text. Perhaps this provider is not supported yet?');
            }

            return {
              requestedUrl: url,
              fetchedUrl,
              wasRedirected,
              file: new File([resp.response], _this4.createUniqueFilename(fileName, mimeType), {
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
            const Uint32Array = getFromPageContext('Uint32Array');
            const uint32view = new Uint32Array(reader.result);

            if ((uint32view[0] & 0x00FFFFFF) === 0x00FFD8FF) {
              resolve({
                mimeType: 'image/jpeg',
                isImage: true
              });
            } else if (uint32view[0] === 0x38464947) {
              resolve({
                mimeType: 'image/gif',
                isImage: true
              });
            } else if (uint32view[0] === 0x474E5089) {
              resolve({
                mimeType: 'image/png',
                isImage: true
              });
            } else if (uint32view[0] === 0x46445025) {
              resolve({
                mimeType: 'application/pdf',
                isImage: true
              });
            } else {
              var _resp$responseHeaders;

              const actualMimeType = (_resp$responseHeaders = resp.responseHeaders.match(/content-type:\s*([^;\s]+)/i)) === null || _resp$responseHeaders === void 0 ? void 0 : _resp$responseHeaders[1];
              resolve({
                mimeType: actualMimeType,
                isImage: false
              });
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

  const enqueueImage = _async(function (image, defaultTypes, defaultComment) {
    var _image$types, _image$comment;

    dropImage(image.content);
    return _awaitIgnored(retryTimes(setImageParameters.bind(null, image.content.name, (_image$types = image.types) !== null && _image$types !== void 0 ? _image$types : defaultTypes, ((_image$comment = image.comment) !== null && _image$comment !== void 0 ? _image$comment : defaultComment).trim()), 5, 500));
  });

  const enqueueImages = _async(function (_ref) {
    let images = _ref.images;
    let defaultTypes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    let defaultComment = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    return _awaitIgnored(Promise.all(images.map(image => {
      return enqueueImage(image, defaultTypes, defaultComment);
    })));
  });

  function dropImage(imageData) {
    const $ = getFromPageContext('$');
    const dropEvent = $.Event('drop');
    dropEvent.originalEvent = cloneIntoPageContext({
      dataTransfer: {
        files: [imageData]
      }
    });
    $('#drop-zone').trigger(dropEvent);
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

  function fillEditNote(allFetchedImages, origin, editNote) {
    const totalNumImages = allFetchedImages.reduce((acc, fetched) => acc + fetched.images.length, 0);
    if (!totalNumImages) return;
    let numFilled = 0;

    var _iterator = _createForOfIteratorHelper(allFetchedImages),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        const _step$value = _step.value,
              containerUrl = _step$value.containerUrl,
              images = _step$value.images;
        let prefix = '';

        if (containerUrl) {
          prefix = ' * ';
          editNote.addExtraInfo(decodeURI(containerUrl.href));
        }

        var _iterator2 = _createForOfIteratorHelper(images),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            const queuedUrl = _step2.value;
            numFilled += 1;
            if (numFilled > 3) break;

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
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }

        if (numFilled > 3) break;
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    if (totalNumImages > 3) {
      editNote.addExtraInfo("\u2026and ".concat(totalNumImages - 3, " additional image(s)"));
    }

    if (origin) {
      editNote.addExtraInfo("Seeded from ".concat(origin));
    }

    editNote.addFooter();
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
      _defineProperty(this, "images", void 0);

      _defineProperty(this, "origin", void 0);

      this.images = images !== null && images !== void 0 ? images : [];
      this.origin = origin;
    }

    addImage(image) {
      this.images.push(image);
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
      return "https://musicbrainz.org/release/".concat(releaseId, "/add-cover-art?").concat(this.encode());
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

  var USERSCRIPT_NAME = "mb_enhanced_cover_art_uploads";

  var css_248z = ".ROpdebee_paste_url_cont{display:inline-block;margin-left:32px;vertical-align:middle}.ROpdebee_paste_url_cont>*{display:block}.ROpdebee_paste_url_cont>label{display:inline;float:none!important}.ROpdebee_paste_url_cont>input#ROpdebee_paste_front_only{display:inline}.ROpdebee_paste_url_cont>a{font-size:smaller;text-align:right}.ROpdebee_paste_url_cont+span{margin-left:32px}.ROpdebee_import_url_buttons{margin-left:32px;vertical-align:middle}.ROpdebee_import_url_buttons>button{display:block;float:none;margin:4px}";

  class InputForm {
      constructor(app) {
          var _qs$insertAdjacentEle, _qs$insertAdjacentEle2;
          const _this = this;
          _defineProperty(this, 'urlInput', void 0);
          _defineProperty(this, 'buttonContainer', void 0);
          _defineProperty(this, 'orSpan', void 0);
          document.head.append(function () {
              var $$a = document.createElement('style');
              $$a.setAttribute('id', 'ROpdebee_' + USERSCRIPT_NAME);
              appendChildren($$a, css_248z);
              return $$a;
          }.call(this));
          this.urlInput = function () {
              var $$c = document.createElement('input');
              $$c.setAttribute('type', 'url');
              $$c.setAttribute('placeholder', 'or paste one or more URLs here');
              $$c.setAttribute('size', 47);
              $$c.setAttribute('id', 'ROpdebee_paste_url');
              $$c.addEventListener('input', _async(function (evt) {
                  if (!evt.currentTarget.value)
                      return;
                  const oldValue = evt.currentTarget.value;
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
                      if (_this.urlInput.value === oldValue) {
                          _this.urlInput.value = '';
                      }
                  });
              }));
              return $$c;
          }.call(this);
          const _createPersistentChec = createPersistentCheckbox('ROpdebee_paste_front_only', 'Fetch front image only', evt => {
                  var _checked, _evt$currentTarget;
                  app.onlyFront = (_checked = (_evt$currentTarget = evt.currentTarget) === null || _evt$currentTarget === void 0 ? void 0 : _evt$currentTarget.checked) !== null && _checked !== void 0 ? _checked : false;
              }), _createPersistentChec2 = _slicedToArray(_createPersistentChec, 2), onlyFrontCheckbox = _createPersistentChec2[0], onlyFrontLabel = _createPersistentChec2[1];
          app.onlyFront = onlyFrontCheckbox.checked;
          const container = function () {
              var $$d = document.createElement('div');
              $$d.setAttribute('class', 'ROpdebee_paste_url_cont');
              appendChildren($$d, this.urlInput);
              var $$f = document.createElement('a');
              $$f.setAttribute('href', 'https://github.com/ROpdebee/mb-userscripts/blob/main/src/mb_enhanced_cover_art_uploads/docs/supported_providers.md');
              $$f.setAttribute('target', '_blank');
              $$d.appendChild($$f);
              var $$g = document.createTextNode('\n                Supported providers\n            ');
              $$f.appendChild($$g);
              appendChildren($$d, onlyFrontCheckbox);
              appendChildren($$d, onlyFrontLabel);
              return $$d;
          }.call(this);
          this.buttonContainer = function () {
              var $$j = document.createElement('div');
              $$j.setAttribute('class', 'ROpdebee_import_url_buttons buttons');
              return $$j;
          }.call(this);
          this.orSpan = function () {
              var $$k = document.createElement('span');
              setStyles($$k, { display: 'none' });
              var $$l = document.createTextNode('or');
              $$k.appendChild($$l);
              return $$k;
          }.call(this);
          (_qs$insertAdjacentEle = qs('#drop-zone').insertAdjacentElement('afterend', container)) === null || _qs$insertAdjacentEle === void 0 ? void 0 : (_qs$insertAdjacentEle2 = _qs$insertAdjacentEle.insertAdjacentElement('afterend', this.orSpan)) === null || _qs$insertAdjacentEle2 === void 0 ? void 0 : _qs$insertAdjacentEle2.insertAdjacentElement('afterend', this.buttonContainer);
      }
      addImportButton(onClickCallback, url, provider) {
          const _this2 = this;
          return _call(function () {
              return _await(provider.favicon, function (favicon) {
                  const button = function () {
                      var $$m = document.createElement('button');
                      $$m.setAttribute('type', 'button');
                      $$m.setAttribute('title', url);
                      $$m.addEventListener('click', evt => {
                          evt.preventDefault();
                          onClickCallback();
                      });
                      var $$n = document.createElement('img');
                      $$n.setAttribute('src', favicon);
                      $$n.setAttribute('alt', provider.name);
                      $$m.appendChild($$n);
                      var $$o = document.createElement('span');
                      $$m.appendChild($$o);
                      appendChildren($$o, 'Import from ' + provider.name);
                      return $$m;
                  }.call(this);
                  _this2.orSpan.style.display = '';
                  _this2.buttonContainer.insertAdjacentElement('beforeend', button);
              });
          });
      }
  }

  class App {
    constructor() {
      _defineProperty(this, "note", void 0);

      _defineProperty(this, "fetcher", void 0);

      _defineProperty(this, "ui", void 0);

      _defineProperty(this, "urlsInProgress", void 0);

      _defineProperty(this, "loggingSink", new GuiSink());

      _defineProperty(this, "onlyFront", false);

      this.note = EditNote.withFooterFromGMInfo();
      this.fetcher = new ImageFetcher();
      this.urlsInProgress = new Set();
      LOGGER.addSink(this.loggingSink);
      qs('.add-files').insertAdjacentElement('afterend', this.loggingSink.rootElement);
      this.ui = new InputForm(this);
    }

    processURL(url) {
      const _this = this;

      return _call(function () {
        return _this.urlsInProgress.has(url.href) ? _await() : _await(_continueIgnored(_finallyRethrows(function () {
          _this.urlsInProgress.add(url.href);

          return _awaitIgnored(_this._processURL(url));
        }, function (_wasThrown, _result) {
          _this.urlsInProgress.delete(url.href);

          return _rethrow(_wasThrown, _result);
        })));
      });
    }

    clearLogLater() {
      this.loggingSink.clearAllLater();
    }

    _processURL(url) {
      const _this2 = this;

      return _call(function () {
        let _exit = false;
        let fetchResult;
        return _await(_continue(_catch(function () {
          return _await(_this2.fetcher.fetchImages(url, _this2.onlyFront), function (_this2$fetcher$fetchI) {
            fetchResult = _this2$fetcher$fetchI;
          });
        }, function (err) {
          LOGGER.error('Failed to grab images', err);
          _exit = true;
        }), function (_result2) {
          let _exit2 = false;
          if (_exit) return _result2;
          return _continue(_catch(function () {
            return _awaitIgnored(enqueueImages(fetchResult));
          }, function (err) {
            LOGGER.error('Failed to enqueue images', err);
            _exit2 = true;
          }), function (_result3) {
            if (_exit2) return _result3;
            fillEditNote([fetchResult], '', _this2.note);

            if (fetchResult.images.length) {
              LOGGER.success("Successfully added ".concat(fetchResult.images.length, " image(s)"));
            }
          });
        }));
      });
    }

    processSeedingParameters() {
      const _this3 = this;

      return _call(function () {
        let _exit3 = false;
        const params = SeedParameters.decode(new URLSearchParams(document.location.search));
        let fetchResults;
        return _await(_continue(_catch(function () {
          return _await(Promise.all(params.images.map(_async(function (cover) {
            return _await(_this3.fetcher.fetchImages(cover.url, _this3.onlyFront), function (_this3$fetcher$fetchI) {
              return [_this3$fetcher$fetchI, cover];
            });
          }))), function (_Promise$all) {
            fetchResults = _Promise$all;
          });
        }, function (err) {
          LOGGER.error('Failed to grab images', err);
          _exit3 = true;
        }), function (_result4) {
          return _exit3 ? _result4 : _continue(_forOf(fetchResults, function (_ref) {
            let _ref2 = _slicedToArray(_ref, 2),
                fetchResult = _ref2[0],
                cover = _ref2[1];

            return _continueIgnored(_catch(function () {
              return _awaitIgnored(enqueueImages(fetchResult, cover.types, cover.comment));
            }, function (err) {
              LOGGER.error('Failed to enqueue some images', err);
            }));
          }), function () {
            var _params$origin;

            fillEditNote(fetchResults.map(pair => pair[0]), (_params$origin = params.origin) !== null && _params$origin !== void 0 ? _params$origin : '', _this3.note);
            const totalNumImages = fetchResults.reduce((acc, pair) => acc + pair[0].images.length, 0);

            if (totalNumImages) {
              LOGGER.success("Successfully added ".concat(totalNumImages, " image(s)"));
            }

            _this3.clearLogLater();
          });
        }));
      });
    }

    addImportButtons() {
      const _this4 = this;

      return _call(function () {
        var _window$location$href;

        const mbid = (_window$location$href = window.location.href.match(/musicbrainz\.org\/release\/([a-f0-9-]+)\//)) === null || _window$location$href === void 0 ? void 0 : _window$location$href[1];
        assertHasValue(mbid);
        return _await(getURLsForRelease(mbid, {
          excludeEnded: true,
          excludeDuplicates: true
        }), function (attachedURLs) {
          const supportedURLs = attachedURLs.filter(url => {
            var _getProvider;

            return (_getProvider = getProvider(url)) === null || _getProvider === void 0 ? void 0 : _getProvider.allowButtons;
          });
          if (!supportedURLs.length) return;

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

  const addSeedLinkToCover = _async(function (fig, mbid, origin) {
      var _imageUrl$match;
      const imageUrl = qs('a.icon', fig).href;
      const ext = (_imageUrl$match = imageUrl.match(/\.(\w+)$/)) === null || _imageUrl$match === void 0 ? void 0 : _imageUrl$match[1];
      return _await(getImageDimensions(imageUrl), function (imageDimensions) {
          var _tryExtractReleaseUrl, _qs$insertAdjacentEle;
          const dimensionStr = ''.concat(imageDimensions.width, 'x').concat(imageDimensions.height);
          const realUrl = (_tryExtractReleaseUrl = tryExtractReleaseUrl(fig)) !== null && _tryExtractReleaseUrl !== void 0 ? _tryExtractReleaseUrl : imageUrl;
          const params = new SeedParameters([{ url: new URL(realUrl) }], origin);
          const seedUrl = params.createSeedURL(mbid);
          const dimSpan = function () {
              var $$a = document.createElement('span');
              setStyles($$a, { display: 'block' });
              appendChildren($$a, dimensionStr + (ext ? ' '.concat(ext.toUpperCase()) : ''));
              return $$a;
          }.call(this);
          const seedLink = function () {
              var $$c = document.createElement('a');
              $$c.setAttribute('href', seedUrl);
              setStyles($$c, { display: 'block' });
              var $$d = document.createTextNode('\n        Add to release\n    ');
              $$c.appendChild($$d);
              return $$c;
          }.call(this);
          (_qs$insertAdjacentEle = qs('figcaption > a', fig).insertAdjacentElement('afterend', dimSpan)) === null || _qs$insertAdjacentEle === void 0 ? void 0 : _qs$insertAdjacentEle.insertAdjacentElement('afterend', seedLink);
      });
  });
  const AtisketSeeder = {
      supportedDomains: [
          'atisket.pulsewidth.org.uk',
          'etc.marlonob.info'
      ],
      supportedRegexes: [/(?:\.uk|\.info\/atisket)\/\?.+/],
      insertSeedLinks() {
          var _qs$textContent$trim, _qs$textContent, _cachedAnchor$href;
          const alreadyInMB = qsMaybe('.already-in-mb-item');
          if (alreadyInMB === null) {
              return;
          }
          const mbid = (_qs$textContent$trim = (_qs$textContent = qs('a.mb', alreadyInMB).textContent) === null || _qs$textContent === void 0 ? void 0 : _qs$textContent.trim()) !== null && _qs$textContent$trim !== void 0 ? _qs$textContent$trim : '';
          const cachedAnchor = qsMaybe('#submit-button + div > a');
          addSeedLinkToCovers(mbid, (_cachedAnchor$href = cachedAnchor === null || cachedAnchor === void 0 ? void 0 : cachedAnchor.href) !== null && _cachedAnchor$href !== void 0 ? _cachedAnchor$href : document.location.href);
      }
  };
  const AtasketSeeder = {
      supportedDomains: [
          'atisket.pulsewidth.org.uk',
          'etc.marlonob.info'
      ],
      supportedRegexes: [/(?:\.uk|\.info\/atisket)\/atasket\.php\?/],
      insertSeedLinks() {
          const urlParams = new URLSearchParams(document.location.search);
          const mbid = urlParams.get('release_mbid');
          const selfId = urlParams.get('self_id');
          if (!mbid || !selfId) {
              LOGGER.error('Cannot extract IDs! Seeding is disabled :(');
              return;
          }
          const cachedUrl = document.location.origin + '/?cached=' + selfId;
          addSeedLinkToCovers(mbid, cachedUrl);
      }
  };
  function addSeedLinkToCovers(mbid, origin) {
      const covers = qsa('figure.cover');
      Promise.all(covers.map(fig => addSeedLinkToCover(fig, mbid, origin))).catch(err => {
          LOGGER.error('Failed to add seed links to some cover art', err);
      });
  }
  function tryExtractReleaseUrl(fig) {
      var _fig$closest;
      const countryCode = (_fig$closest = fig.closest('div')) === null || _fig$closest === void 0 ? void 0 : _fig$closest.getAttribute('data-matched-country');
      const vendorId = fig.getAttribute('data-vendor-id');
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

  const extractCovers = _async(function () {
      return _await(VGMdbProvider.extractCoversFromDOMGallery(qs('#cover_gallery')), function (covers) {
          return _await(new VGMdbProvider().findImagesWithApi(new URL(document.location.href)), function (_VGMdbProvider$findIm) {
              const publicCoverURLs = new Set(_VGMdbProvider$findIm.map(cover => cover.url.href));
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
      insertSeedLinks() {
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
          Promise.all([
              releaseIdsProm,
              coversProm
          ]).then(_ref => {
              let _ref2 = _slicedToArray(_ref, 2), releaseIds = _ref2[0], covers = _ref2[1];
              insertSeedButtons(coverHeading, releaseIds, covers);
          }).catch(err => {
              LOGGER.error('Failed to insert seed links', err);
          });
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
                  if (evt.currentTarget.checked) {
                      a.href = seedParamsAll.createSeedURL(relId);
                  } else {
                      a.href = seedParamsPrivate.createSeedURL(relId);
                  }
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
          inclPublicLabel
      ].concat(anchors);
      if (!anchors.length) {
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
  registerSeeder(VGMdbSeeder);

  LOGGER.configure({
    logLevel: LogLevel.INFO
  });
  LOGGER.addSink(new ConsoleSink(USERSCRIPT_NAME));

  function runOnMB() {
    const app = new App();
    app.processSeedingParameters().catch(err => {
      LOGGER.error('Failed to process seeded cover art parameters', err);
    });
    app.addImportButtons().catch(err => {
      LOGGER.error('Failed to add some provider import buttons', err);
    });
  }

  function runOnSeederPage() {
    const seeder = seederFactory(document.location);

    if (seeder) {
      seeder.insertSeedLinks();
    } else {
      LOGGER.error('Somehow I am running on a page I do not support…');
    }
  }

  if (document.location.hostname === 'musicbrainz.org' || document.location.hostname.endsWith('.musicbrainz.org')) {
    runOnMB();
  } else {
    runOnSeederPage();
  }

})();
