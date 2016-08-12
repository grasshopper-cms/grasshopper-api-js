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

function handlePluginCheck(event, context) {
    context.plugin.workingType = context.plugin.active ? 'Activating' : 'Deactivating'; // Reversed because rivets has allready set the value;
    context.plugin.isWorking = true;

    window.gh.api.plugins.activate(context.plugin.id)
        .then(function() {
            context.plugin.isWorking = false;
        })
        .catch(function() {
            context.plugin.isWorking = false;
            context.plugin.active = !context.plugin.active;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy5udm0vdmVyc2lvbnMvbm9kZS92NS4wLjAvbGliL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjbGllbnQuanMiLCJub2RlX21vZHVsZXMvZG9tcmVhZHkvcmVhZHkuanMiLCJub2RlX21vZHVsZXMvb2JqZWN0LWFzc2lnbi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9xdWVyeS1zdHJpbmcvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcml2ZXRzL2Rpc3Qvcml2ZXRzLmpzIiwibm9kZV9tb2R1bGVzL3NpZ2h0Z2xhc3MvaW5kZXguanMiLCJub2RlX21vZHVsZXMvc3RyaWN0LXVyaS1lbmNvZGUvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5M0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdE5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxudmFyIHJpdmV0cyA9IHJlcXVpcmUoJ3JpdmV0cycpLFxuICAgIHF1ZXJ5U3RyaW5nID0gcmVxdWlyZSgncXVlcnktc3RyaW5nJyksXG4gICAgZG9tUmVhZHkgPSByZXF1aXJlKCdkb21yZWFkeScpLFxuICAgIHZpZXcgPSB7XG4gICAgICAgIHBsdWdpbnMgOiB3aW5kb3cucGx1Z2lucyxcbiAgICAgICAgYWN0aXZlVGFiIDogJ2dlbmVyYWwnLFxuXG4gICAgICAgIHRhYnMgOiB7XG4gICAgICAgICAgICBnZW5lcmFsIDogJ2dlbmVyYWwnLFxuICAgICAgICAgICAgcGx1Z2lucyA6ICdwbHVnaW5zJ1xuICAgICAgICB9LFxuXG4gICAgICAgIGhhbmRsZVBsdWdpbkNoZWNrIDogaGFuZGxlUGx1Z2luQ2hlY2ssXG4gICAgICAgIGhhbmRsZVRhYkNsaWNrZWQgOiBoYW5kbGVUYWJDbGlja2VkXG4gICAgfTtcblxuZnVuY3Rpb24gaW5pdCgpIHtcbiAgICB2aWV3LmFjdGl2ZVRhYiA9IHF1ZXJ5U3RyaW5nLnBhcnNlKHdpbmRvdy5sb2NhdGlvbi5oYXNoKS50YWI7XG5cbiAgICBiaW5kVmlldygpO1xufVxuXG5mdW5jdGlvbiBiaW5kVmlldygpIHtcbiAgICByaXZldHMuZm9ybWF0dGVycy5lcXVhbHMgPSBmdW5jdGlvbihjb21wYXJhdG9yLCBjb21wYXJhdGVlKSB7XG4gICAgICAgIHJldHVybiBjb21wYXJhdG9yID09PSBjb21wYXJhdGVlO1xuICAgIH07XG5cbiAgICByaXZldHMuYmluZChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc2V0dGluZ3MnKSwgeyB2aWV3IDogdmlldyB9KTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlVGFiQ2xpY2tlZChldmVudCkge1xuICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gcXVlcnlTdHJpbmcuc3RyaW5naWZ5KHsgdGFiIDogZXZlbnQuY3VycmVudFRhcmdldC5nZXRBdHRyaWJ1dGUoJ3RhYi1uYW1lJykgfSk7XG4gICAgdmlldy5hY3RpdmVUYWIgPSBldmVudC5jdXJyZW50VGFyZ2V0LmdldEF0dHJpYnV0ZSgndGFiLW5hbWUnKTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlUGx1Z2luQ2hlY2soZXZlbnQsIGNvbnRleHQpIHtcbiAgICBjb250ZXh0LnBsdWdpbi53b3JraW5nVHlwZSA9IGNvbnRleHQucGx1Z2luLmFjdGl2ZSA/ICdBY3RpdmF0aW5nJyA6ICdEZWFjdGl2YXRpbmcnOyAvLyBSZXZlcnNlZCBiZWNhdXNlIHJpdmV0cyBoYXMgYWxscmVhZHkgc2V0IHRoZSB2YWx1ZTtcbiAgICBjb250ZXh0LnBsdWdpbi5pc1dvcmtpbmcgPSB0cnVlO1xuXG4gICAgd2luZG93LmdoLmFwaS5wbHVnaW5zLmFjdGl2YXRlKGNvbnRleHQucGx1Z2luLmlkKVxuICAgICAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnRleHQucGx1Z2luLmlzV29ya2luZyA9IGZhbHNlO1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb250ZXh0LnBsdWdpbi5pc1dvcmtpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIGNvbnRleHQucGx1Z2luLmFjdGl2ZSA9ICFjb250ZXh0LnBsdWdpbi5hY3RpdmU7XG4gICAgICAgIH0pO1xufVxuXG5kb21SZWFkeShpbml0KTtcbiIsIi8qIVxuICAqIGRvbXJlYWR5IChjKSBEdXN0aW4gRGlheiAyMDE0IC0gTGljZW5zZSBNSVRcbiAgKi9cbiFmdW5jdGlvbiAobmFtZSwgZGVmaW5pdGlvbikge1xuXG4gIGlmICh0eXBlb2YgbW9kdWxlICE9ICd1bmRlZmluZWQnKSBtb2R1bGUuZXhwb3J0cyA9IGRlZmluaXRpb24oKVxuICBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiYgdHlwZW9mIGRlZmluZS5hbWQgPT0gJ29iamVjdCcpIGRlZmluZShkZWZpbml0aW9uKVxuICBlbHNlIHRoaXNbbmFtZV0gPSBkZWZpbml0aW9uKClcblxufSgnZG9tcmVhZHknLCBmdW5jdGlvbiAoKSB7XG5cbiAgdmFyIGZucyA9IFtdLCBsaXN0ZW5lclxuICAgICwgZG9jID0gZG9jdW1lbnRcbiAgICAsIGhhY2sgPSBkb2MuZG9jdW1lbnRFbGVtZW50LmRvU2Nyb2xsXG4gICAgLCBkb21Db250ZW50TG9hZGVkID0gJ0RPTUNvbnRlbnRMb2FkZWQnXG4gICAgLCBsb2FkZWQgPSAoaGFjayA/IC9ebG9hZGVkfF5jLyA6IC9ebG9hZGVkfF5pfF5jLykudGVzdChkb2MucmVhZHlTdGF0ZSlcblxuXG4gIGlmICghbG9hZGVkKVxuICBkb2MuYWRkRXZlbnRMaXN0ZW5lcihkb21Db250ZW50TG9hZGVkLCBsaXN0ZW5lciA9IGZ1bmN0aW9uICgpIHtcbiAgICBkb2MucmVtb3ZlRXZlbnRMaXN0ZW5lcihkb21Db250ZW50TG9hZGVkLCBsaXN0ZW5lcilcbiAgICBsb2FkZWQgPSAxXG4gICAgd2hpbGUgKGxpc3RlbmVyID0gZm5zLnNoaWZ0KCkpIGxpc3RlbmVyKClcbiAgfSlcblxuICByZXR1cm4gZnVuY3Rpb24gKGZuKSB7XG4gICAgbG9hZGVkID8gc2V0VGltZW91dChmbiwgMCkgOiBmbnMucHVzaChmbilcbiAgfVxuXG59KTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHByb3BJc0VudW1lcmFibGUgPSBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG5mdW5jdGlvbiB0b09iamVjdCh2YWwpIHtcblx0aWYgKHZhbCA9PT0gbnVsbCB8fCB2YWwgPT09IHVuZGVmaW5lZCkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdC5hc3NpZ24gY2Fubm90IGJlIGNhbGxlZCB3aXRoIG51bGwgb3IgdW5kZWZpbmVkJyk7XG5cdH1cblxuXHRyZXR1cm4gT2JqZWN0KHZhbCk7XG59XG5cbmZ1bmN0aW9uIHNob3VsZFVzZU5hdGl2ZSgpIHtcblx0dHJ5IHtcblx0XHRpZiAoIU9iamVjdC5hc3NpZ24pIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBEZXRlY3QgYnVnZ3kgcHJvcGVydHkgZW51bWVyYXRpb24gb3JkZXIgaW4gb2xkZXIgVjggdmVyc2lvbnMuXG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD00MTE4XG5cdFx0dmFyIHRlc3QxID0gbmV3IFN0cmluZygnYWJjJyk7ICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG5cdFx0dGVzdDFbNV0gPSAnZGUnO1xuXHRcdGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MSlbMF0gPT09ICc1Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMwNTZcblx0XHR2YXIgdGVzdDIgPSB7fTtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IDEwOyBpKyspIHtcblx0XHRcdHRlc3QyWydfJyArIFN0cmluZy5mcm9tQ2hhckNvZGUoaSldID0gaTtcblx0XHR9XG5cdFx0dmFyIG9yZGVyMiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QyKS5tYXAoZnVuY3Rpb24gKG4pIHtcblx0XHRcdHJldHVybiB0ZXN0MltuXTtcblx0XHR9KTtcblx0XHRpZiAob3JkZXIyLmpvaW4oJycpICE9PSAnMDEyMzQ1Njc4OScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QzID0ge307XG5cdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jy5zcGxpdCgnJykuZm9yRWFjaChmdW5jdGlvbiAobGV0dGVyKSB7XG5cdFx0XHR0ZXN0M1tsZXR0ZXJdID0gbGV0dGVyO1xuXHRcdH0pO1xuXHRcdGlmIChPYmplY3Qua2V5cyhPYmplY3QuYXNzaWduKHt9LCB0ZXN0MykpLmpvaW4oJycpICE9PVxuXHRcdFx0XHQnYWJjZGVmZ2hpamtsbW5vcHFyc3QnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHQvLyBXZSBkb24ndCBleHBlY3QgYW55IG9mIHRoZSBhYm92ZSB0byB0aHJvdywgYnV0IGJldHRlciB0byBiZSBzYWZlLlxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNob3VsZFVzZU5hdGl2ZSgpID8gT2JqZWN0LmFzc2lnbiA6IGZ1bmN0aW9uICh0YXJnZXQsIHNvdXJjZSkge1xuXHR2YXIgZnJvbTtcblx0dmFyIHRvID0gdG9PYmplY3QodGFyZ2V0KTtcblx0dmFyIHN5bWJvbHM7XG5cblx0Zm9yICh2YXIgcyA9IDE7IHMgPCBhcmd1bWVudHMubGVuZ3RoOyBzKyspIHtcblx0XHRmcm9tID0gT2JqZWN0KGFyZ3VtZW50c1tzXSk7XG5cblx0XHRmb3IgKHZhciBrZXkgaW4gZnJvbSkge1xuXHRcdFx0aWYgKGhhc093blByb3BlcnR5LmNhbGwoZnJvbSwga2V5KSkge1xuXHRcdFx0XHR0b1trZXldID0gZnJvbVtrZXldO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG5cdFx0XHRzeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhmcm9tKTtcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc3ltYm9scy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpZiAocHJvcElzRW51bWVyYWJsZS5jYWxsKGZyb20sIHN5bWJvbHNbaV0pKSB7XG5cdFx0XHRcdFx0dG9bc3ltYm9sc1tpXV0gPSBmcm9tW3N5bWJvbHNbaV1dO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHRvO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBzdHJpY3RVcmlFbmNvZGUgPSByZXF1aXJlKCdzdHJpY3QtdXJpLWVuY29kZScpO1xudmFyIG9iamVjdEFzc2lnbiA9IHJlcXVpcmUoJ29iamVjdC1hc3NpZ24nKTtcblxuZnVuY3Rpb24gZW5jb2RlKHZhbHVlLCBvcHRzKSB7XG5cdGlmIChvcHRzLmVuY29kZSkge1xuXHRcdHJldHVybiBvcHRzLnN0cmljdCA/IHN0cmljdFVyaUVuY29kZSh2YWx1ZSkgOiBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpO1xuXHR9XG5cblx0cmV0dXJuIHZhbHVlO1xufVxuXG5leHBvcnRzLmV4dHJhY3QgPSBmdW5jdGlvbiAoc3RyKSB7XG5cdHJldHVybiBzdHIuc3BsaXQoJz8nKVsxXSB8fCAnJztcbn07XG5cbmV4cG9ydHMucGFyc2UgPSBmdW5jdGlvbiAoc3RyKSB7XG5cdC8vIENyZWF0ZSBhbiBvYmplY3Qgd2l0aCBubyBwcm90b3R5cGVcblx0Ly8gaHR0cHM6Ly9naXRodWIuY29tL3NpbmRyZXNvcmh1cy9xdWVyeS1zdHJpbmcvaXNzdWVzLzQ3XG5cdHZhciByZXQgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG5cdGlmICh0eXBlb2Ygc3RyICE9PSAnc3RyaW5nJykge1xuXHRcdHJldHVybiByZXQ7XG5cdH1cblxuXHRzdHIgPSBzdHIudHJpbSgpLnJlcGxhY2UoL14oXFw/fCN8JikvLCAnJyk7XG5cblx0aWYgKCFzdHIpIHtcblx0XHRyZXR1cm4gcmV0O1xuXHR9XG5cblx0c3RyLnNwbGl0KCcmJykuZm9yRWFjaChmdW5jdGlvbiAocGFyYW0pIHtcblx0XHR2YXIgcGFydHMgPSBwYXJhbS5yZXBsYWNlKC9cXCsvZywgJyAnKS5zcGxpdCgnPScpO1xuXHRcdC8vIEZpcmVmb3ggKHByZSA0MCkgZGVjb2RlcyBgJTNEYCB0byBgPWBcblx0XHQvLyBodHRwczovL2dpdGh1Yi5jb20vc2luZHJlc29yaHVzL3F1ZXJ5LXN0cmluZy9wdWxsLzM3XG5cdFx0dmFyIGtleSA9IHBhcnRzLnNoaWZ0KCk7XG5cdFx0dmFyIHZhbCA9IHBhcnRzLmxlbmd0aCA+IDAgPyBwYXJ0cy5qb2luKCc9JykgOiB1bmRlZmluZWQ7XG5cblx0XHRrZXkgPSBkZWNvZGVVUklDb21wb25lbnQoa2V5KTtcblxuXHRcdC8vIG1pc3NpbmcgYD1gIHNob3VsZCBiZSBgbnVsbGA6XG5cdFx0Ly8gaHR0cDovL3czLm9yZy9UUi8yMDEyL1dELXVybC0yMDEyMDUyNC8jY29sbGVjdC11cmwtcGFyYW1ldGVyc1xuXHRcdHZhbCA9IHZhbCA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IGRlY29kZVVSSUNvbXBvbmVudCh2YWwpO1xuXG5cdFx0aWYgKHJldFtrZXldID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHJldFtrZXldID0gdmFsO1xuXHRcdH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShyZXRba2V5XSkpIHtcblx0XHRcdHJldFtrZXldLnB1c2godmFsKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0W2tleV0gPSBbcmV0W2tleV0sIHZhbF07XG5cdFx0fVxuXHR9KTtcblxuXHRyZXR1cm4gcmV0O1xufTtcblxuZXhwb3J0cy5zdHJpbmdpZnkgPSBmdW5jdGlvbiAob2JqLCBvcHRzKSB7XG5cdHZhciBkZWZhdWx0cyA9IHtcblx0XHRlbmNvZGU6IHRydWUsXG5cdFx0c3RyaWN0OiB0cnVlXG5cdH07XG5cblx0b3B0cyA9IG9iamVjdEFzc2lnbihkZWZhdWx0cywgb3B0cyk7XG5cblx0cmV0dXJuIG9iaiA/IE9iamVjdC5rZXlzKG9iaikuc29ydCgpLm1hcChmdW5jdGlvbiAoa2V5KSB7XG5cdFx0dmFyIHZhbCA9IG9ialtrZXldO1xuXG5cdFx0aWYgKHZhbCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRyZXR1cm4gJyc7XG5cdFx0fVxuXG5cdFx0aWYgKHZhbCA9PT0gbnVsbCkge1xuXHRcdFx0cmV0dXJuIGVuY29kZShrZXksIG9wdHMpO1xuXHRcdH1cblxuXHRcdGlmIChBcnJheS5pc0FycmF5KHZhbCkpIHtcblx0XHRcdHZhciByZXN1bHQgPSBbXTtcblxuXHRcdFx0dmFsLnNsaWNlKCkuZm9yRWFjaChmdW5jdGlvbiAodmFsMikge1xuXHRcdFx0XHRpZiAodmFsMiA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHZhbDIgPT09IG51bGwpIHtcblx0XHRcdFx0XHRyZXN1bHQucHVzaChlbmNvZGUoa2V5LCBvcHRzKSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cmVzdWx0LnB1c2goZW5jb2RlKGtleSwgb3B0cykgKyAnPScgKyBlbmNvZGUodmFsMiwgb3B0cykpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0cmV0dXJuIHJlc3VsdC5qb2luKCcmJyk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGVuY29kZShrZXksIG9wdHMpICsgJz0nICsgZW5jb2RlKHZhbCwgb3B0cyk7XG5cdH0pLmZpbHRlcihmdW5jdGlvbiAoeCkge1xuXHRcdHJldHVybiB4Lmxlbmd0aCA+IDA7XG5cdH0pLmpvaW4oJyYnKSA6ICcnO1xufTtcbiIsIi8vIFJpdmV0cy5qc1xuLy8gdmVyc2lvbjogMC45LjNcbi8vIGF1dGhvcjogTWljaGFlbCBSaWNoYXJkc1xuLy8gbGljZW5zZTogTUlUXG4oZnVuY3Rpb24oKSB7XG4gIHZhciBSaXZldHMsIGJpbmRNZXRob2QsIHVuYmluZE1ldGhvZCwgX3JlZixcbiAgICBfX2JpbmQgPSBmdW5jdGlvbihmbiwgbWUpeyByZXR1cm4gZnVuY3Rpb24oKXsgcmV0dXJuIGZuLmFwcGx5KG1lLCBhcmd1bWVudHMpOyB9OyB9LFxuICAgIF9fc2xpY2UgPSBbXS5zbGljZSxcbiAgICBfX2hhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eSxcbiAgICBfX2V4dGVuZHMgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKF9faGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfSxcbiAgICBfX2luZGV4T2YgPSBbXS5pbmRleE9mIHx8IGZ1bmN0aW9uKGl0ZW0pIHsgZm9yICh2YXIgaSA9IDAsIGwgPSB0aGlzLmxlbmd0aDsgaSA8IGw7IGkrKykgeyBpZiAoaSBpbiB0aGlzICYmIHRoaXNbaV0gPT09IGl0ZW0pIHJldHVybiBpOyB9IHJldHVybiAtMTsgfTtcblxuICBSaXZldHMgPSB7XG4gICAgb3B0aW9uczogWydwcmVmaXgnLCAndGVtcGxhdGVEZWxpbWl0ZXJzJywgJ3Jvb3RJbnRlcmZhY2UnLCAncHJlbG9hZERhdGEnLCAnaGFuZGxlcicsICdleGVjdXRlRnVuY3Rpb25zJ10sXG4gICAgZXh0ZW5zaW9uczogWydiaW5kZXJzJywgJ2Zvcm1hdHRlcnMnLCAnY29tcG9uZW50cycsICdhZGFwdGVycyddLFxuICAgIFwicHVibGljXCI6IHtcbiAgICAgIGJpbmRlcnM6IHt9LFxuICAgICAgY29tcG9uZW50czoge30sXG4gICAgICBmb3JtYXR0ZXJzOiB7fSxcbiAgICAgIGFkYXB0ZXJzOiB7fSxcbiAgICAgIHByZWZpeDogJ3J2JyxcbiAgICAgIHRlbXBsYXRlRGVsaW1pdGVyczogWyd7JywgJ30nXSxcbiAgICAgIHJvb3RJbnRlcmZhY2U6ICcuJyxcbiAgICAgIHByZWxvYWREYXRhOiB0cnVlLFxuICAgICAgZXhlY3V0ZUZ1bmN0aW9uczogZmFsc2UsXG4gICAgICBpdGVyYXRpb25BbGlhczogZnVuY3Rpb24obW9kZWxOYW1lKSB7XG4gICAgICAgIHJldHVybiAnJScgKyBtb2RlbE5hbWUgKyAnJSc7XG4gICAgICB9LFxuICAgICAgaGFuZGxlcjogZnVuY3Rpb24oY29udGV4dCwgZXYsIGJpbmRpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FsbChjb250ZXh0LCBldiwgYmluZGluZy52aWV3Lm1vZGVscyk7XG4gICAgICB9LFxuICAgICAgY29uZmlndXJlOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgIHZhciBkZXNjcmlwdG9yLCBrZXksIG9wdGlvbiwgdmFsdWU7XG4gICAgICAgIGlmIChvcHRpb25zID09IG51bGwpIHtcbiAgICAgICAgICBvcHRpb25zID0ge307XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChvcHRpb24gaW4gb3B0aW9ucykge1xuICAgICAgICAgIHZhbHVlID0gb3B0aW9uc1tvcHRpb25dO1xuICAgICAgICAgIGlmIChvcHRpb24gPT09ICdiaW5kZXJzJyB8fCBvcHRpb24gPT09ICdjb21wb25lbnRzJyB8fCBvcHRpb24gPT09ICdmb3JtYXR0ZXJzJyB8fCBvcHRpb24gPT09ICdhZGFwdGVycycpIHtcbiAgICAgICAgICAgIGZvciAoa2V5IGluIHZhbHVlKSB7XG4gICAgICAgICAgICAgIGRlc2NyaXB0b3IgPSB2YWx1ZVtrZXldO1xuICAgICAgICAgICAgICBSaXZldHNbb3B0aW9uXVtrZXldID0gZGVzY3JpcHRvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgUml2ZXRzW1wicHVibGljXCJdW29wdGlvbl0gPSB2YWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBiaW5kOiBmdW5jdGlvbihlbCwgbW9kZWxzLCBvcHRpb25zKSB7XG4gICAgICAgIHZhciB2aWV3O1xuICAgICAgICBpZiAobW9kZWxzID09IG51bGwpIHtcbiAgICAgICAgICBtb2RlbHMgPSB7fTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucyA9PSBudWxsKSB7XG4gICAgICAgICAgb3B0aW9ucyA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIHZpZXcgPSBuZXcgUml2ZXRzLlZpZXcoZWwsIG1vZGVscywgb3B0aW9ucyk7XG4gICAgICAgIHZpZXcuYmluZCgpO1xuICAgICAgICByZXR1cm4gdmlldztcbiAgICAgIH0sXG4gICAgICBpbml0OiBmdW5jdGlvbihjb21wb25lbnQsIGVsLCBkYXRhKSB7XG4gICAgICAgIHZhciBzY29wZSwgdGVtcGxhdGUsIHZpZXc7XG4gICAgICAgIGlmIChkYXRhID09IG51bGwpIHtcbiAgICAgICAgICBkYXRhID0ge307XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVsID09IG51bGwpIHtcbiAgICAgICAgICBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICB9XG4gICAgICAgIGNvbXBvbmVudCA9IFJpdmV0c1tcInB1YmxpY1wiXS5jb21wb25lbnRzW2NvbXBvbmVudF07XG4gICAgICAgIHRlbXBsYXRlID0gY29tcG9uZW50LnRlbXBsYXRlLmNhbGwodGhpcywgZWwpO1xuICAgICAgICBpZiAodGVtcGxhdGUgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICAgIHdoaWxlIChlbC5maXJzdENoaWxkKSB7XG4gICAgICAgICAgICBlbC5yZW1vdmVDaGlsZChlbC5maXJzdENoaWxkKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWwuYXBwZW5kQ2hpbGQodGVtcGxhdGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVsLmlubmVySFRNTCA9IHRlbXBsYXRlO1xuICAgICAgICB9XG4gICAgICAgIHNjb3BlID0gY29tcG9uZW50LmluaXRpYWxpemUuY2FsbCh0aGlzLCBlbCwgZGF0YSk7XG4gICAgICAgIHZpZXcgPSBuZXcgUml2ZXRzLlZpZXcoZWwsIHNjb3BlKTtcbiAgICAgICAgdmlldy5iaW5kKCk7XG4gICAgICAgIHJldHVybiB2aWV3O1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBpZiAod2luZG93WydqUXVlcnknXSB8fCB3aW5kb3dbJyQnXSkge1xuICAgIF9yZWYgPSAnb24nIGluIGpRdWVyeS5wcm90b3R5cGUgPyBbJ29uJywgJ29mZiddIDogWydiaW5kJywgJ3VuYmluZCddLCBiaW5kTWV0aG9kID0gX3JlZlswXSwgdW5iaW5kTWV0aG9kID0gX3JlZlsxXTtcbiAgICBSaXZldHMuVXRpbCA9IHtcbiAgICAgIGJpbmRFdmVudDogZnVuY3Rpb24oZWwsIGV2ZW50LCBoYW5kbGVyKSB7XG4gICAgICAgIHJldHVybiBqUXVlcnkoZWwpW2JpbmRNZXRob2RdKGV2ZW50LCBoYW5kbGVyKTtcbiAgICAgIH0sXG4gICAgICB1bmJpbmRFdmVudDogZnVuY3Rpb24oZWwsIGV2ZW50LCBoYW5kbGVyKSB7XG4gICAgICAgIHJldHVybiBqUXVlcnkoZWwpW3VuYmluZE1ldGhvZF0oZXZlbnQsIGhhbmRsZXIpO1xuICAgICAgfSxcbiAgICAgIGdldElucHV0VmFsdWU6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgIHZhciAkZWw7XG4gICAgICAgICRlbCA9IGpRdWVyeShlbCk7XG4gICAgICAgIGlmICgkZWwuYXR0cigndHlwZScpID09PSAnY2hlY2tib3gnKSB7XG4gICAgICAgICAgcmV0dXJuICRlbC5pcygnOmNoZWNrZWQnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gJGVsLnZhbCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICBSaXZldHMuVXRpbCA9IHtcbiAgICAgIGJpbmRFdmVudDogKGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoJ2FkZEV2ZW50TGlzdGVuZXInIGluIHdpbmRvdykge1xuICAgICAgICAgIHJldHVybiBmdW5jdGlvbihlbCwgZXZlbnQsIGhhbmRsZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBlbC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBoYW5kbGVyLCBmYWxzZSk7XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oZWwsIGV2ZW50LCBoYW5kbGVyKSB7XG4gICAgICAgICAgcmV0dXJuIGVsLmF0dGFjaEV2ZW50KCdvbicgKyBldmVudCwgaGFuZGxlcik7XG4gICAgICAgIH07XG4gICAgICB9KSgpLFxuICAgICAgdW5iaW5kRXZlbnQ6IChmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKCdyZW1vdmVFdmVudExpc3RlbmVyJyBpbiB3aW5kb3cpIHtcbiAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oZWwsIGV2ZW50LCBoYW5kbGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgaGFuZGxlciwgZmFsc2UpO1xuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGVsLCBldmVudCwgaGFuZGxlcikge1xuICAgICAgICAgIHJldHVybiBlbC5kZXRhY2hFdmVudCgnb24nICsgZXZlbnQsIGhhbmRsZXIpO1xuICAgICAgICB9O1xuICAgICAgfSkoKSxcbiAgICAgIGdldElucHV0VmFsdWU6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgIHZhciBvLCBfaSwgX2xlbiwgX3Jlc3VsdHM7XG4gICAgICAgIGlmIChlbC50eXBlID09PSAnY2hlY2tib3gnKSB7XG4gICAgICAgICAgcmV0dXJuIGVsLmNoZWNrZWQ7XG4gICAgICAgIH0gZWxzZSBpZiAoZWwudHlwZSA9PT0gJ3NlbGVjdC1tdWx0aXBsZScpIHtcbiAgICAgICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gZWwubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgICAgIG8gPSBlbFtfaV07XG4gICAgICAgICAgICBpZiAoby5zZWxlY3RlZCkge1xuICAgICAgICAgICAgICBfcmVzdWx0cy5wdXNoKG8udmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gX3Jlc3VsdHM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGVsLnZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIFJpdmV0cy5UeXBlUGFyc2VyID0gKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIFR5cGVQYXJzZXIoKSB7fVxuXG4gICAgVHlwZVBhcnNlci50eXBlcyA9IHtcbiAgICAgIHByaW1pdGl2ZTogMCxcbiAgICAgIGtleXBhdGg6IDFcbiAgICB9O1xuXG4gICAgVHlwZVBhcnNlci5wYXJzZSA9IGZ1bmN0aW9uKHN0cmluZykge1xuICAgICAgaWYgKC9eJy4qJyR8XlwiLipcIiQvLnRlc3Qoc3RyaW5nKSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHR5cGU6IHRoaXMudHlwZXMucHJpbWl0aXZlLFxuICAgICAgICAgIHZhbHVlOiBzdHJpbmcuc2xpY2UoMSwgLTEpXG4gICAgICAgIH07XG4gICAgICB9IGVsc2UgaWYgKHN0cmluZyA9PT0gJ3RydWUnKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdHlwZTogdGhpcy50eXBlcy5wcmltaXRpdmUsXG4gICAgICAgICAgdmFsdWU6IHRydWVcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSBpZiAoc3RyaW5nID09PSAnZmFsc2UnKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdHlwZTogdGhpcy50eXBlcy5wcmltaXRpdmUsXG4gICAgICAgICAgdmFsdWU6IGZhbHNlXG4gICAgICAgIH07XG4gICAgICB9IGVsc2UgaWYgKHN0cmluZyA9PT0gJ251bGwnKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdHlwZTogdGhpcy50eXBlcy5wcmltaXRpdmUsXG4gICAgICAgICAgdmFsdWU6IG51bGxcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSBpZiAoc3RyaW5nID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHR5cGU6IHRoaXMudHlwZXMucHJpbWl0aXZlLFxuICAgICAgICAgIHZhbHVlOiB2b2lkIDBcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSBpZiAoc3RyaW5nID09PSAnJykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHR5cGU6IHRoaXMudHlwZXMucHJpbWl0aXZlLFxuICAgICAgICAgIHZhbHVlOiB2b2lkIDBcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSBpZiAoaXNOYU4oTnVtYmVyKHN0cmluZykpID09PSBmYWxzZSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHR5cGU6IHRoaXMudHlwZXMucHJpbWl0aXZlLFxuICAgICAgICAgIHZhbHVlOiBOdW1iZXIoc3RyaW5nKVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB0eXBlOiB0aGlzLnR5cGVzLmtleXBhdGgsXG4gICAgICAgICAgdmFsdWU6IHN0cmluZ1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gVHlwZVBhcnNlcjtcblxuICB9KSgpO1xuXG4gIFJpdmV0cy5UZXh0VGVtcGxhdGVQYXJzZXIgPSAoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gVGV4dFRlbXBsYXRlUGFyc2VyKCkge31cblxuICAgIFRleHRUZW1wbGF0ZVBhcnNlci50eXBlcyA9IHtcbiAgICAgIHRleHQ6IDAsXG4gICAgICBiaW5kaW5nOiAxXG4gICAgfTtcblxuICAgIFRleHRUZW1wbGF0ZVBhcnNlci5wYXJzZSA9IGZ1bmN0aW9uKHRlbXBsYXRlLCBkZWxpbWl0ZXJzKSB7XG4gICAgICB2YXIgaW5kZXgsIGxhc3RJbmRleCwgbGFzdFRva2VuLCBsZW5ndGgsIHN1YnN0cmluZywgdG9rZW5zLCB2YWx1ZTtcbiAgICAgIHRva2VucyA9IFtdO1xuICAgICAgbGVuZ3RoID0gdGVtcGxhdGUubGVuZ3RoO1xuICAgICAgaW5kZXggPSAwO1xuICAgICAgbGFzdEluZGV4ID0gMDtcbiAgICAgIHdoaWxlIChsYXN0SW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgaW5kZXggPSB0ZW1wbGF0ZS5pbmRleE9mKGRlbGltaXRlcnNbMF0sIGxhc3RJbmRleCk7XG4gICAgICAgIGlmIChpbmRleCA8IDApIHtcbiAgICAgICAgICB0b2tlbnMucHVzaCh7XG4gICAgICAgICAgICB0eXBlOiB0aGlzLnR5cGVzLnRleHQsXG4gICAgICAgICAgICB2YWx1ZTogdGVtcGxhdGUuc2xpY2UobGFzdEluZGV4KVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChpbmRleCA+IDAgJiYgbGFzdEluZGV4IDwgaW5kZXgpIHtcbiAgICAgICAgICAgIHRva2Vucy5wdXNoKHtcbiAgICAgICAgICAgICAgdHlwZTogdGhpcy50eXBlcy50ZXh0LFxuICAgICAgICAgICAgICB2YWx1ZTogdGVtcGxhdGUuc2xpY2UobGFzdEluZGV4LCBpbmRleClcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBsYXN0SW5kZXggPSBpbmRleCArIGRlbGltaXRlcnNbMF0ubGVuZ3RoO1xuICAgICAgICAgIGluZGV4ID0gdGVtcGxhdGUuaW5kZXhPZihkZWxpbWl0ZXJzWzFdLCBsYXN0SW5kZXgpO1xuICAgICAgICAgIGlmIChpbmRleCA8IDApIHtcbiAgICAgICAgICAgIHN1YnN0cmluZyA9IHRlbXBsYXRlLnNsaWNlKGxhc3RJbmRleCAtIGRlbGltaXRlcnNbMV0ubGVuZ3RoKTtcbiAgICAgICAgICAgIGxhc3RUb2tlbiA9IHRva2Vuc1t0b2tlbnMubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICBpZiAoKGxhc3RUb2tlbiAhPSBudWxsID8gbGFzdFRva2VuLnR5cGUgOiB2b2lkIDApID09PSB0aGlzLnR5cGVzLnRleHQpIHtcbiAgICAgICAgICAgICAgbGFzdFRva2VuLnZhbHVlICs9IHN1YnN0cmluZztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRva2Vucy5wdXNoKHtcbiAgICAgICAgICAgICAgICB0eXBlOiB0aGlzLnR5cGVzLnRleHQsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHN1YnN0cmluZ1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YWx1ZSA9IHRlbXBsYXRlLnNsaWNlKGxhc3RJbmRleCwgaW5kZXgpLnRyaW0oKTtcbiAgICAgICAgICB0b2tlbnMucHVzaCh7XG4gICAgICAgICAgICB0eXBlOiB0aGlzLnR5cGVzLmJpbmRpbmcsXG4gICAgICAgICAgICB2YWx1ZTogdmFsdWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBsYXN0SW5kZXggPSBpbmRleCArIGRlbGltaXRlcnNbMV0ubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdG9rZW5zO1xuICAgIH07XG5cbiAgICByZXR1cm4gVGV4dFRlbXBsYXRlUGFyc2VyO1xuXG4gIH0pKCk7XG5cbiAgUml2ZXRzLlZpZXcgPSAoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gVmlldyhlbHMsIG1vZGVscywgb3B0aW9ucykge1xuICAgICAgdmFyIGssIG9wdGlvbiwgdiwgX2Jhc2UsIF9pLCBfaiwgX2xlbiwgX2xlbjEsIF9yZWYxLCBfcmVmMiwgX3JlZjMsIF9yZWY0LCBfcmVmNTtcbiAgICAgIHRoaXMuZWxzID0gZWxzO1xuICAgICAgdGhpcy5tb2RlbHMgPSBtb2RlbHM7XG4gICAgICBpZiAob3B0aW9ucyA9PSBudWxsKSB7XG4gICAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICAgIH1cbiAgICAgIHRoaXMudXBkYXRlID0gX19iaW5kKHRoaXMudXBkYXRlLCB0aGlzKTtcbiAgICAgIHRoaXMucHVibGlzaCA9IF9fYmluZCh0aGlzLnB1Ymxpc2gsIHRoaXMpO1xuICAgICAgdGhpcy5zeW5jID0gX19iaW5kKHRoaXMuc3luYywgdGhpcyk7XG4gICAgICB0aGlzLnVuYmluZCA9IF9fYmluZCh0aGlzLnVuYmluZCwgdGhpcyk7XG4gICAgICB0aGlzLmJpbmQgPSBfX2JpbmQodGhpcy5iaW5kLCB0aGlzKTtcbiAgICAgIHRoaXMuc2VsZWN0ID0gX19iaW5kKHRoaXMuc2VsZWN0LCB0aGlzKTtcbiAgICAgIHRoaXMudHJhdmVyc2UgPSBfX2JpbmQodGhpcy50cmF2ZXJzZSwgdGhpcyk7XG4gICAgICB0aGlzLmJ1aWxkID0gX19iaW5kKHRoaXMuYnVpbGQsIHRoaXMpO1xuICAgICAgdGhpcy5idWlsZEJpbmRpbmcgPSBfX2JpbmQodGhpcy5idWlsZEJpbmRpbmcsIHRoaXMpO1xuICAgICAgdGhpcy5iaW5kaW5nUmVnRXhwID0gX19iaW5kKHRoaXMuYmluZGluZ1JlZ0V4cCwgdGhpcyk7XG4gICAgICB0aGlzLm9wdGlvbnMgPSBfX2JpbmQodGhpcy5vcHRpb25zLCB0aGlzKTtcbiAgICAgIGlmICghKHRoaXMuZWxzLmpxdWVyeSB8fCB0aGlzLmVscyBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgICB0aGlzLmVscyA9IFt0aGlzLmVsc107XG4gICAgICB9XG4gICAgICBfcmVmMSA9IFJpdmV0cy5leHRlbnNpb25zO1xuICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmMS5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICBvcHRpb24gPSBfcmVmMVtfaV07XG4gICAgICAgIHRoaXNbb3B0aW9uXSA9IHt9O1xuICAgICAgICBpZiAob3B0aW9uc1tvcHRpb25dKSB7XG4gICAgICAgICAgX3JlZjIgPSBvcHRpb25zW29wdGlvbl07XG4gICAgICAgICAgZm9yIChrIGluIF9yZWYyKSB7XG4gICAgICAgICAgICB2ID0gX3JlZjJba107XG4gICAgICAgICAgICB0aGlzW29wdGlvbl1ba10gPSB2O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBfcmVmMyA9IFJpdmV0c1tcInB1YmxpY1wiXVtvcHRpb25dO1xuICAgICAgICBmb3IgKGsgaW4gX3JlZjMpIHtcbiAgICAgICAgICB2ID0gX3JlZjNba107XG4gICAgICAgICAgaWYgKChfYmFzZSA9IHRoaXNbb3B0aW9uXSlba10gPT0gbnVsbCkge1xuICAgICAgICAgICAgX2Jhc2Vba10gPSB2O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgX3JlZjQgPSBSaXZldHMub3B0aW9ucztcbiAgICAgIGZvciAoX2ogPSAwLCBfbGVuMSA9IF9yZWY0Lmxlbmd0aDsgX2ogPCBfbGVuMTsgX2orKykge1xuICAgICAgICBvcHRpb24gPSBfcmVmNFtfal07XG4gICAgICAgIHRoaXNbb3B0aW9uXSA9IChfcmVmNSA9IG9wdGlvbnNbb3B0aW9uXSkgIT0gbnVsbCA/IF9yZWY1IDogUml2ZXRzW1wicHVibGljXCJdW29wdGlvbl07XG4gICAgICB9XG4gICAgICB0aGlzLmJ1aWxkKCk7XG4gICAgfVxuXG4gICAgVmlldy5wcm90b3R5cGUub3B0aW9ucyA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG9wdGlvbiwgb3B0aW9ucywgX2ksIF9sZW4sIF9yZWYxO1xuICAgICAgb3B0aW9ucyA9IHt9O1xuICAgICAgX3JlZjEgPSBSaXZldHMuZXh0ZW5zaW9ucy5jb25jYXQoUml2ZXRzLm9wdGlvbnMpO1xuICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmMS5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICBvcHRpb24gPSBfcmVmMVtfaV07XG4gICAgICAgIG9wdGlvbnNbb3B0aW9uXSA9IHRoaXNbb3B0aW9uXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBvcHRpb25zO1xuICAgIH07XG5cbiAgICBWaWV3LnByb3RvdHlwZS5iaW5kaW5nUmVnRXhwID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gbmV3IFJlZ0V4cChcIl5cIiArIHRoaXMucHJlZml4ICsgXCItXCIpO1xuICAgIH07XG5cbiAgICBWaWV3LnByb3RvdHlwZS5idWlsZEJpbmRpbmcgPSBmdW5jdGlvbihiaW5kaW5nLCBub2RlLCB0eXBlLCBkZWNsYXJhdGlvbikge1xuICAgICAgdmFyIGNvbnRleHQsIGN0eCwgZGVwZW5kZW5jaWVzLCBrZXlwYXRoLCBvcHRpb25zLCBwaXBlLCBwaXBlcztcbiAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICAgIHBpcGVzID0gKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgX2ksIF9sZW4sIF9yZWYxLCBfcmVzdWx0cztcbiAgICAgICAgX3JlZjEgPSBkZWNsYXJhdGlvbi5tYXRjaCgvKCg/OidbXiddKicpKig/Oig/OlteXFx8J10qKD86J1teJ10qJykrW15cXHwnXSopK3xbXlxcfF0rKSl8XiQvZyk7XG4gICAgICAgIF9yZXN1bHRzID0gW107XG4gICAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZjEubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgICBwaXBlID0gX3JlZjFbX2ldO1xuICAgICAgICAgIF9yZXN1bHRzLnB1c2gocGlwZS50cmltKCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBfcmVzdWx0cztcbiAgICAgIH0pKCk7XG4gICAgICBjb250ZXh0ID0gKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgX2ksIF9sZW4sIF9yZWYxLCBfcmVzdWx0cztcbiAgICAgICAgX3JlZjEgPSBwaXBlcy5zaGlmdCgpLnNwbGl0KCc8Jyk7XG4gICAgICAgIF9yZXN1bHRzID0gW107XG4gICAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZjEubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgICBjdHggPSBfcmVmMVtfaV07XG4gICAgICAgICAgX3Jlc3VsdHMucHVzaChjdHgudHJpbSgpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gX3Jlc3VsdHM7XG4gICAgICB9KSgpO1xuICAgICAga2V5cGF0aCA9IGNvbnRleHQuc2hpZnQoKTtcbiAgICAgIG9wdGlvbnMuZm9ybWF0dGVycyA9IHBpcGVzO1xuICAgICAgaWYgKGRlcGVuZGVuY2llcyA9IGNvbnRleHQuc2hpZnQoKSkge1xuICAgICAgICBvcHRpb25zLmRlcGVuZGVuY2llcyA9IGRlcGVuZGVuY2llcy5zcGxpdCgvXFxzKy8pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuYmluZGluZ3MucHVzaChuZXcgUml2ZXRzW2JpbmRpbmddKHRoaXMsIG5vZGUsIHR5cGUsIGtleXBhdGgsIG9wdGlvbnMpKTtcbiAgICB9O1xuXG4gICAgVmlldy5wcm90b3R5cGUuYnVpbGQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBlbCwgcGFyc2UsIF9pLCBfbGVuLCBfcmVmMTtcbiAgICAgIHRoaXMuYmluZGluZ3MgPSBbXTtcbiAgICAgIHBhcnNlID0gKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihub2RlKSB7XG4gICAgICAgICAgdmFyIGJsb2NrLCBjaGlsZE5vZGUsIGRlbGltaXRlcnMsIG4sIHBhcnNlciwgdGV4dCwgdG9rZW4sIHRva2VucywgX2ksIF9qLCBfbGVuLCBfbGVuMSwgX3JlZjE7XG4gICAgICAgICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IDMpIHtcbiAgICAgICAgICAgIHBhcnNlciA9IFJpdmV0cy5UZXh0VGVtcGxhdGVQYXJzZXI7XG4gICAgICAgICAgICBpZiAoZGVsaW1pdGVycyA9IF90aGlzLnRlbXBsYXRlRGVsaW1pdGVycykge1xuICAgICAgICAgICAgICBpZiAoKHRva2VucyA9IHBhcnNlci5wYXJzZShub2RlLmRhdGEsIGRlbGltaXRlcnMpKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBpZiAoISh0b2tlbnMubGVuZ3RoID09PSAxICYmIHRva2Vuc1swXS50eXBlID09PSBwYXJzZXIudHlwZXMudGV4dCkpIHtcbiAgICAgICAgICAgICAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gdG9rZW5zLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRva2VuID0gdG9rZW5zW19pXTtcbiAgICAgICAgICAgICAgICAgICAgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRva2VuLnZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh0ZXh0LCBub2RlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRva2VuLnR5cGUgPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5idWlsZEJpbmRpbmcoJ1RleHRCaW5kaW5nJywgdGV4dCwgbnVsbCwgdG9rZW4udmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBub2RlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobm9kZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChub2RlLm5vZGVUeXBlID09PSAxKSB7XG4gICAgICAgICAgICBibG9jayA9IF90aGlzLnRyYXZlcnNlKG5vZGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoIWJsb2NrKSB7XG4gICAgICAgICAgICBfcmVmMSA9IChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgdmFyIF9rLCBfbGVuMSwgX3JlZjEsIF9yZXN1bHRzO1xuICAgICAgICAgICAgICBfcmVmMSA9IG5vZGUuY2hpbGROb2RlcztcbiAgICAgICAgICAgICAgX3Jlc3VsdHMgPSBbXTtcbiAgICAgICAgICAgICAgZm9yIChfayA9IDAsIF9sZW4xID0gX3JlZjEubGVuZ3RoOyBfayA8IF9sZW4xOyBfaysrKSB7XG4gICAgICAgICAgICAgICAgbiA9IF9yZWYxW19rXTtcbiAgICAgICAgICAgICAgICBfcmVzdWx0cy5wdXNoKG4pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiBfcmVzdWx0cztcbiAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICBmb3IgKF9qID0gMCwgX2xlbjEgPSBfcmVmMS5sZW5ndGg7IF9qIDwgX2xlbjE7IF9qKyspIHtcbiAgICAgICAgICAgICAgY2hpbGROb2RlID0gX3JlZjFbX2pdO1xuICAgICAgICAgICAgICBwYXJzZShjaGlsZE5vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpO1xuICAgICAgX3JlZjEgPSB0aGlzLmVscztcbiAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZjEubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgZWwgPSBfcmVmMVtfaV07XG4gICAgICAgIHBhcnNlKGVsKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuYmluZGluZ3Muc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICAgIHZhciBfcmVmMiwgX3JlZjM7XG4gICAgICAgIHJldHVybiAoKChfcmVmMiA9IGIuYmluZGVyKSAhPSBudWxsID8gX3JlZjIucHJpb3JpdHkgOiB2b2lkIDApIHx8IDApIC0gKCgoX3JlZjMgPSBhLmJpbmRlcikgIT0gbnVsbCA/IF9yZWYzLnByaW9yaXR5IDogdm9pZCAwKSB8fCAwKTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBWaWV3LnByb3RvdHlwZS50cmF2ZXJzZSA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgIHZhciBhdHRyaWJ1dGUsIGF0dHJpYnV0ZXMsIGJpbmRlciwgYmluZGluZ1JlZ0V4cCwgYmxvY2ssIGlkZW50aWZpZXIsIHJlZ2V4cCwgdHlwZSwgdmFsdWUsIF9pLCBfaiwgX2xlbiwgX2xlbjEsIF9yZWYxLCBfcmVmMiwgX3JlZjM7XG4gICAgICBiaW5kaW5nUmVnRXhwID0gdGhpcy5iaW5kaW5nUmVnRXhwKCk7XG4gICAgICBibG9jayA9IG5vZGUubm9kZU5hbWUgPT09ICdTQ1JJUFQnIHx8IG5vZGUubm9kZU5hbWUgPT09ICdTVFlMRSc7XG4gICAgICBfcmVmMSA9IG5vZGUuYXR0cmlidXRlcztcbiAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZjEubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgYXR0cmlidXRlID0gX3JlZjFbX2ldO1xuICAgICAgICBpZiAoYmluZGluZ1JlZ0V4cC50ZXN0KGF0dHJpYnV0ZS5uYW1lKSkge1xuICAgICAgICAgIHR5cGUgPSBhdHRyaWJ1dGUubmFtZS5yZXBsYWNlKGJpbmRpbmdSZWdFeHAsICcnKTtcbiAgICAgICAgICBpZiAoIShiaW5kZXIgPSB0aGlzLmJpbmRlcnNbdHlwZV0pKSB7XG4gICAgICAgICAgICBfcmVmMiA9IHRoaXMuYmluZGVycztcbiAgICAgICAgICAgIGZvciAoaWRlbnRpZmllciBpbiBfcmVmMikge1xuICAgICAgICAgICAgICB2YWx1ZSA9IF9yZWYyW2lkZW50aWZpZXJdO1xuICAgICAgICAgICAgICBpZiAoaWRlbnRpZmllciAhPT0gJyonICYmIGlkZW50aWZpZXIuaW5kZXhPZignKicpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIHJlZ2V4cCA9IG5ldyBSZWdFeHAoXCJeXCIgKyAoaWRlbnRpZmllci5yZXBsYWNlKC9cXCovZywgJy4rJykpICsgXCIkXCIpO1xuICAgICAgICAgICAgICAgIGlmIChyZWdleHAudGVzdCh0eXBlKSkge1xuICAgICAgICAgICAgICAgICAgYmluZGVyID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGJpbmRlciB8fCAoYmluZGVyID0gdGhpcy5iaW5kZXJzWycqJ10pO1xuICAgICAgICAgIGlmIChiaW5kZXIuYmxvY2spIHtcbiAgICAgICAgICAgIGJsb2NrID0gdHJ1ZTtcbiAgICAgICAgICAgIGF0dHJpYnV0ZXMgPSBbYXR0cmlidXRlXTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIF9yZWYzID0gYXR0cmlidXRlcyB8fCBub2RlLmF0dHJpYnV0ZXM7XG4gICAgICBmb3IgKF9qID0gMCwgX2xlbjEgPSBfcmVmMy5sZW5ndGg7IF9qIDwgX2xlbjE7IF9qKyspIHtcbiAgICAgICAgYXR0cmlidXRlID0gX3JlZjNbX2pdO1xuICAgICAgICBpZiAoYmluZGluZ1JlZ0V4cC50ZXN0KGF0dHJpYnV0ZS5uYW1lKSkge1xuICAgICAgICAgIHR5cGUgPSBhdHRyaWJ1dGUubmFtZS5yZXBsYWNlKGJpbmRpbmdSZWdFeHAsICcnKTtcbiAgICAgICAgICB0aGlzLmJ1aWxkQmluZGluZygnQmluZGluZycsIG5vZGUsIHR5cGUsIGF0dHJpYnV0ZS52YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICghYmxvY2spIHtcbiAgICAgICAgdHlwZSA9IG5vZGUubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgaWYgKHRoaXMuY29tcG9uZW50c1t0eXBlXSAmJiAhbm9kZS5fYm91bmQpIHtcbiAgICAgICAgICB0aGlzLmJpbmRpbmdzLnB1c2gobmV3IFJpdmV0cy5Db21wb25lbnRCaW5kaW5nKHRoaXMsIG5vZGUsIHR5cGUpKTtcbiAgICAgICAgICBibG9jayA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBibG9jaztcbiAgICB9O1xuXG4gICAgVmlldy5wcm90b3R5cGUuc2VsZWN0ID0gZnVuY3Rpb24oZm4pIHtcbiAgICAgIHZhciBiaW5kaW5nLCBfaSwgX2xlbiwgX3JlZjEsIF9yZXN1bHRzO1xuICAgICAgX3JlZjEgPSB0aGlzLmJpbmRpbmdzO1xuICAgICAgX3Jlc3VsdHMgPSBbXTtcbiAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZjEubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgYmluZGluZyA9IF9yZWYxW19pXTtcbiAgICAgICAgaWYgKGZuKGJpbmRpbmcpKSB7XG4gICAgICAgICAgX3Jlc3VsdHMucHVzaChiaW5kaW5nKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgIH07XG5cbiAgICBWaWV3LnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYmluZGluZywgX2ksIF9sZW4sIF9yZWYxO1xuICAgICAgX3JlZjEgPSB0aGlzLmJpbmRpbmdzO1xuICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmMS5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICBiaW5kaW5nID0gX3JlZjFbX2ldO1xuICAgICAgICBiaW5kaW5nLmJpbmQoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgVmlldy5wcm90b3R5cGUudW5iaW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYmluZGluZywgX2ksIF9sZW4sIF9yZWYxO1xuICAgICAgX3JlZjEgPSB0aGlzLmJpbmRpbmdzO1xuICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmMS5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICBiaW5kaW5nID0gX3JlZjFbX2ldO1xuICAgICAgICBiaW5kaW5nLnVuYmluZCgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBWaWV3LnByb3RvdHlwZS5zeW5jID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYmluZGluZywgX2ksIF9sZW4sIF9yZWYxO1xuICAgICAgX3JlZjEgPSB0aGlzLmJpbmRpbmdzO1xuICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmMS5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICBiaW5kaW5nID0gX3JlZjFbX2ldO1xuICAgICAgICBpZiAodHlwZW9mIGJpbmRpbmcuc3luYyA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgYmluZGluZy5zeW5jKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgVmlldy5wcm90b3R5cGUucHVibGlzaCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGJpbmRpbmcsIF9pLCBfbGVuLCBfcmVmMTtcbiAgICAgIF9yZWYxID0gdGhpcy5zZWxlY3QoZnVuY3Rpb24oYikge1xuICAgICAgICB2YXIgX3JlZjE7XG4gICAgICAgIHJldHVybiAoX3JlZjEgPSBiLmJpbmRlcikgIT0gbnVsbCA/IF9yZWYxLnB1Ymxpc2hlcyA6IHZvaWQgMDtcbiAgICAgIH0pO1xuICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmMS5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICBiaW5kaW5nID0gX3JlZjFbX2ldO1xuICAgICAgICBiaW5kaW5nLnB1Ymxpc2goKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgVmlldy5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24obW9kZWxzKSB7XG4gICAgICB2YXIgYmluZGluZywga2V5LCBtb2RlbCwgX2ksIF9sZW4sIF9yZWYxO1xuICAgICAgaWYgKG1vZGVscyA9PSBudWxsKSB7XG4gICAgICAgIG1vZGVscyA9IHt9O1xuICAgICAgfVxuICAgICAgZm9yIChrZXkgaW4gbW9kZWxzKSB7XG4gICAgICAgIG1vZGVsID0gbW9kZWxzW2tleV07XG4gICAgICAgIHRoaXMubW9kZWxzW2tleV0gPSBtb2RlbDtcbiAgICAgIH1cbiAgICAgIF9yZWYxID0gdGhpcy5iaW5kaW5ncztcbiAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZjEubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgYmluZGluZyA9IF9yZWYxW19pXTtcbiAgICAgICAgaWYgKHR5cGVvZiBiaW5kaW5nLnVwZGF0ZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgYmluZGluZy51cGRhdGUobW9kZWxzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gVmlldztcblxuICB9KSgpO1xuXG4gIFJpdmV0cy5CaW5kaW5nID0gKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIEJpbmRpbmcodmlldywgZWwsIHR5cGUsIGtleXBhdGgsIG9wdGlvbnMpIHtcbiAgICAgIHRoaXMudmlldyA9IHZpZXc7XG4gICAgICB0aGlzLmVsID0gZWw7XG4gICAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgICAgdGhpcy5rZXlwYXRoID0ga2V5cGF0aDtcbiAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnMgIT0gbnVsbCA/IG9wdGlvbnMgOiB7fTtcbiAgICAgIHRoaXMuZ2V0VmFsdWUgPSBfX2JpbmQodGhpcy5nZXRWYWx1ZSwgdGhpcyk7XG4gICAgICB0aGlzLnVwZGF0ZSA9IF9fYmluZCh0aGlzLnVwZGF0ZSwgdGhpcyk7XG4gICAgICB0aGlzLnVuYmluZCA9IF9fYmluZCh0aGlzLnVuYmluZCwgdGhpcyk7XG4gICAgICB0aGlzLmJpbmQgPSBfX2JpbmQodGhpcy5iaW5kLCB0aGlzKTtcbiAgICAgIHRoaXMucHVibGlzaCA9IF9fYmluZCh0aGlzLnB1Ymxpc2gsIHRoaXMpO1xuICAgICAgdGhpcy5zeW5jID0gX19iaW5kKHRoaXMuc3luYywgdGhpcyk7XG4gICAgICB0aGlzLnNldCA9IF9fYmluZCh0aGlzLnNldCwgdGhpcyk7XG4gICAgICB0aGlzLmV2ZW50SGFuZGxlciA9IF9fYmluZCh0aGlzLmV2ZW50SGFuZGxlciwgdGhpcyk7XG4gICAgICB0aGlzLmZvcm1hdHRlZFZhbHVlID0gX19iaW5kKHRoaXMuZm9ybWF0dGVkVmFsdWUsIHRoaXMpO1xuICAgICAgdGhpcy5wYXJzZUZvcm1hdHRlckFyZ3VtZW50cyA9IF9fYmluZCh0aGlzLnBhcnNlRm9ybWF0dGVyQXJndW1lbnRzLCB0aGlzKTtcbiAgICAgIHRoaXMucGFyc2VUYXJnZXQgPSBfX2JpbmQodGhpcy5wYXJzZVRhcmdldCwgdGhpcyk7XG4gICAgICB0aGlzLm9ic2VydmUgPSBfX2JpbmQodGhpcy5vYnNlcnZlLCB0aGlzKTtcbiAgICAgIHRoaXMuc2V0QmluZGVyID0gX19iaW5kKHRoaXMuc2V0QmluZGVyLCB0aGlzKTtcbiAgICAgIHRoaXMuZm9ybWF0dGVycyA9IHRoaXMub3B0aW9ucy5mb3JtYXR0ZXJzIHx8IFtdO1xuICAgICAgdGhpcy5kZXBlbmRlbmNpZXMgPSBbXTtcbiAgICAgIHRoaXMuZm9ybWF0dGVyT2JzZXJ2ZXJzID0ge307XG4gICAgICB0aGlzLm1vZGVsID0gdm9pZCAwO1xuICAgICAgdGhpcy5zZXRCaW5kZXIoKTtcbiAgICB9XG5cbiAgICBCaW5kaW5nLnByb3RvdHlwZS5zZXRCaW5kZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBpZGVudGlmaWVyLCByZWdleHAsIHZhbHVlLCBfcmVmMTtcbiAgICAgIGlmICghKHRoaXMuYmluZGVyID0gdGhpcy52aWV3LmJpbmRlcnNbdGhpcy50eXBlXSkpIHtcbiAgICAgICAgX3JlZjEgPSB0aGlzLnZpZXcuYmluZGVycztcbiAgICAgICAgZm9yIChpZGVudGlmaWVyIGluIF9yZWYxKSB7XG4gICAgICAgICAgdmFsdWUgPSBfcmVmMVtpZGVudGlmaWVyXTtcbiAgICAgICAgICBpZiAoaWRlbnRpZmllciAhPT0gJyonICYmIGlkZW50aWZpZXIuaW5kZXhPZignKicpICE9PSAtMSkge1xuICAgICAgICAgICAgcmVnZXhwID0gbmV3IFJlZ0V4cChcIl5cIiArIChpZGVudGlmaWVyLnJlcGxhY2UoL1xcKi9nLCAnLisnKSkgKyBcIiRcIik7XG4gICAgICAgICAgICBpZiAocmVnZXhwLnRlc3QodGhpcy50eXBlKSkge1xuICAgICAgICAgICAgICB0aGlzLmJpbmRlciA9IHZhbHVlO1xuICAgICAgICAgICAgICB0aGlzLmFyZ3MgPSBuZXcgUmVnRXhwKFwiXlwiICsgKGlkZW50aWZpZXIucmVwbGFjZSgvXFwqL2csICcoLispJykpICsgXCIkXCIpLmV4ZWModGhpcy50eXBlKTtcbiAgICAgICAgICAgICAgdGhpcy5hcmdzLnNoaWZ0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLmJpbmRlciB8fCAodGhpcy5iaW5kZXIgPSB0aGlzLnZpZXcuYmluZGVyc1snKiddKTtcbiAgICAgIGlmICh0aGlzLmJpbmRlciBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJpbmRlciA9IHtcbiAgICAgICAgICByb3V0aW5lOiB0aGlzLmJpbmRlclxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH07XG5cbiAgICBCaW5kaW5nLnByb3RvdHlwZS5vYnNlcnZlID0gZnVuY3Rpb24ob2JqLCBrZXlwYXRoLCBjYWxsYmFjaykge1xuICAgICAgcmV0dXJuIFJpdmV0cy5zaWdodGdsYXNzKG9iaiwga2V5cGF0aCwgY2FsbGJhY2ssIHtcbiAgICAgICAgcm9vdDogdGhpcy52aWV3LnJvb3RJbnRlcmZhY2UsXG4gICAgICAgIGFkYXB0ZXJzOiB0aGlzLnZpZXcuYWRhcHRlcnNcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBCaW5kaW5nLnByb3RvdHlwZS5wYXJzZVRhcmdldCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHRva2VuO1xuICAgICAgdG9rZW4gPSBSaXZldHMuVHlwZVBhcnNlci5wYXJzZSh0aGlzLmtleXBhdGgpO1xuICAgICAgaWYgKHRva2VuLnR5cGUgPT09IFJpdmV0cy5UeXBlUGFyc2VyLnR5cGVzLnByaW1pdGl2ZSkge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZSA9IHRva2VuLnZhbHVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5vYnNlcnZlciA9IHRoaXMub2JzZXJ2ZSh0aGlzLnZpZXcubW9kZWxzLCB0aGlzLmtleXBhdGgsIHRoaXMuc3luYyk7XG4gICAgICAgIHJldHVybiB0aGlzLm1vZGVsID0gdGhpcy5vYnNlcnZlci50YXJnZXQ7XG4gICAgICB9XG4gICAgfTtcblxuICAgIEJpbmRpbmcucHJvdG90eXBlLnBhcnNlRm9ybWF0dGVyQXJndW1lbnRzID0gZnVuY3Rpb24oYXJncywgZm9ybWF0dGVySW5kZXgpIHtcbiAgICAgIHZhciBhaSwgYXJnLCBvYnNlcnZlciwgcHJvY2Vzc2VkQXJncywgX2Jhc2UsIF9pLCBfbGVuO1xuICAgICAgYXJncyA9IChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIF9pLCBfbGVuLCBfcmVzdWx0cztcbiAgICAgICAgX3Jlc3VsdHMgPSBbXTtcbiAgICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBhcmdzLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgICAgYXJnID0gYXJnc1tfaV07XG4gICAgICAgICAgX3Jlc3VsdHMucHVzaChSaXZldHMuVHlwZVBhcnNlci5wYXJzZShhcmcpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gX3Jlc3VsdHM7XG4gICAgICB9KSgpO1xuICAgICAgcHJvY2Vzc2VkQXJncyA9IFtdO1xuICAgICAgZm9yIChhaSA9IF9pID0gMCwgX2xlbiA9IGFyZ3MubGVuZ3RoOyBfaSA8IF9sZW47IGFpID0gKytfaSkge1xuICAgICAgICBhcmcgPSBhcmdzW2FpXTtcbiAgICAgICAgcHJvY2Vzc2VkQXJncy5wdXNoKGFyZy50eXBlID09PSBSaXZldHMuVHlwZVBhcnNlci50eXBlcy5wcmltaXRpdmUgPyBhcmcudmFsdWUgOiAoKF9iYXNlID0gdGhpcy5mb3JtYXR0ZXJPYnNlcnZlcnMpW2Zvcm1hdHRlckluZGV4XSB8fCAoX2Jhc2VbZm9ybWF0dGVySW5kZXhdID0ge30pLCAhKG9ic2VydmVyID0gdGhpcy5mb3JtYXR0ZXJPYnNlcnZlcnNbZm9ybWF0dGVySW5kZXhdW2FpXSkgPyAob2JzZXJ2ZXIgPSB0aGlzLm9ic2VydmUodGhpcy52aWV3Lm1vZGVscywgYXJnLnZhbHVlLCB0aGlzLnN5bmMpLCB0aGlzLmZvcm1hdHRlck9ic2VydmVyc1tmb3JtYXR0ZXJJbmRleF1bYWldID0gb2JzZXJ2ZXIpIDogdm9pZCAwLCBvYnNlcnZlci52YWx1ZSgpKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcHJvY2Vzc2VkQXJncztcbiAgICB9O1xuXG4gICAgQmluZGluZy5wcm90b3R5cGUuZm9ybWF0dGVkVmFsdWUgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgdmFyIGFyZ3MsIGZpLCBmb3JtYXR0ZXIsIGlkLCBwcm9jZXNzZWRBcmdzLCBfaSwgX2xlbiwgX3JlZjEsIF9yZWYyO1xuICAgICAgX3JlZjEgPSB0aGlzLmZvcm1hdHRlcnM7XG4gICAgICBmb3IgKGZpID0gX2kgPSAwLCBfbGVuID0gX3JlZjEubGVuZ3RoOyBfaSA8IF9sZW47IGZpID0gKytfaSkge1xuICAgICAgICBmb3JtYXR0ZXIgPSBfcmVmMVtmaV07XG4gICAgICAgIGFyZ3MgPSBmb3JtYXR0ZXIubWF0Y2goL1teXFxzJ10rfCcoW14nXXwnW15cXHNdKSonfFwiKFteXCJdfFwiW15cXHNdKSpcIi9nKTtcbiAgICAgICAgaWQgPSBhcmdzLnNoaWZ0KCk7XG4gICAgICAgIGZvcm1hdHRlciA9IHRoaXMudmlldy5mb3JtYXR0ZXJzW2lkXTtcbiAgICAgICAgcHJvY2Vzc2VkQXJncyA9IHRoaXMucGFyc2VGb3JtYXR0ZXJBcmd1bWVudHMoYXJncywgZmkpO1xuICAgICAgICBpZiAoKGZvcm1hdHRlciAhPSBudWxsID8gZm9ybWF0dGVyLnJlYWQgOiB2b2lkIDApIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcbiAgICAgICAgICB2YWx1ZSA9IChfcmVmMiA9IGZvcm1hdHRlci5yZWFkKS5jYWxsLmFwcGx5KF9yZWYyLCBbdGhpcy5tb2RlbCwgdmFsdWVdLmNvbmNhdChfX3NsaWNlLmNhbGwocHJvY2Vzc2VkQXJncykpKTtcbiAgICAgICAgfSBlbHNlIGlmIChmb3JtYXR0ZXIgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuICAgICAgICAgIHZhbHVlID0gZm9ybWF0dGVyLmNhbGwuYXBwbHkoZm9ybWF0dGVyLCBbdGhpcy5tb2RlbCwgdmFsdWVdLmNvbmNhdChfX3NsaWNlLmNhbGwocHJvY2Vzc2VkQXJncykpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH07XG5cbiAgICBCaW5kaW5nLnByb3RvdHlwZS5ldmVudEhhbmRsZXIgPSBmdW5jdGlvbihmbikge1xuICAgICAgdmFyIGJpbmRpbmcsIGhhbmRsZXI7XG4gICAgICBoYW5kbGVyID0gKGJpbmRpbmcgPSB0aGlzKS52aWV3LmhhbmRsZXI7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oZXYpIHtcbiAgICAgICAgcmV0dXJuIGhhbmRsZXIuY2FsbChmbiwgdGhpcywgZXYsIGJpbmRpbmcpO1xuICAgICAgfTtcbiAgICB9O1xuXG4gICAgQmluZGluZy5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHZhciBfcmVmMTtcbiAgICAgIHZhbHVlID0gdmFsdWUgaW5zdGFuY2VvZiBGdW5jdGlvbiAmJiAhdGhpcy5iaW5kZXJbXCJmdW5jdGlvblwiXSAmJiBSaXZldHNbXCJwdWJsaWNcIl0uZXhlY3V0ZUZ1bmN0aW9ucyA/IHRoaXMuZm9ybWF0dGVkVmFsdWUodmFsdWUuY2FsbCh0aGlzLm1vZGVsKSkgOiB0aGlzLmZvcm1hdHRlZFZhbHVlKHZhbHVlKTtcbiAgICAgIHJldHVybiAoX3JlZjEgPSB0aGlzLmJpbmRlci5yb3V0aW5lKSAhPSBudWxsID8gX3JlZjEuY2FsbCh0aGlzLCB0aGlzLmVsLCB2YWx1ZSkgOiB2b2lkIDA7XG4gICAgfTtcblxuICAgIEJpbmRpbmcucHJvdG90eXBlLnN5bmMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBkZXBlbmRlbmN5LCBvYnNlcnZlcjtcbiAgICAgIHJldHVybiB0aGlzLnNldCgoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBfaSwgX2osIF9sZW4sIF9sZW4xLCBfcmVmMSwgX3JlZjIsIF9yZWYzO1xuICAgICAgICBpZiAodGhpcy5vYnNlcnZlcikge1xuICAgICAgICAgIGlmICh0aGlzLm1vZGVsICE9PSB0aGlzLm9ic2VydmVyLnRhcmdldCkge1xuICAgICAgICAgICAgX3JlZjEgPSB0aGlzLmRlcGVuZGVuY2llcztcbiAgICAgICAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZjEubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgICAgICAgb2JzZXJ2ZXIgPSBfcmVmMVtfaV07XG4gICAgICAgICAgICAgIG9ic2VydmVyLnVub2JzZXJ2ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5kZXBlbmRlbmNpZXMgPSBbXTtcbiAgICAgICAgICAgIGlmICgoKHRoaXMubW9kZWwgPSB0aGlzLm9ic2VydmVyLnRhcmdldCkgIT0gbnVsbCkgJiYgKChfcmVmMiA9IHRoaXMub3B0aW9ucy5kZXBlbmRlbmNpZXMpICE9IG51bGwgPyBfcmVmMi5sZW5ndGggOiB2b2lkIDApKSB7XG4gICAgICAgICAgICAgIF9yZWYzID0gdGhpcy5vcHRpb25zLmRlcGVuZGVuY2llcztcbiAgICAgICAgICAgICAgZm9yIChfaiA9IDAsIF9sZW4xID0gX3JlZjMubGVuZ3RoOyBfaiA8IF9sZW4xOyBfaisrKSB7XG4gICAgICAgICAgICAgICAgZGVwZW5kZW5jeSA9IF9yZWYzW19qXTtcbiAgICAgICAgICAgICAgICBvYnNlcnZlciA9IHRoaXMub2JzZXJ2ZSh0aGlzLm1vZGVsLCBkZXBlbmRlbmN5LCB0aGlzLnN5bmMpO1xuICAgICAgICAgICAgICAgIHRoaXMuZGVwZW5kZW5jaWVzLnB1c2gob2JzZXJ2ZXIpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0aGlzLm9ic2VydmVyLnZhbHVlKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMudmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH0pLmNhbGwodGhpcykpO1xuICAgIH07XG5cbiAgICBCaW5kaW5nLnByb3RvdHlwZS5wdWJsaXNoID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYXJncywgZmksIGZpUmV2ZXJzZWQsIGZvcm1hdHRlciwgaWQsIGxhc3Rmb3JtYXR0ZXJJbmRleCwgcHJvY2Vzc2VkQXJncywgdmFsdWUsIF9pLCBfbGVuLCBfcmVmMSwgX3JlZjIsIF9yZWYzO1xuICAgICAgaWYgKHRoaXMub2JzZXJ2ZXIpIHtcbiAgICAgICAgdmFsdWUgPSB0aGlzLmdldFZhbHVlKHRoaXMuZWwpO1xuICAgICAgICBsYXN0Zm9ybWF0dGVySW5kZXggPSB0aGlzLmZvcm1hdHRlcnMubGVuZ3RoIC0gMTtcbiAgICAgICAgX3JlZjEgPSB0aGlzLmZvcm1hdHRlcnMuc2xpY2UoMCkucmV2ZXJzZSgpO1xuICAgICAgICBmb3IgKGZpUmV2ZXJzZWQgPSBfaSA9IDAsIF9sZW4gPSBfcmVmMS5sZW5ndGg7IF9pIDwgX2xlbjsgZmlSZXZlcnNlZCA9ICsrX2kpIHtcbiAgICAgICAgICBmb3JtYXR0ZXIgPSBfcmVmMVtmaVJldmVyc2VkXTtcbiAgICAgICAgICBmaSA9IGxhc3Rmb3JtYXR0ZXJJbmRleCAtIGZpUmV2ZXJzZWQ7XG4gICAgICAgICAgYXJncyA9IGZvcm1hdHRlci5zcGxpdCgvXFxzKy8pO1xuICAgICAgICAgIGlkID0gYXJncy5zaGlmdCgpO1xuICAgICAgICAgIHByb2Nlc3NlZEFyZ3MgPSB0aGlzLnBhcnNlRm9ybWF0dGVyQXJndW1lbnRzKGFyZ3MsIGZpKTtcbiAgICAgICAgICBpZiAoKF9yZWYyID0gdGhpcy52aWV3LmZvcm1hdHRlcnNbaWRdKSAhPSBudWxsID8gX3JlZjIucHVibGlzaCA6IHZvaWQgMCkge1xuICAgICAgICAgICAgdmFsdWUgPSAoX3JlZjMgPSB0aGlzLnZpZXcuZm9ybWF0dGVyc1tpZF0pLnB1Ymxpc2guYXBwbHkoX3JlZjMsIFt2YWx1ZV0uY29uY2F0KF9fc2xpY2UuY2FsbChwcm9jZXNzZWRBcmdzKSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5vYnNlcnZlci5zZXRWYWx1ZSh2YWx1ZSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIEJpbmRpbmcucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBkZXBlbmRlbmN5LCBvYnNlcnZlciwgX2ksIF9sZW4sIF9yZWYxLCBfcmVmMiwgX3JlZjM7XG4gICAgICB0aGlzLnBhcnNlVGFyZ2V0KCk7XG4gICAgICBpZiAoKF9yZWYxID0gdGhpcy5iaW5kZXIuYmluZCkgIT0gbnVsbCkge1xuICAgICAgICBfcmVmMS5jYWxsKHRoaXMsIHRoaXMuZWwpO1xuICAgICAgfVxuICAgICAgaWYgKCh0aGlzLm1vZGVsICE9IG51bGwpICYmICgoX3JlZjIgPSB0aGlzLm9wdGlvbnMuZGVwZW5kZW5jaWVzKSAhPSBudWxsID8gX3JlZjIubGVuZ3RoIDogdm9pZCAwKSkge1xuICAgICAgICBfcmVmMyA9IHRoaXMub3B0aW9ucy5kZXBlbmRlbmNpZXM7XG4gICAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZjMubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgICBkZXBlbmRlbmN5ID0gX3JlZjNbX2ldO1xuICAgICAgICAgIG9ic2VydmVyID0gdGhpcy5vYnNlcnZlKHRoaXMubW9kZWwsIGRlcGVuZGVuY3ksIHRoaXMuc3luYyk7XG4gICAgICAgICAgdGhpcy5kZXBlbmRlbmNpZXMucHVzaChvYnNlcnZlcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnZpZXcucHJlbG9hZERhdGEpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3luYygpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBCaW5kaW5nLnByb3RvdHlwZS51bmJpbmQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBhaSwgYXJncywgZmksIG9ic2VydmVyLCBfaSwgX2xlbiwgX3JlZjEsIF9yZWYyLCBfcmVmMywgX3JlZjQ7XG4gICAgICBpZiAoKF9yZWYxID0gdGhpcy5iaW5kZXIudW5iaW5kKSAhPSBudWxsKSB7XG4gICAgICAgIF9yZWYxLmNhbGwodGhpcywgdGhpcy5lbCk7XG4gICAgICB9XG4gICAgICBpZiAoKF9yZWYyID0gdGhpcy5vYnNlcnZlcikgIT0gbnVsbCkge1xuICAgICAgICBfcmVmMi51bm9ic2VydmUoKTtcbiAgICAgIH1cbiAgICAgIF9yZWYzID0gdGhpcy5kZXBlbmRlbmNpZXM7XG4gICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYzLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgIG9ic2VydmVyID0gX3JlZjNbX2ldO1xuICAgICAgICBvYnNlcnZlci51bm9ic2VydmUoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuZGVwZW5kZW5jaWVzID0gW107XG4gICAgICBfcmVmNCA9IHRoaXMuZm9ybWF0dGVyT2JzZXJ2ZXJzO1xuICAgICAgZm9yIChmaSBpbiBfcmVmNCkge1xuICAgICAgICBhcmdzID0gX3JlZjRbZmldO1xuICAgICAgICBmb3IgKGFpIGluIGFyZ3MpIHtcbiAgICAgICAgICBvYnNlcnZlciA9IGFyZ3NbYWldO1xuICAgICAgICAgIG9ic2VydmVyLnVub2JzZXJ2ZSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5mb3JtYXR0ZXJPYnNlcnZlcnMgPSB7fTtcbiAgICB9O1xuXG4gICAgQmluZGluZy5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24obW9kZWxzKSB7XG4gICAgICB2YXIgX3JlZjEsIF9yZWYyO1xuICAgICAgaWYgKG1vZGVscyA9PSBudWxsKSB7XG4gICAgICAgIG1vZGVscyA9IHt9O1xuICAgICAgfVxuICAgICAgdGhpcy5tb2RlbCA9IChfcmVmMSA9IHRoaXMub2JzZXJ2ZXIpICE9IG51bGwgPyBfcmVmMS50YXJnZXQgOiB2b2lkIDA7XG4gICAgICByZXR1cm4gKF9yZWYyID0gdGhpcy5iaW5kZXIudXBkYXRlKSAhPSBudWxsID8gX3JlZjIuY2FsbCh0aGlzLCBtb2RlbHMpIDogdm9pZCAwO1xuICAgIH07XG5cbiAgICBCaW5kaW5nLnByb3RvdHlwZS5nZXRWYWx1ZSA9IGZ1bmN0aW9uKGVsKSB7XG4gICAgICBpZiAodGhpcy5iaW5kZXIgJiYgKHRoaXMuYmluZGVyLmdldFZhbHVlICE9IG51bGwpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJpbmRlci5nZXRWYWx1ZS5jYWxsKHRoaXMsIGVsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBSaXZldHMuVXRpbC5nZXRJbnB1dFZhbHVlKGVsKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIEJpbmRpbmc7XG5cbiAgfSkoKTtcblxuICBSaXZldHMuQ29tcG9uZW50QmluZGluZyA9IChmdW5jdGlvbihfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoQ29tcG9uZW50QmluZGluZywgX3N1cGVyKTtcblxuICAgIGZ1bmN0aW9uIENvbXBvbmVudEJpbmRpbmcodmlldywgZWwsIHR5cGUpIHtcbiAgICAgIHZhciBhdHRyaWJ1dGUsIGJpbmRpbmdSZWdFeHAsIHByb3BlcnR5TmFtZSwgdG9rZW4sIF9pLCBfbGVuLCBfcmVmMSwgX3JlZjI7XG4gICAgICB0aGlzLnZpZXcgPSB2aWV3O1xuICAgICAgdGhpcy5lbCA9IGVsO1xuICAgICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICAgIHRoaXMudW5iaW5kID0gX19iaW5kKHRoaXMudW5iaW5kLCB0aGlzKTtcbiAgICAgIHRoaXMuYmluZCA9IF9fYmluZCh0aGlzLmJpbmQsIHRoaXMpO1xuICAgICAgdGhpcy5sb2NhbHMgPSBfX2JpbmQodGhpcy5sb2NhbHMsIHRoaXMpO1xuICAgICAgdGhpcy5jb21wb25lbnQgPSB0aGlzLnZpZXcuY29tcG9uZW50c1t0aGlzLnR5cGVdO1xuICAgICAgdGhpc1tcInN0YXRpY1wiXSA9IHt9O1xuICAgICAgdGhpcy5vYnNlcnZlcnMgPSB7fTtcbiAgICAgIHRoaXMudXBzdHJlYW1PYnNlcnZlcnMgPSB7fTtcbiAgICAgIGJpbmRpbmdSZWdFeHAgPSB2aWV3LmJpbmRpbmdSZWdFeHAoKTtcbiAgICAgIF9yZWYxID0gdGhpcy5lbC5hdHRyaWJ1dGVzIHx8IFtdO1xuICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmMS5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICBhdHRyaWJ1dGUgPSBfcmVmMVtfaV07XG4gICAgICAgIGlmICghYmluZGluZ1JlZ0V4cC50ZXN0KGF0dHJpYnV0ZS5uYW1lKSkge1xuICAgICAgICAgIHByb3BlcnR5TmFtZSA9IHRoaXMuY2FtZWxDYXNlKGF0dHJpYnV0ZS5uYW1lKTtcbiAgICAgICAgICB0b2tlbiA9IFJpdmV0cy5UeXBlUGFyc2VyLnBhcnNlKGF0dHJpYnV0ZS52YWx1ZSk7XG4gICAgICAgICAgaWYgKF9faW5kZXhPZi5jYWxsKChfcmVmMiA9IHRoaXMuY29tcG9uZW50W1wic3RhdGljXCJdKSAhPSBudWxsID8gX3JlZjIgOiBbXSwgcHJvcGVydHlOYW1lKSA+PSAwKSB7XG4gICAgICAgICAgICB0aGlzW1wic3RhdGljXCJdW3Byb3BlcnR5TmFtZV0gPSBhdHRyaWJ1dGUudmFsdWU7XG4gICAgICAgICAgfSBlbHNlIGlmICh0b2tlbi50eXBlID09PSBSaXZldHMuVHlwZVBhcnNlci50eXBlcy5wcmltaXRpdmUpIHtcbiAgICAgICAgICAgIHRoaXNbXCJzdGF0aWNcIl1bcHJvcGVydHlOYW1lXSA9IHRva2VuLnZhbHVlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm9ic2VydmVyc1twcm9wZXJ0eU5hbWVdID0gYXR0cmlidXRlLnZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIENvbXBvbmVudEJpbmRpbmcucHJvdG90eXBlLnN5bmMgPSBmdW5jdGlvbigpIHt9O1xuXG4gICAgQ29tcG9uZW50QmluZGluZy5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oKSB7fTtcblxuICAgIENvbXBvbmVudEJpbmRpbmcucHJvdG90eXBlLnB1Ymxpc2ggPSBmdW5jdGlvbigpIHt9O1xuXG4gICAgQ29tcG9uZW50QmluZGluZy5wcm90b3R5cGUubG9jYWxzID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIga2V5LCBvYnNlcnZlciwgcmVzdWx0LCB2YWx1ZSwgX3JlZjEsIF9yZWYyO1xuICAgICAgcmVzdWx0ID0ge307XG4gICAgICBfcmVmMSA9IHRoaXNbXCJzdGF0aWNcIl07XG4gICAgICBmb3IgKGtleSBpbiBfcmVmMSkge1xuICAgICAgICB2YWx1ZSA9IF9yZWYxW2tleV07XG4gICAgICAgIHJlc3VsdFtrZXldID0gdmFsdWU7XG4gICAgICB9XG4gICAgICBfcmVmMiA9IHRoaXMub2JzZXJ2ZXJzO1xuICAgICAgZm9yIChrZXkgaW4gX3JlZjIpIHtcbiAgICAgICAgb2JzZXJ2ZXIgPSBfcmVmMltrZXldO1xuICAgICAgICByZXN1bHRba2V5XSA9IG9ic2VydmVyLnZhbHVlKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICBDb21wb25lbnRCaW5kaW5nLnByb3RvdHlwZS5jYW1lbENhc2UgPSBmdW5jdGlvbihzdHJpbmcpIHtcbiAgICAgIHJldHVybiBzdHJpbmcucmVwbGFjZSgvLShbYS16XSkvZywgZnVuY3Rpb24oZ3JvdXBlZCkge1xuICAgICAgICByZXR1cm4gZ3JvdXBlZFsxXS50b1VwcGVyQ2FzZSgpO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIENvbXBvbmVudEJpbmRpbmcucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBrLCBrZXksIGtleXBhdGgsIG9ic2VydmVyLCBvcHRpb24sIG9wdGlvbnMsIHNjb3BlLCB2LCBfYmFzZSwgX2ksIF9qLCBfbGVuLCBfbGVuMSwgX3JlZjEsIF9yZWYyLCBfcmVmMywgX3JlZjQsIF9yZWY1LCBfcmVmNiwgX3JlZjc7XG4gICAgICBpZiAoIXRoaXMuYm91bmQpIHtcbiAgICAgICAgX3JlZjEgPSB0aGlzLm9ic2VydmVycztcbiAgICAgICAgZm9yIChrZXkgaW4gX3JlZjEpIHtcbiAgICAgICAgICBrZXlwYXRoID0gX3JlZjFba2V5XTtcbiAgICAgICAgICB0aGlzLm9ic2VydmVyc1trZXldID0gdGhpcy5vYnNlcnZlKHRoaXMudmlldy5tb2RlbHMsIGtleXBhdGgsICgoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBfdGhpcy5jb21wb25lbnRWaWV3Lm1vZGVsc1trZXldID0gX3RoaXMub2JzZXJ2ZXJzW2tleV0udmFsdWUoKTtcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSkodGhpcykpLmNhbGwodGhpcywga2V5KSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5ib3VuZCA9IHRydWU7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5jb21wb25lbnRWaWV3ICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5jb21wb25lbnRWaWV3LmJpbmQoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZWwuaW5uZXJIVE1MID0gdGhpcy5jb21wb25lbnQudGVtcGxhdGUuY2FsbCh0aGlzKTtcbiAgICAgICAgc2NvcGUgPSB0aGlzLmNvbXBvbmVudC5pbml0aWFsaXplLmNhbGwodGhpcywgdGhpcy5lbCwgdGhpcy5sb2NhbHMoKSk7XG4gICAgICAgIHRoaXMuZWwuX2JvdW5kID0gdHJ1ZTtcbiAgICAgICAgb3B0aW9ucyA9IHt9O1xuICAgICAgICBfcmVmMiA9IFJpdmV0cy5leHRlbnNpb25zO1xuICAgICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYyLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgICAgb3B0aW9uID0gX3JlZjJbX2ldO1xuICAgICAgICAgIG9wdGlvbnNbb3B0aW9uXSA9IHt9O1xuICAgICAgICAgIGlmICh0aGlzLmNvbXBvbmVudFtvcHRpb25dKSB7XG4gICAgICAgICAgICBfcmVmMyA9IHRoaXMuY29tcG9uZW50W29wdGlvbl07XG4gICAgICAgICAgICBmb3IgKGsgaW4gX3JlZjMpIHtcbiAgICAgICAgICAgICAgdiA9IF9yZWYzW2tdO1xuICAgICAgICAgICAgICBvcHRpb25zW29wdGlvbl1ba10gPSB2O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBfcmVmNCA9IHRoaXMudmlld1tvcHRpb25dO1xuICAgICAgICAgIGZvciAoayBpbiBfcmVmNCkge1xuICAgICAgICAgICAgdiA9IF9yZWY0W2tdO1xuICAgICAgICAgICAgaWYgKChfYmFzZSA9IG9wdGlvbnNbb3B0aW9uXSlba10gPT0gbnVsbCkge1xuICAgICAgICAgICAgICBfYmFzZVtrXSA9IHY7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIF9yZWY1ID0gUml2ZXRzLm9wdGlvbnM7XG4gICAgICAgIGZvciAoX2ogPSAwLCBfbGVuMSA9IF9yZWY1Lmxlbmd0aDsgX2ogPCBfbGVuMTsgX2orKykge1xuICAgICAgICAgIG9wdGlvbiA9IF9yZWY1W19qXTtcbiAgICAgICAgICBvcHRpb25zW29wdGlvbl0gPSAoX3JlZjYgPSB0aGlzLmNvbXBvbmVudFtvcHRpb25dKSAhPSBudWxsID8gX3JlZjYgOiB0aGlzLnZpZXdbb3B0aW9uXTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNvbXBvbmVudFZpZXcgPSBuZXcgUml2ZXRzLlZpZXcoQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodGhpcy5lbC5jaGlsZE5vZGVzKSwgc2NvcGUsIG9wdGlvbnMpO1xuICAgICAgICB0aGlzLmNvbXBvbmVudFZpZXcuYmluZCgpO1xuICAgICAgICBfcmVmNyA9IHRoaXMub2JzZXJ2ZXJzO1xuICAgICAgICBmb3IgKGtleSBpbiBfcmVmNykge1xuICAgICAgICAgIG9ic2VydmVyID0gX3JlZjdba2V5XTtcbiAgICAgICAgICB0aGlzLnVwc3RyZWFtT2JzZXJ2ZXJzW2tleV0gPSB0aGlzLm9ic2VydmUodGhpcy5jb21wb25lbnRWaWV3Lm1vZGVscywga2V5LCAoKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oa2V5LCBvYnNlcnZlcikge1xuICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9ic2VydmVyLnNldFZhbHVlKF90aGlzLmNvbXBvbmVudFZpZXcubW9kZWxzW2tleV0pO1xuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9KSh0aGlzKSkuY2FsbCh0aGlzLCBrZXksIG9ic2VydmVyKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgQ29tcG9uZW50QmluZGluZy5wcm90b3R5cGUudW5iaW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIga2V5LCBvYnNlcnZlciwgX3JlZjEsIF9yZWYyLCBfcmVmMztcbiAgICAgIF9yZWYxID0gdGhpcy51cHN0cmVhbU9ic2VydmVycztcbiAgICAgIGZvciAoa2V5IGluIF9yZWYxKSB7XG4gICAgICAgIG9ic2VydmVyID0gX3JlZjFba2V5XTtcbiAgICAgICAgb2JzZXJ2ZXIudW5vYnNlcnZlKCk7XG4gICAgICB9XG4gICAgICBfcmVmMiA9IHRoaXMub2JzZXJ2ZXJzO1xuICAgICAgZm9yIChrZXkgaW4gX3JlZjIpIHtcbiAgICAgICAgb2JzZXJ2ZXIgPSBfcmVmMltrZXldO1xuICAgICAgICBvYnNlcnZlci51bm9ic2VydmUoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAoX3JlZjMgPSB0aGlzLmNvbXBvbmVudFZpZXcpICE9IG51bGwgPyBfcmVmMy51bmJpbmQuY2FsbCh0aGlzKSA6IHZvaWQgMDtcbiAgICB9O1xuXG4gICAgcmV0dXJuIENvbXBvbmVudEJpbmRpbmc7XG5cbiAgfSkoUml2ZXRzLkJpbmRpbmcpO1xuXG4gIFJpdmV0cy5UZXh0QmluZGluZyA9IChmdW5jdGlvbihfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoVGV4dEJpbmRpbmcsIF9zdXBlcik7XG5cbiAgICBmdW5jdGlvbiBUZXh0QmluZGluZyh2aWV3LCBlbCwgdHlwZSwga2V5cGF0aCwgb3B0aW9ucykge1xuICAgICAgdGhpcy52aWV3ID0gdmlldztcbiAgICAgIHRoaXMuZWwgPSBlbDtcbiAgICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgICB0aGlzLmtleXBhdGggPSBrZXlwYXRoO1xuICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyAhPSBudWxsID8gb3B0aW9ucyA6IHt9O1xuICAgICAgdGhpcy5zeW5jID0gX19iaW5kKHRoaXMuc3luYywgdGhpcyk7XG4gICAgICB0aGlzLmZvcm1hdHRlcnMgPSB0aGlzLm9wdGlvbnMuZm9ybWF0dGVycyB8fCBbXTtcbiAgICAgIHRoaXMuZGVwZW5kZW5jaWVzID0gW107XG4gICAgICB0aGlzLmZvcm1hdHRlck9ic2VydmVycyA9IHt9O1xuICAgIH1cblxuICAgIFRleHRCaW5kaW5nLnByb3RvdHlwZS5iaW5kZXIgPSB7XG4gICAgICByb3V0aW5lOiBmdW5jdGlvbihub2RlLCB2YWx1ZSkge1xuICAgICAgICByZXR1cm4gbm9kZS5kYXRhID0gdmFsdWUgIT0gbnVsbCA/IHZhbHVlIDogJyc7XG4gICAgICB9XG4gICAgfTtcblxuICAgIFRleHRCaW5kaW5nLnByb3RvdHlwZS5zeW5jID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gVGV4dEJpbmRpbmcuX19zdXBlcl9fLnN5bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIFRleHRCaW5kaW5nO1xuXG4gIH0pKFJpdmV0cy5CaW5kaW5nKTtcblxuICBSaXZldHNbXCJwdWJsaWNcIl0uYmluZGVycy50ZXh0ID0gZnVuY3Rpb24oZWwsIHZhbHVlKSB7XG4gICAgaWYgKGVsLnRleHRDb250ZW50ICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBlbC50ZXh0Q29udGVudCA9IHZhbHVlICE9IG51bGwgPyB2YWx1ZSA6ICcnO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZWwuaW5uZXJUZXh0ID0gdmFsdWUgIT0gbnVsbCA/IHZhbHVlIDogJyc7XG4gICAgfVxuICB9O1xuXG4gIFJpdmV0c1tcInB1YmxpY1wiXS5iaW5kZXJzLmh0bWwgPSBmdW5jdGlvbihlbCwgdmFsdWUpIHtcbiAgICByZXR1cm4gZWwuaW5uZXJIVE1MID0gdmFsdWUgIT0gbnVsbCA/IHZhbHVlIDogJyc7XG4gIH07XG5cbiAgUml2ZXRzW1wicHVibGljXCJdLmJpbmRlcnMuc2hvdyA9IGZ1bmN0aW9uKGVsLCB2YWx1ZSkge1xuICAgIHJldHVybiBlbC5zdHlsZS5kaXNwbGF5ID0gdmFsdWUgPyAnJyA6ICdub25lJztcbiAgfTtcblxuICBSaXZldHNbXCJwdWJsaWNcIl0uYmluZGVycy5oaWRlID0gZnVuY3Rpb24oZWwsIHZhbHVlKSB7XG4gICAgcmV0dXJuIGVsLnN0eWxlLmRpc3BsYXkgPSB2YWx1ZSA/ICdub25lJyA6ICcnO1xuICB9O1xuXG4gIFJpdmV0c1tcInB1YmxpY1wiXS5iaW5kZXJzLmVuYWJsZWQgPSBmdW5jdGlvbihlbCwgdmFsdWUpIHtcbiAgICByZXR1cm4gZWwuZGlzYWJsZWQgPSAhdmFsdWU7XG4gIH07XG5cbiAgUml2ZXRzW1wicHVibGljXCJdLmJpbmRlcnMuZGlzYWJsZWQgPSBmdW5jdGlvbihlbCwgdmFsdWUpIHtcbiAgICByZXR1cm4gZWwuZGlzYWJsZWQgPSAhIXZhbHVlO1xuICB9O1xuXG4gIFJpdmV0c1tcInB1YmxpY1wiXS5iaW5kZXJzLmNoZWNrZWQgPSB7XG4gICAgcHVibGlzaGVzOiB0cnVlLFxuICAgIHByaW9yaXR5OiAyMDAwLFxuICAgIGJpbmQ6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICByZXR1cm4gUml2ZXRzLlV0aWwuYmluZEV2ZW50KGVsLCAnY2hhbmdlJywgdGhpcy5wdWJsaXNoKTtcbiAgICB9LFxuICAgIHVuYmluZDogZnVuY3Rpb24oZWwpIHtcbiAgICAgIHJldHVybiBSaXZldHMuVXRpbC51bmJpbmRFdmVudChlbCwgJ2NoYW5nZScsIHRoaXMucHVibGlzaCk7XG4gICAgfSxcbiAgICByb3V0aW5lOiBmdW5jdGlvbihlbCwgdmFsdWUpIHtcbiAgICAgIHZhciBfcmVmMTtcbiAgICAgIGlmIChlbC50eXBlID09PSAncmFkaW8nKSB7XG4gICAgICAgIHJldHVybiBlbC5jaGVja2VkID0gKChfcmVmMSA9IGVsLnZhbHVlKSAhPSBudWxsID8gX3JlZjEudG9TdHJpbmcoKSA6IHZvaWQgMCkgPT09ICh2YWx1ZSAhPSBudWxsID8gdmFsdWUudG9TdHJpbmcoKSA6IHZvaWQgMCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZWwuY2hlY2tlZCA9ICEhdmFsdWU7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIFJpdmV0c1tcInB1YmxpY1wiXS5iaW5kZXJzLnVuY2hlY2tlZCA9IHtcbiAgICBwdWJsaXNoZXM6IHRydWUsXG4gICAgcHJpb3JpdHk6IDIwMDAsXG4gICAgYmluZDogZnVuY3Rpb24oZWwpIHtcbiAgICAgIHJldHVybiBSaXZldHMuVXRpbC5iaW5kRXZlbnQoZWwsICdjaGFuZ2UnLCB0aGlzLnB1Ymxpc2gpO1xuICAgIH0sXG4gICAgdW5iaW5kOiBmdW5jdGlvbihlbCkge1xuICAgICAgcmV0dXJuIFJpdmV0cy5VdGlsLnVuYmluZEV2ZW50KGVsLCAnY2hhbmdlJywgdGhpcy5wdWJsaXNoKTtcbiAgICB9LFxuICAgIHJvdXRpbmU6IGZ1bmN0aW9uKGVsLCB2YWx1ZSkge1xuICAgICAgdmFyIF9yZWYxO1xuICAgICAgaWYgKGVsLnR5cGUgPT09ICdyYWRpbycpIHtcbiAgICAgICAgcmV0dXJuIGVsLmNoZWNrZWQgPSAoKF9yZWYxID0gZWwudmFsdWUpICE9IG51bGwgPyBfcmVmMS50b1N0cmluZygpIDogdm9pZCAwKSAhPT0gKHZhbHVlICE9IG51bGwgPyB2YWx1ZS50b1N0cmluZygpIDogdm9pZCAwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBlbC5jaGVja2VkID0gIXZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBSaXZldHNbXCJwdWJsaWNcIl0uYmluZGVycy52YWx1ZSA9IHtcbiAgICBwdWJsaXNoZXM6IHRydWUsXG4gICAgcHJpb3JpdHk6IDMwMDAsXG4gICAgYmluZDogZnVuY3Rpb24oZWwpIHtcbiAgICAgIGlmICghKGVsLnRhZ05hbWUgPT09ICdJTlBVVCcgJiYgZWwudHlwZSA9PT0gJ3JhZGlvJykpIHtcbiAgICAgICAgdGhpcy5ldmVudCA9IGVsLnRhZ05hbWUgPT09ICdTRUxFQ1QnID8gJ2NoYW5nZScgOiAnaW5wdXQnO1xuICAgICAgICByZXR1cm4gUml2ZXRzLlV0aWwuYmluZEV2ZW50KGVsLCB0aGlzLmV2ZW50LCB0aGlzLnB1Ymxpc2gpO1xuICAgICAgfVxuICAgIH0sXG4gICAgdW5iaW5kOiBmdW5jdGlvbihlbCkge1xuICAgICAgaWYgKCEoZWwudGFnTmFtZSA9PT0gJ0lOUFVUJyAmJiBlbC50eXBlID09PSAncmFkaW8nKSkge1xuICAgICAgICByZXR1cm4gUml2ZXRzLlV0aWwudW5iaW5kRXZlbnQoZWwsIHRoaXMuZXZlbnQsIHRoaXMucHVibGlzaCk7XG4gICAgICB9XG4gICAgfSxcbiAgICByb3V0aW5lOiBmdW5jdGlvbihlbCwgdmFsdWUpIHtcbiAgICAgIHZhciBvLCBfaSwgX2xlbiwgX3JlZjEsIF9yZWYyLCBfcmVmMywgX3Jlc3VsdHM7XG4gICAgICBpZiAoZWwudGFnTmFtZSA9PT0gJ0lOUFVUJyAmJiBlbC50eXBlID09PSAncmFkaW8nKSB7XG4gICAgICAgIHJldHVybiBlbC5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgdmFsdWUpO1xuICAgICAgfSBlbHNlIGlmICh3aW5kb3cualF1ZXJ5ICE9IG51bGwpIHtcbiAgICAgICAgZWwgPSBqUXVlcnkoZWwpO1xuICAgICAgICBpZiAoKHZhbHVlICE9IG51bGwgPyB2YWx1ZS50b1N0cmluZygpIDogdm9pZCAwKSAhPT0gKChfcmVmMSA9IGVsLnZhbCgpKSAhPSBudWxsID8gX3JlZjEudG9TdHJpbmcoKSA6IHZvaWQgMCkpIHtcbiAgICAgICAgICByZXR1cm4gZWwudmFsKHZhbHVlICE9IG51bGwgPyB2YWx1ZSA6ICcnKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGVsLnR5cGUgPT09ICdzZWxlY3QtbXVsdGlwbGUnKSB7XG4gICAgICAgICAgaWYgKHZhbHVlICE9IG51bGwpIHtcbiAgICAgICAgICAgIF9yZXN1bHRzID0gW107XG4gICAgICAgICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IGVsLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgICAgICAgIG8gPSBlbFtfaV07XG4gICAgICAgICAgICAgIF9yZXN1bHRzLnB1c2goby5zZWxlY3RlZCA9IChfcmVmMiA9IG8udmFsdWUsIF9faW5kZXhPZi5jYWxsKHZhbHVlLCBfcmVmMikgPj0gMCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICgodmFsdWUgIT0gbnVsbCA/IHZhbHVlLnRvU3RyaW5nKCkgOiB2b2lkIDApICE9PSAoKF9yZWYzID0gZWwudmFsdWUpICE9IG51bGwgPyBfcmVmMy50b1N0cmluZygpIDogdm9pZCAwKSkge1xuICAgICAgICAgIHJldHVybiBlbC52YWx1ZSA9IHZhbHVlICE9IG51bGwgPyB2YWx1ZSA6ICcnO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIFJpdmV0c1tcInB1YmxpY1wiXS5iaW5kZXJzW1wiaWZcIl0gPSB7XG4gICAgYmxvY2s6IHRydWUsXG4gICAgcHJpb3JpdHk6IDQwMDAsXG4gICAgYmluZDogZnVuY3Rpb24oZWwpIHtcbiAgICAgIHZhciBhdHRyLCBkZWNsYXJhdGlvbjtcbiAgICAgIGlmICh0aGlzLm1hcmtlciA9PSBudWxsKSB7XG4gICAgICAgIGF0dHIgPSBbdGhpcy52aWV3LnByZWZpeCwgdGhpcy50eXBlXS5qb2luKCctJykucmVwbGFjZSgnLS0nLCAnLScpO1xuICAgICAgICBkZWNsYXJhdGlvbiA9IGVsLmdldEF0dHJpYnV0ZShhdHRyKTtcbiAgICAgICAgdGhpcy5tYXJrZXIgPSBkb2N1bWVudC5jcmVhdGVDb21tZW50KFwiIHJpdmV0czogXCIgKyB0aGlzLnR5cGUgKyBcIiBcIiArIGRlY2xhcmF0aW9uICsgXCIgXCIpO1xuICAgICAgICB0aGlzLmJvdW5kID0gZmFsc2U7XG4gICAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZShhdHRyKTtcbiAgICAgICAgZWwucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodGhpcy5tYXJrZXIsIGVsKTtcbiAgICAgICAgcmV0dXJuIGVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWwpO1xuICAgICAgfVxuICAgIH0sXG4gICAgdW5iaW5kOiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLm5lc3RlZCkge1xuICAgICAgICB0aGlzLm5lc3RlZC51bmJpbmQoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuYm91bmQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHJvdXRpbmU6IGZ1bmN0aW9uKGVsLCB2YWx1ZSkge1xuICAgICAgdmFyIGtleSwgbW9kZWwsIG1vZGVscywgX3JlZjE7XG4gICAgICBpZiAoISF2YWx1ZSA9PT0gIXRoaXMuYm91bmQpIHtcbiAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgbW9kZWxzID0ge307XG4gICAgICAgICAgX3JlZjEgPSB0aGlzLnZpZXcubW9kZWxzO1xuICAgICAgICAgIGZvciAoa2V5IGluIF9yZWYxKSB7XG4gICAgICAgICAgICBtb2RlbCA9IF9yZWYxW2tleV07XG4gICAgICAgICAgICBtb2RlbHNba2V5XSA9IG1vZGVsO1xuICAgICAgICAgIH1cbiAgICAgICAgICAodGhpcy5uZXN0ZWQgfHwgKHRoaXMubmVzdGVkID0gbmV3IFJpdmV0cy5WaWV3KGVsLCBtb2RlbHMsIHRoaXMudmlldy5vcHRpb25zKCkpKSkuYmluZCgpO1xuICAgICAgICAgIHRoaXMubWFya2VyLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGVsLCB0aGlzLm1hcmtlci5uZXh0U2libGluZyk7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuYm91bmQgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWwpO1xuICAgICAgICAgIHRoaXMubmVzdGVkLnVuYmluZCgpO1xuICAgICAgICAgIHJldHVybiB0aGlzLmJvdW5kID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIHVwZGF0ZTogZnVuY3Rpb24obW9kZWxzKSB7XG4gICAgICB2YXIgX3JlZjE7XG4gICAgICByZXR1cm4gKF9yZWYxID0gdGhpcy5uZXN0ZWQpICE9IG51bGwgPyBfcmVmMS51cGRhdGUobW9kZWxzKSA6IHZvaWQgMDtcbiAgICB9XG4gIH07XG5cbiAgUml2ZXRzW1wicHVibGljXCJdLmJpbmRlcnMudW5sZXNzID0ge1xuICAgIGJsb2NrOiB0cnVlLFxuICAgIHByaW9yaXR5OiA0MDAwLFxuICAgIGJpbmQ6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICByZXR1cm4gUml2ZXRzW1wicHVibGljXCJdLmJpbmRlcnNbXCJpZlwiXS5iaW5kLmNhbGwodGhpcywgZWwpO1xuICAgIH0sXG4gICAgdW5iaW5kOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBSaXZldHNbXCJwdWJsaWNcIl0uYmluZGVyc1tcImlmXCJdLnVuYmluZC5jYWxsKHRoaXMpO1xuICAgIH0sXG4gICAgcm91dGluZTogZnVuY3Rpb24oZWwsIHZhbHVlKSB7XG4gICAgICByZXR1cm4gUml2ZXRzW1wicHVibGljXCJdLmJpbmRlcnNbXCJpZlwiXS5yb3V0aW5lLmNhbGwodGhpcywgZWwsICF2YWx1ZSk7XG4gICAgfSxcbiAgICB1cGRhdGU6IGZ1bmN0aW9uKG1vZGVscykge1xuICAgICAgcmV0dXJuIFJpdmV0c1tcInB1YmxpY1wiXS5iaW5kZXJzW1wiaWZcIl0udXBkYXRlLmNhbGwodGhpcywgbW9kZWxzKTtcbiAgICB9XG4gIH07XG5cbiAgUml2ZXRzW1wicHVibGljXCJdLmJpbmRlcnNbJ29uLSonXSA9IHtcbiAgICBcImZ1bmN0aW9uXCI6IHRydWUsXG4gICAgcHJpb3JpdHk6IDEwMDAsXG4gICAgdW5iaW5kOiBmdW5jdGlvbihlbCkge1xuICAgICAgaWYgKHRoaXMuaGFuZGxlcikge1xuICAgICAgICByZXR1cm4gUml2ZXRzLlV0aWwudW5iaW5kRXZlbnQoZWwsIHRoaXMuYXJnc1swXSwgdGhpcy5oYW5kbGVyKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHJvdXRpbmU6IGZ1bmN0aW9uKGVsLCB2YWx1ZSkge1xuICAgICAgaWYgKHRoaXMuaGFuZGxlcikge1xuICAgICAgICBSaXZldHMuVXRpbC51bmJpbmRFdmVudChlbCwgdGhpcy5hcmdzWzBdLCB0aGlzLmhhbmRsZXIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFJpdmV0cy5VdGlsLmJpbmRFdmVudChlbCwgdGhpcy5hcmdzWzBdLCB0aGlzLmhhbmRsZXIgPSB0aGlzLmV2ZW50SGFuZGxlcih2YWx1ZSkpO1xuICAgIH1cbiAgfTtcblxuICBSaXZldHNbXCJwdWJsaWNcIl0uYmluZGVyc1snZWFjaC0qJ10gPSB7XG4gICAgYmxvY2s6IHRydWUsXG4gICAgcHJpb3JpdHk6IDQwMDAsXG4gICAgYmluZDogZnVuY3Rpb24oZWwpIHtcbiAgICAgIHZhciBhdHRyLCB2aWV3LCBfaSwgX2xlbiwgX3JlZjE7XG4gICAgICBpZiAodGhpcy5tYXJrZXIgPT0gbnVsbCkge1xuICAgICAgICBhdHRyID0gW3RoaXMudmlldy5wcmVmaXgsIHRoaXMudHlwZV0uam9pbignLScpLnJlcGxhY2UoJy0tJywgJy0nKTtcbiAgICAgICAgdGhpcy5tYXJrZXIgPSBkb2N1bWVudC5jcmVhdGVDb21tZW50KFwiIHJpdmV0czogXCIgKyB0aGlzLnR5cGUgKyBcIiBcIik7XG4gICAgICAgIHRoaXMuaXRlcmF0ZWQgPSBbXTtcbiAgICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKGF0dHIpO1xuICAgICAgICBlbC5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh0aGlzLm1hcmtlciwgZWwpO1xuICAgICAgICBlbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIF9yZWYxID0gdGhpcy5pdGVyYXRlZDtcbiAgICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmMS5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICAgIHZpZXcgPSBfcmVmMVtfaV07XG4gICAgICAgICAgdmlldy5iaW5kKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIHVuYmluZDogZnVuY3Rpb24oZWwpIHtcbiAgICAgIHZhciB2aWV3LCBfaSwgX2xlbiwgX3JlZjE7XG4gICAgICBpZiAodGhpcy5pdGVyYXRlZCAhPSBudWxsKSB7XG4gICAgICAgIF9yZWYxID0gdGhpcy5pdGVyYXRlZDtcbiAgICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmMS5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICAgIHZpZXcgPSBfcmVmMVtfaV07XG4gICAgICAgICAgdmlldy51bmJpbmQoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgcm91dGluZTogZnVuY3Rpb24oZWwsIGNvbGxlY3Rpb24pIHtcbiAgICAgIHZhciBiaW5kaW5nLCBkYXRhLCBpLCBpbmRleCwga2V5LCBtb2RlbCwgbW9kZWxOYW1lLCBvcHRpb25zLCBwcmV2aW91cywgdGVtcGxhdGUsIHZpZXcsIF9pLCBfaiwgX2ssIF9sZW4sIF9sZW4xLCBfbGVuMiwgX3JlZjEsIF9yZWYyLCBfcmVmMztcbiAgICAgIG1vZGVsTmFtZSA9IHRoaXMuYXJnc1swXTtcbiAgICAgIGNvbGxlY3Rpb24gPSBjb2xsZWN0aW9uIHx8IFtdO1xuICAgICAgaWYgKHRoaXMuaXRlcmF0ZWQubGVuZ3RoID4gY29sbGVjdGlvbi5sZW5ndGgpIHtcbiAgICAgICAgX3JlZjEgPSBBcnJheSh0aGlzLml0ZXJhdGVkLmxlbmd0aCAtIGNvbGxlY3Rpb24ubGVuZ3RoKTtcbiAgICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmMS5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICAgIGkgPSBfcmVmMVtfaV07XG4gICAgICAgICAgdmlldyA9IHRoaXMuaXRlcmF0ZWQucG9wKCk7XG4gICAgICAgICAgdmlldy51bmJpbmQoKTtcbiAgICAgICAgICB0aGlzLm1hcmtlci5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHZpZXcuZWxzWzBdKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZm9yIChpbmRleCA9IF9qID0gMCwgX2xlbjEgPSBjb2xsZWN0aW9uLmxlbmd0aDsgX2ogPCBfbGVuMTsgaW5kZXggPSArK19qKSB7XG4gICAgICAgIG1vZGVsID0gY29sbGVjdGlvbltpbmRleF07XG4gICAgICAgIGRhdGEgPSB7XG4gICAgICAgICAgaW5kZXg6IGluZGV4XG4gICAgICAgIH07XG4gICAgICAgIGRhdGFbUml2ZXRzW1wicHVibGljXCJdLml0ZXJhdGlvbkFsaWFzKG1vZGVsTmFtZSldID0gaW5kZXg7XG4gICAgICAgIGRhdGFbbW9kZWxOYW1lXSA9IG1vZGVsO1xuICAgICAgICBpZiAodGhpcy5pdGVyYXRlZFtpbmRleF0gPT0gbnVsbCkge1xuICAgICAgICAgIF9yZWYyID0gdGhpcy52aWV3Lm1vZGVscztcbiAgICAgICAgICBmb3IgKGtleSBpbiBfcmVmMikge1xuICAgICAgICAgICAgbW9kZWwgPSBfcmVmMltrZXldO1xuICAgICAgICAgICAgaWYgKGRhdGFba2V5XSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgIGRhdGFba2V5XSA9IG1vZGVsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBwcmV2aW91cyA9IHRoaXMuaXRlcmF0ZWQubGVuZ3RoID8gdGhpcy5pdGVyYXRlZFt0aGlzLml0ZXJhdGVkLmxlbmd0aCAtIDFdLmVsc1swXSA6IHRoaXMubWFya2VyO1xuICAgICAgICAgIG9wdGlvbnMgPSB0aGlzLnZpZXcub3B0aW9ucygpO1xuICAgICAgICAgIG9wdGlvbnMucHJlbG9hZERhdGEgPSB0cnVlO1xuICAgICAgICAgIHRlbXBsYXRlID0gZWwuY2xvbmVOb2RlKHRydWUpO1xuICAgICAgICAgIHZpZXcgPSBuZXcgUml2ZXRzLlZpZXcodGVtcGxhdGUsIGRhdGEsIG9wdGlvbnMpO1xuICAgICAgICAgIHZpZXcuYmluZCgpO1xuICAgICAgICAgIHRoaXMuaXRlcmF0ZWQucHVzaCh2aWV3KTtcbiAgICAgICAgICB0aGlzLm1hcmtlci5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh0ZW1wbGF0ZSwgcHJldmlvdXMubmV4dFNpYmxpbmcpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaXRlcmF0ZWRbaW5kZXhdLm1vZGVsc1ttb2RlbE5hbWVdICE9PSBtb2RlbCkge1xuICAgICAgICAgIHRoaXMuaXRlcmF0ZWRbaW5kZXhdLnVwZGF0ZShkYXRhKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGVsLm5vZGVOYW1lID09PSAnT1BUSU9OJykge1xuICAgICAgICBfcmVmMyA9IHRoaXMudmlldy5iaW5kaW5ncztcbiAgICAgICAgZm9yIChfayA9IDAsIF9sZW4yID0gX3JlZjMubGVuZ3RoOyBfayA8IF9sZW4yOyBfaysrKSB7XG4gICAgICAgICAgYmluZGluZyA9IF9yZWYzW19rXTtcbiAgICAgICAgICBpZiAoYmluZGluZy5lbCA9PT0gdGhpcy5tYXJrZXIucGFyZW50Tm9kZSAmJiBiaW5kaW5nLnR5cGUgPT09ICd2YWx1ZScpIHtcbiAgICAgICAgICAgIGJpbmRpbmcuc3luYygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgdXBkYXRlOiBmdW5jdGlvbihtb2RlbHMpIHtcbiAgICAgIHZhciBkYXRhLCBrZXksIG1vZGVsLCB2aWV3LCBfaSwgX2xlbiwgX3JlZjE7XG4gICAgICBkYXRhID0ge307XG4gICAgICBmb3IgKGtleSBpbiBtb2RlbHMpIHtcbiAgICAgICAgbW9kZWwgPSBtb2RlbHNba2V5XTtcbiAgICAgICAgaWYgKGtleSAhPT0gdGhpcy5hcmdzWzBdKSB7XG4gICAgICAgICAgZGF0YVtrZXldID0gbW9kZWw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIF9yZWYxID0gdGhpcy5pdGVyYXRlZDtcbiAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZjEubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgdmlldyA9IF9yZWYxW19pXTtcbiAgICAgICAgdmlldy51cGRhdGUoZGF0YSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIFJpdmV0c1tcInB1YmxpY1wiXS5iaW5kZXJzWydjbGFzcy0qJ10gPSBmdW5jdGlvbihlbCwgdmFsdWUpIHtcbiAgICB2YXIgZWxDbGFzcztcbiAgICBlbENsYXNzID0gXCIgXCIgKyBlbC5jbGFzc05hbWUgKyBcIiBcIjtcbiAgICBpZiAoIXZhbHVlID09PSAoZWxDbGFzcy5pbmRleE9mKFwiIFwiICsgdGhpcy5hcmdzWzBdICsgXCIgXCIpICE9PSAtMSkpIHtcbiAgICAgIHJldHVybiBlbC5jbGFzc05hbWUgPSB2YWx1ZSA/IFwiXCIgKyBlbC5jbGFzc05hbWUgKyBcIiBcIiArIHRoaXMuYXJnc1swXSA6IGVsQ2xhc3MucmVwbGFjZShcIiBcIiArIHRoaXMuYXJnc1swXSArIFwiIFwiLCAnICcpLnRyaW0oKTtcbiAgICB9XG4gIH07XG5cbiAgUml2ZXRzW1wicHVibGljXCJdLmJpbmRlcnNbJyonXSA9IGZ1bmN0aW9uKGVsLCB2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gZWwuc2V0QXR0cmlidXRlKHRoaXMudHlwZSwgdmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZWwucmVtb3ZlQXR0cmlidXRlKHRoaXMudHlwZSk7XG4gICAgfVxuICB9O1xuXG4gIFJpdmV0c1tcInB1YmxpY1wiXS5mb3JtYXR0ZXJzWydjYWxsJ10gPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXJncywgdmFsdWU7XG4gICAgdmFsdWUgPSBhcmd1bWVudHNbMF0sIGFyZ3MgPSAyIDw9IGFyZ3VtZW50cy5sZW5ndGggPyBfX3NsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSA6IFtdO1xuICAgIHJldHVybiB2YWx1ZS5jYWxsLmFwcGx5KHZhbHVlLCBbdGhpc10uY29uY2F0KF9fc2xpY2UuY2FsbChhcmdzKSkpO1xuICB9O1xuXG4gIFJpdmV0c1tcInB1YmxpY1wiXS5hZGFwdGVyc1snLiddID0ge1xuICAgIGlkOiAnX3J2JyxcbiAgICBjb3VudGVyOiAwLFxuICAgIHdlYWttYXA6IHt9LFxuICAgIHdlYWtSZWZlcmVuY2U6IGZ1bmN0aW9uKG9iaikge1xuICAgICAgdmFyIGlkLCBfYmFzZSwgX25hbWU7XG4gICAgICBpZiAoIW9iai5oYXNPd25Qcm9wZXJ0eSh0aGlzLmlkKSkge1xuICAgICAgICBpZCA9IHRoaXMuY291bnRlcisrO1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCB0aGlzLmlkLCB7XG4gICAgICAgICAgdmFsdWU6IGlkXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIChfYmFzZSA9IHRoaXMud2Vha21hcClbX25hbWUgPSBvYmpbdGhpcy5pZF1dIHx8IChfYmFzZVtfbmFtZV0gPSB7XG4gICAgICAgIGNhbGxiYWNrczoge31cbiAgICAgIH0pO1xuICAgIH0sXG4gICAgY2xlYW51cFdlYWtSZWZlcmVuY2U6IGZ1bmN0aW9uKHJlZiwgaWQpIHtcbiAgICAgIGlmICghT2JqZWN0LmtleXMocmVmLmNhbGxiYWNrcykubGVuZ3RoKSB7XG4gICAgICAgIGlmICghKHJlZi5wb2ludGVycyAmJiBPYmplY3Qua2V5cyhyZWYucG9pbnRlcnMpLmxlbmd0aCkpIHtcbiAgICAgICAgICByZXR1cm4gZGVsZXRlIHRoaXMud2Vha21hcFtpZF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIHN0dWJGdW5jdGlvbjogZnVuY3Rpb24ob2JqLCBmbikge1xuICAgICAgdmFyIG1hcCwgb3JpZ2luYWwsIHdlYWttYXA7XG4gICAgICBvcmlnaW5hbCA9IG9ialtmbl07XG4gICAgICBtYXAgPSB0aGlzLndlYWtSZWZlcmVuY2Uob2JqKTtcbiAgICAgIHdlYWttYXAgPSB0aGlzLndlYWttYXA7XG4gICAgICByZXR1cm4gb2JqW2ZuXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgY2FsbGJhY2ssIGssIHIsIHJlc3BvbnNlLCBfaSwgX2xlbiwgX3JlZjEsIF9yZWYyLCBfcmVmMywgX3JlZjQ7XG4gICAgICAgIHJlc3BvbnNlID0gb3JpZ2luYWwuYXBwbHkob2JqLCBhcmd1bWVudHMpO1xuICAgICAgICBfcmVmMSA9IG1hcC5wb2ludGVycztcbiAgICAgICAgZm9yIChyIGluIF9yZWYxKSB7XG4gICAgICAgICAgayA9IF9yZWYxW3JdO1xuICAgICAgICAgIF9yZWY0ID0gKF9yZWYyID0gKF9yZWYzID0gd2Vha21hcFtyXSkgIT0gbnVsbCA/IF9yZWYzLmNhbGxiYWNrc1trXSA6IHZvaWQgMCkgIT0gbnVsbCA/IF9yZWYyIDogW107XG4gICAgICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmNC5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICAgICAgY2FsbGJhY2sgPSBfcmVmNFtfaV07XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICB9O1xuICAgIH0sXG4gICAgb2JzZXJ2ZU11dGF0aW9uczogZnVuY3Rpb24ob2JqLCByZWYsIGtleXBhdGgpIHtcbiAgICAgIHZhciBmbiwgZnVuY3Rpb25zLCBtYXAsIF9iYXNlLCBfaSwgX2xlbjtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KG9iaikpIHtcbiAgICAgICAgbWFwID0gdGhpcy53ZWFrUmVmZXJlbmNlKG9iaik7XG4gICAgICAgIGlmIChtYXAucG9pbnRlcnMgPT0gbnVsbCkge1xuICAgICAgICAgIG1hcC5wb2ludGVycyA9IHt9O1xuICAgICAgICAgIGZ1bmN0aW9ucyA9IFsncHVzaCcsICdwb3AnLCAnc2hpZnQnLCAndW5zaGlmdCcsICdzb3J0JywgJ3JldmVyc2UnLCAnc3BsaWNlJ107XG4gICAgICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBmdW5jdGlvbnMubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgICAgIGZuID0gZnVuY3Rpb25zW19pXTtcbiAgICAgICAgICAgIHRoaXMuc3R1YkZ1bmN0aW9uKG9iaiwgZm4pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoKF9iYXNlID0gbWFwLnBvaW50ZXJzKVtyZWZdID09IG51bGwpIHtcbiAgICAgICAgICBfYmFzZVtyZWZdID0gW107XG4gICAgICAgIH1cbiAgICAgICAgaWYgKF9faW5kZXhPZi5jYWxsKG1hcC5wb2ludGVyc1tyZWZdLCBrZXlwYXRoKSA8IDApIHtcbiAgICAgICAgICByZXR1cm4gbWFwLnBvaW50ZXJzW3JlZl0ucHVzaChrZXlwYXRoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgdW5vYnNlcnZlTXV0YXRpb25zOiBmdW5jdGlvbihvYmosIHJlZiwga2V5cGF0aCkge1xuICAgICAgdmFyIGlkeCwgbWFwLCBwb2ludGVycztcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KG9iaikgJiYgKG9ialt0aGlzLmlkXSAhPSBudWxsKSkge1xuICAgICAgICBpZiAobWFwID0gdGhpcy53ZWFrbWFwW29ialt0aGlzLmlkXV0pIHtcbiAgICAgICAgICBpZiAocG9pbnRlcnMgPSBtYXAucG9pbnRlcnNbcmVmXSkge1xuICAgICAgICAgICAgaWYgKChpZHggPSBwb2ludGVycy5pbmRleE9mKGtleXBhdGgpKSA+PSAwKSB7XG4gICAgICAgICAgICAgIHBvaW50ZXJzLnNwbGljZShpZHgsIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFwb2ludGVycy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgZGVsZXRlIG1hcC5wb2ludGVyc1tyZWZdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2xlYW51cFdlYWtSZWZlcmVuY2UobWFwLCBvYmpbdGhpcy5pZF0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgb2JzZXJ2ZTogZnVuY3Rpb24ob2JqLCBrZXlwYXRoLCBjYWxsYmFjaykge1xuICAgICAgdmFyIGNhbGxiYWNrcywgZGVzYywgdmFsdWU7XG4gICAgICBjYWxsYmFja3MgPSB0aGlzLndlYWtSZWZlcmVuY2Uob2JqKS5jYWxsYmFja3M7XG4gICAgICBpZiAoY2FsbGJhY2tzW2tleXBhdGhdID09IG51bGwpIHtcbiAgICAgICAgY2FsbGJhY2tzW2tleXBhdGhdID0gW107XG4gICAgICAgIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iaiwga2V5cGF0aCk7XG4gICAgICAgIGlmICghKChkZXNjICE9IG51bGwgPyBkZXNjLmdldCA6IHZvaWQgMCkgfHwgKGRlc2MgIT0gbnVsbCA/IGRlc2Muc2V0IDogdm9pZCAwKSkpIHtcbiAgICAgICAgICB2YWx1ZSA9IG9ialtrZXlwYXRoXTtcbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXlwYXRoLCB7XG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihuZXdWYWx1ZSkge1xuICAgICAgICAgICAgICAgIHZhciBjYiwgbWFwLCBfaSwgX2xlbiwgX3JlZjE7XG4gICAgICAgICAgICAgICAgaWYgKG5ld1ZhbHVlICE9PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgX3RoaXMudW5vYnNlcnZlTXV0YXRpb25zKHZhbHVlLCBvYmpbX3RoaXMuaWRdLCBrZXlwYXRoKTtcbiAgICAgICAgICAgICAgICAgIHZhbHVlID0gbmV3VmFsdWU7XG4gICAgICAgICAgICAgICAgICBpZiAobWFwID0gX3RoaXMud2Vha21hcFtvYmpbX3RoaXMuaWRdXSkge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3MgPSBtYXAuY2FsbGJhY2tzO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2tzW2tleXBhdGhdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgX3JlZjEgPSBjYWxsYmFja3Nba2V5cGF0aF0uc2xpY2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYxLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYiA9IF9yZWYxW19pXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChfX2luZGV4T2YuY2FsbChjYWxsYmFja3Nba2V5cGF0aF0sIGNiKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNiKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfdGhpcy5vYnNlcnZlTXV0YXRpb25zKG5ld1ZhbHVlLCBvYmpbX3RoaXMuaWRdLCBrZXlwYXRoKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KSh0aGlzKVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoX19pbmRleE9mLmNhbGwoY2FsbGJhY2tzW2tleXBhdGhdLCBjYWxsYmFjaykgPCAwKSB7XG4gICAgICAgIGNhbGxiYWNrc1trZXlwYXRoXS5wdXNoKGNhbGxiYWNrKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLm9ic2VydmVNdXRhdGlvbnMob2JqW2tleXBhdGhdLCBvYmpbdGhpcy5pZF0sIGtleXBhdGgpO1xuICAgIH0sXG4gICAgdW5vYnNlcnZlOiBmdW5jdGlvbihvYmosIGtleXBhdGgsIGNhbGxiYWNrKSB7XG4gICAgICB2YXIgY2FsbGJhY2tzLCBpZHgsIG1hcDtcbiAgICAgIGlmIChtYXAgPSB0aGlzLndlYWttYXBbb2JqW3RoaXMuaWRdXSkge1xuICAgICAgICBpZiAoY2FsbGJhY2tzID0gbWFwLmNhbGxiYWNrc1trZXlwYXRoXSkge1xuICAgICAgICAgIGlmICgoaWR4ID0gY2FsbGJhY2tzLmluZGV4T2YoY2FsbGJhY2spKSA+PSAwKSB7XG4gICAgICAgICAgICBjYWxsYmFja3Muc3BsaWNlKGlkeCwgMSk7XG4gICAgICAgICAgICBpZiAoIWNhbGxiYWNrcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgZGVsZXRlIG1hcC5jYWxsYmFja3Nba2V5cGF0aF07XG4gICAgICAgICAgICAgIHRoaXMudW5vYnNlcnZlTXV0YXRpb25zKG9ialtrZXlwYXRoXSwgb2JqW3RoaXMuaWRdLCBrZXlwYXRoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRoaXMuY2xlYW51cFdlYWtSZWZlcmVuY2UobWFwLCBvYmpbdGhpcy5pZF0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBnZXQ6IGZ1bmN0aW9uKG9iaiwga2V5cGF0aCkge1xuICAgICAgcmV0dXJuIG9ialtrZXlwYXRoXTtcbiAgICB9LFxuICAgIHNldDogZnVuY3Rpb24ob2JqLCBrZXlwYXRoLCB2YWx1ZSkge1xuICAgICAgcmV0dXJuIG9ialtrZXlwYXRoXSA9IHZhbHVlO1xuICAgIH1cbiAgfTtcblxuICBSaXZldHMuZmFjdG9yeSA9IGZ1bmN0aW9uKHNpZ2h0Z2xhc3MpIHtcbiAgICBSaXZldHMuc2lnaHRnbGFzcyA9IHNpZ2h0Z2xhc3M7XG4gICAgUml2ZXRzW1wicHVibGljXCJdLl8gPSBSaXZldHM7XG4gICAgcmV0dXJuIFJpdmV0c1tcInB1YmxpY1wiXTtcbiAgfTtcblxuICBpZiAodHlwZW9mICh0eXBlb2YgbW9kdWxlICE9PSBcInVuZGVmaW5lZFwiICYmIG1vZHVsZSAhPT0gbnVsbCA/IG1vZHVsZS5leHBvcnRzIDogdm9pZCAwKSA9PT0gJ29iamVjdCcpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IFJpdmV0cy5mYWN0b3J5KHJlcXVpcmUoJ3NpZ2h0Z2xhc3MnKSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKFsnc2lnaHRnbGFzcyddLCBmdW5jdGlvbihzaWdodGdsYXNzKSB7XG4gICAgICByZXR1cm4gdGhpcy5yaXZldHMgPSBSaXZldHMuZmFjdG9yeShzaWdodGdsYXNzKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLnJpdmV0cyA9IFJpdmV0cy5mYWN0b3J5KHNpZ2h0Z2xhc3MpO1xuICB9XG5cbn0pLmNhbGwodGhpcyk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gIC8vIFB1YmxpYyBzaWdodGdsYXNzIGludGVyZmFjZS5cbiAgZnVuY3Rpb24gc2lnaHRnbGFzcyhvYmosIGtleXBhdGgsIGNhbGxiYWNrLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZlcihvYmosIGtleXBhdGgsIGNhbGxiYWNrLCBvcHRpb25zKVxuICB9XG5cbiAgLy8gQmF0dGVyaWVzIG5vdCBpbmNsdWRlZC5cbiAgc2lnaHRnbGFzcy5hZGFwdGVycyA9IHt9XG5cbiAgLy8gQ29uc3RydWN0cyBhIG5ldyBrZXlwYXRoIG9ic2VydmVyIGFuZCBraWNrcyB0aGluZ3Mgb2ZmLlxuICBmdW5jdGlvbiBPYnNlcnZlcihvYmosIGtleXBhdGgsIGNhbGxiYWNrLCBvcHRpb25zKSB7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuICAgIHRoaXMub3B0aW9ucy5hZGFwdGVycyA9IHRoaXMub3B0aW9ucy5hZGFwdGVycyB8fCB7fVxuICAgIHRoaXMub2JqID0gb2JqXG4gICAgdGhpcy5rZXlwYXRoID0ga2V5cGF0aFxuICAgIHRoaXMuY2FsbGJhY2sgPSBjYWxsYmFja1xuICAgIHRoaXMub2JqZWN0UGF0aCA9IFtdXG4gICAgdGhpcy51cGRhdGUgPSB0aGlzLnVwZGF0ZS5iaW5kKHRoaXMpXG4gICAgdGhpcy5wYXJzZSgpXG5cbiAgICBpZiAoaXNPYmplY3QodGhpcy50YXJnZXQgPSB0aGlzLnJlYWxpemUoKSkpIHtcbiAgICAgIHRoaXMuc2V0KHRydWUsIHRoaXMua2V5LCB0aGlzLnRhcmdldCwgdGhpcy5jYWxsYmFjaylcbiAgICB9XG4gIH1cblxuICAvLyBUb2tlbml6ZXMgdGhlIHByb3ZpZGVkIGtleXBhdGggc3RyaW5nIGludG8gaW50ZXJmYWNlICsgcGF0aCB0b2tlbnMgZm9yIHRoZVxuICAvLyBvYnNlcnZlciB0byB3b3JrIHdpdGguXG4gIE9ic2VydmVyLnRva2VuaXplID0gZnVuY3Rpb24oa2V5cGF0aCwgaW50ZXJmYWNlcywgcm9vdCkge1xuICAgIHZhciB0b2tlbnMgPSBbXVxuICAgIHZhciBjdXJyZW50ID0ge2k6IHJvb3QsIHBhdGg6ICcnfVxuICAgIHZhciBpbmRleCwgY2hyXG5cbiAgICBmb3IgKGluZGV4ID0gMDsgaW5kZXggPCBrZXlwYXRoLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgY2hyID0ga2V5cGF0aC5jaGFyQXQoaW5kZXgpXG5cbiAgICAgIGlmICghIX5pbnRlcmZhY2VzLmluZGV4T2YoY2hyKSkge1xuICAgICAgICB0b2tlbnMucHVzaChjdXJyZW50KVxuICAgICAgICBjdXJyZW50ID0ge2k6IGNociwgcGF0aDogJyd9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjdXJyZW50LnBhdGggKz0gY2hyXG4gICAgICB9XG4gICAgfVxuXG4gICAgdG9rZW5zLnB1c2goY3VycmVudClcbiAgICByZXR1cm4gdG9rZW5zXG4gIH1cblxuICAvLyBQYXJzZXMgdGhlIGtleXBhdGggdXNpbmcgdGhlIGludGVyZmFjZXMgZGVmaW5lZCBvbiB0aGUgdmlldy4gU2V0cyB2YXJpYWJsZXNcbiAgLy8gZm9yIHRoZSB0b2tlbml6ZWQga2V5cGF0aCBhcyB3ZWxsIGFzIHRoZSBlbmQga2V5LlxuICBPYnNlcnZlci5wcm90b3R5cGUucGFyc2UgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaW50ZXJmYWNlcyA9IHRoaXMuaW50ZXJmYWNlcygpXG4gICAgdmFyIHJvb3QsIHBhdGhcblxuICAgIGlmICghaW50ZXJmYWNlcy5sZW5ndGgpIHtcbiAgICAgIGVycm9yKCdNdXN0IGRlZmluZSBhdCBsZWFzdCBvbmUgYWRhcHRlciBpbnRlcmZhY2UuJylcbiAgICB9XG5cbiAgICBpZiAoISF+aW50ZXJmYWNlcy5pbmRleE9mKHRoaXMua2V5cGF0aFswXSkpIHtcbiAgICAgIHJvb3QgPSB0aGlzLmtleXBhdGhbMF1cbiAgICAgIHBhdGggPSB0aGlzLmtleXBhdGguc3Vic3RyKDEpXG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0eXBlb2YgKHJvb3QgPSB0aGlzLm9wdGlvbnMucm9vdCB8fCBzaWdodGdsYXNzLnJvb3QpID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBlcnJvcignTXVzdCBkZWZpbmUgYSBkZWZhdWx0IHJvb3QgYWRhcHRlci4nKVxuICAgICAgfVxuXG4gICAgICBwYXRoID0gdGhpcy5rZXlwYXRoXG4gICAgfVxuXG4gICAgdGhpcy50b2tlbnMgPSBPYnNlcnZlci50b2tlbml6ZShwYXRoLCBpbnRlcmZhY2VzLCByb290KVxuICAgIHRoaXMua2V5ID0gdGhpcy50b2tlbnMucG9wKClcbiAgfVxuXG4gIC8vIFJlYWxpemVzIHRoZSBmdWxsIGtleXBhdGgsIGF0dGFjaGluZyBvYnNlcnZlcnMgZm9yIGV2ZXJ5IGtleSBhbmQgY29ycmVjdGluZ1xuICAvLyBvbGQgb2JzZXJ2ZXJzIHRvIGFueSBjaGFuZ2VkIG9iamVjdHMgaW4gdGhlIGtleXBhdGguXG4gIE9ic2VydmVyLnByb3RvdHlwZS5yZWFsaXplID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGN1cnJlbnQgPSB0aGlzLm9ialxuICAgIHZhciB1bnJlYWNoZWQgPSBmYWxzZVxuICAgIHZhciBwcmV2XG5cbiAgICB0aGlzLnRva2Vucy5mb3JFYWNoKGZ1bmN0aW9uKHRva2VuLCBpbmRleCkge1xuICAgICAgaWYgKGlzT2JqZWN0KGN1cnJlbnQpKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5vYmplY3RQYXRoW2luZGV4XSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICBpZiAoY3VycmVudCAhPT0gKHByZXYgPSB0aGlzLm9iamVjdFBhdGhbaW5kZXhdKSkge1xuICAgICAgICAgICAgdGhpcy5zZXQoZmFsc2UsIHRva2VuLCBwcmV2LCB0aGlzLnVwZGF0ZSlcbiAgICAgICAgICAgIHRoaXMuc2V0KHRydWUsIHRva2VuLCBjdXJyZW50LCB0aGlzLnVwZGF0ZSlcbiAgICAgICAgICAgIHRoaXMub2JqZWN0UGF0aFtpbmRleF0gPSBjdXJyZW50XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuc2V0KHRydWUsIHRva2VuLCBjdXJyZW50LCB0aGlzLnVwZGF0ZSlcbiAgICAgICAgICB0aGlzLm9iamVjdFBhdGhbaW5kZXhdID0gY3VycmVudFxuICAgICAgICB9XG5cbiAgICAgICAgY3VycmVudCA9IHRoaXMuZ2V0KHRva2VuLCBjdXJyZW50KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHVucmVhY2hlZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICB1bnJlYWNoZWQgPSBpbmRleFxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHByZXYgPSB0aGlzLm9iamVjdFBhdGhbaW5kZXhdKSB7XG4gICAgICAgICAgdGhpcy5zZXQoZmFsc2UsIHRva2VuLCBwcmV2LCB0aGlzLnVwZGF0ZSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIHRoaXMpXG5cbiAgICBpZiAodW5yZWFjaGVkICE9PSBmYWxzZSkge1xuICAgICAgdGhpcy5vYmplY3RQYXRoLnNwbGljZSh1bnJlYWNoZWQpXG4gICAgfVxuXG4gICAgcmV0dXJuIGN1cnJlbnRcbiAgfVxuXG4gIC8vIFVwZGF0ZXMgdGhlIGtleXBhdGguIFRoaXMgaXMgY2FsbGVkIHdoZW4gYW55IGludGVybWVkaWFyeSBrZXkgaXMgY2hhbmdlZC5cbiAgT2JzZXJ2ZXIucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBuZXh0LCBvbGRWYWx1ZVxuXG4gICAgaWYgKChuZXh0ID0gdGhpcy5yZWFsaXplKCkpICE9PSB0aGlzLnRhcmdldCkge1xuICAgICAgaWYgKGlzT2JqZWN0KHRoaXMudGFyZ2V0KSkge1xuICAgICAgICB0aGlzLnNldChmYWxzZSwgdGhpcy5rZXksIHRoaXMudGFyZ2V0LCB0aGlzLmNhbGxiYWNrKVxuICAgICAgfVxuXG4gICAgICBpZiAoaXNPYmplY3QobmV4dCkpIHtcbiAgICAgICAgdGhpcy5zZXQodHJ1ZSwgdGhpcy5rZXksIG5leHQsIHRoaXMuY2FsbGJhY2spXG4gICAgICB9XG5cbiAgICAgIG9sZFZhbHVlID0gdGhpcy52YWx1ZSgpXG4gICAgICB0aGlzLnRhcmdldCA9IG5leHRcblxuICAgICAgLy8gQWx3YXlzIGNhbGwgY2FsbGJhY2sgaWYgdmFsdWUgaXMgYSBmdW5jdGlvbi4gSWYgbm90IGEgZnVuY3Rpb24sIGNhbGwgY2FsbGJhY2sgb25seSBpZiB2YWx1ZSBjaGFuZ2VkXG4gICAgICBpZiAodGhpcy52YWx1ZSgpIGluc3RhbmNlb2YgRnVuY3Rpb24gfHwgdGhpcy52YWx1ZSgpICE9PSBvbGRWYWx1ZSkgdGhpcy5jYWxsYmFjaygpXG4gICAgfVxuICB9XG5cbiAgLy8gUmVhZHMgdGhlIGN1cnJlbnQgZW5kIHZhbHVlIG9mIHRoZSBvYnNlcnZlZCBrZXlwYXRoLiBSZXR1cm5zIHVuZGVmaW5lZCBpZlxuICAvLyB0aGUgZnVsbCBrZXlwYXRoIGlzIHVucmVhY2hhYmxlLlxuICBPYnNlcnZlci5wcm90b3R5cGUudmFsdWUgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoaXNPYmplY3QodGhpcy50YXJnZXQpKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXQodGhpcy5rZXksIHRoaXMudGFyZ2V0KVxuICAgIH1cbiAgfVxuXG4gIC8vIFNldHMgdGhlIGN1cnJlbnQgZW5kIHZhbHVlIG9mIHRoZSBvYnNlcnZlZCBrZXlwYXRoLiBDYWxsaW5nIHNldFZhbHVlIHdoZW5cbiAgLy8gdGhlIGZ1bGwga2V5cGF0aCBpcyB1bnJlYWNoYWJsZSBpcyBhIG5vLW9wLlxuICBPYnNlcnZlci5wcm90b3R5cGUuc2V0VmFsdWUgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIGlmIChpc09iamVjdCh0aGlzLnRhcmdldCkpIHtcbiAgICAgIHRoaXMuYWRhcHRlcih0aGlzLmtleSkuc2V0KHRoaXMudGFyZ2V0LCB0aGlzLmtleS5wYXRoLCB2YWx1ZSlcbiAgICB9XG4gIH1cblxuICAvLyBHZXRzIHRoZSBwcm92aWRlZCBrZXkgb24gYW4gb2JqZWN0LlxuICBPYnNlcnZlci5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24oa2V5LCBvYmopIHtcbiAgICByZXR1cm4gdGhpcy5hZGFwdGVyKGtleSkuZ2V0KG9iaiwga2V5LnBhdGgpXG4gIH1cblxuICAvLyBPYnNlcnZlcyBvciB1bm9ic2VydmVzIGEgY2FsbGJhY2sgb24gdGhlIG9iamVjdCB1c2luZyB0aGUgcHJvdmlkZWQga2V5LlxuICBPYnNlcnZlci5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24oYWN0aXZlLCBrZXksIG9iaiwgY2FsbGJhY2spIHtcbiAgICB2YXIgYWN0aW9uID0gYWN0aXZlID8gJ29ic2VydmUnIDogJ3Vub2JzZXJ2ZSdcbiAgICB0aGlzLmFkYXB0ZXIoa2V5KVthY3Rpb25dKG9iaiwga2V5LnBhdGgsIGNhbGxiYWNrKVxuICB9XG5cbiAgLy8gUmV0dXJucyBhbiBhcnJheSBvZiBhbGwgdW5pcXVlIGFkYXB0ZXIgaW50ZXJmYWNlcyBhdmFpbGFibGUuXG4gIE9ic2VydmVyLnByb3RvdHlwZS5pbnRlcmZhY2VzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGludGVyZmFjZXMgPSBPYmplY3Qua2V5cyh0aGlzLm9wdGlvbnMuYWRhcHRlcnMpXG5cbiAgICBPYmplY3Qua2V5cyhzaWdodGdsYXNzLmFkYXB0ZXJzKS5mb3JFYWNoKGZ1bmN0aW9uKGkpIHtcbiAgICAgIGlmICghfmludGVyZmFjZXMuaW5kZXhPZihpKSkge1xuICAgICAgICBpbnRlcmZhY2VzLnB1c2goaSlcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgcmV0dXJuIGludGVyZmFjZXNcbiAgfVxuXG4gIC8vIENvbnZlbmllbmNlIGZ1bmN0aW9uIHRvIGdyYWIgdGhlIGFkYXB0ZXIgZm9yIGEgc3BlY2lmaWMga2V5LlxuICBPYnNlcnZlci5wcm90b3R5cGUuYWRhcHRlciA9IGZ1bmN0aW9uKGtleSkge1xuICAgIHJldHVybiB0aGlzLm9wdGlvbnMuYWRhcHRlcnNba2V5LmldIHx8XG4gICAgICBzaWdodGdsYXNzLmFkYXB0ZXJzW2tleS5pXVxuICB9XG5cbiAgLy8gVW5vYnNlcnZlcyB0aGUgZW50aXJlIGtleXBhdGguXG4gIE9ic2VydmVyLnByb3RvdHlwZS51bm9ic2VydmUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgb2JqXG5cbiAgICB0aGlzLnRva2Vucy5mb3JFYWNoKGZ1bmN0aW9uKHRva2VuLCBpbmRleCkge1xuICAgICAgaWYgKG9iaiA9IHRoaXMub2JqZWN0UGF0aFtpbmRleF0pIHtcbiAgICAgICAgdGhpcy5zZXQoZmFsc2UsIHRva2VuLCBvYmosIHRoaXMudXBkYXRlKVxuICAgICAgfVxuICAgIH0sIHRoaXMpXG5cbiAgICBpZiAoaXNPYmplY3QodGhpcy50YXJnZXQpKSB7XG4gICAgICB0aGlzLnNldChmYWxzZSwgdGhpcy5rZXksIHRoaXMudGFyZ2V0LCB0aGlzLmNhbGxiYWNrKVxuICAgIH1cbiAgfVxuXG4gIC8vIENoZWNrIGlmIGEgdmFsdWUgaXMgYW4gb2JqZWN0IHRoYW4gY2FuIGJlIG9ic2VydmVkLlxuICBmdW5jdGlvbiBpc09iamVjdChvYmopIHtcbiAgICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gJ29iamVjdCcgJiYgb2JqICE9PSBudWxsXG4gIH1cblxuICAvLyBFcnJvciB0aHJvd2VyLlxuICBmdW5jdGlvbiBlcnJvcihtZXNzYWdlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdbc2lnaHRnbGFzc10gJyArIG1lc3NhZ2UpXG4gIH1cblxuICAvLyBFeHBvcnQgbW9kdWxlIGZvciBOb2RlIGFuZCB0aGUgYnJvd3Nlci5cbiAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBzaWdodGdsYXNzXG4gIH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKFtdLCBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnNpZ2h0Z2xhc3MgPSBzaWdodGdsYXNzXG4gICAgfSlcbiAgfSBlbHNlIHtcbiAgICB0aGlzLnNpZ2h0Z2xhc3MgPSBzaWdodGdsYXNzXG4gIH1cbn0pLmNhbGwodGhpcyk7XG4iLCIndXNlIHN0cmljdCc7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChzdHIpIHtcblx0cmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudChzdHIpLnJlcGxhY2UoL1shJygpKl0vZywgZnVuY3Rpb24gKGMpIHtcblx0XHRyZXR1cm4gJyUnICsgYy5jaGFyQ29kZUF0KDApLnRvU3RyaW5nKDE2KS50b1VwcGVyQ2FzZSgpO1xuXHR9KTtcbn07XG4iXX0=
