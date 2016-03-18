define(['paginatedCollection', 'resources', 'constants',
    'userDetail/model', 'api'],
    function (PaginatedCollection, resources, constants,
              userDetailViewModel, api) {

    'use strict';

    return PaginatedCollection.extend({
        model : userDetailViewModel,
        url : function() {
            return constants.api.users.url;
        },
        comparator: function(modelA, modelB) {
            return modelA.get('fullname').toLowerCase().localeCompare(modelB.get('fullname').toLowerCase());
        },
        limit : parseInt(constants.pagination.defaultLimit, 10 ),
        skip : parseInt(constants.pagination.defaultSkip, 10 ),
        filtersKey : ['firstname', 'lastname', 'email', 'displayname'],
        queryRequest : api.makeUsersQuery,

        sortByNameAscending : sortByNameAscending,
        sortByNameDescending : sortByNameDescending,
        sortByDisplayNameAscending : sortByDisplayNameAscending,
        sortByDisplayNameDescending : sortByDisplayNameDescending,
        sortByRoleAscending : sortByRoleAscending,
        sortByRoleDescending : sortByRoleDescending,
        sortByEmailAscending : sortByEmailAscending,
        sortByEmailDescending : sortByEmailDescending
    });

    function sortByNameAscending() {
        this.comparator = function(modelA, modelB) {
            return modelA.get('fullname').toLowerCase().localeCompare(modelB.get('fullname').toLowerCase());
        };
        this.sort();
    }

    function sortByNameDescending() {
        this.comparator = function(modelA, modelB) {
            return modelB.get('fullname').toLowerCase().localeCompare(modelA.get('fullname').toLowerCase());
        };
        this.sort();
    }

    function sortByDisplayNameAscending() {
        this.comparator = function(modelA, modelB) {
            return modelA.get('displayname').toLowerCase().localeCompare(modelB.get('displayname').toLowerCase());
        };
        this.sort();
    }

    function sortByDisplayNameDescending() {
        this.comparator = function(modelA, modelB) {
            return modelB.get('displayname').toLowerCase().localeCompare(modelA.get('displayname').toLowerCase());
        };
        this.sort();
    }

    function sortByRoleAscending() {
        this.comparator = function(modelA, modelB) {
            return modelA.get('role').toLowerCase().localeCompare(modelB.get('role').toLowerCase());
        };
        this.sort();
    }

    function sortByRoleDescending() {
        this.comparator = function(modelA, modelB) {
            return modelB.get('role').toLowerCase().localeCompare(modelA.get('role').toLowerCase());
        };
        this.sort();
    }

    function sortByEmailAscending() {
        this.comparator = function(modelA, modelB) {
            return modelA.get('email').toLowerCase().localeCompare(modelB.get('email').toLowerCase());
        };
        this.sort();
    }

    function sortByEmailDescending() {
        this.comparator = function(modelA, modelB) {
            return modelB.get('email').toLowerCase().localeCompare(modelA.get('email').toLowerCase());
        };
        this.sort();
    }

});
