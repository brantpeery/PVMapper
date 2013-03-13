/// <reference path="pvMapper.ts" />
/// <reference path="Site.ts" />
/// <reference path="Score.ts" />
/// <reference path="Tools.ts" />
/// <reference path="Options.d.ts" />
/// <reference path="Module.ts" />

module INLModules {
    export class ProtectedAreasModule {
        constructor() {
            var myModule: pvMapper.Module = new pvMapper.Module({
                id: "ProtectedAreasModule",
                author: "Leng Vang, INL",
                version: "0.1.ts",

                activate: () => {
                    this.addMap();
                },
                deactivate: () => {
                    this.removeMap();
                },
                destroy: null,
                init: null,

                scoringTools: [{
                    activate: null,
                    deactivate: null,
                    destroy: null,
                    init: null,

                    title: "Protected Areas",
                    description: "Shows the classification of protected areas within the united states.",
                    onScoreAdded: (e, score: pvMapper.Score) => {
                    },
                    onSiteChange: function (e, score: pvMapper.Score) {
                        this.updateScore(score);
                    },
                    updateScoreCallback: (score: pvMapper.Score) => {
                        this.updateScore(score);
                    },
                }],

                infoTools: null
            });
        }


        private federalLandsWmsUrl = "http://dingo.gapanalysisprogram.com/ArcGIS/services/PADUS/PADUS_owner/MapServer/WMSServer";
        private federalLandsRestUrl = "http://dingo.gapanalysisprogram.com/ArcGIS/rest/services/PADUS/PADUS_owner/MapServer/";

        private federalLandsLayer;
        private landBounds = new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34);

        private addMap() {
            this.federalLandsLayer = new OpenLayers.Layer.WMS(
                    "Protected Areas",
                    this.federalLandsWmsUrl,
                    {
                        maxExtent: this.landBounds,
                        layers: "0",
                        layer_type: "polygon",
                        transparent: "true",
                        format: "image/gif",
                        exceptions: "application/vnd.ogc.se_inimage",
                        maxResolution: 156543.0339,
                        srs: "EPSG:102113",
                    },
                    { isBaseLayer: false }
                    );
            this.federalLandsLayer.epsgOverride = "EPSG:102113";
            this.federalLandsLayer.setOpacity(0.3);
            this.federalLandsLayer.setVisibility(false);
            pvMapper.map.addLayer(this.federalLandsLayer);
        }

        private removeMap() {
            pvMapper.map.removeLayer(this.federalLandsLayer, false);
        }

