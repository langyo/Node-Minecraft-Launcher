const st = require('../SystemTools.js'),
    fs = require('co-fs'),
    tarGzip = require('node-targz'),
    exec = require('co-exec'),
    path = require('path');

module.exports = function*(p, args) {
    if (!args) {
        return Promise.reject(new Error('No parameters have been completed'));
    }
    switch (st.GetSystemType()) {
        case 'windows':
            var f = p + '.exe';
            yield fs.rename(p, f);
            yield exec('"' + f + '" /s');
            yield fs.rename(f, p);
            break;
        case 'osx':
            yield new Promise(ps => {
                tarGzip.decompress({
                    source: p,
                    destination: '/usr/java'
                }, () => ps());
            });
            yield exec('export JAVA_HOME=/usr/java/' + path.format({
                dir: args.JVM.replace('${java}', args.DecompressDir),
                base: '../../'
            }));
            yield exec('export PATH=$JAVA_HOME/bin:$PATH');
            break;
        case 'linux':
            yield new Promise(ps => {
                tarGzip.decompress({
                    source: p,
                    destination: '/usr/java'
                }, () => ps());
            });
            yield exec(`export JAVA_HOME=/usr/java/${args}`);
            yield exec('export PATH=$JAVA_HOME/bin:$PATH');
            break;
    }
    return Promise.resolve((yield st.FindJava()).length > 0);
};