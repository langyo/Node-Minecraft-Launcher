import { parse } from 'url'
import Promise from 'bluebird'
import request from 'request'
import Authenticator from './authenticator.js'

export default class Yggdrasil extends Authenticator {
  constructor (email, password, url) {
    super()
    if (!email || !password) {
      throw new Error('Email or password is empty')
    }
    this.email = email
    this.password = password
    this.url = url
  }
  async do () {
    if (!this.uuid || !this.displayName) {
      var json = await new Promise((resolve, reject) => {
        request({
          url: parse(this.url || 'https://authserver.mojang.com/authenticate'),
          method: 'POST',
          headers: {'Content-type': 'application/json'},
          json: {
            agent: {
              name: 'Minecraft',
              'version': 1
            },
            username: this.email,
            password: this.password,
            clientToken: this.clientToken
          }
        }, (error, response, body) => {
          if (error || response.statusCode !== 200) {
            reject(error || new Error('there is not 200 OK'))
          } else {
            if ((typeof body) === 'string') {
              resolve(JSON.parse(body))
            } else {
              resolve(body)
            }
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
    return this.getInfo()
  }
}
