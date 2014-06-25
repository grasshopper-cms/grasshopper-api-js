'use strict';
var request = require('supertest'),
    async = require('async');

require('chai').should();

describe('api.system', function(){
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

    describe(url + '/system', function() {
        it('should return a response from system because our token is valid', function(done) {

            request(url)
                .get('/system')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .set('authorization', 'Token ' + globalReaderToken)
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(200);
                    res.body.components.length.should.be.greaterThan(0);
                    done();
                });
        });
        it('should receive a 401 because we are not authorized.', function(done) {

            request(url)
                .get('/system')
                .set('Accept', 'application/json')
                .set('Accept-Language', 'en_US')
                .end(function(err, res) {
                    if (err) { throw err; }
                    res.status.should.equal(401);
                    done();
                });
        });
    });
});