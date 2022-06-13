// ==UserScript==
// @name         MB: QoL: Paste multiple external links at once
// @description  Enables pasting multiple links, separated by whitespace, into the external link editor.
// @version      2022.6.13
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

  /* minified: babel helpers, babel-plugin-transform-async-to-promises, nativejsx */
  function ownKeys(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n);}return r}function _objectSpread2(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?ownKeys(Object(r),!0).forEach((function(e){_defineProperty(t,e,r[e]);})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):ownKeys(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e));}));}return t}function _defineProperty(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function _slicedToArray(t,e){return _arrayWithHoles(t)||_iterableToArrayLimit(t,e)||_unsupportedIterableToArray(t,e)||_nonIterableRest()}function _arrayWithHoles(t){if(Array.isArray(t))return t}function _iterableToArrayLimit(t,e){var r=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=r){var n,o,i=[],l=!0,a=!1;try{for(r=r.call(t);!(l=(n=r.next()).done)&&(i.push(n.value),!e||i.length!==e);l=!0);}catch(u){a=!0,o=u;}finally{try{l||null==r.return||r.return();}finally{if(a)throw o}}return i}}function _unsupportedIterableToArray(t,e){if(t){if("string"==typeof t)return _arrayLikeToArray(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);return "Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?_arrayLikeToArray(t,e):void 0}}function _arrayLikeToArray(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _createForOfIteratorHelper(t,e){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!r){if(Array.isArray(t)||(r=_unsupportedIterableToArray(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,o=function(){};return {s:o,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,l=!0,a=!1;return {s:function(){r=r.call(t);},n:function(){var t=r.next();return l=t.done,t},e:function(t){a=!0,i=t;},f:function(){try{l||null==r.return||r.return();}finally{if(a)throw i}}}}const _Pact=function(){function t(){}return t.prototype.then=function(e,r){const n=new t,o=this.s;if(o){const t=1&o?e:r;if(t){try{_settle(n,1,t(this.v));}catch(i){_settle(n,2,i);}return n}return this}return this.o=function(t){try{const o=t.v;1&t.s?_settle(n,1,e?e(o):o):r?_settle(n,1,r(o)):_settle(n,2,o);}catch(i){_settle(n,2,i);}},n},t}();function _settle(t,e,r){if(!t.s){if(r instanceof _Pact){if(!r.s)return void(r.o=_settle.bind(null,t,e));1&e&&(e=r.s),r=r.v;}if(r&&r.then)return void r.then(_settle.bind(null,t,e),_settle.bind(null,t,2));t.s=e,t.v=r;const n=t.o;n&&n(t);}}function _async(t){return function(){for(var e=[],r=0;r<arguments.length;r++)e[r]=arguments[r];try{return Promise.resolve(t.apply(this,e))}catch(n){return Promise.reject(n)}}}function _await(t,e,r){return r?e?e(t):t:(t&&t.then||(t=Promise.resolve(t)),e?t.then(e):t)}"undefined"==typeof Symbol||Symbol.iterator||(Symbol.iterator=Symbol("Symbol.iterator"));const _asyncIteratorSymbol="undefined"!=typeof Symbol?Symbol.asyncIterator||(Symbol.asyncIterator=Symbol("Symbol.asyncIterator")):"@@asyncIterator";function _catch(t,e){try{var r=t();}catch(n){return e(n)}return r&&r.then?r.then(void 0,e):r}const _earlyReturn={};!function(){function t(t){this._entry=t,this._pact=null,this._resolve=null,this._return=null,this._promise=null;}function e(t){return {value:t,done:!0}}function r(t){return {value:t,done:!1}}t.prototype._yield=function(t){return this._resolve(t&&t.then?t.then(r):r(t)),this._pact=new _Pact},t.prototype.next=function(t){const r=this;return r._promise=new Promise((function(n){const o=r._pact;if(null===o){const a=r._entry;if(null===a)return n(r._promise);function i(t){r._resolve(t&&t.then?t.then(e):e(t)),r._pact=null,r._resolve=null;}r._entry=null,r._resolve=n;var l=a(r);l&&l.then?l.then(i,(function(t){if(t===_earlyReturn)i(r._return);else {const e=new _Pact;r._resolve(e),r._pact=null,r._resolve=null,_resolve(e,2,t);}})):i(l);}else r._pact=null,r._resolve=n,_settle(o,1,t);}))},t.prototype.return=function(t){const r=this;return r._promise=new Promise((function(n){const o=r._pact;if(null===o)return null===r._entry?n(r._promise):(r._entry=null,n(t&&t.then?t.then(e):e(t)));r._return=t,r._resolve=n,r._pact=null,_settle(o,2,_earlyReturn);}))},t.prototype.throw=function(t){const e=this;return e._promise=new Promise((function(r,n){const o=e._pact;if(null===o)return null===e._entry?r(e._promise):(e._entry=null,n(t));e._resolve=r,e._pact=null,_settle(o,2,t);}))},t.prototype[_asyncIteratorSymbol]=function(){return this};}();var appendChildren=function(t,e){(e=Array.isArray(e)?e:[e]).forEach((function(e){e instanceof HTMLElement?t.appendChild(e):(e||"string"==typeof e)&&t.appendChild(document.createTextNode(e.toString()));}));};

  /* minified: lib */
  class ConsoleSink{constructor(e){_defineProperty(this,"scriptName",void 0),_defineProperty(this,"onSuccess",this.onInfo.bind(this)),this.scriptName=e;}formatMessage(e){return "[".concat(this.scriptName,"] ").concat(e)}onDebug(e){console.debug(this.formatMessage(e));}onLog(e){console.log(this.formatMessage(e));}onInfo(e){console.info(this.formatMessage(e));}onWarn(e,t){e=this.formatMessage(e),t?console.warn(e,t):console.warn(e);}onError(e,t){e=this.formatMessage(e),t?console.error(e,t):console.error(e);}}let LogLevel;!function(e){e[e.DEBUG=0]="DEBUG",e[e.LOG=1]="LOG",e[e.INFO=2]="INFO",e[e.SUCCESS=3]="SUCCESS",e[e.WARNING=4]="WARNING",e[e.ERROR=5]="ERROR";}(LogLevel||(LogLevel={}));const HANDLER_NAMES={[LogLevel.DEBUG]:"onDebug",[LogLevel.LOG]:"onLog",[LogLevel.INFO]:"onInfo",[LogLevel.SUCCESS]:"onSuccess",[LogLevel.WARNING]:"onWarn",[LogLevel.ERROR]:"onError"},DEFAULT_OPTIONS={logLevel:LogLevel.INFO,sinks:[]};class Logger{constructor(e){_defineProperty(this,"_configuration",void 0),this._configuration=_objectSpread2(_objectSpread2({},DEFAULT_OPTIONS),e);}fireHandlers(e,t,n){e<this._configuration.logLevel||this._configuration.sinks.forEach((r=>{const o=r[HANDLER_NAMES[e]];o&&(n?o.call(r,t,n):o.call(r,t));}));}debug(e){this.fireHandlers(LogLevel.DEBUG,e);}log(e){this.fireHandlers(LogLevel.LOG,e);}info(e){this.fireHandlers(LogLevel.INFO,e);}success(e){this.fireHandlers(LogLevel.SUCCESS,e);}warn(e,t){this.fireHandlers(LogLevel.WARNING,e,t);}error(e,t){this.fireHandlers(LogLevel.ERROR,e,t);}configure(e){Object.assign(this._configuration,e);}get configuration(){return this._configuration}addSink(e){this._configuration.sinks.push(e);}}const LOGGER=new Logger;class AssertionError extends Error{}function assert(e,t){if(!e)throw new AssertionError(null!=t?t:"Assertion failed")}function assertDefined(e,t){assert(void 0!==e,null!=t?t:"Assertion failed: Expected value to be defined");}function assertNonNull(e,t){assert(null!==e,null!=t?t:"Assertion failed: Expected value to be non-null");}function asyncSleep(e){return new Promise((t=>setTimeout(t,e)))}function retryTimes(e,t,n){const r=_async((function(t){return _catch(e,(function(e){if(t<=1)throw e;return asyncSleep(n).then((()=>r(t-1)))}))}));return t<=0?Promise.reject(new TypeError("Invalid number of retry times: ".concat(t))):r(t)}function logFailure(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"An error occurred";e.catch((e=>{LOGGER.error(t,e);}));}function createPersistentCheckbox(e,t,n){return [function(){var t=document.createElement("input");return t.setAttribute("type","checkbox"),t.setAttribute("id",e),t.addEventListener("change",(t=>{t.currentTarget.checked?localStorage.setItem(e,"delete_to_disable"):localStorage.removeItem(e),n(t);})),t.setAttribute("defaultChecked",!!localStorage.getItem(e)),t}.call(this),function(){var n=document.createElement("label");return n.setAttribute("for",e),appendChildren(n,t),n}.call(this)]}function qs(e,t){const n=qsMaybe(e,t);return assertNonNull(n,"Could not find required element"),n}function qsMaybe(e,t){return (null!=t?t:document).querySelector(e)}function qsa(e,t){return [...(null!=t?t:document).querySelectorAll(e)]}function onDocumentLoaded(e){"loading"!==document.readyState?e():document.addEventListener("DOMContentLoaded",e);}function onWindowLoaded(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:window;"complete"===t.document.readyState?e():t.addEventListener("load",e);}const inputValueDescriptor=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,"value");function setInputValue(e,t){let n=!(arguments.length>2&&void 0!==arguments[2])||arguments[2];inputValueDescriptor.set.call(e,t),n&&e.dispatchEvent(new Event("input",{bubbles:!0}));}var USERSCRIPT_ID="mb_multi_external_links";function insertStylesheet(e,t){if(void 0===t&&(t="ROpdebee_".concat(USERSCRIPT_ID,"_css")),null!==qsMaybe("style#".concat(t)))return;const n=function(){var n=document.createElement("style");return n.setAttribute("id",t),appendChildren(n,e),n}.call(this);document.head.insertAdjacentElement("beforeend",n);}function parseVersion(e){return e.split(".").map((e=>parseInt(e)))}function versionLessThan(e,t){let n=0;for(;n<e.length&&n<t.length;){if(e[n]<t[n])return !0;if(e[n]>t[n])return !1;n++;}return e.length<t.length}var CHANGELOG_URL="https://github.com/ROpdebee/mb-userscripts/blob/dist/mb_multi_external_links.changelog.md",USERSCRIPT_FEATURE_HISTORY=[],css_248z=".ROpdebee_feature_list{font-weight:300;margin:0 auto;width:-moz-fit-content;width:fit-content}.ROpdebee_feature_list ul{margin:6px 28px 0 0;text-align:left}";const LAST_DISPLAYED_KEY="ROpdebee_".concat(USERSCRIPT_ID,"_last_notified_update");function maybeDisplayNewFeatures(){const e=localStorage.getItem(LAST_DISPLAYED_KEY),t=GM.info.script;if(!e)return void localStorage.setItem(LAST_DISPLAYED_KEY,t.version);const n=parseVersion(e),r=USERSCRIPT_FEATURE_HISTORY.filter((e=>versionLessThan(n,parseVersion(e.versionAdded))));0!==r.length&&showFeatureNotification(t.name,t.version,r.map((e=>e.description)));}function showFeatureNotification(e,t,n){insertStylesheet(css_248z,"ROpdebee_Update_Banner");const r=function(){var o=document.createElement("div");o.setAttribute("class","banner warning-header");var s=document.createElement("p");o.appendChild(s),appendChildren(s,"".concat(e," was updated to v").concat(t,"! "));var a=document.createElement("a");a.setAttribute("href",CHANGELOG_URL),s.appendChild(a);var i=document.createTextNode("See full changelog here");a.appendChild(i),appendChildren(s,". New features since last update:");var l=document.createElement("div");l.setAttribute("class","ROpdebee_feature_list"),o.appendChild(l);var c=document.createElement("ul");l.appendChild(c),appendChildren(c,n.map((e=>function(){var t=document.createElement("li");return appendChildren(t,e),t}.call(this))));var u=document.createElement("button");return u.setAttribute("class","dismiss-banner remove-item icon"),u.setAttribute("data-banner-name","alert"),u.setAttribute("type","button"),u.addEventListener("click",(()=>{r.remove(),localStorage.setItem(LAST_DISPLAYED_KEY,GM.info.script.version);})),o.appendChild(u),o}.call(this);qs("#page").insertAdjacentElement("beforebegin",r);}

  if (document.location.hostname === 'musicbrainz.org' || document.location.hostname.endsWith('.musicbrainz.org')) {
      onDocumentLoaded(maybeDisplayNewFeatures);
  }

  function getExternalLinksEditor(mbInstance) {
    var _ref, _mbInstance$releaseEd, _mbInstance$releaseEd2;

    const editor = (_ref = (_mbInstance$releaseEd = (_mbInstance$releaseEd2 = mbInstance.releaseEditor) === null || _mbInstance$releaseEd2 === void 0 ? void 0 : _mbInstance$releaseEd2.externalLinks) !== null && _mbInstance$releaseEd !== void 0 ? _mbInstance$releaseEd : mbInstance.sourceExternalLinksEditor) === null || _ref === void 0 ? void 0 : _ref.current;
    assertDefined(editor, 'Cannot find external links editor object');
    return editor;
  }

  function getLastInput(editor) {
    const linkInputs = qsa('input.value', editor.tableRef.current);
    return linkInputs[linkInputs.length - 1];
  }

  function submitUrls(editor, urls) {
    if (urls.length === 0) return;
    const lastInput = getLastInput(editor);
    LOGGER.debug("Submitting URL ".concat(urls[0]));
    setInputValue(lastInput, urls[0]);
    setTimeout(() => {
      lastInput.dispatchEvent(new Event('focusout', {
        bubbles: true
      }));
      submitUrls(editor, urls.slice(1));
    });
  }

  const run = _async(function (windowInstance) {
    const editorContainer = qsMaybe('#external-links-editor-container', windowInstance.document);
    if (!editorContainer) return;
    return _await(retryTimes(() => getExternalLinksEditor(windowInstance.MB), 100, 50), function (editor) {
      const splitter = createLinkSplitter(editor);

      const _createPersistentChec = createPersistentCheckbox('ROpdebee_multi_links_no_split', "Don't split links", () => {
        splitter.toggle();
      }),
            _createPersistentChec2 = _slicedToArray(_createPersistentChec, 2),
            checkboxElmt = _createPersistentChec2[0],
            labelElmt = _createPersistentChec2[1];

      splitter.setEnabled(!checkboxElmt.checked);
      insertCheckboxElements(editor, checkboxElmt, labelElmt);
    });
  });

  const Patcher = {
    urlQueue: [],

    patchOnBlur(editor, originalOnBlur) {
      var _this = this;

      return function () {
        originalOnBlur(...arguments);
        submitUrls(editor, _this.urlQueue);
        _this.urlQueue = [];
      };
    },

    patchOnChange(originalOnBlur) {
      var _this2 = this;

      return function () {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        const rawUrl = args[2];
        LOGGER.debug("onchange received URLs ".concat(rawUrl));
        args = [...args];

        try {
          const splitUrls = rawUrl.trim().split(/\s+/);
          _this2.urlQueue = splitUrls.slice(1);

          if (splitUrls.length > 1) {
            args[2] = splitUrls[0];
          }
        } catch (err) {
          LOGGER.error('Something went wrong. onUrlBlur signature change?', err);
        }

        originalOnBlur(...args);
      };
    }

  };

  function createLinkSplitter(editor) {
    const originalOnBlur = editor.handleUrlBlur.bind(editor);
    const originalOnChange = editor.handleUrlChange.bind(editor);
    const patchedOnBlur = Patcher.patchOnBlur(editor, originalOnBlur);
    const patchedOnChange = Patcher.patchOnChange(originalOnChange);
    return {
      enable() {
        LOGGER.debug('Enabling link splitter');
        editor.handleUrlBlur = patchedOnBlur;
        editor.handleUrlChange = patchedOnChange;
      },

      disable() {
        LOGGER.debug('Disabling link splitter');
        editor.handleUrlBlur = originalOnBlur;
        editor.handleUrlChange = originalOnChange;
      },

      setEnabled(enabled) {
        if (enabled) {
          this.enable();
        } else {
          this.disable();
        }
      },

      toggle() {
        this.setEnabled(editor.handleUrlBlur === originalOnBlur);
      }

    };
  }

  function insertCheckboxElements(editor, checkboxElmt, labelElmt) {
    var _lastInput$parentElem, _lastInput$parentElem2;

    editor.tableRef.current.after(checkboxElmt, labelElmt);
    const lastInput = getLastInput(editor);
    const marginLeft = lastInput.offsetLeft + ((_lastInput$parentElem = (_lastInput$parentElem2 = lastInput.parentElement) === null || _lastInput$parentElem2 === void 0 ? void 0 : _lastInput$parentElem2.offsetLeft) !== null && _lastInput$parentElem !== void 0 ? _lastInput$parentElem : 0);
    checkboxElmt.style.marginLeft = "".concat(marginLeft, "px");
  }

  function onIframeAdded(iframe) {
    LOGGER.debug("Initialising on iframe ".concat(iframe.src));
    const iframeWindow = iframe.contentWindow;
    if (!iframeWindow) return;
    onWindowLoaded(() => {
      logFailure(run(iframeWindow));
    }, iframeWindow);
  }

  function listenForIframes() {
    const iframeObserver = new MutationObserver(mutations => {
      var _iterator = _createForOfIteratorHelper(mutations.flatMap(mut => [...mut.addedNodes])),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          const addedNode = _step.value;

          if (addedNode instanceof HTMLElement && addedNode.classList.contains('iframe-dialog')) {
            const iframe = qsMaybe('iframe', addedNode);

            if (iframe) {
              onIframeAdded(iframe);
            }
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    });
    iframeObserver.observe(document, {
      subtree: true,
      childList: true
    });
  }

  LOGGER.configure({
    logLevel: LogLevel.INFO
  });
  LOGGER.addSink(new ConsoleSink(USERSCRIPT_ID));
  logFailure(run(window));
  listenForIframes();

})();
