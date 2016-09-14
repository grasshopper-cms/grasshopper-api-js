'use strict';

module.exports = {
    add : add,
    next : next,

    _que : []
};


function add(modal) {
    this._que.push(modal);
    this.next();
    return modal;
}

function next() {
    if(!this.aModalIsCurrentlyShowing) {
        var modal = this._que.shift();

        if(modal) {
            modal
                .on('afterDestroy', function() {
                    this.aModalIsCurrentlyShowing = false;
                    this.next();
                }.bind(this));

            this.aModalIsCurrentlyShowing = true;
            modal.show();
        }
    }

}
