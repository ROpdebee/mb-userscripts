// ==UserScript==
// @name         MB: Enhanced Cover Art Uploads
// @description  Enhance the cover art uploader! Upload directly from a URL, automatically import covers from Discogs/Spotify/Apple Music/..., automatically retrieve the largest version, and more!
// @version      2026.2.21
// @author       ROpdebee
// @license      MIT; https://opensource.org/licenses/MIT
// @namespace    https://github.com/ROpdebee/mb-userscripts
// @homepageURL  https://github.com/ROpdebee/mb-userscripts
// @supportURL   https://github.com/ROpdebee/mb-userscripts/issues
// @downloadURL  https://raw.github.com/ROpdebee/mb-userscripts/dist/mb_enhanced_cover_art_uploads.user.js
// @updateURL    https://raw.github.com/ROpdebee/mb-userscripts/dist/mb_enhanced_cover_art_uploads.meta.js
// @match        *://*.musicbrainz.org/release/*/add-cover-art
// @match        *://*.musicbrainz.org/release/*/add-cover-art?*
// @match        *://*.musicbrainz.org/release/*/cover-art
// @match        *://*.musicbrainz.org/event/*/add-event-art
// @match        *://*.musicbrainz.org/event/*/add-event-art?*
// @match        *://atisket.pulsewidth.org.uk/*
// @match        *://etc.marlonob.info/atisket/*
// @match        *://harmony.pulsewidth.org.uk/release/actions?*
// @match        *://vgmdb.net/album/*
// @exclude      *://atisket.pulsewidth.org.uk/
// @require      https://github.com/qsniyg/maxurl/blob/db61f498677c6b0073c2e7fbf8afe745f7b994e7/userscript.user.js?raw=true
// @resource     amazonFavicon https://www.amazon.com/favicon.ico
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        GM_getResourceURL
// @grant        GM.getResourceUrl
// @grant        GM.getResourceURL
// @grant        GM_getValue
// @grant        GM.getValue
// @grant        GM_setValue
// @grant        GM.setValue
// @grant        GM_deleteValue
// @grant        GM.deleteValue
// @connect      *
// ==/UserScript==

