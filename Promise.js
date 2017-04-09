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
    ;

    function _Promise(cb) {
        var _status = PENDING;
        var _value = null;
        var _error = null;
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
            if(_status == PENDING ){
                _status = RESOLVE;
                _value = value;
                    resolving();
            }
        }
        function reject(err) {
            if(_status == PENDING ) {
                _status = REJECT;
                _error = new Error(err);
                rejecting();
            }
        }

        var _resolveQ = [];
        var _rejectQ = [];


        function resolving() {
            if (_status == RESOLVE) {
                setTimeout(function () {
                    for (var i = 0, res; res = _resolveQ[i]; i++) {
                        res(_value);
                    }
                    _resolveQ.length = 0;
                },0);
            }
        }

        function rejecting(reason) {
            if(_status == REJECT){
                setTimeout(function () {
                    for (var i = 0, rej; rej = _resolveQ[i]; i++) {
                        rej(reason);
                    }
                    _rejectQ.length = 0;
                },0);
            }
        }

        var promise = {
            get status () {
                return _status;
            },
            get value () {
                return _value
            },
            catch: function (onRejected) {
                this.then(null, onRejected);
            },
            then:function (onFulfilled, onRejected) {
                resolving();
                rejecting();
                return  new _Promise(function (res, rej) {

                    onFulfilled = (onFulfilled instanceof Function)?
                        onFulfilled: identity;
                    onRejected = (onRejected instanceof Function)?
                        onRejected: identity;

                    _resolveQ.push(function (value) {
                        // onFulfilled.then?
                        //     onFulfilled.then(res):
                        res(onFulfilled(value))
                    });

                    _rejectQ.push(function (reason) {
                        // onFulfilled.then?
                        //     onFulfilled.then(null,rej):
                            rej(onRejected(reason))
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
                promise.then(ceckout.bind(null, i))
            })
        })
    };

    _Promise.race = function (iterable) {
        return new _Promise(function (res, rej) {
            iterable.forEach(function (promise) {
                promise.then(res,reg)
            })
        });

    };

    _Promise.reject = function(reasone){
        return new _Promise(function (res, rej) {
            rej(reasone)
        })
    };
    _Promise.resolve = function(value){
        return new _Promise(function (res) {
            res(value);
        })
    };



})( typeof exports === 'undefined'? window: module.exports );