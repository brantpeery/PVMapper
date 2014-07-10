/// <reference path="../pvmapper/tsmapper/pvmapper.ts" />
/// <reference path="../pvmapper/tsmapper/site.ts" />
/// <reference path="../pvmapper/tsmapper/score.ts" />
/// <reference path="../pvmapper/tsmapper/tools.ts" />
/// <reference path="../pvmapper/tsmapper/module.ts" />
/// <reference path="../pvmapper/tsmapper/modulemanager.ts" />


module INLModules {
    declare var selfUrl: string; // this should be included dynamically in ModuleManager when it loads this file.
    //TODO: why didn't we use require.js (or similar)? Why roll our own dynamic js loader?

    export class SiteAreaModule extends pvMapper.Module {
        constructor() {
            super();
            this.init({
                activate: null,
                deactivate: null,

                scoringTools: [<pvMapper.IScoreToolOptions>{
                    activate: null,
                    deactivate: null,

                    id: "GrossAreaTool",
                    title: "Gross Area",
                    category: "Geography",
                    description: "The raw area of a site polygon",
                    longDescription: '<p>This tool calculates the raw area of a site polygon in mi<sup>2</sup>.</p>',

                    onScoreAdded: (e, score: pvMapper.Score) => {
                    },
                    onSiteChange: function (e: EventArg, score: pvMapper.Score) {
                        //if (console) console.log("Site change detected in tool Gross Area. Updating the value.");
                        var areaInKm2 = calculateSiteArea(score.site);
                        //if (console) console.log("Calulated area of " + area + ". Setting the value on the score");
                        
                        var areaInMi2 = areaInKm2 * 0.386102158542446 ;
                        var areaInAcre = areaInKm2 * 247.105381467165;

                        score.popupMessage = areaInMi2.toFixed(areaInMi2 > 10 ? 2 : 3) + " sq mi (" +
                            areaInAcre.toFixed(areaInAcre > 100 ? 1 : areaInAcre > 10 ? 2 : 3) + " acres)";
                        score.updateValue(areaInMi2);
                    },
                    
                    //TODO: we have no idea what their ideal size is... we don't even know if more is better or worse. damn.
                    // for now, this is a constant value (always returns the max, why not)
                    scoreUtilityOptions: {
                        functionName: "linear",
                        functionArgs: new pvMapper.MinMaxUtilityArgs(0, 0, "mi2", // <-- This isn't an error - don't "fix" it.
                            "Total Area", "No preference for either smaller or larger sites.",
                            "The minimum gross area to be considered.",
                            "The maximum gross area to be considered.")
                    },
                    weight: 0, //TODO: find a meaningful score & utility for this
                }],
            });
        }

        public id = "AreaModule";
        public author = "Brant Peery, INL";
        public version = "0.3.ts";
        public url = selfUrl; //TODO: why didn't we use require.js (or similar)? Why roll our own dynamic js loader?

        //Add these so ModuleManager can access the tool information for display in the Tool/Module Selector and make it easier to register onto the moduleManager.
        public title: string = "GrossAreaModule";
        public category: string = "Geography";
        public description: string = "The raw area of a site polygon";
    }

    //All private functions and variables go here. They will be accessible only to this module because of the AEAF (Auto-Executing Anonomous Function)
    var offsetFeature, setbackLength, setbackLayer;
    setbackLength = 30;

    function calculateArea(geometry:OpenLayers.Polygon) {

        
        var proj = new OpenLayers.Projection('EPSG:900913');

        var area = geometry.getGeodesicArea(proj);
        var kmArea = area / (1000 * 1000); // m^2 to km^2

        return kmArea;
    }

    //function updateSetbackFeature(site:pvMapper.Site, setback?:number) {
    //    if (!$.isNumeric(setback)) {
    //        setback = setbackLength;
    //    }
    //    var reader = new jsts.io.WKTReader();
    //    var parser = new jsts.io.OpenLayersParser();

    //    var input = parser.read(site.feature.geometry);
    //    var buffer = input.buffer(-1 * setback); //Inset the feature
    //    var newGeometry = parser.write(buffer);

    //    if (!setbackLayer) {
    //        setbackLayer = new OpenLayers.Layer.Vector("Site Setback");
    //        pvMapper.map.addLayer(setbackLayer);
    //    }

    //    if (site.offsetFeature) {
    //        //Redraw the polygon
    //        setbackLayer.removeFeatures(site.offsetFeature);
    //        site.offsetFeature.geometry = newGeometry; //This probably won't work
    //    } else {
    //        var style = { fillColor: 'blue', fillOpacity: 0, strokeWidth: 3, strokeColor: "purple" };
    //        site.offsetFeature = new OpenLayers.Feature.Vector(newGeometry, { parentFID: site.feature.fid }, style);
    //    }
    //    setbackLayer.addFeatures(site.offsetFeature);
    //};

    //function calculateSetbackArea(site:pvMapper.Site, setback?:number) {
    //    if (site.offsetFeature) {
    //        return calculateArea(site.offsetFeature.geometry);
    //    }

    //    return 0;
    //}

    function calculateSiteArea(site:pvMapper.Site) {
        //Use the geometry of the OpenLayers feature to get the area
        var val = calculateArea(site.feature.geometry);

        return val;
    }

    //var modinstance = new SiteAreaModule();
    pvMapper.moduleManager.registerModule(new INLModules.SiteAreaModule(), true);
}
