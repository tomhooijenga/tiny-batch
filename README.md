# Installation
```shell script
npm install @teamawesome/tiny-batch
```
# tiny-batch
tiny-batch is a utility to create functions of which the execution is batched. This can be very useful for instance to
limit the amount of queries or http requests while still having a single, easy to use function.

# Usage
Call `tinybatch` to create an async function that adds to the batch. The first argument is a callback that will handle the batching.
```ts
import tinybatch from '@teamawesome/tiny-batch';

const batchedFunc = tinybatch((batchedArgs) => {
    // code
});
```
For example, fetch users from different components with a single request:
```ts
import tinybatch from '@teamawesome/tiny-batch';

const getUserById = tinybatch((batchedArgs) => {
  // batchedArgs equals [[1], [2]]
  const userIds = batchedArgs.flat();

  return fetch(`api/${userIds}`)
          .then(response => response.json())
          .then(json => json.users);
});

const user1 = await getUserById(1);
const user2 = await getUserById(2);
```

## Callback
Each call of the batched function adds its arguments to the queue as-is. The callback then gets an array of all these
arguments. The callback must return an `array` or a `promise of an array`. The return value will be used to _resolve_
the batched function calls in the same order. If an entry is `instanceof Error`, the call will be _rejected_.

```ts
import tinybatch from '@teamawesome/tiny-batch';

const batchedFunc = tinybatch((batchedArgs) => {
    // batchedArgs equals
    // [
    //  [1, 2, 3],
    //  ["a", "b", "c"]
    // ]
    
    return batchedArgs.map((_, index) => `${index} done!`);
});

await first = batchedFunc(1, 2, 3); // 0 done!
await second = batchedFunc("a", "b", "c"); // 1 done!
```

## Scheduler
`tinybatch` has a second argument to specify a scheduler. A scheduler determines when to execute the callback. The
scheduler is called each time an entry is added to the batch. `tinybatch` comes with some scheduler factories out of the box:

|name|description|
|---|---|
|`microtaskScheduler()`|(default) Queues a flush in the microtask queue at the first call.|
|`intervalScheduler(ms)`|Flushes every given ms, regardless of the queue. The timer can be cleared with the `stop()` method.|
|`timeoutScheduler(ms)`|Waits the given amount of ms after the first call to flush. The timer can be cleared with the `stop()` method.|
|`amountScheduler(amount)`|Flushes after the given amount of calls.|


```ts
import {tinybatch, amountScheduler} from '@teamawesome/tiny-batch';

// Get users in batches of 10.
const getUserById = tinybatch(
    (batchedArgs) => {
        // code
    },
    amountScheduler(10)
);
```

## Batched Function
The queue can be manually flushed. This will execute the callback regardless of the scheduler. Note that the callback is
never called if the queue is empty.
```ts
batchedFunc.flush();
```
The queue can also be inspected.
```ts
console.log(batchedFunc.queue);
```
The scheduler of a tinybatch is available. Some schedulers have extra methods, for instance to clear timers.
```ts
console.log(batchedFunc.scheduler);
```

# Caching
To reduce overhead even more, caching can be introduced. While this is not supported directly by tiny-batch, it is very
simple to achieve. Use any of the memoization libraries available. For example, [memoizee](https://www.npmjs.com/package/memoizee);
```ts
import memoizee from 'memoizee';

const batched = tinybatch((args) => {
    // code
});
const batchedAndCached = memoizee(batched, {
    // Set the amount of arguments that "batchedAndCached" will receive.
    length: 1
});

await batchedAndCached('once');
await batchedAndCached('once');
```
The second call is not added to the queue but will resolve with the same value.

# Types
```ts
export declare function tinybatch<
    Result,
    Args extends unknown[] = []
    >(
    callback: ExecuteBatch<Result, Args>,
    scheduler: Scheduler = microtaskScheduler()
): AddToBatch<Result, Args>;

export declare type ExecuteBatch<Result, Args> = (args: Args[]) => Promise<Result[]>;

export declare type Scheduler = (queue: any[][], flush: () => void) => void;

export declare type Resolve<Result> = (value: Result | PromiseLike<Result>) => void;

export declare type Reject = (reason?: any) => void;

export interface AddToBatch<Result, Args extends unknown[]> {
    (...args: Args): Promise<Result>;
    queue: Queue<Result, Args>;
    flush(): void;
}

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
```
