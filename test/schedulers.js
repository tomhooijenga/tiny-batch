const should = require('should');
const sinon = require('sinon');
const timers = require("@sinonjs/fake-timers");
const {microtaskScheduler, intervalScheduler, timeoutScheduler, amountScheduler} = require('../src');
require('should-sinon');

describe('schedulers', () => {
    const QUEUE = [{}];

    let flush;
    beforeEach(() => {
        flush = sinon.stub();
    });

    describe('microtaskScheduler', function () {
        const scheduler = microtaskScheduler();

        it('should flush', async () => {
            const flush = sinon.stub();

            scheduler(QUEUE, flush);
            flush.should.not.be.called();
            await Promise.resolve();
            flush.should.be.calledOnce();
        });
    });

    describe('amountScheduler', () => {
        const scheduler = amountScheduler(2);

        it('should flush', () => {
            scheduler(QUEUE, flush);
            flush.should.not.be.called();
            scheduler([{}, {}], flush);
            flush.should.be.calledOnce();
        });
    });

    describe('timers', () => {
        const MS = 100;
        let flush;
        let clock;

        beforeEach(() => {
            clock = timers.install();
            flush = sinon.stub();
        });

        after(() => {
            clock.uninstall();
        });

        describe('intervalScheduler', () => {
            const scheduler = intervalScheduler(MS);

            it('should flush', () => {
                scheduler(QUEUE, flush);
                flush.should.not.be.called();
                clock.next();
                flush.should.be.calledOnce();
                clock.next();
                flush.should.be.calledTwice();
            });

            it('should not create multiple intervals', () => {
                sinon.spy(global, 'setInterval');

                scheduler(QUEUE, flush);
                setInterval.should.be.calledOnce();
                scheduler([{}, {}], flush);
                setInterval.should.be.calledOnce();

                setInterval.restore();
            });

            it('stop and resume', async () => {
                scheduler(QUEUE, flush);
                scheduler.stop();
                clock.next();
                flush.should.not.be.called();

                scheduler(QUEUE, flush);
                clock.next();
                flush.should.be.calledOnce();
            });
        });

        describe('timeoutScheduler', () => {
            const scheduler = timeoutScheduler(MS);

            it('should flush', () => {
                scheduler(QUEUE, flush);
                flush.should.not.be.called();
                clock.next();
                flush.should.be.calledOnce();
            });

            it('should not create multiple timeouts', () => {
                sinon.spy(global, 'setTimeout');

                scheduler(QUEUE, flush);
                setTimeout.should.be.calledOnce();
                scheduler([{}, {}], flush);
                setTimeout.should.be.calledOnce();

                setTimeout.restore();
            });

            it('stop and resume', async () => {
                scheduler(QUEUE, flush);
                scheduler.stop();
                clock.next();
                flush.should.not.be.called();

                scheduler(QUEUE, flush);
                clock.next();
                flush.should.be.calledOnce();
            });
        });
    });
});



