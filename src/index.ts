import {AddToBatch, BatchEntry, ExecuteBatch, Scheduler} from "./types";
import {microtaskScheduler} from "./schedulers";

export * from "./schedulers";

export function tinyBatch<
    Result,
    Args extends unknown[] = []
>(
    callback: ExecuteBatch<Result, Args>,
    scheduler: Scheduler = microtaskScheduler()
): AddToBatch<Result, Args> {
    const queue: BatchEntry<Result, Args>[] = [];

    const fn: AddToBatch<Result, Args> = (...args: Args) => {
        return new Promise<Result>((resolve => {
            queue.push({args, resolve});

            scheduler(queue, fn.flush);
        }))
    };

    fn.queue = queue;
    fn.flush = () => {
        if (queue.length === 0) {
            return;
        }

        const oldQueue = [...queue];
        const batchedArgs = queue.map(({args}) => args);
        queue.length = 0;

        callback(batchedArgs).then((results) => {
            results.forEach((result, index) => {
                oldQueue[index].resolve(result);
            });
        });
    }

    return fn;
}

export default tinyBatch;