// For original source code, see https://github.com/ROpdebee/mb-userscripts/tree/main/src/mb_enhanced_cover_art_uploads
(function () {
  'use strict';

  /* minified: yocto-queue, p-limit, svg-tag-names, dom-chef, ts-custom-error, is-network-error, p-retry */
  let Node$1=class{constructor(e){this.value=e;}};class Queue{#e;#t;#r;constructor(){this.clear();}enqueue(e){const t=new Node$1(e);this.#e?(this.#t.next=t,this.#t=t):(this.#e=t,this.#t=t),this.#r++;}dequeue(){const e=this.#e;if(e)return this.#e=this.#e.next,this.#r--,this.#e||(this.#t=void 0),e.value}peek(){if(this.#e)return this.#e.value}clear(){this.#e=void 0,this.#t=void 0,this.#r=0;}get size(){return this.#r}*[Symbol.iterator](){let e=this.#e;for(;e;)yield e.value,e=e.next;}*drain(){for(;this.#e;)yield this.dequeue();}}function pLimit(e){let t=false;if("object"==typeof e&&({concurrency:e,rejectOnClear:t=false}=e),validateConcurrency(e),"boolean"!=typeof t)throw new TypeError("Expected `rejectOnClear` to be a boolean");const r=new Queue;let o=0;const n=()=>{o<e&&r.size>0&&(o++,r.dequeue().run());},i=async(e,t,r)=>{const i=(async()=>e(...r))();t(i);try{await i;}catch{}o--,n();},a=function(t){for(var a=arguments.length,s=new Array(a>1?a-1:0),c=1;c<a;c++)s[c-1]=arguments[c];return new Promise((a,c)=>{((t,a,s,c)=>{const l={reject:s};new Promise(e=>{l.run=e,r.enqueue(l);}).then(i.bind(void 0,t,a,c)),o<e&&n();})(t,a,c,s);})};return Object.defineProperties(a,{activeCount:{get:()=>o},pendingCount:{get:()=>r.size},clearQueue:{value(){if(!t)return void r.clear();const e=AbortSignal.abort().reason;for(;r.size>0;)r.dequeue().reject(e);}},concurrency:{get:()=>e,set(t){validateConcurrency(t),e=t,queueMicrotask(()=>{for(;o<e&&r.size>0;)n();});}},map:{async value(e,t){const r=Array.from(e,(e,r)=>this(t,e,r));return Promise.all(r)}}}),a}function validateConcurrency(e){if(!Number.isInteger(e)&&e!==Number.POSITIVE_INFINITY||!(e>0))throw new TypeError("Expected `concurrency` to be a number from 1 and up")}const svgTagNames=["a","altGlyph","altGlyphDef","altGlyphItem","animate","animateColor","animateMotion","animateTransform","animation","audio","canvas","circle","clipPath","color-profile","cursor","defs","desc","discard","ellipse","feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence","filter","font","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignObject","g","glyph","glyphRef","handler","hkern","iframe","image","line","linearGradient","listener","marker","mask","metadata","missing-glyph","mpath","path","pattern","polygon","polyline","prefetch","radialGradient","rect","script","set","solidColor","stop","style","svg","switch","symbol","tbreak","text","textArea","textPath","title","tref","tspan","unknown","use","video","view","vkern"],svgTags=new Set(svgTagNames);svgTags.delete("a"),svgTags.delete("audio"),svgTags.delete("canvas"),svgTags.delete("iframe"),svgTags.delete("script"),svgTags.delete("video");const IS_NON_DIMENSIONAL=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,isFragment=e=>e===DocumentFragment,setCSSProps=(e,t)=>{for(const[r,o]of Object.entries(t))r.startsWith("-")?e.style.setProperty(r,o):"number"!=typeof o||IS_NON_DIMENSIONAL.test(r)?e.style[r]=o:e.style[r]=`${o}px`;},create=e=>"string"==typeof e?svgTags.has(e)?document.createElementNS("http://www.w3.org/2000/svg",e):document.createElement(e):isFragment(e)?document.createDocumentFragment():e(e.defaultProps),setAttribute=(e,t,r)=>{null!=r&&(/^xlink[AHRST]/.test(t)?e.setAttributeNS("http://www.w3.org/1999/xlink",t.replace("xlink","xlink:").toLowerCase(),r):e.setAttribute(t,r));},addChildren=(e,t)=>{for(const r of t)r instanceof Node?e.appendChild(r):Array.isArray(r)?addChildren(e,r):"boolean"!=typeof r&&null!=r&&e.appendChild(document.createTextNode(r));},booleanishAttributes=new Set(["contentEditable","draggable","spellCheck","value","autoReverse","externalResourcesRequired","focusable","preserveAlpha"]),h=function(e,t){var r;const o=create(e);for(var n=arguments.length,i=new Array(n>2?n-2:0),a=2;a<n;a++)i[a-2]=arguments[a];if(addChildren(o,i),o instanceof DocumentFragment||!t)return o;for(let[e,n]of Object.entries(t))if("htmlFor"===e&&(e="for"),"class"===e||"className"===e){const e=null!==(r=o.getAttribute("class"))&&void 0!==r?r:"";setAttribute(o,"class",(e+" "+String(n)).trim());}else if("style"===e)setCSSProps(o,n);else if(e.startsWith("on")){const t=e.slice(2).toLowerCase().replace(/^-/,"");o.addEventListener(t,n);}else "dangerouslySetInnerHTML"===e&&"__html"in n?o.innerHTML=n.__html:"key"===e||!booleanishAttributes.has(e)&&false===n||setAttribute(o,e,true===n?"":n);return o};function fixProto(e,t){var r=Object.setPrototypeOf;r?r(e,t):e.__proto__=t;}function fixStack(e,t){ void 0===t&&(t=e.constructor);var r=Error.captureStackTrace;r&&r(e,t);}var __extends=function(){var e=function(t,r){return e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t;}||function(e,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);},e(t,r)};return function(t,r){if("function"!=typeof r&&null!==r)throw new TypeError("Class extends value "+String(r)+" is not a constructor or null");function o(){this.constructor=t;}e(t,r),t.prototype=null===r?Object.create(r):(o.prototype=r.prototype,new o);}}(),CustomError=function(e){function t(t,r){var o=this.constructor,n=e.call(this,t,r)||this;return Object.defineProperty(n,"name",{value:o.name,enumerable:false,configurable:true}),fixProto(n,o.prototype),fixStack(n),n}return __extends(t,e),t}(Error);const objectToString=Object.prototype.toString,isError=e=>"[object Error]"===objectToString.call(e),errorMessages=new Set(["network error","Failed to fetch","NetworkError when attempting to fetch resource.","The Internet connection appears to be offline.","Network request failed","fetch failed","terminated"," A network error occurred.","Network connection lost"]);function isNetworkError(e){if(!e||!isError(e)||"TypeError"!==e.name||"string"!=typeof e.message)return  false;const{message:t,stack:r}=e;return "Load failed"===t?void 0===r||"__sentry_captured__"in e:!!t.startsWith("error sending request for url")||errorMessages.has(t)}function validateRetries(e){if("number"==typeof e){if(e<0)throw new TypeError("Expected `retries` to be a non-negative number.");if(Number.isNaN(e))throw new TypeError("Expected `retries` to be a valid number or Infinity, got NaN.")}else if(void 0!==e)throw new TypeError("Expected `retries` to be a number or Infinity.")}function validateNumberOption(e,t){let{min:r=0,allowInfinity:o=false}=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};if(void 0!==t){if("number"!=typeof t||Number.isNaN(t))throw new TypeError(`Expected \`${e}\` to be a number${o?" or Infinity":""}.`);if(!o&&!Number.isFinite(t))throw new TypeError(`Expected \`${e}\` to be a finite number.`);if(t<r)throw new TypeError(`Expected \`${e}\` to be ≥ ${r}.`)}}class AbortError extends Error{constructor(e){super(),e instanceof Error?(this.originalError=e,({message:e}=e)):(this.originalError=new Error(e),this.originalError.stack=this.stack),this.name="AbortError",this.message=e;}}function calculateDelay(e,t){const r=Math.max(1,e+1),o=t.randomize?Math.random()+1:1;let n=Math.round(o*t.minTimeout*t.factor**(r-1));return n=Math.min(n,t.maxTimeout),n}function calculateRemainingTime(e,t){return Number.isFinite(t)?t-(performance.now()-e):t}async function onAttemptFailure(e){let{error:t,attemptNumber:r,retriesConsumed:o,startTime:n,options:i}=e;const a=t instanceof Error?t:new TypeError(`Non-error was thrown: "${t}". You should only throw errors.`);if(a instanceof AbortError)throw a.originalError;const s=Number.isFinite(i.retries)?Math.max(0,i.retries-o):i.retries,c=i.maxRetryTime??Number.POSITIVE_INFINITY,l=Object.freeze({error:a,attemptNumber:r,retriesLeft:s,retriesConsumed:o});if(await i.onFailedAttempt(l),calculateRemainingTime(n,c)<=0)throw a;const u=await i.shouldConsumeRetry(l),f=calculateRemainingTime(n,c);if(f<=0||s<=0)throw a;if(a instanceof TypeError&&!isNetworkError(a)){if(u)throw a;return i.signal?.throwIfAborted(),false}if(!await i.shouldRetry(l))throw a;if(!u)return i.signal?.throwIfAborted(),false;const m=calculateDelay(o,i),d=Math.min(m,f);return i.signal?.throwIfAborted(),d>0&&await new Promise((e,t)=>{const r=()=>{clearTimeout(o),i.signal?.removeEventListener("abort",r),t(i.signal.reason);},o=setTimeout(()=>{i.signal?.removeEventListener("abort",r),e();},d);i.unref&&o.unref?.(),i.signal?.addEventListener("abort",r,{once:true});}),i.signal?.throwIfAborted(),true}async function pRetry(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if(t={...t},validateRetries(t.retries),Object.hasOwn(t,"forever"))throw new Error("The `forever` option is no longer supported. For many use-cases, you can set `retries: Infinity` instead.");t.retries??=10,t.factor??=2,t.minTimeout??=1e3,t.maxTimeout??=Number.POSITIVE_INFINITY,t.maxRetryTime??=Number.POSITIVE_INFINITY,t.randomize??=false,t.onFailedAttempt??=()=>{},t.shouldRetry??=()=>true,t.shouldConsumeRetry??=()=>true,validateNumberOption("factor",t.factor,{min:0,allowInfinity:false}),validateNumberOption("minTimeout",t.minTimeout,{min:0,allowInfinity:false}),validateNumberOption("maxTimeout",t.maxTimeout,{min:0,allowInfinity:true}),validateNumberOption("maxRetryTime",t.maxRetryTime,{min:0,allowInfinity:true}),t.factor>0||(t.factor=1),t.signal?.throwIfAborted();let r=0,o=0;const n=performance.now();for(;!Number.isFinite(t.retries)||o<=t.retries;){r++;try{t.signal?.throwIfAborted();const o=await e(r);return t.signal?.throwIfAborted(),o}catch(e){await onAttemptFailure({error:e,attemptNumber:r,retriesConsumed:o,startTime:n,options:t})&&o++;}}throw new Error("Retry attempts exhausted without throwing an error.")}

  /* minified: lib */
  class ConsoleSink{constructor(e){this.scriptName=e;}formatMessage(e){return `[${this.scriptName}] ${e}`}onDebug(e){console.debug(this.formatMessage(e));}onLog(e){console.log(this.formatMessage(e));}onInfo(e){console.info(this.formatMessage(e));}onSuccess=this.onInfo.bind(this);onWarn(e,t){e=this.formatMessage(e),t?console.warn(e,t):console.warn(e);}onError(e,t){e=this.formatMessage(e),t?console.error(e,t):console.error(e);}}let LogLevel=function(e){return e[e.DEBUG=0]="DEBUG",e[e.LOG=1]="LOG",e[e.INFO=2]="INFO",e[e.SUCCESS=3]="SUCCESS",e[e.WARNING=4]="WARNING",e[e.ERROR=5]="ERROR",e}({});const HANDLER_NAMES={[LogLevel.DEBUG]:"onDebug",[LogLevel.LOG]:"onLog",[LogLevel.INFO]:"onInfo",[LogLevel.SUCCESS]:"onSuccess",[LogLevel.WARNING]:"onWarn",[LogLevel.ERROR]:"onError"},DEFAULT_OPTIONS={logLevel:LogLevel.INFO,sinks:[]};class Logger{constructor(e){this._configuration={...DEFAULT_OPTIONS,...e};}fireHandlers(e,t,s){if(!(e<this._configuration.logLevel))for(const r of this._configuration.sinks){const n=r[HANDLER_NAMES[e]];n&&(s?n.call(r,t,s):n.call(r,t));}}debug(e){this.fireHandlers(LogLevel.DEBUG,e);}log(e){this.fireHandlers(LogLevel.LOG,e);}info(e){this.fireHandlers(LogLevel.INFO,e);}success(e){this.fireHandlers(LogLevel.SUCCESS,e);}warn(e,t){this.fireHandlers(LogLevel.WARNING,e,t);}error(e,t){this.fireHandlers(LogLevel.ERROR,e,t);}configure(e){Object.assign(this._configuration,e);}get configuration(){return this._configuration}addSink(e){this._configuration.sinks.push(e);}}const LOGGER=new Logger;var USERSCRIPT_ID="mb_enhanced_cover_art_uploads";function filterNonNull(e){return e.filter(e=>!(null==e))}function groupBy(e,t,s){const r=new Map;for(const n of e){const e=t(n),o=s(n);r.has(e)?r.get(e)?.push(o):r.set(e,[o]);}return r}function collatedSort(e){const t=new Intl.Collator("en",{numeric:true});return e.sort(t.compare.bind(t))}function enumerate(e){return e.map((e,t)=>[e,t])}function isFactory(e){return "function"==typeof e}function insertBetween(e,t){return [...e.slice(0,1),...e.slice(1).flatMap(e=>[isFactory(t)?t():t,e])]}function splitChunks(e,t){const s=[];for(let r=0;r<e.length;r+=t)s.push(e.slice(r,r+t));return s}function deduplicate(e){return [...new Set(e)]}class AssertionError extends Error{}function assert(e,t){if(!e)throw new AssertionError(t??"Assertion failed")}function assertDefined(e,t){assert(void 0!==e,t??"Assertion failed: Expected value to be defined");}function assertNonNull(e,t){assert(null!==e,t??"Assertion failed: Expected value to be non-null");}function assertHasValue(e,t){assert(null!=e,t??"Assertion failed: Expected value to be defined and non-null");}function qs(e,t){const s=qsMaybe(e,t);return assertNonNull(s,"Could not find required element"),s}function qsMaybe(e,t){return (t??document).querySelector(e)}function qsa(e,t){return [...(t??document).querySelectorAll(e)]}function onDocumentLoaded(e){"loading"!==document.readyState?e():document.addEventListener("DOMContentLoaded",e);}function parseDOM(e,t){const s=(new DOMParser).parseFromString(e,"text/html");if(!qsMaybe("base",s.head)){const e=s.createElement("base");e.href=t,s.head.insertAdjacentElement("beforeend",e);}return s}function insertStylesheet(e,t){if(t??=`ROpdebee_${USERSCRIPT_ID}_css`,null!==qsMaybe(`style#${t}`))return;const s=h("style",{id:t},e);document.head.insertAdjacentElement("beforeend",s);}const guiSink="#ROpdebee_log_container{width:75%;margin:1.5rem auto}#ROpdebee_log_container .msg{overflow-wrap:break-word;border:1px solid;border-radius:4px;width:100%;margin-bottom:.5rem;padding:.5rem .75rem;font-weight:500;display:block}#ROpdebee_log_container .msg.error{color:#721c24;background-color:#f8d7da;border-color:#f5c6cb;font-weight:600}#ROpdebee_log_container .msg.warning{color:#856404;background-color:#fff3cd;border-color:#ffeeba}#ROpdebee_log_container .msg.success{color:#155724;background-color:#d4edda;border-color:#c3e6cb}#ROpdebee_log_container .msg.info{color:#383d41;background-color:#e2e3e5;border-color:#d6d8db}";class GuiSink{persistentMessages=[];transientMessages=[];constructor(){insertStylesheet(guiSink,"ROpdebee_GUI_Logger"),this.rootElement=h("div",{id:"ROpdebee_log_container",style:{display:"none"}});}createMessage(e,t,s){const r=insertBetween((t+(s instanceof Error?`: ${s.message}`:"")).split(/(?=[/?&%])/),()=>h("wbr",null));return h("span",{className:`msg ${e}`},r)}addMessage(e){this.removeTransientMessages(),this.rootElement.append(e),this.rootElement.style.display="block";}removeTransientMessages(){for(const e of this.transientMessages)e.remove();this.transientMessages=[];}addPersistentMessage(e){this.addMessage(e),this.persistentMessages.push(e);}addTransientMessage(e){this.addMessage(e),this.transientMessages.push(e);}onLog(e){this.addTransientMessage(this.createMessage("info",e));}onInfo=this.onLog.bind(this);onSuccess(e){this.addTransientMessage(this.createMessage("success",e));}onWarn(e,t){this.addPersistentMessage(this.createMessage("warning",e,t));}onError(e,t){this.addPersistentMessage(this.createMessage("error",e,t));}clearAllLater(){this.transientMessages=[...this.transientMessages,...this.persistentMessages],this.persistentMessages=[];}}function existsInGM(e){return "undefined"!=typeof GM&&void 0!==GM[e]}function GMxmlHttpRequest(e){existsInGM("xmlHttpRequest")?GM.xmlHttpRequest(e):GM_xmlhttpRequest(e);}function GMgetValue(e){return existsInGM("getValue")?GM.getValue(e):Promise.resolve(GM_getValue(e))}function GMsetValue(e,t){return existsInGM("setValue")?GM.setValue(e,t):(GM_setValue(e,t),Promise.resolve())}function GMdeleteValue(e){return existsInGM("deleteValue")?GM.deleteValue(e):(GM_deleteValue(e),Promise.resolve())}function GMgetResourceUrl(e){return existsInGM("getResourceUrl")?GM.getResourceUrl(e):existsInGM("getResourceURL")?GM.getResourceURL(e):Promise.resolve(GM_getResourceURL(e))}const GMinfo=existsInGM("info")?GM.info:GM_info;function cloneIntoPageContext(e){return "undefined"!=typeof cloneInto&&"undefined"!=typeof unsafeWindow?cloneInto(e,unsafeWindow):e}function getFromPageContext(e){return ("undefined"!=typeof unsafeWindow?unsafeWindow:window)[e]}const separator="\n–\n";class EditNote{constructor(e){this.footer=e,this.editNoteTextArea=qs("textarea.edit-note");const t=this.editNoteTextArea.value.split(separator)[0];this.extraInfoLines=new Set(t?t.split("\n").map(e=>e.trimEnd()):null);}addExtraInfo(e){if(this.extraInfoLines.has(e))return;let[t,...s]=this.editNoteTextArea.value.split(separator);t=(t+"\n"+e).trim(),this.editNoteTextArea.value=[t,...s].join(separator),this.extraInfoLines.add(e);}addFooter(){this.removePreviousFooter();const e=this.editNoteTextArea.value;this.editNoteTextArea.value=[e,separator,this.footer].join("");}removePreviousFooter(){const e=this.editNoteTextArea.value.split(separator).filter(e=>e.trim()!==this.footer);this.editNoteTextArea.value=e.join(separator);}static withFooterFromGMInfo(){const e=GMinfo.script,t=`${e.name} ${e.version}\n${e.namespace}`;return new EditNote(t)}}class ResponseHeadersImpl{constructor(e){const t=groupBy(e?e.split("\r\n").filter(Boolean).map(e=>{const[t,...s]=e.split(":");return [t.toLowerCase().trim(),s.join(":").trim()]}):[],e=>{let[t]=e;return t},e=>{let[,t]=e;return t});this.map=new Map([...t.entries()].map(e=>{let[t,s]=e;return [t,s.join(",")]})),this.entries=this.map.entries.bind(this.map),this.keys=this.map.keys.bind(this.map),this.values=this.map.values.bind(this.map),this[Symbol.iterator]=this.map[Symbol.iterator].bind(this.map);}get(e){return this.map.get(e.toLowerCase())??null}has(e){return this.map.has(e.toLowerCase())}forEach(e){for(const[t,s]of this.map.entries())e(s,t,this);}}function createTextResponse(e,t){return {...e,text:t,json(){return JSON.parse(this.text)}}}function convertFetchOptions(e,t){if(t)return {method:e,body:t.body,headers:t.headers}}async function createFetchResponse(e,t){const s=e?.responseType??"text",r={headers:t.headers,url:t.url,status:t.status,statusText:t.statusText,rawResponse:t};switch(s){case "text":return createTextResponse(r,await t.text());case "blob":return {...r,blob:await t.blob()};case "arraybuffer":return {...r,arrayBuffer:await t.arrayBuffer()}}}async function performFetchRequest(e,t,s){return createFetchResponse(s,await fetch(new URL(t),convertFetchOptions(e,s)))}class ResponseError extends CustomError{constructor(e,t){super(t),this.url=e;}}class HTTPResponseError extends ResponseError{constructor(e,t,s){s?super(e,s):t.statusText.trim()?super(e,`HTTP error ${t.status}: ${t.statusText}`):super(e,`HTTP error ${t.status}`),this.response=t,this.statusCode=t.status,this.statusText=t.statusText;}}class TimeoutError extends ResponseError{constructor(e){super(e,"Request timed out");}}class AbortedError extends ResponseError{constructor(e){super(e,"Request aborted");}}class NetworkError extends ResponseError{constructor(e){super(e,"Network error");}}function createGMXHRResponse(e,t){const s=e?.responseType??"text",r={headers:new ResponseHeadersImpl(t.responseHeaders),url:t.finalUrl,status:t.status,statusText:t.statusText,rawResponse:t};switch(s){case "text":return createTextResponse(r,t.responseText);case "blob":return {...r,blob:t.response};case "arraybuffer":return {...r,arrayBuffer:t.response}}}function performGMXHRRequest(e,t,s){return new Promise((r,n)=>{GMxmlHttpRequest({method:e,url:t instanceof URL?t.href:t,headers:s?.headers,data:s?.body,responseType:s?.responseType,onload:e=>{r(createGMXHRResponse(s,e));},onerror:()=>{n(new NetworkError(t));},onabort:()=>{n(new AbortedError(t));},ontimeout:()=>{n(new TimeoutError(t));},onprogress:s?.onProgress});})}let RequestBackend=function(e){return e[e.FETCH=1]="FETCH",e[e.GMXHR=2]="GMXHR",e}({});const hasGMXHR="undefined"!=typeof GM_xmlHttpRequest||"undefined"!=typeof GM&&void 0!==GM.xmlHttpRequest;function constructErrorMessage(e,t){const s=e?.httpErrorMessages?.[t.status];return "string"==typeof s?s:void 0!==s?s(t):void 0}const request=async function(e,t,s){const r=s?.backend??(hasGMXHR?RequestBackend.GMXHR:RequestBackend.FETCH),n=await performRequest(r,e,t,s);if((s?.throwForStatus??1)&&n.status>=400){const e=constructErrorMessage(s,n);throw new HTTPResponseError(t,n,e)}return n};function performRequest(e,t,s,r){switch(e){case RequestBackend.FETCH:return performFetchRequest(t,s,r);case RequestBackend.GMXHR:return performGMXHRRequest(t,s,r)}}async function getReleaseUrlARs(e){const t=await request.get(`https://musicbrainz.org/ws/2/release/${e}?inc=url-rels&fmt=json`);return (await t.json()).relations??[]}async function getURLsForRelease(e,t){const{excludeEnded:s,excludeDuplicates:r}=t??{};let n=await getReleaseUrlARs(e);s&&(n=n.filter(e=>!e.ended));let o=n.map(e=>e.url.resource);return r&&(o=[...new Set(o)]),o.flatMap(e=>{try{return [new URL(e)]}catch{return console.warn(`Found malformed URL linked to release: ${e}`),[]}})}async function getReleaseIDsForURL(e){const t=await request.get(`https://musicbrainz.org/ws/2/url?resource=${encodeURIComponent(e)}&inc=release-rels&fmt=json`,{throwForStatus:false}),s=await t.json();return s.relations?.map(e=>e.release.id)??[]}function asyncSleep(e){return new Promise(t=>setTimeout(t,e))}function retryTimes(e,t,s){return t<=0?Promise.reject(new TypeError(`Invalid number of retry times: ${t}`)):async function t(r){try{return await e()}catch(e){if(r<=1)throw e;return asyncSleep(s).then(()=>t(r-1))}}(t)}function logFailure(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"An error occurred";return LOGGER.error.bind(LOGGER,e)}async function pFinally(e,t){try{return await e}finally{await t();}}request.get=request.bind(void 0,"GET"),request.post=request.bind(void 0,"POST"),request.head=request.bind(void 0,"HEAD");class ObservableSemaphore{counter=0;constructor(e){this.onAcquired=e.onAcquired.bind(e),this.onReleased=e.onReleased.bind(e);}acquire(){this.counter++,1===this.counter&&this.onAcquired();}release(){this.counter--,0===this.counter&&this.onReleased();}runInSection(e){let t;this.acquire();try{return t=e(),t}finally{t instanceof Promise?pFinally(t,this.release.bind(this)).catch(()=>{}):this.release();}}}let ArtworkTypeIDs=function(e){return e[e.Back=2]="Back",e[e.Booklet=3]="Booklet",e[e.Front=1]="Front",e[e.Liner=12]="Liner",e[e.Medium=4]="Medium",e[e.Obi=5]="Obi",e[e.Other=8]="Other",e[e.Poster=11]="Poster",e[e["Raw/Unedited"]=14]="Raw/Unedited",e[e.Spine=6]="Spine",e[e.Sticker=10]="Sticker",e[e.Track=7]="Track",e[e.Tray=9]="Tray",e[e.Watermark=13]="Watermark",e[e["Matrix/Runout"]=15]="Matrix/Runout",e[e.Top=48]="Top",e[e.Bottom=49]="Bottom",e[e.Panel=81]="Panel",e}({});function hexEncode(e){return [...new(getFromPageContext("Uint8Array"))(e)].map(e=>e.toString(16).padStart(2,"0")).join("")}async function blobToDigest(e){const t=await blobToBuffer(e);return hexEncode(await(crypto?.subtle?.digest?.("SHA-256",t)??t))}function blobToBuffer(e){return new Promise((t,s)=>{const r=new FileReader;r.addEventListener("error",s),r.addEventListener("load",()=>{t(r.result);}),r.readAsArrayBuffer(e);})}function memoize(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:e=>`${e[0]}`;const s=new Map;return function(){for(var r=arguments.length,n=new Array(r),o=0;o<r;o++)n[o]=arguments[o];const a=t(n);if(!s.has(a)){const t=e(...n);s.set(a,t);}return s.get(a)}}function identity(e){return e}function urlBasename(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"";return "string"!=typeof e&&(e=e.pathname),e.split("/").pop()||t}function urlJoin(e){let t=new URL(e);for(var s=arguments.length,r=new Array(s>1?s-1:0),n=1;n<s;n++)r[n-1]=arguments[n];for(const e of r)t=new URL(e,t);return t}class ConfigProperty{constructor(e,t,s){this.name=e,this.description=t,this.defaultValue=s;}async get(){const e=await GMgetValue(this.name);if(void 0===e)return this.defaultValue;if("string"!=typeof e)return LOGGER.error(`Invalid stored configuration data for property ${this.name}: expected a string, got ${e}.`),await GMdeleteValue(this.name),this.defaultValue;try{return JSON.parse(e)}catch(e){return LOGGER.error(`Invalid stored configuration data for property ${this.name}: Failed to parse JSON data: ${e}.`),await GMdeleteValue(this.name),this.defaultValue}}set(e){return GMsetValue(this.name,JSON.stringify(e))}}function splitDomain(e){const t=e.split(".");let s=-2;return ["org","co","com"].includes(t.at(-2))&&(s=-3),[...t.slice(0,s),t.slice(s).join(".")]}class DispatchMap{map=(()=>new Map)();set(e,t){const s=splitDomain(e);if("*"===e||s[0].includes("*")&&"*"!==s[0]||s.slice(1).some(e=>e.includes("*")))throw new Error("Invalid pattern: "+e);return this.insert([...s].reverse(),t),this}get(e){return this.retrieve([...splitDomain(e)].reverse())}_get(e){return this.map.get(e)}_set(e,t){return this.map.set(e,t),this}insertLeaf(e,t){const s=this._get(e);s?(assert(s instanceof DispatchMap&&!s.map.has(""),"Duplicate leaf!"),s._set("",t)):this._set(e,t);}insertInternal(e,t){const s=e[0],r=this._get(s);let n;r instanceof DispatchMap?n=r:(n=new DispatchMap,this._set(s,n),void 0!==r&&n._set("",r)),n.insert(e.slice(1),t);}insert(e,t){e.length>1?this.insertInternal(e,t):(assert(1===e.length,"Empty domain parts?!"),this.insertLeaf(e[0],t));}retrieveLeaf(e){let t=this._get(e);return t instanceof DispatchMap&&(t=t._get("")??t._get("*")),t}retrieveInternal(e){const t=this._get(e[0]);if(t instanceof DispatchMap)return t.retrieve(e.slice(1))}retrieve(e){return (1===e.length?this.retrieveLeaf(e[0]):this.retrieveInternal(e))??this._get("*")}}function safeParseJSON(e,t){try{return JSON.parse(e)}catch(e){if(t)throw new Error(`${t}: ${e}`);return}}async function getItemMetadata(e){const t=safeParseJSON((await request.get(new URL(`https://archive.org/metadata/${e}`))).text,"Could not parse IA metadata");if(!t.server)throw new Error("Empty IA metadata, item might not exist");if(t.is_dark)throw new Error("Cannot access IA metadata: This item is darkened");return t}function formatFileSize(e){const t=0===e?0:Math.floor(Math.log(e)/Math.log(1024));return `${Number((e/Math.pow(1024,t)).toFixed(2))} ${["B","kB","MB","GB","TB"][t]}`}function parseVersion(e){return e.split(".").map(e=>Number.parseInt(e))}function versionLessThan(e,t){let s=0;for(;s<e.length&&s<t.length;){if(e[s]<t[s])return  true;if(e[s]>t[s])return  false;s++;}return e.length<t.length}var CHANGELOG_URL="https://github.com/ROpdebee/mb-userscripts/blob/dist/mb_enhanced_cover_art_uploads.changelog.md",USERSCRIPT_FEATURE_HISTORY=[{versionAdded:"2026.2.21",description:"support URL input on event art upload pages"},{versionAdded:"2026.2.19",description:"search multiple Tidal countries for release (needs to be enabled in config)"},{versionAdded:"2026.2.18",description:"prefetch cover art metadata"},{versionAdded:"2025.5.12.2",description:"add Metal Archives provider"},{versionAdded:"2025.5.12",description:"add MusicCircle provider"},{versionAdded:"2025.5.9",description:"add Free Music Archive provider"},{versionAdded:"2025.5.8",description:"configuration options"},{versionAdded:"2025.3.10",description:"Display image dimensions and seed release URLs from Harmony"},{versionAdded:"2025.3.9",description:"Seed cover art from Harmony release actions pages"}];const banner=".ROpdebee_feature_list{width:-moz-fit-content;width:fit-content;margin:0 auto;font-weight:300}.ROpdebee_feature_list ul{text-align:left;margin:6px 28px 0 0}",LAST_DISPLAYED_KEY=`ROpdebee_${USERSCRIPT_ID}_last_notified_update`;function maybeDisplayNewFeatures(){const e=localStorage.getItem(LAST_DISPLAYED_KEY),t=GM.info.script;if(!e)return void localStorage.setItem(LAST_DISPLAYED_KEY,t.version);const s=parseVersion(e),r=USERSCRIPT_FEATURE_HISTORY.filter(e=>versionLessThan(s,parseVersion(e.versionAdded)));0!==r.length&&showFeatureNotification(t.name,t.version,r.map(e=>e.description));}function showFeatureNotification(e,t,s){insertStylesheet(banner,"ROpdebee_Update_Banner");const r=h("div",{className:"banner warning-header"},h("p",null,`${e} was updated to v${t}! `,h("a",{href:CHANGELOG_URL},"See full changelog here"),". New features since last update:"),h("div",{className:"ROpdebee_feature_list"},h("ul",null,s.map(e=>h("li",null,e)))),h("button",{className:"dismiss-banner remove-item icon","data-banner-name":"alert",type:"button",onClick:()=>{r.remove(),localStorage.setItem(LAST_DISPLAYED_KEY,GM.info.script.version);}}));qs("#page").insertAdjacentElement("beforebegin",r);}

  LOGGER.configure({
      logLevel: LogLevel.INFO,
  });
  LOGGER.addSink(new ConsoleSink(USERSCRIPT_ID));

  async function enqueueImage(image) {
    dropImage(image.content);
    await retryTimes(setImageParameters.bind(null, image.content.name, image.types, image.comment.trim()), 5, 500);
  }
  function dropImage(imageData) {
    const DataTransfer = getFromPageContext('DataTransfer');
    const dataTransfer = new DataTransfer();
    Object.defineProperty(dataTransfer, 'files', {
      value: cloneIntoPageContext([imageData])
    });
    const dropEvent = new DragEvent('drop', {
      dataTransfer
    });
    qs('#drop-zone').dispatchEvent(dropEvent);
  }
  function setImageParameters(imageName, imageTypes, imageComment) {
    const pendingUploadRows = qsa('tbody[data-bind="foreach: files_to_upload"] > tr');
    const fileRow = pendingUploadRows.find(row => qs('.file-info span[data-bind="text: name"]', row).textContent == imageName);
    assertDefined(fileRow, `Could not find image ${imageName} in queued uploads`);
    const checkboxesToCheck = qsa('ul.cover-art-type-checkboxes input[type="checkbox"]', fileRow).filter(cbox => imageTypes.includes(Number.parseInt(cbox.value)));
    for (const cbox of checkboxesToCheck) {
      cbox.checked = true;
      cbox.dispatchEvent(new Event('click'));
    }
    if (imageComment) {
      const commentInput = qs('div.comment > input.comment', fileRow);
      commentInput.value = imageComment;
      commentInput.dispatchEvent(new Event('change'));
    }
  }
  function fillEditNoteFragment(editNote, images, containerUrl) {
    const prefix = containerUrl ? ' * ' : '';
    if (containerUrl) {
      editNote.addExtraInfo(decodeURI(containerUrl.href));
    }
    for (const queuedUrl of images) {
      if (queuedUrl.maximisedUrl.protocol === 'data:') {
        editNote.addExtraInfo(prefix + 'Uploaded from data URL');
        continue;
      }
      editNote.addExtraInfo(prefix + decodeURI(queuedUrl.originalUrl.href));
      if (queuedUrl.wasMaximised) {
        editNote.addExtraInfo(' '.repeat(prefix.length) + '→ Maximised to ' + decodeURI(queuedUrl.maximisedUrl.href));
      }
      if (queuedUrl.wasRedirected) {
        editNote.addExtraInfo(' '.repeat(prefix.length) + '→ Redirected to ' + decodeURI(queuedUrl.finalUrl.href));
      }
    }
  }
  function fillEditNote(allFetchedImages, origin, editNote) {
    const totalNumberImages = allFetchedImages.reduce((accumulator, fetched) => accumulator + fetched.images.length, 0);
    if (!totalNumberImages) return;
    const maxFilled = 3;
    let numberFilled = 0;
    for (const {
      containerUrl,
      images
    } of allFetchedImages) {
      const imagesToFill = images.slice(0, maxFilled - numberFilled);
      fillEditNoteFragment(editNote, imagesToFill, containerUrl);
      numberFilled += imagesToFill.length;
      if (numberFilled >= maxFilled) break;
    }
    if (totalNumberImages > maxFilled) {
      editNote.addExtraInfo(`…and ${totalNumberImages - maxFilled} additional image(s)`);
    }
    if (origin) {
      editNote.addExtraInfo(`Seeded from ${origin}`);
    }
    editNote.addFooter();
  }

  async function _or() {
    for (var _len = arguments.length, promises = new Array(_len), _key = 0; _key < _len; _key++) {
      promises[_key] = arguments[_key];
    }
    const booleans = await Promise.all(promises);
    return booleans.some(Boolean);
  }
  const CONFIG = {
    fetchFrontOnly: new ConfigProperty('fetchFrontOnly', 'Fetch front image only', false),
    skipTrackImagesProperty: new ConfigProperty('skipTrackImages', 'Skip extracting track images', false),
    prefetchMetadata: new ConfigProperty('prefetchMetadata', 'Always get cover art metadata', false),
    get skipTrackImages() {
      return _or(CONFIG.fetchFrontOnly.get(), CONFIG.skipTrackImagesProperty.get());
    },
    bandcamp: {
      skipTrackImagesProperty: new ConfigProperty('bandcamp.skipTrackImages', 'Skip extracting track images', false),
      get skipTrackImages() {
        return _or(CONFIG.skipTrackImages, CONFIG.bandcamp.skipTrackImagesProperty.get());
      },
      squareCropFirst: new ConfigProperty('bandcamp.squareCropFirst', 'Place square cropped artwork before original artwork', false)
    },
    soundcloud: {
      skipTrackImagesProperty: new ConfigProperty('soundcloud.skipTrackImages', 'Skip extracting track images', false),
      get skipTrackImages() {
        return _or(CONFIG.skipTrackImages, CONFIG.soundcloud.skipTrackImagesProperty.get());
      }
    },
    tidal: {
      checkAllCountries: new ConfigProperty('tidal.checkAllCountries', 'Check other countries when release cannot be found', false)
    },
    vgmdb: {
      keepEntireComment: new ConfigProperty('vgmdb.keepEntireComment', 'Keep entire cover art comment', false)
    }
  };

  class CoverArtProvider {
    allowButtons = true;
    postprocessImage(image) {
      return Promise.resolve(image);
    }
    cleanUrl(url) {
      return url.host + url.pathname;
    }
    supportsUrl(url) {
      if (Array.isArray(this.urlRegex)) {
        return this.urlRegex.some(regex => regex.test(this.cleanUrl(url)));
      }
      return this.urlRegex.test(this.cleanUrl(url));
    }
    extractId(url) {
      if (!Array.isArray(this.urlRegex)) {
        return this.urlRegex.exec(this.cleanUrl(url))?.[1];
      }
      return this.urlRegex.map(regex => regex.exec(this.cleanUrl(url))?.[1]).find(id => id !== undefined);
    }
    isSafeRedirect(originalUrl, redirectedUrl) {
      const id = this.extractId(originalUrl);
      return !!id && id === this.extractId(redirectedUrl);
    }
    async fetchPage(url, options) {
      const response = await request.get(url, {
        httpErrorMessages: {
          404: `${this.name} release does not exist`,
          410: `${this.name} release does not exist`,
          403: errorResponse => {
            const hasCaptcha = Object.hasOwn(errorResponse, 'text') && errorResponse.text.includes('<title>Just a moment...</title>');
            return hasCaptcha ? 'Cloudflare captcha page detected. Please navigate to the page, solve the challenge, and try again.' : undefined;
          }
        },
        ...options
      });
      if (response.url === undefined) {
        LOGGER.warn(`Could not detect if ${url.href} caused a redirect`);
      } else if (response.url !== url.href && !this.isSafeRedirect(url, new URL(response.url))) {
        throw new Error(`Refusing to extract images from ${this.name} provider because the original URL redirected to ${response.url}, which may be a different release. If this redirected URL is correct, please retry with ${response.url} directly.`);
      }
      return response.text;
    }
  }
  class HeadMetaPropertyProvider extends CoverArtProvider {
    is404Page(_document) {
      return false;
    }
    async findImages(url) {
      const responseDocument = parseDOM(await this.fetchPage(url), url.href);
      if (this.is404Page(responseDocument)) {
        throw new Error(`${this.name} release does not exist`);
      }
      const coverElement = qs('head > meta[property="og:image"]', responseDocument);
      return [{
        url: new URL(coverElement.content, url),
        types: [ArtworkTypeIDs.Front]
      }];
    }
  }
  class ProviderWithTrackImages extends CoverArtProvider {
    imageToThumbnailUrl(imageUrl) {
      return imageUrl;
    }
    groupImageUrls(imageUrls) {
      return splitChunks(deduplicate(imageUrls), 1);
    }
    async groupImageUrlsByContent(imageGroups) {
      LOGGER.info('Deduplicating track images by file size, this may take a while…');
      let groupedBySize;
      try {
        const imagesWithSize = await getImageSizes(imageGroups);
        groupedBySize = [...groupBy(imagesWithSize, image => image.size, image => image.group).values()];
      } catch (error) {
        LOGGER.error('Cannot deduplicate based on file size', error);
        groupedBySize = [imageGroups];
      }
      LOGGER.info('Deduplicating track images by file contents, this may take a while…');
      let numberProcessed = 0;
      const groupedByContent = await Promise.all(groupedBySize.map(async groups => {
        numberProcessed++;
        LOGGER.info(`Deduplicating track images by file contents, this may take a while… (${numberProcessed}/${groupedBySize.length})`);
        if (groups.length <= 1) {
          return groups;
        }
        const imagesWithDigest = await getImageDigests(groups);
        const groupedImages = groupBy(imagesWithDigest, image => image.digest, image => image.group);
        return [...groupedImages.values()].map(matchedGroups => matchedGroups.flat());
      }));
      return groupedByContent.flat();
    }
    async mergeTrackImages(parsedTrackImages, mainUrl, byContent) {
      const allTrackImages = filterNonNull(parsedTrackImages);
      const urlToTrackImages = groupBy(allTrackImages, image => this.imageToThumbnailUrl(image.url), image => image);
      let allTrackImageUrls = allTrackImages.map(image => image.url);
      if (mainUrl) {
        allTrackImageUrls.push(mainUrl);
      }
      allTrackImageUrls = allTrackImageUrls.map(url => this.imageToThumbnailUrl(url));
      let imageGroups = this.groupImageUrls(allTrackImageUrls);
      if (byContent && imageGroups.length > 1) {
        imageGroups = await this.groupImageUrlsByContent(imageGroups);
      }
      return createCoverArtForTrackImageGroups(imageGroups, urlToTrackImages, mainUrl ? this.imageToThumbnailUrl(mainUrl) : undefined);
    }
  }
  async function getImageSizes(imageGroups) {
    let numberProcessed = 0;
    let results = [];
    for (const batch of splitChunks(imageGroups, 10)) {
      const batchResults = await Promise.all(batch.map(async group => ({
        group,
        size: await getFileSize(group[0])
      })));
      results = [...results, ...batchResults];
      numberProcessed += batchResults.length;
      LOGGER.info(`Deduplicating track images by file size, this may take a while… (${numberProcessed}/${imageGroups.length})`);
    }
    return results;
  }
  async function getFileSize(imageUrl) {
    const response = await request.head(imageUrl);
    const fileSize = response.headers.get('Content-Length')?.match(/\d+/)?.[0];
    assertDefined(fileSize, `Could not fetch file size for ${imageUrl}`);
    return Number.parseInt(fileSize);
  }
  function getImageDigests(groups) {
    return Promise.all(groups.map(async group => ({
      group,
      digest: await getFileDigest(group[0])
    })));
  }
  async function getFileDigest(imageUrl) {
    const response = await request.get(imageUrl, {
      responseType: 'blob'
    });
    return blobToDigest(response.blob);
  }
  function createCoverArtForTrackImageGroups(imageGroups, urlToTrackImages, mainUrl) {
    const covers = imageGroups.map(group => {
      if (mainUrl && group.includes(mainUrl)) {
        return null;
      }
      const trackImages = filterNonNull(group.flatMap(url => {
        const tracks = urlToTrackImages.get(url);
        assertDefined(tracks, 'Could not map URL back to track images!');
        return tracks;
      }));
      const imageUrl = group[0];
      return {
        url: new URL(imageUrl),
        types: [ArtworkTypeIDs.Track],
        comment: createTrackImageComment(trackImages) || undefined
      };
    });
    return filterNonNull(covers);
  }
  function createTrackImageComment(tracks) {
    const definedTrackNumbers = tracks.filter(track => Boolean(track.trackNumber));
    if (definedTrackNumbers.length === 0) return '';
    const commentBins = groupBy(definedTrackNumbers, track => track.customCommentPrefix?.[0] ?? 'Track', track => track);
    const commentChunks = [...commentBins.values()].map(bin => {
      const prefixes = bin[0].customCommentPrefix ?? ['Track', 'Tracks'];
      const prefix = prefixes[bin.length === 1 ? 0 : 1];
      const trackNumbers = bin.map(track => track.trackNumber);
      return `${prefix} ${collatedSort(trackNumbers).join(', ')}`;
    });
    return commentChunks.join('; ');
  }

  class SevenDigitalProvider extends HeadMetaPropertyProvider {
    supportedDomains = ['*.7digital.com'];
    favicon = 'https://css-cdn.7digital.com/static/build/images/favicons/7digital/touch-ipad-retina.png';
    name = '7digital';
    urlRegex = /release\/.*-(\d+)(?:\/|$)/;
    postprocessImage(image) {
      if (/\/0{8}16_\d+/.test(image.finalUrl.pathname)) {
        LOGGER.warn(`Skipping "${image.finalUrl}" as it matches a placeholder cover`);
        return null;
      }
      return image;
    }
  }

  class AllMusicProvider extends CoverArtProvider {
    supportedDomains = ['allmusic.com'];
    favicon = 'https://fastly-gce.allmusic.com/images/favicon/favicon-32x32.png';
    name = 'AllMusic';
    urlRegex = /album\/release\/.*(mr\d+)(?:\/|$)/;
    async findImages(url) {
      const page = await this.fetchPage(url);
      const galleryJson = /var imageGallery = (.+);$/m.exec(page)?.[1];
      if (!galleryJson) {
        throw new Error('Failed to extract AllMusic images from embedded JS');
      }
      const gallery = safeParseJSON(galleryJson);
      if (!gallery) {
        throw new Error('Failed to parse AllMusic JSON gallery data');
      }
      return gallery.map(image => {
        return {
          url: new URL(image.url.replace(/&f=\d+$/, '&f=0'))
        };
      });
    }
  }

  const PLACEHOLDER_IMG_NAMES = ['01RmK+J4pJL', '01QFb8SNuTL', '01PkLIhTX3L', '01MKUOLsA5L', '31CTP6oiIBL'];
  const VARIANT_TYPE_MAPPING = {
    MAIN: ArtworkTypeIDs.Front,
    FRNT: ArtworkTypeIDs.Front,
    BACK: ArtworkTypeIDs.Back,
    SIDE: ArtworkTypeIDs.Spine
  };
  const MUSIC_DIGITAL_PAGE_QUERY = 'img.logo[src*="amazon_music_"]';
  class AmazonProvider extends CoverArtProvider {
    supportedDomains = ['amazon.ae', 'amazon.ca', 'amazon.cn', 'amazon.de', 'amazon.eg', 'amazon.es', 'amazon.fr', 'amazon.in', 'amazon.it', 'amazon.jp', 'amazon.nl', 'amazon.pl', 'amazon.sa', 'amazon.se', 'amazon.sg', 'amazon.co.jp', 'amazon.co.uk', 'amazon.com', 'amazon.com.au', 'amazon.com.br', 'amazon.com.mx', 'amazon.com.tr'];
    get favicon() {
      return GMgetResourceUrl('amazonFavicon');
    }
    name = 'Amazon';
    urlRegex = /\/(?:gp\/product|dp|hz\/audible\/mlp\/mfpdp)\/([A-Za-z\d]{10})(?:\/|$)/;
    async findImages(url) {
      const pageContent = await this.fetchPage(url);
      const pageDom = parseDOM(pageContent, url.href);
      if (qsMaybe('form[action="/errors/validateCaptcha"]', pageDom) !== null) {
        throw new Error('Amazon served a captcha page');
      }
      if (qsMaybe(MUSIC_DIGITAL_PAGE_QUERY, pageDom)) {
        throw new Error('Amazon Music releases are currently not supported. Please use a different provider or copy the image URL manually.');
      }
      const covers = this.findGenericPhysicalImages(url, pageContent);
      return covers.filter(image => !PLACEHOLDER_IMG_NAMES.some(name => decodeURIComponent(image.url.pathname).includes(name)));
    }
    findGenericPhysicalImages(_url, pageContent) {
      const imgs = this.extractEmbeddedJSImages(pageContent, /'colorImages': { 'initial': (.+)},$/m);
      assertNonNull(imgs, 'Failed to extract images from embedded JS on generic physical page');
      return imgs.map(image => {
        return this.convertVariant({
          url: image.hiRes ?? image.large,
          variant: image.variant
        });
      });
    }
    extractEmbeddedJSImages(pageContent, jsonRegex) {
      const embeddedImages = jsonRegex.exec(pageContent)?.[1];
      if (!embeddedImages) {
        LOGGER.debug('Could not extract embedded JS images, regex did not match');
        return null;
      }
      const imgs = safeParseJSON(embeddedImages);
      if (!Array.isArray(imgs)) {
        LOGGER.debug(`Could not parse embedded JS images, not array, got ${imgs}`);
        return null;
      }
      return imgs;
    }
    convertVariant(cover) {
      const url = new URL(cover.url);
      const type = cover.variant && VARIANT_TYPE_MAPPING[cover.variant];
      LOGGER.debug(`${url.href} has the Amazon image variant code '${cover.variant}'`);
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
  }

  class AmazonMusicProvider extends CoverArtProvider {
    supportedDomains = ['music.amazon.ca', 'music.amazon.de', 'music.amazon.es', 'music.amazon.fr', 'music.amazon.in', 'music.amazon.it', 'music.amazon.co.jp', 'music.amazon.co.uk', 'music.amazon.com', 'music.amazon.com.au', 'music.amazon.com.br', 'music.amazon.com.mx'];
    favicon = 'https://d5fx445wy2wpk.cloudfront.net/icons/amznMusic_favicon.png';
    name = 'Amazon Music';
    urlRegex = /\/albums\/([A-Za-z\d]{10})(?:\/|$)/;
    findImages() {
      return Promise.reject(new Error('Amazon Music releases are currently not supported. Please use a different provider or copy the image URL manually.'));
    }
  }

  class AppleMusicProvider extends HeadMetaPropertyProvider {
    supportedDomains = ['music.apple.com', 'itunes.apple.com'];
    favicon = 'https://music.apple.com/assets/favicon/favicon-32.png';
    name = 'Apple Music';
    urlRegex = /\w{2}\/album\/(?:.+\/)?(?:id)?(\d+)/;
    is404Page(document_) {
      return qsMaybe('head > title', document_) === null;
    }
  }

  class ArchiveProvider extends CoverArtProvider {
    supportedDomains = ['archive.org'];
    favicon = 'https://archive.org/images/glogo.jpg';
    name = 'Archive.org';
    urlRegex = /(?:details|metadata|download)\/([^/?#]+)/;
    static CAA_ITEM_REGEX = /^mbid-[a-f\d-]+$/;
    static IMAGE_FILE_FORMATS = ['JPEG', 'PNG', 'Text PDF', 'Animated GIF'];
    async findImages(url) {
      const itemId = this.extractId(url);
      assertDefined(itemId);
      const itemMetadata = await getItemMetadata(itemId);
      const baseDownloadUrl = this.createBaseDownloadUrl(itemMetadata);
      if (ArchiveProvider.CAA_ITEM_REGEX.test(itemId)) {
        try {
          return await this.extractCAAImages(itemId, baseDownloadUrl);
        } catch {
          LOGGER.warn('Failed to extract CAA images, falling back on generic IA extraction');
        }
      }
      return this.extractGenericImages(itemMetadata, baseDownloadUrl);
    }
    async findImagesCAA(itemId) {
      const itemMetadata = await getItemMetadata(itemId);
      const baseDownloadUrl = this.createBaseDownloadUrl(itemMetadata);
      return this.extractCAAImages(itemId, baseDownloadUrl);
    }
    async extractCAAImages(itemId, baseDownloadUrl) {
      const caaIndexUrl = `https://archive.org/download/${itemId}/index.json`;
      const caaIndexResponse = await request.get(caaIndexUrl);
      const caaIndex = safeParseJSON(caaIndexResponse.text, 'Could not parse index.json');
      return caaIndex.images.map(image => {
        const imageFileName = urlBasename(image.image);
        return {
          url: urlJoin(baseDownloadUrl, `${itemId}-${imageFileName}`),
          comment: image.comment,
          types: image.types.map(type => ArtworkTypeIDs[type])
        };
      });
    }
    extractGenericImages(itemMetadata, baseDownloadUrl) {
      const originalImagePaths = itemMetadata.files.filter(file => file.source === 'original' && ArchiveProvider.IMAGE_FILE_FORMATS.includes(file.format)).map(file => encodeURIComponent(file.name).replaceAll('%2F', '/'));
      return originalImagePaths.map(path => {
        return {
          url: urlJoin(baseDownloadUrl, path)
        };
      });
    }
    createBaseDownloadUrl(itemMetadata) {
      return urlJoin(`https://${itemMetadata.server}`, `${itemMetadata.dir}/`);
    }
  }

  class AudiomackProvider extends HeadMetaPropertyProvider {
    supportedDomains = ['audiomack.com'];
    name = 'Audiomack';
    favicon = 'https://audiomack.com/static/favicon-32x32.png';
    urlRegex = /\.com\/([^/]+\/(?:song|album)\/[^/?#]+)/;
  }

  function _getImageDimensions(url) {
    LOGGER.info(`Getting image dimensions for ${url}`);
    return new Promise((resolve, reject) => {
      let done = false;
      function dimensionsLoaded(dimensions) {
        clearInterval(interval);
        if (!done) {
          resolve(dimensions);
          done = true;
          image.src = '';
        }
      }
      function dimensionsFailed(event_) {
        clearInterval(interval);
        if (!done) {
          done = true;
          reject(new Error(event_.message ?? 'Image failed to load for unknown reason'));
        }
      }
      const image = document.createElement('img');
      image.addEventListener('load', () => {
        dimensionsLoaded({
          height: image.naturalHeight,
          width: image.naturalWidth
        });
      });
      image.addEventListener('error', dimensionsFailed);
      const interval = window.setInterval(() => {
        if (image.naturalHeight) {
          dimensionsLoaded({
            height: image.naturalHeight,
            width: image.naturalWidth
          });
        }
      }, 50);
      image.src = url;
    });
  }
  const getImageDimensions = memoize(url => pRetry(() => _getImageDimensions(url), {
    retries: 5,
    onFailedAttempt: _ref => {
      let {
        error
      } = _ref;
      LOGGER.warn(`Failed to retrieve image dimensions: ${error.message}. Retrying…`);
    }
  }));

  class BandcampProvider extends ProviderWithTrackImages {
    supportedDomains = ['*.bandcamp.com'];
    favicon = 'https://s4.bcbits.com/img/favicon/favicon-32x32.png';
    name = 'Bandcamp';
    urlRegex = /^(.+)\.bandcamp\.com\/(track|album)\/([^/]+)(?:\/|$)/;
    extractId(url) {
      return this.urlRegex.exec(this.cleanUrl(url))?.slice(1).join('/');
    }
    async findImages(url) {
      const tralbum = await this.extractAlbumData(url);
      const albumArtId = tralbum.art_id;
      const isAlbum = tralbum.item_type === 'album';
      if (!isAlbum && tralbum.album_url) {
        LOGGER.warn('This Bandcamp track is part of an album rather than a standalone release');
      }
      const covers = [];
      if (albumArtId) {
        covers.push({
          url: new URL(this.constructArtUrl(albumArtId)),
          types: [ArtworkTypeIDs.Front]
        });
      } else {
        LOGGER.warn('Bandcamp release has no cover');
      }
      const shouldExtractTrackImages = isAlbum && !(await CONFIG.bandcamp.skipTrackImages);
      const trackImages = shouldExtractTrackImages ? await this.findTrackImages(tralbum.id, albumArtId) : [];
      return this.amendSquareThumbnails([...covers, ...trackImages]);
    }
    constructArtUrl(artId) {
      return `https://f4.bcbits.com/img/a${artId}_10.jpg`;
    }
    async findTrackImages(albumId, frontArtId) {
      const playerData = await this.extractPlayerData(albumId);
      if (playerData === undefined) {
        LOGGER.warn('Failed to extract track images: Player data could not be loaded. This may happen when tracks cannot be played (e.g., subscriber-only releases).');
        return [];
      }
      assert(playerData.album_art_id === frontArtId, 'Mismatching front album art between Bandcamp embedded player and release page');
      const trackImages = playerData.tracks.map(track => {
        if (track.art_id) {
          return {
            url: this.constructArtUrl(track.art_id),
            trackNumber: (track.tracknum + 1).toString()
          };
        }
        return undefined;
      });
      const frontArtUrl = frontArtId ? this.constructArtUrl(frontArtId) : undefined;
      const mergedTrackImages = await this.mergeTrackImages(trackImages, frontArtUrl, true);
      if (mergedTrackImages.length > 0) {
        LOGGER.info(`Found ${mergedTrackImages.length} unique track images`);
      } else {
        LOGGER.info('Found no unique track images this time');
      }
      return mergedTrackImages;
    }
    async extractAlbumData(url) {
      const responseDocument = parseDOM(await this.fetchPage(url), url.href);
      const tralbum = safeParseJSON(qs('[data-tralbum]', responseDocument).dataset.tralbum);
      assertDefined(tralbum, 'Could not extract Bandcamp tralbum JSON info');
      return tralbum;
    }
    async extractPlayerData(albumId) {
      const playerUrl = `https://bandcamp.com/EmbeddedPlayer/album=${albumId}`;
      const responseDocument = parseDOM(await this.fetchPage(new URL(playerUrl)), playerUrl);
      const playerDataJson = qsMaybe('[data-player-data]', responseDocument)?.dataset.playerData;
      if (playerDataJson === undefined) {
        LOGGER.warn('Could not extract player data from page');
        return undefined;
      }
      const playerData = safeParseJSON(playerDataJson);
      if (playerData === undefined) {
        LOGGER.warn('Could not parse player data from page');
      }
      return playerData;
    }
    async amendSquareThumbnails(covers) {
      return Promise.all(covers.map(async cover => {
        let coverDims;
        try {
          coverDims = await getImageDimensions(cover.url.href.replace(/_\d+\.(\w+)$/, '_0.$1'));
        } catch (error) {
          LOGGER.warn(`Could not retrieve image dimensions for ${cover.url}, square thumbnail will not be added`, error);
          return [cover];
        }
        if (!coverDims.width || !coverDims.height) {
          return [cover];
        }
        const ratio = coverDims.width / coverDims.height;
        if (0.95 <= ratio && ratio <= 1.05) {
          return [cover];
        }
        const originalCover = {
          ...cover,
          comment: filterNonNull([cover.comment, 'Bandcamp full-sized cover']).join(' - ')
        };
        const squareCrop = {
          types: cover.types,
          url: new URL(cover.url.href.replace(/_\d+\.(\w+)$/, '_16.$1')),
          comment: filterNonNull([cover.comment, 'Bandcamp square crop']).join(' - '),
          skipMaximisation: true
        };
        const squareCropFirst = await CONFIG.bandcamp.squareCropFirst.get();
        return squareCropFirst ? [squareCrop, originalCover] : [originalCover, squareCrop];
      })).then(nestedCovers => nestedCovers.flat());
    }
    imageToThumbnailUrl(imageUrl) {
      return imageUrl.replace(/_\d+\.(\w+)$/, '_10.$1');
    }
  }

  class BeatportProvider extends CoverArtProvider {
    supportedDomains = ['beatport.com'];
    favicon = 'https://www.beatport.com/images/favicon-48x48.png';
    name = 'Beatport';
    urlRegex = /release\/[^/]+\/(\d+)(?:\/|$)/;
    async findImages(url) {
      const responseDocument = parseDOM(await this.fetchPage(url), url.href);
      const releaseDataText = qs('script#__NEXT_DATA__', responseDocument).textContent;
      const releaseData = safeParseJSON(releaseDataText, 'Failed to parse Beatport release data');
      const cover = releaseData.props.pageProps.release.image;
      return [{
        url: new URL(cover.uri),
        types: [ArtworkTypeIDs.Front]
      }];
    }
  }

  class BoothProvider extends CoverArtProvider {
    supportedDomains = ['*.booth.pm'];
    favicon = 'https://booth.pm/static-images/pwa/icon_size_96.png';
    name = 'Booth';
    urlRegex = /items\/(\d+)/;
    async findImages(url) {
      const itemId = this.extractId(url);
      assertDefined(itemId);
      const apiJson = await this.fetchPage(this.createApiUrl(itemId));
      const apiData = safeParseJSON(apiJson, 'Failed to parse Booth API response');
      const covers = apiData.images.map(image => ({
        url: new URL(image.original)
      }));
      if (covers.length > 0) {
        covers[0].types = [ArtworkTypeIDs.Front];
      }
      return covers;
    }
    createApiUrl(itemId) {
      return new URL(`https://booth.pm/en/items/${itemId}.json`);
    }
  }

  class BugsProvider extends HeadMetaPropertyProvider {
    supportedDomains = ['music.bugs.co.kr'];
    favicon = 'https://file.bugsm.co.kr/wbugs/common/faviconBugs.ico';
    name = 'Bugs!';
    urlRegex = /album\/(\d+)/;
    isSafeRedirect(originalUrl, redirectedUrl) {
      return redirectedUrl.pathname === '/noMusic' || super.isSafeRedirect(originalUrl, redirectedUrl);
    }
    is404Page(document_) {
      return qsMaybe('.pgNoMusic', document_) !== null;
    }
  }

  class DeezerProvider extends HeadMetaPropertyProvider {
    supportedDomains = ['deezer.com'];
    favicon = 'https://cdn-files.dzcdn.net/cache/images/common/favicon/favicon-32x32.ed120c279a693bed3a44.png';
    name = 'Deezer';
    urlRegex = /(?:\w{2}\/)?album\/(\d+)/;
    async findImages(url) {
      const covers = await super.findImages(url);
      return covers.filter(cover => {
        if (cover.url.pathname.includes('d41d8cd98f00b204e9800998ecf8427e')) {
          LOGGER.warn('Ignoring placeholder cover in Deezer release');
          return false;
        }
        return true;
      });
    }
  }

  const QUERY_SHA256 = 'c7033a9fd1facb3e69fa50074b47e8aa0076857a968e6ed086153840e02b988a';
  class DiscogsProvider extends CoverArtProvider {
    supportedDomains = ['discogs.com'];
    favicon = 'https://catalog-assets.discogs.com/e95f0cd9.png';
    name = 'Discogs';
    urlRegex = /\/release\/(\d+)/;
    static apiResponseCache = (() => new Map())();
    async findImages(url) {
      const releaseId = this.extractId(url);
      assertHasValue(releaseId);
      const data = await DiscogsProvider.getReleaseImages(releaseId);
      return data.data.release.images.edges.map(edge => {
        return {
          url: new URL(edge.node.fullsize.sourceUrl)
        };
      });
    }
    static getReleaseImages(releaseId) {
      let responseProm = this.apiResponseCache.get(releaseId);
      if (responseProm === undefined) {
        responseProm = this.actuallyGetReleaseImages(releaseId);
        this.apiResponseCache.set(releaseId, responseProm);
      }
      responseProm.catch(() => {
        if (this.apiResponseCache.get(releaseId) === responseProm) {
          this.apiResponseCache.delete(releaseId);
        }
      });
      return responseProm;
    }
    static async actuallyGetReleaseImages(releaseId) {
      const graphqlParameters = new URLSearchParams({
        operationName: 'ReleaseAllImages',
        variables: JSON.stringify({
          discogsId: Number.parseInt(releaseId),
          count: 500
        }),
        extensions: JSON.stringify({
          persistedQuery: {
            version: 1,
            sha256Hash: QUERY_SHA256
          }
        })
      });
      const response = await request.get(`https://www.discogs.com/internal/release-page/api/graphql?${graphqlParameters}`);
      const metadata = safeParseJSON(response.text, 'Invalid response from Discogs API');
      assertHasValue(metadata.data.release, 'Discogs release does not exist');
      const responseId = metadata.data.release.discogsId.toString();
      assert(responseId === undefined || responseId === releaseId, `Discogs returned wrong release: Requested ${releaseId}, got ${responseId}`);
      return metadata;
    }
    static getFilenameFromUrl(url) {
      const urlParts = url.pathname.split('/');
      const firstFilenameIndex = urlParts.slice(2).findIndex(urlPart => !/^\w+:/.test(urlPart)) + 2;
      const s3Url = urlParts.slice(firstFilenameIndex).join('');
      const s3UrlDecoded = atob(s3Url.slice(0, s3Url.indexOf('.')));
      return s3UrlDecoded.split('/').pop();
    }
    static async maximiseImage(url) {
      const imageName = this.getFilenameFromUrl(url);
      const releaseId = /^R-(\d+)/.exec(imageName)?.[1];
      if (!releaseId) return url;
      const releaseData = await this.getReleaseImages(releaseId);
      const matchedImage = releaseData.data.release.images.edges.find(image => this.getFilenameFromUrl(new URL(image.node.fullsize.sourceUrl)) === imageName);
      if (!matchedImage) return url;
      return new URL(matchedImage.node.fullsize.sourceUrl);
    }
  }

  class FreeMusicArchiveProvider extends CoverArtProvider {
    supportedDomains = ['freemusicarchive.org'];
    favicon = 'https://freemusicarchive.org/img/favicon.svg';
    name = 'Free Music Archive';
    urlRegex = /music\/([^/]+(?:\/[^/]+){1,2})(\/?$|\?)/;
    async findImages(url) {
      const responseDocument = parseDOM(await this.fetchPage(url), url.href);
      const coverImage = qs('.object-cover:not(.hidden)', responseDocument);
      this.checkStandaloneTracks(responseDocument);
      return [{
        url: new URL(coverImage.src),
        types: [ArtworkTypeIDs.Front]
      }];
    }
    checkStandaloneTracks(responseDocument) {
      if (qsMaybe('h1 span', responseDocument)?.textContent.trim() !== 'Track') {
        return;
      }
      const trackInfoJson = qsMaybe('[data-track-info]', responseDocument)?.dataset.trackInfo;
      if (trackInfoJson === undefined) {
        LOGGER.warn('Could not process FMA track information');
        return;
      }
      const trackInfo = safeParseJSON(trackInfoJson);
      if (trackInfo !== undefined && trackInfo.albumTitle !== '-') {
        LOGGER.warn('This FMA track is part of an album rather than a standalone release');
      }
    }
  }

  class JamendoProvider extends HeadMetaPropertyProvider {
    supportedDomains = ['jamendo.com'];
    favicon = 'https://www.jamendo.com/Client/assets/toolkit/images/icon/favicon-32x32.png';
    name = 'Jamendo';
    urlRegex = /album\/(\d+)\/?/;
  }

  class JunoDownloadProvider extends HeadMetaPropertyProvider {
    supportedDomains = ['junodownload.com'];
    favicon = 'https://wwwcdn.junodownload.com/14000200/images/digital/icons/favicon-32x32.png';
    name = 'Juno Download';
    urlRegex = /products(?:\/.+)?\/(\d+-\d+)/;
  }

  class MelonProvider extends HeadMetaPropertyProvider {
    supportedDomains = ['melon.com'];
    favicon = 'https://www.melon.com/favicon.ico';
    name = 'Melon';
    urlRegex = /album\/detail\.htm.*[?&]albumId=(\d+)/;
    cleanUrl(url) {
      return super.cleanUrl(url) + url.search;
    }
    is404Page(document_) {
      return qsMaybe('body > input#returnUrl', document_) !== null;
    }
  }

  class MetalArchivesProvider extends CoverArtProvider {
    supportedDomains = ['metal-archives.com'];
    favicon = 'https://www.metal-archives.com/favicon.ico';
    name = 'Metal Archives';
    urlRegex = /albums\/([^/]+\/[^/]+(?:\/\d+)?)/;
    async findImages(url) {
      const responseContent = await this.fetchPage(url);
      if (/'Release ID "\d+" not found/.test(responseContent)) {
        throw new Error('Release ID not found');
      }
      const responseDocument = parseDOM(responseContent, url.href);
      const imageAnchor = qs('#cover', responseDocument);
      return [{
        url: new URL(imageAnchor.href),
        types: [ArtworkTypeIDs.Front]
      }];
    }
  }

  class MonstercatProvider extends CoverArtProvider {
    supportedDomains = ['monstercat.com', 'player.monstercat.app'];
    favicon = 'https://www.monstercat.com/favicon.ico';
    name = 'Monstercat';
    urlRegex = /release\/([^/]+)/;
    async findImages(url) {
      const releaseId = this.extractId(url);
      assertDefined(releaseId);
      const checkUrl = url.host === 'player.monstercat.app' ? new URL('https://player.monstercat.app/api/catalog/release/' + releaseId) : url;
      await this.fetchPage(checkUrl);
      return [{
        url: new URL(`https://www.monstercat.com/release/${releaseId}/cover`),
        types: [ArtworkTypeIDs.Front]
      }];
    }
  }

  class MusicBrainzProvider extends CoverArtProvider {
    supportedDomains = ['musicbrainz.org', 'beta.musicbrainz.org'];
    favicon = 'https://musicbrainz.org/static/images/favicons/favicon-32x32.png';
    allowButtons = false;
    name = 'MusicBrainz';
    urlRegex = /release\/([a-f\d-]+)/;
    async findImages(url) {
      const mbid = this.extractId(url);
      assertDefined(mbid);
      return new ArchiveProvider().findImagesCAA(`mbid-${mbid}`);
    }
  }
  class CoverArtArchiveProvider extends MusicBrainzProvider {
    supportedDomains = ['coverartarchive.org'];
    favicon = 'https://coverartarchive.org/favicon.png';
    name = 'Cover Art Archive';
    urlRegex = /release\/([a-f\d-]+)\/?$/;
  }

  class MusicCircleProvider extends CoverArtProvider {
    supportedDomains = ['musiccircle.co.in'];
    favicon = 'https://musiccircle.co.in/cdn/shop/files/musiccircle_siteicon_b3ee4fab-31d5-4ff6-aa1d-9a88c84ffaf0.png';
    name = 'MusicCircle';
    urlRegex = /products\/([a-zA-Z\d-]+)/;
    async findImages(url) {
      const responseDocument = parseDOM(await this.fetchPage(url), url.href);
      const imageDivs = qsa('.productView-images-wrapper .productView-thumbnail-link', responseDocument);
      return filterNonNull(imageDivs.map((div, index) => {
        let imageUrl = div.dataset.image;
        if (!imageUrl) {
          LOGGER.error(`Could not extract URL for image at index ${index}`);
          return null;
        }
        if (imageUrl.startsWith('//')) {
          imageUrl = `https:${imageUrl}`;
        }
        return {
          url: new URL(imageUrl)
        };
      }));
    }
  }

  class MusikSammlerProvider extends CoverArtProvider {
    supportedDomains = ['musik-sammler.de'];
    name = 'Musik-Sammler';
    favicon = 'https://www.musik-sammler.de/favicon.ico';
    urlRegex = /release\/(?:.*-)?(\d+)(?:\/|$)/;
    async findImages(url) {
      const page = parseDOM(await this.fetchPage(url), url.href);
      const coverElements = qsa('#imageGallery > li', page);
      return coverElements.map(coverLi => {
        const coverSource = coverLi.dataset.src;
        assertDefined(coverSource, 'Musik-Sammler image without source?');
        return {
          url: new URL(coverSource, 'https://www.musik-sammler.de/')
        };
      });
    }
  }

  const ERROR_404_QUERY = '.n-for404';
  const COVER_IMG_QUERY = '.cover > img.j-img';
  class NetEaseProvider extends CoverArtProvider {
    supportedDomains = ['music.163.com'];
    name = 'NetEase';
    favicon = 'https://s1.music.126.net/style/favicon.ico';
    urlRegex = /\/album\?id=(\d+)/;
    cleanUrl(url) {
      return url.href;
    }
    async findImages(url) {
      const releaseId = this.extractId(url);
      const staticUrl = new URL(`https://music.163.com/album?id=${releaseId}`);
      const responseDocument = parseDOM(await this.fetchPage(staticUrl), url.href);
      if (qsMaybe(ERROR_404_QUERY, responseDocument) !== null) {
        throw new Error('NetEase release does not exist');
      }
      const imageElement = qs(COVER_IMG_QUERY, responseDocument);
      const coverUrl = imageElement.dataset.src;
      assertDefined(coverUrl, 'No image found in NetEase release');
      return [{
        url: new URL(coverUrl),
        types: [ArtworkTypeIDs.Front]
      }];
    }
  }

  class QobuzProvider extends CoverArtProvider {
    supportedDomains = ['qobuz.com', 'open.qobuz.com'];
    favicon = 'https://www.qobuz.com/favicon.ico';
    name = 'Qobuz';
    urlRegex = [/open\.qobuz\.com\/(?:.+?\/)?album\/([A-Za-z\d]+)(?:\/|$)/, /album\/[^/]+\/([A-Za-z\d]+)(?:\/|$)/];
    static get QOBUZ_APP_ID() {
      return '712109809';
    }
    static apiFallbackStatusCodes = [403, 404];
    static idToCoverUrl(id) {
      const d1 = id.slice(-2);
      const d2 = id.slice(-4, -2);
      const imageUrl = `https://static.qobuz.com/images/covers/${d1}/${d2}/${id}_org.jpg`;
      return new URL(imageUrl);
    }
    static async getMetadata(id) {
      const response = await request.get(`https://www.qobuz.com/api.json/0.2/album/get?album_id=${id}&offset=0&limit=20`, {
        headers: {
          'x-app-id': QobuzProvider.QOBUZ_APP_ID
        }
      });
      const metadata = safeParseJSON(response.text, 'Invalid response from Qobuz API');
      assert(metadata.id.toString() === id, `Qobuz returned wrong release: Requested ${id}, got ${metadata.id}`);
      return metadata;
    }
    static extractGoodies(goodies) {
      return goodies.filter(goodie => !!goodie.original_url).map(goodie => {
        const isBooklet = goodie.name.toLowerCase() === 'livret numérique';
        return {
          url: new URL(goodie.original_url),
          types: isBooklet ? [ArtworkTypeIDs.Booklet] : [],
          comment: isBooklet ? 'Qobuz booklet' : goodie.name
        };
      });
    }
    async findImages(url) {
      const id = this.extractId(url);
      assertHasValue(id);
      let metadata;
      try {
        metadata = await QobuzProvider.getMetadata(id);
      } catch (error) {
        if (error instanceof HTTPResponseError && error.statusCode == 400) {
          console.error(error);
          throw new Error('Bad request to Qobuz API, app ID invalid?');
        }
        if (error instanceof HTTPResponseError && QobuzProvider.apiFallbackStatusCodes.includes(error.statusCode)) {
          LOGGER.warn(`Qobuz API returned ${error.statusCode}, falling back on URL rewriting. Booklets may be missed.`);
          return [{
            url: QobuzProvider.idToCoverUrl(id),
            types: [ArtworkTypeIDs.Front]
          }];
        }
        throw error;
      }
      const goodies = QobuzProvider.extractGoodies(metadata.goodies ?? []);
      const coverUrl = metadata.image.large.replace(/_\d+\.([a-zA-Z\d]+)$/, '_org.$1');
      return [{
        url: new URL(coverUrl),
        types: [ArtworkTypeIDs.Front]
      }, ...goodies];
    }
  }

  class RateYourMusicProvider extends HeadMetaPropertyProvider {
    supportedDomains = ['rateyourmusic.com'];
    favicon = 'https://e.snmc.io/2.5/img/sonemic.png';
    name = 'RateYourMusic';
    urlRegex = /\/release\/(\w+(?:\/[^/]+){2})(?:\/|$)/;
    async findImages(url) {
      const releaseId = this.extractId(url);
      assertHasValue(releaseId);
      const coverArtUrl = `https://rateyourmusic.com/release/${releaseId}/coverart/`;
      LOGGER.warn(`Fetched RateYourMusic images are limited to 1200px. Better quality images can be accessed at ${coverArtUrl} but require solving a captcha.`);
      return super.findImages(url);
    }
  }

  class RockipediaProvider extends CoverArtProvider {
    supportedDomains = ['rockipedia.no'];
    favicon = 'https://www.rockipedia.no/wp-content/themes/rockipedia/img/favicon.ico';
    name = 'Rockipedia';
    urlRegex = /utgivelser\/.+?-(\d+)/;
    async findImages(url) {
      const id = this.extractId(url);
      assertDefined(id);
      const imageBrowserUrl = new URL(`https://www.rockipedia.no/?imagebrowser=true&t=album&id=${id}`);
      const imageBrowserDocument = parseDOM(await this.fetchPage(imageBrowserUrl), url.href);
      const coverElements = qsa('li.royalSlide', imageBrowserDocument);
      return filterNonNull(coverElements.map(coverElement => {
        const coverUrl = coverElement.dataset.src;
        if (!coverUrl) {
          LOGGER.warn(`Could not extract a cover for Rockipedia release ${url}: Unexpected null src`);
          return null;
        }
        return {
          url: new URL(coverUrl)
        };
      }));
    }
  }

  const SC_CLIENT_ID_REGEX = /client_id\s*:\s*"([a-zA-Z\d]{32})"/;
  const SC_CLIENT_ID_CACHE_KEY = 'ROpdebee_ECAU_SC_ID';
  const SC_HOMEPAGE = 'https://soundcloud.com/';
  const SC_MAX_TRACK_BATCH_SIZE = 50;
  class SoundCloudProvider extends ProviderWithTrackImages {
    supportedDomains = ['soundcloud.com'];
    favicon = 'https://a-v2.sndcdn.com/assets/images/sc-icons/favicon-2cadd14bdb.ico';
    name = 'SoundCloud';
    urlRegex = [];
    static badArtistIDs = (() => new Set(['you', 'discover', 'stream', 'upload', 'search']))();
    static badSubpaths = (() => new Set(['likes', 'followers', 'following', 'reposts', 'albums', 'tracks', 'popular-tracks', 'comments', 'sets', 'recommended']))();
    static async loadClientID() {
      const pageResponse = await request.get(SC_HOMEPAGE);
      const pageDom = parseDOM(pageResponse.text, SC_HOMEPAGE);
      const scriptUrls = qsa('script', pageDom).map(script => script.src).filter(source => source.startsWith('https://a-v2.sndcdn.com/assets/'));
      collatedSort(scriptUrls);
      for (const scriptUrl of scriptUrls) {
        const contentResponse = await request.get(scriptUrl);
        const content = contentResponse.text;
        const clientId = SC_CLIENT_ID_REGEX.exec(content);
        if (clientId?.[1]) {
          return clientId[1];
        }
      }
      throw new Error('Could not extract SoundCloud Client ID');
    }
    static async getClientID() {
      const cachedID = localStorage.getItem(SC_CLIENT_ID_CACHE_KEY);
      if (cachedID) {
        return cachedID;
      }
      const newID = await this.loadClientID();
      localStorage.setItem(SC_CLIENT_ID_CACHE_KEY, newID);
      return newID;
    }
    static async refreshClientID() {
      const oldId = await this.getClientID();
      const newId = await this.loadClientID();
      assert(oldId !== newId, 'Attempted to refresh SoundCloud Client ID but retrieved the same one.');
      localStorage.setItem(SC_CLIENT_ID_CACHE_KEY, newId);
    }
    supportsUrl(url) {
      const [artistId, ...pathParts] = url.pathname.trim().slice(1).replace(/\/$/, '').split('/');
      return pathParts.length > 0 && !SoundCloudProvider.badArtistIDs.has(artistId) && !SoundCloudProvider.badSubpaths.has(urlBasename(url));
    }
    extractId(url) {
      return url.pathname.slice(1);
    }
    async findImages(url) {
      const pageContent = await this.fetchPage(url);
      const metadata = this.extractMetadataFromJS(pageContent)?.find(data => ['sound', 'playlist'].includes(data.hydratable));
      if (!metadata) {
        throw new Error('Could not extract metadata from SoundCloud page. The release may have been removed.');
      }
      if (metadata.hydratable === 'sound') {
        return this.extractCoverFromTrackMetadata(metadata);
      } else {
        assert(metadata.hydratable === 'playlist');
        return this.extractCoversFromSetMetadata(metadata);
      }
    }
    extractMetadataFromJS(pageContent) {
      const jsonData = />window\.__sc_hydration = (.+);<\/script>/.exec(pageContent)?.[1];
      if (!jsonData) return;
      return safeParseJSON(jsonData);
    }
    extractCoverFromTrackMetadata(metadata) {
      if (!metadata.data.artwork_url) {
        return [];
      }
      const covers = [{
        url: new URL(metadata.data.artwork_url),
        types: [ArtworkTypeIDs.Front]
      }];
      const backdrops = this.extractVisuals(metadata.data);
      covers.push(...backdrops.map(backdropUrl => ({
        url: new URL(backdropUrl),
        types: [ArtworkTypeIDs.Other],
        comment: 'SoundCloud backdrop'
      })));
      return covers;
    }
    async extractCoversFromSetMetadata(metadata) {
      const covers = [];
      if (metadata.data.artwork_url) {
        covers.push({
          url: new URL(metadata.data.artwork_url),
          types: [ArtworkTypeIDs.Front]
        });
      }
      if (await CONFIG.soundcloud.skipTrackImages) return covers;
      const tracks = await this.lazyLoadTracks(metadata.data.tracks);
      const trackCovers = filterNonNull(tracks.flatMap((track, trackNumber) => {
        const trackImages = [];
        if (!track.artwork_url) {
          LOGGER.warn(`Track #${trackNumber + 1} has no track image?`);
        } else {
          trackImages.push({
            url: track.artwork_url,
            trackNumber: (trackNumber + 1).toString()
          });
        }
        const visuals = this.extractVisuals(track);
        trackImages.push(...visuals.map(visualUrl => ({
          url: visualUrl,
          trackNumber: (trackNumber + 1).toString(),
          customCommentPrefix: ['SoundCloud backdrop for track', 'SoundCloud backdrop for tracks']
        })));
        return trackImages;
      }));
      const mergedTrackCovers = await this.mergeTrackImages(trackCovers, metadata.data.artwork_url, true);
      return [...covers, ...mergedTrackCovers];
    }
    async lazyLoadTracks(tracks) {
      const lazyTrackIDs = tracks.filter(track => track.artwork_url === undefined).map(track => track.id);
      if (lazyTrackIDs.length === 0) return tracks;
      let trackData;
      try {
        trackData = await this.getTrackData(lazyTrackIDs);
      } catch (error) {
        LOGGER.error('Failed to load SoundCloud track data, some track images may be missed', error);
        return tracks;
      }
      const trackIdToLoadedTrack = new Map(trackData.map(track => [track.id, track]));
      return tracks.map(track => {
        if (track.artwork_url !== undefined) return track;
        const loadedTrack = trackIdToLoadedTrack.get(track.id);
        if (!loadedTrack) {
          LOGGER.error(`Could not load track data for track ${track.id}, some track images may be missed`);
          return track;
        }
        return loadedTrack;
      });
    }
    async getTrackData(lazyTrackIDs) {
      LOGGER.info('Loading SoundCloud track data');
      const batches = splitChunks(lazyTrackIDs, SC_MAX_TRACK_BATCH_SIZE);
      const batchInfos = [];
      for (const batch of batches) {
        batchInfos.push(await this.getTrackDataBatch(batch));
      }
      return batchInfos.flat();
    }
    async getTrackDataBatch(lazyTrackIDs) {
      let firstTry = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      assert(lazyTrackIDs.length <= SC_MAX_TRACK_BATCH_SIZE, 'Too many tracks to process');
      LOGGER.debug('Loading batch of SoundCloud track data');
      const clientId = await SoundCloudProvider.getClientID();
      const parameters = new URLSearchParams({
        ids: lazyTrackIDs.join(','),
        client_id: clientId
      });
      let trackDataResponse;
      try {
        trackDataResponse = await request.get(`https://api-v2.soundcloud.com/tracks?${parameters}`);
      } catch (error) {
        if (!(firstTry && error instanceof HTTPResponseError && error.statusCode === 401)) {
          throw error;
        }
        LOGGER.debug('Attempting to refresh client ID');
        await SoundCloudProvider.refreshClientID();
        return this.getTrackDataBatch(lazyTrackIDs, false);
      }
      return safeParseJSON(trackDataResponse.text, 'Failed to parse SoundCloud API response');
    }
    extractVisuals(track) {
      return track.visuals?.visuals.map(visual => visual.visual_url) ?? [];
    }
  }

  class SpotifyProvider extends HeadMetaPropertyProvider {
    supportedDomains = ['open.spotify.com'];
    favicon = 'https://open.spotifycdn.com/cdn/images/favicon32.8e66b099.png';
    name = 'Spotify';
    urlRegex = /\/album\/(\w+)/;
    is404Page(document_) {
      return qsMaybe('head > meta[property="og:title"]', document_) === null;
    }
    fetchPage(url, options) {
      return super.fetchPage(url, {
        ...options,
        headers: {
          ...options?.headers,
          'User-Agent': ''
        }
      });
    }
  }

  const APP_ID = 'CzET4vdadNUFQ5JU';
  const COUNTRIES = ['NZ', 'US', 'CA', 'GB', 'NL', 'JP', 'IT', 'DE'];
  class TidalProvider extends CoverArtProvider {
    supportedDomains = ['tidal.com', 'listen.tidal.com', 'store.tidal.com'];
    favicon = 'https://listen.tidal.com/favicon.ico';
    name = 'Tidal';
    urlRegex = /\/album\/(\d+)/;
    countryCode = null;
    async getCountryCode() {
      if (!this.countryCode) {
        const response = await request.get('https://listen.tidal.com/v1/country/context?countryCode=WW&locale=en_US&deviceType=BROWSER', {
          headers: {
            'x-tidal-token': APP_ID
          }
        });
        const codeResponse = safeParseJSON(response.text, 'Invalid JSON response from Tidal API for country code');
        this.countryCode = codeResponse.countryCode;
      }
      assertHasValue(this.countryCode, 'Cannot determine Tidal country');
      return this.countryCode;
    }
    async getCoverUrlFromMetadata(albumId) {
      const metadata = await this.getMetadata(albumId);
      const albumMetadata = metadata.rows[0]?.modules?.[0]?.album;
      assertHasValue(albumMetadata, 'Tidal API returned no album, 404?');
      assert(albumMetadata.id.toString() === albumId, `Tidal returned wrong release: Requested ${albumId}, got ${albumMetadata.id}`);
      const coverId = albumMetadata.cover;
      assertHasValue(coverId, 'Could not find cover in Tidal metadata');
      return `https://resources.tidal.com/images/${coverId.replaceAll('-', '/')}/origin.jpg`;
    }
    async getMetadata(albumId) {
      const countryCode = await this.getCountryCode();
      await request.get('https://listen.tidal.com/v1/ping');
      const countries = [countryCode];
      if (await CONFIG.tidal.checkAllCountries.get()) {
        countries.push(...COUNTRIES);
      }
      const response = await this.getMetadataFromCountries(albumId, countries);
      return safeParseJSON(response.text, 'Invalid response from Tidal API');
    }
    async getMetadataFromCountries(albumId, countries) {
      let lastError;
      for (const countryCode of countries) {
        const apiUrl = `https://listen.tidal.com/v1/pages/album?albumId=${albumId}&countryCode=${countryCode}&deviceType=BROWSER`;
        try {
          const response = await request.get(apiUrl, {
            headers: {
              'x-tidal-token': APP_ID
            },
            httpErrorMessages: {
              404: 'Tidal release does not exist or is not available in your country'
            }
          });
          return response;
        } catch (error) {
          lastError = error;
          LOGGER.warn(`Could not load Tidal album ${albumId} from ${countryCode} API`);
        }
      }
      throw lastError;
    }
    async findImages(url) {
      const albumId = this.extractId(url);
      assertHasValue(albumId);
      const coverUrl = await this.getCoverUrlFromMetadata(albumId);
      return [{
        url: new URL(coverUrl),
        types: [ArtworkTypeIDs.Front]
      }];
    }
  }

  class TraxsourceProvider extends HeadMetaPropertyProvider {
    supportedDomains = ['traxsource.com'];
    favicon = 'https://geo-static.traxsource.com/img/favicon-128x128.png';
    name = 'Traxsource';
    urlRegex = /title\/(\d+)/;
  }

  function mapPackagingType(packaging, caption) {
    if (!caption && packaging === 'Jacket') {
      return {
        type: [ArtworkTypeIDs.Front, ArtworkTypeIDs.Back, ArtworkTypeIDs.Spine],
        comment: ''
      };
    } else if (!caption) {
      return {
        type: [ArtworkTypeIDs.Front],
        comment: packaging
      };
    }
    const types = new Set();
    const keywords = caption.split(/,|\s|and|&/i);
    const typeKeywordsToTypes = [['front', ArtworkTypeIDs.Front], ['back', ArtworkTypeIDs.Back], ['spine', ArtworkTypeIDs.Spine], ['side', ArtworkTypeIDs.Spine], ['top', ArtworkTypeIDs.Top], ['bottom', ArtworkTypeIDs.Bottom], ['interior', ArtworkTypeIDs.Tray], ['inside', ArtworkTypeIDs.Tray]];
    for (const [typeKeyword, type] of typeKeywordsToTypes) {
      if (keywords.some(kw => kw.toLowerCase() === typeKeyword)) {
        types.add(type);
      }
    }
    if (types.has(ArtworkTypeIDs.Front) && types.has(ArtworkTypeIDs.Back)) {
      types.add(ArtworkTypeIDs.Spine);
    }
    const typeKeywords = new Set(typeKeywordsToTypes.map(_ref => {
      let [typeKeyword] = _ref;
      return typeKeyword;
    }));
    const otherKeywords = keywords.filter(kw => !typeKeywords.has(kw.toLowerCase()));
    if (packaging !== 'Jacket') otherKeywords.unshift(packaging);
    const comment = otherKeywords.join(' ').trim();
    return {
      type: types.size > 0 ? [...types] : [ArtworkTypeIDs.Other],
      comment
    };
  }
  function mapDiscType(mediumType, caption) {
    const commentParts = [];
    let type = ArtworkTypeIDs.Medium;
    const keywords = caption.split(/,|\s/).filter(Boolean);
    for (const keyword of keywords) {
      if (/reverse|back/i.test(keyword)) {
        type = ArtworkTypeIDs['Matrix/Runout'];
      } else if (!/front/i.test(keyword)) {
        commentParts.push(keyword);
      }
    }
    if (commentParts.length > 0 && /^\d+/.test(commentParts[0]) || mediumType !== 'Disc') {
      commentParts.unshift(mediumType);
    }
    return {
      type,
      comment: commentParts.join(' ')
    };
  }
  const __CAPTION_TYPE_MAPPING = {
    'front': ArtworkTypeIDs.Front,
    'booklet': ArtworkTypeIDs.Booklet,
    'jacket': mapPackagingType.bind(undefined, 'Jacket'),
    'disc': mapDiscType.bind(undefined, 'Disc'),
    'cd': mapDiscType.bind(undefined, 'CD'),
    'cassette': ArtworkTypeIDs.Medium,
    'vinyl': ArtworkTypeIDs.Medium,
    'dvd': mapDiscType.bind(undefined, 'DVD'),
    'blu-ray': mapDiscType.bind(undefined, 'Blu‐ray'),
    'tray': ArtworkTypeIDs.Tray,
    'back': ArtworkTypeIDs.Back,
    'obi': ArtworkTypeIDs.Obi,
    'box': mapPackagingType.bind(undefined, 'Box'),
    'card': {
      type: ArtworkTypeIDs.Other,
      comment: 'Card'
    },
    'sticker': ArtworkTypeIDs.Sticker,
    'slipcase': mapPackagingType.bind(undefined, 'Slipcase'),
    'digipack': mapPackagingType.bind(undefined, 'Digipak'),
    'sleeve': mapPackagingType.bind(undefined, 'Sleeve'),
    'insert': {
      type: ArtworkTypeIDs.Other,
      comment: 'Insert'
    },
    'inside': ArtworkTypeIDs.Tray,
    'case': mapPackagingType.bind(undefined, 'Case'),
    'contents': ArtworkTypeIDs['Raw/Unedited']
  };
  function convertMappingReturnValue(returnValue) {
    if (Object.prototype.hasOwnProperty.call(returnValue, 'type') && Object.prototype.hasOwnProperty.call(returnValue, 'comment')) {
      const returnValueObject = returnValue;
      return {
        types: Array.isArray(returnValueObject.type) ? returnValueObject.type : [returnValueObject.type],
        comment: returnValueObject.comment
      };
    }
    let types = returnValue;
    if (!Array.isArray(types)) {
      types = [types];
    }
    return {
      types,
      comment: ''
    };
  }
  const CAPTION_TYPE_MAPPING = {};
  for (const [key, value] of Object.entries(__CAPTION_TYPE_MAPPING)) {
    CAPTION_TYPE_MAPPING[key] = caption => {
      if (typeof value === 'function') {
        return convertMappingReturnValue(value(caption));
      }
      const returnValueObject = convertMappingReturnValue(value);
      if (returnValueObject.comment && caption) returnValueObject.comment += ' ' + caption;else if (caption) returnValueObject.comment = caption;
      return returnValueObject;
    };
  }
  const PLACEHOLDER_URL = '/db/img/album-nocover-medium.gif';
  const NSFW_PLACEHOLDER_URL = '/db/img/album-nsfw-medium.gif';
  function cleanupCaption(captionRest) {
    return captionRest.replace(/^\((.+)\)$/, '$1').replace(/^\[(.+)]$/, '$1').replace(/^{(.+)}$/, '$1').replace(/^[-–:]\s*/, '');
  }
  async function convertCaption(caption) {
    LOGGER.debug(`Found caption “${caption}”`);
    const [captionType, ...captionRestParts] = caption.trim().split(/(?=[^a-zA-Z\d-])/);
    const captionRest = cleanupCaption(captionRestParts.join('').trim());
    const mapper = CAPTION_TYPE_MAPPING[captionType.toLowerCase()];
    if (!mapper) {
      LOGGER.debug(`Could not map “${captionType}” to any known cover art types`);
      LOGGER.debug(`Setting cover art comment to “${caption}”`);
      return {
        comment: caption
      };
    }
    const mappedResult = mapper(captionRest);
    LOGGER.debug(`Mapped caption to types ${mappedResult.types} and comment “${mappedResult.comment}”`);
    if (mappedResult.comment !== '' && (await CONFIG.vgmdb.keepEntireComment.get())) {
      mappedResult.comment = caption;
    }
    return mappedResult;
  }
  async function convertCaptions(cover) {
    const url = new URL(cover.url);
    if (!cover.caption) {
      return {
        url
      };
    }
    return {
      url,
      ...(await convertCaption(cover.caption))
    };
  }
  class VGMdbProvider extends CoverArtProvider {
    supportedDomains = ['vgmdb.net'];
    favicon = 'https://vgmdb.net/favicon.ico';
    name = 'VGMdb';
    urlRegex = /\/album\/(\d+)(?:\/|$)/;
    async findImages(url) {
      const pageSource = await this.fetchPage(url);
      if (pageSource.includes('/db/img/banner-error.gif')) {
        throw new Error('VGMdb returned an error');
      }
      const pageDom = parseDOM(pageSource, url.href);
      if (qsMaybe('#navmember', pageDom) === null) {
        LOGGER.warn('Heads up! VGMdb requires you to be logged in to view all images. Some images may have been missed. If you have an account, please log in to VGMdb to fetch all images.');
      }
      const coverGallery = qsMaybe('#cover_gallery', pageDom);
      const galleryCovers = coverGallery ? await VGMdbProvider.extractCoversFromDOMGallery(coverGallery) : [];
      const mainCoverUrl = qsMaybe('#coverart', pageDom)?.style.backgroundImage.match(/url\(["']?(.+?)["']?\)/)?.[1];
      if (mainCoverUrl && mainCoverUrl !== PLACEHOLDER_URL && !galleryCovers.some(cover => urlBasename(cover.url) === urlBasename(mainCoverUrl))) {
        if (mainCoverUrl === NSFW_PLACEHOLDER_URL) {
          LOGGER.warn('Heads up! The main cover of this VGMdb release is marked as NSFW. The original image may have been skipped. Please adjust your VGMdb preferences to show NSFW images to enable fetching these.');
        } else {
          galleryCovers.unshift({
            url: new URL(mainCoverUrl, url.origin),
            types: [ArtworkTypeIDs.Front],
            comment: ''
          });
        }
      }
      return galleryCovers;
    }
    static extractCoversFromDOMGallery(coverGallery) {
      const coverElements = qsa('a[id*="thumb_"]', coverGallery);
      return Promise.all(coverElements.map(this.extractCoverFromAnchor.bind(this)));
    }
    static extractCoverFromAnchor(anchor) {
      return convertCaptions({
        url: anchor.href,
        caption: qs('.label', anchor).textContent
      });
    }
    async findImagesWithApi(url) {
      const id = this.extractId(url);
      assertHasValue(id);
      const apiUrl = `https://vgmdb.info/album/${id}?format=json`;
      const apiResponse = await request.get(apiUrl);
      const metadata = safeParseJSON(apiResponse.text, 'Invalid JSON response from vgmdb.info API');
      assert(metadata.link === 'album/' + id, `VGMdb.info returned wrong release: Requested album/${id}, got ${metadata.link}`);
      return VGMdbProvider.extractImagesFromApiMetadata(metadata);
    }
    static extractImagesFromApiMetadata(metadata) {
      const covers = metadata.covers.map(cover => {
        return {
          url: cover.full,
          caption: cover.name
        };
      });
      if (metadata.picture_full && !covers.some(cover => cover.url === metadata.picture_full)) {
        covers.unshift({
          url: metadata.picture_full,
          caption: 'Front'
        });
      }
      return Promise.all(covers.map(cover => convertCaptions(cover)));
    }
  }

  class VKMusicProvider extends CoverArtProvider {
    supportedDomains = ['*.vk.com'];
    favicon = 'https://vk.com/images/icons/favicons/fav_logo_2x.ico';
    name = 'VK Music';
    urlRegex = [/music\/album\/-(\d+_\d+)/, /audio\?act=audio_playlist-(\d+_\d+)/];
    cleanUrl(url) {
      return url.host + url.pathname + url.search;
    }
    async findImages(url) {
      const page = parseDOM(await this.fetchPage(url), url.href);
      const coverElement = qs('.AudioPlaylistSnippet__cover, .audioPlaylist__cover', page);
      const coverUrl = coverElement.getAttribute('style')?.match(/background-image:\s*url\('(.+)'\);/)?.[1];
      assertHasValue(coverUrl, 'Could not extract cover URL');
      return [{
        url: new URL(coverUrl, url),
        types: [ArtworkTypeIDs.Front]
      }];
    }
  }

  class YandexMusicProvider extends HeadMetaPropertyProvider {
    supportedDomains = ['music.yandex.com', 'music.yandex.ru', 'music.yandex.by', 'music.yandex.uz', 'music.yandex.kz'];
    favicon = 'https://music.yandex.com/favicon32.png';
    name = 'Yandex Music';
    urlRegex = /album\/(\d+)/;
  }

  class YoutubeProvider extends HeadMetaPropertyProvider {
    supportedDomains = ['youtube.com'];
    favicon = 'https://www.youtube.com/s/desktop/e4d15d2c/img/favicon_144x144.png';
    name = 'YouTube';
    urlRegex = /watch\?v=(\w+)/;
    cleanUrl(url) {
      return super.cleanUrl(url) + url.search;
    }
    is404Page(document_) {
      return document_.body.innerHTML.includes("This video isn't available anymore");
    }
    fetchPage(url, options) {
      return super.fetchPage(url, {
        ...options,
        headers: {
          ...options?.headers,
          'Accept-Language': 'en-GB,en;q=0.5'
        }
      });
    }
  }

  const YOUTUBE_MUSIC_DATA_REGEXP = /initialData\.push\({path: '\\\/browse', params: JSON\.parse\('(.+?)'\), data: '(.+?)'}\);/;
  class YoutubeMusicProvider extends CoverArtProvider {
    supportedDomains = ['music.youtube.com'];
    favicon = 'https://music.youtube.com/img/favicon_144.png';
    name = 'YouTube Music';
    urlRegex = /\/(?:playlist\?list=|browse\/|watch\?v=)(\w+)/;
    cleanUrl(url) {
      return super.cleanUrl(url) + url.search;
    }
    async findImages(url) {
      if (url.pathname === '/watch') {
        const ytUrl = new URL(url.toString());
        ytUrl.host = 'www.youtube.com';
        return new YoutubeProvider().findImages(ytUrl);
      }
      const responseDocument = await this.fetchPage(url);
      const pageInfo = this.extractPageInfo(responseDocument);
      this.checkAlbumPage(pageInfo);
      return this.extractImages(pageInfo);
    }
    extractPageInfo(document_) {
      const documentMatch = YOUTUBE_MUSIC_DATA_REGEXP.exec(document_);
      assertHasValue(documentMatch, 'Failed to extract page information, non-existent release?');
      const [stringParameters, stringData] = documentMatch.slice(1).map(string_ => this.unescapeJson(string_));
      return {
        parameters: safeParseJSON(stringParameters, 'Failed to parse `params` JSON data'),
        data: safeParseJSON(stringData, 'Failed to parse `data` JSON data')
      };
    }
    unescapeJson(string_) {
      const unicodeEscaped = string_.replaceAll('\\x', '\\u00');
      const stringified = `"${unicodeEscaped}"`;
      return safeParseJSON(stringified, 'Could not decode YT Music JSON data');
    }
    checkAlbumPage(pageInfo) {
      const config = safeParseJSON(pageInfo.parameters.browseEndpointContextSupportedConfigs);
      const pageType = config.browseEndpointContextMusicConfig.pageType;
      const pageTypeReadable = /_([A-Z]+)$/.exec(pageType)?.[1].toLowerCase() ?? pageType;
      assert(pageType === 'MUSIC_PAGE_TYPE_ALBUM', `Expected an album, got ${pageTypeReadable} instead`);
    }
    extractImages(pageInfo) {
      assert(pageInfo.data.background !== undefined, 'Failed to extract page information, non-existent release?');
      const thumbnails = pageInfo.data.background.musicThumbnailRenderer.thumbnail.thumbnails;
      const thumbnailUrl = thumbnails.at(-1).url;
      return [{
        url: new URL(thumbnailUrl),
        types: [ArtworkTypeIDs.Front]
      }];
    }
  }

  const PROVIDER_DISPATCH = new DispatchMap();
  function addProvider(provider) {
    for (const domain of provider.supportedDomains) {
      PROVIDER_DISPATCH.set(domain, provider);
    }
  }
  addProvider(new AllMusicProvider());
  addProvider(new AmazonProvider());
  addProvider(new AmazonMusicProvider());
  addProvider(new AppleMusicProvider());
  addProvider(new ArchiveProvider());
  addProvider(new AudiomackProvider());
  addProvider(new BandcampProvider());
  addProvider(new BeatportProvider());
  addProvider(new BoothProvider());
  addProvider(new BugsProvider());
  addProvider(new CoverArtArchiveProvider());
  addProvider(new DeezerProvider());
  addProvider(new DiscogsProvider());
  addProvider(new FreeMusicArchiveProvider());
  addProvider(new JamendoProvider());
  addProvider(new JunoDownloadProvider());
  addProvider(new MelonProvider());
  addProvider(new MetalArchivesProvider());
  addProvider(new MonstercatProvider());
  addProvider(new MusicBrainzProvider());
  addProvider(new MusicCircleProvider());
  addProvider(new MusikSammlerProvider());
  addProvider(new NetEaseProvider());
  addProvider(new QobuzProvider());
  addProvider(new RateYourMusicProvider());
  addProvider(new RockipediaProvider());
  addProvider(new SevenDigitalProvider());
  addProvider(new SoundCloudProvider());
  addProvider(new SpotifyProvider());
  addProvider(new TidalProvider());
  addProvider(new TraxsourceProvider());
  addProvider(new VGMdbProvider());
  addProvider(new VKMusicProvider());
  addProvider(new YandexMusicProvider());
  addProvider(new YoutubeMusicProvider());
  addProvider(new YoutubeProvider());
  function extractDomain(url) {
    return url.hostname.replace(/^www\./, '');
  }
  function getProvider(url) {
    const provider = getProviderByDomain(url);
    return provider?.supportsUrl(url) ? provider : undefined;
  }
  function getProviderByDomain(url) {
    return PROVIDER_DISPATCH.get(extractDomain(url));
  }

  function getFilename(url) {
    return decodeURIComponent(urlBasename(url, 'image'));
  }
  class CoverArtDownloader {
    lastId = 0;
    constructor(hooks) {
      this.doneImages = new Set();
      this.hooks = hooks;
    }
    async fetchAndEnqueueCoverArt(batch) {
      if (batch.images.length === 0) return {
        ...batch,
        images: []
      };
      if (this.urlAlreadyAdded(batch.jobUrl)) {
        LOGGER.warn(`${batch.jobUrl} has already been added`);
        return {
          ...batch,
          images: []
        };
      }
      const finalImages = (await CONFIG.fetchFrontOnly.get()) ? this.retainOnlyFront(batch.images) : batch.images;
      const hasMoreImages = batch.images.length !== finalImages.length;
      if (hasMoreImages) {
        LOGGER.info(`Skipping ${batch.images.length - finalImages.length} non-front image(s)`);
      }
      LOGGER.info(`Fetching ${finalImages.length} image(s) for ${batch.jobUrl}…`);
      const queuedResults = await this.fetchAndEnqueue(finalImages, batch.provider?.postprocessImage.bind(batch.provider) ?? identity);
      if (!hasMoreImages && queuedResults.length === finalImages.length) {
        this.doneImages.add(batch.jobUrl.href);
      }
      const containerUrl = queuedResults.length === 1 && queuedResults[0].originalUrl.href === batch.jobUrl.href ? undefined : batch.jobUrl;
      return {
        ...batch,
        containerUrl,
        images: queuedResults
      };
    }
    async fetchAndEnqueue(images, postprocessImage) {
      const queuedResults = [];
      for (const [image, index] of enumerate(images)) {
        if (this.urlAlreadyAdded(image.originalUrl)) {
          LOGGER.warn(`${image.originalUrl} has already been added`);
          continue;
        }
        LOGGER.info(`Fetching ${image.originalUrl} (${index + 1}/${images.length})`);
        try {
          const fetchedImage = await this.downloadImage(image);
          const postprocessedImage = fetchedImage && (await postprocessImage(fetchedImage));
          if (postprocessedImage) {
            const queuedImage = {
              types: image.types,
              comment: image.comment,
              ...fetchedImage
            };
            await enqueueImage(queuedImage);
            queuedResults.push(queuedImage);
          }
        } catch (error) {
          LOGGER.warn(`Skipping ${image.originalUrl}`, error);
        }
      }
      return queuedResults;
    }
    async downloadImage(image) {
      const {
        originalUrl
      } = image;
      const id = this.getImageId();
      this.hooks.onDownloadStarted?.(id, originalUrl);
      try {
        const fetchResult = await this.downloadBestImage(image, id);
        if (fetchResult === null) return null;
        this.doneImages.add(fetchResult.fetchedUrl.href);
        this.doneImages.add(fetchResult.requestedUrl.href);
        this.doneImages.add(originalUrl.href);
        return {
          content: fetchResult.file,
          originalUrl: originalUrl,
          maximisedUrl: fetchResult.requestedUrl,
          finalUrl: fetchResult.fetchedUrl,
          wasMaximised: originalUrl.href !== fetchResult.requestedUrl.href,
          wasRedirected: fetchResult.wasRedirected
        };
      } finally {
        this.hooks.onDownloadFinished?.(id);
      }
    }
    async downloadBestImage(image, id) {
      const {
        originalUrl,
        maximisedUrlCandidates
      } = image;
      for (const maxCandidate of maximisedUrlCandidates) {
        const candidateName = maxCandidate.filename || getFilename(maxCandidate.url);
        if (this.urlAlreadyAdded(maxCandidate.url)) {
          LOGGER.warn(`${maxCandidate.url} has already been added`);
          return null;
        }
        try {
          const result = await this.downloadImageContents(maxCandidate.url, candidateName, id, maxCandidate.headers);
          if (maxCandidate.url.href !== originalUrl.href) {
            LOGGER.info(`Maximised ${originalUrl.href} to ${maxCandidate.url.href}`);
          }
          return result;
        } catch (error) {
          if (maxCandidate.likely_broken) continue;
          LOGGER.warn(`Skipping maximised candidate ${maxCandidate.url}`, error);
        }
      }
      return this.downloadImageContents(originalUrl, getFilename(originalUrl), id, {});
    }
    getImageId() {
      return this.lastId++;
    }
    createUniqueFilename(filename, id, mimeType) {
      const filenameWithoutExtension = filename.replace(/\.(?:png|jpe?g|gif|pdf)$/i, '');
      return `${filenameWithoutExtension}.${id}.${mimeType.split('/')[1]}`;
    }
    async downloadImageContents(url, fileName, id, headers) {
      const xhrOptions = {
        responseType: 'blob',
        headers: headers,
        onProgress: this.hooks.onDownloadProgress?.bind(this.hooks, id, url)
      };
      const response = await pRetry(() => request.get(url, xhrOptions), {
        retries: 10,
        onFailedAttempt: context => {
          const {
            error
          } = context;
          if (!(error instanceof HTTPResponseError) || error.statusCode < 500 && error.statusCode !== 429) {
            throw error;
          }
          LOGGER.info(`Failed to retrieve image contents after ${context.attemptNumber} attempt(s): ${error.message}. Retrying (${context.retriesLeft} attempt(s) left)…`);
        }
      });
      if (response.url === undefined) {
        LOGGER.warn(`Could not detect if URL ${url.href} caused a redirect`);
      }
      const fetchedUrl = new URL(response.url || url);
      const wasRedirected = fetchedUrl.href !== url.href;
      if (wasRedirected) {
        LOGGER.warn(`Followed redirect of ${url.href} -> ${fetchedUrl.href} while fetching image contents`);
      }
      const {
        mimeType,
        isImage
      } = await this.determineMimeType(response);
      if (!isImage) {
        if (!mimeType?.startsWith('text/')) {
          throw new Error(`Expected "${fileName}" to be an image, but received ${mimeType ?? 'unknown file type'}.`);
        }
        const candidateProvider = getProviderByDomain(url);
        if (candidateProvider !== undefined) {
          throw new Error(`This page is not (yet) supported by the ${candidateProvider.name} provider, are you sure this page corresponds to a MusicBrainz release?`);
        }
        throw new Error('Expected to receive an image, but received text. Perhaps this provider is not supported yet?');
      }
      const contentBuffer = await blobToBuffer(response.blob);
      return {
        requestedUrl: url,
        fetchedUrl,
        wasRedirected,
        file: new File([contentBuffer], this.createUniqueFilename(fileName, id, mimeType), {
          type: mimeType
        })
      };
    }
    async determineMimeType(response) {
      const rawFile = new File([response.blob], 'image');
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          const Uint32Array = getFromPageContext('Uint32Array');
          const uint32view = new Uint32Array(reader.result);
          if ((uint32view[0] & 0x00FFFFFF) === 0x00FFD8FF) {
            resolve({
              mimeType: 'image/jpeg',
              isImage: true
            });
          } else {
            switch (uint32view[0]) {
              case 0x38464947:
                resolve({
                  mimeType: 'image/gif',
                  isImage: true
                });
                break;
              case 0x474E5089:
                resolve({
                  mimeType: 'image/png',
                  isImage: true
                });
                break;
              case 0x46445025:
                resolve({
                  mimeType: 'application/pdf',
                  isImage: true
                });
                break;
              default:
                resolve({
                  mimeType: response.headers.get('Content-Type')?.match(/[^;\s]+/)?.[0],
                  isImage: false
                });
            }
          }
        });
        reader.readAsArrayBuffer(rawFile.slice(0, 4));
      });
    }
    urlAlreadyAdded(url) {
      return this.doneImages.has(url.href);
    }
    retainOnlyFront(images) {
      const filtered = images.filter(image => image.types.includes(ArtworkTypeIDs.Front));
      return filtered.length > 0 ? filtered : images.slice(0, 1);
    }
  }

  function maxurl(url, options) {
    return retryTimes(() => {
      $$IMU_EXPORT$$(url, options);
    }, 100, 500);
  }
  const options = {
    fill_object: true,
    exclude_videos: true,
    filter(url) {
      return !url.toLowerCase().endsWith('.webp') && !/:format(webp)/.test(url.toLowerCase());
    }
  };
  const IMU_EXCEPTIONS = new DispatchMap();
  async function getMaximisedCandidates(smallurl) {
    const exceptionFunction = IMU_EXCEPTIONS.get(smallurl.hostname);
    return (exceptionFunction ?? maximiseGeneric)(smallurl);
  }
  async function maximiseGeneric(smallurl) {
    const results = await new Promise(resolve => {
      maxurl(smallurl.href, {
        ...options,
        cb: resolve
      }).catch(error => {
        LOGGER.error('Could not maximise image, maxurl unavailable?', error);
        resolve([]);
      });
    });
    return results.filter(result => !(result.fake || result.bad || result.video)).map(result => ({
      ...result,
      url: new URL(result.url)
    }));
  }
  IMU_EXCEPTIONS.set('i.discogs.com', async smallurl => {
    const fullSizeURL = await DiscogsProvider.maximiseImage(smallurl);
    return [{
      url: fullSizeURL,
      filename: DiscogsProvider.getFilenameFromUrl(smallurl),
      headers: {}
    }];
  });
  IMU_EXCEPTIONS.set('*.mzstatic.com', async smallurl => {
    const results = [];
    const smallOriginalName = /(?:[a-f\d]{2}\/){3}[a-f\d-]{36}\/([^/]+)/.exec(smallurl.href)?.[1];
    for (const imageGeneric of await maximiseGeneric(smallurl)) {
      if (urlBasename(imageGeneric.url) === 'source' && smallOriginalName !== 'source') {
        imageGeneric.likely_broken = true;
      }
      results.push(imageGeneric);
    }
    return results;
  });
  IMU_EXCEPTIONS.set('usercontent.jamendo.com', smallurl => {
    return [{
      url: new URL(smallurl.href.replace(/([&?])width=\d+/, '$1width=0')),
      filename: '',
      headers: {}
    }];
  });
  IMU_EXCEPTIONS.set('hw-img.datpiff.com', smallurl => {
    const urlNoSuffix = smallurl.href.replace(/-(?:large|medium)(\.\w+$)/, '$1');
    return ['-large', '-medium', ''].map(suffix => {
      return {
        url: new URL(urlNoSuffix.replace(/\.(\w+)$/, `${suffix}.$1`)),
        filename: '',
        headers: {}
      };
    });
  });

  class CoverArtResolver {
    cache = (() => new Map())();
    async resolveImages(job) {
      const {
        url
      } = job;
      if (this.cache.has(url.href)) {
        return this.cache.get(url.href);
      }
      let result;
      const provider = getProvider(url);
      if (provider) {
        result = await this.resolveImagesFromProvider(job, provider);
      } else {
        const coverArt = await this.augmentCoverArt({
          url: job.url
        }, job);
        result = {
          jobUrl: url,
          images: [coverArt]
        };
      }
      this.cache.set(url.href, result);
      return result;
    }
    async resolveImagesFromProvider(job, provider) {
      LOGGER.info(`Searching for images in ${provider.name} release…`);
      const {
        url
      } = job;
      const bareImages = await provider.findImages(url);
      const images = await Promise.all(bareImages.map(image => this.augmentCoverArt(image, job)));
      LOGGER.info(`Found ${bareImages.length || 'no'} image(s) in ${provider.name} release`);
      return {
        provider,
        jobUrl: url,
        images
      };
    }
    async augmentCoverArt(image, job) {
      const {
        types: defaultTypes,
        comment: defaultComment
      } = job;
      return {
        ...image,
        types: image.types ?? defaultTypes ?? [],
        comment: image.comment ?? defaultComment ?? '',
        originalUrl: image.url,
        maximisedUrlCandidates: await getMaximisedCandidates(image.url)
      };
    }
  }

  class BaseImage {
    constructor(imageUrl, cache, cacheKey) {
      this.imageUrl = imageUrl;
      this.cacheKey = cacheKey ?? imageUrl;
      this.cache = cache;
    }
    async getDimensions() {
      try {
        const cachedResult = await this.cache?.getDimensions(this.cacheKey);
        if (cachedResult !== undefined) {
          return cachedResult;
        }
      } catch (error) {
        LOGGER.warn('Failed to retrieve image dimensions from cache', error);
      }
      try {
        const liveResult = await getImageDimensions(this.imageUrl);
        await this.cache?.putDimensions(this.cacheKey, liveResult);
        return liveResult;
      } catch (error) {
        LOGGER.error('Failed to retrieve image dimensions', error);
      }
      return undefined;
    }
    async getFileInfo() {
      try {
        const cachedResult = await this.cache?.getFileInfo(this.cacheKey);
        if (cachedResult !== undefined) {
          return cachedResult;
        }
      } catch (error) {
        LOGGER.warn('Failed to retrieve image file info from cache', error);
      }
      try {
        const liveResult = await this.loadFileInfo();
        await this.cache?.putFileInfo(this.cacheKey, liveResult);
        return liveResult;
      } catch (error) {
        LOGGER.error('Failed to retrieve image file info', error);
      }
      return undefined;
    }
    async getImageInfo() {
      const dimensions = await this.getDimensions();
      const fileInfo = await this.getFileInfo();
      return {
        dimensions,
        ...(fileInfo ?? {
          size: undefined,
          fileType: undefined
        })
      };
    }
  }

  const MAX_CACHED_IMAGES = 30;
  const CACHE_LOCALSTORAGE_KEY = 'ROpdebee_dimensions_cache';
  const localStorageCache = {
    getStore: function () {
      const rawStore = localStorage.getItem(CACHE_LOCALSTORAGE_KEY) ?? '{}';
      let store = this.deserializeStore(rawStore);
      if (!store) {
        LOGGER.warn('Cache was malformed, resetting');
        store = this.createEmptyStore();
        this.putStore(store);
      }
      return store;
    },
    putStore: function (store) {
      localStorage.setItem(CACHE_LOCALSTORAGE_KEY, this.serializeStore(store));
    },
    createEmptyStore: function () {
      return new Map();
    },
    serializeStore: function (store) {
      return JSON.stringify(Object.fromEntries(store.entries()));
    },
    deserializeStore: function (rawStore) {
      const rawObject = safeParseJSON(rawStore);
      return rawObject && new Map(Object.entries(rawObject));
    },
    getInfo: function (imageUrl) {
      return this.getStore().get(imageUrl);
    },
    putInfo: function (imageUrl, cacheEntry) {
      const store = this.getStore();
      if (store.size >= MAX_CACHED_IMAGES) {
        const entries = [...store.entries()];
        entries.sort((_ref, _ref2) => {
          let [, info1] = _ref;
          let [, info2] = _ref2;
          return info2.addedDatetime - info1.addedDatetime;
        });
        for (const [url] of entries.slice(MAX_CACHED_IMAGES - 1)) {
          store.delete(url);
        }
      }
      store.set(imageUrl, {
        ...cacheEntry,
        addedDatetime: Date.now()
      });
      this.putStore(store);
    },
    getDimensions: function (imageUrl) {
      return Promise.resolve(this.getInfo(imageUrl)?.dimensions);
    },
    getFileInfo: function (imageUrl) {
      return Promise.resolve(this.getInfo(imageUrl)?.fileInfo);
    },
    putDimensions: function (imageUrl, dimensions) {
      const previousEntry = this.getInfo(imageUrl);
      this.putInfo(imageUrl, {
        ...previousEntry,
        dimensions
      });
      return Promise.resolve();
    },
    putFileInfo: function (imageUrl, fileInfo) {
      const previousEntry = this.getInfo(imageUrl);
      this.putInfo(imageUrl, {
        ...previousEntry,
        fileInfo
      });
      return Promise.resolve();
    }
  };
  class SeederImage extends BaseImage {
    constructor(imageUrl) {
      super(imageUrl, localStorageCache);
    }
    async loadFileInfo() {
      const response = await pRetry(() => request.head(this.imageUrl), {
        retries: 5,
        onFailedAttempt: context => {
          const {
            error
          } = context;
          if (error instanceof HTTPResponseError && error.statusCode < 500 && error.statusCode !== 429) {
            throw error;
          }
          LOGGER.warn(`Failed to retrieve image file info: ${error.message}. Retrying…`);
        }
      });
      const fileSize = response.headers.get('Content-Length')?.match(/\d+/)?.[0];
      const fileType = response.headers.get('Content-Type')?.match(/^\w+\/(\w+)$/)?.[1];
      return {
        fileType: fileType?.toUpperCase(),
        size: fileSize ? Number.parseInt(fileSize) : undefined
      };
    }
  }
  async function getMaximisedImageInfo(imageUrl, maximisedCandidates) {
    for (const maxCandidate of maximisedCandidates) {
      if (maxCandidate.likely_broken) continue;
      LOGGER.debug(`Trying to get image information for maximised candidate ${maxCandidate.url}`);
      const seederImage = new SeederImage(maxCandidate.url.toString());
      const fileInfo = await seederImage.getFileInfo();
      const dimensions = fileInfo && (await seederImage.getDimensions());
      if (!dimensions) {
        LOGGER.warn(`Failed to load dimensions for maximised candidate ${maxCandidate.url}`);
        continue;
      }
      return {
        dimensions,
        ...fileInfo
      };
    }
    return new SeederImage(imageUrl).getImageInfo();
  }
  async function getImageInfo(imageUrl) {
    return getMaximisedImageInfo(imageUrl, await getMaximisedCandidates(new URL(imageUrl)));
  }

  function encodeValue(value) {
    if (value instanceof URL) return value.href;
    if (typeof value === 'string') return value;
    return JSON.stringify(value);
  }
  function decodeSingleKeyValue(key, value, images) {
    const keyName = key.split('.').pop();
    const imageIndexString = /x_seed\.image\.(\d+)\./.exec(key)?.[1];
    if (!imageIndexString || !['url', 'types', 'comment'].includes(keyName)) {
      throw new Error(`Unsupported seeded key: ${key}`);
    }
    const imageIndex = Number.parseInt(imageIndexString);
    if (!images[imageIndex]) {
      images[imageIndex] = {};
    }
    if (keyName === 'url') {
      images[imageIndex].url = new URL(value);
    } else if (keyName === 'types') {
      const types = safeParseJSON(value);
      if (!Array.isArray(types) || types.some(type => typeof type !== 'number')) {
        throw new Error(`Invalid 'types' parameter: ${value}`);
      }
      images[imageIndex].types = types;
    } else {
      images[imageIndex].comment = value;
    }
  }
  class SeedParameters {
    constructor(images, origin) {
      this._images = [...(images ?? [])];
      this.origin = origin;
    }
    get images() {
      return this._images;
    }
    addImage(image) {
      this._images.push(image);
    }
    encode() {
      const seedParameters = new URLSearchParams(this.images.flatMap((image, index) => Object.entries(image).map(_ref => {
        let [key, value] = _ref;
        return [`x_seed.image.${index}.${key}`, encodeValue(value)];
      })));
      if (this.origin) {
        seedParameters.append('x_seed.origin', this.origin);
      }
      return seedParameters;
    }
    createSeedURL(releaseId) {
      let domain = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'musicbrainz.org';
      return `https://${domain}/release/${releaseId}/add-cover-art?${this.encode()}`;
    }
    static decode(seedParameters) {
      let images = [];
      for (const [key, value] of seedParameters) {
        if (!key.startsWith('x_seed.image.')) continue;
        try {
          decodeSingleKeyValue(key, value, images);
        } catch (error) {
          LOGGER.error(`Invalid image seeding param ${key}=${value}`, error);
        }
      }
      images = images.filter((image, index) => {
        if (image.url) {
          return true;
        } else {
          LOGGER.warn(`Ignoring seeded image ${index}: No URL provided`);
          return false;
        }
      });
      const origin = seedParameters.get('x_seed.origin') ?? undefined;
      return new SeedParameters(images, origin);
    }
  }

  const main = ".ROpdebee_paste_url_cont{grid-template-rows:auto auto;grid-template-columns:1fr 1fr;gap:.25rem .5rem;margin-top:10px;margin-left:32px;display:inline-grid;position:relative}.ROpdebee_paste_url_cont>input#ROpdebee_paste_url{grid-column:1/-1}.ROpdebee_paste_url_cont>details.ROpdebee_ecau_config{grid-column:1}.ROpdebee_paste_url_cont>a#ROpdebee_ecau_providers_link{grid-column:2}.ROpdebee_paste_url_cont+span{margin-left:32px}a#ROpdebee_ecau_providers_link{text-align:right;font-size:smaller}.ROpdebee_ecau_config input[type=checkbox],.ROpdebee_ecau_config label{vertical-align:center;display:inline}.ROpdebee_ecau_config label{margin-left:.5em;float:none!important}.ROpdebee_ecau_config details{padding:.5em .5em 0}.ROpdebee_ecau_config .ROpdebee_ecau_config_options{z-index:2;background-color:#ddd;border:1px solid #ccc;border-radius:6px;width:95%;padding:.5em;position:absolute;box-shadow:0 0 5px gray}.ROpdebee_ecau_config summary{cursor:pointer;width:-moz-fit-content;width:fit-content;margin:-.5em -.5em 0;padding:.5em;font-weight:700}.ROpdebee_ecau_config summary:hover{text-decoration:underline}.ROpdebee_import_url_buttons{vertical-align:middle;margin-left:32px;display:inline-block}.ROpdebee_import_url_buttons>#load-info{margin:auto;font-size:x-small;display:block}.ROpdebee_import_url_buttons>div>button{float:none;grid-template-rows:auto auto;grid-template-columns:16px 1fr;place-items:center;column-gap:.5rem;width:100%;margin:4px;display:grid}.ROpdebee_import_url_buttons>div>button>img{grid-row:1/-1;width:16px;height:16px;margin:0!important}.ROpdebee_import_url_buttons>div>button>.provider-title{grid-row:1}.ROpdebee_import_url_buttons>div>button>.provider-metadata{color:gray;grid-row:2;font-size:x-small}.ROpdebee_import_url_buttons>div>button>.provider-metadata.hidden{display:none}.ROpdebee_import_url_buttons>div>button>.provider-metadata.content-loading{background-color:inherit;min-height:16px;position:relative!important}";

  const INPUT_PLACEHOLDER_TEXT = 'or paste one or more URLs here';
  class ProgressElement {
    constructor(url) {
      this.urlSpan = h("span", null, url.href);
      this.progressbar = h("div", {
        className: "ui-progressbar-value ui-widget-header ui-corner-left",
        style: {
          backgroundColor: '#cce5ff',
          width: '0%'
        }
      }, "\xA0");
      this.rootElement = h("tr", {
        style: {
          display: 'flex'
        }
      }, h("td", {
        className: "uploader-preview-column"
      }, h("div", {
        className: "content-loading",
        style: {
          width: '120px',
          height: '120px',
          position: 'relative'
        }
      })), h("td", {
        style: {
          width: '65%'
        }
      }, h("div", {
        className: "row"
      }, h("label", null, "URL:"), this.urlSpan)), h("td", {
        style: {
          flexGrow: 1
        }
      }, h("div", {
        className: "ui-progressbar ui-widget ui-widget-content ui-corner-all",
        role: "progressbar",
        style: {
          width: '100%'
        }
      }, this.progressbar)));
    }
    set url(url) {
      this.urlSpan.textContent = url.href;
    }
    set progress(progressPercentage) {
      this.progressbar.style.width = `${progressPercentage * 100}%`;
    }
  }
  function parseHTMLURLs(htmlText) {
    LOGGER.debug(`Extracting URLs from ${htmlText}`);
    const document_ = parseDOM(htmlText, document.location.origin);
    let urls = qsa('img', document_).map(image => image.src);
    if (urls.length === 0) {
      urls = qsa('a', document_).map(anchor => anchor.href);
    }
    if (urls.length === 0) {
      return parsePlainURLs(document_.body.textContent);
    }
    return [...new Set(urls)].filter(url => /^(?:https?|data):/.test(url));
  }
  function parsePlainURLs(text) {
    return text.trim().split(/\s+/);
  }
  function createCheckbox(property) {
    const propertyId = `ROpdebee_ecau_${property.name}`;
    const checkbox = h("input", {
      type: "checkbox",
      id: propertyId
    });
    property.get().then(value => {
      checkbox.checked = value;
      checkbox.addEventListener('change', () => {
        property.set(checkbox.checked).catch(error => {
          LOGGER.error(`Error when saving checkbox value for ${property.name}: ${error}`);
        });
      });
    }).catch(error => {
      LOGGER.error(`Error when initialising value for ${property.name} checkbox: ${error}`);
    });
    return h("div", null, checkbox, h("label", {
      htmlFor: propertyId
    }, property.description));
  }
  function createConfig() {
    return h("details", {
      className: "ROpdebee_ecau_config"
    }, h("summary", null, "Configure\u2026"), h("div", {
      className: "ROpdebee_ecau_config_options"
    }, createCheckbox(CONFIG.fetchFrontOnly), createCheckbox(CONFIG.skipTrackImagesProperty), createCheckbox(CONFIG.prefetchMetadata), h("h3", null, "Bandcamp"), createCheckbox(CONFIG.bandcamp.skipTrackImagesProperty), createCheckbox(CONFIG.bandcamp.squareCropFirst), h("h3", null, "Soundcloud"), createCheckbox(CONFIG.soundcloud.skipTrackImagesProperty), h("h3", null, "Tidal"), createCheckbox(CONFIG.tidal.checkAllCountries), h("h3", null, "VGMdb"), createCheckbox(CONFIG.vgmdb.keepEntireComment)));
  }
  function providerInfoToString(infos) {
    if (infos.length === 0) {
      return '0 images';
    }
    const fileTypes = new Set(filterNonNull(infos.map(info => info.fileType)));
    let maxDimensions = {
      width: 0,
      height: 0
    };
    for (const currentDimension of infos.map(info => info.dimensions)) {
      if (currentDimension === undefined) continue;
      if (currentDimension.width * currentDimension.height > maxDimensions.width * maxDimensions.height) {
        maxDimensions = currentDimension;
      }
    }
    const maxSize = Math.max(...filterNonNull(infos.map(info => info.size)));
    const parts = [infos.length === 1 ? '1 image' : `${infos.length} images`, [...fileTypes].join('/'), `${maxDimensions.width}×${maxDimensions.height}`, formatFileSize(maxSize)];
    return parts.join(' · ');
  }
  class InputForm {
    providers = [];
    progressElements = (() => new Map())();
    constructor(app) {
      insertStylesheet(main);
      this.urlInput = h("input", {
        type: "url",
        placeholder: INPUT_PLACEHOLDER_TEXT,
        size: 47,
        id: "ROpdebee_paste_url",
        onPaste: async event_ => {
          const htmlText = event_.clipboardData.getData('text/html');
          const plainText = event_.clipboardData.getData('text');
          const urls = htmlText.length > 0 ? parseHTMLURLs(htmlText) : parsePlainURLs(plainText);
          event_.preventDefault();
          event_.currentTarget.placeholder = urls.join('\n');
          const inputUrls = filterNonNull(urls.map(inputUrl => {
            try {
              return new URL(inputUrl);
            } catch (error) {
              LOGGER.error(`Invalid URL: ${inputUrl}`, error);
              return null;
            }
          }));
          if (inputUrls.length === 0) {
            LOGGER.info('No URLs found in input');
            return;
          }
          await app.processURLs(inputUrls);
          app.clearLogLater();
          if (this.urlInput.placeholder === urls.join('\n')) {
            this.urlInput.placeholder = INPUT_PLACEHOLDER_TEXT;
          }
        }
      });
      const container = h("div", {
        className: "ROpdebee_paste_url_cont"
      }, this.urlInput, createConfig(), h("a", {
        href: "https://github.com/ROpdebee/mb-userscripts/blob/main/src/mb_enhanced_cover_art_uploads/docs/supported_providers.md",
        target: "_blank",
        id: "ROpdebee_ecau_providers_link"
      }, "Supported providers"));
      this.buttonList = h("div", {
        className: "buttons"
      });
      this.loadProviderInfoButton = h("button", {
        id: "load-info",
        onClick: event_ => {
          event_.preventDefault();
          this.loadCoverArtInfo();
        }
      }, "Load cover art info\u2026");
      this.buttonContainer = h("div", {
        className: "ROpdebee_import_url_buttons",
        style: {
          display: 'none'
        }
      }, this.buttonList, this.loadProviderInfoButton);
      this.orSpan = h("span", {
        style: {
          display: 'none'
        }
      }, "or");
      qs('#drop-zone').insertAdjacentElement('afterend', container)?.insertAdjacentElement('afterend', this.orSpan)?.insertAdjacentElement('afterend', this.buttonContainer);
      this.fakeSubmitButton = h("button", {
        type: "button",
        className: "submit positive",
        disabled: true,
        hidden: true
      }, "Enter edit");
      qs('form > .buttons').append(this.fakeSubmitButton);
    }
    async addImportButton(handle) {
      const {
        provider,
        url
      } = handle;
      const favicon = await provider.favicon;
      const button = h("button", {
        type: "button",
        title: url,
        onClick: event_ => {
          event_.preventDefault();
          handle.onClick();
        }
      }, h("img", {
        src: favicon,
        alt: provider.name
      }), h("span", {
        className: "provider-title"
      }, 'Import from ' + provider.name), h("span", {
        className: "provider-metadata hidden content-loading"
      }));
      const buttonHandle = {
        ...handle,
        button
      };
      this.providers.push(buttonHandle);
      this.orSpan.style.display = '';
      this.buttonContainer.style.display = '';
      this.buttonList.insertAdjacentElement('beforeend', button);
      if (await CONFIG.prefetchMetadata.get()) {
        this.loadCoverArtInfoForProvider(buttonHandle);
        this.loadProviderInfoButton.style.display = 'none';
      }
    }
    loadCoverArtInfo() {
      this.loadProviderInfoButton.style.display = 'none';
      for (const handle of this.providers) {
        this.loadCoverArtInfoForProvider(handle);
      }
    }
    loadCoverArtInfoForProvider(handle) {
      const metadataSpan = handle.button.querySelector('.provider-metadata');
      handle.getInfo().then(info => {
        metadataSpan.textContent = providerInfoToString(info);
        metadataSpan.classList.remove('content-loading');
        LOGGER.info(`Successfully retrieved image info for ${handle.provider.name}`);
      }).catch(error => {
        LOGGER.error(`Could not retrieve information for ${handle.url}`, error);
        metadataSpan.textContent = 'Error :(';
        metadataSpan.classList.remove('content-loading');
      });
      metadataSpan.classList.remove('hidden');
    }
    disableSubmissions() {
      this.realSubmitButton.hidden = true;
      this.fakeSubmitButton.hidden = false;
    }
    enableSubmissions() {
      this.realSubmitButton.hidden = false;
      this.fakeSubmitButton.hidden = true;
    }
    onDownloadStarted(id, url) {
      const progressElement = new ProgressElement(url);
      this.progressElements.set(id, progressElement);
      qs(`form#${this.formId} tbody`).append(progressElement.rootElement);
    }
    onDownloadFinished(id) {
      const progressElement = this.progressElements.get(id);
      progressElement?.rootElement.remove();
      this.progressElements.delete(id);
    }
    onDownloadProgress(id, url, progress) {
      const progressElement = this.progressElements.get(id);
      assertDefined(progressElement);
      progressElement.url = url;
      if (progress.lengthComputable && progress.total > 0) {
        progressElement.progress = progress.loaded / progress.total;
      }
    }
  }
  class ReleaseInputForm extends InputForm {
    formId = 'add-cover-art';
    constructor(app) {
      super(app);
      this.realSubmitButton = qs('button#add-cover-art-submit');
    }
  }
  class EventInputForm extends InputForm {
    formId = 'add-event-art';
    constructor(app) {
      super(app);
      this.realSubmitButton = qs('button#add-event-art-submit');
    }
  }

  const PROMISE_LIMIT = 8;
  class App {
    loggingSink = (() => new GuiSink())();
    static create() {
      const pageType = /^\/(\w+)\//.exec(window.location.pathname)?.[1];
      if (pageType === 'release') {
        return new ReleaseApp();
      }
      if (pageType === 'event') {
        return new EventApp();
      }
      throw new Error(`Unsupported page type: ${pageType}`);
    }
    constructor() {
      this.note = EditNote.withFooterFromGMInfo();
      this.urlsInProgress = new Set();
      LOGGER.addSink(this.loggingSink);
      qs('.add-files').insertAdjacentElement('afterend', this.loggingSink.rootElement);
      this.fetchingSema = new ObservableSemaphore({
        onAcquired: () => {
          this.ui.disableSubmissions();
        },
        onReleased: () => {
          this.ui.enableSubmissions();
        }
      });
      this.ui = this.createInputForm();
      this.resolver = new CoverArtResolver();
      this.downloader = new CoverArtDownloader(this.ui);
    }
    async processURLs(urls) {
      return this._processURLs(urls.map(url => ({
        url
      })));
    }
    clearLogLater() {
      this.loggingSink.clearAllLater();
    }
    async _processURLs(jobs, origin) {
      const batches = await this.fetchingSema.runInSection(async () => {
        const queuedBatches = [];
        for (const [job, index] of enumerate(jobs)) {
          if (this.urlsInProgress.has(job.url.href)) {
            continue;
          }
          this.urlsInProgress.add(job.url.href);
          if (jobs.length > 1) {
            LOGGER.info(`Fetching ${job.url} (${index + 1}/${jobs.length})`);
          } else {
            LOGGER.info(`Fetching ${job.url}`);
          }
          try {
            const batchMetadata = await this.resolver.resolveImages(job);
            const fetchResult = await this.downloader.fetchAndEnqueueCoverArt(batchMetadata);
            queuedBatches.push(fetchResult);
          } catch (error) {
            LOGGER.error('Failed to fetch or enqueue images', error);
          }
          this.urlsInProgress.delete(job.url.href);
        }
        return queuedBatches;
      });
      fillEditNote(batches, origin ?? '', this.note);
      const totalNumberImages = batches.reduce((accumulator, batch) => accumulator + batch.images.length, 0);
      if (totalNumberImages > 0) {
        LOGGER.success(`Successfully added ${totalNumberImages} image(s)`);
      }
    }
    async processSeedingParameters() {
      const parameters = SeedParameters.decode(new URLSearchParams(document.location.search));
      await this._processURLs(parameters.images, parameters.origin);
      this.clearLogLater();
    }
    async prefetchCoverArtInfo(url) {
      const artInfo = await this.resolver.resolveImages({
        url
      });
      const limit = pLimit(PROMISE_LIMIT);
      const infoPromises = await Promise.allSettled(artInfo.images.map(image => limit(() => getMaximisedImageInfo(image.originalUrl.href, image.maximisedUrlCandidates))));
      const infos = [];
      for (const [infoPromise, index] of enumerate(infoPromises)) {
        if (infoPromise.status === 'rejected') {
          LOGGER.warn(`Could not retrieve image info for ${artInfo.images[index].originalUrl.href}`, infoPromise.reason);
        } else {
          infos.push(infoPromise.value);
        }
      }
      return infos;
    }
  }
  class ReleaseApp extends App {
    createInputForm() {
      return new ReleaseInputForm(this);
    }
    async addImportButtons() {
      const mbid = /musicbrainz\.org\/release\/([a-f\d-]+)\//.exec(window.location.href)?.[1];
      assertHasValue(mbid);
      const attachedURLs = await getURLsForRelease(mbid, {
        excludeEnded: true,
        excludeDuplicates: true
      });
      const supportedURLs = attachedURLs.filter(url => getProvider(url)?.allowButtons);
      if (supportedURLs.length === 0) return;
      const syncProcessURL = url => {
        void pFinally(this.processURLs([url]).catch(error => {
          LOGGER.error(`Failed to process URL ${url.href}`, error);
        }), this.clearLogLater.bind(this));
      };
      const providers = supportedURLs.map(url => {
        const provider = getProvider(url);
        assertHasValue(provider);
        return {
          url,
          provider
        };
      }).sort((a, b) => a.provider.name.localeCompare(b.provider.name));
      await Promise.all(providers.map(_ref => {
        let {
          url,
          provider
        } = _ref;
        return this.ui.addImportButton({
          provider,
          url: url.href,
          onClick: syncProcessURL.bind(this, url),
          getInfo: this.prefetchCoverArtInfo.bind(this, url)
        });
      }));
    }
  }
  class EventApp extends App {
    createInputForm() {
      return new EventInputForm(this);
    }
    addImportButtons() {
      return Promise.resolve();
    }
  }

  const AtisketSeeder = {
    supportedDomains: ['atisket.pulsewidth.org.uk', 'etc.marlonob.info'],
    supportedRegexes: [/(?:\.uk|\.info\/atisket)\/\?.+/],
    insertSeedLinks() {
      addDimensionsToCovers$1();
      const alreadyInMBItems = qsa('.already-in-mb-item');
      if (alreadyInMBItems.length === 0) {
        return;
      }
      const mbids = alreadyInMBItems.map(alreadyInMB => encodeURIComponent(qs('a.mb', alreadyInMB).textContent.trim())).filter(Boolean);
      const cachedAnchor = qsMaybe('#submit-button + div > a');
      addSeedLinkToCovers(mbids, cachedAnchor?.href ?? document.location.href);
    }
  };
  const AtasketSeeder = {
    supportedDomains: ['atisket.pulsewidth.org.uk', 'etc.marlonob.info'],
    supportedRegexes: [/(?:\.uk|\.info\/atisket)\/atasket\.php\?/],
    insertSeedLinks() {
      addDimensionsToCovers$1();
      const urlParameters = new URLSearchParams(document.location.search);
      const mbid = urlParameters.get('release_mbid');
      const selfId = urlParameters.get('self_id');
      if (!mbid || !selfId) {
        LOGGER.error('Cannot extract IDs! Seeding is disabled :(');
        return;
      }
      const cachedUrl = document.location.origin + '/?cached=' + selfId;
      addSeedLinkToCovers([mbid], cachedUrl);
    }
  };
  function addSeedLinkToCovers(mbids, origin) {
    const covers = qsa('figure.cover');
    for (const fig of covers) {
      addSeedLinkToCover$1(fig, mbids, origin);
    }
  }
  function addDimensionsToCovers$1() {
    const covers = qsa('figure.cover');
    for (const fig of covers) {
      addDimensions$1(fig).catch(logFailure('Failed to insert image information'));
    }
  }
  function tryExtractReleaseUrl(fig) {
    const countryCode = fig.closest('div')?.dataset.matchedCountry;
    const vendorId = fig.dataset.vendorId;
    const vendorCode = [...fig.classList].find(klass => ['spf', 'deez', 'itu'].includes(klass));
    if (!vendorCode || !vendorId || typeof countryCode !== 'string' || vendorCode === 'itu' && countryCode === '') {
      LOGGER.error('Could not extract required data for ' + fig.classList.value);
      return;
    }
    return RELEASE_URL_CONSTRUCTORS[vendorCode](vendorId, countryCode);
  }
  function addSeedLinkToCover$1(fig, mbids, origin) {
    const imageUrl = qs('a.icon', fig).href;
    const realUrl = tryExtractReleaseUrl(fig) ?? imageUrl;
    const parameters = new SeedParameters([{
      url: new URL(realUrl)
    }], origin);
    for (const mbid of mbids) {
      const seedUrl = parameters.createSeedURL(mbid);
      const seedLink = h("a", {
        href: seedUrl,
        style: {
          display: 'block'
        }
      }, "Add to release", ' ', mbids.length > 1 ? mbid.split('-')[0] : '');
      qs('figcaption', fig).insertAdjacentElement('beforeend', seedLink);
    }
  }
  async function addDimensions$1(fig) {
    const imageUrl = qs('a.icon', fig).href;
    const dimSpan = h("span", {
      style: {
        display: 'block'
      }
    }, "loading\u2026");
    qs('figcaption > a', fig).insertAdjacentElement('afterend', dimSpan);
    const imageInfo = await getImageInfo(imageUrl);
    const infoStringParts = [imageInfo.dimensions ? `${imageInfo.dimensions.width}×${imageInfo.dimensions.height}` : '', imageInfo.size !== undefined ? formatFileSize(imageInfo.size) : '', imageInfo.fileType];
    const infoString = infoStringParts.filter(Boolean).join(', ');
    if (infoString) {
      dimSpan.textContent = infoString;
    } else {
      dimSpan.remove();
    }
  }
  const RELEASE_URL_CONSTRUCTORS = {
    itu: (id, country) => `https://music.apple.com/${country.toLowerCase()}/album/${id}`,
    deez: id => 'https://www.deezer.com/album/' + id,
    spf: id => 'https://open.spotify.com/album/' + id
  };

  function seederSupportsURL(seeder, url) {
    return seeder.supportedDomains.includes(url.hostname.replace(/^www\./, '')) && seeder.supportedRegexes.some(rgx => rgx.test(url.href));
  }
  const SEEDER_DISPATCH_MAP = new Map();
  function registerSeeder(seeder) {
    for (const domain of seeder.supportedDomains) {
      if (!SEEDER_DISPATCH_MAP.has(domain)) {
        SEEDER_DISPATCH_MAP.set(domain, []);
      }
      SEEDER_DISPATCH_MAP.get(domain).push(seeder);
    }
  }
  function seederFactory(url) {
    return SEEDER_DISPATCH_MAP.get(url.hostname.replace(/^www\./, ''))?.find(seeder => seederSupportsURL(seeder, url));
  }

  const HarmonySeeder = {
    supportedDomains: ['harmony.pulsewidth.org.uk'],
    supportedRegexes: [/\/release\/actions.*release_mbid=([a-f\d-]{36})/],
    insertSeedLinks() {
      const originUrl = new URL(document.location.href);
      const mbid = originUrl.searchParams.get('release_mbid');
      if (!mbid) {
        LOGGER.error('Release MBID not found in URL.');
        return;
      }
      addDimensionsToCovers();
      if (!originUrl.searchParams.has('ts')) {
        const cacheTimestamp = Math.floor(Date.now() / 1000);
        originUrl.searchParams.set('ts', cacheTimestamp.toString());
      }
      addSeedLinksToCovers(mbid, originUrl.href);
    }
  };
  let providerReleaseUrlMap;
  function addSeedLinksToCovers(mbid, origin) {
    const covers = qsa('figure.cover-image');
    if (covers.length === 0) {
      LOGGER.warn('No cover images found on the page.');
      return;
    }
    providerReleaseUrlMap = Object.fromEntries(qsa('ul.provider-list > li').map(li => [li.dataset.provider, qs('a.provider-id', li).href]));
    for (const coverElement of covers) {
      addSeedLinkToCover(coverElement, mbid, origin);
    }
  }
  function addDimensionsToCovers() {
    const covers = qsa('figure.cover-image');
    for (const fig of covers) {
      addDimensions(fig).catch(logFailure('Failed to insert image information'));
    }
  }
  function addSeedLinkToCover(coverElement, mbid, origin) {
    let coverUrl = qs('img', coverElement).src;
    const providerName = coverElement.dataset.provider;
    if (providerName) {
      const releaseUrl = providerReleaseUrlMap[providerName];
      if (releaseUrl && getProvider(new URL(releaseUrl))) {
        coverUrl = releaseUrl;
      }
    }
    const parameters = new SeedParameters([{
      url: new URL(coverUrl)
    }], origin);
    const seedUrl = parameters.createSeedURL(mbid);
    const seedLink = h("a", {
      className: "label",
      href: seedUrl
    }, "+ Add Cover Art");
    qs('figcaption', coverElement).insertAdjacentElement('beforeend', seedLink);
  }
  async function addDimensions(fig) {
    const imageUrl = qs('img', fig).src;
    const dimSpan = h("span", {
      className: "label"
    }, "loading\u2026");
    qs('figcaption', fig).insertAdjacentElement('beforeend', dimSpan);
    const imageInfo = await getImageInfo(imageUrl);
    const infoStringParts = [imageInfo.dimensions ? `${imageInfo.dimensions.width}×${imageInfo.dimensions.height}` : '', imageInfo.size !== undefined ? formatFileSize(imageInfo.size) : '', imageInfo.fileType];
    const infoString = infoStringParts.filter(Boolean).join(', ');
    if (infoString) {
      dimSpan.textContent = infoString;
    } else {
      dimSpan.remove();
    }
  }

  const MusicBrainzSeeder = {
    supportedDomains: ['musicbrainz.org', 'beta.musicbrainz.org'],
    supportedRegexes: [/release\/[a-f\d-]{36}\/cover-art/],
    async insertSeedLinks() {
      const mbid = /musicbrainz\.org\/release\/([a-f\d-]+)\//.exec(window.location.href)?.[1];
      assertHasValue(mbid);
      const attachedURLs = await getURLsForRelease(mbid, {
        excludeEnded: true,
        excludeDuplicates: true
      });
      const buttons = await Promise.all(attachedURLs.map(async url => {
        const provider = getProvider(url);
        if (!provider?.allowButtons) return;
        const favicon = await provider.favicon;
        const seedUrl = new SeedParameters([{
          url
        }]).createSeedURL(mbid, window.location.host);
        return h("a", {
          title: url.href,
          href: seedUrl
        }, h("img", {
          src: favicon,
          alt: provider.name
        }), h("span", null, 'Import from ' + provider.name));
      }));
      const buttonRow = qs('#content > .buttons');
      for (const button of filterNonNull(buttons)) {
        buttonRow.append(button);
      }
    }
  };

  const VGMdbSeeder = {
    supportedDomains: ['vgmdb.net'],
    supportedRegexes: [/\/album\/(\d+)(?:\/|#|\?|$)/],
    async insertSeedLinks() {
      if (!isLoggedIn()) {
        return;
      }
      const coverHeading = qsMaybe('#covernav')?.parentElement;
      if (!coverHeading) {
        LOGGER.info('No covers in release, not inserting seeding menu');
        return;
      }
      const releaseIdsProm = getMBReleases();
      const coversProm = extractCovers();
      try {
        const [releaseIds, covers] = await Promise.all([releaseIdsProm, coversProm]);
        insertSeedButtons(coverHeading, releaseIds, covers);
      } catch (error) {
        LOGGER.error('Failed to insert seed links', error);
      }
    }
  };
  function isLoggedIn() {
    return qsMaybe('#navmember') !== null;
  }
  function getMBReleases() {
    const releaseUrl = 'https://vgmdb.net' + document.location.pathname;
    return getReleaseIDsForURL(releaseUrl);
  }
  async function extractCovers() {
    const covers = await VGMdbProvider.extractCoversFromDOMGallery(qs('#cover_gallery'));
    const publicCovers = await new VGMdbProvider().findImagesWithApi(new URL(document.location.href));
    const publicCoverURLs = new Set(publicCovers.map(cover => cover.url.href));
    const result = {
      allCovers: covers,
      privateCovers: covers.filter(cover => !publicCoverURLs.has(cover.url.href))
    };
    return result;
  }
  function insertSeedButtons(coverHeading, releaseIds, covers) {
    const seedParametersPrivate = new SeedParameters(covers.privateCovers, document.location.href);
    const seedParametersAll = new SeedParameters(covers.allCovers, document.location.href);
    const releaseIdToAnchors = new Map(releaseIds.map(releaseId => {
      const a = h("a", {
        href: seedParametersPrivate.createSeedURL(releaseId),
        target: "_blank",
        rel: "noopener noreferrer",
        style: {
          display: 'block'
        }
      }, 'Seed covers to ' + releaseId.split('-')[0]);
      return [releaseId, a];
    }));
    const anchors = [...releaseIdToAnchors.values()];
    const inclPublicCheckbox = h("input", {
      type: "checkbox",
      id: "ROpdebee_incl_public_checkbox",
      onChange: event_ => {
        for (const [releaseId, a] of releaseIdToAnchors.entries()) {
          const seedParameters = event_.currentTarget.checked ? seedParametersAll : seedParametersPrivate;
          a.href = seedParameters.createSeedURL(releaseId);
        }
      }
    });
    const inclPublicLabel = h("label", {
      htmlFor: "ROpdebee_incl_public_checkbox",
      title: "Leave this unchecked to only seed covers which cannot be extracted by the VGMdb provider",
      style: {
        cursor: 'help'
      }
    }, "Include publicly accessible covers");
    const containedElements = [inclPublicCheckbox, inclPublicLabel, ...anchors];
    if (anchors.length === 0) {
      containedElements.push(h("span", {
        style: {
          display: 'block'
        }
      }, "This album is not linked to any MusicBrainz releases!"));
    }
    const container = h("div", {
      style: {
        padding: '8px 8px 0px 8px',
        fontSize: '8pt'
      }
    }, containedElements);
    coverHeading.nextElementSibling?.insertAdjacentElement('afterbegin', container);
  }

  registerSeeder(AtisketSeeder);
  registerSeeder(AtasketSeeder);
  registerSeeder(HarmonySeeder);
  registerSeeder(MusicBrainzSeeder);
  registerSeeder(VGMdbSeeder);

  if (document.location.hostname === 'musicbrainz.org' || document.location.hostname.endsWith('.musicbrainz.org')) {
      onDocumentLoaded(maybeDisplayNewFeatures);
  }

  const seeder = seederFactory(document.location);
  if (seeder) {
    Promise.resolve(seeder.insertSeedLinks()).catch(error => {
      LOGGER.error('Failed to add seeding links', error);
    });
  } else if (document.location.hostname === 'musicbrainz.org' || document.location.hostname.endsWith('.musicbrainz.org')) {
    const app = App.create();
    app.processSeedingParameters().catch(error => {
      LOGGER.error('Failed to process seeded cover art parameters', error);
    });
    app.addImportButtons().catch(error => {
      LOGGER.error('Failed to add some provider import buttons', error);
    });
  } else {
    LOGGER.error('Somehow I am running on a page I do not support…');
  }

})();
