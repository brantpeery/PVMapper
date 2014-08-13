
/// <reference path="pvMapper.ts" />
/// <reference path="Site.ts" />
/// <reference path="Score.ts" />
/// <reference path="Tools.ts" />
/// <reference path="Module.ts" />



module INLModules {
    export class KMLInfoModule extends pvMapper.Module {
        constructor(kmlRawString: string, toolName: string, kmlFileName: string) {
            super();

            this.sourceDataID = kmlFileName;
            this.id = "KmlInfoModule." + this.sourceDataID; // multiple instances of this module will exist... one for each kml file loaded... sigh.

            this.title = toolName; // this can change, and uniqueness won't be enforced.
            this.description = "Adds '" + this.title + "' to the map layer list.";

            this.readTextFile(kmlRawString, toolName, kmlFileName);

            this.init(<pvMapper.IModuleOptions>{
                activate: () => {
                    if (!this.localLayer)
                        throw new Error("Error: KML file has been deleted, or was not properly initialized.");
                },
                deactivate: () => {
                    //TODO: this isn't undoable, which violates the assumptions we have about pvMapper Modules.
                    pvMapper.ClientDB.deleteCustomKML(this.sourceDataID, (isSuccessful) => {
                        if (this.localLayer) {
                            this.localLayer.destroy();
                            this.localLayer = null;
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
                    activate: () => {
                        if (!this.localLayer)
                            throw new Error("Error: KML file has been deleted, or was not properly initialized.");
                        pvMapper.map.addLayer(this.localLayer);
                    },
                    deactivate: () => {
                        if (!this.localLayer)
                            throw new Error("Error: KML file has been deleted, or was not properly initialized.");
                        pvMapper.map.removeLayer(this.localLayer, false);
                    },

                    id: "KmlInfoTool." + this.sourceDataID,
                    title: toolName,
                    category: this.category,
                    description: this.description,
                    longDescription: null,
                }],                     
            });
        }

        private localLayer: OpenLayers.Vector = null;
        //private landBounds = new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34);

        //============================================================
        //public moduleClass: string = /(\w+)\(/.exec((<any>this).constructor.toString())[1];

        public sourceDataID: string = null;
        public moduleClass = "KMLInfoModule"; //TODO: this is used to serialize and deserialize from browser storage, but it shouldn't be.

        public title: string;
        public category: string = "Custom";
        public description: string;
        public longDescription: string; //TODO: this...?

        public author = "Leng Vang, INL";
        public version = "0.1.ts";

        private readTextFile = (kmlString, kmlName, kmlFile) => {
            var kml_projection = new OpenLayers.Projection("EPSG:4326");
            var map_projection = new OpenLayers.Projection("EPSG:3857");

            var localFormat = new OpenLayers.Format.KML({
                extractStyles: true,               //user KML style
                extractAttributes: true,           //user KML attributes
                kvpAttributes: true,
                internalProjection: map_projection,
                externalProjection: kml_projection,
            });

            this.localLayer = new OpenLayers.Layer.Vector(
                kmlName || "KML File", {
                    strategies: OpenLayers.Strategy.Fixed(),
                });

            this.localLayer.setVisibility(false);
            this.localLayer.isReferenceLayer = true;
            this.localLayer.sourceModule = this;

            var features: OpenLayers.FVector[] = localFormat.read(kmlString);
            this.localLayer.addFeatures(features);

            features.forEach((feature) => {
                var style: any = feature.style;
                if (style.strokeWidth == 0)
                    style.strokeWidth = 1; // ESRI likes to export lines with 0 width. Bad ESRI.
                if (style.externalGraphic && style.externalGraphic.indexOf("//") < 0)
                    delete feature.style; // a local icon, probably stored in the kmz. we don't have it. nothing to be done, I'm afraid...
            });

            if (features.length <= 0) {
                //pvMapper.displayMessage("the file '" + this.sourceDataID + "' was not opened correctly.", "error");
                Ext.MessageBox.alert("Error", "The file '" + this.sourceDataID + "' was not opened correctly.");
                //throw new Error("The file '" + this.sourceDataID + "' was not opened correctly.");
                this.localLayer = null;
            } else {
                var isOk = pvMapper.map.addLayer(this.localLayer);
            }
        }

        //============================================================
    }
}
