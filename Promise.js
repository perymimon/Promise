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

                    if (onFulfilled instanceof Function)
                        _resolveQ.push(
                            then.call(this, res, onFulfilled, rej)
                        );
                    else
                        _resolveQ.push(adoptState(res));

                    if (onRejected instanceof Function)
                        _rejectQ.push(then.call(this, res, onRejected, rej));
                    else
                        _rejectQ.push(adoptState(rej));

                });
            }
        };

        function then(done, on, onFail) {
            var me = this;
             function resolution(x) {
                try {
                    if (x == me) throw TypeError('return current(this) promise are forbidden');

                    if (x === Object(x) && x.then instanceof Function) {
                        return x.then(resolution, resolution);
                    }
                    done(x);

                } catch (err) {
                    onFail(err);
                }
            }
         return  function (value){
             try {
               return resolution(on(value));
             } catch (err) {
                 onFail(err);
             }
         }


        }

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

        function adoptState(done) {
            return function (value) {
                done(value);
            };
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



})( typeof exports === 'undefined'? window: module.exports );