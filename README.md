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
- 支持[BeeLogin](http://www.mcbbs.net/thread-457773-1-1.html)外置登入
- 实现了windows下的user32.dll的部分功能
- Java以及系统信息的寻找
- 自动的Natives文件解压
- 下载JAVA/MC原版文件/Forge/LiteLoader更加方便
- 自动化的JAVA/Forge/LiteLoader安装
- 以及一些有用的功能

### 版权说明：

- 整体结构及大部分代码翻译自[MineStudio](https://github.com/MineStudio)的[KMCCC](https://github.com/MineStudio/KMCCC)项目
- 如果你使用本模块，必须标注[KMCCC](https://github.com/MineStudio/KMCCC)的项目地址   <-最重要的一点
- 如果使用了[@bangbang93](http://weibo.com/bangbang93)的[BMCLAPI](http://bmclapi2.bangbang93.com/)下载源，必须标注BMCLAPI，具体参考[BMCLAPIdoc](http://bmclapi2.bangbang93.com/doc/)，如果[@bangbang93](http://weibo.com/bangbang93)不允许我实现的话，可联系我删除
- 部分代码参考了[Srar](https://github.com/Srar)的[MinecraftLaunchCoreUI](https://github.com/Srar/MinecraftLaunchCoreUI)项目
- 部分源码来源于互联网：[UUID](http://www.cnblogs.com/greengnn/archive/2011/10/06/2199719.html)  [Map](http://blog.sina.com.cn/s/blog_7e9c5b6801016oyz.html)
- 请遵守[LGPLv2](http://opensource.org/licenses/LGPL-2.0)协议
- 本模块由[ncbql](http://www.mcbbs.net/home.php?mod=space&uid=897711)编写

### 安装模块：

    $ npm install minecraft-launcher

### 一些例子：

以下的`()`表示为`必选参数`，`[]`表示为`可选参数`

###### ~~可以，这很梨子~~<br>

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
const LauncherCore=require('minecraft-launcher').LauncherCore,OfflineAuthenticator=require('minecraft-launcher').Authenticator.Offline;
//const YggdrasilLogin=require('minecraft-launcher').Authenticator.Yggdrasil;    <-正版登陆库
//const BeeLogin=require('minecraft-launcher').Authenticator.BeeLogin;    <-BeeLogin登陆库

var core=new LauncherCore();

core.Launch({
    Version:core.GetVersion('1.8.8'),//   <-必填
    Authenticator:new OfflineAuthenticator('Steve'),//   <-必填
    //Authenticator:new YggdrasilLogin('10000@qq.com','123456'),   <-正版登陆
    //Authenticator:new BeeLogin((BeeLogin网页端根目录),(玩家游戏名或邮箱),(玩家密码),[若采用BeeLoginMOD请填写.minecradr下的config文件夹完整目录],[是否使用正版登入]),
    //VersionType:'minecraft-launcher',    <-MC主界面游戏版本右边的文字
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

##### 启动游戏，并设置监听器：

```javascript
const LauncherCore=require('minecraft-launcher').LauncherCore,OfflineAuthenticator=require('minecraft-launcher').Authenticator.Offline;

var core=new LauncherCore();

core.Launch({
    Version:core.GetVersion('1.8.8'),
    Authenticator:new OfflineAuthenticator('Steve')
},event=>{
    event.on('launching',()=>{
        //接收正在启动事件
    }).on('data',data=>{
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

##### 下载Forge/LiteLoader/Java：

```javascript
const Downloader=require('minecraft-launcher').Downloader.BMCLAPI,LiteLoader=require('minecraft-launcher').Downloader.LiteLoader,Java=require('minecraft-launcher').Downloader.Java;//使用BMCLAPI源和LiteLoader源进行下载，监听器可参考上面的原版文件下载

Downloader.GetForgeVersionList((回调事件),[版本]);

Downloader.DownloadForge((MC版本),(Forge版本),(Forge带后缀的文件全名),(保存位置),[Forge分支]);

LiteLoader.GetVersionList((回调事件));

LiteLoader.Download((如果获取的json的stream项为SNAPSHOT请填写为true),(MC版本),(保存位置));

Java((下载保存文件名),(下载类对象,返回参数,填入安装时的参数中)=>{});
```

##### 自动安装Forge/LiteLoader：

```javascript
const ForgeInstaller=require('minecraft-launcher').Installer.Forge,LiteLoaderInstaller=require('minecraft-launcher').Installer.LiteLoader,JavaInstaller=require('minecraft-launcher').Installer.Java;

ForgeInstaller((下载到的Installer.jar文件目录),(游戏versions目录),[自定义安装的游戏版本名],[原版核心文件版本名]).on('error',error=>{
    //接收错误事件
}).on('finish',()=>{
    //接收安装完成事件
});

ForgeInstaller((下载到的Installer.jar文件目录),(游戏versions目录或mods文件夹),[如果安装了Forge推荐填写true，并修改前一个参数为版本对应的mods文件夹],[自定义安装的游戏版本名],[原版核心文件版本名]);//监听器请参考Forge自动安装

JavaInstaller((下载到的Java安装包),(下载返回参数),(安装完毕回调));
```

##### 工具类：

```javascript
const Tools=require('./tools/Tools.js'),SystemTools=require('./tools/SystemTools.js');

var UserDll=Tools.GetUserDll();//获取User32类库，如果不是windows将会返回false，本部分由Ivan提供，仅支持node.js 6.x的版本

SystemTools.FindJava();//寻找Java，并返回已安装的Java数组

SystemTools.GetArch();//获取系统位数

UserDll.GetHandle((窗口标题));//使用已知的窗口标题获取窗口句柄

UserDll.ChangeWindowTitle((窗口句柄),(窗口标题));//使用已知的窗口句柄修改窗口标题

UserDll.ListProcesses((完整的进程名));使用已知的进程名获取PID数组

UserDll.MinimizeWindow((窗口句柄));//最小化窗口，失败返回flase

UserDll.MaximizeWindow((窗口句柄));//最大化窗口，失败返回flase

UserDll.WinPostMessage((窗口句柄),(类型),0,0);//投递信息至某个窗口，可参考http://blog.csdn.net/yanruichong/article/details/6751209

UserDll.RegHotKey((窗口句柄),(热键标识符),(功能键),(键代码));//注册热键，可参考http://baike.so.com/doc/5906219-6119121.html
```

### 一些废话：

- 估计用Node.js写[启动器](http://www.mcbbs.net/forum.php?mod=viewthread&tid=601390)的除了[Srar](http://www.mcbbs.net/home.php?mod=space&uid=1129071)这大佬以外没人了滑稽
- 反正绑个node-webkit都50mb了
- os.arch返回值居然和node的版本有关，醉了醉了
- 如果你有更好的代码或者意见可以fork修改代码并进行pull
- 最后欢迎收藏/关注/fork
- ~~另外找人一起搞启动器，愿意的私聊QQ:764798966，并附上[启动器合作]~~

# Enjoy!
