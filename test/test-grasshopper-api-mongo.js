module.exports = {
    setUp: function (callback) {
        var path = require('path'),
            api = require('../lib/grasshopper-api'),
            self = this;

        this.config = {
            cache: {
                path: path.resolve(__dirname, "../") + "/cache"
            },
            db: {
                type: 'mongodb',
                host: 'mongodb://{dbuser}:{dbpassword}@ds043348.mongolab.com:43348/grasshopper',
                database: 'grasshopper',
                username: 'grasshopper-user',
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

        var _api = new api(this.config);


        _api.on('ready', function(grasshopper){
            self.grasshopper = grasshopper;
            callback();
        });

    },
    tearDown: function (callback) {
        // clean up
        callback();
    },
    testCreateNewUser: function(test){

        var newUser = {
            name: "Test User",
            password: "Test Password",
            email: "test@test.com",
            role: "admin",
            login: "testuser"
        };

        this.grasshopper.users.create(newUser, function(){
            test.done();
        });

    },
    testCreateNewUserWithMissingProps: function(test){

        var newUser = {

        };

        test.done();
    },
    testInitApi: function (test) {

        console.log('Test API');


        test.done();

    }
};