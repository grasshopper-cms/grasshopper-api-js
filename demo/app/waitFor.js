'use strict';
const startup = require('./grasshopper/startup');

module.exports = waitFor;

function waitFor() {
    return startup();
}
