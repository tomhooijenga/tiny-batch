/**
 * Queues a flush in the microtask queue at the first call.
 */
var microtaskScheduler = function microtaskScheduler() {
  return function (queue, flush) {
    if (queue.length === 1) {
      queueMicrotask(flush);
    }
  };
};
/**
 * Flushes every given ms, regardless of the queue.
 */
var intervalScheduler = function intervalScheduler(ms) {
  var timerId;
  var fn = function fn(queue, flush) {
    if (queue.length === 1) {
      timerId = setInterval(flush, ms);
    }
  };
  fn.stop = function () {
    clearInterval(timerId);
  };
  return fn;
};
/**
 * Waits the given amount of ms after the first call to flush.
 */
var timeoutScheduler = function timeoutScheduler(ms) {
  var timerId;
  var fn = function fn(queue, flush) {
    if (queue.length === 1) {
      timerId = setTimeout(flush, ms);
    }
  };
  fn.stop = function () {
    clearTimeout(timerId);
  };
  return fn;
};
/**
 * Flushes after the given amount of calls.
 * @param max
 */
var amountScheduler = function amountScheduler(max) {
  return function (queue, flush) {
    if (queue.length === max) {
      flush();
    }
  };
};

function _defineProperties(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t];
    o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o);
  }
}
function _createClass(e, r, t) {
  return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
    writable: !1
  }), e;
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}

var Queue = /*#__PURE__*/function () {
  function Queue() {
    this.args = [];
    this.resolvers = [];
  }
  var _proto = Queue.prototype;
  _proto.add = function add(args, resolve, reject) {
    this.args.push(args);
    this.resolvers.push({
      resolve: resolve,
      reject: reject
    });
  };
  _proto.reset = function reset() {
    var args = this.args.splice(0);
    var resolvers = this.resolvers.splice(0);
    return {
      args: args,
      resolvers: resolvers
    };
  };
  _proto.isEmpty = function isEmpty() {
    return this.args.length === 0;
  };
  return _createClass(Queue, [{
    key: "length",
    get: function get() {
      return this.args.length;
    }
  }]);
}();

function tinybatch(callback, scheduler) {
  if (scheduler === void 0) {
    scheduler = microtaskScheduler();
  }
  var queue = new Queue();
  var _fn = function fn() {
    var _arguments = arguments;
    return new Promise(function (resolve, reject) {
      queue.add([].slice.call(_arguments), resolve, reject);
      scheduler(queue.args, _fn.flush);
    });
  };
  _fn.queue = queue;
  _fn.scheduler = scheduler;
  _fn.flush = function () {
    if (queue.isEmpty()) {
      return;
    }
    var _queue$reset = queue.reset(),
      args = _queue$reset.args,
      resolvers = _queue$reset.resolvers;
    Promise.resolve(callback(args)).then(function (results) {
      results.forEach(function (result, index) {
        var _resolvers$index = resolvers[index],
          resolve = _resolvers$index.resolve,
          reject = _resolvers$index.reject;
        if (result instanceof Error) {
          reject(result);
        } else {
          resolve(result);
        }
      });
    });
  };
  return _fn;
}

export { amountScheduler, tinybatch as default, intervalScheduler, microtaskScheduler, timeoutScheduler, tinybatch };
//# sourceMappingURL=tiny-batch.module.js.map
