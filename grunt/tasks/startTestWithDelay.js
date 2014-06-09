'use strict';
module.exports = function(grunt) {

    grunt.registerTask('startTestWithDelay', function(delay) {
        var done = this.async();
        setTimeout(function() {
            grunt.task.run(['shell:makeTest']);
            done();
        }, delay);
    });
};