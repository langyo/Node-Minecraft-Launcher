const pr=require('child_process'),fs=require('fs');
log('正在为您构建！');
if(pr.execSync('nw-gyp').toString().indexOf('Usage: ')==-1){
    var re=pr.execSync('cnpm').toString().indexOf('Usage: ')==-1,cmd=re?'npm':'cnpm';
    log(re?'检测到您没有使用cnpm，即将使用npm进行构建！':'检测到您使用了cnpm，即将使用cnpm进行构建！');
    log('正在下载 nw-gyp 模块……');
    if(pr.execSync(cmd+' install -g nw-gyp').toString().indexOf('ERR! ')!=-1){
        err('模块 nw-gyp 下载失败！');
        return false;
    }
    ok('nw-gyp 模块下载完成！');
}
log('正在复制文件……');
var f='./lib/node_modules/simplesync/node_modules/fibers/build-nw.js';
var r=fs.createWriteStream(f);
fs.createReadStream('./lib/node_modules/simplesync/node_modules/fibers/build.js').on('data',d=>r.write(d.toString().replace(/node-gyp/g,'nw-gyp'))).on('error',e=>err('模块 fibers 复制文件时发生错误: '+e)).on('end',()=>{
    r.end();
    log('正在构建 fibers 模块……');
    if(pr.execSync('node "'+f+'" --runtime=node-webkit --target=0.13.0').toString().indexOf('ERR! ')!=-1){
        err('模块 nw-gyp 构建失败！');
        return false;
    }
    ok('已构建完成！');
    return true;
});
function log(msg){
    console.log('\u001b[33m[minecraft-launcher]\u001b[36m %s\u001b[0m',msg);
}
function err(msg){
    console.log('\u001b[33m[minecraft-launcher]\u001b[31m %s\u001b[0m',msg);
}
function ok(msg){
    console.log('\u001b[33m[minecraft-launcher]\u001b[32m %s\u001b[0m',msg);
}