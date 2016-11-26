const log = msg => {
    console.log('\u001b[33m[minecraft-launcher]\u001b[36m %s\u001b[0m', msg);
};
const s = require('./lib/tools/SystemTools.js');
log('当前系统: ' + s.GetSystemType());
log('当前系统位数: ' + s.GetArch());
try{
   if(!require('./main.js')){
    throw('');
   }
   console.log('\u001b[33m[minecraft-launcher]\u001b[32m %s\u001b[0m', '已安装成功！');
}catch(e){
    console.log('\u001b[33m[minecraft-launcher]\u001b[31m %s\u001b[0m', '安装失败！');
}