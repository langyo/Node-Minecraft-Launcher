'use strict';
module.exports = core => {
	return {
		GetVersionRootPath(version) {
			return (typeof version) === 'string' ? `${core.GameRootPath}/versions/${version}` : this.GetVersionRootPath(version.Id);
		},
		GetVersionJarPath(version) {
			return (typeof version) === 'string' ? `${core.GameRootPath}/versions/${version}/${version}.jar` : this.GetVersionJarPath(version.Id);
		},
		GetVersionJsonPath(version) {
			return (typeof version) === 'string' ? `${core.GameRootPath}/versions/${version}/${version}.json` : this.GetVersionJsonPath(version.Id);
		},
		GetLibPath(lib) {
			return `${core.GameRootPath}/libraries/${this.GetLibName(lib)}`;
		},
		GetLibName(lib) {
			return `${lib.NS.replace(/\./g,'/')}/${lib.Name}/${lib.Version}/${lib.Name}-${lib.Version}.jar`;
		},
		GetNativePath(lib) {
			return `${core.GameRootPath}/libraries/${this.GetNativeName(lib)}`;
		},
		GetNativeName(lib) {
			return `${lib.NS.replace(/\./g,'/')}/${lib.Name}/${lib.Version}/${lib.Name}-${lib.Version}-${lib.NativeSuffix}.jar`;
		}
	};
};