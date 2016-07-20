﻿module.exports=function(displayName){
    this.Type='JSMCCC.Offline';
    var DisplayName=displayName;
    this.Do=function(){
        if((typeof DisplayName)!='string'||DisplayName.indexOf(' ')!=-1)throw('DisplayName does not conform to the specification');
        const UUID=require('../tools/UUID.js');
		return {
            AccessToken:UUID.randomUUID(),
            DisplayName:DisplayName,
            UUID:UUID.randomUUID(),
            Properties:'{}',
            UserType:'mojang'
        }
    }
}