/**
 * Created by pery on 02/04/2017.
 */

(function( window){'use strict';
    window._Promise = _Promise;

    function identity (x){return x;}
    function noop (x){}

    var PENDING = ['pending'],
        REJECT = ['reject'],
        RESOLVE = ['resolve'];

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

                    _resolveQ.push(resolveEdge.call(this, res, onFulfilled, rej));
                    _rejectQ.push(resolveEdge.call(this, rej, onRejected, rej));

                });
            }
        };

        var me = Object.create(promise);

        if (cb instanceof Function) {
            try {
                cb.call(me, resolve, reject);
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

        function resolveEdge(done, on, onFail) {
            var me = this;
            on = (on instanceof Function) ? on : identity;
            return function (value) {
                try {
                    var ret = on(value);
                    if (ret == me) throw TypeError('return current(this) promise are forbidden');
                    if (ret instanceof Object && ret.then) {
                        ret.then(done, onFail)
                    } else {
                        done(ret);
                    }
                } catch (err) {
                    onFail(err);
                }
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
                promise.then(ceckout.bind(null, i), rej)
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



})( typeof exports === 'undefined'? window: module.exports );