/// <reference path="../pvmapper/tsmapper/pvmapper.ts" />
/// <reference path="../pvmapper/tsmapper/site.ts" />
/// <reference path="../pvmapper/tsmapper/score.ts" />
/// <reference path="../pvmapper/tsmapper/tools.ts" />
/// <reference path="../pvmapper/tsmapper/module.ts" />
/// <reference path="../pvmapper/tsmapper/modulemanager.ts" />

module INLModules {
    declare var selfUrl: string; // this should be included dynamically in ModuleManager when it loads this file.
    //TODO: why didn't we use require.js (or similar)? Why roll our own dynamic js loader?

    export class DirectNormalIrradianceModule extends pvMapper.Module {
        constructor() {
            super();
            this.init(<pvMapper.IModuleOptions>{
                activate: null,
                deactivate: null,

                scoringTools: [<pvMapper.IScoreToolOptions>{
                    activate: () => {
                        // Direct-Normal Irradiation
                        this.dniSuny = this.dniSuny || addMapsDbMap("swera:dni_suny_high_900913", "Direct-Normal Irradiance 10km");
                        pvMapper.map.addLayer(this.dniSuny);
                    },
                    deactivate: () => {
                        pvMapper.map.removeLayer(this.dniSuny, false);
                    },

                    id: "DirectNormalIrradianceTool",
                    title: "Direct-Normal Irradiance",
                    category: "Meteorology",
                    description: "The average annual DNI for a site, using SUNY irradiance maps hosted by NREL (maps.nrel.gov)",
                    longDescription: '<p>This tool reports the daily total direct-normal irradiance at a site, averaged over a 12 year period and over a 0.1 degree square area. The insolation values represent the resource available to concentrating systems that track the sun throughout the day. The data are created using the SUNY Satellite Solar Radiation model (Perez, et.al., 2002). The data are averaged from hourly model output over 12 years (1998-2009). This model uses hourly radiance images from geostationary weather satellites, daily snow cover data, and monthly averages of atmospheric water vapor, trace gases, and the amount of aerosols in the atmosphere to calculate the hourly total insolation (sun and sky) falling on a horizontal surface. The direct beam radiation is then calculated using the atmospheric water vapor, trace gases, and aerosols, which are derived from a variety of sources. For further information, see DATA.gov (api.data.gov/docs/nrel/solar/solar-resource-v1) and NREL (www.nrel.gov/gis).</p>',
                    onScoreAdded: (e, score: pvMapper.Score) => {
                    },
                    onSiteChange: function (e, score: pvMapper.Score) {
                        updateScoreFromLayer(score, "swera:dni_suny_high_900913");
                    },

                    scoreUtilityOptions: {
                        functionName: "linear3pt",
                        functionArgs: new pvMapper.ThreePointUtilityArgs(0, 0, 4, 0.5, 8, 1.0, "kWh/m2/day", "Irradiance (DNI)", "Prefer sites with more available solar resource.")
                    },
                    weight: 10,
                }],
            });
        }

        public id = "DirectNormalIrradianceModule";
        public author = "Scott Brown, INL";
        public version = "0.1.ts";
        public url = selfUrl; //TODO: why didn't we use require.js (or similar)? Why roll our own dynamic js loader?

        //Add these so ModuleManager can access the tool information for display in the Tool/Module Selector and make it easier to register onto the moduleManager.
        public title: string = "Direct-Normal Irradiance";
        public category: string = "Meteorology";
        public description: string = "The average annual DNI for a site, using SUNY irradiance maps hosted by NREL (maps.nrel.gov)";

        private dniSuny: OpenLayers.Layer;
    }



    export class GlobalHorizontalIrradianceModule extends pvMapper.Module {
        constructor() {
            super();
            this.init(<pvMapper.IModuleOptions>{
                activate: null,
                deactivate: null,

                scoringTools: [{
                    activate: () => {
                        // Global-Horizontal Irradiation
                        this.ghiSuny = this.ghiSuny || addMapsDbMap("swera:ghi_suny_high_900913", "Global-Horizontal Irradiance 10km");
                        pvMapper.map.addLayer(this.ghiSuny);
                    },
                    deactivate: () => {
                        pvMapper.map.removeLayer(this.ghiSuny, false);
                    },

                    id: "GlobalHorizontalIrradianceTool",
                    title: "Global-Horizontal Irradiance",
                    category: "Meteorology",
                    description: "The average annual flat plate GHI for a site, using SUNY irradiance maps hosted by NREL (maps.nrel.gov)",
                    longDescription: '<p>This tool reports the daily total flat plate global-horizontal irradiance at a site, averaged over a 12 year period and over a 0.1 degree square area. The insolation values represent the global horizontal resource - the geometric sum of direct normal and diffuse irradiance components, representing total energy available on a planar surface. The data are created using the SUNY Satellite Solar Radiation model (Perez, et.al., 2002). The data are averaged from hourly model output over 12 years (1998-2009). This model uses hourly radiance images from geostationary weather satellites, daily snow cover data, and monthly averages of atmospheric water vapor, trace gases, and the amount of aerosols in the atmosphere to calculate the hourly total insolation (sun and sky) falling on a horizontal surface. The direct beam radiation is then calculated using the atmospheric water vapor, trace gases, and aerosols, which are derived from a variety of sources. For further information, see DATA.gov (api.data.gov/docs/nrel/solar/solar-resource-v1) and NREL GIS (www.nrel.gov/gis).</p>',
                    onScoreAdded: (e, score: pvMapper.Score) => {
                    },
                    onSiteChange: function (e, score: pvMapper.Score) {
                        updateScoreFromLayer(score, "swera:ghi_suny_high_900913");
                    },

                    scoreUtilityOptions: {
                        functionName: "linear3pt",
                        functionArgs: new pvMapper.ThreePointUtilityArgs(0, 0, 3, 0.5, 6, 1.0, "kWh/m2/day", "Irradiance (GHI)", "Prefer sites with more available solar resource.")
                    },
                    weight: 10,
                }],
            });
        }

