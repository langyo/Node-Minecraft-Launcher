const uuidstr = require('uuid-by-string')

module.exports = displayName => {
  return {
    uuid: uuidstr(`OfflinePlayer:${displayName}`).replace('-', '').toLowerCase(),
    displayName: displayName,
    accessToken: uuidstr(Math.random().toString()).replace('-', '').toLowerCase(),
    do: function* () {
      if ((typeof this.displayName) !== 'string' || this.displayName.indexOf(' ') !== -1) {
        throw new Error('DisplayName does not conform to the specification')
      }
      return {
        accessToken: this.accessToken,
        displayName: this.displayName,
        uuid: this.uuid,
        properties: '{}',
        userType: 'mojang'
      }
    }
  }
}
