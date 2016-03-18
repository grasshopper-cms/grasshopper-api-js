define(['grasshopperModel', 'resources', 'grasshopperCollection', 'constants', 'userDetail/model', 'underscore'],
    function (GrasshopperModel, resources, GrasshopperCollection, constants, userDetailViewModel, _) {
        'use strict';

        return GrasshopperModel.extend({
            initialize: initialize,
            defaults: {
                resources: resources,
                no_permissions : false,
                users : null
            }
        });

        function initialize() {
            var UsersCollection = GrasshopperCollection.extend({
                model: userDetailViewModel,
                url: function () {
                    return constants.api.users.url;
                },
                parse : function(users) {
                    return _.filter(users, function(user) {
                        return _.contains(['admin', 'editor', 'author'], user.role);
                    });
                }
            });

            GrasshopperModel.prototype.initialize.apply(this, arguments);

            this.set('users', new UsersCollection());
        }

    });
