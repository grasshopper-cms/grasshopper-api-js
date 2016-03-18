define(['api', 'constants', 'jquery', 'resources', 'masseuse', 'underscore'],
    function (Api, constants, $, resources, masseuse, _) {
    'use strict';

    var channels = new masseuse.utilities.channels();

    return {
        contentBreadcrumb : contentBreadcrumb,
        contentTypeBreadcrumb : contentTypeBreadcrumb,
        contentBrowse : contentBrowse,
        userBreadcrumb : userBreadcrumb,
        resetBreadcrumb : resetBreadcrumb
    };

    function contentBreadcrumb($deferred) {
        var nodeId = this.model.get('meta.node'),
            isNew = this.model.get('isNew'),
            self = this;

        _setOldBreadcrumb.call(this);

        _getNodeDetailRecursively.call(this, nodeId)
            .then(function() {
                if(isNew) {
                    _addIsNewScope.call(self, $deferred, nodeId);
                } else {
                    _addCurrentScope.call(self, $deferred);
                }
            });
    }

    function contentTypeBreadcrumb($deferred, isNew) {
        _setOldBreadcrumb.call(this);

        if (isNew) {
            _addIsNewScope.call(this, $deferred, 'new');
        } else {
            _addCurrentScope.call(this, $deferred);
        }
    }

    function contentBrowse($deferred, options) {
        var nodeId = this.model.get('nodeId');

        _setOldBreadcrumb.call(this);

        _getNodeDetailRecursively.call(this, nodeId)
            .then(_finishBreadcrumb.bind(this, $deferred, options));
    }

    function userBreadcrumb($deferred, isNew) {
        if(isNew) {
            _addIsNewScope.call(this, $deferred, 'new');
        } else {
            this.breadcrumbs.crumbs.push({
                text: _.escape(this.model.get('fullname')),
                href: this.model.get('href')
            });
            _finishBreadcrumb.call(this, $deferred);
        }
    }

    function _addIsNewScope($deferred, replaced) {
        this.breadcrumbs.crumbs.push({
            text: resources.newWord,
            href: constants.internalRoutes[this.name].replace(':id', replaced)
        });
        _finishBreadcrumb.call(this, $deferred);
    }

    function _addCurrentScope($deferred) {
        this.breadcrumbs.crumbs.push({
            text: _.escape(this.model.get('label')),
            href: constants.internalRoutes[this.name].replace(':id', this.model.get('_id'))
        });
        _finishBreadcrumb.call(this, $deferred);
    }

    function _getNodeDetailRecursively(nodeId, $deferred, depthFromEnd) {
        var self = this;

        $deferred = $deferred ? $deferred : new $.Deferred();
        depthFromEnd = depthFromEnd ? depthFromEnd : 0;

        Api.getNodeDetail(nodeId)
            .done(function(nodeDetail) {

                if(!_.isEmpty(nodeDetail)) {
                    self.breadcrumbs && self.breadcrumbs.crumbs && self.breadcrumbs.crumbs.splice(self.breadcrumbs.crumbs.length - depthFromEnd, 0 ,{
                        text: _.escape(nodeDetail.label),
                        href: constants.internalRoutes.nodeDetail.replace(':id', nodeDetail._id),
                        nodeId : nodeDetail._id
                    });

                    depthFromEnd++;

                    if(nodeDetail.parent !== null) {
                        _getNodeDetailRecursively.call(self, nodeDetail.parent._id, $deferred, depthFromEnd);
                    } else {
                        $deferred.resolve();
                    }
                } else {
                    $deferred.resolve();
                }
            });

        return $deferred.promise();
    }

    function _finishBreadcrumb($deferred, options) {
        options = options || { trigger : true };
        if(options.trigger) {
            channels.views.trigger('updateMastheadBreadcrumbs', this);
        }
        $deferred && $deferred.resolve();
    }

    function _setOldBreadcrumb() {
        if(!_.has(this, 'originalBreadcrumbs')) {
            this.originalBreadcrumbs = _.clone(this.breadcrumbs);
        }
    }

    function resetBreadcrumb() {
        this.breadcrumbs = _.clone(this.originalBreadcrumbs);
    }

});
