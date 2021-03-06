const fetch = require('node-fetch')
const { randomUuid } = require('../tools')

module.exports = (email, password, url = 'https://authserver.mojang.com/authenticate') => {
  if (!email || !password) {
    throw new Error('Email or password is empty')
  }
  const clientToken = randomUuid()
  return () => fetch({
    url,
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify({
      agent: {
        name: 'Minecraft',
        version: 1
      },
      password,
      clientToken,
      username: email
    })
  })
    .then(res => res.json())
    .then(json => {
      if (!json.selectedProfile.id || !json.selectedProfile.name) {
        throw new Error('validation error')
      }
      return {
        clientToken,
        uuid: json.selectedProfile.id,
        accessToken: json.accessToken,
        displayName: json.selectedProfile.name,
        properties: JSON.stringify((json.user || {}).properties || {})
      }
    })
}
