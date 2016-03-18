/*global define:false*/
define(['grasshopperBaseView', 'pagination/options', 'paginationWorker', 'constants', 'jquery'],
    function (GrasshopperBaseView, options, paginationWorker, constants, $) {
    'use strict';

    return GrasshopperBaseView.extend({
        defaultOptions : options,
        afterRender : afterRender,
        goToPage : goToPage,
        next : next,
        prev : prev,
        setLimit : setLimit
    });

    function afterRender() {
        _setActiveClassToLimit.call(this);
        _updateComputedProperty.call(this);
        _checkPaginationVisibility.call(this);
        this.listenTo(this.collection, 'paginatedCollection:query', _updateComputedProperty.bind(this));
        this.listenTo(this.collection, 'paginatedCollection:query', _setActiveClassToLimit.bind(this));
    }

    function _updateComputedProperty() {
        this.model.set({
            limit : this.collection.limit,
            total : this.collection.total,
            currentPage : this.collection.skip
        }, true);
    }

    function _checkPaginationVisibility() {
        if ( this.collection.limit > this.collection.total || this.collection.total === 'all') {
            this.$('.pagination-skip').hide();
        } else {
            this.$('.pagination-skip').show();
        }
    }

    function setLimit(e, context) {
        e.preventDefault();
        var contentSearchValue = this.model.get('contentSearchValue');

        this.model.set('limit', context.size);
        this.collection.skip = constants.pagination.defaultSkip;
        this.collection.setLimit(context.size, contentSearchValue)
            .done(
                paginationWorker.setUrl.bind(this, context.size, this.collection.skip, contentSearchValue),
                _checkPaginationVisibility.call(this),
                _setActiveClassToLimit(e)
            );
    }

    function goToPage(e, context) {
        e.preventDefault();
        _toPage.call(this, context.number.linkTo, true);
    }

    function next(e) {
        e.preventDefault();
        var total = this.collection.total,
            limit = this.collection.limit,
            totalPageNumber = (total % limit === 0 ) ? (total / limit) : parseInt(total / limit, 10) + 1;

        this.collection.skip + 1 > totalPageNumber ? false : _toPage.call(this, 1);
    }

    function prev(e) {
        e.preventDefault();

        this.collection.skip - 1 <= 0 ? false : _toPage.call(this, -1);
    }

    function _toPage(page, isGoToPage) {
        var contentSearchValue = this.collection.contentSearchValue,
            pageNumbersLength = this.model.get('pageNumbers').length;

        isGoToPage = isGoToPage || false;

        this.collection.doSkip(page, contentSearchValue, pageNumbersLength, isGoToPage)
            .done(
                this.model.set('currentPage', this.collection.skip),
                paginationWorker.setUrl.bind(this, this.collection.limit, this.collection.skip, contentSearchValue)
            );
    }

    function _setActiveClassToLimit(e) {
        var paginationLimit = $('.pagination-limit');

        paginationLimit.find('.pagination-item-link').removeClass('active');
        if (!!e) {
            $(e.currentTarget).addClass('active');
        } else {
            paginationLimit.find('.pagination-item-link:contains(' + this.collection.limit + ')').addClass('active');
        }
    }
});
