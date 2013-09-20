var should = require('chai').should();
var request = require('supertest');

describe('api.token', function(){
    var url = 'http://localhost:8080';

    /*
    1) Test that you can auth with
     */
    describe(url + '/token', function() {
        it('should return a valid access token', function(done) {

            request(url)
                .get('/token')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', new Buffer('apitestuser:TestPassword').toString('base64'))
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    done();
                });
        });
        it('should return a invalid access token (real user, bad password)', function(done) {

            request(url)
                .get('/token')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', new Buffer('apitestuser:Tesword').toString('base64'))
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(401);
                    done();
                });
        });
        it('should return a invalid access token (bad user)', function(done) {

            request(url)
                .get('/token')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', new Buffer('apiteser:TestPassword').toString('base64'))
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(401);
                    done();
                });
        });
        it('should return a invalid access token (missing auth header)', function(done) {

            request(url)
                .get('/token')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(401);
                    done();
                });
        });
        it('should return a invalid access token (badly formatted auth header.)', function(done) {

            request(url)
                .get('/token')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', new Buffer('apiteserestPassword').toString('base64'))
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(401);
                    done();
                });
        });
    });
});