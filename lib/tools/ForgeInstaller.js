const fs=require('fs'),EventEmitter=require('events').EventEmitter,unzip=require('unzip'),Path=require('path');
module.exports=function(file,path,id,inheritsFrom){
    const event=new EventEmitter();
    try{
        if(!fs.statSync(file).isFile())throw('This TM is not a file at all');
        make(path);
        fs.createReadStream(file).pipe(unzip.Parse()).on('entry',entry=>{
            if(entry.type!='File'||entry.path!='install_profile.json'){
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
                for(var i=0;i<out.libraries.length;i++){
                    if(out.libraries[i].clientreq!=undefined&&!out.libraries[i].clientreq){
                        out.libraries.splice(i--,1);
                        continue;
                    }
                    delete out.libraries[i].serverreq;
                    delete out.libraries[i].clientreq;
                }
                var w=fs.createWriteStream(Path.format({dir:p,base:out.id+'.json'}));
                w.on('error',error=>event.emit('error',error));
                w.on('finish',()=>event.emit('end'));
                w.write(JSON.stringify(out));
                w.end();
            });
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