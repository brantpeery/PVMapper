/// <reference path="pvMapper.ts" />
/// <reference path="Site.ts" />
/// <reference path="Score.ts" />
/// <reference path="Tools.ts" />
/// <reference path="Options.d.ts" />
/// <reference path="Module.ts" />
var INLModules;
(function (INLModules) {
    var LocalLayerModule = (function () {
        function LocalLayerModule() {
            var _this = this;
            this.starRatingHelper = new pvMapper.StarRatingHelper({
                defaultStarRating: 2,
                noCategoryRating: 4,
                noCategoryLabel: "None"
            });
            //private localUrl = "";
            this.localLayer = null;
            this.localFormat = null;
            //private landBounds = new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34);
            //============================================================
            // blob is the file attribute and file handle.
            this.kmlFile = null;
            this.scoreObj = null;
            var myModule = new pvMapper.Module({
                id: "LocalLayerModule",
                author: "Leng Vang, INL",
                version: "0.1.ts",
                activate: function () {
                    _this.addMap();
                },
                deactivate: function () {
                    _this.removeMap();
                },
                destroy: null,
                init: null,
                scoringTools: [
                    {
                        activate: null,
                        deactivate: null,
                        destroy: null,
                        init: null,
                        title: "Custom Distance Tool",
                        category: "Custom",
                        description: "Calculates the distance to the nearest feature loaded from a KML file.",
                        longDescription: '<p>Calculates the distance to the nearest feature loaded from a KML file.</p>',
                        //onScoreAdded: (e, score: pvMapper.Score) => {
                        //},
                        onSiteChange: function (e, score) {
                            _this.updateScore(score);
                        },
                        scoreUtilityOptions: {
                            functionName: "linear3pt",
                            functionArgs: new pvMapper.ThreePointUtilityArgs(0, 1, 100, 0.3, 10000, 0, "km")
                        },
                        weight: 10
                    }
                ],
                infoTools: null
            });
        }
        LocalLayerModule.prototype.readTextFile = function (blob) {
            var _this = this;
            var reader = new FileReader();
            this.kmlFile = blob;
            reader.readAsText(blob);
            reader.onload = function (evt) {
                var kml_projection = new OpenLayers.Projection("EPSG:4326");
                var map_projection = new OpenLayers.Projection("EPSG:3857");

                //var osm: OpenLayers.OSM = new OpenLayers.Layer.OSM();
                _this.localFormat = new OpenLayers.Format.KML({
                    extractStyles: true,
                    extractAttributes: true,
                    internalProjection: map_projection,
                    externalProjection: kml_projection
                });

                _this.localLayer = new OpenLayers.Layer.Vector("KML (" + _this.kmlFile.name + ")", {
                    strategies: OpenLayers.Strategy.Fixed(),
                    style: {
                        fillColor: "darkred",
                        strokeColor: "red",
                        strokeWidth: 5,
                        strokeOpacity: 0.5,
                        pointRadius: 5
                    }
                });

                var feature = _this.localFormat.read(evt.target.result);
                _this.localLayer.addFeatures(feature);
                var isOk = pvMapper.map.addLayer(_this.localLayer);

                if (_this.scoreObj !== null) {
                    _this.updateScore(_this.scoreObj);
                }
            };
        };

        //============================================================
        LocalLayerModule.prototype.addMap = function () {
        };

        LocalLayerModule.prototype.removeMap = function () {
            pvMapper.map.removeLayer(this.localLayer, false);
        };

        LocalLayerModule.prototype.updateScore = function (score) {
            this.scoreObj = score;
            if (this.localLayer == null)
                return;
            var closestFeature = null;
            var minDistance = Number.MAX_VALUE;

            if (this.localLayer.features) {
                for (var i = 0; i < this.localLayer.features.length; i++) {
                    if (this.localLayer.features[i].geometry !== null) {
                        var distance = score.site.geometry.distanceTo(this.localLayer.features[i].geometry);
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
        };
        return LocalLayerModule;
    })();
    INLModules.LocalLayerModule = LocalLayerModule;
})(INLModules || (INLModules = {}));
