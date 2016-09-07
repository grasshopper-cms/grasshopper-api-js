/*global define:false*/
define(['pluginBaseView', 'underscore', 'jquery', 'require'],
    function (PluginBaseView, _, $, require) {

        'use strict';

        return PluginBaseView.extend({
            afterRender : afterRender
        });

        function afterRender() {
            if(this.model.get('inSetup')) {

            } else {
                _startJsonEditor.call(this);
            }

        }

        function _startJsonEditor() {
            var self = this;

            _toggleLoadingSpinner.call(this);

            require(['ace/editor', 'ace/virtual_renderer'], function(editor, virtualRenderer) {
                var Editor = editor.Editor,
                    VirtualRenderer = virtualRenderer.VirtualRenderer;

                self.editor = new Editor(new VirtualRenderer(self.$('#jsonEditor')[0]));

                _setEditorLines.call(self);
                _setEditorPrintMargin.call(self);
                _setEditorWrapMode.call(self);
                _setEditorTheme.call(self);
                _setEditorMode.call(self);
                _setEditorEventHandling.call(self);
                _setEditorValueFromContentValue.call(self);
                _toggleLoadingSpinner.call(self);
            });

        }

        function _setEditorLines() {
            this.editor.setOptions(
                {
                    maxLines : Infinity,
                    minLines : 10
                }
            );
        }

        function _setEditorPrintMargin() {
            this.editor.setShowPrintMargin(false);
        }

        function _setEditorWrapMode() {
            this.editor.getSession().setUseWrapMode(true);
        }

        function _setEditorTheme() {
            this.editor.setTheme('ace/theme/github');
        }

        function _setEditorMode() {
            this.editor.getSession().setMode('ace/mode/json');
        }

        function _setEditorEventHandling() {
            this.editor.on('blur', _setValueFromEditor.bind(this));
        }

        function _setValueFromEditor() {
            var value = this.editor.getValue();
            if ( _isValidJson() ) {
                this.model.set('isError', false);
                this.model.set('value', JSON.parse(value));
            } else {
                this.model.set('isError', true);
            }
        }

        function _setEditorValueFromContentValue() {
            var value = JSON.stringify(this.model.get('value'), null, 4);
            if(!_.isUndefined(value)) {
                this.editor.setValue(value);
            }
        }

        function _toggleLoadingSpinner() {
            this.model.toggle('loading');
        }

        function _isValidJson() {
            try {
            } catch (e) {
                return false;
            }
            return true;
        }

    });
