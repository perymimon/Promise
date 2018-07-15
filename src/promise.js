var PENDING = [/*'pending'*/],
    REJECT = [/*'reject'*/],
    RESOLVE = [/*'resolve'*/],
    FUNCTION = 'function';

function noop(x) {
}

function one(func) {
    return function () {
        func && func.apply(this, arguments);
        func = null;
    }
}

export default function TP(initializer) {
    var _status = PENDING;
    var _value = null; /*also _reason*/

    var _resolveQ = [];
    var _rejectQ = [];
    var _resolving = noop;
    var decidedQueue = null;

    var resolver = one(function(status, value, queue){
        _status = status;
        // _reason = reason;
        _value = value;
        decidedQueue = queue;
        resolving();
        _resolving = resolving;
    });

    function fulfilled(value) {
        resolver(RESOLVE, value, _resolveQ);
    }

    function rejector(reason) {
        resolver(REJECT, reason, _rejectQ)
    }



    function resolving() {
        setTimeout(function () {
            var i = 0, res;
            while (res = decidedQueue[i++]) {
                res(_value);
            }
            _rejectQ.length = 0;
            _resolveQ.length = 0;
        }, 0);
    }

    var promisePrototype = {
        get status() {
            return _status[0];
        },
        get value() {
            return _value
        },
        catch:function (onRejected) {
            return TP.then(null, onRejected);
        },
        then:function(onFulfilled, onRejected) {
            return new TP(function (res, rej) {
                _resolving();
                _resolveQ.push(then.call(this, res, onFulfilled, rej, res));
                _rejectQ.push(then.call(this, res, onRejected, rej, rej));
            });
        }
    };

    var me = Object.create(promisePrototype);
    me.constructor = initializer;
    if (typeof initializer == FUNCTION) {
        try {
            me.constructor(fulfilled , rejector);
        } catch (err) {
            rejector(err);
        }
    } else {
        fulfilled (initializer/*value*/);
    }





    function then(res, on, rej, onAdopt) {
        var me = this;
        var xThen;
        return function (value) {
            try {
                if (on instanceof Function)
                    resolution(on(value));
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
                if (x === Object(x) && typeof (xThen = x.then) === FUNCTION)
                    xThen.call(x, one(function (y) {
                        _rej = noop;
                        resolution(y)
                    }), function (r) {
                        _rej(r);
                    });
                else
                    res(x);

            } catch (err) {
                _rej(err);
            }
        }

    }


    return me;


}

TP.all = function (iterable) {
    return new TP(function (res, rej) {
        var ret = [];
        var count = 0;

        function ceckout(index, value) {
            ret[index] = value;
            count++;
            if (count == iterable.length)
                res(ret)
        }

        iterable.forEach(function (promise, i) {
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


