#JSMCCC
=====

一个用Node.js编写的Minecraft启动模块

## 本模块的优点：

- 启动及登陆验证模块化
- Java以及系统信息的寻找
- 自动的Natives文件解压
- 一些有用的功能

## 版权说明：

- 整体结构翻译自[MineStudio](https://github.com/MineStudio)的[KMCCC](https://github.com/MineStudio/KMCCC)项目
- 部分源码来源于互联网：[UUID](http://www.cnblogs.com/greengnn/archive/2011/10/06/2199719.html) [StringBuilder](http://blog.csdn.net/lynnlovemin/article/details/11476417) [Map](http://blog.sina.com.cn/s/blog_7e9c5b6801016oyz.html)
- 请遵守[LGPLv2协议](http://www.cnblogs.com/findumars/p/3556883.html)

## 一些例子~~梨子~~

以下的`()`表示为`必选参数`，`[]`表示为`可选参数`

-----

## 创建一个启动器核心

```javascript

const LauncherCore=require('./core/LauncherCore.js');

var core=new LauncherCore([游戏根目录],[JAVA路径],[版本构建器]);

```

## 寻找版本

```javascript

var versions=core.GetVersions();

var version=core.GetVersion('1.8');

```

## 启动游戏

```javascript

const LauncherCore=require('./core/LauncherCore.js'),OfflineAuthenticator=require('./authentication/OfflineAuthenticator.js');
//const YggdrasilLogin=require('./authentication/Yggdrasil.js');    <-正版登陆库

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

## 启动游戏，并设置监听器

```javascript

const LauncherCore=require('./core/LauncherCore.js'),OfflineAuthenticator=require('./authentication/OfflineAuthenticator.js');

var core=new LauncherCore();

core.Launch({
    Version:core.GetVersion('1.8.8'),
    Authenticator:new OfflineAuthenticator('Steve')
},data=>{
//接收Log事件
},err=>{
//接收错误事件
},exit=>{
//接收游戏退出事件
});

```

## 启动游戏，并获取缺少库

```javascript

const LauncherCore=require('./core/LauncherCore.js'),OfflineAuthenticator=require('./authentication/OfflineAuthenticator.js');

var core=new LauncherCore();

var re=core.Launch({
    Version:core.GetVersion('1.8.8'),
    Authenticator:new OfflineAuthenticator('Steve')
});

if(!re)console.log(re);//如果缺少必备的库，将会返回一个数组

```

# Enjoy!
