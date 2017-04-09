/**
 * Created by pery on 4/9/2017.
 */
var adapter = require('./test-addpeter');
var promisesAplusTests = require("promises-aplus-tests");

promisesAplusTests(adapter, function (err) {
    // All done; output is in the console. Or check `err` for number of failures.
});