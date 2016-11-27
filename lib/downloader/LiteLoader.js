const path = require('path');
module.exports = {
    _http : require('../tools/HttpRequester.js'),
    GetVersionList: function*() {
        return (yield this._http.Get('http://dl.liteloader.com/versions/versions.json')).json();
    },
    Download(stream, version, p) {
        return this._http.Download([{
            Url: stream ? `http://jenkins.liteloader.com/job/LiteLoaderInstaller%20${version}/lastSuccessfulBuild/artifact/build/libs/liteloader-installer-${version}-00-SNAPSHOT.jar` : `http://dl.liteloader.com/redist/${version}/liteloader-installer-${version}-00.jar`,
            File: path.format({
                dir: p,
                base: 'Installer.jar'
            })
        }]);
    }
};