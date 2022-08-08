// ==UserScript==
// @name         MB: Blind Votes
// @description  Blinds editor details before your votes are cast.
// @version      2022.8.8
// @author       ROpdebee
// @license      MIT; https://opensource.org/licenses/MIT
// @namespace    https://github.com/ROpdebee/mb-userscripts
// @homepageURL  https://github.com/ROpdebee/mb-userscripts
// @supportURL   https://github.com/ROpdebee/mb-userscripts/issues
// @downloadURL  https://raw.github.com/ROpdebee/mb-userscripts/dist/mb_blind_votes.user.js
// @updateURL    https://raw.github.com/ROpdebee/mb-userscripts/dist/mb_blind_votes.meta.js
// @include      /^https?://(\w+\.)?musicbrainz\.org/edit/\d+([?#]|$)/
// @include      /^https?://(\w+\.)?musicbrainz\.org/edit/(open|subscribed(_editors)?)([?#]|$)/
// @include      /^https?://(\w+\.)?musicbrainz\.org/(area|artist|collection|event|instrument|label|place|recording|release|release-group|series|work|url)/[a-f\d-]{36}/(open_)?edits([?#]|$)/
// @include      /^https?://(\w+\.)?musicbrainz\.org/user/[^/]+/edits(/\w+)?([?#]|$)/
// @include      /^https?://(\w+\.)?musicbrainz\.org/user/[^/]+/votes([?#]|$)/
// @include      /^https?://(\w+\.)?musicbrainz\.org/search/edits\?.+?(#.+?)?$/
// @run-at       document-end
// @grant        none
// ==/UserScript==

