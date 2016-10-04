'use strict';

var riot = require('riot');
var gh = window.gh;

// require() all files in the tag folder
// NOTE: need to do this, or else mounting the app tag will not mount the child tags
var context = require.context('./tags');
context.keys().forEach((key) => {
    context(key);
});

riot.mount('tabs-bar', { appState : gh.appState, location : gh.util.location, routeMatchesPath : gh.util.routeMatchesPath });