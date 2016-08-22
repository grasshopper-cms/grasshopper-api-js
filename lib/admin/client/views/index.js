'use strict';

module.exports = {
    renderLoginView : renderLoginView
};

function renderLoginView(request, response) {
    response.render(require.resolve('./login.pug'), response.locals);
}