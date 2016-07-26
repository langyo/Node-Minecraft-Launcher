const https=require('../tools/HttpRequester.js'),tools=require('../tools/Tools.js'),Yggdrasil=require('./Yggdrasil.js'),
OfflineAuthenticator=require('./OfflineAuthenticator.js'),fs=require('fs'),path=require('path');
module.exports=function(url,name,psw,mod,ygg){
    this.Type='BeeLogin';
    this.DisplayName=name;
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
    this.AsyncDo=function(fun){
        var login=ygg?new Yggdrasil(name,psw).AsyncDo:new OfflineAuthenticator(name).AsyncDo;
        login(re=>{
            if(!re)fun(false);
            this.AccessToken=re.AccessToken;
            this.DisplayName=re.DisplayName;
            this.UUID=re.UUID;
            check(da=>{
                if(!da){
                    fun(false);
                    return false;
                }
                if(mod){
                    http.Get(url+'login.php?username='+this.DisplayName+'&psd='+psw+'&ip='+this.IP+'&gettoken=true').on('data',d=>{
                        if(!d||d.substr(0,3)!='yes'){
                            fun(false);
                            return false;
                        }
                        fs.writeFileSync(path.format({dir:mod,base:'BeeLogin.cfg'}),'beelogin{S:token='+re.replace('yes;','')+'}');
                        fun(this.Do());
                        return true;
                    });
                }else{
                    re=http.Get(url+'login.php?username='+this.DisplayName+'&psd='+psw+'&ip='+this.IP).on('data',d=>{
                        if(re&&re=='yes')fun(this.Do());else fun(false);
                    });
                }
            });
        });
    }
    this.GetShowing=function(fun){
        checkId(re=>{
            if(re)fun(url+'showing.php?id='+this.ID);else fun(false);
        });
    }
    this.Register=function(code,fun){
        var mac=tools.GetMac();
        if(!mac)return false;
        checkId(re1=>{
            if(!re1){
                fun(false);
                return false;
            }
            check(re2=>{
                if(!re2){
                    fun(false);
                    return false;
                }
                http.Get(url+'register.php?username='+this.DisplayName+'&password='+psw+'&pwd_again='+psw+'&ip='+this.IP+
                    '&mac='+mac+'&id='+this.ID+'&code='+code.toUpperCase()).on('data',re=>{
                    if(re)fun(re);else fun(false);
                });
            });
        });
    }
    this.Quit=function(fun){
        check(re1=>{
            if(!re1){
                fun(false);
                return false;
            }
            http.Get(url+'quit.php?&username='+this.DisplayName+'&ip='+this.IP).on('data',re=>{
                if(re)fun(re=='yes');else fun(false);
            });
        });
    }
    this.toString=function(){
        if(isNull(name)||isNull(psw))return false;
        return name+'-'+psw;
    }
    this.from=function(str){
        var re=str.split('-');
        if(re.length!=2)return false;
        return re;
    }
    function check(fun){
        if(this.IP!=undefined&&this.IP!=null&&this.IP!=''){
            fun(true);
            return true;
        }
        tools.GetIP(d=>{
            if(d)this.IP=d;else fun(false);
        });
    }
    function checkId(fun){
        if(this.ID!=undefined&&this.ID!=null&&this.ID!=''){
            fun(true);
            return true;
        }
        http.Get(url+'getid.php').on('data',re=>{
            if(re)this.ID=re;else fun(false);
        });
    }
}