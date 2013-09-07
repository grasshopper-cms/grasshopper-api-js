module.exports = {
    setUp: function (callback) {
        var path = require('path'),
            api = require('../lib/grasshopper-api'),
            self = this;

        this.testUserId = "autocreatedtestuser";

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

        _api.on('failed', function(err){
            callback();
        });

    },
    tearDown: function (callback) {
        // clean up
        callback();
    },
    testCreateNewUser: function(test){

        var newUser = {
            _id: this.testUserId,
            name: "Test User",
            password: "Test Password",
            email: "test@test.com",
            role: "admin",
            login: "testuser"
        };

        this.grasshopper.users.create(newUser, function(err, user){
            if(err){
                test.ok(false, err);
            }
            else {
                if(user == null){
                    test.ok(false, "User object is null, something went wrong.");
                }
                else if(user._id == null){
                    test.ok(false, "User ID is null, something went wrong.");
                }
                else if(user._id.length == 0){
                    test.ok(false, "User ID is a 0 length string, something went wrong.");
                }
                else {
                    test.ok(true, "User created without an error.");
                }
            }
            test.done();
        });

    },
    testCreateNewUserWithMissingProps: function(test){

        var newUser = {
                password: "Test Password",
                email: "test@test.com",
                role: "admin",
                login: "testuser"
            };

        this.grasshopper.users.create(newUser, function(err, user){
            if(!err){
                test.ok(false, err);
            }
            else {
                test.ok(true);
            }

            test.done();
        });
    },
    testCreateNewUserWithEmptyLogin: function(test){

        var newUser = {
            name: "My name",
            password: "Test Password",
            email: "test@test.com",
            role: "admin",
            login: ""
        };

        this.grasshopper.users.create(newUser, function(err, user){
            if(!err){
                test.ok(false, err);
            }
            else {
                test.ok(true);
            }

            test.done();
        });
    },
    testCreateNewUserWithNullLogin: function(test){

        var newUser = {
            name: "My name",
            password: "Test Password",
            email: "test@test.com",
            role: "admin",
            login: null
        };

        this.grasshopper.users.create(newUser, function(err, user){
            if(!err){
                test.ok(false, err);
            }
            else {
                test.ok(true);
            }

            test.done();
        });
    },
    testCreateNewUserWithTooShortLogin: function(test){

        var newUser = {
            name: "My name",
            password: "Test Password",
            email: "test@test.com",
            role: "admin",
            login: "sho"
        };

        this.grasshopper.users.create(newUser, function(err, user){
            if(!err){
                test.ok(false, err);
            }
            else {
                test.ok(true);
            }

            test.done();
        });
    },
    testCreateNewUserWithNullPassword: function(test){

        var newUser = {
            name: "My name",
            password: "Test Password",
            email: "test@test.com",
            role: "admin",
            login: "login"
        };

        this.grasshopper.users.create(newUser, function(err, user){
            if(!err){
                test.ok(false, err);
            }
            else {
                test.ok(true);
            }

            test.done();
        });
    },
    testUpdateUser: function(test){

        var updateUser = {
            _id: this.testUserId,
            name: 'aaaaaaaaaaa',
            password: "Test Password",
            email: "test@test.com",
            role: "admin",
            login: "testuser"
        };

        this.grasshopper.users.update(updateUser, function(err){
            if(err){
                test.ok(false, err);
            }
            else {
                test.ok(true);
            }

            test.done();
        });
    },
    testUpdateUserWithoutIdSet: function(test){

        var updateUser = {
            name: 'aaaaaaaaaaa',
            password: "Test Password",
            email: "test@test.com",
            role: "admin",
            login: "testuser"
        };

        this.grasshopper.users.update(updateUser, function(err){
            if(err){
                test.ok(true, err);
            }
            else {
                test.ok(false);
            }

            test.done();
        });
    },
    testDisableUser: function(test){
        this.grasshopper.users.disable(this.testUserId, function(err){
            if(err){
                test.ok(false, err);
            }
            else {
                test.ok(true);
            }

            test.done();
        });
    },
    testDisableUserEmptyId: function(test){
        this.grasshopper.users.disable('fdafdasfdasf', function(err){
            if(err){
                test.ok(true, err);
            }
            else {
                test.ok(false);
            }

            test.done();
        });
    },
    testDisableUserBadId: function(test){
        this.grasshopper.users.disable(null, function(err){
            if(err){
                test.ok(true, err);
            }
            else {
                test.ok(false);
            }

            test.done();
        });
    },
    testEnableUser: function(test){
        this.grasshopper.users.enable(this.testUserId, function(err){
            if(err){
                test.ok(false, err);
            }
            else {
                test.ok(true);
            }

            test.done();
        });
    },
    testEnableUserEmptyId: function(test){
        this.grasshopper.users.enable('fdafdasfdasf', function(err){
            if(err){
                test.ok(true, err);
            }
            else {
                test.ok(false);
            }

            test.done();
        });
    },
    testEnableUserBadId: function(test){
        this.grasshopper.users.enable(null, function(err){
            if(err){
                test.ok(true, err);
            }
            else {
                test.ok(false);
            }

            test.done();
        });
    },
    testGetCreatedUser: function (test) {

        this.grasshopper.users.getById(this.testUserId, function(err, result){
            if(err){
                test.ok(false, err);
            }
            else {
                test.ok(true);
            }
            test.done();
        });
    },
    testGetCreatedUserBadId: function (test) {

        this.grasshopper.users.getById("fdsafjdsaklfjdsaklj", function(err, result){
            if(err){
                test.ok(true, err);
            }
            else {
                test.ok(false);
            }
            test.done();
        });
    },
    testGetCreatedUserEmptyId: function (test) {

        this.grasshopper.users.getById(null, function(err, result){
            if(err){
                test.ok(true, err);
            }
            else {
                test.ok(false);
            }
            test.done();
        });
    }
};