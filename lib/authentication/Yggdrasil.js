const https=require('https'),fs=require('fs');
module.exports=function(email,password){
    this.Type='Yggdrasil';
    this.ClientToken=require('../tools/UUID.js').randomUUID();
    this.AsyncDo=function(fun){
        if(isNull(email)||isNull(password)||email==''||password=='')throw('Email or password is null');
        if(isNull(this.AccessToken)||isNull(this.UUID)||isNull(this.DisplayName))post('{"agent":{"name":"Minecraft","version":1},"username":"'+
        email+'","password":"'+password+'","clientToken":"'+this.ClientToken+'"}',re=>{
            var j=JSON.parse(re);
            if(isNull(j.selectedProfile.id)||isNull(j.selectedProfile.name)){
                fun(false);
                return false;
            }
            this.AccessToken=j.accessToken;
            this.DisplayName=j.selectedProfile.name;
            this.UUID=j.selectedProfile.id;
            fun(this.Do());
        },'authenticate');
    }
    this.Do=function(){
        if(isNull(this.AccessToken)||isNull(this.DisplayName)||isNull(this.UUID))return false;
        return {
            AccessToken:this.AccessToken,
            DisplayName:this.DisplayName,
            UUID:this.UUID,
            Properties:'{}',
            UserType:'mojang'
        }
    }
    this.Refresh=function(fun){
        if(v())return false;
        post('{"accessToken":"'+this.AccessToken+'","clientToken":"'+this.ClientToken+'"}',d=>{
            var j=JSON.parse(d);
            if(isNull(j.selectedProfile.id)||isNull(j.selectedProfile.name)){
                fun(false);
                return false;
            }
            this.DisplayName=j.selectedProfile.name;
            this.UUID=j.selectedProfile.id;
            fun(true);
            return true;
        },'refresh');
    }
    this.Validate=function(fun){
        if(isNull(this.AccessToken))return false;
        var data='{"accessToken":"'+this.AccessToken+'"}';
        var options={
            host:'authserver.mojang.com',
            port:443,
            path:'/validate',
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'Content-Length':data.length
            }
        };
        https.request(options,res=>fun(res.statusCode==204)).on('error',e=>{throw('Http request error: '+e);}).write(data+'\n');
    }
    this.Signout=function(fun){
        if(isNull(email)||isNull(password)||email==''||password=='')throw('Email or password are null');
        post('{"username":"'+email+'","password":"'+password+'"}',function(d){fun(d=='');},'signout');
    }
    this.Invalidate=function(fun){
        if(v())throw('AccessToken or ClientToken are null');
        post('{"accessToken":"'+this.AccessToken+'","clientToken":"'+this.ClientToken+'"}',function(d){rfun(d=='');},'invalidate');
    }
    function v(){
        return isNull(this.AccessToken)||isNull(this.ClientToken)||this.AccessToken==''||this.ClientToken=='';
    }
    this.toString=function(){
        if(isNull(this.AccessToken)||isNull(this.UUID)||isNull(this.DisplayName))return false;
        return this.AccessToken+'-'+this.UUID+'-'+this.DisplayName;
    }
    this.from=function(str){
        var re=str.split('-');
        if(re.length!=3)return false;
        this.AccessToken=re[0];
        this.UUID=re[1];
        this.DisplayName=re[2];
        return !isNull(this.AccessToken)&&!isNull(this.UUID)&&!isNull(this.DisplayName);
    }
}
function isNull(obj){
    return obj==null||obj==undefined;
}
function post(data,fun,url){
    var options={
        host:'authserver.mojang.com',
        port:443,
        path:'/'+url,
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'Content-Length':data.length
        }
    };
    var body='';
    https.request(options,res=>{
        res.on('data',d=>body+=d.toString());
        res.on('end',()=>{
            if(res.statusCode!=200)throw('StatusError|'+body);
            fun(body);
        });
    }).on('error',e=>{throw('Http request error: '+e);}).write(data+'\n');
}