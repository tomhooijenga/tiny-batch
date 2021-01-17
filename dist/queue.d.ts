import { Resolver } from "./types";
export declare class Queue<Result, Args> {
    readonly args: Args[];
    readonly resolvers: Resolver<Result>[];
    add(args: Args, resolver: Resolver<Result>): void;
    reset(): {
        args: Args[];
        resolvers: Resolver<Result>[];
    };
    isEmpty(): boolean;
    get length(): number;
}
