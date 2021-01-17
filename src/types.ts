import {Queue} from "./queue";

export type ExecuteBatch<Result, Args> = (args: Args[]) => Promise<Result[]>;

export type Scheduler = (queue: any[][], flush: () => void) => void;

export type Resolver<Result> = (value: Result | PromiseLike<Result>) => void;

export interface AddToBatch<Result, Args extends unknown[]> {
    (...args: Args): Promise<Result>;

    queue: Queue<Result, Args>;

    scheduler: Scheduler;

    flush(): void
}

