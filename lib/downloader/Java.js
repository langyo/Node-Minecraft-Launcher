const Promise = require('bluebird'),
    st = require('../tools/SystemTools.js'),
    http = require('../tools/HttpRequester.js');

const getArgs = s => {
        var g = s.match(new RegExp('推荐 Version ([0-9]+) Update ([0-9]+)</h4>'));
        return 'jre1.' + g[1] + '.0_' + g[2];
    },
    getSubstr = (ret, strs, stre) => {
        var deps = ret.indexOf(strs) + strs.length;
        return ret.substr(deps, (stre ? ret.indexOf(stre, deps) : ret.length) - deps);
    };

module.exports = function*(p) {
    var t = st.GetSystemType(),
        d;
    if (t === 'osx') {
        d = yield http.Get('http://libs.x-speed.cc/JavaDownloadConfig.json');
        var j = JSON.parse(d);
        return Promise.resolve(http.Download([{
            Url: j.DownloadUrl,
            File: p
        }]), j);
    } else {
        d = yield http.Get('http://www.java.com/zh_CN/download/manual.jsp');
        return Promise.resolve(t === 'windows' ? http.Download([{
            Url: getSubstr(d, st.GetArch() === 64 ?
                '<a title="下载 Java 软件 Windows （64 位）" href="' : '<a title="下载 Java 软件 Windows 脱机" href="', '">'),
            File: p
        }]) : http.Download([{
            Url: getSubstr(d,
                st.GetArch() === 64 ? '<a title="下载 Java 软件 Linux" href="' : '<a title="下载 Java 软件 Linux x64" href="', '" '),
            File: p
        }]), getArgs(d));
    }
};