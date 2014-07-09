var pvClient = {
    VERSION: '1.0.0.0', //pvMapper version: major.versionMinor.buildNumber.revisionNumber
    includeScriptFile: function (src) {
        document.write('<script type="text/javascript" src="' + src + '"></script>');
    },
    moduleChanged: false
};

pvClient.prototype = Object;

if (typeof (pvBasePath) != 'undefined' && pvBasePath.length > 0) {
    if (pvBasePath.substring(pvBasePath - 1) == '/') {
        pvBasePath = pvBasePath.substring(0, pvBasePath.length - 1);
    }
    pvClient.basePath = pvBasePath;
}
else {
    pvClient.basePath = '/Scripts';
}

