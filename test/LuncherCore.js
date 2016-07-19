const LauncherCore=require('jsmccc').LauncherCore,OfflineAuthenticator=require('jsmccc').OfflineAuthenticator;
var core=new LauncherCore();
if(!core.Launch({
    Version:core.GetVersion('1.8.8'),
    Authenticator:new OfflineAuthenticator('Steve'),
},event=>{
    event.on('data',data=>{
        console.log('log: ',data);
    });
    event.on('error',error=>{
        console.error('error: ',error);
    });
    event.on('exit',exit=>{
        console.warn('exit: ',exit);
    });
}))console.error(this.MissLibrary);