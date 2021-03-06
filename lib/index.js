const { resolve, join } = require('path')
const { EventEmitter } = require('events')
const tools = require('./tools.js')
const offline = require('./authenticator/offline.js')
const Loader = require('./loader.js')
const launch = require('./launch.js')
const AdmZip = require('adm-zip')
const fs = require('fs-extra')
const { version } = require('../package.json')

module.exports = class MCLauncher extends Loader {
  constructor (opts, dir, e) {
    if (typeof opts === 'string') opts = { java: opts }
    if (typeof opts !== 'object') opts = {}
    if (dir) opts.root = dir
    if (e) opts.event = e
    if (!opts.root) opts.root = `./.minecraft`
    opts.root = resolve(opts.root)
    if (!fs.existsSync(opts.root) || !fs.statSync(opts.root).isDirectory()) throw new Error(`non-existent ${opts.root}`)
    super(opts.root)
    this._validate = false
    this.root = opts.root
    this.java = opts.java
    this.env = opts.env
    if (opts.event) {
      this._event = new EventEmitter()
      opts.event(this._event)
    }
    if (typeof opts.unpack === 'function') this._unpack = opts.unpack
    const file = join(this.root, 'launcher_profiles.json')
    tools.fileExists(file).then(exists => !exists && fs.writeJson(file, {
      profiles: {
        MCLauncher: {
          name: 'MCLauncher'
        },
        '(Default)': {
          name: '(MCLauncher)'
        }
      },
      selectedProfil: '(Default)',
      clientToken: tools.randomUuid()
    }, { spaces: 2 }))
  }
  async getVersions () {
    const file = `${this.root}/versions`
    if (!(await tools.dirExists(file))) return []
    return (await Promise.all(
      (await fs.readdir(file))
        .map(id => tools.fileExists(file + '/' + id + '/' + id + '.json')
          .then(exists => exists && id))
    )).filter(id => !!id)
  }
  async setRoot (root) {
    root = resolve(root)
    if (!(await tools.dirExists(root))) {
      throw new Error(`non-existent ${root}`)
    }
    this.root = root
  }
  getRoot () {
    return this.root
  }
  setJava (java) {
    this._validate = false
    this.java = java
  }
  getJava () {
    return this.java
  }
  getEmtter () {
    if (!this._event) {
      this._event = new EventEmitter()
    }
    return this._event
  }
  async launch (conf, authenticator) {
    if (typeof conf === 'string') conf = { version: conf }
    if (!conf || !conf.version) {
      throw new Error('There is no need to fill in the need to start the version')
    }
    if (authenticator) conf.authenticator = authenticator
    if (!conf.authenticator) conf.authenticator = offline('Steve')
    if (!conf.versionType) conf.versionType = '§eMCLauncher'
    if (!conf.launcherName) conf.launcherName = 'MCLauncher'
    if (!conf.launcherVersion) conf.launcherVersion = version
    conf.version = await this.load(conf.version.toString())
    if (!this._validate) {
      if (!this.java || !(await tools.fileExists(this.java))) {
        var java = await tools.findJavaFast(this.env)
        if (!java) {
          throw new Error('cannot find java')
        }
        this.java = java
        this._validate = true
      }
    }
    return launch.call(this, conf)
  }
  async _unpack (nativePath, npath, exclude) {
    const zip = new AdmZip(npath)
    const entires = zip.getEntries()
      .filter(entry => !entry.isDirectory &&
        !exclude.some(i => entry.entryName.startsWith(i)))
      .map(entry => entry.entryName)
    await Promise.all(entires.map(name => tools.fileExists(join(nativePath, name))
      .then(exists => !exists && zip.extractEntryTo(name, nativePath, true, true))))
    return entires
  }
}
