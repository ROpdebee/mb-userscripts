// ==UserScript==
// @name         MB: QoL: Paste multiple external links at once
// @description  Enables pasting multiple links, separated by whitespace, into the external link editor.
// @version      2026.2.15
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
  function _defineProperty(e,r,t){return (r=_toPropertyKey(r))in e?Object.defineProperty(e,r,{value:t,enumerable:true,configurable:true,writable:true}):e[r]=t,e}function _toPrimitive(e,r){if("object"!=typeof e||!e)return e;var t=e[Symbol.toPrimitive];if(void 0!==t){var n=t.call(e,r);if("object"!=typeof n)return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return ("string"===r?String:Number)(e)}function _toPropertyKey(e){var r=_toPrimitive(e,"string");return "symbol"==typeof r?r:r+""}function getDefaultExportFromCjs(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var appendChildren$1,hasRequiredAppendChildren;function requireAppendChildren(){return hasRequiredAppendChildren?appendChildren$1:(hasRequiredAppendChildren=1,appendChildren$1=function(e,r){(r=Array.isArray(r)?r:[r]).forEach((function(r){r instanceof HTMLElement?e.appendChild(r):(r||"string"==typeof r)&&e.appendChild(document.createTextNode(r.toString()));}));})}var appendChildrenExports=requireAppendChildren(),appendChildren=getDefaultExportFromCjs(appendChildrenExports);

  /* minified: lib */
  class ConsoleSink{constructor(e){_defineProperty(this,"scriptName",void 0),_defineProperty(this,"onSuccess",this.onInfo.bind(this)),this.scriptName=e;}formatMessage(e){return `[${this.scriptName}] ${e}`}onDebug(e){console.debug(this.formatMessage(e));}onLog(e){console.log(this.formatMessage(e));}onInfo(e){console.info(this.formatMessage(e));}onWarn(e,t){e=this.formatMessage(e),t?console.warn(e,t):console.warn(e);}onError(e,t){e=this.formatMessage(e),t?console.error(e,t):console.error(e);}}let LogLevel=function(e){return e[e.DEBUG=0]="DEBUG",e[e.LOG=1]="LOG",e[e.INFO=2]="INFO",e[e.SUCCESS=3]="SUCCESS",e[e.WARNING=4]="WARNING",e[e.ERROR=5]="ERROR",e}({});const HANDLER_NAMES={[LogLevel.DEBUG]:"onDebug",[LogLevel.LOG]:"onLog",[LogLevel.INFO]:"onInfo",[LogLevel.SUCCESS]:"onSuccess",[LogLevel.WARNING]:"onWarn",[LogLevel.ERROR]:"onError"},DEFAULT_OPTIONS={logLevel:LogLevel.INFO,sinks:[]};class Logger{constructor(e){_defineProperty(this,"_configuration",void 0),this._configuration={...DEFAULT_OPTIONS,...e};}fireHandlers(e,t,n){if(!(e<this._configuration.logLevel))for(const r of this._configuration.sinks){const o=r[HANDLER_NAMES[e]];o&&(n?o.call(r,t,n):o.call(r,t));}}debug(e){this.fireHandlers(LogLevel.DEBUG,e);}log(e){this.fireHandlers(LogLevel.LOG,e);}info(e){this.fireHandlers(LogLevel.INFO,e);}success(e){this.fireHandlers(LogLevel.SUCCESS,e);}warn(e,t){this.fireHandlers(LogLevel.WARNING,e,t);}error(e,t){this.fireHandlers(LogLevel.ERROR,e,t);}configure(e){Object.assign(this._configuration,e);}get configuration(){return this._configuration}addSink(e){this._configuration.sinks.push(e);}}const LOGGER=new Logger;var USERSCRIPT_ID="mb_multi_external_links";class AssertionError extends Error{}function assert(e,t){if(!e)throw new AssertionError(t??"Assertion failed")}function assertNonNull(e,t){assert(null!==e,t);}function asyncSleep(e){return new Promise((t=>setTimeout(t,e)))}function retryTimes(e,t,n){return async function t(r){try{return await e()}catch(o){if(r<=1)throw o;return asyncSleep(n).then((()=>t(r-1)))}}(t)}function logFailure(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"An error occurred";return LOGGER.error.bind(LOGGER,e)}function createPersistentCheckbox(e,t,n){return [function(){var t=document.createElement("input");return t.setAttribute("type","checkbox"),t.setAttribute("id",e),t.addEventListener("change",(t=>{t.currentTarget.checked?localStorage.setItem(e,"delete_to_disable"):localStorage.removeItem(e),n(t);})),t.setAttribute("defaultChecked",!!localStorage.getItem(e)),t}.call(this),function(){var n=document.createElement("label");return n.setAttribute("for",e),appendChildren(n,t),n}.call(this)]}function qs(e,t){const n=qsMaybe(e,t);return assertNonNull(n,"Could not find required element"),n}function qsMaybe(e,t){return (t??document).querySelector(e)}function qsa(e,t){return [...(t??document).querySelectorAll(e)]}function onDocumentLoaded(e){"loading"!==document.readyState?e():document.addEventListener("DOMContentLoaded",e);}function onAddEntityDialogLoaded(e,t){null===qsMaybe(".content-loading",e.parentElement)?t():e.addEventListener("load",(()=>{t();}));}const inputValueDescriptor=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,"value");function setInputValue(e,t){let n=!(arguments.length>2&&void 0!==arguments[2])||arguments[2];inputValueDescriptor.set.call(e,t),n&&e.dispatchEvent(new Event("input",{bubbles:true}));}function onDOMNodeAdded(e,t,n){var r;const o=(null===(r=e.ownerDocument)||void 0===r||null===(r=r.defaultView)||void 0===r?void 0:r.HTMLElement)??HTMLElement;new MutationObserver((e=>{for(const r of e.flatMap((e=>[...e.addedNodes])))if(r instanceof o){r.matches(t)&&n(r);for(const e of qsa(t,r))n(e);}})).observe(e,{subtree:true,childList:true});}function insertStylesheet(e,t){if(t??=`ROpdebee_${USERSCRIPT_ID}_css`,null!==qsMaybe(`style#${t}`))return;const n=function(){var n=document.createElement("style");return n.setAttribute("id",t),appendChildren(n,e),n}.call(this);document.head.insertAdjacentElement("beforeend",n);}function parseVersion(e){return e.split(".").map((e=>Number.parseInt(e)))}function versionLessThan(e,t){let n=0;for(;n<e.length&&n<t.length;){if(e[n]<t[n])return  true;if(e[n]>t[n])return  false;n++;}return e.length<t.length}var CHANGELOG_URL="https://github.com/ROpdebee/mb-userscripts/blob/dist/mb_multi_external_links.changelog.md",USERSCRIPT_FEATURE_HISTORY=[],css_248z=".ROpdebee_feature_list{font-weight:300;margin:0 auto;width:-moz-fit-content;width:fit-content}.ROpdebee_feature_list ul{margin:6px 28px 0 0;text-align:left}";const LAST_DISPLAYED_KEY=`ROpdebee_${USERSCRIPT_ID}_last_notified_update`;function maybeDisplayNewFeatures(){const e=localStorage.getItem(LAST_DISPLAYED_KEY),t=GM.info.script;if(!e)return void localStorage.setItem(LAST_DISPLAYED_KEY,t.version);const n=parseVersion(e),r=USERSCRIPT_FEATURE_HISTORY.filter((e=>versionLessThan(n,parseVersion(e.versionAdded))));0!==r.length&&showFeatureNotification(t.name,t.version,r.map((e=>e.description)));}function showFeatureNotification(e,t,n){insertStylesheet(css_248z,"ROpdebee_Update_Banner");const r=function(){var o=document.createElement("div");o.setAttribute("class","banner warning-header");var s=document.createElement("p");o.appendChild(s),appendChildren(s,`${e} was updated to v${t}! `);var i=document.createElement("a");i.setAttribute("href",CHANGELOG_URL),s.appendChild(i);var a=document.createTextNode("See full changelog here");i.appendChild(a);var l=document.createTextNode(". New features since last update:");s.appendChild(l);var c=document.createElement("div");c.setAttribute("class","ROpdebee_feature_list"),o.appendChild(c);var d=document.createElement("ul");c.appendChild(d),appendChildren(d,n.map((e=>function(){var t=document.createElement("li");return appendChildren(t,e),t}.call(this))));var u=document.createElement("button");return u.setAttribute("class","dismiss-banner remove-item icon"),u.setAttribute("data-banner-name","alert"),u.setAttribute("type","button"),u.addEventListener("click",(()=>{r.remove(),localStorage.setItem(LAST_DISPLAYED_KEY,GM.info.script.version);})),o.appendChild(u),o}.call(this);qs("#page").insertAdjacentElement("beforebegin",r);}

  LOGGER.configure({
      logLevel: LogLevel.INFO,
  });
  LOGGER.addSink(new ConsoleSink(USERSCRIPT_ID));

  if (document.location.hostname === 'musicbrainz.org' || document.location.hostname.endsWith('.musicbrainz.org')) {
      onDocumentLoaded(maybeDisplayNewFeatures);
  }

  class ExternalLinksEditor {
    constructor(element) {
      _defineProperty(this, "element", void 0);
      this.element = element;
    }
    static async create(thisWindow) {
      const editor = await retryTimes(() => qs('#external-links-editor', thisWindow.document), 100, 50);
      return new ExternalLinksEditor(editor);
    }
    get urlInput() {
      return qs('tr:last-child input[type="url"]', this.element);
    }
  }
  class LinkSplitter {
    constructor(editor) {
      _defineProperty(this, "editor", void 0);
      _defineProperty(this, "enabled", false);
      _defineProperty(this, "hookedInputs", new Set());
      this.editor = editor;
      this.hookInput(editor.urlInput);
      onDOMNodeAdded(editor.element, 'tr input[type="url"]', this.hookInput.bind(this));
    }
    hookInput(input) {
      LOGGER.debug(`Hooking input ${input.dataset.index}`);
      if (this.hookedInputs.has(input)) return;
      input.addEventListener('input', this.handleInput.bind(this));
      this.hookedInputs.add(input);
    }
    handleInput(event) {
      if (!this.enabled) return;
      const thisInput = event.target;
      const rawUrl = thisInput.value;
      LOGGER.debug(`onchange received URLs ${rawUrl}`);
      const splitUrls = rawUrl.split(/\s+/);
      if (splitUrls.length <= 1) return;
      this.submitUrls(splitUrls, thisInput).catch(logFailure('Something went wrong.'));
    }
    async submitUrls(urls, currentInput) {
      for (const url of urls) {
        LOGGER.debug(`Submitting URL ${url} into input ${currentInput.dataset.index}`);
        setInputValue(currentInput, url);
        currentInput.focus();
        await asyncSleep();
        currentInput = this.editor.urlInput;
        assert(currentInput.value === '', 'Expected input element to be empty!');
      }
    }
    toggle() {
      this.enabled = !this.enabled;
    }
    setEnabled(enabled) {
      this.enabled = enabled;
    }
  }
  function insertCheckboxElements(editor, checkboxElement, labelElement) {
    var _lastInput$parentElem;
    editor.element.after(checkboxElement, labelElement);
    const lastInput = editor.urlInput;
    const marginLeft = lastInput.offsetLeft + (((_lastInput$parentElem = lastInput.parentElement) === null || _lastInput$parentElem === void 0 ? void 0 : _lastInput$parentElem.offsetLeft) ?? 0);
    checkboxElement.style.marginLeft = `${marginLeft}px`;
  }
  async function run(windowInstance) {
    const editorContainer = qsMaybe('#external-links-editor-container', windowInstance.document);
    if (!editorContainer) return;
    const editor = await ExternalLinksEditor.create(windowInstance);
    const splitter = new LinkSplitter(editor);
    const [checkboxElement, labelElement] = createPersistentCheckbox('ROpdebee_multi_links_no_split', "Don't split links", () => {
      splitter.toggle();
    });
    splitter.setEnabled(!checkboxElement.checked);
    insertCheckboxElements(editor, checkboxElement, labelElement);
  }
  const INIT_IFRAMES = new Set();
  function injectIntoIframe(iframe) {
    if (INIT_IFRAMES.has(iframe)) return;
    INIT_IFRAMES.add(iframe);
    LOGGER.debug(`Initialising on iframe ${iframe.src}`);
    onAddEntityDialogLoaded(iframe, () => {
      LOGGER.debug(`Iframe ${iframe.src} initialized`);
      run(iframe.contentWindow).catch(logFailure());
    });
  }
  run(window).catch(logFailure());
  onDOMNodeAdded(document, '.iframe-dialog iframe', injectIntoIframe);

})();
