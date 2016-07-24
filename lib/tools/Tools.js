const http=require('./HttpRequester.js'),os=require('os'),SystemTools=require('./SystemTools.js');
exports.GetIP=function(fun){
    http.Get('http://ddns.oray.com/checkip').on('data',d=>fun(d.replace('<html><head><title>Current IP Check</title></head><body>Current IP Address: ','').replace('</body></html>','')));
}
exports.GetMac=function(){
    var o=os.networkInterfaces();
    for(s in o)return o[s][0].mac.toUpperCase();
    return false;
}
exports.GetUserDll=function(){
    try{
        if(SystemTools.GetSystemType()!='windows')return false;
        return require('./Dlls/User'+SystemTools.GetNodeArch()+'.node');
    }catch(e){
        return false;
    }
}