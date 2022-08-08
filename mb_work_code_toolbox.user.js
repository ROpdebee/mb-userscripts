// ==UserScript==
// @name         MB: Work code toolbox
// @description  Copy work identifiers from various online repertoires and paste them into MB works with ease. Validate work code formatting: Highlight invalid or ill-formatted codes.
// @version      2022.8.8
// @author       ROpdebee
// @license      MIT; https://opensource.org/licenses/MIT
// @namespace    https://github.com/ROpdebee/mb-userscripts
// @homepageURL  https://github.com/ROpdebee/mb-userscripts
// @supportURL   https://github.com/ROpdebee/mb-userscripts/issues
// @downloadURL  https://raw.github.com/ROpdebee/mb-userscripts/dist/mb_work_code_toolbox.user.js
// @updateURL    https://raw.github.com/ROpdebee/mb-userscripts/dist/mb_work_code_toolbox.meta.js
// @include      /^https?://(\w+\.)?musicbrainz\.org/(area|artist|collection|event|instrument|label|place|recording|release|release-group|series|work|url)/(create|[a-f\d-]{36}/edit)([?#]|$)/
// @include      /^https?://(\w+\.)?musicbrainz\.org/release/[a-f\d-]{36}/edit-relationships([?#]|$)/
// @include      /^https?://(\w+\.)?musicbrainz\.org/edit/\d+([?#]|$)/
// @include      /^https?://(\w+\.)?musicbrainz\.org/edit/(open|subscribed(_editors)?)([?#]|$)/
// @include      /^https?://(\w+\.)?musicbrainz\.org/(area|artist|collection|event|instrument|label|place|recording|release|release-group|series|work|url)/[a-f\d-]{36}/(open_)?edits([?#]|$)/
// @include      /^https?://(\w+\.)?musicbrainz\.org/user/[^/]+/edits(/\w+)?([?#]|$)/
// @include      /^https?://(\w+\.)?musicbrainz\.org/user/[^/]+/votes([?#]|$)/
// @include      /^https?://(\w+\.)?musicbrainz\.org/search/edits\?.+?(#.+?)?$/
// @include      /^https?://(\w+\.)?musicbrainz\.org/work/[a-f\d-]{36}/.+([?#]|$)/
// @include      /^https?://(\w+\.)?musicbrainz\.org/collection/[a-f\d-]{36}([?#]|$)/
// @include      /^https?://(\w+\.)?musicbrainz\.org/artist/[a-f\d-]{36}/works([?#]|$)/
// @include      /^https?://online\.gema\.de/werke\/search\.faces([?#]|$)/
// @include      /^https?://iswcnet\.cisac\.org/.*([?#]|$)/
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM.getValue
// @grant        GM_setValue
// @grant        GM.setValue
// @grant        GM_deleteValue
// @grant        GM.deleteValue
// ==/UserScript==

