'use strict';
/**
 * Created by pery on 4/9/2017.
 */
var _Promise = require('./../dist/tp');


function resolved(value) {
    return _Promise.resolve(value);
}

function rejected(reason) {
    return _Promise.reject(reason);
}

function deferred() {
    var resolved, rejected;
    var promise = new _Promise(function (res, rej) {
        resolved = res;
        rejected = rej;
    });

    return {
        promise: promise,
        resolve: resolved,
        reject: rejected
    }
}

exports.rejected = rejected;
exports.resolved = resolved;
exports.deferred = deferred;

