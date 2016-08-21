const fs=require('fs'),EventEmitter=require('events').EventEmitter,AdmZip=require('adm-zip'),Path=require('path');
module.exports=function(file,path,mod,id,inheritsFrom){
    const event=new EventEmitter();
    try{
        if(!fs.statSync(file).isFile())throw('This TM is not a file at all');
        make(path);
        if(mod){
            var zip=new AdmZip(file);
            zip.getEntries().forEach(zipEntry=>{
                if(zipEntry.entryName.substr(0,11)!='liteloader-'&&zipEntry.entryName.substr(zipEntry.entryName.length-4,4)!='.jar')return;
                zip.extractEntryTo(zipEntry.entryName,path,false,true);
                event.emit('end');
            });
        }else{
            var json=JSON.parse(new AdmZip(file).readAsText('install_profile.json')),msg=json.install,out=json.versionInfo;
            out.id=isNull(id)?out.id:id;
            out.inheritsFrom=isNull(inheritsFrom)?out.inheritsFrom:inheritsFrom;
            var p=Path.format({dir:Path.format({dir:path,base:out.inheritsFrom}),base:out.inheritsFrom+'.json'});
            if(!fs.statSync(p).isFile()){
                event.emit('error','The minecraft json('+p+') TM is not a file at all');
                return;
            }
            p=Path.format({dir:path,base:out.id});
            make(p);
            var w=fs.createWriteStream(Path.format({dir:p,base:out.id+'.json'}));
            w.on('error',error=>event.emit('error',error));
            w.on('finish',()=>event.emit('end'));
            w.write(JSON.stringify(out));
            w.end();
        }
    }catch(e){
        event.emit('error',e);
    }
    return event;
}
function make(path){
    try{
        if(!fs.statSync(path).isDirectory())fs.mkdirSync(path);
    }catch(e){
        fs.mkdirSync(path);
    }
}
function isNull(obj){
    return obj==null||obj==undefined||obj=='';
}