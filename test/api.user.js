var should = require('chai').should();
var request = require('supertest');

describe('api.users', function(){
    var url = 'http://localhost:8080',
        testUserId  = "5245ce1d56c02c066b000001",
        readerToken = "",
        adminToken  = "",
        testCreatedUserId = "",
        testCreatedUserIdCustomVerb = "";

    before(function(done){
        request(url)
            .get('/token')
            .set('Accept', 'application/json')
            .set('Accept-Language', 'en_US')
            .set('authorization', new Buffer('apitestuseradmin:TestPassword').toString('base64'))
            .end(function(err, res) {
                if (err) { throw err; }
                adminToken = res.body.access_token;

                request(url)
                    .get('/token')
                    .set('Accept', 'application/json')
                    .set('Accept-Language', 'en_US')
                    .set('authorization', new Buffer('apitestuserreader:TestPassword').toString('base64'))
                    .end(function(err, res) {
                        if (err) { throw err; }
                        readerToken = res.body.access_token;
                        done();
                    });
            });
    });

    describe("GET: " + url + '/users/:id', function() {
        it('should return 401 because trying to access unauthenticated', function(done) {

            request(url)
                .get('/users/' + testUserId)
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(401);
                    done();
                });
        });
        it('should return a 403 because user does not have permissions to access users', function(done) {
            request(url)
                .get('/users/' + testUserId)
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + readerToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(403);
                    done();
                });
        });
        it('should return an existing user', function(done) {
            request(url)
                .get('/users/' + testUserId)
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + adminToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    res.body.login.should.equal("apitestuser");
                    done();
                });
        });
        it('should return 404 because test user id does not exist', function(done) {
            request(url)
                .get('/users/fakeuserid')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + adminToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(404);
                    done();
                });
        });
    });

    describe("GET: " + url + '/user', function() {
        it('should return the current logged in user', function(done) {
            request(url)
                .get('/user')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + readerToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    res.body.login.should.equal("apitestuserreader");
                    done();
                });
        });
        it('should return a 401 because user is not authenticated', function(done) {
            request(url)
                .get('/user')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(401);
                    done();
                });
        });
    });

    describe("GET: " + url + '/users', function() {
        it('should return a list of users with the default page size', function(done) {
            request(url)
                .get('/users')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + adminToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    res.body.should.have.property('total');
                    res.body.should.have.property('results');
                    done();
                });
        });
        it('should a list of users with the specified page size', function(done) {
            request(url)
                .get('/users?limit=1&skip=0')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + adminToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    res.body.should.have.property('total');
                    res.body.should.have.property('results');
                    done();
                });
        });
        it('should return a 403 because user does not have permissions to access users', function(done) {
            request(url)
                .get('/users')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + readerToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(403);
                    done();
                });
        });
        it('should return an empty list if the page size and current requested items are out of bounds.', function(done) {
            request(url)
                .get('/users?limit=1&skip=100000')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + adminToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    res.body.should.have.property('total');
                    res.body.should.have.property('results');
                    done();
                });
        });
        it('should return a 401 because user is not authenticated', function(done) {
            request(url)
                .get('/users')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(401);
                    done();
                });
        });
        it('should return a subset of users based off of a query', function(done) {
            false.should.equal(true);
            done();
        });

    });

    describe("POST: " + url + '/users', function() {
        it('should create a user without an error using correct verb.', function(done){
            var newUser = {
                login: "newtestuser1",
                role: "reader",
                enabled: true,
                email: "newtestuser1@thinksolid.com",
                password: "TestPassword",
                name: "Test User"
            };
            request(url)
                .post('/users')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + adminToken)
                .send(newUser)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    res.body.should.have.property('_id');
                    res.body.should.not.have.property('password');
                    testCreatedUserId = res.body._id;

                    done();
                });
        });

        it('should create a user without an error using correct verb with additional custom params.', function(done){
            var newUser = {
                login: "newtestuser2",
                role: "reader",
                enabled: true,
                email: "newtestuser1@thinksolid.com",
                name: "Test User",
                password: "TestPassword",
                linkedid: "tjmchattie"
            };
            request(url)
                .post('/users')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + adminToken)
                .send(newUser)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    res.body.should.have.property('_id');
                    res.body.should.not.have.property('password');
                    testCreatedUserIdCustomVerb = res.body._id;
                    done();
                });
        });

        it('should return error if a user id is sent with the request (maybe verb error).', function(done){
            var newUser = {
                _id: "ISHOULDNOTBEHERE",
                login: "newtestuser1",
                role: "reader",
                enabled: true,
                email: "newtestuser2@thinksolid.com",
                name: "Test User",
                password: "TestPassword"
            };
            request(url)
                .post('/users')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + adminToken)
                .send(newUser)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(500);
                    res.body.should.have.property('message');
                    res.body.message.should.have.length.above(0);
                    done();
                });
        });

        it('should return error if a duplicate is created.', function(done){
            var newUser = {
                login: "newtestuser1",
                role: "reader",
                enabled: true,
                email: "newtestuser1@thinksolid.com",
                name: "Test User",
                password: "TestPassword"
            };
            request(url)
                .post('/users')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + adminToken)
                .send(newUser)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(500);
                    res.body.should.have.property('message');
                    res.body.message.should.have.length.above(0);
                    done();
                });
        });

        it('should validate and return error if a mandatory property is missing.',function(done){
            var newUser = {
                role: "reader",
                enabled: true,
                email: "newtestuser1@thinksolid.com",
                name: "Test User",
                password: "TestPassword"
            };
            request(url)
                .post('/users')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + adminToken)
                .send(newUser)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(500);
                    res.body.should.have.property('message');
                    res.body.message.should.have.length.above(0);
                    done();
                });
        });

        it('should return error if an empty login is provided.', function(done){
            var newUser = {
                login: "",
                role: "reader",
                enabled: true,
                email: "newtestuser1@thinksolid.com",
                name: "Test User",
                password: "TestPassword"
            };
            request(url)
                .post('/users')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + adminToken)
                .send(newUser)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(500);
                    res.body.should.have.property('message');
                    res.body.message.should.have.length.above(0);
                    done();
                });
        });

        it('should return error if an null login is provided.', function(done){
            var newUser = {
                login: null,
                role: "reader",
                enabled: true,
                email: "newtestuser1@thinksolid.com",
                name: "Test User",
                password: "TestPassword"
            };
            request(url)
                .post('/users')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + adminToken)
                .send(newUser)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(500);
                    res.body.should.have.property('message');
                    res.body.message.should.have.length.above(0);
                    done();
                });
        });

        it('should return error if a login is too short.', function(done){
            var newUser = {
                login: "sho",
                role: "reader",
                enabled: true,
                email: "newtestuser1@thinksolid.com",
                name: "Test User",
                password: "TestPassword"
            };
            request(url)
                .post('/users')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + adminToken)
                .send(newUser)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(500);
                    res.body.should.have.property('message');
                    res.body.message.should.have.length.above(0);
                    done();
                });
        });

        it('should return error if a password is null.', function(done){
            var newUser = {
                login: "newtestuserunique",
                role: "reader",
                enabled: true,
                email: "newtestuser1@thinksolid.com",
                name: "Test User",
                password: null
            };
            request(url)
                .post('/users')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + adminToken)
                .send(newUser)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(500);
                    res.body.should.have.property('message');
                    res.body.message.should.have.length.above(0);
                    done();
                });
        });

        it('should return error if a password is too short.', function(done){
            var newUser = {
                login: "newtestuserunique",
                role: "reader",
                enabled: true,
                email: "newtestuser1@thinksolid.com",
                name: "Test User",
                password: "sho"
            };
            request(url)
                .post('/users')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + adminToken)
                .send(newUser)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(500);
                    res.body.should.have.property('message');
                    res.body.message.should.have.length.above(0);
                    done();
                });
        });

        it('should return error if a user has a role that is not allowed.', function(done){
            var newUser = {
                login: "newtestuserunique",
                role: "fake role",
                enabled: true,
                email: "newtestuser1@thinksolid.com",
                name: "Test User",
                password: "TestPassword"
            };
            request(url)
                .post('/users')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + adminToken)
                .send(newUser)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(500);
                    res.body.should.have.property('message');
                    res.body.message.should.have.length.above(0);
                    done();
                });
        });
    });

    describe("PUT: " + url + '/users', function() {
        it('should return a 403 because user does not have permissions to access users', function(done) {
            var newUser = {
                _id: testCreatedUserId,
                login: "newtestuser1",
                role: "reader",
                enabled: true,
                email: "newtestuser1@thinksolid.com",
                name: "Test User",
                password: "TestPassword"
            };
            request(url)
                .put('/users')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + readerToken)
                .send(newUser)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(403);
                    done();
                });
        });
        it('should update a user using the correct verb', function(done) {
            var newUser = {
                _id: testCreatedUserId,
                login: "newtestuser1_updated",
                role: "reader",
                enabled: true,
                email: "newtestuser1@thinksolid.com",
                name: "Test User"
            };
            request(url)
                .put('/users')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + adminToken)
                .send(newUser)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    res.body.should.have.property('_id');
                    done();
                });
        });
        it('should update a user using the method override', function(done) {
            var newUser = {
                _id: testCreatedUserIdCustomVerb,
                login: "newtestuser2_updated",
                role: "reader",
                enabled: true,
                email: "newtestuser2@thinksolid.com",
                name: "Test User"
            };
            request(url)
                .post('/users')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + adminToken)
                .send(newUser)
                .set('X-HTTP-Method-Override', 'PUT')
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    res.body.should.have.property('_id');
                    done();
                });
        });
        it('should return error is user is updated without a set "ID"', function(done){
            var newUser = {
                login: "newtestuser1_updated",
                role: "reader",
                enabled: true,
                email: "newtestuser1@thinksolid.com",
                name: "Test User",
                password: "TestPassword"
            };
            request(url)
                .put('/users')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + adminToken)
                .send(newUser)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(500);
                    res.body.should.have.property('message');
                    done();
                });
        });
        it('should return error if login is too short.', function(done){
            var newUser = {
                _id: testCreatedUserId,
                login: "sho",
                role: "reader",
                enabled: true,
                email: "newtestuser1@thinksolid.com",
                name: "Test User",
                password: "TestPassword"
            };
            request(url)
                .post('/users')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + adminToken)
                .send(newUser)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(500);
                    res.body.should.have.property('message');
                    res.body.message.should.have.length.above(0);
                    done();
                });
        });
        it('should return error if user role is invalid.', function(done){
            var newUser = {
                _id: testCreatedUserId,
                login: "newtestuesr1",
                role: "reader_bad",
                enabled: true,
                email: "newtestuser1@thinksolid.com",
                name: "Test User",
                password: "TestPassword"
            };
            request(url)
                .post('/users')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + adminToken)
                .send(newUser)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(500);
                    res.body.should.have.property('message');
                    res.body.message.should.have.length.above(0);
                    done();
                });
        });
        it('should return error if user login is null.', function(done){
            var newUser = {
                _id: testCreatedUserId,
                login: null,
                role: "reader",
                enabled: true,
                email: "newtestuser1@thinksolid.com",
                name: "Test User",
                password: "TestPassword"
            };
            request(url)
                .post('/users')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + adminToken)
                .send(newUser)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(500);
                    res.body.should.have.property('message');
                    res.body.message.should.have.length.above(0);
                    done();
                });
        });
        it('should return error if user login is empty.', function(done){
            var newUser = {
                _id: testCreatedUserId,
                login: "",
                role: "reader",
                enabled: true,
                email: "newtestuser1@thinksolid.com",
                name: "Test User",
                password: "TestPassword"
            };
            request(url)
                .post('/users')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + adminToken)
                .send(newUser)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(500);
                    res.body.should.have.property('message');
                    res.body.message.should.have.length.above(0);
                    done();
                });
        });

        it('should return error if user has invalid permissions object sent to db.', function(done){
            var newUser = {
                _id: testCreatedUserId,
                login: "tmpupdateuser",
                role: "reader",
                enabled: true,
                email: "newtestuser1@thinksolid.com",
                name: "Test User",
                password: "TestPassword",
                permissions: "bad"
            };
            request(url)
                .post('/users')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + adminToken)
                .send(newUser)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(500);
                    res.body.should.have.property('message');
                    res.body.message.should.have.length.above(0);
                    done();
                });
        });
        it('should return error if the user login changed and is now a duplicate.', function(done){
            var newUser = {
                _id: testCreatedUserId,
                login: "apitestuserreader",
                role: "reader",
                enabled: true,
                email: "newtestuser1@thinksolid.com",
                name: "Test User",
                password: "TestPassword"
            };
            request(url)
                .post('/users')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + adminToken)
                .send(newUser)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(500);
                    res.body.should.have.property('message');
                    res.body.message.should.have.length.above(0);
                    res.body.message.should.equal("User with the same login already exists.");
                    done();
                });
        });
    });

    describe("DELETE: " + url + '/users', function() {
        it('should return a 403 because user does not have permissions to access users', function(done) {
            request(url)
                .del('/users/' + testCreatedUserId)
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + readerToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(403);
                    done();
                });
        });
        it('should delete a user using the correct verb', function(done) {
            request(url)
                .del('/users/' + testCreatedUserId)
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + adminToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    done();
                });
        });
        it('should delete a user using the method override', function(done) {
            request(url)
                .post('/users/' + testCreatedUserIdCustomVerb)
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('X-HTTP-Method-Override', 'DELETE')
                .set('authorization', 'Token ' + adminToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    done();
                });
        });

        it('should return 200 when we try to delete a user that doesn\'t exist', function(done) {
            request(url)
                .del('/users/IDONTEXIST')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + adminToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    done();
                });
        });
    });
});