/**
 * The google api module is responsible for all google operations.
 */
module.exports = function(app){
    'use strict';

    var _ = require('lodash'),
        grasshopper = require('grasshopper-core');

    //Setup Routes for included functions
    app.get('/connect/facebook/done', function(req, res){
        var code = req.query.access_token,
            redirectUrl = _.has(grasshopper.config.identities, 'facebook') ? grasshopper.config.identities.facebook.redirectUrl : 'defaultRoute';

        grasshopper.auth('Facebook', { code: code })
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
