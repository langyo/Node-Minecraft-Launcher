import Promise from 'bluebird'
import { platform } from 'os'
import { join, resolve } from 'path'
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

export default {
  systemType,
  arch: process.config.variables.host_arch === 'x64' ? 64 : 32,
  stat: path => new Promise(resolve => stat(path, (err, re) => resolve(err ? statReturn : re))),
  async findJava () {
    var re = []
    var env = process.env.JAVA_HOME
    if (systemType === 'windows') {
      if (env) {
        let file = join(env, 'bin/java.exe')
        if ((await this.stat(file)).isFile()) {
          re.push(file)
        }
      }
      return Array.from(new Set(re.concat(await this.findJavaInternal('Wow6432Node\\'),
        await this.findJavaInternal())))
    } else {
      let file = resolve('/bin/java')
      if ((await this.stat(file)).isFile()) {
        re.push(file)
      }
      if (env && env !== '/bin/java') {
        env = resolve(env)
        var env_ = join(env, 'bin/java')
        if ((await this.stat(env)).isFile()) {
          re.push(env)
        } else if ((await this.stat(env_)).isFile()) {
          re.push(env_)
        }
      }
      return re
    }
  },
  async findJavaInternal (key) {
    var java = await exec(
      `REG QUERY "HKEY_LOCAL_MACHINE\\SOFTWARE\\${key || ''}JavaSoft\\Java Runtime Environment"`)
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
          var file = `${u[3].replace('\r\n\r\n', '')}\\bin\\java.exe`
          if ((await this.stat(file)).isFile()) {
            array.push(file)
          }
        }
      }
    }
    return array
  },
  async findJavaFast (useEnv, key) {
    var env = process.env.JAVA_HOME
    if (systemType === 'windows') {
      if (useEnv && env) {
        let file = join(env, 'bin/java.exe')
        if ((await this.stat(file)).isFile()) return file
      }
      var re = await this.findJavaInternal('Wow6432Node\\')
      if (re.length) return re[0]
      return (await this.findJavaInternal())[0]
    } else {
      let file = resolve('/bin/java')
      if ((await this.stat(file)).isFile()) return file
      if (useEnv && env && env !== '/bin/java') {
        env = resolve(env)
        var env_ = join(env, 'bin/java')
        if ((await this.stat(env)).isFile()) {
          return env
        } else if ((await this.stat(env_)).isFile()) {
          return env_
        }
      }
    }
  }
}
