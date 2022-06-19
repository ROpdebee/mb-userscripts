// ==UserScript==
// @name         MB: Guess language and script
// @description  Guess language and script from release tracklist
// @version      2022.6.19
// @author       ROpdebee
// @license      MIT; https://opensource.org/licenses/MIT
// @namespace    https://github.com/ROpdebee/mb-userscripts
// @homepageURL  https://github.com/ROpdebee/mb-userscripts
// @supportURL   https://github.com/ROpdebee/mb-userscripts/issues
// @downloadURL  https://raw.github.com/ROpdebee/mb-userscripts/dist/mb_guess_language.user.js
// @updateURL    https://raw.github.com/ROpdebee/mb-userscripts/dist/mb_guess_language.meta.js
// @match        *://*.musicbrainz.org/release/*/add
// @match        *://*.musicbrainz.org/release/*/add?*
// @match        *://*.musicbrainz.org/release/*/edit
// @match        *://*.musicbrainz.org/release/*/edit?*
// @run-at       document-end
// @grant        none
// ==/UserScript==

// For original source code, see https://github.com/ROpdebee/mb-userscripts/tree/main/src/mb_guess_language
(function () {
  'use strict';

  /* minified: babel helpers, nativejsx, babel-plugin-transform-async-to-promises, p-throttle */
  var appendChildren=function(t,e){(e=Array.isArray(e)?e:[e]).forEach((function(e){e instanceof HTMLElement?t.appendChild(e):(e||"string"==typeof e)&&t.appendChild(document.createTextNode(e.toString()));}));},setStyles=function(t,e){for(const r in e)t.style[r]=e[r];};const _Pact=function(){function t(){}return t.prototype.then=function(e,r){const n=new t,o=this.s;if(o){const t=1&o?e:r;if(t){try{_settle(n,1,t(this.v));}catch(i){_settle(n,2,i);}return n}return this}return this.o=function(t){try{const o=t.v;1&t.s?_settle(n,1,e?e(o):o):r?_settle(n,1,r(o)):_settle(n,2,o);}catch(i){_settle(n,2,i);}},n},t}();function _settle(t,e,r){if(!t.s){if(r instanceof _Pact){if(!r.s)return void(r.o=_settle.bind(null,t,e));1&e&&(e=r.s),r=r.v;}if(r&&r.then)return void r.then(_settle.bind(null,t,e),_settle.bind(null,t,2));t.s=e,t.v=r;const n=t.o;n&&n(t);}}function _isSettledPact(t){return t instanceof _Pact&&1&t.s}function _async(t){return function(){for(var e=[],r=0;r<arguments.length;r++)e[r]=arguments[r];try{return Promise.resolve(t.apply(this,e))}catch(n){return Promise.reject(n)}}}function _await(t,e,r){return r?e?e(t):t:(t&&t.then||(t=Promise.resolve(t)),e?t.then(e):t)}function _awaitIgnored(t,e){if(!e)return t&&t.then?t.then(_empty):Promise.resolve()}function _continue(t,e){return t&&t.then?t.then(e):e(t)}function _forTo(t,e,r){var n,o,i=-1;return function a(l){try{for(;++i<t.length&&(!r||!r());)if((l=e(i))&&l.then){if(!_isSettledPact(l))return void l.then(a,o||(o=_settle.bind(null,n=new _Pact,2)));l=l.v;}n?_settle(n,1,l):n=l;}catch(u){_settle(n||(n=new _Pact),2,u);}}(),n}const _iteratorSymbol="undefined"!=typeof Symbol?Symbol.iterator||(Symbol.iterator=Symbol("Symbol.iterator")):"@@iterator";function _forOf(t,e,r){if("function"==typeof t[_iteratorSymbol]){var n,o,i,a=t[_iteratorSymbol]();if(function t(l){try{for(;!((n=a.next()).done||r&&r());)if((l=e(n.value))&&l.then){if(!_isSettledPact(l))return void l.then(t,i||(i=_settle.bind(null,o=new _Pact,2)));l=l.v;}o?_settle(o,1,l):o=l;}catch(u){_settle(o||(o=new _Pact),2,u);}}(),a.return){var l=function(t){try{n.done||a.return();}catch(e){}return t};if(o&&o.then)return o.then(l,(function(t){throw l(t)}));l();}return o}if(!("length"in t))throw new TypeError("Object is not iterable");for(var u=[],c=0;c<t.length;c++)u.push(t[c]);return _forTo(u,(function(t){return e(u[t])}),r)}const _asyncIteratorSymbol="undefined"!=typeof Symbol?Symbol.asyncIterator||(Symbol.asyncIterator=Symbol("Symbol.asyncIterator")):"@@asyncIterator";function _call(t,e,r){if(r)return e?e(t()):t();try{var n=Promise.resolve(t());return e?n.then(e):n}catch(o){return Promise.reject(o)}}function _catch(t,e){try{var r=t();}catch(n){return e(n)}return r&&r.then?r.then(void 0,e):r}function _empty(){}const _earlyReturn={};function ownKeys(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n);}return r}function _objectSpread2(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?ownKeys(Object(r),!0).forEach((function(e){_defineProperty(t,e,r[e]);})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):ownKeys(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e));}));}return t}function _defineProperty(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function _slicedToArray(t,e){return _arrayWithHoles(t)||_iterableToArrayLimit(t,e)||_unsupportedIterableToArray(t,e)||_nonIterableRest()}function _arrayWithHoles(t){if(Array.isArray(t))return t}function _iterableToArrayLimit(t,e){var r=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=r){var n,o,i=[],a=!0,l=!1;try{for(r=r.call(t);!(a=(n=r.next()).done)&&(i.push(n.value),!e||i.length!==e);a=!0);}catch(u){l=!0,o=u;}finally{try{a||null==r.return||r.return();}finally{if(l)throw o}}return i}}function _unsupportedIterableToArray(t,e){if(t){if("string"==typeof t)return _arrayLikeToArray(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);return "Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?_arrayLikeToArray(t,e):void 0}}function _arrayLikeToArray(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _createForOfIteratorHelper(t,e){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!r){if(Array.isArray(t)||(r=_unsupportedIterableToArray(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,o=function(){};return {s:o,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,a=!0,l=!1;return {s:function(){r=r.call(t);},n:function(){var t=r.next();return a=t.done,t},e:function(t){l=!0,i=t;},f:function(){try{a||null==r.return||r.return();}finally{if(l)throw i}}}}!function(){function t(t){this._entry=t,this._pact=null,this._resolve=null,this._return=null,this._promise=null;}function e(t){return {value:t,done:!0}}function r(t){return {value:t,done:!1}}t.prototype._yield=function(t){return this._resolve(t&&t.then?t.then(r):r(t)),this._pact=new _Pact},t.prototype.next=function(t){const r=this;return r._promise=new Promise((function(n){const o=r._pact;if(null===o){const l=r._entry;if(null===l)return n(r._promise);function i(t){r._resolve(t&&t.then?t.then(e):e(t)),r._pact=null,r._resolve=null;}r._entry=null,r._resolve=n;var a=l(r);a&&a.then?a.then(i,(function(t){if(t===_earlyReturn)i(r._return);else {const e=new _Pact;r._resolve(e),r._pact=null,r._resolve=null,_resolve(e,2,t);}})):i(a);}else r._pact=null,r._resolve=n,_settle(o,1,t);}))},t.prototype.return=function(t){const r=this;return r._promise=new Promise((function(n){const o=r._pact;if(null===o)return null===r._entry?n(r._promise):(r._entry=null,n(t&&t.then?t.then(e):e(t)));r._return=t,r._resolve=n,r._pact=null,_settle(o,2,_earlyReturn);}))},t.prototype.throw=function(t){const e=this;return e._promise=new Promise((function(r,n){const o=e._pact;if(null===o)return null===e._entry?r(e._promise):(e._entry=null,n(t));e._resolve=r,e._pact=null,_settle(o,2,t);}))},t.prototype[_asyncIteratorSymbol]=function(){return this};}();class AbortError extends Error{constructor(){super("Throttled function aborted"),this.name="AbortError";}}function pThrottle(t){let e=t.limit,r=t.interval,n=t.strict;if(!Number.isFinite(e))throw new TypeError("Expected `limit` to be a finite number");if(!Number.isFinite(r))throw new TypeError("Expected `interval` to be a finite number");const o=new Map;let i=0,a=0;const l=[],u=n?function(){const t=Date.now();if(l.length<e)return l.push(t),0;const n=l.shift()+r;return t>=n?(l.push(t),0):(l.push(n),n-t)}:function(){const t=Date.now();return t-i>r?(a=1,i=t,0):(a<e?a++:(i+=r,a=1),i-t)};return t=>{const e=function e(){const r=this;for(var n=arguments.length,i=new Array(n),a=0;a<n;a++)i[a]=arguments[a];if(!e.isEnabled)return _async((function(){return t.apply(r,i)}))();let l;return new Promise(((e,r)=>{l=setTimeout((()=>{e(t.apply(this,i)),o.delete(l);}),u()),o.set(l,r);}))};return e.abort=()=>{var t,e=_createForOfIteratorHelper(o.keys());try{for(e.s();!(t=e.n()).done;){const e=t.value;clearTimeout(e),o.get(e)(new AbortError);}}catch(r){e.e(r);}finally{e.f();}o.clear(),l.splice(0,l.length);},e.isEnabled=!0,e}}

  /* minified: lib */
  class ConsoleSink{constructor(e){_defineProperty(this,"scriptName",void 0),_defineProperty(this,"onSuccess",this.onInfo.bind(this)),this.scriptName=e;}formatMessage(e){return "[".concat(this.scriptName,"] ").concat(e)}onDebug(e){console.debug(this.formatMessage(e));}onLog(e){console.log(this.formatMessage(e));}onInfo(e){console.info(this.formatMessage(e));}onWarn(e,t){e=this.formatMessage(e),t?console.warn(e,t):console.warn(e);}onError(e,t){e=this.formatMessage(e),t?console.error(e,t):console.error(e);}}let LogLevel;!function(e){e[e.DEBUG=0]="DEBUG",e[e.LOG=1]="LOG",e[e.INFO=2]="INFO",e[e.SUCCESS=3]="SUCCESS",e[e.WARNING=4]="WARNING",e[e.ERROR=5]="ERROR";}(LogLevel||(LogLevel={}));const HANDLER_NAMES={[LogLevel.DEBUG]:"onDebug",[LogLevel.LOG]:"onLog",[LogLevel.INFO]:"onInfo",[LogLevel.SUCCESS]:"onSuccess",[LogLevel.WARNING]:"onWarn",[LogLevel.ERROR]:"onError"},DEFAULT_OPTIONS={logLevel:LogLevel.INFO,sinks:[]};class Logger{constructor(e){_defineProperty(this,"_configuration",void 0),this._configuration=_objectSpread2(_objectSpread2({},DEFAULT_OPTIONS),e);}fireHandlers(e,t,n){e<this._configuration.logLevel||this._configuration.sinks.forEach((r=>{const o=r[HANDLER_NAMES[e]];o&&(n?o.call(r,t,n):o.call(r,t));}));}debug(e){this.fireHandlers(LogLevel.DEBUG,e);}log(e){this.fireHandlers(LogLevel.LOG,e);}info(e){this.fireHandlers(LogLevel.INFO,e);}success(e){this.fireHandlers(LogLevel.SUCCESS,e);}warn(e,t){this.fireHandlers(LogLevel.WARNING,e,t);}error(e,t){this.fireHandlers(LogLevel.ERROR,e,t);}configure(e){Object.assign(this._configuration,e);}get configuration(){return this._configuration}addSink(e){this._configuration.sinks.push(e);}}const LOGGER=new Logger;class AssertionError extends Error{}function assert(e,t){if(!e)throw new AssertionError(null!=t?t:"Assertion failed")}function assertDefined(e,t){assert(void 0!==e,null!=t?t:"Assertion failed: Expected value to be defined");}function assertNonNull(e,t){assert(null!==e,null!=t?t:"Assertion failed: Expected value to be non-null");}function asyncSleep(e){return new Promise((t=>setTimeout(t,e)))}function retryTimes(e,t,n){const r=_async((function(t){return _catch(e,(function(e){if(t<=1)throw e;return asyncSleep(n).then((()=>r(t-1)))}))}));return t<=0?Promise.reject(new TypeError("Invalid number of retry times: ".concat(t))):r(t)}function logFailure(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"An error occurred";e.catch((e=>{LOGGER.error(t,e);}));}function qs(e,t){const n=qsMaybe(e,t);return assertNonNull(n,"Could not find required element"),n}function qsMaybe(e,t){return (null!=t?t:document).querySelector(e)}function onDocumentLoaded(e){"loading"!==document.readyState?e():document.addEventListener("DOMContentLoaded",e);}function formatPercentage(e){return "".concat((100*e).toFixed(2),"%")}var USERSCRIPT_ID="mb_guess_language";function insertStylesheet(e,t){if(void 0===t&&(t="ROpdebee_".concat(USERSCRIPT_ID,"_css")),null!==qsMaybe("style#".concat(t)))return;const n=function(){var n=document.createElement("style");return n.setAttribute("id",t),appendChildren(n,e),n}.call(this);document.head.insertAdjacentElement("beforeend",n);}function parseVersion(e){return e.split(".").map((e=>parseInt(e)))}function versionLessThan(e,t){let n=0;for(;n<e.length&&n<t.length;){if(e[n]<t[n])return !0;if(e[n]>t[n])return !1;n++;}return e.length<t.length}var CHANGELOG_URL="https://github.com/ROpdebee/mb-userscripts/blob/dist/mb_guess_language.changelog.md",USERSCRIPT_FEATURE_HISTORY=[{versionAdded:"2022.6.19",description:"script to guess language and script from tracklist"}],css_248z=".ROpdebee_feature_list{font-weight:300;margin:0 auto;width:-moz-fit-content;width:fit-content}.ROpdebee_feature_list ul{margin:6px 28px 0 0;text-align:left}";const LAST_DISPLAYED_KEY="ROpdebee_".concat(USERSCRIPT_ID,"_last_notified_update");function maybeDisplayNewFeatures(){const e=localStorage.getItem(LAST_DISPLAYED_KEY),t=GM.info.script;if(!e)return void localStorage.setItem(LAST_DISPLAYED_KEY,t.version);const n=parseVersion(e),r=USERSCRIPT_FEATURE_HISTORY.filter((e=>versionLessThan(n,parseVersion(e.versionAdded))));0!==r.length&&showFeatureNotification(t.name,t.version,r.map((e=>e.description)));}function showFeatureNotification(e,t,n){insertStylesheet(css_248z,"ROpdebee_Update_Banner");const r=function(){var o=document.createElement("div");o.setAttribute("class","banner warning-header");var s=document.createElement("p");o.appendChild(s),appendChildren(s,"".concat(e," was updated to v").concat(t,"! "));var a=document.createElement("a");a.setAttribute("href",CHANGELOG_URL),s.appendChild(a);var i=document.createTextNode("See full changelog here");a.appendChild(i),appendChildren(s,". New features since last update:");var c=document.createElement("div");c.setAttribute("class","ROpdebee_feature_list"),o.appendChild(c);var l=document.createElement("ul");c.appendChild(l),appendChildren(l,n.map((e=>function(){var t=document.createElement("li");return appendChildren(t,e),t}.call(this))));var d=document.createElement("button");return d.setAttribute("class","dismiss-banner remove-item icon"),d.setAttribute("data-banner-name","alert"),d.setAttribute("type","button"),d.addEventListener("click",(()=>{r.remove(),localStorage.setItem(LAST_DISPLAYED_KEY,GM.info.script.version);})),o.appendChild(d),o}.call(this);qs("#page").insertAdjacentElement("beforebegin",r);}

  const doRequest = _async(function (apiBase, text) {
    return _await(fetch("".concat(apiBase, "/detect"), {
      method: 'post',
      headers: {
        accept: 'application/json'
      },
      body: new URLSearchParams({
        q: text
      })
    }), function (resp) {
      return _await(resp.json(), function (_resp$json) {
        const respContent = _resp$json;

        if ('error' in respContent) {
          throw new Error(respContent.error);
        }

        return respContent;
      });
    });
  });

  const detectLanguage = _async(function (text) {
    let _exit = false;
    let confidenceThreshold = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.75;
    return _continue(_forOf(API_BASES, function (apiBase) {
      return _catch(function () {
        return _await(doRequest(apiBase, text), function (result) {
          const reliableResult = result.find(res => res.confidence / 100 >= confidenceThreshold);

          if (reliableResult) {
            LOGGER.info("Identified as ".concat(reliableResult.language, " with confidence ").concat(reliableResult.confidence, "%"));
            const _LANGUAGE_MAPPINGS$re = LANGUAGE_MAPPINGS[reliableResult.language];
            _exit = true;
            return _LANGUAGE_MAPPINGS$re;
          }

          LOGGER.debug(JSON.stringify(result));
        });
      }, function (err) {
        LOGGER.error("Failed to detect language of text using ".concat(apiBase), err);
      });
    }, function () {
      return _exit;
    }), function (_result2) {
      if (_exit) return _result2;
      throw new Error('Could not detect language reliably');
    });
  });
  const LANGUAGE_MAPPINGS = {
    en: 'English',
    ar: 'Arabic',
    az: 'Azerbaijani',
    zh: 'Chinese',
    cs: 'Czech',
    da: 'Danish',
    nl: 'Dutch',
    eo: 'Esperanto',
    fi: 'Finnish',
    fr: 'French',
    de: 'German',
    el: 'Greek',
    he: 'Hebrew',
    hi: 'Hindi',
    hu: 'Hungarian',
    id: 'Indonesian',
    ga: 'Irish',
    it: 'Italian',
    ja: 'Japanese',
    ko: 'Korean',
    fa: 'Persian',
    pl: 'Polish',
    pt: 'Portuguese',
    ru: 'Russian',
    sk: 'Slovak',
    es: 'Spanish',
    sv: 'Swedish',
    tr: 'Turkish',
    uk: 'Ukrainian',
    vi: 'Vietnamese'
  };
  const API_BASES = ['https://translate.argosopentech.com', 'https://libretranslate.de'];

  const REGEXES = {
    Arabic: /(?:[\u0600-\u0604\u0606-\u060B\u060D-\u061A\u061C-\u061E\u0620-\u063F\u0641-\u064A\u0656-\u066F\u0671-\u06DC\u06DE-\u06FF\u0750-\u077F\u0870-\u088E\u0890\u0891\u0898-\u08E1\u08E3-\u08FF\uFB50-\uFBC2\uFBD3-\uFD3D\uFD40-\uFD8F\uFD92-\uFDC7\uFDCF\uFDF0-\uFDFF\uFE70-\uFE74\uFE76-\uFEFC]|\uD803[\uDE60-\uDE7E]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB\uDEF0\uDEF1])/,
    Cyrillic: /[\u0400-\u0484\u0487-\u052F\u1C80-\u1C88\u1D2B\u1D78\u2DE0-\u2DFF\uA640-\uA69F\uFE2E\uFE2F]/,
    Greek: /(?:[\u0370-\u0373\u0375-\u0377\u037A-\u037D\u037F\u0384\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03E1\u03F0-\u03FF\u1D26-\u1D2A\u1D5D-\u1D61\u1D66-\u1D6A\u1DBF\u1F00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FC4\u1FC6-\u1FD3\u1FD6-\u1FDB\u1FDD-\u1FEF\u1FF2-\u1FF4\u1FF6-\u1FFE\u2126\uAB65]|\uD800[\uDD40-\uDD8E\uDDA0]|\uD834[\uDE00-\uDE45])/,
    Han: /(?:[\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u3005\u3007\u3021-\u3029\u3038-\u303B\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFA6D\uFA70-\uFAD9]|\uD81B[\uDFE2\uDFE3\uDFF0\uDFF1]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879\uD880-\uD883][\uDC00-\uDFFF]|\uD869[\uDC00-\uDEDF\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF38\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uD884[\uDC00-\uDF4A])/,
    Hebrew: /[\u0591-\u05C7\u05D0-\u05EA\u05EF-\u05F4\uFB1D-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFB4F]/,
    Japanese: /(?:[\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u3005\u3007\u3021-\u3029\u3038-\u303B\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FD-\u30FF\u31F0-\u31FF\u32D0-\u32FE\u3300-\u3357\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFA6D\uFA70-\uFAD9\uFF66-\uFF6F\uFF71-\uFF9D]|\uD81B[\uDFE2\uDFE3\uDFF0\uDFF1]|\uD82B[\uDFF0-\uDFF3\uDFF5-\uDFFB\uDFFD\uDFFE]|\uD82C[\uDC00-\uDD22\uDD50-\uDD52\uDD64-\uDD67]|\uD83C\uDE00|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879\uD880-\uD883][\uDC00-\uDFFF]|\uD869[\uDC00-\uDEDF\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF38\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uD884[\uDC00-\uDF4A])/,
    Korean: /(?:[\u1100-\u11FF\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u3005\u3007\u3021-\u3029\u302E\u302F\u3038-\u303B\u3131-\u318E\u3200-\u321E\u3260-\u327E\u3400-\u4DBF\u4E00-\u9FFF\uA960-\uA97C\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFFA0-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD81B[\uDFE2\uDFE3\uDFF0\uDFF1]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879\uD880-\uD883][\uDC00-\uDFFF]|\uD869[\uDC00-\uDEDF\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF38\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uD884[\uDC00-\uDF4A])/,
    Thai: /[\u0E01-\u0E3A\u0E40-\u0E5B]/,
    Latin: /(?:[A-Za-z\xAA\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02B8\u02E0-\u02E4\u1D00-\u1D25\u1D2C-\u1D5C\u1D62-\u1D65\u1D6B-\u1D77\u1D79-\u1DBE\u1E00-\u1EFF\u2071\u207F\u2090-\u209C\u212A\u212B\u2132\u214E\u2160-\u2188\u2C60-\u2C7F\uA722-\uA787\uA78B-\uA7CA\uA7D0\uA7D1\uA7D3\uA7D5-\uA7D9\uA7F2-\uA7FF\uAB30-\uAB5A\uAB5C-\uAB64\uAB66-\uAB69\uFB00-\uFB06\uFF21-\uFF3A\uFF41-\uFF5A]|\uD801[\uDF80-\uDF85\uDF87-\uDFB0\uDFB2-\uDFBA]|\uD837[\uDF00-\uDF1E])/
  };

  function countMatchingCharacters(text, regexp) {
    var _text$match$length, _text$match;

    return (_text$match$length = (_text$match = text.match(new RegExp(regexp, 'g'))) === null || _text$match === void 0 ? void 0 : _text$match.length) !== null && _text$match$length !== void 0 ? _text$match$length : 0;
  }

  function selectBestMatch(scriptToCount) {
    const counts = [...scriptToCount.entries()].sort((_ref, _ref2) => {
      let _ref3 = _slicedToArray(_ref, 2),
          c1 = _ref3[1];

      let _ref4 = _slicedToArray(_ref2, 2),
          c2 = _ref4[1];

      return c2 - c1;
    });
    return counts[0];
  }

  function detectScript(text) {
    let confidenceThreshold = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.75;
    const scriptToCount = new Map(Object.entries(REGEXES).map(_ref5 => {
      let _ref6 = _slicedToArray(_ref5, 2),
          script = _ref6[0],
          regex = _ref6[1];

      return [script, countMatchingCharacters(text, regex)];
    }));
    const latinCount = scriptToCount.get('Latin');
    const latinConfidence = latinCount / text.length;
    scriptToCount.delete('Latin');
    const bestMatch = selectBestMatch(scriptToCount);
    const bestMatchConfidence = bestMatch[1] / text.length;

    if (bestMatchConfidence >= 0.15 && bestMatchConfidence + latinConfidence >= confidenceThreshold) {
      LOGGER.info("Identified as ".concat(bestMatch[0], " with confidence ").concat(formatPercentage(bestMatchConfidence + latinConfidence), ", of which ").concat(formatPercentage(latinConfidence), " Latin"));
      return bestMatch[0];
    }

    if (latinConfidence > 0.75) {
      LOGGER.info("Identified as Latin with confidence ".concat(formatPercentage(latinConfidence)));
      return 'Latin';
    }

    return undefined;
  }

  if (document.location.hostname === 'musicbrainz.org' || document.location.hostname.endsWith('.musicbrainz.org')) {
      onDocumentLoaded(maybeDisplayNewFeatures);
  }

  const guessLanguage = _async(function (titles) {
      const text = titles.join('. ');
      return _await(detectLanguage(text), function (language) {
          selectOption(qs('select#language'), language);
      });
  });
  const doGuess = function doGuess() {
      return _call(getTitles, function (titles) {
          return _continue(_catch(function () {
              return _awaitIgnored(guessLanguage(titles));
          }, function (err) {
              LOGGER.error('Failed to guess language', err);
          }), function () {
              guessScript(titles);
          });
      });
  };
  const getTitles = function getTitles() {
      return _call(getTrackTitles, function (trackTitles) {
          var _window$MB$releaseEdi3;
          const releaseTitle = (_window$MB$releaseEdi3 = window.MB.releaseEditor) === null || _window$MB$releaseEdi3 === void 0 ? void 0 : _window$MB$releaseEdi3.rootField.release().name();
          assertDefined(releaseTitle, 'Release title is undefined?');
          return [
              releaseTitle,
              ...trackTitles
          ];
      });
  };
  const getTrackTitles = _async(function () {
      var _window$MB$releaseEdi, _window$MB$releaseEdi2;
      const mediums = (_window$MB$releaseEdi = (_window$MB$releaseEdi2 = window.MB.releaseEditor) === null || _window$MB$releaseEdi2 === void 0 ? void 0 : _window$MB$releaseEdi2.rootField.release().mediums()) !== null && _window$MB$releaseEdi !== void 0 ? _window$MB$releaseEdi : [];
      return _await(Promise.all(mediums.map(medium => getTrackTitlesFromMedium(medium))), function (trackTitlesPerMedium) {
          const trackTitles = trackTitlesPerMedium.flat();
          if (trackTitles.length === 0) {
              throw new Error('No tracklist to guess from');
          }
          return trackTitles;
      });
  });
  const _getTrackTitlesFromMedium = _async(function (medium) {
      return _await(expandMedium(medium), function () {
          return medium.tracks().map(track => track.name());
      });
  });
  const expandMedium = _async(function (medium) {
      if (medium.loaded()) {
          return;
      }
      if (!medium.loading()) {
          medium.loadTracks();
      }
      return retryTimes(() => {
          if (!medium.loaded())
              throw new Error('Medium did not load');
      }, 20, 250);
  });
  const getTrackTitlesFromMedium = pThrottle({
      limit: 4,
      interval: 1000
  })(_getTrackTitlesFromMedium);
  function selectOption(element, label) {
      const idx = [...element.options].findIndex(option => option.text.trim() === label);
      if (idx < 0) {
          throw new Error('Label '.concat(label, ' not found in selection dropdown list'));
      }
      element.selectedIndex = idx;
      element.dispatchEvent(new Event('change'));
  }
  function guessScript(titles) {
      const text = titles.join('').replaceAll(/\s+/g, '');
      const script = detectScript(text);
      if (!script) {
          LOGGER.error('Could not determine script');
          return;
      }
      selectOption(qs('select#script'), script === 'Han' ? 'Han (Hanzi, Kanji, Hanja)' : script);
  }
  function addButton() {
      const btn = function () {
          var $$a = document.createElement('button');
          $$a.setAttribute('type', 'button');
          $$a.addEventListener('click', evt => {
              evt.preventDefault();
              loadingSpan.style.display = '';
              btn.disabled = true;
              logFailure(doGuess().finally(() => {
                  loadingSpan.style.display = 'none';
                  btn.disabled = false;
              }));
          });
          var $$b = document.createTextNode('Guess language and script');
          $$a.appendChild($$b);
          return $$a;
      }.call(this);
      const loadingSpan = function () {
          var $$c = document.createElement('span');
          $$c.setAttribute('class', 'loading-message');
          setStyles($$c, {
              display: 'none',
              marginLeft: '10px'
          });
          return $$c;
      }.call(this);
      qs('table.row-form > tbody').append(function () {
          var $$d = document.createElement('tr');
          var $$e = document.createElement('td');
          $$d.appendChild($$e);
          var $$f = document.createElement('td');
          $$f.setAttribute('colSpan', 2);
          $$d.appendChild($$f);
          appendChildren($$f, btn);
          appendChildren($$f, loadingSpan);
          return $$d;
      }.call(this));
  }
  LOGGER.configure({ logLevel: LogLevel.INFO });
  LOGGER.addSink(new ConsoleSink(USERSCRIPT_ID));
  addButton();

})();
