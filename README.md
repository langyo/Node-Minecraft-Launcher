# minecraft-launcher [![tnpm](http://npm.taobao.org/badge/v/minecraft-launcher.svg?style=flat-square)](http://npm.taobao.org/package/minecraft-launcher)

一个使用Node.js编写的Minecraft启动模块

## 项目地址:

[https://coding.net/u/ncbql/p/minecraft-launcher/git](https://coding.net/u/ncbql/p/minecraft-launcher/git)

## 安装模块:

    $ npm install --save minecraft-launcher

## 引入模块:

```javascript
const mclauncher = require('minecraft-launcher')
const co = require('co')
co(function* () {
  var core = yield mclauncher()
  // 请将相关代码放置于此
})
```

## API:

### yield mclauncher([配置])
### yield mclauncher([Java路径], [根目录], [监听器])
***

#### 配置:

```javascript
{
  root: '.minecraft', // 游戏根目录，可选
  java: java地址, // Java地址，可选
  event (event) {} // 监听器，可选
}
```

#### 监听器:

```javascript
event (event) { // 监听器，可选
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

### mclauncher.offline(游戏名)
***
离线登录器

#### 游戏名:
玩家的游戏名

### mclauncher.yggdrasil(邮箱, 密码, [地址])
***
正版登录器

#### 邮箱:
玩家的邮箱

#### 密码:
玩家的密码

#### 地址:
登陆地址，可选

### yield core.load(版本号)
***
获取一个版本的数据，用于填入core.launch()

#### 版本号:
游戏的版本号

### yield core.loadAll()
***
获取一个全部版本的数据，返回一个数组

### yield core.launch(配置)
### yield core.launch([版本], [登录器])
***

#### 配置:
```javascript
{
  version: yield core.load('1.10.2'), // 需要启动的版本
  // 以下均为可选参数
  authenticator: mclauncher.offline('Steve'), // 离线登录
  authenticator: loadAll.yggdrasil('10000@qq.com', '123456'), // 正版登陆
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
  advencedArguments: [], // Java虚拟机参数
  cgcEnabled: true, // 开启GC，默认/推荐开启
  agentPath: 'agent.jar' // Java代理
}
```

## 协议:

- [LGPL-3.0](./LICENSE)
- [BeeStudio](https://jq.qq.com/?_wv=1027&k=43GuWwq)

# Enjoy!
