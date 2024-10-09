import { Reject, Resolve, Resolver } from "./types";
export declare class Queue<Args, Result> {
    readonly args: Args[];
    readonly resolvers: Resolver<Result>[];
    add(args: Args, resolve: Resolve<Result>, reject: Reject): void;
    reset(): {
        args: Args[];
        resolvers: Resolver<Result>[];
    };
    isEmpty(): boolean;
    get length(): number;
}
