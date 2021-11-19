// ==UserScript==
// @name         MB: Enhanced Cover Art Uploads
// @description  Enhance the cover art uploader! Upload directly from a URL, automatically import covers from Discogs/Spotify/Apple Music/..., automatically retrieve the largest version, and more!
// @version      2021.11.19
// @author       ROpdebee
// @license      MIT; https://opensource.org/licenses/MIT
// @namespace    https://github.com/ROpdebee/mb-userscripts
// @homepageURL  https://github.com/ROpdebee/mb-userscripts
// @supportURL   https://github.com/ROpdebee/mb-userscripts/issues
// @downloadURL  https://raw.github.com/ROpdebee/mb-userscripts/dist/mb_enhanced_cover_art_uploads.user.js
// @updateURL    https://raw.github.com/ROpdebee/mb-userscripts/dist/mb_enhanced_cover_art_uploads.meta.js
// @match        *://*.musicbrainz.org/release/*/add-cover-art
// @match        *://*.musicbrainz.org/release/*/add-cover-art?*
// @match        *://atisket.pulsewidth.org.uk/*
// @match        *://vgmdb.net/album/*
// @exclude      *://atisket.pulsewidth.org.uk/
// @require      https://github.com/qsniyg/maxurl/blob/563626fe3b7c5ed3f6dc19d90a356746c68b5b4b/userscript.user.js?raw=true
// @resource     amazonFavicon https://www.amazon.com/favicon.ico
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        GM_getValue
// @grant        GM.getValue
// @grant        GM_setValue
// @grant        GM.setValue
// @grant        GM_getResourceURL
// @grant        GM.getResourceUrl
// @grant        GM.getResourceURL
// @connect      *
// ==/UserScript==

