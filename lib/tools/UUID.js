'use strict';
exports.randomUUID=function(){
    var chars='0123456789abcdefghijklmnopqrstuvwxyz'.split(''),uuid=new Array(36),rnd=0,r;
    for(var i=0;i<36;i++){
        if(i==14)uuid[i]='4';else{
            if (rnd<=0x02)rnd=0x2000000+(Math.random()*0x1000000)|0;
            r=rnd&0xf;
            rnd=rnd>>4;
            uuid[i]=chars[(i==19)?(r&0x3)|0x8:r];
      }
    }
    return uuid.join('');
};