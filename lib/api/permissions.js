/**
 * Every api method and call can be protected by setting a minimum permission level on it. These lookup values
 * are used to ensure readers don't update user accounts, etc.
 *
 * @type {{ADMIN: number, EDITOR: number, AUTHOR: number, READER: number, NONE: number}}
 */
var permissions = function() {
    var Strings = require('../strings'),
        Response = require('./response'),
        strings = new Strings('en'),
        AVAILABLE_PRIVILEGES = {
            ADMIN: 0,
            EDITOR: 1,
            AUTHOR: 2,
            READER: 3,
            EXTERNAL: 3,
            NONE: 4
        };

    /**
     * Method should evaluate a current user's privileges and determine if the user can do something in the system.
     *
     * @param permissionLevel
     * @param req
     * @param res
     * @param next
     */
    function userHasPrivileges(permissionLevel, req, res, next) {
        var response = new Response(res),
            userPrivLevel = AVAILABLE_PRIVILEGES[req.identity.profile.role.toUpperCase()],
            isValid = (userPrivLevel <= parseInt(permissionLevel, 10));

        if(!isValid){
            response.write(response.STATUS_CODES.FORBIDDEN, strings.group('errors').user_privileges_exceeded);
        }
        else {
            next();
        }
    }

    this.requireAdmin = function(req, res, next){
        userHasPrivileges(AVAILABLE_PRIVILEGES.ADMIN, req, res, next);
    };

    this.requireEditor = function(req, res, next){
        userHasPrivileges(AVAILABLE_PRIVILEGES.EDITOR, req, res, next);
    };

    this.requireAuthor = function(req, res, next){
        userHasPrivileges(AVAILABLE_PRIVILEGES.AUTHOR, req, res, next);
    };

    this.requireReader = function(req, res, next){
        userHasPrivileges(AVAILABLE_PRIVILEGES.READER, req, res, next);
    };
};

module.exports = permissions;