var resp = function(httpResponse){
    "use strict";

    var CONTENT_TYPE = 'application/json';

    this.STATUS_CODES = {
        SUCCESS: 200,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        REQUEST_TIMEOUT: 408,
        SERVER_ERROR: 500,
        BAD_GATEWAY: 502,
        SERVICE_UNAVAILABLE: 503
    };

    this.writeFromPromise = function(promise){
        var self = this;

        promise.then(function(obj){
                self.writeSuccess(obj);
            }).fail(function(err){
                self.writeError(err);
            });
    };

    this.writeSuccess = function(obj){
        var val = (!obj) ? "" : obj;
        this.write(this.STATUS_CODES.SUCCESS, JSON.stringify(val));
    };

    this.writeError = function(err){
        var code = (err.message.indexOf('[404]') > -1) ? this.STATUS_CODES.NOT_FOUND : this.STATUS_CODES.SERVER_ERROR;
        this.write(code, JSON.stringify({message: err.message}));
    };

    this.write = function(responseCode, responseData){
        httpResponse.writeHead(responseCode, { 'Content-Type': CONTENT_TYPE });
        httpResponse.write(responseData);
        httpResponse.end();
    };
};

module.exports = resp;