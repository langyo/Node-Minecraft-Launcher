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
        version.Id=jver.id;
		version.MinecraftArguments=jver.minecraftArguments;
		version.Assets=jver.assets;
		version.MainClass=jver.mainClass;
		version.JarId=jver.jar;
		version.Libraries=new Array();
		version.Natives=new Array();
        for(var i=0;i<jver.libraries.length;i++){
            var lib=jver.libraries[i];
            if(isNull(lib.name))continue;
            var names=lib.name.split(':');
			if (names.length!=3)continue;
            if(isNull(lib.natives)){
                if(!this.IfAllowed(lib.rules))continue;
                var lib1=new Object();
                lib1.NS=names[0];
                lib1.Name=names[1];
                lib1.Version=names[2];
                version.Libraries.push(lib1);
            }else{
                if(!this.IfAllowed(lib.rules))continue;
				var native1=new Object();
                native1.NS=names[0];
				native1.Name=names[1];
				native1.Version=names[2];
				native1.NativeSuffix=lib.natives[systemName].replace('${arch}',arch);
				if(!isNull(lib.extract))native1.Options={Exclude:lib.extract.exclude};
				version.Natives.push(native1);
            }
        }
		if(!isNull(jver.inheritsVersion)){
			var target=this.Locate(jver.inheritsVersion);
			if(!target)return false;
			if(version.assets=='legacy')version.assets=null;
            version.assets=isNull(version.assets)?target.assets:null;
			version.jarId=isNull(version.jarId)?target.jarId:null;
			version.mainClass=isNull(version.mainClass)?target.mainClass:null;
			version.minecraftArguments=isNull(version.minecraftArguments)?target.minecraftArguments:null;
            addAll(version.natives,target.natives);
            addAll(version.libraries,target.libraries);
		}
		version.jarId=isNull(version.jarId)?version.id:null;
		_versions.put(version.id,version);
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
        for(var i=0;i<arr2.length;i++)arr1.push(arr2[i]);
    }
}