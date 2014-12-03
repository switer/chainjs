var chai = require('chai')
var Chain = require('../chain.js')

assert = chai.assert

describe('chainjs', function () {
    /**
     *  comment
     **/
    describe('#Constructor', function () {
        it('Run first step after start', function (done) {
            Chain(function (chain) {
                done()
            })
            .start()
        })
        it('Run after all handlers done in last step', function (done) {
            var count = 0
            Chain(function (chain) {
                setTimeout( function() {
                    count ++
                    chain.next()
                }, 100);
                    
            }, function (chain) {
                setTimeout( function() {
                    count ++
                    chain.next()
                }, 200);
            }, function (chain) {
                setTimeout( function() {
                    count ++
                    chain.next()
                }, 300);
            })
            .then(function () {
                assert.equal(count, 3, 'Not all handlers done')
                done()
            })
            .start()
        })
    })
    /**
     *  comment
     **/
    describe('#next', function () {
        it('next run only once', function (done) {
            var once = false
            Chain(function (chain) {

                chain.next()

                setTimeout( function() {
                    chain.next()
                })
                    
                chain.next()
            })
            .then(function () {
                if (once) {
                    assert(false, 'chain.next run only once')
                    return
                }
                once = true
                done()
            })
            .start()
        })
        it('Pass data to next step through chai.next(data)', function () {
            var once = false
            Chain(function (chain) {
                chain.next('switer')
            })
            .then(function (chain, data) {
                assert.equal(data, 'switer', 'Uncorrect passed data from last step')
            })
            .start()
        })
        it('Pass next data to final step through chai.next(data) when chain has no next step', function () {
            Chain(function (chain) {
                chain.next('switer')
            })
            .final(function (chain, data) {
                assert.equal(data, 'switer', 'Uncorrect passed data from last step')
            })
            .start()
        })
    })
    /**
     *  comment
     **/
    describe('#context', function () {
        var ctx = {}
        it('Use custom context', function () {
            Chain(function (chain) {
                assert.equal(this, ctx)
            })
            .context(ctx)
            .start()
        })
    })
    /**
     *  comment
     **/
    describe('#data', function () {
        var ctx = {}
        it('Set a data and get it in another step', function () {
            var step2 = false
            Chain(function (chain) {
                chain.data('mydata', 'value')
            })
            .then(function (chain) {
                chain.data('mydata2', 'value2')
            })
            .final(function (chain, data) {
                var data1 = chain.data('mydata')
                var data2 = chain.data('mydata2')
                assert(data1 === 'value' && data2 === 'value2', 'Data value is uncorrect')
            })
            .start()
        })
    })
    /**
     *  comment
     **/
    describe('#destroy', function () {
        var ctx = {}
        it('Stop everthing of current chain after calling destroy', function () {
            var step2 = false
            Chain(function (chain) {
                chain.destroy()
                chain.next()
            })
            .some(function () {
                assert(false, 'This step not be called after destroy')
                chain.next()
            })
            .then(function (chain) {
                assert(false, 'This step not be called after destroy')
                chain.next()
            })
            .final(function (chain, data) {
                assert(false, 'Final not be called after destroy')
            })
            .start()
        })
    })
    /**
     *  comment
     **/
    describe('#end', function () {
        var ctx = {}
        it('Call chain.end() goto final step', function (done) {
            var step2 = false
            Chain(function (chain) {
                chain.end()
            })
            .then(function (chain) {
                step2 = true
            })
            .final(function (chain, data) {
                assert.notOk(step2, 'Step 2 should not be called')
                done()
            })
            .start()
        })
        it('Pass data to next step through chai.end(data)', function (done) {
            var step2 = false
            Chain(function (chain) {
                chain.end('switer')
            })
            .then(function (chain) {
                step2 = true
            })
            .final(function (chain, data) {
                assert.equal(data, 'switer', 'Step 2 should not be called')
                done()
            })
            .start()
        })
    })
    /**
     *  comment
     **/
    describe('#final', function () {
        var ctx = {}
        it('Run final after all steps is done', function (done) {
            var step1 = false
            var step2 = false
            Chain(function (chain) {
                step1 = true
                chain.next()
            })
            .then(function (chain) {
                setTimeout( function() {
                    step2 = true
                    chain.next()
                });
            })
            .final(function () {
                assert(step1 && step2, 'Not all step done before final step call')
                done()
            })
            .start()
        })

        it('Run final after call chain.end()', function (done) {
            var step2 = false
            Chain(function (chain) {
                chain.end()
            })
            .then(function (chain) {
                step2 = true
            })
            .final(function (chain, data) {
                assert.notOk(step2, 'Step 2 should not be called')
                done()
            })
            .start()
        })

        it('Call final only once whatever times you call chain.end()', function () {
            var once = false
            Chain(function (chain) {
                chain.end()
                chain.end()
                chain.end()
            })
            .then(function (chain) {
                step2 = true
            })
            .final(function (chain, data) {
                if (once) assert.notOk(step2, 'Final should not be called once')
                once = true
            })
            .start()
        })
    })
    /**
     *  comment
     **/
    describe('#retry', function () {
        it('Call current step handler once again', function () {
            var once = false
            var again = false
            Chain(function (chain, data) {
                    if (once) {
                        again = true
                        assert.equal(data, 'switer', 'Data is uncorrect when chain.retry()')
                        return chain.next()
                    }
                    once = true
                    chain.retry()
                    chain.next()
                })
            .then(function (chain) {
                    assert(again, 'Last step has not been called twice')
                    again = false
                })
            .start('switer')
        })
        it('Call all-step handler once again', function () {
            var once = false
            var again = false
            Chain(function (chain) {
                    chain.next()
                }, function (chain, data) {
                    if (once) {
                        again = true
                        return chain.next()
                    }
                    once = true
                    chain.retry()
                })
            .then(function (chain) {
                    assert(again, 'Last step one hander has not been called twice')
                    again = false
                })
            .start('switer')
        })
        it('Call some-step handler once again', function () {
            var once = false
            var again = false
            Chain(function (chain) {
                    chain.next()
                })
            .some(function (chain, data) {
                    if (once) {
                        again = true
                        return chain.next()
                    }
                    once = true
                    chain.retry()
                }, function (chain) {
                    chain.next()
                })
            .then(function (chain) {
                    assert(again, 'Last step one hander has not been called twice')
                    again = false
                })
            .start('switer')
        })
    })
    /**
     *  comment
     **/
    describe('#some', function () {
        it('Run after one handler done in last step', function (done) {
            var count = 0
            Chain(function (chain) {
                chain.next()
            })
            .some(function (chain) {
                setTimeout( function() {
                    count ++
                    chain.next()
                }, 100);
                    
            }, function (chain) {
                setTimeout( function() {
                    count ++
                    chain.next()
                }, 200);
            })
            .then(function () {
                assert.equal(count, 1, 'Last step need only one handler done')
                done()
            })
            .start()
        })
    })
    /**
     *  comment
     **/
    describe('#start', function () {
        it('Pass data to initialize step use .start(data)', function () {
            var count = 0
            Chain(function (chain, data) {
                assert.equal(data, 'initialize', 'Run initialize step with a uncorrect data')
            })
            .start('initialize')
        })
    })
    /**
     *  comment
     **/
    describe('#then', function () {
        it('Run secound step', function (done) {
            Chain(function (chain) {
                chain.next()
            })
            .then(function () {
                done()
            })
            .start()
        })

        it('Run after all handlers done in last step', function (done) {
            var count = 0
            Chain(function (chain) {
                chain.next()
            })
            .then(function (chain) {
                setTimeout( function() {
                    count ++
                    chain.next()
                }, 100);
                    
            }, function (chain) {
                setTimeout( function() {
                    count ++
                    chain.next()
                }, 300);
            })
            .then(function () {
                assert.equal(count, 2, 'Not all handlers done')
                done()
            })
            .start()
        })
    })
    /**
     *  comment
     **/
    describe('#wait', function () {
        var ctx = {}
        it('Waiting 200ms to run next step', function (done) {
            var time
            Chain(function (chain) {
                time = + new Date
                chain.wait(200)
            })
            .then(function () {
                assert( ((+ new Date) - time) >= 200, 'Step delay time should greater than 200ms')
                done()
            })
            .start()
        })
    })

});
