const path = require('path'),
    fs = require('co-fs');

const getAssetsUrl = sha => {
    return `${sha.substr(0,2)}/${sha}`;
};

module.exports = {
    _http: require('../tools/HttpRequester.js'),
    GetForgeVersionList : function* (id) {
        return (yield this._http.Get(`http://bmclapi2.bangbang93.com/forge/minecraft${id?`/${id}`:''}`)).json();
    },
    DownloadForge(mv,v,f,p,b){
        return this._http.Download([{Url:`http://bmclapi2.bangbang93.com/maven/net/minecraftforge/forge/${mv}-${v}${b?`-${b}`:''}/forge-${mv}-${v}${b?`-${b}`:''}-${f}`,
            File:path.format({dir:p,base:f})}]);
    },
    GetVersionList : function* (){
        return (yield this._http.Get('http://bmclapi2.bangbang93.com/mc/game/version_manifest.json')).json();
    },
    DownloadCore(version,p){
        return this._http.Download([{Url:`http://bmclapi2.bangbang93.com/version/${version}/client`,File:path.format({dir:p,base:`${version}.jar`})},
            {Url:`http://bmclapi2.bangbang93.com/version/${version}/json`,File:path.format({dir:p,base:`${version}.json`})}]);
    },
    DownloadLibraries : function* (libs,p,fun){
        var arr=[];
        for(var lib of libs){
            var file=path.format({dir:p,base:lib.Name||lib});
            try{
                if(!(yield fs.stat(file)).isFile()){
                    throw('');
                }
            }catch(e){
                if(!lib.Url){
                    arr.push({Url:`http://bmclapi2.bangbang93.com/libraries/${lib}`,File:file});
                } else if(lib.Url==='http://files.minecraftforge.net/maven/'){
                    if(lib.Name.indexOf('net/minecraftforge/forge/')===-1){
                        arr.push({Url:`http://bmclapi2.bangbang93.com/libraries/${lib.Name}`,File:file});
                    } else {
                        arr.push({Url:`http://bmclapi2.bangbang93.com/libraries/${lib.Name}`.replace('.jar','-universal.jar'),File:file});
                    }
                }else if(lib.Url.indexOf(lib.Name)===-1){
                    arr.push({Url:`${lib.Url}${lib.Name}`,File:file});
                }else {
                    arr.push({Url:lib.Url,File:file});
                }
            }
        }
        if((typeof fun)==='function'){
            fun(arr);
        }
        return this._http.Download(arr);
    },
    GetAssetsIndex : function* (version){
        return (yield this._http.Get(`http://bmclapi2.bangbang93.com/indexes/${version||'legacy'}.json`)).json();
    },
    DownloadAssets : function* (assets,p,fun){
        var arr=[];
        for(var k of assets.objects){
            var start=getAssetsUrl(k.hash),file=path.format({dir:p,base:`objects/${start}`});
            try{
                if(!(yield fs.stat(file)).isFile()){
                    throw('');
                }
            }catch(e){
                arr.push({Url:`http://bmclapi2.bangbang93.com/assets/${start}`,File:[file,path.format({dir:p,base:`virtual/legacy/${k.replace('realms/').
                    replace('minecraft/')}`})]});
            }
        }
        if((typeof fun)==='function'){
            fun(arr);
        }
        return this._http.Download2(arr);
    },
    GetLiteLoaderList : function* (id) {
        return (yield this._http.Get(`http://bmclapi2.bangbang93.com/liteloader/list${id?`?mcversion=${id}`:''}`)).json();
    },
    DownloadLiteLoader(version, p){
        return this._http.Download([{Url:`http://bmclapi2.bangbang93.com/liteloader/download?version=${version}`,File:path.format({dir:p,base:`${version}.jar`})}]);
    }
};