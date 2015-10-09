'use strict';

var request = require('supertest-promised'),
    path = require('path'),
    env = require('./config/environment')(),
    BB = require('bluebird'),
    url = require('./config/test').url,
    async = require('async'),
    globalAdminToken  = '',
    globalReaderToken = '',
    globalEditorToken = '',
    nodeEditorToken = '',
    restrictedEditorToken = '',
    testNodeId = '',
    testNodeWithNoSubNodes = '',
    testNodeToCopyTo = '',
    testNodeIdRoot_generated = '',
    testNodeIdSubNode_generated = '',
    // testNodeIdSubSub_generated = '',
    testContentType = {
        _id: '524362aa56c02c0703000001',
        label: 'This is my test content type',
        helpText: ''
    },
    testContentTypeUsers = {
        _id: '5254908d56c02c076e000001',
        label: 'Users',
        helpText: 'These fields are the minimum required to create a user in the system. See more about extending users through plugins.'
    },
    files = [
        './test/fixtures/artwork.png',
        './test/fixtures/36.png',
        './test/fixtures/48.png',
        './test/fixtures/72.png',
        './test/fixtures/96.png',
        './test/fixtures/assetfordeletion.png'
    ],
    exec = require('child_process').execSync,
    start = require('./_start');

require('chai').should();

