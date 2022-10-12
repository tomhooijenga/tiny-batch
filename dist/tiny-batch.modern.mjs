/**
 * Queues a flush in the microtask queue at the first call.
 */
const microtaskScheduler = () => {
  return (queue, flush) => {
    if (queue.length === 1) {
      queueMicrotask(flush);
    }
  };
};
/**
 * Flushes every given ms, regardless of the queue.
 */
const intervalScheduler = ms => {
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
/**
 * Waits the given amount of ms after the first call to flush.
 */
const timeoutScheduler = ms => {
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
/**
 * Flushes after the given amount of calls.
 * @param max
 */
const amountScheduler = max => {
  return (queue, flush) => {
    if (queue.length === max) {
      flush();
    }
  };
};

class Queue {
  constructor() {
    this.args = [];
    this.resolvers = [];
  }
  add(args, resolve, reject) {
    this.args.push(args);
    this.resolvers.push({
      resolve,
      reject
    });
  }
  reset() {
    const args = this.args.splice(0);
    const resolvers = this.resolvers.splice(0);
    return {
      args,
      resolvers
    };
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
  fn.flush = () => {
    if (queue.isEmpty()) {
      return;
    }
    const {
      args,
      resolvers
    } = queue.reset();
    Promise.resolve(callback(args)).then(results => {
      results.forEach((result, index) => {
        const {
          resolve,
          reject
        } = resolvers[index];
        if (result instanceof Error) {
          reject(result);
        } else {
          resolve(result);
        }
      });
    });
  };
  return fn;
}

export { amountScheduler, tinybatch as default, intervalScheduler, microtaskScheduler, timeoutScheduler, tinybatch };
//# sourceMappingURL=tiny-batch.modern.mjs.map
