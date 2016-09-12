'use strict';

var inputModal = require('./inputModal'),
    modalQue = require('./modalQue');

module.exports = {
    showInputModal : showInputModal,

    modalQue : modalQue
};

function showInputModal(message) {
    return modalQue.add(inputModal().init({
        message : message
    }));
}