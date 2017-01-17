import { resolve } from 'path'
import { promisify } from 'bluebird'
import { EventEmitter } from 'events'
import fs from 'fs'
import tools from './tools.js'
import Offline from './authenticator/offline.js'
import Loader from './loader.js'
import lunch from './launch.js'

const readdir = promisify(fs.readdir)

export default class MCLauncher extends Loader {
  _validate = false
  constructor (opts, dir, e) {
    if ((typeof opts) === 'string') {
      opts = {java: opts}
    }
    if ((typeof opts) !== 'object') {
      opts = {}
    }
    if (dir) {
      opts.root = dir
    }
    if (e) {
      opts.event = e
    }
    if (!opts.root) {
      opts.root = `./.minecraft`
    }
    opts.root = resolve(opts.root)
    if (!fs.statSync(opts.root).isDirectory()) {
      throw new Error(`non-existent ${opts.root}`)
    }
    super(opts.root)
    this.root = opts.root
    this.java = opts.java
    this.env = opts.env
    if (opts.event) {
      this._event = new EventEmitter()
      opts.event(this._event)
    }
  }
  async getVersions () {
    var file = `${this.root}/versions`
    if (!(await tools.stat(file)).isDirectory()) {
      return []
    }
    var array = []
    for (var id of (await readdir())) {
      var dir = `${file}/${id}`
      if ((await tools.stat(dir)).isDirectory() && (await tools.stat(`${dir}/${id}.json`)).isFile()) {
        array.push(id)
      }
    }
    return array
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
    if (!conf || !conf.version && !conf.id) {
      throw new Error('There is no need to fill in the need to start the version')
    }
    if (conf.id) {
      conf = {version: conf}
    }
    if (authenticator) {
      conf.authenticator = authenticator
    }
    if (!conf.authenticator) {
      conf.authenticator = new Offline('Steve')
    }
    if (!conf.versionType) {
      conf.versionType = '§eMCLauncher'
    }
    conf.version = await this._load(conf.version.toString())
    if (!this._validate) {
      if (!this.java || !(await tools.stat(this.java)).isFile()) {
        var java = await tools.findJavaFast(this.env)
        if (!java) {
          throw new Error('cannot find java')
        }
        this.java = java
        this._validate = true
      }
    }
    return await lunch.bind(this, conf)()
  }
}
