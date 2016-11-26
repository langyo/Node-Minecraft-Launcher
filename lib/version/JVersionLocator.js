const co = require('co'),
    fs = require('co-fs'),
    st = require('../tools/SystemTools.js'),
    systemName = st.GetSystemType(),
    arch = st.GetArch(),
    verExt = require('../version/ResolverExtensions.js');

var Promise = require('bluebird');

const ifAllowed = rules => {
    if (!rules || rules.length < 1) {
        return true;
    }
    var allowed = false;
    rules.forEach(rule => {
        if (!rule.os) {
            allowed = rule.action === 'allow';
            return;
        }
        if (rule.os.name === systemName) {
            allowed = rule.action === 'allow';
        }
    });
    return allowed;
};

module.exports = core => {
    return {
        Locate: function*(id) {
            if (this._AllVersions.has(id)) {
                return Promise.resolve(this._AllVersions.get(id));
            }
            var v = verExt(core),
                jver = JSON.parse(yield fs.readFile(v.GetVersionJsonPath(id)));
            if (!jver.id || !jver.minecraftArguments || !jver.mainClass || !jver.libraries) {
                return Promise.reject(new Error('JSON format is not correct'));
            }
            if (!jver.assets) {
                jver.assets = 'legacy';
            }
            var version = {
                JarId: jver.id,
                MinecraftArguments: jver.minecraftArguments,
                Assets: jver.assets,
                MainClass: jver.mainClass,
                Libraries: [],
                Natives: []
            };
            jver.libraries.forEach(lib => {
                if (!lib.name) {
                    return;
                }
                var names = lib.name.split(':');
                if (names.length !== 3) {
                    return;
                }
                if (!lib.natives) {
                    if (!ifAllowed(lib.rules)) {
                        return;
                    }
                    version.Libraries.push({
                        NS: names[0],
                        Name: names[1],
                        Version: names[2],
                        Url: lib.url
                    });
                } else {
                    if (!ifAllowed(lib.rules)) {
                        return;
                    }
                    version.Natives.push({
                        NS: names[0],
                        Name: names[1],
                        Version: names[2],
                        NativeSuffix: lib.natives[systemName].replace('${arch}', arch),
                        Options: lib.extract ? {
                            Exclude: lib.extract.exclude
                        } : null,
                        Url: lib.url
                    });
                }
            });
            if (jver.inheritsFrom) {
                var target = yield this.Locate(jver.inheritsFrom);
                if (!target) {
                    Promise.reject(new Error(`Missing version: ${jver.inheritsFrom}`));
                }
                if (version.Assets === 'legacy') {
                    version.Assets = null;
                }
                if (!version.Assets) {
                    version.Assets = target.Assets;
                }
                if (target.JarId) {
                    version.JarId = target.JarId;
                }
                if (!version.MainClass) {
                    version.MainClass = target.MainClass;
                }
                if (!version.MinecraftArguments) {
                    version.MinecraftArguments = target.MinecraftArguments;
                }
                version.Natives = version.Natives.concat(target.Natives);
                version.Libraries.concat(target.Libraries);
            }
            this._AllVersions.set(id, version);
            return Promise.resolve(version);
        },
        GetAllVersions: function*() {
            var path = `${core.GameRootPath}/versions/`;
            for (var ss of(yield fs.readdir(path))) {
                var dd = yield fs.stat(`${path}${ss}`);
                if (dd.isDirectory()) {
                    yield this.Locate(ss);
                }
            }
            return Promise.resolve(this._AllVersions);
        }
    };
};