// ==UserScript==
// @name         MB: QoL: Paste multiple external links at once
// @description  Enables pasting multiple links, separated by whitespace, into the external link editor.
// @version      2024.7.26
// @author       ROpdebee
// @license      MIT; https://opensource.org/licenses/MIT
// @namespace    https://github.com/ROpdebee/mb-userscripts
// @homepageURL  https://github.com/ROpdebee/mb-userscripts
// @supportURL   https://github.com/ROpdebee/mb-userscripts/issues
// @downloadURL  https://raw.github.com/ROpdebee/mb-userscripts/dist/mb_multi_external_links.user.js
// @updateURL    https://raw.github.com/ROpdebee/mb-userscripts/dist/mb_multi_external_links.meta.js
// @match        *://*.musicbrainz.org/*/edit
// @match        *://*.musicbrainz.org/*/edit?*
// @match        *://*.musicbrainz.org/release/*/edit-relationships*
// @match        *://*.musicbrainz.org/*/add
// @match        *://*.musicbrainz.org/*/add?*
// @match        *://*.musicbrainz.org/*/create
// @match        *://*.musicbrainz.org/*/create?*
// @run-at       document-end
// @grant        none
// ==/UserScript==

// For original source code, see https://github.com/ROpdebee/mb-userscripts/tree/main/src/mb_multi_external_links
(function () {
  'use strict';

  /* minified: babel helpers, nativejsx */
  function _toPrimitive(t,e){if("object"!=typeof t||!t)return t;var r=t[Symbol.toPrimitive];if(void 0!==r){var o=r.call(t,e||"default");if("object"!=typeof o)return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return ("string"===e?String:Number)(t)}function _toPropertyKey(t){var e=_toPrimitive(t,"string");return "symbol"==typeof e?e:String(e)}function _defineProperty(t,e,r){return (e=_toPropertyKey(e))in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function getDefaultExportFromCjs(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var appendChildren=function(t,e){(e=Array.isArray(e)?e:[e]).forEach((function(e){e instanceof HTMLElement?t.appendChild(e):(e||"string"==typeof e)&&t.appendChild(document.createTextNode(e.toString()));}));},appendChildren$1=getDefaultExportFromCjs(appendChildren),setAttributes=function(t,e){if("[object Object]"!==Object.prototype.toString.call(e)||"function"!=typeof e.constructor||"[object Object]"!==Object.prototype.toString.call(e.constructor.prototype)||!Object.prototype.hasOwnProperty.call(e.constructor.prototype,"isPrototypeOf"))throw new DOMException("Failed to execute 'setAttributes' on 'Element': "+Object.prototype.toString.call(e)+" is not a plain object.");for(const r in e)t.setAttribute(r,e[r]);};getDefaultExportFromCjs(setAttributes);var setStyles=function(t,e){for(const r in e)t.style[r]=e[r];};getDefaultExportFromCjs(setStyles);

  /* minified: lib */
  class ConsoleSink{constructor(e){_defineProperty(this,"scriptName",void 0),_defineProperty(this,"onSuccess",this.onInfo.bind(this)),this.scriptName=e;}formatMessage(e){return `[${this.scriptName}] ${e}`}onDebug(e){console.debug(this.formatMessage(e));}onLog(e){console.log(this.formatMessage(e));}onInfo(e){console.info(this.formatMessage(e));}onWarn(e,t){e=this.formatMessage(e),t?console.warn(e,t):console.warn(e);}onError(e,t){e=this.formatMessage(e),t?console.error(e,t):console.error(e);}}let LogLevel=function(e){return e[e.DEBUG=0]="DEBUG",e[e.LOG=1]="LOG",e[e.INFO=2]="INFO",e[e.SUCCESS=3]="SUCCESS",e[e.WARNING=4]="WARNING",e[e.ERROR=5]="ERROR",e}({});const HANDLER_NAMES={[LogLevel.DEBUG]:"onDebug",[LogLevel.LOG]:"onLog",[LogLevel.INFO]:"onInfo",[LogLevel.SUCCESS]:"onSuccess",[LogLevel.WARNING]:"onWarn",[LogLevel.ERROR]:"onError"},DEFAULT_OPTIONS={logLevel:LogLevel.INFO,sinks:[]};class Logger{constructor(e){_defineProperty(this,"_configuration",void 0),this._configuration={...DEFAULT_OPTIONS,...e};}fireHandlers(e,t,n){if(!(e<this._configuration.logLevel))for(const r of this._configuration.sinks){const o=r[HANDLER_NAMES[e]];o&&(n?o.call(r,t,n):o.call(r,t));}}debug(e){this.fireHandlers(LogLevel.DEBUG,e);}log(e){this.fireHandlers(LogLevel.LOG,e);}info(e){this.fireHandlers(LogLevel.INFO,e);}success(e){this.fireHandlers(LogLevel.SUCCESS,e);}warn(e,t){this.fireHandlers(LogLevel.WARNING,e,t);}error(e,t){this.fireHandlers(LogLevel.ERROR,e,t);}configure(e){Object.assign(this._configuration,e);}get configuration(){return this._configuration}addSink(e){this._configuration.sinks.push(e);}}const LOGGER=new Logger;var USERSCRIPT_ID="mb_multi_external_links";class AssertionError extends Error{}function assert(e,t){if(!e)throw new AssertionError(t??"Assertion failed")}function assertNonNull(e,t){assert(null!==e,t??"Assertion failed: Expected value to be non-null");}function assertHasValue(e,t){assert(null!=e,t??"Assertion failed: Expected value to be defined and non-null");}function asyncSleep(e){return new Promise((t=>setTimeout(t,e)))}function retryTimes(e,t,n){return t<=0?Promise.reject(new TypeError(`Invalid number of retry times: ${t}`)):async function t(r){try{return await e()}catch(o){if(r<=1)throw o;return asyncSleep(n).then((()=>t(r-1)))}}(t)}function logFailure(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"An error occurred";return LOGGER.error.bind(LOGGER,e)}function createPersistentCheckbox(e,t,n){return [function(){var t=document.createElement("input");return t.setAttribute("type","checkbox"),t.setAttribute("id",e),t.addEventListener("change",(t=>{t.currentTarget.checked?localStorage.setItem(e,"delete_to_disable"):localStorage.removeItem(e),n(t);})),t.setAttribute("defaultChecked",!!localStorage.getItem(e)),t}.call(this),function(){var n=document.createElement("label");return n.setAttribute("for",e),appendChildren$1(n,t),n}.call(this)]}function qs(e,t){const n=qsMaybe(e,t);return assertNonNull(n,"Could not find required element"),n}function qsMaybe(e,t){return (t??document).querySelector(e)}function qsa(e,t){return [...(t??document).querySelectorAll(e)]}function onDocumentLoaded(e){"loading"!==document.readyState?e():document.addEventListener("DOMContentLoaded",e);}function onAddEntityDialogLoaded(e,t){null===qsMaybe(".content-loading",e.parentElement)?t():e.addEventListener("load",(()=>{t();}));}const inputValueDescriptor=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,"value");function setInputValue(e,t){let n=!(arguments.length>2&&void 0!==arguments[2])||arguments[2];inputValueDescriptor.set.call(e,t),n&&e.dispatchEvent(new Event("input",{bubbles:!0}));}function insertStylesheet(e,t){if(void 0===t&&(t=`ROpdebee_${USERSCRIPT_ID}_css`),null!==qsMaybe(`style#${t}`))return;const n=function(){var n=document.createElement("style");return n.setAttribute("id",t),appendChildren$1(n,e),n}.call(this);document.head.insertAdjacentElement("beforeend",n);}function parseVersion(e){return e.split(".").map((e=>Number.parseInt(e)))}function versionLessThan(e,t){let n=0;for(;n<e.length&&n<t.length;){if(e[n]<t[n])return !0;if(e[n]>t[n])return !1;n++;}return e.length<t.length}var CHANGELOG_URL="https://github.com/ROpdebee/mb-userscripts/blob/dist/mb_multi_external_links.changelog.md",USERSCRIPT_FEATURE_HISTORY=[],css_248z=".ROpdebee_feature_list{font-weight:300;margin:0 auto;width:-moz-fit-content;width:fit-content}.ROpdebee_feature_list ul{margin:6px 28px 0 0;text-align:left}";const LAST_DISPLAYED_KEY=`ROpdebee_${USERSCRIPT_ID}_last_notified_update`;function maybeDisplayNewFeatures(){const e=localStorage.getItem(LAST_DISPLAYED_KEY),t=GM.info.script;if(!e)return void localStorage.setItem(LAST_DISPLAYED_KEY,t.version);const n=parseVersion(e),r=USERSCRIPT_FEATURE_HISTORY.filter((e=>versionLessThan(n,parseVersion(e.versionAdded))));0!==r.length&&showFeatureNotification(t.name,t.version,r.map((e=>e.description)));}function showFeatureNotification(e,t,n){insertStylesheet(css_248z,"ROpdebee_Update_Banner");const r=function(){var o=document.createElement("div");o.setAttribute("class","banner warning-header");var s=document.createElement("p");o.appendChild(s),appendChildren$1(s,`${e} was updated to v${t}! `);var a=document.createElement("a");a.setAttribute("href",CHANGELOG_URL),s.appendChild(a);var i=document.createTextNode("See full changelog here");a.appendChild(i);var l=document.createTextNode(". New features since last update:");s.appendChild(l);var c=document.createElement("div");c.setAttribute("class","ROpdebee_feature_list"),o.appendChild(c);var u=document.createElement("ul");c.appendChild(u),appendChildren$1(u,n.map((e=>function(){var t=document.createElement("li");return appendChildren$1(t,e),t}.call(this))));var d=document.createElement("button");return d.setAttribute("class","dismiss-banner remove-item icon"),d.setAttribute("data-banner-name","alert"),d.setAttribute("type","button"),d.addEventListener("click",(()=>{r.remove(),localStorage.setItem(LAST_DISPLAYED_KEY,GM.info.script.version);})),o.appendChild(d),o}.call(this);qs("#page").insertAdjacentElement("beforebegin",r);}

  LOGGER.configure({
      logLevel: LogLevel.INFO,
  });
  LOGGER.addSink(new ConsoleSink(USERSCRIPT_ID));

  if (document.location.hostname === 'musicbrainz.org' || document.location.hostname.endsWith('.musicbrainz.org')) {
      onDocumentLoaded(maybeDisplayNewFeatures);
  }

  function getExternalLinksEditor(mbInstance) {
    var _ref, _mbInstance$releaseEd;
    const editor = (_ref = ((_mbInstance$releaseEd = mbInstance.releaseEditor) === null || _mbInstance$releaseEd === void 0 ? void 0 : _mbInstance$releaseEd.externalLinks.externalLinksEditorRef) ?? mbInstance.sourceExternalLinksEditor) === null || _ref === void 0 ? void 0 : _ref.current;
    assertHasValue(editor, 'Cannot find external links editor object');
    return editor;
  }
  function getLastInput(editor) {
    const linkInputs = qsa('input.value', editor.tableRef.current);
    return linkInputs[linkInputs.length - 1];
  }
  async function submitUrls(editor, urls) {
    if (urls.length === 0) return;
    const lastInput = getLastInput(editor);
    LOGGER.debug(`Submitting URL ${urls[0]}`);
    setInputValue(lastInput, urls[0]);
    await asyncSleep();
    lastInput.dispatchEvent(new Event('focusout', {
      bubbles: true
    }));
    await submitUrls(editor, urls.slice(1));
  }
  class LinkSplitter {
    constructor(editor) {
      var _this = this;
      _defineProperty(this, "editor", void 0);
      _defineProperty(this, "originalOnChange", void 0);
      _defineProperty(this, "patchedOnChange", void 0);
      this.editor = editor;
      this.originalOnChange = editor.handleUrlChange.bind(editor);
      this.patchedOnChange = function () {
        const rawUrl = arguments.length <= 2 ? undefined : arguments[2];
        LOGGER.debug(`onchange received URLs ${rawUrl}`);
        const splitUrls = rawUrl.trim().split(/\s+/);
        if (splitUrls.length <= 1) {
          _this.originalOnChange(...arguments);
          return;
        }
        const lastUrl = splitUrls[splitUrls.length - 1];
        const firstUrls = splitUrls.slice(0, -1);
        submitUrls(editor, firstUrls).then(() => {
          const lastInput = getLastInput(_this.editor);
          LOGGER.debug(`Submitting URL ${lastUrl}`);
          setInputValue(lastInput, lastUrl);
          lastInput.focus();
        }).catch(logFailure('Something went wrong. onUrlBlur signature change?'));
      };
    }
    enable() {
      LOGGER.debug('Enabling link splitter');
      this.editor.handleUrlChange = this.patchedOnChange;
    }
    disable() {
      LOGGER.debug('Disabling link splitter');
      this.editor.handleUrlChange = this.originalOnChange;
    }
    toggle() {
      this.setEnabled(this.editor.handleUrlChange === this.originalOnChange);
    }
    setEnabled(enabled) {
      if (enabled) {
        this.enable();
      } else {
        this.disable();
      }
    }
  }
  function insertCheckboxElements(editor, checkboxElement, labelElement) {
    var _lastInput$parentElem;
    editor.tableRef.current.after(checkboxElement, labelElement);
    const lastInput = getLastInput(editor);
    const marginLeft = lastInput.offsetLeft + (((_lastInput$parentElem = lastInput.parentElement) === null || _lastInput$parentElem === void 0 ? void 0 : _lastInput$parentElem.offsetLeft) ?? 0);
    checkboxElement.style.marginLeft = `${marginLeft}px`;
  }
  async function run(windowInstance) {
    const editorContainer = qsMaybe('#external-links-editor-container', windowInstance.document);
    if (!editorContainer) return;
    const editor = await retryTimes(() => getExternalLinksEditor(windowInstance.MB), 100, 50);
    const splitter = new LinkSplitter(editor);
    const [checkboxElement, labelElement] = createPersistentCheckbox('ROpdebee_multi_links_no_split', "Don't split links", () => {
      splitter.toggle();
    });
    splitter.setEnabled(!checkboxElement.checked);
    insertCheckboxElements(editor, checkboxElement, labelElement);
  }
  function onIframeAdded(iframe) {
    LOGGER.debug(`Initialising on iframe ${iframe.src}`);
    onAddEntityDialogLoaded(iframe, () => {
      run(iframe.contentWindow).catch(logFailure());
    });
  }
  function listenForIframes() {
    const iframeObserver = new MutationObserver(mutations => {
      for (const addedNode of mutations.flatMap(mut => [...mut.addedNodes])) {
        if (addedNode instanceof HTMLElement && addedNode.classList.contains('iframe-dialog')) {
          const iframe = qsMaybe('iframe', addedNode);
          if (iframe) {
            onIframeAdded(iframe);
          }
        }
      }
    });
    iframeObserver.observe(document, {
      subtree: true,
      childList: true
    });
  }
  run(window).catch(logFailure());
  listenForIframes();

})();
