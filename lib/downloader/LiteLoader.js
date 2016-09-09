'use strict';
const Get=require('../tools/HttpRequester.js').Get,Download=require('../tools/HttpRequester.js').Download,path=require('path'),fs=require('fs');
module.exports={
    GetVersionList(fun){
        var r=Get('http://dl.liteloader.com/versions/versions.json');
        r.on('data',d=>fun(JSON.parse(d)));
        return r;
    },
    Download(stream,version,p){
        return Download([{Url:stream?`http://jenkins.liteloader.com/job/LiteLoaderInstaller%20${version}/lastSuccessfulBuild/artifact/build/libs/liteloader-installer-${version}-00-SNAPSHOT.jar`:`http://dl.liteloader.com/redist/${version}/liteloader-installer-${version}-00.jar`,File:path.format({dir:p,base:'Installer.jar'})}]);
    }
}