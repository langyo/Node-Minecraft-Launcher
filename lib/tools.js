const exec = require('co-exec')
const os = require('os')
const co = require('co')
const fs = require('co-fs')
const path = require('path')

module.exports = {
  getSystemType () {
    switch (os.platform()) {
      case 'win32':
        return 'windows'
      case 'darwin':
        return 'osx'
      default:
        return 'linux'
    }
  },
  findJava () {
    switch (this.getSystemType()) {
      case 'windows':
        var re = []
        var func = java => {
          re = re.concat(java)
        }
        return Promise.all([this.findJavaInternal('Wow6432Node\\').then(func), this.findJavaInternal().then(func)])
          .then(() => {
            return re
          })
      case 'linux':
      case 'osx':
        return exec('echo $JAVA_HOME')
          .then(java => {
            return java ? [path.join(java, 'bin/java')] : []
          })
    }
  },
  getArch () {
    return process.config.variables.host_arch === 'x64' ? 64 : 32
  },
  getNodeArch () {
    return process.arch === 'x64' ? 64 : 32
  },
  findJavaInternal (key) {
    return co(function* () {
      var java = yield exec(`REG QUERY "HKEY_LOCAL_MACHINE\\SOFTWARE\\${key || ''}JavaSoft\\Java Runtime Environment"`)
      if (!java) {
        return []
      }
      java = java.split('\r\n\r\n')
      if (java.length !== 2) {
        return []
      }
      var array = []
      for (var q of java[1].split('\r\n')) {
        if (q) {
          var u = yield exec(`REG QUERY "${q}" /v JavaHome`)
          if (!u) {
            continue
          }
          u = u.split('    ')
          if (u.length === 4) {
            var file = `${u[3].replace('\r\n\r\n', '')}\\bin\\javaw.exe`
            if (yield fs.exists(file)) {
              array.push(file)
            }
          }
        }
      }
      return array
    })
  }
}
