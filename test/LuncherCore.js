const LauncherCore=require('jsmccc').LauncherCore,OfflineAuthenticator=require('jsmccc').OfflineAuthenticator;
var core=new LauncherCore();
if(!core.Launch({
    Version:core.GetVersion('1.8.8'),
    Authenticator:new OfflineAuthenticator('Steve'),
},event=>{
    event.on('data',data=>{
        console.log('log: ',data);
    }).on('error',error=>{
        console.error('error: ',error);
    }).on('exit',exit=>{
        console.warn('exit: ',exit);
    }).on('miss',libraries=>{
        console.error('missLibraries: ',libraries);
    });
}))console.error('Can not start');