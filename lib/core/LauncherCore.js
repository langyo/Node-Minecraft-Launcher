'use strict';
const st=require('../tools/SystemTools.js'),JVersionLocator=require('../version/JVersionLocator.js'),path=require('path'),fs=require('fs'),LAI=require('./LauncherCoreInternal.js');
module.exports={
    create(grp,jp,vl){
        try{
            grp=grp?(grp.substr(grp.length>0?grp.length-1:0,1)===path.sep?grp.substr(0,grp.length-1):grp):'.minecraft';
            if(!fs.statSync(grp).isDirectory())throw('Root directory does not exist');
            if(!jp){
                var a=st.FindJava();
                jp=a.length>0?a[a.length-1]:'';
            }
            if(!fs.statSync(jp).isFile())throw('Java path is not correct');
            var config={
                GameRootPath:grp,
                JavaPath:jp,
            }
            return{
                _currentCode:0,
                _versionLocator:JVersionLocator.create(config),
                VersionLocator:vl,
                GetVersions(){
                    if(!this._versionLocator)return false;
                    return this._versionLocator.GetAllVersions();
                },
                GetVersion(id){
                    if(!this._versionLocator)return false;
                    return this._versionLocator.Locate(id);
                },
                Launch(opts){
                    return LAI(config,opts);
                }
            }
        }catch(e){
            console.log(e)
            return false;
        }
    }
}