        public id = "GlobalHorizontalIrradianceModule";
        public author = "Scott Brown, INL";
        public version = "0.1.ts";
        public url = selfUrl; //TODO: why didn't we use require.js (or similar)? Why roll our own dynamic js loader?

        public title: string = "Global-Horizontal Irradiance";
        public category: string = "Meteorology";
        public description: string = "The average annual flat plate GHI for a site, using SUNY irradiance maps hosted by NREL (maps.nrel.gov)";

        private ghiSuny: OpenLayers.Layer;
    }

    export class TiltedFlatPlateIrradianceModule extends pvMapper.Module {
        constructor() {
            super();
            this.init(<pvMapper.IModuleOptions>{
                activate: null,
                deactivate: null,

                scoringTools: [{
                    activate: () => {
                        this.tiltSuny = this.tiltSuny || addMapsDbMap("swera:tilt_suny_high_900913", "Tilted flat-plate Irradiance");
                        pvMapper.map.addLayer(this.tiltSuny);
                    },
                    deactivate: () => {
                        pvMapper.map.removeLayer(this.tiltSuny, false);
                    },

                    id: "TiltedFlatPlateIrradianceTool",
                    title: "Tilted flat-plate Irradiance",
                    category: "Meteorology",
                    description: "The average annual tilt irradiance for a site, using SUNY irradiance maps hosted by NREL (maps.nrel.gov)",
                    longDescription: '<p>This tool reports the daily total tilted flat plate irradiance at a site, averaged over a 12 year period and over a 0.1 degree square area. The insolation values represent the resource available to fixed flat plate system tilted towards the equator at an angle equal to the latitude. The data are created using the SUNY Satellite Solar Radiation model (Perez, et.al., 2002). The data are averaged from hourly model output over 12 years (1998-2009). This model uses hourly radiance images from geostationary weather satellites, daily snow cover data, and monthly averages of atmospheric water vapor, trace gases, and the amount of aerosols in the atmosphere to calculate the hourly total insolation (sun and sky) falling on a horizontal surface. The direct beam radiation is then calculated using the atmospheric water vapor, trace gases, and aerosols, which are derived from a variety of sources. For further information, see DATA.gov (api.data.gov/docs/nrel/solar/solar-resource-v1) and NREL GIS (www.nrel.gov/gis).</p>',
                    onScoreAdded: (e, score: pvMapper.Score) => {
                    },
                    onSiteChange: function (e, score: pvMapper.Score) {
                        updateScoreFromLayer(score, "swera:tilt_suny_high_900913");
                    },

                    scoreUtilityOptions: {
                        functionName: "linear3pt",
                        functionArgs: new pvMapper.ThreePointUtilityArgs(0, 0, 3, 0.5, 6, 1.0, "kWh/m2/day", "Irradiance (tilt)", "Prefer sites with more available solar resource.")
                    },
                    weight: 10,
                }],
            });
        }

        public id = "TiltedFlatPlateIrradianceModule";
        public author = "Scott Brown, INL";
        public version = "0.1.ts";
        public url = selfUrl; //TODO: why didn't we use require.js (or similar)? Why roll our own dynamic js loader?

        public title: string = "Tilted flat-plate Irradiance";
        public category: string = "Meteorology";
        public description: string = "The average annual tilt irradiance for a site, using SUNY irradiance maps hosted by NREL (maps.nrel.gov)";

        private tiltSuny: OpenLayers.Layer;
    }


    //All private functions and variables go here. They will be accessible only to this module because of the AEAF (Auto-Executing Anonomous Function)

    /////////////var irradianceMapUrl = "http://mapsdb.nrel.gov/jw_router/perezANN_mod/tile";
    //var irradianceMapUrl = "http://dingo.gapanalysisprogram.com/ArcGIS/services/PADUS/PADUS_owner/MapServer/WMSServer?";
    var MapsDbUrl = "http://mapsdb.nrel.gov/geoserver/swera/wms?";

    //declare var Ext: any;

    // references to layer objects (used for later querying and removal)

