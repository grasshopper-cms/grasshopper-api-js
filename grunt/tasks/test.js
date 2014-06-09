'use strict';
module.exports = function (grunt) {
    grunt.registerTask('test', ['jshint', 'shell:testSetup', 'shell:testRun']);
};