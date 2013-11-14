/// <reference path="pvMapper.ts" />
/// <reference path="Site.ts" />
/// <reference path="Score.ts" />
/// <reference path="Tools.ts" />
/// <reference path="Options.d.ts" />
/// <reference path="Module.ts" />
/// <reference path="ScoreUtility.ts" />
/// <reference path="Esri-GeoJsonConverter.js />
/// <reference path="jstorage.d.ts" />
/// <reference path="ScoreLine.ts" />
/// <reference path="Scoreboard.ts" />
/// <reference path="OpenLayers.d.ts" />
/// <reference path="../../jquery.d.ts" />
/// <reference path="common.ts" />
/// <reference path="Event.ts" />

module INLModules {

    export class SoilModule {
        constructor() {
            var myModule: pvMapper.Module = new pvMapper.Module({
                id: "SoilModule",
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

                    title: "Soil",
                    description: "Overlapping soil types, using the U.S. General Soil Map from the Department of Agriculture's Natural Resources Conservation Service hosted by arcgisonline.com",
                    category: "Geography",
                    //onScoreAdded: (e, score: pvMapper.Score) => {
                    //},
                    onSiteChange: (e, score: pvMapper.Score) => {
                        this.updateScore(score);
                    },

                    getStarRatables: () => {
                        return this.starRatingHelper.starRatings;
                    },

                    scoreUtilityOptions: {
                        functionName: "linear",
                        functionArgs: new pvMapper.MinMaxUtilityArgs(0, 5, "stars")
                    },
                    weight: 10,
                }],

                infoTools: null
            });
        }

        private starRatingHelper: pvMapper.IStarRatingHelper = new pvMapper.StarRatingHelper({
            defaultStarRating: 3,
            //noCategoryRating: 3,
            //noCategoryLabel: "No data available"
        });

        private soilRestUrl = "http://server.arcgisonline.com/ArcGIS/rest/services/Specialty/Soil_Survey_Map/MapServer/"
        private soilSurveyQueryUrl = "http://server.arcgisonline.com/ArcGIS/rest/services/Specialty/Soil_Survey_Map/MapServer/0/query";
        //private stateSoilQueryUrl = "http://server.arcgisonline.com/ArcGIS/rest/services/Specialty/Soil_Survey_Map/MapServer/1/query";

        private soilLayer;

        private addMap() {
            this.soilLayer = new OpenLayers.Layer.ArcGIS93Rest(
                "Soil Type",
                this.soilRestUrl + "export",
                {
                    layers: "show:0",
                    format: "gif",
                    srs: "3857", //"102100",
                    transparent: "true",
                }
                );
            this.soilLayer.setOpacity(0.3);
            this.soilLayer.epsgOverride = "3857"; //"EPSG:102100";
            this.soilLayer.setVisibility(false);

            pvMapper.map.addLayer(this.soilLayer);
            //pvMapper.map.setLayerIndex(mapLayer, 0);
        }

        private removeMap() {
            pvMapper.map.removeLayer(this.soilLayer, false);
        }

        // cache for features we've found from which we can find a nearest feature.
        private nearestFeatureCache: { [siteID: string]: Array<OpenLayers.FVector>; } = {};

        private updateScore(score: pvMapper.Score) {
            //Note: I've disabled caching nearby geometries - the geometries returned by this server have thousands of points, so it seemed easier to send new requests each time.

            //if (typeof this.nearestFeatureCache[score.site.id] !== 'undefined') {
            //    // we have a cached copy of our nearby habitats query for this site - let's use that.
            //    this.updateScoreFromCache(score);
            //} else {
            //    // we don't have a cached copy of our nearby habitats - let's request them.
                this.updateScoreFromWeb(score);
            //}
        }

        private updateScoreFromWeb(score: pvMapper.Score) {
            //var searchBounds = new OpenLayers.Bounds(
            //    score.site.geometry.bounds.left - 1000,
            //    score.site.geometry.bounds.bottom - 1000,
            //    score.site.geometry.bounds.right + 1000,
            //    score.site.geometry.bounds.top + 1000)
            //    .toBBOX(0, false);

            // search only for soils that intersect our site polygon.
            var geoJsonPolygon: string = OpenLayers.Format.GeoJSON.prototype.write(score.site.geometry, false);
            geoJsonPolygon = geoJsonPolygon.replace('"type":"Polygon",', '');
            geoJsonPolygon = geoJsonPolygon.replace('"coordinates":', '"rings":');

            //var toEsriGeoJson: any = <any>geoJsonConverter();
            //var sitePolygonEsri = toEsriGeoJson.toEsri(score.site);


            //var params = {
            //    mapExtent: searchBounds,
            //    geometryType: "esriGeometryEnvelope",
            //    geometry: searchBounds,
            //    f: "json", // or "html",
            //    layers: "all:0,1", //"perezANN_mod", //solar.params.LAYERS,
            //    tolerance: 0, //TODO: should this be 0 or 1?
            //    imageDisplay: "100, 100, 96",
            //};

            // use a genuine JSONP request, rather than a plain old GET request routed through the proxy.
            var jsonpProtocol = new OpenLayers.Protocol.Script(<any>{
                //url: this.soilRestUrl + "identify",
                url: this.soilSurveyQueryUrl,
                params: {
                    f: "json",
                    //outFields: "muname,muhelcl", //"*", 
                    geometryType: "esriGeometryPolygon",
                    geometry: geoJsonPolygon,
                    //geometryType: "esriGeometryEnvelope",
                    //geometry: searchBounds,
                    returnGeometry: false,
                },
                format: new OpenLayers.Format.EsriGeoJSON(),
                parseFeatures: function (data) {
                    return data.features; //HACK>..

                    ////HACK: it seems that we didn't get a spatial reference, so hack one in.
                    //data.spatialReference = data.spatialReference || {};
                    //data.spatialReference.wkid = data.spatialReference.wkid || "3857";
                    //return this.format.read(data);
                },
                callback: (response: OpenLayers.Response) => {
                    if (response.success()) {
                        // cache the returned features, then update the score through the cache
                        this.nearestFeatureCache[score.site.id] = response.features || [];
                        this.updateScoreFromCache(score);
                    } else {
                        score.popupMessage = "Request error " + response.error.toString();
                        score.updateValue(Number.NaN);
                    }
                },
            });

            var response: OpenLayers.Response = jsonpProtocol.read();
        }


        private updateScoreFromCache(score: pvMapper.Score) {
            var features: OpenLayers.FVector[] = this.nearestFeatureCache[score.site.id];

            var responseArray: string[] = [];

            if (features) {
                for (var i = 0; i < features.length; i++) {
                    //if (score.site.geometry.intersects(features[i].geometry)) {
                        var newText: string = features[i].attributes["muname"];
                            // + (features[i].attributes["muhelcl"] ? ": " + features[i].attributes["muhelcl"] : "");
                        if (newText && responseArray.indexOf(newText) < 0) {
                            // add this to the array of responses we've received
                            responseArray.push(newText);

                            // if we have a valid erodale class definition, and no current star rating,
                            // then let's go ahead and use the erodable class definition as the star rating.
                            if (typeof this.starRatingHelper.starRatings[newText] === "undefined") {
                                switch (features[i].attributes["muhelcl"]) {
                                    case "Highly erodible land":
                                        this.starRatingHelper.starRatings[newText] = 2;
                                        break;
                                    case "Potentially highly erodible land":
                                        this.starRatingHelper.starRatings[newText] = 3;
                                        break;
                                    case "Not highly erodible land":
                                        this.starRatingHelper.starRatings[newText] = 4;
                                        break;
                                    //default:
                                    //    this.starRatingHelper.starRatings[newText] = 3;
                                }
                            }
                        }
                    //}
                }
            }

            if (responseArray.length > 0) {
                // use the combined rating string, and its lowest rating value
                var combinedText = this.starRatingHelper.sortRatableArray(responseArray);
                score.popupMessage = combinedText;
                score.updateValue(this.starRatingHelper.starRatings[responseArray[0]]);
            } else {
                // no data available - cannot guess soil type, so let's go with NaN here (?)
                score.popupMessage = "No soil data here.";
                score.updateValue(Number.NaN);
                //score.popupMessage = this.starRatingHelper.options.noCategoryLabel;
                //score.updateValue(this.starRatingHelper.starRatings[
                //    this.starRatingHelper.options.noCategoryLabel]);
            }
        }

    }

    var soilInstance = new INLModules.SoilModule();

}