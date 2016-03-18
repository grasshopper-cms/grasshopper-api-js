/*global define:false*/
define(['pluginBaseView', 'masseuse'],
    function (PluginBaseView, masseuse) {
        'use strict';

        return PluginBaseView.extend({
            beforeRender : beforeRender,
            addOptionToDropdown : addOptionToDropdown,
            removeOptionFromDropdown : removeOptionFromDropdown,
            reduceCollection : reduceCollection
        });

        function beforeRender() {
            this.collection = new masseuse.Collection(this.model.get('options'));
        }

        function addOptionToDropdown() {
            this.collection.add({ _id: '', label: ''});
            this.reduceCollection();
        }

        function removeOptionFromDropdown(evt, context) {
            this.collection.remove(context.option);
            this.reduceCollection();
        }

        function reduceCollection() {
            var collection = [];

            this.collection.each(function(model) {
                var option = model.toJSON();
                collection.push(option);
            });
            this.model.set('options', collection);
        }

    });
