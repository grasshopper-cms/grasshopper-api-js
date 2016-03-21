'use strict';

var jade = require('jade');

module.exports = route;

function route(router) {
    router.route('/admin/items*')
        .get(function (req, res, next) {
            console.log('ITEMS');
            res.send(jade.compileFile(require.resolve('./index.jade'), {
                pretty : true
            })());
        });
}