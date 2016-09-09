'use strict';
const st=require('../tools/SystemTools.js'),Get=require('../tools/HttpRequester.js').Get,Download=require('../tools/HttpRequester.js').Download;
module.exports=function(p,fun){
	var t=st.GetSystemType();
	if(t=='osx')return Get('http://libs.x-speed.cc/JavaDownloadConfig.json').on('data',d=>{
    		var j=JSON.parse(d);
    		fun(Download([{Url:j.DownloadUrl,File:p}]),j);
    	});else return Get('http://www.java.com/zh_CN/download/manual.jsp').on('data',d=>fun(t=='windows'?Download([{Url:getSubstr(d,st.GetArch()==64?
    		'<a title="下载 Java 软件 Windows （64 位）" href="':'<a title="下载 Java 软件 Windows 脱机" href="','">'),File:p}]):Download([{Url:getSubstr(d,
    			st.GetArch()==64?'<a title="下载 Java 软件 Linux" href="':'<a title="下载 Java 软件 Linux x64" href="','" '),File:p}]),getArgs(d)));
}
function getSubstr(ret,strs,stre){
	var deps=ret.indexOf(strs)+strs.length;
	return ret.substr(deps,(stre?ret.indexOf(stre,deps):ret.length)-deps);
}
function getArgs(s){
	var g=s.match(new RegExp('推荐 Version ([0-9]+) Update ([0-9]+)</h4>'));
	return 'jre1.'+g[1]+'.0_'+g[2];
}