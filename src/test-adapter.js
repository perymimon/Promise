import TinyPromise from './tinyPromise.js'

export function resolved(value) {
    return TinyPromise.resolve(value);
}

export function rejected(reason) {
    return TinyPromise.reject(reason);
}

export function deferred() {
    var resolved, rejected;
    var promise = new TinyPromise(function (res, rej) {
        resolved = res;
        rejected = rej;
    });

    return {
        promise: promise,
        resolve: resolved,
        reject: rejected
    }
}
