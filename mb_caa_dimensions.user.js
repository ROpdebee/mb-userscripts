// ==UserScript==
// @name         MB: Display CAA image dimensions
// @description  Displays the dimensions and size of images in the cover art archive.
// @version      2026.2.19.2
// @author       ROpdebee
// @license      MIT; https://opensource.org/licenses/MIT
// @namespace    https://github.com/ROpdebee/mb-userscripts
// @homepageURL  https://github.com/ROpdebee/mb-userscripts
// @supportURL   https://github.com/ROpdebee/mb-userscripts/issues
// @downloadURL  https://raw.github.com/ROpdebee/mb-userscripts/dist/mb_caa_dimensions.user.js
// @updateURL    https://raw.github.com/ROpdebee/mb-userscripts/dist/mb_caa_dimensions.meta.js
// @match        *://*.musicbrainz.org/event/*
// @match        *://*.musicbrainz.org/release/*
// @match        *://*.musicbrainz.org/release-group/*
// @match        *://*.musicbrainz.org/edit/*
// @match        *://*.musicbrainz.org/*/edits*
// @match        *://*.musicbrainz.org/user/*/votes
// @match        *://*.musicbrainz.org/*/open_edits
// @exclude      *://*.musicbrainz.org/event/*/edit
// @exclude      *://*.musicbrainz.org/release/*/edit
// @exclude      *://*.musicbrainz.org/release/*/edit-relationships
// @exclude      *://*.musicbrainz.org/release-group/*/edit
// @run-at       document-start
// @grant        none
// ==/UserScript==

