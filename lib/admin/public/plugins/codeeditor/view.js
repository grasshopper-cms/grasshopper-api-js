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
                _startCodeEditor.call(this);
            }

        }

        function _startCodeEditor() {
            var self = this;

            _toggleLoadingSpinner.call(this);

            require(['ace/editor', 'ace/virtual_renderer'], function(editor, virtualRenderer) {
                var Editor = editor.Editor,
                    VirtualRenderer = virtualRenderer.VirtualRenderer;

                self.editor = new Editor(new VirtualRenderer(self.$('#codeEditor')[0]));

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
                    maxLines : 500,
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
            this.editor.setTheme(this.model.get('currentThemeLocation'));
        }

        function _setEditorMode() {
            this.editor.getSession().setMode(this.model.get('currentModeLocation'));
        }

        function _setEditorEventHandling() {
            this.editor.on('blur', _setValueFromEditor.bind(this));
        }

        function _setValueFromEditor() {
            this.model.set('value', this.editor.getValue());
        }

        function _setEditorValueFromContentValue() {
            var value = this.model.get('value');
            if(!_.isUndefined(value)) {
                this.editor.setValue(value);
            }
        }

        function _toggleLoadingSpinner() {
            this.model.toggle('loading');
        }

    });
