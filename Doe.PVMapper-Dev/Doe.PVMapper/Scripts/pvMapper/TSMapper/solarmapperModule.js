/// <reference path="pvMapper.ts" />
/// <reference path="Site.ts" />
/// <reference path="Score.ts" />
/// <reference path="Tools.ts" />
/// <reference path="Options.d.ts" />
/// <reference path="Module.ts" />
var INLModules;
(function (INLModules) {
    var IrradianceModule = (function () {
        function IrradianceModule() {
            var myModule = new pvMapper.Module({
                id: "SolarmapperModule",
                author: "Scott Brown, INL",
                version: "0.1.ts",
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
                        description: "Checks solarmapper.anl.gov for intersecting land management polygons",
                        onScoreAdded: function (e, score) {
                        },
                        onSiteChange: function (e, score) {
                            identifyFeature(score);
                            //s.updateValue(status.toString());
                                                    },
                        updateScoreCallback: function (score) {
                            //var status = getFeatureInfo(site);
                            identifyFeature(score);
                        }
                    }
                ],
                infoTools: null
            });
        }
        return IrradianceModule;
    })();    
    var modinstance = new IrradianceModule();
    //All private functions and variables go here. They will be accessible only to this module because of the AEAF (Auto-Executing Anonomous Function)
    var solarmapperRestBaseUrl = "http://solarmapper.anl.gov/ArcGIS/rest/services/Solar_Mapper_SDE/MapServer/";
    //declare var Ext: any;
    var mapLayer;
    function addMapLayer() {
        mapLayer = new OpenLayers.Layer.ArcGIS93Rest("Land Management", solarmapperRestBaseUrl + "export", {
            layers: "72",
            format: //"show:2",
            "gif",
            srs: "3857",
            transparent: //"102100",
            "true"
        }, {
            maxExtent: [
                -13850000, 
                3675000, 
                -11350000, 
                5165000
            ]
        });
        mapLayer.setOpacity(0.3);
        mapLayer.epsgOverride = "3857"//"EPSG:102100";
        ;
        mapLayer.setVisibility(false);
        pvMapper.map.addLayer(mapLayer);
        //pvMapper.map.setLayerIndex(mapLayer, 0);
            }
    function removeMapLayer() {
        pvMapper.map.removeLayer(mapLayer, false);
    }
    function identifyFeature(score) {
        // if this site lies outside of our layer's extent, then we can't get a value for it.
        if(!mapLayer.maxExtent.intersectsBounds(score.site.geometry.bounds)) {
            score.popupMessage = "No data for this site";
            score.updateValue(Number.NaN);
            return;// nothin' doin'
            
        }
        var params = {
            mapExtent: score.site.geometry.bounds.toBBOX(6, false),
            geometryType: "esriGeometryEnvelope",
            geometry: score.site.geometry.bounds.toBBOX(6, false),
            f: "json",
            layers: // or "html",
            "72",
            tolerance: //"perezANN_mod", //solar.params.LAYERS,
            0,
            imageDisplay: //TODO: should this be 0 or 1?
            "1, 1, 96"
        };
        var request = OpenLayers.Request.GET({
            url: //url: "/Proxy/proxy.ashx?" + solarmapperRestBaseUrl + "identify",
            solarmapperRestBaseUrl + "identify",
            proxy: "/Proxy/proxy.ashx?",
            params: params,
            callback: //callback: handler,
            function (response) {
                // debug statement
                //alert(score.site.name + ": " + request.responseText.length + " (" + request.status + ")");
                //alert(request.responseText);
                // update value
                if(response.status === 200) {
                    var esriJsonPerser = new OpenLayers.Format.JSON();
                    esriJsonPerser.extractAttributes = true;
                    var parsedResponse = esriJsonPerser.read(response.responseText);
                    if(parsedResponse && parsedResponse.results) {
                        if(parsedResponse.results.length > 0) {
                            var allText = "";
                            var lastText = null;
                            for(var i = 0; i < parsedResponse.results.length; i++) {
                                var newText = parsedResponse.results[i].layerName + ": " + parsedResponse.results[i].value;
                                if(newText != lastText) {
                                    if(lastText != null) {
                                        allText += ", \n";
                                    }
                                    allText += newText;
                                }
                                lastText = newText;
                            }
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
                            score.updateValue(parsedResponse.results.length)// number of overlapping features
                            ;
                        } else {
                            score.popupMessage = "None";
                            score.updateValue(0);
                        }
                    } else {
                        score.popupMessage = "Parse error";
                        score.updateValue(Number.NaN);
                    }
                } else {
                    score.popupMessage = "Connection error " + response.status;
                    score.updateValue(Number.NaN);
                }
            }
        });
    }
    //declare var Ext: any; //So we can use it
    })(INLModules || (INLModules = {}));
//@ sourceMappingURL=solarmapperModule.js.map
