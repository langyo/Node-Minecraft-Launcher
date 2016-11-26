# minecraft-launcher

[![tnpm](http://npm.taobao.org/badge/v/minecraft-launcher.svg?style=flat-square)](http://npm.taobao.org/package/minecraft-launcher)

一个用Node.js编写的Minecraft启动模块

### 本模块Coding项目地址：

[https://coding.net/u/ncbql/p/minecraft-launcher/git](https://coding.net/u/ncbql/p/minecraft-launcher/git)

### 先宣传一把：

- [BeeStudio](http://jq.qq.com/?_wv=1027&k=27xer22)：QQ群 - 367428642
- [上古之石技术部](http://www.mcbbs.net/group-324-1.html)

### 本模块的特点：

- 使用co进行编写
- Java以及系统信息的寻找
- 自动的Natives文件解压
- 自动化的JAVA/Forge/LiteLoader安装
- 以及一些有用的功能
- ~~下载JAVA/MC原版文件/Forge/LiteLoader更加方便~~
- ~~支持[BeeLogin](http://www.mcbbs.net/thread-457773-1-1.html)外置登入~~

### 版权说明：

- 整体结构及部分代码来自[MineStudio](https://github.com/MineStudio)的[KMCCC](https://github.com/MineStudio/KMCCC)项目
- 如果使用了[@bangbang93](http://weibo.com/bangbang93)的[BMCLAPI](http://bmclapi2.bangbang93.com/)下载源，必须标注BMCLAPI，具体参考[BMCLAPIdoc](http://bmclapi2.bangbang93.com/doc/)，如果[@bangbang93](http://weibo.com/bangbang93)不允许我实现的话，可联系我删除
- 请遵守[LGPLv2](http://opensource.org/licenses/LGPL-2.0)协议
- 本模块由[ncbql](http://www.mcbbs.net/home.php?mod=space&uid=897711)编写

### 安装模块：

    $ npm install minecraft-launcher

### 一些例子：

以下的`()`表示为`必选参数`，`[]`表示为`可选参数`

##### 创建一个启动器核心：

```javascript
const LauncherCore = require('minecraft-launcher').LauncherCore,

    co = require('co');

co(function* () {

    var core = yield LauncherCore([游戏根目录], [JAVA路径]);

});
```

##### 寻找版本：

```javascript
co(function* () {
    // 省略了一些代码...
    var versions = yield core.GetVersions();  // 返回一个MAP <版本名, 版本数据>
    
    var version = core.GetVersion('1.8');     // 只选择一个版本

});
```

##### 启动游戏：

```javascript
const co = require('co'),
    ML = require('minecraft-launcher'),
    LauncherCore = ML.LauncherCore,
    Authenticator = ML.Authenticator.Offline;
    // Yggdrasil = L.Authenticator.Yggdrasil;  <= 正版登陆

co(function* () {
    var core = yield LauncherCore();
    yield core.Launch({
        Version: yield core.GetVersion('1.10.2'),  // 需要启动的版本
        // 以下均为可选参数
        Authenticator: Authenticator('Steve')  // 游戏名
        // Authenticator: Yggdrasil('10000@qq.com', '123456')  // 正版登陆
        // VersionType: 'minecraft-launcher'  // MC主界面游戏版本右边的文字
        // MaxMemory: 1024  // 最大内存
        // MinMemory: 512  // 最小内存
        /* Server: {  // 自动连接的服务器
            Address: 'www.360.cn',  // 服务器IP
            Port: 25565  // 服务器端口，默认25565
        } */
        /* Size: {  游戏窗口大小
            FullScreen: true,  // 全屏，可选
            Height: 768,  // 宽
            Width: 1280  // 高
        } */
        // AdvencedArguments: []  // Java虚拟机参数
        // CGCEnabled: true  // 开启GC，默认/推荐开启
        // AgentPath: 'agent.jar'  // Java代理
    });
});
```

##### 启动游戏，并设置监听器：

```javascript
const co = require('co'),
    ML = require('minecraft-launcher'),
    LauncherCore = ML.LauncherCore,
    Authenticator = ML.Authenticator.Offline;

co(function* () {
    var core = yield LauncherCore();
    yield core.Launch({
        Version: yield core.GetVersion('1.10.2')
    }, event => {
        event.on('logging', () => {
            // 接收登陆事件
        }).on('unpacking', () => {
            // 接收解压Natives事件
        }).on('miss', libraries => {
            // 接收缺少库事件
        }).on('starting', () => {
            // 接收启动中事件
        }).on('started', () => {
            // 接收启动完毕事件
        }).on('log_data', data => {
            // 接收Log事件
        }).on('log_error', error => {
            // 接受游戏错误事件
        }).on('start_error', error => {
            // 接收启动错误事件
        }).on('exit', exit => {
            // 接收游戏退出事件
        });
    });
});
```

### 一些废话：

- 用co重新改了一遍，简直要命
- 估计用Node.js写[启动器](http://www.mcbbs.net/forum.php?mod=viewthread&tid=601390)的除了[Srar](http://www.mcbbs.net/home.php?mod=space&uid=1129071)这大佬以外没人了滑稽
- 反正绑个node-webkit都50mb了
- os.arch返回值居然和node的版本有关，醉了醉了
- 如果你有更好的代码或者意见可以fork修改代码并进行pull
- 最后欢迎收藏/关注/fork
- ~~另外找人一起搞启动器，愿意的私聊QQ:764798966，并附上[启动器合作]~~

# Enjoy!
