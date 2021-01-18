import {Reject, Resolve} from "./types";

export class Queue<Result, Args> {
    readonly args: Args[] = [];
    readonly resolvers: {resolve: Resolve<Result>; reject: Reject}[] = [];

    add(args: Args, resolve: Resolve<Result>, reject: Reject): void {
        this.args.push(args);
        this.resolvers.push({resolve, reject});
    }

    reset(): {args: Args[]; resolvers: {resolve: Resolve<Result>; reject: Reject}[]} {
        const args = this.args.splice(0);
        const resolvers = this.resolvers.splice(0);

        return {args, resolvers};
    }

    isEmpty(): boolean {
        return this.args.length === 0;
    }

    get length(): number {
        return this.args.length;
    }
}
