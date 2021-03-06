# minecraft-launcher [![tnpm](http://npm.taobao.org/badge/v/minecraft-launcher.svg?style=flat-square)](http://npm.taobao.org/package/minecraft-launcher) [![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

一个使用 Node.js 编写的Minecraft启动模块

## 项目地址:

[https://coding.net/u/ncbql/p/minecraft-launcher/git](https://coding.net/u/ncbql/p/minecraft-launcher/git)

## 安装模块:

    $ npm install --save minecraft-launcher

## 引入模块:

```js
const MCLauncher = require('minecraft-launcher')

const core = new MCLauncher()
```

## API:

### new MCLauncher([配置])
### new MCLauncher([Java路径], [根目录], [监听器])
***

#### 配置:

```js
const conf = {
  root: '.minecraft', // 游戏根目录，可选
  java: java地址, // Java地址，可选
  env: true, // 直接从环境变量读取java地址，可选
  event (event) {}, // 监听器，可选
  unpack (Natives解压路径, 欲解压文件, 文件过滤器) // 自定义解压器, 返回需要解压的全部文件名, 可选, 默认使用 Adm-Zip 模块解压
}
```

#### 监听器:

`Log` 事件推荐使用 `iconv-lite` 模块进行转码

```js
const event = event => { // 监听器，可选
  event.on('auth', () => {}) // 接收登陆事件
    .on('error_auth', () => {}) // 接收登陆失败事件
    .on('unzip', () => {}) // 接收解压Natives事件
    .on('miss', libraries => {}) // 接收缺少Libraries事件
    .on('start', () => {}) // 接收启动中事件
    .on('started', () => {}) // 接收启动完毕事件
    .on('log_data', data => {}) // 接收Log事件
    .on('log_error', error => {}) // 接受游戏错误事件
    .on('start_error', error => {}) // 接收启动错误事件
    .on('exit', exit => {}) // 接收游戏退出事件
}
```

### MCLauncher.offline(游戏名)
***
离线登录器

#### 游戏名:
玩家的游戏名

### MCLauncher.yggdrasil(邮箱, 密码, [地址])
***
正版登录器

#### 邮箱:
玩家的邮箱

#### 密码:
玩家的密码

#### 地址:
登陆地址，可选

### MCLauncher.Tools
***
工具类，包含寻找Java等方法

### await getVersions()
***
获取全部版本名，返回一个数组

### await getEmtter()
***
返回当前监听器

### await core.launch(配置)
### await core.launch([版本], [登录器])
***

#### 配置:

```js
const opts = {
  version: '1.10.2', // 需要启动的版本名
  // 以下均为可选参数
  authenticator: MCLauncher.offline('Steve'), // 离线登录
  authenticator: MCLauncher.yggdrasil('10000@qq.com', '123456'), // 正版登陆
  authenticator: { displayName: '游戏名', uuid: 'UUID' },
  versionType: 'minecraft-launcher', // MC主界面游戏版本右边的文字
  maxMemory: 1024, // 最大内存
  minMemory: 512, // 最小内存
  server: { // 自动连接的服务器
    address: 'www.360.cn', // 服务器IP
    port: 25565 // 服务器端口，默认25565
  },
  size: { // 游戏窗口大小
    fullScreen: true, // 全屏，可选
    height: 768, // 宽
    width: 1280 // 高
  },
  launcherName: 'MCLauncher', // 启动器名
  launcherVersion: '3.1.0', // 启动器版本
  advencedArguments: [], // Java虚拟机参数
  cgcEnabled: true, // 开启GC，默认/推荐开启
  agentPath: 'agent.jar', // Java代理
  features: { // 开启的特殊参数
    is_demo_user: true
  }
}
```

## 命令行:

### 安装模块

    $ npm install -g minecraft-launcher

### 帮助信息

```
  $ mclauncher -h

  Usage: mclauncher <游戏版本> [参数]

  Options:

    -h, --help            显示相关帮助，即当前界面
    -V, --version         显示当前安装的minecraft-launcher版本
    -r, --root            游戏根目录
    -u, --username <str>  你的游戏名
    -p, --password <str>  你的正版密码
    -e, --email <str>     你的正版邮箱
    -m, --memory <int>    游戏最大内存
    -s, --save            保存游戏账户信息
    -c, --clean           清除游戏账户信息
    -j, --java <str>      JAVA路径
    -a, --address <str>   游戏进入后自动进入的服务器IP
    -o, --port <int>      游戏进入后自动进入的服务器端口
    -f, --full            全屏游戏
    -l, --log             不显示log
```

### 快捷启动游戏:

    $ mclauncher 1.8.8

## 协议:

- [LGPL-3.0](./LICENSE)
- 最终解释权归 [Apisium](https://jq.qq.com/?_wv=1027&k=43GuWwq) 所属
