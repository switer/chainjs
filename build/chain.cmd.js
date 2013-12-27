define(function(require, exports, module) {

/*
 *  chainjs
 *  http://github.com/switer/chainjs
 *
 *  Copyright (c) 2013 "switer" guankaishe
 *  Licensed under the MIT license.
 *  https://github.com/switer/chainjs/blob/master/LICENSE
 */

'use strict;'

var util = {

    each: function(obj, iterator, context) {
        context = context || this;
        if (!obj) return;
        else if (obj.forEach) {
            obj.forEach(iterator);
        } else if (obj.length === +obj.length){
            for (var i = 0; i < obj.length; i++) {
                iterator.call(context, obj[i], i);
            }
        } else {
            for (var key in obj) {
                iterator.call(context, obj[key], key);
            }
        }
    },
    // invoke handlers in batch process
    batch: function (handlers/*, params*/) {
        var args = this.slice(arguments);
        args.shift();
        util.each(handlers, function (handler) {
            if (handler) {
                // util.invoke(handler, this, args);
                handler.apply(this, args);
            }
        });
    },
    // Array.slice
    slice: function (array) {
        return Array.prototype.slice.call(array);
    },
    // Function.bind
    bind: function (context, func) {
        return function () {
            func.apply(context, arguments);
        }
    },
    invoke: function (handler, context) {
        var args = this.slice(arguments);
        args = args.pop();
        handler.apply(context, args);
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
    /**
     *  Next step method
     */
    function next (/*[data,...]*/) {
        // chain step context
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
        // chain step cursor
        currentCursor ++;

        /**
         *  create step handler
         */
        function stepHandler () {
            util.batch.apply(util, [beforeHandlers].concat(handlerArgs));

            // if the chain is ending and step over, skip the handler
            if ( !chainFilter() && context.step >= currentCursor - 1) {
                // util.invoke(handler, chain, handlerArgs);
                handler.apply(chain, handlerArgs);
            }

            // marked the step is invoked
            chainStatus.steps[currentStep] = true;
        }

        // stop and destroy last filter
        lastFilter && lastFilter.stop();
        // if the chain is ending
        if (!handler) {
            chain.end.apply(chain, argParams);
        }
        // filter is not empty, so we call it in a filter-chain
        else if (filterHandlers.length >= 1) {

            // instance filter chain
            var filterChain = Chain();
            filterChain.chain = chain;

            // save current chain instance in .chain filed of filter chain instance
            lastFilter = filterChain;

            // push filter chain steps
            util.each(filterHandlers, function (filterHandler) {
                filterChain.then(function () {
                    filterHandler.apply(filterChain, [filterChain].concat(argParams));
                });
            });

            // push current chain step handler to filter chain final
            filterChain.final(function (filter) {
                stepHandler.call(filter.chain);
            }).start();

        } else {
            // call step handler without fillter
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
                util.invoke(startHandler, this, startParams);
                // startHandler.apply(this, startParams);
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
        /**
         *  Step handler filter, it is invoked before AOP-before handler
         *  call filter.next() in filter, current chain step will be invoke 
         */
        filter: function (filterHandler) {
            filterHandlers.push(filterHandler)
            return chain
        },
        /**
         *  mark the chain as ending and destrop some inner variable
         */
        stop: function () {
            isEnd = true;
            _data = {};
            cursor = 0;
            currentStep = 0,
            currentCursor = 0,
            chainHandlers = null;
            chainEndHandlers = null;
            filterHandlers = null;
            beforeHandlers = null;
            afterHandlers = null;
            lastFilter = null;
            startParams = null;
            _data = null;

            // throw new Error('chain:stop');
        }
    }
    // create start handler param
    args.shift();
    startParams.push(chain);
    startParams = startParams.concat(args);

    return chain;
}

if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
        exports = module.exports = Chain;
    }
    exports.Chain = Chain;
} else {
    this.Chain = Chain;
}

});