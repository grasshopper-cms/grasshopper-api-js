"use strict";

var should = require('chai').should();

describe('util.crypto', function(){
    var crypto = require('../lib/utils/crypto'),
    testSalt = "1277293092677",
    testClearText = "This is my password!",
    testEncryptedText = "5a59c742e3275a0ae79d41df5901ca7b9c788a52cabe50dcc54ff9003639cd99";

    describe('createHash)', function(){
        it('should create a hashed item.', function(done){
            var hash = crypto.createHash(testClearText, testSalt);
            hash.toString().should.equal(testEncryptedText);
            done();
        });
    });
});