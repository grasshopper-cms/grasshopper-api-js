module.exports = function(){
    'use strict';

    var multiparty = require('multiparty'),
        grasshopper = require('grasshopper-core'),
        q = require('q');

    this.DEFAULT = {
        PAGE_SIZE: grasshopper.config.db.defaultPageSize || 200,
        PAGE_SKIP_SIZE: 0
    };

    function is_int(value){
        return ((parseFloat(value) === parseInt(value, 10)) && !isNaN(value));
    }

    this.getListPageSize = function (req){
        return (req.query.limit !== null && is_int(req.query.limit)) ? req.query.limit : this.DEFAULT.PAGE_SIZE;
    };

    this.getListSkipSize = function (req){
        return (req.query.skip !== null && is_int(req.query.skip)) ? req.query.skip : this.DEFAULT.PAGE_SKIP_SIZE;
    };

    this.parseForm = function(req){
        var form = new multiparty.Form({
                autoFiles:true,
                maxFilesSize: grasshopper.config.server.maxFilesSize,
                maxFieldsSize: grasshopper.config.server.maxFieldsSize,
                maxFields: grasshopper.config.server.maxFields
            }),
            deferred = q.defer();

        form.on('error', function(err) {
            deferred.reject(err);
        });

        form.parse(req, function(err, fields, files) {
            if(err){
                deferred.reject(err);
            }
            else {
                deferred.resolve({
                    fields: fields,
                    files: files
                });
            }
        });

        return deferred.promise;
    };
};