// For original source code, see https://github.com/ROpdebee/mb-userscripts/tree/main/src/mb_blind_votes
(function () {
  'use strict';

  /* minified: babel helpers, nativejsx */
  function ownKeys(r,e){var t=Object.keys(r);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(r);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(r,e).enumerable}))),t.push.apply(t,n);}return t}function _objectSpread2(r){for(var e=1;e<arguments.length;e++){var t=null!=arguments[e]?arguments[e]:{};e%2?ownKeys(Object(t),!0).forEach((function(e){_defineProperty(r,e,t[e]);})):Object.getOwnPropertyDescriptors?Object.defineProperties(r,Object.getOwnPropertyDescriptors(t)):ownKeys(Object(t)).forEach((function(e){Object.defineProperty(r,e,Object.getOwnPropertyDescriptor(t,e));}));}return r}function _defineProperty(r,e,t){return e in r?Object.defineProperty(r,e,{value:t,enumerable:!0,configurable:!0,writable:!0}):r[e]=t,r}function _unsupportedIterableToArray(r,e){if(r){if("string"==typeof r)return _arrayLikeToArray(r,e);var t=Object.prototype.toString.call(r).slice(8,-1);return "Object"===t&&r.constructor&&(t=r.constructor.name),"Map"===t||"Set"===t?Array.from(r):"Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)?_arrayLikeToArray(r,e):void 0}}function _arrayLikeToArray(r,e){(null==e||e>r.length)&&(e=r.length);for(var t=0,n=new Array(e);t<e;t++)n[t]=r[t];return n}function _createForOfIteratorHelper(r,e){var t="undefined"!=typeof Symbol&&r[Symbol.iterator]||r["@@iterator"];if(!t){if(Array.isArray(r)||(t=_unsupportedIterableToArray(r))||e&&r&&"number"==typeof r.length){t&&(r=t);var n=0,o=function(){};return {s:o,n:function(){return n>=r.length?{done:!0}:{done:!1,value:r[n++]}},e:function(r){throw r},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,i=!0,c=!1;return {s:function(){t=t.call(r);},n:function(){var r=t.next();return i=r.done,r},e:function(r){c=!0,a=r;},f:function(){try{i||null==t.return||t.return();}finally{if(c)throw a}}}}var appendChildren=function(r,e){(e=Array.isArray(e)?e:[e]).forEach((function(e){e instanceof HTMLElement?r.appendChild(e):(e||"string"==typeof e)&&r.appendChild(document.createTextNode(e.toString()));}));};

  /* minified: lib */
  class ConsoleSink{constructor(e){_defineProperty(this,"scriptName",void 0),_defineProperty(this,"onSuccess",this.onInfo.bind(this)),this.scriptName=e;}formatMessage(e){return "[".concat(this.scriptName,"] ").concat(e)}onDebug(e){console.debug(this.formatMessage(e));}onLog(e){console.log(this.formatMessage(e));}onInfo(e){console.info(this.formatMessage(e));}onWarn(e,t){e=this.formatMessage(e),t?console.warn(e,t):console.warn(e);}onError(e,t){e=this.formatMessage(e),t?console.error(e,t):console.error(e);}}let LogLevel;!function(e){e[e.DEBUG=0]="DEBUG",e[e.LOG=1]="LOG",e[e.INFO=2]="INFO",e[e.SUCCESS=3]="SUCCESS",e[e.WARNING=4]="WARNING",e[e.ERROR=5]="ERROR";}(LogLevel||(LogLevel={}));const HANDLER_NAMES={[LogLevel.DEBUG]:"onDebug",[LogLevel.LOG]:"onLog",[LogLevel.INFO]:"onInfo",[LogLevel.SUCCESS]:"onSuccess",[LogLevel.WARNING]:"onWarn",[LogLevel.ERROR]:"onError"},DEFAULT_OPTIONS={logLevel:LogLevel.INFO,sinks:[]};class Logger{constructor(e){_defineProperty(this,"_configuration",void 0),this._configuration=_objectSpread2(_objectSpread2({},DEFAULT_OPTIONS),e);}fireHandlers(e,t,n){e<this._configuration.logLevel||this._configuration.sinks.forEach((o=>{const r=o[HANDLER_NAMES[e]];r&&(n?r.call(o,t,n):r.call(o,t));}));}debug(e){this.fireHandlers(LogLevel.DEBUG,e);}log(e){this.fireHandlers(LogLevel.LOG,e);}info(e){this.fireHandlers(LogLevel.INFO,e);}success(e){this.fireHandlers(LogLevel.SUCCESS,e);}warn(e,t){this.fireHandlers(LogLevel.WARNING,e,t);}error(e,t){this.fireHandlers(LogLevel.ERROR,e,t);}configure(e){Object.assign(this._configuration,e);}get configuration(){return this._configuration}addSink(e){this._configuration.sinks.push(e);}}const LOGGER=new Logger;var USERSCRIPT_ID="mb_blind_votes";class AssertionError extends Error{}function assert(e,t){if(!e)throw new AssertionError(null!=t?t:"Assertion failed")}function assertNonNull(e,t){assert(null!==e,null!=t?t:"Assertion failed: Expected value to be non-null");}function qs(e,t){const n=qsMaybe(e,t);return assertNonNull(n,"Could not find required element"),n}function qsMaybe(e,t){return (null!=t?t:document).querySelector(e)}function qsa(e,t){return [...(null!=t?t:document).querySelectorAll(e)]}function onDocumentLoaded(e){"loading"!==document.readyState?e():document.addEventListener("DOMContentLoaded",e);}function insertStylesheet(e,t){if(void 0===t&&(t="ROpdebee_".concat(USERSCRIPT_ID,"_css")),null!==qsMaybe("style#".concat(t)))return;const n=function(){var n=document.createElement("style");return n.setAttribute("id",t),appendChildren(n,e),n}.call(this);document.head.insertAdjacentElement("beforeend",n);}function parseVersion(e){return e.split(".").map((e=>parseInt(e)))}function versionLessThan(e,t){let n=0;for(;n<e.length&&n<t.length;){if(e[n]<t[n])return !0;if(e[n]>t[n])return !1;n++;}return e.length<t.length}var CHANGELOG_URL="https://github.com/ROpdebee/mb-userscripts/blob/dist/mb_blind_votes.changelog.md",USERSCRIPT_FEATURE_HISTORY=[],css_248z=".ROpdebee_feature_list{font-weight:300;margin:0 auto;width:-moz-fit-content;width:fit-content}.ROpdebee_feature_list ul{margin:6px 28px 0 0;text-align:left}";const LAST_DISPLAYED_KEY="ROpdebee_".concat(USERSCRIPT_ID,"_last_notified_update");function maybeDisplayNewFeatures(){const e=localStorage.getItem(LAST_DISPLAYED_KEY),t=GM.info.script;if(!e)return void localStorage.setItem(LAST_DISPLAYED_KEY,t.version);const n=parseVersion(e),o=USERSCRIPT_FEATURE_HISTORY.filter((e=>versionLessThan(n,parseVersion(e.versionAdded))));0!==o.length&&showFeatureNotification(t.name,t.version,o.map((e=>e.description)));}function showFeatureNotification(e,t,n){insertStylesheet(css_248z,"ROpdebee_Update_Banner");const o=function(){var r=document.createElement("div");r.setAttribute("class","banner warning-header");var s=document.createElement("p");r.appendChild(s),appendChildren(s,"".concat(e," was updated to v").concat(t,"! "));var a=document.createElement("a");a.setAttribute("href",CHANGELOG_URL),s.appendChild(a);var i=document.createTextNode("See full changelog here");a.appendChild(i),appendChildren(s,". New features since last update:");var l=document.createElement("div");l.setAttribute("class","ROpdebee_feature_list"),r.appendChild(l);var c=document.createElement("ul");l.appendChild(c),appendChildren(c,n.map((e=>function(){var t=document.createElement("li");return appendChildren(t,e),t}.call(this))));var d=document.createElement("button");return d.setAttribute("class","dismiss-banner remove-item icon"),d.setAttribute("data-banner-name","alert"),d.setAttribute("type","button"),d.addEventListener("click",(()=>{o.remove(),localStorage.setItem(LAST_DISPLAYED_KEY,GM.info.script.version);})),r.appendChild(d),r}.call(this);qs("#page").insertAdjacentElement("beforebegin",o);}

  LOGGER.configure({
      logLevel: LogLevel.INFO,
  });
  LOGGER.addSink(new ConsoleSink(USERSCRIPT_ID));

  if (document.location.hostname === 'musicbrainz.org' || document.location.hostname.endsWith('.musicbrainz.org')) {
      onDocumentLoaded(maybeDisplayNewFeatures);
  }

  function setupStyle() {
    const style = document.createElement('style');
    style.id = 'ROpdebee_blind_votes';
    document.head.append(style);
    style.sheet.insertRule("\n        /* Edit pages */\n        div#content:not(.unblind) div.edit-header > p.subheader > a, /* Editor */\n        div#content:not(.unblind) table.vote-tally tr:nth-child(n+3), /* Vote */\n        div#content:not(.unblind) table.vote-tally tr:nth-child(n+3) a, /* Voter */\n        div#content:not(.unblind) table.vote-tally tr:nth-child(1) td, /* Vote tally */\n        div#content:not(.unblind) div.edit-notes h3 > a:not(.date), /* Edit note author */\n\n        /* Edit lists */\n        div.edit-list:not(.unblind) div.edit-header > p.subheader > a, /* Editor */\n        div.edit-list:not(.unblind) div.edit-notes h3 > a:not(.date) /* Edit note author */\n        {\n            color: black;\n            background-color: black;\n        }");
    style.sheet.insertRule("\n        /* Edit pages */\n        div#content:not(.unblind) div.edit-header > p.subheader > a > img, /* Editor */\n        div#content:not(.unblind) table.vote-tally th > a > img, /* Voter */\n        div#content:not(.unblind) div.edit-notes h3 > a:not(.date) > img, /* Edit note author */\n        div#content:not(.unblind) div.edit-notes h3 > div.voting-icon, /* Vote icon */\n\n        /* Edit lists */\n        div.edit-list:not(.unblind) div.edit-header > p.subheader > a > img, /* Editor */\n        div.edit-list:not(.unblind) div.edit-notes h3 > a:not(.date) > img, /* Edit note author */\n        div.edit-list:not(.unblind) div.edit-notes h3 > div.voting-icon /* Vote icon */\n        {\n            display: none;\n        }");
  }

  function onVoteSelected(evt) {
    var _target$closest, _target$closest2;

    assertNonNull(evt.target);
    const target = evt.target;
    (_target$closest = target.closest('div.edit-list')) === null || _target$closest === void 0 ? void 0 : _target$closest.classList.add('unblind');
    (_target$closest2 = target.closest('div#content')) === null || _target$closest2 === void 0 ? void 0 : _target$closest2.classList.add('unblind');
  }

  function onNoVoteSelected(evt) {
    var _target$closest3;

    assertNonNull(evt.target);
    const target = evt.target;
    (_target$closest3 = target.closest('div.edit-list, div#content')) === null || _target$closest3 === void 0 ? void 0 : _target$closest3.classList.remove('unblind');
  }

  function setupUnblindListeners() {
    var _iterator = _createForOfIteratorHelper(qsa('input[name^="enter-vote.vote"]:not([id$="-None"])')),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        const voteButton = _step.value;
        voteButton.addEventListener('change', onVoteSelected);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    var _iterator2 = _createForOfIteratorHelper(qsa('input[name^="enter-vote.vote"][id$="-None"]')),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        const noVoteButton = _step2.value;
        noVoteButton.addEventListener('change', onNoVoteSelected);
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
  }

  setupStyle();
  setupUnblindListeners();
  onDocumentLoaded(() => {
    setupUnblindListeners();
    const unblindEdits = qsa("\n        div.edit-header:not(.open),\n        div.cancel-edit > a.negative[href*=\"/cancel\"],\n        input[name^=\"enter-vote.vote\"]:checked:not([id$=\"-None\"])");

    var _iterator3 = _createForOfIteratorHelper(unblindEdits),
        _step3;

    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var _unblindEdit$closest, _unblindEdit$closest2;

        const unblindEdit = _step3.value;
        (_unblindEdit$closest = unblindEdit.closest('div.edit-list')) === null || _unblindEdit$closest === void 0 ? void 0 : _unblindEdit$closest.classList.add('unblind');
        (_unblindEdit$closest2 = unblindEdit.closest('div#content')) === null || _unblindEdit$closest2 === void 0 ? void 0 : _unblindEdit$closest2.classList.add('unblind');
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
  });

})();
