const SystemTools=require('jsmccc').SystemTools;
console.log('JavaPath: ',SystemTools.FindJava());
console.log('SystemType: ',SystemTools.GetSystemType());
console.log('SystemArch: ',SystemTools.GetArch());