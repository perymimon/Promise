/**
 * Created by pery on 4/9/2017.
 */
var adapter = require('./src/test-addpeter');
var promisesAplusTests = require("promises-aplus-tests");

promisesAplusTests(adapter, function (err) {
    // All done; output is in the console. Or check `err` for number of failures.
    if(err) console.log('some error from the promise test', err);
    else console.log('test done successfully');
});