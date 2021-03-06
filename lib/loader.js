const { join } = require('path')
const { fileExists } = require('./tools')
const fs = require('fs-extra')
const getArch = require('arch')
const { systemType, isAllow } = require('./isAllow')

const reg1 = /\\/g
const reg2 = /\./g
const arch = getArch() === 'x64' ? 64 : 32

module.exports = class Loader {
  constructor (root) {
    this.root = root
    this.allVersions = new Map()
  }
  async load (id) {
    if (this.allVersions.has(id)) {
      return this.allVersions.get(id)
    }
    const file = join(this.root, 'versions', id, `${id}.json`)
    if (!(await fs.exists(file))) {
      throw new Error(`No such version was found: ${id}`)
    }
    const cache = join(this.root, 'versions', id, `${id}.cache.json`)

    let ver
    let cacheData
    const stat = await fs.stat(file)
    if (await fileExists(cache)) cacheData = await fs.readJson(cache)

    if (cacheData && stat.atime.getTime() === cacheData.atime &&
      stat.ctime.getTime() === cacheData.ctime && stat.mtime.getTime() === cacheData.mtime) {
      ver = cacheData
    } else {
      const json = await fs.readJson(file)
      if (!json.id || !(json.minecraftArguments || json.arguments) || !json.mainClass || !json.libraries) {
        throw new Error('JSON format is not correct')
      }
      json.assets = json.assets || 'legacy'
      ver = {
        id: json.id,
        natives: [],
        libraries: [],
        assets: json.assets,
        mainClass: json.mainClass,
        atime: stat.atime.getTime(),
        ctime: stat.ctime.getTime(),
        mtime: stat.mtime.getTime(),
        inheritsFrom: json.inheritsFrom,
        minecraftArguments: json.minecraftArguments || json.arguments
      }

      json.libraries.forEach(lib => {
        if (!lib.name) {
          return
        }
        const names = lib.name.split(':')
        if (names.length !== 3 || !isAllow(lib.rules)) {
          return
        }
        if (lib.natives) {
          /* eslint-disable no-template-curly-in-string */
          const cache = `${names[1]}-${names[2]}-${lib.natives[systemType].replace('${arch}', arch)}.jar`
          const name = join(names[0].replace(reg2, '/'), names[1], names[2], cache).replace(reg1, '/')
          /* eslint-enable */
          ver.natives.push({
            name,
            cache,
            exclude: lib.extract ? lib.extract.exclude : [],
            url: lib.url
          })
        } else {
          const name = join(names[0].replace(reg2, '/'), names[1], names[2], `${names[1]}-${names[2]}.jar`).replace(reg1, '/')
          ver.libraries.push({
            name,
            url: lib.url
          })
        }
      })
      await fs.writeJson(cache, ver)
    }

    const libPath = join(this.root, 'libraries')
    ver.natives = ver.natives.map(lib => (lib.path = join(libPath, lib.name)) && lib)
    ver.libraries = ver.libraries.map(lib => (lib.path = join(libPath, lib.name)) && lib)
    if (ver.inheritsFrom) {
      const target = await this.load(ver.inheritsFrom)
      if (!target) {
        throw new Error(`Missing version: ${ver.inheritsFrom}`)
      }
      if (ver.assets === 'legacy' && target.assets && target.assets !== 'legacy') {
        ver.assets = target.assets
      }
      if (target.id) {
        ver.id = target.id
      }
      if (!ver.mainClass) {
        ver.mainClass = target.mainClass
      }
      if (!ver.minecraftArguments) {
        ver.MinecraftArguments = target.minecraftArguments
      }
      ver.natives = ver.natives.concat(target.natives)
      ver.libraries = ver.libraries.concat(target.libraries)
    }
    this.allVersions.set(id, ver)
    return ver
  }
}
