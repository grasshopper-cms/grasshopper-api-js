'use strict';
var request = require('supertest'),
    should = require('chai').should(),
    env = require('./config/environment')();

describe('api.users', function(){
    var url = require('./config/test').url;

    before(function(done){

        //run shell command to setup the db
        var exec = require('child_process').exec;
        exec('./tasks/importdb.sh', function (error, stdout, stderr) {
              console.log('stdout: ' + stdout);
              console.log('stderr: ' + stderr);
              if (error !== null) {
                console.log('exec error: ' + error);
              }
        });

        var grasshopper = require('../lib/grasshopper-api')(env);

        grasshopper.core.event.channel('/system/db').on('start', function() {
            done();
        });
    });

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
                        res.body.should.equal('https://accounts.google.com/o/oauth2/auth?access_type=offline&' +
                            'scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email&' +
                            'response_type=code&' +
                            'client_id=123AppId123&' +
                            'redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Foauth2callback');
                        done();
                    });
            });
        });
    });

});
