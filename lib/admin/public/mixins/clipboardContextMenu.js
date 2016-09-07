define(['jquery', 'underscore', 'resources', 'helpers', 'constants', 'clipboardWorker'],
    function($, _, resources, helpers, constants, clipboardWorker) {

        'use strict';
        var joiner = helpers.text.join;

        return {
            initClipboardMenu: initClipboardMenu,
            initializeClipboardListeners: initializeClipboardListeners,
            removeClipboardMenu : removeClipboardMenu
        };

        function removeClipboardMenu(){
            context.destroy('#assetIndex');
            context.destroy('#contentPanel');
        }

        function initClipboardMenu(selector) {
            var shouldCreate = false;

            context.destroy(selector);

            if (selector == '#assetIndex') {
                shouldCreate = _hasAssets.call(this);
            } else {
                shouldCreate = _hasContentOrNodes.call(this);
            }
            if (shouldCreate) {
                _createAndAttach.call(this, selector);
            } else if (clipboardWorker.hasPasteItem) {
                _createWithOnlyPaste.call(this, selector);
            }
        }

        function initializeClipboardListeners(selector) {
            this.listenTo(clipboardWorker, 'hasClipboardItem', initClipboardMenu.bind(this, selector));
            this.listenTo(clipboardWorker, 'pasteDone', initClipboardMenu.bind(this, selector));
            this.listenTo(this.channels.views, 'assetAdded', initClipboardMenu.bind(this, '#assetIndex'));
        }

        function _createAndAttach(selector) {
            var defaultMenu = [{
                text: joiner('<i class="fa fa-scissors"></i> ', resources.clipboard.cut),
                action: _cut.bind(this)
            }, {
                text: joiner('<i class="fa fa-files-o"></i> ', resources.clipboard.copy),
                action: _copy.bind(this)
            }];

            context.init(constants.contextConfig);

            if (clipboardWorker.hasPasteItem) {

                defaultMenu.unshift({
                    text: joiner('<i class="fa fa-clipboard"></i> ', resources.clipboard.paste),
                    action: _paste.bind(this)
                });

                defaultMenu.push({
                    text: joiner('<hr><i class="fa fa-trash-o"></i> ', resources.clipboard.clear),
                    action: clipboardWorker.clear.bind(clipboardWorker)
                });

            }

            context.attach(selector, defaultMenu);
        }

        function _createWithOnlyPaste(selector) {
            context.init(constants.contextConfig);

            context.attach(selector, [{
                text: joiner('<i class="fa fa-clipboard"></i> ', resources.clipboard.paste),
                action: _paste.bind(this)
            }]);
        }

        function _hasAssets() {
            var create = false;

            if (this.model.get('childAssets').length) {
                create = true;
            }

            return create;
        }

        function _hasContentOrNodes() {
            var create = false;

            if (this.model.get('childNodes').length || this.model.get('childContent').length) {
                create = true;
            }

            return create;
        }

        function _cut(e) {
            var target = _getTarget(e);

            if (target) {
                $(target).closest('.clipboardTargetRow').trigger('clipboard:cut');
            }

            e.preventDefault();
        }

        function _copy(e) {
            var target = _getTarget(e);

            if (target) {
                $(target).closest('.clipboardTargetRow').trigger('clipboard:copy');
            }

            e.preventDefault();
        }

        function _paste(e) {
            var target = _getTarget(e),
                $nodeDetailRow,
                $target = $(target);

            if (target) {

                $nodeDetailRow = $target.closest('.clipboardTargetRow');

                if ($nodeDetailRow.length) {
                    $nodeDetailRow.trigger('clipboard:paste');
                } else {
                    $target.trigger('clipboard:paste');
                }

            }

            e.preventDefault();
        }

        function _getTarget(e) {
            return $(e.target).closest('.dropdown-context').data('contextTarget');
        }

    });
