'use strict';

module.exports = function renderSettingsView(request, response) {
    response.render(require.resolve('./template.pug'), response.locals);
};