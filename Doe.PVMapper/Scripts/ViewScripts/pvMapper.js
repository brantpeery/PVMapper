// This is a globally defined object that represents the client-side behaviors available through the PVMapper framework.
var pvMapper = {
    self:this,
    // This is exposed to allow extensions to interact with the map.
    map: null,
    // The developer needs to be able to add and remove buttons to a toolbar.
    mapToolbar: null,
    tabs: null,

    // todo: update to use ToolId and secret and token.
    postScore: function (score, rank, siteId, ToolDescription) {
        $.post("/api/SiteScore", { score: score, rank: rank, siteId: siteId, ToolDescription: ToolDescription });
    },
    getSite: function (siteId) {
        return $.get("/api/ProjectSite/" + siteId);
    },
    postSite: function (userId, name, description, polygonGeometry) {
        return $.post("/api/ProjectSite", { userId: userId, name: name, description: description, isActive: true, polygonGeometry: polygonGeometry });
    },

    updateSite: function (siteId, userId, name, description, polygonGeometry) {
        return $.post("/api/ProjectSite", { id: siteId, value: { userId: userId, name: name, description: description, isActive: true, polygonGeometry: polygonGeometry } });
        pvMapper.displayMessage("The site has been updated.", "info");
    },


    //Deletes a site from the datastore
    deleteSite: function (siteId){
        return $.ajax("/api/ProjectSite/" + siteId, {
            data: { Id: siteId }, type: "DELETE",
            success: function () {
                pvMapper.displayMessage("The site was deleteded from the database.", "help");
            },
            error: function () {
                pvMapper.displayMessage("Unable to delete the site. There was an error communicating with the database.", "warning");
            }
        });
    },
    // should be passed a function that will be executed when all required scripts are fully loaded
    onReady: function (fn) {
        $("body").on("pvMapper-ready", fn)
    },
    getSiteLayer: function () {
        var i = pvMapper.map.layers.length;
        while (i--) {
            if (pvMapper.map.layers[i].id === "SiteLayer") {
                return pvMapper.map.layers[i];
            }
        }
              
        return "SiteLayer does not exist in the collection of layers on the map. Add a site or load sites first.";
    },

    //Used for displaying small messages to the user. Things like help tips or notifications. Best for 1 to 2 paragraph messages
    //The type parameter will simply be an additional class on the message box.
    displayMessage: function (msg, type) {
        $.jGrowl(msg, { theme: type, life:7000 });
    },

    showMapTab: function () {
        this.tabs.setActiveTab(0);
    }
};