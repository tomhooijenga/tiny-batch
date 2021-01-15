export declare type ExecuteBatch<Result, Args> = (args: Args[]) => Promise<Result[]>;
export declare type Scheduler = (queue: BatchEntry<any, any[]>[], flush: () => void) => void;
export interface BatchEntry<Result, Args> {
    args: Args;
    resolve: (value: Result) => void;
}
export interface AddToBatch<Result, Args extends unknown[]> {
    (...args: Args): Promise<Result>;
    queue: BatchEntry<Result, Args>[];
    flush(): void;
}
