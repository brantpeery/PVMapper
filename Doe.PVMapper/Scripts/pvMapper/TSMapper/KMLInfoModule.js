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
    var KMLInfoModule = (function (_super) {
        __extends(KMLInfoModule, _super);
        function KMLInfoModule(kmlRawString, toolName, kmlFileName) {
            var _this = this;
            _super.call(this);
            this.localLayer = null;
            //private landBounds = new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34);
            //============================================================
            //public moduleClass: string = /(\w+)\(/.exec((<any>this).constructor.toString())[1];
            this.sourceDataID = null;
            this.moduleClass = "KMLInfoModule";
            this.category = "Custom";
            this.author = "Leng Vang, INL";
            this.version = "0.1.ts";
            this.readTextFile = function (kmlString, kmlName, kmlFile) {
                var kml_projection = new OpenLayers.Projection("EPSG:4326");
                var map_projection = new OpenLayers.Projection("EPSG:3857");

                var localFormat = new OpenLayers.Format.KML({
                    extractStyles: true,
                    extractAttributes: true,
                    internalProjection: map_projection,
                    externalProjection: kml_projection
                });

                _this.localLayer = _this.localLayer || new OpenLayers.Layer.Vector(kmlName || "KML File", {
                    strategies: OpenLayers.Strategy.Fixed(),
                    style: {
                        fillColor: "darkred", strokeColor: "red", strokeWidth: 5,
                        strokeOpacity: 0.5, pointRadius: 5
                    }
                });

                _this.localLayer.setVisibility(false);
                _this.localLayer.isReferenceLayer = true;
                _this.localLayer.sourceModule = _this;

                var features = localFormat.read(kmlString);
                _this.localLayer.addFeatures(features);

                var isOk = pvMapper.map.addLayer(_this.localLayer);
            };

            this.sourceDataID = kmlFileName;
            this.id = "KmlInfoModule." + this.sourceDataID; // multiple instances of this module will exist... one for each kml file loaded... sigh.

            this.title = toolName + " Module"; // this can change, and uniqueness won't be enforced.
            this.description = "Adds '" + kmlFileName + "' to the map layer list.";

            this.readTextFile(kmlRawString, toolName, kmlFileName);

            this.init({
                activate: function () {
                    if (!_this.localLayer)
                        throw new Error("Error: KML file has been deleted, or was not properly initialized.");
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
                infoTools: [{
                        activate: function () {
                            if (!_this.localLayer)
                                throw new Error("Error: KML file has been deleted, or was not properly initialized.");
                            pvMapper.map.addLayer(_this.localLayer);
                        },
                        deactivate: function () {
                            if (!_this.localLayer)
                                throw new Error("Error: KML file has been deleted, or was not properly initialized.");
                            pvMapper.map.removeLayer(_this.localLayer, false);
                        },
                        id: "KmlInfoTool." + this.sourceDataID,
                        title: toolName,
                        category: this.category,
                        description: this.description,
                        longDescription: null,
                        scoreUtilityOptions: {
                            functionName: "linear3pt",
                            functionArgs: new pvMapper.ThreePointUtilityArgs(0, 1, 100, 0.3, 1000, 0, "mi", "Distance to nearest feature", "Score", "Prefer sites closer to the nearest feature in '" + kmlFileName + "'.")
                        },
                        weight: 10
                    }]
            });
        }
        return KMLInfoModule;
    })(pvMapper.Module);
    INLModules.KMLInfoModule = KMLInfoModule;
})(INLModules || (INLModules = {}));
//# sourceMappingURL=KMLInfoModule.js.map
