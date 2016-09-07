define(['jquery', 'constants', 'base64', 'masseuse', 'helpers'], function ($, constants, base64, masseuse, helpers) {
    'use strict';

    var LocalStorage = helpers.localStorage;
    return {
        getToken : function (username, password) {
            return $.ajax({
                dataType : 'json',
                url : constants.api.login.url,
                type : 'GET',
                headers : {'Authorization' : 'Basic ' + base64.encode(username + ':' + password)}
            });
        },
        unAuthenticatedRequest : function(url) {
            return $.ajax({
                dataType : 'json',
                url : url,
                type : 'GET'
            });
        },
        authenticatedRequest : function (url) {
            var token = LocalStorage.get('authToken');
            return $.ajax({
                dataType : 'json',
                url : url,
                type : 'GET',
                headers : {'Authorization' : token}
            });
        },

        unlinkGoogle : function(userId) {
            return this.post(constants.api.unlinkGoogle.url.replace(':id', userId), {key: 'google'});
        },
        getUsers : function () {
            return this.authenticatedRequest(constants.api.users.url);
        },
        getVersion : function () {
            return this.authenticatedRequest(constants.api.version.url);
        },
        getContentTypes : function () {
            return this.authenticatedRequest(constants.api.contentTypes.url);
        },
        getContentType : function(id) {
            return this.authenticatedRequest(constants.api.contentTypes.url +'/'+ id);
        },
        getContentDetail : function(id) {
            return this.authenticatedRequest(constants.api.content.url +'/'+ id);
        },
        getNodeDetail : function (nodeId) {
            return this.authenticatedRequest(constants.api.node.url + '/' + nodeId);
        },
        getNodesChildren : function (nodeId) {
            return this.authenticatedRequest(constants.api.nodesChildren.url.replace(':id', nodeId));
        },
        getNodesContent : function(nodeId) {
            return this.authenticatedRequest(constants.api.nodesContent.url.replace(':id', nodeId));
        },
        getNodesDeep : function(nodeId) {
            return this.authenticatedRequest(constants.api.nodesChildrenDeep.url.replace(':id', nodeId));
        },
        getGoogleUrl : function() {
            return this.unAuthenticatedRequest(constants.api.google.url);
        },
        authenticateToken : function () {
            return this.authenticatedRequest(constants.api.user.url);
        },
        removeAuthToken : function () {
            return this.authenticatedRequest(constants.api.logout.url);
        },
        post : function (url, data) {
            var token = LocalStorage.get('authToken');
            return $.ajax({
                dataType : 'json',
                contentType : 'application/json; charset=utf-8',
                url : url,
                type : 'POST',
                data : JSON.stringify(data),
                headers : {'Authorization' : token}
            });
        },
        /* This is move or copy. */
        moveContent: function (data) {
            return this.post(constants.api.moveNode.url, data);
        },
        moveAsset: function( data){
            return this.post(constants.api.moveAsset.url.replace(':id',data.nodeid), data);
        },
        copyAsset: function(data){
            return this.post(constants.api.copyAsset.url.replace(':id',data.nodeid), data);
        },
        makeQuery : function (data) {
            return this.post(constants.api.contentQuery.url, data);
        },
        makeUsersQuery : function (data) {
            return this.post(constants.api.usersQuery.url, data);
        },
        postFolder : function (data) {
            return this.post(constants.api.node.url, data);
        },
        renameAsset : function (url, originalName, newName) {
            return this.post(url + '/rename', {
                original : originalName,
                updated : newName
            });
        },
        getContentByContentType : function(contentTypeId) {
            return this.makeQuery(
                {
                    nodes : [],
                    types : [contentTypeId],
                    filters : []
                });
        }
    };

});
