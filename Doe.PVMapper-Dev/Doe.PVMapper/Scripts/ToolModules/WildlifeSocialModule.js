/// <reference path="../pvmapper/tsmapper/pvmapper.ts" />
/// <reference path="../pvmapper/tsmapper/site.ts" />
/// <reference path="../pvmapper/tsmapper/score.ts" />
/// <reference path="../pvmapper/tsmapper/tools.ts" />
/// <reference path="../pvmapper/tsmapper/options.d.ts" />
/// <reference path="../pvmapper/tsmapper/module.ts" />
/// <reference path="../pvmapper/tsmapper/starratinghelper.ts" />
/// <reference path="../pvmapper/tsmapper/scoreutility.ts" />
/// <reference path="../pvmapper/tsmapper/modulemanager.ts" />
var INLModules;
(function (INLModules) {
    var surveyResults = [
        { mi: 0, percentOk: 4.329896907 },
        { mi: 0.003787879, percentOk: 4.536082474 },
        { mi: 0.005681818, percentOk: 4.742268041 },
        { mi: 0.018939394, percentOk: 5.360824742 },
        { mi: 0.028409091, percentOk: 5.567010309 },
        { mi: 0.075757576, percentOk: 5.773195876 },
        { mi: 0.09469697, percentOk: 6.18556701 },
        { mi: 0.170454546, percentOk: 6.391752577 },
        { mi: 0.189393939, percentOk: 7.216494845 },
        { mi: 0.227272727, percentOk: 7.422680412 },
        { mi: 0.25, percentOk: 8.24742268 },
        { mi: 0.284090909, percentOk: 8.453608247 },
        { mi: 0.5, percentOk: 10.30927835 },
        { mi: 0.568181818, percentOk: 10.51546392 },
        { mi: 1, percentOk: 20.41237113 },
        { mi: 1.5, percentOk: 20.6185567 },
        { mi: 2, percentOk: 27.42268041 },
        { mi: 3, percentOk: 30.92783505 },
        { mi: 4, percentOk: 32.37113402 },
        { mi: 4.349598346, percentOk: 32.57731959 },
        { mi: 5, percentOk: 47.62886598 },
        { mi: 6, percentOk: 48.24742268 },
        { mi: 7, percentOk: 48.86597938 },
        { mi: 8, percentOk: 51.13402062 },
        { mi: 10, percentOk: 65.56701031 },
        { mi: 12, percentOk: 65.77319588 },
        { mi: 15, percentOk: 69.89690722 },
        { mi: 16, percentOk: 70.10309278 },
        { mi: 18.9, percentOk: 70.30927835 },
        { mi: 20, percentOk: 75.87628866 },
        { mi: 25, percentOk: 79.79381443 },
        { mi: 30, percentOk: 82.4742268 },
        { mi: 35, percentOk: 82.68041237 },
        { mi: 40, percentOk: 83.91752577 },
        { mi: 45, percentOk: 84.12371134 },
        { mi: 50, percentOk: 91.54639175 },
        { mi: 60, percentOk: 92.16494845 },
        { mi: 70, percentOk: 92.78350515 },
        { mi: 75, percentOk: 92.98969072 },
        { mi: 80, percentOk: 93.19587629 },
        { mi: 90, percentOk: 93.60824742 },
        { mi: 100, percentOk: 96.70103093 },
        { mi: 120, percentOk: 96.90721649 },
        { mi: 150, percentOk: 97.31958763 },
        { mi: 200, percentOk: 98.1443299 },
        { mi: 300, percentOk: 98.35051546 },
        { mi: 500, percentOk: 99.17525773 },
        { mi: 1000, percentOk: 99.79381443 },
        { mi: 5000, percentOk: 100 }];

    var configProperties = {
        //maxSearchDistanceInKM: 30,
        maxSearchDistanceInMI: 20
    };

    var myToolLine;

    var propsWindow;

    Ext.onReady(function () {
        var propsGrid = Ext.create('Ext.grid.property.Grid', {
            nameText: 'Properties Grid',
            minWidth: 300,
            //autoHeight: true,
            source: configProperties,
            customRenderers: {
                maxSearchDistanceInMI: function (v) {
                    return v + " mi";
                }
            },
            propertyNames: {
                maxSearchDistanceInMI: "search distance"
            }
        });

        // display a cute little properties window describing our doodle here.
        //Note: this works only as well as our windowing scheme, which is to say poorly
        //var propsWindow = Ext.create('MainApp.view.Window', {
        propsWindow = Ext.create('Ext.window.Window', {
            title: "Configure Wildlife Proximity Tool",
            closeAction: "hide",
            layout: "fit",
            items: [
                propsGrid
            ],
            listeners: {
                beforehide: function () {
                    if (configProperties.maxSearchDistanceInMI > nearestFeatureCache_searchDistanceInMi) {
                        // we've enlarged our search distance - clear the cache and requery each score from the server.
                        nearestFeatureCache = [];
                        myToolLine.scores.forEach(updateScoreFromWeb);
                    } else {
                        // let's just recalculate all scores from our existing cache.
                        myToolLine.scores.forEach(updateScoreFromCache);
                    }
                }
            },
            buttons: [{
                    xtype: 'button',
                    text: 'OK',
                    handler: function () {
                        propsWindow.hide();
                    }
                }],
            constrain: true
        });
    });

    var WildlifeSocialModule = (function () {
        function WildlifeSocialModule() {
            var myModule = new pvMapper.Module({
                id: "WildlifeSocialModule",
                author: "Scott Brown, INL",
                version: "0.1.ts",
                iconURL: "http://www.iconshock.com/img_jpg/MODERN/general/jpg/16/home_icon.jpg",
                activate: function () {
                    addAllMaps();
                },
                deactivate: function () {
                    removeAllMaps();
                },
                destroy: null,
                init: null,
                scoringTools: [{
                        activate: null,
                        deactivate: null,
                        destroy: null,
                        init: null,
                        showConfigWindow: function () {
                            myToolLine = this; // fetch tool line, which was passed as 'this' parameter
                            propsWindow.show();
                        },
                        title: WildlifeSocialModule.title,
                        category: WildlifeSocialModule.category,
                        description: WildlifeSocialModule.description,
                        longDescription: WildlifeSocialModule.longDescription,
                        //onScoreAdded: function (e, score: pvMapper.Score) {
                        //    scores.push(score);
                        //},
                        onSiteChange: function (e, score) {
                            updateScore(score);
                        },
                        // having any nearby line is much better than having no nearby line, so let's reflect that.
                        scoreUtilityOptions: {
                            functionName: "linear3pt",
                            functionArgs: new pvMapper.ThreePointUtilityArgs(0, 0.4, 30, 0.8, 100, 1, "% in favor", "Percent Habitat Favor", "Score", "Preference of proximity to wildlife habitat restrictions.")
                        },
                        weight: 10
                    }],
                infoTools: null
            });
            this.getModuleObj = function () {
                return myModule;
            };
        }
        WildlifeSocialModule.title = "Wildlife Proximity";
        WildlifeSocialModule.category = "Social Acceptance";
        WildlifeSocialModule.description = "Percentage of survey respondents who reported this distance from sensitive wildlife habitat as acceptable";
        WildlifeSocialModule.longDescription = '<p>This tool calculates the distance from a site to the nearest critical wildlife habitat, and then reports the percentage of survey respondents who said that distance would be an acceptable buffer between a large solar facility and a wildlife breeding ground or nesting site.</p><p>The survey used in this tool was administered by the PVMapper project in 2013. From this survey, 484 respondents from six counties in Southern California answered Question 18 which asked "How much buffer distance is acceptable between a large solar facility and an area used as nesting sites or breeding grounds by wildlife?" For full details, see "PVMapper: Report on the Second Public Opinion Survey" (INL/EXT-13-30706).</p><p>The nearest wildlife area is identified using the Critical Habitat Portal by the US Fish and Wildlife Service. Note that several issues with this. First, the FWS dataset includes habitat which are not breeding or nesting grounds. Second, it only includes data on critical and endangered species, while the survey question was not so limited. And third, the data portal does not include habitat for all critical and endangered species. See the FWS website for more information (ecos.fws.gov/crithab).</p><p>Due to these limitations, results from this tool should be considered preliminary and approximate.</p>';
        return WildlifeSocialModule;
    })();
    INLModules.WildlifeSocialModule = WildlifeSocialModule;

    //All private functions and variables go here. They will be accessible only to this module because of the AEAF (Auto-Executing Anonomous Function)
    var fwsExportUrl = "https://ecos.fws.gov/arcgis/rest/services/crithab/usfwsCriticalHabitat/MapServer/export";
    var fwsQueryUrl = "https://ecos.fws.gov/arcgis/rest/services/crithab/usfwsCriticalHabitat/MapServer/2/query";

    //declare var Ext: any;
    var mapLayer;
    var WildlifeMetaData = Ext.htmlEncode("Title: Soil Survey Map<br>Author: ESRI<br>Subject: natural resources<br>Keywords: soil,US Department of Agriculture,USDA,Natural Resources Conservation Service,NRCS,National,Federal,USA<br>AntialiasingMode: None<br>TextAntialiasingMode: Force<br>Format: PNG8<br><br>Min Scale: 5.91657527591555E8<br>Max Scale: 9027.977411<br><br>Service Description: USDA/NRCS SSURGO: This layer shows the Soil Survey Geographic (SSURGO) by the United States Department of Agriculture’s Natural Resources Conservation Service. SSURGO digitizing duplicates the original soil survey maps. This level of mapping is designed for use by landowners, townships, and county natural resource planning and management. The user should be knowledgeable of soils data and their characteristics. The soil units are symbolized by Esri to show the dominant condition for the 12 soil orders according to Soil Taxonomy. Dominant condition was determined by evaluating each of the components in a map unit; the percentage of the component that each soil order represented was accumulated for all the soil orders present in the map unit. The soil order with the highest accumulated percentage is then characterized as the dominant condition for that unit. If a tie was found between soil orders, a “tie-break” rule was applied. The tie-break was based on the component’s “slope_r” attribute value, which represents the Slope Gradient – Representative Value. The slope_r values were accumulated in the same fashion as the soil order attributes, i.e., by soil order, and the order with the lowest slope_r value was selected as dominant because that represented the lower slope value, and therefore we assumed the soils were more likely to be staying in that area or being deposited in that area. USDA/NRCS STATSGO This layer shows the U.S. General Soil Map of general soil association units by the United States Department of Agriculture’s Natural Resources Conservation Service. It was developed by the National Cooperative Soil Survey and supersedes the State Soil Geographic (STATSGO) dataset published in 1994. It consists of a broad-based inventory of soils and non-soil areas that occur in a repeatable pattern on the landscape and that can be cartographically shown at the scale mapped. The soil units are symbolized by Esri to show the dominant condition for the 12 soil orders according to Soil Taxonomy. Dominant condition was determined by evaluating each of the components in a map unit; the percentage of the component that each soil order represented was accumulated for all the soil orders present in the map unit. The soil order with the highest accumulated percentage is then characterized as the dominant condition for that unit. If a tie was found between soil orders, a “tie-break” rule was applied. The tie-break was based on the component’s “slope_r” attribute value, which represents the Slope Gradient – Representative Value. The slope_r values were accumulated in the same fashion as the soil order attributes, i.e., by soil order, and the order with the lowest slope_r value was selected as dominant because that represented the lower slope value, and therefore we assumed the soils were more likely to be staying in that area or being deposited in that area. USDA/NRCS GLOBAL SOIL REGIONS This layer shows the Global Soil Regions map by the United States Department of Agriculture’s Natural Resources Conservation Service. The data and symbology are based on a reclassification of the FAO-UNESCO Soil Map of the World combined with a soil climate map. The soils data is symbolized to show the distribution of the 12 soil orders according to Soil Taxonomy. For more information on this map, including the terms of use, visit us online.");

    function addAllMaps() {
        mapLayer = new OpenLayers.Layer.ArcGIS93Rest("<img class=\"on_c_img\" mdata=\"" + WildlifeMetaData +"\" src='http://www.iconsdb.com/icons/preview/tropical-blue/info-xxl.png' style='width:20px; height:20px'> " + "Sensitive Wildlife Habitat", fwsExportUrl, {
            layers: "show:2",
            format: "gif",
            srs: "4326",
            transparent: "true"
        });
        mapLayer.setOpacity(0.3);

        //mapLayer.epsgOverride = "3857"; //"EPSG:102100";
        mapLayer.setVisibility(false);

        pvMapper.map.addLayer(mapLayer);
        //pvMapper.map.setLayerIndex(mapLayer, 0);
    }

    function removeAllMaps() {
        pvMapper.map.removeLayer(mapLayer, false);
    }

    // cache for features we've found from which we can find a nearest feature.
    var nearestFeatureCache = [];

    // the smallest search distance used to populate any set of features in the feature cache
    // if we change our search distance to something larger than this, we'll need to requery the server.
    var nearestFeatureCache_searchDistanceInMi = configProperties.maxSearchDistanceInMI;

    function updateScore(score) {
        if (typeof nearestFeatureCache[score.site.id] !== 'undefined') {
            // we have a cached copy of our nearby habitats query for this site - let's use that.
            updateScoreFromCache(score);
        } else {
            // we don't have a cached copy of our nearby habitats - let's request them.
            updateScoreFromWeb(score);
        }
    }

    function updateScoreFromWeb(score) {
        var maxSearchDistanceInKM = configProperties.maxSearchDistanceInMI * 1.60934;
        var maxSearchDistanceInMeters = maxSearchDistanceInKM * 1000;

        // use a genuine JSONP request, rather than a plain old GET request routed through the proxy.
        var jsonpProtocol = new OpenLayers.Protocol.Script({
            url: fwsQueryUrl,
            params: {
                f: "json",
                maxAllowableOffset: 20,
                outFields: "comname,status,type",
                geometryType: "esriGeometryEnvelope",
                geometry: new OpenLayers.Bounds(score.site.geometry.bounds.left - maxSearchDistanceInMeters - 1000, score.site.geometry.bounds.bottom - maxSearchDistanceInMeters - 1000, score.site.geometry.bounds.right + maxSearchDistanceInMeters + 1000, score.site.geometry.bounds.top + maxSearchDistanceInMeters + 1000).toBBOX(0, false),
                inSR: "3857",
                outSR: "3857"
            },
            format: new OpenLayers.Format.EsriGeoJSON(),
            parseFeatures: function (data) {
                if (data.error)
                    return null;
                return this.format.read(data);
            },
            callback: function (response) {
                if (response.success()) {
                    // cache the returned features, then update the score through the cache
                    nearestFeatureCache[score.site.id] = response.features || [];
                    nearestFeatureCache_searchDistanceInMi = configProperties.maxSearchDistanceInMI;
                    updateScoreFromCache(score);
                } else if (response.data.error) {
                    score.popupMessage = "Server error " + response.data.error.toString();
                    score.updateValue(Number.NaN);
                } else {
                    score.popupMessage = "Request error " + response.error.toString();
                    score.updateValue(Number.NaN);
                }
            }
        });

        var response = jsonpProtocol.read();
    }

    function updateScoreFromCache(score) {
        var features = nearestFeatureCache[score.site.id];

        var maxSearchDistanceInKM = configProperties.maxSearchDistanceInMI * 1.60934;
        var maxSearchDistanceInMeters = maxSearchDistanceInKM * 1000;

        var closestFeature = null;
        var minDistance = maxSearchDistanceInMeters;

        if (features) {
            for (var i = 0; i < features.length; i++) {
                var distance = score.site.geometry.distanceTo(features[i].geometry);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestFeature = features[i];
                }
            }
        }

        //"Power_Plant,Owner,Plant_Operator,Operating_Capacity_MW"
        if (closestFeature !== null) {
            var minDistanceInMi = minDistance * 0.000621371;

            var percentOk = 0;
            var distanceOk = 5000;
            for (var i = surveyResults.length - 1; i--; i >= 0) {
                if (minDistanceInMi >= surveyResults[i].mi) {
                    percentOk = surveyResults[i].percentOk;
                    distanceOk = surveyResults[i].mi;
                    break;
                }
            }

            var distanceOkStr = (distanceOk < 1) ? distanceOk.toFixed(2) : (distanceOk < 10) ? distanceOk.toFixed(1) : distanceOk.toFixed(0);

            var minDistanceStr = (minDistanceInMi < 1) ? minDistanceInMi.toFixed(2) : (minDistanceInMi < 10) ? minDistanceInMi.toFixed(1) : minDistanceInMi.toFixed(0);

            //var nearestPlantStr: string =
            //    " (The nearest plant is ";
            //if (closestFeature.attributes.Power_Plant)
            //    nearestPlantStr += closestFeature.attributes.Power_Plant + ", ";
            //if (closestFeature.attributes.Operating_Capacity_MW)
            //    nearestPlantStr += "a " + closestFeature.attributes.Operating_Capacity_MW + " MW plant ";
            //if (closestFeature.attributes.Plant_Operator)
            //    nearestPlantStr += "operated by " + closestFeature.attributes.Plant_Operator + ", ";
            //else if (closestFeature.attributes.Owner)
            //    nearestPlantStr += "owned by " + closestFeature.attributes.Owner + ", ";
            //nearestPlantStr += minDistanceStr + " mi away.)";
            var nearestPlantStr = closestFeature.attributes.comname ? " (The nearest habitat, for the " + closestFeature.attributes.comname + ", is " + minDistanceStr + " mi away" : " (The nearest habitat is " + minDistanceStr + " mi away";

            score.popupMessage = percentOk.toFixed(1) + "% of respondents reported they would accept a site built " + distanceOkStr + " mi or more from sensitive wildlife habitat." + nearestPlantStr;

            score.updateValue(percentOk);
        } else {
            // no existing habitat found nearby
            // use the % acceptance for our current max search distance
            var percentOk = 0;
            var distanceOk = 5000;
            var minDistanceInMi = configProperties.maxSearchDistanceInMI;

            for (var i = surveyResults.length - 1; i--; i >= 0) {
                if (minDistanceInMi >= surveyResults[i].mi) {
                    percentOk = surveyResults[i].percentOk;
                    distanceOk = surveyResults[i].mi;
                    break;
                }
            }

            var distanceOkStr = (distanceOk < 1) ? distanceOk.toFixed(2) : (distanceOk < 10) ? distanceOk.toFixed(1) : distanceOk.toFixed(0);

            var minDistanceStr = (minDistanceInMi < 1) ? minDistanceInMi.toFixed(2) : (minDistanceInMi < 10) ? minDistanceInMi.toFixed(1) : minDistanceInMi.toFixed(0);

            score.popupMessage = percentOk.toFixed(1) + "% of respondents reported they would accept a site built " + distanceOkStr + " mi or more from sensitive wildlife habitat. (There was no existing habitat found within the " + configProperties.maxSearchDistanceInMI + " mi search distance.)";

            score.updateValue(percentOk);
        }
    }
})(INLModules || (INLModules = {}));

//var modinstance = new INLModules.WildlifeSocialModule();
if (typeof (selfUrl) == 'undefined')
    var selfUrl = $('script[src$="WildlifeSocialModule.js"]').attr('src');
if (typeof (isActive) == 'undefined')
    var isActive = true;
pvMapper.moduleManager.registerModule(INLModules.WildlifeSocialModule.category, INLModules.WildlifeSocialModule.title, INLModules.WildlifeSocialModule, isActive, selfUrl);
//# sourceMappingURL=WildlifeSocialModule.js.map
