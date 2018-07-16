var PENDING = ['pending'],
    REJECT = ['reject'],
    RESOLVE = ['resolve'],
    FUNCTION = 'function';

function noop(x) {
}

function once(func) {
    return function () {
        func && func.apply(this, arguments);
        func = null;
    }
}

function dependence(resolve, reject) {
    return {
        resolve: function () {
            resolve && resolve.apply(this, arguments);
            resolve = reject = null;
        },
        reject: function () {
            reject && reject.apply(this, arguments);
            resolve = reject = null;
        }
    }
}

export default function TP(initializer) {
    var status = PENDING;
    var value = null;
    /*also _reason*/

    var callbackQueue = [];
    var _resolving = noop;

    var resolver = once(function (_status, _value) {
        status = _status;
        value = _value;
        resolving();
        _resolving = resolving;
    });

    function fulfilled(value) {
        resolver(RESOLVE, value);
    }

    function rejector(reason) {
        resolver(REJECT, reason)
    }

    function resolving() {
        setTimeout(function () {
            var i = 0, dataum;
            var callbackName = status[0];
            while (dataum = callbackQueue[i++]) {
                then(dataum[0],dataum[1][callbackName]);
                // res(_value);
            }
            callbackQueue.length = 0;
        }, 0);
    }

    var promise = {
        get status() {
            return status[0];
        },
        get value() {
            return value
        },
        catch: function (onRejected) {
            return TP.then(null, onRejected);
        },
        then: function (onFulfilled, onRejected) {
            var deferred = TP.deferred();
            callbackQueue.push([deferred, {resolve:onFulfilled,reject:onRejected } ]);
            _resolving();
            return deferred.promise;
        }
    };

    // function then(resolve, reject, callback, onAdopt, x) {
    function then( deferred, callback) {
        try {
            typeof callback == FUNCTION ?
                resolution(callback(value)):
                deferred[status[0]](value);
        } catch (err) {
            deferred.reject(err);
        }

        function resolution(x) {
            var xThen;
            var stater = dependence(resolution, deferred.reject);
            try {
                if (x === deferred.promise) throw TypeError('promise can`t return itself');
                if (x === Object(x) && typeof (xThen = x.then) === FUNCTION)
                    xThen.call(x, stater.resolve, stater.reject);
                else
                    deferred.resolve(x);

            } catch (err) {
                stater.reject(err);
            }
        }
    }

    promise.constructor = initializer;
    if (typeof initializer == FUNCTION) {
        try {
            promise.constructor(fulfilled, rejector);
        } catch (err) {
            rejector(err);
        }
    } else {
        fulfilled(initializer/*value*/);
    }

    return promise;


}

TP.all = function (iterable) {
    return new TP(function (res, rej) {
        var ret = [];
        var count = 0;

        function checkout(index, value) {
            ret[index] = value;
            count++;
            if (count == iterable.length)
                res(ret)
        }

        iterable.forEach(function (promise, i) {
            promise.then(checkout)
        })
    })
};

TP.race = function (iterable) {
    return new TP(function (res, rej) {
        iterable.forEach(function (promise) {
            promise.then(res, rej)
        })
    });

};

TP.reject = function (reason) {
    return new TP(function (res, rej) {
        rej(reason)
    })
};
TP.resolve = function (value) {
    return new TP(function (res) {
        res(value);
    })
};

TP.deferred = function deferred() {

    var resolved;
    var rejected;
    var promise = TP(function (res, rej) {
        resolved = res;
        rejected = rej;
    });
    return {
        promise: promise,
        resolve: resolved,
        reject: rejected
    }
};


