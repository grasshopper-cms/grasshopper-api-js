'use strict';

module.exports = {
    get : getMiddleware
};

function getMiddleware(request, response) {
    response.render(require.resolve('./template.pug'), response.locals);
}