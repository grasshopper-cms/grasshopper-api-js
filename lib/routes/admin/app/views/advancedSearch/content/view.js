/*global define:false*/
define(['grasshopperBaseView', 'advancedSearch/content/config', 'jquery', 'constants', 'underscore'],
    function (GrasshopperBaseView, config, $, constants, _) {
        'use strict';

        return GrasshopperBaseView.extend({
            defaultOptions : config,
            beforeRender : beforeRender,
            afterRender : afterRender,
            addFilterToFiltersCollection : addFilterToFiltersCollection,
            removeFilterFromFiltersCollection : removeFilterFromFiltersCollection,
            resetNewFilter : resetNewFilter,
            updateUrl : updateUrl,
            buildQueryFromQueryOptions : buildQueryFromQueryOptions,
            fireFailedQueryAlert : fireFailedQueryAlert
        });

        function beforeRender($deferred) {
            $.when(
                this.model.get('contentTypeCollection').fetch(),
                this.model.get('nodesCollection').fetch()
            )
                .done($deferred.resolve);
        }

        function afterRender() {
            this.$('#selectContentTypes').add('#selectNodes').multipleSelect('refresh');

            this.model.setupChangeListeners();

            if(this.model.get('queryOptions')) {
                this.buildQueryFromQueryOptions();
            } else {
                this.model.query();
            }
        }

        function buildQueryFromQueryOptions() {
            var queryOptions = this.model.get('queryOptions');

            if(!_.isEmpty(queryOptions.filters)) {
                this.model.get('filtersCollection').reset(queryOptions.filters);
            }

            if(!_.isEmpty(queryOptions.types)) {
                this.$('#selectContentTypes').multipleSelect('setSelects', queryOptions.types);
            }

            if(!_.isEmpty(queryOptions.nodes)) {
                this.$('#selectNodes').multipleSelect('setSelects', queryOptions.nodes);
            }

            if(_.isEmpty(queryOptions.filters) && _.isEmpty(queryOptions.filters) && _.isEmpty(queryOptions.nodes)) {
                this.model.query();
            }
        }

        function fireFailedQueryAlert() {
            this.displayAlertBox({
                header : 'Error',
                style : 'error',
                msg : 'Invalid Query'
            });
        }

        function addFilterToFiltersCollection() {
            this.model.get('filtersCollection').add(this.model.get('newFilterModel').toJSON());
            this.resetNewFilter();
        }

        function removeFilterFromFiltersCollection(event, context) {
            this.model.get('filtersCollection').remove(context.filter);
        }

        function resetNewFilter() {
            this.model.get('newFilterModel').clear();
            this.$('#addNewFilterButton').click();
            this.$('#newFilterKeys').add('#newFilterComparator').select2('val', '');
        }

        function updateUrl(queryOptions) {
            var encodedQueryOptions = encodeURIComponent(JSON.stringify(queryOptions)),
                encodedUrl = constants.internalRoutes.advancedSearchWithOptions.replace(':type', 'content').replace(':queryOptions', encodedQueryOptions);

            this.app.router.navigateNinja(encodedUrl);
        }
    });
