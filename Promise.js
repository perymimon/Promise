/**
 * Created by pery on 02/04/2017.
 */
function _Promise(cb) {
    var  PENDING = 'pending',
        REJECT = 'reject',
        RESOLVE = 'resolve';
    ;

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
        _status = RESOLVE;
        _value = value;
        resolving();
    }
    function reject(err) {
        _status = REJECT;
        _error = new Error(err);

    }
    var _resolveQ = [];
    var _rejectQ = [];

    function resolving() {
        if(_status == RESOLVE){
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
        var count = 0;
        function ceckout(index,value){
            ret[index] = value;
            count ++;
            if(count == iterable.length)
                res(ret)
        }
        iterable.forEach(function (promise,i) {
            promise.then(ceckout.bind({},i))
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



