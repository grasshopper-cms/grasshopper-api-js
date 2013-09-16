var should = require('chai').should();
var request = require('supertest');

describe('api.users', function(){
    var url = 'http://localhost:8080',
        testUserId  = "523213da56c02c0674000001",
        readerToken = "",
        adminToken  = "";

    beforeEach(function(done){
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
                    console.log(res.body);
                    res.status.should.equal(200);


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
                    console.log(res.body);
                    res.status.should.equal(200);

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
    });

    describe("POST: " + url + '/users', function() {
        it('should create a user without an error using correct verb.', function(done){

        });

        it('should create a user using the method override', function(done) {

        });

        it('should return error if a user id is sent with the request (maybe verb error).', function(done){

        });

        it('should return error if a duplicate is created.', function(done){

        });

        it('should validate and return error if a mandatory property is missing.',function(done){

        });

        it('should return error if an empty login is provided.', function(done){

        });

        it('should return error if an null login is provided.', function(done){

        });

        it('should return error if a login is too short.', function(done){

        });

        it('should return error if a password is null.', function(done){

        });

        it('should return error if a password is too short.', function(done){

        });

        it('should return error if a user has a role that is not allowed.', function(done){

        });
    });

    describe("PUT: " + url + '/users', function() {
        it('should return a 403 because user does not have permissions to access users', function(done) {

        });
        it('should update a user using the correct verb', function(done) {

        });
        it('should update a user using the method override', function(done) {

        });
        it('should return error is user is updated without a set "ID"', function(done){

        });
        it('should return error if login is too short.', function(done){});
        it('should return error if user role is invalid.', function(done){});
        it('should return error if user login is null.', function(done){});
        it('should return error if user login is empty.', function(done){});
        it('should return error if user password is empty string.', function(done){});
        it('should return error if user password is null.', function(done){});
        it('should return error if user has invalid permissions object sent to db.', function(done){});

    });

    describe("DELETE: " + url + '/users', function() {
        it('should return a 403 because user does not have permissions to access users', function(done) {

        });
        it('should delete a user using the correct verb', function(done) {

        });
        it('should delete a user using the method override', function(done) {

        });

        it('should return 200 when we try to delete a user that doesn\'t exist', function(done) {

        });
    });
});