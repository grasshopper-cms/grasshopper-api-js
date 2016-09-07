/*global define:false*/
define(['jquery', 'underscore', 'grasshopperBaseView', 'userIndexViewConfig', 'constants', 'searchWorker'],
    function ($, _, GrasshopperBaseView, userIndexViewConfig, constants, searchWorker) {

        'use strict';

        return GrasshopperBaseView.extend({
            defaultOptions : userIndexViewConfig,
            beforeRender : beforeRender,
            addNewUser : addNewUser,
            searchContent : searchContent,
            toggleSortUsersByName : toggleSortUsersByName,
            toggleSortUsersByDisplayName : toggleSortUsersByDisplayName,
            toggleSortUsersByRole : toggleSortUsersByRole,
            toggleSortUsersByEmail : toggleSortUsersByEmail,
            exportAsCsv : exportAsCsv
        });

        function beforeRender ($deferred) {
            $.when(this.searchContent(undefined, undefined, true))
                .done($deferred.resolve);
        }

        function addNewUser() {
            this.app.router.navigateTrigger(constants.internalRoutes.addUser);
        }

        function searchContent(e, context, isFirstQuery) {
            return searchWorker.searchContent.call(this, e, context, 'users', true, isFirstQuery);
        }

        function toggleSortUsersByName() {
            var currentUsersSort = this.model.get('currentUsersSort'),
                childUsersCollection = this.model.get('users');

            if(currentUsersSort === 'name-ascending') {
                childUsersCollection.sortByNameDescending();
                this.model.set('currentUsersSort', 'name-descending');
            } else {
                childUsersCollection.sortByNameAscending();
                this.model.set('currentUsersSort', 'name-ascending');
            }
        }

        function toggleSortUsersByDisplayName() {
            var currentUsersSort = this.model.get('currentUsersSort'),
                childUsersCollection = this.model.get('users');

            if(currentUsersSort === 'display-name-ascending') {
                childUsersCollection.sortByDisplayNameDescending();
                this.model.set('currentUsersSort', 'display-name-descending');
            } else {
                childUsersCollection.sortByDisplayNameAscending();
                this.model.set('currentUsersSort', 'display-name-ascending');
            }
        }

        function toggleSortUsersByRole() {
            var currentUsersSort = this.model.get('currentUsersSort'),
                childUsersCollection = this.model.get('users');

            if(currentUsersSort === 'role-ascending') {
                childUsersCollection.sortByRoleDescending();
                this.model.set('currentUsersSort', 'role-descending');
            } else {
                childUsersCollection.sortByRoleAscending();
                this.model.set('currentUsersSort', 'role-ascending');
            }
        }

        function toggleSortUsersByEmail() {
            var currentUsersSort = this.model.get('currentUsersSort'),
                childUsersCollection = this.model.get('users');

            if(currentUsersSort === 'email-ascending') {
                childUsersCollection.sortByEmailDescending();
                this.model.set('currentUsersSort', 'email-descending');
            } else {
                childUsersCollection.sortByEmailAscending();
                this.model.set('currentUsersSort', 'email-ascending');
            }
        }

        function exportAsCsv() {
            this.model.get('users').saveToCsv('Grasshopper Users Export [date]');
        }
    });
