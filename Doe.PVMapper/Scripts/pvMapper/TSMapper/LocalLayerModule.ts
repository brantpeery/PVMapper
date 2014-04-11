
/// <reference path="pvMapper.ts" />
/// <reference path="Site.ts" />
/// <reference path="Score.ts" />
/// <reference path="Tools.ts" />
/// <reference path="Options.d.ts" />
/// <reference path="Module.ts" />



module INLModules {

    export class LocalLayerModule {
        constructor() {
            var myModule: pvMapper.Module = new pvMapper.Module(<pvMapper.IModuleOptions>{ 
                id: "LocalLayerModule",
                author: "Leng Vang, INL",
                version: "0.1.ts",

                activate: () => {
                    this.addMap();
                },
                deactivate: () => {
                    this.removeMap();
                },
                destroy: null,
                init: null,
                setModuleName: (name: string) => {
                    this.moduleName = name;
                },
                getModuleName: () => {
                    return this.moduleName;
                },
                scoringTools: [{
                    activate: null,
                    deactivate: null,
                    destroy: null,
                    init: null,

                    title: "Custom Distance Tool",
                    category: "Custom",
                    description: "Calculates the distance to the nearest feature loaded from a KML file.",
                    longDescription: '<p>Calculates the distance to the nearest feature loaded from a KML file.</p>', //TODO: this...?
                    //onScoreAdded: (e, score: pvMapper.Score) => {
                    //},
                    onSiteChange: (e, score: pvMapper.Score) => {
                        this.updateScore(score);
                    },

                    scoreUtilityOptions: {
                        functionName: "linear3pt",
                        functionArgs: new pvMapper.ThreePointUtilityArgs(0, 1, 100, 0.3, 10000, 0, "km","Nearest Feature","Preference","Preference to nearest feature. A custom tool based on KML file.")
                    },
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
                    weight: 10,
                }],                     

                infoTools: null
            });
        }

        //private starRatingHelper: pvMapper.IStarRatingHelper = new pvMapper.StarRatingHelper({
        //    defaultStarRating: 2,
        //    noCategoryRating: 4,
        //    noCategoryLabel: "None"
        //});

        //private localUrl = "";

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
        public title: string = "Custom Distance Tool";
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
            var feature: OpenLayers.FVector[] = this.localFormat.read(kmlString);
            this.localLayer.addFeatures(feature);
            var isOk = pvMapper.map.addLayer(this.localLayer);

            var queuedScore = null;
            while (queuedScore = this.queuedScores.pop()) {
                this.updateScore(queuedScore);
            }
        }

        //============================================================
        private addMap() {
        }

        private removeMap() {
            pvMapper.map.removeLayer(this.localLayer, false);
        }

        private queuedScores: pvMapper.Score[] = [];

        private updateScore(score: pvMapper.Score) {
            if (this.localLayer == null) {
                if (this.queuedScores.indexOf(score) < 0)
                    this.queuedScores.push(score);
                return; // the feature not yet loaded.
            }

            var closestFeature: OpenLayers.FVector = null;
            var minDistance: number = Number.MAX_VALUE;

            if (this.localLayer.features) {
                for (var i = 0; i < this.localLayer.features.length; i++) {
                    if (this.localLayer.features[i].geometry !== null) {  //don't check non-polygon features.
                        var distance: number = score.site.geometry.distanceTo(this.localLayer.features[i].geometry);
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
        }

    }
}
