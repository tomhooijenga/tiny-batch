import {AddToBatch, ExecuteBatch, Scheduler} from "./types";
import {microtaskScheduler} from "./schedulers";
import {Queue} from "./queue";

export * from "./schedulers";
export * from "./types";

export function tinybatch<
    Result,
    Args extends unknown[] = []
>(
    callback: ExecuteBatch<Result, Args>,
    scheduler: Scheduler = microtaskScheduler()
): AddToBatch<Result, Args> {

    const queue = new Queue<Result, Args>();

    const fn: AddToBatch<Result, Args> = (...args: Args) => {
        return new Promise<Result>((resolve => {
            queue.add(args, resolve);

            scheduler(queue.args, fn.flush);
        }));
    };

    fn.queue = queue;
    fn.scheduler = scheduler;
    fn.flush = () => {
        if (queue.isEmpty()) {
            return;
        }

        const {args, resolvers} = queue.reset();

        Promise
            .resolve(callback(args))
            .then((results) => {
                results.forEach((args, index) => {
                    resolvers[index](args);
                });
            });
    };

    return fn;
}

export default tinybatch;
