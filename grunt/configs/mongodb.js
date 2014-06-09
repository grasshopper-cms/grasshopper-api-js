'use strict';
module.exports = function(grunt) {

    grunt.config('mongodb', {
        test: {
            host: 'mongodb://localhost:27017/test',
            collections: ['users','contenttypes','nodes','content', 'tokens'],
            data: './fixtures/mongodb/test.js'
        },
        seed: {
            host: 'mongodb://localhost:27017/grasshopper',
            collections: ['users','contenttypes','tokens'],
            data: './fixtures/mongodb/test.js'
        },
        dev : {
            host: 'mongodb://localhost:27017/grasshopper',
            collections: ['users','contenttypes','nodes','content', 'tokens'],
            data: './fixtures/mongodb/dev.js'
        },
        heroku: {
            host: '',
            collections: ['users','contenttypes','nodes','content', 'tokens'],
            data: './fixtures/mongodb/test.js'
        }
    });
};