export type ExecuteBatch<Result, Args> = (args: Args[]) => Promise<Result[]>;

export interface AddToBatch<Result, Args extends unknown[]> {
    (...args: Args): Promise<Result>;
    queue: BatchEntry<Result, Args>[];
    flush(): void
}

export interface BatchEntry<Result, Args> {
    args: Args,
    resolve: (value: Result) => void
}

export type Scheduler = (queue: unknown[], flush: () => void) => void;
