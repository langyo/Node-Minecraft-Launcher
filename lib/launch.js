const path = require('path')
const AdmZip = require('adm-zip')
const fs = require('co-fs')
const spawn = require('child_process').spawn

module.exports = function* (opts, conf) {
  if (conf._event) {
    conf._event.emit('auth')
  }
  var auth = yield opts.authenticator.do()
  if (!auth) {
    if (conf._event) {
      conf._event.emit('error_auth')
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
  var libraries = [path.join(conf.root, 'versions', opts.version.id, `${opts.version.id}.jar`)]
  for (var lib of opts.version.libraries) {
    if (yield fs.exists(lib.path)) {
      libraries.push(lib.path)
    } else {
      missLibrary.push(lib)
    }
  }

  if (conf._event) {
    conf._event.emit('unzip')
  }

  var nativePath = opts.version.id ? path.join(conf.root, 'versions', opts.version.id, 'natives') : path.join(conf.root, 'natives')
  if (!(yield fs.exists(nativePath))) {
    yield fs.mkdir(nativePath)
  }

  for (var native of opts.version.natives) {
    if (yield fs.exists(native.path)) {
      var zip = new AdmZip(native.path)
      zip.getEntries().forEach(zipEntry => {
        try {
          if (!zipEntry.isDirectory) {
            native.exclude.forEach(i => {
              if (zipEntry.entryName.indexOf(i) !== 0) {
                zip.extractEntryTo(zipEntry.entryName, nativePath)
              }
            })
          }
        } catch (e) {}
      })
    } else {
      missLibrary.push(native)
    }
  }

  if (missLibrary.length > 0) {
    if (conf._event) {
      conf._event.emit('miss', missLibrary)
    }
    throw new Error('Lack of support library')
  }

  if (!opts.advencedArguments) {
    opts.advencedArguments = []
  }

  /* eslint-disable no-template-curly-in-string */
  var assetsPath = path.join(conf.root, opts.version.assets === 'legacy' ? 'assets/virtual/legacy' : 'assets')
  var ma = {
    '${auth_access_token}': auth.accessToken,
    '${auth_session}': auth.accessToken,
    '${auth_player_name}': auth.displayName,
    '${auth_uuid}': auth.uuid,
    '${user_properties}': auth.properties,
    '${user_type}': auth.userType,
    '${version_name}': opts.version.id,
    '${assets_index_name}': opts.version.assets,
    '${game_directory}': path.join(conf.root, 'versions', opts.version.id),
    '${game_assets}': assetsPath,
    '${assets_root}': assetsPath
  }

  ma = opts.version.minecraftArguments.split(' ').map(i => {
    var value = ma[i]
    return (typeof value) !== 'undefined' ? value : i
  })

  if (opts.versionType) {
    var i = ma.indexOf('--versionType')
    var j = 0
    if (i !== -1) {
      j++
    }
    if (ma[i + 1] && ma[i + 1].indexOf('--') !== 0) {
      j++
    }
    ma.splice(i, j)
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

  if (conf._event) {
    conf._event.emit('start')
  }
  var launched = () => clearTimeout(time)
  var time = setTimeout(() => {
    child.removeListener('exit', launched)
    if (conf._event) {
      conf._event.emit('started')
    }
  }, 13000)

  var child = spawn(conf.java, sb, {cwd: conf.root})
  if (conf._event) {
    child
      .on('error', d => conf._event.emit('start_error', d))
      .once('exit', d => conf._event.emit('exit', d))
      .once('exit', launched)
    child.stdout.on('data', d => conf._event.emit('log_data', d))
    child.stderr.on('data', d => conf._event.emit('log_error', d))
  }
  return child
}
