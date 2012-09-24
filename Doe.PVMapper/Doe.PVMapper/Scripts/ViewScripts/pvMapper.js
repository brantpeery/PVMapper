// This is a globally defined object that represents the client-side behaviors available through the PVMapper framework.
console.log("Loading pvMapper object");

var pvMapper = {
    self: this,
    // This is exposed to allow extensions to interact with the map.
    map: null,
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
        return $.post("/api/ProjectSite", { name: name, description: description, isActive: true, polygonGeometry: polygonGeometry });
    },
    updateSite: function (siteId, name, description, polygonGeometry) {

        //Only send the stuff that was passed into this function.
        var data = { id: siteId, isActive: true };
        if (name) { data.name = name; }
        if (description) { data.description = description; }
        if (polygonGeometry) { data.polygonGeometry = polygonGeometry; }

        return $.ajax("/api/ProjectSite", {
            data: data,
            type: "POST",
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
    // should be passed a function that will be executed when all required scripts are fully loaded
    onReady: function (fn) {
        $("body").on("pvMapper-ready", fn)
    },
    getSiteLayer: function () {
        return this.siteLayer || "SiteLayer does not exist in the collection of layers on the map. Add a site or load sites first.";
    },

    //Used to set the site layer and attach all the events that are needed for site management 
    setSiteLayer: function(layer){
        this.siteLayer = layer;
        layer.events.register("featuremodified", function(object, element){
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
        this.tabs.setActiveTab(0);
    },

    //All the sites that are managed by pvMapper  
    siteManager: {
        siteAdded: new Event(),
        siteRemoved: new Event(),

        sites: [],
        getSites: function () {
            return this.sites;
        },
        getSite: function (index) {
            return this.sites[index];
        },
        addSite: function (site) {
            this.sites.push(site);
            this.siteAdded.fire(site, [{ site: site }, site]);
        },
        removeSite: function (site) {
        },

        //Handles the change event for the features on the sitelayer. Will fire the sites change event if the 
        //  feature that changed is a project site
        //@Parameter event {OpenLayers.Event object with a feature property that is a reference to the feature that changed
        //@See http://dev.openlayers.org/apidocs/files/OpenLayers/Layer/Vector-js.html#OpenLayers.Layer.Vector.events
        featureChangedHandler: function (event) {
            console.log("Feature change detected by the site manager");
            if (event.feature && event.feature.site) {
                try {
                    event.feature.site.changeEvent.fire(this, event);
                    console.log("Fired the change event for site: " + event.feature.site.name);
                } catch (e) {
                    console.log("An error occurred while trying to fire the feature change event for a site from the site manager");
                }
            }
        }
    }
};

console.log("pvMapper: " + pvMapper);