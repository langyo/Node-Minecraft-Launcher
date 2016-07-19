#JSMCCC

一个用Node.js编写的Minecraft启动模块

### 本模块Coding项目地址：

[https://coding.net/u/ncbql/p/JSMCCC/git](https://coding.net/u/ncbql/p/JSMCCC/git)

### 先宣传一把：

- [BeeStudio](http://jq.qq.com/?_wv=1027&k=27xer22)：QQ群 - 367428642
- [上古之石技术部](http://www.mcbbs.net/group-324-1.html)

### 本模块的优点：

- 启动及登陆验证模块化
- Java以及系统信息的寻找
- 自动的Natives文件解压
- 以及一些有用的功能

### 版权说明：

- 整体结构及大部分代码翻译自[MineStudio](https://github.com/MineStudio)的[KMCCC](https://github.com/MineStudio/KMCCC)项目
- 如果你使用本模块，必须标注[KMCCC](https://github.com/MineStudio/KMCCC)的项目地址   <-最重要的一点
- 部分源码来源于互联网：[UUID](http://www.cnblogs.com/greengnn/archive/2011/10/06/2199719.html)  [StringBuilder](http://blog.csdn.net/lynnlovemin/article/details/11476417) [Map](http://blog.sina.com.cn/s/blog_7e9c5b6801016oyz.html)
- 请遵守[LGPLv2](http://www.cnblogs.com/findumars/p/3556883.html)协议
- 本模块由[ncbql](http://www.mcbbs.net/home.php?mod=space&uid=897711)编写

### 安装模块：

    $ npm install jsmccc

### 一些例子：

以下的`()`表示为`必选参数`，`[]`表示为`可选参数`

###### ~~可以，这很梨子~~

##### 创建一个启动器核心：

```javascript
const LauncherCore=require('jsmccc').LauncherCore;

var core=new LauncherCore([游戏根目录],[JAVA路径],[版本构建器]);
```

##### 寻找版本：

```javascript
var versions=core.GetVersions();

var version=core.GetVersion('1.8');
```

##### 启动游戏：

```javascript
const LauncherCore=require('jsmccc').LauncherCore,OfflineAuthenticator=require('jsmccc').OfflineAuthenticator;
//const YggdrasilLogin=require('jsmccc').Yggdrasil;    <-正版登陆库

var core=new LauncherCore();

core.Launch({
    Version:core.GetVersion('1.8.8'),//   <-必填
    Authenticator:new OfflineAuthenticator('Steve'),//   <-必填
    //Authenticator:new YggdrasilLogin('10000@qq.com','123456'),   <-正版登陆
	//MaxMemory:1024,   <-最大内存
	//MinMemory:512,    <-最小内存
	/*Server:{
        Address:'www.360.cn',
        Port:25565
    },   <-自动进入服务器    */
	/*Size:{
        Height:768,
        Width:1280
    }    <-游戏窗口大小      */
});
```

> 启动游戏时，最好加个try，例如：

```javascript
try{
    core.Launch(opt);
}catch(e){
    console.error(e);
}
```

##### 启动游戏，并设置监听器：

```javascript
const LauncherCore=require('jsmccc').LauncherCore,OfflineAuthenticator=require('jsmccc').OfflineAuthenticator;

var core=new LauncherCore();

core.Launch({
    Version:core.GetVersion('1.8.8'),
    Authenticator:new OfflineAuthenticator('Steve')
},event=>{
    event.on('data',data=>{
        //接收Log事件
    });
    event.on('error',error=>{
        //接收错误事件
    });
    event.on('exit',exit=>{
        //接收游戏退出事件
    });
});
```

##### 启动游戏，并获取缺少库：

```javascript
const LauncherCore=require('jsmccc').LauncherCore,OfflineAuthenticator=require('jsmccc').OfflineAuthenticator;

var core=new LauncherCore();

var re=core.Launch({
    Version:core.GetVersion('1.8.8'),
    Authenticator:new OfflineAuthenticator('Steve')
});

if(!re)console.error(this.MissLibrary);//如果缺少必备的库，将会返回一个数组
```

### 一些废话：

- 估计用Node.js写[启动器](http://www.mcbbs.net/forum.php?mod=viewthread&tid=601390)的除了[Srar](http://www.mcbbs.net/home.php?mod=space&uid=1129071)这大佬以外没人了滑稽
- 反正绑个node-webkit都50mb了
- 如果你有更好的代码或者意见可以fork修改代码并进行pull
- 最后欢迎收藏/关注/fork
- ~~另外找人一起搞启动器，愿意的私聊QQ:764798966，并附上[启动器合作]~~

# Enjoy!