describe('api.nodes', function(){
    before(function(done){
        //exec('grunt test:generatePublic');
        exec('./tasks/importdb.sh');
        this.timeout(10000);
        start()
            .then(function(){
                async.series(
                    [
                        function(cb){
                            request(url)
                                .get('/token')
                                .set('Accept', 'application/json')
                                .set('Accept-Language', 'en_US')
                                .set('authorization', 'Basic '+ new Buffer('apitestuseradmin:TestPassword').toString('base64'))
                                .end(function(err, res) {
                                    if (err) { throw err; }
                                    globalAdminToken = res.body.access_token;
                                    cb();
                                });
                        },
                        function(cb){
                            request(url)
                                .get('/token')
                                .set('Accept', 'application/json')
                                .set('Accept-Language', 'en_US')
                                .set('authorization', 'Basic '+ new Buffer('apitestuserreader:TestPassword').toString('base64'))
                                .end(function(err, res) {
                                    if (err) { throw err; }
                                    globalReaderToken = res.body.access_token;
                                    cb();
                                });
                        },
                        function(cb){
                            request(url)
                                .get('/token')
                                .set('Accept', 'application/json')
                                .set('Accept-Language', 'en_US')
                                .set('authorization', 'Basic '+ new Buffer('apitestusereditor:TestPassword').toString('base64'))
                                .end(function(err, res) {
                                    if (err) { throw err; }
                                    globalEditorToken = res.body.access_token;
                                    cb();
                                });
                        },
                        function(cb){
                            request(url)
                                .get('/token')
                                .set('Accept', 'application/json')
                                .set('Accept-Language', 'en_US')
                                .set('authorization', 'Basic '+ new Buffer('apitestuserreader_1:TestPassword').toString('base64'))
                                .end(function(err, res) {
                                    if (err) { throw err; }
                                    nodeEditorToken = res.body.access_token;
                                    cb();
                                });
                        },
                        function(cb){
                            request(url)
                                .get('/token')
                                .set('Accept', 'application/json')
                                .set('Accept-Language', 'en_US')
                                .set('authorization', 'Basic '+ new Buffer('apitestusereditor_restricted:TestPassword').toString('base64'))
                                .end(function(err, res) {
                                    if (err) { throw err; }
                                    restrictedEditorToken = res.body.access_token;
                                    cb();
                                });
                        },
                        function(cb) {
                            request(url)
                                .post('/nodes')
                                .set('Accept', 'application/json')
                                .set('Accept-Language', 'en_US')
                                .set('authorization', 'Basic ' + globalEditorToken)
                                .send({
                                    label : 'Magik Mike',
                                    parent: null
                                })
                                .end(function(err, res) {
                                    if (err) { throw err; }
                                    testNodeId = res.body._id;
                                    cb();
                                });
                        },
                        function(cb){
                            request(url)
                                .post('/nodes')
                                .set('Accept', 'application/json')
                                .set('Accept-Language', 'en_US')
                                .set('authorization', 'Basic ' + globalEditorToken)
                                .send({
                                    label : 'My Test Node',
                                    parent: null
                                })
                                .end(function(err, res) {
                                    if (err) { throw err; }
                                    testNodeIdRoot_generated = res.body._id;
                                    cb();
                                });
                        },
                        function(cb){
                            request(url)
                                .post('/nodes')
                                .set('Accept', 'application/json')
                                .set('Accept-Language', 'en_US')
                                .set('authorization', 'Basic ' + globalEditorToken)
                                .send({
                                    label : 'moveToThisNode',
                                    parent: null
                                })
                                .end(function(err, res) {
                                    if (err) { throw err; }
                                    testNodeWithNoSubNodes = res.body._id;
                                    cb();
                                });
                        },
                        function(cb){
                            request(url)
                                .post('/nodes')
                                .set('Accept', 'application/json')
                                .set('Accept-Language', 'en_US')
                                .set('authorization', 'Basic ' + globalEditorToken)
                                .send({
                                    label : 'Greg is a Jabroni',
                                    parent: null
                                })
                                .end(function(err, res) {
                                    if (err) { throw err; }
                                    testNodeToCopyTo = res.body._id;
                                    cb();
                                });
                        },
                        function(cb) {
                            request(url)
                                .post('/nodes')
                                .set('Accept', 'application/json')
                                .set('Accept-Language', 'en_US')
                                .set('authorization', 'Basic ' + globalEditorToken)
                                .send({
                                    label : 'My Test Sub-Node',
                                    parent: testNodeIdRoot_generated
                                })
                                .end(function(err, res) {
                                    if (err) { throw err; }
                                    testNodeIdSubNode_generated = res.body._id;
                                    cb();
                                });
                        },
                        function(cb) {
                            BB.all([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(function(label) {
                                return request(url)
                                    .post('/nodes')
                                    .set('Accept', 'application/json')
                                    .set('Accept-Language', 'en_US')
                                    .set('authorization', 'Basic ' + globalEditorToken)
                                    .send({
                                        label : label,
                                        parent: testNodeId
                                    })
                                    .end()
                                    .then(function(res) {
                                        return request(url)
                                            .post('/nodes')
                                            .set('Accept', 'application/json')
                                            .set('Accept-Language', 'en_US')
                                            .set('authorization', 'Basic ' + globalEditorToken)
                                            .send({
                                                label : label,
                                                parent: res.body._id
                                            })
                                            .end();
                                    });
                            }))
                            .then(function() {
                                cb();
                            });
                        },
                        function(cb){
                            BB.all([0,1,2,3,4,5].map(function(fileNum){
                                return request(url)
                                    .post('/node/' + testNodeId + '/assets')
                                    .set('Accept', 'application/json')
                                    .set('Accept-Language', 'en_US')
                                    .set('authorization', 'Basic ' + globalEditorToken)
                                    .attach('file', files[fileNum])
                                    .end(function(err,res){
                                        if (err) { throw err; }
                                    });
                            }))
                            .then(function(){
                                cb();
                            });
                        },
                    ],function(){
                        done();
                    }
                );
            });

    });


    describe('POST: ' + url + '/nodes', function() {

        it('should create a node without an error using correct verb.', function(done){
            request(url)
                .post('/nodes')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Basic ' + globalEditorToken)
                .send({
                    label : 'Root Node',
                    parent: null
                })
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    res.body.should.have.property('_id');
                    done();
                });
        });

        it('should create a node without an error using correct verb. (sub node of root)', function(done){
            request(url)
                .post('/nodes')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Basic ' + globalEditorToken)
                .send({
                    label : 'Nested Node',
                    parent: testNodeIdRoot_generated
                })
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    res.body.should.have.property('_id');
                    done();
                });
        });

        it('should create a node without an error using correct verb. (sub sub node of root)', function(done){
            request(url)
                .post('/nodes')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Basic ' + globalEditorToken)
                .send({
                    label : 'Double Nested Node',
                    parent: testNodeIdSubNode_generated
                })
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    res.body.should.have.property('_id');
                    done();
                });
        });

        it('should return an error because we are missing a label field.', function(done){
            request(url)
                .post('/nodes')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Basic ' + globalEditorToken)
                .send({
                    parent: testNodeIdRoot_generated
                })
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(400);
                    done();
                });
        });

        it('should return error when a reader tries to create a node', function(done){
            request(url)
                .post('/nodes')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Basic ' + globalReaderToken)
                .send({
                    label: 'Reader Created Node',
                    parent: testNodeId
                })
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(403);
                    done();
                });
        });

        // ** NOT IMPLEMENTED
        // it('should return error when a restricted editor tries to create a node', function(done){
        //     request(url)
        //         .post('/nodes')
        //         .set('Accept', 'application/json')
        //         .set('Accept-Language', 'en_US')
        //         .set('authorization', 'Basic ' + restrictedEditorToken)
        //         .send({
        //             label: 'Editor Created Node',
        //             parent: testNodeId
        //         })
        //         .end(function(err, res) {
        //             if (err) { throw err; }
        //             res.status.should.equal(403);
        //             done();
        //         });
        // });
    });

    describe('POST: ' + url + '/node/:id/contenttype', function() {
        it('should respond with a 200 when adding a content type to an existing node sent as a single value.', function(done){
            request(url)
                .post('/node/' + testNodeId + '/contenttype')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Basic ' + globalEditorToken)
                .send({
                    id: testContentType._id
                })
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    done();
                });
        });

        it('should respond with a 200 when adding a collection of content types to an existing node sent as an array.', function(done){
            request(url)
                .post('/node/' + testNodeId + '/contenttype')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Basic ' + globalEditorToken)
                .send([
                    {
                        id: testContentType._id
                    },
                    {
                        id: testContentTypeUsers._id
                    }
                ])
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    done();
                });
        });

        it('should add a content type to an existing node as the property allowedTypes sent as a single value.', function(done){
            request(url)
                .post('/node/' + testNodeId + '/contenttype')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Basic ' + globalEditorToken)
                .send({
                    id: testContentType._id
                })
                .end(function(err) {
                    if (err) { throw err; }

                    request(url)
                        .get('/node/' + testNodeId)
                        .set('Accept', 'application/json')
                        .set('Accept-Language', 'en_US')
                        .set('authorization', 'Basic ' + globalEditorToken)
                        .end(function(err, res) {
                            if (err) { throw err; }
                            res.body.allowedTypes[0].should.deep.equal(testContentType);
                            done();
                        });
                });
        });

        it('should replace any exisiting content types when adding content types to a node', function(done){
            request(url)
                .post('/node/' + testNodeId + '/contenttype')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Basic ' + globalEditorToken)
                .send({
                    id: testContentType._id
                })
                .end()
                .then(function() {
                    return request(url)
                        .post('/node/' + testNodeId + '/contenttype')
                        .set('Accept', 'application/json')
                        .set('Accept-Language', 'en_US')
                        .set('authorization', 'Basic ' + globalEditorToken)
                        .send({
                            id: testContentTypeUsers._id
                        })
                        .end();
                })
                .then(function() {
                    return request(url)
                        .get('/node/' + testNodeId)
                        .set('Accept', 'application/json')
                        .set('Accept-Language', 'en_US')
                        .set('authorization', 'Basic ' + globalEditorToken)
                        .end();
                })
                .then(function(res) {
                    res.body.allowedTypes[0].should.not.deep.equal(testContentType);
                    res.body.allowedTypes[0].should.deep.equal(testContentTypeUsers);
                    res.body.allowedTypes.length.should.equal(1);
                    done();
                })
                .catch(function(err) {
                    throw(err);
                });
        });

        it('should replace multiple contenttypes in an existing node with a single contenttype.', function(done){
            request(url)
                .post('/node/' + testNodeId + '/contenttype')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Basic ' + globalEditorToken)
                .send(
                    [
                        {
                            id: testContentType._id
                        },
                        {
                            id: testContentTypeUsers._id
                        }
                    ]
                )
                .end()
                .then(function() {
                    return request(url)
                        .post('/node/' + testNodeId + '/contenttype')
                        .set('Accept', 'application/json')
                        .set('Accept-Language', 'en_US')
                        .set('authorization', 'Basic ' + globalEditorToken)
                        .send({
                            id: testContentTypeUsers._id
                        })
                        .end();
                })
                .then(function() {
                    return request(url)
                        .get('/node/' + testNodeId)
                        .set('Accept', 'application/json')
                        .set('Accept-Language', 'en_US')
                        .set('authorization', 'Basic ' + globalEditorToken)
                        .end();
                })
                .then(function(res) {
                    res.body.allowedTypes[0].should.deep.equal(testContentTypeUsers);
                    res.body.allowedTypes.length.should.equal(1);
                    done();
                })
                .catch(function(err) {
                    throw(err);
                });
        });

        it('should fail with 401 if the user is unauthenticated.', function(done){
            request(url)
                .post('/node/' + testNodeId + '/contenttype')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .send({
                    id: testContentType._id
                })
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(401);
                    done();
                });
        });

        it('Should fail with a 403 if a user does not have editor permissions to the parent node.', function(done){
            request(url)
                .post('/node/' + testNodeId + '/contenttype')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Basic ' + globalReaderToken)
                .send({
                    id: testContentType._id
                })
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(403);
                    done();
                });
        });

        it('should fail with 404 if trying to save a non existing content type to a node.', function(done){
            request(url)
                .post('/node/' + testNodeId + '/contenttype')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Basic ' + globalEditorToken)
                .send({
                    id: '12345'
                })
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(404);
                    done();
                });
        });

        it('should fail if the payload to the node types is not a correct format.', function(done){
            request(url)
                .post('/node/' + testNodeId + '/contenttype')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Basic ' + globalEditorToken)
                .send({
                    contenttypeid: testContentType._id
                })
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(404);
                    done();
                });
        });
    });

    describe('GET: ' + url + '/node/:id', function() {
        it('should return 401 because trying to access unauthenticated', function(done) {
            request(url)
                .get('/node/' + testNodeId)
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(401);
                    done();
                });
        });

        it('should return a node when using a id', function(done) {
            request(url)
                .get('/node/' + testNodeId)
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Basic ' + globalEditorToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    done();
                });
        });

        it('should return a node\'s allowedTypes when using a id', function(done) {
            request(url)
                .get('/node/' + testNodeId)
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Basic ' + globalEditorToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.body.should.include.keys('allowedTypes');
                    done();
                });
        });

        it('should return a nodes allowedTypes with the fields (id, label, helptext) when using a id', function(done) {
            request(url)
                .get('/node/' + testNodeId)
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Basic ' + globalEditorToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.body.allowedTypes[0].should.have.keys(['_id', 'label', 'helpText']);
                    done();
                });
        });

        /*
        it('a reader should return a 403 because user does not have permissions to access a particular node', function(done) {
            request(url)
                .get('/node/' + testLockedDownNodeId)
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + nodeEditorToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(403);
                    done();
                });
        });

        it('an editor with rights restricted to a specific node should return a 403 error', function(done) {
            request(url)
                .get('/node/' + testLockedDownNodeId)
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + restrictedEditorToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(403);
                    done();
                });
        });*/

        it('an editor should return an existing node object', function(done) {
            request(url)
                .get('/node/' + testNodeId)
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Basic ' + globalEditorToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    done();
                });
        });

        it('a reader should return an existing node object', function(done) {
            request(url)
                .get('/node/' + testNodeId)
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Basic ' + globalReaderToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    done();
                });
        });
    });

    // /** Not yet supported
    // describe('GET: ' + url + '/nodes/:id/hydrate', function() {
    //     it('a reader with all valid permissions should get a node object back with a full collection of child nodes and its content', function(done) {
    //         request(url)
    //             .get('/node/' + testNodeId + '/hydrate')
    //             .set('Accept', 'application/json')
    //             .set('Accept-Language', 'en_US')
    //             .set('authorization', 'Token ' + globalReaderToken)
    //             .end(function(err, res) {
    //                 if (err) { throw err; }
    //                 res.status.should.equal(200);
    //                 res.body.length.should.equal(11);
    //                 done();
    //             });
    //     });
    // });*/
    //
    // xdescribe('GET: ' + url + '/node/:nodeid/content', function(){
    //     it('should return a list of content inside of a node.', function(done){
    //         request(url)
    //             .get('/node/' + testNodeId + '/content')
    //             .set('Accept', 'application/json')
    //             .set('Accept-Language', 'en_US')
    //             .set('authorization', 'Basic ' + globalReaderToken)
    //             .end(function(err) {
    //                 if (err) { throw err; }
    //
    //                 done();
    //             });
    //     });
    //
    //     it('should return an empty list because the node is root.', function(done){
    //         request(url)
    //             .get('/node/0/content')
    //             .set('Accept', 'application/json')
    //             .set('Accept-Language', 'en_US')
    //             .set('authorization', 'Basic ' + globalReaderToken)
    //             .end(function(err) {
    //
    //                 if (err) { throw err; }
    //
    //                 done();
    //             });
    //     });
    // });

    describe('GET: ' + url + '/nodes/:id/children/deep', function() {
        it('a reader with all valid permissions should get a node object back with a full collection of child nodes infinitely deep.', function(done) {
            request(url)
                .get('/node/' + testNodeId + '/children/deep')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Basic ' + globalReaderToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    res.body.length.should.equal(24);
                    done();
                });
        });

        /** Node sure if this is useful
        it('a reader with all valid permissions should get a node object back with a full collection of child nodes including the parent node.', function(done) {
            request(url)
                .get('/node/' + testNodeId + '/deep')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + globalReaderToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    res.body.length.should.equal(14);
                    done();
                });
        });*/

        /** Requires node level permissions
        it('a global reader with with a restriction on a child node should get a node object back with a filtered collection of child nodes', function(done) {
            request(url)
                .get('/node/' + testNodeId + '/children')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + restrictedEditorToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    res.body.length.should.equal(9);
                    done();
                });
        });*/
    });

    describe('GET: ' + url + '/nodes/:id/children', function() {
        it('should return a 401 because user is not authenticated', function(done) {
            request(url)
                .get('/node/' + testNodeId + '/children')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(401);
                    done();
                });
        });

        it('a reader with all valid permissions should get a node object back with a full collection of child nodes only a single level deep', function(done) {
            request(url)
                .get('/node/' + testNodeId + '/children')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Basic ' + globalReaderToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    res.body.length.should.equal(12);
                    done();
                });
        });

        /** Requires node level permissions
         *
        it('should return a 403 because user does not have permissions to access this node', function(done) {
            request(url)
                .get('/node/' + testLockedDownNodeId + '/children')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + nodeEditorToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(403);
                    done();
                });
        });


        it('a global reader with with a restriction on a child node should get a node object back with a filtered collection of child nodes', function(done) {
            request(url)
                .get('/node/' + testNodeId + '/children')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + restrictedEditorToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    res.body.length.should.equal(9);
                    done();
                });
        });*/

        it('should return list of root level child nodes', function(done) {
            request(url)
                .get('/node/0/children')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Basic ' + globalEditorToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    res.body.length.should.equal(7);
                    done();
                });
        });
    });

    describe('POST: ' + url + '/node/:id/assets', function() {
        it('post test fixtures to a node', function(done) {
            request(url)
                .post('/node/' + testNodeIdRoot_generated + '/assets')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Basic ' + globalEditorToken)
                .attach('file', files[0])
                .end()
                .then(function() {
                    return request(url)
                        .get('/node/' + testNodeIdRoot_generated + '/assets/' + path.basename(files[0]))
                        .set('Accept', 'application/json')
                        .set('Accept-Language', 'en_US')
                        .set('authorization', 'Basic ' + globalEditorToken)
                        .send()
                        .end();
                })
                .then(function(res) {
                    path.basename(res.body.url).should.equal(path.basename(files[0]));
                    done();
                })
                .catch(function(err) {
                    throw(err);
                });
        });

        it('an editor with all valid permissions should be able to post an attachment to a node.', function(done) {
            request(url)
                .post('/node/' + testNodeId + '/assets')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Basic ' + globalEditorToken)
                .attach('file', files[1])
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    res.body.message.should.equal('Success');
                    done();
                });
        });

        it('an editor with all valid permissions should be able to post a LARGE attachment to a node.', function(done) {
            request(url)
                .post('/node/' + testNodeId + '/assets')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Basic ' + globalEditorToken)
                .attach('file', './test/fixtures/nodejs-2560x1440.png')
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    res.body.message.should.equal('Success');
                    done();
                });
        });
    });

    describe('POST: ' + url + '/node/:id/assets/rename', function() {
        it('should rename an asset to a new name in the same node.', function(done) {
            request(url)
                .post('/node/' + testNodeId + '/assets/rename')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Basic ' + globalEditorToken)
                .send({
                    original: path.basename(files[0]),
                    updated: 'testimage.png'
                })
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    res.body.message.should.equal('Success');
                    done();
                });
        });

        it('should fail because asset does not exist.', function(done) {
            request(url)
                .post('/node/' + testNodeId + '/assets/rename')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Basic ' + globalEditorToken)
                .send({
                    original: 'artwork_doesntexist.png',
                    updated: 'testimage.png'
                })
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(404);
                    done();
                });
        });

        it('should fail because the user does not have permissions.', function(done) {
            request(url)
                .post('/node/' + testNodeId + '/assets/rename')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Basic ' + globalReaderToken)
                .send({
                    original: path.basename(files[0]),
                    updated: 'updated.png'
                })
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(403);
                    done();
                });
        });
    });

    describe('POST: ' + url + '/node/:id/assets/copy', function() {
        it('should copy an asset from one node to another.', function(done) {

            request(url)
                .post('/node/' + testNodeId + '/assets/copy')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + globalEditorToken)
                .send({
                    newnodeid: testNodeToCopyTo,
                    filename: path.basename(files[4])
                })
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    res.body.message.should.equal('Success');
                    done();
                });
        });

    });


    describe('GET: ' + url + '/node/:nodeid/assets/:filename', function() {
        it('should get a file from a node specified by the filename.', function(done) {

            request(url)
                .get('/node/' + testNodeId + '/assets/48.png')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Basic ' + globalEditorToken)
                .send()
                .end(function(err, res) {
                    if (err) { throw err; }
                    console.log(res.body);
                    path.basename(res.body.url).should.equal('48.png');
                    done();
                });
        });

        it('should return a 404 when it could not find the file.', function(done) {

            request(url)
                .get('/node/' + testNodeId + '/assets/gobledigook.png')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Basic ' + globalEditorToken)
                .send()
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(404);
                    done();
                });
        });
    });



    describe('POST: ' + url + '/node/:nodeid/assets/move', function() {
        it('should move one asset to another node.', function(done) {
            request(url)
                .post('/node/' + testNodeId + '/assets/move')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Basic ' + globalEditorToken)
                .send({
                    newnodeid: testNodeWithNoSubNodes,
                    filename: path.basename(files[1])
                })
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    res.body.message.should.equal('Success');
                    done();
                });
        });

        /** Requires node level permissions
        it('should fail because the user does not have permissions on the new node id.', function(done) {
            done();
        });

        it('should succeed when a user that is a reader but had editor rights on a specific node.', function(done) {
            done();
        });*/
    });

    describe('DELETE: ' + url + '/node/:id/assets/:name', function() {
        it('should delete an asset with a specific name', function(done) {

            request(url)
                .del('/node/' + testNodeId + '/assets/72.png')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Basic ' + globalEditorToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    res.body.message.should.equal('Success');
                    done();
                });
        });

        it('should fail because the user does not have permissions.', function(done) {
            request(url)
                .del('/node/' + testNodeId + '/assets/72.png')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Basic ' + globalReaderToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(403);
                    res.body.message.should.equal('User does not have enough privileges.');
                    done();
                });
        });

        xit('should succeed when a user that is a reader but has editor rights on a specific node.', function() {

        });
    });




    describe('DELETE: ' + url + '/node/:id/assets', function() {
        it('should delete all files in a node.', function(done) {
            request(url)
                .del('/node/' + testNodeId + '/assets')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Basic ' + globalEditorToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    res.body.message.should.equal('Success');
                    done();
                });
        });

        it('should fail because the user does not have permissions.', function(done) {
            request(url)
                .del('/node/' + testNodeId + '/assets')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Basic ' + globalReaderToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(403);
                    res.body.message.should.equal('User does not have enough privileges.');
                    done();
                });
        });

        xit('should succeed when a user that is a reader but had editor rights on a specific node.', function() {

        });
    });


    describe('GET: ' + url + '/nodes/:nodeid/assets', function() {
        it('should return 401 because trying to access unauthenticated', function(done) {
            request(url)
                .get('/node/' + testNodeId)
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(401);
                    done();
                });
        });

        /*
        describe('When calling in the root with a zero.', function() {
           it('should return empty array', function(done) {
               request(url)
                   .get('/node/0/assets')
                   .set('Accept', 'application/json')
                   .set('Accept-Language', 'en_US')
                   .set('authorization', 'Basic ' + globalEditorToken)
                   .end(function(err, res) {
                       if (err) { throw err; }
                       console.log('=========================================================');
                       console.log(res.body);

                       done();
                   });
           });
        });
        */

        /** Requires node level permissions
        xit('a reader should return a 403 because user does not have permissions to access a particular node', function(done) {
            request(url)
                .get('/node/' + testLockedDownNodeId + '/assets')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + nodeEditorToken)//This is an editor token for a specific node but a 'none' for the locked down node.
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(403);
                    done();
                });
        });*/

        /** Requires node level permissions
        it('an editor with rights restricted to a specific node should return a 403 error', function(done) {
            request(url)
                .get('/node/' + testLockedDownNodeId + '/assets')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + restrictedEditorToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(403);
                    done();
                });
        });*/

        it('an editor should return a list of files in a node', function(done) {
            request(url)
                .get('/node/' + testNodeId + '/assets')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Basic ' + globalEditorToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    res.body.should.be.an('array');
                    done();
                });
        });

        it('a reader should return a list of files in a node', function(done) {
            request(url)
                .get('/node/' + testNodeId + '/assets')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Basic ' + globalReaderToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    res.body.should.be.an('array');
                    done();
                });
        });

        /** Deferred
        it('an editor should return a DEEP list of files in a node and it\'s children', function(done) {
            request(url)
                .get('/node/' + testNodeId + '/assets/deep')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + globalEditorToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    res.body.should.be.an('array');
                    done();
                });
        });

        it('an editor should return a DEEP list of files in a node and it\'s children (even when there are no children) And node is empty.', function(done) {
            request(url)
                .get('/node/' + testNodeIdRoot_generated + '/assets/deep')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + globalEditorToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    res.body.should.be.an('array');
                    done();
                });
        });

        it('an editor should return a DEEP list of files in a node and it\'s children (even when there are no children) And node is NOT empty.', function(done) {
            request(url)
                .get('/node/' + testNodeWithNoSubNodes + '/assets/deep')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + globalEditorToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    res.body.should.be.an('array');
                    done();
                });
        });*/
    });

    describe('DELETE: ' + url + '/node/:id', function() {

        it('Should delete an node.', function(done) {
            request(url)
                .del('/node/' + testNodeIdRoot_generated)
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Basic ' + globalEditorToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    done();
                });
        });

        // it('Should delete a generated node.', function(done) {
        //     request(url)
        //         .del('/node/' + testNodeIdSubSub_generated)
        //         .set('Accept', 'application/json')
        //         .set('Accept-Language', 'en_US')
        //         .set('authorization', 'Basic ' + globalEditorToken)
        //         .end(function(err, res) {
        //             if (err) { throw err; }
        //             res.status.should.equal(200);
        //             done();
        //         });
        // });
    });

});
