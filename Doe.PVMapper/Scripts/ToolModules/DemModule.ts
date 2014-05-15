/// <reference path="../pvmapper/tsmapper/starratinghelper.ts" />
/// <reference path="../pvmapper/tsmapper/pvmapper.ts" />
/// <reference path="../pvmapper/tsmapper/site.ts" />
/// <reference path="../pvmapper/tsmapper/score.ts" />
/// <reference path="../pvmapper/tsmapper/tools.ts" />
/// <reference path="../pvmapper/tsmapper/options.d.ts" />
/// <reference path="../pvmapper/tsmapper/module.ts" />
/// <reference path="../pvmapper/tsmapper/scoreutility.ts" />
/// <reference path="/../../EsriGeoJSON.js>
/// <reference path="../pvmapper/tsmapper/modulemanager.ts" />

module BYUModules {

    export class DemSlopeModule {
        constructor() {
            var myModule: pvMapper.Module = new pvMapper.Module(<pvMapper.IModuleOptions>{
                id: "DemSlopeModule",
                author: "Darian Ramage, BYU",
                version: "0.1.ts",

                activate: () => { addMap(); },
                deactivate: () => { removeMap(); },
                destroy: null,
                init: null,

                scoringTools: [
                    <pvMapper.IScoreToolOptions> {
                        activate: null,
                        deactivate: null,
                        destroy: null,
                        init: null,

                        title: DemSlopeModule.title, //"Slope",
                        category: DemSlopeModule.category, //"Geography",
                        description: DemSlopeModule.description, //"The slope at the center of a site, using data from ArcGIS Online",
                        longDescription: DemSlopeModule.longDescription, //'<p>This tool reports the slope at the center point of a site. The slope is retrieved from the World Topographic Map on ArcGIS Online. Note that the slope at the center point of a site may not be representative of the overall slope at that site. See ArcGIS Online for more information (www.arcgis.com).</p>',
                        onScoreAdded: (event, score) => { },
                        onSiteChange: (event, score: pvMapper.Score) => { updateScore(score, "any:3", "degrees"); },
                        //TODO: is this degrees? or maybe it's grade?

                        //TODO: The utility of slope only makes sense in the context of aspect - merge these two metrics
                        // for now, flatter is better...?
                        scoreUtilityOptions: {
                            functionName: "linear",
                            functionArgs: new pvMapper.MinMaxUtilityArgs(10, 0, "degrees", "Slope Degrees", "Score", "Preference of area with average slope")
                        }
                    }],
                infoTools: null
            });
            this.getModuleObj = function () { return myModule; }
        }
        getModuleObj: () => pvMapper.Module;
        //Add these so ModuleManager can access the tool information for display in the Tool/Module Selector and make it easier to register onto the moduleManager.
        public static title: string = "Slope";
        public static category: string = "Geography";
        public static description: string = "The slope at the center of a site, using data from ArcGIS Online";
        public static longDescription: string = '<p>This tool reports the slope at the center point of a site. The slope is retrieved from the World Topographic Map on ArcGIS Online. Note that the slope at the center point of a site may not be representative of the overall slope at that site. See ArcGIS Online for more information (www.arcgis.com).</p>';
    }

