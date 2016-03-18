define(['jquery', 'underscore', 'resources', 'constants', 'api', 'backbone'],
    function ($, _, resources, constants, Api, Backbone) {
        'use strict';

        var clipboardContent = {};
        var subscribers = [];

        return _.extend({
            cutContent: cutContent,
            copyContent: copyContent,
            pasteContent: pasteContent,
            subscribe: subscribe,
            clear: clear,
            resources: resources,
            hasPasteItem : false
        }, Backbone.Events);

        function _notify() {
            _.each(subscribers, function (that) {
                // see http://stackoverflow.com/questions/9909799/backbone-js-change-not-firing-on-model-change
                that.unset('clipboardContent', {silent: true});
                that.set({'clipboardContent': clipboardContent});

            });
        }


        function subscribe(that) {
            subscribers.push(that);
        }

        function cutContent(ctx, content) {
            clipboardContent = {op: 'move', values: [content]};
            _notify();
        }

        function copyContent(ctx, content) {
            clipboardContent = {op: 'copy', values: [content]};
            _notify();
        }

        function clear(e) {
            if(e) {
                e.preventDefault();
            }
            clipboardContent = {};

            if (this.hasPasteItem) {
                this.hasPasteItem = false;
                this.trigger('pasteDone');
            }

            _notify();
        }

        function _getIds(values) {
            return _.map(values, function (item) {
                return {
                    id: item.id,
                    type: item.type
                };
            });
        }

        function _prepareMoveRequest(clipboardContent, folderInfo) {
            return {
                op: clipboardContent.op,
                from: _getIds(clipboardContent.values),
                to: folderInfo.id
            };
        }

        function _pasteContent(ctx, clipboardContent, folderInfo, $deferred) {
            Api.moveContent(_prepareMoveRequest(clipboardContent, folderInfo))
                .done(_clearAndResolve.bind(this, $deferred))
                .fail(_rejectAndTriggerWarning.bind(this, $deferred, ctx));
        }

        function _pasteAsset(ctx, clipboardContent, folderInfo, $deferred) {
            var parts = clipboardContent.values[0].id.split(/\/|\\/),
                nodeId = parts[0],
                fileName = parts[1],
                assetObj = {
                    nodeid: nodeId,
                    filename: fileName,
                    newnodeid: folderInfo.id
                };

            if (clipboardContent.op == 'copy') {
                Api.copyAsset(assetObj)
                    .done(_clearAndResolve.bind(this, $deferred))
                    .fail(_rejectAndTriggerWarning.bind(this, $deferred, ctx));

            } else if (clipboardContent.op == 'move') {
                Api.moveAsset(assetObj)
                    .done(_clearAndResolve.bind(this, $deferred))
                    .fail(_rejectAndTriggerWarning.bind(this, $deferred, ctx));
            }

        }

        function pasteContent(ctx, folderInfo) {
            var $deferred = new $.Deferred(),
                valueTypes = _.pluck(clipboardContent.values, 'type'),
                msg;

            if (clipboardContent && clipboardContent.op) {
                msg = _createPasteMessage(folderInfo);

                if (_.unique(valueTypes).length != 1) {
                    _throwNotDifferentTypesError($deferred, valueTypes, ctx);

                } else {

                    _displayPasteWarning.call(this, ctx, msg)
                        .then(
                            _pasteAssetOrContent.bind(this, valueTypes, ctx, clipboardContent, folderInfo, $deferred)
                        );
                }

            }
            else {
                $deferred.reject(resources.clipboard.noOperationSpecified);
            }

            return $deferred.promise();
        }

        function _pasteAssetOrContent(valueTypes, ctx, clipboardContent, folderInfo, $deferred) {
            if (valueTypes[0] == 'asset') {
                _pasteAsset.call(this,ctx, clipboardContent, folderInfo, $deferred);
            } else if (valueTypes[0] == 'node' || valueTypes[0] == 'content') {
                _pasteContent.call(this,ctx, clipboardContent, folderInfo, $deferred);

            }
        }

        function _throwNotDifferentTypesError($deferred, valueTypes, ctx) {
            $deferred.reject(resources.clipboard.differentContentTypesWarning + valueTypes.join(', '));
            _displayError.call(this, ctx, resources.clipboard.differentContentTypesWarning);
        }

        function _createPasteMessage(folderInfo) {
            var msg = resources.clipboard.warningPaste;

            msg = msg.replace(':op', clipboardContent.op);
            msg = msg.replace(':nr_items', clipboardContent.values.length);
            msg = msg.replace(':items', 'item' + (clipboardContent.values.length !== 1 ? 's' : ''));
            msg = msg.replace(':folder', folderInfo.name ? folderInfo.name : 'ROOT');

            return msg;
        }

        function _displayPasteWarning(view, msg) {
            return view.displayModal(
                {
                    header: resources.warning,
                    type: 'warning',
                    msg: msg
                });
        }

        function _displayError(view, msg) {
            return view.displayModal(
                {
                    header: resources.error,
                    type: 'error',
                    msg: msg
                });
        }

        function _clearAndResolve($deferred, data) {
            clear.call(this);
            $deferred.resolve(data);
        }

        function _rejectAndTriggerWarning($deferred, ctx, err) {
            $deferred.reject(err);
            _displayError.call(this, ctx, ( err && err.responseJSON) ? err.responseJSON.message : resources.clipboard.cannotCompleteOperation);
        }

    }
)
;
