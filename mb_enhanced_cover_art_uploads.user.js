// ==UserScript==
// @name         MB: Enhanced Cover Art Uploads
// @description  Enhance the cover art uploader! Upload directly from a URL, automatically import covers from Discogs/Spotify/Apple Music/..., automatically retrieve the largest version, and more!
// @version      2021.10.18
// @author       ROpdebee
// @license      MIT; https://opensource.org/licenses/MIT
// @namespace    https://github.com/ROpdebee/mb-userscripts
// @homepageURL  https://github.com/ROpdebee/mb-userscripts
// @supportURL   https://github.com/ROpdebee/mb-userscripts/issues
// @downloadURL  https://raw.github.com/ROpdebee/mb-userscripts/dist/mb_enhanced_cover_art_uploads.user.js
// @updateURL    https://raw.github.com/ROpdebee/mb-userscripts/dist/mb_enhanced_cover_art_uploads.meta.js
// @match        *://*.musicbrainz.org/release/*/add-cover-art
// @match        *://atisket.pulsewidth.org.uk/*
// @exclude      *://atisket.pulsewidth.org.uk/
// @require      https://github.com/qsniyg/maxurl/blob/563626fe3b7c5ed3f6dc19d90a356746c68b5b4b/userscript.user.js?raw=true
// @resource     amazonFavicon https://www.amazon.com/favicon.ico
// @run-at       document-load
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_getResourceURL
// @connect      *
// ==/UserScript==

