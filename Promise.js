/**
 * Created by pery on 02/04/2017.
 */
function _Promise(cb) {
    var _status = 'pending';
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
        _status = 'resolve';
        _value = value;
        resolving();
    }
    function reject(err) {
        _status = 'reject';
        _error = new Error(err);

    }
    var _resolveQ = [];
    var _rejectQ = [];

    function resolving() {
        if(_status == 'resolve'){
            for(var i=0, res; res = _resolveQ[i]; i++ ){
                res(_value);
            }
            _resolveQ.length = 0;
        }
    }

    var promise = {
        get status () {
            return _status;
        },
        get value () {
            return _value
        },
        then:function (onFulfilled, onRejected) {
            // if(onFulfilled instanceof promise){
            //     return onFulfilled;
            // }
            var newPromise = new _Promise(function (res, rej) {
                _resolveQ.push(function (value) {
                    res(onFulfilled(value))
                });
            });
            resolving();
            return newPromise;
        },
        catch:function (onRejected) {
            _rejectQ.push(cb)
        }
    };

    return Object.create(promise);
}

_Promise.all = function(iterable){
    return new _Promise(function (res, rej) {
        var ret = [];
        iterable.forEach(function (promise) {
            promise.then(function (value) {
                ret.push(value);

            })
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



