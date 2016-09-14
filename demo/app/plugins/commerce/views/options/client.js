'use strict';

var riot = require('riot');
var gh = window.gh;

require('./product-content-types.tag');
require('./content-type-keypath-select.tag');

riot.mount('product-content-types', { appState : gh.appState });