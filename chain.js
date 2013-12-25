/*
 * chainjs
 * http://github.com/switer/chainjs
 *
 * Copyright (c) 2013 "switer" guankaishe
 * Licensed under the MIT license.
 * https://github.com/switer/chainjs/blob/master/LICENSE
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
    }
}

module.exports = function (startHandler/*, arg1, [arg2, ...]*/) {

    var chainHandlers = [],
        chainEndHandlers = [],
        beforeHandlers = [],
        afterHandlers = [],
        isEnd = false,
        args = util.slice(arguments),
        startParams = [],
        cursor = 0,
        _data = {};

    // 链调用结束的拦截器
    function filter () {
        return isEnd;
    }

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
        next: function (/*[data,...]*/) {
            var handlerArgs = [],
                argParams = util.slice(arguments);
            
            handlerArgs.push(chain);
            handlerArgs = handlerArgs.concat(argParams);

            // Invoke after handlers in the header of each next()
            util.batch.apply(util, [afterHandlers].concat(handlerArgs));

            // chain end filter
            if (filter()) return chain;

            // pop step handler
            var handler = chainHandlers[cursor];
            cursor ++;

            // invoke step handler of invoke end handler
            if (handler) {
                util.batch.apply(util, [beforeHandlers].concat(handlerArgs));
                handler.apply(this, handlerArgs);

            } else {
                this.end.apply(this, argParams);
            }

            // chain return
            return chain;
        },
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
            // chainHandlers = [];
            // chainEndHandlers = [];
        },
        /**
         *  Starting the chain and it will invoke start handler
         */
        start: function () {
            
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
        // 每个链节点的拦截方法
        filter: function (filterHandler) {
            // TBD
            return chain;
        },
        // 每个链节点handler的函数切面-before
        before: function (beforeHandler) {
            // TBD
            beforeHandlers.push(beforeHandler)
            return chain;
        },
        // 每个链节点handler的函数切面-after
        after: function (afterHandler) {
            // TBD
            return chain;
        }
    }
    // 修理初始参数
    args.shift();
    startParams.push(chain);
    startParams = startParams.concat(args);

    return chain;
}
