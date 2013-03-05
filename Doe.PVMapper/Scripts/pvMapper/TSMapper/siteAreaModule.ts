/// <reference path="pvMapper.ts" />
/// <reference path="Site.ts" />
/// <reference path="Score.ts" />
/// <reference path="Tools.ts" />
/// <reference path="Options.d.ts" />
/// <reference path="Module.ts" />

module INLModules {
    class SiteAreaModule {
        constructor() {
            var myModule: pvMapper.Module = new pvMapper.Module({
                id: "AreaModule",
                author: "Brant Peery, INL",
                version: "0.3.ts",

                activate: () => { },
                deactivate: null,
                destroy: null,
                init: null,

                scoringTools: [{
                    activate: null,
                    deactivate: null,
                    destroy: null,
                    init: null,

                    title: "Gross Area",
                    description:"Calculates the area of the site polygon edges.",
                    onScoreAdded: (e, score: pvMapper.Score) => {
                    },
                    onSiteChange: function (e, score: pvMapper.Score) {
                        console.log("Site change detected in tool Gross Area. Updating the value.");
                        var area = calculateSiteArea(score.site);
                        console.log("Calulated area of " + area + ". Setting the value on the score");
                        
                        score.popupMessage = area.toFixed(3);
                        score.updateValue(area);
                    },
                    updateScoreCallback: (score: pvMapper.Score) => {
                        var area = calculateSiteArea(score.site);
                        console.log("Calulated area of " + area + " Returning value");

                        score.popupMessage = area.toFixed(3);
                        score.updateValue(area);
                    },
                    
                }],
                infoTools: null
            });
        }
    }

    var modinstance = new SiteAreaModule();

     //All private functions and variables go here. They will be accessible only to this module because of the AEAF (Auto-Executing Anonomous Function)
    var offsetFeature, setbackLength, setbackLayer;
    setbackLength = 30;

    function calculateArea(geometry:OpenLayers.Polygon) {

        
        var proj = new OpenLayers.Projection('EPSG:900913');

        var area = geometry.getGeodesicArea(proj);
        var kmArea = area / 1000000;

        return Math.round(kmArea * 100) / 100;
    }

    //Handles the button click for the buttons for this tool
    function onButtonClicked(event) {
    };



    function updateSetbackFeature(site:pvMapper.Site, setback?:number) {
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

    function calculateSetbackArea(site:pvMapper.Site, setback?:number) {
        if (site.offsetFeature) {
            return calculateArea(site.offsetFeature.geometry);
        }

        return 0;
    }

    function calculateSiteArea(site:pvMapper.Site) {
        //Use the geometry of the OpenLayers feature to get the area
        var val = calculateArea(site.feature.geometry);

        return val;
    }

}