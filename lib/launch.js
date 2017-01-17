import { join } from 'path'
import { spawn } from 'child_process'
import { promisify } from 'bluebird'
import AdmZip from 'adm-zip'
import fs from 'fs'
import tools from './tools.js'

const mkdir = promisify(fs.mkdir)

export default async function launch (opts) {
  if (this._event) {
    this._event.emit('auth')
  }
  var auth = await opts.authenticator.do()
  if (!auth) {
    if (this._event) {
      this._event.emit('error_auth')
    }
    throw new Error('validation error')
  }
  var sb = []
  if (opts.agentPath) {
    sb.push(`-javaagent:${opts.agentPath}`)
  }
  if ((typeof opts.cgcEnabled) === 'undefined' ? true : opts.cgcEnabled) {
    sb.push('-Xincgc')
  }
  if (opts.minMemory > 0) {
    sb.push(`-Xms${opts.minMemory}M`)
  }
  if (opts.maxMemory > 0) {
    sb.push(`-Xmx${opts.maxMemory}M`)
  } else {
    sb.push('-Xmx1024M')
  }
  sb.push('-Xmn128m')

  var missLibrary = []
  var libraries = [join(this.root, 'versions', opts.version.id, `${opts.version.id}.jar`)]
  for (var lib of opts.version.libraries) {
    if ((await tools.stat(lib.path)).isFile()) {
      libraries.push(lib.path)
    } else {
      missLibrary.push(lib)
    }
  }

  if (this._event) {
    this._event.emit('unzip')
  }

  var nativePath = opts.version.id ? join(this.root, 'versions', opts.version.id, 'natives') : join(this.root, 'natives')
  if (!(await tools.stat(nativePath)).isDirectory()) {
    await mkdir(nativePath)
  }
  for (var native of opts.version.natives) {
    if ((await tools.stat(native.path)).isFile()) {
      var zip = new AdmZip(native.path)
      for (var zipEntry of zip.getEntries()) {
        if (!zipEntry.isDirectory) {
          for (var i of native.exclude) {
            if (zipEntry.entryName.indexOf(i) !== 0 && !(await tools.stat(join(nativePath, zipEntry.entryName))).isFile()) {
              zip.extractEntryTo(zipEntry.entryName, nativePath, true, true)
            }
          }
        }
      }
    } else {
      missLibrary.push(native)
    }
  }

  if (missLibrary.length > 0) {
    if (this._event) {
      this._event.emit('miss', missLibrary)
    }
    throw new Error('Lack of support library')
  }

  if (!opts.advencedArguments) {
    opts.advencedArguments = []
  }

  /* eslint-disable no-template-curly-in-string */
  var assetsPath = join(this.root, opts.version.assets === 'legacy' ? 'assets/virtual/legacy' : 'assets')
  var ma = {
    '${auth_access_token}': auth.accessToken,
    '${auth_session}': auth.accessToken,
    '${auth_player_name}': auth.displayName,
    '${auth_uuid}': auth.uuid,
    '${user_properties}': auth.properties,
    '${user_type}': auth.userType,
    '${version_name}': opts.version.id,
    '${assets_index_name}': opts.version.assets,
    '${game_directory}': join(this.root, 'versions', opts.version.id),
    '${game_assets}': assetsPath,
    '${assets_root}': assetsPath
  }

  ma = opts.version.minecraftArguments.split(' ').map(i => {
    var value = ma[i]
    return (typeof value) !== 'undefined' ? value : i
  })

  if (opts.versionType) {
    var l = ma.indexOf('--versionType')
    var j = 0
    if (l !== -1) {
      j++
    }
    if (ma[l + 1] && ma[l + 1].indexOf('--') !== 0) {
      j++
    }
    ma.splice(l, j)
    ma.push('--versionType', opts.versionType)
  }
  /* eslint-enable no-template-curly-in-string */

  sb = sb.concat(opts.advencedArguments, [
    '-Xmn128m',
    '-XX:+UseConcMarkSweepGC',
    '-XX:+CMSIncrementalMode',
    '-XX:-UseAdaptiveSizePolicy',
    '-XX:-OmitStackTraceInFastThrow',
    '-XX:+UnlockExperimentalVMOptions',
    '-Dfml.ignorePatchDiscrepancies=true',
    '-Dfml.ignoreInvalidMinecraftCertificates=true',
    '-XX:HeapDumpPath=MojangTricksIntelDriversForPerformance_javaw.exe_minecraft.exe.heapdump',
    `-Djava.library.path=${nativePath}`,
    '-cp',
    libraries.join(';'),
    opts.version.mainClass
  ], ma)

  if (opts.server && opts.server.address) {
    sb.push('--server', opts.server.address, '--port', opts.server.port <= 0 ? '25565' : opts.server.port.toString())
  }
  if (opts.size) {
    if (opts.size.fullScreen) {
      sb.push('--fullscreen')
    } else {
      if (opts.size.height > 0) {
        sb.push('--height', opts.size.height.toString())
      }
      if (opts.size.width > 0) {
        sb.push('--width', opts.size.width.toString())
      }
    }
  }

  if (this._event) {
    this._event.emit('start')
  }
  var launched = () => clearTimeout(time)
  var time = setTimeout(() => {
    child.removeListener('exit', launched)
    if (this._event) {
      this._event.emit('started')
    }
  }, 13000)

  var child = spawn(this.java, sb, {cwd: this.root})
  if (this._event) {
    child
      .on('error', d => this._event.emit('start_error', d))
      .once('exit', d => this._event.emit('exit', d))
      .once('exit', launched)
    child.stdout.on('data', d => this._event.emit('log_data', d))
    child.stderr.on('data', d => this._event.emit('log_error', d))
  }
  return child
}
