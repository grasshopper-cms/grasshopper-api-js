'use strict';

module.exports = {
    get : get
};

function get(request, response) {
    response.render(require.resolve('./admin.pug'), response.locals);
}