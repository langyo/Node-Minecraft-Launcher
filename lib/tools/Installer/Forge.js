'use strict';
const fs = require('fs'),
    EventEmitter = require('events').EventEmitter,
    AdmZip = require('adm-zip'),
    Path = require('path');
module.exports = (file, path, id, inheritsFrom) => {
    const event = new EventEmitter();
    const make = path => {
        try {
            if (!fs.statSync(path).isDirectory()) {
                fs.mkdirSync(path);
            }
        } catch (e) {
            fs.mkdirSync(path);
        }
    };

    try {
        if (!fs.statSync(file).isFile()) {
            throw ('This is not a file at all');
        }
        make(path);
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
        if (!fs.statSync(p).isFile()) {
            event.emit('error', 'The minecraft json(' + p + ') is not a file at all');
            return;
        }
        p = Path.format({
            dir: path,
            base: out.id
        });
        make(p);
        for (var i = 0; i < out.libraries.length; i++) {
            if (!out.libraries[i].clientreq) {
                out.libraries.splice(i--, 1);
                continue;
            }
            delete out.libraries[i].serverreq;
            delete out.libraries[i].clientreq;
            delete out.libraries[i].checksums;
        }
        var w = fs.createWriteStream(Path.format({
            dir: p,
            base: out.id + '.json'
        }));
        w.on('error', error => event.emit('error', error));
        w.on('finish', () => event.emit('end'));
        w.write(JSON.stringify(out));
        w.end();
    } catch (e) {
        event.emit('error', e);
    }
    return event;
};