    export class DemAspectModule {
        constructor() {
            var myModule: pvMapper.Module = new pvMapper.Module(<pvMapper.IModuleOptions>{
                id: "DemAspectModule",
                author: "Darian Ramage, BYU",
                version: "0.1.ts",

                activate: () => { addMap(); },
                deactivate: () => { removeMap(); },
                destroy: null,
                init: null,

                scoringTools: [
                    <pvMapper.IScoreToolOptions> {
                        activate: null,
                        deactivate: null,
                        destroy: null,
                        init: null,

                        title: DemAspectModule.title, //"Aspect",
                        category: DemAspectModule.category, //"Geography",
                        description: DemAspectModule.description, //"The horizontal aspect at the center of a site, using data from ArcGIS Online",
                        longDescription: DemAspectModule.longDescription, //'<p>This tool reports the aspect at the center point of a site, an angular measure where 0 degrees indicates a northerly aspect and 90 degrees indicates an easterly aspect. This measure is retrieved from the World Topographic Map on ArcGIS Online. Note that the aspect at the center point of a site may not be representative of the overall aspect of a site. Note also that aspect is integrally related to slope. See ArcGIS Online for more information (www.arcgis.com).</p>',
                        onScoreAdded: (event, score) => { },
                        onSiteChange: (event, score: pvMapper.Score) => { updateScore(score, "any:4", "degrees"); },
                        //TODO: is this degrees? it's not radian.

                        //TODO: should we translate the aspect score into a "degrees away from south" score, or something?
                        //      I assume that south is the best...
                        //TODO: The utility of aspect only makes sense in the context of slope - merge these two metrics
                        // for now, south is better, but north ain't so bad...?
                        scoreUtilityOptions: {
                            functionName: "linear3pt",
                            functionArgs: new pvMapper.ThreePointUtilityArgs(0, 0.5, 180, 1, 360, 0.5, "degrees", "Orientation Degrees", "Score", "Preference of the orientation within an area.")
                        }
                    }],
                infoTools: null
            });
            this.getModuleObj = function () { return myModule; }
        }
        getModuleObj: () => pvMapper.Module;
        //Add these so ModuleManager can access the tool information for display in the Tool/Module Selector and make it easier to register onto the moduleManager.
        public static title: string = "Aspect";
        public static category: string = "Geography";
        public static description: string = "The horizontal aspect at the center of a site, using data from ArcGIS Online";
        public static longDescription: string = '<p>This tool reports the aspect at the center point of a site, an angular measure where 0 degrees indicates a northerly aspect and 90 degrees indicates an easterly aspect. This measure is retrieved from the World Topographic Map on ArcGIS Online. Note that the aspect at the center point of a site may not be representative of the overall aspect of a site. Note also that aspect is integrally related to slope. See ArcGIS Online for more information (www.arcgis.com).</p>';
    }



    export class DemElevationModule {
        constructor() {
            var myModule: pvMapper.Module = new pvMapper.Module(<pvMapper.IModuleOptions>{
                id: "DemElevationModule",
                author: "Darian Ramage, BYU",
                version: "0.1.ts",

                activate: () => { addMap(); },
                deactivate: () => { removeMap(); },
                destroy: null,
                init: null,
                                        
                scoringTools: [
                <pvMapper.IScoreToolOptions> {
                    activate: null,
                    deactivate: null,
                    destroy: null,
                    init: null,

                    title: "Elevation",
                    category: "Geography",
                    description: "The elevation at the center of a site, using data from ArcGIS Online",
                    longDescription: '<p>This tool reports the elevation at the center point of a site. This measure is retrieved from the World Topographic Map on ArcGIS Online. See ArcGIS Online for more information (www.arcgis.com).</p>',
                    onScoreAdded: (event, score) => { },
                    onSiteChange: (event, score: pvMapper.Score) => { updateScore(score, "any:1", "m"); },
                    //Note: I have no idea why, but the server will not find the correct layer if we don't include "any:"

                    // higher is better, but not much better, yeah?
                    scoreUtilityOptions: {
                        functionName: "linear3pt",
                        functionArgs: new pvMapper.ThreePointUtilityArgs(0,0.5,1000,0.9,6000,1, "m", "Elevation", "Score","Preference of the elevation of an area.")
                    }
                } ],
                infoTools: null
            });
            this.getModuleObj = function () { return myModule; }
        }
        getModuleObj: () => pvMapper.Module;
        //Add these so ModuleManager can access the tool information for display in the Tool/Module Selector and make it easier to register onto the moduleManager.
        public static title: string = "Elevation";
        public static category: string = "Geography";
        public static description: string = "The elevation at the center of a site, using data from ArcGIS Online";
        public static longDescription: string = '<p>This tool reports the elevation at the center point of a site. This measure is retrieved from the World Topographic Map on ArcGIS Online. See ArcGIS Online for more information (www.arcgis.com).</p>';
    }

