'use strict';
const fetch = require('node-fetch'),
    fs = require('fs'),
    EventEmitter = require('events').EventEmitter,
    path = require('path');

const mkdirsSync = (dirpath, mode) => {
        if (!fs.existsSync(dirpath)) {
            var pathtmp;
            dirpath.split('/').forEach(dirname => {
                if (pathtmp) {
                    pathtmp = path.join(pathtmp, dirname);
                } else {
                    pathtmp = dirname;
                }
                if (!fs.existsSync(pathtmp) && !fs.mkdirSync(pathtmp, mode)) {
                    return false;
                }
            });
        }
        return true;
    },
    dow = (url, file, i, event) => {
        var p = path.dirname(file);
        mkdirsSync(p);
        fetch(url, {
            timeout: 10000
        }).then(res => {
            var b = res.body;
            if (!res.ok) {
                b.on('error', error => event.emit('error', 'http error'));
                return;
            }
            try {
                var w = fs.createWriteStream(file);
                w.on('error', error => event.emit('error', error));
                var length = res.headers.get('content-length'),
                    now = 0;
                b.on('data', d => {
                    now += d.length;
                    event.emit('location', parseInt(now / length * 100), i, now, length);
                }).on('end', () => {
                    w.end();
                    event.emit('end', i, length);
                }).on('error', error => event.emit('error', i, error));
                res.body.pipe(w);
            } catch (e) {
                event.emit('error', e);
            }
        });
    },
    dow2 = (url, file, i, event) => {
        fetch(url, {
            timeout: 10000
        }).then(res => {
            var b = res.body;
            if (!res.ok) {
                b.on('error', error => event.emit('error', 'http error'));
                return;
            }
            try {
                var length = res.headers.get('content-length'),
                    now = 0;
                b.on('data', d => {
                    now += d.length;
                    event.emit('location', parseInt(now / length * 100), i, now, length);
                }).on('end', () => event.emit('end', i, length)).on('error', error => event.emit('error', error));
                for (var j = 0; j < file.length; j++) {
                    var p = path.dirname(file[j]);
                    mkdirsSync(p);
                    var w = fs.createWriteStream(file[j]);
                    b.on('end', () => w.end());
                    w.on('error', error => {
                        event.emit('error', i, error, j);
                    });
                    res.body.pipe(w);
                }
            } catch (e) {
                event.emit('error', e);
            }
        });
    }

module.exports = {
    Download(urls) {
        const event = new EventEmitter();
        var i = urls.length - 1;
        event.on('end', () => {
            i--;
            dow(urls[i].Url, urls[i].File, i, event);
        }).on('error', () => {
            i--;
            dow(urls[i].Url, urls[i].File, i, event);
        });
        dow(urls[i].Url, urls[i].File, i, event);
        return event;
    },
    Get(url, data, headers) {
        return fetch(url, {
            timeout: 10000,
            method: !data ? 'GET' : 'POST',
            body: !data ? undefined : data,
            headers: !headers ? undefined : headers
        }).then(res => res.text());
    },
    Download2(urls) {
        const event = new EventEmitter();
        var i = urls.length - 1;
        event.on('end', () => {
            i--;
            dow2(urls[i].Url, urls[i].File, i, event);
        }).on('error', () => {
            i--;
            dow2(urls[i].Url, urls[i].File, i, event);
        });
        dow2(urls[i].Url, urls[i].File, i, event);
        return event;
    }
};