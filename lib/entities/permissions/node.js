(function(){
    "use strict";

    var permissions = {},
        _ = require('underscore'),
        privileges = require('./privileges'),
        global = require('./global');

    /**
     * Method should evaluate a current user's privileges and determine if the user can do something in the system.
     *
     * @param permissionLevel
     * @param req
     * @param res
     * @param next
     */
    function allowed(nodeid, userPermissions, minPermissionLevel) {
        var isAllowed = _.find(userPermissions, function(permission){
            var userPrivLevel = privileges.available[permission.role.toUpperCase()];

            return (permission.nodeid.toString() === nodeid &&  (userPrivLevel <= parseInt(minPermissionLevel, 10)));
        });

        return (isAllowed != null);
    }

    function denied(nodeid, userPermissions, minPermissionLevel){
        var restriction = _.find(userPermissions, function(permission){
            var userPrivLevel = parseInt(privileges.available[permission.role.toUpperCase()], 10);

            return (permission.nodeid.toString() === nodeid &&  (userPrivLevel >= parseInt(minPermissionLevel, 10)));
        });

        return (restriction != null);
    }

    permissions.allowed = function(nodeid, userRole, userPermissions, minPermissionLevel){
        return (
            (global.allowed(userRole, minPermissionLevel) && !denied(nodeid, userPermissions, minPermissionLevel)) ||
                allowed(nodeid, userPermissions, minPermissionLevel)
            );
    };



    module.exports = permissions;
})();

