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
                    kvpAttributes: true,
                    internalProjection: map_projection,
                    externalProjection: kml_projection
                });

                _this.localLayer = new OpenLayers.Layer.Vector(kmlName || "KML File", {
                    strategies: OpenLayers.Strategy.Fixed()
                });

                _this.localLayer.setVisibility(false);
                _this.localLayer.isReferenceLayer = true;
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

            this.sourceDataID = kmlFileName;
            this.id = "KmlInfoModule." + this.sourceDataID; // multiple instances of this module will exist... one for each kml file loaded... sigh.

            this.title = toolName; // this can change, and uniqueness won't be enforced.
            this.description = "Adds '" + this.title + "' to the map layer list.";

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
                        longDescription: null
                    }]
            });
        }
        return KMLInfoModule;
    })(pvMapper.Module);
    INLModules.KMLInfoModule = KMLInfoModule;
})(INLModules || (INLModules = {}));
//# sourceMappingURL=KMLInfoModule.js.map
