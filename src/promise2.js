(function( window){'use strict';
    window._Promise = _Promise;
    var PENDING = [/*'pending'*/],
        REJECT = [/*'reject'*/],
        RESOLVE = [/*'resolve'*/],
        FUNCTION = 'function';

    function noop (x){}
    function one(func) {
        return function(){
            func && func.apply(this, arguments);
            func = null;
        }
    }

    function _Promise(cb) {
        var status = PENDING;
        var value = null;
        // var reason = null;
        var resolveQueue = [];
        var rejectQueue = [];
        var me = this;

        var resolving = noop;

        function fulfilled(_value, _status, queue, theOtherQueue){
            status = _status;
            (resolving = _resolving.bind(me,
                queue,
                value = _value,
                theOtherQueue
                )
            )();
        }

        cb(function (value) {
            fulfilled(value, RESOLVE, resolveQueue, rejectQueue);
            fulfilled = noop;
        },function (reason) {
            fulfilled(reason, REJECT, rejectQueue, resolveQueue);
            fulfilled = noop;
        });

        this.then = function (onFulfilled, onRejected) {
            return new _Promise(function (res, rej) {
                resolving();
                resolveQueue.push( [me, res, rej, onFulfilled, res] );
                rejectQueue.push( [me, res, rej, onRejected, rej] );
            })
        };

        this.catch = function ( onRejected){
            return this.then(null, onRejected);
        }
        
    }

    function _resolving(queue, v, theOtherQueue){
        setTimeout(function () {
            for (var i = 0, args; args = queue[i]; i++) {
                args.push(v);
                then.apply(null, args);
            }
            queue.length = theOtherQueue.length = 0;
        }, 0);
    }
    function then(me, res, rej, on, pushState, value) {
        var xThen;

        if (typeof on === FUNCTION)
            resolution( on(value) );
        else
            pushState(value); //adopeState

        function resolution(x) {
            var _onFail = rej;
            try {
                if (x == me) throw TypeError('promise can`t return itself');
                if (x === Object(x) && typeof (xThen = x.then) === FUNCTION)
                    xThen.call(x, one(function (y) {
                        _onFail = noop;
                        resolution(y)
                    }), function(r) {
                        _onFail(r);
                    });
                else
                    res(x);

            } catch (err) {
                _onFail(err);
            }
        }

    }

    _Promise.all = function(iterable){
        return new _Promise(function (res, rej) {
            var ret = [];
            var count = 0;
            function ceckout(index,value){
                ret[index] = value;
                count ++;
                if(count == iterable.length)
                    res(ret)
            }
            iterable.forEach(function (promise,i) {
            })
        })
    };

    _Promise.race = function (iterable) {
        return new _Promise(function (res, rej) {
            iterable.forEach(function (promise) {
                promise.then(res, rej)
            })
        });

    };

    _Promise.reject = function (reason) {
        return new _Promise(function (res, rej) {
            rej(reason)
        })
    };
    _Promise.resolve = function(value){
        return new _Promise(function (res) {
            res(value);
        })
    };

    _Promise.deferred = function deferred() {
        var resolved ;
        var rejected ;
        var promise = _Promise( function (res, rej) {
            resolved = res;
            rejected = rej;
        });
        return {
            promise: promise,
            resolve: resolved,
            reject: rejected
        }
    }

})( typeof exports === 'undefined'? window: module.exports );