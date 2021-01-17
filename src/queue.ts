import {Resolver} from "./types";

export class Queue<Result, Args> {
    args: Args[] = [];
    resolvers: Resolver<Result>[] = [];

    add(args: Args, resolver: Resolver<Result>): void {
        this.args.push(args);
        this.resolvers.push(resolver);
    }

    reset(): {args: Args[]; resolvers: Resolver<Result>[]} {
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
