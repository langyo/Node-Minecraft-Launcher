module.exports=function(core){
    var Map=require('../tools/Map.js'),fs=require('fs'),st=require('../tools/SystemTools.js'),systemName=st.GetSystemType(),arch=st.GetArch();
    var _versions=new Map(),_locatingVersion=new Array();
    function isNull(obj){
        return obj==null||obj==undefined;
    }
    function GetVersionInternal(id){
        if(_versions.contains(id))return _versions.get(id);
        var Ver=require('../version/LauncherCoreItemResolverExtensions.js');
        var v=new Ver(core),version=new Object(),jver=this.LoadVersion(v.GetVersionJsonPath(id));
        if(isNull(jver.id)||isNull(jver.minecraftArguments)||isNull(jver.mainClass)||isNull(jver.libraries))return false;
        if(isNull(jver.assets))jver.assets='legacy';
        version.JarId=jver.id;
		version.MinecraftArguments=jver.minecraftArguments;
		version.Assets=jver.assets;
		version.MainClass=jver.mainClass;
		version.Libraries=new Array();
		version.Natives=new Array();
        for(var i=0;i<jver.libraries.length;i++){
            var lib=jver.libraries[i];
            if(isNull(lib.name))continue;
            var names=lib.name.split(':');
			if (names.length!=3)continue;
            if(isNull(lib.natives)){
                if(!this.IfAllowed(lib.rules))continue;
                version.Libraries.push({
                    NS:names[0],
                    Name:names[1],
                    Version:names[2],
                    Url:lib.url
                });
            }else{
                if(!this.IfAllowed(lib.rules))continue;
				version.Natives.push({
                    NS:names[0],
                    Name:names[1],
                    Version:names[2],
                    NativeSuffix:lib.natives[systemName].replace('${arch}',arch),
                    Options:isNull(lib.extract)?undefined:{Exclude:lib.extract.exclude},
                    Url:lib.url
                });
            }
        }
		if(!isNull(jver.inheritsFrom)){
			var target=this.Locate(jver.inheritsFrom);
			if(!target)return false;
			if(version.Assets=='legacy')version.Assets=null;
            if(isNull(version.Assets))version.Assets=target.Assets;
			if(!isNull(target.JarId))version.JarId=target.JarId;
			if(isNull(version.MainClass))version.MainClass=target.MainClass;
			if(isNull(version.MinecraftArguments))version.MinecraftArguments=target.MinecraftArguments;
            addAll(version.Natives,target.Natives);
            addAll(version.Libraries,target.Libraries);
		}
		_versions.put(version.JarId,version);
		return version;
    }
    this.LoadVersion=function(jsonPath){
        return JSON.parse(fs.readFileSync(jsonPath));  
    }
    this.Locate=GetVersionInternal;
    this.GetAllVersions=function(){
        var path=this.GameRootPath+'/versions/',arr=fs.readdirSync(path),re=new Array();
        if(!arr)return false;
        for(var i=0;i<arr.length;i++)if(fs.statSync(path+arr[i]).isDirectory())re.push(this.Locate(arr[i]));
        if(re.length==0)return false;else return re;
    }
    this.IfAllowed=function(rules){
        if(rules==null||rules.length==0)return true;
        var allowed=false;
        for(var i=0;i<rules.length;i++){
            var rule=rules[i];
            if(rule.os==null){
				allowed=rule.action=='allow';
				continue;
			}
			if(rule.os.name==systemName)allowed=rule.action=='allow';
        }
        return allowed;
    }
    function addAll(arr1,arr2){
        if(isNull(arr1)||(typeof arr1)!='object'||isNull(arr2)||(typeof arr2)!='object')return;
        for(var i=0;i<arr2.length;i++)arr1.push(arr2[i]);
    }
}