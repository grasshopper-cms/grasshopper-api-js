/**
 * The google api module is responsible for all google operations.
 */
module.exports = function(app){
    'use strict';

    var _ = require('underscore'),
        bridgetown = require('bridgetown-api'),
        grasshopper = require('grasshopper-core'),
        Response = bridgetown.Response;

    //Setup Routes for included functions
    app.get('/oauth2callback', [oauth]);
    app.get('/googleurl', [url]);

    return {
        oauth : oauth,
        url : url
    };

    /**
     * Method will accept the oauth callback from google, run authentication, then redirect the user to the page that accepts the token.
     */
    function oauth(httpRequest, httpResponse){
        var code = httpRequest.query.code,
            redirectUrl = _.has(grasshopper.config.identities, 'google') ? grasshopper.config.identities.google.redirectUrl : 'defaultRoute';


        grasshopper.auth('Google', { code: code })
            .then(function(token) {
                httpResponse.redirect(redirectUrl+'/'+ new Buffer(token).toString('base64'));
            })
            .fail(function(err){
                httpResponse.redirect(redirectUrl+'/error='+ err.message);
            });
    }

    /**
     * Method will return a google auth url.
     */
    function url(httpRequest, httpResponse) {
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
    }

};