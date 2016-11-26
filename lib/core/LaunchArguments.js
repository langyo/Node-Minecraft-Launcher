'use strict';
module.exports = () => {
    return {
        ToArguments() {
            var sb = [];
            if (this.AgentPath) {
                sb.push(`-javaagent:${this.AgentPath}`);
            }
            if (this.CGCEnabled) {
                sb.push('-Xincgc');
            }
            if (this.MinMemory > 0) {
                sb.push(`-Xms${this.MinMemory}M`);
            }
            if (this.MaxMemory > 0) {
                sb.push(`-Xmx${this.MaxMemory}M`);
            } else {
                sb.push('-Xmx1024M');
            }
            sb.push('-Xmn128m');
            sb = sb.concat(this.AdvencedArguments);
            sb.push('-XX:+UseConcMarkSweepGC');
            sb.push('-XX:+CMSIncrementalMode');
            sb.push('-XX:-UseAdaptiveSizePolicy');
            sb.push('-XX:-OmitStackTraceInFastThrow');
            sb.push('-XX:+UnlockExperimentalVMOptions');
            sb.push('-Dfml.ignorePatchDiscrepancies=true');
            sb.push('-Dfml.ignoreInvalidMinecraftCertificates=true');
            sb.push('-XX:HeapDumpPath=MojangTricksIntelDriversForPerformance_javaw.exe_minecraft.exe.heapdump');
            sb.push(`-Djava.library.path=${this.NativePath}`);
            sb.push('-cp');
            sb.push(this.Libraries.join(';'));
            sb.push(this.MainClass);
            for (var i in this.MinecraftArguments) {
                var v = this.MinecraftArguments[i];
                if (v.indexOf('--') === 0) {
                    if (v === '--versionType') {
                        if (this.VersionType) {
                            delete this.MinecraftArguments[i];
                            if (i + 1 <= this.MinecraftArguments.length) {
                                delete this.MinecraftArguments[i + 1];
                            }
                        } else if (i + 1 > this.MinecraftArguments.length) {
                            delete this.MinecraftArguments[i];
                        }
                    } else {
                        sb.push(v);
                    }
                } else if (v.indexOf('${') === 0) {
                    var f = this.Tokens[v.replace('${', '').replace('}', '')];
                    if (!f) {
                        delete sb[sb.length - 1];
                    } else {
                        sb.push(f);
                    }
                }
            }
            if (this.VersionType) {
                sb.push('--versionType');
                sb.push(this.VersionType);
            }
            if (this.Server && this.Server.Address) {
                sb.push('--server');
                sb.push(this.Server.Address);
                sb.push('--port');
                sb.push(!this.Server.Port || this.Server.Port <= 0 ? '25565' : this.Server.Port.toString());
            }
            if (this.Size) {
                if (this.Size.FullScreen) {
                    sb.push('--fullscreen');
                }
                if (this.Size.Height && this.Size.Height > 0) {
                    sb.push('--height');
                    sb.push(this.Size.Height.toString());
                }
                if (this.Size.Width && this.Size.Width > 0) {
                    sb.push('--width');
                    sb.push(this.Size.Width.toString());
                }
            }
            return sb;
        }
    };
};