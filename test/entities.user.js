
var assert = require('chai').assert,
    expect = require('chai').expect,
    should = require('chai').should(),
    _ = require('underscore');


describe('entities.user', function(){
    var path = require('path'),
        sdk = require('../lib/grasshopper-sdk'),
        testUserId = "autocreatedtestuser",
        testUserEmail = "autocreated@thinksolid.com",
        testUserLogin = "autocreatedtestusername",
        templateUser = {
            _id: testUserId,
            name: "Test User",
            password: "Test Password",
            email: testUserEmail,
            role: "admin",
            login: testUserLogin
        },
        config = {
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
        },
        internalSdk = new sdk(config),
        grasshopper = null;

    before(function(done){
        internalSdk.on('ready', function(val){
            grasshopper = val;
            done();
        });

        internalSdk.on('failed', function(err){
            done(err);
        });
    });



    describe('#create()', function(){
        it('should create a user without an error.', function(done){

            var testUser = _.clone(templateUser);

            grasshopper.users.create(testUser, function(err, user){
                should.not.exist(err);
                should.exist(user);
                user.should.be.an("object");
                should.exist(user._id);
                expect(user._id).to.have.length.above(0);
                done();
            });
        });

        it('should return error if a duplicate is created.', function(done){
            var testUser = _.clone(templateUser);

            grasshopper.users.create(testUser, function(err, user){
                should.exist(err);
                done();
            });
        });

        it('should validate and return error if a mandatory property is missing.',function(done){

            var newUser = {
                password: "Test Password",
                email: this.testUserEmail,
                role: "admin",
                login: this.testUserLogin
            };

            grasshopper.users.create(newUser, function(err, user){
                should.exist(err);
                done();
            });

        });

        it('should return error if an empty login is provided.', function(done){
            var testUser = _.clone(templateUser);
            testUser.login = "";

            grasshopper.users.create(testUser, function(err, user){
                should.exist(err);
                done();
            });
        });

        it('should return error if an null login is provided.', function(done){
            var testUser = _.clone(templateUser);
            testUser.login = null;

            grasshopper.users.create(testUser, function(err, user){
                should.exist(err);
                done();
            });
        });

        it('should return error if a login is too short.', function(done){
            var testUser = _.clone(templateUser);
            testUser.login = "sho";

            grasshopper.users.create(testUser, function(err, user){
                should.exist(err);
                done();
            });
        });

        it('should return error if a password is null.', function(done){
            var testUser = _.clone(templateUser);
            testUser.password = null;

            grasshopper.users.create(testUser, function(err, user){
                should.exist(err);
                done();
            });
        });

        it('should return error if a password is too short.', function(done){
            var testUser = _.clone(templateUser);
            testUser.password = '12345';

            grasshopper.users.create(testUser, function(err, user){
                should.exist(err);
                done();
            });
        });

        it('should return error if a user has a role that is not allowed.', function(done){
            var testUser = _.clone(templateUser);
            testUser.role = "my made up role";

            grasshopper.users.create(testUser, function(err, user){
                should.exist(err);
                done();
            });
        });
    });

    describe('#update()', function(){
        it('should update a user in the system.', function(done){
            var testUser = _.clone(templateUser);
            testUser._id = testUserId;

            grasshopper.users.update(testUser, function(err){
                should.not.exist(err);
                done();
            });
        });

        it('should return error is user is updated without a set "ID"', function(done){
            var testUser = {
                name: 'aaaaaaaaaaa',
                password: "Test Password",
                email: this.testUserEmail,
                role: "admin",
                login: this.testUserLogin
            };

            grasshopper.users.update(testUser, function(err){
                should.exist(err);
                done();
            });
        });

        it('should return error if login is too short.', function(done){
            var testUser = _.clone(templateUser);
            testUser._id = testUserId;
            testUser.login = "tes";

            grasshopper.users.update(testUser, function(err){
                should.exist(err);
                done();
            });
        });

        it('should return error if user role is invalid.', function(done){
            var testUser = _.clone(templateUser);
            testUser._id = testUserId;
            testUser.role = "my role is invalid";

            grasshopper.users.update(testUser, function(err){
                should.exist(err);
                done();
            });
        });

        it('should return error if user login is null.', function(done){
            var testUser = _.clone(templateUser);
            testUser._id = testUserId;
            testUser.login = null;

            grasshopper.users.update(testUser, function(err){
                should.exist(err);
                done();
            });
        });

        it('should return error if user login is empty string.', function(done){
            var testUser = _.clone(templateUser);
            testUser._id = testUserId;
            testUser.login = "";

            grasshopper.users.update(testUser, function(err){
                should.exist(err);
                done();
            });
        });

        it('should return error if user password is empty string.', function(done){
            var testUser = _.clone(templateUser);
            testUser._id = testUserId;
            testUser.password = "";

            grasshopper.users.update(testUser, function(err){
                should.exist(err);
                done();
            });
        });

        it('should return error if user password is null.', function(done){
            var testUser = _.clone(templateUser);
            testUser._id = testUserId;
            testUser.password = null;

            grasshopper.users.update(testUser, function(err){
                should.exist(err);
                done();
            });
        });

        it('should return error if user has invalid permissions object sent to db.', function(done){
            var testUser = _.clone(templateUser);
            testUser._id = testUserId;
            testUser.permissions = [{"nodeid" : "fdasfsad","role" : "fadsfas"}];

            grasshopper.users.update(testUser, function(err){
                should.exist(err);
                done();
            });
        });
    });

    describe('#disable()', function(){
        it('should disable a user in the db.', function(done){
            grasshopper.users.disable(testUserId, function(err){
                should.not.exist(err);
                done();
            });
        });

        it('should return error if null user id is provided.', function(done){
            grasshopper.users.disable(null, function(err){
                should.exist(err);
                done();
            });
        });

        it('should return error if empty user id is provided.', function(done){
            grasshopper.users.disable("", function(err){
                should.exist(err);
                done();
            });
        });

        it('should return error if bad user id is provided.', function(done){
            grasshopper.users.disable("mybaduserid", function(err){
                should.exist(err);
                done();
            });
        });
    });

    describe('#enable()', function(){
        it('should enable a user in the db.', function(done){
            grasshopper.users.enable(testUserId, function(err){
                should.not.exist(err);
                done();
            });
        });

        it('should return error if null user id is provided.', function(done){
            grasshopper.users.enable(null, function(err){
                should.exist(err);
                done();
            });
        });

        it('should return error if empty user id is provided.', function(done){
            grasshopper.users.enable("", function(err){
                should.exist(err);
                done();
            });
        });

        it('should return error if bad user id is provided.', function(done){
            grasshopper.users.enable("mybaduserid", function(err){
                should.exist(err);
                done();
            });
        });
    });

    describe('#getById()', function(){
        it('should load a user from the db.', function(done){
            grasshopper.users.getById(testUserId, function(err, result){
                should.not.exist(err);
                expect(result).to.be.an('object');
                done();
            });
        });

        it('should return error if bad user id is provided.', function(done){
            grasshopper.users.getById("baduserid", function(err){
                should.exist(err);
                done();
            });
        });

        it('should return error if empty user id is provided.', function(done){
            grasshopper.users.getById("", function(err){
                should.exist(err);
                done();
            });
        });

        it('should return error if null user id is provided.', function(done){
            grasshopper.users.getById(null, function(err){
                should.exist(err);
                done();
            });
        });
    });

    describe('#getByLogin()', function(){
        it('should load a user from the db.', function(done){
            grasshopper.users.getByLogin(testUserLogin, function(err, result){
                should.not.exist(err);
                expect(result).to.be.an('object');
                done();
            });
        });

        it('should return error if bad user login is provided.', function(done){
            grasshopper.users.getByLogin("baduserid", function(err){
                should.exist(err);
                done();
            });
        });

        it('should return error if empty user login is provided.', function(done){
            grasshopper.users.getByLogin("", function(err){
                should.exist(err);
                done();
            });
        });

        it('should return error if null user login is provided.', function(done){
            grasshopper.users.getByLogin(null, function(err){
                should.exist(err);
                done();
            });
        });
    });

    describe('#getByEmail()', function(){
        it('should load a user from the db.', function(done){
            grasshopper.users.getByEmail(testUserEmail, function(err, result){
                should.not.exist(err);
                expect(result).to.be.an('object');
                done();
            });
        });

        it('should return error if bad user email is provided.', function(done){
            grasshopper.users.getByEmail("baduserid", function(err){
                should.exist(err);
                done();
            });
        });

        it('should return error if empty user email is provided.', function(done){
            grasshopper.users.getByEmail("", function(err){
                should.exist(err);
                done();
            });
        });

        it('should return error if null user email is provided.', function(done){
            grasshopper.users.getByEmail(null, function(err){
                should.exist(err);
                done();
            });
        });
    });

    describe('#delete()', function(){
        it('should delete a user from the system.', function(done){
            grasshopper.users.delete(testUserId, function(err){
                should.not.exist(err);
                done();
            });
        });
    });
});