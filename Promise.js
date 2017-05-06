(function( window){'use strict';
    window._Promise = _Promise;
    var PENDING = ['pending'],
        REJECT = ['reject'],
        RESOLVE = ['resolve'];

    function noop (x){}
    function one(func) {
        return function(){
            func && func.apply(this, arguments);
            func = null;
        }
    }


    function _Promise(cb) {
        var _status = PENDING;
        var _value = null;
        var _reason = null;

        var _resolveQ = [];
        var _rejectQ = [];
        var _resolving = noop;

        var promise = {
            get status() {
                return _status[0];
            },
            get value() {
                return _value
            },
            catch: function (onRejected) {
                return this.then(null, onRejected);
            },
            then: function (onFulfilled, onRejected) {
                return new _Promise(function (res, rej) {
                    _resolving();
                    _resolveQ.push( then.call(this, res, onFulfilled, rej, res) );
                    _rejectQ.push( then.call(this, res, onRejected, rej, rej) );
                });
            }
        };

        function then(res, on, rej, onAdopt) {
            var me = this;
            var xThen;
            return  function (value){
                try {
                    if (on instanceof Function)
                        resolution( on(value) );
                    else
                        onAdopt(value); //adopeState
                } catch (err) {
                    rej(err);
                }
            };

            function resolution(x) {
                var _rej = rej;
                try {
                    if (x == me) throw TypeError('promise can`t return itself');
                    if (x === Object(x) && typeof (xThen = x.then) === 'function')
                        xThen.call(x, one(function (y) {
                            _rej = noop;
                           resolution(y)
                        }), function(r) {
                            _rej(r);
                        });
                    else
                        res(x);

                } catch (err) {
                    _rej(err);
                }
            }

        }

        var me = Object.create(promise);


        if (cb instanceof Function) {
            try {
                cb.call(me, one(resolve), one(reject));
            } catch (err) {
                reject(err);
            }
        }else{
            resolve(cb/*value*/);
        }

        return me;

        function resolve(value){
            if (_status === PENDING) {
                _status = RESOLVE;
                _value = value;
                (_resolving = resolving.bind(null, _resolveQ, value))();
            }
        }

        function reject(reason) {
            if (_status === PENDING) {
                _status = REJECT;
                _reason = reason;
                _resolving = resolving.bind(null, _rejectQ, _reason);
                _resolving();
            }
        }

        function resolving(queue, v) {
            setTimeout(function () {
                for (var i = 0, res; res = queue[i]; i++) {
                        res(v);
                }
                _rejectQ.length = 0;
                /*empty the que */
                _resolveQ.length = 0;
            }, 0);
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