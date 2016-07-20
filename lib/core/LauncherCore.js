//����������
/* ��CreationOption��������������
 * ����1:����������ѡ��
 */
const st=require('../tools/SystemTools.js'),JVersionLocator=require('../version/JVersionLocator.js');
module.exports=function(gameRootPath,javaPath,versionLocator){
    /* ����ѡ��
     * 
     * ����1:��Ϸ��Ŀ¼��Ĭ��Ϊ ./.minecraft
     * ����2:JAVA��ַ��Ĭ��Ϊ�Զ���Ѱ���ĵ�һ��
     * ����3:Version��λ����Ĭ��Ϊ JVersionLoacator
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
	//���ذ���ȫ���汾����
	this.GetVersions=function(){
        if(isNull(this.VersionLocator))return false;
        return _versionLocator.GetAllVersions();
	}
	//����ָ��id�İ汾
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