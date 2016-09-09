'use strict';
const fs=require('fs'),st=require('../tools/SystemTools.js'),systemName=st.GetSystemType(),arch=st.GetArch(),Ver=require('../version/LauncherCoreItemResolverExtensions.js');
module.exports={
    create(core){
        return{
            Locate(id){
                var v=Ver.get(core),jver=this.LoadVersion(v.GetVersionJsonPath(id));
                if(!jver.id||!jver.minecraftArguments||!jver.mainClass||!jver.libraries)return false;
                if(!jver.assets)jver.assets='legacy';
                var version={
                    JarId:jver.id,
                    MinecraftArguments:jver.minecraftArguments,
                    Assets:jver.assets,
                    MainClass:jver.mainClass,
                    Libraries:[],
                    Natives:[]
                }
                jver.libraries.forEach(lib=>{
                    if(!lib.name)return;
                    var names=lib.name.split(':');
                    if(names.length!=3)return;
                    if(!lib.natives){
                        if(!this.IfAllowed(lib.rules))return;
                        version.Libraries.push({
                            NS:names[0],
                            Name:names[1],
                            Version:names[2],
                            Url:lib.url
                        });
                    }else{
                        if(!this.IfAllowed(lib.rules))return;
                        version.Natives.push({
                            NS:names[0],
                            Name:names[1],
                            Version:names[2],
                            NativeSuffix:lib.natives[systemName].replace('${arch}',arch),
                            Options:lib.extract?{Exclude:lib.extract.exclude}:null,
                            Url:lib.url
                        });
                    }
                });
                if(jver.inheritsFrom){
                    var target=this.Locate(jver.inheritsFrom);
                    if(!target)return false;
                    if(version.Assets==='legacy')version.Assets=null;
                    if(!version.Assets)version.Assets=target.Assets;
                    if(target.JarId)version.JarId=target.JarId;
                    if(!version.MainClass)version.MainClass=target.MainClass;
                    if(!version.MinecraftArguments)version.MinecraftArguments=target.MinecraftArguments;
                    addAll(version.Natives,target.Natives);
                    addAll(version.Libraries,target.Libraries);
                }
                return version;
            },
            LoadVersion(jsonPath){
                return JSON.parse(fs.readFileSync(jsonPath));  
            },
            GetAllVersions(){
                var path=`${core.GameRootPath}/versions/`,arr=fs.readdirSync(path),re=[];
                if(!arr)return false;
                arr.forEach(ss=>{
                    if(fs.statSync(`${path}${ss}`).isDirectory())re.push(this.Locate(ss));
                });
                if(re.length==0)return false;else return re;
            },
            IfAllowed(rules){
                if(!rules||rules.length==0)return true;
                var allowed=false;
                rules.forEach(rule=>{
                    if(!rule.os){
                        allowed=rule.action=='allow';
                        return;
                    }
                    if(rule.os.name==systemName)allowed=rule.action=='allow';
                });
                return allowed;
            }
        }
    }
}
function addAll(arr1,arr2){
    if(!arr1||(typeof arr1)!='object'||!arr2||(typeof arr2)!='object')return;
    arr2.forEach(obj=>arr1.push(obj));
}