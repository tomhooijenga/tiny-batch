import { Queue } from "./queue";
export declare type ExecuteBatch<Result, Args> = (args: Args[]) => Result[] | Promise<Result[]>;
export declare type Scheduler = (queue: any[][], flush: () => void) => void;
export declare type Resolve<Result> = (value: Result | PromiseLike<Result>) => void;
export declare type Reject = (reason?: any) => void;
export interface AddToBatch<Result, Args extends unknown[]> {
    (...args: Args): Promise<Result>;
    queue: Queue<Result, Args>;
    scheduler: Scheduler;
    flush(): void;
}
