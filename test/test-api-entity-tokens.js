module.exports = {

    setUp: function (callback) {

        var app = require('../lib/config/app');
        this.tokens = require('../lib/entities/tokens')(app);
        callback();
    },
    tearDown: function (callback) {
        // clean up
        callback();
    },
    testAddToken: function (test) {
        this.tokens.addToken('token', 'value');
        console.log();
        //test.equals(this.foo, 'bar');
        test.done();
    }
};