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
            //private starRatingHelper: pvMapper.IStarRatingHelper = new pvMapper.StarRatingHelper({
            //    defaultStarRating: 2,
            //    noCategoryRating: 4,
            //    noCategoryLabel: "None"
            //});
            //private localUrl = "";
            this.localLayer = null;
            this.localFormat = null;
            //============================================================
            // blob is the file attribute and file handle.
            this.moduleClass = /(\w+)\(/.exec((this).constructor.toString())[1];
            this.moduleName = null;
            this.title = "Custom Distance Tool";
            this.queuedScores = [];
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
                setModuleName: function (name) {
                    _this.moduleName = name;
                },
                getModuleName: function () {
                    return _this.moduleName;
                },
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
                            functionArgs: new pvMapper.ThreePointUtilityArgs(0, 1, 100, 0.3, 10000, 0, "mi", "Distance to nearest feature", "Score", "Prefer sites closer to the nearest feature.")
                        },
                        setModuleName: function (name) {
                            _this.moduleName = name;
                        },
                        getModuleName: function () {
                            return _this.moduleName;
                        },
                        getTitle: function () {
                            return _this.title;
                        },
                        setTitle: function (newTitle) {
                            _this.title = newTitle;
                        },
                        weight: 10
                    }
                ],
                infoTools: null
            });
        }
        //private landBounds = new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34);
        LocalLayerModule.prototype.removeLocalLayer = function () {
            this.localLayer.destroy();
        };

        LocalLayerModule.prototype.readTextFile = function (kmlString, kmlName, kmlFile) {
            this.moduleName = kmlFile;
            this.title = kmlName;
            var kml_projection = new OpenLayers.Projection("EPSG:4326");
            var map_projection = new OpenLayers.Projection("EPSG:3857");

            this.localFormat = this.localFormat || new OpenLayers.Format.KML({
                extractStyles: true,
                extractAttributes: true,
                internalProjection: map_projection,
                externalProjection: kml_projection
            });

            this.localLayer = this.localLayer || new OpenLayers.Layer.Vector(kmlName || "KML File", {
                strategies: OpenLayers.Strategy.Fixed(),
                style: {
                    fillColor: "darkred",
                    strokeColor: "red",
                    strokeWidth: 5,
                    strokeOpacity: 0.5,
                    pointRadius: 5
                }
            });

            this.localLayer.setVisibility(false);
            var feature = this.localFormat.read(kmlString);
            this.localLayer.addFeatures(feature);
            var isOk = pvMapper.map.addLayer(this.localLayer);

            var queuedScore = null;
            while (queuedScore = this.queuedScores.pop()) {
                this.updateScore(queuedScore);
            }
        };

        //============================================================
        LocalLayerModule.prototype.addMap = function () {
        };

        LocalLayerModule.prototype.removeMap = function () {
            pvMapper.map.removeLayer(this.localLayer, false);
        };

        LocalLayerModule.prototype.updateScore = function (score) {
            if (this.localLayer == null) {
                if (this.queuedScores.indexOf(score) < 0)
                    this.queuedScores.push(score);
                return;
            }

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
                var distanceInFt = minDistance * 3.28084;
                var distanceInMi = minDistance * 0.000621371;
                var distanceString = distanceInMi > 10.0 ? distanceInMi.toFixed(1) + " mi" : distanceInMi > 0.5 ? distanceInMi.toFixed(2) + " mi" : distanceInMi.toFixed(2) + " mi (" + distanceInFt.toFixed(0) + " ft)";

                var toNearestString = " to nearest feature";

                var messageString = distanceInFt > 1 ? distanceString + toNearestString + "." : "0 mi" + toNearestString + " (feature is on site).";

                score.popupMessage = messageString;
                score.updateValue(distanceInMi);
            } else {
                score.popupMessage = "No features loaded.";
                score.updateValue(Number.NaN);
            }
        };
        return LocalLayerModule;
    })();
    INLModules.LocalLayerModule = LocalLayerModule;
})(INLModules || (INLModules = {}));
