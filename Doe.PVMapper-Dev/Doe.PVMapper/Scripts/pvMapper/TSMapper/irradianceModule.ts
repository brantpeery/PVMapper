/// <reference path="pvMapper.ts" />
/// <reference path="Site.ts" />
/// <reference path="Score.ts" />
/// <reference path="Tools.ts" />
/// <reference path="Options.d.ts" />
/// <reference path="Module.ts" />

module INLModules {
    class IrradianceModule {
        constructor() {
            var myModule: pvMapper.Module = new pvMapper.Module({
                id: "IrradianceModule",
                author: "Scott Brown, INL",
                version: "0.1.ts",

                activate: () => {
                    addIrradianceMap();
                },
                deactivate: () => {
                    removeIrradianceMap();
                },
                destroy: null,
                init: null,

                scoringTools: [{
                    activate: null,
                    deactivate: null,
                    destroy: null,
                    init: null,

                    title: "Solar Irradiance",
                    description: "Calculates the expected solar irradiance for a site",
                    onScoreAdded: (e, score: pvMapper.Score) => {
                    },
                    onSiteChange: function (e, s) {
                        getFeatureInfo(s);
                        //s.updateValue(status.toString());
                    },
                    updateScoreCallback: (score: pvMapper.Score) => {
                        //var status = getFeatureInfo(site);
                        getFeatureInfo(score);
                    },
                }],

                infoTools: null
            });
        }
    }

    var modinstance = new IrradianceModule();

    //All private functions and variables go here. They will be accessible only to this module because of the AEAF (Auto-Executing Anonomous Function)

    /////////////var irradianceMapUrl = "http://mapsdb.nrel.gov/jw_router/perezANN_mod/tile";
    var irradianceMapUrl = "http://dingo.gapanalysisprogram.com/ArcGIS/services/PADUS/PADUS_owner/MapServer/WMSServer?";

    //declare var Ext: any;

    var solar: any;

    function addIrradianceMap() {
        var solarBounds = new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34);

