
/// <reference path="pvMapper.ts" />
/// <reference path="Site.ts" />
/// <reference path="Score.ts" />
/// <reference path="Tools.ts" />
/// <reference path="Module.ts" />



module INLModules {
    export class LocalLayerModule extends pvMapper.Module {
        constructor(kmlRawString: string, toolName: string, kmlFileName: string) {
            super();

            this.sourceDataID = kmlFileName;
            this.id = "KmlProximityModule." + this.sourceDataID; // multiple instances of this module will exist... one for each kml file loaded... sigh.

            this.title = toolName; // this can change, and uniqueness won't be enforced.
            this.description = "Calculates the distance to the nearest feature loaded from '" + this.title + "'.";

            this.readTextFile(kmlRawString, toolName, kmlFileName);

            this.init(<pvMapper.IModuleOptions>{
                activate: () => {
                    if (!this.localLayer)
                        throw new Error("Error: KML file '" + this.sourceDataID + "' has been deleted, or was not properly initialized.");
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
                scoringTools: [{
                    activate: () => {
                        if (!this.localLayer)
                            throw new Error("Error: KML file '" + this.sourceDataID + "' has been deleted, or was not properly initialized.");
                        pvMapper.map.addLayer(this.localLayer);
                    },
                    deactivate: () => {
                        if (this.localLayer)
                            pvMapper.map.removeLayer(this.localLayer, false);
                        else
                            if (console && console.warn) console.warn("Warning: KML file '" + this.sourceDataID + "' has been deleted, or was not properly initialized.");
                    },

                    id: "KmlProximityTool." + this.sourceDataID,
                    title: toolName,
                    category: this.category,
                    description: this.description,
                    longDescription: null,

                    onSiteChange: (e, score: pvMapper.Score) => {
                        this.updateScore(score);
                    },

                    scoreUtilityOptions: {
                        functionName: "linear",
                        functionArgs: new pvMapper.MinMaxUtilityArgs(100, 0, "mi", "Distance to nearest feature", "Prefer sites closer to the nearest feature in '" + this.title + "'.")
                    },
                    weight: 10,
                }],                     
            });
        }

        //private starRatingHelper: pvMapper.IStarRatingHelper = new pvMapper.StarRatingHelper({
        //    defaultStarRating: 2,
        //    noCategoryRating: 4,
        //    noCategoryLabel: "None"
        //});

        //private localUrl = "";

        private localLayer: OpenLayers.Vector = null;
        //private landBounds = new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34);

        //============================================================
        //public moduleClass: string = /(\w+)\(/.exec((<any>this).constructor.toString())[1];

        public sourceDataID: string = null;
        public moduleClass = "LocalLayerModule"; //TODO: this is used to serialize and deserialize from browser storage, but it shouldn't be.

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

        private updateScore = (score: pvMapper.Score) => {
            var closestFeature: OpenLayers.FVector = null;
            var minDistance: number = Number.MAX_VALUE;

            if (this.localLayer.features) {
                for (var i = 0; i < this.localLayer.features.length; i++) {
                    if (this.localLayer.features[i].geometry !== null) {  //don't check non-polygon features.
                        var distance: number = score.site.geometry.distanceTo(this.localLayer.features[i].geometry, { edge: false });
                        if (distance < minDistance) {
                            minDistance = distance;
                            closestFeature = this.localLayer.features[i];
                        }
                    }
                }
            }
            if (closestFeature !== null) {
                var distanceInFt = minDistance * 3.28084; // convert meters to feet
                var distanceInMi = minDistance * 0.000621371; // convert meters to miles
                var distanceString = distanceInMi > 10.0 ? distanceInMi.toFixed(1) + " mi" :
                    distanceInMi > 0.5 ? distanceInMi.toFixed(2) + " mi" :
                    distanceInMi.toFixed(2) + " mi (" + distanceInFt.toFixed(0) + " ft)";

                var toNearestString = " to the nearest '" + this.title + "' feature";

                var messageString = distanceInFt > 1 ? distanceString + toNearestString + "." :
                    "0 mi" + toNearestString + " (a '" + this.title + "' feature is on site).";

                score.popupMessage = messageString;
                score.updateValue(distanceInMi);
            } else {
                score.popupMessage = "No features loaded.";
                score.updateValue(Number.NaN);
            }
        }
    }
}
