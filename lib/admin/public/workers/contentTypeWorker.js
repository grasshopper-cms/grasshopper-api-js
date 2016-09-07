/*global define:false*/
define(['api', 'jquery', 'resources', 'underscore'],
    function (Api, $, resources, _) {
        'use strict';

        return {
            getAvailableContentTypes : getAvailableContentTypes,
            getNodesContentTypes : getNodesContentTypes
        };

        function getAvailableContentTypes (previousContentTypes) {
            var $deferred = new $.Deferred();

            Api.getContentTypes()
                .done(function (data) {
                    if (previousContentTypes) {
                        previousContentTypes = _.map(previousContentTypes, function(contenttype) {
                            return contenttype._id;
                        });
                        _.each(data.results, function (result) {
                            if (_.contains(previousContentTypes, result._id)) {
                                result.checked = true;
                            }
                        });
                    }
                    $deferred.resolve(data.results);
                });
            return $deferred.promise();
        }

        function getNodesContentTypes (nodeId) {
            var $deferred = new $.Deferred();

            Api.getNodeDetail(nodeId)
                .done(_resolveDeferred.bind(this, $deferred))
                .fail(_rejectDeferred.bind(this, $deferred));

            return $deferred.promise();
        }

        function _resolveDeferred($deferred, data) {
            $deferred.resolve(data);
        }

        function _rejectDeferred($deferred, data) {
            $deferred.reject(data);
        }

    });
