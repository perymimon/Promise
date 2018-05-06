# Tiny Promise
It's an agnostic, cross-browser and very lightweight library to polyfill native promise and help extend it with more features 

## Browser Compatibility
P is compatible with the following browsers/versions:
* Google Chrome
* Firefox
* Safari
* IOS Safari
* Opera
* IE 7+

## used
```javascript
 var doSomthing = new Promise(function (res, rej){
    setTimeout(function() {
      res('go on');
    }, 2000);
 })
```

```javascript
 
 doSomthing
 .then(function fullified(value) {
   console.log(value); // echo 'go on'
   return 'next value on the pipe'
 })
 .then(function (value) {
   console.log(value); // echo 'next value on the pipe'
   throw 'what"s happen???'
 })
 .catch(function(err) {
   console.log(err); // 'what"s happen???'
 })
 
```

```javascript
var doAnotherStuff = new promise(function(res, rej) {
   setTimeout(function() {
         res('go on with another stuff');
   }, 1000);
}); 

doSomthing.then(function(value) {   
  "... do somthing with the value"
  return doAnotherStuff.then(function(value){
      return value;
  })
  
}) 
```

```javascript
// can work with thentable

var myService = function(){
    "...."
    return {
        // thentable : function with the name then
        then:function(resolve, reject) {  
          "...."
          resolve("some value")
          'or'
          reject('resone');
        }
    }
}


doSomthing.then(function(value) {   
     "... do somthing with the value"
    return myService();
    
})

```

