define(['constants'], function (constants) {
    'use strict';

    return {
        setUrl: setUrl
    };

    function setUrl(limit, skip, contentSearchValue) {
        var url = this.app.router.getCurrentBreadcrumb();

        limit = (limit === constants.pagination.defaultAllLimit) ? 'all' : limit;

        if (url.indexOf('/limit') !== -1) {
            url = url.slice(0, url.indexOf('/limit'));
        }

        if (!contentSearchValue) {
            url += '/limit/' + limit + '/skip/' + skip;
        } else {
            url += '/limit/' + limit + '/skip/' + skip + '/query/' + contentSearchValue;
        }

        this.app.router.navigate(url, {trigger: false});
    }
});
