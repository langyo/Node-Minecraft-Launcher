const uuidstr = require('uuid-by-string')
const url = require('url')
const request = require('request')

module.exports = (email, password, uri) => {
  if (!email || !password) {
    throw new Error('Email or password is null')
  }
  return {
    clientToken: uuidstr(Math.random().toString()).replace('-', '').toLowerCase(),
    do: function*() {
      if (!this.accessToken || !this.uuid || !this.displayName) {
        var json = yield new Promise((resolve, reject) => {
          request({
            url: url.parse(uri || 'https://authserver.mojang.com/authenticate'),
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            json: {
              agent: {
                name: 'Minecraft',
                'version': 1
              },
              username: email,
              password: password,
              clientToken: this.ClientToken
            }
          }, (error, response, body) => {
            if (error || response.statusCode !== 200) {
              reject(error || 'there is not 200 OK')
            } else {
              resolve(body)
            }
          })
        })
        if (!json.selectedProfile.id || !json.selectedProfile.name) {
          throw new Error('validation error')
        }
        this.accessToken = json.accessToken
        this.displayName = json.selectedProfile.name
        this.uuid = json.selectedProfile.id
      }
      return Promise.resolve({
        accessToken: this.accessToken,
        displayName: this.displayName,
        uUID: this.uuid,
        properties: '{}',
        userType: 'mojang'
      })
    }
  }
}
