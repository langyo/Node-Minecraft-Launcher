var pr=require('child_process'),os=require('os');
function getSystemType(){
    var re=os.platform();
    return re=='win32'?'windows':re;
}
exports.FindJava=function(){
    if(getSystemType()!='windows')return false;
    var s=findJavaInternal('Wow6432Node\\');
    if(s)return s;else return findJavaInternal();
}
exports.GetArch=function(){
    var re=os.arch();
    return re=='x64'?'64':'32';
}
function findJavaInternal(key){
    try{
        var s=pr.execSync('REG QUERY "HKEY_LOCAL_MACHINE\\SOFTWARE\\'+key+'JavaSoft\\Java Runtime Environment"').toString();
        if(s==null||s=='')return false;
        var d=s.split('\r\n\r\n');
        if(d.length!=2)return false;
        d=d[1].split('\r\n');
        var array=new Array(),j;
        for(var i=0;i<d.length;i++){
            if(d[i]!='')try{
                var u=pr.execSync('REG QUERY "'+d[i]+'" /v JavaHome').toString().split('    ');
                if(u.length==4)array.push(u[3].replace('\r\n\r\n','')+'\\bin\\javaw.exe');
			}catch(e){}
        }
        if(array.length==0)return false;
        return array;
    }catch(e){
        return false;
    }
}
exports.GetSystemType=getSystemType;
exports.FindJavaInternal=findJavaInternal;