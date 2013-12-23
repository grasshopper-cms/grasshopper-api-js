var should = require('chai').should(),
    request = require('supertest'),
    async = require('async'),
    path = require('path');

describe('api.nodes', function(){
    var url = url = require('./config/test').url,
        async = require('async'),
        globalAdminToken  = "",
        globalReaderToken = "",
        globalEditorToken = "",
        nodeEditorToken = "",
        restrictedEditorToken = "",
        testNodeId = "5261781556c02c072a000007",
        testLockedDownNodeId = "526d5179966a883540000006",
        testNodeWithNoSubNodes = "5246e73d56c02c0744000001",
        testNodeIdRoot_generated = "",
        testNodeIdSubNode_generated = "",
        testNodeIdSubSub_generated = "",
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

    describe("POST: " + url + '/nodes', function() {

        it('should create a node without an error using correct verb.', function(done){
            request(url)
                .post('/nodes')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + globalEditorToken)
                .send({
                    label : "My Test Node",
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

        it('should create a node without an error using correct verb. (sub sub node of root)', function(done){
            request(url)
                .post('/nodes')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + globalEditorToken)
                .send({
                    label : "My Test Sub Sub-Node",
                    parent: testNodeIdSubNode_generated
                })
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    res.body.should.have.property('_id');
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
                     parent: testNodeIdRoot_generated
                 })
                 .end(function(err, res) {
                     if (err) { throw err; }
                     res.status.should.equal(500);
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
                    parent: testNodeId
                })
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    testNodeIdSubSub_generated = res.body._id;
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
                    request(url)
                        .get('/node/' + testNodeId)
                        .set('Accept', 'application/json')
                        .set('Accept-Language', 'en_US')
                        .set('authorization', 'Token ' + globalEditorToken)
                        .end(function(err, res) {
                            if (err) { throw err; }
                            res.body.allowedTypes[0].should.deep.equal(
                                {
                                    _id: '524362aa56c02c0703000001',
                                    label: 'This is my test content type'
                                });
                            done();
                        });
                });
        });

        it('should respond with a 200 when adding a content type to an existing node sent as a single value.', function(done){
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

        it('should respond with a 200 when adding a collection of content types to an existing node sent as an array.', function(done){
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

    describe("GET: " + url + '/nodes/:id/hydrate', function() {
        it('a reader with all valid permissions should get a node object back with a full collection of child nodes and its content', function(done) {
            request(url)
                .get('/node/' + testNodeId + "/hydrate")
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + globalReaderToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    res.body.length.should.equal(11);
                    done();
                });
        });
    });

    describe("GET: " + url + '/nodes/:id/deep', function() {
        it('a reader with all valid permissions should get a node object back with a full collection of child nodes', function(done) {
            request(url)
                .get('/node/' + testNodeId + "/children/deep")
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + globalReaderToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    res.body.length.should.equal(13);
                    done();
                });
        });

        it('a reader with all valid permissions should get a node object back with a full collection of child nodes including the parent node.', function(done) {
            request(url)
                .get('/node/' + testNodeId + "/deep")
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + globalReaderToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    res.body.length.should.equal(14);
                    done();
                });
        });
        it('a global reader with with a restriction on a child node should get a node object back with a filtered collection of child nodes', function(done) {
            request(url)
                .get('/node/' + testNodeId + "/children")
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + restrictedEditorToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    res.body.length.should.equal(9);
                    done();
                });
        });
    });

    describe("GET: " + url + '/nodes/:id/children', function() {
        it('should return a 401 because user is not authenticated', function(done) {
            request(url)
                .get('/node/' + testNodeId + "/children")
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(401);
                    done();
                });
        });

        it('a reader with all valid permissions should get a node object back with a full collection of child nodes', function(done) {
            request(url)
                .get('/node/' + testNodeId + "/children")
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + globalReaderToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    res.body.length.should.equal(10);
                    done();
                });
        });

        it('should return a 403 because user does not have permissions to access this node', function(done) {
            request(url)
                .get('/node/' + testLockedDownNodeId + "/children")
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
                .get('/node/' + testNodeId + "/children")
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + restrictedEditorToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    res.body.length.should.equal(9);
                    done();
                });
        });

        it('should return list of root level child nodes', function(done) {
            request(url)
                .get('/node/0/children')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + globalEditorToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    res.body.length.should.equal(3);
                    done();
                });
        });
    });

    describe("POST: " + url + '/node/:id/assets', function() {
        it('an editor with all valid permissions should be able to post an attachment to a node.', function(done) {

            request(url)
                .post('/node/' + testNodeId + "/assets")
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + globalEditorToken)
                .attach("file", "./test/fixtures/artwork.png")
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    res.body.message.should.equal("Success");
                    done();
                });
        });

        it('post test fixtures', function(done) {
            function upload(file, next){
                request(url)
                    .post('/node/' + testNodeIdRoot_generated + "/assets")
                    .set('Accept', 'application/json')
                    .set('Accept-Language', 'en_US')
                    .set('authorization', 'Token ' + globalEditorToken)
                    .attach("file", file)
                    .end(function(err, res) {
                        if (err) { throw err; }
                        next();
                    });
            }

            async.each([
                "./test/fixtures/artwork.png",
                "./test/fixtures/36.png",
                "./test/fixtures/48.png",
                "./test/fixtures/72.png",
                "./test/fixtures/96.png"
            ], upload, function(){done()});

        });
    });

    ///////////////////////////////////////////////////////
    describe("POST: " + url + '/node/:id/assets/rename', function() {
        it('should rename an asset to a new name in the same node.', function(done) {
            request(url)
                .post('/node/' + testNodeId + "/assets/rename")
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + globalEditorToken)
                .send({
                    original: "artwork.png",
                    updated: "testimage.png"
                })
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    res.body.message.should.equal("Success");
                    done();
                });
        });

        it('should fail because asset does not exist.', function(done) {
            request(url)
                .post('/node/' + testNodeId + "/assets/rename")
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + globalEditorToken)
                .send({
                    original: "artwork_doesntexist.png",
                    updated: "testimage.png"
                })
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(500);
                    done();
                });
        });

        it('should fail because the user does not have permissions.', function(done) {
            request(url)
                .post('/node/' + testNodeId + "/assets/rename")
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + globalReaderToken)
                .send({
                    original: "artwork.png",
                    updated: "testimage.png"
                })
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(403);
                    done();
                });
        });
    });

    describe("POST: " + url + '/node/:id/assets/copy', function() {
        it('should copy an asset from one node to another.', function(done) {

            request(url)
                .post('/node/' + testNodeId + "/assets/copy")
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + globalEditorToken)
                .send({
                    newnodeid: "5246e73d56c02c0744000001",
                    filename: "testimage.png"
                })
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    res.body.message.should.equal("Success");
                    done();
                });
        });

    });

    describe("GET: " + url + '/node/:nodeid/assets/:filename', function() {
        it('should get a file from a node specified by the filename.', function(done) {

            request(url)
                .get('/node/' + testNodeId + '/assets/testimage.png')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + globalEditorToken)
                .send()
                .end(function(err, res) {
                    if (err) { throw err; }
                    path.basename(res.body.url).should.equal('testimage.png');
                    done();
                });
        });

        it('should return a 404 when it could not find the file.', function(done) {

            request(url)
                .get('/node/' + testNodeId + '/assets/gobledigook.png')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + globalEditorToken)
                .send()
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(404);
                    done();
                });
        });
    });


    /*
    describe("POST: " + url + '/node/:id/assets/move', function() {
        it('should move one asset to another node.', function(done) {

            request(url)
                .post('/node/' + testNodeId + "/assets/move")
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + globalEditorToken)
                .send({
                    newnodeid: "",
                    filename: ""
                })
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    res.body.message.should.equal("Success");
                    done();
                });
        });

        it('should fail because the user does not have permissions on the new node id.', function(done) {
            done();
        });

        it('should succeed when a user that is a reader but had editor rights on a specific node.', function(done) {
            done();
        });
    });
*/

   /* describe("DELETE: " + url + '/node/:id/assets/:name', function() {
        it('should delete an asset with a specific name', function(done) {

            request(url)
                .del('/node/' + testNodeId + "/assets/" + testNodeId)
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + globalEditorToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    res.body.message.should.equal("Success");
                    done();
                });
        });

        it('should fail because the user does not have permissions.', function(done) {
            done();
        });

        it('should succeed when a user that is a reader but had editor rights on a specific node.', function(done) {
            done();
        });
    });
    */
    describe("DELETE: " + url + '/node/:id/assets', function() {
        it('should delete all files in a node.', function(done) {

            request(url)
                .post('/node/' + testNodeId + "/assets")
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + globalEditorToken)
                .attach("file", "./test/fixtures/assetfordeletion.png")
                .end(function(err, res) {
                    if (err) { throw err; }

                    request(url)
                        .del('/node/' + testNodeId + "/assets/assetfordeletion.png")
                        .set('Accept', 'application/json')
                        .set('Accept-Language', 'en_US')
                        .set('authorization', 'Token ' + globalEditorToken)
                        .end(function(err, res) {
                            if (err) { throw err; }
                            res.status.should.equal(200);
                            res.body.message.should.equal("Success");
                            done();
                        });
                });


        });

        it('should fail because the user does not have permissions.', function(done) {
            done();
        });

        it('should succeed when a user that is a reader but had editor rights on a specific node.', function(done) {
            done();
        });
    });
////////////////////////////////////////////////////////
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

        it('an editor should return a DEEP list of files in a node and it\'s children', function(done) {
            request(url)
                .get('/node/' + testNodeId + "/assets/deep")
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
                .get('/node/' + testNodeIdRoot_generated + "/assets/deep")
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
                .get('/node/' + testNodeWithNoSubNodes + "/assets/deep")
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
    });

    describe("DELETE: " + url + '/node/:id', function() {

        it('Should delete an node.', function(done) {
            request(url)
                .del('/node/' + testNodeIdRoot_generated)
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + globalEditorToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    done();
                });
        });

        it('Should delete a generated node.', function(done) {
            request(url)
                .del('/node/' + testNodeIdSubSub_generated)
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

});