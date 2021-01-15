import { AddToBatch, ExecuteBatch, Scheduler } from "./types";
export * from "./schedulers";
export * from "./types";
export declare function tinybatch<Result, Args extends unknown[] = []>(callback: ExecuteBatch<Result, Args>, scheduler?: Scheduler): AddToBatch<Result, Args>;
export default tinybatch;
