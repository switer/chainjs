'use strict';

module.exports = function (Chain, assert) {
    
    describe('chainjs', function () {
        /**
         *  comment
         **/
        describe('#Constructor Chain()', function () {
            it('Instance then run next step', function (done) {
                Chain()
                    .then(function () {
                        done()
                    })
                    .start()
            })
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
            it('Passing step handlers array', function (done) {
                var count = 0
                Chain([function (chain) {
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
                }])
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
            it('Pass data to next step through chai.next(data)', function (done) {
                var once = false
                Chain(function (chain) {
                    chain.next('switer')
                })
                .then(function (chain, data) {
                    assert.equal(data, 'switer', 'Uncorrect passed data from last step')
                    done()
                })
                .start()
            })
            it('Pass next data to final step through chai.next(data) when chain has no next step', function (done) {
                Chain(function (chain) {
                    chain.next('switer')
                })
                .final(function (chain, data) {
                    assert.equal(data, 'switer', 'Uncorrect passed data from last step')
                    done()
                })
                .start()
            })
            it('Call next without "chain." then goto next step correctly', function (done) {
                Chain(function (chain) {
                        setTimeout(chain.next, 100)
                    })
                    .then(function (chain) {
                        setTimeout(chain.next.bind(null, 'send to next'))
                    })
                    .final(function (chain, data) {
                        assert.equal(data, 'send to next', 'Uncorrect passed data from last step')
                        done()
                    })
                    .start()
            })
        })
        /**
         *  comment
         **/
        describe('#nextTo', function () {
            var ctx = {}
            it('Goto branchA use .nextTo() and call next', function (done) {
                Chain(function (chain) {
                    chain.nextTo('branchA', true)
                    chain.next()
                })
                .then(function () {
                    assert(false, 'This step should not be called')
                    chain.next(false)
                })
                .branch('branchA', function (chain, fromGoto) {
                    assert(fromGoto, 'This step should be called by chain.nextTo()')
                    chain.next(true)
                })
                .then(function (chain, fromBranch) {
                    assert(fromBranch, 'This step should be called from branchA step')
                    done()
                })
                .start()
            })
            it('Shold not goback to previous step use .nextTo()', function (done) {
                Chain(function (chain) {
                    chain.nextTo('branchB', true)
                })
                .branch('branchA', function (chain) {
                    assert(false, 'This step should not be called')
                    chain.next()
                })
                .then(function () {
                    assert(false, 'This step should not be called')
                    chain.next()
                })
                .branch('branchB', function (chain, fromGoto) {
                    assert(fromGoto, 'This step should be call by chain.nextTo()')
                    try {
                        chain.nextTo('branchA')
                    } catch (e) {
                        done()
                    }
                })
                .start()
            })

            it('Call .next() should skip branch step', function (done) {
                Chain(function (chain) {
                    chain.next(true)
                })
                .branch('branchA', function (chain) {
                    assert(false, 'This step should not be called')
                    chain.next()
                })
                .then(function (chain, fromFirst) {
                    assert(fromFirst, 'This step call by first step')
                    chain.nextTo('branchB', true)
                })
                .branch('branchB', function (chain, fromGoto) {
                    assert(fromGoto, 'This step should be called by chain.nextTo()')
                    chain.next()
                })
                .branch('branchC', function (chain, fromGoto) {
                    assert(fromGoto, 'This step should be called by chain.nextTo()')
                })
                .final(function () {
                    done()
                })
                .start()
            })
        })
        /**
         *  comment
         **/
        describe('#branch', function () {
            var ctx = {}
            it('Chain only then branch step and has no normal step', function (done) {
                Chain()
                .branch('branch', function () {
                    assert(false, 'This step should be called by .start()')
                })
                .final(function () {
                    done()
                })
                .context(ctx)
                .start()
            })
        })
        /**
         *  comment
         **/
        describe('#context', function () {
            var ctx = {}
            it('Use custom context', function (done) {
                Chain(function (chain) {
                    assert.equal(this, ctx)
                    done()
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
            it('Set a data and get it in another step', function (done) {
                var step2 = false
                Chain(function (chain) {
                    chain.data('mydata', 'value')
                    chain.next()
                })
                .then(function (chain) {
                    chain.data({'mydata2': 'value2'})
                    chain.next()
                })
                .final(function (chain, data) {
                    var data1 = chain.data('mydata')
                    var data2 = chain.data('mydata2')
                    var allData = chain.data()
                    assert(data1 === 'value', 'Data value is uncorrect')
                    assert(data2 === 'value2', 'Data value is uncorrect')
                    assert.isObject(allData, 'Data value is uncorrect')
                    done()
                })
                .start()
            })
        })
        /**
         *  comment
         **/
        describe('#destroy', function () {
            var ctx = {}
            it('Stop everthing of current chain after calling destroy', function (done) {
                var step2 = false
                Chain(function (chain) {
                    chain.destroy()
                    chain.next()
                    done()
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

            it('Call final only once whatever times you call chain.end()', function (done) {
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
                    done()
                })
                .start()
            })
        })
        /**
         *  comment
         **/
        describe('#retry', function () {
            it('Call current step handler once again', function (done) {
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
                        done()
                    })
                .start('switer')
            })
            it('Call all-step handler once again', function (done) {
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
                        done()
                    })
                .start('switer')
            })
            it('Call some-step handler once again', function (done) {
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
                        done()
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

            it('Passing data form some step to next step', function (done) {
                Chain()
                .some(function (chain) {
                    setTimeout( function() {
                        chain.next('some step 1')
                    }, 100);
                        
                }, function (chain) {
                    setTimeout( function() {
                        chain.next('some step 2')
                    }, 200);
                })
                .then(function (chain, data) {
                    assert.equal(data, 'some step 1', 'Uncorrect passed data from last step')
                    done()
                })
                .start()
            })
            it('Passing some step handlers array', function (done) {
                Chain()
                .some([function (chain) {
                    setTimeout( function() {
                        chain.next('some step 1')
                    }, 100);
                        
                }, function (chain) {
                    setTimeout( function() {
                        chain.next('some step 2')
                    }, 200);
                }])
                .then(function (chain, data) {
                    assert.equal(data, 'some step 1', 'Uncorrect passed data from last step')
                    done()
                })
                .start()
            })
        })
        /**
         *  comment
         **/
        describe('#each', function () {
            it('Run after one handler done in last step', function (done) {
                var steps = ''
                Chain()
                .each(function (chain) {
                    steps += 'A'
                    chain.next()
                }, function (chain) {
                    steps += 'B'
                    chain.next()
                }, function (chain) {
                    steps += 'C'
                    chain.next()
                })
                .then(function () {
                    assert.equal(steps, 'ABC', 'Last step need only call each handlers')
                    done()
                })
                .start()
            })
            it('Passing step handlers array', function (done) {
                var steps = ''
                Chain()
                .each([function (chain) {
                    steps += 'A'
                    chain.next()
                }, function (chain) {
                    steps += 'B'
                    chain.next()
                }, function (chain) {
                    steps += 'C'
                    chain.next()
                }])
                .then(function () {
                    assert.equal(steps, 'ABC', 'Last step need only call each handlers')
                    done()
                })
                .start()
            })
            it('Data passing from pre step', function (done) {
                var steps = ''
                Chain(function (chain) {
                    chain.next('A')
                })
                .each([function (chain, data) {
                    assert.equal(data, 'A', 'data of pre step is not correct')
                    chain.next('B')
                }, function (chain, data) {
                    assert.equal(data, 'B')
                    chain.next('D')
                }, function (chain, data) {
                    assert.equal(data, 'D')
                    chain.next()
                }])
                .then(function () {
                    done()
                })
                .start()
            })
        })
        /**
         *  comment
         **/
        describe('#start', function () {
            it('Pass data to initialize step use .start(data)', function (done) {
                var count = 0
                Chain(function (chain, data) {
                    assert.equal(data, 'initialize', 'Run initialize step with a uncorrect data')
                    done()
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
         describe('#thunk', function () {
            it('Regular node function into chain function', function (done) {
                function handler1 (param, callback) {
                    callback(param + 'Chain through step1, ')
                }
                function handler2 (param, callback) {
                    callback(param + 'step2')
                }
                Chain()
                    .then(Chain.thunk(handler1))
                    .then(Chain.thunk(handler2))
                    .final(function (chain, data) {
                        assert.equal(data, 'Initialize! Chain through step1, step2', 'thunk convert is uncorrect')
                        done()
                    })
                    .start('Initialize! ')
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
}
