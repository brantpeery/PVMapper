///// <reference path="../pvMapper/Module.js" />
///// <reference path="../_references.js" />

////Tool that uses the pvMapper event pipeline to know when to update it's score. 
////Create the scoreline
////Attach to the sitechange event for the line
////When the sites changes, the updateSiteScore function will be called with the score object that needs updated and the context set to the scoreBoardLineItem that the tool manages
////Note that the tool will have access to the actual site.feature through the score object
////The updateSiteScore function will recalculate the site based on the geometry in the feature property of the site. 
////The updatedSiteScore function will then ask the line to update the score information that is displayed for the site
////ALTERNATE?? What if the above line happend automatically because the function fired a scoreUpdatedEvent(score) 
////If this were a complicated tool, then the tool would save the value to a database for later retrieval or cache it somehow. Howevever, 
////the tool can always recalculate the value quickly, so it will assume that the scoreboard is caching what is nessassary.
////As always, the scoreboard will be responsible for writing the values to it's own datastorage

//(function (pvM) {
//    pvM.onReady(function () { //use only for direct page insertion for testing module
//        console.log("Loading in site area module");
//        var me = new pvM.Module({
//            self: this,
//            id: "doe.siteAreaModule", //This will come in handy if we want to make these tools singletons
//            author: "",
//            version: "",

//            nonScoringTools: {}, //Tools that are for user convenience. Things like measuring tools, information tools, drawing tools, ...
//            scoringTools: { //These objects are turned into scoreLines. The tools use the site changed event to update the scores for all of the sites
//                siteArea: {
//                    title: "Site Gross Area (km2)",
//                    description: "Calculates the gross area of the site in quare kilometers.",
//                    calculateValueCallback: calculateSiteArea,
//                    onSiteChange: function (event, score) { //Fires when a score has been notified that it's site has changed

//                        //Update the property (only do this if this is a very fast calculation)
//                        score.updateValue(calculateSiteArea(score.site)); //Do it this way so the score can manage getting itself refreshed on the screen and in the DB
//                    },
//                    onScoreAdded: function (event, score) { //This will be called when a score is added to the scoreline that represents this tool
//                        //Really don't need to do anything here as the framework will be asking for the updated value later
//                    }
//                },
//                innerBoundry: { //This tool calculates the setback area and draws the setback polygon on the site
//                    title: "Site Net Area (km2)",
//                    description: "Calculates the net area of the site subtracting the setback (sqkm).",
//                    calculateValueCallback: calculateSetbackArea,
//                    onSiteChange: function (event, score) {
//                        //Update the offset feature, redraw it correctly, and then recalculate the area for it
//                        updateSetbackFeature(score.site);

//                        //Update the property (only do this if this is a very fast calculation)
//                        score.updateValue(calculateSetbackArea(score.site, setbackLength));
//                    },
//                    onScoreAdded: function (event, score) {
//                        //Create the offset and add that property to the site
//                        updateSetbackFeature(score.site);

//                        //The framework will ask for a value update, so don't automatically do it here.
//                    }
//                }
//            },

//            intents: {
//                Area: function (geometry) { return calculateArea(geometry); },
//                OffsetArea: function (geometry, offset) { return calculateArea(geometry, offset); }

//            },

//            //Adds buttons to the toolbars
//            buttons: {
//                mainMapToolBar: { //The main toolbar across the top of the screen
//                    group: "attributes",
//                    activate: onButtonClicked,
//                    deactivate: null,
//                },
//                siteRightClick: { //The option list that displays when a right click action is performed on a site
//                    group: "attributes",
//                    activate: onButtonClicked
//                }
//            },

//            siteAttributes: { //Used to add attributes to the site. These will show up when a site is created or edited.
//                offset:{
//                    type: 'text',   //Set the type so the system knows how to display the input. (Possible types are text, checkbox, listbox, textarea)
//                    value: 30,      //The default value
//                    validationExpr:null, //the regular expression to use to check validity of the input
//                    validValues:{} //An array of possible values. Used in a listbox.
//                }
//            },


//            init: function () { },          //Called when the tool is loaded as a module.
//            destroy: function () { },       //Called when the tool needs to completely remove itself from the interface and object tree
//            activate: function () { },      //Called when the tool is checkmarked or activated by the system or user
//            deactivate: function () { }     //Called when the tool is unchecked or deactivated by the system or user

//        });
//    });

//    //All private functions and varables go here. They will be accessible only to this module because of the AEAF (Auto-Executing Anonomous Function)
//    var offsetFeature, setbackLength, setbackLayer;
//    setbackLength = 30; 

//    function calculateArea(geometry, offset) {

//        var proj = new OpenLayers.Projection('EPSG:900913');

//        var area = geometry.getGeodesicArea(proj);
//        var kmArea = area / 1000000;

//        return Math.round(kmArea * 100) / 100;
//    }

//    //Handles the button click for the buttons for this tool
//    function onButtonClicked(event) {
//    };



//    function updateSetbackFeature(site, setback) {
//        if (!$.isNumeric(setback)) {
//            setback = setbackLength;
//        }
//        var reader = new jsts.io.WKTReader();
//        var parser = new jsts.io.OpenLayersParser();

//        var input = parser.read(site.feature.geometry);
//        var buffer = input.buffer(-1*setback); //Inset the feature
//        var newGeometry = parser.write(buffer);

//        if (!setbackLayer) {
//            setbackLayer = new OpenLayers.Layer.Vector("Site Setback");
//            pvM.map.addLayer(setbackLayer);
//        }

//        if (site.offsetFeature) {
//            //Redraw the polygon
//            setbackLayer.removeFeatures(site.offsetFeature);
//            site.offsetFeature.geometry = newGeometry; //This probably wont work
//        } else {
//            var style = { fillColor: 'blue', fillOpacity: 0, strokeWidth: 3, strokeColor: "purple" };
//            site.offsetFeature = new OpenLayers.Feature.Vector(newGeometry, { parentFID: site.feature.fid }, style);
//        }
//        setbackLayer.addFeatures(site.offsetFeature);



//    };

//    function calculateSetbackArea(site) {
//        if (site.offsetFeature) {
//            return calculateArea(site.offsetFeature.geometry);
//        }

//        return 0;
//    }

//    function calculateSiteArea(site) {
//        //Use the geometry of the OpenLayers feature to get the area
//        var val = calculateArea(site.feature.geometry);

//        return val;
//    }

//})(pvMapper);
