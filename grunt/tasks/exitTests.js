'use strict';
module.exports = function (grunt) {

    grunt.registerTask('exitTests', function() {
        grunt.fail.fatal("Shutting down... tests are done.");
    });
};