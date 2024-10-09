import { Queue } from "./queue";
export type ExecuteBatch<Args extends unknown[], Result> = (args: Args[]) => Result[] | Promise<Result[]> | undefined;
export interface AddToBatch<Args extends unknown[], Result> {
    (...args: Args): Promise<Result>;
    queue: Queue<Args, Result>;
    scheduler: Scheduler;
    flush(): void;
}
export type Scheduler = (queue: unknown[][], flush: () => void) => void;
export type Resolve<Result> = (value: Result | PromiseLike<Result>) => void;
export type Reject = (reason?: unknown) => void;
export type Resolver<Result> = {
    resolve: Resolve<Result>;
    reject: Reject;
};
