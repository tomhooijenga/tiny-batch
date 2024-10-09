import { AddToBatch, ExecuteBatch, Scheduler } from "./types";
export * from "./schedulers";
export * from "./types";
export declare function tinybatch<Args extends unknown[], Result>(callback: ExecuteBatch<Args, Result>, scheduler?: Scheduler): AddToBatch<Args, Result>;
export default tinybatch;
