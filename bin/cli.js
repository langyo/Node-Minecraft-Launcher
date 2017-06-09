'use strict';

require('babel-polyfill');

var _bluebird = require('bluebird');

var _iconvLite = require('iconv-lite');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _tools = require('./tools.js');

var _tools2 = _interopRequireDefault(_tools);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var writeFile = (0, _bluebird.promisify)(_fs2.default.writeFile);
var readFile = (0, _bluebird.promisify)(_fs2.default.readFile);
var unlink = (0, _bluebird.promisify)(_fs2.default.unlink);
var MCLauncher = require(__dirname + '/core.js');
var Offline = require(__dirname + '/authenticator/offline.js');
var Yggdrasil = require(__dirname + '/authenticator/yggdrasil.js');

_commander2.default.version(require(__dirname + '/../package.json').version).usage('<游戏版本> [参数]').option('-r, --root <str>', '游戏根目录').option('-u, --username <str>', '你的游戏名').option('-e, --email <str>', '你的正版邮箱').option('-p, --password <str>', '你的正版密码').option('-m, --memory <int>', '游戏最大内存', parseInt).option('-s, --save', '保存游戏账户信息').option('-c, --clean', '清除游戏账户信息').option('-j, --java <str>', 'JAVA路径').option('-a, --address <str>', '游戏进入后自动进入的服务器IP').option('-o, --port <int>', '游戏进入后自动进入的服务器端口', parseInt).option('-f, --full', '全屏游戏').option('-l, --log', '不显示log').parse(process.argv);

var version = _commander2.default.args[0];
if (!version) {
  _commander2.default.help();
  process.exit(1);
}

var log = !_commander2.default.log;

var launch = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
    var conf, acc, user, opts, time, core;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            conf = { env: true };

            if (log) {
              console.log(_chalk2.default.cyan('[log]'), '初始化中');
              conf.event = function (event) {
                event.on('auth', function () {
                  return console.log(_chalk2.default.cyan('[log]'), '登录账号中');
                }).on('error_auth', function () {
                  return console.log(_chalk2.default.red('[error]'), '账号登录失败，请检查密码');
                }).on('unzip', function () {
                  return console.log(_chalk2.default.cyan('[log]'), '解压Native中');
                }).on('miss', function (libraries) {
                  console.log(_chalk2.default.red('[error]'), '缺少支持库');
                  console.log(libraries);
                }).on('start', function () {
                  return console.log(_chalk2.default.cyan('[log]'), '启动游戏中');
                }).on('started', function () {
                  return console.log(_chalk2.default.green('[success]'), '启动游戏完毕');
                }).on('log_data', function (data) {
                  return console.log(_chalk2.default.magenta('[gamelog]'), _chalk2.default.gray((0, _iconvLite.decode)(data, 'gbk')));
                }).on('log_error', function (error) {
                  return console.log(_chalk2.default.yellow('[wraning]'), _chalk2.default.gray((0, _iconvLite.decode)(error, 'gbk')));
                }).on('start_error', function (error) {
                  return console.log(_chalk2.default.red('[error]'), (0, _iconvLite.decode)(error, 'gbk'));
                }).on('exit', function (exit) {
                  return console.log(_chalk2.default.blue('[exit]'), exit);
                });
              };
            }
            if (_commander2.default.root) {
              conf.root = _commander2.default.root;
            }
            if (_commander2.default.java) {
              conf.java = _commander2.default.java;
            }

            acc = __dirname + '/user.json';

            if (!_commander2.default.clean) {
              _context.next = 8;
              break;
            }

            _context.next = 8;
            return unlink(acc);

          case 8:
            _context.next = 10;
            return _tools2.default.stat(acc);

          case 10:
            if (!_context.sent.isFile()) {
              _context.next = 18;
              break;
            }

            _context.t1 = JSON;
            _context.next = 14;
            return readFile(acc);

          case 14:
            _context.t2 = _context.sent;
            _context.t0 = _context.t1.parse.call(_context.t1, _context.t2);
            _context.next = 19;
            break;

          case 18:
            _context.t0 = {};

          case 19:
            user = _context.t0;

            user.name = _commander2.default.username || user.name;
            user.password = _commander2.default.password || user.password;
            user.email = _commander2.default.email || user.email;

            if (!_commander2.default.save) {
              _context.next = 26;
              break;
            }

            _context.next = 26;
            return writeFile(acc, JSON.stringify(user));

          case 26:
            opts = {
              version: version,
              maxMemory: _commander2.default.memory,
              server: {
                address: _commander2.default.address,
                port: _commander2.default.port
              },
              size: { fullScreen: _commander2.default.full }

              /* eslint-disable new-cap */
            };
            if (user.password && user.email) {
              opts.authenticator = new Yggdrasil.default(user.email, user.password);
            } else if (user.name) {
              opts.authenticator = new Offline.default(user.name);
            }

            time = new Date().getTime();
            core = new MCLauncher.default(conf);
            /* eslint-enable new-cap */

            if (log) {
              console.log(_chalk2.default.green('[success]'), '初始化完毕');
            }

            return _context.abrupt('return', core.launch(opts).then(function () {
              console.log(_chalk2.default.green('[success]'), '生成参数成功', _chalk2.default.gray('\u8017\u65F6 ' + (new Date().getTime() - time) + 'ms'));
            }));

          case 32:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function launch() {
    return _ref.apply(this, arguments);
  };
}();

launch().catch(function (error) {
  console.log(_chalk2.default.red('[error]'), '发生错误');
  console.log(error);
});