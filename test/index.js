require('should');
require('should-sinon');
const sinon = require('sinon');
const tinyBatch = require('../src').tinybatch;

describe('tinybatch', () => {

    let callback;

    beforeEach(() => {
        callback = sinon.stub().resolvesArg(0);
    });

    it('should create a batcher', () => {
        const batched = tinyBatch(callback);

        batched.should.be.Function();

        batched.should.have.key('flush');
        batched.flush.should.be.Function();

        batched.should.have.key('queue');
        batched.queue.should.be.Array();
    });

    it('should batch', async () => {
        const batched = tinyBatch(callback);

        const b1 = batched(1);
        const b2 = batched(2);

        await Promise.resolve();
        callback.should.be.calledWith([[1], [2]]);

        await b1.should.eventually.eql([1]);
        await b2.should.eventually.eql([2]);
    });

    it('should not flush empty queue', async () => {
        const batched = tinyBatch(callback);
        batched.flush();
        callback.should.not.be.called();
    });

    it('should update the queue', async () => {
        const batched = tinyBatch(callback);

        batched.queue.should.be.size(0);

        batched(1);
        batched(2);

        batched.queue.should.be.size(2);

        await Promise.resolve();
        batched.queue.should.be.size(0);
    });

    it('should flush manually', async () => {
        const batched = tinyBatch(callback);
        const b1 = batched(1);
        batched.flush();
        callback.should.be.calledOnce();

        await b1.should.eventually.eql([1]);
    });

    it('should call scheduler', async () => {
        const scheduler = sinon.spy((queue, flush) => {
            queue.should.be.an.Array()
                .and.equal(batched.queue);
            flush.should.be.a.Function()
                .equal(batched.flush);

            flush(queue);
        });
        const batched = tinyBatch(callback, scheduler);

        const b1 = batched(1);
        batched.queue.should.be.size(0);
        const b2 = batched(2);
        batched.queue.should.be.size(0);

        callback.should.be.calledTwice();
        scheduler.should.be.calledTwice();

        await Promise.all([
            b1.should.eventually.eql([1]),
            b2.should.eventually.eql([2]),
        ]);
    });
});
