const { ZipFile } = require('zipfile')
const tools = require('./lib/tools')
const { join } = require('path')

module.exports = async (nativePath, npath, exclude) => {
  const zip = new ZipFile(npath)
  const entires = zip.names
    .filter(name => !name.endsWith('/') && !exclude.some(i => name.startsWith(i)))
  await Promise.all(entires.map(name => {
    const file = join(nativePath, name)
    return tools.fileExists()
      .then(exists => !exists && new Promise((resolve, reject) =>
        zip.copyFile(name, file, err => err ? reject(err) : resolve())))
  }))
  return entires
}