(function () {
  'use strict';

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);

      if (enumerableOnly) {
        symbols = symbols.filter(function (sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
      }

      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _asyncIterator(iterable) {
    var method;

    if (typeof Symbol !== "undefined") {
      if (Symbol.asyncIterator) method = iterable[Symbol.asyncIterator];
      if (method == null && Symbol.iterator) method = iterable[Symbol.iterator];
    }

    if (method == null) method = iterable["@@asyncIterator"];
    if (method == null) method = iterable["@@iterator"];
    if (method == null) throw new TypeError("Object is not async iterable");
    return method.call(iterable);
  }

  function _AwaitValue(value) {
    this.wrapped = value;
  }

  function _AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;
        var wrappedAwait = value instanceof _AwaitValue;
        Promise.resolve(wrappedAwait ? value.wrapped : value).then(function (arg) {
          if (wrappedAwait) {
            resume(key === "return" ? "return" : "next", arg);
            return;
          }

          settle(result.done ? "return" : "normal", arg);
        }, function (err) {
          resume("throw", err);
        });
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  _AsyncGenerator.prototype[typeof Symbol === "function" && Symbol.asyncIterator || "@@asyncIterator"] = function () {
    return this;
  };

  _AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  _AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  _AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  function _wrapAsyncGenerator(fn) {
    return function () {
      return new _AsyncGenerator(fn.apply(this, arguments));
    };
  }

  function _awaitAsyncGenerator(value) {
    return new _AwaitValue(value);
  }

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _construct(Parent, args, Class) {
    if (_isNativeReflectConstruct()) {
      _construct = Reflect.construct;
    } else {
      _construct = function _construct(Parent, args, Class) {
        var a = [null];
        a.push.apply(a, args);
        var Constructor = Function.bind.apply(Parent, a);
        var instance = new Constructor();
        if (Class) _setPrototypeOf(instance, Class.prototype);
        return instance;
      };
    }

    return _construct.apply(null, arguments);
  }

  function _isNativeFunction(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
  }

  function _wrapNativeSuper(Class) {
    var _cache = typeof Map === "function" ? new Map() : undefined;

    _wrapNativeSuper = function _wrapNativeSuper(Class) {
      if (Class === null || !_isNativeFunction(Class)) return Class;

      if (typeof Class !== "function") {
        throw new TypeError("Super expression must either be null or a function");
      }

      if (typeof _cache !== "undefined") {
        if (_cache.has(Class)) return _cache.get(Class);

        _cache.set(Class, Wrapper);
      }

      function Wrapper() {
        return _construct(Class, arguments, _getPrototypeOf(this).constructor);
      }

      Wrapper.prototype = Object.create(Class.prototype, {
        constructor: {
          value: Wrapper,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      return _setPrototypeOf(Wrapper, Class);
    };

    return _wrapNativeSuper(Class);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    } else if (call !== void 0) {
      throw new TypeError("Derived constructors may only return object or undefined");
    }

    return _assertThisInitialized(self);
  }

  function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();

    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived),
          result;

      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;

        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }

      return _possibleConstructorReturn(this, result);
    };
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _toArray(arr) {
    return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest();
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
  }

  function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;

    var _s, _e;

    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];

    if (!it) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;

        var F = function () {};

        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var normalCompletion = true,
        didErr = false,
        err;
    return {
      s: function () {
        it = it.call(o);
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  function _classPrivateFieldGet(receiver, privateMap) {
    var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get");

    return _classApplyDescriptorGet(receiver, descriptor);
  }

  function _classPrivateFieldSet(receiver, privateMap, value) {
    var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set");

    _classApplyDescriptorSet(receiver, descriptor, value);

    return value;
  }

  function _classExtractFieldDescriptor(receiver, privateMap, action) {
    if (!privateMap.has(receiver)) {
      throw new TypeError("attempted to " + action + " private field on non-instance");
    }

    return privateMap.get(receiver);
  }

  function _classApplyDescriptorGet(receiver, descriptor) {
    if (descriptor.get) {
      return descriptor.get.call(receiver);
    }

    return descriptor.value;
  }

  function _classApplyDescriptorSet(receiver, descriptor, value) {
    if (descriptor.set) {
      descriptor.set.call(receiver, value);
    } else {
      if (!descriptor.writable) {
        throw new TypeError("attempted to set read only private field");
      }

      descriptor.value = value;
    }
  }

  function _classPrivateMethodGet(receiver, privateSet, fn) {
    if (!privateSet.has(receiver)) {
      throw new TypeError("attempted to get private field on non-instance");
    }

    return fn;
  }

  function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) {
      throw new TypeError("Cannot initialize the same private elements twice on an object");
    }
  }

  function _classPrivateFieldInitSpec(obj, privateMap, value) {
    _checkPrivateRedeclaration(obj, privateMap);

    privateMap.set(obj, value);
  }

  function _classPrivateMethodInitSpec(obj, privateSet) {
    _checkPrivateRedeclaration(obj, privateSet);

    privateSet.add(obj);
  }

  var runtime = {exports: {}};

  (function (module) {
    var runtime = function (exports) {

      var Op = Object.prototype;
      var hasOwn = Op.hasOwnProperty;
      var undefined$1; // More compressible than void 0.

      var $Symbol = typeof Symbol === "function" ? Symbol : {};
      var iteratorSymbol = $Symbol.iterator || "@@iterator";
      var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
      var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

      function define(obj, key, value) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
        return obj[key];
      }

      try {
        // IE 8 has a broken Object.defineProperty that only works on DOM objects.
        define({}, "");
      } catch (err) {
        define = function define(obj, key, value) {
          return obj[key] = value;
        };
      }

      function wrap(innerFn, outerFn, self, tryLocsList) {
        // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
        var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
        var generator = Object.create(protoGenerator.prototype);
        var context = new Context(tryLocsList || []); // The ._invoke method unifies the implementations of the .next,
        // .throw, and .return methods.

        generator._invoke = makeInvokeMethod(innerFn, self, context);
        return generator;
      }

      exports.wrap = wrap; // Try/catch helper to minimize deoptimizations. Returns a completion
      // record like context.tryEntries[i].completion. This interface could
      // have been (and was previously) designed to take a closure to be
      // invoked without arguments, but in all the cases we care about we
      // already have an existing method we want to call, so there's no need
      // to create a new function object. We can even get away with assuming
      // the method takes exactly one argument, since that happens to be true
      // in every case, so we don't have to touch the arguments object. The
      // only additional allocation required is the completion record, which
      // has a stable shape and so hopefully should be cheap to allocate.

      function tryCatch(fn, obj, arg) {
        try {
          return {
            type: "normal",
            arg: fn.call(obj, arg)
          };
        } catch (err) {
          return {
            type: "throw",
            arg: err
          };
        }
      }

      var GenStateSuspendedStart = "suspendedStart";
      var GenStateSuspendedYield = "suspendedYield";
      var GenStateExecuting = "executing";
      var GenStateCompleted = "completed"; // Returning this object from the innerFn has the same effect as
      // breaking out of the dispatch switch statement.

      var ContinueSentinel = {}; // Dummy constructor functions that we use as the .constructor and
      // .constructor.prototype properties for functions that return Generator
      // objects. For full spec compliance, you may wish to configure your
      // minifier not to mangle the names of these two functions.

      function Generator() {}

      function GeneratorFunction() {}

      function GeneratorFunctionPrototype() {} // This is a polyfill for %IteratorPrototype% for environments that
      // don't natively support it.


      var IteratorPrototype = {};
      define(IteratorPrototype, iteratorSymbol, function () {
        return this;
      });
      var getProto = Object.getPrototypeOf;
      var NativeIteratorPrototype = getProto && getProto(getProto(values([])));

      if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
        // This environment has a native %IteratorPrototype%; use it instead
        // of the polyfill.
        IteratorPrototype = NativeIteratorPrototype;
      }

      var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
      GeneratorFunction.prototype = GeneratorFunctionPrototype;
      define(Gp, "constructor", GeneratorFunctionPrototype);
      define(GeneratorFunctionPrototype, "constructor", GeneratorFunction);
      GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"); // Helper for defining the .next, .throw, and .return methods of the
      // Iterator interface in terms of a single ._invoke method.

      function defineIteratorMethods(prototype) {
        ["next", "throw", "return"].forEach(function (method) {
          define(prototype, method, function (arg) {
            return this._invoke(method, arg);
          });
        });
      }

      exports.isGeneratorFunction = function (genFun) {
        var ctor = typeof genFun === "function" && genFun.constructor;
        return ctor ? ctor === GeneratorFunction || // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
      };

      exports.mark = function (genFun) {
        if (Object.setPrototypeOf) {
          Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
        } else {
          genFun.__proto__ = GeneratorFunctionPrototype;
          define(genFun, toStringTagSymbol, "GeneratorFunction");
        }

        genFun.prototype = Object.create(Gp);
        return genFun;
      }; // Within the body of any async function, `await x` is transformed to
      // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
      // `hasOwn.call(value, "__await")` to determine if the yielded value is
      // meant to be awaited.


      exports.awrap = function (arg) {
        return {
          __await: arg
        };
      };

      function AsyncIterator(generator, PromiseImpl) {
        function invoke(method, arg, resolve, reject) {
          var record = tryCatch(generator[method], generator, arg);

          if (record.type === "throw") {
            reject(record.arg);
          } else {
            var result = record.arg;
            var value = result.value;

            if (value && _typeof(value) === "object" && hasOwn.call(value, "__await")) {
              return PromiseImpl.resolve(value.__await).then(function (value) {
                invoke("next", value, resolve, reject);
              }, function (err) {
                invoke("throw", err, resolve, reject);
              });
            }

            return PromiseImpl.resolve(value).then(function (unwrapped) {
              // When a yielded Promise is resolved, its final value becomes
              // the .value of the Promise<{value,done}> result for the
              // current iteration.
              result.value = unwrapped;
              resolve(result);
            }, function (error) {
              // If a rejected Promise was yielded, throw the rejection back
              // into the async generator function so it can be handled there.
              return invoke("throw", error, resolve, reject);
            });
          }
        }

        var previousPromise;

        function enqueue(method, arg) {
          function callInvokeWithMethodAndArg() {
            return new PromiseImpl(function (resolve, reject) {
              invoke(method, arg, resolve, reject);
            });
          }

          return previousPromise = // If enqueue has been called before, then we want to wait until
          // all previous Promises have been resolved before calling invoke,
          // so that results are always delivered in the correct order. If
          // enqueue has not been called before, then it is important to
          // call invoke immediately, without waiting on a callback to fire,
          // so that the async generator function has the opportunity to do
          // any necessary setup in a predictable way. This predictability
          // is why the Promise constructor synchronously invokes its
          // executor callback, and why async functions synchronously
          // execute code before the first await. Since we implement simple
          // async functions in terms of async generators, it is especially
          // important to get this right, even though it requires care.
          previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
        } // Define the unified helper method that is used to implement .next,
        // .throw, and .return (see defineIteratorMethods).


        this._invoke = enqueue;
      }

      defineIteratorMethods(AsyncIterator.prototype);
      define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
        return this;
      });
      exports.AsyncIterator = AsyncIterator; // Note that simple async functions are implemented on top of
      // AsyncIterator objects; they just return a Promise for the value of
      // the final result produced by the iterator.

      exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
        if (PromiseImpl === void 0) PromiseImpl = Promise;
        var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
        return exports.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
        : iter.next().then(function (result) {
          return result.done ? result.value : iter.next();
        });
      };

      function makeInvokeMethod(innerFn, self, context) {
        var state = GenStateSuspendedStart;
        return function invoke(method, arg) {
          if (state === GenStateExecuting) {
            throw new Error("Generator is already running");
          }

          if (state === GenStateCompleted) {
            if (method === "throw") {
              throw arg;
            } // Be forgiving, per 25.3.3.3.3 of the spec:
            // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume


            return doneResult();
          }

          context.method = method;
          context.arg = arg;

          while (true) {
            var delegate = context.delegate;

            if (delegate) {
              var delegateResult = maybeInvokeDelegate(delegate, context);

              if (delegateResult) {
                if (delegateResult === ContinueSentinel) continue;
                return delegateResult;
              }
            }

            if (context.method === "next") {
              // Setting context._sent for legacy support of Babel's
              // function.sent implementation.
              context.sent = context._sent = context.arg;
            } else if (context.method === "throw") {
              if (state === GenStateSuspendedStart) {
                state = GenStateCompleted;
                throw context.arg;
              }

              context.dispatchException(context.arg);
            } else if (context.method === "return") {
              context.abrupt("return", context.arg);
            }

            state = GenStateExecuting;
            var record = tryCatch(innerFn, self, context);

            if (record.type === "normal") {
              // If an exception is thrown from innerFn, we leave state ===
              // GenStateExecuting and loop back for another invocation.
              state = context.done ? GenStateCompleted : GenStateSuspendedYield;

              if (record.arg === ContinueSentinel) {
                continue;
              }

              return {
                value: record.arg,
                done: context.done
              };
            } else if (record.type === "throw") {
              state = GenStateCompleted; // Dispatch the exception by looping back around to the
              // context.dispatchException(context.arg) call above.

              context.method = "throw";
              context.arg = record.arg;
            }
          }
        };
      } // Call delegate.iterator[context.method](context.arg) and handle the
      // result, either by returning a { value, done } result from the
      // delegate iterator, or by modifying context.method and context.arg,
      // setting context.delegate to null, and returning the ContinueSentinel.


      function maybeInvokeDelegate(delegate, context) {
        var method = delegate.iterator[context.method];

        if (method === undefined$1) {
          // A .throw or .return when the delegate iterator has no .throw
          // method always terminates the yield* loop.
          context.delegate = null;

          if (context.method === "throw") {
            // Note: ["return"] must be used for ES3 parsing compatibility.
            if (delegate.iterator["return"]) {
              // If the delegate iterator has a return method, give it a
              // chance to clean up.
              context.method = "return";
              context.arg = undefined$1;
              maybeInvokeDelegate(delegate, context);

              if (context.method === "throw") {
                // If maybeInvokeDelegate(context) changed context.method from
                // "return" to "throw", let that override the TypeError below.
                return ContinueSentinel;
              }
            }

            context.method = "throw";
            context.arg = new TypeError("The iterator does not provide a 'throw' method");
          }

          return ContinueSentinel;
        }

        var record = tryCatch(method, delegate.iterator, context.arg);

        if (record.type === "throw") {
          context.method = "throw";
          context.arg = record.arg;
          context.delegate = null;
          return ContinueSentinel;
        }

        var info = record.arg;

        if (!info) {
          context.method = "throw";
          context.arg = new TypeError("iterator result is not an object");
          context.delegate = null;
          return ContinueSentinel;
        }

        if (info.done) {
          // Assign the result of the finished delegate to the temporary
          // variable specified by delegate.resultName (see delegateYield).
          context[delegate.resultName] = info.value; // Resume execution at the desired location (see delegateYield).

          context.next = delegate.nextLoc; // If context.method was "throw" but the delegate handled the
          // exception, let the outer generator proceed normally. If
          // context.method was "next", forget context.arg since it has been
          // "consumed" by the delegate iterator. If context.method was
          // "return", allow the original .return call to continue in the
          // outer generator.

          if (context.method !== "return") {
            context.method = "next";
            context.arg = undefined$1;
          }
        } else {
          // Re-yield the result returned by the delegate method.
          return info;
        } // The delegate iterator is finished, so forget it and continue with
        // the outer generator.


        context.delegate = null;
        return ContinueSentinel;
      } // Define Generator.prototype.{next,throw,return} in terms of the
      // unified ._invoke helper method.


      defineIteratorMethods(Gp);
      define(Gp, toStringTagSymbol, "Generator"); // A Generator should always return itself as the iterator object when the
      // @@iterator function is called on it. Some browsers' implementations of the
      // iterator prototype chain incorrectly implement this, causing the Generator
      // object to not be returned from this call. This ensures that doesn't happen.
      // See https://github.com/facebook/regenerator/issues/274 for more details.

      define(Gp, iteratorSymbol, function () {
        return this;
      });
      define(Gp, "toString", function () {
        return "[object Generator]";
      });

      function pushTryEntry(locs) {
        var entry = {
          tryLoc: locs[0]
        };

        if (1 in locs) {
          entry.catchLoc = locs[1];
        }

        if (2 in locs) {
          entry.finallyLoc = locs[2];
          entry.afterLoc = locs[3];
        }

        this.tryEntries.push(entry);
      }

      function resetTryEntry(entry) {
        var record = entry.completion || {};
        record.type = "normal";
        delete record.arg;
        entry.completion = record;
      }

      function Context(tryLocsList) {
        // The root entry object (effectively a try statement without a catch
        // or a finally block) gives us a place to store values thrown from
        // locations where there is no enclosing try statement.
        this.tryEntries = [{
          tryLoc: "root"
        }];
        tryLocsList.forEach(pushTryEntry, this);
        this.reset(true);
      }

      exports.keys = function (object) {
        var keys = [];

        for (var key in object) {
          keys.push(key);
        }

        keys.reverse(); // Rather than returning an object with a next method, we keep
        // things simple and return the next function itself.

        return function next() {
          while (keys.length) {
            var key = keys.pop();

            if (key in object) {
              next.value = key;
              next.done = false;
              return next;
            }
          } // To avoid creating an additional object, we just hang the .value
          // and .done properties off the next function object itself. This
          // also ensures that the minifier will not anonymize the function.


          next.done = true;
          return next;
        };
      };

      function values(iterable) {
        if (iterable) {
          var iteratorMethod = iterable[iteratorSymbol];

          if (iteratorMethod) {
            return iteratorMethod.call(iterable);
          }

          if (typeof iterable.next === "function") {
            return iterable;
          }

          if (!isNaN(iterable.length)) {
            var i = -1,
                next = function next() {
              while (++i < iterable.length) {
                if (hasOwn.call(iterable, i)) {
                  next.value = iterable[i];
                  next.done = false;
                  return next;
                }
              }

              next.value = undefined$1;
              next.done = true;
              return next;
            };

            return next.next = next;
          }
        } // Return an iterator with no values.


        return {
          next: doneResult
        };
      }

      exports.values = values;

      function doneResult() {
        return {
          value: undefined$1,
          done: true
        };
      }

      Context.prototype = {
        constructor: Context,
        reset: function reset(skipTempReset) {
          this.prev = 0;
          this.next = 0; // Resetting context._sent for legacy support of Babel's
          // function.sent implementation.

          this.sent = this._sent = undefined$1;
          this.done = false;
          this.delegate = null;
          this.method = "next";
          this.arg = undefined$1;
          this.tryEntries.forEach(resetTryEntry);

          if (!skipTempReset) {
            for (var name in this) {
              // Not sure about the optimal order of these conditions:
              if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
                this[name] = undefined$1;
              }
            }
          }
        },
        stop: function stop() {
          this.done = true;
          var rootEntry = this.tryEntries[0];
          var rootRecord = rootEntry.completion;

          if (rootRecord.type === "throw") {
            throw rootRecord.arg;
          }

          return this.rval;
        },
        dispatchException: function dispatchException(exception) {
          if (this.done) {
            throw exception;
          }

          var context = this;

          function handle(loc, caught) {
            record.type = "throw";
            record.arg = exception;
            context.next = loc;

            if (caught) {
              // If the dispatched exception was caught by a catch block,
              // then let that catch block handle the exception normally.
              context.method = "next";
              context.arg = undefined$1;
            }

            return !!caught;
          }

          for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var entry = this.tryEntries[i];
            var record = entry.completion;

            if (entry.tryLoc === "root") {
              // Exception thrown outside of any try block that could handle
              // it, so set the completion value of the entire function to
              // throw the exception.
              return handle("end");
            }

            if (entry.tryLoc <= this.prev) {
              var hasCatch = hasOwn.call(entry, "catchLoc");
              var hasFinally = hasOwn.call(entry, "finallyLoc");

              if (hasCatch && hasFinally) {
                if (this.prev < entry.catchLoc) {
                  return handle(entry.catchLoc, true);
                } else if (this.prev < entry.finallyLoc) {
                  return handle(entry.finallyLoc);
                }
              } else if (hasCatch) {
                if (this.prev < entry.catchLoc) {
                  return handle(entry.catchLoc, true);
                }
              } else if (hasFinally) {
                if (this.prev < entry.finallyLoc) {
                  return handle(entry.finallyLoc);
                }
              } else {
                throw new Error("try statement without catch or finally");
              }
            }
          }
        },
        abrupt: function abrupt(type, arg) {
          for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var entry = this.tryEntries[i];

            if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
              var finallyEntry = entry;
              break;
            }
          }

          if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
            // Ignore the finally entry if control is not jumping to a
            // location outside the try/catch block.
            finallyEntry = null;
          }

          var record = finallyEntry ? finallyEntry.completion : {};
          record.type = type;
          record.arg = arg;

          if (finallyEntry) {
            this.method = "next";
            this.next = finallyEntry.finallyLoc;
            return ContinueSentinel;
          }

          return this.complete(record);
        },
        complete: function complete(record, afterLoc) {
          if (record.type === "throw") {
            throw record.arg;
          }

          if (record.type === "break" || record.type === "continue") {
            this.next = record.arg;
          } else if (record.type === "return") {
            this.rval = this.arg = record.arg;
            this.method = "return";
            this.next = "end";
          } else if (record.type === "normal" && afterLoc) {
            this.next = afterLoc;
          }

          return ContinueSentinel;
        },
        finish: function finish(finallyLoc) {
          for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var entry = this.tryEntries[i];

            if (entry.finallyLoc === finallyLoc) {
              this.complete(entry.completion, entry.afterLoc);
              resetTryEntry(entry);
              return ContinueSentinel;
            }
          }
        },
        "catch": function _catch(tryLoc) {
          for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var entry = this.tryEntries[i];

            if (entry.tryLoc === tryLoc) {
              var record = entry.completion;

              if (record.type === "throw") {
                var thrown = record.arg;
                resetTryEntry(entry);
              }

              return thrown;
            }
          } // The context.catch method must only be called with a location
          // argument that corresponds to a known catch block.


          throw new Error("illegal catch attempt");
        },
        delegateYield: function delegateYield(iterable, resultName, nextLoc) {
          this.delegate = {
            iterator: values(iterable),
            resultName: resultName,
            nextLoc: nextLoc
          };

          if (this.method === "next") {
            // Deliberately forget the last sent value so that we don't
            // accidentally pass it on to the delegate.
            this.arg = undefined$1;
          }

          return ContinueSentinel;
        }
      }; // Regardless of whether this script is executing as a CommonJS module
      // or not, return the runtime object so that we can declare the variable
      // regeneratorRuntime in the outer scope, which allows this module to be
      // injected easily by `bin/regenerator --include-runtime script.js`.

      return exports;
    }( // If this script is executing as a CommonJS module, use module.exports
    // as the regeneratorRuntime namespace. Otherwise create a new empty
    // object. Either way, the resulting object will be used to initialize
    // the regeneratorRuntime variable at the top of this file.
    module.exports );

    try {
      regeneratorRuntime = runtime;
    } catch (accidentalStrictMode) {
      // This module should not be running in strict mode, so the above
      // assignment should always work unless something is misconfigured. Just
      // in case runtime.js accidentally runs in strict mode, in modern engines
      // we can explicitly access globalThis. In older engines we can escape
      // strict mode using a global Function call. This could conceivably fail
      // if a Content Security Policy forbids using Function, but in that case
      // the proper solution is to fix the accidental strict mode problem. If
      // you've misconfigured your bundler to force strict mode and applied a
      // CSP to forbid Function, and you're not willing to fix either of those
      // problems, please detail your unique predicament in a GitHub issue.
      if ((typeof globalThis === "undefined" ? "undefined" : _typeof(globalThis)) === "object") {
        globalThis.regeneratorRuntime = runtime;
      } else {
        Function("r", "regeneratorRuntime = r")(runtime);
      }
    }
  })(runtime);

  var regenerator = runtime.exports;

  function fixProto(target, prototype) {
    var setPrototypeOf = Object.setPrototypeOf;
    setPrototypeOf ? setPrototypeOf(target, prototype) : target.__proto__ = prototype;
  }
  function fixStack(target, fn) {
    if (fn === void 0) {
      fn = target.constructor;
    }

    var captureStackTrace = Error.captureStackTrace;
    captureStackTrace && captureStackTrace(target, fn);
  }

  var __extends = function () {
    var extendStatics = function (d, b) {
      extendStatics = Object.setPrototypeOf || {
        __proto__: []
      } instanceof Array && function (d, b) {
        d.__proto__ = b;
      } || function (d, b) {
        for (var p in b) { if (b.hasOwnProperty(p)) { d[p] = b[p]; } }
      };

      return extendStatics(d, b);
    };

    return function (d, b) {
      extendStatics(d, b);

      function __() {
        this.constructor = d;
      }

      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  }();

  var CustomError = function (_super) {
    __extends(CustomError, _super);

    function CustomError(message) {
      var _newTarget = this.constructor;

      var _this = _super.call(this, message) || this;

      Object.defineProperty(_this, 'name', {
        value: _newTarget.name,
        enumerable: false,
        configurable: true
      });
      fixProto(_this, _newTarget.prototype);
      fixStack(_this);
      return _this;
    }

    return CustomError;
  }(Error);

  var appendChildren = function appendChildren(element, children) {
    children = Array.isArray(children) ? children : [children];
    children.forEach(function (child) {
      if (child instanceof HTMLElement) {
        element.appendChild(child);
      } else if (child || typeof child === 'string') {
        element.appendChild(document.createTextNode(child.toString()));
      }
    });
  };

  var setStyles = function setStyles(element, styles) {
    for (var style in styles) {
      element.style[style] = styles[style];
    }
  };

  /**
   * Assertion helpers.
   */
  var AssertionError = /*#__PURE__*/function (_Error) {
    _inherits(AssertionError, _Error);

    var _super = _createSuper(AssertionError);

    function AssertionError() {
      _classCallCheck(this, AssertionError);

      return _super.apply(this, arguments);
    }

    return AssertionError;
  }( /*#__PURE__*/_wrapNativeSuper(Error));
  /**
   * Assert a condition.
   *
   * @param      {boolean}            condition  The condition
   * @param      {string}             message    The message
   */

  function assert(condition, message) {
    if (!condition) {
      throw new AssertionError(message !== null && message !== void 0 ? message : 'Assertion failed');
    }
  }
  /**
   * Assert that a value is not undefined.
   *
   * @param      {any}            value    The value
   * @param      {string}         message  The message
   */

  function assertDefined(value, message) {
    assert(typeof value !== 'undefined', message !== null && message !== void 0 ? message : 'Assertion failed: Expected value to be defined');
  }
  /**
   * Assert that a value is not null.
   *
   * @param      {any}            value    The value
   * @param      {string}         message  The message
   */

  function assertNonNull(value, message) {
    assert(value !== null, message !== null && message !== void 0 ? message : 'Assertion failed: Expected value to be non-null');
  }
  /**
   * Assert that a value is neither null nor undefined.
   *
   * @param      {any}            value    The value
   * @param      {string}         message  The message
   */

  function assertHasValue(value, message) {
    assert(typeof value !== 'undefined' && value !== null, message !== null && message !== void 0 ? message : 'Assertion failed: Expected value to be defined and non-null');
  }

  /**
   * Element.querySelector shorthand, query result required to exist.
   *
   * If element is not provided, defaults to document.
   */

  function qs(query, element) {
    var queryResult = qsMaybe(query, element);
    assertNonNull(queryResult, 'Could not find required element');
    return queryResult;
  }
  /**
   * Element.querySelector shorthand, query result may be null.
   *
   * If element is not provided, defaults to document.
   */

  function qsMaybe(query, element) {
    var target = element !== null && element !== void 0 ? element : document;
    return target.querySelector(query);
  }
  /**
   * Element.querySelectorAll shorthand, with results converted to an array.
   *
   * If element is not provided, defaults to document.
   */

  function qsa(query, element) {
    var target = element !== null && element !== void 0 ? element : document;
    return _toConsumableArray(target.querySelectorAll(query));
  }
  function parseDOM(html) {
    return new DOMParser().parseFromString(html, 'text/html');
  }

  var separator = '\n–\n';

  var _footer = /*#__PURE__*/new WeakMap();

  var _extraInfoLines = /*#__PURE__*/new WeakMap();

  var _editNoteTextArea = /*#__PURE__*/new WeakMap();

  var _removePreviousFooter = /*#__PURE__*/new WeakSet();

  var EditNote = /*#__PURE__*/function () {
    function EditNote(footer) {
      _classCallCheck(this, EditNote);

      _classPrivateMethodInitSpec(this, _removePreviousFooter);

      _classPrivateFieldInitSpec(this, _footer, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _extraInfoLines, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _editNoteTextArea, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldSet(this, _footer, footer);

      _classPrivateFieldSet(this, _editNoteTextArea, qs('textarea.edit-note')); // Maybe kept from page reload


      var existingInfoBlock = _classPrivateFieldGet(this, _editNoteTextArea).value.split(separator)[0];

      if (existingInfoBlock) {
        _classPrivateFieldSet(this, _extraInfoLines, new Set(existingInfoBlock.split('\n').map(function (l) {
          return l.trimRight();
        })));
      } else {
        _classPrivateFieldSet(this, _extraInfoLines, new Set());
      }
    }

    _createClass(EditNote, [{
      key: "addExtraInfo",
      value: function addExtraInfo(infoLine) {
        if (_classPrivateFieldGet(this, _extraInfoLines).has(infoLine)) return; // eslint-disable-next-line prefer-const

        var _classPrivateFieldGet2 = _classPrivateFieldGet(this, _editNoteTextArea).value.split(separator),
            _classPrivateFieldGet3 = _toArray(_classPrivateFieldGet2),
            infoBlock = _classPrivateFieldGet3[0],
            rest = _classPrivateFieldGet3.slice(1);

        infoBlock = (infoBlock + '\n' + infoLine).trim();
        _classPrivateFieldGet(this, _editNoteTextArea).value = [infoBlock].concat(_toConsumableArray(rest)).join(separator);

        _classPrivateFieldGet(this, _extraInfoLines).add(infoLine);
      }
    }, {
      key: "addFooter",
      value: function addFooter() {
        // Edit note content might be retained after page reload, or may have
        // already been partially filled. Search any previous content and
        // remove it
        _classPrivateMethodGet(this, _removePreviousFooter, _removePreviousFooter2).call(this);

        var prevNote = _classPrivateFieldGet(this, _editNoteTextArea).value;

        _classPrivateFieldGet(this, _editNoteTextArea).value = [prevNote, separator, _classPrivateFieldGet(this, _footer)].join('');
      }
    }], [{
      key: "withFooterFromGMInfo",
      value: function withFooterFromGMInfo() {
        var scriptMetadata = GM_info.script; // namespace should be the homepage URL (homepageURL and homepage are not available in all userscript managers)

        var footer = "".concat(scriptMetadata.name, " ").concat(scriptMetadata.version, "\n").concat(scriptMetadata.namespace);
        return new EditNote(footer);
      }
    }]);

    return EditNote;
  }();

  function _removePreviousFooter2() {
    var _this = this;

    var fragments = _classPrivateFieldGet(this, _editNoteTextArea).value.split(separator);

    var otherFragments = fragments.filter(function (text) {
      return text.trim() !== _classPrivateFieldGet(_this, _footer);
    });
    _classPrivateFieldGet(this, _editNoteTextArea).value = otherFragments.join(separator);
  }

  var LogLevel;

  (function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
    LogLevel[LogLevel["LOG"] = 1] = "LOG";
    LogLevel[LogLevel["INFO"] = 2] = "INFO";
    LogLevel[LogLevel["SUCCESS"] = 3] = "SUCCESS";
    LogLevel[LogLevel["WARNING"] = 4] = "WARNING";
    LogLevel[LogLevel["ERROR"] = 5] = "ERROR";
  })(LogLevel || (LogLevel = {}));

  var _HANDLER_NAMES;
  var HANDLER_NAMES = (_HANDLER_NAMES = {}, _defineProperty(_HANDLER_NAMES, LogLevel.DEBUG, 'onDebug'), _defineProperty(_HANDLER_NAMES, LogLevel.LOG, 'onLog'), _defineProperty(_HANDLER_NAMES, LogLevel.INFO, 'onInfo'), _defineProperty(_HANDLER_NAMES, LogLevel.SUCCESS, 'onSuccess'), _defineProperty(_HANDLER_NAMES, LogLevel.WARNING, 'onWarn'), _defineProperty(_HANDLER_NAMES, LogLevel.ERROR, 'onError'), _HANDLER_NAMES);
  var DEFAULT_OPTIONS = {
    logLevel: LogLevel.INFO,
    sinks: []
  };

  var _configuration = /*#__PURE__*/new WeakMap();

  var _fireHandlers = /*#__PURE__*/new WeakSet();

  var Logger = /*#__PURE__*/function () {
    function Logger(options) {
      _classCallCheck(this, Logger);

      _classPrivateMethodInitSpec(this, _fireHandlers);

      _classPrivateFieldInitSpec(this, _configuration, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldSet(this, _configuration, _objectSpread2(_objectSpread2({}, DEFAULT_OPTIONS), options));
    }

    _createClass(Logger, [{
      key: "debug",
      value: function debug(message) {
        _classPrivateMethodGet(this, _fireHandlers, _fireHandlers2).call(this, LogLevel.DEBUG, message);
      }
    }, {
      key: "log",
      value: function log(message) {
        _classPrivateMethodGet(this, _fireHandlers, _fireHandlers2).call(this, LogLevel.LOG, message);
      }
    }, {
      key: "info",
      value: function info(message) {
        _classPrivateMethodGet(this, _fireHandlers, _fireHandlers2).call(this, LogLevel.INFO, message);
      }
    }, {
      key: "success",
      value: function success(message) {
        _classPrivateMethodGet(this, _fireHandlers, _fireHandlers2).call(this, LogLevel.SUCCESS, message);
      }
    }, {
      key: "warn",
      value: function warn(message) {
        _classPrivateMethodGet(this, _fireHandlers, _fireHandlers2).call(this, LogLevel.WARNING, message);
      }
    }, {
      key: "error",
      value: function error(message, exception) {
        _classPrivateMethodGet(this, _fireHandlers, _fireHandlers2).call(this, LogLevel.ERROR, message, exception);
      }
    }, {
      key: "configure",
      value: function configure(options) {
        Object.assign(_classPrivateFieldGet(this, _configuration), options);
      }
    }, {
      key: "configuration",
      get: function get() {
        return _classPrivateFieldGet(this, _configuration);
      }
    }, {
      key: "addSink",
      value: function addSink(sink) {
        _classPrivateFieldGet(this, _configuration).sinks.push(sink);
      }
    }]);

    return Logger;
  }();

  function _fireHandlers2(level, message, exception) {
    if (level < _classPrivateFieldGet(this, _configuration).logLevel) return;

    _classPrivateFieldGet(this, _configuration).sinks.forEach(function (sink) {
      var handler = sink[HANDLER_NAMES[level]];
      if (!handler) return;

      if (exception) {
        // @ts-expect-error: Too dynamic. `exception` will only be
        // defined if level is error, in which case the handler
        // will accept it.
        handler.call(sink, message, exception);
      } else {
        // Still using a conditional here, otherwise it will call
        // the handler with undefined as 2nd arg instead of with
        // just 1 arg, which might lead to bad output.
        handler.call(sink, message);
      }
    });
  }

  var LOGGER = new Logger();

  var _scriptName = /*#__PURE__*/new WeakMap();

  var _formatMessage = /*#__PURE__*/new WeakSet();

  var ConsoleSink = /*#__PURE__*/function () {
    function ConsoleSink(scriptName) {
      _classCallCheck(this, ConsoleSink);

      _classPrivateMethodInitSpec(this, _formatMessage);

      _classPrivateFieldInitSpec(this, _scriptName, {
        writable: true,
        value: void 0
      });

      _defineProperty(this, "onSuccess", this.onInfo);

      _classPrivateFieldSet(this, _scriptName, scriptName);
    }

    _createClass(ConsoleSink, [{
      key: "onDebug",
      value: function onDebug(message) {
        console.debug(_classPrivateMethodGet(this, _formatMessage, _formatMessage2).call(this, message));
      }
    }, {
      key: "onLog",
      value: function onLog(message) {
        console.log(_classPrivateMethodGet(this, _formatMessage, _formatMessage2).call(this, message));
      }
    }, {
      key: "onInfo",
      value: function onInfo(message) {
        console.info(_classPrivateMethodGet(this, _formatMessage, _formatMessage2).call(this, message));
      }
    }, {
      key: "onWarn",
      value: function onWarn(message) {
        console.warn(_classPrivateMethodGet(this, _formatMessage, _formatMessage2).call(this, message));
      }
    }, {
      key: "onError",
      value: function onError(message, exception) {
        message = _classPrivateMethodGet(this, _formatMessage, _formatMessage2).call(this, message);
        if (exception) console.error(message, exception);else console.error(message);
      }
    }]);

    return ConsoleSink;
  }();

  function _formatMessage2(message) {
    return "[".concat(_classPrivateFieldGet(this, _scriptName), "] ").concat(message);
  }

  var ResponseError = /*#__PURE__*/function (_CustomError) {
    _inherits(ResponseError, _CustomError);

    var _super = _createSuper(ResponseError);

    function ResponseError(url, extraMessage) {
      var _this;

      _classCallCheck(this, ResponseError);

      _this = _super.call(this, extraMessage);

      _defineProperty(_assertThisInitialized(_this), "url", void 0);

      _this.url = url;
      return _this;
    }

    return ResponseError;
  }(CustomError);
  var HTTPResponseError = /*#__PURE__*/function (_ResponseError) {
    _inherits(HTTPResponseError, _ResponseError);

    var _super2 = _createSuper(HTTPResponseError);

    function HTTPResponseError(url, response) {
      var _this2;

      _classCallCheck(this, HTTPResponseError);

      _this2 = _super2.call(this, url, "HTTP error ".concat(response.status, ": ").concat(response.statusText));

      _defineProperty(_assertThisInitialized(_this2), "statusCode", void 0);

      _defineProperty(_assertThisInitialized(_this2), "statusText", void 0);

      _defineProperty(_assertThisInitialized(_this2), "response", void 0);

      _this2.response = response;
      _this2.statusCode = response.status;
      _this2.statusText = response.statusText;
      return _this2;
    }

    return HTTPResponseError;
  }(ResponseError);
  var TimeoutError = /*#__PURE__*/function (_ResponseError2) {
    _inherits(TimeoutError, _ResponseError2);

    var _super3 = _createSuper(TimeoutError);

    function TimeoutError(url) {
      _classCallCheck(this, TimeoutError);

      return _super3.call(this, url, 'Request timed out');
    }

    return TimeoutError;
  }(ResponseError);
  var AbortedError = /*#__PURE__*/function (_ResponseError3) {
    _inherits(AbortedError, _ResponseError3);

    var _super4 = _createSuper(AbortedError);

    function AbortedError(url) {
      _classCallCheck(this, AbortedError);

      return _super4.call(this, url, 'Request aborted');
    }

    return AbortedError;
  }(ResponseError);
  var NetworkError = /*#__PURE__*/function (_ResponseError4) {
    _inherits(NetworkError, _ResponseError4);

    var _super5 = _createSuper(NetworkError);

    function NetworkError(url) {
      _classCallCheck(this, NetworkError);

      return _super5.call(this, url, 'Network error');
    }

    return NetworkError;
  }(ResponseError);
  function gmxhr(_x, _x2) {
    return _gmxhr.apply(this, arguments);
  }

  function _gmxhr() {
    _gmxhr = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(url, options) {
      return regenerator.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt("return", new Promise(function (resolve, reject) {
                GM_xmlhttpRequest(_objectSpread2(_objectSpread2({
                  method: 'GET',
                  url: url instanceof URL ? url.href : url
                }, options !== null && options !== void 0 ? options : {}), {}, {
                  onload: function onload(resp) {
                    if (resp.status >= 400) reject(new HTTPResponseError(url, resp));else resolve(resp);
                  },
                  onerror: function onerror() {
                    reject(new NetworkError(url));
                  },
                  onabort: function onabort() {
                    reject(new AbortedError(url));
                  },
                  ontimeout: function ontimeout() {
                    reject(new TimeoutError(url));
                  }
                }));
              }));

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _gmxhr.apply(this, arguments);
  }

  function retryTimes(_x, _x2, _x3) {
    return _retryTimes.apply(this, arguments);
  }

  function _retryTimes() {
    _retryTimes = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(fn, times, retryWait) {
      return regenerator.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!(times <= 0)) {
                _context.next = 2;
                break;
              }

              return _context.abrupt("return", Promise.reject(new TypeError('Invalid number of retry times: ' + times)));

            case 2:
              return _context.abrupt("return", new Promise(function (resolve, reject) {
                function tryOnce() {
                  try {
                    resolve(fn());
                  } catch (err) {
                    if (--times > 0) return;
                    reject(err);
                  } // Stop looping if the function passed, or when it failed but tries
                  // are exhausted. The early return in the catch clause prevents
                  // this statement from executing if the tries aren't exhausted yet.


                  // Stop looping if the function passed, or when it failed but tries
                  // are exhausted. The early return in the catch clause prevents
                  // this statement from executing if the tries aren't exhausted yet.
                  clearInterval(interval);
                }

                var interval = setInterval(tryOnce, retryWait); // Manually calling the first try, the one in the interval will be first
                // called after the first wait period. If the call succeeds immediately,
                // the interval will be cleared before the first execution happens.

                // Manually calling the first try, the one in the interval will be first
                // called after the first wait period. If the call succeeds immediately,
                // the interval will be cleared before the first execution happens.
                tryOnce();
              }));

            case 3:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _retryTimes.apply(this, arguments);
  }

  function getReleaseUrlARs(_x) {
    return _getReleaseUrlARs.apply(this, arguments);
  }

  function _getReleaseUrlARs() {
    _getReleaseUrlARs = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(releaseId) {
      var _metadata$relations;

      var resp, metadata;
      return regenerator.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return fetch("/ws/2/release/".concat(releaseId, "?inc=url-rels&fmt=json"));

            case 2:
              resp = _context.sent;
              _context.next = 5;
              return resp.json();

            case 5:
              metadata = _context.sent;
              return _context.abrupt("return", (_metadata$relations = metadata.relations) !== null && _metadata$relations !== void 0 ? _metadata$relations :
              /* istanbul ignore next: Likely won't happen */
              []);

            case 7:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _getReleaseUrlARs.apply(this, arguments);
  }

  function getURLsForRelease(_x2, _x3) {
    return _getURLsForRelease.apply(this, arguments);
  }

  function _getURLsForRelease() {
    _getURLsForRelease = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(releaseId, options) {
      var _ref, excludeEnded, excludeDuplicates, urlARs, urls;

      return regenerator.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _ref = options !== null && options !== void 0 ? options : {}, excludeEnded = _ref.excludeEnded, excludeDuplicates = _ref.excludeDuplicates;
              _context2.next = 3;
              return getReleaseUrlARs(releaseId);

            case 3:
              urlARs = _context2.sent;

              if (excludeEnded) {
                urlARs = urlARs.filter(function (ar) {
                  return !ar.ended;
                });
              }

              urls = urlARs.map(function (ar) {
                return ar.url.resource;
              });

              if (excludeDuplicates) {
                urls = Array.from(new Set(_toConsumableArray(urls)));
              }

              return _context2.abrupt("return", urls.flatMap(function (url) {
                try {
                  return [new URL(url)];
                } catch (_unused)
                /* istanbul ignore next: Likely won't happen */
                {
                  // Bad URL
                  console.warn("Found malformed URL linked to release: ".concat(url));
                  return [];
                }
              }));

            case 8:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));
    return _getURLsForRelease.apply(this, arguments);
  }

  var CoverArtProvider = /*#__PURE__*/function () {
    function CoverArtProvider() {
      _classCallCheck(this, CoverArtProvider);

      _defineProperty(this, "supportedDomains", void 0);

      _defineProperty(this, "name", void 0);

      _defineProperty(this, "urlRegex", void 0);
    }

    _createClass(CoverArtProvider, [{
      key: "supportsUrl",
      value:
      /**
       * Check whether the provider supports the given URL.
       *
       * @param      {URL}    url     The provider URL.
       * @return     {boolean}  Whether images can be extracted for this URL.
       */
      function supportsUrl(url) {
        if (Array.isArray(this.urlRegex)) {
          return this.urlRegex.some(function (regex) {
            return regex.test(url.href);
          });
        }

        return this.urlRegex.test(url.href);
      }
      /**
       * Extract ID from a release URL.
       */

    }, {
      key: "extractId",
      value: function extractId(url) {
        if (!Array.isArray(this.urlRegex)) {
          var _url$href$match;

          return (_url$href$match = url.href.match(this.urlRegex)) === null || _url$href$match === void 0 ? void 0 : _url$href$match[1];
        }

        return this.urlRegex.map(function (regex) {
          var _url$href$match2;

          return (_url$href$match2 = url.href.match(regex)) === null || _url$href$match2 === void 0 ? void 0 : _url$href$match2[1];
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
      key: "fetchPageDOM",
      value: function () {
        var _fetchPageDOM = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(url) {
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
                  return _context.abrupt("return", parseDOM(resp.responseText));

                case 6:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function fetchPageDOM(_x) {
          return _fetchPageDOM.apply(this, arguments);
        }

        return fetchPageDOM;
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
      key: "findImages",
      value: // Providers for which the cover art can be retrieved from the head
      // og:image property and maximised using maxurl
      function () {
        var _findImages = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(url) {
          var respDocument, coverElmt;
          return regenerator.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.next = 2;
                  return this.fetchPageDOM(url);

                case 2:
                  respDocument = _context2.sent;
                  coverElmt = qs('head > meta[property="og:image"]', respDocument);
                  return _context2.abrupt("return", [{
                    url: new URL(coverElmt.content),
                    types: [ArtworkTypeIDs.Front]
                  }]);

                case 5:
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

    return AppleMusicProvider;
  }(HeadMetaPropertyProvider);

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
      value: function () {
        var _getReleaseImages = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(releaseId) {
          var variables, extensions, resp, metadata, responseId;
          return regenerator.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
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
                  _context2.next = 4;
                  return gmxhr("https://www.discogs.com/internal/release-page/api/graphql?operationName=ReleaseAllImages&variables=".concat(variables, "&extensions=").concat(extensions));

                case 4:
                  resp = _context2.sent;
                  metadata = JSON.parse(resp.responseText);
                  assertHasValue(metadata.data.release, 'Discogs release does not exist');
                  responseId = metadata.data.release.discogsId.toString();
                  assert(typeof responseId === 'undefined' || responseId === releaseId, "Discogs returned wrong release: Requested ".concat(releaseId, ", got ").concat(responseId));
                  return _context2.abrupt("return", metadata);

                case 10:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2);
        }));

        function getReleaseImages(_x2) {
          return _getReleaseImages.apply(this, arguments);
        }

        return getReleaseImages;
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

  var APP_ID = 'CzET4vdadNUFQ5JU';

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
          var resp;
          return regenerator.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  if (_classPrivateFieldGet(this, _countryCode)) {
                    _context.next = 5;
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

                  _classPrivateFieldSet(this, _countryCode, JSON.parse(resp.responseText).countryCode);

                case 5:
                  assertHasValue(_classPrivateFieldGet(this, _countryCode), 'Cannot determine Tidal country');
                  return _context.abrupt("return", _classPrivateFieldGet(this, _countryCode));

                case 7:
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
          var _metadata$rows, _metadata$rows$, _metadata$rows$$modul, _metadata$rows$$modul2, _albumMetadata$id, _metadata$rows2, _metadata$rows2$, _metadata$rows2$$modu, _metadata$rows2$$modu2, _metadata$rows2$$modu3;

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
                  metadata = JSON.parse(resp.responseText);
                  albumMetadata = metadata === null || metadata === void 0 ? void 0 : (_metadata$rows = metadata.rows) === null || _metadata$rows === void 0 ? void 0 : (_metadata$rows$ = _metadata$rows[0]) === null || _metadata$rows$ === void 0 ? void 0 : (_metadata$rows$$modul = _metadata$rows$.modules) === null || _metadata$rows$$modul === void 0 ? void 0 : (_metadata$rows$$modul2 = _metadata$rows$$modul[0]) === null || _metadata$rows$$modul2 === void 0 ? void 0 : _metadata$rows$$modul2.album;
                  assertHasValue(albumMetadata, 'Tidal API returned no album, 404?');
                  assert(((_albumMetadata$id = albumMetadata.id) === null || _albumMetadata$id === void 0 ? void 0 : _albumMetadata$id.toString()) === albumId, "Tidal returned wrong release: Requested ".concat(albumId, ", got ").concat(albumMetadata.id));
                  coverId = metadata === null || metadata === void 0 ? void 0 : (_metadata$rows2 = metadata.rows) === null || _metadata$rows2 === void 0 ? void 0 : (_metadata$rows2$ = _metadata$rows2[0]) === null || _metadata$rows2$ === void 0 ? void 0 : (_metadata$rows2$$modu = _metadata$rows2$.modules) === null || _metadata$rows2$$modu === void 0 ? void 0 : (_metadata$rows2$$modu2 = _metadata$rows2$$modu[0]) === null || _metadata$rows2$$modu2 === void 0 ? void 0 : (_metadata$rows2$$modu3 = _metadata$rows2$$modu2.album) === null || _metadata$rows2$$modu3 === void 0 ? void 0 : _metadata$rows2$$modu3.cover;
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

  var BandcampProvider = /*#__PURE__*/function (_HeadMetaPropertyProv) {
    _inherits(BandcampProvider, _HeadMetaPropertyProv);

    var _super = _createSuper(BandcampProvider);

    function BandcampProvider() {
      var _this;

      _classCallCheck(this, BandcampProvider);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));

      _defineProperty(_assertThisInitialized(_this), "supportedDomains", ['bandcamp.com']);

      _defineProperty(_assertThisInitialized(_this), "favicon", 'https://s4.bcbits.com/img/favicon/favicon-32x32.png');

      _defineProperty(_assertThisInitialized(_this), "name", 'Bandcamp');

      _defineProperty(_assertThisInitialized(_this), "urlRegex", /:\/\/(.+)\.bandcamp\.com\/(track|album)\/([^/]+)(?:\/|$)/);

      return _this;
    }

    _createClass(BandcampProvider, [{
      key: "extractId",
      value: function extractId(url) {
        var _url$href$match, _url$href$match$slice;

        return (_url$href$match = url.href.match(this.urlRegex)) === null || _url$href$match === void 0 ? void 0 : (_url$href$match$slice = _url$href$match.slice(1)) === null || _url$href$match$slice === void 0 ? void 0 : _url$href$match$slice.join('/');
      }
    }]);

    return BandcampProvider;
  }(HeadMetaPropertyProvider);

  var PLACEHOLDER_IMG_REGEX = /01RmK(?:\+|%2B)J4pJL/;

  var _extractFromStreamingProduct = /*#__PURE__*/new WeakSet();

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

      _classPrivateMethodInitSpec(_assertThisInitialized(_this), _extractFromStreamingProduct);

      _defineProperty(_assertThisInitialized(_this), "supportedDomains", ['amazon.ca', 'amazon.cn', 'amazon.de', 'amazon.es', 'amazon.fr', 'amazon.it', 'amazon.jp', 'amazon.nl', 'amazon.co.jp', 'amazon.co.uk', 'amazon.com']);

      _defineProperty(_assertThisInitialized(_this), "name", 'Amazon');

      _defineProperty(_assertThisInitialized(_this), "urlRegex", /\/(?:gp\/product|dp)\/([A-Za-z0-9]{10})(?:\/|$)/);

      return _this;
    }

    _createClass(AmazonProvider, [{
      key: "favicon",
      get: // Favicon URL is blocked by Firefox' Enhanced Tracking Protection
      function get() {
        return GM_getResourceURL('amazonFavicon');
      }
    }, {
      key: "findImages",
      value: function () {
        var _findImages = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(url) {
          var pageDom, imgs, covers;
          return regenerator.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return this.fetchPageDOM(url);

                case 2:
                  pageDom = _context.sent;

                  if (!(qsMaybe('#digitalMusicProductImage_feature_div', pageDom) !== null)) {
                    _context.next = 5;
                    break;
                  }

                  return _context.abrupt("return", _classPrivateMethodGet(this, _extractFromStreamingProduct, _extractFromStreamingProduct2).call(this, pageDom));

                case 5:
                  // Thumbnails in the sidebar, IMU will maximise
                  imgs = qsa('#altImages img', pageDom);
                  covers = imgs // Filter out placeholder images.
                  .filter(function (img) {
                    return !PLACEHOLDER_IMG_REGEX.test(img.src);
                  }).map(function (img) {
                    return {
                      url: new URL(img.src)
                    };
                  }); // We don't know anything about the types of these images, but we can
                  // probably assume the first image is the front cover.

                  if (covers.length) {
                    covers[0].types = [ArtworkTypeIDs.Front];
                  }

                  return _context.abrupt("return", covers);

                case 9:
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

    return AmazonProvider;
  }(CoverArtProvider);

  function _extractFromStreamingProduct2(doc) {
    var img = qs('#digitalMusicProductImage_feature_div > img', doc); // For MP3/Streaming releases, we know the cover is the front one.
    // Only returning the thumbnail, IMU will maximise

    return [{
      url: new URL(img.src),
      types: [ArtworkTypeIDs.Front]
    }];
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

      _defineProperty(_assertThisInitialized(_this), "supportedDomains", ['music.amazon.ca', 'music.amazon.cn', 'music.amazon.de', 'music.amazon.es', 'music.amazon.fr', 'music.amazon.it', 'music.amazon.jp', 'music.amazon.nl', 'music.amazon.co.jp', 'music.amazon.co.uk', 'music.amazon.com']);

      _defineProperty(_assertThisInitialized(_this), "favicon", 'https://d5fx445wy2wpk.cloudfront.net/icons/amznMusic_favicon.png');

      _defineProperty(_assertThisInitialized(_this), "name", 'Amazon Music');

      _defineProperty(_assertThisInitialized(_this), "urlRegex", /\/albums\/([A-Za-z0-9]{10})(?:\/|$)/);

      return _this;
    }

    _createClass(AmazonMusicProvider, [{
      key: "findImages",
      value: function () {
        var _findImages = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(url) {
          var _url$pathname$match;

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
                  asin = (_url$pathname$match = url.pathname.match(/\/albums\/([A-Za-z0-9]{10})(?:\/|$)/)) === null || _url$pathname$match === void 0 ? void 0 : _url$pathname$match[1];
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
          }, _callee);
        }));

        function findImages(_x) {
          return _findImages.apply(this, arguments);
        }

        return findImages;
      }()
    }]);

    return AmazonMusicProvider;
  }(CoverArtProvider);

  // from the JS code loaded on open.qobuz.com, but for simplicity's sake, let's
  // just use a constant app ID first.

  var QOBUZ_APP_ID = 712109809;
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
                  metadata = JSON.parse(resp.responseText);
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
        var isBooklet = goodie.name === 'Livret Numérique';
        return {
          url: new URL(goodie.original_url),
          types: isBooklet ? [ArtworkTypeIDs.Booklet] : [],
          comment: isBooklet ? 'Qobuz booklet' : goodie.name
        };
      }
    }]);

    return QobuzProvider;
  }(CoverArtProvider);

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

  var _extractImages = /*#__PURE__*/new WeakSet();

  var _convertCaptions = /*#__PURE__*/new WeakSet();

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

      _classPrivateMethodInitSpec(_assertThisInitialized(_this), _convertCaptions);

      _classPrivateMethodInitSpec(_assertThisInitialized(_this), _extractImages);

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
          var id, apiUrl, apiResp, metadata;
          return regenerator.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  // Using the unofficial API at vgmdb.info
                  id = this.extractId(url);
                  assertHasValue(id);
                  apiUrl = "https://vgmdb.info/album/".concat(id, "?format=json");
                  _context.next = 5;
                  return gmxhr(apiUrl);

                case 5:
                  apiResp = _context.sent;
                  metadata = JSON.parse(apiResp.responseText);
                  assert(metadata.link === 'album/' + id, "VGMdb.info returned wrong release: Requested album/".concat(id, ", got ").concat(metadata.link));
                  return _context.abrupt("return", _classPrivateMethodGet(this, _extractImages, _extractImages2).call(this, metadata));

                case 9:
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

    return VGMdbProvider;
  }(CoverArtProvider);

  function _extractImages2(metadata) {
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

    return covers.map(_classPrivateMethodGet(this, _convertCaptions, _convertCaptions2).bind(this));
  }

  function _convertCaptions2(cover) {
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

  var PROVIDER_DISPATCH = new Map();

  function add_provider(provider) {
    provider.supportedDomains.forEach(function (domain) {
      return PROVIDER_DISPATCH.set(domain, provider);
    });
  }

  add_provider(new AmazonProvider());
  add_provider(new AmazonMusicProvider());
  add_provider(new AppleMusicProvider());
  add_provider(new BandcampProvider());
  add_provider(new DeezerProvider());
  add_provider(new DiscogsProvider());
  add_provider(new QobuzProvider());
  add_provider(new SpotifyProvider());
  add_provider(new TidalProvider());
  add_provider(new VGMdbProvider());

  function extractDomain(url) {
    var domain = url.hostname; // Deal with bandcamp subdomains

    if (domain.endsWith('bandcamp.com')) domain = 'bandcamp.com';
    domain = domain.replace(/^www\./, '');
    return domain;
  }

  function getProvider(url) {
    var provider = PROVIDER_DISPATCH.get(extractDomain(url));
    return provider !== null && provider !== void 0 && provider.supportsUrl(url) ? provider : undefined;
  }
  function hasProvider(url) {
    return !!getProvider(url);
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
              value: function onWarn(message) {
                  _classPrivateMethodGet(this, _setStatusBanner, _setStatusBanner2).call(this, message);
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
      if (exception && Object.hasOwnProperty.call(exception, 'message')) {
          _classPrivateFieldGet(this, _banner).textContent = message + ' ' + exception;
      } else {
          _classPrivateFieldGet(this, _banner).textContent = message;
      }
      _classPrivateFieldGet(this, _banner).style.removeProperty('display');
  }
  function _setStatusBannerClass2(newClass) {
      _classPrivateFieldGet(this, _banner).classList.replace(_classPrivateFieldGet(this, _currentMessageClass), newClass);
      _classPrivateFieldSet(this, _currentMessageClass, newClass);
  }

  var USERSCRIPT_NAME = "mb_enhanced_cover_art_uploads";

  var css_248z = ".ROpdebee_paste_url_cont{display:inline-block;margin-left:32px;vertical-align:middle}.ROpdebee_paste_url_cont>*{display:block}.ROpdebee_paste_url_cont>a{font-size:smaller;text-align:right}.ROpdebee_paste_url_cont+span{margin-left:32px}.ROpdebee_import_url_buttons{margin-left:32px;vertical-align:middle}.ROpdebee_import_url_buttons>button{display:block;float:none;margin:4px}#ROpdebee_paste_url_status.info{color:#000}#ROpdebee_paste_url_status.warning{color:orange}";

  var _urlInput = new WeakMap();
  var _buttonContainer = new WeakMap();
  var InputForm = function () {
      function InputForm(banner, onUrlFilled) {
          var _qs$insertAdjacentEle, _qs$insertAdjacentEle2;
          _classCallCheck(this, InputForm);
          _classPrivateFieldInitSpec(this, _urlInput, {
              writable: true,
              value: void 0
          });
          _classPrivateFieldInitSpec(this, _buttonContainer, {
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
              $$c.setAttribute('placeholder', 'or paste a URL here');
              $$c.setAttribute('size', 47);
              $$c.setAttribute('id', 'ROpdebee_paste_url');
              $$c.addEventListener('input', function (evt) {
                  if (!evt.currentTarget.value)
                      return;
                  var url;
                  try {
                      url = new URL(evt.currentTarget.value.trim());
                  } catch (err) {
                      LOGGER.error('Invalid URL', err);
                      return;
                  }
                  onUrlFilled(url);
              });
              return $$c;
          }.call(this));
          var container = function () {
              var $$d = document.createElement('div');
              $$d.setAttribute('class', 'ROpdebee_paste_url_cont');
              appendChildren($$d, _classPrivateFieldGet(this, _urlInput));
              var $$f = document.createElement('a');
              $$f.setAttribute('href', 'https://github.com/ROpdebee/mb-userscripts/blob/main/src/mb_enhanced_cover_art_uploads/supportedProviders.md');
              $$f.setAttribute('target', '_blank');
              $$d.appendChild($$f);
              var $$g = document.createTextNode('\n                Supported providers\n            ');
              $$f.appendChild($$g);
              appendChildren($$d, banner);
              return $$d;
          }.call(this);
          _classPrivateFieldSet(this, _buttonContainer, function () {
              var $$i = document.createElement('div');
              $$i.setAttribute('class', 'ROpdebee_import_url_buttons buttons');
              return $$i;
          }.call(this));
          var orSpan = function () {
              var $$j = document.createElement('span');
              var $$k = document.createTextNode('or');
              $$j.appendChild($$k);
              return $$j;
          }.call(this);
          (_qs$insertAdjacentEle = qs('#drop-zone').insertAdjacentElement('afterend', container)) === null || _qs$insertAdjacentEle === void 0 ? void 0 : (_qs$insertAdjacentEle2 = _qs$insertAdjacentEle.insertAdjacentElement('afterend', orSpan)) === null || _qs$insertAdjacentEle2 === void 0 ? void 0 : _qs$insertAdjacentEle2.insertAdjacentElement('afterend', _classPrivateFieldGet(this, _buttonContainer));
      }
      _createClass(InputForm, [
          {
              key: 'clearOldInputValue',
              value: function clearOldInputValue(oldValue) {
                  if (_classPrivateFieldGet(this, _urlInput).value == oldValue) {
                      _classPrivateFieldGet(this, _urlInput).value = '';
                  }
              }
          },
          {
              key: 'addImportButton',
              value: function addImportButton(onClickCallback, url, provider) {
                  var button = function () {
                      var $$l = document.createElement('button');
                      $$l.setAttribute('type', 'button');
                      $$l.setAttribute('title', url);
                      $$l.addEventListener('click', function (evt) {
                          evt.preventDefault();
                          onClickCallback();
                      });
                      var $$m = document.createElement('img');
                      $$m.setAttribute('src', provider.favicon);
                      $$m.setAttribute('alt', provider.name);
                      $$l.appendChild($$m);
                      var $$n = document.createElement('span');
                      $$l.appendChild($$n);
                      appendChildren($$n, 'Import from ' + provider.name);
                      return $$l;
                  }.call(this);
                  _classPrivateFieldGet(this, _buttonContainer).insertAdjacentElement('beforeend', button);
              }
          }
      ]);
      return InputForm;
  }();

  // userscript is executed, so $$IMU_EXPORT$$ should already exist now. However,
  // it does not exist in tests, and we can't straightforwardly inject this variable
  // without importing the module, thereby dereferencing it.

  /* istanbul ignore next: mocked out */

  function maxurl(url, options) {
    $$IMU_EXPORT$$(url, options);
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
  function getMaximisedCandidates(_x) {
    return _getMaximisedCandidates.apply(this, arguments);
  }

  function _getMaximisedCandidates() {
    _getMaximisedCandidates = _wrapAsyncGenerator( /*#__PURE__*/regenerator.mark(function _callee(smallurl) {
      var p, results, i, current;
      return regenerator.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!(smallurl.hostname === 'img.discogs.com')) {
                _context.next = 4;
                break;
              }

              _context.next = 3;
              return getMaximisedCandidatesDiscogs(smallurl);

            case 3:
              return _context.abrupt("return");

            case 4:
              p = new Promise(function (resolve) {
                maxurl(smallurl.href, _objectSpread2(_objectSpread2({}, options), {}, {
                  cb: resolve
                }));
              });
              _context.next = 7;
              return _awaitAsyncGenerator(p);

            case 7:
              results = _context.sent;
              i = 0;

            case 9:
              if (!(i < results.length)) {
                _context.next = 23;
                break;
              }

              current = results[i]; // Filter out results that will definitely not work

              if (!(current.fake || current.bad || current.likely_broken)) {
                _context.next = 13;
                break;
              }

              return _context.abrupt("continue", 20);

            case 13:
              _context.prev = 13;
              _context.next = 16;
              return _objectSpread2(_objectSpread2({}, current), {}, {
                url: new URL(current.url)
              });

            case 16:
              _context.next = 20;
              break;

            case 18:
              _context.prev = 18;
              _context.t0 = _context["catch"](13);

            case 20:
              i++;
              _context.next = 9;
              break;

            case 23:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[13, 18]]);
    }));
    return _getMaximisedCandidates.apply(this, arguments);
  }

  function getMaximisedCandidatesDiscogs(_x2) {
    return _getMaximisedCandidatesDiscogs.apply(this, arguments);
  }

  function _getMaximisedCandidatesDiscogs() {
    _getMaximisedCandidatesDiscogs = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(smallurl) {
      var fullSizeURL;
      return regenerator.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return DiscogsProvider.maximiseImage(smallurl);

            case 2:
              fullSizeURL = _context2.sent;
              return _context2.abrupt("return", {
                url: fullSizeURL,
                filename: fullSizeURL.pathname.split('/').at(-1),
                headers: {}
              });

            case 4:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));
    return _getMaximisedCandidatesDiscogs.apply(this, arguments);
  }

  function getFilename(url) {
    return url.pathname.split('/').at(-1) || 'image';
  }

  var _doneImages = /*#__PURE__*/new WeakMap();

  var _lastId = /*#__PURE__*/new WeakMap();

  var _urlAlreadyAdded = /*#__PURE__*/new WeakSet();

  var ImageFetcher = /*#__PURE__*/function () {
    // Monotonically increasing ID to uniquely identify the image. We use this
    // so we can later set the image type.
    function ImageFetcher() {
      _classCallCheck(this, ImageFetcher);

      _classPrivateMethodInitSpec(this, _urlAlreadyAdded);

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
        var _fetchImages = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(url) {
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

                  return _context.abrupt("return", this.fetchImagesFromProvider(url, provider));

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

        function fetchImages(_x) {
          return _fetchImages.apply(this, arguments);
        }

        return fetchImages;
      }()
    }, {
      key: "fetchImageFromURL",
      value: function () {
        var _fetchImageFromURL = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(url) {
          var fetchResult, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, maxCandidate, candidateName, errDesc;

          return regenerator.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  // Attempt to maximise the image
                  fetchResult = null;
                  _iteratorAbruptCompletion = false;
                  _didIteratorError = false;
                  _context2.prev = 3;
                  _iterator = _asyncIterator(getMaximisedCandidates(url));

                case 5:
                  _context2.next = 7;
                  return _iterator.next();

                case 7:
                  if (!(_iteratorAbruptCompletion = !(_step = _context2.sent).done)) {
                    _context2.next = 28;
                    break;
                  }

                  maxCandidate = _step.value;
                  candidateName = maxCandidate.filename || getFilename(maxCandidate.url);

                  if (!_classPrivateMethodGet(this, _urlAlreadyAdded, _urlAlreadyAdded2).call(this, maxCandidate.url)) {
                    _context2.next = 13;
                    break;
                  }

                  LOGGER.warn("".concat(candidateName, " has already been added"));
                  return _context2.abrupt("return");

                case 13:
                  _context2.prev = 13;
                  _context2.next = 16;
                  return this.fetchImageContents(maxCandidate.url, candidateName, maxCandidate.headers);

                case 16:
                  fetchResult = _context2.sent;
                  LOGGER.debug("Maximised ".concat(url.href, " to ").concat(maxCandidate.url.href));
                  return _context2.abrupt("break", 28);

                case 21:
                  _context2.prev = 21;
                  _context2.t0 = _context2["catch"](13);
                  errDesc = _context2.t0 instanceof Error ? _context2.t0.message :
                  /* istanbul ignore next: Not worth it */
                  _context2.t0;
                  LOGGER.warn("Skipping maximised candidate ".concat(candidateName, ": ").concat(errDesc));

                case 25:
                  _iteratorAbruptCompletion = false;
                  _context2.next = 5;
                  break;

                case 28:
                  _context2.next = 34;
                  break;

                case 30:
                  _context2.prev = 30;
                  _context2.t1 = _context2["catch"](3);
                  _didIteratorError = true;
                  _iteratorError = _context2.t1;

                case 34:
                  _context2.prev = 34;
                  _context2.prev = 35;

                  if (!(_iteratorAbruptCompletion && _iterator.return != null)) {
                    _context2.next = 39;
                    break;
                  }

                  _context2.next = 39;
                  return _iterator.return();

                case 39:
                  _context2.prev = 39;

                  if (!_didIteratorError) {
                    _context2.next = 42;
                    break;
                  }

                  throw _iteratorError;

                case 42:
                  return _context2.finish(39);

                case 43:
                  return _context2.finish(34);

                case 44:
                  if (fetchResult) {
                    _context2.next = 48;
                    break;
                  }

                  _context2.next = 47;
                  return this.fetchImageContents(url, getFilename(url), {});

                case 47:
                  fetchResult = _context2.sent;

                case 48:
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

                case 52:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, this, [[3, 30, 34, 44], [13, 21], [35,, 39, 43]]);
        }));

        function fetchImageFromURL(_x2) {
          return _fetchImageFromURL.apply(this, arguments);
        }

        return fetchImageFromURL;
      }()
    }, {
      key: "fetchImagesFromProvider",
      value: function () {
        var _fetchImagesFromProvider = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee3(url, provider) {
          var images, fetchResults, _iterator2, _step2, img, result, errDesc;

          return regenerator.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  LOGGER.info("Searching for images in ".concat(provider.name, " release\u2026")); // This could throw, assuming caller will catch.

                  _context3.next = 3;
                  return provider.findImages(url);

                case 3:
                  images = _context3.sent;
                  LOGGER.info("Found ".concat(images.length, " images in ").concat(provider.name, " release"));
                  fetchResults = [];
                  _iterator2 = _createForOfIteratorHelper(images);
                  _context3.prev = 7;

                  _iterator2.s();

                case 9:
                  if ((_step2 = _iterator2.n()).done) {
                    _context3.next = 29;
                    break;
                  }

                  img = _step2.value;

                  if (!_classPrivateMethodGet(this, _urlAlreadyAdded, _urlAlreadyAdded2).call(this, img.url)) {
                    _context3.next = 14;
                    break;
                  }

                  LOGGER.warn("".concat(getFilename(img.url), " has already been added"));
                  return _context3.abrupt("continue", 27);

                case 14:
                  _context3.prev = 14;
                  _context3.next = 17;
                  return this.fetchImageFromURL(img.url);

                case 17:
                  result = _context3.sent;

                  if (result) {
                    _context3.next = 20;
                    break;
                  }

                  return _context3.abrupt("continue", 27);

                case 20:
                  fetchResults.push(_objectSpread2(_objectSpread2({}, result), {}, {
                    types: img.types,
                    comment: img.comment
                  }));
                  _context3.next = 27;
                  break;

                case 23:
                  _context3.prev = 23;
                  _context3.t0 = _context3["catch"](14);
                  errDesc = _context3.t0 instanceof Error ? _context3.t0.message :
                  /* istanbul ignore next: Not worth it */
                  _context3.t0;
                  LOGGER.warn("Skipping ".concat(getFilename(img.url), ": ").concat(errDesc));

                case 27:
                  _context3.next = 9;
                  break;

                case 29:
                  _context3.next = 34;
                  break;

                case 31:
                  _context3.prev = 31;
                  _context3.t1 = _context3["catch"](7);

                  _iterator2.e(_context3.t1);

                case 34:
                  _context3.prev = 34;

                  _iterator2.f();

                  return _context3.finish(34);

                case 37:
                  _classPrivateFieldGet(this, _doneImages).add(url.href);

                  return _context3.abrupt("return", {
                    containerUrl: url,
                    images: fetchResults
                  });

                case 39:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3, this, [[7, 31, 34, 37], [14, 23]]);
        }));

        function fetchImagesFromProvider(_x3, _x4) {
          return _fetchImagesFromProvider.apply(this, arguments);
        }

        return fetchImagesFromProvider;
      }()
    }, {
      key: "fetchImageContents",
      value: function () {
        var _fetchImageContents = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee4(url, fileName, headers) {
          var _this = this;

          var resp, fetchedUrl, wasRedirected, rawFile;
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
                  return _context4.abrupt("return", new Promise(function (resolve, reject) {
                    MB.CoverArt.validate_file(rawFile).fail(function () {
                      reject(new Error("".concat(fileName, " has an unsupported file type")));
                    }).done(function (mimeType) {
                      var _this$lastId;

                      resolve({
                        requestedUrl: url,
                        fetchedUrl: fetchedUrl,
                        wasRedirected: wasRedirected,
                        file: new File([resp.response], "".concat(fileName, ".").concat((_classPrivateFieldSet(_this, _lastId, (_this$lastId = +_classPrivateFieldGet(_this, _lastId)) + 1), _this$lastId), ".").concat(mimeType.split('/')[1]), {
                          type: mimeType
                        })
                      });
                    });
                  }));

                case 8:
                case "end":
                  return _context4.stop();
              }
            }
          }, _callee4);
        }));

        function fetchImageContents(_x5, _x6, _x7) {
          return _fetchImageContents.apply(this, arguments);
        }

        return fetchImageContents;
      }()
    }]);

    return ImageFetcher;
  }();

  function _urlAlreadyAdded2(url) {
    return _classPrivateFieldGet(this, _doneImages).has(url.href);
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
      var types = JSON.parse(value);

      if (!Array.isArray(types) || types.some(function (type) {
        return typeof type !== 'number';
      })) {
        throw new Error("Invalid 'types' parameter: ".concat(value));
      }

      images[imageIdx].types = JSON.parse(value);
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
        var params = this.images.flatMap(function (image, index) {
          return Object.entries(image).map(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2),
                key = _ref2[0],
                value = _ref2[1];

            return "x_seed.image.".concat(index, ".").concat(key, "=").concat(encodeValue(value));
          });
        });
        var imageParams = params.join('&');

        if (!this.origin) {
          return imageParams;
        }

        return imageParams + '&x_seed.origin=' + encodeURIComponent(this.origin);
      }
    }, {
      key: "createSeedURL",
      value: function createSeedURL(releaseId) {
        return "https://musicbrainz.org/release/".concat(releaseId, "/add-cover-art?").concat(this.encode());
      }
    }], [{
      key: "decode",
      value: function decode(allParams) {
        var _params$find;

        var params = allParams.replace(/^\?/, '').split('&').map(function (param) {
          return param.split('=');
        });
        var imageParams = params.filter(function (_ref3) {
          var _ref4 = _slicedToArray(_ref3, 1),
              k = _ref4[0];

          return k.startsWith('x_seed.image.');
        });
        var images = [];
        imageParams.forEach(function (_ref5) {
          var _ref6 = _slicedToArray(_ref5, 2),
              k = _ref6[0],
              v = _ref6[1];

          try {
            decodeSingleKeyValue(k, decodeURIComponent(v), images);
          } catch (err) {
            LOGGER.error("Invalid image seeding param ".concat(k, "=").concat(v), err);
          }
        }); // Sanity checks: Make sure all images have at least a URL, and condense
        // the array in case indices are missing. We'll condense by looping
        // through the array and pushing any valid image to a new one.

        var imagesCleaned = [];
        images.forEach(function (image, index) {
          // URL could be undefined if it either was never given as a param,
          // or if it was invalid.
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          if (image.url) {
            imagesCleaned.push(image);
          } else {
            LOGGER.warn("Ignoring seeded image ".concat(index, ": No URL provided"));
          }
        });
        var origin = (_params$find = params.find(function (_ref7) {
          var _ref8 = _slicedToArray(_ref7, 1),
              k = _ref8[0];

          return k === 'x_seed.origin';
        })) === null || _params$find === void 0 ? void 0 : _params$find[1];
        return new SeedParameters(imagesCleaned, origin ? decodeURIComponent(origin) : undefined);
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
          var _document$location$se;
          var mbid = (_document$location$se = document.location.search.match(/[?&]release_mbid=([a-f0-9-]+)/)) === null || _document$location$se === void 0 ? void 0 : _document$location$se[1];
          if (!mbid) {
              LOGGER.error('Cannot extract MBID! Seeding is disabled :(');
              return;
          }
          addSeedLinkToCovers(mbid, document.location.href);
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
          var _url$match, _qs$insertAdjacentEle;
          var url, ext, dimensionStr, params, seedUrl, dimSpan, seedLink;
          return regenerator.wrap(function _callee$(_context) {
              while (1) {
                  switch (_context.prev = _context.next) {
                  case 0:
                      url = qs('a.icon', fig).href;
                      ext = (_url$match = url.match(/\.(\w+)$/)) === null || _url$match === void 0 ? void 0 : _url$match[1];
                      _context.next = 4;
                      return getImageDimensions(url);
                  case 4:
                      dimensionStr = _context.sent;
                      params = new SeedParameters([{
                              url: new URL(url),
                              types: [ArtworkTypeIDs.Front]
                          }], origin);
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
                  case 10:
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

  /* istanbul ignore file: Imports TSX, covered by E2E */
  registerSeeder(AtisketSeeder);
  registerSeeder(AtasketSeeder);

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
    // for security reasons
    var dropEvent = $.Event('drop');
    dropEvent.originalEvent = {
      dataTransfer: {
        files: [imageData]
      }
    }; // Note that we're using MB's own jQuery here, not a script-local one.
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

  function fillEditNote(_ref2, origin, editNote) {
    var images = _ref2.images,
        containerUrl = _ref2.containerUrl;
    // Nothing enqueued => Skip edit note altogether
    if (!images.length) return;
    var prefix = '';

    if (containerUrl) {
      prefix = ' * ';
      editNote.addExtraInfo(containerUrl.href);
    } // Limiting to 3 URLs to reduce noise


    var _iterator = _createForOfIteratorHelper(images.slice(0, 3)),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var queuedUrl = _step.value;

        // Prevent noise from data: URLs
        if (queuedUrl.maximisedUrl.protocol === 'data:') {
          editNote.addExtraInfo(prefix + 'Uploaded from data URL');
          continue;
        }

        editNote.addExtraInfo(prefix + queuedUrl.originalUrl.href);

        if (queuedUrl.wasMaximised) {
          editNote.addExtraInfo(' '.repeat(prefix.length) + '→ Maximised to ' + queuedUrl.maximisedUrl.href);
        }

        if (queuedUrl.wasRedirected) {
          editNote.addExtraInfo(' '.repeat(prefix.length) + '→ Redirected to ' + queuedUrl.fetchedUrl.href);
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    if (images.length > 3) {
      editNote.addExtraInfo(prefix + "\u2026and ".concat(images.length - 3, " additional image(s)"));
    }

    if (origin) {
      editNote.addExtraInfo("Seeded from ".concat(origin));
    }

    editNote.addFooter();
  }

  var _note = /*#__PURE__*/new WeakMap();

  var _fetcher = /*#__PURE__*/new WeakMap();

  var _ui = /*#__PURE__*/new WeakMap();

  var App = /*#__PURE__*/function () {
    function App() {
      _classCallCheck(this, App);

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

      _classPrivateFieldSet(this, _note, EditNote.withFooterFromGMInfo());

      _classPrivateFieldSet(this, _fetcher, new ImageFetcher());

      var banner = new StatusBanner();
      LOGGER.addSink(banner);

      _classPrivateFieldSet(this, _ui, new InputForm(banner.htmlElement, this.processURL.bind(this)));
    }

    _createClass(App, [{
      key: "processURL",
      value: function () {
        var _processURL = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(url) {
          var types,
              comment,
              origin,
              fetchResult,
              _args = arguments;
          return regenerator.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  types = _args.length > 1 && _args[1] !== undefined ? _args[1] : [];
                  comment = _args.length > 2 && _args[2] !== undefined ? _args[2] : '';
                  origin = _args.length > 3 && _args[3] !== undefined ? _args[3] : '';
                  _context.prev = 3;
                  _context.next = 6;
                  return _classPrivateFieldGet(this, _fetcher).fetchImages(url);

                case 6:
                  fetchResult = _context.sent;
                  _context.next = 13;
                  break;

                case 9:
                  _context.prev = 9;
                  _context.t0 = _context["catch"](3);
                  LOGGER.error('Failed to grab images', _context.t0);
                  return _context.abrupt("return");

                case 13:
                  _context.prev = 13;
                  _context.next = 16;
                  return enqueueImages(fetchResult, types, comment);

                case 16:
                  _context.next = 22;
                  break;

                case 18:
                  _context.prev = 18;
                  _context.t1 = _context["catch"](13);
                  LOGGER.error('Failed to enqueue images', _context.t1);
                  return _context.abrupt("return");

                case 22:
                  fillEditNote(fetchResult, origin, _classPrivateFieldGet(this, _note));

                  _classPrivateFieldGet(this, _ui).clearOldInputValue(url.href);

                  LOGGER.success("Successfully added ".concat(fetchResult.images.length, " image(s)"));

                case 25:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this, [[3, 9], [13, 18]]);
        }));

        function processURL(_x) {
          return _processURL.apply(this, arguments);
        }

        return processURL;
      }()
    }, {
      key: "processSeedingParameters",
      value: function processSeedingParameters() {
        var _this = this;

        var params = SeedParameters.decode(document.location.search);
        params.images.forEach(function (image) {
          return _this.processURL(image.url, image.types, image.comment, params.origin);
        });
      }
    }, {
      key: "addImportButtons",
      value: function () {
        var _addImportButtons = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2() {
          var _location$href$match,
              _this2 = this;

          var mbid, attachedURLs, supportedURLs;
          return regenerator.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  mbid = (_location$href$match = location.href.match(/musicbrainz\.org\/release\/([a-f0-9-]+)\//)) === null || _location$href$match === void 0 ? void 0 : _location$href$match[1];
                  assertHasValue(mbid);
                  _context2.next = 4;
                  return getURLsForRelease(mbid, {
                    excludeEnded: true,
                    excludeDuplicates: true
                  });

                case 4:
                  attachedURLs = _context2.sent;
                  supportedURLs = attachedURLs.filter(hasProvider);

                  if (supportedURLs.length) {
                    _context2.next = 8;
                    break;
                  }

                  return _context2.abrupt("return");

                case 8:
                  supportedURLs.forEach(function (url) {
                    var provider = getProvider(url);
                    assertHasValue(provider);

                    _classPrivateFieldGet(_this2, _ui).addImportButton(_this2.processURL.bind(_this2, url), url.href, provider);
                  });

                case 9:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2);
        }));

        function addImportButtons() {
          return _addImportButtons.apply(this, arguments);
        }

        return addImportButtons;
      }()
    }]);

    return App;
  }();

  LOGGER.configure({
    logLevel: LogLevel.DEBUG 
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

  if (document.location.hostname.endsWith('musicbrainz.org')) {
    runOnMB();
  } else {
    runOnSeederPage();
  }

}());
