const fetch=require('node-fetch'),fs=require('fs'),EventEmitter=require('events').EventEmitter;
exports.Download=function(urls){
    const event=new EventEmitter();
    for(var i=0;i<urls.length;i++)dow(urls[i].Url,urls[i].File,i,event);
    return event;
}
function dow(url,file,i,event){
    fetch(url,{timeout:10000}).then(res=>{
        if(!res.ok)return;
        try{
            var w=fs.createWriteStream(file);
            w.on('error',error=>{
                event.emit('error',error);
                throw(error);
            });
            var b=res.body,length=res.headers.get('content-length'),now=0;
            b.on('data',d=>{
                now+=d.length;
                event.emit('location',parseInt(now/length*100),i,now,length);
            });
            b.on('end',()=>event.emit('end',i,length));
            b.on('error',error=>event.emit('error',error));
            res.body.pipe(w);
        }catch(e){
            event.emit('error',e);
        }
    });
}
exports.Get=function(url,data,headers){
    const event=new EventEmitter();
    fetch(url,{timeout:10000,method:data==undefined?'GET':'POST',body:data==undefined?null:data,headers:headers==undefined?null:headers}).then(res=>{
        if(!res.ok)return;
        try{
            var b=res.body,arr=new Array();
            b.on('data',d=>arr.push(d));
            b.on('end',()=>event.emit('data',Buffer.concat(arr).toString()));
            b.on('error',error=>event.emit('error',error));
        }catch(e){
            event.emit('error',e);
        }
    });
    return event;
}
exports.Download2=function(urls){
    const event=new EventEmitter();
    for(var i=0;i<urls.length;i++)dow2(urls[i].Url,urls[i].File,i,event);
    return event;
}
function dow2(url,file,i,event){
    fetch(url,{timeout:10000}).then(res=>{
        if(!res.ok)return;
        try{
            var b=res.body,length=res.headers.get('content-length'),now=0;
            b.on('data',d=>{
                now+=d.length;
                event.emit('location',parseInt(now/length*100),i,now,length);
            });
            b.on('end',()=>event.emit('end',i,length));
            b.on('error',error=>event.emit('error',error));
            for(var j=0;j<file.length;j++){
                var w=fs.createWriteStream(file[j]);
                w.on('error',error=>{
                    event.emit('error',error,j);
                });
                res.body.pipe(w);
            }
        }catch(e){
            event.emit('error',e);
        }
    });
}