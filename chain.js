/*
 *  chainjs
 *  http://github.com/switer/chainjs
 *
 *  Copyright (c) 2013 "switer" guankaishe
 *  Licensed under the MIT license.
 *  https://github.com/switer/chainjs/blob/master/LICENSE
 */

'use strict;'

/**
 *  Chainjs enter funtion
 *  Create chain instance
 */
function Chain (startHandler/*, arg1, [arg2, ...]*/) {

    var chainHandlers = [],
        chainEndHandlers = [],
        filterHandlers = [],
        beforeHandlers = [],
        startParams = [],
        lastFilter = null,
        isEnd = false,
        cursor = 0,
        currentStep = 0,
        currentCursor = 0,
        chainStatus = {
            steps: []
        },
        _data = {},
        args = util.slice(arguments);

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
            // call all final handlers after ending
            util.batch(chainEndHandlers, chain, data);
            // isEnd verbose??
            chain.stop();
            return chain;
        },
        /**
         *  Starting the chain and it will invoke start handler
         */
        start: function () {
            chain.next = util.bind({ step: 0 }, next);

            if (startHandler) {
                util.invoke(startHandler, this, startParams);
            } else {
                this.next();
            }
            return chain;
        },
        /**
         *  Save data in current chain instance
         */
        data: function (key, data) {
            // set data
            if (key && data) {
                _data[key] = data;
                return chain;
            }
            // get data value by key
            else if (key && !data) { 
                return _data[key];
            }
            // return all data of currently chain
            else {
                return util.extend(_data);
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
         *  mark the chain as ending and destrop some internal variable
         */
        stop: function () {
            isEnd = true;
            // destroy variable
            _data = {};
            cursor = 0;
            currentStep = 0,
            currentCursor = 0,
            chainHandlers = null;
            chainEndHandlers = null;
            filterHandlers = null;
            beforeHandlers = null;
            lastFilter = null;
            startParams = null;
            _data = null;

            // throw new Error('chain:stop');
        },
        
    }
    // marked as chain object
    chain.__chain = true;

    // create start handler param
    args.shift();
    startParams.push(chain);
    startParams = startParams.concat(args);

    return chain;
}

/* =================================================================== */

var NOOP = function () {};

// chain sham object
var chainSham = {
    then: NOOP,
    next: NOOP,
    final: NOOP,
    end: NOOP,
    start: NOOP,
    data: NOOP,
    before: NOOP,
    filter: NOOP,
    stop: NOOP,
    sham: NOOP
};

chainSham.__chain = true;
/**
 *  Make chain sham, use for calling chain step handler as normal function
 **/
Chain.sham = function (handler, ctx) {

    return function (chain) {

        if (!chain.__chain) {
            
            ctx = ctx || this;
            var args = util.slice(arguments);
            args.unshift(chainSham)
            handler.apply(ctx, args);
        }
    }
}

var util = {
    /**
      * forEach
      * I don't want to import underscore, is looks like so heavy if use in chain
      */
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
    /**
      *  invoke handlers in batch process
      */
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
    /**
     *  Array.slice
     */
    slice: function (array) {
        return Array.prototype.slice.call(array);
    },
    /**
     *  Function.bind
     */
    bind: function (context, func) {
        return function () {
            func.apply(context, arguments);
        }
    },
    /**
     *  Object extend api
     **/
    extend: function (obj, extObj) {

        this.each(extObj, function (value, key) {
            if (extObj.hasOwnProperty(key)) {
                obj[key] = value;
            }
        });
        return obj;
    },
    /**
     *  function call simple encapsulation
     */
    invoke: function (handler, context) {
        var args = this.slice(arguments);
        args = args.pop();
        try {
            handler.apply(context, args);
        } catch (e) {
            
        }
    }
}

// AMD/CMD/node/bang
if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
        exports = module.exports = Chain;
    }
    exports.Chain = Chain;
} else {
    this.Chain = Chain;
}