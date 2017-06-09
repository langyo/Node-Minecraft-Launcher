'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _url = require('url');

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _authenticator = require('./authenticator.js');

var _authenticator2 = _interopRequireDefault(_authenticator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Yggdrasil = function (_Authenticator) {
  _inherits(Yggdrasil, _Authenticator);

  function Yggdrasil(email, password, url) {
    _classCallCheck(this, Yggdrasil);

    var _this = _possibleConstructorReturn(this, (Yggdrasil.__proto__ || Object.getPrototypeOf(Yggdrasil)).call(this));

    if (!email || !password) {
      throw new Error('Email or password is empty');
    }
    _this.email = email;
    _this.password = password;
    _this.url = url;
    return _this;
  }

  _createClass(Yggdrasil, [{
    key: 'do',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var _this2 = this;

        var json;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(!this.uuid || !this.displayName)) {
                  _context.next = 9;
                  break;
                }

                _context.next = 3;
                return new _bluebird2.default(function (resolve, reject) {
                  (0, _request2.default)({
                    url: (0, _url.parse)(_this2.url || 'https://authserver.mojang.com/authenticate'),
                    method: 'POST',
                    headers: { 'Content-type': 'application/json' },
                    json: {
                      agent: {
                        name: 'Minecraft',
                        'version': 1
                      },
                      username: _this2.email,
                      password: _this2.password,
                      clientToken: _this2.clientToken
                    }
                  }, function (error, response, body) {
                    if (error || response.statusCode !== 200) {
                      reject(error || new Error('there is not 200 OK'));
                    } else {
                      if (typeof body === 'string') {
                        resolve(JSON.parse(body));
                      } else {
                        resolve(body);
                      }
                    }
                  });
                });

              case 3:
                json = _context.sent;

                if (!(!json.selectedProfile.id || !json.selectedProfile.name)) {
                  _context.next = 6;
                  break;
                }

                throw new Error('validation error');

              case 6:
                this.accessToken = json.accessToken;
                this.displayName = json.selectedProfile.name;
                this.uuid = json.selectedProfile.id;

              case 9:
                return _context.abrupt('return', this.getInfo());

              case 10:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function _do() {
        return _ref.apply(this, arguments);
      }

      return _do;
    }()
  }]);

  return Yggdrasil;
}(_authenticator2.default);

exports.default = Yggdrasil;