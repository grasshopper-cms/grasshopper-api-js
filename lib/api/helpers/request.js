module.exports = function(){
    "use strict";

    this.DEFAULT ={
        PAGE_SIZE: 20,
        PAGE_SKIP_SIZE: 0
    };

    function is_int(value){
        return ((parseFloat(value) == parseInt(value)) && !isNaN(value));
    }


    this.getListPageSize = function (req){
        return (req.query.limit != null && is_int(req.query.limit)) ? req.query.limit : this.DEFAULT.PAGE_SIZE;
    };

    this.getListSkipSize = function (req){
        return (req.query.skip != null && is_int(req.query.skip)) ? req.query.skip : this.DEFAULT.PAGE_SKIP_SIZE;
    };
};