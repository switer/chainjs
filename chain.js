/*
 *  chainjs
 *  http://github.com/switer/chainjs
 *
 *  Copyright (c) 2013 "switer" guankaishe
 *  Licensed under the MIT license.
 *  https://github.com/switer/chainjs/blob/master/LICENSE
 */

var _ = require('underscore');

var util = {

    // 批处理handler数组
    batch: function (handlers/*, params*/) {
        var args = this.slice(arguments);
        args.shift();
        _.each(handlers, function (handler) {
            handler && handler.apply(this, args);
        });
    },
    // 封装Array.slice
    slice: function (array) {
        return Array.prototype.slice.call(array);
    },
    bind: function (context, func) {
        return function () {
            func.apply(context, arguments);
        }
    }
}

function Chain (startHandler/*, arg1, [arg2, ...]*/) {

    var chainHandlers = [],
        chainEndHandlers = [],
        filterHandlers = [],
        beforeHandlers = [],
        afterHandlers = [],
        lastFilter = null,
        isEnd = false,
        args = util.slice(arguments),
        startParams = [],
        cursor = 0,
        currentStep = 0,
        currentCursor = 0,
        chainStatus = {
            steps: []
        },
        _data = {};

    /**
     *  inner filter for stop step invoke after ending
     */
    function chainFilter () {
        return isEnd;
    }
    
    function next (/*[data,...]*/) {

        var context = this;

        var handlerArgs = [],
            argParams = util.slice(arguments);
        
        handlerArgs.push(chain);
        handlerArgs = handlerArgs.concat(argParams);

        // Invoke after handlers in the header of each next()
        util.batch.apply(util, [afterHandlers].concat(handlerArgs));

        // chain end filter
        if (chainFilter()) return chain;
        // set current step to context step
        currentStep = context.step;
        // this step has been invoked
        if (chainStatus.steps[currentStep]) return chain;

        // pop step handler
        var handler = chainHandlers[currentStep];
        // cursor to next step
        cursor = currentStep + 1;
        // bind step context
        chain.next = util.bind({ step: cursor }, next);

        currentCursor ++;

        // invoke step handler
        function stepHandler () {
            util.batch.apply(util, [beforeHandlers].concat(handlerArgs));
            // if the chain is ending and step over, skip the handler
            if ( !chainFilter() && context.step >= currentCursor - 1) {
                handler.apply(chain, handlerArgs);
            }
            chainStatus.steps[currentStep] = true;
        }

        lastFilter && lastFilter.stop();

        if (!handler) {
            chain.end.apply(chain, argParams);
        }
        else if (filterHandlers.length >= 1) {

            // instance filter chain
            var filterChain = Chain();
            filterChain.chain = chain;
            lastFilter = filterChain;

            _.each(filterHandlers, function (filterHandler) {
                filterChain.then(function () {
                    filterHandler.apply(filterChain, [filterChain].concat(argParams));
                });
            });

            filterChain.final(function (filter) {
                stepHandler.call(filter.chain);
            }).start();

        } else {
            stepHandler.call(chain);
        }

        return chain;
    }
    /**
     *  Chain instance object
     */
    var chain = {
        /**
         *  Add a chain step handler
         */
        then: function (handler) {

            chainHandlers.push(handler);
            return chain;
        },
        /**
         *  Go to next chain step invoking
         */
        next: next,
        /**
         *  Push handler which will be invoked at the chain ending
         */
        final: function (handler) {

            chainEndHandlers.push(handler);
            return chain;
        },
        /**
         *  End up cur chain, then it will be invoke final handler
         */
        end: function (data) {
            isEnd = true;

            util.batch(chainEndHandlers, chain, data);
            _data = {};
            cursor = 0;
            chainHandlers = [];
            chainEndHandlers = [];
            filterHandlers = [];
            beforeHandlers = [];
        },
        /**
         *  Starting the chain and it will invoke start handler
         */
        start: function () {
            chain.next = util.bind({ step: 0 }, next);

            if (startHandler) {
                startHandler.apply(this, startParams);
            } else {
                this.next();
            }
        },
        /**
         *  Save data in current chain instance
         */
        data: function (key, data) {

            if (key && data) {
                _data[key] = data;
            } else if (key && !data) {
                return _data[key];
            } else {
                return _data;
            }
        },
        /**
         *  Chain step handler AOP-before
         *  Invoke before each step handler
         */
        before: function (beforeHandler) {
            beforeHandlers.push(beforeHandler)
            return chain;
        },
        filter: function (filterHandler) {
            filterHandlers.push(filterHandler)
            return chain
        },
        stop: function () {
            isEnd = true;
            _data = {};
            cursor = 0;
            chainHandlers = [];
            chainEndHandlers = [];
        }
    }
    // create start handler param
    args.shift();
    startParams.push(chain);
    startParams = startParams.concat(args);

    return chain;
}

module.exports = Chain;