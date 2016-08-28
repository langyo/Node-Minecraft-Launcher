const fs=require('fs'),AdmZip=require('adm-zip');
module.exports=function(core,options,event){
    if(!fs.existsSync(core.JavaPath))throw('No java');
    const MinecraftLaunchArguments=require('./LaunchArguments.js');
    var args=new MinecraftLaunchArguments();
    GenerateArguments(core,options,args,event,(re,libs)=>{
        if(re!==0){
            event.emit('error',re);
            if(libs.length!=0)event.emit('miss',libs);
            return false;
        }
        if(LaunchGame(core,args,event))event.emit('launching');else event.emit('error','Launch error');
    });
}
function GenerateArguments(core,options,args,event,fun){
    const Item=require('../version/LauncherCoreItemResolverExtensions.js');
    var item=new Item(core);
    options.Authenticator.AsyncDo(authentication=>{
        try{
            var missLibrary=new Array();
            if(!authentication){
                fun('Validation error',missLibrary);
                return;
            }
            args.CGCEnabled=true;
            args.VersionType=options.VersionType;
            args.MainClass=options.Version.MainClass;
            args.MaxMemory=options.MaxMemory;
            args.AgentPath=options.AgentPath;
            args.MinMemory=options.MinMemory;
            args.Libraries=new Array();
            for(var i=0;i<options.Version.Libraries.length;i++){
                var lib=options.Version.Libraries[i],l=item.GetLibPath(lib);
                if(fs.existsSync(l))args.Libraries.push(l);else{
                    var name=item.GetLibName(lib);
                    if(lib.Url==undefined)missLibrary.push(name);else missLibrary.push({Name:name,Url:lib.Url});
                }
            }
            if(missLibrary.length!=0){
                fun('MissLibrary',missLibrary);
                return;
            }
            args.NativePath=core.GameRootPath+(options.Version.JarId?'/versions/'+options.Version.JarId:'')+'/natives/';
            try{fs.mkdirSync(args.NativePath);}catch(e){}
            for(var i=0;i<options.Version.Natives.length;i++){
                var n=options.Version.Natives[i],l=item.GetNativePath(n);
                if(fs.existsSync(l))UnzipFile(l,args.NativePath,n.Options);else{
                    var name=item.GetNativeName(n);
                    if(lib.Url==undefined)missLibrary.push(name);else missLibrary.push({Name:name,Url:lib.Url});
                }
            }
            args.Server=options.Server;
            args.Size=options.Size;
            if(options.Version.JarId!=undefined)args.Libraries.push(item.GetVersionJarPath(options.Version.JarId));
            args.MinecraftArguments=options.Version.MinecraftArguments.split(' ');
            var AssetsPath=options.Version.Assets=='legacy'?core.GameRootPath+'/assets/virtual/legacy':core.GameRootPath+'/assets';
            args.Tokens={
                auth_access_token:authentication.AccessToken,
                auth_session:authentication.AccessToken,
                auth_player_name:authentication.DisplayName,
                version_name:options.Version.JarId,
                game_directory:core.GameRootPath+(options.Version.JarId?'/versions/'+options.Version.JarId:''),
                game_assets:AssetsPath,
                assets_root:AssetsPath,
                assets_index_name:options.Version.Assets,
                auth_uuid:authentication.UUID,
                user_properties:authentication.Properties,
                user_type:authentication.UserType
            };
            if(!options.AdvencedArguments)options.AdvencedArguments=new Array();
            args.AdvencedArguments=options.AdvencedArguments;
            args.Authentication=authentication;
            args.Version=options.Version;
            fun(0,missLibrary);
        }catch(e){
            event.emit('error',e);
        }
    });
}
function UnzipFile(file,path,opt){
    var zip=new AdmZip(file);
    zip.getEntries().forEach((zipEntry)=>{
        try{if(!zipEntry.isDirectory&&!isHas(zipEntry.entryName,opt))zip.extractEntryTo(zipEntry.entryName,path);}catch(e){}
    });
}
function isHas(obj,opt){
    if(opt.Exclude==null||opt.Exclude==undefined)return false;
    for(var i=0;i<opt.Exclude.length;i++)if(startWith(obj,opt.Exclude[i]))return true;
    return false;
}
function startWith(str1,str2){
    return new RegExp("^"+str2).test(str1);
}
function LaunchGame(core,args,event){
    var child=require('child_process').spawn(core.JavaPath,args.ToArguments(),{cwd:core.GameRootPath});
    child.on('log_error',d=>event.emit('error',d.toString()));
    child.stdout.on('log_data',d=>event.emit('data',d.toString()));
    child.stderr.on('log_error',d=>event.emit('error',d.toString()));
    child.once('exit',d=>event.emit('exit',d.toString()));
    var launched=function(){
        clearTimeout(time);
    },time=setTimeout(()=>{
        child.removeListener('exit',launched);
        event.emit('launched');
    },13000);
    child.once('exit',launched);
    return true;
}