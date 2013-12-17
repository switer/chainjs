var util = {
    batch: function (handlers/*, params*/) {
        var args = Array.prototype.slice.call(arguments);
        args.shift();
        _.each(handlers, function (handler) {
            handler && handler.apply(this, args);
        });
    }
}

module.exports = function (startHandler/*, arg1, [arg2, ...]*/) {
    var chainHandlers = [],
        chainEndHandlers = [],
        isEnd = false,
        args = Array.prototype.slice.call(arguments),
        startParams = [],
        _data = {};

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
                argParams = Array.prototype.slice.call(arguments);
            
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
            util.batch(chainEndHandlers, data);
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
        }
    }

    args.shift();
    startParams.push(chain);
    startParams = startParams.concat(args);

    return chain;
}