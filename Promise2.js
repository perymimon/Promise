(function( window){'use strict';
    window._Promise = _Promise;
    var PENDING = [/*'pending'*/],
        REJECT = [/*'reject'*/],
        RESOLVE = [/*'resolve'*/];



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
                resolveQueue.push( then(me, res, rej, onFulfilled, res));
                rejectQueue.push( then(me, res, rej, onRejected, rej));
            })
        };

        this.catch = function ( onRejected){
            return this.then(null, onRejected);
        }
        
    }

    function _resolving(queue, v, theOtherQueue){
        setTimeout(function () {
            for (var i = 0, cb; cb = queue[i]; i++) {
                cb(v);
            }
            queue.length = theOtherQueue.length = 0;
        }, 0);
    }
    function then(me, res, rej, on, onAdopt) {
        var xThen;

        return  function (value){
            if (typeof on === "function")
                resolution( on(value) );
            else
                onAdopt(value); //adopeState
        };

        function resolution(x) {
            var _onFail = rej;
            try {
                if (x == me) throw TypeError('promise can`t return itself');
                if (x === Object(x) && typeof (xThen = x.then) === 'function')
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

})( typeof exports === 'undefined'? window: module.exports );