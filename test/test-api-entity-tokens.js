module.exports = {
    setUp: function (callback) {
        this.tokens = require('../lib/entities/tokens');
        this.userId = '12345';
        callback();
    },
    tearDown: function (callback) {
        // clean up
        callback();
    },
    testCreateTokenRegularUser: function (test) {

        var token = this.tokens.create(this.userId);

        test.equals(token.isValid, true);
        test.equals(token.isSuper, false);
        test.equals(token.userId, this.userId);
        test.done();
    },
    testCreateTokenSuperUser: function (test) {

        var token = this.tokens.create(this.userId,true);

        test.equals(token.isValid, true);
        test.equals(token.isSuper, true);
        test.equals(token.userId, this.userId);
        test.done();
    },
    testRevokeToken: function (test) {

        var token = this.tokens.create(this.userId,true);

        this.tokens.revoke(token.token);

        token = this.tokens.validate(token.token);
        test.equals(token.isValid, false);
        test.equals(token.isSuper, false);
        test.equals(token.userId, null);

        test.done();
    }
};