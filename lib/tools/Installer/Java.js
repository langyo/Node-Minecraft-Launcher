const st=require('../SystemTools.js'),path=require('path'),fs=require('fs'),tarGzip=require('node-targz'),require('child_process').exec;
module.exports=function(p,args,fun){
	if(!args)return false;
	switch(st.GetSystemType()){
		case'windows':
			var f=p+'.exe';
			fs.renameSync(p,f);
			exec('"'+f+'" /s',(err,stdout,stderr)=>{
				fs.renameSync(f,p);
				fun(!(err||stderr));
			});
			break;
		case'osx':
			tarGzip.decompress({
                source:p,
                destination:'/usr/java'
            },()=>{
            	if(st.FindJava())fun(true);else exec('export JAVA_HOME=/usr/java/'+require('path').format({dir:args.JVM.replace('${java}',args.DecompressDir),
            		base:'../../'}),(err,stdout,stderr)=>{if(err||stderr)fun(false);else exec('export PATH=$JAVA_HOME/bin:$PATH',(err1,stdout1,stderr1)=>
            			fun(!(err1||stderr1)));
            	});
            });
            break;
		case'linux':
			tarGzip.decompress({
                source:p,
                destination:'/usr/java'
            },()=>{
            	if(st.FindJava())fun(true);else exec('export JAVA_HOME=/usr/java/'+args,(err,stdout,stderr)=>{
            		if(err||stderr)fun(false);else exec('export PATH=$JAVA_HOME/bin:$PATH',(err1,stdout1,stderr1)=>fun(!(err1||stderr1)));
            	});
            });
            break;
	}
}