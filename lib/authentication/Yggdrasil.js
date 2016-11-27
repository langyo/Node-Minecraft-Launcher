const get = require('../tools/HttpRequester.js').Get,
    UUIDSTR = require('uuid-by-string');

module.exports = (email, password) => {
    return {
        ClientToken: UUIDSTR(Math.random().toString()).replace('-', '').toLowerCase(),
        Do: function*() {
            if (!email || !password) {
                return Promise.reject(new Error('Email or password is null'));
            }
            if (!this.AccessToken || !this.UUID || !this.DisplayName) {
                var re = yield(yield get('https://authserver.mojang.com/authenticate', `{"agent":{"name":"Minecraft","version":1},"username":"${email}","password":"${password}","clientToken":"${this.ClientToken}"}`)).json();
                if (!re.selectedProfile.id || !re.selectedProfile.name) {
                    return Promise.reject(new Error('Validation error'));
                }
                this.AccessToken = re.accessToken;
                this.DisplayName = re.selectedProfile.name;
                this.UUID = re.selectedProfile.id;
            }
            return Promise.resolve({
                AccessToken: this.AccessToken,
                DisplayName: this.DisplayName,
                UUID: this.UUID,
                Properties: '{}',
                UserType: 'mojang'
            });
        }
    };
};