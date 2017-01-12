const path = require('path')
const tools = require('./tools.js')
const fs = require('co-fs')

const systemName = tools.getSystemType()
const arch = tools.getArch()

const ifAllowed = rules => {
  if (!rules || rules.length < 1) {
    return true
  }
  for (var rule of rules) {
    if (!rule.os && rule.action === 'allow') {
      return true
    }
    if (rule.os.name === systemName) {
      return rule.action === 'allow'
    }
  }
}

module.exports = function (opts) {
  this._allVersions = new Map()
  this.opts = opts
  this.load = function* (id) {
    if (this._allVersions.has(id)) {
      return this._allVersions.get(id)
    }
    var file = path.join(this.opts.root, 'versions', id, `${id}.json`)
    if (!(yield fs.exists(file))) {
      throw new Error(`No such version was found: ${id}`)
    }
    var json = JSON.parse(yield fs.readFile(file))
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

    json.libraries.forEach(lib => {
      if (!lib.name) {
        return
      }
      var names = lib.name.split(':')
      if (names.length !== 3) {
        return
      }
      if (!ifAllowed(lib.rules)) {
        return
      }
      var libPath = path.join(this.opts.root, 'libraries')
      if (lib.natives) {
        /* eslint-disable no-template-curly-in-string */
        var name = path.join(names[0].replace(/\./g, '/'), names[1], names[2],
          `${names[1]}-${names[2]}-${lib.natives[systemName].replace('${arch}', arch)}.jar`).replace(/\\/g, '/')
        /* eslint-enable */
        ver.natives.push({
          name: name,
          path: path.join(libPath, name),
          exclude: lib.extract ? lib.extract.exclude : [],
          url: lib.url
        })
      } else {
        var libname = path.join(names[0].replace(/\./g, '/'), names[1], names[2], `${names[1]}-${names[2]}.jar`).replace(/\\/g, '/')
        ver.libraries.push({
          name: libname,
          path: path.join(libPath, libname),
          url: lib.url
        })
      }
    })
    if (json.inheritsFrom) {
      var target = yield this.load(json.inheritsFrom)
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
      ver.libraries.concat(target.libraries)
    }
    this._allVersions.set(id, ver)
    return ver
  }
  this.loadAll = function* () {
    var ver = path.join(this.opts.root, 'versions')
    for (var id of (yield fs.readdir(ver))) {
      if ((yield fs.stat(path.join(ver, id))).isDirectory()) {
        yield this.load(id)
      }
    }
    return this._allVersions
  }
}
