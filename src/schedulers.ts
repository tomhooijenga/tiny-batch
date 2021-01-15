import {Scheduler} from "./types";

/**
 * Queues a flush in the microtask queue at the first call.
 */
export const microtaskScheduler = (): Scheduler => {
    return (queue, flush) => {
        if (queue.length === 1) {
            queueMicrotask(flush);
        }
    }
}

/**
 * Flushes every given ms, regardless of the queue.
 */
export const intervalScheduler = (ms: number): Scheduler & { stop(): void } => {
    let timerId: number | undefined;
    const fn: Scheduler & { stop(): void } = (queue, flush) => {
        if (queue.length === 1) {
            timerId = setInterval(flush, ms);
        }
    }
    fn.stop = () => {
        clearInterval(timerId);
        timerId = undefined;
    }

    return fn;
}
/**
 * Waits the given amount of ms after the first call to flush.
 */
export const timeoutScheduler = (ms: number): Scheduler & { stop(): void } => {
    let timerId: number | undefined;
    const fn: Scheduler & { stop(): void } = (queue, flush) => {
        if (queue.length === 1) {
            timerId = setTimeout(flush, ms);
        }
    }
    fn.stop = () => {
        clearTimeout(timerId);
        timerId = undefined;
    }

    return fn;
}

/**
 * Flushes after the given amount of calls.
 * @param max
 */
export const amountScheduler = (max: number): Scheduler => {
    return (queue, flush) => {
        if (queue.length === max) {
            flush();
        }
    }
}
