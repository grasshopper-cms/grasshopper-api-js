module.exports = {
    setUp: function (callback) {
        var path = require('path'),
            api = require('../lib/grasshopper-api'),
            self = this;

        this.testUserId = "autocreatedtestuser";
        this.testUserEmail = "autocreated@thinksolid.com";
        this.testUserLogin = "autocreatedtestusername";

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
        callback();
    },
    testCreateNewUser: function(test){

        var newUser = {
            _id: this.testUserId,
            name: "Test User",
            password: "Test Password",
            email: this.testUserEmail,
            role: "admin",
            login: this.testUserLogin
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
                email: this.testUserEmail,
                role: "admin",
                login: this.testUserLogin
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
            email: this.testUserEmail,
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
            email: this.testUserEmail,
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
            email: this.testUserEmail,
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
            password: null,
            email: this.testUserEmail,
            role: "admin",
            login: this.testUserLogin
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
    testCreateNewUserWithBadRole: function(test){

        var newUser = {
            name: "My name",
            password: "123456",
            email: this.testUserEmail,
            role: "",
            login: this.testUserLogin
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
    testCreateNewUserWithShortPassword: function(test){

        var newUser = {
            name: "My name",
            password: "12345",
            email: this.testUserEmail,
            role: "admin",
            login: this.testUserLogin
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
            email: this.testUserEmail,
            role: "admin",
            login: this.testUserLogin
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
            email: this.testUserEmail,
            role: "admin",
            login: this.testUserLogin
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
    testUpdateUserWithoutShortLogin: function(test){

        var updateUser = {
            _id: this.testUserId,
            name: 'aaaaaaaaaaa',
            password: "Test Password",
            email: this.testUserEmail,
            role: "admin",
            login: "tes"
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
    testUpdateUserWithoutBadRole: function(test){

        var updateUser = {
            _id: this.testUserId,
            name: 'aaaaaaaaaaa',
            password: "Test Password",
            email: this.testUserEmail,
            role: "",
            login: this.testUserLogin
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
    testUpdateUserWithoutNullLogin: function(test){

        var updateUser = {
            _id: this.testUserId,
            name: 'aaaaaaaaaaa',
            password: "Test Password",
            email: this.testUserEmail,
            role: "admin",
            login: null
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
    testUpdateUserWithoutEmptyLogin: function(test){

        var updateUser = {
            _id: this.testUserId,
            name: 'aaaaaaaaaaa',
            password: "Test Password",
            email: this.testUserEmail,
            role: "admin",
            login: ""
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
    testUpdateUserWithoutEmptyPassword: function(test){

        var updateUser = {
            _id: this.testUserId,
            name: 'aaaaaaaaaaa',
            password: "",
            email: this.testUserEmail,
            role: "admin",
            login: this.testUserLogin
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
    testUpdateUserWithoutNullLPassword: function(test){

        var updateUser = {
            _id: this.testUserId,
            name: 'aaaaaaaaaaa',
            password: null,
            email: this.testUserEmail,
            role: "admin",
            login: this.testUserLogin
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
    testUpdateUserWithInvalidPermissions: function(test){

        var updateUser = {
            _id: this.testUserId,
            name: 'aaaaaaaaaaa',
            password: "123456fds",
            email: this.testUserEmail,
            role: "admin",
            login: this.testUserLogin,
            permissions: [{"nodeid" : "fdasfsad","role" : "fadsfas"}]
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
    },
    testGetCreatedUserLogin: function (test) {
        this.grasshopper.users.getByLogin(this.testUserLogin, function(err, result){
            if(err){
                test.ok(false, err);
            }
            else {
                test.ok(true);
            }
            test.done();
        });
    },
    testGetCreatedUserEmptyLogin: function (test) {
        this.grasshopper.users.getByLogin("", function(err, result){
            if(!err){
                test.ok(false);
            }
            else {
                test.ok(true);
            }
            test.done();
        });
    },
    testGetCreatedUserEmail: function (test) {
        this.grasshopper.users.getByEmail(this.testUserEmail, function(err, result){
            if(err){
                test.ok(false, err);
            }
            else {
                test.ok(true);
            }
            test.done();
        });
    },
    testGetCreatedUserEmptyEmail: function (test) {
        this.grasshopper.users.getByEmail("", function(err, result){
            if(!err){
                test.ok(false);
            }
            else {
                test.ok(true);
            }
            test.done();
        });
    },
    testDeleteUser: function (test) {

        this.grasshopper.users.delete(this.testUserId, function(err){
            if(err){
                test.ok(false, err);
            }
            else {
                test.ok(true);
            }
            test.done();
        });
    }
};