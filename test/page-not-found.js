'use strict';
var request = require('supertest'),
    env = require('./config/environment')();

require('chai').should();

describe('page not found', function(){

    before(function(done){

        //run shell command to setup the db
        var exec = require('child_process').execSync;
        exec('./tasks/importdb.sh');

        var grasshopper = require('../lib/grasshopper-api')(env);

        grasshopper.core.event.channel('/system/db').on('start', function() {
            done();
        });
    });

    var url = require('./config/test').url;


    it('should return a 404 for a non existent endpoint', function(done) {
        request(url)
            .get('/something-made-up')
            .set('Accept', 'application/json')
            .set('Accept-Language', 'en_US')
            .end(function(err, res) {
                res.status.should.equal(404);
                done(err);
            });
    });

});
