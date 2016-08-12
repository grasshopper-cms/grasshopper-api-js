'use strict';

module.exports = {
    write : write
};

function write(message) {
    console.log('Grasshopper Admin Logs : '+ JSON.stringify(message));
}