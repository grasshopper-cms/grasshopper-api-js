/*
 The crud mixin for the mongo database layer is used for all of the functionality that is going to be shared between
 all connections.
 */
"use strict";

module.exports = {
        privateFields: [],
        /**
         * Build string variable that can be sent to mongo query to include or exclude fields in the response. Your
         * implementation module should set "privateFields" so that we can use the parameter here.
         *
         * @param options Query options object
         * @returns {string}
         */
        buildIncludes: function(options){
            var include = "";

            if(options && options.include != null && options.include instanceof Array){
                include = options.include.join(" ");
            }
            if(options && options.exclude != null && options.exclude instanceof Array){
                include += "-" + options.exclude.join(" -");
            }
            if(this.privateFields != null && this.privateFields instanceof Array){
                include += "-" + this.privateFields.join(" -");
            }

            return include;
        }
};