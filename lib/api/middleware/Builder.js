var UserSecurity = require('./UserSecurity'),
    NodeSecurity = require('./NodeSecurity'),
    userSecturity = new UserSecurity(),
    nodeSecurity = new NodeSecurity();

module.exports = function(){
    "use strict";

    var bridgetown = require('bridgetown-api'),
        setHeaders = require('./setHeaders'),
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

module.exports.user = {};
module.exports.node = {};

module.exports.user.required = {
    admin: userSecturity.requireAdmin,
    adminOrSelf: userSecturity.requireAdminOrSelf,
    editor: userSecturity.requireEditor,
    author: userSecturity.requireAuthor,
    reader: userSecturity.requireReader
};

module.exports.node.required = {
    admin: nodeSecurity.requireAdmin,
    editor: nodeSecurity.requireEditor,
    author: nodeSecurity.requireAuthor,
    reader: nodeSecurity.requireReader
};