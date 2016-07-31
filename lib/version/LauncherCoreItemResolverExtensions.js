//找Item，自己看我不加注释了 <-原来就是这样的，滑稽
module.exports=function(core){
	this.GetVersionRootPath=function(version){
		return (typeof version)=='string'?core.GameRootPath+'/versions/'+version+'/':this.GetVersionRootPath(version.Id);
	}
	this.GetVersionJarPath=function(version){
		return (typeof version)=='string'?core.GameRootPath+'/versions/'+version+'/'+version+'.jar':this.GetVersionJarPath(version.Id);
	}
	this.GetVersionJsonPath=function(version){
		return (typeof version)=='string'?core.GameRootPath+'/versions/'+version+'/'+version+'.json':this.GetVersionJsonPath(version.Id);
	}
	this.GetLibPath=function(lib){
		return core.GameRootPath+'/libraries/'+this.GetLibName(lib);
	}
    this.GetLibName=function(lib){
		return lib.NS.replace(/\./g,'/')+'/'+lib.Name+'/'+lib.Version+'/'+lib.Name+'-'+lib.Version+'.jar';
	}
	this.GetNativePath=function(lib){
		return core.GameRootPath+'/libraries/'+lib.NS.replace(/\./g,'/')+'/'+lib.Name+'/'+lib.Version+'/'+lib.Name+'-'+lib.Version+'-'+lib.NativeSuffix+'.jar';
	}
}