    function addMapsDbMap(name: string, description: string): OpenLayers.WMS {
        var newLayer: OpenLayers.WMS = new OpenLayers.Layer.WMS(
            description, //"Solar GHI 10km by SUNY", //"Solar Radiation",
            MapsDbUrl,
            {
                //maxExtent: solarBounds,
                layers: name, //"swera:ghi_suny_high_900913", //"0", //"perezANN_mod",
                //layer_type: "polygon",
                transparent: "true",
                format: "image/png",
                //exceptions: "application/vnd.ogc.se_inimage",
                maxResolution: 156543.0339,
                srs: "EPSG:900913",
            },
            { isBaseLayer: false }
            );

        newLayer.setOpacity(0.3);
        newLayer.setVisibility(false);
        //dniSuny.epsgOverride = "EPSG:102113";

        return newLayer;
    }

    function updateScoreFromLayer(score: pvMapper.Score, layerName: string) { //site: pvMapper.Site
        var params = {
            REQUEST: "GetFeatureInfo",
            EXCEPTIONS: "application/vnd.ogc.se_xml",
            BBOX: score.site.geometry.bounds.toBBOX(6, false),
            SERVICE: "WMS",
            INFO_FORMAT: "application/vnd.ogc.gml", //'text/html', //"application/vnd.ogc.gml", //"text/plain",
            QUERY_LAYERS: layerName, //"0", //"perezANN_mod", //solar.params.LAYERS,
            FEATURE_COUNT: 50,
            Layers: layerName, //"perezANN_mod", //solar.params.LAYERS,
            WIDTH: 1, //site.geometry.bounds.getWidth(),
            HEIGHT: 1, // site.geometry.bounds.getHeight(),
            format: "image/gif",
            //styles: solar.params.STYLES,
            //srs: dniSuny.params.SRS,
            VERSION: "1.1.1",
            X: 0,
            Y: 0,
            I: 0,
            J: 0,
        };

        // merge filters
        //if (pvMapper.map.layers[0].params.CQL_FILTER != null) {
        //    params.cql_filter = pvMapper.map.layers[0].params.CQL_FILTER;
        //}
        //if (pvMapper.map.layers[0].params.FILTER != null) {
        //    params.filter = pvMapper.map.layers[0].params.FILTER;
        //}
        //if (pvMapper.map.layers[0].params.FEATUREID) {
        //    params.featureid = pvMapper.map.layers[0].params.FEATUREID;
        //}

        var request = OpenLayers.Request.GET({
            //url: "/Proxy/proxy.ashx?" + irradianceMapUrl,
            url: MapsDbUrl,
            proxy: "/Proxy/proxy.ashx?",
            params: params,
            //callback: handler,
            callback: queryResponseHandler(score),
            //async: false,
            //headers: {
            //    "Content-Type": "text/html"
            //},
        });
    }

    function queryResponseHandler(score: pvMapper.Score): ICallback {
        return (response?: OpenLayers.Response) => {
            try {
                if (response.status === 200) {

                    var gmlParser = new OpenLayers.Format.GML();
                    gmlParser.extractAttributes = true;
                    var features = gmlParser.read(response.responseText);

                    if (typeof features !== "undefined" && features.length > 0) {
                        // calculate the average irradiance
                        //TODO: should we just take the floor, or sum proportionally based on overlap, or ...something ?
                        var sum = 0.0;
                        for (var i = 0; i < features.length; i++) {
                            sum += parseFloat(features[i].attributes.annual);
                        }
                        var result = sum / features.length;

                        // convert from kWh/m2/day to MW
                        var siteArea = score.site.geometry.getGeodesicArea(pvMapper.siteLayer.projection);
                        var megaWatts = result / 24 * siteArea / (1000 * 1000)

                        // success
                        score.popupMessage = result.toFixed(2) + " kWh/m2/day" +
                        "\n(" + megaWatts.toFixed(3) + " MW)";
                        score.updateValue(result);
                    } else {
                        // error
                        score.popupMessage = "No data for this site";
                        score.updateValue(Number.NaN);
                    }
                } else if (response.status === 500) {
                    //Note: 500 is basically the only error code returned by Proxy.ashx when it fails.
                    //      I assume the proxy script will fail more often than the map servers themselves.
                    //      Therefore, if you get 500, it's a fair bet that it's the proxy's fault.
                    // error
                    score.popupMessage = "Proxy connection error";
                    score.updateValue(Number.NaN);
                } else {
                    // error
                    score.popupMessage = "Error " + response.status + " " + response.statusText;
                    score.updateValue(Number.NaN);
                }
            }
            catch (err) {
                // error
                score.popupMessage = "Error";
                score.updateValue(Number.NaN);
            }
        };
    }

    pvMapper.moduleManager.registerModule(new DirectNormalIrradianceModule(), true);
    pvMapper.moduleManager.registerModule(new GlobalHorizontalIrradianceModule(), true);
    pvMapper.moduleManager.registerModule(new TiltedFlatPlateIrradianceModule(), true);
}
