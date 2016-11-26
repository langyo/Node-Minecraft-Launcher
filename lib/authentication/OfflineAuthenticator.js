'use strict';
const UUIDSTR = require('uuid-by-string');
module.exports = displayName => {
    var re = {
        DisplayName: displayName,
        AccessToken: UUIDSTR(Math.random().toString()).replace('-', '').toLowerCase(),
        Do: function*() {
            if ((typeof this.DisplayName) !== 'string' || this.DisplayName.indexOf(' ') !== -1) {
                return Promise.reject(new Error('DisplayName does not conform to the specification'));
            }
            yield Promise.resolve(0);
            return Promise.resolve({
                AccessToken: this.AccessToken,
                DisplayName: this.DisplayName,
                UUID: this.UUID,
                Properties: '{}',
                UserType: 'mojang'
            });
        }
    };
    re.UUID = UUIDSTR(re.DisplayName).replace('-', '').toLowerCase();
    return re;
};