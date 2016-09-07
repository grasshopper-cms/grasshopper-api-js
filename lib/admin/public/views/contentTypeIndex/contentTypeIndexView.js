/*global define:false*/
define(['grasshopperBaseView', 'contentTypeIndexViewConfig', 'constants'],
    function (GrasshopperBaseView, contentTypeIndexViewConfig, constants) {
        'use strict';

        return GrasshopperBaseView.extend({
            defaultOptions : contentTypeIndexViewConfig,
            beforeRender : beforeRender,
            newContentType : newContentType,
            toggleSortContentsByLabel : toggleSortContentsByLabel
        });

        function beforeRender ($deferred) {
            this.model.get('contentTypes').fetch()
                .done($deferred.resolve);
        }

        function newContentType() {
            this.app.router.navigateTrigger(constants.internalRoutes.newContentType);
        }

        function toggleSortContentsByLabel() {
            var currentContentsSort = this.model.get('currentContentsSort'),
                contentTypesCollection = this.model.get('contentTypes');

            if(currentContentsSort === 'ascending') {
                contentTypesCollection.sortByLabelDescending();
                this.model.set('currentContentsSort', 'descending');
            } else {
                contentTypesCollection.sortByLabelAscending();
                this.model.set('currentContentsSort', 'ascending');
            }
        }

    });
