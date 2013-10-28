var should = require('chai').should();
var request = require('supertest');

describe('api.nodes', function(){
    var url = 'http://localhost:8080',
        async = require('async'),
        globalAdminToken  = "",
        globalReaderToken = "",
        globalEditorToken = "",
        nodeEditorToken = "",
        restrictedEditorToken = "",
        testNodeId = "5261781556c02c072a000007",
        testLockedDownNodeId = "526d5179966a883540000006",
        testNodeSlug = "/this/is/my/path",
        testNodeSlugWithoutSlashes = "sample_sub_node",
        testNodeIdRoot_generated = "",
        testNodeIdSubNode_generated = "",
        testContentTypeID = "524362aa56c02c0703000001",
        testContentTypeID_Users = "5254908d56c02c076e000001",
        badTestContentTypeID = "52698a0033e248a360000006",
        badTestNodeId = "526d545623c0ff9442000006";

    before(function(done){
        async.parallel(
            [
                function(cb){
                    request(url)
                        .get('/token')
                        .set('Accept', 'application/json')
                        .set('Accept-Language', 'en_US')
                        .set('authorization', new Buffer('apitestuseradmin:TestPassword').toString('base64'))
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
                        .set('authorization', new Buffer('apitestuserreader:TestPassword').toString('base64'))
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
                        .set('authorization', new Buffer('apitestusereditor:TestPassword').toString('base64'))
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
                        .set('authorization', new Buffer('apitestuserreader_1:TestPassword').toString('base64'))
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
                        .set('authorization', new Buffer('apitestusereditor_restricted:TestPassword').toString('base64'))
                        .end(function(err, res) {
                            if (err) { throw err; }
                            restrictedEditorToken = res.body.access_token;
                            cb();
                        });
                }
            ],function(){
                done();
            }
        );
    });
/*
    describe("POST: " + url + '/nodes', function() {

        it('should create a node without an error using correct verb.', function(done){
            request(url)
                .post('/nodes')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + globalEditorToken)
                .send({
                    label : "My Test Node",
                    slug : "my_test_node",
                    parent: null
                })
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    res.body.should.have.property('_id');
                    testNodeIdRoot_generated = res.body._id;
                    done();
                });
        });

        it('should create a node without an error using correct verb. (sub node of root)', function(done){
            request(url)
                .post('/nodes')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + globalEditorToken)
                .send({
                    label : "My Test Sub-Node",
                    slug : "my_test_sub_node",
                    parent: testNodeIdRoot_generated
                })
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    res.body.should.have.property('_id');
                    testNodeIdSubNode_generated = res.body._id;
                    done();
                });
        });

         it('should return an error because we are missing a "label" field.', function(done){
             request(url)
                 .post('/nodes')
                 .set('Accept', 'application/json')
                 .set('Accept-Language', 'en_US')
                 .set('authorization', 'Token ' + globalEditorToken)
                 .send({
                     slug : "my_test_sub_node",
                     parent: testNodeIdRoot_generated
                 })
                 .end(function(err, res) {
                     if (err) { throw err; }
                     res.status.should.equal(500);
                     done();
                 });
         });


         it('should return error when a malformed slug is passed in (id has a space).', function(done){
             request(url)
                 .post('/nodes')
                 .set('Accept', 'application/json')
                 .set('Accept-Language', 'en_US')
                 .set('authorization', 'Token ' + globalEditorToken)
                 .send({
                     label: "My Test Sub Node Label",
                     slug : "my_test_sub_node_123jf dfa-32423",
                     parent: null
                 })
                 .end(function(err, res) {
                     if (err) { throw err; }
                     res.status.should.equal(500);
                     res.body.should.have.property("message");
                     done();
                 });
         });


         it('should return error when a field has a duplicate slug', function(done){
             request(url)
                 .post('/nodes')
                 .set('Accept', 'application/json')
                 .set('Accept-Language', 'en_US')
                 .set('authorization', 'Token ' + globalEditorToken)
                 .send({
                     label: "My Test Sub Node Label",
                     slug : "my_test_sub_node",
                     parent: testNodeIdRoot_generated
                 })
                 .end(function(err, res) {
                     if (err) { throw err; }
                     res.status.should.equal(500);
                     res.body.should.have.property("message");
                     res.body.message.should.equal("Duplicate key already exists.");
                     done();
                 });
         });

        it('should create a node when a reader with editor permissions creates a node', function(done){
            request(url)
                .post('/nodes')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + nodeEditorToken)
                .send({
                    label: "Reader Created Node",
                    slug : "my_test_sub_node_2",
                    parent: testNodeId
                })
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    done();
                });
        });

        it('should return error when a reader tries to create a node', function(done){
            request(url)
                .post('/nodes')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + globalReaderToken)
                .send({
                    label: "Reader Created Node",
                    slug : "my_test_sub_node_3",
                    parent: testNodeId
                })
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(403);
                    done();
                });
        });

        it('should return error when a reader tries to create a node', function(done){
            request(url)
                .post('/nodes')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + restrictedEditorToken)
                .send({
                    label: "Editor Created Node",
                    slug : "my_test_sub_node_4",
                    parent: testNodeId
                })
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(403);
                    done();
                });
        });
    });

    describe("POST: " + url + '/node/:id/contenttype', function() {

        it('should add a content type to an existing node sent as a single value.', function(done){
            request(url)
                .post('/node/' + testNodeId + '/contenttype')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + globalEditorToken)
                .send({
                    id: testContentTypeID
                })
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    done();
                });
        });

        it('should add a collection of content types to an existing node sent as an array.', function(done){
            request(url)
                .post('/node/' + testNodeId + '/contenttype')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + globalEditorToken)
                .send([{id: testContentTypeID }, {id: testContentTypeID_Users }])
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    done();
                });


        });

        it('should fail with 401 if the user is unauthenticated.', function(done){
            request(url)
                .post('/node/' + testNodeId + '/contenttype')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .send({
                    id: testContentTypeID
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
                .set('authorization', 'Token ' + globalReaderToken)
                .send({
                    id: testContentTypeID
                })
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(403);
                    done();
                });
        });

        it('should fail with 500 if trying to save a content type to a node that doesn\'t exist.', function(done){
            request(url)
                .post('/node/' + testNodeId + '/contenttype')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + globalEditorToken)
                .send({id: badTestContentTypeID})
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(500);
                    done();
                });
        });

        it('should fail if the payload to the node types is not a correct format.', function(done){
            request(url)
                .post('/node/' + testNodeId + '/contenttype')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + globalEditorToken)
                .send({contenttypeid: testContentTypeID})
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(500);
                    done();
                });
        });
    });

    describe("GET: " + url + '/node/:id', function() {
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
                .set('authorization', 'Token ' + globalEditorToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    done();
                });
        });

        describe("GET: " + url + '/node/:slug', function() {
            it('should return a node when using a slug that includes slashes', function(done) {
                request(url)
                    .get('/node' + testNodeSlug)
                    .set('Accept', 'application/json')
                    .set('Accept-Language', 'en_US')
                    .set('authorization', 'Token ' + globalEditorToken)
                    .end(function(err, res) {
                        if (err) { throw err; }
                        res.status.should.equal(200);
                        done();
                    });
            });

            it('should return a node when using a slug without slashes.', function(done) {
                request(url)
                    .get('/node/' + testNodeSlugWithoutSlashes)
                    .set('Accept', 'application/json')
                    .set('Accept-Language', 'en_US')
                    .set('authorization', 'Token ' + globalEditorToken)
                    .end(function(err, res) {
                        if (err) { throw err; }
                        res.status.should.equal(200);
                        done();
                    });
            });
        });

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
        });


        it('an editor should return an existing node object', function(done) {
            request(url)
                .get('/node/' + testNodeId)
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + globalEditorToken)
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
                .set('authorization', 'Token ' + globalReaderToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    done();
                });
        });
    });

   */















/*
    describe("GET: " + url + '/nodes', function() {
        it('should return 401 because trying to access unauthenticated', function(done) {
            false.should.equal(true);
            done();
        });
        it('a reader should return a 403 because user does not have permissions to access the ROOT node', function(done) {
            false.should.equal(true);
            done();
        });
        it('an editor with rights restricted to the ROOT node should return a 403 error', function(done) {
            false.should.equal(true);
            done();
        });
        it('an admin with rights restricted to the ROOT node should not return a 403 error, this would have been an error should return 200', function(done) {
            false.should.equal(true);
            done();
        });
        it('an editor should return a the ROOT node object', function(done) {
            false.should.equal(true);
            done();
        });
        it('a reader should return a the ROOT node object', function(done) {
            false.should.equal(true);
            done();
        });
        it('should return 404 because ROOT node does not exist', function(done) {
            false.should.equal(true);
            done();
        });
    });

    describe("GET: " + url + '/nodes/deep', function() {
        it('a reader with all valid permissions should get a node object back with a full collection of child nodes', function(done) {
            false.should.equal(true);
            done();
        });
        it('a global reader with with a restriction on a child node should get a node object back with a filtered collection of child nodes', function(done) {
            false.should.equal(true);
            done();
        });
        it('a global reader with with a restriction on a child node of a child node should get a node object back with a filtered collection of child nodes', function(done) {
            false.should.equal(true);
            done();
        });
        it('should return a 403 because user does not have permissions to access this node', function(done) {
            false.should.equal(true);
            done();
        });
        it('should return a 403 because user does not have permissions to access a parent of this node', function(done) {
            false.should.equal(true);
            done();
        });
        it('should return a 401 because user is not authenticated', function(done) {
            false.should.equal(true);
            done();
        });
    });*/

    describe("GET: " + url + '/nodes/:id/children', function() {
        it('a reader with all valid permissions should get a node object back with a full collection of child nodes', function(done) {
            request(url)
                .get('/node/' + testNodeId + "/children")
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + restrictedEditorToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    console.log(res.body);
                    done();
                });
        });
        /*it('a global reader with with a restriction on a child node should get a node object back with a filtered collection of child nodes', function(done) {
            false.should.equal(true);
            done();
        });
        it('a global reader with with a restriction on a child node of a child node should get a node object back with a filtered collection of child nodes', function(done) {
            false.should.equal(true);
            done();
        });
        it('should return a 403 because user does not have permissions to access this node', function(done) {
            false.should.equal(true);
            done();
        });
        it('should return a 403 because user does not have permissions to access a parent of this node', function(done) {
            false.should.equal(true);
            done();
        });
        it('should return a 401 because user is not authenticated', function(done) {
            false.should.equal(true);
            done();
        });*/
    });
