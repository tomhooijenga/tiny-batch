import { Scheduler } from "./types";
/**
 * Queues a flush in the microtask queue at the first call.
 */
export declare const microtaskScheduler: () => Scheduler;
/**
 * Flushes every given ms, regardless of the queue.
 */
export declare const intervalScheduler: (ms: number) => Scheduler & {
    stop(): void;
};
/**
 * Waits the given amount of ms after the first call to flush.
 */
export declare const timeoutScheduler: (ms: number) => Scheduler & {
    stop(): void;
};
/**
 * Flushes after the given amount of calls.
 * @param max
 */
export declare const amountScheduler: (max: number) => Scheduler;
