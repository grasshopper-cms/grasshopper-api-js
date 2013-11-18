var should = require('chai').should();
var request = require('supertest');

describe('api.contentTypes', function(){
    var url = 'http://localhost:8080',
        async = require('async'),
        testContentId  = "5261781556c02c072a000007",
        globalAdminToken  = "",
        globalReaderToken = "",
        globalEditorToken = "",
        nodeEditorToken = "",
        restrictedEditorToken = "";

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
                .set('authorization', 'Token ' + globalAdminToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    done();
                });
        });

    });
});