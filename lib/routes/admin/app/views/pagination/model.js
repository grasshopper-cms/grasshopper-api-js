define(['masseuse', 'resources', 'constants'],
    function (masseuse, resources, constants) {
    'use strict';

    var Model = masseuse.MasseuseModel;

    return Model.extend({
        defaults : {
            constants : constants,
            resources : resources,
            pageNumbers : masseuse.ComputedProperty(['limit', 'total', 'currentPage'], function(limit, total, currentPage) {
                var totalPageNumber = (total % limit === 0 ) ? (total / limit) : parseInt(total / limit, 10) + 1,
                    pageArr = [];

                if ( totalPageNumber < constants.pagination.defaultPagesLimit ) {
                    pageArr = getPagesArray(currentPage, totalPageNumber, true);
                } else {
                    pageArr = getPagesArray(currentPage, totalPageNumber);
                }

                return pageArr;
            }, true)
        }
    });

    function getPagesArray(currentPage, totalPageNumber, isNumbersOnly) {
        var count = 0,
            pageArr = [];

        while(count < totalPageNumber) {
            pageArr.push({
                isShowDot: isNumbersOnly ? false : isDot(currentPage - 1, count, totalPageNumber - 1),
                linkTo: count + 1,
                isCurrent: currentPage - 1 === count ? 'active' : '',
                isVisible: isNumbersOnly ? false : (isDot(currentPage - 1, count, totalPageNumber - 1) && isVisible(currentPage - 1, count, totalPageNumber - 1))
            });
            count += 1;
        }

        return pageArr;
    }

    //TODO: REFACTORING
    function isDot(currentPage, count, totalPageNumber) {
        switch(true) {
        case (currentPage === 0 && (currentPage + 1 === count || currentPage + 2 === count)):
            return false;
        case (currentPage === totalPageNumber && (currentPage - 1 === count || currentPage - 2 === count)):
            return false;
        case (currentPage === count || currentPage + 1 === count || currentPage - 1 === count || count === 0 || count === totalPageNumber):
            return false;
        default:
            return true;
        }
    }

    function isVisible(currentPage, count, totalPageNumber) {
        switch(true) {
        case (currentPage === 0 && (currentPage + 1 === count || currentPage + 2 === count || currentPage + 3 === count)):
            return true;
        case (currentPage === totalPageNumber && (currentPage - 1 === count || currentPage - 2 === count || currentPage - 3 === count)):
            return true;
        case (currentPage === count || currentPage + 1 === count || currentPage + 2 === count || currentPage - 1 === count  || currentPage - 2 === count || count === 0 || count === totalPageNumber):
            return true;
        default:
            return false;
        }
    }

});
