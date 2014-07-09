'use strict';
var request = require('supertest'),
    should = require('chai').should();

describe('api.users', function(){
    var url = require('./config/test').url;

    describe('Google Routes', function() {

        describe('get url', function() {

            it('should return a google url', function(done) {
                request(url)
                    .get('/googleurl')
                    .set('Accept', 'application/json')
                    .set('Accept-Language', 'en_US')
                    .set('authorization', 'Basic '+ new Buffer('apitestuseradmin:TestPassword').toString('base64'))
                    .end(function(err, res) {
                        should.not.exist(err);
                        res.body.should.be.a.string;
                        res.body.should.equal('https://accounts.google.com/o/oauth2/auth?access_type=offline&scope=' +
                            'https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile%20https%3A%2F%2Fwww.' +
                            'googleapis.com%2Fauth%2Fuserinfo.email&response_type=code&client_id=123AppId123&redirect' +
                            '_uri=http%3A%2F%2Flocalhost%3A3000%2Foauth2callback');
                        done();
                    });
            });
        });
    });

});