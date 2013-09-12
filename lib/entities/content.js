module.exports = function(app){
    "use strict";

    var content = {};

    content.getRandomContent = function(params){

    };

    /**
     * Initialize the content object with a configuration
     * @param config Object that includes information that this object needs like contentid.
     */
    content.init = function(config){
        this.config = config;
    };

    return content;
};