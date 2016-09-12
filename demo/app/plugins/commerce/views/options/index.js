'use strict';

// var BB = require('bluebird');

module.exports = {
    get : getMiddleware
};

function getMiddleware(request, response) {
    // BB.join(_getAllContentTypes(), )
    response.render(require.resolve('./template.pug'), response.locals);
}