/*
    describe("GET: " + url + '/nodes/:parentNodeId', function() {
        it('a reader with all valid permissions should get a node object back with a full collection of child nodes', function(done) {
            false.should.equal(true);
            done();
        });
        it('a global reader with with a restriction on a child node should get a node object back with a filtered collection of child nodes', function(done) {
            false.should.equal(true);
            done();
        });
        it('should return a 403 because user does not have permissions to access this node', function(done) {
            false.should.equal(true);
            done();
        });
        it('should return a 403 because user does not have permissions to access a parent of this node', function(done) {
            false.should.equal(true);
            done();
        });
        it('should return a 401 because user is not authenticated', function(done) {
            false.should.equal(true);
            done();
        });
    });*/











    /*
    describe("GET: " + url + '/nodes/:nodeid/assets', function() {
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

        it('a reader should return a 403 because user does not have permissions to access a particular node', function(done) {
            request(url)
                .get('/node/' + testLockedDownNodeId + "/assets")
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + nodeEditorToken)//This is an editor token for a specific node but a "none" for the locked down node.
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(403);
                    done();
                });
        });

        it('an editor with rights restricted to a specific node should return a 403 error', function(done) {
            request(url)
                .get('/node/' + testLockedDownNodeId + "/assets")
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + restrictedEditorToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(403);
                    done();
                });
        });

        it('an editor should return a list of files in a node', function(done) {
            request(url)
                .get('/node/' + testNodeId + "/assets")
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
        it('a reader should return a list of files in a node', function(done) {
            request(url)
                .get('/node/' + testNodeId + "/assets")
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + globalReaderToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    res.body.should.be.an('array');
                    done();
                });
        });
    });*/














