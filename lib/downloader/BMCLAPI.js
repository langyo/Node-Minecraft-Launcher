'use strict';
const Get=require('../tools/HttpRequester.js').Get,Download=require('../tools/HttpRequester.js').Download,path=require('path'),fs=require('fs');
module.exports={
    GetForgeVersionList(fun,id){
        var r=Get(`http://bmclapi2.bangbang93.com/forge/minecraft${id?`/${id}`:''}`);
        r.on('data',d=>fun(JSON.parse(d)));
        return r;
    },
    DownloadForge(mv,v,f,p,b){
        return Download([{Url:`http://bmclapi2.bangbang93.com/maven/net/minecraftforge/forge/${mv}-${v}${b?`-${b}`:''}/forge-${mv}-${v}${b?`-${b}`:''}-${f}`,
            File:path.format({dir:p,base:f})}]);
    },
    GetVersionList(fun){
        var r=Get('http://bmclapi2.bangbang93.com/mc/game/version_manifest.json');
        r.on('data',d=>fun(JSON.parse(d)));
        return r;
    },
    DownloadCore(version,p){
        return Download([{Url:`http://bmclapi2.bangbang93.com/version/${version}/client`,File:path.format({dir:p,base:`${version}.jar`})},
            {Url:`http://bmclapi2.bangbang93.com/version/${version}/json`,File:path.format({dir:p,base:`${version}.json`})}]);
    },
    DownloadLibraries(libs,p,fun){
        var arr=[];
        for(var i=0;i<libs.length;i++){
            var file=path.format({dir:p,base:libs[i].Name==undefined?libs[i]:libs[i].Name});
            try{
                if(!fs.statSync(file).isFile())throw('');
            }catch(e){
                if(libs[i].Url==undefined)arr.push({Url:'http://bmclapi2.bangbang93.com/libraries/'+libs[i],File:file});else if(libs[i].Url.indexOf(libs[i].Name)==-1)
                    arr.push({Url:libs[i].Url+libs[i].Name,File:file});else arr.push({Url:libs[i].Url,File:file});
            }
        }
        if((typeof fun)=='function')fun(arr);
        return Download(arr);
    },
    GetAssetsIndex(version,fun){
        var r=Get(`http://bmclapi2.bangbang93.com/indexes/${version||'legacy'}.json`);
        r.on('data',d=>fun(JSON.parse(d)));
        return r;
    },
    DownloadAssets(assets,p,fun){
        var arr=[],o=assets.objects;
        for(k in o){
            var start=getAssetsUrl(o[k].hash),file=path.format({dir:p,base:`objects/${start}`});
            try{
                if(!fs.statSync(file).isFile())throw('');
            }catch(e){
                arr.push({Url:`http://bmclapi2.bangbang93.com/assets/${start}`,File:[file,path.format({dir:p,base:`virtual/legacy/${k.replace('realms/').
                    replace('minecraft/')}`})]});
            }
        }
        if((typeof fun)=='function')fun(arr);
        return Download2(arr);
    }
}
function getAssetsUrl(sha){
    return `${sha.substr(0,2)}/${sha}`;
}