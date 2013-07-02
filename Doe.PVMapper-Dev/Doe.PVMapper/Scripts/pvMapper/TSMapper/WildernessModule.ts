/// <reference path="ScoreUtility.ts" />
/// <reference path="pvMapper.ts" />
/// <reference path="Site.ts" />
/// <reference path="Score.ts" />
/// <reference path="Tools.ts" />
/// <reference path="Options.d.ts" />
/// <reference path="Module.ts" />
/// <reference path="Esri-GeoJsonConverter.js />

interface esriConverter {}
declare var esriConverter: {
    new (): any;
    prototype: esriConverter;
}

interface geoJsonConverter { }
declare var geoJsonConverter: {
    new (): any;
    prototype: geoJsonConverter;
}

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

                scoringTools: [{
                    //activate: null,
                    //deactivate: null,
                    //destroy: null,
                    //init: null,
                    
                    title: "Wilderness",
                    description: "Overlapping national parks, using data hosted by BYU",
                    category: "Land Use",
                    onScoreAdded: (event:EventArg, score: pvMapper.Score) => { },
                    onSiteChange: (event: EventArg, score: pvMapper.Score) => {
                        this.updateScore(score);
                    },
                    scoreUtilityOptions: {
                       functionName: "linear",
                       functionArgs: new pvMapper.MinMaxUtilityArgs(0, 1,
                           "Minimum Wilderness threshold allowed.",
                           "Maximum Wilderness threshold allowed.")
                    },
                    weight: 10
                }],
                infoTools: null
            });
        }

        private WildernessRestUrl = "https://geoserver.byu.edu/arcgis/rest/services/Layers/nat_parks/MapServer/";
        private wildernessLayer;
        private landBounds = new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34);
    
        private addMap() {
            this.wildernessLayer = new OpenLayers.Layer.ArcGIS93Rest(
                "Wilderness Areas",
                this.WildernessRestUrl + "export",
                {
                    format: "gif",
                    layers: "show: 0",
                    srs: "3857",
                    transparent: "true",

                    /*request: "GetMap",
                    bbox: this.landBounds,
                    layer_type: "polygon",
                    transparent: "true",
                    format: "image/gif",
                    exceptions: "application/vnd.ogc.se_inimage",
                    //maxResolution: 156543.0339,
                    srs: "EPSG:42105",*/
                },
                { isBaseLayer: false }
                );
            this.wildernessLayer.setVisibility(false);
            pvMapper.map.addLayer(this.wildernessLayer);
        }

        private removeMap() {
            pvMapper.map.removeLayer(this.wildernessLayer, false);
        }

        private updateScore(score: pvMapper.Score) {

            var toGeoJson = new OpenLayers.Format.GeoJSON();
            var geoJsonObj = toGeoJson.extract.geometry.apply(toGeoJson, [score.site.geometry]);

            var toEsriJson = new geoJsonConverter();
            var esriJsonObj = toEsriJson.toEsri(geoJsonObj);

            console.log("Converted Geometry:");
            console.log("Esri Json: " + esriJsonObj);

            var params = {
                mapExtent: score.site.geometry.bounds,
                geometryType: "esriGeometryPolygon",
                geometry: esriJsonObj,

                /*mapExtent: score.site.geometry.bounds,
                geometryType: "esriGeometryEnvelope",
                geometry: score.site.geometry.bounds.toBBOX(6, false),*/
                f: "json",
                layers: "all",
                tolerance: 0,
                imageDisplay: "1, 1, 96",
                returnGeometry: false,
            };
        
            var request = OpenLayers.Request.GET({
                url: this.WildernessRestUrl + "identify",
                proxy: "/Proxy/proxy.ashx?",
                params: params,
                callback: (response) => {
                    if (response.status == 200) {
                        var esriJsonParser = new OpenLayers.Format.JSON();
                        esriJsonParser.extractAttributes = true;
                        var parsedResponse = esriJsonParser.read(response.responseText);
                        console.log("Wilderness Module Response: " + response.responseText);
                        console.log("geometry: " + esriJsonObj.toString());
                        console.log("geometry bbox: " + score.site.geometry.bounds.toBBOX(6, false));
                        if (parsedResponse && parsedResponse.results) {
                            if (parsedResponse.results.length > 0) {
                                
                                //This will only take the first national park that overlaps
                                score.popupMessage = parsedResponse.results[0].value;
                                score.updateValue(0);
                            } else {
                                score.popupMessage = "No National Park Overlaps";
                                //score.popupMessage = "No data for this site";
                                score.updateValue(1);
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