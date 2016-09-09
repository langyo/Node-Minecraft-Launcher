'use strict';
const pr=require('child_process'),os=require('os'),Path=require('path'),fs=require('fs');
module.exports={
    GetSystemType(){
        switch(os.platform()){
            case'win32':return'windows';
            case'darwin':return'osx';
            default:return'linux';
        }
    },
    FindJava(){
        switch(this.GetSystemType()){
            case'windows':
                var s=this.FindJavaInternal('Wow6432Node\\');
                if(s)return s;else return this.FindJavaInternal();
            case'linux':
            case'osx':
                var s=Path.format({dir:pr.execSync('echo $JAVA_HOME'),base:'bin/java'});
                if(fs.existsSync(s))return s;else return false;
        }
    },
    GetArch(){
        return process.config.variables.host_arch=='x64'?64:32;
    },
    GetNodeArch(){
        return process.arch=='x64'?64:32;
    },
    FindJavaInternal(key){
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
}