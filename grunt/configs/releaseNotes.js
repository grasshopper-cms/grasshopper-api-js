'use strict';
module.exports = function(grunt) {

    grunt.config('releaseNotes', {
        main : {
            src : 'templates/README.template.md',
            dest : 'README.md',
            baseLinkPath : 'https://github.com/Solid-Interactive/grasshopper-api-js/tree/master/'
        }
    });
};