const LauncherCore=require('jsmccc').LauncherCore,OfflineAuthenticator=require('jsmccc').OfflineAuthenticator;
var core=new LauncherCore();
if(!core.Launch({
    Version:core.GetVersion('1.8.8'),
    Authenticator:new OfflineAuthenticator('Steve'),
},data=>{
    console.log('log: ',data);
},err=>{
    console.error('error: ',err);
},exit=>{
    console.warn('exit: ',exit);
}))console.error(this.MissLibrary);