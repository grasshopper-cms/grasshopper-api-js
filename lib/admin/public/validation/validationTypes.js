define([], function () {
    'use strict';

    return [
        'required',
        'alpha', // length, min, max
        'alpha_numeric', // length, min, max
        'number', // min, max
        'email', //	foundation@zurb.com
        'url'	, //http://zurb.com
        'date', //	YYYY-MM-DD
        'regex',
        'unique'
    ];

});
