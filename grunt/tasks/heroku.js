'use strict';
module.exports = function (grunt) {
    grunt.registerTask('heroku:db:seed', 'Task that grabs heroku db credentials', function () {
        grunt.task.run("shell:getHerokuDbConnection");
    });

};