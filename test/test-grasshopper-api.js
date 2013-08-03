module.exports = {
    setUp: function (callback) {
        var path = require('path');

        this.config = {
            db: {
                type: 'couchdb',
                url: '',
                username: '',
                password: ''
            },
            logger: {
                adapters: [{
                    type: "file",
                    path: path.resolve(__dirname, "../") + "/log/grasshopper.log",
                    application: 'grasshopper-api',
                    machine: 'dev-server'
                }]
            }
        };


        callback();
    },
    tearDown: function (callback) {
        // clean up
        callback();
    },
    testInitApi: function (test) {

        var api = require('../lib/grasshopper-api');
        api.init(this.config);

        test.done();
    }
};