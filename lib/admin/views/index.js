'use strict';

module.exports = {
    renderOldAdmin : renderOldAdmin
};

function renderOldAdmin(request, response) {
    response.render(require.resolve('./oldAdmin/view.pug'), response.locals);
}