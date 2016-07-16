module.exports=function(){
    var container=new Object();
    this.put=function(key,value){
        container[key]=value;
    }
    this.get=function(key){
        return container[key];
    }
    this.keySet=function(){
        var keyset=new Array(),count=0;
        for(var i=0;i<container.length;i++){
            if(container[i]=='extend')continue;
            keyset[count]=container[i];
            count++;
        }
        return keyset;
    }
    this.size=function(){
        var count=0;
        for(var i=0;i<container.length;i++){
            if(container[i]=='extend')continue;
            count++;
        }
        return count;
    }
    this.remove=function(key) {
        delete container[key];
    }
    this.toString=function(){
        var str="";
        for (var i=0,keys=this.keySet(),len=keys.length;i<len;i++)str+=keys[i]+'='+container[keys[i]]+';\n';
        return str;
    }
    this.contains=function(key){
        var re=this.get(key);
        return re!=null&&re!=undefined;
    }
}