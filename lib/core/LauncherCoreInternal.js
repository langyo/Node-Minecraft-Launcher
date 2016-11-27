const fs = require('co-fs'),
    AdmZip = require('adm-zip'),
    verExt = require('../version/ResolverExtensions.js'),
    arg = require('./LaunchArguments.js'),
    spawn = require('child_process').spawn;

const isHas = (obj, opt) => {
        if (!opt.Exclude) {
            return false;
        }
        opt.Exclude.forEach(ex => {
            if (new RegExp(`^${obj}`).test(ex)) {
                return true;
            }
        });
        return false;
    },
    unzipFile = (file, path, opt) => {
        var zip = new AdmZip(file);
        zip.getEntries().forEach(zipEntry => {
            try {
                if (!zipEntry.isDirectory && !isHas(zipEntry.entryName, opt)) {
                    zip.extractEntryTo(zipEntry.entryName, path);
                }
            } catch (e) {}
        });
    };

module.exports = function*(core, options, event) {
        var args = arg(),
            item = verExt(core);
        event.emit('logging');
        var auth = yield options.Authenticator.Do();
        var missLibrary = [];
        args.CGCEnabled = options.CGCEnabled === undefined ? true : options.CGCEnabled;
        args.VersionType = options.VersionType;
        args.MainClass = options.Version.MainClass;
        args.MaxMemory = options.MaxMemory;
        args.AgentPath = options.AgentPath;
        args.MinMemory = options.MinMemory;
        args.Libraries = [];
        for (var lib of options.Version.Libraries) {
            var l = item.GetLibPath(lib);
            if (yield fs.exists(l)) {
                args.Libraries.push(l);
            } else {
                var name = item.GetLibName(lib);
                missLibrary.push(lib.Url ? {
                    Name: name,
                    Url: lib.Url
                } : name);
            }
        }
        args.NativePath = `${core.GameRootPath}${options.Version.JarId?`/versions/${options.Version.JarId}`:''}/natives/`;
        if (!(yield fs.exists(args.NativePath))) {
            yield fs.mkdir(args.NativePath);
        }
        event.emit('unpacking');
        for (var n of options.Version.Natives) {
            var name1 = item.GetNativePath(n);
            if (yield fs.exists(name1)) {
                unzipFile(name1, args.NativePath, n.Options);
            } else {
                name1 = item.GetNativeName(n);
                if (!n.Url) {
                    missLibrary.push(name1);
                } else {
                    missLibrary.push({
                        Name: name1,
                        Url: n.Url
                    });
                }
            }
        }
        if (missLibrary.length > 0) {
            event.emit('miss', missLibrary);
            return Promise.reject(new Error('Lack of support library'));
        }
        args.Server = options.Server;
        args.Size = options.Size;
        if (options.Version.JarId) {
            args.Libraries.push(item.GetVersionJarPath(options.Version.JarId));
        }
        args.MinecraftArguments = options.Version.MinecraftArguments.split(' ');
        var AssetsPath;
        if (options.Version.Assets === 'legacy') {
            AssetsPath = `${core.GameRootPath}/assets/virtual/legacy`;
        } else {
            AssetsPath = `${core.GameRootPath}/assets`;
        }
        args.Tokens = {
            'auth_access_token': auth.AccessToken,
            'auth_session': auth.AccessToken,
            'auth_player_name': auth.DisplayName,
            'version_name': options.Version.JarId,
            'game_directory': `${core.GameRootPath}${options.Version.JarId?`/versions/${options.Version.JarId}`:''}`,
            'game_assets':AssetsPath,
            'assets_root':AssetsPath,
            'assets_index_name':options.Version.Assets,
            'auth_uuid':auth.UUID,
            'user_properties':auth.Properties,
            'user_type':auth.UserType
        };
        if(!options.AdvencedArguments)options.AdvencedArguments=[];
        args.AdvencedArguments=options.AdvencedArguments;
        event.emit('starting');
        var child = spawn(core.JavaPath, args.ToArguments(), {
            cwd: core.GameRootPath
        });
        var launched = function() {
            clearTimeout(time);
        },
        time = setTimeout(() => {
            child.removeListener('exit', launched);
            event.emit('started');
        }, 13000);
        child.on('error', d => event.emit('start_error', d.toString())).once('exit', d => event.emit('exit', d.toString())).once('exit', launched);
        child.stdout.on('data', d => event.emit('log_data', d.toString()));
        child.stderr.on('error', d => event.emit('log_error', d.toString()));
        return Promise.resolve(child);
};