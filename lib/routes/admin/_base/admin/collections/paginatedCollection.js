define(['grasshopperModel', 'grasshopperCollection', 'constants', 'underscore', 'jquery', 'api'],
    function (Model, Collection, constants, _, $, api) {
        'use strict';

        return Collection.extend({
            model : Model,
            nodeId : '',
            query : query,
            searchQuery : _.throttle(query, constants.contentSearchThrottle, {leading:false}),
            doSkip: doSkip,
            setLimit: setLimit,
            total : 0
        });


        function doSkip(skip, contentSearchValue, pageLength, isGoToPage) {
            pageLength = parseInt(pageLength, 10) || 1;
            isGoToPage = isGoToPage || false;

            if ( isGoToPage ) {
                this.skip = (skip >= 1 && skip <= pageLength) ? skip : 1;
            } else {
                this.skip += ( (this.skip + skip >= 1) && (this.skip + skip <= pageLength) ) ? skip : 0;
            }

            return this.query(contentSearchValue);
        }

        function setLimit(limit, contentSearchValue) {
            this.limit = !!parseInt(limit, 10) ? limit : constants.pagination.defaultAllLimit;
            return this.query(contentSearchValue);
        }

        function query(value, callback) {
            this.skip = (_.isUndefined(this.contentSearchValue) || this.contentSearchValue == value) ? this.skip : constants.pagination.defaultSkip;
            this.contentSearchValue = value || '';
            this.limit = !!parseInt(this.limit, 10) ? this.limit : constants.pagination.defaultAllLimit;

            var $deferred = new $.Deferred(),
                queryData = {
                    filters : [{key: this.filtersKey, cmp: '%', value: value || ''}],
                    nodes: [this.nodeId] || [],
                    options: {
                        limit: parseInt(this.limit, 10),
                        skip : (parseInt(this.skip, 10) - 1) * this.limit,
                        sortBy : { 'meta.lastmodified' : -1 }
                    }
                };

            // $('.table-wrapper').addClass('spinner-loading');
            this.queryRequest.call(api, queryData)
                .done(function(data) {
                    this.reset(data.results);
                    this.total = data.total;
                    this.skip =  parseInt(this.skip, 10);
                    this.trigger('paginatedCollection:query');
                    if(callback) {
                        callback();
                    }
                    // $('.table-wrapper').removeClass('spinner-loading');
                    $deferred.resolve();
                }.bind(this));

            return $deferred.promise();
        }

    });
