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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy5udm0vdmVyc2lvbnMvbm9kZS92NS4wLjAvbGliL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjbGllbnQuanMiLCJub2RlX21vZHVsZXMvZG9tcmVhZHkvcmVhZHkuanMiLCJub2RlX21vZHVsZXMvb2JqZWN0LWFzc2lnbi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9xdWVyeS1zdHJpbmcvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcml2ZXRzL2Rpc3Qvcml2ZXRzLmpzIiwibm9kZV9tb2R1bGVzL3NpZ2h0Z2xhc3MvaW5kZXguanMiLCJub2RlX21vZHVsZXMvc3RyaWN0LXVyaS1lbmNvZGUvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzkzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0TkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgcml2ZXRzID0gcmVxdWlyZSgncml2ZXRzJyksXG4gICAgcXVlcnlTdHJpbmcgPSByZXF1aXJlKCdxdWVyeS1zdHJpbmcnKSxcbiAgICBkb21SZWFkeSA9IHJlcXVpcmUoJ2RvbXJlYWR5JyksXG4gICAgdmlldyA9IHtcbiAgICAgICAgcGx1Z2lucyA6IHdpbmRvdy5wbHVnaW5zLFxuICAgICAgICBhY3RpdmVUYWIgOiAnZ2VuZXJhbCcsXG5cbiAgICAgICAgdGFicyA6IHtcbiAgICAgICAgICAgIGdlbmVyYWwgOiAnZ2VuZXJhbCcsXG4gICAgICAgICAgICBwbHVnaW5zIDogJ3BsdWdpbnMnXG4gICAgICAgIH0sXG5cbiAgICAgICAgaGFuZGxlUGx1Z2luQ2hlY2sgOiBoYW5kbGVQbHVnaW5DaGVjayxcbiAgICAgICAgaGFuZGxlVGFiQ2xpY2tlZCA6IGhhbmRsZVRhYkNsaWNrZWRcbiAgICB9O1xuXG5mdW5jdGlvbiBpbml0KCkge1xuICAgIHZpZXcuYWN0aXZlVGFiID0gcXVlcnlTdHJpbmcucGFyc2Uod2luZG93LmxvY2F0aW9uLmhhc2gpLnRhYjtcblxuICAgIGJpbmRWaWV3KCk7XG59XG5cbmZ1bmN0aW9uIGJpbmRWaWV3KCkge1xuICAgIHJpdmV0cy5mb3JtYXR0ZXJzLmVxdWFscyA9IGZ1bmN0aW9uKGNvbXBhcmF0b3IsIGNvbXBhcmF0ZWUpIHtcbiAgICAgICAgcmV0dXJuIGNvbXBhcmF0b3IgPT09IGNvbXBhcmF0ZWU7XG4gICAgfTtcblxuICAgIHJpdmV0cy5iaW5kKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzZXR0aW5ncycpLCB7IHZpZXcgOiB2aWV3IH0pO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVUYWJDbGlja2VkKGV2ZW50KSB7XG4gICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSBxdWVyeVN0cmluZy5zdHJpbmdpZnkoeyB0YWIgOiBldmVudC5jdXJyZW50VGFyZ2V0LmdldEF0dHJpYnV0ZSgndGFiLW5hbWUnKSB9KTtcbiAgICB2aWV3LmFjdGl2ZVRhYiA9IGV2ZW50LmN1cnJlbnRUYXJnZXQuZ2V0QXR0cmlidXRlKCd0YWItbmFtZScpO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVQbHVnaW5DaGVjaygpIHtcbiAgICB3aW5kb3cuZ2guYXBwU3RhdGVcbiAgICAgICAgLnRyYW5zZm9ybSgnY29uZmlncy5tZW51SXRlbXMnKVxuICAgICAgICAud2l0aChmdW5jdGlvbihtZW51SXRlbXMsIGl0ZW0pIHtcbiAgICAgICAgICAgIG1lbnVJdGVtcy5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgcmV0dXJuIG1lbnVJdGVtcztcbiAgICAgICAgfSlcbiAgICAgICAgLnVzaW5nKHtcbiAgICAgICAgICAgICdzaG93V2hlblVzZXJSb2xlSW5jbHVkZXMnIDogJ2FkbWluJyxcbiAgICAgICAgICAgICduYW1lJyA6ICdEYXdnJyxcbiAgICAgICAgICAgICdocmVmJyA6ICcvYWRtaW4vY29udGVudC10eXBlcycsXG4gICAgICAgICAgICAnaWNvbkNsYXNzZXMnIDogJ2ZhIGZhLXJlZnJlc2ggZmEtc3BpbidcbiAgICAgICAgfSk7XG59XG5cbmRvbVJlYWR5KGluaXQpO1xuIiwiLyohXG4gICogZG9tcmVhZHkgKGMpIER1c3RpbiBEaWF6IDIwMTQgLSBMaWNlbnNlIE1JVFxuICAqL1xuIWZ1bmN0aW9uIChuYW1lLCBkZWZpbml0aW9uKSB7XG5cbiAgaWYgKHR5cGVvZiBtb2R1bGUgIT0gJ3VuZGVmaW5lZCcpIG1vZHVsZS5leHBvcnRzID0gZGVmaW5pdGlvbigpXG4gIGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgZGVmaW5lLmFtZCA9PSAnb2JqZWN0JykgZGVmaW5lKGRlZmluaXRpb24pXG4gIGVsc2UgdGhpc1tuYW1lXSA9IGRlZmluaXRpb24oKVxuXG59KCdkb21yZWFkeScsIGZ1bmN0aW9uICgpIHtcblxuICB2YXIgZm5zID0gW10sIGxpc3RlbmVyXG4gICAgLCBkb2MgPSBkb2N1bWVudFxuICAgICwgaGFjayA9IGRvYy5kb2N1bWVudEVsZW1lbnQuZG9TY3JvbGxcbiAgICAsIGRvbUNvbnRlbnRMb2FkZWQgPSAnRE9NQ29udGVudExvYWRlZCdcbiAgICAsIGxvYWRlZCA9IChoYWNrID8gL15sb2FkZWR8XmMvIDogL15sb2FkZWR8Xml8XmMvKS50ZXN0KGRvYy5yZWFkeVN0YXRlKVxuXG5cbiAgaWYgKCFsb2FkZWQpXG4gIGRvYy5hZGRFdmVudExpc3RlbmVyKGRvbUNvbnRlbnRMb2FkZWQsIGxpc3RlbmVyID0gZnVuY3Rpb24gKCkge1xuICAgIGRvYy5yZW1vdmVFdmVudExpc3RlbmVyKGRvbUNvbnRlbnRMb2FkZWQsIGxpc3RlbmVyKVxuICAgIGxvYWRlZCA9IDFcbiAgICB3aGlsZSAobGlzdGVuZXIgPSBmbnMuc2hpZnQoKSkgbGlzdGVuZXIoKVxuICB9KVxuXG4gIHJldHVybiBmdW5jdGlvbiAoZm4pIHtcbiAgICBsb2FkZWQgPyBzZXRUaW1lb3V0KGZuLCAwKSA6IGZucy5wdXNoKGZuKVxuICB9XG5cbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgcHJvcElzRW51bWVyYWJsZSA9IE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGU7XG5cbmZ1bmN0aW9uIHRvT2JqZWN0KHZhbCkge1xuXHRpZiAodmFsID09PSBudWxsIHx8IHZhbCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0LmFzc2lnbiBjYW5ub3QgYmUgY2FsbGVkIHdpdGggbnVsbCBvciB1bmRlZmluZWQnKTtcblx0fVxuXG5cdHJldHVybiBPYmplY3QodmFsKTtcbn1cblxuZnVuY3Rpb24gc2hvdWxkVXNlTmF0aXZlKCkge1xuXHR0cnkge1xuXHRcdGlmICghT2JqZWN0LmFzc2lnbikge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIERldGVjdCBidWdneSBwcm9wZXJ0eSBlbnVtZXJhdGlvbiBvcmRlciBpbiBvbGRlciBWOCB2ZXJzaW9ucy5cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTQxMThcblx0XHR2YXIgdGVzdDEgPSBuZXcgU3RyaW5nKCdhYmMnKTsgIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcblx0XHR0ZXN0MVs1XSA9ICdkZSc7XG5cdFx0aWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QxKVswXSA9PT0gJzUnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MiA9IHt9O1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgMTA7IGkrKykge1xuXHRcdFx0dGVzdDJbJ18nICsgU3RyaW5nLmZyb21DaGFyQ29kZShpKV0gPSBpO1xuXHRcdH1cblx0XHR2YXIgb3JkZXIyID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDIpLm1hcChmdW5jdGlvbiAobikge1xuXHRcdFx0cmV0dXJuIHRlc3QyW25dO1xuXHRcdH0pO1xuXHRcdGlmIChvcmRlcjIuam9pbignJykgIT09ICcwMTIzNDU2Nzg5Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMwNTZcblx0XHR2YXIgdGVzdDMgPSB7fTtcblx0XHQnYWJjZGVmZ2hpamtsbW5vcHFyc3QnLnNwbGl0KCcnKS5mb3JFYWNoKGZ1bmN0aW9uIChsZXR0ZXIpIHtcblx0XHRcdHRlc3QzW2xldHRlcl0gPSBsZXR0ZXI7XG5cdFx0fSk7XG5cdFx0aWYgKE9iamVjdC5rZXlzKE9iamVjdC5hc3NpZ24oe30sIHRlc3QzKSkuam9pbignJykgIT09XG5cdFx0XHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdC8vIFdlIGRvbid0IGV4cGVjdCBhbnkgb2YgdGhlIGFib3ZlIHRvIHRocm93LCBidXQgYmV0dGVyIHRvIGJlIHNhZmUuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2hvdWxkVXNlTmF0aXZlKCkgPyBPYmplY3QuYXNzaWduIDogZnVuY3Rpb24gKHRhcmdldCwgc291cmNlKSB7XG5cdHZhciBmcm9tO1xuXHR2YXIgdG8gPSB0b09iamVjdCh0YXJnZXQpO1xuXHR2YXIgc3ltYm9scztcblxuXHRmb3IgKHZhciBzID0gMTsgcyA8IGFyZ3VtZW50cy5sZW5ndGg7IHMrKykge1xuXHRcdGZyb20gPSBPYmplY3QoYXJndW1lbnRzW3NdKTtcblxuXHRcdGZvciAodmFyIGtleSBpbiBmcm9tKSB7XG5cdFx0XHRpZiAoaGFzT3duUHJvcGVydHkuY2FsbChmcm9tLCBrZXkpKSB7XG5cdFx0XHRcdHRvW2tleV0gPSBmcm9tW2tleV07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcblx0XHRcdHN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKGZyb20pO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzeW1ib2xzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGlmIChwcm9wSXNFbnVtZXJhYmxlLmNhbGwoZnJvbSwgc3ltYm9sc1tpXSkpIHtcblx0XHRcdFx0XHR0b1tzeW1ib2xzW2ldXSA9IGZyb21bc3ltYm9sc1tpXV07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gdG87XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIHN0cmljdFVyaUVuY29kZSA9IHJlcXVpcmUoJ3N0cmljdC11cmktZW5jb2RlJyk7XG52YXIgb2JqZWN0QXNzaWduID0gcmVxdWlyZSgnb2JqZWN0LWFzc2lnbicpO1xuXG5mdW5jdGlvbiBlbmNvZGUodmFsdWUsIG9wdHMpIHtcblx0aWYgKG9wdHMuZW5jb2RlKSB7XG5cdFx0cmV0dXJuIG9wdHMuc3RyaWN0ID8gc3RyaWN0VXJpRW5jb2RlKHZhbHVlKSA6IGVuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSk7XG5cdH1cblxuXHRyZXR1cm4gdmFsdWU7XG59XG5cbmV4cG9ydHMuZXh0cmFjdCA9IGZ1bmN0aW9uIChzdHIpIHtcblx0cmV0dXJuIHN0ci5zcGxpdCgnPycpWzFdIHx8ICcnO1xufTtcblxuZXhwb3J0cy5wYXJzZSA9IGZ1bmN0aW9uIChzdHIpIHtcblx0Ly8gQ3JlYXRlIGFuIG9iamVjdCB3aXRoIG5vIHByb3RvdHlwZVxuXHQvLyBodHRwczovL2dpdGh1Yi5jb20vc2luZHJlc29yaHVzL3F1ZXJ5LXN0cmluZy9pc3N1ZXMvNDdcblx0dmFyIHJldCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cblx0aWYgKHR5cGVvZiBzdHIgIT09ICdzdHJpbmcnKSB7XG5cdFx0cmV0dXJuIHJldDtcblx0fVxuXG5cdHN0ciA9IHN0ci50cmltKCkucmVwbGFjZSgvXihcXD98I3wmKS8sICcnKTtcblxuXHRpZiAoIXN0cikge1xuXHRcdHJldHVybiByZXQ7XG5cdH1cblxuXHRzdHIuc3BsaXQoJyYnKS5mb3JFYWNoKGZ1bmN0aW9uIChwYXJhbSkge1xuXHRcdHZhciBwYXJ0cyA9IHBhcmFtLnJlcGxhY2UoL1xcKy9nLCAnICcpLnNwbGl0KCc9Jyk7XG5cdFx0Ly8gRmlyZWZveCAocHJlIDQwKSBkZWNvZGVzIGAlM0RgIHRvIGA9YFxuXHRcdC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9zaW5kcmVzb3JodXMvcXVlcnktc3RyaW5nL3B1bGwvMzdcblx0XHR2YXIga2V5ID0gcGFydHMuc2hpZnQoKTtcblx0XHR2YXIgdmFsID0gcGFydHMubGVuZ3RoID4gMCA/IHBhcnRzLmpvaW4oJz0nKSA6IHVuZGVmaW5lZDtcblxuXHRcdGtleSA9IGRlY29kZVVSSUNvbXBvbmVudChrZXkpO1xuXG5cdFx0Ly8gbWlzc2luZyBgPWAgc2hvdWxkIGJlIGBudWxsYDpcblx0XHQvLyBodHRwOi8vdzMub3JnL1RSLzIwMTIvV0QtdXJsLTIwMTIwNTI0LyNjb2xsZWN0LXVybC1wYXJhbWV0ZXJzXG5cdFx0dmFsID0gdmFsID09PSB1bmRlZmluZWQgPyBudWxsIDogZGVjb2RlVVJJQ29tcG9uZW50KHZhbCk7XG5cblx0XHRpZiAocmV0W2tleV0gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cmV0W2tleV0gPSB2YWw7XG5cdFx0fSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHJldFtrZXldKSkge1xuXHRcdFx0cmV0W2tleV0ucHVzaCh2YWwpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXRba2V5XSA9IFtyZXRba2V5XSwgdmFsXTtcblx0XHR9XG5cdH0pO1xuXG5cdHJldHVybiByZXQ7XG59O1xuXG5leHBvcnRzLnN0cmluZ2lmeSA9IGZ1bmN0aW9uIChvYmosIG9wdHMpIHtcblx0dmFyIGRlZmF1bHRzID0ge1xuXHRcdGVuY29kZTogdHJ1ZSxcblx0XHRzdHJpY3Q6IHRydWVcblx0fTtcblxuXHRvcHRzID0gb2JqZWN0QXNzaWduKGRlZmF1bHRzLCBvcHRzKTtcblxuXHRyZXR1cm4gb2JqID8gT2JqZWN0LmtleXMob2JqKS5zb3J0KCkubWFwKGZ1bmN0aW9uIChrZXkpIHtcblx0XHR2YXIgdmFsID0gb2JqW2tleV07XG5cblx0XHRpZiAodmFsID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHJldHVybiAnJztcblx0XHR9XG5cblx0XHRpZiAodmFsID09PSBudWxsKSB7XG5cdFx0XHRyZXR1cm4gZW5jb2RlKGtleSwgb3B0cyk7XG5cdFx0fVxuXG5cdFx0aWYgKEFycmF5LmlzQXJyYXkodmFsKSkge1xuXHRcdFx0dmFyIHJlc3VsdCA9IFtdO1xuXG5cdFx0XHR2YWwuc2xpY2UoKS5mb3JFYWNoKGZ1bmN0aW9uICh2YWwyKSB7XG5cdFx0XHRcdGlmICh2YWwyID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAodmFsMiA9PT0gbnVsbCkge1xuXHRcdFx0XHRcdHJlc3VsdC5wdXNoKGVuY29kZShrZXksIG9wdHMpKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRyZXN1bHQucHVzaChlbmNvZGUoa2V5LCBvcHRzKSArICc9JyArIGVuY29kZSh2YWwyLCBvcHRzKSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHRyZXR1cm4gcmVzdWx0LmpvaW4oJyYnKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZW5jb2RlKGtleSwgb3B0cykgKyAnPScgKyBlbmNvZGUodmFsLCBvcHRzKTtcblx0fSkuZmlsdGVyKGZ1bmN0aW9uICh4KSB7XG5cdFx0cmV0dXJuIHgubGVuZ3RoID4gMDtcblx0fSkuam9pbignJicpIDogJyc7XG59O1xuIiwiLy8gUml2ZXRzLmpzXG4vLyB2ZXJzaW9uOiAwLjkuM1xuLy8gYXV0aG9yOiBNaWNoYWVsIFJpY2hhcmRzXG4vLyBsaWNlbnNlOiBNSVRcbihmdW5jdGlvbigpIHtcbiAgdmFyIFJpdmV0cywgYmluZE1ldGhvZCwgdW5iaW5kTWV0aG9kLCBfcmVmLFxuICAgIF9fYmluZCA9IGZ1bmN0aW9uKGZuLCBtZSl7IHJldHVybiBmdW5jdGlvbigpeyByZXR1cm4gZm4uYXBwbHkobWUsIGFyZ3VtZW50cyk7IH07IH0sXG4gICAgX19zbGljZSA9IFtdLnNsaWNlLFxuICAgIF9faGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5LFxuICAgIF9fZXh0ZW5kcyA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoX19oYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9LFxuICAgIF9faW5kZXhPZiA9IFtdLmluZGV4T2YgfHwgZnVuY3Rpb24oaXRlbSkgeyBmb3IgKHZhciBpID0gMCwgbCA9IHRoaXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7IGlmIChpIGluIHRoaXMgJiYgdGhpc1tpXSA9PT0gaXRlbSkgcmV0dXJuIGk7IH0gcmV0dXJuIC0xOyB9O1xuXG4gIFJpdmV0cyA9IHtcbiAgICBvcHRpb25zOiBbJ3ByZWZpeCcsICd0ZW1wbGF0ZURlbGltaXRlcnMnLCAncm9vdEludGVyZmFjZScsICdwcmVsb2FkRGF0YScsICdoYW5kbGVyJywgJ2V4ZWN1dGVGdW5jdGlvbnMnXSxcbiAgICBleHRlbnNpb25zOiBbJ2JpbmRlcnMnLCAnZm9ybWF0dGVycycsICdjb21wb25lbnRzJywgJ2FkYXB0ZXJzJ10sXG4gICAgXCJwdWJsaWNcIjoge1xuICAgICAgYmluZGVyczoge30sXG4gICAgICBjb21wb25lbnRzOiB7fSxcbiAgICAgIGZvcm1hdHRlcnM6IHt9LFxuICAgICAgYWRhcHRlcnM6IHt9LFxuICAgICAgcHJlZml4OiAncnYnLFxuICAgICAgdGVtcGxhdGVEZWxpbWl0ZXJzOiBbJ3snLCAnfSddLFxuICAgICAgcm9vdEludGVyZmFjZTogJy4nLFxuICAgICAgcHJlbG9hZERhdGE6IHRydWUsXG4gICAgICBleGVjdXRlRnVuY3Rpb25zOiBmYWxzZSxcbiAgICAgIGl0ZXJhdGlvbkFsaWFzOiBmdW5jdGlvbihtb2RlbE5hbWUpIHtcbiAgICAgICAgcmV0dXJuICclJyArIG1vZGVsTmFtZSArICclJztcbiAgICAgIH0sXG4gICAgICBoYW5kbGVyOiBmdW5jdGlvbihjb250ZXh0LCBldiwgYmluZGluZykge1xuICAgICAgICByZXR1cm4gdGhpcy5jYWxsKGNvbnRleHQsIGV2LCBiaW5kaW5nLnZpZXcubW9kZWxzKTtcbiAgICAgIH0sXG4gICAgICBjb25maWd1cmU6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIGRlc2NyaXB0b3IsIGtleSwgb3B0aW9uLCB2YWx1ZTtcbiAgICAgICAgaWYgKG9wdGlvbnMgPT0gbnVsbCkge1xuICAgICAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKG9wdGlvbiBpbiBvcHRpb25zKSB7XG4gICAgICAgICAgdmFsdWUgPSBvcHRpb25zW29wdGlvbl07XG4gICAgICAgICAgaWYgKG9wdGlvbiA9PT0gJ2JpbmRlcnMnIHx8IG9wdGlvbiA9PT0gJ2NvbXBvbmVudHMnIHx8IG9wdGlvbiA9PT0gJ2Zvcm1hdHRlcnMnIHx8IG9wdGlvbiA9PT0gJ2FkYXB0ZXJzJykge1xuICAgICAgICAgICAgZm9yIChrZXkgaW4gdmFsdWUpIHtcbiAgICAgICAgICAgICAgZGVzY3JpcHRvciA9IHZhbHVlW2tleV07XG4gICAgICAgICAgICAgIFJpdmV0c1tvcHRpb25dW2tleV0gPSBkZXNjcmlwdG9yO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBSaXZldHNbXCJwdWJsaWNcIl1bb3B0aW9uXSA9IHZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGJpbmQ6IGZ1bmN0aW9uKGVsLCBtb2RlbHMsIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIHZpZXc7XG4gICAgICAgIGlmIChtb2RlbHMgPT0gbnVsbCkge1xuICAgICAgICAgIG1vZGVscyA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zID09IG51bGwpIHtcbiAgICAgICAgICBvcHRpb25zID0ge307XG4gICAgICAgIH1cbiAgICAgICAgdmlldyA9IG5ldyBSaXZldHMuVmlldyhlbCwgbW9kZWxzLCBvcHRpb25zKTtcbiAgICAgICAgdmlldy5iaW5kKCk7XG4gICAgICAgIHJldHVybiB2aWV3O1xuICAgICAgfSxcbiAgICAgIGluaXQ6IGZ1bmN0aW9uKGNvbXBvbmVudCwgZWwsIGRhdGEpIHtcbiAgICAgICAgdmFyIHNjb3BlLCB0ZW1wbGF0ZSwgdmlldztcbiAgICAgICAgaWYgKGRhdGEgPT0gbnVsbCkge1xuICAgICAgICAgIGRhdGEgPSB7fTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZWwgPT0gbnVsbCkge1xuICAgICAgICAgIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIH1cbiAgICAgICAgY29tcG9uZW50ID0gUml2ZXRzW1wicHVibGljXCJdLmNvbXBvbmVudHNbY29tcG9uZW50XTtcbiAgICAgICAgdGVtcGxhdGUgPSBjb21wb25lbnQudGVtcGxhdGUuY2FsbCh0aGlzLCBlbCk7XG4gICAgICAgIGlmICh0ZW1wbGF0ZSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICAgICAgd2hpbGUgKGVsLmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgICAgIGVsLnJlbW92ZUNoaWxkKGVsLmZpcnN0Q2hpbGQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbC5hcHBlbmRDaGlsZCh0ZW1wbGF0ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZWwuaW5uZXJIVE1MID0gdGVtcGxhdGU7XG4gICAgICAgIH1cbiAgICAgICAgc2NvcGUgPSBjb21wb25lbnQuaW5pdGlhbGl6ZS5jYWxsKHRoaXMsIGVsLCBkYXRhKTtcbiAgICAgICAgdmlldyA9IG5ldyBSaXZldHMuVmlldyhlbCwgc2NvcGUpO1xuICAgICAgICB2aWV3LmJpbmQoKTtcbiAgICAgICAgcmV0dXJuIHZpZXc7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIGlmICh3aW5kb3dbJ2pRdWVyeSddIHx8IHdpbmRvd1snJCddKSB7XG4gICAgX3JlZiA9ICdvbicgaW4galF1ZXJ5LnByb3RvdHlwZSA/IFsnb24nLCAnb2ZmJ10gOiBbJ2JpbmQnLCAndW5iaW5kJ10sIGJpbmRNZXRob2QgPSBfcmVmWzBdLCB1bmJpbmRNZXRob2QgPSBfcmVmWzFdO1xuICAgIFJpdmV0cy5VdGlsID0ge1xuICAgICAgYmluZEV2ZW50OiBmdW5jdGlvbihlbCwgZXZlbnQsIGhhbmRsZXIpIHtcbiAgICAgICAgcmV0dXJuIGpRdWVyeShlbClbYmluZE1ldGhvZF0oZXZlbnQsIGhhbmRsZXIpO1xuICAgICAgfSxcbiAgICAgIHVuYmluZEV2ZW50OiBmdW5jdGlvbihlbCwgZXZlbnQsIGhhbmRsZXIpIHtcbiAgICAgICAgcmV0dXJuIGpRdWVyeShlbClbdW5iaW5kTWV0aG9kXShldmVudCwgaGFuZGxlcik7XG4gICAgICB9LFxuICAgICAgZ2V0SW5wdXRWYWx1ZTogZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgdmFyICRlbDtcbiAgICAgICAgJGVsID0galF1ZXJ5KGVsKTtcbiAgICAgICAgaWYgKCRlbC5hdHRyKCd0eXBlJykgPT09ICdjaGVja2JveCcpIHtcbiAgICAgICAgICByZXR1cm4gJGVsLmlzKCc6Y2hlY2tlZCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiAkZWwudmFsKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIFJpdmV0cy5VdGlsID0ge1xuICAgICAgYmluZEV2ZW50OiAoZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICgnYWRkRXZlbnRMaXN0ZW5lcicgaW4gd2luZG93KSB7XG4gICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGVsLCBldmVudCwgaGFuZGxlcikge1xuICAgICAgICAgICAgcmV0dXJuIGVsLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGhhbmRsZXIsIGZhbHNlKTtcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihlbCwgZXZlbnQsIGhhbmRsZXIpIHtcbiAgICAgICAgICByZXR1cm4gZWwuYXR0YWNoRXZlbnQoJ29uJyArIGV2ZW50LCBoYW5kbGVyKTtcbiAgICAgICAgfTtcbiAgICAgIH0pKCksXG4gICAgICB1bmJpbmRFdmVudDogKGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoJ3JlbW92ZUV2ZW50TGlzdGVuZXInIGluIHdpbmRvdykge1xuICAgICAgICAgIHJldHVybiBmdW5jdGlvbihlbCwgZXZlbnQsIGhhbmRsZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBlbC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBoYW5kbGVyLCBmYWxzZSk7XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oZWwsIGV2ZW50LCBoYW5kbGVyKSB7XG4gICAgICAgICAgcmV0dXJuIGVsLmRldGFjaEV2ZW50KCdvbicgKyBldmVudCwgaGFuZGxlcik7XG4gICAgICAgIH07XG4gICAgICB9KSgpLFxuICAgICAgZ2V0SW5wdXRWYWx1ZTogZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgdmFyIG8sIF9pLCBfbGVuLCBfcmVzdWx0cztcbiAgICAgICAgaWYgKGVsLnR5cGUgPT09ICdjaGVja2JveCcpIHtcbiAgICAgICAgICByZXR1cm4gZWwuY2hlY2tlZDtcbiAgICAgICAgfSBlbHNlIGlmIChlbC50eXBlID09PSAnc2VsZWN0LW11bHRpcGxlJykge1xuICAgICAgICAgIF9yZXN1bHRzID0gW107XG4gICAgICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBlbC5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICAgICAgbyA9IGVsW19pXTtcbiAgICAgICAgICAgIGlmIChvLnNlbGVjdGVkKSB7XG4gICAgICAgICAgICAgIF9yZXN1bHRzLnB1c2goby52YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBfcmVzdWx0cztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZWwudmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgUml2ZXRzLlR5cGVQYXJzZXIgPSAoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gVHlwZVBhcnNlcigpIHt9XG5cbiAgICBUeXBlUGFyc2VyLnR5cGVzID0ge1xuICAgICAgcHJpbWl0aXZlOiAwLFxuICAgICAga2V5cGF0aDogMVxuICAgIH07XG5cbiAgICBUeXBlUGFyc2VyLnBhcnNlID0gZnVuY3Rpb24oc3RyaW5nKSB7XG4gICAgICBpZiAoL14nLionJHxeXCIuKlwiJC8udGVzdChzdHJpbmcpKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdHlwZTogdGhpcy50eXBlcy5wcmltaXRpdmUsXG4gICAgICAgICAgdmFsdWU6IHN0cmluZy5zbGljZSgxLCAtMSlcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSBpZiAoc3RyaW5nID09PSAndHJ1ZScpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB0eXBlOiB0aGlzLnR5cGVzLnByaW1pdGl2ZSxcbiAgICAgICAgICB2YWx1ZTogdHJ1ZVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIGlmIChzdHJpbmcgPT09ICdmYWxzZScpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB0eXBlOiB0aGlzLnR5cGVzLnByaW1pdGl2ZSxcbiAgICAgICAgICB2YWx1ZTogZmFsc2VcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSBpZiAoc3RyaW5nID09PSAnbnVsbCcpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB0eXBlOiB0aGlzLnR5cGVzLnByaW1pdGl2ZSxcbiAgICAgICAgICB2YWx1ZTogbnVsbFxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIGlmIChzdHJpbmcgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdHlwZTogdGhpcy50eXBlcy5wcmltaXRpdmUsXG4gICAgICAgICAgdmFsdWU6IHZvaWQgMFxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIGlmIChzdHJpbmcgPT09ICcnKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdHlwZTogdGhpcy50eXBlcy5wcmltaXRpdmUsXG4gICAgICAgICAgdmFsdWU6IHZvaWQgMFxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIGlmIChpc05hTihOdW1iZXIoc3RyaW5nKSkgPT09IGZhbHNlKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdHlwZTogdGhpcy50eXBlcy5wcmltaXRpdmUsXG4gICAgICAgICAgdmFsdWU6IE51bWJlcihzdHJpbmcpXG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHR5cGU6IHRoaXMudHlwZXMua2V5cGF0aCxcbiAgICAgICAgICB2YWx1ZTogc3RyaW5nXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiBUeXBlUGFyc2VyO1xuXG4gIH0pKCk7XG5cbiAgUml2ZXRzLlRleHRUZW1wbGF0ZVBhcnNlciA9IChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBUZXh0VGVtcGxhdGVQYXJzZXIoKSB7fVxuXG4gICAgVGV4dFRlbXBsYXRlUGFyc2VyLnR5cGVzID0ge1xuICAgICAgdGV4dDogMCxcbiAgICAgIGJpbmRpbmc6IDFcbiAgICB9O1xuXG4gICAgVGV4dFRlbXBsYXRlUGFyc2VyLnBhcnNlID0gZnVuY3Rpb24odGVtcGxhdGUsIGRlbGltaXRlcnMpIHtcbiAgICAgIHZhciBpbmRleCwgbGFzdEluZGV4LCBsYXN0VG9rZW4sIGxlbmd0aCwgc3Vic3RyaW5nLCB0b2tlbnMsIHZhbHVlO1xuICAgICAgdG9rZW5zID0gW107XG4gICAgICBsZW5ndGggPSB0ZW1wbGF0ZS5sZW5ndGg7XG4gICAgICBpbmRleCA9IDA7XG4gICAgICBsYXN0SW5kZXggPSAwO1xuICAgICAgd2hpbGUgKGxhc3RJbmRleCA8IGxlbmd0aCkge1xuICAgICAgICBpbmRleCA9IHRlbXBsYXRlLmluZGV4T2YoZGVsaW1pdGVyc1swXSwgbGFzdEluZGV4KTtcbiAgICAgICAgaWYgKGluZGV4IDwgMCkge1xuICAgICAgICAgIHRva2Vucy5wdXNoKHtcbiAgICAgICAgICAgIHR5cGU6IHRoaXMudHlwZXMudGV4dCxcbiAgICAgICAgICAgIHZhbHVlOiB0ZW1wbGF0ZS5zbGljZShsYXN0SW5kZXgpXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGluZGV4ID4gMCAmJiBsYXN0SW5kZXggPCBpbmRleCkge1xuICAgICAgICAgICAgdG9rZW5zLnB1c2goe1xuICAgICAgICAgICAgICB0eXBlOiB0aGlzLnR5cGVzLnRleHQsXG4gICAgICAgICAgICAgIHZhbHVlOiB0ZW1wbGF0ZS5zbGljZShsYXN0SW5kZXgsIGluZGV4KVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGxhc3RJbmRleCA9IGluZGV4ICsgZGVsaW1pdGVyc1swXS5sZW5ndGg7XG4gICAgICAgICAgaW5kZXggPSB0ZW1wbGF0ZS5pbmRleE9mKGRlbGltaXRlcnNbMV0sIGxhc3RJbmRleCk7XG4gICAgICAgICAgaWYgKGluZGV4IDwgMCkge1xuICAgICAgICAgICAgc3Vic3RyaW5nID0gdGVtcGxhdGUuc2xpY2UobGFzdEluZGV4IC0gZGVsaW1pdGVyc1sxXS5sZW5ndGgpO1xuICAgICAgICAgICAgbGFzdFRva2VuID0gdG9rZW5zW3Rva2Vucy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgIGlmICgobGFzdFRva2VuICE9IG51bGwgPyBsYXN0VG9rZW4udHlwZSA6IHZvaWQgMCkgPT09IHRoaXMudHlwZXMudGV4dCkge1xuICAgICAgICAgICAgICBsYXN0VG9rZW4udmFsdWUgKz0gc3Vic3RyaW5nO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdG9rZW5zLnB1c2goe1xuICAgICAgICAgICAgICAgIHR5cGU6IHRoaXMudHlwZXMudGV4dCxcbiAgICAgICAgICAgICAgICB2YWx1ZTogc3Vic3RyaW5nXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhbHVlID0gdGVtcGxhdGUuc2xpY2UobGFzdEluZGV4LCBpbmRleCkudHJpbSgpO1xuICAgICAgICAgIHRva2Vucy5wdXNoKHtcbiAgICAgICAgICAgIHR5cGU6IHRoaXMudHlwZXMuYmluZGluZyxcbiAgICAgICAgICAgIHZhbHVlOiB2YWx1ZVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGxhc3RJbmRleCA9IGluZGV4ICsgZGVsaW1pdGVyc1sxXS5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0b2tlbnM7XG4gICAgfTtcblxuICAgIHJldHVybiBUZXh0VGVtcGxhdGVQYXJzZXI7XG5cbiAgfSkoKTtcblxuICBSaXZldHMuVmlldyA9IChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBWaWV3KGVscywgbW9kZWxzLCBvcHRpb25zKSB7XG4gICAgICB2YXIgaywgb3B0aW9uLCB2LCBfYmFzZSwgX2ksIF9qLCBfbGVuLCBfbGVuMSwgX3JlZjEsIF9yZWYyLCBfcmVmMywgX3JlZjQsIF9yZWY1O1xuICAgICAgdGhpcy5lbHMgPSBlbHM7XG4gICAgICB0aGlzLm1vZGVscyA9IG1vZGVscztcbiAgICAgIGlmIChvcHRpb25zID09IG51bGwpIHtcbiAgICAgICAgb3B0aW9ucyA9IHt9O1xuICAgICAgfVxuICAgICAgdGhpcy51cGRhdGUgPSBfX2JpbmQodGhpcy51cGRhdGUsIHRoaXMpO1xuICAgICAgdGhpcy5wdWJsaXNoID0gX19iaW5kKHRoaXMucHVibGlzaCwgdGhpcyk7XG4gICAgICB0aGlzLnN5bmMgPSBfX2JpbmQodGhpcy5zeW5jLCB0aGlzKTtcbiAgICAgIHRoaXMudW5iaW5kID0gX19iaW5kKHRoaXMudW5iaW5kLCB0aGlzKTtcbiAgICAgIHRoaXMuYmluZCA9IF9fYmluZCh0aGlzLmJpbmQsIHRoaXMpO1xuICAgICAgdGhpcy5zZWxlY3QgPSBfX2JpbmQodGhpcy5zZWxlY3QsIHRoaXMpO1xuICAgICAgdGhpcy50cmF2ZXJzZSA9IF9fYmluZCh0aGlzLnRyYXZlcnNlLCB0aGlzKTtcbiAgICAgIHRoaXMuYnVpbGQgPSBfX2JpbmQodGhpcy5idWlsZCwgdGhpcyk7XG4gICAgICB0aGlzLmJ1aWxkQmluZGluZyA9IF9fYmluZCh0aGlzLmJ1aWxkQmluZGluZywgdGhpcyk7XG4gICAgICB0aGlzLmJpbmRpbmdSZWdFeHAgPSBfX2JpbmQodGhpcy5iaW5kaW5nUmVnRXhwLCB0aGlzKTtcbiAgICAgIHRoaXMub3B0aW9ucyA9IF9fYmluZCh0aGlzLm9wdGlvbnMsIHRoaXMpO1xuICAgICAgaWYgKCEodGhpcy5lbHMuanF1ZXJ5IHx8IHRoaXMuZWxzIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgICAgIHRoaXMuZWxzID0gW3RoaXMuZWxzXTtcbiAgICAgIH1cbiAgICAgIF9yZWYxID0gUml2ZXRzLmV4dGVuc2lvbnM7XG4gICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYxLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgIG9wdGlvbiA9IF9yZWYxW19pXTtcbiAgICAgICAgdGhpc1tvcHRpb25dID0ge307XG4gICAgICAgIGlmIChvcHRpb25zW29wdGlvbl0pIHtcbiAgICAgICAgICBfcmVmMiA9IG9wdGlvbnNbb3B0aW9uXTtcbiAgICAgICAgICBmb3IgKGsgaW4gX3JlZjIpIHtcbiAgICAgICAgICAgIHYgPSBfcmVmMltrXTtcbiAgICAgICAgICAgIHRoaXNbb3B0aW9uXVtrXSA9IHY7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIF9yZWYzID0gUml2ZXRzW1wicHVibGljXCJdW29wdGlvbl07XG4gICAgICAgIGZvciAoayBpbiBfcmVmMykge1xuICAgICAgICAgIHYgPSBfcmVmM1trXTtcbiAgICAgICAgICBpZiAoKF9iYXNlID0gdGhpc1tvcHRpb25dKVtrXSA9PSBudWxsKSB7XG4gICAgICAgICAgICBfYmFzZVtrXSA9IHY7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBfcmVmNCA9IFJpdmV0cy5vcHRpb25zO1xuICAgICAgZm9yIChfaiA9IDAsIF9sZW4xID0gX3JlZjQubGVuZ3RoOyBfaiA8IF9sZW4xOyBfaisrKSB7XG4gICAgICAgIG9wdGlvbiA9IF9yZWY0W19qXTtcbiAgICAgICAgdGhpc1tvcHRpb25dID0gKF9yZWY1ID0gb3B0aW9uc1tvcHRpb25dKSAhPSBudWxsID8gX3JlZjUgOiBSaXZldHNbXCJwdWJsaWNcIl1bb3B0aW9uXTtcbiAgICAgIH1cbiAgICAgIHRoaXMuYnVpbGQoKTtcbiAgICB9XG5cbiAgICBWaWV3LnByb3RvdHlwZS5vcHRpb25zID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgb3B0aW9uLCBvcHRpb25zLCBfaSwgX2xlbiwgX3JlZjE7XG4gICAgICBvcHRpb25zID0ge307XG4gICAgICBfcmVmMSA9IFJpdmV0cy5leHRlbnNpb25zLmNvbmNhdChSaXZldHMub3B0aW9ucyk7XG4gICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYxLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgIG9wdGlvbiA9IF9yZWYxW19pXTtcbiAgICAgICAgb3B0aW9uc1tvcHRpb25dID0gdGhpc1tvcHRpb25dO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG9wdGlvbnM7XG4gICAgfTtcblxuICAgIFZpZXcucHJvdG90eXBlLmJpbmRpbmdSZWdFeHAgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBuZXcgUmVnRXhwKFwiXlwiICsgdGhpcy5wcmVmaXggKyBcIi1cIik7XG4gICAgfTtcblxuICAgIFZpZXcucHJvdG90eXBlLmJ1aWxkQmluZGluZyA9IGZ1bmN0aW9uKGJpbmRpbmcsIG5vZGUsIHR5cGUsIGRlY2xhcmF0aW9uKSB7XG4gICAgICB2YXIgY29udGV4dCwgY3R4LCBkZXBlbmRlbmNpZXMsIGtleXBhdGgsIG9wdGlvbnMsIHBpcGUsIHBpcGVzO1xuICAgICAgb3B0aW9ucyA9IHt9O1xuICAgICAgcGlwZXMgPSAoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBfaSwgX2xlbiwgX3JlZjEsIF9yZXN1bHRzO1xuICAgICAgICBfcmVmMSA9IGRlY2xhcmF0aW9uLm1hdGNoKC8oKD86J1teJ10qJykqKD86KD86W15cXHwnXSooPzonW14nXSonKStbXlxcfCddKikrfFteXFx8XSspKXxeJC9nKTtcbiAgICAgICAgX3Jlc3VsdHMgPSBbXTtcbiAgICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmMS5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICAgIHBpcGUgPSBfcmVmMVtfaV07XG4gICAgICAgICAgX3Jlc3VsdHMucHVzaChwaXBlLnRyaW0oKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgICAgfSkoKTtcbiAgICAgIGNvbnRleHQgPSAoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBfaSwgX2xlbiwgX3JlZjEsIF9yZXN1bHRzO1xuICAgICAgICBfcmVmMSA9IHBpcGVzLnNoaWZ0KCkuc3BsaXQoJzwnKTtcbiAgICAgICAgX3Jlc3VsdHMgPSBbXTtcbiAgICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmMS5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICAgIGN0eCA9IF9yZWYxW19pXTtcbiAgICAgICAgICBfcmVzdWx0cy5wdXNoKGN0eC50cmltKCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBfcmVzdWx0cztcbiAgICAgIH0pKCk7XG4gICAgICBrZXlwYXRoID0gY29udGV4dC5zaGlmdCgpO1xuICAgICAgb3B0aW9ucy5mb3JtYXR0ZXJzID0gcGlwZXM7XG4gICAgICBpZiAoZGVwZW5kZW5jaWVzID0gY29udGV4dC5zaGlmdCgpKSB7XG4gICAgICAgIG9wdGlvbnMuZGVwZW5kZW5jaWVzID0gZGVwZW5kZW5jaWVzLnNwbGl0KC9cXHMrLyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5iaW5kaW5ncy5wdXNoKG5ldyBSaXZldHNbYmluZGluZ10odGhpcywgbm9kZSwgdHlwZSwga2V5cGF0aCwgb3B0aW9ucykpO1xuICAgIH07XG5cbiAgICBWaWV3LnByb3RvdHlwZS5idWlsZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGVsLCBwYXJzZSwgX2ksIF9sZW4sIF9yZWYxO1xuICAgICAgdGhpcy5iaW5kaW5ncyA9IFtdO1xuICAgICAgcGFyc2UgPSAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgICB2YXIgYmxvY2ssIGNoaWxkTm9kZSwgZGVsaW1pdGVycywgbiwgcGFyc2VyLCB0ZXh0LCB0b2tlbiwgdG9rZW5zLCBfaSwgX2osIF9sZW4sIF9sZW4xLCBfcmVmMTtcbiAgICAgICAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gMykge1xuICAgICAgICAgICAgcGFyc2VyID0gUml2ZXRzLlRleHRUZW1wbGF0ZVBhcnNlcjtcbiAgICAgICAgICAgIGlmIChkZWxpbWl0ZXJzID0gX3RoaXMudGVtcGxhdGVEZWxpbWl0ZXJzKSB7XG4gICAgICAgICAgICAgIGlmICgodG9rZW5zID0gcGFyc2VyLnBhcnNlKG5vZGUuZGF0YSwgZGVsaW1pdGVycykpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGlmICghKHRva2Vucy5sZW5ndGggPT09IDEgJiYgdG9rZW5zWzBdLnR5cGUgPT09IHBhcnNlci50eXBlcy50ZXh0KSkge1xuICAgICAgICAgICAgICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSB0b2tlbnMubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdG9rZW4gPSB0b2tlbnNbX2ldO1xuICAgICAgICAgICAgICAgICAgICB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodG9rZW4udmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICBub2RlLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHRleHQsIG5vZGUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAodG9rZW4udHlwZSA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgIF90aGlzLmJ1aWxkQmluZGluZygnVGV4dEJpbmRpbmcnLCB0ZXh0LCBudWxsLCB0b2tlbi52YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIG5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChub2RlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKG5vZGUubm9kZVR5cGUgPT09IDEpIHtcbiAgICAgICAgICAgIGJsb2NrID0gX3RoaXMudHJhdmVyc2Uobm9kZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghYmxvY2spIHtcbiAgICAgICAgICAgIF9yZWYxID0gKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICB2YXIgX2ssIF9sZW4xLCBfcmVmMSwgX3Jlc3VsdHM7XG4gICAgICAgICAgICAgIF9yZWYxID0gbm9kZS5jaGlsZE5vZGVzO1xuICAgICAgICAgICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgICAgICAgICBmb3IgKF9rID0gMCwgX2xlbjEgPSBfcmVmMS5sZW5ndGg7IF9rIDwgX2xlbjE7IF9rKyspIHtcbiAgICAgICAgICAgICAgICBuID0gX3JlZjFbX2tdO1xuICAgICAgICAgICAgICAgIF9yZXN1bHRzLnB1c2gobik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgIGZvciAoX2ogPSAwLCBfbGVuMSA9IF9yZWYxLmxlbmd0aDsgX2ogPCBfbGVuMTsgX2orKykge1xuICAgICAgICAgICAgICBjaGlsZE5vZGUgPSBfcmVmMVtfal07XG4gICAgICAgICAgICAgIHBhcnNlKGNoaWxkTm9kZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSkodGhpcyk7XG4gICAgICBfcmVmMSA9IHRoaXMuZWxzO1xuICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmMS5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICBlbCA9IF9yZWYxW19pXTtcbiAgICAgICAgcGFyc2UoZWwpO1xuICAgICAgfVxuICAgICAgdGhpcy5iaW5kaW5ncy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgICAgdmFyIF9yZWYyLCBfcmVmMztcbiAgICAgICAgcmV0dXJuICgoKF9yZWYyID0gYi5iaW5kZXIpICE9IG51bGwgPyBfcmVmMi5wcmlvcml0eSA6IHZvaWQgMCkgfHwgMCkgLSAoKChfcmVmMyA9IGEuYmluZGVyKSAhPSBudWxsID8gX3JlZjMucHJpb3JpdHkgOiB2b2lkIDApIHx8IDApO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIFZpZXcucHJvdG90eXBlLnRyYXZlcnNlID0gZnVuY3Rpb24obm9kZSkge1xuICAgICAgdmFyIGF0dHJpYnV0ZSwgYXR0cmlidXRlcywgYmluZGVyLCBiaW5kaW5nUmVnRXhwLCBibG9jaywgaWRlbnRpZmllciwgcmVnZXhwLCB0eXBlLCB2YWx1ZSwgX2ksIF9qLCBfbGVuLCBfbGVuMSwgX3JlZjEsIF9yZWYyLCBfcmVmMztcbiAgICAgIGJpbmRpbmdSZWdFeHAgPSB0aGlzLmJpbmRpbmdSZWdFeHAoKTtcbiAgICAgIGJsb2NrID0gbm9kZS5ub2RlTmFtZSA9PT0gJ1NDUklQVCcgfHwgbm9kZS5ub2RlTmFtZSA9PT0gJ1NUWUxFJztcbiAgICAgIF9yZWYxID0gbm9kZS5hdHRyaWJ1dGVzO1xuICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmMS5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICBhdHRyaWJ1dGUgPSBfcmVmMVtfaV07XG4gICAgICAgIGlmIChiaW5kaW5nUmVnRXhwLnRlc3QoYXR0cmlidXRlLm5hbWUpKSB7XG4gICAgICAgICAgdHlwZSA9IGF0dHJpYnV0ZS5uYW1lLnJlcGxhY2UoYmluZGluZ1JlZ0V4cCwgJycpO1xuICAgICAgICAgIGlmICghKGJpbmRlciA9IHRoaXMuYmluZGVyc1t0eXBlXSkpIHtcbiAgICAgICAgICAgIF9yZWYyID0gdGhpcy5iaW5kZXJzO1xuICAgICAgICAgICAgZm9yIChpZGVudGlmaWVyIGluIF9yZWYyKSB7XG4gICAgICAgICAgICAgIHZhbHVlID0gX3JlZjJbaWRlbnRpZmllcl07XG4gICAgICAgICAgICAgIGlmIChpZGVudGlmaWVyICE9PSAnKicgJiYgaWRlbnRpZmllci5pbmRleE9mKCcqJykgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgcmVnZXhwID0gbmV3IFJlZ0V4cChcIl5cIiArIChpZGVudGlmaWVyLnJlcGxhY2UoL1xcKi9nLCAnLisnKSkgKyBcIiRcIik7XG4gICAgICAgICAgICAgICAgaWYgKHJlZ2V4cC50ZXN0KHR5cGUpKSB7XG4gICAgICAgICAgICAgICAgICBiaW5kZXIgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYmluZGVyIHx8IChiaW5kZXIgPSB0aGlzLmJpbmRlcnNbJyonXSk7XG4gICAgICAgICAgaWYgKGJpbmRlci5ibG9jaykge1xuICAgICAgICAgICAgYmxvY2sgPSB0cnVlO1xuICAgICAgICAgICAgYXR0cmlidXRlcyA9IFthdHRyaWJ1dGVdO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgX3JlZjMgPSBhdHRyaWJ1dGVzIHx8IG5vZGUuYXR0cmlidXRlcztcbiAgICAgIGZvciAoX2ogPSAwLCBfbGVuMSA9IF9yZWYzLmxlbmd0aDsgX2ogPCBfbGVuMTsgX2orKykge1xuICAgICAgICBhdHRyaWJ1dGUgPSBfcmVmM1tfal07XG4gICAgICAgIGlmIChiaW5kaW5nUmVnRXhwLnRlc3QoYXR0cmlidXRlLm5hbWUpKSB7XG4gICAgICAgICAgdHlwZSA9IGF0dHJpYnV0ZS5uYW1lLnJlcGxhY2UoYmluZGluZ1JlZ0V4cCwgJycpO1xuICAgICAgICAgIHRoaXMuYnVpbGRCaW5kaW5nKCdCaW5kaW5nJywgbm9kZSwgdHlwZSwgYXR0cmlidXRlLnZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKCFibG9jaykge1xuICAgICAgICB0eXBlID0gbm9kZS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBpZiAodGhpcy5jb21wb25lbnRzW3R5cGVdICYmICFub2RlLl9ib3VuZCkge1xuICAgICAgICAgIHRoaXMuYmluZGluZ3MucHVzaChuZXcgUml2ZXRzLkNvbXBvbmVudEJpbmRpbmcodGhpcywgbm9kZSwgdHlwZSkpO1xuICAgICAgICAgIGJsb2NrID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGJsb2NrO1xuICAgIH07XG5cbiAgICBWaWV3LnByb3RvdHlwZS5zZWxlY3QgPSBmdW5jdGlvbihmbikge1xuICAgICAgdmFyIGJpbmRpbmcsIF9pLCBfbGVuLCBfcmVmMSwgX3Jlc3VsdHM7XG4gICAgICBfcmVmMSA9IHRoaXMuYmluZGluZ3M7XG4gICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmMS5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICBiaW5kaW5nID0gX3JlZjFbX2ldO1xuICAgICAgICBpZiAoZm4oYmluZGluZykpIHtcbiAgICAgICAgICBfcmVzdWx0cy5wdXNoKGJpbmRpbmcpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gX3Jlc3VsdHM7XG4gICAgfTtcblxuICAgIFZpZXcucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBiaW5kaW5nLCBfaSwgX2xlbiwgX3JlZjE7XG4gICAgICBfcmVmMSA9IHRoaXMuYmluZGluZ3M7XG4gICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYxLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgIGJpbmRpbmcgPSBfcmVmMVtfaV07XG4gICAgICAgIGJpbmRpbmcuYmluZCgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBWaWV3LnByb3RvdHlwZS51bmJpbmQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBiaW5kaW5nLCBfaSwgX2xlbiwgX3JlZjE7XG4gICAgICBfcmVmMSA9IHRoaXMuYmluZGluZ3M7XG4gICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYxLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgIGJpbmRpbmcgPSBfcmVmMVtfaV07XG4gICAgICAgIGJpbmRpbmcudW5iaW5kKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIFZpZXcucHJvdG90eXBlLnN5bmMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBiaW5kaW5nLCBfaSwgX2xlbiwgX3JlZjE7XG4gICAgICBfcmVmMSA9IHRoaXMuYmluZGluZ3M7XG4gICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYxLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgIGJpbmRpbmcgPSBfcmVmMVtfaV07XG4gICAgICAgIGlmICh0eXBlb2YgYmluZGluZy5zeW5jID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICBiaW5kaW5nLnN5bmMoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICBWaWV3LnByb3RvdHlwZS5wdWJsaXNoID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYmluZGluZywgX2ksIF9sZW4sIF9yZWYxO1xuICAgICAgX3JlZjEgPSB0aGlzLnNlbGVjdChmdW5jdGlvbihiKSB7XG4gICAgICAgIHZhciBfcmVmMTtcbiAgICAgICAgcmV0dXJuIChfcmVmMSA9IGIuYmluZGVyKSAhPSBudWxsID8gX3JlZjEucHVibGlzaGVzIDogdm9pZCAwO1xuICAgICAgfSk7XG4gICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYxLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgIGJpbmRpbmcgPSBfcmVmMVtfaV07XG4gICAgICAgIGJpbmRpbmcucHVibGlzaCgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBWaWV3LnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbihtb2RlbHMpIHtcbiAgICAgIHZhciBiaW5kaW5nLCBrZXksIG1vZGVsLCBfaSwgX2xlbiwgX3JlZjE7XG4gICAgICBpZiAobW9kZWxzID09IG51bGwpIHtcbiAgICAgICAgbW9kZWxzID0ge307XG4gICAgICB9XG4gICAgICBmb3IgKGtleSBpbiBtb2RlbHMpIHtcbiAgICAgICAgbW9kZWwgPSBtb2RlbHNba2V5XTtcbiAgICAgICAgdGhpcy5tb2RlbHNba2V5XSA9IG1vZGVsO1xuICAgICAgfVxuICAgICAgX3JlZjEgPSB0aGlzLmJpbmRpbmdzO1xuICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmMS5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICBiaW5kaW5nID0gX3JlZjFbX2ldO1xuICAgICAgICBpZiAodHlwZW9mIGJpbmRpbmcudXBkYXRlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICBiaW5kaW5nLnVwZGF0ZShtb2RlbHMpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiBWaWV3O1xuXG4gIH0pKCk7XG5cbiAgUml2ZXRzLkJpbmRpbmcgPSAoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gQmluZGluZyh2aWV3LCBlbCwgdHlwZSwga2V5cGF0aCwgb3B0aW9ucykge1xuICAgICAgdGhpcy52aWV3ID0gdmlldztcbiAgICAgIHRoaXMuZWwgPSBlbDtcbiAgICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgICB0aGlzLmtleXBhdGggPSBrZXlwYXRoO1xuICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyAhPSBudWxsID8gb3B0aW9ucyA6IHt9O1xuICAgICAgdGhpcy5nZXRWYWx1ZSA9IF9fYmluZCh0aGlzLmdldFZhbHVlLCB0aGlzKTtcbiAgICAgIHRoaXMudXBkYXRlID0gX19iaW5kKHRoaXMudXBkYXRlLCB0aGlzKTtcbiAgICAgIHRoaXMudW5iaW5kID0gX19iaW5kKHRoaXMudW5iaW5kLCB0aGlzKTtcbiAgICAgIHRoaXMuYmluZCA9IF9fYmluZCh0aGlzLmJpbmQsIHRoaXMpO1xuICAgICAgdGhpcy5wdWJsaXNoID0gX19iaW5kKHRoaXMucHVibGlzaCwgdGhpcyk7XG4gICAgICB0aGlzLnN5bmMgPSBfX2JpbmQodGhpcy5zeW5jLCB0aGlzKTtcbiAgICAgIHRoaXMuc2V0ID0gX19iaW5kKHRoaXMuc2V0LCB0aGlzKTtcbiAgICAgIHRoaXMuZXZlbnRIYW5kbGVyID0gX19iaW5kKHRoaXMuZXZlbnRIYW5kbGVyLCB0aGlzKTtcbiAgICAgIHRoaXMuZm9ybWF0dGVkVmFsdWUgPSBfX2JpbmQodGhpcy5mb3JtYXR0ZWRWYWx1ZSwgdGhpcyk7XG4gICAgICB0aGlzLnBhcnNlRm9ybWF0dGVyQXJndW1lbnRzID0gX19iaW5kKHRoaXMucGFyc2VGb3JtYXR0ZXJBcmd1bWVudHMsIHRoaXMpO1xuICAgICAgdGhpcy5wYXJzZVRhcmdldCA9IF9fYmluZCh0aGlzLnBhcnNlVGFyZ2V0LCB0aGlzKTtcbiAgICAgIHRoaXMub2JzZXJ2ZSA9IF9fYmluZCh0aGlzLm9ic2VydmUsIHRoaXMpO1xuICAgICAgdGhpcy5zZXRCaW5kZXIgPSBfX2JpbmQodGhpcy5zZXRCaW5kZXIsIHRoaXMpO1xuICAgICAgdGhpcy5mb3JtYXR0ZXJzID0gdGhpcy5vcHRpb25zLmZvcm1hdHRlcnMgfHwgW107XG4gICAgICB0aGlzLmRlcGVuZGVuY2llcyA9IFtdO1xuICAgICAgdGhpcy5mb3JtYXR0ZXJPYnNlcnZlcnMgPSB7fTtcbiAgICAgIHRoaXMubW9kZWwgPSB2b2lkIDA7XG4gICAgICB0aGlzLnNldEJpbmRlcigpO1xuICAgIH1cblxuICAgIEJpbmRpbmcucHJvdG90eXBlLnNldEJpbmRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGlkZW50aWZpZXIsIHJlZ2V4cCwgdmFsdWUsIF9yZWYxO1xuICAgICAgaWYgKCEodGhpcy5iaW5kZXIgPSB0aGlzLnZpZXcuYmluZGVyc1t0aGlzLnR5cGVdKSkge1xuICAgICAgICBfcmVmMSA9IHRoaXMudmlldy5iaW5kZXJzO1xuICAgICAgICBmb3IgKGlkZW50aWZpZXIgaW4gX3JlZjEpIHtcbiAgICAgICAgICB2YWx1ZSA9IF9yZWYxW2lkZW50aWZpZXJdO1xuICAgICAgICAgIGlmIChpZGVudGlmaWVyICE9PSAnKicgJiYgaWRlbnRpZmllci5pbmRleE9mKCcqJykgIT09IC0xKSB7XG4gICAgICAgICAgICByZWdleHAgPSBuZXcgUmVnRXhwKFwiXlwiICsgKGlkZW50aWZpZXIucmVwbGFjZSgvXFwqL2csICcuKycpKSArIFwiJFwiKTtcbiAgICAgICAgICAgIGlmIChyZWdleHAudGVzdCh0aGlzLnR5cGUpKSB7XG4gICAgICAgICAgICAgIHRoaXMuYmluZGVyID0gdmFsdWU7XG4gICAgICAgICAgICAgIHRoaXMuYXJncyA9IG5ldyBSZWdFeHAoXCJeXCIgKyAoaWRlbnRpZmllci5yZXBsYWNlKC9cXCovZywgJyguKyknKSkgKyBcIiRcIikuZXhlYyh0aGlzLnR5cGUpO1xuICAgICAgICAgICAgICB0aGlzLmFyZ3Muc2hpZnQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMuYmluZGVyIHx8ICh0aGlzLmJpbmRlciA9IHRoaXMudmlldy5iaW5kZXJzWycqJ10pO1xuICAgICAgaWYgKHRoaXMuYmluZGVyIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYmluZGVyID0ge1xuICAgICAgICAgIHJvdXRpbmU6IHRoaXMuYmluZGVyXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfTtcblxuICAgIEJpbmRpbmcucHJvdG90eXBlLm9ic2VydmUgPSBmdW5jdGlvbihvYmosIGtleXBhdGgsIGNhbGxiYWNrKSB7XG4gICAgICByZXR1cm4gUml2ZXRzLnNpZ2h0Z2xhc3Mob2JqLCBrZXlwYXRoLCBjYWxsYmFjaywge1xuICAgICAgICByb290OiB0aGlzLnZpZXcucm9vdEludGVyZmFjZSxcbiAgICAgICAgYWRhcHRlcnM6IHRoaXMudmlldy5hZGFwdGVyc1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIEJpbmRpbmcucHJvdG90eXBlLnBhcnNlVGFyZ2V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgdG9rZW47XG4gICAgICB0b2tlbiA9IFJpdmV0cy5UeXBlUGFyc2VyLnBhcnNlKHRoaXMua2V5cGF0aCk7XG4gICAgICBpZiAodG9rZW4udHlwZSA9PT0gUml2ZXRzLlR5cGVQYXJzZXIudHlwZXMucHJpbWl0aXZlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlID0gdG9rZW4udmFsdWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm9ic2VydmVyID0gdGhpcy5vYnNlcnZlKHRoaXMudmlldy5tb2RlbHMsIHRoaXMua2V5cGF0aCwgdGhpcy5zeW5jKTtcbiAgICAgICAgcmV0dXJuIHRoaXMubW9kZWwgPSB0aGlzLm9ic2VydmVyLnRhcmdldDtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgQmluZGluZy5wcm90b3R5cGUucGFyc2VGb3JtYXR0ZXJBcmd1bWVudHMgPSBmdW5jdGlvbihhcmdzLCBmb3JtYXR0ZXJJbmRleCkge1xuICAgICAgdmFyIGFpLCBhcmcsIG9ic2VydmVyLCBwcm9jZXNzZWRBcmdzLCBfYmFzZSwgX2ksIF9sZW47XG4gICAgICBhcmdzID0gKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgX2ksIF9sZW4sIF9yZXN1bHRzO1xuICAgICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IGFyZ3MubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgICBhcmcgPSBhcmdzW19pXTtcbiAgICAgICAgICBfcmVzdWx0cy5wdXNoKFJpdmV0cy5UeXBlUGFyc2VyLnBhcnNlKGFyZykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBfcmVzdWx0cztcbiAgICAgIH0pKCk7XG4gICAgICBwcm9jZXNzZWRBcmdzID0gW107XG4gICAgICBmb3IgKGFpID0gX2kgPSAwLCBfbGVuID0gYXJncy5sZW5ndGg7IF9pIDwgX2xlbjsgYWkgPSArK19pKSB7XG4gICAgICAgIGFyZyA9IGFyZ3NbYWldO1xuICAgICAgICBwcm9jZXNzZWRBcmdzLnB1c2goYXJnLnR5cGUgPT09IFJpdmV0cy5UeXBlUGFyc2VyLnR5cGVzLnByaW1pdGl2ZSA/IGFyZy52YWx1ZSA6ICgoX2Jhc2UgPSB0aGlzLmZvcm1hdHRlck9ic2VydmVycylbZm9ybWF0dGVySW5kZXhdIHx8IChfYmFzZVtmb3JtYXR0ZXJJbmRleF0gPSB7fSksICEob2JzZXJ2ZXIgPSB0aGlzLmZvcm1hdHRlck9ic2VydmVyc1tmb3JtYXR0ZXJJbmRleF1bYWldKSA/IChvYnNlcnZlciA9IHRoaXMub2JzZXJ2ZSh0aGlzLnZpZXcubW9kZWxzLCBhcmcudmFsdWUsIHRoaXMuc3luYyksIHRoaXMuZm9ybWF0dGVyT2JzZXJ2ZXJzW2Zvcm1hdHRlckluZGV4XVthaV0gPSBvYnNlcnZlcikgOiB2b2lkIDAsIG9ic2VydmVyLnZhbHVlKCkpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBwcm9jZXNzZWRBcmdzO1xuICAgIH07XG5cbiAgICBCaW5kaW5nLnByb3RvdHlwZS5mb3JtYXR0ZWRWYWx1ZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICB2YXIgYXJncywgZmksIGZvcm1hdHRlciwgaWQsIHByb2Nlc3NlZEFyZ3MsIF9pLCBfbGVuLCBfcmVmMSwgX3JlZjI7XG4gICAgICBfcmVmMSA9IHRoaXMuZm9ybWF0dGVycztcbiAgICAgIGZvciAoZmkgPSBfaSA9IDAsIF9sZW4gPSBfcmVmMS5sZW5ndGg7IF9pIDwgX2xlbjsgZmkgPSArK19pKSB7XG4gICAgICAgIGZvcm1hdHRlciA9IF9yZWYxW2ZpXTtcbiAgICAgICAgYXJncyA9IGZvcm1hdHRlci5tYXRjaCgvW15cXHMnXSt8JyhbXiddfCdbXlxcc10pKid8XCIoW15cIl18XCJbXlxcc10pKlwiL2cpO1xuICAgICAgICBpZCA9IGFyZ3Muc2hpZnQoKTtcbiAgICAgICAgZm9ybWF0dGVyID0gdGhpcy52aWV3LmZvcm1hdHRlcnNbaWRdO1xuICAgICAgICBwcm9jZXNzZWRBcmdzID0gdGhpcy5wYXJzZUZvcm1hdHRlckFyZ3VtZW50cyhhcmdzLCBmaSk7XG4gICAgICAgIGlmICgoZm9ybWF0dGVyICE9IG51bGwgPyBmb3JtYXR0ZXIucmVhZCA6IHZvaWQgMCkgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuICAgICAgICAgIHZhbHVlID0gKF9yZWYyID0gZm9ybWF0dGVyLnJlYWQpLmNhbGwuYXBwbHkoX3JlZjIsIFt0aGlzLm1vZGVsLCB2YWx1ZV0uY29uY2F0KF9fc2xpY2UuY2FsbChwcm9jZXNzZWRBcmdzKSkpO1xuICAgICAgICB9IGVsc2UgaWYgKGZvcm1hdHRlciBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG4gICAgICAgICAgdmFsdWUgPSBmb3JtYXR0ZXIuY2FsbC5hcHBseShmb3JtYXR0ZXIsIFt0aGlzLm1vZGVsLCB2YWx1ZV0uY29uY2F0KF9fc2xpY2UuY2FsbChwcm9jZXNzZWRBcmdzKSkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfTtcblxuICAgIEJpbmRpbmcucHJvdG90eXBlLmV2ZW50SGFuZGxlciA9IGZ1bmN0aW9uKGZuKSB7XG4gICAgICB2YXIgYmluZGluZywgaGFuZGxlcjtcbiAgICAgIGhhbmRsZXIgPSAoYmluZGluZyA9IHRoaXMpLnZpZXcuaGFuZGxlcjtcbiAgICAgIHJldHVybiBmdW5jdGlvbihldikge1xuICAgICAgICByZXR1cm4gaGFuZGxlci5jYWxsKGZuLCB0aGlzLCBldiwgYmluZGluZyk7XG4gICAgICB9O1xuICAgIH07XG5cbiAgICBCaW5kaW5nLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgdmFyIF9yZWYxO1xuICAgICAgdmFsdWUgPSB2YWx1ZSBpbnN0YW5jZW9mIEZ1bmN0aW9uICYmICF0aGlzLmJpbmRlcltcImZ1bmN0aW9uXCJdICYmIFJpdmV0c1tcInB1YmxpY1wiXS5leGVjdXRlRnVuY3Rpb25zID8gdGhpcy5mb3JtYXR0ZWRWYWx1ZSh2YWx1ZS5jYWxsKHRoaXMubW9kZWwpKSA6IHRoaXMuZm9ybWF0dGVkVmFsdWUodmFsdWUpO1xuICAgICAgcmV0dXJuIChfcmVmMSA9IHRoaXMuYmluZGVyLnJvdXRpbmUpICE9IG51bGwgPyBfcmVmMS5jYWxsKHRoaXMsIHRoaXMuZWwsIHZhbHVlKSA6IHZvaWQgMDtcbiAgICB9O1xuXG4gICAgQmluZGluZy5wcm90b3R5cGUuc3luYyA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGRlcGVuZGVuY3ksIG9ic2VydmVyO1xuICAgICAgcmV0dXJuIHRoaXMuc2V0KChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIF9pLCBfaiwgX2xlbiwgX2xlbjEsIF9yZWYxLCBfcmVmMiwgX3JlZjM7XG4gICAgICAgIGlmICh0aGlzLm9ic2VydmVyKSB7XG4gICAgICAgICAgaWYgKHRoaXMubW9kZWwgIT09IHRoaXMub2JzZXJ2ZXIudGFyZ2V0KSB7XG4gICAgICAgICAgICBfcmVmMSA9IHRoaXMuZGVwZW5kZW5jaWVzO1xuICAgICAgICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmMS5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICAgICAgICBvYnNlcnZlciA9IF9yZWYxW19pXTtcbiAgICAgICAgICAgICAgb2JzZXJ2ZXIudW5vYnNlcnZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmRlcGVuZGVuY2llcyA9IFtdO1xuICAgICAgICAgICAgaWYgKCgodGhpcy5tb2RlbCA9IHRoaXMub2JzZXJ2ZXIudGFyZ2V0KSAhPSBudWxsKSAmJiAoKF9yZWYyID0gdGhpcy5vcHRpb25zLmRlcGVuZGVuY2llcykgIT0gbnVsbCA/IF9yZWYyLmxlbmd0aCA6IHZvaWQgMCkpIHtcbiAgICAgICAgICAgICAgX3JlZjMgPSB0aGlzLm9wdGlvbnMuZGVwZW5kZW5jaWVzO1xuICAgICAgICAgICAgICBmb3IgKF9qID0gMCwgX2xlbjEgPSBfcmVmMy5sZW5ndGg7IF9qIDwgX2xlbjE7IF9qKyspIHtcbiAgICAgICAgICAgICAgICBkZXBlbmRlbmN5ID0gX3JlZjNbX2pdO1xuICAgICAgICAgICAgICAgIG9ic2VydmVyID0gdGhpcy5vYnNlcnZlKHRoaXMubW9kZWwsIGRlcGVuZGVuY3ksIHRoaXMuc3luYyk7XG4gICAgICAgICAgICAgICAgdGhpcy5kZXBlbmRlbmNpZXMucHVzaChvYnNlcnZlcik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRoaXMub2JzZXJ2ZXIudmFsdWUoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfSkuY2FsbCh0aGlzKSk7XG4gICAgfTtcblxuICAgIEJpbmRpbmcucHJvdG90eXBlLnB1Ymxpc2ggPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBhcmdzLCBmaSwgZmlSZXZlcnNlZCwgZm9ybWF0dGVyLCBpZCwgbGFzdGZvcm1hdHRlckluZGV4LCBwcm9jZXNzZWRBcmdzLCB2YWx1ZSwgX2ksIF9sZW4sIF9yZWYxLCBfcmVmMiwgX3JlZjM7XG4gICAgICBpZiAodGhpcy5vYnNlcnZlcikge1xuICAgICAgICB2YWx1ZSA9IHRoaXMuZ2V0VmFsdWUodGhpcy5lbCk7XG4gICAgICAgIGxhc3Rmb3JtYXR0ZXJJbmRleCA9IHRoaXMuZm9ybWF0dGVycy5sZW5ndGggLSAxO1xuICAgICAgICBfcmVmMSA9IHRoaXMuZm9ybWF0dGVycy5zbGljZSgwKS5yZXZlcnNlKCk7XG4gICAgICAgIGZvciAoZmlSZXZlcnNlZCA9IF9pID0gMCwgX2xlbiA9IF9yZWYxLmxlbmd0aDsgX2kgPCBfbGVuOyBmaVJldmVyc2VkID0gKytfaSkge1xuICAgICAgICAgIGZvcm1hdHRlciA9IF9yZWYxW2ZpUmV2ZXJzZWRdO1xuICAgICAgICAgIGZpID0gbGFzdGZvcm1hdHRlckluZGV4IC0gZmlSZXZlcnNlZDtcbiAgICAgICAgICBhcmdzID0gZm9ybWF0dGVyLnNwbGl0KC9cXHMrLyk7XG4gICAgICAgICAgaWQgPSBhcmdzLnNoaWZ0KCk7XG4gICAgICAgICAgcHJvY2Vzc2VkQXJncyA9IHRoaXMucGFyc2VGb3JtYXR0ZXJBcmd1bWVudHMoYXJncywgZmkpO1xuICAgICAgICAgIGlmICgoX3JlZjIgPSB0aGlzLnZpZXcuZm9ybWF0dGVyc1tpZF0pICE9IG51bGwgPyBfcmVmMi5wdWJsaXNoIDogdm9pZCAwKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IChfcmVmMyA9IHRoaXMudmlldy5mb3JtYXR0ZXJzW2lkXSkucHVibGlzaC5hcHBseShfcmVmMywgW3ZhbHVlXS5jb25jYXQoX19zbGljZS5jYWxsKHByb2Nlc3NlZEFyZ3MpKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLm9ic2VydmVyLnNldFZhbHVlKHZhbHVlKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgQmluZGluZy5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGRlcGVuZGVuY3ksIG9ic2VydmVyLCBfaSwgX2xlbiwgX3JlZjEsIF9yZWYyLCBfcmVmMztcbiAgICAgIHRoaXMucGFyc2VUYXJnZXQoKTtcbiAgICAgIGlmICgoX3JlZjEgPSB0aGlzLmJpbmRlci5iaW5kKSAhPSBudWxsKSB7XG4gICAgICAgIF9yZWYxLmNhbGwodGhpcywgdGhpcy5lbCk7XG4gICAgICB9XG4gICAgICBpZiAoKHRoaXMubW9kZWwgIT0gbnVsbCkgJiYgKChfcmVmMiA9IHRoaXMub3B0aW9ucy5kZXBlbmRlbmNpZXMpICE9IG51bGwgPyBfcmVmMi5sZW5ndGggOiB2b2lkIDApKSB7XG4gICAgICAgIF9yZWYzID0gdGhpcy5vcHRpb25zLmRlcGVuZGVuY2llcztcbiAgICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmMy5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICAgIGRlcGVuZGVuY3kgPSBfcmVmM1tfaV07XG4gICAgICAgICAgb2JzZXJ2ZXIgPSB0aGlzLm9ic2VydmUodGhpcy5tb2RlbCwgZGVwZW5kZW5jeSwgdGhpcy5zeW5jKTtcbiAgICAgICAgICB0aGlzLmRlcGVuZGVuY2llcy5wdXNoKG9ic2VydmVyKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHRoaXMudmlldy5wcmVsb2FkRGF0YSkge1xuICAgICAgICByZXR1cm4gdGhpcy5zeW5jKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIEJpbmRpbmcucHJvdG90eXBlLnVuYmluZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGFpLCBhcmdzLCBmaSwgb2JzZXJ2ZXIsIF9pLCBfbGVuLCBfcmVmMSwgX3JlZjIsIF9yZWYzLCBfcmVmNDtcbiAgICAgIGlmICgoX3JlZjEgPSB0aGlzLmJpbmRlci51bmJpbmQpICE9IG51bGwpIHtcbiAgICAgICAgX3JlZjEuY2FsbCh0aGlzLCB0aGlzLmVsKTtcbiAgICAgIH1cbiAgICAgIGlmICgoX3JlZjIgPSB0aGlzLm9ic2VydmVyKSAhPSBudWxsKSB7XG4gICAgICAgIF9yZWYyLnVub2JzZXJ2ZSgpO1xuICAgICAgfVxuICAgICAgX3JlZjMgPSB0aGlzLmRlcGVuZGVuY2llcztcbiAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZjMubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgb2JzZXJ2ZXIgPSBfcmVmM1tfaV07XG4gICAgICAgIG9ic2VydmVyLnVub2JzZXJ2ZSgpO1xuICAgICAgfVxuICAgICAgdGhpcy5kZXBlbmRlbmNpZXMgPSBbXTtcbiAgICAgIF9yZWY0ID0gdGhpcy5mb3JtYXR0ZXJPYnNlcnZlcnM7XG4gICAgICBmb3IgKGZpIGluIF9yZWY0KSB7XG4gICAgICAgIGFyZ3MgPSBfcmVmNFtmaV07XG4gICAgICAgIGZvciAoYWkgaW4gYXJncykge1xuICAgICAgICAgIG9ic2VydmVyID0gYXJnc1thaV07XG4gICAgICAgICAgb2JzZXJ2ZXIudW5vYnNlcnZlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmZvcm1hdHRlck9ic2VydmVycyA9IHt9O1xuICAgIH07XG5cbiAgICBCaW5kaW5nLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbihtb2RlbHMpIHtcbiAgICAgIHZhciBfcmVmMSwgX3JlZjI7XG4gICAgICBpZiAobW9kZWxzID09IG51bGwpIHtcbiAgICAgICAgbW9kZWxzID0ge307XG4gICAgICB9XG4gICAgICB0aGlzLm1vZGVsID0gKF9yZWYxID0gdGhpcy5vYnNlcnZlcikgIT0gbnVsbCA/IF9yZWYxLnRhcmdldCA6IHZvaWQgMDtcbiAgICAgIHJldHVybiAoX3JlZjIgPSB0aGlzLmJpbmRlci51cGRhdGUpICE9IG51bGwgPyBfcmVmMi5jYWxsKHRoaXMsIG1vZGVscykgOiB2b2lkIDA7XG4gICAgfTtcblxuICAgIEJpbmRpbmcucHJvdG90eXBlLmdldFZhbHVlID0gZnVuY3Rpb24oZWwpIHtcbiAgICAgIGlmICh0aGlzLmJpbmRlciAmJiAodGhpcy5iaW5kZXIuZ2V0VmFsdWUgIT0gbnVsbCkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYmluZGVyLmdldFZhbHVlLmNhbGwodGhpcywgZWwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFJpdmV0cy5VdGlsLmdldElucHV0VmFsdWUoZWwpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gQmluZGluZztcblxuICB9KSgpO1xuXG4gIFJpdmV0cy5Db21wb25lbnRCaW5kaW5nID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhDb21wb25lbnRCaW5kaW5nLCBfc3VwZXIpO1xuXG4gICAgZnVuY3Rpb24gQ29tcG9uZW50QmluZGluZyh2aWV3LCBlbCwgdHlwZSkge1xuICAgICAgdmFyIGF0dHJpYnV0ZSwgYmluZGluZ1JlZ0V4cCwgcHJvcGVydHlOYW1lLCB0b2tlbiwgX2ksIF9sZW4sIF9yZWYxLCBfcmVmMjtcbiAgICAgIHRoaXMudmlldyA9IHZpZXc7XG4gICAgICB0aGlzLmVsID0gZWw7XG4gICAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgICAgdGhpcy51bmJpbmQgPSBfX2JpbmQodGhpcy51bmJpbmQsIHRoaXMpO1xuICAgICAgdGhpcy5iaW5kID0gX19iaW5kKHRoaXMuYmluZCwgdGhpcyk7XG4gICAgICB0aGlzLmxvY2FscyA9IF9fYmluZCh0aGlzLmxvY2FscywgdGhpcyk7XG4gICAgICB0aGlzLmNvbXBvbmVudCA9IHRoaXMudmlldy5jb21wb25lbnRzW3RoaXMudHlwZV07XG4gICAgICB0aGlzW1wic3RhdGljXCJdID0ge307XG4gICAgICB0aGlzLm9ic2VydmVycyA9IHt9O1xuICAgICAgdGhpcy51cHN0cmVhbU9ic2VydmVycyA9IHt9O1xuICAgICAgYmluZGluZ1JlZ0V4cCA9IHZpZXcuYmluZGluZ1JlZ0V4cCgpO1xuICAgICAgX3JlZjEgPSB0aGlzLmVsLmF0dHJpYnV0ZXMgfHwgW107XG4gICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYxLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgIGF0dHJpYnV0ZSA9IF9yZWYxW19pXTtcbiAgICAgICAgaWYgKCFiaW5kaW5nUmVnRXhwLnRlc3QoYXR0cmlidXRlLm5hbWUpKSB7XG4gICAgICAgICAgcHJvcGVydHlOYW1lID0gdGhpcy5jYW1lbENhc2UoYXR0cmlidXRlLm5hbWUpO1xuICAgICAgICAgIHRva2VuID0gUml2ZXRzLlR5cGVQYXJzZXIucGFyc2UoYXR0cmlidXRlLnZhbHVlKTtcbiAgICAgICAgICBpZiAoX19pbmRleE9mLmNhbGwoKF9yZWYyID0gdGhpcy5jb21wb25lbnRbXCJzdGF0aWNcIl0pICE9IG51bGwgPyBfcmVmMiA6IFtdLCBwcm9wZXJ0eU5hbWUpID49IDApIHtcbiAgICAgICAgICAgIHRoaXNbXCJzdGF0aWNcIl1bcHJvcGVydHlOYW1lXSA9IGF0dHJpYnV0ZS52YWx1ZTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHRva2VuLnR5cGUgPT09IFJpdmV0cy5UeXBlUGFyc2VyLnR5cGVzLnByaW1pdGl2ZSkge1xuICAgICAgICAgICAgdGhpc1tcInN0YXRpY1wiXVtwcm9wZXJ0eU5hbWVdID0gdG9rZW4udmFsdWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMub2JzZXJ2ZXJzW3Byb3BlcnR5TmFtZV0gPSBhdHRyaWJ1dGUudmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgQ29tcG9uZW50QmluZGluZy5wcm90b3R5cGUuc3luYyA9IGZ1bmN0aW9uKCkge307XG5cbiAgICBDb21wb25lbnRCaW5kaW5nLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpIHt9O1xuXG4gICAgQ29tcG9uZW50QmluZGluZy5wcm90b3R5cGUucHVibGlzaCA9IGZ1bmN0aW9uKCkge307XG5cbiAgICBDb21wb25lbnRCaW5kaW5nLnByb3RvdHlwZS5sb2NhbHMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBrZXksIG9ic2VydmVyLCByZXN1bHQsIHZhbHVlLCBfcmVmMSwgX3JlZjI7XG4gICAgICByZXN1bHQgPSB7fTtcbiAgICAgIF9yZWYxID0gdGhpc1tcInN0YXRpY1wiXTtcbiAgICAgIGZvciAoa2V5IGluIF9yZWYxKSB7XG4gICAgICAgIHZhbHVlID0gX3JlZjFba2V5XTtcbiAgICAgICAgcmVzdWx0W2tleV0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICAgIF9yZWYyID0gdGhpcy5vYnNlcnZlcnM7XG4gICAgICBmb3IgKGtleSBpbiBfcmVmMikge1xuICAgICAgICBvYnNlcnZlciA9IF9yZWYyW2tleV07XG4gICAgICAgIHJlc3VsdFtrZXldID0gb2JzZXJ2ZXIudmFsdWUoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIENvbXBvbmVudEJpbmRpbmcucHJvdG90eXBlLmNhbWVsQ2FzZSA9IGZ1bmN0aW9uKHN0cmluZykge1xuICAgICAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKC8tKFthLXpdKS9nLCBmdW5jdGlvbihncm91cGVkKSB7XG4gICAgICAgIHJldHVybiBncm91cGVkWzFdLnRvVXBwZXJDYXNlKCk7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgQ29tcG9uZW50QmluZGluZy5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGssIGtleSwga2V5cGF0aCwgb2JzZXJ2ZXIsIG9wdGlvbiwgb3B0aW9ucywgc2NvcGUsIHYsIF9iYXNlLCBfaSwgX2osIF9sZW4sIF9sZW4xLCBfcmVmMSwgX3JlZjIsIF9yZWYzLCBfcmVmNCwgX3JlZjUsIF9yZWY2LCBfcmVmNztcbiAgICAgIGlmICghdGhpcy5ib3VuZCkge1xuICAgICAgICBfcmVmMSA9IHRoaXMub2JzZXJ2ZXJzO1xuICAgICAgICBmb3IgKGtleSBpbiBfcmVmMSkge1xuICAgICAgICAgIGtleXBhdGggPSBfcmVmMVtrZXldO1xuICAgICAgICAgIHRoaXMub2JzZXJ2ZXJzW2tleV0gPSB0aGlzLm9ic2VydmUodGhpcy52aWV3Lm1vZGVscywga2V5cGF0aCwgKChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF90aGlzLmNvbXBvbmVudFZpZXcubW9kZWxzW2tleV0gPSBfdGhpcy5vYnNlcnZlcnNba2V5XS52YWx1ZSgpO1xuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9KSh0aGlzKSkuY2FsbCh0aGlzLCBrZXkpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmJvdW5kID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmNvbXBvbmVudFZpZXcgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLmNvbXBvbmVudFZpZXcuYmluZCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5lbC5pbm5lckhUTUwgPSB0aGlzLmNvbXBvbmVudC50ZW1wbGF0ZS5jYWxsKHRoaXMpO1xuICAgICAgICBzY29wZSA9IHRoaXMuY29tcG9uZW50LmluaXRpYWxpemUuY2FsbCh0aGlzLCB0aGlzLmVsLCB0aGlzLmxvY2FscygpKTtcbiAgICAgICAgdGhpcy5lbC5fYm91bmQgPSB0cnVlO1xuICAgICAgICBvcHRpb25zID0ge307XG4gICAgICAgIF9yZWYyID0gUml2ZXRzLmV4dGVuc2lvbnM7XG4gICAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZjIubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgICBvcHRpb24gPSBfcmVmMltfaV07XG4gICAgICAgICAgb3B0aW9uc1tvcHRpb25dID0ge307XG4gICAgICAgICAgaWYgKHRoaXMuY29tcG9uZW50W29wdGlvbl0pIHtcbiAgICAgICAgICAgIF9yZWYzID0gdGhpcy5jb21wb25lbnRbb3B0aW9uXTtcbiAgICAgICAgICAgIGZvciAoayBpbiBfcmVmMykge1xuICAgICAgICAgICAgICB2ID0gX3JlZjNba107XG4gICAgICAgICAgICAgIG9wdGlvbnNbb3B0aW9uXVtrXSA9IHY7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIF9yZWY0ID0gdGhpcy52aWV3W29wdGlvbl07XG4gICAgICAgICAgZm9yIChrIGluIF9yZWY0KSB7XG4gICAgICAgICAgICB2ID0gX3JlZjRba107XG4gICAgICAgICAgICBpZiAoKF9iYXNlID0gb3B0aW9uc1tvcHRpb25dKVtrXSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgIF9iYXNlW2tdID0gdjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgX3JlZjUgPSBSaXZldHMub3B0aW9ucztcbiAgICAgICAgZm9yIChfaiA9IDAsIF9sZW4xID0gX3JlZjUubGVuZ3RoOyBfaiA8IF9sZW4xOyBfaisrKSB7XG4gICAgICAgICAgb3B0aW9uID0gX3JlZjVbX2pdO1xuICAgICAgICAgIG9wdGlvbnNbb3B0aW9uXSA9IChfcmVmNiA9IHRoaXMuY29tcG9uZW50W29wdGlvbl0pICE9IG51bGwgPyBfcmVmNiA6IHRoaXMudmlld1tvcHRpb25dO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY29tcG9uZW50VmlldyA9IG5ldyBSaXZldHMuVmlldyhBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCh0aGlzLmVsLmNoaWxkTm9kZXMpLCBzY29wZSwgb3B0aW9ucyk7XG4gICAgICAgIHRoaXMuY29tcG9uZW50Vmlldy5iaW5kKCk7XG4gICAgICAgIF9yZWY3ID0gdGhpcy5vYnNlcnZlcnM7XG4gICAgICAgIGZvciAoa2V5IGluIF9yZWY3KSB7XG4gICAgICAgICAgb2JzZXJ2ZXIgPSBfcmVmN1trZXldO1xuICAgICAgICAgIHRoaXMudXBzdHJlYW1PYnNlcnZlcnNba2V5XSA9IHRoaXMub2JzZXJ2ZSh0aGlzLmNvbXBvbmVudFZpZXcubW9kZWxzLCBrZXksICgoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihrZXksIG9ic2VydmVyKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb2JzZXJ2ZXIuc2V0VmFsdWUoX3RoaXMuY29tcG9uZW50Vmlldy5tb2RlbHNba2V5XSk7XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0pKHRoaXMpKS5jYWxsKHRoaXMsIGtleSwgb2JzZXJ2ZXIpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICBDb21wb25lbnRCaW5kaW5nLnByb3RvdHlwZS51bmJpbmQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBrZXksIG9ic2VydmVyLCBfcmVmMSwgX3JlZjIsIF9yZWYzO1xuICAgICAgX3JlZjEgPSB0aGlzLnVwc3RyZWFtT2JzZXJ2ZXJzO1xuICAgICAgZm9yIChrZXkgaW4gX3JlZjEpIHtcbiAgICAgICAgb2JzZXJ2ZXIgPSBfcmVmMVtrZXldO1xuICAgICAgICBvYnNlcnZlci51bm9ic2VydmUoKTtcbiAgICAgIH1cbiAgICAgIF9yZWYyID0gdGhpcy5vYnNlcnZlcnM7XG4gICAgICBmb3IgKGtleSBpbiBfcmVmMikge1xuICAgICAgICBvYnNlcnZlciA9IF9yZWYyW2tleV07XG4gICAgICAgIG9ic2VydmVyLnVub2JzZXJ2ZSgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIChfcmVmMyA9IHRoaXMuY29tcG9uZW50VmlldykgIT0gbnVsbCA/IF9yZWYzLnVuYmluZC5jYWxsKHRoaXMpIDogdm9pZCAwO1xuICAgIH07XG5cbiAgICByZXR1cm4gQ29tcG9uZW50QmluZGluZztcblxuICB9KShSaXZldHMuQmluZGluZyk7XG5cbiAgUml2ZXRzLlRleHRCaW5kaW5nID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhUZXh0QmluZGluZywgX3N1cGVyKTtcblxuICAgIGZ1bmN0aW9uIFRleHRCaW5kaW5nKHZpZXcsIGVsLCB0eXBlLCBrZXlwYXRoLCBvcHRpb25zKSB7XG4gICAgICB0aGlzLnZpZXcgPSB2aWV3O1xuICAgICAgdGhpcy5lbCA9IGVsO1xuICAgICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICAgIHRoaXMua2V5cGF0aCA9IGtleXBhdGg7XG4gICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zICE9IG51bGwgPyBvcHRpb25zIDoge307XG4gICAgICB0aGlzLnN5bmMgPSBfX2JpbmQodGhpcy5zeW5jLCB0aGlzKTtcbiAgICAgIHRoaXMuZm9ybWF0dGVycyA9IHRoaXMub3B0aW9ucy5mb3JtYXR0ZXJzIHx8IFtdO1xuICAgICAgdGhpcy5kZXBlbmRlbmNpZXMgPSBbXTtcbiAgICAgIHRoaXMuZm9ybWF0dGVyT2JzZXJ2ZXJzID0ge307XG4gICAgfVxuXG4gICAgVGV4dEJpbmRpbmcucHJvdG90eXBlLmJpbmRlciA9IHtcbiAgICAgIHJvdXRpbmU6IGZ1bmN0aW9uKG5vZGUsIHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBub2RlLmRhdGEgPSB2YWx1ZSAhPSBudWxsID8gdmFsdWUgOiAnJztcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgVGV4dEJpbmRpbmcucHJvdG90eXBlLnN5bmMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBUZXh0QmluZGluZy5fX3N1cGVyX18uc3luYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG5cbiAgICByZXR1cm4gVGV4dEJpbmRpbmc7XG5cbiAgfSkoUml2ZXRzLkJpbmRpbmcpO1xuXG4gIFJpdmV0c1tcInB1YmxpY1wiXS5iaW5kZXJzLnRleHQgPSBmdW5jdGlvbihlbCwgdmFsdWUpIHtcbiAgICBpZiAoZWwudGV4dENvbnRlbnQgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGVsLnRleHRDb250ZW50ID0gdmFsdWUgIT0gbnVsbCA/IHZhbHVlIDogJyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBlbC5pbm5lclRleHQgPSB2YWx1ZSAhPSBudWxsID8gdmFsdWUgOiAnJztcbiAgICB9XG4gIH07XG5cbiAgUml2ZXRzW1wicHVibGljXCJdLmJpbmRlcnMuaHRtbCA9IGZ1bmN0aW9uKGVsLCB2YWx1ZSkge1xuICAgIHJldHVybiBlbC5pbm5lckhUTUwgPSB2YWx1ZSAhPSBudWxsID8gdmFsdWUgOiAnJztcbiAgfTtcblxuICBSaXZldHNbXCJwdWJsaWNcIl0uYmluZGVycy5zaG93ID0gZnVuY3Rpb24oZWwsIHZhbHVlKSB7XG4gICAgcmV0dXJuIGVsLnN0eWxlLmRpc3BsYXkgPSB2YWx1ZSA/ICcnIDogJ25vbmUnO1xuICB9O1xuXG4gIFJpdmV0c1tcInB1YmxpY1wiXS5iaW5kZXJzLmhpZGUgPSBmdW5jdGlvbihlbCwgdmFsdWUpIHtcbiAgICByZXR1cm4gZWwuc3R5bGUuZGlzcGxheSA9IHZhbHVlID8gJ25vbmUnIDogJyc7XG4gIH07XG5cbiAgUml2ZXRzW1wicHVibGljXCJdLmJpbmRlcnMuZW5hYmxlZCA9IGZ1bmN0aW9uKGVsLCB2YWx1ZSkge1xuICAgIHJldHVybiBlbC5kaXNhYmxlZCA9ICF2YWx1ZTtcbiAgfTtcblxuICBSaXZldHNbXCJwdWJsaWNcIl0uYmluZGVycy5kaXNhYmxlZCA9IGZ1bmN0aW9uKGVsLCB2YWx1ZSkge1xuICAgIHJldHVybiBlbC5kaXNhYmxlZCA9ICEhdmFsdWU7XG4gIH07XG5cbiAgUml2ZXRzW1wicHVibGljXCJdLmJpbmRlcnMuY2hlY2tlZCA9IHtcbiAgICBwdWJsaXNoZXM6IHRydWUsXG4gICAgcHJpb3JpdHk6IDIwMDAsXG4gICAgYmluZDogZnVuY3Rpb24oZWwpIHtcbiAgICAgIHJldHVybiBSaXZldHMuVXRpbC5iaW5kRXZlbnQoZWwsICdjaGFuZ2UnLCB0aGlzLnB1Ymxpc2gpO1xuICAgIH0sXG4gICAgdW5iaW5kOiBmdW5jdGlvbihlbCkge1xuICAgICAgcmV0dXJuIFJpdmV0cy5VdGlsLnVuYmluZEV2ZW50KGVsLCAnY2hhbmdlJywgdGhpcy5wdWJsaXNoKTtcbiAgICB9LFxuICAgIHJvdXRpbmU6IGZ1bmN0aW9uKGVsLCB2YWx1ZSkge1xuICAgICAgdmFyIF9yZWYxO1xuICAgICAgaWYgKGVsLnR5cGUgPT09ICdyYWRpbycpIHtcbiAgICAgICAgcmV0dXJuIGVsLmNoZWNrZWQgPSAoKF9yZWYxID0gZWwudmFsdWUpICE9IG51bGwgPyBfcmVmMS50b1N0cmluZygpIDogdm9pZCAwKSA9PT0gKHZhbHVlICE9IG51bGwgPyB2YWx1ZS50b1N0cmluZygpIDogdm9pZCAwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBlbC5jaGVja2VkID0gISF2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgUml2ZXRzW1wicHVibGljXCJdLmJpbmRlcnMudW5jaGVja2VkID0ge1xuICAgIHB1Ymxpc2hlczogdHJ1ZSxcbiAgICBwcmlvcml0eTogMjAwMCxcbiAgICBiaW5kOiBmdW5jdGlvbihlbCkge1xuICAgICAgcmV0dXJuIFJpdmV0cy5VdGlsLmJpbmRFdmVudChlbCwgJ2NoYW5nZScsIHRoaXMucHVibGlzaCk7XG4gICAgfSxcbiAgICB1bmJpbmQ6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICByZXR1cm4gUml2ZXRzLlV0aWwudW5iaW5kRXZlbnQoZWwsICdjaGFuZ2UnLCB0aGlzLnB1Ymxpc2gpO1xuICAgIH0sXG4gICAgcm91dGluZTogZnVuY3Rpb24oZWwsIHZhbHVlKSB7XG4gICAgICB2YXIgX3JlZjE7XG4gICAgICBpZiAoZWwudHlwZSA9PT0gJ3JhZGlvJykge1xuICAgICAgICByZXR1cm4gZWwuY2hlY2tlZCA9ICgoX3JlZjEgPSBlbC52YWx1ZSkgIT0gbnVsbCA/IF9yZWYxLnRvU3RyaW5nKCkgOiB2b2lkIDApICE9PSAodmFsdWUgIT0gbnVsbCA/IHZhbHVlLnRvU3RyaW5nKCkgOiB2b2lkIDApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGVsLmNoZWNrZWQgPSAhdmFsdWU7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIFJpdmV0c1tcInB1YmxpY1wiXS5iaW5kZXJzLnZhbHVlID0ge1xuICAgIHB1Ymxpc2hlczogdHJ1ZSxcbiAgICBwcmlvcml0eTogMzAwMCxcbiAgICBiaW5kOiBmdW5jdGlvbihlbCkge1xuICAgICAgaWYgKCEoZWwudGFnTmFtZSA9PT0gJ0lOUFVUJyAmJiBlbC50eXBlID09PSAncmFkaW8nKSkge1xuICAgICAgICB0aGlzLmV2ZW50ID0gZWwudGFnTmFtZSA9PT0gJ1NFTEVDVCcgPyAnY2hhbmdlJyA6ICdpbnB1dCc7XG4gICAgICAgIHJldHVybiBSaXZldHMuVXRpbC5iaW5kRXZlbnQoZWwsIHRoaXMuZXZlbnQsIHRoaXMucHVibGlzaCk7XG4gICAgICB9XG4gICAgfSxcbiAgICB1bmJpbmQ6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICBpZiAoIShlbC50YWdOYW1lID09PSAnSU5QVVQnICYmIGVsLnR5cGUgPT09ICdyYWRpbycpKSB7XG4gICAgICAgIHJldHVybiBSaXZldHMuVXRpbC51bmJpbmRFdmVudChlbCwgdGhpcy5ldmVudCwgdGhpcy5wdWJsaXNoKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHJvdXRpbmU6IGZ1bmN0aW9uKGVsLCB2YWx1ZSkge1xuICAgICAgdmFyIG8sIF9pLCBfbGVuLCBfcmVmMSwgX3JlZjIsIF9yZWYzLCBfcmVzdWx0cztcbiAgICAgIGlmIChlbC50YWdOYW1lID09PSAnSU5QVVQnICYmIGVsLnR5cGUgPT09ICdyYWRpbycpIHtcbiAgICAgICAgcmV0dXJuIGVsLnNldEF0dHJpYnV0ZSgndmFsdWUnLCB2YWx1ZSk7XG4gICAgICB9IGVsc2UgaWYgKHdpbmRvdy5qUXVlcnkgIT0gbnVsbCkge1xuICAgICAgICBlbCA9IGpRdWVyeShlbCk7XG4gICAgICAgIGlmICgodmFsdWUgIT0gbnVsbCA/IHZhbHVlLnRvU3RyaW5nKCkgOiB2b2lkIDApICE9PSAoKF9yZWYxID0gZWwudmFsKCkpICE9IG51bGwgPyBfcmVmMS50b1N0cmluZygpIDogdm9pZCAwKSkge1xuICAgICAgICAgIHJldHVybiBlbC52YWwodmFsdWUgIT0gbnVsbCA/IHZhbHVlIDogJycpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoZWwudHlwZSA9PT0gJ3NlbGVjdC1tdWx0aXBsZScpIHtcbiAgICAgICAgICBpZiAodmFsdWUgIT0gbnVsbCkge1xuICAgICAgICAgICAgX3Jlc3VsdHMgPSBbXTtcbiAgICAgICAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gZWwubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgICAgICAgbyA9IGVsW19pXTtcbiAgICAgICAgICAgICAgX3Jlc3VsdHMucHVzaChvLnNlbGVjdGVkID0gKF9yZWYyID0gby52YWx1ZSwgX19pbmRleE9mLmNhbGwodmFsdWUsIF9yZWYyKSA+PSAwKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gX3Jlc3VsdHM7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKCh2YWx1ZSAhPSBudWxsID8gdmFsdWUudG9TdHJpbmcoKSA6IHZvaWQgMCkgIT09ICgoX3JlZjMgPSBlbC52YWx1ZSkgIT0gbnVsbCA/IF9yZWYzLnRvU3RyaW5nKCkgOiB2b2lkIDApKSB7XG4gICAgICAgICAgcmV0dXJuIGVsLnZhbHVlID0gdmFsdWUgIT0gbnVsbCA/IHZhbHVlIDogJyc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgUml2ZXRzW1wicHVibGljXCJdLmJpbmRlcnNbXCJpZlwiXSA9IHtcbiAgICBibG9jazogdHJ1ZSxcbiAgICBwcmlvcml0eTogNDAwMCxcbiAgICBiaW5kOiBmdW5jdGlvbihlbCkge1xuICAgICAgdmFyIGF0dHIsIGRlY2xhcmF0aW9uO1xuICAgICAgaWYgKHRoaXMubWFya2VyID09IG51bGwpIHtcbiAgICAgICAgYXR0ciA9IFt0aGlzLnZpZXcucHJlZml4LCB0aGlzLnR5cGVdLmpvaW4oJy0nKS5yZXBsYWNlKCctLScsICctJyk7XG4gICAgICAgIGRlY2xhcmF0aW9uID0gZWwuZ2V0QXR0cmlidXRlKGF0dHIpO1xuICAgICAgICB0aGlzLm1hcmtlciA9IGRvY3VtZW50LmNyZWF0ZUNvbW1lbnQoXCIgcml2ZXRzOiBcIiArIHRoaXMudHlwZSArIFwiIFwiICsgZGVjbGFyYXRpb24gKyBcIiBcIik7XG4gICAgICAgIHRoaXMuYm91bmQgPSBmYWxzZTtcbiAgICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKGF0dHIpO1xuICAgICAgICBlbC5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh0aGlzLm1hcmtlciwgZWwpO1xuICAgICAgICByZXR1cm4gZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbCk7XG4gICAgICB9XG4gICAgfSxcbiAgICB1bmJpbmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHRoaXMubmVzdGVkKSB7XG4gICAgICAgIHRoaXMubmVzdGVkLnVuYmluZCgpO1xuICAgICAgICByZXR1cm4gdGhpcy5ib3VuZCA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0sXG4gICAgcm91dGluZTogZnVuY3Rpb24oZWwsIHZhbHVlKSB7XG4gICAgICB2YXIga2V5LCBtb2RlbCwgbW9kZWxzLCBfcmVmMTtcbiAgICAgIGlmICghIXZhbHVlID09PSAhdGhpcy5ib3VuZCkge1xuICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICBtb2RlbHMgPSB7fTtcbiAgICAgICAgICBfcmVmMSA9IHRoaXMudmlldy5tb2RlbHM7XG4gICAgICAgICAgZm9yIChrZXkgaW4gX3JlZjEpIHtcbiAgICAgICAgICAgIG1vZGVsID0gX3JlZjFba2V5XTtcbiAgICAgICAgICAgIG1vZGVsc1trZXldID0gbW9kZWw7XG4gICAgICAgICAgfVxuICAgICAgICAgICh0aGlzLm5lc3RlZCB8fCAodGhpcy5uZXN0ZWQgPSBuZXcgUml2ZXRzLlZpZXcoZWwsIG1vZGVscywgdGhpcy52aWV3Lm9wdGlvbnMoKSkpKS5iaW5kKCk7XG4gICAgICAgICAgdGhpcy5tYXJrZXIucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoZWwsIHRoaXMubWFya2VyLm5leHRTaWJsaW5nKTtcbiAgICAgICAgICByZXR1cm4gdGhpcy5ib3VuZCA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbCk7XG4gICAgICAgICAgdGhpcy5uZXN0ZWQudW5iaW5kKCk7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuYm91bmQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgdXBkYXRlOiBmdW5jdGlvbihtb2RlbHMpIHtcbiAgICAgIHZhciBfcmVmMTtcbiAgICAgIHJldHVybiAoX3JlZjEgPSB0aGlzLm5lc3RlZCkgIT0gbnVsbCA/IF9yZWYxLnVwZGF0ZShtb2RlbHMpIDogdm9pZCAwO1xuICAgIH1cbiAgfTtcblxuICBSaXZldHNbXCJwdWJsaWNcIl0uYmluZGVycy51bmxlc3MgPSB7XG4gICAgYmxvY2s6IHRydWUsXG4gICAgcHJpb3JpdHk6IDQwMDAsXG4gICAgYmluZDogZnVuY3Rpb24oZWwpIHtcbiAgICAgIHJldHVybiBSaXZldHNbXCJwdWJsaWNcIl0uYmluZGVyc1tcImlmXCJdLmJpbmQuY2FsbCh0aGlzLCBlbCk7XG4gICAgfSxcbiAgICB1bmJpbmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIFJpdmV0c1tcInB1YmxpY1wiXS5iaW5kZXJzW1wiaWZcIl0udW5iaW5kLmNhbGwodGhpcyk7XG4gICAgfSxcbiAgICByb3V0aW5lOiBmdW5jdGlvbihlbCwgdmFsdWUpIHtcbiAgICAgIHJldHVybiBSaXZldHNbXCJwdWJsaWNcIl0uYmluZGVyc1tcImlmXCJdLnJvdXRpbmUuY2FsbCh0aGlzLCBlbCwgIXZhbHVlKTtcbiAgICB9LFxuICAgIHVwZGF0ZTogZnVuY3Rpb24obW9kZWxzKSB7XG4gICAgICByZXR1cm4gUml2ZXRzW1wicHVibGljXCJdLmJpbmRlcnNbXCJpZlwiXS51cGRhdGUuY2FsbCh0aGlzLCBtb2RlbHMpO1xuICAgIH1cbiAgfTtcblxuICBSaXZldHNbXCJwdWJsaWNcIl0uYmluZGVyc1snb24tKiddID0ge1xuICAgIFwiZnVuY3Rpb25cIjogdHJ1ZSxcbiAgICBwcmlvcml0eTogMTAwMCxcbiAgICB1bmJpbmQ6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICBpZiAodGhpcy5oYW5kbGVyKSB7XG4gICAgICAgIHJldHVybiBSaXZldHMuVXRpbC51bmJpbmRFdmVudChlbCwgdGhpcy5hcmdzWzBdLCB0aGlzLmhhbmRsZXIpO1xuICAgICAgfVxuICAgIH0sXG4gICAgcm91dGluZTogZnVuY3Rpb24oZWwsIHZhbHVlKSB7XG4gICAgICBpZiAodGhpcy5oYW5kbGVyKSB7XG4gICAgICAgIFJpdmV0cy5VdGlsLnVuYmluZEV2ZW50KGVsLCB0aGlzLmFyZ3NbMF0sIHRoaXMuaGFuZGxlcik7XG4gICAgICB9XG4gICAgICByZXR1cm4gUml2ZXRzLlV0aWwuYmluZEV2ZW50KGVsLCB0aGlzLmFyZ3NbMF0sIHRoaXMuaGFuZGxlciA9IHRoaXMuZXZlbnRIYW5kbGVyKHZhbHVlKSk7XG4gICAgfVxuICB9O1xuXG4gIFJpdmV0c1tcInB1YmxpY1wiXS5iaW5kZXJzWydlYWNoLSonXSA9IHtcbiAgICBibG9jazogdHJ1ZSxcbiAgICBwcmlvcml0eTogNDAwMCxcbiAgICBiaW5kOiBmdW5jdGlvbihlbCkge1xuICAgICAgdmFyIGF0dHIsIHZpZXcsIF9pLCBfbGVuLCBfcmVmMTtcbiAgICAgIGlmICh0aGlzLm1hcmtlciA9PSBudWxsKSB7XG4gICAgICAgIGF0dHIgPSBbdGhpcy52aWV3LnByZWZpeCwgdGhpcy50eXBlXS5qb2luKCctJykucmVwbGFjZSgnLS0nLCAnLScpO1xuICAgICAgICB0aGlzLm1hcmtlciA9IGRvY3VtZW50LmNyZWF0ZUNvbW1lbnQoXCIgcml2ZXRzOiBcIiArIHRoaXMudHlwZSArIFwiIFwiKTtcbiAgICAgICAgdGhpcy5pdGVyYXRlZCA9IFtdO1xuICAgICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoYXR0cik7XG4gICAgICAgIGVsLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHRoaXMubWFya2VyLCBlbCk7XG4gICAgICAgIGVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgX3JlZjEgPSB0aGlzLml0ZXJhdGVkO1xuICAgICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYxLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgICAgdmlldyA9IF9yZWYxW19pXTtcbiAgICAgICAgICB2aWV3LmJpbmQoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgdW5iaW5kOiBmdW5jdGlvbihlbCkge1xuICAgICAgdmFyIHZpZXcsIF9pLCBfbGVuLCBfcmVmMTtcbiAgICAgIGlmICh0aGlzLml0ZXJhdGVkICE9IG51bGwpIHtcbiAgICAgICAgX3JlZjEgPSB0aGlzLml0ZXJhdGVkO1xuICAgICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYxLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgICAgdmlldyA9IF9yZWYxW19pXTtcbiAgICAgICAgICB2aWV3LnVuYmluZCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICByb3V0aW5lOiBmdW5jdGlvbihlbCwgY29sbGVjdGlvbikge1xuICAgICAgdmFyIGJpbmRpbmcsIGRhdGEsIGksIGluZGV4LCBrZXksIG1vZGVsLCBtb2RlbE5hbWUsIG9wdGlvbnMsIHByZXZpb3VzLCB0ZW1wbGF0ZSwgdmlldywgX2ksIF9qLCBfaywgX2xlbiwgX2xlbjEsIF9sZW4yLCBfcmVmMSwgX3JlZjIsIF9yZWYzO1xuICAgICAgbW9kZWxOYW1lID0gdGhpcy5hcmdzWzBdO1xuICAgICAgY29sbGVjdGlvbiA9IGNvbGxlY3Rpb24gfHwgW107XG4gICAgICBpZiAodGhpcy5pdGVyYXRlZC5sZW5ndGggPiBjb2xsZWN0aW9uLmxlbmd0aCkge1xuICAgICAgICBfcmVmMSA9IEFycmF5KHRoaXMuaXRlcmF0ZWQubGVuZ3RoIC0gY29sbGVjdGlvbi5sZW5ndGgpO1xuICAgICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYxLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgICAgaSA9IF9yZWYxW19pXTtcbiAgICAgICAgICB2aWV3ID0gdGhpcy5pdGVyYXRlZC5wb3AoKTtcbiAgICAgICAgICB2aWV3LnVuYmluZCgpO1xuICAgICAgICAgIHRoaXMubWFya2VyLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodmlldy5lbHNbMF0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBmb3IgKGluZGV4ID0gX2ogPSAwLCBfbGVuMSA9IGNvbGxlY3Rpb24ubGVuZ3RoOyBfaiA8IF9sZW4xOyBpbmRleCA9ICsrX2opIHtcbiAgICAgICAgbW9kZWwgPSBjb2xsZWN0aW9uW2luZGV4XTtcbiAgICAgICAgZGF0YSA9IHtcbiAgICAgICAgICBpbmRleDogaW5kZXhcbiAgICAgICAgfTtcbiAgICAgICAgZGF0YVtSaXZldHNbXCJwdWJsaWNcIl0uaXRlcmF0aW9uQWxpYXMobW9kZWxOYW1lKV0gPSBpbmRleDtcbiAgICAgICAgZGF0YVttb2RlbE5hbWVdID0gbW9kZWw7XG4gICAgICAgIGlmICh0aGlzLml0ZXJhdGVkW2luZGV4XSA9PSBudWxsKSB7XG4gICAgICAgICAgX3JlZjIgPSB0aGlzLnZpZXcubW9kZWxzO1xuICAgICAgICAgIGZvciAoa2V5IGluIF9yZWYyKSB7XG4gICAgICAgICAgICBtb2RlbCA9IF9yZWYyW2tleV07XG4gICAgICAgICAgICBpZiAoZGF0YVtrZXldID09IG51bGwpIHtcbiAgICAgICAgICAgICAgZGF0YVtrZXldID0gbW9kZWw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHByZXZpb3VzID0gdGhpcy5pdGVyYXRlZC5sZW5ndGggPyB0aGlzLml0ZXJhdGVkW3RoaXMuaXRlcmF0ZWQubGVuZ3RoIC0gMV0uZWxzWzBdIDogdGhpcy5tYXJrZXI7XG4gICAgICAgICAgb3B0aW9ucyA9IHRoaXMudmlldy5vcHRpb25zKCk7XG4gICAgICAgICAgb3B0aW9ucy5wcmVsb2FkRGF0YSA9IHRydWU7XG4gICAgICAgICAgdGVtcGxhdGUgPSBlbC5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICAgICAgdmlldyA9IG5ldyBSaXZldHMuVmlldyh0ZW1wbGF0ZSwgZGF0YSwgb3B0aW9ucyk7XG4gICAgICAgICAgdmlldy5iaW5kKCk7XG4gICAgICAgICAgdGhpcy5pdGVyYXRlZC5wdXNoKHZpZXcpO1xuICAgICAgICAgIHRoaXMubWFya2VyLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHRlbXBsYXRlLCBwcmV2aW91cy5uZXh0U2libGluZyk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5pdGVyYXRlZFtpbmRleF0ubW9kZWxzW21vZGVsTmFtZV0gIT09IG1vZGVsKSB7XG4gICAgICAgICAgdGhpcy5pdGVyYXRlZFtpbmRleF0udXBkYXRlKGRhdGEpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoZWwubm9kZU5hbWUgPT09ICdPUFRJT04nKSB7XG4gICAgICAgIF9yZWYzID0gdGhpcy52aWV3LmJpbmRpbmdzO1xuICAgICAgICBmb3IgKF9rID0gMCwgX2xlbjIgPSBfcmVmMy5sZW5ndGg7IF9rIDwgX2xlbjI7IF9rKyspIHtcbiAgICAgICAgICBiaW5kaW5nID0gX3JlZjNbX2tdO1xuICAgICAgICAgIGlmIChiaW5kaW5nLmVsID09PSB0aGlzLm1hcmtlci5wYXJlbnROb2RlICYmIGJpbmRpbmcudHlwZSA9PT0gJ3ZhbHVlJykge1xuICAgICAgICAgICAgYmluZGluZy5zeW5jKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICB1cGRhdGU6IGZ1bmN0aW9uKG1vZGVscykge1xuICAgICAgdmFyIGRhdGEsIGtleSwgbW9kZWwsIHZpZXcsIF9pLCBfbGVuLCBfcmVmMTtcbiAgICAgIGRhdGEgPSB7fTtcbiAgICAgIGZvciAoa2V5IGluIG1vZGVscykge1xuICAgICAgICBtb2RlbCA9IG1vZGVsc1trZXldO1xuICAgICAgICBpZiAoa2V5ICE9PSB0aGlzLmFyZ3NbMF0pIHtcbiAgICAgICAgICBkYXRhW2tleV0gPSBtb2RlbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgX3JlZjEgPSB0aGlzLml0ZXJhdGVkO1xuICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmMS5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICB2aWV3ID0gX3JlZjFbX2ldO1xuICAgICAgICB2aWV3LnVwZGF0ZShkYXRhKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgUml2ZXRzW1wicHVibGljXCJdLmJpbmRlcnNbJ2NsYXNzLSonXSA9IGZ1bmN0aW9uKGVsLCB2YWx1ZSkge1xuICAgIHZhciBlbENsYXNzO1xuICAgIGVsQ2xhc3MgPSBcIiBcIiArIGVsLmNsYXNzTmFtZSArIFwiIFwiO1xuICAgIGlmICghdmFsdWUgPT09IChlbENsYXNzLmluZGV4T2YoXCIgXCIgKyB0aGlzLmFyZ3NbMF0gKyBcIiBcIikgIT09IC0xKSkge1xuICAgICAgcmV0dXJuIGVsLmNsYXNzTmFtZSA9IHZhbHVlID8gXCJcIiArIGVsLmNsYXNzTmFtZSArIFwiIFwiICsgdGhpcy5hcmdzWzBdIDogZWxDbGFzcy5yZXBsYWNlKFwiIFwiICsgdGhpcy5hcmdzWzBdICsgXCIgXCIsICcgJykudHJpbSgpO1xuICAgIH1cbiAgfTtcblxuICBSaXZldHNbXCJwdWJsaWNcIl0uYmluZGVyc1snKiddID0gZnVuY3Rpb24oZWwsIHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBlbC5zZXRBdHRyaWJ1dGUodGhpcy50eXBlLCB2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBlbC5yZW1vdmVBdHRyaWJ1dGUodGhpcy50eXBlKTtcbiAgICB9XG4gIH07XG5cbiAgUml2ZXRzW1wicHVibGljXCJdLmZvcm1hdHRlcnNbJ2NhbGwnXSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcmdzLCB2YWx1ZTtcbiAgICB2YWx1ZSA9IGFyZ3VtZW50c1swXSwgYXJncyA9IDIgPD0gYXJndW1lbnRzLmxlbmd0aCA/IF9fc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpIDogW107XG4gICAgcmV0dXJuIHZhbHVlLmNhbGwuYXBwbHkodmFsdWUsIFt0aGlzXS5jb25jYXQoX19zbGljZS5jYWxsKGFyZ3MpKSk7XG4gIH07XG5cbiAgUml2ZXRzW1wicHVibGljXCJdLmFkYXB0ZXJzWycuJ10gPSB7XG4gICAgaWQ6ICdfcnYnLFxuICAgIGNvdW50ZXI6IDAsXG4gICAgd2Vha21hcDoge30sXG4gICAgd2Vha1JlZmVyZW5jZTogZnVuY3Rpb24ob2JqKSB7XG4gICAgICB2YXIgaWQsIF9iYXNlLCBfbmFtZTtcbiAgICAgIGlmICghb2JqLmhhc093blByb3BlcnR5KHRoaXMuaWQpKSB7XG4gICAgICAgIGlkID0gdGhpcy5jb3VudGVyKys7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIHRoaXMuaWQsIHtcbiAgICAgICAgICB2YWx1ZTogaWRcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gKF9iYXNlID0gdGhpcy53ZWFrbWFwKVtfbmFtZSA9IG9ialt0aGlzLmlkXV0gfHwgKF9iYXNlW19uYW1lXSA9IHtcbiAgICAgICAgY2FsbGJhY2tzOiB7fVxuICAgICAgfSk7XG4gICAgfSxcbiAgICBjbGVhbnVwV2Vha1JlZmVyZW5jZTogZnVuY3Rpb24ocmVmLCBpZCkge1xuICAgICAgaWYgKCFPYmplY3Qua2V5cyhyZWYuY2FsbGJhY2tzKS5sZW5ndGgpIHtcbiAgICAgICAgaWYgKCEocmVmLnBvaW50ZXJzICYmIE9iamVjdC5rZXlzKHJlZi5wb2ludGVycykubGVuZ3RoKSkge1xuICAgICAgICAgIHJldHVybiBkZWxldGUgdGhpcy53ZWFrbWFwW2lkXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgc3R1YkZ1bmN0aW9uOiBmdW5jdGlvbihvYmosIGZuKSB7XG4gICAgICB2YXIgbWFwLCBvcmlnaW5hbCwgd2Vha21hcDtcbiAgICAgIG9yaWdpbmFsID0gb2JqW2ZuXTtcbiAgICAgIG1hcCA9IHRoaXMud2Vha1JlZmVyZW5jZShvYmopO1xuICAgICAgd2Vha21hcCA9IHRoaXMud2Vha21hcDtcbiAgICAgIHJldHVybiBvYmpbZm5dID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBjYWxsYmFjaywgaywgciwgcmVzcG9uc2UsIF9pLCBfbGVuLCBfcmVmMSwgX3JlZjIsIF9yZWYzLCBfcmVmNDtcbiAgICAgICAgcmVzcG9uc2UgPSBvcmlnaW5hbC5hcHBseShvYmosIGFyZ3VtZW50cyk7XG4gICAgICAgIF9yZWYxID0gbWFwLnBvaW50ZXJzO1xuICAgICAgICBmb3IgKHIgaW4gX3JlZjEpIHtcbiAgICAgICAgICBrID0gX3JlZjFbcl07XG4gICAgICAgICAgX3JlZjQgPSAoX3JlZjIgPSAoX3JlZjMgPSB3ZWFrbWFwW3JdKSAhPSBudWxsID8gX3JlZjMuY2FsbGJhY2tzW2tdIDogdm9pZCAwKSAhPSBudWxsID8gX3JlZjIgOiBbXTtcbiAgICAgICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWY0Lmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgICAgICBjYWxsYmFjayA9IF9yZWY0W19pXTtcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgIH07XG4gICAgfSxcbiAgICBvYnNlcnZlTXV0YXRpb25zOiBmdW5jdGlvbihvYmosIHJlZiwga2V5cGF0aCkge1xuICAgICAgdmFyIGZuLCBmdW5jdGlvbnMsIG1hcCwgX2Jhc2UsIF9pLCBfbGVuO1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkob2JqKSkge1xuICAgICAgICBtYXAgPSB0aGlzLndlYWtSZWZlcmVuY2Uob2JqKTtcbiAgICAgICAgaWYgKG1hcC5wb2ludGVycyA9PSBudWxsKSB7XG4gICAgICAgICAgbWFwLnBvaW50ZXJzID0ge307XG4gICAgICAgICAgZnVuY3Rpb25zID0gWydwdXNoJywgJ3BvcCcsICdzaGlmdCcsICd1bnNoaWZ0JywgJ3NvcnQnLCAncmV2ZXJzZScsICdzcGxpY2UnXTtcbiAgICAgICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IGZ1bmN0aW9ucy5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICAgICAgZm4gPSBmdW5jdGlvbnNbX2ldO1xuICAgICAgICAgICAgdGhpcy5zdHViRnVuY3Rpb24ob2JqLCBmbik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICgoX2Jhc2UgPSBtYXAucG9pbnRlcnMpW3JlZl0gPT0gbnVsbCkge1xuICAgICAgICAgIF9iYXNlW3JlZl0gPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoX19pbmRleE9mLmNhbGwobWFwLnBvaW50ZXJzW3JlZl0sIGtleXBhdGgpIDwgMCkge1xuICAgICAgICAgIHJldHVybiBtYXAucG9pbnRlcnNbcmVmXS5wdXNoKGtleXBhdGgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICB1bm9ic2VydmVNdXRhdGlvbnM6IGZ1bmN0aW9uKG9iaiwgcmVmLCBrZXlwYXRoKSB7XG4gICAgICB2YXIgaWR4LCBtYXAsIHBvaW50ZXJzO1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkob2JqKSAmJiAob2JqW3RoaXMuaWRdICE9IG51bGwpKSB7XG4gICAgICAgIGlmIChtYXAgPSB0aGlzLndlYWttYXBbb2JqW3RoaXMuaWRdXSkge1xuICAgICAgICAgIGlmIChwb2ludGVycyA9IG1hcC5wb2ludGVyc1tyZWZdKSB7XG4gICAgICAgICAgICBpZiAoKGlkeCA9IHBvaW50ZXJzLmluZGV4T2Yoa2V5cGF0aCkpID49IDApIHtcbiAgICAgICAgICAgICAgcG9pbnRlcnMuc3BsaWNlKGlkeCwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXBvaW50ZXJzLmxlbmd0aCkge1xuICAgICAgICAgICAgICBkZWxldGUgbWFwLnBvaW50ZXJzW3JlZl07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jbGVhbnVwV2Vha1JlZmVyZW5jZShtYXAsIG9ialt0aGlzLmlkXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBvYnNlcnZlOiBmdW5jdGlvbihvYmosIGtleXBhdGgsIGNhbGxiYWNrKSB7XG4gICAgICB2YXIgY2FsbGJhY2tzLCBkZXNjLCB2YWx1ZTtcbiAgICAgIGNhbGxiYWNrcyA9IHRoaXMud2Vha1JlZmVyZW5jZShvYmopLmNhbGxiYWNrcztcbiAgICAgIGlmIChjYWxsYmFja3Nba2V5cGF0aF0gPT0gbnVsbCkge1xuICAgICAgICBjYWxsYmFja3Nba2V5cGF0aF0gPSBbXTtcbiAgICAgICAgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqLCBrZXlwYXRoKTtcbiAgICAgICAgaWYgKCEoKGRlc2MgIT0gbnVsbCA/IGRlc2MuZ2V0IDogdm9pZCAwKSB8fCAoZGVzYyAhPSBudWxsID8gZGVzYy5zZXQgOiB2b2lkIDApKSkge1xuICAgICAgICAgIHZhbHVlID0gb2JqW2tleXBhdGhdO1xuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleXBhdGgsIHtcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OiAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKG5ld1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNiLCBtYXAsIF9pLCBfbGVuLCBfcmVmMTtcbiAgICAgICAgICAgICAgICBpZiAobmV3VmFsdWUgIT09IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICBfdGhpcy51bm9ic2VydmVNdXRhdGlvbnModmFsdWUsIG9ialtfdGhpcy5pZF0sIGtleXBhdGgpO1xuICAgICAgICAgICAgICAgICAgdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICAgICAgICAgICAgICAgIGlmIChtYXAgPSBfdGhpcy53ZWFrbWFwW29ialtfdGhpcy5pZF1dKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrcyA9IG1hcC5jYWxsYmFja3M7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjYWxsYmFja3Nba2V5cGF0aF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICBfcmVmMSA9IGNhbGxiYWNrc1trZXlwYXRoXS5zbGljZSgpO1xuICAgICAgICAgICAgICAgICAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZjEubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNiID0gX3JlZjFbX2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKF9faW5kZXhPZi5jYWxsKGNhbGxiYWNrc1trZXlwYXRoXSwgY2IpID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY2IoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF90aGlzLm9ic2VydmVNdXRhdGlvbnMobmV3VmFsdWUsIG9ialtfdGhpcy5pZF0sIGtleXBhdGgpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pKHRoaXMpXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChfX2luZGV4T2YuY2FsbChjYWxsYmFja3Nba2V5cGF0aF0sIGNhbGxiYWNrKSA8IDApIHtcbiAgICAgICAgY2FsbGJhY2tzW2tleXBhdGhdLnB1c2goY2FsbGJhY2spO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMub2JzZXJ2ZU11dGF0aW9ucyhvYmpba2V5cGF0aF0sIG9ialt0aGlzLmlkXSwga2V5cGF0aCk7XG4gICAgfSxcbiAgICB1bm9ic2VydmU6IGZ1bmN0aW9uKG9iaiwga2V5cGF0aCwgY2FsbGJhY2spIHtcbiAgICAgIHZhciBjYWxsYmFja3MsIGlkeCwgbWFwO1xuICAgICAgaWYgKG1hcCA9IHRoaXMud2Vha21hcFtvYmpbdGhpcy5pZF1dKSB7XG4gICAgICAgIGlmIChjYWxsYmFja3MgPSBtYXAuY2FsbGJhY2tzW2tleXBhdGhdKSB7XG4gICAgICAgICAgaWYgKChpZHggPSBjYWxsYmFja3MuaW5kZXhPZihjYWxsYmFjaykpID49IDApIHtcbiAgICAgICAgICAgIGNhbGxiYWNrcy5zcGxpY2UoaWR4LCAxKTtcbiAgICAgICAgICAgIGlmICghY2FsbGJhY2tzLmxlbmd0aCkge1xuICAgICAgICAgICAgICBkZWxldGUgbWFwLmNhbGxiYWNrc1trZXlwYXRoXTtcbiAgICAgICAgICAgICAgdGhpcy51bm9ic2VydmVNdXRhdGlvbnMob2JqW2tleXBhdGhdLCBvYmpbdGhpcy5pZF0sIGtleXBhdGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdGhpcy5jbGVhbnVwV2Vha1JlZmVyZW5jZShtYXAsIG9ialt0aGlzLmlkXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIGdldDogZnVuY3Rpb24ob2JqLCBrZXlwYXRoKSB7XG4gICAgICByZXR1cm4gb2JqW2tleXBhdGhdO1xuICAgIH0sXG4gICAgc2V0OiBmdW5jdGlvbihvYmosIGtleXBhdGgsIHZhbHVlKSB7XG4gICAgICByZXR1cm4gb2JqW2tleXBhdGhdID0gdmFsdWU7XG4gICAgfVxuICB9O1xuXG4gIFJpdmV0cy5mYWN0b3J5ID0gZnVuY3Rpb24oc2lnaHRnbGFzcykge1xuICAgIFJpdmV0cy5zaWdodGdsYXNzID0gc2lnaHRnbGFzcztcbiAgICBSaXZldHNbXCJwdWJsaWNcIl0uXyA9IFJpdmV0cztcbiAgICByZXR1cm4gUml2ZXRzW1wicHVibGljXCJdO1xuICB9O1xuXG4gIGlmICh0eXBlb2YgKHR5cGVvZiBtb2R1bGUgIT09IFwidW5kZWZpbmVkXCIgJiYgbW9kdWxlICE9PSBudWxsID8gbW9kdWxlLmV4cG9ydHMgOiB2b2lkIDApID09PSAnb2JqZWN0Jykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gUml2ZXRzLmZhY3RvcnkocmVxdWlyZSgnc2lnaHRnbGFzcycpKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoWydzaWdodGdsYXNzJ10sIGZ1bmN0aW9uKHNpZ2h0Z2xhc3MpIHtcbiAgICAgIHJldHVybiB0aGlzLnJpdmV0cyA9IFJpdmV0cy5mYWN0b3J5KHNpZ2h0Z2xhc3MpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHRoaXMucml2ZXRzID0gUml2ZXRzLmZhY3Rvcnkoc2lnaHRnbGFzcyk7XG4gIH1cblxufSkuY2FsbCh0aGlzKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgLy8gUHVibGljIHNpZ2h0Z2xhc3MgaW50ZXJmYWNlLlxuICBmdW5jdGlvbiBzaWdodGdsYXNzKG9iaiwga2V5cGF0aCwgY2FsbGJhY2ssIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gbmV3IE9ic2VydmVyKG9iaiwga2V5cGF0aCwgY2FsbGJhY2ssIG9wdGlvbnMpXG4gIH1cblxuICAvLyBCYXR0ZXJpZXMgbm90IGluY2x1ZGVkLlxuICBzaWdodGdsYXNzLmFkYXB0ZXJzID0ge31cblxuICAvLyBDb25zdHJ1Y3RzIGEgbmV3IGtleXBhdGggb2JzZXJ2ZXIgYW5kIGtpY2tzIHRoaW5ncyBvZmYuXG4gIGZ1bmN0aW9uIE9ic2VydmVyKG9iaiwga2V5cGF0aCwgY2FsbGJhY2ssIG9wdGlvbnMpIHtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XG4gICAgdGhpcy5vcHRpb25zLmFkYXB0ZXJzID0gdGhpcy5vcHRpb25zLmFkYXB0ZXJzIHx8IHt9XG4gICAgdGhpcy5vYmogPSBvYmpcbiAgICB0aGlzLmtleXBhdGggPSBrZXlwYXRoXG4gICAgdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrXG4gICAgdGhpcy5vYmplY3RQYXRoID0gW11cbiAgICB0aGlzLnVwZGF0ZSA9IHRoaXMudXBkYXRlLmJpbmQodGhpcylcbiAgICB0aGlzLnBhcnNlKClcblxuICAgIGlmIChpc09iamVjdCh0aGlzLnRhcmdldCA9IHRoaXMucmVhbGl6ZSgpKSkge1xuICAgICAgdGhpcy5zZXQodHJ1ZSwgdGhpcy5rZXksIHRoaXMudGFyZ2V0LCB0aGlzLmNhbGxiYWNrKVxuICAgIH1cbiAgfVxuXG4gIC8vIFRva2VuaXplcyB0aGUgcHJvdmlkZWQga2V5cGF0aCBzdHJpbmcgaW50byBpbnRlcmZhY2UgKyBwYXRoIHRva2VucyBmb3IgdGhlXG4gIC8vIG9ic2VydmVyIHRvIHdvcmsgd2l0aC5cbiAgT2JzZXJ2ZXIudG9rZW5pemUgPSBmdW5jdGlvbihrZXlwYXRoLCBpbnRlcmZhY2VzLCByb290KSB7XG4gICAgdmFyIHRva2VucyA9IFtdXG4gICAgdmFyIGN1cnJlbnQgPSB7aTogcm9vdCwgcGF0aDogJyd9XG4gICAgdmFyIGluZGV4LCBjaHJcblxuICAgIGZvciAoaW5kZXggPSAwOyBpbmRleCA8IGtleXBhdGgubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICBjaHIgPSBrZXlwYXRoLmNoYXJBdChpbmRleClcblxuICAgICAgaWYgKCEhfmludGVyZmFjZXMuaW5kZXhPZihjaHIpKSB7XG4gICAgICAgIHRva2Vucy5wdXNoKGN1cnJlbnQpXG4gICAgICAgIGN1cnJlbnQgPSB7aTogY2hyLCBwYXRoOiAnJ31cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGN1cnJlbnQucGF0aCArPSBjaHJcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0b2tlbnMucHVzaChjdXJyZW50KVxuICAgIHJldHVybiB0b2tlbnNcbiAgfVxuXG4gIC8vIFBhcnNlcyB0aGUga2V5cGF0aCB1c2luZyB0aGUgaW50ZXJmYWNlcyBkZWZpbmVkIG9uIHRoZSB2aWV3LiBTZXRzIHZhcmlhYmxlc1xuICAvLyBmb3IgdGhlIHRva2VuaXplZCBrZXlwYXRoIGFzIHdlbGwgYXMgdGhlIGVuZCBrZXkuXG4gIE9ic2VydmVyLnByb3RvdHlwZS5wYXJzZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpbnRlcmZhY2VzID0gdGhpcy5pbnRlcmZhY2VzKClcbiAgICB2YXIgcm9vdCwgcGF0aFxuXG4gICAgaWYgKCFpbnRlcmZhY2VzLmxlbmd0aCkge1xuICAgICAgZXJyb3IoJ011c3QgZGVmaW5lIGF0IGxlYXN0IG9uZSBhZGFwdGVyIGludGVyZmFjZS4nKVxuICAgIH1cblxuICAgIGlmICghIX5pbnRlcmZhY2VzLmluZGV4T2YodGhpcy5rZXlwYXRoWzBdKSkge1xuICAgICAgcm9vdCA9IHRoaXMua2V5cGF0aFswXVxuICAgICAgcGF0aCA9IHRoaXMua2V5cGF0aC5zdWJzdHIoMSlcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHR5cGVvZiAocm9vdCA9IHRoaXMub3B0aW9ucy5yb290IHx8IHNpZ2h0Z2xhc3Mucm9vdCkgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGVycm9yKCdNdXN0IGRlZmluZSBhIGRlZmF1bHQgcm9vdCBhZGFwdGVyLicpXG4gICAgICB9XG5cbiAgICAgIHBhdGggPSB0aGlzLmtleXBhdGhcbiAgICB9XG5cbiAgICB0aGlzLnRva2VucyA9IE9ic2VydmVyLnRva2VuaXplKHBhdGgsIGludGVyZmFjZXMsIHJvb3QpXG4gICAgdGhpcy5rZXkgPSB0aGlzLnRva2Vucy5wb3AoKVxuICB9XG5cbiAgLy8gUmVhbGl6ZXMgdGhlIGZ1bGwga2V5cGF0aCwgYXR0YWNoaW5nIG9ic2VydmVycyBmb3IgZXZlcnkga2V5IGFuZCBjb3JyZWN0aW5nXG4gIC8vIG9sZCBvYnNlcnZlcnMgdG8gYW55IGNoYW5nZWQgb2JqZWN0cyBpbiB0aGUga2V5cGF0aC5cbiAgT2JzZXJ2ZXIucHJvdG90eXBlLnJlYWxpemUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgY3VycmVudCA9IHRoaXMub2JqXG4gICAgdmFyIHVucmVhY2hlZCA9IGZhbHNlXG4gICAgdmFyIHByZXZcblxuICAgIHRoaXMudG9rZW5zLmZvckVhY2goZnVuY3Rpb24odG9rZW4sIGluZGV4KSB7XG4gICAgICBpZiAoaXNPYmplY3QoY3VycmVudCkpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLm9iamVjdFBhdGhbaW5kZXhdICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIGlmIChjdXJyZW50ICE9PSAocHJldiA9IHRoaXMub2JqZWN0UGF0aFtpbmRleF0pKSB7XG4gICAgICAgICAgICB0aGlzLnNldChmYWxzZSwgdG9rZW4sIHByZXYsIHRoaXMudXBkYXRlKVxuICAgICAgICAgICAgdGhpcy5zZXQodHJ1ZSwgdG9rZW4sIGN1cnJlbnQsIHRoaXMudXBkYXRlKVxuICAgICAgICAgICAgdGhpcy5vYmplY3RQYXRoW2luZGV4XSA9IGN1cnJlbnRcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5zZXQodHJ1ZSwgdG9rZW4sIGN1cnJlbnQsIHRoaXMudXBkYXRlKVxuICAgICAgICAgIHRoaXMub2JqZWN0UGF0aFtpbmRleF0gPSBjdXJyZW50XG4gICAgICAgIH1cblxuICAgICAgICBjdXJyZW50ID0gdGhpcy5nZXQodG9rZW4sIGN1cnJlbnQpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodW5yZWFjaGVkID09PSBmYWxzZSkge1xuICAgICAgICAgIHVucmVhY2hlZCA9IGluZGV4XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocHJldiA9IHRoaXMub2JqZWN0UGF0aFtpbmRleF0pIHtcbiAgICAgICAgICB0aGlzLnNldChmYWxzZSwgdG9rZW4sIHByZXYsIHRoaXMudXBkYXRlKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwgdGhpcylcblxuICAgIGlmICh1bnJlYWNoZWQgIT09IGZhbHNlKSB7XG4gICAgICB0aGlzLm9iamVjdFBhdGguc3BsaWNlKHVucmVhY2hlZClcbiAgICB9XG5cbiAgICByZXR1cm4gY3VycmVudFxuICB9XG5cbiAgLy8gVXBkYXRlcyB0aGUga2V5cGF0aC4gVGhpcyBpcyBjYWxsZWQgd2hlbiBhbnkgaW50ZXJtZWRpYXJ5IGtleSBpcyBjaGFuZ2VkLlxuICBPYnNlcnZlci5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIG5leHQsIG9sZFZhbHVlXG5cbiAgICBpZiAoKG5leHQgPSB0aGlzLnJlYWxpemUoKSkgIT09IHRoaXMudGFyZ2V0KSB7XG4gICAgICBpZiAoaXNPYmplY3QodGhpcy50YXJnZXQpKSB7XG4gICAgICAgIHRoaXMuc2V0KGZhbHNlLCB0aGlzLmtleSwgdGhpcy50YXJnZXQsIHRoaXMuY2FsbGJhY2spXG4gICAgICB9XG5cbiAgICAgIGlmIChpc09iamVjdChuZXh0KSkge1xuICAgICAgICB0aGlzLnNldCh0cnVlLCB0aGlzLmtleSwgbmV4dCwgdGhpcy5jYWxsYmFjaylcbiAgICAgIH1cblxuICAgICAgb2xkVmFsdWUgPSB0aGlzLnZhbHVlKClcbiAgICAgIHRoaXMudGFyZ2V0ID0gbmV4dFxuXG4gICAgICAvLyBBbHdheXMgY2FsbCBjYWxsYmFjayBpZiB2YWx1ZSBpcyBhIGZ1bmN0aW9uLiBJZiBub3QgYSBmdW5jdGlvbiwgY2FsbCBjYWxsYmFjayBvbmx5IGlmIHZhbHVlIGNoYW5nZWRcbiAgICAgIGlmICh0aGlzLnZhbHVlKCkgaW5zdGFuY2VvZiBGdW5jdGlvbiB8fCB0aGlzLnZhbHVlKCkgIT09IG9sZFZhbHVlKSB0aGlzLmNhbGxiYWNrKClcbiAgICB9XG4gIH1cblxuICAvLyBSZWFkcyB0aGUgY3VycmVudCBlbmQgdmFsdWUgb2YgdGhlIG9ic2VydmVkIGtleXBhdGguIFJldHVybnMgdW5kZWZpbmVkIGlmXG4gIC8vIHRoZSBmdWxsIGtleXBhdGggaXMgdW5yZWFjaGFibGUuXG4gIE9ic2VydmVyLnByb3RvdHlwZS52YWx1ZSA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChpc09iamVjdCh0aGlzLnRhcmdldCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldCh0aGlzLmtleSwgdGhpcy50YXJnZXQpXG4gICAgfVxuICB9XG5cbiAgLy8gU2V0cyB0aGUgY3VycmVudCBlbmQgdmFsdWUgb2YgdGhlIG9ic2VydmVkIGtleXBhdGguIENhbGxpbmcgc2V0VmFsdWUgd2hlblxuICAvLyB0aGUgZnVsbCBrZXlwYXRoIGlzIHVucmVhY2hhYmxlIGlzIGEgbm8tb3AuXG4gIE9ic2VydmVyLnByb3RvdHlwZS5zZXRWYWx1ZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgaWYgKGlzT2JqZWN0KHRoaXMudGFyZ2V0KSkge1xuICAgICAgdGhpcy5hZGFwdGVyKHRoaXMua2V5KS5zZXQodGhpcy50YXJnZXQsIHRoaXMua2V5LnBhdGgsIHZhbHVlKVxuICAgIH1cbiAgfVxuXG4gIC8vIEdldHMgdGhlIHByb3ZpZGVkIGtleSBvbiBhbiBvYmplY3QuXG4gIE9ic2VydmVyLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbihrZXksIG9iaikge1xuICAgIHJldHVybiB0aGlzLmFkYXB0ZXIoa2V5KS5nZXQob2JqLCBrZXkucGF0aClcbiAgfVxuXG4gIC8vIE9ic2VydmVzIG9yIHVub2JzZXJ2ZXMgYSBjYWxsYmFjayBvbiB0aGUgb2JqZWN0IHVzaW5nIHRoZSBwcm92aWRlZCBrZXkuXG4gIE9ic2VydmVyLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbihhY3RpdmUsIGtleSwgb2JqLCBjYWxsYmFjaykge1xuICAgIHZhciBhY3Rpb24gPSBhY3RpdmUgPyAnb2JzZXJ2ZScgOiAndW5vYnNlcnZlJ1xuICAgIHRoaXMuYWRhcHRlcihrZXkpW2FjdGlvbl0ob2JqLCBrZXkucGF0aCwgY2FsbGJhY2spXG4gIH1cblxuICAvLyBSZXR1cm5zIGFuIGFycmF5IG9mIGFsbCB1bmlxdWUgYWRhcHRlciBpbnRlcmZhY2VzIGF2YWlsYWJsZS5cbiAgT2JzZXJ2ZXIucHJvdG90eXBlLmludGVyZmFjZXMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaW50ZXJmYWNlcyA9IE9iamVjdC5rZXlzKHRoaXMub3B0aW9ucy5hZGFwdGVycylcblxuICAgIE9iamVjdC5rZXlzKHNpZ2h0Z2xhc3MuYWRhcHRlcnMpLmZvckVhY2goZnVuY3Rpb24oaSkge1xuICAgICAgaWYgKCF+aW50ZXJmYWNlcy5pbmRleE9mKGkpKSB7XG4gICAgICAgIGludGVyZmFjZXMucHVzaChpKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICByZXR1cm4gaW50ZXJmYWNlc1xuICB9XG5cbiAgLy8gQ29udmVuaWVuY2UgZnVuY3Rpb24gdG8gZ3JhYiB0aGUgYWRhcHRlciBmb3IgYSBzcGVjaWZpYyBrZXkuXG4gIE9ic2VydmVyLnByb3RvdHlwZS5hZGFwdGVyID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucy5hZGFwdGVyc1trZXkuaV0gfHxcbiAgICAgIHNpZ2h0Z2xhc3MuYWRhcHRlcnNba2V5LmldXG4gIH1cblxuICAvLyBVbm9ic2VydmVzIHRoZSBlbnRpcmUga2V5cGF0aC5cbiAgT2JzZXJ2ZXIucHJvdG90eXBlLnVub2JzZXJ2ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBvYmpcblxuICAgIHRoaXMudG9rZW5zLmZvckVhY2goZnVuY3Rpb24odG9rZW4sIGluZGV4KSB7XG4gICAgICBpZiAob2JqID0gdGhpcy5vYmplY3RQYXRoW2luZGV4XSkge1xuICAgICAgICB0aGlzLnNldChmYWxzZSwgdG9rZW4sIG9iaiwgdGhpcy51cGRhdGUpXG4gICAgICB9XG4gICAgfSwgdGhpcylcblxuICAgIGlmIChpc09iamVjdCh0aGlzLnRhcmdldCkpIHtcbiAgICAgIHRoaXMuc2V0KGZhbHNlLCB0aGlzLmtleSwgdGhpcy50YXJnZXQsIHRoaXMuY2FsbGJhY2spXG4gICAgfVxuICB9XG5cbiAgLy8gQ2hlY2sgaWYgYSB2YWx1ZSBpcyBhbiBvYmplY3QgdGhhbiBjYW4gYmUgb2JzZXJ2ZWQuXG4gIGZ1bmN0aW9uIGlzT2JqZWN0KG9iaikge1xuICAgIHJldHVybiB0eXBlb2Ygb2JqID09PSAnb2JqZWN0JyAmJiBvYmogIT09IG51bGxcbiAgfVxuXG4gIC8vIEVycm9yIHRocm93ZXIuXG4gIGZ1bmN0aW9uIGVycm9yKG1lc3NhZ2UpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1tzaWdodGdsYXNzXSAnICsgbWVzc2FnZSlcbiAgfVxuXG4gIC8vIEV4cG9ydCBtb2R1bGUgZm9yIE5vZGUgYW5kIHRoZSBicm93c2VyLlxuICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHNpZ2h0Z2xhc3NcbiAgfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoW10sIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuc2lnaHRnbGFzcyA9IHNpZ2h0Z2xhc3NcbiAgICB9KVxuICB9IGVsc2Uge1xuICAgIHRoaXMuc2lnaHRnbGFzcyA9IHNpZ2h0Z2xhc3NcbiAgfVxufSkuY2FsbCh0aGlzKTtcbiIsIid1c2Ugc3RyaWN0Jztcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHN0cikge1xuXHRyZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHN0cikucmVwbGFjZSgvWyEnKCkqXS9nLCBmdW5jdGlvbiAoYykge1xuXHRcdHJldHVybiAnJScgKyBjLmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCk7XG5cdH0pO1xufTtcbiJdfQ==
