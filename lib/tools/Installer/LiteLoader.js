const fs = require('co-fs'),
    EventEmitter = require('events').EventEmitter,
    AdmZip = require('adm-zip'),
    Path = require('path');
module.exports = function*(file, path, mod, id, inheritsFrom) {
    const event = new EventEmitter();

    const make = function*(path) {
        try {
            if (!(yield fs.stat(path)).isDirectory()) {
                throw ('');
            }
        } catch (e) {
            yield fs.mkdir(path);
        }
        return Promise.resolve(true);
    };

    try {
        if (!(yield fs.stat(file)).isFile()) {
            throw ('This is not a file at all');
        }
        yield make(path);
        if (mod) {
            var zip = new AdmZip(file);
            zip.getEntries().forEach(zipEntry => {
                if (zipEntry.entryName.substr(0, 11) !== 'liteloader-' && zipEntry.entryName.substr(zipEntry.entryName.length - 4, 4) !== '.jar') {
                    return;
                }
                zip.extractEntryTo(zipEntry.entryName, path, false, true);
                event.emit('end');
            });
        } else {
            var json = JSON.parse(new AdmZip(file).readAsText('install_profile.json')),
                out = json.versionInfo;
            out.id = !id ? out.id : id;
            out.inheritsFrom = !inheritsFrom ? out.inheritsFrom : inheritsFrom;
            var p = Path.format({
                dir: Path.format({
                    dir: path,
                    base: out.inheritsFrom
                }),
                base: out.inheritsFrom + '.json'
            });
            if (!(yield fs.stat(p)).isFile()) {
                event.emit('error', 'The minecraft json(' + p + ') is not a file at all');
                return;
            }
            p = Path.format({
                dir: path,
                base: out.id
            });
            yield make(p);
            var w = fs.createWriteStream(Path.format({
                dir: p,
                base: out.id + '.json'
            }));
            w.on('error', error => event.emit('error', error)).on('finish', () => event.emit('end'));
            w.write(JSON.stringify(out));
            w.end();
        }
    } catch (e) {
        event.emit('error', e);
    }
    return event;
};