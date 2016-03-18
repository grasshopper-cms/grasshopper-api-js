define(['modalView', 'jquery'], function(ModalView, $) {
    'use strict';

    return {
        displayModal: displayModal,
        hideModal: hideModal
    };

    function displayModal(options) {
        var $deferred = new $.Deferred(),
            modalView = new ModalView({
                modelData: {
                    header: (options.header) ? options.header : null,
                    msg: options.msg,
                    data: (options.data) ? options.data : null,
                    hideCancel: !!options.hideCancel,
                    hideConfirm: !!options.hideConfirm,
                    withSearch: options.withSearch
                },
                type: (options.type) ? options.type : null,
                $deferred: $deferred
            });
        this.hideModal();
        modalView.start();
        this.modalView = modalView;
        return $deferred.promise();
    }

    function hideModal() {
        if (this.modalView && this.modalView.remove) {
            this.modalView.remove();
        }
    }
});
