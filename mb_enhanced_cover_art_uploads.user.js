// ==UserScript==
// @name         MB: Enhanced Cover Art Uploads
// @description  Enhance the cover art uploader! Upload directly from a URL, automatically import covers from Discogs/Spotify/Apple Music/..., automatically retrieve the largest version, and more!
// @version      2021.12.14.3
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

(function () {
  'use strict';

  /* minified: babel helpers, nativejsx, babel-plugin-transform-async-to-promises, ts-custom-error, p-throttle, regenerator-runtime, @babel/runtime */
  function _asyncIterator(t){var e,r,n,o=2;for("undefined"!=typeof Symbol&&(r=Symbol.asyncIterator,n=Symbol.iterator);o--;){if(r&&null!=(e=t[r]))return e.call(t);if(n&&null!=(e=t[n]))return new AsyncFromSyncIterator(e.call(t));r="@@asyncIterator",n="@@iterator";}throw new TypeError("Object is not async iterable")}function AsyncFromSyncIterator(t){function e(t){if(Object(t)!==t)return Promise.reject(new TypeError(t+" is not an object."));var e=t.done;return Promise.resolve(t.value).then((function(t){return {value:t,done:e}}))}return AsyncFromSyncIterator=function(t){this.s=t,this.n=t.next;},AsyncFromSyncIterator.prototype={s:null,n:null,next:function(){return e(this.n.apply(this.s,arguments))},return:function(t){var r=this.s.return;return void 0===r?Promise.resolve({value:t,done:!0}):e(r.apply(this.s,arguments))},throw:function(t){var r=this.s.return;return void 0===r?Promise.reject(t):e(r.apply(this.s,arguments))}},new AsyncFromSyncIterator(t)}function ownKeys(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n);}return r}function _objectSpread2(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?ownKeys(Object(r),!0).forEach((function(e){_defineProperty(t,e,r[e]);})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):ownKeys(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e));}));}return t}function _AwaitValue(t){this.wrapped=t;}function _AsyncGenerator(t){var e,r;function n(e,r){try{var i=t[e](r),a=i.value,c=a instanceof _AwaitValue;Promise.resolve(c?a.wrapped:a).then((function(t){c?n("return"===e?"return":"next",t):o(i.done?"return":"normal",t);}),(function(t){n("throw",t);}));}catch(u){o("throw",u);}}function o(t,o){switch(t){case"return":e.resolve({value:o,done:!0});break;case"throw":e.reject(o);break;default:e.resolve({value:o,done:!1});}(e=e.next)?n(e.key,e.arg):r=null;}this._invoke=function(t,o){return new Promise((function(i,a){var c={key:t,arg:o,resolve:i,reject:a,next:null};r?r=r.next=c:(e=r=c,n(t,o));}))},"function"!=typeof t.return&&(this.return=void 0);}function _wrapAsyncGenerator(t){return function(){return new _AsyncGenerator(t.apply(this,arguments))}}function _awaitAsyncGenerator(t){return new _AwaitValue(t)}function _asyncGeneratorDelegate(t,e){var r={},n=!1;function o(r,o){return n=!0,o=new Promise((function(e){e(t[r](o));})),{done:!1,value:e(o)}}return r["undefined"!=typeof Symbol&&Symbol.iterator||"@@iterator"]=function(){return this},r.next=function(t){return n?(n=!1,t):o("next",t)},"function"==typeof t.throw&&(r.throw=function(t){if(n)throw n=!1,t;return o("throw",t)}),"function"==typeof t.return&&(r.return=function(t){return n?(n=!1,t):o("return",t)}),r}function _defineProperty(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function _slicedToArray(t,e){return _arrayWithHoles(t)||_iterableToArrayLimit(t,e)||_unsupportedIterableToArray(t,e)||_nonIterableRest()}function _toArray(t){return _arrayWithHoles(t)||_iterableToArray(t)||_unsupportedIterableToArray(t)||_nonIterableRest()}function _arrayWithHoles(t){if(Array.isArray(t))return t}function _iterableToArray(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}function _iterableToArrayLimit(t,e){var r=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=r){var n,o,i=[],a=!0,c=!1;try{for(r=r.call(t);!(a=(n=r.next()).done)&&(i.push(n.value),!e||i.length!==e);a=!0);}catch(u){c=!0,o=u;}finally{try{a||null==r.return||r.return();}finally{if(c)throw o}}return i}}function _unsupportedIterableToArray(t,e){if(t){if("string"==typeof t)return _arrayLikeToArray(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);return "Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?_arrayLikeToArray(t,e):void 0}}function _arrayLikeToArray(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _createForOfIteratorHelper(t,e){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!r){if(Array.isArray(t)||(r=_unsupportedIterableToArray(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,o=function(){};return {s:o,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,a=!0,c=!1;return {s:function(){r=r.call(t);},n:function(){var t=r.next();return a=t.done,t},e:function(t){c=!0,i=t;},f:function(){try{a||null==r.return||r.return();}finally{if(c)throw i}}}}function _classPrivateFieldGet(t,e){return _classApplyDescriptorGet(t,_classExtractFieldDescriptor(t,e,"get"))}function _classPrivateFieldSet(t,e,r){return _classApplyDescriptorSet(t,_classExtractFieldDescriptor(t,e,"set"),r),r}function _classExtractFieldDescriptor(t,e,r){if(!e.has(t))throw new TypeError("attempted to "+r+" private field on non-instance");return e.get(t)}function _classStaticPrivateMethodGet(t,e,r){return _classCheckPrivateStaticAccess(t,e),r}function _classApplyDescriptorGet(t,e){return e.get?e.get.call(t):e.value}function _classApplyDescriptorSet(t,e,r){if(e.set)e.set.call(t,r);else {if(!e.writable)throw new TypeError("attempted to set read only private field");e.value=r;}}function _classCheckPrivateStaticAccess(t,e){if(t!==e)throw new TypeError("Private static access of wrong provenance")}function _classPrivateMethodGet(t,e,r){if(!e.has(t))throw new TypeError("attempted to get private field on non-instance");return r}function _checkPrivateRedeclaration(t,e){if(e.has(t))throw new TypeError("Cannot initialize the same private elements twice on an object")}function _classPrivateFieldInitSpec(t,e,r){_checkPrivateRedeclaration(t,e),e.set(t,r);}function _classPrivateMethodInitSpec(t,e){_checkPrivateRedeclaration(t,e),e.add(t);}_AsyncGenerator.prototype["function"==typeof Symbol&&Symbol.asyncIterator||"@@asyncIterator"]=function(){return this},_AsyncGenerator.prototype.next=function(t){return this._invoke("next",t)},_AsyncGenerator.prototype.throw=function(t){return this._invoke("throw",t)},_AsyncGenerator.prototype.return=function(t){return this._invoke("return",t)};var appendChildren=function(t,e){(e=Array.isArray(e)?e:[e]).forEach((function(e){e instanceof HTMLElement?t.appendChild(e):(e||"string"==typeof e)&&t.appendChild(document.createTextNode(e.toString()));}));},setStyles=function(t,e){for(const r in e)t.style[r]=e[r];};const _Pact=function(){function t(){}return t.prototype.then=function(e,r){const n=new t,o=this.s;if(o){const t=1&o?e:r;if(t){try{_settle(n,1,t(this.v));}catch(i){_settle(n,2,i);}return n}return this}return this.o=function(t){try{const o=t.v;1&t.s?_settle(n,1,e?e(o):o):r?_settle(n,1,r(o)):_settle(n,2,o);}catch(i){_settle(n,2,i);}},n},t}();function _settle(t,e,r){if(!t.s){if(r instanceof _Pact){if(!r.s)return void(r.o=_settle.bind(null,t,e));1&e&&(e=r.s),r=r.v;}if(r&&r.then)return void r.then(_settle.bind(null,t,e),_settle.bind(null,t,2));t.s=e,t.v=r;const n=t.o;n&&n(t);}}function _isSettledPact(t){return t instanceof _Pact&&1&t.s}function _async(t){return function(){for(var e=[],r=0;r<arguments.length;r++)e[r]=arguments[r];try{return Promise.resolve(t.apply(this,e))}catch(n){return Promise.reject(n)}}}function _await(t,e,r){return r?e?e(t):t:(t&&t.then||(t=Promise.resolve(t)),e?t.then(e):t)}function _awaitIgnored(t,e){if(!e)return t&&t.then?t.then(_empty):Promise.resolve()}function _continue(t,e){return t&&t.then?t.then(e):e(t)}function _continueIgnored(t){if(t&&t.then)return t.then(_empty)}function _forTo(t,e,r){var n,o,i=-1;return function a(c){try{for(;++i<t.length&&(!r||!r());)if((c=e(i))&&c.then){if(!_isSettledPact(c))return void c.then(a,o||(o=_settle.bind(null,n=new _Pact,2)));c=c.v;}n?_settle(n,1,c):n=c;}catch(u){_settle(n||(n=new _Pact),2,u);}}(),n}const _iteratorSymbol="undefined"!=typeof Symbol?Symbol.iterator||(Symbol.iterator=Symbol("Symbol.iterator")):"@@iterator";function _forOf(t,e,r){if("function"==typeof t[_iteratorSymbol]){var n,o,i,a=t[_iteratorSymbol]();if(function t(c){try{for(;!((n=a.next()).done||r&&r());)if((c=e(n.value))&&c.then){if(!_isSettledPact(c))return void c.then(t,i||(i=_settle.bind(null,o=new _Pact,2)));c=c.v;}o?_settle(o,1,c):o=c;}catch(u){_settle(o||(o=new _Pact),2,u);}}(),a.return){var c=function(t){try{n.done||a.return();}catch(e){}return t};if(o&&o.then)return o.then(c,(function(t){throw c(t)}));c();}return o}if(!("length"in t))throw new TypeError("Object is not iterable");for(var u=[],s=0;s<t.length;s++)u.push(t[s]);return _forTo(u,(function(t){return e(u[t])}),r)}function _for(t,e,r){for(var n;;){var o=t();if(_isSettledPact(o)&&(o=o.v),!o)return i;if(o.then){n=0;break}var i=r();if(i&&i.then){if(!_isSettledPact(i)){n=1;break}i=i.s;}if(e){var a=e();if(a&&a.then&&!_isSettledPact(a)){n=2;break}}}var c=new _Pact,u=_settle.bind(null,c,2);return (0===n?o.then(l):1===n?i.then(s):a.then(f)).then(void 0,u),c;function s(n){i=n;do{if(e&&(a=e())&&a.then&&!_isSettledPact(a))return void a.then(f).then(void 0,u);if(!(o=t())||_isSettledPact(o)&&!o.v)return void _settle(c,1,i);if(o.then)return void o.then(l).then(void 0,u);_isSettledPact(i=r())&&(i=i.v);}while(!i||!i.then);i.then(s).then(void 0,u);}function l(t){t?(i=r())&&i.then?i.then(s).then(void 0,u):s(i):_settle(c,1,i);}function f(){(o=t())?o.then?o.then(l).then(void 0,u):l(o):_settle(c,1,i);}}function _call(t,e,r){if(r)return e?e(t()):t();try{var n=Promise.resolve(t());return e?n.then(e):n}catch(o){return Promise.reject(o)}}function _invoke(t,e){var r=t();return r&&r.then?r.then(e):e(r)}function _invokeIgnored(t){var e=t();if(e&&e.then)return e.then(_empty)}function _catch(t,e){try{var r=t();}catch(n){return e(n)}return r&&r.then?r.then(void 0,e):r}function _finallyRethrows(t,e){try{var r=t();}catch(n){return e(!0,n)}return r&&r.then?r.then(e.bind(null,!1),e.bind(null,!0)):e(!1,r)}function _rethrow(t,e){if(t)throw e;return e}function _empty(){}function fixProto(t,e){var r=Object.setPrototypeOf;r?r(t,e):t.__proto__=e;}function fixStack(t,e){void 0===e&&(e=t.constructor);var r=Error.captureStackTrace;r&&r(t,e);}"undefined"==typeof Symbol||Symbol.asyncIterator||(Symbol.asyncIterator=Symbol("Symbol.asyncIterator"));var __extends=function(){var t=function(e,r){return t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e;}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r]);},t(e,r)};return function(e,r){function n(){this.constructor=e;}t(e,r),e.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n);}}(),CustomError=function(t){function e(e){var r=this.constructor,n=t.call(this,e)||this;return Object.defineProperty(n,"name",{value:r.name,enumerable:!1,configurable:!0}),fixProto(n,r.prototype),fixStack(n),n}return __extends(e,t),e}(Error);class AbortError extends Error{constructor(){super("Throttled function aborted"),this.name="AbortError";}}function pThrottle(t){let e=t.limit,r=t.interval,n=t.strict;if(!Number.isFinite(e))throw new TypeError("Expected `limit` to be a finite number");if(!Number.isFinite(r))throw new TypeError("Expected `interval` to be a finite number");const o=new Map;let i=0,a=0;const c=[],u=n?function(){const t=Date.now();if(c.length<e)return c.push(t),0;const n=c.shift()+r;return t>=n?(c.push(t),0):(c.push(n),n-t)}:function(){const t=Date.now();return t-i>r?(a=1,i=t,0):(a<e?a++:(i+=r,a=1),i-t)};return t=>{const e=function e(){const r=this;for(var n=arguments.length,i=new Array(n),a=0;a<n;a++)i[a]=arguments[a];if(!e.isEnabled)return _async((function(){return t.apply(r,i)}))();let c;return new Promise(((e,r)=>{c=setTimeout((()=>{e(t.apply(this,i)),o.delete(c);}),u()),o.set(c,r);}))};return e.abort=()=>{var t,e=_createForOfIteratorHelper(o.keys());try{for(e.s();!(t=e.n()).done;){const e=t.value;clearTimeout(e),o.get(e)(new AbortError);}}catch(r){e.e(r);}finally{e.f();}o.clear(),c.splice(0,c.length);},e.isEnabled=!0,e}}var runtime={exports:{}};!function(t){var e=function(t){var e,r=Object.prototype,n=r.hasOwnProperty,o="function"==typeof Symbol?Symbol:{},i=o.iterator||"@@iterator",a=o.asyncIterator||"@@asyncIterator",c=o.toStringTag||"@@toStringTag";function u(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{u({},"");}catch(k){u=function(t,e,r){return t[e]=r};}function s(t,e,r,n){var o=e&&e.prototype instanceof d?e:d,i=Object.create(o.prototype),a=new j(n||[]);return i._invoke=function(t,e,r){var n=f;return function(o,i){if(n===y)throw new Error("Generator is already running");if(n===p){if("throw"===o)throw i;return T()}for(r.method=o,r.arg=i;;){var a=r.delegate;if(a){var c=x(a,r);if(c){if(c===v)continue;return c}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if(n===f)throw n=p,r.arg;r.dispatchException(r.arg);}else "return"===r.method&&r.abrupt("return",r.arg);n=y;var u=l(t,e,r);if("normal"===u.type){if(n=r.done?p:h,u.arg===v)continue;return {value:u.arg,done:r.done}}"throw"===u.type&&(n=p,r.method="throw",r.arg=u.arg);}}}(t,r,a),i}function l(t,e,r){try{return {type:"normal",arg:t.call(e,r)}}catch(k){return {type:"throw",arg:k}}}t.wrap=s;var f="suspendedStart",h="suspendedYield",y="executing",p="completed",v={};function d(){}function _(){}function m(){}var w={};u(w,i,(function(){return this}));var b=Object.getPrototypeOf,g=b&&b(b(I([])));g&&g!==r&&n.call(g,i)&&(w=g);var P=m.prototype=d.prototype=Object.create(w);function S(t){["next","throw","return"].forEach((function(e){u(t,e,(function(t){return this._invoke(e,t)}));}));}function A(t,e){function r(o,i,a,c){var u=l(t[o],t,i);if("throw"!==u.type){var s=u.arg,f=s.value;return f&&"object"==typeof f&&n.call(f,"__await")?e.resolve(f.__await).then((function(t){r("next",t,a,c);}),(function(t){r("throw",t,a,c);})):e.resolve(f).then((function(t){s.value=t,a(s);}),(function(t){return r("throw",t,a,c)}))}c(u.arg);}var o;this._invoke=function(t,n){function i(){return new e((function(e,o){r(t,n,e,o);}))}return o=o?o.then(i,i):i()};}function x(t,r){var n=t.iterator[r.method];if(n===e){if(r.delegate=null,"throw"===r.method){if(t.iterator.return&&(r.method="return",r.arg=e,x(t,r),"throw"===r.method))return v;r.method="throw",r.arg=new TypeError("The iterator does not provide a 'throw' method");}return v}var o=l(n,t.iterator,r.arg);if("throw"===o.type)return r.method="throw",r.arg=o.arg,r.delegate=null,v;var i=o.arg;return i?i.done?(r[t.resultName]=i.value,r.next=t.nextLoc,"return"!==r.method&&(r.method="next",r.arg=e),r.delegate=null,v):i:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,v)}function E(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e);}function O(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e;}function j(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(E,this),this.reset(!0);}function I(t){if(t){var r=t[i];if(r)return r.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var o=-1,a=function r(){for(;++o<t.length;)if(n.call(t,o))return r.value=t[o],r.done=!1,r;return r.value=e,r.done=!0,r};return a.next=a}}return {next:T}}function T(){return {value:e,done:!0}}return _.prototype=m,u(P,"constructor",m),u(m,"constructor",_),_.displayName=u(m,c,"GeneratorFunction"),t.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return !!e&&(e===_||"GeneratorFunction"===(e.displayName||e.name))},t.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,m):(t.__proto__=m,u(t,c,"GeneratorFunction")),t.prototype=Object.create(P),t},t.awrap=function(t){return {__await:t}},S(A.prototype),u(A.prototype,a,(function(){return this})),t.AsyncIterator=A,t.async=function(e,r,n,o,i){void 0===i&&(i=Promise);var a=new A(s(e,r,n,o),i);return t.isGeneratorFunction(r)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},S(P),u(P,c,"Generator"),u(P,i,(function(){return this})),u(P,"toString",(function(){return "[object Generator]"})),t.keys=function(t){var e=[];for(var r in t)e.push(r);return e.reverse(),function r(){for(;e.length;){var n=e.pop();if(n in t)return r.value=n,r.done=!1,r}return r.done=!0,r}},t.values=I,j.prototype={constructor:j,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=e,this.done=!1,this.delegate=null,this.method="next",this.arg=e,this.tryEntries.forEach(O),!t)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=e);},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var r=this;function o(n,o){return c.type="throw",c.arg=t,r.next=n,o&&(r.method="next",r.arg=e),!!o}for(var i=this.tryEntries.length-1;i>=0;--i){var a=this.tryEntries[i],c=a.completion;if("root"===a.tryLoc)return o("end");if(a.tryLoc<=this.prev){var u=n.call(a,"catchLoc"),s=n.call(a,"finallyLoc");if(u&&s){if(this.prev<a.catchLoc)return o(a.catchLoc,!0);if(this.prev<a.finallyLoc)return o(a.finallyLoc)}else if(u){if(this.prev<a.catchLoc)return o(a.catchLoc,!0)}else {if(!s)throw new Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return o(a.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=e&&e<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=t,a.arg=e,i?(this.method="next",this.next=i.finallyLoc,v):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return "break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),v},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),O(r),v}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;O(r);}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,r,n){return this.delegate={iterator:I(t),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=e),v}},t}(t.exports);try{regeneratorRuntime=e;}catch(r){"object"==typeof globalThis?globalThis.regeneratorRuntime=e:Function("r","regeneratorRuntime = r")(e);}}(runtime);var regenerator=runtime.exports;

  /* minified: lib */
  let LogLevel;!function(e){e[e.DEBUG=0]="DEBUG",e[e.LOG=1]="LOG",e[e.INFO=2]="INFO",e[e.SUCCESS=3]="SUCCESS",e[e.WARNING=4]="WARNING",e[e.ERROR=5]="ERROR";}(LogLevel||(LogLevel={}));const HANDLER_NAMES={[LogLevel.DEBUG]:"onDebug",[LogLevel.LOG]:"onLog",[LogLevel.INFO]:"onInfo",[LogLevel.SUCCESS]:"onSuccess",[LogLevel.WARNING]:"onWarn",[LogLevel.ERROR]:"onError"},DEFAULT_OPTIONS={logLevel:LogLevel.INFO,sinks:[]};var _configuration=new WeakMap,_fireHandlers=new WeakSet;class Logger{constructor(e){_classPrivateMethodInitSpec(this,_fireHandlers),_classPrivateFieldInitSpec(this,_configuration,{writable:!0,value:void 0}),_classPrivateFieldSet(this,_configuration,_objectSpread2(_objectSpread2({},DEFAULT_OPTIONS),e));}debug(e){_classPrivateMethodGet(this,_fireHandlers,_fireHandlers2).call(this,LogLevel.DEBUG,e);}log(e){_classPrivateMethodGet(this,_fireHandlers,_fireHandlers2).call(this,LogLevel.LOG,e);}info(e){_classPrivateMethodGet(this,_fireHandlers,_fireHandlers2).call(this,LogLevel.INFO,e);}success(e){_classPrivateMethodGet(this,_fireHandlers,_fireHandlers2).call(this,LogLevel.SUCCESS,e);}warn(e,t){_classPrivateMethodGet(this,_fireHandlers,_fireHandlers2).call(this,LogLevel.WARNING,e,t);}error(e,t){_classPrivateMethodGet(this,_fireHandlers,_fireHandlers2).call(this,LogLevel.ERROR,e,t);}configure(e){Object.assign(_classPrivateFieldGet(this,_configuration),e);}get configuration(){return _classPrivateFieldGet(this,_configuration)}addSink(e){_classPrivateFieldGet(this,_configuration).sinks.push(e);}}function _fireHandlers2(e,t,s){e<_classPrivateFieldGet(this,_configuration).logLevel||_classPrivateFieldGet(this,_configuration).sinks.forEach((r=>{const a=r[HANDLER_NAMES[e]];a&&(s?a.call(r,t,s):a.call(r,t));}));}const LOGGER=new Logger;var _scriptName=new WeakMap,_formatMessage=new WeakSet;class ConsoleSink{constructor(e){_classPrivateMethodInitSpec(this,_formatMessage),_classPrivateFieldInitSpec(this,_scriptName,{writable:!0,value:void 0}),_defineProperty(this,"onSuccess",this.onInfo),_classPrivateFieldSet(this,_scriptName,e);}onDebug(e){console.debug(_classPrivateMethodGet(this,_formatMessage,_formatMessage2).call(this,e));}onLog(e){console.log(_classPrivateMethodGet(this,_formatMessage,_formatMessage2).call(this,e));}onInfo(e){console.info(_classPrivateMethodGet(this,_formatMessage,_formatMessage2).call(this,e));}onWarn(e,t){e=_classPrivateMethodGet(this,_formatMessage,_formatMessage2).call(this,e),t?console.warn(e,t):console.warn(e);}onError(e,t){e=_classPrivateMethodGet(this,_formatMessage,_formatMessage2).call(this,e),t?console.error(e,t):console.error(e);}}function _formatMessage2(e){return "[".concat(_classPrivateFieldGet(this,_scriptName),"] ").concat(e)}class AssertionError extends Error{}function assert(e,t){if(!e)throw new AssertionError(null!=t?t:"Assertion failed")}function assertDefined(e,t){assert(void 0!==e,null!=t?t:"Assertion failed: Expected value to be defined");}function assertNonNull(e,t){assert(null!==e,null!=t?t:"Assertion failed: Expected value to be non-null");}function assertHasValue(e,t){assert(null!=e,null!=t?t:"Assertion failed: Expected value to be defined and non-null");}function qs(e,t){const s=qsMaybe(e,t);return assertNonNull(s,"Could not find required element"),s}function qsMaybe(e,t){return (null!=t?t:document).querySelector(e)}function qsa(e,t){return [...(null!=t?t:document).querySelectorAll(e)]}function parseDOM(e,t){const s=(new DOMParser).parseFromString(e,"text/html");if(!qsMaybe("base",s.head)){const e=s.createElement("base");e.href=t,s.head.insertAdjacentElement("beforeend",e);}return s}function safeParseJSON(e,t){try{return JSON.parse(e)}catch(s){if(t)throw new Error(t+": "+s);return}}const getReleaseIDsForURL=_async((function(e){return _await(fetch("https://musicbrainz.org/ws/2/url?resource=".concat(encodeURIComponent(e),"&inc=release-rels&fmt=json")),(function(e){return _await(e.json(),(function(e){var t,s;return null!==(t=null===(s=e.relations)||void 0===s?void 0:s.map((e=>e.release.id)))&&void 0!==t?t:[]}))}))})),getURLsForRelease=_async((function(e,t){const s=null!=t?t:{},r=s.excludeEnded,a=s.excludeDuplicates;return _await(getReleaseUrlARs(e),(function(e){r&&(e=e.filter((e=>!e.ended)));let t=e.map((e=>e.url.resource));return a&&(t=Array.from(new Set([...t]))),t.flatMap((e=>{try{return [new URL(e)]}catch(t){return console.warn("Found malformed URL linked to release: ".concat(e)),[]}}))}))})),getReleaseUrlARs=_async((function(e){return _await(fetch("https://musicbrainz.org/ws/2/release/".concat(e,"?inc=url-rels&fmt=json")),(function(e){return _await(e.json(),(function(e){var t;return null!==(t=e.relations)&&void 0!==t?t:[]}))}))}));function urlBasename(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"";return "string"!=typeof e&&(e=e.pathname),e.split("/").pop()||t}function existsInGM(e){return "undefined"!=typeof GM&&void 0!==GM[e]}function promisify(e){return function(){return Promise.resolve(e(...arguments))}}const GMxmlHttpRequest=existsInGM("xmlHttpRequest")?GM.xmlHttpRequest:promisify(GM_xmlhttpRequest),GMgetResourceUrl=existsInGM("getResourceUrl")?GM.getResourceUrl:existsInGM("getResourceURL")?GM.getResourceURL:promisify(GM_getResourceURL),GMinfo=existsInGM("info")?GM.info:GM_info;function cloneIntoPageContext(e){return "undefined"!=typeof cloneInto&&"undefined"!=typeof unsafeWindow?cloneInto(e,unsafeWindow):e}function getFromPageContext(e){return "undefined"!=typeof unsafeWindow?unsafeWindow[e]:window[e]}const gmxhr=_async((function(e,t){return new Promise(((s,r)=>{GMxmlHttpRequest(_objectSpread2(_objectSpread2({method:"GET",url:e instanceof URL?e.href:e},null!=t?t:{}),{},{onload:t=>{t.status>=400?r(new HTTPResponseError(e,t)):s(t);},onerror:()=>{r(new NetworkError(e));},onabort:()=>{r(new AbortedError(e));},ontimeout:()=>{r(new TimeoutError(e));}}));}))}));class ResponseError extends CustomError{constructor(e,t){super(t),_defineProperty(this,"url",void 0),this.url=e;}}class HTTPResponseError extends ResponseError{constructor(e,t){t.statusText.trim()?(super(e,"HTTP error ".concat(t.status,": ").concat(t.statusText)),_defineProperty(this,"statusCode",void 0),_defineProperty(this,"statusText",void 0),_defineProperty(this,"response",void 0)):(super(e,"HTTP error ".concat(t.status)),_defineProperty(this,"statusCode",void 0),_defineProperty(this,"statusText",void 0),_defineProperty(this,"response",void 0)),this.response=t,this.statusCode=t.status,this.statusText=t.statusText;}}class TimeoutError extends ResponseError{constructor(e){super(e,"Request timed out");}}class AbortedError extends ResponseError{constructor(e){super(e,"Request aborted");}}class NetworkError extends ResponseError{constructor(e){super(e,"Network error");}}function filterNonNull(e){return e.filter((e=>!(null==e)))}function groupBy(e,t,s){const r=new Map;var a,n=_createForOfIteratorHelper(e);try{for(n.s();!(a=n.n()).done;){var i;const e=a.value,n=t(e),o=s(e);r.has(n)?null===(i=r.get(n))||void 0===i||i.push(o):r.set(n,[o]);}}catch(o){n.e(o);}finally{n.f();}return r}function hexEncode(e){return [...new(getFromPageContext("Uint8Array"))(e)].map((e=>e.toString(16).padStart(2,"0"))).join("")}function blobToDigest(e){return new Promise(((t,s)=>{const r=new FileReader;r.addEventListener("error",s),r.addEventListener("load",_async((function(){var e;const s=r.result,a="undefined"!=typeof crypto&&void 0!==(null===(e=crypto.subtle)||void 0===e?void 0:e.digest);return _invokeIgnored((function(){if(a)return _await(crypto.subtle.digest("SHA-256",s),(function(e){t(hexEncode(e));}));t(hexEncode(s));}))}))),r.readAsArrayBuffer(e);}))}const separator="\n–\n";var _footer=new WeakMap,_extraInfoLines=new WeakMap,_editNoteTextArea=new WeakMap,_removePreviousFooter=new WeakSet;class EditNote{constructor(e){_classPrivateMethodInitSpec(this,_removePreviousFooter),_classPrivateFieldInitSpec(this,_footer,{writable:!0,value:void 0}),_classPrivateFieldInitSpec(this,_extraInfoLines,{writable:!0,value:void 0}),_classPrivateFieldInitSpec(this,_editNoteTextArea,{writable:!0,value:void 0}),_classPrivateFieldSet(this,_footer,e),_classPrivateFieldSet(this,_editNoteTextArea,qs("textarea.edit-note"));const t=_classPrivateFieldGet(this,_editNoteTextArea).value.split(separator)[0];_classPrivateFieldSet(this,_extraInfoLines,t?new Set(t.split("\n").map((e=>e.trimEnd()))):new Set);}addExtraInfo(e){if(_classPrivateFieldGet(this,_extraInfoLines).has(e))return;let t=_classPrivateFieldGet(this,_editNoteTextArea).value.split(separator),s=_toArray(t),r=s[0],a=s.slice(1);r=(r+"\n"+e).trim(),_classPrivateFieldGet(this,_editNoteTextArea).value=[r,...a].join(separator),_classPrivateFieldGet(this,_extraInfoLines).add(e);}addFooter(){_classPrivateMethodGet(this,_removePreviousFooter,_removePreviousFooter2).call(this);const e=_classPrivateFieldGet(this,_editNoteTextArea).value;_classPrivateFieldGet(this,_editNoteTextArea).value=[e,separator,_classPrivateFieldGet(this,_footer)].join("");}static withFooterFromGMInfo(){const e=GMinfo.script,t="".concat(e.name," ").concat(e.version,"\n").concat(e.namespace);return new EditNote(t)}}function _removePreviousFooter2(){const e=_classPrivateFieldGet(this,_editNoteTextArea).value.split(separator).filter((e=>e.trim()!==_classPrivateFieldGet(this,_footer)));_classPrivateFieldGet(this,_editNoteTextArea).value=e.join(separator);}function splitDomain(e){const t=e.split(".");let s=-2;return ["org","co","com"].includes(t[t.length-2])&&(s=-3),t.slice(0,s).concat([t.slice(s).join(".")])}var _map=new WeakMap,_insertLeaf=new WeakSet,_insertInternal=new WeakSet,_insert=new WeakSet,_retrieveLeaf=new WeakSet,_retrieveInternal=new WeakSet,_retrieve=new WeakSet;class DispatchMap{constructor(){_classPrivateMethodInitSpec(this,_retrieve),_classPrivateMethodInitSpec(this,_retrieveInternal),_classPrivateMethodInitSpec(this,_retrieveLeaf),_classPrivateMethodInitSpec(this,_insert),_classPrivateMethodInitSpec(this,_insertInternal),_classPrivateMethodInitSpec(this,_insertLeaf),_classPrivateFieldInitSpec(this,_map,{writable:!0,value:new Map});}set(e,t){const s=splitDomain(e);if("*"===e||s[0].includes("*")&&"*"!==s[0]||s.slice(1).some((e=>e.includes("*"))))throw new Error("Invalid pattern: "+e);return _classPrivateMethodGet(this,_insert,_insert2).call(this,s.slice().reverse(),t),this}get(e){return _classPrivateMethodGet(this,_retrieve,_retrieve2).call(this,splitDomain(e).slice().reverse())}_get(e){return _classPrivateFieldGet(this,_map).get(e)}_set(e,t){return _classPrivateFieldGet(this,_map).set(e,t),this}}function _insertLeaf2(e,t){const s=this._get(e);s?(assert(s instanceof DispatchMap&&!_classPrivateFieldGet(s,_map).has(""),"Duplicate leaf!"),s._set("",t)):this._set(e,t);}function _insertInternal2(e,t){var s;const r=e[0],a=this._get(r);let n;a instanceof DispatchMap?n=a:(n=new DispatchMap,this._set(r,n),void 0!==a&&n._set("",a)),_classPrivateMethodGet(s=n,_insert,_insert2).call(s,e.slice(1),t);}function _insert2(e,t){e.length>1?_classPrivateMethodGet(this,_insertInternal,_insertInternal2).call(this,e,t):(assert(1===e.length,"Empty domain parts?!"),_classPrivateMethodGet(this,_insertLeaf,_insertLeaf2).call(this,e[0],t));}function _retrieveLeaf2(e){let t=this._get(e);if(t instanceof DispatchMap){let e=t._get("");void 0===e&&(e=t._get("*")),t=e;}return t}function _retrieveInternal2(e){const t=this._get(e[0]);if(t instanceof DispatchMap)return _classPrivateMethodGet(t,_retrieve,_retrieve2).call(t,e.slice(1))}function _retrieve2(e){let t;return t=1===e.length?_classPrivateMethodGet(this,_retrieveLeaf,_retrieveLeaf2).call(this,e[0]):_classPrivateMethodGet(this,_retrieveInternal,_retrieveInternal2).call(this,e),void 0===t&&(t=this._get("*")),t}function createPersistentCheckbox(e,t,s){return [function(){var t=document.createElement("input");return t.setAttribute("type","checkbox"),t.setAttribute("id",e),t.addEventListener("change",(t=>{t.currentTarget.checked?localStorage.setItem(e,"delete_to_disable"):localStorage.removeItem(e),s(t);})),t.setAttribute("defaultChecked",!!localStorage.getItem(e)),t}.call(this),function(){var s=document.createElement("label");return s.setAttribute("for",e),appendChildren(s,t),s}.call(this)]}function asyncSleep(e){return new Promise((t=>setTimeout(t,e)))}function retryTimes(e,t,s){const r=_async((function(t){return _catch(e,(function(e){if(t<=1)throw e;return asyncSleep(s).then((()=>r(t-1)))}))}));return t<=0?Promise.reject(new TypeError("Invalid number of retry times: "+t)):r(t)}

  var USERSCRIPT_NAME = "mb_enhanced_cover_art_uploads";

  // TODO: This originates from mb_caa_dimensions but is also used here. Not sure
  // where to put it. It might make sense to put it in the mb_caa_dimensions source
  // tree later on, and import it in this source tree where necessary.
  function getImageDimensions(url) {
    return new Promise((resolve, reject) => {
      let done = false;

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

      const img = document.createElement('img');
      img.addEventListener('load', () => {
        dimensionsLoaded({
          height: img.naturalHeight,
          width: img.naturalWidth
        });
      });
      img.addEventListener('error', dimensionsFailed); // onload and onerror are asynchronous, so this interval should have
      // already been set before they are called.

      const interval = window.setInterval(() => {
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

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
        // only image parameters can be decoded to cover art images
        if (!key.startsWith('x_seed.image.')) return;

        try {
          decodeSingleKeyValue(key, value, images);
        } catch (err) {
          LOGGER.error("Invalid image seeding param ".concat(key, "=").concat(value), err);
        }
      }); // Sanity checks: Make sure all images have at least a URL, and condense
      // the array in case indices are missing.

      images = images.filter((image, index) => {
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
      const origin = (_seedParams$get = seedParams.get('x_seed.origin')) !== null && _seedParams$get !== void 0 ? _seedParams$get : undefined;
      return new SeedParameters(images, origin);
    }

  }

  const addSeedLinkToCover = _async(function (fig, mbid, origin) {
      var _imageUrl$match;
      const imageUrl = qs('a.icon', fig).href;
      const ext = (_imageUrl$match = imageUrl.match(/\.(\w+)$/)) === null || _imageUrl$match === void 0 ? void 0 : _imageUrl$match[1];
      return _await(getImageDimensions(imageUrl), function (imageDimensions) {
          var _fig$closest, _qs$insertAdjacentEle;
          const dimensionStr = ''.concat(imageDimensions.width, 'x').concat(imageDimensions.height);
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
          const releaseUrl = RELEASE_URL_CONSTRUCTORS[vendorCode](vendorId, countryCode);
          const params = new SeedParameters([{ url: new URL(releaseUrl) }], origin);
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
      supportedDomains: ['atisket.pulsewidth.org.uk'],
      supportedRegexes: [/\.uk\/\?.+/],
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
      supportedDomains: ['atisket.pulsewidth.org.uk'],
      supportedRegexes: [/\.uk\/atasket\.php\?/],
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
      qsa('figure.cover').forEach(fig => {
          addSeedLinkToCover(fig, mbid, origin);
      });
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
      } // Optional chaining is unnecessary overhead, we just created the entry above
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion


      SEEDER_DISPATCH_MAP.get(domain).push(seeder);
    });
  }
  function seederFactory(url) {
    var _SEEDER_DISPATCH_MAP$;

    return (_SEEDER_DISPATCH_MAP$ = SEEDER_DISPATCH_MAP.get(url.hostname.replace(/^www\./, ''))) === null || _SEEDER_DISPATCH_MAP$ === void 0 ? void 0 : _SEEDER_DISPATCH_MAP$.find(seeder => seederSupportsURL(seeder, url));
  }

  const _urlToDigest2 = _async(function (imageUrl) {
    const _this4 = this;

    return _await(gmxhr(_this4.imageToThumbnailUrl(imageUrl), {
      responseType: 'blob'
    }), function (resp) {
      return blobToDigest(resp.response);
    });
  });

  class CoverArtProvider {
    constructor() {
      _defineProperty(this, "supportedDomains", void 0);

      _defineProperty(this, "name", void 0);

      _defineProperty(this, "urlRegex", void 0);

      _defineProperty(this, "allowButtons", true);
    }

    /**
     * Postprocess the fetched images. By default, does nothing, however,
     * subclasses can override this to e.g. filter out or merge images after
     * they've been fetched.
     */
    postprocessImages(images) {
      return images;
    }
    /**
     * Returns a clean version of the given URL.
     * This version should be used to match against `urlRegex`.
     */


    cleanUrl(url) {
      return url.host + url.pathname;
    }
    /**
     * Check whether the provider supports the given URL.
     *
     * @param      {URL}    url     The provider URL.
     * @return     {boolean}  Whether images can be extracted for this URL.
     */


    supportsUrl(url) {
      if (Array.isArray(this.urlRegex)) {
        return this.urlRegex.some(regex => regex.test(this.cleanUrl(url)));
      }

      return this.urlRegex.test(this.cleanUrl(url));
    }
    /**
     * Extract ID from a release URL.
     */


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
    /**
     * Check whether a redirect is safe, i.e. both URLs point towards the same
     * release.
     */


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
  let ArtworkTypeIDs;

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

  class HeadMetaPropertyProvider extends CoverArtProvider {
    // Providers for which the cover art can be retrieved from the head
    // og:image property and maximised using maxurl

    /**
     * Template method to be used by subclasses to check whether the document
     * indicates a missing release. This only needs to be implemented if the
     * provider returns success codes for releases which are 404.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    is404Page(_document) {
      return false;
    }

    findImages(url) {
      const _this2 = this;

      return _call(function () {
        // Find an image link from a HTML head meta property, maxurl will
        // maximize it for us. Don't want to use the API because of OAuth.
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

  var _groupIdenticalImages = /*#__PURE__*/new WeakSet();

  var _urlToDigest = /*#__PURE__*/new WeakSet();

  var _createTrackImageComment = /*#__PURE__*/new WeakSet();

  class ProviderWithTrackImages extends CoverArtProvider {
    constructor() {
      super(...arguments);

      _classPrivateMethodInitSpec(this, _createTrackImageComment);

      _classPrivateMethodInitSpec(this, _urlToDigest);

      _classPrivateMethodInitSpec(this, _groupIdenticalImages);
    }

    imageToThumbnailUrl(imageUrl) {
      // To be overridden by subclass if necessary.
      return imageUrl;
    }

    mergeTrackImages(trackImages, mainUrl, byContent) {
      const _this3 = this;

      return _call(function () {
        const allTrackImages = filterNonNull(trackImages); // First pass: URL only

        const groupedImages = _classPrivateMethodGet(_this3, _groupIdenticalImages, _groupIdenticalImages2).call(_this3, allTrackImages, img => img.url, mainUrl); // Second pass: Thumbnail content
        // We do not need to deduplicate by content if there's only one track
        // image and there's no main URL to compare to.


        return _await(_invoke(function () {
          if (byContent && groupedImages.size && !(groupedImages.size === 1 && !mainUrl)) {
            LOGGER.info('Deduplicating track images by content, this may take a while…'); // Compute unique digests of all thumbnail images. We'll use these
            // digests in `#groupIdenticalImages` to group by thumbnail content.

            return _await(mainUrl ? _classPrivateMethodGet(_this3, _urlToDigest, _urlToDigest2).call(_this3, mainUrl) : '', function (mainDigest) {
              // Extend the track image with the track's unique digest. We compute
              // this digest once for each unique URL.
              return _await(Promise.all([...groupedImages.entries()].map(_async(function (_ref) {
                let _ref2 = _slicedToArray(_ref, 2),
                    coverUrl = _ref2[0],
                    trackImages = _ref2[1];

                return _await(_classPrivateMethodGet(_this3, _urlToDigest, _urlToDigest2).call(_this3, coverUrl), function (digest) {
                  return trackImages.map(trackImage => {
                    return _objectSpread2(_objectSpread2({}, trackImage), {}, {
                      digest
                    });
                  });
                });
              }))), function (tracksWithDigest) {
                const groupedThumbnails = _classPrivateMethodGet(_this3, _groupIdenticalImages, _groupIdenticalImages2).call(_this3, tracksWithDigest.flat(), trackWithDigest => trackWithDigest.digest, mainDigest); // The previous `groupedImages` map groups images by URL. Overwrite
                // this to group images by thumbnail content. Keys will remain URLs,
                // we'll use the URL of the first image in the group. It doesn't
                // really matter which URL we use, as we've already asserted that
                // the images behind all these URLs in the group are identical.


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
          // Queue one item for each group of track images. We'll create a comment
          // to indicate which tracks this image belongs to.
          const results = [];
          groupedImages.forEach((trackImages, imgUrl) => {
            results.push({
              url: new URL(imgUrl),
              types: [ArtworkTypeIDs.Track],
              comment: _classPrivateMethodGet(_this3, _createTrackImageComment, _createTrackImageComment2).call(_this3, trackImages.map(trackImage => trackImage.trackNumber)) || undefined
            });
          });
          return results;
        }));
      });
    }

  }

  function _groupIdenticalImages2(images, getImageUniqueId, mainUniqueId) {
    const uniqueImages = images.filter(img => getImageUniqueId(img) !== mainUniqueId);
    return groupBy(uniqueImages, getImageUniqueId, img => img);
  }

  function _createTrackImageComment2(trackNumbers) {
    const definedTrackNumbers = filterNonNull(trackNumbers);
    if (!definedTrackNumbers.length) return '';
    const prefix = definedTrackNumbers.length === 1 ? 'Track' : 'Tracks';
    return "".concat(prefix, " ").concat(definedTrackNumbers.sort().join(', '));
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

    const _faceKeywords$map = faceKeywords.map(faceKw => !!keywords // Case-insensitive .includes()
    .find(kw => kw.toLowerCase() === faceKw.toLowerCase())),
          _faceKeywords$map2 = _slicedToArray(_faceKeywords$map, 3),
          hasFront = _faceKeywords$map2[0],
          hasBack = _faceKeywords$map2[1],
          hasSpine = _faceKeywords$map2[2];

    if (hasFront) types.push(ArtworkTypeIDs.Front);
    if (hasBack) types.push(ArtworkTypeIDs.Back); // Assuming if the front and back are included, the spine is as well.

    if (hasSpine || hasFront && hasBack) types.push(ArtworkTypeIDs.Spine); // Copy anything other than 'front', 'back', or 'spine' to the comment

    const otherKeywords = keywords.filter(kw => !faceKeywords.includes(kw.toLowerCase()));
    const comment = otherKeywords.join(' ').trim();
    return {
      type: types,
      comment
    };
  } // Keys: First word of the VGMdb caption (mostly structured), lower-cased
  // Values: Either MappedArtwork or a callable taking the remainder of the caption and returning MappedArtwork

  const __CAPTION_TYPE_MAPPING = {
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
      const retObj = ret;
      return {
        types: Array.isArray(retObj.type) ? retObj.type : [retObj.type],
        comment: retObj.comment
      };
    }

    let types = ret;
    /* istanbul ignore next: No mapper generates this currently */

    if (!Array.isArray(types)) {
      types = [types];
    }

    return {
      types,
      comment: ''
    };
  }

  const CAPTION_TYPE_MAPPING = {}; // Convert all definitions to a single signature for easier processing later on

  for (var _i = 0, _Object$entries = Object.entries(__CAPTION_TYPE_MAPPING); _i < _Object$entries.length; _i++) {
    const _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
          key = _Object$entries$_i[0],
          value = _Object$entries$_i[1];

    // Since value is a block-scoped const, the lambda will close over that
    // exact value. It wouldn't if it was a var, as `value` would in the end
    // only refer to the last value. Babel transpiles this correctly, so this
    // is safe.
    CAPTION_TYPE_MAPPING[key] = caption => {
      if (typeof value === 'function') {
        // Assume the function sets everything correctly, including the
        // comment
        return convertMappingReturnValue(value(caption));
      }

      const retObj = convertMappingReturnValue(value); // Add remainder of the caption to the comment returned by the mapping

      if (retObj.comment && caption) retObj.comment += ' ' + caption; // If there's a caption but no comment, set the comment to the caption
      else if (caption) retObj.comment = caption; // Otherwise there's a comment set by the mapper but no caption => keep,
      // or neither a comment nor a caption => nothing needs to be done.

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

          const pageDom = parseDOM(pageSrc, url.href); // istanbul ignore else: Tests are not logged in

          if (qsMaybe('#navmember', pageDom) === null) {
            LOGGER.warn('Heads up! VGMdb requires you to be logged in to view all images. Some images may have been missed. If you have an account, please log in to VGMdb to fetch all images.');
          }

          const coverGallery = qsMaybe('#cover_gallery', pageDom);
          return _await(coverGallery ? VGMdbProvider.extractCoversFromDOMGallery(coverGallery) : [], function (galleryCovers) {
            var _qsMaybe, _qsMaybe$style$backgr;

            // Add the main cover if it's not in the gallery
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
        caption: (_qs$textContent = qs('.label', anchor).textContent) !== null && _qs$textContent !== void 0 ? _qs$textContent :
        /* istanbul ignore next */
        ''
      });
    }

    findImagesWithApi(url) {
      const _this3 = this;

      return _call(function () {
        // Using the unofficial API at vgmdb.info
        const id = _this3.extractId(url);

        assertHasValue(id);
        const apiUrl = "https://vgmdb.info/album/".concat(id, "?format=json");
        return _await(gmxhr(apiUrl), function (apiResp) {
          const metadata = safeParseJSON(apiResp.responseText, 'Invalid JSON response from vgmdb.info API');
          assert(metadata.link === 'album/' + id, "VGMdb.info returned wrong release: Requested album/".concat(id, ", got ").concat(metadata.link));
          return _classStaticPrivateMethodGet(VGMdbProvider, VGMdbProvider, _extractImagesFromApiMetadata).call(VGMdbProvider, metadata);
        });
      });
    }

  }

  function _extractImagesFromApiMetadata(metadata) {
    const covers = metadata.covers.map(cover => {
      return {
        url: cover.full,
        caption: cover.name
      };
    });

    if (metadata.picture_full && !covers.find(cover => cover.url === metadata.picture_full)) {
      // Assuming the main picture is the front cover
      covers.unshift({
        url: metadata.picture_full,
        caption: 'Front'
      });
    }

    return covers.map(convertCaptions);
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

  /* istanbul ignore file: Imports TSX, covered by E2E */
  registerSeeder(AtisketSeeder);
  registerSeeder(AtasketSeeder);
  registerSeeder(VGMdbSeeder);

  // we can also grab it from the <head> element metadata, which is a lot less
  // effort, and we get the added benefit of redirect safety.

  class SevenDigitalProvider extends HeadMetaPropertyProvider {
    constructor() {
      super(...arguments);

      _defineProperty(this, "supportedDomains", ['*.7digital.com']);

      _defineProperty(this, "favicon", 'https://css-cdn.7digital.com/static/build/images/favicons/7digital/touch-ipad-retina.png');

      _defineProperty(this, "name", '7digital');

      _defineProperty(this, "urlRegex", /release\/.*-(\d+)(?:\/|$)/);
    }

    postprocessImages(images) {
      return images // Filter out images that either are, or were redirected to the cover
      // with ID 0000000016. This is a placeholder image.
      .filter(image => {
        if (/\/0000000016_\d+/.test(image.fetchedUrl.pathname)) {
          LOGGER.warn('Ignoring placeholder cover in 7digital release');
          return false;
        }

        return true;
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
        // If the release does not exist, AllMusic redirects to the front page
        // (and sometimes to an album). The redirection check should figure that
        // out and raise an error.
        return _await(_this.fetchPage(url), function (page) {
          var _page$match;

          // Extracting from embedded JS which contains a JSON array of all images
          const galleryJson = (_page$match = page.match(/var imageGallery = (.+);$/m)) === null || _page$match === void 0 ? void 0 : _page$match[1]; // istanbul ignore if: Difficult to cover

          if (!galleryJson) {
            throw new Error('Failed to extract AllMusic images from embedded JS');
          }

          const gallery = safeParseJSON(galleryJson); // istanbul ignore if: Difficult to cover

          if (!gallery) {
            throw new Error('Failed to parse AllMusic JSON gallery data');
          }

          return gallery.map(image => {
            return {
              // Maximise to original format here already, generates less
              // edit note spam.
              url: new URL(image.url.replace(/&f=\d+$/, '&f=0'))
            };
          });
        });
      });
    }

  }

  const PLACEHOLDER_IMG_REGEX = /01RmK(?:\+|%2B)J4pJL/; // Incomplete, only what we need

  const VARIANT_TYPE_MAPPING = {
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

  class AmazonProvider extends CoverArtProvider {
    constructor() {
      super(...arguments);

      _classPrivateMethodInitSpec(this, _convertVariant);

      _classPrivateMethodInitSpec(this, _extractFrontCover);

      _defineProperty(this, "supportedDomains", ['amazon.ae', 'amazon.ca', 'amazon.cn', 'amazon.de', 'amazon.eg', 'amazon.es', 'amazon.fr', 'amazon.in', 'amazon.it', 'amazon.jp', 'amazon.nl', 'amazon.pl', 'amazon.sa', 'amazon.se', 'amazon.sg', 'amazon.co.jp', 'amazon.co.uk', 'amazon.com', 'amazon.com.au', 'amazon.com.br', 'amazon.com.mx', 'amazon.com.tr']);

      _defineProperty(this, "name", 'Amazon');

      _defineProperty(this, "urlRegex", /\/(?:gp\/product|dp)\/([A-Za-z0-9]{10})(?:\/|$)/);
    }

    // Favicon URL is blocked by Firefox' Enhanced Tracking Protection
    get favicon() {
      return GMgetResourceUrl('amazonFavicon');
    }

    findImages(url) {
      const _this = this;

      return _call(function () {
        return _await(_this.fetchPage(url), function (pageContent) {
          const pageDom = parseDOM(pageContent, url.href); // Look for products which only have a single image, the front cover.

          const frontCover = _classPrivateMethodGet(_this, _extractFrontCover, _extractFrontCover2).call(_this, pageDom);

          if (frontCover) {
            return [frontCover];
          } // For physical products we have to extract the embedded JS from the
          // page source to get all images in their highest available resolution.


          let covers = _this.extractFromEmbeddedJS(pageContent);

          if (!covers) {
            // Use the (smaller) image thumbnails in the sidebar as a fallback,
            // although it might not contain all of them. IMU will maximise,
            // but the results are still inferior to the embedded hires images.
            covers = _this.extractFromThumbnailSidebar(pageDom);
          }

          if (!covers.length) {
            var _this$extractFromEmbe;

            // Handle physical audiobooks, the above extractors fail for those.
            LOGGER.warn('Found no release images, trying to find an Amazon (audio)book gallery…');
            covers = (_this$extractFromEmbe = _this.extractFromEmbeddedJSGallery(pageContent)) !== null && _this$extractFromEmbe !== void 0 ? _this$extractFromEmbe :
            /* istanbul ignore next: Should never happen */
            [];
          } // Filter out placeholder images.


          return covers.filter(img => !PLACEHOLDER_IMG_REGEX.test(img.url.href));
        });
      });
    }

    extractFromEmbeddedJS(pageContent) {
      var _pageContent$match;

      const embeddedImages = (_pageContent$match = pageContent.match(/'colorImages': { 'initial': (.+)},$/m)) === null || _pageContent$match === void 0 ? void 0 : _pageContent$match[1];

      if (!embeddedImages) {
        LOGGER.warn('Failed to extract Amazon images from the embedded JS, falling back to thumbnails');
        return;
      }

      const imgs = safeParseJSON(embeddedImages);

      if (!Array.isArray(imgs)) {
        LOGGER.error("Failed to parse Amazon's embedded JS, falling back to thumbnails");
        return;
      }

      return imgs.map(img => {
        var _img$hiRes;

        // `img.hiRes` is probably only `null` when `img.large` is the placeholder image?
        return _classPrivateMethodGet(this, _convertVariant, _convertVariant2).call(this, {
          url: (_img$hiRes = img.hiRes) !== null && _img$hiRes !== void 0 ? _img$hiRes : img.large,
          variant: img.variant
        });
      });
    }

    extractFromEmbeddedJSGallery(pageContent) {
      var _pageContent$match2;

      const embeddedGallery = (_pageContent$match2 = pageContent.match(/'imageGalleryData' : (.+),$/m)) === null || _pageContent$match2 === void 0 ? void 0 : _pageContent$match2[1];

      if (!embeddedGallery) {
        LOGGER.warn('Failed to extract Amazon images from the embedded JS (audio)book gallery');
        return;
      }

      const imgs = safeParseJSON(embeddedGallery);

      if (!Array.isArray(imgs)) {
        LOGGER.error("Failed to parse Amazon's embedded JS (audio)book gallery");
        return;
      } // Amazon embeds no image variants on these pages, so we don't know the types


      return imgs.map(img => ({
        url: new URL(img.mainUrl)
      }));
    }

    extractFromThumbnailSidebar(pageDom) {
      const imgs = qsa('#altImages img', pageDom);
      return imgs.map(img => {
        var _img$closest, _safeParseJSON;

        const dataThumbAction = (_img$closest = img.closest('span[data-thumb-action]')) === null || _img$closest === void 0 ? void 0 : _img$closest.getAttribute('data-thumb-action');
        const variant = dataThumbAction && ((_safeParseJSON = safeParseJSON(dataThumbAction)) === null || _safeParseJSON === void 0 ? void 0 : _safeParseJSON.variant);
        /* istanbul ignore if: Difficult to exercise */

        if (!variant) {
          LOGGER.warn('Failed to extract the Amazon image variant code from the JSON attribute');
        }

        return _classPrivateMethodGet(this, _convertVariant, _convertVariant2).call(this, {
          url: img.src,
          variant
        });
      });
    }

  }

  function _extractFrontCover2(pageDom) {
    const frontCoverSelectors = ['#digitalMusicProductImage_feature_div > img', // Streaming/MP3 products
    'img#main-image' // Audible products
    ];

    for (var _i = 0, _frontCoverSelectors = frontCoverSelectors; _i < _frontCoverSelectors.length; _i++) {
      const selector = _frontCoverSelectors[_i];
      const productImage = qsMaybe(selector, pageDom);

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
        // Translate Amazon Music to Amazon product links. The cover art should
        // be the same, but extracting the cover art from Amazon Music requires
        // complex API requests with CSRF tokens, whereas product pages are much
        // easier. Besides, cover art on product pages tends to be larger.
        // NOTE: I'm not 100% certain the images are always identical, or that
        // the associated product always exists.
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

  const _amendSquareThumbnails2 = _async(function (covers) {
    return Promise.all(covers.map(_async(function (cover) {
      // To figure out the original image's dimensions, we need to fetch
      // the cover itself, preferably the full-sized one. This means that
      // we're actually fetching the cover twice: Here, and in the fetcher
      // after we return our results. However, this isn't a big problem,
      // since to compute dimensions, typically only a very small portion
      // of the data is loaded, and besides, the second time the content
      // is fetched, browsers can reuse the data they already loaded
      // previously.
      return _await(getImageDimensions(cover.url.href.replace(/_\d+\.(\w+)$/, '_0.$1')), function (coverDims) {
        // Prevent zero-division errors

        /* istanbul ignore if: Should not happen */
        if (!coverDims.width || !coverDims.height) {
          return [cover];
        }

        const ratio = coverDims.width / coverDims.height;
        return 0.95 <= ratio && ratio <= 1.05 ? [cover] : [_objectSpread2(_objectSpread2({}, cover), {}, {
          comment: filterNonNull([cover.comment, 'Bandcamp full-sized cover']).join(' - ')
        }), {
          types: cover.types,
          // *_16.jpg URLs are the largest square crop available, always 700x700
          url: new URL(cover.url.href.replace(/_\d+\.(\w+)$/, '_16.$1')),
          comment: filterNonNull([cover.comment, 'Bandcamp square crop']).join(' - '),
          skipMaximisation: true
        }];
      });
    }))).then(covers => covers.flat());
  });

  const _findTrackImage2 = _async(function (trackRow, fetchPage) {
    var _trackRow$getAttribut, _trackRow$getAttribut2, _qsMaybe;

    const _this3 = this;

    // Account for alphabetical track numbers too
    const trackNum = (_trackRow$getAttribut = trackRow.getAttribute('rel')) === null || _trackRow$getAttribut === void 0 ? void 0 : (_trackRow$getAttribut2 = _trackRow$getAttribut.match(/tracknum=(\w+)/)) === null || _trackRow$getAttribut2 === void 0 ? void 0 : _trackRow$getAttribut2[1];
    const trackUrl = (_qsMaybe = qsMaybe('.title > a', trackRow)) === null || _qsMaybe === void 0 ? void 0 : _qsMaybe.href;
    /* istanbul ignore if: Cannot immediately find a release where a track is not linked */

    if (!trackUrl) {
      LOGGER.warn("Could not check track ".concat(trackNum, " for track images"));
      return;
    }

    return _catch(function () {
      return _await(fetchPage(new URL(trackUrl)), function (_fetchPage) {
        const trackPage = parseDOM(_fetchPage, trackUrl);

        const imageUrl = _classPrivateMethodGet(_this3, _extractCover, _extractCover2).call(_this3, trackPage);
        /* istanbul ignore if: Cannot find example */


        if (!imageUrl) {
          // Track has no cover
          return;
        }

        return {
          url: imageUrl,
          trackNumber: trackNum
        };
      });
    }, function (err)
    /* istanbul ignore next: Difficult to test */
    {
      LOGGER.error("Could not check track ".concat(trackNum, " for track images"), err);
    });
  });

  const _findTrackImages2 = _async(function (doc, mainUrl) {
    const _this2 = this;

    // Unfortunately it doesn't seem like they can be extracted from the
    // album page itself, so we have to load each of the tracks separately.
    // Deliberately throttling these requests as to not flood Bandcamp and
    // potentially get banned.
    // It appears that they used to have an API which returned all track
    // images in one request, but that API has been locked down :(
    // https://michaelherger.github.io/Bandcamp-API/#/Albums/get_api_album_2_info
    const trackRows = qsa('#track_table .track_row_view', doc);
    if (!trackRows.length) return [];
    LOGGER.info('Checking for Bandcamp track images, this may take a few seconds…'); // Max 5 requests per second

    const throttledFetchPage = pThrottle({
      interval: 1000,
      limit: 5
    })(_this2.fetchPage.bind(_this2)); // This isn't the most efficient, as it'll have to request all tracks
    // before it even returns the main album cover. Although fixable by
    // e.g. using an async generator, it might lead to issues with users
    // submitting the upload form before all track images are fetched...

    return _await(Promise.all(trackRows.map(trackRow => _classPrivateMethodGet(_this2, _findTrackImage, _findTrackImage2).call(_this2, trackRow, throttledFetchPage))), function (trackImages) {
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

  var _extractCover = /*#__PURE__*/new WeakSet();

  var _findTrackImages = /*#__PURE__*/new WeakSet();

  var _findTrackImage = /*#__PURE__*/new WeakSet();

  var _amendSquareThumbnails = /*#__PURE__*/new WeakSet();

  class BandcampProvider extends ProviderWithTrackImages {
    constructor() {
      super(...arguments);

      _classPrivateMethodInitSpec(this, _amendSquareThumbnails);

      _classPrivateMethodInitSpec(this, _findTrackImage);

      _classPrivateMethodInitSpec(this, _findTrackImages);

      _classPrivateMethodInitSpec(this, _extractCover);

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

          const albumCoverUrl = _classPrivateMethodGet(_this, _extractCover, _extractCover2).call(_this, respDocument);

          const covers = [];

          if (albumCoverUrl) {
            covers.push({
              url: new URL(albumCoverUrl),
              types: [ArtworkTypeIDs.Front]
            });
          } else {
            // Release has no images. May still have track covers though.
            LOGGER.warn('Bandcamp release has no cover');
          } // Don't bother extracting track images if we only need the front cover


          return _await(onlyFront ? [] : _classPrivateMethodGet(_this, _findTrackImages, _findTrackImages2).call(_this, respDocument, albumCoverUrl), function (trackImages) {
            return _classPrivateMethodGet(_this, _amendSquareThumbnails, _amendSquareThumbnails2).call(_this, covers.concat(trackImages));
          }, onlyFront);
        });
      });
    }

    imageToThumbnailUrl(imageUrl) {
      // 150x150
      return imageUrl.replace(/_\d+\.(\w+)$/, '_7.$1');
    }

  }

  function _extractCover2(doc) {
    if (qsMaybe('#missing-tralbum-art', doc) !== null) {
      // No images
      return;
    }

    return qs('#tralbumArt > .popupImage', doc).href;
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
        // Like the implementation of HeadMetaPropertyProvider, but Beatport
        // uses <meta name="og:image" ...> instead of <meta property="og:image" ...>
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
          // Filter out placeholder images
          return covers.filter(cover => {
            // Placeholder covers all use the same URLs, since the URL cover "ID"
            // is actually its MD5 sum. See https://github.com/ROpdebee/mb-userscripts/issues/172
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

  // JS sources somehow.

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
        // Loading the full HTML and parsing the metadata JSON embedded within
        // it.
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
      } // Evict the promise from the cache if it rejects, so that we can retry
      // later. If we don't evict it, later retries will reuse the failing
      // promise. Only remove if it hasn't been replaced yet. It may have
      // already been replaced by another call, since this is asynchronous code


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

        // Maximising by querying the API for all images of the release, finding
        // the right one, and extracting the "full size" (i.e., 600x600 JPEG) URL.
        const imageName = (_url$pathname$match = url.pathname.match(/discogs-images\/(R-.+)$/)) === null || _url$pathname$match === void 0 ? void 0 : _url$pathname$match[1];
        const releaseId = imageName === null || imageName === void 0 ? void 0 : (_imageName$match = imageName.match(/^R-(\d+)/)) === null || _imageName$match === void 0 ? void 0 : _imageName$match[1];
        /* istanbul ignore if: Should never happen on valid image */

        return releaseId ? _await(_this2.getReleaseImages(releaseId), function (releaseData) {
          const matchedImage = releaseData.data.release.images.edges.find(img => urlBasename(img.node.fullsize.sourceUrl) === imageName);
          /* istanbul ignore if: Should never happen on valid image */

          return matchedImage ? new URL(matchedImage.node.fullsize.sourceUrl) : url;
        }) : _await(url);
      });
    }

  }

  _defineProperty(DiscogsProvider, "apiResponseCache", new Map());

  class MelonProvider extends HeadMetaPropertyProvider {
    constructor() {
      super(...arguments);

      _defineProperty(this, "supportedDomains", ['melon.com']);

      _defineProperty(this, "favicon", 'https://www.melon.com/favicon.ico');

      _defineProperty(this, "name", 'Melon');

      _defineProperty(this, "urlRegex", /album\/detail\.htm.*[?&]albumId=(\d+)/);
    }

    cleanUrl(url) {
      // Album ID is in the query params, base `cleanUrl` strips those away.
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

      _defineProperty(this, "urlRegex", /release\/([a-z0-9-]+)/);
    }

    findImages(url) {
      const _this = this;

      return _call(function () {
        const mbid = _this.extractId(url);

        assertDefined(mbid); // Grabbing metadata through CAA isn't 100% reliable, since the info
        // in the index.json isn't always up-to-date (see CAA-129, only a few
        // cases though).

        const caaIndexUrl = "https://archive.org/download/mbid-".concat(mbid, "/index.json");
        return _await(fetch(caaIndexUrl), function (caaResp) {
          if (caaResp.status >= 400) {
            throw new Error("Cannot load index.json: HTTP error ".concat(caaResp.status));
          } // Could just use resp.json() here, but let's be safe in case IA returns
          // something other than JSON.


          return _await(caaResp.text(), function (_caaResp$text) {
            const caaIndex = safeParseJSON(_caaResp$text, 'Could not parse index.json');
            return caaIndex.images.map(img => {
              const imageFileName = urlBasename(img.image);
              return {
                // Skip one level of indirection
                url: new URL("https://archive.org/download/mbid-".concat(mbid, "/mbid-").concat(mbid, "-").concat(imageFileName)),
                comment: img.comment,
                types: img.types.map(type => ArtworkTypeIDs[type])
              };
            });
          });
        });
      });
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

    // Assuming this doesn't change often. If it does, we might have to extract it
    // from the JS code loaded on open.qobuz.com, but for simplicity's sake, let's
    // just use a constant app ID first.
    // Static getter instead of property so that we can spy on it in the tests.
    static get QOBUZ_APP_ID() {
      return '712109809';
    }

    static idToCoverUrl(id) {
      const d1 = id.slice(-2);
      const d2 = id.slice(-4, -2); // Is this always .jpg?

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

    static extractGoodies(goodie) {
      // Livret Numérique = Digital Booklet
      const isBooklet = goodie.name.toLowerCase() === 'livret numérique';
      return {
        url: new URL(goodie.original_url),
        types: isBooklet ? [ArtworkTypeIDs.Booklet] : [],
        comment: isBooklet ? 'Qobuz booklet' : goodie.name
      };
    }

    findImages(url) {
      const _this = this;

      return _call(function () {
        let _exit = false;

        const id = _this.extractId(url);

        assertHasValue(id); // eslint-disable-next-line init-declarations

        let metadata;
        return _await(_continue(_catch(function () {
          return _await(QobuzProvider.getMetadata(id), function (_QobuzProvider$getMet) {
            metadata = _QobuzProvider$getMet;
          });
        }, function (err) {
          // We could use the URL rewriting technique to still get the cover,
          // but if we do that, we'd have to swallow this error. It's better
          // to just throw here, IMO, so we could fix any error.
          if (err instanceof HTTPResponseError && err.statusCode == 400) {
            // Bad request, likely invalid app ID.
            // Log the original error silently to the console, and throw
            // a more user friendly one for displaying in the UI
            console.error(err);
            throw new Error('Bad request to Qobuz API, app ID invalid?');
          }

          throw err;
        }), function (_result) {
          var _metadata$goodies;

          if (_exit) ;
          const goodies = ((_metadata$goodies = metadata.goodies) !== null && _metadata$goodies !== void 0 ? _metadata$goodies : []).map(QobuzProvider.extractGoodies);
          const coverUrl = metadata.image.large.replace(/_\d+\.([a-zA-Z0-9]+)$/, '_org.$1');
          return [{
            url: new URL(coverUrl),
            types: [ArtworkTypeIDs.Front]
          }, ...goodies];
        }));
      });
    }

  }

  // https://github.com/ROpdebee/mb-userscripts/issues/158

  class QubMusiqueProvider extends QobuzProvider {
    constructor() {
      super(...arguments);

      _defineProperty(this, "supportedDomains", ['qub.ca']);

      _defineProperty(this, "favicon", 'https://www.qub.ca/assets/favicons/apple-touch-icon.png');

      _defineProperty(this, "name", 'QUB Musique');

      _defineProperty(this, "urlRegex", [/musique\/album\/[\w-]*-([A-Za-z0-9]+)(?:\/|$)/]);
    } // We can reuse the rest of the implementations of QobuzProvider, since it
    // extracts the ID and uses the Qobuz API instead of loading the page.


  }

  class RateYourMusicProvider extends CoverArtProvider {
    constructor() {
      super(...arguments);

      _defineProperty(this, "supportedDomains", ['rateyourmusic.com']);

      _defineProperty(this, "favicon", 'https://e.snmc.io/2.5/img/sonemic.png');

      _defineProperty(this, "name", 'RateYourMusic');

      _defineProperty(this, "urlRegex", /\/release\/album\/([^/]+\/[^/]+)(?:\/|$)/);
    }

    findImages(url) {
      const _this = this;

      return _call(function () {
        const releaseId = _this.extractId(url);

        assertHasValue(releaseId); // Need to go through the Buy page to find full-res images. The user
        // must be logged in to get the full-res image. We can't use the
        // thumbnails in case the user is not logged in, since they're served
        // as WebP, which isn't supported by CAA (yet).

        const buyUrl = "https://rateyourmusic.com/release/album/".concat(releaseId, "/buy");
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

  const _extractCoversFromSetMetadata2 = _async(function (metadata, onlyFront) {
    const _this2 = this;

    const covers = [];
    /* istanbul ignore else: Cannot find case */

    if (metadata.data.artwork_url) {
      covers.push({
        url: new URL(metadata.data.artwork_url),
        types: [ArtworkTypeIDs.Front]
      });
    } // Don't bother extracting track covers if they won't be used anyway


    if (onlyFront) return covers;
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

  var _extractCoverFromTrackMetadata = /*#__PURE__*/new WeakSet();

  var _extractCoversFromSetMetadata = /*#__PURE__*/new WeakSet();

  class SoundcloudProvider extends ProviderWithTrackImages {
    constructor() {
      super(...arguments);

      _classPrivateMethodInitSpec(this, _extractCoversFromSetMetadata);

      _classPrivateMethodInitSpec(this, _extractCoverFromTrackMetadata);

      _defineProperty(this, "supportedDomains", ['soundcloud.com']);

      _defineProperty(this, "favicon", 'https://a-v2.sndcdn.com/assets/images/sc-icons/favicon-2cadd14bdb.ico');

      _defineProperty(this, "name", 'Soundcloud');

      _defineProperty(this, "urlRegex", []);
    }

    supportsUrl(url) {
      const _url$pathname$trim$sl = url.pathname.trim() // Remove leading slash
      .slice(1) // Remove trailing slash, if any
      .replace(/\/$/, '').split('/'),
            _url$pathname$trim$sl2 = _toArray(_url$pathname$trim$sl),
            artistId = _url$pathname$trim$sl2[0],
            pathParts = _url$pathname$trim$sl2.slice(1);

      return !!pathParts.length && !SoundcloudProvider.badArtistIDs.has(artistId) // artist/likes, artist/track/recommended, artist/sets, ...
      // but not artist/sets/setname!
      && !SoundcloudProvider.badSubpaths.has(urlBasename(url));
    }

    extractId(url) {
      // We'll use the full path as the ID. This will allow us to distinguish
      // between sets and single tracks, artists, etc.
      // We should've filtered out all bad URLs already.
      // https://soundcloud.com/jonnypalding/sets/talk-21/s-Oeb9wlaKWyl
      // Not sure what the last path component means, but it's required to
      // open that set. Perhaps because it's private?
      return url.pathname.slice(1); // Remove leading slash
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
            return _classPrivateMethodGet(_this, _extractCoverFromTrackMetadata, _extractCoverFromTrackMetadata2).call(_this, metadata);
          } else {
            assert(metadata.hydratable === 'playlist');
            return _classPrivateMethodGet(_this, _extractCoversFromSetMetadata, _extractCoversFromSetMetadata2).call(_this, metadata, onlyFront);
          }
        });
      });
    }

    extractMetadataFromJS(pageContent) {
      var _pageContent$match;

      const jsonData = (_pageContent$match = pageContent.match(/>window\.__sc_hydration = (.+);<\/script>/)) === null || _pageContent$match === void 0 ? void 0 : _pageContent$match[1];
      /* istanbul ignore if: Shouldn't happen */

      if (!jsonData) return;
      return safeParseJSON(jsonData);
    }

  }

  function _extractCoverFromTrackMetadata2(metadata) {
    if (!metadata.data.artwork_url) {
      return [];
    }

    return [{
      url: new URL(metadata.data.artwork_url),
      types: [ArtworkTypeIDs.Front]
    }];
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

  // API keys, I guess they might depend on the user type and/or country?
  // Also not sure whether these may change often or not. If they do, we might
  // need to switch to extracting them from the JS.
  // However, seeing as this key has been present in their JS code for at least
  // 3 years already, I doubt this will stop working any time soon.
  // https://web.archive.org/web/20181015184006/https://listen.tidal.com/app.9dbb572e8121f8755b73.js

  const APP_ID = 'CzET4vdadNUFQ5JU'; // Incomplete and not entirely correct, but good enough for our purposes.

  var _countryCode = /*#__PURE__*/new WeakMap();

  class TidalProvider extends CoverArtProvider {
    constructor() {
      super(...arguments);

      _defineProperty(this, "supportedDomains", ['tidal.com', 'listen.tidal.com', 'store.tidal.com']);

      _defineProperty(this, "favicon", 'https://listen.tidal.com/favicon.ico');

      _defineProperty(this, "name", 'Tidal');

      _defineProperty(this, "urlRegex", /\/album\/(\d+)/);

      _classPrivateFieldInitSpec(this, _countryCode, {
        writable: true,
        value: null
      });
    }

    getCountryCode() {
      const _this = this;

      return _call(function () {
        return _await(_invoke(function () {
          if (!_classPrivateFieldGet(_this, _countryCode)) {
            return _await(gmxhr('https://listen.tidal.com/v1/country/context?countryCode=WW&locale=en_US&deviceType=BROWSER', {
              headers: {
                'x-tidal-token': APP_ID
              }
            }), function (resp) {
              const codeResponse = safeParseJSON(resp.responseText, 'Invalid JSON response from Tidal API for country code');

              _classPrivateFieldSet(_this, _countryCode, codeResponse.countryCode);
            });
          }
        }, function () {
          assertHasValue(_classPrivateFieldGet(_this, _countryCode), 'Cannot determine Tidal country');
          return _classPrivateFieldGet(_this, _countryCode);
        }));
      });
    }

    getCoverUrlFromMetadata(albumId) {
      const _this2 = this;

      return _call(function () {
        return _await(_this2.getCountryCode(), function (countryCode) {
          // Not sure whether it's strictly necessary to ping, but let's impersonate
          // the browser as much as we can to avoid getting accidentally blocked.
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
        // Rewrite the URL to point to the main page
        // Both listen.tidal.com and store.tidal.com load metadata through an
        // API. Bare tidal.com returns the image in a <meta> property.
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

  const PROVIDER_DISPATCH = new DispatchMap();

  function addProvider(provider) {
    provider.supportedDomains.forEach(domain => PROVIDER_DISPATCH.set(domain, provider));
  }

  addProvider(new AllMusicProvider());
  addProvider(new AmazonProvider());
  addProvider(new AmazonMusicProvider());
  addProvider(new AppleMusicProvider());
  addProvider(new BandcampProvider());
  addProvider(new BeatportProvider());
  addProvider(new DeezerProvider());
  addProvider(new DiscogsProvider());
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
    const provider = PROVIDER_DISPATCH.get(extractDomain(url));
    return provider !== null && provider !== void 0 && provider.supportsUrl(url) ? provider : undefined;
  }

  var _banner = new WeakMap();
  var _currentMessageClass = new WeakMap();
  var _setStatusBanner = new WeakSet();
  var _setStatusBannerClass = new WeakSet();
  class StatusBanner {
      constructor() {
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
      onInfo(message) {
          _classPrivateMethodGet(this, _setStatusBanner, _setStatusBanner2).call(this, message);
          _classPrivateMethodGet(this, _setStatusBannerClass, _setStatusBannerClass2).call(this, 'info');
      }
      onWarn(message, exception) {
          _classPrivateMethodGet(this, _setStatusBanner, _setStatusBanner2).call(this, message, exception);
          _classPrivateMethodGet(this, _setStatusBannerClass, _setStatusBannerClass2).call(this, 'warning');
      }
      onError(message, exception) {
          _classPrivateMethodGet(this, _setStatusBanner, _setStatusBanner2).call(this, message, exception);
          _classPrivateMethodGet(this, _setStatusBannerClass, _setStatusBannerClass2).call(this, 'error');
      }
      onSuccess(message) {
          _classPrivateMethodGet(this, _setStatusBanner, _setStatusBanner2).call(this, message);
          _classPrivateMethodGet(this, _setStatusBannerClass, _setStatusBannerClass2).call(this, 'success');
      }
      get htmlElement() {
          return _classPrivateFieldGet(this, _banner);
      }
  }
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
  class InputForm {
      constructor(banner, app) {
          var _qs$insertAdjacentEle, _qs$insertAdjacentEle2;
          const _this = this;
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
                      if (_classPrivateFieldGet(_this, _urlInput).value === oldValue) {
                          _classPrivateFieldGet(_this, _urlInput).value = '';
                      }
                  });
              }));
              return $$c;
          }.call(this));
          const _createPersistentChec = createPersistentCheckbox('ROpdebee_paste_front_only', 'Fetch front image only', evt => {
                  var _checked, _evt$currentTarget;
                  app.onlyFront = (_checked = (_evt$currentTarget = evt.currentTarget) === null || _evt$currentTarget === void 0 ? void 0 : _evt$currentTarget.checked) !== null && _checked !== void 0 ? _checked : false;
              }), _createPersistentChec2 = _slicedToArray(_createPersistentChec, 2), onlyFrontCheckbox = _createPersistentChec2[0], onlyFrontLabel = _createPersistentChec2[1];
          app.onlyFront = onlyFrontCheckbox.checked;
          const container = function () {
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
      addImportButton(onClickCallback, url, provider) {
          const _this2 = this;
          return _call(function () {
              return _await(provider.favicon, function (favicon) {
                  const button = function () {
                      var $$n = document.createElement('button');
                      $$n.setAttribute('type', 'button');
                      $$n.setAttribute('title', url);
                      $$n.addEventListener('click', evt => {
                          evt.preventDefault();
                          onClickCallback();
                      });
                      var $$o = document.createElement('img');
                      $$o.setAttribute('src', favicon);
                      $$o.setAttribute('alt', provider.name);
                      $$n.appendChild($$o);
                      var $$p = document.createElement('span');
                      $$n.appendChild($$p);
                      appendChildren($$p, 'Import from ' + provider.name);
                      return $$n;
                  }.call(this);
                  _classPrivateFieldGet(_this2, _orSpan).style.display = '';
                  _classPrivateFieldGet(_this2, _buttonContainer).insertAdjacentElement('beforeend', button);
              });
          });
      }
  }

  // userscript is executed, so $$IMU_EXPORT$$ should already exist now. However,
  // it does not exist in tests, and we can't straightforwardly inject this variable
  // without importing the module, thereby dereferencing it.

  function maxurl(url, options) {
    // In environments with GM.* APIs, the GM.getValue and GM.setValue functions
    // are asynchronous, leading to IMU defining its exports asynchronously too.
    // We can't await that, unfortunately. This is only really an issue when
    // processing seeding parameters, when user interaction is required, it'll
    // probably already be loaded.
    return retryTimes(() => {
      $$IMU_EXPORT$$(url, options);
    }, 100, 500); // Pretty large number of retries, but eventually it should work.
  }
  const options = {
    fill_object: true,
    exclude_videos: true,

    /* istanbul ignore next: Cannot test in unit tests, IMU unavailable */
    filter(url) {
      return !url.toLowerCase().endsWith('.webp') // Blocking webp images in Discogs
      && !/:format(webp)/.test(url.toLowerCase());
    }

  };
  const IMU_EXCEPTIONS = new DispatchMap();
  function getMaximisedCandidates(_x) {
    return _getMaximisedCandidates.apply(this, arguments);
  }

  function _getMaximisedCandidates() {
    _getMaximisedCandidates = _wrapAsyncGenerator( /*#__PURE__*/regenerator.mark(function _callee(smallurl) {
      var exceptionFn;
      return regenerator.wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
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
      }, _callee);
    }));
    return _getMaximisedCandidates.apply(this, arguments);
  }

  function maximiseGeneric(_x2) {
    return _maximiseGeneric.apply(this, arguments);
  } // Discogs


  function _maximiseGeneric() {
    _maximiseGeneric = _wrapAsyncGenerator( /*#__PURE__*/regenerator.mark(function _callee2(smallurl) {
      var results, i, current;
      return regenerator.wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _awaitAsyncGenerator(new Promise(resolve => {
              maxurl(smallurl.href, _objectSpread2(_objectSpread2({}, options), {}, {
                cb: resolve
              })).catch(err => {
                LOGGER.error('Could not maximise image, maxurl unavailable?', err); // Just return no maximised candidates and proceed as usual.

                // Just return no maximised candidates and proceed as usual.
                resolve([]);
              });
            }));

          case 2:
            results = _context2.sent;
            i = 0;

          case 4:
            if (!(i < results.length)) {
              _context2.next = 18;
              break;
            }

            current = results[i]; // Filter out results that will definitely not work

            if (!(current.fake || current.bad || current.likely_broken)) {
              _context2.next = 8;
              break;
            }

            return _context2.abrupt("continue", 15);

          case 8:
            _context2.prev = 8;
            _context2.next = 11;
            return _objectSpread2(_objectSpread2({}, current), {}, {
              url: new URL(current.url)
            });

          case 11:
            _context2.next = 15;
            break;

          case 13:
            _context2.prev = 13;
            _context2.t0 = _context2["catch"](8);

          case 15:
            i++;
            _context2.next = 4;
            break;

          case 18:
          case "end":
            return _context2.stop();
        }
      }, _callee2, null, [[8, 13]]);
    }));
    return _maximiseGeneric.apply(this, arguments);
  }

  IMU_EXCEPTIONS.set('img.discogs.com', _async(function (smallurl) {
    // Workaround for maxurl returning broken links and webp images
    return _await(DiscogsProvider.maximiseImage(smallurl), function (fullSizeURL) {
      return [{
        url: fullSizeURL,
        filename: urlBasename(fullSizeURL),
        headers: {}
      }];
    });
  })); // Apple Music

  IMU_EXCEPTIONS.set('*.mzstatic.com', _async(function (smallurl) {
    // For Apple Music, IMU always returns a PNG, regardless of whether the
    // original source image was PNG or JPEG. When the original image is a JPEG,
    // we want to fetch a JPEG version. Although the PNG is of slightly better
    // quality due to generational loss when a JPEG is re-encoded, the quality
    // loss is so minor that the additional costs of downloading, uploading,
    // and storing the PNG are unjustifiable. See #80.
    const results = [];
    var _iteratorAbruptCompletion = false;
    var _didIteratorError = false;

    var _iteratorError;

    return _continue(_finallyRethrows(function () {
      return _catch(function () {
        var _iterator = _asyncIterator(maximiseGeneric(smallurl)),
            _step;

        return _continueIgnored(_for(function () {
          return _await(_iterator.next(), function (_iterator$next) {
            return _iteratorAbruptCompletion = !(_step = _iterator$next).done;
          });
        }, function () {
          return !!(_iteratorAbruptCompletion = false);
        }, function () {
          const imgGeneric = _step.value;
          // Assume original file name is penultimate component of pathname, e.g.
          // https://is5-ssl.mzstatic.com/image/thumb/Music124/v4/58/34/98/58349857-55bb-62ae-81d4-4a2726e33528/5060786561909.png/999999999x0w-999.png
          // We're still conservative though, if it's not a JPEG, we won't
          // return the JPEG version
          const pathParts = imgGeneric.url.pathname.split('/');

          if (/\.jpe?g$/i.test(pathParts[pathParts.length - 2])) {
            results.push(_objectSpread2(_objectSpread2({}, imgGeneric), {}, {
              url: new URL(imgGeneric.url.href.replace(/\.png$/i, '.jpg'))
            }));
          } // Always return the original maximised URL as a backup


          results.push(imgGeneric);
        }));
      }, function (err) {
        _didIteratorError = true;
        _iteratorError = err;
      });
    }, function (_wasThrown, _result) {
      return _continue(_finallyRethrows(function () {
        return _invokeIgnored(function () {
          if (_iteratorAbruptCompletion && _iterator.return != null) {
            return _awaitIgnored(_iterator.return());
          }
        });
      }, function (_wasThrown2, _result2) {
        if (_didIteratorError) {
          throw _iteratorError;
        }

        return _rethrow(_wasThrown2, _result2);
      }), function (_result2) {
        return _rethrow(_wasThrown, _result);
      });
    }), function (_result) {
      return results;
    });
  })); // IMU has no definitions for 7digital yet, so adding an exception here as a workaround
  // Upstream issue: https://github.com/qsniyg/maxurl/issues/922

  IMU_EXCEPTIONS.set('artwork-cdn.7static.com', _async(function (smallurl) {
    // According to https://docs.7digital.com/reference#image-sizes, 800x800
    // and 500x500 aren't available on some images, so add 350 as well as a
    // backup.
    return ['800', '500', '350'].map(size => {
      return {
        url: new URL(smallurl.href.replace(/_\d+\.jpg$/, "_".concat(size, ".jpg"))),
        filename: '',
        headers: {}
      };
    });
  }));

  function getFilename(url) {
    return decodeURIComponent(urlBasename(url, 'image'));
  }

  var _doneImages = /*#__PURE__*/new WeakMap();

  var _lastId = /*#__PURE__*/new WeakMap();

  var _retainOnlyFront = /*#__PURE__*/new WeakSet();

  var _createUniqueFilename = /*#__PURE__*/new WeakSet();

  var _urlAlreadyAdded = /*#__PURE__*/new WeakSet();

  class ImageFetcher {
    // Monotonically increasing ID to uniquely identify the image. We use this
    // so we can later set the image type.
    constructor() {
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

    fetchImages(url, onlyFront) {
      const _this = this;

      return _call(function () {
        if (_classPrivateMethodGet(_this, _urlAlreadyAdded, _urlAlreadyAdded2).call(_this, url)) {
          LOGGER.warn("".concat(getFilename(url), " has already been added"));
          return _await({
            images: []
          });
        }

        const provider = getProvider(url);
        return provider ? _await(_this.fetchImagesFromProvider(url, provider, onlyFront)) : _await(_this.fetchImageFromURL(url), function (result) {
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

      var _iterator, _step;

      let skipMaximisation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      return _call(function () {
        let _exit = false;
        // Attempt to maximise the image
        let fetchResult = null;
        return _await(_invoke(function () {
          if (!skipMaximisation) {
            var _iteratorAbruptCompletion = false;
            var _didIteratorError = false;

            var _iteratorError;

            return _finallyRethrows(function () {
              return _catch(function () {
                let _interrupt = false;
                _iterator = _asyncIterator(getMaximisedCandidates(url));
                return _for(function () {
                  return _await(!(_interrupt || _exit) && _iterator.next(), function (_iterator$next) {
                    return !(_interrupt || _exit) && !!(_iteratorAbruptCompletion = !(_step = _iterator$next).done);
                  }, !!(_interrupt || _exit));
                }, function () {
                  return !!(_iteratorAbruptCompletion = false);
                }, function () {
                  const maxCandidate = _step.value;
                  const candidateName = maxCandidate.filename || getFilename(maxCandidate.url);

                  if (_classPrivateMethodGet(_this2, _urlAlreadyAdded, _urlAlreadyAdded2).call(_this2, maxCandidate.url)) {
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
                });
              }, function (err) {
                _didIteratorError = true;
                _iteratorError = err;
              });
            }, function (_wasThrown, _result2) {
              let _exit2 = false;
              return _continue(_finallyRethrows(function () {
                return _invokeIgnored(function () {
                  if (_iteratorAbruptCompletion && _iterator.return != null) {
                    return _awaitIgnored(_iterator.return());
                  }
                });
              }, function (_wasThrown2, _result3) {
                if (_didIteratorError) {
                  throw _iteratorError;
                }

                return _rethrow(_wasThrown2, _result3);
              }), function (_result3) {
                return _exit2 ? _result3 : _rethrow(_wasThrown, _result2);
              });
            });
          }
        }, function (_result4) {
          return _exit ? _result4 : _invoke(function () {
            if (!fetchResult) {
              // Might throw, caller needs to catch
              return _await(_this2.fetchImageContents(url, getFilename(url), {}), function (_this2$fetchImageCont2) {
                fetchResult = _this2$fetchImageCont2;
              });
            }
          }, function () {
            _classPrivateFieldGet(_this2, _doneImages).add(fetchResult.fetchedUrl.href);

            _classPrivateFieldGet(_this2, _doneImages).add(fetchResult.requestedUrl.href);

            _classPrivateFieldGet(_this2, _doneImages).add(url.href);

            return {
              content: fetchResult.file,
              originalUrl: url,
              maximisedUrl: fetchResult.requestedUrl,
              fetchedUrl: fetchResult.fetchedUrl,
              wasMaximised: url.href !== fetchResult.requestedUrl.href,
              wasRedirected: fetchResult.wasRedirected // We have no idea what the type or comment will be, so leave them
              // undefined so that a default, if any, can be inserted.

            };
          });
        })); // If we couldn't fetch any maximised images, try the original URL
      });
    }

    fetchImagesFromProvider(url, provider, onlyFront) {
      const _this3 = this;

      return _call(function () {
        LOGGER.info("Searching for images in ".concat(provider.name, " release\u2026")); // This could throw, assuming caller will catch.

        return _await(provider.findImages(url, onlyFront), function (images) {
          const finalImages = onlyFront ? _classPrivateMethodGet(_this3, _retainOnlyFront, _retainOnlyFront2).call(_this3, images) : images;
          const hasMoreImages = onlyFront && images.length !== finalImages.length;
          LOGGER.info("Found ".concat(finalImages.length || 'no', " images in ").concat(provider.name, " release"));
          const fetchResults = [];
          return _continue(_forOf(finalImages, function (img) {
            if (_classPrivateMethodGet(_this3, _urlAlreadyAdded, _urlAlreadyAdded2).call(_this3, img.url)) {
              LOGGER.warn("".concat(getFilename(img.url), " has already been added"));
              return;
            }

            return _continueIgnored(_catch(function () {
              return _await(_this3.fetchImageFromURL(img.url, img.skipMaximisation), function (result) {
                // Maximised image already added
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
            const fetchedImages = provider.postprocessImages(fetchResults);

            if (!hasMoreImages) {
              // Don't mark the whole provider URL as done if we haven't grabbed
              // all images.
              _classPrivateFieldGet(_this3, _doneImages).add(url.href);
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

          const rawFile = new File([resp.response], fileName);
          return _await(new Promise((resolve, reject) => {
            // Adapted from https://github.com/metabrainz/musicbrainz-server/blob/2b00b844f3fe4293fc4ccb9de1c30e3c2ddc95c1/root/static/scripts/edit/MB/CoverArt.js#L139
            // We can't use MB.CoverArt.validate_file since it's not available
            // in Greasemonkey unless we use unsafeWindow. However, if we use
            // unsafeWindow, we get permission errors (probably because we're
            // sending our functions into another context).
            const reader = new FileReader(); // istanbul ignore next: Copied from MB.

            reader.addEventListener('load', () => {
              const Uint32Array = getFromPageContext('Uint32Array');
              const uint32view = new Uint32Array(reader.result);

              if ((uint32view[0] & 0x00FFFFFF) === 0x00FFD8FF) {
                resolve('image/jpeg');
              } else if (uint32view[0] === 0x38464947) {
                resolve('image/gif');
              } else if (uint32view[0] === 0x474E5089) {
                resolve('image/png');
              } else if (uint32view[0] === 0x46445025) {
                resolve('application/pdf');
              } else {
                var _resp$responseHeaders;

                const actualMimeType = (_resp$responseHeaders = resp.responseHeaders.match(/content-type:\s*([^;\s]+)/i)) === null || _resp$responseHeaders === void 0 ? void 0 : _resp$responseHeaders[1];

                if (actualMimeType !== null && actualMimeType !== void 0 && actualMimeType.startsWith('text/')) {
                  reject(new Error('Expected to receive an image, but received text. Perhaps this provider is not supported yet?'));
                } else {
                  reject(new Error("Expected \"".concat(fileName, "\" to be an image, but received ").concat(actualMimeType !== null && actualMimeType !== void 0 ? actualMimeType : 'unknown file type', ".")));
                }
              }
            });
            reader.readAsArrayBuffer(rawFile.slice(0, 4));
          }), function (mimeType) {
            return {
              requestedUrl: url,
              fetchedUrl,
              wasRedirected,
              file: new File([resp.response], _classPrivateMethodGet(_this4, _createUniqueFilename, _createUniqueFilename2).call(_this4, fileName, mimeType), {
                type: mimeType
              })
            };
          });
        });
      });
    }

  }

  function _retainOnlyFront2(images) {
    // Return only the front images. If no image with Front type is found
    // in the array, assume the first image is the front one. If there are
    // multiple front images, return them all (e.g. Bandcamp original and
    // square crop).
    const filtered = images.filter(img => {
      var _img$types;

      return (_img$types = img.types) === null || _img$types === void 0 ? void 0 : _img$types.includes(ArtworkTypeIDs.Front);
    });
    return filtered.length ? filtered : images.slice(0, 1);
  }

  function _createUniqueFilename2(filename, mimeType) {
    var _this$lastId;

    const filenameWithoutExt = filename.replace(/\.(?:png|jpe?g|gif|pdf)$/i, '');
    return "".concat(filenameWithoutExt, ".").concat((_classPrivateFieldSet(this, _lastId, (_this$lastId = +_classPrivateFieldGet(this, _lastId)) + 1), _this$lastId), ".").concat(mimeType.split('/')[1]);
  }

  function _urlAlreadyAdded2(url) {
    return _classPrivateFieldGet(this, _doneImages).has(url.href);
  }

  const enqueueImage = _async(function (image, defaultTypes, defaultComment) {
    var _image$types, _image$comment;

    dropImage(image.content);
    return _awaitIgnored(retryTimes(setImageParameters.bind(null, image.content.name, // Only use the defaults if the specific one is undefined
    (_image$types = image.types) !== null && _image$types !== void 0 ? _image$types : defaultTypes, ((_image$comment = image.comment) !== null && _image$comment !== void 0 ? _image$comment : defaultComment).trim()), 5, 500));
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
    // Fake event to trigger the drop event on the drag'n'drop element
    // Using jQuery because native JS cannot manually trigger such events
    // for security reasons.
    const $ = getFromPageContext('$');
    const dropEvent = $.Event('drop'); // We need to clone the underlying data since we might be running as a
    // content script, meaning that even though we trigger the event through
    // unsafeWindow, the page context may not be able to access the event's
    // properties.

    dropEvent.originalEvent = cloneIntoPageContext({
      dataTransfer: {
        files: [imageData]
      }
    }); // Note that we're using MB's own jQuery here, not a script-local one.
    // We need to reuse MB's own jQuery to be able to trigger the event
    // handler.

    $('#drop-zone').trigger(dropEvent);
  }

  function setImageParameters(imageName, imageTypes, imageComment) {
    // Find the row for this added image. We can't be 100% sure it's the last
    // added image, since another image may have been added in the meantime
    // as we're called asynchronously. We find the correct image via the file
    // name, which is guaranteed to be unique since we embed a unique ID into it.
    const pendingUploadRows = qsa('tbody[data-bind="foreach: files_to_upload"] > tr');
    const fileRow = pendingUploadRows.find(row => qs('.file-info span[data-bind="text: name"]', row).textContent == imageName);
    assertDefined(fileRow, "Could not find image ".concat(imageName, " in queued uploads")); // Set image types

    const checkboxesToCheck = qsa('ul.cover-art-type-checkboxes input[type="checkbox"]', fileRow).filter(cbox => imageTypes.includes(parseInt(cbox.value)));
    checkboxesToCheck.forEach(cbox => {
      cbox.checked = true;
      cbox.dispatchEvent(new Event('click'));
    }); // Set comment if we should

    if (imageComment) {
      const commentInput = qs('div.comment > input.comment', fileRow);
      commentInput.value = imageComment;
      commentInput.dispatchEvent(new Event('change'));
    }
  }

  function fillEditNote(allFetchedImages, origin, editNote) {
    const totalNumImages = allFetchedImages.reduce((acc, fetched) => acc + fetched.images.length, 0); // Nothing enqueued => Skip edit note altogether

    if (!totalNumImages) return; // Limiting to 3 URLs to reduce noise

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

  const _processURL2 = _async(function (url) {
    let _exit2 = false;

    const _this4 = this;

    // eslint-disable-next-line init-declarations
    let fetchResult;
    return _continue(_catch(function () {
      return _await(_classPrivateFieldGet(_this4, _fetcher).fetchImages(url, _this4.onlyFront), function (_classPrivateFieldGet3) {
        fetchResult = _classPrivateFieldGet3;
      });
    }, function (err) {
      LOGGER.error('Failed to grab images', err);
      _exit2 = true;
    }), function (_result3) {
      let _exit3 = false;
      if (_exit2) return _result3;
      return _continue(_catch(function () {
        return _awaitIgnored(enqueueImages(fetchResult));
      }, function (err) {
        LOGGER.error('Failed to enqueue images', err);
        _exit3 = true;
      }), function (_result4) {
        if (_exit3) return _result4;
        fillEditNote([fetchResult], '', _classPrivateFieldGet(_this4, _note));

        if (fetchResult.images.length) {
          LOGGER.success("Successfully added ".concat(fetchResult.images.length, " image(s)"));
        }
      });
    });
  });

  var _note = /*#__PURE__*/new WeakMap();

  var _fetcher = /*#__PURE__*/new WeakMap();

  var _ui = /*#__PURE__*/new WeakMap();

  var _urlsInProgress = /*#__PURE__*/new WeakMap();

  var _processURL = /*#__PURE__*/new WeakSet();

  class App {
    constructor() {
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

      const banner = new StatusBanner();
      LOGGER.addSink(banner);

      _classPrivateFieldSet(this, _ui, new InputForm(banner.htmlElement, this));
    }

    processURL(url) {
      const _this = this;

      return _call(function () {
        return _classPrivateFieldGet(_this, _urlsInProgress).has(url.href) ? _await() : _await(_continueIgnored(_finallyRethrows(function () {
          _classPrivateFieldGet(_this, _urlsInProgress).add(url.href);

          return _awaitIgnored(_classPrivateMethodGet(_this, _processURL, _processURL2).call(_this, url));
        }, function (_wasThrown, _result) {
          _classPrivateFieldGet(_this, _urlsInProgress).delete(url.href);

          return _rethrow(_wasThrown, _result);
        })));
      });
    }

    processSeedingParameters() {
      const _this2 = this;

      return _call(function () {
        let _exit = false;
        const params = SeedParameters.decode(new URLSearchParams(document.location.search)); // Although this is very similar to `processURL`, we may have to fetch
        // and enqueue multiple images. We want to fetch images in parallel, but
        // enqueue them sequentially to ensure the order stays consistent.
        // eslint-disable-next-line init-declarations

        let fetchResults;
        return _await(_continue(_catch(function () {
          return _await(Promise.all(params.images.map(_async(function (cover) {
            return _await(_classPrivateFieldGet(_this2, _fetcher).fetchImages(cover.url, _this2.onlyFront), function (_classPrivateFieldGet2) {
              return [_classPrivateFieldGet2, cover];
            });
          }))), function (_Promise$all) {
            fetchResults = _Promise$all;
          });
        }, function (err) {
          LOGGER.error('Failed to grab images', err);
          _exit = true;
        }), function (_result2) {
          return _exit ? _result2 : _continue(_forOf(fetchResults, function (_ref) {
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

            fillEditNote(fetchResults.map(pair => pair[0]), (_params$origin = params.origin) !== null && _params$origin !== void 0 ? _params$origin : '', _classPrivateFieldGet(_this2, _note));
            const totalNumImages = fetchResults.reduce((acc, pair) => acc + pair[0].images.length, 0);

            if (totalNumImages) {
              LOGGER.success("Successfully added ".concat(totalNumImages, " image(s)"));
            }
          });
        })); // Not using Promise.all to ensure images get added in order.
      });
    }

    addImportButtons() {
      const _this3 = this;

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
          supportedURLs.forEach(url => {
            const provider = getProvider(url);
            assertHasValue(provider);

            _classPrivateFieldGet(_this3, _ui).addImportButton(_this3.processURL.bind(_this3, url), url.href, provider);
          });
        });
      });
    }

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
    const app = new App();
    app.processSeedingParameters();
    app.addImportButtons();
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
