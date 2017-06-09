'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _uuidByString = require('uuid-by-string');

var _uuidByString2 = _interopRequireDefault(_uuidByString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Authenticator = function () {
  function Authenticator() {
    _classCallCheck(this, Authenticator);

    this.clientToken = (0, _uuidByString2.default)(Math.random().toString()).replace('-', '').toLowerCase();
    this.userType = 'mojang';
    this.properties = '{}';
  }

  _createClass(Authenticator, [{
    key: 'getInfo',
    value: function getInfo() {
      return {
        accessToken: this.accessToken,
        displayName: this.displayName,
        uuid: this.uuid,
        properties: this.properties,
        userType: this.userType
      };
    }
  }]);

  return Authenticator;
}();

exports.default = Authenticator;