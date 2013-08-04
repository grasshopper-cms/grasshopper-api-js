module.exports = {
    setUp: function (callback) {
        var path = require('path');

        this.config = {
            cache: {
                path: path.resolve(__dirname, "../") + "/cache"
            },
            db: {
                type: 'couchdb',
                host: 'https://solidinteractive.cloudant.com',
                database: 'grasshopper',
                username: 'solidinteractive',
                password: '1q2w3e4r'
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

        var api = require('../lib/grasshopper-api'),
            Api = new api(this.config);


       Api.on('ready', function(a){
           /* api.users.create({
                email: 'jennifer',
                type: 'user',
                name: 'Jennifer'
            });*/
           console.log(a);
            test.done();
        });
    }
};