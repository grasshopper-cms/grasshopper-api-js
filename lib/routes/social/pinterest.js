/**
 * The google api module is responsible for all google operations.
 */
module.exports = function(app){
    'use strict';

    var _ = require('lodash'),
        grasshopper = require('grasshopper-core'),
        querystring = require('querystring');

    //Setup Routes for included functions
    app.get('/connect/pinterest/done', function(req, res){
        var redirectUrl = _.has(grasshopper.config.identities, 'pinterest') ? grasshopper.config.identities.pinterest.redirectUrl : 'defaultRoute';

        grasshopper.auth('Pinterest', req.query)
            .then(function(token) {
                res.cookie('gh-token', new Buffer(token).toString('base64'));
                res.redirect(redirectUrl);
            })
            .catch(function(err){
                console.log(err);
                res.redirect(redirectUrl + '?error='+ err.message);
            });
    });
};
