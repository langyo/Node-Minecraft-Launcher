const fs=require('fs'),unzip=require('unzipper');
var Event;
module.exports=function(core,options,event){
    if(!fs.existsSync(core.JavaPath))throw('No java');
    const MinecraftLaunchArguments=require('./LaunchArguments.js');
    var args=new MinecraftLaunchArguments();
    GenerateArguments(core,options,args,(re,libs)=>{
        if(re!==0){
            event.emit('error',re);
            if(libs.length!=0)event.emit('miss',libs);
            return false;
        }
        Event=event;
        if(LaunchGame(core,args))event.emit('launching');else event.emit('error','Launch error');
    });
}
function GenerateArguments(core,options,args,fun){
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
            args.NativePath=core.GameRootPath+'/natives';
            try{fs.mkdirSync(args.NativePath);}catch(e){}
            for(var i=0;i<options.Version.Natives.length;i++){
                var n=options.Version.Natives[i];
                UnzipFile(item.GetNativePath(n),args.NativePath,n.Options);
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
                game_directory:core.GameRootPath,
                game_assets:AssetsPath,
                assets_root:AssetsPath,
                assets_index_name:options.Version.Assets,
                auth_uuid:authentication.UUID,
                user_properties:authentication.Properties,
                user_type:authentication.UserType
            };
            args.AdvencedArguments=new Array('-Dfml.ignoreInvalidMinecraftCertificates=true','-Dfml.ignorePatchDiscrepancies=true');
            args.Authentication=authentication;
            args.Version=options.Version;
            fun(0,missLibrary);
        }catch(e){
            Event.emit('error',e);
        }
    });
}
function UnzipFile(file,path,opt){
    fs.createReadStream(file).pipe(unzip.Parse()).on('entry',entry=>{
        if(isHas(entry.path,opt)||entry.type!='File')entry.autodrain();else entry.pipe(fs.createWriteStream(path+'/'+entry.path));
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
function LaunchGame(core,args){
    console.log(args.ToArguments())
    var child=require('child_process').spawn(core.JavaPath,args.ToArguments());
    child.on('error',d=>Event.emit('error',d.toString()));
    child.stdout.on('data',d=>Event.emit('data',d.toString()));
    child.stderr.on('data',d=>Event.emit('error',d.toString()));
    child.on('exit',d=>Event.emit('exit',d.toString()));
    return true;
}