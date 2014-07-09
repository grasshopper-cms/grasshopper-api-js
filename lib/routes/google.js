/**
 * The google api module is responsible for all google operations.
 */
module.exports = function(app){
    'use strict';

    var google = {},
        grasshopper = require('grasshopper-core'),
        config = require('../config'),
        redirectUrl = config.identities.google.redirectUrl || 'defaultRoute',
        bridgetown = require('bridgetown-api'),
        Response = bridgetown.Response;

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

    /**
     * Method will return a google auth url.
     */
    google.url = function(httpRequest, httpResponse) {
        var response = new Response(httpResponse);

        grasshopper.googleAuthUrl()
            .then(function(url) {
                response.writeSuccess(url);
            })
            .fail(function(message) {
                var err = {
                    code : 400,
                    message : message
                };

                response.writeError(err);
            })
            .done();
    };

    //Setup Routes for included functions
    app.get('/oauth2callback', [google.oauth]);
    app.get('/googleurl', [google.url]);

    return google;
};