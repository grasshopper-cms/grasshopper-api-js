var Permissions = require('./usersecurity'),
    permissions = new Permissions();

module.exports = function(){
    "use strict";

    var bridgetown = require('bridgetown-api'),
        middleware = bridgetown.middleware;

    this.middleware = [];

    this.add = function(middleware){
        this.middleware.push(middleware);
        return this;
    };

    this.secure = function(security){
        this.middleware.push(middleware.authorization);
        this.middleware.push(middleware.authToken);
        if(security){
            this.middleware.push(security);
        }
        return this;
    };

    return this;
};

module.exports.security = {
    admin: permissions.requireAdmin,
    adminOrSelf: permissions.requireAdminOrSelf,
    editor: permissions.requireEditor,
    author: permissions.requireAuthor,
    reader: permissions.requireReader
};