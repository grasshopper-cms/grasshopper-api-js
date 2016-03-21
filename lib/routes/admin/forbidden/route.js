'use strict';

var jade = require('jade');

module.exports = route;

function route(router) {
    router.route('/admin/forbidden*')
        .get(function (req, res, next) {
            res.send(jade.compileFile(require.resolve('./index.jade'), {
                pretty : true
            })());
        });
}