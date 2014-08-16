'use strict';
var request = require('supertest');
require('chai').should();

describe('api.users', function(){
    var url = require('./config/test').url,
        testUserId  = '5245ce1d56c02c066b000001',
        testReaderUserId = '5246e80c56c02c0744000002',
        admin2UserId = '5246e73d56c02c0744000004',
        readerToken = '',
        adminToken  = '',
        adminToken2 = '',
        testCreatedUserId = '',
        testCreatedUserIdCustomVerb = '',
        testNodeForPermissions = '5261781556c02c072a000007',
        testSubNodeForPermissions = '526417710658fc1f0a00000b';


    before(function(done){
        request(url)
            .get('/token')
            .set('Accept', 'application/json')
            .set('Accept-Language', 'en_US')
            .set('authorization', 'Basic '+ new Buffer('apitestuseradmin:TestPassword').toString('base64'))
            .end(function(err, res) {
                if (err) { throw err; }
                adminToken = res.body.access_token;

                request(url)
                    .get('/token')
                    .set('Accept', 'application/json')
                    .set('Accept-Language', 'en_US')
                    .set('authorization', 'Basic '+ new Buffer('apitestuserreader:TestPassword').toString('base64'))
                    .end(function(err, res) {
                        if (err) { throw err; }
                        readerToken = res.body.access_token;

                        request(url)
                            .get('/token')
                            .set('Accept', 'application/json')
                            .set('Accept-Language', 'en_US')
                            .set('authorization', 'Basic '+ new Buffer('admin:TestPassword').toString('base64'))
                            .end(function(err, res) {
                                if (err) { throw err; }
                                adminToken2 = res.body.access_token;
                                done();
                            });
                    });
            });
    });

    describe('GET: ' + url + '/users/:id', function() {
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
                .set('authorization', 'Basic ' + readerToken)
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
                .set('authorization', 'Basic ' + adminToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    res.body.should.not.have.property('identities');
                    res.body.displayname.should.equal('apitestuser');
                    done();
                });
        });

        it('should return 404 because test user id does not exist', function(done) {
            request(url)
                .get('/users/52314ae429ae439a6e49695d')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Basic ' + adminToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(404);
                    done();
                });
        });
    });

    describe('GET: ' + url + '/user', function() {
        it('should return the current logged in user', function(done) {
            request(url)
                .get('/user')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Basic ' + readerToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    res.body.should.not.have.property('identities');
                    res.body.displayname.should.equal('apitestuserreader');
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

    describe('GET: ' + url + '/users', function() {
        it('should return a list of users with the default page size', function(done) {
            request(url)
                .get('/users')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Basic ' + adminToken)
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
                .set('authorization', 'Basic ' + adminToken)
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
                .set('authorization', 'Basic ' + readerToken)
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
                .set('authorization', 'Basic ' + adminToken)
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
    });

    describe('POST: ' + url + '/users', function() {
        it('should create a user without an error using correct verb.', function(done){
            var newUser = {
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                identities : {
                    basic : {
                        username: 'newtestuser1',
                        password: 'TestPassword'
                    }
                },
                firstname: 'Test',
                lastname: 'User'
            };
            request(url)
                .post('/users')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Basic ' + adminToken)
                .send(newUser)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    res.body.should.have.property('_id');
                    res.body.displayname.should.equal('newtestuser1');
                    res.body.should.not.have.property('password');
                    res.body.should.not.have.property('identities');
                    testCreatedUserId = res.body._id;
                    done();
                });
        });

        it('should create a user without an error using correct verb with additional custom params.', function(done){
            var newUser = {
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User',
                profile: {
                    linkedid : 'tjmchattie'
                },
                identities : {
                    basic : {
                        username : 'newtestuser2',
                        password : 'TestPassword'
                    }
                }
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
                    res.body.should.not.have.property('identities');
                    res.body.displayname.should.equal('newtestuser2');
                    res.body.should.have.property('_id');
                    res.body.should.not.have.property('password');
                    testCreatedUserIdCustomVerb = res.body._id;
                    done();
                });
        });

        it('should return error if a user id is sent with the request (maybe verb error).', function(done){
            var newUser = {
                _id: 'ISHOULDNOTBEHERE',
                role: 'reader',
                enabled: true,
                email: 'newtestuser2@thinksolid.com',
                firstname: 'Test',
                lastname: 'User',
                identities : {
                    basic : {
                        username : 'newtestuseronehundred',
                        password : 'TestPassword'
                    }
                }
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
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User',
                identities : {
                    basic : {
                        username : 'newtestuser1',
                        password : 'TestPassword'
                    }
                }
            };
            request(url)
                .post('/users')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + adminToken)
                .send(newUser)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(400);
                    res.body.should.have.property('message');
                    res.body.message.should.equal('This username is already in use.');
                    res.body.message.should.have.length.above(0);
                    done();
                });
        });

        it('should validate and return error if a mandatory property is missing.',function(done){
            var newUser = {
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User',
                identities : {
                    basic : {
                        password : 'TestPassword'
                    }
                }
            };
            request(url)
                .post('/users')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + adminToken)
                .send(newUser)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(400);
                    res.body.should.have.property('message');
                    res.body.message.should.equal('username is required.');
                    res.body.message.should.have.length.above(0);
                    done();
                });
        });

        it('should return error if an empty login is provided.', function(done){
            var newUser = {
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User',
                identities : {
                    basic : {
                        username : '',
                        password : 'TestPassword'
                    }
                }
            };
            request(url)
                .post('/users')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + adminToken)
                .send(newUser)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(400);
                    res.body.should.have.property('message');
                    res.body.message.should.equal('username is required.');
                    res.body.message.should.have.length.above(0);
                    done();
                });
        });

        it('should return error if an null login is provided.', function(done){
            var newUser = {
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User',
                identities : {
                    basic : {
                        username : null,
                        password : 'TestPassword'
                    }
                }
            };
            request(url)
                .post('/users')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + adminToken)
                .send(newUser)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(400);
                    res.body.should.have.property('message');
                    res.body.message.should.equal('username is required.');
                    res.body.message.should.have.length.above(0);
                    done();
                });
        });

        it('should return error if a login is too short.', function(done){
            var newUser = {
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User',
                identities : {
                    basic : {
                        username : 'sho',
                        password : 'TestPassword'
                    }
                }
            };
            request(url)
                .post('/users')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + adminToken)
                .send(newUser)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(400);
                    res.body.should.have.property('message');
                    res.body.message.should.equal('Your username is too short.');
                    res.body.message.should.have.length.above(0);
                    done();
                });
        });

        it('should return error if a password is null.', function(done){
            var newUser = {
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User',
                identities : {
                    basic : {
                        username : 'newtestuserunique',
                        password : null
                    }
                }
            };
            request(url)
                .post('/users')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + adminToken)
                .send(newUser)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(400);
                    res.body.should.have.property('message');
                    res.body.message.should.equal('Password must be at least 6 characters.');
                    res.body.message.should.have.length.above(0);
                    done();
                });
        });

        it('should return error if a password is too short.', function(done){
            var newUser = {
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User',
                identities : {
                    basic : {
                        username : 'newtestuserunique',
                        password : 'sho'
                    }
                }
            };
            request(url)
                .post('/users')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + adminToken)
                .send(newUser)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(400);
                    res.body.should.have.property('message');
                    res.body.message.should.equal('Password must be at least 6 characters.');
                    res.body.message.should.have.length.above(0);
                    done();
                });
        });

        it('should return error if a user has a role that is not allowed.', function(done){
            var newUser = {
                role: 'fake role',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User',
                identities : {
                    basic : {
                        username : 'newtestuserunique',
                        password : 'TestPassword'
                    }
                }
            };
            request(url)
                .post('/users')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + adminToken)
                .send(newUser)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(400);
                    res.body.should.have.property('message');
                    res.body.message.should.equal('User\'s role is invalid.');
                    res.body.message.should.have.length.above(0);
                    done();
                });
        });
    });

    describe('PUT: ' + url + '/users', function() {
        it('should return a 403 because user does not have permissions to access users', function(done) {
            var newUser = {
                _id: testCreatedUserId,
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User',
                identities : {
                    basic : {
                        username : 'newtestuser1',
                        password : 'TestPassword'
                    }
                }
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
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User',
                identities : {
                    basic : {
                        username : 'newtestuser1_updated'
                    }
                }
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

        it('one admin should be able to change the role of another admin.', function(done) {
            request(url)
                .get('/users/' + admin2UserId)
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + adminToken)
                .end(function(err, res) {
                    var u = res.body;
                    u.role = 'reader';

                    request(url)
                        .put('/users')
                        .set('Accept', 'application/json')
                        .set('Accept-Language', 'en_US')
                        .set('authorization', 'Token ' + adminToken)
                        .send(u)
                        .end(function(err, res) {
                            if (err) { throw err; }

                            res.status.should.equal(200);
                            res.body.should.have.property('_id');
                            done();
                        });
                });

        });

        it('should update a user using the method override', function(done) {
            var newUser = {
                _id: testCreatedUserIdCustomVerb,
                role: 'reader',
                enabled: true,
                email: 'newtestuser2@thinksolid.com',
                firstname: 'Test',
                lastname: 'User',
                identities : {
                    basic : {
                        username : 'newtestuser2_updated'
                    }
                }
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

        it('should return error is user is updated without a set ID', function(done){
            var newUser = {
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User',
                password: 'TestPassword',
                identities : {
                    basic : {
                        username : 'newtestuser2_updated'
                    }
                }
            };
            request(url)
                .put('/users')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + adminToken)
                .send(newUser)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(404);
                    res.body.should.have.property('message');
                    done();
                });
        });

        it('should return error if login is too short.', function(done){
            var newUser = {
                _id: testCreatedUserId,
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User',
                identities : {
                    basic : {
                        username : 'sho',
                        password : 'TestPassword'
                    }
                }
            };
            request(url)
                .put('/users')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + adminToken)
                .send(newUser)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(400);
                    res.body.should.have.property('message');
                    res.body.message.should.have.length.above(0);
                    done();
                });
        });

        it('should return error if user role is invalid.', function(done){
            var newUser = {
                _id: testCreatedUserId,
                role: 'reader_bad',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User',
                identities : {
                    basic : {
                        username : 'newtestuesr1',
                        password : 'TestPassword'
                    }
                }
            };
            request(url)
                .put('/users')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + adminToken)
                .send(newUser)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(400);
                    res.body.should.have.property('message');
                    res.body.message.should.have.length.above(0);
                    done();
                });
        });

        it('should return error if user login is null.', function(done){
            var newUser = {
                _id: testCreatedUserId,
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User',
                identities : {
                    basic : {
                        username : null,
                        password : 'TestPassword'
                    }
                }
            };
            request(url)
                .put('/users')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + adminToken)
                .send(newUser)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(400);
                    res.body.should.have.property('message');
                    res.body.message.should.have.length.above(0);
                    done();
                });
        });

        it('should return error if user login is empty.', function(done){
            var newUser = {
                _id: testCreatedUserId,
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User',
                identities : {
                    basic : {
                        username : '',
                        password : 'TestPassword'
                    }
                }
            };
            request(url)
                .put('/users')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + adminToken)
                .send(newUser)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(400);
                    res.body.should.have.property('message');
                    res.body.message.should.have.length.above(0);
                    done();
                });
        });

        it('should return error if the user login changed and is now a duplicate.', function(done){
            var newUser = {
                _id: testCreatedUserId,
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Test',
                lastname: 'User',
                identities : {
                    basic : {
                        username : 'apitestuserreader',
                        password : 'TestPassword'
                    }
                }
            };
            request(url)
                .put('/users')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + adminToken)
                .send(newUser)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(400);
                    res.body.should.have.property('message');
                    res.body.message.should.have.length.above(0);
                    done();
                });
        });

        it('should a user to update themselves even if they do not have permission. at /user', function(done){
            var newUser = {
                _id: testReaderUserId,
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                name: 'Updated test reader name with :id',
                identities : {
                    basic : {
                        username : 'apitestuserreader',
                        password : 'TestPassword'
                    }
                }
            };
            request(url)
                .put('/user')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + readerToken)
                .send(newUser)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    done();
                });
        });

        it('should error if putting to /user with an different ID than your own.', function(done){
            var newUser = {
                _id: testUserId,
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Updated test reader name with :id',
                lastname: 'Last',
                identities : {
                    basic : {
                        username : 'apitestuserreader',
                        password : 'TestPassword'
                    }
                }
            };
            request(url)
                .put('/user')
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

        it('should a user to update themselves even if they do not have permission. at /user/:id', function(done){
            var newUser = {
                _id: testReaderUserId,
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                name: 'Updated test reader name with :id',
                identities : {
                    basic : {
                        username : 'apitestuserreader',
                        password : 'TestPassword'
                    }
                }
            };
            request(url)
                .put('/users/' + testReaderUserId)
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + readerToken)
                .send(newUser)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    done();
                });
        });

        it('should error if putting to /users/:id with an different ID than your own.', function(done){
            var newUser = {
                _id: testUserId,
                role: 'reader',
                enabled: true,
                email: 'newtestuser1@thinksolid.com',
                firstname: 'Updated test reader name with :id',
                lastname: 'something',
                identities : {
                    basic : {
                        username : 'apitestuserreader',
                        password : 'TestPassword'
                    }
                }
            };
            request(url)
                .put('/users/' + testReaderUserId)
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
    });

    describe('POST: ' + url + '/users/query', function() {
        var query = {
                filters: [{key: 'role', cmp: '=', value: 'editor'}],
                options: {
                    //include: ['node','fields.testfield']
                }
            },
            query2 = {
                filters: [{key: 'role', cmp: '=', value: 'thisisnotarealrole'}],
                options: {
                    //include: ['node','fields.testfield']
            }
        };

        it('should return 401 because trying to access unauthenticated', function(done) {
            request(url)
                .post('/users/query')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .send(query)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(401);
                    done();
                });
        });

        it('should return user search results', function(done) {
            request(url)
                .post('/users/query')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + adminToken)
                .send(query)
                .end(function(err, res) {
                    if (err) { console.log(err);throw err; }
                    res.status.should.equal(200);
                    done();
                });
        });

        it('should not return user search results', function(done) {
            request(url)
                .post('/users/query')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + adminToken)
                .send(query2)
                .end(function(err, res) {
                    if (err) { console.log(err);throw err; }
                    res.status.should.equal(200);
                    res.body.total.should.equal(0);
                    done();
                });
        });

    });

    describe('DELETE: ' + url + '/users', function() {
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
                .del('/users/' + testCreatedUserIdCustomVerb)
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

    describe('Test creating a user, logging in with the new user then revoking the token and confirming that they are locked out', function() {
        it('auth token of user should be revoked if user is disabled.', function(done) {
            var newUser = {
                    role: 'admin',
                    enabled: true,
                    email: 'newtestuser1@thinksolid.com',
                    password: 'TestPassword',
                    firstname: 'Test',
                    lastname: 'User',
                    identities : {
                        basic : {
                            username : 'futurerevokee',
                            password : 'TestPassword'
                        }
                    }
                },
                mytoken = '';

            //Create User
            request(url)
                .post('/users')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Basic ' + adminToken)
                .send(newUser)
                .end(function(err, res) {
                    if (err) { throw err; }

                    res.status.should.equal(200);
                    res.body.should.have.property('_id');
                    res.body.should.not.have.property('password');
                    newUser._id = res.body._id;

                    //Get token for user
                    request(url)
                        .get('/token')
                        .set('Accept', 'application/json')
                        .set('Accept-Language', 'en_US')
                        .set('authorization', 'Basic '+ new Buffer('futurerevokee:TestPassword').toString('base64'))
                        .end(function(err, res) {
                            if (err) { throw err; }
                            mytoken = res.body.access_token;

                            //Query service with user
                            request(url)
                                .get('/user')
                                .set('Accept', 'application/json')
                                .set('Accept-Language', 'en_US')
                                .set('authorization', 'Basic ' + mytoken)
                                .end(function(err, res) {
                                    if (err) { throw err; }
                                    res.status.should.equal(200);
                                    //Deactivate user
                                    newUser.enabled = false;

                                    request(url)
                                        .put('/users')
                                        .set('Accept', 'application/json')
                                        .set('Accept-Language', 'en_US')
                                        .set('authorization', 'Basic ' + adminToken)
                                        .send(newUser)
                                        .end(function(err, res) {

                                            if(err){
                                                console.log(err);
                                            }


                                            if (err) { throw err; }
                                            res.status.should.equal(200);

                                            //Retry to access API
                                            request(url)
                                                .get('/user')
                                                .set('Accept', 'application/json')
                                                .set('Accept-Language', 'en_US')
                                                .set('authorization', 'Basic ' + mytoken)
                                                .end(function(err, res) {
                                                    if (err) { throw err; }
                                                    res.status.should.equal(401);
                                                    done();
                                                });
                                        });
                                });
                        });
                });
        });
    });

    describe('POST: ' + url + '/users/:id/permissions', function() {
        it('add permission to edit a node with an empty permissions collection.', function(done) {
            request(url)
                .post('/users/' + testReaderUserId + '/permissions')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Basic ' + adminToken)
                .send({
                    nodeid: testNodeForPermissions,
                    role: 'editor'
                })
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    done();
                });
        });

        it('update a permission that a user already has set to another value.', function(done) {
            request(url)
                .post('/users/' + testReaderUserId + '/permissions')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Basic ' + adminToken)
                .send({
                    nodeid: testNodeForPermissions,
                    role: 'none'
                })
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    done();
                });
        });

        it('add a permission that already has a permissions collection.', function(done) {
            request(url)
                .post('/users/' + testReaderUserId + '/permissions')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Basic ' + adminToken)
                .send({
                    nodeid: testSubNodeForPermissions,
                    role: 'editor'
                })
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    done();
                });
        });

        it('try to add permissions unathenticated should result in a 401.', function(done) {
            request(url)
                .post('/users/' + testReaderUserId + '/permissions')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .send({
                    nodeid: testSubNodeForPermissions,
                    role: 'editor'
                })
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(401);
                    done();
                });
        });

        it('try to add permissions without the correct permissions. Should result in a 403.', function(done) {
            request(url)
                .post('/users/' + testReaderUserId + '/permissions')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Basic ' + readerToken)
                .send({
                    nodeid: testSubNodeForPermissions,
                    role: 'editor'
                })
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(403);
                    done();
                });
        });
    });

    describe('POST: ' + url + '/users/:id/link', function() {
        it('should link a user with the passed in identity', function(done) {
            request(url)
                .post('/users/' + admin2UserId + '/link')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Basic ' + adminToken)
                .send({
                    key : 'google',
                    options : {
                        name : 'Diego Montoya',
                        message : 'Prepare to die.'
                    }
                })
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    done();
                });
        });

    });

    describe('POST: ' + url + '/users/:id/unlink', function() {
        it('should unlink a user with the passed in identity', function(done) {
            request(url)
                .post('/users/' + admin2UserId + '/unlink')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Basic ' + adminToken)
                .send({
                    key : 'google'
                })
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    done();
                });
        });
    });
});