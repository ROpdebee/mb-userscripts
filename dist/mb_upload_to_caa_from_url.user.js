// ==UserScript==
// @name         MB: Upload to CAA From URL
// @description  Upload covers to the CAA by pasting a URL! Workaround for MBS-4641.
// @version      2021.9.21
// @author       ROpdebee
// @license      MIT; https://opensource.org/licenses/MIT
// @namespace    https://github.com/ROpdebee/mb-userscripts
// @homepageURL  https://github.com/ROpdebee/mb-userscripts
// @supportURL   https://github.com/ROpdebee/mb-userscripts/issues
// @downloadURL  https://raw.github.com/ROpdebee/mb-userscripts/main/dist/mb_upload_to_caa_from_url.user.js
// @updateURL    https://raw.github.com/ROpdebee/mb-userscripts/main/dist/mb_upload_to_caa_from_url.meta.js
// @match        *://*.musicbrainz.org/release/*/add-cover-art
// @match        *://atisket.pulsewidth.org.uk/*
// @exclude      *://atisket.pulsewidth.org.uk/
// @require      https://github.com/qsniyg/maxurl/blob/master/userscript.user.js?raw=true
// @run-at       document-load
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @connect      *
// ==/UserScript==

(function () {
  'use strict';

  /* minified: nativejsx, @babel/runtime, regenerator-runtime */
  var t=function(t,r){(r=Array.isArray(r)?r:[r]).forEach((function(r){r instanceof HTMLElement?t.appendChild(r):(r||"string"==typeof r)&&t.appendChild(document.createTextNode(r.toString()));}));},r=function(t,r){for(var e in r)t.style[e]=r[e];};function e(t,r){(null==r||r>t.length)&&(r=t.length);for(var e=0,n=new Array(r);e<r;e++)n[e]=t[e];return n}function n(t,r){if(t){if("string"==typeof t)return e(t,r);var n=Object.prototype.toString.call(t).slice(8,-1);return "Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?e(t,r):void 0}}function o(t,r){return function(t){if(Array.isArray(t))return t}(t)||function(t,r){var e=t&&("undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"]);if(null!=e){var n,o,i=[],a=!0,u=!1;try{for(e=e.call(t);!(a=(n=e.next()).done)&&(i.push(n.value),!r||i.length!==r);a=!0);}catch(c){u=!0,o=c;}finally{try{a||null==e.return||e.return();}finally{if(u)throw o}}return i}}(t,r)||n(t,r)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function i(t,r,e,n,o,i,a){try{var u=t[i](a),c=u.value;}catch(f){return void e(f)}u.done?r(c):Promise.resolve(c).then(n,o);}function a(t){return function(){var r=this,e=arguments;return new Promise((function(n,o){var a=t.apply(r,e);function u(t){i(a,n,o,u,c,"next",t);}function c(t){i(a,n,o,u,c,"throw",t);}u(void 0);}))}}function u(t,r){if(!(t instanceof r))throw new TypeError("Cannot call a class as a function")}function c(t,r){for(var e=0;e<r.length;e++){var n=r[e];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n);}}function f(t,r,e){return r&&c(t.prototype,r),e&&c(t,e),t}function l(t,r,e){if(!r.has(t))throw new TypeError("attempted to "+e+" private field on non-instance");return r.get(t)}function s(t,r){return function(t,r){return r.get?r.get.call(t):r.value}(t,l(t,r,"get"))}function h(t,r,e){return function(t,r,e){if(r.set)r.set.call(t,e);else {if(!r.writable)throw new TypeError("attempted to set read only private field");r.value=e;}}(t,l(t,r,"set"),e),e}function p(t){var r;if("undefined"!=typeof Symbol&&(Symbol.asyncIterator&&(r=t[Symbol.asyncIterator]),null==r&&Symbol.iterator&&(r=t[Symbol.iterator])),null==r&&(r=t["@@asyncIterator"]),null==r&&(r=t["@@iterator"]),null==r)throw new TypeError("Object is not async iterable");return r.call(t)}function y(t){return (y="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}var v={exports:{}};!function(t){var r=function(t){var r,e=Object.prototype,n=e.hasOwnProperty,o="function"==typeof Symbol?Symbol:{},i=o.iterator||"@@iterator",a=o.asyncIterator||"@@asyncIterator",u=o.toStringTag||"@@toStringTag";function c(t,r,e){return Object.defineProperty(t,r,{value:e,enumerable:!0,configurable:!0,writable:!0}),t[r]}try{c({},"");}catch(I){c=function(t,r,e){return t[r]=e};}function f(t,r,e,n){var o=r&&r.prototype instanceof m?r:m,i=Object.create(o.prototype),a=new P(n||[]);return i._invoke=function(t,r,e){var n=s;return function(o,i){if(n===p)throw new Error("Generator is already running");if(n===v){if("throw"===o)throw i;return A()}for(e.method=o,e.arg=i;;){var a=e.delegate;if(a){var u=j(a,e);if(u){if(u===d)continue;return u}}if("next"===e.method)e.sent=e._sent=e.arg;else if("throw"===e.method){if(n===s)throw n=v,e.arg;e.dispatchException(e.arg);}else "return"===e.method&&e.abrupt("return",e.arg);n=p;var c=l(t,r,e);if("normal"===c.type){if(n=e.done?v:h,c.arg===d)continue;return {value:c.arg,done:e.done}}"throw"===c.type&&(n=v,e.method="throw",e.arg=c.arg);}}}(t,e,a),i}function l(t,r,e){try{return {type:"normal",arg:t.call(r,e)}}catch(I){return {type:"throw",arg:I}}}t.wrap=f;var s="suspendedStart",h="suspendedYield",p="executing",v="completed",d={};function m(){}function g(){}function w(){}var b={};b[i]=function(){return this};var x=Object.getPrototypeOf,E=x&&x(x(T([])));E&&E!==e&&n.call(E,i)&&(b=E);var S=w.prototype=m.prototype=Object.create(b);function L(t){["next","throw","return"].forEach((function(r){c(t,r,(function(t){return this._invoke(r,t)}));}));}function O(t,r){function e(o,i,a,u){var c=l(t[o],t,i);if("throw"!==c.type){var f=c.arg,s=f.value;return s&&"object"===y(s)&&n.call(s,"__await")?r.resolve(s.__await).then((function(t){e("next",t,a,u);}),(function(t){e("throw",t,a,u);})):r.resolve(s).then((function(t){f.value=t,a(f);}),(function(t){return e("throw",t,a,u)}))}u(c.arg);}var o;this._invoke=function(t,n){function i(){return new r((function(r,o){e(t,n,r,o);}))}return o=o?o.then(i,i):i()};}function j(t,e){var n=t.iterator[e.method];if(n===r){if(e.delegate=null,"throw"===e.method){if(t.iterator.return&&(e.method="return",e.arg=r,j(t,e),"throw"===e.method))return d;e.method="throw",e.arg=new TypeError("The iterator does not provide a 'throw' method");}return d}var o=l(n,t.iterator,e.arg);if("throw"===o.type)return e.method="throw",e.arg=o.arg,e.delegate=null,d;var i=o.arg;return i?i.done?(e[t.resultName]=i.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=r),e.delegate=null,d):i:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,d)}function _(t){var r={tryLoc:t[0]};1 in t&&(r.catchLoc=t[1]),2 in t&&(r.finallyLoc=t[2],r.afterLoc=t[3]),this.tryEntries.push(r);}function k(t){var r=t.completion||{};r.type="normal",delete r.arg,t.completion=r;}function P(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(_,this),this.reset(!0);}function T(t){if(t){var e=t[i];if(e)return e.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var o=-1,a=function e(){for(;++o<t.length;)if(n.call(t,o))return e.value=t[o],e.done=!1,e;return e.value=r,e.done=!0,e};return a.next=a}}return {next:A}}function A(){return {value:r,done:!0}}return g.prototype=S.constructor=w,w.constructor=g,g.displayName=c(w,u,"GeneratorFunction"),t.isGeneratorFunction=function(t){var r="function"==typeof t&&t.constructor;return !!r&&(r===g||"GeneratorFunction"===(r.displayName||r.name))},t.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,w):(t.__proto__=w,c(t,u,"GeneratorFunction")),t.prototype=Object.create(S),t},t.awrap=function(t){return {__await:t}},L(O.prototype),O.prototype[a]=function(){return this},t.AsyncIterator=O,t.async=function(r,e,n,o,i){void 0===i&&(i=Promise);var a=new O(f(r,e,n,o),i);return t.isGeneratorFunction(e)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},L(S),c(S,u,"Generator"),S[i]=function(){return this},S.toString=function(){return "[object Generator]"},t.keys=function(t){var r=[];for(var e in t)r.push(e);return r.reverse(),function e(){for(;r.length;){var n=r.pop();if(n in t)return e.value=n,e.done=!1,e}return e.done=!0,e}},t.values=T,P.prototype={constructor:P,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=r,this.done=!1,this.delegate=null,this.method="next",this.arg=r,this.tryEntries.forEach(k),!t)for(var e in this)"t"===e.charAt(0)&&n.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=r);},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function o(n,o){return u.type="throw",u.arg=t,e.next=n,o&&(e.method="next",e.arg=r),!!o}for(var i=this.tryEntries.length-1;i>=0;--i){var a=this.tryEntries[i],u=a.completion;if("root"===a.tryLoc)return o("end");if(a.tryLoc<=this.prev){var c=n.call(a,"catchLoc"),f=n.call(a,"finallyLoc");if(c&&f){if(this.prev<a.catchLoc)return o(a.catchLoc,!0);if(this.prev<a.finallyLoc)return o(a.finallyLoc)}else if(c){if(this.prev<a.catchLoc)return o(a.catchLoc,!0)}else {if(!f)throw new Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return o(a.finallyLoc)}}}},abrupt:function(t,r){for(var e=this.tryEntries.length-1;e>=0;--e){var o=this.tryEntries[e];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=r&&r<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=t,a.arg=r,i?(this.method="next",this.next=i.finallyLoc,d):this.complete(a)},complete:function(t,r){if("throw"===t.type)throw t.arg;return "break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&r&&(this.next=r),d},finish:function(t){for(var r=this.tryEntries.length-1;r>=0;--r){var e=this.tryEntries[r];if(e.finallyLoc===t)return this.complete(e.completion,e.afterLoc),k(e),d}},catch:function(t){for(var r=this.tryEntries.length-1;r>=0;--r){var e=this.tryEntries[r];if(e.tryLoc===t){var n=e.completion;if("throw"===n.type){var o=n.arg;k(e);}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,n){return this.delegate={iterator:T(t),resultName:e,nextLoc:n},"next"===this.method&&(this.arg=r),d}},t}(t.exports);try{regeneratorRuntime=r;}catch(e){Function("r","regeneratorRuntime = r")(r);}}(v);var d=v.exports;function m(t,r){return (m=Object.setPrototypeOf||function(t,r){return t.__proto__=r,t})(t,r)}function g(t,r){if("function"!=typeof r&&null!==r)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(r&&r.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),r&&m(t,r);}function w(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function b(t,r){return !r||"object"!==y(r)&&"function"!=typeof r?w(t):r}function x(t){return (x=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function E(){if("undefined"==typeof Reflect||!Reflect.construct)return !1;if(Reflect.construct.sham)return !1;if("function"==typeof Proxy)return !0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return !1}}function S(t,r,e){return (S=E()?Reflect.construct:function(t,r,e){var n=[null];n.push.apply(n,r);var o=new(Function.bind.apply(t,n));return e&&m(o,e.prototype),o}).apply(null,arguments)}function L(t){var r="function"==typeof Map?new Map:void 0;return (L=function(t){if(null===t||(e=t,-1===Function.toString.call(e).indexOf("[native code]")))return t;var e;if("function"!=typeof t)throw new TypeError("Super expression must either be null or a function");if(void 0!==r){if(r.has(t))return r.get(t);r.set(t,n);}function n(){return S(t,arguments,x(this).constructor)}return n.prototype=Object.create(t.prototype,{constructor:{value:n,enumerable:!1,writable:!0,configurable:!0}}),m(n,t)})(t)}function O(t){return function(t){if(Array.isArray(t))return e(t)}(t)||function(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}(t)||n(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function j(t,r,e){return r in t?Object.defineProperty(t,r,{value:e,enumerable:!0,configurable:!0,writable:!0}):t[r]=e,t}function _(t){this.wrapped=t;}function k(t){return new _(t)}function P(t){var r,e;function n(r,e){try{var i=t[r](e),a=i.value,u=a instanceof _;Promise.resolve(u?a.wrapped:a).then((function(t){u?n("return"===r?"return":"next",t):o(i.done?"return":"normal",t);}),(function(t){n("throw",t);}));}catch(c){o("throw",c);}}function o(t,o){switch(t){case"return":r.resolve({value:o,done:!0});break;case"throw":r.reject(o);break;default:r.resolve({value:o,done:!1});}(r=r.next)?n(r.key,r.arg):e=null;}this._invoke=function(t,o){return new Promise((function(i,a){var u={key:t,arg:o,resolve:i,reject:a,next:null};e?e=e.next=u:(r=e=u,n(t,o));}))},"function"!=typeof t.return&&(this.return=void 0);}function T(t){return function(){return new P(t.apply(this,arguments))}}P.prototype["function"==typeof Symbol&&Symbol.asyncIterator||"@@asyncIterator"]=function(){return this},P.prototype.next=function(t){return this._invoke("next",t)},P.prototype.throw=function(t){return this._invoke("throw",t)},P.prototype.return=function(t){return this._invoke("return",t)};

  /* minified: lib */
  function _createSuper$4(e){var t=_isNativeReflectConstruct$4();return function(){var r,n=x(e);if(t){var a=x(this).constructor;r=Reflect.construct(n,arguments,a);}else r=n.apply(this,arguments);return b(this,r)}}function _isNativeReflectConstruct$4(){if("undefined"==typeof Reflect||!Reflect.construct)return !1;if(Reflect.construct.sham)return !1;if("function"==typeof Proxy)return !0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return !1}}var AssertionError=function(e){g(r,e);var t=_createSuper$4(r);function r(){return u(this,r),t.apply(this,arguments)}return r}(L(Error));function assert(e,t){if(!e)throw new AssertionError(null!=t?t:"Assertion failed")}function assertNonNull(e,t){assert(null!==e,null!=t?t:"Assertion failed: Expected value to be non-null");}function assertHasValue(e,t){assert(null!=e,null!=t?t:"Assertion failed: Expected value to be defined and non-null");}function qs(e,t){var r=qsMaybe(e,t);return assertNonNull(r,"Could not find required element"),r}function qsMaybe(e,t){return (null!=t?t:document).querySelector(e)}function qsa(e,t){var r=null!=t?t:document;return O(r.querySelectorAll(e))}function _classPrivateMethodGet$1(e,t,r){if(!t.has(e))throw new TypeError("attempted to get private field on non-instance");return r}var separator="\n–\n",_preamble=new WeakMap,_extraInfoLines=new WeakMap,_editNoteTextArea=new WeakMap,_removePreviousFragment=new WeakSet,EditNote=function(){function e(t){u(this,e),_removePreviousFragment.add(this),_preamble.set(this,{writable:!0,value:void 0}),_extraInfoLines.set(this,{writable:!0,value:void 0}),_editNoteTextArea.set(this,{writable:!0,value:void 0}),h(this,_preamble,t),h(this,_extraInfoLines,[]),h(this,_editNoteTextArea,qs("textarea.edit-note"));}return f(e,[{key:"addExtraInfo",value:function(e){s(this,_extraInfoLines).includes(e)||s(this,_extraInfoLines).push(e);}},{key:"fill",value:function(){_classPrivateMethodGet$1(this,_removePreviousFragment,_removePreviousFragment2).call(this);var e=[s(this,_preamble)].concat(O(s(this,_extraInfoLines))).join("\n"),t=s(this,_editNoteTextArea).value;s(this,_editNoteTextArea).value=[t,separator,e].join("");}}],[{key:"withPreambleFromGMInfo",value:function(){return new e("".concat(GM_info.script.name," ").concat(GM_info.script.version))}}]),e}();function _removePreviousFragment2(){var e=this,t=s(this,_editNoteTextArea).value.split(separator).filter((function(t){return !t.trim().startsWith(s(e,_preamble))}));s(this,_editNoteTextArea).value=t.join(separator);}function ownKeys$1(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n);}return r}function _objectSpread$1(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?ownKeys$1(Object(r),!0).forEach((function(t){j(e,t,r[t]);})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):ownKeys$1(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t));}));}return e}function gmxhr(e){return _gmxhr.apply(this,arguments)}function _gmxhr(){return (_gmxhr=a(d.mark((function e(t){return d.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",new Promise((function(e,r){var n=function(e,t){return r({reason:e,error:t})};GM_xmlhttpRequest(_objectSpread$1(_objectSpread$1({},t),{},{onload:function(t){t.status>=400?n("HTTP error ".concat(t.statusText),t):e(t);},onerror:function(e){return n("network error",e)},onabort:function(e){return n("aborted",e)},ontimeout:function(e){return n("timed out",e)}}));})));case 1:case"end":return e.stop()}}),e)})))).apply(this,arguments)}

  var css_248z = ".ROpdebee_paste_url_cont{display:inline-block;margin-left:32px;vertical-align:middle}.ROpdebee_paste_url_cont>*{display:block}.ROpdebee_paste_url_cont>a{text-align:right;font-size:smaller}.ROpdebee_paste_url_cont+span{margin-left:32px}.ROpdebee_import_url_buttons{margin-left:32px;vertical-align:middle}.ROpdebee_import_url_buttons>button{display:block;float:none;margin:4px}";

  function addAtisketSeedLinks() {
      var dispatch = {
          '/atasket.php': addOnComplementaryPage,
          '/': addOnOverviewPage
      };
      var adder = dispatch[document.location.pathname];
      if (adder) {
          adder();
      } else {
          console.error('Unsupported page for CAA URL upload seeder!');
      }
  }
  function addOnComplementaryPage() {
      var _document$location$se;
      var mbid = (_document$location$se = document.location.search.match(/[?&]release_mbid=([a-f0-9-]+)/)) === null || _document$location$se === void 0 ? void 0 : _document$location$se[1];
      if (!mbid) {
          console.error('Cannot figure out MBID :(');
          return;
      }
      addSeedLinkToCovers(mbid);
  }
  function addOnOverviewPage() {
      var alreadyInMB = qsMaybe('.already-in-mb-item');
      if (alreadyInMB === null) {
          return;
      }
      addSeedLinkToCovers(qs('a.mb', alreadyInMB).innerText.trim());
  }
  function addSeedLinkToCovers(mbid) {
      qsa('figure.cover').forEach(function (fig) {
          return addSeedLinkToCover(fig, mbid);
      });
  }
  function addSeedLinkToCover(_x, _x2) {
      return _addSeedLinkToCover.apply(this, arguments);
  }
  function _addSeedLinkToCover() {
      _addSeedLinkToCover = a(d.mark(function _callee(fig, mbid) {
          var _url$match;
          var url, ext, dimensionStr, seedUrl;
          return d.wrap(function _callee$(_context) {
              while (1) {
                  switch (_context.prev = _context.next) {
                  case 0:
                      url = qs('a.icon', fig).href;
                      ext = (_url$match = url.match(/\.(\w+)$/)) === null || _url$match === void 0 ? void 0 : _url$match[1];
                      _context.next = 4;
                      return getImageDimensions(url);
                  case 4:
                      dimensionStr = _context.sent;
                      seedUrl = 'https://musicbrainz.org/release/'.concat(mbid, '/add-cover-art#artwork_url=').concat(encodeURIComponent(url), '&origin=atisket&artwork_type=Front');
                      qs('figcaption > a', fig).insertAdjacentElement('afterend', function () {
                          var $$a = document.createElement('a');
                          $$a.setAttribute('href', seedUrl);
                          r($$a, { display: 'block' });
                          var $$b = document.createTextNode('\n            Add to release\n        ');
                          $$a.appendChild($$b);
                          return $$a;
                      }.call(this));
                      qs('figcaption > a', fig).insertAdjacentElement('afterend', function () {
                          var $$c = document.createElement('span');
                          r($$c, { display: 'block' });
                          t($$c, dimensionStr + (ext ? ' '.concat(ext.toUpperCase()) : ''));
                          return $$c;
                      }.call(this));
                  case 8:
                  case 'end':
                      return _context.stop();
                  }
              }
          }, _callee);
      }));
      return _addSeedLinkToCover.apply(this, arguments);
  }
  function getImageDimensions(url) {
      return new Promise(function (resolve, reject) {
          var interval;
          var done = false;
          var img = function () {
              var $$e = document.createElement('img');
              $$e.setAttribute('src', url);
              $$e.addEventListener('load', function () {
                  clearInterval(interval);
                  if (!done) {
                      resolve(''.concat(img.naturalHeight, 'x').concat(img.naturalWidth));
                      done = true;
                  }
              });
              $$e.addEventListener('error', function () {
                  clearInterval(interval);
                  if (!done) {
                      done = true;
                      reject();
                  }
              });
              return $$e;
          }.call(this);
          interval = window.setInterval(function () {
              if (img.naturalHeight) {
                  resolve(''.concat(img.naturalHeight, 'x').concat(img.naturalWidth));
                  done = true;
                  clearInterval(interval);
                  img.src = '';
              }
          }, 50);
      });
  }

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { j(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  // Interface to maxurl
  var maxurl = $$IMU_EXPORT$$;
  var options = {
    fill_object: true,
    exclude_videos: true,
    filter: function filter(url) {
      return !url.toLowerCase().endsWith('.webp') // Blocking webp images in Discogs
      && !/:format(webp)/.test(url.toLowerCase());
    }
  };
  function getMaxUrlCandidates(_x) {
    return _getMaxUrlCandidates.apply(this, arguments);
  }

  function _getMaxUrlCandidates() {
    _getMaxUrlCandidates = T( /*#__PURE__*/d.mark(function _callee(smallurl) {
      var p, results, i, current;
      return d.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              p = new Promise(function (resolve) {
                maxurl(smallurl, _objectSpread(_objectSpread({}, options), {}, {
                  cb: resolve
                }));
              });
              _context.next = 3;
              return k(p);

            case 3:
              results = _context.sent;
              i = 0;

            case 5:
              if (!(i < results.length)) {
                _context.next = 14;
                break;
              }

              current = results[i]; // Filter out results that will definitely not work

              if (!(current.fake || current.bad || current.likely_broken)) {
                _context.next = 9;
                break;
              }

              return _context.abrupt("continue", 11);

            case 9:
              _context.next = 11;
              return current;

            case 11:
              i++;
              _context.next = 5;
              break;

            case 14:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _getMaxUrlCandidates.apply(this, arguments);
  }

  var ArtworkTypeIDs;

  (function (ArtworkTypeIDs) {
    ArtworkTypeIDs[ArtworkTypeIDs["Back"] = 2] = "Back";
    ArtworkTypeIDs[ArtworkTypeIDs["Booklet"] = 3] = "Booklet";
    ArtworkTypeIDs[ArtworkTypeIDs["Front"] = 1] = "Front";
    ArtworkTypeIDs[ArtworkTypeIDs["Liner"] = 12] = "Liner";
    ArtworkTypeIDs[ArtworkTypeIDs["Medium"] = 4] = "Medium";
    ArtworkTypeIDs[ArtworkTypeIDs["Obi"] = 5] = "Obi";
    ArtworkTypeIDs[ArtworkTypeIDs["Other"] = 8] = "Other";
    ArtworkTypeIDs[ArtworkTypeIDs["Poster"] = 11] = "Poster";
    ArtworkTypeIDs[ArtworkTypeIDs["Raw"] = 14] = "Raw";
    ArtworkTypeIDs[ArtworkTypeIDs["Spine"] = 6] = "Spine";
    ArtworkTypeIDs[ArtworkTypeIDs["Sticker"] = 10] = "Sticker";
    ArtworkTypeIDs[ArtworkTypeIDs["Track"] = 7] = "Track";
    ArtworkTypeIDs[ArtworkTypeIDs["Tray"] = 9] = "Tray";
    ArtworkTypeIDs[ArtworkTypeIDs["Watermark"] = 13] = "Watermark";
  })(ArtworkTypeIDs || (ArtworkTypeIDs = {}));

  var HeadMetaPropertyProvider = /*#__PURE__*/function () {
    function HeadMetaPropertyProvider() {
      u(this, HeadMetaPropertyProvider);

      j(this, "supportedDomains", void 0);

      j(this, "favicon", void 0);

      j(this, "name", void 0);
    }

    f(HeadMetaPropertyProvider, [{
      key: "findImages",
      value: // Providers for which the cover art can be retrieved from the head
      // og:image property and maximised using maxurl
      function () {
        var _findImages = a( /*#__PURE__*/d.mark(function _callee(url) {
          var resp, parser, respDocument, coverElmt;
          return d.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return gmxhr({
                    url: url,
                    method: 'GET'
                  });

                case 2:
                  resp = _context.sent;
                  parser = new DOMParser();
                  respDocument = parser.parseFromString(resp.responseText, 'text/html');
                  coverElmt = qs('head > meta[property="og:image"]', respDocument);
                  return _context.abrupt("return", [{
                    url: coverElmt.content,
                    type: [ArtworkTypeIDs.Front]
                  }]);

                case 7:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        function findImages(_x) {
          return _findImages.apply(this, arguments);
        }

        return findImages;
      }()
    }]);

    return HeadMetaPropertyProvider;
  }();

  function _createSuper$3(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$3(); return function _createSuperInternal() { var Super = x(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = x(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return b(this, result); }; }

  function _isNativeReflectConstruct$3() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
  var AppleMusicProvider = /*#__PURE__*/function (_HeadMetaPropertyProv) {
    g(AppleMusicProvider, _HeadMetaPropertyProv);

    var _super = _createSuper$3(AppleMusicProvider);

    function AppleMusicProvider() {
      var _this;

      u(this, AppleMusicProvider);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));

      j(w(_this), "supportedDomains", ['music.apple.com', 'itunes.apple.com']);

      j(w(_this), "favicon", 'https://music.apple.com/favicon.ico');

      j(w(_this), "name", 'Apple Music');

      return _this;
    }

    f(AppleMusicProvider, [{
      key: "supportsUrl",
      value: function supportsUrl(url) {
        return /\w{2}\/album\/(?:.+\/)?(?:id)?\d+/.test(url.pathname);
      }
    }]);

    return AppleMusicProvider;
  }(HeadMetaPropertyProvider);

  function _createSuper$2(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$2(); return function _createSuperInternal() { var Super = x(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = x(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return b(this, result); }; }

  function _isNativeReflectConstruct$2() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
  var DeezerProvider = /*#__PURE__*/function (_HeadMetaPropertyProv) {
    g(DeezerProvider, _HeadMetaPropertyProv);

    var _super = _createSuper$2(DeezerProvider);

    function DeezerProvider() {
      var _this;

      u(this, DeezerProvider);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));

      j(w(_this), "supportedDomains", ['deezer.com']);

      j(w(_this), "favicon", 'https://e-cdns-files.dzcdn.net/cache/images/common/favicon/favicon-16x16.526cde4edf20647be4ee32cdf35c1c13.png');

      j(w(_this), "name", 'Deezer');

      return _this;
    }

    f(DeezerProvider, [{
      key: "supportsUrl",
      value: function supportsUrl(url) {
        return /(?:\w{2}\/)?album\/\d+/.test(url.pathname);
      }
    }]);

    return DeezerProvider;
  }(HeadMetaPropertyProvider);

  // Not sure if this changes often. If it does, we might have to parse it from the
  // JS sources somehow.
  var QUERY_SHA256 = '13e41f41a02b02d0a7e855a71e1a02478fd2fb0a2d104b54931d649e1d7c6ecd';
  var DiscogsProvider = /*#__PURE__*/function () {
    function DiscogsProvider() {
      u(this, DiscogsProvider);

      j(this, "supportedDomains", ['discogs.com']);

      j(this, "favicon", 'https://catalog-assets.discogs.com/e95f0cd9.png');

      j(this, "name", 'Discogs');
    }

    f(DiscogsProvider, [{
      key: "supportsUrl",
      value: function supportsUrl(url) {
        return /\/release\/\d+/.test(url.pathname);
      }
    }, {
      key: "findImages",
      value: function () {
        var _findImages = a( /*#__PURE__*/d.mark(function _callee(url) {
          var _url$match;

          var releaseId, variables, extensions, resp, data;
          return d.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  // Loading the full HTML and parsing the metadata JSON embedded within
                  // it.
                  releaseId = (_url$match = url.match(/\/release\/(\d+)/)) === null || _url$match === void 0 ? void 0 : _url$match[1];
                  assertHasValue(releaseId);
                  variables = encodeURIComponent(JSON.stringify({
                    discogsId: parseInt(releaseId),
                    count: 500
                  }));
                  extensions = encodeURIComponent(JSON.stringify({
                    persistedQuery: {
                      version: 1,
                      sha256Hash: QUERY_SHA256
                    }
                  }));
                  _context.next = 6;
                  return gmxhr({
                    url: "https://www.discogs.com/internal/release-page/api/graphql?operationName=ReleaseAllImages&variables=".concat(variables, "&extensions=").concat(extensions),
                    method: 'GET'
                  });

                case 6:
                  resp = _context.sent;
                  data = JSON.parse(resp.responseText); // eslint-disable-next-line @typescript-eslint/no-explicit-any

                  return _context.abrupt("return", data.data.release.images.edges.map(function (edge) {
                    return {
                      url: edge.node.fullsize.sourceUrl
                    };
                  }));

                case 9:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        function findImages(_x) {
          return _findImages.apply(this, arguments);
        }

        return findImages;
      }()
    }]);

    return DiscogsProvider;
  }();

  function _createSuper$1(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$1(); return function _createSuperInternal() { var Super = x(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = x(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return b(this, result); }; }

  function _isNativeReflectConstruct$1() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
  var SpotifyProvider = /*#__PURE__*/function (_HeadMetaPropertyProv) {
    g(SpotifyProvider, _HeadMetaPropertyProv);

    var _super = _createSuper$1(SpotifyProvider);

    function SpotifyProvider() {
      var _this;

      u(this, SpotifyProvider);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));

      j(w(_this), "supportedDomains", ['open.spotify.com']);

      j(w(_this), "favicon", 'https://open.scdn.co/cdn/images/favicon32.8e66b099.png');

      j(w(_this), "name", 'Spotify');

      return _this;
    }

    f(SpotifyProvider, [{
      key: "supportsUrl",
      value: function supportsUrl(url) {
        return /\/album\/\w+/.test(url.pathname);
      }
    }]);

    return SpotifyProvider;
  }(HeadMetaPropertyProvider);

  var TidalProvider = /*#__PURE__*/function () {
    function TidalProvider() {
      u(this, TidalProvider);

      j(this, "supportedDomains", ['tidal.com', 'listen.tidal.com', 'store.tidal.com']);

      j(this, "favicon", 'https://listen.tidal.com/favicon.ico');

      j(this, "name", 'Tidal');
    }

    f(TidalProvider, [{
      key: "supportsUrl",
      value: function supportsUrl(url) {
        return /\/album\/\d+/.test(url.pathname);
      }
    }, {
      key: "findImages",
      value: function () {
        var _findImages = a( /*#__PURE__*/d.mark(function _callee(url) {
          var _url$match;

          var albumId, resp, parser, respDocument, coverElmt;
          return d.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  // Rewrite the URL to point to the main page
                  albumId = (_url$match = url.match(/\/album\/(\d+)/)) === null || _url$match === void 0 ? void 0 : _url$match[1];
                  assertHasValue(albumId);
                  url = "https://tidal.com/browse/album/".concat(albumId);
                  _context.next = 5;
                  return gmxhr({
                    url: url,
                    method: 'GET'
                  });

                case 5:
                  resp = _context.sent;
                  parser = new DOMParser();
                  respDocument = parser.parseFromString(resp.responseText, 'text/html');

                  if (!(qsMaybe('p#cmsg') !== null)) {
                    _context.next = 10;
                    break;
                  }

                  throw {
                    reason: 'captcha'
                  };

                case 10:
                  coverElmt = qs('head > meta[property="og:image"]', respDocument);
                  return _context.abrupt("return", [{
                    url: coverElmt.content,
                    type: [ArtworkTypeIDs.Front]
                  }]);

                case 12:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        function findImages(_x) {
          return _findImages.apply(this, arguments);
        }

        return findImages;
      }()
    }]);

    return TidalProvider;
  }();

  function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = x(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = x(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return b(this, result); }; }

  function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
  var BandcampProvider = /*#__PURE__*/function (_HeadMetaPropertyProv) {
    g(BandcampProvider, _HeadMetaPropertyProv);

    var _super = _createSuper(BandcampProvider);

    function BandcampProvider() {
      var _this;

      u(this, BandcampProvider);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));

      j(w(_this), "supportedDomains", ['bandcamp.com']);

      j(w(_this), "favicon", 'https://s4.bcbits.com/img/favicon/favicon-32x32.png');

      j(w(_this), "name", 'Bandcamp');

      return _this;
    }

    f(BandcampProvider, [{
      key: "supportsUrl",
      value: function supportsUrl(url) {
        return /bandcamp\.com\/(?:track|album)\//.test(url.href);
      }
    }]);

    return BandcampProvider;
  }(HeadMetaPropertyProvider);

  var PROVIDER_DISPATCH = new Map();

  function add_provider(provider) {
    provider.supportedDomains.forEach(function (domain) {
      return PROVIDER_DISPATCH.set(domain, provider);
    });
  }

  add_provider(new AppleMusicProvider());
  add_provider(new BandcampProvider());
  add_provider(new DeezerProvider());
  add_provider(new DiscogsProvider());
  add_provider(new SpotifyProvider());
  add_provider(new TidalProvider());

  function extractDomain(url) {
    var domain = url.hostname; // Deal with bandcamp subdomains

    if (domain.endsWith('bandcamp.com')) domain = 'bandcamp.com';
    domain = domain.replace(/^www\./, '');
    return domain;
  }

  function getProvider(url) {
    return PROVIDER_DISPATCH.get(extractDomain(url));
  }
  function hasProvider(url) {
    return PROVIDER_DISPATCH.has(extractDomain(url));
  }
  function findImages(_x) {
    return _findImages.apply(this, arguments);
  }

  function _findImages() {
    _findImages = a( /*#__PURE__*/d.mark(function _callee(url) {
      var urlObj, provider;
      return d.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              urlObj = new URL(url);
              provider = getProvider(urlObj);

              if (!(!provider || !provider.supportsUrl(urlObj))) {
                _context.next = 4;
                break;
              }

              return _context.abrupt("return");

            case 4:
              return _context.abrupt("return", provider.findImages(url));

            case 5:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _findImages.apply(this, arguments);
  }

  function _createForOfIteratorHelper(o, allowArrayLike) {
      var it = typeof Symbol !== 'undefined' && o[Symbol.iterator] || o['@@iterator'];
      if (!it) {
          if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === 'number') {
              if (it)
                  o = it;
              var i = 0;
              var F = function F() {
              };
              return {
                  s: F,
                  n: function n() {
                      if (i >= o.length)
                          return { done: true };
                      return {
                          done: false,
                          value: o[i++]
                      };
                  },
                  e: function e(_e) {
                      throw _e;
                  },
                  f: F
              };
          }
          throw new TypeError('Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.');
      }
      var normalCompletion = true, didErr = false, err;
      return {
          s: function s() {
              it = it.call(o);
          },
          n: function n() {
              var step = it.next();
              normalCompletion = step.done;
              return step;
          },
          e: function e(_e2) {
              didErr = true;
              err = _e2;
          },
          f: function f() {
              try {
                  if (!normalCompletion && it.return != null)
                      it.return();
              } finally {
                  if (didErr)
                      throw err;
              }
          }
      };
  }
  function _unsupportedIterableToArray(o, minLen) {
      if (!o)
          return;
      if (typeof o === 'string')
          return _arrayLikeToArray(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === 'Object' && o.constructor)
          n = o.constructor.name;
      if (n === 'Map' || n === 'Set')
          return Array.from(o);
      if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
          return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
      if (len == null || len > arr.length)
          len = arr.length;
      for (var i = 0, arr2 = new Array(len); i < len; i++) {
          arr2[i] = arr[i];
      }
      return arr2;
  }
  function _classPrivateMethodGet(receiver, privateSet, fn) {
      if (!privateSet.has(receiver)) {
          throw new TypeError('attempted to get private field on non-instance');
      }
      return fn;
  }
  var _elmt = new WeakMap();
  var StatusBanner = function () {
      function StatusBanner() {
          u(this, StatusBanner);
          _elmt.set(this, {
              writable: true,
              value: void 0
          });
          h(this, _elmt, function () {
              var $$a = document.createElement('span');
              $$a.setAttribute('id', 'ROpdebee_paste_url_status');
              r($$a, { display: 'none' });
              return $$a;
          }.call(this));
      }
      f(StatusBanner, [
          {
              key: 'set',
              value: function set(message) {
                  s(this, _elmt).innerText = message;
                  s(this, _elmt).style.removeProperty('display');
              }
          },
          {
              key: 'clear',
              value: function clear() {
                  s(this, _elmt).innerText = '';
                  s(this, _elmt).style.display = 'none';
              }
          },
          {
              key: 'htmlElement',
              get: function get() {
                  return s(this, _elmt);
              }
          }
      ]);
      return StatusBanner;
  }();
  var _banner = new WeakMap();
  var _note = new WeakMap();
  var _urlInput = new WeakMap();
  var _doneImages = new WeakMap();
  var _lastId = new WeakMap();
  var _addImagesFromProvider = new WeakSet();
  var _addImages = new WeakSet();
  var _clearInput = new WeakSet();
  var _fetchLargestImage = new WeakSet();
  var _fetchImage = new WeakSet();
  var _enqueueImageForUpload = new WeakSet();
  var _setArtworkType = new WeakSet();
  var ImageImporter = function () {
      function ImageImporter() {
          u(this, ImageImporter);
          _setArtworkType.add(this);
          _enqueueImageForUpload.add(this);
          _fetchImage.add(this);
          _fetchLargestImage.add(this);
          _clearInput.add(this);
          _addImages.add(this);
          _addImagesFromProvider.add(this);
          _banner.set(this, {
              writable: true,
              value: void 0
          });
          _note.set(this, {
              writable: true,
              value: void 0
          });
          _urlInput.set(this, {
              writable: true,
              value: void 0
          });
          _doneImages.set(this, {
              writable: true,
              value: void 0
          });
          _lastId.set(this, {
              writable: true,
              value: 0
          });
          h(this, _banner, new StatusBanner());
          h(this, _note, EditNote.withPreambleFromGMInfo());
          h(this, _urlInput, setupPage(s(this, _banner), this.addImagesFromUrl.bind(this)));
          h(this, _doneImages, new Set());
      }
      f(ImageImporter, [
          {
              key: 'addImagesFromLocationHash',
              value: function () {
                  var _addImagesFromLocationHash = a(d.mark(function _callee() {
                      var seedParams, url, types, artworkTypeName, artworkType, result, wasMaximised, originalFilename, infoLine;
                      return d.wrap(function _callee$(_context) {
                          while (1) {
                              switch (_context.prev = _context.next) {
                              case 0:
                                  seedParams = {};
                                  document.location.hash.replace(/^#/, '').split('&').forEach(function (param) {
                                      try {
                                          var _param$split = param.split('='), _param$split2 = o(_param$split, 2), name = _param$split2[0], value = _param$split2[1];
                                          seedParams[name] = decodeURIComponent(value);
                                      } catch (err) {
                                          console.error(err);
                                          return;
                                      }
                                  });
                                  if (seedParams['artwork_url']) {
                                      _context.next = 4;
                                      break;
                                  }
                                  return _context.abrupt('return');
                              case 4:
                                  url = seedParams['artwork_url'];
                                  types = [];
                                  if (seedParams['artwork_type']) {
                                      artworkTypeName = seedParams['artwork_type'];
                                      artworkType = ArtworkTypeIDs[artworkTypeName];
                                      if (typeof artworkType !== 'undefined') {
                                          types.push(artworkType);
                                      }
                                  }
                                  _context.next = 9;
                                  return _classPrivateMethodGet(this, _addImages, _addImages2).call(this, url, types);
                              case 9:
                                  result = _context.sent;
                                  if (result) {
                                      _context.next = 12;
                                      break;
                                  }
                                  return _context.abrupt('return');
                              case 12:
                                  wasMaximised = result.wasMaximised, originalFilename = result.originalFilename;
                                  if (!url.startsWith('data:')) {
                                      infoLine = url;
                                      if (wasMaximised)
                                          infoLine += ', maximised';
                                      if (seedParams['origin']) {
                                          infoLine += ', seeded from ' + seedParams['origin'];
                                      }
                                      s(this, _note).addExtraInfo(infoLine);
                                  }
                                  s(this, _note).fill();
                                  _classPrivateMethodGet(this, _clearInput, _clearInput2).call(this, url);
                                  s(this, _banner).set('Successfully added '.concat(originalFilename) + (wasMaximised ? ' (maximised)' : ''));
                              case 17:
                              case 'end':
                                  return _context.stop();
                              }
                          }
                      }, _callee, this);
                  }));
                  function addImagesFromLocationHash() {
                      return _addImagesFromLocationHash.apply(this, arguments);
                  }
                  return addImagesFromLocationHash;
              }()
          },
          {
              key: 'addImagesFromUrl',
              value: function () {
                  var _addImagesFromUrl = a(d.mark(function _callee2(url) {
                      var result, wasMaximised, originalFilename;
                      return d.wrap(function _callee2$(_context2) {
                          while (1) {
                              switch (_context2.prev = _context2.next) {
                              case 0:
                                  if (url) {
                                      _context2.next = 3;
                                      break;
                                  }
                                  s(this, _banner).clear();
                                  return _context2.abrupt('return');
                              case 3:
                                  _context2.next = 5;
                                  return _classPrivateMethodGet(this, _addImages, _addImages2).call(this, url);
                              case 5:
                                  result = _context2.sent;
                                  if (result) {
                                      _context2.next = 8;
                                      break;
                                  }
                                  return _context2.abrupt('return');
                              case 8:
                                  wasMaximised = result.wasMaximised, originalFilename = result.originalFilename;
                                  if (!url.startsWith('data:')) {
                                      s(this, _note).addExtraInfo(url + (wasMaximised ? ', maximised' : ''));
                                  }
                                  s(this, _note).fill();
                                  _classPrivateMethodGet(this, _clearInput, _clearInput2).call(this, url);
                                  s(this, _banner).set('Successfully added '.concat(originalFilename) + (wasMaximised ? ' (maximised)' : ''));
                              case 13:
                              case 'end':
                                  return _context2.stop();
                              }
                          }
                      }, _callee2, this);
                  }));
                  function addImagesFromUrl(_x) {
                      return _addImagesFromUrl.apply(this, arguments);
                  }
                  return addImagesFromUrl;
              }()
          }
      ]);
      return ImageImporter;
  }();
  function _addImagesFromProvider2(_x4, _x5) {
      return _addImagesFromProvider3.apply(this, arguments);
  }
  function _addImagesFromProvider3() {
      _addImagesFromProvider3 = a(d.mark(function _callee5(originalUrl, images) {
          var wasMaximised, successfulCount, _iterator2, _step2, _img$type, _result$wasMaximised, img, result;
          return d.wrap(function _callee5$(_context5) {
              while (1) {
                  switch (_context5.prev = _context5.next) {
                  case 0:
                      s(this, _banner).set('Found '.concat(images.length, ' images'));
                      wasMaximised = false;
                      successfulCount = 0;
                      _iterator2 = _createForOfIteratorHelper(images);
                      _context5.prev = 4;
                      _iterator2.s();
                  case 6:
                      if ((_step2 = _iterator2.n()).done) {
                          _context5.next = 15;
                          break;
                      }
                      img = _step2.value;
                      _context5.next = 10;
                      return _classPrivateMethodGet(this, _addImages, _addImages2).call(this, img.url, (_img$type = img.type) !== null && _img$type !== void 0 ? _img$type : []);
                  case 10:
                      result = _context5.sent;
                      wasMaximised || (wasMaximised = (_result$wasMaximised = result === null || result === void 0 ? void 0 : result.wasMaximised) !== null && _result$wasMaximised !== void 0 ? _result$wasMaximised : false);
                      if (result)
                          successfulCount += 1;
                  case 13:
                      _context5.next = 6;
                      break;
                  case 15:
                      _context5.next = 20;
                      break;
                  case 17:
                      _context5.prev = 17;
                      _context5.t0 = _context5['catch'](4);
                      _iterator2.e(_context5.t0);
                  case 20:
                      _context5.prev = 20;
                      _iterator2.f();
                      return _context5.finish(20);
                  case 23:
                      _classPrivateMethodGet(this, _clearInput, _clearInput2).call(this, originalUrl);
                      s(this, _banner).set('Added '.concat(successfulCount, ' images from ').concat(originalUrl));
                      if (successfulCount) {
                          _context5.next = 27;
                          break;
                      }
                      return _context5.abrupt('return');
                  case 27:
                      return _context5.abrupt('return', {
                          wasMaximised: wasMaximised,
                          originalFilename: ''.concat(successfulCount, ' images')
                      });
                  case 28:
                  case 'end':
                      return _context5.stop();
                  }
              }
          }, _callee5, this, [[
                  4,
                  17,
                  20,
                  23
              ]]);
      }));
      return _addImagesFromProvider3.apply(this, arguments);
  }
  function _addImages2(_x6) {
      return _addImages3.apply(this, arguments);
  }
  function _addImages3() {
      _addImages3 = a(d.mark(function _callee6(url) {
          var _url$split$at;
          var artworkTypes, containedImages, _err$reason, originalFilename, result, _err$reason2, _result, file, fetchedUrl, wasMaximised, _args6 = arguments;
          return d.wrap(function _callee6$(_context6) {
              while (1) {
                  switch (_context6.prev = _context6.next) {
                  case 0:
                      artworkTypes = _args6.length > 1 && _args6[1] !== undefined ? _args6[1] : [];
                      _context6.prev = 1;
                      new URL(url);
                      _context6.next = 9;
                      break;
                  case 5:
                      _context6.prev = 5;
                      _context6.t0 = _context6['catch'](1);
                      s(this, _banner).set('Invalid URL');
                      return _context6.abrupt('return');
                  case 9:
                      s(this, _banner).set('Searching for images\u2026');
                      _context6.prev = 10;
                      _context6.next = 13;
                      return findImages(url);
                  case 13:
                      containedImages = _context6.sent;
                      _context6.next = 21;
                      break;
                  case 16:
                      _context6.prev = 16;
                      _context6.t1 = _context6['catch'](10);
                      s(this, _banner).set('Failed to search images: '.concat((_err$reason = _context6.t1.reason) !== null && _err$reason !== void 0 ? _err$reason : _context6.t1));
                      console.error(_context6.t1);
                      return _context6.abrupt('return');
                  case 21:
                      if (!containedImages) {
                          _context6.next = 23;
                          break;
                      }
                      return _context6.abrupt('return', _classPrivateMethodGet(this, _addImagesFromProvider, _addImagesFromProvider2).call(this, url, containedImages));
                  case 23:
                      originalFilename = (_url$split$at = url.split('/').at(-1)) !== null && _url$split$at !== void 0 ? _url$split$at : 'image';
                      if (!s(this, _doneImages).has(url)) {
                          _context6.next = 28;
                          break;
                      }
                      s(this, _banner).set(''.concat(originalFilename, ' has already been added'));
                      _classPrivateMethodGet(this, _clearInput, _clearInput2).call(this, url);
                      return _context6.abrupt('return');
                  case 28:
                      s(this, _doneImages).add(url);
                      _context6.prev = 29;
                      _context6.next = 32;
                      return _classPrivateMethodGet(this, _fetchLargestImage, _fetchLargestImage2).call(this, url);
                  case 32:
                      result = _context6.sent;
                      _context6.next = 40;
                      break;
                  case 35:
                      _context6.prev = 35;
                      _context6.t2 = _context6['catch'](29);
                      s(this, _banner).set('Failed to load '.concat(originalFilename, ': ').concat((_err$reason2 = _context6.t2.reason) !== null && _err$reason2 !== void 0 ? _err$reason2 : _context6.t2));
                      console.error(_context6.t2);
                      return _context6.abrupt('return');
                  case 40:
                      _result = result, file = _result.file, fetchedUrl = _result.fetchedUrl;
                      wasMaximised = fetchedUrl !== url;
                      if (!(s(this, _doneImages).has(fetchedUrl) && wasMaximised)) {
                          _context6.next = 46;
                          break;
                      }
                      s(this, _banner).set(''.concat(originalFilename, ' has already been added'));
                      _classPrivateMethodGet(this, _clearInput, _clearInput2).call(this, url);
                      return _context6.abrupt('return');
                  case 46:
                      s(this, _doneImages).add(fetchedUrl);
                      _classPrivateMethodGet(this, _enqueueImageForUpload, _enqueueImageForUpload2).call(this, file, artworkTypes);
                      return _context6.abrupt('return', {
                          originalFilename: originalFilename,
                          wasMaximised: wasMaximised
                      });
                  case 49:
                  case 'end':
                      return _context6.stop();
                  }
              }
          }, _callee6, this, [
              [
                  1,
                  5
              ],
              [
                  10,
                  16
              ],
              [
                  29,
                  35
              ]
          ]);
      }));
      return _addImages3.apply(this, arguments);
  }
  function _clearInput2(url) {
      if (s(this, _urlInput).value == url) {
          s(this, _urlInput).value = '';
      }
  }
  function _fetchLargestImage2(_x7) {
      return _fetchLargestImage3.apply(this, arguments);
  }
  function _fetchLargestImage3() {
      _fetchLargestImage3 = a(d.mark(function _callee7(url) {
          var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, imageResult, candName, _err$reason3;
          return d.wrap(function _callee7$(_context7) {
              while (1) {
                  switch (_context7.prev = _context7.next) {
                  case 0:
                      _iteratorNormalCompletion = true;
                      _didIteratorError = false;
                      _context7.prev = 2;
                      _iterator = p(getMaxUrlCandidates(url));
                  case 4:
                      _context7.next = 6;
                      return _iterator.next();
                  case 6:
                      _step = _context7.sent;
                      _iteratorNormalCompletion = _step.done;
                      _context7.next = 10;
                      return _step.value;
                  case 10:
                      _value = _context7.sent;
                      if (_iteratorNormalCompletion) {
                          _context7.next = 27;
                          break;
                      }
                      imageResult = _value;
                      candName = imageResult.filename || url.split('/').at(-1);
                      _context7.prev = 14;
                      s(this, _banner).set('Trying '.concat(candName, '\u2026'));
                      _context7.next = 18;
                      return _classPrivateMethodGet(this, _fetchImage, _fetchImage2).call(this, imageResult.url, candName, imageResult.headers);
                  case 18:
                      return _context7.abrupt('return', _context7.sent);
                  case 21:
                      _context7.prev = 21;
                      _context7.t0 = _context7['catch'](14);
                      console.error(''.concat(candName, ' failed: ').concat((_err$reason3 = _context7.t0.reason) !== null && _err$reason3 !== void 0 ? _err$reason3 : _context7.t0));
                  case 24:
                      _iteratorNormalCompletion = true;
                      _context7.next = 4;
                      break;
                  case 27:
                      _context7.next = 33;
                      break;
                  case 29:
                      _context7.prev = 29;
                      _context7.t1 = _context7['catch'](2);
                      _didIteratorError = true;
                      _iteratorError = _context7.t1;
                  case 33:
                      _context7.prev = 33;
                      _context7.prev = 34;
                      if (!(!_iteratorNormalCompletion && _iterator.return != null)) {
                          _context7.next = 38;
                          break;
                      }
                      _context7.next = 38;
                      return _iterator.return();
                  case 38:
                      _context7.prev = 38;
                      if (!_didIteratorError) {
                          _context7.next = 41;
                          break;
                      }
                      throw _iteratorError;
                  case 41:
                      return _context7.finish(38);
                  case 42:
                      return _context7.finish(33);
                  case 43:
                      _context7.next = 45;
                      return _classPrivateMethodGet(this, _fetchImage, _fetchImage2).call(this, url, url.split('/').at(-1) || 'image');
                  case 45:
                      return _context7.abrupt('return', _context7.sent);
                  case 46:
                  case 'end':
                      return _context7.stop();
                  }
              }
          }, _callee7, this, [
              [
                  2,
                  29,
                  33,
                  43
              ],
              [
                  14,
                  21
              ],
              [
                  34,
                  ,
                  38,
                  42
              ]
          ]);
      }));
      return _fetchLargestImage3.apply(this, arguments);
  }
  function _fetchImage2(_x8, _x9) {
      return _fetchImage3.apply(this, arguments);
  }
  function _fetchImage3() {
      _fetchImage3 = a(d.mark(function _callee8(url, fileName) {
          var _this3 = this;
          var headers, resp, rawFile, _args8 = arguments;
          return d.wrap(function _callee8$(_context8) {
              while (1) {
                  switch (_context8.prev = _context8.next) {
                  case 0:
                      headers = _args8.length > 2 && _args8[2] !== undefined ? _args8[2] : {};
                      _context8.next = 3;
                      return gmxhr({
                          url: url,
                          method: 'GET',
                          responseType: 'blob',
                          headers: headers
                      });
                  case 3:
                      resp = _context8.sent;
                      rawFile = new File([resp.response], fileName);
                      return _context8.abrupt('return', new Promise(function (resolve, reject) {
                          MB.CoverArt.validate_file(rawFile).fail(function (error) {
                              return reject({
                                  reason: error,
                                  error: error
                              });
                          }).done(function (mimeType) {
                              var _this$lastId;
                              return resolve({
                                  fetchedUrl: url,
                                  file: new File([resp.response], ''.concat(fileName, '.').concat((h(_this3, _lastId, (_this$lastId = +s(_this3, _lastId)) + 1), _this$lastId), '.').concat(mimeType.split('/')[1]), { type: mimeType })
                              });
                          });
                      }));
                  case 6:
                  case 'end':
                      return _context8.stop();
                  }
              }
          }, _callee8);
      }));
      return _fetchImage3.apply(this, arguments);
  }
  function _enqueueImageForUpload2(file) {
      var _this = this;
      var artworkTypes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var dropEvent = $.Event('drop');
      dropEvent.originalEvent = { dataTransfer: { files: [file] } };
      $('#drop-zone').trigger(dropEvent);
      if (artworkTypes.length) {
          setTimeout(function () {
              return _classPrivateMethodGet(_this, _setArtworkType, _setArtworkType2).call(_this, file, artworkTypes);
          }, 0);
      }
  }
  function _setArtworkType2(file, artworkTypes) {
      var _this2 = this;
      var pendingUploadRows = qsa('tbody[data-bind="foreach: files_to_upload"] > tr');
      var fileRow = pendingUploadRows.find(function (row) {
          return qs('.file-info span[data-bind="text: name"]', row).innerText == file.name;
      });
      if (!fileRow) {
          setTimeout(function () {
              return _classPrivateMethodGet(_this2, _setArtworkType, _setArtworkType2).call(_this2, file, artworkTypes);
          }, 500);
          return;
      }
      var checkboxesToCheck = qsa('ul.cover-art-type-checkboxes input[type="checkbox"]', fileRow).filter(function (cbox) {
          return artworkTypes.includes(parseInt(cbox.value));
      });
      checkboxesToCheck.forEach(function (cbox) {
          cbox.checked = true;
          cbox.dispatchEvent(new Event('click'));
      });
  }
  function setupPage(statusBanner, addImageCallback) {
      document.head.append(function () {
          var $$b = document.createElement('style');
          $$b.setAttribute('id', 'ROpdebee_upload_to_caa_from_url');
          t($$b, css_248z);
          return $$b;
      }.call(this));
      var input = function () {
          var $$d = document.createElement('input');
          $$d.setAttribute('type', 'text');
          $$d.setAttribute('placeholder', 'or paste a URL here');
          $$d.setAttribute('size', 47);
          $$d.addEventListener('input', function (evt) {
              return addImageCallback(evt.currentTarget.value.trim());
          });
          return $$d;
      }.call(this);
      var container = function () {
          var $$e = document.createElement('div');
          $$e.setAttribute('class', 'ROpdebee_paste_url_cont');
          t($$e, input);
          var $$g = document.createElement('a');
          $$g.setAttribute('href', 'https://github.com/ROpdebee/mb-userscripts/blob/main/src/mb_upload_to_caa_from_url/supportedProviders.md');
          $$g.setAttribute('target', '_blank');
          $$e.appendChild($$g);
          var $$h = document.createTextNode('\n                Supported providers\n            ');
          $$g.appendChild($$h);
          t($$e, statusBanner.htmlElement);
          return $$e;
      }.call(this);
      qs('#drop-zone').insertAdjacentElement('afterend', container);
      addImportButtons(addImageCallback, container);
      return input;
  }
  function addImportButtons(_x2, _x3) {
      return _addImportButtons.apply(this, arguments);
  }
  function _addImportButtons() {
      _addImportButtons = a(d.mark(function _callee3(addImageCallback, inputContainer) {
          var attachedURLs, supportedURLs, buttons;
          return d.wrap(function _callee3$(_context3) {
              while (1) {
                  switch (_context3.prev = _context3.next) {
                  case 0:
                      _context3.next = 2;
                      return getAttachedURLs();
                  case 2:
                      attachedURLs = _context3.sent;
                      supportedURLs = attachedURLs.filter(function (url) {
                          try {
                              return hasProvider(new URL(url));
                          } catch (err) {
                              return false;
                          }
                      });
                      if (supportedURLs.length) {
                          _context3.next = 6;
                          break;
                      }
                      return _context3.abrupt('return');
                  case 6:
                      buttons = supportedURLs.map(function (url) {
                          return createImportButton(url, addImageCallback);
                      });
                      inputContainer.insertAdjacentElement('afterend', function () {
                          var $$j = document.createElement('div');
                          $$j.setAttribute('class', 'ROpdebee_import_url_buttons buttons');
                          t($$j, buttons);
                          return $$j;
                      }.call(this));
                      inputContainer.insertAdjacentElement('afterend', function () {
                          var $$l = document.createElement('span');
                          var $$m = document.createTextNode('or');
                          $$l.appendChild($$m);
                          return $$l;
                      }.call(this));
                  case 9:
                  case 'end':
                      return _context3.stop();
                  }
              }
          }, _callee3);
      }));
      return _addImportButtons.apply(this, arguments);
  }
  function createImportButton(url, addImageCallback) {
      var provider = getProvider(new URL(url));
      return function () {
          var $$n = document.createElement('button');
          $$n.setAttribute('type', 'button');
          $$n.addEventListener('click', function (evt) {
              evt.preventDefault();
              addImageCallback(url);
          });
          var $$o = document.createElement('img');
          $$o.setAttribute('src', provider === null || provider === void 0 ? void 0 : provider.favicon);
          $$o.setAttribute('alt', provider === null || provider === void 0 ? void 0 : provider.name);
          $$o.setAttribute('title', url);
          $$n.appendChild($$o);
          var $$p = document.createElement('span');
          $$n.appendChild($$p);
          t($$p, 'Import from ' + (provider === null || provider === void 0 ? void 0 : provider.name));
          return $$n;
      }.call(this);
  }
  function getAttachedURLs() {
      return _getAttachedURLs.apply(this, arguments);
  }
  function _getAttachedURLs() {
      _getAttachedURLs = a(d.mark(function _callee4() {
          var _location$href$match, _metadata$relations$m, _metadata$relations;
          var mbid, resp, metadata;
          return d.wrap(function _callee4$(_context4) {
              while (1) {
                  switch (_context4.prev = _context4.next) {
                  case 0:
                      mbid = (_location$href$match = location.href.match(/musicbrainz\.org\/release\/([a-f0-9-]+)\//)) === null || _location$href$match === void 0 ? void 0 : _location$href$match[1];
                      assertHasValue(mbid);
                      _context4.next = 4;
                      return fetch('/ws/2/release/'.concat(mbid, '?inc=url-rels&fmt=json'));
                  case 4:
                      resp = _context4.sent;
                      _context4.next = 7;
                      return resp.json();
                  case 7:
                      metadata = _context4.sent;
                      return _context4.abrupt('return', (_metadata$relations$m = (_metadata$relations = metadata.relations) === null || _metadata$relations === void 0 ? void 0 : _metadata$relations.map(function (rel) {
                          return rel.url.resource;
                      })) !== null && _metadata$relations$m !== void 0 ? _metadata$relations$m : []);
                  case 9:
                  case 'end':
                      return _context4.stop();
                  }
              }
          }, _callee4);
      }));
      return _getAttachedURLs.apply(this, arguments);
  }
  if (document.location.hostname.endsWith('musicbrainz.org')) {
      var importer = new ImageImporter();
      if (/artwork_url=(.+)/.test(document.location.hash)) {
          importer.addImagesFromLocationHash();
      }
  } else if (document.location.hostname === 'atisket.pulsewidth.org.uk') {
      addAtisketSeedLinks();
  }

}());
