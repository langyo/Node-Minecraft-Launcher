const Downloader=require('jsmccc').Downloader.Mojang;
Downloader.GetVersionList(data=>{
    console.log('data: ',data);
}).on('error',error=>{
    console.error('error: ',error);
});
Downloader.DownloadCore('1.8.8','.minecraft/versions/1.8.8/').on('error',error=>{
    console.error('error: ',error);
}).on('location',(location,index,nowLength,length)=>{
    console.log(location,index,nowLength,length);
}).on('end',(index,length)=>{
    console.log(index,length);
});
Downloader.DownloadLibraries([],libraries=>{
    console.log('libraries: ',libraries);
}).on('error',error=>{
    console.error('error: ',error);
}).on('location',(location,index,nowLength,length)=>{
    console.log(location,index,nowLength,length);
}).on('end',(index,length)=>{
    console.log(index,length);
});
Downloader.GetAssetsIndex('1.8','.minecraft/assets/',assets=>{
    console.log('assets: ',assets);
    Downloader.DownloadAssets(assets,'.minecraft/libraries/',downloadAssets=>{
        console.log('downloadAssets: ',downloadAssets);
    }).on('error',error=>{
        console.error('error: ',error);
    }).on('location',(location,index,nowLength,length)=>{
        console.log(location,index,nowLength,length);
    }).on('end',(index,length)=>{
        console.log(index,length);
    });
}).on('error',error=>{
    console.error('error: ',error);
});