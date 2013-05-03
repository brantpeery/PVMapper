/// <reference path="pvMapper.ts" />
/// <reference path="Site.ts" />
/// <reference path="Score.ts" />
/// <reference path="Tools.ts" />
/// <reference path="Options.d.ts" />
/// <reference path="Module.ts" />

module BYUModules {
    export class WildernessModule {
        constructor() {
            var myModule: pvMapper.Module = new pvMapper.Module({
                id: "WildernessModule",
                author: "Darian Ramage",
                version: "0.1.ts",

                activate: () => { this.addMap(); },
                deactivate: () => { this.removeMap(); },
                destroy: null,
                init: null,

                scoringTools: [<any> {
                    activate: null,
                    deactivate: null,
                    destroy: null,
                    init: null,

                    title: "Wilderness",
                    description: "Tells whether the given site is in a wilderness area.  ",
                    category: "Land Use",
                    onScoreAdded: (event, score: pvMapper.Score) => { },
                    onSiteChange: (event, score: pvMapper.Score) => { 
                        this.updateScore(score);
                    },
                    scoreUtilityOptions: <pvMapper.IMinMaxUtilityArgs>{
                        minValue: 10,
                        maxValue: 0,
                    },
                }],
                infoTools: null
            });
        }

        private WildernessMapUrl = "";
        private wildernessLayer;
        private landBounds = new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34);
    
        private addMap() {
            this.wildernessLayer = OpenLayers.Layer.WMS(
            "Wilderness Areas",
            "https://geoserver.byu.edu/geoserver/wms?",
            {
                request: "GetMap",
                bbox: this.landBounds,
                layer_type: "polygon",
                transparent: "true",
                format: "image/gif",
                exceptions: "application/vnd.ogc.se_inimage",
                //maxResolution: 156543.0339,
                srs: "EPSG:42105",
            },
            { isBaseLayer: false }
            );
            pvMapper.map.addLayer(this.wildernessLayer);
        }

        private removeMap() {
            pvMapper.map.removeLayer(this.wildernessLayer, false);
        }

        private updateScore(score: pvMapper.Score) {
            var params = {
                /*mapExtent: score.site.geometry.bounds.toBBOX(6, false),
                geometryType: "esriGeometryEnvelope",
                geometry: score.site.geometry.bounds.toBBOX(6, false),
                f: "json",
                service: "WCS",
                version: "1.1.1",
                request: "GetCoverage",
                layers: "PVMapper:wilderness_areas",
                returnGeometry: false,*/
                service: "WFS",
                version: "2.0.0",
                request: "GetFeature",
                typename: "PVMapper:Double",
                propertyName: "wilderness",
                outputformat: "JSON",
                bbox: score.site.geometry.bounds,
            };
        
            var request = OpenLayers.Request.GET({
                url: "https://geoserver.byu.edu/geoserver/wcs?",
                proxy: "/Proxy/proxy.ashx?",
                params: params,
                callback: (response) => {
                    if (response.status == 200) {
                        var esriJsonParser = new OpenLayers.Format.JSON();
                        esriJsonParser.extractAttributes = true;
                        var parsedResponse = esriJsonParser.read(response.responseText);

                        if (parsedResponse && parsedResponse.results) {
                            if (parsedResponse.results.length > 0) {
                                console.assert(parsedResponse.results.length === 1,
                                    "I expected that the server would only return identify" +
                                    " results for the single pixel at the center of a site. Something went wrong.");

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
                        score.popupMessage = "Error " + response.status;
                        score.updateValue(Number.NaN);
                    }
                }
            })
        }
    }

    var modInstance = new BYUModules.WildernessModule();
    
}