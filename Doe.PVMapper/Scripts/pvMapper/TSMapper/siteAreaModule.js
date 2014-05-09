/// <reference path="pvMapper.ts" />
/// <reference path="Site.ts" />
/// <reference path="Score.ts" />
/// <reference path="Tools.ts" />
/// <reference path="Options.d.ts" />
/// <reference path="Module.ts" />
var INLModules;
(function (INLModules) {
    var SiteAreaModule = (function () {
        function SiteAreaModule() {
            var myModule = new pvMapper.Module({
                id: "AreaModule",
                author: "Brant Peery, INL",
                version: "0.3.ts",
                activate: function () {
                },
                deactivate: null,
                destroy: null,
                init: null,
                scoringTools: [{
                        activate: null,
                        deactivate: null,
                        destroy: null,
                        init: null,
                        title: SiteAreaModule.title,
                        category: SiteAreaModule.category,
                        description: SiteAreaModule.description,
                        longDescription: SiteAreaModule.longDescription,
                        onScoreAdded: function (e, score) {
                        },
                        onSiteChange: function (e, score) {
                            //if (console) console.log("Site change detected in tool Gross Area. Updating the value.");
                            var areaInKm2 = calculateSiteArea(score.site);

                            //if (console) console.log("Calulated area of " + area + ". Setting the value on the score");
                            var areaInMi2 = areaInKm2 * 0.386102158542446;
                            var areaInAcre = areaInKm2 * 247.105381467165;

                            score.popupMessage = areaInMi2.toFixed(areaInMi2 > 10 ? 2 : 3) + " sq mi (" + areaInAcre.toFixed(areaInAcre > 100 ? 1 : areaInAcre > 10 ? 2 : 3) + " acres)";
                            score.updateValue(areaInMi2);
                        },
                        //TODO: we have no idea what their ideal size is... we don't even know if more is better or worse. damn.
                        // for now, this is a constant value (always returns the max, why not)
                        scoreUtilityOptions: {
                            functionName: "linear",
                            functionArgs: new pvMapper.MinMaxUtilityArgs(0, 0, "km2", "Total Area", "Score", "Preference of the total area available for a proposed site.", "Minimum gross area to be considered.", "Maximum gross area to be considered.")
                        },
                        weight: 0
                    }],
                infoTools: null
            });
            this.getModuleObj = function () {
                return myModule;
            };
        }
        SiteAreaModule.title = "Gross Area";
        SiteAreaModule.category = "Geography";
        SiteAreaModule.description = "The raw area of a site polygon";
        SiteAreaModule.longDescription = '<p>This tool calculates the raw area of a site polygon in mi<sup>2</sup>.</p>';
        return SiteAreaModule;
    })();
    INLModules.SiteAreaModule = SiteAreaModule;

    //All private functions and variables go here. They will be accessible only to this module because of the AEAF (Auto-Executing Anonomous Function)
    var offsetFeature, setbackLength, setbackLayer;
    setbackLength = 30;

    function calculateArea(geometry) {
        var proj = new OpenLayers.Projection('EPSG:900913');

        var area = geometry.getGeodesicArea(proj);
        var kmArea = area / (1000 * 1000);

        return kmArea;
    }

    //Handles the button click for the buttons for this tool
    function onButtonClicked(event) {
    }
    ;

    function updateSetbackFeature(site, setback) {
        if (!$.isNumeric(setback)) {
            setback = setbackLength;
        }
        var reader = new jsts.io.WKTReader();
        var parser = new jsts.io.OpenLayersParser();

        var input = parser.read(site.feature.geometry);
        var buffer = input.buffer(-1 * setback);
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
    }
    ;

    function calculateSetbackArea(site, setback) {
        if (site.offsetFeature) {
            return calculateArea(site.offsetFeature.geometry);
        }

        return 0;
    }

    function calculateSiteArea(site) {
        //Use the geometry of the OpenLayers feature to get the area
        var val = calculateArea(site.feature.geometry);

        return val;
    }
})(INLModules || (INLModules = {}));

if (typeof (selfUrl) == 'undefined')
    var selfUrl = $('script[src$="siteAreaModule.js"]').attr('src');
if (typeof (isActive) == 'undefined')
    var isActive = true;
pvMapper.moduleManager.registerModule(INLModules.SiteAreaModule.category, INLModules.SiteAreaModule.title, INLModules.SiteAreaModule, isActive, selfUrl);
//# sourceMappingURL=siteAreaModule.js.map