        solar = new OpenLayers.Layer.WMS(
                "PADUS", //"Solar Radiation",
                irradianceMapUrl,
                {
                    maxExtent: solarBounds,
                    layers: "0", //"perezANN_mod",
                    layer_type: "polygon",
                    transparent: "true",
                    format: "image/gif",
                    exceptions: "application/vnd.ogc.se_inimage",
                    maxResolution: 156543.0339,
                    srs: "EPSG:102113",
                },
                { isBaseLayer: false }
                );
        solar.setOpacity(0.3);
        solar.epsgOverride = "EPSG:102113";
        pvMapper.map.addLayer(solar);
        //pvMapper.map.setLayerIndex(solar, 0);
    }

    function removeIrradianceMap() {
        pvMapper.map.removeLayer(solar, false);
    }

    function getFeatureInfo(score: pvMapper.Score): number { //site: pvMapper.Site
        var params = {
            REQUEST: "GetFeatureInfo",
            EXCEPTIONS: "application/vnd.ogc.se_xml",
            BBOX: score.site.geometry.bounds.toBBOX(6, false),
            SERVICE: "WMS",
            INFO_FORMAT: 'text/html', //"application/vnd.ogc.gml", //"application/json",
            QUERY_LAYERS: "0", //"perezANN_mod", //solar.params.LAYERS,
            FEATURE_COUNT: 50,
            Layers: "0", //"perezANN_mod", //solar.params.LAYERS,
            WIDTH: 1, //site.geometry.bounds.getWidth(),
            HEIGHT: 1, // site.geometry.bounds.getHeight(),
            format: "image/gif",
            //styles: solar.params.STYLES,
            srs: solar.params.SRS,
            VERSION: "1.1.1",
            X: 0,
            Y: 0,
            I: 0,
            J: 0,
        };

        // handle the wms 1.3 vs wms 1.1 madness
        //if (solar.params.VERSION == "1.3.0") {
        //    params.version = "1.3.0";
        //    params.j = parseInt(e.xy.x);
        //    params.i = parseInt(e.xy.y);
        //} else {
        //    params.version = "1.1.1";
        //    params.x = parseInt(e.xy.x);
        //    params.y = parseInt(e.xy.y);
        //}

        // merge filters
        //if (pvMapper.map.layers[0].params.CQL_FILTER != null) {
        //    params.cql_filter = pvMapper.map.layers[0].params.CQL_FILTER;
        //}
        //if (pvMapper.map.layers[0].params.FILTER != null) {
        //    params.filter = pvMapper.map.layers[0].params.FILTER;
        //}
        //if (pvMapper.map.layers[0].params.FEATUREID) {
        //    params.featureid = pvMapper.map.layers[0].params.FEATUREID;
        //}

        var request = OpenLayers.Request.GET({
            //url: "/Proxy/proxy.ashx?" + irradianceMapUrl,
            url: irradianceMapUrl,
            proxy: "/Proxy/proxy.ashx?",
            params: params,
            //callback: handler,
            callback: (request) => {
                // debug statement
                //alert(score.site.name + ": " + request.responseText.length + " (" + request.status + ")");
                alert(request.responseText);

                // update value
                if (request.status === 200) {
                    score.updateValue(request.responseText.length);
                } else {
                    score.updateValue("Connection error " + request.status);
                }
            },
            //async: false,
            //headers: {
            //    "Content-Type": "text/html"
            //},
        });

        return -1;

        //OpenLayers.loadURL(irradianceMapUrl, params, this, setHTML, setHTML);
        //OpenLayers.Event.stop(e);
    }

    function handler(request) {
      if (request.status === 200) {
        alert(request.responseText);
      } else {
        // and of course you can get headers
        alert(request.getAllResponseHeaders());
      }
    }

    //...


    /*

    var offsetFeature, setbackLength, setbackLayer;
    setbackLength = 30;

    function calculateArea(geometry: OpenLayers.Polygon) {


        var proj = new OpenLayers.Projection('EPSG:900913');

        var area = geometry.getGeodesicArea(proj);
        var kmArea = area / 1000000;

        return Math.round(kmArea * 100) / 100;
    }

    //Handles the button click for the buttons for this tool
    function onButtonClicked(event) {
    };



    function updateSetbackFeature(site: pvMapper.Site, setback?: number) {
        if (!$.isNumeric(setback)) {
            setback = setbackLength;
        }
        var reader = new jsts.io.WKTReader();
        var parser = new jsts.io.OpenLayersParser();

        var input = parser.read(site.feature.geometry);
        var buffer = input.buffer(-1 * setback); //Inset the feature
        var newGeometry = parser.write(buffer);

        if (!setbackLayer) {
            setbackLayer = new OpenLayers.Layer.Vector("Site Setback");
            pvMapper.map.addLayer(setbackLayer);
        }

        if (site.offsetFeature) {
            //Redraw the polygon
            setbackLayer.removeFeatures(site.offsetFeature);
            site.offsetFeature.geometry = newGeometry; //This probably won't work
        } else {
            var style = { fillColor: 'blue', fillOpacity: 0, strokeWidth: 3, strokeColor: "purple" };
            site.offsetFeature = new OpenLayers.Feature.Vector(newGeometry, { parentFID: site.feature.fid }, style);
        }
        setbackLayer.addFeatures(site.offsetFeature);



    };

    function calculateSetbackArea(site: pvMapper.Site, setback?: number) {
        if (site.offsetFeature) {
            return calculateArea(site.offsetFeature.geometry);
        }

        return 0;
    }

    function calculateSiteArea(site: pvMapper.Site) {
        //Use the geometry of the OpenLayers feature to get the area
        var val = calculateArea(site.feature.geometry);

        return val;
    }

    */

}