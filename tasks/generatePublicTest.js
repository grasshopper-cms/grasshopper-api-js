module.exports = function(grunt) {
    'use strict';
    grunt.registerTask('generatePublicTest', function() {
        var art = grunt.file.read('test/fixtures/artwork.png'),
            files = [
                'lib/public/5261781556c02c072a000007/artwork.png',
                'lib/public/5246e73d56c02c0744000001/testimage.png'
            ];
        grunt.util._.each(files, function(theFile) {
            if (! grunt.file.exists(theFile)) {
                grunt.file.write(theFile, art);
            }
        });
    });
}