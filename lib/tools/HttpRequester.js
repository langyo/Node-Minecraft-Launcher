'use strict';
const fetch=require('node-fetch'),fs=require('fs'),EventEmitter=require('events').EventEmitter,path=require('path');
module.exports={
    Download(urls){
        const event=new EventEmitter();
        var i=urls.length-1;
        event.on('end',()=>{
            i--;
            dow(urls[i].Url,urls[i].File,i,event);
        }).on('error',()=>{
            i--;
            dow(urls[i].Url,urls[i].File,i,event);
        });
        dow(urls[i].Url,urls[i].File,i,event);
        return event;
    },
    Get(url,data,headers){
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
    },
    Download2(urls){
        const event=new EventEmitter();
        var i=urls.length-1;
        event.on('end',()=>{
            i--;
            dow2(urls[i].Url,urls[i].File,i,event);
        }).on('error',()=>{
            i--;
            dow2(urls[i].Url,urls[i].File,i,event);
        });
        dow2(urls[i].Url,urls[i].File,i,event);
        return event;
    }
}
function dow(url,file,i,event){
    var p=path.dirname(file);
    mkdirsSync(p);
    fetch(url,{timeout:10000}).then(res=>{
        console.log(res.ok)
        if(!res.ok){
            b.on('error',error=>event.emit('error','http error'));
            return;
        }
        try{
            var w=fs.createWriteStream(file);
            w.on('error',error=>event.emit('error',error));
            var b=res.body,length=res.headers.get('content-length'),now=0;
            b.on('data',d=>{
                now+=d.length;
                event.emit('location',parseInt(now/length*100),i,now,length);
            }).on('end',()=>{
                w.end();
                event.emit('end',i,length);
            }).on('error',error=>event.emit('error',i,error));
            res.body.pipe(w);
        }catch(e){
            event.emit('error',e);
        }
    });
}
function dow2(url,file,i,event){
    fetch(url,{timeout:10000}).then(res=>{
        if(!res.ok){
            b.on('error',error=>event.emit('error','http error'));
            return;
        }
        try{
            var b=res.body,length=res.headers.get('content-length'),now=0;
            b.on('data',d=>{
                now+=d.length;
                event.emit('location',parseInt(now/length*100),i,now,length);
            }).on('end',()=>event.emit('end',i,length)).on('error',error=>event.emit('error',error));
            for(var j=0;j<file.length;j++){
                var p=path.dirname(file[j]);
                mkdirsSync(p);
                var w=fs.createWriteStream(file[j]);
                b.on('end',()=>w.end());
                w.on('error',error=>{
                    event.emit('error',i,error,j);
                });
                res.body.pipe(w);
            }
        }catch(e){
            event.emit('error',e);
        }
    });
}
function mkdirsSync(dirpath,mode){
    if (!fs.existsSync(dirpath)){
        var pathtmp;
        dirpath.split('/').forEach(dirname=>{
            if(pathtmp)pathtmp=path.join(pathtmp,dirname);else pathtmp=dirname;
            if (!fs.existsSync(pathtmp)&&!fs.mkdirSync(pathtmp,mode))return false;
        });
    }
    return true;
}