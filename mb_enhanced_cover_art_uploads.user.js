// ==UserScript==
// @name         MB: Enhanced Cover Art Uploads
// @description  Enhance the cover art uploader! Upload directly from a URL, automatically import covers from Discogs/Spotify/Apple Music/..., automatically retrieve the largest version, and more!
// @version      2021.9.26
// @author       ROpdebee
// @license      MIT; https://opensource.org/licenses/MIT
// @namespace    https://github.com/ROpdebee/mb-userscripts
// @homepageURL  https://github.com/ROpdebee/mb-userscripts
// @supportURL   https://github.com/ROpdebee/mb-userscripts/issues
// @downloadURL  https://raw.github.com/ROpdebee/mb-userscripts/dist/mb_enhanced_cover_art_uploads.user.js
// @updateURL    https://raw.github.com/ROpdebee/mb-userscripts/dist/mb_enhanced_cover_art_uploads.meta.js
// @match        *://*.musicbrainz.org/release/*/add-cover-art
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

  /* minified: babel helpers, nativejsx, regenerator-runtime, @babel/runtime */
  var appendChildren=function(t,e){(e=Array.isArray(e)?e:[e]).forEach((function(e){e instanceof HTMLElement?t.appendChild(e):(e||"string"==typeof e)&&t.appendChild(document.createTextNode(e.toString()));}));},setStyles=function(t,e){for(var r in e)t.style[r]=e[r];};function ownKeys(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n);}return r}function _objectSpread2(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?ownKeys(Object(r),!0).forEach((function(e){_defineProperty(t,e,r[e]);})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):ownKeys(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e));}));}return t}function _typeof(t){return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},_typeof(t)}function _asyncIterator(t){var e;if("undefined"!=typeof Symbol&&(Symbol.asyncIterator&&(e=t[Symbol.asyncIterator]),null==e&&Symbol.iterator&&(e=t[Symbol.iterator])),null==e&&(e=t["@@asyncIterator"]),null==e&&(e=t["@@iterator"]),null==e)throw new TypeError("Object is not async iterable");return e.call(t)}function _AwaitValue(t){this.wrapped=t;}function _AsyncGenerator(t){var e,r;function n(e,r){try{var a=t[e](r),i=a.value,c=i instanceof _AwaitValue;Promise.resolve(c?i.wrapped:i).then((function(t){c?n("return"===e?"return":"next",t):o(a.done?"return":"normal",t);}),(function(t){n("throw",t);}));}catch(u){o("throw",u);}}function o(t,o){switch(t){case"return":e.resolve({value:o,done:!0});break;case"throw":e.reject(o);break;default:e.resolve({value:o,done:!1});}(e=e.next)?n(e.key,e.arg):r=null;}this._invoke=function(t,o){return new Promise((function(a,i){var c={key:t,arg:o,resolve:a,reject:i,next:null};r?r=r.next=c:(e=r=c,n(t,o));}))},"function"!=typeof t.return&&(this.return=void 0);}function _wrapAsyncGenerator(t){return function(){return new _AsyncGenerator(t.apply(this,arguments))}}function _awaitAsyncGenerator(t){return new _AwaitValue(t)}function asyncGeneratorStep(t,e,r,n,o,a,i){try{var c=t[a](i),u=c.value;}catch(s){return void r(s)}c.done?e(u):Promise.resolve(u).then(n,o);}function _asyncToGenerator(t){return function(){var e=this,r=arguments;return new Promise((function(n,o){var a=t.apply(e,r);function i(t){asyncGeneratorStep(a,n,o,i,c,"next",t);}function c(t){asyncGeneratorStep(a,n,o,i,c,"throw",t);}i(void 0);}))}}function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _defineProperties(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n);}}function _createClass(t,e,r){return e&&_defineProperties(t.prototype,e),r&&_defineProperties(t,r),t}function _defineProperty(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function _inherits(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&_setPrototypeOf(t,e);}function _getPrototypeOf(t){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)},_getPrototypeOf(t)}function _setPrototypeOf(t,e){return _setPrototypeOf=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t},_setPrototypeOf(t,e)}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return !1;if(Reflect.construct.sham)return !1;if("function"==typeof Proxy)return !0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return !1}}function _construct(t,e,r){return _construct=_isNativeReflectConstruct()?Reflect.construct:function(t,e,r){var n=[null];n.push.apply(n,e);var o=new(Function.bind.apply(t,n));return r&&_setPrototypeOf(o,r.prototype),o},_construct.apply(null,arguments)}function _isNativeFunction(t){return -1!==Function.toString.call(t).indexOf("[native code]")}function _wrapNativeSuper(t){var e="function"==typeof Map?new Map:void 0;return _wrapNativeSuper=function(t){if(null===t||!_isNativeFunction(t))return t;if("function"!=typeof t)throw new TypeError("Super expression must either be null or a function");if(void 0!==e){if(e.has(t))return e.get(t);e.set(t,r);}function r(){return _construct(t,arguments,_getPrototypeOf(this).constructor)}return r.prototype=Object.create(t.prototype,{constructor:{value:r,enumerable:!1,writable:!0,configurable:!0}}),_setPrototypeOf(r,t)},_wrapNativeSuper(t)}function _assertThisInitialized(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function _possibleConstructorReturn(t,e){if(e&&("object"==typeof e||"function"==typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return _assertThisInitialized(t)}function _createSuper(t){var e=_isNativeReflectConstruct();return function(){var r,n=_getPrototypeOf(t);if(e){var o=_getPrototypeOf(this).constructor;r=Reflect.construct(n,arguments,o);}else r=n.apply(this,arguments);return _possibleConstructorReturn(this,r)}}function _slicedToArray(t,e){return _arrayWithHoles(t)||_iterableToArrayLimit(t,e)||_unsupportedIterableToArray(t,e)||_nonIterableRest()}function _toArray(t){return _arrayWithHoles(t)||_iterableToArray(t)||_unsupportedIterableToArray(t)||_nonIterableRest()}function _toConsumableArray(t){return _arrayWithoutHoles(t)||_iterableToArray(t)||_unsupportedIterableToArray(t)||_nonIterableSpread()}function _arrayWithoutHoles(t){if(Array.isArray(t))return _arrayLikeToArray(t)}function _arrayWithHoles(t){if(Array.isArray(t))return t}function _iterableToArray(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}function _iterableToArrayLimit(t,e){var r=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=r){var n,o,a=[],i=!0,c=!1;try{for(r=r.call(t);!(i=(n=r.next()).done)&&(a.push(n.value),!e||a.length!==e);i=!0);}catch(u){c=!0,o=u;}finally{try{i||null==r.return||r.return();}finally{if(c)throw o}}return a}}function _unsupportedIterableToArray(t,e){if(t){if("string"==typeof t)return _arrayLikeToArray(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);return "Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?_arrayLikeToArray(t,e):void 0}}function _arrayLikeToArray(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _createForOfIteratorHelper(t,e){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!r){if(Array.isArray(t)||(r=_unsupportedIterableToArray(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,o=function(){};return {s:o,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,i=!0,c=!1;return {s:function(){r=r.call(t);},n:function(){var t=r.next();return i=t.done,t},e:function(t){c=!0,a=t;},f:function(){try{i||null==r.return||r.return();}finally{if(c)throw a}}}}function _classPrivateFieldGet(t,e){return _classApplyDescriptorGet(t,_classExtractFieldDescriptor(t,e,"get"))}function _classPrivateFieldSet(t,e,r){return _classApplyDescriptorSet(t,_classExtractFieldDescriptor(t,e,"set"),r),r}function _classExtractFieldDescriptor(t,e,r){if(!e.has(t))throw new TypeError("attempted to "+r+" private field on non-instance");return e.get(t)}function _classApplyDescriptorGet(t,e){return e.get?e.get.call(t):e.value}function _classApplyDescriptorSet(t,e,r){if(e.set)e.set.call(t,r);else {if(!e.writable)throw new TypeError("attempted to set read only private field");e.value=r;}}function _classPrivateMethodGet(t,e,r){if(!e.has(t))throw new TypeError("attempted to get private field on non-instance");return r}function _checkPrivateRedeclaration(t,e){if(e.has(t))throw new TypeError("Cannot initialize the same private elements twice on an object")}function _classPrivateFieldInitSpec(t,e,r){_checkPrivateRedeclaration(t,e),e.set(t,r);}function _classPrivateMethodInitSpec(t,e){_checkPrivateRedeclaration(t,e),e.add(t);}_AsyncGenerator.prototype["function"==typeof Symbol&&Symbol.asyncIterator||"@@asyncIterator"]=function(){return this},_AsyncGenerator.prototype.next=function(t){return this._invoke("next",t)},_AsyncGenerator.prototype.throw=function(t){return this._invoke("throw",t)},_AsyncGenerator.prototype.return=function(t){return this._invoke("return",t)};var runtime={exports:{}};!function(t){var e=function(t){var e,r=Object.prototype,n=r.hasOwnProperty,o="function"==typeof Symbol?Symbol:{},a=o.iterator||"@@iterator",i=o.asyncIterator||"@@asyncIterator",c=o.toStringTag||"@@toStringTag";function u(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{u({},"");}catch(L){u=function(t,e,r){return t[e]=r};}function s(t,e,r,n){var o=e&&e.prototype instanceof v?e:v,a=Object.create(o.prototype),i=new T(n||[]);return a._invoke=function(t,e,r){var n=f;return function(o,a){if(n===y)throw new Error("Generator is already running");if(n===h){if("throw"===o)throw a;return I()}for(r.method=o,r.arg=a;;){var i=r.delegate;if(i){var c=A(i,r);if(c){if(c===d)continue;return c}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if(n===f)throw n=h,r.arg;r.dispatchException(r.arg);}else "return"===r.method&&r.abrupt("return",r.arg);n=y;var u=l(t,e,r);if("normal"===u.type){if(n=r.done?h:p,u.arg===d)continue;return {value:u.arg,done:r.done}}"throw"===u.type&&(n=h,r.method="throw",r.arg=u.arg);}}}(t,r,i),a}function l(t,e,r){try{return {type:"normal",arg:t.call(e,r)}}catch(L){return {type:"throw",arg:L}}}t.wrap=s;var f="suspendedStart",p="suspendedYield",y="executing",h="completed",d={};function v(){}function _(){}function b(){}var m={};u(m,a,(function(){return this}));var w=Object.getPrototypeOf,g=w&&w(w(E([])));g&&g!==r&&n.call(g,a)&&(m=g);var O=b.prototype=v.prototype=Object.create(m);function S(t){["next","throw","return"].forEach((function(e){u(t,e,(function(t){return this._invoke(e,t)}));}));}function P(t,e){function r(o,a,i,c){var u=l(t[o],t,a);if("throw"!==u.type){var s=u.arg,f=s.value;return f&&"object"===_typeof(f)&&n.call(f,"__await")?e.resolve(f.__await).then((function(t){r("next",t,i,c);}),(function(t){r("throw",t,i,c);})):e.resolve(f).then((function(t){s.value=t,i(s);}),(function(t){return r("throw",t,i,c)}))}c(u.arg);}var o;this._invoke=function(t,n){function a(){return new e((function(e,o){r(t,n,e,o);}))}return o=o?o.then(a,a):a()};}function A(t,r){var n=t.iterator[r.method];if(n===e){if(r.delegate=null,"throw"===r.method){if(t.iterator.return&&(r.method="return",r.arg=e,A(t,r),"throw"===r.method))return d;r.method="throw",r.arg=new TypeError("The iterator does not provide a 'throw' method");}return d}var o=l(n,t.iterator,r.arg);if("throw"===o.type)return r.method="throw",r.arg=o.arg,r.delegate=null,d;var a=o.arg;return a?a.done?(r[t.resultName]=a.value,r.next=t.nextLoc,"return"!==r.method&&(r.method="next",r.arg=e),r.delegate=null,d):a:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,d)}function x(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e);}function j(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e;}function T(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(x,this),this.reset(!0);}function E(t){if(t){var r=t[a];if(r)return r.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var o=-1,i=function r(){for(;++o<t.length;)if(n.call(t,o))return r.value=t[o],r.done=!1,r;return r.value=e,r.done=!0,r};return i.next=i}}return {next:I}}function I(){return {value:e,done:!0}}return _.prototype=b,u(O,"constructor",b),u(b,"constructor",_),_.displayName=u(b,c,"GeneratorFunction"),t.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return !!e&&(e===_||"GeneratorFunction"===(e.displayName||e.name))},t.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,b):(t.__proto__=b,u(t,c,"GeneratorFunction")),t.prototype=Object.create(O),t},t.awrap=function(t){return {__await:t}},S(P.prototype),u(P.prototype,i,(function(){return this})),t.AsyncIterator=P,t.async=function(e,r,n,o,a){void 0===a&&(a=Promise);var i=new P(s(e,r,n,o),a);return t.isGeneratorFunction(r)?i:i.next().then((function(t){return t.done?t.value:i.next()}))},S(O),u(O,c,"Generator"),u(O,a,(function(){return this})),u(O,"toString",(function(){return "[object Generator]"})),t.keys=function(t){var e=[];for(var r in t)e.push(r);return e.reverse(),function r(){for(;e.length;){var n=e.pop();if(n in t)return r.value=n,r.done=!1,r}return r.done=!0,r}},t.values=E,T.prototype={constructor:T,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=e,this.done=!1,this.delegate=null,this.method="next",this.arg=e,this.tryEntries.forEach(j),!t)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=e);},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var r=this;function o(n,o){return c.type="throw",c.arg=t,r.next=n,o&&(r.method="next",r.arg=e),!!o}for(var a=this.tryEntries.length-1;a>=0;--a){var i=this.tryEntries[a],c=i.completion;if("root"===i.tryLoc)return o("end");if(i.tryLoc<=this.prev){var u=n.call(i,"catchLoc"),s=n.call(i,"finallyLoc");if(u&&s){if(this.prev<i.catchLoc)return o(i.catchLoc,!0);if(this.prev<i.finallyLoc)return o(i.finallyLoc)}else if(u){if(this.prev<i.catchLoc)return o(i.catchLoc,!0)}else {if(!s)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return o(i.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var a=o;break}}a&&("break"===t||"continue"===t)&&a.tryLoc<=e&&e<=a.finallyLoc&&(a=null);var i=a?a.completion:{};return i.type=t,i.arg=e,a?(this.method="next",this.next=a.finallyLoc,d):this.complete(i)},complete:function(t,e){if("throw"===t.type)throw t.arg;return "break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),d},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),j(r),d}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;j(r);}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,r,n){return this.delegate={iterator:E(t),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=e),d}},t}(t.exports);try{regeneratorRuntime=e;}catch(r){"object"===("undefined"==typeof globalThis?"undefined":_typeof(globalThis))?globalThis.regeneratorRuntime=e:Function("r","regeneratorRuntime = r")(e);}}(runtime);var regenerator=runtime.exports;

  /* minified: lib */
  var AssertionError=function(e){_inherits(r,e);var t=_createSuper(r);function r(){return _classCallCheck(this,r),t.apply(this,arguments)}return r}(_wrapNativeSuper(Error));function assert(e,t){if(!e)throw new AssertionError(null!=t?t:"Assertion failed")}function assertNonNull(e,t){assert(null!==e,null!=t?t:"Assertion failed: Expected value to be non-null");}function assertHasValue(e,t){assert(null!=e,null!=t?t:"Assertion failed: Expected value to be defined and non-null");}function qs(e,t){var r=qsMaybe(e,t);return assertNonNull(r,"Could not find required element"),r}function qsMaybe(e,t){return (null!=t?t:document).querySelector(e)}function qsa(e,t){var r=null!=t?t:document;return _toConsumableArray(r.querySelectorAll(e))}function parseDOM(e){return (new DOMParser).parseFromString(e,"text/html")}var separator="\n–\n",_footer=new WeakMap,_extraInfoLines=new WeakMap,_editNoteTextArea=new WeakMap,_removePreviousFooter=new WeakSet,EditNote=function(){function e(t){var r;_classCallCheck(this,e),_classPrivateMethodInitSpec(this,_removePreviousFooter),_classPrivateFieldInitSpec(this,_footer,{writable:!0,value:void 0}),_classPrivateFieldInitSpec(this,_extraInfoLines,{writable:!0,value:void 0}),_classPrivateFieldInitSpec(this,_editNoteTextArea,{writable:!0,value:void 0}),_classPrivateFieldSet(this,_footer,t),_classPrivateFieldSet(this,_editNoteTextArea,qs("textarea.edit-note"));var a=null!==(r=_classPrivateFieldGet(this,_editNoteTextArea).value.split(separator)[0])&&void 0!==r?r:"";_classPrivateFieldSet(this,_extraInfoLines,a?new Set(a.split("\n").map((function(e){return e.trimRight()}))):new Set);}return _createClass(e,[{key:"addExtraInfo",value:function(e){var t,r;if(!_classPrivateFieldGet(this,_extraInfoLines).has(e)){var a=_classPrivateFieldGet(this,_editNoteTextArea).value.split(separator),s=_toArray(a),i=s[0],n=s.slice(1);i=null!==(t=null===(r=i)||void 0===r?void 0:r.trim())&&void 0!==t?t:"",i+="\n"+e,_classPrivateFieldGet(this,_editNoteTextArea).value=[i].concat(_toConsumableArray(n)).join(separator),_classPrivateFieldGet(this,_extraInfoLines).add(e);}}},{key:"addFooter",value:function(){_classPrivateMethodGet(this,_removePreviousFooter,_removePreviousFooter2).call(this);var e=_classPrivateFieldGet(this,_editNoteTextArea).value;_classPrivateFieldGet(this,_editNoteTextArea).value=[e,separator,_classPrivateFieldGet(this,_footer)].join("");}}],[{key:"withFooterFromGMInfo",value:function(){var t=GM_info.script;return new e("".concat(t.name," ").concat(t.version,"\n").concat(t.namespace))}}]),e}();function _removePreviousFooter2(){var e=this,t=_classPrivateFieldGet(this,_editNoteTextArea).value.split(separator).filter((function(t){return !t.trim().startsWith(_classPrivateFieldGet(e,_footer))}));_classPrivateFieldGet(this,_editNoteTextArea).value=t.join(separator);}function gmxhr(e){return _gmxhr.apply(this,arguments)}function _gmxhr(){return (_gmxhr=_asyncToGenerator(regenerator.mark((function e(t){return regenerator.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",new Promise((function(e,r){var a=function(e,t){return r({reason:e,error:t})};GM_xmlhttpRequest(_objectSpread2(_objectSpread2({},t),{},{onload:function(t){t.status>=400?a("HTTP error ".concat(t.statusText),t):e(t);},onerror:function(e){return a("network error",e)},onabort:function(e){return a("aborted",e)},ontimeout:function(e){return a("timed out",e)}}));})));case 1:case"end":return e.stop()}}),e)})))).apply(this,arguments)}

  var css_248z = ".ROpdebee_paste_url_cont{display:inline-block;margin-left:32px;vertical-align:middle}.ROpdebee_paste_url_cont>*{display:block}.ROpdebee_paste_url_cont>a{font-size:smaller;text-align:right}.ROpdebee_paste_url_cont+span{margin-left:32px}.ROpdebee_import_url_buttons{margin-left:32px;vertical-align:middle}.ROpdebee_import_url_buttons>button{display:block;float:none;margin:4px}";

  function addAtisketSeedLinks() {
      var dispatch = {
          '/atasket.php': addOnComplementaryPage,
          '/': addOnOverviewPage
      };
      var adder = dispatch[document.location.pathname];
      if (adder) {
          adder();
      } else {
          console.error('Unsupported page for CAA URL upload seeder!');
      }
  }
  function addOnComplementaryPage() {
      var _document$location$se;
      var mbid = (_document$location$se = document.location.search.match(/[?&]release_mbid=([a-f0-9-]+)/)) === null || _document$location$se === void 0 ? void 0 : _document$location$se[1];
      if (!mbid) {
          console.error('Cannot figure out MBID :(');
          return;
      }
      addSeedLinkToCovers(mbid);
  }
  function addOnOverviewPage() {
      var alreadyInMB = qsMaybe('.already-in-mb-item');
      if (alreadyInMB === null) {
          return;
      }
      addSeedLinkToCovers(qs('a.mb', alreadyInMB).innerText.trim());
  }
  function addSeedLinkToCovers(mbid) {
      qsa('figure.cover').forEach(function (fig) {
          addSeedLinkToCover(fig, mbid);
      });
  }
  function addSeedLinkToCover(_x, _x2) {
      return _addSeedLinkToCover.apply(this, arguments);
  }
  function _addSeedLinkToCover() {
      _addSeedLinkToCover = _asyncToGenerator(regenerator.mark(function _callee(fig, mbid) {
          var _url$match;
          var url, ext, dimensionStr, seedUrl;
          return regenerator.wrap(function _callee$(_context) {
              while (1) {
                  switch (_context.prev = _context.next) {
                  case 0:
                      url = qs('a.icon', fig).href;
                      ext = (_url$match = url.match(/\.(\w+)$/)) === null || _url$match === void 0 ? void 0 : _url$match[1];
                      _context.next = 4;
                      return getImageDimensions(url);
                  case 4:
                      dimensionStr = _context.sent;
                      seedUrl = 'https://musicbrainz.org/release/'.concat(mbid, '/add-cover-art#artwork_url=').concat(encodeURIComponent(url), '&origin=atisket&artwork_type=Front');
                      qs('figcaption > a', fig).insertAdjacentElement('afterend', function () {
                          var $$a = document.createElement('a');
                          $$a.setAttribute('href', seedUrl);
                          setStyles($$a, { display: 'block' });
                          var $$b = document.createTextNode('\n            Add to release\n        ');
                          $$a.appendChild($$b);
                          return $$a;
                      }.call(this));
                      qs('figcaption > a', fig).insertAdjacentElement('afterend', function () {
                          var $$c = document.createElement('span');
                          setStyles($$c, { display: 'block' });
                          appendChildren($$c, dimensionStr + (ext ? ' '.concat(ext.toUpperCase()) : ''));
                          return $$c;
                      }.call(this));
                  case 8:
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

  // Not sure if this changes often. If it does, we might have to parse it from the
  // JS sources somehow.
  var QUERY_SHA256 = '13e41f41a02b02d0a7e855a71e1a02478fd2fb0a2d104b54931d649e1d7c6ecd';
  var DiscogsProvider = /*#__PURE__*/function () {
    function DiscogsProvider() {
      _classCallCheck(this, DiscogsProvider);

      _defineProperty(this, "supportedDomains", ['discogs.com']);

      _defineProperty(this, "favicon", 'https://catalog-assets.discogs.com/e95f0cd9.png');

      _defineProperty(this, "name", 'Discogs');
    }

    _createClass(DiscogsProvider, [{
      key: "supportsUrl",
      value: function supportsUrl(url) {
        return /\/release\/\d+/.test(url.pathname);
      }
    }, {
      key: "findImages",
      value: function () {
        var _findImages = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(url) {
          var _url$pathname$match;

          var releaseId, data;
          return regenerator.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  // Loading the full HTML and parsing the metadata JSON embedded within
                  // it.
                  releaseId = (_url$pathname$match = url.pathname.match(/\/release\/(\d+)/)) === null || _url$pathname$match === void 0 ? void 0 : _url$pathname$match[1];
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
          }, _callee);
        }));

        function findImages(_x) {
          return _findImages.apply(this, arguments);
        }

        return findImages;
      }()
    }], [{
      key: "getReleaseImages",
      value: function () {
        var _getReleaseImages = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(releaseId) {
          var variables, extensions, resp;
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
                  return gmxhr({
                    url: "https://www.discogs.com/internal/release-page/api/graphql?operationName=ReleaseAllImages&variables=".concat(variables, "&extensions=").concat(extensions),
                    method: 'GET'
                  });

                case 4:
                  resp = _context2.sent;
                  return _context2.abrupt("return", JSON.parse(resp.responseText));

                case 6:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2);
        }));

        function getReleaseImages(_x2) {
          return _getReleaseImages.apply(this, arguments);
        }

        return getReleaseImages;
      }()
    }, {
      key: "maximiseImage",
      value: function () {
        var _maximiseImage = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee3(url) {
          var _url$pathname$match2, _imageName$match;

          var imageName, releaseId, releaseData, matchedImage;
          return regenerator.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  // Maximising by querying the API for all images of the release, finding
                  // the right one, and extracting the "full size" (i.e., 600x600 JPEG) URL.
                  imageName = (_url$pathname$match2 = url.pathname.match(/discogs-images\/(R-.+)$/)) === null || _url$pathname$match2 === void 0 ? void 0 : _url$pathname$match2[1];
                  releaseId = imageName === null || imageName === void 0 ? void 0 : (_imageName$match = imageName.match(/^R-(\d+)/)) === null || _imageName$match === void 0 ? void 0 : _imageName$match[1];

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
  }();

  var maxurl = $$IMU_EXPORT$$;
  var options = {
    fill_object: true,
    exclude_videos: true,
    filter: function filter(url) {
      return !url.toLowerCase().endsWith('.webp') // Blocking webp images in Discogs
      && !/:format(webp)/.test(url.toLowerCase());
    }
  };
  function getMaxUrlCandidates(_x) {
    return _getMaxUrlCandidates.apply(this, arguments);
  }

  function _getMaxUrlCandidates() {
    _getMaxUrlCandidates = _wrapAsyncGenerator( /*#__PURE__*/regenerator.mark(function _callee(smallurl) {
      var p, results, i, current;
      return regenerator.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!(smallurl.hostname === 'img.discogs.com')) {
                _context.next = 4;
                break;
              }

              _context.next = 3;
              return getMaxUrlDiscogs(smallurl);

            case 3:
              return _context.abrupt("return");

            case 4:
              p = new Promise(function (resolve) {
                maxurl(smallurl.href, _objectSpread2(_objectSpread2({}, options), {}, {
                  cb: resolve
                }));
              });
              _context.next = 7;
              return _awaitAsyncGenerator(p);

            case 7:
              results = _context.sent;
              i = 0;

            case 9:
              if (!(i < results.length)) {
                _context.next = 23;
                break;
              }

              current = results[i]; // Filter out results that will definitely not work

              if (!(current.fake || current.bad || current.likely_broken)) {
                _context.next = 13;
                break;
              }

              return _context.abrupt("continue", 20);

            case 13:
              _context.prev = 13;
              _context.next = 16;
              return _objectSpread2(_objectSpread2({}, current), {}, {
                url: new URL(current.url)
              });

            case 16:
              _context.next = 20;
              break;

            case 18:
              _context.prev = 18;
              _context.t0 = _context["catch"](13);

            case 20:
              i++;
              _context.next = 9;
              break;

            case 23:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[13, 18]]);
    }));
    return _getMaxUrlCandidates.apply(this, arguments);
  }

  function getMaxUrlDiscogs(_x2) {
    return _getMaxUrlDiscogs.apply(this, arguments);
  }

  function _getMaxUrlDiscogs() {
    _getMaxUrlDiscogs = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(smallurl) {
      var fullSizeURL;
      return regenerator.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return DiscogsProvider.maximiseImage(smallurl);

            case 2:
              fullSizeURL = _context2.sent;
              return _context2.abrupt("return", {
                url: fullSizeURL,
                filename: fullSizeURL.pathname.split('/').at(-1),
                headers: {}
              });

            case 4:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));
    return _getMaxUrlDiscogs.apply(this, arguments);
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

  var HeadMetaPropertyProvider = /*#__PURE__*/function () {
    function HeadMetaPropertyProvider() {
      _classCallCheck(this, HeadMetaPropertyProvider);

      _defineProperty(this, "supportedDomains", void 0);

      _defineProperty(this, "favicon", void 0);

      _defineProperty(this, "name", void 0);
    }

    _createClass(HeadMetaPropertyProvider, [{
      key: "findImages",
      value: // Providers for which the cover art can be retrieved from the head
      // og:image property and maximised using maxurl
      function () {
        var _findImages = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(url) {
          var resp, respDocument, coverElmt;
          return regenerator.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return gmxhr({
                    url: url.href,
                    method: 'GET'
                  });

                case 2:
                  resp = _context.sent;
                  respDocument = parseDOM(resp.responseText);
                  coverElmt = qs('head > meta[property="og:image"]', respDocument);
                  return _context.abrupt("return", [{
                    url: new URL(coverElmt.content),
                    type: [ArtworkTypeIDs.Front]
                  }]);

                case 6:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        function findImages(_x) {
          return _findImages.apply(this, arguments);
        }

        return findImages;
      }()
    }]);

    return HeadMetaPropertyProvider;
  }();

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

      return _this;
    }

    _createClass(AppleMusicProvider, [{
      key: "supportsUrl",
      value: function supportsUrl(url) {
        return /\w{2}\/album\/(?:.+\/)?(?:id)?\d+/.test(url.pathname);
      }
    }]);

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

      return _this;
    }

    _createClass(DeezerProvider, [{
      key: "supportsUrl",
      value: function supportsUrl(url) {
        return /(?:\w{2}\/)?album\/\d+/.test(url.pathname);
      }
    }]);

    return DeezerProvider;
  }(HeadMetaPropertyProvider);

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

      return _this;
    }

    _createClass(SpotifyProvider, [{
      key: "supportsUrl",
      value: function supportsUrl(url) {
        return /\/album\/\w+/.test(url.pathname);
      }
    }]);

    return SpotifyProvider;
  }(HeadMetaPropertyProvider);

  var TidalProvider = /*#__PURE__*/function () {
    function TidalProvider() {
      _classCallCheck(this, TidalProvider);

      _defineProperty(this, "supportedDomains", ['tidal.com', 'listen.tidal.com', 'store.tidal.com']);

      _defineProperty(this, "favicon", 'https://listen.tidal.com/favicon.ico');

      _defineProperty(this, "name", 'Tidal');
    }

    _createClass(TidalProvider, [{
      key: "supportsUrl",
      value: function supportsUrl(url) {
        return /\/album\/\d+/.test(url.pathname);
      }
    }, {
      key: "findImages",
      value: function () {
        var _findImages = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(url) {
          var _url$pathname$match;

          var albumId, resp, respDocument, coverElmt;
          return regenerator.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  // Rewrite the URL to point to the main page
                  albumId = (_url$pathname$match = url.pathname.match(/\/album\/(\d+)/)) === null || _url$pathname$match === void 0 ? void 0 : _url$pathname$match[1];
                  assertHasValue(albumId);
                  url.href = "https://tidal.com/browse/album/".concat(albumId);
                  _context.next = 5;
                  return gmxhr({
                    url: url.href,
                    method: 'GET'
                  });

                case 5:
                  resp = _context.sent;
                  respDocument = parseDOM(resp.responseText);

                  if (!(qsMaybe('p#cmsg') !== null)) {
                    _context.next = 9;
                    break;
                  }

                  throw {
                    reason: 'captcha'
                  };

                case 9:
                  coverElmt = qs('head > meta[property="og:image"]', respDocument);
                  return _context.abrupt("return", [{
                    url: new URL(coverElmt.content),
                    type: [ArtworkTypeIDs.Front]
                  }]);

                case 11:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        function findImages(_x) {
          return _findImages.apply(this, arguments);
        }

        return findImages;
      }()
    }]);

    return TidalProvider;
  }();

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

      return _this;
    }

    _createClass(BandcampProvider, [{
      key: "supportsUrl",
      value: function supportsUrl(url) {
        return /bandcamp\.com\/(?:track|album)\//.test(url.href);
      }
    }]);

    return BandcampProvider;
  }(HeadMetaPropertyProvider);

  var _extractFromStreamingProduct = /*#__PURE__*/new WeakSet();

  var AmazonProvider = /*#__PURE__*/function () {
    function AmazonProvider() {
      _classCallCheck(this, AmazonProvider);

      _classPrivateMethodInitSpec(this, _extractFromStreamingProduct);

      _defineProperty(this, "supportedDomains", ['amazon.ca', 'amazon.cn', 'amazon.de', 'amazon.es', 'amazon.fr', 'amazon.it', 'amazon.jp', 'amazon.nl', 'amazon.co.jp', 'amazon.co.uk', 'amazon.com']);

      _defineProperty(this, "favicon", GM_getResourceURL('amazonFavicon'));

      _defineProperty(this, "name", 'Amazon');
    }

    _createClass(AmazonProvider, [{
      key: "supportsUrl",
      value: function supportsUrl(url) {
        return /\/(?:gp\/product|dp)\/[A-Za-z0-9]{10}(?:\/|$)/.test(url.pathname);
      }
    }, {
      key: "findImages",
      value: function () {
        var _findImages = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(url) {
          var pageResp, pageDom, imgs, covers;
          return regenerator.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return gmxhr({
                    url: url.href,
                    method: 'GET'
                  });

                case 2:
                  pageResp = _context.sent;
                  pageDom = parseDOM(pageResp.responseText);

                  if (!(qsMaybe('#digitalMusicProductImage_feature_div', pageDom) !== null)) {
                    _context.next = 6;
                    break;
                  }

                  return _context.abrupt("return", _classPrivateMethodGet(this, _extractFromStreamingProduct, _extractFromStreamingProduct2).call(this, pageDom));

                case 6:
                  // Thumbnails in the sidebar, IMU will maximise
                  imgs = qsa('#altImages img', pageDom);
                  covers = imgs.map(function (img) {
                    return {
                      url: new URL(img.src)
                    };
                  }); // We don't know anything about the types of these images, but we can
                  // probably assume the first image is the front cover.

                  if (covers.length) {
                    covers[0].type = [ArtworkTypeIDs.Front];
                  }

                  return _context.abrupt("return", covers);

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

    return AmazonProvider;
  }();

  function _extractFromStreamingProduct2(doc) {
    var img = qs('#digitalMusicProductImage_feature_div > img', doc); // For MP3/Streaming releases, we know the cover is the front one.
    // Only returning the thumbnail, IMU will maximise

    return [{
      url: new URL(img.src),
      type: [ArtworkTypeIDs.Front]
    }];
  }

  var AmazonMusicProvider = /*#__PURE__*/function () {
    function AmazonMusicProvider() {
      _classCallCheck(this, AmazonMusicProvider);

      _defineProperty(this, "supportedDomains", ['music.amazon.ca', 'music.amazon.cn', 'music.amazon.de', 'music.amazon.es', 'music.amazon.fr', 'music.amazon.it', 'music.amazon.jp', 'music.amazon.nl', 'music.amazon.co.jp', 'music.amazon.co.uk', 'music.amazon.com']);

      _defineProperty(this, "favicon", 'https://d5fx445wy2wpk.cloudfront.net/icons/amznMusic_favicon.png');

      _defineProperty(this, "name", 'Amazon Music');
    }

    _createClass(AmazonMusicProvider, [{
      key: "supportsUrl",
      value: function supportsUrl(url) {
        return /\/albums\/[A-Za-z0-9]{10}(?:\/|$)/.test(url.pathname);
      }
    }, {
      key: "findImages",
      value: function () {
        var _findImages = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(url) {
          var _url$pathname$match;

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
                  asin = (_url$pathname$match = url.pathname.match(/\/albums\/([A-Za-z0-9]{10})(?:\/|$)/)) === null || _url$pathname$match === void 0 ? void 0 : _url$pathname$match[1];
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
          }, _callee);
        }));

        function findImages(_x) {
          return _findImages.apply(this, arguments);
        }

        return findImages;
      }()
    }]);

    return AmazonMusicProvider;
  }();

  // title in the URL, open.qobuz.com does not. Although we could make the album
  // title part optional and match both domains with the same regexp, this could
  // lead to issues with URLs like this:
  // https://open.qobuz.com/album/1234567890/related
  // Not sure if such URLs would ever occur, but using a single regexp could
  // lead to `related` being matched as the ID and the actual ID as the title.

  var WWW_ID_MATCH_REGEX = /\/album\/[^/]+\/([A-Za-z0-9]+)(?:\/|$)/;
  var OPEN_ID_MATCH_REGEX = /\/album\/([A-Za-z0-9]+)(?:\/|$)/; // Assuming this doesn't change often. If it does, we might have to extract it
  // from the JS code loaded on open.qobuz.com, but for simplicity's sake, let's
  // just use a constant app ID first.

  var QOBUZ_APP_ID = 712109809;
  var QobuzProvider = /*#__PURE__*/function () {
    function QobuzProvider() {
      _classCallCheck(this, QobuzProvider);

      _defineProperty(this, "supportedDomains", ['qobuz.com', 'open.qobuz.com']);

      _defineProperty(this, "favicon", 'https://www.qobuz.com/favicon.ico');

      _defineProperty(this, "name", 'Qobuz');
    }

    _createClass(QobuzProvider, [{
      key: "supportsUrl",
      value: function supportsUrl(url) {
        if (url.hostname === 'open.qobuz.com') {
          return OPEN_ID_MATCH_REGEX.test(url.pathname);
        }

        return WWW_ID_MATCH_REGEX.test(url.pathname);
      }
    }, {
      key: "findImages",
      value: function () {
        var _findImages = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(url) {
          var _metadata$goodies;

          var id, metadata, goodies, coverUrl;
          return regenerator.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  id = QobuzProvider.extractId(url); // eslint-disable-next-line init-declarations

                  _context.prev = 1;
                  _context.next = 4;
                  return QobuzProvider.getMetadata(id);

                case 4:
                  metadata = _context.sent;
                  _context.next = 11;
                  break;

                case 7:
                  _context.prev = 7;
                  _context.t0 = _context["catch"](1);
                  // We could use the URL rewriting technique to still get the cover,
                  // but if we do that, we'd have to swallow this error. It's better
                  // to just throw here, IMO, so we could fix any error.
                  console.error(_context.t0);
                  throw new Error('Could not retrieve Qobuz metadata, app ID invalid?');

                case 11:
                  goodies = ((_metadata$goodies = metadata.goodies) !== null && _metadata$goodies !== void 0 ? _metadata$goodies : []).map(QobuzProvider.extractGoodies);
                  coverUrl = metadata.image.large.replace(/_\d+\.([a-zA-Z0-9]+)$/, '_org.$1');
                  return _context.abrupt("return", [{
                    url: new URL(coverUrl),
                    type: [ArtworkTypeIDs.Front]
                  }].concat(_toConsumableArray(goodies)));

                case 14:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, null, [[1, 7]]);
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
      key: "extractId",
      value: function extractId(url) {
        // eslint-disable-next-line init-declarations
        var id;

        if (url.hostname === 'open.qobuz.com') {
          var _url$pathname$match;

          id = (_url$pathname$match = url.pathname.match(OPEN_ID_MATCH_REGEX)) === null || _url$pathname$match === void 0 ? void 0 : _url$pathname$match[1];
        } else {
          var _url$pathname$match2;

          id = (_url$pathname$match2 = url.pathname.match(WWW_ID_MATCH_REGEX)) === null || _url$pathname$match2 === void 0 ? void 0 : _url$pathname$match2[1];
        }

        assertHasValue(id);
        return id;
      }
    }, {
      key: "getMetadata",
      value: function () {
        var _getMetadata = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(id) {
          var resp;
          return regenerator.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.next = 2;
                  return gmxhr({
                    url: "https://www.qobuz.com/api.json/0.2/album/get?album_id=".concat(id, "&offset=0&limit=20"),
                    method: 'GET',
                    headers: {
                      'x-app-id': QOBUZ_APP_ID
                    }
                  });

                case 2:
                  resp = _context2.sent;
                  return _context2.abrupt("return", JSON.parse(resp.responseText));

                case 4:
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
        var isBooklet = goodie.name === 'Livret Numérique';
        return {
          url: new URL(goodie.original_url),
          type: isBooklet ? [ArtworkTypeIDs.Booklet] : [],
          comment: isBooklet ? 'Qobuz booklet' : goodie.name
        };
      }
    }]);

    return QobuzProvider;
  }();

  var ID_REGEX = /\/album\/(\d+)(?:\/|$)/; // Not full, only what we need

  function mapJacketType(caption) {
    if (!caption) return [ArtworkTypeIDs.Front, ArtworkTypeIDs.Back, ArtworkTypeIDs.Spine];
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

    if (otherKeywords.length) {
      return {
        type: types,
        comment: otherKeywords.join(' ')
      };
    }

    return types;
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
      var ret = typeof value === 'function' ? value(caption) : value;

      if (Object.prototype.hasOwnProperty.call(ret, 'type') && Object.prototype.hasOwnProperty.call(ret, 'comment')) {
        var _retObj = ret;
        return {
          type: Array.isArray(_retObj.type) ? _retObj.type : [_retObj.type],
          comment: _retObj.comment
        };
      }

      var retObj = ret;
      return {
        type: Array.isArray(retObj) ? retObj : [retObj],
        comment: caption
      };
    };
  };

  for (var _i = 0, _Object$entries = Object.entries(__CAPTION_TYPE_MAPPING); _i < _Object$entries.length; _i++) {
    _loop();
  }

  var _extractImages = /*#__PURE__*/new WeakSet();

  var _convertCaptions = /*#__PURE__*/new WeakSet();

  var VGMdbProvider = /*#__PURE__*/function () {
    function VGMdbProvider() {
      _classCallCheck(this, VGMdbProvider);

      _classPrivateMethodInitSpec(this, _convertCaptions);

      _classPrivateMethodInitSpec(this, _extractImages);

      _defineProperty(this, "supportedDomains", ['vgmdb.net']);

      _defineProperty(this, "favicon", 'https://vgmdb.net/favicon.ico');

      _defineProperty(this, "name", 'VGMdb');
    }

    _createClass(VGMdbProvider, [{
      key: "supportsUrl",
      value: function supportsUrl(url) {
        return ID_REGEX.test(url.pathname);
      }
    }, {
      key: "findImages",
      value: function () {
        var _findImages = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(url) {
          var _url$pathname$match;

          var id, apiUrl, apiResp, metadata;
          return regenerator.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  // Using the unofficial API at vgmdb.info
                  id = (_url$pathname$match = url.pathname.match(ID_REGEX)) === null || _url$pathname$match === void 0 ? void 0 : _url$pathname$match[1];
                  assertHasValue(id);
                  apiUrl = "https://vgmdb.info/album/".concat(id, "?format=json");
                  _context.next = 5;
                  return gmxhr({
                    url: apiUrl,
                    method: 'GET'
                  });

                case 5:
                  apiResp = _context.sent;
                  metadata = JSON.parse(apiResp.responseText);
                  return _context.abrupt("return", _classPrivateMethodGet(this, _extractImages, _extractImages2).call(this, metadata));

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

    return VGMdbProvider;
  }();

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

    if (domain.endsWith('bandcamp.com')) domain = 'bandcamp.com';
    domain = domain.replace(/^www\./, '');
    return domain;
  }

  function getProvider(url) {
    return PROVIDER_DISPATCH.get(extractDomain(url));
  }
  function hasProvider(url) {
    return PROVIDER_DISPATCH.has(extractDomain(url));
  }
  function findImages(_x) {
    return _findImages.apply(this, arguments);
  }

  function _findImages() {
    _findImages = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(url) {
      var provider;
      return regenerator.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              provider = getProvider(url);

              if (!(!provider || !provider.supportsUrl(url))) {
                _context.next = 3;
                break;
              }

              return _context.abrupt("return");

            case 3:
              return _context.abrupt("return", provider.findImages(url));

            case 4:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _findImages.apply(this, arguments);
  }

  var _elmt = new WeakMap();
  var StatusBanner = function () {
      function StatusBanner() {
          _classCallCheck(this, StatusBanner);
          _classPrivateFieldInitSpec(this, _elmt, {
              writable: true,
              value: void 0
          });
          _classPrivateFieldSet(this, _elmt, function () {
              var $$a = document.createElement('span');
              $$a.setAttribute('id', 'ROpdebee_paste_url_status');
              setStyles($$a, { display: 'none' });
              return $$a;
          }.call(this));
      }
      _createClass(StatusBanner, [
          {
              key: 'set',
              value: function set(message) {
                  _classPrivateFieldGet(this, _elmt).innerText = message;
                  _classPrivateFieldGet(this, _elmt).style.removeProperty('display');
              }
          },
          {
              key: 'clear',
              value: function clear() {
                  _classPrivateFieldGet(this, _elmt).innerText = '';
                  _classPrivateFieldGet(this, _elmt).style.display = 'none';
              }
          },
          {
              key: 'htmlElement',
              get: function get() {
                  return _classPrivateFieldGet(this, _elmt);
              }
          }
      ]);
      return StatusBanner;
  }();
  var _banner = new WeakMap();
  var _note = new WeakMap();
  var _urlInput = new WeakMap();
  var _doneImages = new WeakMap();
  var _lastId = new WeakMap();
  var _updateBannerSuccess = new WeakSet();
  var _fillEditNote = new WeakSet();
  var _cleanUrl = new WeakSet();
  var _addImagesFromUrl = new WeakSet();
  var _addImagesFromProvider = new WeakSet();
  var _addImages = new WeakSet();
  var _clearInput = new WeakSet();
  var _fetchLargestImage = new WeakSet();
  var _fetchImage = new WeakSet();
  var _enqueueImageForUpload = new WeakSet();
  var _setArtworkTypeAndComment = new WeakSet();
  var ImageImporter = function () {
      function ImageImporter() {
          _classCallCheck(this, ImageImporter);
          _classPrivateMethodInitSpec(this, _setArtworkTypeAndComment);
          _classPrivateMethodInitSpec(this, _enqueueImageForUpload);
          _classPrivateMethodInitSpec(this, _fetchImage);
          _classPrivateMethodInitSpec(this, _fetchLargestImage);
          _classPrivateMethodInitSpec(this, _clearInput);
          _classPrivateMethodInitSpec(this, _addImages);
          _classPrivateMethodInitSpec(this, _addImagesFromProvider);
          _classPrivateMethodInitSpec(this, _addImagesFromUrl);
          _classPrivateMethodInitSpec(this, _cleanUrl);
          _classPrivateMethodInitSpec(this, _fillEditNote);
          _classPrivateMethodInitSpec(this, _updateBannerSuccess);
          _classPrivateFieldInitSpec(this, _banner, {
              writable: true,
              value: void 0
          });
          _classPrivateFieldInitSpec(this, _note, {
              writable: true,
              value: void 0
          });
          _classPrivateFieldInitSpec(this, _urlInput, {
              writable: true,
              value: void 0
          });
          _classPrivateFieldInitSpec(this, _doneImages, {
              writable: true,
              value: void 0
          });
          _classPrivateFieldInitSpec(this, _lastId, {
              writable: true,
              value: 0
          });
          _classPrivateFieldSet(this, _banner, new StatusBanner());
          _classPrivateFieldSet(this, _note, EditNote.withFooterFromGMInfo());
          _classPrivateFieldSet(this, _urlInput, setupPage(_classPrivateFieldGet(this, _banner), this.cleanUrlAndAdd.bind(this)));
          _classPrivateFieldSet(this, _doneImages, new Set());
      }
      _createClass(ImageImporter, [
          {
              key: 'addImagesFromLocationHash',
              value: function () {
                  var _addImagesFromLocationHash = _asyncToGenerator(regenerator.mark(function _callee() {
                      var _seedParams$origin;
                      var seedParams, url, types, artworkTypeName, artworkType, result;
                      return regenerator.wrap(function _callee$(_context) {
                          while (1) {
                              switch (_context.prev = _context.next) {
                              case 0:
                                  seedParams = {};
                                  document.location.hash.replace(/^#/, '').split('&').forEach(function (param) {
                                      try {
                                          var _param$split = param.split('='), _param$split2 = _slicedToArray(_param$split, 2), name = _param$split2[0], value = _param$split2[1];
                                          seedParams[name] = decodeURIComponent(value);
                                      } catch (err) {
                                          console.error(err);
                                          return;
                                      }
                                  });
                                  if (seedParams.artwork_url) {
                                      _context.next = 4;
                                      break;
                                  }
                                  return _context.abrupt('return');
                              case 4:
                                  url = _classPrivateMethodGet(this, _cleanUrl, _cleanUrl2).call(this, seedParams.artwork_url);
                                  if (url) {
                                      _context.next = 7;
                                      break;
                                  }
                                  return _context.abrupt('return');
                              case 7:
                                  types = [];
                                  if (seedParams.artwork_type) {
                                      artworkTypeName = seedParams.artwork_type;
                                      artworkType = ArtworkTypeIDs[artworkTypeName];
                                      if (typeof artworkType !== 'undefined') {
                                          types.push(artworkType);
                                      }
                                  }
                                  _context.next = 11;
                                  return _classPrivateMethodGet(this, _addImages, _addImages2).call(this, url, types);
                              case 11:
                                  result = _context.sent;
                                  if (result) {
                                      _context.next = 14;
                                      break;
                                  }
                                  return _context.abrupt('return');
                              case 14:
                                  _classPrivateMethodGet(this, _fillEditNote, _fillEditNote2).call(this, result, (_seedParams$origin = seedParams.origin) !== null && _seedParams$origin !== void 0 ? _seedParams$origin : '');
                                  _classPrivateMethodGet(this, _clearInput, _clearInput2).call(this, url.href);
                                  _classPrivateMethodGet(this, _updateBannerSuccess, _updateBannerSuccess2).call(this, result);
                              case 17:
                              case 'end':
                                  return _context.stop();
                              }
                          }
                      }, _callee, this);
                  }));
                  function addImagesFromLocationHash() {
                      return _addImagesFromLocationHash.apply(this, arguments);
                  }
                  return addImagesFromLocationHash;
              }()
          },
          {
              key: 'cleanUrlAndAdd',
              value: function () {
                  var _cleanUrlAndAdd = _asyncToGenerator(regenerator.mark(function _callee2(url) {
                      var urlObj;
                      return regenerator.wrap(function _callee2$(_context2) {
                          while (1) {
                              switch (_context2.prev = _context2.next) {
                              case 0:
                                  urlObj = _classPrivateMethodGet(this, _cleanUrl, _cleanUrl2).call(this, url);
                                  if (urlObj) {
                                      _context2.next = 3;
                                      break;
                                  }
                                  return _context2.abrupt('return');
                              case 3:
                                  _context2.next = 5;
                                  return _classPrivateMethodGet(this, _addImagesFromUrl, _addImagesFromUrl2).call(this, urlObj);
                              case 5:
                              case 'end':
                                  return _context2.stop();
                              }
                          }
                      }, _callee2, this);
                  }));
                  function cleanUrlAndAdd(_x) {
                      return _cleanUrlAndAdd.apply(this, arguments);
                  }
                  return cleanUrlAndAdd;
              }()
          }
      ]);
      return ImageImporter;
  }();
  function _updateBannerSuccess2(result) {
      if (result.containerUrl) {
          _classPrivateFieldGet(this, _banner).set('Successfully added '.concat(result.queuedUrls.length, ' URLs from ').concat(result.containerUrl.pathname.split('/').at(-1)));
      } else {
          _classPrivateFieldGet(this, _banner).set('Successfully added '.concat(result.queuedUrls[0].filename) + (result.queuedUrls[0].wasMaximised ? ' (maximised)' : ''));
      }
  }
  function _fillEditNote2(queueResult) {
      var origin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      var prefix = '';
      if (queueResult.containerUrl) {
          prefix = ' * ';
          _classPrivateFieldGet(this, _note).addExtraInfo(queueResult.containerUrl.href);
      }
      var _iterator2 = _createForOfIteratorHelper(queueResult.queuedUrls.slice(0, 3)), _step2;
      try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var queuedUrl = _step2.value;
              if (queuedUrl.maximisedUrl.protocol === 'data:') {
                  _classPrivateFieldGet(this, _note).addExtraInfo(prefix + 'Uploaded from data URL');
                  continue;
              }
              _classPrivateFieldGet(this, _note).addExtraInfo(prefix + queuedUrl.maximisedUrl.href);
              if (queuedUrl.wasMaximised) {
                  _classPrivateFieldGet(this, _note).addExtraInfo(' '.repeat(prefix.length) + 'Maximised from ' + queuedUrl.originalUrl.href);
              }
          }
      } catch (err) {
          _iterator2.e(err);
      } finally {
          _iterator2.f();
      }
      if (queueResult.queuedUrls.length > 3) {
          _classPrivateFieldGet(this, _note).addExtraInfo(prefix + '\u2026and '.concat(queueResult.queuedUrls.length - 3, ' additional images'));
      }
      if (origin) {
          _classPrivateFieldGet(this, _note).addExtraInfo('Seeded from '.concat(origin));
      }
      _classPrivateFieldGet(this, _note).addFooter();
  }
  function _cleanUrl2(url) {
      url = url.trim();
      if (!url) {
          _classPrivateFieldGet(this, _banner).clear();
          return;
      }
      try {
          return new URL(url);
      } catch (_unused) {
          _classPrivateFieldGet(this, _banner).set('Invalid URL');
          return;
      }
  }
  function _addImagesFromUrl2(_x4) {
      return _addImagesFromUrl3.apply(this, arguments);
  }
  function _addImagesFromUrl3() {
      _addImagesFromUrl3 = _asyncToGenerator(regenerator.mark(function _callee5(url) {
          var result;
          return regenerator.wrap(function _callee5$(_context5) {
              while (1) {
                  switch (_context5.prev = _context5.next) {
                  case 0:
                      _context5.next = 2;
                      return _classPrivateMethodGet(this, _addImages, _addImages2).call(this, url);
                  case 2:
                      result = _context5.sent;
                      if (result) {
                          _context5.next = 5;
                          break;
                      }
                      return _context5.abrupt('return');
                  case 5:
                      _classPrivateMethodGet(this, _fillEditNote, _fillEditNote2).call(this, result);
                      _classPrivateMethodGet(this, _clearInput, _clearInput2).call(this, url.href);
                      _classPrivateMethodGet(this, _updateBannerSuccess, _updateBannerSuccess2).call(this, result);
                  case 8:
                  case 'end':
                      return _context5.stop();
                  }
              }
          }, _callee5, this);
      }));
      return _addImagesFromUrl3.apply(this, arguments);
  }
  function _addImagesFromProvider2(_x5, _x6) {
      return _addImagesFromProvider3.apply(this, arguments);
  }
  function _addImagesFromProvider3() {
      _addImagesFromProvider3 = _asyncToGenerator(regenerator.mark(function _callee6(originalUrl, images) {
          var queueResults, _iterator3, _step3, _img$type, _img$comment, img, result;
          return regenerator.wrap(function _callee6$(_context6) {
              while (1) {
                  switch (_context6.prev = _context6.next) {
                  case 0:
                      _classPrivateFieldGet(this, _banner).set('Found '.concat(images.length, ' images'));
                      queueResults = [];
                      _iterator3 = _createForOfIteratorHelper(images);
                      _context6.prev = 3;
                      _iterator3.s();
                  case 5:
                      if ((_step3 = _iterator3.n()).done) {
                          _context6.next = 15;
                          break;
                      }
                      img = _step3.value;
                      _context6.next = 9;
                      return _classPrivateMethodGet(this, _addImages, _addImages2).call(this, img.url, (_img$type = img.type) !== null && _img$type !== void 0 ? _img$type : [], (_img$comment = img.comment) !== null && _img$comment !== void 0 ? _img$comment : '');
                  case 9:
                      result = _context6.sent;
                      if (result) {
                          _context6.next = 12;
                          break;
                      }
                      return _context6.abrupt('continue', 13);
                  case 12:
                      queueResults = queueResults.concat(result.queuedUrls);
                  case 13:
                      _context6.next = 5;
                      break;
                  case 15:
                      _context6.next = 20;
                      break;
                  case 17:
                      _context6.prev = 17;
                      _context6.t0 = _context6['catch'](3);
                      _iterator3.e(_context6.t0);
                  case 20:
                      _context6.prev = 20;
                      _iterator3.f();
                      return _context6.finish(20);
                  case 23:
                      _classPrivateMethodGet(this, _clearInput, _clearInput2).call(this, originalUrl.href);
                      _classPrivateFieldGet(this, _banner).set('Added '.concat(queueResults.length, ' images from ').concat(originalUrl));
                      if (queueResults.length) {
                          _context6.next = 27;
                          break;
                      }
                      return _context6.abrupt('return');
                  case 27:
                      return _context6.abrupt('return', {
                          containerUrl: originalUrl,
                          queuedUrls: queueResults
                      });
                  case 28:
                  case 'end':
                      return _context6.stop();
                  }
              }
          }, _callee6, this, [[
                  3,
                  17,
                  20,
                  23
              ]]);
      }));
      return _addImagesFromProvider3.apply(this, arguments);
  }
  function _addImages2(_x7) {
      return _addImages3.apply(this, arguments);
  }
  function _addImages3() {
      _addImages3 = _asyncToGenerator(regenerator.mark(function _callee7(url) {
          var artworkTypes, comment, containedImages, _err$reason, originalFilename, result, _err$reason2, _result, file, fetchedUrl, wasMaximised, _args7 = arguments;
          return regenerator.wrap(function _callee7$(_context7) {
              while (1) {
                  switch (_context7.prev = _context7.next) {
                  case 0:
                      artworkTypes = _args7.length > 1 && _args7[1] !== undefined ? _args7[1] : [];
                      comment = _args7.length > 2 && _args7[2] !== undefined ? _args7[2] : '';
                      _classPrivateFieldGet(this, _banner).set('Searching for images\u2026');
                      _context7.prev = 3;
                      _context7.next = 6;
                      return findImages(url);
                  case 6:
                      containedImages = _context7.sent;
                      _context7.next = 14;
                      break;
                  case 9:
                      _context7.prev = 9;
                      _context7.t0 = _context7['catch'](3);
                      _classPrivateFieldGet(this, _banner).set('Failed to search images: '.concat((_err$reason = _context7.t0.reason) !== null && _err$reason !== void 0 ? _err$reason : _context7.t0));
                      console.error(_context7.t0);
                      return _context7.abrupt('return');
                  case 14:
                      if (!containedImages) {
                          _context7.next = 16;
                          break;
                      }
                      return _context7.abrupt('return', _classPrivateMethodGet(this, _addImagesFromProvider, _addImagesFromProvider2).call(this, url, containedImages));
                  case 16:
                      originalFilename = url.pathname.split('/').at(-1) || 'image';
                      if (!_classPrivateFieldGet(this, _doneImages).has(url.href)) {
                          _context7.next = 21;
                          break;
                      }
                      _classPrivateFieldGet(this, _banner).set(''.concat(originalFilename, ' has already been added'));
                      _classPrivateMethodGet(this, _clearInput, _clearInput2).call(this, url.href);
                      return _context7.abrupt('return');
                  case 21:
                      _classPrivateFieldGet(this, _doneImages).add(url.href);
                      _context7.prev = 22;
                      _context7.next = 25;
                      return _classPrivateMethodGet(this, _fetchLargestImage, _fetchLargestImage2).call(this, url);
                  case 25:
                      result = _context7.sent;
                      _context7.next = 33;
                      break;
                  case 28:
                      _context7.prev = 28;
                      _context7.t1 = _context7['catch'](22);
                      _classPrivateFieldGet(this, _banner).set('Failed to load '.concat(originalFilename, ': ').concat((_err$reason2 = _context7.t1.reason) !== null && _err$reason2 !== void 0 ? _err$reason2 : _context7.t1));
                      console.error(_context7.t1);
                      return _context7.abrupt('return');
                  case 33:
                      _result = result, file = _result.file, fetchedUrl = _result.fetchedUrl;
                      wasMaximised = fetchedUrl.href !== url.href;
                      if (!(wasMaximised && _classPrivateFieldGet(this, _doneImages).has(fetchedUrl.href))) {
                          _context7.next = 39;
                          break;
                      }
                      _classPrivateFieldGet(this, _banner).set(''.concat(originalFilename, ' has already been added'));
                      _classPrivateMethodGet(this, _clearInput, _clearInput2).call(this, url.href);
                      return _context7.abrupt('return');
                  case 39:
                      _classPrivateFieldGet(this, _doneImages).add(fetchedUrl.href);
                      _classPrivateMethodGet(this, _enqueueImageForUpload, _enqueueImageForUpload2).call(this, file, artworkTypes, comment);
                      return _context7.abrupt('return', {
                          queuedUrls: [{
                                  filename: file.name,
                                  wasMaximised: wasMaximised,
                                  originalUrl: url,
                                  maximisedUrl: fetchedUrl
                              }]
                      });
                  case 42:
                  case 'end':
                      return _context7.stop();
                  }
              }
          }, _callee7, this, [
              [
                  3,
                  9
              ],
              [
                  22,
                  28
              ]
          ]);
      }));
      return _addImages3.apply(this, arguments);
  }
  function _clearInput2(oldValue) {
      if (_classPrivateFieldGet(this, _urlInput).value == oldValue) {
          _classPrivateFieldGet(this, _urlInput).value = '';
      }
  }
  function _fetchLargestImage2(_x8) {
      return _fetchLargestImage3.apply(this, arguments);
  }
  function _fetchLargestImage3() {
      _fetchLargestImage3 = _asyncToGenerator(regenerator.mark(function _callee8(url) {
          var _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, imageResult, candName, _err$reason3;
          return regenerator.wrap(function _callee8$(_context8) {
              while (1) {
                  switch (_context8.prev = _context8.next) {
                  case 0:
                      _iteratorAbruptCompletion = false;
                      _didIteratorError = false;
                      _context8.prev = 2;
                      _iterator = _asyncIterator(getMaxUrlCandidates(url));
                  case 4:
                      _context8.next = 6;
                      return _iterator.next();
                  case 6:
                      if (!(_iteratorAbruptCompletion = !(_step = _context8.sent).done)) {
                          _context8.next = 22;
                          break;
                      }
                      imageResult = _step.value;
                      candName = imageResult.filename || imageResult.url.pathname.split('/').at(-1);
                      _context8.prev = 9;
                      _classPrivateFieldGet(this, _banner).set('Trying '.concat(candName, '\u2026'));
                      _context8.next = 13;
                      return _classPrivateMethodGet(this, _fetchImage, _fetchImage2).call(this, imageResult.url, candName, imageResult.headers);
                  case 13:
                      return _context8.abrupt('return', _context8.sent);
                  case 16:
                      _context8.prev = 16;
                      _context8.t0 = _context8['catch'](9);
                      console.error(''.concat(candName, ' failed: ').concat((_err$reason3 = _context8.t0.reason) !== null && _err$reason3 !== void 0 ? _err$reason3 : _context8.t0));
                  case 19:
                      _iteratorAbruptCompletion = false;
                      _context8.next = 4;
                      break;
                  case 22:
                      _context8.next = 28;
                      break;
                  case 24:
                      _context8.prev = 24;
                      _context8.t1 = _context8['catch'](2);
                      _didIteratorError = true;
                      _iteratorError = _context8.t1;
                  case 28:
                      _context8.prev = 28;
                      _context8.prev = 29;
                      if (!(_iteratorAbruptCompletion && _iterator.return != null)) {
                          _context8.next = 33;
                          break;
                      }
                      _context8.next = 33;
                      return _iterator.return();
                  case 33:
                      _context8.prev = 33;
                      if (!_didIteratorError) {
                          _context8.next = 36;
                          break;
                      }
                      throw _iteratorError;
                  case 36:
                      return _context8.finish(33);
                  case 37:
                      return _context8.finish(28);
                  case 38:
                      _context8.next = 40;
                      return _classPrivateMethodGet(this, _fetchImage, _fetchImage2).call(this, url, url.pathname.split('/').at(-1) || 'image');
                  case 40:
                      return _context8.abrupt('return', _context8.sent);
                  case 41:
                  case 'end':
                      return _context8.stop();
                  }
              }
          }, _callee8, this, [
              [
                  2,
                  24,
                  28,
                  38
              ],
              [
                  9,
                  16
              ],
              [
                  29,
                  ,
                  33,
                  37
              ]
          ]);
      }));
      return _fetchLargestImage3.apply(this, arguments);
  }
  function _fetchImage2(_x9, _x10) {
      return _fetchImage3.apply(this, arguments);
  }
  function _fetchImage3() {
      _fetchImage3 = _asyncToGenerator(regenerator.mark(function _callee9(url, fileName) {
          var _this3 = this;
          var headers, resp, rawFile, _args9 = arguments;
          return regenerator.wrap(function _callee9$(_context9) {
              while (1) {
                  switch (_context9.prev = _context9.next) {
                  case 0:
                      headers = _args9.length > 2 && _args9[2] !== undefined ? _args9[2] : {};
                      _context9.next = 3;
                      return gmxhr({
                          url: url.href,
                          method: 'GET',
                          responseType: 'blob',
                          headers: headers
                      });
                  case 3:
                      resp = _context9.sent;
                      rawFile = new File([resp.response], fileName);
                      return _context9.abrupt('return', new Promise(function (resolve, reject) {
                          MB.CoverArt.validate_file(rawFile).fail(function (error) {
                              reject({
                                  reason: error,
                                  error: error
                              });
                          }).done(function (mimeType) {
                              var _this$lastId;
                              resolve({
                                  fetchedUrl: url,
                                  file: new File([resp.response], ''.concat(fileName, '.').concat((_classPrivateFieldSet(_this3, _lastId, (_this$lastId = +_classPrivateFieldGet(_this3, _lastId)) + 1), _this$lastId), '.').concat(mimeType.split('/')[1]), { type: mimeType })
                              });
                          });
                      }));
                  case 6:
                  case 'end':
                      return _context9.stop();
                  }
              }
          }, _callee9);
      }));
      return _fetchImage3.apply(this, arguments);
  }
  function _enqueueImageForUpload2(file, artworkTypes, comment) {
      var _this = this;
      var dropEvent = $.Event('drop');
      dropEvent.originalEvent = { dataTransfer: { files: [file] } };
      $('#drop-zone').trigger(dropEvent);
      if (artworkTypes.length) {
          setTimeout(function () {
              _classPrivateMethodGet(_this, _setArtworkTypeAndComment, _setArtworkTypeAndComment2).call(_this, file, artworkTypes, comment);
          }, 0);
      }
  }
  function _setArtworkTypeAndComment2(file, artworkTypes, comment) {
      var _this2 = this;
      var pendingUploadRows = qsa('tbody[data-bind="foreach: files_to_upload"] > tr');
      var fileRow = pendingUploadRows.find(function (row) {
          return qs('.file-info span[data-bind="text: name"]', row).innerText == file.name;
      });
      if (!fileRow) {
          setTimeout(function () {
              _classPrivateMethodGet(_this2, _setArtworkTypeAndComment, _setArtworkTypeAndComment2).call(_this2, file, artworkTypes, comment);
          }, 500);
          return;
      }
      var checkboxesToCheck = qsa('ul.cover-art-type-checkboxes input[type="checkbox"]', fileRow).filter(function (cbox) {
          return artworkTypes.includes(parseInt(cbox.value));
      });
      checkboxesToCheck.forEach(function (cbox) {
          cbox.checked = true;
          cbox.dispatchEvent(new Event('click'));
      });
      if (comment.trim().length) {
          var commentInput = qs('div.comment > input.comment', fileRow);
          commentInput.value = comment.trim();
          commentInput.dispatchEvent(new Event('change'));
      }
  }
  function setupPage(statusBanner, addImageCallback) {
      document.head.append(function () {
          var $$b = document.createElement('style');
          $$b.setAttribute('id', 'ROpdebee_upload_to_caa_from_url');
          appendChildren($$b, css_248z);
          return $$b;
      }.call(this));
      var input = function () {
          var $$d = document.createElement('input');
          $$d.setAttribute('type', 'text');
          $$d.setAttribute('placeholder', 'or paste a URL here');
          $$d.setAttribute('size', 47);
          $$d.addEventListener('input', function (evt) {
              addImageCallback(evt.currentTarget.value);
          });
          return $$d;
      }.call(this);
      var container = function () {
          var $$e = document.createElement('div');
          $$e.setAttribute('class', 'ROpdebee_paste_url_cont');
          appendChildren($$e, input);
          var $$g = document.createElement('a');
          $$g.setAttribute('href', 'https://github.com/ROpdebee/mb-userscripts/blob/main/src/mb_enhanced_cover_art_uploads/supportedProviders.md');
          $$g.setAttribute('target', '_blank');
          $$e.appendChild($$g);
          var $$h = document.createTextNode('\n                Supported providers\n            ');
          $$g.appendChild($$h);
          appendChildren($$e, statusBanner.htmlElement);
          return $$e;
      }.call(this);
      qs('#drop-zone').insertAdjacentElement('afterend', container);
      addImportButtons(addImageCallback, container);
      return input;
  }
  function addImportButtons(_x2, _x3) {
      return _addImportButtons.apply(this, arguments);
  }
  function _addImportButtons() {
      _addImportButtons = _asyncToGenerator(regenerator.mark(function _callee3(addImageCallback, inputContainer) {
          var attachedURLs, supportedURLs, buttons;
          return regenerator.wrap(function _callee3$(_context3) {
              while (1) {
                  switch (_context3.prev = _context3.next) {
                  case 0:
                      _context3.next = 2;
                      return getAttachedURLs();
                  case 2:
                      attachedURLs = _context3.sent;
                      supportedURLs = attachedURLs.filter(hasProvider);
                      if (supportedURLs.length) {
                          _context3.next = 6;
                          break;
                      }
                      return _context3.abrupt('return');
                  case 6:
                      buttons = supportedURLs.map(function (url) {
                          return createImportButton(url, addImageCallback);
                      });
                      inputContainer.insertAdjacentElement('afterend', function () {
                          var $$j = document.createElement('div');
                          $$j.setAttribute('class', 'ROpdebee_import_url_buttons buttons');
                          appendChildren($$j, buttons);
                          return $$j;
                      }.call(this));
                      inputContainer.insertAdjacentElement('afterend', function () {
                          var $$l = document.createElement('span');
                          var $$m = document.createTextNode('or');
                          $$l.appendChild($$m);
                          return $$l;
                      }.call(this));
                  case 9:
                  case 'end':
                      return _context3.stop();
                  }
              }
          }, _callee3);
      }));
      return _addImportButtons.apply(this, arguments);
  }
  function createImportButton(url, addImageCallback) {
      var provider = getProvider(url);
      return function () {
          var $$n = document.createElement('button');
          $$n.setAttribute('type', 'button');
          $$n.setAttribute('title', url.href);
          $$n.addEventListener('click', function (evt) {
              evt.preventDefault();
              addImageCallback(url.href);
          });
          var $$o = document.createElement('img');
          $$o.setAttribute('src', provider === null || provider === void 0 ? void 0 : provider.favicon);
          $$o.setAttribute('alt', provider === null || provider === void 0 ? void 0 : provider.name);
          $$n.appendChild($$o);
          var $$p = document.createElement('span');
          $$n.appendChild($$p);
          appendChildren($$p, 'Import from ' + (provider === null || provider === void 0 ? void 0 : provider.name));
          return $$n;
      }.call(this);
  }
  function getAttachedURLs() {
      return _getAttachedURLs.apply(this, arguments);
  }
  function _getAttachedURLs() {
      _getAttachedURLs = _asyncToGenerator(regenerator.mark(function _callee4() {
          var _location$href$match, _metadata$relations$f, _metadata$relations, _metadata$relations$f2;
          var mbid, resp, metadata, urls;
          return regenerator.wrap(function _callee4$(_context4) {
              while (1) {
                  switch (_context4.prev = _context4.next) {
                  case 0:
                      mbid = (_location$href$match = location.href.match(/musicbrainz\.org\/release\/([a-f0-9-]+)\//)) === null || _location$href$match === void 0 ? void 0 : _location$href$match[1];
                      assertHasValue(mbid);
                      _context4.next = 4;
                      return fetch('/ws/2/release/'.concat(mbid, '?inc=url-rels&fmt=json'));
                  case 4:
                      resp = _context4.sent;
                      _context4.next = 7;
                      return resp.json();
                  case 7:
                      metadata = _context4.sent;
                      urls = (_metadata$relations$f = (_metadata$relations = metadata.relations) === null || _metadata$relations === void 0 ? void 0 : (_metadata$relations$f2 = _metadata$relations.filter(function (rel) {
                          return !rel.ended;
                      })) === null || _metadata$relations$f2 === void 0 ? void 0 : _metadata$relations$f2.map(function (rel) {
                          return rel.url.resource;
                      })) !== null && _metadata$relations$f !== void 0 ? _metadata$relations$f : [];
                      return _context4.abrupt('return', _toConsumableArray(new Set(urls)).map(function (url) {
                          try {
                              return new URL(url);
                          } catch (_unused2) {
                              return null;
                          }
                      }).filter(function (url) {
                          return url !== null;
                      }));
                  case 10:
                  case 'end':
                      return _context4.stop();
                  }
              }
          }, _callee4);
      }));
      return _getAttachedURLs.apply(this, arguments);
  }
  if (document.location.hostname.endsWith('musicbrainz.org')) {
      var importer = new ImageImporter();
      if (/artwork_url=(.+)/.test(document.location.hash)) {
          importer.addImagesFromLocationHash();
      }
  } else if (document.location.hostname === 'atisket.pulsewidth.org.uk') {
      addAtisketSeedLinks();
  }

}());
