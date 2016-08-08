'use strict';

module.exports = function renderPluginsView(request, response) {
    response.render(require.resolve('./template.pug'), response.locals);
};
