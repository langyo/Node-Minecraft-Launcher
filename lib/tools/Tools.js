'use strict';
const http=require('./HttpRequester.js'),os=require('os'),SystemTools=require('./SystemTools.js');
module.exports={
    GetIP(fun){
        http.Get('http://ddns.oray.com/checkip').on('data',d=>fun(d.replace('<html><head><title>Current IP Check</title></head><body>Current IP Address: ','').replace('</body></html>','')));
    },
    GetMac(){
        var o=os.networkInterfaces();
        for(s in o)return o[s][0].mac.toUpperCase();
        return false;
    },
    GetUserDll(){
        try{
            if(SystemTools.GetSystemType()!='windows')return false;
            return require('./Dlls/User'+SystemTools.GetNodeArch()+'.node');
        }catch(e){
            return false;
        }
    }
}