/// <reference path="../pvmapper/tsmapper/pvmapper.ts" />
/// <reference path="../pvmapper/tsmapper/site.ts" />
/// <reference path="../pvmapper/tsmapper/score.ts" />
/// <reference path="../pvmapper/tsmapper/tools.ts" />
/// <reference path="../pvmapper/tsmapper/module.ts" />
/// <reference path="../pvmapper/tsmapper/modulemanager.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var INLModules;
(function (INLModules) {
    //TODO: why didn't we use require.js (or similar)? Why roll our own dynamic js loader?
    var DirectNormalIrradianceModule = (function (_super) {
        __extends(DirectNormalIrradianceModule, _super);
        function DirectNormalIrradianceModule() {
            var _this = this;
            _super.call(this);
            this.id = "DirectNormalIrradianceModule";
            this.author = "Scott Brown, INL";
            this.version = "0.1.ts";
            this.url = selfUrl;
            //Add these so ModuleManager can access the tool information for display in the Tool/Module Selector and make it easier to register onto the moduleManager.
            this.title = "Direct-Normal Irradiance";
            this.category = "Meteorology";
            this.description = "The average annual DNI for a site, using SUNY irradiance maps hosted by NREL (maps.nrel.gov)";
            this.init({
                activate: null,
                deactivate: null,
                scoringTools: [{
                        activate: function () {
                            // Direct-Normal Irradiation
                            _this.dniSuny = _this.dniSuny || addMapsDbMap("swera:dni_suny_high_900913", "Direct-Normal Irradiance 10km");
                            pvMapper.map.addLayer(_this.dniSuny);
                        },
                        deactivate: function () {
                            pvMapper.map.removeLayer(_this.dniSuny, false);
                        },
                        id: "DirectNormalIrradianceTool",
                        title: "Direct-Normal Irradiance",
                        category: "Meteorology",
                        description: "The average annual DNI for a site, using SUNY irradiance maps hosted by NREL (maps.nrel.gov)",
                        longDescription: '<p>This tool reports the daily total direct-normal irradiance at a site, averaged over a 12 year period and over a 0.1 degree square area. The insolation values represent the resource available to concentrating systems that track the sun throughout the day. The data are created using the SUNY Satellite Solar Radiation model (Perez, et.al., 2002). The data are averaged from hourly model output over 12 years (1998-2009). This model uses hourly radiance images from geostationary weather satellites, daily snow cover data, and monthly averages of atmospheric water vapor, trace gases, and the amount of aerosols in the atmosphere to calculate the hourly total insolation (sun and sky) falling on a horizontal surface. The direct beam radiation is then calculated using the atmospheric water vapor, trace gases, and aerosols, which are derived from a variety of sources. For further information, see DATA.gov (api.data.gov/docs/nrel/solar/solar-resource-v1) and NREL (www.nrel.gov/gis).</p>',
                        onScoreAdded: function (e, score) {
                        },
                        onSiteChange: function (e, score) {
                            updateScoreFromLayer(score, "swera:dni_suny_high_900913");
                        },
                        scoreUtilityOptions: {
                            functionName: "linear3pt",
                            functionArgs: new pvMapper.ThreePointUtilityArgs(0, 0, 4, 0.5, 8, 1.0, "kWh/m2/day", "Irradiance (DNI)", "Prefer sites with more available solar resource.")
                        },
                        weight: 10
                    }]
            });
        }
        return DirectNormalIrradianceModule;
    })(pvMapper.Module);
    INLModules.DirectNormalIrradianceModule = DirectNormalIrradianceModule;

    var GlobalHorizontalIrradianceModule = (function (_super) {
        __extends(GlobalHorizontalIrradianceModule, _super);
        function GlobalHorizontalIrradianceModule() {
            var _this = this;
            _super.call(this);
            this.id = "GlobalHorizontalIrradianceModule";
            this.author = "Scott Brown, INL";
            this.version = "0.1.ts";
            this.url = selfUrl;
            this.title = "Global-Horizontal Irradiance";
            this.category = "Meteorology";
            this.description = "The average annual flat plate GHI for a site, using SUNY irradiance maps hosted by NREL (maps.nrel.gov)";
            this.init({
                activate: null,
                deactivate: null,
                scoringTools: [{
                        activate: function () {
                            // Global-Horizontal Irradiation
                            _this.ghiSuny = _this.ghiSuny || addMapsDbMap("swera:ghi_suny_high_900913", "Global-Horizontal Irradiance 10km");
                            pvMapper.map.addLayer(_this.ghiSuny);
                        },
                        deactivate: function () {
                            pvMapper.map.removeLayer(_this.ghiSuny, false);
                        },
                        id: "GlobalHorizontalIrradianceTool",
                        title: "Global-Horizontal Irradiance",
                        category: "Meteorology",
                        description: "The average annual flat plate GHI for a site, using SUNY irradiance maps hosted by NREL (maps.nrel.gov)",
                        longDescription: '<p>This tool reports the daily total flat plate global-horizontal irradiance at a site, averaged over a 12 year period and over a 0.1 degree square area. The insolation values represent the global horizontal resource - the geometric sum of direct normal and diffuse irradiance components, representing total energy available on a planar surface. The data are created using the SUNY Satellite Solar Radiation model (Perez, et.al., 2002). The data are averaged from hourly model output over 12 years (1998-2009). This model uses hourly radiance images from geostationary weather satellites, daily snow cover data, and monthly averages of atmospheric water vapor, trace gases, and the amount of aerosols in the atmosphere to calculate the hourly total insolation (sun and sky) falling on a horizontal surface. The direct beam radiation is then calculated using the atmospheric water vapor, trace gases, and aerosols, which are derived from a variety of sources. For further information, see DATA.gov (api.data.gov/docs/nrel/solar/solar-resource-v1) and NREL GIS (www.nrel.gov/gis).</p>',
                        onScoreAdded: function (e, score) {
                        },
                        onSiteChange: function (e, score) {
                            updateScoreFromLayer(score, "swera:ghi_suny_high_900913");
                        },
                        scoreUtilityOptions: {
                            functionName: "linear3pt",
                            functionArgs: new pvMapper.ThreePointUtilityArgs(0, 0, 3, 0.5, 6, 1.0, "kWh/m2/day", "Irradiance (GHI)", "Prefer sites with more available solar resource.")
                        },
                        weight: 10
                    }]
            });
        }
        return GlobalHorizontalIrradianceModule;
    })(pvMapper.Module);
    INLModules.GlobalHorizontalIrradianceModule = GlobalHorizontalIrradianceModule;

    var TiltedFlatPlateIrradianceModule = (function (_super) {
        __extends(TiltedFlatPlateIrradianceModule, _super);
        function TiltedFlatPlateIrradianceModule() {
            var _this = this;
            _super.call(this);
            this.id = "TiltedFlatPlateIrradianceModule";
            this.author = "Scott Brown, INL";
            this.version = "0.1.ts";
            this.url = selfUrl;
            this.title = "Tilted flat-plate Irradiance";
            this.category = "Meteorology";
            this.description = "The average annual tilt irradiance for a site, using SUNY irradiance maps hosted by NREL (maps.nrel.gov)";
            this.init({
                activate: null,
                deactivate: null,
                scoringTools: [{
                        activate: function () {
                            _this.tiltSuny = _this.tiltSuny || addMapsDbMap("swera:tilt_suny_high_900913", "Tilted flat-plate Irradiance");
                            pvMapper.map.addLayer(_this.tiltSuny);
                        },
                        deactivate: function () {
                            pvMapper.map.removeLayer(_this.tiltSuny, false);
                        },
                        id: "TiltedFlatPlateIrradianceTool",
                        title: "Tilted flat-plate Irradiance",
                        category: "Meteorology",
                        description: "The average annual tilt irradiance for a site, using SUNY irradiance maps hosted by NREL (maps.nrel.gov)",
                        longDescription: '<p>This tool reports the daily total tilted flat plate irradiance at a site, averaged over a 12 year period and over a 0.1 degree square area. The insolation values represent the resource available to fixed flat plate system tilted towards the equator at an angle equal to the latitude. The data are created using the SUNY Satellite Solar Radiation model (Perez, et.al., 2002). The data are averaged from hourly model output over 12 years (1998-2009). This model uses hourly radiance images from geostationary weather satellites, daily snow cover data, and monthly averages of atmospheric water vapor, trace gases, and the amount of aerosols in the atmosphere to calculate the hourly total insolation (sun and sky) falling on a horizontal surface. The direct beam radiation is then calculated using the atmospheric water vapor, trace gases, and aerosols, which are derived from a variety of sources. For further information, see DATA.gov (api.data.gov/docs/nrel/solar/solar-resource-v1) and NREL GIS (www.nrel.gov/gis).</p>',
                        onScoreAdded: function (e, score) {
                        },
                        onSiteChange: function (e, score) {
                            updateScoreFromLayer(score, "swera:tilt_suny_high_900913");
                        },
                        scoreUtilityOptions: {
                            functionName: "linear3pt",
                            functionArgs: new pvMapper.ThreePointUtilityArgs(0, 0, 3, 0.5, 6, 1.0, "kWh/m2/day", "Irradiance (tilt)", "Prefer sites with more available solar resource.")
                        },
                        weight: 10
                    }]
            });
        }
        return TiltedFlatPlateIrradianceModule;
    })(pvMapper.Module);
    INLModules.TiltedFlatPlateIrradianceModule = TiltedFlatPlateIrradianceModule;

    //All private functions and variables go here. They will be accessible only to this module because of the AEAF (Auto-Executing Anonomous Function)
    /////////////var irradianceMapUrl = "http://mapsdb.nrel.gov/jw_router/perezANN_mod/tile";
    //var irradianceMapUrl = "http://dingo.gapanalysisprogram.com/ArcGIS/services/PADUS/PADUS_owner/MapServer/WMSServer?";
    var MapsDbUrl = "http://mapsdb.nrel.gov/geoserver/swera/wms?";

    //declare var Ext: any;
    // references to layer objects (used for later querying and removal)
    function addMapsDbMap(name, description) {
        var newLayer = new OpenLayers.Layer.WMS(description, MapsDbUrl, {
            //maxExtent: solarBounds,
            layers: name,
            //layer_type: "polygon",
            transparent: "true",
            format: "image/png",
            //exceptions: "application/vnd.ogc.se_inimage",
            maxResolution: 156543.0339,
            srs: "EPSG:900913"
        }, { isBaseLayer: false });

        newLayer.setOpacity(0.3);
        newLayer.setVisibility(false);

        //dniSuny.epsgOverride = "EPSG:102113";
        return newLayer;
    }

    function updateScoreFromLayer(score, layerName) {
        var params = {
            REQUEST: "GetFeatureInfo",
            EXCEPTIONS: "application/vnd.ogc.se_xml",
            BBOX: score.site.geometry.bounds.toBBOX(6, false),
            SERVICE: "WMS",
            INFO_FORMAT: "application/vnd.ogc.gml",
            QUERY_LAYERS: layerName,
            FEATURE_COUNT: 50,
            Layers: layerName,
            WIDTH: 1,
            HEIGHT: 1,
            format: "image/gif",
            //styles: solar.params.STYLES,
            //srs: dniSuny.params.SRS,
            VERSION: "1.1.1",
            X: 0,
            Y: 0,
            I: 0,
            J: 0
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
            callback: queryResponseHandler(score)
        });
    }

    function queryResponseHandler(score) {
        return function (response) {
            try  {
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
                        var megaWatts = result / 24 * siteArea / (1000 * 1000);

                        // success
                        score.popupMessage = result.toFixed(2) + " kWh/m2/day" + "\n(" + megaWatts.toFixed(3) + " MW)";
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
            } catch (err) {
                // error
                score.popupMessage = "Error";
                score.updateValue(Number.NaN);
            }
        };
    }

    pvMapper.moduleManager.registerModule(new DirectNormalIrradianceModule(), true);
    pvMapper.moduleManager.registerModule(new GlobalHorizontalIrradianceModule(), true);
    pvMapper.moduleManager.registerModule(new TiltedFlatPlateIrradianceModule(), true);
})(INLModules || (INLModules = {}));
//# sourceMappingURL=irradianceModule.js.map
