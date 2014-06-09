'use strict';
module.exports = function(grunt) {

    grunt.registerTask('readme', 'create README.md from template', function() {

        grunt.config.set('warning', 'Compiled file. Do not modify directly.');
        grunt.task.run(['shell:shortlog', 'releaseNotes']);
    });
};