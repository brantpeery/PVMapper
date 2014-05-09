var pvClient = {
    VERSION: '1.0.0.0', //pvMapper version: major.versionMinor.buildNumber.revisionNumber
    includeScriptFile: function (src) {
        document.write('<script type="text/javascript" src="' + src + '"></script>');
    }
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


if (typeof (pvIncludeAllScripts) == 'undefined' || pvIncludeAllScripts) {

    //Removed per Randy's suggestion that the Protected Areas service is superior
    //includeScriptFile(pvClient.basePath + "/pvMapper/TSMapper/solarmapperModule.js");
    //Removed SNL transmission line queries; replaced with OpenStreetMap transmission line queries
    //includeScriptFile(pvClient.basePath + "/pvMapper/TSMapper/snlModule.js");
    // Removed - The ESRI world topo map apparently no longer supports slope, aspect, and elevation (and a brief search found no suitible replacement) 
    //includeScriptFile(pvClient.basePath + "/pvMapper/TSMapper/DemModule.js");
    // Removed Wilderness module as the Land Management module will fulfill the same role and others during the Beta release & demos 
    //includeScriptFile(pvClient.basePath + "/pvMapper/TSMapper/WildernessModule.js");
    //Removed near module: speed issues are too invaisive for inclusion in demo; will replace once requests run in under 1000 ms
    //includeScriptFile(pvClient.basePath + "/pvMapper/TSMapper/CombinedNearModule.js");
    // Removed the nearest road module before I merge to release - it isn't presently working - will replace in dev branch afterward. 
    //includeScriptFile(pvClient.basePath + "/pvMapper/TSMapper/NearRoadModule.js");

    pvClient.includeScriptFile(pvClient.basePath + "/pvMapper/TSMapper/siteAreaModule.js");
    pvClient.includeScriptFile(pvClient.basePath + "/pvMapper/TSMapper/irradianceModule.js");
    pvClient.includeScriptFile(pvClient.basePath + "/pvMapper/TSMapper/LandUseModule.js");
    pvClient.includeScriptFile(pvClient.basePath + "/pvMapper/TSMapper/SubStationModule.js");
    pvClient.includeScriptFile(pvClient.basePath + "/pvMapper/TSMapper/WetlandsSocialModule.js");
    pvClient.includeScriptFile(pvClient.basePath + "/pvMapper/TSMapper/AgricultureSocialModule.js");
    pvClient.includeScriptFile(pvClient.basePath + "/pvMapper/TSMapper/SolarPlantSocialModule.js");
    pvClient.includeScriptFile(pvClient.basePath + "/pvMapper/TSMapper/WildlifeSocialModule.js");
    pvClient.includeScriptFile(pvClient.basePath + "/pvMapper/TSMapper/SoilModule.js");
    pvClient.includeScriptFile(pvClient.basePath + "/pvMapper/TSMapper/OSMSocialModule.js");
    pvClient.includeScriptFile(pvClient.basePath + "/pvMapper/TSMapper/riverDistance.js");
    pvClient.includeScriptFile(pvClient.basePath + "/pvMapper/TSMapper/NewSlopeModule.js");
   
} else if (typeof (pvIncludeMinimal) != 'undefined' && pvIncludeMinimal) {
    pvClient.includeScriptFile(pvClient.basePath + "/pvMapper/TSMapper/siteAreaModule.js");
    pvClient.includeScriptFile(pvClient.basePath + "/pvMapper/TSMapper/irradianceModule.js");
    pvClient.includeScriptFile(pvClient.basePath + "/pvMapper/TSMapper/LandUseModule.js");

}
// Returns an array of strings of modules url loaded by the ModuleManager.  
pvClient.getIncludeModules = function () {
    this.basePath = "/Scripts";
    var modules = [
        this.basePath + "/pvMapper/TSMapper/siteAreaModule.js",
        this.basePath + "/pvMapper/TSMapper/irradianceModule.js",
        this.basePath + "/pvMapper/TSMapper/LandUseModule.js",
        this.basePath + "/pvMapper/TSMapper/SubStationModule.js",
        this.basePath + "/pvMapper/TSMapper/WetlandsSocialModule.js",
        this.basePath + "/pvMapper/TSMapper/AgricultureSocialModule.js",
        this.basePath + "/pvMapper/TSMapper/SolarPlantSocialModule.js",
        this.basePath + "/pvMapper/TSMapper/WildlifeSocialModule.js",
        this.basePath + "/pvMapper/TSMapper/SoilModule.js",
        this.basePath + "/pvMapper/TSMapper/OSMSocialModule.js",
        this.basePath + "/pvMapper/TSMapper/riverDistance.js",
        this.basePath + "/pvMapper/TSMapper/NewSlopeModule.js"
    ]
    return modules;
}

