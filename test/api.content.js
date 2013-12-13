var should = require('chai').should();
var request = require('supertest');

describe('api.content', function(){
    var url = require('./config/test').url,
        async = require('async'),
        _ = require('underscore'),
        testContentId  = "5261781556c02c072a000007",
        restrictedContentId = "5254908d56c02c076e000001",
        sampleContentObject = null,
        tokens = {},
        tokenRequests = [
            ['apitestuseradmin:TestPassword', 'globalAdminToken'],
            ['apitestuserreader:TestPassword', 'globalReaderToken'],
            ['apitestusereditor_restricted:TestPassword', 'restrictedEditorToken'],

            // There are no tests for the following:
            ['apitestusereditor:TestPassword', 'globalEditorToken'],
            ['apitestuserreader_1:TestPassword', 'nodeEditorToken']
        ],
        parallelTokenRequests = [];

    before(function(done){
        _.each(tokenRequests, function(theRequest) {
            parallelTokenRequests.push(createGetToken(theRequest[0], theRequest[1]).closure);
        });
        async.parallel(parallelTokenRequests, done);
    });

    describe("GET: " + url + '/content/:id', function() {
        it('should return 401 because trying to access unauthenticated', function(done) {
            request(url)
                .get('/content/' + testContentId)
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(401);
                    done();
                });
        });

        it('should return 200 because getting content that exists with correct permissions.', function(done) {
            request(url)
                .get('/content/' + testContentId)
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + tokens.globalAdminToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    sampleContentObject = res.body;
                    done();
                });
        });


        it('should return 403 because getting content from a node that is restricted to me.', function(done) {
            request(url)
                .get('/content/' + restrictedContentId)
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + tokens.restrictedEditorToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(403);
                    done();
                });
        });
    });

    describe("POST: " + url + '/content', function() {
        it('should return 401 because trying to access unauthenticated', function(done) {
            var obj = {
                label:"Generated title", slug: 'generated_title', type: "524362aa56c02c0703000001", nonce:"1234fdsdfsa565", status: "Live", node : {_id: "526d5179966a883540000006", displayOrder: 1}, fields: {testfield: "test value"}, author: {_id: "5246e73d56c02c0744000001", name: "Test User"}
            };

            request(url)
                .post('/content')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .send(obj)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(401);
                    done();
                });
        });

        it('should return 403 because I am am only a reader of content.', function(done) {
            var obj = {
                label:"Generated title", slug: 'generated_title', type: "524362aa56c02c0703000001", nonce:"1234fdsdfsa565", status: "Live", node : {_id: "526d5179966a883540000006", displayOrder: 1}, fields: {testfield: "test value"}, author: {_id: "5246e73d56c02c0744000001", name: "Test User"}
            };

            request(url)
                .post('/content')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + tokens.globalReaderToken)
                .send(obj)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(403);
                    done();
                });
        });

        it('should return 200 because I have the correct permissions.', function(done) {
            var obj = {
                label:"Generated title", slug: 'generated_title', type: "524362aa56c02c0703000001", nonce:"1234fdsdfsa565", status: "Live", node : {_id: "526d5179966a883540000006", displayOrder: 1}, fields: {testfield: "test value"}, author: {_id: "5246e73d56c02c0744000001", name: "Test User"}
            };


            request(url)
                .post('/content')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + tokens.globalAdminToken)
                .send(obj)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    done();
                });
        });


        it('should return 403 because I am trying to delete content from a node that is restricted to me.', function(done) {
            var obj = {
                label:"Generated title", slug: 'generated_title', type: "524362aa56c02c0703000001", nonce:"1234fdsdfsa565", status: "Live", node : {_id: "526d5179966a883540000006", displayOrder: 1}, fields: {testfield: "test value"}, author: {_id: "5246e73d56c02c0744000001", name: "Test User"}
            };

            request(url)
                .post('/content')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + tokens.restrictedEditorToken)
                .send(obj)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(403);
                    done();
                });
        });
    });

    describe("PUT: " + url + '/content/:id', function() {
        it('should return 401 because trying to access unauthenticated', function(done) {
            var obj = {};
            _.extend(obj, sampleContentObject);

            obj.fields.newColumn = "newValue";

            request(url)
                .put('/content/' + testContentId)
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .send(obj)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(401);
                    done();
                });
        });

        it('should return 403 because I am am only a reader of content.', function(done) {

            var obj = {};
            _.extend(obj, sampleContentObject);

            obj.fields.newColumn = "newValue";
            request(url)
                .put('/content/' + testContentId)
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + tokens.globalReaderToken)
                .send(obj)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(403);
                    done();
                });
        });

        it('should return 200 because I have the correct permissions.', function(done) {
            var obj = {};
            _.extend(obj, sampleContentObject);

            obj.fields.newColumn = "newValue";

            request(url)
                .put('/content/' + testContentId)
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + tokens.globalAdminToken)
                .send(obj)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    done();
                });
        });


        it('should return 403 because I am trying to delete content from a node that is restricted to me.', function(done) {
            var obj = {};
            _.extend(obj, sampleContentObject);

            obj.fields.newColumn = "newValue";

            request(url)
                .put('/content/' + restrictedContentId)
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + tokens.restrictedEditorToken)
                .send(obj)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(403);
                    done();
                });
        });
    });

    describe("DELETE: " + url + '/content/:id', function() {
        it('should return 401 because trying to access unauthenticated', function(done) {
            request(url)
                .del('/content/' + testContentId)
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(401);
                    done();
                });
        });

        it('should return 403 because I am am only a reader of content.', function(done) {
            request(url)
                .del('/content/' + testContentId)
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + tokens.globalReaderToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(403);
                    done();
                });
        });

        it('should return 403 because I am trying to delete content from a node that is restricted to me.', function(done) {
            request(url)
                .del('/content/' + restrictedContentId)
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + tokens.restrictedEditorToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(403);
                    done();
                });
        });

        it('should return 200 because I have the correct permissions.', function(done) {
            request(url)
                .del('/content/' + restrictedContentId)
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + tokens.globalAdminToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    done();
                });
        });
    });

    function createGetToken(creds, storage) {
        return {
            closure : function getToken(cb){
                request(url)
                    .get('/token')
                    .set('Accept', 'application/json')
                    .set('Accept-Language', 'en_US')
                    .set('authorization', new Buffer(creds).toString('base64'))
                    .end(function(err, res) {
                        if (err) { throw err; }
                        tokens[storage] = res.body.access_token;
                        cb();
                    });
            }
        }
    }
});
