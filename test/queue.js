require("should");
require("should-sinon");
const Queue = require("../src/queue.ts").Queue;

describe("queue", () => {
    let queue;

    const args = [1, 2];
    const resolver = () => {};

    beforeEach(() => {
        queue = new Queue();
    });

    it("should construct", () => {
        queue.args.should.be.Array();
        queue.resolvers.should.be.Array();
    });

    it("should add", () => {
        queue.add(args, resolver);

        queue.args.should.containEql(args);
        queue.resolvers.should.containEql(resolver);
    });

    it("should have length", () => {
        queue.length.should.eql(0);

        queue.add(args, resolver);

        queue.length.should.eql(1);
    });

    it("should determine empty", () => {
        queue.isEmpty().should.be.True();

        queue.add(args, resolver);

        queue.isEmpty().should.be.False();
    });

    it("should reset", () => {
        queue.add(args, resolver);

        const {args: resetArgs, resolvers: resetResolvers} = queue.reset();

        resetArgs.should.eql([args]);
        resetResolvers.should.eql([resolver]);

        queue.length.should.eql(0);
        queue.args.should.be.size(0);
        queue.resolvers.should.be.size(0);
    });
});
