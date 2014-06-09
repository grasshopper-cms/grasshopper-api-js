'use strict';
module.exports = function (grunt) {
    grunt.registerTask('server:start', ['shell:startServer']);
    grunt.registerTask('server:stop', ['shell:stopServer']);
    grunt.registerTask('server:restart', ['shell:restartServer']);
    grunt.registerTask('server:seed', ['shell:stopServer', 'mongodb:seed', 'shell:startSeedServer']);

    grunt.registerTask('seedServer', function() {
        grunt.log.subhead('Deprecated: please use "grunt server:seed"');
    });
};