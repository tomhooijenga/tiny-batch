(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.tinyBatch = {}));
}(this, (function (exports) {
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

    var Queue = /*#__PURE__*/function () {
      function Queue() {
        this.args = [];
        this.resolvers = [];
      }

      var _proto = Queue.prototype;

      _proto.add = function add(args, resolver) {
        this.args.push(args);
        this.resolvers.push(resolver);
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

      _createClass(Queue, [{
        key: "length",
        get: function get() {
          return this.args.length;
        }
      }]);

      return Queue;
    }();

    function tinybatch(callback, scheduler) {
      if (scheduler === void 0) {
        scheduler = microtaskScheduler();
      }

      var queue = new Queue();

      var fn = function fn() {
        var _arguments = arguments;
        return new Promise(function (resolve) {
          queue.add([].slice.call(_arguments), resolve);
          scheduler(queue.args, fn.flush);
        });
      };

      fn.queue = queue;
      fn.scheduler = scheduler;

      fn.flush = function () {
        if (queue.isEmpty()) {
          return;
        }

        var _queue$reset = queue.reset(),
            args = _queue$reset.args,
            resolvers = _queue$reset.resolvers;

        Promise.resolve(callback(args)).then(function (results) {
          results.forEach(function (args, index) {
            resolvers[index](args);
          });
        });
      };

      return fn;
    }

    exports.amountScheduler = amountScheduler;
    exports.default = tinybatch;
    exports.intervalScheduler = intervalScheduler;
    exports.microtaskScheduler = microtaskScheduler;
    exports.timeoutScheduler = timeoutScheduler;
    exports.tinybatch = tinybatch;

})));
//# sourceMappingURL=tiny-batch.umd.js.map
