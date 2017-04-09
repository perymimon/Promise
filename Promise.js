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

        if (cb instanceof Function){
            try {
                cb(resolve, reject);
            } catch (err) { 
                reject(err);
            }
        }else{
            resolve(cb/*value*/);
        }

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

        var promise = {
            get status () {
                return _status[0];
            },
            get value () {
                return _value
            },
            catch: function (onRejected) {
                this.then(null, onRejected);
            },
            then:function (onFulfilled, onRejected) {
                var me = this;
                return  new _Promise(function (res, rej) {
                    _resolving();

                    // throw  TypeError('return current(this) promise are forbidden');
                    onFulfilled = (onFulfilled instanceof Function)?
                        onFulfilled: identity;
                    onRejected = (onRejected instanceof Function)?
                        onRejected: identity;

                    _resolveQ.push(function (value) {
                        try {
                            res(onFulfilled(value));
                        } catch (err) {
                            rej(err);
                        }
                    });

                    _rejectQ.push(function (reason) {
                        try {
                            rej(onRejected(reason))
                        } catch (err) {
                            rej(err);
                        }

                    })

                });
            }
        };

        return Object.create(promise);
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