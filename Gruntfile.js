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

    grunt.registerTask('readme', 'create README.md from template', function() {

        grunt.config.set('warning', 'Compiled file. Do not modify directly.');
        grunt.task.run(['shell:shortlog', 'releaseNotes']);
    });

    grunt.registerTask('startTestWithDelay', function(delay) {
        var done = this.async();
        setTimeout(function() {
            grunt.task.run(['shell:makeTest']);
            done();
        }, delay);
    });

    grunt.registerTask('exitTests', function() {
        grunt.fail.fatal("Shutting down... tests are done.");
    });

    grunt.loadTasks('tasks');
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.registerTask('dev',['nodemon:dev']);
    grunt.registerTask('test', ['jshint', 'shell:testSetup', 'shell:testRun']);

    grunt.registerTask('seedDev', ['mongodb:dev']);
    grunt.registerTask('heroku:db:seed', 'Task that will seed the heroku test database.', function () {
        grunt.task.run("shell:getHerokuDbConnection");
    });

    grunt.registerTask('server:start', ['shell:startServer']);
    grunt.registerTask('server:stop', ['shell:stopServer']);
    grunt.registerTask('server:restart', ['shell:restartServer']);
    grunt.registerTask('seedServer', ['shell:stopServer', 'mongodb:seed', 'shell:startSeedServer']);
    grunt.registerTask('default', ['jshint']);

    grunt.config.set('warning', 'Compiled file. Do not modify directly.');
    grunt.registerTask('readme', ['shell:shortlog', 'releaseNotes']);
};
