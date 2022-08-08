// ==UserScript==
// @name         MB: QoL: Select All Update Recordings
// @description  Add buttons to release editor to select all "Update recordings" checkboxes.
// @version      2022.8.8
// @author       ROpdebee
// @license      MIT; https://opensource.org/licenses/MIT
// @namespace    https://github.com/ROpdebee/mb-userscripts
// @homepageURL  https://github.com/ROpdebee/mb-userscripts
// @supportURL   https://github.com/ROpdebee/mb-userscripts/issues
// @downloadURL  https://raw.github.com/ROpdebee/mb-userscripts/dist/mb_qol_select_all_update_recordings.user.js
// @updateURL    https://raw.github.com/ROpdebee/mb-userscripts/dist/mb_qol_select_all_update_recordings.meta.js
// @include      /^https?://(\w+\.)?musicbrainz\.org/release/(add|[a-f\d-]{36}/edit)([?#]|$)/
// @run-at       document-idle
// @grant        none
// ==/UserScript==

// For original source code, see https://github.com/ROpdebee/mb-userscripts/tree/main/src/mb_qol_select_all_update_recordings
(function () {
    'use strict';

    /* minified: babel helpers, nativejsx */
    var appendChildren=function(e,r){(r=Array.isArray(r)?r:[r]).forEach((function(r){r instanceof HTMLElement?e.appendChild(r):(r||"string"==typeof r)&&e.appendChild(document.createTextNode(r.toString()));}));};function ownKeys(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n);}return t}function _objectSpread2(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?ownKeys(Object(t),!0).forEach((function(r){_defineProperty(e,r,t[r]);})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):ownKeys(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r));}));}return e}function _defineProperty(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}

    /* minified: lib */
    class ConsoleSink{constructor(e){_defineProperty(this,"scriptName",void 0),_defineProperty(this,"onSuccess",this.onInfo.bind(this)),this.scriptName=e;}formatMessage(e){return "[".concat(this.scriptName,"] ").concat(e)}onDebug(e){console.debug(this.formatMessage(e));}onLog(e){console.log(this.formatMessage(e));}onInfo(e){console.info(this.formatMessage(e));}onWarn(e,t){e=this.formatMessage(e),t?console.warn(e,t):console.warn(e);}onError(e,t){e=this.formatMessage(e),t?console.error(e,t):console.error(e);}}let LogLevel;!function(e){e[e.DEBUG=0]="DEBUG",e[e.LOG=1]="LOG",e[e.INFO=2]="INFO",e[e.SUCCESS=3]="SUCCESS",e[e.WARNING=4]="WARNING",e[e.ERROR=5]="ERROR";}(LogLevel||(LogLevel={}));const HANDLER_NAMES={[LogLevel.DEBUG]:"onDebug",[LogLevel.LOG]:"onLog",[LogLevel.INFO]:"onInfo",[LogLevel.SUCCESS]:"onSuccess",[LogLevel.WARNING]:"onWarn",[LogLevel.ERROR]:"onError"},DEFAULT_OPTIONS={logLevel:LogLevel.INFO,sinks:[]};class Logger{constructor(e){_defineProperty(this,"_configuration",void 0),this._configuration=_objectSpread2(_objectSpread2({},DEFAULT_OPTIONS),e);}fireHandlers(e,t,n){e<this._configuration.logLevel||this._configuration.sinks.forEach((o=>{const r=o[HANDLER_NAMES[e]];r&&(n?r.call(o,t,n):r.call(o,t));}));}debug(e){this.fireHandlers(LogLevel.DEBUG,e);}log(e){this.fireHandlers(LogLevel.LOG,e);}info(e){this.fireHandlers(LogLevel.INFO,e);}success(e){this.fireHandlers(LogLevel.SUCCESS,e);}warn(e,t){this.fireHandlers(LogLevel.WARNING,e,t);}error(e,t){this.fireHandlers(LogLevel.ERROR,e,t);}configure(e){Object.assign(this._configuration,e);}get configuration(){return this._configuration}addSink(e){this._configuration.sinks.push(e);}}const LOGGER=new Logger;var USERSCRIPT_ID="mb_qol_select_all_update_recordings";class AssertionError extends Error{}function assert(e,t){if(!e)throw new AssertionError(null!=t?t:"Assertion failed")}function assertNonNull(e,t){assert(null!==e,null!=t?t:"Assertion failed: Expected value to be non-null");}function qs(e,t){const n=qsMaybe(e,t);return assertNonNull(n,"Could not find required element"),n}function qsMaybe(e,t){return (null!=t?t:document).querySelector(e)}function qsa(e,t){return [...(null!=t?t:document).querySelectorAll(e)]}function onDocumentLoaded(e){"loading"!==document.readyState?e():document.addEventListener("DOMContentLoaded",e);}function insertStylesheet(e,t){if(void 0===t&&(t="ROpdebee_".concat(USERSCRIPT_ID,"_css")),null!==qsMaybe("style#".concat(t)))return;const n=function(){var n=document.createElement("style");return n.setAttribute("id",t),appendChildren(n,e),n}.call(this);document.head.insertAdjacentElement("beforeend",n);}function parseVersion(e){return e.split(".").map((e=>parseInt(e)))}function versionLessThan(e,t){let n=0;for(;n<e.length&&n<t.length;){if(e[n]<t[n])return !0;if(e[n]>t[n])return !1;n++;}return e.length<t.length}var CHANGELOG_URL="https://github.com/ROpdebee/mb-userscripts/blob/dist/mb_qol_select_all_update_recordings.changelog.md",USERSCRIPT_FEATURE_HISTORY=[],css_248z=".ROpdebee_feature_list{font-weight:300;margin:0 auto;width:-moz-fit-content;width:fit-content}.ROpdebee_feature_list ul{margin:6px 28px 0 0;text-align:left}";const LAST_DISPLAYED_KEY="ROpdebee_".concat(USERSCRIPT_ID,"_last_notified_update");function maybeDisplayNewFeatures(){const e=localStorage.getItem(LAST_DISPLAYED_KEY),t=GM.info.script;if(!e)return void localStorage.setItem(LAST_DISPLAYED_KEY,t.version);const n=parseVersion(e),o=USERSCRIPT_FEATURE_HISTORY.filter((e=>versionLessThan(n,parseVersion(e.versionAdded))));0!==o.length&&showFeatureNotification(t.name,t.version,o.map((e=>e.description)));}function showFeatureNotification(e,t,n){insertStylesheet(css_248z,"ROpdebee_Update_Banner");const o=function(){var r=document.createElement("div");r.setAttribute("class","banner warning-header");var s=document.createElement("p");r.appendChild(s),appendChildren(s,"".concat(e," was updated to v").concat(t,"! "));var a=document.createElement("a");a.setAttribute("href",CHANGELOG_URL),s.appendChild(a);var i=document.createTextNode("See full changelog here");a.appendChild(i),appendChildren(s,". New features since last update:");var l=document.createElement("div");l.setAttribute("class","ROpdebee_feature_list"),r.appendChild(l);var c=document.createElement("ul");l.appendChild(c),appendChildren(c,n.map((e=>function(){var t=document.createElement("li");return appendChildren(t,e),t}.call(this))));var d=document.createElement("button");return d.setAttribute("class","dismiss-banner remove-item icon"),d.setAttribute("data-banner-name","alert"),d.setAttribute("type","button"),d.addEventListener("click",(()=>{o.remove(),localStorage.setItem(LAST_DISPLAYED_KEY,GM.info.script.version);})),r.appendChild(d),r}.call(this);qs("#page").insertAdjacentElement("beforebegin",o);}

    LOGGER.configure({
        logLevel: LogLevel.INFO,
    });
    LOGGER.addSink(new ConsoleSink(USERSCRIPT_ID));

    if (document.location.hostname === 'musicbrainz.org' || document.location.hostname.endsWith('.musicbrainz.org')) {
        onDocumentLoaded(maybeDisplayNewFeatures);
    }

    function setCheckboxToTargetState(checkbox, targetState) {
        if (checkbox.checked === targetState)
            return;
        checkbox.checked = targetState;
        checkbox.dispatchEvent(new Event('click'));
    }
    function addButtons(pElement, classSelector) {
        let nextTargetState = true;
        function onSelectAllClicked() {
            qsa(classSelector).forEach(cbox => {
                setCheckboxToTargetState(cbox, nextTargetState);
            });
            selectAllBtn.textContent = nextTargetState ? 'Deselect all' : 'Select all';
            nextTargetState = !nextTargetState;
        }
        function onToggleAllClicked() {
            qsa(classSelector).forEach(cbox => {
                setCheckboxToTargetState(cbox, !cbox.checked);
            });
        }
        const selectAllBtn = function () {
            var $$a = document.createElement('button');
            $$a.setAttribute('type', 'button');
            $$a.setAttribute('class', 'ROpdebee_select_all');
            $$a.addEventListener('click', onSelectAllClicked);
            var $$b = document.createTextNode('Select all');
            $$a.appendChild($$b);
            return $$a;
        }.call(this);
        const toggleAllBtn = function () {
            var $$c = document.createElement('button');
            $$c.setAttribute('type', 'button');
            $$c.setAttribute('class', 'ROpdebee_update_all');
            $$c.addEventListener('click', onToggleAllClicked);
            var $$d = document.createTextNode('Toggle all');
            $$c.appendChild($$d);
            return $$c;
        }.call(this);
        pElement.append(selectAllBtn);
        pElement.append(toggleAllBtn);
    }
    function addButtonsOnLoad() {
        if (qsa('button.ROpdebee_select_all').length > 0)
            return;
        const pElements = qsa('#recordings > .changes > fieldset > p');
        if (pElements.length > 1) {
            addButtons(pElements[2], '.update-recording-title');
            addButtons(pElements[3], '.update-recording-artist');
        }
    }
    setInterval(addButtonsOnLoad, 500);

})();
