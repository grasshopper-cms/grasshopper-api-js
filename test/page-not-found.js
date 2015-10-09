'use strict';
var request = require('supertest'),
    exec = require('child_process').execSync,
    url = require('./config/test').url,
    start = require('./_start');

require('chai').should();

describe('page not found', function(){

    before(function(done){
        exec('./tasks/importdb.sh');
        this.timeout(10000);
        start()
            .then(function(){
                done();
            });
    });

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
