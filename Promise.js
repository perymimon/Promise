/**
 * Created by pery on 02/04/2017.
 */
function Promise(cb) {
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
        resolve(cb/*value*/)

    }

    function resolve(value){
        _status = 'fulfilled';
        _value = value;
        resolve();
    }
    function reject(err) {
        _status = 'rejected';
        _error = new Error(err);

    }
    var _resolveQ = [];
    var _rejectQ = [];

    function resolving() {
        if(_value == 'fulfilled'){
            for(var i=0, p; p = _resolveQ[i]; i++ ){
                p(_value);
            }
            _resolveQ.length = 0;
        }
    }

    var promise = {
        get status () {
            return _status;
        },
        then:function (cb) {
            var value = _resolveQ.push(cb);
            resolving();
            return new Promise(value)
        },
        catch:function (cb) {
            _rejectQ.push(cb)
        }
    };

    return Object.create(promise);
}

