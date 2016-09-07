define(['grasshopperModel', 'resources', 'masseuse', 'assetDetailViewModel', 'underscore'],
    function (Model, resources, masseuse, assetDetailViewModel, _) {
        'use strict';

        var ComputedProperty = masseuse.ComputedProperty;

        return Model.extend({
            defaults : {
                resources : resources,
                loading : false,
                assetModel : new ComputedProperty(['selectedFile'], function(selectedFile){
                    if(selectedFile) {
                        return new assetDetailViewModel({
                            nodeId : _.first(selectedFile.split('/')),
                            url : selectedFile
                        });
                    }
                })
            }
        });

    });
