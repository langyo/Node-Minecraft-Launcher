const tools = require('./tools.js')
const auth = require('./authenticator/offline.js')
const Loader = require('./loader.js')
const lunch = require('./launch.js')
const co = require('co')
const path = require('path')
const fs = require('co-fs')
const EventEmitter = require('events').EventEmitter

const mkdirsAsync = function* (dirpath, mode) {
  if (!(yield fs.exists(dirpath))) {
    var pathtmp
    for (var dirname of dirpath.split(path.sep)) {
      pathtmp = pathtmp ? path.join(pathtmp, dirname) : dirname
      if (!(yield fs.exists(pathtmp)) && !(yield fs.mkdir(pathtmp, mode))) {
        return false
      }
    }
  }
  return true
}

module.exports = function* (opts, dir, e) {
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
  if (!opts.java || !(yield fs.exists(opts.java))) {
    var java = yield tools.findJava()
    if (!java.length) {
      throw new Error('cannot find java')
    }
    opts.java = java.sort()[java.length - 1]
  }
  if (!opts.root) {
    opts.root = `./.minecraft`
  }
  if (!(yield fs.exists(opts.root)) && !(yield mkdirsAsync(opts.root))) {
    throw new Error(`can not mkdir in ${opts.root}`)
  }
  if (opts.event) {
    opts._event = new EventEmitter()
    opts.event(opts._event)
  }
  var loader = new Loader(opts)
  loader.launch = (conf, authenticator) => {
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
      conf.authenticator = auth('Steve')
    }
    if (!conf.versionType) {
      conf.versionType = '§eMinecraftLauncher'
    }
    return co(function* () {
      return yield lunch(conf, opts)
    })
  }
  return loader
}
