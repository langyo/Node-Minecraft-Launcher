const fs=require('fs'),unzip=require('unzipper');
var missLibrary,Event;
module.exports=function(core,options,event){
    if(!fs.existsSync(core.JavaPath))throw('No java');
    const MinecraftLaunchArguments=require('./LaunchArguments.js');
    var args=new MinecraftLaunchArguments();
    GenerateArguments(core,options,args,re=>{
        if(!re){
            core.MissLibrary=missLibrary;
            event.emit('error','MissLibrary');
            return false;
        }
        core.MissLibrary=new Array();
        Event=event;
        if(LaunchGame(core,args))event.emit('data','Launching');else event.emit('error','Launch error');
    });
}
function GenerateArguments(core,options,args,fun){
    const Item=require('../version/LauncherCoreItemResolverExtensions.js');
    var item=new Item(core);
    options.Authenticator.AsyncDo(authentication=>{
        if(!authentication)throw('Validation error');
        args.CGCEnabled=true;
        args.MainClass=options.Version.MainClass;
        args.MaxMemory=options.MaxMemory;
        args.AgentPath=options.AgentPath;
        args.MinMemory=options.MinMemory;
        args.Libraries=new Array();
        missLibrary=new Array();
        for(var i=0;i<options.Version.Libraries.length;i++){
            var lib=options.Version.Libraries[i],l=item.GetLibPath(lib);
            if(fs.existsSync(l))args.Libraries.push(l);else{
                var name=item.GetLibName(lib);
                if(lib.Url==undefined)missLibrary.push(name);else missLibrary.push({Name:name,Url:lib.Url});
            }
        }
        if(missLibrary.length!=0)fun(false);
        args.NativePath=core.GameRootPath+'/natives';
        try{fs.mkdirSync(args.NativePath);}catch(e){}
        for(var i=0;i<options.Version.Natives.length;i++){
            var n=options.Version.Natives[i];
            UnzipFile(item.GetNativePath(n),args.NativePath,n.Options);
        }
        args.Server=options.Server;
        args.Size=options.Size;
        if(options.Version.JarId!=undefined)args.Libraries.push(item.GetVersionJarPath(options.Version.JarId));
        args.MinecraftArguments=options.Version.MinecraftArguments;
        var AssetsPath=options.Version.Assets=='legacy'?core.GameRootPath+'/assets/virtual/legacy':core.GameRootPath+'/assets';
        args.Tokens.push(new Array('auth_access_token',authentication.AccessToken));
        args.Tokens.push(new Array('auth_session',authentication.AccessToken));
        args.Tokens.push(new Array('auth_player_name',authentication.DisplayName));
        args.Tokens.push(new Array('version_name',options.Version.Id));
        args.Tokens.push(new Array('game_directory',core.GameRootPath));
        args.Tokens.push(new Array('game_assets',AssetsPath));
        args.Tokens.push(new Array('assets_root',AssetsPath));
        args.Tokens.push(new Array('assets_index_name',options.Version.Assets));
        args.Tokens.push(new Array('auth_uuid',authentication.UUID));
        args.Tokens.push(new Array('user_properties',authentication.Properties));
        args.Tokens.push(new Array('user_type',authentication.UserType));
        args.AdvencedArguments=new Array('-Dfml.ignoreInvalidMinecraftCertificates=true','-Dfml.ignorePatchDiscrepancies=true');
        args.Authentication=authentication;
        args.Version=options.Version;
        fun(true);
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
    var child=require('child_process').spawn(core.JavaPath,args.ToArguments());
    child.on('error',d=>Event.emit('error',d.toString()));
    child.stdout.on('data',d=>Event.emit('data',d.toString()));
    child.stderr.on('data',d=>Event.emit('data',d.toString()));
    child.on('exit',d=>Event.emit('exit',d.toString()));
    return true;
}