(function () {
  'use strict';

  /* minified: babel helpers, core-js, nativejsx, regenerator-runtime, @babel/runtime, ts-custom-error, p-throttle */
  var commonjsGlobal="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},check=function(e){return e&&e.Math==Math&&e},global$l=check("object"==typeof globalThis&&globalThis)||check("object"==typeof window&&window)||check("object"==typeof self&&self)||check("object"==typeof commonjsGlobal&&commonjsGlobal)||function(){return this}()||Function("return this")(),objectGetOwnPropertyDescriptor={},fails$5=function(e){try{return !!e()}catch(t){return !0}},fails$4=fails$5,descriptors=!fails$4((function(){return 7!=Object.defineProperty({},1,{get:function(){return 7}})[1]})),call$4=Function.prototype.call,functionCall=call$4.bind?call$4.bind(call$4):function(){return call$4.apply(call$4,arguments)},objectPropertyIsEnumerable={},$propertyIsEnumerable={}.propertyIsEnumerable,getOwnPropertyDescriptor$1=Object.getOwnPropertyDescriptor,NASHORN_BUG=getOwnPropertyDescriptor$1&&!$propertyIsEnumerable.call({1:2},1);objectPropertyIsEnumerable.f=NASHORN_BUG?function(e){var t=getOwnPropertyDescriptor$1(this,e);return !!t&&t.enumerable}:$propertyIsEnumerable;var match,version,createPropertyDescriptor$2=function(e,t){return {enumerable:!(1&e),configurable:!(2&e),writable:!(4&e),value:t}},FunctionPrototype$1=Function.prototype,bind=FunctionPrototype$1.bind,call$3=FunctionPrototype$1.call,callBind=bind&&bind.bind(call$3),functionUncurryThis=bind?function(e){return e&&callBind(call$3,e)}:function(e){return e&&function(){return call$3.apply(e,arguments)}},uncurryThis$8=functionUncurryThis,toString$1=uncurryThis$8({}.toString),stringSlice=uncurryThis$8("".slice),classofRaw=function(e){return stringSlice(toString$1(e),8,-1)},global$k=global$l,uncurryThis$7=functionUncurryThis,fails$3=fails$5,classof=classofRaw,Object$3=global$k.Object,split=uncurryThis$7("".split),indexedObject=fails$3((function(){return !Object$3("z").propertyIsEnumerable(0)}))?function(e){return "String"==classof(e)?split(e,""):Object$3(e)}:Object$3,global$j=global$l,TypeError$7=global$j.TypeError,requireObjectCoercible$2=function(e){if(null==e)throw TypeError$7("Can't call method on "+e);return e},IndexedObject=indexedObject,requireObjectCoercible$1=requireObjectCoercible$2,toIndexedObject$4=function(e){return IndexedObject(requireObjectCoercible$1(e))},isCallable$9=function(e){return "function"==typeof e},isCallable$8=isCallable$9,isObject$5=function(e){return "object"==typeof e?null!==e:isCallable$8(e)},global$i=global$l,isCallable$7=isCallable$9,aFunction=function(e){return isCallable$7(e)?e:void 0},getBuiltIn$4=function(e,t){return arguments.length<2?aFunction(global$i[e]):global$i[e]&&global$i[e][t]},uncurryThis$6=functionUncurryThis,objectIsPrototypeOf=uncurryThis$6({}.isPrototypeOf),getBuiltIn$3=getBuiltIn$4,engineUserAgent=getBuiltIn$3("navigator","userAgent")||"",global$h=global$l,userAgent=engineUserAgent,process=global$h.process,Deno=global$h.Deno,versions=process&&process.versions||Deno&&Deno.version,v8=versions&&versions.v8;v8&&(version=(match=v8.split("."))[0]>0&&match[0]<4?1:+(match[0]+match[1])),!version&&userAgent&&(!(match=userAgent.match(/Edge\/(\d+)/))||match[1]>=74)&&(match=userAgent.match(/Chrome\/(\d+)/))&&(version=+match[1]);var engineV8Version=version,V8_VERSION=engineV8Version,fails$2=fails$5,nativeSymbol=!!Object.getOwnPropertySymbols&&!fails$2((function(){var e=Symbol();return !String(e)||!(Object(e)instanceof Symbol)||!Symbol.sham&&V8_VERSION&&V8_VERSION<41})),NATIVE_SYMBOL$1=nativeSymbol,useSymbolAsUid=NATIVE_SYMBOL$1&&!Symbol.sham&&"symbol"==typeof Symbol.iterator,global$g=global$l,getBuiltIn$2=getBuiltIn$4,isCallable$6=isCallable$9,isPrototypeOf=objectIsPrototypeOf,USE_SYMBOL_AS_UID$1=useSymbolAsUid,Object$2=global$g.Object,isSymbol$2=USE_SYMBOL_AS_UID$1?function(e){return "symbol"==typeof e}:function(e){var t=getBuiltIn$2("Symbol");return isCallable$6(t)&&isPrototypeOf(t.prototype,Object$2(e))},global$f=global$l,String$2=global$f.String,tryToString$1=function(e){try{return String$2(e)}catch(t){return "Object"}},global$e=global$l,isCallable$5=isCallable$9,tryToString=tryToString$1,TypeError$6=global$e.TypeError,aCallable$1=function(e){if(isCallable$5(e))return e;throw TypeError$6(tryToString(e)+" is not a function")},aCallable=aCallable$1,getMethod$1=function(e,t){var r=e[t];return null==r?void 0:aCallable(r)},global$d=global$l,call$2=functionCall,isCallable$4=isCallable$9,isObject$4=isObject$5,TypeError$5=global$d.TypeError,ordinaryToPrimitive$1=function(e,t){var r,n;if("string"===t&&isCallable$4(r=e.toString)&&!isObject$4(n=call$2(r,e)))return n;if(isCallable$4(r=e.valueOf)&&!isObject$4(n=call$2(r,e)))return n;if("string"!==t&&isCallable$4(r=e.toString)&&!isObject$4(n=call$2(r,e)))return n;throw TypeError$5("Can't convert object to primitive value")},shared$3={exports:{}},global$c=global$l,defineProperty=Object.defineProperty,setGlobal$3=function(e,t){try{defineProperty(global$c,e,{value:t,configurable:!0,writable:!0});}catch(r){global$c[e]=t;}return t},global$b=global$l,setGlobal$2=setGlobal$3,SHARED="__core-js_shared__",store$3=global$b[SHARED]||setGlobal$2(SHARED,{}),sharedStore=store$3,store$2=sharedStore;(shared$3.exports=function(e,t){return store$2[e]||(store$2[e]=void 0!==t?t:{})})("versions",[]).push({version:"3.19.1",mode:"global",copyright:"© 2021 Denis Pushkarev (zloirock.ru)"});var global$a=global$l,requireObjectCoercible=requireObjectCoercible$2,Object$1=global$a.Object,toObject$2=function(e){return Object$1(requireObjectCoercible(e))},uncurryThis$5=functionUncurryThis,toObject$1=toObject$2,hasOwnProperty=uncurryThis$5({}.hasOwnProperty),hasOwnProperty_1=Object.hasOwn||function(e,t){return hasOwnProperty(toObject$1(e),t)},uncurryThis$4=functionUncurryThis,id=0,postfix=Math.random(),toString=uncurryThis$4(1..toString),uid$2=function(e){return "Symbol("+(void 0===e?"":e)+")_"+toString(++id+postfix,36)},global$9=global$l,shared$2=shared$3.exports,hasOwn$6=hasOwnProperty_1,uid$1=uid$2,NATIVE_SYMBOL=nativeSymbol,USE_SYMBOL_AS_UID=useSymbolAsUid,WellKnownSymbolsStore=shared$2("wks"),Symbol$1=global$9.Symbol,symbolFor=Symbol$1&&Symbol$1.for,createWellKnownSymbol=USE_SYMBOL_AS_UID?Symbol$1:Symbol$1&&Symbol$1.withoutSetter||uid$1,wellKnownSymbol$2=function(e){if(!hasOwn$6(WellKnownSymbolsStore,e)||!NATIVE_SYMBOL&&"string"!=typeof WellKnownSymbolsStore[e]){var t="Symbol."+e;NATIVE_SYMBOL&&hasOwn$6(Symbol$1,e)?WellKnownSymbolsStore[e]=Symbol$1[e]:WellKnownSymbolsStore[e]=USE_SYMBOL_AS_UID&&symbolFor?symbolFor(t):createWellKnownSymbol(t);}return WellKnownSymbolsStore[e]},global$8=global$l,call$1=functionCall,isObject$3=isObject$5,isSymbol$1=isSymbol$2,getMethod=getMethod$1,ordinaryToPrimitive=ordinaryToPrimitive$1,wellKnownSymbol$1=wellKnownSymbol$2,TypeError$4=global$8.TypeError,TO_PRIMITIVE=wellKnownSymbol$1("toPrimitive"),toPrimitive$1=function(e,t){if(!isObject$3(e)||isSymbol$1(e))return e;var r,n=getMethod(e,TO_PRIMITIVE);if(n){if(void 0===t&&(t="default"),r=call$1(n,e,t),!isObject$3(r)||isSymbol$1(r))return r;throw TypeError$4("Can't convert object to primitive value")}return void 0===t&&(t="number"),ordinaryToPrimitive(e,t)},toPrimitive=toPrimitive$1,isSymbol=isSymbol$2,toPropertyKey$2=function(e){var t=toPrimitive(e,"string");return isSymbol(t)?t:t+""},global$7=global$l,isObject$2=isObject$5,document$1=global$7.document,EXISTS$1=isObject$2(document$1)&&isObject$2(document$1.createElement),documentCreateElement$1=function(e){return EXISTS$1?document$1.createElement(e):{}},DESCRIPTORS$5=descriptors,fails$1=fails$5,createElement=documentCreateElement$1,ie8DomDefine=!DESCRIPTORS$5&&!fails$1((function(){return 7!=Object.defineProperty(createElement("div"),"a",{get:function(){return 7}}).a})),DESCRIPTORS$4=descriptors,call=functionCall,propertyIsEnumerableModule=objectPropertyIsEnumerable,createPropertyDescriptor$1=createPropertyDescriptor$2,toIndexedObject$3=toIndexedObject$4,toPropertyKey$1=toPropertyKey$2,hasOwn$5=hasOwnProperty_1,IE8_DOM_DEFINE$1=ie8DomDefine,$getOwnPropertyDescriptor=Object.getOwnPropertyDescriptor;objectGetOwnPropertyDescriptor.f=DESCRIPTORS$4?$getOwnPropertyDescriptor:function(e,t){if(e=toIndexedObject$3(e),t=toPropertyKey$1(t),IE8_DOM_DEFINE$1)try{return $getOwnPropertyDescriptor(e,t)}catch(r){}if(hasOwn$5(e,t))return createPropertyDescriptor$1(!call(propertyIsEnumerableModule.f,e,t),e[t])};var objectDefineProperty={},global$6=global$l,isObject$1=isObject$5,String$1=global$6.String,TypeError$3=global$6.TypeError,anObject$4=function(e){if(isObject$1(e))return e;throw TypeError$3(String$1(e)+" is not an object")},global$5=global$l,DESCRIPTORS$3=descriptors,IE8_DOM_DEFINE=ie8DomDefine,anObject$3=anObject$4,toPropertyKey=toPropertyKey$2,TypeError$2=global$5.TypeError,$defineProperty=Object.defineProperty;objectDefineProperty.f=DESCRIPTORS$3?$defineProperty:function(e,t,r){if(anObject$3(e),t=toPropertyKey(t),anObject$3(r),IE8_DOM_DEFINE)try{return $defineProperty(e,t,r)}catch(n){}if("get"in r||"set"in r)throw TypeError$2("Accessors not supported");return "value"in r&&(e[t]=r.value),e};var DESCRIPTORS$2=descriptors,definePropertyModule$3=objectDefineProperty,createPropertyDescriptor=createPropertyDescriptor$2,createNonEnumerableProperty$3=DESCRIPTORS$2?function(e,t,r){return definePropertyModule$3.f(e,t,createPropertyDescriptor(1,r))}:function(e,t,r){return e[t]=r,e},redefine$1={exports:{}},uncurryThis$3=functionUncurryThis,isCallable$3=isCallable$9,store$1=sharedStore,functionToString=uncurryThis$3(Function.toString);isCallable$3(store$1.inspectSource)||(store$1.inspectSource=function(e){return functionToString(e)});var set,get,has,inspectSource$2=store$1.inspectSource,global$4=global$l,isCallable$2=isCallable$9,inspectSource$1=inspectSource$2,WeakMap$2=global$4.WeakMap,nativeWeakMap=isCallable$2(WeakMap$2)&&/native code/.test(inspectSource$1(WeakMap$2)),shared$1=shared$3.exports,uid=uid$2,keys=shared$1("keys"),sharedKey$2=function(e){return keys[e]||(keys[e]=uid(e))},hiddenKeys$4={},NATIVE_WEAK_MAP=nativeWeakMap,global$3=global$l,uncurryThis$2=functionUncurryThis,isObject=isObject$5,createNonEnumerableProperty$2=createNonEnumerableProperty$3,hasOwn$4=hasOwnProperty_1,shared=sharedStore,sharedKey$1=sharedKey$2,hiddenKeys$3=hiddenKeys$4,OBJECT_ALREADY_INITIALIZED="Object already initialized",TypeError$1=global$3.TypeError,WeakMap$1=global$3.WeakMap,enforce=function(e){return has(e)?get(e):set(e,{})},getterFor=function(e){return function(t){var r;if(!isObject(t)||(r=get(t)).type!==e)throw TypeError$1("Incompatible receiver, "+e+" required");return r}};if(NATIVE_WEAK_MAP||shared.state){var store=shared.state||(shared.state=new WeakMap$1),wmget=uncurryThis$2(store.get),wmhas=uncurryThis$2(store.has),wmset=uncurryThis$2(store.set);set=function(e,t){if(wmhas(store,e))throw new TypeError$1(OBJECT_ALREADY_INITIALIZED);return t.facade=e,wmset(store,e,t),t},get=function(e){return wmget(store,e)||{}},has=function(e){return wmhas(store,e)};}else {var STATE=sharedKey$1("state");hiddenKeys$3[STATE]=!0,set=function(e,t){if(hasOwn$4(e,STATE))throw new TypeError$1(OBJECT_ALREADY_INITIALIZED);return t.facade=e,createNonEnumerableProperty$2(e,STATE,t),t},get=function(e){return hasOwn$4(e,STATE)?e[STATE]:{}},has=function(e){return hasOwn$4(e,STATE)};}var internalState={set:set,get:get,has:has,enforce:enforce,getterFor:getterFor},DESCRIPTORS$1=descriptors,hasOwn$3=hasOwnProperty_1,FunctionPrototype=Function.prototype,getDescriptor=DESCRIPTORS$1&&Object.getOwnPropertyDescriptor,EXISTS=hasOwn$3(FunctionPrototype,"name"),PROPER=EXISTS&&"something"===function(){}.name,CONFIGURABLE=EXISTS&&(!DESCRIPTORS$1||DESCRIPTORS$1&&getDescriptor(FunctionPrototype,"name").configurable),functionName={EXISTS:EXISTS,PROPER:PROPER,CONFIGURABLE:CONFIGURABLE},global$2=global$l,isCallable$1=isCallable$9,hasOwn$2=hasOwnProperty_1,createNonEnumerableProperty$1=createNonEnumerableProperty$3,setGlobal$1=setGlobal$3,inspectSource=inspectSource$2,InternalStateModule=internalState,CONFIGURABLE_FUNCTION_NAME=functionName.CONFIGURABLE,getInternalState=InternalStateModule.get,enforceInternalState=InternalStateModule.enforce,TEMPLATE=String(String).split("String");(redefine$1.exports=function(e,t,r,n){var o,i=!!n&&!!n.unsafe,a=!!n&&!!n.enumerable,c=!!n&&!!n.noTargetGet,l=n&&void 0!==n.name?n.name:t;isCallable$1(r)&&("Symbol("===String(l).slice(0,7)&&(l="["+String(l).replace(/^Symbol\(([^)]*)\)/,"$1")+"]"),(!hasOwn$2(r,"name")||CONFIGURABLE_FUNCTION_NAME&&r.name!==l)&&createNonEnumerableProperty$1(r,"name",l),(o=enforceInternalState(r)).source||(o.source=TEMPLATE.join("string"==typeof l?l:""))),e!==global$2?(i?!c&&e[t]&&(a=!0):delete e[t],a?e[t]=r:createNonEnumerableProperty$1(e,t,r)):a?e[t]=r:setGlobal$1(t,r);})(Function.prototype,"toString",(function(){return isCallable$1(this)&&getInternalState(this).source||inspectSource(this)}));var objectGetOwnPropertyNames={},ceil=Math.ceil,floor=Math.floor,toIntegerOrInfinity$3=function(e){var t=+e;return t!=t||0===t?0:(t>0?floor:ceil)(t)},toIntegerOrInfinity$2=toIntegerOrInfinity$3,max=Math.max,min$1=Math.min,toAbsoluteIndex$1=function(e,t){var r=toIntegerOrInfinity$2(e);return r<0?max(r+t,0):min$1(r,t)},toIntegerOrInfinity$1=toIntegerOrInfinity$3,min=Math.min,toLength$1=function(e){return e>0?min(toIntegerOrInfinity$1(e),9007199254740991):0},toLength=toLength$1,lengthOfArrayLike$2=function(e){return toLength(e.length)},toIndexedObject$2=toIndexedObject$4,toAbsoluteIndex=toAbsoluteIndex$1,lengthOfArrayLike$1=lengthOfArrayLike$2,createMethod=function(e){return function(t,r,n){var o,i=toIndexedObject$2(t),a=lengthOfArrayLike$1(i),c=toAbsoluteIndex(n,a);if(e&&r!=r){for(;a>c;)if((o=i[c++])!=o)return !0}else for(;a>c;c++)if((e||c in i)&&i[c]===r)return e||c||0;return !e&&-1}},arrayIncludes={includes:createMethod(!0),indexOf:createMethod(!1)},uncurryThis$1=functionUncurryThis,hasOwn$1=hasOwnProperty_1,toIndexedObject$1=toIndexedObject$4,indexOf=arrayIncludes.indexOf,hiddenKeys$2=hiddenKeys$4,push=uncurryThis$1([].push),objectKeysInternal=function(e,t){var r,n=toIndexedObject$1(e),o=0,i=[];for(r in n)!hasOwn$1(hiddenKeys$2,r)&&hasOwn$1(n,r)&&push(i,r);for(;t.length>o;)hasOwn$1(n,r=t[o++])&&(~indexOf(i,r)||push(i,r));return i},enumBugKeys$3=["constructor","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","toLocaleString","toString","valueOf"],internalObjectKeys$1=objectKeysInternal,enumBugKeys$2=enumBugKeys$3,hiddenKeys$1=enumBugKeys$2.concat("length","prototype");objectGetOwnPropertyNames.f=Object.getOwnPropertyNames||function(e){return internalObjectKeys$1(e,hiddenKeys$1)};var objectGetOwnPropertySymbols={};objectGetOwnPropertySymbols.f=Object.getOwnPropertySymbols;var activeXDocument,getBuiltIn$1=getBuiltIn$4,uncurryThis=functionUncurryThis,getOwnPropertyNamesModule=objectGetOwnPropertyNames,getOwnPropertySymbolsModule=objectGetOwnPropertySymbols,anObject$2=anObject$4,concat=uncurryThis([].concat),ownKeys$2=getBuiltIn$1("Reflect","ownKeys")||function(e){var t=getOwnPropertyNamesModule.f(anObject$2(e)),r=getOwnPropertySymbolsModule.f;return r?concat(t,r(e)):t},hasOwn=hasOwnProperty_1,ownKeys$1=ownKeys$2,getOwnPropertyDescriptorModule=objectGetOwnPropertyDescriptor,definePropertyModule$2=objectDefineProperty,copyConstructorProperties$1=function(e,t){for(var r=ownKeys$1(t),n=definePropertyModule$2.f,o=getOwnPropertyDescriptorModule.f,i=0;i<r.length;i++){var a=r[i];hasOwn(e,a)||n(e,a,o(t,a));}},fails=fails$5,isCallable=isCallable$9,replacement=/#|\.prototype\./,isForced$1=function(e,t){var r=data[normalize(e)];return r==POLYFILL||r!=NATIVE&&(isCallable(t)?fails(t):!!t)},normalize=isForced$1.normalize=function(e){return String(e).replace(replacement,".").toLowerCase()},data=isForced$1.data={},NATIVE=isForced$1.NATIVE="N",POLYFILL=isForced$1.POLYFILL="P",isForced_1=isForced$1,global$1=global$l,getOwnPropertyDescriptor=objectGetOwnPropertyDescriptor.f,createNonEnumerableProperty=createNonEnumerableProperty$3,redefine=redefine$1.exports,setGlobal=setGlobal$3,copyConstructorProperties=copyConstructorProperties$1,isForced=isForced_1,_export=function(e,t){var r,n,o,i,a,c=e.target,l=e.global,u=e.stat;if(r=l?global$1:u?global$1[c]||setGlobal(c,{}):(global$1[c]||{}).prototype)for(n in t){if(i=t[n],o=e.noTargetGet?(a=getOwnPropertyDescriptor(r,n))&&a.value:r[n],!isForced(l?n:c+(u?".":"#")+n,e.forced)&&void 0!==o){if(typeof i==typeof o)continue;copyConstructorProperties(i,o);}(e.sham||o&&o.sham)&&createNonEnumerableProperty(i,"sham",!0),redefine(r,n,i,e);}},internalObjectKeys=objectKeysInternal,enumBugKeys$1=enumBugKeys$3,objectKeys$1=Object.keys||function(e){return internalObjectKeys(e,enumBugKeys$1)},DESCRIPTORS=descriptors,definePropertyModule$1=objectDefineProperty,anObject$1=anObject$4,toIndexedObject=toIndexedObject$4,objectKeys=objectKeys$1,objectDefineProperties=DESCRIPTORS?Object.defineProperties:function(e,t){anObject$1(e);for(var r,n=toIndexedObject(t),o=objectKeys(t),i=o.length,a=0;i>a;)definePropertyModule$1.f(e,r=o[a++],n[r]);return e},getBuiltIn=getBuiltIn$4,html$1=getBuiltIn("document","documentElement"),anObject=anObject$4,defineProperties=objectDefineProperties,enumBugKeys=enumBugKeys$3,hiddenKeys=hiddenKeys$4,html=html$1,documentCreateElement=documentCreateElement$1,sharedKey=sharedKey$2,GT=">",LT="<",PROTOTYPE="prototype",SCRIPT="script",IE_PROTO=sharedKey("IE_PROTO"),EmptyConstructor=function(){},scriptTag=function(e){return LT+SCRIPT+GT+e+LT+"/"+SCRIPT+GT},NullProtoObjectViaActiveX=function(e){e.write(scriptTag("")),e.close();var t=e.parentWindow.Object;return e=null,t},NullProtoObjectViaIFrame=function(){var e,t=documentCreateElement("iframe"),r="java"+SCRIPT+":";return t.style.display="none",html.appendChild(t),t.src=String(r),(e=t.contentWindow.document).open(),e.write(scriptTag("document.F=Object")),e.close(),e.F},NullProtoObject=function(){try{activeXDocument=new ActiveXObject("htmlfile");}catch(t){}NullProtoObject="undefined"!=typeof document?document.domain&&activeXDocument?NullProtoObjectViaActiveX(activeXDocument):NullProtoObjectViaIFrame():NullProtoObjectViaActiveX(activeXDocument);for(var e=enumBugKeys.length;e--;)delete NullProtoObject[PROTOTYPE][enumBugKeys[e]];return NullProtoObject()};hiddenKeys[IE_PROTO]=!0;var objectCreate=Object.create||function(e,t){var r;return null!==e?(EmptyConstructor[PROTOTYPE]=anObject(e),r=new EmptyConstructor,EmptyConstructor[PROTOTYPE]=null,r[IE_PROTO]=e):r=NullProtoObject(),void 0===t?r:defineProperties(r,t)},wellKnownSymbol=wellKnownSymbol$2,create=objectCreate,definePropertyModule=objectDefineProperty,UNSCOPABLES=wellKnownSymbol("unscopables"),ArrayPrototype=Array.prototype;null==ArrayPrototype[UNSCOPABLES]&&definePropertyModule.f(ArrayPrototype,UNSCOPABLES,{configurable:!0,value:create(null)});var addToUnscopables$1=function(e){ArrayPrototype[UNSCOPABLES][e]=!0;},$=_export,toObject=toObject$2,lengthOfArrayLike=lengthOfArrayLike$2,toIntegerOrInfinity=toIntegerOrInfinity$3,addToUnscopables=addToUnscopables$1;function _asyncIterator(e){var t,r,n,o=2;for("undefined"!=typeof Symbol&&(r=Symbol.asyncIterator,n=Symbol.iterator);o--;){if(r&&null!=(t=e[r]))return t.call(e);if(n&&null!=(t=e[n]))return new AsyncFromSyncIterator(t.call(e));r="@@asyncIterator",n="@@iterator";}throw new TypeError("Object is not async iterable")}function AsyncFromSyncIterator(e){function t(e){if(Object(e)!==e)return Promise.reject(new TypeError(e+" is not an object."));var t=e.done;return Promise.resolve(e.value).then((function(e){return {value:e,done:t}}))}return AsyncFromSyncIterator=function(e){this.s=e,this.n=e.next;},AsyncFromSyncIterator.prototype={s:null,n:null,next:function(){return t(this.n.apply(this.s,arguments))},return:function(e){var r=this.s.return;return void 0===r?Promise.resolve({value:e,done:!0}):t(r.apply(this.s,arguments))},throw:function(e){var r=this.s.return;return void 0===r?Promise.reject(e):t(r.apply(this.s,arguments))}},new AsyncFromSyncIterator(e)}function ownKeys(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n);}return r}function _objectSpread2(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?ownKeys(Object(r),!0).forEach((function(t){_defineProperty(e,t,r[t]);})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):ownKeys(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t));}));}return e}function _typeof(e){return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},_typeof(e)}function _AwaitValue(e){this.wrapped=e;}function _AsyncGenerator(e){var t,r;function n(t,r){try{var i=e[t](r),a=i.value,c=a instanceof _AwaitValue;Promise.resolve(c?a.wrapped:a).then((function(e){c?n("return"===t?"return":"next",e):o(i.done?"return":"normal",e);}),(function(e){n("throw",e);}));}catch(l){o("throw",l);}}function o(e,o){switch(e){case"return":t.resolve({value:o,done:!0});break;case"throw":t.reject(o);break;default:t.resolve({value:o,done:!1});}(t=t.next)?n(t.key,t.arg):r=null;}this._invoke=function(e,o){return new Promise((function(i,a){var c={key:e,arg:o,resolve:i,reject:a,next:null};r?r=r.next=c:(t=r=c,n(e,o));}))},"function"!=typeof e.return&&(this.return=void 0);}function _wrapAsyncGenerator(e){return function(){return new _AsyncGenerator(e.apply(this,arguments))}}function _awaitAsyncGenerator(e){return new _AwaitValue(e)}function _asyncGeneratorDelegate(e,t){var r={},n=!1;function o(r,o){return n=!0,o=new Promise((function(t){t(e[r](o));})),{done:!1,value:t(o)}}return r["undefined"!=typeof Symbol&&Symbol.iterator||"@@iterator"]=function(){return this},r.next=function(e){return n?(n=!1,e):o("next",e)},"function"==typeof e.throw&&(r.throw=function(e){if(n)throw n=!1,e;return o("throw",e)}),"function"==typeof e.return&&(r.return=function(e){return n?(n=!1,e):o("return",e)}),r}function asyncGeneratorStep(e,t,r,n,o,i,a){try{var c=e[i](a),l=c.value;}catch(u){return void r(u)}c.done?t(l):Promise.resolve(l).then(n,o);}function _asyncToGenerator(e){return function(){var t=this,r=arguments;return new Promise((function(n,o){var i=e.apply(t,r);function a(e){asyncGeneratorStep(i,n,o,a,c,"next",e);}function c(e){asyncGeneratorStep(i,n,o,a,c,"throw",e);}a(void 0);}))}}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n);}}function _createClass(e,t,r){return t&&_defineProperties(e.prototype,t),r&&_defineProperties(e,r),e}function _defineProperty(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&_setPrototypeOf(e,t);}function _getPrototypeOf(e){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)},_getPrototypeOf(e)}function _setPrototypeOf(e,t){return _setPrototypeOf=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e},_setPrototypeOf(e,t)}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return !1;if(Reflect.construct.sham)return !1;if("function"==typeof Proxy)return !0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return !1}}function _construct(e,t,r){return _construct=_isNativeReflectConstruct()?Reflect.construct:function(e,t,r){var n=[null];n.push.apply(n,t);var o=new(Function.bind.apply(e,n));return r&&_setPrototypeOf(o,r.prototype),o},_construct.apply(null,arguments)}function _isNativeFunction(e){return -1!==Function.toString.call(e).indexOf("[native code]")}function _wrapNativeSuper(e){var t="function"==typeof Map?new Map:void 0;return _wrapNativeSuper=function(e){if(null===e||!_isNativeFunction(e))return e;if("function"!=typeof e)throw new TypeError("Super expression must either be null or a function");if(void 0!==t){if(t.has(e))return t.get(e);t.set(e,r);}function r(){return _construct(e,arguments,_getPrototypeOf(this).constructor)}return r.prototype=Object.create(e.prototype,{constructor:{value:r,enumerable:!1,writable:!0,configurable:!0}}),_setPrototypeOf(r,e)},_wrapNativeSuper(e)}function _assertThisInitialized(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function _possibleConstructorReturn(e,t){if(t&&("object"==typeof t||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return _assertThisInitialized(e)}function _createSuper(e){var t=_isNativeReflectConstruct();return function(){var r,n=_getPrototypeOf(e);if(t){var o=_getPrototypeOf(this).constructor;r=Reflect.construct(n,arguments,o);}else r=n.apply(this,arguments);return _possibleConstructorReturn(this,r)}}function _superPropBase(e,t){for(;!Object.prototype.hasOwnProperty.call(e,t)&&null!==(e=_getPrototypeOf(e)););return e}function _get(e,t,r){return _get="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function(e,t,r){var n=_superPropBase(e,t);if(n){var o=Object.getOwnPropertyDescriptor(n,t);return o.get?o.get.call(r):o.value}},_get(e,t,r||e)}function _slicedToArray(e,t){return _arrayWithHoles(e)||_iterableToArrayLimit(e,t)||_unsupportedIterableToArray(e,t)||_nonIterableRest()}function _toArray(e){return _arrayWithHoles(e)||_iterableToArray(e)||_unsupportedIterableToArray(e)||_nonIterableRest()}function _toConsumableArray(e){return _arrayWithoutHoles(e)||_iterableToArray(e)||_unsupportedIterableToArray(e)||_nonIterableSpread()}function _arrayWithoutHoles(e){if(Array.isArray(e))return _arrayLikeToArray(e)}function _arrayWithHoles(e){if(Array.isArray(e))return e}function _iterableToArray(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}function _iterableToArrayLimit(e,t){var r=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=r){var n,o,i=[],a=!0,c=!1;try{for(r=r.call(e);!(a=(n=r.next()).done)&&(i.push(n.value),!t||i.length!==t);a=!0);}catch(l){c=!0,o=l;}finally{try{a||null==r.return||r.return();}finally{if(c)throw o}}return i}}function _unsupportedIterableToArray(e,t){if(e){if("string"==typeof e)return _arrayLikeToArray(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return "Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?_arrayLikeToArray(e,t):void 0}}function _arrayLikeToArray(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _createForOfIteratorHelper(e,t){var r="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!r){if(Array.isArray(e)||(r=_unsupportedIterableToArray(e))||t&&e&&"number"==typeof e.length){r&&(e=r);var n=0,o=function(){};return {s:o,n:function(){return n>=e.length?{done:!0}:{done:!1,value:e[n++]}},e:function(e){throw e},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,a=!0,c=!1;return {s:function(){r=r.call(e);},n:function(){var e=r.next();return a=e.done,e},e:function(e){c=!0,i=e;},f:function(){try{a||null==r.return||r.return();}finally{if(c)throw i}}}}function _classPrivateFieldGet(e,t){return _classApplyDescriptorGet(e,_classExtractFieldDescriptor(e,t,"get"))}function _classPrivateFieldSet(e,t,r){return _classApplyDescriptorSet(e,_classExtractFieldDescriptor(e,t,"set"),r),r}function _classExtractFieldDescriptor(e,t,r){if(!t.has(e))throw new TypeError("attempted to "+r+" private field on non-instance");return t.get(e)}function _classStaticPrivateMethodGet(e,t,r){return _classCheckPrivateStaticAccess(e,t),r}function _classApplyDescriptorGet(e,t){return t.get?t.get.call(e):t.value}function _classApplyDescriptorSet(e,t,r){if(t.set)t.set.call(e,r);else {if(!t.writable)throw new TypeError("attempted to set read only private field");t.value=r;}}function _classCheckPrivateStaticAccess(e,t){if(e!==t)throw new TypeError("Private static access of wrong provenance")}function _classPrivateMethodGet(e,t,r){if(!t.has(e))throw new TypeError("attempted to get private field on non-instance");return r}function _checkPrivateRedeclaration(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object")}function _classPrivateFieldInitSpec(e,t,r){_checkPrivateRedeclaration(e,t),t.set(e,r);}function _classPrivateMethodInitSpec(e,t){_checkPrivateRedeclaration(e,t),t.add(e);}$({target:"Array",proto:!0},{at:function(e){var t=toObject(this),r=lengthOfArrayLike(t),n=toIntegerOrInfinity(e),o=n>=0?n:r+n;return o<0||o>=r?void 0:t[o]}}),addToUnscopables("at"),_AsyncGenerator.prototype["function"==typeof Symbol&&Symbol.asyncIterator||"@@asyncIterator"]=function(){return this},_AsyncGenerator.prototype.next=function(e){return this._invoke("next",e)},_AsyncGenerator.prototype.throw=function(e){return this._invoke("throw",e)},_AsyncGenerator.prototype.return=function(e){return this._invoke("return",e)};var appendChildren=function(e,t){(t=Array.isArray(t)?t:[t]).forEach((function(t){t instanceof HTMLElement?e.appendChild(t):(t||"string"==typeof t)&&e.appendChild(document.createTextNode(t.toString()));}));},setStyles=function(e,t){for(var r in t)e.style[r]=t[r];},runtime={exports:{}};!function(e){var t=function(e){var t,r=Object.prototype,n=r.hasOwnProperty,o="function"==typeof Symbol?Symbol:{},i=o.iterator||"@@iterator",a=o.asyncIterator||"@@asyncIterator",c=o.toStringTag||"@@toStringTag";function l(e,t,r){return Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}),e[t]}try{l({},"");}catch(C){l=function(e,t,r){return e[t]=r};}function u(e,t,r,n){var o=t&&t.prototype instanceof d?t:d,i=Object.create(o.prototype),a=new j(n||[]);return i._invoke=function(e,t,r){var n=f;return function(o,i){if(n===p)throw new Error("Generator is already running");if(n===b){if("throw"===o)throw i;return A()}for(r.method=o,r.arg=i;;){var a=r.delegate;if(a){var c=_(a,r);if(c){if(c===h)continue;return c}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if(n===f)throw n=b,r.arg;r.dispatchException(r.arg);}else "return"===r.method&&r.abrupt("return",r.arg);n=p;var l=s(e,t,r);if("normal"===l.type){if(n=r.done?b:y,l.arg===h)continue;return {value:l.arg,done:r.done}}"throw"===l.type&&(n=b,r.method="throw",r.arg=l.arg);}}}(e,r,a),i}function s(e,t,r){try{return {type:"normal",arg:e.call(t,r)}}catch(C){return {type:"throw",arg:C}}}e.wrap=u;var f="suspendedStart",y="suspendedYield",p="executing",b="completed",h={};function d(){}function $(){}function g(){}var m={};l(m,i,(function(){return this}));var O=Object.getPrototypeOf,v=O&&O(O(I([])));v&&v!==r&&n.call(v,i)&&(m=v);var S=g.prototype=d.prototype=Object.create(m);function w(e){["next","throw","return"].forEach((function(t){l(e,t,(function(e){return this._invoke(t,e)}));}));}function P(e,t){function r(o,i,a,c){var l=s(e[o],e,i);if("throw"!==l.type){var u=l.arg,f=u.value;return f&&"object"===_typeof(f)&&n.call(f,"__await")?t.resolve(f.__await).then((function(e){r("next",e,a,c);}),(function(e){r("throw",e,a,c);})):t.resolve(f).then((function(e){u.value=e,a(u);}),(function(e){return r("throw",e,a,c)}))}c(l.arg);}var o;this._invoke=function(e,n){function i(){return new t((function(t,o){r(e,n,t,o);}))}return o=o?o.then(i,i):i()};}function _(e,r){var n=e.iterator[r.method];if(n===t){if(r.delegate=null,"throw"===r.method){if(e.iterator.return&&(r.method="return",r.arg=t,_(e,r),"throw"===r.method))return h;r.method="throw",r.arg=new TypeError("The iterator does not provide a 'throw' method");}return h}var o=s(n,e.iterator,r.arg);if("throw"===o.type)return r.method="throw",r.arg=o.arg,r.delegate=null,h;var i=o.arg;return i?i.done?(r[e.resultName]=i.value,r.next=e.nextLoc,"return"!==r.method&&(r.method="next",r.arg=t),r.delegate=null,h):i:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,h)}function E(e){var t={tryLoc:e[0]};1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t);}function T(e){var t=e.completion||{};t.type="normal",delete t.arg,e.completion=t;}function j(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(E,this),this.reset(!0);}function I(e){if(e){var r=e[i];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,a=function r(){for(;++o<e.length;)if(n.call(e,o))return r.value=e[o],r.done=!1,r;return r.value=t,r.done=!0,r};return a.next=a}}return {next:A}}function A(){return {value:t,done:!0}}return $.prototype=g,l(S,"constructor",g),l(g,"constructor",$),$.displayName=l(g,c,"GeneratorFunction"),e.isGeneratorFunction=function(e){var t="function"==typeof e&&e.constructor;return !!t&&(t===$||"GeneratorFunction"===(t.displayName||t.name))},e.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,g):(e.__proto__=g,l(e,c,"GeneratorFunction")),e.prototype=Object.create(S),e},e.awrap=function(e){return {__await:e}},w(P.prototype),l(P.prototype,a,(function(){return this})),e.AsyncIterator=P,e.async=function(t,r,n,o,i){void 0===i&&(i=Promise);var a=new P(u(t,r,n,o),i);return e.isGeneratorFunction(r)?a:a.next().then((function(e){return e.done?e.value:a.next()}))},w(S),l(S,c,"Generator"),l(S,i,(function(){return this})),l(S,"toString",(function(){return "[object Generator]"})),e.keys=function(e){var t=[];for(var r in e)t.push(r);return t.reverse(),function r(){for(;t.length;){var n=t.pop();if(n in e)return r.value=n,r.done=!1,r}return r.done=!0,r}},e.values=I,j.prototype={constructor:j,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(T),!e)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=t);},stop:function(){this.done=!0;var e=this.tryEntries[0].completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var r=this;function o(n,o){return c.type="throw",c.arg=e,r.next=n,o&&(r.method="next",r.arg=t),!!o}for(var i=this.tryEntries.length-1;i>=0;--i){var a=this.tryEntries[i],c=a.completion;if("root"===a.tryLoc)return o("end");if(a.tryLoc<=this.prev){var l=n.call(a,"catchLoc"),u=n.call(a,"finallyLoc");if(l&&u){if(this.prev<a.catchLoc)return o(a.catchLoc,!0);if(this.prev<a.finallyLoc)return o(a.finallyLoc)}else if(l){if(this.prev<a.catchLoc)return o(a.catchLoc,!0)}else {if(!u)throw new Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return o(a.finallyLoc)}}}},abrupt:function(e,t){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===e||"continue"===e)&&i.tryLoc<=t&&t<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=e,a.arg=t,i?(this.method="next",this.next=i.finallyLoc,h):this.complete(a)},complete:function(e,t){if("throw"===e.type)throw e.arg;return "break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&t&&(this.next=t),h},finish:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.finallyLoc===e)return this.complete(r.completion,r.afterLoc),T(r),h}},catch:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.tryLoc===e){var n=r.completion;if("throw"===n.type){var o=n.arg;T(r);}return o}}throw new Error("illegal catch attempt")},delegateYield:function(e,r,n){return this.delegate={iterator:I(e),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=t),h}},e}(e.exports);try{regeneratorRuntime=t;}catch(r){"object"===("undefined"==typeof globalThis?"undefined":_typeof(globalThis))?globalThis.regeneratorRuntime=t:Function("r","regeneratorRuntime = r")(t);}}(runtime);var regenerator=runtime.exports;function fixProto(e,t){var r=Object.setPrototypeOf;r?r(e,t):e.__proto__=t;}function fixStack(e,t){void 0===t&&(t=e.constructor);var r=Error.captureStackTrace;r&&r(e,t);}var __extends=function(){var e=function(t,r){return e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t;}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r]);},e(t,r)};return function(t,r){function n(){this.constructor=t;}e(t,r),t.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n);}}(),CustomError=function(e){function t(t){var r=this.constructor,n=e.call(this,t)||this;return Object.defineProperty(n,"name",{value:r.name,enumerable:!1,configurable:!0}),fixProto(n,r.prototype),fixStack(n),n}return __extends(t,e),t}(Error),AbortError=function(e){_inherits(r,_wrapNativeSuper(Error));var t=_createSuper(r);function r(){var e;return _classCallCheck(this,r),(e=t.call(this,"Throttled function aborted")).name="AbortError",e}return r}();function pThrottle(e){var t=e.limit,r=e.interval,n=e.strict;if(!Number.isFinite(t))throw new TypeError("Expected `limit` to be a finite number");if(!Number.isFinite(r))throw new TypeError("Expected `interval` to be a finite number");var o=new Map,i=0,a=0,c=[],l=n?function(){var e=Date.now();if(c.length<t)return c.push(e),0;var n=c.shift()+r;return e>=n?(c.push(e),0):(c.push(n),n-e)}:function(){var e=Date.now();return e-i>r?(a=1,i=e,0):(a<t?a++:(i+=r,a=1),i-e)};return function(e){var t=function t(){for(var r,n=this,i=arguments.length,a=new Array(i),c=0;c<i;c++)a[c]=arguments[c];return t.isEnabled?new Promise((function(t,i){r=setTimeout((function(){t(e.apply(n,a)),o.delete(r);}),l()),o.set(r,i);})):_asyncToGenerator(regenerator.mark((function t(){return regenerator.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",e.apply(n,a));case 1:case"end":return t.stop()}}),t)})))()};return t.abort=function(){var e,t=_createForOfIteratorHelper(o.keys());try{for(t.s();!(e=t.n()).done;){var r=e.value;clearTimeout(r),o.get(r)(new AbortError);}}catch(n){t.e(n);}finally{t.f();}o.clear(),c.splice(0,c.length);},t.isEnabled=!0,t}}

  /* minified: lib */
  var LogLevel,_HANDLER_NAMES;!function(e){e[e.DEBUG=0]="DEBUG",e[e.LOG=1]="LOG",e[e.INFO=2]="INFO",e[e.SUCCESS=3]="SUCCESS",e[e.WARNING=4]="WARNING",e[e.ERROR=5]="ERROR";}(LogLevel||(LogLevel={}));var HANDLER_NAMES=(_defineProperty(_HANDLER_NAMES={},LogLevel.DEBUG,"onDebug"),_defineProperty(_HANDLER_NAMES,LogLevel.LOG,"onLog"),_defineProperty(_HANDLER_NAMES,LogLevel.INFO,"onInfo"),_defineProperty(_HANDLER_NAMES,LogLevel.SUCCESS,"onSuccess"),_defineProperty(_HANDLER_NAMES,LogLevel.WARNING,"onWarn"),_defineProperty(_HANDLER_NAMES,LogLevel.ERROR,"onError"),_HANDLER_NAMES),DEFAULT_OPTIONS={logLevel:LogLevel.INFO,sinks:[]},_configuration=new WeakMap,_fireHandlers=new WeakSet,Logger=function(){function e(t){_classCallCheck(this,e),_classPrivateMethodInitSpec(this,_fireHandlers),_classPrivateFieldInitSpec(this,_configuration,{writable:!0,value:void 0}),_classPrivateFieldSet(this,_configuration,_objectSpread2(_objectSpread2({},DEFAULT_OPTIONS),t));}return _createClass(e,[{key:"debug",value:function(e){_classPrivateMethodGet(this,_fireHandlers,_fireHandlers2).call(this,LogLevel.DEBUG,e);}},{key:"log",value:function(e){_classPrivateMethodGet(this,_fireHandlers,_fireHandlers2).call(this,LogLevel.LOG,e);}},{key:"info",value:function(e){_classPrivateMethodGet(this,_fireHandlers,_fireHandlers2).call(this,LogLevel.INFO,e);}},{key:"success",value:function(e){_classPrivateMethodGet(this,_fireHandlers,_fireHandlers2).call(this,LogLevel.SUCCESS,e);}},{key:"warn",value:function(e,t){_classPrivateMethodGet(this,_fireHandlers,_fireHandlers2).call(this,LogLevel.WARNING,e,t);}},{key:"error",value:function(e,t){_classPrivateMethodGet(this,_fireHandlers,_fireHandlers2).call(this,LogLevel.ERROR,e,t);}},{key:"configure",value:function(e){Object.assign(_classPrivateFieldGet(this,_configuration),e);}},{key:"configuration",get:function(){return _classPrivateFieldGet(this,_configuration)}},{key:"addSink",value:function(e){_classPrivateFieldGet(this,_configuration).sinks.push(e);}}]),e}();function _fireHandlers2(e,t,r){e<_classPrivateFieldGet(this,_configuration).logLevel||_classPrivateFieldGet(this,_configuration).sinks.forEach((function(n){var s=n[HANDLER_NAMES[e]];s&&(r?s.call(n,t,r):s.call(n,t));}));}var LOGGER=new Logger,_scriptName=new WeakMap,_formatMessage=new WeakSet,ConsoleSink=function(){function e(t){_classCallCheck(this,e),_classPrivateMethodInitSpec(this,_formatMessage),_classPrivateFieldInitSpec(this,_scriptName,{writable:!0,value:void 0}),_defineProperty(this,"onSuccess",this.onInfo),_classPrivateFieldSet(this,_scriptName,t);}return _createClass(e,[{key:"onDebug",value:function(e){console.debug(_classPrivateMethodGet(this,_formatMessage,_formatMessage2).call(this,e));}},{key:"onLog",value:function(e){console.log(_classPrivateMethodGet(this,_formatMessage,_formatMessage2).call(this,e));}},{key:"onInfo",value:function(e){console.info(_classPrivateMethodGet(this,_formatMessage,_formatMessage2).call(this,e));}},{key:"onWarn",value:function(e,t){e=_classPrivateMethodGet(this,_formatMessage,_formatMessage2).call(this,e),t?console.warn(e,t):console.warn(e);}},{key:"onError",value:function(e,t){e=_classPrivateMethodGet(this,_formatMessage,_formatMessage2).call(this,e),t?console.error(e,t):console.error(e);}}]),e}();function _formatMessage2(e){return "[".concat(_classPrivateFieldGet(this,_scriptName),"] ").concat(e)}var AssertionError=function(e){_inherits(r,e);var t=_createSuper(r);function r(){return _classCallCheck(this,r),t.apply(this,arguments)}return r}(_wrapNativeSuper(Error));function assert(e,t){if(!e)throw new AssertionError(null!=t?t:"Assertion failed")}function assertDefined(e,t){assert(void 0!==e,null!=t?t:"Assertion failed: Expected value to be defined");}function assertNonNull(e,t){assert(null!==e,null!=t?t:"Assertion failed: Expected value to be non-null");}function assertHasValue(e,t){assert(null!=e,null!=t?t:"Assertion failed: Expected value to be defined and non-null");}function qs(e,t){var r=qsMaybe(e,t);return assertNonNull(r,"Could not find required element"),r}function qsMaybe(e,t){return (null!=t?t:document).querySelector(e)}function qsa(e,t){var r=null!=t?t:document;return _toConsumableArray(r.querySelectorAll(e))}function parseDOM(e,t){var r=(new DOMParser).parseFromString(e,"text/html");if(!qsMaybe("base",r.head)){var n=r.createElement("base");n.href=t,r.head.insertAdjacentElement("beforeend",n);}return r}function safeParseJSON(e,t){try{return JSON.parse(e)}catch(r){if(t)throw new Error(t+": "+r);return}}function getReleaseUrlARs(e){return _getReleaseUrlARs.apply(this,arguments)}function _getReleaseUrlARs(){return (_getReleaseUrlARs=_asyncToGenerator(regenerator.mark((function e(t){var r,n,s;return regenerator.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("https://musicbrainz.org/ws/2/release/".concat(t,"?inc=url-rels&fmt=json"));case 2:return n=e.sent,e.next=5,n.json();case 5:return s=e.sent,e.abrupt("return",null!==(r=s.relations)&&void 0!==r?r:[]);case 7:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function getURLsForRelease(e,t){return _getURLsForRelease.apply(this,arguments)}function _getURLsForRelease(){return (_getURLsForRelease=_asyncToGenerator(regenerator.mark((function e(t,r){var n,s,a,i,o;return regenerator.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return s=(n=null!=r?r:{}).excludeEnded,a=n.excludeDuplicates,e.next=3,getReleaseUrlARs(t);case 3:return i=e.sent,s&&(i=i.filter((function(e){return !e.ended}))),o=i.map((function(e){return e.url.resource})),a&&(o=Array.from(new Set(_toConsumableArray(o)))),e.abrupt("return",o.flatMap((function(e){try{return [new URL(e)]}catch(t){return console.warn("Found malformed URL linked to release: ".concat(e)),[]}})));case 8:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function getReleaseIDsForURL(e){return _getReleaseIDsForURL.apply(this,arguments)}function _getReleaseIDsForURL(){return (_getReleaseIDsForURL=_asyncToGenerator(regenerator.mark((function e(t){var r,n,s,a;return regenerator.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("https://musicbrainz.org/ws/2/url?resource=".concat(encodeURIComponent(t),"&inc=release-rels&fmt=json"));case 2:return s=e.sent,e.next=5,s.json();case 5:return a=e.sent,e.abrupt("return",null!==(r=null===(n=a.relations)||void 0===n?void 0:n.map((function(e){return e.release.id})))&&void 0!==r?r:[]);case 7:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function existsInGM(e){return "undefined"!=typeof GM&&void 0!==GM[e]}function promisify(e){return function(){return Promise.resolve(e.apply(void 0,arguments))}}var GMxmlHttpRequest=existsInGM("xmlHttpRequest")?GM.xmlHttpRequest:promisify(GM_xmlhttpRequest),GMgetResourceUrl=existsInGM("getResourceUrl")?GM.getResourceUrl:existsInGM("getResourceURL")?GM.getResourceURL:promisify(GM_getResourceURL),GMinfo=existsInGM("info")?GM.info:GM_info;function cloneIntoPageContext(e){return "undefined"!=typeof cloneInto&&"undefined"!=typeof unsafeWindow?cloneInto(e,unsafeWindow):e}function getFromPageContext(e){return "undefined"!=typeof unsafeWindow?unsafeWindow[e]:window[e]}var ResponseError=function(e){_inherits(r,CustomError);var t=_createSuper(r);function r(e,n){var s;return _classCallCheck(this,r),s=t.call(this,n),_defineProperty(_assertThisInitialized(s),"url",void 0),s.url=e,s}return r}(),HTTPResponseError=function(e){_inherits(r,ResponseError);var t=_createSuper(r);function r(e,n){var s;return _classCallCheck(this,r),n.statusText.trim()?(s=t.call(this,e,"HTTP error ".concat(n.status,": ").concat(n.statusText)),_defineProperty(_assertThisInitialized(s),"statusCode",void 0),_defineProperty(_assertThisInitialized(s),"statusText",void 0),_defineProperty(_assertThisInitialized(s),"response",void 0)):(s=t.call(this,e,"HTTP error ".concat(n.status)),_defineProperty(_assertThisInitialized(s),"statusCode",void 0),_defineProperty(_assertThisInitialized(s),"statusText",void 0),_defineProperty(_assertThisInitialized(s),"response",void 0)),s.response=n,s.statusCode=n.status,s.statusText=n.statusText,_possibleConstructorReturn(s)}return r}(),TimeoutError=function(e){_inherits(r,ResponseError);var t=_createSuper(r);function r(e){return _classCallCheck(this,r),t.call(this,e,"Request timed out")}return r}(),AbortedError=function(e){_inherits(r,ResponseError);var t=_createSuper(r);function r(e){return _classCallCheck(this,r),t.call(this,e,"Request aborted")}return r}(),NetworkError=function(e){_inherits(r,ResponseError);var t=_createSuper(r);function r(e){return _classCallCheck(this,r),t.call(this,e,"Network error")}return r}();function gmxhr(e,t){return _gmxhr.apply(this,arguments)}function _gmxhr(){return (_gmxhr=_asyncToGenerator(regenerator.mark((function e(t,r){return regenerator.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",new Promise((function(e,n){GMxmlHttpRequest(_objectSpread2(_objectSpread2({method:"GET",url:t instanceof URL?t.href:t},null!=r?r:{}),{},{onload:function(r){r.status>=400?n(new HTTPResponseError(t,r)):e(r);},onerror:function(){n(new NetworkError(t));},onabort:function(){n(new AbortedError(t));},ontimeout:function(){n(new TimeoutError(t));}}));})));case 1:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function filterNonNull(e){return e.filter((function(e){return !(null==e)}))}function groupBy(e,t,r){var n,s=new Map,a=_createForOfIteratorHelper(e);try{for(a.s();!(n=a.n()).done;){var i,o=n.value,l=t(o),c=r(o);s.has(l)?null===(i=s.get(l))||void 0===i||i.push(c):s.set(l,[c]);}}catch(u){a.e(u);}finally{a.f();}return s}function hexEncode(e){var t=getFromPageContext("Uint8Array");return _toConsumableArray(new t(e)).map((function(e){return e.toString(16).padStart(2,"0")})).join("")}function blobToDigest(e){return new Promise((function(t,r){var n=new FileReader;n.addEventListener("error",r),n.addEventListener("load",_asyncToGenerator(regenerator.mark((function e(){var r,s;return regenerator.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(s=n.result,"undefined"==typeof crypto||void 0===(null===(r=crypto.subtle)||void 0===r?void 0:r.digest)){e.next=12;break}return e.t0=t,e.t1=hexEncode,e.next=7,crypto.subtle.digest("SHA-256",s);case 7:e.t2=e.sent,e.t3=(0, e.t1)(e.t2),(0, e.t0)(e.t3),e.next=13;break;case 12:t(hexEncode(s));case 13:case"end":return e.stop()}}),e)})))),n.readAsArrayBuffer(e);}))}var separator="\n–\n",_footer=new WeakMap,_extraInfoLines=new WeakMap,_editNoteTextArea=new WeakMap,_removePreviousFooter=new WeakSet,EditNote=function(){function e(t){_classCallCheck(this,e),_classPrivateMethodInitSpec(this,_removePreviousFooter),_classPrivateFieldInitSpec(this,_footer,{writable:!0,value:void 0}),_classPrivateFieldInitSpec(this,_extraInfoLines,{writable:!0,value:void 0}),_classPrivateFieldInitSpec(this,_editNoteTextArea,{writable:!0,value:void 0}),_classPrivateFieldSet(this,_footer,t),_classPrivateFieldSet(this,_editNoteTextArea,qs("textarea.edit-note"));var r=_classPrivateFieldGet(this,_editNoteTextArea).value.split(separator)[0];_classPrivateFieldSet(this,_extraInfoLines,r?new Set(r.split("\n").map((function(e){return e.trimRight()}))):new Set);}return _createClass(e,[{key:"addExtraInfo",value:function(e){if(!_classPrivateFieldGet(this,_extraInfoLines).has(e)){var t=_classPrivateFieldGet(this,_editNoteTextArea).value.split(separator),r=_toArray(t),n=r[0],s=r.slice(1);n=(n+"\n"+e).trim(),_classPrivateFieldGet(this,_editNoteTextArea).value=[n].concat(_toConsumableArray(s)).join(separator),_classPrivateFieldGet(this,_extraInfoLines).add(e);}}},{key:"addFooter",value:function(){_classPrivateMethodGet(this,_removePreviousFooter,_removePreviousFooter2).call(this);var e=_classPrivateFieldGet(this,_editNoteTextArea).value;_classPrivateFieldGet(this,_editNoteTextArea).value=[e,separator,_classPrivateFieldGet(this,_footer)].join("");}}],[{key:"withFooterFromGMInfo",value:function(){var t=GMinfo.script;return new e("".concat(t.name," ").concat(t.version,"\n").concat(t.namespace))}}]),e}();function _removePreviousFooter2(){var e=this,t=_classPrivateFieldGet(this,_editNoteTextArea).value.split(separator).filter((function(t){return t.trim()!==_classPrivateFieldGet(e,_footer)}));_classPrivateFieldGet(this,_editNoteTextArea).value=t.join(separator);}function splitDomain(e){var t=e.split("."),r=-2;return ["org","co","com"].includes(t.at(-2))&&(r=-3),t.slice(0,r).concat([t.slice(r).join(".")])}var _map=new WeakMap,_insertLeaf=new WeakSet,_insertInternal=new WeakSet,_insert=new WeakSet,_retrieveLeaf=new WeakSet,_retrieveInternal=new WeakSet,_retrieve=new WeakSet,DispatchMap=function(){function e(){_classCallCheck(this,e),_classPrivateMethodInitSpec(this,_retrieve),_classPrivateMethodInitSpec(this,_retrieveInternal),_classPrivateMethodInitSpec(this,_retrieveLeaf),_classPrivateMethodInitSpec(this,_insert),_classPrivateMethodInitSpec(this,_insertInternal),_classPrivateMethodInitSpec(this,_insertLeaf),_classPrivateFieldInitSpec(this,_map,{writable:!0,value:new Map});}return _createClass(e,[{key:"set",value:function(e,t){var r=splitDomain(e);if("*"===e||r[0].includes("*")&&"*"!==r[0]||r.slice(1).some((function(e){return e.includes("*")})))throw new Error("Invalid pattern: "+e);return _classPrivateMethodGet(this,_insert,_insert2).call(this,r.slice().reverse(),t),this}},{key:"get",value:function(e){return _classPrivateMethodGet(this,_retrieve,_retrieve2).call(this,splitDomain(e).slice().reverse())}},{key:"_get",value:function(e){return _classPrivateFieldGet(this,_map).get(e)}},{key:"_set",value:function(e,t){return _classPrivateFieldGet(this,_map).set(e,t),this}}]),e}();function _insertLeaf2(e,t){var r=this._get(e);r?(assert(r instanceof DispatchMap&&!_classPrivateFieldGet(r,_map).has(""),"Duplicate leaf!"),r._set("",t)):this._set(e,t);}function _insertInternal2(e,t){var r,n,s=e[0],a=this._get(s);a instanceof DispatchMap?n=a:(n=new DispatchMap,this._set(s,n),void 0!==a&&n._set("",a)),_classPrivateMethodGet(r=n,_insert,_insert2).call(r,e.slice(1),t);}function _insert2(e,t){e.length>1?_classPrivateMethodGet(this,_insertInternal,_insertInternal2).call(this,e,t):(assert(1===e.length,"Empty domain parts?!"),_classPrivateMethodGet(this,_insertLeaf,_insertLeaf2).call(this,e[0],t));}function _retrieveLeaf2(e){var t=this._get(e);if(t instanceof DispatchMap){var r=t._get("");void 0===r&&(r=t._get("*")),t=r;}return t}function _retrieveInternal2(e){var t=this._get(e[0]);if(t instanceof DispatchMap)return _classPrivateMethodGet(t,_retrieve,_retrieve2).call(t,e.slice(1))}function _retrieve2(e){var t;return void 0===(t=1===e.length?_classPrivateMethodGet(this,_retrieveLeaf,_retrieveLeaf2).call(this,e[0]):_classPrivateMethodGet(this,_retrieveInternal,_retrieveInternal2).call(this,e))&&(t=this._get("*")),t}function createPersistentCheckbox(e,t,r){return [function(){var t=document.createElement("input");return t.setAttribute("type","checkbox"),t.setAttribute("id",e),t.addEventListener("change",(function(t){t.currentTarget.checked?localStorage.setItem(e,"delete_to_disable"):localStorage.removeItem(e),r(t);})),t.setAttribute("defaultChecked",!!localStorage.getItem(e)),t}.call(this),function(){var r=document.createElement("label");return r.setAttribute("for",e),appendChildren(r,t),r}.call(this)]}function asyncSleep(e){return new Promise((function(t){return setTimeout(t,e)}))}function retryTimes(e,t,r){if(t<=0)return Promise.reject(new TypeError("Invalid number of retry times: "+t));function n(e){return s.apply(this,arguments)}function s(){return (s=_asyncToGenerator(regenerator.mark((function t(s){return regenerator.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,e();case 3:return t.abrupt("return",t.sent);case 6:if(t.prev=6,t.t0=t.catch(0),!(s<=1)){t.next=10;break}throw t.t0;case 10:return t.abrupt("return",asyncSleep(r).then((function(){return n(s-1)})));case 11:case"end":return t.stop()}}),t,null,[[0,6]])})))).apply(this,arguments)}return n(t)}

  var USERSCRIPT_NAME = "mb_enhanced_cover_art_uploads";

  // TODO: This originates from mb_caa_dimensions but is also used here. Not sure
  // where to put it. It might make sense to put it in the mb_caa_dimensions source
  // tree later on, and import it in this source tree where necessary.
  function getImageDimensions(url) {
    return new Promise(function (resolve, reject) {
      var done = false;

      function dimensionsLoaded(dimensions) {
        // Make sure we don't poll again, it's not necessary.
        clearInterval(interval);

        if (!done) {
          // Prevent resolving twice.
          resolve(dimensions);
          done = true;
          img.src = ''; // Cancel loading the image
        }
      }

      function dimensionsFailed() {
        clearInterval(interval);

        if (!done) {
          done = true;
          reject();
        }
      }

      var img = document.createElement('img');
      img.addEventListener('load', function () {
        dimensionsLoaded({
          height: img.naturalHeight,
          width: img.naturalWidth
        });
      });
      img.addEventListener('error', dimensionsFailed); // onload and onerror are asynchronous, so this interval should have
      // already been set before they are called.

      var interval = window.setInterval(function () {
        if (img.naturalHeight) {
          // naturalHeight will be non-zero as soon as enough of the image
          // is loaded to determine its dimensions.
          dimensionsLoaded({
            height: img.naturalHeight,
            width: img.naturalWidth
          });
        }
      }, 50); // Start loading the image

      img.src = url;
    });
  }

  function encodeValue(value) {
    if (value instanceof URL) return value.href;
    if (typeof value === 'string') return value;
    return JSON.stringify(value);
  }

  function decodeSingleKeyValue(key, value, images) {
    var _key$match;

    var keyName = key.split('.').at(-1);
    var imageIdxString = (_key$match = key.match(/x_seed\.image\.(\d+)\./)) === null || _key$match === void 0 ? void 0 : _key$match[1];

    if (!imageIdxString || !['url', 'types', 'comment'].includes(keyName)) {
      throw new Error("Unsupported seeded key: ".concat(key));
    }

    var imageIdx = parseInt(imageIdxString);

    if (!images[imageIdx]) {
      images[imageIdx] = {};
    }

    if (keyName === 'url') {
      images[imageIdx].url = new URL(value);
    } else if (keyName === 'types') {
      var types = safeParseJSON(value);

      if (!Array.isArray(types) || types.some(function (type) {
        return typeof type !== 'number';
      })) {
        throw new Error("Invalid 'types' parameter: ".concat(value));
      }

      images[imageIdx].types = types;
    } else {
      images[imageIdx].comment = value;
    }
  }

  var SeedParameters = /*#__PURE__*/function () {
    function SeedParameters(images, origin) {
      _classCallCheck(this, SeedParameters);

      _defineProperty(this, "images", void 0);

      _defineProperty(this, "origin", void 0);

      this.images = images !== null && images !== void 0 ? images : [];
      this.origin = origin;
    }

    _createClass(SeedParameters, [{
      key: "addImage",
      value: function addImage(image) {
        this.images.push(image);
      }
    }, {
      key: "encode",
      value: function encode() {
        var seedParams = new URLSearchParams(this.images.flatMap(function (image, index) {
          return Object.entries(image).map(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2),
                key = _ref2[0],
                value = _ref2[1];

            return ["x_seed.image.".concat(index, ".").concat(key), encodeValue(value)];
          });
        }));

        if (this.origin) {
          seedParams.append('x_seed.origin', this.origin);
        }

        return seedParams;
      }
    }, {
      key: "createSeedURL",
      value: function createSeedURL(releaseId) {
        return "https://musicbrainz.org/release/".concat(releaseId, "/add-cover-art?").concat(this.encode());
      }
    }], [{
      key: "decode",
      value: function decode(seedParams) {
        var _seedParams$get;

        var images = [];
        seedParams.forEach(function (value, key) {
          // only image parameters can be decoded to cover art images
          if (!key.startsWith('x_seed.image.')) return;

          try {
            decodeSingleKeyValue(key, value, images);
          } catch (err) {
            LOGGER.error("Invalid image seeding param ".concat(key, "=").concat(value), err);
          }
        }); // Sanity checks: Make sure all images have at least a URL, and condense
        // the array in case indices are missing.

        images = images.filter(function (image, index) {
          // URL could be undefined if it either was never given as a param,
          // or if it was invalid.
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          if (image.url) {
            return true;
          } else {
            LOGGER.warn("Ignoring seeded image ".concat(index, ": No URL provided"));
            return false;
          }
        });
        var origin = (_seedParams$get = seedParams.get('x_seed.origin')) !== null && _seedParams$get !== void 0 ? _seedParams$get : undefined;
        return new SeedParameters(images, origin);
      }
    }]);

    return SeedParameters;
  }();

  var AtisketSeeder = {
      supportedDomains: ['atisket.pulsewidth.org.uk'],
      supportedRegexes: [/\.uk\/\?.+/],
      insertSeedLinks: function insertSeedLinks() {
          var _qs$textContent$trim, _qs$textContent, _cachedAnchor$href;
          var alreadyInMB = qsMaybe('.already-in-mb-item');
          if (alreadyInMB === null) {
              return;
          }
          var mbid = (_qs$textContent$trim = (_qs$textContent = qs('a.mb', alreadyInMB).textContent) === null || _qs$textContent === void 0 ? void 0 : _qs$textContent.trim()) !== null && _qs$textContent$trim !== void 0 ? _qs$textContent$trim : '';
          var cachedAnchor = qsMaybe('#submit-button + div > a');
          addSeedLinkToCovers(mbid, (_cachedAnchor$href = cachedAnchor === null || cachedAnchor === void 0 ? void 0 : cachedAnchor.href) !== null && _cachedAnchor$href !== void 0 ? _cachedAnchor$href : document.location.href);
      }
  };
  var AtasketSeeder = {
      supportedDomains: ['atisket.pulsewidth.org.uk'],
      supportedRegexes: [/\.uk\/atasket\.php\?/],
      insertSeedLinks: function insertSeedLinks() {
          var urlParams = new URLSearchParams(document.location.search);
          var mbid = urlParams.get('release_mbid');
          var selfId = urlParams.get('self_id');
          if (!mbid || !selfId) {
              LOGGER.error('Cannot extract IDs! Seeding is disabled :(');
              return;
          }
          var cachedUrl = document.location.origin + '/?cached=' + selfId;
          addSeedLinkToCovers(mbid, cachedUrl);
      }
  };
  function addSeedLinkToCovers(mbid, origin) {
      qsa('figure.cover').forEach(function (fig) {
          addSeedLinkToCover(fig, mbid, origin);
      });
  }
  function addSeedLinkToCover(_x, _x2, _x3) {
      return _addSeedLinkToCover.apply(this, arguments);
  }
  function _addSeedLinkToCover() {
      _addSeedLinkToCover = _asyncToGenerator(regenerator.mark(function _callee(fig, mbid, origin) {
          var _imageUrl$match, _fig$closest, _qs$insertAdjacentEle;
          var imageUrl, ext, imageDimensions, dimensionStr, countryCode, vendorId, vendorCode, releaseUrl, params, seedUrl, dimSpan, seedLink;
          return regenerator.wrap(function _callee$(_context) {
              while (1) {
                  switch (_context.prev = _context.next) {
                  case 0:
                      imageUrl = qs('a.icon', fig).href;
                      ext = (_imageUrl$match = imageUrl.match(/\.(\w+)$/)) === null || _imageUrl$match === void 0 ? void 0 : _imageUrl$match[1];
                      _context.next = 4;
                      return getImageDimensions(imageUrl);
                  case 4:
                      imageDimensions = _context.sent;
                      dimensionStr = ''.concat(imageDimensions.width, 'x').concat(imageDimensions.height);
                      countryCode = (_fig$closest = fig.closest('div')) === null || _fig$closest === void 0 ? void 0 : _fig$closest.getAttribute('data-matched-country');
                      vendorId = fig.getAttribute('data-vendor-id');
                      vendorCode = _toConsumableArray(fig.classList).find(function (klass) {
                          return [
                              'spf',
                              'deez',
                              'itu'
                          ].includes(klass);
                      });
                      if (!(!vendorCode || !vendorId || typeof countryCode !== 'string' || vendorCode === 'itu' && countryCode === '')) {
                          _context.next = 12;
                          break;
                      }
                      LOGGER.error('Could not extract required data for ' + fig.classList.value);
                      return _context.abrupt('return');
                  case 12:
                      releaseUrl = RELEASE_URL_CONSTRUCTORS[vendorCode](vendorId, countryCode);
                      params = new SeedParameters([{ url: new URL(releaseUrl) }], origin);
                      seedUrl = params.createSeedURL(mbid);
                      dimSpan = function () {
                          var $$a = document.createElement('span');
                          setStyles($$a, { display: 'block' });
                          appendChildren($$a, dimensionStr + (ext ? ' '.concat(ext.toUpperCase()) : ''));
                          return $$a;
                      }.call(this);
                      seedLink = function () {
                          var $$c = document.createElement('a');
                          $$c.setAttribute('href', seedUrl);
                          setStyles($$c, { display: 'block' });
                          var $$d = document.createTextNode('\n        Add to release\n    ');
                          $$c.appendChild($$d);
                          return $$c;
                      }.call(this);
                      (_qs$insertAdjacentEle = qs('figcaption > a', fig).insertAdjacentElement('afterend', dimSpan)) === null || _qs$insertAdjacentEle === void 0 ? void 0 : _qs$insertAdjacentEle.insertAdjacentElement('afterend', seedLink);
                  case 18:
                  case 'end':
                      return _context.stop();
                  }
              }
          }, _callee);
      }));
      return _addSeedLinkToCover.apply(this, arguments);
  }
  var RELEASE_URL_CONSTRUCTORS = {
      itu: function itu(id, country) {
          return 'https://music.apple.com/'.concat(country.toLowerCase(), '/album/').concat(id);
      },
      deez: function deez(id) {
          return 'https://www.deezer.com/album/' + id;
      },
      spf: function spf(id) {
          return 'https://open.spotify.com/album/' + id;
      }
  };

  function seederSupportsURL(seeder, url) {
    return seeder.supportedDomains.includes(url.hostname.replace(/^www\./, '')) && seeder.supportedRegexes.some(function (rgx) {
      return rgx.test(url.href);
    });
  }
  var SEEDER_DISPATCH_MAP = new Map();
  function registerSeeder(seeder) {
    seeder.supportedDomains.forEach(function (domain) {
      if (!SEEDER_DISPATCH_MAP.has(domain)) {
        SEEDER_DISPATCH_MAP.set(domain, []);
      } // Optional chaining is unnecessary overhead, we just created the entry above
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion


      SEEDER_DISPATCH_MAP.get(domain).push(seeder);
    });
  }
  function seederFactory(url) {
    var _SEEDER_DISPATCH_MAP$;

    return (_SEEDER_DISPATCH_MAP$ = SEEDER_DISPATCH_MAP.get(url.hostname.replace(/^www\./, ''))) === null || _SEEDER_DISPATCH_MAP$ === void 0 ? void 0 : _SEEDER_DISPATCH_MAP$.find(function (seeder) {
      return seederSupportsURL(seeder, url);
    });
  }

  var CoverArtProvider = /*#__PURE__*/function () {
    function CoverArtProvider() {
      _classCallCheck(this, CoverArtProvider);

      _defineProperty(this, "supportedDomains", void 0);

      _defineProperty(this, "name", void 0);

      _defineProperty(this, "urlRegex", void 0);

      _defineProperty(this, "allowButtons", true);
    }

    _createClass(CoverArtProvider, [{
      key: "postprocessImages",
      value:
      /**
       * Postprocess the fetched images. By default, does nothing, however,
       * subclasses can override this to e.g. filter out or merge images after
       * they've been fetched.
       */
      function postprocessImages(images) {
        return images;
      }
      /**
       * Returns a clean version of the given URL.
       * This version should be used to match against `urlRegex`.
       */

    }, {
      key: "cleanUrl",
      value: function cleanUrl(url) {
        return url.host + url.pathname;
      }
      /**
       * Check whether the provider supports the given URL.
       *
       * @param      {URL}    url     The provider URL.
       * @return     {boolean}  Whether images can be extracted for this URL.
       */

    }, {
      key: "supportsUrl",
      value: function supportsUrl(url) {
        var _this = this;

        if (Array.isArray(this.urlRegex)) {
          return this.urlRegex.some(function (regex) {
            return regex.test(_this.cleanUrl(url));
          });
        }

        return this.urlRegex.test(this.cleanUrl(url));
      }
      /**
       * Extract ID from a release URL.
       */

    }, {
      key: "extractId",
      value: function extractId(url) {
        var _this2 = this;

        if (!Array.isArray(this.urlRegex)) {
          var _this$cleanUrl$match;

          return (_this$cleanUrl$match = this.cleanUrl(url).match(this.urlRegex)) === null || _this$cleanUrl$match === void 0 ? void 0 : _this$cleanUrl$match[1];
        }

        return this.urlRegex.map(function (regex) {
          var _this2$cleanUrl$match;

          return (_this2$cleanUrl$match = _this2.cleanUrl(url).match(regex)) === null || _this2$cleanUrl$match === void 0 ? void 0 : _this2$cleanUrl$match[1];
        }).find(function (id) {
          return typeof id !== 'undefined';
        });
      }
      /**
       * Check whether a redirect is safe, i.e. both URLs point towards the same
       * release.
       */

    }, {
      key: "isSafeRedirect",
      value: function isSafeRedirect(originalUrl, redirectedUrl) {
        var id = this.extractId(originalUrl);
        return !!id && id === this.extractId(redirectedUrl);
      }
    }, {
      key: "fetchPage",
      value: function () {
        var _fetchPage = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(url) {
          var resp;
          return regenerator.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return gmxhr(url);

                case 2:
                  resp = _context.sent;

                  if (!(resp.finalUrl !== url.href && !this.isSafeRedirect(url, new URL(resp.finalUrl)))) {
                    _context.next = 5;
                    break;
                  }

                  throw new Error("Refusing to extract images from ".concat(this.name, " provider because the original URL redirected to ").concat(resp.finalUrl, ", which may be a different release. If this redirected URL is correct, please retry with ").concat(resp.finalUrl, " directly."));

                case 5:
                  return _context.abrupt("return", resp.responseText);

                case 6:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function fetchPage(_x) {
          return _fetchPage.apply(this, arguments);
        }

        return fetchPage;
      }()
    }]);

    return CoverArtProvider;
  }();
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

  var HeadMetaPropertyProvider = /*#__PURE__*/function (_CoverArtProvider) {
    _inherits(HeadMetaPropertyProvider, _CoverArtProvider);

    var _super = _createSuper(HeadMetaPropertyProvider);

    function HeadMetaPropertyProvider() {
      _classCallCheck(this, HeadMetaPropertyProvider);

      return _super.apply(this, arguments);
    }

    _createClass(HeadMetaPropertyProvider, [{
      key: "is404Page",
      value: // Providers for which the cover art can be retrieved from the head
      // og:image property and maximised using maxurl

      /**
       * Template method to be used by subclasses to check whether the document
       * indicates a missing release. This only needs to be implemented if the
       * provider returns success codes for releases which are 404.
       */
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      function is404Page(_document) {
        return false;
      }
    }, {
      key: "findImages",
      value: function () {
        var _findImages = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(url) {
          var respDocument, coverElmt;
          return regenerator.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.t0 = parseDOM;
                  _context2.next = 3;
                  return this.fetchPage(url);

                case 3:
                  _context2.t1 = _context2.sent;
                  _context2.t2 = url.href;
                  respDocument = (0, _context2.t0)(_context2.t1, _context2.t2);

                  if (!this.is404Page(respDocument)) {
                    _context2.next = 8;
                    break;
                  }

                  throw new Error(this.name + ' release does not exist');

                case 8:
                  coverElmt = qs('head > meta[property="og:image"]', respDocument);
                  return _context2.abrupt("return", [{
                    url: new URL(coverElmt.content),
                    types: [ArtworkTypeIDs.Front]
                  }]);

                case 10:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        }));

        function findImages(_x2) {
          return _findImages.apply(this, arguments);
        }

        return findImages;
      }()
    }]);

    return HeadMetaPropertyProvider;
  }(CoverArtProvider);

  var _groupIdenticalImages = /*#__PURE__*/new WeakSet();

  var _urlToDigest = /*#__PURE__*/new WeakSet();

  var _createTrackImageComment = /*#__PURE__*/new WeakSet();

  var ProviderWithTrackImages = /*#__PURE__*/function (_CoverArtProvider2) {
    _inherits(ProviderWithTrackImages, _CoverArtProvider2);

    var _super2 = _createSuper(ProviderWithTrackImages);

    function ProviderWithTrackImages() {
      var _this3;

      _classCallCheck(this, ProviderWithTrackImages);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this3 = _super2.call.apply(_super2, [this].concat(args));

      _classPrivateMethodInitSpec(_assertThisInitialized(_this3), _createTrackImageComment);

      _classPrivateMethodInitSpec(_assertThisInitialized(_this3), _urlToDigest);

      _classPrivateMethodInitSpec(_assertThisInitialized(_this3), _groupIdenticalImages);

      return _this3;
    }

    _createClass(ProviderWithTrackImages, [{
      key: "imageToThumbnailUrl",
      value: function imageToThumbnailUrl(imageUrl) {
        // To be overridden by subclass if necessary.
        return imageUrl;
      }
    }, {
      key: "mergeTrackImages",
      value: function () {
        var _mergeTrackImages = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee4(trackImages, mainUrl, byContent) {
          var _this4 = this;

          var allTrackImages, groupedImages, mainDigest, tracksWithDigest, groupedThumbnails, _iterator, _step, _trackImages, representativeUrl, results;

          return regenerator.wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  allTrackImages = filterNonNull(trackImages); // First pass: URL only

                  groupedImages = _classPrivateMethodGet(this, _groupIdenticalImages, _groupIdenticalImages2).call(this, allTrackImages, function (img) {
                    return img.url;
                  }, mainUrl); // Second pass: Thumbnail content
                  // We do not need to deduplicate by content if there's only one track
                  // image and there's no main URL to compare to.

                  if (!(byContent && groupedImages.size && !(groupedImages.size === 1 && !mainUrl))) {
                    _context4.next = 19;
                    break;
                  }

                  LOGGER.info('Deduplicating track images by content, this may take a while…'); // Compute unique digests of all thumbnail images. We'll use these
                  // digests in `#groupIdenticalImages` to group by thumbnail content.

                  if (!mainUrl) {
                    _context4.next = 10;
                    break;
                  }

                  _context4.next = 7;
                  return _classPrivateMethodGet(this, _urlToDigest, _urlToDigest2).call(this, mainUrl);

                case 7:
                  _context4.t0 = _context4.sent;
                  _context4.next = 11;
                  break;

                case 10:
                  _context4.t0 = '';

                case 11:
                  mainDigest = _context4.t0;
                  _context4.next = 14;
                  return Promise.all(_toConsumableArray(groupedImages.entries()).map( /*#__PURE__*/function () {
                    var _ref2 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee3(_ref) {
                      var _ref3, coverUrl, trackImages, digest;

                      return regenerator.wrap(function _callee3$(_context3) {
                        while (1) {
                          switch (_context3.prev = _context3.next) {
                            case 0:
                              _ref3 = _slicedToArray(_ref, 2), coverUrl = _ref3[0], trackImages = _ref3[1];
                              _context3.next = 3;
                              return _classPrivateMethodGet(_this4, _urlToDigest, _urlToDigest2).call(_this4, coverUrl);

                            case 3:
                              digest = _context3.sent;
                              return _context3.abrupt("return", trackImages.map(function (trackImage) {
                                return _objectSpread2(_objectSpread2({}, trackImage), {}, {
                                  digest: digest
                                });
                              }));

                            case 5:
                            case "end":
                              return _context3.stop();
                          }
                        }
                      }, _callee3);
                    }));

                    return function (_x6) {
                      return _ref2.apply(this, arguments);
                    };
                  }()));

                case 14:
                  tracksWithDigest = _context4.sent;
                  groupedThumbnails = _classPrivateMethodGet(this, _groupIdenticalImages, _groupIdenticalImages2).call(this, tracksWithDigest.flat(), function (trackWithDigest) {
                    return trackWithDigest.digest;
                  }, mainDigest); // The previous `groupedImages` map groups images by URL. Overwrite
                  // this to group images by thumbnail content. Keys will remain URLs,
                  // we'll use the URL of the first image in the group. It doesn't
                  // really matter which URL we use, as we've already asserted that
                  // the images behind all these URLs in the group are identical.

                  groupedImages.clear();
                  _iterator = _createForOfIteratorHelper(groupedThumbnails.values());

                  try {
                    for (_iterator.s(); !(_step = _iterator.n()).done;) {
                      _trackImages = _step.value;
                      representativeUrl = _trackImages[0].url;
                      groupedImages.set(representativeUrl, _trackImages);
                    }
                  } catch (err) {
                    _iterator.e(err);
                  } finally {
                    _iterator.f();
                  }

                case 19:
                  // Queue one item for each group of track images. We'll create a comment
                  // to indicate which tracks this image belongs to.
                  results = [];
                  groupedImages.forEach(function (trackImages, imgUrl) {
                    results.push({
                      url: new URL(imgUrl),
                      types: [ArtworkTypeIDs.Track],
                      comment: _classPrivateMethodGet(_this4, _createTrackImageComment, _createTrackImageComment2).call(_this4, trackImages.map(function (trackImage) {
                        return trackImage.trackNumber;
                      })) || undefined
                    });
                  });
                  return _context4.abrupt("return", results);

                case 22:
                case "end":
                  return _context4.stop();
              }
            }
          }, _callee4, this);
        }));

        function mergeTrackImages(_x3, _x4, _x5) {
          return _mergeTrackImages.apply(this, arguments);
        }

        return mergeTrackImages;
      }()
    }]);

    return ProviderWithTrackImages;
  }(CoverArtProvider);

  function _groupIdenticalImages2(images, getImageUniqueId, mainUniqueId) {
    var uniqueImages = images.filter(function (img) {
      return getImageUniqueId(img) !== mainUniqueId;
    });
    return groupBy(uniqueImages, getImageUniqueId, function (img) {
      return img;
    });
  }

  function _urlToDigest2(_x7) {
    return _urlToDigest3.apply(this, arguments);
  }

  function _urlToDigest3() {
    _urlToDigest3 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee5(imageUrl) {
      var resp;
      return regenerator.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return gmxhr(this.imageToThumbnailUrl(imageUrl), {
                responseType: 'blob'
              });

            case 2:
              resp = _context5.sent;
              return _context5.abrupt("return", blobToDigest(resp.response));

            case 4:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, this);
    }));
    return _urlToDigest3.apply(this, arguments);
  }

  function _createTrackImageComment2(trackNumbers) {
    var definedTrackNumbers = filterNonNull(trackNumbers);
    if (!definedTrackNumbers.length) return '';
    var prefix = definedTrackNumbers.length === 1 ? 'Track' : 'Tracks';
    return "".concat(prefix, " ").concat(definedTrackNumbers.sort().join(', '));
  }

  function mapJacketType(caption) {
    if (!caption) {
      return {
        type: [ArtworkTypeIDs.Front, ArtworkTypeIDs.Back, ArtworkTypeIDs.Spine],
        comment: ''
      };
    }

    var types = [];
    var keywords = caption.split(/(?:,|\s|and|&)/i);
    var faceKeywords = ['front', 'back', 'spine'];

    var _faceKeywords$map = faceKeywords.map(function (faceKw) {
      return !!keywords // Case-insensitive .includes()
      .find(function (kw) {
        return kw.toLowerCase() === faceKw.toLowerCase();
      });
    }),
        _faceKeywords$map2 = _slicedToArray(_faceKeywords$map, 3),
        hasFront = _faceKeywords$map2[0],
        hasBack = _faceKeywords$map2[1],
        hasSpine = _faceKeywords$map2[2];

    if (hasFront) types.push(ArtworkTypeIDs.Front);
    if (hasBack) types.push(ArtworkTypeIDs.Back); // Assuming if the front and back are included, the spine is as well.

    if (hasSpine || hasFront && hasBack) types.push(ArtworkTypeIDs.Spine); // Copy anything other than 'front', 'back', or 'spine' to the comment

    var otherKeywords = keywords.filter(function (kw) {
      return !faceKeywords.includes(kw.toLowerCase());
    });
    var comment = otherKeywords.join(' ').trim();
    return {
      type: types,
      comment: comment
    };
  } // Keys: First word of the VGMdb caption (mostly structured), lower-cased
  // Values: Either MappedArtwork or a callable taking the remainder of the caption and returning MappedArtwork


  var __CAPTION_TYPE_MAPPING = {
    front: ArtworkTypeIDs.Front,
    booklet: ArtworkTypeIDs.Booklet,
    jacket: mapJacketType,
    // DVD jacket
    disc: ArtworkTypeIDs.Medium,
    cassette: ArtworkTypeIDs.Medium,
    vinyl: ArtworkTypeIDs.Medium,
    tray: ArtworkTypeIDs.Tray,
    back: ArtworkTypeIDs.Back,
    obi: ArtworkTypeIDs.Obi,
    box: {
      type: ArtworkTypeIDs.Other,
      comment: 'Box'
    },
    card: {
      type: ArtworkTypeIDs.Other,
      comment: 'Card'
    },
    sticker: ArtworkTypeIDs.Sticker,
    slipcase: {
      type: ArtworkTypeIDs.Other,
      comment: 'Slipcase'
    },
    digipack: {
      type: ArtworkTypeIDs.Other,
      comment: 'Digipack'
    },
    insert: {
      type: ArtworkTypeIDs.Other,
      comment: 'Insert'
    },
    // Or poster?
    case: {
      type: ArtworkTypeIDs.Other,
      comment: 'Case'
    },
    contents: ArtworkTypeIDs.Raw
  };

  function convertMappingReturnValue(ret) {
    if (Object.prototype.hasOwnProperty.call(ret, 'type') && Object.prototype.hasOwnProperty.call(ret, 'comment')) {
      var retObj = ret;
      return {
        types: Array.isArray(retObj.type) ? retObj.type : [retObj.type],
        comment: retObj.comment
      };
    }

    var types = ret;
    /* istanbul ignore next: No mapper generates this currently */

    if (!Array.isArray(types)) {
      types = [types];
    }

    return {
      types: types,
      comment: ''
    };
  }

  var CAPTION_TYPE_MAPPING = {}; // Convert all definitions to a single signature for easier processing later on

  var _loop = function _loop() {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
        key = _Object$entries$_i[0],
        value = _Object$entries$_i[1];

    // Since value is a block-scoped const, the lambda will close over that
    // exact value. It wouldn't if it was a var, as `value` would in the end
    // only refer to the last value. Babel transpiles this correctly, so this
    // is safe.
    CAPTION_TYPE_MAPPING[key] = function (caption) {
      if (typeof value === 'function') {
        // Assume the function sets everything correctly, including the
        // comment
        return convertMappingReturnValue(value(caption));
      }

      var retObj = convertMappingReturnValue(value); // Add remainder of the caption to the comment returned by the mapping

      if (retObj.comment && caption) retObj.comment += ' ' + caption; // If there's a caption but no comment, set the comment to the caption
      else if (caption) retObj.comment = caption; // Otherwise there's a comment set by the mapper but no caption => keep,
      // or neither a comment nor a caption => nothing needs to be done.

      return retObj;
    };
  };

  for (var _i = 0, _Object$entries = Object.entries(__CAPTION_TYPE_MAPPING); _i < _Object$entries.length; _i++) {
    _loop();
  }

  function convertCaptions(cover) {
    var url = new URL(cover.url);

    if (!cover.caption) {
      return {
        url: url
      };
    }

    var _cover$caption$split = cover.caption.split(' '),
        _cover$caption$split2 = _toArray(_cover$caption$split),
        captionType = _cover$caption$split2[0],
        captionRestParts = _cover$caption$split2.slice(1);

    var captionRest = captionRestParts.join(' ');
    var mapper = CAPTION_TYPE_MAPPING[captionType.toLowerCase()];
    if (!mapper) return {
      url: url,
      comment: cover.caption
    };
    return _objectSpread2({
      url: url
    }, mapper(captionRest));
  }
  var VGMdbProvider = /*#__PURE__*/function (_CoverArtProvider) {
    _inherits(VGMdbProvider, _CoverArtProvider);

    var _super = _createSuper(VGMdbProvider);

    function VGMdbProvider() {
      var _this;

      _classCallCheck(this, VGMdbProvider);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));

      _defineProperty(_assertThisInitialized(_this), "supportedDomains", ['vgmdb.net']);

      _defineProperty(_assertThisInitialized(_this), "favicon", 'https://vgmdb.net/favicon.ico');

      _defineProperty(_assertThisInitialized(_this), "name", 'VGMdb');

      _defineProperty(_assertThisInitialized(_this), "urlRegex", /\/album\/(\d+)(?:\/|$)/);

      return _this;
    }

    _createClass(VGMdbProvider, [{
      key: "findImages",
      value: function () {
        var _findImages = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(url) {
          var _qsMaybe, _qsMaybe$style$backgr;

          var pageSrc, pageDom, coverGallery, galleryCovers, mainCoverUrl;
          return regenerator.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return this.fetchPage(url);

                case 2:
                  pageSrc = _context.sent;

                  if (!pageSrc.includes('/db/img/banner-error.gif')) {
                    _context.next = 5;
                    break;
                  }

                  throw new Error('VGMdb returned an error');

                case 5:
                  pageDom = parseDOM(pageSrc, url.href); // istanbul ignore else: Tests are not logged in

                  if (qsMaybe('#navmember', pageDom) === null) {
                    LOGGER.warn('Heads up! VGMdb requires you to be logged in to view all images. Some images may have been missed. If you have an account, please log in to VGMdb to fetch all images.');
                  }

                  coverGallery = qsMaybe('#cover_gallery', pageDom);

                  if (!coverGallery) {
                    _context.next = 14;
                    break;
                  }

                  _context.next = 11;
                  return VGMdbProvider.extractCoversFromDOMGallery(coverGallery);

                case 11:
                  _context.t0 = _context.sent;
                  _context.next = 15;
                  break;

                case 14:
                  _context.t0 = [];

                case 15:
                  galleryCovers = _context.t0;
                  // Add the main cover if it's not in the gallery
                  mainCoverUrl = (_qsMaybe = qsMaybe('#coverart', pageDom)) === null || _qsMaybe === void 0 ? void 0 : (_qsMaybe$style$backgr = _qsMaybe.style.backgroundImage.match(/url\(["']?(.+?)["']?\)/)) === null || _qsMaybe$style$backgr === void 0 ? void 0 : _qsMaybe$style$backgr[1];

                  if (mainCoverUrl && !galleryCovers.some(function (cover) {
                    return cover.url.pathname.endsWith(mainCoverUrl.split('/').at(-1));
                  })) {
                    galleryCovers.unshift({
                      url: new URL(mainCoverUrl),
                      types: [ArtworkTypeIDs.Front],
                      comment: ''
                    });
                  }

                  return _context.abrupt("return", galleryCovers);

                case 19:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function findImages(_x) {
          return _findImages.apply(this, arguments);
        }

        return findImages;
      }()
    }, {
      key: "findImagesWithApi",
      value: function () {
        var _findImagesWithApi = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(url) {
          var id, apiUrl, apiResp, metadata;
          return regenerator.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  // Using the unofficial API at vgmdb.info
                  id = this.extractId(url);
                  assertHasValue(id);
                  apiUrl = "https://vgmdb.info/album/".concat(id, "?format=json");
                  _context2.next = 5;
                  return gmxhr(apiUrl);

                case 5:
                  apiResp = _context2.sent;
                  metadata = safeParseJSON(apiResp.responseText, 'Invalid JSON response from vgmdb.info API');
                  assert(metadata.link === 'album/' + id, "VGMdb.info returned wrong release: Requested album/".concat(id, ", got ").concat(metadata.link));
                  return _context2.abrupt("return", _classStaticPrivateMethodGet(VGMdbProvider, VGMdbProvider, _extractImagesFromApiMetadata).call(VGMdbProvider, metadata));

                case 9:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        }));

        function findImagesWithApi(_x2) {
          return _findImagesWithApi.apply(this, arguments);
        }

        return findImagesWithApi;
      }()
    }], [{
      key: "extractCoversFromDOMGallery",
      value: function () {
        var _extractCoversFromDOMGallery = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee3(coverGallery) {
          var coverElements;
          return regenerator.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  coverElements = qsa('a[id*="thumb_"]', coverGallery);
                  return _context3.abrupt("return", coverElements.map(this.extractCoverFromAnchor.bind(this)));

                case 2:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3, this);
        }));

        function extractCoversFromDOMGallery(_x3) {
          return _extractCoversFromDOMGallery.apply(this, arguments);
        }

        return extractCoversFromDOMGallery;
      }()
    }, {
      key: "extractCoverFromAnchor",
      value: function extractCoverFromAnchor(anchor) {
        var _qs$textContent;

        return convertCaptions({
          url: anchor.href,
          caption: (_qs$textContent = qs('.label', anchor).textContent) !== null && _qs$textContent !== void 0 ? _qs$textContent :
          /* istanbul ignore next */
          ''
        });
      }
    }]);

    return VGMdbProvider;
  }(CoverArtProvider);

  function _extractImagesFromApiMetadata(metadata) {
    var covers = metadata.covers.map(function (cover) {
      return {
        url: cover.full,
        caption: cover.name
      };
    });

    if (metadata.picture_full && !covers.find(function (cover) {
      return cover.url === metadata.picture_full;
    })) {
      // Assuming the main picture is the front cover
      covers.unshift({
        url: metadata.picture_full,
        caption: 'Front'
      });
    }

    return covers.map(convertCaptions);
  }

  var VGMdbSeeder = {
      supportedDomains: ['vgmdb.net'],
      supportedRegexes: [/\/album\/(\d+)(?:\/|#|\?|$)/],
      insertSeedLinks: function insertSeedLinks() {
          var _qsMaybe;
          if (!isLoggedIn()) {
              return;
          }
          var coverHeading = (_qsMaybe = qsMaybe('#covernav')) === null || _qsMaybe === void 0 ? void 0 : _qsMaybe.parentElement;
          if (!coverHeading) {
              LOGGER.info('No covers in release, not inserting seeding menu');
              return;
          }
          var releaseIdsProm = getMBReleases();
          var coversProm = extractCovers();
          Promise.all([
              releaseIdsProm,
              coversProm
          ]).then(function (_ref) {
              var _ref2 = _slicedToArray(_ref, 2), releaseIds = _ref2[0], covers = _ref2[1];
              insertSeedButtons(coverHeading, releaseIds, covers);
          });
      }
  };
  function isLoggedIn() {
      return qsMaybe('#navmember') !== null;
  }
  function getMBReleases() {
      var releaseUrl = 'https://vgmdb.net' + document.location.pathname;
      return getReleaseIDsForURL(releaseUrl);
  }
  function extractCovers() {
      return _extractCovers.apply(this, arguments);
  }
  function _extractCovers() {
      _extractCovers = _asyncToGenerator(regenerator.mark(function _callee() {
          var covers, publicCoverURLs, result;
          return regenerator.wrap(function _callee$(_context) {
              while (1) {
                  switch (_context.prev = _context.next) {
                  case 0:
                      _context.next = 2;
                      return VGMdbProvider.extractCoversFromDOMGallery(qs('#cover_gallery'));
                  case 2:
                      covers = _context.sent;
                      _context.t0 = Set;
                      _context.next = 6;
                      return new VGMdbProvider().findImagesWithApi(new URL(document.location.href));
                  case 6:
                      _context.t1 = _context.sent.map(function (cover) {
                          return cover.url.href;
                      });
                      publicCoverURLs = new _context.t0(_context.t1);
                      result = {
                          allCovers: covers,
                          privateCovers: covers.filter(function (cover) {
                              return !publicCoverURLs.has(cover.url.href);
                          })
                      };
                      return _context.abrupt('return', result);
                  case 10:
                  case 'end':
                      return _context.stop();
                  }
              }
          }, _callee);
      }));
      return _extractCovers.apply(this, arguments);
  }
  function insertSeedButtons(coverHeading, releaseIds, covers) {
      var _coverHeading$nextEle;
      var seedParamsPrivate = new SeedParameters(covers.privateCovers, document.location.href);
      var seedParamsAll = new SeedParameters(covers.allCovers, document.location.href);
      var relIdToAnchors = new Map(releaseIds.map(function (relId) {
          var a = function () {
              var $$a = document.createElement('a');
              $$a.setAttribute('href', seedParamsPrivate.createSeedURL(relId));
              $$a.setAttribute('target', '_blank');
              $$a.setAttribute('rel', 'noopener noreferrer');
              setStyles($$a, { display: 'block' });
              appendChildren($$a, 'Seed covers to ' + relId.split('-')[0]);
              return $$a;
          }.call(this);
          return [
              relId,
              a
          ];
      }));
      var anchors = _toConsumableArray(relIdToAnchors.values());
      var inclPublicCheckbox = function () {
          var $$c = document.createElement('input');
          $$c.setAttribute('type', 'checkbox');
          $$c.setAttribute('id', 'ROpdebee_incl_public_checkbox');
          $$c.addEventListener('change', function (evt) {
              relIdToAnchors.forEach(function (a, relId) {
                  if (evt.currentTarget.checked) {
                      a.href = seedParamsAll.createSeedURL(relId);
                  } else {
                      a.href = seedParamsPrivate.createSeedURL(relId);
                  }
              });
          });
          return $$c;
      }.call(this);
      var inclPublicLabel = function () {
          var $$d = document.createElement('label');
          $$d.setAttribute('for', 'ROpdebee_incl_public_checkbox');
          $$d.setAttribute('title', 'Leave this unchecked to only seed covers which cannot be extracted by the VGMdb provider');
          setStyles($$d, { cursor: 'help' });
          var $$e = document.createTextNode('Include publicly accessible covers');
          $$d.appendChild($$e);
          return $$d;
      }.call(this);
      var containedElements = [
          inclPublicCheckbox,
          inclPublicLabel
      ].concat(anchors);
      if (!anchors.length) {
          containedElements.push(function () {
              var $$f = document.createElement('span');
              setStyles($$f, { display: 'block' });
              var $$g = document.createTextNode('\n            This album is not linked to any MusicBrainz releases!\n        ');
              $$f.appendChild($$g);
              return $$f;
          }.call(this));
      }
      var container = function () {
          var $$h = document.createElement('div');
          setStyles($$h, {
              padding: '8px 8px 0px 8px',
              fontSize: '8pt'
          });
          appendChildren($$h, containedElements);
          return $$h;
      }.call(this);
      (_coverHeading$nextEle = coverHeading.nextElementSibling) === null || _coverHeading$nextEle === void 0 ? void 0 : _coverHeading$nextEle.insertAdjacentElement('afterbegin', container);
  }

  /* istanbul ignore file: Imports TSX, covered by E2E */
  registerSeeder(AtisketSeeder);
  registerSeeder(AtasketSeeder);
  registerSeeder(VGMdbSeeder);

  // we can also grab it from the <head> element metadata, which is a lot less
  // effort, and we get the added benefit of redirect safety.

  var SevenDigitalProvider = /*#__PURE__*/function (_HeadMetaPropertyProv) {
    _inherits(SevenDigitalProvider, _HeadMetaPropertyProv);

    var _super = _createSuper(SevenDigitalProvider);

    function SevenDigitalProvider() {
      var _this;

      _classCallCheck(this, SevenDigitalProvider);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));

      _defineProperty(_assertThisInitialized(_this), "supportedDomains", ['*.7digital.com']);

      _defineProperty(_assertThisInitialized(_this), "favicon", 'https://css-cdn.7digital.com/static/build/images/favicons/7digital/touch-ipad-retina.png');

      _defineProperty(_assertThisInitialized(_this), "name", '7digital');

      _defineProperty(_assertThisInitialized(_this), "urlRegex", /release\/.*-(\d+)(?:\/|$)/);

      return _this;
    }

    _createClass(SevenDigitalProvider, [{
      key: "postprocessImages",
      value: function postprocessImages(images) {
        return images // Filter out images that either are, or were redirected to the cover
        // with ID 0000000016. This is a placeholder image.
        .filter(function (image) {
          if (/\/0000000016_\d+/.test(image.fetchedUrl.pathname)) {
            LOGGER.warn('Ignoring placeholder cover in 7digital release');
            return false;
          }

          return true;
        });
      }
    }]);

    return SevenDigitalProvider;
  }(HeadMetaPropertyProvider);

  var AllMusicProvider = /*#__PURE__*/function (_CoverArtProvider) {
    _inherits(AllMusicProvider, _CoverArtProvider);

    var _super = _createSuper(AllMusicProvider);

    function AllMusicProvider() {
      var _this;

      _classCallCheck(this, AllMusicProvider);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));

      _defineProperty(_assertThisInitialized(_this), "supportedDomains", ['allmusic.com']);

      _defineProperty(_assertThisInitialized(_this), "favicon", 'https://cdn-gce.allmusic.com/images/favicon/favicon-32x32.png');

      _defineProperty(_assertThisInitialized(_this), "name", 'AllMusic');

      _defineProperty(_assertThisInitialized(_this), "urlRegex", /album\/release\/.*(mr\d+)(?:\/|$)/);

      return _this;
    }

    _createClass(AllMusicProvider, [{
      key: "findImages",
      value: function () {
        var _findImages = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(url) {
          var _page$match;

          var page, galleryJson, gallery;
          return regenerator.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return this.fetchPage(url);

                case 2:
                  page = _context.sent;
                  // Extracting from embedded JS which contains a JSON array of all images
                  galleryJson = (_page$match = page.match(/var imageGallery = (.+);$/m)) === null || _page$match === void 0 ? void 0 : _page$match[1]; // istanbul ignore if: Difficult to cover

                  if (galleryJson) {
                    _context.next = 6;
                    break;
                  }

                  throw new Error('Failed to extract AllMusic images from embedded JS');

                case 6:
                  gallery = safeParseJSON(galleryJson); // istanbul ignore if: Difficult to cover

                  if (gallery) {
                    _context.next = 9;
                    break;
                  }

                  throw new Error('Failed to parse AllMusic JSON gallery data');

                case 9:
                  return _context.abrupt("return", gallery.map(function (image) {
                    return {
                      // Maximise to original format here already, generates less
                      // edit note spam.
                      url: new URL(image.url.replace(/&f=\d+$/, '&f=0'))
                    };
                  }));

                case 10:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function findImages(_x) {
          return _findImages.apply(this, arguments);
        }

        return findImages;
      }()
    }]);

    return AllMusicProvider;
  }(CoverArtProvider);

  var PLACEHOLDER_IMG_REGEX = /01RmK(?:\+|%2B)J4pJL/; // Incomplete, only what we need

  var VARIANT_TYPE_MAPPING = {
    MAIN: ArtworkTypeIDs.Front,
    FRNT: ArtworkTypeIDs.Front,
    // not seen in use so far, usually MAIN is used for front covers
    BACK: ArtworkTypeIDs.Back,
    SIDE: ArtworkTypeIDs.Spine // not seen in use so far
    // PT01: ArtworkTypeIDs.Other,
    // See https://sellercentral.amazon.com/gp/help/external/JV4FNMT7563SF5F for further details

  };

  var _extractFrontCover = /*#__PURE__*/new WeakSet();

  var _convertVariant = /*#__PURE__*/new WeakSet();

  var AmazonProvider = /*#__PURE__*/function (_CoverArtProvider) {
    _inherits(AmazonProvider, _CoverArtProvider);

    var _super = _createSuper(AmazonProvider);

    function AmazonProvider() {
      var _this;

      _classCallCheck(this, AmazonProvider);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));

      _classPrivateMethodInitSpec(_assertThisInitialized(_this), _convertVariant);

      _classPrivateMethodInitSpec(_assertThisInitialized(_this), _extractFrontCover);

      _defineProperty(_assertThisInitialized(_this), "supportedDomains", ['amazon.ae', 'amazon.ca', 'amazon.cn', 'amazon.de', 'amazon.eg', 'amazon.es', 'amazon.fr', 'amazon.in', 'amazon.it', 'amazon.jp', 'amazon.nl', 'amazon.pl', 'amazon.sa', 'amazon.se', 'amazon.sg', 'amazon.co.jp', 'amazon.co.uk', 'amazon.com', 'amazon.com.au', 'amazon.com.br', 'amazon.com.mx', 'amazon.com.tr']);

      _defineProperty(_assertThisInitialized(_this), "name", 'Amazon');

      _defineProperty(_assertThisInitialized(_this), "urlRegex", /\/(?:gp\/product|dp)\/([A-Za-z0-9]{10})(?:\/|$)/);

      return _this;
    }

    _createClass(AmazonProvider, [{
      key: "favicon",
      get: // Favicon URL is blocked by Firefox' Enhanced Tracking Protection
      function get() {
        return GMgetResourceUrl('amazonFavicon');
      }
    }, {
      key: "findImages",
      value: function () {
        var _findImages = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(url) {
          var pageContent, pageDom, frontCover, covers, _this$extractFromEmbe;

          return regenerator.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return this.fetchPage(url);

                case 2:
                  pageContent = _context.sent;
                  pageDom = parseDOM(pageContent, url.href); // Look for products which only have a single image, the front cover.

                  frontCover = _classPrivateMethodGet(this, _extractFrontCover, _extractFrontCover2).call(this, pageDom);

                  if (!frontCover) {
                    _context.next = 7;
                    break;
                  }

                  return _context.abrupt("return", [frontCover]);

                case 7:
                  // For physical products we have to extract the embedded JS from the
                  // page source to get all images in their highest available resolution.
                  covers = this.extractFromEmbeddedJS(pageContent);

                  if (!covers) {
                    // Use the (smaller) image thumbnails in the sidebar as a fallback,
                    // although it might not contain all of them. IMU will maximise,
                    // but the results are still inferior to the embedded hires images.
                    covers = this.extractFromThumbnailSidebar(pageDom);
                  }

                  if (!covers.length) {
                    // Handle physical audiobooks, the above extractors fail for those.
                    LOGGER.warn('Found no release images, trying to find an Amazon (audio)book gallery…');
                    covers = (_this$extractFromEmbe = this.extractFromEmbeddedJSGallery(pageContent)) !== null && _this$extractFromEmbe !== void 0 ? _this$extractFromEmbe :
                    /* istanbul ignore next: Should never happen */
                    [];
                  } // Filter out placeholder images.


                  return _context.abrupt("return", covers.filter(function (img) {
                    return !PLACEHOLDER_IMG_REGEX.test(img.url.href);
                  }));

                case 11:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function findImages(_x) {
          return _findImages.apply(this, arguments);
        }

        return findImages;
      }()
    }, {
      key: "extractFromEmbeddedJS",
      value: function extractFromEmbeddedJS(pageContent) {
        var _pageContent$match,
            _this2 = this;

        var embeddedImages = (_pageContent$match = pageContent.match(/^'colorImages': { 'initial': (.+)},$/m)) === null || _pageContent$match === void 0 ? void 0 : _pageContent$match[1];

        if (!embeddedImages) {
          LOGGER.warn('Failed to extract Amazon images from the embedded JS, falling back to thumbnails');
          return;
        }

        var imgs = safeParseJSON(embeddedImages);

        if (!Array.isArray(imgs)) {
          LOGGER.error("Failed to parse Amazon's embedded JS, falling back to thumbnails");
          return;
        }

        return imgs.map(function (img) {
          var _img$hiRes;

          // `img.hiRes` is probably only `null` when `img.large` is the placeholder image?
          return _classPrivateMethodGet(_this2, _convertVariant, _convertVariant2).call(_this2, {
            url: (_img$hiRes = img.hiRes) !== null && _img$hiRes !== void 0 ? _img$hiRes : img.large,
            variant: img.variant
          });
        });
      }
    }, {
      key: "extractFromEmbeddedJSGallery",
      value: function extractFromEmbeddedJSGallery(pageContent) {
        var _pageContent$match2;

        var embeddedGallery = (_pageContent$match2 = pageContent.match(/^'imageGalleryData' : (.+),$/m)) === null || _pageContent$match2 === void 0 ? void 0 : _pageContent$match2[1];

        if (!embeddedGallery) {
          LOGGER.warn('Failed to extract Amazon images from the embedded JS (audio)book gallery');
          return;
        }

        var imgs = safeParseJSON(embeddedGallery);

        if (!Array.isArray(imgs)) {
          LOGGER.error("Failed to parse Amazon's embedded JS (audio)book gallery");
          return;
        } // Amazon embeds no image variants on these pages, so we don't know the types


        return imgs.map(function (img) {
          return {
            url: new URL(img.mainUrl)
          };
        });
      }
    }, {
      key: "extractFromThumbnailSidebar",
      value: function extractFromThumbnailSidebar(pageDom) {
        var _this3 = this;

        var imgs = qsa('#altImages img', pageDom);
        return imgs.map(function (img) {
          var _img$closest, _safeParseJSON;

          var dataThumbAction = (_img$closest = img.closest('span[data-thumb-action]')) === null || _img$closest === void 0 ? void 0 : _img$closest.getAttribute('data-thumb-action');
          var variant = dataThumbAction && ((_safeParseJSON = safeParseJSON(dataThumbAction)) === null || _safeParseJSON === void 0 ? void 0 : _safeParseJSON.variant);
          /* istanbul ignore if: Difficult to exercise */

          if (!variant) {
            LOGGER.warn('Failed to extract the Amazon image variant code from the JSON attribute');
          }

          return _classPrivateMethodGet(_this3, _convertVariant, _convertVariant2).call(_this3, {
            url: img.src,
            variant: variant
          });
        });
      }
    }]);

    return AmazonProvider;
  }(CoverArtProvider);

  function _extractFrontCover2(pageDom) {
    var frontCoverSelectors = ['#digitalMusicProductImage_feature_div > img', // Streaming/MP3 products
    'img#main-image' // Audible products
    ];

    for (var _i = 0, _frontCoverSelectors = frontCoverSelectors; _i < _frontCoverSelectors.length; _i++) {
      var selector = _frontCoverSelectors[_i];
      var productImage = qsMaybe(selector, pageDom);

      if (productImage) {
        // Only returning the thumbnail, IMU will maximise
        return {
          url: new URL(productImage.src),
          types: [ArtworkTypeIDs.Front]
        };
      }
    } // Different product type (or no image found)


    return;
  }

  function _convertVariant2(cover) {
    var url = new URL(cover.url);
    var type = cover.variant && VARIANT_TYPE_MAPPING[cover.variant];
    LOGGER.debug("".concat(url.href, " has the Amazon image variant code '").concat(cover.variant, "'"));

    if (type) {
      return {
        url: url,
        types: [type]
      };
    }

    return {
      url: url
    };
  }

  var AmazonMusicProvider = /*#__PURE__*/function (_CoverArtProvider) {
    _inherits(AmazonMusicProvider, _CoverArtProvider);

    var _super = _createSuper(AmazonMusicProvider);

    function AmazonMusicProvider() {
      var _this;

      _classCallCheck(this, AmazonMusicProvider);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));

      _defineProperty(_assertThisInitialized(_this), "supportedDomains", ['music.amazon.ca', 'music.amazon.de', 'music.amazon.es', 'music.amazon.fr', 'music.amazon.in', 'music.amazon.it', 'music.amazon.co.jp', 'music.amazon.co.uk', 'music.amazon.com', 'music.amazon.com.au', 'music.amazon.com.br', 'music.amazon.com.mx']);

      _defineProperty(_assertThisInitialized(_this), "favicon", 'https://d5fx445wy2wpk.cloudfront.net/icons/amznMusic_favicon.png');

      _defineProperty(_assertThisInitialized(_this), "name", 'Amazon Music');

      _defineProperty(_assertThisInitialized(_this), "urlRegex", /\/albums\/([A-Za-z0-9]{10})(?:\/|$)/);

      return _this;
    }

    _createClass(AmazonMusicProvider, [{
      key: "findImages",
      value: function () {
        var _findImages = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(url) {
          var asin, productUrl;
          return regenerator.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  // Translate Amazon Music to Amazon product links. The cover art should
                  // be the same, but extracting the cover art from Amazon Music requires
                  // complex API requests with CSRF tokens, whereas product pages are much
                  // easier. Besides, cover art on product pages tends to be larger.
                  // NOTE: I'm not 100% certain the images are always identical, or that
                  // the associated product always exists.
                  asin = this.extractId(url);
                  assertHasValue(asin);
                  productUrl = new URL(url.href);
                  productUrl.hostname = productUrl.hostname.replace(/^music\./, '');
                  productUrl.pathname = '/dp/' + asin;
                  return _context.abrupt("return", new AmazonProvider().findImages(productUrl));

                case 6:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function findImages(_x) {
          return _findImages.apply(this, arguments);
        }

        return findImages;
      }()
    }]);

    return AmazonMusicProvider;
  }(CoverArtProvider);

  var AppleMusicProvider = /*#__PURE__*/function (_HeadMetaPropertyProv) {
    _inherits(AppleMusicProvider, _HeadMetaPropertyProv);

    var _super = _createSuper(AppleMusicProvider);

    function AppleMusicProvider() {
      var _this;

      _classCallCheck(this, AppleMusicProvider);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));

      _defineProperty(_assertThisInitialized(_this), "supportedDomains", ['music.apple.com', 'itunes.apple.com']);

      _defineProperty(_assertThisInitialized(_this), "favicon", 'https://music.apple.com/favicon.ico');

      _defineProperty(_assertThisInitialized(_this), "name", 'Apple Music');

      _defineProperty(_assertThisInitialized(_this), "urlRegex", /\w{2}\/album\/(?:.+\/)?(?:id)?(\d+)/);

      return _this;
    }

    _createClass(AppleMusicProvider, [{
      key: "is404Page",
      value: function is404Page(doc) {
        return qsMaybe('head > title', doc) === null;
      }
    }]);

    return AppleMusicProvider;
  }(HeadMetaPropertyProvider);

  var _extractCover = /*#__PURE__*/new WeakSet();

  var _findTrackImages = /*#__PURE__*/new WeakSet();

  var _findTrackImage = /*#__PURE__*/new WeakSet();

  var _amendSquareThumbnails = /*#__PURE__*/new WeakSet();

  var BandcampProvider = /*#__PURE__*/function (_ProviderWithTrackIma) {
    _inherits(BandcampProvider, _ProviderWithTrackIma);

    var _super = _createSuper(BandcampProvider);

    function BandcampProvider() {
      var _this;

      _classCallCheck(this, BandcampProvider);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));

      _classPrivateMethodInitSpec(_assertThisInitialized(_this), _amendSquareThumbnails);

      _classPrivateMethodInitSpec(_assertThisInitialized(_this), _findTrackImage);

      _classPrivateMethodInitSpec(_assertThisInitialized(_this), _findTrackImages);

      _classPrivateMethodInitSpec(_assertThisInitialized(_this), _extractCover);

      _defineProperty(_assertThisInitialized(_this), "supportedDomains", ['*.bandcamp.com']);

      _defineProperty(_assertThisInitialized(_this), "favicon", 'https://s4.bcbits.com/img/favicon/favicon-32x32.png');

      _defineProperty(_assertThisInitialized(_this), "name", 'Bandcamp');

      _defineProperty(_assertThisInitialized(_this), "urlRegex", /^(.+)\.bandcamp\.com\/(track|album)\/([^/]+)(?:\/|$)/);

      return _this;
    }

    _createClass(BandcampProvider, [{
      key: "extractId",
      value: function extractId(url) {
        var _this$cleanUrl$match, _this$cleanUrl$match$;

        return (_this$cleanUrl$match = this.cleanUrl(url).match(this.urlRegex)) === null || _this$cleanUrl$match === void 0 ? void 0 : (_this$cleanUrl$match$ = _this$cleanUrl$match.slice(1)) === null || _this$cleanUrl$match$ === void 0 ? void 0 : _this$cleanUrl$match$.join('/');
      }
    }, {
      key: "findImages",
      value: function () {
        var _findImages = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(url) {
          var onlyFront,
              respDocument,
              albumCoverUrl,
              covers,
              trackImages,
              _args = arguments;
          return regenerator.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  onlyFront = _args.length > 1 && _args[1] !== undefined ? _args[1] : false;
                  _context.t0 = parseDOM;
                  _context.next = 4;
                  return this.fetchPage(url);

                case 4:
                  _context.t1 = _context.sent;
                  _context.t2 = url.href;
                  respDocument = (0, _context.t0)(_context.t1, _context.t2);
                  albumCoverUrl = _classPrivateMethodGet(this, _extractCover, _extractCover2).call(this, respDocument);
                  covers = [];

                  if (albumCoverUrl) {
                    covers.push({
                      url: new URL(albumCoverUrl),
                      types: [ArtworkTypeIDs.Front]
                    });
                  } else {
                    // Release has no images. May still have track covers though.
                    LOGGER.warn('Bandcamp release has no cover');
                  } // Don't bother extracting track images if we only need the front cover


                  if (!onlyFront) {
                    _context.next = 14;
                    break;
                  }

                  _context.t3 = [];
                  _context.next = 17;
                  break;

                case 14:
                  _context.next = 16;
                  return _classPrivateMethodGet(this, _findTrackImages, _findTrackImages2).call(this, respDocument, albumCoverUrl);

                case 16:
                  _context.t3 = _context.sent;

                case 17:
                  trackImages = _context.t3;
                  return _context.abrupt("return", _classPrivateMethodGet(this, _amendSquareThumbnails, _amendSquareThumbnails2).call(this, covers.concat(trackImages)));

                case 19:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function findImages(_x) {
          return _findImages.apply(this, arguments);
        }

        return findImages;
      }()
    }, {
      key: "imageToThumbnailUrl",
      value: function imageToThumbnailUrl(imageUrl) {
        // 150x150
        return imageUrl.replace(/_\d+\.(\w+)$/, '_7.$1');
      }
    }]);

    return BandcampProvider;
  }(ProviderWithTrackImages);

  function _extractCover2(doc) {
    if (qsMaybe('#missing-tralbum-art', doc) !== null) {
      // No images
      return;
    }

    return qs('#tralbumArt > .popupImage', doc).href;
  }

  function _findTrackImages2(_x2, _x3) {
    return _findTrackImages3.apply(this, arguments);
  }

  function _findTrackImages3() {
    _findTrackImages3 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(doc, mainUrl) {
      var _this2 = this;

      var trackRows, throttledFetchPage, trackImages, mergedTrackImages;
      return regenerator.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              // Unfortunately it doesn't seem like they can be extracted from the
              // album page itself, so we have to load each of the tracks separately.
              // Deliberately throttling these requests as to not flood Bandcamp and
              // potentially get banned.
              // It appears that they used to have an API which returned all track
              // images in one request, but that API has been locked down :(
              // https://michaelherger.github.io/Bandcamp-API/#/Albums/get_api_album_2_info
              trackRows = qsa('#track_table .track_row_view', doc);

              if (trackRows.length) {
                _context2.next = 3;
                break;
              }

              return _context2.abrupt("return", []);

            case 3:
              LOGGER.info('Checking for Bandcamp track images, this may take a few seconds…'); // Max 5 requests per second

              throttledFetchPage = pThrottle({
                interval: 1000,
                limit: 5
              })(this.fetchPage.bind(this)); // This isn't the most efficient, as it'll have to request all tracks
              // before it even returns the main album cover. Although fixable by
              // e.g. using an async generator, it might lead to issues with users
              // submitting the upload form before all track images are fetched...

              _context2.next = 7;
              return Promise.all(trackRows.map(function (trackRow) {
                return _classPrivateMethodGet(_this2, _findTrackImage, _findTrackImage2).call(_this2, trackRow, throttledFetchPage);
              }));

            case 7:
              trackImages = _context2.sent;
              _context2.next = 10;
              return this.mergeTrackImages(trackImages, mainUrl, true);

            case 10:
              mergedTrackImages = _context2.sent;

              if (mergedTrackImages.length) {
                LOGGER.info("Found ".concat(mergedTrackImages.length, " unique track images"));
              } else {
                LOGGER.info('Found no unique track images this time');
              }

              return _context2.abrupt("return", mergedTrackImages);

            case 13:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));
    return _findTrackImages3.apply(this, arguments);
  }

  function _findTrackImage2(_x4, _x5) {
    return _findTrackImage3.apply(this, arguments);
  }

  function _findTrackImage3() {
    _findTrackImage3 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee3(trackRow, fetchPage) {
      var _trackRow$getAttribut, _trackRow$getAttribut2, _qsMaybe;

      var trackNum, trackUrl, trackPage, imageUrl;
      return regenerator.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              // Account for alphabetical track numbers too
              trackNum = (_trackRow$getAttribut = trackRow.getAttribute('rel')) === null || _trackRow$getAttribut === void 0 ? void 0 : (_trackRow$getAttribut2 = _trackRow$getAttribut.match(/tracknum=(\w+)/)) === null || _trackRow$getAttribut2 === void 0 ? void 0 : _trackRow$getAttribut2[1];
              trackUrl = (_qsMaybe = qsMaybe('.title > a', trackRow)) === null || _qsMaybe === void 0 ? void 0 : _qsMaybe.href;
              /* istanbul ignore if: Cannot immediately find a release where a track is not linked */

              if (trackUrl) {
                _context3.next = 5;
                break;
              }

              LOGGER.warn("Could not check track ".concat(trackNum, " for track images"));
              return _context3.abrupt("return");

            case 5:
              _context3.prev = 5;
              _context3.t0 = parseDOM;
              _context3.next = 9;
              return fetchPage(new URL(trackUrl));

            case 9:
              _context3.t1 = _context3.sent;
              _context3.t2 = trackUrl;
              trackPage = (0, _context3.t0)(_context3.t1, _context3.t2);
              imageUrl = _classPrivateMethodGet(this, _extractCover, _extractCover2).call(this, trackPage);
              /* istanbul ignore if: Cannot find example */

              if (imageUrl) {
                _context3.next = 15;
                break;
              }

              return _context3.abrupt("return");

            case 15:
              return _context3.abrupt("return", {
                url: imageUrl,
                trackNumber: trackNum
              });

            case 18:
              _context3.prev = 18;
              _context3.t3 = _context3["catch"](5);
              LOGGER.error("Could not check track ".concat(trackNum, " for track images"), _context3.t3);
              return _context3.abrupt("return");

            case 22:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this, [[5, 18]]);
    }));
    return _findTrackImage3.apply(this, arguments);
  }

  function _amendSquareThumbnails2(_x6) {
    return _amendSquareThumbnails3.apply(this, arguments);
  }

  function _amendSquareThumbnails3() {
    _amendSquareThumbnails3 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee5(covers) {
      return regenerator.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              return _context5.abrupt("return", Promise.all(covers.map( /*#__PURE__*/function () {
                var _ref = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee4(cover) {
                  var coverDims, ratio;
                  return regenerator.wrap(function _callee4$(_context4) {
                    while (1) {
                      switch (_context4.prev = _context4.next) {
                        case 0:
                          _context4.next = 2;
                          return getImageDimensions(cover.url.href.replace(/_\d+\.(\w+)$/, '_0.$1'));

                        case 2:
                          coverDims = _context4.sent;

                          if (!(!coverDims.width || !coverDims.height)) {
                            _context4.next = 5;
                            break;
                          }

                          return _context4.abrupt("return", [cover]);

                        case 5:
                          ratio = coverDims.width / coverDims.height;

                          if (!(0.95 <= ratio && ratio <= 1.05)) {
                            _context4.next = 8;
                            break;
                          }

                          return _context4.abrupt("return", [cover]);

                        case 8:
                          return _context4.abrupt("return", [_objectSpread2(_objectSpread2({}, cover), {}, {
                            comment: filterNonNull([cover.comment, 'Bandcamp full-sized cover']).join(' - ')
                          }), {
                            types: cover.types,
                            // *_16.jpg URLs are the largest square crop available, always 700x700
                            url: new URL(cover.url.href.replace(/_\d+\.(\w+)$/, '_16.$1')),
                            comment: filterNonNull([cover.comment, 'Bandcamp square crop']).join(' - '),
                            skipMaximisation: true
                          }]);

                        case 9:
                        case "end":
                          return _context4.stop();
                      }
                    }
                  }, _callee4);
                }));

                return function (_x7) {
                  return _ref.apply(this, arguments);
                };
              }())).then(function (covers) {
                return covers.flat();
              }));

            case 1:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }));
    return _amendSquareThumbnails3.apply(this, arguments);
  }

  var BeatportProvider = /*#__PURE__*/function (_CoverArtProvider) {
    _inherits(BeatportProvider, _CoverArtProvider);

    var _super = _createSuper(BeatportProvider);

    function BeatportProvider() {
      var _this;

      _classCallCheck(this, BeatportProvider);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));

      _defineProperty(_assertThisInitialized(_this), "supportedDomains", ['beatport.com']);

      _defineProperty(_assertThisInitialized(_this), "favicon", 'https://geo-pro.beatport.com/static/ea225b5168059ba412818496089481eb.png');

      _defineProperty(_assertThisInitialized(_this), "name", 'Beatport');

      _defineProperty(_assertThisInitialized(_this), "urlRegex", /release\/[^/]+\/(\d+)(?:\/|$)/);

      return _this;
    }

    _createClass(BeatportProvider, [{
      key: "findImages",
      value: function () {
        var _findImages = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(url) {
          var respDocument, coverElmt;
          return regenerator.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.t0 = parseDOM;
                  _context.next = 3;
                  return this.fetchPage(url);

                case 3:
                  _context.t1 = _context.sent;
                  _context.t2 = url.href;
                  respDocument = (0, _context.t0)(_context.t1, _context.t2);
                  coverElmt = qs('head > meta[name="og:image"]', respDocument);
                  return _context.abrupt("return", [{
                    url: new URL(coverElmt.content),
                    types: [ArtworkTypeIDs.Front]
                  }]);

                case 8:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function findImages(_x) {
          return _findImages.apply(this, arguments);
        }

        return findImages;
      }()
    }]);

    return BeatportProvider;
  }(CoverArtProvider);

  var DeezerProvider = /*#__PURE__*/function (_HeadMetaPropertyProv) {
    _inherits(DeezerProvider, _HeadMetaPropertyProv);

    var _super = _createSuper(DeezerProvider);

    function DeezerProvider() {
      var _this;

      _classCallCheck(this, DeezerProvider);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));

      _defineProperty(_assertThisInitialized(_this), "supportedDomains", ['deezer.com']);

      _defineProperty(_assertThisInitialized(_this), "favicon", 'https://e-cdns-files.dzcdn.net/cache/images/common/favicon/favicon-16x16.526cde4edf20647be4ee32cdf35c1c13.png');

      _defineProperty(_assertThisInitialized(_this), "name", 'Deezer');

      _defineProperty(_assertThisInitialized(_this), "urlRegex", /(?:\w{2}\/)?album\/(\d+)/);

      return _this;
    }

    _createClass(DeezerProvider, [{
      key: "findImages",
      value: function () {
        var _findImages = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(url) {
          var covers;
          return regenerator.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return _get(_getPrototypeOf(DeezerProvider.prototype), "findImages", this).call(this, url);

                case 2:
                  covers = _context.sent;
                  return _context.abrupt("return", covers.filter(function (cover) {
                    // Placeholder covers all use the same URLs, since the URL cover "ID"
                    // is actually its MD5 sum. See https://github.com/ROpdebee/mb-userscripts/issues/172
                    if (cover.url.pathname.includes('d41d8cd98f00b204e9800998ecf8427e')) {
                      LOGGER.warn('Ignoring placeholder cover in Deezer release');
                      return false;
                    }

                    return true;
                  }));

                case 4:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function findImages(_x) {
          return _findImages.apply(this, arguments);
        }

        return findImages;
      }()
    }]);

    return DeezerProvider;
  }(HeadMetaPropertyProvider);

  // JS sources somehow.

  var QUERY_SHA256 = '13e41f41a02b02d0a7e855a71e1a02478fd2fb0a2d104b54931d649e1d7c6ecd';
  var DiscogsProvider = /*#__PURE__*/function (_CoverArtProvider) {
    _inherits(DiscogsProvider, _CoverArtProvider);

    var _super = _createSuper(DiscogsProvider);

    function DiscogsProvider() {
      var _this;

      _classCallCheck(this, DiscogsProvider);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));

      _defineProperty(_assertThisInitialized(_this), "supportedDomains", ['discogs.com']);

      _defineProperty(_assertThisInitialized(_this), "favicon", 'https://catalog-assets.discogs.com/e95f0cd9.png');

      _defineProperty(_assertThisInitialized(_this), "name", 'Discogs');

      _defineProperty(_assertThisInitialized(_this), "urlRegex", /\/release\/(\d+)/);

      return _this;
    }

    _createClass(DiscogsProvider, [{
      key: "findImages",
      value: function () {
        var _findImages = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(url) {
          var releaseId, data;
          return regenerator.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  // Loading the full HTML and parsing the metadata JSON embedded within
                  // it.
                  releaseId = this.extractId(url);
                  assertHasValue(releaseId);
                  _context.next = 4;
                  return DiscogsProvider.getReleaseImages(releaseId);

                case 4:
                  data = _context.sent;
                  return _context.abrupt("return", data.data.release.images.edges.map(function (edge) {
                    return {
                      url: new URL(edge.node.fullsize.sourceUrl)
                    };
                  }));

                case 6:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function findImages(_x) {
          return _findImages.apply(this, arguments);
        }

        return findImages;
      }()
    }], [{
      key: "getReleaseImages",
      value: function getReleaseImages(releaseId) {
        var _this2 = this;

        var respProm = this.apiResponseCache.get(releaseId);

        if (typeof respProm === 'undefined') {
          respProm = this.actuallyGetReleaseImages(releaseId);
          this.apiResponseCache.set(releaseId, respProm);
        } // Evict the promise from the cache if it rejects, so that we can retry
        // later. If we don't evict it, later retries will reuse the failing
        // promise. Only remove if it hasn't been replaced yet. It may have
        // already been replaced by another call, since this is asynchronous code


        respProm.catch(function () {
          if (_this2.apiResponseCache.get(releaseId) === respProm) {
            _this2.apiResponseCache.delete(releaseId);
          }
        });
        return respProm;
      }
    }, {
      key: "actuallyGetReleaseImages",
      value: function () {
        var _actuallyGetReleaseImages = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(releaseId) {
          var graphqlParams, resp, metadata, responseId;
          return regenerator.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  graphqlParams = new URLSearchParams({
                    operationName: 'ReleaseAllImages',
                    variables: JSON.stringify({
                      discogsId: parseInt(releaseId),
                      count: 500
                    }),
                    extensions: JSON.stringify({
                      persistedQuery: {
                        version: 1,
                        sha256Hash: QUERY_SHA256
                      }
                    })
                  });
                  _context2.next = 3;
                  return gmxhr("https://www.discogs.com/internal/release-page/api/graphql?".concat(graphqlParams));

                case 3:
                  resp = _context2.sent;
                  metadata = safeParseJSON(resp.responseText, 'Invalid response from Discogs API');
                  assertHasValue(metadata.data.release, 'Discogs release does not exist');
                  responseId = metadata.data.release.discogsId.toString();
                  assert(typeof responseId === 'undefined' || responseId === releaseId, "Discogs returned wrong release: Requested ".concat(releaseId, ", got ").concat(responseId));
                  return _context2.abrupt("return", metadata);

                case 9:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2);
        }));

        function actuallyGetReleaseImages(_x2) {
          return _actuallyGetReleaseImages.apply(this, arguments);
        }

        return actuallyGetReleaseImages;
      }()
    }, {
      key: "maximiseImage",
      value: function () {
        var _maximiseImage = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee3(url) {
          var _url$pathname$match, _imageName$match;

          var imageName, releaseId, releaseData, matchedImage;
          return regenerator.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  // Maximising by querying the API for all images of the release, finding
                  // the right one, and extracting the "full size" (i.e., 600x600 JPEG) URL.
                  imageName = (_url$pathname$match = url.pathname.match(/discogs-images\/(R-.+)$/)) === null || _url$pathname$match === void 0 ? void 0 : _url$pathname$match[1];
                  releaseId = imageName === null || imageName === void 0 ? void 0 : (_imageName$match = imageName.match(/^R-(\d+)/)) === null || _imageName$match === void 0 ? void 0 : _imageName$match[1];
                  /* istanbul ignore if: Should never happen on valid image */

                  if (releaseId) {
                    _context3.next = 4;
                    break;
                  }

                  return _context3.abrupt("return", url);

                case 4:
                  _context3.next = 6;
                  return this.getReleaseImages(releaseId);

                case 6:
                  releaseData = _context3.sent;
                  matchedImage = releaseData.data.release.images.edges.find(function (img) {
                    return img.node.fullsize.sourceUrl.split('/').at(-1) === imageName;
                  });
                  /* istanbul ignore if: Should never happen on valid image */

                  if (matchedImage) {
                    _context3.next = 10;
                    break;
                  }

                  return _context3.abrupt("return", url);

                case 10:
                  return _context3.abrupt("return", new URL(matchedImage.node.fullsize.sourceUrl));

                case 11:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3, this);
        }));

        function maximiseImage(_x3) {
          return _maximiseImage.apply(this, arguments);
        }

        return maximiseImage;
      }()
    }]);

    return DiscogsProvider;
  }(CoverArtProvider);

  _defineProperty(DiscogsProvider, "apiResponseCache", new Map());

  var MelonProvider = /*#__PURE__*/function (_HeadMetaPropertyProv) {
    _inherits(MelonProvider, _HeadMetaPropertyProv);

    var _super = _createSuper(MelonProvider);

    function MelonProvider() {
      var _this;

      _classCallCheck(this, MelonProvider);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));

      _defineProperty(_assertThisInitialized(_this), "supportedDomains", ['melon.com']);

      _defineProperty(_assertThisInitialized(_this), "favicon", 'https://www.melon.com/favicon.ico');

      _defineProperty(_assertThisInitialized(_this), "name", 'Melon');

      _defineProperty(_assertThisInitialized(_this), "urlRegex", /album\/detail\.htm.*[?&]albumId=(\d+)/);

      return _this;
    }

    _createClass(MelonProvider, [{
      key: "cleanUrl",
      value: function cleanUrl(url) {
        // Album ID is in the query params, base `cleanUrl` strips those away.
        return _get(_getPrototypeOf(MelonProvider.prototype), "cleanUrl", this).call(this, url) + url.search;
      }
    }, {
      key: "is404Page",
      value: function is404Page(doc) {
        return qsMaybe('body > input#returnUrl', doc) !== null;
      }
    }]);

    return MelonProvider;
  }(HeadMetaPropertyProvider);

  var MusicBrainzProvider = /*#__PURE__*/function (_CoverArtProvider) {
    _inherits(MusicBrainzProvider, _CoverArtProvider);

    var _super = _createSuper(MusicBrainzProvider);

    function MusicBrainzProvider() {
      var _this;

      _classCallCheck(this, MusicBrainzProvider);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));

      _defineProperty(_assertThisInitialized(_this), "supportedDomains", ['musicbrainz.org', 'beta.musicbrainz.org']);

      _defineProperty(_assertThisInitialized(_this), "favicon", 'https://musicbrainz.org/static/images/favicons/favicon-32x32.png');

      _defineProperty(_assertThisInitialized(_this), "allowButtons", false);

      _defineProperty(_assertThisInitialized(_this), "name", 'MusicBrainz');

      _defineProperty(_assertThisInitialized(_this), "urlRegex", /release\/([a-z0-9-]+)/);

      return _this;
    }

    _createClass(MusicBrainzProvider, [{
      key: "findImages",
      value: function () {
        var _findImages = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(url) {
          var mbid, caaIndexUrl, caaResp, caaIndex;
          return regenerator.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  mbid = this.extractId(url);
                  assertDefined(mbid); // Grabbing metadata through CAA isn't 100% reliable, since the info
                  // in the index.json isn't always up-to-date (see CAA-129, only a few
                  // cases though).

                  caaIndexUrl = "https://archive.org/download/mbid-".concat(mbid, "/index.json");
                  _context.next = 5;
                  return fetch(caaIndexUrl);

                case 5:
                  caaResp = _context.sent;

                  if (!(caaResp.status >= 400)) {
                    _context.next = 8;
                    break;
                  }

                  throw new Error("Cannot load index.json: HTTP error ".concat(caaResp.status));

                case 8:
                  _context.t0 = safeParseJSON;
                  _context.next = 11;
                  return caaResp.text();

                case 11:
                  _context.t1 = _context.sent;
                  caaIndex = (0, _context.t0)(_context.t1, 'Could not parse index.json');
                  return _context.abrupt("return", caaIndex.images.map(function (img) {
                    var imageFileName = img.image.split('/').at(-1);
                    return {
                      // Skip one level of indirection
                      url: new URL("https://archive.org/download/mbid-".concat(mbid, "/mbid-").concat(mbid, "-").concat(imageFileName)),
                      comment: img.comment,
                      types: img.types.map(function (type) {
                        return ArtworkTypeIDs[type];
                      })
                    };
                  }));

                case 14:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function findImages(_x) {
          return _findImages.apply(this, arguments);
        }

        return findImages;
      }()
    }]);

    return MusicBrainzProvider;
  }(CoverArtProvider);

  var MusikSammlerProvider = /*#__PURE__*/function (_CoverArtProvider) {
    _inherits(MusikSammlerProvider, _CoverArtProvider);

    var _super = _createSuper(MusikSammlerProvider);

    function MusikSammlerProvider() {
      var _this;

      _classCallCheck(this, MusikSammlerProvider);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));

      _defineProperty(_assertThisInitialized(_this), "supportedDomains", ['musik-sammler.de']);

      _defineProperty(_assertThisInitialized(_this), "name", 'Musik-Sammler');

      _defineProperty(_assertThisInitialized(_this), "favicon", 'https://www.musik-sammler.de/favicon.ico');

      _defineProperty(_assertThisInitialized(_this), "urlRegex", /release\/(?:.*-)?(\d+)(?:\/|$)/);

      return _this;
    }

    _createClass(MusikSammlerProvider, [{
      key: "findImages",
      value: function () {
        var _findImages = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(url) {
          var page, coverElements;
          return regenerator.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.t0 = parseDOM;
                  _context.next = 3;
                  return this.fetchPage(url);

                case 3:
                  _context.t1 = _context.sent;
                  _context.t2 = url.href;
                  page = (0, _context.t0)(_context.t1, _context.t2);
                  coverElements = qsa('#imageGallery > li', page);
                  return _context.abrupt("return", coverElements.map(function (coverLi) {
                    var coverSrc = coverLi.getAttribute('data-src');
                    assertNonNull(coverSrc, 'Musik-Sammler image without source?');
                    return {
                      url: new URL(coverSrc, 'https://www.musik-sammler.de/')
                    };
                  }));

                case 8:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function findImages(_x) {
          return _findImages.apply(this, arguments);
        }

        return findImages;
      }()
    }]);

    return MusikSammlerProvider;
  }(CoverArtProvider);

  // from the JS code loaded on open.qobuz.com, but for simplicity's sake, let's
  // just use a constant app ID first.

  var QOBUZ_APP_ID = '712109809';
  var QobuzProvider = /*#__PURE__*/function (_CoverArtProvider) {
    _inherits(QobuzProvider, _CoverArtProvider);

    var _super = _createSuper(QobuzProvider);

    function QobuzProvider() {
      var _this;

      _classCallCheck(this, QobuzProvider);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));

      _defineProperty(_assertThisInitialized(_this), "supportedDomains", ['qobuz.com', 'open.qobuz.com']);

      _defineProperty(_assertThisInitialized(_this), "favicon", 'https://www.qobuz.com/favicon.ico');

      _defineProperty(_assertThisInitialized(_this), "name", 'Qobuz');

      _defineProperty(_assertThisInitialized(_this), "urlRegex", [/open\.qobuz\.com\/(?:.+?\/)?album\/([A-Za-z0-9]+)(?:\/|$)/, /album\/[^/]+\/([A-Za-z0-9]+)(?:\/|$)/]);

      return _this;
    }

    _createClass(QobuzProvider, [{
      key: "findImages",
      value: function () {
        var _findImages = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(url) {
          var _metadata$goodies;

          var id, metadata, goodies, coverUrl;
          return regenerator.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  id = this.extractId(url);
                  assertHasValue(id); // eslint-disable-next-line init-declarations

                  _context.prev = 2;
                  _context.next = 5;
                  return QobuzProvider.getMetadata(id);

                case 5:
                  metadata = _context.sent;
                  _context.next = 14;
                  break;

                case 8:
                  _context.prev = 8;
                  _context.t0 = _context["catch"](2);

                  if (!(_context.t0 instanceof HTTPResponseError && _context.t0.statusCode == 400)) {
                    _context.next = 13;
                    break;
                  }

                  // Bad request, likely invalid app ID.
                  // Log the original error silently to the console, and throw
                  // a more user friendly one for displaying in the UI
                  console.error(_context.t0);
                  throw new Error('Bad request to Qobuz API, app ID invalid?');

                case 13:
                  throw _context.t0;

                case 14:
                  goodies = ((_metadata$goodies = metadata.goodies) !== null && _metadata$goodies !== void 0 ? _metadata$goodies : []).map(QobuzProvider.extractGoodies);
                  coverUrl = metadata.image.large.replace(/_\d+\.([a-zA-Z0-9]+)$/, '_org.$1');
                  return _context.abrupt("return", [{
                    url: new URL(coverUrl),
                    types: [ArtworkTypeIDs.Front]
                  }].concat(_toConsumableArray(goodies)));

                case 17:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this, [[2, 8]]);
        }));

        function findImages(_x) {
          return _findImages.apply(this, arguments);
        }

        return findImages;
      }()
    }], [{
      key: "idToCoverUrl",
      value: function idToCoverUrl(id) {
        var d1 = id.slice(-2);
        var d2 = id.slice(-4, -2); // Is this always .jpg?

        var imgUrl = "https://static.qobuz.com/images/covers/".concat(d1, "/").concat(d2, "/").concat(id, "_org.jpg");
        return new URL(imgUrl);
      }
    }, {
      key: "getMetadata",
      value: function () {
        var _getMetadata = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(id) {
          var resp, metadata;
          return regenerator.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.next = 2;
                  return gmxhr("https://www.qobuz.com/api.json/0.2/album/get?album_id=".concat(id, "&offset=0&limit=20"), {
                    headers: {
                      'x-app-id': QOBUZ_APP_ID
                    }
                  });

                case 2:
                  resp = _context2.sent;
                  metadata = safeParseJSON(resp.responseText, 'Invalid response from Qobuz API');
                  assert(metadata.id.toString() === id, "Qobuz returned wrong release: Requested ".concat(id, ", got ").concat(metadata.id));
                  return _context2.abrupt("return", metadata);

                case 6:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2);
        }));

        function getMetadata(_x2) {
          return _getMetadata.apply(this, arguments);
        }

        return getMetadata;
      }()
    }, {
      key: "extractGoodies",
      value: function extractGoodies(goodie) {
        // Livret Numérique = Digital Booklet
        var isBooklet = goodie.name.toLowerCase() === 'livret numérique';
        return {
          url: new URL(goodie.original_url),
          types: isBooklet ? [ArtworkTypeIDs.Booklet] : [],
          comment: isBooklet ? 'Qobuz booklet' : goodie.name
        };
      }
    }]);

    return QobuzProvider;
  }(CoverArtProvider);

  // https://github.com/ROpdebee/mb-userscripts/issues/158

  var QubMusiqueProvider = /*#__PURE__*/function (_QobuzProvider) {
    _inherits(QubMusiqueProvider, _QobuzProvider);

    var _super = _createSuper(QubMusiqueProvider);

    function QubMusiqueProvider() {
      var _this;

      _classCallCheck(this, QubMusiqueProvider);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));

      _defineProperty(_assertThisInitialized(_this), "supportedDomains", ['qub.ca']);

      _defineProperty(_assertThisInitialized(_this), "favicon", 'https://www.qub.ca/assets/favicons/apple-touch-icon.png');

      _defineProperty(_assertThisInitialized(_this), "name", 'QUB Musique');

      _defineProperty(_assertThisInitialized(_this), "urlRegex", [/musique\/album\/[\w-]*-([A-Za-z0-9]+)(?:\/|$)/]);

      return _this;
    } // We can reuse the rest of the implementations of QobuzProvider, since it
    // extracts the ID and uses the Qobuz API instead of loading the page.


    return QubMusiqueProvider;
  }(QobuzProvider);

  var RateYourMusicProvider = /*#__PURE__*/function (_CoverArtProvider) {
    _inherits(RateYourMusicProvider, _CoverArtProvider);

    var _super = _createSuper(RateYourMusicProvider);

    function RateYourMusicProvider() {
      var _this;

      _classCallCheck(this, RateYourMusicProvider);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));

      _defineProperty(_assertThisInitialized(_this), "supportedDomains", ['rateyourmusic.com']);

      _defineProperty(_assertThisInitialized(_this), "favicon", 'https://e.snmc.io/2.5/img/sonemic.png');

      _defineProperty(_assertThisInitialized(_this), "name", 'RateYourMusic');

      _defineProperty(_assertThisInitialized(_this), "urlRegex", /\/release\/album\/([^/]+\/[^/]+)(?:\/|$)/);

      return _this;
    }

    _createClass(RateYourMusicProvider, [{
      key: "findImages",
      value: function () {
        var _findImages = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(url) {
          var releaseId, buyUrl, buyDoc, fullResUrl;
          return regenerator.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  releaseId = this.extractId(url);
                  assertHasValue(releaseId); // Need to go through the Buy page to find full-res images. The user
                  // must be logged in to get the full-res image. We can't use the
                  // thumbnails in case the user is not logged in, since they're served
                  // as WebP, which isn't supported by CAA (yet).

                  buyUrl = "https://rateyourmusic.com/release/album/".concat(releaseId, "/buy");
                  _context.t0 = parseDOM;
                  _context.next = 6;
                  return this.fetchPage(new URL(buyUrl));

                case 6:
                  _context.t1 = _context.sent;
                  _context.t2 = buyUrl;
                  buyDoc = (0, _context.t0)(_context.t1, _context.t2);

                  if (!(qsMaybe('.header_profile_logged_in', buyDoc) === null)) {
                    _context.next = 11;
                    break;
                  }

                  throw new Error('Extracting covers from RYM requires being logged in to an RYM account.');

                case 11:
                  fullResUrl = qs('.qq a', buyDoc).href;
                  return _context.abrupt("return", [{
                    url: new URL(fullResUrl),
                    types: [ArtworkTypeIDs.Front]
                  }]);

                case 13:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function findImages(_x) {
          return _findImages.apply(this, arguments);
        }

        return findImages;
      }()
    }]);

    return RateYourMusicProvider;
  }(CoverArtProvider);

  var _extractCoverFromTrackMetadata = /*#__PURE__*/new WeakSet();

  var _extractCoversFromSetMetadata = /*#__PURE__*/new WeakSet();

  var SoundcloudProvider = /*#__PURE__*/function (_ProviderWithTrackIma) {
    _inherits(SoundcloudProvider, _ProviderWithTrackIma);

    var _super = _createSuper(SoundcloudProvider);

    function SoundcloudProvider() {
      var _this;

      _classCallCheck(this, SoundcloudProvider);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));

      _classPrivateMethodInitSpec(_assertThisInitialized(_this), _extractCoversFromSetMetadata);

      _classPrivateMethodInitSpec(_assertThisInitialized(_this), _extractCoverFromTrackMetadata);

      _defineProperty(_assertThisInitialized(_this), "supportedDomains", ['soundcloud.com']);

      _defineProperty(_assertThisInitialized(_this), "favicon", 'https://a-v2.sndcdn.com/assets/images/sc-icons/favicon-2cadd14bdb.ico');

      _defineProperty(_assertThisInitialized(_this), "name", 'Soundcloud');

      _defineProperty(_assertThisInitialized(_this), "urlRegex", []);

      return _this;
    }

    _createClass(SoundcloudProvider, [{
      key: "supportsUrl",
      value: function supportsUrl(url) {
        var _url$pathname$trim$sl = url.pathname.trim() // Remove leading slash
        .slice(1) // Remove trailing slash, if any
        .replace(/\/$/, '').split('/'),
            _url$pathname$trim$sl2 = _toArray(_url$pathname$trim$sl),
            artistId = _url$pathname$trim$sl2[0],
            pathParts = _url$pathname$trim$sl2.slice(1);

        return !!pathParts.length && !SoundcloudProvider.badArtistIDs.has(artistId) // artist/likes, artist/track/recommended, artist/sets, ...
        // but not artist/sets/setname!
        && !SoundcloudProvider.badSubpaths.has(pathParts.at(-1));
      }
    }, {
      key: "extractId",
      value: function extractId(url) {
        // We'll use the full path as the ID. This will allow us to distinguish
        // between sets and single tracks, artists, etc.
        // We should've filtered out all bad URLs already.
        // https://soundcloud.com/jonnypalding/sets/talk-21/s-Oeb9wlaKWyl
        // Not sure what the last path component means, but it's required to
        // open that set. Perhaps because it's private?
        return url.pathname.slice(1); // Remove leading slash
      }
    }, {
      key: "findImages",
      value: function () {
        var _findImages = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(url) {
          var _this$extractMetadata;

          var onlyFront,
              pageContent,
              metadata,
              _args = arguments;
          return regenerator.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  onlyFront = _args.length > 1 && _args[1] !== undefined ? _args[1] : false;
                  _context.next = 3;
                  return this.fetchPage(url);

                case 3:
                  pageContent = _context.sent;
                  metadata = (_this$extractMetadata = this.extractMetadataFromJS(pageContent)) === null || _this$extractMetadata === void 0 ? void 0 : _this$extractMetadata.find(function (data) {
                    return ['sound', 'playlist'].includes(data.hydratable);
                  });

                  if (metadata) {
                    _context.next = 7;
                    break;
                  }

                  throw new Error('Could not extract metadata from Soundcloud page. The release may have been removed.');

                case 7:
                  if (!(metadata.hydratable === 'sound')) {
                    _context.next = 11;
                    break;
                  }

                  return _context.abrupt("return", _classPrivateMethodGet(this, _extractCoverFromTrackMetadata, _extractCoverFromTrackMetadata2).call(this, metadata));

                case 11:
                  assert(metadata.hydratable === 'playlist');
                  return _context.abrupt("return", _classPrivateMethodGet(this, _extractCoversFromSetMetadata, _extractCoversFromSetMetadata2).call(this, metadata, onlyFront));

                case 13:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function findImages(_x) {
          return _findImages.apply(this, arguments);
        }

        return findImages;
      }()
    }, {
      key: "extractMetadataFromJS",
      value: function extractMetadataFromJS(pageContent) {
        var _pageContent$match;

        var jsonData = (_pageContent$match = pageContent.match(/>window\.__sc_hydration = (.+);<\/script>/)) === null || _pageContent$match === void 0 ? void 0 : _pageContent$match[1];
        /* istanbul ignore if: Shouldn't happen */

        if (!jsonData) return;
        return safeParseJSON(jsonData);
      }
    }]);

    return SoundcloudProvider;
  }(ProviderWithTrackImages);

  function _extractCoverFromTrackMetadata2(metadata) {
    if (!metadata.data.artwork_url) {
      return [];
    }

    return [{
      url: new URL(metadata.data.artwork_url),
      types: [ArtworkTypeIDs.Front]
    }];
  }

  function _extractCoversFromSetMetadata2(_x2, _x3) {
    return _extractCoversFromSetMetadata3.apply(this, arguments);
  }

  function _extractCoversFromSetMetadata3() {
    _extractCoversFromSetMetadata3 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(metadata, onlyFront) {
      var covers, trackCovers, mergedTrackCovers;
      return regenerator.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              covers = [];
              /* istanbul ignore else: Cannot find case */

              if (metadata.data.artwork_url) {
                covers.push({
                  url: new URL(metadata.data.artwork_url),
                  types: [ArtworkTypeIDs.Front]
                });
              } // Don't bother extracting track covers if they won't be used anyway


              if (!onlyFront) {
                _context2.next = 4;
                break;
              }

              return _context2.abrupt("return", covers);

            case 4:
              trackCovers = filterNonNull(metadata.data.tracks.flatMap(function (track, trackNumber) {
                if (!track.artwork_url) return;
                return {
                  url: track.artwork_url,
                  trackNumber: (trackNumber + 1).toString()
                };
              }));
              _context2.next = 7;
              return this.mergeTrackImages(trackCovers, metadata.data.artwork_url, true);

            case 7:
              mergedTrackCovers = _context2.sent;
              return _context2.abrupt("return", covers.concat(mergedTrackCovers));

            case 9:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));
    return _extractCoversFromSetMetadata3.apply(this, arguments);
  }

  _defineProperty(SoundcloudProvider, "badArtistIDs", new Set(['you', 'discover', 'stream', 'upload', 'search']));

  _defineProperty(SoundcloudProvider, "badSubpaths", new Set(['likes', 'followers', 'following', 'reposts', 'albums', 'tracks', 'popular-tracks', 'comments', 'sets', 'recommended']));

  var SpotifyProvider = /*#__PURE__*/function (_HeadMetaPropertyProv) {
    _inherits(SpotifyProvider, _HeadMetaPropertyProv);

    var _super = _createSuper(SpotifyProvider);

    function SpotifyProvider() {
      var _this;

      _classCallCheck(this, SpotifyProvider);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));

      _defineProperty(_assertThisInitialized(_this), "supportedDomains", ['open.spotify.com']);

      _defineProperty(_assertThisInitialized(_this), "favicon", 'https://open.scdn.co/cdn/images/favicon32.8e66b099.png');

      _defineProperty(_assertThisInitialized(_this), "name", 'Spotify');

      _defineProperty(_assertThisInitialized(_this), "urlRegex", /\/album\/(\w+)/);

      return _this;
    }

    return SpotifyProvider;
  }(HeadMetaPropertyProvider);

  // API keys, I guess they might depend on the user type and/or country?
  // Also not sure whether these may change often or not. If they do, we might
  // need to switch to extracting them from the JS.
  // However, seeing as this key has been present in their JS code for at least
  // 3 years already, I doubt this will stop working any time soon.
  // https://web.archive.org/web/20181015184006/https://listen.tidal.com/app.9dbb572e8121f8755b73.js

  var APP_ID = 'CzET4vdadNUFQ5JU'; // Incomplete and not entirely correct, but good enough for our purposes.

  var _countryCode = /*#__PURE__*/new WeakMap();

  var TidalProvider = /*#__PURE__*/function (_CoverArtProvider) {
    _inherits(TidalProvider, _CoverArtProvider);

    var _super = _createSuper(TidalProvider);

    function TidalProvider() {
      var _this;

      _classCallCheck(this, TidalProvider);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));

      _defineProperty(_assertThisInitialized(_this), "supportedDomains", ['tidal.com', 'listen.tidal.com', 'store.tidal.com']);

      _defineProperty(_assertThisInitialized(_this), "favicon", 'https://listen.tidal.com/favicon.ico');

      _defineProperty(_assertThisInitialized(_this), "name", 'Tidal');

      _defineProperty(_assertThisInitialized(_this), "urlRegex", /\/album\/(\d+)/);

      _classPrivateFieldInitSpec(_assertThisInitialized(_this), _countryCode, {
        writable: true,
        value: null
      });

      return _this;
    }

    _createClass(TidalProvider, [{
      key: "getCountryCode",
      value: function () {
        var _getCountryCode = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee() {
          var resp, codeResponse;
          return regenerator.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  if (_classPrivateFieldGet(this, _countryCode)) {
                    _context.next = 6;
                    break;
                  }

                  _context.next = 3;
                  return gmxhr('https://listen.tidal.com/v1/country/context?countryCode=WW&locale=en_US&deviceType=BROWSER', {
                    headers: {
                      'x-tidal-token': APP_ID
                    }
                  });

                case 3:
                  resp = _context.sent;
                  codeResponse = safeParseJSON(resp.responseText, 'Invalid JSON response from Tidal API for country code');

                  _classPrivateFieldSet(this, _countryCode, codeResponse.countryCode);

                case 6:
                  assertHasValue(_classPrivateFieldGet(this, _countryCode), 'Cannot determine Tidal country');
                  return _context.abrupt("return", _classPrivateFieldGet(this, _countryCode));

                case 8:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function getCountryCode() {
          return _getCountryCode.apply(this, arguments);
        }

        return getCountryCode;
      }()
    }, {
      key: "getCoverUrlFromMetadata",
      value: function () {
        var _getCoverUrlFromMetadata = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(albumId) {
          var _metadata$rows$, _metadata$rows$$modul, _metadata$rows$$modul2;

          var countryCode, apiUrl, resp, metadata, albumMetadata, coverId;
          return regenerator.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.next = 2;
                  return this.getCountryCode();

                case 2:
                  countryCode = _context2.sent;
                  _context2.next = 5;
                  return gmxhr('https://listen.tidal.com/v1/ping');

                case 5:
                  apiUrl = "https://listen.tidal.com/v1/pages/album?albumId=".concat(albumId, "&countryCode=").concat(countryCode, "&deviceType=BROWSER");
                  _context2.next = 8;
                  return gmxhr(apiUrl, {
                    headers: {
                      'x-tidal-token': APP_ID
                    }
                  });

                case 8:
                  resp = _context2.sent;
                  metadata = safeParseJSON(resp.responseText, 'Invalid response from Tidal API');
                  albumMetadata = (_metadata$rows$ = metadata.rows[0]) === null || _metadata$rows$ === void 0 ? void 0 : (_metadata$rows$$modul = _metadata$rows$.modules) === null || _metadata$rows$$modul === void 0 ? void 0 : (_metadata$rows$$modul2 = _metadata$rows$$modul[0]) === null || _metadata$rows$$modul2 === void 0 ? void 0 : _metadata$rows$$modul2.album;
                  assertHasValue(albumMetadata, 'Tidal API returned no album, 404?');
                  assert(albumMetadata.id.toString() === albumId, "Tidal returned wrong release: Requested ".concat(albumId, ", got ").concat(albumMetadata.id));
                  coverId = albumMetadata.cover;
                  assertHasValue(coverId, 'Could not find cover in Tidal metadata');
                  return _context2.abrupt("return", "https://resources.tidal.com/images/".concat(coverId.replace(/-/g, '/'), "/origin.jpg"));

                case 16:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        }));

        function getCoverUrlFromMetadata(_x) {
          return _getCoverUrlFromMetadata.apply(this, arguments);
        }

        return getCoverUrlFromMetadata;
      }()
    }, {
      key: "findImages",
      value: function () {
        var _findImages = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee3(url) {
          var albumId, coverUrl;
          return regenerator.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  // Rewrite the URL to point to the main page
                  // Both listen.tidal.com and store.tidal.com load metadata through an
                  // API. Bare tidal.com returns the image in a <meta> property.
                  albumId = this.extractId(url);
                  assertHasValue(albumId);
                  _context3.next = 4;
                  return this.getCoverUrlFromMetadata(albumId);

                case 4:
                  coverUrl = _context3.sent;
                  return _context3.abrupt("return", [{
                    url: new URL(coverUrl),
                    types: [ArtworkTypeIDs.Front]
                  }]);

                case 6:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3, this);
        }));

        function findImages(_x2) {
          return _findImages.apply(this, arguments);
        }

        return findImages;
      }()
    }]);

    return TidalProvider;
  }(CoverArtProvider);

  var PROVIDER_DISPATCH = new DispatchMap();

  function addProvider(provider) {
    provider.supportedDomains.forEach(function (domain) {
      return PROVIDER_DISPATCH.set(domain, provider);
    });
  }

  addProvider(new AllMusicProvider());
  addProvider(new AmazonProvider());
  addProvider(new AmazonMusicProvider());
  addProvider(new AppleMusicProvider());
  addProvider(new BandcampProvider());
  addProvider(new BeatportProvider());
  addProvider(new DeezerProvider());
  addProvider(new DiscogsProvider());
  addProvider(new MelonProvider());
  addProvider(new MusicBrainzProvider());
  addProvider(new MusikSammlerProvider());
  addProvider(new QobuzProvider());
  addProvider(new QubMusiqueProvider());
  addProvider(new RateYourMusicProvider());
  addProvider(new SevenDigitalProvider());
  addProvider(new SoundcloudProvider());
  addProvider(new SpotifyProvider());
  addProvider(new TidalProvider());
  addProvider(new VGMdbProvider());

  function extractDomain(url) {
    return url.hostname.replace(/^www\./, '');
  }

  function getProvider(url) {
    var provider = PROVIDER_DISPATCH.get(extractDomain(url));
    return provider !== null && provider !== void 0 && provider.supportsUrl(url) ? provider : undefined;
  }

  var _banner = new WeakMap();
  var _currentMessageClass = new WeakMap();
  var _setStatusBanner = new WeakSet();
  var _setStatusBannerClass = new WeakSet();
  var StatusBanner = function () {
      function StatusBanner() {
          _classCallCheck(this, StatusBanner);
          _classPrivateMethodInitSpec(this, _setStatusBannerClass);
          _classPrivateMethodInitSpec(this, _setStatusBanner);
          _classPrivateFieldInitSpec(this, _banner, {
              writable: true,
              value: void 0
          });
          _classPrivateFieldInitSpec(this, _currentMessageClass, {
              writable: true,
              value: 'info'
          });
          _classPrivateFieldSet(this, _banner, function () {
              var $$a = document.createElement('span');
              $$a.setAttribute('id', 'ROpdebee_paste_url_status');
              $$a.setAttribute('class', 'info');
              setStyles($$a, { display: 'none' });
              return $$a;
          }.call(this));
      }
      _createClass(StatusBanner, [
          {
              key: 'onInfo',
              value: function onInfo(message) {
                  _classPrivateMethodGet(this, _setStatusBanner, _setStatusBanner2).call(this, message);
                  _classPrivateMethodGet(this, _setStatusBannerClass, _setStatusBannerClass2).call(this, 'info');
              }
          },
          {
              key: 'onWarn',
              value: function onWarn(message, exception) {
                  _classPrivateMethodGet(this, _setStatusBanner, _setStatusBanner2).call(this, message, exception);
                  _classPrivateMethodGet(this, _setStatusBannerClass, _setStatusBannerClass2).call(this, 'warning');
              }
          },
          {
              key: 'onError',
              value: function onError(message, exception) {
                  _classPrivateMethodGet(this, _setStatusBanner, _setStatusBanner2).call(this, message, exception);
                  _classPrivateMethodGet(this, _setStatusBannerClass, _setStatusBannerClass2).call(this, 'error');
              }
          },
          {
              key: 'onSuccess',
              value: function onSuccess(message) {
                  _classPrivateMethodGet(this, _setStatusBanner, _setStatusBanner2).call(this, message);
                  _classPrivateMethodGet(this, _setStatusBannerClass, _setStatusBannerClass2).call(this, 'success');
              }
          },
          {
              key: 'htmlElement',
              get: function get() {
                  return _classPrivateFieldGet(this, _banner);
              }
          }
      ]);
      return StatusBanner;
  }();
  function _setStatusBanner2(message, exception) {
      if (exception && exception instanceof Error) {
          _classPrivateFieldGet(this, _banner).textContent = message + ': ' + exception.message;
      } else {
          _classPrivateFieldGet(this, _banner).textContent = message;
      }
      _classPrivateFieldGet(this, _banner).style.removeProperty('display');
  }
  function _setStatusBannerClass2(newClass) {
      _classPrivateFieldGet(this, _banner).classList.replace(_classPrivateFieldGet(this, _currentMessageClass), newClass);
      _classPrivateFieldSet(this, _currentMessageClass, newClass);
  }

  var css_248z = ".ROpdebee_paste_url_cont{display:inline-block;margin-left:32px;vertical-align:middle}.ROpdebee_paste_url_cont>*{display:block}.ROpdebee_paste_url_cont>label{display:inline;float:none!important}.ROpdebee_paste_url_cont>input#ROpdebee_paste_front_only{display:inline}.ROpdebee_paste_url_cont>a{font-size:smaller;text-align:right}.ROpdebee_paste_url_cont+span{margin-left:32px}.ROpdebee_import_url_buttons{margin-left:32px;vertical-align:middle}.ROpdebee_import_url_buttons>button{display:block;float:none;margin:4px}#ROpdebee_paste_url_status.info{color:#000}#ROpdebee_paste_url_status.warning{color:orange}";

  var _urlInput = new WeakMap();
  var _buttonContainer = new WeakMap();
  var _orSpan = new WeakMap();
  var InputForm = function () {
      function InputForm(banner, app) {
          var _this = this, _qs$insertAdjacentEle, _qs$insertAdjacentEle2;
          _classCallCheck(this, InputForm);
          _classPrivateFieldInitSpec(this, _urlInput, {
              writable: true,
              value: void 0
          });
          _classPrivateFieldInitSpec(this, _buttonContainer, {
              writable: true,
              value: void 0
          });
          _classPrivateFieldInitSpec(this, _orSpan, {
              writable: true,
              value: void 0
          });
          document.head.append(function () {
              var $$a = document.createElement('style');
              $$a.setAttribute('id', 'ROpdebee_' + USERSCRIPT_NAME);
              appendChildren($$a, css_248z);
              return $$a;
          }.call(this));
          _classPrivateFieldSet(this, _urlInput, function () {
              var $$c = document.createElement('input');
              $$c.setAttribute('type', 'url');
              $$c.setAttribute('placeholder', 'or paste one or more URLs here');
              $$c.setAttribute('size', 47);
              $$c.setAttribute('id', 'ROpdebee_paste_url');
              $$c.addEventListener('input', function () {
                  var _ref = _asyncToGenerator(regenerator.mark(function _callee(evt) {
                      var oldValue, _iterator, _step, inputUrl, url;
                      return regenerator.wrap(function _callee$(_context) {
                          while (1) {
                              switch (_context.prev = _context.next) {
                              case 0:
                                  if (evt.currentTarget.value) {
                                      _context.next = 2;
                                      break;
                                  }
                                  return _context.abrupt('return');
                              case 2:
                                  oldValue = evt.currentTarget.value;
                                  _iterator = _createForOfIteratorHelper(oldValue.trim().split(/\s+/));
                                  _context.prev = 4;
                                  _iterator.s();
                              case 6:
                                  if ((_step = _iterator.n()).done) {
                                      _context.next = 21;
                                      break;
                                  }
                                  inputUrl = _step.value;
                                  url = void 0;
                                  _context.prev = 9;
                                  url = new URL(inputUrl);
                                  _context.next = 17;
                                  break;
                              case 13:
                                  _context.prev = 13;
                                  _context.t0 = _context['catch'](9);
                                  LOGGER.error('Invalid URL: '.concat(inputUrl), _context.t0);
                                  return _context.abrupt('continue', 19);
                              case 17:
                                  _context.next = 19;
                                  return app.processURL(url);
                              case 19:
                                  _context.next = 6;
                                  break;
                              case 21:
                                  _context.next = 26;
                                  break;
                              case 23:
                                  _context.prev = 23;
                                  _context.t1 = _context['catch'](4);
                                  _iterator.e(_context.t1);
                              case 26:
                                  _context.prev = 26;
                                  _iterator.f();
                                  return _context.finish(26);
                              case 29:
                                  if (_classPrivateFieldGet(_this, _urlInput).value === oldValue) {
                                      _classPrivateFieldGet(_this, _urlInput).value = '';
                                  }
                              case 30:
                              case 'end':
                                  return _context.stop();
                              }
                          }
                      }, _callee, null, [
                          [
                              4,
                              23,
                              26,
                              29
                          ],
                          [
                              9,
                              13
                          ]
                      ]);
                  }));
                  return function (_x) {
                      return _ref.apply(this, arguments);
                  };
              }());
              return $$c;
          }.call(this));
          var _createPersistentChec = createPersistentCheckbox('ROpdebee_paste_front_only', 'Fetch front image only', function (evt) {
                  var _checked, _evt$currentTarget;
                  app.onlyFront = (_checked = (_evt$currentTarget = evt.currentTarget) === null || _evt$currentTarget === void 0 ? void 0 : _evt$currentTarget.checked) !== null && _checked !== void 0 ? _checked : false;
              }), _createPersistentChec2 = _slicedToArray(_createPersistentChec, 2), onlyFrontCheckbox = _createPersistentChec2[0], onlyFrontLabel = _createPersistentChec2[1];
          app.onlyFront = onlyFrontCheckbox.checked;
          var container = function () {
              var $$d = document.createElement('div');
              $$d.setAttribute('class', 'ROpdebee_paste_url_cont');
              appendChildren($$d, _classPrivateFieldGet(this, _urlInput));
              var $$f = document.createElement('a');
              $$f.setAttribute('href', 'https://github.com/ROpdebee/mb-userscripts/blob/main/src/mb_enhanced_cover_art_uploads/docs/supported_providers.md');
              $$f.setAttribute('target', '_blank');
              $$d.appendChild($$f);
              var $$g = document.createTextNode('\n                Supported providers\n            ');
              $$f.appendChild($$g);
              appendChildren($$d, onlyFrontCheckbox);
              appendChildren($$d, onlyFrontLabel);
              appendChildren($$d, banner);
              return $$d;
          }.call(this);
          _classPrivateFieldSet(this, _buttonContainer, function () {
              var $$k = document.createElement('div');
              $$k.setAttribute('class', 'ROpdebee_import_url_buttons buttons');
              return $$k;
          }.call(this));
          _classPrivateFieldSet(this, _orSpan, function () {
              var $$l = document.createElement('span');
              setStyles($$l, { display: 'none' });
              var $$m = document.createTextNode('or');
              $$l.appendChild($$m);
              return $$l;
          }.call(this));
          (_qs$insertAdjacentEle = qs('#drop-zone').insertAdjacentElement('afterend', container)) === null || _qs$insertAdjacentEle === void 0 ? void 0 : (_qs$insertAdjacentEle2 = _qs$insertAdjacentEle.insertAdjacentElement('afterend', _classPrivateFieldGet(this, _orSpan))) === null || _qs$insertAdjacentEle2 === void 0 ? void 0 : _qs$insertAdjacentEle2.insertAdjacentElement('afterend', _classPrivateFieldGet(this, _buttonContainer));
      }
      _createClass(InputForm, [{
              key: 'addImportButton',
              value: function () {
                  var _addImportButton = _asyncToGenerator(regenerator.mark(function _callee2(onClickCallback, url, provider) {
                      var favicon, button;
                      return regenerator.wrap(function _callee2$(_context2) {
                          while (1) {
                              switch (_context2.prev = _context2.next) {
                              case 0:
                                  _context2.next = 2;
                                  return provider.favicon;
                              case 2:
                                  favicon = _context2.sent;
                                  button = function () {
                                      var $$n = document.createElement('button');
                                      $$n.setAttribute('type', 'button');
                                      $$n.setAttribute('title', url);
                                      $$n.addEventListener('click', function (evt) {
                                          evt.preventDefault();
                                          onClickCallback();
                                      });
                                      var $$o = document.createElement('img');
                                      $$o.setAttribute('src', favicon);
                                      $$o.setAttribute('alt', provider.name);
                                      $$n.appendChild($$o);
                                      var $$p = document.createElement('span');
                                      $$n.appendChild($$p);
                                      appendChildren($$p, 'Import from ' + provider.name);
                                      return $$n;
                                  }.call(this);
                                  _classPrivateFieldGet(this, _orSpan).style.display = '';
                                  _classPrivateFieldGet(this, _buttonContainer).insertAdjacentElement('beforeend', button);
                              case 6:
                              case 'end':
                                  return _context2.stop();
                              }
                          }
                      }, _callee2, this);
                  }));
                  function addImportButton(_x2, _x3, _x4) {
                      return _addImportButton.apply(this, arguments);
                  }
                  return addImportButton;
              }()
          }]);
      return InputForm;
  }();

  // userscript is executed, so $$IMU_EXPORT$$ should already exist now. However,
  // it does not exist in tests, and we can't straightforwardly inject this variable
  // without importing the module, thereby dereferencing it.

  /* istanbul ignore next: mocked out */

  function maxurl(url, options) {
    // In environments with GM.* APIs, the GM.getValue and GM.setValue functions
    // are asynchronous, leading to IMU defining its exports asynchronously too.
    // We can't await that, unfortunately. This is only really an issue when
    // processing seeding parameters, when user interaction is required, it'll
    // probably already be loaded.
    return retryTimes(function () {
      $$IMU_EXPORT$$(url, options);
    }, 100, 500); // Pretty large number of retries, but eventually it should work.
  }

  var options = {
    fill_object: true,
    exclude_videos: true,

    /* istanbul ignore next: Cannot test in unit tests, IMU unavailable */
    filter: function filter(url) {
      return !url.toLowerCase().endsWith('.webp') // Blocking webp images in Discogs
      && !/:format(webp)/.test(url.toLowerCase());
    }
  };
  var IMU_EXCEPTIONS = new DispatchMap();
  function getMaximisedCandidates(_x) {
    return _getMaximisedCandidates.apply(this, arguments);
  }

  function _getMaximisedCandidates() {
    _getMaximisedCandidates = _wrapAsyncGenerator( /*#__PURE__*/regenerator.mark(function _callee(smallurl) {
      var exceptionFn;
      return regenerator.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              exceptionFn = IMU_EXCEPTIONS.get(smallurl.hostname);

              if (!exceptionFn) {
                _context.next = 12;
                break;
              }

              _context.t0 = _asyncGeneratorDelegate;
              _context.t1 = _asyncIterator;
              _context.next = 6;
              return _awaitAsyncGenerator(exceptionFn(smallurl));

            case 6:
              _context.t2 = _context.sent;
              _context.t3 = (0, _context.t1)(_context.t2);
              _context.t4 = _awaitAsyncGenerator;
              return _context.delegateYield((0, _context.t0)(_context.t3, _context.t4), "t5", 10);

            case 10:
              _context.next = 13;
              break;

            case 12:
              return _context.delegateYield(_asyncGeneratorDelegate(_asyncIterator(maximiseGeneric(smallurl)), _awaitAsyncGenerator), "t6", 13);

            case 13:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _getMaximisedCandidates.apply(this, arguments);
  }

  function maximiseGeneric(_x2) {
    return _maximiseGeneric.apply(this, arguments);
  } // Discogs


  function _maximiseGeneric() {
    _maximiseGeneric = _wrapAsyncGenerator( /*#__PURE__*/regenerator.mark(function _callee2(smallurl) {
      var results, i, current;
      return regenerator.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return _awaitAsyncGenerator(new Promise(function (resolve) {
                maxurl(smallurl.href, _objectSpread2(_objectSpread2({}, options), {}, {
                  cb: resolve
                })).catch(function (err) {
                  LOGGER.error('Could not maximise image, maxurl unavailable?', err); // Just return no maximised candidates and proceed as usual.

                  // Just return no maximised candidates and proceed as usual.
                  resolve([]);
                });
              }));

            case 2:
              results = _context2.sent;
              i = 0;

            case 4:
              if (!(i < results.length)) {
                _context2.next = 18;
                break;
              }

              current = results[i]; // Filter out results that will definitely not work

              if (!(current.fake || current.bad || current.likely_broken)) {
                _context2.next = 8;
                break;
              }

              return _context2.abrupt("continue", 15);

            case 8:
              _context2.prev = 8;
              _context2.next = 11;
              return _objectSpread2(_objectSpread2({}, current), {}, {
                url: new URL(current.url)
              });

            case 11:
              _context2.next = 15;
              break;

            case 13:
              _context2.prev = 13;
              _context2.t0 = _context2["catch"](8);

            case 15:
              i++;
              _context2.next = 4;
              break;

            case 18:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[8, 13]]);
    }));
    return _maximiseGeneric.apply(this, arguments);
  }

  IMU_EXCEPTIONS.set('img.discogs.com', /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee3(smallurl) {
      var fullSizeURL;
      return regenerator.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return DiscogsProvider.maximiseImage(smallurl);

            case 2:
              fullSizeURL = _context3.sent;
              return _context3.abrupt("return", [{
                url: fullSizeURL,
                filename: fullSizeURL.pathname.split('/').at(-1),
                headers: {}
              }]);

            case 4:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function (_x3) {
      return _ref.apply(this, arguments);
    };
  }()); // Apple Music

  IMU_EXCEPTIONS.set('*.mzstatic.com', /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee4(smallurl) {
      var results, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, imgGeneric;

      return regenerator.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              // For Apple Music, IMU always returns a PNG, regardless of whether the
              // original source image was PNG or JPEG. When the original image is a JPEG,
              // we want to fetch a JPEG version. Although the PNG is of slightly better
              // quality due to generational loss when a JPEG is re-encoded, the quality
              // loss is so minor that the additional costs of downloading, uploading,
              // and storing the PNG are unjustifiable. See #80.
              results = [];
              _iteratorAbruptCompletion = false;
              _didIteratorError = false;
              _context4.prev = 3;
              _iterator = _asyncIterator(maximiseGeneric(smallurl));

            case 5:
              _context4.next = 7;
              return _iterator.next();

            case 7:
              if (!(_iteratorAbruptCompletion = !(_step = _context4.sent).done)) {
                _context4.next = 14;
                break;
              }

              imgGeneric = _step.value;

              // Assume original file name is penultimate component of pathname, e.g.
              // https://is5-ssl.mzstatic.com/image/thumb/Music124/v4/58/34/98/58349857-55bb-62ae-81d4-4a2726e33528/5060786561909.png/999999999x0w-999.png
              // We're still conservative though, if it's not a JPEG, we won't
              // return the JPEG version
              if (/\.jpe?g$/i.test(imgGeneric.url.pathname.split('/').at(-2))) {
                results.push(_objectSpread2(_objectSpread2({}, imgGeneric), {}, {
                  url: new URL(imgGeneric.url.href.replace(/\.png$/i, '.jpg'))
                }));
              } // Always return the original maximised URL as a backup


              results.push(imgGeneric);

            case 11:
              _iteratorAbruptCompletion = false;
              _context4.next = 5;
              break;

            case 14:
              _context4.next = 20;
              break;

            case 16:
              _context4.prev = 16;
              _context4.t0 = _context4["catch"](3);
              _didIteratorError = true;
              _iteratorError = _context4.t0;

            case 20:
              _context4.prev = 20;
              _context4.prev = 21;

              if (!(_iteratorAbruptCompletion && _iterator.return != null)) {
                _context4.next = 25;
                break;
              }

              _context4.next = 25;
              return _iterator.return();

            case 25:
              _context4.prev = 25;

              if (!_didIteratorError) {
                _context4.next = 28;
                break;
              }

              throw _iteratorError;

            case 28:
              return _context4.finish(25);

            case 29:
              return _context4.finish(20);

            case 30:
              return _context4.abrupt("return", results);

            case 31:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, null, [[3, 16, 20, 30], [21,, 25, 29]]);
    }));

    return function (_x4) {
      return _ref2.apply(this, arguments);
    };
  }()); // IMU has no definitions for 7digital yet, so adding an exception here as a workaround
  // Upstream issue: https://github.com/qsniyg/maxurl/issues/922

  IMU_EXCEPTIONS.set('artwork-cdn.7static.com', /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee5(smallurl) {
      return regenerator.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              return _context5.abrupt("return", ['800', '500', '350'].map(function (size) {
                return {
                  url: new URL(smallurl.href.replace(/_\d+\.jpg$/, "_".concat(size, ".jpg"))),
                  filename: '',
                  headers: {}
                };
              }));

            case 1:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }));

    return function (_x5) {
      return _ref3.apply(this, arguments);
    };
  }());

  function getFilename(url) {
    return decodeURIComponent(url.pathname.split('/').at(-1)) || 'image';
  }

  var _doneImages = /*#__PURE__*/new WeakMap();

  var _lastId = /*#__PURE__*/new WeakMap();

  var _retainOnlyFront = /*#__PURE__*/new WeakSet();

  var _createUniqueFilename = /*#__PURE__*/new WeakSet();

  var _urlAlreadyAdded = /*#__PURE__*/new WeakSet();

  var ImageFetcher = /*#__PURE__*/function () {
    // Monotonically increasing ID to uniquely identify the image. We use this
    // so we can later set the image type.
    function ImageFetcher() {
      _classCallCheck(this, ImageFetcher);

      _classPrivateMethodInitSpec(this, _urlAlreadyAdded);

      _classPrivateMethodInitSpec(this, _createUniqueFilename);

      _classPrivateMethodInitSpec(this, _retainOnlyFront);

      _classPrivateFieldInitSpec(this, _doneImages, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _lastId, {
        writable: true,
        value: 0
      });

      _classPrivateFieldSet(this, _doneImages, new Set());
    }

    _createClass(ImageFetcher, [{
      key: "fetchImages",
      value: function () {
        var _fetchImages = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(url, onlyFront) {
          var provider, result;
          return regenerator.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  if (!_classPrivateMethodGet(this, _urlAlreadyAdded, _urlAlreadyAdded2).call(this, url)) {
                    _context.next = 3;
                    break;
                  }

                  LOGGER.warn("".concat(getFilename(url), " has already been added"));
                  return _context.abrupt("return", {
                    images: []
                  });

                case 3:
                  provider = getProvider(url);

                  if (!provider) {
                    _context.next = 6;
                    break;
                  }

                  return _context.abrupt("return", this.fetchImagesFromProvider(url, provider, onlyFront));

                case 6:
                  _context.next = 8;
                  return this.fetchImageFromURL(url);

                case 8:
                  result = _context.sent;

                  if (result) {
                    _context.next = 11;
                    break;
                  }

                  return _context.abrupt("return", {
                    images: []
                  });

                case 11:
                  return _context.abrupt("return", {
                    images: [result]
                  });

                case 12:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function fetchImages(_x, _x2) {
          return _fetchImages.apply(this, arguments);
        }

        return fetchImages;
      }()
    }, {
      key: "fetchImageFromURL",
      value: function () {
        var _fetchImageFromURL = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(url) {
          var skipMaximisation,
              fetchResult,
              _iteratorAbruptCompletion,
              _didIteratorError,
              _iteratorError,
              _iterator,
              _step,
              maxCandidate,
              candidateName,
              _args2 = arguments;

          return regenerator.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  skipMaximisation = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : false;
                  // Attempt to maximise the image
                  fetchResult = null;

                  if (skipMaximisation) {
                    _context2.next = 45;
                    break;
                  }

                  _iteratorAbruptCompletion = false;
                  _didIteratorError = false;
                  _context2.prev = 5;
                  _iterator = _asyncIterator(getMaximisedCandidates(url));

                case 7:
                  _context2.next = 9;
                  return _iterator.next();

                case 9:
                  if (!(_iteratorAbruptCompletion = !(_step = _context2.sent).done)) {
                    _context2.next = 29;
                    break;
                  }

                  maxCandidate = _step.value;
                  candidateName = maxCandidate.filename || getFilename(maxCandidate.url);

                  if (!_classPrivateMethodGet(this, _urlAlreadyAdded, _urlAlreadyAdded2).call(this, maxCandidate.url)) {
                    _context2.next = 15;
                    break;
                  }

                  LOGGER.warn("".concat(candidateName, " has already been added"));
                  return _context2.abrupt("return");

                case 15:
                  _context2.prev = 15;
                  _context2.next = 18;
                  return this.fetchImageContents(maxCandidate.url, candidateName, maxCandidate.headers);

                case 18:
                  fetchResult = _context2.sent;
                  LOGGER.debug("Maximised ".concat(url.href, " to ").concat(maxCandidate.url.href));
                  return _context2.abrupt("break", 29);

                case 23:
                  _context2.prev = 23;
                  _context2.t0 = _context2["catch"](15);
                  LOGGER.warn("Skipping maximised candidate ".concat(candidateName), _context2.t0);

                case 26:
                  _iteratorAbruptCompletion = false;
                  _context2.next = 7;
                  break;

                case 29:
                  _context2.next = 35;
                  break;

                case 31:
                  _context2.prev = 31;
                  _context2.t1 = _context2["catch"](5);
                  _didIteratorError = true;
                  _iteratorError = _context2.t1;

                case 35:
                  _context2.prev = 35;
                  _context2.prev = 36;

                  if (!(_iteratorAbruptCompletion && _iterator.return != null)) {
                    _context2.next = 40;
                    break;
                  }

                  _context2.next = 40;
                  return _iterator.return();

                case 40:
                  _context2.prev = 40;

                  if (!_didIteratorError) {
                    _context2.next = 43;
                    break;
                  }

                  throw _iteratorError;

                case 43:
                  return _context2.finish(40);

                case 44:
                  return _context2.finish(35);

                case 45:
                  if (fetchResult) {
                    _context2.next = 49;
                    break;
                  }

                  _context2.next = 48;
                  return this.fetchImageContents(url, getFilename(url), {});

                case 48:
                  fetchResult = _context2.sent;

                case 49:
                  _classPrivateFieldGet(this, _doneImages).add(fetchResult.fetchedUrl.href);

                  _classPrivateFieldGet(this, _doneImages).add(fetchResult.requestedUrl.href);

                  _classPrivateFieldGet(this, _doneImages).add(url.href);

                  return _context2.abrupt("return", {
                    content: fetchResult.file,
                    originalUrl: url,
                    maximisedUrl: fetchResult.requestedUrl,
                    fetchedUrl: fetchResult.fetchedUrl,
                    wasMaximised: url.href !== fetchResult.requestedUrl.href,
                    wasRedirected: fetchResult.wasRedirected // We have no idea what the type or comment will be, so leave them
                    // undefined so that a default, if any, can be inserted.

                  });

                case 53:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, this, [[5, 31, 35, 45], [15, 23], [36,, 40, 44]]);
        }));

        function fetchImageFromURL(_x3) {
          return _fetchImageFromURL.apply(this, arguments);
        }

        return fetchImageFromURL;
      }()
    }, {
      key: "fetchImagesFromProvider",
      value: function () {
        var _fetchImagesFromProvider = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee3(url, provider, onlyFront) {
          var images, finalImages, hasMoreImages, fetchResults, _iterator2, _step2, img, result, fetchedImages;

          return regenerator.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  LOGGER.info("Searching for images in ".concat(provider.name, " release\u2026")); // This could throw, assuming caller will catch.

                  _context3.next = 3;
                  return provider.findImages(url, onlyFront);

                case 3:
                  images = _context3.sent;
                  finalImages = onlyFront ? _classPrivateMethodGet(this, _retainOnlyFront, _retainOnlyFront2).call(this, images) : images;
                  hasMoreImages = onlyFront && images.length !== finalImages.length;
                  LOGGER.info("Found ".concat(finalImages.length || 'no', " images in ").concat(provider.name, " release"));
                  fetchResults = [];
                  _iterator2 = _createForOfIteratorHelper(finalImages);
                  _context3.prev = 9;

                  _iterator2.s();

                case 11:
                  if ((_step2 = _iterator2.n()).done) {
                    _context3.next = 30;
                    break;
                  }

                  img = _step2.value;

                  if (!_classPrivateMethodGet(this, _urlAlreadyAdded, _urlAlreadyAdded2).call(this, img.url)) {
                    _context3.next = 16;
                    break;
                  }

                  LOGGER.warn("".concat(getFilename(img.url), " has already been added"));
                  return _context3.abrupt("continue", 28);

                case 16:
                  _context3.prev = 16;
                  _context3.next = 19;
                  return this.fetchImageFromURL(img.url, img.skipMaximisation);

                case 19:
                  result = _context3.sent;

                  if (result) {
                    _context3.next = 22;
                    break;
                  }

                  return _context3.abrupt("continue", 28);

                case 22:
                  fetchResults.push(_objectSpread2(_objectSpread2({}, result), {}, {
                    types: img.types,
                    comment: img.comment
                  }));
                  _context3.next = 28;
                  break;

                case 25:
                  _context3.prev = 25;
                  _context3.t0 = _context3["catch"](16);
                  LOGGER.warn("Skipping ".concat(getFilename(img.url)), _context3.t0);

                case 28:
                  _context3.next = 11;
                  break;

                case 30:
                  _context3.next = 35;
                  break;

                case 32:
                  _context3.prev = 32;
                  _context3.t1 = _context3["catch"](9);

                  _iterator2.e(_context3.t1);

                case 35:
                  _context3.prev = 35;

                  _iterator2.f();

                  return _context3.finish(35);

                case 38:
                  fetchedImages = provider.postprocessImages(fetchResults);

                  if (!hasMoreImages) {
                    // Don't mark the whole provider URL as done if we haven't grabbed
                    // all images.
                    _classPrivateFieldGet(this, _doneImages).add(url.href);
                  } else {
                    LOGGER.warn("Not all images were fetched: ".concat(images.length - finalImages.length, " covers were skipped."));
                  }

                  return _context3.abrupt("return", {
                    containerUrl: url,
                    images: fetchedImages
                  });

                case 41:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3, this, [[9, 32, 35, 38], [16, 25]]);
        }));

        function fetchImagesFromProvider(_x4, _x5, _x6) {
          return _fetchImagesFromProvider.apply(this, arguments);
        }

        return fetchImagesFromProvider;
      }()
    }, {
      key: "fetchImageContents",
      value: function () {
        var _fetchImageContents = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee4(url, fileName, headers) {
          var resp, fetchedUrl, wasRedirected, rawFile, mimeType;
          return regenerator.wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  _context4.next = 2;
                  return gmxhr(url, {
                    responseType: 'blob',
                    headers: headers
                  });

                case 2:
                  resp = _context4.sent;
                  fetchedUrl = new URL(resp.finalUrl);
                  wasRedirected = resp.finalUrl !== url.href;

                  if (wasRedirected) {
                    LOGGER.warn("Followed redirect of ".concat(url.href, " -> ").concat(resp.finalUrl, " while fetching image contents"));
                  }

                  rawFile = new File([resp.response], fileName);
                  _context4.next = 9;
                  return new Promise(function (resolve, reject) {
                    // Adapted from https://github.com/metabrainz/musicbrainz-server/blob/2b00b844f3fe4293fc4ccb9de1c30e3c2ddc95c1/root/static/scripts/edit/MB/CoverArt.js#L139
                    // We can't use MB.CoverArt.validate_file since it's not available
                    // in Greasemonkey unless we use unsafeWindow. However, if we use
                    // unsafeWindow, we get permission errors (probably because we're
                    // sending our functions into another context).
                    var reader = new FileReader(); // istanbul ignore next: Copied from MB.

                    // istanbul ignore next: Copied from MB.
                    reader.addEventListener('load', function () {
                      var Uint32Array = getFromPageContext('Uint32Array');
                      var uint32view = new Uint32Array(reader.result);

                      if ((uint32view[0] & 0x00FFFFFF) === 0x00FFD8FF) {
                        resolve('image/jpeg');
                      } else if (uint32view[0] === 0x38464947) {
                        resolve('image/gif');
                      } else if (uint32view[0] === 0x474E5089) {
                        resolve('image/png');
                      } else if (uint32view[0] === 0x46445025) {
                        resolve('application/pdf');
                      } else {
                        var _resp$responseHeaders;

                        var actualMimeType = (_resp$responseHeaders = resp.responseHeaders.match(/content-type:\s*([^;\s]+)/i)) === null || _resp$responseHeaders === void 0 ? void 0 : _resp$responseHeaders[1];

                        if (actualMimeType !== null && actualMimeType !== void 0 && actualMimeType.startsWith('text/')) {
                          reject(new Error('Expected to receive an image, but received text. Perhaps this provider is not supported yet?'));
                        } else {
                          reject(new Error("Expected \"".concat(fileName, "\" to be an image, but received ").concat(actualMimeType !== null && actualMimeType !== void 0 ? actualMimeType : 'unknown file type', ".")));
                        }
                      }
                    });
                    reader.readAsArrayBuffer(rawFile.slice(0, 4));
                  });

                case 9:
                  mimeType = _context4.sent;
                  return _context4.abrupt("return", {
                    requestedUrl: url,
                    fetchedUrl: fetchedUrl,
                    wasRedirected: wasRedirected,
                    file: new File([resp.response], _classPrivateMethodGet(this, _createUniqueFilename, _createUniqueFilename2).call(this, fileName, mimeType), {
                      type: mimeType
                    })
                  });

                case 11:
                case "end":
                  return _context4.stop();
              }
            }
          }, _callee4, this);
        }));

        function fetchImageContents(_x7, _x8, _x9) {
          return _fetchImageContents.apply(this, arguments);
        }

        return fetchImageContents;
      }()
    }]);

    return ImageFetcher;
  }();

  function _retainOnlyFront2(images) {
    // Return only the front images. If no image with Front type is found
    // in the array, assume the first image is the front one. If there are
    // multiple front images, return them all (e.g. Bandcamp original and
    // square crop).
    var filtered = images.filter(function (img) {
      var _img$types;

      return (_img$types = img.types) === null || _img$types === void 0 ? void 0 : _img$types.includes(ArtworkTypeIDs.Front);
    });
    return filtered.length ? filtered : images.slice(0, 1);
  }

  function _createUniqueFilename2(filename, mimeType) {
    var _this$lastId;

    var filenameWithoutExt = filename.replace(/\.(?:png|jpe?g|gif)$/i, '');
    return "".concat(filenameWithoutExt, ".").concat((_classPrivateFieldSet(this, _lastId, (_this$lastId = +_classPrivateFieldGet(this, _lastId)) + 1), _this$lastId), ".").concat(mimeType.split('/')[1]);
  }

  function _urlAlreadyAdded2(url) {
    return _classPrivateFieldGet(this, _doneImages).has(url.href);
  }

  function enqueueImages(_x) {
    return _enqueueImages.apply(this, arguments);
  }

  function _enqueueImages() {
    _enqueueImages = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(_ref) {
      var images,
          defaultTypes,
          defaultComment,
          _args = arguments;
      return regenerator.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              images = _ref.images;
              defaultTypes = _args.length > 1 && _args[1] !== undefined ? _args[1] : [];
              defaultComment = _args.length > 2 && _args[2] !== undefined ? _args[2] : '';
              _context.next = 5;
              return Promise.all(images.map(function (image) {
                return enqueueImage(image, defaultTypes, defaultComment);
              }));

            case 5:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _enqueueImages.apply(this, arguments);
  }

  function enqueueImage(_x2, _x3, _x4) {
    return _enqueueImage.apply(this, arguments);
  }

  function _enqueueImage() {
    _enqueueImage = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(image, defaultTypes, defaultComment) {
      var _image$types, _image$comment;

      return regenerator.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              dropImage(image.content);
              _context2.next = 3;
              return retryTimes(setImageParameters.bind(null, image.content.name, // Only use the defaults if the specific one is undefined
              (_image$types = image.types) !== null && _image$types !== void 0 ? _image$types : defaultTypes, ((_image$comment = image.comment) !== null && _image$comment !== void 0 ? _image$comment : defaultComment).trim()), 5, 500);

            case 3:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));
    return _enqueueImage.apply(this, arguments);
  }

  function dropImage(imageData) {
    // Fake event to trigger the drop event on the drag'n'drop element
    // Using jQuery because native JS cannot manually trigger such events
    // for security reasons.
    var $ = getFromPageContext('$');
    var dropEvent = $.Event('drop'); // We need to clone the underlying data since we might be running as a
    // content script, meaning that even though we trigger the event through
    // unsafeWindow, the page context may not be able to access the event's
    // properties.

    dropEvent.originalEvent = cloneIntoPageContext({
      dataTransfer: {
        files: [imageData]
      }
    }); // Note that we're using MB's own jQuery here, not a script-local one.
    // We need to reuse MB's own jQuery to be able to trigger the event
    // handler.

    $('#drop-zone').trigger(dropEvent);
  }

  function setImageParameters(imageName, imageTypes, imageComment) {
    // Find the row for this added image. We can't be 100% sure it's the last
    // added image, since another image may have been added in the meantime
    // as we're called asynchronously. We find the correct image via the file
    // name, which is guaranteed to be unique since we embed a unique ID into it.
    var pendingUploadRows = qsa('tbody[data-bind="foreach: files_to_upload"] > tr');
    var fileRow = pendingUploadRows.find(function (row) {
      return qs('.file-info span[data-bind="text: name"]', row).textContent == imageName;
    });
    assertDefined(fileRow, "Could not find image ".concat(imageName, " in queued uploads")); // Set image types

    var checkboxesToCheck = qsa('ul.cover-art-type-checkboxes input[type="checkbox"]', fileRow).filter(function (cbox) {
      return imageTypes.includes(parseInt(cbox.value));
    });
    checkboxesToCheck.forEach(function (cbox) {
      cbox.checked = true;
      cbox.dispatchEvent(new Event('click'));
    }); // Set comment if we should

    if (imageComment) {
      var commentInput = qs('div.comment > input.comment', fileRow);
      commentInput.value = imageComment;
      commentInput.dispatchEvent(new Event('change'));
    }
  }

  function fillEditNote(allFetchedImages, origin, editNote) {
    var totalNumImages = allFetchedImages.reduce(function (acc, fetched) {
      return acc + fetched.images.length;
    }, 0); // Nothing enqueued => Skip edit note altogether

    if (!totalNumImages) return; // Limiting to 3 URLs to reduce noise

    var numFilled = 0;

    var _iterator = _createForOfIteratorHelper(allFetchedImages),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var _step$value = _step.value,
            containerUrl = _step$value.containerUrl,
            images = _step$value.images;
        var prefix = '';

        if (containerUrl) {
          prefix = ' * ';
          editNote.addExtraInfo(decodeURI(containerUrl.href));
        }

        var _iterator2 = _createForOfIteratorHelper(images),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var queuedUrl = _step2.value;
            numFilled += 1;
            if (numFilled > 3) break; // Prevent noise from data: URLs

            if (queuedUrl.maximisedUrl.protocol === 'data:') {
              editNote.addExtraInfo(prefix + 'Uploaded from data URL');
              continue;
            }

            editNote.addExtraInfo(prefix + decodeURI(queuedUrl.originalUrl.href));

            if (queuedUrl.wasMaximised) {
              editNote.addExtraInfo(' '.repeat(prefix.length) + '→ Maximised to ' + decodeURI(queuedUrl.maximisedUrl.href));
            }

            if (queuedUrl.wasRedirected) {
              editNote.addExtraInfo(' '.repeat(prefix.length) + '→ Redirected to ' + decodeURI(queuedUrl.fetchedUrl.href));
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }

        if (numFilled > 3) break;
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    if (totalNumImages > 3) {
      editNote.addExtraInfo("\u2026and ".concat(totalNumImages - 3, " additional image(s)"));
    }

    if (origin) {
      editNote.addExtraInfo("Seeded from ".concat(origin));
    }

    editNote.addFooter();
  }

  var _note = /*#__PURE__*/new WeakMap();

  var _fetcher = /*#__PURE__*/new WeakMap();

  var _ui = /*#__PURE__*/new WeakMap();

  var _urlsInProgress = /*#__PURE__*/new WeakMap();

  var _processURL = /*#__PURE__*/new WeakSet();

  var App = /*#__PURE__*/function () {
    function App() {
      _classCallCheck(this, App);

      _classPrivateMethodInitSpec(this, _processURL);

      _classPrivateFieldInitSpec(this, _note, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _fetcher, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _ui, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _urlsInProgress, {
        writable: true,
        value: void 0
      });

      _defineProperty(this, "onlyFront", false);

      _classPrivateFieldSet(this, _note, EditNote.withFooterFromGMInfo());

      _classPrivateFieldSet(this, _fetcher, new ImageFetcher());

      _classPrivateFieldSet(this, _urlsInProgress, new Set());

      var banner = new StatusBanner();
      LOGGER.addSink(banner);

      _classPrivateFieldSet(this, _ui, new InputForm(banner.htmlElement, this));
    }

    _createClass(App, [{
      key: "processURL",
      value: function () {
        var _processURL3 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(url) {
          return regenerator.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  if (!_classPrivateFieldGet(this, _urlsInProgress).has(url.href)) {
                    _context.next = 2;
                    break;
                  }

                  return _context.abrupt("return");

                case 2:
                  _context.prev = 2;

                  _classPrivateFieldGet(this, _urlsInProgress).add(url.href);

                  _context.next = 6;
                  return _classPrivateMethodGet(this, _processURL, _processURL2).call(this, url);

                case 6:
                  _context.prev = 6;

                  _classPrivateFieldGet(this, _urlsInProgress).delete(url.href);

                  return _context.finish(6);

                case 9:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this, [[2,, 6, 9]]);
        }));

        function processURL(_x) {
          return _processURL3.apply(this, arguments);
        }

        return processURL;
      }()
    }, {
      key: "processSeedingParameters",
      value: function () {
        var _processSeedingParameters = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee3() {
          var _this = this,
              _params$origin;

          var params, fetchResults, _iterator, _step, _step$value, fetchResult, cover, totalNumImages;

          return regenerator.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  params = SeedParameters.decode(new URLSearchParams(document.location.search)); // Although this is very similar to `processURL`, we may have to fetch
                  // and enqueue multiple images. We want to fetch images in parallel, but
                  // enqueue them sequentially to ensure the order stays consistent.
                  // eslint-disable-next-line init-declarations

                  _context3.prev = 1;
                  _context3.next = 4;
                  return Promise.all(params.images.map( /*#__PURE__*/function () {
                    var _ref = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(cover) {
                      return regenerator.wrap(function _callee2$(_context2) {
                        while (1) {
                          switch (_context2.prev = _context2.next) {
                            case 0:
                              _context2.next = 2;
                              return _classPrivateFieldGet(_this, _fetcher).fetchImages(cover.url, _this.onlyFront);

                            case 2:
                              _context2.t0 = _context2.sent;
                              _context2.t1 = cover;
                              return _context2.abrupt("return", [_context2.t0, _context2.t1]);

                            case 5:
                            case "end":
                              return _context2.stop();
                          }
                        }
                      }, _callee2);
                    }));

                    return function (_x2) {
                      return _ref.apply(this, arguments);
                    };
                  }()));

                case 4:
                  fetchResults = _context3.sent;
                  _context3.next = 11;
                  break;

                case 7:
                  _context3.prev = 7;
                  _context3.t0 = _context3["catch"](1);
                  LOGGER.error('Failed to grab images', _context3.t0);
                  return _context3.abrupt("return");

                case 11:
                  // Not using Promise.all to ensure images get added in order.
                  _iterator = _createForOfIteratorHelper(fetchResults);
                  _context3.prev = 12;

                  _iterator.s();

                case 14:
                  if ((_step = _iterator.n()).done) {
                    _context3.next = 26;
                    break;
                  }

                  _step$value = _slicedToArray(_step.value, 2), fetchResult = _step$value[0], cover = _step$value[1];
                  _context3.prev = 16;
                  _context3.next = 19;
                  return enqueueImages(fetchResult, cover.types, cover.comment);

                case 19:
                  _context3.next = 24;
                  break;

                case 21:
                  _context3.prev = 21;
                  _context3.t1 = _context3["catch"](16);
                  LOGGER.error('Failed to enqueue some images', _context3.t1);

                case 24:
                  _context3.next = 14;
                  break;

                case 26:
                  _context3.next = 31;
                  break;

                case 28:
                  _context3.prev = 28;
                  _context3.t2 = _context3["catch"](12);

                  _iterator.e(_context3.t2);

                case 31:
                  _context3.prev = 31;

                  _iterator.f();

                  return _context3.finish(31);

                case 34:
                  fillEditNote(fetchResults.map(function (pair) {
                    return pair[0];
                  }), (_params$origin = params.origin) !== null && _params$origin !== void 0 ? _params$origin : '', _classPrivateFieldGet(this, _note));
                  totalNumImages = fetchResults.reduce(function (acc, pair) {
                    return acc + pair[0].images.length;
                  }, 0);

                  if (totalNumImages) {
                    LOGGER.success("Successfully added ".concat(totalNumImages, " image(s)"));
                  }

                case 37:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3, this, [[1, 7], [12, 28, 31, 34], [16, 21]]);
        }));

        function processSeedingParameters() {
          return _processSeedingParameters.apply(this, arguments);
        }

        return processSeedingParameters;
      }()
    }, {
      key: "addImportButtons",
      value: function () {
        var _addImportButtons = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee4() {
          var _window$location$href,
              _this2 = this;

          var mbid, attachedURLs, supportedURLs;
          return regenerator.wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  mbid = (_window$location$href = window.location.href.match(/musicbrainz\.org\/release\/([a-f0-9-]+)\//)) === null || _window$location$href === void 0 ? void 0 : _window$location$href[1];
                  assertHasValue(mbid);
                  _context4.next = 4;
                  return getURLsForRelease(mbid, {
                    excludeEnded: true,
                    excludeDuplicates: true
                  });

                case 4:
                  attachedURLs = _context4.sent;
                  supportedURLs = attachedURLs.filter(function (url) {
                    var _getProvider;

                    return (_getProvider = getProvider(url)) === null || _getProvider === void 0 ? void 0 : _getProvider.allowButtons;
                  });

                  if (supportedURLs.length) {
                    _context4.next = 8;
                    break;
                  }

                  return _context4.abrupt("return");

                case 8:
                  supportedURLs.forEach(function (url) {
                    var provider = getProvider(url);
                    assertHasValue(provider);

                    _classPrivateFieldGet(_this2, _ui).addImportButton(_this2.processURL.bind(_this2, url), url.href, provider);
                  });

                case 9:
                case "end":
                  return _context4.stop();
              }
            }
          }, _callee4);
        }));

        function addImportButtons() {
          return _addImportButtons.apply(this, arguments);
        }

        return addImportButtons;
      }()
    }]);

    return App;
  }();

  function _processURL2(_x3) {
    return _processURL4.apply(this, arguments);
  }

  function _processURL4() {
    _processURL4 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee5(url) {
      var fetchResult;
      return regenerator.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.prev = 0;
              _context5.next = 3;
              return _classPrivateFieldGet(this, _fetcher).fetchImages(url, this.onlyFront);

            case 3:
              fetchResult = _context5.sent;
              _context5.next = 10;
              break;

            case 6:
              _context5.prev = 6;
              _context5.t0 = _context5["catch"](0);
              LOGGER.error('Failed to grab images', _context5.t0);
              return _context5.abrupt("return");

            case 10:
              _context5.prev = 10;
              _context5.next = 13;
              return enqueueImages(fetchResult);

            case 13:
              _context5.next = 19;
              break;

            case 15:
              _context5.prev = 15;
              _context5.t1 = _context5["catch"](10);
              LOGGER.error('Failed to enqueue images', _context5.t1);
              return _context5.abrupt("return");

            case 19:
              fillEditNote([fetchResult], '', _classPrivateFieldGet(this, _note));

              if (fetchResult.images.length) {
                LOGGER.success("Successfully added ".concat(fetchResult.images.length, " image(s)"));
              }

            case 21:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, this, [[0, 6], [10, 15]]);
    }));
    return _processURL4.apply(this, arguments);
  }

  LOGGER.configure({
    logLevel: LogLevel.INFO
  });
  LOGGER.addSink(new ConsoleSink(USERSCRIPT_NAME));

  function runOnMB() {
    // Initialise the app, which will start listening for pasted URLs.
    // The only reason we're using an app here is so we can easily access the
    // UI and fetcher instances without having to pass them around as
    // parameters.
    var app = new App();
    app.processSeedingParameters();
    app.addImportButtons();
  }

  function runOnSeederPage() {
    var seeder = seederFactory(document.location);

    if (seeder) {
      seeder.insertSeedLinks();
    } else {
      LOGGER.error('Somehow I am running on a page I do not support…');
    }
  }

  if (document.location.hostname === 'musicbrainz.org' || document.location.hostname.endsWith('.musicbrainz.org')) {
    runOnMB();
  } else {
    runOnSeederPage();
  }

})();
