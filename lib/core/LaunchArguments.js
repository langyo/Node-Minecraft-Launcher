module.exports=function(){
    this.Tokens=new Array();
    this.ToArguments=function(){
        var sb=new Array();
        if(this.AgentPath!=null&&this.AgentPath!=undefined&&this.AgentPath!='')sb.push('-javaagent:'+this.AgentPath);
        if(this.CGCEnabled)sb.push('-Xincgc');
        if(this.MinMemory>0)sb.push('-Xms'+this.MinMemory+'M');
        if(this.MaxMemory>0)sb.push('-Xmx'+this.MaxMemory+'M');else sb.push('-Xmx1024M');
        sb.push('-Xmn128m');
        sb.push('-XX:+UseG1GC');
        sb.push('-XX:+UseConcMarkSweepGC');
        sb.push('-XX:+CMSIncrementalMode');
        sb.push('-XX:-UseAdaptiveSizePolicy');
        sb.push('-XX:+UseFastAccessorMethod');
        sb.push('-XX:-OmitStackTraceInFastThrow')
        sb.push('-XX:+UnlockExperimentalVMOptions');
        sb.push('-Dfml.ignorePatchDiscrepancies=true');
        sb.push('-Dfml.ignoreInvalidMinecraftCertificates=true');
        sb.push('-XX:HeapDumpPath=MojangTricksIntelDriversForPerformance_javaw.exe_minecraft.exe.heapdump');
        for(var i=0;i<this.AdvencedArguments.length;i++)sb.push(this.AdvencedArguments[i]);
        sb.push('-Djava.library.path='+this.NativePath);
        sb.push('-cp');
        var o='';
        for(var i=0;i<this.Libraries.length;i++)o+=this.Libraries[i]+';';
        sb.push(o);
        sb.push(this.MainClass);
        for(i in this.MinecraftArguments){
            var v=this.MinecraftArguments[i];
            if(v.indexOf('--')==0){
                if(v=='--versionType'){
                    if(this.VersionType!=undefined){
                        delete this.MinecraftArguments[i];
                        if(i+1<=this.MinecraftArguments.length)delete this.MinecraftArguments[i+1];
                    }else if(i+1>this.MinecraftArguments.length)delete this.MinecraftArguments[i];
                }else sb.push(v);
            }else if(v.indexOf('${')==0){
                var f=this.Tokens[v.replace('${','').replace('}','')];
                if(f==undefined)delete sb[sb.length-1];else sb.push(f);
            }
        }
        if(this.VersionType!=undefined){
            sb.push('--versionType')
            sb.push(this.VersionType);
        }
        if(this.Server!=null&&this.Server!=undefined&&this.Server.Address!=null&&this.Server.Address!=undefined&&this.Server.Address!=''){
            sb.push('--server');
            sb.push(this.Server.Address);
            sb.push('--port');
            sb.push(this.Server.Port==0||this.Server.Port==undefined?'25565':this.Server.Port);
        }
        if(this.Size!=null&&this.Size!=undefined){
            if(this.Size.FullScreen)sb.push('--fullscreen');
            if(this.Size.Height!=null&&this.Size.Height!=undefined&&this.Size.Height>0){
                sb.push('--height');
                sb.push(this.Size.Height);
            }
            if(this.Size.Width!=null&&this.Size.Width!=undefined&&this.Size.Width>0){
                sb.push('--width');
                sb.push(this.Size.Width);
            }
        }
        return sb;
    }
}