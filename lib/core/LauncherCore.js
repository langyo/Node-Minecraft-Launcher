//启动器核心
/* 从CreationOption创建启动器核心
 * 参数1:启动器创建选项
 */
const st=require('../tools/SystemTools.js'),JVersionLocator=require('../version/JVersionLocator.js');
module.exports=function(gameRootPath,javaPath,versionLocator){
    /* 核心选项
     * 
     * 参数1:游戏根目录，默认为 ./.minecraft
     * 参数2:JAVA地址，默认为自动搜寻所的第一个
     * 参数3:Version定位器，默认为 JVersionLoacator
     */
    var CurrentCode=0,_versionLocator=new JVersionLocator(this);
    this.GameRootPath=isNull(gameRootPath)?'.minecraft':gameRootPath;
    var yb=this.GameRootPath.substr(this.GameRootPath.length>0?this.GameRootPath.length-1:0,1);
    if(yb=='\\'||yb=='/')this.GameRootPath=this.GameRootPath.substr(0,this.GameRootPath.length-1);
    if(!require('fs').statSync(this.GameRootPath).isDirectory())throw('Root directory does not exist');
    this.VersionLocator=versionLocator;
    if(isNull(javaPath)){
        var a=st.FindJava();
        this.JavaPath=a.length>0?a[a.length-1]:null;
    }else this.JavaPath=javaPath;
	//返回包含全部版本数组
	this.GetVersions=function(){
        if(isNull(this.VersionLocator))return false;
        return _versionLocator.GetAllVersions();
	}
	//返回指定id的版本
	this.GetVersion=function(id){
        if(isNull(this.VersionLocator))return false;
        return _versionLocator.Locate(id);
	}
	this.VersionLocator=function(){
		this.VersionLocator.get=function(){
			return this._versionLocator;
		}
		this.VersionLocator.set=function(value){
			this._versionLocator=value;
			value.Core=this;
		}
	}
    this.Launch=function(options,back){
        const EventEmitter=require('events').EventEmitter;
        const event=new EventEmitter();
        if((typeof back)=='function')back(event);
        var LaunchInternal=require('./LauncherCoreInternal.js');
        new LaunchInternal(this,options,event);
        if(this.MissLibrary.length!=0){
            event.emit('miss',this.MissLibrary);
            return false;
        }
        return true;
    }
    this.MissLibrary=new Array();
}
function isNull(obj){
    return obj==null||obj==undefined;
}