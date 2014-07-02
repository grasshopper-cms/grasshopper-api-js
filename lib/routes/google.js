/**
 * The token api module is responsible for creating an access token to use the API.
 */
module.exports = function(app){
    'use strict';

    var google = {},
        grasshopper = require('grasshopper-core'),
        config = require('../config'),
        redirectUrl = config.identities.google.redirectUrl;

    /**
     * Method will accept the oauth callback from google, run authentication, then redirect the user to the page that accepts the token.
     */
    google.oauth = function(httpRequest, httpResponse){
        var code = httpRequest.query.code;

        grasshopper.auth('Google', { code: code })
            .then(function(token) {
                httpResponse.redirect(redirectUrl+'/'+ new Buffer(token).toString('base64'));
            });
    };

    //Setup Routes for included functions
    app.get('/oauth2callback', [google.oauth]);

    return google;
};