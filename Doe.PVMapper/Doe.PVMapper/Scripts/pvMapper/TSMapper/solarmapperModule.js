/// <reference path="ScoreUtility.ts" />
/// <reference path="pvMapper.ts" />
/// <reference path="Site.ts" />
/// <reference path="Score.ts" />
/// <reference path="Tools.ts" />
/// <reference path="Options.d.ts" />
/// <reference path="Module.ts" />
/// <reference path="StarRatingHelper.ts" />
var INLModules;
(function (INLModules) {
    var SolarmapperModule = (function () {
        function SolarmapperModule() {
            var myModule = new pvMapper.Module({
                id: "SolarmapperModule",
                author: "Scott Brown, INL",
                version: "0.2.ts",
                activate: function () {
                    addMapLayer();
                },
                deactivate: function () {
                    removeMapLayer();
                },
                destroy: null,
                init: null,
                scoringTools: [
                    {
                        activate: null,
                        deactivate: null,
                        destroy: null,
                        init: null,
                        title: "Land Management",
                        category: "Land Use",
                        description: "Checks solarmapper.anl.gov for intersecting land management polygons",
                        longDescription: '<p>This star rating tool identifies the management agency of any federal land overlapping the proposed site. These agencies are defined in the Surface Management Agency (SMA) dataset. A management agency refers to a Federal agency with administrative jurisdiction over the surface of Federal lands. The SMA feature class currently covers all or the BLM Western State Offices including Alaska. This layer is a dynamic assembly of spatial data layers and Federal land status records maintained at various federal and local government offices. The official Federal land status records of the appropriate surface land managing agency should be consulted concerning ownership details. See the US Department of the Interior, Bureau of Land Management, National Operations Center for more information (www.geocommunicator.gov).</p><p>This tool depends on a user-defined star rating for each SMA found at a site, on a scale of 0-5 stars. The default rating for any SMA is two stars. The default rating for no intersecting SMA is four stars. These ratings should be adjusted by the user.</p><p>When a site overlaps a single SMA, its score is based on the star rating of that SMA (so overlapping a five-star SMA might give a score of 100, while overlapping a one-star SMA may give a score of 20). If a site includes more than one SMA, the lowest star rating is used to calculate its score (so a site with both a one-star and a five-star SMA might have a score of 20). Like every other score tool, these scores ultimately depend on the user-defined utility function.</p>',
                        //onScoreAdded: (e, score: pvMapper.Score) => {
                        //},
                        onSiteChange: function (e, score) {
                            identifyFeature(score);
                            //s.updateValue(status.toString());
                        },
                        getStarRatables: function (mode) {
                            if ((mode !== undefined) && (mode === "default")) {
                                return starRatingHelper.defaultStarRatings;
                            } else {
                                return starRatingHelper.starRatings;
                            }
                        },
                        setStarRatables: function (rateTable) {
                            $.extend(starRatingHelper.starRatings, rateTable);
                        },
                        // for now, no land management agencies is best, any one is bad, and multiple are worse
                        //scoreUtilityOptions: <pvMapper.IThreePointUtilityOptions>{
                        //    functionName: "linear3pt",
                        //    p0: { x: 0, y: 1 },
                        //    p1: { x: 1, y: 0.6 },
                        //    p2: { x: 5, y: 0 },
                        //},
                        //scoreUtilityOptions: {
                        //    functionName: "linear3pt",
                        //    functionArgs: new pvMapper.ThreePointUtilityArgs(0,1,1,0.6,5,0,"NU")
                        //},
                        scoreUtilityOptions: {
                            functionName: "linear",
                            functionArgs: new pvMapper.MinMaxUtilityArgs(0, 5, "stars", "Fed-Land Favor", "Score", "Preference to near by federal land and restrictions.")
                        },
                        weight: 10
                    }
                ],
                infoTools: null
            });
        }
        return SolarmapperModule;
    })();

    var modinstance = new SolarmapperModule();

    //All private functions and variables go here. They will be accessible only to this module because of the AEAF (Auto-Executing Anonomous Function)
    var starRatingHelper = new pvMapper.StarRatingHelper({
        defaultStarRating: 2,
        noCategoryRating: 4,
        noCategoryLabel: "None"
    });

    //TODO: use http://www.geocommunicator.gov/ArcGIS/rest/services/SurfaceManagementAgency/MapServer instead.
    var solarmapperRestBaseUrl = "http://solarmapper.anl.gov/ArcGIS/rest/services/PV_Mapper_SDE/MapServer/";
    var solarmapperWmsUrl = "http://solarmapper.anl.gov/ArcGIS/services/PV_Mapper_SDE/MapServer/WMSServer";

    //declare var Ext: any;
    var mapLayer;

    function addMapLayer() {
        // use WMS for easy-to-get legend graphic
        mapLayer = new OpenLayers.Layer.WMS("Land Management", solarmapperWmsUrl, {
            layers: "1",
            format: "gif",
            srs: "3857",
            transparent: "true"
        }, { isBaseLayer: false });
        mapLayer.setOpacity(0.3);
        mapLayer.epsgOverride = "3857";
        mapLayer.setVisibility(false);
        pvMapper.map.addLayer(mapLayer);
        //pvMapper.map.setLayerIndex(mapLayer, 0);
    }

    function removeMapLayer() {
        pvMapper.map.removeLayer(mapLayer, false);
    }

    // this was added because sometimes the mapLayer is not yet defined before we get a call to update a score.
    // and everyone loves a good race condition
    //var mapLayerBounds = new OpenLayers.Bounds(-13850000, 3675000, -11350000, 5165000);
    function identifyFeature(score) {
        // if this site lies outside of our layer's extent, then we can't get a value for it.
        //if (!mapLayer.maxExtent.intersectsBounds(score.site.geometry.bounds)) {
        //if (!mapLayerBounds.intersectsBounds(score.site.geometry.bounds)) {
        //    score.popupMessage = "No data for this site";
        //    score.updateValue(Number.NaN);
        //    return; // nothin' doin'
        //}
        var params = {
            mapExtent: score.site.geometry.bounds.toBBOX(6, false),
            geometryType: "esriGeometryEnvelope",
            geometry: score.site.geometry.bounds.toBBOX(6, false),
            f: "json",
            layers: "1",
            tolerance: 0,
            imageDisplay: "1, 1, 96"
        };

        var request = OpenLayers.Request.GET({
            //url: "/Proxy/proxy.ashx?" + solarmapperRestBaseUrl + "identify",
            url: solarmapperRestBaseUrl + "identify",
            proxy: "/Proxy/proxy.ashx?",
            params: params,
            //callback: handler,
            callback: function (response) {
                if (response.status === 200) {
                    var esriJsonPerser = new OpenLayers.Format.JSON();
                    esriJsonPerser.extractAttributes = true;
                    var parsedResponse = esriJsonPerser.read(response.responseText);

                    if (parsedResponse && parsedResponse.results) {
                        if (parsedResponse.results.length > 0) {
                            var count = 0;

                            //var responseSet: { [name: string]: bool; } = {};
                            var responseArray = [];

                            for (var i = 0; i < parsedResponse.results.length; i++) {
                                var newText = parsedResponse.results[i].value;
                                var type = parsedResponse.results[i].attributes['Feature Type'];
                                var code = parsedResponse.results[i].attributes['SMA Code'];

                                if (type && type != "Null" && newText.indexOf(type) < 0) {
                                    // if we have a type, and it isn't in the name, then append it
                                    newText += " (" + type + ")";
                                } else if (code && code != "Null" && newText.indexOf(code) < 0) {
                                    // otherwise, if we have a code, and it isn't in the name, then append it
                                    newText += " (" + code + ")";
                                }

                                if (responseArray.indexOf(newText) < 0) {
                                    responseArray.push(newText);
                                }
                            }

                            // sort the array of responses based on star rating (then alphabitically)
                            // format responses in a single line of text
                            var allText = starRatingHelper.sortRatableArray(responseArray);
                            var minStarValue = starRatingHelper.starRatings[responseArray[0]];

                            // display a cute little properties window describing our doodle here.
                            //Note: this works only as well as our windowing scheme, which is to say poorly
                            //Ext.create('MainApp.view.Window', {
                            //    title: parsedResponse.results[0].layerName +
                            //        " - " + parsedResponse.results[0].attributes["Object ID"],
                            //    closeAction: "destroy",
                            //    items: [
                            //        Ext.create('Ext.grid.property.Grid', {
                            //            width: 300,
                            //            startEditing: Ext.emptyFn, //TODO: don't let them edit...
                            //            source: parsedResponse.results[0].attributes,
                            //        }),
                            //    ],
                            //}).show();
                            score.popupMessage = allText;
                            score.updateValue(minStarValue);
                        } else {
                            score.popupMessage = starRatingHelper.options.noCategoryLabel;
                            if (starRatingHelper.starRatings !== undefined) {
                                score.updateValue(starRatingHelper.starRatings[starRatingHelper.options.noCategoryLabel]);
                            }
                        }
                    } else {
                        score.popupMessage = "Parse error";
                        score.updateValue(Number.NaN);
                    }
                } else {
                    score.popupMessage = "Error " + response.status + " " + response.statusText;
                    score.updateValue(Number.NaN);
                }
            }
        });
    }
})(INLModules || (INLModules = {}));
