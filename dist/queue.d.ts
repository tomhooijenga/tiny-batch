import { Reject, Resolve } from "./types";
export declare class Queue<Result, Args> {
    readonly args: Args[];
    readonly resolvers: {
        resolve: Resolve<Result>;
        reject: Reject;
    }[];
    add(args: Args, resolve: Resolve<Result>, reject: Reject): void;
    reset(): {
        args: Args[];
        resolvers: {
            resolve: Resolve<Result>;
            reject: Reject;
        }[];
    };
    isEmpty(): boolean;
    get length(): number;
}
