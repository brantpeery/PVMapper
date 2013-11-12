
/// <reference path="pvMapper.ts" />
/// <reference path="Site.ts" />
/// <reference path="Score.ts" />
/// <reference path="Tools.ts" />
/// <reference path="Options.d.ts" />
/// <reference path="Module.ts" />



module INLModules {

    export class LocalLayerModule {
        constructor() {
            var myModule: pvMapper.Module = new pvMapper.Module({
                id: "Custom Local Module",
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

                    title: "Custom Distance Tool",
                    description: "Calculates the distance to the nearest feature loaded from a KML file.",
                    category: "Custom",
                    //onScoreAdded: (e, score: pvMapper.Score) => {
                    //},
                    onSiteChange: (e, score: pvMapper.Score) => {
                        this.updateScore(score);
                    },

                    scoreUtilityOptions: {
                        functionName: "linear3pt",
                        functionArgs: new pvMapper.ThreePointUtilityArgs(0, 1, 100, 0.3, 10000, 0, "km")
                    },
                    weight: 10,
                }],

                infoTools: null
            });
        }

        private starRatingHelper: pvMapper.IStarRatingHelper = new pvMapper.StarRatingHelper({
            defaultStarRating: 2,
            noCategoryRating: 4,
            noCategoryLabel: "None"
        });

        //private localUrl = "";

        private localLayer: OpenLayers.Vector = null;
        private localFormat: OpenLayers.KML = null;
        //private landBounds = new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34);

        //============================================================
        // blob is the file attribute and file handle.
        private kmlFile = null;
        public readTextFile(blob: Blob) {
            var _this = this;
            var reader = new FileReader();
            this.kmlFile = blob;
            reader.readAsText(blob);
            reader.onload = function (evt) {
                var kml_projection = new OpenLayers.Projection("EPSG:4326");
                var map_projection = new OpenLayers.Projection("EPSG:3857");

                //var osm: OpenLayers.OSM = new OpenLayers.Layer.OSM();

                _this.localFormat = new OpenLayers.Format.KML({
                    extractStyles: true,               //user KML style
                    extractAttributes: true,           //user KML attributes
                    internalProjection: map_projection,
                    externalProjection: kml_projection,
                });

                _this.localLayer = new OpenLayers.Layer.Vector("KML (" + _this.kmlFile.name + ")",
                    {
                        strategies: OpenLayers.Strategy.Fixed(),
                        style: {
                            fillColor: "darkred", strokeColor: "red", strokeWidth: 5,
                            strokeOpacity: 0.5, pointRadius: 5
                        }
                    });
                
                var feature: OpenLayers.FVector[] = _this.localFormat.read(evt.target.result);
                _this.localLayer.addFeatures(feature);
                var isOk = pvMapper.map.addLayer(_this.localLayer);

                if (_this.scoreObj !== null) {
                    _this.updateScore(_this.scoreObj);
                }
            }
        }

        //============================================================
        private addMap() {
        }

        private removeMap() {
            pvMapper.map.removeLayer(this.localLayer, false);
        }

        private scoreObj: pvMapper.Score = null;
        private updateScore(score: pvMapper.Score) {
            this.scoreObj = score;
            if (this.localLayer == null) return; // the feature not yet loaded.
            var closestFeature: OpenLayers.FVector = null;
            var minDistance: number = Number.MAX_VALUE;
                     
            if (this.localLayer.features) {
                for (var i = 0; i < this.localLayer.features.length; i++) {
                    if (this.localLayer.features[i].geometry !== null) {  //don't check non-polygon features.
                        var distance: number = score.site.geometry.distanceTo(this.localLayer.features[i].geometry);
                        if (distance < minDistance) {
                            minDistance = distance;
                            closestFeature = this.localLayer.features[i];
                        }
                    }
                }
            }
            if (closestFeature !== null) {
                score.popupMessage = (minDistance / 1000).toFixed(1) + " km to nearest feature.";
                score.updateValue(minDistance / 1000);
            } else {
                score.popupMessage = "No features loaded.";
                score.updateValue(Number.NaN);
            }
        }

    }

}
