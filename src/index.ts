import {AddToBatch, ExecuteBatch, Scheduler} from "./types";
import {microtaskScheduler} from "./schedulers";
import {Queue} from "./queue";

export * from "./schedulers";
export * from "./types";

export function tinybatch<
    Args extends unknown[],
    Result = void,
>(
    callback: ExecuteBatch<Args, Result>,
    scheduler: Scheduler = microtaskScheduler()
): AddToBatch<Args, Result> {

    const queue = new Queue<Args, Result>();

    const fn: AddToBatch<Args, Result> = (...args) => {
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

        const {args, resolvers} = queue.reset();
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

export default tinybatch;
