module.exports = {
    setUp: function (callback) {
        var path = require('path');

        this.cache = require('../lib/utils/cache');
        this.cache.init({
            "path" : path.resolve(__dirname, "../") + "/cache"
        });
        this.cacheKey = "test";
        this.cacheValue = "{test:tefdsafsafdsast}";

        callback();
    },
    tearDown: function (callback) {
        // clean up
        callback();
    },
    testAddCachedValue: function (test) {

        this.cache.add(this.cacheKey, this.cacheValue, function(val){
            console.log(val);
            test.done();
        });
    },
    testGetCachedValue: function (test) {

        this.cache.get(this.cacheKey, function(val){
            console.log(val);
            test.done();
        });
    }
};