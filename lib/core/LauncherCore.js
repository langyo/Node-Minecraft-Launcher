const Promise = require('bluebird'),
    st = require('../tools/SystemTools.js'),
    jVersionLocator = require('../version/JVersionLocator.js'),
    path = require('path'),
    fs = require('co-fs'),
    LAI = require('./LauncherCoreInternal.js'),
    EventEmitter = require('events').EventEmitter,
    auth = require('../authentication/OfflineAuthenticator.js');

module.exports = function*(grp, jp) {
    grp = grp ? (grp.substr(grp.length > 0 ? grp.length - 1 : 0, 1) === path.sep ? grp.substr(0, grp.length - 1) : grp) : '.minecraft';
    if (!(yield fs.exists(grp))) {
        return Promise.reject(new Error('Root directory does not exist'));
    }
    if (!jp) {
        var a = yield st.FindJava();
        jp = a.length > 0 ? a[a.length - 1] : '';
    }
    if (!(yield fs.exists(jp))) {
        return Promise.reject(new Error('Java path is not correct'));
    }
    var config = {
        GameRootPath: grp,
        JavaPath: jp,
    };
    var loc = jVersionLocator(config);
    return Promise.resolve({
        _AllVersions: new Map(),
        GetVersions: loc.GetAllVersions,
        GetVersion: loc.Locate,
        Launch(opts, cb) {
            if (!opts || !opts.Version) {
                return Promise.reject(new Error('There is no need to fill in the need to start the version'));
            }
            if (!opts.Authenticator) {
                opts.Authenticator = auth('Steve');
            }
            if (!opts.VersionType) {
                opts.VersionType = `§eMinecraftLauncher`;
            }
            var event = new EventEmitter();
            if (cb) {
                cb(event);
            }
            return LAI(config, opts, event);
        }
    });
};