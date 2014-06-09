'use strict';
module.exports = function(grunt) {

    grunt.config('jshint', {
        files: [
            'Gruntfile.js',
            'grunt/**/*.js',
            'lib/**/*.js',
            'test/**/*.js'
        ],
        options: {
            jshintrc: '.jshintrc'
        }
    });
};