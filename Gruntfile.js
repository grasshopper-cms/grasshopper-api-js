module.exports = function(grunt) {

    'use strict';

    grunt.initConfig({
        portToUse : 3000,
        pm2pid : 0,
        pkg : grunt.file.readJSON('package.json'),
        heroku : {
            options : {}
        }
    });

    grunt.loadTasks('grunt/configs');
    grunt.loadTasks('grunt/tasks');

    // TODO: move these to grunt/tasks and move tasks/fixtures up one
    grunt.loadTasks('tasks');

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
};
