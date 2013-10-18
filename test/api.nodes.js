var should = require('chai').should();
var request = require('supertest');

describe('api.nodes', function(){
    var url = 'http://localhost:8080',

        globalAdminToken  = "",
        globalReaderToken = "",
        nodeReaderToken = "",
        globalEditorToken = "",
        nodeEditorToken = "",
        restrictedEditorToken = "";

    before(function(done){
        //[TODO] Load All tokens
    });

    describe("GET: " + url + '/node/:id', function() {
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
        it('an editor should return an existing node object', function(done) {
            false.should.equal(true);
            done();
        });
        it('a reader should return an existing node object', function(done) {
            false.should.equal(true);
            done();
        });
        it('should return 404 because test node id does not exist', function(done) {
            false.should.equal(true);
            done();
        });
    });

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
    });

    describe("GET: " + url + '/nodes/:parentNodeId/deep', function() {
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
    });

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
    });

    describe("GET: " + url + '/nodes/:parentNodeId/files', function() {
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

    describe("GET: " + url + '/nodes/:parentNodeId/files/deep', function() {
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

    describe("GET: " + url + '/nodes/files', function() {
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

    describe("GET: " + url + '/nodes/files/deep', function() {
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



    describe("POST: " + url + '/nodes', function() {

        it('should create a node without an error using correct verb.', function(done){
            false.should.equal(true);
            done();
        });

        it('should create a node without an error using correct verb. ', function(done){
            false.should.equal(true);
            done();
        });

        it('should return an error because we are missing a "label" field.', function(done){
            false.should.equal(true);
            done();
        });

        it('should return error if a node id is sent with the request (maybe verb error).', function(done){
            false.should.equal(true);
            done();
        });

        it('should return error when a malformed slug is passed in (id has a space).', function(done){
            false.should.equal(true);
            done();
        });


        it('should return error when a field has a duplicate slug', function(done){
            false.should.equal(true);
            done();
        });

        it('should return error when a malformed node object is sent in (should validate against content type) -- NEED MORE SPECIFIC CASES', function(done){
            false.should.equal(true);
            done();
        });

        it('should return error when a reader tries to create a node', function(done){
            false.should.equal(true);
            done();
        });

        it('should return error when a editor does not have rights to a node and tries to create a node.', function(done){
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
    });
});