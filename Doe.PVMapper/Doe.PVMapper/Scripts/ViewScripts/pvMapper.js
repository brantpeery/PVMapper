// This is a globally defined object that represents the client-side behaviors available through the PVMapper framework.
console.log("Loading pvMapper object");
if ( typeof pvMapper == 'undefined' ) {
  this.pvMapper = {};
}

(function (pvM) {
    $.extend(pvM, { //Extend the existing pvMapper object
        self: this,
        
        // The developer needs to be able to add and remove buttons to a toolbar.
        mapToolbar: null,
        tabs: null,

        siteLayer: null,

        // todo: update to use secret and token.
        postScore: function (score, rank, siteId, toolId) {
            $.post("/api/SiteScore", { score: score, rank: rank, siteId: siteId, toolId: toolId },
               function (data) {
                   // refresh scoreboard.
                   Ext.getCmp('scoreboard-grid-id').store.load();
                   Ext.getCmp('scoreboard-grid-id').getView().refresh();
               });
        },
        getSite: function (siteId) {
            return $.get("/api/ProjectSite/" + siteId);
        },
        postSite: function (name, description, polygonGeometry) {
            return $.post("/api/ProjectSite", {
                name: name,
                description: description,
                isActive: true,
                polygonGeometry: polygonGeometry
            });
        },
        updateSite: function (siteId, name, description, polygonGeometry) {

            //Only send the stuff that was passed into this function.
            var data = {isActive: true};
            if (name) { data.name = name; }
            if (description !== null) { data.description = description; }
            if (polygonGeometry) { data.polygonGeometry = polygonGeometry; }

            return $.ajax("/api/ProjectSite/"+siteId, {
                data: data,
                type: "PUT",
                done: function () {
                    pvMapper.displayMessage("The site changes were saved", "info");
                },
                fail: function () {
                    pvMapper.displayMessage("Unable to save the changes to the site. There was an error communicating with the database.", "warning");
                }
            });
            pvMapper.displayMessage("The site has been updated.", "info");
        },
        //Deletes a site from the datastore
        deleteSite: function (siteId) {
            return $.ajax("/api/ProjectSite/" + siteId, {
                data: { Id: siteId }, type: "DELETE",
                done: function () {
                    pvMapper.displayMessage("The site was deleted from the database.", "help");
                },
                fail: function () {
                    pvMapper.displayMessage("Unable to delete the site. There was an error communicating with the database.", "warning");
                }
            });
        },

        getSiteLayer: function () {
            return this.siteLayer || "SiteLayer does not exist in the collection of layers on the map. Add a site or load sites first.";
        },

        //Used to set the site layer and attach all the events that are needed for site management 
        setSiteLayer: function (layer) {
            this.siteLayer = layer;
            layer.events.register("featuremodified", function (object, element) {
                if (object.feature && object.feature.site) {
                    object.feature.site.onFeatuerChanged(object);
                }
            });


        },

        getSelectedSite: function () {
            var sitesLayer = pvMapper.getSiteLayer();

            if (sitesLayer.selectedFeatures.length < 1) {
                $.jGrowl("Select the site you would like to work with.");
                return;
            } else {
                var features = sitesLayer.selectedFeatures;
                if (!features)
                    return;

                return features[0];
            }
        },

        //Used for displaying small messages to the user. Things like help tips or notifications. Best for 1 to 2 paragraph messages
        //The type parameter will simply be an additional class on the message box.
        displayMessage: function (msg, type) {
            $.jGrowl(msg, { theme: type, life: 7000 });
        },

        showMapTab: function () {
            //this.tabs.setActiveTab(0);
        }

    } ); //End the $.extend

    console.log("pvMapper: " + pvMapper);
} )(pvMapper );


