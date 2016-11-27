const exec = require('co-exec'),
    os = require('os'),
    Path = require('path');

module.exports = {
    GetSystemType() {
        switch (os.platform()) {
            case 'win32':
                return 'windows';
            case 'darwin':
                return 'osx';
            default:
                return 'linux';
        }
    },
    FindJava: function*() {
        var re;
        switch (module.exports.GetSystemType()) {
            case 'windows':
                re = yield module.exports.FindJavaInternal('Wow6432Node\\');
                if (re) {
                    return Promise.resolve(re);
                }
                re = yield module.exports.FindJavaInternal();
                if (!re) {
                    return Promise.reject(new Error('Can not find Java'));
                } else {
                    return Promise.resolve(re);
                }
                break;
            case 'linux':
            case 'osx':
                re = Path.join(yield exec('echo $JAVA_HOME'), 'bin/java');
                if (re) {
                    return Promise.resolve([re]);
                } else {
                    return Promise.reject(new Error('Can not find Java'));
                }
        }
    },
    GetArch() {
        return process.config.variables.host_arch === 'x64' ? 64 : 32;
    },
    GetNodeArch() {
        return process.arch === 'x64' ? 64 : 32;
    },
    FindJavaInternal:function*(key) {
        var re = yield exec(`REG QUERY "HKEY_LOCAL_MACHINE\\SOFTWARE\\${key||''}JavaSoft\\Java Runtime Environment"`);
        if (!re) {
            return Promise.reject(new Error('Can not find Java'));
        }
        var d = re.split('\r\n\r\n');
        if (d.length !== 2) {
            return Promise.reject(new Error('Can not find Java'));
        }
        var array = [];
        for (var q of d[1].split('\r\n')) {
            if (q) {
                var u = yield exec(`REG QUERY "${q}" /v JavaHome`);
                if (!u) {
                    continue;
                }
                u = u.split('    ');
                if (u.length === 4) {
                    array.push(u[3].replace('\r\n\r\n', '') + '\\bin\\javaw.exe');
                }
            }
        }
        return Promise.resolve(array);
    }
};