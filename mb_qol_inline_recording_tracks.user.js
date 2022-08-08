// ==UserScript==
// @name         MB: QoL: Inline all recordings' tracks on releases
// @description  Display all tracks and releases on which a recording appears from the release page.
// @version      2022.8.8
// @author       ROpdebee
// @license      MIT; https://opensource.org/licenses/MIT
// @namespace    https://github.com/ROpdebee/mb-userscripts
// @homepageURL  https://github.com/ROpdebee/mb-userscripts
// @supportURL   https://github.com/ROpdebee/mb-userscripts/issues
// @downloadURL  https://raw.github.com/ROpdebee/mb-userscripts/dist/mb_qol_inline_recording_tracks.user.js
// @updateURL    https://raw.github.com/ROpdebee/mb-userscripts/dist/mb_qol_inline_recording_tracks.meta.js
// @include      /^https?://(\w+\.)?musicbrainz\.org/release/[a-f\d-]{36}([?#]|$)/
// @run-at       document-end
// @grant        none
// ==/UserScript==

// For original source code, see https://github.com/ROpdebee/mb-userscripts/tree/main/src/mb_qol_inline_recording_tracks
(function () {
    'use strict';

    /* minified: babel helpers, nativejsx, babel-plugin-transform-async-to-promises, p-throttle */
    var appendChildren=function(t,e){(e=Array.isArray(e)?e:[e]).forEach((function(e){e instanceof HTMLElement?t.appendChild(e):(e||"string"==typeof e)&&t.appendChild(document.createTextNode(e.toString()));}));};function ownKeys(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n);}return r}function _objectSpread2(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?ownKeys(Object(r),!0).forEach((function(e){_defineProperty(t,e,r[e]);})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):ownKeys(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e));}));}return t}function _defineProperty(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function _slicedToArray(t,e){return _arrayWithHoles(t)||_iterableToArrayLimit(t,e)||_unsupportedIterableToArray(t,e)||_nonIterableRest()}function _arrayWithHoles(t){if(Array.isArray(t))return t}function _iterableToArrayLimit(t,e){var r=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=r){var n,o,i=[],l=!0,a=!1;try{for(r=r.call(t);!(l=(n=r.next()).done)&&(i.push(n.value),!e||i.length!==e);l=!0);}catch(u){a=!0,o=u;}finally{try{l||null==r.return||r.return();}finally{if(a)throw o}}return i}}function _unsupportedIterableToArray(t,e){if(t){if("string"==typeof t)return _arrayLikeToArray(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);return "Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?_arrayLikeToArray(t,e):void 0}}function _arrayLikeToArray(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _createForOfIteratorHelper(t,e){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!r){if(Array.isArray(t)||(r=_unsupportedIterableToArray(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,o=function(){};return {s:o,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,l=!0,a=!1;return {s:function(){r=r.call(t);},n:function(){var t=r.next();return l=t.done,t},e:function(t){a=!0,i=t;},f:function(){try{l||null==r.return||r.return();}finally{if(a)throw i}}}}const _Pact=function(){function t(){}return t.prototype.then=function(e,r){const n=new t,o=this.s;if(o){const t=1&o?e:r;if(t){try{_settle(n,1,t(this.v));}catch(i){_settle(n,2,i);}return n}return this}return this.o=function(t){try{const o=t.v;1&t.s?_settle(n,1,e?e(o):o):r?_settle(n,1,r(o)):_settle(n,2,o);}catch(i){_settle(n,2,i);}},n},t}();function _settle(t,e,r){if(!t.s){if(r instanceof _Pact){if(!r.s)return void(r.o=_settle.bind(null,t,e));1&e&&(e=r.s),r=r.v;}if(r&&r.then)return void r.then(_settle.bind(null,t,e),_settle.bind(null,t,2));t.s=e,t.v=r;const n=t.o;n&&n(t);}}function _async(t){return function(){for(var e=[],r=0;r<arguments.length;r++)e[r]=arguments[r];try{return Promise.resolve(t.apply(this,e))}catch(n){return Promise.reject(n)}}}function _await(t,e,r){return r?e?e(t):t:(t&&t.then||(t=Promise.resolve(t)),e?t.then(e):t)}"undefined"==typeof Symbol||Symbol.iterator||(Symbol.iterator=Symbol("Symbol.iterator"));const _asyncIteratorSymbol="undefined"!=typeof Symbol?Symbol.asyncIterator||(Symbol.asyncIterator=Symbol("Symbol.asyncIterator")):"@@asyncIterator",_earlyReturn={};!function(){function t(t){this._entry=t,this._pact=null,this._resolve=null,this._return=null,this._promise=null;}function e(t){return {value:t,done:!0}}function r(t){return {value:t,done:!1}}t.prototype._yield=function(t){return this._resolve(t&&t.then?t.then(r):r(t)),this._pact=new _Pact},t.prototype.next=function(t){const r=this;return r._promise=new Promise((function(n){const o=r._pact;if(null===o){const a=r._entry;if(null===a)return n(r._promise);function i(t){r._resolve(t&&t.then?t.then(e):e(t)),r._pact=null,r._resolve=null;}r._entry=null,r._resolve=n;var l=a(r);l&&l.then?l.then(i,(function(t){if(t===_earlyReturn)i(r._return);else {const e=new _Pact;r._resolve(e),r._pact=null,r._resolve=null,_resolve(e,2,t);}})):i(l);}else r._pact=null,r._resolve=n,_settle(o,1,t);}))},t.prototype.return=function(t){const r=this;return r._promise=new Promise((function(n){const o=r._pact;if(null===o)return null===r._entry?n(r._promise):(r._entry=null,n(t&&t.then?t.then(e):e(t)));r._return=t,r._resolve=n,r._pact=null,_settle(o,2,_earlyReturn);}))},t.prototype.throw=function(t){const e=this;return e._promise=new Promise((function(r,n){const o=e._pact;if(null===o)return null===e._entry?r(e._promise):(e._entry=null,n(t));e._resolve=r,e._pact=null,_settle(o,2,t);}))},t.prototype[_asyncIteratorSymbol]=function(){return this};}();class AbortError extends Error{constructor(){super("Throttled function aborted"),this.name="AbortError";}}function pThrottle(t){let e=t.limit,r=t.interval,n=t.strict;if(!Number.isFinite(e))throw new TypeError("Expected `limit` to be a finite number");if(!Number.isFinite(r))throw new TypeError("Expected `interval` to be a finite number");const o=new Map;let i=0,l=0;const a=[],u=n?function(){const t=Date.now();if(a.length<e)return a.push(t),0;const n=a.shift()+r;return t>=n?(a.push(t),0):(a.push(n),n-t)}:function(){const t=Date.now();return t-i>r?(l=1,i=t,0):(l<e?l++:(i+=r,l=1),i-t)};return t=>{const e=function e(){const r=this;for(var n=arguments.length,i=new Array(n),l=0;l<n;l++)i[l]=arguments[l];if(!e.isEnabled)return _async((function(){return t.apply(r,i)}))();let a;return new Promise(((e,r)=>{a=setTimeout((()=>{e(t.apply(this,i)),o.delete(a);}),u()),o.set(a,r);}))};return e.abort=()=>{var t,e=_createForOfIteratorHelper(o.keys());try{for(e.s();!(t=e.n()).done;){const e=t.value;clearTimeout(e),o.get(e)(new AbortError);}}catch(r){e.e(r);}finally{e.f();}o.clear(),a.splice(0,a.length);},e.isEnabled=!0,e}}

    /* minified: lib */
    class ConsoleSink{constructor(e){_defineProperty(this,"scriptName",void 0),_defineProperty(this,"onSuccess",this.onInfo.bind(this)),this.scriptName=e;}formatMessage(e){return "[".concat(this.scriptName,"] ").concat(e)}onDebug(e){console.debug(this.formatMessage(e));}onLog(e){console.log(this.formatMessage(e));}onInfo(e){console.info(this.formatMessage(e));}onWarn(e,t){e=this.formatMessage(e),t?console.warn(e,t):console.warn(e);}onError(e,t){e=this.formatMessage(e),t?console.error(e,t):console.error(e);}}let LogLevel;!function(e){e[e.DEBUG=0]="DEBUG",e[e.LOG=1]="LOG",e[e.INFO=2]="INFO",e[e.SUCCESS=3]="SUCCESS",e[e.WARNING=4]="WARNING",e[e.ERROR=5]="ERROR";}(LogLevel||(LogLevel={}));const HANDLER_NAMES={[LogLevel.DEBUG]:"onDebug",[LogLevel.LOG]:"onLog",[LogLevel.INFO]:"onInfo",[LogLevel.SUCCESS]:"onSuccess",[LogLevel.WARNING]:"onWarn",[LogLevel.ERROR]:"onError"},DEFAULT_OPTIONS={logLevel:LogLevel.INFO,sinks:[]};class Logger{constructor(e){_defineProperty(this,"_configuration",void 0),this._configuration=_objectSpread2(_objectSpread2({},DEFAULT_OPTIONS),e);}fireHandlers(e,t,n){e<this._configuration.logLevel||this._configuration.sinks.forEach((o=>{const r=o[HANDLER_NAMES[e]];r&&(n?r.call(o,t,n):r.call(o,t));}));}debug(e){this.fireHandlers(LogLevel.DEBUG,e);}log(e){this.fireHandlers(LogLevel.LOG,e);}info(e){this.fireHandlers(LogLevel.INFO,e);}success(e){this.fireHandlers(LogLevel.SUCCESS,e);}warn(e,t){this.fireHandlers(LogLevel.WARNING,e,t);}error(e,t){this.fireHandlers(LogLevel.ERROR,e,t);}configure(e){Object.assign(this._configuration,e);}get configuration(){return this._configuration}addSink(e){this._configuration.sinks.push(e);}}const LOGGER=new Logger;var USERSCRIPT_ID="mb_qol_inline_recording_tracks";function splitChunks(e,t){const n=[];for(let o=0;o<e.length;o+=t)n.push(e.slice(o,o+t));return n}function isFactory(e){return "function"==typeof e}function insertBetween(e,t){return [...e.slice(0,1),...e.slice(1).flatMap((e=>[isFactory(t)?t():t,e]))]}function logFailure(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"An error occurred";e.catch((e=>{LOGGER.error(t,e);}));}class AssertionError extends Error{}function assert(e,t){if(!e)throw new AssertionError(null!=t?t:"Assertion failed")}function assertNonNull(e,t){assert(null!==e,null!=t?t:"Assertion failed: Expected value to be non-null");}function qs(e,t){const n=qsMaybe(e,t);return assertNonNull(n,"Could not find required element"),n}function qsMaybe(e,t){return (null!=t?t:document).querySelector(e)}function qsa(e,t){return [...(null!=t?t:document).querySelectorAll(e)]}function onDocumentLoaded(e){"loading"!==document.readyState?e():document.addEventListener("DOMContentLoaded",e);}function onWindowLoaded(e){"complete"===window.document.readyState?e():window.addEventListener("load",e);}function onReactHydrated(e,t){var n;Object.keys(e).some((t=>t.startsWith("_reactListening")&&e[t]))?t():"production"===(null===(n=window.__MB__)||void 0===n?void 0:n.DBDefs.GIT_BRANCH)&&"923237cf73"===window.__MB__.DBDefs.GIT_SHA?onWindowLoaded(t):e.addEventListener("mb-hydration",t);}function safeParseJSON(e,t){try{return JSON.parse(e)}catch(n){if(t)throw new Error("".concat(t,": ").concat(n));return}}function insertStylesheet(e,t){if(void 0===t&&(t="ROpdebee_".concat(USERSCRIPT_ID,"_css")),null!==qsMaybe("style#".concat(t)))return;const n=function(){var n=document.createElement("style");return n.setAttribute("id",t),appendChildren(n,e),n}.call(this);document.head.insertAdjacentElement("beforeend",n);}function parseVersion(e){return e.split(".").map((e=>parseInt(e)))}function versionLessThan(e,t){let n=0;for(;n<e.length&&n<t.length;){if(e[n]<t[n])return !0;if(e[n]>t[n])return !1;n++;}return e.length<t.length}var CHANGELOG_URL="https://github.com/ROpdebee/mb-userscripts/blob/dist/mb_qol_inline_recording_tracks.changelog.md",USERSCRIPT_FEATURE_HISTORY=[],css_248z=".ROpdebee_feature_list{font-weight:300;margin:0 auto;width:-moz-fit-content;width:fit-content}.ROpdebee_feature_list ul{margin:6px 28px 0 0;text-align:left}";const LAST_DISPLAYED_KEY="ROpdebee_".concat(USERSCRIPT_ID,"_last_notified_update");function maybeDisplayNewFeatures(){const e=localStorage.getItem(LAST_DISPLAYED_KEY),t=GM.info.script;if(!e)return void localStorage.setItem(LAST_DISPLAYED_KEY,t.version);const n=parseVersion(e),o=USERSCRIPT_FEATURE_HISTORY.filter((e=>versionLessThan(n,parseVersion(e.versionAdded))));0!==o.length&&showFeatureNotification(t.name,t.version,o.map((e=>e.description)));}function showFeatureNotification(e,t,n){insertStylesheet(css_248z,"ROpdebee_Update_Banner");const o=function(){var r=document.createElement("div");r.setAttribute("class","banner warning-header");var s=document.createElement("p");r.appendChild(s),appendChildren(s,"".concat(e," was updated to v").concat(t,"! "));var i=document.createElement("a");i.setAttribute("href",CHANGELOG_URL),s.appendChild(i);var a=document.createTextNode("See full changelog here");i.appendChild(a),appendChildren(s,". New features since last update:");var c=document.createElement("div");c.setAttribute("class","ROpdebee_feature_list"),r.appendChild(c);var l=document.createElement("ul");c.appendChild(l),appendChildren(l,n.map((e=>function(){var t=document.createElement("li");return appendChildren(t,e),t}.call(this))));var d=document.createElement("button");return d.setAttribute("class","dismiss-banner remove-item icon"),d.setAttribute("data-banner-name","alert"),d.setAttribute("type","button"),d.addEventListener("click",(()=>{o.remove(),localStorage.setItem(LAST_DISPLAYED_KEY,GM.info.script.version);})),r.appendChild(d),r}.call(this);qs("#page").insertAdjacentElement("beforebegin",o);}

    LOGGER.configure({
        logLevel: LogLevel.INFO,
    });
    LOGGER.addSink(new ConsoleSink(USERSCRIPT_ID));

    if (document.location.hostname === 'musicbrainz.org' || document.location.hostname.endsWith('.musicbrainz.org')) {
        onDocumentLoaded(maybeDisplayNewFeatures);
    }

    const loadRecordingInfo = _async(function (rids) {
        const query = rids.map(rid => 'rid:' + rid).join(' OR ');
        const url = document.location.origin + '/ws/2/recording?fmt=json&query=' + query;
        return _await(throttledFetch(url), function (resp) {
            return _await(resp.text(), function (_resp$text) {
                const respContent = safeParseJSON(_resp$text, 'Could not parse API response');
                const perRecId = new Map();
                respContent.recordings.forEach(rec => {
                    perRecId.set(rec.id, rec);
                });
                return perRecId;
            });
        });
    });
    const throttledFetch = pThrottle({
        limit: 1,
        interval: 500
    })(fetch);
    function getTrackIndexElement(track, mediumPosition) {
        return function () {
            var $$a = document.createElement('a');
            $$a.setAttribute('href', '/track/'.concat(track.id));
            var $$b = document.createTextNode('#');
            $$a.appendChild($$b);
            appendChildren($$a, mediumPosition.toString());
            var $$d = document.createTextNode('.');
            $$a.appendChild($$d);
            appendChildren($$a, track.number);
            return $$a;
        }.call(this);
    }
    function getTrackIndexElements(media) {
        const tracks = media.flatMap(medium => medium.track.map(track => {
            return getTrackIndexElement(track, medium.position);
        }));
        return insertBetween(tracks, ', ');
    }
    function getReleaseNameElement(release) {
        return function () {
            var $$f = document.createElement('a');
            $$f.setAttribute('href', '/release/'.concat(release.id));
            appendChildren($$f, release.title);
            return $$f;
        }.call(this);
    }
    function formatRow(release) {
        return [
            getReleaseNameElement(release),
            ' (',
            ...getTrackIndexElements(release.media),
            ')'
        ];
    }
    function insertRows(recordingTd, recordingInfo) {
        const rowElements = recordingInfo.releases.map(release => formatRow(release)).map(row => function () {
            var $$h = document.createElement('dl');
            $$h.setAttribute('class', 'ars');
            var $$i = document.createElement('dt');
            $$h.appendChild($$i);
            var $$j = document.createTextNode('appears on:');
            $$i.appendChild($$j);
            var $$k = document.createElement('dd');
            $$h.appendChild($$k);
            appendChildren($$k, row);
            return $$h;
        }.call(this));
        recordingTd.insertBefore(function () {
            var $$m = document.createElement('div');
            $$m.setAttribute('class', 'ars ROpdebee_inline_tracks');
            appendChildren($$m, rowElements);
            return $$m;
        }.call(this), qsMaybe('div.ars', recordingTd));
    }
    function loadAndInsert() {
        const recAnchors = qsa('table.medium td > a[href^="/recording/"]:first-of-type, table.medium td > span:first-child > a[href^="/recording/"]:first-of-type');
        const todo = recAnchors.map(a => [
            a.closest('td'),
            a.href.split('/recording/')[1]
        ]).filter(_ref => {
            let _ref2 = _slicedToArray(_ref, 1), td = _ref2[0];
            return qsMaybe('div.ars.ROpdebee_inline_tracks', td) === null;
        });
        const chunks = splitChunks(todo, 20);
        logFailure(Promise.all(chunks.map(_async(function (chunk) {
            return _await(loadRecordingInfo(chunk.map(_ref3 => {
                let _ref4 = _slicedToArray(_ref3, 2), recId = _ref4[1];
                return recId;
            })), function (recInfo) {
                chunk.forEach(_ref5 => {
                    let _ref6 = _slicedToArray(_ref5, 2), td = _ref6[0], recId = _ref6[1];
                    insertRows(td, recInfo.get(recId));
                });
            });
        }))));
    }
    onReactHydrated(qs('.tracklist-and-credits'), function () {
        var _qs$firstChild;
        const button = function () {
            var $$o = document.createElement('button');
            $$o.setAttribute('class', 'btn-link');
            $$o.setAttribute('type', 'button');
            $$o.addEventListener('click', loadAndInsert);
            var $$p = document.createTextNode('\n        Display track info for recordings\n    ');
            $$o.appendChild($$p);
            return $$o;
        }.call(this);
        (_qs$firstChild = qs('span#medium-toolbox').firstChild) === null || _qs$firstChild === void 0 ? void 0 : _qs$firstChild.before(button, ' | ');
    });

})();