        private updateScore(score: pvMapper.Score) {
            var params = {
                mapExtent: score.site.geometry.bounds.toBBOX(6, false),
                geometryType: "esriGeometryEnvelope",
                geometry: score.site.geometry.bounds.toBBOX(6, false),
                f: "json",
                layers: "0",
                tolerance: 0,
                imageDisplay: "1, 1, 96",
                returnGeometry: false,
            };

            var request = OpenLayers.Request.GET({
                url: this.federalLandsRestUrl + "identify",
                proxy: "/Proxy/proxy.ashx?",
                params: params,
                callback: (response) => {
                    // update value
                    if (response.status === 200) {
                        var esriJsonPerser = new OpenLayers.Format.JSON();
                        esriJsonPerser.extractAttributes = true;
                        var parsedResponse = esriJsonPerser.read(response.responseText);

                        if (parsedResponse && parsedResponse.results && parsedResponse.results.length > 0) {
                            var alertText = "";
                            var lastText = null;
                            for (var i = 0; i < parsedResponse.results.length; i++) {
                                var newText = parsedResponse.results[i].attributes["Owner Name"];
                                if (newText != lastText) {
                                    if (lastText != null) {
                                        alertText += ", \n";
                                    }
                                    alertText += newText;
                                }
                                lastText = newText;
                            }

                            score.popupMessage = alertText;
                            score.updateValue(parsedResponse.results.length);   // number of overlapping features
                        } else {
                            score.popupMessage = "None";
                            score.updateValue(0);
                        }
                    } else {
                        score.popupMessage = "Connection error " + response.status;
                        score.updateValue(Number.NaN);
                    }
                },
            });
        }

    }

    var protectedAreasInstance = new INLModules.ProtectedAreasModule();

    //============================================================

    export class LandCoverModule {
        constructor() {
            var myModule: pvMapper.Module = new pvMapper.Module({
                id: "LandCoverModule",
                author: "Leng Vang, INL",
                version: "0.1.ts",

                activate: () => {
                    this.addMap();
                },
                deactivate: () => {
                    this.removeMap();
                },
                destroy: null,
                init: null,

                scoringTools: [{
                    activate: null,
                    deactivate: null,
                    destroy: null,
                    init: null,

                    title: "Land Cover",
                    description: "Display the land cover found around the center of a site",
                    onScoreAdded: (e, score: pvMapper.Score) => {
                    },
                    onSiteChange: function (e, score: pvMapper.Score) {
                        this.updateScore(score);
                    },
                    updateScoreCallback: (score: pvMapper.Score) => {
                        this.updateScore(score);
                    },
                }],

                infoTools: null
            });
        }


        private landCoverWmsUrl = "http://dingo.gapanalysisprogram.com/ArcGIS/services/NAT_LC/1_NVC_class_landuse/MapServer/WMSServer";
        private landCoverRestUrl = "http://dingo.gapanalysisprogram.com/ArcGIS/rest/services/NAT_LC/1_NVC_class_landuse/MapServer/";

        private landCoverLayer;
        private landBounds = new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34);

        private addMap() {
            this.landCoverLayer = new OpenLayers.Layer.WMS(
                    "Land Cover",
                    this.landCoverWmsUrl,
                    {
                        maxExtent: this.landBounds,
                        layers: "0,1,2",
                        layer_type: "polygon",
                        transparent: "true",
                        format: "image/gif",
                        exceptions: "application/vnd.ogc.se_inimage",
                        maxResolution: 156543.0339,
                        srs: "EPSG:102113",
                    },
                    { isBaseLayer: false }
                    );
            this.landCoverLayer.epsgOverride = "EPSG:102113";
            this.landCoverLayer.setOpacity(0.3);
            this.landCoverLayer.setVisibility(false);
            pvMapper.map.addLayer(this.landCoverLayer);
        }

        private removeMap() {
            pvMapper.map.removeLayer(this.landCoverLayer, false);
        }

        private updateScore(score: pvMapper.Score) {
            var params = {
                mapExtent: score.site.geometry.bounds.toBBOX(6, false),
                geometryType: "esriGeometryEnvelope",
                geometry: score.site.geometry.bounds.toBBOX(6, false),
                f: "json",
                layers: "0,1,2",
                tolerance: 0,
                imageDisplay: "1, 1, 96",
                returnGeometry: false,
            };

            var request = OpenLayers.Request.GET({
                url: this.landCoverRestUrl + "identify",
                proxy: "/Proxy/proxy.ashx?",
                params: params,
                callback: (response) => {
                    // update value
                    if (response.status === 200) {
                        var esriJsonPerser = new OpenLayers.Format.JSON();
                        esriJsonPerser.extractAttributes = true;
                        var parsedResponse = esriJsonPerser.read(response.responseText);

                        if (parsedResponse && parsedResponse.results && parsedResponse.results.length > 0) {
                            var alertText = "";
                            var lastText = null;
                            for (var i = 0; i < parsedResponse.results.length; i++) {
                                var newText = parsedResponse.results[i].attributes["NVC_DIV"];
                                if (newText != lastText) {
                                    if (lastText != null) {
                                        alertText += ", \n";
                                    }
                                    alertText += newText;
                                }
                                lastText = newText;
                            }

                            score.popupMessage = alertText;
                            score.updateValue(parsedResponse.results.length);   // returns 1
                            //TODO: the server refuses to return more than one pixel value... how do we get %coverage?
                            //      I'm afraid that we'll have to fetch the overlapping image and parse it ourselves...
                            //      or at least run a few requests for different pixels and conbine the results.
                            //      Either way, it'll be costly and inefficient. But, I can't find a better server,
                            //      nor have I been successful at coaxing multiple results from this one. Curses.
                        } else {
                            score.popupMessage = "No data for this site";
                            score.updateValue(Number.NaN);
                        }
                    } else {
                        score.popupMessage = "Connection error " + response.status;
                        score.updateValue(Number.NaN);
                    }
                },
            });
        }
    }

    var landCoverInstance = new INLModules.LandCoverModule();

    //============================================================

}

