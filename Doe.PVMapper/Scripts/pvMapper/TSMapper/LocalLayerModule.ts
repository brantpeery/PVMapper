
/// <reference path="pvMapper.ts" />
/// <reference path="Site.ts" />
/// <reference path="Score.ts" />
/// <reference path="Tools.ts" />
/// <reference path="Options.d.ts" />
/// <reference path="Module.ts" />



module INLModules {

    export class LocalLayerModule {
        constructor() {
            var myModule: pvMapper.Module = new pvMapper.Module({
                id: "Custom Local Module",
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

                scoringTools: [{
                    activate: null,
                    deactivate: null,
                    destroy: null,
                    init: null,

                    title: "Custom Local Module",
                    description: "Customized user module (local layer)",
                    category: "Custom",
                    //onScoreAdded: (e, score: pvMapper.Score) => {
                    //},
                    onSiteChange: (e, score: pvMapper.Score) => {
                        this.updateScore(score);
                    },

                    getStarRatables: () => {
                        return this.starRatingHelper.starRatings;
                    },

                    scoreUtilityOptions: {
                        functionName: "linear",
                        functionArgs: new pvMapper.MinMaxUtilityArgs(0, 5, "stars")
                    },
                    weight: 10,
                }],

                infoTools: null
            });
        }

        private starRatingHelper: pvMapper.IStarRatingHelper = new pvMapper.StarRatingHelper({
            defaultStarRating: 2,
            noCategoryRating: 4,
            noCategoryLabel: "None"
        });

        private localUrl = "http://dingo.gapanalysisprogram.com/ArcGIS/services/PADUS/PADUS_owner/MapServer/WMSServer";

        private localLayer: OpenLayers.Vector;
        private localFormat: OpenLayers.KML;
        private landBounds = new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34);

        //============================================================
        public readTextFile(blob: Blob) {
            var _this = this;
            var reader = new FileReader();
            reader.readAsText(blob);
            reader.onload = function (evt) {
                _this.localFormat = new OpenLayers.Format.KML({
                    extractStyles: true,               //user KML style
                    extractAttributes: true,           //user KML attributes
                    maxDepth: 2
                });

                _this.localLayer = new OpenLayers.Layer.Vector("KML Custom Layer",
                    {
                        strategies: OpenLayers.Strategy.Fixed()
                    });

                _this.localLayer.addFeatures(_this.localFormat.read(evt.target.result));
                pvMapper.map.addLayer(_this.localLayer);
            }
        }

        //============================================================
        private addMap() {
        }

        private removeMap() {
            pvMapper.map.removeLayer(this.localLayer, false);
        }

        private updateScore(score: pvMapper.Score) {
            var params = {
                mapExtent: score.site.geometry.bounds.toBBOX(6, false),
                geometryType: "esriGeometryEnvelope",
                geometry: score.site.geometry.bounds.toBBOX(6, false),
                f: "json",
                layers: "0",
                tolerance: 0,
                imageDisplay: "1, 1, 96",
                returnGeometry: false,
            };

            //console.log("LandUseModule.ts: " + score.site.geometry.bounds.toBBOX(6, false));

        }

    }

    //var localInstance = new INLModules.LocalLayerModule();

    //=========================================================== 
    // WMS: new (name: string, url: string, params: any, options: any): any;

    //private testing() {

    //    var customLayer = new OpenLayers.Layer.WMS(
    //        "WMS",
    //        "http://vmap0.tiles.osgeo.org/wms/vmap0",
    //        { layers: "basic" }
    //        );

    //    var kmlFormat = new OpenLayers.Format.KML({
    //        extractStyles: true,               //user KML style
    //        extractAttributes: true,           //user KML attributes
    //        maxDepth: 2
    //    });

    //    var kmlObj: string = readTextFile("file:///c:/clientlocalpath/kmllayerfile.kml");
    //    if (kmlObj) {
    //        kmlFormat.read(kmlObj); // deserialize features.
    //        pvMapper.map.addLayer(kmlFormat);
    //    };


    //    // use with protocol ...
    //    var kmlCustomLayer = new OpenLayers.Layer.Vector("KML Layer", {
    //        strategies: [new OpenLayers.Strategy.Fixed()], //load all features at once
    //        protocol: new OpenLayers.Protocol.HTTP({
    //            url: "file:///kml/kmllayer.kml",                  //path to file
    //            format: new OpenLayers.Format.KML({    //use KML parser
    //                extractStyles: true,               //user KML style
    //                extractAttributes: true,           //user KML attributes
    //                maxDepth: 2
    //            })
    //        })
    //    });

    //    pvMapper.map.addLayers([customLayer, kmlCustomLayer]);

    //    //==========================================
    //    // Add the Layer with the GPX Track
    //    var layerGPS = new OpenLayers.Layer.Vector("GPX-Track", {
    //        strategies: [new OpenLayers.Strategy.Fixed()],
    //        protocol: new OpenLayers.Protocol.HTTP({
    //            url: "gpx_uploaded/20130825.gpx",
    //            format: new OpenLayers.Format.GPX()
    //        }),
    //        style: {
    //            fillColor: "darkred", strokeColor: "red", strokeWidth: 5,
    //            strokeOpacity: 0.5, pointRadius: 5
    //        },
    //        projection: new OpenLayers.Projection("EPSG:4326")
    //    });
    //    pvMapper.map.addLayer(layerGPS);

    //}



}
