'use strict';

module.exports = function populateNecessaryAdminData(request, response, next) {
    response.locals.appState = {};
    response.locals.homeString = 'Yeah.';

    next();
};