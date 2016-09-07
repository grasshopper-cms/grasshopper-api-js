define(['grasshopperCollection', 'underscore', 'constants', 'api', 'jquery'],
    function (Collection, _, constants, Api, $) {
        'use strict';

        return Collection.extend({
            search : search,
            query : query,
            throttledQuery : _.throttle(query, constants.contentSearchThrottle, { leading : false }),
            limit : constants.pagination.defaultLimit,
            skip : constants.pagination.defaultSkip,
            filterKey : null,
            nodeId : null,
            searching : false
        });

        function search() {
            this.searching = true;
            this.throttledQuery(this.searchValue);
        }

        function query(searchValue) {
            var $deferred = $.Deferred(),
                queryData = {
                    filters : [{key: _.result(this, 'filterKey'), cmp: '%', value: searchValue || ''}],
                    nodes: [ _.result(this, 'nodeId') ] || [],
                    options: {
                        limit: parseInt(_.result(this, 'limit'), 10),
                        skip : (parseInt(_.result(this, 'skip', 10) - 1) * _.result(this, 'limit'))
                    }
                };

            Api.makeQuery(queryData)
                .done(function(results) {
                    this.reset(results, { parse: true });
                    this.searching = false;
                    $deferred.resolve();
                }.bind(this));

            return $deferred.promise();
        }

    });
