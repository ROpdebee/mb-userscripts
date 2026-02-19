// ==UserScript==
// @name         MB: QoL: Paste multiple external links at once
// @description  Enables pasting multiple links, separated by whitespace, into the external link editor.
// @version      2026.2.19
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

  /* minified: svg-tag-names, dom-chef */
  const svgTagNames=["a","altGlyph","altGlyphDef","altGlyphItem","animate","animateColor","animateMotion","animateTransform","animation","audio","canvas","circle","clipPath","color-profile","cursor","defs","desc","discard","ellipse","feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence","filter","font","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignObject","g","glyph","glyphRef","handler","hkern","iframe","image","line","linearGradient","listener","marker","mask","metadata","missing-glyph","mpath","path","pattern","polygon","polyline","prefetch","radialGradient","rect","script","set","solidColor","stop","style","svg","switch","symbol","tbreak","text","textArea","textPath","title","tref","tspan","unknown","use","video","view","vkern"],svgTags=new Set(svgTagNames);svgTags.delete("a"),svgTags.delete("audio"),svgTags.delete("canvas"),svgTags.delete("iframe"),svgTags.delete("script"),svgTags.delete("video");const IS_NON_DIMENSIONAL=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,isFragment=e=>e===DocumentFragment,setCSSProps=(e,t)=>{for(const[a,r]of Object.entries(t))a.startsWith("-")?e.style.setProperty(a,r):"number"!=typeof r||IS_NON_DIMENSIONAL.test(a)?e.style[a]=r:e.style[a]=`${r}px`;},create=e=>"string"==typeof e?svgTags.has(e)?document.createElementNS("http://www.w3.org/2000/svg",e):document.createElement(e):isFragment(e)?document.createDocumentFragment():e(e.defaultProps),setAttribute=(e,t,a)=>{null!=a&&(/^xlink[AHRST]/.test(t)?e.setAttributeNS("http://www.w3.org/1999/xlink",t.replace("xlink","xlink:").toLowerCase(),a):e.setAttribute(t,a));},addChildren=(e,t)=>{for(const a of t)a instanceof Node?e.appendChild(a):Array.isArray(a)?addChildren(e,a):"boolean"!=typeof a&&null!=a&&e.appendChild(document.createTextNode(a));},booleanishAttributes=new Set(["contentEditable","draggable","spellCheck","value","autoReverse","externalResourcesRequired","focusable","preserveAlpha"]),h=function(e,t){var a;const r=create(e);for(var n=arguments.length,s=new Array(n>2?n-2:0),o=2;o<n;o++)s[o-2]=arguments[o];if(addChildren(r,s),r instanceof DocumentFragment||!t)return r;for(let[e,n]of Object.entries(t))if("htmlFor"===e&&(e="for"),"class"===e||"className"===e){const e=null!==(a=r.getAttribute("class"))&&void 0!==a?a:"";setAttribute(r,"class",(e+" "+String(n)).trim());}else if("style"===e)setCSSProps(r,n);else if(e.startsWith("on")){const t=e.slice(2).toLowerCase().replace(/^-/,"");r.addEventListener(t,n);}else "dangerouslySetInnerHTML"===e&&"__html"in n?r.innerHTML=n.__html:"key"===e||!booleanishAttributes.has(e)&&false===n||setAttribute(r,e,true===n?"":n);return r};

  /* minified: lib */
  class ConsoleSink{constructor(e){this.scriptName=e;}formatMessage(e){return `[${this.scriptName}] ${e}`}onDebug(e){console.debug(this.formatMessage(e));}onLog(e){console.log(this.formatMessage(e));}onInfo(e){console.info(this.formatMessage(e));}onSuccess=this.onInfo.bind(this);onWarn(e,t){e=this.formatMessage(e),t?console.warn(e,t):console.warn(e);}onError(e,t){e=this.formatMessage(e),t?console.error(e,t):console.error(e);}}let LogLevel=function(e){return e[e.DEBUG=0]="DEBUG",e[e.LOG=1]="LOG",e[e.INFO=2]="INFO",e[e.SUCCESS=3]="SUCCESS",e[e.WARNING=4]="WARNING",e[e.ERROR=5]="ERROR",e}({});const HANDLER_NAMES={[LogLevel.DEBUG]:"onDebug",[LogLevel.LOG]:"onLog",[LogLevel.INFO]:"onInfo",[LogLevel.SUCCESS]:"onSuccess",[LogLevel.WARNING]:"onWarn",[LogLevel.ERROR]:"onError"},DEFAULT_OPTIONS={logLevel:LogLevel.INFO,sinks:[]};class Logger{constructor(e){this._configuration={...DEFAULT_OPTIONS,...e};}fireHandlers(e,t,n){if(!(e<this._configuration.logLevel))for(const o of this._configuration.sinks){const r=o[HANDLER_NAMES[e]];r&&(n?r.call(o,t,n):r.call(o,t));}}debug(e){this.fireHandlers(LogLevel.DEBUG,e);}log(e){this.fireHandlers(LogLevel.LOG,e);}info(e){this.fireHandlers(LogLevel.INFO,e);}success(e){this.fireHandlers(LogLevel.SUCCESS,e);}warn(e,t){this.fireHandlers(LogLevel.WARNING,e,t);}error(e,t){this.fireHandlers(LogLevel.ERROR,e,t);}configure(e){Object.assign(this._configuration,e);}get configuration(){return this._configuration}addSink(e){this._configuration.sinks.push(e);}}const LOGGER=new Logger;var USERSCRIPT_ID="mb_multi_external_links";class AssertionError extends Error{}function assert(e,t){if(!e)throw new AssertionError(t??"Assertion failed")}function assertNonNull(e,t){assert(null!==e,t);}function asyncSleep(e){return new Promise(t=>setTimeout(t,e))}function retryTimes(e,t,n){return async function t(o){try{return await e()}catch(e){if(o<=1)throw e;return asyncSleep(n).then(()=>t(o-1))}}(t)}function logFailure(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"An error occurred";return LOGGER.error.bind(LOGGER,e)}function createPersistentCheckbox(e,t,n){return [h("input",{type:"checkbox",id:e,onChange:t=>{t.currentTarget.checked?localStorage.setItem(e,"delete_to_disable"):localStorage.removeItem(e),n(t);},defaultChecked:!!localStorage.getItem(e)}),h("label",{htmlFor:e},t)]}function qs(e,t){const n=qsMaybe(e,t);return assertNonNull(n,"Could not find required element"),n}function qsMaybe(e,t){return (t??document).querySelector(e)}function qsa(e,t){return [...(t??document).querySelectorAll(e)]}function onDocumentLoaded(e){"loading"!==document.readyState?e():document.addEventListener("DOMContentLoaded",e);}function onAddEntityDialogLoaded(e,t){null===qsMaybe(".content-loading",e.parentElement)?t():e.addEventListener("load",()=>{t();});}const inputValueDescriptor=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,"value");function setInputValue(e,t){let n=!(arguments.length>2&&void 0!==arguments[2])||arguments[2];inputValueDescriptor.set.call(e,t),n&&e.dispatchEvent(new Event("input",{bubbles:true}));}function onDOMNodeAdded(e,t,n){const o=e.ownerDocument?.defaultView?.HTMLElement??HTMLElement;new MutationObserver(e=>{for(const r of e.flatMap(e=>[...e.addedNodes]))if(r instanceof o){r.matches(t)&&n(r);for(const e of qsa(t,r))n(e);}}).observe(e,{subtree:true,childList:true});}function insertStylesheet(e,t){if(t??=`ROpdebee_${USERSCRIPT_ID}_css`,null!==qsMaybe(`style#${t}`))return;const n=h("style",{id:t},e);document.head.insertAdjacentElement("beforeend",n);}function parseVersion(e){return e.split(".").map(e=>Number.parseInt(e))}function versionLessThan(e,t){let n=0;for(;n<e.length&&n<t.length;){if(e[n]<t[n])return  true;if(e[n]>t[n])return  false;n++;}return e.length<t.length}var CHANGELOG_URL="https://github.com/ROpdebee/mb-userscripts/blob/dist/mb_multi_external_links.changelog.md",USERSCRIPT_FEATURE_HISTORY=[];const banner=".ROpdebee_feature_list{width:-moz-fit-content;width:fit-content;margin:0 auto;font-weight:300}.ROpdebee_feature_list ul{text-align:left;margin:6px 28px 0 0}",LAST_DISPLAYED_KEY=`ROpdebee_${USERSCRIPT_ID}_last_notified_update`;function maybeDisplayNewFeatures(){const e=localStorage.getItem(LAST_DISPLAYED_KEY),t=GM.info.script;if(!e)return void localStorage.setItem(LAST_DISPLAYED_KEY,t.version);const n=parseVersion(e),o=USERSCRIPT_FEATURE_HISTORY.filter(e=>versionLessThan(n,parseVersion(e.versionAdded)));0!==o.length&&showFeatureNotification(t.name,t.version,o.map(e=>e.description));}function showFeatureNotification(e,t,n){insertStylesheet(banner,"ROpdebee_Update_Banner");const o=h("div",{className:"banner warning-header"},h("p",null,`${e} was updated to v${t}! `,h("a",{href:CHANGELOG_URL},"See full changelog here"),". New features since last update:"),h("div",{className:"ROpdebee_feature_list"},h("ul",null,n.map(e=>h("li",null,e)))),h("button",{className:"dismiss-banner remove-item icon","data-banner-name":"alert",type:"button",onClick:()=>{o.remove(),localStorage.setItem(LAST_DISPLAYED_KEY,GM.info.script.version);}}));qs("#page").insertAdjacentElement("beforebegin",o);}

  LOGGER.configure({
      logLevel: LogLevel.INFO,
  });
  LOGGER.addSink(new ConsoleSink(USERSCRIPT_ID));

  if (document.location.hostname === 'musicbrainz.org' || document.location.hostname.endsWith('.musicbrainz.org')) {
      onDocumentLoaded(maybeDisplayNewFeatures);
  }

  class ExternalLinksEditor {
    constructor(element) {
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
    enabled = false;
    hookedInputs = (() => new Set())();
    constructor(editor) {
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
    editor.element.after(checkboxElement, labelElement);
    const lastInput = editor.urlInput;
    const marginLeft = lastInput.offsetLeft + (lastInput.parentElement?.offsetLeft ?? 0);
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
