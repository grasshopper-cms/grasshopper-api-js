'use strict';

module.exports = function deactivate() {
    console.log(`Called deactivate on the ${require('./config').title} plugin`);
};