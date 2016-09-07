/*global define:false*/
define(['pluginBaseView', 'underscore', 'jquery',
    'plugins/richtext/ckeditorConfig', 'require', 'mixins/itemSelectModal'],
    function (PluginBaseView, _, $,
              ckeditorConfig, require, itemSelectModal) {

        'use strict';

        return PluginBaseView.extend({
            afterRender : afterRender,
            remove : remove,
            sortStart : sortStart,
            stopSort : stopSort
        })
            .extend(itemSelectModal);

        function afterRender() {
            if(this.model.get('inSetup')) {

            } else {
                _prepareCkeditor.call(this)
                    .done(
                        _setEditorValue.bind(this),
                        _setEditorEventHandling.bind(this),
                        _overRideWindowOpen.bind(this)
                    );
            }

        }

        function _prepareCkeditor() {
            var $deferred = new $.Deferred();

            _toggleLoadingSpinner.call(this);

            require(['ckeditorAdapter'], _startEditor.bind(this, $deferred));

            return $deferred.promise();
        }

        function _startEditor($deferred) {
            var self = this;

            this.ckeditor = this.$('#ckeditor' + this.model.cid).ckeditor(ckeditorConfig,
                function() {
                    _toggleLoadingSpinner.call(self);
                    $deferred && $deferred.resolve();
                }).editor;
        }

        function _setEditorValue() {
            if(!_.isUndefined(this.model.get('value'))) {
                this.ckeditor.setData(this.model.get('value'));
            }
        }

        function _setEditorEventHandling() {
            this.ckeditor.on('change', _setContentValue.bind(this));
        }

        function _setContentValue() {
            this.model.set('value', this.ckeditor.getData());
        }

        function _overRideWindowOpen() {
            this.oldWindowOpen = window.open;

            window.open = window.opener = _startFileBrowser.bind(this);
        }

        function remove() {
            if(this.model && !this.model.get('inSetup')) {
                window.open = this.oldWindowOpen;
                this.ckeditor.destroy();
            }

            PluginBaseView.prototype.remove.apply(this, arguments);
        }

        function _toggleLoadingSpinner() {
            this.model.toggle('loading');
        }

        function _startFileBrowser() {
            _fireFileBrowserModal.call(this)
                .done(_setUrlOfFile.bind(this));
        }

        function _fireFileBrowserModal() {
            var nodeId = 0,
                value;

            return this.fireFileSelectModal(value, nodeId);
        }

        function _setUrlOfFile(selectedFile) {
            this.model.set('selectedFile', selectedFile);

            this.model.get('assetModel').fetch()
                .done(function() {
                    var assetUrl = this.model.get('assetModel.url');

                    window.CKEDITOR.tools.callFunction(this.ckeditor._.filebrowserFn, assetUrl);
                }.bind(this));


        }

        function sortStart() {
            var textBox = this.$('#ckeditor' + this.model.cid),
                ckeClone = this.$('#cke_ckeditor' + this.model.cid).clone().addClass('cloned');

            _setContentValue.call(this);
            textBox.after(ckeClone);
            this.ckeditor.destroy();
            textBox.hide();
        }

        function stopSort() {
            this.$('cloned').remove();
        }

    });
