module.exports = function(grunt) {
    'use strict';
    var _ = grunt.util._,
        art = grunt.file.read('test/fixtures/artwork.png'),
        prefix = 'lib/public/',
        dirs,
        files = [
            'artwork.png',
            'testimage.png'
        ],
        ids = require('./fixtures/mongodb/db/test/ids');
    grunt.registerTask('generatePublicTest', function() {
        _.each(files, function(theFile) {
            _.each(ids, function(theId) {
                grunt.file.write(prefix + '/' + theId + '/' + theFile, art);
            })
        });
    });
    grunt.registerTask('deletePublicTest', function() {
            _.each(ids, function(theId) {
                grunt.file.delete(prefix + '/' + theId);
            })
    });
}