﻿// This is a globally defined object that represents the client-side behaviors available through the PVMapper framework.
var pvMapper = {
    self:this,
    // This is exposed to allow extensions to interact with the map.
    map: null,
    // The developer needs to be able to add and remove buttons to a toolbar.
    mapToolbar: null,
    tabs: null,

    siteLayer: null,

    // todo: update to use secret and token.
    postScore: function (score, rank, siteId, toolId) {
        $.post("/api/SiteScore", { score: score, rank: rank, siteId: siteId, toolId: toolId });
    },
    getSite: function (siteId) {
        return $.get("/api/ProjectSite/" + siteId);
    },
    postSite: function (userId, name, description, polygonGeometry) {
        return $.post("/api/ProjectSite", { userId: userId, name: name, description: description, isActive: true, polygonGeometry: polygonGeometry });
    },

    updateSite: function (siteId, userId, name, description, polygonGeometry) {

        //Only send the stuff that was passed into this function.
        var data = { id: siteId, userId: userId, isActive: true };
        if (name) { data.name = name; }
        if (description) { data.description = description; }
        if (polygonGeometry) { data.polygonGeometry = polygonGeometry; }

        return $.ajax("/api/ProjectSite", { 
            data: data,
            type:"PUT",
            done: function(){
                pvMapper.displayMessage("The site changes were saved", "info");
            },
            fail: function(){
                pvMapper.displayMessage("Unable to save the changes to the site. There was an error communicating with the database.", "warning");
            }
        });
        pvMapper.displayMessage("The site has been updated.", "info");
    },

    //Deletes a site from the datastore
    deleteSite: function (siteId){
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

    //Used for displaying small messages to the user. Things like help tips or notifications. Best for 1 to 2 paragraph messages
    //The type parameter will simply be an additional class on the message box.
    displayMessage: function (msg, type) {
        $.jGrowl(msg, { theme: type, life:7000 });
    },

    showMapTab: function () {
        this.tabs.setActiveTab(0);
    }


};