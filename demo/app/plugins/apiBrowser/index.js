'use strict';

module.exports = {
    get : get
};


function get(request, response) {
    response.render(require.resolve('./template.pug'), response.locals);
}