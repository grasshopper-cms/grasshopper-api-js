var should = require('chai').should();
var request = require('supertest');

describe('api.search', function(){
    var url = 'http://localhost:8080',
        async = require('async'),
        _ = require('underscore'),
        globalReaderToken = "";

    before(function(done){
        async.parallel(
            [
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
                }
            ],function(){
                done();
            }
        );
    });

    describe("POST: " + url + '/search', function() {
        var query = {
            nodes: "",
            types: ["524362aa56c02c0703000001"],
            filters: [{
                key: "slug",
                cmp: "=",
                value: "sample_confdstent_title"
            }],
            options: {}
        };

        it('should return 401 because trying to access unauthenticated', function(done) {
            request(url)
                .post('/search')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .send(query)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(401);
                    done();
                });
        });

        it('should search results', function(done) {
            request(url)
                .post('/search')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + globalReaderToken)
                .send(query)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    console.log(res.body);
                    done();
                });
        });

    });
});