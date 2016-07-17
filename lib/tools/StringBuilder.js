module.exports=function StringBuilder(){
    var _stringArray=new Array();
    this.append=function(str){
        _stringArray.push(str);
        return this;
    }
    this.toString=function(){
        return _stringArray.join('');
    }
}