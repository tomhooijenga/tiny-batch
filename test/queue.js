require("should");
require("should-sinon");
const Queue = require("../src/queue.ts").Queue;

describe("queue", () => {
    let queue;

    const args = [1, 2];
    const resolve = () => {};
    const reject = () => {};

    beforeEach(() => {
        queue = new Queue();
    });

    it("should create a queue", () => {
        queue.args.should.be.Array();
        queue.resolvers.should.be.Array();
    });

    it("should add", () => {
        queue.add(args, resolve, reject);

        queue.args.should.containEql(args);
        queue.resolvers.should.be.size(1);
    });

    it("should have length", () => {
        queue.length.should.eql(0);

        queue.add(args, resolve, reject);

        queue.length.should.eql(1);
    });

    it("should determine empty", () => {
        queue.isEmpty().should.be.True();

        queue.add(args, resolve, reject);

        queue.isEmpty().should.be.False();
    });

    it("should reset", () => {
        queue.add(args, resolve, reject);

        const {args: resetArgs, resolvers: resetResolvers} = queue.reset();

        resetArgs.should.eql([args]);
        resetResolvers.should.eql([{resolve, reject}]);

        queue.length.should.eql(0);
        queue.args.should.be.size(0);
        queue.resolvers.should.be.size(0);
    });
});
