/*global define:false*/
define(['pluginBaseView'],
    function (PluginBaseView) {
        'use strict';

        return PluginBaseView.extend({
            beforeRender : beforeRender,
            buildObj : buildObj
        });

        function beforeRender() {
            var value = this.model.get('value'),
                key;

            if(value) {
                for(key in value) {
                    this.model.set('objKey', key);
                    this.model.set('objValue', value[key]);
                }
            }

        }

        function buildObj() {
            var key = this.model.get('objKey'),
                value = this.model.get('objValue'),
                newObj = {};

            newObj[key] = value;

            this.model.set('value', newObj);
        }

    });
