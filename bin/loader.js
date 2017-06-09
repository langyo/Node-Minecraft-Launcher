'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = require('path');

var _bluebird = require('bluebird');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _tools = require('./tools.js');

var _tools2 = _interopRequireDefault(_tools);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var readFile = (0, _bluebird.promisify)(_fs2.default.readFile);

var ifAllowed = function ifAllowed(rules) {
  if (!rules || rules.length < 1) {
    return true;
  }
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = rules[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var rule = _step.value;

      if (!rule.os && rule.action === 'allow') {
        return true;
      }
      if (rule.os.name === _tools2.default.systemType) {
        return rule.action === 'allow';
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
};

var Loader = function () {
  function Loader(root) {
    _classCallCheck(this, Loader);

    this._allVersions = new Map();

    this.root = root;
  }

  _createClass(Loader, [{
    key: '_load',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(id) {
        var _this = this;

        var file, json, ver, reg1, reg2, target;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!this._allVersions.has(id)) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt('return', this._allVersions.get(id));

              case 2:
                file = (0, _path.join)(this.root, 'versions', id, id + '.json');
                _context.next = 5;
                return _tools2.default.stat(file);

              case 5:
                if (_context.sent.isFile()) {
                  _context.next = 7;
                  break;
                }

                throw new Error('No such version was found: ' + id);

              case 7:
                _context.t0 = JSON;
                _context.next = 10;
                return readFile(file);

              case 10:
                _context.t1 = _context.sent;
                json = _context.t0.parse.call(_context.t0, _context.t1);

                if (!(!json.id || !json.minecraftArguments || !json.mainClass || !json.libraries)) {
                  _context.next = 14;
                  break;
                }

                throw new Error('JSON format is not correct');

              case 14:
                json.assets = json.assets || 'legacy';
                ver = {
                  libraries: [],
                  natives: [],
                  id: json.id,
                  minecraftArguments: json.minecraftArguments,
                  assets: json.assets,
                  mainClass: json.mainClass
                };
                reg1 = /\\/g;
                reg2 = /\./g;

                json.libraries.forEach(function (lib) {
                  if (!lib.name) {
                    return;
                  }
                  var names = lib.name.split(':');
                  if (names.length !== 3 || !ifAllowed(lib.rules)) {
                    return;
                  }
                  var libPath = (0, _path.join)(_this.root, 'libraries');
                  if (lib.natives) {
                    /* eslint-disable no-template-curly-in-string */
                    var name = (0, _path.join)(names[0].replace(reg2, '/'), names[1], names[2], names[1] + '-' + names[2] + '-' + lib.natives[_tools2.default.systemType].replace('${arch}', _tools2.default.arch) + '.jar').replace(reg1, '/'
                    /* eslint-enable */
                    );ver.natives.push({
                      name: name,
                      path: (0, _path.join)(libPath, name),
                      exclude: lib.extract ? lib.extract.exclude : [],
                      url: lib.url
                    });
                  } else {
                    var libname = (0, _path.join)(names[0].replace(reg2, '/'), names[1], names[2], names[1] + '-' + names[2] + '.jar').replace(reg1, '/');
                    ver.libraries.push({
                      name: libname,
                      path: (0, _path.join)(libPath, libname),
                      url: lib.url
                    });
                  }
                });

                if (!json.inheritsFrom) {
                  _context.next = 31;
                  break;
                }

                _context.next = 22;
                return this._load(json.inheritsFrom);

              case 22:
                target = _context.sent;

                if (target) {
                  _context.next = 25;
                  break;
                }

                throw new Error('Missing version: ' + json.inheritsFrom);

              case 25:
                if (ver.assets === 'legacy' && target.assets && target.assets !== 'legacy') {
                  ver.assets = target.assets;
                }
                if (target.id) {
                  ver.id = target.id;
                }
                if (!ver.mainClass) {
                  ver.mainClass = target.mainClass;
                }
                if (!ver.minecraftArguments) {
                  ver.MinecraftArguments = target.minecraftArguments;
                }
                ver.natives = ver.natives.concat(target.natives);
                ver.libraries = ver.libraries.concat(target.libraries);

              case 31:
                this._allVersions.set(id, ver);
                return _context.abrupt('return', ver);

              case 33:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function _load(_x) {
        return _ref.apply(this, arguments);
      }

      return _load;
    }()
  }]);

  return Loader;
}();

exports.default = Loader;