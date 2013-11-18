var resp = function(){
    var CONTENT_TYPE = 'application/json',
        self = this;

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

    /**
     * The write callback method will be used to write out the response from a db call and wrap it in a JSON
     * response. It is important to "bind" to the HTTP response object from the route that is using this method.
     *
     * @param err
     * @param obj
     */
    this.writeCallback = function(err, obj){
        var val = (!obj) ? "" : obj;

        if(err){
            var code = (err.message.indexOf('[404]') > -1) ? self.STATUS_CODES.NOT_FOUND : self.STATUS_CODES.SERVER_ERROR;
            self.write(code, JSON.stringify({message: err.message}), this);
        }
        else {
            self.write(self.STATUS_CODES.SUCCESS, JSON.stringify(val), this);
        }
    };

    /**
     * Utility method that will write the response to the client.
     * @param responseCode HTTP status code
     * @param responseData JSON object response.
     * @param res
     */
    this.write = function(responseCode, responseData, res){
        res.writeHead(responseCode, { 'Content-Type': CONTENT_TYPE });
        res.write(responseData);
        res.end();
    };
};

module.exports = resp;