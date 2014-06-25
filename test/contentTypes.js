'use strict';
var request = require('supertest');

require('chai').should();

describe('api.contentTypes', function(){
    var url = require('./config/test').url,
        testContentTypeId  = "524362aa56c02c0703000001",
        readerToken = "",
        adminToken  = "",
        testCreatedContentTypeId = "",
        testCreatedContentTypeCustomVerb = "";

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

    describe("GET: " + url + '/contentTypes/:id', function() {
        it('should return 401 because trying to access unauthenticated', function(done) {
            request(url)
                .get('/contentTypes/' + testContentTypeId)
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(401);
                    done();
                });
        });

        it('should return an existing content type', function(done) {
            request(url)
                .get('/contentTypes/' + testContentTypeId)
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + adminToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    res.body.label.should.equal("This is my test content type");
                    done();
                });
        });
        it('should return 404 because test user id does not exist', function(done) {
            request(url)
                .get('/contentTypes/52607c5f5b7500ea65000008')
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

    describe("GET: " + url + '/contentTypes', function() {
        it('should return a list of content types with the default page size', function(done) {
            request(url)
                .get('/contentTypes')
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
        it('should a list of content types with the specified page size', function(done) {
            request(url)
                .get('/contentTypes?limit=1&skip=0')
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

        it('should return an empty list if the page size and current requested items are out of bounds.', function(done) {
            request(url)
                .get('/contentTypes?limit=1&skip=100000')
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
                .get('/contentTypes')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(401);
                    done();
                });
        });
    });

    describe("POST: " + url + '/contentTypes', function() {
        it('should create a content type without an error using correct verb.', function(done){
            var newContentType = {
                label: "newtestsuitecontent",
                fields: {
                    testfield: {
                        required: true,
                        label: "Title",
                        instancing: 1,
                        type: "textbox"
                    }
                },
                helpText: "",
                meta: [],
                description: ""
            };
            request(url)
                .post('/contentTypes')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + adminToken)
                .send(newContentType)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    res.body.should.have.property('_id');
                    testCreatedContentTypeId = res.body._id;
                    done();
                });
        });

        it('should create a content type without an error using correct verb. supplying fields and meta info', function(done){
            var newContentType = {
                label: "newtestsuitecontent",
                fields: {
                    testfield: {
                        id: "testfield",
                        required: true,
                        label: "Title",
                        instancing: 1,
                        type: "textbox"
                    }
                },
                helpText: "",
                meta: [{
                    id: "testfield",
                    required: true,
                    label: "Title",
                    instancing: 1,
                    type: "textbox"
                }],
                description: ""
            };
            request(url)
                .post('/contentTypes')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + adminToken)
                .send(newContentType)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    res.body.should.have.property('_id');
                    testCreatedContentTypeCustomVerb = res.body._id;
                    done();
                });
        });


        it('should return an error because we are missing a "label" field.', function(done){
            var newContentType = {
                fields: {
                    testid: {
                        required: true,
                        label: "Title",
                        instancing: 1,
                        type: "textbox"
                    }
                },
                helpText: "",
                meta: [],
                description: ""
            };
            request(url)
                .post('/contentTypes')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + adminToken)
                .send(newContentType)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(400);
                    res.body.should.have.property('message');
                    res.body.message.should.have.length.above(0);
                    done();
                });
        });


        it('should return error if a content type id is sent with the request (maybe verb error).', function(done){
            var newContentType = {
                _id: "ISHOULDNOTBEHERE",
                label: "newtestsuitecontent",
                fields: {
                    testid: {
                        required: true,
                        label: "Title",
                        instancing: 1,
                        type: "textbox"
                    }
                },
                helpText: "",
                meta: [],
                description: ""
            };

            request(url)
                .post('/contentTypes')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + adminToken)
                .send(newContentType)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(500);
                    res.body.should.have.property('message');
                    res.body.message.should.have.length.above(0);
                    done();
                });
        });


        it('should return error when a malformed field id is passed in (id has a space).', function(done){
            var newContentType = {
                label: "newtestsuitecontent",
                fields: {
                    "test id" :{
                        label: "This is a test label",
                        required: true,
                        instancing: 1,
                        type: "textbox"
                    }
                },
                helpText: "",
                meta: [],
                description: ""
            };
            request(url)
                .post('/contentTypes')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + adminToken)
                .send(newContentType)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(400);
                    res.body.should.have.property('message');
                    res.body.message.should.have.length.above(0);
                    done();
                });
        });



        it('should return error when a malformed field is passed in (missing label).', function(done){
            var newContentType = {
                label: "newtestsuitecontent",
                fields: {
                    testid: {
                        required: true,
                        instancing: 1,
                        type: "textbox"
                    }
                },
                helpText: "",
                meta: [],
                description: ""
            };
            request(url)
                .post('/contentTypes')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + adminToken)
                .send(newContentType)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(400);
                    res.body.should.have.property('message');
                    res.body.message.should.have.length.above(0);
                    done();
                });
        });


        it('should return error when a malformed field is passed in (missing type).', function(done){
            var newContentType = {
                label: "newtestsuitecontent",
                fields: {
                    testid: {
                        label: "Test Field Label",
                        required: true,
                        instancing: 1
                    }
                },
                helpText: "",
                meta: [],
                description: ""
            };
            request(url)
                .post('/contentTypes')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + adminToken)
                .send(newContentType)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(400);
                    res.body.should.have.property('message');
                    res.body.message.should.have.length.above(0);
                    done();
                });
        });



    });

    describe("PUT: " + url + '/contentTypes', function() {
        it('should return a 403 because user does not have permissions to access users', function(done) {
            var newContentType = {
                _id: testCreatedContentTypeId,
                label: 'updatedlabel',
                fields: [{
                    _id: 'testfield',
                    label: 'Test Field Label',
                    type: 'textbox'
                }],
                helpText: '',
                description: ''
            };

            request(url)
                .put('/contentTypes')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + readerToken)
                .send(newContentType)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(403);
                    done();
                });
        });
        it('should update a content type using the correct verb', function(done) {
            var newContentType = {
                _id: testCreatedContentTypeId,
                label: 'updatedlabel',
                fields: [{
                    _id: 'testfield',
                    label: 'Test Field Label',
                    type: 'textbox'
                }],
                helpText: '',
                description: ''
            };

            request(url)
                .put('/contentTypes')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + adminToken)
                .send(newContentType)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    done();
                });
        });

        it('should update a content type when the ID is in the route', function(done) {
            var newContentType = {
                _id: testCreatedContentTypeId,
                label: 'updatedlabel',
                fields: [{
                    _id: 'testfield',
                    label: 'Test Field Label',
                    type: 'textbox'
                }],
                helpText: '',
                description: ''
            };

            request(url)
                .put('/contentTypes/' + testCreatedContentTypeId)
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + adminToken)
                .send(newContentType)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    done();
                });
        });


        it('should update a content type using the method override', function(done) {
            var newContentType = {
                _id: testCreatedContentTypeId,
                label: 'updatedlabel',
                fields: [{
                    _id: 'testfield',
                    label: 'Test Field Label',
                    type: 'textbox'
                }],
                helpText: '',
                description: ''
            };

            request(url)
                .post('/contentTypes')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + adminToken)
                .set('X-HTTP-Method-Override', 'PUT')
                .send(newContentType)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    done();
                });
        });

        it('should return error if content type is updated without a set "ID"', function(done){
            var newContentType = {
                label: "updatedlabel",
                fields: {
                    testid : {
                        id: "testid",
                        label: "Test Field Label",
                        type: "textbox",
                        required: true,
                        instancing: 1
                    }
                },
                helpText: "",
                meta: {testmetaid:{
                    label: "Test Field Label",
                    type: "textbox",
                    required: true,
                    instancing: 1
                }},
                description: ""
            };

            request(url)
                .put('/contentTypes')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + adminToken)
                .send(newContentType)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(404);
                    res.body.should.have.property('message');
                    res.body.message.should.have.length.above(0);
                    done();
                });
        });

    });

    describe("DELETE: " + url + '/contentTypes', function() {
        it('should return a 403 because user does not have permissions to access content types', function(done) {
            request(url)
                .del('/contentTypes/' + testCreatedContentTypeId)
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + readerToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(403);
                    done();
                });
        });
        it('should delete a content type using the correct verb', function(done) {
            request(url)
                .del('/contentTypes/' + testCreatedContentTypeId)
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + adminToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    done();
                });
        });
        it('should delete a content type using the method override', function(done) {
            request(url)
                .post('/contentTypes/' + testCreatedContentTypeCustomVerb)
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

        it('should return 200 when we try to delete a content type that doesn\'t exist', function(done) {
            request(url)
                .del('/contentTypes/52607c5f5b7500ea65000008')
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