// ==UserScript==
// @name         MB: Enhanced Cover Art Uploads
// @description  Enhance the cover art uploader! Upload directly from a URL, automatically import covers from Discogs/Spotify/Apple Music/..., automatically retrieve the largest version, and more!
// @version      2021.10.31.7
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
// @match        *://vgmdb.net/album/*
// @exclude      *://atisket.pulsewidth.org.uk/
// @require      https://github.com/qsniyg/maxurl/blob/563626fe3b7c5ed3f6dc19d90a356746c68b5b4b/userscript.user.js?raw=true
// @resource     amazonFavicon https://www.amazon.com/favicon.ico
// @run-at       document-load
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_getResourceURL
// @connect      *
// ==/UserScript==

(function () {
  'use strict';

  /* minified: babel helpers, nativejsx, regenerator-runtime, @babel/runtime, ts-custom-error, p-throttle */
  function ownKeys(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n);}return r}function _objectSpread2(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?ownKeys(Object(r),!0).forEach((function(e){_defineProperty(t,e,r[e]);})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):ownKeys(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e));}));}return t}function _typeof(t){return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},_typeof(t)}function _asyncIterator(t){var e;if("undefined"!=typeof Symbol&&(Symbol.asyncIterator&&(e=t[Symbol.asyncIterator]),null==e&&Symbol.iterator&&(e=t[Symbol.iterator])),null==e&&(e=t["@@asyncIterator"]),null==e&&(e=t["@@iterator"]),null==e)throw new TypeError("Object is not async iterable");return e.call(t)}function _AwaitValue(t){this.wrapped=t;}function _AsyncGenerator(t){var e,r;function n(e,r){try{var a=t[e](r),i=a.value,c=i instanceof _AwaitValue;Promise.resolve(c?i.wrapped:i).then((function(t){c?n("return"===e?"return":"next",t):o(a.done?"return":"normal",t);}),(function(t){n("throw",t);}));}catch(u){o("throw",u);}}function o(t,o){switch(t){case"return":e.resolve({value:o,done:!0});break;case"throw":e.reject(o);break;default:e.resolve({value:o,done:!1});}(e=e.next)?n(e.key,e.arg):r=null;}this._invoke=function(t,o){return new Promise((function(a,i){var c={key:t,arg:o,resolve:a,reject:i,next:null};r?r=r.next=c:(e=r=c,n(t,o));}))},"function"!=typeof t.return&&(this.return=void 0);}function _wrapAsyncGenerator(t){return function(){return new _AsyncGenerator(t.apply(this,arguments))}}function _awaitAsyncGenerator(t){return new _AwaitValue(t)}function _asyncGeneratorDelegate(t,e){var r={},n=!1;function o(r,o){return n=!0,o=new Promise((function(e){e(t[r](o));})),{done:!1,value:e(o)}}return r["undefined"!=typeof Symbol&&Symbol.iterator||"@@iterator"]=function(){return this},r.next=function(t){return n?(n=!1,t):o("next",t)},"function"==typeof t.throw&&(r.throw=function(t){if(n)throw n=!1,t;return o("throw",t)}),"function"==typeof t.return&&(r.return=function(t){return n?(n=!1,t):o("return",t)}),r}function asyncGeneratorStep(t,e,r,n,o,a,i){try{var c=t[a](i),u=c.value;}catch(s){return void r(s)}c.done?e(u):Promise.resolve(u).then(n,o);}function _asyncToGenerator(t){return function(){var e=this,r=arguments;return new Promise((function(n,o){var a=t.apply(e,r);function i(t){asyncGeneratorStep(a,n,o,i,c,"next",t);}function c(t){asyncGeneratorStep(a,n,o,i,c,"throw",t);}i(void 0);}))}}function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _defineProperties(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n);}}function _createClass(t,e,r){return e&&_defineProperties(t.prototype,e),r&&_defineProperties(t,r),t}function _defineProperty(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function _inherits(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&_setPrototypeOf(t,e);}function _getPrototypeOf(t){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)},_getPrototypeOf(t)}function _setPrototypeOf(t,e){return _setPrototypeOf=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t},_setPrototypeOf(t,e)}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return !1;if(Reflect.construct.sham)return !1;if("function"==typeof Proxy)return !0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return !1}}function _construct(t,e,r){return _construct=_isNativeReflectConstruct()?Reflect.construct:function(t,e,r){var n=[null];n.push.apply(n,e);var o=new(Function.bind.apply(t,n));return r&&_setPrototypeOf(o,r.prototype),o},_construct.apply(null,arguments)}function _isNativeFunction(t){return -1!==Function.toString.call(t).indexOf("[native code]")}function _wrapNativeSuper(t){var e="function"==typeof Map?new Map:void 0;return _wrapNativeSuper=function(t){if(null===t||!_isNativeFunction(t))return t;if("function"!=typeof t)throw new TypeError("Super expression must either be null or a function");if(void 0!==e){if(e.has(t))return e.get(t);e.set(t,r);}function r(){return _construct(t,arguments,_getPrototypeOf(this).constructor)}return r.prototype=Object.create(t.prototype,{constructor:{value:r,enumerable:!1,writable:!0,configurable:!0}}),_setPrototypeOf(r,t)},_wrapNativeSuper(t)}function _assertThisInitialized(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function _possibleConstructorReturn(t,e){if(e&&("object"==typeof e||"function"==typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return _assertThisInitialized(t)}function _createSuper(t){var e=_isNativeReflectConstruct();return function(){var r,n=_getPrototypeOf(t);if(e){var o=_getPrototypeOf(this).constructor;r=Reflect.construct(n,arguments,o);}else r=n.apply(this,arguments);return _possibleConstructorReturn(this,r)}}function _superPropBase(t,e){for(;!Object.prototype.hasOwnProperty.call(t,e)&&null!==(t=_getPrototypeOf(t)););return t}function _get(t,e,r){return _get="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function(t,e,r){var n=_superPropBase(t,e);if(n){var o=Object.getOwnPropertyDescriptor(n,e);return o.get?o.get.call(r):o.value}},_get(t,e,r||t)}function _slicedToArray(t,e){return _arrayWithHoles(t)||_iterableToArrayLimit(t,e)||_unsupportedIterableToArray(t,e)||_nonIterableRest()}function _toArray(t){return _arrayWithHoles(t)||_iterableToArray(t)||_unsupportedIterableToArray(t)||_nonIterableRest()}function _toConsumableArray(t){return _arrayWithoutHoles(t)||_iterableToArray(t)||_unsupportedIterableToArray(t)||_nonIterableSpread()}function _arrayWithoutHoles(t){if(Array.isArray(t))return _arrayLikeToArray(t)}function _arrayWithHoles(t){if(Array.isArray(t))return t}function _iterableToArray(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}function _iterableToArrayLimit(t,e){var r=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=r){var n,o,a=[],i=!0,c=!1;try{for(r=r.call(t);!(i=(n=r.next()).done)&&(a.push(n.value),!e||a.length!==e);i=!0);}catch(u){c=!0,o=u;}finally{try{i||null==r.return||r.return();}finally{if(c)throw o}}return a}}function _unsupportedIterableToArray(t,e){if(t){if("string"==typeof t)return _arrayLikeToArray(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);return "Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?_arrayLikeToArray(t,e):void 0}}function _arrayLikeToArray(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _createForOfIteratorHelper(t,e){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!r){if(Array.isArray(t)||(r=_unsupportedIterableToArray(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,o=function(){};return {s:o,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,i=!0,c=!1;return {s:function(){r=r.call(t);},n:function(){var t=r.next();return i=t.done,t},e:function(t){c=!0,a=t;},f:function(){try{i||null==r.return||r.return();}finally{if(c)throw a}}}}function _classPrivateFieldGet(t,e){return _classApplyDescriptorGet(t,_classExtractFieldDescriptor(t,e,"get"))}function _classPrivateFieldSet(t,e,r){return _classApplyDescriptorSet(t,_classExtractFieldDescriptor(t,e,"set"),r),r}function _classExtractFieldDescriptor(t,e,r){if(!e.has(t))throw new TypeError("attempted to "+r+" private field on non-instance");return e.get(t)}function _classApplyDescriptorGet(t,e){return e.get?e.get.call(t):e.value}function _classApplyDescriptorSet(t,e,r){if(e.set)e.set.call(t,r);else {if(!e.writable)throw new TypeError("attempted to set read only private field");e.value=r;}}function _classPrivateMethodGet(t,e,r){if(!e.has(t))throw new TypeError("attempted to get private field on non-instance");return r}function _checkPrivateRedeclaration(t,e){if(e.has(t))throw new TypeError("Cannot initialize the same private elements twice on an object")}function _classPrivateFieldInitSpec(t,e,r){_checkPrivateRedeclaration(t,e),e.set(t,r);}function _classPrivateMethodInitSpec(t,e){_checkPrivateRedeclaration(t,e),e.add(t);}_AsyncGenerator.prototype["function"==typeof Symbol&&Symbol.asyncIterator||"@@asyncIterator"]=function(){return this},_AsyncGenerator.prototype.next=function(t){return this._invoke("next",t)},_AsyncGenerator.prototype.throw=function(t){return this._invoke("throw",t)},_AsyncGenerator.prototype.return=function(t){return this._invoke("return",t)};var appendChildren=function(t,e){(e=Array.isArray(e)?e:[e]).forEach((function(e){e instanceof HTMLElement?t.appendChild(e):(e||"string"==typeof e)&&t.appendChild(document.createTextNode(e.toString()));}));},setStyles=function(t,e){for(var r in e)t.style[r]=e[r];},runtime={exports:{}};!function(t){var e=function(t){var e,r=Object.prototype,n=r.hasOwnProperty,o="function"==typeof Symbol?Symbol:{},a=o.iterator||"@@iterator",i=o.asyncIterator||"@@asyncIterator",c=o.toStringTag||"@@toStringTag";function u(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{u({},"");}catch(L){u=function(t,e,r){return t[e]=r};}function s(t,e,r,n){var o=e&&e.prototype instanceof d?e:d,a=Object.create(o.prototype),i=new T(n||[]);return a._invoke=function(t,e,r){var n=f;return function(o,a){if(n===y)throw new Error("Generator is already running");if(n===h){if("throw"===o)throw a;return I()}for(r.method=o,r.arg=a;;){var i=r.delegate;if(i){var c=x(i,r);if(c){if(c===v)continue;return c}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if(n===f)throw n=h,r.arg;r.dispatchException(r.arg);}else "return"===r.method&&r.abrupt("return",r.arg);n=y;var u=l(t,e,r);if("normal"===u.type){if(n=r.done?h:p,u.arg===v)continue;return {value:u.arg,done:r.done}}"throw"===u.type&&(n=h,r.method="throw",r.arg=u.arg);}}}(t,r,i),a}function l(t,e,r){try{return {type:"normal",arg:t.call(e,r)}}catch(L){return {type:"throw",arg:L}}}t.wrap=s;var f="suspendedStart",p="suspendedYield",y="executing",h="completed",v={};function d(){}function _(){}function b(){}var m={};u(m,a,(function(){return this}));var w=Object.getPrototypeOf,g=w&&w(w(j([])));g&&g!==r&&n.call(g,a)&&(m=g);var O=b.prototype=d.prototype=Object.create(m);function P(t){["next","throw","return"].forEach((function(e){u(t,e,(function(t){return this._invoke(e,t)}));}));}function S(t,e){function r(o,a,i,c){var u=l(t[o],t,a);if("throw"!==u.type){var s=u.arg,f=s.value;return f&&"object"===_typeof(f)&&n.call(f,"__await")?e.resolve(f.__await).then((function(t){r("next",t,i,c);}),(function(t){r("throw",t,i,c);})):e.resolve(f).then((function(t){s.value=t,i(s);}),(function(t){return r("throw",t,i,c)}))}c(u.arg);}var o;this._invoke=function(t,n){function a(){return new e((function(e,o){r(t,n,e,o);}))}return o=o?o.then(a,a):a()};}function x(t,r){var n=t.iterator[r.method];if(n===e){if(r.delegate=null,"throw"===r.method){if(t.iterator.return&&(r.method="return",r.arg=e,x(t,r),"throw"===r.method))return v;r.method="throw",r.arg=new TypeError("The iterator does not provide a 'throw' method");}return v}var o=l(n,t.iterator,r.arg);if("throw"===o.type)return r.method="throw",r.arg=o.arg,r.delegate=null,v;var a=o.arg;return a?a.done?(r[t.resultName]=a.value,r.next=t.nextLoc,"return"!==r.method&&(r.method="next",r.arg=e),r.delegate=null,v):a:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,v)}function A(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e);}function E(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e;}function T(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(A,this),this.reset(!0);}function j(t){if(t){var r=t[a];if(r)return r.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var o=-1,i=function r(){for(;++o<t.length;)if(n.call(t,o))return r.value=t[o],r.done=!1,r;return r.value=e,r.done=!0,r};return i.next=i}}return {next:I}}function I(){return {value:e,done:!0}}return _.prototype=b,u(O,"constructor",b),u(b,"constructor",_),_.displayName=u(b,c,"GeneratorFunction"),t.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return !!e&&(e===_||"GeneratorFunction"===(e.displayName||e.name))},t.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,b):(t.__proto__=b,u(t,c,"GeneratorFunction")),t.prototype=Object.create(O),t},t.awrap=function(t){return {__await:t}},P(S.prototype),u(S.prototype,i,(function(){return this})),t.AsyncIterator=S,t.async=function(e,r,n,o,a){void 0===a&&(a=Promise);var i=new S(s(e,r,n,o),a);return t.isGeneratorFunction(r)?i:i.next().then((function(t){return t.done?t.value:i.next()}))},P(O),u(O,c,"Generator"),u(O,a,(function(){return this})),u(O,"toString",(function(){return "[object Generator]"})),t.keys=function(t){var e=[];for(var r in t)e.push(r);return e.reverse(),function r(){for(;e.length;){var n=e.pop();if(n in t)return r.value=n,r.done=!1,r}return r.done=!0,r}},t.values=j,T.prototype={constructor:T,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=e,this.done=!1,this.delegate=null,this.method="next",this.arg=e,this.tryEntries.forEach(E),!t)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=e);},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var r=this;function o(n,o){return c.type="throw",c.arg=t,r.next=n,o&&(r.method="next",r.arg=e),!!o}for(var a=this.tryEntries.length-1;a>=0;--a){var i=this.tryEntries[a],c=i.completion;if("root"===i.tryLoc)return o("end");if(i.tryLoc<=this.prev){var u=n.call(i,"catchLoc"),s=n.call(i,"finallyLoc");if(u&&s){if(this.prev<i.catchLoc)return o(i.catchLoc,!0);if(this.prev<i.finallyLoc)return o(i.finallyLoc)}else if(u){if(this.prev<i.catchLoc)return o(i.catchLoc,!0)}else {if(!s)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return o(i.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var a=o;break}}a&&("break"===t||"continue"===t)&&a.tryLoc<=e&&e<=a.finallyLoc&&(a=null);var i=a?a.completion:{};return i.type=t,i.arg=e,a?(this.method="next",this.next=a.finallyLoc,v):this.complete(i)},complete:function(t,e){if("throw"===t.type)throw t.arg;return "break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),v},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),E(r),v}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;E(r);}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,r,n){return this.delegate={iterator:j(t),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=e),v}},t}(t.exports);try{regeneratorRuntime=e;}catch(r){"object"===("undefined"==typeof globalThis?"undefined":_typeof(globalThis))?globalThis.regeneratorRuntime=e:Function("r","regeneratorRuntime = r")(e);}}(runtime);var regenerator=runtime.exports;function fixProto(t,e){var r=Object.setPrototypeOf;r?r(t,e):t.__proto__=e;}function fixStack(t,e){void 0===e&&(e=t.constructor);var r=Error.captureStackTrace;r&&r(t,e);}var __extends=function(){var t=function(e,r){return t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e;}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r]);},t(e,r)};return function(e,r){function n(){this.constructor=e;}t(e,r),e.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n);}}(),CustomError=function(t){function e(e){var r=this.constructor,n=t.call(this,e)||this;return Object.defineProperty(n,"name",{value:r.name,enumerable:!1,configurable:!0}),fixProto(n,r.prototype),fixStack(n),n}return __extends(e,t),e}(Error),AbortError=function(t){_inherits(r,_wrapNativeSuper(Error));var e=_createSuper(r);function r(){var t;return _classCallCheck(this,r),(t=e.call(this,"Throttled function aborted")).name="AbortError",t}return r}();function pThrottle(t){var e=t.limit,r=t.interval,n=t.strict;if(!Number.isFinite(e))throw new TypeError("Expected `limit` to be a finite number");if(!Number.isFinite(r))throw new TypeError("Expected `interval` to be a finite number");var o=new Map,a=0,i=0,c=[],u=n?function(){var t=Date.now();if(c.length<e)return c.push(t),0;var n=c.shift()+r;return t>=n?(c.push(t),0):(c.push(n),n-t)}:function(){var t=Date.now();return t-a>r?(i=1,a=t,0):(i<e?i++:(a+=r,i=1),a-t)};return function(t){var e=function e(){for(var r,n=this,a=arguments.length,i=new Array(a),c=0;c<a;c++)i[c]=arguments[c];return e.isEnabled?new Promise((function(e,a){r=setTimeout((function(){e(t.apply(n,i)),o.delete(r);}),u()),o.set(r,a);})):_asyncToGenerator(regenerator.mark((function e(){return regenerator.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",t.apply(n,i));case 1:case"end":return e.stop()}}),e)})))()};return e.abort=function(){var t,e=_createForOfIteratorHelper(o.keys());try{for(e.s();!(t=e.n()).done;){var r=t.value;clearTimeout(r),o.get(r)(new AbortError);}}catch(n){e.e(n);}finally{e.f();}o.clear(),c.splice(0,c.length);},e.isEnabled=!0,e}}

  /* minified: lib */
  var LogLevel,_HANDLER_NAMES;!function(e){e[e.DEBUG=0]="DEBUG",e[e.LOG=1]="LOG",e[e.INFO=2]="INFO",e[e.SUCCESS=3]="SUCCESS",e[e.WARNING=4]="WARNING",e[e.ERROR=5]="ERROR";}(LogLevel||(LogLevel={}));var HANDLER_NAMES=(_defineProperty(_HANDLER_NAMES={},LogLevel.DEBUG,"onDebug"),_defineProperty(_HANDLER_NAMES,LogLevel.LOG,"onLog"),_defineProperty(_HANDLER_NAMES,LogLevel.INFO,"onInfo"),_defineProperty(_HANDLER_NAMES,LogLevel.SUCCESS,"onSuccess"),_defineProperty(_HANDLER_NAMES,LogLevel.WARNING,"onWarn"),_defineProperty(_HANDLER_NAMES,LogLevel.ERROR,"onError"),_HANDLER_NAMES),DEFAULT_OPTIONS={logLevel:LogLevel.INFO,sinks:[]},_configuration=new WeakMap,_fireHandlers=new WeakSet,Logger=function(){function e(t){_classCallCheck(this,e),_classPrivateMethodInitSpec(this,_fireHandlers),_classPrivateFieldInitSpec(this,_configuration,{writable:!0,value:void 0}),_classPrivateFieldSet(this,_configuration,_objectSpread2(_objectSpread2({},DEFAULT_OPTIONS),t));}return _createClass(e,[{key:"debug",value:function(e){_classPrivateMethodGet(this,_fireHandlers,_fireHandlers2).call(this,LogLevel.DEBUG,e);}},{key:"log",value:function(e){_classPrivateMethodGet(this,_fireHandlers,_fireHandlers2).call(this,LogLevel.LOG,e);}},{key:"info",value:function(e){_classPrivateMethodGet(this,_fireHandlers,_fireHandlers2).call(this,LogLevel.INFO,e);}},{key:"success",value:function(e){_classPrivateMethodGet(this,_fireHandlers,_fireHandlers2).call(this,LogLevel.SUCCESS,e);}},{key:"warn",value:function(e,t){_classPrivateMethodGet(this,_fireHandlers,_fireHandlers2).call(this,LogLevel.WARNING,e,t);}},{key:"error",value:function(e,t){_classPrivateMethodGet(this,_fireHandlers,_fireHandlers2).call(this,LogLevel.ERROR,e,t);}},{key:"configure",value:function(e){Object.assign(_classPrivateFieldGet(this,_configuration),e);}},{key:"configuration",get:function(){return _classPrivateFieldGet(this,_configuration)}},{key:"addSink",value:function(e){_classPrivateFieldGet(this,_configuration).sinks.push(e);}}]),e}();function _fireHandlers2(e,t,r){e<_classPrivateFieldGet(this,_configuration).logLevel||_classPrivateFieldGet(this,_configuration).sinks.forEach((function(a){var s=a[HANDLER_NAMES[e]];s&&(r?s.call(a,t,r):s.call(a,t));}));}var LOGGER=new Logger,_scriptName=new WeakMap,_formatMessage=new WeakSet,ConsoleSink=function(){function e(t){_classCallCheck(this,e),_classPrivateMethodInitSpec(this,_formatMessage),_classPrivateFieldInitSpec(this,_scriptName,{writable:!0,value:void 0}),_defineProperty(this,"onSuccess",this.onInfo),_classPrivateFieldSet(this,_scriptName,t);}return _createClass(e,[{key:"onDebug",value:function(e){console.debug(_classPrivateMethodGet(this,_formatMessage,_formatMessage2).call(this,e));}},{key:"onLog",value:function(e){console.log(_classPrivateMethodGet(this,_formatMessage,_formatMessage2).call(this,e));}},{key:"onInfo",value:function(e){console.info(_classPrivateMethodGet(this,_formatMessage,_formatMessage2).call(this,e));}},{key:"onWarn",value:function(e,t){e=_classPrivateMethodGet(this,_formatMessage,_formatMessage2).call(this,e),t?console.warn(e,t):console.warn(e);}},{key:"onError",value:function(e,t){e=_classPrivateMethodGet(this,_formatMessage,_formatMessage2).call(this,e),t?console.error(e,t):console.error(e);}}]),e}();function _formatMessage2(e){return "[".concat(_classPrivateFieldGet(this,_scriptName),"] ").concat(e)}var AssertionError=function(e){_inherits(r,e);var t=_createSuper(r);function r(){return _classCallCheck(this,r),t.apply(this,arguments)}return r}(_wrapNativeSuper(Error));function assert(e,t){if(!e)throw new AssertionError(null!=t?t:"Assertion failed")}function assertDefined(e,t){assert(void 0!==e,null!=t?t:"Assertion failed: Expected value to be defined");}function assertNonNull(e,t){assert(null!==e,null!=t?t:"Assertion failed: Expected value to be non-null");}function assertHasValue(e,t){assert(null!=e,null!=t?t:"Assertion failed: Expected value to be defined and non-null");}function qs(e,t){var r=qsMaybe(e,t);return assertNonNull(r,"Could not find required element"),r}function qsMaybe(e,t){return (null!=t?t:document).querySelector(e)}function qsa(e,t){var r=null!=t?t:document;return _toConsumableArray(r.querySelectorAll(e))}function parseDOM(e,t){var r=(new DOMParser).parseFromString(e,"text/html");if(!qsMaybe("base",r.head)){var a=r.createElement("base");a.href=t,r.head.insertAdjacentElement("beforeend",a);}return r}function safeParseJSON(e,t){try{return JSON.parse(e)}catch(r){if(t)throw new Error(t+": "+r);return}}function getReleaseUrlARs(e){return _getReleaseUrlARs.apply(this,arguments)}function _getReleaseUrlARs(){return (_getReleaseUrlARs=_asyncToGenerator(regenerator.mark((function e(t){var r,a,s;return regenerator.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("/ws/2/release/".concat(t,"?inc=url-rels&fmt=json"));case 2:return a=e.sent,e.next=5,a.json();case 5:return s=e.sent,e.abrupt("return",null!==(r=s.relations)&&void 0!==r?r:[]);case 7:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function getURLsForRelease(e,t){return _getURLsForRelease.apply(this,arguments)}function _getURLsForRelease(){return (_getURLsForRelease=_asyncToGenerator(regenerator.mark((function e(t,r){var a,s,n,i,o;return regenerator.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return s=(a=null!=r?r:{}).excludeEnded,n=a.excludeDuplicates,e.next=3,getReleaseUrlARs(t);case 3:return i=e.sent,s&&(i=i.filter((function(e){return !e.ended}))),o=i.map((function(e){return e.url.resource})),n&&(o=Array.from(new Set(_toConsumableArray(o)))),e.abrupt("return",o.flatMap((function(e){try{return [new URL(e)]}catch(t){return console.warn("Found malformed URL linked to release: ".concat(e)),[]}})));case 8:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function getReleaseIDsForURL(e){return _getReleaseIDsForURL.apply(this,arguments)}function _getReleaseIDsForURL(){return (_getReleaseIDsForURL=_asyncToGenerator(regenerator.mark((function e(t){var r,a,s,n;return regenerator.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("//musicbrainz.org/ws/2/url?resource=".concat(encodeURIComponent(t),"&inc=release-rels&fmt=json"));case 2:return s=e.sent,e.next=5,s.json();case 5:return n=e.sent,e.abrupt("return",null!==(r=null===(a=n.relations)||void 0===a?void 0:a.map((function(e){return e.release.id})))&&void 0!==r?r:[]);case 7:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var ResponseError=function(e){_inherits(r,CustomError);var t=_createSuper(r);function r(e,a){var s;return _classCallCheck(this,r),s=t.call(this,a),_defineProperty(_assertThisInitialized(s),"url",void 0),s.url=e,s}return r}(),HTTPResponseError=function(e){_inherits(r,ResponseError);var t=_createSuper(r);function r(e,a){var s;return _classCallCheck(this,r),a.statusText.trim()?(s=t.call(this,e,"HTTP error ".concat(a.status,": ").concat(a.statusText)),_defineProperty(_assertThisInitialized(s),"statusCode",void 0),_defineProperty(_assertThisInitialized(s),"statusText",void 0),_defineProperty(_assertThisInitialized(s),"response",void 0)):(s=t.call(this,e,"HTTP error ".concat(a.status)),_defineProperty(_assertThisInitialized(s),"statusCode",void 0),_defineProperty(_assertThisInitialized(s),"statusText",void 0),_defineProperty(_assertThisInitialized(s),"response",void 0)),s.response=a,s.statusCode=a.status,s.statusText=a.statusText,_possibleConstructorReturn(s)}return r}(),TimeoutError=function(e){_inherits(r,ResponseError);var t=_createSuper(r);function r(e){return _classCallCheck(this,r),t.call(this,e,"Request timed out")}return r}(),AbortedError=function(e){_inherits(r,ResponseError);var t=_createSuper(r);function r(e){return _classCallCheck(this,r),t.call(this,e,"Request aborted")}return r}(),NetworkError=function(e){_inherits(r,ResponseError);var t=_createSuper(r);function r(e){return _classCallCheck(this,r),t.call(this,e,"Network error")}return r}();function gmxhr(e,t){return _gmxhr.apply(this,arguments)}function _gmxhr(){return (_gmxhr=_asyncToGenerator(regenerator.mark((function e(t,r){return regenerator.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",new Promise((function(e,a){GM_xmlhttpRequest(_objectSpread2(_objectSpread2({method:"GET",url:t instanceof URL?t.href:t},null!=r?r:{}),{},{onload:function(r){r.status>=400?a(new HTTPResponseError(t,r)):e(r);},onerror:function(){a(new NetworkError(t));},onabort:function(){a(new AbortedError(t));},ontimeout:function(){a(new TimeoutError(t));}}));})));case 1:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function filterNonNull(e){return e.filter((function(e){return !(null==e)}))}function groupBy(e,t,r){var a,s=new Map,n=_createForOfIteratorHelper(e);try{for(n.s();!(a=n.n()).done;){var i,o=a.value,l=t(o),c=r(o);s.has(l)?null===(i=s.get(l))||void 0===i||i.push(c):s.set(l,[c]);}}catch(u){n.e(u);}finally{n.f();}return s}var separator="\n–\n",_footer=new WeakMap,_extraInfoLines=new WeakMap,_editNoteTextArea=new WeakMap,_removePreviousFooter=new WeakSet,EditNote=function(){function e(t){_classCallCheck(this,e),_classPrivateMethodInitSpec(this,_removePreviousFooter),_classPrivateFieldInitSpec(this,_footer,{writable:!0,value:void 0}),_classPrivateFieldInitSpec(this,_extraInfoLines,{writable:!0,value:void 0}),_classPrivateFieldInitSpec(this,_editNoteTextArea,{writable:!0,value:void 0}),_classPrivateFieldSet(this,_footer,t),_classPrivateFieldSet(this,_editNoteTextArea,qs("textarea.edit-note"));var r=_classPrivateFieldGet(this,_editNoteTextArea).value.split(separator)[0];_classPrivateFieldSet(this,_extraInfoLines,r?new Set(r.split("\n").map((function(e){return e.trimRight()}))):new Set);}return _createClass(e,[{key:"addExtraInfo",value:function(e){if(!_classPrivateFieldGet(this,_extraInfoLines).has(e)){var t=_classPrivateFieldGet(this,_editNoteTextArea).value.split(separator),r=_toArray(t),a=r[0],s=r.slice(1);a=(a+"\n"+e).trim(),_classPrivateFieldGet(this,_editNoteTextArea).value=[a].concat(_toConsumableArray(s)).join(separator),_classPrivateFieldGet(this,_extraInfoLines).add(e);}}},{key:"addFooter",value:function(){_classPrivateMethodGet(this,_removePreviousFooter,_removePreviousFooter2).call(this);var e=_classPrivateFieldGet(this,_editNoteTextArea).value;_classPrivateFieldGet(this,_editNoteTextArea).value=[e,separator,_classPrivateFieldGet(this,_footer)].join("");}}],[{key:"withFooterFromGMInfo",value:function(){var t=GM_info.script;return new e("".concat(t.name," ").concat(t.version,"\n").concat(t.namespace))}}]),e}();function _removePreviousFooter2(){var e=this,t=_classPrivateFieldGet(this,_editNoteTextArea).value.split(separator).filter((function(t){return t.trim()!==_classPrivateFieldGet(e,_footer)}));_classPrivateFieldGet(this,_editNoteTextArea).value=t.join(separator);}function splitDomain(e){var t=e.split("."),r=-2;return ["org","co","com"].includes(t.at(-2))&&(r=-3),t.slice(0,r).concat([t.slice(r).join(".")])}var _map=new WeakMap,_insertLeaf=new WeakSet,_insertInternal=new WeakSet,_insert=new WeakSet,_retrieveLeaf=new WeakSet,_retrieveInternal=new WeakSet,_retrieve=new WeakSet,DispatchMap=function(){function e(){_classCallCheck(this,e),_classPrivateMethodInitSpec(this,_retrieve),_classPrivateMethodInitSpec(this,_retrieveInternal),_classPrivateMethodInitSpec(this,_retrieveLeaf),_classPrivateMethodInitSpec(this,_insert),_classPrivateMethodInitSpec(this,_insertInternal),_classPrivateMethodInitSpec(this,_insertLeaf),_classPrivateFieldInitSpec(this,_map,{writable:!0,value:new Map});}return _createClass(e,[{key:"set",value:function(e,t){var r=splitDomain(e);if("*"===e||r[0].includes("*")&&"*"!==r[0]||r.slice(1).some((function(e){return e.includes("*")})))throw new Error("Invalid pattern: "+e);return _classPrivateMethodGet(this,_insert,_insert2).call(this,r.slice().reverse(),t),this}},{key:"get",value:function(e){return _classPrivateMethodGet(this,_retrieve,_retrieve2).call(this,splitDomain(e).slice().reverse())}},{key:"_get",value:function(e){return _classPrivateFieldGet(this,_map).get(e)}},{key:"_set",value:function(e,t){return _classPrivateFieldGet(this,_map).set(e,t),this}}]),e}();function _insertLeaf2(e,t){var r=this._get(e);r?(assert(r instanceof DispatchMap&&!_classPrivateFieldGet(r,_map).has(""),"Duplicate leaf!"),r._set("",t)):this._set(e,t);}function _insertInternal2(e,t){var r,a,s=e[0],n=this._get(s);n instanceof DispatchMap?a=n:(a=new DispatchMap,this._set(s,a),void 0!==n&&a._set("",n)),_classPrivateMethodGet(r=a,_insert,_insert2).call(r,e.slice(1),t);}function _insert2(e,t){e.length>1?_classPrivateMethodGet(this,_insertInternal,_insertInternal2).call(this,e,t):(assert(1===e.length,"Empty domain parts?!"),_classPrivateMethodGet(this,_insertLeaf,_insertLeaf2).call(this,e[0],t));}function _retrieveLeaf2(e){var t=this._get(e);if(t instanceof DispatchMap){var r=t._get("");void 0===r&&(r=t._get("*")),t=r;}return t}function _retrieveInternal2(e){var t=this._get(e[0]);if(t instanceof DispatchMap)return _classPrivateMethodGet(t,_retrieve,_retrieve2).call(t,e.slice(1))}function _retrieve2(e){var t;return void 0===(t=1===e.length?_classPrivateMethodGet(this,_retrieveLeaf,_retrieveLeaf2).call(this,e[0]):_classPrivateMethodGet(this,_retrieveInternal,_retrieveInternal2).call(this,e))&&(t=this._get("*")),t}function createPersistentCheckbox(e,t,r){return [function(){var t=document.createElement("input");return t.setAttribute("type","checkbox"),t.setAttribute("id",e),t.addEventListener("change",(function(t){t.currentTarget.checked?localStorage.setItem(e,"delete_to_disable"):localStorage.removeItem(e),r(t);})),t.setAttribute("defaultChecked",!!localStorage.getItem(e)),t}.call(this),function(){var r=document.createElement("label");return r.setAttribute("for",e),appendChildren(r,t),r}.call(this)]}function retryTimes(e,t,r){return _retryTimes.apply(this,arguments)}function _retryTimes(){return (_retryTimes=_asyncToGenerator(regenerator.mark((function e(t,r,a){return regenerator.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!(r<=0)){e.next=2;break}return e.abrupt("return",Promise.reject(new TypeError("Invalid number of retry times: "+r)));case 2:return e.abrupt("return",new Promise((function(e,s){function n(){try{e(t());}catch(a){if(--r>0)return;s(a);}clearInterval(i);}var i=setInterval(n,a);n();})));case 3:case"end":return e.stop()}}),e)})))).apply(this,arguments)}

  var USERSCRIPT_NAME = "mb_enhanced_cover_art_uploads";

  // TODO: This originates from mb_caa_dimensions but is also used here. Not sure
  // where to put it. It might make sense to put it in the mb_caa_dimensions source
  // tree later on, and import it in this source tree where necessary.
  function getImageDimensions(url) {
    return new Promise(function (resolve, reject) {
      var done = false;

      function dimensionsLoaded(dimensions) {
        // Make sure we don't poll again, it's not necessary.
        clearInterval(interval);

        if (!done) {
          // Prevent resolving twice.
          resolve(dimensions);
          done = true;
          img.src = ''; // Cancel loading the image
        }
      }

      function dimensionsFailed() {
        clearInterval(interval);

        if (!done) {
          done = true;
          reject();
        }
      }

      var img = document.createElement('img');
      img.addEventListener('load', function () {
        dimensionsLoaded({
          height: img.naturalHeight,
          width: img.naturalWidth
        });
      });
      img.addEventListener('error', dimensionsFailed); // onload and onerror are asynchronous, so this interval should have
      // already been set before they are called.

      var interval = window.setInterval(function () {
        if (img.naturalHeight) {
          // naturalHeight will be non-zero as soon as enough of the image
          // is loaded to determine its dimensions.
          dimensionsLoaded({
            height: img.naturalHeight,
            width: img.naturalWidth
          });
        }
      }, 50); // Start loading the image

      img.src = url;
    });
  }

  function encodeValue(value) {
    if (value instanceof URL) return value.href;
    if (typeof value === 'string') return value;
    return JSON.stringify(value);
  }

  function decodeSingleKeyValue(key, value, images) {
    var _key$match;

    var keyName = key.split('.').at(-1);
    var imageIdxString = (_key$match = key.match(/x_seed\.image\.(\d+)\./)) === null || _key$match === void 0 ? void 0 : _key$match[1];

    if (!imageIdxString || !['url', 'types', 'comment'].includes(keyName)) {
      throw new Error("Unsupported seeded key: ".concat(key));
    }

    var imageIdx = parseInt(imageIdxString);

    if (!images[imageIdx]) {
      images[imageIdx] = {};
    }

    if (keyName === 'url') {
      images[imageIdx].url = new URL(value);
    } else if (keyName === 'types') {
      var types = safeParseJSON(value);

      if (!Array.isArray(types) || types.some(function (type) {
        return typeof type !== 'number';
      })) {
        throw new Error("Invalid 'types' parameter: ".concat(value));
      }

      images[imageIdx].types = types;
    } else {
      images[imageIdx].comment = value;
    }
  }

  var SeedParameters = /*#__PURE__*/function () {
    function SeedParameters(images, origin) {
      _classCallCheck(this, SeedParameters);

      _defineProperty(this, "images", void 0);

      _defineProperty(this, "origin", void 0);

      this.images = images !== null && images !== void 0 ? images : [];
      this.origin = origin;
    }

    _createClass(SeedParameters, [{
      key: "addImage",
      value: function addImage(image) {
        this.images.push(image);
      }
    }, {
      key: "encode",
      value: function encode() {
        var seedParams = new URLSearchParams(this.images.flatMap(function (image, index) {
          return Object.entries(image).map(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2),
                key = _ref2[0],
                value = _ref2[1];

            return ["x_seed.image.".concat(index, ".").concat(key), encodeValue(value)];
          });
        }));

        if (this.origin) {
          seedParams.append('x_seed.origin', this.origin);
        }

        return seedParams;
      }
    }, {
      key: "createSeedURL",
      value: function createSeedURL(releaseId) {
        return "https://musicbrainz.org/release/".concat(releaseId, "/add-cover-art?").concat(this.encode());
      }
    }], [{
      key: "decode",
      value: function decode(seedParams) {
        var _seedParams$get;

        var images = [];
        seedParams.forEach(function (value, key) {
          // only image parameters can be decoded to cover art images
          if (!key.startsWith('x_seed.image.')) return;

          try {
            decodeSingleKeyValue(key, value, images);
          } catch (err) {
            LOGGER.error("Invalid image seeding param ".concat(key, "=").concat(value), err);
          }
        }); // Sanity checks: Make sure all images have at least a URL, and condense
        // the array in case indices are missing.

        images = images.filter(function (image, index) {
          // URL could be undefined if it either was never given as a param,
          // or if it was invalid.
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          if (image.url) {
            return true;
          } else {
            LOGGER.warn("Ignoring seeded image ".concat(index, ": No URL provided"));
            return false;
          }
        });
        var origin = (_seedParams$get = seedParams.get('x_seed.origin')) !== null && _seedParams$get !== void 0 ? _seedParams$get : undefined;
        return new SeedParameters(images, origin);
      }
    }]);

    return SeedParameters;
  }();

  var AtisketSeeder = {
      supportedDomains: ['atisket.pulsewidth.org.uk'],
      supportedRegexes: [/\.uk\/\?.+/],
      insertSeedLinks: function insertSeedLinks() {
          var _qs$textContent$trim, _qs$textContent, _cachedAnchor$href;
          var alreadyInMB = qsMaybe('.already-in-mb-item');
          if (alreadyInMB === null) {
              return;
          }
          var mbid = (_qs$textContent$trim = (_qs$textContent = qs('a.mb', alreadyInMB).textContent) === null || _qs$textContent === void 0 ? void 0 : _qs$textContent.trim()) !== null && _qs$textContent$trim !== void 0 ? _qs$textContent$trim : '';
          var cachedAnchor = qsMaybe('#submit-button + div > a');
          addSeedLinkToCovers(mbid, (_cachedAnchor$href = cachedAnchor === null || cachedAnchor === void 0 ? void 0 : cachedAnchor.href) !== null && _cachedAnchor$href !== void 0 ? _cachedAnchor$href : document.location.href);
      }
  };
  var AtasketSeeder = {
      supportedDomains: ['atisket.pulsewidth.org.uk'],
      supportedRegexes: [/\.uk\/atasket\.php\?/],
      insertSeedLinks: function insertSeedLinks() {
          var urlParams = new URLSearchParams(document.location.search);
          var mbid = urlParams.get('release_mbid');
          var selfId = urlParams.get('self_id');
          if (!mbid || !selfId) {
              LOGGER.error('Cannot extract IDs! Seeding is disabled :(');
              return;
          }
          var cachedUrl = document.location.origin + '/?cached=' + selfId;
          addSeedLinkToCovers(mbid, cachedUrl);
      }
  };
  function addSeedLinkToCovers(mbid, origin) {
      qsa('figure.cover').forEach(function (fig) {
          addSeedLinkToCover(fig, mbid, origin);
      });
  }
  function addSeedLinkToCover(_x, _x2, _x3) {
      return _addSeedLinkToCover.apply(this, arguments);
  }
  function _addSeedLinkToCover() {
      _addSeedLinkToCover = _asyncToGenerator(regenerator.mark(function _callee(fig, mbid, origin) {
          var _imageUrl$match, _fig$closest, _qs$insertAdjacentEle;
          var imageUrl, ext, imageDimensions, dimensionStr, countryCode, vendorId, vendorCode, releaseUrl, params, seedUrl, dimSpan, seedLink;
          return regenerator.wrap(function _callee$(_context) {
              while (1) {
                  switch (_context.prev = _context.next) {
                  case 0:
                      imageUrl = qs('a.icon', fig).href;
                      ext = (_imageUrl$match = imageUrl.match(/\.(\w+)$/)) === null || _imageUrl$match === void 0 ? void 0 : _imageUrl$match[1];
                      _context.next = 4;
                      return getImageDimensions(imageUrl);
                  case 4:
                      imageDimensions = _context.sent;
                      dimensionStr = ''.concat(imageDimensions.width, 'x').concat(imageDimensions.height);
                      countryCode = (_fig$closest = fig.closest('div')) === null || _fig$closest === void 0 ? void 0 : _fig$closest.getAttribute('data-matched-country');
                      vendorId = fig.getAttribute('data-vendor-id');
                      vendorCode = _toConsumableArray(fig.classList).find(function (klass) {
                          return [
                              'spf',
                              'deez',
                              'itu'
                          ].includes(klass);
                      });
                      if (!(!vendorCode || !vendorId || typeof countryCode !== 'string' || vendorCode === 'itu' && countryCode === '')) {
                          _context.next = 12;
                          break;
                      }
                      LOGGER.error('Could not extract required data for ' + fig.classList.value);
                      return _context.abrupt('return');
                  case 12:
                      releaseUrl = RELEASE_URL_CONSTRUCTORS[vendorCode](vendorId, countryCode);
                      params = new SeedParameters([{ url: new URL(releaseUrl) }], origin);
                      seedUrl = params.createSeedURL(mbid);
                      dimSpan = function () {
                          var $$a = document.createElement('span');
                          setStyles($$a, { display: 'block' });
                          appendChildren($$a, dimensionStr + (ext ? ' '.concat(ext.toUpperCase()) : ''));
                          return $$a;
                      }.call(this);
                      seedLink = function () {
                          var $$c = document.createElement('a');
                          $$c.setAttribute('href', seedUrl);
                          setStyles($$c, { display: 'block' });
                          var $$d = document.createTextNode('\n        Add to release\n    ');
                          $$c.appendChild($$d);
                          return $$c;
                      }.call(this);
                      (_qs$insertAdjacentEle = qs('figcaption > a', fig).insertAdjacentElement('afterend', dimSpan)) === null || _qs$insertAdjacentEle === void 0 ? void 0 : _qs$insertAdjacentEle.insertAdjacentElement('afterend', seedLink);
                  case 18:
                  case 'end':
                      return _context.stop();
                  }
              }
          }, _callee);
      }));
      return _addSeedLinkToCover.apply(this, arguments);
  }
  var RELEASE_URL_CONSTRUCTORS = {
      itu: function itu(id, country) {
          return 'https://music.apple.com/'.concat(country.toLowerCase(), '/album/').concat(id);
      },
      deez: function deez(id) {
          return 'https://www.deezer.com/album/' + id;
      },
      spf: function spf(id) {
          return 'https://open.spotify.com/album/' + id;
      }
  };

  function seederSupportsURL(seeder, url) {
    return seeder.supportedDomains.includes(url.hostname.replace(/^www\./, '')) && seeder.supportedRegexes.some(function (rgx) {
      return rgx.test(url.href);
    });
  }
  var SEEDER_DISPATCH_MAP = new Map();
  function registerSeeder(seeder) {
    seeder.supportedDomains.forEach(function (domain) {
      if (!SEEDER_DISPATCH_MAP.has(domain)) {
        SEEDER_DISPATCH_MAP.set(domain, []);
      } // Optional chaining is unnecessary overhead, we just created the entry above
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion


      SEEDER_DISPATCH_MAP.get(domain).push(seeder);
    });
  }
  function seederFactory(url) {
    var _SEEDER_DISPATCH_MAP$;

    return (_SEEDER_DISPATCH_MAP$ = SEEDER_DISPATCH_MAP.get(url.hostname.replace(/^www\./, ''))) === null || _SEEDER_DISPATCH_MAP$ === void 0 ? void 0 : _SEEDER_DISPATCH_MAP$.find(function (seeder) {
      return seederSupportsURL(seeder, url);
    });
  }

  var _createTrackImageComment = /*#__PURE__*/new WeakSet();

  var CoverArtProvider = /*#__PURE__*/function () {
    function CoverArtProvider() {
      _classCallCheck(this, CoverArtProvider);

      _classPrivateMethodInitSpec(this, _createTrackImageComment);

      _defineProperty(this, "supportedDomains", void 0);

      _defineProperty(this, "name", void 0);

      _defineProperty(this, "urlRegex", void 0);

      _defineProperty(this, "allowButtons", true);
    }

    _createClass(CoverArtProvider, [{
      key: "cleanUrl",
      value:
      /**
       * Returns a clean version of the given URL.
       * This version should be used to match against `urlRegex`.
       */
      function cleanUrl(url) {
        return url.host + url.pathname;
      }
      /**
       * Check whether the provider supports the given URL.
       *
       * @param      {URL}    url     The provider URL.
       * @return     {boolean}  Whether images can be extracted for this URL.
       */

    }, {
      key: "supportsUrl",
      value: function supportsUrl(url) {
        var _this = this;

        if (Array.isArray(this.urlRegex)) {
          return this.urlRegex.some(function (regex) {
            return regex.test(_this.cleanUrl(url));
          });
        }

        return this.urlRegex.test(this.cleanUrl(url));
      }
      /**
       * Extract ID from a release URL.
       */

    }, {
      key: "extractId",
      value: function extractId(url) {
        var _this2 = this;

        if (!Array.isArray(this.urlRegex)) {
          var _this$cleanUrl$match;

          return (_this$cleanUrl$match = this.cleanUrl(url).match(this.urlRegex)) === null || _this$cleanUrl$match === void 0 ? void 0 : _this$cleanUrl$match[1];
        }

        return this.urlRegex.map(function (regex) {
          var _this2$cleanUrl$match;

          return (_this2$cleanUrl$match = _this2.cleanUrl(url).match(regex)) === null || _this2$cleanUrl$match === void 0 ? void 0 : _this2$cleanUrl$match[1];
        }).find(function (id) {
          return typeof id !== 'undefined';
        });
      }
      /**
       * Check whether a redirect is safe, i.e. both URLs point towards the same
       * release.
       */

    }, {
      key: "isSafeRedirect",
      value: function isSafeRedirect(originalUrl, redirectedUrl) {
        var id = this.extractId(originalUrl);
        return !!id && id === this.extractId(redirectedUrl);
      }
    }, {
      key: "fetchPage",
      value: function () {
        var _fetchPage = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(url) {
          var resp;
          return regenerator.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return gmxhr(url);

                case 2:
                  resp = _context.sent;

                  if (!(resp.finalUrl !== url.href && !this.isSafeRedirect(url, new URL(resp.finalUrl)))) {
                    _context.next = 5;
                    break;
                  }

                  throw new Error("Refusing to extract images from ".concat(this.name, " provider because the original URL redirected to ").concat(resp.finalUrl, ", which may be a different release. If this redirected URL is correct, please retry with ").concat(resp.finalUrl, " directly."));

                case 5:
                  return _context.abrupt("return", resp.responseText);

                case 6:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function fetchPage(_x) {
          return _fetchPage.apply(this, arguments);
        }

        return fetchPage;
      }()
    }, {
      key: "mergeTrackImages",
      value: function mergeTrackImages(trackImages, mainUrl) {
        var _this3 = this;

        var newTrackImages = filterNonNull(trackImages) // Filter out tracks that have the same image as the main release.
        .filter(function (img) {
          return img.url !== mainUrl;
        });
        var imgUrlToTrackNumber = groupBy(newTrackImages, function (el) {
          return el.url;
        }, function (el) {
          return el.trackNumber;
        });
        var results = [];
        imgUrlToTrackNumber.forEach(function (trackNumbers, imgUrl) {
          results.push({
            url: new URL(imgUrl),
            types: [ArtworkTypeIDs.Track],
            // Use comment to indicate which tracks this applies to.
            comment: _classPrivateMethodGet(_this3, _createTrackImageComment, _createTrackImageComment2).call(_this3, trackNumbers)
          });
        });
        return results;
      }
    }]);

    return CoverArtProvider;
  }();

  function _createTrackImageComment2(trackNumbers) {
    var definedTrackNumbers = filterNonNull(trackNumbers);
    if (!definedTrackNumbers.length) return;
    var prefix = definedTrackNumbers.length === 1 ? 'Track' : 'Tracks';
    return "".concat(prefix, " ").concat(definedTrackNumbers.join(', '));
  }

  var ArtworkTypeIDs;

  (function (ArtworkTypeIDs) {
    ArtworkTypeIDs[ArtworkTypeIDs["Back"] = 2] = "Back";
    ArtworkTypeIDs[ArtworkTypeIDs["Booklet"] = 3] = "Booklet";
    ArtworkTypeIDs[ArtworkTypeIDs["Front"] = 1] = "Front";
    ArtworkTypeIDs[ArtworkTypeIDs["Liner"] = 12] = "Liner";
    ArtworkTypeIDs[ArtworkTypeIDs["Medium"] = 4] = "Medium";
    ArtworkTypeIDs[ArtworkTypeIDs["Obi"] = 5] = "Obi";
    ArtworkTypeIDs[ArtworkTypeIDs["Other"] = 8] = "Other";
    ArtworkTypeIDs[ArtworkTypeIDs["Poster"] = 11] = "Poster";
    ArtworkTypeIDs[ArtworkTypeIDs["Raw"] = 14] = "Raw";
    ArtworkTypeIDs[ArtworkTypeIDs["Spine"] = 6] = "Spine";
    ArtworkTypeIDs[ArtworkTypeIDs["Sticker"] = 10] = "Sticker";
    ArtworkTypeIDs[ArtworkTypeIDs["Track"] = 7] = "Track";
    ArtworkTypeIDs[ArtworkTypeIDs["Tray"] = 9] = "Tray";
    ArtworkTypeIDs[ArtworkTypeIDs["Watermark"] = 13] = "Watermark";
  })(ArtworkTypeIDs || (ArtworkTypeIDs = {}));

  var HeadMetaPropertyProvider = /*#__PURE__*/function (_CoverArtProvider) {
    _inherits(HeadMetaPropertyProvider, _CoverArtProvider);

    var _super = _createSuper(HeadMetaPropertyProvider);

    function HeadMetaPropertyProvider() {
      _classCallCheck(this, HeadMetaPropertyProvider);

      return _super.apply(this, arguments);
    }

    _createClass(HeadMetaPropertyProvider, [{
      key: "is404Page",
      value: // Providers for which the cover art can be retrieved from the head
      // og:image property and maximised using maxurl

      /**
       * Template method to be used by subclasses to check whether the document
       * indicates a missing release. This only needs to be implemented if the
       * provider returns success codes for releases which are 404.
       */
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      function is404Page(_document) {
        return false;
      }
    }, {
      key: "findImages",
      value: function () {
        var _findImages = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(url) {
          var respDocument, coverElmt;
          return regenerator.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.t0 = parseDOM;
                  _context2.next = 3;
                  return this.fetchPage(url);

                case 3:
                  _context2.t1 = _context2.sent;
                  _context2.t2 = url.href;
                  respDocument = (0, _context2.t0)(_context2.t1, _context2.t2);

                  if (!this.is404Page(respDocument)) {
                    _context2.next = 8;
                    break;
                  }

                  throw new Error(this.name + ' release does not exist');

                case 8:
                  coverElmt = qs('head > meta[property="og:image"]', respDocument);
                  return _context2.abrupt("return", [{
                    url: new URL(coverElmt.content),
                    types: [ArtworkTypeIDs.Front]
                  }]);

                case 10:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        }));

        function findImages(_x2) {
          return _findImages.apply(this, arguments);
        }

        return findImages;
      }()
    }]);

    return HeadMetaPropertyProvider;
  }(CoverArtProvider);

  function mapJacketType(caption) {
    if (!caption) {
      return {
        type: [ArtworkTypeIDs.Front, ArtworkTypeIDs.Back, ArtworkTypeIDs.Spine],
        comment: ''
      };
    }

    var types = [];
    var keywords = caption.split(/(?:,|\s|and|&)/i);
    var faceKeywords = ['front', 'back', 'spine'];

    var _faceKeywords$map = faceKeywords.map(function (faceKw) {
      return !!keywords // Case-insensitive .includes()
      .find(function (kw) {
        return kw.toLowerCase() === faceKw.toLowerCase();
      });
    }),
        _faceKeywords$map2 = _slicedToArray(_faceKeywords$map, 3),
        hasFront = _faceKeywords$map2[0],
        hasBack = _faceKeywords$map2[1],
        hasSpine = _faceKeywords$map2[2];

    if (hasFront) types.push(ArtworkTypeIDs.Front);
    if (hasBack) types.push(ArtworkTypeIDs.Back); // Assuming if the front and back are included, the spine is as well.

    if (hasSpine || hasFront && hasBack) types.push(ArtworkTypeIDs.Spine); // Copy anything other than 'front', 'back', or 'spine' to the comment

    var otherKeywords = keywords.filter(function (kw) {
      return !faceKeywords.includes(kw.toLowerCase());
    });
    var comment = otherKeywords.join(' ').trim();
    return {
      type: types,
      comment: comment
    };
  } // Keys: First word of the VGMdb caption (mostly structured), lower-cased
  // Values: Either MappedArtwork or a callable taking the remainder of the caption and returning MappedArtwork


  var __CAPTION_TYPE_MAPPING = {
    front: ArtworkTypeIDs.Front,
    booklet: ArtworkTypeIDs.Booklet,
    jacket: mapJacketType,
    // DVD jacket
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
    // Or poster?
    case: {
      type: ArtworkTypeIDs.Other,
      comment: 'Case'
    },
    contents: ArtworkTypeIDs.Raw
  };

  function convertMappingReturnValue(ret) {
    if (Object.prototype.hasOwnProperty.call(ret, 'type') && Object.prototype.hasOwnProperty.call(ret, 'comment')) {
      var retObj = ret;
      return {
        types: Array.isArray(retObj.type) ? retObj.type : [retObj.type],
        comment: retObj.comment
      };
    }

    var types = ret;
    /* istanbul ignore next: No mapper generates this currently */

    if (!Array.isArray(types)) {
      types = [types];
    }

    return {
      types: types,
      comment: ''
    };
  }

  var CAPTION_TYPE_MAPPING = {}; // Convert all definitions to a single signature for easier processing later on

  var _loop = function _loop() {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
        key = _Object$entries$_i[0],
        value = _Object$entries$_i[1];

    // Since value is a block-scoped const, the lambda will close over that
    // exact value. It wouldn't if it was a var, as `value` would in the end
    // only refer to the last value. Babel transpiles this correctly, so this
    // is safe.
    CAPTION_TYPE_MAPPING[key] = function (caption) {
      if (typeof value === 'function') {
        // Assume the function sets everything correctly, including the
        // comment
        return convertMappingReturnValue(value(caption));
      }

      var retObj = convertMappingReturnValue(value); // Add remainder of the caption to the comment returned by the mapping

      if (retObj.comment && caption) retObj.comment += ' ' + caption; // If there's a caption but no comment, set the comment to the caption
      else if (caption) retObj.comment = caption; // Otherwise there's a comment set by the mapper but no caption => keep,
      // or neither a comment nor a caption => nothing needs to be done.

      return retObj;
    };
  };

  for (var _i = 0, _Object$entries = Object.entries(__CAPTION_TYPE_MAPPING); _i < _Object$entries.length; _i++) {
    _loop();
  }

  function convertCaptions(cover) {
    var url = new URL(cover.url);

    if (!cover.caption) {
      return {
        url: url
      };
    }

    var _cover$caption$split = cover.caption.split(' '),
        _cover$caption$split2 = _toArray(_cover$caption$split),
        captionType = _cover$caption$split2[0],
        captionRestParts = _cover$caption$split2.slice(1);

    var captionRest = captionRestParts.join(' ');
    var mapper = CAPTION_TYPE_MAPPING[captionType.toLowerCase()];
    if (!mapper) return {
      url: url,
      comment: cover.caption
    };
    return _objectSpread2({
      url: url
    }, mapper(captionRest));
  }

  var _extractImages = /*#__PURE__*/new WeakSet();

  var VGMdbProvider = /*#__PURE__*/function (_CoverArtProvider) {
    _inherits(VGMdbProvider, _CoverArtProvider);

    var _super = _createSuper(VGMdbProvider);

    function VGMdbProvider() {
      var _this;

      _classCallCheck(this, VGMdbProvider);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));

      _classPrivateMethodInitSpec(_assertThisInitialized(_this), _extractImages);

      _defineProperty(_assertThisInitialized(_this), "supportedDomains", ['vgmdb.net']);

      _defineProperty(_assertThisInitialized(_this), "favicon", 'https://vgmdb.net/favicon.ico');

      _defineProperty(_assertThisInitialized(_this), "name", 'VGMdb');

      _defineProperty(_assertThisInitialized(_this), "urlRegex", /\/album\/(\d+)(?:\/|$)/);

      return _this;
    }

    _createClass(VGMdbProvider, [{
      key: "findImages",
      value: function () {
        var _findImages = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(url) {
          var id, apiUrl, apiResp, metadata;
          return regenerator.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  // Using the unofficial API at vgmdb.info
                  id = this.extractId(url);
                  assertHasValue(id);
                  apiUrl = "https://vgmdb.info/album/".concat(id, "?format=json");
                  _context.next = 5;
                  return gmxhr(apiUrl);

                case 5:
                  apiResp = _context.sent;
                  metadata = safeParseJSON(apiResp.responseText, 'Invalid JSON response from vgmdb.info API');
                  assert(metadata.link === 'album/' + id, "VGMdb.info returned wrong release: Requested album/".concat(id, ", got ").concat(metadata.link));
                  LOGGER.warn('Heads up! VGMdb requires you to be logged in to view all images, some images may have been missed. If you have an account, please go to the album on VGMdb and use the seeding functionality to add the missing images.');
                  return _context.abrupt("return", _classPrivateMethodGet(this, _extractImages, _extractImages2).call(this, metadata));

                case 10:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function findImages(_x) {
          return _findImages.apply(this, arguments);
        }

        return findImages;
      }()
    }]);

    return VGMdbProvider;
  }(CoverArtProvider);

  function _extractImages2(metadata) {
    var covers = metadata.covers.map(function (cover) {
      return {
        url: cover.full,
        caption: cover.name
      };
    });

    if (metadata.picture_full && !covers.find(function (cover) {
      return cover.url === metadata.picture_full;
    })) {
      // Assuming the main picture is the front cover
      covers.unshift({
        url: metadata.picture_full,
        caption: 'Front'
      });
    }

    return covers.map(convertCaptions);
  }

  var VGMdbSeeder = {
      supportedDomains: ['vgmdb.net'],
      supportedRegexes: [/\/album\/(\d+)(?:\/|#|\?|$)/],
      insertSeedLinks: function insertSeedLinks() {
          var _qsMaybe;
          if (!isLoggedIn()) {
              return;
          }
          var coverHeading = (_qsMaybe = qsMaybe('#covernav')) === null || _qsMaybe === void 0 ? void 0 : _qsMaybe.parentElement;
          if (!coverHeading) {
              LOGGER.info('No covers in release, not inserting seeding menu');
              return;
          }
          var releaseIdsProm = getMBReleases();
          var coversProm = extractCovers(coverHeading);
          Promise.all([
              releaseIdsProm,
              coversProm
          ]).then(function (_ref) {
              var _ref2 = _slicedToArray(_ref, 2), releaseIds = _ref2[0], covers = _ref2[1];
              insertSeedButtons(coverHeading, releaseIds, covers);
          });
      }
  };
  function isLoggedIn() {
      return qsMaybe('#navmember') !== null;
  }
  function getMBReleases() {
      var releaseUrl = 'https://vgmdb.net' + document.location.pathname;
      return getReleaseIDsForURL(releaseUrl);
  }
  function extractCovers(_x) {
      return _extractCovers.apply(this, arguments);
  }
  function _extractCovers() {
      _extractCovers = _asyncToGenerator(regenerator.mark(function _callee(coverHeading) {
          var coverDiv, coverElements, covers, publicCoverURLs, result;
          return regenerator.wrap(function _callee$(_context) {
              while (1) {
                  switch (_context.prev = _context.next) {
                  case 0:
                      coverDiv = coverHeading.parentElement;
                      assertHasValue(coverDiv);
                      coverElements = qsa('#cover_gallery a[id*="thumb_"]', coverDiv);
                      covers = coverElements.map(extractCoverFromAnchor);
                      _context.t0 = Set;
                      _context.next = 7;
                      return new VGMdbProvider().findImages(new URL(document.location.href));
                  case 7:
                      _context.t1 = _context.sent.map(function (cover) {
                          return cover.url.href;
                      });
                      publicCoverURLs = new _context.t0(_context.t1);
                      result = {
                          allCovers: covers,
                          privateCovers: covers.filter(function (cover) {
                              return !publicCoverURLs.has(cover.url.href);
                          })
                      };
                      return _context.abrupt('return', result);
                  case 11:
                  case 'end':
                      return _context.stop();
                  }
              }
          }, _callee);
      }));
      return _extractCovers.apply(this, arguments);
  }
  function extractCoverFromAnchor(anchor) {
      var _qs$textContent;
      return convertCaptions({
          url: anchor.href,
          caption: (_qs$textContent = qs('.label', anchor).textContent) !== null && _qs$textContent !== void 0 ? _qs$textContent : ''
      });
  }
  function insertSeedButtons(coverHeading, releaseIds, covers) {
      var _coverHeading$nextEle;
      var seedParamsPrivate = new SeedParameters(covers.privateCovers, document.location.href);
      var seedParamsAll = new SeedParameters(covers.allCovers, document.location.href);
      var relIdToAnchors = new Map(releaseIds.map(function (relId) {
          var a = function () {
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
      var anchors = _toConsumableArray(relIdToAnchors.values());
      var inclPublicCheckbox = function () {
          var $$c = document.createElement('input');
          $$c.setAttribute('type', 'checkbox');
          $$c.setAttribute('id', 'ROpdebee_incl_public_checkbox');
          $$c.addEventListener('change', function (evt) {
              relIdToAnchors.forEach(function (a, relId) {
                  if (evt.currentTarget.checked) {
                      a.href = seedParamsAll.createSeedURL(relId);
                  } else {
                      a.href = seedParamsPrivate.createSeedURL(relId);
                  }
              });
          });
          return $$c;
      }.call(this);
      var inclPublicLabel = function () {
          var $$d = document.createElement('label');
          $$d.setAttribute('for', 'ROpdebee_incl_public_checkbox');
          $$d.setAttribute('title', 'Leave this unchecked to only seed covers which cannot be extracted by the VGMdb provider');
          setStyles($$d, { cursor: 'help' });
          var $$e = document.createTextNode('Include publicly accessible covers');
          $$d.appendChild($$e);
          return $$d;
      }.call(this);
      var containedElements = [
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
      var container = function () {
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

  /* istanbul ignore file: Imports TSX, covered by E2E */
  registerSeeder(AtisketSeeder);
  registerSeeder(AtasketSeeder);
  registerSeeder(VGMdbSeeder);

  // we can also grab it from the <head> element metadata, which is a lot less
  // effort, and we get the added benefit of redirect safety.

  var SevenDigitalProvider = /*#__PURE__*/function (_HeadMetaPropertyProv) {
    _inherits(SevenDigitalProvider, _HeadMetaPropertyProv);

    var _super = _createSuper(SevenDigitalProvider);

    function SevenDigitalProvider() {
      var _this;

      _classCallCheck(this, SevenDigitalProvider);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));

      _defineProperty(_assertThisInitialized(_this), "supportedDomains", ['*.7digital.com']);

      _defineProperty(_assertThisInitialized(_this), "favicon", 'https://css-cdn.7digital.com/static/build/images/favicons/7digital/touch-ipad-retina.png');

      _defineProperty(_assertThisInitialized(_this), "name", '7digital');

      _defineProperty(_assertThisInitialized(_this), "urlRegex", /release\/.*-(\d+)(?:\/|$)/);

      return _this;
    }

    return SevenDigitalProvider;
  }(HeadMetaPropertyProvider);

  var PLACEHOLDER_IMG_REGEX = /01RmK(?:\+|%2B)J4pJL/; // Incomplete, only what we need

  var VARIANT_TYPE_MAPPING = {
    MAIN: ArtworkTypeIDs.Front,
    FRNT: ArtworkTypeIDs.Front,
    // not seen in use so far, usually MAIN is used for front covers
    BACK: ArtworkTypeIDs.Back,
    SIDE: ArtworkTypeIDs.Spine // not seen in use so far
    // PT01: ArtworkTypeIDs.Other,
    // See https://sellercentral.amazon.com/gp/help/external/JV4FNMT7563SF5F for further details

  };

  var _extractFrontCover = /*#__PURE__*/new WeakSet();

  var _convertVariant = /*#__PURE__*/new WeakSet();

  var AmazonProvider = /*#__PURE__*/function (_CoverArtProvider) {
    _inherits(AmazonProvider, _CoverArtProvider);

    var _super = _createSuper(AmazonProvider);

    function AmazonProvider() {
      var _this;

      _classCallCheck(this, AmazonProvider);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));

      _classPrivateMethodInitSpec(_assertThisInitialized(_this), _convertVariant);

      _classPrivateMethodInitSpec(_assertThisInitialized(_this), _extractFrontCover);

      _defineProperty(_assertThisInitialized(_this), "supportedDomains", ['amazon.ae', 'amazon.ca', 'amazon.cn', 'amazon.de', 'amazon.eg', 'amazon.es', 'amazon.fr', 'amazon.in', 'amazon.it', 'amazon.jp', 'amazon.nl', 'amazon.pl', 'amazon.sa', 'amazon.se', 'amazon.sg', 'amazon.co.jp', 'amazon.co.uk', 'amazon.com', 'amazon.com.au', 'amazon.com.br', 'amazon.com.mx', 'amazon.com.tr']);

      _defineProperty(_assertThisInitialized(_this), "name", 'Amazon');

      _defineProperty(_assertThisInitialized(_this), "urlRegex", /\/(?:gp\/product|dp)\/([A-Za-z0-9]{10})(?:\/|$)/);

      return _this;
    }

    _createClass(AmazonProvider, [{
      key: "favicon",
      get: // Favicon URL is blocked by Firefox' Enhanced Tracking Protection
      function get() {
        return GM_getResourceURL('amazonFavicon');
      }
    }, {
      key: "findImages",
      value: function () {
        var _findImages = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(url) {
          var pageContent, pageDom, frontCover, covers, _this$extractFromEmbe;

          return regenerator.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return this.fetchPage(url);

                case 2:
                  pageContent = _context.sent;
                  pageDom = parseDOM(pageContent, url.href); // Look for products which only have a single image, the front cover.

                  frontCover = _classPrivateMethodGet(this, _extractFrontCover, _extractFrontCover2).call(this, pageDom);

                  if (!frontCover) {
                    _context.next = 7;
                    break;
                  }

                  return _context.abrupt("return", [frontCover]);

                case 7:
                  // For physical products we have to extract the embedded JS from the
                  // page source to get all images in their highest available resolution.
                  covers = this.extractFromEmbeddedJS(pageContent);

                  if (!covers) {
                    // Use the (smaller) image thumbnails in the sidebar as a fallback,
                    // although it might not contain all of them. IMU will maximise,
                    // but the results are still inferior to the embedded hires images.
                    covers = this.extractFromThumbnailSidebar(pageDom);
                  }

                  if (!covers.length) {
                    // Handle physical audiobooks, the above extractors fail for those.
                    LOGGER.warn('Found no release images, trying to find an Amazon (audio)book gallery…');
                    covers = (_this$extractFromEmbe = this.extractFromEmbeddedJSGallery(pageContent)) !== null && _this$extractFromEmbe !== void 0 ? _this$extractFromEmbe :
                    /* istanbul ignore next: Should never happen */
                    [];
                  } // Filter out placeholder images.


                  return _context.abrupt("return", covers.filter(function (img) {
                    return !PLACEHOLDER_IMG_REGEX.test(img.url.href);
                  }));

                case 11:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function findImages(_x) {
          return _findImages.apply(this, arguments);
        }

        return findImages;
      }()
    }, {
      key: "extractFromEmbeddedJS",
      value: function extractFromEmbeddedJS(pageContent) {
        var _pageContent$match,
            _this2 = this;

        var embeddedImages = (_pageContent$match = pageContent.match(/^'colorImages': { 'initial': (.+)},$/m)) === null || _pageContent$match === void 0 ? void 0 : _pageContent$match[1];

        if (!embeddedImages) {
          LOGGER.warn('Failed to extract Amazon images from the embedded JS, falling back to thumbnails');
          return;
        }

        var imgs = safeParseJSON(embeddedImages);

        if (!Array.isArray(imgs)) {
          LOGGER.error("Failed to parse Amazon's embedded JS, falling back to thumbnails");
          return;
        }

        return imgs.map(function (img) {
          var _img$hiRes;

          // `img.hiRes` is probably only `null` when `img.large` is the placeholder image?
          return _classPrivateMethodGet(_this2, _convertVariant, _convertVariant2).call(_this2, {
            url: (_img$hiRes = img.hiRes) !== null && _img$hiRes !== void 0 ? _img$hiRes : img.large,
            variant: img.variant
          });
        });
      }
    }, {
      key: "extractFromEmbeddedJSGallery",
      value: function extractFromEmbeddedJSGallery(pageContent) {
        var _pageContent$match2;

        var embeddedGallery = (_pageContent$match2 = pageContent.match(/^'imageGalleryData' : (.+),$/m)) === null || _pageContent$match2 === void 0 ? void 0 : _pageContent$match2[1];

        if (!embeddedGallery) {
          LOGGER.warn('Failed to extract Amazon images from the embedded JS (audio)book gallery');
          return;
        }

        var imgs = safeParseJSON(embeddedGallery);

        if (!Array.isArray(imgs)) {
          LOGGER.error("Failed to parse Amazon's embedded JS (audio)book gallery");
          return;
        } // Amazon embeds no image variants on these pages, so we don't know the types


        return imgs.map(function (img) {
          return {
            url: new URL(img.mainUrl)
          };
        });
      }
    }, {
      key: "extractFromThumbnailSidebar",
      value: function extractFromThumbnailSidebar(pageDom) {
        var _this3 = this;

        var imgs = qsa('#altImages img', pageDom);
        return imgs.map(function (img) {
          var _img$closest, _safeParseJSON;

          var dataThumbAction = (_img$closest = img.closest('span[data-thumb-action]')) === null || _img$closest === void 0 ? void 0 : _img$closest.getAttribute('data-thumb-action');
          var variant = dataThumbAction && ((_safeParseJSON = safeParseJSON(dataThumbAction)) === null || _safeParseJSON === void 0 ? void 0 : _safeParseJSON.variant);
          /* istanbul ignore if: Difficult to exercise */

          if (!variant) {
            LOGGER.warn('Failed to extract the Amazon image variant code from the JSON attribute');
          }

          return _classPrivateMethodGet(_this3, _convertVariant, _convertVariant2).call(_this3, {
            url: img.src,
            variant: variant
          });
        });
      }
    }]);

    return AmazonProvider;
  }(CoverArtProvider);

  function _extractFrontCover2(pageDom) {
    var frontCoverSelectors = ['#digitalMusicProductImage_feature_div > img', // Streaming/MP3 products
    'img#main-image' // Audible products
    ];

    for (var _i = 0, _frontCoverSelectors = frontCoverSelectors; _i < _frontCoverSelectors.length; _i++) {
      var selector = _frontCoverSelectors[_i];
      var productImage = qsMaybe(selector, pageDom);

      if (productImage) {
        // Only returning the thumbnail, IMU will maximise
        return {
          url: new URL(productImage.src),
          types: [ArtworkTypeIDs.Front]
        };
      }
    } // Different product type (or no image found)


    return;
  }

  function _convertVariant2(cover) {
    var url = new URL(cover.url);
    var type = cover.variant && VARIANT_TYPE_MAPPING[cover.variant];
    LOGGER.debug("".concat(url.href, " has the Amazon image variant code '").concat(cover.variant, "'"));

    if (type) {
      return {
        url: url,
        types: [type]
      };
    }

    return {
      url: url
    };
  }

  var AmazonMusicProvider = /*#__PURE__*/function (_CoverArtProvider) {
    _inherits(AmazonMusicProvider, _CoverArtProvider);

    var _super = _createSuper(AmazonMusicProvider);

    function AmazonMusicProvider() {
      var _this;

      _classCallCheck(this, AmazonMusicProvider);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));

      _defineProperty(_assertThisInitialized(_this), "supportedDomains", ['music.amazon.ca', 'music.amazon.de', 'music.amazon.es', 'music.amazon.fr', 'music.amazon.in', 'music.amazon.it', 'music.amazon.co.jp', 'music.amazon.co.uk', 'music.amazon.com', 'music.amazon.com.au', 'music.amazon.com.br', 'music.amazon.com.mx']);

      _defineProperty(_assertThisInitialized(_this), "favicon", 'https://d5fx445wy2wpk.cloudfront.net/icons/amznMusic_favicon.png');

      _defineProperty(_assertThisInitialized(_this), "name", 'Amazon Music');

      _defineProperty(_assertThisInitialized(_this), "urlRegex", /\/albums\/([A-Za-z0-9]{10})(?:\/|$)/);

      return _this;
    }

    _createClass(AmazonMusicProvider, [{
      key: "findImages",
      value: function () {
        var _findImages = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(url) {
          var asin, productUrl;
          return regenerator.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  // Translate Amazon Music to Amazon product links. The cover art should
                  // be the same, but extracting the cover art from Amazon Music requires
                  // complex API requests with CSRF tokens, whereas product pages are much
                  // easier. Besides, cover art on product pages tends to be larger.
                  // NOTE: I'm not 100% certain the images are always identical, or that
                  // the associated product always exists.
                  asin = this.extractId(url);
                  assertHasValue(asin);
                  productUrl = new URL(url.href);
                  productUrl.hostname = productUrl.hostname.replace(/^music\./, '');
                  productUrl.pathname = '/dp/' + asin;
                  return _context.abrupt("return", new AmazonProvider().findImages(productUrl));

                case 6:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function findImages(_x) {
          return _findImages.apply(this, arguments);
        }

        return findImages;
      }()
    }]);

    return AmazonMusicProvider;
  }(CoverArtProvider);

  var AppleMusicProvider = /*#__PURE__*/function (_HeadMetaPropertyProv) {
    _inherits(AppleMusicProvider, _HeadMetaPropertyProv);

    var _super = _createSuper(AppleMusicProvider);

    function AppleMusicProvider() {
      var _this;

      _classCallCheck(this, AppleMusicProvider);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));

      _defineProperty(_assertThisInitialized(_this), "supportedDomains", ['music.apple.com', 'itunes.apple.com']);

      _defineProperty(_assertThisInitialized(_this), "favicon", 'https://music.apple.com/favicon.ico');

      _defineProperty(_assertThisInitialized(_this), "name", 'Apple Music');

      _defineProperty(_assertThisInitialized(_this), "urlRegex", /\w{2}\/album\/(?:.+\/)?(?:id)?(\d+)/);

      return _this;
    }

    _createClass(AppleMusicProvider, [{
      key: "is404Page",
      value: function is404Page(doc) {
        return qsMaybe('head > title', doc) === null;
      }
    }]);

    return AppleMusicProvider;
  }(HeadMetaPropertyProvider);

  var _extractCover = /*#__PURE__*/new WeakSet();

  var _findTrackImages = /*#__PURE__*/new WeakSet();

  var _findTrackImage = /*#__PURE__*/new WeakSet();

  var _amendSquareThumbnails = /*#__PURE__*/new WeakSet();

  var BandcampProvider = /*#__PURE__*/function (_CoverArtProvider) {
    _inherits(BandcampProvider, _CoverArtProvider);

    var _super = _createSuper(BandcampProvider);

    function BandcampProvider() {
      var _this;

      _classCallCheck(this, BandcampProvider);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));

      _classPrivateMethodInitSpec(_assertThisInitialized(_this), _amendSquareThumbnails);

      _classPrivateMethodInitSpec(_assertThisInitialized(_this), _findTrackImage);

      _classPrivateMethodInitSpec(_assertThisInitialized(_this), _findTrackImages);

      _classPrivateMethodInitSpec(_assertThisInitialized(_this), _extractCover);

      _defineProperty(_assertThisInitialized(_this), "supportedDomains", ['*.bandcamp.com']);

      _defineProperty(_assertThisInitialized(_this), "favicon", 'https://s4.bcbits.com/img/favicon/favicon-32x32.png');

      _defineProperty(_assertThisInitialized(_this), "name", 'Bandcamp');

      _defineProperty(_assertThisInitialized(_this), "urlRegex", /^(.+)\.bandcamp\.com\/(track|album)\/([^/]+)(?:\/|$)/);

      return _this;
    }

    _createClass(BandcampProvider, [{
      key: "extractId",
      value: function extractId(url) {
        var _this$cleanUrl$match, _this$cleanUrl$match$;

        return (_this$cleanUrl$match = this.cleanUrl(url).match(this.urlRegex)) === null || _this$cleanUrl$match === void 0 ? void 0 : (_this$cleanUrl$match$ = _this$cleanUrl$match.slice(1)) === null || _this$cleanUrl$match$ === void 0 ? void 0 : _this$cleanUrl$match$.join('/');
      }
    }, {
      key: "findImages",
      value: function () {
        var _findImages = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(url) {
          var onlyFront,
              respDocument,
              albumCoverUrl,
              covers,
              trackImages,
              _args = arguments;
          return regenerator.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  onlyFront = _args.length > 1 && _args[1] !== undefined ? _args[1] : false;
                  _context.t0 = parseDOM;
                  _context.next = 4;
                  return this.fetchPage(url);

                case 4:
                  _context.t1 = _context.sent;
                  _context.t2 = url.href;
                  respDocument = (0, _context.t0)(_context.t1, _context.t2);
                  albumCoverUrl = _classPrivateMethodGet(this, _extractCover, _extractCover2).call(this, respDocument);
                  covers = [];

                  if (albumCoverUrl) {
                    covers.push({
                      url: new URL(albumCoverUrl),
                      types: [ArtworkTypeIDs.Front]
                    });
                  } else {
                    // Release has no images. May still have track covers though.
                    LOGGER.warn('Bandcamp release has no cover');
                  } // Don't bother extracting track images if we only need the front cover


                  if (!onlyFront) {
                    _context.next = 14;
                    break;
                  }

                  _context.t3 = [];
                  _context.next = 17;
                  break;

                case 14:
                  _context.next = 16;
                  return _classPrivateMethodGet(this, _findTrackImages, _findTrackImages2).call(this, respDocument, albumCoverUrl);

                case 16:
                  _context.t3 = _context.sent;

                case 17:
                  trackImages = _context.t3;
                  return _context.abrupt("return", _classPrivateMethodGet(this, _amendSquareThumbnails, _amendSquareThumbnails2).call(this, covers.concat(trackImages)));

                case 19:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function findImages(_x) {
          return _findImages.apply(this, arguments);
        }

        return findImages;
      }()
    }]);

    return BandcampProvider;
  }(CoverArtProvider);

  function _extractCover2(doc) {
    if (qsMaybe('#missing-tralbum-art', doc) !== null) {
      // No images
      return;
    }

    return qs('#tralbumArt > .popupImage', doc).href;
  }

  function _findTrackImages2(_x2, _x3) {
    return _findTrackImages3.apply(this, arguments);
  }

  function _findTrackImages3() {
    _findTrackImages3 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(doc, mainUrl) {
      var _this2 = this;

      var trackRows, throttledFetchPage, trackImages, mergedTrackImages;
      return regenerator.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              // Unfortunately it doesn't seem like they can be extracted from the
              // album page itself, so we have to load each of the tracks separately.
              // Deliberately throttling these requests as to not flood Bandcamp and
              // potentially get banned.
              // It appears that they used to have an API which returned all track
              // images in one request, but that API has been locked down :(
              // https://michaelherger.github.io/Bandcamp-API/#/Albums/get_api_album_2_info
              trackRows = qsa('#track_table .track_row_view', doc);

              if (trackRows.length) {
                _context2.next = 3;
                break;
              }

              return _context2.abrupt("return", []);

            case 3:
              LOGGER.info('Checking for Bandcamp track images, this may take a few seconds…'); // Max 5 requests per second

              throttledFetchPage = pThrottle({
                interval: 1000,
                limit: 5
              })(this.fetchPage.bind(this)); // This isn't the most efficient, as it'll have to request all tracks
              // before it even returns the main album cover. Although fixable by
              // e.g. using an async generator, it might lead to issues with users
              // submitting the upload form before all track images are fetched...

              _context2.next = 7;
              return Promise.all(trackRows.map(function (trackRow) {
                return _classPrivateMethodGet(_this2, _findTrackImage, _findTrackImage2).call(_this2, trackRow, throttledFetchPage);
              }));

            case 7:
              trackImages = _context2.sent;
              mergedTrackImages = this.mergeTrackImages(trackImages, mainUrl);

              if (mergedTrackImages.length) {
                LOGGER.info("Found ".concat(mergedTrackImages.length, " unique track images"));
              } else {
                LOGGER.info('Found no unique track images this time');
              }

              return _context2.abrupt("return", mergedTrackImages);

            case 11:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));
    return _findTrackImages3.apply(this, arguments);
  }

  function _findTrackImage2(_x4, _x5) {
    return _findTrackImage3.apply(this, arguments);
  }

  function _findTrackImage3() {
    _findTrackImage3 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee3(trackRow, fetchPage) {
      var _trackRow$getAttribut, _trackRow$getAttribut2, _qsMaybe;

      var trackNum, trackUrl, trackPage, imageUrl;
      return regenerator.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              // Account for alphabetical track numbers too
              trackNum = (_trackRow$getAttribut = trackRow.getAttribute('rel')) === null || _trackRow$getAttribut === void 0 ? void 0 : (_trackRow$getAttribut2 = _trackRow$getAttribut.match(/tracknum=(\w+)/)) === null || _trackRow$getAttribut2 === void 0 ? void 0 : _trackRow$getAttribut2[1];
              trackUrl = (_qsMaybe = qsMaybe('.title > a', trackRow)) === null || _qsMaybe === void 0 ? void 0 : _qsMaybe.href;
              /* istanbul ignore if: Cannot immediately find a release where a track is not linked */

              if (trackUrl) {
                _context3.next = 5;
                break;
              }

              LOGGER.warn("Could not check track ".concat(trackNum, " for track images"));
              return _context3.abrupt("return");

            case 5:
              _context3.prev = 5;
              _context3.t0 = parseDOM;
              _context3.next = 9;
              return fetchPage(new URL(trackUrl));

            case 9:
              _context3.t1 = _context3.sent;
              _context3.t2 = trackUrl;
              trackPage = (0, _context3.t0)(_context3.t1, _context3.t2);
              imageUrl = _classPrivateMethodGet(this, _extractCover, _extractCover2).call(this, trackPage);
              /* istanbul ignore if: Cannot find example */

              if (imageUrl) {
                _context3.next = 15;
                break;
              }

              return _context3.abrupt("return");

            case 15:
              return _context3.abrupt("return", {
                url: imageUrl,
                trackNumber: trackNum
              });

            case 18:
              _context3.prev = 18;
              _context3.t3 = _context3["catch"](5);
              LOGGER.error("Could not check track ".concat(trackNum, " for track images"), _context3.t3);
              return _context3.abrupt("return");

            case 22:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this, [[5, 18]]);
    }));
    return _findTrackImage3.apply(this, arguments);
  }

  function _amendSquareThumbnails2(_x6) {
    return _amendSquareThumbnails3.apply(this, arguments);
  }

  function _amendSquareThumbnails3() {
    _amendSquareThumbnails3 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee5(covers) {
      return regenerator.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              return _context5.abrupt("return", Promise.all(covers.map( /*#__PURE__*/function () {
                var _ref = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee4(cover) {
                  var coverDims, ratio;
                  return regenerator.wrap(function _callee4$(_context4) {
                    while (1) {
                      switch (_context4.prev = _context4.next) {
                        case 0:
                          _context4.next = 2;
                          return getImageDimensions(cover.url.href.replace(/_\d+\.(\w+)$/, '_0.$1'));

                        case 2:
                          coverDims = _context4.sent;

                          if (!(!coverDims.width || !coverDims.height)) {
                            _context4.next = 5;
                            break;
                          }

                          return _context4.abrupt("return", [cover]);

                        case 5:
                          ratio = coverDims.width / coverDims.height;

                          if (!(0.95 <= ratio && ratio <= 1.05)) {
                            _context4.next = 8;
                            break;
                          }

                          return _context4.abrupt("return", [cover]);

                        case 8:
                          return _context4.abrupt("return", [_objectSpread2(_objectSpread2({}, cover), {}, {
                            comment: filterNonNull([cover.comment, 'Bandcamp full-sized cover']).join(' - ')
                          }), {
                            types: cover.types,
                            // *_16.jpg URLs are the largest square crop available, always 700x700
                            url: new URL(cover.url.href.replace(/_\d+\.(\w+)$/, '_16.$1')),
                            comment: filterNonNull([cover.comment, 'Bandcamp square crop']).join(' - '),
                            skipMaximisation: true
                          }]);

                        case 9:
                        case "end":
                          return _context4.stop();
                      }
                    }
                  }, _callee4);
                }));

                return function (_x7) {
                  return _ref.apply(this, arguments);
                };
              }())).then(function (covers) {
                return covers.flat();
              }));

            case 1:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }));
    return _amendSquareThumbnails3.apply(this, arguments);
  }

  var BeatportProvider = /*#__PURE__*/function (_CoverArtProvider) {
    _inherits(BeatportProvider, _CoverArtProvider);

    var _super = _createSuper(BeatportProvider);

    function BeatportProvider() {
      var _this;

      _classCallCheck(this, BeatportProvider);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));

      _defineProperty(_assertThisInitialized(_this), "supportedDomains", ['beatport.com']);

      _defineProperty(_assertThisInitialized(_this), "favicon", 'https://geo-pro.beatport.com/static/ea225b5168059ba412818496089481eb.png');

      _defineProperty(_assertThisInitialized(_this), "name", 'Beatport');

      _defineProperty(_assertThisInitialized(_this), "urlRegex", /release\/[^/]+\/(\d+)(?:\/|$)/);

      return _this;
    }

    _createClass(BeatportProvider, [{
      key: "findImages",
      value: function () {
        var _findImages = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(url) {
          var respDocument, coverElmt;
          return regenerator.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.t0 = parseDOM;
                  _context.next = 3;
                  return this.fetchPage(url);

                case 3:
                  _context.t1 = _context.sent;
                  _context.t2 = url.href;
                  respDocument = (0, _context.t0)(_context.t1, _context.t2);
                  coverElmt = qs('head > meta[name="og:image"]', respDocument);
                  return _context.abrupt("return", [{
                    url: new URL(coverElmt.content),
                    types: [ArtworkTypeIDs.Front]
                  }]);

                case 8:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function findImages(_x) {
          return _findImages.apply(this, arguments);
        }

        return findImages;
      }()
    }]);

    return BeatportProvider;
  }(CoverArtProvider);

  var DeezerProvider = /*#__PURE__*/function (_HeadMetaPropertyProv) {
    _inherits(DeezerProvider, _HeadMetaPropertyProv);

    var _super = _createSuper(DeezerProvider);

    function DeezerProvider() {
      var _this;

      _classCallCheck(this, DeezerProvider);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));

      _defineProperty(_assertThisInitialized(_this), "supportedDomains", ['deezer.com']);

      _defineProperty(_assertThisInitialized(_this), "favicon", 'https://e-cdns-files.dzcdn.net/cache/images/common/favicon/favicon-16x16.526cde4edf20647be4ee32cdf35c1c13.png');

      _defineProperty(_assertThisInitialized(_this), "name", 'Deezer');

      _defineProperty(_assertThisInitialized(_this), "urlRegex", /(?:\w{2}\/)?album\/(\d+)/);

      return _this;
    }

    return DeezerProvider;
  }(HeadMetaPropertyProvider);

  // JS sources somehow.

  var QUERY_SHA256 = '13e41f41a02b02d0a7e855a71e1a02478fd2fb0a2d104b54931d649e1d7c6ecd';
  var DiscogsProvider = /*#__PURE__*/function (_CoverArtProvider) {
    _inherits(DiscogsProvider, _CoverArtProvider);

    var _super = _createSuper(DiscogsProvider);

    function DiscogsProvider() {
      var _this;

      _classCallCheck(this, DiscogsProvider);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));

      _defineProperty(_assertThisInitialized(_this), "supportedDomains", ['discogs.com']);

      _defineProperty(_assertThisInitialized(_this), "favicon", 'https://catalog-assets.discogs.com/e95f0cd9.png');

      _defineProperty(_assertThisInitialized(_this), "name", 'Discogs');

      _defineProperty(_assertThisInitialized(_this), "urlRegex", /\/release\/(\d+)/);

      return _this;
    }

    _createClass(DiscogsProvider, [{
      key: "findImages",
      value: function () {
        var _findImages = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(url) {
          var releaseId, data;
          return regenerator.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  // Loading the full HTML and parsing the metadata JSON embedded within
                  // it.
                  releaseId = this.extractId(url);
                  assertHasValue(releaseId);
                  _context.next = 4;
                  return DiscogsProvider.getReleaseImages(releaseId);

                case 4:
                  data = _context.sent;
                  return _context.abrupt("return", data.data.release.images.edges.map(function (edge) {
                    return {
                      url: new URL(edge.node.fullsize.sourceUrl)
                    };
                  }));

                case 6:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function findImages(_x) {
          return _findImages.apply(this, arguments);
        }

        return findImages;
      }()
    }], [{
      key: "getReleaseImages",
      value: function getReleaseImages(releaseId) {
        var _this2 = this;

        var respProm = this.apiResponseCache.get(releaseId);

        if (typeof respProm === 'undefined') {
          respProm = this.actuallyGetReleaseImages(releaseId);
          this.apiResponseCache.set(releaseId, respProm);
        } // Evict the promise from the cache if it rejects, so that we can retry
        // later. If we don't evict it, later retries will reuse the failing
        // promise. Only remove if it hasn't been replaced yet. It may have
        // already been replaced by another call, since this is asynchronous code


        respProm.catch(function () {
          if (_this2.apiResponseCache.get(releaseId) === respProm) {
            _this2.apiResponseCache.delete(releaseId);
          }
        });
        return respProm;
      }
    }, {
      key: "actuallyGetReleaseImages",
      value: function () {
        var _actuallyGetReleaseImages = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(releaseId) {
          var graphqlParams, resp, metadata, responseId;
          return regenerator.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  graphqlParams = new URLSearchParams({
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
                  _context2.next = 3;
                  return gmxhr("https://www.discogs.com/internal/release-page/api/graphql?".concat(graphqlParams));

                case 3:
                  resp = _context2.sent;
                  metadata = safeParseJSON(resp.responseText, 'Invalid response from Discogs API');
                  assertHasValue(metadata.data.release, 'Discogs release does not exist');
                  responseId = metadata.data.release.discogsId.toString();
                  assert(typeof responseId === 'undefined' || responseId === releaseId, "Discogs returned wrong release: Requested ".concat(releaseId, ", got ").concat(responseId));
                  return _context2.abrupt("return", metadata);

                case 9:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2);
        }));

        function actuallyGetReleaseImages(_x2) {
          return _actuallyGetReleaseImages.apply(this, arguments);
        }

        return actuallyGetReleaseImages;
      }()
    }, {
      key: "maximiseImage",
      value: function () {
        var _maximiseImage = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee3(url) {
          var _url$pathname$match, _imageName$match;

          var imageName, releaseId, releaseData, matchedImage;
          return regenerator.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  // Maximising by querying the API for all images of the release, finding
                  // the right one, and extracting the "full size" (i.e., 600x600 JPEG) URL.
                  imageName = (_url$pathname$match = url.pathname.match(/discogs-images\/(R-.+)$/)) === null || _url$pathname$match === void 0 ? void 0 : _url$pathname$match[1];
                  releaseId = imageName === null || imageName === void 0 ? void 0 : (_imageName$match = imageName.match(/^R-(\d+)/)) === null || _imageName$match === void 0 ? void 0 : _imageName$match[1];
                  /* istanbul ignore if: Should never happen on valid image */

                  if (releaseId) {
                    _context3.next = 4;
                    break;
                  }

                  return _context3.abrupt("return", url);

                case 4:
                  _context3.next = 6;
                  return this.getReleaseImages(releaseId);

                case 6:
                  releaseData = _context3.sent;
                  matchedImage = releaseData.data.release.images.edges.find(function (img) {
                    return img.node.fullsize.sourceUrl.split('/').at(-1) === imageName;
                  });
                  /* istanbul ignore if: Should never happen on valid image */

                  if (matchedImage) {
                    _context3.next = 10;
                    break;
                  }

                  return _context3.abrupt("return", url);

                case 10:
                  return _context3.abrupt("return", new URL(matchedImage.node.fullsize.sourceUrl));

                case 11:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3, this);
        }));

        function maximiseImage(_x3) {
          return _maximiseImage.apply(this, arguments);
        }

        return maximiseImage;
      }()
    }]);

    return DiscogsProvider;
  }(CoverArtProvider);

  _defineProperty(DiscogsProvider, "apiResponseCache", new Map());

  var MelonProvider = /*#__PURE__*/function (_HeadMetaPropertyProv) {
    _inherits(MelonProvider, _HeadMetaPropertyProv);

    var _super = _createSuper(MelonProvider);

    function MelonProvider() {
      var _this;

      _classCallCheck(this, MelonProvider);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));

      _defineProperty(_assertThisInitialized(_this), "supportedDomains", ['melon.com']);

      _defineProperty(_assertThisInitialized(_this), "favicon", 'https://www.melon.com/favicon.ico');

      _defineProperty(_assertThisInitialized(_this), "name", 'Melon');

      _defineProperty(_assertThisInitialized(_this), "urlRegex", /album\/detail\.htm.*[?&]albumId=(\d+)/);

      return _this;
    }

    _createClass(MelonProvider, [{
      key: "cleanUrl",
      value: function cleanUrl(url) {
        // Album ID is in the query params, base `cleanUrl` strips those away.
        return _get(_getPrototypeOf(MelonProvider.prototype), "cleanUrl", this).call(this, url) + url.search;
      }
    }, {
      key: "is404Page",
      value: function is404Page(doc) {
        return qsMaybe('body > input#returnUrl', doc) !== null;
      }
    }]);

    return MelonProvider;
  }(HeadMetaPropertyProvider);

  var MusicBrainzProvider = /*#__PURE__*/function (_CoverArtProvider) {
    _inherits(MusicBrainzProvider, _CoverArtProvider);

    var _super = _createSuper(MusicBrainzProvider);

    function MusicBrainzProvider() {
      var _this;

      _classCallCheck(this, MusicBrainzProvider);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));

      _defineProperty(_assertThisInitialized(_this), "supportedDomains", ['musicbrainz.org', 'beta.musicbrainz.org']);

      _defineProperty(_assertThisInitialized(_this), "favicon", 'https://musicbrainz.org/static/images/favicons/favicon-32x32.png');

      _defineProperty(_assertThisInitialized(_this), "allowButtons", false);

      _defineProperty(_assertThisInitialized(_this), "name", 'MusicBrainz');

      _defineProperty(_assertThisInitialized(_this), "urlRegex", /release\/([a-z0-9-]+)/);

      return _this;
    }

    _createClass(MusicBrainzProvider, [{
      key: "findImages",
      value: function () {
        var _findImages = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(url) {
          var mbid, caaIndexUrl, caaResp, caaIndex;
          return regenerator.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  mbid = this.extractId(url);
                  assertDefined(mbid); // Grabbing metadata through CAA isn't 100% reliable, since the info
                  // in the index.json isn't always up-to-date (see CAA-129, only a few
                  // cases though).

                  caaIndexUrl = "https://archive.org/download/mbid-".concat(mbid, "/index.json");
                  _context.next = 5;
                  return fetch(caaIndexUrl);

                case 5:
                  caaResp = _context.sent;

                  if (!(caaResp.status >= 400)) {
                    _context.next = 8;
                    break;
                  }

                  throw new Error("Cannot load index.json: HTTP error ".concat(caaResp.status));

                case 8:
                  _context.t0 = safeParseJSON;
                  _context.next = 11;
                  return caaResp.text();

                case 11:
                  _context.t1 = _context.sent;
                  caaIndex = (0, _context.t0)(_context.t1, 'Could not parse index.json');
                  return _context.abrupt("return", caaIndex.images.map(function (img) {
                    var imageFileName = img.image.split('/').at(-1);
                    return {
                      // Skip one level of indirection
                      url: new URL("https://archive.org/download/mbid-".concat(mbid, "/mbid-").concat(mbid, "-").concat(imageFileName)),
                      comment: img.comment,
                      types: img.types.map(function (type) {
                        return ArtworkTypeIDs[type];
                      })
                    };
                  }));

                case 14:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function findImages(_x) {
          return _findImages.apply(this, arguments);
        }

        return findImages;
      }()
    }]);

    return MusicBrainzProvider;
  }(CoverArtProvider);

  // from the JS code loaded on open.qobuz.com, but for simplicity's sake, let's
  // just use a constant app ID first.

  var QOBUZ_APP_ID = 712109809;
  var QobuzProvider = /*#__PURE__*/function (_CoverArtProvider) {
    _inherits(QobuzProvider, _CoverArtProvider);

    var _super = _createSuper(QobuzProvider);

    function QobuzProvider() {
      var _this;

      _classCallCheck(this, QobuzProvider);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));

      _defineProperty(_assertThisInitialized(_this), "supportedDomains", ['qobuz.com', 'open.qobuz.com']);

      _defineProperty(_assertThisInitialized(_this), "favicon", 'https://www.qobuz.com/favicon.ico');

      _defineProperty(_assertThisInitialized(_this), "name", 'Qobuz');

      _defineProperty(_assertThisInitialized(_this), "urlRegex", [/open\.qobuz\.com\/(?:.+?\/)?album\/([A-Za-z0-9]+)(?:\/|$)/, /album\/[^/]+\/([A-Za-z0-9]+)(?:\/|$)/]);

      return _this;
    }

    _createClass(QobuzProvider, [{
      key: "findImages",
      value: function () {
        var _findImages = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(url) {
          var _metadata$goodies;

          var id, metadata, goodies, coverUrl;
          return regenerator.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  id = this.extractId(url);
                  assertHasValue(id); // eslint-disable-next-line init-declarations

                  _context.prev = 2;
                  _context.next = 5;
                  return QobuzProvider.getMetadata(id);

                case 5:
                  metadata = _context.sent;
                  _context.next = 14;
                  break;

                case 8:
                  _context.prev = 8;
                  _context.t0 = _context["catch"](2);

                  if (!(_context.t0 instanceof HTTPResponseError && _context.t0.statusCode == 400)) {
                    _context.next = 13;
                    break;
                  }

                  // Bad request, likely invalid app ID.
                  // Log the original error silently to the console, and throw
                  // a more user friendly one for displaying in the UI
                  console.error(_context.t0);
                  throw new Error('Bad request to Qobuz API, app ID invalid?');

                case 13:
                  throw _context.t0;

                case 14:
                  goodies = ((_metadata$goodies = metadata.goodies) !== null && _metadata$goodies !== void 0 ? _metadata$goodies : []).map(QobuzProvider.extractGoodies);
                  coverUrl = metadata.image.large.replace(/_\d+\.([a-zA-Z0-9]+)$/, '_org.$1');
                  return _context.abrupt("return", [{
                    url: new URL(coverUrl),
                    types: [ArtworkTypeIDs.Front]
                  }].concat(_toConsumableArray(goodies)));

                case 17:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this, [[2, 8]]);
        }));

        function findImages(_x) {
          return _findImages.apply(this, arguments);
        }

        return findImages;
      }()
    }], [{
      key: "idToCoverUrl",
      value: function idToCoverUrl(id) {
        var d1 = id.slice(-2);
        var d2 = id.slice(-4, -2); // Is this always .jpg?

        var imgUrl = "https://static.qobuz.com/images/covers/".concat(d1, "/").concat(d2, "/").concat(id, "_org.jpg");
        return new URL(imgUrl);
      }
    }, {
      key: "getMetadata",
      value: function () {
        var _getMetadata = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(id) {
          var resp, metadata;
          return regenerator.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.next = 2;
                  return gmxhr("https://www.qobuz.com/api.json/0.2/album/get?album_id=".concat(id, "&offset=0&limit=20"), {
                    headers: {
                      'x-app-id': QOBUZ_APP_ID
                    }
                  });

                case 2:
                  resp = _context2.sent;
                  metadata = safeParseJSON(resp.responseText, 'Invalid response from Qobuz API');
                  assert(metadata.id.toString() === id, "Qobuz returned wrong release: Requested ".concat(id, ", got ").concat(metadata.id));
                  return _context2.abrupt("return", metadata);

                case 6:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2);
        }));

        function getMetadata(_x2) {
          return _getMetadata.apply(this, arguments);
        }

        return getMetadata;
      }()
    }, {
      key: "extractGoodies",
      value: function extractGoodies(goodie) {
        // Livret Numérique = Digital Booklet
        var isBooklet = goodie.name.toLowerCase() === 'livret numérique';
        return {
          url: new URL(goodie.original_url),
          types: isBooklet ? [ArtworkTypeIDs.Booklet] : [],
          comment: isBooklet ? 'Qobuz booklet' : goodie.name
        };
      }
    }]);

    return QobuzProvider;
  }(CoverArtProvider);

  // https://github.com/ROpdebee/mb-userscripts/issues/158

  var QubMusiqueProvider = /*#__PURE__*/function (_QobuzProvider) {
    _inherits(QubMusiqueProvider, _QobuzProvider);

    var _super = _createSuper(QubMusiqueProvider);

    function QubMusiqueProvider() {
      var _this;

      _classCallCheck(this, QubMusiqueProvider);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));

      _defineProperty(_assertThisInitialized(_this), "supportedDomains", ['qub.ca']);

      _defineProperty(_assertThisInitialized(_this), "favicon", 'https://www.qub.ca/assets/favicons/apple-touch-icon.png');

      _defineProperty(_assertThisInitialized(_this), "name", 'QUB Musique');

      _defineProperty(_assertThisInitialized(_this), "urlRegex", [/musique\/album\/[\w-]*-([A-Za-z0-9]+)(?:\/|$)/]);

      return _this;
    } // We can reuse the rest of the implementations of QobuzProvider, since it
    // extracts the ID and uses the Qobuz API instead of loading the page.


    return QubMusiqueProvider;
  }(QobuzProvider);

  function urlToDataUri(_x) {
    return _urlToDataUri.apply(this, arguments);
  }

  function _urlToDataUri() {
    _urlToDataUri = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee4(url) {
      var resp;
      return regenerator.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return gmxhr(url, {
                responseType: 'blob'
              });

            case 2:
              resp = _context4.sent;
              return _context4.abrupt("return", new Promise(function (resolve, reject) {
                var reader = new FileReader();
                reader.addEventListener('load', function () {
                  resolve(reader.result);
                });
                reader.addEventListener('abort', reject);
                reader.addEventListener('error', reject);
                reader.readAsDataURL(resp.response);
              }));

            case 4:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));
    return _urlToDataUri.apply(this, arguments);
  }

  var _extractCoverFromTrackMetadata = /*#__PURE__*/new WeakSet();

  var _extractCoversFromSetMetadata = /*#__PURE__*/new WeakSet();

  var SoundcloudProvider = /*#__PURE__*/function (_CoverArtProvider) {
    _inherits(SoundcloudProvider, _CoverArtProvider);

    var _super = _createSuper(SoundcloudProvider);

    function SoundcloudProvider() {
      var _this;

      _classCallCheck(this, SoundcloudProvider);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));

      _classPrivateMethodInitSpec(_assertThisInitialized(_this), _extractCoversFromSetMetadata);

      _classPrivateMethodInitSpec(_assertThisInitialized(_this), _extractCoverFromTrackMetadata);

      _defineProperty(_assertThisInitialized(_this), "supportedDomains", ['soundcloud.com']);

      _defineProperty(_assertThisInitialized(_this), "favicon", 'https://a-v2.sndcdn.com/assets/images/sc-icons/favicon-2cadd14bdb.ico');

      _defineProperty(_assertThisInitialized(_this), "name", 'Soundcloud');

      _defineProperty(_assertThisInitialized(_this), "urlRegex", []);

      return _this;
    }

    _createClass(SoundcloudProvider, [{
      key: "supportsUrl",
      value: function supportsUrl(url) {
        var _url$pathname$trim$sl = url.pathname.trim() // Remove leading slash
        .slice(1) // Remove trailing slash, if any
        .replace(/\/$/, '').split('/'),
            _url$pathname$trim$sl2 = _toArray(_url$pathname$trim$sl),
            artistId = _url$pathname$trim$sl2[0],
            pathParts = _url$pathname$trim$sl2.slice(1);

        return !!pathParts.length && !SoundcloudProvider.badArtistIDs.has(artistId) // artist/likes, artist/track/recommended, artist/sets, ...
        // but not artist/sets/setname!
        && !SoundcloudProvider.badSubpaths.has(pathParts.at(-1));
      }
    }, {
      key: "extractId",
      value: function extractId(url) {
        // We'll use the full path as the ID. This will allow us to distinguish
        // between sets and single tracks, artists, etc.
        // We should've filtered out all bad URLs already.
        // https://soundcloud.com/jonnypalding/sets/talk-21/s-Oeb9wlaKWyl
        // Not sure what the last path component means, but it's required to
        // open that set. Perhaps because it's private?
        return url.pathname.slice(1); // Remove leading slash
      }
    }, {
      key: "findImages",
      value: function () {
        var _findImages = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(url) {
          var _this$extractMetadata;

          var onlyFront,
              pageContent,
              metadata,
              _args = arguments;
          return regenerator.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  onlyFront = _args.length > 1 && _args[1] !== undefined ? _args[1] : false;
                  _context.next = 3;
                  return this.fetchPage(url);

                case 3:
                  pageContent = _context.sent;
                  metadata = (_this$extractMetadata = this.extractMetadataFromJS(pageContent)) === null || _this$extractMetadata === void 0 ? void 0 : _this$extractMetadata.find(function (data) {
                    return ['sound', 'playlist'].includes(data.hydratable);
                  });

                  if (metadata) {
                    _context.next = 7;
                    break;
                  }

                  throw new Error('Could not extract metadata from Soundcloud page');

                case 7:
                  if (!(metadata.hydratable === 'sound')) {
                    _context.next = 11;
                    break;
                  }

                  return _context.abrupt("return", _classPrivateMethodGet(this, _extractCoverFromTrackMetadata, _extractCoverFromTrackMetadata2).call(this, metadata));

                case 11:
                  assert(metadata.hydratable === 'playlist');
                  return _context.abrupt("return", _classPrivateMethodGet(this, _extractCoversFromSetMetadata, _extractCoversFromSetMetadata2).call(this, metadata, onlyFront));

                case 13:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function findImages(_x2) {
          return _findImages.apply(this, arguments);
        }

        return findImages;
      }()
    }, {
      key: "extractMetadataFromJS",
      value: function extractMetadataFromJS(pageContent) {
        var _pageContent$match;

        var jsonData = (_pageContent$match = pageContent.match(/>window\.__sc_hydration = (.+);<\/script>/)) === null || _pageContent$match === void 0 ? void 0 : _pageContent$match[1];
        /* istanbul ignore if: Shouldn't happen */

        if (!jsonData) return;
        return safeParseJSON(jsonData);
      }
    }, {
      key: "mergeTrackImagesByData",
      value: function () {
        var _mergeTrackImagesByData = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee3(trackCovers, mainCover) {
          var mainDataUri, dataToOriginal, trackDataUris, mergedDataUris;
          return regenerator.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  // Soundcloud uses unique URLs for each track image, so deduplicating
                  // based on URL, as is done in the base class, won't work. Because
                  // Soundcloud is awful, they also don't return any headers that uniquely
                  // identify the image (like a Digest or an ETag). So... We have to load
                  // the image and compare its data ourselves. Thankfully, it seems like
                  // the thumbnails are identical if the originals are identical, so at
                  // least we don't have to load the full image... We'll still grab the
                  // "large" thumbnail instead of the small one, because the small one is
                  // so tiny that I fear that if there are minute differences, the track
                  // image will still have the same small thumbnail. The "large" thumbnail
                  // isn't large at all (100x100), so loading it should be fairly quick.
                  // We'll reuse the base class implementation by converting the images
                  // into data URLs of the thumbnails, then later transforming the data
                  // URLs back to the original URLs. Bit of a hack, but it works.
                  LOGGER.info('Finding track covers, this may take a while…');
                  _context3.next = 3;
                  return urlToDataUri(mainCover);

                case 3:
                  mainDataUri = _context3.sent;
                  dataToOriginal = new Map();
                  _context3.next = 7;
                  return Promise.all(trackCovers.map( /*#__PURE__*/function () {
                    var _ref = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(trackCover) {
                      var dataUri;
                      return regenerator.wrap(function _callee2$(_context2) {
                        while (1) {
                          switch (_context2.prev = _context2.next) {
                            case 0:
                              _context2.next = 2;
                              return urlToDataUri(trackCover.url);

                            case 2:
                              dataUri = _context2.sent;
                              // This will overwrite any previous URL if the data URI is the same.
                              // However, that's not a problem, since we're intentionally deduping
                              // images with the same payload anyway. It doesn't matter which URL
                              // we use in the end, all of those URLs return the same data.
                              dataToOriginal.set(dataUri, trackCover.url);
                              return _context2.abrupt("return", _objectSpread2(_objectSpread2({}, trackCover), {}, {
                                url: dataUri
                              }));

                            case 5:
                            case "end":
                              return _context2.stop();
                          }
                        }
                      }, _callee2);
                    }));

                    return function (_x5) {
                      return _ref.apply(this, arguments);
                    };
                  }()));

                case 7:
                  trackDataUris = _context3.sent;
                  mergedDataUris = this.mergeTrackImages(trackDataUris, mainDataUri);
                  return _context3.abrupt("return", mergedDataUris.map(function (mergedTrackCover) {
                    return _objectSpread2(_objectSpread2({}, mergedTrackCover), {}, {
                      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                      url: new URL(dataToOriginal.get(mergedTrackCover.url.href))
                    });
                  }));

                case 10:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3, this);
        }));

        function mergeTrackImagesByData(_x3, _x4) {
          return _mergeTrackImagesByData.apply(this, arguments);
        }

        return mergeTrackImagesByData;
      }()
    }]);

    return SoundcloudProvider;
  }(CoverArtProvider);

  function _extractCoverFromTrackMetadata2(metadata) {
    if (!metadata.data.artwork_url) {
      return [];
    }

    return [{
      url: new URL(metadata.data.artwork_url),
      types: [ArtworkTypeIDs.Front]
    }];
  }

  function _extractCoversFromSetMetadata2(_x6, _x7) {
    return _extractCoversFromSetMetadata3.apply(this, arguments);
  }

  function _extractCoversFromSetMetadata3() {
    _extractCoversFromSetMetadata3 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee5(metadata, onlyFront) {
      var covers, trackCovers, mergedTrackCovers;
      return regenerator.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              covers = [];
              /* istanbul ignore else: Cannot find case */

              if (metadata.data.artwork_url) {
                covers.push({
                  url: new URL(metadata.data.artwork_url),
                  types: [ArtworkTypeIDs.Front]
                });
              } // Don't bother extracting track covers if they won't be used anyway


              if (!onlyFront) {
                _context5.next = 4;
                break;
              }

              return _context5.abrupt("return", covers);

            case 4:
              trackCovers = filterNonNull(metadata.data.tracks.flatMap(function (track, trackNumber) {
                if (!track.artwork_url) return;
                return {
                  url: track.artwork_url,
                  trackNumber: (trackNumber + 1).toString()
                };
              }));
              _context5.next = 7;
              return this.mergeTrackImagesByData(trackCovers, metadata.data.artwork_url);

            case 7:
              mergedTrackCovers = _context5.sent;
              return _context5.abrupt("return", covers.concat(mergedTrackCovers));

            case 9:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, this);
    }));
    return _extractCoversFromSetMetadata3.apply(this, arguments);
  }

  _defineProperty(SoundcloudProvider, "badArtistIDs", new Set(['you', 'discover', 'stream', 'upload', 'search']));

  _defineProperty(SoundcloudProvider, "badSubpaths", new Set(['likes', 'followers', 'following', 'reposts', 'albums', 'tracks', 'popular-tracks', 'comments', 'sets', 'recommended']));

  var SpotifyProvider = /*#__PURE__*/function (_HeadMetaPropertyProv) {
    _inherits(SpotifyProvider, _HeadMetaPropertyProv);

    var _super = _createSuper(SpotifyProvider);

    function SpotifyProvider() {
      var _this;

      _classCallCheck(this, SpotifyProvider);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));

      _defineProperty(_assertThisInitialized(_this), "supportedDomains", ['open.spotify.com']);

      _defineProperty(_assertThisInitialized(_this), "favicon", 'https://open.scdn.co/cdn/images/favicon32.8e66b099.png');

      _defineProperty(_assertThisInitialized(_this), "name", 'Spotify');

      _defineProperty(_assertThisInitialized(_this), "urlRegex", /\/album\/(\w+)/);

      return _this;
    }

    return SpotifyProvider;
  }(HeadMetaPropertyProvider);

  // API keys, I guess they might depend on the user type and/or country?
  // Also not sure whether these may change often or not. If they do, we might
  // need to switch to extracting them from the JS.
  // However, seeing as this key has been present in their JS code for at least
  // 3 years already, I doubt this will stop working any time soon.
  // https://web.archive.org/web/20181015184006/https://listen.tidal.com/app.9dbb572e8121f8755b73.js

  var APP_ID = 'CzET4vdadNUFQ5JU'; // Incomplete and not entirely correct, but good enough for our purposes.

  var _countryCode = /*#__PURE__*/new WeakMap();

  var TidalProvider = /*#__PURE__*/function (_CoverArtProvider) {
    _inherits(TidalProvider, _CoverArtProvider);

    var _super = _createSuper(TidalProvider);

    function TidalProvider() {
      var _this;

      _classCallCheck(this, TidalProvider);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));

      _defineProperty(_assertThisInitialized(_this), "supportedDomains", ['tidal.com', 'listen.tidal.com', 'store.tidal.com']);

      _defineProperty(_assertThisInitialized(_this), "favicon", 'https://listen.tidal.com/favicon.ico');

      _defineProperty(_assertThisInitialized(_this), "name", 'Tidal');

      _defineProperty(_assertThisInitialized(_this), "urlRegex", /\/album\/(\d+)/);

      _classPrivateFieldInitSpec(_assertThisInitialized(_this), _countryCode, {
        writable: true,
        value: null
      });

      return _this;
    }

    _createClass(TidalProvider, [{
      key: "getCountryCode",
      value: function () {
        var _getCountryCode = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee() {
          var resp, codeResponse;
          return regenerator.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  if (_classPrivateFieldGet(this, _countryCode)) {
                    _context.next = 6;
                    break;
                  }

                  _context.next = 3;
                  return gmxhr('https://listen.tidal.com/v1/country/context?countryCode=WW&locale=en_US&deviceType=BROWSER', {
                    headers: {
                      'x-tidal-token': APP_ID
                    }
                  });

                case 3:
                  resp = _context.sent;
                  codeResponse = safeParseJSON(resp.responseText, 'Invalid JSON response from Tidal API for country code');

                  _classPrivateFieldSet(this, _countryCode, codeResponse.countryCode);

                case 6:
                  assertHasValue(_classPrivateFieldGet(this, _countryCode), 'Cannot determine Tidal country');
                  return _context.abrupt("return", _classPrivateFieldGet(this, _countryCode));

                case 8:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function getCountryCode() {
          return _getCountryCode.apply(this, arguments);
        }

        return getCountryCode;
      }()
    }, {
      key: "getCoverUrlFromMetadata",
      value: function () {
        var _getCoverUrlFromMetadata = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(albumId) {
          var _metadata$rows$, _metadata$rows$$modul, _metadata$rows$$modul2;

          var countryCode, apiUrl, resp, metadata, albumMetadata, coverId;
          return regenerator.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.next = 2;
                  return this.getCountryCode();

                case 2:
                  countryCode = _context2.sent;
                  _context2.next = 5;
                  return gmxhr('https://listen.tidal.com/v1/ping');

                case 5:
                  apiUrl = "https://listen.tidal.com/v1/pages/album?albumId=".concat(albumId, "&countryCode=").concat(countryCode, "&deviceType=BROWSER");
                  _context2.next = 8;
                  return gmxhr(apiUrl, {
                    headers: {
                      'x-tidal-token': APP_ID
                    }
                  });

                case 8:
                  resp = _context2.sent;
                  metadata = safeParseJSON(resp.responseText, 'Invalid response from Tidal API');
                  albumMetadata = (_metadata$rows$ = metadata.rows[0]) === null || _metadata$rows$ === void 0 ? void 0 : (_metadata$rows$$modul = _metadata$rows$.modules) === null || _metadata$rows$$modul === void 0 ? void 0 : (_metadata$rows$$modul2 = _metadata$rows$$modul[0]) === null || _metadata$rows$$modul2 === void 0 ? void 0 : _metadata$rows$$modul2.album;
                  assertHasValue(albumMetadata, 'Tidal API returned no album, 404?');
                  assert(albumMetadata.id.toString() === albumId, "Tidal returned wrong release: Requested ".concat(albumId, ", got ").concat(albumMetadata.id));
                  coverId = albumMetadata.cover;
                  assertHasValue(coverId, 'Could not find cover in Tidal metadata');
                  return _context2.abrupt("return", "https://resources.tidal.com/images/".concat(coverId.replace(/-/g, '/'), "/origin.jpg"));

                case 16:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        }));

        function getCoverUrlFromMetadata(_x) {
          return _getCoverUrlFromMetadata.apply(this, arguments);
        }

        return getCoverUrlFromMetadata;
      }()
    }, {
      key: "findImages",
      value: function () {
        var _findImages = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee3(url) {
          var albumId, coverUrl;
          return regenerator.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  // Rewrite the URL to point to the main page
                  // Both listen.tidal.com and store.tidal.com load metadata through an
                  // API. Bare tidal.com returns the image in a <meta> property.
                  albumId = this.extractId(url);
                  assertHasValue(albumId);
                  _context3.next = 4;
                  return this.getCoverUrlFromMetadata(albumId);

                case 4:
                  coverUrl = _context3.sent;
                  return _context3.abrupt("return", [{
                    url: new URL(coverUrl),
                    types: [ArtworkTypeIDs.Front]
                  }]);

                case 6:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3, this);
        }));

        function findImages(_x2) {
          return _findImages.apply(this, arguments);
        }

        return findImages;
      }()
    }]);

    return TidalProvider;
  }(CoverArtProvider);

  var PROVIDER_DISPATCH = new DispatchMap();

  function addProvider(provider) {
    provider.supportedDomains.forEach(function (domain) {
      return PROVIDER_DISPATCH.set(domain, provider);
    });
  }

  addProvider(new AmazonProvider());
  addProvider(new AmazonMusicProvider());
  addProvider(new AppleMusicProvider());
  addProvider(new BandcampProvider());
  addProvider(new BeatportProvider());
  addProvider(new DeezerProvider());
  addProvider(new DiscogsProvider());
  addProvider(new MelonProvider());
  addProvider(new MusicBrainzProvider());
  addProvider(new QobuzProvider());
  addProvider(new QubMusiqueProvider());
  addProvider(new SevenDigitalProvider());
  addProvider(new SoundcloudProvider());
  addProvider(new SpotifyProvider());
  addProvider(new TidalProvider());
  addProvider(new VGMdbProvider());

  function extractDomain(url) {
    return url.hostname.replace(/^www\./, '');
  }

  function getProvider(url) {
    var provider = PROVIDER_DISPATCH.get(extractDomain(url));
    return provider !== null && provider !== void 0 && provider.supportsUrl(url) ? provider : undefined;
  }

  var _banner = new WeakMap();
  var _currentMessageClass = new WeakMap();
  var _setStatusBanner = new WeakSet();
  var _setStatusBannerClass = new WeakSet();
  var StatusBanner = function () {
      function StatusBanner() {
          _classCallCheck(this, StatusBanner);
          _classPrivateMethodInitSpec(this, _setStatusBannerClass);
          _classPrivateMethodInitSpec(this, _setStatusBanner);
          _classPrivateFieldInitSpec(this, _banner, {
              writable: true,
              value: void 0
          });
          _classPrivateFieldInitSpec(this, _currentMessageClass, {
              writable: true,
              value: 'info'
          });
          _classPrivateFieldSet(this, _banner, function () {
              var $$a = document.createElement('span');
              $$a.setAttribute('id', 'ROpdebee_paste_url_status');
              $$a.setAttribute('class', 'info');
              setStyles($$a, { display: 'none' });
              return $$a;
          }.call(this));
      }
      _createClass(StatusBanner, [
          {
              key: 'onInfo',
              value: function onInfo(message) {
                  _classPrivateMethodGet(this, _setStatusBanner, _setStatusBanner2).call(this, message);
                  _classPrivateMethodGet(this, _setStatusBannerClass, _setStatusBannerClass2).call(this, 'info');
              }
          },
          {
              key: 'onWarn',
              value: function onWarn(message, exception) {
                  _classPrivateMethodGet(this, _setStatusBanner, _setStatusBanner2).call(this, message, exception);
                  _classPrivateMethodGet(this, _setStatusBannerClass, _setStatusBannerClass2).call(this, 'warning');
              }
          },
          {
              key: 'onError',
              value: function onError(message, exception) {
                  _classPrivateMethodGet(this, _setStatusBanner, _setStatusBanner2).call(this, message, exception);
                  _classPrivateMethodGet(this, _setStatusBannerClass, _setStatusBannerClass2).call(this, 'error');
              }
          },
          {
              key: 'onSuccess',
              value: function onSuccess(message) {
                  _classPrivateMethodGet(this, _setStatusBanner, _setStatusBanner2).call(this, message);
                  _classPrivateMethodGet(this, _setStatusBannerClass, _setStatusBannerClass2).call(this, 'success');
              }
          },
          {
              key: 'htmlElement',
              get: function get() {
                  return _classPrivateFieldGet(this, _banner);
              }
          }
      ]);
      return StatusBanner;
  }();
  function _setStatusBanner2(message, exception) {
      if (exception && exception instanceof Error) {
          _classPrivateFieldGet(this, _banner).textContent = message + ': ' + exception.message;
      } else {
          _classPrivateFieldGet(this, _banner).textContent = message;
      }
      _classPrivateFieldGet(this, _banner).style.removeProperty('display');
  }
  function _setStatusBannerClass2(newClass) {
      _classPrivateFieldGet(this, _banner).classList.replace(_classPrivateFieldGet(this, _currentMessageClass), newClass);
      _classPrivateFieldSet(this, _currentMessageClass, newClass);
  }

  var css_248z = ".ROpdebee_paste_url_cont{display:inline-block;margin-left:32px;vertical-align:middle}.ROpdebee_paste_url_cont>*{display:block}.ROpdebee_paste_url_cont>label{display:inline;float:none!important}.ROpdebee_paste_url_cont>input#ROpdebee_paste_front_only{display:inline}.ROpdebee_paste_url_cont>a{font-size:smaller;text-align:right}.ROpdebee_paste_url_cont+span{margin-left:32px}.ROpdebee_import_url_buttons{margin-left:32px;vertical-align:middle}.ROpdebee_import_url_buttons>button{display:block;float:none;margin:4px}#ROpdebee_paste_url_status.info{color:#000}#ROpdebee_paste_url_status.warning{color:orange}";

  var _urlInput = new WeakMap();
  var _buttonContainer = new WeakMap();
  var _orSpan = new WeakMap();
  var InputForm = function () {
      function InputForm(banner, app) {
          var _qs$insertAdjacentEle, _qs$insertAdjacentEle2;
          _classCallCheck(this, InputForm);
          _classPrivateFieldInitSpec(this, _urlInput, {
              writable: true,
              value: void 0
          });
          _classPrivateFieldInitSpec(this, _buttonContainer, {
              writable: true,
              value: void 0
          });
          _classPrivateFieldInitSpec(this, _orSpan, {
              writable: true,
              value: void 0
          });
          document.head.append(function () {
              var $$a = document.createElement('style');
              $$a.setAttribute('id', 'ROpdebee_' + USERSCRIPT_NAME);
              appendChildren($$a, css_248z);
              return $$a;
          }.call(this));
          _classPrivateFieldSet(this, _urlInput, function () {
              var $$c = document.createElement('input');
              $$c.setAttribute('type', 'url');
              $$c.setAttribute('placeholder', 'or paste one or more URLs here');
              $$c.setAttribute('size', 47);
              $$c.setAttribute('id', 'ROpdebee_paste_url');
              $$c.addEventListener('input', function () {
                  var _ref = _asyncToGenerator(regenerator.mark(function _callee(evt) {
                      var oldValue, _iterator, _step, inputUrl, url;
                      return regenerator.wrap(function _callee$(_context) {
                          while (1) {
                              switch (_context.prev = _context.next) {
                              case 0:
                                  if (evt.currentTarget.value) {
                                      _context.next = 2;
                                      break;
                                  }
                                  return _context.abrupt('return');
                              case 2:
                                  oldValue = evt.currentTarget.value;
                                  _iterator = _createForOfIteratorHelper(oldValue.trim().split(/\s+/));
                                  _context.prev = 4;
                                  _iterator.s();
                              case 6:
                                  if ((_step = _iterator.n()).done) {
                                      _context.next = 21;
                                      break;
                                  }
                                  inputUrl = _step.value;
                                  url = void 0;
                                  _context.prev = 9;
                                  url = new URL(inputUrl);
                                  _context.next = 17;
                                  break;
                              case 13:
                                  _context.prev = 13;
                                  _context.t0 = _context['catch'](9);
                                  LOGGER.error('Invalid URL: '.concat(inputUrl), _context.t0);
                                  return _context.abrupt('continue', 19);
                              case 17:
                                  _context.next = 19;
                                  return app.processURL(url);
                              case 19:
                                  _context.next = 6;
                                  break;
                              case 21:
                                  _context.next = 26;
                                  break;
                              case 23:
                                  _context.prev = 23;
                                  _context.t1 = _context['catch'](4);
                                  _iterator.e(_context.t1);
                              case 26:
                                  _context.prev = 26;
                                  _iterator.f();
                                  return _context.finish(26);
                              case 29:
                                  if (evt.currentTarget.value === oldValue) {
                                      evt.currentTarget.value = '';
                                  }
                              case 30:
                              case 'end':
                                  return _context.stop();
                              }
                          }
                      }, _callee, null, [
                          [
                              4,
                              23,
                              26,
                              29
                          ],
                          [
                              9,
                              13
                          ]
                      ]);
                  }));
                  return function (_x) {
                      return _ref.apply(this, arguments);
                  };
              }());
              return $$c;
          }.call(this));
          var _createPersistentChec = createPersistentCheckbox('ROpdebee_paste_front_only', 'Fetch front image only', function (evt) {
                  var _checked, _evt$currentTarget;
                  app.onlyFront = (_checked = (_evt$currentTarget = evt.currentTarget) === null || _evt$currentTarget === void 0 ? void 0 : _evt$currentTarget.checked) !== null && _checked !== void 0 ? _checked : false;
              }), _createPersistentChec2 = _slicedToArray(_createPersistentChec, 2), onlyFrontCheckbox = _createPersistentChec2[0], onlyFrontLabel = _createPersistentChec2[1];
          app.onlyFront = onlyFrontCheckbox.checked;
          var container = function () {
              var $$d = document.createElement('div');
              $$d.setAttribute('class', 'ROpdebee_paste_url_cont');
              appendChildren($$d, _classPrivateFieldGet(this, _urlInput));
              var $$f = document.createElement('a');
              $$f.setAttribute('href', 'https://github.com/ROpdebee/mb-userscripts/blob/main/src/mb_enhanced_cover_art_uploads/docs/supported_providers.md');
              $$f.setAttribute('target', '_blank');
              $$d.appendChild($$f);
              var $$g = document.createTextNode('\n                Supported providers\n            ');
              $$f.appendChild($$g);
              appendChildren($$d, onlyFrontCheckbox);
              appendChildren($$d, onlyFrontLabel);
              appendChildren($$d, banner);
              return $$d;
          }.call(this);
          _classPrivateFieldSet(this, _buttonContainer, function () {
              var $$k = document.createElement('div');
              $$k.setAttribute('class', 'ROpdebee_import_url_buttons buttons');
              return $$k;
          }.call(this));
          _classPrivateFieldSet(this, _orSpan, function () {
              var $$l = document.createElement('span');
              setStyles($$l, { display: 'none' });
              var $$m = document.createTextNode('or');
              $$l.appendChild($$m);
              return $$l;
          }.call(this));
          (_qs$insertAdjacentEle = qs('#drop-zone').insertAdjacentElement('afterend', container)) === null || _qs$insertAdjacentEle === void 0 ? void 0 : (_qs$insertAdjacentEle2 = _qs$insertAdjacentEle.insertAdjacentElement('afterend', _classPrivateFieldGet(this, _orSpan))) === null || _qs$insertAdjacentEle2 === void 0 ? void 0 : _qs$insertAdjacentEle2.insertAdjacentElement('afterend', _classPrivateFieldGet(this, _buttonContainer));
      }
      _createClass(InputForm, [{
              key: 'addImportButton',
              value: function addImportButton(onClickCallback, url, provider) {
                  var button = function () {
                      var $$n = document.createElement('button');
                      $$n.setAttribute('type', 'button');
                      $$n.setAttribute('title', url);
                      $$n.addEventListener('click', function (evt) {
                          evt.preventDefault();
                          onClickCallback();
                      });
                      var $$o = document.createElement('img');
                      $$o.setAttribute('src', provider.favicon);
                      $$o.setAttribute('alt', provider.name);
                      $$n.appendChild($$o);
                      var $$p = document.createElement('span');
                      $$n.appendChild($$p);
                      appendChildren($$p, 'Import from ' + provider.name);
                      return $$n;
                  }.call(this);
                  _classPrivateFieldGet(this, _orSpan).style.display = '';
                  _classPrivateFieldGet(this, _buttonContainer).insertAdjacentElement('beforeend', button);
              }
          }]);
      return InputForm;
  }();

  // userscript is executed, so $$IMU_EXPORT$$ should already exist now. However,
  // it does not exist in tests, and we can't straightforwardly inject this variable
  // without importing the module, thereby dereferencing it.

  /* istanbul ignore next: mocked out */

  function maxurl(url, options) {
    $$IMU_EXPORT$$(url, options);
  }

  var options = {
    fill_object: true,
    exclude_videos: true,

    /* istanbul ignore next: Cannot test in unit tests, IMU unavailable */
    filter: function filter(url) {
      return !url.toLowerCase().endsWith('.webp') // Blocking webp images in Discogs
      && !/:format(webp)/.test(url.toLowerCase());
    }
  };
  var IMU_EXCEPTIONS = new DispatchMap();
  function getMaximisedCandidates(_x) {
    return _getMaximisedCandidates.apply(this, arguments);
  }

  function _getMaximisedCandidates() {
    _getMaximisedCandidates = _wrapAsyncGenerator( /*#__PURE__*/regenerator.mark(function _callee(smallurl) {
      var exceptionFn;
      return regenerator.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              exceptionFn = IMU_EXCEPTIONS.get(smallurl.hostname);

              if (!exceptionFn) {
                _context.next = 12;
                break;
              }

              _context.t0 = _asyncGeneratorDelegate;
              _context.t1 = _asyncIterator;
              _context.next = 6;
              return _awaitAsyncGenerator(exceptionFn(smallurl));

            case 6:
              _context.t2 = _context.sent;
              _context.t3 = (0, _context.t1)(_context.t2);
              _context.t4 = _awaitAsyncGenerator;
              return _context.delegateYield((0, _context.t0)(_context.t3, _context.t4), "t5", 10);

            case 10:
              _context.next = 13;
              break;

            case 12:
              return _context.delegateYield(_asyncGeneratorDelegate(_asyncIterator(maximiseGeneric(smallurl)), _awaitAsyncGenerator), "t6", 13);

            case 13:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _getMaximisedCandidates.apply(this, arguments);
  }

  function maximiseGeneric(_x2) {
    return _maximiseGeneric.apply(this, arguments);
  } // Discogs


  function _maximiseGeneric() {
    _maximiseGeneric = _wrapAsyncGenerator( /*#__PURE__*/regenerator.mark(function _callee2(smallurl) {
      var p, results, i, current;
      return regenerator.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              p = new Promise(function (resolve) {
                maxurl(smallurl.href, _objectSpread2(_objectSpread2({}, options), {}, {
                  cb: resolve
                }));
              });
              _context2.next = 3;
              return _awaitAsyncGenerator(p);

            case 3:
              results = _context2.sent;
              i = 0;

            case 5:
              if (!(i < results.length)) {
                _context2.next = 19;
                break;
              }

              current = results[i]; // Filter out results that will definitely not work

              if (!(current.fake || current.bad || current.likely_broken)) {
                _context2.next = 9;
                break;
              }

              return _context2.abrupt("continue", 16);

            case 9:
              _context2.prev = 9;
              _context2.next = 12;
              return _objectSpread2(_objectSpread2({}, current), {}, {
                url: new URL(current.url)
              });

            case 12:
              _context2.next = 16;
              break;

            case 14:
              _context2.prev = 14;
              _context2.t0 = _context2["catch"](9);

            case 16:
              i++;
              _context2.next = 5;
              break;

            case 19:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[9, 14]]);
    }));
    return _maximiseGeneric.apply(this, arguments);
  }

  IMU_EXCEPTIONS.set('img.discogs.com', /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee3(smallurl) {
      var fullSizeURL;
      return regenerator.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return DiscogsProvider.maximiseImage(smallurl);

            case 2:
              fullSizeURL = _context3.sent;
              return _context3.abrupt("return", [{
                url: fullSizeURL,
                filename: fullSizeURL.pathname.split('/').at(-1),
                headers: {}
              }]);

            case 4:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function (_x3) {
      return _ref.apply(this, arguments);
    };
  }()); // Apple Music

  IMU_EXCEPTIONS.set('*.mzstatic.com', /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee4(smallurl) {
      var results, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, imgGeneric;

      return regenerator.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              // For Apple Music, IMU always returns a PNG, regardless of whether the
              // original source image was PNG or JPEG. When the original image is a JPEG,
              // we want to fetch a JPEG version. Although the PNG is of slightly better
              // quality due to generational loss when a JPEG is re-encoded, the quality
              // loss is so minor that the additional costs of downloading, uploading,
              // and storing the PNG are unjustifiable. See #80.
              results = [];
              _iteratorAbruptCompletion = false;
              _didIteratorError = false;
              _context4.prev = 3;
              _iterator = _asyncIterator(maximiseGeneric(smallurl));

            case 5:
              _context4.next = 7;
              return _iterator.next();

            case 7:
              if (!(_iteratorAbruptCompletion = !(_step = _context4.sent).done)) {
                _context4.next = 14;
                break;
              }

              imgGeneric = _step.value;

              // Assume original file name is penultimate component of pathname, e.g.
              // https://is5-ssl.mzstatic.com/image/thumb/Music124/v4/58/34/98/58349857-55bb-62ae-81d4-4a2726e33528/5060786561909.png/999999999x0w-999.png
              // We're still conservative though, if it's not a JPEG, we won't
              // return the JPEG version
              if (/\.jpe?g$/i.test(imgGeneric.url.pathname.split('/').at(-2))) {
                results.push(_objectSpread2(_objectSpread2({}, imgGeneric), {}, {
                  url: new URL(imgGeneric.url.href.replace(/\.png$/i, '.jpg'))
                }));
              } // Always return the original maximised URL as a backup


              results.push(imgGeneric);

            case 11:
              _iteratorAbruptCompletion = false;
              _context4.next = 5;
              break;

            case 14:
              _context4.next = 20;
              break;

            case 16:
              _context4.prev = 16;
              _context4.t0 = _context4["catch"](3);
              _didIteratorError = true;
              _iteratorError = _context4.t0;

            case 20:
              _context4.prev = 20;
              _context4.prev = 21;

              if (!(_iteratorAbruptCompletion && _iterator.return != null)) {
                _context4.next = 25;
                break;
              }

              _context4.next = 25;
              return _iterator.return();

            case 25:
              _context4.prev = 25;

              if (!_didIteratorError) {
                _context4.next = 28;
                break;
              }

              throw _iteratorError;

            case 28:
              return _context4.finish(25);

            case 29:
              return _context4.finish(20);

            case 30:
              return _context4.abrupt("return", results);

            case 31:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, null, [[3, 16, 20, 30], [21,, 25, 29]]);
    }));

    return function (_x4) {
      return _ref2.apply(this, arguments);
    };
  }()); // IMU has no definitions for 7digital yet, so adding an exception here as a workaround
  // Upstream issue: https://github.com/qsniyg/maxurl/issues/922

  IMU_EXCEPTIONS.set('artwork-cdn.7static.com', /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee5(smallurl) {
      return regenerator.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              return _context5.abrupt("return", ['800', '500', '350'].map(function (size) {
                return {
                  url: new URL(smallurl.href.replace(/_\d+\.jpg$/, "_".concat(size, ".jpg"))),
                  filename: '',
                  headers: {}
                };
              }));

            case 1:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }));

    return function (_x5) {
      return _ref3.apply(this, arguments);
    };
  }());

  function getFilename(url) {
    return decodeURIComponent(url.pathname.split('/').at(-1)) || 'image';
  }

  var _doneImages = /*#__PURE__*/new WeakMap();

  var _lastId = /*#__PURE__*/new WeakMap();

  var _retainOnlyFront = /*#__PURE__*/new WeakSet();

  var _createUniqueFilename = /*#__PURE__*/new WeakSet();

  var _urlAlreadyAdded = /*#__PURE__*/new WeakSet();

  var ImageFetcher = /*#__PURE__*/function () {
    // Monotonically increasing ID to uniquely identify the image. We use this
    // so we can later set the image type.
    function ImageFetcher() {
      _classCallCheck(this, ImageFetcher);

      _classPrivateMethodInitSpec(this, _urlAlreadyAdded);

      _classPrivateMethodInitSpec(this, _createUniqueFilename);

      _classPrivateMethodInitSpec(this, _retainOnlyFront);

      _classPrivateFieldInitSpec(this, _doneImages, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _lastId, {
        writable: true,
        value: 0
      });

      _classPrivateFieldSet(this, _doneImages, new Set());
    }

    _createClass(ImageFetcher, [{
      key: "fetchImages",
      value: function () {
        var _fetchImages = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(url, onlyFront) {
          var provider, result;
          return regenerator.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  if (!_classPrivateMethodGet(this, _urlAlreadyAdded, _urlAlreadyAdded2).call(this, url)) {
                    _context.next = 3;
                    break;
                  }

                  LOGGER.warn("".concat(getFilename(url), " has already been added"));
                  return _context.abrupt("return", {
                    images: []
                  });

                case 3:
                  provider = getProvider(url);

                  if (!provider) {
                    _context.next = 6;
                    break;
                  }

                  return _context.abrupt("return", this.fetchImagesFromProvider(url, provider, onlyFront));

                case 6:
                  _context.next = 8;
                  return this.fetchImageFromURL(url);

                case 8:
                  result = _context.sent;

                  if (result) {
                    _context.next = 11;
                    break;
                  }

                  return _context.abrupt("return", {
                    images: []
                  });

                case 11:
                  return _context.abrupt("return", {
                    images: [result]
                  });

                case 12:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function fetchImages(_x, _x2) {
          return _fetchImages.apply(this, arguments);
        }

        return fetchImages;
      }()
    }, {
      key: "fetchImageFromURL",
      value: function () {
        var _fetchImageFromURL = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(url) {
          var skipMaximisation,
              fetchResult,
              _iteratorAbruptCompletion,
              _didIteratorError,
              _iteratorError,
              _iterator,
              _step,
              maxCandidate,
              candidateName,
              _args2 = arguments;

          return regenerator.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  skipMaximisation = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : false;
                  // Attempt to maximise the image
                  fetchResult = null;

                  if (skipMaximisation) {
                    _context2.next = 45;
                    break;
                  }

                  _iteratorAbruptCompletion = false;
                  _didIteratorError = false;
                  _context2.prev = 5;
                  _iterator = _asyncIterator(getMaximisedCandidates(url));

                case 7:
                  _context2.next = 9;
                  return _iterator.next();

                case 9:
                  if (!(_iteratorAbruptCompletion = !(_step = _context2.sent).done)) {
                    _context2.next = 29;
                    break;
                  }

                  maxCandidate = _step.value;
                  candidateName = maxCandidate.filename || getFilename(maxCandidate.url);

                  if (!_classPrivateMethodGet(this, _urlAlreadyAdded, _urlAlreadyAdded2).call(this, maxCandidate.url)) {
                    _context2.next = 15;
                    break;
                  }

                  LOGGER.warn("".concat(candidateName, " has already been added"));
                  return _context2.abrupt("return");

                case 15:
                  _context2.prev = 15;
                  _context2.next = 18;
                  return this.fetchImageContents(maxCandidate.url, candidateName, maxCandidate.headers);

                case 18:
                  fetchResult = _context2.sent;
                  LOGGER.debug("Maximised ".concat(url.href, " to ").concat(maxCandidate.url.href));
                  return _context2.abrupt("break", 29);

                case 23:
                  _context2.prev = 23;
                  _context2.t0 = _context2["catch"](15);
                  LOGGER.warn("Skipping maximised candidate ".concat(candidateName), _context2.t0);

                case 26:
                  _iteratorAbruptCompletion = false;
                  _context2.next = 7;
                  break;

                case 29:
                  _context2.next = 35;
                  break;

                case 31:
                  _context2.prev = 31;
                  _context2.t1 = _context2["catch"](5);
                  _didIteratorError = true;
                  _iteratorError = _context2.t1;

                case 35:
                  _context2.prev = 35;
                  _context2.prev = 36;

                  if (!(_iteratorAbruptCompletion && _iterator.return != null)) {
                    _context2.next = 40;
                    break;
                  }

                  _context2.next = 40;
                  return _iterator.return();

                case 40:
                  _context2.prev = 40;

                  if (!_didIteratorError) {
                    _context2.next = 43;
                    break;
                  }

                  throw _iteratorError;

                case 43:
                  return _context2.finish(40);

                case 44:
                  return _context2.finish(35);

                case 45:
                  if (fetchResult) {
                    _context2.next = 49;
                    break;
                  }

                  _context2.next = 48;
                  return this.fetchImageContents(url, getFilename(url), {});

                case 48:
                  fetchResult = _context2.sent;

                case 49:
                  _classPrivateFieldGet(this, _doneImages).add(fetchResult.fetchedUrl.href);

                  _classPrivateFieldGet(this, _doneImages).add(fetchResult.requestedUrl.href);

                  _classPrivateFieldGet(this, _doneImages).add(url.href);

                  return _context2.abrupt("return", {
                    content: fetchResult.file,
                    originalUrl: url,
                    maximisedUrl: fetchResult.requestedUrl,
                    fetchedUrl: fetchResult.fetchedUrl,
                    wasMaximised: url.href !== fetchResult.requestedUrl.href,
                    wasRedirected: fetchResult.wasRedirected // We have no idea what the type or comment will be, so leave them
                    // undefined so that a default, if any, can be inserted.

                  });

                case 53:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, this, [[5, 31, 35, 45], [15, 23], [36,, 40, 44]]);
        }));

        function fetchImageFromURL(_x3) {
          return _fetchImageFromURL.apply(this, arguments);
        }

        return fetchImageFromURL;
      }()
    }, {
      key: "fetchImagesFromProvider",
      value: function () {
        var _fetchImagesFromProvider = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee3(url, provider, onlyFront) {
          var images, finalImages, hasMoreImages, fetchResults, _iterator2, _step2, img, result;

          return regenerator.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  LOGGER.info("Searching for images in ".concat(provider.name, " release\u2026")); // This could throw, assuming caller will catch.

                  _context3.next = 3;
                  return provider.findImages(url, onlyFront);

                case 3:
                  images = _context3.sent;
                  finalImages = onlyFront ? _classPrivateMethodGet(this, _retainOnlyFront, _retainOnlyFront2).call(this, images) : images;
                  hasMoreImages = onlyFront && images.length !== finalImages.length;
                  LOGGER.info("Found ".concat(finalImages.length || 'no', " images in ").concat(provider.name, " release"));
                  fetchResults = [];
                  _iterator2 = _createForOfIteratorHelper(finalImages);
                  _context3.prev = 9;

                  _iterator2.s();

                case 11:
                  if ((_step2 = _iterator2.n()).done) {
                    _context3.next = 30;
                    break;
                  }

                  img = _step2.value;

                  if (!_classPrivateMethodGet(this, _urlAlreadyAdded, _urlAlreadyAdded2).call(this, img.url)) {
                    _context3.next = 16;
                    break;
                  }

                  LOGGER.warn("".concat(getFilename(img.url), " has already been added"));
                  return _context3.abrupt("continue", 28);

                case 16:
                  _context3.prev = 16;
                  _context3.next = 19;
                  return this.fetchImageFromURL(img.url, img.skipMaximisation);

                case 19:
                  result = _context3.sent;

                  if (result) {
                    _context3.next = 22;
                    break;
                  }

                  return _context3.abrupt("continue", 28);

                case 22:
                  fetchResults.push(_objectSpread2(_objectSpread2({}, result), {}, {
                    types: img.types,
                    comment: img.comment
                  }));
                  _context3.next = 28;
                  break;

                case 25:
                  _context3.prev = 25;
                  _context3.t0 = _context3["catch"](16);
                  LOGGER.warn("Skipping ".concat(getFilename(img.url)), _context3.t0);

                case 28:
                  _context3.next = 11;
                  break;

                case 30:
                  _context3.next = 35;
                  break;

                case 32:
                  _context3.prev = 32;
                  _context3.t1 = _context3["catch"](9);

                  _iterator2.e(_context3.t1);

                case 35:
                  _context3.prev = 35;

                  _iterator2.f();

                  return _context3.finish(35);

                case 38:
                  if (!hasMoreImages) {
                    // Don't mark the whole provider URL as done if we haven't grabbed
                    // all images.
                    _classPrivateFieldGet(this, _doneImages).add(url.href);
                  } else {
                    LOGGER.warn("Not all images were fetched: ".concat(images.length - finalImages.length, " covers were skipped."));
                  }

                  return _context3.abrupt("return", {
                    containerUrl: url,
                    images: fetchResults
                  });

                case 40:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3, this, [[9, 32, 35, 38], [16, 25]]);
        }));

        function fetchImagesFromProvider(_x4, _x5, _x6) {
          return _fetchImagesFromProvider.apply(this, arguments);
        }

        return fetchImagesFromProvider;
      }()
    }, {
      key: "fetchImageContents",
      value: function () {
        var _fetchImageContents = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee4(url, fileName, headers) {
          var _this = this;

          var resp, fetchedUrl, wasRedirected, rawFile;
          return regenerator.wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  _context4.next = 2;
                  return gmxhr(url, {
                    responseType: 'blob',
                    headers: headers
                  });

                case 2:
                  resp = _context4.sent;
                  fetchedUrl = new URL(resp.finalUrl);
                  wasRedirected = resp.finalUrl !== url.href;

                  if (wasRedirected) {
                    LOGGER.warn("Followed redirect of ".concat(url.href, " -> ").concat(resp.finalUrl, " while fetching image contents"));
                  }

                  rawFile = new File([resp.response], fileName);
                  return _context4.abrupt("return", new Promise(function (resolve, reject) {
                    MB.CoverArt.validate_file(rawFile).fail(function () {
                      reject(new Error("".concat(fileName, " has an unsupported file type")));
                    }).done(function (mimeType) {
                      resolve({
                        requestedUrl: url,
                        fetchedUrl: fetchedUrl,
                        wasRedirected: wasRedirected,
                        file: new File([resp.response], _classPrivateMethodGet(_this, _createUniqueFilename, _createUniqueFilename2).call(_this, fileName, mimeType), {
                          type: mimeType
                        })
                      });
                    });
                  }));

                case 8:
                case "end":
                  return _context4.stop();
              }
            }
          }, _callee4);
        }));

        function fetchImageContents(_x7, _x8, _x9) {
          return _fetchImageContents.apply(this, arguments);
        }

        return fetchImageContents;
      }()
    }]);

    return ImageFetcher;
  }();

  function _retainOnlyFront2(images) {
    // Return only the front images. If no image with Front type is found
    // in the array, assume the first image is the front one. If there are
    // multiple front images, return them all (e.g. Bandcamp original and
    // square crop).
    var filtered = images.filter(function (img) {
      var _img$types;

      return (_img$types = img.types) === null || _img$types === void 0 ? void 0 : _img$types.includes(ArtworkTypeIDs.Front);
    });
    return filtered.length ? filtered : images.slice(0, 1);
  }

  function _createUniqueFilename2(filename, mimeType) {
    var _this$lastId;

    var filenameWithoutExt = filename.replace(/\.(?:png|jpe?g|gif)$/i, '');
    return "".concat(filenameWithoutExt, ".").concat((_classPrivateFieldSet(this, _lastId, (_this$lastId = +_classPrivateFieldGet(this, _lastId)) + 1), _this$lastId), ".").concat(mimeType.split('/')[1]);
  }

  function _urlAlreadyAdded2(url) {
    return _classPrivateFieldGet(this, _doneImages).has(url.href);
  }

  function enqueueImages(_x) {
    return _enqueueImages.apply(this, arguments);
  }

  function _enqueueImages() {
    _enqueueImages = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(_ref) {
      var images,
          defaultTypes,
          defaultComment,
          _args = arguments;
      return regenerator.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              images = _ref.images;
              defaultTypes = _args.length > 1 && _args[1] !== undefined ? _args[1] : [];
              defaultComment = _args.length > 2 && _args[2] !== undefined ? _args[2] : '';
              _context.next = 5;
              return Promise.all(images.map(function (image) {
                return enqueueImage(image, defaultTypes, defaultComment);
              }));

            case 5:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _enqueueImages.apply(this, arguments);
  }

  function enqueueImage(_x2, _x3, _x4) {
    return _enqueueImage.apply(this, arguments);
  }

  function _enqueueImage() {
    _enqueueImage = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(image, defaultTypes, defaultComment) {
      var _image$types, _image$comment;

      return regenerator.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              dropImage(image.content);
              _context2.next = 3;
              return retryTimes(setImageParameters.bind(null, image.content.name, // Only use the defaults if the specific one is undefined
              (_image$types = image.types) !== null && _image$types !== void 0 ? _image$types : defaultTypes, ((_image$comment = image.comment) !== null && _image$comment !== void 0 ? _image$comment : defaultComment).trim()), 5, 500);

            case 3:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));
    return _enqueueImage.apply(this, arguments);
  }

  function dropImage(imageData) {
    // Fake event to trigger the drop event on the drag'n'drop element
    // Using jQuery because native JS cannot manually trigger such events
    // for security reasons
    var dropEvent = $.Event('drop');
    dropEvent.originalEvent = {
      dataTransfer: {
        files: [imageData]
      }
    }; // Note that we're using MB's own jQuery here, not a script-local one.
    // We need to reuse MB's own jQuery to be able to trigger the event
    // handler.

    $('#drop-zone').trigger(dropEvent);
  }

  function setImageParameters(imageName, imageTypes, imageComment) {
    // Find the row for this added image. We can't be 100% sure it's the last
    // added image, since another image may have been added in the meantime
    // as we're called asynchronously. We find the correct image via the file
    // name, which is guaranteed to be unique since we embed a unique ID into it.
    var pendingUploadRows = qsa('tbody[data-bind="foreach: files_to_upload"] > tr');
    var fileRow = pendingUploadRows.find(function (row) {
      return qs('.file-info span[data-bind="text: name"]', row).textContent == imageName;
    });
    assertDefined(fileRow, "Could not find image ".concat(imageName, " in queued uploads")); // Set image types

    var checkboxesToCheck = qsa('ul.cover-art-type-checkboxes input[type="checkbox"]', fileRow).filter(function (cbox) {
      return imageTypes.includes(parseInt(cbox.value));
    });
    checkboxesToCheck.forEach(function (cbox) {
      cbox.checked = true;
      cbox.dispatchEvent(new Event('click'));
    }); // Set comment if we should

    if (imageComment) {
      var commentInput = qs('div.comment > input.comment', fileRow);
      commentInput.value = imageComment;
      commentInput.dispatchEvent(new Event('change'));
    }
  }

  function fillEditNote(allFetchedImages, origin, editNote) {
    var totalNumImages = allFetchedImages.reduce(function (acc, fetched) {
      return acc + fetched.images.length;
    }, 0); // Nothing enqueued => Skip edit note altogether

    if (!totalNumImages) return; // Limiting to 3 URLs to reduce noise

    var numFilled = 0;

    var _iterator = _createForOfIteratorHelper(allFetchedImages),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var _step$value = _step.value,
            containerUrl = _step$value.containerUrl,
            images = _step$value.images;
        var prefix = '';

        if (containerUrl) {
          prefix = ' * ';
          editNote.addExtraInfo(decodeURI(containerUrl.href));
        }

        var _iterator2 = _createForOfIteratorHelper(images),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var queuedUrl = _step2.value;
            numFilled += 1;
            if (numFilled > 3) break; // Prevent noise from data: URLs

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

  var _note = /*#__PURE__*/new WeakMap();

  var _fetcher = /*#__PURE__*/new WeakMap();

  var _ui = /*#__PURE__*/new WeakMap();

  var _urlsInProgress = /*#__PURE__*/new WeakMap();

  var _processURL = /*#__PURE__*/new WeakSet();

  var App = /*#__PURE__*/function () {
    function App() {
      _classCallCheck(this, App);

      _classPrivateMethodInitSpec(this, _processURL);

      _classPrivateFieldInitSpec(this, _note, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _fetcher, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _ui, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _urlsInProgress, {
        writable: true,
        value: void 0
      });

      _defineProperty(this, "onlyFront", false);

      _classPrivateFieldSet(this, _note, EditNote.withFooterFromGMInfo());

      _classPrivateFieldSet(this, _fetcher, new ImageFetcher());

      _classPrivateFieldSet(this, _urlsInProgress, new Set());

      var banner = new StatusBanner();
      LOGGER.addSink(banner);

      _classPrivateFieldSet(this, _ui, new InputForm(banner.htmlElement, this));
    }

    _createClass(App, [{
      key: "processURL",
      value: function () {
        var _processURL3 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(url) {
          return regenerator.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  if (!_classPrivateFieldGet(this, _urlsInProgress).has(url.href)) {
                    _context.next = 2;
                    break;
                  }

                  return _context.abrupt("return");

                case 2:
                  _context.prev = 2;

                  _classPrivateFieldGet(this, _urlsInProgress).add(url.href);

                  _context.next = 6;
                  return _classPrivateMethodGet(this, _processURL, _processURL2).call(this, url);

                case 6:
                  _context.prev = 6;

                  _classPrivateFieldGet(this, _urlsInProgress).delete(url.href);

                  return _context.finish(6);

                case 9:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this, [[2,, 6, 9]]);
        }));

        function processURL(_x) {
          return _processURL3.apply(this, arguments);
        }

        return processURL;
      }()
    }, {
      key: "processSeedingParameters",
      value: function () {
        var _processSeedingParameters = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee3() {
          var _this = this,
              _params$origin;

          var params, fetchResults, _iterator, _step, _step$value, fetchResult, cover, totalNumImages;

          return regenerator.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  params = SeedParameters.decode(new URLSearchParams(document.location.search)); // Although this is very similar to `processURL`, we may have to fetch
                  // and enqueue multiple images. We want to fetch images in parallel, but
                  // enqueue them sequentially to ensure the order stays consistent.
                  // eslint-disable-next-line init-declarations

                  _context3.prev = 1;
                  _context3.next = 4;
                  return Promise.all(params.images.map( /*#__PURE__*/function () {
                    var _ref = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(cover) {
                      return regenerator.wrap(function _callee2$(_context2) {
                        while (1) {
                          switch (_context2.prev = _context2.next) {
                            case 0:
                              _context2.next = 2;
                              return _classPrivateFieldGet(_this, _fetcher).fetchImages(cover.url, _this.onlyFront);

                            case 2:
                              _context2.t0 = _context2.sent;
                              _context2.t1 = cover;
                              return _context2.abrupt("return", [_context2.t0, _context2.t1]);

                            case 5:
                            case "end":
                              return _context2.stop();
                          }
                        }
                      }, _callee2);
                    }));

                    return function (_x2) {
                      return _ref.apply(this, arguments);
                    };
                  }()));

                case 4:
                  fetchResults = _context3.sent;
                  _context3.next = 11;
                  break;

                case 7:
                  _context3.prev = 7;
                  _context3.t0 = _context3["catch"](1);
                  LOGGER.error('Failed to grab images', _context3.t0);
                  return _context3.abrupt("return");

                case 11:
                  // Not using Promise.all to ensure images get added in order.
                  _iterator = _createForOfIteratorHelper(fetchResults);
                  _context3.prev = 12;

                  _iterator.s();

                case 14:
                  if ((_step = _iterator.n()).done) {
                    _context3.next = 26;
                    break;
                  }

                  _step$value = _slicedToArray(_step.value, 2), fetchResult = _step$value[0], cover = _step$value[1];
                  _context3.prev = 16;
                  _context3.next = 19;
                  return enqueueImages(fetchResult, cover.types, cover.comment);

                case 19:
                  _context3.next = 24;
                  break;

                case 21:
                  _context3.prev = 21;
                  _context3.t1 = _context3["catch"](16);
                  LOGGER.error('Failed to enqueue some images', _context3.t1);

                case 24:
                  _context3.next = 14;
                  break;

                case 26:
                  _context3.next = 31;
                  break;

                case 28:
                  _context3.prev = 28;
                  _context3.t2 = _context3["catch"](12);

                  _iterator.e(_context3.t2);

                case 31:
                  _context3.prev = 31;

                  _iterator.f();

                  return _context3.finish(31);

                case 34:
                  fillEditNote(fetchResults.map(function (pair) {
                    return pair[0];
                  }), (_params$origin = params.origin) !== null && _params$origin !== void 0 ? _params$origin : '', _classPrivateFieldGet(this, _note));
                  totalNumImages = fetchResults.reduce(function (acc, pair) {
                    return acc + pair[0].images.length;
                  }, 0);

                  if (totalNumImages) {
                    LOGGER.success("Successfully added ".concat(totalNumImages, " image(s)"));
                  }

                case 37:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3, this, [[1, 7], [12, 28, 31, 34], [16, 21]]);
        }));

        function processSeedingParameters() {
          return _processSeedingParameters.apply(this, arguments);
        }

        return processSeedingParameters;
      }()
    }, {
      key: "addImportButtons",
      value: function () {
        var _addImportButtons = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee4() {
          var _window$location$href,
              _this2 = this;

          var mbid, attachedURLs, supportedURLs;
          return regenerator.wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  mbid = (_window$location$href = window.location.href.match(/musicbrainz\.org\/release\/([a-f0-9-]+)\//)) === null || _window$location$href === void 0 ? void 0 : _window$location$href[1];
                  assertHasValue(mbid);
                  _context4.next = 4;
                  return getURLsForRelease(mbid, {
                    excludeEnded: true,
                    excludeDuplicates: true
                  });

                case 4:
                  attachedURLs = _context4.sent;
                  supportedURLs = attachedURLs.filter(function (url) {
                    var _getProvider;

                    return (_getProvider = getProvider(url)) === null || _getProvider === void 0 ? void 0 : _getProvider.allowButtons;
                  });

                  if (supportedURLs.length) {
                    _context4.next = 8;
                    break;
                  }

                  return _context4.abrupt("return");

                case 8:
                  supportedURLs.forEach(function (url) {
                    var provider = getProvider(url);
                    assertHasValue(provider);

                    _classPrivateFieldGet(_this2, _ui).addImportButton(_this2.processURL.bind(_this2, url), url.href, provider);
                  });

                case 9:
                case "end":
                  return _context4.stop();
              }
            }
          }, _callee4);
        }));

        function addImportButtons() {
          return _addImportButtons.apply(this, arguments);
        }

        return addImportButtons;
      }()
    }]);

    return App;
  }();

  function _processURL2(_x3) {
    return _processURL4.apply(this, arguments);
  }

  function _processURL4() {
    _processURL4 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee5(url) {
      var fetchResult;
      return regenerator.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.prev = 0;
              _context5.next = 3;
              return _classPrivateFieldGet(this, _fetcher).fetchImages(url, this.onlyFront);

            case 3:
              fetchResult = _context5.sent;
              _context5.next = 10;
              break;

            case 6:
              _context5.prev = 6;
              _context5.t0 = _context5["catch"](0);
              LOGGER.error('Failed to grab images', _context5.t0);
              return _context5.abrupt("return");

            case 10:
              _context5.prev = 10;
              _context5.next = 13;
              return enqueueImages(fetchResult);

            case 13:
              _context5.next = 19;
              break;

            case 15:
              _context5.prev = 15;
              _context5.t1 = _context5["catch"](10);
              LOGGER.error('Failed to enqueue images', _context5.t1);
              return _context5.abrupt("return");

            case 19:
              fillEditNote([fetchResult], '', _classPrivateFieldGet(this, _note));

              if (fetchResult.images.length) {
                LOGGER.success("Successfully added ".concat(fetchResult.images.length, " image(s)"));
              }

            case 21:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, this, [[0, 6], [10, 15]]);
    }));
    return _processURL4.apply(this, arguments);
  }

  /* istanbul ignore file: Covered by E2E */
  LOGGER.configure({
    logLevel: LogLevel.INFO
  });
  LOGGER.addSink(new ConsoleSink(USERSCRIPT_NAME));

  function runOnMB() {
    // Initialise the app, which will start listening for pasted URLs.
    // The only reason we're using an app here is so we can easily access the
    // UI and fetcher instances without having to pass them around as
    // parameters.
    var app = new App();
    app.processSeedingParameters();
    app.addImportButtons();
  }

  function runOnSeederPage() {
    var seeder = seederFactory(document.location);

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