// For original source code, see https://github.com/ROpdebee/mb-userscripts/tree/main/src/mb_work_code_toolbox
(function () {
  'use strict';

  /* minified: babel helpers, babel-plugin-transform-async-to-promises, nativejsx */
  function ownKeys(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n);}return r}function _objectSpread2(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?ownKeys(Object(r),!0).forEach((function(e){_defineProperty(t,e,r[e]);})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):ownKeys(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e));}));}return t}function _defineProperty(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function _slicedToArray(t,e){return _arrayWithHoles(t)||_iterableToArrayLimit(t,e)||_unsupportedIterableToArray(t,e)||_nonIterableRest()}function _arrayWithHoles(t){if(Array.isArray(t))return t}function _iterableToArrayLimit(t,e){var r=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=r){var n,o,l=[],i=!0,a=!1;try{for(r=r.call(t);!(i=(n=r.next()).done)&&(l.push(n.value),!e||l.length!==e);i=!0);}catch(u){a=!0,o=u;}finally{try{i||null==r.return||r.return();}finally{if(a)throw o}}return l}}function _unsupportedIterableToArray(t,e){if(t){if("string"==typeof t)return _arrayLikeToArray(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);return "Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?_arrayLikeToArray(t,e):void 0}}function _arrayLikeToArray(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _createForOfIteratorHelper(t,e){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!r){if(Array.isArray(t)||(r=_unsupportedIterableToArray(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,o=function(){};return {s:o,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var l,i=!0,a=!1;return {s:function(){r=r.call(t);},n:function(){var t=r.next();return i=t.done,t},e:function(t){a=!0,l=t;},f:function(){try{i||null==r.return||r.return();}finally{if(a)throw l}}}}const _Pact=function(){function t(){}return t.prototype.then=function(e,r){const n=new t,o=this.s;if(o){const t=1&o?e:r;if(t){try{_settle(n,1,t(this.v));}catch(l){_settle(n,2,l);}return n}return this}return this.o=function(t){try{const o=t.v;1&t.s?_settle(n,1,e?e(o):o):r?_settle(n,1,r(o)):_settle(n,2,o);}catch(l){_settle(n,2,l);}},n},t}();function _settle(t,e,r){if(!t.s){if(r instanceof _Pact){if(!r.s)return void(r.o=_settle.bind(null,t,e));1&e&&(e=r.s),r=r.v;}if(r&&r.then)return void r.then(_settle.bind(null,t,e),_settle.bind(null,t,2));t.s=e,t.v=r;const n=t.o;n&&n(t);}}"undefined"==typeof Symbol||Symbol.iterator||(Symbol.iterator=Symbol("Symbol.iterator"));const _asyncIteratorSymbol="undefined"!=typeof Symbol?Symbol.asyncIterator||(Symbol.asyncIterator=Symbol("Symbol.asyncIterator")):"@@asyncIterator",_earlyReturn={};!function(){function t(t){this._entry=t,this._pact=null,this._resolve=null,this._return=null,this._promise=null;}function e(t){return {value:t,done:!0}}function r(t){return {value:t,done:!1}}t.prototype._yield=function(t){return this._resolve(t&&t.then?t.then(r):r(t)),this._pact=new _Pact},t.prototype.next=function(t){const r=this;return r._promise=new Promise((function(n){const o=r._pact;if(null===o){const a=r._entry;if(null===a)return n(r._promise);function l(t){r._resolve(t&&t.then?t.then(e):e(t)),r._pact=null,r._resolve=null;}r._entry=null,r._resolve=n;var i=a(r);i&&i.then?i.then(l,(function(t){if(t===_earlyReturn)l(r._return);else {const e=new _Pact;r._resolve(e),r._pact=null,r._resolve=null,_resolve(e,2,t);}})):l(i);}else r._pact=null,r._resolve=n,_settle(o,1,t);}))},t.prototype.return=function(t){const r=this;return r._promise=new Promise((function(n){const o=r._pact;if(null===o)return null===r._entry?n(r._promise):(r._entry=null,n(t&&t.then?t.then(e):e(t)));r._return=t,r._resolve=n,r._pact=null,_settle(o,2,_earlyReturn);}))},t.prototype.throw=function(t){const e=this;return e._promise=new Promise((function(r,n){const o=e._pact;if(null===o)return null===e._entry?r(e._promise):(e._entry=null,n(t));e._resolve=r,e._pact=null,_settle(o,2,t);}))},t.prototype[_asyncIteratorSymbol]=function(){return this};}();var appendChildren=function(t,e){(e=Array.isArray(e)?e:[e]).forEach((function(e){e instanceof HTMLElement?t.appendChild(e):(e||"string"==typeof e)&&t.appendChild(document.createTextNode(e.toString()));}));};

  /* minified: lib */
  class ConsoleSink{constructor(e){_defineProperty(this,"scriptName",void 0),_defineProperty(this,"onSuccess",this.onInfo.bind(this)),this.scriptName=e;}formatMessage(e){return "[".concat(this.scriptName,"] ").concat(e)}onDebug(e){console.debug(this.formatMessage(e));}onLog(e){console.log(this.formatMessage(e));}onInfo(e){console.info(this.formatMessage(e));}onWarn(e,t){e=this.formatMessage(e),t?console.warn(e,t):console.warn(e);}onError(e,t){e=this.formatMessage(e),t?console.error(e,t):console.error(e);}}let LogLevel;!function(e){e[e.DEBUG=0]="DEBUG",e[e.LOG=1]="LOG",e[e.INFO=2]="INFO",e[e.SUCCESS=3]="SUCCESS",e[e.WARNING=4]="WARNING",e[e.ERROR=5]="ERROR";}(LogLevel||(LogLevel={}));const HANDLER_NAMES={[LogLevel.DEBUG]:"onDebug",[LogLevel.LOG]:"onLog",[LogLevel.INFO]:"onInfo",[LogLevel.SUCCESS]:"onSuccess",[LogLevel.WARNING]:"onWarn",[LogLevel.ERROR]:"onError"},DEFAULT_OPTIONS={logLevel:LogLevel.INFO,sinks:[]};class Logger{constructor(e){_defineProperty(this,"_configuration",void 0),this._configuration=_objectSpread2(_objectSpread2({},DEFAULT_OPTIONS),e);}fireHandlers(e,t,n){e<this._configuration.logLevel||this._configuration.sinks.forEach((o=>{const r=o[HANDLER_NAMES[e]];r&&(n?r.call(o,t,n):r.call(o,t));}));}debug(e){this.fireHandlers(LogLevel.DEBUG,e);}log(e){this.fireHandlers(LogLevel.LOG,e);}info(e){this.fireHandlers(LogLevel.INFO,e);}success(e){this.fireHandlers(LogLevel.SUCCESS,e);}warn(e,t){this.fireHandlers(LogLevel.WARNING,e,t);}error(e,t){this.fireHandlers(LogLevel.ERROR,e,t);}configure(e){Object.assign(this._configuration,e);}get configuration(){return this._configuration}addSink(e){this._configuration.sinks.push(e);}}const LOGGER=new Logger;var USERSCRIPT_ID="mb_work_code_toolbox";function existsInGM(e){return "undefined"!=typeof GM&&void 0!==GM[e]}function GMgetValue(e){return existsInGM("getValue")?GM.getValue(e):Promise.resolve(GM_getValue(e))}function GMsetValue(e,t){return existsInGM("setValue")?GM.setValue(e,t):(GM_setValue(e,t),Promise.resolve())}function GMdeleteValue(e){return existsInGM("deleteValue")?GM.deleteValue(e):(GM_deleteValue(e),Promise.resolve())}const GMinfo=existsInGM("info")?GM.info:GM_info;function groupBy(e,t,n){const o=new Map;var r,s=_createForOfIteratorHelper(e);try{for(s.s();!(r=s.n()).done;){var a;const e=r.value,s=t(e),i=n(e);o.has(s)?null===(a=o.get(s))||void 0===a||a.push(i):o.set(s,[i]);}}catch(i){s.e(i);}finally{s.f();}return o}function intersect(e,t){return e.filter((e=>t.includes(e)))}function difference(e,t){return e.filter((e=>!t.includes(e)))}function logFailure(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"An error occurred";e.catch((e=>{LOGGER.error(t,e);}));}class AssertionError extends Error{}function assert(e,t){if(!e)throw new AssertionError(null!=t?t:"Assertion failed")}function assertNonNull(e,t){assert(null!==e,null!=t?t:"Assertion failed: Expected value to be non-null");}function qs(e,t){const n=qsMaybe(e,t);return assertNonNull(n,"Could not find required element"),n}function qsMaybe(e,t){return (null!=t?t:document).querySelector(e)}function onDocumentLoaded(e){"loading"!==document.readyState?e():document.addEventListener("DOMContentLoaded",e);}function onAddEntityDialogLoaded(e,t){null===qsMaybe(".content-loading",e.parentElement)?t():e.addEventListener("load",(()=>{t();}));}function insertStylesheet(e,t){if(void 0===t&&(t="ROpdebee_".concat(USERSCRIPT_ID,"_css")),null!==qsMaybe("style#".concat(t)))return;const n=function(){var n=document.createElement("style");return n.setAttribute("id",t),appendChildren(n,e),n}.call(this);document.head.insertAdjacentElement("beforeend",n);}function parseVersion(e){return e.split(".").map((e=>parseInt(e)))}function versionLessThan(e,t){let n=0;for(;n<e.length&&n<t.length;){if(e[n]<t[n])return !0;if(e[n]>t[n])return !1;n++;}return e.length<t.length}var CHANGELOG_URL="https://github.com/ROpdebee/mb-userscripts/blob/dist/mb_work_code_toolbox.changelog.md",USERSCRIPT_FEATURE_HISTORY=[],css_248z=".ROpdebee_feature_list{font-weight:300;margin:0 auto;width:-moz-fit-content;width:fit-content}.ROpdebee_feature_list ul{margin:6px 28px 0 0;text-align:left}";const LAST_DISPLAYED_KEY="ROpdebee_".concat(USERSCRIPT_ID,"_last_notified_update");function maybeDisplayNewFeatures(){const e=localStorage.getItem(LAST_DISPLAYED_KEY),t=GM.info.script;if(!e)return void localStorage.setItem(LAST_DISPLAYED_KEY,t.version);const n=parseVersion(e),o=USERSCRIPT_FEATURE_HISTORY.filter((e=>versionLessThan(n,parseVersion(e.versionAdded))));0!==o.length&&showFeatureNotification(t.name,t.version,o.map((e=>e.description)));}function showFeatureNotification(e,t,n){insertStylesheet(css_248z,"ROpdebee_Update_Banner");const o=function(){var r=document.createElement("div");r.setAttribute("class","banner warning-header");var s=document.createElement("p");r.appendChild(s),appendChildren(s,"".concat(e," was updated to v").concat(t,"! "));var a=document.createElement("a");a.setAttribute("href",CHANGELOG_URL),s.appendChild(a);var i=document.createTextNode("See full changelog here");a.appendChild(i),appendChildren(s,". New features since last update:");var l=document.createElement("div");l.setAttribute("class","ROpdebee_feature_list"),r.appendChild(l);var c=document.createElement("ul");l.appendChild(c),appendChildren(c,n.map((e=>function(){var t=document.createElement("li");return appendChildren(t,e),t}.call(this))));var d=document.createElement("button");return d.setAttribute("class","dismiss-banner remove-item icon"),d.setAttribute("data-banner-name","alert"),d.setAttribute("type","button"),d.addEventListener("click",(()=>{o.remove(),localStorage.setItem(LAST_DISPLAYED_KEY,GM.info.script.version);})),r.appendChild(d),r}.call(this);qs("#page").insertAdjacentElement("beforebegin",o);}

  LOGGER.configure({
      logLevel: LogLevel.INFO,
  });
  LOGGER.addSink(new ConsoleSink(USERSCRIPT_ID));

  const VERSION = '2021.5.27';

  function latinNetID(agencyId) {
    return {
      inRegexp: new RegExp("(\\d{0,7})(?:".concat(agencyId, ")?")),
      outFormat: '$1',
      keepLeadingZeroes: false
    };
  }

  const CODE_FORMATS = {
    'AACIMH ID': {
      inRegexp: /\d{0,7}/
    },
    'ACAM ID': latinNetID('107'),
    'ACDAM ID': latinNetID('103'),
    'AEI ID': latinNetID('250'),
    'AGADU ID': latinNetID('004'),
    'AKKA/LAA ID': [{
      inRegexp: /\d{0,8}/
    }, {
      inRegexp: /\d{5}M/,
      keepLeadingZeroes: true
    }],
    'AKM ID': {
      inRegexp: /\d{0,8}(?:-?\d{2})?/
    },
    'AMRA ID': {
      inRegexp: /AWK\d{0,7}/
    },
    'APA ID': latinNetID('015'),
    'APDAYC ID': [latinNetID('007'), {
      inRegexp: /\d{8}/
    }],
    'APRA ID': {
      inRegexp: /(?:GW|BG|JG|PM)\d{8}/
    },
    'ARTISJUS ID': {
      inRegexp: /4\d{9}/
    },
    'ASCAP ID': {
      inRegexp: /\d{0,14}/
    },
    'BMI ID': {
      inRegexp: /\d{0,8}/
    },
    'BUMA/STEMRA ID': {
      inRegexp: /W-\d{9}/
    },
    'CASH ID': {
      inRegexp: /[CMPU]-\d{10}/
    },
    'CCLI ID': {
      inRegexp: /\d{0,7}/
    },
    'COMPASS ID': {
      inRegexp: /\d{0,8}/
    },
    'COTT ID': {
      inRegexp: /\d{0,7}/
    },
    'ECAD ID': {
      inRegexp: /\d{0,8}/
    },
    'GEMA ID': {
      inRegexp: /(\d{0,8})[-‐](\d{3})/,
      outFormat: '$1-$2'
    },
    'HFA ID': {
      inRegexp: /[A-Z\d]{6}/
    },
    'ICE ID': {
      inRegexp: /\d{0,8}/
    },
    'IMRO ID': {
      inRegexp: /R\d{0,8}/
    },
    'JASRAC ID': {
      inRegexp: /(\d[\dA-Z]\d)-?(\d{4})-?(\d)/,
      outFormat: '$1-$2-$3',
      keepLeadingZeroes: true
    },
    'KODA ID': {
      inRegexp: /\d{0,8}/
    },
    'KOMCA ID': [{
      inRegexp: /\d{12}/
    }, {
      inRegexp: /0000M\d{5,7}/,
      keepLeadingZeroes: true
    }],
    'LatinNet ID': {
      inRegexp: /\d{3,4}/
    },
    'MACP ID': {
      inRegexp: /1\d{9}/
    },
    'MÜST ID': {
      inRegexp: /1\d{9}/
    },
    'NexTone ID': {
      inRegexp: /N\d{8}/
    },
    'NICAUTOR ID': {
      inRegexp: /\d{0,7}/
    },
    'OSA ID': {
      inRegexp: /(I\d{3})\.?(\d{2})\.?(\d{2})\.?(\d{2})/,
      outFormat: '$1.$2.$3.$4'
    },
    'PRS tune code': {
      inRegexp: /\d{4,6}[\dA-Z][A-Z]/
    },
    'SABAM ID': {
      inRegexp: /[A-Z\d]{7}\d{2}/,
      ensureLength: 9,
      padCharacter: '0',
      message: 'SABAM uses zero-padding in its own repertory.'
    },
    'SACEM ID': {
      inRegexp: /(\d{2})\s?(\d{3})\s?(\d{3})\s?(\d{2})/,
      outFormat: '$1 $2 $3 $4'
    },
    'SACM ID': {
      inRegexp: /[\dA-Z]\d{8}/,
      ensureLength: 9,
      padCharacter: '0',
      message: 'SACM IDs are required to be zero-padded until 9 characters.'
    },
    'SACIM ID': {
      inRegexp: /\d{0,7}/
    },
    'SACVEN ID': latinNetID('060'),
    'SADAIC ID': latinNetID('061'),
    'SAYCE ID': {
      inRegexp: /(\d{0,8})(?:065)?/,
      outFormat: '$1'
    },
    'SAYCO ID': {
      inRegexp: /(\d{0,8})(?:084)?/,
      outFormat: '$1'
    },
    'SESAC ID': {
      inRegexp: /\d{0,9}/
    },
    'SGACEDOM ID': {
      inRegexp: /\d{0,7}/
    },
    'SGAE ID': {
      inRegexp: /(\d{1,3})(?:\.?(\d{3}))?(?:\.?(\d{3}))?/,
      outFormat: (_substring, p1, p2, p3) => [p1, p2, p3].filter(Boolean).join('.')
    },
    'SIAE ID': {
      inRegexp: /\d{7,9}0\d/
    },
    'SOBODAYCOM ID': {
      inRegexp: /\d{0,7}/
    },
    'SOCAN ID': {
      inRegexp: /2?\d{8}/
    },
    'SODRAC ID': {
      inRegexp: /\d{0,7}/
    },
    'SPA ID': {
      inRegexp: /\d{0,7}/
    },
    'SPAC ID': {
      inRegexp: /\d{0,7}/
    },
    'STEF ID': {
      inRegexp: /\d{0,8}/
    },
    'STIM ID': {
      inRegexp: /\d{0,8}/
    },
    'SUISA ID': {
      inRegexp: /(\d{6})\s?(\d{3})\s?(\d{2})/,
      outFormat: '$1 $2 $3',
      ensureLength: 13,
      padCharacter: '0'
    },
    'TEOSTO ID': {
      inRegexp: /\d{8,9}/
    },
    'TONO ID': {
      inRegexp: /\d{0,8}/
    },
    'ZAiKS ID': {
      inRegexp: /\d{0,7}/
    }
  };

  function wrapRegex(start, regexp, end) {
    return new RegExp(start + regexp.source + end);
  }

  function validateCode(code, agencyId) {
    const rules = CODE_FORMATS[agencyId];

    if (!rules) {
      return {
        isValid: true,
        input: code,
        formattedCode: code,
        wasChanged: false
      };
    }

    if (Array.isArray(rules)) {
      let partialResult;

      var _iterator = _createForOfIteratorHelper(rules),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          const rule = _step.value;
          partialResult = validateCodeSingleRule(code, rule);

          if (partialResult.isValid) {
            break;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return partialResult;
    }

    return validateCodeSingleRule(code, rules);
  }

  function validateCodeSingleRule(code, rule) {
    let inputRegexp = rule.inRegexp;
    let outFormat = rule.outFormat;

    if (!outFormat) {
      inputRegexp = wrapRegex('(', inputRegexp, ')');
      outFormat = '$1';
    } else {
      inputRegexp = wrapRegex('(?:', inputRegexp, ')');
    }

    if (!rule.keepLeadingZeroes) {
      inputRegexp = wrapRegex('0*', inputRegexp, '');
    }

    inputRegexp = wrapRegex('^', inputRegexp, '$');

    if (rule.ensureLength && rule.padCharacter) {
      code = code.padStart(rule.ensureLength, rule.padCharacter);
    }

    if (!inputRegexp.test(code)) {
      return {
        isValid: false,
        input: code,
        message: rule.message
      };
    }

    let formatted = code.replace(inputRegexp, outFormat);

    if (!formatted) {
      console.error("Failed to format ".concat(code));
      formatted = code;
    }

    return {
      isValid: true,
      input: code,
      formattedCode: formatted,
      wasChanged: formatted !== code
    };
  }

  const agencyKeyTransformations = {
    'BUMA': 'BUMA/STEMRA ID',
    'MUST': 'MÜST ID',
    'PRS': 'PRS tune code',
    'SESAC Inc.': 'SESAC ID',
    'ZAIKS': 'ZAiKS ID'
  };
  function agencyNameToID(agencyName) {
    var _agencyKeyTransformat;

    return (_agencyKeyTransformat = agencyKeyTransformations[agencyName]) !== null && _agencyKeyTransformat !== void 0 ? _agencyKeyTransformat : agencyName + ' ID';
  }

  const ATTR_TRANSLATIONS = new Set(['Attributes', 'Eigenschaften', 'Attributs', 'Attributi', 'Eigenschappen']);

  function highlightElement(el, level, title) {
    const color = level === 'error' ? 'FireBrick' : 'Orange';
    el.style.color = color;
    el.style.fontWeight = 'bold';

    if (title) {
      el.title = title;
      el.style.textDecoration = 'underline dotted 2px';
    }
  }

  function checkElement(el, code, agencyId) {
    const result = validateCode(code, agencyId);

    if (!result.isValid) {
      highlightElement(el, 'error', result.message);
    } else if (result.wasChanged) {
      highlightElement(el, 'warning', result.formattedCode);
    }
  }

  function processTabulatedPage() {
    document.querySelectorAll('table.tbl').forEach(tbl => {
      processTable(tbl);
    });
  }

  function processTable(table) {
    const columnIdx = 1 + [...table.querySelectorAll('thead th')].findIndex(th => ATTR_TRANSLATIONS.has(th.textContent));
    const attrLis = table.querySelectorAll("td:nth-child(".concat(columnIdx, ") li"));
    attrLis.forEach(el => {
      const match = /(.+)\s\((.+?)\)/.exec(el.textContent);
      let code, agencyId;

      try {
        var _ref = match;

        var _ref2 = _slicedToArray(_ref, 3);

        code = _ref2[1];
        agencyId = _ref2[2];
      } catch (_unused) {
        return;
      }

      checkElement(el, code, agencyId);
    });
  }

  function processWorkPage() {
    const attrs = document.querySelectorAll('dl.properties > dd.work-attribute');
    attrs.forEach(el => {
      const agencyDD = el.previousSibling;
      const agencyId = agencyDD.textContent.slice(0, -1);
      checkElement(el, el.textContent, agencyId);
    });
  }

  function processEditPage() {
    document.querySelectorAll('table.details.edit-work, table.details.add-work').forEach(tbl => {
      const attrRows = [...tbl.querySelectorAll('tr')].filter(tr => {
        const attrName = tr.querySelector('th').textContent;
        return attrName.endsWith(' ID:') || attrName === 'PRS tune code:';
      });
      attrRows.forEach(row => {
        const agencyId = row.querySelector('th').textContent.slice(0, -1);
        row.querySelectorAll('li').forEach(el => {
          checkElement(el, el.textContent, agencyId);
        });
      });
    });
    document.querySelectorAll('table.details.merge-works').forEach(tbl => {
      tbl.querySelectorAll('table.tbl').forEach(innerTable => {
        processTable(innerTable);
      });
    });
  }

  function validateCodes() {
    if ((document.location.pathname.startsWith('/artist/') || document.location.pathname.startsWith('/collection/')) && document.location.pathname.split('/')[3] !== 'edits') {
      processTabulatedPage();
    } else if (document.location.pathname.startsWith('/work/') && document.location.pathname.split('/')[3] !== 'edits') {
      processWorkPage();
    } else {
      processEditPage();
    }
  }

  if (document.location.hostname === 'musicbrainz.org' || document.location.hostname.endsWith('.musicbrainz.org')) {
      onDocumentLoaded(maybeDisplayNewFeatures);
  }

  function findDivByText(parent, text) {
    const divs = [...parent.querySelectorAll('div')];
    return divs.filter(n => {
      var _n$textContent;

      return ((_n$textContent = n.textContent) === null || _n$textContent === void 0 ? void 0 : _n$textContent.trim()) === text;
    });
  }

  const LOG_STYLES = {
    'error': 'background-color: FireBrick; color: white; font-weight: bold;',
    'warning': 'background-color: Gold;',
    'info': 'background-color: GainsBoro;',
    'success': 'background-color: LightGreen;'
  };

  function normaliseID(id, agencyKey) {
    const formatResult = validateCode(id, agencyKey);

    if (!formatResult.isValid) {
      return id.replace(/^0+|[.\s-]/g, '');
    }

    return formatResult.formattedCode;
  }

  function normaliseAgencyId(agencyId) {
    return agencyId.replace(/-ID$/, ' ID').replace(/^ID (.+)/, '$1 ID').replace(/-tunniste$/, ' ID');
  }

  function getSelectedID(select) {
    return normaliseAgencyId(select.options[select.selectedIndex].text.trim());
  }

  function setRowKey(select, agencyKey) {
    const idx = [...select.options].findIndex(opt => normaliseAgencyId(opt.text.trim()) === agencyKey);

    if (idx < 0) {
      throw new Error('Unknown agency key');
    }

    select.selectedIndex = idx;
  }

  function computeAgencyConflicts(mbCodes, extCodes) {
    const commonKeys = intersect(Object.keys(mbCodes), Object.keys(extCodes));
    return commonKeys.filter(k => mbCodes.get(k).length > 0).filter(k => difference(extCodes.get(k).map(c => normaliseID(c, k)), mbCodes.get(k).map(c => normaliseID(c, k))).length).map(k => [k, mbCodes.get(k), extCodes.get(k)]);
  }

  function extractCodes(data) {
    const transformed = Object.entries(data.agencyCodes).map(_ref => {
      let _ref2 = _slicedToArray(_ref, 2),
          key = _ref2[0],
          codes = _ref2[1];

      return [agencyNameToID(key), codes];
    });
    return new Map(transformed);
  }

  function deduplicateCodes(codes, key) {
    const seen = new Set();
    const results = [];

    var _iterator = _createForOfIteratorHelper(codes),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        const code = _step.value;
        if (seen.has(normaliseID(code, key))) continue;
        seen.add(normaliseID(code, key));
        results.push(code);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    return results;
  }

  function fillInput(inp, val) {
    inp.value = val;
    inp.style.backgroundColor = 'yellow';
  }

  const mainUIHTML = "<div id=\"ropdebee-work-menu\"\n        style=\"background-color: white;\n        padding: 8px; margin: 0px -6px 6px 550px;\n        border: 5px dotted rgb(115, 109, 171);\">\n    <h2>ROpdebee's work code tools</h2><br/>\n    <div class=\"buttons\">\n        <button type=\"button\" id=\"ROpdebee_MB_Paste_Work\"\n                title=\"Fill work codes from previously copied agency data.\"\n                style=\"cursor: help;\"\n            >Fill work codes</button>\n        <button type=\"button\" id=\"ROpdebee_MB_Format_Codes\"\n                title=\"Correct work code formatting (EXPERIMENTAL).\"\n                style=\"cursor: help;\"\n            >Format work codes</button>\n        <input type=\"checkbox\" id=\"ROpdebee_MB_Autoformat_Codes\">\n        <label for=\"ROpdebee_MB_Autoformat_Codes\">Automatically format work codes on paste (EXPERIMENTAL)</label>\n    </div>\n    <div id=\"ROpdebee_MB_Paste_Work_Log\" style=\"display: none; max-height: 100px; overflow: auto;\"><h3>Log</h3></div>\n    <div id=\"ROpdebee_MB_Code_Validation_Errors\" style=\"display: none;\"><h3>Validation errors</h3></div>\n</div>";
  const VALIDATION_LOG_QUERY = 'div#ROpdebee_MB_Code_Validation_Errors';

  class BaseWorkForm {
    constructor(theForm) {
      _defineProperty(this, "form", void 0);

      this.form = theForm;
      this.form.ROpdebee_Work_Codes_Found = true;
      this.addToolsUI();
      this.activateButtons();
      this.checkExistingCodes();
    }

    activateButtons() {
      this.form.querySelector('button#ROpdebee_MB_Paste_Work').addEventListener('click', evt => {
        evt.preventDefault();
        this.resetLog();
        this.readData(this.checkAndFill.bind(this));
      });
      this.form.querySelector('button#ROpdebee_MB_Format_Codes').addEventListener('click', evt => {
        evt.preventDefault();
        this.resetLog();
        const formattedAny = this.formatExistingCodes();

        if (formattedAny) {
          this.fillEditNote([], 'existing', true);
        }
      });
      const autoFormatCheckbox = this.form.querySelector('input#ROpdebee_MB_Autoformat_Codes');
      autoFormatCheckbox.addEventListener('change', evt => {
        evt.preventDefault();
        const target = evt.target;

        if (target.checked) {
          localStorage.setItem(target.id, 'delete me to disable');
        } else {
          localStorage.removeItem(target.id);
        }
      });
      autoFormatCheckbox.checked = !!localStorage.getItem('ROpdebee_MB_Autoformat_Codes');
    }

    checkExistingCodes() {
      this.resetValidationLog();
      this.existingCodeInputs.forEach(_ref3 => {
        let select = _ref3.select,
            input = _ref3.input;
        const agencyKey = getSelectedID(select);
        const agencyCode = input.value;
        const checkResult = validateCode(agencyCode, agencyKey);

        if (!checkResult.isValid) {
          input.style.backgroundColor = 'red';
          this.addValidationError(agencyKey, agencyCode, checkResult.message);
        } else if (checkResult.wasChanged) {
          input.style.backgroundColor = 'orange';
          this.addFormatWarning(agencyKey, agencyCode);
        }
      });
    }

    formatExistingCodes() {
      let formattedAny = false;
      this.existingCodeInputs.forEach(_ref4 => {
        let select = _ref4.select,
            input = _ref4.input;
        const agencyKey = getSelectedID(select);
        const agencyCode = input.value;
        const checkResult = validateCode(agencyCode, agencyKey);

        if (checkResult.isValid && checkResult.wasChanged) {
          fillInput(input, checkResult.formattedCode);
          this.log('info', "Changed ".concat(agencyKey, " ").concat(agencyCode, " to ").concat(checkResult.formattedCode));
          formattedAny = true;
        }
      });
      return formattedAny;
    }

    resetLog() {
      const logDiv = this.form.querySelector('div#ROpdebee_MB_Paste_Work_Log');
      logDiv.style.display = 'none';
      [...logDiv.children].slice(1).forEach(el => {
        el.remove();
      });
    }

    resetValidationLog() {
      const logDiv = this.form.querySelector(VALIDATION_LOG_QUERY);
      logDiv.style.display = 'none';
      [...logDiv.children].slice(1).forEach(el => {
        el.remove();
      });
    }

    get autoformatCodes() {
      return this.form.querySelector('input#ROpdebee_MB_Autoformat_Codes').checked;
    }

    get existingCodeInputs() {
      return [...this.form.querySelectorAll('table#work-attributes tr')].map(row => ({
        'select': row.querySelector('td > select'),
        'input': row.querySelector('td > input')
      })).filter(_ref5 => {
        let select = _ref5.select,
            input = _ref5.input;
        return select !== null && select.selectedIndex !== 0 && input !== null && input.value;
      });
    }

    get existingCodes() {
      return groupBy(this.existingCodeInputs, _ref6 => {
        let select = _ref6.select;
        return getSelectedID(select);
      }, _ref7 => {
        let value = _ref7.input.value;
        return value;
      });
    }

    get existingISWCs() {
      return [...this.form.querySelectorAll('input[name^="edit-work.iswcs."]')].map(_ref8 => {
        let value = _ref8.value;
        return value;
      }).filter(_ref9 => {
        let length = _ref9.length;
        return length;
      });
    }

    findEmptyRow(parentSelector, inputName) {
      const parent = this.form.querySelector(parentSelector);
      const rows = [...parent.querySelectorAll('input[name*="' + inputName + '"]')];
      const emptyRows = rows.filter(_ref10 => {
        let value = _ref10.value;
        return value.length === 0;
      });

      if (emptyRows.length > 0) {
        return emptyRows[0];
      }

      const newRowBtn = parent.querySelector('button.add-item');
      newRowBtn.click();
      return this.findEmptyRow(parentSelector, inputName);
    }

    checkAndFill(rawData) {
      const data = this.parseData(rawData);
      console.log(data);
      if (data === null) return;
      const externalCodes = extractCodes(data);
      const externalISWCs = data.iswcs;
      const mbCodes = this.existingCodes;
      const mbISWCs = this.existingISWCs;
      const dupeAgencies = [...externalCodes.entries()].filter(_ref11 => {
        let _ref12 = _slicedToArray(_ref11, 2),
            codes = _ref12[1];

        return codes.length > 1;
      }).map(_ref13 => {
        let _ref14 = _slicedToArray(_ref13, 1),
            key = _ref14[0];

        return key;
      });

      if (dupeAgencies.length > 0) {
        const lis = dupeAgencies.reduce((acc, agency) => {
          return acc + "<li>".concat(agency, ": ").concat(externalCodes.get(agency).join(', '), "</li>");
        }, '');
        this.log('warning', "\n                Found duplicate work codes in input.\n                Please double-check whether all of these codes belong to this work.\n                <ul>".concat(lis, "</ul>"));
      }

      const newISWCs = difference(externalISWCs, mbISWCs);
      const conflicts = computeAgencyConflicts(mbCodes, externalCodes);

      if (newISWCs.length > 0 && mbISWCs.length > 0) {
        conflicts.unshift(['ISWC', mbISWCs, externalISWCs]);
      }

      const confirmProm = conflicts.length > 0 ? this.promptForConfirmation(conflicts) : Promise.resolve();
      logFailure(confirmProm.then(() => {
        const newCodes = this.retainOnlyNew(externalCodes, mbCodes);
        this.fillData(newISWCs, newCodes, data['title'], data['source']);
        const numWarnings = this.form.querySelectorAll('div#ROpdebee_MB_Paste_Work_Log > div').length;
        this.log('success', 'Filled successfully' + (numWarnings ? " (".concat(numWarnings, " message(s))") : ''));
      }));
    }

    retainOnlyNew(externalCodes, mbCodes) {
      const acc = new Map();

      var _iterator2 = _createForOfIteratorHelper(externalCodes),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          const _step2$value = _slicedToArray(_step2.value, 2),
                key = _step2$value[0],
                rawCodes = _step2$value[1];

          const codes = deduplicateCodes(rawCodes, key);

          if (!mbCodes.has(key)) {
            acc.set(key, codes);
          } else {
            const mbNormCodes = new Set(mbCodes.get(key).map(c => normaliseID(c, key)));
            acc.set(key, codes.filter(id => !mbNormCodes.has(normaliseID(id, key))));
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      return acc;
    }

    fillData(iswcs, codes, title, source) {
      iswcs.forEach(this.fillISWC.bind(this));
      const entries = [...codes.entries()];
      entries.sort((_ref15, _ref16) => {
        let _ref17 = _slicedToArray(_ref15, 1),
            k1 = _ref17[0];

        let _ref18 = _slicedToArray(_ref16, 1),
            k2 = _ref18[0];

        return k1.localeCompare(k2);
      });
      const unknownAgencyCodes = [];

      for (var _i = 0, _entries = entries; _i < _entries.length; _i++) {
        const _entries$_i = _slicedToArray(_entries[_i], 2),
              agencyKey = _entries$_i[0],
              agencyCodes = _entries$_i[1];

        try {
          this.fillAgencyCodes(agencyKey, agencyCodes);
        } catch (err) {
          if (err instanceof Error && err.message === 'Unknown agency key') {
            unknownAgencyCodes.push([agencyKey, agencyCodes]);
          } else {
            throw err;
          }
        }
      }

      if (unknownAgencyCodes.length > 0) {
        const lis = unknownAgencyCodes.reduce((acc, _ref19) => {
          let _ref20 = _slicedToArray(_ref19, 2),
              agency = _ref20[0],
              unknownCodes = _ref20[1];

          return acc + "<li>".concat(agency, ": ").concat(unknownCodes.join(', '), "</li>");
        }, '');
        this.log('warning', "\n                Encountered unsupported agencies.\n                If you encounter these a lot, please consider filing an MBS ticket.\n                <ul>".concat(lis, "</ul>"));
      }

      if (this.autoformatCodes) {
        this.formatExistingCodes();
      }

      this.checkExistingCodes();
      this.maybeFillTitle(title);
      this.fillEditNote(unknownAgencyCodes, source, this.autoformatCodes);
    }

    maybeFillTitle(title) {
      const titleInp = this.form.querySelector('input[name="edit-work.name"]');

      if (titleInp.value) {
        return;
      }

      fillInput(titleInp, title.toLowerCase());
      titleInp.closest('div.row').querySelector('button.guesscase-title').click();
    }

    fillISWC(iswc) {
      const row = this.findEmptyRow('div.form-row-text-list', 'edit-work.iswcs.');
      fillInput(row, iswc);
    }

    fillAgencyCodes(agencyKey, agencyCodes) {
      agencyCodes.forEach(code => {
        const input = this.findEmptyRow('table#work-attributes', 'edit-work.attributes.');
        setRowKey(input.closest('tr').querySelector('td > select'), agencyKey);
        fillInput(input, code);
      });
    }

    fillEditNote(unknownAgencies, source, wasFormatted) {
      const noteContent = unknownAgencies.reduce((acc, _ref21) => {
        let _ref22 = _slicedToArray(_ref21, 2),
            agencyKey = _ref22[0],
            agencyCodes = _ref22[1];

        return acc + agencyKey + ': ' + agencyCodes.join(', ') + '\n';
      }, unknownAgencies.length > 0 ? 'Unsupported agencies:\n' : '');

      if (noteContent) {
        this.fillEditNoteTop(noteContent);
      }

      const fmtAppliedStr = wasFormatted ? VERSION : 'not applied';
      const editNoteBottom = "".concat(GMinfo.script.name, " v").concat(GMinfo.script.version, " (source: ").concat(source, ", formatting: ").concat(fmtAppliedStr, ")");
      this.fillEditNoteBottom(editNoteBottom);
    }

    fillEditNoteTop(content) {
      const note = this.form.querySelector('textarea[name="edit-work.edit_note"]');
      const noteParts = note.value.split('–\n');
      let top = noteParts[0];

      if (!top) {
        top = content + '\n';
      } else {
        top += content;
      }

      noteParts[0] = top;
      note.value = noteParts.join('–\n');
    }

    fillEditNoteBottom(content) {
      const note = this.form.querySelector('textarea[name="edit-work.edit_note"]');
      const noteParts = note.value.split('–\n');
      let bottom = noteParts[1];

      if (!bottom) {
        bottom = content;
      } else {
        bottom += '\n' + content;
      }

      noteParts[0] = noteParts[0] || '\n';
      noteParts[1] = bottom;
      note.value = noteParts.join('–\n');
    }

    readData(cb) {
      logFailure(GMgetValue('workCodeData').then(data => {
        if (!data) {
          this.log('error', 'No data found. Did you copy anything?');
          return;
        }

        cb(data);
        return GMdeleteValue('workCodeData');
      }));
    }

    parseData(raw) {
      try {
        return JSON.parse(raw);
      } catch (err) {
        this.log('error', 'Invalid data');
        console.log(raw);
        console.log(err);
        return null;
      }
    }

    promptForConfirmation(conflicts) {
      const lis = conflicts.reduce((acc, _ref23) => {
        let _ref24 = _slicedToArray(_ref23, 3),
            agency = _ref24[0],
            mbCodes = _ref24[1],
            extCodes = _ref24[2];

        return acc + "<li>".concat(agency, ": [").concat(mbCodes.join(', '), "] vs [").concat(extCodes.join(', '), "]</li>");
      }, '');
      const msg = "Uh-oh. MB already has the following codes with conflicting data:\n        Are you sure you want to fill these?\n        Note: New codes will be added and will not replace the existing ones.<br/>\n        <ul>".concat(lis, "</ul>\n        <button type=\"button\" class=\"conflict-confirm\">Confirm</button>");
      this.log('warning', msg);
      return new Promise(resolve => {
        this.form.querySelector('.conflict-confirm').addEventListener('click', evt => {
          evt.target.disabled = true;
          evt.preventDefault();
          resolve();
        });
      });
    }

    log(level, html) {
      const logDiv = this.form.querySelector('div#ROpdebee_MB_Paste_Work_Log');
      logDiv.insertAdjacentHTML('beforeend', "\n            <div style=\"border: 1px dashed gray; padding: 2px 2px 5px 5px; margin-top: 2px; ".concat(LOG_STYLES[level], "\">").concat(html, "</div>"));
      logDiv.style.display = 'block';
      logDiv.scrollTop = logDiv.scrollHeight;
    }

    addValidationError(agencyKey, code, message) {
      const logDiv = this.form.querySelector(VALIDATION_LOG_QUERY);
      let msg = "".concat(code, " does not look like a valid ").concat(agencyKey, ".");

      if (message) {
        msg += ' ' + message;
      }

      logDiv.insertAdjacentHTML('beforeend', "<div style=\"border: 1px dashed gray; padding: 2px 2px 5px 5px; margin-top: 2px; ".concat(LOG_STYLES['error'], "\">").concat(msg, "</div>"));
      logDiv.style.display = 'block';
      logDiv.scrollTop = logDiv.scrollHeight;
    }

    addFormatWarning(agencyKey, code) {
      const logDiv = this.form.querySelector(VALIDATION_LOG_QUERY);
      const msg = "".concat(code, " is not a well-formatted ").concat(agencyKey, ".");
      logDiv.insertAdjacentHTML('beforeend', "<div style=\"border: 1px dashed gray; padding: 2px 2px 5px 5px; margin-top: 2px; ".concat(LOG_STYLES['warning'], "\">").concat(msg, "</div>"));
      logDiv.style.display = 'block';
      logDiv.scrollTop = logDiv.scrollHeight;
    }

  }

  class WorkEditForm extends BaseWorkForm {
    addToolsUI() {
      this.form.querySelector('.documentation').insertAdjacentHTML('beforebegin', mainUIHTML);
    }

  }

  class IframeEditForm extends BaseWorkForm {
    addToolsUI() {
      this.form.querySelector('.half-width').insertAdjacentHTML('beforebegin', mainUIHTML);
      this.form.querySelector('#ropdebee-work-menu').style.marginLeft = '0px';
    }

  }

  function editFormFactory(theForm, inIframe) {
    if (inIframe) {
      return new IframeEditForm(theForm);
    }

    return new WorkEditForm(theForm);
  }

  function handleMB() {
    const editWorkFormQuery = 'form.edit-work';

    function handleChange() {
      const workForms = [...document.querySelectorAll(editWorkFormQuery)].map(f => [f, false]);
      document.querySelectorAll('iframe').forEach(iframe => {
        onAddEntityDialogLoaded(iframe, () => {
          iframe.contentWindow.document.querySelectorAll(editWorkFormQuery).forEach(form => workForms.push([form, true]));
        });
      });
      workForms.filter(f => !f[0].ROpdebee_Work_Codes_Found).forEach(_ref25 => {
        let _ref26 = _slicedToArray(_ref25, 2),
            f = _ref26[0],
            inIframe = _ref26[1];

        return editFormFactory(f, inIframe);
      });
    }

    const theForm = document.querySelector(editWorkFormQuery);

    if (theForm && !theForm.ROpdebee_Work_Codes_Found) {
      editFormFactory(theForm, false);
    }

    const observer = new MutationObserver(handleChange);
    observer.observe(document, {
      subtree: true,
      childList: true
    });
  }

  const iswcRegex = /\bT-(?:\d{3}\.){2}\d{3}-\d\b/;

  function storeData(source, iswcs, codes, title) {
    const obj = {
      source,
      iswcs,
      title,
      agencyCodes: Object.fromEntries(codes)
    };
    console.log(obj);
    return GMsetValue('workCodeData', JSON.stringify(obj));
  }

  const stringsDefaults = {
    AGENCY_NAME_FIELD: 'Agency Name',
    AGENCY_WORK_CODES: 'Agency Work Codes',
    AGENCY_WORK_CODE_FIELD: 'Agency Work Code',
    ARCHIVED_ISWCS: 'Archived ISWCs',
    ORIGINAL_TITLE_FIELD: 'Original Title',
    PREFERRED_ISWC_FIELD: 'Preferred ISWC'
  };

  const translateStrings = function () {
    let strings;
    return function (text) {
      var _strings$text;

      if (!strings) {
        const stringsJson = localStorage.getItem('strings');

        if (!stringsJson) {
          console.error('Could not extract translations!');
          return stringsDefaults[text];
        }

        strings = JSON.parse(stringsJson);
      }

      return (_strings$text = strings[text]) !== null && _strings$text !== void 0 ? _strings$text : stringsDefaults[text];
    };
  }();

  function handleISWCNet() {
    function findAgencyWorkCodes(table) {
      const codeTable = findDivByText(table, "".concat(translateStrings('AGENCY_WORK_CODES'), ":")).map(div => div.nextSibling);
      if (codeTable.length === 0) return new Map();
      const rows = [...codeTable[0].querySelectorAll('tbody > tr')];
      const groupedCodes = groupBy(rows, row => row.querySelector("td[id=\"".concat(translateStrings('AGENCY_NAME_FIELD'), ":\"]")).textContent, row => row.querySelector("td[id=\"".concat(translateStrings('AGENCY_WORK_CODE_FIELD'), ":\"]")).textContent);

      if (groupedCodes.has('CASH')) {
        groupedCodes.set('CASH', groupedCodes.get('CASH').map(code => "C-".concat(code)));
      }

      return groupedCodes;
    }

    function findIswcs(table) {
      const iswcs = [table.querySelector("td[id=\"".concat(translateStrings('PREFERRED_ISWC_FIELD'), ":\"]")).textContent];
      findDivByText(table, translateStrings('ARCHIVED_ISWCS')).forEach(archivedTitle => {
        const archivedISWCsDiv = archivedTitle.nextSibling;
        iswcs.push(...archivedISWCsDiv.childNodes[0].textContent.split(', '));
      });
      return iswcs;
    }

    function findTitle(table) {
      return table.querySelector("td[id=\"".concat(translateStrings('ORIGINAL_TITLE_FIELD'), ":\"]")).textContent;
    }

    function parseAndCopy(table) {
      const workCodes = findAgencyWorkCodes(table);
      const iswcs = findIswcs(table);
      const title = findTitle(table);
      logFailure(storeData('CISAC ISWCNet', iswcs, workCodes, title));
    }

    function handleChangeCisac(mutationRec) {
      if (mutationRec.length === 0 || mutationRec[0].addedNodes.length === 0) return;
      if (mutationRec[0].addedNodes[0].nodeName !== 'TR') return;
      const viewMoreDiv = mutationRec[0].addedNodes[0].querySelector('[class^="ViewMore_viewMoreContainer"]');
      if (!viewMoreDiv) return;
      const entry = viewMoreDiv.parentNode.parentNode.parentNode;
      const button = document.createElement('button');
      button.textContent = 'Copy work codes';
      button.addEventListener('click', () => {
        parseAndCopy(entry);
      });
      viewMoreDiv.prepend(button);
    }

    const observer = new MutationObserver(handleChangeCisac);
    observer.observe(document, {
      subtree: true,
      childList: true
    });
  }

  function handleGEMA() {
    function findAgencyWorkCodes(tr) {
      return new Map([['GEMA', [tr.querySelector('.workSocworkcde').textContent.match(/(\d{0,8})[-‐](\d{3})/)[0]]]]);
    }

    function findIswcs(tr) {
      return [tr.querySelector('.workIswc').textContent.match(iswcRegex)[0]];
    }

    function findTitle(tr) {
      return tr.querySelector('.workSearchedTitle').textContent;
    }

    function parseAndCopy(tr) {
      const workCodes = findAgencyWorkCodes(tr);
      const iswcs = findIswcs(tr);
      const title = findTitle(tr);
      logFailure(storeData('GEMA Repertoire Search', iswcs, workCodes, title));
    }

    function injectButtons() {
      let parentNode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
      parentNode.querySelectorAll('[id="auswahlForm:searchResultItems:tb"] > tr').forEach(tr => {
        const button = document.createElement('button');
        button.textContent = 'Copy work codes';
        button.addEventListener('click', event => {
          event.preventDefault();
          parseAndCopy(tr);
        });
        tr.querySelector('.empty').prepend(button);
      });
    }

    function handleChangeGEMA(mutationRec) {
      if (mutationRec.length === 0 || mutationRec[0].addedNodes.length === 0) return;
      const searchResults = mutationRec[0].addedNodes[0];
      if (searchResults.nodeType !== Node.ELEMENT_NODE) return;
      injectButtons(searchResults);
    }

    if (Object.toJSON) {
      JSON.stringify = Object.toJSON;
    }

    const observer = new MutationObserver(handleChangeGEMA);
    observer.observe(document.querySelector('div.body'), {
      childList: true
    });
    injectButtons();
  }

  const repertoireToHandler = {
    'iswcnet.cisac.org': handleISWCNet,
    'online.gema.de': handleGEMA
  };

  if (document.location.hostname === 'musicbrainz.org' || document.location.hostname.endsWith('.musicbrainz.org')) {
    validateCodes();
    handleMB();
  } else {
    repertoireToHandler[document.location.hostname]();
  }

})();
