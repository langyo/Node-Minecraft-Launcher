
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