/*
    describe("GET: " + url + '/nodes/:parentNodeId/assets/deep', function() {
        it('should return 401 because trying to access unauthenticated', function(done) {
            false.should.equal(true);
            done();
        });
        it('a reader should return a 403 because user does not have permissions to access a particular node', function(done) {
            false.should.equal(true);
            done();
        });
        it('an editor with rights restricted to a specific node should return a 403 error', function(done) {
            false.should.equal(true);
            done();
        });
        it('an admin with rights restricted to a specific node should not return a 403 error, this would have been an error should return 200', function(done) {
            false.should.equal(true);
            done();
        });
        it('an editor should return a list of files in a node', function(done) {
            false.should.equal(true);
            done();
        });
        it('a reader should return a list of files in a node and all of it\'s children', function(done) {
            false.should.equal(true);
            done();
        });
        it('should return 404 because test node id does not exist', function(done) {
            false.should.equal(true);
            done();
        });
    });

    describe("GET: " + url + '/nodes/assets', function() {
        it('should return 401 because trying to access unauthenticated', function(done) {
            false.should.equal(true);
            done();
        });
        it('a reader should return a 403 because user does not have permissions to access a particular node', function(done) {
            false.should.equal(true);
            done();
        });
        it('an editor with rights restricted to a specific node should return a 403 error', function(done) {
            false.should.equal(true);
            done();
        });
        it('an admin with rights restricted to a specific node should not return a 403 error, this would have been an error should return 200', function(done) {
            false.should.equal(true);
            done();
        });
        it('an editor should return a list of files in a node', function(done) {
            false.should.equal(true);
            done();
        });
        it('a reader should return a list of files in a node', function(done) {
            false.should.equal(true);
            done();
        });
        it('should return 404 because test node id does not exist', function(done) {
            false.should.equal(true);
            done();
        });
    });

    describe("GET: " + url + '/nodes/assets/deep', function() {
        it('should return 401 because trying to access unauthenticated', function(done) {
            false.should.equal(true);
            done();
        });
        it('a reader should return a 403 because user does not have permissions to access a particular node', function(done) {
            false.should.equal(true);
            done();
        });
        it('an editor with rights restricted to a specific node should return a 403 error', function(done) {
            false.should.equal(true);
            done();
        });
        it('an admin with rights restricted to a specific node should not return a 403 error, this would have been an error should return 200', function(done) {
            false.should.equal(true);
            done();
        });
        it('an editor should return a list of files in a node', function(done) {
            false.should.equal(true);
            done();
        });
        it('a reader should return a list of files in a node and all of it\'s children', function(done) {
            false.should.equal(true);
            done();
        });
        it('should return 404 because test node id does not exist', function(done) {
            false.should.equal(true);
            done();
        });
    });


    describe("PUT: " + url + '/contentTypes', function() {
        it('should return a 403 because user does not have permissions to access users', function(done) {
            var newContentType = {
                _id: testCreatedContentTypeId,
                label: "updatedlabel",
                fields: [
                    {
                        id: "testid",
                        label: "Test Field Label",
                        type: "textbox",
                        required: true,
                        instancing: 1
                    }
                ],
                helpText: "",
                meta: [{
                    id: "testmetaid",
                    label: "Test Field Label",
                    type: "textbox",
                    required: true,
                    instancing: 1
                }],
                description: ""
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
                label: "updatedlabel",
                fields: [
                    {
                        id: "testid",
                        label: "Test Field Label",
                        type: "textbox",
                        required: true,
                        instancing: 1
                    }
                ],
                helpText: "",
                meta: [{
                    id: "testmetaid",
                    label: "Test Field Label",
                    type: "textbox",
                    required: true,
                    instancing: 1
                }],
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
                    res.status.should.equal(200);
                    done();
                });
        });

        it('should update a content type using the method override', function(done) {
            var newContentType = {
                _id: testCreatedContentTypeCustomVerb,
                label: "updatedlabel custom verb",
                fields: [
                    {
                        id: "testid",
                        label: "Test Field Label",
                        type: "textbox",
                        required: true,
                        instancing: 1
                    }
                ],
                helpText: "",
                meta: [{
                    id: "testmetaid",
                    label: "Test Field Label",
                    type: "textbox",
                    required: true,
                    instancing: 1
                }],
                description: ""
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
                fields: [
                    {
                        id: "testid",
                        label: "Test Field Label",
                        type: "textbox",
                        required: true,
                        instancing: 1
                    }
                ],
                helpText: "",
                meta: [{
                    id: "testmetaid",
                    label: "Test Field Label",
                    type: "textbox",
                    required: true,
                    instancing: 1
                }],
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
                    res.status.should.equal(500);
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
                .del('/contentTypes/IDONTEXIST')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + adminToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    done();
                });
        });
    });*/
});