const { join } = require('path')
const { decode } = require('iconv-lite')
const { platform, homedir } = require('os')
const fs = require('fs-extra')
const program = require('commander')
const chalk = require('chalk')
const tools = require('./tools')
const MCLauncher = require('./index')
const offline = require('./authenticator/offline')
const yggdrasil = require('./authenticator/yggdrasil')

const home = homedir()
const isWin = platform() === 'win32'

program
  .version(require('../package.json').version)
  .usage('<游戏版本> [参数]')
  .option('-r, --root <str>', '游戏根目录')
  .option('-u, --username <str>', '你的游戏名')
  .option('-e, --email <str>', '你的正版邮箱')
  .option('-p, --password <str>', '你的正版密码')
  .option('-m, --memory <int>', '游戏最大内存', parseInt)
  .option('-s, --save', '保存游戏账户信息')
  .option('-c, --clean', '清除游戏账户信息')
  .option('-j, --java <str>', 'JAVA路径')
  .option('-a, --address <str>', '游戏进入后自动进入的服务器IP')
  .option('-o, --port <int>', '游戏进入后自动进入的服务器端口', parseInt)
  .option('-f, --full', '全屏游戏')
  .option('-l, --log', '不显示log')
  .parse(process.argv)

const version = program.args[0]
if (!version) {
  program.help()
  process.exit(1)
}

const log = !program.log

const launch = async () => {
  const conf = {env: true}
  if (log) {
    console.log(chalk.cyan('[log]'), '初始化中')
    conf.event = event => {
      event.on('auth', () => console.log(chalk.cyan('[log]'), '登录账号中'))
        .on('error_auth', () => console.log(chalk.red('[error]'), '账号登录失败，请检查密码'))
        .on('unzip', () => console.log(chalk.cyan('[log]'), '解压Native中'))
        .on('miss', libraries => {
          console.log(libraries)
          console.log(chalk.red('[error]'), '缺少支持库')
        })
        .on('start', () => console.log(chalk.cyan('[log]'), '启动游戏中'))
        .on('started', () => console.log(chalk.green('[success]'), '启动游戏完毕'))
        .on('log_data', data => console.log(chalk.magenta('[gamelog]'),
          chalk.gray(isWin ? decode(data, 'gbk') : data.toString())))
        .on('log_error', error => console.log(chalk.yellow('[wraning]'),
          chalk.gray(isWin ? decode(error, 'gbk') : error.toString())))
        .on('start_error', error => console.log(chalk.red('[error]'),
          isWin ? decode(error, 'gbk') : error.toString()))
        .on('exit', exit => console.log(chalk.blue('[exit]'), exit))
    }
  }
  if (program.root) {
    conf.root = program.root
  }
  if (program.java) {
    conf.java = program.java
  }

  const acc = join(home, '.minecraft-launcher.json')
  if (program.clean) {
    await fs.unlink(acc)
  }
  const user = await tools.fileExists(acc) ? await fs.readJson(acc) : {}
  user.name = program.username || user.name
  user.password = program.password || user.password
  user.email = program.email || user.email
  if (program.save) {
    await fs.writeJson(acc, user)
  }

  const opts = {
    version: version,
    maxMemory: program.memory,
    server: {
      address: program.address,
      port: program.port
    },
    size: { fullScreen: program.full }
  }

  /* eslint-disable new-cap */
  if (user.password && user.email) {
    opts.authenticator = yggdrasil(user.email, user.password)
  } else if (user.name) {
    opts.authenticator = offline(user.name)
  }

  const key = chalk.green('[success]') + ' 生成参数成功 ' + chalk.gray('耗时')
  console.time(key)

  const core = new MCLauncher(conf)
  /* eslint-enable new-cap */

  if (log) {
    console.log(chalk.green('[success]'), '初始化完毕')
  }

  return core.launch(opts).then(() => console.timeEnd(key))
}

launch().catch(error => {
  console.error(error)
  console.log(chalk.red('[error]'), '发生错误')
})
