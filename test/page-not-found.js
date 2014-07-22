'use strict';
var request = require('supertest');

require('chai').should();

describe('page not found', function(){
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