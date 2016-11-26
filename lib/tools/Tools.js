'use strict';
const os = require('os');
module.exports = {
    GetMac() {
        var o = os.networkInterfaces();
        for (s in o) return o[s][0].mac.toUpperCase();
        return false;
    }
}