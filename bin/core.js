'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = require('path');

var _bluebird = require('bluebird');

var _events = require('events');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _tools = require('./tools.js');

var _tools2 = _interopRequireDefault(_tools);

var _offline = require('./authenticator/offline.js');

var _offline2 = _interopRequireDefault(_offline);

var _loader = require('./loader.js');

var _loader2 = _interopRequireDefault(_loader);

var _launch = require('./launch.js');

var _launch2 = _interopRequireDefault(_launch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var readdir = (0, _bluebird.promisify)(_fs2.default.readdir);

var MCLauncher = function (_Loader) {
  _inherits(MCLauncher, _Loader);

  function MCLauncher(opts, dir, e) {
    _classCallCheck(this, MCLauncher);

    if (typeof opts === 'string') opts = { java: opts };
    if ((typeof opts === 'undefined' ? 'undefined' : _typeof(opts)) !== 'object') opts = {};
    if (dir) opts.root = dir;
    if (e) opts.event = e;
    if (!opts.root) opts.root = './.minecraft';
    opts.root = (0, _path.resolve)(opts.root);
    if (!_fs2.default.statSync(opts.root).isDirectory()) throw new Error('non-existent ' + opts.root);

    var _this = _possibleConstructorReturn(this, (MCLauncher.__proto__ || Object.getPrototypeOf(MCLauncher)).call(this, opts.root));

    _this._validate = false;

    _this.root = opts.root;
    _this.java = opts.java;
    _this.env = opts.env;
    if (opts.event) {
      _this._event = new _events.EventEmitter();
      opts.event(_this._event);
    }
    return _this;
  }

  _createClass(MCLauncher, [{
    key: 'getVersions',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var file, array, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, id, dir;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                file = this.root + '/versions';
                _context.next = 3;
                return _tools2.default.stat(file);

              case 3:
                if (_context.sent.isDirectory()) {
                  _context.next = 5;
                  break;
                }

                return _context.abrupt('return', []);

              case 5:
                array = [];
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context.prev = 9;
                _context.next = 12;
                return readdir(file);

              case 12:
                _context.t0 = Symbol.iterator;
                _iterator = _context.sent[_context.t0]();

              case 14:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context.next = 29;
                  break;
                }

                id = _step.value;
                dir = file + '/' + id;
                _context.next = 19;
                return _tools2.default.stat(dir);

              case 19:
                _context.t1 = _context.sent.isDirectory();

                if (!_context.t1) {
                  _context.next = 24;
                  break;
                }

                _context.next = 23;
                return _tools2.default.stat(dir + '/' + id + '.json');

              case 23:
                _context.t1 = _context.sent.isFile();

              case 24:
                if (!_context.t1) {
                  _context.next = 26;
                  break;
                }

                array.push(id);

              case 26:
                _iteratorNormalCompletion = true;
                _context.next = 14;
                break;

              case 29:
                _context.next = 35;
                break;

              case 31:
                _context.prev = 31;
                _context.t2 = _context['catch'](9);
                _didIteratorError = true;
                _iteratorError = _context.t2;

              case 35:
                _context.prev = 35;
                _context.prev = 36;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 38:
                _context.prev = 38;

                if (!_didIteratorError) {
                  _context.next = 41;
                  break;
                }

                throw _iteratorError;

              case 41:
                return _context.finish(38);

              case 42:
                return _context.finish(35);

              case 43:
                return _context.abrupt('return', array);

              case 44:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[9, 31, 35, 43], [36,, 38, 42]]);
      }));

      function getVersions() {
        return _ref.apply(this, arguments);
      }

      return getVersions;
    }()
  }, {
    key: 'setRoot',
    value: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(root) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                root = (0, _path.resolve)(root);
                _context2.next = 3;
                return _tools2.default.stat(root);

              case 3:
                if (_context2.sent.isDirectory()) {
                  _context2.next = 5;
                  break;
                }

                throw new Error('non-existent ' + root);

              case 5:
                this.root = root;

              case 6:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function setRoot(_x) {
        return _ref2.apply(this, arguments);
      }

      return setRoot;
    }()
  }, {
    key: 'getRoot',
    value: function getRoot() {
      return this.root;
    }
  }, {
    key: 'setJava',
    value: function setJava(java) {
      this._validate = false;
      this.java = java;
    }
  }, {
    key: 'getJava',
    value: function getJava() {
      return this.java;
    }
  }, {
    key: 'getEmtter',
    value: function getEmtter() {
      if (!this._event) {
        this._event = new _events.EventEmitter();
      }
      return this._event;
    }
  }, {
    key: 'launch',
    value: function () {
      var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(conf, authenticator) {
        var java;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!(!conf || !conf.version && !conf.id)) {
                  _context3.next = 2;
                  break;
                }

                throw new Error('There is no need to fill in the need to start the version');

              case 2:
                if (conf.id) {
                  conf = { version: conf };
                }
                if (authenticator) {
                  conf.authenticator = authenticator;
                }
                if (!conf.authenticator) {
                  conf.authenticator = new _offline2.default('Steve');
                }
                if (!conf.versionType) {
                  conf.versionType = '§eMCLauncher';
                }
                _context3.next = 8;
                return this._load(conf.version.toString());

              case 8:
                conf.version = _context3.sent;

                if (this._validate) {
                  _context3.next = 23;
                  break;
                }

                _context3.t0 = !this.java;

                if (_context3.t0) {
                  _context3.next = 15;
                  break;
                }

                _context3.next = 14;
                return _tools2.default.stat(this.java);

              case 14:
                _context3.t0 = !_context3.sent.isFile();

              case 15:
                if (!_context3.t0) {
                  _context3.next = 23;
                  break;
                }

                _context3.next = 18;
                return _tools2.default.findJavaFast(this.env);

              case 18:
                java = _context3.sent;

                if (java) {
                  _context3.next = 21;
                  break;
                }

                throw new Error('cannot find java');

              case 21:
                this.java = java;
                this._validate = true;

              case 23:
                _context3.next = 25;
                return _launch2.default.bind(this, conf)();

              case 25:
                return _context3.abrupt('return', _context3.sent);

              case 26:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function launch(_x2, _x3) {
        return _ref3.apply(this, arguments);
      }

      return launch;
    }()
  }]);

  return MCLauncher;
}(_loader2.default);

exports.default = MCLauncher;