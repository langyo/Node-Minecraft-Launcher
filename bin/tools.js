'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _os = require('os');

var _path = require('path');

var _fs = require('fs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var exec = _bluebird2.default.promisify(require('child_process').exec);

var systemType = 'linux';
switch ((0, _os.platform)()) {
  case 'win32':
    systemType = 'windows';
    break;
  case 'darwin':
    systemType = 'osx';
}

var statError = function statError() {
  return false;
};

var statReturn = {
  isFile: statError,
  isDirectory: statError
};

exports.default = {
  systemType: systemType,
  arch: process.config.variables.host_arch === 'x64' ? 64 : 32,
  stat: function stat(path) {
    return new _bluebird2.default(function (resolve) {
      return (0, _fs.stat)(path, function (err, re) {
        return resolve(err ? statReturn : re);
      });
    });
  },
  findJava: function findJava() {
    var _this = this;

    return _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
      var re, env, file, _file, env_;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              re = [];
              env = process.env.JAVA_HOME;

              if (!(systemType === 'windows')) {
                _context.next = 23;
                break;
              }

              if (!env) {
                _context.next = 9;
                break;
              }

              file = (0, _path.join)(env, 'bin/java.exe');
              _context.next = 7;
              return _this.stat(file);

            case 7:
              if (!_context.sent.isFile()) {
                _context.next = 9;
                break;
              }

              re.push(file);

            case 9:
              _context.t0 = Array;
              _context.t1 = Set;
              _context.t2 = re;
              _context.next = 14;
              return _this.findJavaInternal('Wow6432Node\\');

            case 14:
              _context.t3 = _context.sent;
              _context.next = 17;
              return _this.findJavaInternal();

            case 17:
              _context.t4 = _context.sent;
              _context.t5 = _context.t2.concat.call(_context.t2, _context.t3, _context.t4);
              _context.t6 = new _context.t1(_context.t5);
              return _context.abrupt('return', _context.t0.from.call(_context.t0, _context.t6));

            case 23:
              _file = (0, _path.resolve)('/bin/java');
              _context.next = 26;
              return _this.stat(_file);

            case 26:
              if (!_context.sent.isFile()) {
                _context.next = 28;
                break;
              }

              re.push(_file);

            case 28:
              if (!(env && env !== '/bin/java')) {
                _context.next = 41;
                break;
              }

              env = (0, _path.resolve)(env);
              env_ = (0, _path.join)(env, 'bin/java');
              _context.next = 33;
              return _this.stat(env);

            case 33:
              if (!_context.sent.isFile()) {
                _context.next = 37;
                break;
              }

              re.push(env);
              _context.next = 41;
              break;

            case 37:
              _context.next = 39;
              return _this.stat(env_);

            case 39:
              if (!_context.sent.isFile()) {
                _context.next = 41;
                break;
              }

              re.push(env_);

            case 41:
              return _context.abrupt('return', re);

            case 42:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this);
    }))();
  },
  findJavaInternal: function findJavaInternal(key) {
    var _this2 = this;

    return _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
      var java, array, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, q, u, file;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return exec('REG QUERY "HKEY_LOCAL_MACHINE\\SOFTWARE\\' + (key || '') + 'JavaSoft\\Java Runtime Environment"');

            case 2:
              java = _context2.sent;

              if (java) {
                _context2.next = 5;
                break;
              }

              return _context2.abrupt('return', []);

            case 5:
              java = java.split('\r\n\r\n');

              if (!(java.length !== 2)) {
                _context2.next = 8;
                break;
              }

              return _context2.abrupt('return', []);

            case 8:
              array = [];
              _iteratorNormalCompletion = true;
              _didIteratorError = false;
              _iteratorError = undefined;
              _context2.prev = 12;
              _iterator = java[1].split('\r\n')[Symbol.iterator]();

            case 14:
              if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                _context2.next = 32;
                break;
              }

              q = _step.value;

              if (!q) {
                _context2.next = 29;
                break;
              }

              _context2.next = 19;
              return exec('REG QUERY "' + q + '" /v JavaHome');

            case 19:
              u = _context2.sent;

              if (u) {
                _context2.next = 22;
                break;
              }

              return _context2.abrupt('continue', 29);

            case 22:
              u = u.split('    ');

              if (!(u.length === 4)) {
                _context2.next = 29;
                break;
              }

              file = u[3].replace('\r\n\r\n', '') + '\\bin\\java.exe';
              _context2.next = 27;
              return _this2.stat(file);

            case 27:
              if (!_context2.sent.isFile()) {
                _context2.next = 29;
                break;
              }

              array.push(file);

            case 29:
              _iteratorNormalCompletion = true;
              _context2.next = 14;
              break;

            case 32:
              _context2.next = 38;
              break;

            case 34:
              _context2.prev = 34;
              _context2.t0 = _context2['catch'](12);
              _didIteratorError = true;
              _iteratorError = _context2.t0;

            case 38:
              _context2.prev = 38;
              _context2.prev = 39;

              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }

            case 41:
              _context2.prev = 41;

              if (!_didIteratorError) {
                _context2.next = 44;
                break;
              }

              throw _iteratorError;

            case 44:
              return _context2.finish(41);

            case 45:
              return _context2.finish(38);

            case 46:
              return _context2.abrupt('return', array);

            case 47:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, _this2, [[12, 34, 38, 46], [39,, 41, 45]]);
    }))();
  },
  findJavaFast: function findJavaFast(useEnv, key) {
    var _this3 = this;

    return _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
      var env, file, re, _file2, env_;

      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              env = process.env.JAVA_HOME;

              if (!(systemType === 'windows')) {
                _context3.next = 18;
                break;
              }

              if (!(useEnv && env)) {
                _context3.next = 8;
                break;
              }

              file = (0, _path.join)(env, 'bin/java.exe');
              _context3.next = 6;
              return _this3.stat(file);

            case 6:
              if (!_context3.sent.isFile()) {
                _context3.next = 8;
                break;
              }

              return _context3.abrupt('return', file);

            case 8:
              _context3.next = 10;
              return _this3.findJavaInternal('Wow6432Node\\');

            case 10:
              re = _context3.sent;

              if (!re.length) {
                _context3.next = 13;
                break;
              }

              return _context3.abrupt('return', re[0]);

            case 13:
              _context3.next = 15;
              return _this3.findJavaInternal();

            case 15:
              return _context3.abrupt('return', _context3.sent[0]);

            case 18:
              _file2 = (0, _path.resolve)('/bin/java');
              _context3.next = 21;
              return _this3.stat(_file2);

            case 21:
              if (!_context3.sent.isFile()) {
                _context3.next = 23;
                break;
              }

              return _context3.abrupt('return', _file2);

            case 23:
              if (!(useEnv && env && env !== '/bin/java')) {
                _context3.next = 36;
                break;
              }

              env = (0, _path.resolve)(env);
              env_ = (0, _path.join)(env, 'bin/java');
              _context3.next = 28;
              return _this3.stat(env);

            case 28:
              if (!_context3.sent.isFile()) {
                _context3.next = 32;
                break;
              }

              return _context3.abrupt('return', env);

            case 32:
              _context3.next = 34;
              return _this3.stat(env_);

            case 34:
              if (!_context3.sent.isFile()) {
                _context3.next = 36;
                break;
              }

              return _context3.abrupt('return', env_);

            case 36:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, _this3);
    }))();
  }
};