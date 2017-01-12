#!/usr/bin/env node

const fs = require('co-fs')
const program = require('commander')
const chalk = require('chalk')
const iconv = require('iconv-lite')
const co = require('co')
const mclauncher = require(`${__dirname}/index.js`)

program
  .version(require(`${__dirname}/package.json`).version)
  .usage('<游戏版本> [参数]')
  .option('-r, --root', '游戏根目录')
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

co(function* () {
  var conf = {}
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
        .on('log_data', data => console.log(chalk.magenta('[gamelog]'), chalk.gray(iconv.decode(data, 'gbk'))))
        .on('log_error', error => console.log(chalk.yellow('[wraning]'), chalk.gray(iconv.decode(error, 'gbk'))))
        .on('start_error', error => console.log(chalk.red('[error]'), iconv.decode(error, 'gbk')))
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
    yield fs.unlink(acc)
  }
  var user = (yield fs.exists(acc)) ? JSON.parse(yield fs.readFile(acc)) : {}
  user.name = program.username || user.name
  user.password = program.password || user.password
  user.email = program.email || user.email
  if (program.save) {
    yield fs.writeFile(acc, JSON.stringify(user))
  }

  var core = yield mclauncher(conf)
  if (log) {
    console.log(chalk.green('[success]'), '初始化完毕')
  }
  var opts = {
    version: yield core.load(version),
    maxMemory: program.memory,
    server: {
      address: program.address,
      port: program.port
    },
    size: {fullScreen: program.full}
  }
  if (user.password && user.email) {
    opts.authenticator = mclauncher.yggdrasil(user.email, user.password)
  } else if (user.name) {
    opts.authenticator = mclauncher.offline(user.name)
  }
  core.launch(opts).then(() => {
    console.log(chalk.green('[success]'), '生成参数成功')
  })
}).catch(error => {
  console.log(chalk.red('[error]'), '发生错误')
  console.log(error)
})
