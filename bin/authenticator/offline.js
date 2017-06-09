'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _uuidByString = require('uuid-by-string');

var _uuidByString2 = _interopRequireDefault(_uuidByString);

var _authenticator = require('./authenticator.js');

var _authenticator2 = _interopRequireDefault(_authenticator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Offline = function (_Authenticator) {
  _inherits(Offline, _Authenticator);

  function Offline(displayName) {
    _classCallCheck(this, Offline);

    var _this = _possibleConstructorReturn(this, (Offline.__proto__ || Object.getPrototypeOf(Offline)).call(this));

    if (typeof displayName !== 'string' || displayName.indexOf(' ') !== -1) {
      throw new Error('DisplayName does not conform to the specification');
    }
    _this.displayName = displayName;
    _this.uuid = (0, _uuidByString2.default)('OfflinePlayer:' + displayName).replace('-', '').toLowerCase();
    _this.accessToken = (0, _uuidByString2.default)(Math.random().toString()).replace('-', '').toLowerCase();
    return _this;
  }

  _createClass(Offline, [{
    key: 'do',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt('return', this.getInfo());

              case 1:
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

  return Offline;
}(_authenticator2.default);

exports.default = Offline;