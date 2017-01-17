import uuidstr from 'uuid-by-string'

export default class Authenticator {
  clientToken = uuidstr(Math.random().toString()).replace('-', '').toLowerCase()
  userType = 'mojang'
  properties = '{}'
  getInfo () {
    return {
      accessToken: this.accessToken,
      displayName: this.displayName,
      uuid: this.uuid,
      properties: this.properties,
      userType: this.userType
    }
  }
}
