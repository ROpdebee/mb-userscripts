// ==UserScript==
// @name         MB: QoL: Seed the batch recording comments script
// @description  Seed the recording comments for the batch recording comments userscripts with live and DJ-mix data.
// @version      2022.8.8
// @author       ROpdebee
// @license      MIT; https://opensource.org/licenses/MIT
// @namespace    https://github.com/ROpdebee/mb-userscripts
// @homepageURL  https://github.com/ROpdebee/mb-userscripts
// @supportURL   https://github.com/ROpdebee/mb-userscripts/issues
// @downloadURL  https://raw.github.com/ROpdebee/mb-userscripts/dist/mb_qol_seed_recording_disambiguation.user.js
// @updateURL    https://raw.github.com/ROpdebee/mb-userscripts/dist/mb_qol_seed_recording_disambiguation.meta.js
// @include      /^https?://(\w+\.)?musicbrainz\.org/release/[a-f\d-]{36}([?#]|$)/
// @run-at       document-end
// @grant        none
// ==/UserScript==

// For original source code, see https://github.com/ROpdebee/mb-userscripts/tree/main/src/mb_qol_seed_recording_disambiguation
(function () {
    'use strict';

    /* minified: babel helpers, nativejsx, babel-plugin-transform-async-to-promises */
    var appendChildren=function(t,e){(e=Array.isArray(e)?e:[e]).forEach((function(e){e instanceof HTMLElement?t.appendChild(e):(e||"string"==typeof e)&&t.appendChild(document.createTextNode(e.toString()));}));},setStyles=function(t,e){for(const r in e)t.style[r]=e[r];};function ownKeys(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n);}return r}function _objectSpread2(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?ownKeys(Object(r),!0).forEach((function(e){_defineProperty(t,e,r[e]);})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):ownKeys(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e));}));}return t}function _defineProperty(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function _slicedToArray(t,e){return _arrayWithHoles(t)||_iterableToArrayLimit(t,e)||_unsupportedIterableToArray(t,e)||_nonIterableRest()}function _arrayWithHoles(t){if(Array.isArray(t))return t}function _iterableToArrayLimit(t,e){var r=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=r){var n,o,l=[],i=!0,s=!1;try{for(r=r.call(t);!(i=(n=r.next()).done)&&(l.push(n.value),!e||l.length!==e);i=!0);}catch(a){s=!0,o=a;}finally{try{i||null==r.return||r.return();}finally{if(s)throw o}}return l}}function _unsupportedIterableToArray(t,e){if(t){if("string"==typeof t)return _arrayLikeToArray(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);return "Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?_arrayLikeToArray(t,e):void 0}}function _arrayLikeToArray(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}const _Pact=function(){function t(){}return t.prototype.then=function(e,r){const n=new t,o=this.s;if(o){const t=1&o?e:r;if(t){try{_settle(n,1,t(this.v));}catch(l){_settle(n,2,l);}return n}return this}return this.o=function(t){try{const o=t.v;1&t.s?_settle(n,1,e?e(o):o):r?_settle(n,1,r(o)):_settle(n,2,o);}catch(l){_settle(n,2,l);}},n},t}();function _settle(t,e,r){if(!t.s){if(r instanceof _Pact){if(!r.s)return void(r.o=_settle.bind(null,t,e));1&e&&(e=r.s),r=r.v;}if(r&&r.then)return void r.then(_settle.bind(null,t,e),_settle.bind(null,t,2));t.s=e,t.v=r;const n=t.o;n&&n(t);}}function _async(t){return function(){for(var e=[],r=0;r<arguments.length;r++)e[r]=arguments[r];try{return Promise.resolve(t.apply(this,e))}catch(n){return Promise.reject(n)}}}function _await(t,e,r){return r?e?e(t):t:(t&&t.then||(t=Promise.resolve(t)),e?t.then(e):t)}"undefined"==typeof Symbol||Symbol.iterator||(Symbol.iterator=Symbol("Symbol.iterator"));const _asyncIteratorSymbol="undefined"!=typeof Symbol?Symbol.asyncIterator||(Symbol.asyncIterator=Symbol("Symbol.asyncIterator")):"@@asyncIterator",_earlyReturn={};!function(){function t(t){this._entry=t,this._pact=null,this._resolve=null,this._return=null,this._promise=null;}function e(t){return {value:t,done:!0}}function r(t){return {value:t,done:!1}}t.prototype._yield=function(t){return this._resolve(t&&t.then?t.then(r):r(t)),this._pact=new _Pact},t.prototype.next=function(t){const r=this;return r._promise=new Promise((function(n){const o=r._pact;if(null===o){const s=r._entry;if(null===s)return n(r._promise);function l(t){r._resolve(t&&t.then?t.then(e):e(t)),r._pact=null,r._resolve=null;}r._entry=null,r._resolve=n;var i=s(r);i&&i.then?i.then(l,(function(t){if(t===_earlyReturn)l(r._return);else {const e=new _Pact;r._resolve(e),r._pact=null,r._resolve=null,_resolve(e,2,t);}})):l(i);}else r._pact=null,r._resolve=n,_settle(o,1,t);}))},t.prototype.return=function(t){const r=this;return r._promise=new Promise((function(n){const o=r._pact;if(null===o)return null===r._entry?n(r._promise):(r._entry=null,n(t&&t.then?t.then(e):e(t)));r._return=t,r._resolve=n,r._pact=null,_settle(o,2,_earlyReturn);}))},t.prototype.throw=function(t){const e=this;return e._promise=new Promise((function(r,n){const o=e._pact;if(null===o)return null===e._entry?r(e._promise):(e._entry=null,n(t));e._resolve=r,e._pact=null,_settle(o,2,t);}))},t.prototype[_asyncIteratorSymbol]=function(){return this};}();

    /* minified: lib */
    class ConsoleSink{constructor(e){_defineProperty(this,"scriptName",void 0),_defineProperty(this,"onSuccess",this.onInfo.bind(this)),this.scriptName=e;}formatMessage(e){return "[".concat(this.scriptName,"] ").concat(e)}onDebug(e){console.debug(this.formatMessage(e));}onLog(e){console.log(this.formatMessage(e));}onInfo(e){console.info(this.formatMessage(e));}onWarn(e,t){e=this.formatMessage(e),t?console.warn(e,t):console.warn(e);}onError(e,t){e=this.formatMessage(e),t?console.error(e,t):console.error(e);}}let LogLevel;!function(e){e[e.DEBUG=0]="DEBUG",e[e.LOG=1]="LOG",e[e.INFO=2]="INFO",e[e.SUCCESS=3]="SUCCESS",e[e.WARNING=4]="WARNING",e[e.ERROR=5]="ERROR";}(LogLevel||(LogLevel={}));const HANDLER_NAMES={[LogLevel.DEBUG]:"onDebug",[LogLevel.LOG]:"onLog",[LogLevel.INFO]:"onInfo",[LogLevel.SUCCESS]:"onSuccess",[LogLevel.WARNING]:"onWarn",[LogLevel.ERROR]:"onError"},DEFAULT_OPTIONS={logLevel:LogLevel.INFO,sinks:[]};class Logger{constructor(e){_defineProperty(this,"_configuration",void 0),this._configuration=_objectSpread2(_objectSpread2({},DEFAULT_OPTIONS),e);}fireHandlers(e,t,n){e<this._configuration.logLevel||this._configuration.sinks.forEach((o=>{const r=o[HANDLER_NAMES[e]];r&&(n?r.call(o,t,n):r.call(o,t));}));}debug(e){this.fireHandlers(LogLevel.DEBUG,e);}log(e){this.fireHandlers(LogLevel.LOG,e);}info(e){this.fireHandlers(LogLevel.INFO,e);}success(e){this.fireHandlers(LogLevel.SUCCESS,e);}warn(e,t){this.fireHandlers(LogLevel.WARNING,e,t);}error(e,t){this.fireHandlers(LogLevel.ERROR,e,t);}configure(e){Object.assign(this._configuration,e);}get configuration(){return this._configuration}addSink(e){this._configuration.sinks.push(e);}}const LOGGER=new Logger;var USERSCRIPT_ID="mb_qol_seed_recording_disambiguation";function existsInGM(e){return "undefined"!=typeof GM&&void 0!==GM[e]}const GMinfo=existsInGM("info")?GM.info:GM_info;function filterNonNull(e){return e.filter((e=>!(null==e)))}function logFailure(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"An error occurred";e.catch((e=>{LOGGER.error(t,e);}));}class AssertionError extends Error{}function assert(e,t){if(!e)throw new AssertionError(null!=t?t:"Assertion failed")}function assertNonNull(e,t){assert(null!==e,null!=t?t:"Assertion failed: Expected value to be non-null");}function qs(e,t){const n=qsMaybe(e,t);return assertNonNull(n,"Could not find required element"),n}function qsMaybe(e,t){return (null!=t?t:document).querySelector(e)}function onDocumentLoaded(e){"loading"!==document.readyState?e():document.addEventListener("DOMContentLoaded",e);}function insertStylesheet(e,t){if(void 0===t&&(t="ROpdebee_".concat(USERSCRIPT_ID,"_css")),null!==qsMaybe("style#".concat(t)))return;const n=function(){var n=document.createElement("style");return n.setAttribute("id",t),appendChildren(n,e),n}.call(this);document.head.insertAdjacentElement("beforeend",n);}function parseVersion(e){return e.split(".").map((e=>parseInt(e)))}function versionLessThan(e,t){let n=0;for(;n<e.length&&n<t.length;){if(e[n]<t[n])return !0;if(e[n]>t[n])return !1;n++;}return e.length<t.length}var CHANGELOG_URL="https://github.com/ROpdebee/mb-userscripts/blob/dist/mb_qol_seed_recording_disambiguation.changelog.md",USERSCRIPT_FEATURE_HISTORY=[],css_248z=".ROpdebee_feature_list{font-weight:300;margin:0 auto;width:-moz-fit-content;width:fit-content}.ROpdebee_feature_list ul{margin:6px 28px 0 0;text-align:left}";const LAST_DISPLAYED_KEY="ROpdebee_".concat(USERSCRIPT_ID,"_last_notified_update");function maybeDisplayNewFeatures(){const e=localStorage.getItem(LAST_DISPLAYED_KEY),t=GM.info.script;if(!e)return void localStorage.setItem(LAST_DISPLAYED_KEY,t.version);const n=parseVersion(e),o=USERSCRIPT_FEATURE_HISTORY.filter((e=>versionLessThan(n,parseVersion(e.versionAdded))));0!==o.length&&showFeatureNotification(t.name,t.version,o.map((e=>e.description)));}function showFeatureNotification(e,t,n){insertStylesheet(css_248z,"ROpdebee_Update_Banner");const o=function(){var r=document.createElement("div");r.setAttribute("class","banner warning-header");var s=document.createElement("p");r.appendChild(s),appendChildren(s,"".concat(e," was updated to v").concat(t,"! "));var i=document.createElement("a");i.setAttribute("href",CHANGELOG_URL),s.appendChild(i);var a=document.createTextNode("See full changelog here");i.appendChild(a),appendChildren(s,". New features since last update:");var l=document.createElement("div");l.setAttribute("class","ROpdebee_feature_list"),r.appendChild(l);var c=document.createElement("ul");l.appendChild(c),appendChildren(c,n.map((e=>function(){var t=document.createElement("li");return appendChildren(t,e),t}.call(this))));var d=document.createElement("button");return d.setAttribute("class","dismiss-banner remove-item icon"),d.setAttribute("data-banner-name","alert"),d.setAttribute("type","button"),d.addEventListener("click",(()=>{o.remove(),localStorage.setItem(LAST_DISPLAYED_KEY,GM.info.script.version);})),r.appendChild(d),r}.call(this);qs("#page").insertAdjacentElement("beforebegin",o);}

    LOGGER.configure({
        logLevel: LogLevel.INFO,
    });
    LOGGER.addSink(new ConsoleSink(USERSCRIPT_ID));

    if (document.location.hostname === 'musicbrainz.org' || document.location.hostname.endsWith('.musicbrainz.org')) {
        onDocumentLoaded(maybeDisplayNewFeatures);
    }

    const seedLive = _async(function () {
        return _await(getRecordingRels(document.location.pathname.split('/')[2]), function (relInfo) {
            const recComments = relInfo.mediums.flatMap(medium => medium.tracks.map(track => createTrackLiveComment(track, medium, relInfo)));
            const uniqueComments = [...new Set(recComments.map(_ref => {
                    let _ref2 = _slicedToArray(_ref, 2), comment = _ref2[1];
                    return comment;
                }))];
            if (uniqueComments.length === 1) {
                fillInput(qs('input#all-recording-comments'), uniqueComments[0]);
            } else {
                recComments.forEach(_ref3 => {
                    let _ref4 = _slicedToArray(_ref3, 2), trackGid = _ref4[0], comment = _ref4[1];
                    fillInput(qs('tr[id="'.concat(trackGid, '"] input.recording-comment')), comment);
                });
            }
            fillInput(qs('textarea#recording-comments-edit-note'), ''.concat(GMinfo.script.name, ' v').concat(GMinfo.script.version, ': Seed live comments'));
        });
    });
    const getRecordingRels = _async(function (relGid) {
        return _await(fetch(''.concat(document.location.origin, '/ws/js/release/').concat(relGid, '?inc=rels recordings')), function (resp) {
            return resp.json();
        });
    });
    class ConflictError extends Error {
    }
    function unicodeToAscii(s) {
        return s.replace(/[“”″]/g, '"').replace(/[‘’′]/g, '\'').replace(/[‐‒–]/g, '-');
    }
    function getReleaseTitle() {
        return document.querySelector('.releaseheader > h1 bdi').textContent;
    }
    function getDJMixComment() {
        return 'part of \u201C'.concat(getReleaseTitle(), '\u201D DJ\u2010mix');
    }
    function stringifyDate(date) {
        const year = date.year ? date.year.toString().padStart(4, '0') : '????';
        const month = date.month ? date.month.toString().padStart(2, '0') : '??';
        const day = date.day ? date.day.toString().padStart(2, '0') : '??';
        return [
            year,
            month,
            day
        ].join('\u2010').replace(/(?:‐\?{2}){1,2}$/, '');
    }
    function getDateStr(rel) {
        if (!rel.begin_date || !rel.end_date)
            return null;
        const _map = [
                rel.begin_date,
                rel.end_date
            ].map(date => stringifyDate(date)), _map2 = _slicedToArray(_map, 2), beginStr = _map2[0], endStr = _map2[1];
        if (beginStr === '????' || endStr === '????')
            return null;
        return beginStr === endStr ? beginStr : ''.concat(beginStr, '\u2013').concat(endStr);
    }
    function selectCommentPart(candidates, partName) {
        if (candidates.size === 0)
            return null;
        if (candidates.size > 1) {
            throw new ConflictError('Conflicting '.concat(partName, ': ').concat([...candidates].join(' vs. ')));
        }
        return candidates.values().next().value;
    }
    function filterRels(rels, linkTypeID) {
        return rels.filter(rel => rel.linkTypeID === linkTypeID);
    }
    function getRecordingVenue(rels) {
        const venuesFormatted = new Set(filterRels(rels, 693).map(placeRel => formatRecordingVenue(placeRel)));
        return selectCommentPart(venuesFormatted, '\u201Crecorded at\u201D ARs');
    }
    function getRecordingArea(rels) {
        const areasFormatted = new Set(filterRels(rels, 698).map(areaRel => formatRecordingArea(areaRel)));
        return selectCommentPart(areasFormatted, '\u201Crecorded in\u201D ARs');
    }
    function formatRecordingVenue(placeRel) {
        return (placeRel.entity0_credit || placeRel.target.name) + ', ' + formatRecordingBareArea(placeRel.target.area);
    }
    function formatRecordingArea(areaRel) {
        return formatRecordingBareArea(areaRel.target);
    }
    function formatRecordingBareArea(area) {
        var _state, _state2, _state2$primary_code, _city;
        const areaList = [
            area,
            ...area.containment
        ];
        let city = null;
        let country = null;
        let state = null;
        for (let i = areaList.length - 1; i >= 0; i--) {
            const areaPart = areaList[i];
            switch (areaPart.typeID) {
            case 1:
                country = areaPart;
                break;
            case 2:
                state = (_state = state) !== null && _state !== void 0 ? _state : areaPart;
                break;
            case 3:
            case 4:
                city = areaPart;
                break;
            }
        }
        if (!country || ![
                'US',
                'CA'
            ].includes(country.country_code)) {
            state = null;
        }
        let countryName;
        if (!country)
            countryName = null;
        else if (country.primary_code === 'US')
            countryName = 'USA';
        else if (country.primary_code === 'GB')
            countryName = 'UK';
        else
            countryName = country.name;
        const stateName = (_state2 = state) === null || _state2 === void 0 ? void 0 : (_state2$primary_code = _state2.primary_code) === null || _state2$primary_code === void 0 ? void 0 : _state2$primary_code.split('-')[1];
        const cityName = ((_city = city) === null || _city === void 0 ? void 0 : _city.name) || stateName === 'DC' && 'Washington';
        const parts = [
            cityName,
            stateName,
            countryName
        ].filter(Boolean);
        return parts.join(', ');
    }
    function getRecordingDate(rels) {
        const dateStrs = new Set(filterNonNull(rels.filter(rel => [
            698,
            693,
            278
        ].includes(rel.linkTypeID)).map(rel => getDateStr(rel))));
        return selectCommentPart(dateStrs, 'recording dates');
    }
    function getRecordingLiveComment(rec) {
        var _getRecordingVenue;
        const rels = rec.relationships;
        const place = (_getRecordingVenue = getRecordingVenue(rels)) !== null && _getRecordingVenue !== void 0 ? _getRecordingVenue : getRecordingArea(rels);
        const date = getRecordingDate(rels);
        let comment = 'live';
        if (date)
            comment += ', ' + date;
        if (place)
            comment += ': ' + place;
        return comment;
    }
    function isLiveRecording(rec, releaseGroup) {
        const recordingRelationships = filterRels(rec.relationships, 278);
        if (recordingRelationships.length > 0) {
            return recordingRelationships.some(recRel => {
                var _recRel$attributes;
                return ((_recRel$attributes = recRel.attributes) !== null && _recRel$attributes !== void 0 ? _recRel$attributes : []).find(attr => attr.typeID === 578);
            });
        } else {
            var _releaseGroup$seconda;
            return ((_releaseGroup$seconda = releaseGroup.secondaryTypeIDs) !== null && _releaseGroup$seconda !== void 0 ? _releaseGroup$seconda : []).includes(6);
        }
    }
    function fillInput(input, value) {
        input.value = value;
        input.dispatchEvent(new Event('input'));
        input.dispatchEvent(new Event('input.rc'));
    }
    function seedDJMix() {
        fillInput(qs('input#all-recording-comments'), getDJMixComment());
        fillInput(qs('textarea#recording-comments-edit-note'), ''.concat(GMinfo.script.name, ' v').concat(GMinfo.script.version, ': Seed DJ\u2010mix comments'));
    }
    function displayWarning(msg) {
        const warnList = qs('#ROpdebee_seed_comments_warnings');
        warnList.append(function () {
            var $$a = document.createElement('li');
            appendChildren($$a, msg);
            return $$a;
        }.call(this));
        warnList.closest('tr').style.display = '';
    }
    function createTrackLiveComment(track, medium, releaseInfo) {
        const rec = track.recording;
        if (!isLiveRecording(rec, releaseInfo.releaseGroup)) {
            displayWarning('Skipping track #'.concat(medium.position, '.').concat(track.number, ': Not a live recording'));
            return [
                track.gid,
                rec.comment
            ];
        }
        const existing = unicodeToAscii(rec.comment.trim());
        try {
            const newComment = getRecordingLiveComment(rec);
            if (existing && existing !== 'live' && existing !== unicodeToAscii(newComment)) {
                throw new ConflictError('Significant differences between old and new comments: '.concat(existing, ' vs ').concat(newComment));
            }
            return [
                track.gid,
                newComment
            ];
        } catch (err) {
            if (!(err instanceof ConflictError))
                throw err;
            displayWarning('Track #'.concat(medium.position, '.').concat(track.number, ': Refusing to update comment: ').concat(err.message));
            return [
                track.gid,
                rec.comment
            ];
        }
    }
    function insertButtons() {
        const tr = qsMaybe('table#set-recording-comments tr');
        if (tr === null) {
            setTimeout(insertButtons, 500);
            return;
        }
        const liveButton = function () {
            var $$c = document.createElement('button');
            $$c.setAttribute('id', 'ROpdebee_seed_comments_live');
            $$c.setAttribute('class', 'btn-link');
            $$c.setAttribute('type', 'button');
            $$c.addEventListener('click', () => {
                logFailure(seedLive());
            });
            var $$d = document.createTextNode('Live');
            $$c.appendChild($$d);
            return $$c;
        }.call(this);
        const djButton = function () {
            var $$e = document.createElement('button');
            $$e.setAttribute('id', 'ROpdebee_seed_comments_djmix');
            $$e.setAttribute('class', 'btn-link');
            $$e.setAttribute('type', 'button');
            $$e.addEventListener('click', seedDJMix);
            var $$f = document.createTextNode('DJ\u2010mix');
            $$e.appendChild($$f);
            return $$e;
        }.call(this);
        tr.after(function () {
            var $$g = document.createElement('tr');
            var $$h = document.createElement('td');
            $$g.appendChild($$h);
            var $$i = document.createTextNode('Seed recording comments:');
            $$h.appendChild($$i);
            var $$j = document.createElement('td');
            $$g.appendChild($$j);
            appendChildren($$j, liveButton);
            var $$l = document.createTextNode(' | ');
            $$j.appendChild($$l);
            appendChildren($$j, djButton);
            return $$g;
        }.call(this), function () {
            var $$n = document.createElement('tr');
            setStyles($$n, { display: 'none' });
            var $$o = document.createElement('td');
            $$n.appendChild($$o);
            var $$p = document.createTextNode('Warnings');
            $$o.appendChild($$p);
            var $$q = document.createElement('td');
            $$n.appendChild($$q);
            var $$r = document.createElement('ul');
            $$r.setAttribute('id', 'ROpdebee_seed_comments_warnings');
            setStyles($$r, { color: 'red' });
            $$q.appendChild($$r);
            return $$n;
        }.call(this));
    }
    insertButtons();

})();
