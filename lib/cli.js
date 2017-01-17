import 'babel-polyfill'
import program from 'commander'
import chalk from 'chalk'
import { promisifyAll } from 'bluebird'
import { decode } from 'iconv-lite'

const fs = promisifyAll(require('fs'))
const MCLauncher = require(`${__dirname}/core.js`)
const Offline = require(`${__dirname}/authenticator/offline.js`)
const Yggdrasil = require(`${__dirname}/authenticator/yggdrasil.js`)

program
  .version(require(`${__dirname}/../package.json`).version)
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

var version = program.args[0]
if (!version) {
  program.help()
  process.exit(1)
}

var log = !program.log

const launch = async () => {
  var conf = {env: true}
  if (log) {
    console.log(chalk.cyan('[log]'), '初始化中')
    conf.event = event => {
      event.on('auth', () => console.log(chalk.cyan('[log]'), '登录账号中'))
        .on('error_auth', () => console.log(chalk.red('[error]'), '账号登录失败，请检查密码'))
        .on('unzip', () => console.log(chalk.cyan('[log]'), '解压Native中'))
        .on('miss', libraries => {
          console.log(chalk.red('[error]'), '缺少支持库')
          console.log(libraries)
        })
        .on('start', () => console.log(chalk.cyan('[log]'), '启动游戏中'))
        .on('started', () => console.log(chalk.green('[success]'), '启动游戏完毕'))
        .on('log_data', data => console.log(chalk.magenta('[gamelog]'), chalk.gray(decode(data, 'gbk'))))
        .on('log_error', error => console.log(chalk.yellow('[wraning]'), chalk.gray(decode(error, 'gbk'))))
        .on('start_error', error => console.log(chalk.red('[error]'), decode(error, 'gbk')))
        .on('exit', exit => console.log(chalk.blue('[exit]'), exit))
    }
  }
  if (program.root) {
    conf.root = program.root
  }
  if (program.java) {
    conf.java = program.java
  }

  var acc = `${__dirname}/user.json`
  if (program.clean) {
    await fs.unlinkAsync(acc)
  }
  var user = (await fs.existsAsync(acc)) ? JSON.parse(await fs.readFileAsync(acc)) : {}
  user.name = program.username || user.name
  user.password = program.password || user.password
  user.email = program.email || user.email
  if (program.save) {
    await fs.writeFileAsync(acc, JSON.stringify(user))
  }

  var opts = {
    version: version,
    maxMemory: program.memory,
    server: {
      address: program.address,
      port: program.port
    },
    size: {fullScreen: program.full}
  }

  /* eslint-disable new-cap */
  if (user.password && user.email) {
    opts.authenticator = new Yggdrasil.default(user.email, user.password)
  } else if (user.name) {
    opts.authenticator = new Offline.default(user.name)
  }

  var time = new Date().getTime()

  var core = new MCLauncher.default(conf)
  /* eslint-enable new-cap */

  if (log) {
    console.log(chalk.green('[success]'), '初始化完毕')
  }

  return core.launch(opts).then(() => {
    console.log(chalk.green('[success]'), '生成参数成功', chalk.gray(`耗时 ${new Date().getTime() - time}ms`))
  })
}

launch().catch(error => {
  console.log(chalk.red('[error]'), '发生错误')
  console.log(error)
})
