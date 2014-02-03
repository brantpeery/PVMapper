
/// <reference path="pvMapper.ts" />
/// <reference path="Site.ts" />
/// <reference path="Score.ts" />
/// <reference path="Tools.ts" />
/// <reference path="Options.d.ts" />
/// <reference path="Module.ts" />



module INLModules {
    export class KMLInfoModule {
        constructor() {
            var myModule: pvMapper.Module = new pvMapper.Module({
                init: () => { },
                destroy: () => { },
                activate: () => {  },
                deactivate: () => {
                    this.removeMap();
                },
                author: "Leng Vang, INL",
                version: "0.1",
                id: "KML_INFO_TOOL",
                scoringTools: null,
                totalTools: null,  
                setModuleName: (name: string) => {
                    this.moduleName = name;
                },
                getModuleName: () => {
                    return this.moduleName;
                },
                infoTools: [{
                    init: () => { },
                    activate: () => { },
                    destroy: () => { },
                    deactivate: () => { },

                    title: "Local Information KML",
                    description: "Custom KML layer for information reference.",
                    longDescription: "<p>Custom KML information module.</p>",
                    category: "Custom",

                    setModuleName: (name: string) => {
                        this.moduleName = name;
                    },
                    getModuleName: () => {
                        return this.moduleName;
                    },
                    getTitle: () => {
                        return this.title;
                    },
                    setTitle: (newTitle: string) => {
                        this.title = newTitle;
                    },

                }],
            });
        }

        private localLayer: OpenLayers.Vector = null;
        private localFormat: OpenLayers.KML = null;
        //private landBounds = new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34);

        public removeLocalLayer() {
            this.localLayer.destroy(); //force to remove from map layer.
        }
        //============================================================
        // blob is the file attribute and file handle.
        public moduleClass: string = /(\w+)\(/.exec((<any>this).constructor.toString())[1];
        public moduleName: string = null;
        public title: string = "Custom Info Tool";
        public readTextFile(kmlString, kmlName, kmlFile) {
            this.moduleName = kmlFile;
            this.title = kmlName;
            var kml_projection = new OpenLayers.Projection("EPSG:4326");
            var map_projection = new OpenLayers.Projection("EPSG:3857");

            this.localFormat = this.localFormat || new OpenLayers.Format.KML({
                extractStyles: true,               //user KML style
                extractAttributes: true,           //user KML attributes
                internalProjection: map_projection,
                externalProjection: kml_projection,
            });

            this.localLayer = this.localLayer || new OpenLayers.Layer.Vector(kmlName || "KML File",
                {
                    strategies: OpenLayers.Strategy.Fixed(),
                    style: {
                        fillColor: "darkred", strokeColor: "red", strokeWidth: 5,
                        strokeOpacity: 0.5, pointRadius: 5
                    }
                });

            this.localLayer.setVisibility(false);
            this.localLayer.isReferenceLayer = true; 
            var feature: OpenLayers.FVector[] = this.localFormat.read(kmlString);
            this.localLayer.addFeatures(feature);
            var isOk = pvMapper.map.addLayer(this.localLayer);
        }

        //============================================================
        private removeMap() {
            pvMapper.map.removeLayer(this.localLayer, false);
        }

    }
}
