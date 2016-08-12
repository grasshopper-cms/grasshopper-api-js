(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var rivets = require('rivets'),
    queryString = require('query-string'),
    domReady = require('domready'),
    view = {
        plugins : window.plugins,
        activeTab : 'general',

        tabs : {
            general : 'general',
            plugins : 'plugins'
        },

        handlePluginCheck : handlePluginCheck,
        handleTabClicked : handleTabClicked
    };

function init() {
    view.activeTab = queryString.parse(window.location.hash).tab;

    bindView();
}

function bindView() {
    rivets.formatters.equals = function(comparator, comparatee) {
        return comparator === comparatee;
    };

    rivets.bind(document.querySelector('#settings'), { view : view });
}

function handleTabClicked(event) {
    window.location.hash = queryString.stringify({ tab : event.currentTarget.getAttribute('tab-name') });
    view.activeTab = event.currentTarget.getAttribute('tab-name');
}

function handlePluginCheck() {
    window.gh.modalService.showInputModal(); // returns the modal instance.

    // modal.show()
    //     .then(function() {
    //         console.log('THEN WAS CALLED');
    //     })
    //     .catch(function() {
    //         console.log('CATCH WAS CALLED');
    //     });

    // modal.canClose() // called when the user wants to close the modal. return true if it is ok.
    //     .show() // kicks of the chain returns a promise.
    //     .then(function() { // use clicked confirm
    //         // do some work.
    //         // modal.close();
    //     })
    //     .catch(); // user clicked cancel. or closed it.

    // setTimeout(modal.hide, 5000);
    // window.gh.appState
    //     .transform('configs.menuItems')
    //     .with(function(menuItems, item) {
    //         menuItems.push(item);
    //         return menuItems;
    //     })
    //     .using({
    //         'showWhenUserRoleIncludes' : 'admin',
    //         'name' : 'Dawg',
    //         'href' : '/admin/content-types',
    //         'iconClasses' : 'fa fa-refresh fa-spin'
    //     });
}

domReady(init);

},{"domready":2,"query-string":4,"rivets":5}],2:[function(require,module,exports){
/*!
  * domready (c) Dustin Diaz 2014 - License MIT
  */
!function (name, definition) {

  if (typeof module != 'undefined') module.exports = definition()
  else if (typeof define == 'function' && typeof define.amd == 'object') define(definition)
  else this[name] = definition()

}('domready', function () {

  var fns = [], listener
    , doc = document
    , hack = doc.documentElement.doScroll
    , domContentLoaded = 'DOMContentLoaded'
    , loaded = (hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(doc.readyState)


  if (!loaded)
  doc.addEventListener(domContentLoaded, listener = function () {
    doc.removeEventListener(domContentLoaded, listener)
    loaded = 1
    while (listener = fns.shift()) listener()
  })

  return function (fn) {
    loaded ? setTimeout(fn, 0) : fns.push(fn)
  }

});

},{}],3:[function(require,module,exports){
'use strict';
/* eslint-disable no-unused-vars */
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (e) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (Object.getOwnPropertySymbols) {
			symbols = Object.getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

},{}],4:[function(require,module,exports){
'use strict';
var strictUriEncode = require('strict-uri-encode');
var objectAssign = require('object-assign');

function encode(value, opts) {
	if (opts.encode) {
		return opts.strict ? strictUriEncode(value) : encodeURIComponent(value);
	}

	return value;
}

exports.extract = function (str) {
	return str.split('?')[1] || '';
};

exports.parse = function (str) {
	// Create an object with no prototype
	// https://github.com/sindresorhus/query-string/issues/47
	var ret = Object.create(null);

	if (typeof str !== 'string') {
		return ret;
	}

	str = str.trim().replace(/^(\?|#|&)/, '');

	if (!str) {
		return ret;
	}

	str.split('&').forEach(function (param) {
		var parts = param.replace(/\+/g, ' ').split('=');
		// Firefox (pre 40) decodes `%3D` to `=`
		// https://github.com/sindresorhus/query-string/pull/37
		var key = parts.shift();
		var val = parts.length > 0 ? parts.join('=') : undefined;

		key = decodeURIComponent(key);

		// missing `=` should be `null`:
		// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
		val = val === undefined ? null : decodeURIComponent(val);

		if (ret[key] === undefined) {
			ret[key] = val;
		} else if (Array.isArray(ret[key])) {
			ret[key].push(val);
		} else {
			ret[key] = [ret[key], val];
		}
	});

	return ret;
};

exports.stringify = function (obj, opts) {
	var defaults = {
		encode: true,
		strict: true
	};

	opts = objectAssign(defaults, opts);

	return obj ? Object.keys(obj).sort().map(function (key) {
		var val = obj[key];

		if (val === undefined) {
			return '';
		}

		if (val === null) {
			return encode(key, opts);
		}

		if (Array.isArray(val)) {
			var result = [];

			val.slice().forEach(function (val2) {
				if (val2 === undefined) {
					return;
				}

				if (val2 === null) {
					result.push(encode(key, opts));
				} else {
					result.push(encode(key, opts) + '=' + encode(val2, opts));
				}
			});

			return result.join('&');
		}

		return encode(key, opts) + '=' + encode(val, opts);
	}).filter(function (x) {
		return x.length > 0;
	}).join('&') : '';
};

},{"object-assign":3,"strict-uri-encode":7}],5:[function(require,module,exports){
// Rivets.js
// version: 0.9.3
// author: Michael Richards
// license: MIT
(function() {
  var Rivets, bindMethod, unbindMethod, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = [].slice,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Rivets = {
    options: ['prefix', 'templateDelimiters', 'rootInterface', 'preloadData', 'handler', 'executeFunctions'],
    extensions: ['binders', 'formatters', 'components', 'adapters'],
    "public": {
      binders: {},
      components: {},
      formatters: {},
      adapters: {},
      prefix: 'rv',
      templateDelimiters: ['{', '}'],
      rootInterface: '.',
      preloadData: true,
      executeFunctions: false,
      iterationAlias: function(modelName) {
        return '%' + modelName + '%';
      },
      handler: function(context, ev, binding) {
        return this.call(context, ev, binding.view.models);
      },
      configure: function(options) {
        var descriptor, key, option, value;
        if (options == null) {
          options = {};
        }
        for (option in options) {
          value = options[option];
          if (option === 'binders' || option === 'components' || option === 'formatters' || option === 'adapters') {
            for (key in value) {
              descriptor = value[key];
              Rivets[option][key] = descriptor;
            }
          } else {
            Rivets["public"][option] = value;
          }
        }
      },
      bind: function(el, models, options) {
        var view;
        if (models == null) {
          models = {};
        }
        if (options == null) {
          options = {};
        }
        view = new Rivets.View(el, models, options);
        view.bind();
        return view;
      },
      init: function(component, el, data) {
        var scope, template, view;
        if (data == null) {
          data = {};
        }
        if (el == null) {
          el = document.createElement('div');
        }
        component = Rivets["public"].components[component];
        template = component.template.call(this, el);
        if (template instanceof HTMLElement) {
          while (el.firstChild) {
            el.removeChild(el.firstChild);
          }
          el.appendChild(template);
        } else {
          el.innerHTML = template;
        }
        scope = component.initialize.call(this, el, data);
        view = new Rivets.View(el, scope);
        view.bind();
        return view;
      }
    }
  };

  if (window['jQuery'] || window['$']) {
    _ref = 'on' in jQuery.prototype ? ['on', 'off'] : ['bind', 'unbind'], bindMethod = _ref[0], unbindMethod = _ref[1];
    Rivets.Util = {
      bindEvent: function(el, event, handler) {
        return jQuery(el)[bindMethod](event, handler);
      },
      unbindEvent: function(el, event, handler) {
        return jQuery(el)[unbindMethod](event, handler);
      },
      getInputValue: function(el) {
        var $el;
        $el = jQuery(el);
        if ($el.attr('type') === 'checkbox') {
          return $el.is(':checked');
        } else {
          return $el.val();
        }
      }
    };
  } else {
    Rivets.Util = {
      bindEvent: (function() {
        if ('addEventListener' in window) {
          return function(el, event, handler) {
            return el.addEventListener(event, handler, false);
          };
        }
        return function(el, event, handler) {
          return el.attachEvent('on' + event, handler);
        };
      })(),
      unbindEvent: (function() {
        if ('removeEventListener' in window) {
          return function(el, event, handler) {
            return el.removeEventListener(event, handler, false);
          };
        }
        return function(el, event, handler) {
          return el.detachEvent('on' + event, handler);
        };
      })(),
      getInputValue: function(el) {
        var o, _i, _len, _results;
        if (el.type === 'checkbox') {
          return el.checked;
        } else if (el.type === 'select-multiple') {
          _results = [];
          for (_i = 0, _len = el.length; _i < _len; _i++) {
            o = el[_i];
            if (o.selected) {
              _results.push(o.value);
            }
          }
          return _results;
        } else {
          return el.value;
        }
      }
    };
  }

  Rivets.TypeParser = (function() {
    function TypeParser() {}

    TypeParser.types = {
      primitive: 0,
      keypath: 1
    };

    TypeParser.parse = function(string) {
      if (/^'.*'$|^".*"$/.test(string)) {
        return {
          type: this.types.primitive,
          value: string.slice(1, -1)
        };
      } else if (string === 'true') {
        return {
          type: this.types.primitive,
          value: true
        };
      } else if (string === 'false') {
        return {
          type: this.types.primitive,
          value: false
        };
      } else if (string === 'null') {
        return {
          type: this.types.primitive,
          value: null
        };
      } else if (string === 'undefined') {
        return {
          type: this.types.primitive,
          value: void 0
        };
      } else if (string === '') {
        return {
          type: this.types.primitive,
          value: void 0
        };
      } else if (isNaN(Number(string)) === false) {
        return {
          type: this.types.primitive,
          value: Number(string)
        };
      } else {
        return {
          type: this.types.keypath,
          value: string
        };
      }
    };

    return TypeParser;

  })();

  Rivets.TextTemplateParser = (function() {
    function TextTemplateParser() {}

    TextTemplateParser.types = {
      text: 0,
      binding: 1
    };

    TextTemplateParser.parse = function(template, delimiters) {
      var index, lastIndex, lastToken, length, substring, tokens, value;
      tokens = [];
      length = template.length;
      index = 0;
      lastIndex = 0;
      while (lastIndex < length) {
        index = template.indexOf(delimiters[0], lastIndex);
        if (index < 0) {
          tokens.push({
            type: this.types.text,
            value: template.slice(lastIndex)
          });
          break;
        } else {
          if (index > 0 && lastIndex < index) {
            tokens.push({
              type: this.types.text,
              value: template.slice(lastIndex, index)
            });
          }
          lastIndex = index + delimiters[0].length;
          index = template.indexOf(delimiters[1], lastIndex);
          if (index < 0) {
            substring = template.slice(lastIndex - delimiters[1].length);
            lastToken = tokens[tokens.length - 1];
            if ((lastToken != null ? lastToken.type : void 0) === this.types.text) {
              lastToken.value += substring;
            } else {
              tokens.push({
                type: this.types.text,
                value: substring
              });
            }
            break;
          }
          value = template.slice(lastIndex, index).trim();
          tokens.push({
            type: this.types.binding,
            value: value
          });
          lastIndex = index + delimiters[1].length;
        }
      }
      return tokens;
    };

    return TextTemplateParser;

  })();

  Rivets.View = (function() {
    function View(els, models, options) {
      var k, option, v, _base, _i, _j, _len, _len1, _ref1, _ref2, _ref3, _ref4, _ref5;
      this.els = els;
      this.models = models;
      if (options == null) {
        options = {};
      }
      this.update = __bind(this.update, this);
      this.publish = __bind(this.publish, this);
      this.sync = __bind(this.sync, this);
      this.unbind = __bind(this.unbind, this);
      this.bind = __bind(this.bind, this);
      this.select = __bind(this.select, this);
      this.traverse = __bind(this.traverse, this);
      this.build = __bind(this.build, this);
      this.buildBinding = __bind(this.buildBinding, this);
      this.bindingRegExp = __bind(this.bindingRegExp, this);
      this.options = __bind(this.options, this);
      if (!(this.els.jquery || this.els instanceof Array)) {
        this.els = [this.els];
      }
      _ref1 = Rivets.extensions;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        option = _ref1[_i];
        this[option] = {};
        if (options[option]) {
          _ref2 = options[option];
          for (k in _ref2) {
            v = _ref2[k];
            this[option][k] = v;
          }
        }
        _ref3 = Rivets["public"][option];
        for (k in _ref3) {
          v = _ref3[k];
          if ((_base = this[option])[k] == null) {
            _base[k] = v;
          }
        }
      }
      _ref4 = Rivets.options;
      for (_j = 0, _len1 = _ref4.length; _j < _len1; _j++) {
        option = _ref4[_j];
        this[option] = (_ref5 = options[option]) != null ? _ref5 : Rivets["public"][option];
      }
      this.build();
    }

    View.prototype.options = function() {
      var option, options, _i, _len, _ref1;
      options = {};
      _ref1 = Rivets.extensions.concat(Rivets.options);
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        option = _ref1[_i];
        options[option] = this[option];
      }
      return options;
    };

    View.prototype.bindingRegExp = function() {
      return new RegExp("^" + this.prefix + "-");
    };

    View.prototype.buildBinding = function(binding, node, type, declaration) {
      var context, ctx, dependencies, keypath, options, pipe, pipes;
      options = {};
      pipes = (function() {
        var _i, _len, _ref1, _results;
        _ref1 = declaration.match(/((?:'[^']*')*(?:(?:[^\|']*(?:'[^']*')+[^\|']*)+|[^\|]+))|^$/g);
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          pipe = _ref1[_i];
          _results.push(pipe.trim());
        }
        return _results;
      })();
      context = (function() {
        var _i, _len, _ref1, _results;
        _ref1 = pipes.shift().split('<');
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          ctx = _ref1[_i];
          _results.push(ctx.trim());
        }
        return _results;
      })();
      keypath = context.shift();
      options.formatters = pipes;
      if (dependencies = context.shift()) {
        options.dependencies = dependencies.split(/\s+/);
      }
      return this.bindings.push(new Rivets[binding](this, node, type, keypath, options));
    };

    View.prototype.build = function() {
      var el, parse, _i, _len, _ref1;
      this.bindings = [];
      parse = (function(_this) {
        return function(node) {
          var block, childNode, delimiters, n, parser, text, token, tokens, _i, _j, _len, _len1, _ref1;
          if (node.nodeType === 3) {
            parser = Rivets.TextTemplateParser;
            if (delimiters = _this.templateDelimiters) {
              if ((tokens = parser.parse(node.data, delimiters)).length) {
                if (!(tokens.length === 1 && tokens[0].type === parser.types.text)) {
                  for (_i = 0, _len = tokens.length; _i < _len; _i++) {
                    token = tokens[_i];
                    text = document.createTextNode(token.value);
                    node.parentNode.insertBefore(text, node);
                    if (token.type === 1) {
                      _this.buildBinding('TextBinding', text, null, token.value);
                    }
                  }
                  node.parentNode.removeChild(node);
                }
              }
            }
          } else if (node.nodeType === 1) {
            block = _this.traverse(node);
          }
          if (!block) {
            _ref1 = (function() {
              var _k, _len1, _ref1, _results;
              _ref1 = node.childNodes;
              _results = [];
              for (_k = 0, _len1 = _ref1.length; _k < _len1; _k++) {
                n = _ref1[_k];
                _results.push(n);
              }
              return _results;
            })();
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              childNode = _ref1[_j];
              parse(childNode);
            }
          }
        };
      })(this);
      _ref1 = this.els;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        el = _ref1[_i];
        parse(el);
      }
      this.bindings.sort(function(a, b) {
        var _ref2, _ref3;
        return (((_ref2 = b.binder) != null ? _ref2.priority : void 0) || 0) - (((_ref3 = a.binder) != null ? _ref3.priority : void 0) || 0);
      });
    };

    View.prototype.traverse = function(node) {
      var attribute, attributes, binder, bindingRegExp, block, identifier, regexp, type, value, _i, _j, _len, _len1, _ref1, _ref2, _ref3;
      bindingRegExp = this.bindingRegExp();
      block = node.nodeName === 'SCRIPT' || node.nodeName === 'STYLE';
      _ref1 = node.attributes;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        attribute = _ref1[_i];
        if (bindingRegExp.test(attribute.name)) {
          type = attribute.name.replace(bindingRegExp, '');
          if (!(binder = this.binders[type])) {
            _ref2 = this.binders;
            for (identifier in _ref2) {
              value = _ref2[identifier];
              if (identifier !== '*' && identifier.indexOf('*') !== -1) {
                regexp = new RegExp("^" + (identifier.replace(/\*/g, '.+')) + "$");
                if (regexp.test(type)) {
                  binder = value;
                }
              }
            }
          }
          binder || (binder = this.binders['*']);
          if (binder.block) {
            block = true;
            attributes = [attribute];
          }
        }
      }
      _ref3 = attributes || node.attributes;
      for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
        attribute = _ref3[_j];
        if (bindingRegExp.test(attribute.name)) {
          type = attribute.name.replace(bindingRegExp, '');
          this.buildBinding('Binding', node, type, attribute.value);
        }
      }
      if (!block) {
        type = node.nodeName.toLowerCase();
        if (this.components[type] && !node._bound) {
          this.bindings.push(new Rivets.ComponentBinding(this, node, type));
          block = true;
        }
      }
      return block;
    };

    View.prototype.select = function(fn) {
      var binding, _i, _len, _ref1, _results;
      _ref1 = this.bindings;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        binding = _ref1[_i];
        if (fn(binding)) {
          _results.push(binding);
        }
      }
      return _results;
    };

    View.prototype.bind = function() {
      var binding, _i, _len, _ref1;
      _ref1 = this.bindings;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        binding = _ref1[_i];
        binding.bind();
      }
    };

    View.prototype.unbind = function() {
      var binding, _i, _len, _ref1;
      _ref1 = this.bindings;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        binding = _ref1[_i];
        binding.unbind();
      }
    };

    View.prototype.sync = function() {
      var binding, _i, _len, _ref1;
      _ref1 = this.bindings;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        binding = _ref1[_i];
        if (typeof binding.sync === "function") {
          binding.sync();
        }
      }
    };

    View.prototype.publish = function() {
      var binding, _i, _len, _ref1;
      _ref1 = this.select(function(b) {
        var _ref1;
        return (_ref1 = b.binder) != null ? _ref1.publishes : void 0;
      });
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        binding = _ref1[_i];
        binding.publish();
      }
    };

    View.prototype.update = function(models) {
      var binding, key, model, _i, _len, _ref1;
      if (models == null) {
        models = {};
      }
      for (key in models) {
        model = models[key];
        this.models[key] = model;
      }
      _ref1 = this.bindings;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        binding = _ref1[_i];
        if (typeof binding.update === "function") {
          binding.update(models);
        }
      }
    };

    return View;

  })();

  Rivets.Binding = (function() {
    function Binding(view, el, type, keypath, options) {
      this.view = view;
      this.el = el;
      this.type = type;
      this.keypath = keypath;
      this.options = options != null ? options : {};
      this.getValue = __bind(this.getValue, this);
      this.update = __bind(this.update, this);
      this.unbind = __bind(this.unbind, this);
      this.bind = __bind(this.bind, this);
      this.publish = __bind(this.publish, this);
      this.sync = __bind(this.sync, this);
      this.set = __bind(this.set, this);
      this.eventHandler = __bind(this.eventHandler, this);
      this.formattedValue = __bind(this.formattedValue, this);
      this.parseFormatterArguments = __bind(this.parseFormatterArguments, this);
      this.parseTarget = __bind(this.parseTarget, this);
      this.observe = __bind(this.observe, this);
      this.setBinder = __bind(this.setBinder, this);
      this.formatters = this.options.formatters || [];
      this.dependencies = [];
      this.formatterObservers = {};
      this.model = void 0;
      this.setBinder();
    }

    Binding.prototype.setBinder = function() {
      var identifier, regexp, value, _ref1;
      if (!(this.binder = this.view.binders[this.type])) {
        _ref1 = this.view.binders;
        for (identifier in _ref1) {
          value = _ref1[identifier];
          if (identifier !== '*' && identifier.indexOf('*') !== -1) {
            regexp = new RegExp("^" + (identifier.replace(/\*/g, '.+')) + "$");
            if (regexp.test(this.type)) {
              this.binder = value;
              this.args = new RegExp("^" + (identifier.replace(/\*/g, '(.+)')) + "$").exec(this.type);
              this.args.shift();
            }
          }
        }
      }
      this.binder || (this.binder = this.view.binders['*']);
      if (this.binder instanceof Function) {
        return this.binder = {
          routine: this.binder
        };
      }
    };

    Binding.prototype.observe = function(obj, keypath, callback) {
      return Rivets.sightglass(obj, keypath, callback, {
        root: this.view.rootInterface,
        adapters: this.view.adapters
      });
    };

    Binding.prototype.parseTarget = function() {
      var token;
      token = Rivets.TypeParser.parse(this.keypath);
      if (token.type === Rivets.TypeParser.types.primitive) {
        return this.value = token.value;
      } else {
        this.observer = this.observe(this.view.models, this.keypath, this.sync);
        return this.model = this.observer.target;
      }
    };

    Binding.prototype.parseFormatterArguments = function(args, formatterIndex) {
      var ai, arg, observer, processedArgs, _base, _i, _len;
      args = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = args.length; _i < _len; _i++) {
          arg = args[_i];
          _results.push(Rivets.TypeParser.parse(arg));
        }
        return _results;
      })();
      processedArgs = [];
      for (ai = _i = 0, _len = args.length; _i < _len; ai = ++_i) {
        arg = args[ai];
        processedArgs.push(arg.type === Rivets.TypeParser.types.primitive ? arg.value : ((_base = this.formatterObservers)[formatterIndex] || (_base[formatterIndex] = {}), !(observer = this.formatterObservers[formatterIndex][ai]) ? (observer = this.observe(this.view.models, arg.value, this.sync), this.formatterObservers[formatterIndex][ai] = observer) : void 0, observer.value()));
      }
      return processedArgs;
    };

    Binding.prototype.formattedValue = function(value) {
      var args, fi, formatter, id, processedArgs, _i, _len, _ref1, _ref2;
      _ref1 = this.formatters;
      for (fi = _i = 0, _len = _ref1.length; _i < _len; fi = ++_i) {
        formatter = _ref1[fi];
        args = formatter.match(/[^\s']+|'([^']|'[^\s])*'|"([^"]|"[^\s])*"/g);
        id = args.shift();
        formatter = this.view.formatters[id];
        processedArgs = this.parseFormatterArguments(args, fi);
        if ((formatter != null ? formatter.read : void 0) instanceof Function) {
          value = (_ref2 = formatter.read).call.apply(_ref2, [this.model, value].concat(__slice.call(processedArgs)));
        } else if (formatter instanceof Function) {
          value = formatter.call.apply(formatter, [this.model, value].concat(__slice.call(processedArgs)));
        }
      }
      return value;
    };

    Binding.prototype.eventHandler = function(fn) {
      var binding, handler;
      handler = (binding = this).view.handler;
      return function(ev) {
        return handler.call(fn, this, ev, binding);
      };
    };

    Binding.prototype.set = function(value) {
      var _ref1;
      value = value instanceof Function && !this.binder["function"] && Rivets["public"].executeFunctions ? this.formattedValue(value.call(this.model)) : this.formattedValue(value);
      return (_ref1 = this.binder.routine) != null ? _ref1.call(this, this.el, value) : void 0;
    };

    Binding.prototype.sync = function() {
      var dependency, observer;
      return this.set((function() {
        var _i, _j, _len, _len1, _ref1, _ref2, _ref3;
        if (this.observer) {
          if (this.model !== this.observer.target) {
            _ref1 = this.dependencies;
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              observer = _ref1[_i];
              observer.unobserve();
            }
            this.dependencies = [];
            if (((this.model = this.observer.target) != null) && ((_ref2 = this.options.dependencies) != null ? _ref2.length : void 0)) {
              _ref3 = this.options.dependencies;
              for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
                dependency = _ref3[_j];
                observer = this.observe(this.model, dependency, this.sync);
                this.dependencies.push(observer);
              }
            }
          }
          return this.observer.value();
        } else {
          return this.value;
        }
      }).call(this));
    };

    Binding.prototype.publish = function() {
      var args, fi, fiReversed, formatter, id, lastformatterIndex, processedArgs, value, _i, _len, _ref1, _ref2, _ref3;
      if (this.observer) {
        value = this.getValue(this.el);
        lastformatterIndex = this.formatters.length - 1;
        _ref1 = this.formatters.slice(0).reverse();
        for (fiReversed = _i = 0, _len = _ref1.length; _i < _len; fiReversed = ++_i) {
          formatter = _ref1[fiReversed];
          fi = lastformatterIndex - fiReversed;
          args = formatter.split(/\s+/);
          id = args.shift();
          processedArgs = this.parseFormatterArguments(args, fi);
          if ((_ref2 = this.view.formatters[id]) != null ? _ref2.publish : void 0) {
            value = (_ref3 = this.view.formatters[id]).publish.apply(_ref3, [value].concat(__slice.call(processedArgs)));
          }
        }
        return this.observer.setValue(value);
      }
    };

    Binding.prototype.bind = function() {
      var dependency, observer, _i, _len, _ref1, _ref2, _ref3;
      this.parseTarget();
      if ((_ref1 = this.binder.bind) != null) {
        _ref1.call(this, this.el);
      }
      if ((this.model != null) && ((_ref2 = this.options.dependencies) != null ? _ref2.length : void 0)) {
        _ref3 = this.options.dependencies;
        for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
          dependency = _ref3[_i];
          observer = this.observe(this.model, dependency, this.sync);
          this.dependencies.push(observer);
        }
      }
      if (this.view.preloadData) {
        return this.sync();
      }
    };

    Binding.prototype.unbind = function() {
      var ai, args, fi, observer, _i, _len, _ref1, _ref2, _ref3, _ref4;
      if ((_ref1 = this.binder.unbind) != null) {
        _ref1.call(this, this.el);
      }
      if ((_ref2 = this.observer) != null) {
        _ref2.unobserve();
      }
      _ref3 = this.dependencies;
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        observer = _ref3[_i];
        observer.unobserve();
      }
      this.dependencies = [];
      _ref4 = this.formatterObservers;
      for (fi in _ref4) {
        args = _ref4[fi];
        for (ai in args) {
          observer = args[ai];
          observer.unobserve();
        }
      }
      return this.formatterObservers = {};
    };

    Binding.prototype.update = function(models) {
      var _ref1, _ref2;
      if (models == null) {
        models = {};
      }
      this.model = (_ref1 = this.observer) != null ? _ref1.target : void 0;
      return (_ref2 = this.binder.update) != null ? _ref2.call(this, models) : void 0;
    };

    Binding.prototype.getValue = function(el) {
      if (this.binder && (this.binder.getValue != null)) {
        return this.binder.getValue.call(this, el);
      } else {
        return Rivets.Util.getInputValue(el);
      }
    };

    return Binding;

  })();

  Rivets.ComponentBinding = (function(_super) {
    __extends(ComponentBinding, _super);

    function ComponentBinding(view, el, type) {
      var attribute, bindingRegExp, propertyName, token, _i, _len, _ref1, _ref2;
      this.view = view;
      this.el = el;
      this.type = type;
      this.unbind = __bind(this.unbind, this);
      this.bind = __bind(this.bind, this);
      this.locals = __bind(this.locals, this);
      this.component = this.view.components[this.type];
      this["static"] = {};
      this.observers = {};
      this.upstreamObservers = {};
      bindingRegExp = view.bindingRegExp();
      _ref1 = this.el.attributes || [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        attribute = _ref1[_i];
        if (!bindingRegExp.test(attribute.name)) {
          propertyName = this.camelCase(attribute.name);
          token = Rivets.TypeParser.parse(attribute.value);
          if (__indexOf.call((_ref2 = this.component["static"]) != null ? _ref2 : [], propertyName) >= 0) {
            this["static"][propertyName] = attribute.value;
          } else if (token.type === Rivets.TypeParser.types.primitive) {
            this["static"][propertyName] = token.value;
          } else {
            this.observers[propertyName] = attribute.value;
          }
        }
      }
    }

    ComponentBinding.prototype.sync = function() {};

    ComponentBinding.prototype.update = function() {};

    ComponentBinding.prototype.publish = function() {};

    ComponentBinding.prototype.locals = function() {
      var key, observer, result, value, _ref1, _ref2;
      result = {};
      _ref1 = this["static"];
      for (key in _ref1) {
        value = _ref1[key];
        result[key] = value;
      }
      _ref2 = this.observers;
      for (key in _ref2) {
        observer = _ref2[key];
        result[key] = observer.value();
      }
      return result;
    };

    ComponentBinding.prototype.camelCase = function(string) {
      return string.replace(/-([a-z])/g, function(grouped) {
        return grouped[1].toUpperCase();
      });
    };

    ComponentBinding.prototype.bind = function() {
      var k, key, keypath, observer, option, options, scope, v, _base, _i, _j, _len, _len1, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7;
      if (!this.bound) {
        _ref1 = this.observers;
        for (key in _ref1) {
          keypath = _ref1[key];
          this.observers[key] = this.observe(this.view.models, keypath, ((function(_this) {
            return function(key) {
              return function() {
                return _this.componentView.models[key] = _this.observers[key].value();
              };
            };
          })(this)).call(this, key));
        }
        this.bound = true;
      }
      if (this.componentView != null) {
        this.componentView.bind();
      } else {
        this.el.innerHTML = this.component.template.call(this);
        scope = this.component.initialize.call(this, this.el, this.locals());
        this.el._bound = true;
        options = {};
        _ref2 = Rivets.extensions;
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          option = _ref2[_i];
          options[option] = {};
          if (this.component[option]) {
            _ref3 = this.component[option];
            for (k in _ref3) {
              v = _ref3[k];
              options[option][k] = v;
            }
          }
          _ref4 = this.view[option];
          for (k in _ref4) {
            v = _ref4[k];
            if ((_base = options[option])[k] == null) {
              _base[k] = v;
            }
          }
        }
        _ref5 = Rivets.options;
        for (_j = 0, _len1 = _ref5.length; _j < _len1; _j++) {
          option = _ref5[_j];
          options[option] = (_ref6 = this.component[option]) != null ? _ref6 : this.view[option];
        }
        this.componentView = new Rivets.View(Array.prototype.slice.call(this.el.childNodes), scope, options);
        this.componentView.bind();
        _ref7 = this.observers;
        for (key in _ref7) {
          observer = _ref7[key];
          this.upstreamObservers[key] = this.observe(this.componentView.models, key, ((function(_this) {
            return function(key, observer) {
              return function() {
                return observer.setValue(_this.componentView.models[key]);
              };
            };
          })(this)).call(this, key, observer));
        }
      }
    };

    ComponentBinding.prototype.unbind = function() {
      var key, observer, _ref1, _ref2, _ref3;
      _ref1 = this.upstreamObservers;
      for (key in _ref1) {
        observer = _ref1[key];
        observer.unobserve();
      }
      _ref2 = this.observers;
      for (key in _ref2) {
        observer = _ref2[key];
        observer.unobserve();
      }
      return (_ref3 = this.componentView) != null ? _ref3.unbind.call(this) : void 0;
    };

    return ComponentBinding;

  })(Rivets.Binding);

  Rivets.TextBinding = (function(_super) {
    __extends(TextBinding, _super);

    function TextBinding(view, el, type, keypath, options) {
      this.view = view;
      this.el = el;
      this.type = type;
      this.keypath = keypath;
      this.options = options != null ? options : {};
      this.sync = __bind(this.sync, this);
      this.formatters = this.options.formatters || [];
      this.dependencies = [];
      this.formatterObservers = {};
    }

    TextBinding.prototype.binder = {
      routine: function(node, value) {
        return node.data = value != null ? value : '';
      }
    };

    TextBinding.prototype.sync = function() {
      return TextBinding.__super__.sync.apply(this, arguments);
    };

    return TextBinding;

  })(Rivets.Binding);

  Rivets["public"].binders.text = function(el, value) {
    if (el.textContent != null) {
      return el.textContent = value != null ? value : '';
    } else {
      return el.innerText = value != null ? value : '';
    }
  };

  Rivets["public"].binders.html = function(el, value) {
    return el.innerHTML = value != null ? value : '';
  };

  Rivets["public"].binders.show = function(el, value) {
    return el.style.display = value ? '' : 'none';
  };

  Rivets["public"].binders.hide = function(el, value) {
    return el.style.display = value ? 'none' : '';
  };

  Rivets["public"].binders.enabled = function(el, value) {
    return el.disabled = !value;
  };

  Rivets["public"].binders.disabled = function(el, value) {
    return el.disabled = !!value;
  };

  Rivets["public"].binders.checked = {
    publishes: true,
    priority: 2000,
    bind: function(el) {
      return Rivets.Util.bindEvent(el, 'change', this.publish);
    },
    unbind: function(el) {
      return Rivets.Util.unbindEvent(el, 'change', this.publish);
    },
    routine: function(el, value) {
      var _ref1;
      if (el.type === 'radio') {
        return el.checked = ((_ref1 = el.value) != null ? _ref1.toString() : void 0) === (value != null ? value.toString() : void 0);
      } else {
        return el.checked = !!value;
      }
    }
  };

  Rivets["public"].binders.unchecked = {
    publishes: true,
    priority: 2000,
    bind: function(el) {
      return Rivets.Util.bindEvent(el, 'change', this.publish);
    },
    unbind: function(el) {
      return Rivets.Util.unbindEvent(el, 'change', this.publish);
    },
    routine: function(el, value) {
      var _ref1;
      if (el.type === 'radio') {
        return el.checked = ((_ref1 = el.value) != null ? _ref1.toString() : void 0) !== (value != null ? value.toString() : void 0);
      } else {
        return el.checked = !value;
      }
    }
  };

  Rivets["public"].binders.value = {
    publishes: true,
    priority: 3000,
    bind: function(el) {
      if (!(el.tagName === 'INPUT' && el.type === 'radio')) {
        this.event = el.tagName === 'SELECT' ? 'change' : 'input';
        return Rivets.Util.bindEvent(el, this.event, this.publish);
      }
    },
    unbind: function(el) {
      if (!(el.tagName === 'INPUT' && el.type === 'radio')) {
        return Rivets.Util.unbindEvent(el, this.event, this.publish);
      }
    },
    routine: function(el, value) {
      var o, _i, _len, _ref1, _ref2, _ref3, _results;
      if (el.tagName === 'INPUT' && el.type === 'radio') {
        return el.setAttribute('value', value);
      } else if (window.jQuery != null) {
        el = jQuery(el);
        if ((value != null ? value.toString() : void 0) !== ((_ref1 = el.val()) != null ? _ref1.toString() : void 0)) {
          return el.val(value != null ? value : '');
        }
      } else {
        if (el.type === 'select-multiple') {
          if (value != null) {
            _results = [];
            for (_i = 0, _len = el.length; _i < _len; _i++) {
              o = el[_i];
              _results.push(o.selected = (_ref2 = o.value, __indexOf.call(value, _ref2) >= 0));
            }
            return _results;
          }
        } else if ((value != null ? value.toString() : void 0) !== ((_ref3 = el.value) != null ? _ref3.toString() : void 0)) {
          return el.value = value != null ? value : '';
        }
      }
    }
  };

  Rivets["public"].binders["if"] = {
    block: true,
    priority: 4000,
    bind: function(el) {
      var attr, declaration;
      if (this.marker == null) {
        attr = [this.view.prefix, this.type].join('-').replace('--', '-');
        declaration = el.getAttribute(attr);
        this.marker = document.createComment(" rivets: " + this.type + " " + declaration + " ");
        this.bound = false;
        el.removeAttribute(attr);
        el.parentNode.insertBefore(this.marker, el);
        return el.parentNode.removeChild(el);
      }
    },
    unbind: function() {
      if (this.nested) {
        this.nested.unbind();
        return this.bound = false;
      }
    },
    routine: function(el, value) {
      var key, model, models, _ref1;
      if (!!value === !this.bound) {
        if (value) {
          models = {};
          _ref1 = this.view.models;
          for (key in _ref1) {
            model = _ref1[key];
            models[key] = model;
          }
          (this.nested || (this.nested = new Rivets.View(el, models, this.view.options()))).bind();
          this.marker.parentNode.insertBefore(el, this.marker.nextSibling);
          return this.bound = true;
        } else {
          el.parentNode.removeChild(el);
          this.nested.unbind();
          return this.bound = false;
        }
      }
    },
    update: function(models) {
      var _ref1;
      return (_ref1 = this.nested) != null ? _ref1.update(models) : void 0;
    }
  };

  Rivets["public"].binders.unless = {
    block: true,
    priority: 4000,
    bind: function(el) {
      return Rivets["public"].binders["if"].bind.call(this, el);
    },
    unbind: function() {
      return Rivets["public"].binders["if"].unbind.call(this);
    },
    routine: function(el, value) {
      return Rivets["public"].binders["if"].routine.call(this, el, !value);
    },
    update: function(models) {
      return Rivets["public"].binders["if"].update.call(this, models);
    }
  };

  Rivets["public"].binders['on-*'] = {
    "function": true,
    priority: 1000,
    unbind: function(el) {
      if (this.handler) {
        return Rivets.Util.unbindEvent(el, this.args[0], this.handler);
      }
    },
    routine: function(el, value) {
      if (this.handler) {
        Rivets.Util.unbindEvent(el, this.args[0], this.handler);
      }
      return Rivets.Util.bindEvent(el, this.args[0], this.handler = this.eventHandler(value));
    }
  };

  Rivets["public"].binders['each-*'] = {
    block: true,
    priority: 4000,
    bind: function(el) {
      var attr, view, _i, _len, _ref1;
      if (this.marker == null) {
        attr = [this.view.prefix, this.type].join('-').replace('--', '-');
        this.marker = document.createComment(" rivets: " + this.type + " ");
        this.iterated = [];
        el.removeAttribute(attr);
        el.parentNode.insertBefore(this.marker, el);
        el.parentNode.removeChild(el);
      } else {
        _ref1 = this.iterated;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          view = _ref1[_i];
          view.bind();
        }
      }
    },
    unbind: function(el) {
      var view, _i, _len, _ref1;
      if (this.iterated != null) {
        _ref1 = this.iterated;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          view = _ref1[_i];
          view.unbind();
        }
      }
    },
    routine: function(el, collection) {
      var binding, data, i, index, key, model, modelName, options, previous, template, view, _i, _j, _k, _len, _len1, _len2, _ref1, _ref2, _ref3;
      modelName = this.args[0];
      collection = collection || [];
      if (this.iterated.length > collection.length) {
        _ref1 = Array(this.iterated.length - collection.length);
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          i = _ref1[_i];
          view = this.iterated.pop();
          view.unbind();
          this.marker.parentNode.removeChild(view.els[0]);
        }
      }
      for (index = _j = 0, _len1 = collection.length; _j < _len1; index = ++_j) {
        model = collection[index];
        data = {
          index: index
        };
        data[Rivets["public"].iterationAlias(modelName)] = index;
        data[modelName] = model;
        if (this.iterated[index] == null) {
          _ref2 = this.view.models;
          for (key in _ref2) {
            model = _ref2[key];
            if (data[key] == null) {
              data[key] = model;
            }
          }
          previous = this.iterated.length ? this.iterated[this.iterated.length - 1].els[0] : this.marker;
          options = this.view.options();
          options.preloadData = true;
          template = el.cloneNode(true);
          view = new Rivets.View(template, data, options);
          view.bind();
          this.iterated.push(view);
          this.marker.parentNode.insertBefore(template, previous.nextSibling);
        } else if (this.iterated[index].models[modelName] !== model) {
          this.iterated[index].update(data);
        }
      }
      if (el.nodeName === 'OPTION') {
        _ref3 = this.view.bindings;
        for (_k = 0, _len2 = _ref3.length; _k < _len2; _k++) {
          binding = _ref3[_k];
          if (binding.el === this.marker.parentNode && binding.type === 'value') {
            binding.sync();
          }
        }
      }
    },
    update: function(models) {
      var data, key, model, view, _i, _len, _ref1;
      data = {};
      for (key in models) {
        model = models[key];
        if (key !== this.args[0]) {
          data[key] = model;
        }
      }
      _ref1 = this.iterated;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        view = _ref1[_i];
        view.update(data);
      }
    }
  };

  Rivets["public"].binders['class-*'] = function(el, value) {
    var elClass;
    elClass = " " + el.className + " ";
    if (!value === (elClass.indexOf(" " + this.args[0] + " ") !== -1)) {
      return el.className = value ? "" + el.className + " " + this.args[0] : elClass.replace(" " + this.args[0] + " ", ' ').trim();
    }
  };

  Rivets["public"].binders['*'] = function(el, value) {
    if (value != null) {
      return el.setAttribute(this.type, value);
    } else {
      return el.removeAttribute(this.type);
    }
  };

  Rivets["public"].formatters['call'] = function() {
    var args, value;
    value = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return value.call.apply(value, [this].concat(__slice.call(args)));
  };

  Rivets["public"].adapters['.'] = {
    id: '_rv',
    counter: 0,
    weakmap: {},
    weakReference: function(obj) {
      var id, _base, _name;
      if (!obj.hasOwnProperty(this.id)) {
        id = this.counter++;
        Object.defineProperty(obj, this.id, {
          value: id
        });
      }
      return (_base = this.weakmap)[_name = obj[this.id]] || (_base[_name] = {
        callbacks: {}
      });
    },
    cleanupWeakReference: function(ref, id) {
      if (!Object.keys(ref.callbacks).length) {
        if (!(ref.pointers && Object.keys(ref.pointers).length)) {
          return delete this.weakmap[id];
        }
      }
    },
    stubFunction: function(obj, fn) {
      var map, original, weakmap;
      original = obj[fn];
      map = this.weakReference(obj);
      weakmap = this.weakmap;
      return obj[fn] = function() {
        var callback, k, r, response, _i, _len, _ref1, _ref2, _ref3, _ref4;
        response = original.apply(obj, arguments);
        _ref1 = map.pointers;
        for (r in _ref1) {
          k = _ref1[r];
          _ref4 = (_ref2 = (_ref3 = weakmap[r]) != null ? _ref3.callbacks[k] : void 0) != null ? _ref2 : [];
          for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
            callback = _ref4[_i];
            callback();
          }
        }
        return response;
      };
    },
    observeMutations: function(obj, ref, keypath) {
      var fn, functions, map, _base, _i, _len;
      if (Array.isArray(obj)) {
        map = this.weakReference(obj);
        if (map.pointers == null) {
          map.pointers = {};
          functions = ['push', 'pop', 'shift', 'unshift', 'sort', 'reverse', 'splice'];
          for (_i = 0, _len = functions.length; _i < _len; _i++) {
            fn = functions[_i];
            this.stubFunction(obj, fn);
          }
        }
        if ((_base = map.pointers)[ref] == null) {
          _base[ref] = [];
        }
        if (__indexOf.call(map.pointers[ref], keypath) < 0) {
          return map.pointers[ref].push(keypath);
        }
      }
    },
    unobserveMutations: function(obj, ref, keypath) {
      var idx, map, pointers;
      if (Array.isArray(obj) && (obj[this.id] != null)) {
        if (map = this.weakmap[obj[this.id]]) {
          if (pointers = map.pointers[ref]) {
            if ((idx = pointers.indexOf(keypath)) >= 0) {
              pointers.splice(idx, 1);
            }
            if (!pointers.length) {
              delete map.pointers[ref];
            }
            return this.cleanupWeakReference(map, obj[this.id]);
          }
        }
      }
    },
    observe: function(obj, keypath, callback) {
      var callbacks, desc, value;
      callbacks = this.weakReference(obj).callbacks;
      if (callbacks[keypath] == null) {
        callbacks[keypath] = [];
        desc = Object.getOwnPropertyDescriptor(obj, keypath);
        if (!((desc != null ? desc.get : void 0) || (desc != null ? desc.set : void 0))) {
          value = obj[keypath];
          Object.defineProperty(obj, keypath, {
            enumerable: true,
            get: function() {
              return value;
            },
            set: (function(_this) {
              return function(newValue) {
                var cb, map, _i, _len, _ref1;
                if (newValue !== value) {
                  _this.unobserveMutations(value, obj[_this.id], keypath);
                  value = newValue;
                  if (map = _this.weakmap[obj[_this.id]]) {
                    callbacks = map.callbacks;
                    if (callbacks[keypath]) {
                      _ref1 = callbacks[keypath].slice();
                      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                        cb = _ref1[_i];
                        if (__indexOf.call(callbacks[keypath], cb) >= 0) {
                          cb();
                        }
                      }
                    }
                    return _this.observeMutations(newValue, obj[_this.id], keypath);
                  }
                }
              };
            })(this)
          });
        }
      }
      if (__indexOf.call(callbacks[keypath], callback) < 0) {
        callbacks[keypath].push(callback);
      }
      return this.observeMutations(obj[keypath], obj[this.id], keypath);
    },
    unobserve: function(obj, keypath, callback) {
      var callbacks, idx, map;
      if (map = this.weakmap[obj[this.id]]) {
        if (callbacks = map.callbacks[keypath]) {
          if ((idx = callbacks.indexOf(callback)) >= 0) {
            callbacks.splice(idx, 1);
            if (!callbacks.length) {
              delete map.callbacks[keypath];
              this.unobserveMutations(obj[keypath], obj[this.id], keypath);
            }
          }
          return this.cleanupWeakReference(map, obj[this.id]);
        }
      }
    },
    get: function(obj, keypath) {
      return obj[keypath];
    },
    set: function(obj, keypath, value) {
      return obj[keypath] = value;
    }
  };

  Rivets.factory = function(sightglass) {
    Rivets.sightglass = sightglass;
    Rivets["public"]._ = Rivets;
    return Rivets["public"];
  };

  if (typeof (typeof module !== "undefined" && module !== null ? module.exports : void 0) === 'object') {
    module.exports = Rivets.factory(require('sightglass'));
  } else if (typeof define === 'function' && define.amd) {
    define(['sightglass'], function(sightglass) {
      return this.rivets = Rivets.factory(sightglass);
    });
  } else {
    this.rivets = Rivets.factory(sightglass);
  }

}).call(this);

},{"sightglass":6}],6:[function(require,module,exports){
(function() {
  // Public sightglass interface.
  function sightglass(obj, keypath, callback, options) {
    return new Observer(obj, keypath, callback, options)
  }

  // Batteries not included.
  sightglass.adapters = {}

  // Constructs a new keypath observer and kicks things off.
  function Observer(obj, keypath, callback, options) {
    this.options = options || {}
    this.options.adapters = this.options.adapters || {}
    this.obj = obj
    this.keypath = keypath
    this.callback = callback
    this.objectPath = []
    this.update = this.update.bind(this)
    this.parse()

    if (isObject(this.target = this.realize())) {
      this.set(true, this.key, this.target, this.callback)
    }
  }

  // Tokenizes the provided keypath string into interface + path tokens for the
  // observer to work with.
  Observer.tokenize = function(keypath, interfaces, root) {
    var tokens = []
    var current = {i: root, path: ''}
    var index, chr

    for (index = 0; index < keypath.length; index++) {
      chr = keypath.charAt(index)

      if (!!~interfaces.indexOf(chr)) {
        tokens.push(current)
        current = {i: chr, path: ''}
      } else {
        current.path += chr
      }
    }

    tokens.push(current)
    return tokens
  }

  // Parses the keypath using the interfaces defined on the view. Sets variables
  // for the tokenized keypath as well as the end key.
  Observer.prototype.parse = function() {
    var interfaces = this.interfaces()
    var root, path

    if (!interfaces.length) {
      error('Must define at least one adapter interface.')
    }

    if (!!~interfaces.indexOf(this.keypath[0])) {
      root = this.keypath[0]
      path = this.keypath.substr(1)
    } else {
      if (typeof (root = this.options.root || sightglass.root) === 'undefined') {
        error('Must define a default root adapter.')
      }

      path = this.keypath
    }

    this.tokens = Observer.tokenize(path, interfaces, root)
    this.key = this.tokens.pop()
  }

  // Realizes the full keypath, attaching observers for every key and correcting
  // old observers to any changed objects in the keypath.
  Observer.prototype.realize = function() {
    var current = this.obj
    var unreached = false
    var prev

    this.tokens.forEach(function(token, index) {
      if (isObject(current)) {
        if (typeof this.objectPath[index] !== 'undefined') {
          if (current !== (prev = this.objectPath[index])) {
            this.set(false, token, prev, this.update)
            this.set(true, token, current, this.update)
            this.objectPath[index] = current
          }
        } else {
          this.set(true, token, current, this.update)
          this.objectPath[index] = current
        }

        current = this.get(token, current)
      } else {
        if (unreached === false) {
          unreached = index
        }

        if (prev = this.objectPath[index]) {
          this.set(false, token, prev, this.update)
        }
      }
    }, this)

    if (unreached !== false) {
      this.objectPath.splice(unreached)
    }

    return current
  }

  // Updates the keypath. This is called when any intermediary key is changed.
  Observer.prototype.update = function() {
    var next, oldValue

    if ((next = this.realize()) !== this.target) {
      if (isObject(this.target)) {
        this.set(false, this.key, this.target, this.callback)
      }

      if (isObject(next)) {
        this.set(true, this.key, next, this.callback)
      }

      oldValue = this.value()
      this.target = next

      // Always call callback if value is a function. If not a function, call callback only if value changed
      if (this.value() instanceof Function || this.value() !== oldValue) this.callback()
    }
  }

  // Reads the current end value of the observed keypath. Returns undefined if
  // the full keypath is unreachable.
  Observer.prototype.value = function() {
    if (isObject(this.target)) {
      return this.get(this.key, this.target)
    }
  }

  // Sets the current end value of the observed keypath. Calling setValue when
  // the full keypath is unreachable is a no-op.
  Observer.prototype.setValue = function(value) {
    if (isObject(this.target)) {
      this.adapter(this.key).set(this.target, this.key.path, value)
    }
  }

  // Gets the provided key on an object.
  Observer.prototype.get = function(key, obj) {
    return this.adapter(key).get(obj, key.path)
  }

  // Observes or unobserves a callback on the object using the provided key.
  Observer.prototype.set = function(active, key, obj, callback) {
    var action = active ? 'observe' : 'unobserve'
    this.adapter(key)[action](obj, key.path, callback)
  }

  // Returns an array of all unique adapter interfaces available.
  Observer.prototype.interfaces = function() {
    var interfaces = Object.keys(this.options.adapters)

    Object.keys(sightglass.adapters).forEach(function(i) {
      if (!~interfaces.indexOf(i)) {
        interfaces.push(i)
      }
    })

    return interfaces
  }

  // Convenience function to grab the adapter for a specific key.
  Observer.prototype.adapter = function(key) {
    return this.options.adapters[key.i] ||
      sightglass.adapters[key.i]
  }

  // Unobserves the entire keypath.
  Observer.prototype.unobserve = function() {
    var obj

    this.tokens.forEach(function(token, index) {
      if (obj = this.objectPath[index]) {
        this.set(false, token, obj, this.update)
      }
    }, this)

    if (isObject(this.target)) {
      this.set(false, this.key, this.target, this.callback)
    }
  }

  // Check if a value is an object than can be observed.
  function isObject(obj) {
    return typeof obj === 'object' && obj !== null
  }

  // Error thrower.
  function error(message) {
    throw new Error('[sightglass] ' + message)
  }

  // Export module for Node and the browser.
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = sightglass
  } else if (typeof define === 'function' && define.amd) {
    define([], function() {
      return this.sightglass = sightglass
    })
  } else {
    this.sightglass = sightglass
  }
}).call(this);

},{}],7:[function(require,module,exports){
'use strict';
module.exports = function (str) {
	return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
		return '%' + c.charCodeAt(0).toString(16).toUpperCase();
	});
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy5udm0vdmVyc2lvbnMvbm9kZS92NS4wLjAvbGliL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjbGllbnQuanMiLCJub2RlX21vZHVsZXMvZG9tcmVhZHkvcmVhZHkuanMiLCJub2RlX21vZHVsZXMvb2JqZWN0LWFzc2lnbi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9xdWVyeS1zdHJpbmcvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcml2ZXRzL2Rpc3Qvcml2ZXRzLmpzIiwibm9kZV9tb2R1bGVzL3NpZ2h0Z2xhc3MvaW5kZXguanMiLCJub2RlX21vZHVsZXMvc3RyaWN0LXVyaS1lbmNvZGUvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOTNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ROQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbnZhciByaXZldHMgPSByZXF1aXJlKCdyaXZldHMnKSxcbiAgICBxdWVyeVN0cmluZyA9IHJlcXVpcmUoJ3F1ZXJ5LXN0cmluZycpLFxuICAgIGRvbVJlYWR5ID0gcmVxdWlyZSgnZG9tcmVhZHknKSxcbiAgICB2aWV3ID0ge1xuICAgICAgICBwbHVnaW5zIDogd2luZG93LnBsdWdpbnMsXG4gICAgICAgIGFjdGl2ZVRhYiA6ICdnZW5lcmFsJyxcblxuICAgICAgICB0YWJzIDoge1xuICAgICAgICAgICAgZ2VuZXJhbCA6ICdnZW5lcmFsJyxcbiAgICAgICAgICAgIHBsdWdpbnMgOiAncGx1Z2lucydcbiAgICAgICAgfSxcblxuICAgICAgICBoYW5kbGVQbHVnaW5DaGVjayA6IGhhbmRsZVBsdWdpbkNoZWNrLFxuICAgICAgICBoYW5kbGVUYWJDbGlja2VkIDogaGFuZGxlVGFiQ2xpY2tlZFxuICAgIH07XG5cbmZ1bmN0aW9uIGluaXQoKSB7XG4gICAgdmlldy5hY3RpdmVUYWIgPSBxdWVyeVN0cmluZy5wYXJzZSh3aW5kb3cubG9jYXRpb24uaGFzaCkudGFiO1xuXG4gICAgYmluZFZpZXcoKTtcbn1cblxuZnVuY3Rpb24gYmluZFZpZXcoKSB7XG4gICAgcml2ZXRzLmZvcm1hdHRlcnMuZXF1YWxzID0gZnVuY3Rpb24oY29tcGFyYXRvciwgY29tcGFyYXRlZSkge1xuICAgICAgICByZXR1cm4gY29tcGFyYXRvciA9PT0gY29tcGFyYXRlZTtcbiAgICB9O1xuXG4gICAgcml2ZXRzLmJpbmQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3NldHRpbmdzJyksIHsgdmlldyA6IHZpZXcgfSk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZVRhYkNsaWNrZWQoZXZlbnQpIHtcbiAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9IHF1ZXJ5U3RyaW5nLnN0cmluZ2lmeSh7IHRhYiA6IGV2ZW50LmN1cnJlbnRUYXJnZXQuZ2V0QXR0cmlidXRlKCd0YWItbmFtZScpIH0pO1xuICAgIHZpZXcuYWN0aXZlVGFiID0gZXZlbnQuY3VycmVudFRhcmdldC5nZXRBdHRyaWJ1dGUoJ3RhYi1uYW1lJyk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZVBsdWdpbkNoZWNrKCkge1xuICAgIHdpbmRvdy5naC5tb2RhbFNlcnZpY2Uuc2hvd0lucHV0TW9kYWwoKTsgLy8gcmV0dXJucyB0aGUgbW9kYWwgaW5zdGFuY2UuXG5cbiAgICAvLyBtb2RhbC5zaG93KClcbiAgICAvLyAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgLy8gICAgICAgICBjb25zb2xlLmxvZygnVEhFTiBXQVMgQ0FMTEVEJyk7XG4gICAgLy8gICAgIH0pXG4gICAgLy8gICAgIC5jYXRjaChmdW5jdGlvbigpIHtcbiAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKCdDQVRDSCBXQVMgQ0FMTEVEJyk7XG4gICAgLy8gICAgIH0pO1xuXG4gICAgLy8gbW9kYWwuY2FuQ2xvc2UoKSAvLyBjYWxsZWQgd2hlbiB0aGUgdXNlciB3YW50cyB0byBjbG9zZSB0aGUgbW9kYWwuIHJldHVybiB0cnVlIGlmIGl0IGlzIG9rLlxuICAgIC8vICAgICAuc2hvdygpIC8vIGtpY2tzIG9mIHRoZSBjaGFpbiByZXR1cm5zIGEgcHJvbWlzZS5cbiAgICAvLyAgICAgLnRoZW4oZnVuY3Rpb24oKSB7IC8vIHVzZSBjbGlja2VkIGNvbmZpcm1cbiAgICAvLyAgICAgICAgIC8vIGRvIHNvbWUgd29yay5cbiAgICAvLyAgICAgICAgIC8vIG1vZGFsLmNsb3NlKCk7XG4gICAgLy8gICAgIH0pXG4gICAgLy8gICAgIC5jYXRjaCgpOyAvLyB1c2VyIGNsaWNrZWQgY2FuY2VsLiBvciBjbG9zZWQgaXQuXG5cbiAgICAvLyBzZXRUaW1lb3V0KG1vZGFsLmhpZGUsIDUwMDApO1xuICAgIC8vIHdpbmRvdy5naC5hcHBTdGF0ZVxuICAgIC8vICAgICAudHJhbnNmb3JtKCdjb25maWdzLm1lbnVJdGVtcycpXG4gICAgLy8gICAgIC53aXRoKGZ1bmN0aW9uKG1lbnVJdGVtcywgaXRlbSkge1xuICAgIC8vICAgICAgICAgbWVudUl0ZW1zLnB1c2goaXRlbSk7XG4gICAgLy8gICAgICAgICByZXR1cm4gbWVudUl0ZW1zO1xuICAgIC8vICAgICB9KVxuICAgIC8vICAgICAudXNpbmcoe1xuICAgIC8vICAgICAgICAgJ3Nob3dXaGVuVXNlclJvbGVJbmNsdWRlcycgOiAnYWRtaW4nLFxuICAgIC8vICAgICAgICAgJ25hbWUnIDogJ0Rhd2cnLFxuICAgIC8vICAgICAgICAgJ2hyZWYnIDogJy9hZG1pbi9jb250ZW50LXR5cGVzJyxcbiAgICAvLyAgICAgICAgICdpY29uQ2xhc3NlcycgOiAnZmEgZmEtcmVmcmVzaCBmYS1zcGluJ1xuICAgIC8vICAgICB9KTtcbn1cblxuZG9tUmVhZHkoaW5pdCk7XG4iLCIvKiFcbiAgKiBkb21yZWFkeSAoYykgRHVzdGluIERpYXogMjAxNCAtIExpY2Vuc2UgTUlUXG4gICovXG4hZnVuY3Rpb24gKG5hbWUsIGRlZmluaXRpb24pIHtcblxuICBpZiAodHlwZW9mIG1vZHVsZSAhPSAndW5kZWZpbmVkJykgbW9kdWxlLmV4cG9ydHMgPSBkZWZpbml0aW9uKClcbiAgZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBkZWZpbmUuYW1kID09ICdvYmplY3QnKSBkZWZpbmUoZGVmaW5pdGlvbilcbiAgZWxzZSB0aGlzW25hbWVdID0gZGVmaW5pdGlvbigpXG5cbn0oJ2RvbXJlYWR5JywgZnVuY3Rpb24gKCkge1xuXG4gIHZhciBmbnMgPSBbXSwgbGlzdGVuZXJcbiAgICAsIGRvYyA9IGRvY3VtZW50XG4gICAgLCBoYWNrID0gZG9jLmRvY3VtZW50RWxlbWVudC5kb1Njcm9sbFxuICAgICwgZG9tQ29udGVudExvYWRlZCA9ICdET01Db250ZW50TG9hZGVkJ1xuICAgICwgbG9hZGVkID0gKGhhY2sgPyAvXmxvYWRlZHxeYy8gOiAvXmxvYWRlZHxeaXxeYy8pLnRlc3QoZG9jLnJlYWR5U3RhdGUpXG5cblxuICBpZiAoIWxvYWRlZClcbiAgZG9jLmFkZEV2ZW50TGlzdGVuZXIoZG9tQ29udGVudExvYWRlZCwgbGlzdGVuZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgZG9jLnJlbW92ZUV2ZW50TGlzdGVuZXIoZG9tQ29udGVudExvYWRlZCwgbGlzdGVuZXIpXG4gICAgbG9hZGVkID0gMVxuICAgIHdoaWxlIChsaXN0ZW5lciA9IGZucy5zaGlmdCgpKSBsaXN0ZW5lcigpXG4gIH0pXG5cbiAgcmV0dXJuIGZ1bmN0aW9uIChmbikge1xuICAgIGxvYWRlZCA/IHNldFRpbWVvdXQoZm4sIDApIDogZm5zLnB1c2goZm4pXG4gIH1cblxufSk7XG4iLCIndXNlIHN0cmljdCc7XG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBwcm9wSXNFbnVtZXJhYmxlID0gT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcblxuZnVuY3Rpb24gdG9PYmplY3QodmFsKSB7XG5cdGlmICh2YWwgPT09IG51bGwgfHwgdmFsID09PSB1bmRlZmluZWQpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QuYXNzaWduIGNhbm5vdCBiZSBjYWxsZWQgd2l0aCBudWxsIG9yIHVuZGVmaW5lZCcpO1xuXHR9XG5cblx0cmV0dXJuIE9iamVjdCh2YWwpO1xufVxuXG5mdW5jdGlvbiBzaG91bGRVc2VOYXRpdmUoKSB7XG5cdHRyeSB7XG5cdFx0aWYgKCFPYmplY3QuYXNzaWduKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gRGV0ZWN0IGJ1Z2d5IHByb3BlcnR5IGVudW1lcmF0aW9uIG9yZGVyIGluIG9sZGVyIFY4IHZlcnNpb25zLlxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9NDExOFxuXHRcdHZhciB0ZXN0MSA9IG5ldyBTdHJpbmcoJ2FiYycpOyAgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuXHRcdHRlc3QxWzVdID0gJ2RlJztcblx0XHRpZiAoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDEpWzBdID09PSAnNScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QyID0ge307XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG5cdFx0XHR0ZXN0MlsnXycgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGkpXSA9IGk7XG5cdFx0fVxuXHRcdHZhciBvcmRlcjIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MikubWFwKGZ1bmN0aW9uIChuKSB7XG5cdFx0XHRyZXR1cm4gdGVzdDJbbl07XG5cdFx0fSk7XG5cdFx0aWYgKG9yZGVyMi5qb2luKCcnKSAhPT0gJzAxMjM0NTY3ODknKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MyA9IHt9O1xuXHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcuc3BsaXQoJycpLmZvckVhY2goZnVuY3Rpb24gKGxldHRlcikge1xuXHRcdFx0dGVzdDNbbGV0dGVyXSA9IGxldHRlcjtcblx0XHR9KTtcblx0XHRpZiAoT2JqZWN0LmtleXMoT2JqZWN0LmFzc2lnbih7fSwgdGVzdDMpKS5qb2luKCcnKSAhPT1cblx0XHRcdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0Ly8gV2UgZG9uJ3QgZXhwZWN0IGFueSBvZiB0aGUgYWJvdmUgdG8gdGhyb3csIGJ1dCBiZXR0ZXIgdG8gYmUgc2FmZS5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzaG91bGRVc2VOYXRpdmUoKSA/IE9iamVjdC5hc3NpZ24gOiBmdW5jdGlvbiAodGFyZ2V0LCBzb3VyY2UpIHtcblx0dmFyIGZyb207XG5cdHZhciB0byA9IHRvT2JqZWN0KHRhcmdldCk7XG5cdHZhciBzeW1ib2xzO1xuXG5cdGZvciAodmFyIHMgPSAxOyBzIDwgYXJndW1lbnRzLmxlbmd0aDsgcysrKSB7XG5cdFx0ZnJvbSA9IE9iamVjdChhcmd1bWVudHNbc10pO1xuXG5cdFx0Zm9yICh2YXIga2V5IGluIGZyb20pIHtcblx0XHRcdGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGZyb20sIGtleSkpIHtcblx0XHRcdFx0dG9ba2V5XSA9IGZyb21ba2V5XTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scykge1xuXHRcdFx0c3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMoZnJvbSk7XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHN5bWJvbHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aWYgKHByb3BJc0VudW1lcmFibGUuY2FsbChmcm9tLCBzeW1ib2xzW2ldKSkge1xuXHRcdFx0XHRcdHRvW3N5bWJvbHNbaV1dID0gZnJvbVtzeW1ib2xzW2ldXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiB0bztcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgc3RyaWN0VXJpRW5jb2RlID0gcmVxdWlyZSgnc3RyaWN0LXVyaS1lbmNvZGUnKTtcbnZhciBvYmplY3RBc3NpZ24gPSByZXF1aXJlKCdvYmplY3QtYXNzaWduJyk7XG5cbmZ1bmN0aW9uIGVuY29kZSh2YWx1ZSwgb3B0cykge1xuXHRpZiAob3B0cy5lbmNvZGUpIHtcblx0XHRyZXR1cm4gb3B0cy5zdHJpY3QgPyBzdHJpY3RVcmlFbmNvZGUodmFsdWUpIDogZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKTtcblx0fVxuXG5cdHJldHVybiB2YWx1ZTtcbn1cblxuZXhwb3J0cy5leHRyYWN0ID0gZnVuY3Rpb24gKHN0cikge1xuXHRyZXR1cm4gc3RyLnNwbGl0KCc/JylbMV0gfHwgJyc7XG59O1xuXG5leHBvcnRzLnBhcnNlID0gZnVuY3Rpb24gKHN0cikge1xuXHQvLyBDcmVhdGUgYW4gb2JqZWN0IHdpdGggbm8gcHJvdG90eXBlXG5cdC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9zaW5kcmVzb3JodXMvcXVlcnktc3RyaW5nL2lzc3Vlcy80N1xuXHR2YXIgcmV0ID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuXHRpZiAodHlwZW9mIHN0ciAhPT0gJ3N0cmluZycpIHtcblx0XHRyZXR1cm4gcmV0O1xuXHR9XG5cblx0c3RyID0gc3RyLnRyaW0oKS5yZXBsYWNlKC9eKFxcP3wjfCYpLywgJycpO1xuXG5cdGlmICghc3RyKSB7XG5cdFx0cmV0dXJuIHJldDtcblx0fVxuXG5cdHN0ci5zcGxpdCgnJicpLmZvckVhY2goZnVuY3Rpb24gKHBhcmFtKSB7XG5cdFx0dmFyIHBhcnRzID0gcGFyYW0ucmVwbGFjZSgvXFwrL2csICcgJykuc3BsaXQoJz0nKTtcblx0XHQvLyBGaXJlZm94IChwcmUgNDApIGRlY29kZXMgYCUzRGAgdG8gYD1gXG5cdFx0Ly8gaHR0cHM6Ly9naXRodWIuY29tL3NpbmRyZXNvcmh1cy9xdWVyeS1zdHJpbmcvcHVsbC8zN1xuXHRcdHZhciBrZXkgPSBwYXJ0cy5zaGlmdCgpO1xuXHRcdHZhciB2YWwgPSBwYXJ0cy5sZW5ndGggPiAwID8gcGFydHMuam9pbignPScpIDogdW5kZWZpbmVkO1xuXG5cdFx0a2V5ID0gZGVjb2RlVVJJQ29tcG9uZW50KGtleSk7XG5cblx0XHQvLyBtaXNzaW5nIGA9YCBzaG91bGQgYmUgYG51bGxgOlxuXHRcdC8vIGh0dHA6Ly93My5vcmcvVFIvMjAxMi9XRC11cmwtMjAxMjA1MjQvI2NvbGxlY3QtdXJsLXBhcmFtZXRlcnNcblx0XHR2YWwgPSB2YWwgPT09IHVuZGVmaW5lZCA/IG51bGwgOiBkZWNvZGVVUklDb21wb25lbnQodmFsKTtcblxuXHRcdGlmIChyZXRba2V5XSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRyZXRba2V5XSA9IHZhbDtcblx0XHR9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkocmV0W2tleV0pKSB7XG5cdFx0XHRyZXRba2V5XS5wdXNoKHZhbCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldFtrZXldID0gW3JldFtrZXldLCB2YWxdO1xuXHRcdH1cblx0fSk7XG5cblx0cmV0dXJuIHJldDtcbn07XG5cbmV4cG9ydHMuc3RyaW5naWZ5ID0gZnVuY3Rpb24gKG9iaiwgb3B0cykge1xuXHR2YXIgZGVmYXVsdHMgPSB7XG5cdFx0ZW5jb2RlOiB0cnVlLFxuXHRcdHN0cmljdDogdHJ1ZVxuXHR9O1xuXG5cdG9wdHMgPSBvYmplY3RBc3NpZ24oZGVmYXVsdHMsIG9wdHMpO1xuXG5cdHJldHVybiBvYmogPyBPYmplY3Qua2V5cyhvYmopLnNvcnQoKS5tYXAoZnVuY3Rpb24gKGtleSkge1xuXHRcdHZhciB2YWwgPSBvYmpba2V5XTtcblxuXHRcdGlmICh2YWwgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cmV0dXJuICcnO1xuXHRcdH1cblxuXHRcdGlmICh2YWwgPT09IG51bGwpIHtcblx0XHRcdHJldHVybiBlbmNvZGUoa2V5LCBvcHRzKTtcblx0XHR9XG5cblx0XHRpZiAoQXJyYXkuaXNBcnJheSh2YWwpKSB7XG5cdFx0XHR2YXIgcmVzdWx0ID0gW107XG5cblx0XHRcdHZhbC5zbGljZSgpLmZvckVhY2goZnVuY3Rpb24gKHZhbDIpIHtcblx0XHRcdFx0aWYgKHZhbDIgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICh2YWwyID09PSBudWxsKSB7XG5cdFx0XHRcdFx0cmVzdWx0LnB1c2goZW5jb2RlKGtleSwgb3B0cykpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJlc3VsdC5wdXNoKGVuY29kZShrZXksIG9wdHMpICsgJz0nICsgZW5jb2RlKHZhbDIsIG9wdHMpKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiByZXN1bHQuam9pbignJicpO1xuXHRcdH1cblxuXHRcdHJldHVybiBlbmNvZGUoa2V5LCBvcHRzKSArICc9JyArIGVuY29kZSh2YWwsIG9wdHMpO1xuXHR9KS5maWx0ZXIoZnVuY3Rpb24gKHgpIHtcblx0XHRyZXR1cm4geC5sZW5ndGggPiAwO1xuXHR9KS5qb2luKCcmJykgOiAnJztcbn07XG4iLCIvLyBSaXZldHMuanNcbi8vIHZlcnNpb246IDAuOS4zXG4vLyBhdXRob3I6IE1pY2hhZWwgUmljaGFyZHNcbi8vIGxpY2Vuc2U6IE1JVFxuKGZ1bmN0aW9uKCkge1xuICB2YXIgUml2ZXRzLCBiaW5kTWV0aG9kLCB1bmJpbmRNZXRob2QsIF9yZWYsXG4gICAgX19iaW5kID0gZnVuY3Rpb24oZm4sIG1lKXsgcmV0dXJuIGZ1bmN0aW9uKCl7IHJldHVybiBmbi5hcHBseShtZSwgYXJndW1lbnRzKTsgfTsgfSxcbiAgICBfX3NsaWNlID0gW10uc2xpY2UsXG4gICAgX19oYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHksXG4gICAgX19leHRlbmRzID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChfX2hhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH0sXG4gICAgX19pbmRleE9mID0gW10uaW5kZXhPZiB8fCBmdW5jdGlvbihpdGVtKSB7IGZvciAodmFyIGkgPSAwLCBsID0gdGhpcy5sZW5ndGg7IGkgPCBsOyBpKyspIHsgaWYgKGkgaW4gdGhpcyAmJiB0aGlzW2ldID09PSBpdGVtKSByZXR1cm4gaTsgfSByZXR1cm4gLTE7IH07XG5cbiAgUml2ZXRzID0ge1xuICAgIG9wdGlvbnM6IFsncHJlZml4JywgJ3RlbXBsYXRlRGVsaW1pdGVycycsICdyb290SW50ZXJmYWNlJywgJ3ByZWxvYWREYXRhJywgJ2hhbmRsZXInLCAnZXhlY3V0ZUZ1bmN0aW9ucyddLFxuICAgIGV4dGVuc2lvbnM6IFsnYmluZGVycycsICdmb3JtYXR0ZXJzJywgJ2NvbXBvbmVudHMnLCAnYWRhcHRlcnMnXSxcbiAgICBcInB1YmxpY1wiOiB7XG4gICAgICBiaW5kZXJzOiB7fSxcbiAgICAgIGNvbXBvbmVudHM6IHt9LFxuICAgICAgZm9ybWF0dGVyczoge30sXG4gICAgICBhZGFwdGVyczoge30sXG4gICAgICBwcmVmaXg6ICdydicsXG4gICAgICB0ZW1wbGF0ZURlbGltaXRlcnM6IFsneycsICd9J10sXG4gICAgICByb290SW50ZXJmYWNlOiAnLicsXG4gICAgICBwcmVsb2FkRGF0YTogdHJ1ZSxcbiAgICAgIGV4ZWN1dGVGdW5jdGlvbnM6IGZhbHNlLFxuICAgICAgaXRlcmF0aW9uQWxpYXM6IGZ1bmN0aW9uKG1vZGVsTmFtZSkge1xuICAgICAgICByZXR1cm4gJyUnICsgbW9kZWxOYW1lICsgJyUnO1xuICAgICAgfSxcbiAgICAgIGhhbmRsZXI6IGZ1bmN0aW9uKGNvbnRleHQsIGV2LCBiaW5kaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhbGwoY29udGV4dCwgZXYsIGJpbmRpbmcudmlldy5tb2RlbHMpO1xuICAgICAgfSxcbiAgICAgIGNvbmZpZ3VyZTogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICB2YXIgZGVzY3JpcHRvciwga2V5LCBvcHRpb24sIHZhbHVlO1xuICAgICAgICBpZiAob3B0aW9ucyA9PSBudWxsKSB7XG4gICAgICAgICAgb3B0aW9ucyA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIGZvciAob3B0aW9uIGluIG9wdGlvbnMpIHtcbiAgICAgICAgICB2YWx1ZSA9IG9wdGlvbnNbb3B0aW9uXTtcbiAgICAgICAgICBpZiAob3B0aW9uID09PSAnYmluZGVycycgfHwgb3B0aW9uID09PSAnY29tcG9uZW50cycgfHwgb3B0aW9uID09PSAnZm9ybWF0dGVycycgfHwgb3B0aW9uID09PSAnYWRhcHRlcnMnKSB7XG4gICAgICAgICAgICBmb3IgKGtleSBpbiB2YWx1ZSkge1xuICAgICAgICAgICAgICBkZXNjcmlwdG9yID0gdmFsdWVba2V5XTtcbiAgICAgICAgICAgICAgUml2ZXRzW29wdGlvbl1ba2V5XSA9IGRlc2NyaXB0b3I7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIFJpdmV0c1tcInB1YmxpY1wiXVtvcHRpb25dID0gdmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgYmluZDogZnVuY3Rpb24oZWwsIG1vZGVscywgb3B0aW9ucykge1xuICAgICAgICB2YXIgdmlldztcbiAgICAgICAgaWYgKG1vZGVscyA9PSBudWxsKSB7XG4gICAgICAgICAgbW9kZWxzID0ge307XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMgPT0gbnVsbCkge1xuICAgICAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICAgICAgfVxuICAgICAgICB2aWV3ID0gbmV3IFJpdmV0cy5WaWV3KGVsLCBtb2RlbHMsIG9wdGlvbnMpO1xuICAgICAgICB2aWV3LmJpbmQoKTtcbiAgICAgICAgcmV0dXJuIHZpZXc7XG4gICAgICB9LFxuICAgICAgaW5pdDogZnVuY3Rpb24oY29tcG9uZW50LCBlbCwgZGF0YSkge1xuICAgICAgICB2YXIgc2NvcGUsIHRlbXBsYXRlLCB2aWV3O1xuICAgICAgICBpZiAoZGF0YSA9PSBudWxsKSB7XG4gICAgICAgICAgZGF0YSA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIGlmIChlbCA9PSBudWxsKSB7XG4gICAgICAgICAgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgfVxuICAgICAgICBjb21wb25lbnQgPSBSaXZldHNbXCJwdWJsaWNcIl0uY29tcG9uZW50c1tjb21wb25lbnRdO1xuICAgICAgICB0ZW1wbGF0ZSA9IGNvbXBvbmVudC50ZW1wbGF0ZS5jYWxsKHRoaXMsIGVsKTtcbiAgICAgICAgaWYgKHRlbXBsYXRlIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICB3aGlsZSAoZWwuZmlyc3RDaGlsZCkge1xuICAgICAgICAgICAgZWwucmVtb3ZlQ2hpbGQoZWwuZmlyc3RDaGlsZCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsLmFwcGVuZENoaWxkKHRlbXBsYXRlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlbC5pbm5lckhUTUwgPSB0ZW1wbGF0ZTtcbiAgICAgICAgfVxuICAgICAgICBzY29wZSA9IGNvbXBvbmVudC5pbml0aWFsaXplLmNhbGwodGhpcywgZWwsIGRhdGEpO1xuICAgICAgICB2aWV3ID0gbmV3IFJpdmV0cy5WaWV3KGVsLCBzY29wZSk7XG4gICAgICAgIHZpZXcuYmluZCgpO1xuICAgICAgICByZXR1cm4gdmlldztcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgaWYgKHdpbmRvd1snalF1ZXJ5J10gfHwgd2luZG93WyckJ10pIHtcbiAgICBfcmVmID0gJ29uJyBpbiBqUXVlcnkucHJvdG90eXBlID8gWydvbicsICdvZmYnXSA6IFsnYmluZCcsICd1bmJpbmQnXSwgYmluZE1ldGhvZCA9IF9yZWZbMF0sIHVuYmluZE1ldGhvZCA9IF9yZWZbMV07XG4gICAgUml2ZXRzLlV0aWwgPSB7XG4gICAgICBiaW5kRXZlbnQ6IGZ1bmN0aW9uKGVsLCBldmVudCwgaGFuZGxlcikge1xuICAgICAgICByZXR1cm4galF1ZXJ5KGVsKVtiaW5kTWV0aG9kXShldmVudCwgaGFuZGxlcik7XG4gICAgICB9LFxuICAgICAgdW5iaW5kRXZlbnQ6IGZ1bmN0aW9uKGVsLCBldmVudCwgaGFuZGxlcikge1xuICAgICAgICByZXR1cm4galF1ZXJ5KGVsKVt1bmJpbmRNZXRob2RdKGV2ZW50LCBoYW5kbGVyKTtcbiAgICAgIH0sXG4gICAgICBnZXRJbnB1dFZhbHVlOiBmdW5jdGlvbihlbCkge1xuICAgICAgICB2YXIgJGVsO1xuICAgICAgICAkZWwgPSBqUXVlcnkoZWwpO1xuICAgICAgICBpZiAoJGVsLmF0dHIoJ3R5cGUnKSA9PT0gJ2NoZWNrYm94Jykge1xuICAgICAgICAgIHJldHVybiAkZWwuaXMoJzpjaGVja2VkJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuICRlbC52YWwoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgUml2ZXRzLlV0aWwgPSB7XG4gICAgICBiaW5kRXZlbnQ6IChmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKCdhZGRFdmVudExpc3RlbmVyJyBpbiB3aW5kb3cpIHtcbiAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oZWwsIGV2ZW50LCBoYW5kbGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gZWwuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgaGFuZGxlciwgZmFsc2UpO1xuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGVsLCBldmVudCwgaGFuZGxlcikge1xuICAgICAgICAgIHJldHVybiBlbC5hdHRhY2hFdmVudCgnb24nICsgZXZlbnQsIGhhbmRsZXIpO1xuICAgICAgICB9O1xuICAgICAgfSkoKSxcbiAgICAgIHVuYmluZEV2ZW50OiAoZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICgncmVtb3ZlRXZlbnRMaXN0ZW5lcicgaW4gd2luZG93KSB7XG4gICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGVsLCBldmVudCwgaGFuZGxlcikge1xuICAgICAgICAgICAgcmV0dXJuIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGhhbmRsZXIsIGZhbHNlKTtcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihlbCwgZXZlbnQsIGhhbmRsZXIpIHtcbiAgICAgICAgICByZXR1cm4gZWwuZGV0YWNoRXZlbnQoJ29uJyArIGV2ZW50LCBoYW5kbGVyKTtcbiAgICAgICAgfTtcbiAgICAgIH0pKCksXG4gICAgICBnZXRJbnB1dFZhbHVlOiBmdW5jdGlvbihlbCkge1xuICAgICAgICB2YXIgbywgX2ksIF9sZW4sIF9yZXN1bHRzO1xuICAgICAgICBpZiAoZWwudHlwZSA9PT0gJ2NoZWNrYm94Jykge1xuICAgICAgICAgIHJldHVybiBlbC5jaGVja2VkO1xuICAgICAgICB9IGVsc2UgaWYgKGVsLnR5cGUgPT09ICdzZWxlY3QtbXVsdGlwbGUnKSB7XG4gICAgICAgICAgX3Jlc3VsdHMgPSBbXTtcbiAgICAgICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IGVsLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgICAgICBvID0gZWxbX2ldO1xuICAgICAgICAgICAgaWYgKG8uc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgX3Jlc3VsdHMucHVzaChvLnZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBlbC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBSaXZldHMuVHlwZVBhcnNlciA9IChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBUeXBlUGFyc2VyKCkge31cblxuICAgIFR5cGVQYXJzZXIudHlwZXMgPSB7XG4gICAgICBwcmltaXRpdmU6IDAsXG4gICAgICBrZXlwYXRoOiAxXG4gICAgfTtcblxuICAgIFR5cGVQYXJzZXIucGFyc2UgPSBmdW5jdGlvbihzdHJpbmcpIHtcbiAgICAgIGlmICgvXicuKickfF5cIi4qXCIkLy50ZXN0KHN0cmluZykpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB0eXBlOiB0aGlzLnR5cGVzLnByaW1pdGl2ZSxcbiAgICAgICAgICB2YWx1ZTogc3RyaW5nLnNsaWNlKDEsIC0xKVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIGlmIChzdHJpbmcgPT09ICd0cnVlJykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHR5cGU6IHRoaXMudHlwZXMucHJpbWl0aXZlLFxuICAgICAgICAgIHZhbHVlOiB0cnVlXG4gICAgICAgIH07XG4gICAgICB9IGVsc2UgaWYgKHN0cmluZyA9PT0gJ2ZhbHNlJykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHR5cGU6IHRoaXMudHlwZXMucHJpbWl0aXZlLFxuICAgICAgICAgIHZhbHVlOiBmYWxzZVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIGlmIChzdHJpbmcgPT09ICdudWxsJykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHR5cGU6IHRoaXMudHlwZXMucHJpbWl0aXZlLFxuICAgICAgICAgIHZhbHVlOiBudWxsXG4gICAgICAgIH07XG4gICAgICB9IGVsc2UgaWYgKHN0cmluZyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB0eXBlOiB0aGlzLnR5cGVzLnByaW1pdGl2ZSxcbiAgICAgICAgICB2YWx1ZTogdm9pZCAwXG4gICAgICAgIH07XG4gICAgICB9IGVsc2UgaWYgKHN0cmluZyA9PT0gJycpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB0eXBlOiB0aGlzLnR5cGVzLnByaW1pdGl2ZSxcbiAgICAgICAgICB2YWx1ZTogdm9pZCAwXG4gICAgICAgIH07XG4gICAgICB9IGVsc2UgaWYgKGlzTmFOKE51bWJlcihzdHJpbmcpKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB0eXBlOiB0aGlzLnR5cGVzLnByaW1pdGl2ZSxcbiAgICAgICAgICB2YWx1ZTogTnVtYmVyKHN0cmluZylcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdHlwZTogdGhpcy50eXBlcy5rZXlwYXRoLFxuICAgICAgICAgIHZhbHVlOiBzdHJpbmdcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIFR5cGVQYXJzZXI7XG5cbiAgfSkoKTtcblxuICBSaXZldHMuVGV4dFRlbXBsYXRlUGFyc2VyID0gKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIFRleHRUZW1wbGF0ZVBhcnNlcigpIHt9XG5cbiAgICBUZXh0VGVtcGxhdGVQYXJzZXIudHlwZXMgPSB7XG4gICAgICB0ZXh0OiAwLFxuICAgICAgYmluZGluZzogMVxuICAgIH07XG5cbiAgICBUZXh0VGVtcGxhdGVQYXJzZXIucGFyc2UgPSBmdW5jdGlvbih0ZW1wbGF0ZSwgZGVsaW1pdGVycykge1xuICAgICAgdmFyIGluZGV4LCBsYXN0SW5kZXgsIGxhc3RUb2tlbiwgbGVuZ3RoLCBzdWJzdHJpbmcsIHRva2VucywgdmFsdWU7XG4gICAgICB0b2tlbnMgPSBbXTtcbiAgICAgIGxlbmd0aCA9IHRlbXBsYXRlLmxlbmd0aDtcbiAgICAgIGluZGV4ID0gMDtcbiAgICAgIGxhc3RJbmRleCA9IDA7XG4gICAgICB3aGlsZSAobGFzdEluZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgIGluZGV4ID0gdGVtcGxhdGUuaW5kZXhPZihkZWxpbWl0ZXJzWzBdLCBsYXN0SW5kZXgpO1xuICAgICAgICBpZiAoaW5kZXggPCAwKSB7XG4gICAgICAgICAgdG9rZW5zLnB1c2goe1xuICAgICAgICAgICAgdHlwZTogdGhpcy50eXBlcy50ZXh0LFxuICAgICAgICAgICAgdmFsdWU6IHRlbXBsYXRlLnNsaWNlKGxhc3RJbmRleClcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoaW5kZXggPiAwICYmIGxhc3RJbmRleCA8IGluZGV4KSB7XG4gICAgICAgICAgICB0b2tlbnMucHVzaCh7XG4gICAgICAgICAgICAgIHR5cGU6IHRoaXMudHlwZXMudGV4dCxcbiAgICAgICAgICAgICAgdmFsdWU6IHRlbXBsYXRlLnNsaWNlKGxhc3RJbmRleCwgaW5kZXgpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgbGFzdEluZGV4ID0gaW5kZXggKyBkZWxpbWl0ZXJzWzBdLmxlbmd0aDtcbiAgICAgICAgICBpbmRleCA9IHRlbXBsYXRlLmluZGV4T2YoZGVsaW1pdGVyc1sxXSwgbGFzdEluZGV4KTtcbiAgICAgICAgICBpZiAoaW5kZXggPCAwKSB7XG4gICAgICAgICAgICBzdWJzdHJpbmcgPSB0ZW1wbGF0ZS5zbGljZShsYXN0SW5kZXggLSBkZWxpbWl0ZXJzWzFdLmxlbmd0aCk7XG4gICAgICAgICAgICBsYXN0VG9rZW4gPSB0b2tlbnNbdG9rZW5zLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgaWYgKChsYXN0VG9rZW4gIT0gbnVsbCA/IGxhc3RUb2tlbi50eXBlIDogdm9pZCAwKSA9PT0gdGhpcy50eXBlcy50ZXh0KSB7XG4gICAgICAgICAgICAgIGxhc3RUb2tlbi52YWx1ZSArPSBzdWJzdHJpbmc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0b2tlbnMucHVzaCh7XG4gICAgICAgICAgICAgICAgdHlwZTogdGhpcy50eXBlcy50ZXh0LFxuICAgICAgICAgICAgICAgIHZhbHVlOiBzdWJzdHJpbmdcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFsdWUgPSB0ZW1wbGF0ZS5zbGljZShsYXN0SW5kZXgsIGluZGV4KS50cmltKCk7XG4gICAgICAgICAgdG9rZW5zLnB1c2goe1xuICAgICAgICAgICAgdHlwZTogdGhpcy50eXBlcy5iaW5kaW5nLFxuICAgICAgICAgICAgdmFsdWU6IHZhbHVlXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgbGFzdEluZGV4ID0gaW5kZXggKyBkZWxpbWl0ZXJzWzFdLmxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRva2VucztcbiAgICB9O1xuXG4gICAgcmV0dXJuIFRleHRUZW1wbGF0ZVBhcnNlcjtcblxuICB9KSgpO1xuXG4gIFJpdmV0cy5WaWV3ID0gKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIFZpZXcoZWxzLCBtb2RlbHMsIG9wdGlvbnMpIHtcbiAgICAgIHZhciBrLCBvcHRpb24sIHYsIF9iYXNlLCBfaSwgX2osIF9sZW4sIF9sZW4xLCBfcmVmMSwgX3JlZjIsIF9yZWYzLCBfcmVmNCwgX3JlZjU7XG4gICAgICB0aGlzLmVscyA9IGVscztcbiAgICAgIHRoaXMubW9kZWxzID0gbW9kZWxzO1xuICAgICAgaWYgKG9wdGlvbnMgPT0gbnVsbCkge1xuICAgICAgICBvcHRpb25zID0ge307XG4gICAgICB9XG4gICAgICB0aGlzLnVwZGF0ZSA9IF9fYmluZCh0aGlzLnVwZGF0ZSwgdGhpcyk7XG4gICAgICB0aGlzLnB1Ymxpc2ggPSBfX2JpbmQodGhpcy5wdWJsaXNoLCB0aGlzKTtcbiAgICAgIHRoaXMuc3luYyA9IF9fYmluZCh0aGlzLnN5bmMsIHRoaXMpO1xuICAgICAgdGhpcy51bmJpbmQgPSBfX2JpbmQodGhpcy51bmJpbmQsIHRoaXMpO1xuICAgICAgdGhpcy5iaW5kID0gX19iaW5kKHRoaXMuYmluZCwgdGhpcyk7XG4gICAgICB0aGlzLnNlbGVjdCA9IF9fYmluZCh0aGlzLnNlbGVjdCwgdGhpcyk7XG4gICAgICB0aGlzLnRyYXZlcnNlID0gX19iaW5kKHRoaXMudHJhdmVyc2UsIHRoaXMpO1xuICAgICAgdGhpcy5idWlsZCA9IF9fYmluZCh0aGlzLmJ1aWxkLCB0aGlzKTtcbiAgICAgIHRoaXMuYnVpbGRCaW5kaW5nID0gX19iaW5kKHRoaXMuYnVpbGRCaW5kaW5nLCB0aGlzKTtcbiAgICAgIHRoaXMuYmluZGluZ1JlZ0V4cCA9IF9fYmluZCh0aGlzLmJpbmRpbmdSZWdFeHAsIHRoaXMpO1xuICAgICAgdGhpcy5vcHRpb25zID0gX19iaW5kKHRoaXMub3B0aW9ucywgdGhpcyk7XG4gICAgICBpZiAoISh0aGlzLmVscy5qcXVlcnkgfHwgdGhpcy5lbHMgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgICAgdGhpcy5lbHMgPSBbdGhpcy5lbHNdO1xuICAgICAgfVxuICAgICAgX3JlZjEgPSBSaXZldHMuZXh0ZW5zaW9ucztcbiAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZjEubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgb3B0aW9uID0gX3JlZjFbX2ldO1xuICAgICAgICB0aGlzW29wdGlvbl0gPSB7fTtcbiAgICAgICAgaWYgKG9wdGlvbnNbb3B0aW9uXSkge1xuICAgICAgICAgIF9yZWYyID0gb3B0aW9uc1tvcHRpb25dO1xuICAgICAgICAgIGZvciAoayBpbiBfcmVmMikge1xuICAgICAgICAgICAgdiA9IF9yZWYyW2tdO1xuICAgICAgICAgICAgdGhpc1tvcHRpb25dW2tdID0gdjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgX3JlZjMgPSBSaXZldHNbXCJwdWJsaWNcIl1bb3B0aW9uXTtcbiAgICAgICAgZm9yIChrIGluIF9yZWYzKSB7XG4gICAgICAgICAgdiA9IF9yZWYzW2tdO1xuICAgICAgICAgIGlmICgoX2Jhc2UgPSB0aGlzW29wdGlvbl0pW2tdID09IG51bGwpIHtcbiAgICAgICAgICAgIF9iYXNlW2tdID0gdjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIF9yZWY0ID0gUml2ZXRzLm9wdGlvbnM7XG4gICAgICBmb3IgKF9qID0gMCwgX2xlbjEgPSBfcmVmNC5sZW5ndGg7IF9qIDwgX2xlbjE7IF9qKyspIHtcbiAgICAgICAgb3B0aW9uID0gX3JlZjRbX2pdO1xuICAgICAgICB0aGlzW29wdGlvbl0gPSAoX3JlZjUgPSBvcHRpb25zW29wdGlvbl0pICE9IG51bGwgPyBfcmVmNSA6IFJpdmV0c1tcInB1YmxpY1wiXVtvcHRpb25dO1xuICAgICAgfVxuICAgICAgdGhpcy5idWlsZCgpO1xuICAgIH1cblxuICAgIFZpZXcucHJvdG90eXBlLm9wdGlvbnMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBvcHRpb24sIG9wdGlvbnMsIF9pLCBfbGVuLCBfcmVmMTtcbiAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICAgIF9yZWYxID0gUml2ZXRzLmV4dGVuc2lvbnMuY29uY2F0KFJpdmV0cy5vcHRpb25zKTtcbiAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZjEubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgb3B0aW9uID0gX3JlZjFbX2ldO1xuICAgICAgICBvcHRpb25zW29wdGlvbl0gPSB0aGlzW29wdGlvbl07XG4gICAgICB9XG4gICAgICByZXR1cm4gb3B0aW9ucztcbiAgICB9O1xuXG4gICAgVmlldy5wcm90b3R5cGUuYmluZGluZ1JlZ0V4cCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoXCJeXCIgKyB0aGlzLnByZWZpeCArIFwiLVwiKTtcbiAgICB9O1xuXG4gICAgVmlldy5wcm90b3R5cGUuYnVpbGRCaW5kaW5nID0gZnVuY3Rpb24oYmluZGluZywgbm9kZSwgdHlwZSwgZGVjbGFyYXRpb24pIHtcbiAgICAgIHZhciBjb250ZXh0LCBjdHgsIGRlcGVuZGVuY2llcywga2V5cGF0aCwgb3B0aW9ucywgcGlwZSwgcGlwZXM7XG4gICAgICBvcHRpb25zID0ge307XG4gICAgICBwaXBlcyA9IChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIF9pLCBfbGVuLCBfcmVmMSwgX3Jlc3VsdHM7XG4gICAgICAgIF9yZWYxID0gZGVjbGFyYXRpb24ubWF0Y2goLygoPzonW14nXSonKSooPzooPzpbXlxcfCddKig/OidbXiddKicpK1teXFx8J10qKSt8W15cXHxdKykpfF4kL2cpO1xuICAgICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYxLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgICAgcGlwZSA9IF9yZWYxW19pXTtcbiAgICAgICAgICBfcmVzdWx0cy5wdXNoKHBpcGUudHJpbSgpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gX3Jlc3VsdHM7XG4gICAgICB9KSgpO1xuICAgICAgY29udGV4dCA9IChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIF9pLCBfbGVuLCBfcmVmMSwgX3Jlc3VsdHM7XG4gICAgICAgIF9yZWYxID0gcGlwZXMuc2hpZnQoKS5zcGxpdCgnPCcpO1xuICAgICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYxLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgICAgY3R4ID0gX3JlZjFbX2ldO1xuICAgICAgICAgIF9yZXN1bHRzLnB1c2goY3R4LnRyaW0oKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgICAgfSkoKTtcbiAgICAgIGtleXBhdGggPSBjb250ZXh0LnNoaWZ0KCk7XG4gICAgICBvcHRpb25zLmZvcm1hdHRlcnMgPSBwaXBlcztcbiAgICAgIGlmIChkZXBlbmRlbmNpZXMgPSBjb250ZXh0LnNoaWZ0KCkpIHtcbiAgICAgICAgb3B0aW9ucy5kZXBlbmRlbmNpZXMgPSBkZXBlbmRlbmNpZXMuc3BsaXQoL1xccysvKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmJpbmRpbmdzLnB1c2gobmV3IFJpdmV0c1tiaW5kaW5nXSh0aGlzLCBub2RlLCB0eXBlLCBrZXlwYXRoLCBvcHRpb25zKSk7XG4gICAgfTtcblxuICAgIFZpZXcucHJvdG90eXBlLmJ1aWxkID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZWwsIHBhcnNlLCBfaSwgX2xlbiwgX3JlZjE7XG4gICAgICB0aGlzLmJpbmRpbmdzID0gW107XG4gICAgICBwYXJzZSA9IChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24obm9kZSkge1xuICAgICAgICAgIHZhciBibG9jaywgY2hpbGROb2RlLCBkZWxpbWl0ZXJzLCBuLCBwYXJzZXIsIHRleHQsIHRva2VuLCB0b2tlbnMsIF9pLCBfaiwgX2xlbiwgX2xlbjEsIF9yZWYxO1xuICAgICAgICAgIGlmIChub2RlLm5vZGVUeXBlID09PSAzKSB7XG4gICAgICAgICAgICBwYXJzZXIgPSBSaXZldHMuVGV4dFRlbXBsYXRlUGFyc2VyO1xuICAgICAgICAgICAgaWYgKGRlbGltaXRlcnMgPSBfdGhpcy50ZW1wbGF0ZURlbGltaXRlcnMpIHtcbiAgICAgICAgICAgICAgaWYgKCh0b2tlbnMgPSBwYXJzZXIucGFyc2Uobm9kZS5kYXRhLCBkZWxpbWl0ZXJzKSkubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCEodG9rZW5zLmxlbmd0aCA9PT0gMSAmJiB0b2tlbnNbMF0udHlwZSA9PT0gcGFyc2VyLnR5cGVzLnRleHQpKSB7XG4gICAgICAgICAgICAgICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IHRva2Vucy5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICAgICAgICAgICAgICB0b2tlbiA9IHRva2Vuc1tfaV07XG4gICAgICAgICAgICAgICAgICAgIHRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0b2tlbi52YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIG5vZGUucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodGV4dCwgbm9kZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0b2tlbi50eXBlID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgX3RoaXMuYnVpbGRCaW5kaW5nKCdUZXh0QmluZGluZycsIHRleHQsIG51bGwsIHRva2VuLnZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgbm9kZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG5vZGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAobm9kZS5ub2RlVHlwZSA9PT0gMSkge1xuICAgICAgICAgICAgYmxvY2sgPSBfdGhpcy50cmF2ZXJzZShub2RlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCFibG9jaykge1xuICAgICAgICAgICAgX3JlZjEgPSAoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHZhciBfaywgX2xlbjEsIF9yZWYxLCBfcmVzdWx0cztcbiAgICAgICAgICAgICAgX3JlZjEgPSBub2RlLmNoaWxkTm9kZXM7XG4gICAgICAgICAgICAgIF9yZXN1bHRzID0gW107XG4gICAgICAgICAgICAgIGZvciAoX2sgPSAwLCBfbGVuMSA9IF9yZWYxLmxlbmd0aDsgX2sgPCBfbGVuMTsgX2srKykge1xuICAgICAgICAgICAgICAgIG4gPSBfcmVmMVtfa107XG4gICAgICAgICAgICAgICAgX3Jlc3VsdHMucHVzaChuKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gX3Jlc3VsdHM7XG4gICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgZm9yIChfaiA9IDAsIF9sZW4xID0gX3JlZjEubGVuZ3RoOyBfaiA8IF9sZW4xOyBfaisrKSB7XG4gICAgICAgICAgICAgIGNoaWxkTm9kZSA9IF9yZWYxW19qXTtcbiAgICAgICAgICAgICAgcGFyc2UoY2hpbGROb2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKTtcbiAgICAgIF9yZWYxID0gdGhpcy5lbHM7XG4gICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYxLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgIGVsID0gX3JlZjFbX2ldO1xuICAgICAgICBwYXJzZShlbCk7XG4gICAgICB9XG4gICAgICB0aGlzLmJpbmRpbmdzLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICB2YXIgX3JlZjIsIF9yZWYzO1xuICAgICAgICByZXR1cm4gKCgoX3JlZjIgPSBiLmJpbmRlcikgIT0gbnVsbCA/IF9yZWYyLnByaW9yaXR5IDogdm9pZCAwKSB8fCAwKSAtICgoKF9yZWYzID0gYS5iaW5kZXIpICE9IG51bGwgPyBfcmVmMy5wcmlvcml0eSA6IHZvaWQgMCkgfHwgMCk7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgVmlldy5wcm90b3R5cGUudHJhdmVyc2UgPSBmdW5jdGlvbihub2RlKSB7XG4gICAgICB2YXIgYXR0cmlidXRlLCBhdHRyaWJ1dGVzLCBiaW5kZXIsIGJpbmRpbmdSZWdFeHAsIGJsb2NrLCBpZGVudGlmaWVyLCByZWdleHAsIHR5cGUsIHZhbHVlLCBfaSwgX2osIF9sZW4sIF9sZW4xLCBfcmVmMSwgX3JlZjIsIF9yZWYzO1xuICAgICAgYmluZGluZ1JlZ0V4cCA9IHRoaXMuYmluZGluZ1JlZ0V4cCgpO1xuICAgICAgYmxvY2sgPSBub2RlLm5vZGVOYW1lID09PSAnU0NSSVBUJyB8fCBub2RlLm5vZGVOYW1lID09PSAnU1RZTEUnO1xuICAgICAgX3JlZjEgPSBub2RlLmF0dHJpYnV0ZXM7XG4gICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYxLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgIGF0dHJpYnV0ZSA9IF9yZWYxW19pXTtcbiAgICAgICAgaWYgKGJpbmRpbmdSZWdFeHAudGVzdChhdHRyaWJ1dGUubmFtZSkpIHtcbiAgICAgICAgICB0eXBlID0gYXR0cmlidXRlLm5hbWUucmVwbGFjZShiaW5kaW5nUmVnRXhwLCAnJyk7XG4gICAgICAgICAgaWYgKCEoYmluZGVyID0gdGhpcy5iaW5kZXJzW3R5cGVdKSkge1xuICAgICAgICAgICAgX3JlZjIgPSB0aGlzLmJpbmRlcnM7XG4gICAgICAgICAgICBmb3IgKGlkZW50aWZpZXIgaW4gX3JlZjIpIHtcbiAgICAgICAgICAgICAgdmFsdWUgPSBfcmVmMltpZGVudGlmaWVyXTtcbiAgICAgICAgICAgICAgaWYgKGlkZW50aWZpZXIgIT09ICcqJyAmJiBpZGVudGlmaWVyLmluZGV4T2YoJyonKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICByZWdleHAgPSBuZXcgUmVnRXhwKFwiXlwiICsgKGlkZW50aWZpZXIucmVwbGFjZSgvXFwqL2csICcuKycpKSArIFwiJFwiKTtcbiAgICAgICAgICAgICAgICBpZiAocmVnZXhwLnRlc3QodHlwZSkpIHtcbiAgICAgICAgICAgICAgICAgIGJpbmRlciA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBiaW5kZXIgfHwgKGJpbmRlciA9IHRoaXMuYmluZGVyc1snKiddKTtcbiAgICAgICAgICBpZiAoYmluZGVyLmJsb2NrKSB7XG4gICAgICAgICAgICBibG9jayA9IHRydWU7XG4gICAgICAgICAgICBhdHRyaWJ1dGVzID0gW2F0dHJpYnV0ZV07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBfcmVmMyA9IGF0dHJpYnV0ZXMgfHwgbm9kZS5hdHRyaWJ1dGVzO1xuICAgICAgZm9yIChfaiA9IDAsIF9sZW4xID0gX3JlZjMubGVuZ3RoOyBfaiA8IF9sZW4xOyBfaisrKSB7XG4gICAgICAgIGF0dHJpYnV0ZSA9IF9yZWYzW19qXTtcbiAgICAgICAgaWYgKGJpbmRpbmdSZWdFeHAudGVzdChhdHRyaWJ1dGUubmFtZSkpIHtcbiAgICAgICAgICB0eXBlID0gYXR0cmlidXRlLm5hbWUucmVwbGFjZShiaW5kaW5nUmVnRXhwLCAnJyk7XG4gICAgICAgICAgdGhpcy5idWlsZEJpbmRpbmcoJ0JpbmRpbmcnLCBub2RlLCB0eXBlLCBhdHRyaWJ1dGUudmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoIWJsb2NrKSB7XG4gICAgICAgIHR5cGUgPSBub2RlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGlmICh0aGlzLmNvbXBvbmVudHNbdHlwZV0gJiYgIW5vZGUuX2JvdW5kKSB7XG4gICAgICAgICAgdGhpcy5iaW5kaW5ncy5wdXNoKG5ldyBSaXZldHMuQ29tcG9uZW50QmluZGluZyh0aGlzLCBub2RlLCB0eXBlKSk7XG4gICAgICAgICAgYmxvY2sgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gYmxvY2s7XG4gICAgfTtcblxuICAgIFZpZXcucHJvdG90eXBlLnNlbGVjdCA9IGZ1bmN0aW9uKGZuKSB7XG4gICAgICB2YXIgYmluZGluZywgX2ksIF9sZW4sIF9yZWYxLCBfcmVzdWx0cztcbiAgICAgIF9yZWYxID0gdGhpcy5iaW5kaW5ncztcbiAgICAgIF9yZXN1bHRzID0gW107XG4gICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYxLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgIGJpbmRpbmcgPSBfcmVmMVtfaV07XG4gICAgICAgIGlmIChmbihiaW5kaW5nKSkge1xuICAgICAgICAgIF9yZXN1bHRzLnB1c2goYmluZGluZyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBfcmVzdWx0cztcbiAgICB9O1xuXG4gICAgVmlldy5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGJpbmRpbmcsIF9pLCBfbGVuLCBfcmVmMTtcbiAgICAgIF9yZWYxID0gdGhpcy5iaW5kaW5ncztcbiAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZjEubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgYmluZGluZyA9IF9yZWYxW19pXTtcbiAgICAgICAgYmluZGluZy5iaW5kKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIFZpZXcucHJvdG90eXBlLnVuYmluZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGJpbmRpbmcsIF9pLCBfbGVuLCBfcmVmMTtcbiAgICAgIF9yZWYxID0gdGhpcy5iaW5kaW5ncztcbiAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZjEubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgYmluZGluZyA9IF9yZWYxW19pXTtcbiAgICAgICAgYmluZGluZy51bmJpbmQoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgVmlldy5wcm90b3R5cGUuc3luYyA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGJpbmRpbmcsIF9pLCBfbGVuLCBfcmVmMTtcbiAgICAgIF9yZWYxID0gdGhpcy5iaW5kaW5ncztcbiAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZjEubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgYmluZGluZyA9IF9yZWYxW19pXTtcbiAgICAgICAgaWYgKHR5cGVvZiBiaW5kaW5nLnN5bmMgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIGJpbmRpbmcuc3luYygpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIFZpZXcucHJvdG90eXBlLnB1Ymxpc2ggPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBiaW5kaW5nLCBfaSwgX2xlbiwgX3JlZjE7XG4gICAgICBfcmVmMSA9IHRoaXMuc2VsZWN0KGZ1bmN0aW9uKGIpIHtcbiAgICAgICAgdmFyIF9yZWYxO1xuICAgICAgICByZXR1cm4gKF9yZWYxID0gYi5iaW5kZXIpICE9IG51bGwgPyBfcmVmMS5wdWJsaXNoZXMgOiB2b2lkIDA7XG4gICAgICB9KTtcbiAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZjEubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgYmluZGluZyA9IF9yZWYxW19pXTtcbiAgICAgICAgYmluZGluZy5wdWJsaXNoKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIFZpZXcucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKG1vZGVscykge1xuICAgICAgdmFyIGJpbmRpbmcsIGtleSwgbW9kZWwsIF9pLCBfbGVuLCBfcmVmMTtcbiAgICAgIGlmIChtb2RlbHMgPT0gbnVsbCkge1xuICAgICAgICBtb2RlbHMgPSB7fTtcbiAgICAgIH1cbiAgICAgIGZvciAoa2V5IGluIG1vZGVscykge1xuICAgICAgICBtb2RlbCA9IG1vZGVsc1trZXldO1xuICAgICAgICB0aGlzLm1vZGVsc1trZXldID0gbW9kZWw7XG4gICAgICB9XG4gICAgICBfcmVmMSA9IHRoaXMuYmluZGluZ3M7XG4gICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYxLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgIGJpbmRpbmcgPSBfcmVmMVtfaV07XG4gICAgICAgIGlmICh0eXBlb2YgYmluZGluZy51cGRhdGUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIGJpbmRpbmcudXBkYXRlKG1vZGVscyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIFZpZXc7XG5cbiAgfSkoKTtcblxuICBSaXZldHMuQmluZGluZyA9IChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBCaW5kaW5nKHZpZXcsIGVsLCB0eXBlLCBrZXlwYXRoLCBvcHRpb25zKSB7XG4gICAgICB0aGlzLnZpZXcgPSB2aWV3O1xuICAgICAgdGhpcy5lbCA9IGVsO1xuICAgICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICAgIHRoaXMua2V5cGF0aCA9IGtleXBhdGg7XG4gICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zICE9IG51bGwgPyBvcHRpb25zIDoge307XG4gICAgICB0aGlzLmdldFZhbHVlID0gX19iaW5kKHRoaXMuZ2V0VmFsdWUsIHRoaXMpO1xuICAgICAgdGhpcy51cGRhdGUgPSBfX2JpbmQodGhpcy51cGRhdGUsIHRoaXMpO1xuICAgICAgdGhpcy51bmJpbmQgPSBfX2JpbmQodGhpcy51bmJpbmQsIHRoaXMpO1xuICAgICAgdGhpcy5iaW5kID0gX19iaW5kKHRoaXMuYmluZCwgdGhpcyk7XG4gICAgICB0aGlzLnB1Ymxpc2ggPSBfX2JpbmQodGhpcy5wdWJsaXNoLCB0aGlzKTtcbiAgICAgIHRoaXMuc3luYyA9IF9fYmluZCh0aGlzLnN5bmMsIHRoaXMpO1xuICAgICAgdGhpcy5zZXQgPSBfX2JpbmQodGhpcy5zZXQsIHRoaXMpO1xuICAgICAgdGhpcy5ldmVudEhhbmRsZXIgPSBfX2JpbmQodGhpcy5ldmVudEhhbmRsZXIsIHRoaXMpO1xuICAgICAgdGhpcy5mb3JtYXR0ZWRWYWx1ZSA9IF9fYmluZCh0aGlzLmZvcm1hdHRlZFZhbHVlLCB0aGlzKTtcbiAgICAgIHRoaXMucGFyc2VGb3JtYXR0ZXJBcmd1bWVudHMgPSBfX2JpbmQodGhpcy5wYXJzZUZvcm1hdHRlckFyZ3VtZW50cywgdGhpcyk7XG4gICAgICB0aGlzLnBhcnNlVGFyZ2V0ID0gX19iaW5kKHRoaXMucGFyc2VUYXJnZXQsIHRoaXMpO1xuICAgICAgdGhpcy5vYnNlcnZlID0gX19iaW5kKHRoaXMub2JzZXJ2ZSwgdGhpcyk7XG4gICAgICB0aGlzLnNldEJpbmRlciA9IF9fYmluZCh0aGlzLnNldEJpbmRlciwgdGhpcyk7XG4gICAgICB0aGlzLmZvcm1hdHRlcnMgPSB0aGlzLm9wdGlvbnMuZm9ybWF0dGVycyB8fCBbXTtcbiAgICAgIHRoaXMuZGVwZW5kZW5jaWVzID0gW107XG4gICAgICB0aGlzLmZvcm1hdHRlck9ic2VydmVycyA9IHt9O1xuICAgICAgdGhpcy5tb2RlbCA9IHZvaWQgMDtcbiAgICAgIHRoaXMuc2V0QmluZGVyKCk7XG4gICAgfVxuXG4gICAgQmluZGluZy5wcm90b3R5cGUuc2V0QmluZGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgaWRlbnRpZmllciwgcmVnZXhwLCB2YWx1ZSwgX3JlZjE7XG4gICAgICBpZiAoISh0aGlzLmJpbmRlciA9IHRoaXMudmlldy5iaW5kZXJzW3RoaXMudHlwZV0pKSB7XG4gICAgICAgIF9yZWYxID0gdGhpcy52aWV3LmJpbmRlcnM7XG4gICAgICAgIGZvciAoaWRlbnRpZmllciBpbiBfcmVmMSkge1xuICAgICAgICAgIHZhbHVlID0gX3JlZjFbaWRlbnRpZmllcl07XG4gICAgICAgICAgaWYgKGlkZW50aWZpZXIgIT09ICcqJyAmJiBpZGVudGlmaWVyLmluZGV4T2YoJyonKSAhPT0gLTEpIHtcbiAgICAgICAgICAgIHJlZ2V4cCA9IG5ldyBSZWdFeHAoXCJeXCIgKyAoaWRlbnRpZmllci5yZXBsYWNlKC9cXCovZywgJy4rJykpICsgXCIkXCIpO1xuICAgICAgICAgICAgaWYgKHJlZ2V4cC50ZXN0KHRoaXMudHlwZSkpIHtcbiAgICAgICAgICAgICAgdGhpcy5iaW5kZXIgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgdGhpcy5hcmdzID0gbmV3IFJlZ0V4cChcIl5cIiArIChpZGVudGlmaWVyLnJlcGxhY2UoL1xcKi9nLCAnKC4rKScpKSArIFwiJFwiKS5leGVjKHRoaXMudHlwZSk7XG4gICAgICAgICAgICAgIHRoaXMuYXJncy5zaGlmdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5iaW5kZXIgfHwgKHRoaXMuYmluZGVyID0gdGhpcy52aWV3LmJpbmRlcnNbJyonXSk7XG4gICAgICBpZiAodGhpcy5iaW5kZXIgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuICAgICAgICByZXR1cm4gdGhpcy5iaW5kZXIgPSB7XG4gICAgICAgICAgcm91dGluZTogdGhpcy5iaW5kZXJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgQmluZGluZy5wcm90b3R5cGUub2JzZXJ2ZSA9IGZ1bmN0aW9uKG9iaiwga2V5cGF0aCwgY2FsbGJhY2spIHtcbiAgICAgIHJldHVybiBSaXZldHMuc2lnaHRnbGFzcyhvYmosIGtleXBhdGgsIGNhbGxiYWNrLCB7XG4gICAgICAgIHJvb3Q6IHRoaXMudmlldy5yb290SW50ZXJmYWNlLFxuICAgICAgICBhZGFwdGVyczogdGhpcy52aWV3LmFkYXB0ZXJzXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgQmluZGluZy5wcm90b3R5cGUucGFyc2VUYXJnZXQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciB0b2tlbjtcbiAgICAgIHRva2VuID0gUml2ZXRzLlR5cGVQYXJzZXIucGFyc2UodGhpcy5rZXlwYXRoKTtcbiAgICAgIGlmICh0b2tlbi50eXBlID09PSBSaXZldHMuVHlwZVBhcnNlci50eXBlcy5wcmltaXRpdmUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWUgPSB0b2tlbi52YWx1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMub2JzZXJ2ZXIgPSB0aGlzLm9ic2VydmUodGhpcy52aWV3Lm1vZGVscywgdGhpcy5rZXlwYXRoLCB0aGlzLnN5bmMpO1xuICAgICAgICByZXR1cm4gdGhpcy5tb2RlbCA9IHRoaXMub2JzZXJ2ZXIudGFyZ2V0O1xuICAgICAgfVxuICAgIH07XG5cbiAgICBCaW5kaW5nLnByb3RvdHlwZS5wYXJzZUZvcm1hdHRlckFyZ3VtZW50cyA9IGZ1bmN0aW9uKGFyZ3MsIGZvcm1hdHRlckluZGV4KSB7XG4gICAgICB2YXIgYWksIGFyZywgb2JzZXJ2ZXIsIHByb2Nlc3NlZEFyZ3MsIF9iYXNlLCBfaSwgX2xlbjtcbiAgICAgIGFyZ3MgPSAoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBfaSwgX2xlbiwgX3Jlc3VsdHM7XG4gICAgICAgIF9yZXN1bHRzID0gW107XG4gICAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gYXJncy5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICAgIGFyZyA9IGFyZ3NbX2ldO1xuICAgICAgICAgIF9yZXN1bHRzLnB1c2goUml2ZXRzLlR5cGVQYXJzZXIucGFyc2UoYXJnKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgICAgfSkoKTtcbiAgICAgIHByb2Nlc3NlZEFyZ3MgPSBbXTtcbiAgICAgIGZvciAoYWkgPSBfaSA9IDAsIF9sZW4gPSBhcmdzLmxlbmd0aDsgX2kgPCBfbGVuOyBhaSA9ICsrX2kpIHtcbiAgICAgICAgYXJnID0gYXJnc1thaV07XG4gICAgICAgIHByb2Nlc3NlZEFyZ3MucHVzaChhcmcudHlwZSA9PT0gUml2ZXRzLlR5cGVQYXJzZXIudHlwZXMucHJpbWl0aXZlID8gYXJnLnZhbHVlIDogKChfYmFzZSA9IHRoaXMuZm9ybWF0dGVyT2JzZXJ2ZXJzKVtmb3JtYXR0ZXJJbmRleF0gfHwgKF9iYXNlW2Zvcm1hdHRlckluZGV4XSA9IHt9KSwgIShvYnNlcnZlciA9IHRoaXMuZm9ybWF0dGVyT2JzZXJ2ZXJzW2Zvcm1hdHRlckluZGV4XVthaV0pID8gKG9ic2VydmVyID0gdGhpcy5vYnNlcnZlKHRoaXMudmlldy5tb2RlbHMsIGFyZy52YWx1ZSwgdGhpcy5zeW5jKSwgdGhpcy5mb3JtYXR0ZXJPYnNlcnZlcnNbZm9ybWF0dGVySW5kZXhdW2FpXSA9IG9ic2VydmVyKSA6IHZvaWQgMCwgb2JzZXJ2ZXIudmFsdWUoKSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHByb2Nlc3NlZEFyZ3M7XG4gICAgfTtcblxuICAgIEJpbmRpbmcucHJvdG90eXBlLmZvcm1hdHRlZFZhbHVlID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHZhciBhcmdzLCBmaSwgZm9ybWF0dGVyLCBpZCwgcHJvY2Vzc2VkQXJncywgX2ksIF9sZW4sIF9yZWYxLCBfcmVmMjtcbiAgICAgIF9yZWYxID0gdGhpcy5mb3JtYXR0ZXJzO1xuICAgICAgZm9yIChmaSA9IF9pID0gMCwgX2xlbiA9IF9yZWYxLmxlbmd0aDsgX2kgPCBfbGVuOyBmaSA9ICsrX2kpIHtcbiAgICAgICAgZm9ybWF0dGVyID0gX3JlZjFbZmldO1xuICAgICAgICBhcmdzID0gZm9ybWF0dGVyLm1hdGNoKC9bXlxccyddK3wnKFteJ118J1teXFxzXSkqJ3xcIihbXlwiXXxcIlteXFxzXSkqXCIvZyk7XG4gICAgICAgIGlkID0gYXJncy5zaGlmdCgpO1xuICAgICAgICBmb3JtYXR0ZXIgPSB0aGlzLnZpZXcuZm9ybWF0dGVyc1tpZF07XG4gICAgICAgIHByb2Nlc3NlZEFyZ3MgPSB0aGlzLnBhcnNlRm9ybWF0dGVyQXJndW1lbnRzKGFyZ3MsIGZpKTtcbiAgICAgICAgaWYgKChmb3JtYXR0ZXIgIT0gbnVsbCA/IGZvcm1hdHRlci5yZWFkIDogdm9pZCAwKSBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG4gICAgICAgICAgdmFsdWUgPSAoX3JlZjIgPSBmb3JtYXR0ZXIucmVhZCkuY2FsbC5hcHBseShfcmVmMiwgW3RoaXMubW9kZWwsIHZhbHVlXS5jb25jYXQoX19zbGljZS5jYWxsKHByb2Nlc3NlZEFyZ3MpKSk7XG4gICAgICAgIH0gZWxzZSBpZiAoZm9ybWF0dGVyIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcbiAgICAgICAgICB2YWx1ZSA9IGZvcm1hdHRlci5jYWxsLmFwcGx5KGZvcm1hdHRlciwgW3RoaXMubW9kZWwsIHZhbHVlXS5jb25jYXQoX19zbGljZS5jYWxsKHByb2Nlc3NlZEFyZ3MpKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9O1xuXG4gICAgQmluZGluZy5wcm90b3R5cGUuZXZlbnRIYW5kbGVyID0gZnVuY3Rpb24oZm4pIHtcbiAgICAgIHZhciBiaW5kaW5nLCBoYW5kbGVyO1xuICAgICAgaGFuZGxlciA9IChiaW5kaW5nID0gdGhpcykudmlldy5oYW5kbGVyO1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKGV2KSB7XG4gICAgICAgIHJldHVybiBoYW5kbGVyLmNhbGwoZm4sIHRoaXMsIGV2LCBiaW5kaW5nKTtcbiAgICAgIH07XG4gICAgfTtcblxuICAgIEJpbmRpbmcucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICB2YXIgX3JlZjE7XG4gICAgICB2YWx1ZSA9IHZhbHVlIGluc3RhbmNlb2YgRnVuY3Rpb24gJiYgIXRoaXMuYmluZGVyW1wiZnVuY3Rpb25cIl0gJiYgUml2ZXRzW1wicHVibGljXCJdLmV4ZWN1dGVGdW5jdGlvbnMgPyB0aGlzLmZvcm1hdHRlZFZhbHVlKHZhbHVlLmNhbGwodGhpcy5tb2RlbCkpIDogdGhpcy5mb3JtYXR0ZWRWYWx1ZSh2YWx1ZSk7XG4gICAgICByZXR1cm4gKF9yZWYxID0gdGhpcy5iaW5kZXIucm91dGluZSkgIT0gbnVsbCA/IF9yZWYxLmNhbGwodGhpcywgdGhpcy5lbCwgdmFsdWUpIDogdm9pZCAwO1xuICAgIH07XG5cbiAgICBCaW5kaW5nLnByb3RvdHlwZS5zeW5jID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZGVwZW5kZW5jeSwgb2JzZXJ2ZXI7XG4gICAgICByZXR1cm4gdGhpcy5zZXQoKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgX2ksIF9qLCBfbGVuLCBfbGVuMSwgX3JlZjEsIF9yZWYyLCBfcmVmMztcbiAgICAgICAgaWYgKHRoaXMub2JzZXJ2ZXIpIHtcbiAgICAgICAgICBpZiAodGhpcy5tb2RlbCAhPT0gdGhpcy5vYnNlcnZlci50YXJnZXQpIHtcbiAgICAgICAgICAgIF9yZWYxID0gdGhpcy5kZXBlbmRlbmNpZXM7XG4gICAgICAgICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYxLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgICAgICAgIG9ic2VydmVyID0gX3JlZjFbX2ldO1xuICAgICAgICAgICAgICBvYnNlcnZlci51bm9ic2VydmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZGVwZW5kZW5jaWVzID0gW107XG4gICAgICAgICAgICBpZiAoKCh0aGlzLm1vZGVsID0gdGhpcy5vYnNlcnZlci50YXJnZXQpICE9IG51bGwpICYmICgoX3JlZjIgPSB0aGlzLm9wdGlvbnMuZGVwZW5kZW5jaWVzKSAhPSBudWxsID8gX3JlZjIubGVuZ3RoIDogdm9pZCAwKSkge1xuICAgICAgICAgICAgICBfcmVmMyA9IHRoaXMub3B0aW9ucy5kZXBlbmRlbmNpZXM7XG4gICAgICAgICAgICAgIGZvciAoX2ogPSAwLCBfbGVuMSA9IF9yZWYzLmxlbmd0aDsgX2ogPCBfbGVuMTsgX2orKykge1xuICAgICAgICAgICAgICAgIGRlcGVuZGVuY3kgPSBfcmVmM1tfal07XG4gICAgICAgICAgICAgICAgb2JzZXJ2ZXIgPSB0aGlzLm9ic2VydmUodGhpcy5tb2RlbCwgZGVwZW5kZW5jeSwgdGhpcy5zeW5jKTtcbiAgICAgICAgICAgICAgICB0aGlzLmRlcGVuZGVuY2llcy5wdXNoKG9ic2VydmVyKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdGhpcy5vYnNlcnZlci52YWx1ZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB0aGlzLnZhbHVlO1xuICAgICAgICB9XG4gICAgICB9KS5jYWxsKHRoaXMpKTtcbiAgICB9O1xuXG4gICAgQmluZGluZy5wcm90b3R5cGUucHVibGlzaCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGFyZ3MsIGZpLCBmaVJldmVyc2VkLCBmb3JtYXR0ZXIsIGlkLCBsYXN0Zm9ybWF0dGVySW5kZXgsIHByb2Nlc3NlZEFyZ3MsIHZhbHVlLCBfaSwgX2xlbiwgX3JlZjEsIF9yZWYyLCBfcmVmMztcbiAgICAgIGlmICh0aGlzLm9ic2VydmVyKSB7XG4gICAgICAgIHZhbHVlID0gdGhpcy5nZXRWYWx1ZSh0aGlzLmVsKTtcbiAgICAgICAgbGFzdGZvcm1hdHRlckluZGV4ID0gdGhpcy5mb3JtYXR0ZXJzLmxlbmd0aCAtIDE7XG4gICAgICAgIF9yZWYxID0gdGhpcy5mb3JtYXR0ZXJzLnNsaWNlKDApLnJldmVyc2UoKTtcbiAgICAgICAgZm9yIChmaVJldmVyc2VkID0gX2kgPSAwLCBfbGVuID0gX3JlZjEubGVuZ3RoOyBfaSA8IF9sZW47IGZpUmV2ZXJzZWQgPSArK19pKSB7XG4gICAgICAgICAgZm9ybWF0dGVyID0gX3JlZjFbZmlSZXZlcnNlZF07XG4gICAgICAgICAgZmkgPSBsYXN0Zm9ybWF0dGVySW5kZXggLSBmaVJldmVyc2VkO1xuICAgICAgICAgIGFyZ3MgPSBmb3JtYXR0ZXIuc3BsaXQoL1xccysvKTtcbiAgICAgICAgICBpZCA9IGFyZ3Muc2hpZnQoKTtcbiAgICAgICAgICBwcm9jZXNzZWRBcmdzID0gdGhpcy5wYXJzZUZvcm1hdHRlckFyZ3VtZW50cyhhcmdzLCBmaSk7XG4gICAgICAgICAgaWYgKChfcmVmMiA9IHRoaXMudmlldy5mb3JtYXR0ZXJzW2lkXSkgIT0gbnVsbCA/IF9yZWYyLnB1Ymxpc2ggOiB2b2lkIDApIHtcbiAgICAgICAgICAgIHZhbHVlID0gKF9yZWYzID0gdGhpcy52aWV3LmZvcm1hdHRlcnNbaWRdKS5wdWJsaXNoLmFwcGx5KF9yZWYzLCBbdmFsdWVdLmNvbmNhdChfX3NsaWNlLmNhbGwocHJvY2Vzc2VkQXJncykpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMub2JzZXJ2ZXIuc2V0VmFsdWUodmFsdWUpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBCaW5kaW5nLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZGVwZW5kZW5jeSwgb2JzZXJ2ZXIsIF9pLCBfbGVuLCBfcmVmMSwgX3JlZjIsIF9yZWYzO1xuICAgICAgdGhpcy5wYXJzZVRhcmdldCgpO1xuICAgICAgaWYgKChfcmVmMSA9IHRoaXMuYmluZGVyLmJpbmQpICE9IG51bGwpIHtcbiAgICAgICAgX3JlZjEuY2FsbCh0aGlzLCB0aGlzLmVsKTtcbiAgICAgIH1cbiAgICAgIGlmICgodGhpcy5tb2RlbCAhPSBudWxsKSAmJiAoKF9yZWYyID0gdGhpcy5vcHRpb25zLmRlcGVuZGVuY2llcykgIT0gbnVsbCA/IF9yZWYyLmxlbmd0aCA6IHZvaWQgMCkpIHtcbiAgICAgICAgX3JlZjMgPSB0aGlzLm9wdGlvbnMuZGVwZW5kZW5jaWVzO1xuICAgICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYzLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgICAgZGVwZW5kZW5jeSA9IF9yZWYzW19pXTtcbiAgICAgICAgICBvYnNlcnZlciA9IHRoaXMub2JzZXJ2ZSh0aGlzLm1vZGVsLCBkZXBlbmRlbmN5LCB0aGlzLnN5bmMpO1xuICAgICAgICAgIHRoaXMuZGVwZW5kZW5jaWVzLnB1c2gob2JzZXJ2ZXIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodGhpcy52aWV3LnByZWxvYWREYXRhKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN5bmMoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgQmluZGluZy5wcm90b3R5cGUudW5iaW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYWksIGFyZ3MsIGZpLCBvYnNlcnZlciwgX2ksIF9sZW4sIF9yZWYxLCBfcmVmMiwgX3JlZjMsIF9yZWY0O1xuICAgICAgaWYgKChfcmVmMSA9IHRoaXMuYmluZGVyLnVuYmluZCkgIT0gbnVsbCkge1xuICAgICAgICBfcmVmMS5jYWxsKHRoaXMsIHRoaXMuZWwpO1xuICAgICAgfVxuICAgICAgaWYgKChfcmVmMiA9IHRoaXMub2JzZXJ2ZXIpICE9IG51bGwpIHtcbiAgICAgICAgX3JlZjIudW5vYnNlcnZlKCk7XG4gICAgICB9XG4gICAgICBfcmVmMyA9IHRoaXMuZGVwZW5kZW5jaWVzO1xuICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmMy5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICBvYnNlcnZlciA9IF9yZWYzW19pXTtcbiAgICAgICAgb2JzZXJ2ZXIudW5vYnNlcnZlKCk7XG4gICAgICB9XG4gICAgICB0aGlzLmRlcGVuZGVuY2llcyA9IFtdO1xuICAgICAgX3JlZjQgPSB0aGlzLmZvcm1hdHRlck9ic2VydmVycztcbiAgICAgIGZvciAoZmkgaW4gX3JlZjQpIHtcbiAgICAgICAgYXJncyA9IF9yZWY0W2ZpXTtcbiAgICAgICAgZm9yIChhaSBpbiBhcmdzKSB7XG4gICAgICAgICAgb2JzZXJ2ZXIgPSBhcmdzW2FpXTtcbiAgICAgICAgICBvYnNlcnZlci51bm9ic2VydmUoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuZm9ybWF0dGVyT2JzZXJ2ZXJzID0ge307XG4gICAgfTtcblxuICAgIEJpbmRpbmcucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKG1vZGVscykge1xuICAgICAgdmFyIF9yZWYxLCBfcmVmMjtcbiAgICAgIGlmIChtb2RlbHMgPT0gbnVsbCkge1xuICAgICAgICBtb2RlbHMgPSB7fTtcbiAgICAgIH1cbiAgICAgIHRoaXMubW9kZWwgPSAoX3JlZjEgPSB0aGlzLm9ic2VydmVyKSAhPSBudWxsID8gX3JlZjEudGFyZ2V0IDogdm9pZCAwO1xuICAgICAgcmV0dXJuIChfcmVmMiA9IHRoaXMuYmluZGVyLnVwZGF0ZSkgIT0gbnVsbCA/IF9yZWYyLmNhbGwodGhpcywgbW9kZWxzKSA6IHZvaWQgMDtcbiAgICB9O1xuXG4gICAgQmluZGluZy5wcm90b3R5cGUuZ2V0VmFsdWUgPSBmdW5jdGlvbihlbCkge1xuICAgICAgaWYgKHRoaXMuYmluZGVyICYmICh0aGlzLmJpbmRlci5nZXRWYWx1ZSAhPSBudWxsKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5iaW5kZXIuZ2V0VmFsdWUuY2FsbCh0aGlzLCBlbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gUml2ZXRzLlV0aWwuZ2V0SW5wdXRWYWx1ZShlbCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiBCaW5kaW5nO1xuXG4gIH0pKCk7XG5cbiAgUml2ZXRzLkNvbXBvbmVudEJpbmRpbmcgPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKENvbXBvbmVudEJpbmRpbmcsIF9zdXBlcik7XG5cbiAgICBmdW5jdGlvbiBDb21wb25lbnRCaW5kaW5nKHZpZXcsIGVsLCB0eXBlKSB7XG4gICAgICB2YXIgYXR0cmlidXRlLCBiaW5kaW5nUmVnRXhwLCBwcm9wZXJ0eU5hbWUsIHRva2VuLCBfaSwgX2xlbiwgX3JlZjEsIF9yZWYyO1xuICAgICAgdGhpcy52aWV3ID0gdmlldztcbiAgICAgIHRoaXMuZWwgPSBlbDtcbiAgICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgICB0aGlzLnVuYmluZCA9IF9fYmluZCh0aGlzLnVuYmluZCwgdGhpcyk7XG4gICAgICB0aGlzLmJpbmQgPSBfX2JpbmQodGhpcy5iaW5kLCB0aGlzKTtcbiAgICAgIHRoaXMubG9jYWxzID0gX19iaW5kKHRoaXMubG9jYWxzLCB0aGlzKTtcbiAgICAgIHRoaXMuY29tcG9uZW50ID0gdGhpcy52aWV3LmNvbXBvbmVudHNbdGhpcy50eXBlXTtcbiAgICAgIHRoaXNbXCJzdGF0aWNcIl0gPSB7fTtcbiAgICAgIHRoaXMub2JzZXJ2ZXJzID0ge307XG4gICAgICB0aGlzLnVwc3RyZWFtT2JzZXJ2ZXJzID0ge307XG4gICAgICBiaW5kaW5nUmVnRXhwID0gdmlldy5iaW5kaW5nUmVnRXhwKCk7XG4gICAgICBfcmVmMSA9IHRoaXMuZWwuYXR0cmlidXRlcyB8fCBbXTtcbiAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZjEubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgYXR0cmlidXRlID0gX3JlZjFbX2ldO1xuICAgICAgICBpZiAoIWJpbmRpbmdSZWdFeHAudGVzdChhdHRyaWJ1dGUubmFtZSkpIHtcbiAgICAgICAgICBwcm9wZXJ0eU5hbWUgPSB0aGlzLmNhbWVsQ2FzZShhdHRyaWJ1dGUubmFtZSk7XG4gICAgICAgICAgdG9rZW4gPSBSaXZldHMuVHlwZVBhcnNlci5wYXJzZShhdHRyaWJ1dGUudmFsdWUpO1xuICAgICAgICAgIGlmIChfX2luZGV4T2YuY2FsbCgoX3JlZjIgPSB0aGlzLmNvbXBvbmVudFtcInN0YXRpY1wiXSkgIT0gbnVsbCA/IF9yZWYyIDogW10sIHByb3BlcnR5TmFtZSkgPj0gMCkge1xuICAgICAgICAgICAgdGhpc1tcInN0YXRpY1wiXVtwcm9wZXJ0eU5hbWVdID0gYXR0cmlidXRlLnZhbHVlO1xuICAgICAgICAgIH0gZWxzZSBpZiAodG9rZW4udHlwZSA9PT0gUml2ZXRzLlR5cGVQYXJzZXIudHlwZXMucHJpbWl0aXZlKSB7XG4gICAgICAgICAgICB0aGlzW1wic3RhdGljXCJdW3Byb3BlcnR5TmFtZV0gPSB0b2tlbi52YWx1ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5vYnNlcnZlcnNbcHJvcGVydHlOYW1lXSA9IGF0dHJpYnV0ZS52YWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBDb21wb25lbnRCaW5kaW5nLnByb3RvdHlwZS5zeW5jID0gZnVuY3Rpb24oKSB7fTtcblxuICAgIENvbXBvbmVudEJpbmRpbmcucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKCkge307XG5cbiAgICBDb21wb25lbnRCaW5kaW5nLnByb3RvdHlwZS5wdWJsaXNoID0gZnVuY3Rpb24oKSB7fTtcblxuICAgIENvbXBvbmVudEJpbmRpbmcucHJvdG90eXBlLmxvY2FscyA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGtleSwgb2JzZXJ2ZXIsIHJlc3VsdCwgdmFsdWUsIF9yZWYxLCBfcmVmMjtcbiAgICAgIHJlc3VsdCA9IHt9O1xuICAgICAgX3JlZjEgPSB0aGlzW1wic3RhdGljXCJdO1xuICAgICAgZm9yIChrZXkgaW4gX3JlZjEpIHtcbiAgICAgICAgdmFsdWUgPSBfcmVmMVtrZXldO1xuICAgICAgICByZXN1bHRba2V5XSA9IHZhbHVlO1xuICAgICAgfVxuICAgICAgX3JlZjIgPSB0aGlzLm9ic2VydmVycztcbiAgICAgIGZvciAoa2V5IGluIF9yZWYyKSB7XG4gICAgICAgIG9ic2VydmVyID0gX3JlZjJba2V5XTtcbiAgICAgICAgcmVzdWx0W2tleV0gPSBvYnNlcnZlci52YWx1ZSgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuXG4gICAgQ29tcG9uZW50QmluZGluZy5wcm90b3R5cGUuY2FtZWxDYXNlID0gZnVuY3Rpb24oc3RyaW5nKSB7XG4gICAgICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoLy0oW2Etel0pL2csIGZ1bmN0aW9uKGdyb3VwZWQpIHtcbiAgICAgICAgcmV0dXJuIGdyb3VwZWRbMV0udG9VcHBlckNhc2UoKTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBDb21wb25lbnRCaW5kaW5nLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgaywga2V5LCBrZXlwYXRoLCBvYnNlcnZlciwgb3B0aW9uLCBvcHRpb25zLCBzY29wZSwgdiwgX2Jhc2UsIF9pLCBfaiwgX2xlbiwgX2xlbjEsIF9yZWYxLCBfcmVmMiwgX3JlZjMsIF9yZWY0LCBfcmVmNSwgX3JlZjYsIF9yZWY3O1xuICAgICAgaWYgKCF0aGlzLmJvdW5kKSB7XG4gICAgICAgIF9yZWYxID0gdGhpcy5vYnNlcnZlcnM7XG4gICAgICAgIGZvciAoa2V5IGluIF9yZWYxKSB7XG4gICAgICAgICAga2V5cGF0aCA9IF9yZWYxW2tleV07XG4gICAgICAgICAgdGhpcy5vYnNlcnZlcnNba2V5XSA9IHRoaXMub2JzZXJ2ZSh0aGlzLnZpZXcubW9kZWxzLCBrZXlwYXRoLCAoKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXMuY29tcG9uZW50Vmlldy5tb2RlbHNba2V5XSA9IF90aGlzLm9ic2VydmVyc1trZXldLnZhbHVlKCk7XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0pKHRoaXMpKS5jYWxsKHRoaXMsIGtleSkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYm91bmQgPSB0cnVlO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuY29tcG9uZW50VmlldyAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuY29tcG9uZW50Vmlldy5iaW5kKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmVsLmlubmVySFRNTCA9IHRoaXMuY29tcG9uZW50LnRlbXBsYXRlLmNhbGwodGhpcyk7XG4gICAgICAgIHNjb3BlID0gdGhpcy5jb21wb25lbnQuaW5pdGlhbGl6ZS5jYWxsKHRoaXMsIHRoaXMuZWwsIHRoaXMubG9jYWxzKCkpO1xuICAgICAgICB0aGlzLmVsLl9ib3VuZCA9IHRydWU7XG4gICAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICAgICAgX3JlZjIgPSBSaXZldHMuZXh0ZW5zaW9ucztcbiAgICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmMi5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICAgIG9wdGlvbiA9IF9yZWYyW19pXTtcbiAgICAgICAgICBvcHRpb25zW29wdGlvbl0gPSB7fTtcbiAgICAgICAgICBpZiAodGhpcy5jb21wb25lbnRbb3B0aW9uXSkge1xuICAgICAgICAgICAgX3JlZjMgPSB0aGlzLmNvbXBvbmVudFtvcHRpb25dO1xuICAgICAgICAgICAgZm9yIChrIGluIF9yZWYzKSB7XG4gICAgICAgICAgICAgIHYgPSBfcmVmM1trXTtcbiAgICAgICAgICAgICAgb3B0aW9uc1tvcHRpb25dW2tdID0gdjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgX3JlZjQgPSB0aGlzLnZpZXdbb3B0aW9uXTtcbiAgICAgICAgICBmb3IgKGsgaW4gX3JlZjQpIHtcbiAgICAgICAgICAgIHYgPSBfcmVmNFtrXTtcbiAgICAgICAgICAgIGlmICgoX2Jhc2UgPSBvcHRpb25zW29wdGlvbl0pW2tdID09IG51bGwpIHtcbiAgICAgICAgICAgICAgX2Jhc2Vba10gPSB2O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBfcmVmNSA9IFJpdmV0cy5vcHRpb25zO1xuICAgICAgICBmb3IgKF9qID0gMCwgX2xlbjEgPSBfcmVmNS5sZW5ndGg7IF9qIDwgX2xlbjE7IF9qKyspIHtcbiAgICAgICAgICBvcHRpb24gPSBfcmVmNVtfal07XG4gICAgICAgICAgb3B0aW9uc1tvcHRpb25dID0gKF9yZWY2ID0gdGhpcy5jb21wb25lbnRbb3B0aW9uXSkgIT0gbnVsbCA/IF9yZWY2IDogdGhpcy52aWV3W29wdGlvbl07XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb21wb25lbnRWaWV3ID0gbmV3IFJpdmV0cy5WaWV3KEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHRoaXMuZWwuY2hpbGROb2RlcyksIHNjb3BlLCBvcHRpb25zKTtcbiAgICAgICAgdGhpcy5jb21wb25lbnRWaWV3LmJpbmQoKTtcbiAgICAgICAgX3JlZjcgPSB0aGlzLm9ic2VydmVycztcbiAgICAgICAgZm9yIChrZXkgaW4gX3JlZjcpIHtcbiAgICAgICAgICBvYnNlcnZlciA9IF9yZWY3W2tleV07XG4gICAgICAgICAgdGhpcy51cHN0cmVhbU9ic2VydmVyc1trZXldID0gdGhpcy5vYnNlcnZlKHRoaXMuY29tcG9uZW50Vmlldy5tb2RlbHMsIGtleSwgKChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGtleSwgb2JzZXJ2ZXIpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBvYnNlcnZlci5zZXRWYWx1ZShfdGhpcy5jb21wb25lbnRWaWV3Lm1vZGVsc1trZXldKTtcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSkodGhpcykpLmNhbGwodGhpcywga2V5LCBvYnNlcnZlcikpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIENvbXBvbmVudEJpbmRpbmcucHJvdG90eXBlLnVuYmluZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGtleSwgb2JzZXJ2ZXIsIF9yZWYxLCBfcmVmMiwgX3JlZjM7XG4gICAgICBfcmVmMSA9IHRoaXMudXBzdHJlYW1PYnNlcnZlcnM7XG4gICAgICBmb3IgKGtleSBpbiBfcmVmMSkge1xuICAgICAgICBvYnNlcnZlciA9IF9yZWYxW2tleV07XG4gICAgICAgIG9ic2VydmVyLnVub2JzZXJ2ZSgpO1xuICAgICAgfVxuICAgICAgX3JlZjIgPSB0aGlzLm9ic2VydmVycztcbiAgICAgIGZvciAoa2V5IGluIF9yZWYyKSB7XG4gICAgICAgIG9ic2VydmVyID0gX3JlZjJba2V5XTtcbiAgICAgICAgb2JzZXJ2ZXIudW5vYnNlcnZlKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gKF9yZWYzID0gdGhpcy5jb21wb25lbnRWaWV3KSAhPSBudWxsID8gX3JlZjMudW5iaW5kLmNhbGwodGhpcykgOiB2b2lkIDA7XG4gICAgfTtcblxuICAgIHJldHVybiBDb21wb25lbnRCaW5kaW5nO1xuXG4gIH0pKFJpdmV0cy5CaW5kaW5nKTtcblxuICBSaXZldHMuVGV4dEJpbmRpbmcgPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKFRleHRCaW5kaW5nLCBfc3VwZXIpO1xuXG4gICAgZnVuY3Rpb24gVGV4dEJpbmRpbmcodmlldywgZWwsIHR5cGUsIGtleXBhdGgsIG9wdGlvbnMpIHtcbiAgICAgIHRoaXMudmlldyA9IHZpZXc7XG4gICAgICB0aGlzLmVsID0gZWw7XG4gICAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgICAgdGhpcy5rZXlwYXRoID0ga2V5cGF0aDtcbiAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnMgIT0gbnVsbCA/IG9wdGlvbnMgOiB7fTtcbiAgICAgIHRoaXMuc3luYyA9IF9fYmluZCh0aGlzLnN5bmMsIHRoaXMpO1xuICAgICAgdGhpcy5mb3JtYXR0ZXJzID0gdGhpcy5vcHRpb25zLmZvcm1hdHRlcnMgfHwgW107XG4gICAgICB0aGlzLmRlcGVuZGVuY2llcyA9IFtdO1xuICAgICAgdGhpcy5mb3JtYXR0ZXJPYnNlcnZlcnMgPSB7fTtcbiAgICB9XG5cbiAgICBUZXh0QmluZGluZy5wcm90b3R5cGUuYmluZGVyID0ge1xuICAgICAgcm91dGluZTogZnVuY3Rpb24obm9kZSwgdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIG5vZGUuZGF0YSA9IHZhbHVlICE9IG51bGwgPyB2YWx1ZSA6ICcnO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBUZXh0QmluZGluZy5wcm90b3R5cGUuc3luYyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIFRleHRCaW5kaW5nLl9fc3VwZXJfXy5zeW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcblxuICAgIHJldHVybiBUZXh0QmluZGluZztcblxuICB9KShSaXZldHMuQmluZGluZyk7XG5cbiAgUml2ZXRzW1wicHVibGljXCJdLmJpbmRlcnMudGV4dCA9IGZ1bmN0aW9uKGVsLCB2YWx1ZSkge1xuICAgIGlmIChlbC50ZXh0Q29udGVudCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gZWwudGV4dENvbnRlbnQgPSB2YWx1ZSAhPSBudWxsID8gdmFsdWUgOiAnJztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGVsLmlubmVyVGV4dCA9IHZhbHVlICE9IG51bGwgPyB2YWx1ZSA6ICcnO1xuICAgIH1cbiAgfTtcblxuICBSaXZldHNbXCJwdWJsaWNcIl0uYmluZGVycy5odG1sID0gZnVuY3Rpb24oZWwsIHZhbHVlKSB7XG4gICAgcmV0dXJuIGVsLmlubmVySFRNTCA9IHZhbHVlICE9IG51bGwgPyB2YWx1ZSA6ICcnO1xuICB9O1xuXG4gIFJpdmV0c1tcInB1YmxpY1wiXS5iaW5kZXJzLnNob3cgPSBmdW5jdGlvbihlbCwgdmFsdWUpIHtcbiAgICByZXR1cm4gZWwuc3R5bGUuZGlzcGxheSA9IHZhbHVlID8gJycgOiAnbm9uZSc7XG4gIH07XG5cbiAgUml2ZXRzW1wicHVibGljXCJdLmJpbmRlcnMuaGlkZSA9IGZ1bmN0aW9uKGVsLCB2YWx1ZSkge1xuICAgIHJldHVybiBlbC5zdHlsZS5kaXNwbGF5ID0gdmFsdWUgPyAnbm9uZScgOiAnJztcbiAgfTtcblxuICBSaXZldHNbXCJwdWJsaWNcIl0uYmluZGVycy5lbmFibGVkID0gZnVuY3Rpb24oZWwsIHZhbHVlKSB7XG4gICAgcmV0dXJuIGVsLmRpc2FibGVkID0gIXZhbHVlO1xuICB9O1xuXG4gIFJpdmV0c1tcInB1YmxpY1wiXS5iaW5kZXJzLmRpc2FibGVkID0gZnVuY3Rpb24oZWwsIHZhbHVlKSB7XG4gICAgcmV0dXJuIGVsLmRpc2FibGVkID0gISF2YWx1ZTtcbiAgfTtcblxuICBSaXZldHNbXCJwdWJsaWNcIl0uYmluZGVycy5jaGVja2VkID0ge1xuICAgIHB1Ymxpc2hlczogdHJ1ZSxcbiAgICBwcmlvcml0eTogMjAwMCxcbiAgICBiaW5kOiBmdW5jdGlvbihlbCkge1xuICAgICAgcmV0dXJuIFJpdmV0cy5VdGlsLmJpbmRFdmVudChlbCwgJ2NoYW5nZScsIHRoaXMucHVibGlzaCk7XG4gICAgfSxcbiAgICB1bmJpbmQ6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICByZXR1cm4gUml2ZXRzLlV0aWwudW5iaW5kRXZlbnQoZWwsICdjaGFuZ2UnLCB0aGlzLnB1Ymxpc2gpO1xuICAgIH0sXG4gICAgcm91dGluZTogZnVuY3Rpb24oZWwsIHZhbHVlKSB7XG4gICAgICB2YXIgX3JlZjE7XG4gICAgICBpZiAoZWwudHlwZSA9PT0gJ3JhZGlvJykge1xuICAgICAgICByZXR1cm4gZWwuY2hlY2tlZCA9ICgoX3JlZjEgPSBlbC52YWx1ZSkgIT0gbnVsbCA/IF9yZWYxLnRvU3RyaW5nKCkgOiB2b2lkIDApID09PSAodmFsdWUgIT0gbnVsbCA/IHZhbHVlLnRvU3RyaW5nKCkgOiB2b2lkIDApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGVsLmNoZWNrZWQgPSAhIXZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBSaXZldHNbXCJwdWJsaWNcIl0uYmluZGVycy51bmNoZWNrZWQgPSB7XG4gICAgcHVibGlzaGVzOiB0cnVlLFxuICAgIHByaW9yaXR5OiAyMDAwLFxuICAgIGJpbmQ6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICByZXR1cm4gUml2ZXRzLlV0aWwuYmluZEV2ZW50KGVsLCAnY2hhbmdlJywgdGhpcy5wdWJsaXNoKTtcbiAgICB9LFxuICAgIHVuYmluZDogZnVuY3Rpb24oZWwpIHtcbiAgICAgIHJldHVybiBSaXZldHMuVXRpbC51bmJpbmRFdmVudChlbCwgJ2NoYW5nZScsIHRoaXMucHVibGlzaCk7XG4gICAgfSxcbiAgICByb3V0aW5lOiBmdW5jdGlvbihlbCwgdmFsdWUpIHtcbiAgICAgIHZhciBfcmVmMTtcbiAgICAgIGlmIChlbC50eXBlID09PSAncmFkaW8nKSB7XG4gICAgICAgIHJldHVybiBlbC5jaGVja2VkID0gKChfcmVmMSA9IGVsLnZhbHVlKSAhPSBudWxsID8gX3JlZjEudG9TdHJpbmcoKSA6IHZvaWQgMCkgIT09ICh2YWx1ZSAhPSBudWxsID8gdmFsdWUudG9TdHJpbmcoKSA6IHZvaWQgMCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZWwuY2hlY2tlZCA9ICF2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgUml2ZXRzW1wicHVibGljXCJdLmJpbmRlcnMudmFsdWUgPSB7XG4gICAgcHVibGlzaGVzOiB0cnVlLFxuICAgIHByaW9yaXR5OiAzMDAwLFxuICAgIGJpbmQ6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICBpZiAoIShlbC50YWdOYW1lID09PSAnSU5QVVQnICYmIGVsLnR5cGUgPT09ICdyYWRpbycpKSB7XG4gICAgICAgIHRoaXMuZXZlbnQgPSBlbC50YWdOYW1lID09PSAnU0VMRUNUJyA/ICdjaGFuZ2UnIDogJ2lucHV0JztcbiAgICAgICAgcmV0dXJuIFJpdmV0cy5VdGlsLmJpbmRFdmVudChlbCwgdGhpcy5ldmVudCwgdGhpcy5wdWJsaXNoKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHVuYmluZDogZnVuY3Rpb24oZWwpIHtcbiAgICAgIGlmICghKGVsLnRhZ05hbWUgPT09ICdJTlBVVCcgJiYgZWwudHlwZSA9PT0gJ3JhZGlvJykpIHtcbiAgICAgICAgcmV0dXJuIFJpdmV0cy5VdGlsLnVuYmluZEV2ZW50KGVsLCB0aGlzLmV2ZW50LCB0aGlzLnB1Ymxpc2gpO1xuICAgICAgfVxuICAgIH0sXG4gICAgcm91dGluZTogZnVuY3Rpb24oZWwsIHZhbHVlKSB7XG4gICAgICB2YXIgbywgX2ksIF9sZW4sIF9yZWYxLCBfcmVmMiwgX3JlZjMsIF9yZXN1bHRzO1xuICAgICAgaWYgKGVsLnRhZ05hbWUgPT09ICdJTlBVVCcgJiYgZWwudHlwZSA9PT0gJ3JhZGlvJykge1xuICAgICAgICByZXR1cm4gZWwuc2V0QXR0cmlidXRlKCd2YWx1ZScsIHZhbHVlKTtcbiAgICAgIH0gZWxzZSBpZiAod2luZG93LmpRdWVyeSAhPSBudWxsKSB7XG4gICAgICAgIGVsID0galF1ZXJ5KGVsKTtcbiAgICAgICAgaWYgKCh2YWx1ZSAhPSBudWxsID8gdmFsdWUudG9TdHJpbmcoKSA6IHZvaWQgMCkgIT09ICgoX3JlZjEgPSBlbC52YWwoKSkgIT0gbnVsbCA/IF9yZWYxLnRvU3RyaW5nKCkgOiB2b2lkIDApKSB7XG4gICAgICAgICAgcmV0dXJuIGVsLnZhbCh2YWx1ZSAhPSBudWxsID8gdmFsdWUgOiAnJyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChlbC50eXBlID09PSAnc2VsZWN0LW11bHRpcGxlJykge1xuICAgICAgICAgIGlmICh2YWx1ZSAhPSBudWxsKSB7XG4gICAgICAgICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBlbC5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICAgICAgICBvID0gZWxbX2ldO1xuICAgICAgICAgICAgICBfcmVzdWx0cy5wdXNoKG8uc2VsZWN0ZWQgPSAoX3JlZjIgPSBvLnZhbHVlLCBfX2luZGV4T2YuY2FsbCh2YWx1ZSwgX3JlZjIpID49IDApKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBfcmVzdWx0cztcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoKHZhbHVlICE9IG51bGwgPyB2YWx1ZS50b1N0cmluZygpIDogdm9pZCAwKSAhPT0gKChfcmVmMyA9IGVsLnZhbHVlKSAhPSBudWxsID8gX3JlZjMudG9TdHJpbmcoKSA6IHZvaWQgMCkpIHtcbiAgICAgICAgICByZXR1cm4gZWwudmFsdWUgPSB2YWx1ZSAhPSBudWxsID8gdmFsdWUgOiAnJztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBSaXZldHNbXCJwdWJsaWNcIl0uYmluZGVyc1tcImlmXCJdID0ge1xuICAgIGJsb2NrOiB0cnVlLFxuICAgIHByaW9yaXR5OiA0MDAwLFxuICAgIGJpbmQ6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICB2YXIgYXR0ciwgZGVjbGFyYXRpb247XG4gICAgICBpZiAodGhpcy5tYXJrZXIgPT0gbnVsbCkge1xuICAgICAgICBhdHRyID0gW3RoaXMudmlldy5wcmVmaXgsIHRoaXMudHlwZV0uam9pbignLScpLnJlcGxhY2UoJy0tJywgJy0nKTtcbiAgICAgICAgZGVjbGFyYXRpb24gPSBlbC5nZXRBdHRyaWJ1dGUoYXR0cik7XG4gICAgICAgIHRoaXMubWFya2VyID0gZG9jdW1lbnQuY3JlYXRlQ29tbWVudChcIiByaXZldHM6IFwiICsgdGhpcy50eXBlICsgXCIgXCIgKyBkZWNsYXJhdGlvbiArIFwiIFwiKTtcbiAgICAgICAgdGhpcy5ib3VuZCA9IGZhbHNlO1xuICAgICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoYXR0cik7XG4gICAgICAgIGVsLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHRoaXMubWFya2VyLCBlbCk7XG4gICAgICAgIHJldHVybiBlbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHVuYmluZDogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy5uZXN0ZWQpIHtcbiAgICAgICAgdGhpcy5uZXN0ZWQudW5iaW5kKCk7XG4gICAgICAgIHJldHVybiB0aGlzLmJvdW5kID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSxcbiAgICByb3V0aW5lOiBmdW5jdGlvbihlbCwgdmFsdWUpIHtcbiAgICAgIHZhciBrZXksIG1vZGVsLCBtb2RlbHMsIF9yZWYxO1xuICAgICAgaWYgKCEhdmFsdWUgPT09ICF0aGlzLmJvdW5kKSB7XG4gICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgIG1vZGVscyA9IHt9O1xuICAgICAgICAgIF9yZWYxID0gdGhpcy52aWV3Lm1vZGVscztcbiAgICAgICAgICBmb3IgKGtleSBpbiBfcmVmMSkge1xuICAgICAgICAgICAgbW9kZWwgPSBfcmVmMVtrZXldO1xuICAgICAgICAgICAgbW9kZWxzW2tleV0gPSBtb2RlbDtcbiAgICAgICAgICB9XG4gICAgICAgICAgKHRoaXMubmVzdGVkIHx8ICh0aGlzLm5lc3RlZCA9IG5ldyBSaXZldHMuVmlldyhlbCwgbW9kZWxzLCB0aGlzLnZpZXcub3B0aW9ucygpKSkpLmJpbmQoKTtcbiAgICAgICAgICB0aGlzLm1hcmtlci5wYXJlbnROb2RlLmluc2VydEJlZm9yZShlbCwgdGhpcy5tYXJrZXIubmV4dFNpYmxpbmcpO1xuICAgICAgICAgIHJldHVybiB0aGlzLmJvdW5kID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsKTtcbiAgICAgICAgICB0aGlzLm5lc3RlZC51bmJpbmQoKTtcbiAgICAgICAgICByZXR1cm4gdGhpcy5ib3VuZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICB1cGRhdGU6IGZ1bmN0aW9uKG1vZGVscykge1xuICAgICAgdmFyIF9yZWYxO1xuICAgICAgcmV0dXJuIChfcmVmMSA9IHRoaXMubmVzdGVkKSAhPSBudWxsID8gX3JlZjEudXBkYXRlKG1vZGVscykgOiB2b2lkIDA7XG4gICAgfVxuICB9O1xuXG4gIFJpdmV0c1tcInB1YmxpY1wiXS5iaW5kZXJzLnVubGVzcyA9IHtcbiAgICBibG9jazogdHJ1ZSxcbiAgICBwcmlvcml0eTogNDAwMCxcbiAgICBiaW5kOiBmdW5jdGlvbihlbCkge1xuICAgICAgcmV0dXJuIFJpdmV0c1tcInB1YmxpY1wiXS5iaW5kZXJzW1wiaWZcIl0uYmluZC5jYWxsKHRoaXMsIGVsKTtcbiAgICB9LFxuICAgIHVuYmluZDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gUml2ZXRzW1wicHVibGljXCJdLmJpbmRlcnNbXCJpZlwiXS51bmJpbmQuY2FsbCh0aGlzKTtcbiAgICB9LFxuICAgIHJvdXRpbmU6IGZ1bmN0aW9uKGVsLCB2YWx1ZSkge1xuICAgICAgcmV0dXJuIFJpdmV0c1tcInB1YmxpY1wiXS5iaW5kZXJzW1wiaWZcIl0ucm91dGluZS5jYWxsKHRoaXMsIGVsLCAhdmFsdWUpO1xuICAgIH0sXG4gICAgdXBkYXRlOiBmdW5jdGlvbihtb2RlbHMpIHtcbiAgICAgIHJldHVybiBSaXZldHNbXCJwdWJsaWNcIl0uYmluZGVyc1tcImlmXCJdLnVwZGF0ZS5jYWxsKHRoaXMsIG1vZGVscyk7XG4gICAgfVxuICB9O1xuXG4gIFJpdmV0c1tcInB1YmxpY1wiXS5iaW5kZXJzWydvbi0qJ10gPSB7XG4gICAgXCJmdW5jdGlvblwiOiB0cnVlLFxuICAgIHByaW9yaXR5OiAxMDAwLFxuICAgIHVuYmluZDogZnVuY3Rpb24oZWwpIHtcbiAgICAgIGlmICh0aGlzLmhhbmRsZXIpIHtcbiAgICAgICAgcmV0dXJuIFJpdmV0cy5VdGlsLnVuYmluZEV2ZW50KGVsLCB0aGlzLmFyZ3NbMF0sIHRoaXMuaGFuZGxlcik7XG4gICAgICB9XG4gICAgfSxcbiAgICByb3V0aW5lOiBmdW5jdGlvbihlbCwgdmFsdWUpIHtcbiAgICAgIGlmICh0aGlzLmhhbmRsZXIpIHtcbiAgICAgICAgUml2ZXRzLlV0aWwudW5iaW5kRXZlbnQoZWwsIHRoaXMuYXJnc1swXSwgdGhpcy5oYW5kbGVyKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBSaXZldHMuVXRpbC5iaW5kRXZlbnQoZWwsIHRoaXMuYXJnc1swXSwgdGhpcy5oYW5kbGVyID0gdGhpcy5ldmVudEhhbmRsZXIodmFsdWUpKTtcbiAgICB9XG4gIH07XG5cbiAgUml2ZXRzW1wicHVibGljXCJdLmJpbmRlcnNbJ2VhY2gtKiddID0ge1xuICAgIGJsb2NrOiB0cnVlLFxuICAgIHByaW9yaXR5OiA0MDAwLFxuICAgIGJpbmQ6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICB2YXIgYXR0ciwgdmlldywgX2ksIF9sZW4sIF9yZWYxO1xuICAgICAgaWYgKHRoaXMubWFya2VyID09IG51bGwpIHtcbiAgICAgICAgYXR0ciA9IFt0aGlzLnZpZXcucHJlZml4LCB0aGlzLnR5cGVdLmpvaW4oJy0nKS5yZXBsYWNlKCctLScsICctJyk7XG4gICAgICAgIHRoaXMubWFya2VyID0gZG9jdW1lbnQuY3JlYXRlQ29tbWVudChcIiByaXZldHM6IFwiICsgdGhpcy50eXBlICsgXCIgXCIpO1xuICAgICAgICB0aGlzLml0ZXJhdGVkID0gW107XG4gICAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZShhdHRyKTtcbiAgICAgICAgZWwucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodGhpcy5tYXJrZXIsIGVsKTtcbiAgICAgICAgZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBfcmVmMSA9IHRoaXMuaXRlcmF0ZWQ7XG4gICAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZjEubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgICB2aWV3ID0gX3JlZjFbX2ldO1xuICAgICAgICAgIHZpZXcuYmluZCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICB1bmJpbmQ6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICB2YXIgdmlldywgX2ksIF9sZW4sIF9yZWYxO1xuICAgICAgaWYgKHRoaXMuaXRlcmF0ZWQgIT0gbnVsbCkge1xuICAgICAgICBfcmVmMSA9IHRoaXMuaXRlcmF0ZWQ7XG4gICAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZjEubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgICB2aWV3ID0gX3JlZjFbX2ldO1xuICAgICAgICAgIHZpZXcudW5iaW5kKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIHJvdXRpbmU6IGZ1bmN0aW9uKGVsLCBjb2xsZWN0aW9uKSB7XG4gICAgICB2YXIgYmluZGluZywgZGF0YSwgaSwgaW5kZXgsIGtleSwgbW9kZWwsIG1vZGVsTmFtZSwgb3B0aW9ucywgcHJldmlvdXMsIHRlbXBsYXRlLCB2aWV3LCBfaSwgX2osIF9rLCBfbGVuLCBfbGVuMSwgX2xlbjIsIF9yZWYxLCBfcmVmMiwgX3JlZjM7XG4gICAgICBtb2RlbE5hbWUgPSB0aGlzLmFyZ3NbMF07XG4gICAgICBjb2xsZWN0aW9uID0gY29sbGVjdGlvbiB8fCBbXTtcbiAgICAgIGlmICh0aGlzLml0ZXJhdGVkLmxlbmd0aCA+IGNvbGxlY3Rpb24ubGVuZ3RoKSB7XG4gICAgICAgIF9yZWYxID0gQXJyYXkodGhpcy5pdGVyYXRlZC5sZW5ndGggLSBjb2xsZWN0aW9uLmxlbmd0aCk7XG4gICAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZjEubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgICBpID0gX3JlZjFbX2ldO1xuICAgICAgICAgIHZpZXcgPSB0aGlzLml0ZXJhdGVkLnBvcCgpO1xuICAgICAgICAgIHZpZXcudW5iaW5kKCk7XG4gICAgICAgICAgdGhpcy5tYXJrZXIucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh2aWV3LmVsc1swXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGZvciAoaW5kZXggPSBfaiA9IDAsIF9sZW4xID0gY29sbGVjdGlvbi5sZW5ndGg7IF9qIDwgX2xlbjE7IGluZGV4ID0gKytfaikge1xuICAgICAgICBtb2RlbCA9IGNvbGxlY3Rpb25baW5kZXhdO1xuICAgICAgICBkYXRhID0ge1xuICAgICAgICAgIGluZGV4OiBpbmRleFxuICAgICAgICB9O1xuICAgICAgICBkYXRhW1JpdmV0c1tcInB1YmxpY1wiXS5pdGVyYXRpb25BbGlhcyhtb2RlbE5hbWUpXSA9IGluZGV4O1xuICAgICAgICBkYXRhW21vZGVsTmFtZV0gPSBtb2RlbDtcbiAgICAgICAgaWYgKHRoaXMuaXRlcmF0ZWRbaW5kZXhdID09IG51bGwpIHtcbiAgICAgICAgICBfcmVmMiA9IHRoaXMudmlldy5tb2RlbHM7XG4gICAgICAgICAgZm9yIChrZXkgaW4gX3JlZjIpIHtcbiAgICAgICAgICAgIG1vZGVsID0gX3JlZjJba2V5XTtcbiAgICAgICAgICAgIGlmIChkYXRhW2tleV0gPT0gbnVsbCkge1xuICAgICAgICAgICAgICBkYXRhW2tleV0gPSBtb2RlbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcHJldmlvdXMgPSB0aGlzLml0ZXJhdGVkLmxlbmd0aCA/IHRoaXMuaXRlcmF0ZWRbdGhpcy5pdGVyYXRlZC5sZW5ndGggLSAxXS5lbHNbMF0gOiB0aGlzLm1hcmtlcjtcbiAgICAgICAgICBvcHRpb25zID0gdGhpcy52aWV3Lm9wdGlvbnMoKTtcbiAgICAgICAgICBvcHRpb25zLnByZWxvYWREYXRhID0gdHJ1ZTtcbiAgICAgICAgICB0ZW1wbGF0ZSA9IGVsLmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgICB2aWV3ID0gbmV3IFJpdmV0cy5WaWV3KHRlbXBsYXRlLCBkYXRhLCBvcHRpb25zKTtcbiAgICAgICAgICB2aWV3LmJpbmQoKTtcbiAgICAgICAgICB0aGlzLml0ZXJhdGVkLnB1c2godmlldyk7XG4gICAgICAgICAgdGhpcy5tYXJrZXIucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodGVtcGxhdGUsIHByZXZpb3VzLm5leHRTaWJsaW5nKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLml0ZXJhdGVkW2luZGV4XS5tb2RlbHNbbW9kZWxOYW1lXSAhPT0gbW9kZWwpIHtcbiAgICAgICAgICB0aGlzLml0ZXJhdGVkW2luZGV4XS51cGRhdGUoZGF0YSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChlbC5ub2RlTmFtZSA9PT0gJ09QVElPTicpIHtcbiAgICAgICAgX3JlZjMgPSB0aGlzLnZpZXcuYmluZGluZ3M7XG4gICAgICAgIGZvciAoX2sgPSAwLCBfbGVuMiA9IF9yZWYzLmxlbmd0aDsgX2sgPCBfbGVuMjsgX2srKykge1xuICAgICAgICAgIGJpbmRpbmcgPSBfcmVmM1tfa107XG4gICAgICAgICAgaWYgKGJpbmRpbmcuZWwgPT09IHRoaXMubWFya2VyLnBhcmVudE5vZGUgJiYgYmluZGluZy50eXBlID09PSAndmFsdWUnKSB7XG4gICAgICAgICAgICBiaW5kaW5nLnN5bmMoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIHVwZGF0ZTogZnVuY3Rpb24obW9kZWxzKSB7XG4gICAgICB2YXIgZGF0YSwga2V5LCBtb2RlbCwgdmlldywgX2ksIF9sZW4sIF9yZWYxO1xuICAgICAgZGF0YSA9IHt9O1xuICAgICAgZm9yIChrZXkgaW4gbW9kZWxzKSB7XG4gICAgICAgIG1vZGVsID0gbW9kZWxzW2tleV07XG4gICAgICAgIGlmIChrZXkgIT09IHRoaXMuYXJnc1swXSkge1xuICAgICAgICAgIGRhdGFba2V5XSA9IG1vZGVsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBfcmVmMSA9IHRoaXMuaXRlcmF0ZWQ7XG4gICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYxLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgIHZpZXcgPSBfcmVmMVtfaV07XG4gICAgICAgIHZpZXcudXBkYXRlKGRhdGEpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBSaXZldHNbXCJwdWJsaWNcIl0uYmluZGVyc1snY2xhc3MtKiddID0gZnVuY3Rpb24oZWwsIHZhbHVlKSB7XG4gICAgdmFyIGVsQ2xhc3M7XG4gICAgZWxDbGFzcyA9IFwiIFwiICsgZWwuY2xhc3NOYW1lICsgXCIgXCI7XG4gICAgaWYgKCF2YWx1ZSA9PT0gKGVsQ2xhc3MuaW5kZXhPZihcIiBcIiArIHRoaXMuYXJnc1swXSArIFwiIFwiKSAhPT0gLTEpKSB7XG4gICAgICByZXR1cm4gZWwuY2xhc3NOYW1lID0gdmFsdWUgPyBcIlwiICsgZWwuY2xhc3NOYW1lICsgXCIgXCIgKyB0aGlzLmFyZ3NbMF0gOiBlbENsYXNzLnJlcGxhY2UoXCIgXCIgKyB0aGlzLmFyZ3NbMF0gKyBcIiBcIiwgJyAnKS50cmltKCk7XG4gICAgfVxuICB9O1xuXG4gIFJpdmV0c1tcInB1YmxpY1wiXS5iaW5kZXJzWycqJ10gPSBmdW5jdGlvbihlbCwgdmFsdWUpIHtcbiAgICBpZiAodmFsdWUgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGVsLnNldEF0dHJpYnV0ZSh0aGlzLnR5cGUsIHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGVsLnJlbW92ZUF0dHJpYnV0ZSh0aGlzLnR5cGUpO1xuICAgIH1cbiAgfTtcblxuICBSaXZldHNbXCJwdWJsaWNcIl0uZm9ybWF0dGVyc1snY2FsbCddID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFyZ3MsIHZhbHVlO1xuICAgIHZhbHVlID0gYXJndW1lbnRzWzBdLCBhcmdzID0gMiA8PSBhcmd1bWVudHMubGVuZ3RoID8gX19zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkgOiBbXTtcbiAgICByZXR1cm4gdmFsdWUuY2FsbC5hcHBseSh2YWx1ZSwgW3RoaXNdLmNvbmNhdChfX3NsaWNlLmNhbGwoYXJncykpKTtcbiAgfTtcblxuICBSaXZldHNbXCJwdWJsaWNcIl0uYWRhcHRlcnNbJy4nXSA9IHtcbiAgICBpZDogJ19ydicsXG4gICAgY291bnRlcjogMCxcbiAgICB3ZWFrbWFwOiB7fSxcbiAgICB3ZWFrUmVmZXJlbmNlOiBmdW5jdGlvbihvYmopIHtcbiAgICAgIHZhciBpZCwgX2Jhc2UsIF9uYW1lO1xuICAgICAgaWYgKCFvYmouaGFzT3duUHJvcGVydHkodGhpcy5pZCkpIHtcbiAgICAgICAgaWQgPSB0aGlzLmNvdW50ZXIrKztcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwgdGhpcy5pZCwge1xuICAgICAgICAgIHZhbHVlOiBpZFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAoX2Jhc2UgPSB0aGlzLndlYWttYXApW19uYW1lID0gb2JqW3RoaXMuaWRdXSB8fCAoX2Jhc2VbX25hbWVdID0ge1xuICAgICAgICBjYWxsYmFja3M6IHt9XG4gICAgICB9KTtcbiAgICB9LFxuICAgIGNsZWFudXBXZWFrUmVmZXJlbmNlOiBmdW5jdGlvbihyZWYsIGlkKSB7XG4gICAgICBpZiAoIU9iamVjdC5rZXlzKHJlZi5jYWxsYmFja3MpLmxlbmd0aCkge1xuICAgICAgICBpZiAoIShyZWYucG9pbnRlcnMgJiYgT2JqZWN0LmtleXMocmVmLnBvaW50ZXJzKS5sZW5ndGgpKSB7XG4gICAgICAgICAgcmV0dXJuIGRlbGV0ZSB0aGlzLndlYWttYXBbaWRdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBzdHViRnVuY3Rpb246IGZ1bmN0aW9uKG9iaiwgZm4pIHtcbiAgICAgIHZhciBtYXAsIG9yaWdpbmFsLCB3ZWFrbWFwO1xuICAgICAgb3JpZ2luYWwgPSBvYmpbZm5dO1xuICAgICAgbWFwID0gdGhpcy53ZWFrUmVmZXJlbmNlKG9iaik7XG4gICAgICB3ZWFrbWFwID0gdGhpcy53ZWFrbWFwO1xuICAgICAgcmV0dXJuIG9ialtmbl0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGNhbGxiYWNrLCBrLCByLCByZXNwb25zZSwgX2ksIF9sZW4sIF9yZWYxLCBfcmVmMiwgX3JlZjMsIF9yZWY0O1xuICAgICAgICByZXNwb25zZSA9IG9yaWdpbmFsLmFwcGx5KG9iaiwgYXJndW1lbnRzKTtcbiAgICAgICAgX3JlZjEgPSBtYXAucG9pbnRlcnM7XG4gICAgICAgIGZvciAociBpbiBfcmVmMSkge1xuICAgICAgICAgIGsgPSBfcmVmMVtyXTtcbiAgICAgICAgICBfcmVmNCA9IChfcmVmMiA9IChfcmVmMyA9IHdlYWttYXBbcl0pICE9IG51bGwgPyBfcmVmMy5jYWxsYmFja3Nba10gOiB2b2lkIDApICE9IG51bGwgPyBfcmVmMiA6IFtdO1xuICAgICAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZjQubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgICAgIGNhbGxiYWNrID0gX3JlZjRbX2ldO1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgfTtcbiAgICB9LFxuICAgIG9ic2VydmVNdXRhdGlvbnM6IGZ1bmN0aW9uKG9iaiwgcmVmLCBrZXlwYXRoKSB7XG4gICAgICB2YXIgZm4sIGZ1bmN0aW9ucywgbWFwLCBfYmFzZSwgX2ksIF9sZW47XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShvYmopKSB7XG4gICAgICAgIG1hcCA9IHRoaXMud2Vha1JlZmVyZW5jZShvYmopO1xuICAgICAgICBpZiAobWFwLnBvaW50ZXJzID09IG51bGwpIHtcbiAgICAgICAgICBtYXAucG9pbnRlcnMgPSB7fTtcbiAgICAgICAgICBmdW5jdGlvbnMgPSBbJ3B1c2gnLCAncG9wJywgJ3NoaWZ0JywgJ3Vuc2hpZnQnLCAnc29ydCcsICdyZXZlcnNlJywgJ3NwbGljZSddO1xuICAgICAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gZnVuY3Rpb25zLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgICAgICBmbiA9IGZ1bmN0aW9uc1tfaV07XG4gICAgICAgICAgICB0aGlzLnN0dWJGdW5jdGlvbihvYmosIGZuKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKChfYmFzZSA9IG1hcC5wb2ludGVycylbcmVmXSA9PSBudWxsKSB7XG4gICAgICAgICAgX2Jhc2VbcmVmXSA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIGlmIChfX2luZGV4T2YuY2FsbChtYXAucG9pbnRlcnNbcmVmXSwga2V5cGF0aCkgPCAwKSB7XG4gICAgICAgICAgcmV0dXJuIG1hcC5wb2ludGVyc1tyZWZdLnB1c2goa2V5cGF0aCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIHVub2JzZXJ2ZU11dGF0aW9uczogZnVuY3Rpb24ob2JqLCByZWYsIGtleXBhdGgpIHtcbiAgICAgIHZhciBpZHgsIG1hcCwgcG9pbnRlcnM7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShvYmopICYmIChvYmpbdGhpcy5pZF0gIT0gbnVsbCkpIHtcbiAgICAgICAgaWYgKG1hcCA9IHRoaXMud2Vha21hcFtvYmpbdGhpcy5pZF1dKSB7XG4gICAgICAgICAgaWYgKHBvaW50ZXJzID0gbWFwLnBvaW50ZXJzW3JlZl0pIHtcbiAgICAgICAgICAgIGlmICgoaWR4ID0gcG9pbnRlcnMuaW5kZXhPZihrZXlwYXRoKSkgPj0gMCkge1xuICAgICAgICAgICAgICBwb2ludGVycy5zcGxpY2UoaWR4LCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghcG9pbnRlcnMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIGRlbGV0ZSBtYXAucG9pbnRlcnNbcmVmXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNsZWFudXBXZWFrUmVmZXJlbmNlKG1hcCwgb2JqW3RoaXMuaWRdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIG9ic2VydmU6IGZ1bmN0aW9uKG9iaiwga2V5cGF0aCwgY2FsbGJhY2spIHtcbiAgICAgIHZhciBjYWxsYmFja3MsIGRlc2MsIHZhbHVlO1xuICAgICAgY2FsbGJhY2tzID0gdGhpcy53ZWFrUmVmZXJlbmNlKG9iaikuY2FsbGJhY2tzO1xuICAgICAgaWYgKGNhbGxiYWNrc1trZXlwYXRoXSA9PSBudWxsKSB7XG4gICAgICAgIGNhbGxiYWNrc1trZXlwYXRoXSA9IFtdO1xuICAgICAgICBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmosIGtleXBhdGgpO1xuICAgICAgICBpZiAoISgoZGVzYyAhPSBudWxsID8gZGVzYy5nZXQgOiB2b2lkIDApIHx8IChkZXNjICE9IG51bGwgPyBkZXNjLnNldCA6IHZvaWQgMCkpKSB7XG4gICAgICAgICAgdmFsdWUgPSBvYmpba2V5cGF0aF07XG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5cGF0aCwge1xuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24obmV3VmFsdWUpIHtcbiAgICAgICAgICAgICAgICB2YXIgY2IsIG1hcCwgX2ksIF9sZW4sIF9yZWYxO1xuICAgICAgICAgICAgICAgIGlmIChuZXdWYWx1ZSAhPT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgIF90aGlzLnVub2JzZXJ2ZU11dGF0aW9ucyh2YWx1ZSwgb2JqW190aGlzLmlkXSwga2V5cGF0aCk7XG4gICAgICAgICAgICAgICAgICB2YWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgICAgICAgICAgICAgaWYgKG1hcCA9IF90aGlzLndlYWttYXBbb2JqW190aGlzLmlkXV0pIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzID0gbWFwLmNhbGxiYWNrcztcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrc1trZXlwYXRoXSkge1xuICAgICAgICAgICAgICAgICAgICAgIF9yZWYxID0gY2FsbGJhY2tzW2tleXBhdGhdLnNsaWNlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmMS5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2IgPSBfcmVmMVtfaV07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoX19pbmRleE9mLmNhbGwoY2FsbGJhY2tzW2tleXBhdGhdLCBjYikgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBjYigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXMub2JzZXJ2ZU11dGF0aW9ucyhuZXdWYWx1ZSwgb2JqW190aGlzLmlkXSwga2V5cGF0aCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSkodGhpcylcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKF9faW5kZXhPZi5jYWxsKGNhbGxiYWNrc1trZXlwYXRoXSwgY2FsbGJhY2spIDwgMCkge1xuICAgICAgICBjYWxsYmFja3Nba2V5cGF0aF0ucHVzaChjYWxsYmFjayk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5vYnNlcnZlTXV0YXRpb25zKG9ialtrZXlwYXRoXSwgb2JqW3RoaXMuaWRdLCBrZXlwYXRoKTtcbiAgICB9LFxuICAgIHVub2JzZXJ2ZTogZnVuY3Rpb24ob2JqLCBrZXlwYXRoLCBjYWxsYmFjaykge1xuICAgICAgdmFyIGNhbGxiYWNrcywgaWR4LCBtYXA7XG4gICAgICBpZiAobWFwID0gdGhpcy53ZWFrbWFwW29ialt0aGlzLmlkXV0pIHtcbiAgICAgICAgaWYgKGNhbGxiYWNrcyA9IG1hcC5jYWxsYmFja3Nba2V5cGF0aF0pIHtcbiAgICAgICAgICBpZiAoKGlkeCA9IGNhbGxiYWNrcy5pbmRleE9mKGNhbGxiYWNrKSkgPj0gMCkge1xuICAgICAgICAgICAgY2FsbGJhY2tzLnNwbGljZShpZHgsIDEpO1xuICAgICAgICAgICAgaWYgKCFjYWxsYmFja3MubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIGRlbGV0ZSBtYXAuY2FsbGJhY2tzW2tleXBhdGhdO1xuICAgICAgICAgICAgICB0aGlzLnVub2JzZXJ2ZU11dGF0aW9ucyhvYmpba2V5cGF0aF0sIG9ialt0aGlzLmlkXSwga2V5cGF0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0aGlzLmNsZWFudXBXZWFrUmVmZXJlbmNlKG1hcCwgb2JqW3RoaXMuaWRdKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgZ2V0OiBmdW5jdGlvbihvYmosIGtleXBhdGgpIHtcbiAgICAgIHJldHVybiBvYmpba2V5cGF0aF07XG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uKG9iaiwga2V5cGF0aCwgdmFsdWUpIHtcbiAgICAgIHJldHVybiBvYmpba2V5cGF0aF0gPSB2YWx1ZTtcbiAgICB9XG4gIH07XG5cbiAgUml2ZXRzLmZhY3RvcnkgPSBmdW5jdGlvbihzaWdodGdsYXNzKSB7XG4gICAgUml2ZXRzLnNpZ2h0Z2xhc3MgPSBzaWdodGdsYXNzO1xuICAgIFJpdmV0c1tcInB1YmxpY1wiXS5fID0gUml2ZXRzO1xuICAgIHJldHVybiBSaXZldHNbXCJwdWJsaWNcIl07XG4gIH07XG5cbiAgaWYgKHR5cGVvZiAodHlwZW9mIG1vZHVsZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBtb2R1bGUgIT09IG51bGwgPyBtb2R1bGUuZXhwb3J0cyA6IHZvaWQgMCkgPT09ICdvYmplY3QnKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBSaXZldHMuZmFjdG9yeShyZXF1aXJlKCdzaWdodGdsYXNzJykpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShbJ3NpZ2h0Z2xhc3MnXSwgZnVuY3Rpb24oc2lnaHRnbGFzcykge1xuICAgICAgcmV0dXJuIHRoaXMucml2ZXRzID0gUml2ZXRzLmZhY3Rvcnkoc2lnaHRnbGFzcyk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5yaXZldHMgPSBSaXZldHMuZmFjdG9yeShzaWdodGdsYXNzKTtcbiAgfVxuXG59KS5jYWxsKHRoaXMpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAvLyBQdWJsaWMgc2lnaHRnbGFzcyBpbnRlcmZhY2UuXG4gIGZ1bmN0aW9uIHNpZ2h0Z2xhc3Mob2JqLCBrZXlwYXRoLCBjYWxsYmFjaywgb3B0aW9ucykge1xuICAgIHJldHVybiBuZXcgT2JzZXJ2ZXIob2JqLCBrZXlwYXRoLCBjYWxsYmFjaywgb3B0aW9ucylcbiAgfVxuXG4gIC8vIEJhdHRlcmllcyBub3QgaW5jbHVkZWQuXG4gIHNpZ2h0Z2xhc3MuYWRhcHRlcnMgPSB7fVxuXG4gIC8vIENvbnN0cnVjdHMgYSBuZXcga2V5cGF0aCBvYnNlcnZlciBhbmQga2lja3MgdGhpbmdzIG9mZi5cbiAgZnVuY3Rpb24gT2JzZXJ2ZXIob2JqLCBrZXlwYXRoLCBjYWxsYmFjaywgb3B0aW9ucykge1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnMgfHwge31cbiAgICB0aGlzLm9wdGlvbnMuYWRhcHRlcnMgPSB0aGlzLm9wdGlvbnMuYWRhcHRlcnMgfHwge31cbiAgICB0aGlzLm9iaiA9IG9ialxuICAgIHRoaXMua2V5cGF0aCA9IGtleXBhdGhcbiAgICB0aGlzLmNhbGxiYWNrID0gY2FsbGJhY2tcbiAgICB0aGlzLm9iamVjdFBhdGggPSBbXVxuICAgIHRoaXMudXBkYXRlID0gdGhpcy51cGRhdGUuYmluZCh0aGlzKVxuICAgIHRoaXMucGFyc2UoKVxuXG4gICAgaWYgKGlzT2JqZWN0KHRoaXMudGFyZ2V0ID0gdGhpcy5yZWFsaXplKCkpKSB7XG4gICAgICB0aGlzLnNldCh0cnVlLCB0aGlzLmtleSwgdGhpcy50YXJnZXQsIHRoaXMuY2FsbGJhY2spXG4gICAgfVxuICB9XG5cbiAgLy8gVG9rZW5pemVzIHRoZSBwcm92aWRlZCBrZXlwYXRoIHN0cmluZyBpbnRvIGludGVyZmFjZSArIHBhdGggdG9rZW5zIGZvciB0aGVcbiAgLy8gb2JzZXJ2ZXIgdG8gd29yayB3aXRoLlxuICBPYnNlcnZlci50b2tlbml6ZSA9IGZ1bmN0aW9uKGtleXBhdGgsIGludGVyZmFjZXMsIHJvb3QpIHtcbiAgICB2YXIgdG9rZW5zID0gW11cbiAgICB2YXIgY3VycmVudCA9IHtpOiByb290LCBwYXRoOiAnJ31cbiAgICB2YXIgaW5kZXgsIGNoclxuXG4gICAgZm9yIChpbmRleCA9IDA7IGluZGV4IDwga2V5cGF0aC5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIGNociA9IGtleXBhdGguY2hhckF0KGluZGV4KVxuXG4gICAgICBpZiAoISF+aW50ZXJmYWNlcy5pbmRleE9mKGNocikpIHtcbiAgICAgICAgdG9rZW5zLnB1c2goY3VycmVudClcbiAgICAgICAgY3VycmVudCA9IHtpOiBjaHIsIHBhdGg6ICcnfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY3VycmVudC5wYXRoICs9IGNoclxuICAgICAgfVxuICAgIH1cblxuICAgIHRva2Vucy5wdXNoKGN1cnJlbnQpXG4gICAgcmV0dXJuIHRva2Vuc1xuICB9XG5cbiAgLy8gUGFyc2VzIHRoZSBrZXlwYXRoIHVzaW5nIHRoZSBpbnRlcmZhY2VzIGRlZmluZWQgb24gdGhlIHZpZXcuIFNldHMgdmFyaWFibGVzXG4gIC8vIGZvciB0aGUgdG9rZW5pemVkIGtleXBhdGggYXMgd2VsbCBhcyB0aGUgZW5kIGtleS5cbiAgT2JzZXJ2ZXIucHJvdG90eXBlLnBhcnNlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGludGVyZmFjZXMgPSB0aGlzLmludGVyZmFjZXMoKVxuICAgIHZhciByb290LCBwYXRoXG5cbiAgICBpZiAoIWludGVyZmFjZXMubGVuZ3RoKSB7XG4gICAgICBlcnJvcignTXVzdCBkZWZpbmUgYXQgbGVhc3Qgb25lIGFkYXB0ZXIgaW50ZXJmYWNlLicpXG4gICAgfVxuXG4gICAgaWYgKCEhfmludGVyZmFjZXMuaW5kZXhPZih0aGlzLmtleXBhdGhbMF0pKSB7XG4gICAgICByb290ID0gdGhpcy5rZXlwYXRoWzBdXG4gICAgICBwYXRoID0gdGhpcy5rZXlwYXRoLnN1YnN0cigxKVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodHlwZW9mIChyb290ID0gdGhpcy5vcHRpb25zLnJvb3QgfHwgc2lnaHRnbGFzcy5yb290KSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgZXJyb3IoJ011c3QgZGVmaW5lIGEgZGVmYXVsdCByb290IGFkYXB0ZXIuJylcbiAgICAgIH1cblxuICAgICAgcGF0aCA9IHRoaXMua2V5cGF0aFxuICAgIH1cblxuICAgIHRoaXMudG9rZW5zID0gT2JzZXJ2ZXIudG9rZW5pemUocGF0aCwgaW50ZXJmYWNlcywgcm9vdClcbiAgICB0aGlzLmtleSA9IHRoaXMudG9rZW5zLnBvcCgpXG4gIH1cblxuICAvLyBSZWFsaXplcyB0aGUgZnVsbCBrZXlwYXRoLCBhdHRhY2hpbmcgb2JzZXJ2ZXJzIGZvciBldmVyeSBrZXkgYW5kIGNvcnJlY3RpbmdcbiAgLy8gb2xkIG9ic2VydmVycyB0byBhbnkgY2hhbmdlZCBvYmplY3RzIGluIHRoZSBrZXlwYXRoLlxuICBPYnNlcnZlci5wcm90b3R5cGUucmVhbGl6ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjdXJyZW50ID0gdGhpcy5vYmpcbiAgICB2YXIgdW5yZWFjaGVkID0gZmFsc2VcbiAgICB2YXIgcHJldlxuXG4gICAgdGhpcy50b2tlbnMuZm9yRWFjaChmdW5jdGlvbih0b2tlbiwgaW5kZXgpIHtcbiAgICAgIGlmIChpc09iamVjdChjdXJyZW50KSkge1xuICAgICAgICBpZiAodHlwZW9mIHRoaXMub2JqZWN0UGF0aFtpbmRleF0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgaWYgKGN1cnJlbnQgIT09IChwcmV2ID0gdGhpcy5vYmplY3RQYXRoW2luZGV4XSkpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0KGZhbHNlLCB0b2tlbiwgcHJldiwgdGhpcy51cGRhdGUpXG4gICAgICAgICAgICB0aGlzLnNldCh0cnVlLCB0b2tlbiwgY3VycmVudCwgdGhpcy51cGRhdGUpXG4gICAgICAgICAgICB0aGlzLm9iamVjdFBhdGhbaW5kZXhdID0gY3VycmVudFxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnNldCh0cnVlLCB0b2tlbiwgY3VycmVudCwgdGhpcy51cGRhdGUpXG4gICAgICAgICAgdGhpcy5vYmplY3RQYXRoW2luZGV4XSA9IGN1cnJlbnRcbiAgICAgICAgfVxuXG4gICAgICAgIGN1cnJlbnQgPSB0aGlzLmdldCh0b2tlbiwgY3VycmVudClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh1bnJlYWNoZWQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgdW5yZWFjaGVkID0gaW5kZXhcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwcmV2ID0gdGhpcy5vYmplY3RQYXRoW2luZGV4XSkge1xuICAgICAgICAgIHRoaXMuc2V0KGZhbHNlLCB0b2tlbiwgcHJldiwgdGhpcy51cGRhdGUpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCB0aGlzKVxuXG4gICAgaWYgKHVucmVhY2hlZCAhPT0gZmFsc2UpIHtcbiAgICAgIHRoaXMub2JqZWN0UGF0aC5zcGxpY2UodW5yZWFjaGVkKVxuICAgIH1cblxuICAgIHJldHVybiBjdXJyZW50XG4gIH1cblxuICAvLyBVcGRhdGVzIHRoZSBrZXlwYXRoLiBUaGlzIGlzIGNhbGxlZCB3aGVuIGFueSBpbnRlcm1lZGlhcnkga2V5IGlzIGNoYW5nZWQuXG4gIE9ic2VydmVyLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbmV4dCwgb2xkVmFsdWVcblxuICAgIGlmICgobmV4dCA9IHRoaXMucmVhbGl6ZSgpKSAhPT0gdGhpcy50YXJnZXQpIHtcbiAgICAgIGlmIChpc09iamVjdCh0aGlzLnRhcmdldCkpIHtcbiAgICAgICAgdGhpcy5zZXQoZmFsc2UsIHRoaXMua2V5LCB0aGlzLnRhcmdldCwgdGhpcy5jYWxsYmFjaylcbiAgICAgIH1cblxuICAgICAgaWYgKGlzT2JqZWN0KG5leHQpKSB7XG4gICAgICAgIHRoaXMuc2V0KHRydWUsIHRoaXMua2V5LCBuZXh0LCB0aGlzLmNhbGxiYWNrKVxuICAgICAgfVxuXG4gICAgICBvbGRWYWx1ZSA9IHRoaXMudmFsdWUoKVxuICAgICAgdGhpcy50YXJnZXQgPSBuZXh0XG5cbiAgICAgIC8vIEFsd2F5cyBjYWxsIGNhbGxiYWNrIGlmIHZhbHVlIGlzIGEgZnVuY3Rpb24uIElmIG5vdCBhIGZ1bmN0aW9uLCBjYWxsIGNhbGxiYWNrIG9ubHkgaWYgdmFsdWUgY2hhbmdlZFxuICAgICAgaWYgKHRoaXMudmFsdWUoKSBpbnN0YW5jZW9mIEZ1bmN0aW9uIHx8IHRoaXMudmFsdWUoKSAhPT0gb2xkVmFsdWUpIHRoaXMuY2FsbGJhY2soKVxuICAgIH1cbiAgfVxuXG4gIC8vIFJlYWRzIHRoZSBjdXJyZW50IGVuZCB2YWx1ZSBvZiB0aGUgb2JzZXJ2ZWQga2V5cGF0aC4gUmV0dXJucyB1bmRlZmluZWQgaWZcbiAgLy8gdGhlIGZ1bGwga2V5cGF0aCBpcyB1bnJlYWNoYWJsZS5cbiAgT2JzZXJ2ZXIucHJvdG90eXBlLnZhbHVlID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKGlzT2JqZWN0KHRoaXMudGFyZ2V0KSkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0KHRoaXMua2V5LCB0aGlzLnRhcmdldClcbiAgICB9XG4gIH1cblxuICAvLyBTZXRzIHRoZSBjdXJyZW50IGVuZCB2YWx1ZSBvZiB0aGUgb2JzZXJ2ZWQga2V5cGF0aC4gQ2FsbGluZyBzZXRWYWx1ZSB3aGVuXG4gIC8vIHRoZSBmdWxsIGtleXBhdGggaXMgdW5yZWFjaGFibGUgaXMgYSBuby1vcC5cbiAgT2JzZXJ2ZXIucHJvdG90eXBlLnNldFZhbHVlID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICBpZiAoaXNPYmplY3QodGhpcy50YXJnZXQpKSB7XG4gICAgICB0aGlzLmFkYXB0ZXIodGhpcy5rZXkpLnNldCh0aGlzLnRhcmdldCwgdGhpcy5rZXkucGF0aCwgdmFsdWUpXG4gICAgfVxuICB9XG5cbiAgLy8gR2V0cyB0aGUgcHJvdmlkZWQga2V5IG9uIGFuIG9iamVjdC5cbiAgT2JzZXJ2ZXIucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKGtleSwgb2JqKSB7XG4gICAgcmV0dXJuIHRoaXMuYWRhcHRlcihrZXkpLmdldChvYmosIGtleS5wYXRoKVxuICB9XG5cbiAgLy8gT2JzZXJ2ZXMgb3IgdW5vYnNlcnZlcyBhIGNhbGxiYWNrIG9uIHRoZSBvYmplY3QgdXNpbmcgdGhlIHByb3ZpZGVkIGtleS5cbiAgT2JzZXJ2ZXIucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKGFjdGl2ZSwga2V5LCBvYmosIGNhbGxiYWNrKSB7XG4gICAgdmFyIGFjdGlvbiA9IGFjdGl2ZSA/ICdvYnNlcnZlJyA6ICd1bm9ic2VydmUnXG4gICAgdGhpcy5hZGFwdGVyKGtleSlbYWN0aW9uXShvYmosIGtleS5wYXRoLCBjYWxsYmFjaylcbiAgfVxuXG4gIC8vIFJldHVybnMgYW4gYXJyYXkgb2YgYWxsIHVuaXF1ZSBhZGFwdGVyIGludGVyZmFjZXMgYXZhaWxhYmxlLlxuICBPYnNlcnZlci5wcm90b3R5cGUuaW50ZXJmYWNlcyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpbnRlcmZhY2VzID0gT2JqZWN0LmtleXModGhpcy5vcHRpb25zLmFkYXB0ZXJzKVxuXG4gICAgT2JqZWN0LmtleXMoc2lnaHRnbGFzcy5hZGFwdGVycykuZm9yRWFjaChmdW5jdGlvbihpKSB7XG4gICAgICBpZiAoIX5pbnRlcmZhY2VzLmluZGV4T2YoaSkpIHtcbiAgICAgICAgaW50ZXJmYWNlcy5wdXNoKGkpXG4gICAgICB9XG4gICAgfSlcblxuICAgIHJldHVybiBpbnRlcmZhY2VzXG4gIH1cblxuICAvLyBDb252ZW5pZW5jZSBmdW5jdGlvbiB0byBncmFiIHRoZSBhZGFwdGVyIGZvciBhIHNwZWNpZmljIGtleS5cbiAgT2JzZXJ2ZXIucHJvdG90eXBlLmFkYXB0ZXIgPSBmdW5jdGlvbihrZXkpIHtcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zLmFkYXB0ZXJzW2tleS5pXSB8fFxuICAgICAgc2lnaHRnbGFzcy5hZGFwdGVyc1trZXkuaV1cbiAgfVxuXG4gIC8vIFVub2JzZXJ2ZXMgdGhlIGVudGlyZSBrZXlwYXRoLlxuICBPYnNlcnZlci5wcm90b3R5cGUudW5vYnNlcnZlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIG9ialxuXG4gICAgdGhpcy50b2tlbnMuZm9yRWFjaChmdW5jdGlvbih0b2tlbiwgaW5kZXgpIHtcbiAgICAgIGlmIChvYmogPSB0aGlzLm9iamVjdFBhdGhbaW5kZXhdKSB7XG4gICAgICAgIHRoaXMuc2V0KGZhbHNlLCB0b2tlbiwgb2JqLCB0aGlzLnVwZGF0ZSlcbiAgICAgIH1cbiAgICB9LCB0aGlzKVxuXG4gICAgaWYgKGlzT2JqZWN0KHRoaXMudGFyZ2V0KSkge1xuICAgICAgdGhpcy5zZXQoZmFsc2UsIHRoaXMua2V5LCB0aGlzLnRhcmdldCwgdGhpcy5jYWxsYmFjaylcbiAgICB9XG4gIH1cblxuICAvLyBDaGVjayBpZiBhIHZhbHVlIGlzIGFuIG9iamVjdCB0aGFuIGNhbiBiZSBvYnNlcnZlZC5cbiAgZnVuY3Rpb24gaXNPYmplY3Qob2JqKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdvYmplY3QnICYmIG9iaiAhPT0gbnVsbFxuICB9XG5cbiAgLy8gRXJyb3IgdGhyb3dlci5cbiAgZnVuY3Rpb24gZXJyb3IobWVzc2FnZSkge1xuICAgIHRocm93IG5ldyBFcnJvcignW3NpZ2h0Z2xhc3NdICcgKyBtZXNzYWdlKVxuICB9XG5cbiAgLy8gRXhwb3J0IG1vZHVsZSBmb3IgTm9kZSBhbmQgdGhlIGJyb3dzZXIuXG4gIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gc2lnaHRnbGFzc1xuICB9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShbXSwgZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5zaWdodGdsYXNzID0gc2lnaHRnbGFzc1xuICAgIH0pXG4gIH0gZWxzZSB7XG4gICAgdGhpcy5zaWdodGdsYXNzID0gc2lnaHRnbGFzc1xuICB9XG59KS5jYWxsKHRoaXMpO1xuIiwiJ3VzZSBzdHJpY3QnO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoc3RyKSB7XG5cdHJldHVybiBlbmNvZGVVUklDb21wb25lbnQoc3RyKS5yZXBsYWNlKC9bIScoKSpdL2csIGZ1bmN0aW9uIChjKSB7XG5cdFx0cmV0dXJuICclJyArIGMuY2hhckNvZGVBdCgwKS50b1N0cmluZygxNikudG9VcHBlckNhc2UoKTtcblx0fSk7XG59O1xuIl19
