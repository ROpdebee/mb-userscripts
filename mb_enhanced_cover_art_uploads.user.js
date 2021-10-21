// ==UserScript==
// @name         MB: Enhanced Cover Art Uploads
// @description  Enhance the cover art uploader! Upload directly from a URL, automatically import covers from Discogs/Spotify/Apple Music/..., automatically retrieve the largest version, and more!
// @version      2021.10.21.3
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

  /* minified: babel helpers, regenerator-runtime, @babel/runtime, ts-custom-error, nativejsx */
  function ownKeys(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n);}return r}function _objectSpread2(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?ownKeys(Object(r),!0).forEach((function(e){_defineProperty(t,e,r[e]);})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):ownKeys(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e));}));}return t}function _typeof(t){return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},_typeof(t)}function _asyncIterator(t){var e;if("undefined"!=typeof Symbol&&(Symbol.asyncIterator&&(e=t[Symbol.asyncIterator]),null==e&&Symbol.iterator&&(e=t[Symbol.iterator])),null==e&&(e=t["@@asyncIterator"]),null==e&&(e=t["@@iterator"]),null==e)throw new TypeError("Object is not async iterable");return e.call(t)}function _AwaitValue(t){this.wrapped=t;}function _AsyncGenerator(t){var e,r;function n(e,r){try{var i=t[e](r),a=i.value,c=a instanceof _AwaitValue;Promise.resolve(c?a.wrapped:a).then((function(t){c?n("return"===e?"return":"next",t):o(i.done?"return":"normal",t);}),(function(t){n("throw",t);}));}catch(u){o("throw",u);}}function o(t,o){switch(t){case"return":e.resolve({value:o,done:!0});break;case"throw":e.reject(o);break;default:e.resolve({value:o,done:!1});}(e=e.next)?n(e.key,e.arg):r=null;}this._invoke=function(t,o){return new Promise((function(i,a){var c={key:t,arg:o,resolve:i,reject:a,next:null};r?r=r.next=c:(e=r=c,n(t,o));}))},"function"!=typeof t.return&&(this.return=void 0);}function _wrapAsyncGenerator(t){return function(){return new _AsyncGenerator(t.apply(this,arguments))}}function _awaitAsyncGenerator(t){return new _AwaitValue(t)}function _asyncGeneratorDelegate(t,e){var r={},n=!1;function o(r,o){return n=!0,o=new Promise((function(e){e(t[r](o));})),{done:!1,value:e(o)}}return r["undefined"!=typeof Symbol&&Symbol.iterator||"@@iterator"]=function(){return this},r.next=function(t){return n?(n=!1,t):o("next",t)},"function"==typeof t.throw&&(r.throw=function(t){if(n)throw n=!1,t;return o("throw",t)}),"function"==typeof t.return&&(r.return=function(t){return n?(n=!1,t):o("return",t)}),r}function asyncGeneratorStep(t,e,r,n,o,i,a){try{var c=t[i](a),u=c.value;}catch(s){return void r(s)}c.done?e(u):Promise.resolve(u).then(n,o);}function _asyncToGenerator(t){return function(){var e=this,r=arguments;return new Promise((function(n,o){var i=t.apply(e,r);function a(t){asyncGeneratorStep(i,n,o,a,c,"next",t);}function c(t){asyncGeneratorStep(i,n,o,a,c,"throw",t);}a(void 0);}))}}function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _defineProperties(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n);}}function _createClass(t,e,r){return e&&_defineProperties(t.prototype,e),r&&_defineProperties(t,r),t}function _defineProperty(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function _inherits(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&_setPrototypeOf(t,e);}function _getPrototypeOf(t){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)},_getPrototypeOf(t)}function _setPrototypeOf(t,e){return _setPrototypeOf=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t},_setPrototypeOf(t,e)}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return !1;if(Reflect.construct.sham)return !1;if("function"==typeof Proxy)return !0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return !1}}function _construct(t,e,r){return _construct=_isNativeReflectConstruct()?Reflect.construct:function(t,e,r){var n=[null];n.push.apply(n,e);var o=new(Function.bind.apply(t,n));return r&&_setPrototypeOf(o,r.prototype),o},_construct.apply(null,arguments)}function _isNativeFunction(t){return -1!==Function.toString.call(t).indexOf("[native code]")}function _wrapNativeSuper(t){var e="function"==typeof Map?new Map:void 0;return _wrapNativeSuper=function(t){if(null===t||!_isNativeFunction(t))return t;if("function"!=typeof t)throw new TypeError("Super expression must either be null or a function");if(void 0!==e){if(e.has(t))return e.get(t);e.set(t,r);}function r(){return _construct(t,arguments,_getPrototypeOf(this).constructor)}return r.prototype=Object.create(t.prototype,{constructor:{value:r,enumerable:!1,writable:!0,configurable:!0}}),_setPrototypeOf(r,t)},_wrapNativeSuper(t)}function _assertThisInitialized(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function _possibleConstructorReturn(t,e){if(e&&("object"==typeof e||"function"==typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return _assertThisInitialized(t)}function _createSuper(t){var e=_isNativeReflectConstruct();return function(){var r,n=_getPrototypeOf(t);if(e){var o=_getPrototypeOf(this).constructor;r=Reflect.construct(n,arguments,o);}else r=n.apply(this,arguments);return _possibleConstructorReturn(this,r)}}function _slicedToArray(t,e){return _arrayWithHoles(t)||_iterableToArrayLimit(t,e)||_unsupportedIterableToArray(t,e)||_nonIterableRest()}function _toArray(t){return _arrayWithHoles(t)||_iterableToArray(t)||_unsupportedIterableToArray(t)||_nonIterableRest()}function _toConsumableArray(t){return _arrayWithoutHoles(t)||_iterableToArray(t)||_unsupportedIterableToArray(t)||_nonIterableSpread()}function _arrayWithoutHoles(t){if(Array.isArray(t))return _arrayLikeToArray(t)}function _arrayWithHoles(t){if(Array.isArray(t))return t}function _iterableToArray(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}function _iterableToArrayLimit(t,e){var r=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=r){var n,o,i=[],a=!0,c=!1;try{for(r=r.call(t);!(a=(n=r.next()).done)&&(i.push(n.value),!e||i.length!==e);a=!0);}catch(u){c=!0,o=u;}finally{try{a||null==r.return||r.return();}finally{if(c)throw o}}return i}}function _unsupportedIterableToArray(t,e){if(t){if("string"==typeof t)return _arrayLikeToArray(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);return "Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?_arrayLikeToArray(t,e):void 0}}function _arrayLikeToArray(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _createForOfIteratorHelper(t,e){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!r){if(Array.isArray(t)||(r=_unsupportedIterableToArray(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,o=function(){};return {s:o,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,a=!0,c=!1;return {s:function(){r=r.call(t);},n:function(){var t=r.next();return a=t.done,t},e:function(t){c=!0,i=t;},f:function(){try{a||null==r.return||r.return();}finally{if(c)throw i}}}}function _classPrivateFieldGet(t,e){return _classApplyDescriptorGet(t,_classExtractFieldDescriptor(t,e,"get"))}function _classPrivateFieldSet(t,e,r){return _classApplyDescriptorSet(t,_classExtractFieldDescriptor(t,e,"set"),r),r}function _classExtractFieldDescriptor(t,e,r){if(!e.has(t))throw new TypeError("attempted to "+r+" private field on non-instance");return e.get(t)}function _classApplyDescriptorGet(t,e){return e.get?e.get.call(t):e.value}function _classApplyDescriptorSet(t,e,r){if(e.set)e.set.call(t,r);else {if(!e.writable)throw new TypeError("attempted to set read only private field");e.value=r;}}function _classPrivateMethodGet(t,e,r){if(!e.has(t))throw new TypeError("attempted to get private field on non-instance");return r}function _checkPrivateRedeclaration(t,e){if(e.has(t))throw new TypeError("Cannot initialize the same private elements twice on an object")}function _classPrivateFieldInitSpec(t,e,r){_checkPrivateRedeclaration(t,e),e.set(t,r);}function _classPrivateMethodInitSpec(t,e){_checkPrivateRedeclaration(t,e),e.add(t);}_AsyncGenerator.prototype["function"==typeof Symbol&&Symbol.asyncIterator||"@@asyncIterator"]=function(){return this},_AsyncGenerator.prototype.next=function(t){return this._invoke("next",t)},_AsyncGenerator.prototype.throw=function(t){return this._invoke("throw",t)},_AsyncGenerator.prototype.return=function(t){return this._invoke("return",t)};var runtime={exports:{}};!function(t){var e=function(t){var e,r=Object.prototype,n=r.hasOwnProperty,o="function"==typeof Symbol?Symbol:{},i=o.iterator||"@@iterator",a=o.asyncIterator||"@@asyncIterator",c=o.toStringTag||"@@toStringTag";function u(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{u({},"");}catch(L){u=function(t,e,r){return t[e]=r};}function s(t,e,r,n){var o=e&&e.prototype instanceof v?e:v,i=Object.create(o.prototype),a=new E(n||[]);return i._invoke=function(t,e,r){var n=f;return function(o,i){if(n===y)throw new Error("Generator is already running");if(n===h){if("throw"===o)throw i;return I()}for(r.method=o,r.arg=i;;){var a=r.delegate;if(a){var c=x(a,r);if(c){if(c===d)continue;return c}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if(n===f)throw n=h,r.arg;r.dispatchException(r.arg);}else "return"===r.method&&r.abrupt("return",r.arg);n=y;var u=l(t,e,r);if("normal"===u.type){if(n=r.done?h:p,u.arg===d)continue;return {value:u.arg,done:r.done}}"throw"===u.type&&(n=h,r.method="throw",r.arg=u.arg);}}}(t,r,a),i}function l(t,e,r){try{return {type:"normal",arg:t.call(e,r)}}catch(L){return {type:"throw",arg:L}}}t.wrap=s;var f="suspendedStart",p="suspendedYield",y="executing",h="completed",d={};function v(){}function _(){}function b(){}var m={};u(m,i,(function(){return this}));var w=Object.getPrototypeOf,g=w&&w(w(T([])));g&&g!==r&&n.call(g,i)&&(m=g);var O=b.prototype=v.prototype=Object.create(m);function P(t){["next","throw","return"].forEach((function(e){u(t,e,(function(t){return this._invoke(e,t)}));}));}function S(t,e){function r(o,i,a,c){var u=l(t[o],t,i);if("throw"!==u.type){var s=u.arg,f=s.value;return f&&"object"===_typeof(f)&&n.call(f,"__await")?e.resolve(f.__await).then((function(t){r("next",t,a,c);}),(function(t){r("throw",t,a,c);})):e.resolve(f).then((function(t){s.value=t,a(s);}),(function(t){return r("throw",t,a,c)}))}c(u.arg);}var o;this._invoke=function(t,n){function i(){return new e((function(e,o){r(t,n,e,o);}))}return o=o?o.then(i,i):i()};}function x(t,r){var n=t.iterator[r.method];if(n===e){if(r.delegate=null,"throw"===r.method){if(t.iterator.return&&(r.method="return",r.arg=e,x(t,r),"throw"===r.method))return d;r.method="throw",r.arg=new TypeError("The iterator does not provide a 'throw' method");}return d}var o=l(n,t.iterator,r.arg);if("throw"===o.type)return r.method="throw",r.arg=o.arg,r.delegate=null,d;var i=o.arg;return i?i.done?(r[t.resultName]=i.value,r.next=t.nextLoc,"return"!==r.method&&(r.method="next",r.arg=e),r.delegate=null,d):i:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,d)}function A(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e);}function j(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e;}function E(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(A,this),this.reset(!0);}function T(t){if(t){var r=t[i];if(r)return r.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var o=-1,a=function r(){for(;++o<t.length;)if(n.call(t,o))return r.value=t[o],r.done=!1,r;return r.value=e,r.done=!0,r};return a.next=a}}return {next:I}}function I(){return {value:e,done:!0}}return _.prototype=b,u(O,"constructor",b),u(b,"constructor",_),_.displayName=u(b,c,"GeneratorFunction"),t.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return !!e&&(e===_||"GeneratorFunction"===(e.displayName||e.name))},t.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,b):(t.__proto__=b,u(t,c,"GeneratorFunction")),t.prototype=Object.create(O),t},t.awrap=function(t){return {__await:t}},P(S.prototype),u(S.prototype,a,(function(){return this})),t.AsyncIterator=S,t.async=function(e,r,n,o,i){void 0===i&&(i=Promise);var a=new S(s(e,r,n,o),i);return t.isGeneratorFunction(r)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},P(O),u(O,c,"Generator"),u(O,i,(function(){return this})),u(O,"toString",(function(){return "[object Generator]"})),t.keys=function(t){var e=[];for(var r in t)e.push(r);return e.reverse(),function r(){for(;e.length;){var n=e.pop();if(n in t)return r.value=n,r.done=!1,r}return r.done=!0,r}},t.values=T,E.prototype={constructor:E,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=e,this.done=!1,this.delegate=null,this.method="next",this.arg=e,this.tryEntries.forEach(j),!t)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=e);},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var r=this;function o(n,o){return c.type="throw",c.arg=t,r.next=n,o&&(r.method="next",r.arg=e),!!o}for(var i=this.tryEntries.length-1;i>=0;--i){var a=this.tryEntries[i],c=a.completion;if("root"===a.tryLoc)return o("end");if(a.tryLoc<=this.prev){var u=n.call(a,"catchLoc"),s=n.call(a,"finallyLoc");if(u&&s){if(this.prev<a.catchLoc)return o(a.catchLoc,!0);if(this.prev<a.finallyLoc)return o(a.finallyLoc)}else if(u){if(this.prev<a.catchLoc)return o(a.catchLoc,!0)}else {if(!s)throw new Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return o(a.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=e&&e<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=t,a.arg=e,i?(this.method="next",this.next=i.finallyLoc,d):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return "break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),d},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),j(r),d}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;j(r);}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,r,n){return this.delegate={iterator:T(t),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=e),d}},t}(t.exports);try{regeneratorRuntime=e;}catch(r){"object"===("undefined"==typeof globalThis?"undefined":_typeof(globalThis))?globalThis.regeneratorRuntime=e:Function("r","regeneratorRuntime = r")(e);}}(runtime);var regenerator=runtime.exports;function fixProto(t,e){var r=Object.setPrototypeOf;r?r(t,e):t.__proto__=e;}function fixStack(t,e){void 0===e&&(e=t.constructor);var r=Error.captureStackTrace;r&&r(t,e);}var __extends=function(){var t=function(e,r){return t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e;}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r]);},t(e,r)};return function(e,r){function n(){this.constructor=e;}t(e,r),e.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n);}}(),CustomError=function(t){function e(e){var r=this.constructor,n=t.call(this,e)||this;return Object.defineProperty(n,"name",{value:r.name,enumerable:!1,configurable:!0}),fixProto(n,r.prototype),fixStack(n),n}return __extends(e,t),e}(Error),appendChildren=function(t,e){(e=Array.isArray(e)?e:[e]).forEach((function(e){e instanceof HTMLElement?t.appendChild(e):(e||"string"==typeof e)&&t.appendChild(document.createTextNode(e.toString()));}));},setStyles=function(t,e){for(var r in e)t.style[r]=e[r];};

  /* minified: lib */
  var AssertionError=function(e){_inherits(r,e);var t=_createSuper(r);function r(){return _classCallCheck(this,r),t.apply(this,arguments)}return r}(_wrapNativeSuper(Error));function assert(e,t){if(!e)throw new AssertionError(null!=t?t:"Assertion failed")}function assertDefined(e,t){assert(void 0!==e,null!=t?t:"Assertion failed: Expected value to be defined");}function assertNonNull(e,t){assert(null!==e,null!=t?t:"Assertion failed: Expected value to be non-null");}function assertHasValue(e,t){assert(null!=e,null!=t?t:"Assertion failed: Expected value to be defined and non-null");}function qs(e,t){var r=qsMaybe(e,t);return assertNonNull(r,"Could not find required element"),r}function qsMaybe(e,t){return (null!=t?t:document).querySelector(e)}function qsa(e,t){var r=null!=t?t:document;return _toConsumableArray(r.querySelectorAll(e))}function parseDOM(e){return (new DOMParser).parseFromString(e,"text/html")}var LogLevel,_HANDLER_NAMES,separator="\n–\n",_footer=new WeakMap,_extraInfoLines=new WeakMap,_editNoteTextArea=new WeakMap,_removePreviousFooter=new WeakSet,EditNote=function(){function e(t){_classCallCheck(this,e),_classPrivateMethodInitSpec(this,_removePreviousFooter),_classPrivateFieldInitSpec(this,_footer,{writable:!0,value:void 0}),_classPrivateFieldInitSpec(this,_extraInfoLines,{writable:!0,value:void 0}),_classPrivateFieldInitSpec(this,_editNoteTextArea,{writable:!0,value:void 0}),_classPrivateFieldSet(this,_footer,t),_classPrivateFieldSet(this,_editNoteTextArea,qs("textarea.edit-note"));var r=_classPrivateFieldGet(this,_editNoteTextArea).value.split(separator)[0];_classPrivateFieldSet(this,_extraInfoLines,r?new Set(r.split("\n").map((function(e){return e.trimRight()}))):new Set);}return _createClass(e,[{key:"addExtraInfo",value:function(e){if(!_classPrivateFieldGet(this,_extraInfoLines).has(e)){var t=_classPrivateFieldGet(this,_editNoteTextArea).value.split(separator),r=_toArray(t),a=r[0],s=r.slice(1);a=(a+"\n"+e).trim(),_classPrivateFieldGet(this,_editNoteTextArea).value=[a].concat(_toConsumableArray(s)).join(separator),_classPrivateFieldGet(this,_extraInfoLines).add(e);}}},{key:"addFooter",value:function(){_classPrivateMethodGet(this,_removePreviousFooter,_removePreviousFooter2).call(this);var e=_classPrivateFieldGet(this,_editNoteTextArea).value;_classPrivateFieldGet(this,_editNoteTextArea).value=[e,separator,_classPrivateFieldGet(this,_footer)].join("");}}],[{key:"withFooterFromGMInfo",value:function(){var t=GM_info.script;return new e("".concat(t.name," ").concat(t.version,"\n").concat(t.namespace))}}]),e}();function _removePreviousFooter2(){var e=this,t=_classPrivateFieldGet(this,_editNoteTextArea).value.split(separator).filter((function(t){return t.trim()!==_classPrivateFieldGet(e,_footer)}));_classPrivateFieldGet(this,_editNoteTextArea).value=t.join(separator);}!function(e){e[e.DEBUG=0]="DEBUG",e[e.LOG=1]="LOG",e[e.INFO=2]="INFO",e[e.SUCCESS=3]="SUCCESS",e[e.WARNING=4]="WARNING",e[e.ERROR=5]="ERROR";}(LogLevel||(LogLevel={}));var HANDLER_NAMES=(_defineProperty(_HANDLER_NAMES={},LogLevel.DEBUG,"onDebug"),_defineProperty(_HANDLER_NAMES,LogLevel.LOG,"onLog"),_defineProperty(_HANDLER_NAMES,LogLevel.INFO,"onInfo"),_defineProperty(_HANDLER_NAMES,LogLevel.SUCCESS,"onSuccess"),_defineProperty(_HANDLER_NAMES,LogLevel.WARNING,"onWarn"),_defineProperty(_HANDLER_NAMES,LogLevel.ERROR,"onError"),_HANDLER_NAMES),DEFAULT_OPTIONS={logLevel:LogLevel.INFO,sinks:[]},_configuration=new WeakMap,_fireHandlers=new WeakSet,Logger=function(){function e(t){_classCallCheck(this,e),_classPrivateMethodInitSpec(this,_fireHandlers),_classPrivateFieldInitSpec(this,_configuration,{writable:!0,value:void 0}),_classPrivateFieldSet(this,_configuration,_objectSpread2(_objectSpread2({},DEFAULT_OPTIONS),t));}return _createClass(e,[{key:"debug",value:function(e){_classPrivateMethodGet(this,_fireHandlers,_fireHandlers2).call(this,LogLevel.DEBUG,e);}},{key:"log",value:function(e){_classPrivateMethodGet(this,_fireHandlers,_fireHandlers2).call(this,LogLevel.LOG,e);}},{key:"info",value:function(e){_classPrivateMethodGet(this,_fireHandlers,_fireHandlers2).call(this,LogLevel.INFO,e);}},{key:"success",value:function(e){_classPrivateMethodGet(this,_fireHandlers,_fireHandlers2).call(this,LogLevel.SUCCESS,e);}},{key:"warn",value:function(e){_classPrivateMethodGet(this,_fireHandlers,_fireHandlers2).call(this,LogLevel.WARNING,e);}},{key:"error",value:function(e,t){_classPrivateMethodGet(this,_fireHandlers,_fireHandlers2).call(this,LogLevel.ERROR,e,t);}},{key:"configure",value:function(e){Object.assign(_classPrivateFieldGet(this,_configuration),e);}},{key:"configuration",get:function(){return _classPrivateFieldGet(this,_configuration)}},{key:"addSink",value:function(e){_classPrivateFieldGet(this,_configuration).sinks.push(e);}}]),e}();function _fireHandlers2(e,t,r){e<_classPrivateFieldGet(this,_configuration).logLevel||_classPrivateFieldGet(this,_configuration).sinks.forEach((function(a){var s=a[HANDLER_NAMES[e]];s&&(r?s.call(a,t,r):s.call(a,t));}));}var LOGGER=new Logger,_scriptName=new WeakMap,_formatMessage=new WeakSet,ConsoleSink=function(){function e(t){_classCallCheck(this,e),_classPrivateMethodInitSpec(this,_formatMessage),_classPrivateFieldInitSpec(this,_scriptName,{writable:!0,value:void 0}),_defineProperty(this,"onSuccess",this.onInfo),_classPrivateFieldSet(this,_scriptName,t);}return _createClass(e,[{key:"onDebug",value:function(e){console.debug(_classPrivateMethodGet(this,_formatMessage,_formatMessage2).call(this,e));}},{key:"onLog",value:function(e){console.log(_classPrivateMethodGet(this,_formatMessage,_formatMessage2).call(this,e));}},{key:"onInfo",value:function(e){console.info(_classPrivateMethodGet(this,_formatMessage,_formatMessage2).call(this,e));}},{key:"onWarn",value:function(e){console.warn(_classPrivateMethodGet(this,_formatMessage,_formatMessage2).call(this,e));}},{key:"onError",value:function(e,t){e=_classPrivateMethodGet(this,_formatMessage,_formatMessage2).call(this,e),t?console.error(e,t):console.error(e);}}]),e}();function _formatMessage2(e){return "[".concat(_classPrivateFieldGet(this,_scriptName),"] ").concat(e)}var ResponseError=function(e){_inherits(r,CustomError);var t=_createSuper(r);function r(e,a){var s;return _classCallCheck(this,r),s=t.call(this,a),_defineProperty(_assertThisInitialized(s),"url",void 0),s.url=e,s}return r}(),HTTPResponseError=function(e){_inherits(r,ResponseError);var t=_createSuper(r);function r(e,a){var s;return _classCallCheck(this,r),s=t.call(this,e,"HTTP error ".concat(a.status,": ").concat(a.statusText)),_defineProperty(_assertThisInitialized(s),"statusCode",void 0),_defineProperty(_assertThisInitialized(s),"statusText",void 0),_defineProperty(_assertThisInitialized(s),"response",void 0),s.response=a,s.statusCode=a.status,s.statusText=a.statusText,s}return r}(),TimeoutError=function(e){_inherits(r,ResponseError);var t=_createSuper(r);function r(e){return _classCallCheck(this,r),t.call(this,e,"Request timed out")}return r}(),AbortedError=function(e){_inherits(r,ResponseError);var t=_createSuper(r);function r(e){return _classCallCheck(this,r),t.call(this,e,"Request aborted")}return r}(),NetworkError=function(e){_inherits(r,ResponseError);var t=_createSuper(r);function r(e){return _classCallCheck(this,r),t.call(this,e,"Network error")}return r}();function gmxhr(e,t){return _gmxhr.apply(this,arguments)}function _gmxhr(){return (_gmxhr=_asyncToGenerator(regenerator.mark((function e(t,r){return regenerator.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",new Promise((function(e,a){GM_xmlhttpRequest(_objectSpread2(_objectSpread2({method:"GET",url:t instanceof URL?t.href:t},null!=r?r:{}),{},{onload:function(r){r.status>=400?a(new HTTPResponseError(t,r)):e(r);},onerror:function(){a(new NetworkError(t));},onabort:function(){a(new AbortedError(t));},ontimeout:function(){a(new TimeoutError(t));}}));})));case 1:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function safeParseJSON(e,t){try{return JSON.parse(e)}catch(r){if(t)throw new Error(t+": "+r);return}}function retryTimes(e,t,r){return _retryTimes.apply(this,arguments)}function _retryTimes(){return (_retryTimes=_asyncToGenerator(regenerator.mark((function e(t,r,a){return regenerator.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!(r<=0)){e.next=2;break}return e.abrupt("return",Promise.reject(new TypeError("Invalid number of retry times: "+r)));case 2:return e.abrupt("return",new Promise((function(e,s){function n(){try{e(t());}catch(a){if(--r>0)return;s(a);}clearInterval(i);}var i=setInterval(n,a);n();})));case 3:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function getReleaseUrlARs(e){return _getReleaseUrlARs.apply(this,arguments)}function _getReleaseUrlARs(){return (_getReleaseUrlARs=_asyncToGenerator(regenerator.mark((function e(t){var r,a,s;return regenerator.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("/ws/2/release/".concat(t,"?inc=url-rels&fmt=json"));case 2:return a=e.sent,e.next=5,a.json();case 5:return s=e.sent,e.abrupt("return",null!==(r=s.relations)&&void 0!==r?r:[]);case 7:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function getURLsForRelease(e,t){return _getURLsForRelease.apply(this,arguments)}function _getURLsForRelease(){return (_getURLsForRelease=_asyncToGenerator(regenerator.mark((function e(t,r){var a,s,n,i,o;return regenerator.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return s=(a=null!=r?r:{}).excludeEnded,n=a.excludeDuplicates,e.next=3,getReleaseUrlARs(t);case 3:return i=e.sent,s&&(i=i.filter((function(e){return !e.ended}))),o=i.map((function(e){return e.url.resource})),n&&(o=Array.from(new Set(_toConsumableArray(o)))),e.abrupt("return",o.flatMap((function(e){try{return [new URL(e)]}catch(t){return console.warn("Found malformed URL linked to release: ".concat(e)),[]}})));case 8:case"end":return e.stop()}}),e)})))).apply(this,arguments)}

  var CoverArtProvider = /*#__PURE__*/function () {
    function CoverArtProvider() {
      _classCallCheck(this, CoverArtProvider);

      _defineProperty(this, "supportedDomains", void 0);

      _defineProperty(this, "name", void 0);

      _defineProperty(this, "urlRegex", void 0);
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
    }]);

    return CoverArtProvider;
  }();
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
      key: "findImages",
      value: // Providers for which the cover art can be retrieved from the head
      // og:image property and maximised using maxurl
      function () {
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
                  respDocument = (0, _context2.t0)(_context2.t1);
                  coverElmt = qs('head > meta[property="og:image"]', respDocument);
                  return _context2.abrupt("return", [{
                    url: new URL(coverElmt.content),
                    types: [ArtworkTypeIDs.Front]
                  }]);

                case 7:
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

    return AppleMusicProvider;
  }(HeadMetaPropertyProvider);

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
          var variables, extensions, resp, metadata, responseId;
          return regenerator.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  variables = encodeURIComponent(JSON.stringify({
                    discogsId: parseInt(releaseId),
                    count: 500
                  }));
                  extensions = encodeURIComponent(JSON.stringify({
                    persistedQuery: {
                      version: 1,
                      sha256Hash: QUERY_SHA256
                    }
                  }));
                  _context2.next = 4;
                  return gmxhr("https://www.discogs.com/internal/release-page/api/graphql?operationName=ReleaseAllImages&variables=".concat(variables, "&extensions=").concat(extensions));

                case 4:
                  resp = _context2.sent;
                  metadata = safeParseJSON(resp.responseText, 'Invalid response from Discogs API');
                  assertHasValue(metadata.data.release, 'Discogs release does not exist');
                  responseId = metadata.data.release.discogsId.toString();
                  assert(typeof responseId === 'undefined' || responseId === releaseId, "Discogs returned wrong release: Requested ".concat(releaseId, ", got ").concat(responseId));
                  return _context2.abrupt("return", metadata);

                case 10:
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

  var BandcampProvider = /*#__PURE__*/function (_HeadMetaPropertyProv) {
    _inherits(BandcampProvider, _HeadMetaPropertyProv);

    var _super = _createSuper(BandcampProvider);

    function BandcampProvider() {
      var _this;

      _classCallCheck(this, BandcampProvider);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));

      _defineProperty(_assertThisInitialized(_this), "supportedDomains", ['bandcamp.com']);

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
    }]);

    return BandcampProvider;
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

      _defineProperty(_assertThisInitialized(_this), "supportedDomains", ['amazon.ca', 'amazon.cn', 'amazon.de', 'amazon.es', 'amazon.fr', 'amazon.it', 'amazon.jp', 'amazon.nl', 'amazon.co.jp', 'amazon.co.uk', 'amazon.com']);

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
                  pageDom = parseDOM(pageContent); // Look for products which only have a single image, the front cover.

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

      _defineProperty(_assertThisInitialized(_this), "supportedDomains", ['music.amazon.ca', 'music.amazon.cn', 'music.amazon.de', 'music.amazon.es', 'music.amazon.fr', 'music.amazon.it', 'music.amazon.jp', 'music.amazon.nl', 'music.amazon.co.jp', 'music.amazon.co.uk', 'music.amazon.com']);

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

  var _extractImages = /*#__PURE__*/new WeakSet();

  var _convertCaptions = /*#__PURE__*/new WeakSet();

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

      _classPrivateMethodInitSpec(_assertThisInitialized(_this), _convertCaptions);

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
                  return _context.abrupt("return", _classPrivateMethodGet(this, _extractImages, _extractImages2).call(this, metadata));

                case 9:
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

    return covers.map(_classPrivateMethodGet(this, _convertCaptions, _convertCaptions2).bind(this));
  }

  function _convertCaptions2(cover) {
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

  var PROVIDER_DISPATCH = new Map();

  function add_provider(provider) {
    provider.supportedDomains.forEach(function (domain) {
      return PROVIDER_DISPATCH.set(domain, provider);
    });
  }

  add_provider(new AmazonProvider());
  add_provider(new AmazonMusicProvider());
  add_provider(new AppleMusicProvider());
  add_provider(new BandcampProvider());
  add_provider(new DeezerProvider());
  add_provider(new DiscogsProvider());
  add_provider(new QobuzProvider());
  add_provider(new SpotifyProvider());
  add_provider(new TidalProvider());
  add_provider(new VGMdbProvider());

  function extractDomain(url) {
    var domain = url.hostname; // Deal with bandcamp subdomains

    if (domain.endsWith('.bandcamp.com')) domain = 'bandcamp.com';
    domain = domain.replace(/^www\./, '');
    return domain;
  }

  function getProvider(url) {
    var provider = PROVIDER_DISPATCH.get(extractDomain(url));
    return provider !== null && provider !== void 0 && provider.supportsUrl(url) ? provider : undefined;
  }
  function hasProvider(url) {
    return !!getProvider(url);
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
              value: function onWarn(message) {
                  _classPrivateMethodGet(this, _setStatusBanner, _setStatusBanner2).call(this, message);
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
      if (exception && Object.hasOwnProperty.call(exception, 'message')) {
          _classPrivateFieldGet(this, _banner).textContent = message + ' ' + exception;
      } else {
          _classPrivateFieldGet(this, _banner).textContent = message;
      }
      _classPrivateFieldGet(this, _banner).style.removeProperty('display');
  }
  function _setStatusBannerClass2(newClass) {
      _classPrivateFieldGet(this, _banner).classList.replace(_classPrivateFieldGet(this, _currentMessageClass), newClass);
      _classPrivateFieldSet(this, _currentMessageClass, newClass);
  }

  var USERSCRIPT_NAME = "mb_enhanced_cover_art_uploads";

  var css_248z = ".ROpdebee_paste_url_cont{display:inline-block;margin-left:32px;vertical-align:middle}.ROpdebee_paste_url_cont>*{display:block}.ROpdebee_paste_url_cont>a{font-size:smaller;text-align:right}.ROpdebee_paste_url_cont+span{margin-left:32px}.ROpdebee_import_url_buttons{margin-left:32px;vertical-align:middle}.ROpdebee_import_url_buttons>button{display:block;float:none;margin:4px}#ROpdebee_paste_url_status.info{color:#000}#ROpdebee_paste_url_status.warning{color:orange}";

  var _urlInput = new WeakMap();
  var _buttonContainer = new WeakMap();
  var InputForm = function () {
      function InputForm(banner, onUrlFilled) {
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
          document.head.append(function () {
              var $$a = document.createElement('style');
              $$a.setAttribute('id', 'ROpdebee_' + USERSCRIPT_NAME);
              appendChildren($$a, css_248z);
              return $$a;
          }.call(this));
          _classPrivateFieldSet(this, _urlInput, function () {
              var $$c = document.createElement('input');
              $$c.setAttribute('type', 'url');
              $$c.setAttribute('placeholder', 'or paste a URL here');
              $$c.setAttribute('size', 47);
              $$c.setAttribute('id', 'ROpdebee_paste_url');
              $$c.addEventListener('input', function (evt) {
                  if (!evt.currentTarget.value)
                      return;
                  var url;
                  try {
                      url = new URL(evt.currentTarget.value.trim());
                  } catch (err) {
                      LOGGER.error('Invalid URL', err);
                      return;
                  }
                  onUrlFilled(url);
              });
              return $$c;
          }.call(this));
          var container = function () {
              var $$d = document.createElement('div');
              $$d.setAttribute('class', 'ROpdebee_paste_url_cont');
              appendChildren($$d, _classPrivateFieldGet(this, _urlInput));
              var $$f = document.createElement('a');
              $$f.setAttribute('href', 'https://github.com/ROpdebee/mb-userscripts/blob/main/src/mb_enhanced_cover_art_uploads/supportedProviders.md');
              $$f.setAttribute('target', '_blank');
              $$d.appendChild($$f);
              var $$g = document.createTextNode('\n                Supported providers\n            ');
              $$f.appendChild($$g);
              appendChildren($$d, banner);
              return $$d;
          }.call(this);
          _classPrivateFieldSet(this, _buttonContainer, function () {
              var $$i = document.createElement('div');
              $$i.setAttribute('class', 'ROpdebee_import_url_buttons buttons');
              return $$i;
          }.call(this));
          var orSpan = function () {
              var $$j = document.createElement('span');
              var $$k = document.createTextNode('or');
              $$j.appendChild($$k);
              return $$j;
          }.call(this);
          (_qs$insertAdjacentEle = qs('#drop-zone').insertAdjacentElement('afterend', container)) === null || _qs$insertAdjacentEle === void 0 ? void 0 : (_qs$insertAdjacentEle2 = _qs$insertAdjacentEle.insertAdjacentElement('afterend', orSpan)) === null || _qs$insertAdjacentEle2 === void 0 ? void 0 : _qs$insertAdjacentEle2.insertAdjacentElement('afterend', _classPrivateFieldGet(this, _buttonContainer));
      }
      _createClass(InputForm, [
          {
              key: 'clearOldInputValue',
              value: function clearOldInputValue(oldValue) {
                  if (_classPrivateFieldGet(this, _urlInput).value == oldValue) {
                      _classPrivateFieldGet(this, _urlInput).value = '';
                  }
              }
          },
          {
              key: 'addImportButton',
              value: function addImportButton(onClickCallback, url, provider) {
                  var button = function () {
                      var $$l = document.createElement('button');
                      $$l.setAttribute('type', 'button');
                      $$l.setAttribute('title', url);
                      $$l.addEventListener('click', function (evt) {
                          evt.preventDefault();
                          onClickCallback();
                      });
                      var $$m = document.createElement('img');
                      $$m.setAttribute('src', provider.favicon);
                      $$m.setAttribute('alt', provider.name);
                      $$l.appendChild($$m);
                      var $$n = document.createElement('span');
                      $$l.appendChild($$n);
                      appendChildren($$n, 'Import from ' + provider.name);
                      return $$l;
                  }.call(this);
                  _classPrivateFieldGet(this, _buttonContainer).insertAdjacentElement('beforeend', button);
              }
          }
      ]);
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
  function getMaximisedCandidates(_x) {
    return _getMaximisedCandidates.apply(this, arguments);
  }

  function _getMaximisedCandidates() {
    _getMaximisedCandidates = _wrapAsyncGenerator( /*#__PURE__*/regenerator.mark(function _callee(smallurl) {
      var exceptions;
      return regenerator.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _awaitAsyncGenerator(maximiseExceptions(smallurl));

            case 2:
              exceptions = _context.sent;

              if (!exceptions) {
                _context.next = 7;
                break;
              }

              return _context.delegateYield(_asyncGeneratorDelegate(_asyncIterator(exceptions), _awaitAsyncGenerator), "t0", 5);

            case 5:
              _context.next = 8;
              break;

            case 7:
              return _context.delegateYield(_asyncGeneratorDelegate(_asyncIterator(maximiseGeneric(smallurl)), _awaitAsyncGenerator), "t1", 8);

            case 8:
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
  }

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

  function maximiseExceptions(_x3) {
    return _maximiseExceptions.apply(this, arguments);
  }

  function _maximiseExceptions() {
    _maximiseExceptions = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee3(smallurl) {
      return regenerator.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              if (!(smallurl.hostname === 'img.discogs.com')) {
                _context3.next = 2;
                break;
              }

              return _context3.abrupt("return", maximiseDiscogs(smallurl));

            case 2:
              if (!smallurl.hostname.endsWith('.mzstatic.com')) {
                _context3.next = 4;
                break;
              }

              return _context3.abrupt("return", maximiseAppleMusic(smallurl));

            case 4:
              return _context3.abrupt("return");

            case 5:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));
    return _maximiseExceptions.apply(this, arguments);
  }

  function maximiseDiscogs(_x4) {
    return _maximiseDiscogs.apply(this, arguments);
  }

  function _maximiseDiscogs() {
    _maximiseDiscogs = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee4(smallurl) {
      var fullSizeURL;
      return regenerator.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return DiscogsProvider.maximiseImage(smallurl);

            case 2:
              fullSizeURL = _context4.sent;
              return _context4.abrupt("return", [{
                url: fullSizeURL,
                filename: fullSizeURL.pathname.split('/').at(-1),
                headers: {}
              }]);

            case 4:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));
    return _maximiseDiscogs.apply(this, arguments);
  }

  function maximiseAppleMusic(_x5) {
    return _maximiseAppleMusic.apply(this, arguments);
  }

  function _maximiseAppleMusic() {
    _maximiseAppleMusic = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee5(smallurl) {
      var results, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, imgGeneric;

      return regenerator.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
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
              _context5.prev = 3;
              _iterator = _asyncIterator(maximiseGeneric(smallurl));

            case 5:
              _context5.next = 7;
              return _iterator.next();

            case 7:
              if (!(_iteratorAbruptCompletion = !(_step = _context5.sent).done)) {
                _context5.next = 14;
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
              _context5.next = 5;
              break;

            case 14:
              _context5.next = 20;
              break;

            case 16:
              _context5.prev = 16;
              _context5.t0 = _context5["catch"](3);
              _didIteratorError = true;
              _iteratorError = _context5.t0;

            case 20:
              _context5.prev = 20;
              _context5.prev = 21;

              if (!(_iteratorAbruptCompletion && _iterator.return != null)) {
                _context5.next = 25;
                break;
              }

              _context5.next = 25;
              return _iterator.return();

            case 25:
              _context5.prev = 25;

              if (!_didIteratorError) {
                _context5.next = 28;
                break;
              }

              throw _iteratorError;

            case 28:
              return _context5.finish(25);

            case 29:
              return _context5.finish(20);

            case 30:
              return _context5.abrupt("return", results);

            case 31:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, null, [[3, 16, 20, 30], [21,, 25, 29]]);
    }));
    return _maximiseAppleMusic.apply(this, arguments);
  }

  function getFilename(url) {
    return url.pathname.split('/').at(-1) || 'image';
  }

  var _doneImages = /*#__PURE__*/new WeakMap();

  var _lastId = /*#__PURE__*/new WeakMap();

  var _urlAlreadyAdded = /*#__PURE__*/new WeakSet();

  var ImageFetcher = /*#__PURE__*/function () {
    // Monotonically increasing ID to uniquely identify the image. We use this
    // so we can later set the image type.
    function ImageFetcher() {
      _classCallCheck(this, ImageFetcher);

      _classPrivateMethodInitSpec(this, _urlAlreadyAdded);

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
        var _fetchImages = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(url) {
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

                  return _context.abrupt("return", this.fetchImagesFromProvider(url, provider));

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

        function fetchImages(_x) {
          return _fetchImages.apply(this, arguments);
        }

        return fetchImages;
      }()
    }, {
      key: "fetchImageFromURL",
      value: function () {
        var _fetchImageFromURL = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(url) {
          var fetchResult, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, maxCandidate, candidateName, errDesc;

          return regenerator.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  // Attempt to maximise the image
                  fetchResult = null;
                  _iteratorAbruptCompletion = false;
                  _didIteratorError = false;
                  _context2.prev = 3;
                  _iterator = _asyncIterator(getMaximisedCandidates(url));

                case 5:
                  _context2.next = 7;
                  return _iterator.next();

                case 7:
                  if (!(_iteratorAbruptCompletion = !(_step = _context2.sent).done)) {
                    _context2.next = 28;
                    break;
                  }

                  maxCandidate = _step.value;
                  candidateName = maxCandidate.filename || getFilename(maxCandidate.url);

                  if (!_classPrivateMethodGet(this, _urlAlreadyAdded, _urlAlreadyAdded2).call(this, maxCandidate.url)) {
                    _context2.next = 13;
                    break;
                  }

                  LOGGER.warn("".concat(candidateName, " has already been added"));
                  return _context2.abrupt("return");

                case 13:
                  _context2.prev = 13;
                  _context2.next = 16;
                  return this.fetchImageContents(maxCandidate.url, candidateName, maxCandidate.headers);

                case 16:
                  fetchResult = _context2.sent;
                  LOGGER.debug("Maximised ".concat(url.href, " to ").concat(maxCandidate.url.href));
                  return _context2.abrupt("break", 28);

                case 21:
                  _context2.prev = 21;
                  _context2.t0 = _context2["catch"](13);
                  errDesc = _context2.t0 instanceof Error ? _context2.t0.message :
                  /* istanbul ignore next: Not worth it */
                  _context2.t0;
                  LOGGER.warn("Skipping maximised candidate ".concat(candidateName, ": ").concat(errDesc));

                case 25:
                  _iteratorAbruptCompletion = false;
                  _context2.next = 5;
                  break;

                case 28:
                  _context2.next = 34;
                  break;

                case 30:
                  _context2.prev = 30;
                  _context2.t1 = _context2["catch"](3);
                  _didIteratorError = true;
                  _iteratorError = _context2.t1;

                case 34:
                  _context2.prev = 34;
                  _context2.prev = 35;

                  if (!(_iteratorAbruptCompletion && _iterator.return != null)) {
                    _context2.next = 39;
                    break;
                  }

                  _context2.next = 39;
                  return _iterator.return();

                case 39:
                  _context2.prev = 39;

                  if (!_didIteratorError) {
                    _context2.next = 42;
                    break;
                  }

                  throw _iteratorError;

                case 42:
                  return _context2.finish(39);

                case 43:
                  return _context2.finish(34);

                case 44:
                  if (fetchResult) {
                    _context2.next = 48;
                    break;
                  }

                  _context2.next = 47;
                  return this.fetchImageContents(url, getFilename(url), {});

                case 47:
                  fetchResult = _context2.sent;

                case 48:
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

                case 52:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, this, [[3, 30, 34, 44], [13, 21], [35,, 39, 43]]);
        }));

        function fetchImageFromURL(_x2) {
          return _fetchImageFromURL.apply(this, arguments);
        }

        return fetchImageFromURL;
      }()
    }, {
      key: "fetchImagesFromProvider",
      value: function () {
        var _fetchImagesFromProvider = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee3(url, provider) {
          var images, fetchResults, _iterator2, _step2, img, result, errDesc;

          return regenerator.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  LOGGER.info("Searching for images in ".concat(provider.name, " release\u2026")); // This could throw, assuming caller will catch.

                  _context3.next = 3;
                  return provider.findImages(url);

                case 3:
                  images = _context3.sent;
                  LOGGER.info("Found ".concat(images.length, " images in ").concat(provider.name, " release"));
                  fetchResults = [];
                  _iterator2 = _createForOfIteratorHelper(images);
                  _context3.prev = 7;

                  _iterator2.s();

                case 9:
                  if ((_step2 = _iterator2.n()).done) {
                    _context3.next = 29;
                    break;
                  }

                  img = _step2.value;

                  if (!_classPrivateMethodGet(this, _urlAlreadyAdded, _urlAlreadyAdded2).call(this, img.url)) {
                    _context3.next = 14;
                    break;
                  }

                  LOGGER.warn("".concat(getFilename(img.url), " has already been added"));
                  return _context3.abrupt("continue", 27);

                case 14:
                  _context3.prev = 14;
                  _context3.next = 17;
                  return this.fetchImageFromURL(img.url);

                case 17:
                  result = _context3.sent;

                  if (result) {
                    _context3.next = 20;
                    break;
                  }

                  return _context3.abrupt("continue", 27);

                case 20:
                  fetchResults.push(_objectSpread2(_objectSpread2({}, result), {}, {
                    types: img.types,
                    comment: img.comment
                  }));
                  _context3.next = 27;
                  break;

                case 23:
                  _context3.prev = 23;
                  _context3.t0 = _context3["catch"](14);
                  errDesc = _context3.t0 instanceof Error ? _context3.t0.message :
                  /* istanbul ignore next: Not worth it */
                  _context3.t0;
                  LOGGER.warn("Skipping ".concat(getFilename(img.url), ": ").concat(errDesc));

                case 27:
                  _context3.next = 9;
                  break;

                case 29:
                  _context3.next = 34;
                  break;

                case 31:
                  _context3.prev = 31;
                  _context3.t1 = _context3["catch"](7);

                  _iterator2.e(_context3.t1);

                case 34:
                  _context3.prev = 34;

                  _iterator2.f();

                  return _context3.finish(34);

                case 37:
                  _classPrivateFieldGet(this, _doneImages).add(url.href);

                  return _context3.abrupt("return", {
                    containerUrl: url,
                    images: fetchResults
                  });

                case 39:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3, this, [[7, 31, 34, 37], [14, 23]]);
        }));

        function fetchImagesFromProvider(_x3, _x4) {
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
                      var _this$lastId;

                      resolve({
                        requestedUrl: url,
                        fetchedUrl: fetchedUrl,
                        wasRedirected: wasRedirected,
                        file: new File([resp.response], "".concat(fileName, ".").concat((_classPrivateFieldSet(_this, _lastId, (_this$lastId = +_classPrivateFieldGet(_this, _lastId)) + 1), _this$lastId), ".").concat(mimeType.split('/')[1]), {
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

        function fetchImageContents(_x5, _x6, _x7) {
          return _fetchImageContents.apply(this, arguments);
        }

        return fetchImageContents;
      }()
    }]);

    return ImageFetcher;
  }();

  function _urlAlreadyAdded2(url) {
    return _classPrivateFieldGet(this, _doneImages).has(url.href);
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
        var params = this.images.flatMap(function (image, index) {
          return Object.entries(image).map(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2),
                key = _ref2[0],
                value = _ref2[1];

            return "x_seed.image.".concat(index, ".").concat(key, "=").concat(encodeValue(value));
          });
        });
        var imageParams = params.join('&');

        if (!this.origin) {
          return imageParams;
        }

        return imageParams + '&x_seed.origin=' + encodeURIComponent(this.origin);
      }
    }, {
      key: "createSeedURL",
      value: function createSeedURL(releaseId) {
        return "https://musicbrainz.org/release/".concat(releaseId, "/add-cover-art?").concat(this.encode());
      }
    }], [{
      key: "decode",
      value: function decode(allParams) {
        var _params$find;

        var params = allParams.replace(/^\?/, '').split('&').map(function (param) {
          return param.split('=');
        });
        var imageParams = params.filter(function (_ref3) {
          var _ref4 = _slicedToArray(_ref3, 1),
              k = _ref4[0];

          return k.startsWith('x_seed.image.');
        });
        var images = [];
        imageParams.forEach(function (_ref5) {
          var _ref6 = _slicedToArray(_ref5, 2),
              k = _ref6[0],
              v = _ref6[1];

          try {
            decodeSingleKeyValue(k, decodeURIComponent(v), images);
          } catch (err) {
            LOGGER.error("Invalid image seeding param ".concat(k, "=").concat(v), err);
          }
        }); // Sanity checks: Make sure all images have at least a URL, and condense
        // the array in case indices are missing. We'll condense by looping
        // through the array and pushing any valid image to a new one.

        var imagesCleaned = [];
        images.forEach(function (image, index) {
          // URL could be undefined if it either was never given as a param,
          // or if it was invalid.
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          if (image.url) {
            imagesCleaned.push(image);
          } else {
            LOGGER.warn("Ignoring seeded image ".concat(index, ": No URL provided"));
          }
        });
        var origin = (_params$find = params.find(function (_ref7) {
          var _ref8 = _slicedToArray(_ref7, 1),
              k = _ref8[0];

          return k === 'x_seed.origin';
        })) === null || _params$find === void 0 ? void 0 : _params$find[1];
        return new SeedParameters(imagesCleaned, origin ? decodeURIComponent(origin) : undefined);
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
          var _document$location$se, _document$location$se2;
          var mbid = (_document$location$se = document.location.search.match(/[?&]release_mbid=([a-f0-9-]+)/)) === null || _document$location$se === void 0 ? void 0 : _document$location$se[1];
          var selfId = (_document$location$se2 = document.location.search.match(/[?&]self_id=([a-zA-Z0-9_-]+)/)) === null || _document$location$se2 === void 0 ? void 0 : _document$location$se2[1];
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
          var imageUrl, ext, dimensionStr, countryCode, vendorId, vendorCode, releaseUrl, params, seedUrl, dimSpan, seedLink;
          return regenerator.wrap(function _callee$(_context) {
              while (1) {
                  switch (_context.prev = _context.next) {
                  case 0:
                      imageUrl = qs('a.icon', fig).href;
                      ext = (_imageUrl$match = imageUrl.match(/\.(\w+)$/)) === null || _imageUrl$match === void 0 ? void 0 : _imageUrl$match[1];
                      _context.next = 4;
                      return getImageDimensions(imageUrl);
                  case 4:
                      dimensionStr = _context.sent;
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
                          _context.next = 11;
                          break;
                      }
                      LOGGER.error('Could not extract required data for ' + fig.classList.value);
                      return _context.abrupt('return');
                  case 11:
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
                  case 17:
                  case 'end':
                      return _context.stop();
                  }
              }
          }, _callee);
      }));
      return _addSeedLinkToCover.apply(this, arguments);
  }
  function getImageDimensions(url) {
      return new Promise(function (resolve, reject) {
          var interval;
          var done = false;
          var img = function () {
              var $$e = document.createElement('img');
              $$e.setAttribute('src', url);
              $$e.addEventListener('load', function () {
                  clearInterval(interval);
                  if (!done) {
                      resolve(''.concat(img.naturalHeight, 'x').concat(img.naturalWidth));
                      done = true;
                  }
              });
              $$e.addEventListener('error', function () {
                  clearInterval(interval);
                  if (!done) {
                      done = true;
                      reject();
                  }
              });
              return $$e;
          }.call(this);
          interval = window.setInterval(function () {
              if (img.naturalHeight) {
                  resolve(''.concat(img.naturalHeight, 'x').concat(img.naturalWidth));
                  done = true;
                  clearInterval(interval);
                  img.src = '';
              }
          }, 50);
      });
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

  /* istanbul ignore file: Imports TSX, covered by E2E */
  registerSeeder(AtisketSeeder);
  registerSeeder(AtasketSeeder);

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

  function fillEditNote(_ref2, origin, editNote) {
    var images = _ref2.images,
        containerUrl = _ref2.containerUrl;
    // Nothing enqueued => Skip edit note altogether
    if (!images.length) return;
    var prefix = '';

    if (containerUrl) {
      prefix = ' * ';
      editNote.addExtraInfo(containerUrl.href);
    } // Limiting to 3 URLs to reduce noise


    var _iterator = _createForOfIteratorHelper(images.slice(0, 3)),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var queuedUrl = _step.value;

        // Prevent noise from data: URLs
        if (queuedUrl.maximisedUrl.protocol === 'data:') {
          editNote.addExtraInfo(prefix + 'Uploaded from data URL');
          continue;
        }

        editNote.addExtraInfo(prefix + queuedUrl.originalUrl.href);

        if (queuedUrl.wasMaximised) {
          editNote.addExtraInfo(' '.repeat(prefix.length) + '→ Maximised to ' + queuedUrl.maximisedUrl.href);
        }

        if (queuedUrl.wasRedirected) {
          editNote.addExtraInfo(' '.repeat(prefix.length) + '→ Redirected to ' + queuedUrl.fetchedUrl.href);
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    if (images.length > 3) {
      editNote.addExtraInfo(prefix + "\u2026and ".concat(images.length - 3, " additional image(s)"));
    }

    if (origin) {
      editNote.addExtraInfo("Seeded from ".concat(origin));
    }

    editNote.addFooter();
  }

  var _note = /*#__PURE__*/new WeakMap();

  var _fetcher = /*#__PURE__*/new WeakMap();

  var _ui = /*#__PURE__*/new WeakMap();

  var App = /*#__PURE__*/function () {
    function App() {
      _classCallCheck(this, App);

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

      _classPrivateFieldSet(this, _note, EditNote.withFooterFromGMInfo());

      _classPrivateFieldSet(this, _fetcher, new ImageFetcher());

      var banner = new StatusBanner();
      LOGGER.addSink(banner);

      _classPrivateFieldSet(this, _ui, new InputForm(banner.htmlElement, this.processURL.bind(this)));
    }

    _createClass(App, [{
      key: "processURL",
      value: function () {
        var _processURL = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(url) {
          var types,
              comment,
              origin,
              fetchResult,
              _args = arguments;
          return regenerator.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  types = _args.length > 1 && _args[1] !== undefined ? _args[1] : [];
                  comment = _args.length > 2 && _args[2] !== undefined ? _args[2] : '';
                  origin = _args.length > 3 && _args[3] !== undefined ? _args[3] : '';
                  _context.prev = 3;
                  _context.next = 6;
                  return _classPrivateFieldGet(this, _fetcher).fetchImages(url);

                case 6:
                  fetchResult = _context.sent;
                  _context.next = 13;
                  break;

                case 9:
                  _context.prev = 9;
                  _context.t0 = _context["catch"](3);
                  LOGGER.error('Failed to grab images', _context.t0);
                  return _context.abrupt("return");

                case 13:
                  _context.prev = 13;
                  _context.next = 16;
                  return enqueueImages(fetchResult, types, comment);

                case 16:
                  _context.next = 22;
                  break;

                case 18:
                  _context.prev = 18;
                  _context.t1 = _context["catch"](13);
                  LOGGER.error('Failed to enqueue images', _context.t1);
                  return _context.abrupt("return");

                case 22:
                  fillEditNote(fetchResult, origin, _classPrivateFieldGet(this, _note));

                  _classPrivateFieldGet(this, _ui).clearOldInputValue(url.href);

                  LOGGER.success("Successfully added ".concat(fetchResult.images.length, " image(s)"));

                case 25:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this, [[3, 9], [13, 18]]);
        }));

        function processURL(_x) {
          return _processURL.apply(this, arguments);
        }

        return processURL;
      }()
    }, {
      key: "processSeedingParameters",
      value: function processSeedingParameters() {
        var _this = this;

        var params = SeedParameters.decode(document.location.search);
        params.images.forEach(function (image) {
          return _this.processURL(image.url, image.types, image.comment, params.origin);
        });
      }
    }, {
      key: "addImportButtons",
      value: function () {
        var _addImportButtons = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2() {
          var _location$href$match,
              _this2 = this;

          var mbid, attachedURLs, supportedURLs;
          return regenerator.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  mbid = (_location$href$match = location.href.match(/musicbrainz\.org\/release\/([a-f0-9-]+)\//)) === null || _location$href$match === void 0 ? void 0 : _location$href$match[1];
                  assertHasValue(mbid);
                  _context2.next = 4;
                  return getURLsForRelease(mbid, {
                    excludeEnded: true,
                    excludeDuplicates: true
                  });

                case 4:
                  attachedURLs = _context2.sent;
                  supportedURLs = attachedURLs.filter(hasProvider);

                  if (supportedURLs.length) {
                    _context2.next = 8;
                    break;
                  }

                  return _context2.abrupt("return");

                case 8:
                  supportedURLs.forEach(function (url) {
                    var provider = getProvider(url);
                    assertHasValue(provider);

                    _classPrivateFieldGet(_this2, _ui).addImportButton(_this2.processURL.bind(_this2, url), url.href, provider);
                  });

                case 9:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2);
        }));

        function addImportButtons() {
          return _addImportButtons.apply(this, arguments);
        }

        return addImportButtons;
      }()
    }]);

    return App;
  }();

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
