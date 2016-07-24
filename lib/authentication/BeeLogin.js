const https=require('../tools/HttpRequester.js'),tools=require('../tools/Tools.js'),sync=require('simplesync'),Yggdrasil=require('./Yggdrasil.js'),OfflineAuthenticator=require('./OfflineAuthenticator.js'),fs=require('fs'),path=require('path');
module.exports=function(url,name,psw,mod,ygg){
    this.Type='BeeLogin';
    this.DisplayName=name;
    this.Do=function(){
        var re=ygg?new Yggdrasil(name,psw).Do():new OfflineAuthenticator(name).Do();
        if(!re)return false;
        this.AccessToken=re.AccessToken;
        this.DisplayName=re.DisplayName;
        this.UUID=re.UUID;
        if(check())this.IP=sync.wait(tools.GetIP(sync.cb('d'))).d;
        if(mod){
            re=sync.wait(http.Get(url+'login.php?username='+this.DisplayName+'&psd='+psw+'&ip='+this.IP+'&gettoken=true').on('data',sync.cb('d'))).d;
            if(!re||re.substr(0,3)!='yes')return false;
            fs.writeFileSync(path.format({dir:mod,base:'BeeLogin.cfg'}),'beelogin{S:token='+re.replace('yes;','')+'}');
        }else{
            re=sync.wait(http.Get(url+'login.php?username='+this.DisplayName+'&psd='+psw+'&ip='+this.IP).on('data',sync.cb('d'))).d;
            if(!re||re!='yes')return false;
        }
		return {
            AccessToken:this.AccessToken,
            DisplayName:this.DisplayName,
            UUID:this.UUID,
            Properties:'{}',
            UserType:'mojang'
        }
    }
    this.GetShowing=function(){
        sync.block(()=>{
            if(checkId())this.ID=sync.wait(http.Get().on('data',sync.cb('d'))).d;
        });
        return url+'showing.php?id='+this.ID;
    }
    this.Register=function(code){
        var mac=tools.GetMac();
        if(!mac)return false;
        var re;
        sync.block(()=>{
            if(checkId())this.ID=sync.wait(http.Get(url+'getid.php').on('data',sync.cb('d'))).d;
            if(check())this.IP=sync.wait(tools.GetIP(sync.cb('d'))).d;
            re=sync.wait(http.Get(url+'register.php?username='+this.DisplayName+'&password='+psw+'&pwd_again='+psw+'&ip='+this.IP+'&mac='+mac+'&id='+this.ID+'&code='+code.toUpperCase()).on('data',sync.cb('d'))).d;
        });
        return re;
    }
    this.Quit=function(){
        var re;
        sync.block(()=>{
            if(check())this.IP=sync.wait(tools.GetIP(sync.cb('d'))).d;
            re=sync.wait(http.Get(url+'quit.php?&username='+this.DisplayName+'&ip='+this.IP).on('data',sync.cb('d'))).d;
        });
        return re&&re=='yes';
    }
    function check(){
        return this.IP==undefined||this.IP==null||this.IP=='';
    }
    function checkId(){
        return this.ID==undefined||this.ID==null||this.ID=='';
    }
}