"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.amountScheduler = exports.timeoutScheduler = exports.intervalScheduler = exports.microtaskScheduler = void 0;
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
exports.microtaskScheduler = microtaskScheduler;
/**
 * Flushes every given ms, regardless of the queue.
 */
const intervalScheduler = (ms) => {
    let timerId;
    const fn = (queue, flush) => {
        if (queue.length === 1) {
            timerId = setInterval(flush, ms);
        }
    };
    fn.stop = () => {
        clearInterval(timerId);
        timerId = undefined;
    };
    return fn;
};
exports.intervalScheduler = intervalScheduler;
/**
 * Waits the given amount of ms after the first call to flush.
 */
const timeoutScheduler = (ms) => {
    let timerId;
    const fn = (queue, flush) => {
        if (queue.length === 1) {
            timerId = setTimeout(flush, ms);
        }
    };
    fn.stop = () => {
        clearTimeout(timerId);
        timerId = undefined;
    };
    return fn;
};
exports.timeoutScheduler = timeoutScheduler;
/**
 * Flushes after the given amount of calls.
 * @param max
 */
const amountScheduler = (max) => {
    return (queue, flush) => {
        if (queue.length === max) {
            flush();
        }
    };
};
exports.amountScheduler = amountScheduler;
