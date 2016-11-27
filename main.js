'use strict';
module.exports = {
    Tools: {
        System: require('./lib/tools/SystemTools.js'),
        HttpRequester: require('./lib/tools/HttpRequester.js')
    },
    LauncherCore: require('./lib/core/LauncherCore.js'),
    Authenticator: {
        Offline: require('./lib/authentication/OfflineAuthenticator.js'),
        Yggdrasil: require('./lib/authentication/Yggdrasil.js')
    },
    Downloader: {
        BMCLAPI: require('./lib/downloader/BMCLAPI.js'),
        LiteLoader: require('./lib/downloader/LiteLoader.js'),
        Java: require('./lib/downloader/Java.js')
    },
    Installer: {
        Forge: require('./lib/tools/Installer/Forge.js'),
        LiteLoader: require('./lib/tools/Installer/LiteLoader.js'),
        Java: require('./lib/tools/Installer/Java.js')
    }
};