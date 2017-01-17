import Promise from 'bluebird'
import { platform } from 'os'
import { join } from 'path'
import { stat } from 'fs'

const exec = Promise.promisify(require('child_process').exec)

var systemType = 'linux'
switch (platform()) {
  case 'win32':
    systemType = 'windows'
    break
  case 'darwin':
    systemType = 'osx'
}

const statError = () => {
  return false
}

const statReturn = {
  isFile: statError,
  isDirectory: statError
}

export default class Tools {
  static arch = process.config.variables.host_arch === 'x64' ? 64 : 32
  static systemType = systemType
  static stat (path) {
    return new Promise(resolve => {
      stat(path, (err, re) => {
        resolve(err ? statReturn : re)
      })
    })
  }
  static async findJava (env) {
    var re = []
    switch (systemType) {
      case 'windows':
        var func = java => {
          re = re.concat(java)
        }
        var file = join(process.env.JAVA_HOME, 'bin/javaw.exe')
        var arr = [this.findJavaInternal('Wow6432Node\\').then(func), this.findJavaInternal().then(func)]
        if (env) {
          arr.push(this.stat(file).then(file => { if (file.isFile()) func(env) }))
        }
        await Promise.all(arr)
        return re
      case 'linux':
      case 'osx':
        var java = await exec('echo $JAVA_HOME')
        return java && (await this.stat(java)).isFile() ? [join(java, 'bin/java')] : []
    }
  }
  static async findJavaFast (env, key) {
    if (env) {
      var name = join(process.env.JAVA_HOME, 'bin/javaw.exe')
      if ((await this.stat(name)).isFile()) {
        return name
      }
    }
    if ((typeof key) === 'undefined') {
      key = 'Wow6432Node\\'
    }
    var java = await exec(`REG QUERY "HKEY_LOCAL_MACHINE\\SOFTWARE\\${key || ''}JavaSoft\\Java Runtime Environment"`)
    if (!java) {
      return
    }
    java = java.split('\r\n\r\n')
    if (java.length !== 2) {
      return
    }
    for (var q of java[1].split('\r\n')) {
      if (q) {
        var u = await exec(`REG QUERY "${q}" /v JavaHome`)
        if (!u) {
          continue
        }
        u = u.split('    ')
        if (u.length === 4) {
          var file = `${u[3].replace('\r\n\r\n', '')}\\bin\\javaw.exe`
          if ((await this.stat(file)).isFile()) {
            return file
          }
        }
      }
    }
    if (key) {
      return await this.findJavaFast(null, 0)
    }
  }
  static async findJavaInternal (key) {
    var java = await exec(`REG QUERY "HKEY_LOCAL_MACHINE\\SOFTWARE\\${key || ''}JavaSoft\\Java Runtime Environment"`)
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
        var u = await exec(`REG QUERY "${q}" /v JavaHome`)
        if (!u) {
          continue
        }
        u = u.split('    ')
        if (u.length === 4) {
          var file = `${u[3].replace('\r\n\r\n', '')}\\bin\\javaw.exe`
          if ((await this.stat(file)).isFile()) {
            array.push(file)
          }
        }
      }
    }
    return array
  }
}