    //All private functions and variables go here. They will be accessible only to this module because of the AEAF (Auto-Executing Anonomous Function)

    var topoMapRestUrl = "http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/";
    var topoMapLayer: OpenLayers.Layer;

    function addMap() {
        topoMapLayer = new OpenLayers.Layer.XYZ("ESRI Topography",
            "http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/${z}/${y}/${x}",
            { transitionEffect: "resize", buffer: 1, sphericalMercator: true });
        pvMapper.map.addLayer(topoMapLayer);
        /*
        topoMapLayer = new OpenLayers.Layer.ArcGIS93Rest(
            "World Topography",
            topoMapRestUrl + "export",
            {
                layers: "visible", //"2",
                format: "gif",
                srs: "3857", //"102100",
                //transparent: "true",
            },
            { isBaseLayer: true } //Note: this looks awful as an overlay - let's use it as a base layer, as nature intended
        );
        //topoMapLayer.setOpacity(0.3);
        topoMapLayer.epsgOverride = "3857"; //"102100";
        topoMapLayer.setVisibility(false);
        pvMapper.map.addLayer(topoMapLayer);
        */
    }

    function removeMap() {
        pvMapper.map.removeLayer(topoMapLayer, false);
    }

    function updateScore(score: pvMapper.Score, layers: string, description?: string) {
        var params = {
            mapExtent: score.site.geometry.bounds.toBBOX(6, false),
            geometryType: "esriGeometryEnvelope",
            geometry: score.site.geometry.bounds.toBBOX(6, false),
            f: "json",
            layers: layers,
            tolerance: 0,
            imageDisplay: "1, 1, 96",
            returnGeometry: false,
        };

        var request = OpenLayers.Request.GET({
            url: topoMapRestUrl + "identify",
            proxy: "/Proxy/proxy.ashx?",
            params: params,
            callback: (response) => {
                // update value
                if (response.status === 200) {
                    var esriJsonPerser = new OpenLayers.Format.JSON();
                    esriJsonPerser.extractAttributes = true;
                    var parsedResponse = esriJsonPerser.read(response.responseText);

                    if (parsedResponse && parsedResponse.results) {
                        if (parsedResponse.results.length > 0) {
                            if (console) {
                                console.assert(parsedResponse.results.length === 1,
                                    "I expected that the server would only return identify" +
                                    " results for the single pixel at the center of a site; boy, was I ever wrong.");
                            }

                            score.popupMessage = parsedResponse.results[0].value + " " + description;
                            score.updateValue(parseFloat(parsedResponse.results[0].value));
                        } else {
                            score.popupMessage = "No data for this site";
                            score.updateValue(Number.NaN);
                        }
                    } else {
                        score.popupMessage = "Parse error";
                        score.updateValue(Number.NaN);
                    }
                } else {
                    score.popupMessage = "Error " + response.status + " " + response.statusText;
                    score.updateValue(Number.NaN);
                }
            },
        });
    }

    //var modInstance = new DemSlopeModule();
    //modInstance = new DemAspectModule();
    //modInstance = new DemElevationModule();
}


if (typeof (selfUrl) == 'undefined')
  var selfUrl = $('script[src$="DemModule.js"]').attr('src');
if (typeof (isActive) == 'undefined')
    var isActive = true;
pvMapper.moduleManager.registerModule(BYUModules.DemSlopeModule.category, BYUModules.DemSlopeModule.title, BYUModules.DemSlopeModule, isActive, selfUrl);
pvMapper.moduleManager.registerModule(BYUModules.DemAspectModule.category, BYUModules.DemAspectModule.title, BYUModules.DemAspectModule, isActive, selfUrl);
pvMapper.moduleManager.registerModule(BYUModules.DemElevationModule.category, BYUModules.DemElevationModule.title, BYUModules.DemElevationModule, isActive, selfUrl);

