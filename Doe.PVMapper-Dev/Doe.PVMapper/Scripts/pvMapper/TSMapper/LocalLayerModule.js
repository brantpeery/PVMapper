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
            this.localUrl = "http://dingo.gapanalysisprogram.com/ArcGIS/services/PADUS/PADUS_owner/MapServer/WMSServer";
            this.landBounds = new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34);
            var myModule = new pvMapper.Module({
                id: "Custom Local Module",
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
                        title: "Custom Local Module",
                        description: "Customized user module (local layer)",
                        category: "Custom",
                        //onScoreAdded: (e, score: pvMapper.Score) => {
                        //},
                        onSiteChange: function (e, score) {
                            _this.updateScore(score);
                        },
                        getStarRatables: function () {
                            return _this.starRatingHelper.starRatings;
                        },
                        scoreUtilityOptions: {
                            functionName: "linear",
                            functionArgs: new pvMapper.MinMaxUtilityArgs(0, 5, "stars")
                        },
                        weight: 10
                    }
                ],
                infoTools: null
            });
        }
        //============================================================
        LocalLayerModule.prototype.readTextFile = function (blob) {
            var _this = this;
            var reader = new FileReader();
            reader.readAsText(blob);
            reader.onload = function (evt) {
                _this.localFormat = new OpenLayers.Format.KML({
                    extractStyles: true,
                    extractAttributes: true,
                    maxDepth: 2
                });

                _this.localLayer = new OpenLayers.Layer.Vector("KML Custom Layer", {
                    strategies: OpenLayers.Strategy.Fixed()
                });

                _this.localLayer.addFeatures(_this.localFormat.read(evt.target.result));
                pvMapper.map.addLayer(_this.localLayer);
            };
        };

        //============================================================
        LocalLayerModule.prototype.addMap = function () {
        };

        LocalLayerModule.prototype.removeMap = function () {
            pvMapper.map.removeLayer(this.localLayer, false);
        };

        LocalLayerModule.prototype.updateScore = function (score) {
            var params = {
                mapExtent: score.site.geometry.bounds.toBBOX(6, false),
                geometryType: "esriGeometryEnvelope",
                geometry: score.site.geometry.bounds.toBBOX(6, false),
                f: "json",
                layers: "0",
                tolerance: 0,
                imageDisplay: "1, 1, 96",
                returnGeometry: false
            };
            //console.log("LandUseModule.ts: " + score.site.geometry.bounds.toBBOX(6, false));
        };
        return LocalLayerModule;
    })();
    INLModules.LocalLayerModule = LocalLayerModule;
})(INLModules || (INLModules = {}));