// For original source code, see https://github.com/ROpdebee/mb-userscripts/tree/main/src/mb_caa_dimensions
(function () {
  'use strict';

  /* minified: svg-tag-names, dom-chef, is-network-error, p-retry, ts-custom-error, idb */
  const svgTagNames=["a","altGlyph","altGlyphDef","altGlyphItem","animate","animateColor","animateMotion","animateTransform","animation","audio","canvas","circle","clipPath","color-profile","cursor","defs","desc","discard","ellipse","feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence","filter","font","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignObject","g","glyph","glyphRef","handler","hkern","iframe","image","line","linearGradient","listener","marker","mask","metadata","missing-glyph","mpath","path","pattern","polygon","polyline","prefetch","radialGradient","rect","script","set","solidColor","stop","style","svg","switch","symbol","tbreak","text","textArea","textPath","title","tref","tspan","unknown","use","video","view","vkern"],svgTags=new Set(svgTagNames);svgTags.delete("a"),svgTags.delete("audio"),svgTags.delete("canvas"),svgTags.delete("iframe"),svgTags.delete("script"),svgTags.delete("video");const IS_NON_DIMENSIONAL=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,isFragment=e=>e===DocumentFragment,setCSSProps=(e,t)=>{for(const[r,n]of Object.entries(t))r.startsWith("-")?e.style.setProperty(r,n):"number"!=typeof n||IS_NON_DIMENSIONAL.test(r)?e.style[r]=n:e.style[r]=`${n}px`;},create=e=>"string"==typeof e?svgTags.has(e)?document.createElementNS("http://www.w3.org/2000/svg",e):document.createElement(e):isFragment(e)?document.createDocumentFragment():e(e.defaultProps),setAttribute=(e,t,r)=>{null!=r&&(/^xlink[AHRST]/.test(t)?e.setAttributeNS("http://www.w3.org/1999/xlink",t.replace("xlink","xlink:").toLowerCase(),r):e.setAttribute(t,r));},addChildren=(e,t)=>{for(const r of t)r instanceof Node?e.appendChild(r):Array.isArray(r)?addChildren(e,r):"boolean"!=typeof r&&null!=r&&e.appendChild(document.createTextNode(r));},booleanishAttributes=new Set(["contentEditable","draggable","spellCheck","value","autoReverse","externalResourcesRequired","focusable","preserveAlpha"]),h=function(e,t){var r;const n=create(e);for(var o=arguments.length,a=new Array(o>2?o-2:0),i=2;i<o;i++)a[i-2]=arguments[i];if(addChildren(n,a),n instanceof DocumentFragment||!t)return n;for(let[e,o]of Object.entries(t))if("htmlFor"===e&&(e="for"),"class"===e||"className"===e){const e=null!==(r=n.getAttribute("class"))&&void 0!==r?r:"";setAttribute(n,"class",(e+" "+String(o)).trim());}else if("style"===e)setCSSProps(n,o);else if(e.startsWith("on")){const t=e.slice(2).toLowerCase().replace(/^-/,"");n.addEventListener(t,o);}else "dangerouslySetInnerHTML"===e&&"__html"in o?n.innerHTML=o.__html:"key"===e||!booleanishAttributes.has(e)&&false===o||setAttribute(n,e,true===o?"":o);return n},objectToString=Object.prototype.toString,isError=e=>"[object Error]"===objectToString.call(e),errorMessages=new Set(["network error","Failed to fetch","NetworkError when attempting to fetch resource.","The Internet connection appears to be offline.","Network request failed","fetch failed","terminated"," A network error occurred.","Network connection lost"]);function isNetworkError(e){if(!e||!isError(e)||"TypeError"!==e.name||"string"!=typeof e.message)return  false;const{message:t,stack:r}=e;return "Load failed"===t?void 0===r||"__sentry_captured__"in e:!!t.startsWith("error sending request for url")||errorMessages.has(t)}function validateRetries(e){if("number"==typeof e){if(e<0)throw new TypeError("Expected `retries` to be a non-negative number.");if(Number.isNaN(e))throw new TypeError("Expected `retries` to be a valid number or Infinity, got NaN.")}else if(void 0!==e)throw new TypeError("Expected `retries` to be a number or Infinity.")}function validateNumberOption(e,t){let{min:r=0,allowInfinity:n=false}=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};if(void 0!==t){if("number"!=typeof t||Number.isNaN(t))throw new TypeError(`Expected \`${e}\` to be a number${n?" or Infinity":""}.`);if(!n&&!Number.isFinite(t))throw new TypeError(`Expected \`${e}\` to be a finite number.`);if(t<r)throw new TypeError(`Expected \`${e}\` to be ≥ ${r}.`)}}class AbortError extends Error{constructor(e){super(),e instanceof Error?(this.originalError=e,({message:e}=e)):(this.originalError=new Error(e),this.originalError.stack=this.stack),this.name="AbortError",this.message=e;}}function calculateDelay(e,t){const r=Math.max(1,e+1),n=t.randomize?Math.random()+1:1;let o=Math.round(n*t.minTimeout*t.factor**(r-1));return o=Math.min(o,t.maxTimeout),o}function calculateRemainingTime(e,t){return Number.isFinite(t)?t-(performance.now()-e):t}async function onAttemptFailure(e){let{error:t,attemptNumber:r,retriesConsumed:n,startTime:o,options:a}=e;const i=t instanceof Error?t:new TypeError(`Non-error was thrown: "${t}". You should only throw errors.`);if(i instanceof AbortError)throw i.originalError;const s=Number.isFinite(a.retries)?Math.max(0,a.retries-n):a.retries,c=a.maxRetryTime??Number.POSITIVE_INFINITY,u=Object.freeze({error:i,attemptNumber:r,retriesLeft:s,retriesConsumed:n});if(await a.onFailedAttempt(u),calculateRemainingTime(o,c)<=0)throw i;const l=await a.shouldConsumeRetry(u),f=calculateRemainingTime(o,c);if(f<=0||s<=0)throw i;if(i instanceof TypeError&&!isNetworkError(i)){if(l)throw i;return a.signal?.throwIfAborted(),false}if(!await a.shouldRetry(u))throw i;if(!l)return a.signal?.throwIfAborted(),false;const d=calculateDelay(n,a),p=Math.min(d,f);return a.signal?.throwIfAborted(),p>0&&await new Promise((e,t)=>{const r=()=>{clearTimeout(n),a.signal?.removeEventListener("abort",r),t(a.signal.reason);},n=setTimeout(()=>{a.signal?.removeEventListener("abort",r),e();},p);a.unref&&n.unref?.(),a.signal?.addEventListener("abort",r,{once:true});}),a.signal?.throwIfAborted(),true}async function pRetry(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if(t={...t},validateRetries(t.retries),Object.hasOwn(t,"forever"))throw new Error("The `forever` option is no longer supported. For many use-cases, you can set `retries: Infinity` instead.");t.retries??=10,t.factor??=2,t.minTimeout??=1e3,t.maxTimeout??=Number.POSITIVE_INFINITY,t.maxRetryTime??=Number.POSITIVE_INFINITY,t.randomize??=false,t.onFailedAttempt??=()=>{},t.shouldRetry??=()=>true,t.shouldConsumeRetry??=()=>true,validateNumberOption("factor",t.factor,{min:0,allowInfinity:false}),validateNumberOption("minTimeout",t.minTimeout,{min:0,allowInfinity:false}),validateNumberOption("maxTimeout",t.maxTimeout,{min:0,allowInfinity:true}),validateNumberOption("maxRetryTime",t.maxRetryTime,{min:0,allowInfinity:true}),t.factor>0||(t.factor=1),t.signal?.throwIfAborted();let r=0,n=0;const o=performance.now();for(;!Number.isFinite(t.retries)||n<=t.retries;){r++;try{t.signal?.throwIfAborted();const n=await e(r);return t.signal?.throwIfAborted(),n}catch(e){await onAttemptFailure({error:e,attemptNumber:r,retriesConsumed:n,startTime:o,options:t})&&n++;}}throw new Error("Retry attempts exhausted without throwing an error.")}function fixProto(e,t){var r=Object.setPrototypeOf;r?r(e,t):e.__proto__=t;}function fixStack(e,t){ void 0===t&&(t=e.constructor);var r=Error.captureStackTrace;r&&r(e,t);}var __extends=function(){var e=function(t,r){return e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t;}||function(e,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);},e(t,r)};return function(t,r){if("function"!=typeof r&&null!==r)throw new TypeError("Class extends value "+String(r)+" is not a constructor or null");function n(){this.constructor=t;}e(t,r),t.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n);}}(),CustomError=function(e){function t(t,r){var n=this.constructor,o=e.call(this,t,r)||this;return Object.defineProperty(o,"name",{value:n.name,enumerable:false,configurable:true}),fixProto(o,n.prototype),fixStack(o),o}return __extends(t,e),t}(Error);const instanceOfAny=(e,t)=>t.some(t=>e instanceof t);let idbProxyableTypes,cursorAdvanceMethods;function getIdbProxyableTypes(){return idbProxyableTypes||(idbProxyableTypes=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function getCursorAdvanceMethods(){return cursorAdvanceMethods||(cursorAdvanceMethods=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const transactionDoneMap=new WeakMap,transformCache=new WeakMap,reverseTransformCache=new WeakMap;function promisifyRequest(e){const t=new Promise((t,r)=>{const n=()=>{e.removeEventListener("success",o),e.removeEventListener("error",a);},o=()=>{t(wrap(e.result)),n();},a=()=>{r(e.error),n();};e.addEventListener("success",o),e.addEventListener("error",a);});return reverseTransformCache.set(t,e),t}function cacheDonePromiseForTransaction(e){if(transactionDoneMap.has(e))return;const t=new Promise((t,r)=>{const n=()=>{e.removeEventListener("complete",o),e.removeEventListener("error",a),e.removeEventListener("abort",a);},o=()=>{t(),n();},a=()=>{r(e.error||new DOMException("AbortError","AbortError")),n();};e.addEventListener("complete",o),e.addEventListener("error",a),e.addEventListener("abort",a);});transactionDoneMap.set(e,t);}let idbProxyTraps={get(e,t,r){if(e instanceof IDBTransaction){if("done"===t)return transactionDoneMap.get(e);if("store"===t)return r.objectStoreNames[1]?void 0:r.objectStore(r.objectStoreNames[0])}return wrap(e[t])},set:(e,t,r)=>(e[t]=r,true),has:(e,t)=>e instanceof IDBTransaction&&("done"===t||"store"===t)||t in e};function replaceTraps(e){idbProxyTraps=e(idbProxyTraps);}function wrapFunction(e){return getCursorAdvanceMethods().includes(e)?function(){for(var t=arguments.length,r=new Array(t),n=0;n<t;n++)r[n]=arguments[n];return e.apply(unwrap(this),r),wrap(this.request)}:function(){for(var t=arguments.length,r=new Array(t),n=0;n<t;n++)r[n]=arguments[n];return wrap(e.apply(unwrap(this),r))}}function transformCachableValue(e){return "function"==typeof e?wrapFunction(e):(e instanceof IDBTransaction&&cacheDonePromiseForTransaction(e),instanceOfAny(e,getIdbProxyableTypes())?new Proxy(e,idbProxyTraps):e)}function wrap(e){if(e instanceof IDBRequest)return promisifyRequest(e);if(transformCache.has(e))return transformCache.get(e);const t=transformCachableValue(e);return t!==e&&(transformCache.set(e,t),reverseTransformCache.set(t,e)),t}const unwrap=e=>reverseTransformCache.get(e);function openDB(e,t){let{blocked:r,upgrade:n,blocking:o,terminated:a}=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};const i=indexedDB.open(e,t),s=wrap(i);return n&&i.addEventListener("upgradeneeded",e=>{n(wrap(i.result),e.oldVersion,e.newVersion,wrap(i.transaction),e);}),r&&i.addEventListener("blocked",e=>r(e.oldVersion,e.newVersion,e)),s.then(e=>{a&&e.addEventListener("close",()=>a()),o&&e.addEventListener("versionchange",e=>o(e.oldVersion,e.newVersion,e));}).catch(()=>{}),s}const readMethods=["get","getKey","getAll","getAllKeys","count"],writeMethods=["put","add","delete","clear"],cachedMethods=new Map;function getMethod(e,t){if(!(e instanceof IDBDatabase)||t in e||"string"!=typeof t)return;if(cachedMethods.get(t))return cachedMethods.get(t);const r=t.replace(/FromIndex$/,""),n=t!==r,o=writeMethods.includes(r);if(!(r in(n?IDBIndex:IDBObjectStore).prototype)||!o&&!readMethods.includes(r))return;const a=async function(e){const t=this.transaction(e,o?"readwrite":"readonly");let a=t.store;for(var i=arguments.length,s=new Array(i>1?i-1:0),c=1;c<i;c++)s[c-1]=arguments[c];return n&&(a=a.index(s.shift())),(await Promise.all([a[r](...s),o&&t.done]))[0]};return cachedMethods.set(t,a),a}replaceTraps(e=>({...e,get:(t,r,n)=>getMethod(t,r)||e.get(t,r,n),has:(t,r)=>!!getMethod(t,r)||e.has(t,r)}));const advanceMethodProps=["continue","continuePrimaryKey","advance"],methodMap={},advanceResults=new WeakMap,ittrProxiedCursorToOriginalProxy=new WeakMap,cursorIteratorTraps={get(e,t){if(!advanceMethodProps.includes(t))return e[t];let r=methodMap[t];return r||(r=methodMap[t]=function(){advanceResults.set(this,ittrProxiedCursorToOriginalProxy.get(this)[t](...arguments));}),r}};async function*iterate(){let e=this;if(e instanceof IDBCursor||(e=await e.openCursor(...arguments)),!e)return;const t=new Proxy(e,cursorIteratorTraps);for(ittrProxiedCursorToOriginalProxy.set(t,e),reverseTransformCache.set(t,unwrap(e));e;)yield t,e=await(advanceResults.get(t)||e.continue()),advanceResults.delete(t);}function isIteratorProp(e,t){return t===Symbol.asyncIterator&&instanceOfAny(e,[IDBIndex,IDBObjectStore,IDBCursor])||"iterate"===t&&instanceOfAny(e,[IDBIndex,IDBObjectStore])}replaceTraps(e=>({...e,get:(t,r,n)=>isIteratorProp(t,r)?iterate:e.get(t,r,n),has:(t,r)=>isIteratorProp(t,r)||e.has(t,r)}));

  /* minified: lib */
  class ConsoleSink{constructor(e){this.scriptName=e;}formatMessage(e){return `[${this.scriptName}] ${e}`}onDebug(e){console.debug(this.formatMessage(e));}onLog(e){console.log(this.formatMessage(e));}onInfo(e){console.info(this.formatMessage(e));}onSuccess=this.onInfo.bind(this);onWarn(e,t){e=this.formatMessage(e),t?console.warn(e,t):console.warn(e);}onError(e,t){e=this.formatMessage(e),t?console.error(e,t):console.error(e);}}let LogLevel=function(e){return e[e.DEBUG=0]="DEBUG",e[e.LOG=1]="LOG",e[e.INFO=2]="INFO",e[e.SUCCESS=3]="SUCCESS",e[e.WARNING=4]="WARNING",e[e.ERROR=5]="ERROR",e}({});const HANDLER_NAMES={[LogLevel.DEBUG]:"onDebug",[LogLevel.LOG]:"onLog",[LogLevel.INFO]:"onInfo",[LogLevel.SUCCESS]:"onSuccess",[LogLevel.WARNING]:"onWarn",[LogLevel.ERROR]:"onError"},DEFAULT_OPTIONS={logLevel:LogLevel.INFO,sinks:[]};class Logger{constructor(e){this._configuration={...DEFAULT_OPTIONS,...e};}fireHandlers(e,t,s){if(!(e<this._configuration.logLevel))for(const r of this._configuration.sinks){const n=r[HANDLER_NAMES[e]];n&&(s?n.call(r,t,s):n.call(r,t));}}debug(e){this.fireHandlers(LogLevel.DEBUG,e);}log(e){this.fireHandlers(LogLevel.LOG,e);}info(e){this.fireHandlers(LogLevel.INFO,e);}success(e){this.fireHandlers(LogLevel.SUCCESS,e);}warn(e,t){this.fireHandlers(LogLevel.WARNING,e,t);}error(e,t){this.fireHandlers(LogLevel.ERROR,e,t);}configure(e){Object.assign(this._configuration,e);}get configuration(){return this._configuration}addSink(e){this._configuration.sinks.push(e);}}const LOGGER=new Logger;var USERSCRIPT_ID="mb_caa_dimensions";function logFailure(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"An error occurred";return LOGGER.error.bind(LOGGER,e)}class AssertionError extends Error{}function assert(e,t){if(!e)throw new AssertionError(t??"Assertion failed")}function assertDefined(e,t){assert(void 0!==e,t??"Assertion failed: Expected value to be defined");}function assertNonNull(e,t){assert(null!==e,t??"Assertion failed: Expected value to be non-null");}function qs(e,t){const s=qsMaybe(e,t);return assertNonNull(s,"Could not find required element"),s}function qsMaybe(e,t){return (t??document).querySelector(e)}function qsa(e,t){return [...(t??document).querySelectorAll(e)]}function onDocumentLoaded(e){"loading"!==document.readyState?e():document.addEventListener("DOMContentLoaded",e);}function parseDOM(e,t){const s=(new DOMParser).parseFromString(e,"text/html");if(!qsMaybe("base",s.head)){const e=s.createElement("base");e.href=t,s.head.insertAdjacentElement("beforeend",e);}return s}function insertStylesheet(e,t){if(t??=`ROpdebee_${USERSCRIPT_ID}_css`,null!==qsMaybe(`style#${t}`))return;const s=h("style",{id:t},e);document.head.insertAdjacentElement("beforeend",s);}function formatFileSize(e){const t=0===e?0:Math.floor(Math.log(e)/Math.log(1024));return `${Number((e/Math.pow(1024,t)).toFixed(2))} ${["B","kB","MB","GB","TB"][t]}`}function safeParseJSON(e,t){try{return JSON.parse(e)}catch(e){throw new Error(`${t}: ${e}`)}}function groupBy(e,t,s){const r=new Map;for(const n of e){const e=t(n),o=s(n);r.has(e)?r.get(e)?.push(o):r.set(e,[o]);}return r}class ResponseHeadersImpl{constructor(e){const t=groupBy(e?e.split("\r\n").filter(Boolean).map(e=>{const[t,...s]=e.split(":");return [t.toLowerCase().trim(),s.join(":").trim()]}):[],e=>{let[t]=e;return t},e=>{let[,t]=e;return t});this.map=new Map([...t.entries()].map(e=>{let[t,s]=e;return [t,s.join(",")]})),this.entries=this.map.entries.bind(this.map),this.keys=this.map.keys.bind(this.map),this.values=this.map.values.bind(this.map),this[Symbol.iterator]=this.map[Symbol.iterator].bind(this.map);}get(e){return this.map.get(e.toLowerCase())??null}has(e){return this.map.has(e.toLowerCase())}forEach(e){for(const[t,s]of this.map.entries())e(s,t,this);}}function createTextResponse(e,t){return {...e,text:t,json(){return JSON.parse(this.text)}}}function convertFetchOptions(e,t){if(t)return {method:e,body:t.body,headers:t.headers}}async function createFetchResponse(e,t){const s=e?.responseType??"text",r={headers:t.headers,url:t.url,status:t.status,statusText:t.statusText,rawResponse:t};switch(s){case "text":return createTextResponse(r,await t.text());case "blob":return {...r,blob:await t.blob()};case "arraybuffer":return {...r,arrayBuffer:await t.arrayBuffer()}}}async function performFetchRequest(e,t,s){return createFetchResponse(s,await fetch(new URL(t),convertFetchOptions(e,s)))}function existsInGM(e){return "undefined"!=typeof GM&&void 0!==GM[e]}function GMxmlHttpRequest(e){existsInGM("xmlHttpRequest")?GM.xmlHttpRequest(e):GM_xmlhttpRequest(e);}existsInGM("info")?GM.info:GM_info;class ResponseError extends CustomError{constructor(e,t){super(t),this.url=e;}}class HTTPResponseError extends ResponseError{constructor(e,t,s){s?super(e,s):t.statusText.trim()?super(e,`HTTP error ${t.status}: ${t.statusText}`):super(e,`HTTP error ${t.status}`),this.response=t,this.statusCode=t.status,this.statusText=t.statusText;}}class TimeoutError extends ResponseError{constructor(e){super(e,"Request timed out");}}class AbortedError extends ResponseError{constructor(e){super(e,"Request aborted");}}class NetworkError extends ResponseError{constructor(e){super(e,"Network error");}}function createGMXHRResponse(e,t){const s=e?.responseType??"text",r={headers:new ResponseHeadersImpl(t.responseHeaders),url:t.finalUrl,status:t.status,statusText:t.statusText,rawResponse:t};switch(s){case "text":return createTextResponse(r,t.responseText);case "blob":return {...r,blob:t.response};case "arraybuffer":return {...r,arrayBuffer:t.response}}}function performGMXHRRequest(e,t,s){return new Promise((r,n)=>{GMxmlHttpRequest({method:e,url:t instanceof URL?t.href:t,headers:s?.headers,data:s?.body,responseType:s?.responseType,onload:e=>{r(createGMXHRResponse(s,e));},onerror:()=>{n(new NetworkError(t));},onabort:()=>{n(new AbortedError(t));},ontimeout:()=>{n(new TimeoutError(t));},onprogress:s?.onProgress});})}let RequestBackend=function(e){return e[e.FETCH=1]="FETCH",e[e.GMXHR=2]="GMXHR",e}({});const hasGMXHR="undefined"!=typeof GM_xmlHttpRequest||"undefined"!=typeof GM&&void 0!==GM.xmlHttpRequest;function constructErrorMessage(e,t){const s=e?.httpErrorMessages?.[t.status];return "string"==typeof s?s:void 0!==s?s(t):void 0}const request=async function(e,t,s){const r=s?.backend??(hasGMXHR?RequestBackend.GMXHR:RequestBackend.FETCH),n=await performRequest(r,e,t,s);if((s?.throwForStatus??1)&&n.status>=400){const e=constructErrorMessage(s,n);throw new HTTPResponseError(t,n,e)}return n};function performRequest(e,t,s,r){switch(e){case RequestBackend.FETCH:return performFetchRequest(t,s,r);case RequestBackend.GMXHR:return performGMXHRRequest(t,s,r)}}async function getItemMetadata(e){const t=safeParseJSON((await request.get(new URL(`https://archive.org/metadata/${e}`))).text,"Could not parse IA metadata");if(!t.server)throw new Error("Empty IA metadata, item might not exist");if(t.is_dark)throw new Error("Cannot access IA metadata: This item is darkened");return t}function memoize(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:e=>`${e[0]}`;const s=new Map;return function(){for(var r=arguments.length,n=new Array(r),o=0;o<r;o++)n[o]=arguments[o];const a=t(n);if(!s.has(a)){const t=e(...n);s.set(a,t);}return s.get(a)}}function parseVersion(e){return e.split(".").map(e=>Number.parseInt(e))}function versionLessThan(e,t){let s=0;for(;s<e.length&&s<t.length;){if(e[s]<t[s])return  true;if(e[s]>t[s])return  false;s++;}return e.length<t.length}request.get=request.bind(void 0,"GET"),request.post=request.bind(void 0,"POST"),request.head=request.bind(void 0,"HEAD");var CHANGELOG_URL="https://github.com/ROpdebee/mb-userscripts/blob/dist/mb_caa_dimensions.changelog.md",USERSCRIPT_FEATURE_HISTORY=[{versionAdded:"2026.2.19",description:"gray out thumbnail sizes that are unavailable"},{versionAdded:"2024.7.25",description:"add support for new event art archive (EAA)"},{versionAdded:"2022.7.3",description:"PDF dimensions and page count"}];const banner=".ROpdebee_feature_list{width:-moz-fit-content;width:fit-content;margin:0 auto;font-weight:300}.ROpdebee_feature_list ul{text-align:left;margin:6px 28px 0 0}",LAST_DISPLAYED_KEY=`ROpdebee_${USERSCRIPT_ID}_last_notified_update`;function maybeDisplayNewFeatures(){const e=localStorage.getItem(LAST_DISPLAYED_KEY),t=GM.info.script;if(!e)return void localStorage.setItem(LAST_DISPLAYED_KEY,t.version);const s=parseVersion(e),r=USERSCRIPT_FEATURE_HISTORY.filter(e=>versionLessThan(s,parseVersion(e.versionAdded)));0!==r.length&&showFeatureNotification(t.name,t.version,r.map(e=>e.description));}function showFeatureNotification(e,t,s){insertStylesheet(banner,"ROpdebee_Update_Banner");const r=h("div",{className:"banner warning-header"},h("p",null,`${e} was updated to v${t}! `,h("a",{href:CHANGELOG_URL},"See full changelog here"),". New features since last update:"),h("div",{className:"ROpdebee_feature_list"},h("ul",null,s.map(e=>h("li",null,e)))),h("button",{className:"dismiss-banner remove-item icon","data-banner-name":"alert",type:"button",onClick:()=>{r.remove(),localStorage.setItem(LAST_DISPLAYED_KEY,GM.info.script.version);}}));qs("#page").insertAdjacentElement("beforebegin",r);}

  LOGGER.configure({
      logLevel: LogLevel.INFO,
  });
  LOGGER.addSink(new ConsoleSink(USERSCRIPT_ID));

  const fetchIAMetadata = memoize(itemId => pRetry(() => getItemMetadata(itemId), {
    retries: 5,
    onFailedAttempt: _ref => {
      let {
        error
      } = _ref;
      LOGGER.warn(`Failed to retrieve IA metadata: ${error.cause}. Retrying…`);
    }
  }));
  async function getCAAInfo(itemId, imageId) {
    const iaManifest = await fetchIAMetadata(itemId);
    const fileNameRegex = new RegExp(`mbid-[a-f0-9-]{36}-${imageId}\\.\\w+$`);
    const imageMetadata = iaManifest.files.find(fileMeta => fileNameRegex.test(fileMeta.name));
    if (imageMetadata === undefined) {
      throw new Error(`Could not find image "${imageId}" in IA manifest`);
    }
    const pageCount = imageMetadata.format.endsWith('PDF') ? await tryGetPDFPageCount(itemId, imageId) : undefined;
    return {
      fileType: imageMetadata.format,
      size: Number.parseInt(imageMetadata.size),
      pageCount
    };
  }
  async function tryGetPDFPageCount(itemId, imageId) {
    const zipListingUrl = `https://archive.org/download/${itemId}/${itemId}-${imageId}_jp2.zip/`;
    const zipListingResponse = await request.get(zipListingUrl);
    const page = parseDOM(zipListingResponse.text, zipListingUrl);
    const tbody = qs('tbody', page);
    return qsa('tr', tbody).length - 2;
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

  const CAA_ID_REGEX = /(mbid-[a-f\d-]{36})\/mbid-[a-f\d-]{36}-(\d+)/;
  const CAA_DOMAIN = 'coverartarchive.org';
  const IMG_DOMAINS = /^(cover|event)artarchive\.org$/;
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
  function caaUrlToDirectUrl(urlObject) {
    if (IMG_DOMAINS.test(urlObject.host) && /^\/(event|release)\//.test(urlObject.pathname)) {
      const [releaseId, imageName] = urlObject.pathname.split('/').slice(2);
      urlObject.href = `https://archive.org/download/mbid-${releaseId}/mbid-${releaseId}-${imageName}`;
    }
    return urlObject;
  }
  function urlToCacheKey(fullSizeUrl, thumbnailUrl) {
    const urlObject = new URL(fullSizeUrl);
    if (urlObject.host === CAA_DOMAIN && urlObject.pathname.startsWith('/release-group/')) {
      assertDefined(thumbnailUrl, 'Release group image requires a thumbnail URL');
      return thumbnailUrl;
    }
    return caaUrlToDirectUrl(urlObject).href;
  }
  function urlToDirectImageUrl(url) {
    let urlObject = new URL(url);
    urlObject = caaUrlToDirectUrl(urlObject);
    if (urlObject.pathname.endsWith('.pdf')) {
      const [imageName] = urlObject.pathname.split('/').slice(3);
      const imageBasename = imageName.replace(/\.pdf$/, '');
      urlObject.pathname = urlObject.pathname.replace(/\.pdf$/, `_jp2.zip/${imageBasename}_jp2%2F${imageBasename}_0000.jp2`);
      urlObject.search = '?ext=jpg';
    }
    return urlObject.href;
  }
  function parseCAAIDs(url) {
    const urlObject = new URL(url);
    if (IMG_DOMAINS.test(urlObject.host) && /^\/(event|release)\//.test(urlObject.pathname)) {
      const [releaseId, thumbName] = urlObject.pathname.split('/').slice(2);
      const imageId = /^(\d+)/.exec(thumbName)?.[0];
      assertDefined(imageId, 'Malformed URL');
      return [`mbid-${releaseId}`, imageId];
    }
    if (urlObject.host !== 'archive.org') {
      throw new Error('Unsupported URL');
    }
    const matchGroups = CAA_ID_REGEX.exec(urlObject.pathname);
    if (matchGroups === null) {
      LOGGER.error(`Failed to extract image ID from URL ${url}`);
      throw new Error('Invalid URL');
    }
    const [itemId, imageId] = matchGroups.slice(1);
    return [itemId, imageId];
  }
  class CAAImage extends BaseImage {
    constructor(fullSizeUrl, cache, thumbnailUrl) {
      super(urlToDirectImageUrl(fullSizeUrl), cache, urlToCacheKey(fullSizeUrl, thumbnailUrl));
      const [itemId, imageId] = parseCAAIDs(thumbnailUrl ?? fullSizeUrl);
      this.itemId = itemId;
      this.imageId = imageId;
    }
    loadFileInfo() {
      return getCAAInfo(this.itemId, this.imageId);
    }
  }
  class QueuedUploadImage {
    constructor(imageElement) {
      this.imageElement = imageElement;
    }
    getFileInfo() {
      return Promise.resolve(undefined);
    }
    getDimensions() {
      return new Promise(resolve => {
        const onLoad = () => {
          resolve({
            width: this.imageElement.naturalWidth,
            height: this.imageElement.naturalHeight
          });
        };
        this.imageElement.addEventListener('load', onLoad);
        if (this.imageElement.complete) {
          this.imageElement.removeEventListener('load', onLoad);
          onLoad();
        }
      });
    }
  }

  function createDimensionsString(imageInfo) {
    return imageInfo.dimensions !== undefined ? `${imageInfo.dimensions.width}×${imageInfo.dimensions.height}` : 'failed :(';
  }
  function createFileInfoString(imageInfo) {
    const details = [];
    if (imageInfo.size !== undefined) {
      details.push(formatFileSize(imageInfo.size));
    }
    if (imageInfo.fileType !== undefined) {
      details.push(imageInfo.fileType);
    }
    if (imageInfo.pageCount !== undefined) {
      details.push(imageInfo.pageCount.toString() + (imageInfo.pageCount === 1 ? ' page' : ' pages'));
    }
    return details.join(', ');
  }
  class BaseDisplayedImage {
    _dimensionsSpan = null;
    _fileInfoSpan = null;
    constructor(imageElement, labelPlacementAnchor) {
      this._labelPlacementAnchor = labelPlacementAnchor ?? imageElement;
      this.imageElement = imageElement;
    }
    get dimensionsSpan() {
      if (this._dimensionsSpan !== null) return this._dimensionsSpan;
      this._dimensionsSpan = qsMaybe('span.ROpdebee_dimensions', this.imageElement.parentElement);
      if (this._dimensionsSpan !== null) return this._dimensionsSpan;
      this._dimensionsSpan = h("span", {
        className: "ROpdebee_dimensions"
      });
      this._labelPlacementAnchor.insertAdjacentElement('afterend', this._dimensionsSpan);
      return this._dimensionsSpan;
    }
    get fileInfoSpan() {
      if (this._fileInfoSpan !== null) return this._fileInfoSpan;
      this._fileInfoSpan = qsMaybe('span.ROpdebee_fileInfo', this.imageElement.parentElement);
      if (this._fileInfoSpan !== null) return this._fileInfoSpan;
      this._fileInfoSpan = h("span", {
        className: "ROpdebee_fileInfo"
      });
      this.dimensionsSpan.insertAdjacentElement('afterend', this._fileInfoSpan);
      return this._fileInfoSpan;
    }
  }
  class DisplayedCAAImage extends BaseDisplayedImage {
    imageInfo = null;
    constructor(imageElement, image) {
      super(imageElement);
      this.image = image;
    }
    async loadAndDisplay() {
      if (this.imageElement.getAttribute('ROpdebee_lazyDimensions')) {
        return;
      }
      this.displayInfo('pending…');
      try {
        this.imageInfo = await this.image.getImageInfo();
        this.displayInfo(this.createDimensionsString(this.imageInfo), this.createFileInfoString(this.imageInfo));
      } catch (error) {
        LOGGER.error('Failed to load image information', error);
        this.displayInfo('failed :(');
      }
    }
    displayInfo(dimensionsString, fileInfoString) {
      this.imageElement.setAttribute('ROpdebee_lazyDimensions', dimensionsString);
      this.dimensionsSpan.textContent = dimensionsString;
      if (fileInfoString !== undefined) {
        this.fileInfoSpan.textContent = fileInfoString;
      }
    }
    createDimensionsString(imageInfo) {
      return `Dimensions: ${createDimensionsString(imageInfo)}`;
    }
    createFileInfoString(imageInfo) {
      const detailsString = createFileInfoString(imageInfo);
      if (detailsString) {
        return detailsString;
      }
      return undefined;
    }
  }
  class ArtworkImageAnchorCAAImage extends DisplayedCAAImage {
    constructor(imageElement, cache) {
      const fullSizeUrl = imageElement.closest('a.artwork-image, a.artwork-pdf')?.href;
      assertDefined(fullSizeUrl);
      super(imageElement, new CAAImage(fullSizeUrl, cache, imageElement.src));
    }
  }
  class CoverArtTabCAAImage extends DisplayedCAAImage {
    constructor(imageElement, cache) {
      const container = imageElement.closest('div.artwork-cont');
      assertNonNull(container);
      const anchors = qsa('p.small > a', container);
      const fullSizeUrl = anchors.at(-1).href;
      super(imageElement, new CAAImage(fullSizeUrl, cache));
      this.anchors = anchors;
    }
    async loadAndDisplay() {
      await super.loadAndDisplay();
      if (this.imageInfo?.dimensions === undefined) return;
      const {
        height,
        width
      } = this.imageInfo.dimensions;
      const maxDimension = Math.max(height, width);
      for (const anchor of this.anchors) {
        const resolutionString = /^(\d+)\s*px/.exec(anchor.textContent.trim())?.[1];
        if (resolutionString === undefined) continue;
        const resolution = Number.parseInt(resolutionString);
        if (resolution > maxDimension) {
          anchor.classList.add('unavailable');
        }
      }
    }
  }
  class CAAImageWithFullSizeURL extends DisplayedCAAImage {
    constructor(imageElement, cache) {
      const fullSizeUrl = imageElement.getAttribute('fullSizeURL');
      assertNonNull(fullSizeUrl);
      super(imageElement, new CAAImage(fullSizeUrl, cache));
    }
  }
  class ThumbnailCAAImage extends ArtworkImageAnchorCAAImage {
    createDimensionsString(imageInfo) {
      return createDimensionsString(imageInfo);
    }
  }
  class DisplayedQueuedUploadImage extends BaseDisplayedImage {
    constructor(imageElement) {
      super(imageElement, imageElement.parentElement?.lastElementChild);
      this.image = new QueuedUploadImage(imageElement);
    }
    async loadAndDisplay() {
      if (this.imageElement.src.endsWith('/static/images/icons/pdf-icon.png')) return;
      const dimensions = await this.image.getDimensions();
      const infoString = `${dimensions.width}×${dimensions.height}`;
      this.dimensionsSpan.textContent = infoString;
    }
  }
  function displayedCoverArtFactory(image, cache) {
    try {
      if (image.closest('.artwork-cont') !== null) {
        return new CoverArtTabCAAImage(image, cache);
      } else if (image.closest('.thumb-position') !== null || image.closest('form#set-cover-art') !== null) {
        return new ThumbnailCAAImage(image, cache);
      } else {
        return new ArtworkImageAnchorCAAImage(image, cache);
      }
    } catch (error) {
      LOGGER.error('Failed to process image', error);
      return undefined;
    }
  }
  const displayInfoWhenInView = (() => {
    const imageMap = new Map();
    function inViewCallback(entries) {
      for (const entry of entries) {
        if (entry.intersectionRatio <= 0) continue;
        const image = imageMap.get(entry.target);
        image.loadAndDisplay().catch(logFailure('Failed to process image'));
      }
    }
    const observer = new IntersectionObserver(inViewCallback, {
      root: document
    });
    return image => {
      if (imageMap.has(image.imageElement)) {
        return;
      }
      imageMap.set(image.imageElement, image);
      observer.observe(image.imageElement);
    };
  })();

  function setupExports(cachePromise) {
    async function getCAAImageInfo(imageUrl) {
      if (new URL(imageUrl).hostname !== 'archive.org') {
        throw new Error('Unsupported URL: Need direct image URL');
      }
      const cache = await cachePromise;
      const image = new CAAImage(imageUrl, cache);
      return image.getImageInfo();
    }
    function getDimensionsWhenInView(imageElement) {
      cachePromise.then(cache => {
        const image = new CAAImageWithFullSizeURL(imageElement, cache);
        displayInfoWhenInView(image);
      }).catch(logFailure(`Something went wrong when attempting to load image info for ${imageElement.src}`));
    }
    async function loadImageDimensions(imageUrl) {
      const imageInfo = await getCAAImageInfo(imageUrl);
      return {
        url: imageUrl,
        ...(imageInfo.dimensions ?? {
          width: 0,
          height: 0
        }),
        size: imageInfo.size,
        format: imageInfo.fileType
      };
    }
    window.ROpdebee_getDimensionsWhenInView = getDimensionsWhenInView;
    window.ROpdebee_loadImageDimensions = loadImageDimensions;
    window.ROpdebee_getCAAImageInfo = getCAAImageInfo;
  }

  const CACHE_DB_NAME = 'ROpdebee_CAA_Dimensions_Cache';
  const CACHE_DIMENSIONS_STORE_NAME = 'dimensionsStore';
  const CACHE_FILE_INFO_STORE_NAME = 'fileInfoStore';
  const CACHE_ADDED_TIMESTAMP_INDEX = 'addedDatetimeIdx';
  const CACHE_DB_VERSION = 2;
  const CACHE_TIMESTAMP_NAME = 'ROpdebee_Last_Cache_Prune_Check';
  const CACHE_CHECK_INTERVAL = 24 * 60 * 60 * 1000;
  const CACHE_STALE_TIME = 14 * 24 * 60 * 60 * 1000;
  async function createCache() {
    if (window.indexedDB !== undefined) {
      try {
        return await IndexedDBInfoCache.create();
      } catch (error) {
        LOGGER.error('Failed to create IndexedDB-backed image information cache, repeated lookups will be slow!', error);
      }
    } else {
      LOGGER.warn('Your browser does not seem to support IndexedDB. A persistent image information cache will not be used, which may result in slower lookups. Consider upgrading to a more modern browser version for improved performance.');
    }
    return new NoInfoCache();
  }
  class NoInfoCache {
    getDimensions() {
      return Promise.resolve(undefined);
    }
    putDimensions() {
      return Promise.resolve();
    }
    getFileInfo() {
      return Promise.resolve(undefined);
    }
    putFileInfo() {
      return Promise.resolve();
    }
  }
  class IndexedDBInfoCache {
    constructor(database) {
      this.database = database;
    }
    static async create() {
      return new Promise((resolve, reject) => {
        let wasBlocked = false;
        const databasePromise = openDB(CACHE_DB_NAME, CACHE_DB_VERSION, {
          async upgrade(database, oldVersion, newVersion, tx) {
            LOGGER.info(`Creating or upgrading IndexedDB cache version ${newVersion}`);
            if (oldVersion < 1) {
              const dimensionsStore = database.createObjectStore(CACHE_DIMENSIONS_STORE_NAME);
              dimensionsStore.createIndex(CACHE_ADDED_TIMESTAMP_INDEX, 'addedDatetime');
              const fileInfoStore = database.createObjectStore(CACHE_FILE_INFO_STORE_NAME);
              fileInfoStore.createIndex(CACHE_ADDED_TIMESTAMP_INDEX, 'addedDatetime');
              return;
            }
            while (oldVersion < newVersion) {
              LOGGER.info(`Upgrading IndexedDB cache from version ${oldVersion} to ${oldVersion + 1}`);
              const migrator = DatabaseMigrations[oldVersion];
              await migrator(database, tx);
              oldVersion++;
            }
          },
          blocked() {
            wasBlocked = true;
            reject(new Error('Required schema change on cache DB is blocked by an older version of the script. Please close or reload any other tab on which this script is running'));
          },
          blocking() {
            LOGGER.warn('Closing DB for schema change in other tab');
            databasePromise.then(database => {
              database.close();
            }).catch(logFailure('Failed to close database'));
          }
        });
        databasePromise.then(async database => {
          LOGGER.debug('Successfully opened IndexedDB cache');
          await maybePruneDatabase(database);
          if (!wasBlocked) {
            resolve(new IndexedDBInfoCache(database));
          }
        }).catch(reject);
      });
    }
    async get(storeName, imageUrl) {
      try {
        const cachedResult = await this.database.get(storeName, imageUrl);
        if (cachedResult !== undefined) {
          LOGGER.debug(`${imageUrl}: Cache hit`);
        } else {
          LOGGER.debug(`${imageUrl}: Cache miss`);
        }
        return cachedResult;
      } catch (error) {
        LOGGER.error(`Failed to load ${imageUrl} from cache`, error);
        throw error;
      }
    }
    async put(storeName, imageUrl, value) {
      try {
        await this.database.put(storeName, {
          ...value,
          addedDatetime: Date.now()
        }, imageUrl);
        LOGGER.debug(`Successfully stored ${imageUrl} in cache`);
      } catch (error) {
        LOGGER.error(`Failed to store ${imageUrl} in cache`, error);
      }
    }
    async getDimensions(imageUrl) {
      return this.get(CACHE_DIMENSIONS_STORE_NAME, imageUrl);
    }
    async putDimensions(imageUrl, dimensions) {
      return this.put(CACHE_DIMENSIONS_STORE_NAME, imageUrl, dimensions);
    }
    async getFileInfo(imageUrl) {
      return this.get(CACHE_FILE_INFO_STORE_NAME, imageUrl);
    }
    async putFileInfo(imageUrl, fileInfo) {
      return this.put(CACHE_FILE_INFO_STORE_NAME, imageUrl, fileInfo);
    }
  }
  async function maybePruneDatabase(database) {
    const lastPruneTimestamp = Number.parseInt(localStorage.getItem(CACHE_TIMESTAMP_NAME) ?? '0');
    const timeSinceLastPrune = Date.now() - lastPruneTimestamp;
    if (timeSinceLastPrune < CACHE_CHECK_INTERVAL) {
      LOGGER.debug(`Cache was last pruned at ${new Date(lastPruneTimestamp)}, pruning is unnecessary`);
      return;
    }
    LOGGER.info('Pruning stale entries from cache');
    const pruneRange = IDBKeyRange.upperBound(Date.now() - CACHE_STALE_TIME);
    async function iterateAndPrune(storeName) {
      let cursor = await database.transaction(storeName, 'readwrite').store.index(CACHE_ADDED_TIMESTAMP_INDEX).openCursor(pruneRange);
      while (cursor !== null) {
        LOGGER.debug(`Removing ${cursor.key} (added at ${new Date(cursor.value.addedDatetime)})`);
        await cursor.delete();
        cursor = await cursor.continue();
      }
    }
    await iterateAndPrune(CACHE_DIMENSIONS_STORE_NAME);
    await iterateAndPrune(CACHE_FILE_INFO_STORE_NAME);
    LOGGER.debug('Done pruning stale entries');
    localStorage.setItem(CACHE_TIMESTAMP_NAME, Date.now().toString());
  }
  const DatabaseMigrations = {
    1: async function (database, tx) {
      const txV1 = tx;
      const databaseV1 = database;
      const oldRecords = await txV1.objectStore('cacheStore').getAll();
      databaseV1.deleteObjectStore('cacheStore');
      const newDimensionsStore = database.createObjectStore(CACHE_DIMENSIONS_STORE_NAME);
      const newFileInfoStore = database.createObjectStore(CACHE_FILE_INFO_STORE_NAME);
      newDimensionsStore.createIndex(CACHE_ADDED_TIMESTAMP_INDEX, 'addedDatetime');
      newFileInfoStore.createIndex(CACHE_ADDED_TIMESTAMP_INDEX, 'addedDatetime');
      await Promise.all(oldRecords.map(async rec => {
        await tx.objectStore(CACHE_DIMENSIONS_STORE_NAME).put({
          width: rec.width,
          height: rec.height,
          addedDatetime: rec.added_datetime
        }, rec.url);
        await tx.objectStore(CACHE_FILE_INFO_STORE_NAME).put({
          size: rec.size,
          fileType: rec.format,
          addedDatetime: rec.added_datetime
        }, rec.url);
      }));
    }
  };

  const style = "div.thumb-position{flex-direction:column;height:auto;display:flex}.image-position{flex-flow:wrap;display:flex}div.thumb-position>div:last-of-type:before{margin-bottom:auto}div.thumb-position>div:last-of-type{margin-top:auto;padding-top:5px}div.thumb-position img{margin:auto;display:block}span.cover-art-image,span.artwork-image{display:inline-block}span.ROpdebee_dimensions,span.ROpdebee_fileInfo{display:block}a.artwork-image span.ROpdebee_dimensions,a.artwork-image span.ROpdebee_fileInfo,a.artwork-pdf span.ROpdebee_dimensions,a.artwork-pdf span.ROpdebee_fileInfo{text-align:center}td.edit-cover-art span.ROpdebee_dimensions,td.edit-cover-art span.ROpdebee_fileInfo,td.edit-event-art span.ROpdebee_dimensions,td.edit-event-art span.ROpdebee_fileInfo{max-width:250px}div.thumb-position span.ROpdebee_dimensions,div.thumb-position span.ROpdebee_fileInfo{text-align:center;font-size:smaller}div.thumb-position span.ROpdebee_dimensions{padding-top:.5em}div.thumb-position span.ROpdebee_fileInfo{padding-bottom:.5em}img.uploader-preview-column>span.ROpdebee_dimensions{display:inline}.artwork-cont a.unavailable{color:gray;text-decoration:line-through}";

  if (document.location.hostname === 'musicbrainz.org' || document.location.hostname.endsWith('.musicbrainz.org')) {
      onDocumentLoaded(maybeDisplayNewFeatures);
  }

  const ARTWORK_QUERY = '.cover-art-image, .artwork-image';
  function processPageChange(mutations, cache) {
    const addedNodes = mutations.flatMap(mutation => [...mutation.addedNodes]);
    for (const addedNode of addedNodes) {
      if (!(addedNode instanceof HTMLImageElement)) continue;
      const displayedImage = displayedCoverArtFactory(addedNode, cache);
      if (displayedImage !== undefined) {
        displayInfoWhenInView(displayedImage);
      }
    }
  }
  function observeQueuedUploads(queuedUploadTable) {
    const queuedUploadObserver = new MutationObserver(mutations => {
      const addedNodes = mutations.flatMap(mutation => [...mutation.addedNodes]);
      for (const addedNode of addedNodes) {
        if (!(addedNode instanceof HTMLTableRowElement)) continue;
        const image = qsMaybe('img', addedNode);
        if (image !== null) {
          displayInfoWhenInView(new DisplayedQueuedUploadImage(image));
        }
      }
    });
    queuedUploadObserver.observe(qs('tbody', queuedUploadTable), {
      childList: true
    });
  }
  function detectAndObserveImages(cache) {
    const imageLoadObserver = new MutationObserver(mutations => {
      processPageChange(mutations, cache);
    });
    for (const container of qsa(ARTWORK_QUERY)) {
      const imageElement = qsMaybe('img', container);
      if (imageElement === null) {
        imageLoadObserver.observe(container, {
          childList: true
        });
      } else {
        const displayedImage = displayedCoverArtFactory(imageElement, cache);
        if (!displayedImage) continue;
        displayInfoWhenInView(displayedImage);
      }
    }
    const queuedUploadTable = qsMaybe('#add-cover-art > table');
    if (queuedUploadTable !== null) {
      observeQueuedUploads(queuedUploadTable);
    }
  }
  const cachePromise = createCache();
  setupExports(cachePromise);
  onDocumentLoaded(() => {
    insertStylesheet(style);
    cachePromise.then(cache => {
      detectAndObserveImages(cache);
    }).catch(logFailure());
  });

})();
