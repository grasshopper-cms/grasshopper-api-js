define(['grasshopperModel', 'constants', 'resources', 'masseuse', 'underscore'],
    function (GrasshopperModel, constants, resources, masseuse, _) {

        'use strict';

        var ComputedProperty = masseuse.ComputedProperty;

        return GrasshopperModel.extend({
            idAttribute : '_id',
            defaults : {
                resources : resources,
                enabled : true,
                profile : {},
                fullname : new ComputedProperty(['firstname', 'lastname'], function(firstname, lastname) {
                    return firstname + ' ' + lastname;
                }),
                href : new ComputedProperty(['_id'], function(_id) {
                    return constants.internalRoutes.userDetail.replace(':id', _id);
                }),
                saving : false,
                userIsChangingTheirProfile : ComputedProperty(['_id', 'userModel'], function(_id, userModel) {
                    return _id && userModel && _id === userModel.get('_id');
                }),
                hasGoogle : new ComputedProperty(['linkedidentities'], function(identities){
                    return _.contains(identities, 'google');
                }),
                hasBasic : new ComputedProperty(['linkedidentities'], function(identities){
                    return _.contains(identities, 'basic');
                })

            },
            toJSON : toJSON,
            urlRoot : constants.api.users.url,
            url : function() {
                if(this.has('userModel') && this.get('_id') === this.get('userModel')._id) {
                    return constants.api.user.url; //Admin editing their own (/user)
                } else {
                    return constants.api.users.url + '/' + this.get('_id'); //admin editing someone else (/users/id)
                }
            }
        });

        function toJSON() {
            var json = GrasshopperModel.prototype.toJSON.apply(this);

            return _.omit(json, ['userIsChangingTheirProfile', 'saving', 'userModel', 'fullname']);
        }
    });
