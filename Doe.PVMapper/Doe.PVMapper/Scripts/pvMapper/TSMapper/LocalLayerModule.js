/// <reference path="pvMapper.ts" />
/// <reference path="Site.ts" />
/// <reference path="Score.ts" />
/// <reference path="Tools.ts" />
/// <reference path="Module.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var INLModules;
(function (INLModules) {
    var LocalLayerModule = (function (_super) {
        __extends(LocalLayerModule, _super);
        function LocalLayerModule(kmlRawString, toolName, kmlFileName) {
            var _this = this;
            _super.call(this);
            //private starRatingHelper: pvMapper.IStarRatingHelper = new pvMapper.StarRatingHelper({
            //    defaultStarRating: 2,
            //    noCategoryRating: 4,
            //    noCategoryLabel: "None"
            //});
            //private localUrl = "";
            this.localLayer = null;
            //private landBounds = new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34);
            //============================================================
            //public moduleClass: string = /(\w+)\(/.exec((<any>this).constructor.toString())[1];
            this.sourceDataID = null;
            this.moduleClass = "LocalLayerModule";
            this.category = "Custom";
            this.author = "Leng Vang, INL";
            this.version = "0.1.ts";
            this.readTextFile = function (kmlString, kmlName, kmlFile) {
                var kml_projection = new OpenLayers.Projection("EPSG:4326");
                var map_projection = new OpenLayers.Projection("EPSG:3857");

                var localFormat = new OpenLayers.Format.KML({
                    extractStyles: true,
                    extractAttributes: true,
                    kvpAttributes: true,
                    internalProjection: map_projection,
                    externalProjection: kml_projection
                });

                _this.localLayer = new OpenLayers.Layer.Vector(kmlName || "KML File", {
                    strategies: OpenLayers.Strategy.Fixed()
                });

                _this.localLayer.setVisibility(false);
                _this.localLayer.sourceModule = _this;

                var features = localFormat.read(kmlString);
                _this.localLayer.addFeatures(features);

                features.forEach(function (feature) {
                    var style = feature.style;
                    if (style.strokeWidth == 0)
                        style.strokeWidth = 1; // ESRI likes to export lines with 0 width. Bad ESRI.
                    if (style.externalGraphic && style.externalGraphic.indexOf("//") < 0)
                        delete feature.style; // a local icon, probably stored in the kmz. we don't have it. nothing to be done, I'm afraid...
                });

                if (features.length <= 0) {
                    //pvMapper.displayMessage("the file '" + this.sourceDataID + "' was not opened correctly.", "error");
                    Ext.MessageBox.alert("Error", "The file '" + _this.sourceDataID + "' was not opened correctly.");

                    //throw new Error("The file '" + this.sourceDataID + "' was not opened correctly.");
                    _this.localLayer = null;
                } else {
                    var isOk = pvMapper.map.addLayer(_this.localLayer);
                }
            };
            //============================================================
            this.updateScore = function (score) {
                var closestFeature = null;
                var minDistance = Number.MAX_VALUE;

                if (_this.localLayer.features) {
                    for (var i = 0; i < _this.localLayer.features.length; i++) {
                        if (_this.localLayer.features[i].geometry !== null) {
                            var distance = score.site.geometry.distanceTo(_this.localLayer.features[i].geometry, { edge: false });
                            if (distance < minDistance) {
                                minDistance = distance;
                                closestFeature = _this.localLayer.features[i];
                            }
                        }
                    }
                }
                if (closestFeature !== null) {
                    var distanceInFt = minDistance * 3.28084;
                    var distanceInMi = minDistance * 0.000621371;
                    var distanceString = distanceInMi > 10.0 ? distanceInMi.toFixed(1) + " mi" : distanceInMi > 0.5 ? distanceInMi.toFixed(2) + " mi" : distanceInMi.toFixed(2) + " mi (" + distanceInFt.toFixed(0) + " ft)";

                    var toNearestString = " to the nearest '" + _this.title + "' feature";

                    var messageString = distanceInFt > 1 ? distanceString + toNearestString + "." : "0 mi" + toNearestString + " (a '" + _this.title + "' feature is on site).";

                    score.popupMessage = messageString;
                    score.updateValue(distanceInMi);
                } else {
                    score.popupMessage = "No features loaded.";
                    score.updateValue(Number.NaN);
                }
            };

            this.sourceDataID = kmlFileName;
            this.id = "KmlProximityModule." + this.sourceDataID; // multiple instances of this module will exist... one for each kml file loaded... sigh.

            this.title = toolName; // this can change, and uniqueness won't be enforced.
            this.description = "Calculates the distance to the nearest feature loaded from '" + this.title + "'.";

            this.readTextFile(kmlRawString, toolName, kmlFileName);

            this.init({
                activate: function () {
                    if (!_this.localLayer)
                        throw new Error("Error: KML file '" + _this.sourceDataID + "' has been deleted, or was not properly initialized.");
                },
                deactivate: function () {
                    //TODO: this isn't undoable, which violates the assumptions we have about pvMapper Modules.
                    pvMapper.ClientDB.deleteCustomKML(_this.sourceDataID, function (isSuccessful) {
                        if (_this.localLayer) {
                            _this.localLayer.destroy();
                            _this.localLayer = null;
                        }
                    });
                },
                //setModuleName: (name: string) => {
                //    this.moduleName = name;
                //},
                //getModuleName: () => {
                //    return this.moduleName;
                //},
                scoringTools: [{
                        activate: function () {
                            if (!_this.localLayer)
                                throw new Error("Error: KML file '" + _this.sourceDataID + "' has been deleted, or was not properly initialized.");
                            pvMapper.map.addLayer(_this.localLayer);
                        },
                        deactivate: function () {
                            if (_this.localLayer)
                                pvMapper.map.removeLayer(_this.localLayer, false);
                            else if (console && console.warn)
                                console.warn("Warning: KML file '" + _this.sourceDataID + "' has been deleted, or was not properly initialized.");
                        },
                        id: "KmlProximityTool." + this.sourceDataID,
                        title: toolName,
                        category: this.category,
                        description: this.description,
                        longDescription: null,
                        onSiteChange: function (e, score) {
                            _this.updateScore(score);
                        },
                        scoreUtilityOptions: {
                            functionName: "linear",
                            functionArgs: new pvMapper.MinMaxUtilityArgs(100, 0, "mi", "Distance to nearest feature", "Prefer sites closer to the nearest feature in '" + this.title + "'.")
                        },
                        weight: 10
                    }]
            });
        }
        return LocalLayerModule;
    })(pvMapper.Module);
    INLModules.LocalLayerModule = LocalLayerModule;
})(INLModules || (INLModules = {}));
//# sourceMappingURL=LocalLayerModule.js.map
