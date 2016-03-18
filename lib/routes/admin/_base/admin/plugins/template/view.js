/*global define:false*/
define(['pluginBaseView', 'underscore'],
    function (PluginBaseView, _) {
        'use strict';

        return PluginBaseView.extend({
            afterRender : afterRender,
            refreshTemplate : refreshTemplate,
            debouncedRefreshTemplate : _.debounce(refreshTemplate, 300),
            beforeSave : beforeSave
        });

        function afterRender() {

        }

        function refreshTemplate(fields) {
            var template = _.template(this.model.get('options').template),
                thisPluginsKeyPath = _.initial(this.model.get('keypath')),
                thisDocumentsFields = _.reduce(thisPluginsKeyPath, function(memo, key) {
                    return memo[key];
                }, fields);

            thisDocumentsFields = _.omit(thisDocumentsFields, this.model.get('fieldId'));

            this.model.set('value', template({ 'parentDocument' : fields, 'document' : thisDocumentsFields }));
        }

        function beforeSave(fields) {
            this.refreshTemplate(fields);
        }
    });
