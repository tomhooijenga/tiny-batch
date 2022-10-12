import {Queue} from "./queue";

export type ExecuteBatch<Result, Args> = (args: Args[]) => Result[] | Promise<Result[]>;

export type Scheduler = (queue: unknown[][], flush: () => void) => void;

export type Resolve<Result> = (value: Result | PromiseLike<Result>) => void;

export type Reject = (reason?: unknown) => void;

export interface AddToBatch<Result, Args extends unknown[]> {
    (...args: Args): Promise<Result>;

    queue: Queue<Result, Args>;

    scheduler: Scheduler;

    flush(): void
}

