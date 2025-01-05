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
    var status = PENDING,
        value = null,
        callbackQueue = [];

    var resolving = noop;

    var resolver = once(function (_status, _value) {
        status = _status;
        value = _value;
        (resolving = _resolving.bind(null, status[0]) )();
    });

    function fulfilled(value) {
        resolver(RESOLVE, value);
    }

    function rejector(reason) {
        resolver(REJECT, reason)
    }

    function _resolving(actionName) {
        setTimeout(function () {
            var i = 0, dataum;
            while (dataum = callbackQueue[i++]) {
                then(dataum[1], dataum[0], actionName);
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
            return promise.then(null, onRejected);
        },
        then: function (onFulfilled, onRejected) {
            var deferred = TP.deferred();
            callbackQueue.push([deferred, {resolve:onFulfilled,reject:onRejected } ]);
            resolving();
            return deferred.promise;
        }
    };

    function then( callbacks, deferred , actionName) {
        var callback = callbacks[actionName];
        var adoptState = deferred[actionName];
        try {
            typeof callback == FUNCTION ?
                resolution(callback(value)):
                adoptState(value);
        } catch (err) {
            deferred.reject(err);
        }

        function resolution(x) {
            var xThen;
            var stater = dependence(resolution, deferred.reject);
            if (x === deferred.promise) throw TypeError('promise can`t return itself');
            try {
                if (x === Object(x) && typeof (xThen = x.then) === FUNCTION)
                    xThen.call(x, stater.resolve, stater.reject);
                else
                    deferred.resolve(x);

            } catch (err) {
                stater.reject(err);
            }
        }
    }

    if (typeof initializer == FUNCTION) {
        try {
            initializer.call(promise, fulfilled, rejector);
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
            promise.then(checkout.bind(promise, i))
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


