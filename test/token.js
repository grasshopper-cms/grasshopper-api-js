'use strict';
var request = require('supertest'),
    async = require('async');

require('chai').should();

describe('api.token', function(){
    var url = require('./config/test').url,
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

    describe(url + '/token', function() {
        it('should return a valid access token', function(done) {

            request(url)
                .get('/token')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Basic ' + new Buffer('admin:TestPassword').toString('base64'))
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

    describe(url + '/token/new', function() {
        it('should return a valid access token', function(done) {

            request(url)
                .get('/token/new')
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

    describe(url + '/token/logout', function() {
        it('should delete a token of the currently logged in user.', function(done) {

            request(url)
                .get('/token/logout')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + globalReaderToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);

                    request(url)
                        .get('/token/new')
                        .set('Accept', 'application/json')
                        .set('Accept-Language', 'en_US')
                        .set('authorization', 'Token ' + globalReaderToken)
                        .end(function(err, res) {
                            if (err) { throw err; }
                            res.status.should.equal(401);
                            done();
                        });

                });
        });
    });
});