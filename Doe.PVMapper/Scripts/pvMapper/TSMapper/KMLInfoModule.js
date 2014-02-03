/// <reference path="pvMapper.ts" />
/// <reference path="Site.ts" />
/// <reference path="Score.ts" />
/// <reference path="Tools.ts" />
/// <reference path="Options.d.ts" />
/// <reference path="Module.ts" />
var INLModules;
(function (INLModules) {
    var KMLInfoModule = (function () {
        function KMLInfoModule() {
            var _this = this;
            this.localLayer = null;
            this.localFormat = null;
            //============================================================
            // blob is the file attribute and file handle.
            this.moduleClass = /(\w+)\(/.exec((this).constructor.toString())[1];
            this.moduleName = null;
            this.title = "Custom Info Tool";
            var myModule = new pvMapper.Module({
                init: function () {
                },
                destroy: function () {
                },
                activate: function () {
                },
                deactivate: function () {
                    _this.removeMap();
                },
                author: "Leng Vang, INL",
                version: "0.1",
                id: "KML_INFO_TOOL",
                scoringTools: null,
                totalTools: null,
                setModuleName: function (name) {
                    _this.moduleName = name;
                },
                getModuleName: function () {
                    return _this.moduleName;
                },
                infoTools: [
                    {
                        init: function () {
                        },
                        activate: function () {
                        },
                        destroy: function () {
                        },
                        deactivate: function () {
                        },
                        title: "Local Information KML",
                        description: "Custom KML layer for information reference.",
                        longDescription: "<p>Custom KML information module.</p>",
                        category: "Custom",
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
                        }
                    }
                ]
            });
        }
        //private landBounds = new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34);
        KMLInfoModule.prototype.removeLocalLayer = function () {
            this.localLayer.destroy();
        };

        KMLInfoModule.prototype.readTextFile = function (kmlString, kmlName, kmlFile) {
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
            this.localLayer.isReferenceLayer = true;
            var feature = this.localFormat.read(kmlString);
            this.localLayer.addFeatures(feature);
            var isOk = pvMapper.map.addLayer(this.localLayer);
        };

        //============================================================
        KMLInfoModule.prototype.removeMap = function () {
            pvMapper.map.removeLayer(this.localLayer, false);
        };
        return KMLInfoModule;
    })();
    INLModules.KMLInfoModule = KMLInfoModule;
})(INLModules || (INLModules = {}));
