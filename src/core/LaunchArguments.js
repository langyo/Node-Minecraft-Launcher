module.exports=function(){
    this.Tokens=new Array();
    this.ToArguments=function(){
        var StringBuilder=require('../tools/StringBuilder.js');
        var sb=new StringBuilder();
        if(this.AgentPath!=null&&this.AgentPath!=undefined&&this.AgentPath!='')sb.append('-javaagent:"').append(this.AgentPath+'" ');
        if(this.CGCEnabled)sb.append('-Xincgc ');
        sb.append('-XX:+UseConcMarkSweepGC -XX:+CMSIncrementalMode -XX:-UseAdaptiveSizePolicy ');
        if(this.MinMemory>0)sb.append(' -Xms').append(this.MinMemory).append('M ');
        if(this.MaxMemory>0)sb.append(' -Xmx').append(this.MaxMemory).append('M ');else sb.append('-Xmx1024M ');
        for(var i=0;i<this.AdvencedArguments.length;i++)sb.append(this.AdvencedArguments[i]);
        sb.append(' -Djava.library.path=').append(this.NativePath).append(' -cp ');
        for(var i=0;i<this.Libraries.length;i++)sb.append(this.Libraries[i]).append(';');
        var o=this.MinecraftArguments;
        for(var i=0;i<this.Tokens.length;i++)o=o.replace('${'+this.Tokens[i][0]+'}',this.Tokens[i][1]);
        sb.append(this.Version.JarUrl).append(' ').append(this.MainClass).append(' ').append(o);
        if(this.Server!=null&&this.Server!=undefined&&this.Server.Address!=null&&this.Server.Address!=undefined&&this.Server.Address!=''){
            sb.append(' --server ' + this.Server.Address);
        if(this.Server.Port==0||this.Server.Port==undefined)sb.append(' --port 25565');else sb.append(' --port ' + this.Server.Port);
        }
        if(this.Size!=null&&this.Size!=undefined){
            if(this.Size.FullScreen)sb.append(' --fullscreen');
            if(this.Size.Height!=null&&this.Size.Height!=undefined&&this.Size.Height>0)sb.append(' --height '+this.Size.Height);
            if(this.Size.Width!=null&&this.Size.Width!=undefined&&this.Size.Width>0)sb.append(' --width '+this.Size.Width);
        }
        return sb.toString().split(' ');
    }
}