'use strict';

var BB = require('bluebird'),
    log = require('../../util/log'),
    defaultsDeep = require('lodash/defaultsDeep');

module.exports = {
    init : init,

    on : on,
    triggerCurried : triggerCurried,
    trigger : trigger,
    events : {
        'beforeTemplating' : [],
        'beforeShow' : [],
        'showing' : [],
        'afterShow' : [],
        'wantsToClose' : [],
        'beforeHide' : [],
        'hiding' : [],
        'afterHide' : [],
        'beforeDestroy' : [],
        'afterDestroy' : []
    },

    model : {

    },

    show : show,
    close : close,
    hide : hide,
    destroy : destroy
};

function init(options) {
    this.model = defaultsDeep(this.model, options);
    return this;
}

function on(eventName, handler) {
    this.events[eventName].push(handler);

    return this;
}

function trigger(eventName, payload) {
    return BB.all(this.events[eventName].map(function(handler) {
        return handler.call(this, payload, this.hide.bind(this));
    }.bind(this)));
}

function triggerCurried(eventName, payload) {
    return function curriedTrigger() {
        return this.trigger(eventName, payload);
    }.bind(this);
}

function show() {
    BB.bind(this)
        .then(this.triggerCurried('beforeTemplating'))
        .then(this.triggerCurried('beforeShow'))
        .then(function() {
            document.querySelector('body').classList.add('modal-is-showing');
        })
        .then(this.triggerCurried('showing'))
        .then(this.triggerCurried('afterShow'))
        .catch(function(err) {
            log.write('Grasshopper Modal Render Error '+ err);
        });
}

function close() {
    this.trigger('wantsToClose', { model : this.model });
}

function hide() {
    BB.bind(this)
        .then(this.triggerCurried('beforeHide'))
        .then(function() {
            document.querySelector('body').classList.remove('modal-is-showing');
        })
        .then(this.triggerCurried('hiding'))
        .then(this.triggerCurried('afterHide'))
        .then(this.destroy)
        .catch(function(err) {
            log.write('Grasshopper Modal Hide Error '+ err);
        });
}

function destroy() {
    return this.trigger('beforeDestroy')
        .then(function() {

        })
        .then(this.triggerCurried('afterDestroy'));
}

/////// FROM DESIRELIST AS REFERNCE
//
// 'use strict';
//
// var _ = require('lodash'),
//     BB = require('bluebird'),
//     rivets = require('../../rivets'),
//     baseTemplate = require('./template.jade');
//
// module.exports = {
//     show : show,
//     afterShow : afterShow,
//     init : init,
//     finish : finish, // called when the user wants to close the modal
//     hide : hide, // hides the modal,
//     canHide : canHide, // is an expression or value that represents if the modal can be closed.
//     refresh : refresh,
//
//     model : {},
//     __rivetsInstance : null,
//     __promise : {
//         resolve : null,
//         reject : null
//     }
// };
//
// function show() {
//     var self = this;
//
//     _renderPartialInsideBaseTemplate.call(this);
//
//     _bindRivets.call(this);
//
//     document.querySelector('body').classList.add('overflow-hidden');
//
//     window.setTimeout(this.afterShow.bind(this), 0);
//
//     return new BB(function() {
//         self.__promise.resolve = arguments[0];
//         self.__promise.reject = arguments[1];
//     });
// }
//
// function afterShow() {
//
// }
//
// function init(options) {
//     this.model = _.extend({}, this.model, options);
//     return this;
// }
//
// function finish(result) {
//     this.__promise.resolve(_.extend(this, { result : result }));
// }
//
// function hide() {
//     if(!this.model.isWorking && _.result(this, 'canHide')) {
//         this.__rivetsInstance && this.__rivetsInstance.unbind();
//         !this.__rivetsInstance && console.log('There could be a memory leak here. Rivets instance is not defined');
//         this.__promise.reject && this.__promise.reject();
//         document.querySelector('body').classList.remove('overflow-hidden');
//         document.querySelector('#modalBaseTemplate').parentElement.removeChild(document.querySelector('#modalBaseTemplate'));
//     }
// }
//
// function canHide() {
//     return true;
// }
//
// function refresh() {
//     this.__rivetsInstance.unbind();
//     _renderPartialInsideBaseTemplate.call(this);
//     _bindRivets.call(this);
// }
//
// function _renderPartialInsideBaseTemplate() {
//     var templateString = baseTemplate({
//             childModal : this.template(this)
//         });
//
//     document.querySelector('#modalBucket').innerHTML = templateString;
// }
//
// function _bindRivets() {
//     this.__rivetsInstance = rivets.bind(document.querySelector('#modalBaseTemplate'), this);
// }
//
