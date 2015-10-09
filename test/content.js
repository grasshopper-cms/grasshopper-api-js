'use strict';

var request = require('supertest'),
    env = require('./config/environment')(),
    BB = require('bluebird');
require('chai').should();

describe('api.content', function(){

    var url = require('./config/test').url,
        // async = require('async'),
        _ = require('lodash'),
        testContentId  = '5261781556c02c072a000007',
        restrictedContentId = '5254908d56c02c076e000001',
        sampleContentObject = null,
        tokens = {
            globalAdminToken : 'apitestuseradmin:TestPassword',
            globalReaderToken : 'apitestuserreader:TestPassword',
            restrictedEditorToken : 'apitestusereditor_restricted:TestPassword'
        };

    before(function(done){

        //run shell command to setup the db
        var exec = require('child_process').execSync;
        exec('./tasks/importdb.sh');

        var grasshopper = require('../lib/grasshopper-api')(env);

        grasshopper.core.event.channel('/system/db').on('start', function() {
            //next();

            getAllAccessTokens()
                .then(function() { done(); });
        });
    });

    describe('GET: ' + url + '/content/:id', function() {
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
                .set('authorization', 'Basic ' + tokens.globalAdminToken)
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
                .set('authorization', 'Basic ' + tokens.restrictedEditorToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    console.log(res);
                    res.status.should.equal(403);
                    done();
                });
        });
    });

    describe('GET: ' + url + '/content/:id/full', function() {
        it('should return 200 because getting content that exists with correct permissions.', function(done) {
            request(url)
                .get('/content/' + testContentId + '/full')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Basic ' + tokens.globalAdminToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    sampleContentObject = res.body;
                    done();
                });
        });
    });

    describe('POST: ' + url + '/content', function() {
        it('should return 401 because trying to access unauthenticated', function(done) {
            var obj = {
                label:'Generated title', slug: 'generated_title', type: '524362aa56c02c0703000001', nonce:'1234fdsdfsa565', status: 'Live',
                node : {_id: '526d5179966a883540000006', displayOrder: 1}, fields: {testfield: 'test value'}, author: {_id: '5246e73d56c02c0744000001', name: 'Test User'}
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

        xit('should return 403 because I am am only a reader of content.', function(done) { //Skipped because permissions are not implemented.
            var obj = {
                label:'Generated title', slug: 'generated_title', type: '524362aa56c02c0703000001', nonce:'1234fdsdfsa565', status: 'Live',
                node : {_id: '526d5179966a883540000006', displayOrder: 1}, fields: {testfield: 'test value'}, author: {_id: '5246e73d56c02c0744000001', name: 'Test User'}
            };

            request(url)
                .post('/content')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Basic ' + tokens.globalReaderToken)
                .send(obj)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(403);
                    done();
                });
        });

        it('should return 200 because I have the correct permissions.', function(done) {
            var obj = {
                meta: {
                    type: '524362aa56c02c0703000001',
                    node : '526d5179966a883540000006'
                },
                fields: {
                    testfield: 'testvalue'
                }
            };


            request(url)
                .post('/content')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Basic ' + tokens.globalAdminToken)
                .send(obj)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    done();
                });
        });

        it('should return 403 because I am trying to delete content from a node that is restricted to me.', function(done) {
            var obj = {
                meta:{
                    type: '524362aa56c02c0703000001',
                    node :'526d5179966a883540000006'
                },
                fields: {testfield: 'testvalue'}
            };

            request(url)
                .post('/content')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Basic ' + tokens.restrictedEditorToken)
                .send(obj)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(403);
                    done();
                });
        });
    });

    describe('PUT: ' + url + '/content/:id', function() {
        it('should return 401 because trying to access unauthenticated', function(done) {
            var obj = {};
            _.extend(obj, sampleContentObject);

            obj.fields.newColumn = 'newValue';

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

            obj.fields.newColumn = 'newValue';
            request(url)
                .put('/content/' + testContentId)
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Basic ' + tokens.globalReaderToken)
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

            obj.fields.newColumn = 'newValue';

            request(url)
                .put('/content/' + testContentId)
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Basic ' + tokens.globalAdminToken)
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

            obj.fields.newColumn = 'newValue';

            request(url)
                .put('/content/' + restrictedContentId)
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Basic ' + tokens.restrictedEditorToken)
                .send(obj)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(403);
                    done();
                });
        });
    });

    describe('POST: ' + url + '/content/query', function() {
        var query = {
            filters: [{key: 'slug', cmp: '=', value: 'sample_content_title'}],
            options: {
                //include: ['node','fields.testfield']
            }
        }, query2 = {
            filters: [{key: 'nonsense', cmp: '=', value: 'XXXNEVERSHOULDMATCHANTYHINGXXX'}],
            options: {
                //include: ['node','fields.testfield']
            }
        };

        it('should return a 401 because trying to access unauthenticated', function(done) {
            request(url)
                .post('/content/query')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .send(query)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(401);
                    done();
                });
        });

        it('should return a 200', function(done) {
            request(url)
                .post('/content/query')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Basic ' + tokens.globalReaderToken)
                .send(query)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    done();
                });
        });



        it('should return a 200 even if it finds nothing', function(done) {
            request(url)
                .post('/content/query')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Basic ' + tokens.globalReaderToken)
                .send(query2)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    res.body.total.should.equal(0);
                    done();
                });
        });

        it('return valid results for everything within a node', function(done) {
            request(url)
                .post('/content/query')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Basic ' + tokens.globalReaderToken)
                .send({
                    filters: [],
                    nodes: ['526d5179966a883540000006']
                })
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);

                    done();
                });
        });

        it('return only one result when the options.limit is set to one.', function(done) {
            request(url)
                .post('/content/query')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Basic ' + tokens.globalReaderToken)
                .send({
                    filters: [],
                    nodes: ['526d5179966a883540000006'],
                    options : {
                        limit : 1
                    }
                })
                .end(function(err, res) {
                    if (err) { throw err; }

                    res.body.results.length.should.equal(1);
                    res.status.should.equal(200);

                    done();
                });
        });
    });

    describe('POST: ' + url + '/content/query/full', function() {
        var query = {
            filters: [{key: 'slug', cmp: '=', value: 'sample_content_title'}],
            options: {
                //include: ['node','fields.testfield']
            }
        };

        it('should return a 200', function(done) {
            request(url)
                .post('/content/query')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Basic ' + tokens.globalReaderToken)
                .send(query)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    done();
                });
        });
    });

    describe('DELETE: ' + url + '/content/:id', function() {
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
                .set('authorization', 'Basic ' + tokens.globalReaderToken)
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
                .set('authorization', 'Basic ' + tokens.restrictedEditorToken)
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
                .set('authorization', 'Basic ' + tokens.globalAdminToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    done();
                });
        });
    });

    function getAllAccessTokens() {
        return BB.all(
            _.chain(tokens)
            .keys()
            .map(function(key) {
                return new BB(function(resolve, reject) {
                    request(url)
                        .get('/token')
                        .set('Accept', 'application/json')
                        .set('Accept-Language', 'en_US')
                        .set('authorization', 'Basic '+ new Buffer(tokens[key]).toString('base64'))
                        .end(function(err, res) {
                            err && reject();

                            tokens[key] = res.body.access_token;
                            resolve();
                        });
                });
            })
            .value()
        );
    }

});
