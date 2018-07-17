<a href="https://promisesaplus.com/" style="float:right">
    <img src="https://promisesaplus.com/assets/logo-small.png" alt="Promises/A+ logo"
         title="Promises/A+ 1.0 compliant" align="right" />
</a>

Tiny Promise
============
TP is implementation of [Promises/A+](URL=https://github.com/promises-aplus/promises-spec) spec by using ec5 js only. 
It's an agnostic, cross-browser and very lightweight library to polyfill native promise and it simple enough to extend it with more features 

### Browser Compatibility
TP is compatible with the following browsers/versions:
* Google Chrome
* Firefox
* Safari
* IOS Safari
* Opera
* IE 7+

###Spec
spec's test come from [Promises/A+ Compliance Test Suite](https://github.com/promises-aplus/promises-tests) 

## Used
simple usage    
    
    // define new promise that fulified after two seconds
    var promise1 = new TP(function (res, rej){
        setTimeout(function() {
          res('go on');
        }, 2000);
    })
    
    // then return new value that depend on the fulified value 
    var promise2 = promise1.then(function fullified(value) {
        console.log(value); // echo 'go on'
        return value + ' again';
    })
    // do somthing with the new value but expetion are happend so new promise rejected
    .then(function (value) {
        console.log(value); // echo 'go on again'
        throw 'what"s happen???'
    })
    // catch the expection and do somthing with it
    .catch(function(err) {
        console.log(err); // 'what"s happen???'
        return 'every thing ok now' 
    })
    // after that promise are ok again
    .then (function (value){
        console.log(value); // 'every thing ok now'
    })
    // the value that return can be promise, so what happen next depend on the status of the promise
    .then( function (value){
    
        return TP.reject( 'sorry, it just happen' ) 
    })
    .catch(function(err) {
            console.log(err); // 'sorry, it just happen'
            return 'every thing ok now' 
    }) 
    // the value that return can be even *thentable*, so now the object that you write can decide what happen next 
    .then( function (value){
        return {
            then:function(res, rej){
                Math.random()>0.5> res('ye'), rej('ho no')            
            } 
    }).then( function onFullified(value){
        console.log(value) // 'ye'
    },function onReject(reason){
        console.log( reason ) // 'ho no'
    })     



### API
 constructor 
 
    const promise = TP(function init( resolve, reject ){
        //some code that call resolve or reject at some point 
    }) 
    
 promise
    
    const newPromise = promise.then( fulifiedCallback ( value ){} , rejectCallback(reson){})
    
    const newPromise = promise.catch( rejectCallback(reson){} )
    
    promise.status // return the status of the promise can be:  'pending', 'reject', 'resolve'      
    
    promise.value // return the value of the promise can come from resolve or reject
    
 static functions
 
    TP.all([promise1, promise2, ...] )
    .then(function onAllFilied(values){
        promise1Value = value[0];
        promise2Value = value[1];
        ...
    },function someReject(reason){
        // when one of the promises rejected
    })
    
    TP.race([promise1, promise2, ...] )
    .then(
        function whenFirstPromiseResolve(value){},
        function orWhenFirstPromiseReject(reason){}
    )
    
    rejectedPromise = TP.reject(reason);
    
    resolvedPromise = TP.resolve(value);
    
    {promise, resolve, reject} = TP.deferred();             