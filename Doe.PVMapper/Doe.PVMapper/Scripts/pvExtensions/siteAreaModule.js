/// <reference path="../pvMapper/Module.js" />
/// <reference path="../_references.js" />

//Tool that uses the pvMapper event pipeline to know when to update it's score. 
//Create the scoreline
//Attach to the sitechange event for the line
//When the sites changes, the updateSiteScore function will be called with the score object that needs updated and the context set to the scoreBoardLineItem that the tool manages
//Note that the tool will have access to the actual site.feature through the score object
//The updateSiteScore function will recalculate the site based on the geometry in the feature property of the site. 
//The updatedSiteScore function will then ask the line to update the score information that is displayed for the site
//ALTERNATE?? What if the above line happend automatically because the function fired a scoreUpdatedEvent(score) 
//If this were a complicated tool, then the tool would save the value to a database for later retrieval or cache it somehow. Howevever, 
//the tool can always recalculate the value quickly, so it will assume that the scoreboard is caching what is nessassary.
//As always, the scoreboard will be responsible for writing the values to it's own datastorage

(function (pvM) {
    pvM.onReady(function () {
        console.log("Loading in site area module");
        var me = new pvM.Module({
            id: "doe.siteAreaModule", //This will come in handy if we want to make these tools singletons
            author: "",
            version: "",

            nonScoringTools: {}, //Tools that are for user convenience. Things like measuring tools, information tools, drawing tools, ...
            scoringTools: { //These objects are turned into scoreLines. The tools use the site changed event to update the scores for all of the sites
                siteArea: {
                    title: "Site Gross Area",
                    description: "Calculates the gross area of the site in quare kilometers.",
                    onSiteChange: function (event, score) { //Fires when a score has been notified that it's site has changed
                        //Use the geometry of the OpenLayers feature to get the area
                        var val = calculateArea(score.site.feature.geometry);

                        //Update the score
                        score.updateValue(val); //Do it this way so the score can manage getting itself refreshed on the screen and in the DB

                        pvM.displayMessage("Recalulated the area.");
                    }
                },
                innerBoundry: {
                    title: "Site Net Area",
                    description: "Calculates the net area of the site subtracting the setback (sqkm).",
                    onSiteChange: function (event, score) { }
                }

            },

            intents: {
                Area: function (geometry) { return calculateArea(geometry); },
                OffsetArea: function (geometry, offset) { return calculateArea(geometry, offset); }

            },

            buttons: {
                mainMapToolBar: {
                    group: "attributes",
                    activate: onButtonClicked,
                    deactivate: null,
                },
                siteRightClick: {
                    group: "attributes",
                    activate: onButtonClicked
                }
            },


            init: function () { },          //Called when the tool is loaded as a module.
            destroy: function () { },       //Called when the tool needs to completely remove itself from the interface and object tree
            activate: function () { },      //Called when the tool is checkmarked or activated by the system or user
            deactivate: function () { }     //Called when the tool is unchecked or deactivated by the system or user

        });
    });

    //All private functions and varables go here. They will be accessible only to this module because of the AEAF (Auto-Executing Anonomous Function)
    var offsetFeature;

    function calculateArea(geometry, offset) {
        if ($.isNumeric(offset)) {
            var reader = new jsts.io.WKTReader();
            var parser = new jsts.io.OpenLayersParser();

            var input = reader.read(geometry);
            var buffer = input.buffer(offset);
            buffer = parser.write(buffer);

            //Redraw the polygon
            offsetFeature.geometry = buffer; //This probably wont work
        }

        var area = geometry.getGeodesicArea();
        var kmArea = area / 1000000;

        return Math.round(kmArea*100)/100;
    }

    //Handles the button click for the buttons for this tool
    function onButtonClicked(event) {
    };

})(pvMapper);
myclass = function(){
    var priv="Secret";
    this.setPriv = function(s){priv===s;};
}
