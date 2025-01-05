/**
 * Created by pery on 4/9/2017.
 */
import * as testAdapter from './src/test-adapter.js'
import promisesAplusTests from 'promises-aplus-tests'

promisesAplusTests(testAdapter, function (err) {
    // All done; output is in the console. Or check `err` for number of failures.
    if(err) console.log('some error from the promise test', err);
    else console.log('test done successfully');
});