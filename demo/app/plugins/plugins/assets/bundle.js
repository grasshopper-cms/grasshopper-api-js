(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var simpleCustomAttributes = require('simple-custom-attributes'),
    view = {
        plugins : window.plugins,
        handlePluginCheck : handlePluginCheck
    };

simpleCustomAttributes.addAttribute('on-change', {
    bind : function(el, value) {
        el.addEventListener('change', value);
    },
    unbind : function(el, value) {
        el.removeEventListener('change', value);
    }
});

simpleCustomAttributes.register(view, document.querySelector('#plugins'));

function handlePluginCheck() {
    window.gh.appState
        .transform('configs.menuItems')
        .with(function(menuItems, item) {
            menuItems.push(item);
            return menuItems;
        })
        .using({
            'showWhenUserRoleIncludes' : 'admin',
            'name' : 'Dawg',
            'href' : '/admin/content-types',
            'iconClasses' : 'fa fa-refresh fa-spin'
        });
}
},{"simple-custom-attributes":2}],2:[function(require,module,exports){
'use strict';

module.exports = {
    attributesMap : {},

    register : register,
    unregister : unregister,

    addAttribute : addAttribute
};

function register(object, rootElement) {
    Object.keys(this.attributesMap).forEach(function(customAttribute) {
        [].forEach.call(rootElement.querySelectorAll('['+customAttribute+']'), function(element) {

            if(typeof object[element.getAttribute(customAttribute)] === 'function') {
                _registerFunction.call(this, object, element, customAttribute);
            } else if(object[element.getAttribute(customAttribute)] !== undefined){
                this.attributesMap[customAttribute].bind.call(object, element, object[element.getAttribute(customAttribute)]);
            } else {
                this.attributesMap[customAttribute].bind.call(object, element, element.getAttribute(customAttribute));
            }

        }.bind(this));
    }.bind(this));
}

function unregister(object, rootElement) {
    Object.keys(this.attributesMap).forEach(function(customAttribute) {
        [].forEach.call(rootElement.querySelectorAll('['+customAttribute+']'), function(element) {

            if(typeof object[element.getAttribute(customAttribute)] === 'function') {
                _unregisterFunction.call(this, object, element, customAttribute);
            } else if(object[element.getAttribute(customAttribute)] !== undefined) {
                this.attributesMap[customAttribute].unbind.call(object, element, object[element.getAttribute(customAttribute)]);
            } else {
                this.attributesMap[customAttribute].unbind.call(object, element, element.getAttribute(customAttribute));
            }

        }.bind(this));
    }.bind(this));
}

function addAttribute(attributeName, customAttributeObj) {
    this.attributesMap[attributeName] = customAttributeObj;
}

function _registerFunction(object, element, customAttribute) {
    var handler =  object[element.getAttribute(customAttribute)].bind(object);

    object[element.getAttribute(customAttribute)] = handler;

    this.attributesMap[customAttribute].bind.call(object, element, handler);
}

function _unregisterFunction(object, element, customAttribute) {
    this.attributesMap[customAttribute].unbind.call(object, element, object[element.getAttribute(customAttribute)]);
}
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy5udm0vdmVyc2lvbnMvbm9kZS92NS4wLjAvbGliL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjbGllbnQuanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc2ltcGxlLWN1c3RvbS1hdHRyaWJ1dGVzL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbnZhciBzaW1wbGVDdXN0b21BdHRyaWJ1dGVzID0gcmVxdWlyZSgnc2ltcGxlLWN1c3RvbS1hdHRyaWJ1dGVzJyksXG4gICAgdmlldyA9IHtcbiAgICAgICAgcGx1Z2lucyA6IHdpbmRvdy5wbHVnaW5zLFxuICAgICAgICBoYW5kbGVQbHVnaW5DaGVjayA6IGhhbmRsZVBsdWdpbkNoZWNrXG4gICAgfTtcblxuc2ltcGxlQ3VzdG9tQXR0cmlidXRlcy5hZGRBdHRyaWJ1dGUoJ29uLWNoYW5nZScsIHtcbiAgICBiaW5kIDogZnVuY3Rpb24oZWwsIHZhbHVlKSB7XG4gICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHZhbHVlKTtcbiAgICB9LFxuICAgIHVuYmluZCA6IGZ1bmN0aW9uKGVsLCB2YWx1ZSkge1xuICAgICAgICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCB2YWx1ZSk7XG4gICAgfVxufSk7XG5cbnNpbXBsZUN1c3RvbUF0dHJpYnV0ZXMucmVnaXN0ZXIodmlldywgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3BsdWdpbnMnKSk7XG5cbmZ1bmN0aW9uIGhhbmRsZVBsdWdpbkNoZWNrKCkge1xuICAgIHdpbmRvdy5naC5hcHBTdGF0ZVxuICAgICAgICAudHJhbnNmb3JtKCdjb25maWdzLm1lbnVJdGVtcycpXG4gICAgICAgIC53aXRoKGZ1bmN0aW9uKG1lbnVJdGVtcywgaXRlbSkge1xuICAgICAgICAgICAgbWVudUl0ZW1zLnB1c2goaXRlbSk7XG4gICAgICAgICAgICByZXR1cm4gbWVudUl0ZW1zO1xuICAgICAgICB9KVxuICAgICAgICAudXNpbmcoe1xuICAgICAgICAgICAgJ3Nob3dXaGVuVXNlclJvbGVJbmNsdWRlcycgOiAnYWRtaW4nLFxuICAgICAgICAgICAgJ25hbWUnIDogJ0Rhd2cnLFxuICAgICAgICAgICAgJ2hyZWYnIDogJy9hZG1pbi9jb250ZW50LXR5cGVzJyxcbiAgICAgICAgICAgICdpY29uQ2xhc3NlcycgOiAnZmEgZmEtcmVmcmVzaCBmYS1zcGluJ1xuICAgICAgICB9KTtcbn0iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGF0dHJpYnV0ZXNNYXAgOiB7fSxcblxuICAgIHJlZ2lzdGVyIDogcmVnaXN0ZXIsXG4gICAgdW5yZWdpc3RlciA6IHVucmVnaXN0ZXIsXG5cbiAgICBhZGRBdHRyaWJ1dGUgOiBhZGRBdHRyaWJ1dGVcbn07XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyKG9iamVjdCwgcm9vdEVsZW1lbnQpIHtcbiAgICBPYmplY3Qua2V5cyh0aGlzLmF0dHJpYnV0ZXNNYXApLmZvckVhY2goZnVuY3Rpb24oY3VzdG9tQXR0cmlidXRlKSB7XG4gICAgICAgIFtdLmZvckVhY2guY2FsbChyb290RWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbJytjdXN0b21BdHRyaWJ1dGUrJ10nKSwgZnVuY3Rpb24oZWxlbWVudCkge1xuXG4gICAgICAgICAgICBpZih0eXBlb2Ygb2JqZWN0W2VsZW1lbnQuZ2V0QXR0cmlidXRlKGN1c3RvbUF0dHJpYnV0ZSldID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgX3JlZ2lzdGVyRnVuY3Rpb24uY2FsbCh0aGlzLCBvYmplY3QsIGVsZW1lbnQsIGN1c3RvbUF0dHJpYnV0ZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYob2JqZWN0W2VsZW1lbnQuZ2V0QXR0cmlidXRlKGN1c3RvbUF0dHJpYnV0ZSldICE9PSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgICAgIHRoaXMuYXR0cmlidXRlc01hcFtjdXN0b21BdHRyaWJ1dGVdLmJpbmQuY2FsbChvYmplY3QsIGVsZW1lbnQsIG9iamVjdFtlbGVtZW50LmdldEF0dHJpYnV0ZShjdXN0b21BdHRyaWJ1dGUpXSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuYXR0cmlidXRlc01hcFtjdXN0b21BdHRyaWJ1dGVdLmJpbmQuY2FsbChvYmplY3QsIGVsZW1lbnQsIGVsZW1lbnQuZ2V0QXR0cmlidXRlKGN1c3RvbUF0dHJpYnV0ZSkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgfS5iaW5kKHRoaXMpKTtcbn1cblxuZnVuY3Rpb24gdW5yZWdpc3RlcihvYmplY3QsIHJvb3RFbGVtZW50KSB7XG4gICAgT2JqZWN0LmtleXModGhpcy5hdHRyaWJ1dGVzTWFwKS5mb3JFYWNoKGZ1bmN0aW9uKGN1c3RvbUF0dHJpYnV0ZSkge1xuICAgICAgICBbXS5mb3JFYWNoLmNhbGwocm9vdEVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnWycrY3VzdG9tQXR0cmlidXRlKyddJyksIGZ1bmN0aW9uKGVsZW1lbnQpIHtcblxuICAgICAgICAgICAgaWYodHlwZW9mIG9iamVjdFtlbGVtZW50LmdldEF0dHJpYnV0ZShjdXN0b21BdHRyaWJ1dGUpXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIF91bnJlZ2lzdGVyRnVuY3Rpb24uY2FsbCh0aGlzLCBvYmplY3QsIGVsZW1lbnQsIGN1c3RvbUF0dHJpYnV0ZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYob2JqZWN0W2VsZW1lbnQuZ2V0QXR0cmlidXRlKGN1c3RvbUF0dHJpYnV0ZSldICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmF0dHJpYnV0ZXNNYXBbY3VzdG9tQXR0cmlidXRlXS51bmJpbmQuY2FsbChvYmplY3QsIGVsZW1lbnQsIG9iamVjdFtlbGVtZW50LmdldEF0dHJpYnV0ZShjdXN0b21BdHRyaWJ1dGUpXSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuYXR0cmlidXRlc01hcFtjdXN0b21BdHRyaWJ1dGVdLnVuYmluZC5jYWxsKG9iamVjdCwgZWxlbWVudCwgZWxlbWVudC5nZXRBdHRyaWJ1dGUoY3VzdG9tQXR0cmlidXRlKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICB9LmJpbmQodGhpcykpO1xufVxuXG5mdW5jdGlvbiBhZGRBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSwgY3VzdG9tQXR0cmlidXRlT2JqKSB7XG4gICAgdGhpcy5hdHRyaWJ1dGVzTWFwW2F0dHJpYnV0ZU5hbWVdID0gY3VzdG9tQXR0cmlidXRlT2JqO1xufVxuXG5mdW5jdGlvbiBfcmVnaXN0ZXJGdW5jdGlvbihvYmplY3QsIGVsZW1lbnQsIGN1c3RvbUF0dHJpYnV0ZSkge1xuICAgIHZhciBoYW5kbGVyID0gIG9iamVjdFtlbGVtZW50LmdldEF0dHJpYnV0ZShjdXN0b21BdHRyaWJ1dGUpXS5iaW5kKG9iamVjdCk7XG5cbiAgICBvYmplY3RbZWxlbWVudC5nZXRBdHRyaWJ1dGUoY3VzdG9tQXR0cmlidXRlKV0gPSBoYW5kbGVyO1xuXG4gICAgdGhpcy5hdHRyaWJ1dGVzTWFwW2N1c3RvbUF0dHJpYnV0ZV0uYmluZC5jYWxsKG9iamVjdCwgZWxlbWVudCwgaGFuZGxlcik7XG59XG5cbmZ1bmN0aW9uIF91bnJlZ2lzdGVyRnVuY3Rpb24ob2JqZWN0LCBlbGVtZW50LCBjdXN0b21BdHRyaWJ1dGUpIHtcbiAgICB0aGlzLmF0dHJpYnV0ZXNNYXBbY3VzdG9tQXR0cmlidXRlXS51bmJpbmQuY2FsbChvYmplY3QsIGVsZW1lbnQsIG9iamVjdFtlbGVtZW50LmdldEF0dHJpYnV0ZShjdXN0b21BdHRyaWJ1dGUpXSk7XG59Il19
