import { join } from 'path'
import { promisify } from 'bluebird'
import fs from 'fs'
import tools from './tools.js'

const readFile = promisify(fs.readFile)

const ifAllowed = rules => {
  if (!rules || rules.length < 1) {
    return true
  }
  for (var rule of rules) {
    if (!rule.os && rule.action === 'allow') {
      return true
    }
    if (rule.os.name === tools.systemType) {
      return rule.action === 'allow'
    }
  }
}

export default class Loader {
  _allVersions = new Map()
  constructor (root) {
    this.root = root
  }
  async _load (id) {
    if (this._allVersions.has(id)) {
      return this._allVersions.get(id)
    }
    var file = join(this.root, 'versions', id, `${id}.json`)
    if (!(await tools.stat(file)).isFile()) {
      throw new Error(`No such version was found: ${id}`)
    }
    var json = JSON.parse(await readFile(file))
    if (!json.id || !json.minecraftArguments || !json.mainClass || !json.libraries) {
      throw new Error('JSON format is not correct')
    }
    json.assets = json.assets || 'legacy'
    var ver = {
      libraries: [],
      natives: [],
      id: json.id,
      minecraftArguments: json.minecraftArguments,
      assets: json.assets,
      mainClass: json.mainClass
    }

    var reg1 = /\\/g
    var reg2 = /\./g
    json.libraries.forEach(lib => {
      if (!lib.name) {
        return
      }
      var names = lib.name.split(':')
      if (names.length !== 3 || !ifAllowed(lib.rules)) {
        return
      }
      var libPath = join(this.root, 'libraries')
      if (lib.natives) {
        /* eslint-disable no-template-curly-in-string */
        var name = join(names[0].replace(reg2, '/'), names[1], names[2],
          `${names[1]}-${names[2]}-${lib.natives[tools.systemType].replace('${arch}', tools.arch)}.jar`).replace(reg1, '/')
        /* eslint-enable */
        ver.natives.push({
          name: name,
          path: join(libPath, name),
          exclude: lib.extract ? lib.extract.exclude : [],
          url: lib.url
        })
      } else {
        var libname = join(names[0].replace(reg2, '/'), names[1], names[2], `${names[1]}-${names[2]}.jar`).replace(reg1, '/')
        ver.libraries.push({
          name: libname,
          path: join(libPath, libname),
          url: lib.url
        })
      }
    })
    if (json.inheritsFrom) {
      var target = await this._load(json.inheritsFrom)
      if (!target) {
        throw new Error(`Missing version: ${json.inheritsFrom}`)
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
    this._allVersions.set(id, ver)
    return ver
  }
}
