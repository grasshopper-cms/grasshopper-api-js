'use strict';

module.exports = {
    add : add,

    _next : _next,
    _que : []
};

function add(modal) {
    this._que.push(modal);
    this._next();
    return modal;
}

function _next() {
    // if(this._que[0] && !this._que[0].isShowing) {
        // this._que[0].on('destroy', this._next);
        //
    // }

    this._que[0].show();

    // this._que.shift();
}