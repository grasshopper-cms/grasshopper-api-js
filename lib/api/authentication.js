/**
 * The authenticate module is responsible to getting the authorization header from the request and attaching
 * the token to the request. If the credentials are not supplied then the request should fail and not proceed
 * any further.
 *
 * @param req HTTP Request
 * @param res HTTP Response
 * @param next Callback
 */
var authenticate = function(req, res, next){
    var Strings = require('../strings'),
        Response = require('./response'),
        tokens = require('../entities/tokens'),
        strings = new Strings('en'),
        response = new Response(res),
        authHeader = req.headers['authorization'];

    function onGetToken(err, identity){
        if(err){
            response.write(response.STATUS_CODES.UNAUTHORIZED, strings.http[response.STATUS_CODES.UNAUTHORIZED]);
        }
        else {
            req.identity = identity;
            next();
        }
    }

    if(authHeader){
        var token = authHeader.split(/\s+/).pop()||''
            id = new Buffer(token, 'base64').toString();

        tokens.getById(id, onGetToken);
    }
    else {
        response.write(response.STATUS_CODES.UNAUTHORIZED, strings.group('errors').missing_credentials);
    }
};

module.exports = authenticate;