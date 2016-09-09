'use strict';
const Get=require('../tools/HttpRequester.js').Get,Download=require('../tools/HttpRequester.js').Download,path=require('path'),fs=require('fs');
module.exports={
    GetVersionList(fun){
        var r=Get('https://launchermeta.mojang.com/mc/game/version_manifest.json');
        r.on('data',d=>fun(JSON.parse(d)));
        return r;
    },
    DownloadCore(version,p){
        return Download([{Url:`https://s3.amazonaws.com/Minecraft.Download/versions/${version}/${version}.jar`,File:path.format({dir:p,base:`${version}.jar`})},
            {Url:`https://s3.amazonaws.com/Minecraft.Download/versions/${version}/${version}.json`,File:path.format({dir:p,base:`${version}.json`})}]);
    },
    DownloadLibraries(libs,p,fun){
        var arr=[];
        for(var i=0;i<libs.length;i++){
            var file=path.format({dir:p,base:libs[i].Name?libs[i].Name:libs[i]});
            try{
                if(!fs.statSync(file).isFile())throw('');
            }catch(e){
                if(libs[i].Url)arr.push({Url:`https://libraries.minecraft.net/${libs[i]}`,File:file});else if(libs[i].Url.indexOf(libs[i].Name)==-1)
                    arr.push({Url:libs[i].Url+libs[i].Name,File:file});else arr.push({Url:libs[i].Url,File:file});
            }
        }
        if((typeof fun)=='function')fun(arr);
        return Download(arr);
    },
    GetAssetsIndex(version,fun){
        var r=Get('https://s3.amazonaws.com/Minecraft.Download/indexes/'+((version==null||version==''||version==undefined)?'legacy':version)+'.json');
        r.on('data',d=>fun(JSON.parse(d)));
        return r;
    },
    DownloadAssets(assets,p,fun){
        var arr=new Array(),o=assets.objects;
        for(k in o){
            var start=getAssetsUrl(o[k].hash),file=path.format({dir:p,base:'objects/'+start});
            try{
                if(!fs.statSync(file).isFile())throw('');
            }catch(e){
                arr.push({Url:'http://resources.download.minecraft.net/'+start,File:[file,path.format({dir:p,base:'virtual/legacy/'+k.replace('realms/').
                    replace('minecraft/')})]});
            }
        }
        if((typeof fun)=='function')fun(arr);
        return Download2(arr);
    }
}
function getAssetsUrl(sha){
    return sha.substr(0,2)+'/'+sha;
}