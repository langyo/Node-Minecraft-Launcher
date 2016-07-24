const fs=require('fs'),EventEmitter=require('events').EventEmitter,unzip=require('unzipper'),Path=require('path');
module.exports=function(file,path,mod,id,inheritsFrom){
    const event=new EventEmitter();
    try{
        if(!fs.statSync(file).isFile())throw('This TM is not a file at all');
        make(path);
        fs.createReadStream(file).pipe(unzip.Parse()).on('entry',entry=>{
            if(entry.type!='File'){
                entry.autodrain();
                return;
            }
            if(mod){
               if(entry.path.substr(0,11)!='liteloader-'&&entry.path.substr(entry.path.length-4,4)!='.jar'){
                    entry.autodrain();
                    return;
                }
                var w=fs.createWriteStream(Path.format({dir:path,base:'LiteLoader.jar'}));
                w.on('error',error=>event.emit('error',error));
                w.on('finish',()=>event.emit('end'));
                event.pipe(w);
                return;
            }else{
                if(entry.path!='install_profile.json'){
                    entry.autodrain();
                    return;
                }
                var arr=new Array();
                entry.on('data',d=>arr.push(d));
                entry.on('error',error=>event.emit('error',error));
                entry.on('end',()=>{
                    var json=JSON.parse(Buffer.concat(arr).toString()),msg=json.install,out=json.versionInfo;
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
                });
            }
        });
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