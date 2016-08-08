'use strict';

const express = require('express');
const app = express();
const expressively = require('expressively');

expressively
    .start({
        express : express,
        baseDirectory : __dirname,
        verbose : true,
        app : app
    })
    .catch(function(error) {
        console.log('error', error);
        console.log(error.stack);
        process.exit(1);
    });