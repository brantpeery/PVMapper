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


if (typeof (pvIncludeAllScripts) == 'undefined' || pvIncludeAllScripts) {

    //Removed per Randy's suggestion that the Protected Areas service is superior
    //includeScriptFile(pvClient.basePath + "/ToolModules/solarmapperModule.js");
    //Removed SNL transmission line queries; replaced with OpenStreetMap transmission line queries
    //includeScriptFile(pvClient.basePath + "/ToolModules/snlModule.js");
    // Removed - The ESRI world topo map apparently no longer supports slope, aspect, and elevation (and a brief search found no suitible replacement) 
    //includeScriptFile(pvClient.basePath + "/ToolModules/DemModule.js");
    // Removed Wilderness module as the Land Management module will fulfill the same role and others during the Beta release & demos 
    //includeScriptFile(pvClient.basePath + "/ToolModules/WildernessModule.js");
    //Removed near module: speed issues are too invaisive for inclusion in demo; will replace once requests run in under 1000 ms
    //includeScriptFile(pvClient.basePath + "/ToolModules/CombinedNearModule.js");
    // Removed the nearest road module before I merge to release - it isn't presently working - will replace in dev branch afterward. 
    //includeScriptFile(pvClient.basePath + "/ToolModules/NearRoadModule.js");

    pvClient.includeScriptFile(pvClient.basePath + "/ToolModules/siteAreaModule.js");
    pvClient.includeScriptFile(pvClient.basePath + "/ToolModules/irradianceModule.js");
    pvClient.includeScriptFile(pvClient.basePath + "/ToolModules/LandUseModule.js");
    pvClient.includeScriptFile(pvClient.basePath + "/ToolModules/SubStationModule.js");
    pvClient.includeScriptFile(pvClient.basePath + "/ToolModules/WetlandsSocialModule.js");
    pvClient.includeScriptFile(pvClient.basePath + "/ToolModules/AgricultureSocialModule.js");
    pvClient.includeScriptFile(pvClient.basePath + "/ToolModules/SolarPlantSocialModule.js");
    pvClient.includeScriptFile(pvClient.basePath + "/ToolModules/WildlifeSocialModule.js");
    pvClient.includeScriptFile(pvClient.basePath + "/ToolModules/SoilModule.js");
    pvClient.includeScriptFile(pvClient.basePath + "/ToolModules/OSMSocialModule.js");
    pvClient.includeScriptFile(pvClient.basePath + "/ToolModules/riverDistance.js");
    pvClient.includeScriptFile(pvClient.basePath + "/ToolModules/NewSlopeModule.js");
   
} else if (typeof (pvIncludeMinimal) != 'undefined' && pvIncludeMinimal) {
    pvClient.includeScriptFile(pvClient.basePath + "/ToolModules/siteAreaModule.js");
    pvClient.includeScriptFile(pvClient.basePath + "/ToolModules/irradianceModule.js");
    pvClient.includeScriptFile(pvClient.basePath + "/ToolModules/LandUseModule.js");

}


