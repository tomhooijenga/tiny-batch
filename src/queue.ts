import { Reject, Resolve, Resolver } from "./types";

export class Queue<Args, Result> {
  readonly args: Args[] = [];
  readonly resolvers: Resolver<Result>[] = [];

  add(args: Args, resolve: Resolve<Result>, reject: Reject): void {
    this.args.push(args);
    this.resolvers.push({ resolve, reject });
  }

  reset(): { args: Args[]; resolvers: Resolver<Result>[] } {
    const args = this.args.splice(0);
    const resolvers = this.resolvers.splice(0);

    return { args, resolvers };
  }

  isEmpty(): boolean {
    return this.args.length === 0;
  }

  get length(): number {
    return this.args.length;
  }
}
