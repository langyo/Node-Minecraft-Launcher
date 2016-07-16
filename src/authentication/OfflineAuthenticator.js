module.exports=function(displayName){
    this.Type='JSMCCC.Offline';
    var DisplayName=displayName;
    this.Do=function(){
        if((typeof DisplayName)!='string'||DisplayName.indexOf(' ')!=-1)throw('DisplayName does not conform to the specification');
        var re=new Object(),UUID=require('../tools/UUID.js');
        re.AccessToken=UUID.randomUUID();
		re.DisplayName=DisplayName;
		re.UUID=UUID.randomUUID();
		re.Properties='{}';
		re.UserType='mojang';
		return re;
    }
}