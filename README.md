#minecraft-launcher

[![tnpm](http://npm.taobao.org/badge/v/minecraft-launcher.svg?style=flat-square)](http://npm.taobao.org/package/minecraft-launcher) [![Known Vulnerabilities](https://snyk.io/test/npm/minecraft-launcher/badge.svg)](https://snyk.io/test/npm/minecraft-launcher)

一个用Node.js编写的Minecraft启动模块

### 本模块Coding项目地址：

[https://coding.net/u/ncbql/p/minecraft-launcher/git](https://coding.net/u/ncbql/p/minecraft-launcher/git)

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

    $ npm install minecraft-launcher

### 一些例子：

以下的`()`表示为`必选参数`，`[]`表示为`可选参数`

###### ~~可以，这很梨子~~


##### 创建一个启动器核心：

```javascript
const LauncherCore=require('minecraft-launcher').LauncherCore;

var core=new LauncherCore([游戏根目录],[JAVA路径],[版本构建器]);
```

##### 寻找版本：

```javascript
var versions=core.GetVersions();

var version=core.GetVersion('1.8');
```

##### 启动游戏：

```javascript
const LauncherCore=require('minecraft-launcher').LauncherCore,OfflineAuthenticator=require('minecraft-launcher').OfflineAuthenticator;
//const YggdrasilLogin=require('minecraft-launcher').Yggdrasil;    <-正版登陆库

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
const LauncherCore=require('minecraft-launcher').LauncherCore,OfflineAuthenticator=require('minecraft-launcher').OfflineAuthenticator;

var core=new LauncherCore();

core.Launch({
    Version:core.GetVersion('1.8.8'),
    Authenticator:new OfflineAuthenticator('Steve')
},event=>{
    event.on('data',data=>{
        //接收Log事件
    }).on('error',error=>{
        //接收错误事件
    }).on('exit',exit=>{
        //接收游戏退出事件
    }).on('miss',libraries=>{
        //接收缺少库事件
    });
});
```

##### 下载原版游戏文件：

```javascript
const Downloader=require('minecraft-launcher').Downloader.Mojang;//使用Mojang源进行下载

Downloader.GetVersionList(data=>{
    //返回一串版本Json
}).on('error',error=>{
    //接收错误事件
});

Downloader.DownloadCore((要下载的游戏版本号),(要存储的位置，例如.minecraft/versions/1.8.8/)).on('error',error=>{
    //接收错误事件
}).on('location',(location,index,nowLength,length)=>{
    //接收进度返回事件
    //参数[location]=>(当前下载百分比),[index]=>(当前下载的文件序号),[nowLength]=>(当前下载文件已下载的字节数),[length]=>(当前下载文件总字节数)
}).on('end',(index,length)=>{
    //接收某个文件下载完成事件
    //[index]=>(当前下载的文件序号),[length]=>(当前下载文件总字节数)
});

Downloader.DownloadLibraries((启动失败时miss监听器返回的库数组),[返回需要下载的库文件数组，例如libraries=>{}]);//监听器请参照上面的DownloadCore

Downloader.GetAssetsIndex([要获取欲下载资源Json的版本，如果是legacy可填写为null],(要存储的位置，例如.minecraft/assets/),assets=>{
    //返回一串版本对应的资源文件Json
});//监听器请参照上面的GetVersionList

Downloader.DownloadAssets((使用GetAssetsIndex方法获取到的Json),(要存储的位置，例如.minecraft/libraries/),[返回需要下载的资源文件数组，例如assets=>{}]);//监听器请参照上面的DownloadCore
```

### 一些废话：

- 估计用Node.js写[启动器](http://www.mcbbs.net/forum.php?mod=viewthread&tid=601390)的除了[Srar](http://www.mcbbs.net/home.php?mod=space&uid=1129071)这大佬以外没人了滑稽
- 反正绑个node-webkit都50mb了
- 如果你有更好的代码或者意见可以fork修改代码并进行pull
- 最后欢迎收藏/关注/fork
- ~~另外找人一起搞启动器，愿意的私聊QQ:764798966，并附上[启动器合作]~~

# Enjoy!
