var assert = require('chai').assert,
    expect = require('chai').expect,
    should = require('chai').should(),
    _ = require('underscore');

describe('util.cache', function(){
    var path = require('path'),
        cache = require('../lib/utils/cache')({
            "path" : path.resolve(__dirname, "../") + "/cache"
        }),
        cacheKey = "test",
        cacheValue = "{test:tefdsafsafdsast}";

    describe('#add()', function(){
        it('should create a cached item.', function(done){
            cache.add(cacheKey, cacheValue, function(err, val){
                should.not.exist(err);
                assert.equal(val, true, "response is true");
                done();
            });
        });
    });

    describe('#get()', function(){
        it('should retrieve a cached item.', function(done){
            cache.get(cacheKey, function(err, val){
                should.not.exist(err);
                should.exist(val);
                done();
            });
        });

        it('should return error if a cached key is invalid.', function(done){
            cache.get("badcachekey", function(err, val){
                should.exist(err);
                should.not.exist(val);
                done();
            });
        });
    });

    describe('#remove()', function(){
        it('should remove a cached item.', function(done){
            cache.remove(cacheKey, function(err, val){
                should.not.exist(err);
                assert.equal(val, true, "response is true");
                done();
            });
        });

        it('should return error if a cached key is invalid.', function(done){
            cache.return("badcachekey", function(err, val){
                should.exist(err);
                assert.equal(val, false, "response is false.")
                done();
            });
        });
    });
});