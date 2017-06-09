'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _child_process = require('child_process');

var _bluebird = require('bluebird');

var _admZip = require('adm-zip');

var _admZip2 = _interopRequireDefault(_admZip);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _tools = require('./tools.js');

var _tools2 = _interopRequireDefault(_tools);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var mkdir = (0, _bluebird.promisify)(_fs2.default.mkdir);

exports.default = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(opts) {
    var _this = this;

    var auth, sb, missLibrary, libraries, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, lib, nativePath, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, native, zip, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, zipEntry, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, i, assetsPath, ma, l, j, launched, time, child;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (this._event) {
              this._event.emit('auth');
            }
            _context.next = 3;
            return opts.authenticator.do();

          case 3:
            auth = _context.sent;

            if (auth) {
              _context.next = 7;
              break;
            }

            if (this._event) {
              this._event.emit('error_auth');
            }
            throw new Error('validation error');

          case 7:
            sb = [];

            if (opts.agentPath) {
              sb.push('-javaagent:' + opts.agentPath);
            }
            if (typeof opts.cgcEnabled === 'undefined' ? true : opts.cgcEnabled) {
              sb.push('-Xincgc');
            }
            if (opts.minMemory > 0) {
              sb.push('-Xms' + opts.minMemory + 'M');
            }
            if (opts.maxMemory > 0) {
              sb.push('-Xmx' + opts.maxMemory + 'M');
            } else {
              sb.push('-Xmx1024M');
            }
            sb.push('-Xmn128m');

            missLibrary = [];
            libraries = [(0, _path.join)(this.root, 'versions', opts.version.id, opts.version.id + '.jar')];
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context.prev = 18;
            _iterator = opts.version.libraries[Symbol.iterator]();

          case 20:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context.next = 32;
              break;
            }

            lib = _step.value;
            _context.next = 24;
            return _tools2.default.stat(lib.path);

          case 24:
            if (!_context.sent.isFile()) {
              _context.next = 28;
              break;
            }

            libraries.push(lib.path);
            _context.next = 29;
            break;

          case 28:
            missLibrary.push(lib);

          case 29:
            _iteratorNormalCompletion = true;
            _context.next = 20;
            break;

          case 32:
            _context.next = 38;
            break;

          case 34:
            _context.prev = 34;
            _context.t0 = _context['catch'](18);
            _didIteratorError = true;
            _iteratorError = _context.t0;

          case 38:
            _context.prev = 38;
            _context.prev = 39;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 41:
            _context.prev = 41;

            if (!_didIteratorError) {
              _context.next = 44;
              break;
            }

            throw _iteratorError;

          case 44:
            return _context.finish(41);

          case 45:
            return _context.finish(38);

          case 46:

            if (this._event) {
              this._event.emit('unzip');
            }

            nativePath = opts.version.id ? (0, _path.join)(this.root, 'versions', opts.version.id, 'natives') : (0, _path.join)(this.root, 'natives');
            _context.next = 50;
            return _tools2.default.stat(nativePath);

          case 50:
            if (_context.sent.isDirectory()) {
              _context.next = 53;
              break;
            }

            _context.next = 53;
            return mkdir(nativePath);

          case 53:
            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context.prev = 56;
            _iterator2 = opts.version.natives[Symbol.iterator]();

          case 58:
            if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
              _context.next = 126;
              break;
            }

            native = _step2.value;
            _context.next = 62;
            return _tools2.default.stat(native.path);

          case 62:
            if (!_context.sent.isFile()) {
              _context.next = 122;
              break;
            }

            zip = new _admZip2.default(native.path);
            _iteratorNormalCompletion3 = true;
            _didIteratorError3 = false;
            _iteratorError3 = undefined;
            _context.prev = 67;
            _iterator3 = zip.getEntries()[Symbol.iterator]();

          case 69:
            if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
              _context.next = 106;
              break;
            }

            zipEntry = _step3.value;

            if (zipEntry.isDirectory) {
              _context.next = 103;
              break;
            }

            _iteratorNormalCompletion4 = true;
            _didIteratorError4 = false;
            _iteratorError4 = undefined;
            _context.prev = 75;
            _iterator4 = native.exclude[Symbol.iterator]();

          case 77:
            if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
              _context.next = 89;
              break;
            }

            i = _step4.value;
            _context.t1 = !zipEntry.entryName.startsWith(i);

            if (!_context.t1) {
              _context.next = 84;
              break;
            }

            _context.next = 83;
            return _tools2.default.stat((0, _path.join)(nativePath, zipEntry.entryName));

          case 83:
            _context.t1 = !_context.sent.isFile();

          case 84:
            if (!_context.t1) {
              _context.next = 86;
              break;
            }

            zip.extractEntryTo(zipEntry.entryName, nativePath, true, true);

          case 86:
            _iteratorNormalCompletion4 = true;
            _context.next = 77;
            break;

          case 89:
            _context.next = 95;
            break;

          case 91:
            _context.prev = 91;
            _context.t2 = _context['catch'](75);
            _didIteratorError4 = true;
            _iteratorError4 = _context.t2;

          case 95:
            _context.prev = 95;
            _context.prev = 96;

            if (!_iteratorNormalCompletion4 && _iterator4.return) {
              _iterator4.return();
            }

          case 98:
            _context.prev = 98;

            if (!_didIteratorError4) {
              _context.next = 101;
              break;
            }

            throw _iteratorError4;

          case 101:
            return _context.finish(98);

          case 102:
            return _context.finish(95);

          case 103:
            _iteratorNormalCompletion3 = true;
            _context.next = 69;
            break;

          case 106:
            _context.next = 112;
            break;

          case 108:
            _context.prev = 108;
            _context.t3 = _context['catch'](67);
            _didIteratorError3 = true;
            _iteratorError3 = _context.t3;

          case 112:
            _context.prev = 112;
            _context.prev = 113;

            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }

          case 115:
            _context.prev = 115;

            if (!_didIteratorError3) {
              _context.next = 118;
              break;
            }

            throw _iteratorError3;

          case 118:
            return _context.finish(115);

          case 119:
            return _context.finish(112);

          case 120:
            _context.next = 123;
            break;

          case 122:
            missLibrary.push(native);

          case 123:
            _iteratorNormalCompletion2 = true;
            _context.next = 58;
            break;

          case 126:
            _context.next = 132;
            break;

          case 128:
            _context.prev = 128;
            _context.t4 = _context['catch'](56);
            _didIteratorError2 = true;
            _iteratorError2 = _context.t4;

          case 132:
            _context.prev = 132;
            _context.prev = 133;

            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }

          case 135:
            _context.prev = 135;

            if (!_didIteratorError2) {
              _context.next = 138;
              break;
            }

            throw _iteratorError2;

          case 138:
            return _context.finish(135);

          case 139:
            return _context.finish(132);

          case 140:
            if (!(missLibrary.length > 0)) {
              _context.next = 143;
              break;
            }

            if (this._event) {
              this._event.emit('miss', missLibrary);
            }
            throw new Error('Lack of support library');

          case 143:

            if (!opts.advencedArguments) {
              opts.advencedArguments = [];
            }

            /* eslint-disable no-template-curly-in-string */
            assetsPath = (0, _path.join)(this.root, opts.version.assets === 'legacy' ? 'assets/virtual/legacy' : 'assets');
            ma = {
              '${auth_access_token}': auth.accessToken,
              '${auth_session}': auth.accessToken,
              '${auth_player_name}': auth.displayName,
              '${auth_uuid}': auth.uuid,
              '${user_properties}': auth.properties,
              '${user_type}': auth.userType,
              '${version_name}': opts.version.id,
              '${assets_index_name}': opts.version.assets,
              '${game_directory}': (0, _path.join)(this.root, 'versions', opts.version.id),
              '${game_assets}': assetsPath,
              '${assets_root}': assetsPath
            };


            ma = opts.version.minecraftArguments.split(' ').map(function (i) {
              var value = ma[i];
              return typeof value !== 'undefined' ? value : i;
            });

            if (opts.versionType) {
              l = ma.indexOf('--versionType');
              j = 0;

              if (l !== -1) {
                j++;
              }
              if (ma[l + 1] && ma[l + 1].indexOf('--') !== 0) {
                j++;
              }
              ma.splice(l, j);
              ma.push('--versionType', opts.versionType);
            }
            /* eslint-enable no-template-curly-in-string */

            sb = sb.concat(opts.advencedArguments, ['-Xmn128m', '-XX:+UseConcMarkSweepGC', '-XX:+CMSIncrementalMode', '-XX:-UseAdaptiveSizePolicy', '-XX:-OmitStackTraceInFastThrow', '-XX:+UnlockExperimentalVMOptions', '-Dfml.ignorePatchDiscrepancies=true', '-Dfml.ignoreInvalidMinecraftCertificates=true', '-XX:HeapDumpPath=MojangTricksIntelDriversForPerformance_javaw.exe_minecraft.exe.heapdump', '-Djava.library.path=' + nativePath, '-cp', libraries.join(';'), opts.version.mainClass], ma);

            if (opts.server && opts.server.address) {
              sb.push('--server', opts.server.address, '--port', opts.server.port <= 0 ? '25565' : opts.server.port.toString());
            }
            if (opts.size) {
              if (opts.size.fullScreen) {
                sb.push('--fullscreen');
              } else {
                if (opts.size.height > 0) {
                  sb.push('--height', opts.size.height.toString());
                }
                if (opts.size.width > 0) {
                  sb.push('--width', opts.size.width.toString());
                }
              }
            }

            if (this._event) {
              this._event.emit('start');
            }

            launched = function launched() {
              return clearTimeout(time);
            };

            time = setTimeout(function () {
              child.removeListener('exit', launched);
              if (_this._event) {
                _this._event.emit('started');
              }
            }, 13000);
            child = (0, _child_process.spawn)(this.java, sb, { cwd: this.root });

            if (this._event) {
              child.on('error', function (d) {
                return _this._event.emit('start_error', d);
              }).once('exit', function (d) {
                return _this._event.emit('exit', d);
              }).once('exit', launched);
              child.stdout.on('data', function (d) {
                return _this._event.emit('log_data', d);
              });
              child.stderr.on('data', function (d) {
                return _this._event.emit('log_error', d);
              });
            }
            return _context.abrupt('return', child);

          case 157:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[18, 34, 38, 46], [39,, 41, 45], [56, 128, 132, 140], [67, 108, 112, 120], [75, 91, 95, 103], [96,, 98, 102], [113,, 115, 119], [133,, 135, 139]]);
  }));

  function launch(_x) {
    return _ref.apply(this, arguments);
  }

  return launch;
}();