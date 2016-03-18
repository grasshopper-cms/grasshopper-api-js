define(['grasshopperModel', 'resources', 'userIndexViewUsersCollection'],
    function (GrasshopperModel, resources, UsersCollection) {

    'use strict';

    return GrasshopperModel.extend({
        defaults : getDefaults
    });

    function getDefaults() {
        return {
            resources : resources,
            users : new UsersCollection(),
            currentUsersSort : 'name-ascending'
        };
    }

});
