/// <reference path="pvMapper.ts" />
/// <reference path="Site.ts" />
/// <reference path="Score.ts" />
/// <reference path="Tools.ts" />
/// <reference path="Options.d.ts" />
/// <reference path="Module.ts" />
var INLModules;
(function (INLModules) {
    var IrradianceModule = (function () {
        function IrradianceModule() {
            var myModule = new pvMapper.Module({
                id: "IrradianceModule",
                author: "Scott Brown, INL",
                version: "0.1.ts",
                activate: function () {
                    addAllMaps();
                },
                deactivate: function () {
                    removeAllMaps();
                },
                destroy: null,
                init: null,
                scoringTools: [
                    {
                        activate: null,
                        deactivate: null,
                        destroy: null,
                        init: null,
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
                            functionName: "linear",
                            functionArgs: new pvMapper.MinMaxUtilityArgs(0, 8, "kWh/m2/day", "Irradiance", "Score", "Preference of available annual direct solar radiation.")
                        },
                        weight: 10
                    },
                    {
                        activate: null,
                        deactivate: null,
                        destroy: null,
                        init: null,
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
                            functionName: "linear",
                            functionArgs: new pvMapper.MinMaxUtilityArgs(0, 6, "kWh/m2/day", "Irradiance", "Score", "Preference of annual average of globally horizontal solar radiation.")
                        },
                        weight: 10
                    },
                    {
                        activate: null,
                        deactivate: null,
                        destroy: null,
                        init: null,
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
                            functionName: "linear",
                            functionArgs: new pvMapper.MinMaxUtilityArgs(0, 6, "kWh/m2/day", "Irradiance", "Score", "Preference of annual tilted flat plate solar radiation.")
                        },
                        weight: 10
                    }
                ],
                infoTools: null
            });
        }
        return IrradianceModule;
    })();

    var modinstance = new IrradianceModule();

    //All private functions and variables go here. They will be accessible only to this module because of the AEAF (Auto-Executing Anonomous Function)
    /////////////var irradianceMapUrl = "http://mapsdb.nrel.gov/jw_router/perezANN_mod/tile";
    //var irradianceMapUrl = "http://dingo.gapanalysisprogram.com/ArcGIS/services/PADUS/PADUS_owner/MapServer/WMSServer?";
    var MapsDbUrl = "http://mapsdb.nrel.gov/geoserver/swera/wms?";

    //declare var Ext: any;
    // references to layer objects (used for later querying and removal)
    var dniSuny;
    var ghiSuny;
    var tiltSuny;

    function addAllMaps() {
        //var solarBounds = new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34);
        // Direct-Normal Irradiation
        dniSuny = addMapsDbMap("swera:dni_suny_high_900913", "Direct-Normal Irradiance 10km");
        pvMapper.map.addLayer(dniSuny);

        // Global-Horizontal Irradiation
        ghiSuny = addMapsDbMap("swera:ghi_suny_high_900913", "Global-Horizontal Irradiance 10km");
        pvMapper.map.addLayer(ghiSuny);

        tiltSuny = addMapsDbMap("swera:tilt_suny_high_900913", "Tilted flat-plate Irradiance");
        pvMapper.map.addLayer(tiltSuny);
    }

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

    function removeAllMaps() {
        pvMapper.map.removeLayer(dniSuny, false);
        pvMapper.map.removeLayer(ghiSuny, false);
        pvMapper.map.removeLayer(tiltSuny, false);
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
                        //score.updateValue(megaWatts); //TODO: duh...? want give two scores...
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
})(INLModules || (INLModules = {}));
