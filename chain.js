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
        isEnd = false,
        args = util.slice(arguments),
        startParams = [],
        _data = {};

    // 链调用结束的拦截器
    function filter () {
        return isEnd;
    }

    var chain = {
        // 添加下一处理方法
        then: function (handler) {
            if (filter()) return;

            chainHandlers.push(handler);
            return chain;
        },
        // 请求调用下一处理方法
        next: function () {
            if (filter()) return;

            if (isEnd) return;

            var handler = chainHandlers.shift();
            var handlerArgs = [],
                argParams = util.slice(arguments);
            
            handlerArgs.push(chain);
            handlerArgs = handlerArgs.concat(argParams);

            if (handler) {
                handler.apply(this, handlerArgs);
            } else {
                this.end.apply(this, argParams);
            }
            return chain;
        },
        // 链处理结束后始终执行的方法
        final: function (handler) {
            if (filter()) return;

            chainEndHandlers.push(handler);
            return chain;
        },
        // 结束当前链调用
        end: function (data) {
            isEnd = true;

            util.batch(chainEndHandlers, chain, data);
            chainHandlers = [];
            chainEndHandlers = [];
        },
        // 开始执行链处理
        start: function () {
            if (filter()) return;
            if (startHandler) {
                startHandler.apply(this, startParams);
            } else {
                this.next();
            }
        },
        // 链中的节点数据共享
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