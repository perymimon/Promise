/**
 * Created by pery on 4/9/2017.
 */
(function( window ) {
    'use strict';

    window.rejected = rejected;
    window.resolved = resolved;
    window.deferred = deferred;
    var _Promise = window._Promise || require('./../Promise2')._Promise;

    function resolved(value) {
        return _Promise.resolve(value);
    }

    function rejected(reason) {
        return _Promise.reject(reason);
    }

    function deferred() {
        var resolved ;
        var rejected ;
        var promise = new _Promise( function (res, rej) {
            resolved = res;
            rejected = rej;
        });
        return {
            promise: promise,
            resolve: resolved,
            reject: rejected
        }
    };
})( typeof exports === 'undefined'? window: module.exports );