"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const microtaskScheduler = () => {
  return (queue, flush) => {
    if (queue.length === 1) {
      queueMicrotask(flush);
    }
  };
};
const intervalScheduler = (ms) => {
  let timerId;
  const fn = (queue, flush) => {
    if (queue.length === 1) {
      timerId = setInterval(flush, ms);
    }
  };
  fn.stop = () => {
    clearInterval(timerId);
  };
  return fn;
};
const timeoutScheduler = (ms) => {
  let timerId;
  const fn = (queue, flush) => {
    if (queue.length === 1) {
      timerId = setTimeout(flush, ms);
    }
  };
  fn.stop = () => {
    clearTimeout(timerId);
  };
  return fn;
};
const amountScheduler = (max) => {
  return (queue, flush) => {
    if (queue.length === max) {
      flush();
    }
  };
};
class Queue {
  args = [];
  resolvers = [];
  add(args, resolve, reject) {
    this.args.push(args);
    this.resolvers.push({ resolve, reject });
  }
  reset() {
    const args = this.args.splice(0);
    const resolvers = this.resolvers.splice(0);
    return { args, resolvers };
  }
  isEmpty() {
    return this.args.length === 0;
  }
  get length() {
    return this.args.length;
  }
}
function tinybatch(callback, scheduler = microtaskScheduler()) {
  const queue = new Queue();
  const fn = (...args) => {
    return new Promise((resolve, reject) => {
      queue.add(args, resolve, reject);
      scheduler(queue.args, fn.flush);
    });
  };
  fn.queue = queue;
  fn.scheduler = scheduler;
  fn.flush = async () => {
    if (queue.isEmpty()) {
      return;
    }
    const { args, resolvers } = queue.reset();
    const results = await callback(args) ?? [];
    for (let i = 0; i < resolvers.length; i++) {
      const { resolve, reject } = resolvers[i];
      const result = results[i];
      if (result instanceof Error) {
        reject(result);
      } else {
        resolve(result);
      }
    }
  };
  return fn;
}
exports.amountScheduler = amountScheduler;
exports.default = tinybatch;
exports.intervalScheduler = intervalScheduler;
exports.microtaskScheduler = microtaskScheduler;
exports.timeoutScheduler = timeoutScheduler;
exports.tinybatch = tinybatch;
//# sourceMappingURL=tiny-batch.js.map
