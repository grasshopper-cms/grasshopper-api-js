'use strict';

var riot = require('riot');
var gh = window.gh;

// require() all files in the tag folder
// NOTE: need to do this, or else mounting the app tag will not mount the child tags
var context = require.context('./tags');
context.keys().forEach((key) => {
    context(key);
});

riot.mount('tabs-bar', { appState : gh.appState });
riot.mount('loading-overlay', { appState : gh.appState });
riot.mount('masthead', { appState : gh.appState });
