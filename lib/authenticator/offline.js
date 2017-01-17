import uuidstr from 'uuid-by-string'
import Authenticator from './authenticator.js'

export default class Offline extends Authenticator {
  constructor (displayName) {
    super()
    if ((typeof displayName) !== 'string' || displayName.indexOf(' ') !== -1) {
      throw new Error('DisplayName does not conform to the specification')
    }
    this.displayName = displayName
    this.uuid = uuidstr(`OfflinePlayer:${displayName}`).replace('-', '').toLowerCase()
    this.accessToken = uuidstr(Math.random().toString()).replace('-', '').toLowerCase()
  }
  async do () {
    return this.getInfo()
  }
}
