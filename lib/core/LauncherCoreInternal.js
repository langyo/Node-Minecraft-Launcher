'use strict';
const fs=require('fs'),AdmZip=require('adm-zip'),Item=require('../version/LauncherCoreItemResolverExtensions.js'),EventEmitter=require('events').EventEmitter,MinecraftLaunchArguments=require('./LaunchArguments.js'),spawn=require('child_process').spawn;
module.exports=function(core,options){
    const event=new EventEmitter();
    var args=new MinecraftLaunchArguments();
    GenerateArguments(core,options,args,event,(re,libs)=>{
        if(re!==0){
            event.emit('error',re);
            if(libs.length!=0)event.emit('miss',libs);
            return false;
        }
        event.emit('launching');
        var child=spawn(core.JavaPath,args.ToArguments(),{cwd:core.GameRootPath});
        var launched=function(){
            clearTimeout(time);
        },time=setTimeout(()=>{
            child.removeListener('exit',launched);
            event.emit('launched');
        },13000);
        child.on('log_error',d=>event.emit('error',d.toString())).once('exit',d=>event.emit('exit',d.toString())).once('exit',launched);
        child.stdout.on('log_data',d=>event.emit('data',d.toString()));
        child.stderr.on('log_error',d=>event.emit('error',d.toString()));
    });
    return event;
}
function GenerateArguments(core,options,args,event,fun){
    var item=Item.get(core);
    options.Authenticator.AsyncDo(authentication=>{
        try{
            if(!authentication){
                fun('Validation error',missLibrary);
                return;
            }
            var missLibrary=[];
            args.CGCEnabled=true;
            args.VersionType=options.VersionType;
            args.MainClass=options.Version.MainClass;
            args.MaxMemory=options.MaxMemory;
            args.AgentPath=options.AgentPath;
            args.MinMemory=options.MinMemory;
            args.Libraries=[];
            options.Version.Libraries.forEach(lib=>{
                var l=item.GetLibPath(lib);
                if(fs.existsSync(l))args.Libraries.push(l);else{
                    var name=item.GetLibName(lib);
                    if(!lib.Url)missLibrary.push(name);else missLibrary.push({Name:name,Url:lib.Url});
                }
            });
            args.NativePath=`${core.GameRootPath}${options.Version.JarId?`/versions/${options.Version.JarId}`:''}/natives/`;
            try{fs.mkdirSync(args.NativePath);}catch(e){}
            options.Version.Natives.forEach(n=>{
                var l=item.GetNativePath(n);
                if(fs.existsSync(l))UnzipFile(l,args.NativePath,n.Options);else{
                    var name=item.GetNativeName(n);
                    if(!lib.Url)missLibrary.push(name);else missLibrary.push({Name:name,Url:lib.Url});
                }
            });
            if(missLibrary.length!=0){
                fun('MissLibrary',missLibrary);
                return;
            }
            args.Server=options.Server;
            args.Size=options.Size;
            if(options.Version.JarId)args.Libraries.push(item.GetVersionJarPath(options.Version.JarId));
            args.MinecraftArguments=options.Version.MinecraftArguments.split(' ');
            var AssetsPath=options.Version.Assets==='legacy'?`${core.GameRootPath}/assets/virtual/legacy`:`${core.GameRootPath}/assets`;
            args.Tokens={
                auth_access_token:authentication.AccessToken,
                auth_session:authentication.AccessToken,
                auth_player_name:authentication.DisplayName,
                version_name:options.Version.JarId,
                game_directory:`${core.GameRootPath}${options.Version.JarId?`/versions/${options.Version.JarId}`:''}`,
                game_assets:AssetsPath,
                assets_root:AssetsPath,
                assets_index_name:options.Version.Assets,
                auth_uuid:authentication.UUID,
                user_properties:authentication.Properties,
                user_type:authentication.UserType
            };
            if(!options.AdvencedArguments)options.AdvencedArguments=[];
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
    zip.getEntries().forEach(zipEntry=>{
        try{if(!zipEntry.isDirectory&&!isHas(zipEntry.entryName,opt))zip.extractEntryTo(zipEntry.entryName,path);}catch(e){}
    });
}
function isHas(obj,opt){
    if(!opt.Exclude)return false;
    opt.Exclude.forEach(ex=>{
        if(startWith(obj,ex))return true;
    });
    return false;
}
function startWith(str1,str2){
    return new RegExp(`^${str2}`).test(str1);
}