/// <reference path="../pvmapper/tsmapper/pvmapper.ts" />
/// <reference path="../pvmapper/tsmapper/site.ts" />
/// <reference path="../pvmapper/tsmapper/score.ts" />
/// <reference path="../pvmapper/tsmapper/tools.ts" />
/// <reference path="../pvmapper/tsmapper/module.ts" />
/// <reference path="../pvmapper/tsmapper/scoreutility.ts" />
/// <reference path="../pvmapper/tsmapper/modulemanager.ts" />

module INLModules {
    declare var selfUrl: string; // this should be included dynamically in ModuleManager when it loads this file.
    //TODO: why didn't we use require.js (or similar)? Why roll our own dynamic js loader?

    export class SoilModule extends pvMapper.Module {
        constructor() {
            super();

            var thisModule = this;
            this.init(<pvMapper.IModuleOptions>{
                activate: null,
                deactivate: null,

                scoringTools: [{
                    activate: () => {
                        this.addMap();
                    },
                    deactivate: () => {
                        this.removeMap();
                    },

                    id: "SoilTool",
                    title: "Soil",
                    category: "Geography",
                    description: "Overlapping soil types, using the Soil Survey Geographic (SSURGO) map hosted by arcgisonline.com",
                    longDescription: '<p>This star rating tool finds the various types of soil present at a proposed site. These ares are defined in the Soil Survey Geographic (SSURGO) dataset from the National Cooperative Soil Survey. SSURGO digitizing duplicates the original soil survey maps. This level of mapping is designed for use by landowners, townships, and county natural resource planning and management. Note that the extent of SSURGO data is limited to soil survey areas; many counties and parts counties are not included. For more information, see the USDA Natural Resource Conservation Service (soils.usda.gov/survey/geography/ssurgo).</p><p>This tool depends on a user-defined star rating for each soil type found at a site, on a scale of 0-5 stars. The default rating for soil types is based on their erodability. "Highly erodible land" gets two stars by default; "potentially highly erodible land" is given three stars; "Not highly erodible land" has four stars. These ratings may be further adjusted by the user. Note that the user should be knowledgeable of soils data and their characteristics.</p><p>When a site has just one soil type, its score is based on the star rating of that soil (so overlapping a five-star soil type might give a score of 100, while overlapping a one-star soil may give a score of 20). If a site includes more than one soil type, the lowest star rating is used to calculate its score (so a site with both a one-star and a five-star soil might have a score of 20). Like every other score tool, these scores ultimately depend on the user-defined utility function.</p>',
                    //onScoreAdded: (e, score: pvMapper.Score) => {
                    //},
                    onSiteChange: (e, score: pvMapper.Score) => {
                        this.updateScore(score);
                    },

                    getStarRatables: () => {
                        return this.starRatingHelper.starRatings;
                    },
                    setStarRatables: function (rateTable: pvMapper.IStarRatings) {
                        //$.extend(this.starRatingHelper.starRatings, rateTable);
                        thisModule.starRatingHelper.resetStarRatings(rateTable);

                        // update any scores which aren'r already out for update (those will pick up the new star ratings when they return)
                        var thisScoreLine: pvMapper.ScoreLine = this;
                        thisScoreLine.scores.forEach(s => { if (!s.isValueOld) { s.isValueOld = true; thisModule.updateScore(s); } });
                    },
                    scoreUtilityOptions: {
                        functionName: "linear",
                        functionArgs: new pvMapper.MinMaxUtilityArgs(0, 5, "stars", "Star Rating", "Prefer sites with less erodible, higher-rated soil")
                    },
                    weight: 10,

                }],
            });
        }

        public id = "SoilModule";
        public author = "Leng Vang, INL";
        public version = "0.1.ts";
        public url = selfUrl; //TODO: why didn't we use require.js (or similar)? Why roll our own dynamic js loader?

        public title: string = "Soil";
        public category: string = "Geography";
        public description: string = "Overlapping soil types, using the Soil Survey Geographic (SSURGO) map hosted by arcgisonline.com";


        private starRatingHelper: pvMapper.IStarRatingHelper = new pvMapper.StarRatingHelper({
            defaultStarRating: 3,
        });

        private soilRestUrl = "http://server.arcgisonline.com/ArcGIS/rest/services/Specialty/Soil_Survey_Map/MapServer/"
        private soilSurveyQueryUrl = "https://server.arcgisonline.com/ArcGIS/rest/services/Specialty/Soil_Survey_Map/MapServer/0/query";
        //private stateSoilQueryUrl = "https://server.arcgisonline.com/ArcGIS/rest/services/Specialty/Soil_Survey_Map/MapServer/1/query";

        private soilLayer;

        private addMap = () => {
            if (!this.soilLayer) {
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
            }

            pvMapper.map.addLayer(this.soilLayer);
            //pvMapper.map.setLayerIndex(mapLayer, 0);
        }

        private removeMap = () => {
            pvMapper.map.removeLayer(this.soilLayer, false);
        }

        // cache for features we've found from which we can find a nearest feature.
        private nearestFeatureCache: { [siteID: string]: Array<OpenLayers.FVector>; } = {};

        private updateScore = (score: pvMapper.Score) => {
            //Note: I've disabled caching nearby geometries - the geometries returned by this server have thousands of points, so it seemed easier to send new requests each time.

            //if (typeof this.nearestFeatureCache[score.site.id] !== 'undefined') {
            //    // we have a cached copy of our nearby habitats query for this site - let's use that.
            //    this.updateScoreFromCache(score);
            //} else {
            //    // we don't have a cached copy of our nearby habitats - let's request them.
                this.updateScoreFromWeb(score);
            //}
        }

        private updateScoreFromWeb = (score: pvMapper.Score) => {
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
                    outFields: "muname,muhelcl,farmlndcl,DrainageCl", //"muname,muhelcl", //"*", 
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
                    if (response.success() && !(response.data && response.data.error)) {
                        // cache the returned features, then update the score through the cache
                        this.nearestFeatureCache[score.site.id] = response.features || [];
                        this.updateScoreFromCache(score);

                    } else if (response.data && response.data.error) {
                        score.popupMessage = "Error " + ((response.data.error.code && response.data.error.message) ?
                        (response.data.error.code + ": " + response.data.error.message) : response.data.error.toString());
                        score.updateValue(Number.NaN);
                    } else {
                        score.popupMessage = "Unknown error";
                        score.updateValue(Number.NaN);
                    }
                },
            });

            var response: OpenLayers.Response = jsonpProtocol.read();
        }


        private updateScoreFromCache = (score: pvMapper.Score) => {
            var features: OpenLayers.FVector[] = this.nearestFeatureCache[score.site.id];

            var responseArray: string[] = [];

            if (features) {
                for (var i = 0; i < features.length; i++) {
                    //if (score.site.geometry.intersects(features[i].geometry)) {
                        var newText: string = features[i].attributes["muname"] +
                            (features[i].attributes["DrainageCl"] ? ", " + features[i].attributes["DrainageCl"] : "");
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

    pvMapper.moduleManager.registerModule(new INLModules.SoilModule(), true);
}
